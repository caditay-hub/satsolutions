"use client";

import { useEffect, useRef } from "react";
import { decorativeVideoMode, videoSrcFor } from "@/lib/lightMedia";

/* Видео-обложка: играет только пока блок в зоне видимости.
   На телефоне подставляется облегчённая копия ролика, на компьютере — полная.
   Экономия трафика, 2G, prefers-reduced-motion и ошибка загрузки → остаётся
   постер, ролик не качается вовсе (src не проставляется). */
export function AutoPlayVideo({
  src,
  poster,
  className = ""
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const chosen = videoSrcFor(src, decorativeVideoMode());
    if (!chosen) return;
    v.src = chosen;

    const start = () => v.play().catch(() => {});
    if (!("IntersectionObserver" in window)) {
      start();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) start();
        else ref.current?.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
}
