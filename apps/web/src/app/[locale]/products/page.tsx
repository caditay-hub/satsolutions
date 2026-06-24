import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { typeSlug } from "@/lib/typeSlug";
import { getCategories } from "@/lib/api";
import { CatalogView } from "./CatalogView";

// canonical: при активном ТОЛЬКО фильтре категории указываем на индексируемую /categories/[slug]
// (иначе главная/чипы «Уточнить» распыляли бы вес на служебный /products?category=)
export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
  const sp = await searchParams;
  const str = (v: string | string[] | undefined) => (typeof v === "string" && v ? v : undefined);
  const category = str(sp.category);
  const type = str(sp.type);
  const onlyCategory = !!category && !sp.brand && !sp.q && !sp.type && (!sp.page || sp.page === "1");
  const onlyType = !!type && !type.includes(",") && !sp.brand && !sp.q && !category && (!sp.page || sp.page === "1");
  let canonical = "/products";
  if (onlyCategory) {
    try {
      const { categories } = await getCategories();
      const cur = categories.find((c) => c.slug === category || c.id === category);
      if (cur) canonical = `/categories/${cur.slug}`;
    } catch {
      // ignore
    }
  } else if (onlyType) {
    canonical = `/products/type/${typeSlug(type as string)}`;
  }
  // Индексируем ТОЛЬКО стабильные страницы: чистый /products и /products?type=X.
  // Все «глубокие» списки (пагинация page>1, фильтры brand/category/perPage/q/цена/характеристики)
  // нестабильны — их содержимое плавает по мере роста каталога (Google ловил устаревший товар на page=N).
  // Поэтому noindex+follow: Google перестаёт индексировать адреса-с-параметрами и ранжирует постоянные
  // страницы товаров (/products/<slug>) и /categories/[slug]. См. canonical выше.
  const isBarePage1 = !sp.page || sp.page === "1";
  const hasOtherFilters = !!(sp.brand || sp.q || sp.perPage || sp.sort || sp.chars || sp.priceMin || sp.priceMax || sp.technology || sp.installationType || sp.mp);
  const isBare = !category && !type && isBarePage1 && !hasOtherFilters;
  const indexable = onlyType || isBare;
  const robots = indexable ? undefined : { index: false, follow: true };
  if (onlyType) {
    const typeTitle = `${type} — ${t("product.titleBuy")}`;
    const typeDesc = t("product.typeDesc", { type: type as string });
    return {
      title: typeTitle,
      description: typeDesc,
      alternates: { canonical: lp + canonical },
      openGraph: { title: typeTitle, description: typeDesc }
    };
  }
  const listDesc = t("product.listDesc");
  const listTitle = t("nav.products");
  return {
    title: listTitle,
    description: listDesc,
    alternates: { canonical: lp + canonical },
    openGraph: { title: `${listTitle} — SAT Solutions`, description: listDesc },
    ...(robots ? { robots } : {})
  };
}

// Маршрут /products — «чистая» сигнатура (params + searchParams), как требует Next PageProps.
// Вся логика каталога — в CatalogView (его же переиспользуют страницы типа и бренда).
export default async function ProductsPage(props: { params?: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  return CatalogView(props as any);
}
