import type { Metadata } from "next";
import { site } from "./site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

/** Обрезает текст до ~max символов по границе слова (без обрыва посреди слова). */
export function clip(text: string, max = 160): string {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:–—-]+$/, "") + "…";
}

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
    const title = overrides?.title || {
        default: site.name,
        template: `%s — ${site.name}`
    };

    const description = typeof overrides?.description === 'string'
        ? overrides.description
        : site.description;

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        keywords: [
            "видеонаблюдение",
            "безопасность",
            "контроль доступа",
            "smart-решения",
            "SAT Solutions",
            "Ташкент",
            "Узбекистан",
            "CCTV",
            "системы безопасности",
            "умный дом"
        ],
        authors: [{ name: "SAT Solutions" }],
        creator: "SAT Solutions",
        publisher: "SAT Solutions",
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        icons: {
            icon: [
                { url: "/icon.png", type: "image/png", sizes: "192x192" },
                { url: "/favicon.ico", sizes: "any" },
            ],
            apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
        },
        alternates: overrides?.alternates,
        openGraph: {
            type: "website",
            locale: (overrides?.openGraph as any)?.locale ?? site.locale,
            url: siteUrl,
            siteName: site.name,
            title: typeof overrides?.openGraph?.title === 'string' ? overrides.openGraph.title : site.name,
            description: typeof overrides?.openGraph?.description === 'string' ? overrides.openGraph.description : site.description,
            images: overrides?.openGraph?.images || [
                {
                    url: site.defaultOgImagePath,
                    width: 1200,
                    height: 630,
                    alt: site.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            // twitter по умолчанию повторяет og (иначе при шере товара/категории в X — обезличенная карточка)
            title: typeof overrides?.twitter?.title === 'string'
                ? overrides.twitter.title
                : (typeof overrides?.openGraph?.title === 'string' ? overrides.openGraph.title : site.name),
            description: typeof overrides?.twitter?.description === 'string'
                ? overrides.twitter.description
                : (typeof overrides?.openGraph?.description === 'string' ? overrides.openGraph.description : site.description),
            images: overrides?.twitter?.images || overrides?.openGraph?.images || [site.defaultOgImagePath],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
