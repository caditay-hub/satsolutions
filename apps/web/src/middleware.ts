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
// Вариант с /public/ (внутренний путь старого движка) тоже жил в индексе Google.
const OLDSITE_RE = new RegExp(`^(?:/public)?(?:/(${localeAlt}|ru))?/(product/show|products/filter|category|brand)(/.+)?$`);

// Точечные маппинги старых URL, которые ДО СИХ ПОР ранжируются в Google (из GSC):
// ведём не на общий каталог, а на живой релевантный товар/раздел — сохраняем показы.
const LEGACY_PRODUCT_REDIRECTS: Record<string, string> = {
  "kamera-videonabliudeniia-hikvision-ds-2cd1083g2-liu": "hik-ds-2cd1083g2-liu-2-8mm",
  "videoregistrator-dhi-nvr1108hs-s3h": "dahua-dhi-nvr1108hs-s3-h",
};
const LEGACY_CATEGORY_REDIRECTS: Record<string, string> = {
  "sistemy_videonablyudeniya": "/products/group/videonablyudenie",
  "sistemy_hraneniya_dannyh": "/products/type/servernoe-oborudovanie",
};

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
    const tail = old[3] ? decodeURIComponent(old[3].slice(1)) : "";
    // точечные маппинги ранжирующихся URL → конкретный товар/раздел
    if (old[2] === "product/show" && tail) {
      for (const [key, slug] of Object.entries(LEGACY_PRODUCT_REDIRECTS)) {
        if (tail.startsWith(key)) {
          return NextResponse.redirect(new URL(`${prefix}/products/${slug}`, req.url), 308);
        }
      }
    }
    if (old[2] === "category" && tail) {
      const dest = LEGACY_CATEGORY_REDIRECTS[tail.split("/")[0]];
      if (dest) return NextResponse.redirect(new URL(`${prefix}${dest}`, req.url), 308);
    }
    const target = old[2] === "product/show" || old[2] === "products/filter" ? "/products" : "/catalog";
    return NextResponse.redirect(new URL(`${prefix}${target}`, req.url), 308);
  }
  return intlMiddleware(req);
}

export const config = {
  // Применяем ко всем путям, кроме api, статики, файлов с расширением и служебных
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
