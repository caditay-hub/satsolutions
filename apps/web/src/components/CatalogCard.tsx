"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { ProductDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { priceInfo, productIcon } from "@/lib/product";
import { OrderButton } from "@/components/OrderButton";

// Карточка-плитка в стиле NAG: фото сверху, артикул, название, наличие,
// крупная цена и кнопка «Получить КП» на всю ширину снизу.
export function CatalogCard({ p, name }: { p: ProductDto; usdToUzs?: number; name?: string }) {
  const tc = useTranslations("common");
  const displayName = name ?? p.name;
  const img = resolveImageUrl(p.coverImageUrl);
  const info = priceInfo(p);
  const price = info ? (info.kind === "value" ? tc("priceFrom", { value: info.value }) : tc("priceOnRequest")) : null;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-brand-400 hover:shadow-md">
      <Link href={`/products/${p.slug}`} className="relative block aspect-square w-full overflow-hidden bg-white">
        {p.recommended ? (
          <span className="absolute left-2 top-2 z-10 rounded-md bg-brand-600 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">Хит</span>
        ) : null}
        {img ? (
          <Image alt={displayName} src={img} fill sizes="(max-width:640px) 50vw, 25vw" loading="lazy" unoptimized className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-100 via-white to-brand-50">
            <span className="text-4xl opacity-50" aria-hidden>{productIcon(p.name)}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tc("noPhoto")}</span>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col border-t border-slate-100 p-3">
        {p.modelCode ? (
          <div className="truncate text-[11px] font-bold uppercase tracking-wide text-slate-500">{p.modelCode}</div>
        ) : null}
        <Link href={`/products/${p.slug}`} className="mt-0.5 line-clamp-3 text-[13px] font-bold leading-snug text-slate-900 hover:text-brand-700 first-letter:uppercase">
          {displayName}
        </Link>

        <div className="mt-auto pt-2">
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
          {price ? <div className="mt-0.5 text-[16px] font-black text-[#e02020]">{price}</div> : null}
        </div>
      </div>

      <div className="px-3 pb-3">
        <OrderButton productId={p.id} productName={displayName} price={p.price} label={tc("order")} variant="brand" fullWidth />
      </div>
    </div>
  );
}
