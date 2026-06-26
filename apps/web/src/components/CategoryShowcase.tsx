"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";

export type ShowcaseTile = { name: string; href: string; img: string };

/**
 * Витрина категорий: 8 видимых плиток с 3D-иконками, которые сами медленно сменяются
 * плавным кросс-фейдом (пул больше 8 — остальные «прилетают» на место исчезнувших).
 *
 * SEO: ВСЕ плитки распределены по слотам и в DOM сразу (в т.ч. SSR) — скрытые имеют
 * opacity-0, но остаются валидными ссылками. Полный список внутренних ссылок всегда в HTML.
 * Анимация — визуальный слой; уважает prefers-reduced-motion. Пауза при наведении.
 */
export function CategoryShowcase({
  tiles,
  slots = 8,
  intervalMs = 3000,
}: {
  tiles: ShowcaseTile[];
  slots?: number;
  intervalMs?: number;
}) {
  const bucketCount = Math.min(slots, tiles.length) || 1;
  const buckets: ShowcaseTile[][] = Array.from({ length: bucketCount }, () => []);
  tiles.forEach((t, i) => buckets[i % bucketCount].push(t));

  const [active, setActive] = useState<number[]>(() => buckets.map(() => 0));
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rotatable = buckets.map((b, i) => (b.length > 1 ? i : -1)).filter((i) => i >= 0);
    if (!rotatable.length) return;
    let tick = 0;
    const id = setInterval(() => {
      const slot = rotatable[tick % rotatable.length];
      tick++;
      setActive((prev) => {
        const next = [...prev];
        next[slot] = (next[slot] + 1) % buckets[slot].length;
        return next;
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [paused, intervalMs, tiles.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ul
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4"
    >
      {buckets.map((bucket, si) => (
        <li key={si} className="relative min-h-[210px] sm:min-h-[240px]">
          {bucket.map((tile, ci) => {
            const on = active[si] === ci;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                aria-hidden={on ? undefined : true}
                tabIndex={on ? undefined : -1}
                className={`cat3d-tile group absolute inset-0 flex flex-col rounded-2xl border-2 border-slate-100 bg-white p-5 transition-all duration-700 ease-in-out hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md ${
                  on ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
              >
                <span className="flex flex-1 items-center justify-center">
                  <span className="relative flex h-[120px] w-[120px] items-center justify-center">
                    <span className="cat3d-shadow" aria-hidden="true" />
                    <img
                      src={`${tile.img}?v=2`}
                      alt={tile.name}
                      width={120}
                      height={120}
                      loading="lazy"
                      className="cat3d-img relative h-[120px] w-[120px] object-contain"
                    />
                  </span>
                </span>
                <span className="mt-2.5 inline-flex items-center gap-1.5 text-left text-[16px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-700">
                  {tile.name}
                  <svg className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </li>
      ))}
    </ul>
  );
}
