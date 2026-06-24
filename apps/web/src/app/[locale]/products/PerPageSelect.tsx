"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function PerPageSelect({ current, options }: { current: number; options: number[] }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // ВАЖНО: строим URL от ТЕКУЩЕГО pathname, а не от «/products». Иначе на чистых
  // адресах /products/type/[slug] и /catalog/[brand] (где тип/бренд закодированы в ПУТИ,
  // а не в query) смена «показывать по» уводила на /products?... и фильтр слетал.
  function href(n: number) {
    const next = new URLSearchParams(sp.toString());
    if (n === options[0]) next.delete("perPage");
    else next.set("perPage", String(n));
    next.delete("page"); // при смене размера — на первую страницу
    const s = next.toString();
    return `${pathname}${s ? "?" + s : ""}`;
  }
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
      {options.map((n, i) => {
        const active = n === current;
        return (
          <button
            key={n}
            type="button"
            onClick={() => router.push(href(n), { scroll: false })}
            className={`px-3 py-1.5 text-sm font-bold transition-colors ${i > 0 ? "border-l border-slate-300" : ""} ${
              active ? "bg-brand-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
