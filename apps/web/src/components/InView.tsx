"use client";

// Одноразовое появление блока-иллюстрации при прокрутке (схемы, ленты, графики).
// Отличие от Reveal: здесь не одна обёртка с opacity, а классы-варианты — дети
// выезжают по очереди, столбики графика растут, линия схемы прорисовывается.
//
// Порядок как в Reveal: с сервера блок приходит ВИДИМЫМ. Прячем только то, что
// сейчас за пределами экрана, и только на клиенте — без JavaScript и при
// prefers-reduced-motion содержимое видно сразу (правила в globals.css).
import { useEffect, useRef, type ReactNode } from "react";

export type InViewVariant = "rv" | "rv-stagger" | "rv-bars" | "rv-line";

export function InView({
  children,
  variant = "rv",
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  variant?: InViewVariant;
  className?: string;
  as?: "div" | "ol" | "ul";
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) return; // уже на экране — не трогаем

    el.classList.add("rv-armed");
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        el.classList.add("is-in");
        io.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref as never} className={`${variant} ${className}`.trim()}>
      {children}
    </Tag>
  );
}
