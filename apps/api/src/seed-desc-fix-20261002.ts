/* Английские вставки в русских описаниях 4 товаров (лоток «Fiber Optic Splice Tray»,
 * гильза «Fiber Heat Shrink Tubing», пульты AU518/AU666 «learning code» → «обучаемый код») —
 * по решению владельца 02.10.2026. Новые тексты целиком — в seed-desc-fix-20261002.json
 * (ключ = id товара, поля shortDescription/description). Переводы — в productI18n.json.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-desc-fix-20261002.ts [--apply] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, Record<string, string>> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-desc-fix-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  for (const [id, fields] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${id}: НЕ НАЙДЕН`); continue; }
    for (const [f, v] of Object.entries(fields)) {
      if (p[f] === v) { console.log(`= ${p.slug}.${f}: уже так`); continue; }
      console.log(`${p.slug}.${f}: ${String(p[f]).length} → ${v.length} симв.`);
      p[f] = v; todo++;
    }
    if (APPLY) await p.save();
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"} полей: ${todo}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
