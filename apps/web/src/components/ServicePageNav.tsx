"use client";

import { useEffect, useRef, useState } from "react";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";

/* Навигация страницы услуги/отрасли (решение владельца 10.09.2026): контакты ушли из
   первого экрана. На компьютере они в липкой полосе разделов, на телефоне — блоком
   #order перед вопросами и тонкой панелью внизу.
   ⚠️ Ни у полосы, ни у панели нет transform/backdrop-filter: внутри лежит кнопка
   «Получить КП», её модальное окно — position: fixed, а такие свойства предка
   запирают fixed внутри его рамки и окно не открывается на весь экран. */

const PHONE = "+998978626699";
const PHONE_HUMAN = "+998 97 862 66 99";
// бот, а не личный аккаунт: обращение сразу заводит тему менеджеров и карточку в CRM
const TELEGRAM = "https://t.me/SAT_zayavki_online_bot";

function PhoneIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M9.04 15.51l-.37 5.23c.53 0 .76-.23 1.04-.5l2.5-2.39 5.18 3.79c.95.52 1.62.25 1.88-.88l3.4-15.95c.3-1.4-.51-1.95-1.43-1.6L2.2 10.79c-1.36.53-1.34 1.29-.23 1.63l4.6 1.44 10.7-6.75c.5-.33.96-.15.58.18l-8.81 8.22z" />
    </svg>
  );
}

export type SectionNavItem = { id: string; label: string; mobileOnly?: boolean };

/** Липкая полоса разделов под шапкой (шапка — h-16, отсюда top-16). Компьютер: якоря
 *  + телефон, Telegram и одна «Получить КП». Телефон: лента разделов. */
export function SectionNav({
  items, ariaLabel, quoteLabel, quoteProduct, showQuote = true,
}: {
  items: SectionNavItem[]; ariaLabel: string; quoteLabel: string; quoteProduct: string; showQuote?: boolean;
}) {
  const [cur, setCur] = useState(items[0]?.id ?? "");
  const stripRef = useRef<HTMLElement>(null);

  // текущий раздел — последний, чей верх уже прошёл под полосу
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      let c = items[0]?.id ?? "";
      for (const it of items) {
        const el = document.getElementById(it.id);
        if (el && el.offsetParent !== null && el.getBoundingClientRect().top <= 150) c = it.id;
      }
      setCur(c);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [items]);

  // на телефоне лента длиннее экрана — держим активный пункт в поле зрения
  useEffect(() => {
    const strip = stripRef.current;
    const a = strip?.querySelector<HTMLElement>(`a[href="#${cur}"]`);
    if (strip && a && strip.scrollWidth > strip.clientWidth) strip.scrollTo({ left: Math.max(0, a.offsetLeft - 16) });
  }, [cur]);

  if (!items.length) return null;
  return (
    <div className="pointer-events-none sticky top-16 z-30 mt-4 border-y border-slate-200 bg-white lg:mt-6 lg:border-0 lg:bg-transparent">
      <div className="container-page">
        <div className="pointer-events-auto flex items-center gap-3 py-2 lg:rounded-2xl lg:border lg:border-slate-200 lg:bg-white lg:px-2 lg:shadow-[0_6px_18px_-14px_rgba(15,23,42,0.35)]">
          <nav ref={stripRef} aria-label={ariaLabel}
            className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map((it) => (
              <a key={it.id} href={`#${it.id}`}
                className={`${it.mobileOnly ? "lg:hidden " : ""}shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-bold transition-colors lg:rounded-lg lg:py-2 lg:text-sm ${
                  cur === it.id ? "bg-brand-600 text-white lg:bg-brand-50 lg:text-brand-800" : "bg-slate-100 text-slate-600 hover:text-slate-900 lg:bg-transparent"
                }`}>
                {it.label}
              </a>
            ))}
          </nav>
          <div data-placement="section-bar" className="hidden shrink-0 items-center gap-2 lg:flex">
            <a href={`tel:${PHONE}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-extrabold text-slate-900 transition-colors hover:border-brand-500">
              <PhoneIcon />{PHONE_HUMAN}
            </a>
            <a href={TELEGRAM} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-2 text-sm font-bold text-sky-800 transition-colors hover:bg-sky-100">
              <TelegramIcon />Telegram
            </a>
            {showQuote ? <RequestQuoteButton label={quoteLabel} variant="brand" productName={quoteProduct} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Тонкая панель внизу на телефоне: появляется, когда человек дошёл до раздела цен
 *  (startId — «уже прочитал предложение»), и прячется, пока на экране блок заказа. */
export function MobileContactBar({
  startId, orderId = "order", callLabel, quoteLabel, quoteProduct,
}: {
  startId: string; orderId?: string; callLabel: string; quoteLabel: string; quoteProduct: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight;
      const start = document.getElementById(startId);
      const reached = window.scrollY > 200 && (start ? start.getBoundingClientRect().top < vh * 0.6 : window.scrollY > vh);
      const order = document.getElementById(orderId);
      let orderOnScreen = false;
      if (order && order.offsetParent !== null) {
        const r = order.getBoundingClientRect();
        orderOnScreen = r.top < vh - 40 && r.bottom > 40;
      }
      setShow(reached && !orderOnScreen);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // раскладка меняется и без прокрутки (догрузились стили, шрифты, картинки)
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onScroll) : null;
    ro?.observe(document.body);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      ro?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [startId, orderId]);

  // Спрятанная панель уезжает на 160 px и становится invisible: в узбекском подписи
  // длиннее и панель выше 96 px — при -bottom-24 её край торчал из-под экрана (10.09.2026).
  // плавающие кнопки («Назад», «Наверх», чат) поднимаются над панелью — см. .fab-lift в globals.css
  useEffect(() => {
    const el = document.documentElement;
    if (show) el.dataset.cbar = "1";
    else delete el.dataset.cbar;
    return () => { delete el.dataset.cbar; };
  }, [show]);

  return (
    <div data-placement="mobile-bar" aria-hidden={!show}
      className={`fixed inset-x-0 z-40 border-t border-slate-200 bg-white px-2.5 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_20px_-12px_rgba(15,23,42,0.35)] transition-[bottom] duration-200 lg:hidden ${
        show ? "visible bottom-0" : "pointer-events-none invisible -bottom-40"
      }`}>
      <div className="grid grid-cols-[1fr_1fr_1.25fr] items-stretch gap-2">
        <a href={`tel:${PHONE}`} tabIndex={show ? 0 : -1}
          className="inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-slate-300 bg-white px-2 py-2.5 text-[13px] font-extrabold text-slate-900">
          <PhoneIcon />{callLabel}
        </a>
        <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" tabIndex={show ? 0 : -1}
          className="inline-flex min-w-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-sky-200 bg-sky-50 px-2 py-2.5 text-[13px] font-extrabold text-sky-800">
          <TelegramIcon />Telegram
        </a>
        <RequestQuoteButton label={quoteLabel} variant="brand" fullWidth productName={quoteProduct} />
      </div>
    </div>
  );
}
