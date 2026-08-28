"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { ProductDto } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import { priceInfo, productIcon, isNewProduct } from "@/lib/product";

export function ProductCard({ p, name }: { p: ProductDto; usdToUzs?: number; name?: string }) {
  const tc = useTranslations("common");
  // Локализованное имя приходит пропсом из серверного родителя (оверлей 2.8 МБ
  // в client-бандл не тянем); фолбэк — имя из БД (русское).
  const displayName = name ?? p.name;
  const img = resolveImageUrl(p.coverImageUrl);
  const info = priceInfo(p);
  const price = info ? (info.kind === "value" ? tc("priceFrom", { value: info.value }) : tc("priceOnRequest")) : null;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="card-interactive group flex flex-col border-2 border-slate-200 hover:border-brand-500 rounded-xl overflow-hidden"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-white">
        {isNewProduct(p) && (
          <span className="absolute left-2 top-2 z-[2] rounded-md bg-green-600 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-sm">
            {tc("newBadge")}
          </span>
        )}
        {img ? (
          <Image
            alt={displayName}
            src={img}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            loading="lazy"
            unoptimized
            className="object-contain p-2 transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="relative flex h-full w-full flex-col items-center justify-center gap-1.5 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-brand-50">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #0f2231 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }} aria-hidden />
            <span className="relative text-4xl opacity-50" aria-hidden>{productIcon(p.name)}</span>
            <span className="relative text-[10px] font-bold uppercase tracking-wider text-slate-400">{tc("noPhoto")}</span>
          </div>
        )}
      </div>
      <div className="px-2.5 py-1.5 border-t border-slate-100 bg-white">
        <div className="text-[13px] leading-snug font-bold text-slate-900 line-clamp-2 first-letter:uppercase">{displayName}</div>
        {price ? <div className="mt-1 text-[13px] font-black text-[#e02020]">{price}</div> : null}
      </div>
    </Link>
  );
}



/** Карточка блока «Новинки» — вид из утверждённого мокапа: зелёный бейдж,
 *  квадратное фото, бренд красным капсом, крупная цена, кнопка «Заказать». */
export function NewArrivalCard({ p, name, brandName }: { p: ProductDto; name?: string; brandName?: string | null }) {
  const tc = useTranslations("common");
  const displayName = name ?? p.name;
  const img = resolveImageUrl(p.coverImageUrl);
  const info = priceInfo(p);
  const price = info ? (info.kind === "value" ? tc("priceSum", { value: info.value }) : tc("priceOnRequest")) : null;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-3.5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md"
    >
      <span className="absolute left-3 top-3 z-[2] rounded-lg bg-green-600 px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
        {tc("newBadge")}
      </span>
      <span className="relative block aspect-square w-full overflow-hidden bg-white">
        {img ? (
          <Image
            alt={displayName}
            src={img}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            loading="lazy"
            unoptimized
            className="object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-100 via-white to-brand-50">
            <span className="text-4xl opacity-50" aria-hidden>{productIcon(p.name)}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{tc("noPhoto")}</span>
          </span>
        )}
      </span>
      {brandName ? (
        <span className="mt-2 text-[10.5px] font-extrabold uppercase tracking-wide text-brand-600">● {brandName}</span>
      ) : null}
      <span className="mt-1 min-h-[54px] text-[13.5px] font-semibold leading-snug text-slate-900 line-clamp-3 first-letter:uppercase">
        {displayName}
      </span>
      {price ? <span className="mb-2.5 mt-2 text-base font-extrabold text-brand-600">{price}</span> : null}
      <span className="mt-auto rounded-xl bg-brand-600 py-2.5 text-center text-[13.5px] font-bold text-white transition-colors group-hover:bg-brand-700">
        {tc("order")}
      </span>
    </Link>
  );
}
