"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/gtag";

// Глобально ловит клики по контактным ссылкам (звонок / WhatsApp / Telegram) в любом
// месте сайта — футер, шапка, страница контактов, ChatWidget — и шлёт конверсию в
// Google Ads. Делегированный слушатель в фазе capture: работает и для динамически
// отрисованных ссылок. Дедуп: один и тот же href не чаще раза в 2 сек (двойные клики).
export function ContactConversionTracker() {
  useEffect(() => {
    const last: Record<string, number> = {};
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const a = target?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const href = (a.getAttribute("href") || "").trim();
      let key: "call" | "whatsapp" | "telegram" | null = null;
      if (href.startsWith("tel:")) key = "call";
      else if (/wa\.me|api\.whatsapp\.com|whatsapp/i.test(href)) key = "whatsapp";
      else if (/(^|\/\/)(t\.me)|telegram\.me/i.test(href)) key = "telegram";
      if (!key) return;
      const now = Date.now();
      if (last[href] && now - last[href] < 2000) return; // антидубль
      last[href] = now;
      trackConversion(key);
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
