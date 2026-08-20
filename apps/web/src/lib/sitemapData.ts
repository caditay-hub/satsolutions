// Источник данных для разделённых карт сайта.
//
// Раньше был один /sitemap.xml на 10 400 URL (7,6 МБ) — Google его принимал, но в
// Search Console нельзя было понять, какой ТИП страниц индексируется плохо: товары,
// категории, услуги или кейсы. Теперь карта разбита на 4 тематических файла под общим
// индексом, и в отчёте «Файлы Sitemap» видна статистика по каждому разделу отдельно.
//
// Логика формирования URL (hreflang-альтернаты, дедуп типов, отдельные записи для
// uz/en) полностью сохранена — изменилась только «упаковка».
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

// Стабильная дата сборки: «вечно-сейчашний» lastmod Google со временем игнорирует.
export const GENERATED = new Date();

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

// UZ/EN-версии отдельными записями: одних hreflang-альтернатов Google для обнаружения
// не хватало (GSC у /uz/… — «нет ссылающихся файлов Sitemap»). tr/zh — фолбэк контента,
// их не плодим, они остаются в hreflang.
export function expandLocales(entries: SitemapEntry[]): SitemapEntry[] {
  return entries.flatMap((e) => {
    const langs = (e.alternates?.languages ?? {}) as Record<string, string>;
    return [e, ...["uz", "en"].filter((l) => langs[l]).map((l) => ({ ...e, url: langs[l] }))];
  });
}

// ── 1. Страницы: статика + услуги/отрасли ───────────────────────────────────
const STATIC_ROUTES = [
  "", "/about", "/contact", "/products", "/solutions", "/portfolio",
  "/catalog", "/international", "/returns", "/delivery", "/partners/h3c",
  "/calculator", "/partners/zkteco", "/kits",
];

// umniy-avtobus/parkovka 301-редиректят на статичные /solutions/bus|parking
const LEGACY_SERVICE_SLUGS = new Set(["umniy-avtobus", "parkovka"]);

export async function pagesEntries(): Promise<SitemapEntry[]> {
  const staticRoutes: SitemapEntry[] = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: GENERATED,
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
    alternates: { languages: langAlternates(route) },
  }));

  const staticServiceRoutes: SitemapEntry[] = ALL_SERVICES.map((s) => ({
    url: `${SITE_URL}/solutions/${s.key}`,
    lastModified: GENERATED,
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
    lastModified: GENERATED,
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: { languages: langAlternates(`/kits/${k.slug}`) },
  }));

  return expandLocales([...staticRoutes, ...staticServiceRoutes, ...serviceRoutes, ...kitRoutes]);
}

// ── 2. Каталог: бренды, бренд×тип, группы, типы ─────────────────────────────
export async function catalogEntries(): Promise<SitemapEntry[]> {
  const [{ categories }, { brands }, { pairs }] = await Promise.all([
    getCategories().catch(() => ({ categories: [] as any[] })),
    getBrands().catch(() => ({ brands: [] as any[] })),
    getBrandTypePairs().catch(() => ({ pairs: [] as any[] })),
  ]);

  // Бренды без опубликованных товаров в карту не идут — пустая страница = soft-404.
  const brandRoutes: SitemapEntry[] = brands
    .filter((b: any) => (b.productCount ?? 0) > 0)
    .map((b: any) => ({
      url: `${SITE_URL}/catalog/${b.slug}`,
      lastModified: GENERATED,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: langAlternates(`/catalog/${b.slug}`) },
    }));

  const pairRoutes: SitemapEntry[] = pairs.map((p: any) => {
    const path = `/catalog/${p.brand}/${typeSlug(p.type)}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: GENERATED,
      changeFrequency: "weekly",
      priority: 0.75,
      alternates: { languages: langAlternates(path) },
    };
  });

  const groupRoutes: SitemapEntry[] = CATALOG_GROUPS.map((g) => {
    const path = `/products/group/${typeSlug(g.title)}`;
    return {
      url: `${SITE_URL}${path}`,
      lastModified: GENERATED,
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
      lastModified: GENERATED,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: { languages: langAlternates("/categories") },
    },
    ...Array.from(typeBySlug.values()).map((name) => {
      const path = `/products/type/${typeSlug(name)}`;
      return {
        url: `${SITE_URL}${path}`,
        lastModified: GENERATED,
        changeFrequency: "weekly" as const,
        priority: 0.7,
        alternates: { languages: langAlternates(path) },
      };
    }),
  ];

  return expandLocales([...brandRoutes, ...pairRoutes, ...groupRoutes, ...categoryRoutes]);
}

// ── 3. Товары ───────────────────────────────────────────────────────────────
export async function productEntries(): Promise<SitemapEntry[]> {
  const acc: any[] = [];
  for (let page = 1; page <= 20; page++) {
    const { items, total } = await getProducts(page, 500).catch(() => ({ items: [] as any[], total: 0 }));
    acc.push(...items);
    if (acc.length >= (total || 0) || items.length === 0) break;
  }
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
const BLOG_LOCALES = ["ru", "uz"];

export async function contentEntries(): Promise<SitemapEntry[]> {
  const blogRoutes: SitemapEntry[] = [
    {
      url: `${SITE_URL}/blog`,
      lastModified: GENERATED,
      changeFrequency: "weekly",
      priority: 0.6,
      alternates: { languages: localeAlternates("/blog", BLOG_LOCALES) },
    },
    ...ARTICLES.map((a) => ({
      url: `${SITE_URL}/blog/${a.slug}`,
      lastModified: new Date(a.date),
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
