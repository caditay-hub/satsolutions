/**
 * Векторный слой плана: камеры, контуры зон обзора, стены, зоны охраны, черновик рисования.
 * Без обработчиков событий — их вешает PlanCanvas по data-атрибутам. Поэтому тот же компонент
 * рисует и экспорт PNG/печать (с другим k).
 *
 * k — сколько метров плана приходится на экранный пиксель: размеры значков и подписей заданы
 * в пикселях и не зависят от масштаба плана.
 */
import { aimDistance, band, depthEdge, depthLimit, frameOf, type Vec2 } from "@/lib/cameraDesigner/plan/geometry";
import { poseOf, type PlanProject } from "@/lib/cameraDesigner/plan/project";
import { levelColor } from "@/lib/cameraDesigner/palette";

export type Selection = { type: "cam"; id: string } | { type: "wall"; i: number } | { type: "zone"; i: number } | null;
export type Draft = { kind: "wall" | "zone" | "scale"; pts: Vec2[]; cursor: Vec2 | null } | null;

const pts = (p: Vec2[]) => p.map((q) => `${q.x},${q.y}`).join(" ");

export function aimPoint(c: { x: number; y: number; mountM: number; panDeg: number; tiltDeg: number }, targetM: number, maxR: number): Vec2 {
  const d = Math.min(aimDistance(c.mountM, targetM, c.tiltDeg), maxR);
  const a = (c.panDeg * Math.PI) / 180;
  return { x: c.x + d * Math.cos(a), y: c.y + d * Math.sin(a) };
}

export function PlanVectors(p: {
  project: PlanProject;
  bounds: { x: number; y: number; w: number; h: number };
  k: number;
  levelsPpm: number[];
  camLabel: (n: number) => string;
  zoneLabel: (n: number) => string;
  selected?: Selection;
  draft?: Draft;
  /** Экспорт: без ручек и черновика. */
  still?: boolean;
}) {
  const { project: pr, k, levelsPpm } = p;
  const diag = Math.hypot(p.bounds.w, p.bounds.h);
  const minPpm = levelsPpm[0];
  const sel = p.selected;
  const n = levelsPpm.length;

  const B = p.bounds;
  return (
    <g>
      {/* контуры обзора обрезаем по плану: за его краем расчёт покрытия не ведётся */}
      <clipPath id="cd-plan-clip"><rect x={B.x} y={B.y} width={B.w} height={B.h} /></clipPath>
      {pr.zones.map((z, i) => {
        const on = sel?.type === "zone" && sel.i === i;
        const c = z.reduce((s, q) => ({ x: s.x + q.x / z.length, y: s.y + q.y / z.length }), { x: 0, y: 0 });
        return (
          <g key={`z${i}`} data-zone={i} style={{ cursor: p.still ? undefined : "pointer" }}>
            <polygon points={pts(z)} fill="rgba(220,38,38,0.04)" stroke={on ? "#b91c1c" : "#dc2626"} strokeWidth={on ? 3 : 2}
              strokeDasharray="8 5" vectorEffect="non-scaling-stroke" />
            <text x={c.x} y={c.y} fontSize={12 * k} fontWeight={700} fill="#b91c1c" textAnchor="middle" dominantBaseline="middle"
              stroke="#fff" strokeWidth={3 * k} paintOrder="stroke">{p.zoneLabel(i + 1)}</text>
          </g>
        );
      })}

      {pr.walls.map(([a, b], i) => {
        const on = sel?.type === "wall" && sel.i === i;
        return (
          <g key={`w${i}`} data-wall={i} style={{ cursor: p.still ? undefined : "pointer" }}>
            {/* широкая прозрачная линия — чтобы в стену было легко попасть пальцем */}
            {!p.still ? <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth={16} vectorEffect="non-scaling-stroke" /> : null}
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={on ? "#f59e0b" : "#0f172a"} strokeWidth={on ? 5 : 4} strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}

      {/* шкаф и трассы кабеля до камер (по осям — так же считает смета) */}
      {pr.rack ? (
        <g pointerEvents="none">
          {pr.cams.map((c) => (
            <polyline key={`r${c.id}`} points={`${pr.rack!.x},${pr.rack!.y} ${c.x},${pr.rack!.y} ${c.x},${c.y}`} fill="none" stroke="#64748b"
              strokeOpacity={0.55} strokeWidth={1} strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
          ))}
          <rect x={pr.rack.x - 9 * k} y={pr.rack.y - 9 * k} width={18 * k} height={18 * k} rx={3 * k} fill="#334155" stroke="#fff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <path d={`M ${pr.rack.x - 5 * k} ${pr.rack.y - 3 * k} h ${10 * k} M ${pr.rack.x - 5 * k} ${pr.rack.y + 1 * k} h ${10 * k} M ${pr.rack.x - 5 * k} ${pr.rack.y + 5 * k} h ${10 * k}`} stroke="#fff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
        </g>
      ) : null}

      {pr.cams.map((c) => {
        const pose = poseOf(c);
        const fr = pose ? frameOf(pose, pr.targetM) : null;
        const on = sel?.type === "cam" && sel.id === c.id;
        const outline = fr ? band(fr, 0, depthLimit(fr, minPpm)) : null;
        const aim = aimPoint(c, pr.targetM, diag);
        const r = 11 * k;
        const a = (c.panDeg * Math.PI) / 180;
        return (
          <g key={c.id}>
            <g clipPath="url(#cd-plan-clip)">
              {outline ? (
                <polygon points={pts(outline)} fill="none" stroke={on ? "#0369a1" : "#0e7490"} strokeOpacity={on ? 1 : 0.7}
                  strokeWidth={on ? 2 : 1.25} vectorEffect="non-scaling-stroke" />
              ) : null}
              {on && fr ? levelsPpm.map((ppm, i) => {
                const e = depthEdge(fr, depthLimit(fr, ppm));
                return e ? (
                  <line key={ppm} x1={e[0].x} y1={e[0].y} x2={e[1].x} y2={e[1].y} stroke={levelColor(n - 1 - i, n)} strokeWidth={2}
                    strokeDasharray="6 4" vectorEffect="non-scaling-stroke" />
                ) : null;
              }) : null}
            </g>
            {on && !p.still ? (
              <>
                <line x1={c.x} y1={c.y} x2={aim.x} y2={aim.y} stroke="#2563eb" strokeWidth={1.5} strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                <circle data-aim={c.id} cx={aim.x} cy={aim.y} r={9 * k} fill="#2563eb" stroke="#fff" strokeWidth={2} vectorEffect="non-scaling-stroke" style={{ cursor: "grab" }} />
              </>
            ) : null}
            <g data-cam={c.id} style={{ cursor: p.still ? undefined : "move" }}>
              {/* направление взгляда — «нос» значка */}
              <path d={`M ${c.x + Math.cos(a) * r * 1.9} ${c.y + Math.sin(a) * r * 1.9} L ${c.x + Math.cos(a + 0.6) * r} ${c.y + Math.sin(a + 0.6) * r} L ${c.x + Math.cos(a - 0.6) * r} ${c.y + Math.sin(a - 0.6) * r} Z`}
                fill={fr ? "#0e7490" : "#dc2626"} />
              <circle cx={c.x} cy={c.y} r={r} fill={fr ? (on ? "#0369a1" : "#0e7490") : "#dc2626"} stroke="#fff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
              <text x={c.x} y={c.y} fontSize={10 * k} fontWeight={800} fill="#fff" textAnchor="middle" dominantBaseline="central">{p.camLabel(c.n)}</text>
            </g>
          </g>
        );
      })}

      {p.draft && !p.still ? (
        <g pointerEvents="none">
          <polyline points={pts(p.draft.cursor ? [...p.draft.pts, p.draft.cursor] : p.draft.pts)} fill="none"
            stroke={p.draft.kind === "zone" ? "#dc2626" : p.draft.kind === "scale" ? "#7c3aed" : "#0f172a"} strokeWidth={p.draft.kind === "wall" ? 4 : 2}
            strokeDasharray={p.draft.kind === "wall" ? undefined : "6 4"} vectorEffect="non-scaling-stroke" />
          {p.draft.pts.map((q, i) => <circle key={i} cx={q.x} cy={q.y} r={5 * k} fill="#fff" stroke="#0f172a" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />)}
        </g>
      ) : null}
    </g>
  );
}
