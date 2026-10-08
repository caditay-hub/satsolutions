import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { LoadingDots } from "@/components/LoadingDots";
import { routing } from "@/i18n/routing";
import { typeSlug } from "@/lib/typeSlug";
import { getCategories } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { localizeCatName } from "@/lib/catalogI18n";
import { ogLocale } from "@/lib/ogLocale";
import { CatalogView } from "./CatalogView";
import { withOgUrl } from "@/lib/metadata";
import { categoryTargetPath } from "@/lib/categoryTarget";

// canonical: при активном ТОЛЬКО фильтре категории указываем на конечный раздел (lib/categoryTarget)
// (иначе главная/чипы «Уточнить» распыляли бы вес на служебный /products?category=)
async function generateMetadataBase({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
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
      // сразу на конечный раздел, а не на /categories/<slug> (тот редиректит)
      canonical = categoryTargetPath(categories, category as string) ?? "/products";
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
  const hasOtherFilters = !!(sp.brand || sp.q || sp.perPage || sp.sort || sp.chars || sp.priceMin || sp.priceMax || sp.technology || sp.installationType || sp.mp || sp.view);
  const isBare = !category && !type && isBarePage1 && !hasOtherFilters;
  // 05.10.2026: /products?type=X тоже noindex (canonical на /products/type/X остаётся) —
  // индексируется сама страница типа, а не её дубль с параметром (и ?type= закрыт в robots.txt)
  const indexable = isBare;
  const robots = indexable ? undefined : { index: false, follow: true };
  if (onlyType) {
    const locType = localizeCatName(type as string, locale);
    const typeTitle = `${locType} — ${t("product.titleBuy")}`;
    const typeDesc = t("product.typeDesc", { type: locType });
    return {
      title: typeTitle,
      description: typeDesc,
      alternates: { canonical: lp + canonical },
      openGraph: { title: typeTitle, description: typeDesc, locale: ogLocale(locale), images: ["/og.png"] },
      robots: { index: false, follow: true }
    };
  }
  // Корень каталога: раньше title был «Продукция — SAT Solutions» — 962 показа и ноль
  // кликов за месяц. Отдельные SEO-строки с городом и объёмом каталога.
  const listDesc = t("product.listSeoDesc");
  const listTitle = t("product.listSeoTitle");
  return {
    title: listTitle,
    description: listDesc,
    // Чистый /products индексируем → полные hreflang-альтернаты; фильтрованные (noindex) — только canonical.
    alternates: isBare ? hreflangAlternates("/products", locale) : { canonical: lp + canonical },
    openGraph: { title: `${listTitle} — SAT Solutions`, description: listDesc, locale: ogLocale(locale), images: ["/og.png"] },
    ...(robots ? { robots } : {})
  };
}

// Маршрут /products — «чистая» сигнатура (params + searchParams), как требует Next PageProps.
// Вся логика каталога — в CatalogView (его же переиспользуют страницы типа и бренда).
// Suspense вместо segment-level loading.tsx: тот включал стриминг и для /products/[slug],
// из-за чего несуществующие товары отдавали 200 («ложные 404» в GSC). Здесь стримится
// только список/поиск (умный поиск ждёт до ~2.5с) — пользователь видит скелетон, а
// карточки товаров остаются блокирующими и отдают честный 404.
export default async function ProductsPage(props: { params?: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale } = props.params ? await props.params : { locale: routing.defaultLocale };
  const t = await getTranslations({ locale, namespace: "common" });
  // 05.10.2026: без поиска каталог отдаём сразу целиком — иначе в <main> стояла заглушка
  // «Загрузка…», а товары лежали в скрытых потоковых блоках в конце HTML (и для Googlebot).
  // Скелетон оставлен только для умного поиска (?q=), который ждёт до ~2.5 с; эти страницы noindex.
  const sp = await props.searchParams;
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  if (!q) return CatalogView(props as any);
  return (
    <Suspense
      fallback={
        <div className="container-page !pt-3 !pb-10">
          <div className="mb-5 flex items-center gap-2.5 text-[15px] font-semibold text-slate-500">
            <LoadingDots className="text-brand-600" />
            <span>{t("loading")}…</span>
          </div>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-white p-3">
                <div className="aspect-square w-full rounded-lg bg-slate-100" />
                <div className="mt-3 h-3.5 w-4/5 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-2/5 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      }
    >
      {CatalogView(props as any)}
    </Suspense>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
