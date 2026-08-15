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

        <header className="mt-4 max-w-3xl">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">{t("h1")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{t("lead")}</p>
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
