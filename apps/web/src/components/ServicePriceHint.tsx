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
      {/* строки в ряд: на компьютере ориентир занимает одну полосу, а не столбик на всю ширину */}
      <div className="mt-5 grid overflow-hidden rounded-2xl border border-brand-200 bg-brand-50/60 sm:grid-cols-3">
        {block.rows.map((row, i) => (
          <Link
            key={row.label}
            href={row.href}
            className={`flex flex-col gap-0.5 px-5 py-3.5 transition-colors hover:bg-brand-100/60 ${i ? "border-t border-brand-200 sm:border-l sm:border-t-0" : ""}`}
          >
            <span className="text-[13px] font-semibold text-slate-600">{row.label}</span>
            <span className="text-base font-black tabular-nums text-slate-900">{row.price}</span>
          </Link>
        ))}
      </div>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">{block.note}</p>
    </div>
  );
}
