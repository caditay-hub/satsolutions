"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { GroupIcon } from "@/components/GroupIcon";
import { typeSlug } from "@/lib/typeSlug";
import { localizeCatName } from "@/lib/catalogI18n";

function typeHref(name: string) {
  return `/products/type/${typeSlug(name)}`;
}
// Раздел всей группы (все товары группы) — /products/group/<slug>
function groupHref(title: string) {
  return `/products/group/${typeSlug(title)}`;
}

/** DNS-стиль мега-меню «Каталог»: слева функциональные группы, справа их типы. */
export function CatalogMega() {
  const router = useRouter();
  const t = useTranslations("nav");
  const tm = useTranslations("catalogMega");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }
  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  const group = CATALOG_GROUPS[active];
  const chipCls =
    "rounded-full px-4 py-1.5 text-sm font-bold text-brand-700 ring-1 ring-brand-200 transition-colors hover:bg-brand-50 hover:ring-brand-300";

  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        onClick={() => go("/products")}
        onFocus={show}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 whitespace-nowrap text-base xl:text-lg font-bold tracking-tight text-slate-950 transition-colors hover:text-brand-700"
      >
        {t("catalog")}
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {(
        <div className={`absolute left-1/2 top-full z-[65] mt-3 w-[960px] max-w-[96vw] -translate-x-1/2 ${open ? "block" : "hidden"}`}>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Верхняя панель: быстрые переходы (стиль сайта) */}
            <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-4 py-2.5">
              <Link href="/catalog" onClick={() => setOpen(false)} className={chipCls}>
                {tm("allBrands")}
              </Link>
              <Link href="/categories" onClick={() => setOpen(false)} className={chipCls}>
                {tm("allCategories")}
              </Link>
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-1.5 text-sm font-bold text-white transition-colors hover:bg-brand-700"
              >
                {tm("wholeCatalog")}
                <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" /></svg>
              </Link>
            </div>

            <div className="grid grid-cols-[336px_1fr]">
              <div className="border-r border-slate-100 bg-slate-50/60 p-2">
                {CATALOG_GROUPS.map((g, i) => {
                  const on = i === active;
                  // Левый пункт — ссылка на раздел всей группы; наведение показывает её типы справа.
                  return (
                    <Link
                      key={g.title}
                      href={groupHref(g.title)}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => setOpen(false)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${on ? "bg-white font-semibold text-brand-700 shadow-sm" : "text-slate-700 hover:bg-white/70"}`}
                    >
                      <GroupIcon name={g.icon} className={`h-[18px] w-[18px] shrink-0 ${on ? "text-brand-600" : "text-slate-400"}`} />
                      <span className="flex-1 leading-tight">{localizeCatName(g.title, locale)}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0 opacity-40"><path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" /></svg>
                    </Link>
                  );
                })}
              </div>

              <div className="p-4">
                <div className="mb-2.5 flex items-center justify-between">
                  <Link href={groupHref(group.title)} onClick={() => setOpen(false)} className="text-[15px] font-semibold text-slate-900 transition-colors hover:text-brand-700">
                    {localizeCatName(group.title, locale)}
                  </Link>
                  <Link href={groupHref(group.title)} onClick={() => setOpen(false)} className="text-xs font-bold text-brand-700 hover:underline">
                    {tm("allSectionItems")} →
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-x-4 gap-y-0.5">
                  {group.types.map((t) => (
                    <Link
                      key={t.n}
                      href={typeHref(t.n)}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between gap-1.5 rounded-md px-2 py-1.5 text-[13px] text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-700"
                    >
                      <span className="truncate">{localizeCatName(t.n, locale)}</span>
                      <span className="shrink-0 text-[11px] text-slate-400">{t.c}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
