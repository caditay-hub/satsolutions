"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/* Плавное появление блока при попадании в зону видимости.
   Уважает prefers-reduced-motion: в этом случае контент виден сразу.

   Важно: с сервера блок приходит ВИДИМЫМ. Раньше он отдавался с opacity 0
   и проявлялся только после гидрации — на телефоне это 7–8 секунд, из-за
   чего первый экран считался пустым (поздний LCP) и страница ощущалась
   тормозной. Прятать имеет смысл только то, что и так за пределами экрана:
   это делается уже на клиенте, при монтировании, и посетитель не видит. */
type State = "initial" | "hidden" | "shown";

export function Reveal({
  children,
  delay = 0,
  className = ""
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>("initial");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setState("shown");
      return;
    }
    // Уже на экране — оставляем как есть, анимировать нечего.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setState("shown");
      return;
    }
    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Прятать нужно мгновенно (иначе блок на глазах гас бы), а показывать —
  // плавно: поэтому переход включается только в состоянии «показан».
  const look =
    state === "hidden"
      ? "transition-none translate-y-6 opacity-0 will-change-transform"
      : state === "shown"
        ? "transition-all duration-700 ease-out translate-y-0 opacity-100"
        : "translate-y-0 opacity-100";
  return (
    <div
      ref={ref}
      style={{ transitionDelay: state === "shown" ? `${delay}ms` : "0ms" }}
      className={`${look} ${className}`}
    >
      {children}
    </div>
  );
}
