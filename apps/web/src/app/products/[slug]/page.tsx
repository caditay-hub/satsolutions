import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getSitePage } from "@/lib/api";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/price";
import { BackButton } from "@/components/BackButton";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductCard } from "@/components/Cards";

function pickRate(data: any): number | null {
  const v = data?.usdToUzs;
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { product } = await getProductBySlug(slug);
    const ogImage = resolveImageUrl(product.coverImageUrl) ?? undefined;
    return {
      title: product.name,
      description: product.shortDescription ?? product.name,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: {
        title: product.name,
        description: product.shortDescription ?? product.name,
        images: ogImage ? [{ url: ogImage }] : undefined
      }
    };
  } catch {
    return { title: "Продукт" };
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const { product } = await getProductBySlug(slug);
    let usdToUzs = 1;
    try {
      const { page } = await getSitePage("site");
      usdToUzs = pickRate(page.data) ?? 1;
    } catch {
      // ignore
    }

    const priceUzs = (product as any).isUsd ? Number(product.price ?? 0) * usdToUzs : Number(product.price ?? 0);
    const characteristics = product.characteristics ?? {};
    const img = resolveImageUrl(product.coverImageUrl);

    const recommended = await getProducts(1, 8, { recommended: true });
    const recommendedItems = recommended.items.filter((p) => p.id !== product.id).slice(0, 6);
    return (
      <div className="container-page py-6 sm:py-10">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="grid gap-8 lg:grid-cols-[30%_1fr]">
          <div>
            {img ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  alt={product.name}
                  src={img}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 py-16 text-sm text-slate-600">
                Нет изображения
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{product.name}</h1>
            {product.shortDescription ? <p className="mt-3 text-slate-600">{product.shortDescription}</p> : null}
            <div className="mt-4 w-fit rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-sm text-slate-600">Цена</div>
              <div className="mt-1 text-2xl font-semibold text-slate-900">
                {formatPrice(priceUzs)} UZS
              </div>
            </div>
            <div className="mt-4">
              <AddToCartButton
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                item={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: String(priceUzs),
                  coverImageUrl: product.coverImageUrl
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-10 w-full">
          {Object.keys(characteristics).length ? (
            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="bg-slate-50 px-4 py-3 text-sm font-semibold">Характеристики</div>
              <dl className="divide-y divide-slate-200 bg-white">
                {Object.entries(characteristics).map(([k, v]) => (
                  <div key={k} className="grid grid-cols-1 gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
                    <dt className="text-sm font-bold text-slate-700 sm:font-medium">{k}</dt>
                    <dd className="text-sm text-slate-600 sm:col-span-2">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {product.description ? (
            <div className="prose prose-slate mt-6 max-w-none">
              <p>{product.description}</p>
            </div>
          ) : null}
        </div>

        {recommendedItems.length ? (
          <div className="mt-14">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-2xl font-semibold tracking-tight">Рекомендуемые товары</div>
                <div className="mt-1 text-sm text-slate-600">Подборка товаров, которые могут вам подойти.</div>
              </div>
            </div>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedItems.map((p) => (
                <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    );
  } catch {
    notFound();
  }
}

