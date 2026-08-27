"use client";

import { useRef, useState } from "react";
import Image from "next/image";

/* Галерея товара: главное фото + миниатюры с переключением.
   Единый формат карточки: контейнер всегда квадратный, фото вписывается целиком
   (object-contain + внутренний отступ) — так все товары выглядят одинаково по размеру,
   независимо от пропорций исходного файла.
   При наведении курсора фото увеличивается «лупой» — точка увеличения следует за курсором. */
const ZOOM = 2.2;

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const boxRef = useRef<HTMLDivElement>(null);

  if (list.length === 0) return null;
  const main = list[Math.min(active, list.length - 1)];

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
      <div
        ref={boxRef}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => { setZoom(false); setOrigin("50% 50%"); }}
        onMouseMove={onMove}
        className="relative aspect-square w-full cursor-zoom-in overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <Image
          alt={alt}
          src={main}
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
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
              onClick={() => setActive(i)}
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
