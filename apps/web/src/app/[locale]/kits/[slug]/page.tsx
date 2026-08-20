import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { kitBySlug, KITS } from "@/lib/kitsData";
import { serviceByKey } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const UI: Record<string, { home: string; kits: string; includes: string; mount: string; faq: string; forWhom: string; ctaTitle: string; ctaBtn: string; related: string; other: string }> = {
  ru: { home: "Главная", kits: "Комплекты", includes: "Что входит в комплект", mount: "Что входит в монтаж", faq: "Частые вопросы", forWhom: "Для кого", ctaTitle: "Посчитаем точную смету под ваш объект — бесплатно", ctaBtn: "Получить смету", related: "Подробнее об услуге", other: "Другие комплекты" },
  uz: { home: "Bosh sahifa", kits: "To'plamlar", includes: "To'plamga nima kiradi", mount: "Montajga nima kiradi", faq: "Ko'p so'raladigan savollar", forWhom: "Kim uchun", ctaTitle: "Obyektingiz uchun aniq smeta — bepul", ctaBtn: "Smeta olish", related: "Xizmat haqida batafsil", other: "Boshqa to'plamlar" },
  en: { home: "Home", kits: "Kits", includes: "What's in the kit", mount: "What installation includes", faq: "FAQ", forWhom: "Who it's for", ctaTitle: "We'll quote your exact site — free", ctaBtn: "Get a quote", related: "About the service", other: "Other kits" },
  tr: { home: "Ana sayfa", kits: "Setler", includes: "Sette neler var", mount: "Montaja neler dahil", faq: "SSS", forWhom: "Kimler için", ctaTitle: "Tesisinize özel net teklif — ücretsiz", ctaBtn: "Teklif al", related: "Hizmet hakkında", other: "Diğer setler" },
  zh: { home: "首页", kits: "套装", includes: "套装包含", mount: "安装包含", faq: "常见问题", forWhom: "适用对象", ctaTitle: "免费为您的场地出具准确报价", ctaBtn: "获取报价", related: "了解服务详情", other: "其他套装" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const kit = kitBySlug(slug);
  const body = kit?.loc[locale];
  if (!kit || !body) return { title: "Kits" };
  return {
    title: { absolute: `${body.title} — ${body.priceLabel} — SAT Solutions` },
    description: `${body.tagline} ${body.audience}`,
    alternates: hreflangAlternates(`/kits/${slug}`, locale),
    openGraph: { title: body.title, description: body.tagline, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function KitPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const kit = kitBySlug(slug);
  const body = kit?.loc[locale];
  if (!kit || !body) notFound();

  const ui = UI[locale] ?? UI.ru;
  const ts = await getTranslations({ locale, namespace: "services" });
  const tcalc = await getTranslations({ locale, namespace: "calc" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";
  const relLabel = serviceByKey[kit.relatedService] ? (getServiceSeo(locale, kit.relatedService)?.h1 ?? ts(`${kit.relatedService}.title`)) : null;
  const others = KITS.filter((k) => k.slug !== slug && k.loc[locale]);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: body.title,
    description: body.tagline,
    brand: { "@type": "Organization", name: "SAT Solutions" },
    offers: {
      "@type": "Offer",
      price: kit.priceFrom,
      priceCurrency: "UZS",
      availability: "https://schema.org/InStock",
      url: `${siteUrl}${lp}/kits/${slug}`,
    },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui.home, item: `${siteUrl}${lp}/` },
      { "@type": "ListItem", position: 2, name: ui.kits, item: `${siteUrl}${lp}/kits` },
      { "@type": "ListItem", position: 3, name: body.title },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: body.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <header className="bg-slate-900">
        <div className="container-page py-10 sm:py-16">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-300/80">
            <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
            <span className="text-slate-400/60">/</span>
            <Link href="/kits" className="hover:text-white transition-colors">{ui.kits}</Link>
          </nav>
          <h1 className="max-w-3xl text-2xl sm:text-4xl font-black tracking-tight text-white">{body.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200">{body.tagline}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <span className="rounded-full bg-brand-500 px-5 py-2 text-base font-black text-white">{body.priceLabel}</span>
            <Link href="/contact" className="rounded-xl border border-slate-500 px-5 py-2 text-sm font-bold text-white transition-colors hover:border-brand-400 hover:text-brand-300">
              {body.cta}
            </Link>
          </div>
        </div>
      </header>

      <article className="container-page py-8 sm:py-12">
        <div className="max-w-3xl space-y-10">
          <section>
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ui.forWhom}</p>
            <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">{body.audience}</p>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ui.includes}</h2>
            <ul className="mt-4 space-y-2.5">
              {body.includes.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm sm:text-base leading-relaxed text-slate-700">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ui.mount}</h2>
            <ul className="mt-4 space-y-2.5">
              {body.mount.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm sm:text-base leading-relaxed text-slate-700">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-slate-400" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="border-t border-slate-200 pt-6">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ui.faq}</h2>
            <div className="mt-4 space-y-4">
              {body.faq.map((f, i) => (
                <details key={i} className="group rounded-xl border border-slate-200 bg-slate-50 p-4 open:bg-white">
                  <summary className="cursor-pointer list-none text-sm sm:text-base font-bold text-slate-900 marker:content-none group-open:text-brand-700">{f.q}</summary>
                  <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="max-w-xl">
              <p className="text-base font-black text-slate-900">{tcalc("promoHead")}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{tcalc("promoText")}</p>
            </div>
            <Link href="/calculator" className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500 sm:mt-0">
              {tcalc("promoBtn")} →
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-200 pt-6">
            {relLabel && (
              <Link href={`/solutions/${kit.relatedService}`} className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-bold text-brand-800 transition-colors hover:border-brand-300">
                {ui.related}: {relLabel}
              </Link>
            )}
            {others.map((k) => (
              <Link key={k.slug} href={`/kits/${k.slug}`} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700">
                {k.loc[locale].title}
              </Link>
            ))}
          </div>
        </div>
      </article>

      <section className="bg-slate-900 text-white">
        <div className="container-page flex flex-col items-center gap-5 py-12 text-center sm:py-14">
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-black tracking-tight">{ui.ctaTitle}</h2>
          <Link href="/contact" className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-brand-400">
            {ui.ctaBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
