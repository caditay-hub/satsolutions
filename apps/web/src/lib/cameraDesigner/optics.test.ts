import { describe, expect, it } from "vitest";
import {
  aimTiltDeg, coverCheck, deg, depthAtGround, depthForPpm, groundForDepth, groundRangeForPpm, opticsFromFov,
  opticsFromSensor, rad, requiredFocal, requiredFocalForPpm, requiredHfov, requiredNx, sceneAt, sideGeometry, varifocalAt,
} from "./optics";

const rel = (a: number, b: number) => Math.abs(a - b) / Math.abs(b);

// Приёмочный пример ТЗ §11: Sw 5,4 × Sh 3,04 мм, f 2,8 мм, 2560 × 1440, D 10 м
const TZ = opticsFromSensor({ swMm: 5.4, shMm: 3.04, fMm: 2.8, nx: 2560, ny: 1440 })!;

describe("приёмочный пример ТЗ", () => {
  it("углы", () => {
    expect(deg(TZ.hfov)).toBeCloseTo(87.9, 1); // ТЗ: «≈ 87,9°»
    expect(deg(TZ.hfov)).toBeCloseTo(87.91674665, 7); // 2·atan(5,4/5,6)
    expect(deg(TZ.vfov)).toBeCloseTo(2 * Math.atan(3.04 / 5.6) * 180 / Math.PI, 10);
    expect(deg(TZ.dfov)).toBeCloseTo(2 * Math.atan(Math.hypot(5.4, 3.04) / 5.6) * 180 / Math.PI, 10);
  });
  it("сцена и плотность на 10 м", () => {
    const s = sceneAt(TZ, 10)!;
    expect(rel(s.widthM, 19.2857142857)).toBeLessThan(1e-10);
    expect(rel(s.heightM, 10.8571428571)).toBeLessThan(1e-10);
    expect(rel(s.ppmH, 132.74074074)).toBeLessThan(1e-9);
    expect(rel(s.widthM, (10 * 5.4) / 2.8)).toBeLessThan(1e-12); // D·Sw/f
  });
  it("дальность порога = Nx·f/(Sw·PPM)", () => {
    expect(rel(depthForPpm(TZ, 125)!, (2560 * 2.8) / (5.4 * 125))).toBeLessThan(1e-12);
  });
});

describe("свойства модели", () => {
  const base = { swMm: 5.4, shMm: 3.04, fMm: 4, nx: 2560, ny: 1440 };
  it("угол растёт с сенсором и падает с фокусом", () => {
    const o = opticsFromSensor(base)!;
    expect(opticsFromSensor({ ...base, swMm: 6.4 })!.hfov).toBeGreaterThan(o.hfov);
    expect(opticsFromSensor({ ...base, fMm: 6 })!.hfov).toBeLessThan(o.hfov);
  });
  it("ширина сцены линейна по D, плотность обратно пропорциональна D", () => {
    const o = opticsFromSensor(base)!;
    for (const d of [0.5, 3, 17, 250]) {
      const a = sceneAt(o, d)!, b = sceneAt(o, 2 * d)!;
      expect(rel(b.widthM, 2 * a.widthM)).toBeLessThan(1e-12);
      expect(rel(b.ppmH, a.ppmH / 2)).toBeLessThan(1e-12);
    }
  });
  it("длиннее фокус → выше плотность, но уже охват", () => {
    const a = sceneAt(opticsFromSensor(base)!, 20)!;
    const b = sceneAt(opticsFromSensor({ ...base, fMm: 8 })!, 20)!;
    expect(b.ppmH).toBeGreaterThan(a.ppmH);
    expect(b.widthM).toBeLessThan(a.widthM);
  });
  it("горизонталь и вертикаль согласованы при квадратном пикселе", () => {
    const s = sceneAt(opticsFromSensor({ swMm: 5.12, shMm: 2.88, fMm: 4, nx: 2560, ny: 1440 })!, 12)!;
    expect(rel(s.ppmH, s.ppmV)).toBeLessThan(1e-12);
  });
  it("угол по паспорту ≡ угол из сенсора", () => {
    const o = opticsFromFov({ hfovDeg: deg(TZ.hfov), vfovDeg: deg(TZ.vfov), nx: 2560, ny: 1440 })!;
    expect(rel(sceneAt(o, 10)!.ppmH, sceneAt(TZ, 10)!.ppmH)).toBeLessThan(1e-12);
    expect(o.estimate).toBe(false);
  });
  it("вертикальный угол без паспорта выводится из соотношения сторон и помечается оценкой", () => {
    const o = opticsFromFov({ hfovDeg: 90, nx: 1920, ny: 1080 })!;
    expect(Math.tan(o.vfov / 2)).toBeCloseTo(Math.tan(Math.PI / 4) * 1080 / 1920, 12);
    expect(o.vfovEstimated).toBe(true);
  });
});

describe("обратный расчёт", () => {
  it("требуемый угол и фокус возвращают ровно заданную ширину", () => {
    for (const [d, w] of [[10, 8], [3, 12], [45, 6.5], [0.8, 0.3]]) {
      const h = requiredHfov(d, w)!;
      expect(rel(2 * d * Math.tan(h / 2), w)).toBeLessThan(1e-12);
      const f = requiredFocal(d, w, 5.4)!;
      const s = sceneAt(opticsFromSensor({ swMm: 5.4, shMm: 3.04, fMm: f, nx: 2560, ny: 1440 })!, d)!;
      expect(rel(s.widthM, w)).toBeLessThan(1e-12);
    }
  });
  it("фокус под плотность даёт ровно порог", () => {
    const f = requiredFocalForPpm(20, 5.4, 250, 2560)!;
    const s = sceneAt(opticsFromSensor({ swMm: 5.4, shMm: 3.04, fMm: f, nx: 2560, ny: 1440 })!, 20)!;
    expect(rel(s.ppmH, 250)).toBeLessThan(1e-12);
  });
  it("требуемые пиксели: ceil(W·PPM), без лишнего пикселя от погрешности", () => {
    expect(requiredNx(8, 125)).toBe(1000);
    expect(requiredNx(8.01, 125)).toBe(1002);
    expect(requiredNx(0.1 * 3, 1000)).toBe(300); // 0,30000000000000004 · 1000
  });
  it("узкий объектив: плотность есть, а края зоны не видны — не подходит", () => {
    const narrow = opticsFromSensor({ swMm: 5.4, shMm: 3.04, fMm: 12, nx: 2560, ny: 1440 })!;
    const c = coverCheck(narrow, 10, 8, 250)!;
    expect(c.dense).toBe(true);
    expect(c.covers).toBe(false);
    expect(c.ok).toBe(false);
  });
  it("широкий объектив: зона видна, плотности мало — не подходит", () => {
    const c = coverCheck(TZ, 10, 8, 250)!;
    expect(c.covers).toBe(true);
    expect(c.dense).toBe(false);
  });
});

describe("вариофокал", () => {
  const p = { fMinMm: 2.8, fMaxMm: 12, hfovWideDeg: 100, hfovTeleDeg: 30, nx: 2560, ny: 1440 };
  it("на краях диапазона — паспортные углы", () => {
    expect(deg(varifocalAt({ ...p, fMm: 2.8 })!.optics.hfov)).toBeCloseTo(100, 12);
    expect(deg(varifocalAt({ ...p, fMm: 12 })!.optics.hfov)).toBeCloseTo(30, 12);
  });
  it("угол монотонно сужается с фокусом", () => {
    let prev = Infinity;
    for (let f = 2.8; f <= 12; f += 0.4) {
      const h = varifocalAt({ ...p, fMm: f })!.optics.hfov;
      expect(h).toBeLessThan(prev);
      prev = h;
    }
  });
  it("фокус вне диапазона и перевёрнутые углы — отказ", () => {
    expect(varifocalAt({ ...p, fMm: 13 })).toBeNull();
    expect(varifocalAt({ ...p, hfovWideDeg: 30, hfovTeleDeg: 100, fMm: 4 })).toBeNull();
  });
});

describe("высота и наклон", () => {
  const o = opticsFromFov({ hfovDeg: 90, vfovDeg: 50, nx: 2560, ny: 1440 })!;
  it("кромки кадра на высоте цели", () => {
    const g = sideGeometry(o, { mountM: 3, targetM: 0, tiltDeg: 30 })!;
    expect(g.nearM).toBeCloseTo(3 / Math.tan(rad(55)), 12);
    expect(g.farM).toBeCloseTo(3 / Math.tan(rad(5)), 12);
  });
  it("верхняя кромка выше горизонта → дальняя граница бесконечна", () => {
    expect(sideGeometry(o, { mountM: 3, targetM: 0, tiltDeg: 10 })!.farM).toBe(Infinity);
  });
  it("глубина ↔ горизонтальная дальность взаимно обратны", () => {
    const g = sideGeometry(o, { mountM: 4, targetM: 1.6, tiltDeg: 12 })!;
    for (const d of [2, 7.5, 30]) expect(groundForDepth(g, depthAtGround(g, d))).toBeCloseTo(d, 10);
  });
  it("при наведении на цель глубина = наклонная дальность", () => {
    const t = aimTiltDeg(4, 1.6, 10)!;
    const g = sideGeometry(o, { mountM: 4, targetM: 1.6, tiltDeg: t })!;
    expect(depthAtGround(g, 10)).toBeCloseTo(Math.hypot(10, 2.4), 10);
  });
  it("участок уровня внутри видимого участка", () => {
    const g = sideGeometry(o, { mountM: 3, targetM: 1.6, tiltDeg: 10 })!;
    const r = groundRangeForPpm(o, g, 125)!;
    expect(r.fromM).toBeCloseTo(g.nearM, 12);
    expect(depthAtGround(g, r.toM)).toBeCloseTo(depthForPpm(o, 125)!, 9);
  });
  it("камера не выше цели — отказ", () => {
    expect(sideGeometry(o, { mountM: 1.6, targetM: 1.6, tiltDeg: 10 })).toBeNull();
  });
});

describe("недопустимый ввод", () => {
  const bad = [NaN, Infinity, -Infinity, -1, 0, undefined as unknown as number, null as unknown as number, "4" as unknown as number];
  it("сенсор/фокус/пиксели", () => {
    for (const x of bad) {
      expect(opticsFromSensor({ swMm: x, shMm: 3, fMm: 4, nx: 2560, ny: 1440 })).toBeNull();
      expect(opticsFromSensor({ swMm: 5, shMm: 3, fMm: x, nx: 2560, ny: 1440 })).toBeNull();
      expect(opticsFromSensor({ swMm: 5, shMm: 3, fMm: 4, nx: x, ny: 1440 })).toBeNull();
      expect(opticsFromFov({ hfovDeg: x, nx: 2560, ny: 1440 })).toBeNull();
      expect(sceneAt(TZ, x)).toBeNull();
      expect(requiredHfov(x, 5)).toBeNull();
    }
  });
  it("дробные пиксели и угол ≥ 180°", () => {
    expect(opticsFromFov({ hfovDeg: 90, nx: 2560.5, ny: 1440 })).toBeNull();
    expect(opticsFromFov({ hfovDeg: 180, nx: 2560, ny: 1440 })).toBeNull();
  });
});
