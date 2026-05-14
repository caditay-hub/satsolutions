"use client";

import { useEffect, useMemo, useState, useRef } from "react";

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

export function HandwriteText({
  text,
  speedMs = 8,
  maxChars = 600,
  className = "",
  textClassName = "",
  reserveFinalHeight = false
}: {
  text: string;
  speedMs?: number;
  maxChars?: number;
  className?: string;
  textClassName?: string;
  reserveFinalHeight?: boolean;
}) {
  const full = useMemo(() => {
    const t = (text ?? "").toString().trim();
    if (!t) return "Контент будет добавлен позже.";
    const clipped = t.length > maxChars ? `${t.slice(0, maxChars).trimEnd()}…` : t;
    return clipped;
  }, [text, maxChars]);

  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        obs.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) {
      obs.observe(ref.current);
    }

    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timeout = setTimeout(() => {
      if (prefersReducedMotion()) {
        setShown(full);
        setDone(true);
        return;
      }

      setShown("");
      setDone(false);

      let i = 0;
      const interval = speedMs < 4 ? 4 : speedMs; // Don't choke the thread
      const id = window.setInterval(() => {
        const step = Math.random() < 0.15 ? 3 : 1;
        i = Math.min(full.length, i + step);
        setShown(full.slice(0, i));
        if (i >= full.length) {
          window.clearInterval(id);
          setDone(true);
        }
      }, interval);
    }, 1000); // Prioritize LCP image render

    return () => clearTimeout(timeout);
  }, [full, speedMs, isVisible]);

  const baseTextClass = textClassName || "font-sans text-base leading-relaxed sm:text-lg";
  return (
    <div ref={ref} className={`whitespace-pre-wrap ${reserveFinalHeight ? "relative" : ""} ${className || "text-slate-800"}`}>
      {reserveFinalHeight ? (
        // Reserve the final (wrapped) height to avoid layout shift while typing.
        <div aria-hidden="true" className={`${baseTextClass} pointer-events-none select-none opacity-0`}>
          {full}
        </div>
      ) : null}
      <div className={reserveFinalHeight ? "absolute inset-0" : ""}>
        <span className={baseTextClass}>{shown}</span>
        {!done ? <span className="absolute ml-1 inline-block h-[1.2em] w-[2px] animate-pulse bg-slate-900/70 align-middle" /> : null}
      </div>
    </div>
  );
}

