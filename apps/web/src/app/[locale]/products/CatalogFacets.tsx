"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProductFacets } from "@/lib/api";

const VISIBLE = 6; // сколько значений показываем до «Ещё N»

function num(v: string | null | undefined) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
}
function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
}

const Check = ({ on }: { on: boolean }) => (
  <span className={`flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded border ${on ? "border-brand-600 bg-brand-600" : "border-slate-300 bg-white"}`}>
    {on ? <svg className="h-2.5 w-2.5 text-white" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}
  </span>
);

// иконки групп
const IconType = () => (<svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M2.5 3.5h4v4h-4zM9.5 3.5h4v4h-4zM2.5 9.5h4v4h-4zM9.5 9.5h4v4h-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>);
const IconBrand = () => (<svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M2 3h7l5 5-6 6-5-5V3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /><circle cx="5.5" cy="5.5" r="1" fill="currentColor" /></svg>);
const IconPrice = () => (<svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M5 3h3.5a2.5 2.5 0 010 5H5m0 0V3m0 5v5m0-5h5M5 10.5h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>);
const IconSpec = () => (<svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M3 11h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /><circle cx="6" cy="5" r="1.6" fill="#fff" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="11" r="1.6" fill="#fff" stroke="currentColor" strokeWidth="1.4" /></svg>);

function Group({ title, icon, defaultOpen = true, children }: { title: string; icon: React.ReactNode; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 rounded-md bg-slate-100 px-2.5 py-2 text-left hover:bg-slate-200/70">
        <span className="text-brand-600">{icon}</span>
        <span className="flex-1 truncate text-[13px] font-bold text-slate-800">{title}</span>
        <svg className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="none"><path d="M2.5 4.5L6 8l3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {open ? <div className="px-1 pb-1 pt-1.5">{children}</div> : null}
    </div>
  );
}

function ValueList<T>({ items, render, selected }: { items: T[]; render: (item: T) => React.ReactNode; selected?: (item: T) => boolean }) {
  const [all, setAll] = useState(false);
  // Выбранные значения за порогом VISIBLE подкалываем в видимую часть — иначе отмеченный
  // пункт «прячется» под «Ещё N» и кажется, что выбор пропал.
  const head = items.slice(0, VISIBLE);
  const pinned = selected ? items.slice(VISIBLE).filter(selected) : [];
  const shown = all ? items : [...head, ...pinned];
  const hiddenCount = items.length - shown.length;
  return (
    <>
      <div className="flex flex-col gap-0.5">{shown.map(render)}</div>
      {(all ? items.length > VISIBLE : hiddenCount > 0) ? (
        <button type="button" onClick={() => setAll((a) => !a)} className="mt-1 pl-1.5 text-[12px] font-semibold text-brand-700 hover:underline">
          {all ? "Скрыть" : `Ещё ${hiddenCount}`}
        </button>
      ) : null}
    </>
  );
}

type Show = { brands?: boolean; types?: boolean };

/**
 * Единый фильтр-сайдбар каталога. Группы рендерятся по данным фасетов + флагам show:
 *  - Бренд (show.brands) — мультивыбор ?brand=slug,slug
 *  - Тип товара (show.types) — мультивыбор ?type=Имя,Имя
 *  - Цена — диапазон ?priceMin/?priceMax
 *  - Характеристики — мультивыбор ?chars={"Ключ":["знач"]} (только для однородного scope)
 * pathType/pathBrand — измерение, закодированное в ПУТИ чистого URL (/products/type/[slug],
 * /catalog/[brand]). Оно не видно в query, поэтому передаём его явно: «Тип» показывает текущий
 * тип отмеченным, а переключение типа уводит на унифицированный /products?... со всеми фильтрами.
 */
export function CatalogFacets({ facets, show, pathType, pathBrand }: { facets: ProductFacets; show?: Show; pathType?: string; pathBrand?: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const showBrands = show?.brands !== false;
  const showTypes = show?.types !== false;

  const brands = (sp.get("brand") || "").split(",").filter(Boolean);
  const queryTypes = (sp.get("type") || "").split(",").map((s) => s.trim()).filter(Boolean);
  // Эффективно выбранные типы = тип из пути (если есть) + типы из query.
  const types = pathType ? Array.from(new Set([pathType, ...queryTypes])) : queryTypes;
  let chars: Record<string, string[]> = {};
  try {
    const parsed = JSON.parse(sp.get("chars") || "{}");
    for (const [k, v] of Object.entries(parsed)) chars[k] = Array.isArray(v) ? (v as unknown[]).map(String) : [String(v)];
  } catch { chars = {}; }

  function build(mut: (p: URLSearchParams) => void) {
    const p = new URLSearchParams(sp.toString());
    p.delete("page");
    mut(p);
    const s = p.toString();
    return `${pathname}${s ? "?" + s : ""}`;
  }
  function go(href: string) { router.push(href, { scroll: false }); }

  function toggleBrand(slug: string) {
    go(build((p) => {
      const list = brands.includes(slug) ? brands.filter((b) => b !== slug) : [...brands, slug];
      if (list.length) p.set("brand", list.join(",")); else p.delete("brand");
    }));
  }
  // Тип меняем ВСЕГДА на /products?... — на чистом /products/type/[slug] тип закодирован в пути,
  // и query ?type там перезаписывается. Подсеваем закодированные в пути бренд/тип, чтобы не терять
  // контекст (напр. со страницы бренда переключение типа сохраняет бренд).
  function toggleType(name: string) {
    const list = types.includes(name) ? types.filter((t) => t !== name) : [...types, name];
    const p = new URLSearchParams(sp.toString());
    p.delete("page");
    if (pathBrand && !p.get("brand")) p.set("brand", pathBrand);
    p.delete("type");
    if (list.length) p.set("type", list.join(","));
    const s = p.toString();
    go(`/products${s ? "?" + s : ""}`);
  }
  function toggleChar(key: string, value: string) {
    go(build((p) => {
      const c: Record<string, string[]> = { ...chars };
      const list = c[key] ? [...c[key]] : [];
      const i = list.indexOf(value);
      if (i >= 0) list.splice(i, 1); else list.push(value);
      if (list.length) c[key] = list; else delete c[key];
      if (Object.keys(c).length) p.set("chars", JSON.stringify(c)); else p.delete("chars");
    }));
  }

  // цена
  const bMin = facets.price.min || 0;
  const bMax = facets.price.max || 0;
  const clampP = (v: number) => Math.max(bMin, Math.min(v, bMax));
  const urlMin = num(sp.get("priceMin"));
  const urlMax = num(sp.get("priceMax"));
  const [vMin, setVMin] = useState(clampP(urlMin || bMin));
  const [vMax, setVMax] = useState(clampP(urlMax || bMax));
  // Ресинхрон + КЛЭМП в текущие границы. Границы диапазона зависят от других фильтров
  // (drill-down: бренд/тип/характеристики их сужают). Значение из URL, заданное в более широком
  // scope, могло вылезти за новый трек ползунка (бар/бегунок за пределами). Зажимаем в [bMin,bMax].
  useEffect(() => {
    setVMin(clampP(urlMin || bMin));
    setVMax(clampP(urlMax || bMax));
  }, [bMin, bMax, urlMin, urlMax]);
  const step = Math.max(1, Math.round((bMax - bMin) / 100));
  const pct = (v: number) => (bMax > bMin ? ((clampP(v) - bMin) / (bMax - bMin)) * 100 : 0);
  function commitPrice(lo = vMin, hi = vMax) {
    const clo = clampP(lo), chi = clampP(hi);
    go(build((p) => {
      if (clo > bMin) p.set("priceMin", String(Math.round(clo))); else p.delete("priceMin");
      if (chi < bMax) p.set("priceMax", String(Math.round(chi))); else p.delete("priceMax");
    }));
  }

  const brandList = showBrands ? facets.brands : [];
  const typeList = showTypes ? facets.types : [];
  // «Сбросить» — по query-фильтрам (тип из ПУТИ чистого URL сбрасывается уходом со страницы, не кнопкой).
  const hasActive = brands.length > 0 || queryTypes.length > 0 || Object.keys(chars).length > 0 || !!sp.get("priceMin") || !!sp.get("priceMax");

  return (
    <aside className="space-y-1.5 text-sm lg:sticky lg:top-4 lg:self-start">
      <style>{`
        .dual-range{ -webkit-appearance:none; appearance:none; background:transparent; pointer-events:none; position:absolute; left:0; right:0; width:100%; height:24px; margin:0; }
        .dual-range::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none; pointer-events:auto; height:24px; width:24px; border-radius:9999px; background:#fff; border:2px solid #328fa8; cursor:pointer; box-shadow:0 1px 2px rgba(0,0,0,.25); }
        .dual-range::-moz-range-thumb{ pointer-events:auto; height:24px; width:24px; border-radius:9999px; background:#fff; border:2px solid #328fa8; cursor:pointer; }
        .dual-range::-webkit-slider-runnable-track{ background:transparent; }
        .dual-range::-moz-range-track{ background:transparent; }
      `}</style>

      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider text-slate-500">
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M4.5 8h7M6.5 12h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          Фильтры
        </span>
        {hasActive ? (
          <button type="button" onClick={() => go(pathname)} className="text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-[#e02020]">Сбросить ✕</button>
        ) : null}
      </div>

      {/* Порядок групп: сначала Цена, затем Бренд, Тип товара и характеристики. */}
      {bMax > 0 && (
        <Group title="Цена, сум" icon={<IconPrice />}>
          <div className="px-1.5 pb-1 pt-1">
            <div className="mb-2 text-[12px] text-slate-500">Диапазон ({fmt(bMin)} – {fmt(bMax)} сум)</div>
            <div className="relative mb-3 h-6">
              <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded bg-slate-200" />
              <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded bg-brand-500" style={{ left: `${pct(vMin)}%`, right: `${100 - pct(vMax)}%` }} />
              <input className="dual-range" type="range" min={bMin} max={bMax} step={step} value={vMin} onChange={(e) => setVMin(Math.min(Number(e.target.value), vMax))} onMouseUp={() => commitPrice()} onTouchEnd={() => commitPrice()} aria-label="Цена от" />
              <input className="dual-range" type="range" min={bMin} max={bMax} step={step} value={vMax} onChange={(e) => setVMax(Math.max(Number(e.target.value), vMin))} onMouseUp={() => commitPrice()} onTouchEnd={() => commitPrice()} aria-label="Цена до" />
            </div>
            <div className="flex items-center gap-1.5">
              <input type="number" inputMode="numeric" aria-label="Цена от, сум" value={vMin} onChange={(e) => setVMin(Number(e.target.value) || bMin)} onBlur={() => commitPrice()} className="h-8 w-full rounded-md border border-slate-300 px-2 text-[13px] outline-none focus:border-brand-600" />
              <span className="text-slate-500">–</span>
              <input type="number" inputMode="numeric" aria-label="Цена до, сум" value={vMax} onChange={(e) => setVMax(Number(e.target.value) || bMax)} onBlur={() => commitPrice()} className="h-8 w-full rounded-md border border-slate-300 px-2 text-[13px] outline-none focus:border-brand-600" />
            </div>
          </div>
        </Group>
      )}

      {brandList.length > 1 && (
        <Group title="Бренд" icon={<IconBrand />}>
          <ValueList
            items={brandList}
            selected={(b) => brands.includes(b.slug)}
            render={(b) => {
              const on = brands.includes(b.slug);
              return (
                <button key={b.slug} type="button" onClick={() => toggleBrand(b.slug)} className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-slate-50">
                  <Check on={on} />
                  <span className="flex-1 truncate text-[13px] text-slate-700">{b.name}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">{b.count}</span>
                </button>
              );
            }}
          />
        </Group>
      )}

      {typeList.length > 1 && (
        <Group title="Тип товара" icon={<IconType />}>
          <ValueList
            items={typeList}
            selected={(t) => types.includes(t.name)}
            render={(t) => {
              const on = types.includes(t.name);
              return (
                <button key={t.name} type="button" onClick={() => toggleType(t.name)} className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-slate-50">
                  <Check on={on} />
                  <span className="flex-1 truncate text-[13px] text-slate-700 first-letter:uppercase">{t.name}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">{t.count}</span>
                </button>
              );
            }}
          />
        </Group>
      )}

      {facets.chars.map((c) => (
        <Group key={c.key} title={c.key} icon={<IconSpec />} defaultOpen={false}>
          <ValueList
            items={c.values}
            selected={(v) => (chars[c.key] || []).includes(v.value)}
            render={(v) => {
              const on = (chars[c.key] || []).includes(v.value);
              return (
                <button key={v.value} type="button" onClick={() => toggleChar(c.key, v.value)} className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left hover:bg-slate-50">
                  <Check on={on} />
                  <span className="flex-1 truncate text-[13px] text-slate-700">{v.value}</span>
                  <span className="shrink-0 text-[11px] text-slate-500">{v.count}</span>
                </button>
              );
            }}
          />
        </Group>
      ))}
    </aside>
  );
}
