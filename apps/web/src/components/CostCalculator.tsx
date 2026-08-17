"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { trackConversion } from "@/lib/gtag";
import { getGclid } from "@/lib/gclid";
import {
  OBJECTS, OBJECT_KEYS, SYSTEMS, applyDefaults, calc, initialState, unitRates,
  type CalcResult, type CalcState, type ObjectKey, type SystemKey,
} from "@/lib/calcPricing";

/* ─────────── план объекта ─────────── */

const W = 420, H = 320, M = 26;
const X0 = M, Y0 = M, X1 = W - M, Y1 = H - M - 16;

// Координаты округляем: Math.cos/sin дают разные последние знаки в Node и в
// браузере, и React ругается на несовпадение разметки при гидратации.
const r2 = (n: number) => Math.round(n * 100) / 100;

// Сектор обзора камеры — ±32° радиусом 52. Камера смотрит всегда «внутрь», то
// есть угол принимает ровно четыре значения, поэтому смещения посчитаны заранее
// таблицей: никакой тригонометрии в рендере и одинаковая разметка на сервере и
// на клиенте.
const FOV: Record<number, [number, number, number, number]> = {
  0:   [ 44.1, -27.56,  44.1,  27.56],
  90:  [ 27.56,  44.1, -27.56,  44.1],
  180: [-44.1,  27.56, -44.1, -27.56],
  270: [-27.56, -44.1,  27.56, -44.1],
};

type Marker = { x: number; y: number; ang: number; side: number; t: "in" | "out" | "ptz" };

function buildPlan(st: CalcState) {
  const num = (x: unknown) => Number(x) || 0;
  const cams: Marker["t"][] = [];
  if (st.on.cctv) {
    for (let i = 0; i < Math.min(num(st.v.cctv.in), 10); i++) cams.push("in");
    for (let i = 0; i < Math.min(num(st.v.cctv.out), 10); i++) cams.push("out");
    for (let i = 0; i < Math.min(num(st.v.cctv.ptz), 4); i++) cams.push("ptz");
  }
  const doorCount = st.on.acs ? Math.min(num(st.v.acs.doors), 8) : 0;
  const detCount = st.on.fire
    ? Math.min(st.v.fire.auto === "on" ? Math.round(st.area / 30) : num(st.v.fire.det), 14)
    : 0;
  const wifiCount = st.on.lan ? Math.min(num(st.v.lan.wifi), 6) : 0;

  // камеры по периметру; полшага смещения — иначе первая на каждой стене
  // садится в угол, где уже дверь и серверная стойка
  const pw = X1 - X0 - 40, ph = Y1 - Y0 - 40, n = Math.max(cams.length, 1);
  const markers: Marker[] = cams.map((t, i) => {
    const p = (i + 0.5) / n, side = Math.floor(p * 4), f = (p * 4) % 1;
    if (side === 0) return { x: r2(X0 + 20 + pw * f), y: Y0 + 14, ang: 90, side, t };
    if (side === 1) return { x: X1 - 14, y: r2(Y0 + 20 + ph * f), ang: 180, side, t };
    if (side === 2) return { x: r2(X1 - 20 - pw * f), y: Y1 - 14, ang: 270, side, t };
    return { x: X0 + 14, y: r2(Y1 - 20 - ph * f), ang: 0, side, t };
  });

  // Двери: стены раздаём начиная с нижней (там обычно главный вход), а место на
  // стене ищем с максимальным зазором до камер и соседних дверей.
  const DOOR_SIDE = [2, 3, 1, 0];
  const wallLen = (s: number) => (s % 2 === 0 ? X1 - X0 : Y1 - Y0);
  const doorPos = (s: number, f: number) => {
    const L = wallLen(s);
    return s < 2 ? 30 + (L - 60) * f : L - 30 - (L - 60) * f;
  };
  const busy: Record<number, number[]> = { 0: [], 1: [], 2: [], 3: [] };
  markers.forEach((c) => busy[c.side].push(c.side % 2 === 0 ? c.x - X0 : c.y - Y0));
  busy[1].push(31, 50);                     // серверная стойка на правой стене
  busy[0].push(X1 - 46 - X0, X1 - 16 - X0); // и её край на верхней

  const doors: { x: number; y: number; rot: number }[] = [];
  for (let i = 0; i < doorCount; i++) {
    const side = DOOR_SIDE[i % 4];
    let f = 0.5, best = -1;
    for (let c = 0.12; c <= 0.881; c += 0.02) {
      const p = doorPos(side, c);
      const gap = Math.min(...busy[side].map((b) => Math.abs(b - p)), 999);
      const score = gap - Math.abs(c - 0.5) * 4; // при равном зазоре тянем к центру
      if (score > best) { best = score; f = c; }
    }
    busy[side].push(doorPos(side, f));
    if (side === 0) doors.push({ x: r2(X0 + 30 + (X1 - X0 - 60) * f), y: Y0, rot: 0 });
    else if (side === 1) doors.push({ x: X1, y: r2(Y0 + 30 + (Y1 - Y0 - 60) * f), rot: 90 });
    else if (side === 2) doors.push({ x: r2(X1 - 30 - (X1 - X0 - 60) * f), y: Y1, rot: 180 });
    else doors.push({ x: X0, y: r2(Y1 - 30 - (Y1 - Y0 - 60) * f), rot: 270 });
  }

  // Оборудование внутри помещения раскладываем ровной сеткой по центру: ячейки
  // одинаковые, неполный последний ряд центрируется. Зона начинается ниже
  // серверной стойки и не доходит до стен, где висят камеры.
  const zone = { x0: X0 + 46, x1: X1 - 46, y0: Y0 + 52, y1: Y1 - 46 };
  const zh = zone.y1 - zone.y0;
  // Обе системы вместе — делим зону на две полосы, чтобы значки не смешивались
  const detZone = wifiCount ? { ...zone, y1: zone.y0 + zh * 0.62 } : zone;
  const wifiZone = detCount ? { ...zone, y0: zone.y0 + zh * 0.76 } : zone;

  const grid = (count: number, z: { x0: number; x1: number; y0: number; y1: number }) => {
    const out: { x: number; y: number }[] = [];
    if (count < 1) return out;
    const w = z.x1 - z.x0, h = Math.max(z.y1 - z.y0, 1);
    // столбцов берём столько, чтобы ячейки вышли близкими к квадрату
    const cols = Math.max(1, Math.min(count, Math.round(Math.sqrt((count * w) / h))));
    const rows = Math.ceil(count / cols);
    const stepX = w / cols, stepY = h / rows;
    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / cols), col = i % cols;
      const inRow = Math.min(cols, count - row * cols);
      const shift = ((cols - inRow) * stepX) / 2; // центрируем неполный ряд
      out.push({
        x: r2(z.x0 + shift + stepX * (col + 0.5)),
        y: r2(z.y0 + stepY * (row + 0.5)),
      });
    }
    return out;
  };

  const dets = grid(detCount, detZone);
  const wifis = grid(wifiCount, wifiZone);

  return { markers, doors, dets, wifis };
}

/* ─────────── цвета ───────────
   У каждой системы свой цвет, и он один и тот же везде: галочка в списке,
   точка в смете, значок на плане, строка легенды. Так глазом видно, что
   «фиолетовое на плане» — это те самые двери из СКУД. */
export const SYS_COLOR: Record<SystemKey, string> = {
  cctv: "#328fa8",  // бирюзовый — фирменный
  acs: "#6366f1",   // индиго
  intr: "#d97706",  // янтарный
  fire: "#dc2626",  // красный
  lan: "#059669",   // изумрудный
  perim: "#9333ea", // пурпурный
};

/** Цвет типа объекта — отличает карточки друг от друга. */
const OBJ_COLOR: Record<ObjectKey, string> = {
  shop: "#e11d48", office: "#0284c7", wh: "#ca8a04",
  house: "#16a34a", prod: "#7c3aed", resid: "#0d9488",
};

const OBJ_ICON: Record<ObjectKey, React.ReactNode> = {
  shop: <><path d="M3 8h18l-1.4 12.2a2 2 0 0 1-2 1.8H6.4a2 2 0 0 1-2-1.8L3 8Z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
  office: <><rect x="4" y="3" width="16" height="18" rx="1.5" /><path d="M8 7h3M13 7h3M8 11h3M13 11h3M8 15h3M13 15h3" /></>,
  wh: <><path d="M3 10 12 4l9 6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V10Z" /><path d="M8 21v-7h8v7" /></>,
  house: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /><path d="M10 20v-6h4v6" /></>,
  prod: <><path d="M3 20V9l6 4V9l6 4V6l6 3v11H3Z" /><path d="M7 20v-3M13 20v-3M18 20v-3" /></>,
  resid: <><rect x="5" y="2" width="14" height="20" rx="1.5" /><path d="M9 6h2M13 6h2M9 10h2M13 10h2M9 14h2M13 14h2" /><path d="M10 22v-4h4v4" /></>,
};

const SYS_ICON: Record<SystemKey, React.ReactNode> = {
  cctv: <><path d="M3 7.5 17 4l1.2 4.6L4.2 12 3 7.5Z" /><path d="M6 12v4a2 2 0 0 0 2 2h2" /><circle cx="19" cy="15" r="3" /></>,
  acs: <><rect x="3" y="6" width="14" height="12" rx="2" /><circle cx="8" cy="12" r="2" /><path d="M12 10h3M12 13h3M20 9v6" /></>,
  intr: <><rect x="6" y="3" width="12" height="18" rx="2" /><rect x="9" y="6" width="6" height="5" rx="1" /><path d="M9 15h6M9 18h3" /></>,
  fire: <><path d="M12 3s5 4.2 5 9a5 5 0 0 1-10 0c0-2 1-3.4 2-4.6.4 1.6 1.4 2.3 2 2.3 0-2.4-1-4.4 1-6.7Z" /></>,
  lan: <><rect x="3" y="15" width="5" height="5" rx="1" /><rect x="16" y="15" width="5" height="5" rx="1" /><rect x="9" y="4" width="6" height="5" rx="1" /><path d="M12 9v3M5.5 15v-3h13v3" /></>,
  perim: <><path d="M4 21V9l3-3 3 3v12M14 21V9l3-3 3 3v12" /><path d="M2 13h20M2 17h20" /></>,
};

const CAM_FILL = { in: "#7fb9c8", out: "#328fa8", ptz: "#1c515d" } as const;
const DOOR_C = SYS_COLOR.acs, DET_C = SYS_COLOR.fire, WIFI_C = SYS_COLOR.lan, PERIM_C = SYS_COLOR.perim;

function Plan({ st }: { st: CalcState }) {
  const { markers, doors, dets, wifis } = useMemo(() => buildPlan(st), [st]);
  const rx = X1 - 46, ry = Y0 + 12;
  const hub = { x: rx + 15, y: ry + 19 };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-hidden>
      <defs>
        <pattern id="calc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0H0V20" fill="none" stroke="#e2e8f0" strokeWidth="1" />
        </pattern>
        <radialGradient id="calc-fov">
          <stop offset="0" stopColor="#328fa8" stopOpacity=".28" />
          <stop offset="1" stopColor="#328fa8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#calc-grid)" />
      <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} fill="#fff" fillOpacity=".7" stroke="#475569" strokeWidth="2.5" />

      {/* размерная линия — язык чертежа */}
      <g stroke="#475569" strokeWidth="1" opacity=".55">
        <path d={`M${X0} ${Y1 + 9}v6M${X1} ${Y1 + 9}v6M${X0} ${Y1 + 12}H${X1}`} />
      </g>
      <text x={(X0 + X1) / 2} y={Y1 + 26} textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="ui-monospace,Menlo,monospace">
        {st.area} м²
      </text>

      {/* серверная стойка */}
      <g>
        <rect x={rx} y={ry} width="30" height="38" rx="3" fill="#fff" stroke="#475569" strokeWidth="1.5" />
        <path d={`M${rx + 5} ${ry + 8}h20M${rx + 5} ${ry + 15}h20M${rx + 5} ${ry + 22}h20M${rx + 5} ${ry + 29}h20`}
          stroke="#475569" strokeWidth="1.4" opacity=".7" />
      </g>

      {/* сектора обзора — нижним слоем, иначе полупрозрачная заливка «съедает» двери */}
      {markers.map((c, i) => {
        const [dx1, dy1, dx2, dy2] = FOV[c.ang];
        return (
          <path key={`fov${i}`} fill="url(#calc-fov)"
            d={`M${c.x} ${c.y} l${dx1} ${dy1} A52 52 0 0 1 ${r2(c.x + dx2)} ${r2(c.y + dy2)} Z`} />
        );
      })}

      {/* двери — проёмом в стене и дугой открывания, как на монтажном плане */}
      {doors.map((d, i) => (
        <g key={`door${i}`} transform={`translate(${d.x} ${d.y}) rotate(${d.rot})`}>
          <line x1={-14} y1={0} x2={14} y2={0} stroke="#fff" strokeWidth="7" />
          <path d="M-13 22 Q13 22 13 0" fill="none" stroke={DOOR_C} strokeWidth="1.2" opacity=".55" strokeDasharray="3 3" />
          <line x1={-13} y1={0} x2={-13} y2={22} stroke={DOOR_C} strokeWidth="3.2" strokeLinecap="round" />
          <rect x={14} y={-4.5} width="8.5" height="12" rx="2.5" fill={DOOR_C} />
          <circle cx={18.2} cy={1.5} r="1.8" fill="#fff" />
        </g>
      ))}

      {/* камеры — верхним слоем, поверх секторов и дверей */}
      {markers.map((c, i) => (
        <g key={`cam${i}`}>
          <path d={`M${hub.x} ${hub.y} L${c.x} ${c.y}`} stroke="#328fa8" strokeWidth="1" opacity=".28" fill="none" />
          <circle cx={c.x} cy={c.y} r="5.5" fill={CAM_FILL[c.t]} stroke="#fff" strokeWidth="1.8" />
          {c.t === "ptz" && <circle cx={c.x} cy={c.y} r="9" fill="none" stroke={CAM_FILL.ptz} strokeWidth="1.2" opacity=".7" />}
        </g>
      ))}

      {dets.map((d, i) => (
        <g key={`det${i}`}>
          <circle cx={d.x} cy={d.y} r="4.6" fill="#fff" />
          <circle cx={d.x} cy={d.y} r="4.6" fill="none" stroke={DET_C} strokeWidth="1.6" strokeDasharray="2.2 2" />
          <circle cx={d.x} cy={d.y} r="1.3" fill={DET_C} />
        </g>
      ))}

      {wifis.map((w, i) => (
        <g key={`wifi${i}`} transform={`translate(${w.x} ${w.y})`}>
          <path d="M-7 2a10 10 0 0 1 14 0M-4 5a6 6 0 0 1 8 0" fill="none" stroke={WIFI_C} strokeWidth="1.8" strokeLinecap="round" />
          <circle cy="8" r="1.9" fill={WIFI_C} />
        </g>
      ))}

      {st.on.perim && (
        <rect x={X0 - 11} y={Y0 - 11} width={X1 - X0 + 22} height={Y1 - Y0 + 22}
          fill="none" stroke={PERIM_C} strokeWidth="1.6" strokeDasharray="7 5" opacity=".7" />
      )}
    </svg>
  );
}

/* ─────────── интерфейс ─────────── */

function fmt(n: number) {
  return Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
}

function Stepper({ value, min, max, step = 1, onChange, label }: {
  value: number; min: number; max: number; step?: number; onChange: (v: number) => void; label: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" aria-label={`${label} −`} onClick={() => onChange(clamp(value - step))}
        className="h-8 w-8 rounded-lg border border-slate-300 text-lg font-bold leading-none text-slate-600 hover:border-brand-500 hover:text-brand-600">−</button>
      <input type="number" value={value} min={min} max={max} aria-label={label}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="h-8 w-14 rounded-lg border border-slate-300 text-center text-sm font-bold tabular-nums focus:border-brand-500 focus:outline-none" />
      <button type="button" aria-label={`${label} +`} onClick={() => onChange(clamp(value + step))}
        className="h-8 w-8 rounded-lg border border-slate-300 text-lg font-bold leading-none text-slate-600 hover:border-brand-500 hover:text-brand-600">+</button>
    </div>
  );
}

function Segmented({ value, options, onChange }: {
  value: string; options: { v: string; label: string }[]; onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)} aria-pressed={value === o.v}
          className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
            value === o.v ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function CostCalculator() {
  const t = useTranslations("calc");
  const tf = useTranslations("form");
  const [st, setSt] = useState<CalcState>(initialState);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState(false);

  const patch = (fn: (s: CalcState) => void) => setSt((prev) => {
    const next: CalcState = { ...prev, on: { ...prev.on }, v: { ...prev.v } };
    for (const k of Object.keys(next.v) as SystemKey[]) next.v[k] = { ...next.v[k] };
    fn(next);
    return next;
  });

  const r = useMemo(() => calc(st), [st]);
  const rates = useMemo(() => unitRates(st, r), [st, r]);
  const anyOn = r.lines.length > 0;

  /** Человекочитаемый состав расчёта — уходит менеджеру в CRM и Telegram. */
  function summary() {
    const parts = [
      `${t(`obj.${st.obj}`)}, ${st.area} м²`,
      ...r.lines.map((l) => `${t(`sys.${l.key}`)} — ${l.qty} ${t(`unitOf.${l.key}`)}: ${fmt(l.sum)} сум`),
      `${t("traceLabel")}: ${t(`trace.${st.trace}`)}`,
      `${t("highLabel")}: ${t(`high.${st.high}`)}`,
      `${t("totalLabel")}: ${fmt(r.low)} – ${fmt(r.high)} сум`,
    ];
    return parts.join("\n");
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true); setErr(false);
    try {
      const res = await fetch("https://api.satsolutions.uz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Гость",
          phone,
          message: `Заявка из калькулятора стоимости\n\n${summary()}`,
          gclid: getGclid() || undefined,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setSent(true);
      const ph = phone.startsWith("+") ? phone : `+998${phone.replace(/\D/g, "").slice(-9)}`;
      trackConversion("lead", { user: { phone: ph } });
    } catch {
      setErr(true);
    }
    setSending(false);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
      {/* ── левая колонка: что считаем ── */}
      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-black text-slate-900">
            <span className="mr-2 text-sm font-bold text-brand-600">01</span>{t("step1")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("step1sub")}</p>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {OBJECT_KEYS.map((k) => {
              const c = OBJ_COLOR[k], active = st.obj === k;
              return (
                <button key={k} type="button" aria-pressed={active}
                  onClick={() => patch((s) => { s.obj = k; s.area = OBJECTS[k].area; applyDefaults(s); })}
                  style={active ? { borderColor: c, backgroundColor: `${c}12`, boxShadow: `inset 0 0 0 1px ${c}` } : undefined}
                  className={`flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left transition-colors ${
                    active ? "" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${c}1a`, color: c }}>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor"
                      strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {OBJ_ICON[k]}
                    </svg>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold" style={{ color: active ? c : "#334155" }}>{t(`obj.${k}`)}</span>
                    <span className="block text-[11px] font-medium text-slate-400">{OBJECTS[k].area} м²</span>
                  </span>
                </button>
              );
            })}
          </div>

          <label className="mt-5 block">
            <span className="flex items-baseline justify-between text-sm font-semibold text-slate-700">
              {t("area")}
              <span className="text-lg font-black tabular-nums text-slate-900">{st.area} <span className="text-xs font-semibold text-slate-400">м²</span></span>
            </span>
            <input type="range" min={30} max={3000} step={10} value={st.area}
              onChange={(e) => patch((s) => { s.area = Number(e.target.value); applyDefaults(s); })}
              className="mt-2 w-full accent-brand-600" />
          </label>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-black text-slate-900">
            <span className="mr-2 text-sm font-bold text-brand-600">02</span>{t("step2")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("step2sub")}</p>

          <div className="mt-3 divide-y divide-slate-100">
            {SYSTEMS.map((sys) => {
              const c = SYS_COLOR[sys.id], on = st.on[sys.id];
              return (
              <div key={sys.id} className="py-3">
                <label className="flex cursor-pointer items-center gap-3">
                  <input type="checkbox" checked={on}
                    onChange={() => patch((s) => { s.on[sys.id] = !s.on[sys.id]; })}
                    style={{ accentColor: c }}
                    className="h-5 w-5 shrink-0 rounded" />
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors"
                    style={{ backgroundColor: on ? `${c}1a` : "#f1f5f9", color: on ? c : "#94a3b8" }}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor"
                      strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {SYS_ICON[sys.id]}
                    </svg>
                  </span>
                  <span className="text-sm font-bold" style={{ color: on ? c : "#0f172a" }}>{t(`sys.${sys.id}`)}</span>
                </label>

                {st.on[sys.id] && (
                  <div className="mt-3 space-y-2.5 pl-8">
                    {sys.fields.map((f) => (
                      <div key={f.k} className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-600">{t(`field.${sys.id}.${f.k}`)}</span>
                        {f.type === "num" ? (
                          <Stepper label={t(`field.${sys.id}.${f.k}`)}
                            value={Number(st.v[sys.id][f.k]) || 0} min={0} max={f.max} step={f.step ?? 1}
                            onChange={(v) => patch((s) => { s.v[sys.id][f.k] = v; })} />
                        ) : (
                          <Segmented value={String(st.v[sys.id][f.k])}
                            options={f.opts.map((o) => ({ v: o, label: t(`opt.${sys.id}.${o}`) }))}
                            onChange={(v) => patch((s) => { s.v[sys.id][f.k] = v; })} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-base font-black text-slate-900">
            <span className="mr-2 text-sm font-bold text-brand-600">03</span>{t("step3")}
          </h2>
          <p className="mt-1 text-sm text-slate-500">{t("step3sub")}</p>
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-slate-600">{t("traceLabel")}</span>
              <Segmented value={st.trace}
                options={[{ v: "need", label: t("trace.need") }, { v: "ready", label: t("trace.ready") }]}
                onChange={(v) => patch((s) => { s.trace = v as CalcState["trace"]; })} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm text-slate-600">{t("highLabel")}</span>
              <Segmented value={st.high}
                options={[{ v: "no", label: t("high.no") }, { v: "mid", label: t("high.mid") }, { v: "hi", label: t("high.hi") }]}
                onChange={(v) => patch((s) => { s.high = v as CalcState["high"]; })} />
            </div>
          </div>
        </section>
      </div>

      {/* ── правая колонка: план и деньги ── */}
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex items-baseline justify-between border-b border-slate-100 px-4 py-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t("plan")}</span>
            <span className="text-[11px] font-semibold tabular-nums text-slate-400">
              {r.points ? t("planMeta", { points: r.points, meters: r.cableM }) : "—"}
            </span>
          </div>
          <div className="bg-slate-50 px-3 py-2">
            <Plan st={st} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 px-4 py-3 text-[11px] text-slate-600">
            {/* значки повторяют форму и цвет с плана — иначе легенда бесполезна */}
            {st.on.cctv && <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CAM_FILL.in }} />{t("legend.camIn")}</span>}
            {st.on.cctv && <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CAM_FILL.out }} />{t("legend.camOut")}</span>}
            {st.on.acs && <span className="inline-flex items-center gap-1.5"><i className="h-3 w-1 rounded-sm" style={{ backgroundColor: DOOR_C }} />{t("legend.door")}</span>}
            {st.on.fire && <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full border border-dashed" style={{ borderColor: DET_C }} />{t("legend.det")}</span>}
            {st.on.lan && <span className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: WIFI_C }} />{t("legend.wifi")}</span>}
            {st.on.perim && <span className="inline-flex items-center gap-1.5"><i className="h-0 w-3.5 border-t border-dashed" style={{ borderColor: PERIM_C }} />{t("legend.perim")}</span>}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {anyOn ? (
            <>
              {/* сначала понятные единичные расценки, потом уже итог */}
              <div className="px-4 pt-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t("ratesTitle")}</div>
                <dl className="mt-2 space-y-1.5">
                  {rates.map((x) => (
                    <div key={x.key} className="flex items-baseline justify-between gap-3 text-[13px]">
                      <dt className="text-slate-600">{t(`rate.${x.key}`)}</dt>
                      <dd className="whitespace-nowrap font-semibold tabular-nums text-slate-900">
                        <span className="mr-1 text-[11px] font-normal text-slate-400">{t("from")}</span>
                        {fmt(x.price)}
                        <span className="ml-1 text-[11px] font-normal text-slate-400">{t(`unit.${x.unit}`)}</span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-4 border-t border-slate-100 px-4 pt-3">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t("brkTitle")}</div>
                <dl className="mt-2 divide-y divide-dashed divide-slate-100">
                  {r.lines.map((l) => (
                    <div key={l.key} className="flex items-baseline justify-between gap-3 py-2 text-[13px]">
                      <dt className="flex items-baseline gap-2 text-slate-600">
                        {/* точка в цвете системы — связывает строку сметы со значком на плане */}
                        <i className="mt-[1px] h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: SYS_COLOR[l.key as SystemKey] ?? "#94a3b8" }} />
                        <span>
                          {t(`sys.${l.key}`)} <span className="text-slate-400 tabular-nums">{l.qty} {t(`unitOf.${l.key}`)}</span>
                        </span>
                      </dt>
                      <dd className="whitespace-nowrap font-semibold tabular-nums text-slate-900">{fmt(l.sum)}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="mt-2 border-t border-slate-100 bg-slate-50 px-4 py-4">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{t("totalLabel")}</div>
                <div className="mt-1 text-xl font-black tabular-nums text-slate-900 sm:text-2xl">
                  {fmt(r.low)} – {fmt(r.high)} <span className="text-sm font-bold text-slate-400">{t("sum")}</span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">{t("note")}</p>
              </div>
            </>
          ) : (
            <div className="px-4 py-8 text-center text-sm text-slate-400">{t("empty")}</div>
          )}
        </section>

        {/* ── заявка на точный расчёт ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5">
          {sent ? (
            <div className="py-4 text-center">
              <div className="mb-2 text-3xl">✅</div>
              <div className="text-base font-bold text-slate-900">{tf("quoteSent")}</div>
              <p className="mt-1 text-sm text-slate-500">{tf("quoteSentSub")}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-2.5">
              <div className="text-sm font-bold text-slate-900">{t("ctaTitle")}</div>
              <p className="text-xs text-slate-500">{t("ctaSub")}</p>
              <input required placeholder={tf("yourName")} value={name} onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
              <input required type="tel" placeholder={tf("phoneReq")} value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none" />
              <button type="submit" disabled={sending || !anyOn}
                className="w-full rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-500 disabled:opacity-50">
                {sending ? tf("sendingShort") : t("ctaBtn")}
              </button>
              {err && <p className="text-xs font-semibold text-red-600">{tf("errSend")}</p>}
              <p className="text-center text-[11px] text-slate-400">{tf("consent")}</p>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
