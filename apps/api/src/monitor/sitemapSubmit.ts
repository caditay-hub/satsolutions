// Переотправка sitemap в Google Search Console (требует права «Владелец» у сервис-аккаунта,
// выдано 03.07.2026). Дёргается в конце деплоя (/root/deploy-satweb.sh) — Google быстрее
// перечитывает карту после релизов с новыми URL. Запуск: npx tsx src/monitor/sitemapSubmit.ts
import { getGoogleAccessToken } from "./googleAuth.js";

async function main() {
  const SITE = encodeURIComponent("https://satsolutions.uz/");
  const FEED = encodeURIComponent("https://satsolutions.uz/sitemap.xml");
  const token = await getGoogleAccessToken();
  const r = await fetch(`https://www.googleapis.com/webmasters/v3/sites/${SITE}/sitemaps/${FEED}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(`[sitemap-submit] HTTP ${r.status} ${r.status === 200 || r.status === 204 ? "OK" : await r.text()}`);
}
main().catch((e) => { console.error("[sitemap-submit]", e.message); process.exit(1); });
