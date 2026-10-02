/* Вторая партия названий 02.10.2026 (после сплошной проверки 3254×5): переводы tr/zh/uz там, где
 * стояло английское название (~150 товаров; коммутаторы «Марка Модель PoE switch» — нормальный
 * турецкий, их не трогали), обрезанные en-названия («HDMI splitter HDMI 4K 1-2 (1») и 42 русских
 * названия с мусором, найденные попутно («Патч-панель Патч панель 24ch 5 cat», «Cloud Poe 4+2 MB»,
 * «для ЮНИТ 600mm», «3 гнезд. 2 метр»…). Решение владельца 02.10.2026.
 * Данные — seed-names-trzh-20261002.json (ключ = id; здесь пишется только поле ru, переводы —
 * в apps/web/src/data/productI18n.json). Slug не меняется.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-names-trzh-20261002.ts [--apply] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { ru?: string; slug?: string; seoTitle?: string; charDrop?: string[] }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-names-trzh-20261002.json"), "utf8"));

async function main() {
  initModels();
  await connectDb();
  let todo = 0;
  for (const [id, n] of Object.entries(MAP)) {
    if (!n.ru) continue; // только переводы — их пишет productI18n.json
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${id}: НЕ НАЙДЕН`); continue; }
    if (n.ru!.length > 200) { console.log(`✗ ${p.slug}: длиннее 200 — стоп`); process.exit(1); }
    let changed = false;
    if (p.name !== n.ru!) { console.log(`${p.slug}\n  было  «${p.name}»\n  стало «${n.ru}»${p.seoTitle ? `\n  ⚠ есть seoTitle: «${p.seoTitle}»` : ""}`); p.name = n.ru; changed = true; }
    if (n.seoTitle && p.seoTitle !== n.seoTitle) { console.log(`  ${p.slug}: seoTitle «${p.seoTitle ?? ""}» → «${n.seoTitle}»`); p.seoTitle = n.seoTitle; changed = true; }
    const drop = (n.charDrop ?? []).filter((k) => p.characteristics && k in p.characteristics);
    if (drop.length) {
      console.log(`  ${p.slug}: убрать характеристики ${drop.join(", ")}`);
      const c = { ...p.characteristics }; for (const k of drop) delete c[k];
      p.characteristics = c; p.changed("characteristics", true); changed = true;
    }
    if (!changed) { console.log(`= ${p.slug}: уже так`); continue; }
    todo++;
    if (APPLY) await p.save();
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"} товаров: ${todo}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
