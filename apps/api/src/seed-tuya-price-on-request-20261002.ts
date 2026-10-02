/* Tuya → «Цена по запросу» (price = 0) по решению владельца 02.10.2026.
 * 60 товаров (52 бренд Tuya + 8 модулей PST-* в «Комплектующих») заведены 11.06 из
 * PRICE LIST (LIDER TEAM) 01.05.2026.xlsx, лист «Умный дом»; в прайсе Lider 26.08 этого листа нет —
 * поставщик убрал Tuya, свежих цен нет. Прежние цены — в seed-tuya-price-on-request-20261002.json
 * (поле price): --rollback возвращает их.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-tuya-price-on-request-20261002.ts [--apply] [--rollback] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const ROLLBACK = process.argv.includes("--rollback");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { slug: string; code: string; price: number }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-tuya-price-on-request-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0, sum = 0;
  for (const [id, v] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${v.slug}: НЕ НАЙДЕН`); continue; }
    if (!String(p.modelCode ?? "").toUpperCase().startsWith("PST")) { console.log(`✗ ${p.slug}: не PST-артикул — стоп`); process.exit(1); }
    const target = ROLLBACK ? v.price : 0;
    if (Number(p.price) === target) continue;
    console.log(`${p.slug}: ${Number(p.price).toLocaleString("ru-RU")} → ${target ? target.toLocaleString("ru-RU") : "по запросу"}`);
    todo++; sum += Number(p.price);
    if (APPLY) { p.price = target; await p.save(); }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo} товаров${ROLLBACK ? " (откат)" : ""}, сумма прежних цен ${sum.toLocaleString("ru-RU")}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
