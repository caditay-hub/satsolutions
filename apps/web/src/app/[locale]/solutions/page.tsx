import { Link } from "@/i18n/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { Reveal } from "@/components/Reveal";
import { SERVICES, INDUSTRIES, ALL_SERVICES } from "@/lib/servicesData";
import { getTranslations } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const IMG_BASE = "https://api.satsolutions.uz/uploads/services-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tm = await getTranslations({ locale, namespace: "meta" });
  return { title: { absolute: tm("solTitle") }, description: tm("solDesc"), alternates: hreflangAlternates("/solutions", locale), openGraph: { title: tm("solTitle"), description: tm("solDesc"), locale: ogLocale(locale), images: ["/og.png"] } };
}

/* ─────────────  Inline icon set  ───────────── */
function Icon({ name }: { name: string }) {
  const common = {
    className: "w-7 h-7",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    viewBox: "0 0 24 24"
  };
  switch (name) {
    case "cctv":
      return (<svg {...common}><rect x="2.5" y="8" width="12" height="6" rx="1.5" /><path d="M14.5 9.5 21 7v10l-6.5-2.5" /><circle cx="6.5" cy="11" r="1.6" /></svg>);
    case "analytics":
      return (<svg {...common}><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2" /><circle cx="12" cy="12" r="3" /></svg>);
    case "anpr":
      return (<svg {...common}><path d="M5 11l1.5-4h11L19 11" /><rect x="3" y="11" width="18" height="6" rx="1.5" /><circle cx="7.5" cy="17" r="1.3" /><circle cx="16.5" cy="17" r="1.3" /><rect x="9" y="12.7" width="6" height="2.4" rx="0.5" /></svg>);
    case "access":
      return (<svg {...common}><rect x="4" y="4" width="12" height="16" rx="2" /><path d="M7 8h6M7 11h6" /><circle cx="10" cy="16" r="1.6" /></svg>);
    case "intercom":
      return (<svg {...common}><rect x="6" y="3" width="12" height="18" rx="2" /><circle cx="12" cy="8" r="2.4" /><path d="M9 14h6M9 17h6" /></svg>);
    case "attendance":
      return (<svg {...common}><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>);
    case "alarm":
      return (<svg {...common}><path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" /></svg>);
    case "fire":
      return (<svg {...common}><path d="M12 3c2 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.6.6-2.7 1.6-3.7C10 8 11 6 12 3z" /></svg>);
    case "network":
      return (<svg {...common}><circle cx="5" cy="6" r="2" /><circle cx="5" cy="18" r="2" /><circle cx="19" cy="12" r="2" /><path d="M7 6h6a2 2 0 0 1 2 2v2M7 18h6a2 2 0 0 0 2-2v-2" /></svg>);
    case "server":
      return (<svg {...common}><rect x="4" y="3" width="16" height="7" rx="1.5" /><rect x="4" y="14" width="16" height="7" rx="1.5" /><path d="M7 6.5h.01M7 17.5h.01" /></svg>);
    case "videowall":
      return (<svg {...common}><rect x="3" y="4" width="18" height="12" rx="1.5" /><path d="M12 4v12M3 10h18" /><path d="M10 20h4M12 16v4" /></svg>);
    case "pa":
      return (<svg {...common}><path d="M4 9v6h4l5 4V5L8 9z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 7a7 7 0 0 1 0 10" /></svg>);
    case "barrier":
      return (<svg {...common}><rect x="3" y="13" width="4" height="7" rx="1" /><path d="M7 14l13-3.2" /><path d="M5 13V7" /></svg>);
    case "perimeter":
      return (<svg {...common}><path d="M6 4v16M12 4v16M18 4v16" /><path d="M3 9h18M3 15h18" /></svg>);
    case "bus":
      return (<svg {...common}><rect x="3" y="5" width="18" height="11" rx="2" /><path d="M3 11h18" /><circle cx="7.5" cy="18" r="1.6" /><circle cx="16.5" cy="18" r="1.6" /><path d="M6 8h4" /></svg>);
    case "city":
      return (<svg {...common}><rect x="3" y="9" width="6" height="11" /><rect x="11" y="4" width="6" height="16" /><path d="M5 12h2M5 15h2M13 7h2M13 11h2M13 15h2" /></svg>);
    case "parking":
      return (<svg {...common}><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M9 17V8h3.5a3 3 0 0 1 0 6H9" /></svg>);
    case "retail":
      return (<svg {...common}><circle cx="9" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /><path d="M3 4h2l2.4 12h10l2-8H6" /></svg>);
    case "bank":
      return (<svg {...common}><path d="M3 9l9-5 9 5" /><path d="M5 9v8M9 9v8M15 9v8M19 9v8" /><path d="M3 20h18" /></svg>);
    case "school":
      return (<svg {...common}><path d="M12 4 2 9l10 5 10-5z" /><path d="M6 11v5c0 1 2.5 3 6 3s6-2 6-3v-5" /></svg>);
    case "industry":
      return (<svg {...common}><path d="M3 21V10l6 4V10l6 4V7l6 3v11z" /><path d="M3 21h18" /></svg>);
    case "residential":
      return (<svg {...common}><path d="M4 11 12 4l8 7" /><path d="M6 10v10h12V10" /><rect x="10" y="14" width="4" height="6" /></svg>);
    default:
      return (<svg {...common}><circle cx="12" cy="12" r="9" /></svg>);
  }
}

/* card with photo cover + icon badge — links to the service detail page */
function SolutionCard({ k, title, desc, more }: { k: string; title: string; desc: string; more: string }) {
  return (
    <Link
      href={`/solutions/${k}`}
      className="group flex flex-col overflow-hidden rounded-2xl border-2 border-slate-100 bg-white transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Image
          src={`${IMG_BASE}/${k}.jpg?v=9`}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/35 to-transparent" />
        <div className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/90 text-brand-700 shadow-sm backdrop-blur-sm">
          <span className="[&>svg]:h-[18px] [&>svg]:w-[18px]"><Icon name={k} /></span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-black leading-snug text-slate-900 group-hover:text-brand-700 transition-colors">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500">{desc}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-brand-700">
          {more}
          <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </span>
      </div>
    </Link>
  );
}

/* ─────────────  Page  ───────────── */
export default async function ServicesPage() {
  const t = await getTranslations("solutionsPage");
  const ts = await getTranslations("services");
  const tc = await getTranslations("common");
  const steps = t.raw("steps") as { title: string; desc: string }[];
  // JSON-LD: список всех решений/возможностей (ItemList)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("whatWeCan"),
    url: `${siteUrl}/solutions`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: ALL_SERVICES.map((svc, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: ts(`${svc.key}.title`),
        url: `${siteUrl}/solutions/${svc.key}`,
      })),
    },
  };
  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        <video
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-40 motion-reduce:hidden"
          src={`${IMG_BASE}/hero-bg.mp4?v=1`}
          poster={`${IMG_BASE}/hero-bg-poster.jpg?v=1`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/55 to-slate-900/25" />
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #328fa8 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #5cb8c7 0%, transparent 70%)" }}
        />
        <div className="container-page relative py-14 sm:py-20">
          <h1 className="text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl lg:whitespace-nowrap">
            <span dangerouslySetInnerHTML={{__html: t("hero")}} />
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">{t("heroSub")}</p>
        </div>
      </section>

      {/* SERVICES */}
      <section className="container-page py-12 sm:py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t("systemsLabel")}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("whatWeCan")}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.key} delay={(i % 4) * 90} className="h-full [&>a]:h-full">
              <SolutionCard k={s.key} title={ts(`${s.key}.title`)} desc={ts(`${s.key}.desc`)} more={tc("more")} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-y border-slate-100 bg-gradient-to-b from-slate-50 to-white">
        <div className="container-page py-12 sm:py-16">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t("industriesLabel")}</p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("industriesTitle")}</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((s, i) => (
              <Reveal key={s.key} delay={(i % 4) * 90} className="h-full [&>a]:h-full">
                <SolutionCard k={s.key} title={ts(`${s.key}.title`)} desc={ts(`${s.key}.desc`)} more={tc("more")} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="container-page py-12 sm:py-16">
        <div className="mb-8 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t("howLabel")}</p>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("howTitle")}</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 90} className="h-full [&>div]:h-full">
            <div className="relative rounded-2xl border-2 border-slate-100 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-black text-white">
                {i + 1}
              </div>
              <h3 className="mt-3 text-sm font-black leading-snug text-slate-900">{step.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">{step.desc}</p>
            </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="container-page flex flex-col items-center gap-5 py-14 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-brand-400">{t("ctaLabel")}</p>
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-black tracking-tight">{t("ctaTitle")}</h2>
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            {t("ctaText")}
          </p>
          <div className="flex justify-center">
            <RequestQuoteButton label={t("getQuote")} variant="brand" productName="Заявка со страницы «Услуги» (нижний блок)" />
          </div>
        </div>
      </section>
    </div>
  );
}
