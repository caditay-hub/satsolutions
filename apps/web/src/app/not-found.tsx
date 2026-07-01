"use client";

import { usePathname } from "next/navigation";

// Рутовый not-found: перехватывает notFound() и несопоставленные маршруты, которые
// всплывают выше [locale] (там notFound не ловится в связке next-intl). Рутового
// app/layout.tsx нет — поэтому рендерим собственный <html>/<body> и локализуем по пути.
const LOCALES = ["ru", "uz", "en", "tr", "zh"] as const;
const T: Record<string, { title: string; text: string; home: string; lang: string }> = {
  ru: { title: "Страница не найдена", text: "Возможно, ссылка неверная или страница была удалена.", home: "На главную", lang: "ru" },
  uz: { title: "Sahifa topilmadi", text: "Havola noto‘g‘ri bo‘lishi yoki sahifa o‘chirilgan bo‘lishi mumkin.", home: "Bosh sahifaga", lang: "uz" },
  en: { title: "Page not found", text: "The link may be incorrect or the page may have been removed.", home: "Go to homepage", lang: "en" },
  tr: { title: "Sayfa bulunamadı", text: "Bağlantı yanlış olabilir veya sayfa kaldırılmış olabilir.", home: "Ana sayfaya", lang: "tr" },
  zh: { title: "页面未找到", text: "链接可能有误，或页面已被删除。", home: "返回首页", lang: "zh" },
};

export default function NotFound() {
  const pathname = usePathname() || "/";
  const seg = pathname.split("/")[1];
  const locale = (LOCALES as readonly string[]).includes(seg) ? seg : "ru";
  const t = T[locale] ?? T.ru;
  const homeHref = locale === "ru" ? "/" : `/${locale}`;

  return (
    <html lang={t.lang}>
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fff", color: "#020617", fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif" }}>
        <div style={{ textAlign: "center", padding: "2rem", maxWidth: "32rem" }}>
          <div style={{ fontSize: "4rem", fontWeight: 700, color: "#1d4ed8", lineHeight: 1 }}>404</div>
          <h1 style={{ marginTop: "1rem", fontSize: "1.5rem", fontWeight: 600 }}>{t.title}</h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#475569" }}>{t.text}</p>
          <a href={homeHref} style={{ display: "inline-block", marginTop: "1.5rem", padding: "0.6rem 1.4rem", borderRadius: "0.5rem", background: "#1d4ed8", color: "#fff", fontWeight: 600, textDecoration: "none" }}>
            {t.home} →
          </a>
        </div>
      </body>
    </html>
  );
}
