/**
 * Геометрия камер на плане объекта (этап C). Чистые функции: их гоняют тесты, воркер анализа
 * и редактор.
 *
 * Система координат плана — метры: x вправо, y вниз (как у картинки плана), z вверх.
 * Курс камеры (pan) — угол от оси +x по часовой стрелке на экране; наклон (tilt) — вниз от
 * горизонта. Анализ идёт на плоскости цели высотой targetM (по умолчанию 1,6 м — уровень лица,
 * как в калькуляторе): плотность пикселей стандарта относится к объекту, а не к полу.
 *
 * Модель — та же прямолинейная (pinhole) оптика, что в калькуляторе: глубина точки — по
 * оптической оси, плотность = Nx / (2·глубина·tan(H/2)). Стены — отрезки бесконечной высоты:
 * это 2D-оценка, высота преград не учитывается (в интерфейсе — явная пометка).
 */
import { rad } from "../optics";

export type Vec2 = { x: number; y: number };
export type Segment = [Vec2, Vec2];

/** Камера, готовая к расчёту: положение, установка и оптика в текущем положении зума. */
export type CamPose = {
  x: number;
  y: number;
  mountM: number;
  panDeg: number;
  tiltDeg: number;
  hfovDeg: number;
  vfovDeg: number;
  nx: number;
};

/** Базис камеры: ось взгляда f, вправо r, вверх u (ортонормированный, без завала горизонта). */
export type Frame = {
  cx: number; cy: number; cz: number;
  f: [number, number, number];
  r: [number, number, number];
  u: [number, number, number];
  tu: number; // tan(H/2)
  tv: number; // tan(V/2)
  nx: number;
  tilt: number;
  /** Превышение камеры над плоскостью цели, м. */
  dh: number;
};

export function frameOf(c: CamPose, targetM: number): Frame | null {
  const dh = c.mountM - targetM;
  if (!(dh > 0) || !(c.hfovDeg > 0 && c.hfovDeg < 180) || !(c.vfovDeg > 0 && c.vfovDeg < 180) || !(c.nx > 0)) return null;
  const th = rad(c.panDeg), t = rad(Math.min(89.9, Math.max(0, c.tiltDeg)));
  const ct = Math.cos(t), st = Math.sin(t), cp = Math.cos(th), sp = Math.sin(th);
  return {
    cx: c.x, cy: c.y, cz: c.mountM,
    f: [ct * cp, ct * sp, -st],
    r: [-sp, cp, 0],
    u: [st * cp, st * sp, ct],
    tu: Math.tan(rad(c.hfovDeg) / 2),
    tv: Math.tan(rad(c.vfovDeg) / 2),
    nx: c.nx,
    tilt: t,
    dh,
  };
}

/**
 * Точка плоскости цели в кадре камеры: глубина по оси и плотность px/m. null — точка вне
 * кадра (за камерой, левее/правее, выше/ниже кадра).
 */
export function sample(fr: Frame, px: number, py: number, targetM: number): { depth: number; ppm: number } | null {
  const vx = px - fr.cx, vy = py - fr.cy, vz = targetM - fr.cz;
  const depth = vx * fr.f[0] + vy * fr.f[1] + vz * fr.f[2];
  if (!(depth > 1e-9)) return null;
  const u = (vx * fr.r[0] + vy * fr.r[1]) / depth;
  const w = (vx * fr.u[0] + vy * fr.u[1] + vz * fr.u[2]) / depth;
  if (Math.abs(u) > fr.tu * (1 + 1e-12) || Math.abs(w) > fr.tv * (1 + 1e-12)) return null;
  return { depth, ppm: fr.nx / (2 * fr.tu * depth) };
}

/** Глубина по оси, до которой плотность не ниже ppm (то же, что depthForPpm калькулятора). */
export const depthLimit = (fr: Frame, ppm: number) => fr.nx / (2 * fr.tu * ppm);

/**
 * Вертикальная координата кадра (w = tan угла от оси вверх), выше которой точки плоскости
 * цели дальше глубины D. Глубина точки на луче через (u, w) равна dh / (sin τ − w·cos τ) —
 * от u она не зависит, поэтому граница «дальше D» — горизонтальная линия кадра.
 */
const wForDepth = (fr: Frame, d: number) => (Math.sin(fr.tilt) - fr.dh / d) / Math.cos(fr.tilt);

/** Точка плоскости цели, куда смотрит направление кадра (u, w). null — луч не идёт вниз. */
function groundAt(fr: Frame, u: number, w: number): Vec2 | null {
  const dz = fr.f[2] + u * fr.r[2] + w * fr.u[2];
  if (!(dz < -1e-12)) return null;
  const s = -fr.dh / dz;
  return { x: fr.cx + s * (fr.f[0] + u * fr.r[0] + w * fr.u[0]), y: fr.cy + s * (fr.f[1] + u * fr.r[1] + w * fr.u[1]) };
}

/**
 * Полоса плоскости цели, где глубина по оси в пределах (dNear, dFar]: трапеция (4 точки)
 * или null, если полоса вне кадра. dNear = 0 — от ближней кромки кадра.
 * Так строятся контур зоны обзора (dFar — предел самого грубого уровня) и полосы уровней.
 */
export function band(fr: Frame, dNear: number, dFar: number): Vec2[] | null {
  const lo = dNear > 0 ? Math.max(-fr.tv, wForDepth(fr, dNear)) : -fr.tv;
  const hi = Math.min(fr.tv, wForDepth(fr, dFar));
  if (!(hi > lo)) return null;
  const pts = [groundAt(fr, -fr.tu, lo), groundAt(fr, fr.tu, lo), groundAt(fr, fr.tu, hi), groundAt(fr, -fr.tu, hi)];
  return pts.every(Boolean) ? (pts as Vec2[]) : null;
}

/** Линия на плоскости цели, где глубина по оси ровно d (граница уровня); null — она вне кадра. */
export function depthEdge(fr: Frame, d: number): Segment | null {
  const w = wForDepth(fr, d);
  if (!(w > -fr.tv && w < fr.tv)) return null;
  const a = groundAt(fr, -fr.tu, w), b = groundAt(fr, fr.tu, w);
  return a && b ? [a, b] : null;
}

/** Горизонтальная дальность от камеры до ближней кромки кадра на плоскости цели (слепая зона). */
export function blindRadius(fr: Frame): number {
  const lower = fr.tilt + Math.atan(fr.tv);
  return lower >= Math.PI / 2 ? 0 : fr.dh / Math.tan(lower);
}

/** Наклон, при котором ось смотрит в точку плоскости цели на горизонтальной дальности d. */
export const tiltForAim = (mountM: number, targetM: number, dM: number) =>
  dM > 0 && mountM > targetM ? (Math.atan((mountM - targetM) / dM) * 180) / Math.PI : 0;

/** Горизонтальная дальность точки прицеливания при наклоне tilt; Infinity при tilt = 0. */
export const aimDistance = (mountM: number, targetM: number, tiltDeg: number) =>
  tiltDeg > 0 && mountM > targetM ? (mountM - targetM) / Math.tan(rad(tiltDeg)) : Infinity;

/* ───────────── 2D-утилиты ───────────── */

/** Пересекаются ли отрезки ab и cd (касание концом считается пересечением). */
export function segmentsCross(a: Vec2, b: Vec2, c: Vec2, d: Vec2): boolean {
  const d1 = cross(c, d, a), d2 = cross(c, d, b), d3 = cross(a, b, c), d4 = cross(a, b, d);
  if (((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))) return true;
  const eps = 1e-12;
  return (Math.abs(d1) < eps && onSeg(c, d, a)) || (Math.abs(d2) < eps && onSeg(c, d, b))
    || (Math.abs(d3) < eps && onSeg(a, b, c)) || (Math.abs(d4) < eps && onSeg(a, b, d));
}
const cross = (o: Vec2, a: Vec2, b: Vec2) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
const onSeg = (a: Vec2, b: Vec2, p: Vec2) =>
  Math.min(a.x, b.x) - 1e-12 <= p.x && p.x <= Math.max(a.x, b.x) + 1e-12 && Math.min(a.y, b.y) - 1e-12 <= p.y && p.y <= Math.max(a.y, b.y) + 1e-12;

/** Видна ли точка p из точки c, если стены — отрезки (2D, высота стен не учитывается). */
export function visible(c: Vec2, p: Vec2, walls: Segment[]): boolean {
  for (const [a, b] of walls) if (segmentsCross(c, p, a, b)) return false;
  return true;
}

/** Точка внутри многоугольника (чётность пересечений). */
export function inPolygon(p: Vec2, poly: Vec2[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

/** Площадь многоугольника (формула шнурования), м². */
export function polygonArea(poly: Vec2[]): number {
  let s = 0;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) s += (poly[j].x + poly[i].x) * (poly[j].y - poly[i].y);
  return Math.abs(s) / 2;
}

export const dist = (a: Vec2, b: Vec2) => Math.hypot(a.x - b.x, a.y - b.y);
