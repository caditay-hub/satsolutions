import type { MetadataRoute } from "next";

// ⚠️ На боевом домене этот роут НЕ отдаётся: nginx перехватывает /robots.txt и
// отдаёт статикой /var/www/satweb-static/robots.txt (чтобы файл жил даже при
// рестарте Next — 502 на robots.txt во время деплоя заставлял Google помечать
// всю очередь обхода как 5xx). Меняя правила здесь, поменяйте и тот файл.

// Параметры фасетного фильтра каталога. Страницы с ними и так отдают noindex,follow
// (lib/catalogRobots.ts), но Googlebot всё равно перебирает сочетания: в отчёте
// «Индексирование страниц» на 21.09.2026 из 20,9 тыс. непроиндексированных
// 8 353 — «запрещено тегом noindex» и 7 983 — «вариант с canonical», и это почти
// целиком /products?category=…&brand=…&type=…&page=N. Полезного трафика они не
// дают никогда, поэтому закрываем их от ОБХОДА — краулинговый бюджет уходит на
// карточки, разделы каталога и блог.
//
// Правило пишем на сам параметр (а не на /products?), чтобы накрыть и фасеты
// на страницах бренда/типа/группы во всех пяти локалях.
//
// 07.10.2026 убраны "type" и "page". page: пагинация разделов (/products/type/x?page=2,
// /catalog/<бренд>?page=2) — единственный путь робота к товарам дальше первых 60 в разделе;
// эти страницы сами отдают noindex,follow. type: старые /products?type=<имя> отдают 308 на
// /products/type/<slug>, а под Disallow Google редиректа не видел и держал 300+ таких адресов
// в «404»/«переадресации» и «проиндексировано, несмотря на блокировку». Сочетания с
// category/brand/chars и т.д. по-прежнему закрыты правилами этих параметров.
const FACET_PARAMS = [
  "category",
  "brand",
  "chars",
  "priceMin",
  "priceMax",
  "sort",
  "perPage",
  "view",
  "mp",
  "technology",
  "installationType",
  "q",
  "search",
];

const facetRules = FACET_PARAMS.flatMap((p) => [`/*?${p}=`, `/*&${p}=`]);

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", ...facetRules]
      }
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/image-sitemap.xml`]
  };
}
