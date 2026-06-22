import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import ProductsPage from "../../page";

export const revalidate = 300;

/** slug → точное имя типа (кириллица), по которому фильтруются товары.
 *  Источник = имена категорий (тот же набор, что эмитит sitemap). */
async function resolveTypeName(slug: string): Promise<string | null> {
  try {
    const { categories } = await getCategories();
    const hit = categories.find((c) => c.name && typeSlug(c.name) === slug);
    return hit?.name ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const name = await resolveTypeName(slug);
  if (!name) return { title: "Продукция" };
  const title = `${name} — купить в Ташкенте`;
  const description = `${name}: каталог, цены, подбор и доставка по Ташкенту и Узбекистану. Официальная гарантия, монтаж и сервис от SAT Solutions.`;
  return {
    title,
    description,
    alternates: hreflangAlternates(`/products/type/${slug}`, locale),
    openGraph: { title, description },
  };
}

export default async function ProductTypePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const name = await resolveTypeName(slug);
  if (!name) notFound();
  // Переиспользуем рендер каталога /products для type=<name>.
  // __clean=1 — признак внутреннего вызова (чтобы /products НЕ делал 301 обратно сюда).
  return ProductsPage({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({ type: name, __clean: "1" }),
  } as any);
}
