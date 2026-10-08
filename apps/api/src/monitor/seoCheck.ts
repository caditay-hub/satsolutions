// seo:check — SEO-проверка живого сайта (ТЗ BD/BE/BF/BG, 08.10.2026). Только чтение.
//
// Режимы:
//   quick    — после каждого деплоя (~1–2 мин): защищённые URL (seo-critical-urls.json),
//              маршруты-эталоны, старые адреса → ожидаемый редирект, sitemap и robots.txt.
//   standard — вручную: все страницы, разделы и статьи из sitemap + выборка карточек (~10 мин).
//   full     — раз в неделю по cron: все URL из sitemap (~18 тыс., около часа).
//
// Запуск на сервере (быстро и без лимитов nginx — через локальный 127.0.0.1 с SNI):
//   npx tsx src/monitor/seoCheck.ts --mode=quick --local [--notify=deploy|always|never]
// С рабочей машины: `npm run seo:check` (уходит по ssh на сервер), см. корневой package.json.
// Обновить список защищённых URL из Search Console:
//   npx tsx src/monitor/seoCheck.ts --refresh-critical --local
//
// Код выхода: 1 — есть CRITICAL, 2 — сама проверка упала, 0 — иначе.
//
// ⚠️ Темп ≤ ~6 запросов/с: лимит nginx для одного адреса 10 r/s (burst 150) и отвечает 429 —
// при большем темпе проверка ловит собственные 429 (замечено 07.10.2026).
import https from "node:https";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "./config.js";
import { sendTelegram } from "./telegram.js";

type Sev = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
type Issue = { sev: Sev; code: string; url: string; detail?: string };
type Resp = { s: number | string; loc: string; xr: string; body: string };

const HERE = dirname(fileURLToPath(import.meta.url));
const CRITICAL_FILE = join(HERE, "seo-critical-urls.json");
const HOST = "satsolutions.uz";
const ORIGIN = `https://${HOST}`;
const LOCALES = ["ru", "uz", "en", "tr", "zh"];
const SEVS: Sev[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, v] = a.replace(/^--/, "").split("="); return [k, v ?? "1"]; }));
const MODE = (args.mode ?? "quick") as "quick" | "standard" | "full";
const LOCAL = args.local === "1";
const NOTIFY = (args.notify ?? "never") as "deploy" | "always" | "never";
const SAMPLE = Number(args.sample ?? 600);

// ── HTTP ─────────────────────────────────────────────────────────────────────
function get(path: string): Promise<Resp> {
  return new Promise((res) => {
    let p: string; try { p = encodeURI(decodeURI(path)); } catch { p = encodeURI(path); }
    const req = https.request({
      host: LOCAL ? "127.0.0.1" : HOST, port: 443, servername: HOST, path: p, method: "GET", rejectUnauthorized: !LOCAL,
      headers: { Host: HOST, "User-Agent": "Mozilla/5.0 (compatible; SAT-seo-check/1.0)", "Accept-Encoding": "identity" }, timeout: 40000,
    }, (r) => {
      const ch: Buffer[] = []; r.on("data", (c) => ch.push(c));
      r.on("end", () => res({ s: r.statusCode ?? 0, loc: String(r.headers.location ?? ""), xr: String(r.headers["x-robots-tag"] ?? ""), body: Buffer.concat(ch).toString("utf8") }));
    });
    req.on("timeout", () => { req.destroy(); res({ s: "TIMEOUT", loc: "", xr: "", body: "" }); });
    req.on("error", (e: any) => res({ s: "ERR " + e.code, loc: "", xr: "", body: "" }));
    req.end();
  });
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
/** Пул из 2 потоков с паузой 250 мс — ~5–6 запросов/с, ниже лимита nginx. */
async function pool<T>(items: T[], fn: (x: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: 2 }, async () => { while (i < items.length) { await fn(items[i++]); await sleep(250); } }));
}
const rel = (u: string) => u.replace(ORIGIN, "") || "/";
const dec = (s: string) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const locOf = (path: string) => (path.match(/^\/(uz|en|tr|zh)(?=\/|$|\?)/) || [, "ru"])[1] as string;
const isStatus = (s: Resp["s"], lo: number, hi: number) => typeof s === "number" && s >= lo && s < hi;

// ── Эталоны (BF) ─────────────────────────────────────────────────────────────
const ROUTES = [
  "/", "/uz", "/en", "/tr", "/zh", "/products", "/products/type/ip-kamery", "/catalog/hikvision",
  "/catalog/hikvision/ip-kamery", "/products/hik-ds-7764ni-m4", "/solutions", "/solutions/cctv",
  "/portfolio", "/contact", "/blog", "/blog/skolko-stoit-skud",
];
/** Старый адрес → ожидаемая цель: ровно один переход, финал 200. */
const LEGACY: [string, string][] = [
  ["/products?type=IP-камеры", "/products/type/ip-kamery"],
  ["/products?type=IP-камеры&page=2", "/products/type/ip-kamery?page=2"],
  ["/product/show/kamera-videonabliudeniia-hikvision-ds-2cd1023g2-liuf1745300794", "/products"],
  ["/catalog/avigilon", "/catalog/hikvision"],
  ["/catalog/avigilon/ip-kamery", "/products/type/ip-kamery"],
  ["/products/avigilon-ava-bullet", "/catalog/hikvision"],
  ["/products/type/hdcvi-kamery", "/products/type/analogovye-kamery"],
  ["/products/type/umnye-zamki", "/products/type/zamki-i-skud"],
  ["/categories/hikvision", "/catalog/hikvision"],
  ["/page/garantiia-na-tovary", "/returns"],
  ["/solutions/umniy-avtobus", "/solutions/bus"],
  ["/solutions/umniy-avtobus/sledovanie-po-marshrutu", "/solutions/bus"],
  ["/solutions/videonablyudenie", "/solutions/cctv"],
  ["/contacts", "/contact"],
  ["/uz/support", "/uz/contact"],
];

// ── Анализ одной страницы ────────────────────────────────────────────────────
type Page = { path: string; loc: string; title: string; desc: string; links: string[] };
function analyze(path: string, r: Resp, add: (sev: Sev, code: string, url: string, detail?: string) => void, opts: { inSitemap: boolean; critical: boolean }): Page | null {
  const crit = (sev: Sev): Sev => (opts.critical ? "CRITICAL" : sev); // защищённый URL: любая поломка — CRITICAL (BG)
  if (!isStatus(r.s, 200, 400)) {
    const fatal = !isStatus(r.s, 400, 500);
    add(opts.critical || fatal ? "CRITICAL" : "HIGH", fatal ? "status-5xx" : "status-4xx", path, String(r.s));
    return null;
  }
  if (isStatus(r.s, 300, 400)) { add(crit("HIGH"), opts.inSitemap ? "sitemap-redirect" : "redirect", path, "→ " + rel(r.loc)); return null; }
  const h = r.body; const head = h.slice(0, 250000); const loc = locOf(path);
  const title = dec((head.match(/<title[^>]*>([^<]*)<\/title>/) || [, ""])[1]!.trim());
  const desc = dec((head.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1]!.trim());
  const robots = ((head.match(/<meta name="robots" content="([^"]*)"/) || [, ""])[1] + " " + r.xr).toLowerCase();
  const canon = (head.match(/<link rel="canonical" href="([^"]*)"/) || [, ""])[1]!;
  const lang = (h.match(/<html[^>]*\blang="([^"]+)"/) || [, ""])[1]!;
  const hl = [...head.matchAll(/<link rel="alternate" hrefLang="([^"]+)"/gi)].map((m) => m[1].toLowerCase());
  const h1 = (h.match(/<h1[\s>]/g) || []).length;

  if (!title) add("CRITICAL", "title-missing", path); else if (title.length > 70) add("LOW", "title-long", path, `${title.length} зн.`);
  if (!desc) add(crit("HIGH"), "description-missing", path); else if (desc.length > 170) add("LOW", "description-long", path, `${desc.length} зн.`);
  if (robots.includes("noindex") && (opts.inSitemap || opts.critical)) add(crit("HIGH"), "noindex-indexable", path);
  if (!canon) add(crit("HIGH"), "canonical-missing", path);
  else {
    const c = rel(canon).replace(/\/$/, "") || "/"; const me = path.replace(/\/$/, "") || "/";
    if (c !== me && !path.includes("?")) add(crit("HIGH"), "canonical-not-self", path, "→ " + canon);
  }
  const miss = [...LOCALES, "x-default"].filter((l) => !hl.includes(l));
  if (miss.length) add("MEDIUM", "hreflang-incomplete", path, "нет: " + miss.join(","));
  if (lang && lang.slice(0, 2) !== loc) add("HIGH", "html-lang-mismatch", path, lang);
  if (h1 === 0) add(crit("HIGH"), "h1-missing", path); else if (h1 > 1) add("MEDIUM", "h1-multiple", path, String(h1));
  const lv = [...h.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]); let prev = 1;
  for (const l of lv) { if (l > prev + 1) { add("LOW", "heading-skip", path, `h${prev}→h${l}`); break; } prev = l; }

  // JSON-LD
  let product: any = null; const types: string[] = [];
  for (const m of h.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const walk = (o: any) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === "object") { if (o["@type"]) types.push(String(o["@type"])); if (o["@graph"]) walk(o["@graph"]); if (o["@type"] === "Product") product = o; } };
      walk(JSON.parse(m[1]));
    } catch (e: any) { add("HIGH", "jsonld-invalid", path, String(e.message).slice(0, 80)); }
  }
  const isProduct = /^(\/(uz|en|tr|zh))?\/products\/(?!type\/|group\/|new$)[^/?]+$/.test(path);
  if (isProduct) {
    // Без цены разметку Product не выводим намеренно (offers обязателен, письмо GSC 29.08.2026)
    const onRequest = /Цена по запросу|Price on request|Narxi? soʻrov boʻyicha|Fiyat talep üzerine|价格面议/i.test(head);
    if (!product && !onRequest) add("HIGH", "product-schema-missing", path);
    if (!product && onRequest) add("LOW", "product-no-price", path);
    if (product) {
      const offers = ([] as any[]).concat(product.offers || []);
      const price = offers.map((o) => +o.price || +(o.priceSpecification?.price ?? 0) || 0)[0] ?? 0;
      if (offers.length && !(price > 0)) add("CRITICAL", "product-zero-price", path);
      if (!product.sku && !product.mpn) add("LOW", "product-no-sku", path);
      if (price > 0) {
        const vis = h.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]+>/g, " ").replace(/[\s  ]/g, "");
        if (!vis.includes(String(Math.round(price)))) add("MEDIUM", "product-price-mismatch", path, "в разметке " + price);
      }
    }
  }
  // Product на листинге — ошибка; комплект /kits — сам продаётся как товар, это норма
  if (types.includes("Product") && !isProduct && !/\/kits\//.test(path)) add("HIGH", "product-schema-on-listing", path);
  // img без атрибута alt вовсе (alt="" у декоративных, напр. пиксель Метрики, — норма)
  const noAlt = [...h.matchAll(/<img\b[^>]*>/g)].filter((m) => !/\balt=/.test(m[0])).length;
  if (noAlt) add("LOW", "img-no-alt-attr", path, String(noAlt));
  // пустой индексируемый раздел каталога
  const listing = /^(\/(uz|en|tr|zh))?\/(products\/(type|group)\/[^/?]+|catalog\/[^/?]+(\/[^/?]+)?)$/.test(path);
  if (listing && !robots.includes("noindex")) {
    const cards = new Set([...h.matchAll(/href="(?:\/(?:uz|en|tr|zh))?\/products\/([a-z0-9][^"?#/]*)"/g)].map((m) => m[1]).filter((s) => !["type", "group", "new"].includes(s)));
    if (cards.size === 0) add(crit("HIGH"), "empty-listing-indexable", path);
  }
  const bare = path.split("?")[0];
  if (/[A-Z]/.test(bare) || /\/\//.test(bare) || /[^\x00-\x7f]/.test(bare) || (bare.length > 1 && bare.endsWith("/"))) add("MEDIUM", "url-shape", path);
  const links = [...new Set([...h.matchAll(/<a\b[^>]*href="(\/[^"#]*)"/g)].map((m) => dec(m[1])))];
  return { path, loc, title, desc, links };
}

// ── Список защищённых URL (BG) ───────────────────────────────────────────────
async function refreshCritical() {
  const { getGoogleAccessToken } = await import("./googleAuth.js");
  const token = await getGoogleAccessToken();
  const end = new Date(Date.now() - 3 * 864e5).toISOString().slice(0, 10);
  const start = new Date(Date.now() - 93 * 864e5).toISOString().slice(0, 10);
  const rows: any[] = [];
  for (let startRow = 0; startRow < 25000; startRow += 5000) {
    const r = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(config.gscProperty)}/searchAnalytics/query`, {
      method: "POST", headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ startDate: start, endDate: end, dimensions: ["page"], rowLimit: 5000, startRow, dimensionFilterGroups: [{ filters: [{ dimension: "country", operator: "equals", expression: "uzb" }] }] }),
    });
    const d: any = await r.json(); const part = d.rows || []; rows.push(...part); if (part.length < 5000) break;
  }
  const fromGsc = rows.filter((r) => r.clicks >= 2 || r.impressions >= 100).map((r) => ({ url: rel(r.keys[0]), clicks: r.clicks, imp: r.impressions }));
  // Коммерческие хабы: главные, услуги, группы и бренды из карты сайта (русская версия)
  const pages = [...(await get("/sitemap-pages.xml")).body.matchAll(/<loc>([^<]+)<\/loc>/g), ...(await get("/sitemap-catalog.xml")).body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => rel(m[1]));
  const hubs = pages.filter((p) => /^\/(uz|en|tr|zh)?$|^\/(products|catalog|solutions|blog|contact|portfolio)$|^\/solutions\/[^/]+$|^\/products\/group\/[^/]+$|^\/catalog\/[^/]+$/.test(p) && !/^\/(uz|en|tr|zh)\/./.test(p));
  const cand = [...new Map([...fromGsc.map((x) => [x.url, x] as const), ...hubs.map((u) => [u, { url: u, clicks: 0, imp: 0 }] as const)]).values()].filter((x) => !x.url.includes("?") && !x.url.includes("#"));
  // В список берём только то, что СЕЙЧАС живо и индексируемо: снятое/перенаправленное
  // не «защищаем», а показываем, что выпало.
  const keep: typeof cand = []; const dropped: string[] = [];
  await pool(cand, async (x) => {
    const r = await get(x.url);
    const ok = r.s === 200 && !/noindex/i.test((r.body.match(/<meta name="robots" content="([^"]*)"/) || [, ""])[1] + r.xr);
    (ok ? keep : dropped).push(ok ? x : (x.url + " (" + r.s + (r.loc ? " → " + rel(r.loc) : "") + ")") as any);
  });
  keep.sort((a, b) => b.clicks - a.clicks || b.imp - a.imp || a.url.localeCompare(b.url));
  writeFileSync(CRITICAL_FILE, JSON.stringify({ updated: new Date().toISOString().slice(0, 10), rule: "UZ за 90 дней: ≥2 клика или ≥100 показов + коммерческие хабы (главные, услуги, группы, бренды); только живые и индексируемые", urls: keep }, null, 1) + "\n");
  console.log(`seo-critical-urls.json: ${keep.length} URL (из GSC ${fromGsc.length}, хабов ${hubs.length}); не взяты как неживые: ${dropped.length}`);
  dropped.slice(0, 40).forEach((d) => console.log("  - " + d));
}

// ── Основной прогон ──────────────────────────────────────────────────────────
async function run() {
  const t0 = Date.now(); const issues: Issue[] = [];
  const add = (sev: Sev, code: string, url: string, detail?: string) => issues.push({ sev, code, url, detail });

  // robots.txt
  const rb = await get("/robots.txt");
  if (rb.s !== 200) add("CRITICAL", "robots-unavailable", "/robots.txt", String(rb.s));
  else {
    if (/^Disallow:\s*\/\s*$/m.test(rb.body)) add("CRITICAL", "robots-disallow-all", "/robots.txt");
    if (!/^Sitemap:\s*https:\/\/satsolutions\.uz\/sitemap\.xml/m.test(rb.body)) add("HIGH", "robots-no-sitemap", "/robots.txt");
  }
  // sitemap: все части разбираются, нет дублей, объём не просел против прошлого прогона
  const parts = ["sitemap-pages", "sitemap-catalog", "sitemap-content", "sitemap-products"];
  const sm: Record<string, string[]> = {};
  for (const p of parts) {
    const r = await get(`/${p}.xml`);
    const locs = [...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
    if (r.s !== 200 || !locs.length) add("CRITICAL", "sitemap-broken", `/${p}.xml`, String(r.s));
    sm[p] = locs; await sleep(250);
  }
  const allLocs = Object.values(sm).flat();
  const cnt: Record<string, number> = {}; allLocs.forEach((u) => (cnt[u] = (cnt[u] || 0) + 1));
  Object.entries(cnt).filter(([, n]) => n > 1).forEach(([u]) => add("MEDIUM", "sitemap-duplicate-loc", rel(u)));
  mkdirSync(config.dataDir, { recursive: true });
  const prevFile = join(config.dataDir, "seo-check-sitemap-count.json");
  const prevCount = existsSync(prevFile) ? JSON.parse(readFileSync(prevFile, "utf8")) : null;
  for (const p of parts) if (prevCount?.[p] && sm[p].length < prevCount[p] * 0.9) add("HIGH", "sitemap-shrunk", `/${p}.xml`, `${prevCount[p]} → ${sm[p].length}`);
  writeFileSync(prevFile, JSON.stringify(Object.fromEntries(parts.map((p) => [p, sm[p].length]))));
  const inSitemap = new Set(allLocs.map(rel));

  // что проверяем постранично
  const critical: string[] = existsSync(CRITICAL_FILE) ? JSON.parse(readFileSync(CRITICAL_FILE, "utf8")).urls.map((x: any) => x.url) : [];
  if (!critical.length) add("HIGH", "critical-list-missing", "seo-critical-urls.json", "запустите --refresh-critical");
  const critSet = new Set(critical);
  let targets: string[];
  if (MODE === "quick") targets = [...new Set([...ROUTES, ...critical])];
  else if (MODE === "standard") {
    const step = Math.max(1, Math.floor(sm["sitemap-products"].length / SAMPLE));
    targets = [...new Set([...ROUTES, ...critical, ...[...sm["sitemap-pages"], ...sm["sitemap-catalog"], ...sm["sitemap-content"]].map(rel), ...sm["sitemap-products"].filter((_, i) => i % step === 0).slice(0, SAMPLE).map(rel)])];
  } else targets = [...new Set([...ROUTES, ...critical, ...allLocs.map(rel)])];

  const pages: Page[] = [];
  await pool(targets, async (path) => {
    const r = await get(path);
    const pg = analyze(path, r, add, { inSitemap: inSitemap.has(path), critical: critSet.has(path) || ROUTES.includes(path) });
    if (pg) pages.push(pg);
  });

  // старые адреса → ровно один переход на ожидаемую цель, финал 200
  await pool(LEGACY, async ([from, to]) => {
    const r1 = await get(from);
    if (!isStatus(r1.s, 300, 400)) { add("HIGH", "legacy-no-redirect", from, `ожидался редирект на ${to}, ответ ${r1.s}`); return; }
    const hop = rel(r1.loc);
    if (decodeURI(hop) !== decodeURI(to)) { add("HIGH", "legacy-wrong-target", from, `→ ${hop}, ожидалось ${to}`); return; }
    const r2 = await get(hop);
    if (isStatus(r2.s, 300, 400)) add("MEDIUM", "legacy-redirect-chain", from, `${hop} → ${rel(r2.loc)}`);
    else if (r2.s !== 200) add("HIGH", "legacy-target-broken", from, `${hop} → ${r2.s}`);
  });

  // дубли title/description внутри одного языка
  for (const f of ["title", "desc"] as const) {
    const m: Record<string, string[]> = {};
    pages.forEach((p) => { if (p[f]) (m[p.loc + "|" + p[f]] ||= []).push(p.path); });
    Object.values(m).filter((a) => a.length > 1).forEach((a) => add("MEDIUM", f === "title" ? "duplicate-title" : "duplicate-description", a[0], `${a.length} стр.: ${a.slice(1, 4).join(" ")}`));
  }

  // внутренние ссылки, которых нет в карте сайта: статус (на редирект, 4xx, 5xx)
  const linkSrc: Record<string, string[]> = {};
  pages.forEach((p) => p.links.forEach((l) => { const b = l.split("?")[0]; if (!inSitemap.has(b) && !/^\/(_next|api|uploads)\//.test(b) && !l.includes("?")) (linkSrc[l] ||= []).push(p.path); }));
  const extra = Object.keys(linkSrc).slice(0, MODE === "quick" ? 300 : 3000);
  await pool(extra, async (l) => {
    const r = await get(l); const src = `с ${linkSrc[l].length} стр., напр. ${linkSrc[l][0]}`;
    if (!isStatus(r.s, 200, 500)) add("CRITICAL", "link-to-5xx", l, src);
    else if (isStatus(r.s, 400, 500)) add("HIGH", "link-to-4xx", l, src);
    else if (isStatus(r.s, 300, 400)) add("MEDIUM", "link-to-redirect", l, `→ ${rel(r.loc)} (${src})`);
  });

  // ── отчёт ──
  const sec = Math.round((Date.now() - t0) / 1000);
  const by = (s: Sev) => issues.filter((x) => x.sev === s);
  const groups = (list: Issue[]) => { const g: Record<string, Issue[]> = {}; list.forEach((x) => (g[x.code] ||= []).push(x)); return Object.entries(g).sort((a, b) => b[1].length - a[1].length); };
  // новое против прошлого прогона того же режима
  const lastFile = join(config.dataDir, `seo-check-${MODE}.json`);
  const last: Issue[] = existsSync(lastFile) ? JSON.parse(readFileSync(lastFile, "utf8")).issues ?? [] : [];
  const key = (x: Issue) => x.code + "|" + x.url;
  const lastKeys = new Set(last.map(key));
  const fresh = issues.filter((x) => !lastKeys.has(key(x)) && (x.sev === "CRITICAL" || x.sev === "HIGH"));
  writeFileSync(lastFile, JSON.stringify({ ts: new Date().toISOString(), mode: MODE, checked: targets.length, links: extra.length, sec, issues }));

  const lines: string[] = [`seo:check ${MODE}: страниц ${targets.length}, ссылок ${extra.length}, старых адресов ${LEGACY.length}, ${sec} с`];
  for (const s of SEVS) {
    const list = by(s); lines.push(`${s}: ${list.length}`);
    for (const [code, xs] of groups(list)) lines.push(`  ${xs.length} × ${code}${xs.slice(0, s === "LOW" ? 2 : 5).map((x) => `\n      ${x.url}${x.detail ? "  " + x.detail : ""}`).join("")}`);
  }
  console.log(lines.join("\n"));

  const nCrit = by("CRITICAL").length;
  const wantSend = NOTIFY === "always" || (NOTIFY === "deploy" && (nCrit > 0 || fresh.length > 0));
  if (wantSend) {
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const head = nCrit ? "🔴" : by("HIGH").length ? "🟡" : "🟢";
    let t = `${head} <b>seo:check ${MODE === "quick" ? "после деплоя" : MODE === "full" ? "полный (неделя)" : MODE}</b>\n`;
    t += `Проверено: ${targets.length} стр., ${extra.length} ссылок, ${LEGACY.length} старых адресов, ${sec} с\n`;
    t += SEVS.map((s) => `${s}: <b>${by(s).length}</b>`).join(" · ") + "\n";
    for (const s of ["CRITICAL", "HIGH"] as Sev[]) for (const [code, xs] of groups(by(s))) {
      t += `\n<b>${s}</b> ${esc(code)} — ${xs.length}\n` + xs.slice(0, 4).map((x) => `• ${esc(ORIGIN + x.url)}${x.detail ? " <i>" + esc(x.detail).slice(0, 120) + "</i>" : ""}`).join("\n") + "\n";
    }
    if (NOTIFY === "deploy" && fresh.length) t += `\nНовое с прошлого прогона: ${fresh.length}`;
    await sendTelegram(t);
  }
  return nCrit;
}

const entry = process.argv[1] || "";
if (entry.endsWith("seoCheck.ts") || entry.endsWith("seoCheck.js")) {
  (args["refresh-critical"] ? refreshCritical().then(() => 0) : run())
    .then((nCrit) => process.exit(nCrit > 0 ? 1 : 0))
    .catch((e) => { console.error("[seo-check]", e); process.exit(2); });
}
