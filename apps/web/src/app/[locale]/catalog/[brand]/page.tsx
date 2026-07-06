import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBrands } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { localizeBrandDesc, localizeBrandName } from "@/lib/brandI18n";
import { getBrandSeo } from "@/lib/brandSeo";
import { BRAND_CONFIG } from "@/lib/brandConfig";
import { CatalogView } from "../../products/CatalogView";
import { catalogRobots } from "@/lib/catalogRobots";

const SITE = "https://satsolutions.uz";
const locPath = (locale: string, path: string) => `${SITE}${locale === "ru" ? "" : `/${locale}`}${path}`;

export const revalidate = 300;


// ─── metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; brand: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [{ locale, brand }, sp] = await Promise.all([params, searchParams ?? Promise.resolve({})]);
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const cfg = BRAND_CONFIG[brand.toLowerCase()];
  if (!cfg) return { title: tc("productCatalog") };
  // SEO-title из brandSeoI18n («Рубеж в Ташкенте — пожарная сигнализация, купить, цена»),
  // фолбэк — прежний шаблон «{Бренд} — Каталог продукции».
  const seo = getBrandSeo(brand.toLowerCase(), locale);
  const title = seo?.title || `${localizeBrandName(brand.toLowerCase(), cfg.displayName, locale)} — ${tc("productCatalog")}`;
  const description = localizeBrandDesc(brand.toLowerCase(), cfg.description, locale);
  return {
    title,
    description,
    alternates: hreflangAlternates(`/catalog/${brand.toLowerCase()}`, locale),
    openGraph: { title, description, locale: ogLocale(locale), images: ["/og.png"] },
    // Фасет-комбинации (chars/цена/сортировка/страница>1) — noindex,follow, как на type/group
    robots: catalogRobots(sp),
  };
}

// ─── page ─────────────────────────────────────────────────────────────────────
// Страница бренда = тот же каталог /products с рабочим фильтром-сайдбаром, но scope
// зафиксирован на бренде (группа «Бренд» скрыта, показан заголовок/лого бренда).
export default async function BrandCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; brand: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ locale, brand }, sp] = await Promise.all([params, (searchParams ?? Promise.resolve({}))]);
  const brandSlug = brand.toLowerCase();
  const cfg = BRAND_CONFIG[brandSlug];
  if (!cfg) notFound();

  const { brands } = await getBrands().catch(() => ({ brands: [] }));
  const brandInfo = brands.find((b) => b.slug.toLowerCase() === brandSlug);
  const logoUrl = brandInfo?.logoImageUrl ? resolveImageUrl(brandInfo.logoImageUrl) : null;

  const brandName = localizeBrandName(brandSlug, cfg.displayName, locale);
  const seo = getBrandSeo(brandSlug, locale);
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tc("home"), item: locPath(locale, "/") },
      { "@type": "ListItem", position: 2, name: tc("catalogCrumb"), item: locPath(locale, "/catalog") },
      { "@type": "ListItem", position: 3, name: brandName, item: locPath(locale, `/catalog/${brandSlug}`) },
    ],
  };

  // brand задаём принудительно (фикс. scope), __clean=1 — без 301-редиректа.
  const view = await CatalogView({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({ ...sp, brand: brandSlug, __clean: "1" }),
    brandLanding: {
      name: brandName,
      description: localizeBrandDesc(brandSlug, cfg.description, locale),
      logoUrl,
      seo: seo ? { intro: seo.intro, faq: seo.faq } : null,
    },
  } as any);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {view}
    </>
  );
}
