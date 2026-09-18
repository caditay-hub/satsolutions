// Хаб собственных приложений SAT: SAT Uy (жителям ЖК и УК) и SAT Davomat (учёт рабочего времени).
// Контент — lib/appsContent.ts (5 локалей). SEO: ItemList приложений + FAQPage, hreflang, ссылки на страницы продуктов.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { CRUMBS, HUB } from "@/lib/appsContent";

const pick = (locale: string) => HUB[locale] ?? HUB.ru;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: d.metaDesc,
    alternates: hreflangAlternates("/apps", locale),
    openGraph: { title: d.metaTitle, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function AppsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = pick(locale);
  const crumbs = CRUMBS[locale] ?? CRUMBS.ru;
  const site = `https://satsolutions.uz${locale === "ru" ? "" : `/${locale}`}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ItemList",
        name: d.h1,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: d.uy.title, description: d.uy.tagline, url: "https://satsolutions.uz/apps/uy" },
          { "@type": "ListItem", position: 2, name: d.davomat.title, description: d.davomat.tagline, url: "https://satsolutions.uz/apps/davomat" },
        ],
      },
      { "@type": "FAQPage", mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumbs.home, item: `${site}/` },
          { "@type": "ListItem", position: 2, name: crumbs.apps },
        ],
      },
    ],
  };

  const cards = [
    { ...d.uy, href: "/apps/uy" as const },
    { ...d.davomat, href: "/apps/davomat" as const },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600">{crumbs.home}</Link>
        <span>/</span>
        <span className="text-slate-700">{crumbs.apps}</span>
      </nav>

      <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">{d.h1}</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">{d.intro}</p>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.cardsTitle}</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
            <div className="text-xl font-bold text-slate-900">{c.title}</div>
            <div className="mt-1 text-sm text-brand-700 font-semibold">{c.tagline}</div>
            <ul className="mt-4 space-y-2 text-sm text-slate-600 leading-relaxed">
              {c.bullets.map((b) => (
                <li key={b} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href={c.href}
              className="mt-6 inline-flex w-fit items-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800"
            >
              {c.link}
            </Link>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.whyTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-3 gap-5">
        {d.why.map((w) => (
          <div key={w.t} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="font-semibold text-slate-900">{w.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{w.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.faqTitle}</h2>
      <div className="mt-6 space-y-4">
        {d.faq.map((f) => (
          <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="font-medium text-slate-900 cursor-pointer">{f.q}</summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-50 border border-brand-100 p-6 sm:p-8">
        <div className="text-xl font-bold text-slate-900">{d.ctaTitle}</div>
        <p className="mt-3 text-slate-600 leading-relaxed">{d.ctaText}</p>
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
        >
          {d.ctaButton}
        </Link>
      </div>
    </div>
  );
}
