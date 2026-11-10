/**
 * Проект плана объекта (этап C): камеры, стены, зоны охраны, масштаб. Хранится только в браузере
 * клиента (решение владельца 10.11): автосохранение в IndexedDB и файл .satplan. Здесь — типы,
 * расчёт оптики камеры в текущем положении зума и строгий разбор файла проекта.
 *
 * У камеры из каталога в проект копируются углы из cameraOptics.json (снимок): файл откроется
 * и через год, даже если карточку переименуют или снимут.
 */
import { LIMITS, inRange, isNum, rad, deg, varifocalAt } from "../optics";
import { ENGINE_VERSION, PROFILES, type StandardKey } from "../standards";
import type { CamPose, Segment, Vec2 } from "./geometry";
import { DEFAULT_SETTINGS, type EstSettings } from "../estimate/estimate";

export const PLAN_FORMAT = "sat-camera-plan";
export const PLAN_VERSION = 1;

/** Лимиты (решение владельца 10.11): файл плана до 30 МБ, сторона картинки до 4096 px, до 64 камер. */
export const PLAN_LIMITS = {
  fileBytes: 30 * 1024 * 1024,
  imagePx: 4096,
  cams: 64,
  walls: 500,
  zones: 20,
  zonePoints: 200,
  /** Размер плана в метрах (сетка без картинки и картинка после калибровки). */
  sizeM: [1, 5000] as const,
  mountM: [0.3, 100] as const,
  targetM: [0, 3] as const,
};

export type CamVariant = {
  focalMm: [number, number] | null;
  hfovDeg: [number, number];
  vfovDeg: [number, number] | null;
  status: "verified" | "needs_review" | "custom";
};

export type CamSpec = {
  source: "catalog" | "custom";
  productId?: string;
  slug?: string;
  brand?: string;
  model: string;
  lensType: "fixed" | "varifocal" | "ptz";
  nx: number;
  ny: number;
  variants: CamVariant[];
  distortion?: boolean;
  analog?: boolean;
};

export type PlanCamera = {
  id: string;
  /** Номер на плане: К1, К2… */
  n: number;
  x: number;
  y: number;
  mountM: number;
  panDeg: number;
  tiltDeg: number;
  /** Положение зума 0…1 (вариофокал и PTZ), у фиксированного объектива не используется. */
  zoom: number;
  vi: number;
  spec: CamSpec;
  /** Уличная установка (смета: расценка монтажа и уличный кабель). */
  outdoor?: boolean;
};

export type PlanBg =
  | { kind: "image"; wPx: number; hPx: number; /** метров на пиксель картинки; null — масштаб ещё не задан */ scale: number | null }
  | { kind: "grid"; wM: number; hM: number };

export type PlanProject = {
  format: typeof PLAN_FORMAT;
  version: typeof PLAN_VERSION;
  engine: string;
  std: StandardKey;
  profileId: string;
  all: boolean;
  targetM: number;
  bg: PlanBg | null;
  cams: PlanCamera[];
  walls: Segment[];
  zones: Vec2[][];
  showOverlap: boolean;
  /** Шкаф с регистратором (этап D): от него считается длина кабеля до камер. */
  rack: Vec2 | null;
  est: EstSettings;
  updatedAt: string;
};

export function emptyProject(): PlanProject {
  return {
    format: PLAN_FORMAT, version: PLAN_VERSION, engine: ENGINE_VERSION,
    std: "2014", profileId: PROFILES["2014"].id, all: false,
    targetM: 1.6, bg: null, cams: [], walls: [], zones: [], showOverlap: true,
    rack: null, est: { ...DEFAULT_SETTINGS },
    updatedAt: new Date(0).toISOString(),
  };
}

/** Средняя длина кабеля на камеру, если шкаф не отмечен (как ручной режим сметы). */
export const DEFAULT_CABLE_M = 30;

/**
 * Длина кабеля от шкафа до камеры: трасса вдоль стен (по осям, а не по прямой), подъём к камере
 * (высота установки − 1 м уровня шкафа), 1 м на подключение и 10 % запаса.
 */
export function cableRun(c: { x: number; y: number; mountM: number }, rack: Vec2): number {
  return (Math.abs(c.x - rack.x) + Math.abs(c.y - rack.y) + Math.max(0, c.mountM - 1) + 1) * 1.1;
}

/** Границы плана в метрах; null — масштаб картинки ещё не задан. */
export function planBounds(bg: PlanBg | null): { x: number; y: number; w: number; h: number } | null {
  if (!bg) return null;
  if (bg.kind === "grid") return { x: 0, y: 0, w: bg.wM, h: bg.hM };
  return bg.scale ? { x: 0, y: 0, w: bg.wPx * bg.scale, h: bg.hPx * bg.scale } : null;
}

export const isZoom = (v: CamVariant) => v.hfovDeg[0] !== v.hfovDeg[1];

/**
 * Оптика камеры в текущем положении зума. У фиксированного объектива — паспортные углы.
 * У зума с известным фокусом — модель вариофокала калькулятора (varifocalAt): на краях паспорт,
 * между ними оценка. Без фокуса — линейно по 1/tan(H/2), что для идеального объектива то же самое.
 */
export function opticsAt(spec: CamSpec, vi: number, zoom: number): { hfovDeg: number; vfovDeg: number; focalMm: number | null; estimate: boolean } | null {
  const v = spec.variants[vi] ?? spec.variants[0];
  if (!v) return null;
  const aspect = (h: number) => deg(2 * Math.atan((Math.tan(rad(h) / 2) * spec.ny) / spec.nx));
  if (!isZoom(v)) {
    const h = v.hfovDeg[0];
    return { hfovDeg: h, vfovDeg: v.vfovDeg ? v.vfovDeg[0] : aspect(h), focalMm: v.focalMm ? v.focalMm[0] : null, estimate: !v.vfovDeg };
  }
  const t = Math.min(1, Math.max(0, isNum(zoom) ? zoom : 0));
  if (t === 0 || t === 1) {
    const end = t;
    const h = v.hfovDeg[end];
    return { hfovDeg: h, vfovDeg: v.vfovDeg ? v.vfovDeg[end] : aspect(h), focalMm: v.focalMm ? v.focalMm[end] : null, estimate: !v.vfovDeg };
  }
  const f = v.focalMm;
  if (f && f[1] > f[0]) {
    const fm = f[0] + t * (f[1] - f[0]);
    const r = varifocalAt({ fMinMm: f[0], fMaxMm: f[1], hfovWideDeg: v.hfovDeg[0], hfovTeleDeg: v.hfovDeg[1], fMm: fm, nx: spec.nx, ny: spec.ny });
    if (r) return { hfovDeg: deg(r.optics.hfov), vfovDeg: deg(r.optics.vfov), focalMm: fm, estimate: true };
  }
  const k0 = 1 / Math.tan(rad(v.hfovDeg[0]) / 2), k1 = 1 / Math.tan(rad(v.hfovDeg[1]) / 2);
  const h = deg(2 * Math.atan(1 / (k0 + t * (k1 - k0))));
  return { hfovDeg: h, vfovDeg: aspect(h), focalMm: null, estimate: true };
}

export function poseOf(c: PlanCamera): CamPose | null {
  const o = opticsAt(c.spec, c.vi, c.zoom);
  if (!o) return null;
  return { x: c.x, y: c.y, mountM: c.mountM, panDeg: c.panDeg, tiltDeg: c.tiltDeg, hfovDeg: o.hfovDeg, vfovDeg: o.vfovDeg, nx: c.spec.nx };
}

/* ───────────── разбор файла проекта ───────────── */

const num = (x: unknown, r: readonly [number, number]) => (inRange(x, r) ? x : null);
const str = (x: unknown, max: number) => (typeof x === "string" && x.length <= max ? x : null);
const COORD = [-100000, 100000] as const;
const pt = (x: unknown): Vec2 | null => {
  const o = x as { x?: unknown; y?: unknown } | null;
  const px = num(o?.x, COORD), py = num(o?.y, COORD);
  return px === null || py === null ? null : { x: px, y: py };
};
const pair = (x: unknown, r: readonly [number, number]): [number, number] | null =>
  Array.isArray(x) && x.length === 2 && inRange(x[0], r) && inRange(x[1], r) ? [x[0], x[1]] : null;

function parseSpec(x: unknown): CamSpec | null {
  const o = x as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const source = o.source === "catalog" || o.source === "custom" ? o.source : null;
  const lensType = o.lensType === "fixed" || o.lensType === "varifocal" || o.lensType === "ptz" ? o.lensType : null;
  const model = str(o.model, 120);
  const nx = num(o.nx, LIMITS.px), ny = num(o.ny, LIMITS.px);
  if (!source || !lensType || model === null || nx === null || ny === null || !Number.isInteger(nx) || !Number.isInteger(ny)) return null;
  if (!Array.isArray(o.variants) || !o.variants.length || o.variants.length > 12) return null;
  const variants: CamVariant[] = [];
  for (const v of o.variants as Record<string, unknown>[]) {
    const h = pair(v?.hfovDeg, LIMITS.fovDeg);
    if (!h || h[0] < h[1]) return null;
    const vv = v.vfovDeg === null || v.vfovDeg === undefined ? null : pair(v.vfovDeg, LIMITS.fovDeg);
    if (vv === null && v.vfovDeg) return null;
    const f = v.focalMm === null || v.focalMm === undefined ? null : pair(v.focalMm, LIMITS.focalMm);
    if (f === null && v.focalMm) return null;
    const status = v.status === "verified" || v.status === "needs_review" || v.status === "custom" ? v.status : null;
    if (!status) return null;
    variants.push({ hfovDeg: h, vfovDeg: vv, focalMm: f, status });
  }
  const spec: CamSpec = { source, lensType, model, nx, ny, variants };
  for (const k of ["productId", "slug", "brand"] as const) {
    if (o[k] !== undefined) { const s = str(o[k], 200); if (s === null) return null; spec[k] = s; }
  }
  if (o.distortion === true) spec.distortion = true;
  if (o.analog === true) spec.analog = true;
  return spec;
}

function parseCam(x: unknown): PlanCamera | null {
  const o = x as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return null;
  const id = str(o.id, 64), n = num(o.n, [1, 9999]);
  const p = pt(o), mountM = num(o.mountM, PLAN_LIMITS.mountM);
  const panDeg = num(o.panDeg, [-3600, 3600]), tiltDeg = num(o.tiltDeg, LIMITS.tiltDeg);
  const zoom = num(o.zoom, [0, 1]), vi = num(o.vi, [0, 11]);
  const spec = parseSpec(o.spec);
  if (!id || n === null || !p || mountM === null || panDeg === null || tiltDeg === null || zoom === null || vi === null || !spec) return null;
  if (!Number.isInteger(n) || !Number.isInteger(vi) || vi >= spec.variants.length) return null;
  return { id, n, x: p.x, y: p.y, mountM, panDeg, tiltDeg, zoom, vi, spec, ...(o.outdoor === true ? { outdoor: true } : {}) };
}

/** Настройки сметы: необязательное поле (проекты этапа C его не содержат) — по умолчанию DEFAULT_SETTINGS. */
export function parseEst(x: unknown): EstSettings {
  const o = (x ?? {}) as Record<string, unknown>;
  const days = num(o.days, [1, 365]);
  return {
    days: days !== null && Number.isInteger(days) ? days : DEFAULT_SETTINGS.days,
    mode: o.mode === "motion" ? "motion" : "continuous",
    codec: o.codec === "h264" ? "h264" : "h265",
    trace: o.trace === "ready" ? "ready" : "need",
  };
}

function parseBg(x: unknown): PlanBg | null | undefined {
  if (x === null) return null;
  const o = x as Record<string, unknown> | null;
  if (!o || typeof o !== "object") return undefined;
  if (o.kind === "grid") {
    const wM = num(o.wM, PLAN_LIMITS.sizeM), hM = num(o.hM, PLAN_LIMITS.sizeM);
    return wM === null || hM === null ? undefined : { kind: "grid", wM, hM };
  }
  if (o.kind === "image") {
    const wPx = num(o.wPx, [1, PLAN_LIMITS.imagePx]), hPx = num(o.hPx, [1, PLAN_LIMITS.imagePx]);
    const scale = o.scale === null ? null : num(o.scale, [1e-5, 100]);
    if (wPx === null || hPx === null || (scale === null && o.scale !== null)) return undefined;
    return { kind: "image", wPx, hPx, scale };
  }
  return undefined;
}

/** Строгий разбор проекта из файла/хранилища: любое несоответствие — null (файл не открываем). */
export function parseProject(x: unknown): PlanProject | null {
  const o = x as Record<string, unknown> | null;
  if (!o || typeof o !== "object" || o.format !== PLAN_FORMAT || o.version !== PLAN_VERSION) return null;
  const std = o.std === "2014" || o.std === "2025" ? o.std : null;
  const targetM = num(o.targetM, PLAN_LIMITS.targetM);
  const bg = parseBg(o.bg);
  if (!std || targetM === null || bg === undefined) return null;
  if (!Array.isArray(o.cams) || o.cams.length > PLAN_LIMITS.cams) return null;
  if (!Array.isArray(o.walls) || o.walls.length > PLAN_LIMITS.walls) return null;
  if (!Array.isArray(o.zones) || o.zones.length > PLAN_LIMITS.zones) return null;
  const cams: PlanCamera[] = [];
  for (const c of o.cams) { const p = parseCam(c); if (!p) return null; cams.push(p); }
  if (new Set(cams.map((c) => c.id)).size !== cams.length) return null;
  const walls: Segment[] = [];
  for (const w of o.walls) {
    if (!Array.isArray(w) || w.length !== 2) return null;
    const a = pt(w[0]), b = pt(w[1]);
    if (!a || !b) return null;
    walls.push([a, b]);
  }
  const zones: Vec2[][] = [];
  for (const z of o.zones) {
    if (!Array.isArray(z) || z.length < 3 || z.length > PLAN_LIMITS.zonePoints) return null;
    const poly: Vec2[] = [];
    for (const p of z) { const q = pt(p); if (!q) return null; poly.push(q); }
    zones.push(poly);
  }
  return {
    format: PLAN_FORMAT, version: PLAN_VERSION,
    engine: str(o.engine, 40) ?? ENGINE_VERSION,
    std, profileId: PROFILES[std].id, all: o.all === true, targetM, bg, cams, walls, zones,
    showOverlap: o.showOverlap !== false,
    rack: o.rack === null || o.rack === undefined ? null : pt(o.rack),
    est: parseEst(o.est),
    updatedAt: str(o.updatedAt, 40) ?? new Date(0).toISOString(),
  };
}

/** Картинка плана в файле: только data:-URL PNG/JPEG/WebP, без внешних ссылок. */
export const isPlanImageUrl = (s: unknown): s is string =>
  typeof s === "string" && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(s) && s.length < PLAN_LIMITS.fileBytes * 1.4;

/** Пересчёт координат после новой калибровки: всё остаётся на своих местах относительно картинки. */
export function rescaleProject(p: PlanProject, k: number): PlanProject {
  const s = (v: Vec2) => ({ x: v.x * k, y: v.y * k });
  return {
    ...p,
    cams: p.cams.map((c) => ({ ...c, x: c.x * k, y: c.y * k })),
    walls: p.walls.map(([a, b]) => [s(a), s(b)] as Segment),
    zones: p.zones.map((z) => z.map(s)),
    rack: p.rack ? s(p.rack) : null,
  };
}
