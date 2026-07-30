"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeNames } from "@/i18n/routing";

/* Векторные мини-флаги (эмодзи-флаги не рендерятся на Windows/Chrome — рисуем SVG). */
const Flags: Record<string, React.ReactNode> = {
  ru: (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10">
      <rect width="20" height="14" fill="#fff" />
      <rect y="4.67" width="20" height="4.67" fill="#0039A6" />
      <rect y="9.33" width="20" height="4.67" fill="#D52B1E" />
    </svg>
  ),
  uz: (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10">
      <rect width="20" height="14" fill="#fff" />
      <rect width="20" height="4.4" fill="#0099B5" />
      <rect y="4.4" width="20" height="0.5" fill="#CE1126" />
      <rect y="9.1" width="20" height="0.5" fill="#CE1126" />
      <rect y="9.6" width="20" height="4.4" fill="#1EB53A" />
      <circle cx="3.6" cy="2.2" r="1.15" fill="#fff" />
      <circle cx="4.15" cy="2.2" r="1" fill="#0099B5" />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10">
      <rect width="20" height="14" fill="#012169" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#fff" strokeWidth="2.6" />
      <path d="M0 0l20 14M20 0L0 14" stroke="#C8102E" strokeWidth="1.3" />
      <path d="M10 0v14M0 7h20" stroke="#fff" strokeWidth="3.6" />
      <path d="M10 0v14M0 7h20" stroke="#C8102E" strokeWidth="2" />
    </svg>
  ),
  tr: (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10">
      <rect width="20" height="14" fill="#E30A17" />
      <circle cx="8" cy="7" r="3" fill="#fff" />
      <circle cx="9.1" cy="7" r="2.4" fill="#E30A17" />
      <text x="12" y="9.4" fontSize="4.4" fill="#fff">★</text>
    </svg>
  ),
  zh: (
    <svg viewBox="0 0 20 14" className="h-3.5 w-5 rounded-[2px] shadow-sm ring-1 ring-black/10">
      <rect width="20" height="14" fill="#DE2910" />
      <text x="1.8" y="8.6" fontSize="6" fill="#FFDE00">★</text>
      <text x="6.4" y="3.4" fontSize="2.4" fill="#FFDE00">★</text>
      <text x="8" y="5.6" fontSize="2.4" fill="#FFDE00">★</text>
      <text x="8" y="8.8" fontSize="2.4" fill="#FFDE00">★</text>
      <text x="6.4" y="11" fontSize="2.4" fill="#FFDE00">★</text>
    </svg>
  ),
};

/* Переключатель языков: меняет локаль, сохраняя текущий путь. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const switchTo = (l: string) => {
    setOpen(false);
    // Сохраняем query-параметры (фильтры каталога, поиск, пагинация) — иначе смена
    // языка сбрасывает состояние страницы. window.location вместо useSearchParams,
    // чтобы не оборачивать шапку в Suspense на статических страницах.
    const qs = window.location.search;
    // Ручной выбор запоминаем на год — middleware не будет уводить на /uz по языку браузера
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; SameSite=Lax`;
    router.replace(`${pathname}${qs}`, { locale: l });
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-sm font-bold text-slate-900 hover:bg-slate-50"
        aria-label="Сменить язык"
        aria-expanded={open}
      >
        {Flags[locale]}
        <span className="uppercase">{locale}</span>
        <svg className={`h-3 w-3 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
          {routing.locales.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => switchTo(l)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold hover:bg-slate-50 ${
                l === locale ? "text-brand-700" : "text-slate-700"
              }`}
            >
              <span className="inline-flex items-center gap-2">
                {Flags[l]}
                {localeNames[l]}
              </span>
              {l === locale ? <span className="text-brand-600">✓</span> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
