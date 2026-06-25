import overlay from "@/data/productI18n.json";
import { routing } from "@/i18n/routing";

/**
 * Оверлей переводов контента товаров (name + shortDescription) на uz/en/tr/zh.
 * Источник = машинный перевод каталога (см. .seo-analysis/, генерится из БД).
 * Ключ = product.id. Базовый язык ru берётся из самого товара (БД).
 */
type LocFields = { name?: string; shortDescription?: string; characteristics?: Record<string, string> };
const MAP = overlay as Record<string, Record<string, LocFields>>;

export interface LocalizableProduct {
  id?: string;
  name?: string;
  shortDescription?: string | null;
}

/** Возвращает локализованные name/shortDescription с фолбэком на русский (из БД). */
export function localizeProduct(
  product: LocalizableProduct,
  locale: string
): { name: string; shortDescription: string } {
  const base = {
    name: product.name ?? "",
    shortDescription: product.shortDescription ?? "",
  };
  if (!product.id || locale === routing.defaultLocale) return base;
  const e = MAP[product.id]?.[locale];
  if (!e) return base;
  return {
    name: e.name?.trim() || base.name,
    shortDescription: e.shortDescription?.trim() || base.shortDescription,
  };
}

/** Только локализованное имя (для карточек/листингов). */
export function localizeProductName(product: LocalizableProduct, locale: string): string {
  if (!product.id || locale === routing.defaultLocale) return product.name ?? "";
  return MAP[product.id]?.[locale]?.name?.trim() || (product.name ?? "");
}

/** Возвращает переведённые характеристики (фолбэк на оригинальные из БД). */
export function localizeCharacteristics(
  productId: string | undefined,
  characteristics: Record<string, unknown>,
  locale: string
): Record<string, unknown> {
  if (!productId || locale === routing.defaultLocale) return characteristics;
  const translated = MAP[productId]?.[locale]?.characteristics;
  if (!translated) return characteristics;
  return translated;
}
