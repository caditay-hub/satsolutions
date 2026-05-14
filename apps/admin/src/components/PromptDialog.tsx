"use client";

import { useEffect, useState } from "react";

export function PromptDialog({
    open,
    title,
    description,
    placeholder = "Введите текст...",
    confirmText = "Сохранить",
    cancelText = "Отмена",
    loading = false,
    onConfirm,
    onClose
}: {
    open: boolean;
    title: string;
    description?: string | null;
    placeholder?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: (value: string) => void | Promise<void>;
    onClose: () => void;
}) {
    const [value, setValue] = useState("");

    useEffect(() => {
        if (open) setValue("");
    }, [open]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!value.trim() || loading) return;
        void onConfirm(value.trim());
    };

    return (
        <div className="fixed inset-0 z-[80]">
            <button
                type="button"
                className="absolute inset-0 bg-black/40"
                aria-label="Закрыть"
                onClick={onClose}
            />
            <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                <div className="text-lg font-semibold text-slate-900">{title}</div>
                {description ? <div className="mt-2 text-sm text-slate-600">{description}</div> : null}

                <form onSubmit={handleSubmit} className="mt-4">
                    <textarea
                        autoFocus
                        required
                        rows={3}
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <div className="mt-5 flex flex-wrap justify-end gap-2">
                        <button
                            type="button"
                            disabled={loading}
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50 disabled:opacity-60"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !value.trim()}
                            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {loading ? "Загрузка..." : confirmText}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
