import type { ProductDto } from "@/lib/api";

// Карточка/строка — клиентские компоненты: весь ProductDto сериализуется в RSC-поток.
// Карточке (сетка) нужны id/slug/name/price/cover/modelCode/recommended — тяжёлые поля
// (description ~сотни символов, галерея, seo) вырезаем ДО передачи → RSC-поток ~×5 легче,
// быстрее FCP на мобильном. Списку оставляем characteristics (чипы-спеки).
export function slimProduct(p: ProductDto, keepChars: boolean): ProductDto {
  // Явный набор полей (не spread) — иначе description/gallery/createdAt протаскиваются в RSC.
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    isUsd: p.isUsd,
    recommended: p.recommended,
    modelCode: p.modelCode ?? null,
    coverImageUrl: p.coverImageUrl,
    // бейдж «В наличии / Под заказ» в карточке и строке: без поля все 31 товар «под заказ»
    // показывались в каталоге как «В наличии» (найдено 05.10.2026)
    inStock: p.inStock,
    characteristics: keepChars ? p.characteristics : null, // строке нужны чипы-спеки
    // обязательные по типу, но карточке не нужны — облегчаем
    shortDescription: null,
    description: null,
    published: true,
    categoryId: null,
    createdAt: p.createdAt, // нужен бейджу «Новинка» в карточках
    updatedAt: "",
  };
}
