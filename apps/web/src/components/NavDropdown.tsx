"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";

export type NavDropGroup = { label?: string; items: { title: string; href: string }[] };

/** Выпадающее меню пункта шапки (как «Каталог», но проще): hover с задержкой закрытия,
    клик по заголовку — переход на корневую страницу раздела. */
export function NavDropdown({
  label,
  href,
  groups,
  allLabel,
  active = false,
  width = 340,
}: {
  label: string;
  href: string;
  groups: NavDropGroup[];
  allLabel: string;
  active?: boolean;
  width?: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function show() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hideSoon() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  }
  function go(h: string) {
    setOpen(false);
    router.push(h);
  }

  const cols = groups.length > 1;
  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <button
        type="button"
        onClick={() => go(href)}
        onFocus={show}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap text-base xl:text-lg font-bold tracking-tight transition-colors hover:text-brand-700 ${
          active ? "text-brand-700 underline underline-offset-8 decoration-2" : "text-slate-950"
        }`}
      >
        {label}
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-1/2 z-[75] mt-2 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl"
          style={{ width: cols ? width * 2 : width }}
        >
          <div className={cols ? "grid grid-cols-2 gap-x-4" : ""}>
            {groups.map((g, gi) => (
              <div key={gi} className="min-w-0">
                {g.label ? (
                  <div className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">{g.label}</div>
                ) : null}
                <div className="grid gap-0.5">
                  {g.items.map((it) => (
                    <button
                      key={it.href}
                      type="button"
                      onClick={() => go(it.href)}
                      className="truncate rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                      title={it.title}
                    >
                      {it.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Link
            href={href as any}
            onClick={() => setOpen(false)}
            className="mt-2 block rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-bold text-brand-700 hover:bg-brand-100"
          >
            {allLabel} →
          </Link>
        </div>
      )}
    </div>
  );
}
