/* Гарантия 3 года на монтажные работы в русских лонгридах категорий (site_pages category:<slug>).
 * Владелец подтвердил срок 10.10.2026; в 11 лонгридах фраза о гарантии на монтаж была без срока
 * («собственная гарантия, условия уточняйте у менеджера»). Переводы uz/en/tr/zh — тем же JSON
 * (seed-warranty-longreads-20261010.json) через apps/web/scripts/apply-warranty-longreads-20261010.py.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-warranty-longreads-20261010.ts [--apply] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { SitePage } from "./models/SitePage.js";

const APPLY = process.argv.includes("--apply");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { ru: { old: string; new: string } }> = JSON.parse(
  readFileSync(join(process.cwd(), "src", "seed-warranty-longreads-20261010.json"), "utf8"),
);

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  let errors = 0;
  const updates: { page: any; content: string }[] = [];
  for (const [slug, { ru }] of Object.entries(MAP)) {
    const page: any = await SitePage.findOne({ where: { key: `category:${slug}` } });
    if (!page) { console.log(`✗ ${slug}: страница не найдена`); errors++; continue; }
    const text: string = page.content ?? "";
    if (text.includes(ru.new) && !text.includes(ru.old)) { console.log(`= ${slug}: уже так`); continue; }
    const n = text.split(ru.old).length - 1;
    if (n !== 1) { console.log(`✗ ${slug}: исходная фраза найдена ${n} раз`); errors++; continue; }
    console.log(`${slug}\n  было  ${ru.old}\n  стало ${ru.new}`);
    updates.push({ page, content: text.replace(ru.old, ru.new) });
    todo++;
  }
  if (errors) { console.log(`\nОШИБОК: ${errors} — ничего не записано`); process.exit(1); }
  if (APPLY) for (const u of updates) { u.page.content = u.content; await u.page.save(); }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
