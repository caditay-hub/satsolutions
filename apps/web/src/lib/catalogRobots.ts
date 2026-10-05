import type { Metadata } from "next";

type SP = Record<string, string | string[] | undefined> | undefined;

const has = (sp: SP, k: string) => {
  const v = sp?.[k];
  return typeof v === "string" ? v.length > 0 : Array.isArray(v) ? v.length > 0 : false;
};

/** Активны ли фасет-фильтры (характеристики/цена/бренд/сортировка/страница>1). */
export function catalogFiltersActive(sp: SP): boolean {
  return (
    // строка поиска: результаты плавают вместе с каталогом, в индексе им не место
    has(sp, "search") ||
    has(sp, "q") ||
    has(sp, "type") ||
    has(sp, "chars") ||
    has(sp, "priceMin") ||
    has(sp, "priceMax") ||
    has(sp, "brand") ||
    has(sp, "sort") ||
    // 05.10.2026: те же фильтры, что закрыты в robots.txt, — иначе на типе/группе/бренде/паре
    // они отдавали индекс (canonical на чистую страницу), а на /products — noindex
    has(sp, "category") ||
    has(sp, "perPage") ||
    has(sp, "view") ||
    has(sp, "mp") ||
    has(sp, "technology") ||
    has(sp, "installationType") ||
    (has(sp, "page") && sp?.page !== "1")
  );
}

/**
 * Best-practice фасетной навигации: индексируем только базовые категории/группы/бренды,
 * а фасет-комбинации — noindex, follow (чтобы не плодить дубли в индексе, но краулить ссылки).
 */
export function catalogRobots(sp: SP): Metadata["robots"] | undefined {
  return catalogFiltersActive(sp) ? { index: false, follow: true } : undefined;
}
