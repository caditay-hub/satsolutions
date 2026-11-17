"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/gtag";
import { getGclid } from "@/lib/gclid";
import { adTelegramLink, isSalesTelegramLink } from "@/lib/tgRef";

// Глобально ловит клики по контактным ссылкам (звонок / WhatsApp / Telegram) в любом
// месте сайта — футер, шапка, страница контактов, ChatWidget — и шлёт конверсию в
// Google Ads. Делегированный слушатель в фазе capture: работает и для динамически
// отрисованных ссылок. Дедуп: один и тот же href не чаще раза в 2 сек (двойные клики).
// Посетителю с меткой клика Google Ads ссылка на рабочий Telegram в момент нажатия подменяется
// на бота с коротким кодом (lib/tgRef.ts) — так обращение в CRM получает метку клика. Без метки
// ссылка не меняется. Конверсия «Telegram (клик)» считается одинаково в обоих случаях.
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
      // Антидубль считаем по исходному адресу: после подмены href у ссылки уже другой
      const dedupeKey = a.dataset.tgOrigHref || href;
      if (key === "telegram" && (isSalesTelegramLink(href) || a.dataset.tgOrigHref)) {
        try {
          const gclid = getGclid();
          if (gclid) {
            if (!a.dataset.tgOrigHref) a.dataset.tgOrigHref = href;
            a.setAttribute("href", adTelegramLink(gclid)); // до перехода: фаза capture
          }
        } catch {
          /* подмена не удалась — ссылка остаётся на рабочий аккаунт, конверсия считается как обычно */
        }
      }
      const now = Date.now();
      if (last[dedupeKey] && now - last[dedupeKey] < 2000) return; // антидубль
      last[dedupeKey] = now;
      // место на странице — из ближайшего data-placement (шапка, полоса, панель, блок заказа)
      const placement = a.closest("[data-placement]")?.getAttribute("data-placement") || "other";
      trackConversion(key, { placement });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
