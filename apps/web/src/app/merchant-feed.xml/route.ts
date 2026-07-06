import { getBrands, getProducts } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

// Товарный фид Google Merchant Center (RSS 2.0, g:-namespace).
// Только published с ценой и фото; цены на сайте в сумах → UZS.
// Обновляется раз в час — Merchant забирает фид по расписанию, свежее не нужно.
export const revalidate = 3600;

const SITE = "https://satsolutions.uz";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Описание: план текста без HTML, лимит Merchant 5000 симв.
const plain = (s: string | null | undefined) =>
  (s ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim().slice(0, 4900);

export async function GET() {
  const [products, { brands }] = await Promise.all([
    (async () => {
      const acc: any[] = [];
      for (let page = 1; page <= 20; page++) {
        const { items, total } = await getProducts(page, 500).catch(() => ({ items: [], total: 0 }));
        acc.push(...items);
        if (acc.length >= (total || 0) || items.length === 0) break;
      }
      return acc;
    })(),
    getBrands().catch(() => ({ brands: [] as { id: string; name: string }[] })),
  ]);

  const brandById = new Map(brands.map((b: any) => [b.id, b.name]));

  const items = products
    .filter((p) => p.published && Number(p.price) > 0 && p.coverImageUrl)
    .map((p) => {
      const price = Math.round(Number(p.price));
      const brand = p.brandId ? brandById.get(p.brandId) : null;
      const image = resolveImageUrl(p.coverImageUrl)!;
      const desc = plain(p.shortDescription) || plain(p.description) || p.name;
      // GTIN у товаров нет; при бренде+артикуле отдаём MPN, иначе honest identifier_exists=no
      const ident = brand && p.modelCode
        ? `<g:brand>${esc(brand)}</g:brand><g:mpn>${esc(p.modelCode)}</g:mpn>`
        : `${brand ? `<g:brand>${esc(brand)}</g:brand>` : ""}<g:identifier_exists>no</g:identifier_exists>`;
      return `<item>
<g:id>${esc(p.slug)}</g:id>
<g:title>${esc(p.name.slice(0, 150))}</g:title>
<g:description>${esc(desc)}</g:description>
<g:link>${SITE}/products/${esc(p.slug)}</g:link>
<g:image_link>${esc(image)}</g:image_link>
<g:availability>in_stock</g:availability>
<g:condition>new</g:condition>
<g:price>${price} UZS</g:price>
${ident}
</item>`;
    });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
<title>SAT Solutions — системы безопасности</title>
<link>${SITE}</link>
<description>Каталог SAT Solutions: видеонаблюдение, СКУД, пожарная сигнализация</description>
${items.join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
