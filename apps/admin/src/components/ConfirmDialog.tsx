"use client";

import { useEffect } from "react";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Удалить",
  cancelText = "Отмена",
  danger = true,
  loading = false,
  onConfirm,
  onClose
}: {
  open: boolean;
  title: string;
  description?: string | null;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void | Promise<void>;
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
      <div className="absolute left-1/2 top-1/2 w-[92%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="text-lg font-semibold text-slate-900">{title}</div>
        {description ? <div className="mt-2 text-sm text-slate-600">{description}</div> : null}

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
            type="button"
            disabled={loading}
            onClick={() => void onConfirm()}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 ${
              danger ? "bg-red-600 hover:bg-red-700" : "bg-slate-900 hover:bg-slate-800"
            }`}
          >
            {loading ? "Удаление..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

