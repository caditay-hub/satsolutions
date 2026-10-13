// Перепроверка 6 товаров дороже розницы дистрибьютора (решение владельца 13.10.2026:
// «применяй цены и сними дубли, MikroTik вариант А»). Данные и прежние значения для отката —
// seed-six-fix-20261013.json. Рубеж: закупка × 1,10; остальные: прайс × 0,99, не выше розницы.
// supplier/supplierCode в модели Product нет — пишутся SQL-запросом (null = не трогать, "" = отвязать).
// Снятые дубли получают 308 в apps/web/src/lib/removedProducts.ts.
//   npx tsx src/seed-six-fix-20261013.ts            — сухой прогон
//   npx tsx src/seed-six-fix-20261013.ts --apply    — записать
//   npx tsx src/seed-six-fix-20261013.ts --rollback — вернуть прежние значения
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type State = { price: number | null; supplier: string | null; supplierCode: string | null; published: boolean };
type Row = { slug: string; id: string; new: State; old: State };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-six-fix-20261013.json", import.meta.url), "utf8"));
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();
  for (const r of ROWS) {
    const p = await Product.findByPk(r.id);
    if (!p || p.slug !== r.slug) throw new Error(`нет товара ${r.slug}`);
    const t = rollback ? r.old : r.new;
    console.log(`${r.slug.slice(0, 60)}  ${p.price} → ${t.price ?? "="}  pub ${p.published} → ${t.published}`
      + (t.supplierCode !== null ? `  код → «${t.supplierCode}»` : ""));
  }
  if (!apply && !rollback) {
    console.log("сухой прогон; для записи добавьте --apply");
    process.exit(0);
  }
  await sequelize.transaction(async (transaction) => {
    for (const r of ROWS) {
      const t = rollback ? r.old : r.new;
      const p = (await Product.findByPk(r.id, { transaction }))!;
      const data: Record<string, unknown> = { published: t.published };
      if (t.price !== null) data.price = String(t.price);
      await p.update(data as any, { transaction });
      if (t.supplier !== null || t.supplierCode !== null) {
        await sequelize.query(`UPDATE products SET supplier = :s, "supplierCode" = :c WHERE id = :id`, {
          replacements: { s: t.supplier || null, c: t.supplierCode || null, id: r.id },
          transaction,
        });
      }
    }
  });
  console.log(rollback ? "откат выполнен" : "записано", ROWS.length);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
