import type { Metadata } from "next";
import { notFound, permanentRedirect, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/api";
import { categoryTargetPath } from "@/lib/categoryTarget";
import { hiddenCategoryTarget } from "@/lib/hiddenBrands";
import { withOgUrl } from "@/lib/metadata";

// Единый каталог: брендовые страницы категорий схлопнуты на страницу типа
// (/products?type=<имя> — там товары + лонгрид + FAQ). Родительские → индекс /categories.
// 308 permanent — для консолидации старых URL в поиске.

async function generateMetadataBase({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
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

  // API отдаёт только категории С товарами: пустые разделы старой таксономии раньше давали
  // 404 (1145 штук в GSC) — теперь ведут на ближайшую живую страницу. Правило общее с
  // canonical фильтра и чипами поиска (lib/categoryTarget.ts).
  const { categories } = await getCategories();
  const target = categoryTargetPath(categories, slug);
  if (target) go(target);
  // Разделы временно снятых брендов (Tapo/HiLook/Mercusys, 02.11.2026): категория без товаров из API
  // не приходит, а адрес жив в Google — временный 307 на соседний раздел, как у карточек (lib/hiddenBrands.ts).
  // Вернутся товары — категория снова найдётся выше, и до этой строки дело не дойдёт.
  const hidden = hiddenCategoryTarget(slug, locale);
  if (hidden) redirect(hidden);
  notFound();
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
