"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch } from "@/lib/api";

type ReviewStatus = "PENDING" | "APPROVED" | "HIDDEN";
type ReviewDto = {
  id: string;
  rating: number;
  authorName: string | null;
  text: string | null;
  status: ReviewStatus;
  serviceKey: string | null;
  productId: string | null;
  createdAt: string;
  meta?: { ip?: string } | null;
};

const TABS: { key: ReviewStatus | "ALL"; label: string }[] = [
  { key: "PENDING", label: "Новые" },
  { key: "APPROVED", label: "Одобренные" },
  { key: "HIDDEN", label: "Скрытые" },
  { key: "ALL", label: "Все" },
];

const STATUS_BADGE: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  HIDDEN: "bg-slate-200 text-slate-600",
};
const STATUS_LABEL: Record<ReviewStatus, string> = { PENDING: "На модерации", APPROVED: "Одобрен", HIDDEN: "Скрыт" };

function Stars({ n }: { n: number }) {
  return <span className="text-amber-500">{"★".repeat(n)}<span className="text-slate-300">{"★".repeat(5 - n)}</span></span>;
}

export default function ReviewsAdminPage() {
  const [items, setItems] = useState<ReviewDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ReviewStatus | "ALL">("PENDING");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = tab === "ALL" ? "" : `&status=${tab}`;
      const r = await apiFetch<{ items: ReviewDto[] }>(`/admin/reviews?limit=200${qs}`);
      setItems(r.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    void load();
  }, [load]);

  const setStatus = async (id: string, status: ReviewStatus) => {
    setBusy(id);
    try {
      await apiFetch(`/admin/reviews/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      await load();
    } catch {
      alert("Не удалось изменить статус");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить отзыв безвозвратно?")) return;
    setBusy(id);
    try {
      await apiFetch(`/admin/reviews/${id}`, { method: "DELETE" });
      await load();
    } catch {
      alert("Не удалось удалить");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Отзывы</h1>
            <p className="mt-1 text-sm text-slate-600">Отзывы с сайта. Одобрённые показываются на /reviews.</p>
          </div>
          <button onClick={() => void load()} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
            Обновить
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${tab === t.key ? "bg-slate-900 text-white" : "border border-slate-300 bg-white hover:bg-slate-50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-slate-500">Загрузка…</p>
        ) : items.length === 0 ? (
          <p className="mt-8 text-slate-500">Отзывов нет.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {items.map((r) => (
              <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Stars n={r.rating} />
                  <span className="font-semibold text-slate-900">{r.authorName || "Аноним"}</span>
                  {r.serviceKey && <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">услуга: {r.serviceKey}</span>}
                  {r.productId && <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700">товар</span>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_BADGE[r.status]}`}>{STATUS_LABEL[r.status]}</span>
                  <span className="ml-auto text-xs text-slate-400">{new Date(r.createdAt).toLocaleString("ru-RU")}</span>
                </div>
                {r.text && <p className="mt-2 text-sm leading-relaxed text-slate-700">{r.text}</p>}
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.status !== "APPROVED" && (
                    <button disabled={busy === r.id} onClick={() => setStatus(r.id, "APPROVED")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                      ✓ Одобрить
                    </button>
                  )}
                  {r.status !== "HIDDEN" && (
                    <button disabled={busy === r.id} onClick={() => setStatus(r.id, "HIDDEN")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
                      Скрыть
                    </button>
                  )}
                  <button disabled={busy === r.id} onClick={() => remove(r.id)} className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AuthGate>
  );
}
