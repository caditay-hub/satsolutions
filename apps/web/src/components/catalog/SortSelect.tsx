"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS: Array<{ value: string; label: string }> = [
  { value: "default", label: "По умолчанию" },
  { value: "name_asc", label: "Название А–Я" },
  { value: "name_desc", label: "Название Я–А" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "new", label: "Сначала новые" },
];

export function SortSelect({ value }: { value: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    const p = new URLSearchParams(sp.toString());
    if (v && v !== "default") p.set("sort", v);
    else p.delete("sort");
    p.delete("page");
    const s = p.toString();
    router.push(`${pathname}${s ? "?" + s : ""}`, { scroll: false });
  }

  return (
    <select
      value={value || "default"}
      onChange={onChange}
      aria-label="Сортировка товаров"
      className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-600"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
