"use client";

import { useRouter } from "next/navigation";

export function BackButton({ label = "← Назад", fallbackHref = "/dashboard" }: { label?: string; fallbackHref?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) router.back();
        else router.push(fallbackHref);
      }}
      className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
    >
      {label}
    </button>
  );
}

