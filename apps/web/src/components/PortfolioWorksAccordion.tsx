"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type WorkItem = {
  title: string;
  description?: string | null;
  cards?:
  | {
    description?: string | null;
    subDescription?: string | null;
    descriptions?: { description?: string | null; subDescriptions?: string[] }[] | null;
  }[]
  | null;
};

function getWorkBlocks(it: WorkItem): { description: string; subDescriptions: string[] }[] {
  const blocks: { description: string; subDescriptions: string[] }[] = [];
  const cards = it?.cards;
  if (Array.isArray(cards) && cards.length > 0) {
    for (const card of cards) {
      const list = Array.isArray(card?.descriptions) && card.descriptions.length > 0
        ? card.descriptions
        : [{ description: card?.description ?? null, subDescriptions: [] }];
      for (const b of list) {
        const desc = typeof b?.description === "string" ? b.description.trim() : "";
        const subs = Array.isArray(b?.subDescriptions) ? b.subDescriptions.filter((s: string) => s.trim()) : [];
        if (desc || subs.length > 0) {
          blocks.push({
            description: desc,
            subDescriptions: subs
          });
        }
      }
    }
  } else {
    const d = typeof it?.description === "string" ? it.description.trim() : "";
    if (d) {
      blocks.push({
        description: d,
        subDescriptions: []
      });
    }
  }
  return blocks;
}

function pickSummary(blocks: { description: string; subDescriptions: string[] }[]) {
  const firstBlock = blocks[0];
  if (firstBlock) {
    return firstBlock.description || firstBlock.subDescriptions[0] || "";
  }
  return "";
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      className={`h-5 w-5 shrink-0 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortfolioWorksAccordion({
  works,
  images
}: {
  works: WorkItem[];
  images: string[]; // resolved absolute/relative URLs
}) {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  const rows = useMemo(() => {
    const n = works.length;
    return works.map((w, idx) => ({
      idx,
      title: String(w?.title ?? "").trim() || `Работа #${idx + 1}`,
      blocks: getWorkBlocks(w),
      imageUrl: images[idx] ?? null
    }));
  }, [works, images]);

  const extraImages = useMemo(() => {
    if (images.length <= works.length) return [];
    return images.slice(works.length);
  }, [images, works.length]);

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  if (!rows.length && !images.length) return null;

  return (
    <div className="mt-10">
      <div className="text-xl font-semibold text-slate-900 sm:text-2xl text-center" style={{ color: "rgb(50 143 168 / var(--tw-bg-opacity, 1))" }}>Выполненные работы</div>
      <div className="mt-3 grid w-full grid-cols-1 items-start gap-2 sm:grid-cols-[1fr_1fr]">
        {rows.map((row) => {
          const open = openIndices.includes(row.idx);
          const hasContent = row.blocks.length > 0;
          return (
            <div
              key={row.idx}
              className="overflow-hidden rounded-2xl border-2 border-slate-300 bg-white flex flex-col shadow-sm transition-all duration-300 hover:border-brand-500 hover:shadow-md"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                aria-expanded={open}
                onClick={() => toggle(row.idx)}
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900">{row.title}</div>
                  {pickSummary(row.blocks) ? <div className="mt-1 line-clamp-1 text-sm font-medium text-slate-700">{pickSummary(row.blocks)}</div> : null}
                </div>
                <Chevron open={open} />
              </button>

              {open && hasContent ? (
                <div className="border-t-2 border-slate-200 px-4 py-4 flex-1 bg-slate-50/30">
                  <div className="text-sm text-slate-800">
                    {row.blocks.length ? (
                      <div className="space-y-4">
                        {row.blocks.map((b, bIdx) => (
                          <div key={bIdx} className="rounded-xl border border-slate-200 bg-white p-4">
                            {b.description && <p className="whitespace-pre-wrap leading-relaxed font-medium">{b.description}</p>}
                            {b.subDescriptions.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {b.subDescriptions.map((sub, sIdx) => (
                                  <div key={sIdx} className="flex gap-3 pl-2">
                                    <div className="w-1 shrink-0 rounded-full bg-brand-500/30" />
                                    <p className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                                      {sub}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Описание отсутствует.</span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      {extraImages.length ? (
        <div className="mt-8">
          <div className="text-lg font-bold text-slate-900 mb-4">Дополнительные изображения</div>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {extraImages.map((u) => (
              <div key={u} className="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white hover:border-brand-500 transition-colors">
                <div className="relative aspect-[4/3] w-full bg-slate-100">
                  <Image alt="" aria-hidden="true" src={u} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

