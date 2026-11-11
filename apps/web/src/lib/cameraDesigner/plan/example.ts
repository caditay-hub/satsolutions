/**
 * Пример проекта для плана объекта: склад, офис и торговый зал, три камеры, зона охраны и шкаф.
 * Его показывает превью на главной (решение владельца 11.11), и он же открывается по ссылке
 * …/tools/camera-lens-calculator?example=office#plan — клиент продолжает с того, что увидел.
 *
 * Углы камеры — снимок cameraOptics.json, как у любой камеры, поставленной из каталога
 * (совпадение со справочником проверяет example.test.ts).
 */
import { DEFAULT_SETTINGS } from "../estimate/estimate";
import { visibleLevels } from "../standards";
import { analyze } from "./analysis";
import { tiltForAim, type Vec2 } from "./geometry";
import { emptyProject, poseOf, type CamSpec, type PlanCamera, type PlanProject } from "./project";

export const EXAMPLE_IDS = ["office"] as const;
export type ExampleId = (typeof EXAMPLE_IDS)[number];
export const isExampleId = (v: unknown): v is ExampleId => typeof v === "string" && (EXAMPLE_IDS as readonly string[]).includes(v);

/** Hikvision DS-2CD1043G2-IUF 2.8mm: углы сверены по странице модели и datasheet (B0, verified). */
export const EXAMPLE_CAMERA: CamSpec = {
  source: "catalog", slug: "hik-ds-2cd1043g2-iuf-2-8mm", brand: "Hikvision", model: "DS-2CD1043G2-IUF 2.8mm",
  lensType: "fixed", nx: 2560, ny: 1440,
  variants: [{ focalMm: [2.8, 2.8], hfovDeg: [99, 99], vfovDeg: [55, 55], status: "verified" }],
};

/** Здание 32 × 18 м: склад слева, справа офис над торговым залом. */
export const EXAMPLE_SIZE = { w: 32, h: 18 } as const;
export type ExampleRoom = { key: "storage" | "office" | "hall"; x: number; y: number; w: number; h: number };
export const EXAMPLE_ROOMS: ExampleRoom[] = [
  { key: "storage", x: 0, y: 0, w: 15, h: 18 },
  { key: "office", x: 15, y: 0, w: 17, h: 9 },
  { key: "hall", x: 15, y: 9, w: 17, h: 9 },
];

const MOUNT = 3;
const TARGET = 1.6;
/** Камеры в углах помещений; направление — на точку прицеливания, наклон — по ней же. */
const CAMS: { x: number; y: number; aim: Vec2 }[] = [
  { x: 0.4, y: 0.4, aim: { x: 7.5, y: 6.8 } },
  { x: 31.6, y: 17.6, aim: { x: 25, y: 13.4 } },
  { x: 31.6, y: 0.4, aim: { x: 25, y: 4.6 } },
];

export function exampleCameras(): PlanCamera[] {
  return CAMS.map((c, i) => {
    const d = Math.hypot(c.aim.x - c.x, c.aim.y - c.y);
    return {
      id: `ex${i + 1}`, n: i + 1, x: c.x, y: c.y, mountM: MOUNT,
      panDeg: Math.round((Math.atan2(c.aim.y - c.y, c.aim.x - c.x) * 180) / Math.PI),
      tiltDeg: Math.round(tiltForAim(MOUNT, TARGET, d) * 10) / 10,
      zoom: 0, vi: 0, spec: { ...EXAMPLE_CAMERA, variants: EXAMPLE_CAMERA.variants.map((v) => ({ ...v })) },
    };
  });
}

export function exampleProject(_id: ExampleId = "office"): PlanProject {
  const { w, h } = EXAMPLE_SIZE;
  return {
    ...emptyProject(),
    targetM: TARGET,
    bg: { kind: "grid", wM: w, hM: h },
    cams: exampleCameras(),
    // внутренние стены: между складом и правой частью, между офисом и залом
    walls: [
      [{ x: 15, y: 0 }, { x: 15, y: 18 }],
      [{ x: 15, y: 9 }, { x: 32, y: 9 }],
    ],
    zones: [[{ x: 0.3, y: 0.3 }, { x: w - 0.3, y: 0.3 }, { x: w - 0.3, y: h - 0.3 }, { x: 0.3, y: h - 0.3 }]],
    rack: { x: 15.6, y: 17.4 },
    est: { ...DEFAULT_SETTINGS },
    updatedAt: new Date().toISOString(),
  };
}

let coverageMemo: number | null = null;

/** Доля зоны охраны, которую видит хотя бы одна камера на самом грубом уровне (геометрия неизменна). */
export function exampleCoverage(): number {
  if (coverageMemo !== null) return coverageMemo;
  const p = exampleProject();
  const r = analyze({
    bounds: { x: 0, y: 0, w: EXAMPLE_SIZE.w, h: EXAMPLE_SIZE.h },
    maxCells: 120000, targetM: p.targetM,
    cams: p.cams.map(poseOf).filter((x): x is NonNullable<typeof x> => !!x),
    walls: p.walls, zones: p.zones, levelsPpm: visibleLevels(p.std, p.all).map((l) => l.ppm),
  });
  coverageMemo = r.zones[0]?.share[0] ?? 0;
  return coverageMemo;
}
