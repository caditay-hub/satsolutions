import { describe, expect, it } from "vitest";
import { compute } from "./calculate";
import { parseQuery, toQuery } from "./query";
import { HEAD_FRAME, PORTRAIT_BG, paintHead, rasterize } from "./portraitPaint";
import { SIMPLE_DEFAULT, SIMPLE_LENSES, SIMPLE_MP, computeSimple, simpleInput, simpleOf, summarize, taskPpm } from "./simple";
import { PERSON_H, personBox, poseFor, projector } from "./view";

const run = (s: Partial<typeof SIMPLE_DEFAULT>) => {
  const x = computeSimple({ ...SIMPLE_DEFAULT, ...s });
  if (!x) throw new Error("ожидался расчёт");
  return x;
};

describe("простой режим: типовая камера", () => {
  it("угол зависит только от объектива: смена мегапикселей его не меняет", () => {
    const deg = SIMPLE_MP.map((m) => run({ mp: m.mp }).result.hfovDeg);
    for (const d of deg) expect(d).toBeCloseTo(deg[0], 9);
    // 1/2.8" (5,37 мм) и 2,8 мм: 2·atan(5,37 / 5,6) ≈ 87,6°
    expect(deg[0]).toBeCloseTo(87.6, 1);
  });

  it("ширина на 10 м и плотность для 4 Мп / 2,8 мм", () => {
    const { summary } = run({});
    expect(summary.widthM).toBeCloseTo((10 * 5.37) / 2.8, 6); // 19,18 м
    expect(summary.ppm).toBeCloseTo(2560 / summary.widthM, 6); // ≈133 пикс./м
    expect(summary.need).toBe(62.5);
    expect(summary.ok).toBe(true);
  });

  it("задачи привязаны к 25 / 62,5 / 125 пикс./м", () => {
    expect([taskPpm("overview"), taskPpm("actions"), taskPpm("face")]).toEqual([25, 62.5, 125]);
  });

  it("вход ↔ простые настройки туда и обратно, в том числе через ссылку", () => {
    for (const f of SIMPLE_LENSES) for (const m of SIMPLE_MP) {
      const s = { f, mp: m.mp, d: 17.5, task: "face" as const };
      expect(simpleOf(simpleInput(s))).toEqual(s);
      expect(simpleOf(parseQuery(new URLSearchParams(toQuery(simpleInput(s)))))).toEqual(s);
    }
  });

  it("камера, заданная углами из паспорта, — не простой режим", () => {
    expect(simpleOf({ ...simpleInput(SIMPLE_DEFAULT), src: "fov" })).toBeNull();
    expect(simpleOf({ ...simpleInput(SIMPLE_DEFAULT), f: 5 })).toBeNull();
    expect(simpleOf({ ...simpleInput(SIMPLE_DEFAULT), geo: true })).toBeNull();
    expect(simpleOf({ ...simpleInput(SIMPLE_DEFAULT), lvl: "identify" })).toBeNull();
  });
});

describe("простой режим: рекомендация", () => {
  it("мало детализации — предлагает ближайший подходящий объектив, и он правда подходит", () => {
    const { summary } = run({ d: 20, task: "face" }); // 2,8 мм, 4 Мп: ≈67 пикс./м < 125
    expect(summary.ok).toBe(false);
    expect(summary.advice).toMatchObject({ kind: "narrower", f: 6 });
    // проверка тем же расчётом: с 6 мм на 20 м детализации хватает, с 4 мм — нет
    expect(run({ d: 20, task: "face", f: 6 }).summary.ok).toBe(true);
    expect(run({ d: 20, task: "face", f: 4 }).summary.ok).toBe(false);
  });

  it("запас — предлагает самый широкий объектив, который ещё справляется", () => {
    const { summary } = run({ f: 12, d: 10, task: "actions" });
    expect(summary.ok).toBe(true);
    expect(summary.advice).toMatchObject({ kind: "wider", f: 2.8 });
  });

  it("точный подбор — без лишнего совета", () => {
    // 2,8 мм уже самый широкий
    expect(run({ f: 2.8, d: 5 }).summary.advice).toEqual({ kind: "exact" });
  });

  it("12 мм мало — предлагает разрешение выше, и оно правда подходит", () => {
    const { summary } = run({ f: 12, mp: 2, d: 40, task: "face" }); // 1920/(40·5,37/12)=107 < 125
    expect(summary.ok).toBe(false);
    expect(summary.advice).toMatchObject({ kind: "moreMp", mp: 4, f: 12 });
    expect(run({ f: 12, mp: 4, d: 40, task: "face" }).summary.ok).toBe(true);
  });

  it("ничего из простых вариантов — честно говорит об этом", () => {
    expect(run({ f: 12, mp: 8, d: 100, task: "face" }).summary.advice).toEqual({ kind: "none" });
  });

  it("ручная камера: нужный угол даёт ровно нужную плотность", () => {
    const i = { ...simpleInput({ ...SIMPLE_DEFAULT, d: 30, task: "face" }), src: "fov" as const, hfov: 90, vfov: null };
    const r = compute(i);
    if (r.status !== "ok") throw new Error();
    const s = summarize(i, r.optics, r.depthM, 125)!;
    expect(s.advice.kind).toBe("customNo");
    if (s.advice.kind !== "customNo") return;
    const r2 = compute({ ...i, hfov: s.advice.hfovDeg });
    if (r2.status !== "ok") throw new Error();
    expect(r2.scene.ppmH).toBeCloseTo(125, 6);
  });
});

describe("сцена «Вид с камеры» согласована с расчётом", () => {
  it("простой режим: грудь человека — в центре кадра, до неё по оси ровно d", () => {
    for (const d of [1, 3, 10, 55, 100]) {
      const { result } = run({ d });
      const pose = poseFor({ d, geo: false, mount: 3, tiltDeg: 0 });
      const p = projector(result.optics, pose).project(0, 1.2, pose.personZ)!;
      expect(p.x).toBeCloseTo(result.optics.nx / 2, 6);
      expect(p.y).toBeCloseTo(result.optics.ny / 2, 6);
      expect(p.depth).toBeCloseTo(d, 6);
    }
  });

  it("метр поперёк оси у точки прицела = плотность расчёта, на любой дистанции", () => {
    for (const d of [1, 3, 10, 30, 100]) for (const f of [2.8, 12]) {
      const { result } = run({ d, f });
      const pose = poseFor({ d, geo: false, mount: 3, tiltDeg: 0 });
      const pr = projector(result.optics, pose);
      const a = pr.project(-0.5, 1.2, pose.personZ)!, b = pr.project(0.5, 1.2, pose.personZ)!;
      expect(b.x - a.x).toBeCloseTo(result.scene.ppmH, 6);
    }
  });

  it("рост человека ≈ 1,75 м × плотность; вблизи камера смотрит вниз, и ракурс честно укорачивает фигуру", () => {
    for (const d of [10, 30, 100]) for (const f of [2.8, 12]) {
      const { result } = run({ d, f });
      const pose = poseFor({ d, geo: false, mount: 3, tiltDeg: 0 });
      const box = personBox(projector(result.optics, pose), pose, 0)!;
      const expectPx = PERSON_H * result.scene.ppmV;
      expect(Math.abs(box.h - expectPx) / expectPx).toBeLessThan(0.03);
    }
  });

  it("с высотой и наклоном — та же глубина, что в расчёте geo", () => {
    const i = { ...simpleInput(SIMPLE_DEFAULT), geo: true, mount: 4, target: 1.6, tilt: 12, d: 15 };
    const r = compute(i);
    if (r.status !== "ok") throw new Error();
    const pose = poseFor({ d: i.d, geo: true, mount: i.mount, tiltDeg: i.tilt });
    expect(projector(r.optics, pose).project(0, i.target, pose.personZ)!.depth).toBeCloseTo(r.depthM, 6);
  });
});

describe("рисунок человека", () => {
  it("портрет: фон непрозрачный, лицо отличается от фона", () => {
    const px = rasterize(paintHead, HEAD_FRAME.w, HEAD_FRAME.h, 40, 50, PORTRAIT_BG);
    expect(px.length).toBe(40 * 50 * 4);
    for (let k = 3; k < px.length; k += 4) expect(px[k]).toBe(255);
    const centre = ((25 * 40 + 20) * 4);
    expect([px[centre], px[centre + 1], px[centre + 2]]).not.toEqual(PORTRAIT_BG);
  });
});

describe("подбор: типовая камера и защита", () => {
  it("наименьшее разрешение, при нём — самый узкий объектив, охватывающий зону", async () => {
    const { pickTypical } = await import("./simple");
    // вход: 5 м, зона 3 м, лицо 125 → 12 мм даёт 2,24 м < 3, 8 мм — 3,36 м ≥ 3; 1920/3,36 = 572 ≥ 125
    expect(pickTypical(5, 3, 125)).toMatchObject({ mp: 2, f: 8 });
    // улица: 20 м, 15 м, 62,5 → 6 мм даёт 17,9 м; 1920/17,9 = 107 ≥ 62,5
    expect(pickTypical(20, 15, 62.5)).toMatchObject({ mp: 2, f: 6 });
    // широкая зона: даже 2,8 мм не охватывает 50 м на 20 м
    expect(pickTypical(20, 50, 25)).toBeNull();
    // плотность не набрать ни одним разрешением: 2,8 мм на 40 м ≈ 76,7 м, 3840/76,7 = 50 < 125
    expect(pickTypical(40, 70, 125)).toBeNull();
  });

  it("IP из карточки: наибольший код, без кода — null", async () => {
    const { ipRating } = await import("./match");
    expect(ipRating('{"Защита":"IP67, IK10"}')).toBe(67);
    expect(ipRating("Цилиндрическая IP-камера 4МП")).toBeNull(); // «IP-камера» — не степень защиты
    expect(ipRating("IP66 / IP67")).toBe(67);
  });
});
