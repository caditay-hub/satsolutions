#!/usr/bin/env node
/**
 * fix-dahua.mjs — приводит товары Dahua в порядок по данным прайс-листа:
 *   • ФОТО      — ставит правильное фото (coverImageUrl) и кладёт файл в uploads;
 *   • НАЗВАНИЯ  — чинит явно неверные названия (--names);
 *   • КАТЕГОРИИ — раскладывает товары по СУЩЕСТВУЮЩИМ категориям из БД,
 *                 создаёт отдельную «Дисплеи» для видеодисплеев (--categories).
 *
 * Сопоставление товаров — по нормализованному коду (без префикса DH-/DHI-).
 * Категории берутся из таблицы categories той же БД — то же, что в левом меню сайта,
 * поэтому синхронизация автоматическая.
 *
 * ЗАПУСК на сервере (где есть БД и папка uploads):
 *   # dry-run (ничего не меняет, печатает план) — DATABASE_URL берётся из env или apps/api/.env
 *   UPLOADS_DIR=/path/to/site/uploads/images node tools/dahua-fix/fix-dahua.mjs
 *   # применить всё:
 *   UPLOADS_DIR=/path/to/site/uploads/images node tools/dahua-fix/fix-dahua.mjs --apply --categories --names
 *   # применить только фото:
 *   UPLOADS_DIR=... node tools/dahua-fix/fix-dahua.mjs --apply
 *
 * ENV: DATABASE_URL, UPLOADS_DIR (папка файлов), PUBLIC_PREFIX (URL-префикс, по умолч. /uploads/images)
 * Зависимость: пакет `pg` (есть в репозитории).
 *
 * ВАЖНО: всегда смотрите вывод dry-run перед --apply. Изменения категорий/имён —
 * только по флагам. Скрипт сам определяет имена колонок (camelCase/snake_case).
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

const PUBLIC_PREFIX = process.env.PUBLIC_PREFIX || "/uploads/images";

// ---- DATABASE_URL: из env или из apps/api/.env проекта ----
function findDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  const candidates = [
    path.resolve(__dirname, "../../apps/api/.env"),
    path.resolve(__dirname, "../../.env"),
  ];
  for (const f of candidates) {
    try {
      const m = fs.readFileSync(f, "utf8").match(/^\s*DATABASE_URL\s*=\s*(.+)\s*$/m);
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {}
  }
  return null;
}
// ---- UPLOADS_DIR: из env или авто-поиск ----
function findUploadsDir() {
  if (process.env.UPLOADS_DIR) return process.env.UPLOADS_DIR;
  const guesses = [
    path.resolve(__dirname, "../../apps/api/uploads/images"),
  ];
  for (const g of guesses) if (fs.existsSync(path.dirname(g))) return g;
  return guesses[0];
}

const DATABASE_URL = findDatabaseUrl();
const UPLOADS_DIR = findUploadsDir();
if (!DATABASE_URL) { console.error("ERROR: не найден DATABASE_URL (env или apps/api/.env)"); process.exit(1); }

const records = JSON.parse(fs.readFileSync(path.join(__dirname, "dahua_products.json"), "utf8"));

const norm = (s) => !s ? "" : String(s).toUpperCase().replace(/DAHUA/g, "")
  .replace(/^[^A-Z0-9]+/, "").replace(/^DHI[-_ ]/, "").replace(/^DH[-_ ]/, "").replace(/[^A-Z0-9]/g, "");
const codeFromName = (name) => {
  const toks = String(name || "").split(/\s+/).filter(t => /[0-9]/.test(t) && /[-/]/.test(t));
  return toks.length ? norm(toks[toks.length - 1]) : "";
};
const slugify = (s) => String(s).toLowerCase().trim()
  .replace(/[^a-z0-9а-яё]+/gi, "-").replace(/^-+|-+$/g, "");

/**
 * Правила категорий: [regex по описанию товара, regex по имени СУЩЕСТВУЮЩЕЙ категории].
 * Берётся первая существующая в БД категория, имя которой совпадает. Порядок важен
 * (специфичные — выше общих). Видеодисплеи обрабатываются отдельно (категория «Дисплеи»).
 */
const CATEGORY_RULES = [
  [/металлоискат/i,                         /металлоискат/i],
  [/вызывн(ая|ую) панель|дверная станция/i, /вызывн/i],
  [/видеодомофон|домофон/i,                 /домофон/i],
  [/внутренний (ip[- ]?)?монитор|монитор видеодомофона|ip-?монитор/i, /внутренн.*монитор|монитор/i],
  [/металлодетектор|досмотр/i,              /досмотр|металл/i],
  [/(xvr|видеорегистратор|видеомагнитофон|nvr)\b/i, /регистратор|nvr|xvr/i],
  [/коммутатор|switch|порт(ов)? poe|оптический/i,  /сетев|коммутатор|передач/i],
  [/датчик|извещател|сигнализац|контрольная панель/i, /сигнализац|датчик|охран/i],
  [/считыватель|контроллер доступа|терминал доступа|учет(а)? рабочего|турникет|шлагбаум|замок/i, /доступ|скуд/i],
  [/проектор/i,                             /проектор|диспле/i],
  [/(ip[- ]?)?(видео)?камера|объектив/i,    /камер|видеонаблюд|hdcvi|сетев/i],
];
const isDisplay = (rec) =>
  /видеодисплей|видеостен|видео-?панель|video ?wall|настенный видеодисплей/i.test(rec.description || "") ||
  /LS\d+UCM/i.test(rec.code || "");

const q = (id) => `"${id}"`;
const db = new Client({ connectionString: DATABASE_URL });

async function colset(table) {
  const r = await db.query(`select column_name from information_schema.columns where table_name=$1`, [table]);
  return new Set(r.rows.map(x => x.column_name));
}

async function main() {
  console.log(`БД: ${DATABASE_URL.replace(/:\/\/[^@]*@/, "://***@")}`);
  console.log(`UPLOADS_DIR: ${UPLOADS_DIR}`);
  await db.connect();

  const pc = await colset("products");
  if (!pc.size) { console.error('ERROR: таблица "products" не найдена'); process.exit(1); }
  const C = {
    cover: pc.has("coverImageUrl") ? "coverImageUrl" : pc.has("cover_image_url") ? "cover_image_url" : null,
    cat:   pc.has("categoryId") ? "categoryId" : pc.has("category_id") ? "category_id" : null,
    chars: pc.has("characteristics") ? "characteristics" : null,
    brand: pc.has("brandId") ? "brandId" : pc.has("brand_id") ? "brand_id" : null,
  };
  if (!C.cover) { console.error("ERROR: нет колонки coverImageUrl"); process.exit(1); }
  console.log("Колонки products:", C);

  const cc = (await colset("categories"));
  const CAT = {
    parent: cc.has("parentId") ? "parentId" : cc.has("parent_id") ? "parent_id" : null,
    brand:  cc.has("brandId") ? "brandId" : cc.has("brand_id") ? "brand_id" : null,
  };

  // товары
  const psel = ["id","name","slug",C.cover,C.cat,C.chars].filter(Boolean).map(q).join(",");
  const { rows: products } = await db.query(`select ${psel} from products`);
  console.log(`Товаров в БД: ${products.length}`);

  // индекс по нормализованному коду
  const index = new Map();
  const add = (k,p) => { if (k && !index.has(k)) index.set(k,p); };
  for (const p of products) {
    add(norm(p.slug), p); add(codeFromName(p.name), p);
    if (C.chars && p[C.chars]) {
      const ch = typeof p[C.chars] === "string" ? safe(p[C.chars]) : p[C.chars];
      for (const v of Object.values(ch||{})) add(norm(v), p);
    }
  }

  // категории
  let cats = [];
  if (DO_CATS) {
    const csel = ["id","name","slug",CAT.parent,CAT.brand].filter(Boolean).map(q).join(",");
    cats = (await db.query(`select ${csel} from categories`)).rows;
    console.log(`Категорий в БД: ${cats.length} -> ${cats.map(c=>c.name).join(" | ")}`);
  }
  const findCat = (re) => cats.find(c => re.test(String(c.name)));
  async function ensureDisplays() {
    let d = cats.find(c => /^дисплеи$/i.test(String(c.name)) || /видеодиспле/i.test(String(c.name)));
    if (d) return d;
    console.log('[КАТЕГ] категории «Дисплеи» нет — будет создана');
    if (!APPLY) return { id: "(new)", name: "Дисплеи", __new: true };
    const cols = ["name","slug"]; const vals = ["Дисплеи", slugify("Дисплеи")]; const ph = ["$1","$2"];
    // brandId Dahua, если есть колонка
    if (CAT.brand) {
      const b = (await db.query(`select id from brands where name ilike 'dahua' limit 1`)).rows[0];
      if (b) { cols.push(CAT.brand); vals.push(b.id); ph.push("$"+vals.length); }
    }
    const r = await db.query(`insert into categories (${cols.map(q).join(",")}) values (${ph.join(",")}) returning id,name`, vals);
    d = r.rows[0]; cats.push(d); return d;
  }

  if (APPLY) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

  let matched=0, miss=[], imgN=0, catN=0, nameN=0, catSkip=[];
  for (const rec of records) {
    const p = index.get(rec.code_norm);
    if (!p) { miss.push(rec.code); continue; }
    matched++;

    // ---- ФОТО ----
    const src = path.join(__dirname, "images", rec.image_file);
    const dest = `dahua-${rec.image_file}`;
    const newCover = `${PUBLIC_PREFIX}/${dest}`;
    if ((p[C.cover]||"") !== newCover) {
      imgN++;
      console.log(`[ФОТО]  ${rec.code} -> ${rec.image_file}${rec.image_flag!=="ok"?` (${rec.image_flag})`:""}`);
      if (APPLY) { fs.copyFileSync(src, path.join(UPLOADS_DIR, dest)); await db.query(`update products set ${q(C.cover)}=$1 where id=$2`,[newCover,p.id]); }
    }

    // ---- КАТЕГОРИЯ ----
    if (DO_CATS && C.cat) {
      let target = null;
      if (isDisplay(rec)) target = await ensureDisplays();
      else for (const [dre, nre] of CATEGORY_RULES) if (dre.test(rec.description||"")) { const c = findCat(nre); if (c) { target = c; break; } }
      if (target && !target.__new && p[C.cat] !== target.id) {
        catN++;
        console.log(`[КАТЕГ] ${rec.code} -> ${target.name}`);
        if (APPLY) await db.query(`update products set ${q(C.cat)}=$1 where id=$2`,[target.id,p.id]);
      } else if (!target) catSkip.push(`${rec.code} (${rec.category_guess})`);
    }

    // ---- НАЗВАНИЕ ----
    if (DO_NAMES && p.name !== rec.suggested_name) {
      nameN++;
      console.log(`[ИМЯ]   "${p.name}" -> "${rec.suggested_name}"`);
      if (APPLY) await db.query(`update products set "name"=$1 where id=$2`,[rec.suggested_name,p.id]);
    }
  }

  console.log("\n=== ИТОГ ===");
  console.log(`Сопоставлено: ${matched}/${records.length}`);
  console.log(`Не найдено в БД (${miss.length}): ${miss.join(", ")||"—"}`);
  console.log(`Фото: ${imgN} | Категории: ${catN} | Названия: ${nameN}`);
  if (DO_CATS && catSkip.length) console.log(`Категория не определена (${catSkip.length}): ${catSkip.join(", ")}`);
  console.log(APPLY ? "\nРЕЖИМ: ПРИМЕНЕНО (--apply)" : "\nDRY-RUN: изменений нет. Добавьте --apply, чтобы записать.");
  await db.end();
}
function safe(s){ try { return JSON.parse(s); } catch { return {}; } }
main().catch(e => { console.error(e); process.exit(1); });
