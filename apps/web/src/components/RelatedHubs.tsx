import Link from "next/link";
import { relatedHubsFor } from "@/lib/relatedHubs";

const HEADING: Record<string, string> = {
  ru: "Оборудование и бренды по теме",
  uz: "Mavzuga oid uskunalar va brendlar",
  en: "Related equipment and brands",
  tr: "İlgili ekipman ve markalar",
  zh: "相关设备与品牌",
};

/**
 * Блок контекстных ссылок кластера (lib/relatedHubs.ts). Обычный next/link с языком в
 * адресе: Link из next-intl на этих страницах уводил бы маршрут в динамику, а без
 * префикса ссылки с uz/en/tr/zh вели на русские страницы (обход 09.10.2026).
 */
export function RelatedHubs({ path, locale, bare }: { path: string; locale: string; bare?: boolean }) {
  const items = relatedHubsFor(path, locale);
  if (!items.length) return null;
  return (
    <nav aria-label={HEADING[locale] ?? HEADING.ru} className={bare ? "mt-12" : "container-page pb-8"}>
      <p className="text-xs font-black uppercase tracking-widest text-brand-700">{HEADING[locale] ?? HEADING.ru}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((it) => (
          <li key={it.href}>
            <Link
              href={it.href}
              className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-400 hover:text-brand-700"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
