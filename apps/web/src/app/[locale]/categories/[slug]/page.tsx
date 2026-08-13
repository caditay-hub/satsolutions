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

export default async function CategoryRedirectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  // permanentRedirect из next/navigation не знает про локаль — без префикса
  // узбекский посетитель улетал на русскую страницу (ru — локаль по умолчанию,
  // она без префикса).
  const go = (path: string): never => permanentRedirect(locale === "ru" ? path : `/${locale}${path}`);

  const { categories } = await getCategories();
  const current = categories.find((c) => c.slug === slug);
  if (!current) {
    // API отдаёт только категории С товарами, поэтому пустые разделы старой
    // таксономии сюда не доходят. Раньше это был 404 (1145 штук в GSC) — теперь
    // уводим на ближайшую живую страницу, чтобы не жечь краулинговый бюджет.
    const target = deadCategoryTarget(slug);
    if (target) go(target);
    notFound();
  }

  const hasChildren = categories.some((c) => c.parentId === current.id);
  if (hasChildren) {
    go("/categories");
  }
  go(`/products/type/${typeSlug(current.name)}`);
}
