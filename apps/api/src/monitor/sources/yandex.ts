// Яндекс: Метрика (визиты/источники) + Вебмастер (страницы в поиске, ИКС, топ-запросы).
// OAuth-токен: /root/.yandex_token (scopes metrika:read, metrika:write, webmaster:verify,
// приложение «SAT Monitor» в аккаунте cadi.tay). Значение токена никуда не выводим.
import { readFileSync, existsSync } from "node:fs";

const TOKEN_FILE = process.env.YANDEX_TOKEN_FILE ?? "/root/.yandex_token";
const METRIKA_COUNTER = process.env.YANDEX_METRIKA_COUNTER ?? "98915892";
const WEBMASTER_HOST = process.env.YANDEX_WEBMASTER_HOST ?? "https:satsolutions.uz:443";

export type YandexReport = {
  metrika: { visits: number; users: number; sources: { source: string; visits: number }[] } | null;
  webmaster: {
    sqi: number | null; // ИКС
    searchablePages: number | null; // страниц в поиске
    excludedPages: number | null;
    queries: { query: string; shows: number; clicks: number }[]; // топ-запросы за неделю
  } | null;
};

export function yandexReady(): boolean {
  return existsSync(TOKEN_FILE);
}

function token(): string {
  return readFileSync(TOKEN_FILE, "utf8").trim();
}

async function yfetch(url: string): Promise<any> {
  const r = await fetch(url, {
    headers: { Authorization: `OAuth ${token()}` },
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) throw new Error(`Yandex API ${r.status}: ${(await r.text()).slice(0, 150)}`);
  return r.json();
}

async function fetchMetrika(): Promise<YandexReport["metrika"]> {
  const base = "https://api-metrika.yandex.net/stat/v1/data";
  const d = await yfetch(`${base}?ids=${METRIKA_COUNTER}&metrics=ym:s:visits,ym:s:users&dimensions=ym:s:trafficSource&date1=7daysAgo&date2=today&limit=10`);
  const totals = d.totals ?? [0, 0];
  const sources = (d.data ?? []).map((row: any) => ({
    source: row.dimensions?.[0]?.name ?? "?",
    visits: Math.round(row.metrics?.[0] ?? 0),
  }));
  return { visits: Math.round(totals[0]), users: Math.round(totals[1]), sources };
}

async function fetchWebmaster(): Promise<YandexReport["webmaster"]> {
  const api = "https://api.webmaster.yandex.net/v4";
  const { user_id } = await yfetch(`${api}/user`);
  const hosts = await yfetch(`${api}/user/${user_id}/hosts`);
  const host = (hosts.hosts ?? []).find((h: any) => h.host_id === WEBMASTER_HOST) ?? (hosts.hosts ?? [])[0];
  if (!host) throw new Error("host не найден в Вебмастере");
  const hostId = host.host_id;

  const summary = await yfetch(`${api}/user/${user_id}/hosts/${hostId}/summary`);

  const to = new Date();
  const from = new Date(Date.now() - 7 * 864e5);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  let queries: { query: string; shows: number; clicks: number }[] = [];
  try {
    const q = await yfetch(
      `${api}/user/${user_id}/hosts/${hostId}/search-queries/popular?order_by=TOTAL_SHOWS&query_indicator=TOTAL_SHOWS&query_indicator=TOTAL_CLICKS&date_from=${fmt(from)}&date_to=${fmt(to)}&limit=10`
    );
    queries = (q.queries ?? []).map((it: any) => ({
      query: it.query_text,
      shows: it.indicators?.TOTAL_SHOWS ?? 0,
      clicks: it.indicators?.TOTAL_CLICKS ?? 0,
    }));
  } catch { /* запросов может ещё не быть — не валим отчёт */ }

  return {
    sqi: summary.sqi ?? null,
    searchablePages: summary.searchable_pages_count ?? null,
    excludedPages: summary.excluded_pages_count ?? null,
    queries,
  };
}

export async function fetchYandexReport(): Promise<YandexReport> {
  const [metrika, webmaster] = await Promise.allSettled([fetchMetrika(), fetchWebmaster()]);
  return {
    metrika: metrika.status === "fulfilled" ? metrika.value : null,
    webmaster: webmaster.status === "fulfilled" ? webmaster.value : null,
  };
}
