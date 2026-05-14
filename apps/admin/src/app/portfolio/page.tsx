"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type PortfolioCategoryDto, type PortfolioDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function PortfolioAdminPage() {
  const [items, setItems] = useState<PortfolioDto[]>([]);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState<PortfolioCategoryDto[]>([]);
  const [catName, setCatName] = useState("");
  const [catParentId, setCatParentId] = useState<string>("");
  const [catCoverImageUrl, setCatCoverImageUrl] = useState("");
  const [catLoading, setCatLoading] = useState(false);
  const [catUploading, setCatUploading] = useState(false);
  const [editingCat, setEditingCat] = useState<PortfolioCategoryDto | null>(null);
  const [catSavingEdit, setCatSavingEdit] = useState(false);
  const [catUploadingEdit, setCatUploadingEdit] = useState(false);
  const [catDeletingEdit, setCatDeletingEdit] = useState(false);
  const [catEditError, setCatEditError] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  function resolveImageUrl(url: string | null) {
    if (!url) return null;
    if (url.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      return `${base}${url}`;
    }
    return url;
  }

  function categoryLabel(cat: PortfolioCategoryDto) {
    const parts: string[] = [cat.name];
    let cur: PortfolioCategoryDto | undefined = cat;
    const seen = new Set<string>();
    while (cur?.parentId) {
      if (seen.has(cur.parentId)) break;
      seen.add(cur.parentId);
      const parent = categories.find((c) => c.id === cur!.parentId);
      if (!parent) break;
      parts.unshift(parent.name);
      cur = parent;
    }
    return parts.join(" / ");
  }

  function wouldCreateCycle(newParentId: string, selfId: string) {
    let cur = categories.find((c) => c.id === newParentId);
    const seen = new Set<string>();
    while (cur?.parentId) {
      if (cur.parentId === selfId) return true;
      if (seen.has(cur.parentId)) return true;
      seen.add(cur.parentId);
      cur = categories.find((c) => c.id === cur!.parentId);
    }
    return false;
  }

  async function reloadCategories() {
    const res = await apiFetch<{ categories: PortfolioCategoryDto[] }>("/admin/portfolio-categories");
    setCategories(res.categories ?? []);
  }

  async function createCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatLoading(true);
    try {
      await apiFetch<{ category: PortfolioCategoryDto }>("/admin/portfolio-categories", {
        method: "POST",
        body: JSON.stringify({
          name: catName,
          parentId: catParentId || null,
          coverImageUrl: catCoverImageUrl || null
        })
      });
      setCatName("");
      setCatParentId("");
      setCatCoverImageUrl("");
      await reloadCategories();
    } finally {
      setCatLoading(false);
    }
  }

  async function saveCatEdit() {
    if (!editingCat) return;
    setCatEditError(null);
    setCatSavingEdit(true);
    try {
      await apiFetch<{ category: PortfolioCategoryDto }>(`/admin/portfolio-categories/${editingCat.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: editingCat.name,
          parentId: editingCat.parentId,
          coverImageUrl: editingCat.coverImageUrl
        })
      });
      setEditingCat(null);
      await reloadCategories();
    } catch (e: any) {
      setCatEditError(String(e?.message ?? "Ошибка"));
    } finally {
      setCatSavingEdit(false);
    }
  }

  async function deleteCatEdit() {
    if (!editingCat) return;
    setCatEditError(null);
    setCatDeletingEdit(true);
    try {
      await apiFetch(`/admin/portfolio-categories/${editingCat.id}`, { method: "DELETE" });
      setEditingCat(null);
      await reloadCategories();
    } catch (e: any) {
      setCatEditError(String(e?.message ?? "Ошибка удаления"));
    } finally {
      setCatDeletingEdit(false);
    }
  }

  useEffect(() => {
    apiFetch<{ items: PortfolioDto[]; total: number }>("/admin/portfolio?limit=50&page=1")
      .then((r) => {
        setItems(r.items);
        setTotal(r.total);
      })
      .catch(() => null);

    reloadCategories().catch(() => null);
  }, []);

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Портфолио</h1>
            <p className="mt-1 text-sm text-slate-600">Всего: {total}</p>
          </div>
          <Link
            href="/portfolio/new"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Новый проект
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Категории портфолио</h2>
              <p className="mt-1 text-sm text-slate-600">Отдельные категории для раздела “Портфолио”.</p>
            </div>
            <form onSubmit={createCategory} className="flex flex-wrap gap-2">
              <select
                value={catParentId}
                onChange={(e) => setCatParentId(e.target.value)}
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="">(без родителя)</option>
                {categories
                  .slice()
                  .sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)))
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {categoryLabel(c)}
                    </option>
                  ))}
              </select>
              <input
                value={catCoverImageUrl}
                onChange={(e) => setCatCoverImageUrl(e.target.value)}
                placeholder="URL изображения (необязательно)"
                className="w-80 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="Например: Реализованные объекты"
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  disabled={catUploading}
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    setCatUploading(true);
                    uploadImage(f, { kind: "category" })
                      .then((url) => setCatCoverImageUrl(url))
                      .finally(() => setCatUploading(false));
                  }}
                />
                {catUploading ? "Загрузка..." : "Загрузить фото"}
              </label>
              <button
                disabled={catLoading}
                className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                Добавить
              </button>
            </form>
          </div>

          {editingCat ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
              <ConfirmDialog
                open={confirmDeleteOpen}
                title="Удалить категорию?"
                description="Это действие нельзя отменить."
                loading={catDeletingEdit}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={deleteCatEdit}
              />
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold">Редактирование категории</div>
                  <div className="mt-1 text-xs text-slate-600">{editingCat.id}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={catSavingEdit || catDeletingEdit}
                    onClick={() => setConfirmDeleteOpen(true)}
                    className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
                  >
                    {catDeletingEdit ? "Удаление..." : "Удалить"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCat(null);
                      setCatEditError(null);
                      setConfirmDeleteOpen(false);
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    disabled={catSavingEdit}
                    onClick={() => saveCatEdit().catch(() => null)}
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                  >
                    {catSavingEdit ? "Сохранение..." : "Сохранить"}
                  </button>
                </div>
              </div>

              {catEditError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{catEditError}</div>
              ) : null}

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Название</div>
                  <input
                    value={editingCat.name}
                    onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Родитель</div>
                  <select
                    value={editingCat.parentId ?? ""}
                    onChange={(e) => setEditingCat({ ...editingCat, parentId: e.target.value || null })}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  >
                    <option value="">(без родителя)</option>
                    {categories
                      .filter((c) => c.id !== editingCat.id)
                      .map((c) => ({
                        c,
                        disabled: editingCat.parentId !== c.id && wouldCreateCycle(c.id, editingCat.id)
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
                    value={editingCat.coverImageUrl ?? ""}
                    onChange={(e) => setEditingCat({ ...editingCat, coverImageUrl: e.target.value || null })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="https://... или /uploads/images/..."
                  />
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={catUploadingEdit}
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (!f) return;
                          setCatUploadingEdit(true);
                          uploadImage(f, { kind: "category" })
                            .then((url) => setEditingCat({ ...editingCat, coverImageUrl: url }))
                            .finally(() => setCatUploadingEdit(false));
                        }}
                      />
                      {catUploadingEdit ? "Загрузка..." : "Загрузить новое фото"}
                    </label>
                    {resolveImageUrl(editingCat.coverImageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveImageUrl(editingCat.coverImageUrl)!}
                        alt={editingCat.name}
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
                {categories.map((c) => (
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
                    <td className="px-4 py-3 text-slate-600">{c.parentId ? categories.find((x) => x.id === c.parentId)?.name ?? "—" : "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{c.slug}</td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" onClick={() => setEditingCat(c)} className="text-sm font-semibold text-slate-900 hover:underline">
                        Редактировать
                      </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 ? (
                  <tr>
                    <td className="px-4 py-6 text-slate-500" colSpan={5}>
                      Категорий портфолио пока нет.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Фото</th>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Slug</th>
                <th className="px-4 py-3 font-medium">Опубликовано</th>
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
                    <Link href={`/portfolio/${p.id}`} className="text-sm font-semibold text-slate-900 hover:underline">
                      Редактировать
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={5}>
                    Проектов пока нет.
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

