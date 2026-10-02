/* Делители PXT-CPC-1x2 (10/90, 20/80, 30/70, 40/60): это сварные (FBT) корпусные делители
 * (прайс поставщика «корпусный dual window», данные производителя линейки: FBT, гильза 3×54 мм,
 * 1310/1550 нм, потери dual window 11,3/0,6 · 7,9/1,3 · 6,0/1,9 · 4,7/2,7 дБ, −40…+70 °C).
 * В характеристиках стояло «PLC-делитель (планарный, бескорпусный)» — ошибка массового заполнения;
 * в описаниях 30/70 называлось «почти равномерным». Решение владельца 02.10.2026.
 * Меняет name/shortDescription/description/characteristics 4 товаров и «Тип» у PXT-PLC-1x8-SC/UPC
 * (там тоже «бескорпусный», хотя он корпусный). Данные — seed-splitters-fbt-20261002.json,
 * переводы — productI18n.json, значения характеристик — charValueI18n.json.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-splitters-fbt-20261002.ts [--apply] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const DATA: Record<string, any> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-splitters-fbt-20261002.json"), "utf8"));
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  for (const [id, v] of Object.entries(DATA)) {
    const p: any = id.startsWith("__") ? await Product.findOne({ where: { slug: v.slug } }) : await Product.findByPk(id);
    if (!p) { console.log(`✗ ${id}: НЕ НАЙДЕН`); continue; }
    const next: Record<string, unknown> = v.charPatch
      ? { characteristics: { ...(p.characteristics ?? {}), ...v.charPatch } }
      : { name: v.name, shortDescription: v.shortDescription, description: v.description, characteristics: v.characteristics };
    for (const [f, val] of Object.entries(next)) {
      if (same(p[f], val)) { console.log(`= ${p.slug}.${f}: уже так`); continue; }
      const show = (x: unknown) => (typeof x === "string" ? (x.length > 90 ? `${x.slice(0, 90)}… (${x.length})` : x) : JSON.stringify(x));
      console.log(`${p.slug}.${f}\n  было  ${show(p[f])}\n  стало ${show(val)}`);
      p[f] = val; todo++;
    }
    if (APPLY) { p.changed("characteristics", true); await p.save(); }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"} полей: ${todo}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
