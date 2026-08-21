"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { resolveImageUrl } from "@/lib/image";
import { optimizedImg } from "@/lib/imgProxy";
import { useDecorativeVideo } from "@/lib/lightMedia";

export type HeroButton = {
  label: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  title: string;
  text?: string | null;
  imageUrl: string;
  videoUrl?: string | null;
  sortOrder?: number;
  published?: boolean;
  buttons?: HeroButton[] | null;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

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
  fallbackText,
  prevLabel = "Previous",
  nextLabel = "Next",
  slideLabel = "Slide"
}: {
  slides: HeroSlide[];
  fallbackTitle: string;
  fallbackText: string;
  prevLabel?: string;
  nextLabel?: string;
  slideLabel?: string;
}) {
  // Фон слайда: на телефоне и при экономии трафика вместо ролика остаётся
  // его же кадр — иначе первый слайд качал больше мегабайта видео.
  const allowVideo = useDecorativeVideo();

  const items = useMemo(() => {
    return (slides ?? [])
      .filter((s) => s && (s.published ?? true) && typeof s.imageUrl === "string" && s.imageUrl.trim())
      .slice()
      .sort((a, b) => (Number(a.sortOrder ?? 0) || 0) - (Number(b.sortOrder ?? 0) || 0) || String(a.id).localeCompare(String(b.id)));
  }, [slides]);

  const [idx, setIdx] = useState(0);
  const count = items.length;

  // Ручной свайп на мобильном: свайп влево/вправо листает слайд.
  // swipedRef подавляет клик-навигацию по слайду, если это был свайп, а не тап.
  const startXRef = useRef(0);
  const swipedRef = useRef(false);
  function onTouchStart(e: React.TouchEvent) {
    startXRef.current = e.touches[0]?.clientX ?? 0;
    swipedRef.current = false;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (count <= 1) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - startXRef.current;
    if (Math.abs(dx) > 40) {
      swipedRef.current = true;
      setIdx((v) => (dx < 0 ? (v + 1) % count : (v - 1 + count) % count));
    }
  }
  function onSlideClick(e: React.MouseEvent) {
    if (swipedRef.current) { e.preventDefault(); swipedRef.current = false; }
  }

  useEffect(() => {
    setIdx(0);
  }, [count]);

  // Автопрокрутка: таймер перезапускается при КАЖДОЙ смене слайда (в т.ч. ручной) —
  // иначе после клика стрелкой следующий слайд мог смениться почти сразу
  // (старый интервал продолжал тикать), и карусель «крутилась по-разному».
  useEffect(() => {
    if (count <= 1) return;
    const id = window.setTimeout(() => setIdx((v) => (v + 1) % count), 6000);
    return () => window.clearTimeout(id);
  }, [count, idx]);

  return (
    <div className="group/hero relative overflow-hidden bg-slate-950 w-full">
      {/* Full-bleed cinematic carousel — horizontal slide rail */}
      <div className="relative w-full h-[58vw] sm:h-[52vw] md:h-[48vw] lg:h-[42vw] min-h-[420px] max-h-[760px]">
        {count > 0 ? (
          <div
            className="absolute inset-0 flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              width: `${count * 100}%`,
              transform: `translateX(-${idx * (100 / count)}%)`,
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {items.map((slide, i) => {
              const sImg = resolveImageUrl(slide.imageUrl);
              const sVideo = (slide.videoUrl ?? "").toString().trim();
              const sTitle = slide.title?.trim() || fallbackTitle;
              const sIsFallback = !slide.title?.trim();
              const sText = (slide.text ?? "").toString().trim() || fallbackText;
              const sBtns = normalizeButtons(slide.buttons);
              // Тап по слайду ведёт на его услугу: первая внутренняя ссылка, не /contact
              // (это «Подробнее»/страница услуги), иначе первая кнопка, иначе /products.
              const detailBtn = sBtns.find((b) => !isExternalHref(b.href) && !/\/contact\b/i.test(b.href)) ?? sBtns[0];
              const detailHref = detailBtn?.href || "/products";
              const detailExternal = isExternalHref(detailHref);
              const isActive = i === idx;
              return (
                <div
                  key={slide.id}
                  className="relative shrink-0 h-full"
                  style={{ width: `${100 / count}%` }}
                  aria-hidden={!isActive}
                >
                  {/* Тап по всему слайду → страница услуги (z-10: под стрелками/точками z-20) */}
                  {detailExternal ? (
                    <a href={detailHref} aria-label={sTitle} tabIndex={isActive ? 0 : -1} onClick={onSlideClick} rel="noopener noreferrer" className="absolute inset-0 z-10" />
                  ) : (
                    <Link href={detailHref} aria-label={sTitle} tabIndex={isActive ? 0 : -1} onClick={onSlideClick} className="absolute inset-0 z-10" />
                  )}
                  {sVideo && allowVideo ? (
                    <video
                      src={sVideo}
                      autoPlay={isActive}
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={sImg ? optimizedImg(sImg, 1080) : undefined}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : sImg ? (
                    <Image
                      alt={sTitle}
                      src={sImg}
                      fill
                      priority={i === 0}
                      loading={i === 0 ? undefined : "lazy"}
                      sizes="100vw"
                      className="object-cover object-center"
                    />
                  ) : null}

                  {/* Per-slide overlays */}
                  <div className="absolute inset-0 bg-slate-950/55" />
                  <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-950/50 to-transparent" />

                  {/* Per-slide content */}
                  <div className="absolute inset-0 mx-auto max-w-[1480px] w-full px-6 sm:px-10 md:px-14 lg:px-20 py-8">
                    <div
                      className={`flex h-full flex-col items-center justify-center text-center pb-12 sm:pb-16 transition-all duration-700 ${
                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <div className="max-w-3xl mx-auto">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3.5 py-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-white ring-1 ring-inset ring-white/25">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
                          SAT Solutions
                        </span>

                        {i === 0 ? (
                          <h1
                            className={`mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white line-clamp-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] [text-wrap:balance] ${sIsFallback ? "font-aria" : ""}`}
                            suppressHydrationWarning
                          >
                            {sTitle}
                          </h1>
                        ) : (
                          <h2
                            className={`mt-4 sm:mt-5 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-white line-clamp-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)] [text-wrap:balance] ${sIsFallback ? "font-aria" : ""}`}
                            suppressHydrationWarning
                          >
                            {sTitle}
                          </h2>
                        )}

                        <p
                          className="mt-4 sm:mt-5 mx-auto max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-white/85 line-clamp-2 sm:line-clamp-3 [text-wrap:balance]"
                          suppressHydrationWarning
                        >
                          {sText}
                        </p>

                        {/* Кнопки убраны — весь слайд кликабелен (ссылка-оверлей ниже) */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : null}

        {/* Side arrows — vertically centered on left/right edges */}
        {count > 1 ? (
          <>
            <button
              type="button"
              aria-label={prevLabel}
              onClick={() => setIdx((v) => (v - 1 + count) % count)}
              className="hidden sm:flex absolute left-3 md:left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white ring-1 ring-inset ring-white/25 hover:bg-white/25 hover:ring-white/60 hover:scale-105 transition-all"
            >
              <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              onClick={() => setIdx((v) => (v + 1) % count)}
              className="hidden sm:flex absolute right-3 md:right-6 lg:right-10 top-1/2 -translate-y-1/2 z-20 h-12 w-12 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-md text-white ring-1 ring-inset ring-white/25 hover:bg-white/25 hover:ring-white/60 hover:scale-105 transition-all"
            >
              <svg className="h-5 w-5 lg:h-6 lg:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators — bottom, centered */}
            <div className="absolute bottom-5 sm:bottom-7 inset-x-0 z-20">
              <div className="mx-auto max-w-[1480px] px-6 sm:px-10 md:px-14 lg:px-20 flex items-center justify-center gap-3">
                <div className="flex items-center gap-2">
                  {items.map((s, i) => {
                    const activeDot = i === idx;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setIdx(i)}
                        aria-label={`${slideLabel} ${i + 1}`}
                        className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-full py-1.5"
                      >
                        <span
                          className={`block h-1 rounded-full transition-all duration-500 ${activeDot ? "w-10 bg-brand-400" : "w-5 bg-white/35 group-hover:bg-white/70"}`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-bold tabular-nums text-white/70 ml-2">
                  {String(idx + 1).padStart(2, "0")}
                  <span className="mx-1 text-white/30">/</span>
                  <span className="text-white/40">{String(count).padStart(2, "0")}</span>
                </span>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

