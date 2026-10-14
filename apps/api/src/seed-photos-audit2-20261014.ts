// Фото 57 карточек, 2-й заход проверки 14.10.2026 (без бренда + SNR/Wi-Tek/C-Data/TP-Link):
// владелец утвердил «применяй все». Источники: kss.uz (та же строка прайса), сайты производителей
// (SNR cdn.nag.shop, wireless-tek.com, cdatatec.com, tp-link, V-SOL, linkff.cn), itmag.uz. Файлы <slug>-mN.webp.
// Прежние обложки и галереи — seed-photos-audit2-20261014.json (поле old).
//   npx tsx src/seed-photos-audit2-20261014.ts [--apply | --rollback]
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = { slug: string; id: string; new: Record<string, unknown>; old: Record<string, unknown> };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-photos-audit2-20261014.json", import.meta.url), "utf8"));
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
