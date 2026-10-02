/* Перенос 19 товаров кабельного ТВ из «IP-телефонии» в новый тип «Оборудование КТВ»
 * (решение владельца 02.10.2026). В «IP-телефонии» они занимали треть раздела и мешали
 * ему ранжироваться по «ip телефония»; карточки ответвителей вели на услугу IP-телефонии.
 * Создаёт категорию «Оборудование КТВ» (slug pxt-ktv), если её нет, и меняет categoryId
 * только у перечисленных товаров и только если они сейчас в «IP-телефонии».
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-move-ktv.ts [--apply] */
import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const FROM = "IP-телефония";
const TO = { name: "Оборудование КТВ", slug: "pxt-ktv" };
const SLUGS = [
  "pxt-snr-t-112", "pxt-snr-t-114", "pxt-snr-t-116",
  "pxt-snr-t-210", "pxt-snr-t-212", "pxt-snr-t-214", "pxt-snr-t-216", "pxt-snr-t-218",
  "pxt-snr-t-310", "pxt-snr-t-314", "pxt-snr-t-316", "pxt-snr-t-318",
  "pxt-snr-t-418", "pxt-snr-t-616", "pxt-snr-t-816",
  "pxt-snr-splt6", "pxt-vermax-ltp-088-7-is", "pxt-wr1001j",
];

async function main() {
  initModels();
  await connectDb();
  // id категорий на проде и локально разные — резолв строго по имени/slug
  const fromCats = await Category.findAll({ where: { name: FROM } });
  const fromIds = new Set(fromCats.map((c) => c.id));
  let to = await Category.findOne({ where: { slug: TO.slug } });
  if (to && to.name !== TO.name) { console.log(`slug ${TO.slug} занят категорией «${to.name}» — стоп`); process.exit(1); }
  if (!to) {
    console.log(`категория «${TO.name}» (${TO.slug}): будет создана`);
    if (APPLY) { to = await Category.create({ name: TO.name, slug: TO.slug, parentId: null, coverImageUrl: null } as any); console.log(`  создана, id ${to.id}`); }
  } else console.log(`категория «${TO.name}» уже есть, id ${to.id}`);

  let moved = 0, skipped = 0;
  for (const slug of SLUGS) {
    const p = await Product.findOne({ where: { slug } });
    if (!p) { console.log(`✗ ${slug}: НЕ НАЙДЕН`); skipped++; continue; }
    const cur = String((p as any).categoryId);
    if (to && cur === to.id) { console.log(`= ${slug}: уже в «${TO.name}»`); continue; }
    if (!fromIds.has(cur)) { console.log(`✗ ${slug}: не в «${FROM}» — не трогаю`); skipped++; continue; }
    console.log(`→ ${slug}: «${p.name}»`);
    if (APPLY && to) { (p as any).categoryId = to.id; await p.save(); moved++; }
  }
  console.log(`\n${APPLY ? "ПЕРЕНЕСЕНО" : "Сухой прогон, будет перенесено"}: ${APPLY ? moved : SLUGS.length - skipped} из ${SLUGS.length}; пропущено ${skipped}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
