// Отправка отчётов и алертов в Telegram-бот CRM_SAT (https://t.me/CRM_SAT_bot).
import { config } from "./config.js";

const MAX_LEN = 4096; // лимит Telegram на сообщение

/** Разбить длинный текст на части по границам строк (≤4096 символов). */
function chunk(text: string): string[] {
  if (text.length <= MAX_LEN) return [text];
  const parts: string[] = [];
  let buf = "";
  for (const line of text.split("\n")) {
    if (buf.length + line.length + 1 > MAX_LEN) {
      parts.push(buf);
      buf = "";
    }
    buf += (buf ? "\n" : "") + line;
  }
  if (buf) parts.push(buf);
  return parts;
}

/** Вызов метода Bot API. Бросает при сетевой ошибке; возвращает разобранный JSON. */
export async function tgCall(method: string, body: unknown): Promise<any> {
  const res = await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.ok) console.error(`[telegram] ${method} ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);
  return data;
}

/** Inline-клавиатура «обновить отчёт / проверить сейчас» под сообщением. */
export const REPORT_KEYBOARD = {
  inline_keyboard: [[
    { text: "🔄 Обновить отчёт", callback_data: "report" },
    { text: "🚨 Проверить сейчас", callback_data: "alerts" },
  ]],
};

/**
 * Отправить сообщение в Telegram (HTML). Длинный текст бьётся на части;
 * клавиатура (если есть) крепится к ПОСЛЕДНЕЙ части. chatId по умолчанию — из конфига.
 * Без токена/chat_id печатает в консоль и не падает.
 */
export async function sendTelegram(html: string, opts?: { chatId?: string | number; replyMarkup?: unknown }): Promise<void> {
  const chatId = opts?.chatId ?? config.telegramChatId;
  if (!config.telegramBotToken || !chatId) {
    console.warn("[telegram] токен/chat_id не заданы — печатаю в консоль:\n" + html);
    return;
  }
  const parts = chunk(html);
  for (let i = 0; i < parts.length; i++) {
    const isLast = i === parts.length - 1;
    await tgCall("sendMessage", {
      chat_id: chatId,
      text: parts[i],
      parse_mode: "HTML",
      disable_web_page_preview: true,
      ...(isLast && opts?.replyMarkup ? { reply_markup: opts.replyMarkup } : {}),
    });
  }
}

/** Экранировать спецсимволы HTML для безопасной вставки в сообщение. */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
