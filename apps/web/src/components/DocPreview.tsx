"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";

/**
 * Обёртка-карточка с превью документа (лицензия/сертификат).
 * Клик по карточке открывает модалку с PDF (iframe) или изображением.
 */
export function DocPreview({
  url,
  title,
  children
}: {
  url: string;
  title: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("about");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; document.removeEventListener("keydown", onKey); };
  }, [open]);

  const isPdf = /\.pdf($|\?)/i.test(url);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group block h-full w-full cursor-zoom-in text-left"
        aria-label={title}
      >
        {children}
      </button>

      {mounted && open
        ? createPortal(
            <div className="fixed inset-0 z-[80] flex flex-col bg-slate-950/85 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
                <div className="min-w-0 truncate text-sm font-bold text-white">{title}</div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-white ring-1 ring-inset ring-white/25 hover:bg-white/20"
                  >
                    {t("openOriginal")}
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14 5h5v5M19 5l-7 7M12 5H6a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-6" /></svg>
                  </a>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label={t("close")}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white ring-1 ring-inset ring-white/25 hover:bg-white/20"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
              </div>
              <div
                className="flex flex-1 items-center justify-center overflow-auto p-3 sm:p-6"
                onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
              >
                {isPdf ? (
                  <iframe title={title} src={`${url}#view=FitH`} className="h-full w-full max-w-5xl rounded-lg bg-white" />
                ) : (
                  <img src={url} alt={title} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
