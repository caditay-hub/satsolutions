// Интерактивный Telegram-бот мониторинга (long-polling).
// Слушает команды и нажатия кнопок и присылает отчёт ПО ЗАПРОСУ.
// Запускается как постоянный процесс (PM2: sat-monitor-bot). Отвечает только
// владельцу (config.telegramChatId) — чужие чаты игнорирует.
//
//   tsx src/monitor/bot.ts
import { config, configSummary } from "./config.js";
import { buildFullReport, buildAlerts } from "./report.js";
import { sendTelegram, tgCall, REPORT_KEYBOARD, esc } from "./telegram.js";
import { prepareDraft, publishInstagram, igConfigured, type IgDraft } from "./instagram.js";

const OWNER = String(config.telegramChatId);
let busy = false; // не запускать два прогона одновременно

const MENU =
  `🛰 <b>Монитор satsolutions.uz</b>\n` +
  `Отчёты выходят только по запросу. Нажми кнопку или команду:\n` +
  `• /report — полный отчёт сейчас\n` +
  `• /alerts — быстрая проверка проблем\n` +
  `• /index — индексация SEO-страниц в Google (~4 мин)
` +
  `• /igpost [slug] — карточка товара для Instagram (с аппрувом)`;

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

// ── Instagram: черновик поста с кнопками аппрува ──────────────────────────────
const igDrafts = new Map<string, IgDraft>(); // chatId → последний черновик (in-memory)

const IG_KEYBOARD = {
  inline_keyboard: [[
    { text: "✅ Опубликовать", callback_data: "ig:pub" },
    { text: "🔁 Другой товар", callback_data: "ig:next" },
    { text: "✖️ Отмена", callback_data: "ig:no" },
  ]],
};

async function runIgDraft(chatId: string | number, slug?: string): Promise<void> {
  try {
    await sendTelegram("⏳ Готовлю карточку товара…", { chatId });
    const draft = await prepareDraft(slug);
    igDrafts.set(String(chatId), draft);
    const note = igConfigured()
      ? ""
      : "\n\n⚠️ Meta-токен не настроен — «Опубликовать» пока не сработает, но карточку можно сохранить и запостить вручную.";
    await tgCall("sendPhoto", {
      chat_id: chatId,
      photo: draft.imageUrl,
      caption: (draft.caption + note).slice(0, 1024),
      reply_markup: IG_KEYBOARD,
    });
  } catch (e) {
    await sendTelegram(`⚠️ Не получилось: ${esc((e as Error).message)}`, { chatId });
  }
}

async function runIgPublish(chatId: string | number): Promise<void> {
  const draft = igDrafts.get(String(chatId));
  if (!draft) {
    await sendTelegram("Черновика нет — сначала /igpost.", { chatId });
    return;
  }
  try {
    await sendTelegram("⏳ Публикую в Instagram…", { chatId });
    const link = await publishInstagram(draft.imageUrl, draft.caption);
    igDrafts.delete(String(chatId));
    await sendTelegram(`✅ Опубликовано: ${esc(link)}`, { chatId });
  } catch (e) {
    await sendTelegram(`⚠️ Публикация не прошла: ${esc((e as Error).message)}`, { chatId });
  }
}

/** Только владелец (тот chat_id, что в конфиге). */
function isOwner(chatId: unknown): boolean {
  return String(chatId) === OWNER;
}

/** Индекс-чек SEO-страниц (URL Inspection API, ~4 мин; авто — cron Пн 09:00). */
async function runIndex(chatId: string | number): Promise<void> {
  if (busy) {
    await sendTelegram("⏳ Уже выполняю другую проверку…", { chatId });
    return;
  }
  busy = true;
  try {
    await sendTelegram("⏳ Проверяю индексацию SEO-страниц в Google (~4 мин)…", { chatId });
    const { runIndexCheck } = await import("./indexCheck.js");
    await runIndexCheck(String(chatId));
  } catch (e) {
    await sendTelegram(`⚠️ Ошибка индекс-чека: ${esc((e as Error).message)}`, { chatId });
  } finally {
    busy = false;
  }
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
    else if (cq.data === "ig:pub") await runIgPublish(chatId);
    else if (cq.data === "ig:next") await runIgDraft(chatId);
    else if (cq.data === "ig:no") {
      igDrafts.delete(String(chatId));
      await sendTelegram("Отменено.", { chatId });
    }
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
    case "/index":
      await runIndex(chatId);
      break;
    case "/igpost": {
      const arg = msg.text.trim().split(/\s+/)[1];
      await runIgDraft(chatId, arg);
      break;
    }
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
