import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getBrands, getBrandTypePairs, type BrandDto } from "@/lib/api";
import { typeSlug } from "@/lib/typeSlug";
import { localizeCatName } from "@/lib/catalogI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { splitBrands, OTHER_BRANDS_SLUG } from "@/lib/brandGroups";
import { withOgUrl } from "@/lib/metadata";

export const revalidate = 300;

async function generateMetadataBase({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tc = await getTranslations({ locale, namespace: "catalog" });
  const title = tc("byBrands");
  const description = tc("byBrandsDesc"); // своё описание: раньше /catalog и /categories отдавали одно и то же
  return {
    title,
    alternates: hreflangAlternates("/catalog", locale),
    description,
    openGraph: { title, description, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

// Витрина брендов (12.11.2026, решение владельца: вёрстка «компактная сетка», порядок «по направлениям»).
// Порядок фиксированный: видеонаблюдение/СКУД → пожарная сигнализация → сети и серверные;
// бренд, которого здесь нет (новый, > 20 товаров), встаёт после них по убыванию количества;
// в конце — «Другие бренды» (1..20 товаров) и «Комплектующие и аксессуары».
const BRAND_ORDER = [
  "hikvision", "dahua", "zkteco", "kanihad", // видеонаблюдение, СКУД, домофония
  "bolid", "rubezh", "qr-systems", // пожарная и охранная сигнализация
  "pixietech", "mikrotik", "tplink", "snr", "ruijie", "witek", "ubiquiti", // сети, Wi-Fi, серверные
];
const PINNED_LAST = "prochee";

// Пропорции файлов логотипов (ширина / высота) — чтобы логотипы в плитках были одного «веса»:
// площадь одинаковая, широкие — шире, но ниже (Hikvision полоской, Ubiquiti квадратом — больше не бывает).
// Бренда нет в списке — коробка 140×56 с object-contain. Файлы: /uploads/brands/<slug>-std.png.
const LOGO_RATIO: Record<string, number> = {
  hikvision: 456 / 58, dahua: 456 / 136, bolid: 456 / 182, rubezh: 456 / 123, pixietech: 795 / 156,
  mikrotik: 456 / 111, tplink: 456 / 174, snr: 299 / 87, zkteco: 456 / 115, ruijie: 456 / 136,
  kanihad: 456 / 68, "qr-systems": 504 / 147, witek: 451 / 166, ubiquiti: 317 / 240,
  cambium: 308 / 240, cisco: 455 / 240, h3c: 456 / 120, huawei: 238 / 240, vertiv: 456 / 112,
  fanvil: 456 / 128, finen: 480 / 135, siklu: 240 / 240, "v-sol": 401 / 240, bdcom: 480 / 123,
  "c-data": 480 / 137, "sibirskiy-arsenal": 400 / 94,
};
const LOGO_AREA = 6400; // px², ≈ 150×43 для широкого, 79×60 для квадратного
const LOGO_MAX_W = 150;
const LOGO_MAX_H = 60;
function logoBox(slug: string): { w: number; h: number } {
  const r = LOGO_RATIO[slug];
  if (!r) return { w: 140, h: 56 };
  let h = Math.sqrt(LOGO_AREA / r);
  let w = h * r;
  if (w > LOGO_MAX_W) { w = LOGO_MAX_W; h = w / r; }
  if (h > LOGO_MAX_H) { h = LOGO_MAX_H; w = h * r; }
  return { w: Math.round(w), h: Math.round(h) };
}

// Пометка «новый бренд» до указанной даты (ISR 300 с — снимется сама).
const NEW_BRAND_UNTIL: Record<string, string> = { "qr-systems": "2026-12-12" };
function isNewBrand(slug: string): boolean {
  const until = NEW_BRAND_UNTIL[slug];
  return Boolean(until) && new Date().toISOString().slice(0, 10) < until;
}

const TILE =
  "group relative flex flex-col items-center rounded-xl border border-slate-200 bg-white px-2.5 pt-3.5 pb-3 min-h-[138px] " +
  "transition-all hover:border-brand-700 hover:shadow-lg hover:-translate-y-px";

// Плитка бренда: логотип одного «веса», название и число товаров под ним.
async function BrandCard({ b, locale }: { b: BrandDto; locale: string }) {
  const t = await getTranslations({ locale, namespace: "catalog" });
  const slug = b.slug.toLowerCase();
  const logo = b.logoImageUrl ? resolveImageUrl(b.logoImageUrl) : null;
  const name = localizeBrandName(slug, b.name, locale);
  const count = b.productCount ?? 0;
  const box = logoBox(slug);
  return (
    <Link href={`/catalog/${slug}`} className={TILE}>
      <div className="flex h-16 w-full items-center justify-center">
        {logo ? (
          <div className="relative max-w-full" style={{ width: box.w, height: box.h }}>
            <Image src={logo} alt={name} fill className="object-contain" sizes="160px" />
          </div>
        ) : (
          <span className="text-lg font-black text-slate-900 text-center leading-tight">{name}</span>
        )}
      </div>
      <span className="mt-2 text-[13px] font-bold text-slate-900 text-center leading-tight">{name}</span>
      {isNewBrand(slug) && (
        <span className="mt-1 rounded-full bg-[#e02020] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider leading-none text-white">
          {t("newBrand")}
        </span>
      )}
      {count > 0 && <span className="mt-0.5 text-[11px] text-slate-500 text-center">{t("itemsCount", { count })}</span>}
    </Link>
  );
}

// Значок для плиток-сборников («Другие бренды», «Комплектующие»).
function CatchAllIcon({ kind, color }: { kind: "grid" | "plus"; color: string }) {
  const d =
    kind === "plus"
      ? "M12 5v14M5 12h14"
      : "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z";
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl shadow-sm ring-1 ring-black/5" style={{ backgroundColor: color }}>
      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d={d} />
      </svg>
    </div>
  );
}

// «Комплектующие и аксессуары» раскрыта: чипы категорий внутри (топ по количеству),
// каждый ведёт сразу на /catalog/prochee/<type> — покупатель видит содержимое
// «чёрного ящика», а Google получает внутренние ссылки на связки бренд×тип.
async function ProcheeCard({ b, locale }: { b: BrandDto; locale: string }) {
  const t = await getTranslations({ locale, namespace: "catalog" });
  let inside: { type: string; count: number }[] = [];
  try {
    const { pairs } = await getBrandTypePairs();
    inside = pairs
      .filter((p) => p.brand === "prochee")
      .sort((a, b2) => b2.count - a.count)
      .slice(0, 8);
  } catch { /* без чипов */ }

  const name = localizeBrandName("prochee", b.name, locale);
  const count = b.productCount ?? 0;
  return (
    <div className={`${TILE} col-span-2`}>
      {/* Вся плитка кликабельна (оверлей), чипы — поверх со своими ссылками */}
      <Link href="/catalog/prochee" className="absolute inset-0 z-0 rounded-xl" aria-label={name} />
      <div className="pointer-events-none flex h-16 items-center justify-center">
        <CatchAllIcon kind="grid" color="#2a7b90" />
      </div>
      <span className="pointer-events-none mt-2 text-[13px] font-bold text-slate-900 text-center leading-tight">{name}</span>
      {count > 0 && <span className="pointer-events-none mt-0.5 text-[11px] text-slate-500">{t("itemsCount", { count })}</span>}
      {inside.length > 0 && (
        <div className="relative z-10 mt-2 flex flex-wrap justify-center gap-1">
          {inside.map((p) => (
            <Link
              key={p.type}
              href={`/catalog/prochee/${typeSlug(p.type)}`}
              className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-600 transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              {localizeCatName(p.type, locale)} · {p.count}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default async function CatalogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Явная локаль: без setRequestLocale next-intl уходит в headers() и ломает ISR
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "catalog" });
  // Список брендов — динамический, из БД (published).
  const { brands: dbBrands } = await getBrands().catch(() => ({ brands: [] }));
  // Крупные бренды — отдельными плитками; мелкие (1..20 товаров) сворачиваем в «Другие бренды».
  const { main: mainBrands, small: smallBrands } = splitBrands(dbBrands);

  const slugOf = (b: BrandDto) => b.slug.toLowerCase();
  const ordered = BRAND_ORDER
    .map((s) => mainBrands.find((b) => slugOf(b) === s))
    .filter((b): b is BrandDto => Boolean(b));
  const rest = mainBrands
    .filter((b) => !BRAND_ORDER.includes(slugOf(b)) && slugOf(b) !== PINNED_LAST)
    .sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0));
  const procheeBrand = mainBrands.find((b) => slugOf(b) === PINNED_LAST) ?? null;
  const orderedBrands = [...ordered, ...rest];

  const smallTotal = smallBrands.reduce((s, b) => s + (b.productCount ?? 0), 0);
  const smallNames = smallBrands.map((b) => localizeBrandName(b.slug, b.name, locale)).join(", ");

  return (
    <div className="min-h-screen bg-white font-main">
      <div className="container-page !pt-4 !pb-10">
        {/* Compact header row: back + breadcrumb */}
        <div className="flex items-center gap-3 mb-3">
          <BackButton />
          <nav className="crumbs flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">{t("home")}</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{t("catalogCrumb")}</span>
          </nav>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("productCatalog")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("chooseBrand")}</p>

        {/* items-start: высокая плитка «Комплектующие» (чипы) не вытягивает соседей по ряду */}
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 items-start">
          {orderedBrands.map((b) => (
            <BrandCard key={b.slug.toLowerCase()} b={b} locale={locale} />
          ))}

          {/* Предпоследняя: агрегат «Другие бренды» (1..20 товаров) */}
          {smallBrands.length > 0 && (
            <Link href={`/catalog/${OTHER_BRANDS_SLUG}`} className={TILE} title={t("itemsInside", { count: smallTotal })}>
              <div className="flex h-16 items-center justify-center">
                <CatchAllIcon kind="plus" color="#475569" />
              </div>
              <span className="mt-2 text-[13px] font-bold text-slate-900 text-center leading-tight">{t("otherBrands")}</span>
              <span className="mt-0.5 text-[11px] text-slate-500 text-center">
                {t("brandsCount", { count: smallBrands.length })} · {t("itemsCount", { count: smallTotal })}
              </span>
              <span className="mt-1.5 text-[10px] leading-snug text-slate-400 text-center line-clamp-2">{smallNames}</span>
            </Link>
          )}

          {/* Самая последняя: «Комплектующие и аксессуары» — раскрыта по содержимому */}
          {procheeBrand && <ProcheeCard b={procheeBrand} locale={locale} />}
        </div>
      </div>
    </div>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
