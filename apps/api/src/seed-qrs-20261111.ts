// QR Systems (Казахстан) — новый бренд адресно-аналоговой пожарной сигнализации, 44 карточки по прайсу
// «Прайс UZB_3.xlsx» (решения владельца 11.11.2026: цена = РРЦ + НДС 12 % → вниз к …900; все 44 позиции;
// УДП — в «Приборы и модули»; письмо о партнёрстве № 85 от 10.11.2026 — на странице бренда).
// Данные — seed-qrs-20261111.json: тексты RU, характеристики и SEO по паспортам/РЭ производителя и его сайту;
// переводы uz/en/tr/zh — apps/web/src/data/productI18n.json (ключ = id). Фото — /uploads/qrs/products/<slug>-xl.webp
// (+ -g2…-g4), залиты scp до запуска. Бренд и 3 категории создаются здесь же (идемпотентно, по slug).
// supplier/supplierCode в модели Product нет — пишутся SQL-запросом (price_sync.py --supplier qr-systems их видит).
//   npx tsx src/seed-qrs-20261111.ts            — сухой прогон
//   npx tsx src/seed-qrs-20261111.ts --apply    — записать (published=true)
//   npx tsx src/seed-qrs-20261111.ts --rollback — удалить 44 карточки (бренд и категории остаются, пустые)
import "dotenv/config";
import { readFileSync } from "node:fs";
import { QueryTypes } from "sequelize";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";
import { Brand } from "./models/Brand.js";
import { Category } from "./models/Category.js";

type Row = {
  id: string; slug: string; name: string; shortDescription: string; description: string;
  characteristics: Record<string, string>; seoTitle: string; seoDescription: string; price: number;
  modelCode: string; supplier: string; supplierCode: string; categorySlug: string;
  coverImageUrl: string | null; galleryImageUrls: string[] | null;
};

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-qrs-20261111.json", import.meta.url), "utf8"));
const BRAND = { slug: "qr-systems", name: "QR Systems", logoImageUrl: "https://api.satsolutions.uz/uploads/brands/qr-systems-std.png?v=20261111" };
const CATEGORIES = [
  { slug: "qrs-detectors", name: "Извещатели" },
  { slug: "qrs-sirens", name: "Оповещение" },
  { slug: "qrs-panels", name: "Приборы и модули" },
];
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();

  if (rollback) {
    const n = await Product.destroy({ where: { id: ROWS.map((r) => r.id) } });
    console.log("откат: удалено карточек", n, "(бренд и категории оставлены)");
    process.exit(0);
  }

  // дубли: тот же slug или modelCode у другой карточки
  for (const r of ROWS) {
    const clash = await sequelize.query<{ slug: string }>(
      `SELECT slug FROM products WHERE (slug = :slug OR lower("modelCode") = lower(:mc)) AND id <> :id`,
      { replacements: { slug: r.slug, mc: r.modelCode, id: r.id }, type: QueryTypes.SELECT }
    );
    if (clash.length) throw new Error(`дубль ${r.slug}: ${clash.map((c) => c.slug).join(", ")}`);
    if (!CATEGORIES.some((c) => c.slug === r.categorySlug)) throw new Error(`неизвестная категория ${r.categorySlug} у ${r.slug}`);
  }

  const brandRow = await Brand.findOne({ where: { slug: BRAND.slug } });
  const catRows = await Category.findAll({ where: { slug: CATEGORIES.map((c) => c.slug) } });
  console.log(`бренд ${BRAND.slug}: ${brandRow ? "есть" : "создать"} · категории: есть ${catRows.length} из ${CATEGORIES.length}`);
  for (const r of ROWS) {
    const exists = await Product.findByPk(r.id);
    console.log(`${exists ? "update" : "create"}  ${r.slug}  ${r.price.toLocaleString("ru-RU")}  ${r.categorySlug}  ${r.name}`);
  }
  if (!apply) {
    console.log("сухой прогон; для записи добавьте --apply");
    process.exit(0);
  }

  await sequelize.transaction(async (transaction) => {
    const [brand] = await Brand.findOrCreate({
      where: { slug: BRAND.slug },
      defaults: { name: BRAND.name, slug: BRAND.slug, logoImageUrl: BRAND.logoImageUrl, sortOrder: 50, published: true } as any,
      transaction,
    });
    if (!brand.published || !brand.logoImageUrl) await brand.update({ published: true, logoImageUrl: brand.logoImageUrl || BRAND.logoImageUrl }, { transaction });
    const catId: Record<string, string> = {};
    for (const c of CATEGORIES) {
      const [cat] = await Category.findOrCreate({
        where: { slug: c.slug },
        defaults: { name: c.name, slug: c.slug, parentId: null, coverImageUrl: null } as any,
        transaction,
      });
      catId[c.slug] = cat.id;
    }
    for (const r of ROWS) {
      const { supplier, supplierCode, categorySlug, ...fields } = r;
      const data = {
        ...fields, price: String(r.price), published: true, inStock: true, isUsd: false, recommended: false,
        brandId: brand.id, categoryId: catId[categorySlug],
      };
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
