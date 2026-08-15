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

const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

/**
 * Собрать адреса страниц. /sitemap.xml — это sitemapindex: его <loc> ведут на
 * дочерние карты, а не на страницы. Без раскрытия индекса в IndexNow улетали
 * пять адресов самих карт, и ни одна новая страница о себе не сообщала.
 */
async function collectUrls(): Promise<string[]> {
  const root = await (await fetch(SITEMAP)).text();
  const top = locs(root);
  if (!/<sitemapindex/i.test(root)) return top;

  const out: string[] = [];
  for (const child of top) {
    // ходим по внутреннему порту: наружу тот же контент, но без лишнего хопа
    const local = child.replace(/^https?:\/\/[^/]+/, "http://localhost:3000");
    try {
      out.push(...locs(await (await fetch(local)).text()));
    } catch (e) {
      console.error(`[indexnow] не прочитал ${child}: ${(e as Error).message}`);
    }
  }
  return out;
}

async function main() {
  const urls = await collectUrls();
  if (!urls.length) throw new Error("sitemap пуст");

  const file = join(config.dataDir, "indexnow-sent.json");
  let prev: string[] = [];
  try { if (existsSync(file)) prev = JSON.parse(readFileSync(file, "utf8")).urls || []; } catch {}
  const prevSet = new Set(prev);
  const fresh = urls.filter((u) => !prevSet.has(u));

  // Раньше состояние хранило адреса карт, а не страниц: если бы мы просто сочли
  // всё «новым», первый же прогон отправил бы тысячи URL разом. Поэтому базу
  // фиксируем молча, а диффы шлём со следующего раза.
  if (prev.length && prev.every((u) => /\/sitemap[\w-]*\.xml$/.test(u))) {
    mkdirSync(config.dataDir, { recursive: true });
    writeFileSync(file, JSON.stringify({ ts: new Date().toISOString(), urls }, null, 1));
    console.log(`[indexnow] база пересобрана по страницам (${urls.length} URL), отправка со следующего прогона`);
    return;
  }

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
