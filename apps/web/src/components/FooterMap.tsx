"use client";

import { useState } from "react";

/**
 * Карта в подвале. Единственная интерактивная часть футера, поэтому вынесена
 * отдельным клиентским островком — весь остальной подвал рендерится на сервере
 * и его ссылки видны поисковику без выполнения JavaScript.
 *
 * Iframe грузим по клику: карта тянет сторонние скрипты и бьёт по LCP на
 * странице, где её почти никто не открывает.
 */
export function FooterMap({
  widgetSrc,
  mapLabel,
  loadLabel,
  notSetLabel,
}: {
  widgetSrc: string | null;
  mapLabel: string;
  loadLabel: string;
  notSetLabel: string;
}) {
  const [show, setShow] = useState(false);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white relative min-h-[140px] sm:min-h-[200px] flex items-center justify-center group">
      {widgetSrc ? (
        !show ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
            <div className="mb-3 text-xs text-slate-700">{loadLabel}</div>
            <button
              onClick={() => setShow(true)}
              className="btn-primary !bg-brand-700 hover:!bg-brand-800 !px-4 !py-2 !text-xs"
            >
              {mapLabel}
            </button>
          </div>
        ) : (
          <iframe
            title="Карта"
            src={widgetSrc}
            className="h-44 w-full min-h-[140px] sm:h-52 z-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin allow-popups"
            referrerPolicy="no-referrer-when-downgrade"
          />
        )
      ) : (
        <div className="p-4 text-sm text-slate-700">{notSetLabel}</div>
      )}
    </div>
  );
}
