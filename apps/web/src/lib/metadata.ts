import type { Metadata } from "next";
import { site } from "./site";
import { OG_LOCALE } from "./ogLocale";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

/** Обрезает текст до ~max символов по границе слова (без обрыва посреди слова). */
export function clip(text: string, max = 160): string {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:–—-]+$/, "") + "…";
}

/**
 * og:url = canonical страницы. Обёртка для generateMetadata каждой страницы (05.10.2026):
 * у ~1960 страниц og:url не было вовсе — openGraph страницы целиком заменяет openGraph
 * layout (Next не сливает его по полям), а url в нём никто не ставил.
 * Страницам без своего openGraph собираем его здесь же: иначе подстановка одного url
 * затёрла бы унаследованные из layout title/описание/картинку.
 */
export function withOgUrl<T extends Metadata | null | undefined>(m: T): T {
    if (!m) return m;
    const c = m.alternates?.canonical as string | URL | { url: string | URL } | null | undefined;
    const url = c && typeof c === "object" && "url" in c ? c.url : c;
    if (!url) return m;
    if (m.openGraph) {
        if ((m.openGraph as any).url) return m;
        return { ...m, openGraph: { ...m.openGraph, url } };
    }
    const path = new URL(String(url), siteUrl).pathname.split("/")[1];
    const locale = ["uz", "en", "tr", "zh"].includes(path) ? path : "ru";
    const t = m.title as any;
    const title = typeof t === "string" ? t : t?.absolute ?? t?.default ?? site.name;
    return {
        ...m,
        openGraph: {
            type: "website",
            url,
            siteName: site.name,
            locale: OG_LOCALE[locale],
            title,
            description: typeof m.description === "string" ? m.description : site.description,
            images: [{ url: site.defaultOgImagePath, width: 1200, height: 630, alt: site.name }],
        },
    };
}

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
    const title = overrides?.title || {
        default: site.name,
        template: `%s — ${site.name}`
    };

    const description = typeof overrides?.description === 'string'
        ? overrides.description
        : site.description;

    // og:url = canonical страницы. Раньше здесь всегда стоял адрес главной: 16 270 карточек
    // товаров и страницы без своего openGraph (наследуют layout) отдавали og:url=https://satsolutions.uz
    // (сплошной обход 02.10.2026). Нет canonical (layout) — og:url не ставим вовсе, чтобы его не
    // наследовали дочерние страницы.
    const canonical = overrides?.alternates?.canonical as string | URL | { url: string | URL } | null | undefined;
    const ogUrl = (overrides?.openGraph as any)?.url
        ?? (canonical && typeof canonical === 'object' && 'url' in canonical ? canonical.url : canonical)
        ?? undefined;

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        // meta keywords убраны 18.09.2026: поисковики их не учитывают, а русский
        // список на китайских и турецких страницах смешивал языковой сигнал.
        authors: [{ name: "SAT Solutions" }],
        creator: "SAT Solutions",
        publisher: "SAT Solutions",
        // Подтверждение владения для Bing Webmaster Tools (кабинет заведён 10.09.2026).
        // Тег нужен постоянно: Bing периодически перепроверяет владение и снимает сайт,
        // если подтверждение исчезло. Индекс Bing — источник ответов поиска ChatGPT и Copilot.
        verification: { other: { "msvalidate.01": "8B426810555837A71D264757187B02D2" } },
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
            ...(ogUrl ? { url: ogUrl } : {}),
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
