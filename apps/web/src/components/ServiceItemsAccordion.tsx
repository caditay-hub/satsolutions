"use client";

import { useState } from "react";

type ServiceItemDescBlock = {
  description?: string | null;
  subDescription?: string | null;
};

type ServiceItemCard = {
  description?: string | null;
  subDescription?: string | null;
  descriptions?: ServiceItemDescBlock[] | null;
};

type ServiceItem = {
  title: string;
  imageUrl?: string | null; // Added
  /** Legacy: single block when no cards */
  description?: string | null;
  subDescription?: string | null;
  /** New: multiple cards per item */
  cards?: ServiceItemCard[] | null;
};

function resolveImageUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  // Ensure it starts with / if strictly local path, but usually API returns full or /uploads
  // Assuming process.env.NEXT_PUBLIC_API_URL is available or similar, but simplified:
  if (url.startsWith("/")) return `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"}${url}`;
  return url;
}


export function ServiceItemsAccordion({ items, sectionTitle }: { items: ServiceItem[]; sectionTitle?: string }) {
  if (!items?.length) return null;

  return (
    <div className="w-full">
      {sectionTitle ? (
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-black uppercase tracking-tight">{sectionTitle}</h2>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {items.map((item, idx) => {
          const cards = item.cards || [];
          return (
            <div key={idx} className="group flex flex-col bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-sm">
              {/* Title Header with Red Accent */}
              <div className="border-l-[6px] border-[#E60012] px-8 py-6 bg-slate-50">
                <h3 className="text-black font-extrabold text-2xl uppercase tracking-tighter">
                  {item.title}
                </h3>
              </div>

              {/* Body */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1 space-y-10">
                  {cards.map((card, cIdx) => {
                    const blocks = card.descriptions || [{ description: card.description, subDescription: card.subDescription }];
                    return (
                      <div key={cIdx} className="space-y-8">
                        {blocks.map((b, bIdx) => (
                          <div key={bIdx} className="relative transition-transform group-hover:translate-x-1 duration-300">
                            {b.description ? (
                              <h4 className="font-bold text-slate-900 text-xl mb-3 leading-snug">
                                {b.description}
                              </h4>
                            ) : null}
                            {b.subDescription ? (
                              <div className="text-slate-500 text-base leading-relaxed whitespace-pre-line font-medium">
                                {b.subDescription}
                              </div>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    )
                  })}

                  {/* Fallback for legacy items without cards */}
                  {(!cards.length && (item.description || item.subDescription)) ? (
                    <div className="space-y-4">
                      {item.description ? <h4 className="font-bold text-slate-900 text-xl">{item.description}</h4> : null}
                      {item.subDescription ? <div className="text-slate-500 text-base leading-relaxed font-medium">{item.subDescription}</div> : null}
                    </div>
                  ) : null}
                </div>

                {/* Image - Clean Bottom Box */}
                {item.imageUrl ? (
                  <div className="mt-10 overflow-hidden bg-slate-100 rounded-sm">
                    <img
                      src={resolveImageUrl(item.imageUrl)!}
                      alt={item.title}
                      className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
