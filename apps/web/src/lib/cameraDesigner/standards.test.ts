import { describe, expect, it } from "vitest";
import { PROFILES, evaluate, visibleLevels } from "./standards";

describe("профили IEC 62676-4", () => {
  it("2014 — шесть уровней MDORII, четыре из них DORI", () => {
    expect(PROFILES["2014"].levels.map((l) => l.ppm)).toEqual([12.5, 25, 62.5, 125, 250, 1000]);
    expect(visibleLevels("2014", false).map((l) => l.code)).toEqual(["detect", "observe", "recognize", "identify"]);
    expect(visibleLevels("2014", true)).toHaveLength(6);
  });
  it("2025 — семь уровней O2DCPVS, LPDO и HPDO", () => {
    expect(PROFILES["2025"].levels.map((l) => l.ppm)).toEqual([20, 40, 80, 125, 250, 500, 1500]);
    expect(PROFILES["2025"].levels.filter((l) => l.group === "LPDO").map((l) => l.code)).toEqual(["overview", "outline", "discern"]);
    expect(visibleLevels("2025", false)).toHaveLength(7);
  });
  it("версии профилей различаются", () => {
    expect(PROFILES["2014"].id).not.toBe(PROFILES["2025"].id);
  });
  it("пороги растут строго", () => {
    for (const p of Object.values(PROFILES)) for (let i = 1; i < p.levels.length; i++) expect(p.levels[i].ppm).toBeGreaterThan(p.levels[i - 1].ppm);
  });
});

describe("оценка уровней", () => {
  it("приёмочный пример ТЗ: 132,74 px/m", () => {
    const ppm = 2560 / ((10 * 5.4) / 2.8);
    expect(evaluate("2014", ppm).map((l) => l.met)).toEqual([true, true, true, false]); // 25 62,5 125 | 250
    expect(evaluate("2025", ppm).map((l) => l.met)).toEqual([true, true, true, true, false, false, false]); // 20 40 80 125 | 250 500 1500
  });
  it("ниже, ровно на и выше порога — каждый уровень обеих редакций", () => {
    for (const key of ["2014", "2025"] as const) {
      for (const l of PROFILES[key].levels) {
        const at = (ppm: number) => evaluate(key, ppm, true).find((x) => x.code === l.code)!.met;
        expect(at(l.ppm * 0.999)).toBe(false);
        expect(at(l.ppm)).toBe(true);
        expect(at(l.ppm * 1.001)).toBe(true);
      }
    }
  });
});
