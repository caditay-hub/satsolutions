/**
 * Подбор камер каталога под задачу «видеть зону шириной W на глубине D с плотностью не ниже
 * PPM» (этап B). Чистые функции: данные — из cameraOptics.json (этап B0), товарные поля
 * (цена, наличие, фото) подмешивает серверный маршрут.
 *
 * Обе проверки обязательны (ТЗ §4.4, §7): зона помещается в кадр (угол ≥ нужного) И по всей её
 * ширине плотность не ниже порога (угол ≤ предельного для этого разрешения). У вариофокала и
 * PTZ ищется положение зума, где выполняются обе; из подходящих берётся угол с охватом
 * ≈ 1,25 ширины зоны (TARGET_COVER) — запас на монтаж без лишнего угла.
 */
import { deg, rad } from "./optics";

export type OpticsVariant = {
  focalMm: [number, number] | null;
  hfovDeg: [number, number];
  vfovDeg: [number, number] | null;
  status: "verified" | "needs_review";
  notes?: string[];
};

export type OpticsCamera = {
  productId: string;
  slug: string;
  brand: string;
  model: string;
  status: "verified" | "needs_review" | "unsupported";
  /** Раздел каталога: ip | analog | ptz … (аналоговым нужен DVR — помечаем в выдаче). */
  kind?: string;
  lensType: "fixed" | "varifocal" | "ptz" | null;
  widthPx: number | null;
  heightPx: number | null;
  variants: OpticsVariant[];
  flags?: string[];
};

export type LensKind = "all" | "fixed" | "zoom";

export type MatchQuery = { depthM: number; widthM: number; ppm: number; kind?: LensKind };

export type MatchItem = {
  productId: string;
  slug: string;
  brand: string;
  model: string;
  lensType: "fixed" | "varifocal" | "ptz";
  analog: boolean;
  group: "verified" | "review";
  widthPx: number;
  heightPx: number | null;
  /** Вариант объектива из документации (для карточек с несколькими исполнениями). */
  variantFocalMm: [number, number] | null;
  multiVariant: boolean;
  /** Угол и фокус, при которых выполняются обе проверки. */
  hfovDeg: number;
  focalMm: number | null;
  /** Фокус между краями диапазона — оценка (производитель даёт углы только на краях). */
  focalEstimate: boolean;
  sceneWidthM: number;
  ppm: number;
  /** Во сколько раз зона кадра шире нужной и плотность выше порога. */
  coverRatio: number;
  ppmRatio: number;
  flags: string[];
  notes: string[];
  score: number;
};

export type MatchResult = {
  verified: MatchItem[];
  review: MatchItem[];
  /** Сколько камер с данными не прошли: мало охвата / мало плотности / нет данных о кадре. */
  rejected: { cover: number; density: number; noData: number };
};

const halfTan = (hDeg: number) => Math.tan(rad(hDeg) / 2);

/** Желаемый охват для зума: зона ×1,25 — запас на неточность монтажа. */
export const TARGET_COVER = 1.25;

/** Угол при фокусе f по паспортным углам краёв диапазона (та же модель, что varifocalAt). */
function hfovAtFocal(fMin: number, fMax: number, hWide: number, hTele: number, f: number): number {
  const swW = 2 * fMin * halfTan(hWide);
  const swT = 2 * fMax * halfTan(hTele);
  const t = (f - fMin) / (fMax - fMin);
  return deg(2 * Math.atan((swW + t * (swT - swW)) / (2 * f)));
}

/** Фокус, дающий угол h (бисекция: угол монотонно сужается с ростом фокуса). */
export function focalForHfov(fMin: number, fMax: number, hWide: number, hTele: number, h: number): number {
  let lo = fMin, hi = fMax;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (hfovAtFocal(fMin, fMax, hWide, hTele, mid) > h) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/**
 * Оценка (больше — лучше), документирована в docs/camera-designer/04-CATALOG-MAPPING.md:
 * 1 − 0,5·max(0, запас плотности − 2) − 0,3·max(0, запас охвата − 1,6) + 0,15 за фиксированный объектив.
 * Небольшой запас — хорошо; камера, которая перекрывает задачу многократно, — переплата за
 * пиксели или лишний угол. Фиксированный объектив проще в монтаже и настройке. Бренд в оценке
 * не участвует.
 */
export function scoreOf(ppmRatio: number, coverRatio: number, lensType: string): number {
  return 1 - 0.5 * Math.max(0, ppmRatio - 2) - 0.3 * Math.max(0, coverRatio - 1.6) + (lensType === "fixed" ? 0.15 : 0);
}

export function matchCameras(cameras: OpticsCamera[], q: MatchQuery): MatchResult {
  const out: MatchResult = { verified: [], review: [], rejected: { cover: 0, density: 0, noData: 0 } };
  const hReq = deg(2 * Math.atan(q.widthM / (2 * q.depthM)));

  for (const cam of cameras) {
    if (cam.status === "unsupported" || !cam.lensType) continue;
    const isZoom = cam.lensType !== "fixed";
    if (q.kind === "fixed" && isZoom) continue;
    if (q.kind === "zoom" && !isZoom) continue;
    const nx = cam.widthPx;
    if (!nx || !cam.variants.length) { out.rejected.noData++; continue; }
    // предельный угол по плотности для этого кадра
    const hDense = deg(2 * Math.atan(nx / (2 * q.depthM * q.ppm)));

    let best: MatchItem | null = null;
    let failCover = false, failDensity = false;
    for (const v of cam.variants) {
      const [hWide, hTele] = v.hfovDeg;
      if (!(hWide > 0) || !(hTele > 0)) continue;
      const lo = Math.max(hReq, hTele), hi = Math.min(hDense, hWide);
      if (hWide < hReq) { failCover = true; continue; }
      if (hTele > hDense || lo > hi * (1 + 1e-9)) { failDensity = true; continue; }
      // фиксированный объектив — его угол; зум — угол с охватом ≈ 1,25 ширины зоны (запас на
      // монтаж без лишнего угла), но в пределах, где выполняются обе проверки
      const hTarget = deg(2 * Math.atan((TARGET_COVER * q.widthM) / (2 * q.depthM)));
      const h = hWide === hTele ? hWide : Math.min(hi, Math.max(lo, hTarget));
      const f = v.focalMm;
      const isRange = !!f && f[0] !== f[1];
      const atEnd = Math.abs(h - hWide) < 1e-9 || Math.abs(h - hTele) < 1e-9;
      const focal = !f ? null : !isRange ? f[0] : Math.abs(h - hWide) < 1e-9 ? f[0] : Math.abs(h - hTele) < 1e-9 ? f[1] : focalForHfov(f[0], f[1], hWide, hTele, h);
      const sceneWidthM = 2 * q.depthM * halfTan(h);
      const ppm = nx / sceneWidthM;
      const coverRatio = sceneWidthM / q.widthM, ppmRatio = ppm / q.ppm;
      const item: MatchItem = {
        productId: cam.productId, slug: cam.slug, brand: cam.brand, model: cam.model,
        lensType: cam.lensType,
        analog: cam.kind === "analog",
        group: cam.status === "verified" && v.status === "verified" ? "verified" : "review",
        widthPx: nx, heightPx: cam.heightPx,
        variantFocalMm: f, multiVariant: cam.variants.length > 1,
        hfovDeg: h, focalMm: focal, focalEstimate: isRange && !atEnd,
        sceneWidthM, ppm, coverRatio, ppmRatio,
        flags: cam.flags ?? [], notes: v.notes ?? [],
        score: scoreOf(ppmRatio, coverRatio, cam.lensType),
      };
      // у карточки с несколькими исполнениями оставляем лучший подходящий вариант
      if (!best || item.score > best.score) best = item;
    }
    if (best) (best.group === "verified" ? out.verified : out.review).push(best);
    else if (failCover && !failDensity) out.rejected.cover++;
    else out.rejected.density++;
  }
  const byScore = (a: MatchItem, b: MatchItem) => b.score - a.score;
  out.verified.sort(byScore);
  out.review.sort(byScore);
  return out;
}
