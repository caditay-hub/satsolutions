"use client";

import { useEffect, useState } from "react";

/**
 * Как показывать декоративное видео.
 *
 * Ролики — украшение, под каждым лежит постер с тем же кадром. На телефоне
 * полные версии обходились в мегабайты и занимали главный поток, поэтому там
 * играет облегчённая копия (640 px, примерно вдвое легче). Полностью остаётся
 * постер только там, где движение действительно нежелательно: экономия
 * трафика, 2G и просьба убрать анимацию.
 *
 *   full  — полный ролик (компьютер)
 *   light — облегчённый ролик (телефон)
 *   off   — только постер
 */
export type VideoMode = "off" | "light" | "full";

export function decorativeVideoMode(): VideoMode {
  if (typeof window === "undefined") return "off";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "off";
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) return "off";
  if (conn?.effectiveType && /(^|-)2g$/.test(conn.effectiveType)) return "off";
  if (window.matchMedia("(max-width: 767px)").matches) return "light";
  return "full";
}

/** Путь к облегчённой копии: dir-cctv.mp4 → dir-cctv-m.mp4 (query сохраняем). */
export function lightVideoSrc(src: string): string {
  return src.replace(/(\.mp4)(\?|$)/i, "-m$1$2");
}

/** Источник ролика под режим; для «off» — пусто, ничего не качаем. */
export function videoSrcFor(src: string | null | undefined, mode: VideoMode): string | undefined {
  if (!src || mode === "off") return undefined;
  return mode === "light" ? lightVideoSrc(src) : src;
}

/** Режим как хук: «off» на сервере и на первом кадре, дальше — по факту. */
export function useDecorativeVideoMode(): VideoMode {
  const [mode, setMode] = useState<VideoMode>("off");
  useEffect(() => {
    const update = () => setMode(decorativeVideoMode());
    update();
    const mq = window.matchMedia("(max-width: 767px)");
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mode;
}
