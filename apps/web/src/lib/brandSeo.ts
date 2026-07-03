import data from "@/data/brandSeoI18n.json";

// SEO-контент бренд-страниц (/catalog/[brand]): title + текст 300–450 слов + FAQ,
// на 5 языках. Источник — brandSeoI18n.json (генерация 02.07.2026, ~20 брендов).
// Фолбэк: нет локали → ru; нет бренда → null (страница живёт со старым шаблоном).
export type BrandSeo = { title: string; intro: string; faq: { q: string; a: string }[] };

export function getBrandSeo(slug: string, locale: string): BrandSeo | null {
  const b = (data as Record<string, Record<string, BrandSeo>>)[slug.toLowerCase()];
  if (!b) return null;
  const v = b[locale] || b.ru;
  if (!v || !v.intro) return null;
  return { title: v.title || "", intro: v.intro, faq: Array.isArray(v.faq) ? v.faq : [] };
}
