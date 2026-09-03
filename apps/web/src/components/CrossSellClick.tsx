"use client";

import type { ReactNode } from "react";

/** Обёртка блока «С этим покупают»: шлёт GA4-событие select_item по клику на карточку,
 *  чтобы измерять CTR кросс-селла. gtag может отсутствовать (adblock) — молча пропускаем. */
export function CrossSellClick({ children }: { children: ReactNode }) {
  return (
    <div
      onClickCapture={(e) => {
        const a = (e.target as HTMLElement).closest?.("a[href*='/products/']");
        if (!a) return;
        try {
          (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag?.("event", "select_item", {
            item_list_name: "bought_with",
            item_href: a.getAttribute("href") ?? "",
          });
        } catch {
          /* нет gtag — не мешаем переходу */
        }
      }}
    >
      {children}
    </div>
  );
}
