/* Сплошная проверка 69 карточек (недавно привязанные + спорные) — решение владельца 02.10.2026
 * («да, исправляй всё, знак светится, замок сделай обычным»). Отчёт:
 * «Claude outputs/69 товаров — проверка описаний, цен, характеристик — 02.10.2026.xlsx».
 *  • тексты/характеристики: MikroTik GPeR и E50UG (сверено с mikrotik.com), стяжки 91102/91122/91124,
 *    гильза TCT, колпачки RJ-45 ×3, GPON C-Data C++, HDMI-сплиттер, QMP, КСПВ, гирлянда, ADSS-24,
 *    знак ВЫХОД стеклянный, неподтверждённые обещания (лицензия, «30 минут», «сертифицированные»,
 *    протокол OTDR), опечатки («многомодулный» ×5, «Межзданийные», «Микрофон -COOMA»);
 *  • цены/привязки: КС-4, SFP LC20km, RJ-45 цветной 100 шт, Болид С2000М → исп.02, SNR-CPE-W4N (rev.M),
 *    GPON C++ и Рубеж-2ОП R3 → «Цена по запросу» (0), замок 280 кг → обычный, «Замок 280кг магнитный»;
 *  • категории: 6 динамиков → «Оповещение», замок и кнопка выхода → «Замки и СКУД», удлинитель → «ИБП».
 * Переводы uz/en/tr/zh — в productI18n.json, новые значения характеристик — в charValueI18n.json.
 * Данные и прежние значения — seed-audit69-20261002.json; --rollback возвращает прежние.
 * ⚠️ В модели Product нет полей supplier/supplierCode — привязка пишется параметризованным UPDATE.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно. Slug не меняется.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-audit69-20261002.ts [--apply] [--rollback] */
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
const MAP: Record<string, { slug: string; set: Fields; old: Fields }> = JSON.parse(readFileSync(join(process.cwd(), "src", "seed-audit69-20261002.json"), "utf8"));
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
