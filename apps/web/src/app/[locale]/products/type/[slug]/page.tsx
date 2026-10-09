import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories, getProductFacets } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import { typeSeoFor, typeLandingFor, needsPrices, fillPrices, type PriceRange } from "@/lib/typeSeo";
import { TYPE_REDIRECTS } from "@/lib/typeRedirects";
import { GROUP_CANONICAL } from "@/lib/groupCanonical";
import { deadTypeTarget } from "@/lib/deadCategories";
import { catalogRobots } from "@/lib/catalogRobots";
import { routing } from "@/i18n/routing";
import { localizeCatName } from "@/lib/catalogI18n";
import { ogLocale } from "@/lib/ogLocale";
import { CategoryServiceLink } from "@/components/CategoryServiceLink";
import { CatalogView } from "../../CatalogView";
import { withOgUrl } from "@/lib/metadata";

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

// Вилка цен раздела для «[[ … {min} … ]]» в SEO-текстах (typeSeo.ts). Фасеты кэшируются
// на 5 мин, как и сам список; при сбое API фрагменты с ценой просто выпадают.
async function priceRangeFor(typeName: string): Promise<PriceRange> {
  try {
    const f = await getProductFacets(typeName);
    return f?.price && f.price.min > 0 ? { min: f.price.min, max: f.price.max } : null;
  } catch {
    return null;
  }
}

async function generateMetadataBase({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale });
  const name = await resolveTypeName(slug);
  if (!name) return { title: t("nav.products") };
  const locName = localizeCatName(name, locale);
  // Приоритетные типы: кастомные title/description под реальные запросы (typeSeo.ts)
  const custom = typeSeoFor(slug, locale);
  const range = custom && needsPrices(custom.title, custom.description) ? await priceRangeFor(name) : null;
  const title = custom?.title ? fillPrices(custom.title, locale, range) : `${locName} — ${t("product.titleBuy")}`;
  const description = custom?.description ? fillPrices(custom.description, locale, range) : t("product.typeDesc", { type: locName });
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
  // Три слага заведены и как группа, и как тип, и обе страницы показывают один и тот
  // же набор товаров с одним и тем же лонгридом. Они конкурировали между собой в
  // выдаче: по «умному дому» группа стояла на 25,0, а тип на 27,8. Канонической
  // оставлена ГРУППА — она в меню и получает семь внутренних ссылок против одной у
  // типа, а по домофонии ещё и шире (72 товара против 53, H1 «Домофоны в Ташкенте»).
  const grouped = GROUP_CANONICAL[slug];
  if (grouped) {
    const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
    permanentRedirect(`${lp}/products/group/${grouped}`);
  }
  const name = await resolveTypeName(slug);
  if (!name) {
    // Живого типа нет — но Google знает эти слаги по исчезнувшим разделам старой
    // таксономии (70 адресов в логах). Проверяем ПОСЛЕ резолва: так рабочий тип
    // не может случайно попасть под редирект.
    const dead = deadTypeTarget(slug);
    if (dead) {
      const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
      permanentRedirect(`${lp}${dead}`);
    }
    notFound();
  }
  // Переиспользуем рендер каталога /products для type=<name>.
  // ВАЖНО: пробрасываем реальные query-параметры из URL (brand, chars, priceMin/Max,
  // sort, perPage, view, page) — иначе фильтр-фасеты «не работают»: URL меняется, а
  // сервер игнорирует фильтры и отдаёт нефильтрованный список.
  // type и __clean задаём принудительно: type — из slug, __clean=1 глушит 301 обратно сюда.
  // Контент-лендинг приоритетных типов (SEO-план 31.08): интро+лонгрид+FAQ на 5 языках
  // едет существующим каналом pairSeo → блок с FAQPage-схемой внизу листинга.
  const rawLanding = typeLandingFor(slug, locale);
  const lrange = rawLanding && needsPrices(rawLanding.intro, ...rawLanding.long, ...rawLanding.faq.flat()) ? await priceRangeFor(name) : null;
  const fp = (x: string) => fillPrices(x, locale, lrange);
  const landing = rawLanding
    ? { intro: fp(rawLanding.intro), long: rawLanding.long.map(fp), faq: rawLanding.faq.map(([q, a]) => [fp(q), fp(a)] as [string, string]) }
    : null;
  const view = await CatalogView({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({ ...sp, type: name, __clean: "1" }),
    listPath: `/products/type/${slug}`,
    listFixed: ["type"],
    pathType: name, // тип закодирован в ПУТИ — отдаём фильтру, чтобы «Тип» был отмечен и работал
    pairSeo: landing
      ? {
          heading: localizeCatName(name, locale),
          intro: [landing.intro, ...landing.long].join("\n\n"),
          faq: landing.faq.map(([q, a]) => ({ q, a })),
        }
      : undefined,
  } as any);

  // Перелинковка категория→услуга (см. CategoryServiceLink).
  return (
    <>
      {view}
      <CategoryServiceLink typeName={name} locale={locale} />
    </>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
