"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ERROR_PAGE_TEXT, errorLocaleFromPath, reportPageError } from "@/lib/errorPageTexts";

// Страница ошибки вместо пустого экрана (19.11.2026). Повод — Sentry SATSOLUTIONS-WEB-C:
// автоперевод Яндекс Браузера переставил узлы страницы, React не смог удалить свой узел и
// страница исчезла целиком. Шапка и подвал остаются: ошибка ловится внутри макета [locale].
export default function LocaleError({ error }: { error: Error & { digest?: string } }) {
  const pathname = usePathname();
  const locale = errorLocaleFromPath(pathname);
  const t = ERROR_PAGE_TEXT[locale] ?? ERROR_PAGE_TEXT.ru;
  const homeHref = locale === "ru" ? "/" : `/${locale}`;

  useEffect(() => {
    reportPageError(error);
  }, [error]);

  return (
    <div className="container-page py-16" translate="no">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{t.text}</p>
      <p className="mt-2 max-w-2xl text-sm text-slate-600">{t.hint}</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        {/* Полная перезагрузка, а не reset(): после вмешательства переводчика дерево страницы уже испорчено */}
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {t.reload}
        </button>
        <a href={homeHref} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          {t.home} →
        </a>
      </div>
    </div>
  );
}
