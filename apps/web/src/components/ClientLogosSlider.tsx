"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";
import type { PortfolioDto } from "@/lib/api";

interface ClientLogosSliderProps {
  logos: PortfolioDto[];
  className?: string;
}

export function ClientLogosSlider({ logos, className = "" }: ClientLogosSliderProps) {
  /* Filter logos that have client logos and limit to 20 for performance */
  const logosWithImages = logos.filter(logo => logo.clientlogourl).slice(0, 20);

  if (logosWithImages.length === 0) return null;

  /* Duplicate logos for infinite scroll effect (3 sets to ensure full coverage) */
  const duplicatedLogos = [...logosWithImages, ...logosWithImages, ...logosWithImages];

  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="container-page">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Наши клиенты</h2>
          <p className="mt-1 text-sm text-slate-600">Компании, которым мы доверяем</p>
        </div>

        <div className="relative overflow-hidden group">
          <div className="flex animate-scroll hover:pause">
            {duplicatedLogos.map((logo, index) => {
              const uniqueKey = `${logo.id}-${index}`;
              const logoUrl = resolveImageUrl(logo.clientlogourl);
              return (
                <div
                  key={uniqueKey}
                  className="mx-4 flex h-32 w-48 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-slate-300 hover:shadow-md"
                >
                  {logoUrl ? (
                    <Image
                      src={logoUrl}
                      alt={logo.clientName || logo.title}
                      width={200}
                      height={100}
                      className="max-h-full max-w-full object-contain"
                    />
                  ) : (
                    <div className="text-xs text-center text-slate-500">
                      {logo.clientName || logo.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Gradient fade effects */}
          <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />
        </div>
      </div>
    </div>
  );
}
