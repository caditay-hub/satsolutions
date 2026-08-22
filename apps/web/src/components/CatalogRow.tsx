"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations, useLocale } from "next-intl";
import type { ProductDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { priceInfo, productIcon } from "@/lib/product";
import { displayModelCode } from "@/lib/modelCodeDisplay";
import { OrderButton } from "@/components/OrderButton";

const NOISE = new Set(["Артикул", "Артикул производителя", "Гарантия", "Цена"]);

// Строка списка в стиле NAG: фото слева, посередине артикул+название+ключевые
// характеристики, справа наличие, цена и кнопка «Получить КП».
export function CatalogRow({ p, name }: { p: ProductDto; usdToUzs?: number; name?: string }) {
  const tc = useTranslations("common");
  const locale = useLocale();
  const displayName = name ?? p.name;
  const img = resolveImageUrl(p.coverImageUrl);
  const info = priceInfo(p);
  const price = info ? (info.kind === "value" ? tc("priceFrom", { value: info.value }) : tc("priceOnRequest")) : null;

  const specs = Object.entries(p.characteristics || {})
    .filter(([k, v]) => k && v && !NOISE.has(k) && String(v).trim().length > 0 && String(v).length <= 40)
    .slice(0, 4);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-brand-400 sm:flex-row sm:items-center">
      <Link href={`/products/${p.slug}`} className="relative block h-24 w-24 shrink-0 self-center overflow-hidden rounded-lg bg-white sm:self-start">
        {img ? (
          <Image alt={displayName} src={img} fill sizes="96px" loading="lazy" unoptimized className="object-contain p-1" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-brand-50">
            <span className="text-3xl opacity-50" aria-hidden>{productIcon(p.name)}</span>
          </div>
        )}
      </Link>

      <div className="min-w-0 flex-1">
        {displayModelCode(p.modelCode, locale) ? (
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{displayModelCode(p.modelCode, locale)}</div>
        ) : null}
        <Link href={`/products/${p.slug}`} className="block text-[15px] font-bold leading-snug text-slate-900 hover:text-brand-700 first-letter:uppercase">
          {displayName}
        </Link>
        {specs.length > 0 ? (
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-slate-500">
            {specs.map(([k, v]) => (
              <span key={k}><span className="text-slate-400">{k}:</span> <span className="text-slate-700">{v}</span></span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 flex-row items-center justify-between gap-3 sm:w-48 sm:flex-col sm:items-end sm:justify-start sm:text-right">
        {(p as any).inStock === false ? (
          <div className="inline-flex items-center gap-1 text-[12px] font-bold text-amber-600">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            {tc("onOrder")}
          </div>
        ) : (
          <div className="inline-flex items-center gap-1 text-[12px] font-bold text-emerald-600">
            <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.5l2.5 2.5 4.5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {tc("inStock")}
          </div>
        )}
        {price ? <div className="text-[15px] font-black text-[#e02020]">{price}</div> : null}
        <OrderButton productId={p.id} productName={displayName} price={p.price} label={tc("order")} variant="brand" />
      </div>
    </div>
  );
}
