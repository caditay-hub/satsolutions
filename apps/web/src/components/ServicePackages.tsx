import { getTranslations } from "next-intl/server";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { INDUSTRY_SERVICES } from "@/lib/industryDetails";

// Универсальный блок «Типовые решения» для страниц услуг: рендерится, если в
// messages есть services.<k>.details.packages (name/for/items/term + кнопка КП).
// У network/server свои расширенные блоки — этот для остальных услуг.
type Pkg = { name: string; for: string; items: string[]; term: string };

export async function ServicePackages({ k }: { k: string }) {
  const ts = await getTranslations("services");
  const tp = await getTranslations("solutionsPage");
  let packages: Pkg[] = [];
  try {
    const raw = ts.raw(`${k}.details.packages`) as Pkg[];
    if (Array.isArray(raw)) packages = raw.filter((p) => p?.name && Array.isArray(p.items));
  } catch { /* пакетов нет — блок не показываем */ }
  if (!packages.length) return null;
  // У отраслей шаги живут в IndustryDetailsBlock («Как ведём проект») —
  // stages здесь не заполняются намеренно, зонд дал бы лишь шум MISSING_MESSAGE в логах.
  const isIndustry = k in INDUSTRY_SERVICES;
  let stages: { t: string; s?: string }[] = [];
  if (!isIndustry) {
    try {
      const raw = ts.raw(`${k}.details.stages`) as { t: string; s?: string }[];
      if (Array.isArray(raw)) stages = raw.filter((st) => st?.t);
    } catch { /* этапов нет */ }
  }
  let brandsText = "";
  try {
    const raw = ts.raw(`${k}.details.brandsText`);
    if (typeof raw === "string") brandsText = raw;
  } catch { /* брендов нет */ }

  return (
    <div className="mt-12">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts(`${k}.details.pkgLabel`)}</p>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts(`${k}.details.pkgTitle`)}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ts(`${k}.details.pkgNote`)}</p>
      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        {packages.map((p) => (
          <div key={p.name} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md">
            <h3 className="text-base font-black leading-snug text-slate-900">{p.name}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">{p.for}</p>
            <ul className="mt-4 flex-1 space-y-2.5">
              {p.items.map((it) => (
                <li key={it} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <span className="text-sm leading-snug text-slate-700">{it}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs font-bold uppercase tracking-wide text-slate-400">{p.term}</p>
            <div className="mt-3">
              <RequestQuoteButton label={tp("getQuote")} variant="brand" productName={`Заявка: ${ts(`${k}.title`)} — ${p.name}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Этапы работы — рендерятся, если у услуги есть details.stages (как у network) */}
      {stages.length > 0 && (
        <div className="mt-12">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts(`${k}.details.stagesLabel`)}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts(`${k}.details.stagesTitle`)}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map((st, i) => (
              <div key={st.t} className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-black text-white">{i + 1}</span>
                <p className="mt-3 text-sm font-black text-slate-900">{st.t}</p>
                {st.s ? <p className="mt-1 text-xs leading-snug text-slate-500">{st.s}</p> : null}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Бренды: текстовая подводка к каталогу, если задана */}
      {brandsText ? (
        <div className="mt-12">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts(`${k}.details.brandsLabel`)}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts(`${k}.details.brandsTitle`)}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{brandsText}</p>
        </div>
      ) : null}
    </div>
  );
}
