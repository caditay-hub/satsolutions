"use client";

import { useEffect, useState } from "react";

/** Плавающая кнопка «наверх» — появляется после прокрутки, скроллит страницу в начало. */
export function ScrollToTopButton({ label = "Наверх" }: { label?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-24 right-5 z-[60] inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-lg transition-colors hover:bg-brand-50 hover:text-brand-800"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="m6 15 6-6 6 6" />
      </svg>
    </button>
  );
}
