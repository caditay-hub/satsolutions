"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { resolveImageUrl } from "@/lib/image";

export type HeroButton = {
  label: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  text?: string | null;
  imageUrl: string;
  sortOrder?: number;
  published?: boolean;
  buttons?: HeroButton[] | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

const DEFAULT_BUTTONS: HeroButton[] = [
  { label: "Категории", href: "/categories" },
  { label: "Продукты", href: "/products" },
  { label: "Контакты", href: "/contact" }
];

function normalizeButtons(input: unknown): HeroButton[] {
  const arr = Array.isArray(input) ? input : [];
  return arr
    .map((it: any) => ({
      label: typeof it?.label === "string" ? it.label.trim() : "",
      href: typeof it?.href === "string" ? it.href.trim() : ""
    }))
    .filter((b: HeroButton) => b.label && b.href)
    .slice(0, 3);
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function HeroCarousel({
  slides,
  fallbackTitle,
  fallbackText
}: {
  slides: HeroSlide[];
  fallbackTitle: string;
  fallbackText: string;
}) {
  const items = useMemo(() => {
    return (slides ?? [])
      .filter((s) => s && (s.published ?? true) && typeof s.imageUrl === "string" && s.imageUrl.trim())
      .slice()
      .sort((a, b) => (Number(a.sortOrder ?? 0) || 0) - (Number(b.sortOrder ?? 0) || 0) || String(a.id).localeCompare(String(b.id)));
  }, [slides]);

  const [idx, setIdx] = useState(0);
  const count = items.length;

  useEffect(() => {
    setIdx(0);
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const id = window.setInterval(() => setIdx((v) => (v + 1) % count), 6000);
    return () => window.clearInterval(id);
  }, [count]);

  const active = count ? items[clamp(idx, 0, count - 1)] : null;
  const img = active ? resolveImageUrl(active.imageUrl) : null;
  const rawTitle = active?.title?.trim() || "";
  const titleIsFallback = !rawTitle;
  const title = rawTitle || fallbackTitle;
  const text = (active?.text ?? "").toString().trim() || fallbackText;
  const configuredButtons = normalizeButtons(active?.buttons);
  const buttons = configuredButtons.length ? configuredButtons : DEFAULT_BUTTONS;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-900">
      <div className="relative aspect-[16/7] w-full">
        {img ? (
          <>
            <Image
              alt={title}
              src={img}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
              className="object-contain object-center"
              fetchPriority="high"
              quality={75}
              decoding="sync"
            />
          </>
        ) : (
          <div className="h-full w-full bg-slate-100" />
        )}

        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/15" />

        <div className="absolute inset-0 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="flex h-full flex-col justify-end">
            <div className="max-w-xl">
              <div className={`text-base sm:text-lg md:text-2xl lg:text-4xl font-black tracking-tight text-white drop-shadow-md ${titleIsFallback ? "font-aria" : ""}`} suppressHydrationWarning>{title}</div>
              <div className="mt-1 sm:mt-2 md:mt-3 text-xs sm:text-sm md:text-base lg:text-lg font-bold text-white drop-shadow-sm" suppressHydrationWarning>{text}</div>
              <div className="mt-2 sm:mt-3 md:mt-5 hidden sm:flex flex-wrap gap-1 sm:gap-2 md:gap-3 hero-buttons">
                {buttons.map((b, i) => {
                  const primary = i === 0;
                  const className = primary
                    ? "btn-primary !px-2 sm:!px-3 md:!px-4 !py-1 sm:!py-1.5 md:!py-2"
                    : "btn-secondary !bg-white/10 !text-white !border-white/40 hover:!bg-white/15 !px-2 sm:!px-3 md:!px-4 !py-1 sm:!py-1.5 md:!py-2";
                  return isExternalHref(b.href) ? (
                    <a key={`${b.href}-${i}`} href={b.href} className={className} rel="noopener noreferrer">
                      {b.label}
                    </a>
                  ) : (
                    <Link key={`${b.href}-${i}`} href={b.href} className={className}>
                      {b.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {count > 1 ? (
              <div className="mt-3 sm:mt-4 md:mt-6 flex items-center gap-1 sm:gap-1.5 md:gap-2">
                {items.map((s, i) => {
                  const activeDot = i === idx;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Слайд ${i + 1}`}
                      className="group p-2 focus:outline-none"
                    >
                      <span
                        className={`block h-1.5 sm:h-2 md:h-2.5 w-1.5 sm:w-2 md:w-2.5 rounded-full border transition-colors ${activeDot
                          ? "border-white bg-white"
                          : "border-white/70 bg-white/20 group-hover:bg-white/35"
                          }`}
                      />
                    </button>
                  );
                })}

                <div className="ml-auto flex items-center gap-1 sm:gap-1.5 md:gap-2">
                  <button
                    type="button"
                    aria-label="Предыдущий"
                    onClick={() => setIdx((v) => (v - 1 + count) % count)}
                    className="btn-secondary !h-6 sm:!h-7 md:!h-9 !w-6 sm:!w-7 md:!w-9 !p-0 !bg-white/10 !text-white !border-white/40 hover:!bg-white/15"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Следующий"
                    onClick={() => setIdx((v) => (v + 1) % count)}
                    className="btn-secondary !h-6 sm:!h-7 md:!h-9 !w-6 sm:!w-7 md:!w-9 !p-0 !bg-white/10 !text-white !border-white/40 hover:!bg-white/15"
                  >
                    →
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

