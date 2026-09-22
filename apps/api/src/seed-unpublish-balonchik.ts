/* Снятие с публикации товара «Цилиндрическая IP-камера Балончик 5mpx» (pro-balonchik-5mpx):
 * цена 18 490 сум без бренда и категории — ошибочная карточка, решение владельца 22.09.2026.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-unpublish-balonchik.ts [--apply] */
import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const SLUGS = process.argv.filter((a) => a.startsWith("pro-")).length
  ? process.argv.filter((a) => a.startsWith("pro-"))
  : ["pro-balonchik-5mpx"];
const APPLY = process.argv.includes("--apply");

async function main() {
  initModels();
  await connectDb();
  for (const slug of SLUGS) {
    const p = await Product.findOne({ where: { slug } });
    if (!p) { console.log(`${slug}: НЕ НАЙДЕН`); continue; }
    console.log(`${slug}: «${p.name}», цена ${(p as any).price}, published=${p.published}`);
    if (!p.published) { console.log("  уже снят"); continue; }
    if (APPLY) { p.published = false; await p.save(); console.log("  → published=false записано"); }
    else console.log("  сухой прогон: будет published=false");
  }
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
