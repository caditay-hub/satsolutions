import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import { localizeCatName } from "@/lib/catalogI18n";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { getGroupSeo } from "@/lib/groupSeo";
import { ogLocale } from "@/lib/ogLocale";
import { catalogRobots } from "@/lib/catalogRobots";
import { CatalogView } from "../../CatalogView";

export const revalidate = 300;

/** slug → индекс укрупнённой группы каталога (по тому же typeSlug, что и в витрине/мегаменю). */
function resolveGroupIdx(slug: string): number {
  return CATALOG_GROUPS.findIndex((g) => typeSlug(g.title) === slug);
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale });
  const idx = resolveGroupIdx(slug);
  if (idx < 0) return { title: t("nav.products") };
  const name = localizeCatName(CATALOG_GROUPS[idx].title, locale);
  const seo = getGroupSeo(locale, slug);
  const title = seo?.title ?? `${name} — ${t("product.titleBuy")}`;
  const description = seo?.desc ?? t("product.typeDesc", { type: name });
  return {
    title,
    description,
    alternates: hreflangAlternates(`/products/group/${slug}`, locale),
    openGraph: { title, description, locale: ogLocale(locale), images: ["/og.png"] },
    robots: catalogRobots(sp),
  };
}

export default async function ProductGroupPage({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale, slug } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale });
  const idx = resolveGroupIdx(slug);
  if (idx < 0) notFound();
  const group = CATALOG_GROUPS[idx];
  const types = group.types.map((t) => t.n);
  const seo = getGroupSeo(locale, slug);
  const groupName = localizeCatName(group.title, locale);
  const siteUrl = "https://satsolutions.uz";
  const base = locale === "ru" ? "" : `/${locale}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("nav.home"), item: `${siteUrl}${base || "/"}` },
      { "@type": "ListItem", position: 2, name: t("nav.catalog"), item: `${siteUrl}${base}/products` },
      { "@type": "ListItem", position: 3, name: groupName, item: `${siteUrl}${base}/products/group/${slug}` },
    ],
  };
  // Раздел = вся группа: показываем товары ВСЕХ типов группы (мультитип type=A,B,C,...).
  // __clean=1 глушит 301 на одиночный тип. Реальные query (brand/chars/price/sort/view/page)
  // пробрасываем — фильтр-сайдбар работает (бренды Болид/Рубеж и т.д. подтянутся).
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {CatalogView({
        params: Promise.resolve({ locale }),
        searchParams: Promise.resolve({ ...sp, type: types.join(","), __clean: "1" }),
        groupLanding: {
          name: groupName,
          idx,
          types,
          ...(seo ? { seoH1: seo.h1, intro: seo.intro, serviceHref: seo.serviceHref, serviceLabel: seo.serviceLabel } : {}),
        },
      } as any)}
    </>
  );
}
