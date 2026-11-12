"use client";

/**
 * Калькулятор обзора камеры (SAT Camera Designer). Редизайн 11.11.2026 по решению владельца:
 * слева четыре простые настройки (объектив, расстояние, качество камеры, что нужно видеть),
 * справа большая сцена — «Вид с камеры» и «Вид сверху» — и три результата обычными словами.
 * Всё остальное (тип объектива, матрица, паспортные углы, высота и наклон, стандарт) — в
 * свёрнутом «Для специалистов». Обслуживает два режима страницы: «Одна камера» и «Подобрать
 * камеру» (useCdMode). Вся математика — в lib/cameraDesigner (общая с сервером и тестами):
 * простые настройки лишь задают тот же CalcInput (simple.ts), сцена и цифры считаются из одного
 * результата compute(). Состояние живёт в ссылке (?…) — её можно скопировать и отправить.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { trackConversion } from "@/lib/gtag";
import { getGclid } from "@/lib/gclid";
import { DEFAULT_INPUT, compute, type CalcInput, type CalcResult, type FieldKey } from "@/lib/cameraDesigner/calculate";
import { parseQuery, toQuery } from "@/lib/cameraDesigner/query";
import { fill, makeFmt } from "@/lib/cameraDesigner/format";
import { levelColor } from "@/lib/cameraDesigner/palette";
import { PROFILES, visibleLevels, type Level } from "@/lib/cameraDesigner/standards";
import {
  PLACES, SIMPLE_DEFAULT, SIMPLE_DIST, SIMPLE_LENSES, SIMPLE_MP, SIMPLE_TASKS,
  pickTypical, simpleInput, simpleOf, summarize, taskOfLevel, type Place, type SimpleState, type SimpleTask,
} from "@/lib/cameraDesigner/simple";
import type { CdContent } from "@/lib/cameraDesigner/content";
import type { CdCatalogUi } from "@/lib/cameraDesigner/catalogContent";
import type { SimpleUi } from "@/lib/cameraDesigner/simpleContent";
import { CameraCatalogMatches, type PickedCamera } from "@/components/CameraCatalogMatches";
import { useCdMode } from "@/components/CameraDesignerTabs";
import { CameraView } from "@/components/camera/CameraView";
import { TopViewInteractive, type TopBand } from "@/components/camera/TopViewInteractive";

type Props = { c: Pick<CdContent, "ui" | "levels" | "numLocale">; s: SimpleUi; cat: CdCatalogUi; locale: string };
type Ok = Extract<CalcResult, { status: "ok" }>;

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

/** Кнопки-«таблетки» простого режима: активной может не быть (камера задана вручную). */
function Chips<T extends string | number>(p: { label: string; opts: { v: T; t: string; sub?: string }[]; value: T | null; onChange: (v: T) => void; cols?: string }) {
  return (
    <div>
      <div className="mb-2 text-sm font-bold text-slate-900">{p.label}</div>
      <div role="group" aria-label={p.label} className={`grid gap-1.5 ${p.cols ?? "grid-cols-3"}`}>
        {p.opts.map((o) => {
          const on = p.value === o.v;
          return (
            <button key={String(o.v)} type="button" aria-pressed={on} onClick={() => p.onChange(o.v)}
              className={`min-h-[44px] rounded-xl border px-2 py-1.5 text-sm font-bold leading-tight transition-colors ${on ? "border-brand-600 bg-brand-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-800 hover:border-brand-400"}`}>
              {o.t}
              {o.sub ? <span className={`block text-[10px] font-semibold tabular-nums ${on ? "text-white/80" : "text-slate-500"}`}>{o.sub}</span> : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const RES = [
  [1920, 1080], [2560, 1440], [2688, 1520], [2560, 1944], [2880, 1620], [3200, 1800], [3840, 2160], [4000, 3000],
] as const;

function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ─────────── вид сбоку (с высотой и наклоном, «Подробнее») ─────────── */

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

const START: CalcInput = simpleInput(SIMPLE_DEFAULT, DEFAULT_INPUT);

export function CameraLensCalculator({ c, s: su, cat, locale }: Props) {
  const { ui, levels: names } = c;
  const tf = useTranslations("form");
  const { mode } = useCdMode();
  const { num, dec } = useMemo(() => makeFmt(locale), [locale]);
  const fm = (n: number) => `${num(n)} ${ui.units.m}`;
  const fdeg = (n: number) => `${num(n, 1)}°`;
  const fppm = (n: number) => `${num(n, n >= 100 ? 0 : 1)} ${ui.units.ppm}`;
  const fmm = (n: number) => `${num(n, 1)} ${ui.units.mm}`;

  const [inp, setInp] = useState<CalcInput>(START);
  const [advOpen, setAdvOpen] = useState(false);
  const touched = useRef(false);
  // параметры из ссылки читаем после гидратации: сервер всегда отдаёт расчёт по умолчанию
  useEffect(() => {
    if (!window.location.search) return;
    const q = new URLSearchParams(window.location.search);
    if (!q.has("v")) return;
    const i = parseQuery(q);
    // ссылка без задачи (карточки товаров и ссылки до 12.11) — задача простого режима, а не «детали лица»
    if (!q.has("lv") && i.std === "2014") i.lvl = "observe";
    setInp(i);
    // камера из ссылки не укладывается в простые настройки — сразу показываем, где она задана
    if (!simpleOf(i)) setAdvOpen(true);
  }, []);
  // режим страницы: одна камера — расчёт «прямой», подбор — «под задачу»
  useEffect(() => {
    const want = mode === "pick" ? "task" : "direct";
    setInp((p) => (p.mode === want ? p : { ...p, mode: want }));
  }, [mode]);
  useEffect(() => {
    if (!touched.current) return;
    // hash сохраняем: им вкладки отмечают режим в адресе
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

  /* ── простые настройки: задают тот же вход расчёта ── */
  const simple = simpleOf(inp);
  const setSimple = (patch: Partial<SimpleState>) => {
    touched.current = true;
    setInp((p) => {
      const cur = simpleOf(p) ?? { ...SIMPLE_DEFAULT, d: Number.isFinite(p.d) ? p.d : SIMPLE_DEFAULT.d, task: taskOfLevel(p.lvl) ?? SIMPLE_DEFAULT.task };
      return simpleInput({ ...cur, ...patch }, p);
    });
  };
  const setTask = (t: SimpleTask) => {
    touched.current = true;
    setInp((p) => ({ ...p, std: "2014", all: false, lvl: SIMPLE_TASKS.find((x) => x.key === t)!.lvl }));
  };
  const task = inp.std === "2014" ? taskOfLevel(inp.lvl) : null;
  /** Подбор: где будет камера — подставляет типичные цифры и включает проверку защиты корпуса. */
  const [place, setPlace] = useState<Place | null>(null);
  const choosePlace = (k: Place) => {
    const pl = PLACES.find((x) => x.key === k)!;
    touched.current = true;
    setPlace(k);
    setInp((p) => ({ ...p, d: pl.d, w: pl.w, std: "2014", all: false, lvl: SIMPLE_TASKS.find((x) => x.key === pl.task)!.lvl }));
  };
  const outdoor = !!place && PLACES.find((x) => x.key === place)!.outdoor;

  const r = useMemo(() => compute(inp), [inp]);
  const bad = new Set<FieldKey>(r.status === "invalid" ? r.fields : []);
  const lv = visibleLevels(inp.std, inp.all);
  const lvName = (l: Level) => `${names[l.code].name}${names[l.code].name === l.en ? "" : ` (${l.en})`}`;
  const resIdx = RES.findIndex(([x, y]) => x === inp.nx && y === inp.ny);
  const needLevel = PROFILES[inp.std].levels.find((l) => l.code === inp.lvl);
  const sum = r.status === "ok" && needLevel ? summarize(inp, r.optics, r.depthM, needLevel.ppm) : null;
  const taskName = task ? su.tasks[task] : needLevel ? names[needLevel.code].name : "";

  /* ── вид сверху: человек и поворот камеры ── */
  const [dx, setDx] = useState(0);
  const [pan, setPan] = useState(0);
  const [stage, setStage] = useState<"cam" | "top">("cam");
  const [more, setMore] = useState(false);
  const [morePick, setMorePick] = useState(false); // у подбора — свой: раскрытое в «Одной камере» не переносится
  const moveTo = (d: number, x: number) => { set("d", d); setDx(x); };
  // поворот камеры: человек стоит на месте, меняются его дистанция по оси и смещение вбок
  const turn = (deg: number) => {
    const a0 = (pan * Math.PI) / 180, a1 = (deg * Math.PI) / 180;
    const wx = Math.sin(a0) * inp.d + Math.cos(a0) * dx, wy = -Math.cos(a0) * inp.d + Math.sin(a0) * dx;
    const dz = wx * Math.sin(a1) - wy * Math.cos(a1), lx = wx * Math.cos(a1) + wy * Math.sin(a1);
    setPan(deg);
    set("d", Math.min(SIMPLE_DIST.max, Math.max(SIMPLE_DIST.min, Math.round(dz * 10) / 10)));
    setDx(Math.round(lx * 10) / 10);
  };
  const bands: TopBand[] = r.status === "ok"
    ? (task ? SIMPLE_TASKS.map((t) => ({ lvl: t.lvl, name: su.tasks[t.key] })) : lv.map((l) => ({ lvl: l.code, name: names[l.code].name })))
      .map((x) => ({ ...x, ppm: PROFILES[inp.std].levels.find((l) => l.code === x.lvl)!.ppm }))
      .sort((a, b) => b.ppm - a.ppm)
      .map((x, i, arr) => ({ name: x.name, color: levelColor(i, arr.length), depth: r.optics.nx / (2 * Math.tan(r.optics.hfov / 2) * x.ppm) }))
    : [];

  /* ── текст расчёта: для копирования и для заявки ── */
  function summary(res: Ok) {
    const lines = [
      `${ui.outHfov}: ${fdeg(res.hfovDeg)}; ${ui.outVfov}: ${fdeg(res.vfovDeg)}`,
      `${inp.nx} × ${inp.ny} ${ui.units.px}${simple ? `; f ${fmm(simple.f)}; ${su.mp}: ${simple.mp} ${su.mpUnit}` : ""}`,
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
  const pick = mode === "pick";

  /* ── «Для специалистов»: полная форма камеры и сцены ── */
  const advanced = (
    <details open={advOpen} onToggle={(e) => setAdvOpen((e.target as HTMLDetailsElement).open)} className="group rounded-2xl border border-slate-200 bg-slate-50/60">
      <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block text-sm font-black text-slate-900">{su.adv}</span>
          <span className="block text-[11px] leading-snug text-slate-500">{su.advHint}</span>
        </span>
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </summary>
      <div className="grid gap-4 border-t border-slate-200 px-4 pb-4 pt-4">
        <Seg label={ui.std} value={inp.std} onChange={(v) => set("std", v)}
          opts={[{ v: "2014", t: ui.std2014 }, { v: "2025", t: ui.std2025 }]} />
        {inp.std === "2014" ? (
          <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-sm text-slate-700">
            <input type="checkbox" checked={inp.all} onChange={(e) => set("all", e.target.checked)} className="h-5 w-5 accent-brand-600" />
            {ui.allLevels}
          </label>
        ) : null}
        {pick || !task ? (
          <div>
            <label htmlFor="cd-lvl" className="mb-1.5 block text-xs font-semibold text-slate-600">{ui.lvl}</label>
            <select id="cd-lvl" className={fieldCls(bad.has("lvl"))} value={inp.lvl} onChange={(e) => set("lvl", e.target.value)}>
              {PROFILES[inp.std].levels.map((l) => <option key={l.code} value={l.code}>{lvName(l)} — {num(l.ppm)} {ui.units.ppm}</option>)}
            </select>
          </div>
        ) : null}
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
              <div className="grid gap-3">
                <NumField id="cd-hf" label={ui.hfov} value={inp.hfov} onChange={setNum("hfov")} bad={bad.has("hfov")} dec={dec} slider={{ min: 10, max: 150, step: 0.5 }} />
                <div className="grid grid-cols-2 gap-3">
                  <NumField id="cd-vf" label={ui.vfov} hint={ui.vfovHint} value={inp.vfov} nullable onChange={(v) => set("vfov", v === null ? null : v)} bad={bad.has("vfov")} dec={dec} />
                  <NumField id="cd-f" label={ui.f} hint={ui.fHint} value={inp.f} onChange={setNum("f")} bad={false} dec={dec} />
                </div>
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
          </>
        ) : null}
      </div>
    </details>
  );

  /* ── левая панель: четыре настройки ── */
  const panel = (
    <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      {pick ? (
        <Chips label={su.pick.place} value={place} onChange={choosePlace} cols="grid-cols-3 sm:grid-cols-5 lg:grid-cols-3"
          opts={PLACES.map((x) => ({ v: x.key, t: su.pick.places[x.key] }))} />
      ) : null}
      {!pick ? (
        <Chips label={su.lens} value={simple ? simple.f : null} onChange={(f) => setSimple({ f })}
          opts={SIMPLE_LENSES.map((f) => ({ v: f, t: `${num(f, 1)} ${ui.units.mm}` }))} />
      ) : null}
      <div>
        <NumField id="cd-d" label={su.dist} value={inp.d} onChange={setNum("d")} bad={bad.has("d")} dec={dec}
          slider={{ min: SIMPLE_DIST.min, max: SIMPLE_DIST.max, step: 0.5 }} />
        <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label={su.dist}>
          {SIMPLE_DIST.quick.map((d) => (
            <button key={d} type="button" aria-pressed={inp.d === d} onClick={() => { set("d", d); setDx(0); }}
              className={`min-h-[36px] rounded-lg border px-3 text-xs font-bold tabular-nums ${inp.d === d ? "border-brand-600 bg-brand-50 text-brand-800" : "border-slate-200 text-slate-600 hover:border-brand-400"}`}>
              {fm(d)}
            </button>
          ))}
        </div>
      </div>
      {pick ? (
        <NumField id="cd-w" label={ui.w} hint={su.pickWidthHint} value={inp.w} onChange={setNum("w")} bad={bad.has("w")} dec={dec} slider={{ min: 1, max: 60, step: 0.5 }} />
      ) : (
        <Chips label={su.mp} value={simple ? simple.mp : null} onChange={(mp) => setSimple({ mp })} cols="grid-cols-2 sm:grid-cols-4 lg:grid-cols-2"
          opts={SIMPLE_MP.map((m) => ({ v: m.mp, t: `${m.mp} ${su.mpUnit}`, sub: `${m.nx}×${m.ny}` }))} />
      )}
      <div>
        <Chips label={su.task} value={task} onChange={setTask} cols="grid-cols-1 sm:grid-cols-3 lg:grid-cols-1"
          opts={SIMPLE_TASKS.map((t) => ({ v: t.key, t: su.tasks[t.key], sub: `${su.taskHint[t.key]} · ${num(PROFILES["2014"].levels.find((l) => l.code === t.lvl)!.ppm)} ${ui.units.ppm}` }))} />
      </div>
      {!pick && !simple ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs text-amber-900">
          {su.custom}{" "}
          <button type="button" onClick={() => { setSimple({}); setAdvOpen(false); }} className="font-bold underline underline-offset-2">{su.reset}</button>
        </div>
      ) : null}
      {advanced}
    </div>
  );

  /* ── сцена и три результата (одна камера) ── */
  // человек сдвинут на виде сверху за край кадра: та же граница, что у сцены (полуширина на его глубине)
  const outside = r.status === "ok" && Math.abs(dx) > r.scene.widthM / 2 + 0.3; // +0,3 м: как в CameraView — виден хотя бы краем
  const results = r.status === "ok" && sum ? (() => {
    const a = sum.advice;
    const advice = (() => {
      switch (a.kind) {
        case "narrower": return fill(su.adv_.narrower, { f: fmm(a.f), d: fm(sum.depthM), p: fppm(a.ppm), w: fm(a.widthM) });
        case "moreMp": return fill(su.adv_.moreMp, { mp: `${a.mp} ${su.mpUnit}`, f: fmm(a.f) });
        case "none": return fill(su.adv_.none, { d: fm(sum.depthM) });
        case "wider": return fill(su.adv_.wider, { f: fmm(a.f), w: fm(a.widthM) });
        case "exact": return fill(su.adv_.exact, { d: fm(sum.depthM) });
        case "customOk": return fill(su.adv_.customOk, { m: fm(a.maxDepthM) });
        case "customNo": return fill(su.adv_.customNo, { a: fdeg(a.hfovDeg), nx: num(a.nxReq, 0) });
      }
    })();
    const rows = [
      { k: "w", t: su.resWidthT, v: fill(su.resWidth, { d: fm(sum.depthM), w: fm(sum.widthM) }), tone: "slate" },
      outside ? { k: "p", t: su.resDetT, tone: "no", v: su.outside } : {
        k: "p", t: su.resDetT, tone: sum.ok ? "ok" : "no",
        v: (sum.ok
          ? fill(su.detOk, { p: fppm(sum.ppm), t: taskName, m: fm(sum.maxDepthM) })
          : fill(su.detNo, { t: taskName, d: fm(sum.depthM), p: fppm(sum.ppm), n: fppm(sum.need), m: fm(sum.maxDepthM) }))
          + (task === "face" || (needLevel && needLevel.ppm >= 125) ? ` ${su.faceCaveat}` : ""),
      },
      { k: "a", t: su.resAdvT, v: advice, tone: "slate" },
    ];
    const icon: Record<string, React.ReactNode> = {
      w: <path d="M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" />,
      p: <path d="M12 5c-5 0-9 7-9 7s4 7 9 7 9-7 9-7-4-7-9-7zm0 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />,
      a: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.9V16h5v-.2c0-.8.4-1.5 1-1.9A6 6 0 0 0 12 3z" />,
    };
    return (
      <div aria-live="polite" className="grid gap-2.5">
        {rows.map((x) => (
          <div key={x.k} className={`flex gap-3 rounded-xl border p-3.5 ${x.tone === "ok" ? "border-emerald-200 bg-emerald-50" : x.tone === "no" ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${x.tone === "ok" ? "bg-emerald-600 text-white" : x.tone === "no" ? "bg-amber-500 text-white" : "bg-brand-50 text-brand-700"}`}>
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icon[x.k]}</svg>
            </span>
            <div className="min-w-0">
              <div className="text-[11px] font-black uppercase tracking-wider text-slate-500">{x.t}</div>
              <p className="mt-0.5 text-sm leading-relaxed text-slate-800">{x.v}</p>
            </div>
          </div>
        ))}
      </div>
    );
  })() : null;

  const details = r.status === "ok" ? (
    <div className="mt-3">
      <button type="button" aria-expanded={more} onClick={() => setMore((v) => !v)}
        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-1 text-sm font-bold text-brand-700 hover:text-brand-600">
        {more ? su.less : su.more}
        <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${more ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
      </button>
      {more ? (
        <div className="mt-2 grid gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className={h2}>{ui.outTitle}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${simple ? "bg-slate-100 text-slate-700" : r.optics.estimate ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                {simple ? su.typicalBadge : r.optics.estimate ? ui.badgeEstimate : ui.badgePassport}
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
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
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className={h2}>{ui.lvTitle} · {PROFILES[inp.std].title}</h3>
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
          </div>

          {r.side ? (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{ui.sideView}</div>
              <div className="mt-2"><SideView r={r} inp={inp} levels={lv} names={names} fm={fm} ui={ui} /></div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  ) : null;

  const tabBtn = (on: boolean) => `min-h-[40px] rounded-lg px-3.5 text-sm font-bold transition-colors ${on ? "bg-white text-brand-700 shadow-sm ring-1 ring-slate-200" : "text-slate-600 hover:text-brand-700"}`;

  const stageBlock = (
    <div className="grid gap-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
          <div role="tablist" aria-label={`${su.viewCam} / ${su.viewTop}`} className="inline-flex gap-1 rounded-xl bg-slate-100 p-1">
            <button type="button" role="tab" aria-selected={stage === "cam"} className={tabBtn(stage === "cam")} onClick={() => setStage("cam")}>{su.viewCam}</button>
            <button type="button" role="tab" aria-selected={stage === "top"} className={tabBtn(stage === "top")} onClick={() => setStage("top")}>{su.viewTop}</button>
          </div>
          {stage === "top" ? <span className="text-[11px] text-slate-500">{su.dragHint}</span> : null}
        </div>
        {r.status === "ok" ? (
          stage === "cam" ? (
            <CameraView o={r.optics} d={inp.d} geo={inp.geo} mount={inp.mount} tiltDeg={inp.tilt} dx={dx}
              label={su.viewCam}
              frameLabel={fill(su.frame, { d: fm(r.depthM), w: fm(r.scene.widthM), h: fm(r.scene.heightM) })}
              faceLabel={(w, h) => fill(su.face, { w: String(w), h: String(h) })}
              outsideLabel={su.outside} distLabel={fm} />
          ) : (
            <div>
              <TopViewInteractive hfov={r.optics.hfov} bands={bands} d={inp.d} dx={dx} pan={pan}
                dMin={SIMPLE_DIST.min} dMax={SIMPLE_DIST.max} onMove={moveTo} onPan={turn}
                widthLabel={fm(r.scene.widthM)} distLabel={fm(inp.d)} label={su.viewTop} personLabel={su.person} cameraLabel={su.camera} fmM={fm} />
              <div className="flex flex-wrap gap-x-3 gap-y-1 border-t border-slate-100 px-3 py-2">
                {bands.map((b) => (
                  <span key={b.name} className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className="h-3 w-3 rounded-sm" style={{ background: b.color }} />{b.name} · ≤ {fm(b.depth)}
                  </span>
                ))}
                <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="h-3 w-3 rounded-sm bg-[#e2e8f0] ring-1 ring-slate-300" />{ui.legendBeyond}
                </span>
              </div>
            </div>
          )
        ) : (
          <div className="flex aspect-video items-center justify-center p-6 text-center text-sm text-slate-600">
            {r.status === "unsupported" ? ui.unsupported : <span role="alert" className="text-red-700">{ui.invalid}</span>}
          </div>
        )}
      </div>
      <p className="text-[11px] leading-snug text-slate-500">{su.imitation}{simple ? ` ${su.sensorNote}` : ""}</p>
      {results}
      {details}
    </div>
  );

  /* ── подбор: что нужно и камеры каталога ── */
  const pickBlock = (
    <div className="grid gap-4">
      {r.status !== "ok" ? (
        <div className={card}>
          {r.status === "unsupported" ? <p className="text-sm leading-relaxed text-slate-700">{ui.unsupported}</p> : <p role="alert" className="text-sm text-red-700">{ui.invalid}</p>}
        </div>
      ) : null}
      {r.status === "ok" && r.task && needLevel ? (() => {
        const typ = pickTypical(inp.d, inp.w, needLevel.ppm);
        const rows = [
          fill(su.pick.needAngle, { a: fdeg(r.task.hfovReqDeg), d: fm(inp.d), w: fm(inp.w) }),
          fill(su.pick.needPx, { t: taskName, n: fppm(needLevel.ppm), nx: num(r.task.nxReq, 0) }),
        ];
        return (
          <section className={card} aria-live="polite">
            <h2 className={h2}>{su.pick.needT}</h2>
            <ul className="mt-3 grid gap-2">
              {rows.map((x) => (
                <li key={x} className="flex gap-2.5 text-sm leading-relaxed text-slate-800">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />{x}
                </li>
              ))}
            </ul>
            <div className={`mt-3 rounded-xl border px-3.5 py-3 text-sm font-semibold leading-relaxed ${typ ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
              {typ
                ? fill(su.pick.typical, { mp: `${typ.mp} ${su.mpUnit}`, f: fmm(typ.f), d: fm(inp.d), w: fm(typ.widthM), p: fppm(typ.ppm) })
                : su.pick.typicalNone}
            </div>
            <button type="button" aria-expanded={morePick} onClick={() => setMorePick((v) => !v)}
              className="mt-2 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg px-1 text-sm font-bold text-brand-700 hover:text-brand-600">
              {morePick ? su.less : su.more}
              <svg viewBox="0 0 24 24" className={`h-4 w-4 transition-transform ${morePick ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </button>
            {morePick ? (
          <div className="mt-2 border-t border-slate-100 pt-3">
          <h3 className={h2}>{ui.taskTitle}</h3>
          <dl className="mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
            <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskHfov}</dt><dd className="text-lg font-black tabular-nums">{fdeg(r.task.hfovReqDeg)}</dd></div>
            <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskNx}</dt><dd className="text-lg font-black tabular-nums">{num(r.task.nxReq, 0)} {ui.units.px}</dd></div>
            {r.task.focalForWidthMm !== null ? <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskFocalW}</dt><dd className="text-lg font-black tabular-nums">{fmm(r.task.focalForWidthMm)}</dd></div> : null}
            {r.task.focalForPpmMm !== null ? <div><dt className="text-[11px] font-semibold text-slate-500">{ui.taskFocalP}</dt><dd className="text-lg font-black tabular-nums">{fmm(r.task.focalForPpmMm)}</dd></div> : null}
          </dl>
          {r.task.focalForWidthMm !== null && r.task.focalForPpmMm !== null ? (
            <p className="mt-3 text-sm text-slate-700">
              {r.task.focalForPpmMm <= r.task.focalForWidthMm
                ? fill(ui.taskFocalRange, { a: fmm(r.task.focalForPpmMm), b: fmm(r.task.focalForWidthMm) })
                : ui.taskFocalNone}
            </p>
          ) : null}
          <div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-500">{ui.taskByRes}</div>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {r.task.byResolution.map((x) => (
              <div key={x.nx} className={`rounded-xl border px-3 py-2 ${x.ok ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}>
                <div className="text-[11px] text-slate-500">{ui.colRes} {x.nx}</div>
                <div className="text-sm font-black tabular-nums text-slate-900">≤ {fm(x.maxWidthM)}</div>
                <div className={`text-[11px] font-bold ${x.ok ? "text-emerald-700" : "text-slate-400"}`}>{x.ok ? ui.fits : ui.notFits}</div>
              </div>
            ))}
          </div>
          </div>
            ) : null}
          </section>
        );
      })() : null}
      {r.status === "ok" && r.task ? (
        <CameraCatalogMatches
          depthM={r.depthM} widthM={inp.w} ppm={r.task.ppm} locale={locale} outdoor={outdoor}
          t={cat} pk={su.pick} mpUnit={su.mpUnit} units={{ m: ui.units.m, mm: ui.units.mm, ppm: ui.units.ppm }} num={num}
          leadContext={() => [
            place ? `Место: ${PLACES.find((x) => x.key === place)!.key} (${su.pick.places[place]})` : "",
            `Задача: ${taskName} — ${fppm(r.task!.ppm)} на ${fm(inp.d)}, зона ${fm(inp.w)}; нужен угол ≥ ${fdeg(r.task!.hfovReqDeg)}`,
            link(),
          ].filter(Boolean).join("\n")}
          picked={picked} onToggle={togglePick}
        />
      ) : null}
    </div>
  );

  return (
    <div className="space-y-5">
      {/* компьютер: панель настроек слева, сцена справа; телефон — сначала сцена */}
      <div className="grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:items-start xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="order-2 lg:order-1">{panel}</div>
        <div className="order-1 lg:order-2">{pick ? pickBlock : stageBlock}</div>
      </div>

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
