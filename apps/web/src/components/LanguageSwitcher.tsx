"use client";

import { useLocale } from "next-intl";
import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, localeNames } from "@/i18n/routing";

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
    router.replace(pathname, { locale: l });
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
        <svg className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" strokeLinecap="round" />
        </svg>
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
              {localeNames[l]}
              {l === locale ? <span className="text-brand-600">✓</span> : null}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
