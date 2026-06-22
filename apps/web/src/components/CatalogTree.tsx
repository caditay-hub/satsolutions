import { Link } from "@/i18n/navigation";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { typeSlug } from "@/lib/typeSlug";

// Дерево каталога в стиле NAG: 12 групп → типы. Текущий тип подсвечен,
// его группа раскрыта. Все ссылки в DOM (details) — для краулинга.
export function CatalogTree({ currentType }: { currentType?: string }) {
  return (
    <nav className="rounded-xl border border-slate-200 bg-white text-sm">
      <div className="border-b border-slate-100 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-500">
        Каталог
      </div>
      <div className="max-h-[60vh] overflow-y-auto py-1">
        {CATALOG_GROUPS.map((g) => {
          const has = g.types.some((t) => t.n === currentType);
          return (
            <details key={g.title} open={has} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-1.5 font-semibold text-slate-800 hover:bg-slate-50 [&::-webkit-details-marker]:hidden">
                <span className="truncate">{g.title}</span>
                <svg className="h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform group-open:rotate-90" viewBox="0 0 12 12" fill="none">
                  <path d="M4 2.5l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </summary>
              <ul className="pb-1">
                {g.types.map((t) => {
                  const on = t.n === currentType;
                  return (
                    <li key={t.n}>
                      <Link
                        href={`/products/type/${typeSlug(t.n)}`}
                        className={`flex items-center justify-between gap-2 py-1 pl-5 pr-3 ${
                          on ? "font-bold text-brand-700" : "text-slate-600 hover:text-brand-700"
                        }`}
                      >
                        <span className="truncate">{t.n}</span>
                        <span className="shrink-0 text-[11px] text-slate-400">{t.c}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </details>
          );
        })}
      </div>
    </nav>
  );
}
