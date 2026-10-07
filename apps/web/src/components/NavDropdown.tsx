"use client";

import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";

export type NavDropGroup = { label?: string; items: { title: string; href: string }[] };

/** Выделенный пункт под списками: не услуга, а инструмент — поэтому со значком и отдельно. */
export type NavDropFeature = { title: string; subtitle?: string; href: string; icon?: React.ReactNode };

/** Выпадающее меню пункта шапки (как «Каталог», но проще): hover с задержкой закрытия,
    клик по заголовку — переход на корневую страницу раздела.
    Панель всегда в HTML (скрыта CSS), пункты — настоящие ссылки (07.10.2026): раньше панель
    рисовалась только после наведения, а пункты были кнопками — для Google на 31 страницу
    услуг ссылались лишь отдельные тексты (intercom — 135 страниц, cctv — 792), тогда как
    разделы каталога из такого же меню получали ссылки со всех ~3600 страниц. */
export function NavDropdown({
  label,
  href,
  groups,
  allLabel,
  active = false,
  width = 340,
  feature,
}: {
  label: string;
  href: string;
  groups: NavDropGroup[];
  allLabel: string;
  active?: boolean;
  width?: number;
  feature?: NavDropFeature;
}) {
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
  const close = () => setOpen(false);

  const cols = groups.length > 1;
  return (
    <div className="relative" onMouseEnter={show} onMouseLeave={hideSoon}>
      <Link
        href={href as any}
        onClick={close}
        onFocus={show}
        aria-expanded={open}
        aria-haspopup="true"
        className={`inline-flex items-center gap-1.5 whitespace-nowrap text-[13px] xl:text-base 2xl:text-lg font-bold tracking-tight transition-colors hover:text-brand-700 ${
          active ? "text-brand-700 underline underline-offset-8 decoration-2" : "text-slate-950"
        }`}
      >
        {label}
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </Link>

      <div
          // Список услуг длиннее экрана ноутбука. Прокручиваем только колонки:
          // калькулятор и «Все услуги» остаются на виду, не уезжая за край.
          className={`absolute left-1/2 z-[75] mt-2 max-h-[80vh] -translate-x-1/2 flex-col rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl ${open ? "flex" : "hidden"}`}
          style={{ width: cols ? width * 2 : width }}
        >
          <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain ${cols ? "grid grid-cols-2 gap-x-4" : ""}`}>
            {groups.map((g, gi) => (
              <div key={gi} className="min-w-0">
                {g.label ? (
                  <div className="px-2 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{g.label}</div>
                ) : null}
                <div className="grid gap-0.5">
                  {g.items.map((it) => (
                    <Link
                      key={it.href}
                      href={it.href as any}
                      onClick={close}
                      className="block truncate rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-700"
                      title={it.title}
                    >
                      {it.title}
                    </Link>
                  ))}
                </div>

              </div>
            ))}
          </div>

          {/* Вне области прокрутки — иначе на невысоком экране уезжает за край.
              Красный: в бирюзовом меню одноцветная плашка терялась среди пунктов
              и сливалась с кнопкой «Все услуги». */}
          {feature && (
            <Link
              href={feature.href as any}
              onClick={close}
              style={{ backgroundColor: "#e02020" }}
              className="mt-3 flex w-full shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left shadow-sm transition-opacity hover:opacity-90"
            >
              {feature.icon && (
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white" style={{ color: "#e02020" }} aria-hidden>
                  {feature.icon}
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-[13px] font-bold text-white">{feature.title}</span>
                {feature.subtitle && <span className="block truncate text-[11px] text-white/80">{feature.subtitle}</span>}
              </span>
            </Link>
          )}

          <Link
            href={href as any}
            onClick={close}
            className="mt-2 block shrink-0 rounded-lg bg-brand-50 px-3 py-2 text-center text-xs font-bold text-brand-700 hover:bg-brand-100"
          >
            {allLabel} →
          </Link>
        </div>
    </div>
  );
}
