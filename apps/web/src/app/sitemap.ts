import { MetadataRoute } from "next";
import { getCategories, getNews, getPortfolio, getProducts, getServices } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Static routes
    const routes = [
        "",
        "/about",
        "/contact",
        "/categories",
        "/products",
        "/news",
        "/solutions",
        "/portfolio",
        "/support"
    ].map((route) => ({
        url: `${siteUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    try {
        // Dynamic routes fetching
        const [
            { categories },
            { items: products },
            { items: news },
            { items: services },
            { items: portfolio }
        ] = await Promise.all([
            getCategories().catch(() => ({ categories: [] })),
            getProducts(1, 1000).catch(() => ({ items: [] })),
            getNews(1, 1000).catch(() => ({ items: [] })),
            getServices(1, 1000).catch(() => ({ items: [] })),
            getPortfolio(1, 1000).catch(() => ({ items: [] }))
        ]);

        const categoryRoutes = categories.map((c) => ({
            url: `${siteUrl}/products?category=${encodeURIComponent(c.slug)}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.7,
        }));

        const productRoutes = products.map((p) => ({
            url: `${siteUrl}/products/${p.slug}`,
            lastModified: new Date(p.updatedAt),
            changeFrequency: "weekly" as const,
            priority: 0.6,
        }));

        const newsRoutes = news.map((n) => ({
            url: `${siteUrl}/news/${n.slug}`,
            lastModified: new Date(n.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        }));

        const serviceRoutes = services.map((s) => ({
            url: `${siteUrl}/solutions/${s.slug}`,
            lastModified: new Date(s.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        }));

        const portfolioRoutes = portfolio.map((p) => ({
            url: `${siteUrl}/portfolio/${p.slug}`,
            lastModified: new Date(p.updatedAt),
            changeFrequency: "monthly" as const,
            priority: 0.5,
        }));

        return [
            ...routes,
            ...categoryRoutes,
            ...productRoutes,
            ...newsRoutes,
            ...serviceRoutes,
            ...portfolioRoutes
        ];
    } catch (error) {
        console.error("Sitemap generation error:", error);
        return routes;
    }
}
