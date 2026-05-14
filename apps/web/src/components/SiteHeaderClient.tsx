"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { CartIconButton } from "@/components/CartIconButton";

const nav = [
  { href: "/categories", label: "Категории" },
  { href: "/products", label: "Продукты" },
  { href: "/solutions", label: "Решения" },
  { href: "/news", label: "Новости" },
  { href: "/portfolio", label: "Портфолио" },
  { href: "/about", label: "О компании" }
];

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

export function SiteHeaderClient({ logoImageUrl = null }: { logoImageUrl?: string | null }) {
  const pathname = usePathname();
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
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          {logoImageUrl ? (
            <span className="inline-flex h-[50px] w-[110px] items-center justify-center rounded-lg bg-white">
              <Image alt="Логотип SAT Solutions" src={logoImageUrl} width={110} height={50} className="h-full w-full rounded-lg object-contain" />
            </span>
          ) : (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">S</span>
          )}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" suppressHydrationWarning>
          {nav.map((item) => {
            const active = item.href === activeHref;
            // Explicitly define classes to ensure SSR and Client match
            const linkClasses = `text-base font-bold tracking-tight transition-colors ${active
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
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <CartIconButton />

          <Link
            href="/contact"
            className="btn-primary !bg-brand-700 hover:!bg-brand-800 h-10 w-auto !px-4 hidden lg:inline-flex nav-contact"
          >
            Контакты
          </Link>

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
                <div>
                  <div className="text-sm font-semibold text-slate-950" suppressHydrationWarning>SAT Solutions</div>
                  <div className="text-xs font-bold text-slate-700" suppressHydrationWarning>Системы видеонаблюдения и безопасности</div>
                </div>
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
                <div className="grid gap-2">
                  {nav.map((item) => {
                    const active = item.href === activeHref;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`rounded-xl border px-4 py-3 text-sm font-semibold ${active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50"
                          }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-2">
                  <Link
                    href="/cart"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                  >
                    Корзина
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

