import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { articleBySlug, articleImg } from "@/lib/articlesData";
import { serviceByKey } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const UI: Record<string, { blog: string; home: string; related: string; hubsLabel: string; ctaTitle: string; ctaBtn: string; faq: string }> = {
  ru: { blog: "Блог", home: "Главная", related: "Смежные услуги", hubsLabel: "Каталог по теме", ctaTitle: "Нужна консультация или расчёт?", ctaBtn: "Получить КП", faq: "Частые вопросы" },
  uz: { blog: "Blog", home: "Bosh sahifa", related: "Aloqador xizmatlar", hubsLabel: "Mavzu bo'yicha katalog", ctaTitle: "Maslahat yoki hisob-kitob kerakmi?", ctaBtn: "Taklif olish", faq: "Ko'p so'raladigan savollar" },
  en: { blog: "Blog", home: "Home", related: "Related services", hubsLabel: "Catalog on the topic", ctaTitle: "Need advice or a quote?", ctaBtn: "Get a quote", faq: "FAQ" },
  tr: { blog: "Blog", home: "Ana sayfa", related: "İlgili hizmetler", hubsLabel: "Konuya göre katalog", ctaTitle: "Danışmanlık veya teklif?", ctaBtn: "Teklif al", faq: "SSS" },
  zh: { blog: "博客", home: "首页", related: "相关服务", hubsLabel: "相关产品目录", ctaTitle: "需要咨询或报价？", ctaBtn: "获取报价", faq: "常见问题" },
};

// Названия товарных хабов для чипов «Каталог по теме» (слаг = /products/type/<slug>)
const HUB_LABELS: Record<string, Record<string, string>> = {
  "ip-kamery": { ru: "IP-камеры", uz: "IP-kameralar", en: "IP cameras", tr: "IP kameralar", zh: "IP摄像机" },
  "ip-videoregistratory-nvr": { ru: "IP-видеорегистраторы (NVR)", uz: "IP-videoregistratorlar (NVR)", en: "Network video recorders (NVR)", tr: "Kayıt cihazları (NVR)", zh: "网络录像机（NVR）" },
  "turnikety-i-shlagbaumy": { ru: "Турникеты и шлагбаумы", uz: "Turniket va shlagbaumlar", en: "Turnstiles and barriers", tr: "Turnikeler ve bariyerler", zh: "闸机与道闸" },
  "kommutatory": { ru: "Коммутаторы", uz: "Kommutatorlar", en: "Switches", tr: "Switch'ler", zh: "交换机" },
  "marshrutizatory": { ru: "Маршрутизаторы", uz: "Marshrutizatorlar", en: "Routers", tr: "Yönlendiriciler", zh: "路由器" },
  "wi-fi-tochki-dostupa": { ru: "Wi-Fi точки доступа", uz: "Wi-Fi kirish nuqtalari", en: "Wi-Fi access points", tr: "Wi-Fi erişim noktaları", zh: "Wi-Fi接入点" },
  "ibp-i-elektropitanie": { ru: "ИБП и электропитание", uz: "UPS va elektr ta'minoti", en: "UPS and power", tr: "UPS ve güç", zh: "UPS与电源" },
  "pozharnaya-bezopasnost": { ru: "Пожарная безопасность", uz: "Yong'in xavfsizligi", en: "Fire safety", tr: "Yangın güvenliği", zh: "消防安全" },
  "ognetushiteli": { ru: "Огнетушители", uz: "O't o'chirgichlar", en: "Fire extinguishers", tr: "Yangın tüpleri", zh: "灭火器" },
  "pon-oborudovanie": { ru: "PON-оборудование", uz: "PON uskunalari", en: "PON equipment", tr: "PON ekipmanı", zh: "PON设备" },
  "optika-i-aksessuary": { ru: "Оптика и аксессуары", uz: "Optika va aksessuarlar", en: "Optics and accessories", tr: "Optik ve aksesuarlar", zh: "光纤与配件" },
  "telekommunikacionnye-shkafy": { ru: "Телекоммуникационные шкафы", uz: "Telekommunikatsiya shkaflari", en: "Network cabinets", tr: "Kabinetler", zh: "网络机柜" },
  "zhestkie-diski": { ru: "Жёсткие диски", uz: "Qattiq disklar", en: "Hard drives", tr: "Sabit diskler", zh: "硬盘" },
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
  const tcalc = await getTranslations({ locale, namespace: "calc" });
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";

  // Смежные услуги: локализованный H1 из SEO-оверлея, иначе короткий title
  const related = article.related
    .filter((k) => serviceByKey[k])
    .map((k) => ({ key: k, label: getServiceSeo(locale, k)?.h1 ?? ts(`${k}.title`) }));

  // Товарные хабы «Каталог по теме» — вторая нога перелинковки: статья → /products/type/<slug>
  const hubs = (article.hubs ?? [])
    .filter((h) => HUB_LABELS[h])
    .map((h) => ({ slug: h, label: HUB_LABELS[h][locale] ?? HUB_LABELS[h].ru }));

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

          {/* Читатель статьи про монтаж почти всегда прикидывает бюджет — даём
              ему калькулятор здесь же, заодно это входящая ссылка на страницу. */}
          <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="max-w-xl">
              <p className="text-base font-black text-slate-900">{tcalc("promoHead")}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{tcalc("promoText")}</p>
            </div>
            <Link href="/calculator"
              className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500 sm:mt-0">
              {tcalc("promoBtn")} →
            </Link>
          </div>

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

          {hubs.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ui.hubsLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {hubs.map((h) => (
                  <Link
                    key={h.slug}
                    href={`/products/type/${h.slug}`}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {h.label}
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
