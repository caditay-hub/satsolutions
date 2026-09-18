// Блоки-иллюстрации страниц приложений: схема прохода гостя, журнал событий,
// «было / стало», графики учёта времени, схема работы на объекте, полоса техники.
// Всё рисуется вёрсткой и SVG — ни картинок, ни библиотек; анимация одноразовая (Reveal).
import { InView } from "@/components/InView";
import { PanelMock, PhoneMock } from "@/components/AppMockups";
import { DAVOMAT_EXTRAS, HUB_EXTRAS, UY_EXTRAS } from "@/lib/appsExtrasContent";
import type { Chart, DavomatExtras, EventItem, HubExtras, UyExtras } from "@/lib/appsExtrasContent";

function SectionHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <>
      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{title}</h2>
      {lead && <p className="mt-2 text-slate-600 leading-relaxed">{lead}</p>}
    </>
  );
}


/** Фотополоса: снимок проявляется с лёгким наездом камеры один раз. */
export function Photo({ src, className = "", ratio = "aspect-[4/3]" }: { src: string; className?: string; ratio?: string }) {
  return (
    <InView variant="rv-zoom" className={`overflow-hidden rounded-2xl bg-slate-100 ${ratio} ${className}`}>
      <img src={src} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
    </InView>
  );
}

/** Широкая фотополоса между разделами. */
export function PhotoBand({ src }: { src: string }) {
  return (
    <InView variant="rv-zoom" className="mt-12 aspect-[16/7] overflow-hidden rounded-3xl bg-slate-100">
      <img src={src} alt="" aria-hidden className="h-full w-full object-cover" loading="lazy" />
    </InView>
  );
}

/** Четыре шага прохода гостя: загораются по очереди при появлении. */
export function GuestFlow({ d }: { d: UyExtras }) {
  return (
    <section>
      <SectionHead title={d.flowTitle} lead={d.flowLead} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:items-center">
      <Photo src="/apps-img/uy-guest.jpg" />
      <InView as="ol" variant="rv-stagger" className="grid gap-3 sm:grid-cols-2">
        {d.flow.map((s, i) => (
          <li key={s.t} className="rounded-2xl border border-slate-200 bg-white p-5">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">
              {i + 1}
            </span>
            <div className="mt-3 font-semibold text-slate-900">{s.t}</div>
            <div className="mt-1 text-sm text-slate-500">{s.d}</div>
          </li>
        ))}
      </InView>
      </div>
    </section>
  );
}

function EventIcon({ kind }: { kind: EventItem["icon"] }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", strokeWidth: 2, "aria-hidden": true } as const;
  if (kind === "door")
    return (
      <svg {...common} stroke="#2a7b90">
        <rect x="5" y="3" width="10" height="18" rx="2" />
        <circle cx="12.5" cy="12" r="1" />
      </svg>
    );
  if (kind === "call")
    return (
      <svg {...common} stroke="#2a7b90">
        <path d="M4 17V9l8-5 8 5v8" />
        <rect x="9" y="13" width="6" height="6" />
      </svg>
    );
  return (
    <svg {...common} stroke="#16a34a">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  );
}

/** Лента событий: записи появляются одна за другой. */
export function EventFeed({ d }: { d: UyExtras }) {
  return (
    <section>
      <SectionHead title={d.feedTitle} lead={d.feedLead} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center">
      <InView as="ul" variant="rv-stagger" className="rounded-2xl border border-slate-200 bg-white px-4">
        {d.feed.map((e) => (
          <li key={e.t} className="flex items-center gap-3 border-b border-slate-100 py-3 last:border-0">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50">
              <EventIcon kind={e.icon} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-slate-900">{e.t}</span>
              <span className="block text-xs text-slate-500">{e.d}</span>
            </span>
          </li>
        ))}
      </InView>
      <Photo src="/apps-img/uy-office.jpg" />
      </div>
    </section>
  );
}

/** Таблица «было / стало» для управляющей компании. */
export function BeforeAfter({ d }: { d: UyExtras }) {
  return (
    <section>
      <SectionHead title={d.tableTitle} />
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-1/2 border border-slate-200 bg-slate-50 p-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                {d.colWas}
              </th>
              <th className="w-1/2 border border-brand-100 bg-brand-50 p-3 text-left text-xs font-bold uppercase tracking-wide text-brand-700">
                {d.colNow}
              </th>
            </tr>
          </thead>
          <tbody>
            {d.rows.map((r) => (
              <tr key={r.was}>
                <td className="border border-slate-200 p-3 align-top text-slate-500">{r.was}</td>
                <td className="border border-slate-200 p-3 align-top font-medium text-slate-800">{r.now}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function BarChart({ c, tone }: { c: Chart; tone: "teal" | "warn" }) {
  const max = Math.max(...c.values);
  return (
    <div>
      <div className="text-sm font-semibold text-slate-900">{c.title}</div>
      <InView variant="rv-bars" className="mt-4 flex h-36 items-end gap-2">
        {c.values.map((v, i) => (
          <span
            key={c.labels[i]}
            className={`rv-bar flex-1 rounded-t-md ${
              i === c.hi ? (tone === "warn" ? "bg-amber-500" : "bg-brand-700") : "bg-brand-100"
            }`}
            style={{ height: `${Math.round((v / max) * 100)}%` }}
          />
        ))}
      </InView>
      <div className="mt-2 flex gap-2 text-[11px] text-slate-500">
        {c.labels.map((l) => (
          <span key={l} className="flex-1 text-center">
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Два графика кабинета учёта времени: приход по времени и опоздания. */
export function AttendanceCharts({ d }: { d: DavomatExtras }) {
  return (
    <section>
      <SectionHead title={d.chartsTitle} lead={d.chartsLead} />
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch">
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 sm:p-6">
          <BarChart c={d.arrival} tone="teal" />
          <BarChart c={d.late} tone="warn" />
        </div>
        <Photo src="/apps-img/davomat-report.jpg" ratio="aspect-[4/3] lg:aspect-auto lg:h-full" />
      </div>
    </section>
  );
}

/** Схема работы на объекте: техника → шлюз → сервер → телефон, линия прорисовывается один раз. */
export function SiteScheme({ d }: { d: HubExtras }) {
  return (
    <section>
      <SectionHead title={d.schemeTitle} lead={d.schemeLead} />
      <InView variant="rv-line" className="relative mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
        <div className="pointer-events-none absolute left-[12%] right-[12%] top-1/2 hidden h-1 rounded bg-slate-200 lg:block">
          <span className="rv-grow block h-full w-full rounded bg-brand-600" />
        </div>
        <ol className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {d.nodes.map((n, i) => (
            <li
              key={n.t}
              className={`rounded-xl border p-4 ${
                i === d.nodes.length - 1 ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"
              }`}
            >
              <div className={`font-semibold ${i === d.nodes.length - 1 ? "text-brand-700" : "text-slate-900"}`}>{n.t}</div>
              <div className="mt-1 text-sm text-slate-500">{n.d}</div>
            </li>
          ))}
        </ol>
      </InView>
    </section>
  );
}

/** Полоса совместимой техники. */
export function BrandStrip({ d }: { d: HubExtras }) {
  return (
    <section>
      <SectionHead title={d.brandsTitle} />
      <div className="mt-5 flex flex-wrap gap-2">
        {d.brands.map((b) => (
          <span key={b} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600">
            {b}
          </span>
        ))}
      </div>
    </section>
  );
}

/** Иллюстрация внутри статьи блога: переиспользует словари страниц приложений. */
export function ArticleArt({ kind, locale }: { kind: "guest" | "house" | "attendance"; locale: string }) {
  if (kind === "attendance") {
    const d = DAVOMAT_EXTRAS[locale] ?? DAVOMAT_EXTRAS.ru;
    return (
      <div className="my-8 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <PanelMock kind="timesheet" uid="art" className="mx-auto h-40 w-auto" />
          <div className="grid gap-6">
            <div className="text-sm font-semibold text-slate-900">{d.chartsTitle}</div>
            <InView variant="rv-bars" className="flex h-24 items-end gap-2">
              {d.late.values.map((v, i) => (
                <span
                  key={d.late.labels[i]}
                  className={`rv-bar flex-1 rounded-t-md ${i === d.late.hi ? "bg-amber-500" : "bg-brand-100"}`}
                  style={{ height: `${Math.round((v / Math.max(...d.late.values)) * 100)}%` }}
                />
              ))}
            </InView>
            <div className="-mt-4 flex gap-2 text-[11px] text-slate-500">
              {d.late.labels.map((l) => (
                <span key={l} className="flex-1 text-center">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "guest") {
    const d = UY_EXTRAS[locale] ?? UY_EXTRAS.ru;
    return (
      <div className="my-8 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <PhoneMock kind="guest" uid="art" className="mx-auto h-44 w-auto" />
          <InView as="ol" variant="rv-stagger" className="grid gap-3 sm:grid-cols-2">
            {d.flow.map((s, i) => (
              <li key={s.t} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="mt-2 text-sm font-semibold text-slate-900">{s.t}</div>
                <div className="text-xs text-slate-500">{s.d}</div>
              </li>
            ))}
          </InView>
        </div>
      </div>
    );
  }

  const d = HUB_EXTRAS[locale] ?? HUB_EXTRAS.ru;
  return (
    <div className="my-8 rounded-2xl border border-slate-200 bg-white p-5">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <PhoneMock kind="doors" uid="art" className="mx-auto h-44 w-auto" />
        <InView as="ol" variant="rv-stagger" className="grid gap-3 sm:grid-cols-2">
          {d.nodes.map((n, i) => (
            <li
              key={n.t}
              className={`rounded-xl border p-3 ${i === d.nodes.length - 1 ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-slate-50"}`}
            >
              <div className="text-sm font-semibold text-slate-900">{n.t}</div>
              <div className="text-xs text-slate-500">{n.d}</div>
            </li>
          ))}
        </InView>
      </div>
    </div>
  );
}
