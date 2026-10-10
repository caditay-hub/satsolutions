/* Перенос солнечной панели Tapo A201 из «Беспроводных камер» в «Кронштейны и аксессуары»
 * (10.10.2026). Панель (184 900) была самым дешёвым товаром раздела камер: фасет отдавал
 * min = 184 900, и в текстах раздела выходило «Wi-Fi камеры от 184 900». Пары «tapo ×
 * аксессуары» не появится — порог пары 3 товара; slug товара не меняется.
 * Меняет categoryId только у A201 и только если она сейчас в «Беспроводных камерах».
 * Старый categoryId пишется в ~/seed-move-a201-backup-<дата>.json до записи.
 * Заодно печатает подозрительные «не-камеры» раздела по названию — только отчёт.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-move-a201.ts [--apply] */
import "dotenv/config";
import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { Op } from "sequelize";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const FROM = "Беспроводные камеры";
const TO = { name: "Кронштейны и аксессуары", slug: "prochee-accessories" };
const SLUG = "tapo-tapo-a201";
const NOT_CAMERA = /панел|кронштейн|крепл|карт[аы] памяти|microsd|адаптер|блок питания|аккумулятор|кабел|подставк|чехол|монитор/i;
// Камеры-комплекты с панелью/монитором в названии — это камеры, не аксессуары
const CAMERA_WORD = /камер|видеонян|комплект/i;

async function main() {
  initModels();
  await connectDb();
  // id категорий на проде и локально разные — резолв строго по имени/slug
  const fromCats = await Category.findAll({ where: { name: FROM } });
  const fromIds = new Set(fromCats.map((c) => c.id));
  const to = await Category.findOne({ where: { slug: TO.slug } });
  if (!to || to.name !== TO.name) { console.log(`категория ${TO.slug} «${TO.name}» не найдена — стоп`); process.exit(1); }
  console.log(`цель: «${to.name}» (${to.slug}), id ${to.id}`);

  const inType = await Product.findAll({ where: { categoryId: { [Op.in]: [...fromIds] } }, order: [["price", "ASC"]] });
  const suspects = inType.filter((p) => p.slug !== SLUG && NOT_CAMERA.test(p.name) && !CAMERA_WORD.test(p.name));
  console.log(`в «${FROM}» товаров: ${inType.length}; подозрительных не-камер кроме A201: ${suspects.length}`);
  for (const p of suspects) console.log(`  ? ${p.slug}: «${p.name}» ${p.price}`);

  const p = await Product.findOne({ where: { slug: SLUG } });
  if (!p) { console.log(`✗ ${SLUG}: НЕ НАЙДЕН`); process.exit(1); }
  const cur = String(p.categoryId);
  if (cur === to.id) { console.log(`= ${SLUG}: уже в «${TO.name}»`); process.exit(0); }
  if (!fromIds.has(cur)) { console.log(`✗ ${SLUG}: не в «${FROM}» (categoryId ${cur}) — не трогаю`); process.exit(1); }
  const fromCat = fromCats.find((c) => c.id === cur)!;
  console.log(`→ ${SLUG}: «${p.name}» ${p.price}, ${fromCat.slug} → ${to.slug}`);
  if (APPLY) {
    const bak = join(homedir(), `seed-move-a201-backup-${new Date().toISOString().slice(0, 10)}.json`);
    writeFileSync(bak, JSON.stringify({ productId: p.id, slug: p.slug, oldCategoryId: cur, oldCategorySlug: fromCat.slug, newCategoryId: to.id, at: new Date().toISOString() }, null, 2));
    console.log(`  бэкап: ${bak}`);
    p.categoryId = to.id;
    await p.save();
    console.log("ПЕРЕНЕСЕНО");
  } else console.log("Сухой прогон: запись только с --apply");
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
