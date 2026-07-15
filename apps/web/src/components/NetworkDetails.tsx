import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";

// Детальные блоки страницы «СКС и ЛВС»: типовые конфигурации с кнопкой КП,
// этапы работ и перелинковка на сетевые бренды каталога. Контент — в
// messages → services.network.details (5 локалей).
const NET_BRANDS: { slug: string; name: string }[] = [
  { slug: "mikrotik", name: "MikroTik" },
  { slug: "tplink", name: "TP-Link" },
  { slug: "ruijie", name: "Ruijie" },
  { slug: "snr", name: "SNR" },
  { slug: "ubiquiti", name: "Ubiquiti" },
  { slug: "witek", name: "Wi-Tek" },
];

type Pkg = { name: string; for: string; items: string[]; term: string };
type Stage = { t: string; s?: string };

export async function NetworkDetails() {
  const ts = await getTranslations("services");
  const tp = await getTranslations("solutionsPage");
  const packages = ts.raw("network.details.packages") as Pkg[];
  const stages = ts.raw("network.details.stages") as Stage[];

  return (
    <>
      {/* Типовые решения */}
      <div className="mt-12">
        <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts("network.details.pkgLabel")}</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts("network.details.pkgTitle")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ts("network.details.pkgNote")}</p>
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
                <RequestQuoteButton label={tp("getQuote")} variant="brand" productName={`Заявка: СКС — ${p.name}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Этапы работ */}
      <div className="mt-12">
        <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts("network.details.stagesLabel")}</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts("network.details.stagesTitle")}</h2>
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

      {/* Бренды каталога */}
      <div className="mt-12">
        <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts("network.details.brandsLabel")}</p>
        <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts("network.details.brandsTitle")}</h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ts("network.details.brandsText")}</p>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {NET_BRANDS.map((b) => (
            <Link
              key={b.slug}
              href={`/catalog/${b.slug}`}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-500 hover:text-brand-700"
            >
              {b.name} →
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
