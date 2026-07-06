// IndexNow: мгновенное уведомление Яндекса (и Bing) о новых/изменённых URL.
// Google протокол не поддерживает — для него остаётся sitemap-переотправка (sitemapSubmit.ts).
// Ключ: /public/<KEY>.txt (+ nginx alias) — поисковик проверяет владение сайтом по этому файлу.
// Логика: берём все URL из sitemap, шлём ДИФФ против прошлого прогона (первый раз — всё).
// Запуск: npx tsx src/monitor/indexNow.ts (вызывается из /root/deploy-satweb.sh после деплоя).
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config.js";

const KEY = "7f21529e192eaadfbf56c168e250f686";
const HOST = "satsolutions.uz";
const SITEMAP = "http://localhost:3000/sitemap.xml";
const ENDPOINT = "https://yandex.com/indexnow"; // Яндекс шарит сабмиты с другими участниками IndexNow (Bing и др.)

async function main() {
  const xml = await (await fetch(SITEMAP)).text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!urls.length) throw new Error("sitemap пуст");

  const file = join(config.dataDir, "indexnow-sent.json");
  let prev: string[] = [];
  try { if (existsSync(file)) prev = JSON.parse(readFileSync(file, "utf8")).urls || []; } catch {}
  const prevSet = new Set(prev);
  const fresh = urls.filter((u) => !prevSet.has(u));

  if (!fresh.length) { console.log("[indexnow] новых URL нет — пропуск"); return; }
  // квота протокола: до 10 000 URL за запрос
  const batch = fresh.slice(0, 10000);
  const r = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host: HOST, key: KEY, urlList: batch }),
    signal: AbortSignal.timeout(30000),
  });
  // 200/202 = принято
  console.log(`[indexnow] отправлено ${batch.length} URL → HTTP ${r.status}`);
  if (r.status === 200 || r.status === 202) {
    mkdirSync(config.dataDir, { recursive: true });
    writeFileSync(file, JSON.stringify({ ts: new Date().toISOString(), urls }, null, 1));
  }
}

main().catch((e) => { console.error("[indexnow]", e.message ?? e); process.exit(1); });
