// Аутентификация в Google API через сервис-аккаунт — без googleapis.
// Подписываем RS256-JWT (jsonwebtoken уже в зависимостях) и меняем его на
// access token (server-to-server, grant_type=jwt-bearer). Один токен покрывает
// и Search Console, и GA4 (scopes перечисляются через пробел).
import { readFileSync } from "node:fs";
import jwt from "jsonwebtoken";
import { config } from "./config.js";

type ServiceAccount = { client_email: string; private_key: string };

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = [
  // Search Console: полный (не readonly) — нужен для переотправки sitemap (sitemapSubmit.ts,
  // SA = «Владелец» с 03.07.2026); чтение (отчёты/URL Inspection) он включает.
  "https://www.googleapis.com/auth/webmasters",
  "https://www.googleapis.com/auth/analytics.readonly", // GA4 Data API (чтение)
].join(" ");

let cached: { token: string; expiresAt: number } | null = null;

function loadServiceAccount(): ServiceAccount {
  const raw = readFileSync(config.googleSaKeyFile, "utf8");
  const sa = JSON.parse(raw) as ServiceAccount;
  if (!sa.client_email || !sa.private_key) {
    throw new Error(`Некорректный ключ сервис-аккаунта: ${config.googleSaKeyFile}`);
  }
  return sa;
}

/** Получить (и закэшировать на время жизни) access token для Google API. */
export async function getGoogleAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cached && cached.expiresAt - 60 > now) return cached.token;

  const sa = loadServiceAccount();
  const assertion = jwt.sign(
    {
      iss: sa.client_email,
      scope: SCOPES,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    },
    sa.private_key,
    { algorithm: "RS256" },
  );

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!res.ok) {
    throw new Error(`OAuth token error ${res.status}: ${await res.text()}`);
  }
  const data = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: data.access_token, expiresAt: now + data.expires_in };
  return data.access_token;
}
