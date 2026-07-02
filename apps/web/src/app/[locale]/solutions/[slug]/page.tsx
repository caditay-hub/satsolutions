import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServiceBySlug, getPortfolio } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { SolutionDetailsClient } from "@/components/SolutionDetailsClient";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { ServiceScheme } from "@/components/ServiceScheme";
import { Lightbox } from "@/components/Lightbox";
import { serviceByKey, SERVICE_FAQ } from "@/lib/servicesData";
import { FaqAccordion } from "@/components/FaqAccordion";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const IMG_BASE = "https://api.satsolutions.uz/uploads/services-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const svc = serviceByKey[slug];
  if (svc) {
    const ts = await getTranslations({ locale, namespace: "services" });
    const title = ts(`${svc.key}.title`);
    const intro = ts(`${svc.key}.intro`);
    return {
      title: { absolute: `${title} — SAT Solutions` },
      description: intro,
      alternates: hreflangAlternates(`/solutions/${svc.key}`, locale),
      openGraph: { title, description: intro, locale: ogLocale(locale), images: [{ url: `${IMG_BASE}/${svc.key}.jpg` }] }
    };
  }
  try {
    const { item } = await getServiceBySlug(slug);
    const solDesc = item.excerpt?.trim() || `${item.title} — решения по безопасности и слаботочным системам от SAT Solutions в Ташкенте и по Узбекистану.`;
    return { title: item.title, description: solDesc, alternates: hreflangAlternates(`/solutions/${item.slug}`, locale), openGraph: { title: item.title, description: solDesc, locale: ogLocale(locale) } };
  } catch {
    return { title: "Услуга" };
  }
}

export default async function SolutionDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const svc = serviceByKey[slug];
  const t = await getTranslations("solutionsPage");
  const ts = await getTranslations("services");
  const tcm = await getTranslations("common");

  // Fallback: legacy API-backed service pages (linked from the home page)
  if (!svc) {
    try {
      const { item } = await getServiceBySlug(slug);
      return <SolutionDetailsClient item={item} />;
    } catch {
      notFound();
    }
  }

  const gallery = Array.from({ length: svc.gallery }, (_, i) => `${IMG_BASE}/${svc.key}-${i + 1}.jpg?v=9`);
  const title = ts(`${svc.key}.title`);
  const intro = ts(`${svc.key}.intro`);
  const works = ts.raw(`${svc.key}.works`) as string[];
  // Кейсы (услуга→портфолио) — несколько реализованных проектов
  let cases: { slug: string; title: string; coverImageUrl: string | null }[] = [];
  try {
    const { items } = await getPortfolio(1, 3);
    cases = items.map((p) => ({ slug: p.slug, title: p.title, coverImageUrl: p.coverImageUrl }));
  } catch {
    // ignore
  }
  // FAQ показываем на ru (контент RU); пер. на остальные языки — в i18n-фазе
  const faq = locale === "ru" ? SERVICE_FAQ[svc.key] ?? [] : [];
  const faqLd =
    faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <div className="bg-white">
      <div className="container-page py-6 sm:py-10">
        {/* Breadcrumbs */}
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-slate-900 transition-colors">{t("home")}</Link>
          <span className="text-slate-300">/</span>
          <Link href="/solutions" className="hover:text-slate-900 transition-colors">{t("servicesCrumb")}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 normal-case tracking-normal">{title}</span>
        </nav>

        {/* Hero: cover + intro */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 aspect-[16/9]">
            <Image
              src={`${IMG_BASE}/${svc.key}.jpg?v=9`}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">
              {svc.group === "industry" ? t("industryTag") : t("serviceTag")}
            </p>
            <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-slate-900">{title}</h1>
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">{intro}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <RequestQuoteButton label={t("getQuote")} variant="brand" productName={`Заявка: ${title}`} />
            </div>
          </div>
        </div>

        {/* Состав работ */}
        <div className="mt-12">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("whatInc")}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("worksTitle")}</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {works.map((w) => (
              <div key={w} className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                <span className="text-sm font-semibold leading-snug text-slate-800">{w}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Принцип работы */}
        <ServiceScheme k={svc.key} />

        {/* Галерея */}
        {gallery.length > 0 && (
          <div className="mt-12">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("examples")}</p>
            <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("gallery")}</h2>
            <Lightbox images={gallery} alt={title} />
          </div>
        )}

        {/* Кейсы (услуга → портфолио) */}
        {cases.length > 0 && (
          <div className="mt-12">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("examples")}</p>
                <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("casesTitle")}</h2>
              </div>
              <Link href="/portfolio" className="shrink-0 text-sm font-bold text-brand-600 hover:underline">
                {t("allProjects")} →
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {cases.map((c) => {
                const img = resolveImageUrl(c.coverImageUrl);
                return (
                  <Link key={c.slug} href={`/portfolio/${c.slug}`} className="group overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-md">
                    <div className="relative aspect-[16/10] bg-slate-100">
                      {img ? (
                        <Image src={img} alt={c.title} fill sizes="(max-width:640px) 100vw, 33vw" className="object-cover" unoptimized />
                      ) : null}
                    </div>
                    <div className="p-3 text-sm font-semibold text-slate-900 group-hover:text-brand-700">{c.title}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* FAQ */}
        {faq.length > 0 && (
          <div className="mt-12">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("faqLabel")}</p>
            <h2 className="mt-1 mb-5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{tcm("faqTitle")}</h2>
            <FaqAccordion items={faq} />
          </div>
        )}
      </div>

      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="container-page flex flex-col items-center gap-5 py-12 text-center sm:py-14">
          <p className="text-xs font-black uppercase tracking-widest text-brand-400">{t("ctaLabel")}</p>
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-black tracking-tight">{t("needTitle", { name: title.toLowerCase() })}</h2>
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            {t("detailCtaText")}
          </p>
          <RequestQuoteButton label={t("getQuote")} variant="brand" productName={`Заявка: ${title} (CTA)`} />
        </div>
      </section>
    </div>
  );
}
