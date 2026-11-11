/**
 * Простой режим калькулятора (редизайн 11.11.2026, решения владельца): четыре настройки вместо
 * полной формы — объектив, расстояние, качество камеры, что нужно видеть. Это лишь способ задать
 * тот же CalcInput: расчёт делает общее ядро (calculate.ts), формулы те же.
 *
 * Типовая камера: одна матрица 1/2.8" (5,37 × 3,02 мм) для всех разрешений — угол зависит только
 * от объектива и не меняется при смене мегапикселей. Задачи привязаны к уровням IEC 62676-4:2014:
 * общий обзор = обнаружение (25 пикс./м), действия человека = наблюдение (62,5),
 * детали лица = распознавание (125). Идентификацию (250) простой режим не обещает.
 */
import { DEFAULT_INPUT, compute, type CalcInput } from "./calculate";
import { depthForPpm, requiredFocalForPpm, sceneAt, type Optics } from "./optics";
import { PROFILES, type LevelCode } from "./standards";

export const SIMPLE_SENSOR = { sw: 5.37, sh: 3.02, name: '1/2.8"' } as const;
export const SIMPLE_LENSES = [2.8, 3.6, 4, 6, 8, 12] as const;
export const SIMPLE_MP = [
  { mp: 2, nx: 1920, ny: 1080 },
  { mp: 4, nx: 2560, ny: 1440 },
  { mp: 5, nx: 2880, ny: 1620 },
  { mp: 8, nx: 3840, ny: 2160 },
] as const;
export type SimpleTask = "overview" | "actions" | "face";
export const SIMPLE_TASKS: { key: SimpleTask; lvl: LevelCode }[] = [
  { key: "overview", lvl: "detect" },
  { key: "actions", lvl: "observe" },
  { key: "face", lvl: "recognize" },
];
export const SIMPLE_DIST = { min: 1, max: 100, start: 10, quick: [5, 10, 20, 50] } as const;

export type SimpleState = { f: number; mp: number; d: number; task: SimpleTask };
export const SIMPLE_DEFAULT: SimpleState = { f: 2.8, mp: 4, d: SIMPLE_DIST.start, task: "actions" };

const ppmOf = (task: SimpleTask) => PROFILES["2014"].levels.find((l) => l.code === SIMPLE_TASKS.find((t) => t.key === task)!.lvl)!.ppm;
export const taskPpm = ppmOf;
export const taskOfLevel = (lvl: string): SimpleTask | null => SIMPLE_TASKS.find((t) => t.lvl === lvl)?.key ?? null;
const mpOf = (mp: number) => SIMPLE_MP.find((m) => m.mp === mp) ?? SIMPLE_MP[1];

/** Вход расчёта для простых настроек; режим (одна камера / подбор) и ширину зоны берём из base. */
export function simpleInput(s: SimpleState, base: CalcInput = DEFAULT_INPUT): CalcInput {
  const m = mpOf(s.mp);
  return {
    ...base,
    std: "2014", all: false,
    lens: "fixed", src: "sensor", sw: SIMPLE_SENSOR.sw, sh: SIMPLE_SENSOR.sh, f: s.f,
    nx: m.nx, ny: m.ny, d: s.d, geo: false,
    lvl: SIMPLE_TASKS.find((t) => t.key === s.task)!.lvl,
  };
}

/** Простые настройки, если вход им соответствует; null — камера задана вручную («Для специалистов»). */
export function simpleOf(i: CalcInput): SimpleState | null {
  if (i.lens !== "fixed" || i.src !== "sensor" || i.geo || i.std !== "2014") return null;
  if (Math.abs(i.sw - SIMPLE_SENSOR.sw) > 1e-6 || Math.abs(i.sh - SIMPLE_SENSOR.sh) > 1e-6) return null;
  if (!SIMPLE_LENSES.some((f) => Math.abs(f - i.f) < 1e-6)) return null;
  const m = SIMPLE_MP.find((x) => x.nx === i.nx && x.ny === i.ny);
  const task = taskOfLevel(i.lvl);
  if (!m || !task || !Number.isFinite(i.d)) return null;
  return { f: i.f, mp: m.mp, d: i.d, task };
}

/* ─────────── три результата человеческим языком ─────────── */

export type Advice =
  /** Узкий объектив той же камеры даёт нужную детализацию. */
  | { kind: "narrower"; f: number; widthM: number; ppm: number }
  /** Даже 12 мм мало — нужна камера с бо́льшим разрешением (и объектив f). */
  | { kind: "moreMp"; mp: number; f: number }
  /** Из простых вариантов ничего не подходит. */
  | { kind: "none" }
  /** Запас: более широкий объектив тоже справится и охватит больше. */
  | { kind: "wider"; f: number; widthM: number }
  /** Объектив подобран точно. */
  | { kind: "exact" }
  /** Камера задана вручную: хватает до maxDepthM. */
  | { kind: "customOk"; maxDepthM: number }
  /** Камера задана вручную: нужен угол не шире hfovDeg или nxReq пикселей по ширине. */
  | { kind: "customNo"; hfovDeg: number; nxReq: number };

export type Summary = {
  depthM: number; widthM: number; heightM: number; ppm: number;
  /** Нужная плотность выбранной задачи и её достаточность. */
  need: number; ok: boolean;
  /** До какой глубины по оси задача выполняется. */
  maxDepthM: number;
  advice: Advice;
};

const okAt = (f: number, nx: number, d: number, need: number) => (d * SIMPLE_SENSOR.sw * need) / nx <= f + 1e-9;
const widthAt = (f: number, d: number) => (d * SIMPLE_SENSOR.sw) / f;

/** Ширина, детализация и рекомендация для текущего входа. Тот же расчёт, что у сцены и цифр. */
export function summarize(i: CalcInput, o: Optics, depthM: number, need: number): Summary | null {
  const scene = sceneAt(o, depthM);
  const maxDepthM = depthForPpm(o, need);
  if (!scene || maxDepthM === null) return null;
  const ok = scene.ppmH >= need * (1 - 1e-9);
  const s = simpleOf(i);
  let advice: Advice;
  if (!s) {
    if (ok) advice = { kind: "customOk", maxDepthM };
    else {
      // угол, при котором текущая матрица даёт need на этой глубине: tan(h/2) = nx / (2·D·need)
      const hfovDeg = (2 * Math.atan(o.nx / (2 * depthM * need)) * 180) / Math.PI;
      advice = { kind: "customNo", hfovDeg, nxReq: Math.ceil(scene.widthM * need - 1e-9) };
    }
  } else {
    const nx = mpOf(s.mp).nx;
    if (!ok) {
      const fReq = requiredFocalForPpm(depthM, SIMPLE_SENSOR.sw, need, nx);
      const f = SIMPLE_LENSES.find((x) => fReq !== null && x >= fReq - 1e-9);
      if (f !== undefined) advice = { kind: "narrower", f, widthM: widthAt(f, depthM), ppm: nx / widthAt(f, depthM) };
      else {
        // 12 мм мало: ищем наименьшее разрешение, при котором хватает какого-то из объективов
        const alt = SIMPLE_MP.filter((m) => m.mp > s.mp).map((m) => ({ m, f: SIMPLE_LENSES.find((x) => okAt(x, m.nx, depthM, need)) })).find((x) => x.f !== undefined);
        advice = alt ? { kind: "moreMp", mp: alt.m.mp, f: alt.f! } : { kind: "none" };
      }
    } else {
      const wider = SIMPLE_LENSES.find((x) => x < s.f - 1e-9 && okAt(x, nx, depthM, need));
      advice = wider !== undefined ? { kind: "wider", f: wider, widthM: widthAt(wider, depthM) } : { kind: "exact" };
    }
  }
  return { depthM, widthM: scene.widthM, heightM: scene.heightM, ppm: scene.ppmH, need, ok, maxDepthM, advice };
}

/** Полный расчёт простого режима — для тестов и серверного первого кадра. */
export function computeSimple(s: SimpleState) {
  const i = simpleInput(s);
  const r = compute(i);
  if (r.status !== "ok") return null;
  return { input: i, result: r, summary: summarize(i, r.optics, r.depthM, ppmOf(s.task))! };
}

/* ─────────── подбор: место установки и типовая камера ─────────── */

export type Place = "street" | "office" | "warehouse" | "parking" | "entrance";
/** Типичные расстояние, ширина зоны и задача по месту (решение владельца 11.11, клиент меняет). */
export const PLACES: { key: Place; d: number; w: number; task: SimpleTask; outdoor: boolean }[] = [
  { key: "street", d: 20, w: 15, task: "actions", outdoor: true },
  { key: "office", d: 8, w: 6, task: "actions", outdoor: false },
  { key: "warehouse", d: 20, w: 8, task: "actions", outdoor: false },
  { key: "parking", d: 25, w: 20, task: "overview", outdoor: true },
  { key: "entrance", d: 5, w: 3, task: "face", outdoor: true },
];

/**
 * Какая типовая камера (матрица 1/2.8", объективы и разрешения простого режима) закрывает задачу:
 * зона шириной w на глубине d помещается в кадр и плотность не ниже need. Берётся наименьшее
 * разрешение, а при нём — самый узкий объектив, который ещё охватывает зону (больше пикселей на метр).
 */
export function pickTypical(d: number, w: number, need: number): { mp: number; f: number; widthM: number; ppm: number } | null {
  for (const m of SIMPLE_MP) {
    const f = [...SIMPLE_LENSES].reverse().find((x) => widthAt(x, d) >= w * (1 - 1e-9));
    if (f === undefined) return null; // даже 2,8 мм не охватывает зону — одной типовой камерой не закрыть
    const widthM = widthAt(f, d), ppm = m.nx / widthM;
    if (ppm >= need * (1 - 1e-9)) return { mp: m.mp, f, widthM, ppm };
  }
  return null;
}
