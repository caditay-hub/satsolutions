import { permanentRedirect } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { typeSlug } from "@/lib/typeSlug";
import { formatNumber } from "@/lib/formatNumber";
import { localizeCatName } from "@/lib/catalogI18n";
import { localizeLongread } from "@/lib/longreadI18n";
import { localizeServiceCase } from "@/lib/serviceCaseI18n";
import { Link } from "@/i18n/navigation";
import { ARTICLES } from "@/lib/articlesData";

// Заголовок блока «Статьи по теме» на хабах типов (инлайн — не раздуваем messages)
const HUB_ARTICLES_UI: Record<string, string> = {
  ru: "Статьи по теме",
  uz: "Mavzu bo'yicha maqolalar",
  en: "Related articles",
  tr: "İlgili makaleler",
  zh: "相关文章",
};
import { getProducts, getProductFacets, getSitePage, getSmartSearch, getSearchCases, type SmartSearchDto, type CaseHitDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { localizePortfolioProject } from "@/lib/contentI18n";
import { ProductCard } from "@/components/Cards";
import { CatalogCard } from "@/components/CatalogCard";
import { CatalogRow } from "@/components/CatalogRow";
import { localizeProductName } from "@/lib/productI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { ViewToggle } from "@/components/catalog/ViewToggle";
import { SortSelect } from "@/components/catalog/SortSelect";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { BackButton } from "@/components/BackButton";
import { Pagination } from "@/components/Pagination";
import { ScrollToTopButton } from "@/components/ScrollToTopButton";
import { RichDescription } from "@/components/RichDescription";
import { parseRichDescription } from "@/lib/richDescription";
import { TYPE_LONGREAD_SLUG } from "@/lib/typeLongread";
import { CatalogFacets } from "./CatalogFacets";
import { SmartResultsView, type SmartItem } from "./SmartResultsView";
import { BRAND_CONFIG } from "@/lib/brandConfig";

// Размер «страницы» для голого каталога /products (тысячи позиций). На страницах
// с выбранным разделом/фильтром (тип/бренд/категория/поиск/характеристики/цена)
// показываем ВСЕ товары разом (CATALOG_SHOW_ALL) — без пагинации и без селектора.
const CATALOG_PAGE_BARE = 120;
const CATALOG_SHOW_ALL = 1000;

// Карточка/строка — клиентские компоненты: весь ProductDto сериализуется в RSC-поток.
// Карточке (сетка) нужны id/slug/name/price/cover/modelCode/recommended — тяжёлые поля
// (description ~сотни символов, галерея, seo) вырезаем ДО передачи → RSC-поток ~×5 легче,
// быстрее FCP на мобильном. Списку оставляем characteristics (чипы-спеки).
function slimProduct(p: import("@/lib/api").ProductDto, keepChars: boolean): import("@/lib/api").ProductDto {
  // Явный набор полей (не spread) — иначе description/gallery/createdAt протаскиваются в RSC.
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    isUsd: p.isUsd,
    recommended: p.recommended,
    modelCode: p.modelCode ?? null,
    coverImageUrl: p.coverImageUrl,
    characteristics: keepChars ? p.characteristics : null, // строке нужны чипы-спеки
    // обязательные по типу, но карточке не нужны — облегчаем
    shortDescription: null,
    description: null,
    published: true,
    categoryId: null,
    createdAt: p.createdAt, // нужен бейджу «Новинка» в карточках
    updatedAt: "",
  };
}

// Реиспользуемый рендер каталога с рабочим фильтром-сайдбаром. Вызывается маршрутом
// /products, а также страницами типа (/products/type/[slug]) и бренда (/catalog/[brand]) —
// им нужно зафиксировать scope (type / brand) и передать brandLanding (шапку бренда).
export async function CatalogView({ params, searchParams, brandLanding, groupLanding, pathType, pairSeo }: { params?: Promise<{ locale: string }>; searchParams: Promise<{ page?: string; category?: string; brand?: string; q?: string; sort?: string; mp?: string; technology?: string; installationType?: string; type?: string; perPage?: string; chars?: string; priceMin?: string; priceMax?: string; view?: string }>; brandLanding?: { name: string; seoH1?: string; description?: string; logoUrl?: string | null; seo?: { intro: string; faq: { q: string; a: string }[] } | null }; groupLanding?: { name: string; idx: number; types: string[]; seoH1?: string; intro?: string; long?: string; serviceHref?: string; serviceLabel?: string }; pathType?: string; pairSeo?: { intro: string; faq: { q: string; a: string }[]; heading: string } | null; }) {
  const sp = await searchParams;
  const { locale } = (await params) ?? { locale: routing.defaultLocale };
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const tnav = await getTranslations({ locale, namespace: "nav" });
  const view: "list" | "grid" = sp.view === "list" ? "list" : "grid";
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
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

  // В пределах выбранного раздела/фильтра показываем ВСЕ товары разом (без пагинации
  // и без селектора «показывать по»). Голый каталог /products — постранично (тысячи позиций).
  const scoped = !!(type || brand || category || q || (chars && Object.keys(chars).length) || priceMin !== undefined || priceMax !== undefined);
  const perPage = scoped ? CATALOG_SHOW_ALL : CATALOG_PAGE_BARE;

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

  // Устойчивость: единичный сбой API (таймаут/429) не должен ронять страницу в белый экран —
  // деградируем до пустого списка. Основная защита от 429 — серверный рендер ходит в localhost.
  let items: import("@/lib/api").ProductDto[] = [];
  let total = 0;
  let corrected: string | null = null;
  try {
    const r = await getProducts(page, perPage, { category, brand, q, sort, mp, technology, installationType, type, chars, priceMin, priceMax });
    items = r.items; total = r.total; corrected = r.corrected ?? null;
  } catch { items = []; total = 0; }

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

  // Smart-выдача: данные для клиентского фильтра-галочек (бренд/тип) — имена локализуем
  // на сервере, чтобы не тянуть i18n-оверлей в бандл. API отдаёт brand_name/category_name.
  const toSmartItem = (p: import("@/lib/api").ProductDto): SmartItem => {
    const raw = p as any;
    return {
      p,
      name: localizeProductName(p, locale),
      brand: raw.brand_name ?? null,
      type: raw.category_name ?? null,
      typeLabel: raw.category_name ? localizeCatName(raw.category_name, locale) : null,
    };
  };
  const smartItems: SmartItem[] = smart ? items.map(toSmartItem) : [];

  // Кейсы портфолио и решения по запросу: «бодикамера» — товаров нет, но есть кейс
  // (у StreetParking). Показываем блок с описанием при ЛЮБОМ поиске, особенно при 0 товаров.
  let caseHits: CaseHitDto[] = [];
  if (q) {
    try {
      const r = await getSearchCases(q);
      // Кейсы портфолио и решения переводятся разными оверлеями: портфолио —
      // contentI18n по slug кейса, решения — serviceCaseI18n по slug услуги.
      // Раньше решения проходили мимо перевода и на uz/en/tr/zh оставались
      // русскими («Парковка», «Умный автобус») прямо в выдаче каталога.
      caseHits = (r.cases ?? []).map((c) =>
        c.kind === "portfolio"
          ? (localizePortfolioProject(c as any, locale) as CaseHitDto)
          : (localizeServiceCase(c as any, locale) as CaseHitDto)
      );
    } catch {}
  }

  // «Похожие товары» под smart-выдачей: при точном запросе модели API отдаёт
  // related (ИИ-подборка из тех же разделов); иначе добираем из категорий выдачи.
  let similar: import("@/lib/api").ProductDto[] = [];
  if (smart) {
    if (smart.related && smart.related.length > 0) {
      similar = smart.related.slice(0, 15);
    } else {
      const shown = new Set(items.map((i) => i.id));
      for (const s of (smart.sections ?? []).slice(0, 2)) {
        try {
          const r = await getProducts(1, 24, { category: s.slug });
          for (const p of r.items) {
            if (!shown.has(p.id)) { similar.push(p); shown.add(p.id); }
            if (similar.length >= 10) break;
          }
        } catch {}
        if (similar.length >= 10) break;
      }
    }
  }

  // Страница типа: одиночный тип без других «осей» — заголовок/лонгрид/без группы «Тип».
  // На странице бренда НЕ считаем «типом», даже если выбран один тип: там фикс. scope — бренд,
  // а «Тип» остаётся рабочей группой фильтра (можно сменить/снять), шапка — бренда.
  const isTypePage = !brandLanding && !!type && !type.includes(",") && !category && !q;
  // Фасеты считаем для ЛЮБОГО списка (тип / бренд / общий / поиск) — единый рабочий фильтр везде.
  // scope = текущий выбор; список значений каждого мультивыбора «липкий» (см. /product-facets).
  let typeFacets: import("@/lib/api").ProductFacets | null = null;
  if (!smart) {
    // chars/price передаём для drill-down: счётчики фасетов учитывают активные фильтры
    // (иначе «KANIHAD 7» при активном «Функции=ACL» вёл на пустую выдачу).
    try { typeFacets = await getProductFacets({ type, brand, category, q, chars: sp.chars, priceMin: sp.priceMin, priceMax: sp.priceMax }); } catch { typeFacets = null; }
  }
  // На странице группы фильтр «Тип товара» ограничиваем типами этой группы (а не всеми 69).
  if (groupLanding && typeFacets?.types) {
    const allow = new Set(groupLanding.types);
    typeFacets = { ...typeFacets, types: typeFacets.types.filter((t: { name: string }) => allow.has(t.name)) };
  }
  // «Бренд» прячем на странице бренда; «Тип» показываем ВЕЗДЕ (в т.ч. на странице типа — иначе
  // после выбора типа группа «Тип» пропадала). Текущий тип отмечен, переключение — на /products?...
  const facetShow = { brands: !brandLanding, types: true };
  const hasFacets = !!typeFacets && (
    (facetShow.brands && (typeFacets.brands?.length ?? 0) > 1) ||
    (facetShow.types && (typeFacets.types?.length ?? 0) > 1) ||
    (typeFacets.price?.max ?? 0) > 0 ||
    (typeFacets.chars?.length ?? 0) > 0
  );

  // Гибридная страница типа: лонгрид + FAQ под товарами, когда активен ТОЛЬКО один тип (без доп. фильтров)
  const onlyType = isTypePage && !brand && !chars && !priceMin && !priceMax && page === 1;
  let typeLongDesc = "";
  if (onlyType) {
    const slug = TYPE_LONGREAD_SLUG[type as string];
    if (slug) {
      try {
        const { page: lp } = await getSitePage(`category:${slug}` as any);
        typeLongDesc = localizeLongread(slug, ((lp as any)?.content || "").toString(), locale);
      } catch {}
    }
  }
  // SEO-блок бренда (лонгрид + FAQ) — только на «чистой» первой странице бренда без доп. фильтров
  const cleanScope = !chars && !priceMin && !priceMax && !q && page === 1;
  const onlyBrand = !!brandLanding && !type && cleanScope;
  const brandSeo = onlyBrand ? (brandLanding?.seo ?? null) : null;
  // SEO-блок связки бренд×категория (страницы /catalog/[brand]/[type])
  const pairBlock = pairSeo && cleanScope ? pairSeo : null;
  // Статьи, привязанные к этому хабу типа через Article.hubs (до 4, свежие первыми)
  const hubArticles = pathType && cleanScope
    ? ARTICLES.filter((a) => a.hubs?.includes(pathType) && a.loc[locale]).slice(0, 4)
    : [];
  const pairFaqLd = pairBlock && pairBlock.faq.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: pairBlock.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;
  const brandFaqLd = brandSeo && brandSeo.faq.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: brandSeo.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;
  const typeGroup = isTypePage ? CATALOG_GROUPS.find((g) => g.types.some((t) => t.n === type)) : undefined;
  // JSON-LD BreadcrumbList для страниц типа (в HTML крошки есть, разметки не было)
  const siteUrlLd = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lpLd = locale !== routing.defaultLocale ? `/${locale}` : "";
  const typeBreadcrumbLd = isTypePage
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: tnav("home"), item: `${siteUrlLd}${lpLd}/` },
          { "@type": "ListItem", position: 2, name: tnav("catalog"), item: `${siteUrlLd}${lpLd}/categories` },
          ...(typeGroup ? [{ "@type": "ListItem", position: 3, name: localizeCatName(typeGroup.title, locale), item: `${siteUrlLd}${lpLd}/categories` }] : []),
          { "@type": "ListItem", position: typeGroup ? 4 : 3, name: localizeCatName(type as string, locale) },
        ],
      }
    : null;
  const typeIntro = typeLongDesc ? ((typeLongDesc.split(/\n##\s/)[0] || "").trim().split(/\n\n/)[0] || "").trim() : "";
  const typeFaq = typeLongDesc ? parseRichDescription(typeLongDesc).faq : [];
  const typeFaqLd = typeFaq.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: typeFaq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }
    : null;

  return (
    <div className="container-page !pt-3 !pb-10">
      {typeBreadcrumbLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(typeBreadcrumbLd) }} />}
      {/* Хлебные крошки: страница типа (Главная › Каталог › Группа › Тип) или бренда */}
      {isTypePage ? (
        <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500">
          <Link href="/" className="hover:text-brand-700">{tnav("home")}</Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-brand-700">{tnav("catalog")}</Link>
          {typeGroup ? (<><span>›</span><Link href={`/categories#cat-${CATALOG_GROUPS.indexOf(typeGroup)}`} className="hover:text-brand-700">{localizeCatName(typeGroup.title, locale)}</Link></>) : null}
          <span>›</span>
          <span className="font-semibold text-slate-600">{localizeCatName(type as string, locale)}</span>
        </nav>
      ) : groupLanding ? (
        <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500">
          <Link href="/" className="hover:text-brand-700">{tnav("home")}</Link>
          <span>›</span>
          <Link href="/categories" className="hover:text-brand-700">{tnav("catalog")}</Link>
          <span>›</span>
          <span className="font-semibold text-slate-600">{groupLanding.name}</span>
        </nav>
      ) : brandLanding ? (
        <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[12px] text-slate-500">
          <Link href="/" className="hover:text-brand-700">{tnav("home")}</Link>
          <span>›</span>
          <Link href="/catalog" className="hover:text-brand-700">{tnav("catalog")}</Link>
          <span>›</span>
          <span className="font-semibold text-slate-600">{brandLanding.name}</span>
        </nav>
      ) : null}

      <div className="flex items-center gap-3 mb-2">
        {(category || brand || q || type) ? <BackButton /> : null}
        {brandLanding?.logoUrl ? (
          <span className="relative inline-block h-9 w-24 shrink-0">
            <Image src={brandLanding.logoUrl} alt={brandLanding.name} fill className="object-contain object-left" sizes="120px" />
          </span>
        ) : null}
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">{isTypePage ? localizeCatName(type as string, locale) : groupLanding ? (groupLanding.seoH1 ?? groupLanding.name) : brandLanding ? (brandLanding.seoH1 ?? brandLanding.name) : tnav("products")}</h1>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">{tc("found")}: {formatNumber(total)}</span>
      </div>

      {brandLanding?.description ? (
        <p className="mb-4 max-w-3xl text-[14px] leading-relaxed text-slate-500">{brandLanding.description}</p>
      ) : null}

      {/* Интро hub-страницы группы + мост «купить ↔ установить» на профильную услугу (groupSeo) */}
      {groupLanding?.intro ? (
        <p className="mb-4 max-w-3xl text-[15px] leading-relaxed text-slate-600">
          {groupLanding.intro}{" "}
          {groupLanding.serviceHref && groupLanding.serviceLabel ? (
            <Link href={groupLanding.serviceHref} className="whitespace-nowrap font-semibold text-brand-700 underline">
              {groupLanding.serviceLabel}
            </Link>
          ) : null}
        </p>
      ) : null}

      {/* SEO-перелинковка бренд↔категория: чипы на страницы /catalog/[brand]/[type] (связки ≥3 товаров) */}
      {onlyBrand && brand && typeFacets && (typeFacets.types?.filter((t) => t.count >= 3).length ?? 0) > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {typeFacets.types.filter((t) => t.count >= 3).slice(0, 14).map((t) => (
            <Link key={t.name} href={`/catalog/${brand}/${typeSlug(t.name)}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700 transition-colors">
              {localizeCatName(t.name, locale)} {brandLanding!.name} <span className="text-slate-400">({t.count})</span>
            </Link>
          ))}
        </div>
      ) : null}
      {isTypePage && !brand && cleanScope && typeFacets && (typeFacets.brands?.filter((b) => b.count >= 3 && BRAND_CONFIG[b.slug?.toLowerCase?.() ?? ""]).length ?? 0) > 0 ? (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {typeFacets.brands.filter((b) => b.count >= 3 && BRAND_CONFIG[b.slug.toLowerCase()]).slice(0, 12).map((b) => (
            <Link key={b.slug} href={`/catalog/${b.slug.toLowerCase()}/${typeSlug(type as string)}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700 transition-colors">
              {localizeCatName(type as string, locale)} {localizeBrandName(b.slug, b.name, locale)} <span className="text-slate-400">({b.count})</span>
            </Link>
          ))}
        </div>
      ) : null}

      {onlyType && typeIntro ? (
        <div className="mb-4 text-[15px] leading-relaxed text-slate-600">
          {typeIntro}{" "}
          <a href="#type-guide" className="whitespace-nowrap font-semibold text-brand-700 underline">{tc("howToChoose")} ↓</a>
        </div>
      ) : null}

      <div className="mt-3 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* smart-поиск несёт свой фильтр внутри SmartResultsView — колонку не занимаем */}
        {smart ? null : hasFacets && typeFacets ? <CatalogFacets facets={typeFacets} show={facetShow} pathType={pathType} pathBrand={brandLanding ? brand : undefined} /> : <div />}

        <div className={smart ? "lg:col-span-2" : undefined}>
          {/* Заголовок: по какому запросу выдан результат (только для поиска) */}
          {q ? (
            <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5">
              <span className="text-[15px] text-slate-700">
                {smart ? <span className="font-bold text-brand-700">{tc("smartSearch")} · </span> : null}
                {tc("searchPrefix")} <span className="font-bold text-slate-900">«{q}»</span> — {tc("searchFound")} <span className="font-bold text-slate-900">{formatNumber(total)}</span>
                {corrected ? <span className="text-slate-500"> · {tc("showingFor")} <span className="font-semibold text-brand-700">«{corrected}»</span></span> : null}
                {smart?.explain ? <span className="text-slate-500"> · {smart.explain}</span> : null}
              </span>
              <Link href="/products" className="ml-auto text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#e02020]">
                {tc("reset")} ✕
              </Link>
            </div>
          ) : null}
          {/* Кейсы и решения по запросу — особенно ценно, когда товаров 0 */}
          {q && caseHits.length > 0 ? (
            <div className="mb-5">
              <div className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">{tc("casesTitle")}</div>
              <div className="grid gap-3 sm:grid-cols-2">
                {caseHits.map((c) => {
                  const cimg = resolveImageUrl(c.coverImageUrl);
                  return (
                    <Link key={`${c.kind}-${c.slug}`} href={c.kind === "portfolio" ? `/portfolio/${c.slug}` : `/solutions/${c.slug}`}
                      className="group flex gap-3 rounded-xl border-2 border-slate-200 bg-white p-3 transition-colors hover:border-brand-500">
                      {cimg ? (
                        <span className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-50">
                          <Image src={cimg} alt="" fill className="object-cover" sizes="112px" unoptimized />
                        </span>
                      ) : null}
                      <span className="min-w-0">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide ${c.kind === "portfolio" ? "bg-emerald-50 text-emerald-700" : "bg-brand-50 text-brand-700"}`}>
                          {c.kind === "portfolio" ? tc("caseBadge") : tc("solutionBadge")}
                        </span>
                        <span className="mt-1 block text-[14px] font-bold leading-snug text-slate-900 line-clamp-2 group-hover:text-brand-700">{c.title}</span>
                        {c.excerpt ? <span className="mt-1 block text-[12px] leading-snug text-slate-500 line-clamp-2">{c.excerpt}</span> : null}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ) : null}
          {smart && smart.sections && smart.sections.length > 0 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="self-center text-xs font-bold uppercase tracking-wider text-slate-500">{tc("refine")}:</span>
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
          {/* Обычный поиск: категории найденного — чипами сверху (уточнить внутри запроса) */}
          {!smart && q && typeFacets?.types && typeFacets.types.length > 1 ? (
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="self-center text-xs font-bold uppercase tracking-wider text-slate-500">{tc("refine")}:</span>
              {typeFacets.types.slice(0, 8).map((tp: { name: string; count: number }) => (
                <Link
                  key={tp.name}
                  href={`/products?q=${encodeURIComponent(q)}&type=${encodeURIComponent(tp.name)}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-brand-300 bg-white px-3 py-1 text-xs font-bold text-brand-700 hover:bg-brand-600 hover:text-white transition-colors"
                >
                  {localizeCatName(tp.name, locale)}
                  <span className="opacity-60">{tp.count}</span>
                </Link>
              ))}
            </div>
          ) : null}
          {items.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              {tc("nothingFound")}
            </div>
          ) : (
            <>
              {!smart && (
                <div className="mb-3 flex flex-wrap items-center justify-end gap-2">
                  <span className="mr-auto text-xs font-bold uppercase tracking-wider text-slate-500">{tc("sort")}</span>
                  <SortSelect value={sort || "default"} />
                  <ViewToggle view={view} />
                </div>
              )}
              {!smart ? (
                <Pagination basePath="/products" page={page} limit={perPage} total={total} params={{ q, category, brand, sort, mp, technology, installationType, type, chars: sp.chars, priceMin: sp.priceMin, priceMax: sp.priceMax, view: view === "list" ? "list" : undefined }} className="mb-4" />
              ) : null}
              {smart ? (
                <SmartResultsView items={smartItems} related={similar.map(toSmartItem)} usdToUzs={usdToUzs} />
              ) : view === "list" ? (
                <div className="flex flex-col gap-2.5">
                  {items.map((p) => (
                    <CatalogRow key={p.id} p={slimProduct(p, true)} usdToUzs={usdToUzs} name={localizeProductName(p, locale)} />
                  ))}
                </div>
              ) : (
                <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                  {items.map((p) => (
                    <CatalogCard key={p.id} p={slimProduct(p, false)} usdToUzs={usdToUzs} name={localizeProductName(p, locale)} />
                  ))}
                </div>
              )}
            </>
          )}
          {smart ? null : (
            <Pagination basePath="/products" page={page} limit={perPage} total={total} params={{ q, category, brand, sort, mp, technology, installationType, type, chars: sp.chars, priceMin: sp.priceMin, priceMax: sp.priceMax, view: view === "list" ? "list" : undefined }} />
          )}

          {/* «Похожие товары» для smart-режима рендерятся внутри SmartResultsView —
              там же общий фильтр-галочки по основной выдаче + похожим */}

          {typeLongDesc && typeLongDesc.trim() ? (
            <section id="type-guide" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-8">
              {typeFaqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(typeFaqLd) }} />}
              <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{localizeCatName(type as string, locale)} — {tc("guideSuffix")}</h2>
              <div className="max-w-3xl">
                <RichDescription text={typeLongDesc} />
              </div>
            </section>
          ) : null}

          {brandSeo ? (
            <section id="brand-guide" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-8">
              {brandFaqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(brandFaqLd) }} />}
              <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{brandLanding!.name} — {tc("guideSuffix")}</h2>
              <div className="max-w-3xl">
                {/* Q:/A:-пары RichDescription сам вынесет в FAQ-блок с локализованным заголовком */}
                <RichDescription text={brandSeo.intro + (brandSeo.faq.length ? "\n\n" + brandSeo.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") : "")} />
              </div>
            </section>
          ) : null}

          {groupLanding?.long ? (
            // Развёрнутый текст группы: страница «камеры видеонаблюдения» держала
            // «посадочная ниже среднего» в Ads, имея под H1 одно предложение.
            <section className="mt-10 border-t border-slate-200 pt-8">
              <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{groupLanding.seoH1 ?? groupLanding.name}</h2>
              <div className="max-w-3xl">
                <RichDescription text={groupLanding.long} />
              </div>
            </section>
          ) : null}
          {pairBlock ? (
            <section id="pair-guide" className="mt-12 scroll-mt-24 border-t border-slate-200 pt-8">
              {pairFaqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pairFaqLd) }} />}
              <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-900">{pairBlock.heading} — {tc("guideSuffix")}</h2>
              <div className="max-w-3xl">
                <RichDescription text={pairBlock.intro + (pairBlock.faq.length ? "\n\n" + pairBlock.faq.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n") : "")} />
              </div>
            </section>
          ) : null}
          {/* Хаб типа → статьи: обратная нога перелинковки к Article.hubs (статья → хаб).
              Даёт хабам свежие внутренние ссылки, а статьям — переходы из каталога. */}
          {pathType && hubArticles.length > 0 ? (
            <section className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600">{HUB_ARTICLES_UI[locale] ?? HUB_ARTICLES_UI.ru}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {hubArticles.map((a) => (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700">
                    {a.loc[locale]?.title ?? a.loc.ru.title}
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
      <ScrollToTopButton label={({ ru: "Наверх", uz: "Yuqoriga", en: "To top", tr: "Yukarı", zh: "返回顶部" } as Record<string, string>)[locale] ?? "Наверх"} />
    </div>
  );
}
