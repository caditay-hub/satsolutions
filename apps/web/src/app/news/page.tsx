import type { Metadata } from "next";
import { getNews } from "@/lib/api";
import { NewsCard } from "@/components/Cards";
import { Pagination } from "@/components/Pagination";

export const metadata: Metadata = {
  title: "Новости",
  description: "Новости компании и продуктов"
};

export default async function NewsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(typeof sp.page === "string" ? sp.page : 1) || 1);
  const { items, total, limit } = await getNews(page, 12);

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Новости</h1>
      <p className="mt-2 max-w-prose text-sm text-slate-600">Пресс‑релизы, события и обновления продуктов.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((n) => (
          <NewsCard key={n.id} n={n} />
        ))}
      </div>
      <Pagination basePath="/news" page={page} limit={limit} total={total} />
    </div>
  );
}

