"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch } from "@/lib/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";

type FeedbackDto = {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  message: string;
  status: "NEW" | "DONE";
  createdAt: string;
};

export default function FeedbackDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  const [item, setItem] = useState<FeedbackDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    apiFetch<{ item: FeedbackDto }>(`/admin/feedback/${id}`)
      .then((r) => setItem(r.item))
      .catch(() => setItem(null));
  }, [id]);

  async function setStatus(status: "NEW" | "DONE") {
    setSaving(true);
    try {
      const r = await apiFetch<{ item: FeedbackDto }>(`/admin/feedback/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      setItem(r.item);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    try {
      await apiFetch(`/admin/feedback/${id}`, { method: "DELETE" });
      setItem(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="mb-4">
          <Link href="/feedback" className="text-sm font-semibold text-slate-700 hover:underline">
            ← Назад
          </Link>
        </div>

        <ConfirmDialog
          open={confirmDelete}
          title="Удалить сообщение?"
          description="Это действие нельзя отменить."
          onClose={() => setConfirmDelete(false)}
          onConfirm={() => {
            setConfirmDelete(false);
            void remove();
          }}
        />

        {!item ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка…</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Сообщение</h1>
                <div className="mt-1 text-sm text-slate-600">{item.id}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {item.status === "DONE" ? (
                  <button
                    disabled={saving}
                    onClick={() => void setStatus("NEW")}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                  >
                    В NEW
                  </button>
                ) : (
                  <button
                    disabled={saving}
                    onClick={() => void setStatus("DONE")}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Отметить как DONE
                  </button>
                )}
                <button
                  disabled={saving}
                  onClick={() => setConfirmDelete(true)}
                  className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  Удалить
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Имя</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{item.name || "—"}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Телефон</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{item.phone || "—"}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Email</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{item.email || "—"}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-600">Сообщение</div>
              <div className="mt-2 whitespace-pre-wrap text-sm text-slate-900">{item.message}</div>
              <div className="mt-3 text-xs text-slate-500">Дата: {new Date(item.createdAt).toLocaleString()}</div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

