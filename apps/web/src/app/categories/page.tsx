import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getCategories } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

export const metadata: Metadata = {
  title: "Категории",
  description: "Категории продуктов"
};

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof getCategories>>["categories"] = [];
  try {
    const r = await getCategories();
    categories = r.categories ?? [];
  } catch {
    // If API is unavailable during build, show an empty state instead of failing the build.
    categories = [];
  }

  const childrenByParent = new Map<string, typeof categories>();
  for (const c of categories) {
    if (!c.parentId) continue;
    const arr = childrenByParent.get(c.parentId) ?? [];
    arr.push(c);
    childrenByParent.set(c.parentId, arr);
  }

  const top = categories.filter((c) => !c.parentId).slice().sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Категории</h1>
      <p className="mt-2 max-w-prose text-sm text-slate-600">
        Выберите категорию — откроется каталог продуктов с фильтром по выбранной категории.
      </p>

      <div className="mt-8 grid gap-6">
        {top.map((c) => {
          const children = (childrenByParent.get(c.id) ?? []).slice().sort((a, b) => a.name.localeCompare(b.name));
          const first4 = children.slice(0, 4);
          const restCount = Math.max(0, children.length - 4);
          return (
            <div key={c.id} className="card-interactive group flex flex-col p-0 overflow-hidden">
              <div className="grid gap-0 sm:grid-cols-[300px_1fr] sm:items-stretch">
                <div className="relative h-48 w-full overflow-hidden sm:h-auto sm:w-[300px]">
                  {resolveImageUrl(c.coverImageUrl) ? (
                    <Image
                      alt={c.name}
                      src={resolveImageUrl(c.coverImageUrl)!}
                      fill
                      sizes="(max-width: 640px) 100vw, 300px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400" />
                  )}
                </div>

                <div className="min-w-0 p-6 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-slate-900">{c.name}</h2>
                    <Link
                      href={`/categories/${encodeURIComponent(c.slug)}`}
                      className="shrink-0 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
                    >
                      Смотреть ещё →
                    </Link>
                  </div>

                  {first4.length > 0 ? (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {first4.map((ch) => (
                        <Link
                          key={ch.id}
                          href={`/categories/${encodeURIComponent(ch.slug)}`}
                          className="rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-slate-300 hover:bg-slate-100"
                        >
                          <div className="text-sm font-semibold text-slate-900">{ch.name}</div>
                          <div className="mt-1 text-xs text-slate-600">Смотреть ещё →</div>
                        </Link>
                      ))}
                      {restCount > 0 ? (
                        <Link
                          href={`/categories/${encodeURIComponent(c.slug)}`}
                          className="rounded-xl border border-dashed border-slate-300 bg-white p-3 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                          <div className="text-sm font-semibold text-slate-900">Ещё {restCount}</div>
                          <div className="mt-1 text-xs text-slate-600">Посмотреть все →</div>
                        </Link>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        {top.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600">
            Категорий пока нет.
          </div>
        ) : null}
      </div>
    </div>
  );
}

