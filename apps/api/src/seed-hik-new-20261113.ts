// 118 новинок прайса Hikvision Premium 03.11.2026 (решение владельца 13.11: «ставь все три» волны).
// Данные — seed-hik-new-20261113.json: тексты RU, характеристики и SEO сверены с паспортами производителей;
// переводы uz/en/tr/zh — apps/web/src/data/productI18n.json (ключ = id).
// Фото — /uploads/<hik|tplink|witek|zkteco|kanihad|bolid|prochee>/products/<slug>-xl.webp (+ -g2/-g3), залиты до запуска.
// supplier/supplierCode в модели Product нет — пишутся SQL-запросом (иначе price_sync их не увидит).
//   npx tsx src/seed-hik-new-20261113.ts            — сухой прогон
//   npx tsx src/seed-hik-new-20261113.ts --apply    — записать
//   npx tsx src/seed-hik-new-20261113.ts --rollback — удалить 118 карточек
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

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-hik-new-20261113.json", import.meta.url), "utf8"));
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();

  if (rollback) {
    const n = await Product.destroy({ where: { id: ROWS.map((r) => r.id) } });
    console.log("откат: удалено карточек", n);
    process.exit(0);
  }

  // дубли: тот же slug или modelCode у другой карточки
  for (const r of ROWS) {
    const clash = await sequelize.query<{ slug: string }>(
      `SELECT slug FROM products WHERE (slug = :slug OR lower("modelCode") = lower(:mc)) AND id <> :id`,
      { replacements: { slug: r.slug, mc: r.modelCode, id: r.id }, type: QueryTypes.SELECT }
    );
    if (clash.length) throw new Error(`дубль ${r.slug}: ${clash.map((c) => c.slug).join(", ")}`);
  }

  // бренд и категория существуют
  const cats = await sequelize.query<{ id: string }>(`SELECT id FROM categories WHERE id IN (:ids)`,
    { replacements: { ids: [...new Set(ROWS.map((r) => r.categoryId))] }, type: QueryTypes.SELECT });
  const brands = await sequelize.query<{ id: string }>(`SELECT id FROM brands WHERE id IN (:ids)`,
    { replacements: { ids: [...new Set(ROWS.map((r) => r.brandId))] }, type: QueryTypes.SELECT });
  const catSet = new Set(cats.map((c) => c.id)), brandSet = new Set(brands.map((b) => b.id));
  const lost = ROWS.filter((r) => !catSet.has(r.categoryId) || !brandSet.has(r.brandId));
  if (lost.length) throw new Error(`нет категории/бренда: ${lost.map((r) => r.slug).join(", ")}`);

  let nNew = 0;
  for (const r of ROWS) {
    const exists = await Product.findByPk(r.id);
    if (!exists) nNew++;
    console.log(`${exists ? "update" : "create"}  ${r.slug}  ${r.price.toLocaleString("ru-RU")}  ${r.name}`);
  }
  console.log(`итого ${ROWS.length}: новых ${nNew}, обновить ${ROWS.length - nNew}`);
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
  });
  console.log("записано:", ROWS.length);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
