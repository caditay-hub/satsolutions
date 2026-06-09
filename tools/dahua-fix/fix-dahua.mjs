#!/usr/bin/env node
/**
 * fix-dahua.mjs — исправляет фото (и опц. категории/названия) товаров Dahua в БД,
 * используя сопоставление код → правильное фото из прайс-листа.
 *
 * Источник данных: dahua_products.json + папка images/ (рядом с этим файлом).
 * Сопоставление с товарами в БД — по нормализованному коду (игнорируя префиксы DH-/DHI-).
 *
 * ЗАПУСК (из этой папки или указав пути через env):
 *   DATABASE_URL=postgres://user:pass@host:5432/db node fix-dahua.mjs            # dry-run, ничего не меняет
 *   DATABASE_URL=... node fix-dahua.mjs --apply                                  # залить фото и обновить coverImageUrl
 *   DATABASE_URL=... node fix-dahua.mjs --apply --categories                     # + проставить категорию (если найдётся в БД)
 *   DATABASE_URL=... node fix-dahua.mjs --apply --categories --names             # + переписать неверные названия
 *
 * Доп. env:
 *   UPLOADS_DIR   — папка для картинок (по умолчанию ../../apps/api/uploads/images)
 *   PUBLIC_PREFIX — префикс URL (по умолчанию /uploads/images)
 *
 * Требуется пакет `pg` (есть в apps/api). Запускайте из apps/api или установите pg рядом.
 *
 * ВАЖНО: сначала всегда смотрите вывод dry-run. Схема боевой БД может отличаться —
 * скрипт намеренно консервативен и печатает все планируемые изменения.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { Client } = require("pg");

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARGS = new Set(process.argv.slice(2));
const APPLY = ARGS.has("--apply");
const DO_CATS = ARGS.has("--categories");
const DO_NAMES = ARGS.has("--names");

const UPLOADS_DIR = process.env.UPLOADS_DIR
  || path.resolve(__dirname, "../../apps/api/uploads/images");
const PUBLIC_PREFIX = process.env.PUBLIC_PREFIX || "/uploads/images";

const records = JSON.parse(fs.readFileSync(path.join(__dirname, "dahua_products.json"), "utf8"));

// нормализация кода: убрать «dahua», ведущий DH-/DHI-, оставить [A-Z0-9]
function norm(s) {
  if (!s) return "";
  let c = String(s).toUpperCase();
  c = c.replace(/DAHUA/g, "");
  c = c.replace(/^[^A-Z0-9]+/, "");
  c = c.replace(/^DHI[-_ ]/, "").replace(/^DH[-_ ]/, "");
  return c.replace(/[^A-Z0-9]/g, "");
}
// вытащить «кодовый» токен из названия (последний токен с цифрой/дефисом)
function codeFromName(name) {
  if (!name) return "";
  const toks = String(name).split(/\s+/).filter(t => /[0-9]/.test(t) && /[-/]/.test(t));
  return toks.length ? norm(toks[toks.length - 1]) : "";
}

function fail(msg) { console.error("ERROR:", msg); process.exit(1); }

if (!process.env.DATABASE_URL) fail("не задан DATABASE_URL");

const db = new Client({ connectionString: process.env.DATABASE_URL });

async function colset(table) {
  const r = await db.query(
    `select column_name from information_schema.columns where table_name=$1`, [table]);
  return new Set(r.rows.map(x => x.column_name));
}
const q = (id) => `"${id}"`;

async function main() {
  await db.connect();

  // — определяем имена колонок (camelCase у Sequelize по умолчанию) —
  const cols = await colset("products");
  if (cols.size === 0) fail('таблица "products" не найдена — проверьте схему/БД');
  const C = {
    cover: cols.has("coverImageUrl") ? "coverImageUrl" : (cols.has("cover_image_url") ? "cover_image_url" : null),
    cat:   cols.has("categoryId") ? "categoryId" : (cols.has("category_id") ? "category_id" : null),
    chars: cols.has("characteristics") ? "characteristics" : null,
    brand: cols.has("brandId") ? "brandId" : (cols.has("brand_id") ? "brand_id" : null),
  };
  if (!C.cover) fail("в products нет колонки coverImageUrl/cover_image_url");
  console.log("Колонки products:", C);

  // — грузим товары (по возможности только Dahua) —
  const sel = ["id", "name", "slug", C.cover, C.cat, C.chars].filter(Boolean).map(q).join(",");
  const { rows: products } = await db.query(`select ${sel} from products`);
  console.log(`Товаров в БД: ${products.length}`);

  // — индекс по нормализованному коду —
  const index = new Map();
  const addKey = (k, p) => { if (k && !index.has(k)) index.set(k, p); };
  for (const p of products) {
    addKey(norm(p.slug), p);
    addKey(codeFromName(p.name), p);
    if (C.chars && p[C.chars]) {
      const ch = typeof p[C.chars] === "string" ? safeJson(p[C.chars]) : p[C.chars];
      for (const v of Object.values(ch || {})) addKey(norm(v), p);
    }
  }

  // — категории по имени (для --categories) —
  let catByName = new Map();
  if (DO_CATS && C.cat) {
    try {
      const { rows } = await db.query(`select id, name from categories`);
      for (const c of rows) catByName.set(String(c.name).trim().toLowerCase(), c.id);
    } catch { console.warn("Не удалось прочитать categories — категории пропущу."); }
  }

  if (APPLY) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  let matched = 0, missing = [], imgChanged = 0, catChanged = 0, nameChanged = 0;
  for (const rec of records) {
    const p = index.get(rec.code_norm);
    if (!p) { missing.push(rec.code); continue; }
    matched++;

    // фото
    const src = path.join(__dirname, "images", rec.image_file);
    const destName = `dahua-${rec.image_file}`;
    const newCover = `${PUBLIC_PREFIX}/${destName}`;
    const coverDiffers = (p[C.cover] || "") !== newCover;
    if (coverDiffers) {
      imgChanged++;
      console.log(`[ФОТО] ${rec.code}  ->  ${rec.image_file}${rec.image_flag !== "ok" ? "  (флаг: " + rec.image_flag + ")" : ""}`);
      if (APPLY) {
        fs.copyFileSync(src, path.join(UPLOADS_DIR, destName));
        await db.query(`update products set ${q(C.cover)}=$1 where id=$2`, [newCover, p.id]);
      }
    }

    // категория
    if (DO_CATS && C.cat) {
      const cid = catByName.get(rec.category_guess.toLowerCase());
      if (cid && p[C.cat] !== cid) {
        catChanged++;
        console.log(`[КАТЕГ] ${rec.code}  ->  ${rec.category_guess}`);
        if (APPLY) await db.query(`update products set ${q(C.cat)}=$1 where id=$2`, [cid, p.id]);
      } else if (!cid) {
        console.log(`[КАТЕГ?] ${rec.code}: категории «${rec.category_guess}» нет в БД — пропуск`);
      }
    }

    // название
    if (DO_NAMES && p.name !== rec.suggested_name) {
      nameChanged++;
      console.log(`[ИМЯ]   "${p.name}"  ->  "${rec.suggested_name}"`);
      if (APPLY) await db.query(`update products set "name"=$1 where id=$2`, [rec.suggested_name, p.id]);
    }
  }

  console.log("\n=== ИТОГ ===");
  console.log(`Сопоставлено: ${matched}/${records.length}`);
  console.log(`Не найдено в БД (${missing.length}): ${missing.join(", ") || "—"}`);
  console.log(`Будет/обновлено фото: ${imgChanged}, категорий: ${catChanged}, названий: ${nameChanged}`);
  console.log(APPLY ? "\nРЕЖИМ: ПРИМЕНЕНО (--apply)" : "\nРЕЖИМ: DRY-RUN (изменений не внесено). Добавьте --apply, чтобы записать.");

  await db.end();
}
function safeJson(s){ try { return JSON.parse(s); } catch { return {}; } }
main().catch(e => { console.error(e); process.exit(1); });
