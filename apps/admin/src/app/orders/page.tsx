"use client";



import Link from "next/link";

import { useEffect, useState } from "react";

import { AdminNav } from "@/components/AdminNav";

import { AuthGate } from "@/components/AuthGate";

import { apiFetch } from "@/lib/api";

import { formatPrice } from "@/lib/price";



type OrderDto = {

  id: string;

  phone: string;

  status: "NEW" | "PROCESSING" | "DONE" | "CANCELLED";

  totalAmount: string;

  currency: string;

  createdAt: string;

  statusReason?: string | null;

};



export default function OrdersPage() {

  const [items, setItems] = useState<OrderDto[]>([]);

  const [loading, setLoading] = useState(true);

  const [flash, setFlash] = useState<string | null>(null);

  const [firstId, setFirstId] = useState<string | null>(null);



  useEffect(() => {

    let stopped = false;



    const refresh = async (showSpinner: boolean) => {

      if (showSpinner) setLoading(true);

      try {

        const r = await apiFetch<{ items: OrderDto[] }>("/admin/orders?limit=100");

        const next = r.items ?? [];

        const nextFirst = next[0]?.id ?? null;



        if (!showSpinner && firstId && nextFirst && nextFirst !== firstId) {

          setFlash("Новый заказ получен");

          window.setTimeout(() => setFlash(null), 2000);

        }



        if (!stopped) {

          setItems(next);

          setFirstId(nextFirst);

        }

      } catch {

        if (!stopped) setItems([]);

      } finally {

        if (showSpinner && !stopped) setLoading(false);

      }

    };



    refresh(true);

    const id = window.setInterval(() => refresh(false), 3000);

    return () => {

      stopped = true;

      window.clearInterval(id);

    };

  }, []);



  return (

    <AuthGate>

      <AdminNav />

      <div className="container-page py-8">

        <div className="flex items-end justify-between gap-4">

          <div>

            <h1 className="text-2xl font-semibold">Заказы</h1>

            <p className="mt-1 text-sm text-slate-600">Заявки от клиентов (корзина + телефон).</p>

          </div>

          <button

            onClick={() => {

              setLoading(true);

              apiFetch<{ items: OrderDto[] }>("/admin/orders?limit=100")

                .then((r) => setItems(r.items ?? []))

                .catch(() => setItems([]))

                .finally(() => setLoading(false));

            }}

            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"

          >

            Обновить

          </button>

        </div>



        {flash ? (

          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">

            {flash}

          </div>

        ) : null}



        {loading ? (

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка…</div>

        ) : (

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-700">

                <tr>

                  <th className="px-4 py-3 font-medium">Статус</th>

                  <th className="px-4 py-3 font-medium">Телефон</th>

                  <th className="px-4 py-3 font-medium">Сумма</th>

                  <th className="px-4 py-3 font-medium">Дата</th>

                  <th className="px-4 py-3 font-medium"></th>

                </tr>

              </thead>

              <tbody>

                {items.map((o) => (

                  <tr key={o.id} className="border-t border-slate-100">

                    <td className="px-4 py-3">

                      {o.status === "NEW" ? (

                        <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">NEW</span>

                      ) : (

                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">

                          {o.status}

                        </span>

                      )}

                    </td>

                    <td className="px-4 py-3 font-medium text-slate-900">{o.phone}</td>

                    <td className="px-4 py-3 text-slate-700">

                      {formatPrice(o.totalAmount)} {o.currency === "UZS" ? "сум" : o.currency}

                    </td>

                    <td className="px-4 py-3 text-slate-600">{new Date(o.createdAt).toLocaleString()}</td>

                    <td className="px-4 py-3 text-right">

                      <Link href={`/orders/${o.id}`} className="text-sm font-semibold text-slate-900 hover:underline">

                        Открыть →

                      </Link>

                    </td>

                  </tr>

                ))}

                {items.length === 0 ? (

                  <tr>

                    <td className="px-4 py-6 text-sm text-slate-600" colSpan={5}>

                      Пока заказов нет.

                    </td>

                  </tr>

                ) : null}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </AuthGate>

  );

}



