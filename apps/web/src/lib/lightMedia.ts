"use client";

import { useEffect, useState } from "react";

/**
 * Нужно ли крутить декоративное видео.
 *
 * Ролики на главной — украшение: под каждым лежит постер с тем же кадром.
 * На телефоне они обходились в несколько мегабайт (один слайд карусели —
 * 1,1 МБ) и держали занятым главный поток, из-за чего страница отвечала
 * с задержкой. Поэтому на узких экранах, при экономии трафика, медленном
 * соединении и просьбе убрать анимацию остаётся постер.
 */
export function shouldPlayDecorativeVideo(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (window.matchMedia("(max-width: 767px)").matches) return false;
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return false;
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return false;
  return true;
}

/** То же самое как хук: false на сервере и на первом кадре, дальше — по факту. */
export function useDecorativeVideo(): boolean {
  const [allow, setAllow] = useState(false);
  useEffect(() => {
    const update = () => setAllow(shouldPlayDecorativeVideo());
    update();
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return allow;
}
