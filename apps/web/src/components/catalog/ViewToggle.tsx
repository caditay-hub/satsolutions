"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Переключатель список/плитка. По умолчанию список (view-параметр отсутствует),
// плитка → ?view=grid.
export function ViewToggle({ view }: { view: "list" | "grid" }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function set(v: "list" | "grid") {
    const p = new URLSearchParams(sp.toString());
    if (v === "list") p.set("view", "list");
    else p.delete("view");
    p.delete("page");
    const s = p.toString();
    router.push(`${pathname}${s ? "?" + s : ""}`, { scroll: false });
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
      <button
        type="button"
        aria-label="Списком"
        onClick={() => set("list")}
        className={`px-2.5 py-1.5 transition-colors ${view === "list" ? "bg-brand-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <path d="M5 4h9M5 8h9M5 12h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="2" cy="4" r="1" fill="currentColor" />
          <circle cx="2" cy="8" r="1" fill="currentColor" />
          <circle cx="2" cy="12" r="1" fill="currentColor" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Плиткой"
        onClick={() => set("grid")}
        className={`border-l border-slate-300 px-2.5 py-1.5 transition-colors ${view === "grid" ? "bg-brand-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"}`}
      >
        <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="9" y="2" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="2" y="9" width="5" height="5" rx="1" fill="currentColor" />
          <rect x="9" y="9" width="5" height="5" rx="1" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
