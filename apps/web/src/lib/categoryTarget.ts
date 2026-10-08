import type { CategoryDto } from "@/lib/api";
import { typeSlug } from "@/lib/typeSlug";
import { deadCategoryTarget } from "@/lib/deadCategories";

/**
 * Конечный адрес для категории старой таксономии (без префикса локали).
 * Одно правило на всех (ТЗ BO, 08.10.2026): редирект /categories/<slug>, canonical
 * фильтра /products?category=<slug> и чипы «Уточнить» в поиске. Раньше canonical и чипы
 * вели на /categories/<slug>, а тот сам редиректит — canonical указывал на редирект.
 *   живая категория без подкатегорий → /products/type/<тип>
 *   родительская                       → /categories (оглавление каталога)
 *   пустая/снятая                      → ближайшая живая страница (deadCategories) или null
 */
export function categoryTargetPath(categories: CategoryDto[], slug: string): string | null {
  const cur = categories.find((c) => c.slug === slug || c.id === slug);
  if (!cur) return deadCategoryTarget(slug);
  if (categories.some((c) => c.parentId === cur.id)) return "/categories";
  return `/products/type/${typeSlug(cur.name)}`;
}
