"use client";

/**
 * Смета под планом объекта и в ручном режиме (SAT Camera Designer, этап D).
 * Подбор и расчёт — lib/cameraDesigner/estimate (тесты estimate.test.ts); характеристики
 * оборудования — этап D0 (estimateEquipment.json), цены и наличие — /api/camera-designer/equipment.
 */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { estimate, type EstCam, type EstResult, type EstSettings, type LineKind, type PriceMap } from "@/lib/cameraDesigner/estimate/estimate";
import type { CdEstUi } from "@/lib/cameraDesigner/estContent";
import { fill, makeFmt } from "@/lib/cameraDesigner/format";
import type { EquipmentResponse } from "@/app/api/camera-designer/equipment/route";

/** Камера для сметы до подстановки потребления (его знает ответ API оборудования). */
export type EstInput = Omit<EstCam, "powerW" | "poe" | "powerReview"> & { label: string; name: string };

/** Строки сметы с названиями — для таблицы, текста заявки и КП. */
export type EstView = {
  r: EstResult;
  rows: { kind: LineKind; name: string; qty: number; unit: string; price: number | null; sum: number | null; engineer: boolean }[];
  labor: { name: string; qty: number; unit: string; price: number; sum: number }[];
};

let cache: { locale: string; p: Promise<EquipmentResponse> } | null = null;
function loadEquipment(locale: string) {
  if (!cache || cache.locale !== locale) {
    cache = { locale, p: fetch(`/api/camera-designer/equipment?locale=${locale}`).then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status))))) };
    cache.p.catch(() => { cache = null; });
  }
  return cache.p;
}

const segCls = (on: boolean) => `min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold ${on ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"}`;

export function EstimatePanel(p: {
  ui: CdEstUi;
  locale: string;
  cams: EstInput[];
  camPrices: Record<string, number | null>;
  settings: EstSettings;
  onSettings: (s: EstSettings) => void;
  money: (v: string) => string;
  /** Подсказка о длине кабеля (шкаф на плане или средняя длина) и поля ручного режима. */
  cableNote?: ReactNode;
  onView?: (v: EstView | null) => void;
  onKp?: () => void;
}) {
  const { ui, settings: s } = p;
  const { num } = makeFmt(p.locale);
  const [eq, setEq] = useState<EquipmentResponse | null>(null);
  const [err, setErr] = useState(false);
  useEffect(() => {
    let alive = true;
    loadEquipment(p.locale).then((d) => alive && setEq(d)).catch(() => alive && setErr(true));
    return () => { alive = false; };
  }, [p.locale]);

  const view = useMemo<EstView | null>(() => {
    if (!eq || !p.cams.length) return null;
    const cams: EstCam[] = p.cams.map((c) => {
      const pw = c.slug ? eq.power[c.slug] : undefined;
      return { ...c, powerW: pw?.w ?? null, poe: pw?.poe ?? null, powerReview: pw?.review };
    });
    const pm: PriceMap = Object.fromEntries(Object.entries(eq.prices).map(([k, v]) => [k, { price: v.price, inStock: v.inStock }]));
    const r = estimate(cams, p.camPrices, s, eq.equipment, pm);
    const camName = new Map(p.cams.map((c) => [c.key, c.name]));
    const unit = (u: string) => ui.units[u as keyof CdEstUi["units"]] ?? u;
    const rows = r.lines.map((l) => {
      const fixed = l.kind === "bracket" || l.kind === "psu" || l.kind === "hipoe" || l.kind === "coax";
      let name = fixed ? ui.lines[l.kind as "bracket" | "psu" | "hipoe" | "coax"] : l.kind === "camera" ? camName.get(l.key ?? "") ?? l.key ?? "" : (l.slug && eq.prices[l.slug]?.name) || l.slug || "";
      if (l.kind === "cable" && !/внутрен|наруж|ichki|koʻcha|indoor|outdoor/i.test(name)) name += ` (${l.outdoor ? ui.lines.cableOut : ui.lines.cableIn})`;
      return { kind: l.kind, name, qty: l.qty, unit: unit(l.unit), price: l.price, sum: l.sum, engineer: fixed };
    });
    const labor = r.labor.map((l) => ({ name: ui.labor[l.code], qty: l.qty, unit: ["cableOpen", "gofra", "shtroba", "cableTray"].includes(l.code) ? ui.units.m : ui.units.pc, price: l.price, sum: l.sum }));
    return { r, rows, labor };
  }, [eq, p.cams, p.camPrices, s, ui]);

  useEffect(() => { p.onView?.(view); }, [view]); // eslint-disable-line react-hooks/exhaustive-deps

  const m = (v: number) => p.money(num(v, 0));
  const warnText = (w: EstResult["warnings"][number]) => {
    switch (w.code) {
      case "noRecorder": return w.kind === "nvr" ? ui.warn.noNvr : ui.warn.noDvr;
      case "onvif": return fill(ui.warn.onvif, { brands: w.brands.join(", "), brand: view?.r.recorder?.brand ?? view?.r.dvr?.brand ?? "" });
      case "longCable": return fill(ui.warn.longCable, { cams: [...new Set(p.cams.filter((c) => w.keys.includes(c.key) && c.cableM > 90).map((c) => c.label))].join(", ") });
      case "noUps": return ui.warn.noUps;
      case "powerEstimate": return ui.warn.powerEstimate;
    }
  };
  const th = "py-1.5 pr-2 text-left text-[10px] font-bold uppercase tracking-wide text-slate-500";

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4">
      <h2 className="text-base font-black text-slate-900">{ui.title}</h2>
      <p className="mt-1 max-w-4xl text-xs leading-relaxed text-slate-600">{ui.lead}</p>

      <div className="mt-3 flex flex-wrap items-end gap-x-5 gap-y-3">
        <div>
          <label htmlFor="est-days" className="mb-1 block text-xs font-semibold text-slate-600">{ui.archive}</label>
          <input id="est-days" type="number" min={1} max={365} step={1} value={s.days} className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm tabular-nums"
            onChange={(e) => { const v = Math.round(Number(e.target.value)); if (v >= 1 && v <= 365) p.onSettings({ ...s, days: v }); }} />
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-600">{ui.record}</div>
          <div className="flex gap-1.5">
            <button type="button" aria-pressed={s.mode === "continuous"} className={segCls(s.mode === "continuous")} onClick={() => p.onSettings({ ...s, mode: "continuous" })}>{ui.continuous}</button>
            <button type="button" aria-pressed={s.mode === "motion"} className={segCls(s.mode === "motion")} onClick={() => p.onSettings({ ...s, mode: "motion" })}>{ui.motion}</button>
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-600">{ui.codec}</div>
          <div className="flex gap-1.5">
            {(["h265", "h264"] as const).map((c) => <button key={c} type="button" aria-pressed={s.codec === c} className={segCls(s.codec === c)} onClick={() => p.onSettings({ ...s, codec: c })}>{c === "h265" ? "H.265" : "H.264"}</button>)}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold text-slate-600">{ui.trace}</div>
          <div className="flex flex-wrap gap-1.5">
            <button type="button" aria-pressed={s.trace === "need"} className={segCls(s.trace === "need")} onClick={() => p.onSettings({ ...s, trace: "need" })}>{ui.traceNeed}</button>
            <button type="button" aria-pressed={s.trace === "ready"} className={segCls(s.trace === "ready")} onClick={() => p.onSettings({ ...s, trace: "ready" })}>{ui.traceReady}</button>
          </div>
        </div>
      </div>
      {p.cableNote ? <div className="mt-3">{p.cableNote}</div> : null}

      {!p.cams.length ? <p className="mt-4 text-sm text-slate-500">{ui.empty}</p>
        : err ? <p role="alert" className="mt-4 text-sm font-semibold text-red-600">{ui.error}</p>
        : !view ? <p className="mt-4 text-sm text-slate-500">{ui.loading}</p>
        : (
          <div className="mt-4">
            <p className="text-xs text-slate-600">
              {fill(ui.storage, { tb: num(view.r.storageTb, 1), mbps: num(view.r.mbps, 0), days: String(s.days) })}
              {view.r.poeW ? ` · ${fill(ui.poe, { w: num(view.r.poeW, 0) })}` : ""}
            </p>
            {view.r.warnings.length ? (
              <ul className="mt-2 space-y-1">
                {view.r.warnings.map((w, i) => <li key={i} className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs leading-relaxed text-amber-900">{warnText(w)}</li>)}
              </ul>
            ) : null}

            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[560px] text-xs">
                <thead><tr className="border-b border-slate-200"><th className={th}>{ui.equipTitle}</th><th className={`${th} text-right`}>{ui.colQty}</th><th className={`${th} text-right`}>{ui.colPrice}</th><th className={`${th} text-right`}>{ui.colSum}</th></tr></thead>
                <tbody>
                  {view.rows.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 align-top last:border-0">
                      <td className="py-1.5 pr-2 text-slate-800">{r.name}</td>
                      <td className="whitespace-nowrap py-1.5 pr-2 text-right tabular-nums">{r.qty} {r.unit}</td>
                      <td className="whitespace-nowrap py-1.5 pr-2 text-right tabular-nums text-slate-600">{r.engineer ? ui.engineer : r.price ? num(r.price, 0) : ui.onRequest}</td>
                      <td className="whitespace-nowrap py-1.5 text-right tabular-nums font-semibold">{r.sum !== null ? num(r.sum, 0) : "—"}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-300"><td className="py-2 pr-2 font-black" colSpan={3}>{ui.equipTotal}</td><td className="whitespace-nowrap py-2 text-right font-black tabular-nums">{m(view.r.totals.equipment)}</td></tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-xs">
                <thead><tr className="border-b border-slate-200"><th className={th}>{ui.laborTitle}</th><th className={`${th} text-right`}>{ui.colQty}</th><th className={`${th} text-right`}>{ui.colPrice}</th><th className={`${th} text-right`}>{ui.colSum}</th></tr></thead>
                <tbody>
                  {view.labor.map((l, i) => (
                    <tr key={i} className="border-b border-slate-100 last:border-0">
                      <td className="py-1.5 pr-2 text-slate-800">{l.name}</td>
                      <td className="whitespace-nowrap py-1.5 pr-2 text-right tabular-nums">{num(l.qty, 0)} {l.unit}</td>
                      <td className="whitespace-nowrap py-1.5 pr-2 text-right tabular-nums text-slate-600">{num(l.price, 0)}</td>
                      <td className="whitespace-nowrap py-1.5 text-right tabular-nums font-semibold">{num(l.sum, 0)}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-300">
                    <td className="py-2 pr-2 font-black" colSpan={3}>{ui.laborTotal}{view.r.totals.kHigh > 1 ? ` (×${num(view.r.totals.kHigh, 1)})` : ""}</td>
                    <td className="whitespace-nowrap py-2 text-right font-black tabular-nums">{fill(ui.range, { a: num(view.r.totals.laborLow, 0), b: m(view.r.totals.laborHigh) })}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 rounded-xl bg-brand-50 px-4 py-3">
              <div className="text-sm font-black text-slate-900">{ui.total}</div>
              <div className="text-lg font-black tabular-nums text-brand-800">{fill(ui.range, { a: num(view.r.totals.low, 0), b: m(view.r.totals.high) })}</div>
            </div>
            {view.r.totals.onRequest ? <p className="mt-2 text-[11px] text-slate-500">{fill(ui.onRequestNote, { n: String(view.r.totals.onRequest) })}</p> : null}
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{ui.bitrateNote}</p>
            {p.onKp ? <button type="button" onClick={p.onKp} className="mt-3 inline-flex min-h-[44px] items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-bold text-white hover:bg-brand-700">{ui.kp}</button> : null}
          </div>
        )}
    </section>
  );
}
