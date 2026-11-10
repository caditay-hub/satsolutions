/**
 * Пороги горизонтальной плотности пикселей (px/m на объекте) по IEC 62676-4 — два
 * НЕЗАВИСИМЫХ профиля. Уровни разных редакций между собой не сопоставляются, даже если
 * порог совпадает (125 и 250 px/m есть в обеих): задачи и формулировки у них разные.
 *
 * Источник чисел — предисловие IEC 62676-4:2025 ed.2 (перечень изменений, п. c):
 * MDORII 12,5 / 25 / 62,5 / 125 / 250 / 1 000 → O2DCPVS 20 / 40 / 80 / 125 / 250 / 500 / 1 500.
 * Названия уровней — по вторичным источникам, сверка: docs/camera-designer/00-AUDIT.md §3.
 * Это ориентир проектирования, а не сертификат соответствия и не гарантия распознавания.
 *
 * Версии профилей пишутся в ссылку расчёта: при правке порогов меняем id, старые ссылки
 * не должны молча начать показывать другое.
 */

export type LevelCode =
  | "monitor" | "detect" | "observe" | "recognize" | "identify" | "inspect"
  | "overview" | "outline" | "discern" | "perceive" | "characterize" | "validate" | "scrutinize";

export type Level = {
  code: LevelCode;
  /** Официальный английский термин — в интерфейсе стоит в скобках после перевода. */
  en: string;
  ppm: number;
  /** 2014: входит в привычную четвёрку DORI (показывается без «все уровни»). */
  base?: boolean;
  /** 2025: группа низкой / высокой плотности. */
  group?: "LPDO" | "HPDO";
};

export type StandardKey = "2014" | "2025";

export type Profile = { key: StandardKey; id: string; title: string; levels: Level[] };

export const PROFILES: Record<StandardKey, Profile> = {
  "2014": {
    key: "2014",
    id: "iec62676-4:2014-mdorii-v1",
    title: "IEC 62676-4:2014",
    levels: [
      { code: "monitor", en: "Monitor", ppm: 12.5 },
      { code: "detect", en: "Detect", ppm: 25, base: true },
      { code: "observe", en: "Observe", ppm: 62.5, base: true },
      { code: "recognize", en: "Recognize", ppm: 125, base: true },
      { code: "identify", en: "Identify", ppm: 250, base: true },
      { code: "inspect", en: "Inspect", ppm: 1000 },
    ],
  },
  "2025": {
    key: "2025",
    id: "iec62676-4:2025-o2dcpvs-v1",
    title: "IEC 62676-4:2025",
    levels: [
      { code: "overview", en: "Overview", ppm: 20, group: "LPDO" },
      { code: "outline", en: "Outline", ppm: 40, group: "LPDO" },
      { code: "discern", en: "Discern", ppm: 80, group: "LPDO" },
      { code: "perceive", en: "Perceive", ppm: 125, group: "HPDO" },
      { code: "characterize", en: "Characterize", ppm: 250, group: "HPDO" },
      { code: "validate", en: "Validate", ppm: 500, group: "HPDO" },
      { code: "scrutinize", en: "Scrutinize", ppm: 1500, group: "HPDO" },
    ],
  },
};

/** Версия расчётного движка: пишется в ссылку вместе с профилем. */
export const ENGINE_VERSION = "cd-optics-1";

/** Уровни профиля, которые показываем: для 2014 без «все уровни» — только четвёрка DORI. */
export function visibleLevels(key: StandardKey, all: boolean): Level[] {
  const p = PROFILES[key];
  return key === "2014" && !all ? p.levels.filter((l) => l.base) : p.levels;
}

export type LevelResult = Level & { met: boolean; /** ppm / порог: 1,2 = запас 20 %. */ ratio: number };

/** Какие уровни достигаются при данной плотности. Сравнение «не ниже порога». */
export function evaluate(key: StandardKey, ppm: number, all = false): LevelResult[] {
  return visibleLevels(key, all).map((l) => ({ ...l, met: ppm >= l.ppm, ratio: ppm / l.ppm }));
}

export function findLevel(code: string): { key: StandardKey; level: Level } | null {
  for (const key of ["2014", "2025"] as const) {
    const level = PROFILES[key].levels.find((l) => l.code === code);
    if (level) return { key, level };
  }
  return null;
}
