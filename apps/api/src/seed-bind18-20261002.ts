/* Привязка 18 товаров к прайсам и цена по формуле (×0,99, вниз к …900 / …90) — решение владельца
 * 02.10.2026. Товары были без supplier/supplierCode, их цену не обновлял ни один прайс.
 * Pixietech 26.08 (11), EKOM 17.07 (2), Hikvision Premium 21.09 «Короткий прайс» (5).
 * supplierCode = ключ строки, по которому её находит .setup/price_sync/price_sync.py (проверено его
 * же парсерами). Данные и прежние значения — seed-bind18-20261002.json; --rollback возвращает их.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-bind18-20261002.ts [--apply] [--rollback] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const ROLLBACK = process.argv.includes("--rollback");
type Row = { slug: string; supplier: string | null; supplierCode: string | null; price: number };
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, Row & { old: Omit<Row, "slug"> }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-bind18-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0, delta = 0;
  for (const [id, v] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${v.slug}: НЕ НАЙДЕН`); continue; }
    const t = ROLLBACK ? v.old : v;
    if (!ROLLBACK && p.supplier && p.supplier !== v.supplier) { console.log(`✗ ${p.slug}: уже привязан к ${p.supplier} — не трогаю`); continue; }
    if (p.supplier === t.supplier && p.supplierCode === t.supplierCode && Number(p.price) === Number(t.price)) continue;
    console.log(`${p.slug}: ${p.supplier ?? "—"} → ${t.supplier ?? "—"} | ${Number(p.price).toLocaleString("ru-RU")} → ${Number(t.price).toLocaleString("ru-RU")}`);
    delta += Number(t.price) - Number(p.price); todo++;
    if (APPLY) { p.supplier = t.supplier; p.supplierCode = t.supplierCode; p.price = t.price; await p.save(); }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo} товаров${ROLLBACK ? " (откат)" : ""}, сумма цен ${delta >= 0 ? "+" : ""}${delta.toLocaleString("ru-RU")}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
