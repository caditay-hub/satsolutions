// og:locale по локали приложения (Open Graph ожидает формат xx_XX).
export const OG_LOCALE: Record<string, string> = {
  ru: "ru_RU", uz: "uz_UZ", en: "en_US", tr: "tr_TR", zh: "zh_CN",
};

export function ogLocale(locale: string): string {
  return OG_LOCALE[locale] ?? "ru_RU";
}
