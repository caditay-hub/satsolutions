// Индекс локализованного поиска товаров.
// Названия товаров в БД — на русском. Узбекские/английские/tr/zh названия живут
// в apps/web/src/data/productI18n.json (ключ = id товара). Чтобы поиск находил
// товар по его локализованному имени (напр. узб. «abonent terminali»), грузим
// этот файл в память и отдаём id товаров, чей локализованный текст содержит запрос.
//
// Источник правды — тот же JSON, что поддерживает команда (см. правило i18n при
// изменении товара). Файл деплоится вместе с web на тот же сервер. Если файла нет
// или он битый — деградируем тихо (поиск остаётся по RU-полям, без падений).
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
// из apps/api/{src,dist}/lib → apps/web/src/data/productI18n.json
const I18N_PATH =
  process.env.PRODUCT_I18N_PATH || join(here, "../../../web/src/data/productI18n.json");

const RELOAD_TTL_MS = 5 * 60 * 1000; // подхватывать обновления файла без рестарта API
const LOCALES = ["uz", "en", "tr", "zh"] as const;

let index: Map<string, string> = new Map(); // id → нормализованный локализованный текст
let loadedMtimeMs = 0;
let lastCheck = 0;
let warned = false;

function norm(s: string): string {
  return s.toLowerCase().normalize("NFKC").replace(/\s+/g, " ").trim();
}

function build(raw: Record<string, any>): Map<string, string> {
  const m = new Map<string, string>();
  for (const [id, perLocale] of Object.entries(raw)) {
    const parts: string[] = [];
    for (const loc of LOCALES) {
      const v = perLocale?.[loc];
      if (!v) continue;
      // имя и короткое описание дают хороший баланс полноты/точности (без длинного description)
      if (v.name) parts.push(String(v.name));
      if (v.shortDescription) parts.push(String(v.shortDescription));
    }
    if (parts.length) m.set(id, norm(parts.join("  ")));
  }
  return m;
}

/** Лениво (пере)загрузить индекс, если файл изменился. Никогда не бросает. */
function ensureLoaded(): void {
  const now = Date.now();
  if (index.size && now - lastCheck < RELOAD_TTL_MS) return;
  lastCheck = now;
  try {
    const mtime = statSync(I18N_PATH).mtimeMs;
    if (index.size && mtime === loadedMtimeMs) return; // не менялся
    const raw = JSON.parse(readFileSync(I18N_PATH, "utf8"));
    index = build(raw);
    loadedMtimeMs = mtime;
    warned = false;
    console.log(`[i18n-search] индекс загружен: ${index.size} товаров из ${I18N_PATH}`);
  } catch (e) {
    if (!warned) {
      console.warn(`[i18n-search] не удалось загрузить ${I18N_PATH}: ${(e as Error).message} — поиск только по RU`);
      warned = true;
    }
  }
}

/** id товаров, чьё локализованное имя/описание содержит запрос. */
export function matchI18nProductIds(q: string, limit = 50): string[] {
  ensureLoaded();
  const needle = norm(q);
  if (!needle || needle.length < 2 || !index.size) return [];
  const out: string[] = [];
  for (const [id, text] of index) {
    if (text.includes(needle)) {
      out.push(id);
      if (out.length >= limit) break;
    }
  }
  return out;
}
