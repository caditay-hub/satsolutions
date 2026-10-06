"use client";

import { useEffect, useRef } from "react";

/** Закрыть всплывающее окно клавишей Esc, пока оно открыто (доступность форм, 06.10.2026). */
export function useEscape(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);
}

/** Фокус на само окно при открытии: экранный диктор объявляет диалог, а клавиатура
 *  на телефоне не выскакивает сама (как было бы при фокусе на первое поле). */
export function useDialogFocus<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => { if (open) ref.current?.focus(); }, [open]);
  return ref;
}
