import { defineRouting } from "next-intl/routing";

export const locales = ["ru", "uz", "en", "tr", "zh"] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: "ru",
  // Русский — основной, без префикса в URL; остальные с префиксом (/uz, /en, /tr, /zh)
  localePrefix: "as-needed",
  // НЕ определять язык по браузеру: по умолчанию всегда русский (иначе телефоны с
  // англ. языком системы автоматически уходили на /en). Язык меняется вручную.
  localeDetection: false
});

export const localeNames: Record<string, string> = {
  ru: "Русский",
  uz: "O‘zbekcha",
  en: "English",
  tr: "Türkçe",
  zh: "中文"
};
