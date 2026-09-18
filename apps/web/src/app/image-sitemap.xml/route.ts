import { getProductsCached } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { ARTICLES, articleImg } from "@/lib/articlesData";
import { UY } from "@/lib/appsUyContent";
import { DAVOMAT } from "@/lib/appsDavomatContent";

// Image Sitemap: фото товаров для Google Картинок (страница товара + его cover-изображение).
// Пересобирается раз в сутки; в robots.ts объявлен рядом с основным sitemap.
export const revalidate = 86400;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const acc: import("@/lib/api").ProductDto[] = [];
  for (let page = 1; page <= 12; page++) {
    const { items, total } = await getProductsCached(page, 500, undefined, 86400).catch(() => ({ items: [], total: 0 }));
    acc.push(...items);
    if (acc.length >= (total || 0) || items.length === 0) break;
  }
  // Страницы приложений и статьи: свои снимки экранов и фотографии — в Google Картинки
  const appShots: Array<[string, string[], string]> = [
    ["/apps", ["/apps-img/apps-hero.jpg", "/apps-img/shots/shot-doors.jpg", "/apps-img/shots/shot-now.jpg"], "SAT Solutions"],
    ["/apps/uy", ["/apps-img/uy-hero.jpg", "/apps-img/uy-guest.jpg", "/apps-img/uy-office.jpg", "/apps-img/uy-yard.jpg",
      "/apps-img/shots/shot-doors.jpg", "/apps-img/shots/shot-guest.jpg", "/apps-img/shots/shot-tickets.jpg",
      "/apps-img/shots/shot-bill.jpg"], UY.ru.h1.split(" — ")[0]],
    ["/apps/davomat", ["/apps-img/davomat-hero.jpg", "/apps-img/davomat-check.jpg", "/apps-img/davomat-report.jpg",
      "/apps-img/shots/shot-now.jpg", "/apps-img/shots/shot-timesheet.jpg", "/apps-img/shots/shot-late.jpg",
      "/apps-img/shots/shot-export.jpg"], DAVOMAT.ru.h1.split(" — ")[0]],
  ];
  const pageEntries = appShots
    .map(([path, imgs, title]) =>
      `<url><loc>${siteUrl}${path}</loc>${imgs
        .map((i) => `<image:image><image:loc>${siteUrl}${i}</image:loc><image:title>${esc(title)}</image:title></image:image>`)
        .join("")}</url>`)
    .join("");
  // Обложки статей блога
  const articleEntries = ARTICLES.filter((a) => a.loc.ru)
    .map((a) => `<url><loc>${siteUrl}/blog/${esc(a.slug)}</loc><image:image><image:loc>${siteUrl}${articleImg(a.slug)}</image:loc><image:title>${esc(a.loc.ru.title)}</image:title></image:image></url>`)
    .join("");

  const entries = acc
    .filter((p) => p.published && p.coverImageUrl)
    .map((p) => {
      const img = resolveImageUrl(p.coverImageUrl);
      if (!img) return "";
      return `<url><loc>${siteUrl}/products/${esc(p.slug)}</loc><image:image><image:loc>${esc(img)}</image:loc><image:title>${esc(p.name)}</image:title></image:image></url>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${pageEntries}${articleEntries}${entries}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
