import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getProducts, getSitePage } from "@/lib/api";
import { BackButton } from "@/components/BackButton";
import { ProductCard } from "@/components/Cards";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { categories } = await getCategories();
    const current = categories.find((c) => c.slug === slug);
    return { title: current?.name ?? "Категория", alternates: { canonical: `/categories/${slug}` } };
  } catch {
    return { title: "Категория" };
  }
}

export default async function CategoryDrilldownPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories } = await getCategories();
  const current = categories.find((c) => c.slug === slug);
  if (!current) notFound();

  const children = categories
    .filter((c) => c.parentId === current.id)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  // Leaf category -> show products of this category directly on category page
  if (children.length === 0) {
    const parent = current.parentId ? categories.find((c) => c.id === current.parentId) ?? null : null;
    const siblings = current.parentId
      ? categories
          .filter((c) => c.parentId === current.parentId)
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
      : [];

    let usdToUzs = 1;
    try {
      const { page } = await getSitePage("site");
      const v = (page as any)?.data?.usdToUzs;
      const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
      if (Number.isFinite(n) && n > 0) usdToUzs = n;
    } catch {
      // ignore
    }

    const { items, total } = await getProducts(1, 24, { category: current.slug });

    return (
      <div className="container-page py-6 sm:py-10">
        <div className="mb-4">
          <BackButton />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{current.name}</h1>
        <p className="mt-2 max-w-prose text-sm text-slate-600">Товары в этой категории.</p>

        {siblings.length ? (
          <div className="mt-5">
            {parent ? <div className="text-sm font-semibold text-slate-900">{parent.name}</div> : null}
            <div className="mt-3 overflow-x-auto">
              <div className="min-w-max overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="flex items-stretch" role="tablist" aria-label="Подкатегории">
                  {parent ? (
                    <Link
                      href={`/categories/${encodeURIComponent(parent.slug)}`}
                      role="tab"
                      aria-selected={false}
                      className="whitespace-nowrap border-r border-slate-200 px-4 py-2 text-sm font-semibold bg-white text-slate-700 hover:bg-slate-50"
                    >
                      Все
                    </Link>
                  ) : null}
                  {siblings.map((c) => {
                    const active = c.id === current.id;
                    return (
                      <Link
                        key={c.id}
                        href={`/categories/${encodeURIComponent(c.slug)}`}
                        role="tab"
                        aria-selected={active}
                        className={`whitespace-nowrap px-4 py-2 text-sm font-semibold ${
                          active ? "bg-brand-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
                        } border-r border-slate-200`}
                      >
                        {c.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-4 text-sm text-slate-600">Найдено: {total}</div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-4">
        <BackButton />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{current.name}</h1>
      <p className="mt-2 max-w-prose text-sm text-slate-600">Выберите подкатегорию.</p>

      <div className="mt-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${encodeURIComponent(c.slug)}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-800 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50 hover:shadow-md"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

