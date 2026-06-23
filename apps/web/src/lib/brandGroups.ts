import type { BrandDto } from "./api";

// Бренды с небольшим числом товаров (1..SMALL_BRAND_MAX) не засоряют сетку каталога
// отдельными карточками — они сворачиваются в одну карточку «Другие бренды»
// (страница /catalog/other), где видно, что внутри.
export const SMALL_BRAND_MAX = 20;

// Slug агрегирующей карточки/страницы. Не должен совпадать с реальным брендом.
// (Статический сегмент /catalog/other имеет приоритет над динамическим /catalog/[brand].)
export const OTHER_BRANDS_SLUG = "other";

export const OTHER_BRANDS_NAME = "Другие бренды";
export const OTHER_BRANDS_DESCRIPTION =
  "Производители с небольшим ассортиментом, собранные в одном разделе: сетевое и телеком-оборудование, ИБП, IP-телефония и оптический доступ.";

export type SplitBrands = { main: BrandDto[]; small: BrandDto[] };

// Делит бренды на «крупные» (показываются отдельной карточкой) и «мелкие»
// (1..SMALL_BRAND_MAX товаров — сворачиваются в «Другие бренды»).
// Порядок внутри сохраняется как пришёл из API (по sortOrder, затем name).
export function splitBrands(brands: BrandDto[]): SplitBrands {
  const published = brands.filter((b) => b.published !== false);
  const main: BrandDto[] = [];
  const small: BrandDto[] = [];
  for (const b of published) {
    const cnt = b.productCount ?? 0;
    if (cnt >= 1 && cnt <= SMALL_BRAND_MAX) small.push(b);
    else main.push(b);
  }
  // Мелкие бренды — по убыванию числа товаров (полнее ассортимент выше).
  small.sort((a, b) => (b.productCount ?? 0) - (a.productCount ?? 0) || a.name.localeCompare(b.name, "ru"));
  return { main, small };
}
