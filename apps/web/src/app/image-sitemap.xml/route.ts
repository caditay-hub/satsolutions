import { getProducts } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

// Image Sitemap: фото товаров для Google Картинок (страница товара + его cover-изображение).
// Пересобирается раз в сутки; в robots.ts объявлен рядом с основным sitemap.
export const revalidate = 86400;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const acc: import("@/lib/api").ProductDto[] = [];
  for (let page = 1; page <= 12; page++) {
    const { items, total } = await getProducts(page, 500).catch(() => ({ items: [], total: 0 }));
    acc.push(...items);
    if (acc.length >= (total || 0) || items.length === 0) break;
  }
  const entries = acc
    .filter((p) => p.published && p.coverImageUrl)
    .map((p) => {
      const img = resolveImageUrl(p.coverImageUrl);
      if (!img) return "";
      return `<url><loc>${siteUrl}/products/${esc(p.slug)}</loc><image:image><image:loc>${esc(img)}</image:loc><image:title>${esc(p.name)}</image:title></image:image></url>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${entries}</urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
