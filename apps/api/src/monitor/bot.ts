// Интерактивный Telegram-бот мониторинга (long-polling).
// Слушает команды и нажатия кнопок и присылает отчёт ПО ЗАПРОСУ.
// Запускается как постоянный процесс (PM2: sat-monitor-bot). Отвечает только
// владельцу (config.telegramChatId) — чужие чаты игнорирует.
//
//   tsx src/monitor/bot.ts
import { config, configSummary } from "./config.js";
import { buildFullReport, buildAlerts } from "./report.js";
import { sendTelegram, tgCall, REPORT_KEYBOARD, esc } from "./telegram.js";

const OWNER = String(config.telegramChatId);
let busy = false; // не запускать два прогона одновременно

const MENU =
  `🛰 <b>Монитор satsolutions.uz</b>\n` +
  `Отчёты выходят только по запросу. Нажми кнопку или команду:\n` +
  `• /report — полный отчёт сейчас\n` +
  `• /alerts — быстрая проверка проблем`;

/** Полный отчёт по запросу в указанный чат (с защитой от двойного запуска). */
async function runReport(chatId: string | number): Promise<void> {
  if (busy) {
    await sendTelegram("⏳ Уже собираю отчёт, секунду…", { chatId });
    return;
  }
  busy = true;
  try {
    await sendTelegram("⏳ Собираю свежий отчёт…", { chatId });
    const { text } = await buildFullReport();
    await sendTelegram(text, { chatId, replyMarkup: REPORT_KEYBOARD });
  } catch (e) {
    await sendTelegram(`⚠️ Ошибка при сборке отчёта: ${esc((e as Error).message)}`, { chatId });
  } finally {
    busy = false;
  }
}

/** Быстрая проверка алертов по запросу. */
async function runAlerts(chatId: string | number): Promise<void> {
  if (busy) {
    await sendTelegram("⏳ Уже выполняю проверку…", { chatId });
    return;
  }
  busy = true;
  try {
    await sendTelegram("⏳ Проверяю…", { chatId });
    const { text } = await buildAlerts();
    await sendTelegram(text ?? "✅ Проблем не обнаружено.", { chatId, replyMarkup: REPORT_KEYBOARD });
  } catch (e) {
    await sendTelegram(`⚠️ Ошибка проверки: ${esc((e as Error).message)}`, { chatId });
  } finally {
    busy = false;
  }
}

/** Только владелец (тот chat_id, что в конфиге). */
function isOwner(chatId: unknown): boolean {
  return String(chatId) === OWNER;
}

async function handleUpdate(u: any): Promise<void> {
  // Нажатие inline-кнопки.
  if (u.callback_query) {
    const cq = u.callback_query;
    const chatId = cq.message?.chat?.id;
    await tgCall("answerCallbackQuery", { callback_query_id: cq.id }); // погасить «часики»
    if (!isOwner(chatId)) return;
    if (cq.data === "report") await runReport(chatId);
    else if (cq.data === "alerts") await runAlerts(chatId);
    return;
  }

  // Текстовая команда.
  const msg = u.message;
  if (!msg?.text) return;
  const chatId = msg.chat?.id;
  if (!isOwner(chatId)) return;
  const cmd = msg.text.trim().split(/\s+/)[0].replace(/@.*$/, "").toLowerCase();
  switch (cmd) {
    case "/report":
      await runReport(chatId);
      break;
    case "/alerts":
      await runAlerts(chatId);
      break;
    case "/start":
    case "/menu":
    default:
      await sendTelegram(MENU, { chatId, replyMarkup: REPORT_KEYBOARD });
  }
}

async function main(): Promise<void> {
  console.log("[bot] старт. config:", configSummary());
  if (!config.telegramBotToken || !OWNER) {
    throw new Error("Не заданы TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID");
  }
  let offset = 0;
  // Бесконечный long-poll. Любая ошибка — лог и продолжаем.
  for (;;) {
    try {
      const res = await tgCall("getUpdates", {
        offset,
        timeout: 50,
        allowed_updates: ["message", "callback_query"],
      });
      for (const u of res.result ?? []) {
        offset = u.update_id + 1;
        handleUpdate(u).catch((e) => console.error("[bot] handle:", e));
      }
    } catch (e) {
      console.error("[bot] poll:", (e as Error).message);
      await new Promise((r) => setTimeout(r, 3000)); // пауза перед повтором
    }
  }
}

main().catch((e) => {
  console.error("[bot] фатальная ошибка:", e);
  process.exit(1);
});
