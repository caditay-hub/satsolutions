"use client";

/**
 * Полотно плана: SVG в метрах плана, масштаб колесом/двумя пальцами, сдвиг, перетаскивание
 * камер и точки прицеливания, рисование стен, зон и отрезка масштаба. Pointer Events — одна
 * логика для мыши, пера и пальцев.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Vec2 } from "@/lib/cameraDesigner/plan/geometry";
import type { PlanProject } from "@/lib/cameraDesigner/plan/project";
import { PlanVectors, type Draft, type Selection } from "./PlanVectors";

export type Tool = "select" | "camera" | "wall" | "zone" | "scale" | "rack";
type Bounds = { x: number; y: number; w: number; h: number };
type View = { s: number; ox: number; oy: number };

const CLICK_PX = 5;

export function PlanCanvas(p: {
  project: PlanProject;
  bounds: Bounds;
  bgUrl: string | null;
  heatUrl: string | null;
  heatBounds: Bounds | null;
  tool: Tool;
  armed: boolean;
  selected: Selection;
  draft: Draft;
  levelsPpm: number[];
  camLabel: (n: number) => string;
  zoneLabel: (n: number) => string;
  labels: { zoomIn: string; zoomOut: string; fit: string; m: string; dec: string };
  fitKey: string;
  onSelect: (s: Selection) => void;
  onMoveCam: (id: string, x: number, y: number) => void;
  onAim: (id: string, x: number, y: number) => void;
  onPlace: (x: number, y: number) => void;
  onDraftPoint: (pt: Vec2) => void;
  onDraftCursor: (pt: Vec2 | null) => void;
  onDraftFinish: () => void;
  onDragging: (on: boolean) => void;
  onRack: (x: number, y: number) => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 800, h: 520, measured: false });
  const [view, setView] = useState<View>({ s: 10, ox: 0, oy: 0 });
  const viewRef = useRef(view);
  viewRef.current = view;
  const { bounds: B } = p;

  useLayoutEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const measure = () => { if (el.clientWidth > 0) setSize({ w: el.clientWidth, h: el.clientHeight || 520, measured: true }); };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // в фоновой вкладке ResizeObserver молчит — перемеряем ещё по resize и при возврате на вкладку
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", measure);
    measure();
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); document.removeEventListener("visibilitychange", measure); };
  }, []);

  const fit = useCallback(() => {
    // поля под кнопки масштаба справа (≈52 px + значок камеры) и линейку снизу: на узком полотне они закрывали
    // камеры в углах плана (живая проверка 12.11); поля симметричные — план остаётся по центру
    const s = Math.max(1e-6, Math.min((size.w - 2 * 72) / B.w, (size.h - 2 * 40) / B.h));
    setView({ s, ox: B.x + B.w / 2 - size.w / s / 2, oy: B.y + B.h / 2 - size.h / s / 2 });
  }, [B.x, B.y, B.w, B.h, size.w, size.h]);

  // вписываем план при открытии нового плана и когда полотно впервые измерено (до этого
  // ширина — заглушка, и план вписался бы не в тот размер)
  // Пока клиент сам не двигал план, он остаётся вписанным и при изменении размера окна.
  const fitted = useRef("");
  const userMoved = useRef(false);
  useEffect(() => {
    if (!size.measured) return;
    if (fitted.current !== p.fitKey) { fitted.current = p.fitKey; userMoved.current = false; fit(); }
    else if (!userMoved.current) fit();
  }, [p.fitKey, size.measured, size.w, size.h, fit]);

  const zoomAt = useCallback((factor: number, cx: number, cy: number) => {
    userMoved.current = true;
    setView((v) => {
      const s = Math.min(Math.max(v.s * factor, 0.02), 2000);
      const px = v.ox + cx / v.s, py = v.oy + cy / v.s;
      return { s, ox: px - cx / s, oy: py - cy / s };
    });
  }, []);

  // колесо: масштаб — только с Ctrl (⌘ на Mac), иначе прокручивается страница (решение владельца
  // 12.11: колёсико над планом увеличивало план вместо прокрутки). Щипок на тачпаде браузер
  // присылает как wheel с ctrlKey — он по-прежнему масштабирует. passive:false — чтобы отменить
  // масштаб страницы браузером при Ctrl + колесо.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * 0.0015), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  const toPlan = (cx: number, cy: number): Vec2 => {
    const r = svg.current!.getBoundingClientRect();
    const v = viewRef.current;
    return { x: v.ox + (cx - r.left) / v.s, y: v.oy + (cy - r.top) / v.s };
  };
  const clamp = (q: Vec2): Vec2 => ({ x: Math.min(B.x + B.w, Math.max(B.x, q.x)), y: Math.min(B.y + B.h, Math.max(B.y, q.y)) });

  type Drag =
    | { mode: "pan"; sx: number; sy: number; v: View; moved: boolean }
    | { mode: "cam"; id: string; dx: number; dy: number; sx: number; sy: number; moved: boolean }
    | { mode: "aim"; id: string }
    | { mode: "pinch"; d0: number; v: View; c0: Vec2 };
  const drag = useRef<Drag | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  function onDown(e: React.PointerEvent<SVGSVGElement>) {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    // захват может бросить исключение (неактивный указатель) — без него просто теряем перетаскивание за край
    try { svg.current!.setPointerCapture(e.pointerId); } catch { /* без захвата */ }
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const r = svg.current!.getBoundingClientRect();
      if (drag.current?.mode === "cam" || drag.current?.mode === "aim") p.onDragging(false);
      drag.current = { mode: "pinch", d0: Math.hypot(a.x - b.x, a.y - b.y), v: viewRef.current, c0: { x: (a.x + b.x) / 2 - r.left, y: (a.y + b.y) / 2 - r.top } };
      return;
    }
    const t = e.target as Element;
    const aim = t.closest("[data-aim]")?.getAttribute("data-aim");
    const cam = t.closest("[data-cam]")?.getAttribute("data-cam");
    if (p.tool === "select" && aim) {
      drag.current = { mode: "aim", id: aim };
      p.onDragging(true);
      return;
    }
    if (p.tool === "select" && cam) {
      const c = p.project.cams.find((x) => x.id === cam);
      if (c) {
        const q = toPlan(e.clientX, e.clientY);
        p.onSelect({ type: "cam", id: cam });
        drag.current = { mode: "cam", id: cam, dx: q.x - c.x, dy: q.y - c.y, sx: e.clientX, sy: e.clientY, moved: false };
        return;
      }
    }
    drag.current = { mode: "pan", sx: e.clientX, sy: e.clientY, v: viewRef.current, moved: false };
  }

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    if (pointers.current.has(e.pointerId)) pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const d = drag.current;
    if (p.tool === "wall" || p.tool === "zone" || p.tool === "scale") p.onDraftCursor(toPlan(e.clientX, e.clientY));
    if (!d) return;
    if (d.mode === "pinch" && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      const r = svg.current!.getBoundingClientRect();
      const s = Math.min(Math.max(d.v.s * (Math.hypot(a.x - b.x, a.y - b.y) / d.d0), 0.02), 2000);
      const c = { x: (a.x + b.x) / 2 - r.left, y: (a.y + b.y) / 2 - r.top };
      const px = d.v.ox + d.c0.x / d.v.s, py = d.v.oy + d.c0.y / d.v.s;
      userMoved.current = true;
      setView({ s, ox: px - c.x / s, oy: py - c.y / s });
    } else if (d.mode === "pan") {
      if (Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > CLICK_PX) { d.moved = true; userMoved.current = true; }
      if (d.moved) setView({ ...d.v, ox: d.v.ox - (e.clientX - d.sx) / d.v.s, oy: d.v.oy - (e.clientY - d.sy) / d.v.s });
    } else if (d.mode === "cam") {
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > CLICK_PX) { d.moved = true; p.onDragging(true); }
      if (d.moved) {
        const q = clamp(toPlan(e.clientX, e.clientY));
        p.onMoveCam(d.id, q.x - d.dx, q.y - d.dy);
      }
    } else if (d.mode === "aim") {
      const q = toPlan(e.clientX, e.clientY);
      p.onAim(d.id, q.x, q.y);
    }
  }

  function onUp(e: React.PointerEvent<SVGSVGElement>) {
    pointers.current.delete(e.pointerId);
    const d = drag.current;
    if (d?.mode === "pinch") {
      // второй палец отпущен — дальше не двигаем, пока не будет нового касания
      if (pointers.current.size === 0) drag.current = null;
      return;
    }
    drag.current = null;
    if (!d) return;
    if (d.mode === "cam" || d.mode === "aim") {
      if (d.mode === "aim" || d.moved) p.onDragging(false);
      return;
    }
    if (d.mode === "pan" && !d.moved) {
      const q = toPlan(e.clientX, e.clientY);
      const t = e.target as Element;
      if (p.tool === "rack") {
        const c = clamp(q);
        p.onRack(c.x, c.y);
      } else if (p.tool === "camera" && p.armed) {
        const inside = q.x >= B.x && q.x <= B.x + B.w && q.y >= B.y && q.y <= B.y + B.h;
        if (inside) p.onPlace(q.x, q.y);
      } else if (p.tool === "wall" || p.tool === "zone" || p.tool === "scale") {
        p.onDraftPoint(clamp(q));
      } else if (p.tool === "select") {
        const w = t.closest("[data-wall]")?.getAttribute("data-wall");
        const z = t.closest("[data-zone]")?.getAttribute("data-zone");
        p.onSelect(w !== null && w !== undefined ? { type: "wall", i: Number(w) } : z !== null && z !== undefined ? { type: "zone", i: Number(z) } : null);
      }
    }
  }

  const k = 1 / view.s;
  const vb = `${view.ox} ${view.oy} ${size.w / view.s} ${size.h / view.s}`;
  const grid = p.project.bg?.kind === "grid";
  // шаг сетки: 1 м, 5 м, 10 м… чтобы линии шли не чаще ~12 px
  const step = [1, 2, 5, 10, 20, 50, 100, 200, 500].find((s) => s * view.s >= 12) ?? 1000;
  const btn = "flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white text-lg font-bold text-slate-700 shadow-sm hover:border-brand-400";

  return (
    <div ref={wrap} className="relative h-[62vh] min-h-[360px] w-full overflow-hidden bg-slate-100 lg:h-[calc(100vh-390px)] lg:min-h-[460px]">
      <svg
        ref={svg} viewBox={vb} width={size.w} height={size.h} className="block select-none"
        style={{ touchAction: "none", cursor: p.tool === "select" ? "default" : "crosshair" }}
        onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
        onPointerLeave={() => p.onDraftCursor(null)}
        onDoubleClick={() => { if (p.tool === "wall" || p.tool === "zone") p.onDraftFinish(); }}
      >
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="#fff" />
        {p.bgUrl && !grid ? <image href={p.bgUrl} x={B.x} y={B.y} width={B.w} height={B.h} preserveAspectRatio="none" /> : null}
        {grid ? (
          <g stroke="#e2e8f0" strokeWidth={1} vectorEffect="non-scaling-stroke">
            {Array.from({ length: Math.floor(B.w / step) + 1 }, (_, i) => <line key={`gx${i}`} x1={B.x + i * step} y1={B.y} x2={B.x + i * step} y2={B.y + B.h} vectorEffect="non-scaling-stroke" />)}
            {Array.from({ length: Math.floor(B.h / step) + 1 }, (_, i) => <line key={`gy${i}`} x1={B.x} y1={B.y + i * step} x2={B.x + B.w} y2={B.y + i * step} vectorEffect="non-scaling-stroke" />)}
          </g>
        ) : null}
        {p.heatUrl && p.heatBounds ? (
          <image href={p.heatUrl} x={p.heatBounds.x} y={p.heatBounds.y} width={p.heatBounds.w} height={p.heatBounds.h} preserveAspectRatio="none" opacity={0.62} pointerEvents="none" />
        ) : null}
        <rect x={B.x} y={B.y} width={B.w} height={B.h} fill="none" stroke="#94a3b8" strokeWidth={1} vectorEffect="non-scaling-stroke" pointerEvents="none" />
        <PlanVectors project={p.project} bounds={B} k={k} levelsPpm={p.levelsPpm} camLabel={p.camLabel} zoneLabel={p.zoneLabel} selected={p.selected} draft={p.draft} />
      </svg>
      <div className="absolute right-2 top-2 flex flex-col gap-1.5">
        <button type="button" className={btn} aria-label={p.labels.zoomIn} title={p.labels.zoomIn} onClick={() => zoomAt(1.4, size.w / 2, size.h / 2)}>+</button>
        <button type="button" className={btn} aria-label={p.labels.zoomOut} title={p.labels.zoomOut} onClick={() => zoomAt(1 / 1.4, size.w / 2, size.h / 2)}>−</button>
        <button type="button" className={btn} aria-label={p.labels.fit} title={p.labels.fit} onClick={() => { userMoved.current = false; fit(); }}>
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7V3h4M13 3h4v4M17 13v4h-4M7 17H3v-4" /></svg>
        </button>
      </div>
      <ScaleBar s={view.s} unit={p.labels.m} dec={p.labels.dec} />
    </div>
  );
}

/** Масштабная линейка в углу: длина в метрах по текущему масштабу. */
function ScaleBar({ s, unit, dec }: { s: number; unit: string; dec: string }) {
  const m = [0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000].find((x) => x * s >= 60) ?? 2000;
  return (
    <div className="pointer-events-none absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm">
      <div className="h-1.5 border-x-2 border-b-2 border-slate-700" style={{ width: m * s }} />
      <div className="mt-0.5 tabular-nums">{String(m).replace(".", dec)} {unit}</div>
    </div>
  );
}
