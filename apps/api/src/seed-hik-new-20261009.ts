// 12 новинок прайса Hikvision Premium 08.10.2026 (решение владельца 09.10: «ставь 12, остальные 5 отложи»).
// Данные — seed-hik-new-20261009.json: тексты RU, характеристики и SEO сверены с официальными
// даташитами Hikvision; переводы uz/en/tr/zh — apps/web/src/data/productI18n.json (ключ = id).
// Фото — /uploads/hik/products/<slug>-xl.webp (+ -g2/-g3), залиты scp до запуска.
// supplier/supplierCode в модели Product нет — пишутся SQL-запросом (иначе price_sync их не увидит).
// В карточку DS-96128NXI-S16 добавляется фраза про исполнение S16R (отдельной карточки S16R нет).
//   npx tsx src/seed-hik-new-20261009.ts            — сухой прогон
//   npx tsx src/seed-hik-new-20261009.ts --apply    — записать
//   npx tsx src/seed-hik-new-20261009.ts --rollback — удалить 12 карточек и убрать фразу из S16
import "dotenv/config";
import { readFileSync } from "node:fs";
import { QueryTypes } from "sequelize";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = {
  id: string; slug: string; name: string; shortDescription: string; description: string;
  characteristics: Record<string, string>; seoTitle: string; seoDescription: string; price: number;
  modelCode: string; supplier: string; supplierCode: string; categoryId: string; brandId: string;
  coverImageUrl: string; galleryImageUrls: string[] | null;
};

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-hik-new-20261009.json", import.meta.url), "utf8"));
const S16_SLUG = "hik-ds-96128nxi-s16";
const S16R_RU = " Также доступно исполнение DS-96128NXI-S16R с резервным блоком питания.";
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();

  // дубли: тот же slug или modelCode у другой карточки
  for (const r of ROWS) {
    const clash = await sequelize.query<{ slug: string }>(
      `SELECT slug FROM products WHERE (slug = :slug OR lower("modelCode") = lower(:mc)) AND id <> :id`,
      { replacements: { slug: r.slug, mc: r.modelCode, id: r.id }, type: QueryTypes.SELECT }
    );
    if (clash.length) throw new Error(`дубль ${r.slug}: ${clash.map((c) => c.slug).join(", ")}`);
  }

  const s16 = await Product.findOne({ where: { slug: S16_SLUG } });
  if (!s16) throw new Error("нет карточки S16");
  const s16Desc = s16.description || "";
  const cut = s16Desc.indexOf("\n\n");

  if (rollback) {
    const n = await Product.destroy({ where: { id: ROWS.map((r) => r.id) } });
    if (s16Desc.includes(S16R_RU)) await s16.update({ description: s16Desc.replace(S16R_RU, "") });
    console.log("откат: удалено карточек", n, "· S16 восстановлена");
    process.exit(0);
  }

  for (const r of ROWS) {
    const exists = await Product.findByPk(r.id);
    console.log(`${exists ? "update" : "create"}  ${r.slug}  ${r.price.toLocaleString("ru-RU")}  ${r.name}`);
  }
  console.log(s16Desc.includes("S16R") ? "S16: фраза уже есть" : "S16: + фраза про S16R");
  if (!apply) {
    console.log("сухой прогон; для записи добавьте --apply");
    process.exit(0);
  }

  await sequelize.transaction(async (transaction) => {
    for (const r of ROWS) {
      const { supplier, supplierCode, ...fields } = r;
      const data = { ...fields, price: String(r.price), published: true, inStock: true, isUsd: false, recommended: false };
      const exists = await Product.findByPk(r.id, { transaction });
      if (exists) await exists.update(data as any, { transaction });
      else await Product.create(data as any, { transaction });
      await sequelize.query(`UPDATE products SET supplier = :supplier, "supplierCode" = :code WHERE id = :id`,
        { replacements: { supplier, code: supplierCode, id: r.id }, transaction });
    }
    if (!s16Desc.includes("S16R") && cut > 0) {
      await s16.update({ description: s16Desc.slice(0, cut) + S16R_RU + s16Desc.slice(cut) }, { transaction });
    }
  });
  console.log("записано:", ROWS.length);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
