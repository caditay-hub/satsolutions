import { getTranslations } from "next-intl/server";

/**
 * Блок доверия для B2B-страниц: гарантия и сроки выезда, партнёрства,
 * собственный монтажный штат, документы для тендеров. Условия согласованы
 * с руководством 03.08.2026 (гарантия 1–3 года, гарантийный выезд 48 часов).
 */
export async function TrustBlock({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "trust" });
  const items = [
    { icon: "🛡", title: t("warrantyT"), desc: t("warrantyD") },
    { icon: "🤝", title: t("partnersT"), desc: t("partnersD") },
    { icon: "👷", title: t("teamT"), desc: t("teamD") },
    { icon: "📄", title: t("docsT"), desc: t("docsD") },
  ];
  return (
    <section className="mt-14">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("title")}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <div key={it.title} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
            <div className="text-2xl">{it.icon}</div>
            <div className="mt-2 text-sm font-black text-slate-900">{it.title}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{it.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
