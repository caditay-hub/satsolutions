import { parseRichDescription } from "@/lib/richDescription";

const LIST_SECTIONS = /преимущ|сфер|применен|комплект|особен|возможност/i;

/**
 * Рендер структурированного описания товара: вводный текст, секции-списки,
 * FAQ-аккордеон (нативные <details> — работает без JS, контент в DOM для SEO).
 */
export function RichDescription({ text }: { text: string | null | undefined }) {
  const data = parseRichDescription(text);
  if (!text || !text.trim()) return null;

  // Старые (неструктурированные) описания — отдаём как раньше.
  if (!data.isStructured) {
    return (
      <div className="prose prose-sm prose-slate mt-4 max-w-none">
        <p className="whitespace-pre-line">{text}</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-6">
      {data.overview && (
        <div className="prose prose-sm prose-slate max-w-none">
          {data.overview.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}

      {data.sections.map((s, i) => {
        const asList = s.isList || LIST_SECTIONS.test(s.title);
        return (
          <section key={i}>
            <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
            {asList ? (
              <ul className="mt-2 space-y-1.5">
                {s.items.map((it, j) => (
                  <li key={j} className="flex gap-2 text-sm text-slate-700">
                    <span className="mt-0.5 shrink-0 text-brand-600" aria-hidden>
                      ✓
                    </span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="prose prose-sm prose-slate mt-2 max-w-none">
                {s.items.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {data.faq.length > 0 && (
        <section>
          <h3 className="text-base font-bold text-slate-900">Частые вопросы</h3>
          <div className="mt-2 divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-200">
            {data.faq.map((f, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-50">
                  <span>{f.q}</span>
                  <svg
                    className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-3 pb-3 text-sm leading-relaxed text-slate-600">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
