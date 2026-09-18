// Общая разметка страниц приложений (/apps/uy, /apps/davomat): экраны, возможности, кому подходит,
// как подключаем, техника, вопросы и заявка. Тексты приходят готовым словарём локали.
import { Link } from "@/i18n/navigation";
import type { AppPage } from "@/lib/appsContent";
import { CRUMBS } from "@/lib/appsContent";
import { AttendanceCharts, BeforeAfter, EventFeed, GuestFlow, PhotoBand } from "@/components/AppBlocks";
import { DAVOMAT_EXTRAS, UY_EXTRAS } from "@/lib/appsExtrasContent";
import { AppCrossLinks } from "@/components/AppCrossLinks";

// Снимки экранов приложения и кабинета — в том же порядке, что подписи d.screens
const UY_SHOTS = [
  "/apps-img/shots/shot-doors.jpg",
  "/apps-img/shots/shot-guest.jpg",
  "/apps-img/shots/shot-tickets.jpg",
  "/apps-img/shots/shot-bill.jpg",
];
const DAVOMAT_SHOTS = [
  "/apps-img/shots/shot-now.jpg",
  "/apps-img/shots/shot-timesheet.jpg",
  "/apps-img/shots/shot-late.jpg",
  "/apps-img/shots/shot-export.jpg",
];

export function AppProductPage({
  d,
  locale,
  otherHref,
  app,
  download,
}: {
  d: AppPage;
  locale: string;
  otherHref: "/apps/uy" | "/apps/davomat";
  app: "uy" | "davomat";
  download?: { label: string; href: string };
}) {
  const shots = app === "uy" ? UY_SHOTS : DAVOMAT_SHOTS;
  const uy = app === "uy" ? UY_EXTRAS[locale] ?? UY_EXTRAS.ru : null;
  const dav = app === "davomat" ? DAVOMAT_EXTRAS[locale] ?? DAVOMAT_EXTRAS.ru : null;
  const c = CRUMBS[locale] ?? CRUMBS.ru;
  const name = d.h1.split(" — ")[0];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-14">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600">{c.home}</Link>
        <span>/</span>
        <Link href="/apps" className="hover:text-brand-600">{c.apps}</Link>
        <span>/</span>
        <span className="text-slate-700">{d.h1.split(" — ")[0]}</span>
      </nav>

      {/* Первый экран — широкая фотополоса: текст поверх снимка, телефоны сверху. */}
      <section className="relative mt-3 overflow-hidden rounded-3xl bg-slate-900">
        <img
          src={app === "uy" ? "/apps-img/uy-hero.jpg" : "/apps-img/davomat-hero.jpg"}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/40" />
        <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1.15fr_auto]">
          <div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">{d.h1}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">{d.intro}</p>
          </div>
          <div className="grid w-full max-w-md gap-4 sm:grid-cols-2 lg:max-w-none lg:grid-cols-1 lg:gap-5">
            <img
              src={app === "uy" ? "/apps-img/shots/shot-doors.jpg" : "/apps-img/shots/shot-timesheet.jpg"}
              alt={`${name} — ${d.screens[app === "uy" ? 0 : 1] ?? d.screensTitle}`}
              className="w-full rounded-2xl shadow-2xl lg:w-80"
            />
          </div>
        </div>
      </section>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.screensTitle}</h2>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {d.screens.map((s, i) => (
          <div key={s} className="rounded-2xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 text-center">
            <img src={shots[i] ?? shots[0]} alt={`${name} — ${s}`} loading="lazy" className="mx-auto w-full rounded-xl" />
            <div className="mt-3 text-sm font-medium text-slate-700">{s}</div>
          </div>
        ))}
      </div>

      {uy && <GuestFlow d={uy} />}
      {dav && <AttendanceCharts d={dav} />}

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.forWhomTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {d.forWhom.map((f) => (
          <div key={f.t} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-semibold text-slate-900">{f.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.secondTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {d.second.map((f) => (
          <div key={f.t} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="font-semibold text-slate-900">{f.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>

      {uy && <EventFeed d={uy} />}

      <PhotoBand src={app === "uy" ? "/apps-img/uy-yard.jpg" : "/apps-img/davomat-check.jpg"} alt={name} />

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.howTitle}</h2>
      <ol className="mt-6 grid sm:grid-cols-2 gap-5">
        {d.how.map((h) => (
          <li key={h.t} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="font-semibold text-slate-900">{h.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{h.d}</p>
          </li>
        ))}
      </ol>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.techTitle}</h2>
      <p className="mt-3 text-slate-600 leading-relaxed">{d.techText}</p>
      <ul className="mt-5 grid sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-slate-600">
        {d.tech.map((t) => (
          <li key={t} className="flex gap-2">
            <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
            <span>{t}</span>
          </li>
        ))}
      </ul>

      {uy && <BeforeAfter d={uy} />}

      <AppCrossLinks
        locale={locale}
        services={app === "uy" ? ["intercom", "access", "barrier", "residential"] : ["attendance", "turnstile", "access", "barrier"]}
        articles={app === "uy"
          ? ["prilozhenie-dlya-zhiteley-zhk", "gostevoy-propusk-po-qr"]
          : ["uchet-rabochego-vremeni-po-litsu"]}
      />

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.faqTitle}</h2>
      <div className="mt-6 space-y-4">
        {d.faq.map((f) => (
          <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="font-medium text-slate-900 cursor-pointer">{f.q}</summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-brand-50 border border-brand-100 p-6 sm:p-8">
        <div className="text-xl font-bold text-slate-900">{d.ctaTitle}</div>
        <p className="mt-3 text-slate-600 leading-relaxed">{d.ctaText}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-800"
          >
            {d.ctaButton}
          </Link>
          {download && (
            <a
              href={download.href}
              className="inline-flex items-center rounded-lg border border-brand-700 px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-white"
            >
              {download.label}
            </a>
          )}
        </div>
      </div>

      <p className="mt-8 text-sm">
        <Link href={otherHref} className="text-brand-700 font-semibold hover:underline">
          {d.otherApp}
        </Link>
      </p>
    </div>
  );
}
