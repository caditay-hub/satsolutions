// Синонимы поиска по сайту: одно понятие — много написаний.
//
// Зачем. Товары ищутся подстрокой по имени и коду модели (ILIKE), а покупатель называет
// вещь по-своему. Нательная камера Hikvision DS-MCW406 в базе — «Нательный видеорегистратор…»,
// и до 13.10.2026 поиск по «бодикамера», «боди камера», «нательная камера» её не находил,
// а «нагрудный видеорегистратор» уходил в ИИ-подбор и выдавал сетевые регистраторы.
//
// Как работает. Запрос разбирается на понятия: найденная фраза-синоним вырезается из запроса
// и заменяется группой «любой из вариантов» (OR). Остальные слова запроса для такого понятия
// не обязательны — они только поднимают ранг: «бодикамера для охраны купить» должна показать
// камеру, хотя слов «охрана» и «купить» в её названии нет.
//
// Как добавить понятие: объект SearchConcept (варианты для имени товара и для текста кейсов
// и услуг) + правила-регэкспы написаний в RULES. Регэкспы получают строку в нижнем регистре
// после NFKC и замены «ё» на «е».
import { flipLayout } from "./kbLayout.js";

export type SearchConcept = {
  id: string;
  /** Подстроки в имени или коде модели товара (ILIKE %v%), достаточно любой одной. */
  product: string[];
  /** Подстроки в тексте кейсов портфолио и услуг, достаточно любой одной. */
  text: string[];
};

const BODYCAM: SearchConcept = {
  id: "bodycam",
  // «ds-mcw» — серия нательных камер Hikvision в коде модели (DS-MCW406/64G/GPS/WIFI)
  product: ["нательн", "нагрудн", "бодикамер", "боди-камер", "боди камер", "bodycam", "body cam", "body-worn", "ds-mcw"],
  text: ["бодикамер", "боди-камер", "боди камер", "нательн", "нагрудн", "bodikamer", "bodycam", "body cam", "body-worn"],
};

const LB = "(?<![\\p{L}\\p{N}])"; // начало слова: \b в JS кириллицу не понимает
const TAIL = "[^\\s,;/]*"; // хвост слова — окончания и части через дефис
const CAM_RU = `(?:видео)?(?:камер|регистратор)${TAIL}`;

const RULES: Array<{ concept: SearchConcept; re: RegExp }> = [
  // нательная камера, нагрудный видеорегистратор; одно слово «нательный» тоже понятие
  { concept: BODYCAM, re: new RegExp(`${LB}(?:нательн|нагрудн)${TAIL}(?:\\s+${CAM_RU})?`, "gu") },
  // носимая камера, носимый/персональный видеорегистратор — только вместе с «камерой»
  { concept: BODYCAM, re: new RegExp(`${LB}(?:носим|персональн)${TAIL}\\s+${CAM_RU}`, "gu") },
  // бодикамера, боди-камера, боди камера, bodikamera, bodi kamera, body camera, bodycam, body камера
  { concept: BODYCAM, re: new RegExp(`${LB}(?:боди|bod[iy])[\\s-]*(?:кам|kam|cam)${TAIL}`, "gu") },
  // body-worn camera
  { concept: BODYCAM, re: new RegExp(`${LB}body[\\s-]*worn${TAIL}(?:\\s+(?:camera|video|kamera)${TAIL})?`, "gu") },
  // узб.: tanaga taqiladigan kamera / videoregistrator
  { concept: BODYCAM, re: new RegExp(`${LB}tanaga\\s+taqil${TAIL}(?:\\s+(?:video)?(?:kamera|registrator|videoregistrator)${TAIL})?`, "gu") },
  // тур.: yaka kamerası, vücut kamerası, beden kamerası, giyilebilir kamera
  { concept: BODYCAM, re: new RegExp(`${LB}(?:yaka|v[uü]cut|beden|giyilebilir)\\s+kamera${TAIL}`, "gu") },
  // кит.: 执法记录仪 и др. (пробелов нет — без границы слова)
  { concept: BODYCAM, re: /执法记录仪|执法仪|随身摄像机|随身记录仪|穿戴式摄像机|穿戴式记录仪/gu },
];

export type QueryAnalysis = {
  /** Найденные понятия (без повторов). */
  concepts: SearchConcept[];
  /** Запрос без фраз-синонимов: необязательные слова, только для ранга. */
  rest: string;
};

export function normalizeQuery(s: string): string {
  return s.toLowerCase().normalize("NFKC").replace(/ё/g, "е").replace(/\s+/g, " ").trim();
}

function analyzeOnce(raw: string): QueryAnalysis {
  let s = normalizeQuery(raw);
  const found = new Map<string, SearchConcept>();
  for (const { concept, re } of RULES) {
    s = s.replace(re, () => {
      found.set(concept.id, concept);
      return " ";
    });
  }
  return { concepts: Array.from(found.values()), rest: s.replace(/\s+/g, " ").trim() };
}

/**
 * Разбор запроса на понятия. Если в самом запросе понятий нет — пробуем его же в другой
 * раскладке клавиатуры («,jlbrfvthf» = «бодикамера»). null — понятий нет, ищем как раньше.
 */
export function analyzeSearchQuery(raw: string, opts: { flip?: boolean } = {}): QueryAnalysis | null {
  const a = analyzeOnce(raw);
  if (a.concepts.length) return a;
  if (opts.flip === false) return null;
  const f = flipLayout(raw);
  if (!f) return null;
  const b = analyzeOnce(f);
  return b.concepts.length ? b : null;
}

/**
 * Варианты для имени/кода модели товара по всем понятиям запроса (пусто — понятий нет).
 * flip: false — без попытки другой раскладки (нужно, чтобы понять, нашлось ли по оригиналу).
 */
export function conceptProductVariants(raw: string, opts: { flip?: boolean } = {}): string[] {
  const a = analyzeSearchQuery(raw, opts);
  if (!a) return [];
  return Array.from(new Set(a.concepts.flatMap((c) => c.product)));
}
