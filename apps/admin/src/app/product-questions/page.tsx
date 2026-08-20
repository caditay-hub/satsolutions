"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch } from "@/lib/api";

type QStatus = "PENDING" | "APPROVED" | "HIDDEN";
type QuestionDto = {
  id: string;
  productId: string;
  name: string | null;
  phone: string | null;
  question: string;
  answer: string | null;
  status: QStatus;
  createdAt: string;
  meta?: { ip?: string } | null;
};

const TABS: { key: QStatus | "ALL"; label: string }[] = [
  { key: "PENDING", label: "Новые" },
  { key: "APPROVED", label: "Опубликованные" },
  { key: "HIDDEN", label: "Скрытые" },
  { key: "ALL", label: "Все" },
];

const STATUS_BADGE: Record<QStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  HIDDEN: "bg-slate-200 text-slate-600",
};
const STATUS_LABEL: Record<QStatus, string> = { PENDING: "Ждёт ответа", APPROVED: "Опубликован", HIDDEN: "Скрыт" };

export default function ProductQuestionsAdminPage() {
  const [items, setItems] = useState<QuestionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<QStatus | "ALL">("PENDING");
  const [busy, setBusy] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = tab === "ALL" ? "" : `&status=${tab}`;
      const r = await apiFetch<{ items: QuestionDto[] }>(`/admin/product-questions?limit=200${qs}`);
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

  // Ответить и сразу опубликовать (или просто сменить статус)
  const save = async (id: string, status?: QStatus) => {
    setBusy(id);
    try {
      const body: Record<string, unknown> = {};
      if (drafts[id] !== undefined) body.answer = drafts[id];
      if (status) body.status = status;
      await apiFetch(`/admin/product-questions/${id}`, { method: "PATCH", body: JSON.stringify(body) });
      await load();
    } catch {
      alert("Не удалось сохранить");
    } finally {
      setBusy(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить вопрос безвозвратно?")) return;
    setBusy(id);
    try {
      await apiFetch(`/admin/product-questions/${id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-semibold">Вопросы к товарам</h1>
            <p className="mt-1 text-sm text-slate-600">«Вопрос инженеру» с карточек товаров. На сайте показываются только опубликованные вопросы с ответом.</p>
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
          <p className="mt-8 text-slate-500">Вопросов нет.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {items.map((q) => (
              <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-semibold text-slate-900">{q.name || "Аноним"}</span>
                  {q.phone && <a href={`tel:${q.phone}`} className="text-sm font-semibold text-indigo-700 hover:underline">{q.phone}</a>}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${STATUS_BADGE[q.status]}`}>{STATUS_LABEL[q.status]}</span>
                  <a
                    href={`https://satsolutions.uz/products?focusId=${q.productId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-200"
                  >
                    товар ↗
                  </a>
                  <span className="ml-auto text-xs text-slate-400">{new Date(q.createdAt).toLocaleString("ru-RU")}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{q.question}</p>
                <textarea
                  defaultValue={q.answer ?? ""}
                  onChange={(e) => setDrafts((d) => ({ ...d, [q.id]: e.target.value }))}
                  placeholder="Ответ инженера — виден на сайте после публикации"
                  rows={3}
                  className="mt-3 w-full rounded-lg border border-slate-300 p-3 text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button disabled={busy === q.id} onClick={() => save(q.id, "APPROVED")} className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                    ✓ Ответить и опубликовать
                  </button>
                  <button disabled={busy === q.id} onClick={() => save(q.id)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
                    Сохранить черновик
                  </button>
                  {q.status !== "HIDDEN" && (
                    <button disabled={busy === q.id} onClick={() => save(q.id, "HIDDEN")} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
                      Скрыть
                    </button>
                  )}
                  <button disabled={busy === q.id} onClick={() => remove(q.id)} className="rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50">
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
