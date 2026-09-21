import type { MetadataRoute } from "next";

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
const FACET_PARAMS = [
  "category",
  "brand",
  "type",
  "chars",
  "priceMin",
  "priceMax",
  "sort",
  "page",
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
