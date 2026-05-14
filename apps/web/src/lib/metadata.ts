import type { Metadata } from "next";
import { site } from "./site";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
        alternates: overrides?.alternates || {
            canonical: "/"
        },
        openGraph: {
            type: "website",
            locale: site.locale,
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
            title: typeof overrides?.twitter?.title === 'string' ? overrides.twitter.title : site.name,
            description: typeof overrides?.twitter?.description === 'string' ? overrides.twitter.description : site.description,
            images: overrides?.twitter?.images || [site.defaultOgImagePath],
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
