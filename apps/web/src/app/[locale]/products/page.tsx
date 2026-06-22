import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { typeSlug } from "@/lib/typeSlug";
import { Link } from "@/i18n/navigation";
import { getBrands, getCategories, getProducts, getProductTypes, getSitePage, getSmartSearch, type SmartSearchDto } from "@/lib/api";
import { ProductCard } from "@/components/Cards";
import { CatalogCard } from "@/components/CatalogCard";
import { CatalogRow } from "@/components/CatalogRow";
import { ViewToggle } from "@/components/catalog/ViewToggle";
import { SortSelect } from "@/components/catalog/SortSelect";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { BackButton } from "@/components/BackButton";
import { Pagination } from "@/components/Pagination";
import { ProductsFilter } from "./ProductsFilter";
import { PerPageSelect } from "./PerPageSelect";
import { RichDescription } from "@/components/RichDescription";
import { parseRichDescription } from "@/lib/richDescription";
import { TYPE_LONGREAD_SLUG } from "@/lib/typeLongread";
import { getProductFacets } from "@/lib/api";
import { TypeFacets } from "./TypeFacets";

// canonical: при активном ТОЛЬКО фильтре категории указываем на индексируемую /categories/[slug]
// (иначе главная/чипы «Уточнить» распыляли бы вес на служебный /products?category=)
export async function generateMetadata({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const { locale } = await params;
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
    const typeTitle = `${type} — купить в Ташкенте`;
    const typeDesc = `${type}: каталог, цены, подбор и доставка по Ташкенту и Узбекистану. Официальная гарантия, монтаж и сервис от SAT Solutions.`;
    return {
      title: typeTitle,
      description: typeDesc,
      alternates: { canonical: lp + canonical },
      openGraph: { title: typeTitle, description: typeDesc }
    };
  }
  const listDesc = "Каталог оборудования безопасности: камеры, видеорегистраторы, СКУД, домофония, сигнализация — Dahua, Hikvision и другие бренды.";
  return {
    title: "Продукция",
    description: listDesc,
    alternates: { canonical: lp + canonical },
    openGraph: { title: "Продукция — SAT Solutions", description: listDesc },
    ...(robots ? { robots } : {})
  };
}

const PER_PAGE_OPTIONS = [20, 50, 100];

export default async function ProductsPage({ params, searchParams }: { params?: Promise<{ locale: string }>; searchParams: Promise<{ page?: string; category?: string; brand?: string; q?: string; sort?: string; mp?: string; technology?: string; installationType?: string; type?: string; perPage?: string; chars?: string; priceMin?: string; priceMax?: string; view?: string }>; }) {
  const sp = await searchParams;
  const { locale } = (await params) ?? { locale: routing.defaultLocale };
  const view: "list" | "grid" = sp.view === "list" ? "list" : "grid";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const perPage = PER_PAGE_OPTIONS.includes(Number(sp.perPage)) ? Number(sp.perPage) : 20;
  const category = typeof sp.category === "string" && sp.category ? sp.category : undefined;
  const type = typeof sp.type === "string" && sp.type ? sp.type : undefined;
  const brand = typeof sp.brand === "string" && sp.brand ? sp.brand : undefined;
  const q = typeof sp.q === "string" && sp.q ? sp.q : undefined;
  const sort = typeof sp.sort === "string" && sp.sort ? sp.sort : undefined;
  const mp = typeof sp.mp === "string" && sp.mp ? sp.mp : undefined;
  const technology = typeof sp.technology === "string" && sp.technology ? sp.technology : undefined;
  const installationType = typeof sp.installationType === "string" && sp.installationType ? sp.installationType : undefined;
  let chars: Record<string, string[]> | undefined;
  try {
    const c = sp.chars ? JSON.parse(sp.chars) : null;
    if (c && typeof c === "object") {
      chars = {};
      for (const [k, v] of Object.entries(c)) chars[k] = Array.isArray(v) ? (v as unknown[]).map(String) : [String(v)];
    }
  } catch { chars = undefined; }
  const priceMin = Number(sp.priceMin) || undefined;
  const priceMax = Number(sp.priceMax) || undefined;

  // 301: голая страница типа /products?type=<имя> → чистый URL /products/type/<slug>.
  // __clean=1 — внутренний вызов из /products/type/[slug] (без редиректа, иначе цикл).
  if ((sp as any).__clean !== "1"
    && type && !type.includes(",") && !category && !brand && !q && page === 1
    && !chars && priceMin === undefined && priceMax === undefined
    && !mp && !technology && !installationType && !sp.perPage && !sp.sort) {
    const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
    permanentRedirect(`${lp}/products/type/${typeSlug(type)}`);
  }

  let usdToUzs = 1;
  try {
    const { page: site } = await getSitePage("site");
    const v = (site as any)?.data?.usdToUzs;
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
    if (Number.isFinite(n) && n > 0) usdToUzs = n;
  } catch {}

  let [{ items, total }, { categories }, { brands }, { types }] = await Promise.all([
    getProducts(page, perPage, { category, brand, q, sort, mp, technology, installationType, type, chars, priceMin, priceMax }),
    getCategories(),
    getBrands(),
    getProductTypes(brand)
  ]);

  // Умный поиск: если обычный нашёл мало — спрашиваем ИИ (с кешем на бэке)
  let smart: SmartSearchDto | null = null;
  if (q && total < 4 && !category && !brand) {
    try {
      const s = await getSmartSearch(q, 60);
      if (s.mode === "smart" && s.items.length > 0) {
        smart = s;
        items = s.items;
        total = s.total;
      }
    } catch {}
  }

  const activeCategory = category ? categories.find((c) => c.slug === category || c.id === category) ?? null : null;

  // Страница типа: показываем фасеты (бренд/цена/характеристики), даже если выбраны фильтры
  const isTypePage = !!type && !type.includes(",") && !category && !q;
  let typeFacets: import("@/lib/api").ProductFacets | null = null;
  if (isTypePage) {
    try { typeFacets = await getProductFacets(type as string); } catch { typeFacets = null; }
  }

  // Гибридная страница типа: лонгрид + FAQ под товарами, когда активен ТОЛЬКО один тип (без доп. фильтров)
  const onlyType = isTypePage && !brand && !chars && !priceMin && !priceMax && page === 1;
  let typeLongDesc = "";
  if (onlyType) {
    const slug = TYPE_LONGREAD_SLUG[type as string];
    if (slug) {
      try {
        const { page: lp } = await getSitePage(`category:${slug}` as any);
        typeLongDesc = ((lp as any)?.content || "").toString();
      } catch {}
    }
  }
  const typeGroup = isTypePage ? CATALOG_GROUPS.find((g) => g.types.some((t) => t.n === type)) : undefined;
  const typeIntro = typeLongDesc ? ((typeLongDesc.split(/\n##\s/)[0] || "").trim().split(/\n\n/)[0] || "").trim() : "";
  const typeFaq = typeLongDesc ? parseRichDescription(typeLongDesc).faq : [];
  const typeFaqLd = typeFaq.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: typeFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;

  return (
    <div className="container-page !pt-3 !pb-10">
      {/* Хлебные крошки для страницы типа (Главная › Каталог › Группа › Тип) */}
      {isTypePage ? (
        <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500">
          <Link href="/" className="hover:text-brand-700">Главная</Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-brand-700">Каталог</Link>
          {typeGroup ? (<><span>›</span><Link href={`/categories#cat-${CATALOG_GROUPS.indexOf(typeGroup)}`} className="hover:text-brand-700">{typeGroup.title}</Link></>) : null}
          <span>›</span>
          <span className="font-semibold text-slate-600">{type}</span>
        </nav>
      ) : null}

      <div className="flex items-center gap-3 mb-2">
        {(category || brand || q || type) ? <BackButton /> : null}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">{isTypePage ? (type as string) : "Продукция"}</h1>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Найдено: {total}</span>
      </div>

      {onlyType && typeIntro ? (
        <div className="mb-4 text-[15px] leading-relaxed text-slate-600">
          {typeIntro}{" "}
          <a href="#type-guide" className="whitespace-nowrap font-semibold text-brand-700 underline">Как выбрать и FAQ ↓</a>
        </div>
      ) : null}

      <div className="mt-3 grid gap-6 lg:grid-cols-[260px_1fr]">
        {isTypePage ? (
          typeFacets ? <TypeFacets facets={typeFacets} /> : <div />
        ) : (
          <ProductsFilter
            brands={brands}
            types={types}
            initial={{ q, type, brand }}
          />
        )}

        <div>
          {/* Заголовок: по какому запросу выдан результат (только для поиска) */}
          {q ? (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="text-[15px] text-slate-700">
                {smart ? <span className="font-bold text-brand-700">Умный поиск · </span> : null}
                По запросу <span className="font-bold text-slate-900">«{q}»</span> — найдено <span className="font-bold text-slate-900">{total}</span>
                {smart?.explain ? <span className="text-slate-500"> · {smart.explain}</span> : null}
              </span>
              <Link href="/products" className="ml-auto text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#e02020]">
                Сбросить ✕
              </Link>
            </div>
          ) : null}
          {smart && smart.sections && smart.sections.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="self-center text-xs font-bold uppercase tracking-wider text-slate-500">Уточнить:</span>
              {smart.sections.map((s) => (
                <Link
                  key={s.slug}
                  href={`/products?category=${encodeURIComponent(s.slug)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-white px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
                >
                  {s.name}
                  <span className="opacity-60">{s.count}</span>
                </Link>
              ))}
            </div>
          ) : null}
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              По заданным фильтрам ничего не найдено.
            </div>
          ) : (
            <>
              {!smart && (
                <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
                  {isTypePage ? (
                    <>
                      <span className="mr-auto text-xs font-bold uppercase tracking-wider text-slate-500">Сортировка</span>
                      <SortSelect value={sort || "default"} />
                    </>
                  ) : null}
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Показывать по</span>
                  <PerPageSelect current={perPage} options={PER_PAGE_OPTIONS} />
                  {isTypePage ? <ViewToggle view={view} /> : null}
                </div>
              )}
              {isTypePage && view === "list" ? (
                <div className="flex flex-col gap-2.5">
                  {items.map((p) => (
                    <CatalogRow key={p.id} p={p} usdToUzs={usdToUzs} />
                  ))}
                </div>
              ) : isTypePage ? (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (
                    <CatalogCard key={p.id} p={p} usdToUzs={usdToUzs} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {items.map((p) => (
                    <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} />
                  ))}
                </div>
              )}
            </>
          )}
          {smart ? null : (
            <Pagination basePath="/products" page={page} limit={perPage} total={total} params={{ q, category, brand, sort, mp, technology, installationType, type, chars: sp.chars, priceMin: sp.priceMin, priceMax: sp.priceMax, view: view === "list" ? "list" : undefined, perPage: perPage === 20 ? undefined : String(perPage) }} />
          )}

          {typeLongDesc && typeLongDesc.trim() ? (
            <section id="type-guide" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-8">
              {typeFaqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(typeFaqLd) }} />}
              <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{type} — гайд и частые вопросы</h2>
              <div className="max-w-3xl">
                <RichDescription text={typeLongDesc} />
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
