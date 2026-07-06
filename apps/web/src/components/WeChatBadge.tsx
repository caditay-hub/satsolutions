"use client";
// Иконка WeChat в ряду соцсетей: у WeChat нет веб-ссылки «добавить контакт»,
// поэтому клик копирует ID в буфер и показывает подтверждение (для китайских клиентов).
import { useState } from "react";

export function WeChatBadge({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // буфер недоступен (http/старый браузер) — показываем ID в prompt для ручного копирования
      window.prompt("WeChat ID:", id);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`WeChat: ${id}`}
      title={copied ? "ID скопирован ✓" : `WeChat: ${id} — нажмите, чтобы скопировать`}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-brand-700 hover:bg-slate-50 hover:text-brand-800 transition-colors shadow-sm cursor-pointer"
    >
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M8.7 4C5 4 2 6.6 2 9.8c0 1.8 1 3.4 2.5 4.5l-.6 2 2.2-1.2c.6.2 1.2.3 1.9.3h.3a5.3 5.3 0 0 1-.2-1.5c0-3 2.9-5.4 6.4-5.4h.3C14.2 5.9 11.7 4 8.7 4Zm-2.2 3.2a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Zm4.4 0a.9.9 0 1 1 0 1.8.9.9 0 0 1 0-1.8Z" />
        <path d="M22 13.9c0-2.7-2.6-4.9-5.7-4.9s-5.7 2.2-5.7 4.9 2.6 4.9 5.7 4.9c.6 0 1.2-.1 1.7-.2l1.9 1-.5-1.7A4.6 4.6 0 0 0 22 13.9Zm-7.6-1.2a.8.8 0 1 1 0 1.5.8.8 0 0 1 0-1.5Zm3.8 0a.8.8 0 1 1 0 1.5.8.8 0 0 1 0-1.5Z" />
      </svg>
      {copied ? (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white">
          {id} ✓
        </span>
      ) : null}
    </button>
  );
}
