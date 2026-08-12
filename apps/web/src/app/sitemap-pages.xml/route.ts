import { pagesEntries, renderUrlset, xmlResponse } from "@/lib/sitemapData";

// Раздел карты сайта. Разбивка нужна для диагностики в Search Console:
// видно, какой тип страниц индексируется хуже остальных.
export const revalidate = 3600;

export async function GET() {
  return xmlResponse(renderUrlset(await pagesEntries()));
}
