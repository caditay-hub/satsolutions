import type { Faq } from "@/lib/servicesData";

// FAQ-аккордеон на нативных <details> (без JS, контент в DOM для SEO).
export function FaqAccordion({ items }: { items: Faq[] }) {
  if (!items?.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 divide-y divide-slate-100">
      {items.map((f, i) => (
        <details key={i} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm sm:text-base font-semibold text-slate-900 transition-colors hover:bg-slate-50">
            <span>{f.q}</span>
            <svg
              className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-4 pb-4 text-sm leading-relaxed text-slate-600">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
