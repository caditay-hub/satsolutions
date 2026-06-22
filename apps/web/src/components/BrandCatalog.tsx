"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import { resolveImageUrl } from "@/lib/image";
import type { CategoryDto } from "@/lib/api";
import { CategoryThumb } from "@/components/CategoryThumb";
import { ProductCard } from "@/components/Cards";
import { BackButton } from "@/components/BackButton";
import type { ProductDto } from "@/lib/api";

interface Props {
  topCategories: CategoryDto[];
  allCategories: CategoryDto[];
  brandName: string;
  brandDescription?: string;
  brandSlug: string;
  logoUrl?: string | null;
  initialCategoryId?: string | null;
  brandCoverByCategory?: Record<string, string>;
  initialProducts?: ProductDto[];
}

// ─── icons ────────────────────────────────────────────────────────────────────
function IconChevronRight() {
  return (
    <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
function IconExternalLink({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
function IconGear({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function IconClipboard({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
}
function IconGrid({ className = "" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

// ─── main component ──────────────────────────────────────────────────────────
export function BrandCatalog({ topCategories, allCategories, brandName, brandDescription, brandSlug, logoUrl, initialCategoryId, initialProducts }: Props) {
  // Default to "Все товары" (__all__) when no ?cat= in URL
  const ALL_ID = "__all__";
  // We ALWAYS render the full, grouped catalog (every category). Selection never collapses
  // to a single category — it only scrolls to / expands a section. So activeId is fixed.
  const activeId = ALL_ID;
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const rightRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlCatSlug = searchParams.get("cat");
  const scrolledForRef = useRef<string | null>(null);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // "Все товары" pseudo-category — always shown first in sidebar
  const ALL_CAT: CategoryDto = {
    id: ALL_ID,
    name: "Все товары",
    slug: "",
    parentId: null,
    coverImageUrl: null,
    createdAt: "",
    updatedAt: "",
  } as unknown as CategoryDto;
  const sidebarCategories: CategoryDto[] = [ALL_CAT, ...topCategories];

  // Map a (possibly deep) category to its top-level ancestor, and its position in the left menu.
  const catById = new Map(allCategories.map((c) => [c.id, c]));
  function topAncestorId(catId: string | null | undefined): string | null {
    let c = catId ? catById.get(catId) : undefined;
    let guard = 0;
    while (c && c.parentId && guard++ < 12) c = catById.get(c.parentId);
    return c?.id ?? null;
  }
  function topOrderIndex(catId: string): number {
    const tid = topAncestorId(catId);
    const i = topCategories.findIndex((t) => t.id === tid);
    return i === -1 ? 9999 : i;
  }

  // Load the full brand catalog once — rendered grouped by category, never per-category.
  const [leafProducts, setLeafProducts] = useState<ProductDto[]>(initialProducts ?? []);
  const [leafLoading, setLeafLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(48); // used only by the flat fallback (single-category brands)
  const PREVIEW_PER_GROUP = 12; // each category shows a preview, then "Показать все" expands it inline
  useEffect(() => {
    let cancelled = false;
    setLeafLoading(true);
    fetch(`https://api.satsolutions.uz/products?brand=${brandSlug}&limit=1000`)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setLeafProducts(d.items ?? []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLeafLoading(false); });
    return () => { cancelled = true; };
  }, [brandSlug]);

  // Persist expand / "show more" state per URL so a back-navigation restores the
  // same section heights — otherwise the page is shorter on return and the scroll
  // position (restored by <ScrollManager/>) lands in the wrong place.
  const stateHydrated = useRef(false);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("catalogstate:" + window.location.pathname + window.location.search);
      if (raw) {
        const s = JSON.parse(raw);
        if (Array.isArray(s.expanded)) setExpanded(new Set<string>(s.expanded));
        if (typeof s.visibleCount === "number" && s.visibleCount > 48) setVisibleCount(s.visibleCount);
      }
    } catch {}
    stateHydrated.current = true;
  }, []);
  useEffect(() => {
    if (!stateHydrated.current) return;
    try {
      sessionStorage.setItem(
        "catalogstate:" + window.location.pathname + window.location.search,
        JSON.stringify({ expanded: [...expanded], visibleCount })
      );
    } catch {}
  }, [expanded, visibleCount]);

  // Sidebar click: just scroll to the category's section — all categories stay rendered.
  function selectCategory(cat: CategoryDto) {
    if (cat.id === ALL_ID) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      router.push(`/catalog/${brandSlug}`, { scroll: false });
      return;
    }
    // Sidebar items are top-level categories; sections are leaf categories — jump to the
    // first leaf section whose top ancestor is the clicked category.
    const firstGroup = groupedProducts.find((g) => topAncestorId(g.cat.id) === cat.id);
    const targetSlug = firstGroup?.cat.slug ?? cat.slug;
    const el = document.getElementById(`cat-${targetSlug}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setVisibleCatId(firstGroup?.cat.id ?? cat.id);
    }
  }

  const active: CategoryDto | null = ALL_CAT;

  // Group products by category — always (for both "All" mode and individual category with subcategories)
  const groupedProducts = (() => {
    const groups = new Map<string, { cat: CategoryDto; items: ProductDto[] }>();
    for (const p of leafProducts) {
      const cid = p.categoryId ?? "";
      const cat = allCategories.find((c) => c.id === cid);
      if (!cat) continue;
      if (!groups.has(cid)) groups.set(cid, { cat, items: [] });
      groups.get(cid)!.items.push(p);
    }
    return Array.from(groups.values())
      // products inside each section: recommended (popular) first
      .map((g) => ({
        ...g,
        items: [...g.items].sort((a, b) => Number(!!b.recommended) - Number(!!a.recommended)),
      }))
      .sort((a, b) => {
        // 1) follow the left-menu (top-category) order — which is by popularity (product count)
        const ta = topOrderIndex(a.cat.id);
        const tb = topOrderIndex(b.cat.id);
        if (ta !== tb) return ta - tb;
        // 2) within the same top category — bigger (more popular) sections first, then by name
        const d = b.items.length - a.items.length;
        return d !== 0 ? d : a.cat.name.localeCompare(b.cat.name, "ru");
      });
  })();

  // Use grouped rendering whenever we have >1 distinct categories
  const useGrouped = groupedProducts.length > 1;

  // Deep link / refresh with ?cat=<leaf>: expand that section and scroll to it once loaded
  // (the rest of the categories still render below).
  useEffect(() => {
    if (!urlCatSlug) return;
    const cat = allCategories.find((c) => c.slug === urlCatSlug);
    if (!cat) return;
    setExpanded((prev) => (prev.has(cat.id) ? prev : new Set(prev).add(cat.id)));
    if (leafProducts.length && scrolledForRef.current !== urlCatSlug) {
      scrolledForRef.current = urlCatSlug;
      requestAnimationFrame(() => {
        const el = document.getElementById(`cat-${cat.slug}`);
        if (el) el.scrollIntoView({ behavior: "auto", block: "start" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlCatSlug, leafProducts.length]);

  // Scroll-spy: track which category section is currently visible (window scroll)
  const [visibleCatId, setVisibleCatId] = useState<string | null>(null);
  useEffect(() => {
    if (!useGrouped || groupedProducts.length === 0) {
      setVisibleCatId(null);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Among all currently intersecting sections pick the topmost
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) {
          const catId = (visible.target as HTMLElement).dataset.catId;
          if (catId) setVisibleCatId(catId);
        }
      },
      // Active zone is a band just below the sticky 64px header (top inset 72px)
      // down to ~30% of the viewport — the topmost section in it becomes active.
      { root: null, rootMargin: "-72px 0px -70% 0px", threshold: 0 }
    );
    const sectionEls: Element[] = [];
    for (const g of groupedProducts) {
      const el = document.getElementById(`cat-${g.cat.slug}`);
      if (el) {
        observer.observe(el);
        sectionEls.push(el);
      }
    }
    // Fallback init: if scroll is at top, set first big group as visible
    if (groupedProducts[0]) setVisibleCatId(groupedProducts[0].cat.id);
    return () => observer.disconnect();
  }, [activeId, useGrouped, groupedProducts.length, leafProducts.length]);

  // For sidebar highlight: when grouped view is active, prefer visible section's category.
  // Fall back to activeId if no section visible.
  const highlightId = useGrouped
    ? (visibleCatId ? (topAncestorId(visibleCatId) ?? visibleCatId) : activeId)
    : activeId;

  // Mobile: show horizontal tabs + grid below
  // Desktop: two-panel layout
  return (
    <div className="min-h-screen bg-white font-main">

      {/* ── Page header (compact) ── */}
      <div className="border-b border-slate-200 bg-white">
        <div className="container-page !pt-2 !pb-3">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">Главная</Link>
            <span className="text-slate-300">/</span>
            <Link href="/catalog" className="hover:text-slate-900 transition-colors">Каталог</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900">{brandName}</span>
          </nav>

          <div className="flex items-center gap-4">
            {logoUrl && (
              <div className="relative h-9 w-[100px] shrink-0">
                <Image src={logoUrl} alt={brandName} fill className="object-contain object-left" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {brandName} — каталог продукции
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug mt-0.5">
                {brandDescription || "Полный каталог продукции"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Catalog body ── */}
      <div className="container-page !pt-3 !pb-10">

        {/* ── MOBILE: horizontal category tabs ── */}
        <div className="block lg:hidden mb-3">
          <div className="overflow-x-auto pb-1">
            <div className="flex gap-2 min-w-max">
              {sidebarCategories.map((cat) => {
                const isActive = cat.id === highlightId;
                return (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold border transition-all ${
                      isActive
                        ? "bg-[#e02020] border-[#e02020] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── DESKTOP: two-panel layout ── */}
        {/* NB: no overflow-hidden here — it would break the sticky sidebar below. */}
        <div className="flex border border-slate-200 bg-white shadow-sm">

          {/* Left sidebar (desktop only) — sticky so it stays visible while scrolling */}
          <div className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-slate-200 self-start sticky top-[72px] max-h-[calc(100vh-88px)]">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/80">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                Вся продукция
              </span>
              <IconExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <nav className="flex-1 overflow-y-auto py-1">
              {sidebarCategories.map((cat) => {
                const isActive = cat.id === highlightId;
                const isAll = cat.id === ALL_ID;
                return (
                  <button
                    key={cat.id}
                    onClick={() => selectCategory(cat)}
                    className={`w-full flex items-center justify-between px-5 py-[11px] text-sm text-left transition-all border-l-[3px] group ${
                      isActive
                        ? "border-l-[#e02020] bg-red-50 text-[#e02020] font-bold"
                        : isAll
                          ? "border-l-transparent text-slate-900 hover:bg-slate-50 font-bold"
                          : "border-l-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    }`}
                  >
                    <span className="leading-snug pr-2">{cat.name}</span>
                    <IconChevronRight />
                  </button>
                );
              })}

              {topCategories.length === 0 && (
                <div className="px-5 py-8 text-sm text-slate-400 text-center">
                  Товаров пока нет.<br />
                  <span className="text-xs">Добавьте товары бренда {brandName} в админке.</span>
                </div>
              )}
            </nav>
          </div>

          {/* Right panel — let document scroll, not inner */}
          <div ref={rightRef} className="flex-1 min-w-0 p-4 sm:p-5">

            {active && (
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <BackButton />
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-tight">
                    {active.name}
                  </h2>
                  {!leafLoading && (
                    <span className="text-xs font-bold text-slate-400">
                      {leafProducts.length}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Products: in "All" mode render grouped by category; otherwise flat grid */}
            {leafLoading ? (
              <div className="py-14 text-center text-sm text-slate-400">Загрузка…</div>
            ) : leafProducts.length === 0 ? (
              <div className="py-14 text-center text-sm text-slate-400">Товаров пока нет.</div>
            ) : useGrouped ? (
              <div className="space-y-6">
                {/* Every category is its own section, rendered strictly in the left-menu
                    (popularity) order — so the right side always matches the sidebar. */}
                {groupedProducts.map((g) => {
                  const isOpen = expanded.has(g.cat.id);
                  const shown = isOpen ? g.items : g.items.slice(0, PREVIEW_PER_GROUP);
                  return (
                    <section
                      key={g.cat.id}
                      id={`cat-${g.cat.slug}`}
                      data-cat-id={g.cat.id}
                      className="scroll-mt-20"
                    >
                      <div className="flex items-baseline gap-3 mb-2 pb-1 border-b border-slate-200">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">{g.cat.name}</h3>
                        <span className="text-xs font-bold text-slate-400">{g.items.length}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                        {shown.map((p) => (
                          <ProductCard key={p.id} p={p} />
                        ))}
                      </div>
                      {g.items.length > PREVIEW_PER_GROUP && (
                        <div className="mt-3 text-center">
                          <button
                            type="button"
                            onClick={() => toggleExpand(g.cat.id)}
                            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50 transition-all"
                          >
                            {isOpen ? "Свернуть ↑" : `Показать все ${g.items.length} →`}
                          </button>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
                  {[...leafProducts]
                    .sort((a, b) => Number(!!b.recommended) - Number(!!a.recommended))
                    .slice(0, visibleCount)
                    .map((p) => (
                      <ProductCard key={p.id} p={p} />
                    ))}
                </div>
                {leafProducts.length > visibleCount && (
                  <div className="mt-5 text-center">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((n) => n + 48)}
                      className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold text-brand-700 ring-1 ring-brand-200 hover:bg-brand-50 transition-all"
                    >
                      Показать ещё ({leafProducts.length - visibleCount})
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Bottom tiles removed per user request */}
          </div>
        </div>
      </div>
    </div>
  );
}
