// Индекс-чек: массовая проверка индексации SEO-страниц через URL Inspection API
// (webmasters.readonly — «Запросить индексирование» Google по API не даёт никому,
// поэтому чек читающий: считаем, сколько страниц в индексе, и шлём дельту в Telegram).
// Цели: 119 пар бренд×категория (ru+uz) + бренд-страницы. Квота API: 2000/день, 600/мин.
// Запуск: npx tsx src/monitor/indexCheck.ts (cron Пн 09:00 Ташкент) или команда /index в боте.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { getGoogleAccessToken } from "./googleAuth.js";
import { config } from "./config.js";
import { sendTelegram } from "./telegram.js";

const SITE = "https://satsolutions.uz/";
const ORIGIN = "https://satsolutions.uz";
const API = "http://127.0.0.1:4005";

// Копия web/src/lib/typeSlug.ts (детерминированный слаг типа) — web-код из api не импортируем.
const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};
function typeSlug(name: string): string {
  let out = "";
  for (const ch of (name || "").toLowerCase()) out += ch in TRANSLIT ? TRANSLIT[ch] : ch;
  return out.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function targetUrls(): Promise<string[]> {
  const r = await fetch(`${API}/brand-type-pairs`);
  const { pairs } = (await r.json()) as { pairs: { brand: string; type: string }[] };
  const urls: string[] = [];
  const brands = new Set<string>();
  for (const p of pairs) {
    const s = typeSlug(p.type);
    urls.push(`${ORIGIN}/catalog/${p.brand}/${s}`);
    urls.push(`${ORIGIN}/uz/catalog/${p.brand}/${s}`);
    brands.add(p.brand);
  }
  for (const b of brands) urls.push(`${ORIGIN}/catalog/${b}`);
  return urls;
}

async function inspect(token: string, url: string): Promise<{ verdict: string; coverage: string }> {
  // таймаут обязателен: один зависший коннект без него вешал весь прогон (инциденты 03 и 05.07)
  const r = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
    signal: AbortSignal.timeout(20000),
  });
  if (!r.ok) return { verdict: `HTTP_${r.status}`, coverage: "" };
  const d = (await r.json()) as any;
  const ir = d.inspectionResult?.indexStatusResult ?? {};
  return { verdict: ir.verdict ?? "?", coverage: ir.coverageState ?? "?" };
}

export async function runIndexCheck(notifyChatId?: string): Promise<string> {
  const token = await getGoogleAccessToken();
  const urls = await targetUrls();
  const results: Record<string, string> = {};
  let indexed = 0;
  for (const u of urls) {
    try {
      const r = await inspect(token, u);
      const ok = r.verdict === "PASS";
      results[u] = ok ? "indexed" : (r.coverage || r.verdict);
      if (ok) indexed++;
    } catch (e) {
      results[u] = "error";
    }
    await new Promise((s) => setTimeout(s, 120)); // квота 600/мин: ~120мс паузы + латентность API — с запасом
  }

  // дельта с прошлым прогоном
  const file = join(config.dataDir, "index-check.json");
  let prev: Record<string, string> = {};
  try { if (existsSync(file)) prev = JSON.parse(readFileSync(file, "utf8")).results || {}; } catch {}
  const newly = urls.filter((u) => results[u] === "indexed" && prev[u] !== undefined && prev[u] !== "indexed");
  const dropped = urls.filter((u) => results[u] !== "indexed" && prev[u] === "indexed");
  mkdirSync(config.dataDir, { recursive: true });
  writeFileSync(file, JSON.stringify({ ts: new Date().toISOString(), results }, null, 1));

  const short = (u: string) => u.replace(ORIGIN, "");
  const isPairRu = (u: string) => /^https:\/\/satsolutions\.uz\/catalog\/[^/]+\/[^/]+$/.test(u);
  const isPairUz = (u: string) => u.startsWith(`${ORIGIN}/uz/catalog/`);
  const isBrand = (u: string) => /^https:\/\/satsolutions\.uz\/catalog\/[^/]+$/.test(u);
  const grp = (pred: (u: string) => boolean) => {
    const g = urls.filter(pred);
    return `${g.filter((u) => results[u] === "indexed").length}/${g.length}`;
  };

  let s = `📇 <b>Индексация SEO-страниц</b>\n`;
  s += `В индексе Google: <b>${indexed}/${urls.length}</b>\n`;
  s += `• пары бренд×категория RU: ${grp(isPairRu)}\n`;
  s += `• пары бренд×категория UZ: ${grp(isPairUz)}\n`;
  s += `• страницы брендов: ${grp(isBrand)}\n`;
  if (newly.length) s += `\n🟢 Вошли в индекс (${newly.length}): ${newly.slice(0, 8).map(short).join(", ")}${newly.length > 8 ? "…" : ""}`;
  if (dropped.length) s += `\n🔴 Выпали (${dropped.length}): ${dropped.slice(0, 8).map(short).join(", ")}${dropped.length > 8 ? "…" : ""}`;
  if (!Object.keys(prev).length) s += `\n<i>Первый прогон — это базовая точка, дельты появятся со следующего.</i>`;

  await sendTelegram(s, notifyChatId ? { chatId: notifyChatId } : undefined);
  return s;
}

// CLI-запуск (cron): npx tsx src/monitor/indexCheck.ts
const entry = process.argv[1] || "";
if (entry.endsWith("indexCheck.ts") || entry.endsWith("indexCheck.js")) {
  runIndexCheck()
    .then((s) => { console.log(s.replace(/<[^>]+>/g, "")); process.exit(0); })
    .catch((e) => { console.error("[index-check]", e); process.exit(1); });
}
