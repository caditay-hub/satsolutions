// Сплошной аудит контента: статьи, лонгриды услуг, тип-лендинги, бренд-тексты.
// Запуск: npx tsx scripts/content_audit.ts > ../../.setup/content_audit.txt
import { ARTICLES } from "../src/lib/articlesData";
import { SERVICES } from "../src/lib/servicesData";
import brandSeo from "../src/data/brandSeoI18n.json";
import catLong from "../src/data/categoryLongreadI18n.json";
import { TYPE_LANDING } from "../src/lib/typeSeo";
import * as fs from "fs";
import * as path from "path";

const LOCS = ["ru", "uz", "en", "tr", "zh"];
const CLICHES = [
  "широкий спектр", "индивидуальный подход", "широкий ассортимент", "богатый опыт",
  "высокое качество", "команда профессионалов", "гибкие цены", "идеальное решение",
  "лучшее решение", "по доступным ценам", "динамично развивающ", "не имеет аналогов",
];

const words = (s: string, loc: string) =>
  loc === "zh" ? Math.round(s.replace(/\s/g, "").length / 1.8) : s.split(/\s+/).filter(Boolean).length;

const flag = (n: number, min: number) => (n < min ? ` <<< МАЛО (${n}<${min})` : "");

console.log("=== 1. СТАТЬИ БЛОГА (articlesData.ts), всего:", ARTICLES.length, "===");
for (const a of ARTICLES) {
  const present = Object.keys(a.loc);
  const missing = LOCS.filter((l) => !present.includes(l));
  const line: string[] = [];
  for (const l of LOCS) {
    const b = (a.loc as any)[l];
    if (!b) continue;
    const text = b.sections.map((s: any) => s.p.join(" ")).join(" ");
    const pars = b.sections.reduce((n: number, s: any) => n + s.p.length, 0);
    const w = words(text, l);
    line.push(`${l}:${w}w/${pars}p${b.faq ? `/faq${b.faq.length}` : "/NOFAQ"}`);
  }
  const ru = (a.loc as any).ru;
  const ruText = ru ? ru.sections.map((s: any) => s.p.join(" ")).join(" ") + " " + (ru.faq || []).map((f: any) => f.q + f.a).join(" ") : "";
  const cl = CLICHES.filter((c) => ruText.toLowerCase().includes(c));
  const ruW = ru ? words(ru.sections.map((s: any) => s.p.join(" ")).join(" "), "ru") : 0;
  console.log(`${a.slug} [${a.date}] ${line.join(" ")}${missing.length ? " MISSING:" + missing.join(",") : ""}${flag(ruW, 350)}${cl.length ? " ШТАМПЫ:" + cl.join(";") : ""}`);
}

console.log("\n=== 2. ЛОНГРИДЫ УСЛУГ (serviceContent.ts) ===");
// serviceContent экспортирует функцию; парсим исходник напрямую
const sc = fs.readFileSync(path.join(__dirname, "../src/lib/serviceContent.ts"), "utf8");
for (const loc of LOCS) {
  const m = sc.indexOf(`const ${loc}: Record<string, ServiceContent> = {`);
  if (m < 0) { console.log(`локаль ${loc}: НЕ НАЙДЕНА`); continue; }
}
const svcKeys = SERVICES.map((s) => s.key);
for (const key of svcKeys) {
  const line: string[] = [];
  let ruW = 0, ruText = "";
  for (const loc of LOCS) {
    const seg = sc.indexOf(`const ${loc}: Record<string, ServiceContent> = {`);
    const next = LOCS.map((l) => sc.indexOf(`const ${l}: Record<string, ServiceContent> = {`)).filter((i) => i > seg).sort((a, b) => a - b)[0] ?? sc.length;
    const block = sc.slice(seg, next);
    let kIdx = block.indexOf(`"${key}": {`);
    if (kIdx < 0) kIdx = block.search(new RegExp(`^  ${key}: \\{`, "m"));
    if (kIdx < 0) { line.push(`${loc}:MISSING`); continue; }
    const pStart = block.indexOf("paragraphs: [", kIdx);
    const pEnd = block.indexOf("],", pStart);
    const parBlock = block.slice(pStart, pEnd);
    const pars = (parBlock.match(/"(?:[^"\\]|\\.)*"/g) || []).map((s) => JSON.parse(s));
    const text = pars.join(" ");
    const w = words(text, loc);
    line.push(`${loc}:${w}w/${pars.length}p`);
    if (loc === "ru") { ruW = w; ruText = text; }
  }
  const cl = CLICHES.filter((c) => ruText.toLowerCase().includes(c));
  console.log(`${key} ${line.join(" ")}${flag(ruW, 400)}${cl.length ? " ШТАМПЫ:" + cl.join(";") : ""}`);
}

console.log("\n=== 3. ТИП-ЛЕНДИНГИ (TYPE_LANDING) ===");
for (const [slug, byLoc] of Object.entries(TYPE_LANDING)) {
  const line: string[] = [];
  let ruText = "";
  for (const loc of LOCS) {
    const e = (byLoc as any)[loc];
    if (!e) { line.push(`${loc}:MISSING`); continue; }
    const text = [e.intro, ...e.long].join(" ");
    line.push(`${loc}:${words(text, loc)}w/${e.long.length}p/faq${e.faq.length}`);
    if (loc === "ru") ruText = text;
  }
  const cl = CLICHES.filter((c) => ruText.toLowerCase().includes(c));
  console.log(`${slug} ${line.join(" ")}${cl.length ? " ШТАМПЫ:" + cl.join(";") : ""}`);
}

console.log("\n=== 4. БРЕНД-ТЕКСТЫ (brandSeoI18n.json) ===");
for (const [slug, obj] of Object.entries(brandSeo as any)) {
  const line: string[] = [];
  for (const loc of LOCS) {
    const e = (obj as any)[loc];
    if (!e) { line.push(`${loc}:MISSING`); continue; }
    const intro = e.intro || "";
    const faqN = (e.faq || []).length;
    line.push(`${loc}:${words(intro, loc)}w/faq${faqN}`);
  }
  console.log(`${slug} ${line.join(" ")}`);
}

console.log("\n=== 5. КАТЕГОРИЙНЫЕ ЛОНГРИДЫ overlay (categoryLongreadI18n.json) ===");
let short = 0;
for (const [slug, obj] of Object.entries(catLong as any)) {
  const miss = ["uz", "en", "tr", "zh"].filter((l) => !(obj as any)[l]);
  const uzW = (obj as any).uz ? words(((obj as any).uz.html || (obj as any).uz.content || JSON.stringify((obj as any).uz)), "uz") : 0;
  if (miss.length || uzW < 150) { console.log(`${slug} uz:${uzW}w${miss.length ? " MISSING:" + miss.join(",") : ""}`); short++; }
}
console.log(`(показаны только проблемные; всего ${Object.keys(catLong as any).length}, проблемных ${short})`);
