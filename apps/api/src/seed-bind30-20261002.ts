/* Привязка 31 товара к прайсам (30 из разбора «74 без источника» + сервер Supermicro, найденный
 * в Pixietech 26.08 под артикулом без «-R») и цена по формуле — решение владельца 02.10.2026.
 * Pixietech 26.08 (кабели — по колонке «Новые цены Прайс»), EKOM 17.07 (QMP), Хик 21.09 «Короткий прайс».
 * supplierCode = ключ строки, по которому её находит .setup/price_sync/price_sync.py (проверено его
 * же парсерами). Данные и прежние значения — seed-bind30-20261002.json; --rollback возвращает их.
 * ⚠️ В модели Product нет полей supplier/supplierCode — Sequelize их молча игнорирует (первый прогон
 * 02.10 записал только цены). Привязка пишется параметризованным UPDATE.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-bind30-20261002.ts [--apply] [--rollback] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const ROLLBACK = process.argv.includes("--rollback");
type Row = { slug: string; supplier: string | null; supplierCode: string | null; price: number };
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, Row & { old: Omit<Row, "slug"> }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-bind30-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0, delta = 0;
  for (const [id, v] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${v.slug}: НЕ НАЙДЕН`); continue; }
    const [[sup]]: any = await sequelize.query('SELECT supplier, "supplierCode" FROM products WHERE id = :id', { replacements: { id } });
    p.supplier = sup.supplier; p.supplierCode = sup.supplierCode;
    const t = ROLLBACK ? v.old : v;
    if (!ROLLBACK && p.supplier && p.supplier !== v.supplier) { console.log(`✗ ${p.slug}: уже привязан к ${p.supplier} — не трогаю`); continue; }
    if (p.supplier === t.supplier && p.supplierCode === t.supplierCode && Number(p.price) === Number(t.price)) continue;
    console.log(`${p.slug}: ${p.supplier ?? "—"} → ${t.supplier ?? "—"} | ${Number(p.price).toLocaleString("ru-RU")} → ${Number(t.price).toLocaleString("ru-RU")}`);
    delta += Number(t.price) - Number(p.price); todo++;
    if (APPLY) {
      await sequelize.query('UPDATE products SET supplier = :s, "supplierCode" = :c, price = :pr, "updatedAt" = now() WHERE id = :id',
        { replacements: { s: t.supplier, c: t.supplierCode, pr: t.price, id } });
    }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo} товаров${ROLLBACK ? " (откат)" : ""}, сумма цен ${delta >= 0 ? "+" : ""}${delta.toLocaleString("ru-RU")}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
