"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* Галерея товара: главное фото + миниатюры с переключением.
   Единый формат карточки: контейнер всегда квадратный, фото вписывается целиком
   (object-contain + внутренний отступ) — так все товары выглядят одинаково по размеру,
   независимо от пропорций исходного файла.

   Два режима:
   · телефон и планшет — лента со снапом: фото листаются пальцем, под лентой точки;
   · десктоп — одно фото с «лупой»: точка увеличения следует за курсором.
   Оба режима делят один активный индекс, поэтому миниатюры работают везде одинаково. */
const ZOOM = 2.2;

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const boxRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  // прокрутка, запущенная нами (клик по миниатюре), не должна тут же
  // пересчитывать активный индекс из промежуточных позиций ленты
  const scrolling = useRef(false);

  // следующий кадр подгружаем заранее — свайп не должен упираться в белый квадрат
  useEffect(() => {
    const next = list[active + 1];
    if (!next) return;
    const img = new window.Image();
    img.src = next;
  }, [active, list]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    let timer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (scrolling.current) return;
        const i = Math.round(strip.scrollLeft / Math.max(strip.clientWidth, 1));
        setActive(Math.max(0, Math.min(list.length - 1, i)));
      }, 80);
    };
    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      strip.removeEventListener("scroll", onScroll);
    };
  }, [list.length]);

  if (list.length === 0) return null;
  const main = list[Math.min(active, list.length - 1)];

  const goTo = (i: number) => {
    setActive(i);
    const strip = stripRef.current;
    if (!strip) return;
    scrolling.current = true;
    strip.scrollTo({ left: i * strip.clientWidth, behavior: "smooth" });
    setTimeout(() => { scrolling.current = false; }, 400);
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const box = boxRef.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setOrigin(`${Math.max(0, Math.min(100, x))}% ${Math.max(0, Math.min(100, y))}%`);
  };

  return (
    <div>
      {/* лента для пальца — до десктопа */}
      <div className="lg:hidden">
        <div
          ref={stripRef}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-xl border border-slate-200 bg-white [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {list.map((src, i) => (
            <div key={src + i} className="relative aspect-square w-full shrink-0 snap-center">
              <Image
                alt={i === 0 ? alt : `${alt} — фото ${i + 1}`}
                src={src}
                fill
                sizes="100vw"
                className="object-contain p-6"
                priority={i === 0}
                loading={i < 2 ? "eager" : "lazy"}
                unoptimized
              />
            </div>
          ))}
        </div>
        {list.length > 1 ? (
          <div className="mt-2 flex justify-center gap-1.5" aria-hidden>
            {list.map((src, i) => (
              <span
                key={src + i}
                className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-brand-600" : "w-1.5 bg-slate-300"}`}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* десктоп — фото с лупой */}
      <div
        ref={boxRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => { setZoom(false); setOrigin("50% 50%"); }}
        onMouseMove={onMove}
        className="relative hidden aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-white lg:block"
      >
        <Image
          alt={alt}
          src={main}
          fill
          sizes="40vw"
          className="object-contain p-6 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: zoom ? `scale(${ZOOM})` : "scale(1)", transformOrigin: origin }}
          priority
          unoptimized
        />
      </div>

      {list.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => goTo(i)}
              onMouseEnter={() => setActive(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                i === active ? "border-brand-500" : "border-slate-200 hover:border-brand-300"
              }`}
            >
              <Image src={src} alt={`${alt} — фото ${i + 1}`} fill sizes="80px" className="object-contain p-1.5" unoptimized />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
