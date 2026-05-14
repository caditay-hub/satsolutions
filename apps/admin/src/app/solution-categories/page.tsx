"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type ServiceCategoryDto } from "@/lib/api";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { uploadImage } from "@/lib/upload";

export default function SolutionCategoriesPage() {
  const [items, setItems] = useState<ServiceCategoryDto[]>([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [desc1, setDesc1] = useState("");
  const [desc2, setDesc2] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<ServiceCategoryDto | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingEdit, setDeletingEdit] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  async function reload() {
    const res = await apiFetch<{ items: ServiceCategoryDto[] }>("/admin/service-categories");
    setItems(res.items);
  }

  useEffect(() => {
    reload().catch(() => null);
  }, []);

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch<{ item: ServiceCategoryDto }>("/admin/service-categories", {
        method: "POST",
        body: JSON.stringify({
          name,
          title: title || null,
          description1: desc1 || null,
          description2: desc2 || null,
          imageUrl: imageUrl || null
        })
      });
      setName("");
      setTitle("");
      setDesc1("");
      setDesc2("");
      setImageUrl("");
      await reload();
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, target: 'new' | 'edit') {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      if (target === 'new') setImageUrl(url);
      else if (editing) setEditing({ ...editing, imageUrl: url });
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setEditError(null);
    setSavingEdit(true);
    try {
      await apiFetch<{ item: ServiceCategoryDto }>(`/admin/service-categories/${editing.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editing.name,
          title: editing.title,
          description1: editing.description1,
          description2: editing.description2,
          imageUrl: editing.imageUrl,
          sortOrder: editing.sortOrder
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
      await apiFetch(`/admin/service-categories/${editing.id}`, { method: "DELETE" });
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
            <h1 className="text-2xl font-semibold">Категории решений</h1>
            <p className="mt-1 text-sm text-slate-600">Настройка категорий для решений (Serivces).</p>
          </div>
        </div>

        <form onSubmit={createCategory} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm font-main">
          <h2 className="text-lg font-bold mb-4">Добавить категорию</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Название (для админки)</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Транспорт"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Заголовок (для сайта)</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Решения для транспорта"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Описание 1</span>
              <textarea
                value={desc1}
                onChange={(e) => setDesc1(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Описание 2</span>
              <textarea
                value={desc2}
                onChange={(e) => setDesc2(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Изображение</span>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/uploads/..."
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <label className="cursor-pointer rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold hover:bg-slate-200">
                  {uploading ? "..." : "Загрузить"}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'new')} />
                </label>
              </div>
            </label>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              disabled={loading}
              className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              Добавить категорию
            </button>
          </div>
        </form>

        {editing ? (
          <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50/30 p-6 shadow-md transition-all">
            <ConfirmDialog
              open={confirmDeleteOpen}
              title="Удалить категорию?"
              description="Это действие нельзя отменить. Убедитесь, что нет привязанных решений."
              loading={deletingEdit}
              onClose={() => setConfirmDeleteOpen(false)}
              onConfirm={deleteEdit}
            />
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">Редактирование: {editing.name}</h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={savingEdit || deletingEdit}
                  onClick={() => setConfirmDeleteOpen(true)}
                  className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Удалить
                </button>
                <button
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  disabled={savingEdit}
                  onClick={() => saveEdit().catch(() => null)}
                  className="rounded-lg bg-[#00aeb7] px-6 py-2 text-sm font-semibold text-white hover:bg-[#00969d]"
                >
                  {savingEdit ? "Сохранение..." : "Сохранить"}
                </button>
              </div>
            </div>

            {editError && (
              <div className="mb-4 rounded-lg bg-red-100 p-4 text-sm text-red-800">
                {editError}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Название</span>
                <input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Slug</span>
                <input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-slate-50"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Заголовок (Title)</span>
                <input
                  value={editing.title || ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Порядок сортировки</span>
                <input
                  type="number"
                  value={editing.sortOrder}
                  onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Описание 1</span>
                <textarea
                  value={editing.description1 || ""}
                  onChange={(e) => setEditing({ ...editing, description1: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Описание 2</span>
                <textarea
                  value={editing.description2 || ""}
                  onChange={(e) => setEditing({ ...editing, description2: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Изображение</span>
                <div className="mt-1 flex gap-2">
                  <input
                    type="text"
                    value={editing.imageUrl || ""}
                    onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                    placeholder="/uploads/..."
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold border border-slate-300 hover:bg-slate-50">
                    {uploading ? "..." : "Загрузить"}
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'edit')} />
                  </label>
                </div>
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm font-main">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b">
              <tr>
                <th className="px-6 py-4 font-bold">Название</th>
                <th className="px-6 py-4 font-bold">Slug</th>
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Порядок</th>
                <th className="px-6 py-4 font-bold" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((it) => (
                <tr key={it.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{it.name}</td>
                  <td className="px-6 py-4 text-slate-500">{it.slug}</td>
                  <td className="px-6 py-4 text-slate-600">{it.title || "—"}</td>
                  <td className="px-6 py-4">{it.sortOrder}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {
                        setEditing(it);
                        window.scrollTo({ top: 300, behavior: "smooth" });
                      }}
                      className="text-indigo-600 font-bold hover:text-indigo-800"
                    >
                      Редактировать
                    </button>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    Категорий пока нет.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
