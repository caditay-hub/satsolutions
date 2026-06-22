import { routing } from "@/i18n/routing";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

/**
 * hreflang-альтернаты для пути (без локали), напр. "" для главной, "/solutions".
 * `locale` задаёт self-canonical текущей языковой версии (/en → /en, ...).
 * Без `locale` canonical указывает на дефолтную (ru) версию — для обратной совместимости.
 */
export function hreflangAlternates(path: string, locale?: string) {
  const clean = path === "/" ? "" : path.replace(/\/$/, "");
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    const prefix = loc === routing.defaultLocale ? "" : `/${loc}`;
    languages[loc] = `${SITE}${prefix}${clean}` || `${SITE}/`;
  }
  languages["x-default"] = `${SITE}${clean}` || `${SITE}/`;
  const selfPrefix = locale && locale !== routing.defaultLocale ? `/${locale}` : "";
  return {
    canonical: `${SITE}${selfPrefix}${clean}` || `${SITE}/`,
    languages
  };
}
