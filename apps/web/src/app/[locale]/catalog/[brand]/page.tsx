import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBrands, getBrandTypePairs } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { localizeBrandDesc, localizeBrandName } from "@/lib/brandI18n";
import { getBrandSeo } from "@/lib/brandSeo";
import { BRAND_CONFIG } from "@/lib/brandConfig";
import { CatalogView } from "../../products/CatalogView";
import { catalogRobots } from "@/lib/catalogRobots";
import { CategoryServiceLink } from "@/components/CategoryServiceLink";
import { serviceForCategory } from "@/lib/servicesData";

const SITE = "https://satsolutions.uz";
const locPath = (locale: string, path: string) => `${SITE}${locale === "ru" ? "" : `/${locale}`}${path}`;

// Гео-хвост к H1 бренда: кластер «<бренд> + страна» — самый спросовый и наименее
// конкурентный (hikvision uzbekistan 260/мес), раньше H1 был просто «Hikvision».
const BRAND_H1_GEO: Record<string, string> = {
  ru: "в Узбекистане",
  uz: "O‘zbekistonda",
  en: "in Uzbekistan",
  tr: "Özbekistan’da",
  zh: "乌兹别克斯坦",
};

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
  // Сниппет с наличием и CTA впереди — дожим CTR на позициях 5–8 (страницы с показами в GSC)
  const { brands } = await getBrands().catch(() => ({ brands: [] as Awaited<ReturnType<typeof getBrands>>["brands"] }));
  const stockCount = brands.find((b) => b.slug.toLowerCase() === brand.toLowerCase())?.productCount ?? 0;
  const baseDesc = localizeBrandDesc(brand.toLowerCase(), cfg.description, locale);
  const description = stockCount >= 5 ? `${tc("brandInStock", { count: stockCount })} ${baseDesc}` : baseDesc;
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
      // H1 с гео: спрос идёт как «<бренд> uzbekistan/узбекистан» (hikvision uzbekistan —
      // 260/мес, низкая конкуренция), голый бренд в H1 этот кластер не ловил
      seoH1: `${brandName} ${BRAND_H1_GEO[locale] ?? BRAND_H1_GEO.ru}`,
      description: localizeBrandDesc(brandSlug, cfg.description, locale),
      logoUrl,
      seo: seo ? { intro: seo.intro, faq: seo.faq } : null,
    },
  } as any);
  // Перелинковка бренд→услуга: крупнейший тип бренда, у которого ЕСТЬ профильная услуга
  // (просто топ-тип не годится: у Рубеж/Болид это «Приборы и модули» без услуги → блок пропадал)
  let dominantType: string | null = null;
  try {
    const { pairs } = await getBrandTypePairs();
    dominantType =
      pairs
        .filter((p) => p.brand.toLowerCase() === brandSlug)
        .sort((a, b) => b.count - a.count)
        .map((p) => p.type)
        .find((t) => serviceForCategory(t)) ?? null;
  } catch {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {view}
      <CategoryServiceLink typeName={dominantType} locale={locale} />
    </>
  );
}
