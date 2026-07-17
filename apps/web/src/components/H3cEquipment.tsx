import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { getProducts } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

// Перечень оборудования H3C на странице «Серверы H3C и виртуализация».
// Карточки-линейки кликабельны: ведут на репрезентативный товар H3C в каталоге
// (или на бренд-страницу /catalog/h3c, если отдельного товара пока нет — Wi-Fi).
// Фото берётся с товара (coverImageUrl). Товары заведены 17.07 (бренд H3C).
const EQUIPMENT: { key: string; models: string; rep?: string; href?: string }[] = [
  { key: "servers", models: "UniServer R4700 G6 · R4900 G6 · R4300 G6", rep: "h3c-uniserver-r4900-g6" },
  { key: "switches", models: "S5130S · S5560S · S6520X", rep: "h3c-s5130s-28s-ei" },
  { key: "routers", models: "MSR810 · MSR2600 · MSR3620", rep: "h3c-msr810" },
  { key: "firewalls", models: "SecPath F100-C · F1000-C", rep: "h3c-secpath-f1000-c-g2" },
  { key: "wifi", models: "WA6320 · WA6330 + контроллеры", href: "/catalog/h3c" },
  { key: "storage", models: "UniServer R4300 G6", rep: "h3c-uniserver-r4300-g6" },
];

export async function H3cEquipment() {
  const ts = await getTranslations("services");
  const tp = await getTranslations("solutionsPage");
  const locale = await getLocale();

  // Карта slug → coverImageUrl (для фото карточек). Товары бренда H3C из каталога.
  const imgBySlug: Record<string, string | null> = {};
  try {
    const r = await getProducts(1, 30, { brand: "h3c" });
    for (const p of r.items ?? []) imgBySlug[p.slug] = p.coverImageUrl;
  } catch {
    /* API недоступен — карточки без фото, но остаются кликабельными */
  }

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

  const goLabel = ({ ru: "Смотреть в каталоге", uz: "Katalogda ko'rish", en: "View in catalog", tr: "Katalogda görün", zh: "在目录中查看" } as Record<string, string>)[locale] ?? "Смотреть в каталоге";

  return (
    <div className="mt-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListLd) }} />
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts("virtualization.details.eqLabel")}</p>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts("virtualization.details.eqTitle")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ts("virtualization.details.eqText")}</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EQUIPMENT.map((e) => {
          const href = e.rep ? `/products/${e.rep}` : (e.href ?? "/catalog/h3c");
          const img = e.rep ? resolveImageUrl(imgBySlug[e.rep]) : null;
          return (
            <Link
              key={e.key}
              href={href}
              className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-md"
            >
              {img ? (
                <div className="flex h-20 w-24 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white p-1.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={ts(`virtualization.details.eq.${e.key}.name`)} loading="lazy" className="max-h-full max-w-full object-contain" />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-black tracking-tight text-slate-900 group-hover:text-brand-700">{ts(`virtualization.details.eq.${e.key}.name`)}</h3>
                <p className="mt-1 text-[13px] font-bold text-brand-700">{e.models}</p>
                <p className="mt-1.5 text-[13px] leading-snug text-slate-600">{ts(`virtualization.details.eq.${e.key}.desc`)}</p>
                <span className="mt-2 inline-block text-[12px] font-bold text-brand-600">{goLabel} →</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <RequestQuoteButton label={tp("getQuote")} variant="brand" productName="Заявка: оборудование H3C" />
        <p className="text-sm text-slate-500">{ts("virtualization.details.eqNote")}</p>
      </div>
    </div>
  );
}
