import data from "@/data/pairSeoI18n.json";

// SEO-контент страниц бренд×категория (/catalog/[brand]/[type]): title + интро + FAQ, 5 языков.
// Ключ — `${brandSlug}|${typeSlug}`. Нет записи/локали → фолбэк ru → null (страница живёт
// на шаблонном title, текст-блок просто не рендерится).
export type PairSeo = { title: string; intro: string; faq: { q: string; a: string }[] };

export function getPairSeo(brandSlug: string, tSlug: string, locale: string): PairSeo | null {
  const b = (data as Record<string, Record<string, PairSeo>>)[`${brandSlug.toLowerCase()}|${tSlug}`];
  if (!b) return null;
  const v = b[locale] || b.ru;
  if (!v || !v.intro) return null;
  return { title: v.title || "", intro: v.intro, faq: Array.isArray(v.faq) ? v.faq : [] };
}
