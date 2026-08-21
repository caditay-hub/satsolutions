import { routing } from "@/i18n/routing";
import MAP from "@/data/charValueI18n.json";

// Перевод ЗНАЧЕНИЙ характеристик. Раньше считалось, что значения языконейтральны
// («H.265», «IP66», «2 MP»), но половина каталога хранит русские фразы
// («Настольный», «Домофонные системы») — они текли в uz/en/tr/zh.
// Здесь только значения, содержащие кириллицу; языконейтральные не попадают в словарь
// и отдаются как есть.
type Loc = { uz: string; en: string; tr: string; zh: string };
const CHAR_VALUES = MAP as Record<string, Loc>;

/** Локализованное значение характеристики (фолбэк на исходное). */
export function localizeCharValue(value: string, locale: string): string {
  if (!value || locale === routing.defaultLocale) return value;
  const e = CHAR_VALUES[value];
  if (!e) return value;
  return (e as Record<string, string>)[locale]?.trim() || value;
}
