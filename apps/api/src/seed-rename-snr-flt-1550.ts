/* SNR-FLT-1550: в русском названии стояло английское слово («Оптический consolidation Модуль
 * (фильтр)… 1.0m, 3.0mm; Com/CATV: …») — название уходит в title страницы. Переименование
 * по решению владельца 02.10.2026 + ручные seoTitle/seoDescription (без цены — её добавляет
 * шаблон). Переводы имени — apps/web/src/data/productI18n.json. Slug не меняется.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-rename-snr-flt-1550.ts [--apply] */
import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const SLUG = "pxt-snr-flt-1550";
const NEXT = {
  name: "Оптический фильтр-консолидатор SNR-FLT-1550 (WDM): CATV 1550 нм — SC/APC, данные 1310/1490 нм — SC/UPC, хвост 1,0 м, 3,0 мм",
  seoTitle: "Оптический WDM-фильтр SNR-FLT-1550 для CATV и PON — купить в Ташкенте",
  seoDescription: "Фильтр-консолидатор SNR-FLT-1550: CATV 1550 нм (SC/APC) и данные GPON 1310/1490 нм (SC/UPC) по одному волокну, хвост 1,0 м.",
};

async function main() {
  initModels();
  await connectDb();
  const p: any = await Product.findOne({ where: { slug: SLUG } });
  if (!p) { console.log(`${SLUG}: НЕ НАЙДЕН`); process.exit(1); }
  let changed = 0;
  for (const [k, v] of Object.entries(NEXT)) {
    if ((p[k] ?? "") === v) { console.log(`= ${k}: уже так`); continue; }
    console.log(`${k}:\n  было  «${p[k] ?? ""}»\n  стало «${v}» (${v.length})`);
    p[k] = v; changed++;
  }
  if (!changed) { console.log("изменений нет"); process.exit(0); }
  if (APPLY) { await p.save(); console.log("ЗАПИСАНО"); } else console.log("сухой прогон — ничего не записано");
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
