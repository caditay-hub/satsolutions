import { MetadataRoute } from "next";
import { getBrands, getCategories, getPortfolio, getProducts, getServices } from "@/lib/api";
import { ALL_SERVICES } from "@/lib/servicesData";
import { typeSlug } from "@/lib/typeSlug";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";

const LOCALES = ["ru", "uz", "en", "tr", "zh"] as const;
const DEFAULT_LOCALE = "ru";

// Фиксируется один раз при старте процесса (деплое), а не на каждый запрос.
// Вечно-«сейчашний» lastmod Google со временем игнорирует; для статич. роутов
// нужна стабильная дата сборки. Динамические роуты используют реальный updatedAt.
const GENERATED = new Date();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

    // hreflang-альтернаты для переводимых (интерфейсных) путей
    function langAlternates(path: string) {
        const languages: Record<string, string> = {};
        for (const loc of LOCALES) {
            const prefix = loc === DEFAULT_LOCALE ? "" : `/${loc}`;
            languages[loc] = `${siteUrl}${prefix}${path}` || `${siteUrl}/`;
        }
        return languages;
    }

    // Static routes (переводимый интерфейс → с hreflang)
    const routes = [
        "",
        "/about",
        "/contact",
        "/products",
        "/solutions",
        "/portfolio",
        "/catalog"
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: GENERATED,
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
        alternates: { languages: langAlternates(route) },
    }));

    try {
        // Dynamic routes fetching
        // Все товары: лимит API = 500/стр, поэтому листаем до конца
        async function allProducts() {
            const acc: any[] = [];
            for (let page = 1; page <= 20; page++) {
                const { items, total } = await getProducts(page, 500).catch(() => ({ items: [], total: 0 }));
                acc.push(...items);
                if (acc.length >= (total || 0) || items.length === 0) break;
            }
            return acc;
        }
        const [
            { categories },
            products,
            { brands },
            { items: services },
            { items: portfolio }
        ] = await Promise.all([
            getCategories().catch(() => ({ categories: [] })),
            allProducts(),
            getBrands().catch(() => ({ brands: [] })),
            getServices(1, 1000).catch(() => ({ items: [] })),
            getPortfolio(1, 1000).catch(() => ({ items: [] }))
        ]);

        const brandRoutes = brands.map((b) => ({
            url: `${siteUrl}/catalog/${b.slug}`,
            lastModified: GENERATED,
            changeFrequency: "weekly" as const,
            priority: 0.8,
            alternates: { languages: langAlternates(`/catalog/${b.slug}`) },
        }));

        // Канонические страницы типов = чистые URL /products/type/<slug> (дедуп имён).
        // Старые /products?type=<имя> 301-редиректят сюда; брендовые /categories/<slug> — 308 сюда.
        const typeNames = Array.from(new Set(categories.map((c) => c.name).filter(Boolean)));
        const categoryRoutes = [
            { url: `${siteUrl}/categories`, lastModified: GENERATED, changeFrequency: "weekly" as const, priority: 0.7, alternates: { languages: langAlternates(`/categories`) } },
            ...typeNames.map((name) => {
                const path = `/products/type/${typeSlug(name)}`;
                return {
                    url: `${siteUrl}${path}`,
                    lastModified: GENERATED,
                    changeFrequency: "weekly" as const,
                    priority: 0.7,
                    alternates: { languages: langAlternates(path) },
                };
            }),
        ];

        // Разделы укрупнённых групп /products/group/<slug> — товары всей группы (мультитип).
        const groupRoutes = CATALOG_GROUPS.map((g) => {
            const path = `/products/group/${typeSlug(g.title)}`;
            return {
                url: `${siteUrl}${path}`,
                lastModified: GENERATED,
                changeFrequency: "weekly" as const,
                priority: 0.8,
                alternates: { languages: langAlternates(path) },
            };
        });

        const productRoutes = products.map((p) => ({
            url: `${siteUrl}/products/${p.slug}`,
            lastModified: new Date(p.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.6,
            alternates: { languages: langAlternates(`/products/${p.slug}`) },
        }));

const serviceRoutes = services.map((s) => ({
            url: `${siteUrl}/solutions/${s.slug}`,
            lastModified: new Date(s.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
            alternates: { languages: langAlternates(`/solutions/${s.slug}`) },
        }));

        const portfolioRoutes = portfolio.map((p) => ({
            url: `${siteUrl}/portfolio/${p.slug}`,
            lastModified: new Date(p.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.5,
            alternates: { languages: langAlternates(`/portfolio/${p.slug}`) },
        }));

        // 22 статичные страницы услуг/отраслей (cctv, access, fire, …) — раньше их не было в карте
        const staticServiceRoutes = ALL_SERVICES.map((s) => ({
            url: `${siteUrl}/solutions/${s.key}`,
            lastModified: GENERATED,
            changeFrequency: "monthly" as const,
            priority: 0.7,
            alternates: { languages: langAlternates(`/solutions/${s.key}`) },
        }));

        return [
            ...routes,
            ...brandRoutes,
            ...groupRoutes,
            ...categoryRoutes,
            ...productRoutes,
            ...serviceRoutes,
            ...staticServiceRoutes,
            ...portfolioRoutes
        ];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
