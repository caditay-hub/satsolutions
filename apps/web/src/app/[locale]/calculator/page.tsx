import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CostCalculator } from "@/components/CostCalculator";
import { FaqAccordion } from "@/components/FaqAccordion";
import { hreflangAlternates } from "@/lib/hreflang";
import { PRICE } from "@/lib/calcPricing";
import { ogLocale } from "@/lib/ogLocale";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tm = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: tm("calcTitle") },
    description: tm("calcDesc"),
    alternates: hreflangAlternates("/calculator", locale),
    openGraph: { title: tm("calcTitle"), description: tm("calcDesc"), locale: ogLocale(locale), images: ["/og.png"] },
  };
}

// Услуги, на которые уводим с калькулятора: посчитал — почитал подробности.
// Перелинковка нужна и посетителю, и обходу: страница новая, ссылок на неё мало.
const RELATED = ["cctv", "access", "fire", "network", "intercom", "perimeter"] as const;

export default async function CalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "calc" });
  const tn = await getTranslations({ locale, namespace: "nav" });
  const ts = await getTranslations({ locale, namespace: "services" });

  const incl = t.raw("incl") as string[];
  const dep = t.raw("dep") as string[];
  const faq = t.raw("faq") as { q: string; a: string }[];
  const cases = t.raw("cases") as { name: string; spec: string; sum: string }[];

  // Расценки в тексте берём из того же прайса, что и калькулятор: расходятся
  // цифры на странице и в виджете — доверие к обеим сразу теряется.
  const fmt = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
  const rateRows: { label: string; value: number; unit: string }[] = [
    { label: t("rate.camIn"), value: PRICE.camIn, unit: t("unit.pc") },
    { label: t("rate.camOut"), value: PRICE.camOut, unit: t("unit.pc") },
    { label: t("rate.camPtz"), value: PRICE.camPtz, unit: t("unit.pc") },
    { label: t("rate.reader"), value: PRICE.reader, unit: t("unit.pc") },
    { label: t("rate.bio"), value: PRICE.bio, unit: t("unit.pc") },
    { label: t("rate.monitor"), value: PRICE.monitor, unit: t("unit.pc") },
    { label: t("rate.smoke"), value: PRICE.smoke, unit: t("unit.pc") },
    { label: t("rate.outlet"), value: PRICE.outlet + PRICE.patchPort, unit: t("unit.pc") },
    { label: t("rate.irBarrier"), value: PRICE.irBarrier, unit: t("unit.set") },
    { label: t("rate.cableOpen"), value: PRICE.cableOpen, unit: t("unit.m") },
    { label: t("rate.cableTray"), value: PRICE.cableTray, unit: t("unit.m") },
    { label: t("rate.fenceCable"), value: PRICE.fenceCable, unit: t("unit.m") },
  ];
  const rateValues = rateRows.map((r) => r.value);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  // Service с диапазоном цен: у страницы коммерческий интент («сколько стоит»),
  // и цена — то, что имеет смысл отдавать поиску явно.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t("h1"),
    serviceType: t("promoHead"),
    description: t("lead"),
    provider: { "@type": "Organization", name: "SAT Solutions", url: siteUrl, telephone: "+998-97-862-66-99" },
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    url: `${siteUrl}${lp}/calculator`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "UZS",
      lowPrice: Math.min(...rateValues),
      highPrice: Math.max(...rateValues),
      offerCount: rateRows.length,
      availability: "https://schema.org/InStock",
    },
  };
  const appLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t("promoHead"),
    url: `${siteUrl}${lp}/calculator`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    inLanguage: locale,
    offers: { "@type": "Offer", price: 0, priceCurrency: "UZS" },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: tn("home"), item: `${siteUrl}${lp}/` },
      { "@type": "ListItem", position: 2, name: tn("services"), item: `${siteUrl}${lp}/solutions` },
      { "@type": "ListItem", position: 3, name: t("crumb") },
    ],
  };

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-12">
        <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-600">{tn("home")}</Link>
          <span>/</span>
          <Link href="/solutions" className="hover:text-brand-600">{tn("services")}</Link>
          <span>/</span>
          <span className="text-slate-700">{t("crumb")}</span>
        </nav>

        <header className="mt-4 grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{t("h1")}</h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t("lead")}</p>
          </div>

          {/* Шапка была пустой справа. Инфографика объясняет суть страницы без слов:
              план объекта с точками систем превращается в смету на калькуляторе. */}
          <svg viewBox="0 0 440 300" className="w-full max-w-[440px] justify-self-center" role="img" aria-label={t("promoHead")}>
            <defs>
              <linearGradient id="hero-bg" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#eaf6f8" />
                <stop offset="1" stopColor="#ffffff" />
              </linearGradient>
              <pattern id="hero-grid" width="22" height="22" patternUnits="userSpaceOnUse">
                <path d="M22 0H0V22" fill="none" stroke="#d6edf1" strokeWidth="1" />
              </pattern>
              <radialGradient id="hero-fov">
                <stop offset="0" stopColor="#328fa8" stopOpacity=".3" />
                <stop offset="1" stopColor="#328fa8" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="440" height="300" rx="24" fill="url(#hero-bg)" />
            <rect width="440" height="300" rx="24" fill="url(#hero-grid)" />

            {/* план объекта */}
            <g>
              <rect x="34" y="52" width="196" height="150" rx="6" fill="#fff" fillOpacity=".85" stroke="#475569" strokeWidth="2.5" />
              {/* сектора обзора и камеры */}
              <path d="M74 66 l27.56 44.1 A52 52 0 0 1 46.44 110.1 Z" fill="url(#hero-fov)" />
              <path d="M190 66 l27.56 44.1 A52 52 0 0 1 162.44 110.1 Z" fill="url(#hero-fov)" />
              <path d="M74 188 l-27.56 -44.1 A52 52 0 0 1 101.56 143.9 Z" fill="url(#hero-fov)" />
              <circle cx="74" cy="66" r="5.5" fill="#7fb9c8" stroke="#fff" strokeWidth="1.8" />
              <circle cx="190" cy="66" r="5.5" fill="#328fa8" stroke="#fff" strokeWidth="1.8" />
              <circle cx="74" cy="188" r="5.5" fill="#328fa8" stroke="#fff" strokeWidth="1.8" />
              {/* дверь СКУД */}
              <g transform="translate(150 202) rotate(180)">
                <line x1="-14" y1="0" x2="14" y2="0" stroke="#fff" strokeWidth="7" />
                <path d="M-13 20 Q13 20 13 0" fill="none" stroke="#6366f1" strokeWidth="1.2" opacity=".55" strokeDasharray="3 3" />
                <line x1="-13" y1="0" x2="-13" y2="20" stroke="#6366f1" strokeWidth="3.2" strokeLinecap="round" />
                <rect x="14" y="-4.5" width="8.5" height="12" rx="2.5" fill="#6366f1" />
              </g>
              {/* извещатель и Wi-Fi */}
              <circle cx="132" cy="104" r="4.6" fill="#fff" />
              <circle cx="132" cy="104" r="4.6" fill="none" stroke="#dc2626" strokeWidth="1.6" strokeDasharray="2.2 2" />
              <g transform="translate(132 148)">
                <path d="M-7 2a10 10 0 0 1 14 0M-4 5a6 6 0 0 1 8 0" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" />
                <circle cy="8" r="1.9" fill="#059669" />
              </g>
              <text x="132" y="222" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="ui-monospace,Menlo,monospace">200 м²</text>
            </g>

            {/* стрелка: план → смета */}
            <path d="M238 128 H274" stroke="#328fa8" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />
            <path d="M270 122 l7 6 -7 6" fill="none" stroke="#328fa8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* калькулятор */}
            <g>
              <rect x="288" y="44" width="118" height="212" rx="16" fill="#fff" stroke="#328fa8" strokeWidth="2.5" />
              <rect x="302" y="60" width="90" height="46" rx="8" fill="#eaf6f8" stroke="#addbe3" />
              <text x="382" y="80" textAnchor="end" fontSize="11" fill="#94a3b8" fontFamily="ui-monospace,Menlo,monospace">итого</text>
              <text x="382" y="98" textAnchor="end" fontSize="16" fontWeight="700" fill="#2a7b90" fontFamily="ui-monospace,Menlo,monospace">5 324 300</text>
              {[122, 156, 190, 224].map((y) =>
                [302, 332, 362].map((x) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="24" height="24" rx="6"
                    fill={x === 362 && y === 224 ? "#e02020" : "#eef2f6"} />
                ))
              )}
              <path d="M368 233h12M368 240h12" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
            </g>
          </svg>
        </header>

        <div className="mt-8">
          <CostCalculator />
        </div>

        {/* ── готовые расчёты: под запросы «сколько стоит … для магазина/дома» ── */}
        <section className="mt-12">
          <h2 className="text-lg font-black text-slate-900 sm:text-xl">{t("casesTitle")}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{t("casesNote")}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {cases.map((c, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-sm font-black text-slate-900">{c.name}</div>
                <div className="mt-1 text-[13px] leading-relaxed text-slate-500">{c.spec}</div>
                <div className="mt-2 text-base font-black tabular-nums text-brand-700">
                  {c.sum} <span className="text-xs font-bold text-slate-400">{t("sum")}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── прайс списком: под «цена за точку», «цена за метр» ── */}
        <section className="mt-12">
          <h2 className="text-lg font-black text-slate-900 sm:text-xl">{t("tableTitle")}</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-4 font-bold">{t("colWork")}</th>
                  <th className="py-2 text-right font-bold">{t("colPrice")}</th>
                </tr>
              </thead>
              <tbody>
                {rateRows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0">
                    <td className="py-2.5 pr-4 text-slate-700">{r.label}</td>
                    <td className="whitespace-nowrap py-2.5 text-right font-semibold tabular-nums text-slate-900">
                      <span className="mr-1 text-[11px] font-normal text-slate-400">{t("from")}</span>
                      {fmt(r.value)} <span className="text-[11px] font-normal text-slate-400">{r.unit}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-3xl text-[13px] leading-relaxed text-slate-500">{t("tableNote")}</p>
        </section>

        {/* ── текстовая часть: она и объясняет цену, и даёт странице содержание ── */}
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="text-lg font-black text-slate-900">{t("inclTitle")}</h2>
            <ul className="mt-3 space-y-2.5">
              {incl.map((x, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                  {x}
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-black text-slate-900">{t("depTitle")}</h2>
            <ul className="mt-3 space-y-2.5">
              {dep.map((x, i) => (
                <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                  {x}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mt-12">
          <h2 className="text-lg font-black text-slate-900">{t("faqTitle")}</h2>
          <div className="mt-4">
            <FaqAccordion items={faq} />
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-lg font-black text-slate-900">{tn("services")}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {RELATED.map((k) => (
              <Link key={k} href={`/solutions/${k}`}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700">
                {ts(`${k}.title`)} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
