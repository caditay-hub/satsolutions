import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, getLocale } from "next-intl/server";
import { getBrands, getBrandTypePairs, type BrandDto } from "@/lib/api";
import { typeSlug } from "@/lib/typeSlug";
import { localizeCatName } from "@/lib/catalogI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { splitBrands, OTHER_BRANDS_SLUG } from "@/lib/brandGroups";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const title = tc("byBrands");
  const description = tc("byCategoriesDesc");
  return {
    title,
    alternates: hreflangAlternates("/catalog", locale),
    description,
    openGraph: { title, description, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

// Цвета-акценты по брендам (для остальных — дефолт)
const BRAND_COLORS: Record<string, string> = {
  dahua: "#e02020", hikvision: "#e02020", avigilon: "#0F2741",
  rubezh: "#c8102e", bolid: "#0a3d91", hilook: "#2e9bd6",
  tplink: "#13C2C2", tapo: "#13C2C2", mercusys: "#d6001c",
  witek: "#0072BC", kanihad: "#D71920", zkteco: "#00923F",
  ubiquiti: "#0f1113", mikrotik: "#293239", prochee: "#328fa8",
};

// Фиксированный порядок витрины: эти бренды всегда первыми (в этом порядке),
// далее — все остальные по убыванию количества товаров, в самом конце —
// «Другие бренды» и «Прочее оборудование».
const PINNED_FRONT = ["hikvision", "dahua", "bolid", "rubezh"];
const PINNED_LAST = "prochee";

// Слаги-сборники, у которых нет фирменного лого: показываем оформленную плашку
// (цветной значок + название + подпись «что внутри»). Pixietech сюда НЕ входит — у него своё лого.
const TEXT_LABEL_SLUGS = new Set(["prochee"]);
type CatchAll = { subtitle: string; color: string; icon: "grid" | "plus" };
const CATCHALL: Record<string, CatchAll> = {
  prochee: {
    subtitle: "Комплектующие и аксессуары: кабель, оптика, шкафы, ИБП, инструменты",
    color: "#328fa8",
    icon: "grid",
  },
};

// Иконки для плашек-сборников (Heroicons outline).
function CatchAllIcon({ kind }: { kind: "grid" | "plus" }) {
  const d =
    kind === "plus"
      ? "M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
      : "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25A2.25 2.25 0 0113.5 8.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z";
  return (
    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

// Оформленная плашка сборного раздела: цветной значок + имя + подпись.
function CatchAllVisual({ name, subtitle, color, icon }: { name: string; subtitle?: string; color: string; icon: "grid" | "plus" }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-2 px-4 py-5 min-h-[150px] bg-gradient-to-b from-white to-slate-50">
      <div
        className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105"
        style={{ backgroundColor: color }}
      >
        <CatchAllIcon kind={icon} />
      </div>
      <span className="text-base sm:text-lg font-black text-slate-900 text-center leading-tight tracking-tight">{name}</span>
      {subtitle ? (
        <span className="text-[11px] font-medium text-slate-500 text-center leading-snug line-clamp-2">{subtitle}</span>
      ) : null}
    </div>
  );
}

// Единая карточка бренда (лого либо крупное название), используется и для «Прочее».
async function BrandCard({ b }: { b: BrandDto }) {
  const t = await getTranslations("catalog");
  const locale = await getLocale();
  const slug = b.slug.toLowerCase();
  const forceText = TEXT_LABEL_SLUGS.has(slug);
  const logo = !forceText && b.logoImageUrl ? resolveImageUrl(b.logoImageUrl) : null;
  const name = localizeBrandName(slug, b.name, locale);
  const count = b.productCount ?? 0;
  const color = BRAND_COLORS[slug] ?? "#328fa8";
  return (
    <Link
      href={`/catalog/${slug}`}
      className="group relative border-2 border-slate-200 hover:shadow-xl transition-all bg-white overflow-hidden flex flex-col"
      style={{ "--brand-color": color } as React.CSSProperties}
    >
      {count > 0 && (
        <span
          className="absolute top-2 right-2 z-10 rounded-full bg-slate-900/85 px-2 py-0.5 text-[11px] font-bold leading-none text-white shadow-sm"
          title={t("itemsInCatalog", { count })}
        >
          {t("itemsShort", { count })}
        </span>
      )}
      {forceText && CATCHALL[slug] ? (
        <CatchAllVisual name={name} subtitle={slug === "prochee" ? t("procheeSubtitle") : CATCHALL[slug].subtitle} color={CATCHALL[slug].color} icon={CATCHALL[slug].icon} />
      ) : (
        <div className="flex-1 flex items-center justify-center p-3 bg-white min-h-[150px]">
          {logo ? (
            <div className="relative h-32 w-full">
              <Image src={logo} alt={name} fill className="object-contain" sizes="320px" />
            </div>
          ) : (
            <span className="text-xl sm:text-2xl font-black text-slate-900 text-center leading-tight">{name}</span>
          )}
        </div>
      )}
      <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100" style={{ backgroundColor: "#fafafa" }}>
        <span className="text-xs font-bold text-slate-600 group-hover:text-[#e02020] transition-colors uppercase tracking-wider">
          {t("viewCatalog")}
        </span>
        <svg className="w-4 h-4 text-slate-300 group-hover:text-[#e02020] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// «Прочее оборудование» раскрыто: чипы категорий внутри (топ по количеству),
// каждый ведёт сразу на /catalog/prochee/<type> — покупатель видит содержимое
// «чёрного ящика», а Google получает внутренние ссылки на связки бренд×тип.
async function ProcheeCard({ b }: { b: BrandDto }) {
  const t = await getTranslations("catalog");
  const locale = await getLocale();
  let inside: { type: string; count: number }[] = [];
  try {
    const { pairs } = await getBrandTypePairs();
    inside = pairs
      .filter((p) => p.brand === "prochee")
      .sort((a, b2) => b2.count - a.count)
      .slice(0, 8);
  } catch { /* без чипов */ }
  if (!inside.length) return <BrandCard b={b} />;

  const name = localizeBrandName("prochee", b.name, locale);
  const count = b.productCount ?? 0;
  const color = CATCHALL["prochee"]?.color ?? "#328fa8";
  return (
    <div className="group relative border-2 border-slate-200 hover:shadow-xl transition-all bg-white overflow-hidden flex flex-col">
      {/* Вся карточка кликабельна (оверлей), чипы — поверх со своими ссылками */}
      <Link href="/catalog/prochee" className="absolute inset-0 z-0" aria-label={name} />
      {count > 0 && (
        <span className="pointer-events-none absolute top-2 right-2 z-10 rounded-full bg-slate-900/85 px-2 py-0.5 text-[11px] font-bold leading-none text-white shadow-sm">
          {t("itemsShort", { count })}
        </span>
      )}
      <div className="pointer-events-none flex flex-col items-center gap-2 px-4 pt-5 pb-2 bg-gradient-to-b from-white to-slate-50">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-sm ring-1 ring-black/5" style={{ backgroundColor: color }}>
          <CatchAllIcon kind="grid" />
        </div>
        <span className="text-base sm:text-lg font-black text-slate-900 text-center leading-tight tracking-tight">{name}</span>
      </div>
      <div className="relative z-10 flex flex-wrap justify-center gap-1.5 px-3 pb-4">
        {inside.map((p) => (
          <Link
            key={p.type}
            href={`/catalog/prochee/${typeSlug(p.type)}`}
            className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 transition-colors hover:border-brand-500 hover:text-brand-700"
          >
            {localizeCatName(p.type, locale)} · {p.count}
          </Link>
        ))}
      </div>
      <div className="pointer-events-none px-5 py-3 mt-auto flex items-center justify-between border-t border-slate-100" style={{ backgroundColor: "#fafafa" }}>
        <span className="text-xs font-bold text-slate-600 group-hover:text-[#e02020] transition-colors uppercase tracking-wider">
          {t("viewCatalog")}
        </span>
        <svg className="w-4 h-4 text-slate-300 group-hover:text-[#e02020] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}

export default async function CatalogIndexPage() {
  const t = await getTranslations("catalog");
  const locale = await getLocale();
  // Список брендов — динамический, из БД (published).
  const { brands: dbBrands } = await getBrands().catch(() => ({ brands: [] }));
  // Крупные бренды — отдельными карточками; мелкие (1..20 товаров) сворачиваем в «Другие бренды».
  const { main: mainBrands, small: smallBrands } = splitBrands(dbBrands);

  const slugOf = (b: BrandDto) => b.slug.toLowerCase();
  const front = PINNED_FRONT
    .map((s) => mainBrands.find((b) => slugOf(b) === s))
    .filter((b): b is BrandDto => Boolean(b));
  const procheeBrand = mainBrands.find((b) => slugOf(b) === PINNED_LAST) ?? null;
  // Остальные — по убыванию количества товаров (Pixietech попадает сюда по своему числу).
  const middle = mainBrands
    .filter((b) => !PINNED_FRONT.includes(slugOf(b)) && slugOf(b) !== PINNED_LAST)
    .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0));
  const orderedBrands = [...front, ...middle];

  const smallTotal = smallBrands.reduce((s, b) => s + (b.productCount ?? 0), 0);
  const smallNames = smallBrands.map((b) => localizeBrandName(b.slug, b.name, locale)).join(", ");

  return (
    <div className="min-h-screen bg-white font-main">
      <div className="container-page !pt-4 !pb-10">
        {/* Compact header row: back + breadcrumb */}
        <div className="flex items-center gap-3 mb-3">
          <BackButton />
          <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">{t("home")}</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{t("catalogCrumb")}</span>
          </nav>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("productCatalog")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("chooseBrand")}</p>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Фикс. фронт + остальные по убыванию количества */}
          {orderedBrands.map((b) => (
            <BrandCard key={b.slug.toLowerCase()} b={b} />
          ))}

          {/* Предпоследняя: агрегат «Другие бренды» (1..20 товаров) — единый стиль карточки */}
          {smallBrands.length > 0 && (
            <Link
              href={`/catalog/${OTHER_BRANDS_SLUG}`}
              className="group relative border-2 border-slate-200 hover:shadow-xl transition-all bg-white overflow-hidden flex flex-col"
            >
              <span
                className="absolute top-2 right-2 z-10 rounded-full bg-slate-900/85 px-2 py-0.5 text-[11px] font-bold leading-none text-white shadow-sm"
                title={t("itemsInside", { count: smallTotal })}
              >
                {t("itemsShort", { count: smallTotal })}
              </span>
              <CatchAllVisual name={t("otherBrands")} subtitle={smallNames} color="#475569" icon="plus" />
              <div className="px-5 py-3 flex items-center justify-between border-t border-slate-100" style={{ backgroundColor: "#fafafa" }}>
                <span className="text-xs font-bold text-slate-600 group-hover:text-[#e02020] transition-colors uppercase tracking-wider">
                  {t("brandsCount", { count: smallBrands.length })}
                </span>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-[#e02020] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          )}

          {/* Самая последняя: «Прочее оборудование» — раскрыта по содержимому */}
          {procheeBrand && <ProcheeCard b={procheeBrand} />}
        </div>
      </div>
    </div>
  );
}
