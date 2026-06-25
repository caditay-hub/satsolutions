"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const OPTIONS: Array<{ value: string; key: string }> = [
  { value: "default", key: "sortDefault" },
  { value: "name_asc", key: "sortNameAsc" },
  { value: "name_desc", key: "sortNameDesc" },
  { value: "price_asc", key: "sortPriceAsc" },
  { value: "price_desc", key: "sortPriceDesc" },
  { value: "new", key: "sortNew" },
];

export function SortSelect({ value }: { value: string }) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tc = useTranslations("catalog");

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
      aria-label={tc("sortAria")}
      className="h-9 rounded-lg border border-slate-300 bg-white px-2.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-600"
    >
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>{tc(o.key)}</option>
      ))}
    </select>
  );
}
