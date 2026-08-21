import { routing } from "@/i18n/routing";
import MAP from "@/data/charKeyI18n.json";

// Перевод НАЗВАНИЙ характеристик (ключи в БД — на русском): карточка товара и фильтр каталога.
// Словарь собран из всех 878 ключей прода; при добавлении новых характеристик — дописывать сюда,
// иначе ключ отрендерится по-русски на всех языках (фолбэк).
type Loc = { uz: string; en: string; tr: string; zh: string };
const CHAR_KEYS = MAP as Record<string, Loc>;

/** Локализованное имя характеристики (фолбэк на русское). */
export function localizeCharKey(key: string, locale: string): string {
  if (!key || locale === routing.defaultLocale) return key;
  const e = CHAR_KEYS[key];
  if (!e) return key;
  return (e as Record<string, string>)[locale]?.trim() || key;
}
