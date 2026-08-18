import { Router } from "express";
import { Op } from "sequelize";
import { matchI18nProductIds } from "../lib/productI18nIndex.js";
import { Category } from "../models/Category.js";
import { Brand } from "../models/Brand.js";
import { Post } from "../models/Post.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Review } from "../models/Review.js";
import { Service } from "../models/Service.js";
import { PortfolioCategory } from "../models/PortfolioCategory.js";
import { PortfolioProject } from "../models/PortfolioProject.js";
import { Partner } from "../models/Partner.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { SitePage } from "../models/SitePage.js";
import { FeedbackMessage } from "../models/FeedbackMessage.js";
import { ServiceCategory } from "../models/ServiceCategory.js";
import { sequelize } from "../db.js";
import { flipLayout } from "../lib/kbLayout.js";
import { parseLimit, parsePositiveInt } from "../utils/pagination.js";

// Нормализация значений характеристик: схлопывает регистр, пробелы, пробел между числом
// и единицей («6 кВ»→«6кв») и транслитерирует кириллицу в латиницу — так «6 кВ» = «6KV» = «6kV».
// Применяется в SQL (charNormSql) и в фасетах, и в chars-фильтре /products — должны совпадать.
const CYR_FROM = "абвгдеёзийклмнопрстуфхцыэ";
const CYR_TO = "abvgdeeziiklmnoprstufhcye";
function charNormSql(expr: string): string {
  // Пробелы убираем ПОЛНОСТЬЮ: «Micro SD до 512 GB» = «microSD до 512GB» —
  // разные написания с пробелами схлопываются в одно значение фасета (display = mode).
  const collapse = `regexp_replace(lower(btrim(${expr})), '\\s+', '', 'g')`;
  const joinUnit = collapse;
  // Нормализация разделителей: дефис/тильда схлопываются, чтобы «RS-485»=«RS485»,
  // «2.8-12»=«2.8~12». Слэш НЕ трогаем (ломает скорости вида 10/100/1000).
  const stripSep = `regexp_replace(${joinUnit}, '[-~]', '', 'g')`;
  return `translate(${stripSep}, '${CYR_FROM}', '${CYR_TO}')`;
}

// Источник токенов значения характеристики: срезаем скобки «(...)» и режем по запятой.
// ВАЖНО: ровно так же токенизируются значения при генерации фасетов (charRows ниже) —
// иначе счётчик фасета и реальная выдача /products расходятся (напр. «до 300m (PoE)»
// попадал в фасет «до 300m», но фильтр его не находил). valueExpr — SQL-выражение значения.
function charTokensSql(valueExpr: string): string {
  return `string_to_array(regexp_replace(coalesce(${valueExpr}, ''), '\\s*\\([^)]*\\)', '', 'g'), ',')`;
}

// Естественная сортировка значений фасета: числовые значения по возрастанию с учётом
// единиц (500GB < 1TB < 12TB; 2.5" < 3.5"; 30 м < 300 м), нечисловые — по алфавиту перед ними.
// Без этого localeCompare даёт «12TB, 1TB, 2TB, 500GB».
function facetNumeric(s: string): number | null {
  const m = s.replace(",", ".").match(/(\d+(?:\.\d+)?)/);
  if (!m) return null;
  let n = parseFloat(m[1]);
  const rest = s.slice((m.index ?? 0) + m[1].length).trimStart().toLowerCase();
  if (/^(тб|tb)/.test(rest)) n *= 1e12;
  else if (/^(гб|gb)/.test(rest)) n *= 1e9;
  else if (/^(мб|mb)/.test(rest)) n *= 1e6;
  else if (/^(кб|kb)/.test(rest)) n *= 1e3;
  else if (/^(км)/.test(rest)) n *= 1e3; // метры как база для расстояний
  return n;
}
function facetValueCmp(a: string, b: string): number {
  const na = facetNumeric(a);
  const nb = facetNumeric(b);
  if (na !== null && nb !== null) return na - nb || a.localeCompare(b, "ru");
  if (na !== null) return 1; // текстовые значения раньше числовых
  if (nb !== null) return -1;
  return a.localeCompare(b, "ru");
}

function pickRate(data: any): number | null {
  const v = data?.usdToUzs;
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

export const publicRouter = Router();

publicRouter.get("/product-types", async (req, res) => {
  const brandSlugs = (typeof req.query.brand === "string" ? req.query.brand : "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const rows = await sequelize.query<any>(
    `SELECT c.name AS name, count(p.id)::int AS count
     FROM products p
     JOIN categories c ON c.id = p."categoryId"
     ${brandSlugs.length ? 'JOIN brands b ON b.id = p."brandId"' : ''}
     WHERE p.published = true ${brandSlugs.length ? 'AND LOWER(b.slug) IN (:brandSlugs)' : ''}
     GROUP BY c.name
     HAVING count(p.id) > 0
     ORDER BY count DESC, c.name ASC`,
    { type: "SELECT" as any, replacements: brandSlugs.length ? { brandSlugs } : {} }
  );
  res.json({ types: rows });
});

publicRouter.get("/categories", async (req, res) => {
  const brandSlug = typeof req.query.brand === "string" ? req.query.brand.trim().toLowerCase() : "";
  if (!brandSlug) {
    // Только категории с опубликованными товарами (+ предки для связности дерева):
    // пустые записи-словарь старой таксономии не должны попадать в sitemap/резолв типов/фасеты.
    const categories = await sequelize.query<any>(
      `WITH RECURSIVE cwp AS (
         SELECT DISTINCT c.*
         FROM categories c
         JOIN products p ON p."categoryId" = c.id AND p.published = true
         UNION
         SELECT pc.*
         FROM categories pc
         JOIN cwp ON pc.id = cwp."parentId"
       )
       SELECT * FROM cwp ORDER BY name ASC`,
      { type: "SELECT" as any }
    );
    return res.json({ categories });
  }

  // Categories that contain products of this brand + all their ancestors (so tree is connected)
  const rows = await sequelize.query<any>(
    `WITH RECURSIVE cwb AS (
       SELECT DISTINCT c.*
       FROM categories c
       JOIN products p ON p."categoryId" = c.id
       JOIN brands b ON p."brandId" = b.id
       WHERE LOWER(b.slug) = :brandSlug
       UNION
       SELECT pc.*
       FROM categories pc
       JOIN cwb ON pc.id = cwb."parentId"
     )
     SELECT * FROM cwb ORDER BY name ASC`,
    {
      type: "SELECT" as any,
      replacements: { brandSlug }
    }
  );
  res.json({ categories: rows });
});

publicRouter.get("/portfolio-categories", async (_req, res) => {
  const categories = await PortfolioCategory.findAll({ order: [["name", "ASC"]] });
  res.json({ categories });
});

publicRouter.get("/service-categories", async (_req, res) => {
  const items = await ServiceCategory.findAll({ order: [["sortOrder", "ASC"]] });
  res.json({ items });
});

publicRouter.get("/brands", async (_req, res) => {
  const brands = await Brand.findAll({ where: { published: true }, order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  // счётчик опубликованных товаров на бренд
  const counts = (await Product.findAll({
    attributes: ["brandId", [sequelize.fn("COUNT", sequelize.col("id")), "cnt"]],
    where: { published: true },
    group: ["brandId"],
    raw: true,
  })) as unknown as Array<{ brandId: string; cnt: string }>;
  const countMap = new Map(counts.map((c) => [c.brandId, Number(c.cnt)]));
  const out = brands.map((b) => ({ ...b.toJSON(), productCount: countMap.get(b.id) ?? 0 }));
  res.json({ brands: out });
});

publicRouter.get("/partners", async (_req, res) => {
  const partners = await Partner.findAll({ where: { published: true }, order: [["sortOrder", "ASC"], ["name", "ASC"]] });
  res.json({ partners });
});

publicRouter.get("/products", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 12, 2000);
  const offset = (page - 1) * limit;

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const brand = typeof req.query.brand === "string" ? req.query.brand.trim() : "";
  const sort = typeof req.query.sort === "string" ? req.query.sort : "default";
  const recommendedRaw = typeof req.query.recommended === "string" ? req.query.recommended.trim().toLowerCase() : "";
  const mp = typeof req.query.mp === "string" ? req.query.mp.trim() : "";
  const audio = typeof req.query.audio === "string" ? req.query.audio.trim() : "";
  const technology = typeof req.query.technology === "string" ? req.query.technology.trim() : "";
  const installationType = typeof req.query.installationType === "string" ? req.query.installationType.trim() : "";
  const priceMin = Number(req.query.priceMin) || 0;
  const priceMax = Number(req.query.priceMax) || 0;
  // chars = JSON {"Ключ":"Значение", ...} — фасетный фильтр по characteristics
  let charsFilter: Array<[string, string[]]> = [];
  try {
    const cj = typeof req.query.chars === "string" ? JSON.parse(req.query.chars) : null;
    if (cj && typeof cj === "object") {
      charsFilter = Object.entries(cj).map(([k, v]) => [String(k), (Array.isArray(v) ? v : [v]).map(String).filter(Boolean)] as [string, string[]]);
    }
  } catch { /* ignore bad chars */ }

  const where: any = { published: true };
  if (recommendedRaw === "1" || recommendedRaw === "true" || recommendedRaw === "yes") {
    where.recommended = true;
  }
  const qf = q ? flipLayout(q) : ""; // раскладка (флип) — нужна и в OR, и позже для corrected-подсказки
  if (q) {
    // Поиск по названию/модели товара + по названию КАТЕГОРИИ и БРЕНДА
    // (чтобы запросы вида «оптика», «hikvision», «шкаф» гарантированно давали товары).
    // shortDescription НЕ матчим — это шум: «датчик» ловил камеры с «PIR датчик» в описании,
    // ИБП, СКУД-контроллеры и т.п. Семантику (датчик→извещатели) даёт умный поиск /search-smart.
    const ql = q.replace(/'/g, "''");
    const or: any[] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { modelCode: { [Op.iLike]: `%${q}%` } },
      // slug тоже: бренды/категории с кириллическими именами (Болид, Рубеж) ищут латиницей
      sequelize.literal(`"Product"."categoryId" IN (SELECT id FROM categories WHERE name ILIKE '%${ql}%' OR slug ILIKE '%${ql}%')`),
      sequelize.literal(`"Product"."brandId" IN (SELECT id FROM brands WHERE published = true AND (name ILIKE '%${ql}%' OR slug ILIKE '%${ql}%'))`),
    ];
    // раскладка клавиатуры: не переключил язык (напр. «ntcnth»=тестер, «вфргф»=dahua) — ищем и по флипу
    if (qf) {
      const qfl = qf.replace(/'/g, "''");
      or.push(
        { name: { [Op.iLike]: `%${qf}%` } },
        { modelCode: { [Op.iLike]: `%${qf}%` } },
        sequelize.literal(`"Product"."categoryId" IN (SELECT id FROM categories WHERE name ILIKE '%${qfl}%')`),
        sequelize.literal(`"Product"."brandId" IN (SELECT id FROM brands WHERE published = true AND name ILIKE '%${qfl}%')`),
      );
    }
    // Локализованные имена (uz/en/tr/zh): «bolid» латиницей должен находить «Болид» —
    // саджест это умеет через productI18nIndex, полная выдача обязана совпадать с ним
    const i18nIds = matchI18nProductIds(q, 500);
    if (i18nIds.length) or.push({ id: { [Op.in]: i18nIds } });
    where[Op.or] = or;
  }

  // MP filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (mp) {
    // Escape mp value to prevent SQL injection
    const escapedMp = mp.replace(/'/g, "''");

    // Use sequelize.literal with JSONB cast to text for proper ILIKE search
    const mpCondition = sequelize.literal(
      `("Product"."characteristics"::text ILIKE '%${escapedMp} MP%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}Мп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}мп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Мегапиксель%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} мегапиксель%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Мегапикселя%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} мегапикселя%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Megapixel%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} megapixel%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} Mп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}M%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} мп%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}М%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp} м%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}MP%' OR ` +
      `"Product"."characteristics"::text ILIKE '%${escapedMp}M%')`
    );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      mpCondition
    ];
  }

  // Audio filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (audio) {
    const audioCondition = audio === "microphone"
      ? sequelize.literal(
        `("Product"."characteristics"::text ILIKE '%микрофон%' OR ` +
        `"Product"."characteristics"::text ILIKE '%микрофона%' OR ` +
        `"Product"."characteristics"::text ILIKE '%microphone%' OR ` +
        `"Product"."characteristics"::text ILIKE '%Встроенный микрофон%' OR ` +
        `"Product"."characteristics"::text ILIKE '%встроенный микрофон%' OR ` +
        `"Product"."characteristics"::text ILIKE '%микрофон встроенный%' OR ` +
        `"Product"."characteristics"::text ILIKE '%аудио вход%' OR ` +
        `"Product"."characteristics"::text ILIKE '%аудио выход%' OR ` +
        `"Product"."characteristics"::text ILIKE '%звук%' OR ` +
        `"Product"."characteristics"::text ILIKE '%audio%')`
      )
      : sequelize.literal(
        `("Product"."characteristics"::text ILIKE '%без микрофона%' OR ` +
        `"Product"."characteristics"::text ILIKE '%no microphone%' OR ` +
        `"Product"."characteristics"::text ILIKE '%без аудио%' OR ` +
        `"Product"."characteristics"::text ILIKE '%no audio%' OR ` +
        `"Product"."characteristics"::text ILIKE '%без звука%' OR ` +
        `"Product"."characteristics"::text ILIKE '%no sound%')`
      );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      audioCondition
    ];
  }

  // Technology filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (technology) {
    // Escape technology value to prevent SQL injection
    const escapedTech = technology.replace(/'/g, "''");

    // Simple pattern matching - search for the exact value user selected
    const techCondition = sequelize.literal(
      `("Product"."characteristics"::text ILIKE '%${escapedTech}%')`
    );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      techCondition
    ];
  }

  // Installation Type filter - filter by characteristics field (JSONB cast to text for ILIKE)
  if (installationType) {
    // Escape installationType value to prevent SQL injection
    const escapedType = installationType.replace(/'/g, "''");

    // Use sequelize.literal with JSONB cast to text for proper ILIKE search
    const installationCondition = sequelize.literal(
      `("Product"."characteristics"::text ILIKE '%${escapedType}%')`
    );

    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      installationCondition
    ];
  }

  // chars facet filter: значение-ячейка режется на токены по «,» и «/», товар проходит,
  // если СОДЕРЖИТ хотя бы один из выбранных токенов (OR внутри параметра, AND между параметрами).
  for (const [k, vals] of charsFilter) {
    if (!vals.length) continue;
    const ek = k.replace(/'/g, "''");
    const inList = vals.map((v) => charNormSql(`'${v.replace(/'/g, "''")}'`)).join(", ");
    const exists = `EXISTS (SELECT 1 FROM unnest(${charTokensSql(`"Product"."characteristics"->>'${ek}'`)}) AS _t(tok) WHERE ${charNormSql("_t.tok")} IN (${inList}))`;
    where[Op.and] = [
      ...(Array.isArray(where[Op.and]) ? where[Op.and] : []),
      sequelize.literal(exists)
    ];
  }

  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  let categoryId: string | null = null;
  if (category) {
    // allow passing either categoryId UUID or category slug
    if (isUuid(category)) {
      const byId = await Category.findByPk(category, { attributes: ["id"] });
      if (byId) categoryId = byId.id;
    } else {
      const bySlug = await Category.findOne({ where: { slug: category }, attributes: ["id"] });
      if (bySlug) categoryId = bySlug.id;
    }
  }
  // type = функциональный тип (имя категории), можно несколько через запятую
  const typeNames = (typeof req.query.type === "string" ? req.query.type : "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  if (typeNames.length && !categoryId) {
    const cats = await sequelize.query<any>(
      `WITH RECURSIVE base AS (
         SELECT id FROM categories WHERE LOWER(name) IN (:names)
         UNION
         SELECT c.id FROM categories c JOIN base ON c."parentId" = base.id
       ) SELECT id FROM base`,
      { type: "SELECT" as any, replacements: { names: typeNames.map((n) => n.toLowerCase()) } }
    );
    const ids = cats.map((c: any) => c.id);
    where.categoryId = { [Op.in]: ids.length ? ids : ["00000000-0000-0000-0000-000000000000"] };
  }
  if (categoryId) {
    // if user clicks parent category, show products for it + its first-level children
    const children = await Category.findAll({ where: { parentId: categoryId }, attributes: ["id"] });
    const ids = [categoryId, ...children.map((c) => c.id)];
    where.categoryId = { [Op.in]: ids };
  }

  const brandSlugs = brand.split(",").map((s) => s.trim()).filter(Boolean);
  if (brandSlugs.length) {
    const uuids = brandSlugs.filter((b) => isUuid(b));
    const slugs = brandSlugs.filter((b) => !isUuid(b));
    const found = await Brand.findAll({
      where: { published: true, [Op.or]: [
        ...(uuids.length ? [{ id: { [Op.in]: uuids } }] : []),
        ...(slugs.length ? [{ slug: { [Op.in]: slugs } }] : []),
      ] } as any,
      attributes: ["id"],
    });
    const ids = found.map((b) => b.id);
    where.brandId = { [Op.in]: ids.length ? ids : ["00000000-0000-0000-0000-000000000000"] };
  }

  // Use site exchange rate so USD prices are converted to UZS for correct ordering
  let usdToUzs = 1;
  try {
    const site = await SitePage.findOne({ where: { key: "site" } });
    usdToUzs = pickRate(site?.data) ?? 1;
  } catch {
    // ignore, fallback to 1
  }

  // Use the same alias ("Product") that Sequelize applies in FROM clause
  const convertedPriceExpr = sequelize.literal(
    `CASE WHEN "Product"."isUsd" = true THEN "Product"."price" * ${usdToUzs} ELSE "Product"."price" END`
  );

  // Price range filter (по сконвертированной в UZS цене)
  const priceSql = `CASE WHEN "Product"."isUsd" = true THEN "Product"."price" * ${usdToUzs} ELSE "Product"."price" END`;
  if (priceMin > 0 || priceMax > 0) {
    const conds: any[] = [sequelize.literal(`"Product"."price" IS NOT NULL AND "Product"."price" > 0`)];
    if (priceMin > 0) conds.push(sequelize.literal(`(${priceSql}) >= ${priceMin}`));
    if (priceMax > 0) conds.push(sequelize.literal(`(${priceSql}) <= ${priceMax}`));
    where[Op.and] = [...(Array.isArray(where[Op.and]) ? where[Op.and] : []), ...conds];
  }

  // Category lookup expression (for grouping products by category in default sort)
  const categoryNameExpr = sequelize.literal(
    `(SELECT name FROM categories WHERE id = "Product"."categoryId")`
  );

  const order: any[] =
    sort === "price_asc"
      ? [[convertedPriceExpr, "ASC"]]
      : sort === "price_desc"
        ? [[convertedPriceExpr, "DESC"]]
        : sort === "name_asc"
          ? [["name", "ASC"]]
          : sort === "name_desc"
            ? [["name", "DESC"]]
            : sort === "old"
              ? [["updatedAt", "ASC"]]
              : sort === "new"
                ? [["updatedAt", "DESC"]]
                // default: by category, then by name — logical grouping
                : [[categoryNameExpr, "ASC"], ["name", "ASC"]];

  const { rows, count } = await Product.findAndCountAll({
    where,
    order,
    limit,
    offset
  });

  // Исправление раскладки: если по оригиналу товаров нет, а результаты есть (значит нашлись по флипу) —
  // сообщаем фронту исправленный запрос → «Показаны результаты по запросу «X»» (как в Google).
  let corrected: string | null = null;
  if (q && qf && count > 0) {
    const qOrig = q.replace(/'/g, "''");
    const origCount = await Product.count({
      where: {
        published: true,
        [Op.or]: [
          { name: { [Op.iLike]: `%${q}%` } },
          { modelCode: { [Op.iLike]: `%${q}%` } },
          sequelize.literal(`"Product"."categoryId" IN (SELECT id FROM categories WHERE name ILIKE '%${qOrig}%')`),
          sequelize.literal(`"Product"."brandId" IN (SELECT id FROM brands WHERE published = true AND name ILIKE '%${qOrig}%')`),
        ],
      },
    });
    if (origCount === 0) corrected = qf;
  }
  res.json({ items: rows, total: count, page, limit, corrected });
});

// Связки бренд×тип с ≥3 опубликованных товаров — источник для SEO-страниц /catalog/[brand]/[type]:
// generateStaticParams, sitemap и рантайм-белый список (страницы-пустышки не создаём).
publicRouter.get("/brand-type-pairs", async (_req, res) => {
  const [rows] = await sequelize.query(
    `SELECT b.slug AS brand, c.name AS type, count(*)::int AS count
     FROM products p
     JOIN brands b ON b.id = p."brandId" AND b.published = true
     JOIN categories c ON c.id = p."categoryId"
     WHERE p.published = true
     GROUP BY b.slug, c.name
     HAVING count(*) >= 3
     ORDER BY b.slug, count(*) DESC`,
  );
  res.set("Cache-Control", "public, max-age=300");
  res.json({ pairs: rows });
});

// Фасеты каталога (страница типа / бренда / общий список): бренды, типы, цена, характеристики.
// Поддерживает scope = любой набор {type, brand, category, q}. Фасеты «липкие»: список значений
// каждого мультивыбора считается БЕЗ применения его собственного выбора (выбрав один бренд, не
// прячем остальные) — поведение как на nag.ru. characteristics-фасеты — только для одного типа.
publicRouter.get("/product-facets", async (req, res) => {
  const typeNames = (typeof req.query.type === "string" ? req.query.type : "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  const brandSlugs = (typeof req.query.brand === "string" ? req.query.brand : "")
    .split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
  const categoryParam = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  // catIds для scope из type (имена категорий) или из category (slug/id) — рекурсивно с детьми.
  let catIds: string[] = [];
  if (typeNames.length) {
    const cats = await sequelize.query<any>(
      `WITH RECURSIVE base AS (
         SELECT id FROM categories WHERE LOWER(name) IN (:names)
         UNION SELECT c.id FROM categories c JOIN base ON c."parentId" = base.id
       ) SELECT id FROM base`,
      { type: "SELECT" as any, replacements: { names: typeNames.map((n) => n.toLowerCase()) } }
    );
    catIds = cats.map((c: any) => c.id);
  } else if (categoryParam) {
    const cats = await sequelize.query<any>(
      `WITH RECURSIVE base AS (
         SELECT id FROM categories WHERE ${isUuid(categoryParam) ? "id = :cat" : "slug = :cat"}
         UNION SELECT c.id FROM categories c JOIN base ON c."parentId" = base.id
       ) SELECT id FROM base`,
      { type: "SELECT" as any, replacements: { cat: categoryParam } }
    );
    catIds = cats.map((c: any) => c.id);
  }
  // Тип/категорию запросили, но не нашли — пустые фасеты (некорректный scope).
  if ((typeNames.length || categoryParam) && !catIds.length) {
    return res.json({ brands: [], types: [], price: { min: 0, max: 0 }, chars: [] });
  }

  // Активные характеристики и цена — нужны для корректных счётчиков (drill-down):
  // счётчик каждого фасета учитывает ОСТАЛЬНЫЕ активные фильтры, чтобы не показывать
  // «KANIHAD 7», который при активном «Функции=ACL» даёт 0 (у KANIHAD нет ACL-моделей).
  let charsFilter: Array<[string, string[]]> = [];
  try {
    const cj = typeof req.query.chars === "string" ? JSON.parse(req.query.chars) : null;
    if (cj && typeof cj === "object") {
      charsFilter = Object.entries(cj).map(([k, v]) => [String(k), (Array.isArray(v) ? v : [v]).map(String).filter(Boolean)] as [string, string[]]).filter(([, v]) => v.length);
    }
  } catch { /* ignore bad chars */ }
  const priceMin = Number(req.query.priceMin) || 0;
  const priceMax = Number(req.query.priceMax) || 0;

  const qf = flipLayout(q); // раскладка: фасеты должны совпадать с выдачей (напр. «ntcnth»=тестер)
  const repl: any = {};
  if (catIds.length) repl.catIds = catIds;
  if (brandSlugs.length) repl.brandSlugs = brandSlugs;
  if (q) repl.q = `%${q}%`;
  if (qf) repl.qf = `%${qf}%`;

  let usdToUzs = 1;
  try { const site = await SitePage.findOne({ where: { key: "site" } }); usdToUzs = pickRate(site?.data) ?? 1; } catch { /* ignore */ }
  const priceSql = `CASE WHEN p."isUsd" = true THEN p.price * ${usdToUzs} ELSE p.price END`;

  // chars-условия (тот же токенизированный матч, что и в /products) и условия по цене.
  const charsExists = () => charsFilter.map(([k, vals]) => {
    const ek = k.replace(/'/g, "''");
    const inList = vals.map((v) => charNormSql(`'${v.replace(/'/g, "''")}'`)).join(", ");
    return `EXISTS (SELECT 1 FROM unnest(${charTokensSql(`p."characteristics"->>'${ek}'`)}) AS _t(tok) WHERE ${charNormSql("_t.tok")} IN (${inList}))`;
  });
  // Для char-фасета — exclude-self: при подсчёте значений группы G применяем ВСЕ активные
  // char-фильтры, КРОМЕ фильтра самой группы G. В запросе фасета доступен kv.key (группа текущей
  // строки), поэтому условие «(kv.key = G) OR (товар матчит фильтр G)» отключает фильтр только
  // для своей группы и оставляет остальные. Без этого счётчики игнорировали другие выбранные
  // характеристики и показывали комбинации, дающие 0 товаров (H.265 + 2 MP + Bluetooth = 0).
  const charsExclSelf = () => charsFilter.map(([k, vals]) => {
    const ek = k.replace(/'/g, "''");
    const inList = vals.map((v) => charNormSql(`'${v.replace(/'/g, "''")}'`)).join(", ");
    const match = `EXISTS (SELECT 1 FROM unnest(${charTokensSql(`p."characteristics"->>'${ek}'`)}) AS _t(tok) WHERE ${charNormSql("_t.tok")} IN (${inList}))`;
    return `(kv.key = '${ek}' OR ${match})`;
  });
  const priceConds = () => {
    const c: string[] = [];
    if (priceMin > 0 || priceMax > 0) c.push(`p.price IS NOT NULL AND p.price > 0`);
    if (priceMin > 0) c.push(`(${priceSql}) >= ${priceMin}`);
    if (priceMax > 0) c.push(`(${priceSql}) <= ${priceMax}`);
    return c;
  };

  // Сборка WHERE из активных фильтров. Каждый фасет вызывает с исключением СВОЕГО измерения
  // (чтобы выбор не прятал остальные значения той же группы), но применяет все остальные.
  const cond = (opts?: { type?: boolean; brand?: boolean; chars?: boolean; price?: boolean }) => {
    const c = ["p.published = true"];
    if (opts?.type !== false && catIds.length) c.push(`p."categoryId" IN (:catIds)`);
    if (opts?.brand !== false && brandSlugs.length) c.push(`p."brandId" IN (SELECT id FROM brands WHERE published = true AND LOWER(slug) IN (:brandSlugs))`);
    if (q) c.push(`(p.name ILIKE :q OR p."modelCode" ILIKE :q${qf ? ` OR p.name ILIKE :qf OR p."modelCode" ILIKE :qf` : ""})`);
    if (opts?.chars !== false) c.push(...charsExists());
    if (opts?.price !== false) c.push(...priceConds());
    return c.join(" AND ");
  };

  // Бренды — без учёта выбранного бренда (липкий мультивыбор).
  const brands = await sequelize.query<any>(
    `SELECT b.slug, b.name, count(*)::int AS count
     FROM products p JOIN brands b ON b.id = p."brandId"
     WHERE ${cond({ brand: false })} AND b.published = true
     GROUP BY b.slug, b.name ORDER BY count DESC, b.name ASC`,
    { type: "SELECT" as any, replacements: repl }
  );
  // Типы товара — без учёта выбранного типа (липкий мультивыбор). Для общего списка и страниц брендов.
  const types = await sequelize.query<any>(
    `SELECT c.name AS name, count(p.id)::int AS count
     FROM products p JOIN categories c ON c.id = p."categoryId"
     WHERE ${cond({ type: false })}
     GROUP BY c.name HAVING count(p.id) > 0
     ORDER BY count DESC, c.name ASC`,
    { type: "SELECT" as any, replacements: repl }
  );
  const priceRows = await sequelize.query<any>(
    `SELECT floor(min(${priceSql}))::int AS min, ceil(max(${priceSql}))::int AS max
     FROM products p WHERE ${cond({ price: false })} AND p.price IS NOT NULL AND p.price > 0`,
    { type: "SELECT" as any, replacements: repl }
  );

  // characteristics-фасеты имеют смысл только в однородном scope (ровно один тип).
  if (typeNames.length !== 1) {
    return res.json({
      brands,
      types,
      price: priceRows[0] && (priceRows[0] as any).max ? { min: (priceRows[0] as any).min || 0, max: (priceRows[0] as any).max || 0 } : { min: 0, max: 0 },
      chars: []
    });
  }
  // Токенизация значений-списков («VLAN, LAG, QoS», «Radius/Tacacs+») по «,» и «/»:
  // каждый токен — отдельное значение фильтра; считаем РАЗНЫЕ ТОВАРЫ на токен; кириллица/регистр
  // схлопываются в GROUP BY (charNormSql), для показа берём самое частое исходное написание (mode).
  // Перед токенизацией срезаем скобки «(...)» — они дают длинные хвосты и ломают
  // разрез по запятой внутри «(F1.0, AGC ON)». Так значения короче (NAG-стиль) и дубли мержатся.
  const charRows = await sequelize.query<any>(
    `SELECT kv.key AS key,
            mode() WITHIN GROUP (ORDER BY btrim(t.tok)) AS display,
            count(DISTINCT p.id)::int AS count
     FROM products p,
          jsonb_each_text(p.characteristics) AS kv(key, value),
          unnest(${charTokensSql("kv.value")}) AS t(tok)
     WHERE ${cond({ chars: false })}${charsExclSelf().length ? " AND " + charsExclSelf().join(" AND ") : ""} AND kv.key NOT IN ('Артикул','Гарантия','Артикул производителя','Порты','Порты PoE','Дополнительные порты','Размеры','Размер','Габариты','Матрица','Чувствительность','Скорость затвора','Соотношение сигнал/шум','Баланс белого','Электронный затвор','Динамический диапазон','Описание','Комплектация')
       AND char_length(btrim(t.tok)) BETWEEN 2 AND 28
     GROUP BY kv.key, ${charNormSql("t.tok")}`,
    { type: "SELECT" as any, replacements: repl }
  );
  // Порог «редких» токенов: в нефильтрованном виде типа прячем шум (значения у 1–2 товаров).
  // Но как только пользователь сузил выбор (характеристика/бренд/цена), каждое оставшееся
  // значение — это достижимое уточнение; прятать его нельзя, иначе валидная комбинация из
  // 1–2 товаров становится недостижимой через фильтр. Тогда показываем всё с count ≥ 1.
  const narrowed = charsFilter.length > 0 || brandSlugs.length > 0 || priceMin > 0 || priceMax > 0;
  // В маленьких категориях (≤40 товаров) порог «шума» прячет валидные значения
  // (у жёстких дисков 18 товаров — «12TB» с одним товаром исчезал из фильтра).
  const scopeRows = await sequelize.query<any>(
    `SELECT count(*)::int AS n FROM products p WHERE ${cond({})}`,
    { type: "SELECT" as any, replacements: repl }
  );
  const scopeN = (scopeRows[0] as any)?.n ?? 0;
  const RARE_MIN = narrowed || scopeN <= 40 ? 1 : 3;
  const byKey: Record<string, Array<{ value: string; count: number }>> = {};
  for (const r of charRows as any[]) {
    const value = String(r.display || "").trim();
    if (!value || r.count < RARE_MIN) continue;
    (byKey[r.key] ||= []).push({ value, count: r.count });
  }
  // Best-practice фасетов: 3–6 групп на категорию, ~10 значений в группе (остальное «показать ещё»).
  const MAX_GROUPS = 6;
  const MAX_VALUES = 10;
  const chars = Object.entries(byKey)
    .map(([key, vals]) => {
      const sorted = [...vals].sort((a, b) => b.count - a.count);
      const distinct = sorted.length;
      const total = sorted.reduce((a, v) => a + v.count, 0);
      const avg = total / Math.max(distinct, 1);
      // «Качество» фасета: высокое покрытие — хорошо; много разрозненных значений
      // (un-normalized числовые поля «ИК-подсветка: 30,40,50,…») — плохо. Штрафуем кардинальность.
      const score = total / Math.sqrt(distinct);
      const values = sorted.slice(0, MAX_VALUES).sort((a, b) => facetValueCmp(a.value, b.value));
      return { key, values, distinct, avg, score };
    })
    // Годный фасет: ≥2 значения; глушим высоко-кардинальный шум (>14 значений, или тонко
    // размазанные >8 значений при среднем <1.6 товара на значение).
    .filter((c) => c.values.length >= 2 && c.distinct <= 14 && !(c.distinct > 8 && c.avg < 1.6))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_GROUPS)
    .map((c) => ({ key: c.key, values: c.values }));

  res.json({
    brands,
    types,
    price: priceRows[0] && (priceRows[0] as any).max ? { min: (priceRows[0] as any).min || 0, max: (priceRows[0] as any).max || 0 } : { min: 0, max: 0 },
    chars
  });
});

publicRouter.get("/products/:slug", async (req, res) => {
  const product = await Product.findOne({
    where: { slug: req.params.slug, published: true }
  });
  if (!product) return res.status(404).json({ error: "Not found" });
  return res.json({ product });
});

publicRouter.get("/news", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 10, 50);
  const offset = (page - 1) * limit;

  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
  const where: any = { published: true };
  if (q) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${q}%` } },
      { excerpt: { [Op.iLike]: `%${q}%` } }
    ];
  }

  const { rows, count } = await Post.findAndCountAll({
    where,
    order: [["publishedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/news/:slug", async (req, res) => {
  const post = await Post.findOne({ where: { slug: req.params.slug, published: true } });
  if (!post) return res.status(404).json({ error: "Not found" });
  return res.json({ post });
});

import { KeyTechnology } from "../models/KeyTechnology.js"; // Added import

// ...

publicRouter.get("/services", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 50, 200); // Increased limit to fetch all for tree
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const topOnly = req.query.topOnly === "true";
  const offset = (page - 1) * limit;

  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

  const where: any = { published: true };
  if (topOnly) {
    where.parentId = null;
  }
  if (category) {
    if (isUuid(category)) {
      where.serviceCategoryId = category;
    } else {
      const cat = await ServiceCategory.findOne({ where: { slug: category }, attributes: ["id"] });
      if (cat) where.serviceCategoryId = cat.id;
    }
  }

  const { rows, count } = await Service.findAndCountAll({
    where,
    order: [["sortOrder", "ASC"], ["updatedAt", "DESC"]],
    limit,
    offset,
    include: [{ model: ServiceCategory, as: "category", attributes: ["id", "name", "slug"] }]
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/services/:slug", async (req, res) => {
  const item = await Service.findOne({
    where: { slug: req.params.slug, published: true },
    include: [
      {
        model: ServiceCategory,
        as: "category",
        attributes: ["id", "name", "slug", "imageUrl"]
      },
      {
        model: Service,
        as: "children",
        where: { published: true },
        required: false,
        attributes: ["id", "title", "slug", "coverImageUrl", "excerpt", "sortOrder"]
      },
      {
        model: KeyTechnology,
        as: "keyTechnologies",
        required: false,
        attributes: ["id", "title", "description", "secondaryDescription", "imageUrl", "secondaryImageUrl", "sortOrder"]
      }
    ],
    order: [
      [{ model: Service, as: "children" }, "sortOrder", "ASC"],
      [{ model: KeyTechnology, as: "keyTechnologies" }, "sortOrder", "ASC"]
    ]
  });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

publicRouter.get("/portfolio", async (req, res) => {
  const page = parsePositiveInt(req.query.page, 1);
  const limit = parseLimit(req.query.limit, 12, 2000);
  const offset = (page - 1) * limit;

  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  const where: any = { published: true };

  const isUuid = (v: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);
  let categoryId: string | null = null;
  if (category) {
    if (isUuid(category)) {
      const byId = await PortfolioCategory.findByPk(category, { attributes: ["id"] });
      if (byId) categoryId = byId.id;
    } else {
      const bySlug = await PortfolioCategory.findOne({ where: { slug: category }, attributes: ["id"] });
      if (bySlug) categoryId = bySlug.id;
    }
  }
  if (categoryId) {
    // include selected category + ALL descendants (any depth)
    const all = await PortfolioCategory.findAll({ attributes: ["id", "parentId"] });
    const childrenByParent = new Map<string, string[]>();
    for (const c of all as any[]) {
      const pid = c.parentId ? String(c.parentId) : "";
      const arr = childrenByParent.get(pid) ?? [];
      arr.push(String(c.id));
      childrenByParent.set(pid, arr);
    }

    const ids: string[] = [];
    const seen = new Set<string>();
    const q: string[] = [categoryId];
    while (q.length) {
      const cur = q.shift()!;
      if (seen.has(cur)) continue;
      seen.add(cur);
      ids.push(cur);
      const kids = childrenByParent.get(cur) ?? [];
      for (const k of kids) q.push(k);
    }
    where.portfolioCategoryId = { [Op.in]: ids };
  }

  const { rows, count } = await PortfolioProject.findAndCountAll({
    where,
    order: [["sortOrder", "ASC"], ["updatedAt", "DESC"]],
    limit,
    offset
  });
  res.json({ items: rows, total: count, page, limit });
});

publicRouter.get("/portfolio/:slug", async (req, res) => {
  const item = await PortfolioProject.findOne({ where: { slug: req.params.slug, published: true } });
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json({ item });
});

publicRouter.get("/site-pages/:key", async (req, res) => {
  const key = req.params.key;
  // Разрешённые ключи: статичные страницы + лонгриды категорий (category:<slug>)
  const allowed = key === "about" || key === "contact" || key === "site" || /^category:[a-z0-9-]+$/.test(key);
  if (!allowed) return res.status(400).json({ error: "Invalid key" });
  const page = await SitePage.findOne({ where: { key } });
  if (!page) return res.status(404).json({ error: "Not found" });
  res.json({ page });
});

// Feedback (public)
publicRouter.post("/feedback", async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  // gclid — необязательный маркер клика из Google Ads; невалидный молча отбрасываем, заявку не роняем
  const gclidRaw = typeof req.body?.gclid === "string" ? req.body.gclid.trim() : "";
  const gclid = /^[\w.-]{10,200}$/.test(gclidRaw) ? gclidRaw : null;

  if (!message || message.length < 5 || message.length > 3000) return res.status(400).json({ error: "Invalid message" });
  if (name && name.length > 200) return res.status(400).json({ error: "Invalid name" });
  if (phone && (phone.length < 7 || phone.length > 32 || !/^[0-9+()\s-]+$/.test(phone))) return res.status(400).json({ error: "Invalid phone" });
  if (email && (email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ error: "Invalid email" });

  const created = await FeedbackMessage.create(
    {
      name: name || null,
      phone: phone || null,
      email: email || null,
      message,
      status: "NEW",
      gclid
    } as any
  );

  console.log("Feedback created (raw):", created);
  console.log("Feedback created (JSON):", JSON.stringify(created, null, 2));
  console.log("Feedback fields:", {
    id: created.id,
    idType: typeof created.id,
    name: created.name,
    phone: created.phone,
    message: created.message,
    status: created.status,
    createdAt: created.createdAt
  });

  // Emit socket event for real-time notification
  const io = req.app.get('io') || (global as any).io;
  console.log("=== FEEDBACK SOCKET START ===");
  console.log("IO instance check for feedback:", {
    fromApp: !!req.app.get('io'),
    fromGlobal: !!(global as any).io,
    ioExists: !!io
  });

  if (io) {
    const adminNs = io.of('/admin-chat');
    console.log("Admin namespace for feedback:", !!adminNs);

    if (adminNs) {
      // Create a simple object to avoid serialization issues
      const eventData = {
        id: String(created.id), // UUID string, not number
        name: created.name,
        phone: created.phone,
        email: created.email,
        message: created.message,
        createdAt: String(created.createdAt || new Date().toISOString())
      };

      console.log("Feedback socket data (cleaned):", eventData);
      console.log("Emitting feedback to admin namespace...");

      adminNs.emit('admin:new_feedback', eventData);
      console.log("Socket event emitted for new feedback to admin namespace");

      // Check if admin namespace has clients
      const sockets = await adminNs.fetchSockets();
      console.log("Connected admin sockets for feedback:", sockets.length);

      // Try broadcasting to all sockets in namespace
      sockets.forEach((socket: any) => {
        console.log("Sending feedback to socket:", socket.id);
        socket.emit('admin:new_feedback', eventData);
      });

      console.log("=== FEEDBACK SOCKET END ===");
    } else {
      console.error("Admin namespace not found for feedback");
    }
  } else {
    console.error("IO instance not found for feedback notification");
  }

  res.status(201).json({ item: { id: created.id, status: created.status, createdAt: created.createdAt } });
});

// Orders (public)
publicRouter.post("/orders", async (req, res) => {
  const phone = typeof req.body?.phone === "string" ? req.body.phone.trim() : "";
  const items = Array.isArray(req.body?.items) ? req.body.items : [];
  const custName = typeof req.body?.name === "string" ? req.body.name.trim().slice(0, 200) : "";
  const comment = typeof req.body?.comment === "string" ? req.body.comment.trim().slice(0, 2000) : "";
  const orderGclidRaw = typeof req.body?.gclid === "string" ? req.body.gclid.trim() : "";
  const orderGclid = /^[\w.-]{10,200}$/.test(orderGclidRaw) ? orderGclidRaw : null;

  if (!phone || phone.length < 7 || phone.length > 32) return res.status(400).json({ error: "Invalid phone" });
  if (!/^[0-9+()\s-]+$/.test(phone)) return res.status(400).json({ error: "Invalid phone" });
  if (!items.length) return res.status(400).json({ error: "Cart is empty" });

  const normalized = items
    .map((it: any) => ({
      productId: typeof it?.productId === "string" ? it.productId : "",
      quantity: Number(it?.quantity ?? 0)
    }))
    .filter((it: any) => it.productId && Number.isFinite(it.quantity) && it.quantity > 0)
    .slice(0, 100);

  if (!normalized.length) return res.status(400).json({ error: "Invalid items" });

  // Merge same productIds
  const qtyById = new Map<string, number>();
  for (const it of normalized) qtyById.set(it.productId, (qtyById.get(it.productId) ?? 0) + Math.floor(it.quantity));

  const productIds = Array.from(qtyById.keys());
  const products = await Product.findAll({ where: { id: productIds, published: true } });
  if (products.length !== productIds.length) return res.status(400).json({ error: "Some products not found" });

  const site = await SitePage.findOne({ where: { key: "site" } });
  const usdToUzs = pickRate(site?.data) ?? 1;

  // Build items snapshot + totals
  const rows: Array<{
    productId: string;
    productName: string;
    productSlug: string;
    productCoverImageUrl: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }> = [];

  let total = 0;
  for (const p of products) {
    const quantity = qtyById.get(p.id) ?? 0;
    const base = Number(p.price ?? 0);
    const unitPrice = (p as any).isUsd ? base * usdToUzs : base;
    const lineTotal = unitPrice * quantity;
    total += lineTotal;
    rows.push({
      productId: p.id,
      productName: p.name,
      productSlug: p.slug,
      productCoverImageUrl: p.coverImageUrl ?? null,
      unitPrice,
      quantity,
      lineTotal
    });
  }

  const created = await sequelize.transaction(async (t) => {
    const order = await Order.create(
      {
        phone,
        status: "NEW",
        totalAmount: total,
        currency: "UZS",
        meta: custName || comment ? { name: custName || undefined, comment: comment || undefined } : null,
        gclid: orderGclid
      } as any,
      { transaction: t }
    );

    await OrderItem.bulkCreate(
      rows.map((r) => ({
        orderId: order.id,
        productId: r.productId,
        productName: r.productName,
        productSlug: r.productSlug,
        productCoverImageUrl: r.productCoverImageUrl,
        unitPrice: r.unitPrice,
        quantity: r.quantity,
        lineTotal: r.lineTotal
      })) as any,
      { transaction: t }
    );

    return order;
  });

  // Emit socket event for real-time notification
  const io = req.app.get('io') || (global as any).io;
  console.log("=== ORDER SOCKET START ===");
  console.log("IO instance check for order:", {
    fromApp: !!req.app.get('io'),
    fromGlobal: !!(global as any).io,
    ioExists: !!io
  });

  if (io) {
    // Send to admin namespace (like ChatWidget)
    const adminNs = io.of('/admin-chat');
    const eventData = {
      id: String(created.id), // UUID
      name: custName || '',
      comment: comment || '',
      phone: String(created.phone || ''),
      status: String(created.status || ''),
      totalAmount: Number(created.totalAmount || 0),
      currency: String(created.currency || ''),
      items: rows.map(r => ({
        productName: String(r.productName || ''),
        quantity: Number(r.quantity || 0),
        lineTotal: Number(r.lineTotal || 0)
      })),
      createdAt: String(created.createdAt || new Date().toISOString())
    };

    console.log("Order socket data (cleaned):", eventData);
    console.log("Emitting order to admin namespace...");

    adminNs.emit('admin:new_order', eventData);
    console.log("Socket event emitted for new order to admin namespace");

    // Check if admin namespace has clients
    const sockets = await adminNs.fetchSockets();
    console.log("Connected admin sockets for order:", sockets.length);

    // Try broadcasting to all sockets in namespace
    sockets.forEach((socket: any) => {
      console.log("Sending order to socket:", socket.id);
      socket.emit('admin:new_order', eventData);
    });

    console.log("=== ORDER SOCKET END ===");
  } else {
    console.error("IO instance not found for order notification");
  }

  res.status(201).json({
    order: {
      id: created.id,
      status: created.status,
      totalAmount: created.totalAmount,
      currency: created.currency,
      createdAt: created.createdAt
    }
  });
});

// Reviews (public): приём отзыва → на модерацию (PENDING); выдача — только APPROVED.
publicRouter.post("/reviews", async (req, res) => {
  const ratingRaw = Number(req.body?.rating);
  const rating = Number.isFinite(ratingRaw) ? Math.round(ratingRaw) : 0;
  if (rating < 1 || rating > 5) return res.status(400).json({ error: "Invalid rating" });
  const text = typeof req.body?.text === "string" ? req.body.text.trim().slice(0, 2000) : "";
  const name = typeof req.body?.name === "string" ? req.body.name.trim().slice(0, 120) : "";
  const serviceKey = typeof req.body?.serviceKey === "string" ? req.body.serviceKey.trim().slice(0, 40) : "";
  const productIdRaw = typeof req.body?.productId === "string" ? req.body.productId.trim() : "";
  const productId = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(productIdRaw) ? productIdRaw : "";
  const ip = ((req.headers["x-forwarded-for"] as string) || req.ip || "").split(",")[0].trim();

  // Лёгкая защита от спама: не больше 3 отзывов с одного IP за сутки
  if (ip) {
    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const recent = await Review.count({ where: { createdAt: { [Op.gte]: since } } as any });
    const fromIp = recent > 0 ? await Review.findAll({ where: { createdAt: { [Op.gte]: since } } as any, attributes: ["meta"], raw: true }) : [];
    const cnt = (fromIp as any[]).filter((r) => (r.meta as any)?.ip === ip).length;
    if (cnt >= 3) return res.status(429).json({ error: "Too many reviews, try later" });
  }

  await Review.create({
    rating,
    authorName: name || null,
    text: text || null,
    status: "PENDING",
    serviceKey: serviceKey || null,
    productId: productId || null,
    meta: { ip: ip || undefined, ua: ((req.headers["user-agent"] as string) || "").slice(0, 300) || undefined }
  } as any);
  res.status(201).json({ ok: true });
});

publicRouter.get("/reviews", async (req, res) => {
  const serviceKey = typeof req.query.serviceKey === "string" ? req.query.serviceKey.slice(0, 40) : "";
  const productId = typeof req.query.productId === "string" ? req.query.productId.slice(0, 40) : "";
  const where: any = { status: "APPROVED" };
  if (productId) where.productId = productId;
  else if (serviceKey) where.serviceKey = serviceKey;
  const rows = await Review.findAll({ where, order: [["createdAt", "DESC"]], limit: 60 });
  const count = rows.length;
  const avg = count ? rows.reduce((s, r) => s + Number(r.rating), 0) / count : 0;
  res.json({
    avg: Math.round(avg * 10) / 10,
    count,
    items: rows.map((r) => ({
      id: r.id, rating: r.rating, authorName: r.authorName, text: r.text, serviceKey: r.serviceKey, productId: r.productId, createdAt: r.createdAt
    }))
  });
});

// Service request endpoint
publicRouter.post("/service-requests", async (req, res) => {
  try {
    console.log("=== SERVICE REQUEST START ===");
    console.log("Received service request:", req.body);
    const { serviceName, phone, description } = req.body;

    if (!serviceName || !phone) {
      console.log("Missing required fields:", { serviceName, phone });
      return res.status(400).json({ error: "Service name and phone are required" });
    }

    console.log("Creating service request...");
    console.log("Input data:", { serviceName, phone, description });

    const serviceRequest = await ServiceRequest.create({
      serviceName,
      phone,
      description: description || null,
      status: 'pending'
    });

    console.log("Service request created (raw):", serviceRequest);
    console.log("Service request created (JSON):", JSON.stringify(serviceRequest, null, 2));
    console.log("Service request fields:", {
      id: serviceRequest.id,
      idType: typeof serviceRequest.id,
      serviceName: serviceRequest.serviceName,
      serviceNameType: typeof serviceRequest.serviceName,
      phone: serviceRequest.phone,
      phoneType: typeof serviceRequest.phone,
      status: serviceRequest.status,
      statusType: typeof serviceRequest.status,
      createdAt: serviceRequest.createdAt,
      createdAtType: typeof serviceRequest.createdAt
    });

    // Wait a bit for the data to be properly set
    await new Promise(resolve => setTimeout(resolve, 100));

    console.log("Service request after wait:", {
      id: serviceRequest.id,
      serviceName: serviceRequest.serviceName,
      phone: serviceRequest.phone,
      status: serviceRequest.status
    });

    // Emit socket event for real-time notification
    const io = req.app.get('io') || (global as any).io;
    console.log("IO instance check for service request:", {
      fromApp: !!req.app.get('io'),
      fromGlobal: !!(global as any).io,
      ioExists: !!io
    });

    if (io) {
      const adminNs = io.of('/admin-chat');
      console.log("Admin namespace for service request:", !!adminNs);

      if (adminNs) {
        // Create a simple object to avoid serialization issues
        const eventData = {
          id: Number(serviceRequest.get('id')),
          serviceName: String(serviceRequest.get('serviceName') || ''),
          phone: String(serviceRequest.get('phone') || ''),
          status: String(serviceRequest.get('status') || ''),
          createdAt: String(serviceRequest.get('createdAt') || new Date().toISOString())
        };

        console.log("Service request socket data (cleaned):", eventData);
        console.log("Service request data validation:", {
          hasId: !!eventData.id,
          hasServiceName: !!eventData.serviceName,
          hasPhone: !!eventData.phone,
          hasStatus: !!eventData.status,
          hasCreatedAt: !!eventData.createdAt
        });
        console.log("Emitting service request to admin namespace...");

        adminNs.emit('admin:new_service_request', eventData);
        console.log("Socket event emitted for new service request to admin namespace");

        // Check if admin namespace has clients
        const sockets = await adminNs.fetchSockets();
        console.log("Connected admin sockets for service request:", sockets.length);

        // Try broadcasting to all sockets in namespace
        sockets.forEach((socket: any) => {
          console.log("Sending service request to socket:", socket.id);
          socket.emit('admin:new_service_request', eventData);
        });

      } else {
        console.error("Admin namespace not found for service request");
      }
    } else {
      console.error("IO instance not found for service request notification");
    }

    res.status(201).json({
      success: true,
      message: "Service request created successfully",
      request: {
        id: serviceRequest.id,
        serviceName: serviceRequest.serviceName,
        phone: serviceRequest.phone,
        description: serviceRequest.description,
        status: serviceRequest.status,
        createdAt: serviceRequest.createdAt
      }
    });
  } catch (error) {
    console.error("Error creating service request:", error);
    res.status(500).json({ error: "Failed to create service request" });
  }
});
