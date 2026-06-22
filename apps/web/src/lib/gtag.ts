// Google Ads conversion tracking helpers.
// Тег gtag.js подключён глобально в layout.tsx (AW-18194158897).

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const SEND_TO = {
  // Конверсия «Отправка формы для потенциальных клиентов»
  lead: "AW-18194158897/R9ZeCKrJ670cELGq0-ND",
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
