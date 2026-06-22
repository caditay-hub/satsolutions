"use client";

import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";

export function PerPageSelect({ current, options }: { current: number; options: number[] }) {
  const sp = useSearchParams();
  function href(n: number) {
    const next = new URLSearchParams(sp.toString());
    if (n === options[0]) next.delete("perPage");
    else next.set("perPage", String(n));
    next.delete("page"); // при смене размера — на первую страницу
    const s = next.toString();
    return s ? `/products?${s}` : "/products";
  }
  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
      {options.map((n, i) => {
        const active = n === current;
        return (
          <Link
            key={n}
            href={href(n)}
            scroll={false}
            className={`px-3 py-1.5 text-sm font-bold transition-colors ${i > 0 ? "border-l border-slate-300" : ""} ${
              active ? "bg-brand-600 text-white" : "bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {n}
          </Link>
        );
      })}
    </div>
  );
}
