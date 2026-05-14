"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type BrandDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function BrandsPage() {
  const [items, setItems] = useState<BrandDto[]>([]);
  const [name, setName] = useState("");
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<BrandDto | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [deletingEdit, setDeletingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function reload() {
    const res = await apiFetch<{ brands: BrandDto[] }>("/admin/brands");
    setItems(res.brands ?? []);
  }

  useEffect(() => {
    reload().catch(() => null);
  }, []);

  async function createBrand(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch<{ brand: BrandDto }>("/admin/brands", {
        method: "POST",
        body: JSON.stringify({
          name,
          logoImageUrl: logoImageUrl || null,
          sortOrder: Number(sortOrder) || 0,
          published
        })
      });
      setName("");
      setLogoImageUrl("");
      setSortOrder("0");
      setPublished(true);
      await reload();
    } finally {
      setLoading(false);
    }
  }

  function resolveImageUrl(url: string | null) {
    if (!url) return null;
    if (url.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      return `${base}${url}`;
    }
    return url;
  }

  async function deleteEdit() {
    if (!editing) return;
    setEditError(null);
    setDeletingEdit(true);
    try {
      await apiFetch(`/admin/brands/${editing.id}`, { method: "DELETE" });
      setEditing(null);
      await reload();
    } catch (e: any) {
      setEditError(String(e?.message ?? "Ошибка удаления"));
    } finally {
      setDeletingEdit(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Бренды</h1>
            <p className="mt-1 text-sm text-slate-600">Бренды для фильтра продуктов.</p>
          </div>
          <form onSubmit={createBrand} className="flex flex-wrap gap-2">
            <input
              value={logoImageUrl}
              onChange={(e) => setLogoImageUrl(e.target.value)}
              placeholder="URL логотипа (необязательно)"
              className="w-80 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              placeholder="Sort"
              inputMode="numeric"
              className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Hikvision"
              className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              required
            />
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                disabled={uploading}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploading(true);
                  uploadImage(f)
                    .then((url) => setLogoImageUrl(url))
                    .finally(() => setUploading(false));
                }}
              />
              {uploading ? "Загрузка..." : "Загрузить лого"}
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
              <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
              Published
            </label>
            <button
              disabled={loading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Добавить
            </button>
          </form>
        </div>

        {editing ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <ConfirmDialog
              open={confirmDeleteOpen}
              title="Удалить бренд?"
              description="Это действие нельзя отменить."
              loading={deletingEdit}
              onClose={() => setConfirmDeleteOpen(false)}
              onConfirm={deleteEdit}
            />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Редактирование бренда</div>
                <div className="mt-1 text-xs text-slate-600">{editing.id}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={savingEdit || deletingEdit}
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                >
                  {deletingEdit ? "Удаление..." : "Удалить"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setEditError(null);
                    setConfirmDeleteOpen(false);
                  }}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={async () => {
                    setEditError(null);
                    setSavingEdit(true);
                    try {
                      await apiFetch<{ brand: BrandDto }>(`/admin/brands/${editing.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          name: editing.name,
                          logoImageUrl: editing.logoImageUrl,
                          sortOrder: editing.sortOrder,
                          published: editing.published
                        })
                      });
                      setEditing(null);
                      await reload();
                    } catch (e: any) {
                      setEditError(String(e?.message ?? "Ошибка"));
                    } finally {
                      setSavingEdit(false);
                    }
                  }}
                  className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                >
                  {savingEdit ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>

            {editError ? (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{editError}</div>
            ) : null}

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <label className="block">
                <div className="text-sm font-medium text-slate-700">Название</div>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <div className="text-sm font-medium text-slate-700">Sort order</div>
                <input
                  value={String(editing.sortOrder ?? 0)}
                  onChange={(e) => setEditing({ ...editing, sortOrder: Number(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  inputMode="numeric"
                />
              </label>
              <label className="block lg:col-span-2">
                <div className="text-sm font-medium text-slate-700">URL логотипа</div>
                <input
                  value={editing.logoImageUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, logoImageUrl: e.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="https://... или /uploads/images/..."
                />
                <div className="mt-2 flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploadingEdit}
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploadingEdit(true);
                        uploadImage(f)
                          .then((url) => setEditing({ ...editing, logoImageUrl: url }))
                          .finally(() => setUploadingEdit(false));
                      }}
                    />
                    {uploadingEdit ? "Загрузка..." : "Загрузить новое лого"}
                  </label>
                  {resolveImageUrl(editing.logoImageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(editing.logoImageUrl)!}
                      alt={editing.name}
                      className="h-10 w-16 rounded-md border border-slate-200 bg-white object-contain"
                    />
                  ) : (
                    <div className="h-10 w-16 rounded-md border border-slate-200 bg-slate-50" />
                  )}
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.published}
                  onChange={(e) => setEditing({ ...editing, published: e.target.checked })}
                />
                Published
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Лого</th>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {resolveImageUrl(b.logoImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveImageUrl(b.logoImageUrl)!} alt={b.name} className="h-10 w-16 rounded-md border border-slate-200 bg-white object-contain" />
                    ) : (
                      <div className="h-10 w-16 rounded-md border border-slate-200 bg-slate-50" />
                    )}
                  </td>
                  <td className="px-4 py-3">{b.name}</td>
                  <td className="px-4 py-3 text-slate-600">{b.slug}</td>
                  <td className="px-4 py-3 text-slate-600">{b.sortOrder}</td>
                  <td className="px-4 py-3">{b.published ? "Да" : "Нет"}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setEditing(b)} className="text-sm font-semibold text-slate-900 hover:underline">
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={6}>
                    Брендов пока нет.
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

