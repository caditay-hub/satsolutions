// Хранение снапшотов прогонов (JSON-файлы) для истории и сравнения во времени.
// Один файл на прогон + указатель latest.json на последний.
import { mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { config } from "./config.js";
import type { GscReport, GscTotals } from "./sources/searchConsole.js";
import type { Ga4Report } from "./sources/ga4.js";
import type { PsiResult } from "./sources/psi.js";
import type { GoogleAdsReport } from "./sources/googleAds.js";

export type Snapshot = {
  ts: string; // ISO-время прогона
  gsc?: { report: GscReport; prev: GscTotals } | null;
  ga4?: Ga4Report | null;
  psi?: PsiResult[] | null;
  ads?: GoogleAdsReport | null;
  errors: string[];
};

function ensureDir(): void {
  mkdirSync(config.dataDir, { recursive: true });
}

/** Имя файла снапшота из ISO-времени: 2026-06-29T08-00-00Z.json */
function fileName(ts: string): string {
  return ts.replace(/:/g, "-").replace(/\..*/, "") + "Z.json";
}

export function saveSnapshot(snap: Snapshot): string {
  ensureDir();
  const path = join(config.dataDir, fileName(snap.ts));
  writeFileSync(path, JSON.stringify(snap, null, 2));
  writeFileSync(join(config.dataDir, "latest.json"), JSON.stringify(snap, null, 2));
  return path;
}

/** Предыдущий снапшот (для сравнения), не считая текущего latest. */
export function loadPreviousSnapshot(): Snapshot | null {
  ensureDir();
  const files = readdirSync(config.dataDir)
    .filter((f) => f.endsWith("Z.json") && f !== "latest.json")
    .sort();
  // Последний из исторических — это и есть предыдущий (текущий сохраняем после анализа).
  const prev = files[files.length - 1];
  if (!prev) return null;
  try {
    return JSON.parse(readFileSync(join(config.dataDir, prev), "utf8")) as Snapshot;
  } catch {
    return null;
  }
}
