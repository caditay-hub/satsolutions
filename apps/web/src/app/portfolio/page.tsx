import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { resolveImageUrl } from "@/lib/image";
import { getPortfolio, getPortfolioCategories } from "@/lib/api";
import { Pagination } from "@/components/Pagination";
import { PortfolioFilter } from "./PortfolioFilter";

export const metadata: Metadata = {
  title: "Портфолио",
  description: "Выполненные проекты"
};

export default async function PortfolioPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const [{ items, total, limit }, { categories }] = await Promise.all([
    getPortfolio(page, 12, { category }),
    getPortfolioCategories()
  ]);
  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Портфолио</h1>

      <PortfolioFilter categories={categories} activeSlug={category} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/portfolio/${p.slug}`}
            className="card-interactive"
          >
            <div className="overflow-hidden">
              {resolveImageUrl(p.coverImageUrl) ? (
                <Image
                  alt={p.title}
                  src={resolveImageUrl(p.coverImageUrl)!}
                  width={1200}
                  height={750}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="h-auto w-full bg-slate-100 transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full items-center justify-center bg-slate-100 text-sm text-slate-500">
                  Нет изображения
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="text-base font-semibold text-slate-900">{p.title}</div>
              {p.excerpt ? <p className="mt-1 line-clamp-2 text-sm text-slate-600">{p.excerpt}</p> : null}
              <div className="mt-3 text-xs font-medium text-brand-700">Смотреть →</div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination basePath="/portfolio" page={page} limit={limit} total={total} params={{ category }} />
    </div>
  );
}

