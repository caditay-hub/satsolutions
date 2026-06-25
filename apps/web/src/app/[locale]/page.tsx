import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import dynamic from "next/dynamic";
import { getBrands, getCategories, getPartners, getPortfolio, getProducts, getSitePage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { getTranslations, getLocale } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import { ProductCard } from "@/components/Cards";
import { Reveal } from "@/components/Reveal";
import { AutoPlayVideo } from "@/components/AutoPlayVideo";
import { INDUSTRIES } from "@/lib/servicesData";
import { localizePortfolioProject } from "@/lib/contentI18n";
import { localizeProductName } from "@/lib/productI18n";

const SOLUTIONS_IMG = "https://api.satsolutions.uz/uploads/services-page";

const FeedbackForm = dynamic(
  () => import("@/components/FeedbackForm").then((m) => m.FeedbackForm),
  { ssr: true, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-slate-100" /> }
);

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const tm = await getTranslations({ locale, namespace: "meta" });
  return {
    title: { absolute: tm("homeTitle") },
    description: tm("homeDesc"),
    alternates: hreflangAlternates("/", locale),
    openGraph: { title: tm("homeTitle"), description: tm("homeDesc"), images: [{ url: "/og.png", width: 1200, height: 630, alt: tm("homeTitle") }] },
    twitter: { card: "summary_large_image", title: tm("homeTitle"), description: tm("homeDesc"), images: ["/og.png"] }
  };
}

// ─── Static service directions ────────────────────────────────────────────────
const DIRECTIONS = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82V15.18a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
      </svg>
    ),
    title: "Видеонаблюдение",
    desc: "IP и HDCVI камеры, NVR/DVR регистраторы, облачный и локальный мониторинг 24/7",
    href: "/solutions/cctv",
    accent: "teal",
    video: "dir-cctv",
    poster: "cctv.jpg",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Контроль доступа",
    desc: "Биометрические терминалы, карточные считыватели, турникеты, шлагбаумы и ANPR",
    href: "/solutions/access",
    accent: "blue",
    video: "dir-access",
    poster: "access.jpg",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
    title: "Пожарная сигнализация",
    desc: "Проектирование, поставка и монтаж автоматических систем пожарной сигнализации и пожаротушения",
    href: "/solutions/fire",
    accent: "red",
    video: "dir-fire",
    poster: "fire-2.jpg",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    ),
    title: "IT-инфраструктура",
    desc: "Структурированные кабельные системы, PoE-коммутаторы, Wi-Fi, серверные стойки и ИБП",
    href: "/solutions/network",
    accent: "teal",
    video: "dir-network",
    poster: "network.jpg",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    title: "Домофонные системы",
    desc: "Видеодомофоны Android и IP для жилых и коммерческих объектов, интеграция с СКУД",
    href: "/solutions/intercom",
    accent: "blue",
    video: "dir-intercom",
    poster: "intercom-3.jpg",
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "Охранная сигнализация",
    desc: "Беспроводные и проводные охранные панели, PIR датчики, сирены, интеграция с пультом охраны",
    href: "/solutions/alarm",
    accent: "red",
    video: "dir-alarm-face",
    poster: "alarm-dir-face.jpg",
  },
];

const ACCENT_CLASSES: Record<string, { bg: string; text: string; border: string; iconBg: string }> = {
  teal: { bg: "bg-brand-50", text: "text-brand-700", border: "border-brand-200 hover:border-brand-400", iconBg: "bg-brand-100 text-brand-700" },
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200 hover:border-blue-400", iconBg: "bg-blue-100 text-blue-700" },
  red:  { bg: "bg-red-50",  text: "text-red-600",  border: "border-red-200  hover:border-red-400",  iconBg: "bg-red-100  text-red-600"  },
};

const WHY_US = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="9" r="5.2" />
        <path d="M9.6 13.6 8.2 21l3.8-2.1 3.8 2.1-1.4-7.4" />
        <path d="M10.2 9.1l1.3 1.3 2.4-2.5" />
      </svg>
    ),
    title: "Авторизованный интегратор",
    desc: "Официальный стратегический системный интегратор Dahua Technology в Узбекистане. Прямые поставки от производителей.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        <path d="M14 3v5h5" />
        <path d="M9.5 14.5l1.8 1.8 3.4-3.6" />
      </svg>
    ),
    title: "Лицензированная компания",
    desc: "Лицензии Национальной гвардии (охрана) и МЧС (пожарная безопасность). Работаем строго в рамках законодательства РУз.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 11A8 8 0 1 0 12 20" />
        <path d="M20 4v7h-7" />
        <path d="M16 20l2 2 4-4" />
      </svg>
    ),
    title: "Полный цикл работ",
    desc: "Проектирование → поставка → монтаж → наладка → техническое обслуживание. Один подрядчик от начала до конца.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4.5" />
      </svg>
    ),
    title: "Гарантия и сервис",
    desc: "Официальная гарантия на всё оборудование. Собственный сервисный центр, выезд инженера в течение 24 часов.",
  },
];

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const ts = await getTranslations("services");
  const dir = t.raw("dir") as Record<string, [string, string]>;
  const why = t.raw("why") as Record<string, [string, string]>;
  const [
    { categories },
    { items: rawPortfolio },
    { brands },
    { partners },
    { items: recommended },
    { items: latestProducts },
  ] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    getPortfolio(1, 3).catch(() => ({ items: [], total: 0 })),
    getBrands().catch(() => ({ brands: [] })),
    getPartners().catch(() => ({ partners: [] })),
    getProducts(1, 20, { recommended: true }).catch(() => ({ items: [], total: 0 })),
    getProducts(1, 20).catch(() => ({ items: [], total: 0 })),
  ]);
  // Merge recommended first, fill with latest, dedupe
  const seenIds = new Set<string>();
  const productFeed = [...recommended, ...latestProducts]
    .filter((p) => {
      if (seenIds.has(p.id)) return false;
      seenIds.add(p.id);
      return true;
    })
    .slice(0, 20);

  const portfolio = rawPortfolio.map((p) => localizePortfolioProject(p, locale));

  let heroSlides: HeroSlide[] = [];
  let heroBgColor: string | null = null;
  try {
    const { page } = await getSitePage("site");
    heroBgColor = (page as any)?.data?.heroBgColor || null;
    const raw = (page as any)?.data?.heroSlides;
    if (Array.isArray(raw)) {
      heroSlides = raw
        .map((it: any, idx: number) => ({
          id: String(it?.id ?? idx + 1),
          title: String(it?.title ?? ""),
          text: typeof it?.text === "string" ? it.text : "",
          imageUrl: String(it?.imageUrl ?? ""),
          videoUrl: typeof it?.videoUrl === "string" ? it.videoUrl : "",
          sortOrder: Number(it?.sortOrder ?? 0) || 0,
          published: it?.published !== false,
          buttons: Array.isArray(it?.buttons)
            ? it.buttons
                .map((b: any) => ({ label: String(b?.label ?? "").trim(), href: String(b?.href ?? "").trim() }))
                .filter((b: any) => b.label && b.href)
                .slice(0, 3)
            : [],
        }))
        .filter((s) => s.id && (s.imageUrl || s.videoUrl));
    }
  } catch { /* ignore */ }

  // Слайды в БД на русском (контент). Для остальных языков накладываем перевод
  // по индексу из messages (home.heroSlides): заголовок, текст и подписи кнопок,
  // сохраняя картинки/видео/ссылки из БД.
  if (locale !== "ru") {
    const tr = t.raw("heroSlides") as { title: string; text: string; buttons: string[] }[];
    if (Array.isArray(tr) && tr.length) {
      heroSlides = heroSlides.map((s, i) => {
        const o = tr[i];
        if (!o) return s;
        return {
          ...s,
          title: o.title ?? s.title,
          text: o.text ?? s.text,
          buttons: (s.buttons ?? []).map((b, j) => ({ ...b, label: o.buttons?.[j] ?? b.label }))
        };
      });
    }
  }

  const topCats = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => a.name.localeCompare(b.name, "ru"))
    .slice(0, 20);

  const brandList = brands.length > 0 ? brands : [];
  // Не показываем партнёров, дублирующих бренд по названию (напр. Dahua и в брендах, и в партнёрах)
  const brandNames = new Set(brandList.map((b) => (b.name || "").trim().toLowerCase()));
  const partnerList = (partners.length > 0 ? partners : [])
    .filter((p) => !brandNames.has((p.name || "").trim().toLowerCase()))
    .slice(0, 8);

  return (
    <div className="bg-white">

      {/* ══════════════════════════════════════════════════════
          HERO — full-bleed
      ══════════════════════════════════════════════════════ */}
      <section
        className="relative"
        style={heroBgColor ? { backgroundColor: heroBgColor } : {}}
      >
        <HeroCarousel
          slides={heroSlides}
          fallbackTitle={t("heroTitle")}
          fallbackText={t("heroText")}
          prevLabel={t("heroPrev")}
          nextLabel={t("heroNext")}
          slideLabel={t("heroSlide")}
        />
      </section>

      {/* ══════════════════════════════════════════════════════
          НАПРАВЛЕНИЯ ДЕЯТЕЛЬНОСТИ
      ══════════════════════════════════════════════════════ */}
      <section className="container-page py-14 sm:py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t("whatWeDo")}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{t("directionsTitle")}</h2>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm">
            {t("directionsSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DIRECTIONS.map((d, di) => {
            const a = ACCENT_CLASSES[d.accent];
            const dk = ["cctv", "access", "fire", "it", "intercom", "alarm"][di];
            return (
              <Reveal key={d.title} delay={(di % 3) * 90} className="h-full [&>a]:h-full">
              <Link
                href={d.href}
                className={`group rounded-2xl border-2 bg-white flex flex-col overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 ${a.border}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                  {d.video ? (
                    <AutoPlayVideo
                      src={`${SOLUTIONS_IMG}/${d.video}.mp4?v=1`}
                      poster={`${SOLUTIONS_IMG}/${d.poster}?v=9`}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={`${SOLUTIONS_IMG}/${d.poster}?v=10`}
                      alt={d.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      unoptimized
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                  <div className={`absolute left-3 top-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 shadow-sm backdrop-blur-sm ${a.text} transition-transform group-hover:scale-110`}>
                    {d.icon}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-slate-700 transition-colors">{dir[dk][0]}</h3>
                  <p className="mt-2 text-sm text-slate-500 leading-relaxed">{dir[dk][1]}</p>
                  <span className={`mt-auto pt-3 text-xs font-black uppercase tracking-wider ${a.text}`}>
                    {t("more")} →
                  </span>
                </div>
              </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ПОПУЛЯРНАЯ ПРОДУКЦИЯ — горизонтальная лента
      ══════════════════════════════════════════════════════ */}
      {productFeed.length > 0 && (
        <section className="py-10 sm:py-12">
          <div className="container-page !py-0">
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600 mb-1.5">{t("catalogLabel")}</p>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("popularProducts")}</h2>
              </div>
              <Link
                href="/products"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-brand-700 ring-1 ring-brand-200 hover:ring-brand-400 hover:bg-brand-50 transition-all whitespace-nowrap"
              >
                {t("allProducts")}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Авто-карусель (непрерывная лента, пауза при наведении) */}
            <div className="-mx-3 sm:-mx-6 overflow-hidden py-1">
              <div className="flex gap-4 sm:gap-5 w-max animate-scroll2 hover:[animation-play-state:paused]">
                {productFeed.map((p, i) => (
                  <div key={`a-${p.id}-${i}`} className="shrink-0 w-[180px] sm:w-[220px] md:w-[240px]">
                    <ProductCard p={p} name={localizeProductName(p, locale)} />
                  </div>
                ))}
                <div className="contents" aria-hidden="true">
                {productFeed.map((p, i) => (
                  <div key={`b-${p.id}-${i}`} className="shrink-0 w-[180px] sm:w-[220px] md:w-[240px]">
                    <ProductCard p={p} name={localizeProductName(p, locale)} />
                  </div>
                ))}
                </div>
              </div>
            </div>

            <div className="mt-4 sm:hidden text-center">
              <Link href="/products" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">{t("allProducts")} →</Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          ГОТОВЫЕ РЕШЕНИЯ — лента
      ══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-12 sm:py-14 border-y border-slate-100">
          <div className="container-page !py-0">
            <div className="flex items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-600 mb-1.5">{t("readySolutions")}</p>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{t("readySolutions")}</h2>
              </div>
              <Link
                href="/solutions"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-brand-700 ring-1 ring-brand-200 hover:ring-brand-400 hover:bg-brand-50 transition-all whitespace-nowrap"
              >
                {t("allServices")}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Horizontal scroll rail — отраслевые решения */}
            <div className="-mx-3 sm:-mx-6 px-3 sm:px-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-4 sm:gap-5 pb-4">
                {INDUSTRIES.map((s) => (
                  <Link
                    key={s.key}
                    href={`/solutions/${s.key}`}
                    className="snap-start shrink-0 w-[280px] sm:w-[340px] md:w-[380px] group flex flex-col rounded-2xl bg-white ring-1 ring-slate-200/70 shadow-sm overflow-hidden hover:shadow-lg hover:ring-brand-300 transition-all"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                      <Image
                        alt={s.title}
                        src={`${SOLUTIONS_IMG}/${s.key}.jpg?v=9`}
                        fill
                        sizes="(max-width: 640px) 90vw, 380px"
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="font-black text-slate-900 text-base line-clamp-2 group-hover:text-brand-700 transition-colors">
                        {ts(`${s.key}.title`)}
                      </h3>
                      <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{ts(`${s.key}.desc`)}</p>
                      <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-600">
                        {t("more")}
                        <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-4 sm:hidden text-center">
              <Link href="/solutions" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">{t("allServices")} →</Link>
            </div>
          </div>
        </section>

      {/* ══════════════════════════════════════════════════════
          ПОЧЕМУ МЫ
      ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-900 text-white py-14 sm:py-16">
        <div className="container-page">
          <div className="text-center mb-10">
            <p className="text-xs font-black uppercase tracking-widest text-brand-400 mb-2">{t("whyLabel")}</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{t("whyTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((w, wi) => { const wk = ["integrator","licensed","fullcycle","warranty"][wi]; return (
              <Reveal key={wk} delay={(wi % 4) * 90} className="h-full [&>div]:h-full">
              <div className="rounded-2xl bg-slate-800 border border-slate-700 p-6 flex flex-col gap-3 hover:bg-slate-750 hover:border-brand-500/60 transition-colors">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/20 text-brand-400">{w.icon}</span>
                <h3 className="text-base font-black text-white">{why[wk][0]}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{why[wk][1]}</p>
              </div>
              </Reveal>
            ); })}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-black px-8 py-3.5 text-sm transition-colors"
            >
              {t("getConsult")}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 hover:border-slate-400 text-white font-black px-8 py-3.5 text-sm transition-colors"
            >
              {t("aboutCompany")}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          КАТАЛОГ ПРОДУКЦИИ (категории)
      ══════════════════════════════════════════════════════ */}
      {topCats.length > 0 && (
        <section className="container-page py-14 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-1">{t("catalogLabel")}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("catalogTitle")}</h2>
            </div>
            <Link href="/catalog" className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-600 transition-colors whitespace-nowrap">
              {t("wholeCatalog")} →
            </Link>
          </div>

          {/* Авто-карусель категорий (пауза при наведении) */}
          <div className="-mx-3 sm:-mx-6 overflow-hidden py-1">
            <div className="flex gap-3 w-max animate-scroll2 hover:[animation-play-state:paused]">
              {[false, true].map((clone) => (
              <div key={clone ? "clone" : "orig"} className="contents" aria-hidden={clone || undefined}>
              {topCats.map((c) => {
                const img = resolveImageUrl(c.coverImageUrl);
                return (
                  <Link
                    key={`${clone ? "b" : "a"}-${c.id}`}
                    href={`/products/type/${typeSlug(c.name)}`}
                    className="shrink-0 w-[150px] sm:w-[180px] group flex flex-col items-center rounded-2xl border-2 border-slate-100 hover:border-brand-300 bg-white p-4 gap-3 transition-all hover:shadow-md"
                    tabIndex={clone ? -1 : undefined}
                  >
                    <div className="relative h-16 w-full overflow-hidden rounded-xl bg-slate-50">
                      {img ? (
                        <Image
                          alt={c.name}
                          src={img}
                          fill
                          sizes="180px"
                          unoptimized
                          className="object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-300">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-brand-700 text-center leading-snug transition-colors line-clamp-2">
                      {c.name}
                    </span>
                  </Link>
                );
              })}
              </div>
              ))}
            </div>
          </div>

          <div className="mt-5 sm:hidden text-center">
            <Link href="/catalog" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">{t("wholeCatalog")} →</Link>
          </div>
        </section>
      )}


      {/* ══════════════════════════════════════════════════════
          ПОРТФОЛИО
      ══════════════════════════════════════════════════════ */}
      {portfolio.length > 0 && (
        <section className="container-page py-14 sm:py-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-1">{t("portfolioLabel")}</p>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("portfolioTitle")}</h2>
            </div>
            <Link href="/portfolio" className="hidden sm:inline-flex text-sm font-bold text-brand-700 hover:text-brand-600 whitespace-nowrap">
              {t("allProjects")} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {portfolio.map((p, pi) => {
              const img = resolveImageUrl(p.coverImageUrl);
              return (
                <Reveal key={p.id} delay={(pi % 3) * 90} className="h-full [&>a]:h-full">
                <Link
                  href={`/portfolio/${p.slug}`}
                  className="group relative flex flex-col rounded-2xl overflow-hidden border border-slate-200 hover:shadow-xl transition-all hover:border-brand-300"
                >
                  <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                    {img ? (
                      <Image alt={p.title} src={img} fill sizes="(max-width: 640px) 100vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105" quality={80} />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-slate-200 text-sm font-bold text-slate-400">{t("noImage")}</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 bg-white flex flex-col gap-1">
                    <h3 className="font-black text-slate-900 text-sm line-clamp-1 group-hover:text-brand-700 transition-colors">{p.title}</h3>
                    {p.excerpt && <p className="text-xs text-slate-500 line-clamp-1">{p.excerpt}</p>}
                    <span className="mt-2 text-xs font-black uppercase tracking-wider text-brand-600">{t("view")}</span>
                  </div>
                </Link>
                </Reveal>
              );
            })}
          </div>

          <div className="mt-5 sm:hidden text-center">
            <Link href="/portfolio" className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">{t("allProjects")} →</Link>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          БРЕНДЫ-ПАРТНЁРЫ
      ══════════════════════════════════════════════════════ */}
      {(brandList.length > 0 || partnerList.length > 0) && (
        <section className="bg-slate-50 py-12 sm:py-14 border-y border-slate-200">
          <div className="container-page">
            <p className="text-center text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t("distributorLabel")}</p>
            <h2 className="text-center text-2xl font-black text-slate-900 tracking-tight mb-8">{t("officialBrands")}</h2>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {brandList.map((b) => {
                const logo = resolveImageUrl(b.logoImageUrl);
                return (
                  <div
                    key={b.id}
                    className="flex h-16 w-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
                  >
                    {logo ? (
                      <Image alt={b.name} src={logo} width={120} height={48} className="h-10 w-auto object-contain" />
                    ) : (
                      <span className="text-sm font-black text-slate-700">{b.name}</span>
                    )}
                  </div>
                );
              })}
              {partnerList.map((p) => {
                const logo = resolveImageUrl(p.logoImageUrl);
                return (
                  <a
                    key={p.id}
                    href={p.websiteUrl || undefined}
                    target={p.websiteUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    className="flex h-16 w-[140px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 shadow-sm hover:shadow-md hover:border-brand-300 transition-all"
                  >
                    {logo ? (
                      <Image alt={p.name} src={logo} width={120} height={48} className="h-10 w-auto object-contain" />
                    ) : (
                      <span className="text-sm font-black text-slate-700">{p.name}</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          CTA + ОБРАТНАЯ СВЯЗЬ
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 sm:py-16 bg-white">
        <div className="container-page">
          <div className="mx-auto max-w-2xl text-center mb-8">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600 mb-2">{t("contactLabel")}</p>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t("contactTitle")}</h2>
            <p className="mt-3 text-sm text-slate-500">
              {t("contactSubtitle")}
            </p>
          </div>

          {/* Quick contacts strip */}
          <div className="mx-auto max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                ),
                label: t("phone"),
                value: "+998 99 554-69-69",
                href: "tel:+998995546969",
              },
              {
                icon: (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                  </svg>
                ),
                label: "Telegram",
                value: "@SAT_zayavki_online_bot",
                href: "https://t.me/SAT_zayavki_online_bot",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
                label: "Email",
                value: "sales@satsolutions.uz",
                href: "mailto:sales@satsolutions.uz",
              },
            ].map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 hover:border-brand-300 hover:bg-brand-50 transition-all"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                  {c.icon}
                </span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.label}</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{c.value}</div>
                </div>
              </a>
            ))}
          </div>

          <div className="mx-auto max-w-2xl">
            <FeedbackForm />
          </div>
        </div>
      </section>

    </div>
  );
}
