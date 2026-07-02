// Источник: Google Ads API (отчёт по расходам/конверсиям за окно дат + WoW).
// Без googleapis — REST + fetch, как остальные источники монитора.
//
// ВАЖНО про авторизацию: в отличие от GSC/GA4 (там общий сервис-аккаунт),
// Google Ads API НЕ принимает сервис-аккаунт для обычного рекламного аккаунта.
// Нужен OAuth2 user-токен: client_id + client_secret + refresh_token
// (см. config.googleAdsOAuthFile → /root/.gads_oauth.json) и developer token
// (config.googleAdsDeveloperToken → /root/.gads_dev_token).
//
// Заголовки запроса:
//   Authorization: Bearer <access_token из refresh_token>
//   developer-token: <developer token из API-центра MCC>
//   login-customer-id: <ID управляющего аккаунта (MCC), только цифры>
// Customer в URL — обычный рекламный аккаунт (только цифры).
import { readFileSync, existsSync } from "node:fs";
import { config } from "../config.js";

// Версия Google Ads API. v21 подтверждена живым запросом (2026-06-30). Периодически
// устаревает — при ошибке "version ... is not supported / deprecated" поднять до текущей
// (см. developers.google.com/google-ads/api). Переопределяется env GOOGLE_ADS_API_VERSION.
const API_VERSION = process.env.GOOGLE_ADS_API_VERSION ?? "v21";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

export type GoogleAdsTotals = {
  impressions: number;
  clicks: number;
  cost: number;            // в валюте аккаунта (cost_micros / 1e6)
  conversions: number;
  conversionsValue: number;
  avgCpc: number;          // в валюте аккаунта
  ctr: number;             // доля (0..1)
  costPerConversion: number; // в валюте аккаунта
};

export type GoogleAdsReport = {
  range: { from: string; to: string };
  currency: string;
  current: GoogleAdsTotals;
  previous: GoogleAdsTotals;
};

type OAuthCreds = { client_id: string; client_secret: string; refresh_token: string };

let cachedToken: { token: string; expiresAt: number } | null = null;

function loadOAuthCreds(): OAuthCreds {
  // Сперва env (для гибкости), иначе JSON-файл в /root.
  const fromEnv =
    process.env.GOOGLE_ADS_CLIENT_ID &&
    process.env.GOOGLE_ADS_CLIENT_SECRET &&
    process.env.GOOGLE_ADS_REFRESH_TOKEN;
  if (fromEnv) {
    return {
      client_id: process.env.GOOGLE_ADS_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET!.trim(),
      refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN!.trim(),
    };
  }
  const file = config.googleAdsOAuthFile;
  if (!existsSync(file)) {
    throw new Error(`OAuth-креды Google Ads не заданы (нет ${file} и env GOOGLE_ADS_CLIENT_ID/SECRET/REFRESH_TOKEN)`);
  }
  const creds = JSON.parse(readFileSync(file, "utf8")) as OAuthCreds;
  if (!creds.client_id || !creds.client_secret || !creds.refresh_token) {
    throw new Error(`Неполные OAuth-креды Google Ads в ${file} (нужны client_id, client_secret, refresh_token)`);
  }
  return creds;
}

/** Обменять refresh_token на access_token (кэш на время жизни). */
async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.token;

  const c = loadOAuthCreds();
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: c.client_id,
      client_secret: c.client_secret,
      refresh_token: c.refresh_token,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Google Ads OAuth ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = { token: data.access_token, expiresAt: now + (data.expires_in ?? 3600) };
  return cachedToken.token;
}

/** Дата YYYY-MM-DD в UTC со сдвигом на daysAgo дней назад. */
function ymd(daysAgo: number): string {
  const d = new Date(Date.now() - daysAgo * 86400_000);
  return d.toISOString().slice(0, 10);
}

function digits(id: string): string {
  return id.replace(/\D/g, "");
}

/**
 * Универсальный searchStream-запрос (GAQL) — используется конфиг-аудитом (googleAdsConfig.ts).
 * Возвращает плоский список rows. При неодобренном токене бросает GADS_PENDING_APPROVAL
 * (вызывающий тихо пропускает блок), прочие ошибки — как есть.
 */
export async function gadsSearchRows(query: string): Promise<any[]> {
  const devToken = config.googleAdsDeveloperToken;
  if (!devToken) throw new Error("GOOGLE_ADS_DEV_TOKEN не задан (нет /root/.gads_dev_token)");
  const customerId = digits(config.googleAdsCustomerId);
  const loginCustomerId = digits(config.googleAdsLoginCustomerId);
  if (!customerId) throw new Error("GOOGLE_ADS_CUSTOMER_ID не задан");

  const token = await getAccessToken();
  const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}/googleAds:searchStream`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": devToken,
    "Content-Type": "application/json",
  };
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId;

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query }) });
  if (!res.ok) {
    const txt = await res.text();
    if (txt.includes("DEVELOPER_TOKEN_NOT_APPROVED")) throw new Error("GADS_PENDING_APPROVAL");
    throw new Error(`Google Ads ${res.status}: ${txt.slice(0, 300)}`);
  }
  const chunks = (await res.json()) as any[];
  return chunks.flatMap((c) => c.results ?? []);
}

const ZERO: GoogleAdsTotals = {
  impressions: 0, clicks: 0, cost: 0, conversions: 0,
  conversionsValue: 0, avgCpc: 0, ctr: 0, costPerConversion: 0,
};

/** Один запрос searchStream за диапазон дат → агрегированные метрики аккаунта. */
async function queryWindow(from: string, to: string): Promise<{ totals: GoogleAdsTotals; currency: string }> {
  const devToken = config.googleAdsDeveloperToken;
  if (!devToken) throw new Error("GOOGLE_ADS_DEV_TOKEN не задан (нет /root/.gads_dev_token)");
  const customerId = digits(config.googleAdsCustomerId);
  const loginCustomerId = digits(config.googleAdsLoginCustomerId);
  if (!customerId) throw new Error("GOOGLE_ADS_CUSTOMER_ID не задан");

  const token = await getAccessToken();
  // FROM customer без segments.date в SELECT → метрики агрегируются по окну.
  const query =
    `SELECT customer.currency_code, metrics.impressions, metrics.clicks, ` +
    `metrics.cost_micros, metrics.conversions, metrics.conversions_value, ` +
    `metrics.average_cpc, metrics.ctr, metrics.cost_per_conversion ` +
    `FROM customer WHERE segments.date BETWEEN '${from}' AND '${to}'`;

  const url = `https://googleads.googleapis.com/${API_VERSION}/customers/${customerId}/googleAds:searchStream`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "developer-token": devToken,
    "Content-Type": "application/json",
  };
  if (loginCustomerId) headers["login-customer-id"] = loginCustomerId;

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify({ query }) });
  if (!res.ok) {
    const txt = await res.text();
    // Заявка на Basic Access ещё не одобрена — не ошибка, а «пока не готово»:
    // пробрасываем маркер, чтобы fetchGoogleAdsReport тихо вернул null (блок просто не покажется).
    if (txt.includes("DEVELOPER_TOKEN_NOT_APPROVED")) throw new Error("GADS_PENDING_APPROVAL");
    throw new Error(`Google Ads ${res.status}: ${txt.slice(0, 300)}`);
  }

  // searchStream отдаёт JSON-массив чанков [{results:[...]}, ...].
  const chunks = (await res.json()) as any[];
  const rows = chunks.flatMap((c) => c.results ?? []);
  if (!rows.length) return { totals: { ...ZERO }, currency: "" };

  const r = rows[0];
  const m = r.metrics ?? {};
  const micros = (v: unknown) => Number(v ?? 0) / 1e6;
  const totals: GoogleAdsTotals = {
    impressions: Number(m.impressions ?? 0),
    clicks: Number(m.clicks ?? 0),
    cost: micros(m.costMicros),
    conversions: Number(m.conversions ?? 0),
    conversionsValue: Number(m.conversionsValue ?? 0),
    avgCpc: micros(m.averageCpc),
    ctr: Number(m.ctr ?? 0),
    costPerConversion: micros(m.costPerConversion),
  };
  return { totals, currency: r.customer?.currencyCode ?? "" };
}

/**
 * Отчёт Google Ads за последние windowDays и предыдущее окно той же длины (WoW).
 * lag=1 — вчерашний день последний полный (как в GA4-источнике).
 */
export async function fetchGoogleAdsReport(windowDays = 7): Promise<GoogleAdsReport | null> {
  const lag = 1;
  const curTo = ymd(lag);
  const curFrom = ymd(lag + windowDays - 1);
  const prevTo = ymd(lag + windowDays);
  const prevFrom = ymd(lag + windowDays * 2 - 1);

  try {
    // Последовательно (две лёгкие выборки; не нагружаем квоту параллелью).
    const cur = await queryWindow(curFrom, curTo);
    const prev = await queryWindow(prevFrom, prevTo);
    return {
      range: { from: curFrom, to: curTo },
      currency: cur.currency || prev.currency || "",
      current: cur.totals,
      previous: prev.totals,
    };
  } catch (e) {
    // Заявка на Basic Access ещё на рассмотрении — не шумим в отчёте, просто пропускаем блок.
    if ((e as Error).message === "GADS_PENDING_APPROVAL") {
      console.log("[gads] developer token ещё не одобрен (Basic Access) — блок Google Ads пропущен");
      return null;
    }
    throw e;
  }
}
