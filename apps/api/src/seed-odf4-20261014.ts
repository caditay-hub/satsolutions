// 4 кросса ODF из прайса Хик (решение владельца 14.10.2026: «делай»): названия по реальному изделию
// (48 = 19″ 1U 24 LC duplex; «настенный 24» = стоечный 19″ 1U 24 SC; «уличный 8» = настенный IP20),
// бренд Pixietech → «прочее» (производитель не подтверждён), раздел pxt-fiber → prochee-optics,
// тексты/характеристики/SEO по разборам с источниками; переводы — productI18n.json. Slug не меняются.
//   npx tsx src/seed-odf4-20261014.ts [--apply | --rollback]
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = { slug: string; id: string; new: Record<string, unknown>; old: Record<string, unknown> };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-odf4-20261014.json", import.meta.url), "utf8"));
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
    console.log(`    «${p.name}» → «${t.name}»`);
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
