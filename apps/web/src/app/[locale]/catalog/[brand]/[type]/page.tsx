import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBrands, getBrandTypePairs } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import { TYPE_REDIRECTS } from "@/lib/typeRedirects";
import { catalogRobots } from "@/lib/catalogRobots";
import { routing } from "@/i18n/routing";
import { localizeCatName } from "@/lib/catalogI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { ogLocale } from "@/lib/ogLocale";
import { BRAND_CONFIG } from "@/lib/brandConfig";
import { getPairSeo } from "@/lib/pairSeo";
import { CatalogView } from "../../../products/CatalogView";

export const revalidate = 600;

const SITE = "https://satsolutions.uz";
const locPath = (locale: string, path: string) => `${SITE}${locale === "ru" ? "" : `/${locale}`}${path}`;

// Страница бренд×категория («Пожарная сигнализация Рубеж — купить в Ташкенте»).
// Существует ТОЛЬКО для связок с ≥3 товаров (белый список /brand-type-pairs) — пустышек нет.
async function resolvePair(brandSlug: string, slug: string): Promise<{ typeName: string; count: number } | null> {
  try {
    const { pairs } = await getBrandTypePairs();
    const hit = pairs.find((p) => p.brand.toLowerCase() === brandSlug && typeSlug(p.type) === slug);
    return hit ? { typeName: hit.type, count: hit.count } : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; brand: string; type: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { locale, brand, type } = await params;
  const sp = (await searchParams) ?? {};
  const brandSlug = brand.toLowerCase();
  const t = await getTranslations({ locale });
  const cfg = BRAND_CONFIG[brandSlug];
  const pair = cfg ? await resolvePair(brandSlug, type) : null;
  if (!cfg || !pair) return { title: t("nav.products") };
  const brandName = localizeBrandName(brandSlug, cfg.displayName, locale);
  const locType = localizeCatName(pair.typeName, locale);
  const seo = getPairSeo(brandSlug, type, locale);
  const title = seo?.title || `${locType} ${brandName} — ${t("product.titleBuy")}`;
  const description = `${t("product.typeDesc", { type: `${locType} ${brandName}` })}`;
  return {
    title,
    description,
    alternates: hreflangAlternates(`/catalog/${brandSlug}/${type}`, locale),
    openGraph: { title, description, locale: ogLocale(locale), images: ["/og.png"] },
    robots: catalogRobots(sp),
  };
}

export default async function BrandTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; brand: string; type: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale, brand, type }, sp] = await Promise.all([params, (searchParams ?? Promise.resolve({}))]);
  const brandSlug = brand.toLowerCase();
  const cfg = BRAND_CONFIG[brandSlug];
  if (!cfg) notFound();
  // Слитый при укрупнении тип → 308 на канонический slug (та же логика, что /products/type)
  const to = TYPE_REDIRECTS[type];
  if (to) {
    const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
    permanentRedirect(`${lp}/catalog/${brandSlug}/${to}`);
  }
  const pair = await resolvePair(brandSlug, type);
  if (!pair) notFound();

  const { brands } = await getBrands().catch(() => ({ brands: [] }));
  const brandInfo = brands.find((b) => b.slug.toLowerCase() === brandSlug);
  const logoUrl = brandInfo?.logoImageUrl ? resolveImageUrl(brandInfo.logoImageUrl) : null;

  const brandName = localizeBrandName(brandSlug, cfg.displayName, locale);
  const locType = localizeCatName(pair.typeName, locale);
  const h1 = `${locType} ${brandName}`;
  const seo = getPairSeo(brandSlug, type, locale);
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tc("home"), item: locPath(locale, "/") },
      { "@type": "ListItem", position: 2, name: tc("catalogCrumb"), item: locPath(locale, "/catalog") },
      { "@type": "ListItem", position: 3, name: brandName, item: locPath(locale, `/catalog/${brandSlug}`) },
      { "@type": "ListItem", position: 4, name: locType, item: locPath(locale, `/catalog/${brandSlug}/${type}`) },
    ],
  };

  // brand+type фиксируем в scope; __clean=1 глушит канонизирующий 301 внутри каталога.
  const view = await CatalogView({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({ ...sp, brand: brandSlug, type: pair.typeName, __clean: "1" }),
    pathType: pair.typeName,
    brandLanding: { name: h1, description: undefined, logoUrl, seo: null },
    pairSeo: seo ? { intro: seo.intro, faq: seo.faq, heading: h1 } : null,
  } as any);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {view}
    </>
  );
}
