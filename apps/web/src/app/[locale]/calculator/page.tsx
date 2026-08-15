import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CostCalculator } from "@/components/CostCalculator";
import { FaqAccordion } from "@/components/FaqAccordion";
import { hreflangAlternates } from "@/lib/hreflang";
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
