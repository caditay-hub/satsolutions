import { GENERATED, SITE_URL, xmlResponse } from "@/lib/sitemapData";

// Индекс карт сайта. Адрес /sitemap.xml сохранён (он зарегистрирован в Google Search
// Console и Яндекс.Вебмастере), но теперь это sitemapindex: разделы лежат отдельно,
// и в отчётах видно статистику индексации по каждому типу страниц.
export const revalidate = 3600;

const SECTIONS = [
  "sitemap-pages.xml",
  "sitemap-catalog.xml",
  "sitemap-products.xml",
  "sitemap-content.xml",
  "image-sitemap.xml",
];

export async function GET() {
  const lastmod = GENERATED.toISOString();
  const body = SECTIONS.map(
    (s) => `<sitemap><loc>${SITE_URL}/${s}</loc><lastmod>${lastmod}</lastmod></sitemap>`
  ).join("\n");
  return xmlResponse(
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`
  );
}
