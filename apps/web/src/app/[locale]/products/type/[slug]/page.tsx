import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import { TYPE_REDIRECTS } from "@/lib/typeRedirects";
import { catalogRobots } from "@/lib/catalogRobots";
import { routing } from "@/i18n/routing";
import { localizeCatName } from "@/lib/catalogI18n";
import { ogLocale } from "@/lib/ogLocale";
import { CategoryServiceLink } from "@/components/CategoryServiceLink";
import { CatalogView } from "../../CatalogView";

export const revalidate = 300;

/** slug → точное имя типа (кириллица), по которому фильтруются товары.
 *  Источник = имена категорий (тот же набор, что эмитит sitemap). */
async function resolveTypeName(slug: string): Promise<string | null> {
  try {
    const { categories } = await getCategories();
    const hit = categories.find((c) => c.name && typeSlug(c.name) === slug);
    return hit?.name ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale });
  const name = await resolveTypeName(slug);
  if (!name) return { title: t("nav.products") };
  const locName = localizeCatName(name, locale);
  const title = `${locName} — ${t("product.titleBuy")}`;
  const description = t("product.typeDesc", { type: locName });
  return {
    title,
    description,
    alternates: hreflangAlternates(`/products/type/${slug}`, locale),
    openGraph: { title, description, locale: ogLocale(locale), images: ["/og.png"] },
    robots: catalogRobots(sp),
  };
}

export default async function ProductTypePage({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale, slug } = await params;
  const sp = (await searchParams) ?? {};
  // Слитый при укрупнении тип → 301 на новый канонический slug ДО резолва
  // (надёжно даже если в БД осталась пустая категория-двойник). SEO, без 404.
  const to = TYPE_REDIRECTS[slug];
  if (to) {
    const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
    permanentRedirect(`${lp}/products/type/${to}`);
  }
  const name = await resolveTypeName(slug);
  if (!name) notFound();
  // Переиспользуем рендер каталога /products для type=<name>.
  // ВАЖНО: пробрасываем реальные query-параметры из URL (brand, chars, priceMin/Max,
  // sort, perPage, view, page) — иначе фильтр-фасеты «не работают»: URL меняется, а
  // сервер игнорирует фильтры и отдаёт нефильтрованный список.
  // type и __clean задаём принудительно: type — из slug, __clean=1 глушит 301 обратно сюда.
  const view = await CatalogView({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({ ...sp, type: name, __clean: "1" }),
    pathType: name, // тип закодирован в ПУТИ — отдаём фильтру, чтобы «Тип» был отмечен и работал
  } as any);

  // Перелинковка категория→услуга (см. CategoryServiceLink).
  return (
    <>
      {view}
      <CategoryServiceLink typeName={name} locale={locale} />
    </>
  );
}
