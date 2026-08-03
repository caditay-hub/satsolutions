import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { getIndustryDetails, INDUSTRY_SERVICES, industriesForService } from "@/lib/industryDetails";

/**
 * Инженерный контент отраслевой страницы: специфика объекта, ход проекта,
 * сложности и решения, FAQ (+FAQPage JSON-LD — расширенный сниппет в Google).
 * Плюс перелинковка: отрасль → профильные услуги.
 */
export async function IndustryDetailsBlock({ locale, industryKey }: { locale: string; industryKey: string }) {
  const d = getIndustryDetails(locale, industryKey);
  const ts = await getTranslations({ locale, namespace: "services" });
  const services = INDUSTRY_SERVICES[industryKey] ?? [];
  if (!d && !services.length) return null;

  const faodJson = d?.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: d.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  const cardGrid = (items: { title: string; text: string }[], accent: string) => (
    <div className="mt-5 grid gap-4 md:grid-cols-3">
      {items.map((it) => (
        <div key={it.title} className={`rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm border-t-2 ${accent}`}>
          <div className="text-sm font-black text-slate-900">{it.title}</div>
          <p className="mt-2 text-[13.5px] leading-relaxed text-slate-600">{it.text}</p>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {d && (
        <section className="mt-14">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{d.specificsTitle}</h2>
          {cardGrid(d.specifics, "border-brand-500")}

          <h2 className="mt-12 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{d.workflowTitle}</h2>
          <ol className="mt-5 grid gap-4 md:grid-cols-2">
            {d.workflow.map((it, i) => (
              <li key={it.title} className="flex gap-4 rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-sm font-black text-white">{i + 1}</span>
                <div>
                  <div className="text-sm font-black text-slate-900">{it.title}</div>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-slate-600">{it.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <h2 className="mt-12 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{d.pitfallsTitle}</h2>
          {cardGrid(d.pitfalls, "border-amber-400")}
        </section>
      )}

      {d?.faq?.length ? (
        <section className="mt-14">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">FAQ</h2>
          <div className="mt-5 space-y-3">
            {d.faq.map((f) => (
              <details key={f.q} className="group rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-sm font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="text-brand-600 transition-transform group-open:rotate-45 text-lg leading-none">+</span>
                </summary>
                <p className="px-5 pb-4 text-[13.5px] leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          {faodJson && (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faodJson) }} />
          )}
        </section>
      ) : null}

      {services.length > 0 && (
        <section className="mt-12">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">SAT Solutions</p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">Профильные услуги для этой отрасли</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {services.map((k) => (
              <Link key={k} href={`/solutions/${k}`}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700">
                {ts(`${k}.title`)} →
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

/** Обратная перелинковка: на странице услуги — отрасли, где она применяется. */
export async function ServiceIndustriesBlock({ locale, serviceKey }: { locale: string; serviceKey: string }) {
  const industries = industriesForService(serviceKey);
  if (!industries.length) return null;
  const ts = await getTranslations({ locale, namespace: "services" });
  return (
    <section className="mt-12">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">SAT Solutions</p>
      <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">Решения для отраслей</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {industries.map((k) => (
          <Link key={k} href={`/solutions/${k}`}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700">
            {ts(`${k}.title`)} →
          </Link>
        ))}
      </div>
    </section>
  );
}
