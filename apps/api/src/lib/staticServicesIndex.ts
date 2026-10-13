// Статические услуги /solutions/<key> в поиске кейсов и решений (/search-cases, /search-suggest).
//
// Тексты услуг живут в вебе — apps/web/messages/<locale>.json, раздел services.<key>
// (title, desc, intro, works) на пяти языках. В таблице БД `services` их нет: там лежат
// только две старые записи-редиректа. Поэтому до 13.10.2026 поиск решений не находил ни одну
// из 45 страниц услуг и отраслей — по «бодикамера» выдавался кейс, но не услуга /solutions/bodycam.
//
// Файлы читаем так же, как productI18nIndex читает productI18n.json: web и API лежат в одном
// репозитории на одном сервере. Нет файлов — тихо деградируем (решения ищутся только в БД).
import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { uploadsDir } from "../paths.js";
import type { QueryAnalysis } from "./searchSynonyms.js";
import { normalizeQuery } from "./searchSynonyms.js";

const here = dirname(fileURLToPath(import.meta.url));
// из apps/api/{src,dist}/lib → apps/web/messages
const MESSAGES_DIR = process.env.WEB_MESSAGES_DIR || join(here, "../../../web/messages");
const LOCALES = ["ru", "uz", "en", "tr", "zh"] as const;
type Locale = (typeof LOCALES)[number];
const RELOAD_TTL_MS = 5 * 60 * 1000;

type LocText = { title: string; excerpt: string };
type Entry = {
  key: string;
  loc: Partial<Record<Locale, LocText>>;
  /** слова названий на всех языках (нормализованные, без апострофов) */
  titleWords: string[];
  /** названия на всех языках одной строкой */
  titleText: string;
  /** название + описание + вступление + состав работ на всех языках */
  fullText: string;
  coverImageUrl: string | null;
};

let entries: Entry[] = [];
let loadedMtime = 0;
let lastCheck = 0;
let warned = false;

// узбекские oʻ/gʻ пишут и через ʻ, и через ', и вовсе без знака — сравниваем без него
const clean = (s: string) => normalizeQuery(s).replace(/[ʻʼ'`‘’]/g, "");
const words = (s: string) => clean(s).split(/[^\p{L}\p{N}]+/u).filter(Boolean);
// «Wi-Fi», «IP-телефония»: составное слово через дефис учитываем ещё и слитно («wifi»).
// Без этого запросы «wifi» и «wi-fi» не находили услугу: в «wi-fi» обе части короче 3 букв.
const HYPHENATED = /[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)+/gu;
const hyphenated = (s: string) => clean(s).match(HYPHENATED) ?? [];

function build(): Entry[] {
  const perLoc: Partial<Record<Locale, Record<string, any>>> = {};
  for (const loc of LOCALES) {
    try {
      const raw = JSON.parse(readFileSync(join(MESSAGES_DIR, `${loc}.json`), "utf8"));
      if (raw?.services && typeof raw.services === "object") perLoc[loc] = raw.services;
    } catch {
      /* язык без файла — пропускаем */
    }
  }
  const ru = perLoc.ru ?? {};
  const out: Entry[] = [];
  for (const key of Object.keys(ru)) {
    if (!/^[a-z0-9-]+$/.test(key)) continue;
    const loc: Partial<Record<Locale, LocText>> = {};
    const titles: string[] = [];
    const texts: string[] = [];
    for (const l of LOCALES) {
      const s = perLoc[l]?.[key];
      if (!s || typeof s.title !== "string" || !s.title.trim()) continue;
      const excerpt = typeof s.desc === "string" ? s.desc : typeof s.intro === "string" ? s.intro : "";
      loc[l] = { title: s.title.trim(), excerpt: excerpt.trim() };
      titles.push(s.title);
      texts.push(s.title, s.desc ?? "", s.intro ?? "", Array.isArray(s.works) ? s.works.join(" ") : "");
    }
    if (!loc.ru) continue; // у страницы услуги обязателен русский оригинал
    let cover: string | null = null;
    try {
      if (existsSync(join(uploadsDir, "services-page", `${key}.jpg`))) cover = `/uploads/services-page/${key}.jpg`;
    } catch {
      cover = null;
    }
    out.push({
      key,
      loc,
      titleWords: Array.from(
        new Set(titles.flatMap((t) => [...words(t), ...hyphenated(t).map((w) => w.replace(/-/g, ""))])),
      ),
      titleText: clean(titles.join("  ")),
      fullText: clean(texts.join("  ")),
      coverImageUrl: cover,
    });
  }
  return out;
}

// Самая свежая дата изменения из пяти файлов: правка одного uz.json тоже должна подхватиться.
function messagesMtime(): number {
  let m = 0;
  for (const l of LOCALES) {
    try {
      m = Math.max(m, statSync(join(MESSAGES_DIR, `${l}.json`)).mtimeMs);
    } catch {
      /* нет файла языка */
    }
  }
  if (!m) throw new Error("нет ни одного файла <locale>.json");
  return m;
}

function ensureLoaded(): void {
  const now = Date.now();
  // Файлы проверяем не чаще раза в RELOAD_TTL_MS, удалась прошлая загрузка или нет
  // (иначе при пустом списке услуг пять JSON перечитывались бы на каждый запрос поиска).
  if (lastCheck && now - lastCheck < RELOAD_TTL_MS) return;
  lastCheck = now;
  try {
    const mtime = messagesMtime();
    if (mtime === loadedMtime) return;
    entries = build();
    loadedMtime = mtime;
    warned = false;
  } catch (e) {
    if (!warned) {
      console.warn(`[static-services] не прочитал ${MESSAGES_DIR}: ${(e as Error).message} — решения только из БД`);
      warned = true;
    }
  }
}

// Слова, которые есть почти у любой услуги или не говорят о направлении. Одни они услугу
// не подбирают («монтаж», «камера» — это запросы про товары и всё подряд), но и не обязаны
// быть в названии: «установка видеонаблюдения» должна найти «Видеонаблюдение».
// Первая группа — начала слов, вторая — слова целиком (иначе «под» съел бы «подъезд»).
const OPTIONAL =
  /^(?:установ|монтаж|систем|услуг|ташкент|узбекистан|стоимост|сколько|купит|заказ|настро|подключ|камер|kamer|camer|ornat|xizmat|narx|toshkent|tizim|install|setup|service|price|system|tashkent|kurulum|fiyat|hizmet|sistem|taşkent|taskent)|^(?:под|ключ|для|цена|цены|ценой|uchun|for|the|and)$/;

// Лёгкий стемминг русских окончаний — тот же, что у поиска кейсов (smartSearch.stemRu)
function stem(t: string): string {
  if (t.length < 6 || !/[а-я]/.test(t)) return t;
  return t.replace(/(ами|ями|ого|его|ому|ему|ыми|ими|ах|ях|ам|ям|ов|ев|ой|ей|ый|ий|ая|яя|ое|ее|ые|ие|ом|ем|у|ю|а|я|ы|и|е|о)$/, "");
}

export type StaticServiceHit = {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  kind: "solution";
  /** переводы для карточки на других языках (веб берёт свой язык — lib/serviceCaseI18n.ts) */
  loc: Partial<Record<Locale, LocText>>;
};

/**
 * Услуги по запросу. С понятием (бодикамера и т.п.) — любой вариант понятия в тексте услуги,
 * выше те, у кого он в названии. Без понятия — все значимые слова запроса должны начинать
 * слова названия (на любом из пяти языков).
 */
export function searchStaticServices(
  q: string,
  analysis: QueryAnalysis | null,
  limit: number,
  locale?: string,
): StaticServiceHit[] {
  ensureLoaded();
  if (!entries.length || limit <= 0) return [];
  const scored: Array<{ e: Entry; score: number }> = [];

  if (analysis && analysis.concepts.length) {
    const groups = analysis.concepts.map((c) => c.text.map(clean));
    for (const e of entries) {
      let score = 0;
      for (const vs of groups) {
        if (vs.some((v) => e.titleText.includes(v))) score += 3;
        else if (vs.some((v) => e.fullText.includes(v))) score += 1;
        else { score = 0; break; }
      }
      if (score > 0) scored.push({ e, score });
    }
  } else {
    // слитную форму составного слова добавляем, только если его часть короче 3 букв и иначе
    // выпала бы («wi-fi» → «wifi»); «апарт-отель» ищется по частям, как раньше
    const joined = hyphenated(q)
      .filter((w) => w.split("-").some((p) => p.length < 3))
      .map((w) => w.replace(/-/g, ""));
    const toks = Array.from(new Set([...words(q), ...joined].map(stem))).filter((t) => t.length >= 3).slice(0, 8);
    const required = toks.filter((t) => !OPTIONAL.test(t));
    const optional = toks.filter((t) => OPTIONAL.test(t));
    if (!required.length) return [];
    const has = (e: Entry, t: string) => e.titleWords.some((w) => w.startsWith(t));
    for (const e of entries) {
      if (!required.every((t) => has(e, t))) continue;
      scored.push({ e, score: 2 + optional.filter((t) => has(e, t)).length });
    }
  }

  const loc = (LOCALES as readonly string[]).includes(locale ?? "") ? (locale as Locale) : "ru";
  return scored
    .sort((a, b) => b.score - a.score || a.e.key.localeCompare(b.e.key))
    .slice(0, limit)
    .map(({ e }) => {
      const t = e.loc[loc] ?? e.loc.ru!;
      return {
        title: t.title,
        slug: e.key,
        excerpt: t.excerpt || null,
        coverImageUrl: e.coverImageUrl,
        kind: "solution" as const,
        loc: e.loc,
      };
    });
}
