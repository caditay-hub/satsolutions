/**
 * Смета видеонаблюдения (SAT Camera Designer, этап D). Чистые функции: по списку камер
 * (с плана или вручную) и проверенным характеристикам оборудования (этап D0) подбирает
 * регистратор, диски, PoE-коммутаторы, ИБП, кабель и расходники и считает монтаж по тем же
 * расценкам, что калькулятор монтажа (calcPricing.PRICE).
 *
 * Решения владельца 10.11: регистратор того же бренда, что камеры (смешанный проект — бренд
 * большинства, остальные по ONVIF с пометкой); PoE от регистратора, если хватает портов и
 * бюджета, иначе коммутаторы Hikvision/Dahua; архив по умолчанию 30 дней круглосуточно H.265;
 * позиции без цены в сумах — «по запросу» и в итог не входят; кронштейны — строкой без цены.
 * Методика и допущения — docs/camera-designer/07-ESTIMATE.md.
 */
import { PRICE } from "../../calcPricing";

/* ───────────── входные данные ───────────── */

export type PoeStd = "af" | "at" | "bt" | "hipoe" | "none" | null;

export type EstCam = {
  /** Ключ группировки строки: slug товара или «custom:…». */
  key: string;
  slug?: string;
  brand?: string;
  nx: number;
  ny: number;
  kind: "ip" | "ptz" | "analog";
  outdoor: boolean;
  mountM: number;
  cableM: number;
  /** Потребление, Вт (D0). null — неизвестно: берём потолок класса PoE как оценку. */
  powerW: number | null;
  poe: PoeStd;
  powerReview?: boolean;
};

export type Recorder = {
  slug: string; brand: string; model: string; kind: "nvr" | "dvr";
  /** Каналы: IP для NVR, аналоговые для DVR. */
  channels: number;
  /** Входящий поток NVR, Мбит/с. */
  bandwidthMbps: number | null;
  /** Наибольшее разрешение записи, Мп. */
  maxMP: number | null;
  bays: number;
  maxTbPerBay: number | null;
  poePorts: number;
  poeBudgetW: number | null;
  /** Порты PoE регистратора держат 802.3at (30 Вт). */
  poeAt: boolean;
  powerW: number | null;
};

export type Switch = {
  slug: string; brand: string; model: string;
  poePorts: number;
  budgetW: number;
  at: boolean;
  hiPoe: boolean;
  powerW: number | null;
};

export type Hdd = { slug: string; tb: number; surveillance: boolean };
export type Ups = { slug: string; w: number; va: number };
export type Cable = { slug: string; outdoor: boolean; meters: number };

export type Equipment = {
  recorders: Recorder[];
  switches: Switch[];
  hdds: Hdd[];
  ups: Ups[];
  cables: Cable[];
  rj45: { slug: string } | null;
  gofra: { slug: string; meters: number } | null;
};

/** Цена в сумах и наличие — из API на момент расчёта; null — «по запросу». */
export type PriceMap = Record<string, { price: number | null; inStock: boolean }>;

export type EstSettings = {
  days: number;
  mode: "continuous" | "motion";
  codec: "h265" | "h264";
  trace: "need" | "ready";
};

export const DEFAULT_SETTINGS: EstSettings = { days: 30, mode: "continuous", codec: "h265", trace: "need" };

/* ───────────── модели ───────────── */

/**
 * Типовой битрейт основного потока при 25 к/с, Мбит/с: [порог Мп, H.265, H.264].
 * Это оценка для расчёта архива (настройки по умолчанию у камер разных серий отличаются);
 * в интерфейсе подписано «оценка».
 */
export const BITRATE: [number, number, number][] = [
  [1.0, 1, 2], [2.1, 2, 4], [3.2, 3, 5], [4.2, 4, 6], [5.1, 5, 8], [6.3, 6, 10], [8.4, 8, 12], [12.5, 10, 16], [99, 16, 24],
];
export function bitrateOf(nx: number, ny: number, codec: EstSettings["codec"]): number {
  const mp = (nx * ny) / 1e6;
  const row = BITRATE.find((r) => mp <= r[0]) ?? BITRATE[BITRATE.length - 1];
  return codec === "h265" ? row[1] : row[2];
}

/** Доля времени записи «по движению». */
export const MOTION_SHARE = 0.3;
/** Полезная ёмкость диска от паспортной (форматирование, служебные области). */
export const HDD_USABLE = 0.9;

/** Архив, ТБ (десятичные): Σ битрейт × время × доля записи. */
export function storageTb(mbps: number, s: EstSettings): number {
  const share = s.mode === "motion" ? MOTION_SHARE : 1;
  return (mbps * 86400 * s.days * share) / 8 / 1e6;
}

/** Потолок мощности по стандарту PoE на стороне камеры — оценка, если паспорт неизвестен. */
export const POE_CAP: Record<string, number> = { af: 12.95, at: 25.5, bt: 51, hipoe: 60 };

/** Мощность камеры для бюджета PoE: паспорт или потолок её класса (PTZ без данных — at). */
export function camW(c: EstCam): { w: number; estimate: boolean } {
  if (c.powerW !== null && c.powerW > 0) return { w: c.powerW, estimate: !!c.powerReview };
  const std = c.poe && c.poe !== "none" ? c.poe : c.kind === "ptz" ? "at" : "af";
  return { w: POE_CAP[std], estimate: true };
}

/** Камера питается по PoE (af/at/bt) — Hi-PoE и камеры без PoE идут отдельно. */
const onPoe = (c: EstCam) => c.kind !== "analog" && (c.poe === "af" || c.poe === "at" || c.poe === "bt" || c.poe === null);
const needsAt = (c: EstCam) => c.poe === "at" || c.poe === "bt" || camW(c).w > POE_CAP.af;

/* ───────────── результат ───────────── */

export type LineKind = "camera" | "recorder" | "hdd" | "switch" | "ups" | "cable" | "rj45" | "gofra" | "bracket" | "psu" | "hipoe" | "coax";
export type EstLine = { kind: LineKind; slug?: string; key?: string; qty: number; unit: "pc" | "m" | "bobbin" | "set"; price: number | null; sum: number | null; outdoor?: boolean };
export type LaborLine = { code: "camIn" | "camOut" | "camPtz" | "camPnr" | "nvr" | "nvrBig" | "remote" | "switch" | "cableOpen" | "gofra" | "shtroba" | "cableTray"; qty: number; price: number; sum: number };
export type Warning =
  | { code: "noRecorder"; kind: "nvr" | "dvr" }
  | { code: "onvif"; brands: string[] }
  | { code: "longCable"; keys: string[] }
  | { code: "noUps" }
  | { code: "powerEstimate" };

export type EstResult = {
  lines: EstLine[];
  labor: LaborLine[];
  warnings: Warning[];
  mbps: number;
  storageTb: number;
  poeW: number;
  recorder: Recorder | null;
  dvr: Recorder | null;
  totals: { equipment: number; onRequest: number; laborRaw: number; laborLow: number; laborHigh: number; low: number; high: number; kHigh: number };
};

/* ───────────── подбор ───────────── */

const priceOf = (pm: PriceMap, slug?: string) => (slug && pm[slug]?.price ? pm[slug].price : null);
/** Сравнение вариантов: с ценой раньше, затем дешевле, затем в наличии. */
const better = (a: { cost: number | null; stock: boolean }, b: { cost: number | null; stock: boolean }) =>
  (a.cost === null ? 1 : 0) - (b.cost === null ? 1 : 0) || (a.cost ?? 0) - (b.cost ?? 0) || Number(b.stock) - Number(a.stock);

/** Диски для регистратора: одинаковые, не больше отсеков и предела отсека; дешевле. */
export function pickHdd(req: number, rec: Recorder, eq: Equipment, pm: PriceMap): { hdd: Hdd; n: number; cost: number | null } | null {
  const need = Math.max(req / HDD_USABLE, 0.001);
  const pool = eq.hdds.some((h) => h.surveillance) ? eq.hdds.filter((h) => h.surveillance) : eq.hdds;
  let best: { hdd: Hdd; n: number; cost: number | null; stock: boolean } | null = null;
  for (const h of pool) {
    if (rec.maxTbPerBay !== null && h.tb > rec.maxTbPerBay) continue;
    const n = Math.max(1, Math.ceil(need / h.tb));
    if (n > rec.bays) continue;
    const p = priceOf(pm, h.slug);
    const cand = { hdd: h, n, cost: p === null ? null : p * n, stock: !!pm[h.slug]?.inStock };
    if (!best || better(cand, best) < 0) best = cand;
  }
  return best && { hdd: best.hdd, n: best.n, cost: best.cost };
}

/** Коммутаторы для камер: одна модель k штук по портам и бюджету; дешевле. */
export function pickSwitches(cams: EstCam[], eq: Equipment, pm: PriceMap): { sw: Switch; n: number; cost: number | null } | null {
  if (!cams.length) return null;
  const w = cams.reduce((s, c) => s + camW(c).w, 0);
  const at = cams.some(needsAt);
  let best: { sw: Switch; n: number; cost: number | null; stock: boolean } | null = null;
  for (const s of eq.switches) {
    if (at && !s.at) continue;
    if (!(s.poePorts > 0) || !(s.budgetW > 0)) continue;
    const n = Math.max(Math.ceil(cams.length / s.poePorts), Math.ceil(w / s.budgetW));
    const p = priceOf(pm, s.slug);
    const cand = { sw: s, n, cost: p === null ? null : p * n, stock: !!pm[s.slug]?.inStock };
    if (!best || better(cand, best) < 0) best = cand;
  }
  return best && { sw: best.sw, n: best.n, cost: best.cost };
}

/**
 * Бренды регистратора: большинство камер Hikvision/Dahua; при равенстве — оба (выбор решит
 * полная стоимость); камеры без бренда — null (любой).
 */
export function recorderBrands(cams: EstCam[]): string[] | null {
  const cnt: Record<string, number> = {};
  for (const c of cams) if (c.brand === "Hikvision" || c.brand === "Dahua") cnt[c.brand] = (cnt[c.brand] ?? 0) + 1;
  const top = Math.max(0, ...Object.values(cnt));
  return top ? Object.keys(cnt).filter((b) => cnt[b] === top) : null;
}

type RecPlan = { rec: Recorder; hdd: { hdd: Hdd; n: number; cost: number | null } | null; nvrPoe: EstCam[]; sw: ReturnType<typeof pickSwitches>; swCams: EstCam[]; cost: number | null; stock: boolean };

function planRecorder(kind: "nvr" | "dvr", cams: EstCam[], s: EstSettings, eq: Equipment, pm: PriceMap): RecPlan | null {
  if (!cams.length) return null;
  const brands = recorderBrands(cams);
  const mbps = cams.reduce((a, c) => a + bitrateOf(c.nx, c.ny, s.codec), 0);
  const tb = storageTb(mbps, s);
  const maxMP = Math.max(...cams.map((c) => (c.nx * c.ny) / 1e6));
  let best: RecPlan | null = null;
  for (const r of eq.recorders) {
    if (r.kind !== kind || (brands && !brands.includes(r.brand))) continue;
    if (r.channels < cams.length) continue;
    if (kind === "nvr" && (r.bandwidthMbps === null || r.bandwidthMbps < mbps)) continue;
    if (r.maxMP !== null && r.maxMP + 0.05 < maxMP) continue;
    const hdd = pickHdd(tb, r, eq, pm);
    if (!hdd) continue;
    // PoE: сколько камер возьмёт регистратор (порты и бюджет), остальные — на коммутаторы
    const poeCams = cams.filter(onPoe).sort((a, b) => camW(b).w - camW(a).w);
    const nvrPoe: EstCam[] = [];
    let used = 0;
    if (kind === "nvr" && r.poePorts > 0 && r.poeBudgetW) {
      for (const c of poeCams) {
        const w = camW(c).w;
        if (nvrPoe.length >= r.poePorts || used + w > r.poeBudgetW || (needsAt(c) && !r.poeAt)) continue;
        nvrPoe.push(c); used += w;
      }
    }
    const swCams = poeCams.filter((c) => !nvrPoe.includes(c));
    const sw = pickSwitches(swCams, eq, pm);
    if (swCams.length && !sw) continue;
    const pr = priceOf(pm, r.slug);
    const parts = [pr, hdd.cost, sw ? sw.cost : 0];
    const cost = parts.some((x) => x === null) ? null : parts.reduce((a, b) => (a ?? 0) + (b ?? 0), 0);
    const cand: RecPlan = { rec: r, hdd, nvrPoe, sw, swCams, cost, stock: !!pm[r.slug]?.inStock };
    if (!best || better(cand, best) < 0) best = cand;
  }
  return best;
}

/** ИБП: нагрузка шкафа ×1,3 запаса; самый дешёвый подходящий. */
export function pickUps(loadW: number, eq: Equipment, pm: PriceMap): Ups | null {
  let best: { u: Ups; cost: number | null; stock: boolean } | null = null;
  for (const u of eq.ups) {
    if (u.w < loadW * 1.3) continue;
    const cand = { u, cost: priceOf(pm, u.slug), stock: !!pm[u.slug]?.inStock };
    if (!best || better(cand, best) < 0) best = cand;
  }
  return best?.u ?? null;
}

/** Предел длины линии Ethernet — 100 м вместе с патч-кордами; предупреждаем с 90 м. */
export const CABLE_WARN_M = 90;

/* ───────────── смета ───────────── */

export function estimate(cams: EstCam[], camPrices: Record<string, number | null>, s: EstSettings, eq: Equipment, pm: PriceMap): EstResult {
  const lines: EstLine[] = [];
  const warnings: Warning[] = [];
  const add = (l: Omit<EstLine, "sum">) => lines.push({ ...l, sum: l.price === null ? null : l.price * l.qty });

  // камеры — строки по ключу
  const groups = new Map<string, { c: EstCam; qty: number }>();
  for (const c of cams) { const g = groups.get(c.key); if (g) g.qty++; else groups.set(c.key, { c, qty: 1 }); }
  for (const { c, qty } of groups.values()) add({ kind: "camera", key: c.key, slug: c.slug, qty, unit: "pc", price: camPrices[c.key] ?? null });

  const ip = cams.filter((c) => c.kind !== "analog");
  const an = cams.filter((c) => c.kind === "analog");
  const mbps = cams.reduce((a, c) => a + bitrateOf(c.nx, c.ny, s.codec), 0);
  const tb = storageTb(mbps, s);

  const nvr = planRecorder("nvr", ip, s, eq, pm);
  const dvr = planRecorder("dvr", an, s, eq, pm);
  if (ip.length && !nvr) warnings.push({ code: "noRecorder", kind: "nvr" });
  if (an.length && !dvr) warnings.push({ code: "noRecorder", kind: "dvr" });
  for (const p of [nvr, dvr]) {
    if (!p) continue;
    add({ kind: "recorder", slug: p.rec.slug, qty: 1, unit: "pc", price: priceOf(pm, p.rec.slug) });
    if (p.hdd) add({ kind: "hdd", slug: p.hdd.hdd.slug, qty: p.hdd.n, unit: "pc", price: priceOf(pm, p.hdd.hdd.slug) });
    if (p.sw) add({ kind: "switch", slug: p.sw.sw.slug, qty: p.sw.n, unit: "pc", price: priceOf(pm, p.sw.sw.slug) });
  }
  const recBrand = nvr?.rec.brand ?? dvr?.rec.brand;
  const foreign = [...new Set(cams.map((c) => c.brand).filter((b): b is string => !!b && !!recBrand && b !== recBrand))];
  if (foreign.length) warnings.push({ code: "onvif", brands: foreign });

  // питание без PoE: Hi-PoE, аналоговые и камеры с адаптером 12 В — блоки питания подберёт инженер
  const hip = ip.filter((c) => c.poe === "hipoe").length;
  if (hip) add({ kind: "hipoe", qty: hip, unit: "pc", price: null });
  const psu = cams.filter((c) => c.kind === "analog" || c.poe === "none").length;
  if (psu) add({ kind: "psu", qty: psu, unit: "pc", price: null });
  if (an.length) add({ kind: "coax", qty: an.length, unit: "set", price: null });

  const poeW = cams.filter(onPoe).reduce((a, c) => a + camW(c).w, 0);
  if (cams.some((c) => c.kind !== "analog" && (c.powerW === null || c.powerReview))) warnings.push({ code: "powerEstimate" });

  // ИБП шкафа: регистратор(ы) + диски по 6 Вт + PoE-нагрузка + собственные коммутаторы
  if (nvr || dvr) {
    const recW = [nvr, dvr].reduce((a, p) => a + (p ? (p.rec.powerW ?? 15) + (p.hdd ? p.hdd.n * 6 : 0) + (p.sw ? p.sw.n * (p.sw.sw.powerW ?? 10) : 0) : 0), 0);
    const ups = pickUps(recW + poeW, eq, pm);
    if (ups) add({ kind: "ups", slug: ups.slug, qty: 1, unit: "pc", price: priceOf(pm, ups.slug) });
    else warnings.push({ code: "noUps" });
  }

  // кабель витая пара: бухты по 305 м, отдельно уличный и внутренний
  const cableM = cams.reduce((a, c) => a + c.cableM, 0);
  for (const outdoor of [false, true]) {
    const m = cams.filter((c) => c.outdoor === outdoor).reduce((a, c) => a + c.cableM, 0);
    if (!m) continue;
    const cab = eq.cables.find((x) => x.outdoor === outdoor) ?? eq.cables[0];
    if (cab) add({ kind: "cable", slug: cab.slug, qty: Math.ceil(m / cab.meters), unit: "bobbin", price: priceOf(pm, cab.slug), outdoor });
  }
  const longKeys = ip.filter((c) => c.cableM > CABLE_WARN_M).map((c) => c.key);
  if (longKeys.length) warnings.push({ code: "longCable", keys: [...new Set(longKeys)] });

  // расходники: 2 разъёма RJ45 на линию камеры и на подключение каждого коммутатора; гофра по трассе
  const swN = (nvr?.sw?.n ?? 0) + (dvr?.sw?.n ?? 0);
  if (eq.rj45 && ip.length) add({ kind: "rj45", slug: eq.rj45.slug, qty: 2 * ip.length + 2 * swN, unit: "pc", price: priceOf(pm, eq.rj45.slug) });
  // трасса — как в калькуляторе монтажа: пучок кабелей ≈ 0,38 длины, гофра на 60 % трассы
  const routeM = Math.round(cableM * 0.38);
  if (s.trace === "need" && eq.gofra && routeM) add({ kind: "gofra", slug: eq.gofra.slug, qty: Math.ceil((routeM * 0.6) / eq.gofra.meters), unit: "pc", price: priceOf(pm, eq.gofra.slug) });
  if (cams.length) add({ kind: "bracket", qty: cams.length, unit: "pc", price: null });

  // монтаж — calcPricing.PRICE
  const labor: LaborLine[] = [];
  const L = (code: LaborLine["code"], qty: number, price: number) => { if (qty > 0) labor.push({ code, qty, price, sum: qty * price }); };
  L("camIn", cams.filter((c) => c.kind !== "ptz" && !c.outdoor).length, PRICE.camIn);
  L("camOut", cams.filter((c) => c.kind !== "ptz" && c.outdoor).length, PRICE.camOut);
  L("camPtz", cams.filter((c) => c.kind === "ptz").length, PRICE.camPtz);
  // настройка + пусконаладка — одной строкой, как в прайсе на сайте («Настройка и пусконаладка камеры»)
  L("camPnr", cams.length, PRICE.camSetup + PRICE.pnrCam);
  const recN = (nvr ? 1 : 0) + (dvr ? 1 : 0);
  if (recN) { if (cams.length > 16) L("nvrBig", recN, PRICE.nvrBig); else L("nvr", recN, PRICE.nvr); L("remote", 1, PRICE.remote); }
  L("switch", swN, PRICE.swUn);
  if (s.trace === "need") {
    L("cableOpen", Math.round(cableM), PRICE.cableOpen);
    L("gofra", Math.round(routeM * 0.6), PRICE.gofra);
    L("shtroba", Math.round(routeM * 0.25), PRICE.shtroba);
  } else L("cableTray", Math.round(cableM), PRICE.cableTray);

  // высота монтажа — как в калькуляторе: до 3 м, 3–4,5 м, выше 4,5 м (по самой высокой камере)
  const top = cams.reduce((m, c) => Math.max(m, c.mountM), 0);
  const kHigh = top > 4.5 ? 1.4 : top > 3 ? 1.2 : 1;
  const laborRaw = labor.reduce((a, l) => a + l.sum, 0) * kHigh;
  const laborLow = cams.length ? Math.max(PRICE.minOrder, laborRaw) : 0;
  const laborHigh = laborLow * 1.25;
  const equipment = lines.reduce((a, l) => a + (l.sum ?? 0), 0);
  const onRequest = lines.filter((l) => l.sum === null && l.kind !== "bracket" && l.kind !== "psu" && l.kind !== "hipoe" && l.kind !== "coax").length;

  return {
    lines, labor, warnings, mbps, storageTb: tb, poeW,
    recorder: nvr?.rec ?? null, dvr: dvr?.rec ?? null,
    totals: { equipment, onRequest, laborRaw, laborLow, laborHigh, low: equipment + laborLow, high: equipment + laborHigh, kHigh },
  };
}
