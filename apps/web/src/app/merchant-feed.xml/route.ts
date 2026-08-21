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

  // Политики Google Shopping: детекторы скрытых камер/жучков считаются
  // «hacking» (answer/6150005) — товар легален на сайте, но в фид нельзя,
  // иначе копятся policy-отклонения на аккаунт.
  const POLICY_BANNED = new Set(["pro-k68-detektor-skrytyh-kamer-i-zhuchkov"]);

  // Товары «под заказ» (inStock=false) уходят как backorder, а для него Google требует
  // дату ожидаемого поступления — без неё позиция отклоняется целиком (22 отклонения
  // в Merchant Center на 21.08.2026, вся адресная пожарка Dahua). Типовой срок поставки
  // проектного оборудования под заказ — около месяца; фид пересобирается раз в час,
  // поэтому дата не устаревает. Таймзона Ташкента.
  const BACKORDER_DAYS = 30;
  const availabilityDate = (() => {
    const d = new Date(Date.now() + BACKORDER_DAYS * 86_400_000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T00:00:00+05:00`;
  })();

  const items = products
    .filter((p) => p.published && Number(p.price) > 0 && p.coverImageUrl && !POLICY_BANNED.has(p.slug))
    .map((p) => {
      const price = Math.round(Number(p.price));
      const brand = p.brandId ? brandById.get(p.brandId) : null;
      const image = resolveImageUrl(p.coverImageUrl)!;
      // Полное описание первым — MC ранжирует лучше при развёрнутом тексте («добавьте информацию»)
      const desc = plain(p.description) || plain(p.shortDescription) || p.name;
      // GTIN у товаров нет; MPN отдаём только «настоящий» артикул: один латинский токен ≤50
      // (описательные коды с пробелами/кириллицей Google бракует) — иначе honest identifier_exists=no
      const mpnOk = p.modelCode && /^[A-Za-z0-9][A-Za-z0-9\-_.+/]{0,49}$/.test(p.modelCode.trim());
      const ident = brand && mpnOk
        ? `<g:brand>${esc(brand)}</g:brand><g:mpn>${esc(p.modelCode!.trim())}</g:mpn>`
        : `${brand ? `<g:brand>${esc(brand)}</g:brand>` : ""}<g:identifier_exists>no</g:identifier_exists>`;
      // custom_label_0: Shopping-кампания исключает мелочь — меньше микро-заказов.
      // Порог 200 тыс (был 1 млн): анализ 18.08 показал, что зона 200 тыс–1 млн
      // давала ~64 заявки/мес по $0.23–0.33 (камеры V380/Tapo, роутеры, инструмент) —
      // её вернули; ниже 200 тыс — удлинители/фонарики, микро-заказы, остаются вне кампании.
      const label = price < 200_000 ? "lowprice" : "core";
      return `<item>
<g:id>${esc(p.slug)}</g:id>
<g:custom_label_0>${label}</g:custom_label_0>
<g:title>${esc(p.name.slice(0, 150))}</g:title>
<g:description>${esc(desc)}</g:description>
<g:link>${SITE}/products/${esc(p.slug)}</g:link>
<g:image_link>${esc(image)}</g:image_link>
${p.inStock === false ? `<g:availability>backorder</g:availability>
<g:availability_date>${availabilityDate}</g:availability_date>` : "<g:availability>in_stock</g:availability>"}
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
