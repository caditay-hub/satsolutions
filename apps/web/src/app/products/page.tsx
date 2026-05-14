import type { Metadata } from "next";
import Link from "next/link";
import { getBrands, getCategories, getProducts, getSitePage } from "@/lib/api";
import { ProductCard } from "@/components/Cards";
import { BackButton } from "@/components/BackButton";
import { Pagination } from "@/components/Pagination";
import { ProductsFilter } from "./ProductsFilter";

export const metadata: Metadata = {
  title: "Продукты",
  description: "Каталог продуктов"
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string; category?: string; brand?: string; q?: string; sort?: string; mp?: string; technology?: string; installationType?: string }>;
}) {
  const sp = await searchParams;
  const pageRaw = typeof sp.page === "string" ? sp.page : undefined;
  const categoryRaw = typeof sp.category === "string" ? sp.category : undefined;
  const brandRaw = typeof sp.brand === "string" ? sp.brand : undefined;
  const qRaw = typeof sp.q === "string" ? sp.q : undefined;
  const sortRaw = typeof sp.sort === "string" ? sp.sort : undefined;
  const mpRaw = typeof sp.mp === "string" ? sp.mp : undefined;
  const technologyRaw = typeof sp.technology === "string" ? sp.technology : undefined;
  const installationTypeRaw = typeof sp.installationType === "string" ? sp.installationType : undefined;

  const page = Math.max(1, Number(pageRaw ?? 1) || 1);
  const category = categoryRaw ? categoryRaw : undefined;
  const brand = brandRaw ? brandRaw : undefined;
  const q = qRaw ? qRaw : undefined;
  const sort = sortRaw ? sortRaw : undefined;
  const mp = mpRaw ? mpRaw : undefined;
  const technology = technologyRaw ? technologyRaw : undefined;
  const installationType = installationTypeRaw ? installationTypeRaw : undefined;

  let usdToUzs = 1;
  try {
    const { page } = await getSitePage("site");
    const v = (page as any)?.data?.usdToUzs;
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
    if (Number.isFinite(n) && n > 0) usdToUzs = n;
  } catch {
    // ignore
  }

  const [{ items, total }, { categories }, { brands }] = await Promise.all([
    getProducts(page, 12, { category, brand, q, sort, mp, technology, installationType }),
    getCategories(),
    getBrands()
  ]);

  const activeCategory = category ? categories.find((c) => c.slug === category || c.id === category) ?? null : null;

  return (
    <div className="container-page py-6 sm:py-10">
      {category ? (
        <div className="mb-4">
          <BackButton />
        </div>
      ) : null}
      <h1 className="text-3xl font-semibold tracking-tight">Продукты</h1>

      <ProductsFilter categories={categories} brands={brands} initial={{ q, category, brand, sort, mp, technology, installationType }} activeCategory={activeCategory} products={items} />

      <div className="mt-4 text-sm text-slate-600">Найдено: {total}</div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} />
        ))}
      </div>

      <Pagination basePath="/products" page={page} limit={12} total={total} params={{ q, category, brand, sort, mp, technology, installationType }} />
    </div>
  );
}

