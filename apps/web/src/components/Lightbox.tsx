"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

/* Галерея с лайтбоксом: миниатюры + просмотр поверх страницы.
   Закрытие: крестик, клик по фону, Esc, кнопка «Назад» на телефоне. Листание стрелками. */
export function Lightbox({ images, alt, gridClass }: { images: string[]; alt: string; gridClass?: string }) {
  const list = images.filter(Boolean);
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const show = (i: number) => setOpen(i);
  const prev = useCallback(() => setOpen((v) => (v === null ? v : (v - 1 + list.length) % list.length)), [list.length]);
  const next = useCallback(() => setOpen((v) => (v === null ? v : (v + 1) % list.length)), [list.length]);

  // Кнопка «Назад» на телефоне закрывает лайтбокс, а не уводит со страницы
  useEffect(() => {
    if (open === null) return;
    window.history.pushState({ lb: true }, "");
    const onPop = () => setOpen(null);
    window.addEventListener("popstate", onPop);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, prev, next]);

  // При закрытии «съесть» добавленную запись истории, если ушли не через Назад
  const handleClose = () => {
    if (window.history.state?.lb) window.history.back();
    else close();
  };

  if (list.length === 0) return null;

  return (
    <>
      <div className={gridClass ?? "mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"}>
        {list.map((src, i) => (
          <button
            key={src + i}
            type="button"
            onClick={() => show(i)}
            className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
            aria-label={`Открыть фото ${i + 1}`}
          >
            <Image
              src={src}
              alt={`${alt} — фото ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              unoptimized
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={handleClose}
            aria-label="Закрыть"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white hover:bg-white/25"
          >
            ✕
          </button>
          {list.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Предыдущее"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Следующее"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-3xl text-white hover:bg-white/25"
              >
                ›
              </button>
            </>
          )}
          <img
            src={list[open]}
            alt={`${alt} — фото ${open + 1}`}
            className="max-h-[90vh] max-w-[92vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {list.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white">
              {open + 1} / {list.length}
            </div>
          )}
        </div>
      )}
    </>
  );
}
