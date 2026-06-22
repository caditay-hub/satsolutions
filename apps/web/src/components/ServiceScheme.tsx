import { Fragment } from "react";
import { getTranslations } from "next-intl/server";

type Step = { t: string; s?: string };

// Список услуг, у которых есть схема «как работает система».
// Сами шаги (с переводами) лежат в messages → namespace "scheme".
const SCHEME_KEYS = new Set([
  "cctv", "analytics", "anpr", "access", "intercom", "attendance",
  "alarm", "fire", "network", "server", "videowall", "pa", "barrier", "perimeter"
]);

export async function ServiceScheme({ k }: { k: string }) {
  if (!SCHEME_KEYS.has(k)) return null;
  const ts = await getTranslations("scheme");
  const tp = await getTranslations("solutionsPage");
  const steps = ts.raw(k) as Step[];
  if (!Array.isArray(steps) || steps.length === 0) return null;
  return (
    <div className="mt-12">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{tp("scheme")}</p>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{tp("schemeTitle")}</h2>
      <div className="mt-5 flex flex-col rounded-2xl border border-slate-100 bg-slate-50/60 p-5 md:flex-row md:items-center md:p-6">
        {steps.map((st, i) => (
          <Fragment key={st.t}>
            {i > 0 && (
              <div className="relative mx-auto h-8 w-px bg-slate-300 md:mx-0 md:h-px md:min-w-6 md:flex-1">
                <span className="scheme-dot-v md:hidden" style={{ animationDelay: `${i * 0.45}s` }} />
                <span className="scheme-dot hidden md:block" style={{ animationDelay: `${i * 0.45}s` }} />
              </div>
            )}
            <div className="relative z-10 flex shrink-0 items-center gap-3 rounded-xl border-2 border-slate-200 bg-white px-4 py-3 md:max-w-[200px] md:flex-col md:gap-2 md:px-5 md:py-4 md:text-center">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">
                {i + 1}
              </span>
              <span>
                <span className="block text-sm font-black leading-snug text-slate-900">{st.t}</span>
                {st.s ? <span className="mt-0.5 block text-xs font-semibold text-slate-500">{st.s}</span> : null}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
