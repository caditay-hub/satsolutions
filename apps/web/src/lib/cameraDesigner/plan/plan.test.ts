import { describe, expect, it } from "vitest";
import { analyze } from "./analysis";
import { aimDistance, band, blindRadius, depthEdge, frameOf, inPolygon, polygonArea, sample, segmentsCross, tiltForAim, visible, type CamPose, type Vec2 } from "./geometry";
import { cableRun, emptyProject, isPlanImageUrl, opticsAt, parseProject, poseOf, rescaleProject, type CamSpec, type PlanCamera } from "./project";
import { depthAtGround, depthForPpm, opticsFromFov, sideGeometry, varifocalAt } from "../optics";

const T = 1.6;
const cam = (o: Partial<CamPose> = {}): CamPose => ({ x: 0, y: 0, mountM: 3, panDeg: 0, tiltDeg: 20, hfovDeg: 90, vfovDeg: 50, nx: 2560, ...o });
const centroid = (p: Vec2[]) => ({ x: p.reduce((s, q) => s + q.x, 0) / p.length, y: p.reduce((s, q) => s + q.y, 0) / p.length });
const shrink = (p: Vec2[], k: number) => { const c = centroid(p); return p.map((q) => ({ x: c.x + (q.x - c.x) * k, y: c.y + (q.y - c.y) * k })); };

describe("геометрия камеры на плане", () => {
  it("точка на оси: глубина = наклонная дальность, плотность как в калькуляторе", () => {
    const fr = frameOf(cam(), T)!;
    const d = aimDistance(3, T, 20); // горизонтальная дальность точки прицеливания
    const s = sample(fr, d, 0, T)!;
    expect(s.depth).toBeCloseTo(Math.hypot(d, 3 - T), 9);
    const o = opticsFromFov({ hfovDeg: 90, vfovDeg: 50, nx: 2560, ny: 1440 })!;
    expect(s.ppm).toBeCloseTo(2560 / (2 * Math.tan(o.hfov / 2) * s.depth), 9);
  });

  it("глубина точки на земле совпадает с видом сбоку калькулятора", () => {
    const fr = frameOf(cam({ panDeg: 37 }), T)!;
    const o = opticsFromFov({ hfovDeg: 90, vfovDeg: 50, nx: 2560, ny: 1440 })!;
    const g = sideGeometry(o, { mountM: 3, targetM: T, tiltDeg: 20 })!;
    for (const d of [4, 8, 15]) {
      const th = (37 * Math.PI) / 180;
      expect(sample(fr, d * Math.cos(th), d * Math.sin(th), T)!.depth).toBeCloseTo(depthAtGround(g, d), 9);
    }
    // слепая зона = ближняя кромка кадра вида сбоку
    expect(blindRadius(fr)).toBeCloseTo(g.nearM, 9);
  });

  it("вне кадра: за камерой, сбоку, ближе слепой зоны", () => {
    const fr = frameOf(cam(), T)!;
    expect(sample(fr, -5, 0, T)).toBeNull();
    expect(sample(fr, 5, 6, T)).toBeNull(); // 50° в сторону при H/2 = 45°
    expect(sample(fr, blindRadius(fr) * 0.9, 0, T)).toBeNull();
    expect(sample(fr, blindRadius(fr) * 1.1, 0, T)).not.toBeNull();
  });

  it("полоса уровня: дальний край — ровно на пороговой глубине, углы трапеции на кромке кадра", () => {
    const fr = frameOf(cam(), T)!;
    const o = opticsFromFov({ hfovDeg: 90, vfovDeg: 50, nx: 2560, ny: 1440 })!;
    const dRec = depthForPpm(o, 125)!;
    const q = band(fr, 0, dRec)!;
    expect(q).toHaveLength(4);
    // точки чуть внутри дальнего края — в кадре и с плотностью не ниже 125
    for (const p of [q[2], q[3]]) {
      const inner = { x: p.x + (centroid(q).x - p.x) * 1e-6, y: p.y + (centroid(q).y - p.y) * 1e-6 };
      const s = sample(fr, inner.x, inner.y, T)!;
      expect(s.depth).toBeCloseTo(dRec, 3);
      expect(s.ppm).toBeGreaterThanOrEqual(125 * (1 - 1e-4));
    }
    // полоса дальше верхней кромки кадра — null (наклон 60°: верх кадра ниже горизонта)
    expect(band(frameOf(cam({ tiltDeg: 60 }), T)!, 1e3, 2e3)).toBeNull();
  });

  it("линия уровня: глубина каждой её точки равна порогу; вне кадра — null", () => {
    const fr = frameOf(cam(), T)!;
    const o = opticsFromFov({ hfovDeg: 90, vfovDeg: 50, nx: 2560, ny: 1440 })!;
    const d = depthForPpm(o, 62.5)!;
    const e = depthEdge(fr, d)!;
    for (const t of [0.01, 0.5, 0.99]) {
      const p = { x: e[0].x + t * (e[1].x - e[0].x), y: e[0].y + t * (e[1].y - e[0].y) };
      expect(sample(fr, p.x, p.y, T)!.depth).toBeCloseTo(d, 6);
    }
    expect(depthEdge(fr, 0.5)).toBeNull(); // ближе нижней кромки кадра
  });

  it("наклон по точке прицеливания и обратно", () => {
    for (const d of [2, 7.5, 40]) expect(aimDistance(3, T, tiltForAim(3, T, d))).toBeCloseTo(d, 9);
    expect(aimDistance(3, T, 0)).toBe(Infinity);
    expect(frameOf(cam({ mountM: 1.5 }), T)).toBeNull(); // камера ниже уровня цели
  });

  it("стены: отрезок между камерой и точкой закрывает обзор", () => {
    const wall: [Vec2, Vec2] = [{ x: 5, y: -2 }, { x: 5, y: 2 }];
    expect(segmentsCross({ x: 0, y: 0 }, { x: 10, y: 0 }, wall[0], wall[1])).toBe(true);
    expect(visible({ x: 0, y: 0 }, { x: 10, y: 0 }, [wall])).toBe(false);
    expect(visible({ x: 0, y: 0 }, { x: 10, y: 5 }, [wall])).toBe(true);
    expect(visible({ x: 0, y: 0 }, { x: 4, y: 0 }, [wall])).toBe(true);
  });

  it("многоугольник: принадлежность точки и площадь", () => {
    const sq = [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 3 }, { x: 0, y: 3 }];
    expect(polygonArea(sq)).toBe(12);
    expect(inPolygon({ x: 1, y: 1 }, sq)).toBe(true);
    expect(inPolygon({ x: 5, y: 1 }, sq)).toBe(false);
  });
});

describe("анализ покрытия", () => {
  const levels = [25, 62.5, 125, 250];
  const bounds = { x: -10, y: -40, w: 90, h: 80 };
  const fr = frameOf(cam(), T)!;
  const o = opticsFromFov({ hfovDeg: 90, vfovDeg: 50, nx: 2560, ny: 1440 })!;

  it("зона внутри полосы распознавания покрыта на 100 % до распознавания и на 0 % идентификацией", () => {
    const qRec = band(fr, depthForPpm(o, 250)!, depthForPpm(o, 125)!)!;
    const r = analyze({ bounds, maxCells: 200000, targetM: T, cams: [cam()], walls: [], zones: [shrink(qRec, 0.8)], levelsPpm: levels });
    expect(r.zones[0].share[2]).toBe(1);
    expect(r.zones[0].share[3]).toBe(0);
    expect(r.zones[0].overlap).toBe(0);
  });

  it("стена перед камерой — зона за ней не покрыта", () => {
    const qRec = band(fr, depthForPpm(o, 250)!, depthForPpm(o, 125)!)!;
    const wall: [Vec2, Vec2] = [{ x: 1.5, y: -30 }, { x: 1.5, y: 30 }];
    const r = analyze({ bounds, maxCells: 100000, targetM: T, cams: [cam()], walls: [wall], zones: [shrink(qRec, 0.8)], levelsPpm: levels });
    expect(r.zones[0].share[0]).toBe(0);
  });

  it("две камеры в одной точке — перекрытие 100 %; площадь зоны по сетке близка к точной", () => {
    const q = shrink(band(fr, 0, depthForPpm(o, 62.5)!)!, 0.7);
    const r = analyze({ bounds, maxCells: 300000, targetM: T, cams: [cam(), cam()], walls: [], zones: [q], levelsPpm: levels });
    expect(r.zones[0].overlap).toBe(1);
    expect(r.zones[0].cellsAreaM2 / r.zones[0].areaM2).toBeGreaterThan(0.97);
    expect(r.zones[0].cellsAreaM2 / r.zones[0].areaM2).toBeLessThan(1.03);
  });

  it("сетка не превышает лимит клеток", () => {
    const r = analyze({ bounds, maxCells: 5000, targetM: T, cams: [cam()], walls: [], zones: [], levelsPpm: levels });
    expect(r.cols * r.rows).toBeLessThanOrEqual(5000 * 1.05);
  });
});

const fixedSpec: CamSpec = { source: "catalog", model: "DS-2CD1043G2-LIU", lensType: "fixed", nx: 2560, ny: 1440, variants: [{ focalMm: [2.8, 2.8], hfovDeg: [98, 98], vfovDeg: [54, 54], status: "verified" }] };
const zoomSpec: CamSpec = { source: "catalog", model: "DS-2DE4425IWG1-E", lensType: "ptz", nx: 2560, ny: 1440, variants: [{ focalMm: [4.8, 120], hfovDeg: [55, 2.4], vfovDeg: [33, 1.4], status: "verified" }] };

describe("оптика камеры проекта", () => {
  it("фиксированный объектив — паспортные углы", () => {
    expect(opticsAt(fixedSpec, 0, 0.5)).toMatchObject({ hfovDeg: 98, vfovDeg: 54, focalMm: 2.8, estimate: false });
  });
  it("зум: на краях паспорт, между краями — модель вариофокала калькулятора", () => {
    expect(opticsAt(zoomSpec, 0, 0)).toMatchObject({ hfovDeg: 55, vfovDeg: 33, focalMm: 4.8 });
    expect(opticsAt(zoomSpec, 0, 1)).toMatchObject({ hfovDeg: 2.4, vfovDeg: 1.4, focalMm: 120 });
    const mid = opticsAt(zoomSpec, 0, 0.5)!;
    const ref = varifocalAt({ fMinMm: 4.8, fMaxMm: 120, hfovWideDeg: 55, hfovTeleDeg: 2.4, fMm: 62.4, nx: 2560, ny: 1440 })!;
    expect(mid.hfovDeg).toBeCloseTo((ref.optics.hfov * 180) / Math.PI, 9);
    expect(mid.estimate).toBe(true);
  });
  it("зум без фокуса — интерполяция 1/tan(H/2)", () => {
    const s: CamSpec = { ...zoomSpec, variants: [{ ...zoomSpec.variants[0], focalMm: null }] };
    const h = opticsAt(s, 0, 0.5)!.hfovDeg;
    const k = (d: number) => 1 / Math.tan((d * Math.PI) / 360);
    expect(k(h)).toBeCloseTo((k(55) + k(2.4)) / 2, 9);
  });
});

describe("файл проекта", () => {
  const camRec: PlanCamera = { id: "c1", n: 1, x: 5, y: 7, mountM: 3, panDeg: 45, tiltDeg: 20, zoom: 0, vi: 0, spec: fixedSpec };
  const proj = { ...emptyProject(), bg: { kind: "grid" as const, wM: 50, hM: 30 }, cams: [camRec], walls: [[{ x: 0, y: 0 }, { x: 10, y: 0 }]] as [Vec2, Vec2][], zones: [[{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 5 }]] };

  it("сохранение и чтение без потерь", () => {
    const back = parseProject(JSON.parse(JSON.stringify(proj)))!;
    expect(back.cams[0]).toEqual(camRec);
    expect(back.walls).toEqual(proj.walls);
    expect(poseOf(back.cams[0])).toMatchObject({ hfovDeg: 98, nx: 2560 });
  });

  it("испорченный файл не открывается", () => {
    const bad = (patch: object) => parseProject(JSON.parse(JSON.stringify({ ...proj, ...patch })));
    expect(bad({ format: "other" })).toBeNull();
    expect(bad({ version: 2 })).toBeNull();
    expect(bad({ cams: Array.from({ length: 65 }, (_, i) => ({ ...camRec, id: `c${i}` })) })).toBeNull();
    expect(bad({ cams: [{ ...camRec, vi: 3 }] })).toBeNull();
    expect(bad({ cams: [{ ...camRec, mountM: "3" }] })).toBeNull();
    expect(bad({ cams: [camRec, camRec] })).toBeNull(); // одинаковые id
    expect(bad({ zones: [[{ x: 0, y: 0 }, { x: 1, y: 1 }]] })).toBeNull();
    expect(bad({ targetM: 9 })).toBeNull();
    expect(parseProject(null)).toBeNull();
  });

  it("файл этапа C (без шкафа и настроек сметы) открывается с настройками по умолчанию", () => {
    const old = JSON.parse(JSON.stringify(proj)) as Record<string, unknown>;
    delete old.rack; delete old.est;
    const back = parseProject(old)!;
    expect(back.rack).toBeNull();
    expect(back.est).toEqual({ days: 30, mode: "continuous", codec: "h265", trace: "need" });
  });

  it("длина кабеля от шкафа: по осям + подъём + 1 м, запас 10 %", () => {
    expect(cableRun({ x: 10, y: 5, mountM: 3 }, { x: 0, y: 0 })).toBeCloseTo((10 + 5 + 2 + 1) * 1.1, 9);
  });

  it("картинка плана — только data:-URL изображения", () => {
    expect(isPlanImageUrl("data:image/png;base64,iVBORw0KGgo=")).toBe(true);
    expect(isPlanImageUrl("https://example.com/a.png")).toBe(false);
    expect(isPlanImageUrl("data:image/svg+xml;base64,PHN2Zz4=")).toBe(false);
    expect(isPlanImageUrl("javascript:alert(1)")).toBe(false);
  });

  it("новая калибровка сохраняет положение относительно картинки", () => {
    const r = rescaleProject(proj, 2);
    expect(r.cams[0]).toMatchObject({ x: 10, y: 14 });
    expect(r.walls[0][1]).toEqual({ x: 20, y: 0 });
  });
});
