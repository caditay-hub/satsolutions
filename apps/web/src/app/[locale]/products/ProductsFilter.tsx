"use client";

import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { BrandDto, ProductTypeDto } from "@/lib/api";

type Props = {
  brands: BrandDto[];
  types: ProductTypeDto[];
  initial: { q?: string; type?: string; brand?: string };
};

// Тоггл значения в списке через запятую (мультивыбор), сброс страницы
function toggleInList(sp: URLSearchParams, key: string, value: string) {
  const cur = (sp.get(key) ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const next = new URLSearchParams(sp.toString());
  const has = cur.includes(value);
  const list = has ? cur.filter((v) => v !== value) : [...cur, value];
  if (list.length) next.set(key, list.join(","));
  else next.delete(key);
  next.delete("page");
  const s = next.toString();
  return s ? `/products?${s}` : "/products";
}

export function ProductsFilter({ brands, types, initial }: Props) {
  const sp = useSearchParams();
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllTypes, setShowAllTypes] = useState(false);

  const activeBrands = (initial.brand ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const activeTypes = (initial.type ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const hasActive = !!(activeBrands.length || activeTypes.length || (initial.q ?? ""));

  const sortedBrands = useMemo(
    () => brands.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [brands]
  );

  const visBrands = showAllBrands ? sortedBrands : sortedBrands.slice(0, 8);
  const brandsToShow = [
    ...visBrands,
    ...sortedBrands.filter((b) => activeBrands.includes(b.slug) && !visBrands.some((v) => v.slug === b.slug)),
  ];
  const visTypes = showAllTypes ? types : types.slice(0, 12);
  const typesToShow = [
    ...visTypes,
    ...types.filter((t) => activeTypes.includes(t.name) && !visTypes.some((v) => v.name === t.name)),
  ];

  const Box = ({ on }: { on: boolean }) => (
    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 ${on ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"}`}>
      {on && (
        <svg className="h-3 w-3 text-white" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6.5L5 9l4.5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );

  return (
    <aside className="lg:sticky lg:top-4 lg:self-start">
      <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-3 divide-y divide-slate-100">
        <div className="flex items-center justify-between pb-2.5">
          <span className="text-sm font-black uppercase tracking-wider text-slate-600">Фильтр</span>
          {hasActive && (
            <Link href="/products" className="text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-[#e02020]">
              Сбросить
            </Link>
          )}
        </div>

        {/* Бренд — мультивыбор */}
        <div className="py-2.5">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Бренд</div>
          <div className="space-y-0.5">
            {brandsToShow.map((b) => {
              const on = activeBrands.includes(b.slug);
              return (
                <Link key={b.id} href={toggleInList(sp, "brand", b.slug)} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-slate-50">
                  <Box on={on} />
                  <span className={`text-[15px] leading-tight ${on ? "font-semibold text-slate-900" : "text-slate-700"}`}>{b.name}</span>
                </Link>
              );
            })}
          </div>
          {!showAllBrands && sortedBrands.length > 8 && (
            <button type="button" onClick={() => setShowAllBrands(true)} className="mt-1 text-xs font-bold text-brand-700 hover:underline">
              Ещё {sortedBrands.length - 8} ↓
            </button>
          )}
        </div>

        {/* Тип товара — мультивыбор */}
        <div className="pt-2.5">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">Тип товара</div>
          <div className="space-y-0.5 max-h-[48vh] overflow-y-auto pr-0.5">
            {typesToShow.map((t) => {
              const on = activeTypes.includes(t.name);
              return (
                <Link key={t.name} href={toggleInList(sp, "type", t.name)} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-slate-50">
                  <Box on={on} />
                  <span className={`flex-1 text-[15px] leading-tight first-letter:uppercase ${on ? "font-semibold text-slate-900" : "text-slate-700"}`}>{t.name}</span>
                  <span className="text-xs font-semibold text-slate-400">{t.count}</span>
                </Link>
              );
            })}
          </div>
          {!showAllTypes && types.length > 12 && (
            <button type="button" onClick={() => setShowAllTypes(true)} className="mt-1 text-xs font-bold text-brand-700 hover:underline">
              Ещё {types.length - 12} ↓
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
