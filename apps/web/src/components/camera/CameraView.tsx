"use client";

/**
 * «Вид с камеры» (редизайн 11.11.2026): условный двор со входом в здание глазами камеры.
 * Рисунок — в пикселях матрицы (viewBox = разрешение кадра), геометрия — пинхол из расчёта
 * (lib/cameraDesigner/view.ts). Человек — растр с той плотностью, которую даёт расчёт на его
 * глубине: на 50 м он честно собран из нескольких десятков пикселей. Это инженерная имитация,
 * подпись об этом — под сценой.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import type { Optics } from "@/lib/cameraDesigner/optics";
import { BODY_FRAME, HEAD_FRAME, PORTRAIT_BG, paintBody, paintHead, rasterize } from "@/lib/cameraDesigner/portraitPaint";
import { personBox, poseFor, projector, type Pose } from "@/lib/cameraDesigner/view";

/** Растр → data URI (только в браузере). Крупнее cap пикселей по высоте не рисуем: экран всё равно мельче. */
function useRaster(kind: "body" | "head", w: number, h: number) {
  const [uri, setUri] = useState<string | null>(null);
  useEffect(() => {
    if (!(w > 0 && h > 0)) { setUri(null); return; }
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const px = kind === "body"
      ? rasterize(paintBody, BODY_FRAME.w, BODY_FRAME.h, w, h)
      : rasterize(paintHead, HEAD_FRAME.w, HEAD_FRAME.h, w, h, PORTRAIT_BG);
    ctx.putImageData(new ImageData(new Uint8ClampedArray(px), w, h), 0, 0);
    setUri(c.toDataURL());
  }, [kind, w, h]);
  return uri;
}

const CAP_BODY = 700, CAP_HEAD = 220;
const r1 = (n: number) => Math.round(n * 10) / 10;

export function CameraView(p: {
  o: Optics;
  d: number; geo: boolean; mount: number; tiltDeg: number;
  /** Смещение человека вбок от оси, м (вид сверху). */
  dx: number;
  label: string;
  faceLabel: (w: number, h: number) => string;
  frameLabel: string;
  outsideLabel: string;
  distLabel: (m: number) => string;
}) {
  const { o } = p;
  const pose: Pose = useMemo(() => poseFor({ d: p.d, geo: p.geo, mount: p.mount, tiltDeg: p.tiltDeg }), [p.d, p.geo, p.mount, p.tiltDeg]);
  const pr = useMemo(() => projector(o, pose), [o, pose]);
  const { nx, ny } = o;

  const box = personBox(pr, pose, p.dx);
  // плотность на глубине человека: пикселей на метр поперёк оси
  const ppmX = box ? pr.fx / box.depth : 0, ppmY = box ? pr.fy / box.depth : 0;
  const bodyTrueH = Math.max(1, Math.round(BODY_FRAME.h * ppmY));
  const k = Math.min(1, CAP_BODY / bodyTrueH);
  const body = useRaster("body", Math.max(1, Math.round(BODY_FRAME.w * ppmX * k)), Math.max(1, Math.round(bodyTrueH * k)));
  const faceW = Math.max(1, Math.round(HEAD_FRAME.w * ppmX)), faceH = Math.max(1, Math.round(HEAD_FRAME.h * ppmY));
  const kf = Math.min(1, CAP_HEAD / faceH);
  const face = useRaster("head", Math.max(1, Math.round(faceW * kf)), Math.max(1, Math.round(faceH * kf)));
  const inFrame = !!box && box.x > -0.3 * ppmX && box.x < nx + 0.3 * ppmX && box.bottom > 0 && box.top < ny;

  // ── условный двор: плитка с сеткой 1 м, здание со входом за человеком, фонари ──
  const geom = useMemo(() => {
    const P = (x: number, y: number, z: number) => pr.project(x, y, z);
    const seg = (a: ReturnType<typeof P>, b: ReturnType<typeof P>) => (a && b ? `M${r1(a.x)} ${r1(a.y)}L${r1(b.x)} ${r1(b.y)}` : "");
    const poly = (pts: [number, number, number][]) => {
      const q = pts.map(([x, y, z]) => P(x, y, z));
      return q.every(Boolean) ? q.map((v) => `${r1(v!.x)},${r1(v!.y)}`).join(" ") : "";
    };
    const zb = Math.max(pose.personZ + 8, 20); // фасад — за человеком
    const thin: string[] = [], bold: string[] = [];
    for (let z = 1; z < zb; z += 1) (z % 5 === 0 ? bold : thin).push(seg(P(-60, 0, z), P(60, 0, z)));
    for (let x = -40; x <= 40; x += 1) (x % 5 === 0 ? bold : thin).push(seg(P(x, 0, 0.05), P(x, 0, zb)));
    const windows: string[] = [];
    for (const [y0, y1] of [[3.2, 4.8], [6.4, 8]] as const) for (let x = -38; x <= 36; x += 4) if (!(y0 < 4 && x > -3 && x < 2)) windows.push(poly([[x, y0, zb], [x + 2, y0, zb], [x + 2, y1, zb], [x, y1, zb]]));
    const lamps = [6, 18, 30].filter((z) => z < zb).flatMap((z) => [-7, 7].map((x) => ({ s: seg(P(x, 0, z), P(x, 4.2, z)), top: P(x, 4.2, z) })));
    const marks = [5, 10, 20, 50, 100].filter((z) => z < zb).map((z) => {
      const ground = P(0, 0, z);
      if (!ground || ground.y < pr.horizonY + ny * 0.02 || ground.y > ny) return null;
      return { z, y: ground.y };
    }).filter(Boolean) as { z: number; y: number }[];
    return {
      wall: poly([[-60, 0, zb], [60, 0, zb], [60, 11, zb], [-60, 11, zb]]),
      door: poly([[-1, 0, zb], [1, 0, zb], [1, 2.4, zb], [-1, 2.4, zb]]),
      canopy: poly([[-2.2, 2.6, zb], [2.2, 2.6, zb], [2.2, 3, zb], [-2.2, 3, zb]]),
      windows, lamps, marks,
      thin: thin.join(""), bold: bold.join(""),
    };
  }, [pr, pose, ny]);

  const hz = Math.max(0, Math.min(ny, pr.horizonY));
  // подписи на земле — не мельче 12 px на экране (на телефоне кадр в 10 раз меньше матрицы)
  const boxRef = useRef<HTMLDivElement>(null);
  const [cssW, setCssW] = useState(0);
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setCssW(e.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const font = Math.max(ny * 0.03, cssW ? (12 * nx) / cssW : 0);

  return (
    <div ref={boxRef} className="relative">
      <svg viewBox={`0 0 ${nx} ${ny}`} className="block h-auto w-full bg-[#dbeafe]" role="img" aria-label={p.label}>
        <defs>
          <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#bfdbfe" /><stop offset="1" stopColor="#eff6ff" /></linearGradient>
          <linearGradient id="cv-ground" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#d6dde5" /><stop offset="1" stopColor="#c3ccd6" /></linearGradient>
          <clipPath id="cv-frame"><rect width={nx} height={ny} /></clipPath>
        </defs>
        <g clipPath="url(#cv-frame)">
          <rect width={nx} height={ny} fill="url(#cv-sky)" />
          <rect y={hz} width={nx} height={ny - hz} fill="url(#cv-ground)" />
          <path d={geom.thin} stroke="#aab6c3" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
          <path d={geom.bold} stroke="#8b9aab" strokeWidth="1.6" vectorEffect="non-scaling-stroke" fill="none" />
          {geom.wall ? <polygon points={geom.wall} fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" /> : null}
          {geom.windows.map((w, i) => (w ? <polygon key={i} points={w} fill="#93c5fd" stroke="#64748b" strokeWidth="1" vectorEffect="non-scaling-stroke" /> : null))}
          {geom.door ? <polygon points={geom.door} fill="#475569" /> : null}
          {geom.canopy ? <polygon points={geom.canopy} fill="#1e3a5f" /> : null}
          {geom.lamps.map((l, i) => (
            <g key={i}>
              <path d={l.s} stroke="#334155" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
              {l.top ? <circle cx={l.top.x} cy={l.top.y} r={Math.max(2, ny * 0.006)} fill="#fbbf24" /> : null}
            </g>
          ))}
          {geom.marks.map((m) => (
            <text key={m.z} x={nx * 0.025} y={m.y - font * 0.25} fontSize={font} fontWeight="700" fill="#334155" stroke="#fff" strokeWidth={font * 0.18} paintOrder="stroke">
              {p.distLabel(m.z)}
            </text>
          ))}
          {box && body ? (
            <image href={body} x={box.x - (BODY_FRAME.w * ppmX) / 2} y={box.top} width={BODY_FRAME.w * ppmX} height={box.h}
              preserveAspectRatio="none" style={{ imageRendering: "pixelated" }} />
          ) : null}
        </g>
      </svg>

      {/* подписи поверх сцены — сверху: снизу справа их закрывала кнопка чата (живая проверка 12.11) */}
      <div className="pointer-events-none absolute left-2 top-2 rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-bold tabular-nums text-slate-800 shadow-sm sm:left-3 sm:top-3 sm:text-xs">
        {p.frameLabel}
      </div>
      {inFrame && face ? (
        <figure className="pointer-events-none absolute right-2 top-2 overflow-hidden rounded-lg border border-white/80 bg-white shadow-md sm:right-3 sm:top-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={face} alt="" className="block h-[60px] w-[48px] sm:h-[120px] sm:w-[96px]" style={{ imageRendering: "pixelated" }} />
          <figcaption className="max-w-[48px] px-0.5 py-0.5 text-center text-[8px] font-bold leading-tight tabular-nums text-slate-700 sm:max-w-[96px] sm:px-1.5 sm:text-[10px]">{p.faceLabel(faceW, faceH)}</figcaption>
        </figure>
      ) : null}
      {!inFrame ? (
        <div role="status" className="absolute inset-x-3 top-12 rounded-lg bg-amber-50/95 px-3 py-2 text-xs font-semibold text-amber-900 shadow-sm sm:top-14 sm:right-auto sm:max-w-[60%]">{p.outsideLabel}</div>
      ) : null}
    </div>
  );
}
