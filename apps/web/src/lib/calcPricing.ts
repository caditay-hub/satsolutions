/**
 * Калькулятор стоимости монтажа слаботочных систем.
 *
 * Источник цен — «Единый прайс на слаботочные работы» (август 2026). Считаем
 * ТОЛЬКО работы: монтаж, пусконаладка, прокладка кабеля. Оборудование клиент
 * покупает отдельно (в каталоге), поэтому в смету оно не входит.
 *
 * Логика вынесена из компонента, чтобы её можно было прогонять тестами и
 * переиспользовать на страницах услуг.
 */

/** Расценки, сум за единицу. */
export const PRICE = {
  camIn: 155_000, camOut: 180_000, camPtz: 310_000, camSetup: 34_000,
  nvr: 280_000, nvrBig: 450_000, pnrCam: 43_000, remote: 170_000,
  reader: 85_000, bio: 170_000, ctrl: 215_000, lockMag: 110_000,
  exitBtn: 43_000, closer: 100_000, pnrDoor: 110_000,
  panelOne: 135_000, panelMulti: 280_000, monitor: 135_000, floorSw: 70_000,
  smoke: 65_000, ipr: 55_000, ppk: 360_000, siren: 70_000, exitSign: 55_000, pnrLoop: 145_000,
  outlet: 23_000, patchPort: 11_000, rack: 170_000, swUn: 70_000, swMan: 215_000, wifi: 110_000,
  irBarrier: 360_000, fenceCable: 17_000,
  cableTray: 5_500, cableOpen: 7_000, gofra: 9_000, shtroba: 23_000,
  minOrder: 560_000,
} as const;

export type ObjectKey = "shop" | "office" | "wh" | "house" | "prod" | "resid";
export type SystemKey = "cctv" | "acs" | "intr" | "fire" | "lan" | "perim";

/** Типовые объекты: площадь и стартовые количества «по умолчанию». */
export const OBJECTS: Record<ObjectKey, { area: number; cam: number; doors: number; wifi: number; w: number }> = {
  shop:   { area: 200,  cam: 8,  doors: 2, wifi: 2, w: 1.0 },
  office: { area: 300,  cam: 10, doors: 4, wifi: 3, w: 1.0 },
  wh:     { area: 1200, cam: 14, doors: 3, wifi: 4, w: 1.15 },
  house:  { area: 250,  cam: 6,  doors: 1, wifi: 2, w: 1.0 },
  prod:   { area: 1500, cam: 16, doors: 4, wifi: 5, w: 1.2 },
  resid:  { area: 600,  cam: 9,  doors: 3, wifi: 0, w: 1.1 },
};

export const OBJECT_KEYS = Object.keys(OBJECTS) as ObjectKey[];

type FieldNum = { k: string; type: "num"; def: (o: typeof OBJECTS[ObjectKey]) => number; max: number; step?: number };
type FieldSeg = { k: string; type: "seg"; opts: string[]; def: () => string };
export type Field = FieldNum | FieldSeg;

/** Системы и их параметры. Порядок — как в интерфейсе. */
export const SYSTEMS: { id: SystemKey; fields: Field[] }[] = [
  { id: "cctv", fields: [
    { k: "in",  type: "num", def: (o) => Math.round(o.cam * 0.6), max: 120 },
    { k: "out", type: "num", def: (o) => Math.round(o.cam * 0.4), max: 120 },
    { k: "ptz", type: "num", def: () => 0, max: 20 },
  ] },
  { id: "acs", fields: [
    { k: "doors", type: "num", def: (o) => o.doors, max: 60 },
    { k: "kind",  type: "seg", opts: ["card", "bio"], def: () => "card" },
  ] },
  { id: "intr", fields: [
    { k: "kind", type: "seg", opts: ["one", "multi"], def: () => "one" },
    { k: "mon",  type: "num", def: () => 1, max: 200 },
  ] },
  { id: "fire", fields: [
    { k: "auto", type: "seg", opts: ["on", "off"], def: () => "on" },
    { k: "det",  type: "num", def: (o) => Math.max(4, Math.round(o.area / 30)), max: 600 },
  ] },
  { id: "lan", fields: [
    { k: "ports", type: "num", def: (o) => Math.max(4, Math.round(o.area / 40)), max: 400 },
    { k: "wifi",  type: "num", def: (o) => o.wifi, max: 60 },
    { k: "sw",    type: "seg", opts: ["un", "man"], def: () => "un" },
  ] },
  { id: "perim", fields: [
    { k: "len",  type: "num", def: () => 100, step: 10, max: 3000 },
    { k: "kind", type: "seg", opts: ["ir", "cable"], def: () => "ir" },
  ] },
];

export type CalcState = {
  obj: ObjectKey;
  area: number;
  /** Какие системы отмечены. */
  on: Record<SystemKey, boolean>;
  /** Значения полей по системам. */
  v: Record<SystemKey, Record<string, number | string>>;
  /** need — трассы прокладываем с нуля, ready — уже есть лотки/гофра. */
  trace: "need" | "ready";
  /** Высота монтажа: no — до 3 м, mid — 3–4,5 м, hi — выше 4,5 м. */
  high: "no" | "mid" | "hi";
};

/** Строка сметы: ключ системы для перевода, сумма и количество для подписи. */
export type CalcLine = { key: string; sum: number; qty: number };

export type CalcResult = {
  lines: CalcLine[];
  low: number;
  high: number;
  cableM: number;
  points: number;
  kHigh: number;
};

/** Начальное состояние: магазин, включено видеонаблюдение. */
export function initialState(): CalcState {
  const st: CalcState = {
    obj: "shop", area: OBJECTS.shop.area,
    on: { cctv: true, acs: false, intr: false, fire: false, lan: false, perim: false },
    v: { cctv: {}, acs: {}, intr: {}, fire: {}, lan: {}, perim: {} },
    trace: "need", high: "no",
  };
  applyDefaults(st);
  return st;
}

/** Пересчитать значения полей под выбранный объект. */
export function applyDefaults(st: CalcState) {
  const o = { ...OBJECTS[st.obj], area: st.area };
  for (const s of SYSTEMS) {
    for (const f of s.fields) st.v[s.id][f.k] = f.type === "num" ? f.def(o) : f.def();
  }
}

export function calc(st: CalcState): CalcResult {
  const o = OBJECTS[st.obj], A = st.area, v = st.v;
  const lines: CalcLine[] = [];
  // Средняя длина кабеля от точки до стойки: sqrt(площади) — характерный размер
  // помещения, ×1,2 — запас на обход стен и спуски.
  const runLen = Math.max(10, Math.round(Math.sqrt(A) * 1.2));
  let cableM = 0, points = 0, sum = 0;
  const n = (x: unknown) => Number(x) || 0;

  if (st.on.cctv) {
    const ci = n(v.cctv.in), co = n(v.cctv.out), ptz = n(v.cctv.ptz), total = ci + co + ptz;
    if (total) {
      let s = ci * PRICE.camIn + co * PRICE.camOut + ptz * PRICE.camPtz + total * PRICE.camSetup + total * PRICE.pnrCam;
      s += (total > 16 ? PRICE.nvrBig : PRICE.nvr) + PRICE.remote;
      lines.push({ key: "cctv", sum: s, qty: total }); sum += s; cableM += total * runLen; points += total;
    }
  }
  if (st.on.acs) {
    const d = n(v.acs.doors);
    if (d) {
      const rd = v.acs.kind === "bio" ? PRICE.bio : PRICE.reader;
      const s = d * (rd + PRICE.lockMag + PRICE.exitBtn + PRICE.closer + PRICE.pnrDoor) + Math.ceil(d / 4) * PRICE.ctrl;
      lines.push({ key: "acs", sum: s, qty: d }); sum += s; cableM += d * runLen * 0.8; points += d;
    }
  }
  if (st.on.intr) {
    const m = n(v.intr.mon), multi = v.intr.kind === "multi";
    const s = (multi ? PRICE.panelMulti : PRICE.panelOne) + m * PRICE.monitor + (multi ? Math.ceil(m / 8) * PRICE.floorSw : 0);
    lines.push({ key: "intr", sum: s, qty: m }); sum += s; cableM += m * runLen * 0.6; points += 1;
  }
  if (st.on.fire) {
    const det = v.fire.auto === "on" ? Math.max(4, Math.round(A / 30)) : n(v.fire.det);
    const ipr = Math.max(1, Math.round(det / 12));
    const sir = Math.max(1, Math.round(A / 250));
    const sign = Math.max(1, Math.round(A / 300));
    const loops = Math.max(1, Math.ceil(det / 20));
    const s = det * PRICE.smoke + ipr * PRICE.ipr + PRICE.ppk + sir * PRICE.siren + sign * PRICE.exitSign + loops * PRICE.pnrLoop;
    lines.push({ key: "fire", sum: s, qty: det }); sum += s; cableM += det * runLen * 0.5; points += det;
  }
  if (st.on.lan) {
    const p = n(v.lan.ports), w = n(v.lan.wifi);
    const s = p * PRICE.outlet + p * PRICE.patchPort + PRICE.rack + (v.lan.sw === "man" ? PRICE.swMan : PRICE.swUn) + w * PRICE.wifi;
    lines.push({ key: "lan", sum: s, qty: p }); sum += s; cableM += (p + w) * runLen; points += p + w;
  }
  if (st.on.perim) {
    const L = n(v.perim.len);
    const s = v.perim.kind === "ir" ? Math.max(1, Math.round(L / 50)) * PRICE.irBarrier : L * PRICE.fenceCable;
    lines.push({ key: "perim", sum: s, qty: L }); sum += s; cableM += L * 0.4;
  }

  cableM = Math.round(cableM);
  if (cableM) {
    if (st.trace === "need") {
      // Кабели идут пучком по общей трассе: гофру и штробу считаем на ДЛИНУ
      // ТРАССЫ, а не на каждый кабель. Иначе трассы дают вчетверо больше, чем
      // весь остальной монтаж.
      const routeM = Math.round(cableM * 0.38);
      const s = cableM * PRICE.cableOpen + routeM * 0.6 * PRICE.gofra + routeM * 0.25 * PRICE.shtroba;
      lines.push({ key: "route", sum: s, qty: cableM }); sum += s;
    } else {
      const s = cableM * PRICE.cableTray;
      lines.push({ key: "pull", sum: s, qty: cableM }); sum += s;
    }
  }

  const kHigh = st.high === "hi" ? 1.4 : st.high === "mid" ? 1.2 : 1;
  sum = sum * kHigh * o.w;
  const low = Math.max(PRICE.minOrder, sum);
  return { lines, low, high: low * 1.25, cableM, points, kHigh };
}

/** Единичные расценки для выбранных систем — их показываем перед итогом. */
export function unitRates(st: CalcState, r: CalcResult): { key: string; price: number; unit: "pc" | "m" | "set" }[] {
  const out: { key: string; price: number; unit: "pc" | "m" | "set" }[] = [];
  const n = (x: unknown) => Number(x) || 0;
  if (st.on.cctv) {
    if (n(st.v.cctv.in)) out.push({ key: "camIn", price: PRICE.camIn, unit: "pc" });
    if (n(st.v.cctv.out)) out.push({ key: "camOut", price: PRICE.camOut, unit: "pc" });
    if (n(st.v.cctv.ptz)) out.push({ key: "camPtz", price: PRICE.camPtz, unit: "pc" });
  }
  if (st.on.acs && n(st.v.acs.doors))
    out.push(st.v.acs.kind === "bio"
      ? { key: "bio", price: PRICE.bio, unit: "pc" }
      : { key: "reader", price: PRICE.reader, unit: "pc" });
  if (st.on.intr && n(st.v.intr.mon)) out.push({ key: "monitor", price: PRICE.monitor, unit: "pc" });
  if (st.on.fire) out.push({ key: "smoke", price: PRICE.smoke, unit: "pc" });
  if (st.on.lan && n(st.v.lan.ports)) out.push({ key: "outlet", price: PRICE.outlet + PRICE.patchPort, unit: "pc" });
  if (st.on.perim && n(st.v.perim.len))
    out.push(st.v.perim.kind === "cable"
      ? { key: "fenceCable", price: PRICE.fenceCable, unit: "m" }
      : { key: "irBarrier", price: PRICE.irBarrier, unit: "set" });
  if (r.cableM) out.push(st.trace === "need"
    ? { key: "cableOpen", price: PRICE.cableOpen, unit: "m" }
    : { key: "cableTray", price: PRICE.cableTray, unit: "m" });
  return out.slice(0, 6);
}
