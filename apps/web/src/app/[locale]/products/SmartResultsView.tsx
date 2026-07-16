"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { ProductDto } from "@/lib/api";
import { ProductCard } from "@/components/Cards";

/* Выдача умного поиска с клиентским фильтром-галочками (бренд / тип товара).
   Smart-результаты собраны ИИ-маршрутизатором из нескольких категорий, у них нет
   URL-осей обычного каталога — фильтруем прямо на странице, без перезапроса.
   Локализованные имена приходят с сервера (оверлей i18n в бандл не тянем). */
export type SmartItem = {
  p: ProductDto;
  name: string;            // локализованное имя товара
  brand: string | null;    // имя бренда (ключ фильтра и подпись)
  type: string | null;     // категория из БД (RU) — ключ фильтра
  typeLabel: string | null; // локализованная подпись категории
};

function FacetGroup({ title, options, selected, onToggle }: {
  title: string;
  options: { key: string; label: string; count: number }[];
  selected: Set<string>;
  onToggle: (key: string) => void;
}) {
  const tc = useTranslations("catalog");
  const [expanded, setExpanded] = useState(false);
  const LIMIT = 8;
  const shown = expanded ? options : options.slice(0, LIMIT);
  if (options.length < 2) return null;
  return (
    <div className="border-t border-slate-100 px-4 py-3 first:border-t-0">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</div>
      {/* flex-col, не grid: grid-трек тянется до min-content строки (nowrap-текст) и вылезает за карточку */}
      <div className="flex flex-col gap-1">
        {shown.map((o) => (
          <label key={o.key} className="flex min-w-0 cursor-pointer items-start gap-2 rounded-md px-1 py-0.5 text-[13px] text-slate-700 hover:bg-slate-50">
            <input
              type="checkbox"
              checked={selected.has(o.key)}
              onChange={() => onToggle(o.key)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
            />
            {/* названия переносим целиком (break-words), не обрезаем многоточием */}
            <span className="min-w-0 flex-1 break-words leading-snug">{o.label}</span>
            <span className="shrink-0 text-[11px] text-slate-400">{o.count}</span>
          </label>
        ))}
      </div>
      {options.length > LIMIT ? (
        <button type="button" onClick={() => setExpanded((v) => !v)}
          className="mt-1.5 text-[12px] font-bold text-brand-700 hover:underline">
          {expanded ? tc("hide") : `${tc("showMore")} (${options.length - LIMIT})`}
        </button>
      ) : null}
    </div>
  );
}

export function SmartResultsView({ items, related = [], usdToUzs }: { items: SmartItem[]; related?: SmartItem[]; usdToUzs: number }) {
  const tc = useTranslations("catalog");
  const [selBrands, setSelBrands] = useState<Set<string>>(new Set());
  const [selTypes, setSelTypes] = useState<Set<string>>(new Set());
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggle = (set: Set<string>, key: string, apply: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key); else next.add(key);
    apply(next);
  };

  // Фасеты строим по ВСЕМУ показанному (основная выдача + похожие): при точном
  // запросе модели основная выдача = 1 товар, фильтр без related был бы пустым.
  // Счётчики drill-down: бренды считаем при активных типах, типы — при активных брендах.
  const { brandOpts, typeOpts, filtered, filteredRelated } = useMemo(() => {
    const all = [...items, ...related];
    const byTypes = (it: SmartItem) => selTypes.size === 0 || (it.type != null && selTypes.has(it.type));
    const byBrands = (it: SmartItem) => selBrands.size === 0 || (it.brand != null && selBrands.has(it.brand));
    const bc = new Map<string, number>();
    const tcnt = new Map<string, { label: string; count: number }>();
    for (const it of all) {
      if (it.brand && byTypes(it)) bc.set(it.brand, (bc.get(it.brand) ?? 0) + 1);
      if (it.type && byBrands(it)) {
        const cur = tcnt.get(it.type) ?? { label: it.typeLabel ?? it.type, count: 0 };
        cur.count += 1; tcnt.set(it.type, cur);
      }
    }
    return {
      brandOpts: [...bc.entries()].map(([key, count]) => ({ key, label: key, count })).sort((a, b) => b.count - a.count),
      typeOpts: [...tcnt.entries()].map(([key, v]) => ({ key, label: v.label, count: v.count })).sort((a, b) => b.count - a.count),
      filtered: items.filter((it) => byTypes(it) && byBrands(it)),
      filteredRelated: related.filter((it) => byTypes(it) && byBrands(it)),
    };
  }, [items, related, selBrands, selTypes]);

  const hasActive = selBrands.size > 0 || selTypes.size > 0;
  const reset = () => { setSelBrands(new Set()); setSelTypes(new Set()); };
  const hasFacets = brandOpts.length > 1 || typeOpts.length > 1;

  const sidebar = (
    <div className="rounded-xl border border-slate-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2.5">
        <span className="text-sm font-bold text-slate-900">{tc("filters")}</span>
        {hasActive ? (
          <button type="button" onClick={reset} className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-[#e02020]">
            {tc("reset")} ✕
          </button>
        ) : null}
      </div>
      <FacetGroup title={tc("productType")} options={typeOpts} selected={selTypes}
        onToggle={(k) => toggle(selTypes, k, setSelTypes)} />
      <FacetGroup title={tc("brand")} options={brandOpts} selected={selBrands}
        onToggle={(k) => toggle(selBrands, k, setSelBrands)} />
    </div>
  );

  return (
    <div className={hasFacets ? "grid gap-6 lg:grid-cols-[260px_1fr]" : ""}>
      {hasFacets ? (
        <aside>
          {/* мобильный: складной блок; десктоп: всегда виден, липкий */}
          <button type="button" onClick={() => setMobileOpen((v) => !v)}
            className="mb-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-left text-sm font-bold text-slate-900 lg:hidden">
            {tc("filters")} {hasActive ? `· ${selBrands.size + selTypes.size}` : ""} {mobileOpen ? "▴" : "▾"}
          </button>
          <div className={`${mobileOpen ? "block" : "hidden"} lg:sticky lg:top-20 lg:block`}>{sidebar}</div>
        </aside>
      ) : null}

      <div>
        {hasActive ? (
          <div className="mb-3 text-[13px] text-slate-500">
            {tc("found")}: <span className="font-bold text-slate-900">{filtered.length + filteredRelated.length}</span>
          </div>
        ) : null}
        {filtered.length === 0 && filteredRelated.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            {tc("nothingFound")}
          </div>
        ) : (
          <>
            {filtered.length > 0 ? (
              <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((it) => (
                  <ProductCard key={it.p.id} p={it.p} usdToUzs={usdToUzs} name={it.name} />
                ))}
              </div>
            ) : null}
            {filteredRelated.length > 0 ? (
              <section className={filtered.length > 0 ? "mt-8 border-t border-slate-200 pt-5" : undefined}>
                <h2 className="mb-3 text-lg font-black tracking-tight text-slate-900">{tc("similar")}</h2>
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {filteredRelated.map((it) => (
                    <ProductCard key={it.p.id} p={it.p} usdToUzs={usdToUzs} name={it.name} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}
