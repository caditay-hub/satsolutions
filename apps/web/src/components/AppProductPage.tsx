// Общая разметка страниц приложений (/apps/uy, /apps/davomat): экраны, возможности, кому подходит,
// как подключаем, техника, вопросы и заявка. Тексты приходят готовым словарём локали.
import { Link } from "@/i18n/navigation";
import type { AppPage } from "@/lib/appsContent";
import { CRUMBS } from "@/lib/appsContent";

export function AppProductPage({
  d,
  locale,
  otherHref,
  download,
}: {
  d: AppPage;
  locale: string;
  otherHref: "/apps/uy" | "/apps/davomat";
  download?: { label: string; href: string };
}) {
  const c = CRUMBS[locale] ?? CRUMBS.ru;
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <nav className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-600">{c.home}</Link>
        <span>/</span>
        <Link href="/apps" className="hover:text-brand-600">{c.apps}</Link>
        <span>/</span>
        <span className="text-slate-700">{d.h1.split(" — ")[0]}</span>
      </nav>

      <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-slate-900">{d.h1}</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">{d.intro}</p>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.screensTitle}</h2>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {d.screens.map((s) => (
          <div key={s} className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center">
            <div className="mx-auto h-28 w-16 rounded-xl border-2 border-slate-300 bg-white" aria-hidden />
            <div className="mt-3 text-sm font-medium text-slate-700">{s}</div>
          </div>
        ))}
      </div>

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
