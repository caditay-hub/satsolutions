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
 * фильтра по стране мало — вычитаем их из домашних цифр отдельно.
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

  const [totalsRes, homeRes, homeQueriesRes, queriesRes, pagesRes] = await Promise.all([
    query({ startDate: from, endDate: to }),
    query({ startDate: from, endDate: to, ...homeFilter }),
    query({ startDate: from, endDate: to, dimensions: ["query"], rowLimit: 25000, ...homeFilter }),
    query({ startDate: from, endDate: to, dimensions: ["query"], rowLimit: 25, orderBy: [{ field: "impressions", descending: true }] }),
    query({ startDate: from, endDate: to, dimensions: ["page"], rowLimit: 25 }),
  ]);

  return {
    range: { from, to },
    current: totals(totalsRes.rows),
    home: subtractJunk(totals(homeRes.rows), junkTotals(homeQueriesRes.rows)),
    homeJunk: (() => {
      const j = junkTotals(homeQueriesRes.rows);
      return { queries: j.queries, impressions: j.impressions };
    })(),
    topQueries: mapRows(queriesRes.rows),
    topPages: mapRows(pagesRes.rows),
  };
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
