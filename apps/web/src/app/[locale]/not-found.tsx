"use client";

import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

// Локаль определяем из пути на клиенте: в контексте notFound() серверный i18n-контекст
// недоступен (useTranslations/getTranslations падают → Next показывает встроенную 404).
// Инлайн-словарь без зависимостей гарантирует корректный рендер на всех языках.
const T: Record<string, { title: string; text: string; home: string }> = {
  ru: { title: "Страница не найдена", text: "Возможно, ссылка неверная или страница была удалена.", home: "На главную" },
  uz: { title: "Sahifa topilmadi", text: "Havola noto‘g‘ri bo‘lishi yoki sahifa o‘chirilgan bo‘lishi mumkin.", home: "Bosh sahifaga" },
  en: { title: "Page not found", text: "The link may be incorrect or the page may have been removed.", home: "Go to homepage" },
  tr: { title: "Sayfa bulunamadı", text: "Bağlantı yanlış olabilir veya sayfa kaldırılmış olabilir.", home: "Ana sayfaya" },
  zh: { title: "页面未找到", text: "链接可能有误，或页面已被删除。", home: "返回首页" },
};

export default function NotFound() {
  const pathname = usePathname() || "/";
  const seg = pathname.split("/")[1];
  const locale = (routing.locales as readonly string[]).includes(seg) ? seg : routing.defaultLocale;
  const t = T[locale] ?? T[routing.defaultLocale];
  const homeHref = locale === routing.defaultLocale ? "/" : `/${locale}`;

  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-2 text-sm text-slate-600">{t.text}</p>
      <div className="mt-6">
        <a href={homeHref} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          {t.home} →
        </a>
      </div>
    </div>
  );
}
