// Источник: Google Search Console (Search Analytics API).
// Тянем агрегаты и разрезы по запросам/страницам за окно дат, плюс отдельно
// за предыдущее окно — для сравнения «неделя к неделе».
import { getGoogleAccessToken } from "../googleAuth.js";
import { config } from "../config.js";

const API = "https://searchconsole.googleapis.com/webmasters/v3/sites";

export type GscTotals = { clicks: number; impressions: number; ctr: number; position: number };
export type GscRow = { key: string; clicks: number; impressions: number; ctr: number; position: number };

export type GscReport = {
  range: { from: string; to: string };
  current: GscTotals;
  topQueries: GscRow[];
  topPages: GscRow[];
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

  const [totalsRes, queriesRes, pagesRes] = await Promise.all([
    query({ startDate: from, endDate: to }),
    query({ startDate: from, endDate: to, dimensions: ["query"], rowLimit: 25, orderBy: [{ field: "impressions", descending: true }] }),
    query({ startDate: from, endDate: to, dimensions: ["page"], rowLimit: 25 }),
  ]);

  return {
    range: { from, to },
    current: totals(totalsRes.rows),
    topQueries: mapRows(queriesRes.rows),
    topPages: mapRows(pagesRes.rows),
  };
}

/** Те же агрегаты за предыдущее окно той же длины — для дельты WoW. */
export async function fetchGscTotalsForPrevWindow(windowDays = 7, lagDays = 3): Promise<GscTotals> {
  const to = daysAgo(lagDays + windowDays);
  const from = daysAgo(lagDays + windowDays * 2 - 1);
  const res = await query({ startDate: from, endDate: to });
  return totals(res.rows);
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
