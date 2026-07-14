"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { SatLogo } from "@/components/SatLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { getSearchSuggest, type SuggestDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { typeSlug } from "@/lib/typeSlug";
import { priceLabel, productIcon } from "@/lib/product";
import { CatalogMega } from "@/components/CatalogMega";
import { NavDropdown, type NavDropGroup } from "@/components/NavDropdown";
import { SERVICES, INDUSTRIES } from "@/lib/servicesData";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { LoadingDots } from "@/components/LoadingDots";

const nav = [
  { href: "/", key: "home" },
  { href: "/solutions", key: "services" },
  { href: "/products", key: "catalog", mega: true },
  { href: "/portfolio", key: "portfolio" },
  { href: "/about", key: "about" }
] as const;

function HeaderSearch({ className = "", onDone }: { className?: string; onDone?: () => void }) {
  const router = useRouter();
  const ts = useTranslations("search");
  const [q, setQ] = useState("");
  const [sug, setSug] = useState<SuggestDto>({ products: [], types: [], brands: [], cases: [] });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // живые подсказки с дебаунсом
  useEffect(() => {
    const v = q.trim();
    if (v.length < 2) { setSug({ products: [], types: [], brands: [], cases: [] }); setOpen(false); setLoading(false); return; }
    setLoading(true);
    setOpen(true); // сразу открываем дропдаун — покажем индикатор «идёт поиск», не ждём ответа
    const t = setTimeout(async () => {
      try {
        const r = await getSearchSuggest(v);
        setSug(r);
        setOpen(true);
      } catch { /* ignore */ }
      finally { setLoading(false); }
    }, 200);
    return () => clearTimeout(t);
  }, [q]);

  // клик вне — закрыть
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(href: string) {
    setOpen(false); setQ(""); onDone?.();
    router.push(href);
  }
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (v) go(`/products?q=${encodeURIComponent(v)}`);
  }

  const hasResults = sug.products.length || sug.types.length || sug.brands.length || (sug.cases?.length ?? 0);

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form onSubmit={submit} role="search">
        <div className="relative">
          <svg className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.34-4.34M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
          </svg>
          <input
            type="search"
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => { if (hasResults) setOpen(true); }}
            placeholder={ts("placeholder")}
            aria-label={ts("aria")}
            autoComplete="off"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-brand-600"
          />
        </div>
      </form>

      {open && q.trim().length >= 2 && (
        <div className="absolute left-0 right-0 z-[70] mt-1 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl">
          {loading && (
            <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-500">
              <LoadingDots className="text-brand-600" />
              <span>{ts("searching")}…</span>
            </div>
          )}
          {!hasResults && !loading && (
            <div className="px-3 py-2 text-sm text-slate-400">{ts("nothing")}</div>
          )}

          {sug.types.length > 0 && (
            <div className="mb-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{ts("cats")}</div>
              {sug.types.map((t) => (
                <button key={t.name} type="button" onClick={() => go(`/products/type/${typeSlug(t.name)}`)}
                  className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50">
                  <span className="truncate text-slate-700">{t.name}</span>
                  <span className="shrink-0 text-[11px] text-slate-400">{t.count}</span>
                </button>
              ))}
            </div>
          )}

          {sug.brands.length > 0 && (
            <div className="mb-1 border-t border-slate-100 pt-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{ts("brands")}</div>
              {sug.brands.map((b) => (
                <button key={b.slug} type="button" onClick={() => go(`/catalog/${b.slug}`)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-slate-700 hover:bg-slate-50">
                  <span className="text-brand-600">●</span> {b.name}
                </button>
              ))}
            </div>
          )}

          {sug.products.length > 0 && (
            <div className="border-t border-slate-100 pt-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{ts("products")}</div>
              {sug.products.map((p) => {
                const img = resolveImageUrl(p.coverImageUrl);
                const price = priceLabel({ price: p.price, characteristics: p.chars_text ? safeParse(p.chars_text) : null } as any);
                return (
                  <button key={p.slug} type="button" onClick={() => go(`/products/${p.slug}`)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-slate-50">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                      {img ? <Image src={img} alt="" width={36} height={36} className="object-contain" unoptimized /> : <span className="text-base opacity-50">{productIcon(p.name)}</span>}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-slate-800">{p.name}</span>
                      {price ? <span className="block text-[11px] font-bold text-[#e02020]">{price}</span> : (p.brand_name ? <span className="block text-[11px] text-slate-400">{p.brand_name}</span> : null)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {(sug.cases?.length ?? 0) > 0 && (
            <div className="border-t border-slate-100 pt-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{ts("cases")}</div>
              {sug.cases!.map((c) => (
                <button key={`${c.kind}-${c.slug}`} type="button"
                  onClick={() => go(c.kind === "portfolio" ? `/portfolio/${c.slug}` : `/solutions/${c.slug}`)}
                  className="flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-sm hover:bg-slate-50">
                  <span className="mt-0.5 text-emerald-600">◆</span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-slate-800">{c.title}</span>
                    {c.excerpt ? <span className="block truncate text-[11px] text-slate-400">{c.excerpt}</span> : null}
                  </span>
                </button>
              ))}
            </div>
          )}

          {hasResults ? (
            <button type="button" onClick={() => { const v = q.trim(); if (v) go(`/products?q=${encodeURIComponent(v)}`); }}
              className="mt-1 w-full rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-bold text-brand-700 hover:bg-brand-100">
              {ts("showAll")} «{q.trim()}» →
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

function safeParse(s: string): any { try { return JSON.parse(s); } catch { return null; } }

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="text-slate-900">
      {open ? (
        <path
          fill="currentColor"
          d="M18.3 5.71a1 1 0 0 1 0 1.42L13.41 12l4.89 4.87a1 1 0 1 1-1.42 1.42L12 13.41l-4.88 4.88a1 1 0 1 1-1.42-1.42L10.59 12 5.7 7.13a1 1 0 1 1 1.42-1.42L12 10.59l4.88-4.88a1 1 0 0 1 1.42 0Z"
        />
      ) : (
        <path fill="currentColor" d="M4 6.5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm0 5.5a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2H5a1 1 0 0 1-1-1Zm1 4.5a1 1 0 1 0 0 2h14a1 1 0 1 0 0-2H5Z" />
      )}
    </svg>
  );
}

export function SiteHeaderClient({ logoImageUrl = null, portfolioItems = [] }: { logoImageUrl?: string | null; portfolioItems?: { title: string; slug: string }[] }) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const tsv = useTranslations("services");
  const tsp = useTranslations("solutionsPage");

  // Выпадашка «Услуги»: системы + отрасли из servicesData (заголовки локализованы messages)
  const solutionGroups: NavDropGroup[] = [
    { label: tsp("systemsLabel"), items: SERVICES.map((s) => ({ title: tsv(`${s.key}.title`), href: `/solutions/${s.key}` })) },
    { label: tsp("industriesLabel"), items: INDUSTRIES.map((s) => ({ title: tsv(`${s.key}.title`), href: `/solutions/${s.key}` })) },
  ];
  const portfolioGroups: NavDropGroup[] = [
    { items: portfolioItems.map((p) => ({ title: p.title, href: `/portfolio/${p.slug}` })) },
  ];
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const activeHref = useMemo(() => {
    // Keep it simple: highlight exact matches for top-level pages.
    return nav.find((x) => x.href === pathname)?.href ?? null;
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page relative flex h-16 items-center gap-6">
        <div className="flex shrink-0 items-center">
          <SatLogo size="md" />
        </div>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-8" suppressHydrationWarning>
          {nav.map((item) => {
            if ((item as any).mega) {
              return <CatalogMega key={item.href} />;
            }
            if (item.key === "services") {
              return <NavDropdown key={item.href} label={t(item.key)} href="/solutions" groups={solutionGroups} allLabel={t("allServices")} active={item.href === activeHref} width={300} />;
            }
            if (item.key === "portfolio" && portfolioItems.length > 0) {
              return <NavDropdown key={item.href} label={t(item.key)} href="/portfolio" groups={portfolioGroups} allLabel={t("allProjects")} active={item.href === activeHref} width={380} />;
            }
            const active = item.href === activeHref;
            // Меню всегда по центру страницы (absolute + -translate-x-1/2): одинаково на всех языках. Крупный шрифт.
            const linkClasses = `whitespace-nowrap text-base xl:text-lg font-bold tracking-tight transition-colors ${active
              ? "text-brand-700 underline underline-offset-8 decoration-2"
              : "text-slate-950 hover:text-brand-700"
              }`;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={linkClasses}
                suppressHydrationWarning
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 ml-auto">
          <HeaderSearch className="hidden lg:block w-40 xl:w-48 2xl:w-56" />
          <LanguageSwitcher className="hidden lg:block" />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50 lg:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {mounted && open
        ? createPortal(
          <div className="fixed inset-0 z-[60] lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
            />
            <div className="absolute right-0 top-0 h-[100dvh] w-[86%] max-w-sm overflow-y-auto bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <SatLogo size="sm" href={null} />
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                  aria-label="Закрыть"
                >
                  <MenuIcon open />
                </button>
              </div>

              <div className="px-5 py-4">
                <HeaderSearch className="mb-4" onDone={() => setOpen(false)} />
                <div className="grid gap-2">
                  {nav.map((item) => {
                    if ((item as any).mega) {
                      return (
                        <details key={item.href} className="rounded-xl border border-slate-200 bg-white">
                          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-900">
                            {t(item.key)}
                          </summary>
                          <div className="border-t border-slate-100 px-2 py-2">
                            {CATALOG_GROUPS.map((g) => (
                              <details key={g.title} className="px-2">
                                <summary className="cursor-pointer list-none py-2 text-[13px] font-semibold text-slate-700">{g.title}</summary>
                                <div className="grid gap-0.5 pb-2 pl-3">
                                  {g.types.map((tn) => (
                                    <Link key={tn.n} href={`/products/type/${typeSlug(tn.n)}`} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">
                                      <span className="truncate">{tn.n}</span><span className="shrink-0 text-[11px] text-slate-400">{tn.c}</span>
                                    </Link>
                                  ))}
                                </div>
                              </details>
                            ))}
                            <Link href="/categories" className="mt-1 block rounded-md px-3 py-2 text-[13px] font-bold text-brand-700 hover:bg-slate-50">Все категории →</Link>
                            <Link href="/catalog" className="block rounded-md px-3 py-2 text-[13px] font-bold text-brand-700 hover:bg-slate-50">Все бренды →</Link>
                          </div>
                        </details>
                      );
                    }
                    if (item.key === "services") {
                      return (
                        <details key={item.href} className="rounded-xl border border-slate-200 bg-white">
                          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-900">{t(item.key)}</summary>
                          <div className="border-t border-slate-100 px-2 py-2">
                            {solutionGroups.map((g, gi) => (
                              <div key={gi} className="px-2 pb-1">
                                {g.label ? <div className="py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.label}</div> : null}
                                {g.items.map((it) => (
                                  <Link key={it.href} href={it.href as any} className="block rounded-md px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">{it.title}</Link>
                                ))}
                              </div>
                            ))}
                            <Link href="/solutions" className="mt-1 block rounded-md px-3 py-2 text-[13px] font-bold text-brand-700 hover:bg-slate-50">{t("allServices")} →</Link>
                          </div>
                        </details>
                      );
                    }
                    if (item.key === "portfolio" && portfolioItems.length > 0) {
                      return (
                        <details key={item.href} className="rounded-xl border border-slate-200 bg-white">
                          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-slate-900">{t(item.key)}</summary>
                          <div className="border-t border-slate-100 px-2 py-2">
                            {portfolioItems.map((pr) => (
                              <Link key={pr.slug} href={`/portfolio/${pr.slug}` as any} className="block rounded-md px-2 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50">{pr.title}</Link>
                            ))}
                            <Link href="/portfolio" className="mt-1 block rounded-md px-3 py-2 text-[13px] font-bold text-brand-700 hover:bg-slate-50">{t("allProjects")} →</Link>
                          </div>
                        </details>
                      );
                    }
                    const active = item.href === activeHref;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold ${active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                          }`}
                      >
                        {t(item.key)}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <LanguageSwitcher />
                </div>

                <div className="mt-6 grid gap-2">
                  <Link
                    href="/contact"
                    className="rounded-xl bg-brand-700 px-4 py-3 text-center text-sm font-bold text-white hover:bg-brand-800"
                  >
                    {tc("contacts")}
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
        : null}
    </header>
  );
}

