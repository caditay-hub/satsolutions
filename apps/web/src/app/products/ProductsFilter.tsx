import Link from "next/link";
import type { BrandDto, CategoryDto, ProductDto } from "@/lib/api";

type ProductsFilterProps = {
  categories: CategoryDto[];
  brands: BrandDto[];
  products: ProductDto[];
  activeCategory: CategoryDto | null;
  initial: {
    q?: string;
    category?: string;
    brand?: string;
    sort?: string;
    mp?: string;
    technology?: string;
    installationType?: string;
  };
};

export function ProductsFilter({ categories, brands, products: _products, activeCategory, initial }: ProductsFilterProps) {
  const hasActiveFilters = !!(initial.q || initial.category || initial.brand || initial.sort || initial.mp || initial.technology || initial.installationType);

  // Check if the active category is IP KAMERA or its subcategory
  // Check both the category itself and its parent category
  const isIpCategoryOrSubcategory = (cat: CategoryDto | null): boolean => {
    if (!cat) return false;

    const nameOrSlug = (cat.name?.toLowerCase() || '') + ' ' + (cat.slug?.toLowerCase() || '');

    // Check if this category is related to IP cameras
    // Include common IP camera types
    const ipCameraKeywords = [
      'ip',
      'купольные', 'купольная', // dome cameras
      'цилиндрические', 'цилиндрическая', 'bullet', // bullet cameras  
      'ptz', 'поворотные', // pan-tilt-zoom cameras
      'fisheye', 'панорамные', // fisheye cameras
      'ip-камера', 'ip камера'
    ];

    const hasIpKeyword = ipCameraKeywords.some(keyword => nameOrSlug.includes(keyword));
    if (hasIpKeyword) return true;

    // Check parent category if this is a subcategory
    if (cat.parentId) {
      const parentCat = categories.find(c => c.id === cat.parentId);
      if (parentCat) {
        const parentNameOrSlug = (parentCat.name?.toLowerCase() || '') + ' ' + (parentCat.slug?.toLowerCase() || '');
        return ipCameraKeywords.some(keyword => parentNameOrSlug.includes(keyword));
      }
    }

    return false;
  };

  const isIpCameraCategory = isIpCategoryOrSubcategory(activeCategory);

  // Debug logging (will appear in browser console during development)
  if (typeof window !== 'undefined') {
    // Find parent category for debugging
    const parentCat = activeCategory?.parentId
      ? categories.find(c => c.id === activeCategory.parentId)
      : null;

    console.log('ProductsFilter Debug:', {
      activeCategory: activeCategory?.name,
      slug: activeCategory?.slug,
      parentId: activeCategory?.parentId,
      parentCategory: parentCat?.name,
      parentSlug: parentCat?.slug,
      isIpCameraCategory,
      productsCount: _products.length
    });

    // Log all categories for debugging
    console.log('All categories:', categories.map(c => ({
      name: c.name,
      slug: c.slug,
      parentId: c.parentId,
      hasIp: c.name?.toLowerCase().includes('ip') || c.slug?.toLowerCase().includes('ip')
    })));
  }

  // Extract MP options from products
  const mpOptions = Array.from(
    _products.reduce((map, p) => {
      if (!p.characteristics) return map;

      // Try both with and without leading space
      const raw =
        (p.characteristics as Record<string, string>)?.[" Мегапиксели"] ??
        (p.characteristics as Record<string, string>)?.[" Мегапикселы"] ??
        (p.characteristics as Record<string, string>)?.["Мегапиксели"] ??
        (p.characteristics as Record<string, string>)?.["Мегапикселы"] ??
        null;
      if (!raw) return map;
      const match = String(raw).match(/(\d+(?:[.,]\d+)?)/);
      if (!match) return map;
      const value = match[1].replace(",", ".");
      if (!map.has(value)) {
        map.set(value, { value, label: String(raw) });
      }
      return map;
    }, new Map<string, { value: string; label: string }>())
      .values()
  ).sort((a, b) => parseFloat(a.value) - parseFloat(b.value));

  // Extract Technology options from products (for IP cameras)
  const technologyOptions = isIpCameraCategory ? Array.from(
    _products.reduce((map, p) => {
      if (!p.characteristics) return map;

      // Try both with and without leading space
      const raw =
        (p.characteristics as Record<string, string>)?.[" Технология"] ??
        (p.characteristics as Record<string, string>)?.[" технология"] ??
        (p.characteristics as Record<string, string>)?.["Технология"] ??
        (p.characteristics as Record<string, string>)?.["технология"] ??
        null;
      if (!raw) return map;
      const value = String(raw).trim();
      if (value && !map.has(value)) {
        map.set(value, { value, label: value });
      }
      return map;
    }, new Map<string, { value: string; label: string }>())
      .values()
  ) : [];

  // Extract Installation Type options from products (for IP cameras)
  const installationTypeOptions = isIpCameraCategory ? Array.from(
    _products.reduce((map, p) => {
      if (!p.characteristics) return map;

      // Try both with and without leading space
      const raw =
        (p.characteristics as Record<string, string>)?.[" Тип установки"] ??
        (p.characteristics as Record<string, string>)?.[" тип установки"] ??
        (p.characteristics as Record<string, string>)?.["Тип установки"] ??
        (p.characteristics as Record<string, string>)?.["тип установки"] ??
        null;
      if (!raw) return map;
      const value = String(raw).trim();
      if (value && !map.has(value)) {
        map.set(value, { value, label: value });
      }
      return map;
    }, new Map<string, { value: string; label: string }>())
      .values()
  ) : [];

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="text-sm font-semibold text-slate-900">Фильтр товаров</div>
        {hasActiveFilters ? (
          <Link href="/products" className="text-sm font-semibold text-brand-700 hover:underline">
            Сбросить фильтры
          </Link>
        ) : null}
      </div>

      <div className="border-t border-slate-200 px-5 py-5">
        <form method="get" action="/products" className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-q">
              Поиск
            </label>
            <input
              id="products-q"
              name="q"
              defaultValue={initial.q ?? ""}
              placeholder="Название или описание"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-category">
              Категория
            </label>
            <select
              id="products-category"
              name="category"
              defaultValue={initial.category ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">Все категории</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-brand">
              Бренд
            </label>
            <select
              id="products-brand"
              name="brand"
              defaultValue={initial.brand ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">Все бренды</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-sort">
              Сортировка
            </label>
            <select
              id="products-sort"
              name="sort"
              defaultValue={initial.sort ?? ""}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
            >
              <option value="">По умолчанию</option>
              <option value="price_asc">По цене (сначала дешевле)</option>
              <option value="price_desc">По цене (сначала дороже)</option>
              <option value="name_asc">По названию (А-Я)</option>
              <option value="name_desc">По названию (Я-А)</option>
            </select>
          </div>

          {isIpCameraCategory && mpOptions.length > 0 ? (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-mp">
                Мегапиксели
              </label>
              <select
                id="products-mp"
                name="mp"
                defaultValue={initial.mp ?? ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Все</option>
                {mpOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {isIpCameraCategory && technologyOptions.length > 0 ? (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-technology">
                Технология
              </label>
              <select
                id="products-technology"
                name="technology"
                defaultValue={initial.technology ?? ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Все</option>
                {technologyOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          {isIpCameraCategory && installationTypeOptions.length > 0 ? (
            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500" htmlFor="products-installation-type">
                Тип установки
              </label>
              <select
                id="products-installation-type"
                name="installationType"
                defaultValue={initial.installationType ?? ""}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white"
              >
                <option value="">Все</option>
                {installationTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-3">
            <button
              type="submit"
              className="btn-primary"
            >
              Применить фильтр
            </button>
            {hasActiveFilters ? (
              <Link
                href="/products"
                className="btn-secondary"
              >
                Сбросить
              </Link>
            ) : null}
            {activeCategory ? (
              <div className="ml-auto text-xs text-slate-600">
                Текущая категория: <span className="font-semibold text-slate-900">{activeCategory.name}</span>
              </div>
            ) : null}
          </div>
        </form>
      </div>
    </div>
  );
}

