import { describe, expect, it } from "vitest";
import { CONTENT } from "./content";
import { CATALOG_CONTENT } from "./catalogContent";
import { PROFILES } from "./standards";

// Все пять словарей — одной формы: те же ключи, те же подстановки {…}, те же длины списков.
const flat = (o: unknown, p = ""): Record<string, unknown> =>
  o && typeof o === "object" && !Array.isArray(o)
    ? Object.entries(o as Record<string, unknown>).reduce((a, [k, v]) => ({ ...a, ...flat(v, p ? `${p}.${k}` : k) }), {})
    : { [p]: o };
const holes = (s: unknown) => (typeof s === "string" ? (s.match(/\{\w+\}/g) ?? []).sort().join(",") : Array.isArray(s) ? `len${s.length}` : "");

describe("тексты калькулятора на пяти языках", () => {
  const ru = flat(CONTENT.ru);
  for (const loc of ["uz", "en", "tr", "zh"]) {
    it(loc, () => {
      const x = flat(CONTENT[loc]);
      expect(Object.keys(x).sort()).toEqual(Object.keys(ru).sort());
      for (const k of Object.keys(ru)) {
        expect(holes(x[k]), `${loc}.${k}`).toBe(holes(ru[k]));
        if (typeof x[k] === "string") expect((x[k] as string).trim(), `${loc}.${k} пустой`).not.toBe("");
      }
    });
  }
  it("словарь подбора и блока карточки — той же формы на всех языках", () => {
    const base = flat(CATALOG_CONTENT.ru);
    for (const loc of ["uz", "en", "tr", "zh"]) {
      const x = flat(CATALOG_CONTENT[loc]);
      expect(Object.keys(x).sort()).toEqual(Object.keys(base).sort());
      for (const k of Object.keys(base)) {
        expect(holes(x[k]), `${loc}.${k}`).toBe(holes(base[k]));
        expect(String(x[k]).trim(), `${loc}.${k} пустой`).not.toBe("");
      }
    }
  });
  it("у каждого уровня обеих редакций есть название и задача", () => {
    for (const loc of Object.keys(CONTENT)) for (const p of Object.values(PROFILES)) for (const l of p.levels) {
      expect(CONTENT[loc].levels[l.code].name).toBeTruthy();
      expect(CONTENT[loc].levels[l.code].task).toBeTruthy();
    }
  });
});
