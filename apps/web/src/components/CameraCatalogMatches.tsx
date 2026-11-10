"use client";

/**
 * Подбор камер каталога под задачу калькулятора объектива (этап B). Расчёт — на сервере
 * (/api/camera-designer/match, данные B0 + цена/наличие из API); здесь — показ, фильтр по типу
 * объектива и отметка «В заявку» (выбранные модели уходят в текст заявки калькулятора).
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { CdCatalogUi } from "@/lib/cameraDesigner/catalogContent";
import type { MatchCard } from "@/app/api/camera-designer/match/route";

export type PickedCamera = { slug: string; name: string; model: string; focalMm: number | null; variant: string | null };

type Resp = {
  verified: MatchCard[];
  review: MatchCard[];
  totals: { verified: number; review: number };
  rejected: { cover: number; density: number; noData: number };
};

const fill = (tpl: string, v: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

export function CameraCatalogMatches(p: {
  depthM: number; widthM: number; ppm: number; locale: string;
  t: CdCatalogUi; units: { m: string; mm: string; ppm: string };
  num: (n: number, frac?: number) => string;
  picked: PickedCamera[]; onToggle: (c: PickedCamera) => void;
}) {
  const { t, num } = p;
  const [kind, setKind] = useState<"all" | "fixed" | "zoom">("all");
  const [data, setData] = useState<Resp | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const seq = useRef(0);

  useEffect(() => {
    const my = ++seq.current;
    setState("loading");
    // запрос — после паузы в наборе; ответ устаревшего запроса отбрасываем
    const timer = setTimeout(async () => {
      try {
        const q = new URLSearchParams({ d: String(Math.round(p.depthM * 100) / 100), w: String(p.widthM), ppm: String(p.ppm), kind, locale: p.locale });
        const res = await fetch(`/api/camera-designer/match?${q}`);
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as Resp;
        if (my === seq.current) { setData(json); setState("ok"); }
      } catch {
        if (my === seq.current) setState("error");
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [p.depthM, p.widthM, p.ppm, kind, p.locale]);

  const fm = (n: number) => `${num(n)} ${p.units.m}`;
  const fmm = (n: number) => `${num(n, 1)} ${p.units.mm}`;
  const fppm = (n: number) => `${num(n, 0)} ${p.units.ppm}`;
  const isPicked = (slug: string) => p.picked.some((x) => x.slug === slug);

  const card = (m: MatchCard) => {
    const variant = m.multiVariant && m.variantFocalMm
      ? (m.variantFocalMm[0] === m.variantFocalMm[1] ? fmm(m.variantFocalMm[0]) : `${num(m.variantFocalMm[0], 1)}–${fmm(m.variantFocalMm[1])}`)
      : null;
    const pick: PickedCamera = { slug: m.slug, name: m.name, model: m.model, focalMm: m.focalMm, variant };
    return (
      <li key={m.slug} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
        <Link href={`/products/${m.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white">
          {m.image ? <Image src={m.image} alt={m.name} fill sizes="80px" unoptimized className="object-contain p-1" /> : <span className="flex h-full items-center justify-center text-2xl" aria-hidden>📷</span>}
        </Link>
        <div className="min-w-0 flex-1">
          <Link href={`/products/${m.slug}`} className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-900 hover:text-brand-700">{m.name}</Link>
          <div className="mt-0.5 text-[11px] text-slate-500">
            {m.widthPx}{m.heightPx ? ` × ${m.heightPx}` : ""} · {t.lens[m.lensType]}{m.analog ? ` · ${t.analog}` : ""}
            {m.focalMm !== null && m.lensType !== "fixed" ? ` · ${fill(t.focal, { f: fmm(m.focalMm) })}${m.focalEstimate ? ` (${t.focalEst})` : ""}` : ""}
          </div>
          <ul className="mt-1 space-y-0.5 text-[12px] text-slate-700">
            <li>✓ {fill(t.scene, { s: fm(m.sceneWidthM), w: fm(p.widthM) })}</li>
            <li>✓ {fill(t.density, { p: fppm(m.ppm), r: `+${num(Math.max(0, (m.ppmRatio - 1) * 100), 0)} %` })}</li>
          </ul>
          {variant ? <div className="mt-1 text-[11px] text-amber-800">{fill(t.variant, { f: variant })} — {t.variantHint}</div> : null}
          {m.wideDistortion ? <div className="mt-1 text-[11px] text-amber-800">{t.distortion}</div> : null}
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className={`text-[12px] font-bold ${m.inStock ? "text-emerald-700" : "text-amber-700"}`}>{m.inStock ? t.inStock : t.onOrder}</span>
            <span className="text-[14px] font-black text-[#e02020]">{m.price ? fill(t.priceFrom, { v: m.price }) : t.priceOnRequest}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => p.onToggle(pick)} aria-pressed={isPicked(m.slug)}
              className={`min-h-[40px] rounded-lg px-3 py-2 text-xs font-bold transition-colors ${isPicked(m.slug) ? "bg-emerald-600 text-white" : "bg-brand-600 text-white hover:bg-brand-500"}`}>
              {isPicked(m.slug) ? t.added : t.add}
            </button>
            <Link href={`/products/${m.slug}`} className="inline-flex min-h-[40px] items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-500">
              {t.open}
            </Link>
          </div>
        </div>
      </li>
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5" aria-busy={state === "loading"}>
      <h2 className="text-base font-black text-slate-900">{t.title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.lead}</p>
      <div role="group" aria-label={t.title} className="mt-3 flex flex-wrap gap-1.5">
        {([["all", t.kindAll], ["fixed", t.kindFixed], ["zoom", t.kindZoom]] as const).map(([k, label]) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}
            className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold ${kind === k ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"}`}>
            {label}
          </button>
        ))}
      </div>

      {state === "loading" && !data ? <p className="mt-4 text-sm text-slate-500">{t.loading}</p> : null}
      {state === "error" ? <p role="alert" className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">{t.error}</p> : null}

      {data && state !== "error" ? (
        <div className={state === "loading" ? "opacity-60 transition-opacity" : ""}>
          {data.verified.length === 0 && data.review.length === 0 ? (
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-700">{t.empty}</p>
          ) : null}
          {data.verified.length ? (
            <>
              <h3 className="mt-5 text-sm font-black text-emerald-800">{t.verified}</h3>
              <ul className="mt-2 grid gap-2 lg:grid-cols-2">{data.verified.map(card)}</ul>
              {data.totals.verified > data.verified.length ? <p className="mt-2 text-xs text-slate-500">{fill(t.more, { n: String(data.totals.verified - data.verified.length) })}</p> : null}
            </>
          ) : null}
          {data.review.length ? (
            <>
              <h3 className="mt-5 text-sm font-black text-amber-800">{t.review}</h3>
              <p className="mt-1 text-xs text-slate-500">{t.reviewNote}</p>
              <ul className="mt-2 grid gap-2 lg:grid-cols-2">{data.review.map(card)}</ul>
            </>
          ) : null}
          <p className="mt-3 text-[11px] text-slate-400">
            {fill(t.rejected, { c: String(data.rejected.cover), d: String(data.rejected.density), n: String(data.rejected.noData) })}
          </p>
        </div>
      ) : null}

      {p.picked.length ? <p className="mt-3 text-sm font-bold text-slate-800">{fill(t.selected, { n: String(p.picked.length) })}</p> : null}
    </section>
  );
}
