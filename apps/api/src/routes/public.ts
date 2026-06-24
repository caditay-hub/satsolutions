import { Router } from "express";
import { Op } from "sequelize";
import { Category } from "../models/Category.js";
import { Brand } from "../models/Brand.js";
import { Post } from "../models/Post.js";
import { Product } from "../models/Product.js";
import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Service } from "../models/Service.js";
import { PortfolioCategory } from "../models/PortfolioCategory.js";
import { PortfolioProject } from "../models/PortfolioProject.js";
import { Partner } from "../models/Partner.js";
import { ServiceRequest } from "../models/ServiceRequest.js";
import { SitePage } from "../models/SitePage.js";
import { FeedbackMessage } from "../models/FeedbackMessage.js";
import { ServiceCategory } from "../models/ServiceCategory.js";
import { sequelize } from "../db.js";
import { parseLimit, parsePositiveInt } from "../utils/pagination.js";

// Нормализация значений характеристик: схлопывает регистр, пробелы, пробел между числом
// и единицей («6 кВ»→«6кв») и транслитерирует кириллицу в латиницу — так «6 кВ» = «6KV» = «6kV».
// Применяется в SQL (charNormSql) и в фасетах, и в chars-фильтре /products — должны совпадать.
const CYR_FROM = "абвгдеёзийклмнопрстуфхцыэ";
const CYR_TO = "abvgdeeziiklmnoprstufhcye";
function charNormSql(expr: string): string {
  const collapse = `regexp_replace(lower(btrim(${expr})), '\\s+', ' ', 'g')`;
  const joinUnit = `regexp_replace(${collapse}, '([0-9]) ([a-zа-яё])', '\\1\\2', 'g')`;
  return `translate(${joinUnit}, '${CYR_FROM}', '${CYR_TO}')`;
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
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
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
  if (q) {
    // Поиск по названию/модели/описанию товара + по названию КАТЕГОРИИ и БРЕНДА
    // (чтобы запросы вида «оптика», «hikvision», «шкаф» гарантированно давали товары)
    const ql = q.replace(/'/g, "''");
    where[Op.or] = [
      { name: { [Op.iLike]: `%${q}%` } },
      { modelCode: { [Op.iLike]: `%${q}%` } },
      { shortDescription: { [Op.iLike]: `%${q}%` } },
      sequelize.literal(`"Product"."categoryId" IN (SELECT id FROM categories WHERE name ILIKE '%${ql}%')`),
      sequelize.literal(`"Product"."brandId" IN (SELECT id FROM brands WHERE published = true AND name ILIKE '%${ql}%')`),
    ];
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
    const exists = `EXISTS (SELECT 1 FROM unnest(string_to_array(coalesce("Product"."characteristics"->>'${ek}', ''), ',')) AS _t(tok) WHERE ${charNormSql("_t.tok")} IN (${inList}))`;
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
  res.json({ items: rows, total: count, page, limit });
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

  const repl: any = {};
  if (catIds.length) repl.catIds = catIds;
  if (brandSlugs.length) repl.brandSlugs = brandSlugs;
  if (q) repl.q = `%${q}%`;
  // Сборка WHERE из активных фильтров. Каждый фасет вызывает с исключением своего измерения.
  const cond = (opts?: { type?: boolean; brand?: boolean }) => {
    const c = ["p.published = true"];
    if (opts?.type !== false && catIds.length) c.push(`p."categoryId" IN (:catIds)`);
    if (opts?.brand !== false && brandSlugs.length) c.push(`p."brandId" IN (SELECT id FROM brands WHERE published = true AND LOWER(slug) IN (:brandSlugs))`);
    if (q) c.push(`(p.name ILIKE :q OR p."modelCode" ILIKE :q)`);
    return c.join(" AND ");
  };

  let usdToUzs = 1;
  try { const site = await SitePage.findOne({ where: { key: "site" } }); usdToUzs = pickRate(site?.data) ?? 1; } catch { /* ignore */ }
  const priceSql = `CASE WHEN p."isUsd" = true THEN p.price * ${usdToUzs} ELSE p.price END`;

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
     FROM products p WHERE ${cond()} AND p.price IS NOT NULL AND p.price > 0`,
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
          unnest(string_to_array(regexp_replace(kv.value, '\\s*\\([^)]*\\)', '', 'g'), ',')) AS t(tok)
     WHERE ${cond()} AND kv.key NOT IN ('Артикул','Гарантия','Артикул производителя','Порты','Порты PoE','Дополнительные порты','Размеры','Размер','Габариты','Матрица','Чувствительность','Скорость затвора','Соотношение сигнал/шум','Баланс белого','Электронный затвор','Динамический диапазон','Описание','Комплектация')
       AND char_length(btrim(t.tok)) BETWEEN 2 AND 28
     GROUP BY kv.key, ${charNormSql("t.tok")}`,
    { type: "SELECT" as any, replacements: repl }
  );
  const RARE_MIN = 3; // прячем токены, что есть лишь у 1–2 товаров
  const byKey: Record<string, Array<{ value: string; count: number }>> = {};
  for (const r of charRows as any[]) {
    const value = String(r.display || "").trim();
    if (!value || r.count < RARE_MIN) continue;
    (byKey[r.key] ||= []).push({ value, count: r.count });
  }
  const chars = Object.entries(byKey)
    .map(([key, vals]) => {
      const top = [...vals].sort((a, b) => b.count - a.count).slice(0, 20); // топ-20 по числу товаров
      const total = top.reduce((a, v) => a + v.count, 0);
      const values = top.sort((a, b) => a.value.localeCompare(b.value, "ru")); // показ по алфавиту
      return { key, values, total };
    })
    .filter((c) => c.values.length >= 2) // годный фасет: ≥2 значения остались после чистки
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
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
      status: "NEW"
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
        meta: null
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
      id: Number(created.id),
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
