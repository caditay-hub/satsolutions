"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch } from "@/lib/api";
import { formatPrice } from "@/lib/price";

type OrderItemDto = {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productCoverImageUrl: string | null;
  unitPrice: string;
  quantity: number;
  lineTotal: string;
};

type OrderDto = {
  id: string;
  phone: string;
  status: "NEW" | "PROCESSING" | "DONE" | "CANCELLED";
  statusReason?: string | null;
  totalAmount: string;
  currency: string;
  createdAt: string;
  items?: OrderItemDto[];
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [order, setOrder] = useState<OrderDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [reasonModal, setReasonModal] = useState<null | { status: "DONE" | "CANCELLED" }>(null);
  const [reasonText, setReasonText] = useState("");

  useEffect(() => {
    apiFetch<{ order: OrderDto }>(`/admin/orders/${id}`)
      .then((r) => setOrder(r.order))
      .catch(() => setOrder(null));
  }, [id]);

  async function setStatus(status: OrderDto["status"], reason?: string) {
    setSaving(true);
    try {
      const r = await apiFetch<{ order: OrderDto }>(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status, reason })
      });
      setOrder(r.order);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="mb-4">
          <Link href="/orders" className="text-sm font-semibold text-slate-700 hover:underline">
            ← Назад
          </Link>
        </div>

        {!order ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка…</div>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold">Заказ</h1>
                <div className="mt-1 text-sm text-slate-600">{order.id}</div>
              </div>
              {order.status === "DONE" || order.status === "CANCELLED" ? null : (
                <div className="flex flex-wrap gap-2">
                  <button
                    disabled={saving}
                    onClick={() => setStatus("PROCESSING")}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                  >
                    В обработку
                  </button>
                  <button
                    disabled={saving}
                    onClick={() => {
                      setReasonText("");
                      setReasonModal({ status: "DONE" });
                    }}
                    className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    Готово
                  </button>
                  <button
                    disabled={saving}
                    onClick={() => {
                      setReasonText("");
                      setReasonModal({ status: "CANCELLED" });
                    }}
                    className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    Отменить
                  </button>
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Телефон</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{order.phone}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Статус</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">{order.status}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Сумма</div>
                <div className="mt-2 text-lg font-semibold text-slate-900">
                  {formatPrice(order.totalAmount)} {order.currency === "UZS" ? "сум" : order.currency}
                </div>
              </div>
            </div>

            {order.statusReason ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <div className="text-sm font-medium text-slate-600">Причина/Комментарий</div>
                <div className="mt-2 text-sm text-slate-900 whitespace-pre-wrap">{order.statusReason}</div>
              </div>
            ) : null}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                Товары
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-white text-slate-600">
                  <tr className="border-b border-slate-100">
                    <th className="px-4 py-3 font-medium">Товар</th>
                    <th className="px-4 py-3 font-medium">Кол-во</th>
                    <th className="px-4 py-3 font-medium">Цена</th>
                    <th className="px-4 py-3 font-medium">Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items ?? []).map((it) => (
                    <tr key={it.id} className="border-t border-slate-100">
                      <td className="px-4 py-3 font-medium text-slate-900">{it.productName}</td>
                      <td className="px-4 py-3 text-slate-700">{it.quantity}</td>
                      <td className="px-4 py-3 text-slate-700">{formatPrice(it.unitPrice)}</td>
                      <td className="px-4 py-3 text-slate-700">{formatPrice(it.lineTotal)}</td>
                    </tr>
                  ))}
                  {(order.items ?? []).length === 0 ? (
                    <tr>
                      <td className="px-4 py-6 text-sm text-slate-600" colSpan={4}>
                        Нет строк.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <button
              onClick={() => router.refresh()}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
            >
              Обновить
            </button>
          </div>
        )}

        {reasonModal ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
              <div className="text-lg font-semibold">
                {reasonModal.status === "DONE" ? "Комментарий (обязательно)" : "Причина отмены (обязательно)"}
              </div>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                rows={4}
                placeholder={reasonModal.status === "DONE" ? "Например: связались с клиентом, заказ выполнен" : "Например: клиент отменил / нет в наличии"}
              />
              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  disabled={saving}
                  onClick={() => setReasonModal(null)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60"
                >
                  Отмена
                </button>
                <button
                  disabled={saving || reasonText.trim().length < 2}
                  onClick={async () => {
                    const r = reasonText.trim();
                    if (r.length < 2) return;
                    const status = reasonModal.status;
                    setReasonModal(null);
                    await setStatus(status, r);
                  }}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </AuthGate>
  );
}

