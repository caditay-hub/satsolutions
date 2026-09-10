import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizePortfolioProject } from "@/lib/contentI18n";
import { localizeProduct, localizeProductName } from "@/lib/productI18n";
import { getServiceBySlug, getPortfolio, getProductsCached } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { SolutionDetailsClient } from "@/components/SolutionDetailsClient";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { ProjectQuoteForm } from "@/components/ProjectQuoteForm";
import { TrustBlock } from "@/components/TrustBlock";
import { ClientsStrip } from "@/components/ClientsStrip";
import { IndustryDetailsBlock, ServiceIndustriesBlock } from "@/components/IndustryDetailsBlock";
import { ContactButtons } from "@/components/ContactButtons";
import { SectionNav, MobileContactBar, type SectionNavItem } from "@/components/ServicePageNav";
import { servicePrices } from "@/lib/servicePrices";
import { getIndustryDetails, industriesForService } from "@/lib/industryDetails";
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
// Справочные разделы: страница объясняет устройство оборудования и ведёт в смежную
// услугу. Кнопки запроса предложения на них не показываем — заявку принимать не на что.
const REFERENCE_ONLY = new Set(["gates"]);
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const IMG_BASE = "https://api.satsolutions.uz/uploads/services-page";

// ISR по требованию: страниц услуг ~40, данные (оборудование, кейсы) из API
export const revalidate = 300;
export async function generateStaticParams() { return []; }

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
  // Явная локаль: иначе next-intl читает заголовки и страница рендерится на каждый запрос
  setRequestLocale(locale);
  const svc = serviceByKey[slug];
  const t = await getTranslations({ locale, namespace: "solutionsPage" });
  const ts = await getTranslations({ locale, namespace: "services" });
  const tcm = await getTranslations({ locale, namespace: "common" });

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
  const isReference = REFERENCE_ONLY.has(svc.key);
  // Отраслевые: первое фото галереи уходит в секцию «Специфика объекта» — в галерее не дублируем
  const gallery = Array.from({ length: svc.gallery }, (_, i) => `${IMG_BASE}/${svc.key}-${i + 1}.jpg?v=11`).slice(isInd ? 1 : 0);
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
    fire: ["prochee-fire", "rubezh-detectors", "prochee-ognetushiteli"],
    servers: ["pxt-server"],
    // 03.09: витрина на ВСЕ услуги, где в тексте описано оборудование (перелинковка
    // услуга → товары каталога с фото/описанием/ценой).
    alarm: ["hik-axpro", "bolid-detectors", "detectors"],
    "ohrannye-sistemy": ["hik-axpro", "bolid-detectors", "detectors"],
    pa: ["prochee-pa", "rubezh-sirens", "bolid-sirens"],
    perimeter: ["thermal-cameras", "hik-ip-cameras", "hik-project"],
    anpr: ["hik-ip-cameras", "zkteco-barriers"],
    "intellektualnoe-upravlenie-parkingom": ["zkteco-barriers", "hik-turnstiles", "displei-hik"],
    attendance: ["hik-access-terminals", "zkteco-terminals"],
    gates: ["zkteco-barriers", "kanihad-turnstiles"],
    analytics: ["hik-ip-cameras", "hik-nvr"],
    videowall: ["displei-hik", "displei", "hik-nvr"],
    network: ["pxt-scs", "pxt-switches", "pxt-racks"],
    wifi: ["tplink-wifi", "hik-wifi", "witek-wifi"],
    fiber: ["pxt-fiber", "pxt-tools", "pxt-pon"],
    radiobridge: ["mikrotik-wireless", "witek-bridges", "ruijie-wireless"],
    mikrotik: ["mikrotik-routers", "mikrotik-switches", "mikrotik-sfp"],
    telephony: ["pxt-voip"],
    server: ["pxt-server", "pxt-racks", "pxt-ups"],
    "slabotochnye-sistemy": ["hik-ip-cameras", "prochee-fire", "hik-access-terminals"],
    proektirovanie: ["rubezh-panels", "hik-ip-cameras", "access-controllers"],
    obsluzhivanie: ["prochee-ognetushiteli", "bolid-detectors", "prochee-fire"],
    "sistemnaya-integraciya": ["hik-nvr", "pxt-server", "hik-access-terminals"],
  };
  let equipment: any[] = [];
  const cats = EQUIP_CATS[svc.key];
  if (cats) {
    const chunks = await Promise.all(
      cats.map((c) => getProductsCached(1, 4, { category: c }).then((r) => r.items ?? []).catch(() => []))
    );
    // перемешиваем по одному из каждой категории, чтобы витрина не была однобрендовой
    const merged: any[] = [];
    for (let i = 0; i < 4; i++) for (const ch of chunks) if (ch[i]) merged.push(ch[i]);
    // названия приходят из БД по-русски — прогоняем через оверлей productI18n
    equipment = merged.filter((p) => p?.coverImageUrl).slice(0, 8).map((p) => {
      const loc = localizeProduct(p, locale);
      return { ...p, name: loc.name, shortDescription: loc.shortDescription };
    });
  }
  const equipTitle = ({ ru: "Оборудование, которое мы ставим", uz: "Biz oʻrnatadigan uskunalar", en: "Equipment we install", tr: "Kurduğumuz ekipmanlar", zh: "我们安装的设备" } as Record<string, string>)[locale] ?? "Оборудование, которое мы ставим";
  const priceOnReq = ({ ru: "Цена по запросу", uz: "Narxi soʻrov boʻyicha", en: "Price on request", tr: "Fiyat için sorun", zh: "价格面议" } as Record<string, string>)[locale] ?? "Цена по запросу";

  const title = ts(`${svc.key}.title`);
  const intro = ts(`${svc.key}.intro`);
  // H1 — гео-коммерческий из SEO-оверлея (fallback на короткий title, который
  // остаётся для хлебных крошек, CTA, alt и JSON-LD)
  const h1 = getServiceSeo(locale, svc.key)?.h1 ?? title;
  // Содержательный SEO-текст под голые высокочастотники (RU-приоритет; нет — не рендерим)
  const content = getServiceContent(locale, svc.key);
  // Обратная перелинковка: инфо-статьи блога, связанные с этой услугой (только с переводом на локаль)
  const relatedArticles = ARTICLES.filter((a) => a.related.includes(svc.key) && a.loc[locale]).slice(0, 6);
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
    // названия кейсов приходят из БД по-русски — прогоняем через оверлей переводов
    cases = items.map((p) => localizePortfolioProject(p as any, locale)).map((p: any) => ({ slug: p.slug, title: p.title, coverImageUrl: p.coverImageUrl }));
  } catch {
    // ignore
  }
  // FAQ для всех пяти локалей берём из messages (services.<key>.faq).
  // Раньше русская версия читалась из SERVICE_FAQ в коде — из-за двух источников
  // правды наборы вопросов разъехались, и разметка FAQPage отдавала на разных
  // языках разные вопросы. SERVICE_FAQ остаётся запасным вариантом на случай,
  // если перевода нет (например, у отраслевых страниц).
  let faq: { q: string; a: string }[] = [];
  try {
    const tr = ts.raw(`${svc.key}.faq`) as { q: string; a: string }[];
    if (Array.isArray(tr)) faq = tr.filter((f) => f?.q && f?.a);
  } catch { /* перевода нет */ }
  if (faq.length === 0 && locale === "ru") faq = SERVICE_FAQ[svc.key] ?? [];
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

  // Цена «от» для первого экрана и разметки — последняя строка ценового блока
  // (у cctv: «Готовый комплект с монтажом — от 4 000 000 сум»). Блок есть не у всех услуг.
  const priceBlock = servicePrices(svc.key, locale);
  const heroPrice = priceBlock?.rows[priceBlock.rows.length - 1] ?? null;
  const heroMinPrice = heroPrice ? Number(heroPrice.price.replace(/\D/g, "")) || null : null;
  let hasPackages = false;
  try {
    const pk = ts.raw(`${svc.key}.details.packages`);
    hasPackages = Array.isArray(pk) && pk.length > 0 && !["network", "server"].includes(svc.key);
  } catch { /* пакетов нет */ }
  const hasPrices = hasPackages || !!priceBlock;
  const ind = isInd ? getIndustryDetails(locale, svc.key) : null;
  const svcIndustries = svc.group === "service" ? industriesForService(svc.key) : [];

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
    // ценовой ориентир «от» — тот же, что в первом экране
    ...(heroMinPrice
      ? { offers: { "@type": "Offer", priceSpecification: { "@type": "PriceSpecification", priceCurrency: "UZS", minPrice: heroMinPrice } } }
      : {}),
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

  // Полоса разделов: у услуг — по содержимому страницы, у отраслей — инженерные разделы.
  // «Заказать» у услуг только на телефоне: на компьютере КП уже в самой полосе.
  const navItems: SectionNavItem[] = isInd
    ? [
        { id: "sostav", label: t("worksTitle") },
        ...(ind ? [{ id: "specifics", label: t("navSpecifics") }, { id: "process", label: t("navProcess") }] : []),
        ...(ind?.faq?.length ? [{ id: "ind-faq", label: t("navFaq") }] : []),
        { id: "order", label: t("navOrder") },
      ]
    : [
        { id: "sostav", label: t("worksTitle") },
        ...(content ? [{ id: "about", label: t("navAbout") }] : []),
        ...(hasPrices ? [{ id: "prices", label: t("navPrices") }] : []),
        ...(equipment.length ? [{ id: "equipment", label: t("navEquipment") }] : []),
        ...(cases.length ? [{ id: "projects", label: t("navProjects") }] : []),
        ...(faq.length ? [{ id: "faq", label: t("navFaq") }] : []),
        ...(isReference ? [] : [{ id: "order", label: t("navOrder"), mobileOnly: true }]),
      ];
  // Нижняя панель на телефоне появляется, когда человек дошёл до цен (прочитал предложение)
  const barStart = isInd ? (ind ? "specifics" : "sostav") : hasPrices ? "prices" : content ? "about" : "sostav";
  const quoteProduct = `Заявка: ${title}`;

  const stars = (dark: boolean) =>
    reviews.count > 0 ? (
      <div className={`mt-3 flex items-center gap-2 text-sm font-bold ${dark ? "text-slate-300" : "text-slate-600"}`}>
        <span className="inline-flex" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i <= Math.round(reviews.avg) ? "text-amber-400" : dark ? "text-slate-600" : "text-slate-200"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
          ))}
        </span>
        <span className="tabular-nums">{reviews.avg.toFixed(1)}</span>
        <span className={dark ? "text-slate-500" : "text-slate-400"}>· {reviews.count}</span>
      </div>
    ) : null;

  const equipmentBlock = equipment.length > 0 ? (
    <section id="equipment" className="mt-12 scroll-mt-32">
      <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{equipTitle}</h2>
      {/* на телефоне — лента вбок: восемь карточек столбиком занимали экран за экраном */}
      <div className="mt-4 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 lg:grid-cols-4">
        {equipment.map((p: any) => (
          <Link key={p.id} href={`/products/${p.slug}`}
            className="group flex w-[46%] shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-brand-300 sm:w-auto">
            <div className="flex h-32 items-center justify-center bg-white p-3">
              {resolveImageUrl(p.coverImageUrl) ? (
                <Image src={resolveImageUrl(p.coverImageUrl) as string} alt={p.name} width={160} height={116}
                  className="max-h-[110px] w-auto object-contain" />
              ) : null}
            </div>
            <div className="border-t border-slate-100 p-3">
              <div className="line-clamp-2 text-[13px] font-semibold text-slate-800 group-hover:text-brand-700">{p.name}</div>
              {p.shortDescription ? (
                <div className="mt-1 line-clamp-2 text-[11.5px] leading-snug text-slate-500">{p.shortDescription}</div>
              ) : null}
              <div className="mt-1 text-[12px] font-bold text-brand-700">
                {Number(p.price) > 0
                  ? `${Math.round(Number(p.price)).toLocaleString("ru-RU")} ${locale === "ru" ? "сум" : "UZS"}`
                  : priceOnReq}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  ) : null;

  // Мост «установить ↔ купить»: keyword-ссылка на hub-страницу группы каталога (groupSeo)
  const bridgeLink = SERVICE_TO_GROUP[svc.key] ? (
    <div className={equipment.length > 0 ? "mt-4" : "mt-10"}>
      <Link
        href={SERVICE_TO_GROUP[svc.key].href}
        className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-bold text-brand-800 transition-colors hover:bg-brand-100"
      >
        {(SERVICE_TO_GROUP[svc.key].label[locale] ?? SERVICE_TO_GROUP[svc.key].label.ru)} →
      </Link>
    </div>
  ) : null;

  // Кейсы (услуга → портфолио)
  const casesBlock = cases.length > 0 ? (
    <section id="projects" className="scroll-mt-32">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("examples")}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("casesTitle")}</h2>
        </div>
        <Link href="/portfolio" className="shrink-0 text-sm font-bold text-brand-600 hover:underline">
          {t("allProjects")} →
        </Link>
      </div>
      <div className="mt-5 flex gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {cases.map((c) => {
          const img = resolveImageUrl(c.coverImageUrl);
          return (
            <Link key={c.slug} href={`/portfolio/${c.slug}`} className="group w-[78%] shrink-0 overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-md sm:w-auto">
              <div className="relative aspect-[16/10] bg-slate-100">
                {img ? (
                  <Image src={img} alt={c.title} fill sizes="(max-width:640px) 100vw, 25vw" className="object-cover" unoptimized />
                ) : null}
              </div>
              <div className="p-3 text-sm font-semibold text-slate-900 group-hover:text-brand-700">{c.title}</div>
            </Link>
          );
        })}
      </div>
    </section>
  ) : null;

  const articlesTitle = locale === "uz" ? "Foydali maqolalar" : locale === "en" ? "Useful articles" : locale === "tr" ? "Faydalı makaleler" : locale === "zh" ? "实用文章" : "Полезные статьи";

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {/* Отраслевые: тёмный hero с фото-подложкой + полоса цифр. Кнопок в первом экране
          нет (10.09.2026): контакты — в полосе разделов и в форме расчёта ниже. */}
      {isInd && (
        <>
          <section className="relative overflow-hidden bg-[#031422] text-white">
            <div className="absolute inset-0" aria-hidden>
              <Image
                src={`${IMG_BASE}/${svc.key}.jpg?v=11`}
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
              {stars(true)}
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">{intro}</p>
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

      {/* Услуги: первый экран — «лицо» (решение владельца 10.09.2026). Контакты сюда не
          ставим — они перебивали текст; КП на компьютере в полосе разделов, на телефоне —
          блоком перед вопросами и тонкой панелью внизу. H1 один: на телефоне он лежит
          поверх фото во всю ширину (та же ячейка сетки), на компьютере — справа от фото. */}
      {!isInd && (
        <div className="container-page pt-4 sm:pt-8">
          <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors">{t("home")}</Link>
            <span className="text-slate-300">/</span>
            <Link href="/solutions" className="hover:text-slate-900 transition-colors">{t("servicesCrumb")}</Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 normal-case tracking-normal">{title}</span>
          </nav>

          <div className="grid [grid-template-areas:'media'_'body'] lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)] lg:gap-x-10 lg:[grid-template-areas:'media_title'_'media_body']">
            <div className="relative h-[340px] overflow-hidden bg-slate-900 [grid-area:media] max-lg:mx-[calc(50%-50vw)] sm:h-[400px] lg:h-auto lg:min-h-[300px] lg:self-stretch lg:rounded-2xl lg:border lg:border-slate-200">
              <Image
                src={`${IMG_BASE}/${svc.key}.jpg?v=11`}
                alt={title}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030e18] via-[#030e18]/55 to-transparent lg:hidden" aria-hidden />
            </div>
            <div className="relative z-10 self-end pb-5 [grid-area:media] lg:self-end lg:pb-0 lg:[grid-area:title]">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-300 lg:text-brand-600">{t("serviceTag")}</p>
              <h1 className="mt-2 text-[26px] font-black leading-tight tracking-tight text-white sm:text-4xl lg:text-slate-900">{h1}</h1>
            </div>
            <div className="[grid-area:body] lg:self-start">
              {stars(false)}
              <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{intro}</p>
              {!isReference && (
                <div className="mt-4 grid max-w-xl grid-cols-3 overflow-hidden rounded-xl border border-slate-200 text-center">
                  {([["factVisitV", "factVisitL"], ["factKpV", "factKpL"], ["factWarrantyV", "factWarrantyL"]] as const).map(([v, l], i) => (
                    <div key={v} className={`px-2 py-2.5 ${i ? "border-l border-slate-200" : ""}`}>
                      <div className="text-[15px] font-black text-brand-700 sm:text-base">{t(v)}</div>
                      <div className="mt-0.5 text-[11.5px] leading-snug text-slate-500 sm:text-xs">{t(l)}</div>
                    </div>
                  ))}
                </div>
              )}
              {!isReference && (heroPrice || CALC_SERVICES.has(svc.key)) && (
                <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  {heroPrice ? (
                    <>
                      <span className="text-sm font-semibold text-slate-500">{heroPrice.label}</span>
                      <span className="text-xl font-black tabular-nums text-slate-900 sm:text-2xl">{heroPrice.price}</span>
                    </>
                  ) : null}
                  {CALC_SERVICES.has(svc.key) ? (
                    <Link href="/calculator" className="text-sm font-bold text-brand-700 hover:underline">{tcalc("promoBtn")} →</Link>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Липкая полоса разделов — прямой потомок обёртки страницы, иначе sticky
          отлипнет на границе первого контейнера */}
      <SectionNav items={navItems} ariaLabel={t("navAria")} quoteLabel={t("getQuote")}
        quoteProduct={`${quoteProduct} (полоса разделов)`} showQuote={!isReference} />

      <div className="container-page pb-2">
        {/* Состав работ — компактным чек-листом во всю ширину */}
        <section id="sostav" className="mt-6 scroll-mt-32 lg:mt-8">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("whatInc")}</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("worksTitle")}</h2>
          <ul className="mt-4 grid gap-x-8 gap-y-2.5 rounded-2xl bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-3 lg:p-5">
            {works.map((w) => (
              <li key={w} className="flex items-start gap-2.5 text-sm font-semibold leading-snug text-slate-800">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                {w}
              </li>
            ))}
          </ul>
        </section>

        {/* SEO-текст целиком: вводный абзац во всю ширину, остальное — в две колонки
            (была узкая колонка на треть экрана с пустотой справа) */}
        {content && (
          <section id="about" className="mt-12 scroll-mt-32">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{content.heading}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">{content.paragraphs[0]}</p>
            {content.paragraphs.length > 1 && (
              <div className="mt-4 gap-12 lg:columns-2">
                {content.paragraphs.slice(1).map((p, i) => (
                  <p key={i} className="mb-4 text-sm leading-relaxed text-slate-600 sm:text-base">{p}</p>
                ))}
              </div>
            )}
          </section>
        )}

        {/* СКС и ЛВС: типовые конфигурации, этапы, бренды каталога */}
        {svc.key === "network" && <NetworkDetails locale={locale} />}

        {/* Умный дом: витрина устройств Tuya из каталога (фото + перелинковка) */}
        {svc.key === "smarthome" && <SmartHomeDevices locale={locale} />}

        {/* Серверы H3C: перечень поставляемого оборудования (модельные линейки) */}
        {svc.key === "virtualization" && <H3cEquipment locale={locale} />}

        {/* Серверные и ЦОД: типовые конфигурации, этапы, каталог */}
        {svc.key === "server" && <DataCenterDetails locale={locale} />}

        {/* Типовые решения и ценовой ориентир — один раздел (якорь «Цены») */}
        <div id={hasPrices ? "prices" : undefined} className="scroll-mt-32">
          {!["network", "server"].includes(svc.key) && <ServicePackages k={svc.key} locale={locale} />}
          <ServicePriceHint k={svc.key} locale={locale} />
        </div>

        {/* Принцип работы */}
        <ServiceScheme k={svc.key} locale={locale} />

        {/* Смежные услуги — перелинковка внутри «семьи» (сети / серверы) */}
        <RelatedServices current={svc.key} locale={locale} />

        {/* Услуги: витрина оборудования и кейсы — выше, рядом с предложением.
            Проекты и отрасли — в одном ряду, только если есть оба блока.
            grid-cols-1 обязателен: без него колонка растягивается под ленту «вбок»,
            страница становится шире экрана и телефон уменьшает масштаб. */}
        {!isInd && equipmentBlock}
        {!isInd && bridgeLink}
        {!isInd && (casesBlock || svcIndustries.length > 0) && (
          <div className={`mt-12 grid grid-cols-1 gap-10 ${casesBlock && svcIndustries.length > 0 ? "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start" : ""}`}>
            {casesBlock}
            {svcIndustries.length > 0 && <ServiceIndustriesBlock locale={locale} serviceKey={svc.key} className="" />}
          </div>
        )}
      </div>

      {/* Инженерный контент отрасли — полноширинные секции: специфика с фото,
          этапы линией на сером, сложности на тёмном, FAQ узкой колонкой */}
      {isInd && <IndustryDetailsBlock locale={locale} industryKey={svc.key} />}

      {/* Отрасли: расчёт проекта — единственный призыв внизу страницы (было четыре подряд).
          Слева заголовок, гарантии и контакты, справа форма. */}
      {isInd && (
        <section id="order" className="scroll-mt-32 bg-gradient-to-br from-brand-700 to-[#134e5e] text-white">
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
              <div data-placement="order-block" className="mt-6 grid max-w-md grid-cols-3 gap-2">
                <ContactButtons compact full />
              </div>
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

        {/* Отрасли: кейсы и витрина — внизу, как раньше */}
        {isInd && casesBlock && <div className="mt-12">{casesBlock}</div>}
        {isInd && equipmentBlock}
        {isInd && bridgeLink}

        {/* Телефон: контакты одним блоком — перед вопросами, когда человек уже прочитал
            предложение, цены и проекты (на компьютере КП — в полосе разделов) */}
        {!isInd && !isReference && (
          <section id="order" className="mt-10 scroll-mt-28 lg:hidden">
            <div className="rounded-2xl bg-gradient-to-br from-brand-900 via-brand-700 to-brand-600 p-5 text-white">
              <p className="text-xs font-black uppercase tracking-widest text-cyan-200">{t("orderLabel")}</p>
              <h2 className="mt-1.5 text-[22px] font-black leading-tight">{t("orderTitle")}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{t("orderText")}</p>
              <div className="mt-4">
                <RequestQuoteButton label={t("getQuote")} variant="white" fullWidth productName={`${quoteProduct} (блок заказа)`} />
              </div>
              <div data-placement="order-block" className="mt-2 grid grid-cols-3 gap-2">
                <ContactButtons compact full />
              </div>
            </div>
          </section>
        )}

        {/* Вопросы и статьи — в одном ряду */}
        {(faq.length > 0 || relatedArticles.length > 0) && (
          <div className={`mt-12 grid grid-cols-1 gap-10 ${faq.length > 0 && relatedArticles.length > 0 ? "lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start" : ""}`}>
            {faq.length > 0 && (
              <section id="faq" className="scroll-mt-32">
                <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("faqLabel")}</p>
                <h2 className="mt-1 mb-5 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{tcm("faqTitle")}</h2>
                <FaqAccordion items={faq} />
              </section>
            )}
            {relatedArticles.length > 0 && (
              <section>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{articlesTitle}</h2>
                {/* заголовками: все ссылки на месте, колонка встаёт вровень с вопросами */}
                <div className={`mt-5 grid gap-2 ${faq.length > 0 ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                  {relatedArticles.map((a) => {
                    const b = a.loc[locale]!;
                    return (
                      <Link key={a.slug} href={`/blog/${a.slug}`} title={b.excerpt} className="group flex items-start justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 transition-colors hover:border-brand-300">
                        <span className="text-sm font-bold leading-snug text-slate-900 group-hover:text-brand-700">{b.title}</span>
                        <span className="shrink-0 text-brand-600" aria-hidden>→</span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
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
                        {[1, 2, 3, 4, 5].map((st) => (
                          <svg key={st} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${st <= r.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
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

      {/* Финальный призыв — у услуг и только на компьютере (на телефоне контакты уже
          были блоком перед вопросами); у отраслей его заменяет форма расчёта */}
      {!isInd && !isReference && (
        <section className="hidden bg-slate-900 text-white lg:block">
          <div className="container-page flex flex-col items-center gap-5 py-12 text-center sm:py-14">
            <p className="text-xs font-black uppercase tracking-widest text-brand-400">{t("ctaLabel")}</p>
            <h2 className="max-w-2xl text-2xl sm:text-3xl font-black tracking-tight">{t("needTitle", { name: title.toLowerCase() })}</h2>
            <p className="max-w-xl text-sm text-slate-300 sm:text-base">
              {t("detailCtaText")}
            </p>
            <RequestQuoteButton label={t("getQuote")} variant="brand" productName={`${quoteProduct} (CTA)`} />
          </div>
        </section>
      )}

      {/* Телефон: тонкая панель контактов — после раздела цен, прячется у блока заказа */}
      {!isReference && (
        <>
          <MobileContactBar startId={barStart} callLabel={t("barCall")} quoteLabel={t("getQuote")}
            quoteProduct={`${quoteProduct} (панель внизу)`} />
          <div className="h-16 lg:hidden" aria-hidden />
        </>
      )}
    </div>
  );
}
