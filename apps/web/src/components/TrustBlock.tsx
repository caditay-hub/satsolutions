import { getTranslations } from "next-intl/server";

/**
 * Блок доверия для B2B-страниц: гарантия и сроки выезда, партнёрства,
 * собственный монтажный штат, документы для тендеров. Условия согласованы
 * с руководством 03.08.2026 (гарантия 1–3 года, гарантийный выезд 48 часов).
 * Иконки — инлайн SVG: цветные эмодзи на Windows рисуются плоскими и грязными.
 */
const ICON = {
  className: "w-6 h-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

function Shield() {
  return (<svg {...ICON}><path d="M12 3l7.5 3v5.2c0 4.6-3.1 7.9-7.5 9.3-4.4-1.4-7.5-4.7-7.5-9.3V6z" /><path d="M9 12l2.2 2.2L15.4 10" /></svg>);
}
function Award() {
  return (<svg {...ICON}><circle cx="12" cy="9" r="5.2" /><path d="m9 13.4-1.3 6.1 4.3-2.2 4.3 2.2-1.3-6.1" /><path d="m12 6.6.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 8.8l2-.3z" /></svg>);
}

function Team() {
  return (<svg {...ICON}><circle cx="9" cy="8" r="3.1" /><path d="M3.5 19.5v-1.2A4.3 4.3 0 0 1 7.8 14h2.4a4.3 4.3 0 0 1 4.3 4.3v1.2" /><path d="M16.5 5.2a3.1 3.1 0 0 1 0 5.9" /><path d="M18 14.2a4.3 4.3 0 0 1 2.5 3.9v1.4" /></svg>);
}

function Docs() {
  return (<svg {...ICON}><path d="M8 3h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v4h4" /><path d="M9.5 12.5h5M9.5 16h5" /></svg>);
}

export async function TrustBlock({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const items = [
    { Icon: Shield, title: t("warrantyT"), desc: t("warrantyD") },
    { Icon: Award, title: t("partnersT"), desc: t("partnersD") },
    { Icon: Team, title: t("teamT"), desc: t("teamD") },
    { Icon: Docs, title: t("docsT"), desc: t("docsD") },
  ];
  return (
    <section className="mt-14">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("title")}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ Icon, title, desc }) => (
          <div key={title} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon />
            </div>
            <div className="mt-3 text-sm font-black text-slate-900">{title}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
