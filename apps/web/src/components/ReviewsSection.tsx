// Презентационная секция отзывов (дизайн). Данные приходят пропсами —
// на прод пойдёт ТОЛЬКО с реальными отзывами клиентов. Review-схема (JSON-LD)
// добавляется отдельно и тоже только для настоящих отзывов.

export type Review = {
  name: string;
  role?: string;
  rating: number;   // 1..5
  date: string;     // «Июнь 2026»
  text: string;
};

function Stars({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span className={`inline-flex ${className}`} aria-label={`${n} из 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i <= n ? "text-amber-400" : "text-slate-200"}`} fill="currentColor">
          <path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" />
        </svg>
      ))}
    </span>
  );
}

export function ReviewsSection({ title, avg, count, items }: { title: string; avg: number; count: number; items: Review[] }) {
  return (
    <section className="bg-slate-50/70">
      <div className="container-page py-12 sm:py-16">
        {/* Заголовок + агрегат */}
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">{title}</h2>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3">
            <span className="text-4xl font-black tabular-nums text-slate-900">{avg.toFixed(1)}</span>
            <span className="flex flex-col">
              <Stars n={Math.round(avg)} />
              <span className="mt-0.5 text-xs font-semibold text-slate-500">на основе {count} отзывов</span>
            </span>
          </div>
        </div>

        {/* Карточки отзывов */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <figure key={i} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-100 text-base font-black text-brand-700">
                  {r.name.trim().charAt(0)}
                </span>
                <figcaption className="min-w-0">
                  <div className="truncate text-sm font-black text-slate-900">{r.name}</div>
                  {r.role && <div className="truncate text-xs font-semibold text-slate-500">{r.role}</div>}
                </figcaption>
              </div>
              <Stars n={r.rating} className="mt-3" />
              <blockquote className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{r.text}</blockquote>
              <div className="mt-3 text-xs font-semibold text-slate-400">{r.date}</div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
