import overlay from "@/data/productI18n.json";
import { routing } from "@/i18n/routing";
import { localizeCharKey } from "./charKeyI18n";
import { localizeCharValue } from "./charValueI18n";

/**
 * Оверлей переводов контента товаров (name + shortDescription) на uz/en/tr/zh.
 * Источник = машинный перевод каталога (см. .seo-analysis/, генерится из БД).
 * Ключ = product.id. Базовый язык ru берётся из самого товара (БД).
 */
type LocFields = { name?: string; shortDescription?: string; description?: string; characteristics?: Record<string, string> };
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

/** Возвращает переведённое полное описание (markdown) с фолбэком на русское из БД. */
export function localizeDescription(
  productId: string | undefined,
  description: string | null | undefined,
  locale: string
): string {
  const base = description ?? "";
  if (!productId || locale === routing.defaultLocale) return base;
  return MAP[productId]?.[locale]?.description?.trim() || base;
}

/**
 * Возвращает переведённые характеристики.
 * Приоритет: поштучный перевод для товара (если задан в оверлее) → общие словари
 * ключей и значений → исходная русская строка. Раньше был только первый шаг, поэтому
 * характеристики 2860 товаров из 3256 показывались по-русски на всех языках.
 */
export function localizeCharacteristics(
  productId: string | undefined,
  characteristics: Record<string, unknown>,
  locale: string
): Record<string, unknown> {
  if (locale === routing.defaultLocale) return characteristics;
  const perProduct = productId ? MAP[productId]?.[locale]?.characteristics : undefined;
  if (perProduct) return perProduct;
  if (!characteristics) return characteristics;
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(characteristics)) {
    const k = localizeCharKey(key, locale);
    out[k] = typeof value === "string" ? localizeCharValue(value, locale) : value;
  }
  return out;
}
