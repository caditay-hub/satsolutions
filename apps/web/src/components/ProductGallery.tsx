"use client";

import { useState } from "react";
import Image from "next/image";

/* Галерея товара: главное фото + миниатюры с переключением. */
export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const list = images.filter(Boolean);
  const [active, setActive] = useState(0);
  if (list.length === 0) return null;
  const main = list[Math.min(active, list.length - 1)];

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <Image
          alt={alt}
          src={main}
          width={1200}
          height={900}
          sizes="(max-width: 1024px) 100vw, 32vw"
          className="h-auto w-full object-contain"
          priority
        />
      </div>
      {list.length > 1 ? (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {list.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Фото ${i + 1}`}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-white transition-colors ${
                i === active ? "border-brand-500" : "border-slate-200 hover:border-brand-300"
              }`}
            >
              <Image src={src} alt={`${alt} — фото ${i + 1}`} fill sizes="80px" className="object-contain" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
