// Правки после перевода ручного SEO (решение владельца 14.10.2026: «исправь обе правки»):
// 1) двойное «купить» в seoTitle трёх радиомостов Dahua и DS-2CD1047G3-LIUF;
// 2) кросс на 8 портов с 3699db5 — настенный IP20, а slug/modelCode говорили «уличный»:
//    pxt-odf-kross-ulichnyi-8-port → pxt-odf-kross-nastennyi-8-port (308 в removedProducts.ts,
//    ключ в productSeoI18n.json переименован; productI18n.json — по id, не трогается).
// Перед записью сверяет текущие значения с old — расхождение = стоп.
//   npx tsx src/seed-seofix-20261014.ts [--apply | --rollback]
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

type Row = { slug: string; id: string; new: Record<string, unknown>; old: Record<string, unknown> };

const ROWS: Row[] = JSON.parse(readFileSync(new URL("./seed-seofix-20261014.json", import.meta.url), "utf8"));
const apply = process.argv.includes("--apply");
const rollback = process.argv.includes("--rollback");

async function main() {
  initModels();
  await connectDb();
  for (const r of ROWS) {
    const p = await Product.findByPk(r.id);
    if (!p) throw new Error(`нет товара ${r.slug}`);
    const [from, to] = rollback ? [r.new, r.old] : [r.old, r.new];
    for (const [k, v] of Object.entries(from)) {
      if ((p as any)[k] !== v) throw new Error(`${r.slug}: ${k} = «${(p as any)[k]}», ожидалось «${v}»`);
    }
    for (const [k, v] of Object.entries(to)) console.log(`${r.slug}  ${k}: «${(p as any)[k]}» → «${v}»`);
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
