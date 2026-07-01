import overlay from "@/data/categoryLongreadI18n.json";
import { routing } from "@/i18n/routing";

type LongreadOverlay = Record<string, Partial<Record<string, string>>>;

/**
 * Локализует лонгрид категории (`site_pages[category:<slug>].content`).
 * Оверлей `categoryLongreadI18n.json` keyed by slug → { uz|en|tr|zh: content }.
 * Фолбэк на RU-оригинал, если перевода ещё нет (без регрессии при частичном покрытии).
 */
export function localizeLongread(slug: string, ruContent: string, locale: string): string {
  if (!ruContent || locale === routing.defaultLocale) return ruContent;
  const t = (overlay as LongreadOverlay)[slug]?.[locale];
  return t && t.trim() ? t : ruContent;
}
