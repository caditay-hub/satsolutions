"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type ProductDto } from "@/lib/api";

type SitePageDto = {
  id: string;
  key: string;
  title: string;
  data: any | null;
};

function parseNumberLike(v: string): number | null {
  const raw = String(v ?? "").trim();
  if (!raw) return null;
  const normalized = raw
    .replace(/[\u00A0\u202F]/g, " ")
    .replace(/\s+/g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

export default function ProductsPage() {
  const [items, setItems] = useState<ProductDto[]>([]);
  const [total, setTotal] = useState(0);
  const [rate, setRate] = useState<string>("");
  const [rateSaving, setRateSaving] = useState(false);
  const [rateMsg, setRateMsg] = useState<string | null>(null);

  function resolveImageUrl(url: string | null) {
    if (!url) return null;
    if (url.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      return `${base}${url}`;
    }
    return url;
  }

  useEffect(() => {
    apiFetch<{ items: ProductDto[]; total: number }>("/admin/products?limit=50&page=1")
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch(() => null);

    // Load exchange rate from DB (site_pages key=site)
    apiFetch<{ page: SitePageDto }>(`/admin/site-pages/site`)
      .then((r) => {
        const v = r.page?.data?.usdToUzs;
        if (typeof v === "number") setRate(String(v));
        else if (typeof v === "string") setRate(v);
      })
      .catch(() => {
        // page may not exist yet
      });
  }, []);

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Продукты</h1>
            <p className="mt-1 text-sm text-slate-600">Всего: {total}</p>
          </div>
          <Link
            href="/products/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Новый продукт
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">Exchange rate</div>
              <div className="mt-1 text-sm text-slate-600">Курс USD → UZS (сохраняется в базе данных).</div>
            </div>
            <div className="flex flex-wrap items-end gap-2">
              <label className="block">
                <div className="text-xs font-medium text-slate-600">USD → UZS</div>
                <input
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="mt-1 w-44 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  inputMode="decimal"
                  placeholder="например: 12600"
                />
              </label>
              <button
                disabled={rateSaving}
                onClick={async () => {
                  setRateMsg(null);
                  const n = parseNumberLike(rate);
                  if (!n || n <= 0) return setRateMsg("Введите корректный курс (число > 0).");
                  setRateSaving(true);
                  try {
                    await apiFetch<{ page: SitePageDto }>(`/admin/site-pages/site`, {
                      method: "PUT",
                      body: JSON.stringify({
                        title: "Настройки магазина",
                        data: { usdToUzs: n }
                      })
                    });
                    setRate(String(n));
                    setRateMsg("Сохранено.");
                  } catch (e: any) {
                    setRateMsg(e?.message ?? "Ошибка сохранения.");
                  } finally {
                    setRateSaving(false);
                  }
                }}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {rateSaving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
          {rateMsg ? <div className="mt-3 text-sm text-slate-700">{rateMsg}</div> : null}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Фото</th>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Рекоменд.</th>
                <th className="px-4 py-3 font-medium">Опубликован</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {resolveImageUrl(p.coverImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveImageUrl(p.coverImageUrl)!}
                        alt={p.name}
                        className="h-10 w-16 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-16 rounded-md bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.slug}</td>
                  <td className="px-4 py-3">
                    {p.recommended ? (
                      <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                        Да
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                        Нет
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{p.published ? "Да" : "Нет"}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/products/${p.id}`} className="text-sm font-semibold text-slate-900 hover:underline">
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={6}>
                    Продуктов пока нет.
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

