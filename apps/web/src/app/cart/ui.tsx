"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { clearCart, loadCart, removeFromCart, updateCartQuantity, type CartItem } from "@/lib/cart";
import { resolveImageUrl } from "@/lib/image";
import { formatPrice } from "@/lib/price";

type CreateOrderResponse = { order: { id: string; status: string; totalAmount: string; currency: string; createdAt: string } };

function apiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
}

function digitsOnly(v: string) {
  return v.replace(/\D+/g, "");
}

function formatUzRest(digits: string) {
  const d = digitsOnly(digits).slice(0, 9);
  const a = d.slice(0, 2);
  const b = d.slice(2, 5);
  const c = d.slice(5, 7);
  const e = d.slice(7, 9);
  return [a, b, c, e].filter(Boolean).join(" ");
}

export function CartClient() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [phoneRest, setPhoneRest] = useState(""); // 9 digits after +998
  const [submitting, setSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const total = useMemo(() => {
    let sum = 0;
    for (const it of items) sum += Number(it.price ?? 0) * it.quantity;
    return sum;
  }, [items]);

  async function submit() {
    setError(null);
    setSuccessId(null);
    if (!items.length) return setError("Корзина пустая.");
    const rest = digitsOnly(phoneRest).slice(0, 9);
    if (rest.length < 9) return setError("Введите номер телефона полностью.");
    const p = `+998${rest}`;

    setSubmitting(true);
    try {
      const res = await fetch(`${apiBaseUrl()}/orders`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phone: p,
          items: items.map((x) => ({ productId: x.productId, quantity: x.quantity }))
        })
      });
      const text = await res.text();
      if (!res.ok) {
        let msg = `Ошибка: ${res.status}`;
        try {
          const j = JSON.parse(text) as any;
          if (j?.error) msg = j.error;
        } catch {
          // ignore
        }
        throw new Error(msg);
      }
      const data = JSON.parse(text) as CreateOrderResponse;
      setSuccessId(data.order.id);
      clearCart();
      setItems([]);
      setPhoneRest("");
    } catch (e: any) {
      setError(e?.message ?? "Ошибка");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-900">Товары</div>
        <div className="divide-y divide-slate-200">
          {items.map((it) => {
            const img = resolveImageUrl(it.coverImageUrl);
            return (
              <div key={it.productId} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
                <div className="h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
                  {img ? (
                    <Image alt={it.name} src={img} width={280} height={200} className="h-full w-full object-contain" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/products/${it.slug}`} className="text-sm font-semibold text-slate-900 hover:underline">
                    {it.name}
                  </Link>
                  <div className="mt-1 text-sm text-slate-600">{formatPrice(it.price)} сум</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <input
                    type="number"
                    min={1}
                    value={it.quantity}
                    onChange={(e) => {
                      const q = Number(e.target.value || 1);
                      setItems(updateCartQuantity(it.productId, q));
                    }}
                    className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                    onClick={() => setItems(removeFromCart(it.productId))}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}
          {items.length === 0 ? <div className="p-5 text-sm text-slate-600">Корзина пустая.</div> : null}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-sm font-semibold text-slate-900">Оформление</div>
        <label className="mt-4 block">
          <div className="text-sm font-medium text-slate-700">Телефон</div>
          <div className="mt-1 flex overflow-hidden rounded-lg border border-slate-300">
            <div className="flex items-center bg-slate-50 px-3 text-sm font-semibold text-slate-700">+998</div>
            <input
              inputMode="tel"
              value={formatUzRest(phoneRest)}
              onChange={(e) => setPhoneRest(digitsOnly(e.target.value).slice(0, 9))}
              placeholder="90 123 45 67"
              className="w-full px-3 py-2 text-sm outline-none"
            />
          </div>
        </label>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-slate-600">Итого</div>
          <div className="font-semibold text-slate-900">{formatPrice(total)} сум</div>
        </div>
        {error ? <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div> : null}
        {successId ? (
          <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Ваш заказ принят. Оператор свяжется с вами.
            <div className="mt-1">
              Номер заказа: <span className="font-semibold">{successId}</span>
            </div>
          </div>
        ) : null}
        <button
          disabled={submitting || items.length === 0}
          onClick={submit}
          className="mt-4 w-full rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Отправка..." : "Отправить заказ"}
        </button>
        {items.length ? (
          <button
            type="button"
            className="mt-3 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
            onClick={() => {
              clearCart();
              setItems([]);
            }}
          >
            Очистить корзину
          </button>
        ) : null}
      </div>
    </div>
  );
}

