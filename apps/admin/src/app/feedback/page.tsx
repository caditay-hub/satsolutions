"use client";



import Link from "next/link";

import { useEffect, useMemo, useState } from "react";

import { AdminNav } from "@/components/AdminNav";

import { AuthGate } from "@/components/AuthGate";

import { apiFetch } from "@/lib/api";



type FeedbackDto = {

  id: string;

  name: string | null;

  phone: string | null;

  email: string | null;

  message: string;

  status: "NEW" | "DONE";

  createdAt: string;

};



function clip(s: string, n = 110) {

  const t = (s ?? "").toString().trim();

  if (t.length <= n) return t;

  return `${t.slice(0, n - 1)}…`;

}



export default function FeedbackPage() {

  const [items, setItems] = useState<FeedbackDto[]>([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<"" | "NEW" | "DONE">("NEW");

  const [q, setQ] = useState("");



  const query = useMemo(() => {

    const qs = new URLSearchParams({ limit: "100" });

    if (status) qs.set("status", status);

    if (q.trim()) qs.set("q", q.trim());

    return qs.toString();

  }, [status, q]);



  async function load(showSpinner: boolean) {

    if (showSpinner) setLoading(true);

    try {

      const r = await apiFetch<{ items: FeedbackDto[] }>(`/admin/feedback?${query}`);

      setItems(r.items ?? []);

    } catch {

      setItems([]);

    } finally {

      if (showSpinner) setLoading(false);

    }

  }



  useEffect(() => {

    void load(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [query]);



  useEffect(() => {

    let stopped = false;

    const id = window.setInterval(() => {

      if (stopped) return;

      void load(false);

    }, 4000);

    return () => {

      stopped = true;

      window.clearInterval(id);

    };

    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, [query]);



  return (

    <AuthGate>

      <AdminNav />

      <div className="container-page py-8">

        <div className="flex flex-wrap items-end justify-between gap-4">

          <div>

            <h1 className="text-2xl font-semibold">Обратная связь</h1>

            <p className="mt-1 text-sm text-slate-600">Сообщения, отправленные с сайта.</p>

          </div>

          <button

            onClick={() => void load(true)}

            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"

          >

            Обновить

          </button>

        </div>



        <div className="mt-4 flex flex-wrap items-center gap-3">

          <label className="text-sm font-medium text-slate-700">

            Статус

            <select

              value={status}

              onChange={(e) => setStatus((e.target.value as any) ?? "")}

              className="ml-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"

            >

              <option value="">Все</option>

              <option value="NEW">NEW</option>

              <option value="DONE">DONE</option>

            </select>

          </label>

          <label className="text-sm font-medium text-slate-700">

            Поиск

            <input

              value={q}

              onChange={(e) => setQ(e.target.value)}

              className="ml-2 w-64 rounded-lg border border-slate-300 px-3 py-2 text-sm"

              placeholder="имя / телефон / email / текст..."

            />

          </label>

        </div>



        {loading ? (

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка…</div>

        ) : (

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">

            <table className="w-full text-left text-sm">

              <thead className="bg-slate-50 text-slate-700">

                <tr>

                  <th className="px-4 py-3 font-medium">Статус</th>

                  <th className="px-4 py-3 font-medium">Контакт</th>

                  <th className="px-4 py-3 font-medium">Сообщение</th>

                  <th className="px-4 py-3 font-medium">Дата</th>

                  <th className="px-4 py-3 font-medium"></th>

                </tr>

              </thead>

              <tbody>

                {items.map((m) => (

                  <tr key={m.id} className="border-t border-slate-100">

                    <td className="px-4 py-3">

                      {m.status === "NEW" ? (

                        <span className="inline-flex rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-700">NEW</span>

                      ) : (

                        <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">DONE</span>

                      )}

                    </td>

                    <td className="px-4 py-3 text-slate-700">

                      <div className="font-medium text-slate-900">{m.name || "—"}</div>

                      <div className="text-xs text-slate-600">{m.phone || m.email || "—"}</div>

                    </td>

                    <td className="px-4 py-3 text-slate-700">{clip(m.message)}</td>

                    <td className="px-4 py-3 text-slate-600">{new Date(m.createdAt).toLocaleString()}</td>

                    <td className="px-4 py-3 text-right">

                      <Link href={`/feedback/${m.id}`} className="text-sm font-semibold text-slate-900 hover:underline">

                        Открыть →

                      </Link>

                    </td>

                  </tr>

                ))}

                {items.length === 0 ? (

                  <tr>

                    <td className="px-4 py-6 text-sm text-slate-600" colSpan={5}>

                      Сообщений пока нет.

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



