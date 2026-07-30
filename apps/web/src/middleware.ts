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

// Дубли услуг из БД → 308 на каноническую (найдено техпрогоном 19.07: задвоение «Охранные системы»).
const REMOVED_SERVICE_REDIRECTS: Record<string, string> = {
  "ohrannye-sistemy-2": "ohrannye-sistemy",
};
const SVC_RE = new RegExp(`^(?:/(${localeAlt}))?/solutions/([^/]+)/?$`);

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

// ── Автоопределение узбекского (только оно; общий localeDetection выключен, см. routing.ts) ──
// Живой посетитель с узбекским языком системы получает /uz-версию. Ботов НЕ трогаем (иначе
// Googlebot начнёт видеть редиректы вместо русских канонических страниц), ручной выбор языка
// (cookie NEXT_LOCALE от переключателя) всегда важнее автоопределения. Редирект 307 —
// временный: канонические URL остаются русскими.
const BOT_RE = /bot|crawler|spider|crawl|slurp|googlebot|bingbot|yandex|duckduck|baidu|facebookexternal|applebot|petal|ahrefs|semrush|lighthouse|headless|monitoring|preview|curl|wget|python|go-http/i;
const LOCALE_PREFIX_RE = new RegExp(`^/(${localeAlt})(/|$)`);

function prefersUz(req: NextRequest) {
  // Берём только САМЫЙ приоритетный язык браузера: «uz» где-то в хвосте списка не считается.
  const first = (req.headers.get("accept-language") || "").split(",")[0]?.trim().toLowerCase() ?? "";
  return first.startsWith("uz");
}

function uzAutoRedirect(req: NextRequest) {
  const p = req.nextUrl.pathname;
  if (LOCALE_PREFIX_RE.test(p)) return null;                 // уже на нерусской версии
  if (req.cookies.get("NEXT_LOCALE")) return null;           // язык выбран вручную — уважаем
  if (BOT_RE.test(req.headers.get("user-agent") || "")) return null;
  if (!prefersUz(req)) return null;
  const url = new URL(`/uz${p === "/" ? "" : p}${req.nextUrl.search}`, req.url);
  const res = NextResponse.redirect(url, 307);
  res.headers.set("Vary", "Accept-Language, Cookie");        // корректное кэширование
  return res;
}

export default function middleware(req: NextRequest) {
  // Снятые с продажи товары (см. removedProducts.ts): старые URL в индексе Google отдавали 404.
  // 308 на страницу бренда — очищает индекс, возвращает вес, убирает тупик для пользователя.
  const m = req.nextUrl.pathname.match(REMOVED_RE);
  if (m) {
    const slug = decodeURIComponent(m[2]);
    const target = REMOVED_PRODUCT_REDIRECTS[slug];
    if (target) {
      const prefix = m[1] ? `/${m[1]}` : "";
      // значение с «/» — готовый путь (дубли → карточка-оригинал), иначе — бренд-слаг → /catalog/<brand>
      const dest = target.startsWith("/") ? target : `/catalog/${target}`;
      return NextResponse.redirect(new URL(`${prefix}${dest}`, req.url), 308);
    }
  }
  const sm = req.nextUrl.pathname.match(SVC_RE);
  if (sm) {
    const dest = REMOVED_SERVICE_REDIRECTS[decodeURIComponent(sm[2])];
    if (dest) {
      const prefix = sm[1] ? `/${sm[1]}` : "";
      return NextResponse.redirect(new URL(`${prefix}/solutions/${dest}`, req.url), 308);
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
  const uz = uzAutoRedirect(req);
  if (uz) return uz;
  return intlMiddleware(req);
}

export const config = {
  // Применяем ко всем путям, кроме api, статики, файлов с расширением и служебных
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
