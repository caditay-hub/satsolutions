// Google Ads conversion tracking helpers.
// Тег gtag.js подключён глобально в layout.tsx (AW-18194158897).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Метки действий-конверсий Google Ads (AW-18194158897).
// call/whatsapp/telegram временно указывают на ту же метку «lead», чтобы клики по
// контактам засчитывались СРАЗУ (это основной канал лидов в UZ). Когда в аккаунте
// создадим отдельные действия (Звонок / WhatsApp / Telegram) — заменить метки здесь.
const LEAD = "AW-18194158897/R9ZeCKrJ670cELGq0-ND";
const SEND_TO = {
  lead: LEAD,        // отправка формы КП/заявки
  call: LEAD,        // клик по tel:  (TODO: своя метка «Звонок»)
  whatsapp: LEAD,    // клик по wa.me (TODO: своя метка «WhatsApp»)
  telegram: LEAD,    // клик по t.me  (TODO: своя метка «Telegram»)
} as const;

type ConversionKey = keyof typeof SEND_TO;

/** Зафиксировать конверсию в Google Ads. Безопасно вызывать на сервере/без gtag. */
export function trackConversion(key: ConversionKey, value = 1.0) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {
    send_to: SEND_TO[key],
    value,
    currency: "USD",
  });
}

/** Заявка отправлена (любая форма КП / обратной связи / заявки на услугу). */
export function trackLead() {
  trackConversion("lead");
}
