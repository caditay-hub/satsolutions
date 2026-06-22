"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type CategoryDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryDto[]>([]);
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<CategoryDto | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);
  const [deletingEdit, setDeletingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function reload() {
    const res = await apiFetch<{ categories: CategoryDto[] }>("/admin/categories");
    setItems(res.categories);
  }

  useEffect(() => {
    reload().catch(() => null);
  }, []);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch<{ category: CategoryDto }>("/admin/categories", {
        method: "POST",
        body: JSON.stringify({
          name,
          parentId: parentId || null,
          coverImageUrl: coverImageUrl || null
        })
      });
      setName("");
      setParentId("");
      setCoverImageUrl("");
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

  function categoryLabel(cat: CategoryDto) {
    const parts: string[] = [cat.name];
    let cur: CategoryDto | undefined = cat;
    const seen = new Set<string>();
    while (cur?.parentId) {
      if (seen.has(cur.parentId)) break;
      seen.add(cur.parentId);
      const parent = items.find((c) => c.id === cur!.parentId);
      if (!parent) break;
      parts.unshift(parent.name);
      cur = parent;
    }
    return parts.join(" / ");
  }

  function wouldCreateCycle(newParentId: string, selfId: string) {
    let cur = items.find((c) => c.id === newParentId);
    const seen = new Set<string>();
    while (cur?.parentId) {
      if (cur.parentId === selfId) return true;
      if (seen.has(cur.parentId)) return true;
      seen.add(cur.parentId);
      cur = items.find((c) => c.id === cur!.parentId);
    }
    return false;
  }

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file, { kind: "category" });
      setCoverImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  async function uploadFileForEdit(file: File) {
    if (!editing) return;
    setUploadingEdit(true);
    try {
      const url = await uploadImage(file, { kind: "category" });
      setEditing({ ...editing, coverImageUrl: url });
    } finally {
      setUploadingEdit(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setEditError(null);
    setSavingEdit(true);
    try {
      await apiFetch<{ category: CategoryDto }>(`/admin/categories/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editing.name,
          parentId: editing.parentId,
          coverImageUrl: editing.coverImageUrl
        })
      });
      setEditing(null);
      await reload();
    } catch (e: any) {
      setEditError(String(e?.message ?? "Ошибка"));
    } finally {
      setSavingEdit(false);
    }
  }

  async function deleteEdit() {
    if (!editing) return;
    setEditError(null);
    setDeletingEdit(true);
    try {
      await apiFetch(`/admin/categories/${editing.id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-semibold">Категории</h1>
            <p className="mt-1 text-sm text-slate-600">Список категорий.</p>
          </div>
          <form onSubmit={createCategory} className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-wrap gap-2">
              <select
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">(без родителя)</option>
                {items.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="URL изображения (необязательно)"
                className="w-80 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: IP‑камеры"
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={uploading}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) uploadFile(f).catch(() => null);
                  }}
                />
                {uploading ? "Загрузка..." : "Добавить image"}
              </label>
              <button
                disabled={loading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Добавить
              </button>
            </div>
          </form>
        </div>

        {editing ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
            <ConfirmDialog
              open={confirmDeleteOpen}
              title="Удалить категорию?"
              description="Это действие нельзя отменить."
              loading={deletingEdit}
              onClose={() => setConfirmDeleteOpen(false)}
              onConfirm={deleteEdit}
            />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Редактирование категории</div>
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
                  onClick={() => saveEdit().catch(() => null)}
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
                <div className="text-sm font-medium text-slate-700">Родитель</div>
                <select
                  value={editing.parentId ?? ""}
                  onChange={(e) => setEditing({ ...editing, parentId: e.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">(без родителя)</option>
                  {items
                    .filter((c) => c.id !== editing.id)
                    .map((c) => ({
                      c,
                      disabled: editing.parentId !== c.id && wouldCreateCycle(c.id, editing.id)
                    }))
                    .sort((a, b) => categoryLabel(a.c).localeCompare(categoryLabel(b.c)))
                    .map(({ c, disabled }) => (
                      <option key={c.id} value={c.id} disabled={disabled}>
                        {categoryLabel(c)}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block lg:col-span-2">
                <div className="text-sm font-medium text-slate-700">URL изображения</div>
                <input
                  value={editing.coverImageUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, coverImageUrl: e.target.value || null })}
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
                        if (f) uploadFileForEdit(f).catch(() => null);
                      }}
                    />
                    {uploadingEdit ? "Загрузка..." : "Загрузить новое фото"}
                  </label>
                  {resolveImageUrl(editing.coverImageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(editing.coverImageUrl)!}
                      alt={editing.name}
                      className="h-12 w-20 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-12 w-20 rounded-md bg-slate-100" />
                  )}
                </div>
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Фото</th>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Родитель</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {resolveImageUrl(c.coverImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveImageUrl(c.coverImageUrl)!} alt={c.name} className="h-10 w-16 rounded-md object-cover" />
                    ) : (
                      <div className="h-10 w-16 rounded-md bg-slate-100" />
                    )}
                  </td>
                  <td className="px-4 py-3">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{c.parentId ? items.find((x) => x.id === c.parentId)?.name ?? "—" : "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => setEditing(c)} className="text-sm font-semibold text-slate-900 hover:underline">
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={5}>
                    Категорий пока нет.
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

