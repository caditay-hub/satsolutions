/**
 * Сборка расчёта для калькулятора: из полей формы → оптика, сцена, уровни стандарта,
 * вид сбоку и обратный подбор. Один и тот же код считает и на сервере (значения по
 * умолчанию попадают в HTML), и в браузере.
 */
import {
  LIMITS, aimTiltDeg, coverCheck, deg, depthAtGround, depthForPpm, equivalentSensorMm, groundRangeForPpm, inRange,
  opticsFromFov, opticsFromSensor, requiredFocal, requiredFocalForPpm, requiredHfov, requiredNx, sceneAt, sideGeometry,
  varifocalAt, type Optics, type Scene, type SideGeometry,
} from "./optics";
import { PROFILES, evaluate, visibleLevels, type Level, type LevelResult, type StandardKey } from "./standards";

export type Mode = "direct" | "task";
export type LensKind = "fixed" | "vari" | "fisheye";
export type Source = "fov" | "sensor";

export type CalcInput = {
  mode: Mode;
  std: StandardKey;
  /** 2014: показывать все 6 уровней, а не четвёрку DORI. */
  all: boolean;
  lens: LensKind;
  src: Source;
  /** Паспортные углы (src=fov, фиксированный объектив), градусы; vfov — null, если не указан. */
  hfov: number;
  vfov: number | null;
  /** Кадр, пиксели. */
  nx: number;
  ny: number;
  /** Матрица (src=sensor), мм. */
  sw: number;
  sh: number;
  /** Фокус, мм: для фиксированного объектива — его фокус, для вариофокала — текущее положение. */
  f: number;
  /** Вариофокал: края диапазона и паспортные углы на них. */
  fmin: number;
  fmax: number;
  hw: number;
  ht: number;
  /** Дистанция, м: по оси (geo=false) или горизонтальная до цели (geo=true). */
  d: number;
  /** Учитывать высоту установки и наклон. */
  geo: boolean;
  mount: number;
  target: number;
  tilt: number;
  /** Под задачу: нужная ширина зоны, м, и нужный уровень. */
  w: number;
  lvl: string;
};

export const DEFAULT_INPUT: CalcInput = {
  mode: "direct", std: "2014", all: false,
  lens: "fixed", src: "fov",
  hfov: 90, vfov: null, nx: 2560, ny: 1440,
  sw: 5.4, sh: 3.04, f: 2.8,
  fmin: 2.8, fmax: 12, hw: 100, ht: 30,
  d: 10,
  geo: false, mount: 3, target: 1.6, tilt: 15,
  w: 8, lvl: "recognize",
};

export type FieldKey = keyof CalcInput;

export type LevelRow = LevelResult & {
  /** Наибольшая глубина по оси, на которой уровень достигается, м. */
  maxDepthM: number;
  /** С высотой и наклоном: участок горизонтальной дальности, где цель в кадре и уровень есть. */
  ground: { fromM: number; toM: number } | null;
};

export type TaskResult = {
  ppm: number;
  hfovReqDeg: number;
  nxReq: number;
  /** Подходит ли текущая камера: зона помещается и плотность достаточна. */
  check: ReturnType<typeof coverCheck>;
  /** Фокус для ширины W и наименьший фокус для плотности — если известна (эквивалентная) матрица. */
  focalForWidthMm: number | null;
  focalForPpmMm: number | null;
  /** Для типовых разрешений: какую ширину зоны каждое закрывает с нужной плотностью. */
  byResolution: { nx: number; maxWidthM: number; ok: boolean }[];
};

export type CalcResult =
  | { status: "unsupported" }
  | { status: "invalid"; fields: FieldKey[] }
  | {
      status: "ok";
      optics: Optics;
      hfovDeg: number;
      vfovDeg: number;
      dfovDeg: number;
      /** Эквивалентная матрица (из угла и фокуса), мм — для экспертного вида; null без фокуса. */
      sensor: { swMm: number; shMm: number } | null;
      /** Вариофокал: расхождение эквивалентных матриц краёв диапазона (0,05 = 5 %). */
      variMismatch: number | null;
      depthM: number;
      slantM: number | null;
      scene: Scene;
      side: SideGeometry | null;
      aimTiltDeg: number | null;
      levels: LevelRow[];
      task: TaskResult | null;
    };

/** Типовые ширины кадра IP-камер, px (2, 4, 5, 6, 8 Мп). */
export const COMMON_NX = [1920, 2560, 2688, 2880, 3200, 3840] as const;

function opticsOf(i: CalcInput): { o: Optics | null; bad: FieldKey[]; mismatch: number | null } {
  if (i.src === "sensor") {
    const bad: FieldKey[] = [];
    if (!inRange(i.sw, LIMITS.sensorMm)) bad.push("sw");
    if (!inRange(i.sh, LIMITS.sensorMm)) bad.push("sh");
    if (!inRange(i.f, LIMITS.focalMm)) bad.push("f");
    if (i.lens === "vari") {
      if (!inRange(i.fmin, LIMITS.focalMm)) bad.push("fmin");
      if (!inRange(i.fmax, LIMITS.focalMm) || !(i.fmax > i.fmin)) bad.push("fmax");
      if (!bad.includes("f") && (i.f < i.fmin || i.f > i.fmax)) bad.push("f");
    }
    const o = bad.length ? null : opticsFromSensor({ swMm: i.sw, shMm: i.sh, fMm: i.f, nx: i.nx, ny: i.ny });
    return { o, bad, mismatch: null };
  }
  if (i.lens === "vari") {
    const bad: FieldKey[] = [];
    if (!inRange(i.fmin, LIMITS.focalMm)) bad.push("fmin");
    if (!inRange(i.fmax, LIMITS.focalMm) || !(i.fmax > i.fmin)) bad.push("fmax");
    if (!inRange(i.hw, LIMITS.fovDeg)) bad.push("hw");
    if (!inRange(i.ht, LIMITS.fovDeg) || !(i.hw > i.ht)) bad.push("ht");
    if (!(i.f >= i.fmin && i.f <= i.fmax)) bad.push("f");
    if (bad.length) return { o: null, bad, mismatch: null };
    const v = varifocalAt({ fMinMm: i.fmin, fMaxMm: i.fmax, hfovWideDeg: i.hw, hfovTeleDeg: i.ht, fMm: i.f, nx: i.nx, ny: i.ny });
    return { o: v?.optics ?? null, bad: v ? [] : ["f"], mismatch: v?.mismatch ?? null };
  }
  const bad: FieldKey[] = [];
  if (!inRange(i.hfov, LIMITS.fovDeg)) bad.push("hfov");
  if (i.vfov !== null && !inRange(i.vfov, LIMITS.fovDeg)) bad.push("vfov");
  const o = bad.length ? null : opticsFromFov({ hfovDeg: i.hfov, vfovDeg: i.vfov, nx: i.nx, ny: i.ny });
  return { o, bad, mismatch: null };
}

/** Нужный уровень задачи — только из текущего профиля: уровни редакций не смешиваем. */
const levelOf = (i: CalcInput): Level | undefined => PROFILES[i.std].levels.find((l) => l.code === i.lvl);

export function compute(i: CalcInput): CalcResult {
  if (i.lens === "fisheye") return { status: "unsupported" };

  const bad: FieldKey[] = [];
  if (!inRange(i.nx, LIMITS.px) || !Number.isInteger(i.nx)) bad.push("nx");
  if (!inRange(i.ny, LIMITS.px) || !Number.isInteger(i.ny)) bad.push("ny");
  if (!inRange(i.d, LIMITS.depthM)) bad.push("d");
  if (i.geo) {
    if (!inRange(i.mount, LIMITS.heightM)) bad.push("mount");
    if (!inRange(i.target, LIMITS.heightM) || !(i.mount > i.target)) bad.push("target");
    if (!inRange(i.tilt, LIMITS.tiltDeg)) bad.push("tilt");
  }
  if (i.mode === "task") {
    if (!inRange(i.w, LIMITS.widthM)) bad.push("w");
    if (!levelOf(i)) bad.push("lvl");
  }
  const op = bad.includes("nx") || bad.includes("ny") ? { o: null, bad: [] as FieldKey[], mismatch: null } : opticsOf(i);
  bad.push(...op.bad);
  const o = op.o;
  if (!o || bad.length) return { status: "invalid", fields: bad.length ? [...new Set(bad)] : ["hfov"] };

  const side = i.geo ? sideGeometry(o, { mountM: i.mount, targetM: i.target, tiltDeg: i.tilt }) : null;
  if (i.geo && !side) return { status: "invalid", fields: ["target"] };
  const depthM = side ? depthAtGround(side, i.d) : i.d;
  const scene = sceneAt(o, depthM);
  if (!scene) return { status: "invalid", fields: ["d"] };

  const levels: LevelRow[] = evaluate(i.std, scene.ppmH, i.all).map((l) => ({
    ...l,
    maxDepthM: depthForPpm(o, l.ppm) ?? 0,
    ground: side ? groundRangeForPpm(o, side, l.ppm) : null,
  }));

  // Фокус известен — у сенсорного ввода и у вариофокала; у фиксированного по углам — тоже
  // (поле f), но тогда матрица — эквивалентная, а не паспортная.
  const sensor = i.src === "sensor" ? { swMm: i.sw, shMm: i.sh } : equivalentSensorMm(o, i.f);

  let task: TaskResult | null = null;
  if (i.mode === "task") {
    const lv = levelOf(i)!;
    const hReq = requiredHfov(depthM, i.w)!;
    task = {
      ppm: lv.ppm,
      hfovReqDeg: deg(hReq),
      nxReq: requiredNx(i.w, lv.ppm)!,
      check: coverCheck(o, depthM, i.w, lv.ppm),
      focalForWidthMm: sensor ? requiredFocal(depthM, i.w, sensor.swMm) : null,
      focalForPpmMm: sensor ? requiredFocalForPpm(depthM, sensor.swMm, lv.ppm, o.nx) : null,
      byResolution: COMMON_NX.map((nx) => ({ nx, maxWidthM: nx / lv.ppm, ok: nx / lv.ppm >= i.w * (1 - 1e-9) })),
    };
  }

  return {
    status: "ok",
    optics: o,
    hfovDeg: deg(o.hfov),
    vfovDeg: deg(o.vfov),
    dfovDeg: deg(o.dfov),
    sensor,
    variMismatch: op.mismatch,
    depthM,
    slantM: side ? Math.hypot(i.d, side.deltaM) : null,
    scene,
    side,
    aimTiltDeg: i.geo ? aimTiltDeg(i.mount, i.target, i.d) : null,
    levels,
    task,
  };
}

/** Для подписи уровня в задаче: уровни текущего профиля (выбор задачи идёт из них). */
export const taskLevels = (std: StandardKey, all: boolean) => visibleLevels(std, all);
