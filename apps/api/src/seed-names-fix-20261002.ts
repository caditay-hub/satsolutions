/* Русские названия 10 товаров с английскими вставками («Fiber optic splice trays»,
 * «learning code», «8wire delay electric plug lock», «dual window», «Packaging priced per
 * extender», опечатка «Cambim») — по решению владельца 02.10.2026. Название уходит в title
 * страницы. Переводы uz/en/tr/zh — в apps/web/src/data/productI18n.json (тот же JSON-словарь
 * seed-names-fix-20261002.json, ключ = id товара). Slug не меняется.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-names-fix-20261002.ts [--apply] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { ru: string }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-names-fix-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  for (const [id, n] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${id}: НЕ НАЙДЕН`); continue; }
    if (p.name === n.ru) { console.log(`= ${p.slug}: уже так`); continue; }
    if (n.ru.length > 200) { console.log(`✗ ${p.slug}: длиннее 200 — стоп`); process.exit(1); }
    console.log(`${p.slug}\n  было  «${p.name}»\n  стало «${n.ru}»`);
    todo++;
    if (APPLY) { p.name = n.ru; await p.save(); }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
