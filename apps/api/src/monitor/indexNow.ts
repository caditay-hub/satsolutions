// IndexNow: мгновенное уведомление Bing и Яндекса о новых И ИЗМЕНЁННЫХ URL.
// Google протокол не поддерживает — для него остаётся sitemap-переотправка (sitemapSubmit.ts).
// Ключ: /public/<KEY>.txt (+ nginx alias) — поисковик проверяет владение сайтом по этому файлу.
// Запуск: npx tsx src/monitor/indexNow.ts (вызывается из scripts/deploy.sh после деплоя).
//
// ЧТО ИСПРАВЛЕНО 10.09.2026. Прежняя версия сравнивала только СПИСОК адресов и слала
// исключительно новые. Правки существующих страниц — тексты, цены, лонгриды в БД —
// не уходили никуда, и Bing Webmaster выставил рекомендацию «Some important pages
// weren't submitted via IndexNow» со степенью High. Теперь состояние хранит пару
// «адрес → lastmod», и отправляются и новые адреса, и те, у кого сменилась дата.
//
// Отправляем в ДВА эндпоинта. По протоколу участники делятся сабмитами между собой,
// но кабинет Bing засчитывает свои — а Яндекс нужен нам напрямую ради Вебмастера.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config.js";

const KEY = "7f21529e192eaadfbf56c168e250f686";
const HOST = "satsolutions.uz";
const SITEMAP = "http://localhost:3000/sitemap.xml";
const ENDPOINTS = ["https://www.bing.com/indexnow", "https://yandex.com/indexnow"];
const CHUNK = 100; // размер пачки: больше Bing отбивает (см. комментарий у submit)

const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

/** Пары «адрес → lastmod» из одной карты. lastmod может отсутствовать — тогда пустая строка. */
function entries(xml: string): Array<[string, string]> {
  const out: Array<[string, string]> = [];
  for (const m of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const block = m[1];
    const loc = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
    if (!loc) continue;
    out.push([loc, /<lastmod>([^<]+)<\/lastmod>/.exec(block)?.[1] ?? ""]);
  }
  return out;
}

/**
 * Собрать адреса страниц с датами правки. /sitemap.xml — это sitemapindex: его <loc>
 * ведут на дочерние карты, а не на страницы. Без раскрытия индекса в IndexNow улетали
 * пять адресов самих карт, и ни одна новая страница о себе не сообщала.
 */
async function collectUrls(): Promise<Record<string, string>> {
  const root = await (await fetch(SITEMAP)).text();
  const map: Record<string, string> = {};
  if (!/<sitemapindex/i.test(root)) {
    for (const [u, lm] of entries(root)) map[u] = lm;
    return map;
  }
  for (const child of locs(root)) {
    // ходим по внутреннему порту: наружу тот же контент, но без лишнего хопа
    const local = child.replace(/^https?:\/\/[^/]+/, "http://localhost:3000");
    try {
      for (const [u, lm] of entries(await (await fetch(local)).text())) map[u] = lm;
    } catch (e) {
      console.error(`[indexnow] не прочитал ${child}: ${(e as Error).message}`);
    }
  }
  return map;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Шлём частями по 100 адресов. Bing отбивает крупные пачки: проверено 10.09.2026 —
 * 750 URL одним запросом дают HTTP 403, те же 750 по сотне проходят полностью.
 * Яндекс принимает и пачкой, но дробим одинаково, чтобы поведение было одно.
 */
async function submit(urls: string[]): Promise<boolean> {
  let ok = false;
  for (const endpoint of ENDPOINTS) {
    const host = new URL(endpoint).host;
    let sent = 0, failed = 0;
    for (let i = 0; i < urls.length; i += CHUNK) {
      const batch = urls.slice(i, i + CHUNK);
      try {
        const r = await fetch(endpoint, {
          method: "POST",
          headers: { "content-type": "application/json; charset=utf-8" },
          body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: batch }),
          signal: AbortSignal.timeout(30000),
        });
        // 200/202 = принято
        if (r.status === 200 || r.status === 202) { sent += batch.length; ok = true; }
        else { failed += batch.length; console.error(`[indexnow] ${host}: пачка ${i + 1}–${i + batch.length} → HTTP ${r.status}`); }
      } catch (e) {
        failed += batch.length;
        console.error(`[indexnow] ${host}: ${(e as Error).message}`);
      }
      if (i + CHUNK < urls.length) await sleep(1500);
    }
    console.log(`[indexnow] ${host}: принято ${sent}${failed ? `, отбито ${failed}` : ""}`);
  }
  return ok;
}

async function main() {
  const now = await collectUrls();
  const urls = Object.keys(now);
  if (!urls.length) throw new Error("sitemap пуст");

  const file = join(config.dataDir, "indexnow-sent.json");
  let prev: Record<string, string> = {};
  let legacy = false;
  try {
    if (existsSync(file)) {
      const saved = JSON.parse(readFileSync(file, "utf8"));
      if (saved.marks && typeof saved.marks === "object") {
        prev = saved.marks;
      } else if (Array.isArray(saved.urls)) {
        // старый формат — только список адресов, дат в нём не было
        legacy = true;
        for (const u of saved.urls) prev[u] = "";
      }
    }
  } catch {}

  const save = () => {
    mkdirSync(config.dataDir, { recursive: true });
    writeFileSync(file, JSON.stringify({ ts: new Date().toISOString(), marks: now }, null, 1));
  };

  // Переход со старого формата: даты правок нам ещё не с чем сравнивать, поэтому
  // шлём только по-настоящему новые адреса, а базу дат фиксируем на будущее.
  // Иначе первый же прогон отправил бы тысячи URL разом.
  const isNew = (u: string) => !(u in prev);
  const isChanged = (u: string) => !legacy && u in prev && now[u] !== prev[u] && !!now[u];
  const fresh = urls.filter((u) => isNew(u) || isChanged(u));

  if (legacy) {
    const onlyNew = urls.filter(isNew);
    if (onlyNew.length) {
      if (await submit(onlyNew.slice(0, 10000))) save(); else return;
    } else {
      save();
    }
    console.log(`[indexnow] база переведена на пары «адрес → дата правки» (${urls.length} URL)`);
    return;
  }

  if (!fresh.length) { console.log("[indexnow] новых и изменённых URL нет — пропуск"); return; }
  const added = fresh.filter(isNew).length;
  console.log(`[indexnow] к отправке ${fresh.length}: новых ${added}, изменённых ${fresh.length - added}`);
  // квота протокола: до 10 000 URL за запрос
  if (await submit(fresh.slice(0, 10000))) save();
}

main().catch((e) => { console.error("[indexnow]", e.message ?? e); process.exit(1); });
