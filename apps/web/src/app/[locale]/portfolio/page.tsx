import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { resolveImageUrl } from "@/lib/image";
import { getPortfolio, getPortfolioCategories } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { getTranslations, getLocale } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { localizeCategoryName, localizePortfolioProject } from "@/lib/contentI18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  return {
    title: t("title"),
    description: t("metaDesc"),
    alternates: hreflangAlternates("/portfolio", locale)
  };
}

function chipClass(active: boolean) {
  return `rounded-full border px-4 py-1.5 text-sm font-bold transition-colors ${
    active
      ? "border-brand-600 bg-brand-50 text-brand-700"
      : "border-slate-300 bg-white text-slate-700 hover:border-brand-400 hover:text-brand-700"
  }`;
}

export default async function PortfolioPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const t = await getTranslations("portfolio");
  const locale = await getLocale();
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const [{ items: rawItems, total, limit }, { categories }] = await Promise.all([
    getPortfolio(page, 12, { category }),
    getPortfolioCategories()
  ]);
  const items = rawItems.map((p) => localizePortfolioProject(p, locale));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  // JSON-LD: список кейсов (CollectionPage + ItemList) — для выдачи по «кейсы/проекты»
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("title"),
    url: `${siteUrl}${lp}/portfolio`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: (page - 1) * limit + i + 1,
        name: it.title,
        url: `${siteUrl}${lp}/portfolio/${it.slug}`,
      })),
    },
  };

  return (
    <div className="container-page !pt-3 !pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <h1 className="text-xl sm:text-2xl font-black tracking-tight">{t("title")}</h1>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        {t("subtitle")}
      </p>

      {categories.length > 1 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/portfolio" className={chipClass(!category)}>
            {t("all")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/portfolio?category=${encodeURIComponent(c.slug)}`}
              className={chipClass(category === c.slug)}
            >
              {localizeCategoryName(c.slug, c.name, locale)}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => {
          const img = resolveImageUrl(p.coverImageUrl);
          const cat = p.portfolioCategoryId ? categoryById.get(p.portfolioCategoryId) : undefined;
          const year = p.completedAt ? new Date(p.completedAt).getFullYear() : null;
          return (
            <Link
              key={p.id}
              href={`/portfolio/${p.slug}`}
              className="card-interactive group flex flex-col overflow-hidden rounded-2xl border-2 border-slate-200 hover:border-brand-500"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                {img ? (
                  <Image
                    alt={p.title}
                    src={img}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm font-bold text-slate-400">
                    {t("noImage")}
                  </div>
                )}
                {cat ? (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur">
                    {localizeCategoryName(cat.slug, cat.name, locale)}
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="text-base font-bold leading-snug text-slate-950 line-clamp-2 group-hover:text-brand-700">
                  {p.title}
                </div>
                {p.excerpt ? (
                  <p className="mt-2 line-clamp-2 text-sm font-medium text-slate-600">{p.excerpt}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                  <span className="truncate text-sm font-semibold text-slate-500">
                    {[p.clientName, year].filter(Boolean).join(" · ")}
                  </span>
                  <span className="shrink-0 text-xs font-black uppercase tracking-wider text-brand-700">
                    {t("view")}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      <Pagination basePath="/portfolio" page={page} limit={limit} total={total} params={{ category }} />
    </div>
  );
}
