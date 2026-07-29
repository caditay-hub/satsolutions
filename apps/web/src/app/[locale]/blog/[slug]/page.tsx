import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articleBySlug, articleImg } from "@/lib/articlesData";
import { serviceByKey } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const UI: Record<string, { blog: string; home: string; related: string; ctaTitle: string; ctaBtn: string; faq: string }> = {
  ru: { blog: "Блог", home: "Главная", related: "Смежные услуги", ctaTitle: "Нужна консультация или расчёт?", ctaBtn: "Получить КП", faq: "Частые вопросы" },
  uz: { blog: "Blog", home: "Bosh sahifa", related: "Aloqador xizmatlar", ctaTitle: "Maslahat yoki hisob-kitob kerakmi?", ctaBtn: "Taklif olish", faq: "Ko'p so'raladigan savollar" },
  en: { blog: "Blog", home: "Home", related: "Related services", ctaTitle: "Need advice or a quote?", ctaBtn: "Get a quote", faq: "FAQ" },
  tr: { blog: "Blog", home: "Ana sayfa", related: "İlgili hizmetler", ctaTitle: "Danışmanlık veya teklif?", ctaBtn: "Teklif al", faq: "SSS" },
  zh: { blog: "博客", home: "首页", related: "相关服务", ctaTitle: "需要咨询或报价？", ctaBtn: "获取报价", faq: "常见问题" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = articleBySlug[slug];
  const body = article?.loc[locale];
  if (!article || !body) return { title: "Blog" };
  return {
    title: { absolute: `${body.title} — SAT Solutions` },
    description: body.excerpt,
    alternates: hreflangAlternates(`/blog/${slug}`, locale),
    openGraph: { type: "article", title: body.title, description: body.excerpt, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = articleBySlug[slug];
  const body = article?.loc[locale];
  if (!article || !body) notFound();

  const ui = UI[locale] ?? UI.ru;
  const ts = await getTranslations({ locale, namespace: "services" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";

  // Смежные услуги: локализованный H1 из SEO-оверлея, иначе короткий title
  const related = article.related
    .filter((k) => serviceByKey[k])
    .map((k) => ({ key: k, label: getServiceSeo(locale, k)?.h1 ?? ts(`${k}.title`) }));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: body.title,
    description: body.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    inLanguage: locale,
    author: { "@type": "Organization", name: "SAT Solutions" },
    publisher: { "@type": "Organization", name: "SAT Solutions", url: siteUrl },
    mainEntityOfPage: `${siteUrl}${lp}/blog/${slug}`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui.home, item: `${siteUrl}${lp}/` },
      { "@type": "ListItem", position: 2, name: ui.blog, item: `${siteUrl}${lp}/blog` },
      { "@type": "ListItem", position: 3, name: body.title },
    ],
  };
  const faqLd = body.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: body.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* Шапка с тематическим фото на заднем фоне (public/blog-img/<slug>.jpg) */}
      <header className="relative overflow-hidden bg-slate-900">
        <img src={articleImg(slug)} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/40" />
        <div className="container-page relative py-10 sm:py-16">
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-300/80">
            <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
            <span className="text-slate-400/60">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">{ui.blog}</Link>
          </nav>
          <h1 className="max-w-3xl text-2xl sm:text-4xl font-black tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,.5)]">{body.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 [text-shadow:0_1px_8px_rgba(0,0,0,.5)]">{body.excerpt}</p>
        </div>
      </header>

      <article className="container-page py-8 sm:py-12">
        <div className="max-w-3xl">
          <div className="space-y-8">
            {body.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{s.h}</h2>
                <div className="mt-3 space-y-3">
                  {s.p.map((para, j) => (
                    <p key={j} className="text-sm sm:text-base leading-relaxed text-slate-600">{para}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {body.faq && body.faq.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ui.faq}</h2>
              <div className="mt-4 space-y-4">
                {body.faq.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-slate-200 bg-slate-50 p-4 open:bg-white">
                    <summary className="cursor-pointer list-none text-sm sm:text-base font-bold text-slate-900 marker:content-none group-open:text-brand-700">
                      {f.q}
                    </summary>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ui.related}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {related.map((r) => (
                  <Link
                    key={r.key}
                    href={`/solutions/${r.key}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
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
