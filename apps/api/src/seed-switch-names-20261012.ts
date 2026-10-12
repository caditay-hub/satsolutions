/* Пять неуправляемых коммутаторов Dahua (PFS3005-5ET-L, PFS3005-5GT-L, PFS3008-8ET-L, PFS3008-8GT-L,
 * SF1008L) назывались «PoE-коммутатор», хотя в их же характеристиках и описаниях PoE нет
 * («не поддерживает PoE», у SF1008L «PoE: Нет»). Покупатель брал бы их для питания камер.
 * Новое RU-название; у 5GT/8GT ещё и краткое описание без мусора из прайса поставщика
 * («Сетевое оборудование, модемы\Коммутаторы, …»). Переводы uz/en/tr/zh — в
 * apps/web/src/data/productI18n.json тем же JSON (seed-switch-names-20261012.json). Slug не меняется.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-switch-names-20261012.ts [--apply] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { ru: { name: string; shortDescription?: string } }> = JSON.parse(
  readFileSync(join(process.cwd(), "src", "seed-switch-names-20261012.json"), "utf8"),
);

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  for (const [id, { ru }] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${id}: НЕ НАЙДЕН`); continue; }
    const changes: Record<string, string> = {};
    if (p.name !== ru.name) changes.name = ru.name;
    if (ru.shortDescription && p.shortDescription !== ru.shortDescription) changes.shortDescription = ru.shortDescription;
    if (!Object.keys(changes).length) { console.log(`= ${p.slug}: уже так`); continue; }
    for (const [k, v] of Object.entries(changes)) console.log(`${p.slug} ${k}\n  было  «${p[k]}»\n  стало «${v}»`);
    todo++;
    if (APPLY) { Object.assign(p, changes); await p.save(); }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
