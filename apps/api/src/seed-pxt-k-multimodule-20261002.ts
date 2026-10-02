/* Три многомодульных кабеля PXT-K (36/48/96 волокон) — цена по колонке «Новые цены Прайс» Lider 26.08
 * (+68…+95 %, price_sync такие скачки сам не применяет). Решение владельца 02.10.2026: новая лесенка
 * цен поставщика монотонна (24 в. 10 680 → 36 в. 16 820 → 48 в. 19 860 → 96 в. 34 390), старая колонка
 * держала 36 волокон дешевле 24-волоконного многомодульного — битая. Формула ×0,99 вниз к …90.
 * Прежние цены — в JSON (old); --rollback возвращает их. Сухой прогон по умолчанию, запись с --apply.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-pxt-k-multimodule-20261002.ts [--apply] [--rollback] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const ROLLBACK = process.argv.includes("--rollback");
// запуск из apps/api — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { code: string; old: number; new: number }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-pxt-k-multimodule-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  for (const [slug, v] of Object.entries(MAP)) {
    const p: any = await Product.findOne({ where: { slug } });
    if (!p) { console.log(`✗ ${slug}: НЕ НАЙДЕН`); continue; }
    const target = ROLLBACK ? v.old : v.new;
    if (Number(p.price) === target) { console.log(`= ${slug}: уже ${target}`); continue; }
    console.log(`${slug}: ${Number(p.price)} → ${target}`);
    todo++;
    if (APPLY) { p.price = target; await p.save(); }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo}${ROLLBACK ? " (откат)" : ""}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
