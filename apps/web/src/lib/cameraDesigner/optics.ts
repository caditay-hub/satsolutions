/**
 * Оптика видеокамеры: поле зрения, размер сцены, плотность пикселей, обратный расчёт,
 * геометрия наклонной установки. Чистые функции без React, DOM и сети — их же гоняют тесты
 * и сервер (расчёт по умолчанию попадает в HTML страницы).
 *
 * Модель — прямолинейная (pinhole) оптика: годится для обычных объективов, НЕ для fisheye
 * и панорамных камер. Углы внутри — в радианах, на входе/выходе для людей — в градусах.
 * Расстояние «глубина» (depth) — по оптической оси до плоскости, перпендикулярной оси;
 * горизонтальная дальность по земле — отдельная величина (см. sideGeometry).
 * Формулы и допущения: docs/camera-designer/01-ARCHITECTURE.md §2.
 */

/** Пределы ввода. Вне пределов функции возвращают null, а не «как-нибудь» считают. */
export const LIMITS = {
  focalMm: [0.5, 300],
  sensorMm: [0.5, 50],
  px: [16, 20000],
  fovDeg: [0.5, 179],
  depthM: [0.1, 5000],
  widthM: [0.05, 5000],
  heightM: [0, 100],
  tiltDeg: [0, 89],
  ppm: [1, 10000],
} as const satisfies Record<string, readonly [number, number]>;

export type Range = readonly [number, number];

export const isNum = (x: unknown): x is number => typeof x === "number" && Number.isFinite(x);
export const inRange = (x: unknown, [lo, hi]: Range): x is number => isNum(x) && x >= lo && x <= hi;

export const rad = (deg: number) => (deg * Math.PI) / 180;
export const deg = (r: number) => (r * 180) / Math.PI;

export type Optics = {
  /** Поле зрения по горизонтали / вертикали / диагонали, радианы. */
  hfov: number;
  vfov: number;
  dfov: number;
  /** Пиксели кадра по горизонтали и вертикали (выбранный поток). */
  nx: number;
  ny: number;
  /** Вертикальный угол выведен из горизонтального и соотношения сторон, а не взят из паспорта. */
  vfovEstimated: boolean;
  /** Результат — оценка (промежуточный фокус вариофокала, выведенный угол). */
  estimate: boolean;
};

const dfovOf = (hfov: number, vfov: number) =>
  2 * Math.atan(Math.hypot(Math.tan(hfov / 2), Math.tan(vfov / 2)));

const pxOk = (nx: unknown, ny: unknown): boolean =>
  inRange(nx, LIMITS.px) && inRange(ny, LIMITS.px) && Number.isInteger(nx) && Number.isInteger(ny);

/** Поле зрения из активной области сенсора и фокусного расстояния (ТЗ §4.2). */
export function opticsFromSensor(p: { swMm: number; shMm: number; fMm: number; nx: number; ny: number }): Optics | null {
  const { swMm, shMm, fMm, nx, ny } = p;
  if (!inRange(swMm, LIMITS.sensorMm) || !inRange(shMm, LIMITS.sensorMm) || !inRange(fMm, LIMITS.focalMm) || !pxOk(nx, ny)) return null;
  const hfov = 2 * Math.atan(swMm / (2 * fMm));
  const vfov = 2 * Math.atan(shMm / (2 * fMm));
  return {
    hfov, vfov,
    dfov: 2 * Math.atan(Math.hypot(swMm, shMm) / (2 * fMm)),
    nx, ny, vfovEstimated: false, estimate: false,
  };
}

/**
 * Поле зрения по паспортным углам. Вертикальный угол необязателен: без него он выводится
 * из горизонтального при квадратном пикселе — tan(V/2) = tan(H/2)·ny/nx — и помечается оценкой.
 */
export function opticsFromFov(p: { hfovDeg: number; vfovDeg?: number | null; nx: number; ny: number }): Optics | null {
  const { hfovDeg, vfovDeg, nx, ny } = p;
  if (!inRange(hfovDeg, LIMITS.fovDeg) || !pxOk(nx, ny)) return null;
  const hfov = rad(hfovDeg);
  const given = vfovDeg !== null && vfovDeg !== undefined;
  if (given && !inRange(vfovDeg, LIMITS.fovDeg)) return null;
  const vfov = given ? rad(vfovDeg) : 2 * Math.atan((Math.tan(hfov / 2) * ny) / nx);
  return { hfov, vfov, dfov: dfovOf(hfov, vfov), nx, ny, vfovEstimated: !given, estimate: !given };
}

/**
 * Вариофокал по паспортным углам на краях диапазона. По каждому краю считаем эквивалентную
 * ширину сенсора Sw = 2·f·tan(HFOV/2) и линейно интерполируем её по фокусу. В крайних точках
 * результат совпадает с паспортом; между ними — оценка. Расхождение Sw краёв показывает,
 * насколько объектив отличается от идеальной модели (дисторсия, кроп).
 */
export function varifocalAt(p: {
  fMinMm: number; fMaxMm: number; hfovWideDeg: number; hfovTeleDeg: number; fMm: number; nx: number; ny: number;
}): { optics: Optics; swWideMm: number; swTeleMm: number; mismatch: number } | null {
  const { fMinMm, fMaxMm, hfovWideDeg, hfovTeleDeg, fMm, nx, ny } = p;
  if (!inRange(fMinMm, LIMITS.focalMm) || !inRange(fMaxMm, LIMITS.focalMm) || !(fMaxMm > fMinMm)) return null;
  if (!inRange(hfovWideDeg, LIMITS.fovDeg) || !inRange(hfovTeleDeg, LIMITS.fovDeg) || !(hfovWideDeg > hfovTeleDeg)) return null;
  if (!isNum(fMm) || fMm < fMinMm || fMm > fMaxMm || !pxOk(nx, ny)) return null;
  const swWideMm = 2 * fMinMm * Math.tan(rad(hfovWideDeg) / 2);
  const swTeleMm = 2 * fMaxMm * Math.tan(rad(hfovTeleDeg) / 2);
  const t = (fMm - fMinMm) / (fMaxMm - fMinMm);
  const sw = swWideMm + t * (swTeleMm - swWideMm);
  const hfov = t === 0 ? rad(hfovWideDeg) : t === 1 ? rad(hfovTeleDeg) : 2 * Math.atan(sw / (2 * fMm));
  const vfov = 2 * Math.atan((Math.tan(hfov / 2) * ny) / nx);
  return {
    optics: { hfov, vfov, dfov: dfovOf(hfov, vfov), nx, ny, vfovEstimated: true, estimate: true },
    swWideMm, swTeleMm,
    mismatch: Math.abs(swTeleMm - swWideMm) / swWideMm,
  };
}

/** Эквивалентная ширина и высота сенсора, которые дают этот угол при фокусе f. */
export function equivalentSensorMm(o: Optics, fMm: number): { swMm: number; shMm: number } | null {
  if (!inRange(fMm, LIMITS.focalMm)) return null;
  return { swMm: 2 * fMm * Math.tan(o.hfov / 2), shMm: 2 * fMm * Math.tan(o.vfov / 2) };
}

export type Scene = { widthM: number; heightM: number; ppmH: number; ppmV: number };

/** Размер сцены и плотность пикселей на плоскости, перпендикулярной оси, на глубине depthM. */
export function sceneAt(o: Optics, depthM: number): Scene | null {
  if (!inRange(depthM, LIMITS.depthM)) return null;
  const widthM = 2 * depthM * Math.tan(o.hfov / 2);
  const heightM = 2 * depthM * Math.tan(o.vfov / 2);
  return { widthM, heightM, ppmH: o.nx / widthM, ppmV: o.ny / heightM };
}

/** Наибольшая глубина по оси, на которой горизонтальная плотность ещё не ниже порога. */
export function depthForPpm(o: Optics, ppm: number): number | null {
  if (!inRange(ppm, LIMITS.ppm)) return null;
  return o.nx / (2 * Math.tan(o.hfov / 2) * ppm);
}

/* ───────────── обратный расчёт (ТЗ §4.4) ───────────── */

/** Угол, нужный, чтобы на глубине D поместилась ширина W, радианы. */
export function requiredHfov(depthM: number, widthM: number): number | null {
  if (!inRange(depthM, LIMITS.depthM) || !inRange(widthM, LIMITS.widthM)) return null;
  return 2 * Math.atan(widthM / (2 * depthM));
}

/** Сколько пикселей по горизонтали нужно, чтобы на ширине W была плотность ppm. */
export function requiredNx(widthM: number, ppm: number): number | null {
  if (!inRange(widthM, LIMITS.widthM) || !inRange(ppm, LIMITS.ppm)) return null;
  // −1e-9: 19.2857…·132.74… не должно превращаться в лишний пиксель из-за последнего знака double
  return Math.ceil(widthM * ppm - 1e-9);
}

/** Фокус, при котором на глубине D сцена шириной ровно W (для сенсора шириной Sw). */
export function requiredFocal(depthM: number, widthM: number, swMm: number): number | null {
  if (!inRange(depthM, LIMITS.depthM) || !inRange(widthM, LIMITS.widthM) || !inRange(swMm, LIMITS.sensorMm)) return null;
  return (depthM * swMm) / widthM;
}

/** Наименьший фокус, при котором на глубине D плотность не ниже ppm. */
export function requiredFocalForPpm(depthM: number, swMm: number, ppm: number, nx: number): number | null {
  if (!inRange(depthM, LIMITS.depthM) || !inRange(swMm, LIMITS.sensorMm) || !inRange(ppm, LIMITS.ppm) || !inRange(nx, LIMITS.px)) return null;
  return (depthM * swMm * ppm) / nx;
}

/**
 * Обе проверки подбора сразу: зона шириной W помещается в кадр И по всей этой ширине
 * плотность не ниже ppm. Узкий объектив проходит вторую, но проваливает первую.
 */
export function coverCheck(o: Optics, depthM: number, widthM: number, ppm: number) {
  const scene = sceneAt(o, depthM);
  if (!scene || !inRange(widthM, LIMITS.widthM) || !inRange(ppm, LIMITS.ppm)) return null;
  const covers = scene.widthM >= widthM * (1 - 1e-9);
  const dense = scene.ppmH >= ppm * (1 - 1e-9);
  return { scene, covers, dense, ok: covers && dense };
}

/* ───────────── высота и наклон (вид сбоку, ТЗ §4.5) ───────────── */

export type SideGeometry = {
  /** Превышение камеры над целью, м. */
  deltaM: number;
  /** Наклон оси вниз от горизонта, радианы. */
  tilt: number;
  /** Ближняя и дальняя горизонтальные дальности, на которых цель этой высоты попадает в кадр. */
  nearM: number;
  farM: number; // Infinity — верхняя кромка кадра выше горизонта
};

/**
 * Геометрия наклонной камеры над плоскостью цели (пол, высота номера, высота лица).
 * Камера должна быть выше цели: на одной высоте с целью вид сбоку не нужен — достаточно
 * глубины по оси.
 */
export function sideGeometry(o: Optics, p: { mountM: number; targetM: number; tiltDeg: number }): SideGeometry | null {
  const { mountM, targetM, tiltDeg } = p;
  if (!inRange(mountM, LIMITS.heightM) || !inRange(targetM, LIMITS.heightM) || !inRange(tiltDeg, LIMITS.tiltDeg)) return null;
  const deltaM = mountM - targetM;
  if (!(deltaM > 0)) return null;
  const tilt = rad(tiltDeg);
  const lower = tilt + o.vfov / 2;
  const upper = tilt - o.vfov / 2;
  const nearM = lower >= Math.PI / 2 ? 0 : deltaM / Math.tan(lower);
  const farM = upper <= 0 ? Infinity : deltaM / Math.tan(upper);
  return { deltaM, tilt, nearM, farM };
}

/** Глубина по оптической оси точки цели на горизонтальной дальности d. */
export const depthAtGround = (g: SideGeometry, dM: number) => dM * Math.cos(g.tilt) + g.deltaM * Math.sin(g.tilt);

/** Горизонтальная дальность, на которой глубина по оси равна depth. */
export const groundForDepth = (g: SideGeometry, depthM: number) => (depthM - g.deltaM * Math.sin(g.tilt)) / Math.cos(g.tilt);

/** Наклон, при котором ось смотрит точно в цель на дальности d. */
export function aimTiltDeg(mountM: number, targetM: number, dM: number): number | null {
  if (!inRange(dM, LIMITS.depthM) || !inRange(mountM, LIMITS.heightM) || !inRange(targetM, LIMITS.heightM) || !(mountM > targetM)) return null;
  return deg(Math.atan((mountM - targetM) / dM));
}

/**
 * Участок горизонтальной дальности, где цель в кадре И плотность не ниже ppm.
 * null — такого участка нет (порог недостижим даже у ближней кромки кадра).
 */
export function groundRangeForPpm(o: Optics, g: SideGeometry, ppm: number): { fromM: number; toM: number } | null {
  const zMax = depthForPpm(o, ppm);
  if (zMax === null) return null;
  const dMax = groundForDepth(g, zMax);
  const toM = Math.min(g.farM, dMax);
  if (!(toM > g.nearM)) return null;
  return { fromM: g.nearM, toM };
}
