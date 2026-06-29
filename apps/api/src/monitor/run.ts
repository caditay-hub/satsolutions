// Оркестратор агента-мониторинга. Точка входа для cron:
//   tsx src/monitor/run.ts            — полный прогон + отчёт в Telegram
//   tsx src/monitor/run.ts --alerts   — только жёсткие алерты (без нарратива/отчёта)
//   tsx src/monitor/run.ts --dry      — без отправки в Telegram (печать в консоль)
import { configSummary } from "./config.js";
import { buildFullReport, buildAlerts } from "./report.js";
import { sendTelegram, REPORT_KEYBOARD } from "./telegram.js";

async function main() {
  const args = new Set(process.argv.slice(2));
  const dry = args.has("--dry");
  const alertsOnly = args.has("--alerts");
  console.log("[monitor] config:", configSummary());

  if (alertsOnly) {
    const { text } = await buildAlerts();
    if (!text) {
      console.log("[monitor] алертов нет.");
    } else if (dry) {
      console.log(text);
    } else {
      await sendTelegram(text, { replyMarkup: REPORT_KEYBOARD });
    }
    return;
  }

  const { text } = await buildFullReport();
  if (dry) console.log(text);
  else await sendTelegram(text, { replyMarkup: REPORT_KEYBOARD });
  console.log("[monitor] прогон завершён.");
}

main().catch((e) => {
  console.error("[monitor] фатальная ошибка:", e);
  process.exit(1);
});
