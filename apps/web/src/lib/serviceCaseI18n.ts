import { routing } from "@/i18n/routing";
import OVERLAY from "@/data/serviceCaseI18n.json";

// Решения из таблицы site-БД `services` попадают в поиск (/search-cases) и
// показываются карточками в каталоге. В БД они только по-русски, поэтому
// накрываем их оверлеем по slug — так же, как товары и лонгриды категорий.
type Loc = { title?: string; excerpt?: string };
const MAP = OVERLAY as Record<string, Record<string, Loc>>;

export function localizeServiceCase<T extends { slug: string; title: string; excerpt?: string | null }>(
  c: T,
  locale: string
): T {
  if (locale === routing.defaultLocale) return c;
  const e = MAP[c.slug]?.[locale];
  if (!e) return c;
  return {
    ...c,
    title: e.title?.trim() || c.title,
    excerpt: e.excerpt?.trim() || c.excerpt
  };
}
