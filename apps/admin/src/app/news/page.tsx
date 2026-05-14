"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type PostDto } from "@/lib/api";

function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
    return `${base}${url}`;
  }
  return url;
}

export default function NewsAdminPage() {
  const [items, setItems] = useState<PostDto[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    apiFetch<{ items: PostDto[]; total: number }>("/admin/news?limit=50&page=1")
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch(() => null);
  }, []);

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Новости</h1>
            <p className="mt-1 text-sm text-slate-600">Всего: {total}</p>
          </div>
          <Link
            href="/news/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Новая новость
          </Link>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Фото</th>
                <th className="px-4 py-3 font-medium">Заголовок</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Опубликована</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {resolveImageUrl(p.coverImageUrl) ? (
                      <img
                        alt={p.title}
                        src={resolveImageUrl(p.coverImageUrl)!}
                        className="h-12 w-12 rounded-lg border border-slate-200 bg-white object-contain"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg border border-slate-200 bg-slate-50" />
                    )}
                  </td>
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3 text-slate-600">{p.slug}</td>
                  <td className="px-4 py-3">{p.published ? "Да" : "Нет"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/news/${p.id}`} className="text-sm font-semibold text-slate-900 hover:underline">
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={5}>
                    Новостей пока нет.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}

