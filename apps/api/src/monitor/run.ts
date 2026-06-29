// Оркестратор агента-мониторинга. Точка входа для cron:
//   tsx src/monitor/run.ts            — полный прогон + отчёт в Telegram
//   tsx src/monitor/run.ts --alerts   — только жёсткие алерты (без нарратива/отчёта)
//   tsx src/monitor/run.ts --dry      — без отправки в Telegram (печать в консоль)
import { config, configSummary } from "./config.js";
import { fetchGscReport, fetchGscTotalsForPrevWindow } from "./sources/searchConsole.js";
import { fetchGa4Report } from "./sources/ga4.js";
import { fetchPsi } from "./sources/psi.js";
import { saveSnapshot, type Snapshot } from "./snapshot.js";
import { detectAlerts, narrativeFromClaude } from "./analyze.js";
import { sendTelegram, esc } from "./telegram.js";
import { renderReport } from "./render.js";

const sevIcon = { critical: "🔴", warning: "🟡", info: "🔵" } as const;

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

async function collect(): Promise<Snapshot> {
  const errors: string[] = [];
  const nowIso = new Date().toISOString();

  const [gscReport, ga4, psi] = await Promise.all([
    safe("GSC", async () => {
      const [report, prev] = await Promise.all([fetchGscReport(), fetchGscTotalsForPrevWindow()]);
      return { report, prev };
    }, errors),
    safe("GA4", () => fetchGa4Report(), errors),
    safe("PSI", () => fetchPsi(), errors),
  ]);

  return { ts: nowIso, gsc: gscReport, ga4, psi, errors };
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dry = args.has("--dry");
  const alertsOnly = args.has("--alerts");
  console.log("[monitor] config:", configSummary());

  const snap = await collect();
  const alerts = detectAlerts(snap);

  if (alertsOnly) {
    // Режим частых проверок: пишем только если есть critical/warning.
    const hot = alerts.filter((a) => a.severity !== "info");
    if (hot.length) {
      const msg = [`🚨 <b>satsolutions.uz</b> · алерт мониторинга`, "", ...hot.map((a) => `${sevIcon[a.severity]} <b>${esc(a.area)}:</b> ${esc(a.text)}`)].join("\n");
      if (dry) console.log(msg);
      else await sendTelegram(msg);
    } else {
      console.log("[monitor] алертов нет.");
    }
    saveSnapshot(snap);
    return;
  }

  const narrative = await narrativeFromClaude(snap);
  const report = renderReport(snap, alerts, narrative);

  if (dry) console.log(report);
  else await sendTelegram(report);

  const path = saveSnapshot(snap);
  console.log(`[monitor] снапшот сохранён: ${path}`);
}

main().catch((e) => {
  console.error("[monitor] фатальная ошибка:", e);
  process.exit(1);
});
