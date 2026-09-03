import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getIndustryDetails, INDUSTRY_SERVICES, industriesForService } from "@/lib/industryDetails";
import { ProjectCalcForm } from "@/components/ProjectCalcForm";

/** Реальные проекты портфолио по отраслям (только существующие карточки, без выдуманных цифр). */
const INDUSTRY_CASES: Record<string, Array<{ slug: string; title: string }>> = {
  warehouse: [{ slug: "uzum-videonablyudenie-skladov-i-punktov-vydachi", title: "Uzum — видеонаблюдение складов и пунктов выдачи" }],
  retail: [{ slug: "uzum-videonablyudenie-skladov-i-punktov-vydachi", title: "Uzum — видеонаблюдение складов и пунктов выдачи" }],
  industry: [
    { slug: "skud-zavod-damira-beverages", title: "СКУД и видеонаблюдение на заводе Damira Beverages" },
    { slug: "montazh-servernoy-komnaty", title: "Монтаж серверной комнаты" },
  ],
  residential: [{ slug: "zhk-tower-up-intellektualnaya-sistema-bezopasnosti-i-videomonitoringa", title: "ЖК Tower Up — интеллектуальная система безопасности" }],
  bank: [{ slug: "virtualizaciya-h3c-cas-finansovaya-organizaciya", title: "Виртуализация на серверах H3C для финансовой организации" }],
  city: [{ slug: "ucell-ustanovka-videosteny-dahua-v-situacionnom-centre", title: "Ucell — видеостена Dahua в ситуационном центре" }],
};

/**
 * Инженерный контент отраслевой страницы — «журнальный ритм» (вариант А, 03.08.2026):
 * полноширинные секции с чередованием фона (белый → серый → тёмный → белый),
 * специфика в связке с фото, этапы единой линией, сложности на тёмном.
 * FAQ — узкой колонкой (+FAQPage JSON-LD — расширенный сниппет в Google).
 * Плюс перелинковка: отрасль → профильные услуги.
 */
const IMG_BASE = "https://api.satsolutions.uz/uploads/services-page";

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="text-sm font-black text-brand-600">{n}</span>
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}

function WarnIcon() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4 2.8 20h18.4L12 4z" />
      <path strokeLinecap="round" d="M12 10v4.2M12 17.3v.2" />
    </svg>
  );
}

export async function IndustryDetailsBlock({ locale, industryKey }: { locale: string; industryKey: string }) {
  const d = getIndustryDetails(locale, industryKey);
  const ts = await getTranslations({ locale, namespace: "services" });
  const tc = await getTranslations({ locale, namespace: "common" });
  const services = INDUSTRY_SERVICES[industryKey] ?? [];
  if (!d && !services.length) return null;

  const faqJson = d?.faq?.length
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

  return (
    <>
      {d && (
        <>
          {/* 01 · Специфика объекта: текст в связке с фото (зигзаг) */}
          <section className="bg-white">
            <div className="container-page py-12 sm:py-16">
              <SectionHead n="01" title={d.specificsTitle} />
              <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12">
                <div>
                  {d.specifics.map((it) => (
                    <div key={it.title} className="border-b border-slate-200 py-4 first:pt-0 last:border-b-0 last:pb-0">
                      <div className="flex items-center gap-2.5 text-[15px] font-black text-slate-900">
                        <span className="h-2 w-2 shrink-0 rounded-[3px] bg-brand-500" aria-hidden />
                        {it.title}
                      </div>
                      <p className="mt-1.5 pl-[18px] text-sm leading-relaxed text-slate-600">{it.text}</p>
                    </div>
                  ))}
                </div>
                <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={`${IMG_BASE}/${industryKey}-1.jpg?v=11`}
                    alt={d.specificsTitle}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 02 · Как ведём проект: этапы единой линией */}
          <section className="bg-slate-50">
            <div className="container-page py-12 sm:py-16">
              <SectionHead n="02" title={d.workflowTitle} />
              <ol className="relative mt-9 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                <div aria-hidden className="absolute left-[8%] right-[8%] top-[22px] hidden h-0.5 bg-gradient-to-r from-brand-500 to-slate-300 lg:block" />
                {d.workflow.map((it, i) => (
                  <li key={it.title} className="relative">
                    <span className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-[15px] font-black text-white ring-[6px] ring-slate-50">
                      {i + 1}
                    </span>
                    <div className="mt-3 text-sm font-black text-slate-900">{it.title}</div>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{it.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* 03 · Сложности и решения: контрастная тёмная секция */}
          <section className="bg-gradient-to-br from-[#04202f] to-[#0a3550] text-white">
            <div className="container-page py-12 sm:py-16">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">{d.pitfallsTitle}</h2>
              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {d.pitfalls.map((it) => (
                  <div key={it.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2.5 text-sm font-black text-amber-300">
                      <WarnIcon />
                      {it.title}
                    </div>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-slate-300">{it.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 04 · FAQ узкой колонкой + профильные услуги */}
      {(d?.faq?.length || services.length > 0) ? (
        <section className="bg-white">
          <div className="container-page py-12 sm:py-16">
            {d?.faq?.length ? (
              <>
                <SectionHead n="03" title="FAQ" />
                <div className="mx-auto mt-4 max-w-3xl">
                  {d.faq.map((f) => (
                    <details key={f.q} className="group border-b border-slate-200">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[15px] font-bold text-slate-900 [&::-webkit-details-marker]:hidden">
                        {f.q}
                        <span className="text-lg leading-none text-brand-600 transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <p className="pb-4 text-sm leading-relaxed text-slate-600">{f.a}</p>
                    </details>
                  ))}
                </div>
                {faqJson && (
                  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
                )}
              </>
            ) : null}

            {services.length > 0 && (
              <div className={d?.faq?.length ? "mt-12" : ""}>
                <p className="text-xs font-black uppercase tracking-widest text-brand-600">SAT Solutions</p>
                <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">{tc("industryServices")}</h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {services.map((k) => (
                    <Link key={k} href={`/solutions/${k}`}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-500 hover:text-brand-700">
                      {ts(`${k}.title`)} →
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {(INDUSTRY_CASES[industryKey] ?? []).length > 0 && (
              <div className="mt-12">
                <p className="text-xs font-black uppercase tracking-widest text-brand-600">SAT Solutions</p>
                <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">{tc("industryCases")}</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {(INDUSTRY_CASES[industryKey] ?? []).map((c) => (
                    <Link key={c.slug} href={`/portfolio/${c.slug}`}
                      className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-500">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-brand-700">{c.title}</div>
                      <div className="mt-1 text-xs font-semibold text-brand-600">{tc("caseMore")} →</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* 05 · Инлайн-форма расчёта: дочитал страницу — форма уже перед глазами */}
      {d && <ProjectCalcForm serviceName={`Расчёт проекта: ${d.specificsTitle}`} />}
    </>
  );
}

/** Обратная перелинковка: на странице услуги — отрасли, где она применяется. */
export async function ServiceIndustriesBlock({ locale, serviceKey }: { locale: string; serviceKey: string }) {
  const industries = industriesForService(serviceKey);
  if (!industries.length) return null;
  const ts = await getTranslations({ locale, namespace: "services" });
  const tc = await getTranslations({ locale, namespace: "common" });
  return (
    <section className="mt-12">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">SAT Solutions</p>
      <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900">{tc("industrySolutions")}</h2>
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
