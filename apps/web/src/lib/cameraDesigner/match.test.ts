import { describe, expect, it } from "vitest";
import { focalForHfov, matchCameras, scoreOf, type OpticsCamera } from "./match";
import { varifocalAt } from "./optics";

const cam = (o: Partial<OpticsCamera> & Pick<OpticsCamera, "slug" | "variants">): OpticsCamera => ({
  productId: o.slug, brand: "Hikvision", model: o.slug, status: "verified", lensType: "fixed", widthPx: 2560, heightPx: 1440, ...o,
});
const fixed = (h: number, f = 2.8) => ({ focalMm: [f, f] as [number, number], hfovDeg: [h, h] as [number, number], vfovDeg: null, status: "verified" as const });

describe("подбор камер", () => {
  it("фиксированный объектив: обе проверки — зона в кадре и плотность", () => {
    // 10 м, зона 8 м, распознавание 125 px/m. 98° → сцена 23 м, 111 px/m — плотности мало
    const r = matchCameras([cam({ slug: "wide", variants: [fixed(98)] })], { depthM: 10, widthM: 8, ppm: 125 });
    expect(r.verified).toHaveLength(0);
    expect(r.rejected.density).toBe(1);
    // 60° → сцена 11,5 м, 222 px/m — подходит
    const ok = matchCameras([cam({ slug: "mid", variants: [fixed(60, 6)] })], { depthM: 10, widthM: 8, ppm: 125 });
    expect(ok.verified).toHaveLength(1);
    expect(ok.verified[0].sceneWidthM).toBeGreaterThanOrEqual(8);
    expect(ok.verified[0].ppm).toBeGreaterThanOrEqual(125);
  });

  it("узкий объектив, который не видит края зоны, не рекомендуется", () => {
    // 20° → сцена 3,5 м < 8 м, хотя плотность огромная
    const r = matchCameras([cam({ slug: "narrow", variants: [fixed(20, 12)] })], { depthM: 10, widthM: 8, ppm: 125 });
    expect(r.verified).toHaveLength(0);
    expect(r.rejected.cover).toBe(1);
  });

  it("вариофокал: находит положение зума, где выполняются обе проверки", () => {
    const v = { focalMm: [2.8, 12] as [number, number], hfovDeg: [100, 30] as [number, number], vfovDeg: null, status: "verified" as const };
    const r = matchCameras([cam({ slug: "vari", lensType: "varifocal", variants: [v] })], { depthM: 15, widthM: 8, ppm: 125 });
    expect(r.verified).toHaveLength(1);
    const m = r.verified[0];
    expect(m.sceneWidthM).toBeGreaterThanOrEqual(8 - 1e-9);
    expect(m.ppm).toBeGreaterThanOrEqual(125 * (1 - 1e-9));
    // зум ставится на охват ≈ 1,25 ширины зоны (в пределах обеих проверок)
    expect(m.coverRatio).toBeCloseTo(1.25, 6);
    expect(m.focalEstimate).toBe(true);
    // фокус согласован с моделью вариофокала
    const back = varifocalAt({ fMinMm: 2.8, fMaxMm: 12, hfovWideDeg: 100, hfovTeleDeg: 30, fMm: m.focalMm!, nx: 2560, ny: 1440 })!;
    expect(back.optics.hfov * 180 / Math.PI).toBeCloseTo(m.hfovDeg, 6);
  });

  it("зум: если охват 1,25 упирается в плотность — берётся самый широкий угол с достаточной плотностью", () => {
    // 15 м, зона 10 м, 200 px/m: при охвате 12,5 м плотность 2560/12,5 = 205 — проходит;
    // при 240 px/m охват 12,5 м уже даёт 205 < 240 → угол сужается до ровно 240 px/m
    const v = { focalMm: [2.8, 12] as [number, number], hfovDeg: [100, 30] as [number, number], vfovDeg: null, status: "verified" as const };
    const m = matchCameras([cam({ slug: "vari", lensType: "varifocal", variants: [v] })], { depthM: 15, widthM: 10, ppm: 240 }).verified[0];
    expect(m.ppm).toBeCloseTo(240, 6);
    expect(m.sceneWidthM).toBeGreaterThanOrEqual(10);
  });

  it("мало пикселей для задачи — отказ даже у вариофокала", () => {
    // 20 м зоны с идентификацией 250 px/m требуют 5000 px по ширине
    const v = { focalMm: [2.8, 12] as [number, number], hfovDeg: [100, 30] as [number, number], vfovDeg: null, status: "verified" as const };
    const r = matchCameras([cam({ slug: "vari", lensType: "varifocal", variants: [v] })], { depthM: 15, widthM: 20, ppm: 250 });
    expect(r.verified).toHaveLength(0);
    expect(r.rejected.density).toBe(1);
  });

  it("данные «на разборе» — отдельной группой; без кадра — в «нет данных»", () => {
    const r = matchCameras([
      cam({ slug: "rev", status: "needs_review", variants: [{ ...fixed(60, 6), status: "needs_review" }] }),
      cam({ slug: "nopx", widthPx: null, variants: [fixed(60, 6)] }),
      cam({ slug: "uns", status: "unsupported", lensType: null, variants: [] }),
    ], { depthM: 10, widthM: 8, ppm: 125 });
    expect(r.verified).toHaveLength(0);
    expect(r.review.map((x) => x.slug)).toEqual(["rev"]);
    expect(r.rejected.noData).toBe(1);
  });

  it("из нескольких исполнений карточки — один лучший вариант", () => {
    const r = matchCameras([cam({ slug: "multi", variants: [fixed(98), fixed(60, 6), fixed(45, 8)] })], { depthM: 10, widthM: 8, ppm: 125 });
    expect(r.verified).toHaveLength(1);
    expect(r.verified[0].multiVariant).toBe(true);
    expect(r.verified[0].variantFocalMm).toEqual([6, 6]); // 60° — запас ближе к задаче, чем у 45°
  });

  it("фильтр по типу объектива", () => {
    const list = [cam({ slug: "f", variants: [fixed(60, 6)] }), cam({ slug: "z", lensType: "varifocal", variants: [{ focalMm: [2.8, 12], hfovDeg: [100, 30], vfovDeg: null, status: "verified" }] })];
    expect(matchCameras(list, { depthM: 10, widthM: 8, ppm: 125, kind: "fixed" }).verified.map((x) => x.slug)).toEqual(["f"]);
    expect(matchCameras(list, { depthM: 10, widthM: 8, ppm: 125, kind: "zoom" }).verified.map((x) => x.slug)).toEqual(["z"]);
  });

  it("оценка: многократный запас и лишний угол штрафуются, бренд не участвует", () => {
    expect(scoreOf(1.2, 1.2, "fixed")).toBeGreaterThan(scoreOf(4, 1.2, "fixed"));
    expect(scoreOf(1.2, 1.2, "fixed")).toBeGreaterThan(scoreOf(1.2, 3, "fixed"));
    expect(scoreOf(1.2, 1.2, "fixed")).toBeGreaterThan(scoreOf(1.2, 1.2, "varifocal"));
  });

  it("фокус по углу — обратная функция модели вариофокала", () => {
    for (const f of [3, 5, 8, 11.5]) {
      const h = varifocalAt({ fMinMm: 2.8, fMaxMm: 12, hfovWideDeg: 100, hfovTeleDeg: 30, fMm: f, nx: 2560, ny: 1440 })!.optics.hfov * 180 / Math.PI;
      expect(focalForHfov(2.8, 12, 100, 30, h)).toBeCloseTo(f, 6);
    }
  });
});
