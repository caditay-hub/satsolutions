import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { REMOVED_PRODUCT_REDIRECTS } from "./lib/removedProducts";

const intlMiddleware = createMiddleware(routing);

// Префикс локали для URL (ru — дефолтная, без префикса): "uz|en|tr|zh"
const localeAlt = routing.locales.filter((l) => l !== routing.defaultLocale).join("|");
const REMOVED_RE = new RegExp(`^(?:/(${localeAlt}))?/products/([^/]+)/?$`);
// URL движка старого сайта (до 2024): /product/show/*, /category/*, /brand/* — слаги не маппятся
// на новые, поэтому ведём на ближайший живой раздел (GSC до сих пор их сканирует → 404).
const OLDSITE_RE = new RegExp(`^(?:/(${localeAlt}|ru))?/(product/show|category|brand)(/.+)?$`);

export default function middleware(req: NextRequest) {
  // Снятые с продажи товары (см. removedProducts.ts): старые URL в индексе Google отдавали 404.
  // 308 на страницу бренда — очищает индекс, возвращает вес, убирает тупик для пользователя.
  const m = req.nextUrl.pathname.match(REMOVED_RE);
  if (m) {
    const slug = decodeURIComponent(m[2]);
    const brand = REMOVED_PRODUCT_REDIRECTS[slug];
    if (brand) {
      const prefix = m[1] ? `/${m[1]}` : "";
      return NextResponse.redirect(new URL(`${prefix}/catalog/${brand}`, req.url), 308);
    }
  }
  const old = req.nextUrl.pathname.match(OLDSITE_RE);
  if (old) {
    const prefix = old[1] && old[1] !== "ru" ? `/${old[1]}` : "";
    const target = old[2] === "product/show" ? "/products" : "/catalog";
    return NextResponse.redirect(new URL(`${prefix}${target}`, req.url), 308);
  }
  return intlMiddleware(req);
}

export const config = {
  // Применяем ко всем путям, кроме api, статики, файлов с расширением и служебных
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
