import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getServiceBySlug, getPortfolio, getProducts } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { SolutionDetailsClient } from "@/components/SolutionDetailsClient";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { ProjectQuoteForm } from "@/components/ProjectQuoteForm";
import { TrustBlock } from "@/components/TrustBlock";
import { ClientsStrip } from "@/components/ClientsStrip";
import { IndustryDetailsBlock, ServiceIndustriesBlock } from "@/components/IndustryDetailsBlock";
import { ContactButtons } from "@/components/ContactButtons";
import { ServiceScheme } from "@/components/ServiceScheme";
import { NetworkDetails } from "@/components/NetworkDetails";
import { SmartHomeDevices } from "@/components/SmartHomeDevices";
import { H3cEquipment } from "@/components/H3cEquipment";
import { DataCenterDetails } from "@/components/DataCenterDetails";
import { RelatedServices } from "@/components/RelatedServices";
import { ServicePackages } from "@/components/ServicePackages";
import { ServicePriceHint } from "@/components/ServicePriceHint";
import { Lightbox } from "@/components/Lightbox";
import { serviceByKey, SERVICE_FAQ } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { getServiceContent } from "@/lib/serviceContent";
import { SERVICE_TO_GROUP } from "@/lib/groupSeo";
import { ARTICLES } from "@/lib/articlesData";
import { getReviews } from "@/lib/api";
import { ReviewForm } from "@/components/ReviewForm";
import { type Review } from "@/components/ReviewsSection";
import { FaqAccordion } from "@/components/FaqAccordion";

// Услуги, которые калькулятор умеет считать — только на них есть смысл вести
const CALC_SERVICES = new Set(["cctv", "access", "fire", "network", "wifi", "intercom", "perimeter", "alarm", "turnstile", "locks", "attendance"]);
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
    // Гео-коммерческий SEO-оверлей (город + интент) — приоритет над генерик-title/intro
    const seo = getServiceSeo(locale, svc.key);
    const metaTitle = seo ? `${seo.title}` : `${title} — SAT Solutions`;
    const metaDesc = seo?.desc ?? intro;
    return {
      title: { absolute: metaTitle },
      description: metaDesc,
      alternates: hreflangAlternates(`/solutions/${svc.key}`, locale),
      openGraph: { title: seo?.h1 ?? title, description: metaDesc, locale: ogLocale(locale), images: [{ url: `${IMG_BASE}/${svc.key}.jpg` }] }
    };
  }
  try {
    const { item } = await getServiceBySlug(slug);
    // RU: приоритет seoTitle/seoDescription из БД (заточены под поисковые запросы)
    const solTitle = (locale === "ru" && item.seoTitle) || item.title;
    const solDesc = (locale === "ru" && item.seoDescription) || item.excerpt?.trim() || `${item.title} — решения по безопасности и слаботочным системам от SAT Solutions в Ташкенте и по Узбекистану.`;
    return { title: solTitle, description: solDesc, alternates: hreflangAlternates(`/solutions/${item.slug}`, locale), openGraph: { title: solTitle, description: solDesc, locale: ogLocale(locale) } };
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

  const isInd = svc.group === "industry";
  // Отраслевые: первое фото галереи уходит в секцию «Специфика объекта» — в галерее не дублируем
  const gallery = Array.from({ length: svc.gallery }, (_, i) => `${IMG_BASE}/${svc.key}-${i + 1}.jpg?v=10`).slice(isInd ? 1 : 0);
  // Полоса цифр и цветная полоса формы — только на отраслевых (вариант А «журнальный ритм»)
  const tst = isInd ? await getTranslations({ locale, namespace: "industryStats" }) : null;
  const tpf = isInd ? await getTranslations({ locale, namespace: "projectForm" }) : null;
  const ttr = isInd ? await getTranslations({ locale, namespace: "trust" }) : null;
  const tcalc = await getTranslations({ locale, namespace: "calc" });

  // Оборудование под услугу — категории каталога. Список через запятую API не
  // принимает, поэтому спрашиваем по одной и мешаем бренды между собой.
  const EQUIP_CATS: Record<string, string[]> = {
    turnstile: ["zkteco-turnstiles", "hik-turnstiles", "kanihad-turnstiles"],
    barrier: ["zkteco-barriers", "hik-turnstiles"],
    access: ["access-control", "access-controllers"],
    locks: ["zkteco-locks", "kanihad-locks"],
    // По этим услугам реклама получала «посадочная ниже среднего»: человек ищет
    // технику/цену, а страница была только про работы. Витрина закрывает разрыв.
    cctv: ["hik-ip-cameras", "network-cameras", "hik-wireless-cameras"],
    intercom: ["hik-intercoms", "indoor-monitors"],
    fire: ["prochee-fire"],
    servers: ["pxt-server"],
  };
  let equipment: any[] = [];
  const cats = EQUIP_CATS[svc.key];
  if (cats) {
    const chunks = await Promise.all(
      cats.map((c) => getProducts(1, 4, { category: c }).then((r) => r.items ?? []).catch(() => []))
    );
    // перемешиваем по одному из каждой категории, чтобы витрина не была однобрендовой
    const merged: any[] = [];
    for (let i = 0; i < 4; i++) for (const ch of chunks) if (ch[i]) merged.push(ch[i]);
    equipment = merged.filter((p) => p?.coverImageUrl).slice(0, 8);
  }
  const equipTitle = ({ ru: "Оборудование, которое мы ставим", uz: "Biz o'rnatadigan uskunalar", en: "Equipment we install", tr: "Kurduğumuz ekipmanlar", zh: "我们安装的设备" } as Record<string, string>)[locale] ?? "Оборудование, которое мы ставим";
  const priceOnReq = ({ ru: "Цена по запросу", uz: "Narxi so'rov bo'yicha", en: "Price on request", tr: "Fiyat için sorun", zh: "价格面议" } as Record<string, string>)[locale] ?? "Цена по запросу";

  const title = ts(`${svc.key}.title`);
  const intro = ts(`${svc.key}.intro`);
  // H1 — гео-коммерческий из SEO-оверлея (fallback на короткий title, который
  // остаётся для хлебных крошек, CTA, alt и JSON-LD)
  const h1 = getServiceSeo(locale, svc.key)?.h1 ?? title;
  // Содержательный SEO-текст под голые высокочастотники (RU-приоритет; нет — не рендерим)
  const content = getServiceContent(locale, svc.key);
  // Обратная перелинковка: инфо-статьи блога, связанные с этой услугой (только с переводом на локаль)
  const relatedArticles = ARTICLES.filter((a) => a.related.includes(svc.key) && a.loc[locale]).slice(0, 3);
  // Отзывы, привязанные к этой услуге (одобренные); avg/count — компактный рейтинг под H1
  const reviews = await getReviews(svc.key);
  const reviewItems: Review[] = reviews.items.map((r) => ({
    name: r.authorName?.trim() || "Клиент",
    rating: r.rating,
    date: new Date(r.createdAt).toLocaleDateString(locale === "ru" ? "ru-RU" : locale, { month: "long", year: "numeric" }),
    text: r.text?.trim() || "",
  }));
  const reviewsLabel = locale === "uz" ? "Mijozlar sharhlari" : locale === "en" ? "Customer reviews" : locale === "tr" ? "Müşteri yorumları" : locale === "zh" ? "客户评价" : "Отзывы клиентов";
  const works = ts.raw(`${svc.key}.works`) as string[];
  // Кейсы (услуга→портфолио) — несколько реализованных проектов
  let cases: { slug: string; title: string; coverImageUrl: string | null }[] = [];
  try {
    const { items } = await getPortfolio(1, 3);
    cases = items.map((p) => ({ slug: p.slug, title: p.title, coverImageUrl: p.coverImageUrl }));
  } catch {
    // ignore
  }
  // FAQ: RU — из servicesData (источник), остальные локали — переводы из messages
  // (services.<key>.faq). Нет перевода — блок просто не показывается.
  let faq: { q: string; a: string }[] = [];
  if (locale === "ru") {
    faq = SERVICE_FAQ[svc.key] ?? [];
  } else {
    try {
      const tr = ts.raw(`${svc.key}.faq`) as { q: string; a: string }[];
      if (Array.isArray(tr)) faq = tr.filter((f) => f?.q && f?.a);
    } catch { /* перевода нет */ }
  }
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

  // JSON-LD: Service + BreadcrumbList — страницы «возможностей» должны попадать
  // в расширенную выдачу по коммерческим запросам (шлагбаумы, скуд, видеостена…)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: intro,
    serviceType: title,
    provider: { "@type": "Organization", name: "SAT Solutions", url: siteUrl, telephone: "+998-97-862-66-99" },
    areaServed: { "@type": "Country", name: "Узбекистан" },
    url: `${siteUrl}${lp}/solutions/${svc.key}`,
    image: `${IMG_BASE}/${svc.key}.jpg`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("home"), item: `${siteUrl}${lp}/` },
      { "@type": "ListItem", position: 2, name: t("servicesCrumb"), item: `${siteUrl}${lp}/solutions` },
      { "@type": "ListItem", position: 3, name: title },
    ],
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* Отраслевые: тёмный hero с фото-подложкой + полоса цифр (вариант А) */}
      {isInd && (
        <>
          <section className="relative overflow-hidden bg-[#031422] text-white">
            <div className="absolute inset-0" aria-hidden>
              <Image
                src={`${IMG_BASE}/${svc.key}.jpg?v=10`}
                alt=""
                fill
                sizes="100vw"
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#031422] via-[#031422]/85 to-[#031422]/30" />
              <div className="absolute inset-0 bg-[#031422]/45 lg:hidden" />
            </div>
            <div className="container-page relative py-12 sm:py-16 lg:py-20">
              <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                <Link href="/" className="transition-colors hover:text-white">{t("home")}</Link>
                <span className="text-slate-600">/</span>
                <Link href="/solutions" className="transition-colors hover:text-white">{t("servicesCrumb")}</Link>
                <span className="text-slate-600">/</span>
                <span className="normal-case tracking-normal text-slate-200">{title}</span>
              </nav>
              <p className="text-xs font-black uppercase tracking-widest text-cyan-300">{t("industryTag")}</p>
              <h1 className="mt-2 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">{h1}</h1>
              {reviews.count > 0 && (
                <div className="mt-3 flex items-center gap-2 text-sm font-bold text-slate-300">
                  <span className="inline-flex" aria-hidden>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i <= Math.round(reviews.avg) ? "text-amber-400" : "text-slate-600"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
                    ))}
                  </span>
                  <span className="tabular-nums">{reviews.avg.toFixed(1)}</span>
                  <span className="text-slate-500">· {reviews.count}</span>
                </div>
              )}
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">{intro}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <RequestQuoteButton label={t("getQuote")} variant="brand" productName={`Заявка: ${title}`} />
                <ContactButtons />
              </div>
            </div>
          </section>
          <section className="border-t border-white/10 bg-[#031422] text-white">
            <div className="container-page grid grid-cols-2 lg:grid-cols-4">
              {(["s1", "s2", "s3", "s4"] as const).map((k, i) => (
                <div
                  key={k}
                  className={`px-2 py-5 sm:px-5 ${i === 1 || i === 3 ? "border-l border-white/10" : ""} ${i >= 2 ? "border-t border-white/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l lg:border-white/10" : ""}`}
                >
                  <div className="text-xl font-black text-cyan-300 sm:text-2xl">{tst!(`${k}.v`)}</div>
                  <div className="mt-0.5 text-[11px] leading-snug text-slate-400 sm:text-xs">{tst!(`${k}.l`)}</div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      <div className="container-page py-6 sm:py-10">
        {!isInd && (
          <>
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
                  src={`${IMG_BASE}/${svc.key}.jpg?v=10`}
                  alt={title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("serviceTag")}</p>
                <h1 className="mt-2 text-2xl sm:text-4xl font-black tracking-tight text-slate-900">{h1}</h1>
                {reviews.count > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-600">
                    <span className="inline-flex text-amber-400" aria-hidden>
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i <= Math.round(reviews.avg) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
                      ))}
                    </span>
                    <span className="tabular-nums">{reviews.avg.toFixed(1)}</span>
                    <span className="text-slate-400">· {reviews.count}</span>
                  </div>
                )}
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">{intro}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <RequestQuoteButton label={t("getQuote")} variant="brand" productName={`Заявка: ${title}`} />
                  <ContactButtons />
                </div>
              </div>
            </div>
          </>
        )}

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

        {/* SEO-текст: глубина контента под голые высокочастотные запросы */}
        {content && (
          <section className="mt-12 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{content.heading}</h2>
            <div className="mt-4 space-y-4">
              {content.paragraphs.map((p, i) => (
                <p key={i} className="text-sm sm:text-base leading-relaxed text-slate-600">{p}</p>
              ))}
            </div>
          </section>
        )}

        {/* СКС и ЛВС: типовые конфигурации, этапы, бренды каталога */}
        {svc.key === "network" && <NetworkDetails />}

        {/* Умный дом: витрина устройств Tuya из каталога (фото + перелинковка) */}
        {svc.key === "smarthome" && <SmartHomeDevices />}

        {/* Серверы H3C: перечень поставляемого оборудования (модельные линейки) */}
        {svc.key === "virtualization" && <H3cEquipment />}

        {/* Серверные и ЦОД: типовые конфигурации, этапы, каталог */}
        {svc.key === "server" && <DataCenterDetails />}

        {/* Типовые конфигурации (универсальный блок: турникеты, Wi-Fi, умный дом…) */}
        {!["network", "server"].includes(svc.key) && <ServicePackages k={svc.key} />}

        {/* Ценовой ориентир — для ключей «… цена / narxi», которые ведут на эту страницу */}
        <ServicePriceHint k={svc.key} locale={locale} />

        {/* Принцип работы */}
        <ServiceScheme k={svc.key} />

        {/* Смежные услуги — перелинковка внутри «семьи» (сети / серверы) */}
        <RelatedServices current={svc.key} />

        {/* Перелинковка услуга → отрасли, где она применяется */}
        {svc.group === "service" && <ServiceIndustriesBlock locale={locale} serviceKey={svc.key} />}
      </div>

      {/* Инженерный контент отрасли — полноширинные секции: специфика с фото,
          этапы линией на сером, сложности на тёмном, FAQ узкой колонкой */}
      {isInd && <IndustryDetailsBlock locale={locale} industryKey={svc.key} />}

      {/* Расчёт проекта — полоса на брендовом градиенте: слева заголовок и
          гарантии, справа белая карточка формы (визуальный финал истории) */}
      {isInd && (
        <section className="bg-gradient-to-br from-brand-700 to-[#134e5e] text-white">
          <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-cyan-200">{tpf!("badge")}</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{tpf!("title")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-cyan-50/90 sm:text-[15px]">{tpf!("subtitle")}</p>
              <ul className="mt-6 space-y-2.5 text-sm font-semibold">
                {[ttr!("warrantyT"), ttr!("teamT"), ttr!("docsT")].map((x) => (
                  <li key={x} className="flex items-center gap-2.5">
                    <svg className="h-4 w-4 shrink-0 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <ProjectQuoteForm industryKey={svc.key} hideHeader />
          </div>
        </section>
      )}

      {/* Доверие и клиенты — светлая полоса */}
      {isInd && (
        <section className="bg-slate-50">
          <div className="container-page py-12 sm:py-16">
            <TrustBlock locale={locale} />
            <ClientsStrip locale={locale} />
          </div>
        </section>
      )}

      <div className="container-page pb-6 sm:pb-10">
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

        {/* Калькулятор: показываем только там, где он реально считает эту систему */}
        {CALC_SERVICES.has(svc.key) && (
          <div className="mt-12 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="max-w-xl">
              <p className="text-base font-black text-slate-900">{tcalc("promoTitle")}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{tcalc("promoText")}</p>
            </div>
            <Link href="/calculator"
              className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500 sm:mt-0">
              {tcalc("promoBtn")} →
            </Link>
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

        {/* Витрина оборудования: по запросам «шлагбаум», «турникет» человек ищет
            технику, а на странице услуги её не было — только описание работ. */}
        {equipment.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{equipTitle}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {equipment.map((p: any) => (
                <Link key={p.id} href={`/products/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-brand-300">
                  <div className="flex h-32 items-center justify-center bg-white p-3">
                    {resolveImageUrl(p.coverImageUrl) ? (
                      <Image src={resolveImageUrl(p.coverImageUrl) as string} alt={p.name} width={160} height={116}
                        className="max-h-[110px] w-auto object-contain" />
                    ) : null}
                  </div>
                  <div className="border-t border-slate-100 p-3">
                    <div className="line-clamp-2 text-[13px] font-semibold text-slate-800 group-hover:text-brand-700">{p.name}</div>
                    <div className="mt-1 text-[12px] font-bold text-brand-700">
                      {Number(p.price) > 0
                        ? `${Math.round(Number(p.price)).toLocaleString("ru-RU")} ${locale === "ru" ? "сум" : "UZS"}`
                        : priceOnReq}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Мост «установить ↔ купить»: keyword-ссылка на hub-страницу группы каталога (groupSeo) */}
        {SERVICE_TO_GROUP[svc.key] && (
          <div className="mt-10">
            <Link
              href={SERVICE_TO_GROUP[svc.key].href}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-800 hover:bg-brand-100 transition-colors"
            >
              {(SERVICE_TO_GROUP[svc.key].label[locale] ?? SERVICE_TO_GROUP[svc.key].label.ru)} →
            </Link>
          </div>
        )}

        {/* Полезные статьи (услуга → блог) — обратная перелинковка */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {locale === "uz" ? "Foydali maqolalar" : locale === "en" ? "Useful articles" : locale === "tr" ? "Faydalı makaleler" : locale === "zh" ? "实用文章" : "Полезные статьи"}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedArticles.map((a) => {
                const b = a.loc[locale]!;
                return (
                  <Link key={a.slug} href={`/blog/${a.slug}`} className="group rounded-xl border border-slate-200 p-4 transition-shadow hover:shadow-md">
                    <div className="text-sm font-black leading-snug text-slate-900 group-hover:text-brand-700">{b.title}</div>
                    <div className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">{b.excerpt}</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Оценка услуги + отзывы (привязка serviceKey=svc.key) */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-start">
          <div className="max-w-xl">
            <ReviewForm locale={locale} serviceKey={svc.key} />
          </div>
          {reviewItems.length > 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
                {reviewsLabel}
                <span className="text-amber-400">★</span>
                <span className="tabular-nums text-slate-600">{reviews.avg.toFixed(1)}</span>
              </div>
              <div className="space-y-3">
                {reviewItems.slice(0, 4).map((r, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-900">{r.name}</span>
                      <span className="inline-flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${s <= r.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
                        ))}
                      </span>
                    </div>
                    {r.text && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{r.text}</p>}
                    <div className="mt-1.5 text-xs font-semibold text-slate-400">{r.date}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
