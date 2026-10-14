// Карточки шлагбаумного семейства (разбор 14.10.2026, «делай все»):
// — ABO-20M: название без повтора «для шлагбаума … для шлагбаум» и «безпроводной»; slug прежний,
//   seoTitle/seoDescription пустые (строятся из названия), переводы в productI18n.json уже верные;
// — парковочные барьеры APL-02 и APL-X4 из «Кронштейнов и аксессуаров» в «Шлагбаумы», где их аналог Plock 2.
//   npx tsx src/seed-barrier-cards-20261014.ts            — сухой прогон
//   npx tsx src/seed-barrier-cards-20261014.ts --apply    — записать
//   npx tsx src/seed-barrier-cards-20261014.ts --rollback — вернуть прежние значения
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = { slug: string; id: string; new: Record<string, unknown>; old: Record<string, unknown> };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-barrier-cards-20261014.json", import.meta.url), "utf8"));
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();
  for (const r of ROWS) {
    const p = await Product.findByPk(r.id);
    if (!p || p.slug !== r.slug) throw new Error(`нет товара ${r.slug}`);
    const t = rollback ? r.old : r.new;
    console.log(`${r.slug.slice(0, 55)}  поля: ${Object.keys(t).join(", ")}`);
    console.log(`    ${Object.entries(t).map(([k, v]) => `${k}: «${(p as any)[k]}» → «${v}»`).join("; ")}`);
  }
  if (!apply && !rollback) {
    console.log("сухой прогон; для записи добавьте --apply");
    process.exit(0);
  }
  await sequelize.transaction(async (transaction) => {
    for (const r of ROWS) {
      const p = (await Product.findByPk(r.id, { transaction }))!;
      await p.update((rollback ? r.old : r.new) as any, { transaction });
    }
  });
  console.log(rollback ? "откат выполнен" : "записано", ROWS.length);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
