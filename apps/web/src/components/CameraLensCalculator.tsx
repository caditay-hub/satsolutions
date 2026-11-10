"use client";

/**
 * Калькулятор объектива видеокамеры (SAT Camera Designer, этап A).
 * Вся математика — в lib/cameraDesigner (общая с сервером и тестами); здесь только ввод,
 * чертежи и подписи. Состояние живёт в ссылке (?…) — её можно скопировать и отправить.
 * Чертежи — в масштабе расчёта (1:1 по обеим осям), не условные картинки.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { trackConversion } from "@/lib/gtag";
import { getGclid } from "@/lib/gclid";
import { DEFAULT_INPUT, compute, type CalcInput, type CalcResult, type FieldKey } from "@/lib/cameraDesigner/calculate";
import { parseQuery, toQuery } from "@/lib/cameraDesigner/query";
import { fill, makeFmt } from "@/lib/cameraDesigner/format";
import { SHADES, levelColor } from "@/lib/cameraDesigner/palette";
import { PROFILES, visibleLevels, type Level, type LevelCode } from "@/lib/cameraDesigner/standards";
import type { CdContent } from "@/lib/cameraDesigner/content";
import type { CdCatalogUi } from "@/lib/cameraDesigner/catalogContent";
import { CameraCatalogMatches, type PickedCamera } from "@/components/CameraCatalogMatches";

type Props = { c: Pick<CdContent, "ui" | "levels" | "numLocale">; cat: CdCatalogUi; locale: string };
type Ok = Extract<CalcResult, { status: "ok" }>;

/* ─────────── числа ─────────── */

// makeFmt/fill — lib/cameraDesigner/format.ts (общие с планом объекта)

/* ─────────── поля ─────────── */

const fieldCls = (bad: boolean) =>
  `w-full rounded-lg border px-3 py-2.5 text-sm tabular-nums outline-none focus:border-brand-500 ${bad ? "border-red-400 bg-red-50" : "border-slate-300 bg-white"}`;

function NumField(p: {
  id: string; label: string; hint?: string; value: number | null; onChange: (v: number | null) => void;
  bad?: boolean; dec: string; nullable?: boolean; slider?: { min: number; max: number; step: number };
}) {
  const show = (v: number | null) => (v === null || !Number.isFinite(v) ? "" : String(Math.round(v * 10000) / 10000).replace(".", p.dec));
  const [text, setText] = useState(show(p.value));
  const parse = (t: string): number | null => {
    const s = t.trim().replace(",", ".");
    if (!s) return p.nullable ? null : NaN;
    return /^\d*(\.\d*)?$/.test(s) ? Number(s) : NaN;
  };
  // значение поменялось снаружи (пресет, кнопка, ссылка) — переписываем текст поля
  useEffect(() => {
    const cur = parse(text);
    if (!(cur === p.value || (cur !== null && p.value !== null && Math.abs(cur - p.value) < 1e-9))) setText(show(p.value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.value]);
  const sv = p.slider && p.value !== null && Number.isFinite(p.value) ? Math.min(p.slider.max, Math.max(p.slider.min, p.value)) : p.slider?.min ?? 0;
  return (
    <div>
      <label htmlFor={p.id} className="mb-1.5 block text-xs font-semibold text-slate-600">{p.label}</label>
      <input
        id={p.id} type="text" inputMode="decimal" autoComplete="off" value={text} aria-invalid={p.bad || undefined}
        aria-describedby={p.hint ? `${p.id}-h` : undefined} className={fieldCls(!!p.bad)}
        onChange={(e) => { setText(e.target.value); p.onChange(parse(e.target.value)); }}
      />
      {p.slider ? (
        <input
          type="range" min={p.slider.min} max={p.slider.max} step={p.slider.step} value={sv} aria-label={p.label}
          className="mt-2 h-6 w-full cursor-pointer accent-brand-600"
          onChange={(e) => p.onChange(Number(e.target.value))}
        />
      ) : null}
      {p.hint ? <p id={`${p.id}-h`} className="mt-1 text-[11px] leading-snug text-slate-500">{p.hint}</p> : null}
    </div>
  );
}

function Seg<T extends string>(p: { label: string; hideLabel?: boolean; value: T; opts: { v: T; t: string }[]; onChange: (v: T) => void }) {
  return (
    <div>
      {p.hideLabel ? null : <div className="mb-1.5 text-xs font-semibold text-slate-600">{p.label}</div>}
      <div role="group" aria-label={p.label} className="flex flex-wrap gap-1.5">
        {p.opts.map((o) => (
          <button
            key={o.v} type="button" aria-pressed={p.value === o.v} onClick={() => p.onChange(o.v)}
            className={`min-h-[40px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${p.value === o.v ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-400"}`}
          >
            {o.t}
          </button>
        ))}
      </div>
    </div>
  );
}

const RES = [
  [1920, 1080], [2560, 1440], [2688, 1520], [2560, 1944], [2880, 1620], [3200, 1800], [3840, 2160], [4000, 3000],
] as const;

// Цвета уровней — lib/cameraDesigner/palette.ts (общие с планом объекта)

function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ─────────── вид сверху ─────────── */

function TopView({ r, levels, names, fm, ui }: {
  r: Ok; levels: Level[]; names: Props["c"]["levels"]; fm: (n: number) => string; ui: Props["c"]["ui"];
}) {
  const W = 640, cx = 34;
  const D = r.depthM;
  const tan = Math.tan(r.optics.hfov / 2);
  const Dview = D * 1.35;
  const sx = (W - cx - 26) / Dview;
  const needH = 2 * D * tan * sx + 56;
  const H = Math.round(Math.min(420, Math.max(240, needH)));
  const s = Math.min(sx, (H / 2 - 28) / (D * tan));
  const cy = H / 2 - 6;
  const X = (z: number) => r2(cx + z * s);
  const Y = (z: number, side: 1 | -1) => r2(cy + side * z * tan * s);
  const trap = (a: number, b: number) => `${X(a)},${Y(a, -1)} ${X(b)},${Y(b, -1)} ${X(b)},${Y(b, 1)} ${X(a)},${Y(a, 1)}`;
  // по горизонтали заполняем всю ширину: дальше заданной дистанции видны следующие полосы
  const xEnd = (W - 10 - cx) / s;

  // полосы: от самого высокого порога (ближе) к самому низкому
  const byPpm = [...levels].sort((a, b) => b.ppm - a.ppm);
  const bands: { code: LevelCode; a: number; b: number; color: string }[] = [];
  let prev = 0;
  byPpm.forEach((l, i) => {
    const z = r.levels.find((x) => x.code === l.code)?.maxDepthM ?? 0;
    if (z > prev && prev < xEnd) bands.push({ code: l.code, a: prev, b: Math.min(z, xEnd), color: levelColor(i, byPpm.length) });
    prev = Math.max(prev, z);
  });

  const step = niceStep(xEnd / 5);
  const ticks: number[] = [];
  for (let z = step; z < xEnd; z += step) ticks.push(z);
  const yScale = H - 12;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={ui.topView}>
      <defs>
        <clipPath id="cd-top-clip"><rect x="0" y="0" width={W} height={H - 22} /></clipPath>
      </defs>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="#f8fafc" />
      <g clipPath="url(#cd-top-clip)">
        {prev < xEnd ? <polygon points={trap(prev, xEnd)} fill="#eef2f6" /> : null}
        {bands.map((b) => <polygon key={b.code} points={trap(b.a, b.b)} fill={b.color} fillOpacity=".85" />)}
        <line x1={cx} y1={cy} x2={X(xEnd)} y2={Y(xEnd, -1)} stroke="#334155" strokeWidth="1.2" />
        <line x1={cx} y1={cy} x2={X(xEnd)} y2={Y(xEnd, 1)} stroke="#334155" strokeWidth="1.2" />
        <line x1={cx} y1={cy} x2={X(xEnd)} y2={cy} stroke="#334155" strokeWidth="1" strokeDasharray="5 4" opacity=".6" />
        {/* плоскость сцены на заданной глубине */}
        <line x1={X(D)} y1={Y(D, -1)} x2={X(D)} y2={Y(D, 1)} stroke="#e02020" strokeWidth="2.2" />
        <text x={X(D) + 6} y={Y(D, -1) + 14} fontSize="15" fontWeight="700" fill="#b91c1c">{fm(r.scene.widthM)}</text>
        <text x={X(D) + 6} y={cy - 7} fontSize="14" fill="#b91c1c">{fm(D)}</text>
        {bands.map((b) => {
          const w = (b.b - b.a) * s;
          // подпись — только если целиком влезает в полосу (≈7,4 единицы на знак при 13px)
          const nm = names[b.code].name;
          return w > nm.length * (/[㐀-鿿]/.test(nm) ? 13.5 : 7.4) + 10 ? (
            <text key={`t-${b.code}`} x={r2(X(b.a) + w / 2)} y={cy + 20} textAnchor="middle" fontSize="13" fontWeight="600" fill={b.color === SHADES[5] || b.color === SHADES[6] ? "#1e293b" : "#fff"}>
              {names[b.code].name}
            </text>
          ) : null;
        })}
      </g>
      <circle cx={cx} cy={cy} r="7" fill="#0f172a" />
      <circle cx={cx} cy={cy} r="3" fill="#7dd3fc" />
      {/* шкала по оси, в метрах */}
      <line x1={cx} y1={yScale} x2={X(xEnd)} y2={yScale} stroke="#94a3b8" strokeWidth="1" />
      {ticks.map((z) => (
        <g key={z}>
          <line x1={X(z)} y1={yScale - 4} x2={X(z)} y2={yScale + 2} stroke="#94a3b8" />
          <text x={X(z)} y={yScale - 6} textAnchor="middle" fontSize="12.5" fill="#64748b">{fm(z)}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─────────── вид сбоку ─────────── */

function SideView({ r, inp, levels, names, fm, ui }: {
  r: Ok; inp: CalcInput; levels: Level[]; names: Props["c"]["levels"]; fm: (n: number) => string; ui: Props["c"]["ui"];
}) {
  const g = r.side!;
  const W = 640, H = 250, x0 = 36, yG = H - 34;
  const far = Number.isFinite(g.farM) ? g.farM : Infinity;
  const Xmax = Math.max(inp.d * 1.3, g.nearM * 1.25, 1);
  const s = Math.min((W - x0 - 20) / Xmax, (H - 64) / Math.max(inp.mount * 1.1, 0.5));
  const X = (m: number) => r2(x0 + m * s);
  const Yh = (m: number) => r2(yG - m * s);
  const camY = Yh(inp.mount);
  const xRight = (W - 12 - x0) / s;
  // конец луча под углом a вниз от горизонта: земля или правый край
  const rayEnd = (a: number) => {
    if (a > 0) {
      const xg = inp.mount / Math.tan(a);
      if (xg <= xRight) return { x: X(xg), y: yG, ground: true };
    }
    return { x: X(xRight), y: r2(camY + Math.tan(a) * xRight * s), ground: false };
  };
  const up = rayEnd(g.tilt - r.optics.vfov / 2);
  const lo = rayEnd(g.tilt + r.optics.vfov / 2);
  const ax = rayEnd(g.tilt);
  const poly = [`${x0},${camY}`, `${up.x},${Math.max(8, up.y)}`];
  if (!up.ground && lo.ground) poly.push(`${X(xRight)},${yG}`);
  poly.push(`${lo.x},${lo.y}`);

  const yT = Yh(inp.target);
  const byLen = [...levels].sort((a, b) => a.ppm - b.ppm);
  const step = niceStep(xRight / 5);
  const ticks: number[] = [];
  for (let m = step; m < xRight; m += step) ticks.push(m);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={ui.sideView}>
      <rect x="0" y="0" width={W} height={H} rx="14" fill="#f8fafc" />
      <polygon points={poly.join(" ")} fill="#3f95ab" fillOpacity=".14" />
      <line x1={x0} y1={camY} x2={up.x} y2={Math.max(8, up.y)} stroke="#334155" strokeWidth="1.2" />
      <line x1={x0} y1={camY} x2={lo.x} y2={lo.y} stroke="#334155" strokeWidth="1.2" />
      <line x1={x0} y1={camY} x2={ax.x} y2={ax.y} stroke="#334155" strokeDasharray="5 4" opacity=".6" />
      {/* земля, мачта, уровень цели */}
      <line x1="10" y1={yG} x2={W - 10} y2={yG} stroke="#64748b" strokeWidth="1.5" />
      <line x1={x0} y1={yG} x2={x0} y2={camY} stroke="#64748b" strokeWidth="3" />
      <line x1={x0} y1={yT} x2={X(xRight)} y2={yT} stroke="#94a3b8" strokeDasharray="3 3" />
      {/* слепая зона на высоте цели */}
      {g.nearM > 0 ? (
        <>
          <line x1={x0} y1={yT} x2={X(Math.min(g.nearM, xRight))} y2={yT} stroke="#ef4444" strokeWidth="5" strokeOpacity=".35" />
          <text x={x0 + 6} y={yT - 9} fontSize="13" fill="#b91c1c">{ui.blind} {fm(g.nearM)}</text>
        </>
      ) : null}
      {byLen.map((l, i) => {
        const row = r.levels.find((x) => x.code === l.code);
        if (!row?.ground) return null;
        const to = Math.min(row.ground.toM, far, xRight);
        return (
          <line key={l.code} x1={X(row.ground.fromM)} y1={yT} x2={X(to)} y2={yT}
            stroke={levelColor(byLen.length - 1 - i, byLen.length)} strokeWidth="7" strokeLinecap="butt">
            <title>{names[l.code].name}</title>
          </line>
        );
      })}
      {/* цель на дистанции d */}
      {inp.d <= xRight ? (
        <g>
          <line x1={X(inp.d)} y1={yG} x2={X(inp.d)} y2={yT} stroke="#e02020" strokeWidth="2.2" />
          <circle cx={X(inp.d)} cy={yT} r="4" fill="#e02020" />
          <text x={X(inp.d)} y={yT - 9} textAnchor="middle" fontSize="14" fontWeight="700" fill="#b91c1c">{fm(inp.d)}</text>
        </g>
      ) : null}
      <circle cx={x0} cy={camY} r="6.5" fill="#0f172a" />
      <text x={x0 + 10} y={camY - 9} fontSize="13" fill="#334155">{ui.camera} {fm(inp.mount)}</text>
      {ticks.map((m) => (
        <g key={m}>
          <line x1={X(m)} y1={yG} x2={X(m)} y2={yG + 5} stroke="#94a3b8" />
          <text x={X(m)} y={yG + 19} textAnchor="middle" fontSize="12.5" fill="#64748b">{fm(m)}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─────────── калькулятор ─────────── */

export function CameraLensCalculator({ c, cat, locale }: Props) {
  const { ui, levels: names } = c;
  const tf = useTranslations("form");
  const { num, dec } = useMemo(() => makeFmt(locale), [locale]);
  const fm = (n: number) => `${num(n)} ${ui.units.m}`;
  const fdeg = (n: number) => `${num(n, 1)}°`;
  const fppm = (n: number) => `${num(n, n >= 100 ? 0 : 1)} ${ui.units.ppm}`;

  const [inp, setInp] = useState<CalcInput>(DEFAULT_INPUT);
  const touched = useRef(false);
  // параметры из ссылки читаем после гидратации: сервер всегда отдаёт расчёт по умолчанию
  useEffect(() => {
    if (window.location.search) setInp(parseQuery(new URLSearchParams(window.location.search)));
  }, []);
  useEffect(() => {
    if (!touched.current) return;
    // hash сохраняем: им вкладка «План объекта» отмечает себя в адресе
    window.history.replaceState(window.history.state, "", `${window.location.pathname}?${toQuery(inp)}${window.location.hash}`);
  }, [inp]);

  const set = <K extends keyof CalcInput>(k: K, v: CalcInput[K]) => {
    touched.current = true;
    setInp((p) => {
      const next = { ...p, [k]: v };
      // уровень задачи — только из текущей редакции
      if (k === "std" && !PROFILES[next.std].levels.some((l) => l.code === next.lvl)) next.lvl = next.std === "2025" ? "characterize" : "identify";
      if (k === "lens" && v === "vari" && (next.f < next.fmin || next.f > next.fmax)) next.f = next.fmin;
      return next;
    });
  };
  const setNum = (k: FieldKey) => (v: number | null) => set(k, (v === null ? NaN : v) as never);

  const r = useMemo(() => compute(inp), [inp]);
  const bad = new Set<FieldKey>(r.status === "invalid" ? r.fields : []);
  const lv = visibleLevels(inp.std, inp.all);
  const lvName = (l: Level) => `${names[l.code].name}${names[l.code].name === l.en ? "" : ` (${l.en})`}`;

  const resIdx = RES.findIndex(([x, y]) => x === inp.nx && y === inp.ny);

  /* ── текст расчёта: для копирования и для заявки ── */
  function summary(res: Ok) {
    const lines = [
      `${ui.outHfov}: ${fdeg(res.hfovDeg)}; ${ui.outVfov}: ${fdeg(res.vfovDeg)}`,
      `${inp.nx} × ${inp.ny} ${ui.units.px}`,
      `${ui.d}: ${fm(inp.d)}${res.side ? `; ${ui.mount}: ${fm(inp.mount)}; ${ui.target}: ${fm(inp.target)}; ${ui.tilt}: ${num(inp.tilt, 1)}` : ""}`,
      `${ui.outWidth}: ${fm(res.scene.widthM)} × ${fm(res.scene.heightM)}`,
      `${ui.outPpmH}: ${fppm(res.scene.ppmH)}`,
      `${PROFILES[inp.std].title}: ${res.levels.map((l) => `${names[l.code].name} ${l.met ? "✓" : "✗"}`).join(", ")}`,
    ];
    if (res.task) {
      lines.push(`${ui.taskTitle}: ${ui.w} ${fm(inp.w)}, ${lvName(PROFILES[inp.std].levels.find((l) => l.code === inp.lvl)!)} — ${res.task.check?.ok ? ui.taskOk : ui.taskNo}`);
    }
    if (res.optics.estimate) lines.push(ui.badgeEstimate);
    return lines.join("\n");
  }

  /* ── камеры из каталога, отмеченные «В заявку» ── */
  const [picked, setPicked] = useState<PickedCamera[]>([]);
  const togglePick = (x: PickedCamera) => setPicked((cur) => (cur.some((y) => y.slug === x.slug) ? cur.filter((y) => y.slug !== x.slug) : [...cur, x]));
  const pickedText = () => (picked.length
    ? `\n\n${cat.leadSelected}:\n${picked.map((x) => `• ${x.name}${x.variant ? ` [${x.variant}]` : ""}${x.focalMm !== null ? ` — f ≈ ${num(x.focalMm, 1)} ${ui.units.mm}` : ""} (/products/${x.slug})`).join("\n")}`
    : "");
  const link = () => `${window.location.origin}${window.location.pathname}?${toQuery(inp)}`;

  const [copied, setCopied] = useState<"" | "calc" | "link">("");
  async function copy(kind: "calc" | "link") {
    if (r.status !== "ok") return;
    const text = kind === "calc" ? `${summary(r)}\n${link()}` : link();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(""), 2200);
    } catch { /* без доступа к буферу — ничего не делаем */ }
  }

  /* ── заявка ── */
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failed, setFailed] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;
    setSending(true); setFailed(false);
    const body = r.status === "ok" ? summary(r) : inp.lens === "fisheye" ? "Fisheye / панорама" : "";
    try {
      const res = await fetch("https://api.satsolutions.uz/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Гость",
          phone,
          message: `📐 Заявка из калькулятора объектива (${locale})\n\n${body}${pickedText()}\n\n${link()}`,
          gclid: getGclid() || undefined,
        }),
      });
      if (!res.ok) throw new Error("bad status");
      setSent(true);
      const ph = phone.startsWith("+") ? phone : `+998${phone.replace(/\D/g, "").slice(-9)}`;
      trackConversion("lead", { user: { phone: ph }, placement: "camera_lens_calculator" });
    } catch {
      setFailed(true);
    }
    setSending(false);
  }

  const card = "rounded-2xl border border-slate-200 bg-white p-5";
  const h2 = "text-base font-black text-slate-900";

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        {/* ── ввод ── */}
        <div className="space-y-4">
          <section className={card}>
            <div className="grid gap-4">
              <Seg label={`${ui.modeDirect} / ${ui.modeTask}`} hideLabel value={inp.mode} onChange={(v) => set("mode", v)}
                opts={[{ v: "direct", t: ui.modeDirect }, { v: "task", t: ui.modeTask }]} />
              <Seg label={ui.std} value={inp.std} onChange={(v) => set("std", v)}
                opts={[{ v: "2014", t: ui.std2014 }, { v: "2025", t: ui.std2025 }]} />
              {inp.std === "2014" ? (
                <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                  <input type="checkbox" checked={inp.all} onChange={(e) => set("all", e.target.checked)} className="h-5 w-5 accent-brand-600" />
                  {ui.allLevels}
                </label>
              ) : null}
            </div>
          </section>

          <section className={card}>
            <h2 className={h2}>{ui.camTitle}</h2>
            <div className="mt-4 grid gap-4">
              <Seg label={ui.lens} value={inp.lens} onChange={(v) => set("lens", v)}
                opts={[{ v: "fixed", t: ui.lensFixed }, { v: "vari", t: ui.lensVari }, { v: "fisheye", t: ui.lensFisheye }]} />
              {inp.lens !== "fisheye" ? (
                <>
                  <Seg label={ui.src} value={inp.src} onChange={(v) => set("src", v)}
                    opts={[{ v: "fov", t: ui.srcFov }, { v: "sensor", t: ui.srcSensor }]} />

                  <div>
                    <label htmlFor="cd-res" className="mb-1.5 block text-xs font-semibold text-slate-600">{ui.res}</label>
                    <select
                      id="cd-res" className={fieldCls(false)} value={resIdx}
                      onChange={(e) => { const i = Number(e.target.value); if (i >= 0) { set("nx", RES[i][0]); set("ny", RES[i][1]); } }}
                    >
                      {RES.map(([x, y], i) => <option key={i} value={i}>{x} × {y}</option>)}
                      <option value={-1}>{ui.resCustom}</option>
                    </select>
                    <div className="mt-2 grid grid-cols-2 gap-3">
                      <NumField id="cd-nx" label={ui.nx} value={inp.nx} onChange={setNum("nx")} bad={bad.has("nx")} dec={dec} />
                      <NumField id="cd-ny" label={ui.ny} value={inp.ny} onChange={setNum("ny")} bad={bad.has("ny")} dec={dec} />
                    </div>
                  </div>

                  {inp.src === "fov" && inp.lens === "fixed" ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <NumField id="cd-hf" label={ui.hfov} value={inp.hfov} onChange={setNum("hfov")} bad={bad.has("hfov")} dec={dec} slider={{ min: 10, max: 150, step: 0.5 }} />
                      <NumField id="cd-vf" label={ui.vfov} hint={ui.vfovHint} value={inp.vfov} nullable onChange={(v) => set("vfov", v === null ? null : v)} bad={bad.has("vfov")} dec={dec} />
                      <NumField id="cd-f" label={ui.f} hint={ui.fHint} value={inp.f} onChange={setNum("f")} bad={false} dec={dec} />
                    </div>
                  ) : null}

                  {inp.src === "fov" && inp.lens === "vari" ? (
                    <div className="grid grid-cols-2 gap-3">
                      <NumField id="cd-f1" label={ui.fmin} value={inp.fmin} onChange={setNum("fmin")} bad={bad.has("fmin")} dec={dec} />
                      <NumField id="cd-f2" label={ui.fmax} value={inp.fmax} onChange={setNum("fmax")} bad={bad.has("fmax")} dec={dec} />
                      <NumField id="cd-hw" label={ui.hw} value={inp.hw} onChange={setNum("hw")} bad={bad.has("hw")} dec={dec} />
                      <NumField id="cd-ht" label={ui.ht} value={inp.ht} onChange={setNum("ht")} bad={bad.has("ht")} dec={dec} />
                    </div>
                  ) : null}

                  {inp.src === "sensor" ? (
                    <div className="grid gap-3">
                      <div className="grid grid-cols-2 gap-3">
                        <NumField id="cd-sw" label={ui.sw} value={inp.sw} onChange={setNum("sw")} bad={bad.has("sw")} dec={dec} />
                        <NumField id="cd-sh" label={ui.sh} value={inp.sh} onChange={setNum("sh")} bad={bad.has("sh")} dec={dec} />
                      </div>
                      <p className="text-[11px] leading-snug text-slate-500">{ui.swHint}</p>
                      {inp.lens === "vari" ? (
                        <div className="grid grid-cols-2 gap-3">
                          <NumField id="cd-f1s" label={ui.fmin} value={inp.fmin} onChange={setNum("fmin")} bad={bad.has("fmin")} dec={dec} />
                          <NumField id="cd-f2s" label={ui.fmax} value={inp.fmax} onChange={setNum("fmax")} bad={bad.has("fmax")} dec={dec} />
                        </div>
                      ) : (
                        <NumField id="cd-fs" label={ui.f} value={inp.f} onChange={setNum("f")} bad={bad.has("f")} dec={dec} slider={{ min: 1, max: 50, step: 0.1 }} />
                      )}
                    </div>
                  ) : null}

                  {inp.lens === "vari" ? (
                    <NumField id="cd-fnow" label={ui.fNow} value={inp.f} onChange={setNum("f")} bad={bad.has("f")} dec={dec}
                      slider={Number.isFinite(inp.fmin) && Number.isFinite(inp.fmax) && inp.fmax > inp.fmin ? { min: inp.fmin, max: inp.fmax, step: 0.1 } : undefined} />
                  ) : null}
                </>
              ) : null}
            </div>
          </section>

          {inp.lens !== "fisheye" ? (
            <section className={card}>
              <h2 className={h2}>{inp.mode === "task" ? ui.taskTitle : ui.sceneTitle}</h2>
              <div className="mt-4 grid gap-4">
                <NumField id="cd-d" label={ui.d} hint={inp.geo ? ui.dGroundHint : ui.dAxisHint} value={inp.d} onChange={setNum("d")} bad={bad.has("d")} dec={dec} slider={{ min: 1, max: 100, step: 0.5 }} />
                {inp.mode === "task" ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <NumField id="cd-w" label={ui.w} value={inp.w} onChange={setNum("w")} bad={bad.has("w")} dec={dec} />
                    <div>
                      <label htmlFor="cd-lvl" className="mb-1.5 block text-xs font-semibold text-slate-600">{ui.lvl}</label>
                      <select id="cd-lvl" className={fieldCls(bad.has("lvl"))} value={inp.lvl} onChange={(e) => set("lvl", e.target.value)}>
                        {PROFILES[inp.std].levels.map((l) => <option key={l.code} value={l.code}>{lvName(l)} — {num(l.ppm)} {ui.units.ppm}</option>)}
                      </select>
                    </div>
                  </div>
                ) : null}
                <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-sm text-slate-700">
                  <input type="checkbox" checked={inp.geo} onChange={(e) => set("geo", e.target.checked)} className="h-5 w-5 accent-brand-600" />
                  {ui.geo}
                </label>
                {inp.geo ? (
                  <div className="grid gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <NumField id="cd-mh" label={ui.mount} value={inp.mount} onChange={setNum("mount")} bad={bad.has("mount")} dec={dec} />
                      <NumField id="cd-th" label={ui.target} value={inp.target} onChange={setNum("target")} bad={bad.has("target")} dec={dec} />
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {([[1.6, ui.targetFace], [0.5, ui.targetPlate], [0, ui.targetGround]] as const).map(([h, t]) => (
                        <button key={t} type="button" onClick={() => set("target", h)} aria-pressed={inp.target === h}
                          className={`min-h-[36px] rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${inp.target === h ? "border-brand-600 bg-brand-50 text-brand-800" : "border-slate-300 text-slate-600 hover:border-brand-400"}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                    <NumField id="cd-tl" label={ui.tilt} value={inp.tilt} onChange={setNum("tilt")} bad={bad.has("tilt")} dec={dec} slider={{ min: 0, max: 89, step: 0.5 }} />
                    {r.status === "ok" && r.aimTiltDeg !== null ? (
                      <button type="button" onClick={() => set("tilt", Math.round(r.aimTiltDeg! * 10) / 10)}
                        className="min-h-[40px] w-fit rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-800 hover:border-brand-500">
                        {ui.aim} · {num(r.aimTiltDeg, 1)}°
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>

        {/* ── результат и чертежи ── */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <section className={card} aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className={h2}>{ui.outTitle}</h2>
              {r.status === "ok" ? (
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${r.optics.estimate ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {r.optics.estimate ? ui.badgeEstimate : ui.badgePassport}
                </span>
              ) : null}
            </div>

            {r.status === "unsupported" ? <p className="mt-3 text-sm leading-relaxed text-slate-700">{ui.unsupported}</p> : null}
            {r.status === "invalid" ? <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{ui.invalid}</p> : null}

            {r.status === "ok" ? (
              <>
                <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
                  {[
                    [ui.outHfov, fdeg(r.hfovDeg)],
                    [ui.outVfov, fdeg(r.vfovDeg)],
                    [ui.outDfov, fdeg(r.dfovDeg)],
                    [ui.outWidth, fm(r.scene.widthM)],
                    [ui.outHeight, fm(r.scene.heightM)],
                    [ui.outPpmH, fppm(r.scene.ppmH)],
                    ...(r.side ? [
                      [ui.outDepth, fm(r.depthM)],
                      [ui.outSlant, fm(r.slantM!)],
                      [ui.outNear, `${fm(r.side.nearM)} ${ui.outFar} ${Number.isFinite(r.side.farM) ? fm(r.side.farM) : ui.horizon}`],
                    ] : []),
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-[11px] font-semibold text-slate-500">{k}</dt>
                      <dd className="mt-0.5 text-lg font-black tabular-nums text-slate-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                {r.optics.vfovEstimated && inp.lens === "fixed" && inp.src === "fov" ? <p className="mt-3 text-xs text-amber-800">{ui.vfovEst}</p> : null}
                {inp.lens === "vari" && inp.src === "fov" ? <p className="mt-3 text-xs text-amber-800">{ui.variEst}</p> : null}
                {r.variMismatch !== null && r.variMismatch > 0.05 ? (
                  <p className="mt-1 text-xs text-amber-800">{fill(ui.variMismatch, { p: `${num(r.variMismatch * 100, 0)} %` })}</p>
                ) : null}
              </>
            ) : null}
          </section>

          {r.status === "ok" ? (
            <section className={card}>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{ui.topView}</div>
              <div className="mt-2"><TopView r={r} levels={lv} names={names} fm={fm} ui={ui} /></div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                {[...lv].sort((a, b) => b.ppm - a.ppm).map((l, i, arr) => (
                  <span key={l.code} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="h-3 w-3 rounded-sm" style={{ background: levelColor(i, arr.length) }} />
                    {names[l.code].name} ≥ {num(l.ppm)}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="h-3 w-3 rounded-sm bg-[#eef2f6] ring-1 ring-slate-300" />{ui.legendBeyond}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">{ui.scaleNote}</p>

              <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{ui.sideView}</div>
              {r.side ? (
                <div className="mt-2"><SideView r={r} inp={inp} levels={lv} names={names} fm={fm} ui={ui} /></div>
              ) : (
                <p className="mt-2 text-sm text-slate-500">{ui.sideOff}</p>
              )}
            </section>
          ) : null}
        </div>
      </div>

      {/* ── уровни ── */}
      {r.status === "ok" ? (
        <section className={card}>
          <h2 className={h2}>{ui.lvTitle} · {PROFILES[inp.std].title}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-3">{ui.colLevel}</th>
                  <th className="py-2 pr-3 text-right">{ui.colPpm}</th>
                  <th className="py-2 pr-3 text-center">{fill(ui.colHere, { d: fm(inp.d) })}</th>
                  <th className="py-2 pr-3 text-right">{ui.colDepth}</th>
                  {r.side ? <th className="py-2 text-right">{ui.colGround}</th> : null}
                </tr>
              </thead>
              <tbody>
                {r.levels.map((l) => (
                  <tr key={l.code} className={`border-b border-slate-100 align-top last:border-0 ${l.met ? "bg-emerald-50/60" : ""}`}>
                    <td className="py-2.5 pr-3">
                      <div className="font-semibold text-slate-900">{lvName(l)}{l.group ? <span className="ml-1.5 text-[10px] font-bold text-slate-400">{l.group}</span> : null}</div>
                      <div className="text-xs text-slate-500">{names[l.code].task}</div>
                    </td>
                    <td className="py-2.5 pr-3 text-right tabular-nums text-slate-700">{num(l.ppm)} {ui.units.ppm}</td>
                    <td className={`py-2.5 pr-3 text-center font-bold ${l.met ? "text-emerald-700" : "text-slate-400"}`}>{l.met ? `✓ ${ui.met}` : ui.notMet}</td>
                    <td className="py-2.5 pr-3 text-right tabular-nums text-slate-700">≤ {fm(l.maxDepthM)}</td>
                    {r.side ? (
                      <td className="py-2.5 text-right tabular-nums text-slate-700">
                        {l.ground ? `${fm(l.ground.fromM)} – ${Number.isFinite(l.ground.toM) ? fm(l.ground.toM) : ui.horizon}` : "—"}
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">{ui.disclaimer}</p>
        </section>
      ) : null}

      {/* ── под задачу ── */}
      {r.status === "ok" && r.task ? (
        <section className={card}>
          <div className={`rounded-xl px-4 py-3 text-sm font-bold ${r.task.check?.ok ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-800"}`}>
            {r.task.check?.ok ? ui.taskOk : ui.taskNo}
          </div>
          {r.task.check ? (
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              <li>{r.task.check.covers ? "✓" : "✗"} {fill(r.task.check.covers ? ui.taskCovers : ui.taskNotCovers, { w: fm(inp.w), s: fm(r.task.check.scene.widthM) })}</li>
              <li>{r.task.check.dense ? "✓" : "✗"} {fill(r.task.check.dense ? ui.taskDense : ui.taskNotDense, { p: fppm(r.task.check.scene.ppmH), t: fppm(r.task.ppm) })}</li>
            </ul>
          ) : null}
          <dl className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskHfov}</dt><dd className="text-lg font-black tabular-nums">{fdeg(r.task.hfovReqDeg)}</dd></div>
            <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskNx}</dt><dd className="text-lg font-black tabular-nums">{num(r.task.nxReq, 0)} {ui.units.px}</dd></div>
            {r.task.focalForWidthMm !== null ? <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskFocalW}</dt><dd className="text-lg font-black tabular-nums">{num(r.task.focalForWidthMm, 1)} {ui.units.mm}</dd></div> : null}
            {r.task.focalForPpmMm !== null ? <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskFocalP}</dt><dd className="text-lg font-black tabular-nums">{num(r.task.focalForPpmMm, 1)} {ui.units.mm}</dd></div> : null}
          </dl>
          {r.task.focalForWidthMm !== null && r.task.focalForPpmMm !== null ? (
            <p className="mt-3 text-sm text-slate-700">
              {r.task.focalForPpmMm <= r.task.focalForWidthMm
                ? fill(ui.taskFocalRange, { a: `${num(r.task.focalForPpmMm, 1)} ${ui.units.mm}`, b: `${num(r.task.focalForWidthMm, 1)} ${ui.units.mm}` })
                : ui.taskFocalNone}
            </p>
          ) : null}
          <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{ui.taskByRes}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {r.task.byResolution.map((x) => (
              <div key={x.nx} className={`rounded-xl border px-3 py-2 ${x.ok ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="text-[11px] text-slate-500">{ui.colRes} {x.nx}</div>
                <div className="text-sm font-black tabular-nums text-slate-900">≤ {fm(x.maxWidthM)}</div>
                <div className={`text-[11px] font-bold ${x.ok ? "text-emerald-700" : "text-slate-400"}`}>{x.ok ? ui.fits : ui.notFits}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── камеры каталога под задачу (этап B) ── */}
      {r.status === "ok" && r.task ? (
        <CameraCatalogMatches
          depthM={r.depthM} widthM={inp.w} ppm={r.task.ppm} locale={locale}
          t={cat} units={{ m: ui.units.m, mm: ui.units.mm, ppm: ui.units.ppm }} num={num}
          picked={picked} onToggle={togglePick}
        />
      ) : null}

      {/* ── действия и заявка ── */}
      <section className={card}>
        {r.status === "ok" ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => copy("calc")} className="min-h-[44px] rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-brand-500">
              {copied === "calc" ? `✓ ${ui.copied}` : ui.copy}
            </button>
            <button type="button" onClick={() => copy("link")} className="min-h-[44px] rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-800 hover:border-brand-500">
              {copied === "link" ? `✓ ${ui.linkCopied}` : ui.copyLink}
            </button>
          </div>
        ) : null}

        <div className={r.status === "ok" ? "mt-5 border-t border-slate-100 pt-5" : ""}>
          <h2 className="text-lg font-black text-slate-900">{ui.leadTitle}</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">{ui.leadText}</p>
          {sent ? (
            <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="font-black text-emerald-900">✓ {ui.sentTitle}</div>
              <p className="mt-1 text-sm text-emerald-800">{ui.sentText}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <input className={fieldCls(false)} name="name" autoComplete="name" aria-label={ui.name} placeholder={ui.name} value={name} onChange={(e) => setName(e.target.value)} />
              <input className={fieldCls(false)} required type="tel" name="phone" autoComplete="tel" inputMode="tel" aria-label={ui.phone} placeholder={ui.phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
              <button type="submit" disabled={sending || !phone.trim()} className="min-h-[44px] rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-500 disabled:opacity-50">
                {sending ? ui.sending : ui.send}
              </button>
              {failed ? <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-3">{tf("errFallback")}</div> : null}
              <p className="text-xs text-slate-500 sm:col-span-3">{ui.note}</p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
