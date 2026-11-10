/**
 * Растровый анализ плана (этап C): для каждой клетки сетки на плоскости цели — лучший уровень
 * детализации среди всех камер и сколько камер её видят. По сетке же считается процент
 * покрытия зон охраны. Чистая функция — её запускает воркер, а тесты проверяют на простых сценах.
 *
 * Клетка оценивается по центру. Плотность — горизонтальная px/m на объекте (как в калькуляторе
 * и в IEC 62676-4), стены режут обзор как 2D-отрезки.
 */
import { depthLimit, frameOf, inPolygon, polygonArea, sample, segmentsCross, type CamPose, type Segment, type Vec2 } from "./geometry";

export type AnalysisInput = {
  /** Границы анализа на плане, м. */
  bounds: { x: number; y: number; w: number; h: number };
  /** Предел числа клеток: размер клетки подбирается под него. */
  maxCells: number;
  targetM: number;
  cams: CamPose[];
  walls: Segment[];
  zones: Vec2[][];
  /** Пороги уровней по возрастанию px/m (выбранный профиль). */
  levelsPpm: number[];
};

export type AnalysisResult = {
  cols: number;
  rows: number;
  cell: number;
  /** 0 — не видно ни одной камерой на самом грубом уровне; k — достигнут уровень levelsPpm[k-1]. */
  best: Uint8Array;
  /** Сколько камер видят клетку хотя бы на самом грубом уровне (обрезано до 255). */
  count: Uint8Array;
  /** Зоны охраны: площадь и доля площади, где достигнут уровень k (индекс как в levelsPpm). */
  zones: { areaM2: number; cellsAreaM2: number; share: number[]; overlap: number }[];
};

export function cellSizeFor(b: { w: number; h: number }, maxCells: number) {
  return Math.max(Math.sqrt((b.w * b.h) / Math.max(1, maxCells)), 0.01);
}

export function analyze(inp: AnalysisInput): AnalysisResult {
  const { bounds: B, targetM, levelsPpm } = inp;
  const cell = cellSizeFor(B, inp.maxCells);
  const cols = Math.max(1, Math.ceil(B.w / cell)), rows = Math.max(1, Math.ceil(B.h / cell));
  const best = new Uint8Array(cols * rows);
  const count = new Uint8Array(cols * rows);
  const minPpm = levelsPpm[0];

  for (const cam of inp.cams) {
    const fr = frameOf(cam, targetM);
    if (!fr || !(minPpm > 0)) continue;
    // Дальше глубины dMax не достигается даже самый грубый уровень. Расстояние до точки кадра
    // = глубина·√(1 + u² + w²) ≤ dMax·√(1 + tu² + tv²) — этим кругом и ограничиваем обход клеток.
    const dMax = depthLimit(fr, minPpm);
    const rad = dMax * Math.sqrt(1 + fr.tu * fr.tu + fr.tv * fr.tv);
    const x0 = Math.max(0, Math.floor((cam.x - rad - B.x) / cell)), x1 = Math.min(cols - 1, Math.ceil((cam.x + rad - B.x) / cell));
    const y0 = Math.max(0, Math.floor((cam.y - rad - B.y) / cell)), y1 = Math.min(rows - 1, Math.ceil((cam.y + rad - B.y) / cell));
    if (x0 > x1 || y0 > y1) continue;
    const c: Vec2 = { x: cam.x, y: cam.y };
    // стены, которые вообще могут встать между камерой и её зоной
    const bx0 = cam.x - rad, bx1 = cam.x + rad, by0 = cam.y - rad, by1 = cam.y + rad;
    const walls = inp.walls.filter(([a, b]) => !(Math.max(a.x, b.x) < bx0 || Math.min(a.x, b.x) > bx1 || Math.max(a.y, b.y) < by0 || Math.min(a.y, b.y) > by1));
    for (let iy = y0; iy <= y1; iy++) {
      const py = B.y + (iy + 0.5) * cell;
      for (let ix = x0; ix <= x1; ix++) {
        const px = B.x + (ix + 0.5) * cell;
        const s = sample(fr, px, py, targetM);
        if (!s || s.ppm < minPpm) continue;
        let blocked = false;
        if (walls.length) {
          const p = { x: px, y: py };
          for (const [a, b] of walls) if (segmentsCross(c, p, a, b)) { blocked = true; break; }
        }
        if (blocked) continue;
        let lv = 0;
        while (lv < levelsPpm.length && s.ppm >= levelsPpm[lv]) lv++;
        const k = iy * cols + ix;
        if (lv > best[k]) best[k] = lv;
        if (count[k] < 255) count[k]++;
      }
    }
  }

  const zones = inp.zones.map((poly) => {
    const share = levelsPpm.map(() => 0);
    let n = 0, ov = 0;
    if (poly.length >= 3) {
      let mx0 = Infinity, mx1 = -Infinity, my0 = Infinity, my1 = -Infinity;
      for (const p of poly) { mx0 = Math.min(mx0, p.x); mx1 = Math.max(mx1, p.x); my0 = Math.min(my0, p.y); my1 = Math.max(my1, p.y); }
      const x0 = Math.max(0, Math.floor((mx0 - B.x) / cell)), x1 = Math.min(cols - 1, Math.floor((mx1 - B.x) / cell));
      const y0 = Math.max(0, Math.floor((my0 - B.y) / cell)), y1 = Math.min(rows - 1, Math.floor((my1 - B.y) / cell));
      for (let iy = y0; iy <= y1; iy++) for (let ix = x0; ix <= x1; ix++) {
        if (!inPolygon({ x: B.x + (ix + 0.5) * cell, y: B.y + (iy + 0.5) * cell }, poly)) continue;
        n++;
        const k = iy * cols + ix;
        for (let l = 0; l < best[k]; l++) share[l]++;
        if (count[k] >= 2) ov++;
      }
    }
    return {
      areaM2: polygonArea(poly),
      cellsAreaM2: n * cell * cell,
      share: share.map((v) => (n ? v / n : 0)),
      overlap: n ? ov / n : 0,
    };
  });

  return { cols, rows, cell, best, count, zones };
}
