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

/**
 * Отправить сообщение в Telegram. Формат — HTML (Telegram parse_mode=HTML).
 * Если токен/chat_id не настроены — печатает в консоль и не падает (полезно
 * при локальном прогоне без секретов).
 */
export async function sendTelegram(html: string): Promise<void> {
  if (!config.telegramBotToken || !config.telegramChatId) {
    console.warn("[telegram] токен/chat_id не заданы — печатаю в консоль:\n" + html);
    return;
  }
  for (const part of chunk(html)) {
    const res = await fetch(
      `https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.telegramChatId,
          text: part,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    if (!res.ok) {
      console.error(`[telegram] sendMessage ${res.status}: ${await res.text()}`);
    }
  }
}

/** Экранировать спецсимволы HTML для безопасной вставки в сообщение. */
export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
