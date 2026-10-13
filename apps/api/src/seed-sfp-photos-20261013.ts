// Обложки и галереи 4 SFP-карточек (решение владельца 13.10.2026: «ставь фото на все четыре»):
// LC20km/LC3km/SC20km — фото Pixietech LX-20, W35/W53-3-LC, W35/W53-20 (модели сверены с картинками
// прайса поставщика); HK-SFP-1.25G-20-1310-DF — официальное фото Hikvision (этикетка «…-DF»), прежде
// стояла многомодовая «-MM». Прежние значения — seed-sfp-photos-20261013.json.
//   npx tsx src/seed-sfp-photos-20261013.ts            — сухой прогон
//   npx tsx src/seed-sfp-photos-20261013.ts --apply    — записать
//   npx tsx src/seed-sfp-photos-20261013.ts --rollback — вернуть прежние фото
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = { slug: string; id: string; new: Record<string, unknown>; old: Record<string, unknown> };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-sfp-photos-20261013.json", import.meta.url), "utf8"));
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();
  for (const r of ROWS) {
    const p = await Product.findByPk(r.id);
    if (!p || p.slug !== r.slug) throw new Error(`нет товара ${r.slug}`);
    const t = rollback ? r.old : r.new;
    console.log(`${r.slug}  обложка → ${t.coverImageUrl}  галерея: ${(t.galleryImageUrls as string[] | null)?.length ?? 0}`);
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
