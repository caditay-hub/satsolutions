// Сборка отчёта/алертов — переиспользуется и cron-оркестратором (run.ts),
// и интерактивным ботом (bot.ts). Здесь только данные → текст, без отправки.
import { fetchGscReport, fetchGscTotalsForPrevWindow } from "./sources/searchConsole.js";
import { fetchGa4Report } from "./sources/ga4.js";
import { fetchPsi } from "./sources/psi.js";
import { saveSnapshot, type Snapshot } from "./snapshot.js";
import { detectAlerts, narrativeFromClaude, type Alert } from "./analyze.js";
import { renderReport } from "./render.js";
import { esc } from "./telegram.js";

const SEV_ICON = { critical: "🔴", warning: "🟡", info: "🔵" } as const;

/** Запустить источник, не роняя весь прогон при ошибке одного из них. */
async function safe<T>(label: string, fn: () => Promise<T>, errors: string[]): Promise<T | null> {
  try {
    return await fn();
  } catch (e) {
    const msg = `${label}: ${(e as Error).message}`;
    console.error("[monitor] " + msg);
    errors.push(msg);
    return null;
  }
}

/** Собрать снапшот из всех источников (параллельно, отказоустойчиво). */
export async function collect(): Promise<Snapshot> {
  const errors: string[] = [];
  const nowIso = new Date().toISOString();

  const [gsc, ga4, psi] = await Promise.all([
    safe("GSC", async () => {
      const [report, prev] = await Promise.all([fetchGscReport(), fetchGscTotalsForPrevWindow()]);
      return { report, prev };
    }, errors),
    safe("GA4", () => fetchGa4Report(), errors),
    safe("PSI", () => fetchPsi(), errors),
  ]);

  return { ts: nowIso, gsc, ga4, psi, errors };
}

/** Полный отчёт: собрать данные, прогнать через Claude, отрендерить, сохранить снапшот. */
export async function buildFullReport(): Promise<{ text: string; snap: Snapshot }> {
  const snap = await collect();
  const alerts = detectAlerts(snap);
  const narrative = await narrativeFromClaude(snap);
  const text = renderReport(snap, alerts, narrative);
  saveSnapshot(snap);
  return { text, snap };
}

/** Сообщение-алерт: только critical/warning. null — если проблем нет. */
export function alertsMessage(alerts: Alert[]): string | null {
  const hot = alerts.filter((a) => a.severity !== "info");
  if (!hot.length) return null;
  return [`🚨 <b>satsolutions.uz</b> · алерт мониторинга`, "", ...hot.map((a) => `${SEV_ICON[a.severity]} <b>${esc(a.area)}:</b> ${esc(a.text)}`)].join("\n");
}

/** Прогон режима алертов: собрать, вернуть текст алерта или null + снапшот. */
export async function buildAlerts(): Promise<{ text: string | null; snap: Snapshot }> {
  const snap = await collect();
  const text = alertsMessage(detectAlerts(snap));
  saveSnapshot(snap);
  return { text, snap };
}
