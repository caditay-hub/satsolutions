"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type ServiceDto } from "@/lib/api";

export default function ServicesAdminPage() {
  const [items, setItems] = useState<ServiceDto[]>([]);
  const [total, setTotal] = useState(0);

  function resolveImageUrl(url: string | null) {
    if (!url) return null;
    if (url.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      return `${base}${url}`;
    }
    return url;
  }

  useEffect(() => {
    apiFetch<{ items: ServiceDto[]; total: number }>("/admin/services?limit=50&page=1")
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch(() => null);
  }, []);

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Решения</h1>
            <p className="text-xs text-slate-600">Всего: {total}</p>
          </div>
          <Link href="/services/new" className="rounded bg-slate-900 px-3 py-1.5 text-sm font-semibold text-white hover:bg-slate-800">
            Новое решение
          </Link>
        </div>
        <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-2 py-1.5 font-medium">Фото</th>
                <th className="px-2 py-1.5 font-medium">Заголовок</th>
                <th className="px-2 py-1.5 font-medium">Slug</th>
                <th className="px-2 py-1.5 font-medium">Опубликовано</th>
                <th className="px-2 py-1.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-2 py-1.5">
                    {resolveImageUrl(p.coverImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img alt={p.title} src={resolveImageUrl(p.coverImageUrl)!} className="h-10 w-10 rounded border border-slate-200 object-contain" />
                    ) : (
                      <div className="h-10 w-10 rounded border border-slate-200 bg-slate-50" />
                    )}
                  </td>
                  <td className="px-2 py-1.5">{p.title}</td>
                  <td className="px-2 py-1.5 text-slate-600">{p.slug}</td>
                  <td className="px-2 py-1.5">{p.published ? "Да" : "Нет"}</td>
                  <td className="px-2 py-1.5 text-right">
                    <Link href={`/services/${p.id}`} className="text-xs font-semibold text-slate-900 hover:underline">Редактировать</Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-2 py-4 text-slate-500" colSpan={5}>Решений пока нет.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}

