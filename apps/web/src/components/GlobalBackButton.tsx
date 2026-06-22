"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

// Global, always-in-the-same-place "Back" button.
// Fixed at the bottom-left on every page except the home page.
export function GlobalBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("common");

  // Скрываем на главной — как для ru (/), так и для локалей (/en, /uz, ...)
  if (pathname === "/" || /^\/(uz|en|tr|zh)\/?$/.test(pathname)) return null;

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label={t("back")}
      className="fixed bottom-5 left-5 z-40 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-black/20 transition-colors hover:bg-brand-700"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      {t("back")}
    </button>
  );
}
