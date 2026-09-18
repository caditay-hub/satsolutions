// Хаб собственных приложений SAT: SAT Uy (жителям ЖК и УК) и SAT Davomat (учёт рабочего времени).
// Контент — lib/appsContent.ts (5 локалей). SEO: ItemList приложений + FAQPage, hreflang, ссылки на страницы продуктов.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { BrandStrip, SiteScheme } from "@/components/AppBlocks";
import { HUB_EXTRAS } from "@/lib/appsExtrasContent";
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

  const hub = HUB_EXTRAS[locale] ?? HUB_EXTRAS.ru;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600">{crumbs.home}</Link>
        <span>/</span>
        <span className="text-slate-700">{crumbs.apps}</span>
      </nav>

      <section className="relative mt-3 overflow-hidden rounded-3xl bg-slate-900">
        <img src="/apps-img/apps-hero.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
        <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_auto]">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{d.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">{d.intro}</p>
          </div>
          <div className="flex gap-4">
            <img src="/apps-img/shots/shot-doors.jpg" alt="" aria-hidden className="w-40 rounded-2xl shadow-2xl sm:w-48" />
            <img src="/apps-img/shots/shot-now.jpg" alt="" aria-hidden className="hidden h-fit w-64 self-center rounded-2xl shadow-2xl sm:block" />
          </div>
        </div>
      </section>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.cardsTitle}</h2>
      <div className="mt-6 grid md:grid-cols-2 gap-5">
        {cards.map((c) => (
          <div key={c.title} className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col">
            <div className="mb-4 flex justify-center rounded-xl bg-gradient-to-b from-slate-50 to-white py-4">
              <img
                src={c.href === "/apps/uy" ? "/apps-img/shots/shot-guest.jpg" : "/apps-img/shots/shot-now.jpg"}
                alt=""
                aria-hidden
                loading="lazy"
                className={c.href === "/apps/uy" ? "h-44 w-auto rounded-xl" : "w-full rounded-xl"}
              />
            </div>
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

      <SiteScheme d={hub} />
      <BrandStrip d={hub} />

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
