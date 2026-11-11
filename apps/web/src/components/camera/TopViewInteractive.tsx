"use client";

/**
 * «Вид сверху» (редизайн 11.11.2026): камера, конус обзора, полосы уровней детализации,
 * человек на дистанции. Плотность для прямолинейного объектива постоянна на плоскости,
 * перпендикулярной оси, поэтому границы полос — прямые поперёк конуса, а не дуги.
 * Человека можно перетащить (меняет дистанцию по оси и смещение вбок), камеру — повернуть
 * за ручку; с клавиатуры — стрелками. Координаты рисунка — метры.
 */
import { useRef, useState } from "react";

export type TopBand = { depth: number; color: string; name: string };

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const PAN_MAX = 70, PAN_MIN = -PAN_MAX;

function niceStep(raw: number) {
  const p = 10 ** Math.floor(Math.log10(raw));
  const m = raw / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}

export function TopViewInteractive(p: {
  hfov: number;
  /** Полосы от ближней (самый детальный уровень) к дальней: граница — до какой глубины уровень выполняется. */
  bands: TopBand[];
  d: number; dx: number; pan: number;
  dMin: number; dMax: number;
  onMove: (d: number, dx: number) => void;
  onPan: (pan: number) => void;
  widthLabel: string; distLabel: string; label: string; personLabel: string; cameraLabel: string;
  fmM: (m: number) => string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [drag, setDrag] = useState<null | { kind: "person" | "pan"; R: number }>(null);
  const autoR = clamp(Math.max(p.d * 1.45, Math.abs(p.dx) * 1.6, 12), 12, 145);
  const R = drag?.R ?? autoR; // во время перетаскивания масштаб не прыгает
  const t = Math.tan(p.hfov / 2);
  const a = (p.pan * Math.PI) / 180;
  const dir = { x: Math.sin(a), y: -Math.cos(a) }, right = { x: Math.cos(a), y: Math.sin(a) };
  const at = (z: number, s: number) => ({ x: dir.x * z + right.x * s, y: dir.y * z + right.y * s });
  const pt = (q: { x: number; y: number }) => `${q.x.toFixed(2)},${q.y.toFixed(2)}`;
  const slice = (z0: number, z1: number) => [at(z0, -z0 * t), at(z1, -z1 * t), at(z1, z1 * t), at(z0, z0 * t)].map(pt).join(" ");

  // кадр 16 : 9, как у вида с камеры: высота сцены не прыгает при переключении
  const W = R, top = -R, bottom = R * 0.125;
  const far = R * 2.2;
  const fs = R * 0.04;
  const person = at(p.d, p.dx);
  const chordA = at(p.d, -p.d * t), chordB = at(p.d, p.d * t);
  const handle = at(R * 0.16, 0);
  const step = niceStep(R / 4);

  function toWorld(e: React.PointerEvent) {
    const svg = svgRef.current!;
    const m = svg.getScreenCTM();
    if (!m) return null;
    const q = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: q.x, y: q.y };
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!drag) return;
    const w = toWorld(e);
    if (!w) return;
    if (drag.kind === "person") {
      const dz = w.x * dir.x + w.y * dir.y, lx = w.x * right.x + w.y * right.y;
      p.onMove(clamp(Math.round(dz * 10) / 10, p.dMin, p.dMax), Math.round(lx * 10) / 10);
    } else {
      const deg = (Math.atan2(w.x, -w.y) * 180) / Math.PI;
      p.onPan(clamp(Math.round(deg), PAN_MIN, PAN_MAX));
    }
  }
  const start = (kind: "person" | "pan") => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDrag({ kind, R });
  };
  const stop = () => setDrag(null);

  const keyPerson = (e: React.KeyboardEvent) => {
    const k: Record<string, [number, number]> = { ArrowUp: [1, 0], ArrowDown: [-1, 0], ArrowLeft: [0, -0.5], ArrowRight: [0, 0.5] };
    const v = k[e.key];
    if (!v) return;
    e.preventDefault();
    p.onMove(clamp(p.d + v[0], p.dMin, p.dMax), p.dx + v[1]);
  };
  const keyPan = (e: React.KeyboardEvent) => {
    const v = e.key === "ArrowLeft" ? -5 : e.key === "ArrowRight" ? 5 : 0;
    if (!v) return;
    e.preventDefault();
    p.onPan(clamp(p.pan + v, PAN_MIN, PAN_MAX));
  };

  return (
    <svg ref={svgRef} viewBox={`${-W} ${top} ${2 * W} ${bottom - top}`} className="block h-auto w-full touch-none select-none bg-[#f8fafc]"
      role="img" aria-label={p.label} onPointerMove={onPointerMove} onPointerUp={stop} onPointerCancel={stop}>
      <defs>
        <pattern id="tv-grid" width={step / 2} height={step / 2} patternUnits="userSpaceOnUse">
          <path d={`M${step / 2} 0H0V${step / 2}`} fill="none" stroke="#e2e8f0" strokeWidth={R * 0.002} />
        </pattern>
      </defs>
      <rect x={-W} y={top} width={2 * W} height={bottom - top} fill="url(#tv-grid)" />
      {/* дальше последнего уровня — серым; полосы уровней — от ближней к дальней */}
      <polygon points={slice(0, far)} fill="#e2e8f0" />
      {[...p.bands].sort((x, y) => y.depth - x.depth).map((b) => (
        <polygon key={b.name} points={slice(0, Math.min(b.depth, far))} fill={b.color} fillOpacity=".9" />
      ))}
      <line x1="0" y1="0" x2={at(far, -far * t).x} y2={at(far, -far * t).y} stroke="#334155" strokeWidth={R * 0.004} />
      <line x1="0" y1="0" x2={at(far, far * t).x} y2={at(far, far * t).y} stroke="#334155" strokeWidth={R * 0.004} />
      <line x1="0" y1="0" x2={at(far, 0).x} y2={at(far, 0).y} stroke="#334155" strokeWidth={R * 0.003} strokeDasharray={`${R * 0.02} ${R * 0.015}`} opacity=".5" />

      {/* ширина обзора на дистанции человека */}
      <line x1={chordA.x} y1={chordA.y} x2={chordB.x} y2={chordB.y} stroke="#dc2626" strokeWidth={R * 0.007} />
      <text x={chordB.x + fs * 0.4} y={chordB.y - fs * 0.3} fontSize={fs} fontWeight="800" fill="#b91c1c" stroke="#fff" strokeWidth={fs * 0.22} paintOrder="stroke">
        {p.widthLabel}
      </text>

      {/* человек: перетаскивается */}
      <g role="slider" tabIndex={0} aria-label={p.personLabel} aria-valuemin={p.dMin} aria-valuemax={p.dMax} aria-valuenow={p.d} aria-valuetext={p.distLabel}
        onPointerDown={start("person")} onKeyDown={keyPerson} className="cursor-grab outline-none focus-visible:[&>circle:first-child]:stroke-brand-500" style={{ cursor: drag?.kind === "person" ? "grabbing" : "grab" }}>
        <circle cx={person.x} cy={person.y} r={fs * 1.3} fill="#fff" fillOpacity=".001" stroke="transparent" strokeWidth={fs * 0.3} />
        <circle cx={person.x} cy={person.y} r={fs * 0.62} fill="#dc2626" stroke="#fff" strokeWidth={fs * 0.18} />
        <text x={person.x} y={person.y + fs * 1.7} textAnchor="middle" fontSize={fs * 0.9} fontWeight="700" fill="#7f1d1d" stroke="#fff" strokeWidth={fs * 0.2} paintOrder="stroke">{p.distLabel}</text>
      </g>

      {/* камера и ручка поворота */}
      <line x1="0" y1="0" x2={handle.x} y2={handle.y} stroke="#0f172a" strokeWidth={R * 0.006} />
      <g role="slider" tabIndex={0} aria-label={p.cameraLabel} aria-valuemin={PAN_MIN} aria-valuemax={PAN_MAX} aria-valuenow={p.pan}
        onPointerDown={start("pan")} onKeyDown={keyPan} style={{ cursor: "grab" }} className="outline-none">
        <circle cx={handle.x} cy={handle.y} r={fs * 1.2} fill="transparent" />
        <circle cx={handle.x} cy={handle.y} r={fs * 0.45} fill="#fff" stroke="#0f172a" strokeWidth={fs * 0.16} />
      </g>
      <rect x={-fs * 0.7} y={-fs * 0.45} width={fs * 1.4} height={fs * 0.9} rx={fs * 0.2} fill="#0f172a" transform={`rotate(${p.pan})`} />

      {/* масштаб */}
      <g transform={`translate(${-W + fs}, ${bottom - fs * 0.9})`}>
        <line x1="0" y1="0" x2={step} y2="0" stroke="#64748b" strokeWidth={R * 0.004} />
        <line x1="0" y1={-fs * 0.3} x2="0" y2={fs * 0.1} stroke="#64748b" strokeWidth={R * 0.004} />
        <line x1={step} y1={-fs * 0.3} x2={step} y2={fs * 0.1} stroke="#64748b" strokeWidth={R * 0.004} />
        <text x={step + fs * 0.4} y={fs * 0.3} fontSize={fs * 0.85} fill="#475569">{p.fmM(step)}</text>
      </g>
    </svg>
  );
}
