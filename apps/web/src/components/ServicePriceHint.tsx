import { Link } from "@/i18n/navigation";
import { servicePrices } from "@/lib/servicePrices";

// Ценовой ориентир на странице услуги: ключи «… цена / narxi» ведут сюда, и до этого
// блока страница не отвечала на вопрос «сколько», отправляя человека обратно в выдачу.
export function ServicePriceHint({ k, locale }: { k: string; locale: string }) {
  const block = servicePrices(k, locale);
  if (!block) return null;

  return (
    <div className="mt-12">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{block.title}</h2>
      <div className="mt-5 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {block.rows.map((row) => (
          <Link
            key={row.label}
            href={row.href}
            className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 py-4 transition-colors hover:bg-slate-50"
          >
            <span className="text-sm font-semibold text-slate-700">{row.label}</span>
            <span className="text-base font-black tabular-nums text-brand-700">{row.price}</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{block.note}</p>
    </div>
  );
}
