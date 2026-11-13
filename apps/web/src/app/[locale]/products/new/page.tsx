import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getBrands, getProducts } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { localizeProductName } from "@/lib/productI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { slimProduct } from "@/lib/catalogSlim";
import { InfiniteProducts } from "@/components/catalog/InfiniteProducts";
import { Pagination } from "@/components/Pagination";
import { routing } from "@/i18n/routing";
import { withOgUrl } from "@/lib/metadata";

// «Новинки»: товары за последние NEW_SECTION_DAYS дней (sort=new). Если свежих
// мало (затишье в поставках) — страница не пустеет: показываем просто последние
// поступления без ограничения по дате.
// 60 дней — как у бейджа «Новинка» (NEW_BADGE_DAYS): раздел показывает ровно то,
// что помечено бейджем. 90 дней захватывало первичную заливку каталога (июнь).
// 13.11.2026 (решение владельца): товары подгружаются при прокрутке, как во всём каталоге;
// номера страниц внизу остаются для поисковиков. Выборка — всегда свежая (no-store): с кэшем
// данных Next отдавал первому посетителю копию недельной давности, и ?page=3 был пустым.
const NEW_SECTION_DAYS = 60;
const PER_PAGE = 24;
const MIN_ITEMS = 12;

async function generateMetadataBase({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<{ page?: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const t = await getTranslations({ locale, namespace: "newPage" });
  // page>1 — как в каталоге: noindex,follow (робот идёт по ссылкам на карточки, индексируется первая)
  const deep = !!sp.page && sp.page !== "1";
  return {
    title: { absolute: t("title") },
    description: t("desc"),
    alternates: hreflangAlternates("/products/new", locale),
    openGraph: { title: t("title"), description: t("desc"), locale: ogLocale(locale), images: ["/og.png"] },
    ...(deep ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function NewArrivalsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<{ page?: string }> }) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const page = Math.max(1, Number(sp.page) || 1);
  const t = await getTranslations({ locale, namespace: "newPage" });
  const tnav = await getTranslations({ locale, namespace: "nav" });
  const tm = await getTranslations({ locale, namespace: "catalogMega" });
  const lp = locale !== routing.defaultLocale ? `/${locale}` : "";

  // Свежие за NEW_SECTION_DAYS; при затишье — просто последние поступления
  let filter: { sort: string; days?: number; hasPrice: boolean } = { sort: "new", days: NEW_SECTION_DAYS, hasPrice: true };
  let data = await getProducts(page, PER_PAGE, filter);
  if (data.total < MIN_ITEMS) {
    filter = { sort: "new", hasPrice: true };
    data = await getProducts(page, PER_PAGE, filter);
  }
  const { items, total } = data;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  // номер страницы, которой нет (старая ссылка ?page=9) → начало списка (решение владельца 13.11)
  if (page > pages) permanentRedirect(`${lp}/products/new`);
  const { brands } = await getBrands().catch(() => ({ brands: [] as any[] }));
  const brandNameById = new Map(brands.map((b: any) => [b.id, localizeBrandName(b.slug, b.name, locale)]));

  // ItemList — свежая страница со ссылками на новые карточки ускоряет их обход
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("h1"),
    itemListElement: items.map((p, i) => ({
      "@type": "ListItem",
      position: (page - 1) * PER_PAGE + i + 1,
      url: `https://satsolutions.uz${locale === "ru" ? "" : `/${locale}`}/products/${p.slug}`,
    })),
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <div className="mx-auto max-w-[1180px]">
      <nav className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        <Link href="/" className="hover:text-brand-700">{tnav("home")}</Link>
        <span className="mx-1.5">/</span>
        <Link href="/products" className="hover:text-brand-700">{tnav("products")}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-900">{tm("newArrivals")}</span>
      </nav>

      <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("h1")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">{t("sub")}</p>

      <div className="mt-7">
        <InfiniteProducts
          key={page}
          variant="new"
          initial={items.map((p) => ({ p: slimProduct(p, false), name: localizeProductName(p, locale), brandName: (p.brandId && brandNameById.get(p.brandId)) || null }))}
          total={total}
          page={page}
          perPage={PER_PAGE}
          view="grid"
          params={{ sort: filter.sort, days: filter.days ? String(filter.days) : undefined, hasPrice: "1" }}
        />
      </div>

      <Pagination basePath="/products/new" page={page} limit={PER_PAGE} total={total} />
      </div>
    </div>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
