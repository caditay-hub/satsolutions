import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getBrands } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { hreflangAlternates } from "@/lib/hreflang";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Каталог продукции",
    alternates: hreflangAlternates("/catalog", locale),
    description:
      "Каталог продукции ведущих производителей: Dahua Technology, Hikvision и других. Системы видеонаблюдения, безопасности и IT-решения.",
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

export default async function CatalogIndexPage() {
  // Список брендов — динамический, из БД (published, по sortOrder).
  const { brands: dbBrands } = await getBrands().catch(() => ({ brands: [] }));
  const BRANDS = dbBrands
    .filter((b) => (b as any).published !== false)
    .map((b) => ({
      slug: b.slug.toLowerCase(),
      fallbackName: b.name,
      color: BRAND_COLORS[b.slug.toLowerCase()] ?? "#328fa8",
    }));
  const brands = dbBrands;

  return (
    <div className="min-h-screen bg-white font-main">
      <div className="container-page !pt-4 !pb-10">
        {/* Compact header row: back + breadcrumb */}
        <div className="flex items-center gap-3 mb-3">
          <BackButton />
          <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">Каталог</span>
          </nav>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Каталог продукции</h1>
        <p className="mt-1 text-sm text-slate-500">Выберите производителя для просмотра полного каталога</p>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {BRANDS.map(({ slug, fallbackName, color }) => {
            const brand = brands.find((b) => b.slug.toLowerCase() === slug);
            const logo = brand?.logoImageUrl ? resolveImageUrl(brand.logoImageUrl) : null;
            const name = brand?.name ?? fallbackName;
            const count = brand?.productCount ?? 0;

            return (
              <Link
                key={slug}
                href={`/catalog/${slug}`}
                className="group relative border-2 border-slate-200 hover:shadow-xl transition-all bg-white overflow-hidden flex flex-col"
                style={{ "--brand-color": color } as React.CSSProperties}
              >
                {count > 0 && (
                  <span
                    className="absolute top-2 right-2 z-10 rounded-full bg-slate-900/85 px-2 py-0.5 text-[11px] font-bold leading-none text-white shadow-sm"
                    title={`Товаров в каталоге: ${count}`}
                  >
                    {count} тов.
                  </span>
                )}
                <div className="flex-1 flex items-center justify-center p-3 bg-white min-h-[150px]">
                  {logo ? (
                    <div className="relative h-32 w-full">
                      <Image
                        src={logo}
                        alt={name}
                        fill
                        className="object-contain"
                        sizes="320px"
                      />
                    </div>
                  ) : (
                    <span className="text-xl font-black text-slate-900 text-center leading-tight">
                      {name}
                    </span>
                  )}
                </div>
                <div
                  className="px-5 py-3 flex items-center justify-between border-t border-slate-100"
                  style={{ backgroundColor: "#fafafa" }}
                >
                  <span className="text-xs font-bold text-slate-600 group-hover:text-[#e02020] transition-colors uppercase tracking-wider">
                    Смотреть каталог
                  </span>
                  <svg
                    className="w-4 h-4 text-slate-300 group-hover:text-[#e02020] transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
