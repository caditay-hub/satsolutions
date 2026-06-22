export type CategoryDto = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  coverImageUrl: string | null;
  brandId?: string | null;
};

export type PortfolioCategoryDto = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  coverImageUrl: string | null;
};

export type ServiceCategoryDto = {
  id: string;
  name: string;
  slug: string;
  title: string | null;
  description1: string | null;
  description2: string | null;
  imageUrl: string | null;
  sortOrder: number;
};

export type BrandDto = {
  id: string;
  name: string;
  slug: string;
  logoImageUrl: string | null;
  sortOrder: number;
  published: boolean;
};

export type PartnerDto = {
  id: string;
  name: string;
  websiteUrl: string | null;
  logoImageUrl: string | null;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductDto = {
  id: string;
  name: string;
  slug: string;
  price: string;
  isUsd?: boolean;
  recommended?: boolean;
  modelCode?: string | null;
  shortDescription: string | null;
  description: string | null;
  characteristics: Record<string, string> | null;
  coverImageUrl: string | null;
  galleryImageUrls?: string[] | null;
  published: boolean;
  categoryId: string | null;
  brandId?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PostDto = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KeyTechnologyDto = {
  id: string;
  title: string;
  description: string | null;
  secondaryDescription?: string | null;
  imageUrl: string | null;
  secondaryImageUrl?: string | null;
  sortOrder: number;
};

export type ServiceDto = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  overviewImageUrl: string | null;
  parentId: string | null;
  serviceCategoryId: string | null;
  category?: ServiceCategoryDto | null;
  children?: ServiceDto[] | null;
  keyTechnologies?: KeyTechnologyDto[] | null;
  items: {
    title: string;
    imageUrl?: string | null; // Added
    cards?: {
      description?: string | null;
      subDescription?: string | null;
      descriptions?: { description?: string | null; subDescription?: string | null }[] | null;
    }[] | null;
    description?: string | null;
    subDescription?: string | null;
  }[] | null;
  sortOrder: number;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PortfolioDto = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  coverImageUrl: string | null;
  galleryImageUrls: string[] | null;
  items:
  | {
    title: string;
    description?: string | null;
    cards?:
    | {
      description?: string | null;
      subDescription?: string | null;
      descriptions?: { description?: string | null; subDescription?: string | null }[] | null;
    }[]
    | null;
  }[]
  | null;
  portfolioCategoryId?: string | null;
  clientName: string | null;
  clientlogourl: string | null;
  clientTasks: string | null;
  location: string | null;
  completedAt: string | null;
  sortOrder: number;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SitePageKey = "about" | "contact" | "site";

export type SitePageDto = {
  id: string;
  key: SitePageKey;
  title: string;
  content: string | null;
  coverImageUrl: string | null;
  data: any | null;
  createdAt: string;
  updatedAt: string;
};

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

async function apiFetch<T>(path: string, init?: RequestInit & { next?: { revalidate?: number } }): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      ...(init?.headers ?? {})
    }
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return (await res.json()) as T;
}

export async function getCategories(opts?: { brand?: string }) {
  const qs = opts?.brand ? `?brand=${encodeURIComponent(opts.brand)}` : "";
  return apiFetch<{ categories: CategoryDto[] }>(`/categories${qs}`, { next: { revalidate: 300 } });
}

export async function getPortfolioCategories() {
  return apiFetch<{ categories: PortfolioCategoryDto[] }>("/portfolio-categories", { next: { revalidate: 300 } });
}

export async function getServiceCategories() {
  return apiFetch<{ items: ServiceCategoryDto[] }>("/service-categories", { next: { revalidate: 300 } });
}

export async function getBrands() {
  return apiFetch<{ brands: BrandDto[] }>("/brands", { next: { revalidate: 300 } });
}

export async function getPartners() {
  return apiFetch<{ partners: PartnerDto[] }>("/partners", { next: { revalidate: 300 } });
}

export async function getProducts(
  page = 1,
  limit = 12,
  opts?: { category?: string; brand?: string; q?: string; sort?: string; recommended?: boolean; mp?: string; audio?: string; technology?: string; installationType?: string; type?: string; chars?: Record<string, string[]>; priceMin?: number; priceMax?: number }
) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (opts?.category) qs.set("category", opts.category);
  if (opts?.type) qs.set("type", opts.type);
  if (opts?.brand) qs.set("brand", opts.brand);
  if (opts?.q) qs.set("q", opts.q);
  if (opts?.sort) qs.set("sort", opts.sort);
  if (opts?.recommended) qs.set("recommended", "true");
  if (opts?.mp) qs.set("mp", opts.mp);
  if (opts?.audio) qs.set("audio", opts.audio);
  if (opts?.technology) qs.set("technology", opts.technology);
  if (opts?.installationType) qs.set("installationType", opts.installationType);
  if (opts?.chars && Object.keys(opts.chars).length) qs.set("chars", JSON.stringify(opts.chars));
  if (opts?.priceMin) qs.set("priceMin", String(opts.priceMin));
  if (opts?.priceMax) qs.set("priceMax", String(opts.priceMax));
  // no-store: список товаров имеет неограниченное число комбинаций фильтров/сортировки/страниц,
  // ISR-кэш этих запросов раздувал .next/cache/fetch-cache до десятков ГБ. Список всегда свежий.
  return apiFetch<{ items: ProductDto[]; total: number; page: number; limit: number }>(`/products?${qs}`, {
    cache: "no-store"
  });
}

export type ProductFacets = {
  brands: Array<{ slug: string; name: string; count: number }>;
  price: { min: number; max: number };
  chars: Array<{ key: string; values: Array<{ value: string; count: number }> }>;
};
export async function getProductFacets(type: string) {
  const qs = new URLSearchParams({ type });
  return apiFetch<ProductFacets>(`/product-facets?${qs}`, { next: { revalidate: 300 } });
}

export async function createServiceRequest(data: {
  serviceName: string;
  phone: string | null;
  description?: string;
}) {
  return apiFetch<{ success: boolean; message: string; request: any }>("/service-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export async function getServiceRequests(page = 1, limit = 20, status?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) qs.set("status", status);
  return apiFetch<{ items: any[]; total: number; page: number; limit: number }>(`/admin/service-requests?${qs}`);
}

export async function updateServiceRequestStatus(id: number, status: 'pending' | 'done') {
  return apiFetch<{ id: number; status: string; updatedAt: string }>(`/admin/service-requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });
}

export async function getProductBySlug(slug: string) {
  // no-store: страница товара должна показывать актуальные фото/цены/название сразу после правок (не кэш)
  return apiFetch<{ product: ProductDto }>(`/products/${encodeURIComponent(slug)}`, { cache: "no-store" });
}



export async function getServices(page = 1, limit = 12, opts?: { category?: string; topOnly?: boolean }) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (opts?.category) qs.set("category", opts.category);
  if (opts?.topOnly) qs.set("topOnly", "true");
  return apiFetch<{ items: ServiceDto[]; total: number; page: number; limit: number }>(`/services?${qs}`, {
    next: { revalidate: 60 }
  });
}

export async function getServiceBySlug(slug: string) {
  return apiFetch<{ item: ServiceDto }>(`/services/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
}

export async function getPortfolio(page = 1, limit = 12, opts?: { category?: string }) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  // category filter for portfolio is supported by API, but UI is optional
  if (opts?.category) qs.set("category", opts.category);
  return apiFetch<{ items: PortfolioDto[]; total: number; page: number; limit: number }>(`/portfolio?${qs}`, {
    next: { revalidate: 60 }
  });
}

export async function getPortfolioBySlug(slug: string) {
  return apiFetch<{ item: PortfolioDto }>(`/portfolio/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
}

export async function getSitePage(key: SitePageKey) {
  const isDev = process.env.NODE_ENV !== "production";
  return apiFetch<{ page: SitePageDto }>(`/site-pages/${encodeURIComponent(key)}`, isDev ? { cache: "no-store" } : { next: { revalidate: 300 } });
}


export type SmartSection = { name: string; slug: string; count: number };
export type SmartSearchDto = {
  mode: "direct" | "smart";
  explain?: string;
  sections?: SmartSection[];
  total: number;
  items: ProductDto[];
};
export async function getSmartSearch(q: string, limit = 60) {
  return apiFetch<SmartSearchDto>(`/search-smart?q=${encodeURIComponent(q)}&limit=${limit}`, { cache: "no-store" } as any);
}

export type ProductTypeDto = { name: string; count: number };
export async function getProductTypes(brand?: string) {
  const qs = brand ? `?brand=${encodeURIComponent(brand)}` : "";
  return apiFetch<{ types: ProductTypeDto[] }>(`/product-types${qs}`, { next: { revalidate: 300 } });
}

export type SuggestDto = {
  products: { name: string; slug: string; coverImageUrl: string | null; price: string; chars_text?: string; brand_name?: string | null }[];
  types: { name: string; count: number }[];
  brands: { name: string; slug: string }[];
};
export async function getSearchSuggest(q: string): Promise<SuggestDto> {
  const res = await fetch(`${apiBaseUrl()}/search-suggest?q=${encodeURIComponent(q)}`, { cache: "no-store" });
  if (!res.ok) return { products: [], types: [], brands: [] };
  return res.json();
}
