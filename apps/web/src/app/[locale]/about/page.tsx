import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getBrands, getSitePage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { contactGeo } from "@/lib/geo";
import { Reveal } from "@/components/Reveal";
import { DocPreview } from "@/components/DocPreview";
import { getTranslations, getLocale } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { localizeAboutContent, localizeAddress } from "@/lib/contentI18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  try {
    const { page } = await getSitePage("about");
    const desc = localizeAboutContent(page.content || "", locale).slice(0, 160);
    return {
      title: t("title"),
      description: desc || t("title"),
      alternates: hreflangAlternates("/about", locale),
      openGraph: { title: t("title"), description: desc || t("title"), locale: ogLocale(locale), images: ["/og.png"] }
    };
  } catch {
    return { title: t("title") };
  }
}

// ─── Static certificates / licenses data ──────────────────────────────────────
const DOC_BASE = "https://api.satsolutions.uz/uploads/documents";

const LICENSES = [
  {
    id: "lic-security",
    title: "Лицензия на охранные системы",
    subtitle: "Подтверждение №1554491 • Активный",
    issuedBy: "Национальная гвардия Республики Узбекистан",
    description: "Монтаж, наладка, ремонт и техническое обслуживание технических средств и систем охраны",
    pdfUrl: `${DOC_BASE}/license-security.pdf`,
    color: "blue",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4.5" />
      </svg>
    ),
  },
  {
    id: "lic-fire",
    title: "Лицензия на пожарные системы",
    subtitle: "Подтверждение №913518 • Активный",
    issuedBy: "Министерство по чрезвычайным ситуациям РУз",
    description: "Монтаж, наладка, ремонт и ТО систем автоматического пожаротушения и пожарной сигнализации",
    pdfUrl: `${DOC_BASE}/license-fire.pdf`,
    color: "red",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c2 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.6.6-2.7 1.6-3.7C10 8 11 6 12 3z" />
        <path d="M12 21a6 6 0 0 0 6-6c0-1-.3-2-.8-2.8" />
        <path d="M6.8 12.2A6 6 0 0 0 12 21" />
      </svg>
    ),
  },
];

const CERTIFICATES = [
  {
    id: "cert-dahua-integrator",
    title: "Авторизованный стратегический системный интегратор",
    issuedBy: "Dahua Technology",
    description: "Authorized Strategic System Integrator в Узбекистане. Действует с 1 января по 31 декабря 2026 г.",
    logoText: "dahua",
    logoUrl: `${DOC_BASE}/dahua-integrator-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/dahua-integrator.pdf`,
    badgeColor: "red",
  },
  {
    id: "cert-h3c",
    title: "Сертифицированный партнёр",
    issuedBy: "H3C Technologies",
    description: "H3C Certified Partner в Узбекистане — коммутаторы, маршрутизаторы и серверные решения. Действует до 31 декабря 2027 г.",
    logoText: "H3C",
    logoUrl: `${DOC_BASE}/h3c-partner-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/h3c-partner.pdf`,
    badgeColor: "red",
  },
  {
    id: "cert-lenovo",
    title: "Lenovo 360 Authorized 2026",
    issuedBy: "Lenovo",
    description: "Авторизованный партнёр Lenovo 360 — Intelligent Devices и Infrastructure Solutions. Действует до 31 марта 2027 г.",
    logoText: "Lenovo",
    logoUrl: `${DOC_BASE}/lenovo-360-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/lenovo-360.pdf`,
    badgeColor: "red",
  },
  {
    id: "cert-eltex",
    title: "Авторизованный партнёр",
    issuedBy: "Eltex Alatau",
    description: "Авторизованный партнёр ТОО «ЭлтексАлатау» — производителя IT-устройств и телекоммуникационного оборудования. Действует до 31 декабря 2026 г.",
    logoText: "ELTEX",
    logoUrl: `${DOC_BASE}/eltex-partner-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/eltex-partner.pdf`,
    badgeColor: "blue",
  },
  {
    id: "cert-ruijie",
    title: "Silver Partner",
    issuedBy: "Ruijie Networks Co., Ltd",
    description: "Авторизованный Silver Partner в Узбекистане — продажа коммутаторов, маршрутизаторов и беспроводного оборудования. 2025 г.",
    logoUrl: `${DOC_BASE}/ruijie-partner.jpg`,
    logoText: "Ruijie",
    pdfUrl: `${DOC_BASE}/ruijie-partner.jpg`,
    badgeColor: "yellow",
  },
  {
    id: "cert-schneider",
    title: "Select Partner · APC IT Solution Provider",
    issuedBy: "Schneider Electric",
    description: "Официальный Select Partner Schneider Electric (APC IT Solution Provider). С октября 2024 г.",
    logoText: "Schneider Electric",
    logoUrl: `${DOC_BASE}/schneider-partner-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/schneider-partner.pdf`,
    badgeColor: "green",
  },
  {
    id: "cert-pantum",
    title: "Официальный партнёр",
    issuedBy: "Pantum International Limited",
    description: "Официальный партнёр Pantum International Limited в Узбекистане. Авторизованные продажи принтеров и МФУ.",
    logoText: "PANTUM",
    logoUrl: `${DOC_BASE}/pantum-partner-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/pantum-partner.pdf`,
    badgeColor: "gray",
  },
];

const LETTERS = [
  {
    id: "letter-uzauto",
    title: "Рекомендательное письмо",
    issuedBy: "АО «UzAuto Motors»",
    description: "Поставка серверного оборудования и камер по договорам 2023–2025 гг. UzAuto Motors рекомендует компанию как надёжного и компетентного партнёра.",
    logoText: "UzAuto",
    logoUrl: `${DOC_BASE}/letter-uzauto-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/letter-uzauto.pdf`,
    badgeColor: "blue",
  },
  {
    id: "cert-dahua-partner",
    title: "Рекомендательное письмо надёжного партнёра",
    issuedBy: "Dahua Technology (HK) Limited",
    description: "Официальное рекомендательное письмо. Подтверждает высокий профессионализм и надёжность сотрудничества с 2024 г.",
    logoText: "dahua",
    logoUrl: `${DOC_BASE}/dahua-partner-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/dahua-partner.pdf`,
    badgeColor: "red",
  },
  {
    id: "letter-hokimiyat",
    title: "Рекомендательное письмо",
    issuedBy: "Хокимият г. Ташкента",
    description: "Дирекция по управлению малыми и молодёжными промышленными зонами: видеонаблюдение и подключение сети на 70 рабочих мест в главном здании.",
    logoText: "Hokimiyat",
    logoUrl: `${DOC_BASE}/letter-hokimiyat-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/letter-hokimiyat.pdf`,
    badgeColor: "green",
  },
  {
    id: "letter-ton",
    title: "Рекомендательное письмо",
    issuedBy: "Transport Oqimi Nazorati",
    description: "Системы безопасности и видеонаблюдение: все задачи решены в срок, отдельно отмечено соотношение цены и качества.",
    logoText: "TON",
    logoUrl: `${DOC_BASE}/letter-ton-thumb.jpg`,
    pdfUrl: `${DOC_BASE}/letter-ton.pdf`,
    badgeColor: "gray",
  },
];

const BADGE_COLORS: Record<string, string> = {
  red:    "bg-red-50 text-red-700 border-red-200",
  yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
  green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
  gray:   "bg-slate-50 text-slate-700 border-slate-200",
  blue:   "bg-blue-50 text-blue-700 border-blue-200",
};

function SectionHeading({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
        {icon}
      </span>
      <h2 className="text-2xl font-black tracking-tight text-slate-900">{title}</h2>
    </div>
  );
}

const DownloadIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export default async function AboutPage() {
  const t = await getTranslations("about");
  const locale = await getLocale();
  try {
    const [{ page }, { brands }, { page: contact }] = await Promise.all([
      getSitePage("about").catch(() => ({ page: { title: "SAT Solutions", content: "", coverImageUrl: null, data: {} } as any })),
      getBrands().catch(() => ({ brands: [] })),
      getSitePage("contact").catch(() => ({ page: { data: {} } as any })),
    ]);
    // Бренды-партнёры для стены логотипов (исключаем служебную «Прочее оборудование»)
    const brandWall = (brands ?? [])
      .filter((b) => !/прочее/i.test(b.name || "") && b.logoImageUrl)
      .map((b) => ({ id: b.id, name: b.name, logo: resolveImageUrl(b.logoImageUrl), href: (b as any).slug ? `/catalog/${(b as any).slug}` : null }));
    const img = resolveImageUrl(page.coverImageUrl);
    const rawAddress = typeof contact.data?.address === "string" ? contact.data.address : null;
    const address = localizeAddress(rawAddress, locale);
    const geo = contactGeo(contact.data);
    const localizedContent = localizeAboutContent(page.content || "", locale);
    const paragraphs = localizedContent.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

    return (
      <div className="bg-white">

        {/* ── HERO ── */}
        <section className="relative overflow-hidden bg-slate-900 text-white">
          <div
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #328fa8 0%, transparent 70%)" }}
          />
          <div
            className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #5cb8c7 0%, transparent 70%)" }}
          />
          <div className="container-page relative grid items-center gap-10 py-14 sm:py-18 lg:grid-cols-[1fr_320px]">
            <div>
              <Reveal>
                <p className="text-xs font-black uppercase tracking-widest text-brand-400">{t("title")}</p>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-2 text-3xl font-black leading-[1.08] tracking-tight sm:text-4xl lg:text-5xl">
                  {page.title || "SAT Solutions"}
                </h1>
              </Reveal>
              <div className="mt-5 max-w-2xl space-y-4">
                {paragraphs.map((p, i) => (
                  <Reveal key={i} delay={160 + i * 90}>
                    <p className="text-sm leading-relaxed text-slate-300 sm:text-base">{p}</p>
                  </Reveal>
                ))}
              </div>
            </div>
            {img ? (
              <Reveal delay={120} className="hidden lg:block">
              <div className="flex items-center justify-center rounded-2xl border border-slate-700/60 bg-white p-8">
                <Image
                  alt={page.title}
                  src={img}
                  width={480}
                  height={300}
                  sizes="320px"
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
              </Reveal>
            ) : null}
          </div>
        </section>

        <div className="container-page space-y-12 !pt-10 !pb-12">

          {/* ── Лицензии ── */}
          <section>
            <Reveal>
              <SectionHeading
                title={t("licenses")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
                    <path d="M14 3v5h5" />
                    <path d="M9.5 14.5l1.8 1.8 3.4-3.6" />
                  </svg>
                }
              />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              {LICENSES.map((lic, i) => (
                <Reveal key={lic.id} delay={i * 90} className="h-full">
                <DocPreview url={lic.pdfUrl} title={t(`lic.${lic.id}.title`)}>
                <div className="flex h-full flex-col gap-4 rounded-2xl border-2 border-slate-100 bg-white p-6 transition-all group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${lic.color === "blue" ? "bg-blue-50 text-blue-700" : "bg-red-50 text-red-600"}`}>
                      {lic.icon}
                    </div>
                    <div className="min-w-0">
                      <div className={`mb-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${BADGE_COLORS[lic.color]}`}>
                        {t(`lic.${lic.id}.subtitle`)}
                      </div>
                      <h3 className="text-base font-bold leading-snug text-slate-900">{t(`lic.${lic.id}.title`)}</h3>
                      <p className="mt-1 text-xs font-medium text-slate-500">{t(`lic.${lic.id}.issuedBy`)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{t(`lic.${lic.id}.description`)}</p>
                  <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-brand-700 group-hover:text-brand-800">
                    <DownloadIcon />
                    {t("viewDoc")}
                  </span>
                </div>
                </DocPreview>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Сертификаты ── */}
          <section>
            <Reveal>
              <SectionHeading
                title={t("certificates")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="9" r="5.2" />
                    <path d="M9.6 13.6 8.2 21l3.8-2.1 3.8 2.1-1.4-7.4" />
                  </svg>
                }
              />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CERTIFICATES.map((cert, i) => (
                <Reveal key={cert.id} delay={(i % 3) * 90} className="h-full">
                <DocPreview url={cert.pdfUrl} title={t(`cert.${cert.id}.title`)}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-slate-50 p-2">
                    {"logoUrl" in cert && cert.logoUrl ? (
                      <Image
                        src={cert.logoUrl}
                        alt={t(`cert.${cert.id}.title`)}
                        width={200}
                        height={112}
                        className="max-h-full w-auto max-w-full rounded-md border border-slate-200 object-contain shadow-sm"
                      />
                    ) : (
                      <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-sm font-black tracking-tight ${BADGE_COLORS[cert.badgeColor]}`}>
                        {cert.logoText}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className={`mb-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${BADGE_COLORS[cert.badgeColor]}`}>
                      {t(`cert.${cert.id}.issuedBy`)}
                    </div>
                    <h3 className="text-sm font-bold leading-snug text-slate-900">{t(`cert.${cert.id}.title`)}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{t(`cert.${cert.id}.description`)}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 group-hover:text-brand-800">
                    <DownloadIcon className="w-3.5 h-3.5" />
                    {t("viewDoc")}
                  </span>
                </div>
                </DocPreview>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Рекомендательные письма ── */}
          <section>
            <Reveal>
              <SectionHeading
                title={t("letters")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3.5 6.5 12 13l8.5-6.5" />
                  </svg>
                }
              />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {LETTERS.map((cert, i) => (
                <Reveal key={cert.id} delay={(i % 4) * 90} className="h-full">
                <DocPreview url={cert.pdfUrl} title={t(`cert.${cert.id}.title`)}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all group-hover:-translate-y-0.5 group-hover:border-brand-300 group-hover:shadow-lg">
                  <div className="flex h-28 items-center justify-center rounded-lg bg-slate-50 p-2">
                    <Image
                      src={cert.logoUrl}
                      alt={t(`cert.${cert.id}.title`)}
                      width={200}
                      height={112}
                      className="max-h-full w-auto max-w-full rounded-md border border-slate-200 object-contain shadow-sm"
                    />
                  </div>
                  <div>
                    <div className={`mb-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold ${BADGE_COLORS[cert.badgeColor]}`}>
                      {t(`cert.${cert.id}.issuedBy`)}
                    </div>
                    <h3 className="text-sm font-bold leading-snug text-slate-900">{t(`cert.${cert.id}.title`)}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-500">{t(`cert.${cert.id}.description`)}</p>
                  </div>
                  <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 group-hover:text-brand-800">
                    <DownloadIcon className="w-3.5 h-3.5" />
                    {t("viewDoc")}
                  </span>
                </div>
                </DocPreview>
                </Reveal>
              ))}
            </div>
          </section>

          {/* ── Бренды-партнёры ── */}
          <section>
            <Reveal>
              <SectionHeading
                title={t("partners")}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="9" cy="8" r="3.2" />
                    <circle cx="16.5" cy="9.5" r="2.5" />
                    <path d="M3.5 19c.6-3 2.8-5 5.5-5s4.9 2 5.5 5" />
                    <path d="M15 14.3c2.2.3 3.9 2 4.4 4.7" />
                  </svg>
                }
              />
            </Reveal>
            <Reveal>
              <p className="-mt-3 mb-6 text-sm text-slate-500">{t("brandsNote")}</p>
            </Reveal>

            {/* Бегущая лента логотипов */}
            {brandWall.length > 0 ? (
              <div className="-mx-4 mb-6 overflow-hidden py-1 sm:-mx-6 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                <div className="flex w-max items-center gap-4 animate-scroll hover:[animation-play-state:paused]">
                  {[...brandWall, ...brandWall].map((b, i) => (
                    <div key={`${b.id}-${i}`} className="flex h-16 w-[150px] shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white px-4">
                      {b.logo ? (
                        <Image alt={b.name} src={b.logo} width={140} height={48} className="h-9 w-auto max-w-[120px] object-contain" />
                      ) : (
                        <span className="text-sm font-bold text-slate-700">{b.name}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Сетка логотипов */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {brandWall.map((b, i) => {
                const card = (
                  <div className="flex h-20 items-center justify-center rounded-2xl border-2 border-slate-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md">
                    {b.logo ? (
                      <Image alt={b.name} src={b.logo} width={160} height={48} className="h-10 w-auto max-w-[130px] object-contain" />
                    ) : (
                      <span className="text-sm font-bold text-slate-700">{b.name}</span>
                    )}
                  </div>
                );
                return (
                  <Reveal key={b.id} delay={(i % 6) * 60} className="[&>a]:block">
                    {b.href ? <Link href={b.href}>{card}</Link> : card}
                  </Reveal>
                );
              })}
            </div>
          </section>

          {/* ── Нам доверяют: реальные клиенты с ссылками на кейсы портфолио ── */}
          <section>
            <Reveal>
              <SectionHeading
                title={({ ru: "Нам доверяют", uz: "Bizga ishonishadi", en: "Trusted by", tr: "Bize güvenenler", zh: "客户信任" } as Record<string, string>)[locale] ?? "Нам доверяют"}
                icon={
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21c-4.4-2.6-7.5-5.6-7.5-9.6C4.5 8.6 6.6 6.5 9 6.5c1.2 0 2.3.5 3 1.4.7-.9 1.8-1.4 3-1.4 2.4 0 4.5 2.1 4.5 4.9 0 4-3.1 7-7.5 9.6z" />
                  </svg>
                }
              />
            </Reveal>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { name: "Uzum", note: { ru: "видеонаблюдение складов и ПВЗ", uz: "omborlar videokuzatuvi", en: "warehouse & pickup CCTV", tr: "depo kamera sistemleri", zh: "仓储视频监控" }, href: "/portfolio/uzum-videonablyudenie-skladov-i-punktov-vydachi" },
                { name: "Ucell", note: { ru: "видеостена ситуационного центра", uz: "vaziyat markazi videodevori", en: "situation-centre video wall", tr: "durum merkezi video duvarı", zh: "态势中心拼接屏" }, href: "/portfolio/ucell-ustanovka-videosteny-dahua-v-situacionnom-centre" },
                { name: "Damira Beverages", note: { ru: "СКУД и видеонаблюдение завода", uz: "zavod SKUD va videokuzatuvi", en: "factory access control & CCTV", tr: "fabrika geçiş ve kamera", zh: "工厂门禁与监控" }, href: "/portfolio/skud-zavod-damira-beverages" },
                { name: "ЖК Tower Up", note: { ru: "система безопасности комплекса", uz: "majmua xavfsizlik tizimi", en: "residential security system", tr: "site güvenlik sistemi", zh: "住宅安防系统" }, href: "/portfolio/zhk-tower-up-intellektualnaya-sistema-bezopasnosti-i-videomonitoringa" },
              ].map((c) => (
                <Link key={c.name} href={c.href}
                  className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-500">
                  <div className="text-base font-black text-slate-900 group-hover:text-brand-700">{c.name}</div>
                  <div className="mt-1 text-xs leading-relaxed text-slate-600">{(c.note as Record<string, string>)[locale] ?? c.note.ru}</div>
                </Link>
              ))}
            </div>
          </section>

          {/* ── Где мы находимся ── */}
          {address || geo.widgetSrc || geo.href ? (
            <section>
              <Reveal>
                <SectionHeading
                  title={t("location")}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z" />
                      <circle cx="12" cy="10" r="2.6" />
                    </svg>
                  }
                />
              </Reveal>
              <Reveal>
                <div className="rounded-2xl border-2 border-slate-100 bg-white p-6">
                  {address ? <div className="text-sm font-semibold text-slate-800">{address}</div> : null}
                  {geo.widgetSrc ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                      <iframe title={t("mapTitle")} src={geo.widgetSrc} className="h-72 w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                    </div>
                  ) : null}
                  {geo.href ? (
                    <a href={geo.href} target="_blank" rel="noreferrer"
                      className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 sm:w-auto">
                      {t("openMap")}
                    </a>
                  ) : null}
                </div>
              </Reveal>
            </section>
          ) : null}

        </div>
      </div>
    );
  } catch {
    return (
      <div className="container-page py-6 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          {t("notReady")}
        </div>
      </div>
    );
  }
}
