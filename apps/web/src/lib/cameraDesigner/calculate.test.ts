import { describe, expect, it } from "vitest";
import { DEFAULT_INPUT, compute, type CalcInput } from "./calculate";
import { parseQuery, toQuery } from "./query";

const ok = (i: Partial<CalcInput>) => {
  const r = compute({ ...DEFAULT_INPUT, ...i });
  if (r.status !== "ok") throw new Error(`ожидался расчёт, получено ${JSON.stringify(r)}`);
  return r;
};

describe("сборка расчёта", () => {
  it("приёмочный пример ТЗ через сенсорный ввод", () => {
    const r = ok({ src: "sensor", sw: 5.4, sh: 3.04, f: 2.8, nx: 2560, ny: 1440, d: 10 });
    expect(r.scene.ppmH).toBeCloseTo(132.74074074, 7);
    expect(r.levels.map((l) => l.met)).toEqual([true, true, true, false]);
    const r25 = ok({ src: "sensor", sw: 5.4, sh: 3.04, f: 2.8, d: 10, std: "2025" });
    expect(r25.levels.map((l) => l.met)).toEqual([true, true, true, true, false, false, false]);
  });
  it("fisheye — не считается этой моделью", () => {
    expect(compute({ ...DEFAULT_INPUT, lens: "fisheye" }).status).toBe("unsupported");
  });
  it("неверные поля перечисляются, расчёта нет", () => {
    const r = compute({ ...DEFAULT_INPUT, hfov: 0, d: -5 });
    expect(r.status).toBe("invalid");
    if (r.status === "invalid") expect(r.fields.sort()).toEqual(["d", "hfov"]);
  });
  it("с высотой: глубина = d·cosτ + Δ·sinτ", () => {
    const r = ok({ geo: true, mount: 4, target: 1.6, tilt: 10, d: 12 });
    const t = (10 * Math.PI) / 180;
    expect(r.depthM).toBeCloseTo(12 * Math.cos(t) + 2.4 * Math.sin(t), 12);
    expect(r.slantM).toBeCloseTo(Math.hypot(12, 2.4), 12);
  });
  it("камера ниже цели — ошибка поля", () => {
    const r = compute({ ...DEFAULT_INPUT, geo: true, mount: 1.5, target: 1.6 });
    expect(r.status).toBe("invalid");
  });
  it("под задачу: обе проверки и пиксели", () => {
    const r = ok({ mode: "task", src: "sensor", sw: 5.4, sh: 3.04, f: 2.8, d: 10, w: 8, lvl: "identify" });
    expect(r.task!.nxReq).toBe(2000);
    expect(r.task!.check!.covers).toBe(true);
    expect(r.task!.check!.dense).toBe(false);
    expect(r.task!.focalForPpmMm).toBeCloseTo((10 * 5.4 * 250) / 2560, 12);
    expect(r.task!.byResolution.find((x) => x.nx === 1920)!.ok).toBe(false); // 1920/250 = 7,68 м < 8 м
    expect(r.task!.byResolution.find((x) => x.nx === 2560)!.ok).toBe(true);
  });
  it("уровень другой редакции в задаче не принимается", () => {
    const r = compute({ ...DEFAULT_INPUT, mode: "task", std: "2025", lvl: "identify" });
    expect(r.status).toBe("invalid");
  });
});

describe("ссылка расчёта", () => {
  const sp = (s: string) => new URLSearchParams(s);
  it("туда и обратно без потерь", () => {
    const cases: Partial<CalcInput>[] = [
      {},
      { src: "sensor", sw: 5.4, sh: 3.04, f: 2.8, d: 10, std: "2025" },
      { lens: "vari", fmin: 2.7, fmax: 13.5, hw: 103, ht: 29, f: 6, geo: true, mount: 4, target: 0.5, tilt: 8 },
      { mode: "task", w: 6.5, lvl: "identify", all: true, vfov: 52.5 },
    ];
    for (const c of cases) {
      const i = { ...DEFAULT_INPUT, ...c };
      const back = parseQuery(sp(toQuery(i)));
      expect(compute(back)).toEqual(compute(i));
      expect(back.std).toBe(i.std);
      expect(back.mode).toBe(i.mode);
    }
  });
  it("в ссылке есть версия движка и профиль", () => {
    const q = sp(toQuery(DEFAULT_INPUT));
    expect(q.get("v")).toBe("cd-optics-1");
    expect(q.get("std")).toBe("2014");
  });
  it("мусор в ссылке → значения по умолчанию", () => {
    const i = parseQuery(sp("hf=1e3&nx=-5&ny=1440.5&d=NaN&f=" + "9".repeat(40) + "&std=2099&lens=<script>&lv=xxx&sw=Infinity"));
    expect(i.hfov).toBe(DEFAULT_INPUT.hfov);
    expect(i.nx).toBe(DEFAULT_INPUT.nx);
    expect(i.ny).toBe(DEFAULT_INPUT.ny);
    expect(i.d).toBe(DEFAULT_INPUT.d);
    expect(i.f).toBe(DEFAULT_INPUT.f);
    expect(i.std).toBe("2014");
    expect(i.lens).toBe("fixed");
    expect(i.sw).toBe(DEFAULT_INPUT.sw);
    expect(compute(i).status).toBe("ok");
  });
  it("уровень задачи — из профиля ссылки", () => {
    expect(parseQuery(sp("std=2025&lv=identify")).lvl).not.toBe("identify");
    expect(parseQuery(sp("std=2025&lv=validate")).lvl).toBe("validate");
  });
});
