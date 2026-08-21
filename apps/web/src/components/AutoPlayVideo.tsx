"use client";

import { useEffect, useRef } from "react";
import { shouldPlayDecorativeVideo } from "@/lib/lightMedia";

/* Видео-обложка: играет только пока блок в зоне видимости.
   Телефон, экономия трафика, медленная сеть, prefers-reduced-motion
   и ошибка загрузки → остаётся постер, ролик не качается. */
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
    if (!shouldPlayDecorativeVideo()) return;
    if (!("IntersectionObserver" in window)) {
      v.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) {
          ref.current?.play().catch(() => {});
        } else {
          ref.current?.pause();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
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
