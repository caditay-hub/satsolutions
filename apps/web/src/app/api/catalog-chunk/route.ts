import { NextResponse, type NextRequest } from "next/server";
import { getProducts } from "@/lib/api";
import { slimProduct } from "@/lib/catalogSlim";
import { localizeProductName } from "@/lib/productI18n";
import { routing } from "@/i18n/routing";

// Подгрузка товаров каталога при прокрутке (07.10.2026). Страница раздела отдаёт первые
// 60 товаров, следующие порции браузер берёт отсюда. Названия переводим здесь, на сервере:
// словарь переводов товаров весит мегабайты и в браузер ехать не должен. Поля карточки —
// те же, что у серверного рендера (slimProduct).
const FILTER_KEYS = ["category", "brand", "q", "sort", "mp", "technology", "installationType", "type", "chars", "priceMin", "priceMax"] as const;
const MAX_LIMIT = 60;

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
    } else if (k === "priceMin" || k === "priceMax") {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) opts[k] = n;
    } else {
      opts[k] = v.slice(0, 300);
    }
  }

  try {
    const r = await getProducts(page, limit, opts as any);
    const items = r.items.map((p) => ({ p: slimProduct(p, list), name: localizeProductName(p, locale) }));
    return NextResponse.json(
      { items, total: r.total, page },
      { headers: { "Cache-Control": "public, max-age=60", "X-Robots-Tag": "noindex" } }
    );
  } catch {
    return NextResponse.json({ items: [], total: 0, page, error: "upstream" }, { status: 502, headers: { "X-Robots-Tag": "noindex" } });
  }
}
