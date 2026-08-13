import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/api";
import { typeSlug } from "@/lib/typeSlug";
import { deadCategoryTarget } from "@/lib/deadCategories";

// Единый каталог: брендовые страницы категорий схлопнуты на страницу типа
// (/products?type=<имя> — там товары + лонгрид + FAQ). Родительские → индекс /categories.
// 308 permanent — для консолидации старых URL в поиске.

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: t("catalog"), alternates: { canonical: `/categories/${slug}` } };
}

export default async function CategoryRedirectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { categories } = await getCategories();
  const current = categories.find((c) => c.slug === slug);
  if (!current) {
    // API отдаёт только категории С товарами, поэтому пустые разделы старой
    // таксономии сюда не доходят. Раньше это был 404 (1145 штук в GSC) — теперь
    // уводим на ближайшую живую страницу, чтобы не жечь краулинговый бюджет.
    const target = deadCategoryTarget(slug);
    if (target) permanentRedirect(target);
    notFound();
  }

  const hasChildren = categories.some((c) => c.parentId === current.id);
  if (hasChildren) {
    permanentRedirect("/categories");
  }
  permanentRedirect(`/products/type/${typeSlug(current.name)}`);
}
