// Проектировщик видеонаблюдения и калькулятор объектива (SAT Camera Designer, этапы A–D, 10.11.2026).
// Расчёт — lib/cameraDesigner (тот же код на сервере и в браузере), тексты — lib/cameraDesigner/content.ts (5 языков).
// Параметры из ссылки читает только браузер, canonical — без query.
// 11.11, редизайн по второму ТЗ (решения владельца): короткий заголовок «Калькулятор обзора камеры»,
// сразу под ним рабочая область — режимы «Одна камера» → «Подобрать камеру» → «План объекта»;
// ниже — силуэты уровней, три шага, FAQ и свёрнутая справка для специалистов. Title для поиска прежний.
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CameraLensCalculator } from "@/components/CameraLensCalculator";
import { CameraDesignerTabs } from "@/components/CameraDesignerTabs";
import { planContentFor } from "@/lib/cameraDesigner/planContent";
import { estContentFor } from "@/lib/cameraDesigner/estContent";
import { FaqAccordion } from "@/components/FaqAccordion";
import { compute, DEFAULT_INPUT } from "@/lib/cameraDesigner/calculate";
import { contentFor } from "@/lib/cameraDesigner/content";
import { catalogContentFor } from "@/lib/cameraDesigner/catalogContent";
import { simpleContentFor } from "@/lib/cameraDesigner/simpleContent";
import { deg, requiredHfov, requiredNx } from "@/lib/cameraDesigner/optics";
import { PROFILES, type LevelCode } from "@/lib/cameraDesigner/standards";
import { hreflangAlternates } from "@/lib/hreflang";
import { withOgUrl } from "@/lib/metadata";
import { ogLocale } from "@/lib/ogLocale";
import { StepArt } from "@/components/planner/StepArt";
import { portraitPng } from "@/lib/cameraDesigner/pixelPortrait";

const PATH = "/tools/camera-lens-calculator";

async function generateMetadataBase({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const c = contentFor(locale);
  return {
    title: { absolute: c.metaTitle },
    description: c.metaDesc,
    alternates: hreflangAlternates(PATH, locale),
    openGraph: { title: c.metaTitle, description: c.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

// Названия уровней по-русски — для текста заявки с плана (её читает инженер в CRM).
const RU_LEVELS = Object.fromEntries(Object.entries(contentFor("ru").levels).map(([k, v]) => [k, v.name])) as Record<LevelCode, string>;

const DEC: Record<string, string> = { en: ".", zh: "." };
/** Число для текста страницы: десятичный разделитель по языку, как в калькуляторе. */
const n = (locale: string, v: number, frac = 1) => String(Math.round(v * 10 ** frac) / 10 ** frac).replace(".", DEC[locale] ?? ",");

export default async function CameraLensCalculatorPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = contentFor(locale);
  const p = c.page;
  const u = c.ui.units;

  // Пример в тексте считается тем же ядром, что и калькулятор: цифры не расходятся.
  const ex = compute({ ...DEFAULT_INPUT, hfov: 90, vfov: null, nx: 2560, ny: 1440, d: 10 });
  const exW = ex.status === "ok" ? ex.scene.widthM : 20;
  const exP = ex.status === "ok" ? ex.scene.ppmH : 128;
  const example = p.example
    .replace("{w}", `${n(locale, exW)} ${u.m}`)
    .replace("{p}", `${n(locale, exP, 0)} ${u.ppm}`)
    .replace("{nx}", String(requiredNx(3, 250)))
    .replace("{h}", `${n(locale, deg(requiredHfov(10, 3)!))}°`);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";
  const url = `${siteUrl}${lp}${PATH}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: c.crumbs.tool,
        headline: c.h1,
        description: c.metaDesc,
        url,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Requires JavaScript",
        inLanguage: locale,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: 0, priceCurrency: "UZS" },
        provider: { "@type": "Organization", name: "SAT Solutions", url: siteUrl },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: c.crumbs.home, item: `${siteUrl}${lp}/` },
          { "@type": "ListItem", position: 2, name: c.crumbs.tool },
        ],
      },
      { "@type": "FAQPage", mainEntity: p.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  const links = [
    { href: "/products/type/ip-kamery", t: p.links.ipCams },
    { href: "/products/type/ptz-kamery", t: p.links.ptz },
    { href: "/products/type/ip-videoregistratory-nvr", t: p.links.nvr },
    { href: "/calculator", t: p.links.calc },
    { href: "/solutions/cctv", t: p.links.cctv },
    { href: "/blog/kak-vybrat-kameru-videonablyudeniya", t: p.links.article },
  ] as const;

  const h2 = "text-lg font-black text-slate-900 sm:text-xl";
  const su = simpleContentFor(locale);
  // уровни DORI редакции 2014 для силуэтов: тот же человек при плотности уровня
  const portraits = (["detect", "observe", "recognize", "identify"] as const).map((code) => {
    const ppm = PROFILES["2014"].levels.find((l) => l.code === code)!.ppm;
    return { code, ppm, src: portraitPng(ppm) };
  });
  const detailsCls = "group rounded-2xl border border-slate-200 bg-white";
  const summaryCls = "flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-base font-black text-slate-900 [&::-webkit-details-marker]:hidden";
  const chevron = (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );

  return (
    <div className="bg-slate-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-5 sm:py-8">
        <nav className="crumbs flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-brand-600">{c.crumbs.home}</Link>
          <span>/</span>
          <span className="text-slate-700">{c.crumbs.tool}</span>
        </nav>

        {/* заголовок в одну строку и сразу рабочая область: сцена видна на первом экране */}
        <header className="mt-3">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{c.h1}</h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">{c.lead}</p>
        </header>

        {/* якоря режимов: браузер прокручивает к инструменту, вкладку переключает CameraDesignerTabs */}
        <div id="cd-tool" className="relative mt-4">
          <span id="camera" className="absolute -top-24" aria-hidden="true" />
          <span id="pick" className="absolute -top-24" aria-hidden="true" />
          <span id="plan" className="absolute -top-24" aria-hidden="true" />
          <span id="estimate" className="absolute -top-24" aria-hidden="true" />
          <CameraDesignerTabs tabs={su.tabs} plan={planContentFor(locale)} est={estContentFor(locale)} levels={c.levels} ruLevels={RU_LEVELS} locale={locale}>
            <CameraLensCalculator c={{ ui: c.ui, levels: c.levels, numLocale: c.numLocale }} s={su} cat={catalogContentFor(locale).catalog} locale={locale} />
          </CameraDesignerTabs>
        </div>

        {/* силуэты: один и тот же человек при плотности каждого уровня DORI */}
        <section className="mt-14">
          <h2 className={h2}>{c.levelsSec.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{c.levelsSec.intro}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {portraits.map((x) => (
              <figure key={x.code} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={x.src} alt="" width={400} height={500} className="block aspect-[4/5] h-auto w-full [image-rendering:pixelated]" />
                <figcaption className="p-3.5">
                  <span className="block text-sm font-black text-slate-900">{c.levels[x.code].name}</span>
                  <span className="mt-0.5 block text-xs font-bold tabular-nums text-brand-700">{n(locale, x.ppm)} {u.ppm}</span>
                  <span className="mt-1 block text-xs leading-snug text-slate-600">{c.levels[x.code].task}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* как это работает — для клиента */}
        <section className="mt-14">
          <h2 className={h2}>{c.steps.title}</h2>
          <ol className="mt-5 grid gap-3 md:grid-cols-3">
            {c.steps.items.map(([title, text], i) => (
              <li key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <StepArt step={i as 0 | 1 | 2} />
                <div className="flex gap-3 p-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-black text-slate-900">{title}</span>
                    <span className="mt-1 block text-sm leading-relaxed text-slate-600">{text}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14">
          <h2 className={h2}>{p.faqTitle}</h2>
          <div className="mt-4">
            <FaqAccordion items={p.faq} />
          </div>
        </section>

        {/* для специалистов: калькулятор объектива, формулы, стандарт, допущения — свёрнуто, но в HTML */}
        <section className="mt-14">
          <h2 className={h2}>{c.refTitle}</h2>
          <div className="mt-4 grid gap-3">
            <details className={detailsCls}>
              <summary className={summaryCls}><h3>{p.howTitle}</h3>{chevron}</summary>
              <ol className="grid gap-3 px-5 pb-5 md:grid-cols-2">
                {p.how.map((x, i) => (
                  <li key={i} className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-black text-white">{i + 1}</span>
                    <span>{x}</span>
                  </li>
                ))}
              </ol>
            </details>

            <details className={detailsCls}>
              <summary className={summaryCls}><h3>{p.formulasTitle}</h3>{chevron}</summary>
              <div className="px-5 pb-5">
                <p className="max-w-4xl text-sm leading-relaxed text-slate-600">{p.formulasIntro}</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {p.formulas.map((f) => (
                    <div key={f.expr} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                      <div className="text-xs text-slate-500">{f.label}</div>
                      <div className="mt-1 font-mono text-sm font-semibold text-slate-900">{f.expr}</div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600">{p.formulasNote}</p>
                <div className="mt-4 max-w-4xl rounded-2xl border border-brand-100 bg-brand-50 p-4">
                  <div className="text-sm font-black text-slate-900">{p.exampleTitle}</div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{example}</p>
                </div>
              </div>
            </details>

            <details className={detailsCls}>
              <summary className={summaryCls}><h3>{p.standardTitle}</h3>{chevron}</summary>
              <div className="px-5 pb-5">
                <div className="grid gap-x-8 gap-y-3 text-sm leading-relaxed text-slate-600 md:grid-cols-2">
                  {p.standardText.map((x, i) => <p key={i}>{x}</p>)}
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {(["2014", "2025"] as const).map((k) => (
                    <div key={k} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-sm font-black text-slate-900">{PROFILES[k].title}</div>
                      <table className="mt-2 w-full border-collapse text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            <th className="py-2 pr-3">{c.ui.colLevel}</th>
                            <th className="py-2 pr-3 text-right">{c.ui.colPpm}</th>
                            <th className="py-2">{p.colTask}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {PROFILES[k].levels.map((l) => (
                            <tr key={l.code} className="border-b border-slate-100 align-top last:border-0">
                              <td className="py-2 pr-3 font-semibold text-slate-900">
                                {c.levels[l.code].name}
                                {c.levels[l.code].name !== l.en ? <span className="block text-[11px] font-normal text-slate-500">{l.en}</span> : null}
                              </td>
                              <td className="whitespace-nowrap py-2 pr-3 text-right tabular-nums text-slate-700">{n(locale, l.ppm)} {u.ppm}</td>
                              <td className="py-2 text-xs leading-relaxed text-slate-600">{c.levels[l.code].task}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            <details className={detailsCls}>
              <summary className={summaryCls}><h3>{p.assumpTitle}</h3>{chevron}</summary>
              <ul className="grid gap-x-8 gap-y-2.5 px-5 pb-5 md:grid-cols-2">
                {p.assump.map((x, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                    {x}
                  </li>
                ))}
              </ul>
            </details>
          </div>
        </section>

        <section className="mt-12">
          <h2 className={h2}>{p.linksTitle}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-brand-400 hover:text-brand-700">
                {l.t} →
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
