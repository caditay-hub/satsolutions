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
  chat: LEAD,        // онлайн-чат: оставлен телефон (TODO: своя метка «Онлайн-чат»)
} as const;

type ConversionKey = keyof typeof SEND_TO;

/** Данные посетителя для Enhanced Conversions (тег Google хэширует их перед отправкой). */
export type LeadUserData = { phone?: string | null; email?: string | null };

// Передаём данные посетителя для расширенного отслеживания конверсий (Enhanced
// Conversions): телефон в E.164 (+998…) и/или email. Google-тег сам их хэширует —
// повышает точность сопоставления лидов и снимает статус «Требуется действие».
function setUserData(u?: LeadUserData) {
  if (!u || typeof window === "undefined" || typeof window.gtag !== "function") return;
  const data: Record<string, string> = {};
  const phone = (u.phone || "").trim();
  const email = (u.email || "").trim();
  if (phone) data.phone_number = phone;
  if (email) data.email = email;
  if (Object.keys(data).length) window.gtag("set", "user_data", data);
}

/** Зафиксировать конверсию в Google Ads. Безопасно вызывать на сервере/без gtag. */
export function trackConversion(key: ConversionKey, opts?: { value?: number; user?: LeadUserData }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  setUserData(opts?.user);
  window.gtag("event", "conversion", {
    send_to: SEND_TO[key],
    value: opts?.value ?? 1.0,
    currency: "USD",
  });
}

/** Заявка отправлена (любая форма КП / обратной связи / заявки на услугу). */
export function trackLead(user?: LeadUserData) {
  trackConversion("lead", { user });
}
