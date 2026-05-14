export type LoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: { id: string; email: string; role: string };
};

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
  shortDescription: string | null;
  description: string | null;
  characteristics: Record<string, string> | null;
  coverImageUrl: string | null;
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
  items: { title: string; description: string | null; cards?: any[]; imageUrl?: string | null }[] | null;
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

const TOKEN_KEY = "sat_admin_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  window.localStorage.removeItem(TOKEN_KEY);
}

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;
  const res = await fetch(`${apiBaseUrl()}${path}`, {
    ...init,
    headers: {
      "content-type": "application/json",
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let details = text;
    try {
      const j = JSON.parse(text) as any;
      if (j?.error) details = j.error;
    } catch {
      // ignore
    }
    throw new Error(`API error: ${res.status}${details ? ` (${details})` : ""}`);
  }

  // Some endpoints (DELETE) return 204 No Content.
  if (res.status === 204) return undefined as T;

  const text = await res.text().catch(() => "");
  if (!text) return undefined as T;

  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    return JSON.parse(text) as T;
  }
  // Fallback for non-JSON responses (should be rare)
  return text as unknown as T;
}

export async function getServiceRequests(page = 1, limit = 20, status?: string) {
  const qs = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status) qs.set("status", status);
  return apiFetch<{ items: any[]; total: number; page: number; limit: number }>(`/admin/service-requests?${qs}`);
}

export async function updateServiceRequestStatus(id: number, status: 'pending' | 'done', statusReason?: string | null) {
  return apiFetch<{ id: number; status: string; updatedAt: string }>(`/admin/service-requests/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, statusReason }),
  });
}

