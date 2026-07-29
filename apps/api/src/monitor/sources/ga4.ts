// Источник: Google Analytics 4 (Data API v1beta, runReport).
// Метрики трафика/конверсий за окно дат + разрез по каналам привлечения.
import { getGoogleAccessToken } from "../googleAuth.js";
import { config } from "../config.js";

const API = "https://analyticsdata.googleapis.com/v1beta";

export type Ga4Totals = {
  sessions: number;
  activeUsers: number;
  conversions: number;
  engagementRate: number;
};
export type Ga4ChannelRow = { channel: string; sessions: number; conversions: number };

export type Ga4Report = {
  range: { from: string; to: string };
  current: Ga4Totals;
  previous: Ga4Totals;
  channels: Ga4ChannelRow[];
};

async function runReport(body: unknown): Promise<any> {
  if (!config.ga4PropertyId) throw new Error("GA4_PROPERTY_ID не задан");
  const token = await getGoogleAccessToken();
  const res = await fetch(`${API}/properties/${config.ga4PropertyId}:runReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GA4 ${res.status}: ${await res.text()}`);
  return res.json();
}

const METRICS = [
  { name: "sessions" },
  { name: "activeUsers" },
  { name: "conversions" },
  { name: "engagementRate" },
];

/**
 * Отчёт GA4 за последние windowDays и за предыдущее окно той же длины
 * (GA4 поддерживает несколько dateRanges в одном запросе → одна дельта-выборка).
 */
export async function fetchGa4Report(windowDays = 7): Promise<Ga4Report> {
  const lag = 1; // вчерашний день — последний полный
  const curTo = `${lag}daysAgo`;
  const curFrom = `${lag + windowDays - 1}daysAgo`;
  const prevTo = `${lag + windowDays}daysAgo`;
  const prevFrom = `${lag + windowDays * 2 - 1}daysAgo`;

  const [totalsReport, channelsReport] = await Promise.all([
    runReport({
      dateRanges: [
        { startDate: curFrom, endDate: curTo, name: "current" },
        { startDate: prevFrom, endDate: prevTo, name: "previous" },
      ],
      metrics: METRICS,
    }),
    runReport({
      dateRanges: [{ startDate: curFrom, endDate: curTo }],
      dimensions: [{ name: "sessionDefaultChannelGroup" }],
      metrics: [{ name: "sessions" }, { name: "conversions" }],
      orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
      limit: 12,
    }),
  ]);

  // В отчёте с двумя dateRanges строки помечены dateRange. При ИМЕНОВАННЫХ диапазонах GA4
  // возвращает имя ("current"/"previous"), а не "date_range_N", и порядок строк НЕ гарантирован —
  // матчим по имени (fallback на авто-имена). Старый поиск только "date_range_0" промахивался и
  // брал rows[0], где лежал previous → отчёты меняли местами текущую и прошлую неделю.
  const rows: any[] = totalsReport.rows ?? [];
  const rangeName = (r: any) => r.dimensionValues?.[0]?.value;
  const curRow = rows.find((r) => ["current", "date_range_0"].includes(rangeName(r))) ?? rows[0];
  const prevRow = rows.find((r) => ["previous", "date_range_1"].includes(rangeName(r))) ?? rows[1];
  const pick = (row: any): Ga4Totals => {
    const v = (i: number) => Number(row?.metricValues?.[i]?.value ?? 0);
    return { sessions: v(0), activeUsers: v(1), conversions: v(2), engagementRate: v(3) };
  };

  const channels: Ga4ChannelRow[] = (channelsReport.rows ?? []).map((r: any) => ({
    channel: r.dimensionValues?.[0]?.value ?? "(other)",
    sessions: Number(r.metricValues?.[0]?.value ?? 0),
    conversions: Number(r.metricValues?.[1]?.value ?? 0),
  }));

  return {
    range: { from: curFrom, to: curTo },
    current: pick(curRow),
    previous: pick(prevRow),
    channels,
  };
}
