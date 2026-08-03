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
function Handshake() {
  return (<svg {...ICON}><path d="M7 11.5 9.5 9a2 2 0 0 1 2.7-.1l1.6 1.3" /><path d="m13 10 3.2 3.2a1.6 1.6 0 0 1-2.2 2.3l-.6-.6" /><path d="m13.4 14.9.9.9a1.5 1.5 0 0 1-2.1 2.1l-.9-.9" /><path d="m11.3 16.9.6.6a1.4 1.4 0 0 1-2 2l-.6-.6" /><path d="M3 8.5 6 6l3 1.5" /><path d="M21 8.5 18 6l-3.5 1.6" /><path d="M3 8.5v6l2.5 1.5" /><path d="M21 8.5v6l-2.4 1.4" /></svg>);
}
function HardHat() {
  return (<svg {...ICON}><path d="M3 16h18" /><path d="M5 16v-1.5A7 7 0 0 1 12 8a7 7 0 0 1 7 6.5V16" /><path d="M10 8.4V5.6A1.6 1.6 0 0 1 11.6 4h.8A1.6 1.6 0 0 1 14 5.6v2.8" /><path d="M3 16v1.4A1.6 1.6 0 0 0 4.6 19h14.8a1.6 1.6 0 0 0 1.6-1.6V16" /></svg>);
}
function Docs() {
  return (<svg {...ICON}><path d="M8 3h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v4h4" /><path d="M9.5 12.5h5M9.5 16h5" /></svg>);
}

export async function TrustBlock({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const items = [
    { Icon: Shield, title: t("warrantyT"), desc: t("warrantyD") },
    { Icon: Handshake, title: t("partnersT"), desc: t("partnersD") },
    { Icon: HardHat, title: t("teamT"), desc: t("teamD") },
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
