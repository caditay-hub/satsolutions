"use client";

// Отправка GA4 page_view при клиентских (SPA) переходах App Router.
// Первый просмотр уже уходит через gtag('config', …) на полной загрузке —
// поэтому самый первый рендер пропускаем, чтобы не задваивать.
// ВАЖНО: использует useSearchParams → ОБЯЗАТЕЛЬНО оборачивать в <Suspense>,
// иначе маршрут деоптимизируется в client-side rendering (вредно для SEO).
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const GA4_ID = "G-SHQYK1BS1S";

export default function GaPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false; // первый page_view уже отправлен из config
      return;
    }
    if (typeof window === "undefined" || typeof window.gtag !== "function") return;

    const qs = searchParams?.toString();
    const page_path = pathname + (qs ? `?${qs}` : "");
    window.gtag("event", "page_view", {
      send_to: GA4_ID,
      page_path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
