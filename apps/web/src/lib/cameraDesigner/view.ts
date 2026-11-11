/**
 * Сцена «Вид с камеры» (редизайн 11.11.2026): куда смотрит камера и где в кадре оказывается
 * точка мира. Камера — пинхол с углами и разрешением расчёта (Optics), координаты кадра —
 * в пикселях матрицы, поэтому человек в сцене получается ровно таким, каким его даёт расчёт.
 *
 * Мир: X — вправо, Y — вверх от земли, Z — вперёд по горизонтали от камеры (м).
 * Простой режим (дистанция по оси): камера на высоте hc смотрит на грудь человека (1,2 м),
 * и до этой точки по оси ровно d — та же глубина, по которой считается плотность.
 * С высотой и наклоном («Для специалистов»): высота и наклон — из ввода, человек — на
 * горизонтальной дистанции d, как в расчёте с geo.
 */
import type { Optics } from "./optics";

export const PERSON_H = 1.75;
const AIM_H = 1.2;
const SIMPLE_MOUNT = 2.5;

export type Pose = {
  /** Высота камеры, м. */
  hc: number;
  /** Наклон вниз от горизонта, рад. */
  pitch: number;
  /** Горизонтальная дистанция до человека, м. */
  personZ: number;
};

export function poseFor(p: { d: number; geo: boolean; mount: number; tiltDeg: number }): Pose {
  if (p.geo) return { hc: p.mount, pitch: (p.tiltDeg * Math.PI) / 180, personZ: p.d };
  // на коротких дистанциях камеру опускаем, чтобы наклон оставался разумным (не круче ≈37°)
  const hc = Math.min(SIMPLE_MOUNT, AIM_H + 0.6 * p.d);
  const pitch = Math.asin((hc - AIM_H) / p.d);
  return { hc, pitch, personZ: Math.sqrt(p.d * p.d - (hc - AIM_H) ** 2) };
}

export type Projector = {
  /** Точка мира → пиксели кадра (x вправо, y вниз) и глубина по оси; null — позади камеры. */
  project: (x: number, y: number, z: number) => { x: number; y: number; depth: number } | null;
  /** Строка горизонта в пикселях кадра (может быть выше кадра). */
  horizonY: number;
  fx: number;
  fy: number;
};

export function projector(o: Optics, pose: Pose): Projector {
  const fx = o.nx / 2 / Math.tan(o.hfov / 2);
  const fy = o.ny / 2 / Math.tan(o.vfov / 2);
  const s = Math.sin(pose.pitch), c = Math.cos(pose.pitch);
  return {
    fx, fy,
    horizonY: o.ny / 2 - fy * Math.tan(pose.pitch),
    project(x, y, z) {
      const vy = y - pose.hc;
      const depth = z * c - vy * s; // проекция на ось взгляда (вперёд и вниз)
      if (depth <= 1e-3) return null;
      const up = vy * c + z * s; // вверх в системе камеры
      return { x: o.nx / 2 + (fx * x) / depth, y: o.ny / 2 - (fy * up) / depth, depth };
    },
  };
}

/**
 * Где в кадре человек: прямоугольник от макушки до подошв на смещении dx вбок.
 * null — позади камеры. Плотность растра берётся из расчёта (ppm на глубине оси).
 */
export function personBox(pr: Projector, pose: Pose, dx: number) {
  const head = pr.project(dx, PERSON_H, pose.personZ);
  const feet = pr.project(dx, 0, pose.personZ);
  if (!head || !feet) return null;
  const h = feet.y - head.y;
  return { x: head.x, top: head.y, bottom: feet.y, h, depth: (head.depth + feet.depth) / 2 };
}
