/**
 * Расчёт ↔ параметры ссылки. В ссылке — только параметры расчёта (никаких имён, телефонов,
 * планов объекта). Разбор недоверенный: длинные, нечисловые, экспоненциальные и
 * выходящие за пределы значения молча заменяются значениями по умолчанию.
 */
import { DEFAULT_INPUT, type CalcInput } from "./calculate";
import { LIMITS, type Range } from "./optics";
import { ENGINE_VERSION, PROFILES } from "./standards";

const NUM_RE = /^\d{1,6}(\.\d{1,4})?$/;
const MAX_LEN = 16;

type NumKey = "hfov" | "nx" | "ny" | "sw" | "sh" | "f" | "fmin" | "fmax" | "hw" | "ht" | "d" | "mount" | "target" | "tilt" | "w";

/** Короткий ключ ссылки и допустимый диапазон для каждого числового поля. */
const NUMS: Record<NumKey, [string, Range]> = {
  hfov: ["hf", LIMITS.fovDeg], nx: ["nx", LIMITS.px], ny: ["ny", LIMITS.px],
  sw: ["sw", LIMITS.sensorMm], sh: ["sh", LIMITS.sensorMm], f: ["f", LIMITS.focalMm],
  fmin: ["f1", LIMITS.focalMm], fmax: ["f2", LIMITS.focalMm], hw: ["hw", LIMITS.fovDeg], ht: ["ht", LIMITS.fovDeg],
  d: ["d", LIMITS.depthM], mount: ["mh", LIMITS.heightM], target: ["th", LIMITS.heightM], tilt: ["tl", LIMITS.tiltDeg],
  w: ["w", LIMITS.widthM],
};

const INT_KEYS = new Set<NumKey>(["nx", "ny"]);

function num(raw: string | null, [lo, hi]: Range, int: boolean): number | null {
  if (raw === null || raw.length > MAX_LEN || !NUM_RE.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < lo || n > hi || (int && !Number.isInteger(n))) return null;
  return n;
}

function oneOf<T extends string>(raw: string | null, opts: readonly T[], def: T): T {
  return raw !== null && (opts as readonly string[]).includes(raw) ? (raw as T) : def;
}

type Params = { get(name: string): string | null };

export function parseQuery(sp: Params): CalcInput {
  const i: CalcInput = { ...DEFAULT_INPUT };
  for (const k of Object.keys(NUMS) as NumKey[]) {
    const [key, range] = NUMS[k];
    const v = num(sp.get(key), range, INT_KEYS.has(k));
    if (v !== null) i[k] = v;
  }
  const vf = num(sp.get("vf"), LIMITS.fovDeg, false);
  i.vfov = vf;
  i.mode = oneOf(sp.get("m"), ["direct", "task"] as const, DEFAULT_INPUT.mode);
  i.std = oneOf(sp.get("std"), ["2014", "2025"] as const, DEFAULT_INPUT.std);
  i.lens = oneOf(sp.get("lens"), ["fixed", "vari", "fisheye"] as const, DEFAULT_INPUT.lens);
  i.src = oneOf(sp.get("src"), ["fov", "sensor"] as const, DEFAULT_INPUT.src);
  i.all = sp.get("all") === "1";
  i.geo = sp.get("geo") === "1";
  const levels = PROFILES[i.std].levels.map((l) => l.code);
  i.lvl = oneOf(sp.get("lv"), levels, levels.includes(DEFAULT_INPUT.lvl as never) ? DEFAULT_INPUT.lvl : (levels[2] ?? levels[0]));
  return i;
}

/** Чисто для ссылки: округление, чтобы в адресе не было «2.8000000000000003». */
const fmt = (n: number) => String(Math.round(n * 10000) / 10000);

export function toQuery(i: CalcInput): string {
  const q = new URLSearchParams();
  q.set("v", ENGINE_VERSION);
  q.set("std", i.std);
  if (i.mode !== "direct") q.set("m", i.mode);
  if (i.all) q.set("all", "1");
  q.set("lens", i.lens);
  q.set("src", i.src);
  const keys: NumKey[] = ["nx", "ny", "d"];
  if (i.src === "sensor") keys.push("sw", "sh", "f");
  else if (i.lens === "vari") keys.push("hw", "ht", "f");
  else keys.push("hfov", "f");
  if (i.lens === "vari") keys.push("fmin", "fmax");
  if (i.geo) keys.push("mount", "target", "tilt");
  if (i.mode === "task") keys.push("w");
  for (const k of keys) q.set(NUMS[k][0], fmt(i[k]));
  if (i.src === "fov" && i.lens === "fixed" && i.vfov !== null) q.set("vf", fmt(i.vfov));
  if (i.geo) q.set("geo", "1");
  // задача — всегда: в обычном режиме ссылка теряла выбор «что нужно видеть» (живая проверка 12.11)
  q.set("lv", i.lvl);
  return q.toString();
}
