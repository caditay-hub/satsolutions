import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getBrands, getProducts } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { localizeProductName } from "@/lib/productI18n";
import { NewArrivalCard } from "@/components/Cards";

export const revalidate = 300;

// «Новинки»: товары за последние NEW_SECTION_DAYS дней (sort=new). Если свежих
// мало (затишье в поставках) — страница не пустеет: показываем просто последние
// поступления без ограничения по дате.
// 60 дней — как у бейджа «Новинка» (NEW_BADGE_DAYS): раздел показывает ровно то,
// что помечено бейджем. 90 дней захватывало первичную заливку каталога (июнь).
const NEW_SECTION_DAYS = 60;
const PER_PAGE = 24;
const MIN_ITEMS = 12;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "newPage" });
  return {
    title: { absolute: t("title") },
    description: t("desc"),
    alternates: hreflangAlternates("/products/new", locale),
    openGraph: { title: t("title"), description: t("desc"), locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function NewArrivalsPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams?: Promise<{ page?: string }> }) {
  const { locale } = await params;
  const sp = (await searchParams) ?? {};
  const page = Math.max(1, Number(sp.page) || 1);
  const t = await getTranslations({ locale, namespace: "newPage" });
  const tnav = await getTranslations({ locale, namespace: "nav" });
  const tm = await getTranslations({ locale, namespace: "catalogMega" });

  // Свежие за 90 дней; при затишье — просто последние поступления
  let data = await getProducts(page, PER_PAGE, { sort: "new", days: NEW_SECTION_DAYS });
  if (data.total < MIN_ITEMS) {
    data = await getProducts(page, PER_PAGE, { sort: "new" });
  }
  const { items, total } = data;
  const { brands } = await getBrands().catch(() => ({ brands: [] as any[] }));
  const brandNameById = new Map(brands.map((b: any) => [b.id, b.name]));
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

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
      <nav className="mb-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
        <Link href="/" className="hover:text-brand-700">{tnav("home")}</Link>
        <span className="mx-1.5">/</span>
        <Link href="/products" className="hover:text-brand-700">{tnav("products")}</Link>
        <span className="mx-1.5">/</span>
        <span className="text-slate-900">{tm("newArrivals")}</span>
      </nav>

      <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("h1")}</h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">{t("sub")}</p>

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((p) => (
          <NewArrivalCard key={p.id} p={p} name={localizeProductName(p, locale)} brandName={(p.brandId && brandNameById.get(p.brandId)) || null} />
        ))}
      </div>

      {pages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pages }, (_, i) => i + 1)
            .filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 2)
            .map((n, idx, arr) => (
              <span key={n} className="flex items-center gap-2">
                {idx > 0 && n - arr[idx - 1] > 1 ? <span className="text-slate-400">…</span> : null}
                <Link
                  href={n === 1 ? "/products/new" : (`/products/new?page=${n}` as any)}
                  className={`rounded-lg px-3.5 py-2 text-sm font-bold ${n === page ? "bg-brand-600 text-white" : "border border-slate-200 text-slate-700 hover:border-brand-400"}`}
                >
                  {n}
                </Link>
              </span>
            ))}
        </div>
      )}
      </div>
    </div>
  );
}
