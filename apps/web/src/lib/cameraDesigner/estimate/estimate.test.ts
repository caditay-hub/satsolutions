import { describe, expect, it } from "vitest";
import { PRICE } from "../../calcPricing";
import { DEFAULT_SETTINGS, HDD_USABLE, POE_CAP, bitrateOf, camW, estimate, pickHdd, pickSwitches, recorderBrands, storageTb, type EstCam, type Equipment, type PriceMap, type Recorder } from "./estimate";

const rec = (o: Partial<Recorder> & Pick<Recorder, "slug" | "channels">): Recorder => ({
  brand: "Hikvision", model: o.slug, kind: "nvr", bandwidthMbps: 80, maxMP: 8, bays: 1, maxTbPerBay: 10, poePorts: 0, poeBudgetW: null, poeAt: false, powerW: 10, ...o,
});
const EQ: Equipment = {
  recorders: [
    rec({ slug: "nvr4", channels: 4, bandwidthMbps: 40 }),
    rec({ slug: "nvr8p", channels: 8, poePorts: 8, poeBudgetW: 80, bandwidthMbps: 80 }),
    rec({ slug: "nvr16", channels: 16, bays: 2, bandwidthMbps: 160 }),
    rec({ slug: "nvr32", channels: 32, bays: 4, bandwidthMbps: 256, maxTbPerBay: 16 }),
    rec({ slug: "dh8", brand: "Dahua", channels: 8, bandwidthMbps: 80 }),
    rec({ slug: "dvr4", kind: "dvr", channels: 4, bandwidthMbps: null }),
  ],
  switches: [
    { slug: "sw4", brand: "Hikvision", model: "sw4", poePorts: 4, budgetW: 36, at: false, hiPoe: false, powerW: 5 },
    { slug: "sw8", brand: "Hikvision", model: "sw8", poePorts: 8, budgetW: 60, at: true, hiPoe: false, powerW: 8 },
    { slug: "sw16", brand: "Hikvision", model: "sw16", poePorts: 16, budgetW: 135, at: true, hiPoe: false, powerW: 12 },
  ],
  hdds: [{ slug: "h1", tb: 1, surveillance: true }, { slug: "h2", tb: 2, surveillance: true }, { slug: "h4", tb: 4, surveillance: true }, { slug: "h8", tb: 8, surveillance: true }, { slug: "x2", tb: 2, surveillance: false }],
  ups: [{ slug: "u600", w: 360, va: 600 }, { slug: "u1000", w: 600, va: 1000 }],
  cables: [{ slug: "in305", outdoor: false, meters: 305 }, { slug: "out305", outdoor: true, meters: 305 }],
  rj45: { slug: "rj" },
  gofra: { slug: "gf", meters: 50 },
};
const PM: PriceMap = Object.fromEntries([
  ["nvr4", 500_000], ["nvr8p", 830_000], ["nvr16", 1_000_000], ["nvr32", 2_400_000], ["dh8", 700_000], ["dvr4", 400_000],
  ["sw4", 300_000], ["sw8", 600_000], ["sw16", 1_200_000],
  ["h1", 700_000], ["h2", 950_000], ["h4", 1_770_000], ["h8", 5_800_000], ["x2", 100_000],
  ["u600", 600_000], ["u1000", 900_000], ["in305", 433_000], ["out305", 470_000], ["rj", 690], ["gf", 110_900],
].map(([k, v]) => [k, { price: v as number, inStock: true }]));

const cam = (o: Partial<EstCam> = {}): EstCam => ({ key: "c4", slug: "c4", brand: "Hikvision", nx: 2560, ny: 1440, kind: "ip", outdoor: false, mountM: 3, cableM: 30, powerW: 6, poe: "af", ...o });
const many = (n: number, o: Partial<EstCam> = {}) => Array.from({ length: n }, () => cam(o));

describe("архив и битрейт", () => {
  it("битрейт по разрешению и кодеку", () => {
    expect(bitrateOf(2560, 1440, "h265")).toBe(4);
    expect(bitrateOf(2560, 1440, "h264")).toBe(6);
    expect(bitrateOf(1920, 1080, "h265")).toBe(2);
    expect(bitrateOf(3840, 2160, "h265")).toBe(8);
  });
  it("архив: 4 Мбит/с × 30 суток = 1,296 ТБ; по движению — 30 %", () => {
    expect(storageTb(4, DEFAULT_SETTINGS)).toBeCloseTo(1.296, 6);
    expect(storageTb(4, { ...DEFAULT_SETTINGS, mode: "motion" })).toBeCloseTo(1.296 * 0.3, 6);
  });
  it("мощность камеры без паспорта — потолок класса как оценка", () => {
    expect(camW(cam({ powerW: null, poe: "af" }))).toEqual({ w: POE_CAP.af, estimate: true });
    expect(camW(cam({ powerW: null, poe: null, kind: "ptz" }))).toEqual({ w: POE_CAP.at, estimate: true });
  });
});

describe("подбор оборудования", () => {
  it("диски: полезная ёмкость 90 %, не больше отсеков, только для видеонаблюдения, дешевле", () => {
    const r = rec({ slug: "r", channels: 16, bays: 2, maxTbPerBay: 8 });
    // 3 ТБ архива → нужно 3,33 ТБ: 2×2 ТБ (1,9 млн) дешевле 1×4 ТБ (1,77 млн)? нет — 4 ТБ дешевле
    const a = pickHdd(3, r, EQ, PM)!;
    expect(a.hdd.slug).toBe("h4");
    expect(a.n * a.hdd.tb * HDD_USABLE).toBeGreaterThanOrEqual(3);
    // в один отсек 10 ТБ не влезает
    expect(pickHdd(10, rec({ slug: "r1", channels: 4, bays: 1, maxTbPerBay: 8 }), EQ, PM)).toBeNull();
  });
  it("коммутаторы: по портам и бюджету; камеры at — только на коммутатор с at", () => {
    expect(pickSwitches(many(4), EQ, PM)).toMatchObject({ sw: { slug: "sw4" }, n: 1 });
    expect(pickSwitches(many(4, { powerW: 20, poe: "at" }), EQ, PM)).toMatchObject({ sw: { slug: "sw8" }, n: 2 }); // 80 Вт > 60 → 2 шт.
    // 10 камер × 6 Вт: 3 × sw4 (900 тыс.) дешевле, чем 2 × sw8 (1,2 млн)
    expect(pickSwitches(many(10), EQ, PM)).toMatchObject({ sw: { slug: "sw4" }, n: 3 });
  });
  it("бренд регистратора — бренд большинства камер; при равенстве — оба", () => {
    expect(recorderBrands([cam(), cam({ brand: "Dahua" }), cam({ brand: "Dahua" })])).toEqual(["Dahua"]);
    expect(recorderBrands([cam(), cam({ brand: "Dahua" })])?.sort()).toEqual(["Dahua", "Hikvision"]);
    expect(recorderBrands([cam({ brand: undefined })])).toBeNull();
  });
});

describe("смета", () => {
  const week = { ...DEFAULT_SETTINGS, days: 7 };
  it("4 камеры: сравнивается полная стоимость — регистратор + диски + коммутаторы", () => {
    const r = estimate(many(4), { c4: 568_900 }, week, EQ, PM);
    // архив 1,2 ТБ → диск 2 ТБ; nvr4 + sw4 (800 тыс.) дешевле nvr8p с PoE (830 тыс.)
    expect(r.recorder?.slug).toBe("nvr4");
    expect(r.lines.find((l) => l.kind === "switch")).toMatchObject({ slug: "sw4", qty: 1 });
    expect(r.lines.find((l) => l.kind === "camera")).toMatchObject({ qty: 4, sum: 4 * 568_900 });
  });
  it("6 камер: регистратор 8 каналов с PoE закрывает питание без коммутаторов", () => {
    const r = estimate(many(6), { c4: 568_900 }, week, EQ, PM);
    expect(r.recorder?.slug).toBe("nvr8p");
    expect(r.lines.some((l) => l.kind === "switch")).toBe(false);
  });
  it("архив 30 суток не влезает в один отсек — берётся регистратор с бо́льшим числом отсеков", () => {
    const r = estimate(many(6), {}, DEFAULT_SETTINGS, EQ, PM);
    expect(r.storageTb).toBeCloseTo(storageTb(24, DEFAULT_SETTINGS), 9);
    expect(r.recorder!.bays).toBeGreaterThan(1);
  });
  it("камеры Dahua — регистратор Dahua; смешанный проект — пометка ONVIF", () => {
    const r = estimate([...many(3, { brand: "Dahua", key: "d", slug: "d" }), cam()], {}, DEFAULT_SETTINGS, EQ, PM);
    expect(r.recorder?.brand).toBe("Dahua");
    expect(r.warnings).toContainEqual({ code: "onvif", brands: ["Hikvision"] });
  });
  it("поток больше входящего у всех регистраторов — предупреждение вместо подбора", () => {
    const r = estimate(many(8, { nx: 3840, ny: 2160 }), {}, { ...DEFAULT_SETTINGS, codec: "h264" }, { ...EQ, recorders: EQ.recorders.filter((x) => x.slug !== "nvr16" && x.slug !== "nvr32") }, PM);
    expect(r.recorder).toBeNull();
    expect(r.warnings).toContainEqual({ code: "noRecorder", kind: "nvr" });
  });
  it("аналоговые камеры — DVR, блоки питания и кабель для них строками без цены", () => {
    const r = estimate(many(2, { kind: "analog", poe: "none", key: "a", slug: "a" }), {}, DEFAULT_SETTINGS, EQ, PM);
    expect(r.dvr?.slug).toBe("dvr4");
    expect(r.lines.find((l) => l.kind === "psu")).toMatchObject({ qty: 2, price: null });
    expect(r.lines.find((l) => l.kind === "coax")).toMatchObject({ qty: 2, price: null });
  });
  it("кабель: бухты отдельно для улицы и помещения; длинная линия — предупреждение", () => {
    const r = estimate([cam({ cableM: 200 }), cam({ cableM: 150 }), cam({ outdoor: true, cableM: 95, key: "o", slug: "o" })], {}, DEFAULT_SETTINGS, EQ, PM);
    expect(r.lines.filter((l) => l.kind === "cable").map((l) => [l.slug, l.qty])).toEqual([["in305", 2], ["out305", 1]]);
    expect(r.warnings.find((w) => w.code === "longCable")).toMatchObject({ keys: ["c4", "o"] });
  });
  it("монтаж — расценки calcPricing; высота > 4,5 м — ×1,4; минимальный заказ", () => {
    const one = estimate([cam({ cableM: 10 })], {}, { ...DEFAULT_SETTINGS, trace: "ready" }, { ...EQ, recorders: [] }, PM);
    expect(one.labor.find((l) => l.code === "camIn")?.price).toBe(PRICE.camIn);
    expect(one.totals.laborRaw).toBeLessThan(PRICE.minOrder);
    expect(one.totals.laborLow).toBe(PRICE.minOrder); // одна камера без регистратора — меньше минимального заказа
    const hi = estimate(many(10, { mountM: 5, cableM: 40, outdoor: true }), {}, DEFAULT_SETTINGS, EQ, PM);
    expect(hi.totals.kHigh).toBe(1.4);
    expect(hi.totals.laborLow).toBeCloseTo(hi.labor.reduce((a, l) => a + l.sum, 0) * 1.4, 6);
    expect(hi.totals.laborHigh).toBeCloseTo(hi.totals.laborLow * 1.25, 6);
  });
  it("позиции без цены — «по запросу» и в итог не входят", () => {
    const pm: PriceMap = { ...PM, nvr8p: { price: null, inStock: true }, nvr4: { price: null, inStock: true }, nvr16: { price: null, inStock: true }, nvr32: { price: null, inStock: true } };
    const r = estimate(many(6), { c4: 100 }, DEFAULT_SETTINGS, EQ, pm);
    const recLine = r.lines.find((l) => l.kind === "recorder")!;
    expect(recLine.sum).toBeNull();
    expect(r.totals.onRequest).toBeGreaterThanOrEqual(1);
    expect(r.totals.equipment).toBe(r.lines.reduce((a, l) => a + (l.sum ?? 0), 0));
  });
});
