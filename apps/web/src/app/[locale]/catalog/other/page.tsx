import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { getBrands, getProducts, type ProductDto } from "@/lib/api";
import { ProductCard } from "@/components/Cards";
import { BackButton } from "@/components/BackButton";
import { hreflangAlternates } from "@/lib/hreflang";
import { localizeProductName } from "@/lib/productI18n";
import { getLocale } from "next-intl/server";
import {
  splitBrands,
  OTHER_BRANDS_SLUG,
  OTHER_BRANDS_NAME,
  OTHER_BRANDS_DESCRIPTION,
} from "@/lib/brandGroups";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `${OTHER_BRANDS_NAME} — Каталог продукции`,
    description: OTHER_BRANDS_DESCRIPTION,
    alternates: hreflangAlternates(`/catalog/${OTHER_BRANDS_SLUG}`, locale),
  };
}

export default async function OtherBrandsPage() {
  const locale = await getLocale();
  const { brands } = await getBrands().catch(() => ({ brands: [] }));
  const { small } = splitBrands(brands);

  // Подтягиваем товары каждого мелкого бренда (их немного — до 20 на бренд).
  const sections = await Promise.all(
    small.map(async (b) => {
      const slug = b.slug.toLowerCase();
      const { items } = await getProducts(1, Math.max(b.productCount ?? 0, 24), {
        brand: slug,
      }).catch(() => ({ items: [] as ProductDto[] }));
      const sorted = [...items].sort(
        (a, b2) => Number(!!b2.recommended) - Number(!!a.recommended),
      );
      return { brand: b, slug, items: sorted };
    }),
  );
  const withItems = sections.filter((s) => s.items.length > 0);
  const total = withItems.reduce((s, sec) => s + sec.items.length, 0);

  return (
    <div className="min-h-screen bg-white font-main">
      {/* ── Page header (compact) ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page !pt-2 !pb-3">
          <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Главная
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/catalog" className="hover:text-slate-900 transition-colors">
              Каталог
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{OTHER_BRANDS_NAME}</span>
          </nav>

          <div className="flex items-center gap-3">
            <BackButton />
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {OTHER_BRANDS_NAME} — каталог продукции
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                {OTHER_BRANDS_DESCRIPTION}
              </p>
            </div>
            <span className="hidden sm:inline shrink-0 rounded-full bg-slate-900/85 px-2.5 py-1 text-[11px] font-bold leading-none text-white">
              {total} тов. · {withItems.length} брендов
            </span>
          </div>
        </div>
      </div>

      {/* ── Body: секция на каждый бренд ── */}
      <div className="container-page !pt-3 !pb-10">
        {withItems.length === 0 ? (
          <div className="py-14 text-center text-sm text-slate-400">Товаров пока нет.</div>
        ) : (
          <div className="space-y-7">
            {withItems.map(({ brand, slug, items }) => (
              <section key={slug} id={`brand-${slug}`} className="scroll-mt-20">
                <div className="flex items-baseline gap-3 mb-2 pb-1 border-b border-slate-200">
                  <Link
                    href={`/catalog/${slug}`}
                    className="text-sm font-black text-slate-900 uppercase tracking-wide hover:text-[#e02020] transition-colors"
                  >
                    {brand.name}
                  </Link>
                  <span className="text-xs font-bold text-slate-400">{items.length}</span>
                  <Link
                    href={`/catalog/${slug}`}
                    className="ml-auto text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#e02020] transition-colors"
                  >
                    Весь бренд →
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                  {items.map((p) => (
                    <ProductCard key={p.id} p={p} name={localizeProductName(p, locale)} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
