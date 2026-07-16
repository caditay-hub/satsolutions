import { getTranslations } from "next-intl/server";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";

// Перечень оборудования H3C на странице «Серверы H3C и виртуализация».
// Модельные линейки — под запросы «h3c 5130», «msr810», «f1000» и т.п.
// Товаров в каталоге пока нет — поставка под заказ по партнёрским ценам,
// описания групп в messages → services.virtualization.details.eq.*
const EQUIPMENT: { key: string; models: string }[] = [
  { key: "servers", models: "UniServer R4700 G6 · R4900 G6 · R6900 G6" },
  { key: "switches", models: "S5130S · S5560X · S6520X" },
  { key: "routers", models: "MSR810 · MSR2600 · MSR3600" },
  { key: "firewalls", models: "SecPath F100 · F1000" },
  { key: "wifi", models: "WA6320 · WA6330 + контроллеры" },
  { key: "storage", models: "H3C UniStor" },
];

export async function H3cEquipment() {
  const ts = await getTranslations("services");
  const tp = await getTranslations("solutionsPage");

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Оборудование H3C — поставка в Узбекистане",
    itemListElement: EQUIPMENT.map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `H3C ${e.models}`,
    })),
  };

  return (
    <div className="mt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts("virtualization.details.eqLabel")}</p>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts("virtualization.details.eqTitle")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ts("virtualization.details.eqText")}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EQUIPMENT.map((e) => (
          <div key={e.key} className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-black tracking-tight text-slate-900">{ts(`virtualization.details.eq.${e.key}.name`)}</h3>
            <p className="mt-1 text-[13px] font-bold text-brand-700">{e.models}</p>
            <p className="mt-1.5 text-[13px] leading-snug text-slate-600">{ts(`virtualization.details.eq.${e.key}.desc`)}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <RequestQuoteButton label={tp("getQuote")} variant="brand" productName="Заявка: оборудование H3C" />
        <p className="text-sm text-slate-500">{ts("virtualization.details.eqNote")}</p>
      </div>
    </div>
  );
}
