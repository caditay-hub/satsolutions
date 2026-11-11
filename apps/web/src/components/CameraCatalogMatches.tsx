"use client";

/**
 * Камеры каталога под задачу (этап B; редизайн, часть 2 — 11.11.2026). Расчёт — на сервере
 * (/api/camera-designer/match, данные B0 + цена/наличие/защита из карточки товара); здесь — показ.
 * У каждой модели: фото, ключевые характеристики, «почему подходит» (те же числа, что в проверке),
 * ссылка на товар и «Получить предложение» — короткая форма прямо в карточке, заявка уходит в CRM
 * тем же путём, что форма калькулятора. Для улицы (env=outdoor) подходящими считаются камеры с IP66+
 * в карточке, без кода защиты — отдельной группой; модели с неподтверждёнными углами — свёрнуто.
 */

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import { trackConversion } from "@/lib/gtag";
import { getGclid } from "@/lib/gclid";
import type { CdCatalogUi } from "@/lib/cameraDesigner/catalogContent";
import type { SimpleUi } from "@/lib/cameraDesigner/simpleContent";
import type { MatchCard } from "@/app/api/camera-designer/match/route";

export type PickedCamera = { slug: string; name: string; model: string; focalMm: number | null; variant: string | null };

type Resp = {
  verified: MatchCard[];
  review: MatchCard[];
  noIp: MatchCard[];
  totals: { verified: number; review: number; noIp: number };
  rejected: { cover: number; density: number; noData: number };
};

const fill = (tpl: string, v: Record<string, string>) => tpl.replace(/\{(\w+)\}/g, (_, k) => v[k] ?? "");

/** Заявка по одной модели: имя и телефон прямо в карточке. */
function OfferForm(p: { pk: SimpleUi["pick"]; message: () => string; placement: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setState("sending");
    try {
      const res = await fetch("https://api.satsolutions.uz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name || "Гость", phone, message: p.message(), gclid: getGclid() || undefined }),
      });
      if (!res.ok) throw new Error("bad status");
      setState("sent");
      const ph = phone.startsWith("+") ? phone : `+998${phone.replace(/\D/g, "").slice(-9)}`;
      trackConversion("lead", { user: { phone: ph }, placement: p.placement });
    } catch {
      setState("error");
    }
  }
  if (state === "sent") return <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800">✓ {p.pk.offerSent}</p>;
  const field = "min-h-[40px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500";
  return (
    <form onSubmit={submit} className="mt-2 grid gap-2 rounded-xl bg-slate-50 p-2.5 sm:grid-cols-[1fr_1fr_auto]">
      <input className={field} name="name" autoComplete="name" aria-label={p.pk.offerName} placeholder={p.pk.offerName} value={name} onChange={(e) => setName(e.target.value)} />
      <input className={field} required type="tel" name="phone" autoComplete="tel" inputMode="tel" aria-label={p.pk.offerPhone} placeholder={p.pk.offerPhone} value={phone} onChange={(e) => setPhone(e.target.value)} />
      <button type="submit" disabled={state === "sending" || !phone.trim()} className="min-h-[40px] rounded-lg bg-brand-600 px-4 text-sm font-bold text-white hover:bg-brand-500 disabled:opacity-50">
        {state === "sending" ? p.pk.offerSending : p.pk.offerSend}
      </button>
      {state === "error" ? <p role="alert" className="text-xs text-red-700 sm:col-span-3">{p.pk.offerError}</p> : null}
    </form>
  );
}

export function CameraCatalogMatches(p: {
  depthM: number; widthM: number; ppm: number; locale: string;
  /** Улица, парковка, вход: проверять защиту корпуса. */
  outdoor: boolean;
  t: CdCatalogUi; pk: SimpleUi["pick"]; mpUnit: string; units: { m: string; mm: string; ppm: string };
  num: (n: number, frac?: number) => string;
  /** Текст задачи для заявки по модели (место, дистанция, зона, уровень) и ссылка на расчёт. */
  leadContext: () => string;
  picked: PickedCamera[]; onToggle: (c: PickedCamera) => void;
}) {
  const { t, pk, num } = p;
  const [kind, setKind] = useState<"all" | "fixed" | "zoom">("all");
  const [data, setData] = useState<Resp | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [offer, setOffer] = useState<string | null>(null);
  const seq = useRef(0);

  useEffect(() => {
    const my = ++seq.current;
    setState("loading");
    // запрос — после паузы в наборе; ответ устаревшего запроса отбрасываем
    const timer = setTimeout(async () => {
      try {
        const q = new URLSearchParams({ d: String(Math.round(p.depthM * 100) / 100), w: String(p.widthM), ppm: String(p.ppm), kind, locale: p.locale });
        if (p.outdoor) q.set("env", "outdoor");
        const res = await fetch(`/api/camera-designer/match?${q}`);
        if (!res.ok) throw new Error(String(res.status));
        const json = (await res.json()) as Resp;
        if (my === seq.current) { setData({ ...json, noIp: json.noIp ?? [] }); setState("ok"); }
      } catch {
        if (my === seq.current) setState("error");
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [p.depthM, p.widthM, p.ppm, kind, p.locale, p.outdoor]);

  const fm = (n: number) => `${num(n)} ${p.units.m}`;
  const fmm = (n: number) => `${num(n, 1)} ${p.units.mm}`;
  const fppm = (n: number) => `${num(n, n >= 100 ? 0 : 1)} ${p.units.ppm}`; // как в калькуляторе: 62,5, а не 63
  const isPicked = (slug: string) => p.picked.some((x) => x.slug === slug);

  const card = (m: MatchCard) => {
    const variant = m.multiVariant && m.variantFocalMm
      ? (m.variantFocalMm[0] === m.variantFocalMm[1] ? fmm(m.variantFocalMm[0]) : `${num(m.variantFocalMm[0], 1)}–${fmm(m.variantFocalMm[1])}`)
      : null;
    const lens = m.focalMm !== null ? `${fmm(m.focalMm)}${m.focalEstimate ? ` (${t.focalEst})` : ""}` : null;
    const mp = m.heightPx ? `${num((m.widthPx * m.heightPx) / 1e6, 1)} ${p.mpUnit}` : null;
    const pick: PickedCamera = { slug: m.slug, name: m.name, model: m.model, focalMm: m.focalMm, variant };
    const why = [
      fill(pk.whyAngle, { a: `${num(m.hfovDeg, 1)}°`, s: fm(m.sceneWidthM), w: fm(p.widthM) }),
      fill(pk.whyDensity, { p: fppm(m.ppm), n: fppm(p.ppm), r: `+${num(Math.max(0, (m.ppmRatio - 1) * 100), 0)} %` }),
    ];
    const message = () => [
      `📐 Заявка из подбора камеры (${p.locale}): ${m.name}`,
      `Товар: /products/${m.slug}${variant ? ` [исполнение ${variant}]` : ""}`,
      p.leadContext(),
      `Почему подходит: ${why.join("; ")}${m.ip !== null ? `; IP${m.ip}` : "; защита в карточке не указана"}`,
      m.reviewNote ? "⚠ углы нужно уточнить по документации" : "",
    ].filter(Boolean).join("\n");
    return (
      <li key={m.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-3.5">
        <div className="flex gap-3">
          <Link href={`/products/${m.slug}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-slate-100">
            {m.image ? <Image src={m.image} alt={m.name} fill sizes="96px" unoptimized className="object-contain p-1" /> : <span className="flex h-full items-center justify-center text-2xl" aria-hidden>📷</span>}
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/products/${m.slug}`} className="line-clamp-2 text-[13px] font-bold leading-snug text-slate-900 hover:text-brand-700">{m.name}</Link>
            {/* ключевые характеристики */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {[
                `${m.widthPx}${m.heightPx ? `×${m.heightPx}` : ""}${mp ? ` · ${mp}` : ""}`,
                t.lens[m.lensType],
                lens,
                m.ip !== null ? fill(pk.ip, { v: `IP${m.ip}` }) : null,
                m.analog ? t.analog : null,
              ].filter(Boolean).map((x) => (
                <span key={x} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-700">{x}</span>
              ))}
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-[14px] font-black text-[#e02020]">{m.price ? fill(t.priceFrom, { v: m.price }) : t.priceOnRequest}</span>
              <span className={`text-[12px] font-bold ${m.inStock ? "text-emerald-700" : "text-amber-700"}`}>{m.inStock ? t.inStock : t.onOrder}</span>
            </div>
          </div>
        </div>
        {/* почему подходит — те же числа, что в проверке подбора */}
        <div className="mt-2.5 rounded-xl bg-emerald-50/70 px-3 py-2">
          <div className="text-[10px] font-black uppercase tracking-wider text-emerald-800">{pk.why}</div>
          <ul className="mt-0.5 space-y-0.5 text-[12px] leading-snug text-slate-700">
            {why.map((x) => <li key={x}>✓ {x}</li>)}
            {p.outdoor && m.ip === null ? <li className="text-amber-800">• {pk.ipNone}</li> : null}
          </ul>
        </div>
        {variant ? <div className="mt-1.5 text-[11px] text-amber-800">{fill(t.variant, { f: variant })} — {t.variantHint}</div> : null}
        {m.wideDistortion ? <div className="mt-1 text-[11px] text-amber-800">{t.distortion}</div> : null}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2.5">
          <button type="button" aria-expanded={offer === m.slug} onClick={() => setOffer((x) => (x === m.slug ? null : m.slug))}
            className="min-h-[40px] rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-brand-500">
            {pk.offer}
          </button>
          <Link href={`/products/${m.slug}`} className="inline-flex min-h-[40px] items-center rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700 hover:border-brand-500">
            {t.open}
          </Link>
          <button type="button" onClick={() => p.onToggle(pick)} aria-pressed={isPicked(m.slug)}
            className={`min-h-[40px] px-1 text-xs font-semibold ${isPicked(m.slug) ? "text-emerald-700" : "text-slate-500 hover:text-brand-700"}`}>
            {isPicked(m.slug) ? pk.addedLead : pk.addLead}
          </button>
        </div>
        {offer === m.slug ? <OfferForm pk={pk} message={message} placement="camera_pick_offer" /> : null}
      </li>
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5" aria-busy={state === "loading"}>
      <h2 className="text-base font-black text-slate-900">{t.title}</h2>
      <p className="mt-1 text-sm leading-relaxed text-slate-600">{t.lead}{p.outdoor ? ` ${pk.outdoorNote}` : ""}</p>
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
          {data.verified.length === 0 && data.noIp.length === 0 && data.review.length === 0 ? (
            <p className="mt-4 rounded-lg bg-slate-50 px-3 py-3 text-sm leading-relaxed text-slate-700">{t.empty}</p>
          ) : null}
          {data.verified.length ? (
            <>
              <h3 className="mt-5 text-sm font-black text-emerald-800">{t.verified}</h3>
              <ul className="mt-2 grid gap-2.5 xl:grid-cols-2">{data.verified.map(card)}</ul>
              {data.totals.verified > data.verified.length ? <p className="mt-2 text-xs text-slate-500">{fill(t.more, { n: String(data.totals.verified - data.verified.length) })}</p> : null}
            </>
          ) : null}
          {data.noIp.length ? (
            <>
              <h3 className="mt-6 text-sm font-black text-amber-800">{pk.noIpTitle}</h3>
              <p className="mt-1 text-xs text-slate-500">{pk.noIpNote}</p>
              <ul className="mt-2 grid gap-2.5 xl:grid-cols-2">{data.noIp.map(card)}</ul>
            </>
          ) : null}
          {data.review.length ? (
            <details className="group mt-6 rounded-xl border border-slate-200">
              <summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-black text-amber-800 [&::-webkit-details-marker]:hidden">
                {fill(pk.reviewSummary, { n: String(data.review.length) })}
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
              </summary>
              <div className="border-t border-slate-100 p-3">
                <p className="text-xs text-slate-500">{t.reviewNote}</p>
                <ul className="mt-2 grid gap-2.5 xl:grid-cols-2">{data.review.map(card)}</ul>
              </div>
            </details>
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
