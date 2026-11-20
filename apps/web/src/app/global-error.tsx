"use client";

import { useEffect } from "react";
import { ERROR_PAGE_TEXT, errorLocaleFromPath, reportPageError } from "@/lib/errorPageTexts";
import { isBuildSkewError, reloadOnceForBuildSkew } from "@/lib/buildSkew";

// Последний рубеж: ошибка в самом макете (шапка, подвал, провайдеры). Здесь нет ни макета,
// ни стилей сайта, ни переводов — свой <html>/<body> и встроенные стили, как в корневом not-found.tsx.
export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const locale = errorLocaleFromPath(typeof window !== "undefined" ? window.location.pathname : "/");
  const t = ERROR_PAGE_TEXT[locale] ?? ERROR_PAGE_TEXT.ru;
  const homeHref = locale === "ru" ? "/" : `/${locale}`;

  useEffect(() => {
    reportPageError(error);
    // Рассинхрон сборок — одна автоматическая перезагрузка, см. lib/buildSkew.ts.
    if (isBuildSkewError(error)) reloadOnceForBuildSkew();
  }, [error]);

  return (
    <html lang={locale} translate="no">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#020617", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{t.title}</h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#475569" }}>{t.text}</p>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#475569" }}>{t.hint}</p>
          <div style={{ marginTop: "1.5rem", display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{ border: 0, borderRadius: "0.5rem", background: "#1d4ed8", color: "#fff", padding: "0.65rem 1rem", fontSize: "0.9rem", fontWeight: 600, cursor: "pointer" }}
            >
              {t.reload}
            </button>
            <a href={homeHref} style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1d4ed8", textDecoration: "none" }}>
              {t.home} →
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
