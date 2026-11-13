import { NextResponse, type NextRequest } from "next/server";
import { getBrands, getProducts } from "@/lib/api";
import { slimProduct } from "@/lib/catalogSlim";
import { localizeProductName } from "@/lib/productI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { routing } from "@/i18n/routing";

// Подгрузка товаров каталога при прокрутке (07.10.2026). Страница раздела отдаёт первые
// 60 товаров, следующие порции браузер берёт отсюда. Названия переводим здесь, на сервере:
// словарь переводов товаров весит мегабайты и в браузер ехать не должен. Поля карточки —
// те же, что у серверного рендера (slimProduct).
// 13.11.2026: + «Новинки» (days, hasPrice; brands=1 — имя бренда для их карточек) и голый
// каталог /products, у которого порция 120.
const FILTER_KEYS = ["category", "brand", "q", "sort", "mp", "technology", "installationType", "type", "chars", "priceMin", "priceMax", "days", "hasPrice"] as const;
const MAX_LIMIT = 120;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const page = Math.min(100, Math.max(1, Number(sp.get("page")) || 1));
  const limit = Math.min(MAX_LIMIT, Math.max(1, Number(sp.get("limit")) || MAX_LIMIT));
  const locale = (routing.locales as readonly string[]).includes(sp.get("locale") || "") ? (sp.get("locale") as string) : routing.defaultLocale;
  const list = sp.get("view") === "list";

  const opts: Record<string, unknown> = {};
  for (const k of FILTER_KEYS) {
    const v = sp.get(k);
    if (!v) continue;
    if (k === "chars") {
      try {
        const c = JSON.parse(v);
        if (c && typeof c === "object") opts.chars = c;
      } catch { /* битый фильтр — без него */ }
    } else if (k === "priceMin" || k === "priceMax" || k === "days") {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) opts[k] = n;
    } else if (k === "hasPrice") {
      if (v === "1" || v === "true") opts.hasPrice = true;
    } else {
      opts[k] = v.slice(0, 300);
    }
  }

  try {
    const r = await getProducts(page, limit, opts as any);
    let brandName: ((id: string | null | undefined) => string | null) | null = null;
    if (sp.get("brands") === "1") {
      const { brands } = await getBrands().catch(() => ({ brands: [] as any[] }));
      const byId = new Map(brands.map((b: any) => [b.id, localizeBrandName(b.slug, b.name, locale)]));
      brandName = (id) => (id && byId.get(id)) || null;
    }
    const items = r.items.map((p) => ({
      p: slimProduct(p, list),
      name: localizeProductName(p, locale),
      ...(brandName ? { brandName: brandName(p.brandId) } : {}),
    }));
    return NextResponse.json(
      { items, total: r.total, page },
      { headers: { "Cache-Control": "public, max-age=60", "X-Robots-Tag": "noindex" } }
    );
  } catch {
    return NextResponse.json({ items: [], total: 0, page, error: "upstream" }, { status: 502, headers: { "X-Robots-Tag": "noindex" } });
  }
}
