// Исправление текстов, характеристик, SEO и обложек 21 карточки после перепроверки 13.10.2026
// (Рубеж 10, оптика и КС 7, Tapo/MikroTik 4; решение владельца: «1, фразу про R1 убери, остальное ставь»).
// Факты сверены с сайтами производителей; переводы uz/en/tr/zh — apps/web/src/data/productI18n.json,
// новые ключи характеристик — charKeyI18n.json. Данные и прежние значения — seed-cards-fix-20261013.json.
// Фото прот.R3 (-m1.webp) залито scp до запуска; остальные обложки — кадры из своих галерей.
//   npx tsx src/seed-cards-fix-20261013.ts            — сухой прогон
//   npx tsx src/seed-cards-fix-20261013.ts --apply    — записать
//   npx tsx src/seed-cards-fix-20261013.ts --rollback — вернуть прежние значения
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = { slug: string; id: string; new: Record<string, unknown>; old: Record<string, unknown> };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-cards-fix-20261013.json", import.meta.url), "utf8"));
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
