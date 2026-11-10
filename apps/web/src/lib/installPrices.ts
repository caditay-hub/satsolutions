// Раздел «Сколько стоит установка … в Ташкенте» на страницах услуг (22.09.2026).
//
// Зачем: люди ищут «установка камер видеонаблюдения цена», «сколько стоит электронный
// замок», «установка домофона в ташкенте цена» — а страницы называли цены только в
// описаниях типовых решений. Google оценивал посадочные «ниже среднего».
//
// Три части: расценки на монтажные работы (PRICE калькулятора — единый прайс на РАБОТЫ,
// без оборудования), оборудование из каталога (минимальные опубликованные цены, сверены
// по прод-API 22.09.2026 — при изменении прайса править здесь же) и ориентир по работам
// для типовых объектов, который считается формулами калькулятора (calc), чтобы сайт и
// калькулятор никогда не расходились. Подписи — namespace installPrices в messages.
import { PRICE, calc, initialState, applyDefaults, type CalcState, type ObjectKey } from "./calcPricing";

export type WorkRow = { k: string; price: number; per: "pc" | "m" | "set" };
export type EquipRow = { k: string; price: number; href: string };
export type PkgSpec = { k: string; obj: ObjectKey; area: number; on: Partial<CalcState["on"]>; v: Partial<Record<keyof CalcState["v"], Record<string, number | string>>> };
/** Ориентир «под ключ»: минимальная цена оборудования из каталога + ориентир по работам (решение владельца 10.11.2026). */
export type TurnkeySpec = { k: string; equipFrom: number; pkg: PkgSpec };
export type InstallPrices = { works: WorkRow[]; equip: EquipRow[]; pkgs: PkgSpec[]; turnkey?: TurnkeySpec[] };

const CATALOG = {
  ipCams: "/products/type/ip-kamery",
  nvr: "/products/type/ip-videoregistratory-nvr",
  wifiCams: "/products/type/besprovodnye-kamery",
  intercom: "/products/group/domofoniya",
  panels: "/products/type/vyzyvnye-paneli",
  monitors: "/products/type/vnutrennie-monitory",
  locks: "/products/type/zamki-i-skud",
  controllers: "/products/type/kontrollery-dostupa",
  terminals: "/products/type/terminaly-i-schityvateli",
  detectors: "/products/type/izveschateli",
  alerts: "/products/type/opoveschenie",
  fireDevices: "/products/type/pribory-i-moduli",
};

const ACS_WORKS: WorkRow[] = [
  { k: "reader", price: PRICE.reader, per: "pc" },
  { k: "bio", price: PRICE.bio, per: "pc" },
  { k: "ctrl", price: PRICE.ctrl, per: "pc" },
  { k: "lockMag", price: PRICE.lockMag, per: "pc" },
  { k: "exitBtn", price: PRICE.exitBtn, per: "pc" },
  { k: "closer", price: PRICE.closer, per: "pc" },
  { k: "pnrDoor", price: PRICE.pnrDoor, per: "pc" },
  { k: "cableOpen", price: PRICE.cableOpen, per: "m" },
];
const ACS_EQUIP: EquipRow[] = [
  { k: "lockMag", price: 147_900, href: CATALOG.locks },
  { k: "exitBtn", price: 110_900, href: CATALOG.locks },
  { k: "ctrl", price: 763_900, href: CATALOG.controllers },
  { k: "terminal", price: 796_900, href: CATALOG.terminals },
];
const ACS_PKGS: PkgSpec[] = [
  { k: "acs1", obj: "office", area: 100, on: { acs: true }, v: { acs: { doors: 1, kind: "card" } } },
  { k: "acs2bio", obj: "office", area: 300, on: { acs: true }, v: { acs: { doors: 2, kind: "bio" } } },
  { k: "acs4", obj: "office", area: 300, on: { acs: true }, v: { acs: { doors: 4, kind: "card" } } },
  { k: "acs10bio", obj: "prod", area: 1500, on: { acs: true }, v: { acs: { doors: 10, kind: "bio" } } },
];

const LOCK_SMART1: PkgSpec = { k: "lockSmart1", obj: "house", area: 100, on: { acs: true }, v: { acs: { doors: 1, kind: "smart" } } };

const DATA: Record<string, InstallPrices> = {
  cctv: {
    works: [
      { k: "camIn", price: PRICE.camIn, per: "pc" },
      { k: "camOut", price: PRICE.camOut, per: "pc" },
      { k: "camPtz", price: PRICE.camPtz, per: "pc" },
      { k: "camPnr", price: PRICE.camSetup + PRICE.pnrCam, per: "pc" },
      { k: "nvr", price: PRICE.nvr, per: "set" },
      { k: "nvrBig", price: PRICE.nvrBig, per: "set" },
      { k: "remote", price: PRICE.remote, per: "set" },
      { k: "cableOpen", price: PRICE.cableOpen, per: "m" },
    ],
    equip: [
      { k: "ipCam", price: 234_900, href: CATALOG.ipCams },
      { k: "nvr", price: 308_900, href: CATALOG.nvr },
      { k: "wifiCam", price: 197_900, href: CATALOG.wifiCams },
    ],
    pkgs: [
      { k: "cctv4", obj: "house", area: 150, on: { cctv: true }, v: { cctv: { in: 2, out: 2, ptz: 0 } } },
      { k: "cctv8", obj: "shop", area: 200, on: { cctv: true }, v: { cctv: { in: 5, out: 3, ptz: 0 } } },
      { k: "cctv16", obj: "wh", area: 1200, on: { cctv: true }, v: { cctv: { in: 10, out: 6, ptz: 0 } } },
    ],
  },
  intercom: {
    works: [
      { k: "panelOne", price: PRICE.panelOne, per: "pc" },
      { k: "panelMulti", price: PRICE.panelMulti, per: "pc" },
      { k: "monitor", price: PRICE.monitor, per: "pc" },
      { k: "floorSw", price: PRICE.floorSw, per: "pc" },
      { k: "cableOpen", price: PRICE.cableOpen, per: "m" },
    ],
    equip: [
      // комплект видеодомофона (панель + монитор): Hikvision DS-KIS202T, сверено по прод-БД 10.11.2026
      { k: "videoKit", price: 865_900, href: CATALOG.intercom },
      { k: "videoIntercom", price: 370_900, href: CATALOG.intercom },
      { k: "ipIntercom", price: 407_900, href: CATALOG.intercom },
      { k: "panel", price: 661_900, href: CATALOG.panels },
      { k: "monitor", price: 705_900, href: CATALOG.monitors },
    ],
    pkgs: [
      { k: "intr1", obj: "house", area: 100, on: { intr: true }, v: { intr: { kind: "one", mon: 1 } } },
      { k: "intr2", obj: "office", area: 300, on: { intr: true }, v: { intr: { kind: "one", mon: 2 } } },
      { k: "intr20", obj: "resid", area: 600, on: { intr: true }, v: { intr: { kind: "multi", mon: 20 } } },
    ],
    turnkey: [
      { k: "tkIntr1", equipFrom: 865_900, pkg: { k: "intr1", obj: "house", area: 100, on: { intr: true }, v: { intr: { kind: "one", mon: 1 } } } },
    ],
  },
  // Замки: спрос — умный замок на входную дверь квартиры, поэтому он первым в работах, оборудовании и ориентирах (10.11.2026)
  locks: {
    works: [{ k: "smartLock", price: PRICE.smartLock, per: "pc" }, ...ACS_WORKS],
    // умный замок KANIHAD TK-606A-TW — минимальная цена в каталоге, сверено по прод-БД 10.11.2026
    equip: [{ k: "smartLock", price: 729_900, href: CATALOG.locks }, ...ACS_EQUIP],
    pkgs: [LOCK_SMART1, ...ACS_PKGS.slice(0, 3)],
    turnkey: [{ k: "tkLock1", equipFrom: 729_900, pkg: LOCK_SMART1 }],
  },
  access: { works: ACS_WORKS, equip: ACS_EQUIP, pkgs: ACS_PKGS },
  fire: {
    works: [
      { k: "smoke", price: PRICE.smoke, per: "pc" },
      { k: "ipr", price: PRICE.ipr, per: "pc" },
      { k: "ppk", price: PRICE.ppk, per: "pc" },
      { k: "siren", price: PRICE.siren, per: "pc" },
      { k: "exitSign", price: PRICE.exitSign, per: "pc" },
      { k: "pnrLoop", price: PRICE.pnrLoop, per: "pc" },
      { k: "cableOpen", price: PRICE.cableOpen, per: "m" },
    ],
    equip: [
      { k: "smokeDet", price: 43_290, href: CATALOG.detectors },
      { k: "manualDet", price: 61_790, href: CATALOG.detectors },
      { k: "alert", price: 78_890, href: CATALOG.alerts },
      { k: "device", price: 127_900, href: CATALOG.fireDevices },
    ],
    pkgs: [
      { k: "fire150", obj: "office", area: 150, on: { fire: true }, v: { fire: { auto: "on" } } },
      { k: "fire300", obj: "shop", area: 300, on: { fire: true }, v: { fire: { auto: "on" } } },
      { k: "fire1000", obj: "wh", area: 1000, on: { fire: true }, v: { fire: { auto: "on" } } },
    ],
  },
};

export const INSTALL_PRICE_KEYS = Object.keys(DATA);
export function installPrices(serviceKey: string): InstallPrices | null {
  return DATA[serviceKey] ?? null;
}

/** Ориентир по работам для типового объекта: диапазон «от–до», округлён до 10 000 сум. */
export function packageRange(spec: PkgSpec): { low: number; high: number } {
  const st = initialState();
  st.obj = spec.obj; st.area = spec.area; applyDefaults(st);
  st.on = { cctv: false, acs: false, intr: false, fire: false, lan: false, perim: false, ...spec.on };
  for (const sys of Object.keys(spec.v) as (keyof CalcState["v"])[]) st.v[sys] = { ...st.v[sys], ...(spec.v[sys] ?? {}) };
  st.trace = "need"; st.high = "no";
  const r = calc(st);
  const round = (n: number) => Math.round(n / 10_000) * 10_000;
  return { low: round(r.low), high: round(r.high) };
}

/** «Под ключ, от»: оборудование из каталога + нижняя граница ориентира по работам. */
export function turnkeyFrom(t: TurnkeySpec): number {
  return t.equipFrom + packageRange(t.pkg).low;
}

/** Число в сумах в формате локали: 155 000 сум / 155,000 UZS / 155.000 UZS. */
export function fmtSum(n: number, locale: string): string {
  const s = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  switch (locale) {
    case "uz": return `${s} soʻm`;
    case "en": return `${s.replace(/ /g, ",")} UZS`;
    case "tr": return `${s.replace(/ /g, ".")} UZS`;
    case "zh": return `${s} 苏姆`;
    default: return `${s} сум`;
  }
}
