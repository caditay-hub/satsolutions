"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  src: string | null | undefined;
  alt: string;
  fallbackLetter: string;
}

/** Consistent 4:3 image thumbnail for category cards.
 *  Shows the image if available; falls back to an icon placeholder on error. */
export function CategoryThumb({ src, alt, fallbackLetter }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="aspect-[4/3] flex flex-col items-center justify-center bg-slate-50 gap-1">
        {/* Camera icon */}
        <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-xs font-bold text-slate-300">{fallbackLetter}</span>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, 180px"
        className="object-contain p-3"
        onError={() => setFailed(true)}
        unoptimized={src.startsWith("https://") && !src.includes("satsolutions")}
      />
    </div>
  );
}
