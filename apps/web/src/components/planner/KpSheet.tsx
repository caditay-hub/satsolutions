/**
 * Лист коммерческого предложения для печати в PDF (SAT Camera Designer, этап D). Решение владельца
 * 10.11: фирменная страница → «Сохранить как PDF» в браузере, без библиотек PDF; только контакты
 * (без ИНН и банка); «ориентировочно, цены на дату, 3 дня»; позиции без цены — «по запросу».
 */
import type { CdEstUi } from "@/lib/cameraDesigner/estContent";
import { fill, makeFmt } from "@/lib/cameraDesigner/format";
import type { EstView } from "./EstimatePanel";

/** Одинаковые камеры — одной строкой: «К1, К2, К5 — модель». */
function groupCams(cams: { label: string; name: string }[]) {
  const m = new Map<string, string[]>();
  for (const c of cams) m.set(c.name, [...(m.get(c.name) ?? []), c.label]);
  return [...m].map(([name, labels]) => `${labels.join(", ")} — ${name}`);
}

/** Дата КП по-местному: 10.11.2026; в китайской версии — 2026-11-10. */
export const kpDate = (locale: string, iso: string) => (locale === "zh" ? iso : iso.split("-").reverse().join("."));

export function KpSheet(p: { ui: CdEstUi; locale: string; view: EstView; no: string; date: string; planImg: string | null; cams: { label: string; name: string }[]; money: (v: string) => string }) {
  const { ui, view } = p;
  const { num } = makeFmt(p.locale);
  const m = (v: number) => p.money(num(v, 0));
  const cell = "border border-slate-300 px-2 py-1";
  return (
    <div className="text-[11px] leading-snug text-black">
      <div className="flex items-start justify-between gap-4 border-b-2 border-slate-800 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="SAT Solutions" className="h-10 w-auto" />
        <div className="text-right text-[10px]">
          <div className="font-bold">SAT Solutions</div>
          <div>+998 97 862-66-99 · sales@satsolutions.uz</div>
          <div>t.me/sales_satsolutions · satsolutions.uz</div>
        </div>
      </div>
      <h1 className="mt-3 text-lg font-black">{ui.kpTitle}</h1>
      <div className="text-xs">{ui.kpSub}</div>
      <div className="mt-1 text-[10px] text-slate-600">{fill(ui.kpNo, { n: p.no, d: p.date })}</div>

      <table className="mt-3 w-full border-collapse">
        <thead><tr className="bg-slate-100 font-bold"><td className={cell}>{ui.equipTitle}</td><td className={`${cell} text-right`}>{ui.colQty}</td><td className={`${cell} text-right`}>{ui.colPrice}</td><td className={`${cell} text-right`}>{ui.colSum}</td></tr></thead>
        <tbody>
          {view.rows.map((r, i) => (
            <tr key={i}><td className={cell}>{r.name}</td><td className={`${cell} whitespace-nowrap text-right`}>{r.qty} {r.unit}</td>
              <td className={`${cell} whitespace-nowrap text-right`}>{r.engineer ? ui.engineer : r.price ? num(r.price, 0) : ui.onRequest}</td>
              <td className={`${cell} whitespace-nowrap text-right`}>{r.sum !== null ? num(r.sum, 0) : "—"}</td></tr>
          ))}
          <tr className="font-bold"><td className={cell} colSpan={3}>{ui.equipTotal}</td><td className={`${cell} whitespace-nowrap text-right`}>{m(view.r.totals.equipment)}</td></tr>
        </tbody>
      </table>

      <table className="mt-3 w-full border-collapse">
        <thead><tr className="bg-slate-100 font-bold"><td className={cell}>{ui.laborTitle}</td><td className={`${cell} text-right`}>{ui.colQty}</td><td className={`${cell} text-right`}>{ui.colPrice}</td><td className={`${cell} text-right`}>{ui.colSum}</td></tr></thead>
        <tbody>
          {view.labor.map((l, i) => (
            <tr key={i}><td className={cell}>{l.name}</td><td className={`${cell} whitespace-nowrap text-right`}>{num(l.qty, 0)} {l.unit}</td>
              <td className={`${cell} whitespace-nowrap text-right`}>{num(l.price, 0)}</td><td className={`${cell} whitespace-nowrap text-right`}>{num(l.sum, 0)}</td></tr>
          ))}
          <tr className="font-bold"><td className={cell} colSpan={3}>{ui.laborTotal}{view.r.totals.kHigh > 1 ? ` (×${num(view.r.totals.kHigh, 1)})` : ""}</td>
            <td className={`${cell} whitespace-nowrap text-right`}>{fill(ui.range, { a: num(view.r.totals.laborLow, 0), b: m(view.r.totals.laborHigh) })}</td></tr>
        </tbody>
      </table>

      <div className="mt-3 flex justify-between border-y-2 border-slate-800 py-2 text-sm font-black">
        <span>{ui.total}</span><span>{fill(ui.range, { a: num(view.r.totals.low, 0), b: m(view.r.totals.high) })}</span>
      </div>
      {view.r.totals.onRequest ? <p className="mt-1 text-[10px]">{fill(ui.onRequestNote, { n: String(view.r.totals.onRequest) })}</p> : null}
      <p className="mt-2">{ui.kpTerms}</p>

      {p.planImg ? (
        <div className="mt-3 break-inside-avoid">
          <div className="font-bold">{ui.kpPlan}</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={p.planImg} alt="" className="mt-1 w-full" />
        </div>
      ) : null}
      {p.cams.length ? <p className="mt-2 text-[10px]"><b>{ui.kpCameras}:</b> {groupCams(p.cams).join("; ")}</p> : null}

      <p className="mt-3 text-[9px] text-slate-600">{ui.kpMethod} {ui.bitrateNote}</p>
      <div className="mt-2 border-t border-slate-300 pt-2 text-[10px]">
        <b>{ui.kpContacts}:</b> SAT Solutions · {ui.kpAddress} · +998 97 862-66-99 · sales@satsolutions.uz · t.me/sales_satsolutions · {ui.kpHours}
      </div>
    </div>
  );
}
