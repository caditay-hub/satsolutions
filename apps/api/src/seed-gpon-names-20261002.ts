/* Названия GPON OLT SFP C+++ и C++++: «SFP» дважды («Модуль SFP GPON OLT SFP Class …») → «Модуль SFP GPON OLT
 * Class …» — решение владельца 02.10.2026 («исправь»). Переводы uz/en/tr/zh — в productI18n.json.
 * Данные и прежние значения — seed-gpon-names-20261002.json; --rollback возвращает их.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно. Slug не меняется.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-gpon-names-20261002.ts [--apply] [--rollback] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { connectDb, sequelize } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const ROLLBACK = process.argv.includes("--rollback");
type Fields = Record<string, any>;
// запуск из apps/api (см. шапку) — пакет CJS, import.meta здесь недоступен
const MAP: Record<string, { slug: string; set: Fields; old: Fields }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-gpon-names-20261002.json"), "utf8"));
const SQL_FIELDS = ["supplier", "supplierCode"];

// jsonb переставляет ключи — сравниваем характеристики без учёта порядка
const canon = (v: any) => (v && typeof v === "object" ? JSON.stringify(Object.keys(v).sort().map((k) => [k, v[k]])) : String(v ?? ""));
const same = (f: string, a: any, b: any) => (f === "price" ? Number(a) === Number(b) : f === "characteristics" ? canon(a) === canon(b) : (a ?? null) === (b ?? null));
const show = (f: string, v: any) => (f === "description" ? `${String(v ?? "").length} симв.` : f === "characteristics" ? JSON.stringify(v) : f === "price" ? Number(v).toLocaleString("ru-RU") : `«${v ?? "—"}»`);

async function main() {
  initModels();
  await connectDb();
  let todo = 0, fields = 0;
  for (const [id, e] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${e.slug}: НЕ НАЙДЕН`); continue; }
    const [[sup]]: any = await sequelize.query('SELECT supplier, "supplierCode" FROM products WHERE id = :id', { replacements: { id } });
    const cur: Fields = { supplier: sup.supplier, supplierCode: sup.supplierCode };
    const target = ROLLBACK ? e.old : e.set;
    const diff: string[] = [];
    const sqlSet: Fields = {};
    for (const [f, v] of Object.entries(target)) {
      const now = SQL_FIELDS.includes(f) ? cur[f] : p[f];
      if (same(f, now, v)) continue;
      // защита: при прямом прогоне поле должно совпадать с тем, что видели при проверке
      if (!ROLLBACK && f in e.old && !same(f, now, e.old[f]) && !["seoTitle", "seoDescription"].includes(f)) {
        console.log(`✗ ${e.slug}.${f}: на проде уже не то, что при проверке — пропускаю поле`); continue;
      }
      diff.push(`  ${f}: ${show(f, now)} → ${show(f, v)}`);
      if (SQL_FIELDS.includes(f)) sqlSet[f] = v;
      else { p[f] = v; if (f === "characteristics") p.changed("characteristics", true); }
    }
    if (!diff.length) { console.log(`= ${e.slug}: уже так`); continue; }
    console.log(`${e.slug}\n${diff.join("\n")}`);
    todo++; fields += diff.length;
    if (APPLY) {
      await p.save();
      if (Object.keys(sqlSet).length)
        await sequelize.query('UPDATE products SET supplier = :s, "supplierCode" = :c, "updatedAt" = now() WHERE id = :id',
          { replacements: { s: sqlSet.supplier ?? cur.supplier, c: sqlSet.supplierCode ?? cur.supplierCode, id } });
    }
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo} товаров, ${fields} полей${ROLLBACK ? " (откат)" : ""}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
