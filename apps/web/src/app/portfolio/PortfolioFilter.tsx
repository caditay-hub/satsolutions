"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { PortfolioCategoryDto } from "@/lib/api";

export function PortfolioFilter({
  categories,
  activeSlug
}: {
  categories: PortfolioCategoryDto[];
  activeSlug?: string;
}) {
  const [open, setOpen] = useState(false);

  const computed = useMemo(() => {
    const byId = new Map<string, PortfolioCategoryDto>(categories.map((c) => [c.id, c]));
    const bySlug = new Map<string, PortfolioCategoryDto>(categories.map((c) => [c.slug, c]));
    const childrenByParent = new Map<string, PortfolioCategoryDto[]>();
    for (const c of categories) {
      const key = c.parentId ?? "__root__";
      const arr = childrenByParent.get(key) ?? [];
      arr.push(c);
      childrenByParent.set(key, arr);
    }
    for (const [k, arr] of childrenByParent.entries()) {
      arr.sort((a, b) => a.name.localeCompare(b.name));
      childrenByParent.set(k, arr);
    }

    const current = activeSlug ? bySlug.get(activeSlug) : undefined;
    const siblings = current ? childrenByParent.get(current.parentId ?? "__root__") ?? [] : childrenByParent.get("__root__") ?? [];
    const children = current ? childrenByParent.get(current.id) ?? [] : childrenByParent.get("__root__") ?? [];

    const buildPath = (cat: PortfolioCategoryDto) => {
      const path: PortfolioCategoryDto[] = [cat];
      let cur: PortfolioCategoryDto | undefined = cat;
      const seen = new Set<string>();
      while (cur?.parentId) {
        if (seen.has(cur.parentId)) break;
        seen.add(cur.parentId);
        const p = byId.get(cur.parentId);
        if (!p) break;
        path.unshift(p);
        cur = p;
      }
      return path;
    };

    const path = current ? buildPath(current) : [];
    return { current, siblings, children, path };
  }, [categories, activeSlug]);

  const { current, siblings, children, path } = computed;

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 sm:w-auto"
          aria-expanded={open}
        >
          {open ? "Закрыть фильтр" : "Открыть фильтр"}
          <span className="text-slate-400">{open ? "▲" : "▼"}</span>
        </button>

        {current ? (
          <div className="text-xs text-slate-600 sm:text-sm">
            Категория: <span className="font-semibold text-slate-900">{current.name}</span>
          </div>
        ) : (
          <div className="text-xs text-slate-600 sm:text-sm">
            Категория: <span className="font-semibold text-slate-900">Все</span>
          </div>
        )}
      </div>

      {open ? (
        <div className="border-t border-slate-200 px-5 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm font-semibold text-slate-900">Фильтр</div>
            {current ? (
              <Link href="/portfolio" className="text-sm font-semibold text-brand-700 hover:underline">
                Сбросить
              </Link>
            ) : null}
          </div>

          {current ? (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <Link href="/portfolio" className="font-semibold text-brand-700 hover:underline">
                Все категории
              </Link>
              <span className="text-slate-400">/</span>
              {path.map((p, idx) => {
                const isLast = idx === path.length - 1;
                if (isLast) return <span key={p.id} className="font-semibold text-slate-900">{p.name}</span>;
                return (
                  <span key={p.id} className="inline-flex items-center gap-2">
                    <Link href={`/portfolio?category=${encodeURIComponent(p.slug)}`} className="font-semibold text-brand-700 hover:underline">
                      {p.name}
                    </Link>
                    <span className="text-slate-400">/</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="mt-2 text-sm text-slate-600">Выберите категорию.</div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/portfolio"
              className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                !current ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Все
            </Link>
            {siblings.map((c) => {
              const active = current?.id === c.id;
              return (
                <Link
                  key={c.id}
                  href={`/portfolio?category=${encodeURIComponent(c.slug)}`}
                  className={`rounded-full border px-3 py-1 text-sm font-semibold ${
                    active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {c.name}
                </Link>
              );
            })}
          </div>

          {children.length ? (
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Подкатегории</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {children.map((c) => (
                  <Link
                    key={c.id}
                    href={`/portfolio?category=${encodeURIComponent(c.slug)}`}
                    className="rounded-full border border-slate-300 bg-white px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

