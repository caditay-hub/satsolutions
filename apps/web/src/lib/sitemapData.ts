// Источник данных для разделённых карт сайта.
//
// Раньше был один /sitemap.xml на 10 400 URL (7,6 МБ) — Google его принимал, но в
// Search Console нельзя было понять, какой ТИП страниц индексируется плохо: товары,
// категории, услуги или кейсы. Теперь карта разбита на 4 тематических файла под общим
// индексом, и в отчёте «Файлы Sitemap» видна статистика по каждому разделу отдельно.
//
// Логика формирования URL (hreflang-альтернаты, дедуп типов, отдельные записи для
// каждой локали) полностью сохранена — изменилась только «упаковка».
import { getBrands, getCategories, getPortfolio, getProducts, getServices, getBrandTypePairs } from "@/lib/api";
import { ALL_SERVICES } from "@/lib/servicesData";
import { ARTICLES } from "@/lib/articlesData";
import { typeSlug } from "@/lib/typeSlug";
import { TYPE_REDIRECTS } from "@/lib/typeRedirects";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";

export type SitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "daily" | "weekly" | "monthly";
  priority: number;
  alternates?: { languages: Record<string, string> };
};

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
const LOCALES = ["ru", "uz", "en", "tr", "zh"] as const;
const DEFAULT_LOCALE = "ru";

// Дата последнего значимого изменения статики и лендингов каталога — ПРАВИТЬ ВРУЧНУЮ
// при заметной правке этих страниц. Почему не new Date(): lastmod, который менялся на
// каждой сборке, хотя страница не менялась, Google перестаёт учитывать вовсе — и вместе
// с ним обесцениваются честные даты соседних URL в том же файле.
export const CONTENT_RELEASE = new Date("2026-09-09T00:00:00.000Z");

/** @deprecated историческое имя — им пользуется индекс /sitemap.xml. */
export const GENERATED = CONTENT_RELEASE;

/** Самая свежая из дат; пусто/мусор → дата релиза контента. */
function newestDate(values: Iterable<string | null | undefined>): Date {
  let ms = 0;
  for (const v of values) {
    const t = v ? Date.parse(v) : NaN;
    if (Number.isFinite(t) && t > ms) ms = t;
  }
  return ms ? new Date(ms) : CONTENT_RELEASE;
}

export function langAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    const prefix = loc === DEFAULT_LOCALE ? "" : `/${loc}`;
    languages[loc] = `${SITE_URL}${prefix}${path}` || `${SITE_URL}/`;
  }
  return languages;
}

function localeAlternates(path: string, locales: string[]) {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const prefix = loc === DEFAULT_LOCALE ? "" : `/${loc}`;
    languages[loc] = `${SITE_URL}${prefix}${path}` || `${SITE_URL}/`;
  }
  return languages;
}

// Каждая локаль — отдельной записью: одних hreflang-альтернатов Google для обнаружения
// не хватало (GSC у /uz/… — «нет ссылающихся файлов Sitemap»). tr/zh раньше были
// фолбэком на английский и в карту не попадали; с августа 2026 они переведены целиком
// (товары, услуги, блог, категорийные лонгриды), поэтому идут наравне с остальными.
const EXPAND_LOCALES = ["uz", "en", "tr", "zh"];

export function expandLocales(entries: SitemapEntry[]): SitemapEntry[] {
  return entries.flatMap((e) => {
    const langs = (e.alternates?.languages ?? {}) as Record<string, string>;
    return [e, ...EXPAND_LOCALES.filter((l) => langs[l]).map((l) => ({ ...e, url: langs[l] }))];
  });
}

// ── 1. Страницы: статика + услуги/отрасли ───────────────────────────────────
const STATIC_ROUTES = [
  "", "/about", "/contact", "/products", "/products/new", "/solutions", "/portfolio",
  "/catalog", "/international", "/tenders", "/returns", "/delivery", "/partners/h3c",
  "/calculator", "/partners/zkteco", "/kits", "/faq",
  // /export — хаб экспортного направления: даёт входящие ссылки страницам стран,
  // которые до этого были достижимы только из карты сайта.
  "/export", "/export/tajikistan", "/export/turkmenistan",
];

// umniy-avtobus/parkovka 301-редиректят на статичные /solutions/bus|parking
const LEGACY_SERVICE_SLUGS = new Set(["umniy-avtobus", "parkovka"]);

export async function pagesEntries(): Promise<SitemapEntry[]> {
  const staticRoutes: SitemapEntry[] = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: CONTENT_RELEASE,
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
    alternates: { languages: langAlternates(route) },
  }));

  const staticServiceRoutes: SitemapEntry[] = ALL_SERVICES.map((s) => ({
    url: `${SITE_URL}/solutions/${s.key}`,
    lastModified: CONTENT_RELEASE,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: { languages: langAlternates(`/solutions/${s.key}`) },
  }));

  const { items: services } = await getServices(1, 1000).catch(() => ({ items: [] as any[] }));
  const serviceRoutes: SitemapEntry[] = services
    .filter((s: any) => !LEGACY_SERVICE_SLUGS.has(s.slug))
    .map((s: any) => ({
      url: `${SITE_URL}/solutions/${s.slug}`,
      lastModified: new Date(s.updatedAt),
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: { languages: langAlternates(`/solutions/${s.slug}`) },
    }));

  // Готовые комплекты (kitsData.ts) — контент на 5 локалях
  const { KITS } = await import("./kitsData");
  const kitRoutes: SitemapEntry[] = KITS.map((k) => ({
    url: `${SITE_URL}/kits/${k.slug}`,
    lastModified: CONTENT_RELEASE,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: { languages: langAlternates(`/kits/${k.slug}`) },
  }));

  return expandLocales([...staticRoutes, ...staticServiceRoutes, ...serviceRoutes, ...kitRoutes]);
}

// ── 2. Каталог: бренды, бренд×тип, группы, типы ─────────────────────────────
export async function catalogEntries(): Promise<SitemapEntry[]> {
  const [{ categories }, { brands }, { pairs }, products] = await Promise.all([
    getCategories().catch(() => ({ categories: [] as any[] })),
    getBrands().catch(() => ({ brands: [] as any[] })),
    getBrandTypePairs().catch(() => ({ pairs: [] as any[] })),
    fetchAllProducts(),
  ]);

  // lastmod раздела каталога = самая свежая правка товара внутри него: своего updatedAt
  // у категорий и брендов API не отдаёт, а страница-выдача меняется именно с товарами.
  const brandSlugById = new Map<string, string>();
  for (const b of brands as any[]) if (b.id && b.slug) brandSlugById.set(String(b.id), b.slug);
  const typeNameById = new Map<string, string>();
  for (const c of categories as any[]) if (c.id && c.name) typeNameById.set(String(c.id), c.name);

  const bump = (m: Map<string, number>, key: string | undefined, ms: number) => {
    if (key && (m.get(key) ?? 0) < ms) m.set(key, ms);
  };
  const byBrand = new Map<string, number>();
  const byType = new Map<string, number>();
  const byPair = new Map<string, number>();
  let newestMs = 0;
  for (const p of products) {
    const ms = Date.parse(p.updatedAt);
    if (!Number.isFinite(ms)) continue;
    if (ms > newestMs) newestMs = ms;
    const bSlug = p.brandId ? brandSlugById.get(String(p.brandId)) : undefined;
    const tName = p.categoryId ? typeNameById.get(String(p.categoryId)) : undefined;
    bump(byBrand, bSlug, ms);
    // по slug, а не по имени: разные написания типа дают одну страницу
    bump(byType, tName ? typeSlug(tName) : undefined, ms);
    if (bSlug && tName) bump(byPair, `${bSlug}\u0000${tName}`, ms);
  }
  const at = (ms: number | undefined): Date => (ms ? new Date(ms) : CONTENT_RELEASE);

  // Бренды без опубликованных товаров в карту не идут — пустая страница = soft-404.
  const brandRoutes: SitemapEntry[] = brands
    .filter((b: any) => (b.productCount ?? 0) > 0)
    .map((b: any) => ({
      url: `${SITE_URL}/catalog/${b.slug}`,
      lastModified: at(byBrand.get(b.slug)),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: langAlternates(`/catalog/${b.slug}`) },
    }));

  const pairRoutes: SitemapEntry[] = pairs.map((p: any) => {
    const path = `/catalog/${p.brand}/${typeSlug(p.type)}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: at(byPair.get(`${p.brand}\u0000${p.type}`)),
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: { languages: langAlternates(path) },
    };
  });

  const groupRoutes: SitemapEntry[] = CATALOG_GROUPS.map((g) => {
    const path = `/products/group/${typeSlug(g.title)}`;
    // Группа = несколько типов: берём самый свежий из них.
    const ms = g.types.reduce((acc, t) => Math.max(acc, byType.get(typeSlug(t.n)) ?? 0), 0);
    return {
      url: `${SITE_URL}${path}`,
      lastModified: at(ms),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: langAlternates(path) },
    };
  });

  // Дедуп по SLUG, не по имени: разные написания дают один slug.
  // Слитые типы (TYPE_REDIRECTS) исключаем — редиректам не место в карте.
  const typeBySlug = new Map<string, string>();
  for (const c of categories as any[]) {
    if (!c.name) continue;
    const s = typeSlug(c.name);
    if (!TYPE_REDIRECTS[s] && !typeBySlug.has(s)) typeBySlug.set(s, c.name);
  }
  const categoryRoutes: SitemapEntry[] = [
    {
      url: `${SITE_URL}/categories`,
      lastModified: at(newestMs),
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: langAlternates("/categories") },
    },
    ...Array.from(typeBySlug.values()).map((name) => {
      const path = `/products/type/${typeSlug(name)}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified: at(byType.get(typeSlug(name))),
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: { languages: langAlternates(path) },
      };
    }),
  ];

  return expandLocales([...brandRoutes, ...pairRoutes, ...groupRoutes, ...categoryRoutes]);
}

// ── 3. Товары ───────────────────────────────────────────────────────────────
// Весь каталог постранично. Нужен и карте товаров, и карте каталога (там из updatedAt
// товаров считается lastmod разделов), поэтому вынесен в общий хелпер.
async function fetchAllProducts(): Promise<any[]> {
  const acc: any[] = [];
  for (let page = 1; page <= 20; page++) {
    const { items, total } = await getProducts(page, 500).catch(() => ({ items: [] as any[], total: 0 }));
    acc.push(...items);
    if (acc.length >= (total || 0) || items.length === 0) break;
  }
  return acc;
}

export async function productEntries(): Promise<SitemapEntry[]> {
  const acc = await fetchAllProducts();
  return expandLocales(
    acc.map((p) => ({
      url: `${SITE_URL}/products/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
      alternates: { languages: langAlternates(`/products/${p.slug}`) },
    }))
  );
}

// ── 4. Контент: блог + кейсы ────────────────────────────────────────────────
// Индекс /blog: статьи переведены на все пять локалей (articlesData.loc).
const BLOG_LOCALES = ["ru", "uz", "en", "tr", "zh"];

export async function contentEntries(): Promise<SitemapEntry[]> {
  const blogRoutes: SitemapEntry[] = [
    {
      url: `${SITE_URL}/blog`,
      // индекс блога «меняется» с появлением самой свежей статьи
      lastModified: newestDate(ARTICLES.map((a) => a.updated ?? a.date)),
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: localeAlternates("/blog", BLOG_LOCALES) },
    },
    ...ARTICLES.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.updated ?? a.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: { languages: localeAlternates(`/blog/${a.slug}`, Object.keys(a.loc)) },
    })),
  ];

  const { items: portfolio } = await getPortfolio(1, 1000).catch(() => ({ items: [] as any[] }));
  const portfolioRoutes: SitemapEntry[] = portfolio.map((p: any) => ({
    url: `${SITE_URL}/portfolio/${p.slug}`,
    lastModified: new Date(p.updatedAt),
    changeFrequency: "monthly",
    priority: 0.5,
    alternates: { languages: langAlternates(`/portfolio/${p.slug}`) },
  }));

  return expandLocales([...blogRoutes, ...portfolioRoutes]);
}

// ── Рендер XML (urlset с hreflang) ──────────────────────────────────────────
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map((e) => {
      const alts = Object.entries(e.alternates?.languages ?? {})
        .map(([lang, href]) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${esc(href)}" />`)
        .join("");
      return (
        `<url><loc>${esc(e.url)}</loc>${alts}` +
        `<lastmod>${e.lastModified.toISOString()}</lastmod>` +
        `<changefreq>${e.changeFrequency}</changefreq>` +
        `<priority>${e.priority}</priority></url>`
      );
    })
    .join("\n");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
    `${body}\n</urlset>`
  );
}

export function xmlResponse(xml: string) {
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
