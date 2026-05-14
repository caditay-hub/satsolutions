"use client";

import { useEffect } from "react";

export function DetailsDialog({
    open,
    title,
    data,
    onClose
}: {
    open: boolean;
    title: string;
    data: { label: string; value: string | null | undefined; isLong?: boolean }[];
    onClose: () => void;
}) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [open]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[80]">
            <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Закрыть"
                onClick={onClose}
            />
            <div className="absolute left-1/2 top-1/2 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="text-xl font-semibold text-slate-900">{title}</div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="mt-6 max-h-[60vh] overflow-y-auto pr-2">
                    <div className="grid gap-6">
                        {data.map((item, i) => (
                            <div key={i} className={`${item.isLong ? "col-span-full" : ""}`}>
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    {item.label}
                                </div>
                                <div className={`mt-1.5 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-900 ${item.isLong ? "whitespace-pre-wrap leading-relaxed" : ""}`}>
                                    {item.value || (
                                        <span className="italic text-slate-400">Нет данных</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    );
}
