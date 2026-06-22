import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getCategories } from "@/lib/api";
import { typeSlug } from "@/lib/typeSlug";

// Единый каталог: брендовые страницы категорий схлопнуты на страницу типа
// (/products?type=<имя> — там товары + лонгрид + FAQ). Родительские → индекс /categories.
// 308 permanent — для консолидации старых URL в поиске.

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: "Категория", alternates: { canonical: `/categories/${slug}` } };
}

export default async function CategoryRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories } = await getCategories();
  const current = categories.find((c) => c.slug === slug);
  if (!current) notFound();

  const hasChildren = categories.some((c) => c.parentId === current.id);
  if (hasChildren) {
    permanentRedirect("/categories");
  }
  permanentRedirect(`/products/type/${typeSlug(current.name)}`);
}
