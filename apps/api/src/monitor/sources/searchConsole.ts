// Источник: Google Search Console (Search Analytics API).
// Тянем агрегаты и разрезы по запросам/страницам за окно дат, плюс отдельно
// за предыдущее окно — для сравнения «неделя к неделе».
import { getGoogleAccessToken } from "../googleAuth.js";
import { config } from "../config.js";

const API = "https://searchconsole.googleapis.com/webmasters/v3/sites";

export type GscTotals = { clicks: number; impressions: number; ctr: number; position: number };
/** Объём отсеянного мусора — чтобы видеть, если поток вдруг вырастет. */
export type GscJunk = { queries: number; impressions: number };
export type GscRow = { key: string; clicks: number; impressions: number; ctr: number; position: number };

export type GscReport = {
  range: { from: string; to: string };
  /** Итог по сайту ЗА ВЫЧЕТОМ мусорного потока (см. JUNK_QUERY). */
  current: GscTotals;
  /** Домашний рынок (Узбекистан) без зарубежных показов по артикулам и без мусора. */
  home: GscTotals;
  /** Сколько мусора отсеяно из домашних цифр. */
  homeJunk: GscJunk;
  topQueries: GscRow[];
  topPages: GscRow[];
};

/**
 * Фильтр «домашний рынок». Общие цифры GSC сильно шумят: английские карточки
 * товаров ловят показы по кодам моделей со всего мира (ОАЭ, Египет, Бангладеш…)
 * с нулевым CTR — это не наша аудитория, но она валит средний CTR вниз.
 * Разрез по Узбекистану показывает реальное положение дел (проверено 07.09.2026:
 * общий CTR 2,53% против 3,99% по Узбекистану).
 */
const HOME_COUNTRY = "uzb";

/**
 * Мусорные запросы вида «ai12345» — ботовый поток, тысячи показов с нулём кликов.
 * Сидят и внутри узбекского сегмента (07.09.2026: 3098 показов из 6539), поэтому
 * фильтра по стране мало — вычитаем их из цифр отдельно.
 *
 * Разбор 08.09.2026: строго `ai` + РОВНО 5 цифр, 2487 уникальных запросов за 180 дней,
 * 0 кликов за всё время, растёт втрое в месяц (июн 3,3% показов → авг-сен 30,8%).
 * Причина внешняя (не наш контент — проверено), заблокировать нечем, только вычитать.
 *
 * ⚠️ Соблазн отфильтровать на стороне API (`operator: "excludingRegex"`) — ЛОВУШКА:
 * любой фильтр по dimension `query` выбрасывает ещё и анонимизированные строки.
 * Замер 08.09: итог без фильтра 91 930 показов, с excludingRegex — 26 625, то есть
 * «отсеклось» 65 305 вместо ожидаемых ~6 000. Поэтому итоги берём БЕЗ фильтра
 * и вычитаем измеренный мусор.
 */
const JUNK_QUERY = /^ai\d{4,6}$/i;

/** Сумма мусорных запросов в срезе по запросам. */
function junkTotals(rows: any[] | undefined): { clicks: number; impressions: number; queries: number } {
  let clicks = 0, impressions = 0, queries = 0;
  for (const r of rows ?? []) {
    if (!JUNK_QUERY.test(r.keys?.[0] ?? "")) continue;
    clicks += r.clicks ?? 0;
    impressions += r.impressions ?? 0;
    queries++;
  }
  return { clicks, impressions, queries };
}

/**
 * Домашние цифры за вычетом мусора. Срез по запросам не отдаёт анонимизированные
 * запросы, поэтому вычитаем измеренный мусор из полного итога по стране —
 * так итог остаётся полным, а нулевые показы уходят.
 * Средняя позиция не корректируется (её из срезов не пересчитать).
 */
function subtractJunk(total: GscTotals, junk: { clicks: number; impressions: number }): GscTotals {
  const impressions = Math.max(0, total.impressions - junk.impressions);
  const clicks = Math.max(0, total.clicks - junk.clicks);
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position: total.position };
}
const homeFilter = {
  dimensionFilterGroups: [
    { filters: [{ dimension: "country", operator: "equals", expression: HOME_COUNTRY }] },
  ],
};

/** YYYY-MM-DD для смещения на N дней назад от сегодня (UTC). */
function daysAgo(n: number): string {
  const d = new Date(Date.now() - n * 86400_000);
  return d.toISOString().slice(0, 10);
}

async function query(body: unknown): Promise<{ rows?: any[] }> {
  const token = await getGoogleAccessToken();
  const url = `${API}/${encodeURIComponent(config.gscProperty)}/searchAnalytics/query`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GSC ${res.status}: ${await res.text()}`);
  return (await res.json()) as { rows?: any[] };
}

function totals(rows: any[] | undefined): GscTotals {
  const r = rows?.[0];
  return {
    clicks: r?.clicks ?? 0,
    impressions: r?.impressions ?? 0,
    ctr: r?.ctr ?? 0,
    position: r?.position ?? 0,
  };
}

function mapRows(rows: any[] | undefined): GscRow[] {
  return (rows ?? []).map((r) => ({
    key: r.keys?.[0] ?? "",
    clicks: r.clicks ?? 0,
    impressions: r.impressions ?? 0,
    ctr: r.ctr ?? 0,
    position: r.position ?? 0,
  }));
}

/**
 * Отчёт GSC за окно [from, to]. lagDays сдвигает окно в прошлое (GSC отдаёт
 * данные с задержкой ~2-3 дня, поэтому окно «последние 7 дней» начинаем с -3).
 */
export async function fetchGscReport(windowDays = 7, lagDays = 3): Promise<GscReport> {
  const to = daysAgo(lagDays);
  const from = daysAgo(lagDays + windowDays - 1);

  const [totalsRes, homeRes, homeQueriesRes, allQueriesRes, pageQueryRes] = await Promise.all([
    query({ startDate: from, endDate: to }),
    query({ startDate: from, endDate: to, ...homeFilter }),
    query({ startDate: from, endDate: to, dimensions: ["query"], rowLimit: 25000, ...homeFilter }),
    // Полный срез по запросам: из него и мусор считаем, и топ строим — отдельный
    // вызов с rowLimit 25 не нужен, а мусор из топа теперь вычищается.
    query({ startDate: from, endDate: to, dimensions: ["query"], rowLimit: 25000 }),
    // Топ страниц собираем из среза запрос×страница: иначе показы мусорных запросов
    // поднимают в топ страницы, у которых живого спроса нет вовсе
    // (08.09.2026: /en/products/pro-swich-ai-poe-9-2 — 1898 показов и НИ ОДНОГО живого запроса).
    query({ startDate: from, endDate: to, dimensions: ["page", "query"], rowLimit: 25000 }),
  ]);

  const allJunk = junkTotals(allQueriesRes.rows);
  const homeJunkT = junkTotals(homeQueriesRes.rows);

  return {
    range: { from, to },
    current: subtractJunk(totals(totalsRes.rows), allJunk),
    home: subtractJunk(totals(homeRes.rows), homeJunkT),
    homeJunk: { queries: homeJunkT.queries, impressions: homeJunkT.impressions },
    topQueries: mapRows(cleanQueries(allQueriesRes.rows))
      .sort((a, b) => b.impressions - a.impressions)
      .slice(0, 25),
    topPages: topPagesWithoutJunk(pageQueryRes.rows),
  };
}

/** Строки среза по запросам без ботового потока. */
function cleanQueries(rows: any[] | undefined): any[] {
  return (rows ?? []).filter((r) => !JUNK_QUERY.test(r.keys?.[0] ?? ""));
}

/**
 * Топ страниц по живым показам: складываем срез запрос×страница, выбросив мусор.
 * Позиция — средняя по показам, иначе редкие запросы с позицией 1 перекашивают итог.
 */
function topPagesWithoutJunk(rows: any[] | undefined, limit = 25): GscRow[] {
  const acc = new Map<string, { clicks: number; impressions: number; posSum: number }>();
  for (const r of rows ?? []) {
    const [page, q] = r.keys ?? [];
    if (!page || JUNK_QUERY.test(q ?? "")) continue;
    const a = acc.get(page) ?? { clicks: 0, impressions: 0, posSum: 0 };
    a.clicks += r.clicks ?? 0;
    a.impressions += r.impressions ?? 0;
    a.posSum += (r.position ?? 0) * (r.impressions ?? 0);
    acc.set(page, a);
  }
  return [...acc.entries()]
    .map(([key, a]) => ({
      key,
      clicks: a.clicks,
      impressions: a.impressions,
      ctr: a.impressions ? a.clicks / a.impressions : 0,
      position: a.impressions ? a.posSum / a.impressions : 0,
    }))
    .sort((x, y) => y.impressions - x.impressions)
    .slice(0, limit);
}

/** Те же агрегаты за предыдущее окно той же длины — для дельты WoW. */
export async function fetchGscTotalsForPrevWindow(
  windowDays = 7,
  lagDays = 3,
): Promise<{ all: GscTotals; home: GscTotals }> {
  const to = daysAgo(lagDays + windowDays);
  const from = daysAgo(lagDays + windowDays * 2 - 1);
  const [allRes, homeRes, homeQueriesRes] = await Promise.all([
    query({ startDate: from, endDate: to }),
    query({ startDate: from, endDate: to, ...homeFilter }),
    query({ startDate: from, endDate: to, dimensions: ["query"], rowLimit: 25000, ...homeFilter }),
  ]);
  return {
    all: totals(allRes.rows),
    home: subtractJunk(totals(homeRes.rows), junkTotals(homeQueriesRes.rows)),
  };
}

/**
 * «Быстрые победы»: запросы со средней позицией 5–15 и заметными показами —
 * почти на 1-й странице, дожать контентом/ссылками = быстрый рост кликов.
 */
export function quickWins(rep: GscReport, minImpressions = 50): GscRow[] {
  return rep.topQueries
    .filter((q) => q.position >= 5 && q.position <= 15 && q.impressions >= minImpressions)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
}
