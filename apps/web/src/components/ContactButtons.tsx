import { useTranslations } from "next-intl";

/* Кликабельные контакты рядом с CTA: звонок / WhatsApp / Telegram.
   Причина: 90% рекламных кликов — мобильные, а позвонить в один тап было негде
   (tel: существовал в одном месте сайта) — конверсии «Звонок»/«WhatsApp» были 0.
   Клики ловит глобальный ContactConversionTracker (tel: / wa.me / t.me). */
const PHONE = "+998995546969";
const PHONE_HUMAN = "+998 99 554 69 69";
const WHATSAPP = "https://wa.me/998995546969";
const TELEGRAM = "https://t.me/SAT_zayavki_online_bot";

export function ContactButtons({ compact = false, hideCall = false }: { compact?: boolean; hideCall?: boolean }) {
  const t = useTranslations("common");
  const base = compact
    ? "inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-[13px] font-bold transition-colors"
    : "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors";
  return (
    <>
      {hideCall ? null : (
      <a href={`tel:${PHONE}`} className={`${base} border-slate-300 bg-white text-slate-900 hover:border-brand-500 hover:text-brand-700`}>
        <svg className={compact ? "h-4 w-4" : "h-4.5 w-4.5"} width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        {compact ? t("call") : PHONE_HUMAN}
      </a>
      )}
      {/* Telegram раньше WhatsApp — ближе к CTA «Заказать» (правка 16.07) */}
      <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
        className={`${base} border-sky-300 bg-sky-50 text-sky-800 hover:bg-sky-100`}>
        <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M9.04 15.51l-.37 5.23c.53 0 .76-.23 1.04-.5l2.5-2.39 5.18 3.79c.95.52 1.62.25 1.88-.88l3.4-15.95c.3-1.4-.51-1.95-1.43-1.6L2.2 10.79c-1.36.53-1.34 1.29-.23 1.63l4.6 1.44 10.7-6.75c.5-.33.96-.15.58.18l-8.81 8.22z" />
        </svg>
        Telegram
      </a>
      <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
        className={`${base} border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100`}>
        <svg className="h-4 w-4" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12.04 2a9.9 9.9 0 00-8.5 14.94L2 22l5.2-1.5A9.9 9.9 0 1012.04 2zm5.77 14.06c-.24.68-1.4 1.3-1.93 1.35-.52.05-1.01.24-3.4-.71-2.87-1.13-4.7-4.06-4.84-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.73-2.09 1-2.37.26-.29.57-.36.76-.36l.55.01c.18 0 .41-.07.65.5.24.58.81 1.98.88 2.12.07.14.12.31.02.5-.09.19-.14.31-.28.48l-.42.5c-.14.14-.29.3-.12.58.16.29.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07.17-.19.7-.82.89-1.1.19-.29.38-.24.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.68-.16 1.31z" />
        </svg>
        WhatsApp
      </a>
    </>
  );
}
