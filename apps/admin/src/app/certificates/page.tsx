"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type CertificateDto, type CertificateCategory } from "@/lib/api";
import { uploadImage } from "@/lib/upload";

const CATEGORY_LABELS: Record<CertificateCategory, string> = {
  certificate: "Сертификат",
  dealer: "Дилерское соглашение",
  award: "Награда"
};

export default function CertificatesPage() {
  const [items, setItems] = useState<CertificateDto[]>([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<CertificateCategory>("certificate");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [issuedBy, setIssuedBy] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [published, setPublished] = useState(true);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<CertificateDto | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingEdit, setUploadingEdit] = useState(false);

  async function reload() {
    const res = await apiFetch<{ certificates: CertificateDto[] }>("/admin/certificates");
    setItems(res.certificates ?? []);
  }

  useEffect(() => {
    reload().catch(() => null);
  }, []);

  function resolveImageUrl(url: string | null) {
    if (!url) return null;
    if (url.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
      return `${base}${url}`;
    }
    return url;
  }

  async function createCertificate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch<{ certificate: CertificateDto }>("/admin/certificates", {
        method: "POST",
        body: JSON.stringify({
          name,
          category,
          imageUrl: imageUrl || null,
          description: description || null,
          issuedBy: issuedBy || null,
          sortOrder: Number(sortOrder) || 0,
          published
        })
      });
      setName("");
      setCategory("certificate");
      setImageUrl("");
      setDescription("");
      setIssuedBy("");
      setSortOrder("0");
      setPublished(true);
      await reload();
    } finally {
      setLoading(false);
    }
  }

  async function deleteCertificate(id: string) {
    if (!confirm("Удалить?")) return;
    await apiFetch(`/admin/certificates/${id}`, { method: "DELETE" });
    await reload();
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Сертификаты</h1>
            <p className="mt-1 text-sm text-slate-600">Сертификаты, дилерские соглашения и награды.</p>
          </div>
          <form onSubmit={createCertificate} className="flex w-full flex-col gap-3">
            <div className="flex w-full flex-wrap gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Название"
                className="w-64 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                required
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CertificateCategory)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              >
                <option value="certificate">Сертификат</option>
                <option value="dealer">Дилерское соглашение</option>
                <option value="award">Награда</option>
              </select>
              <input
                value={issuedBy}
                onChange={(e) => setIssuedBy(e.target.value)}
                placeholder="Выдан кем (необязательно)"
                className="w-56 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL изображения (необязательно)"
                className="w-72 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <input
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="Sort"
                inputMode="numeric"
                className="w-24 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              />
              <label className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                Published
              </label>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Описание (необязательно)"
              rows={2}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            />
            <div className="flex flex-wrap items-center justify-end gap-2">
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
                      .then((url) => setImageUrl(url))
                      .finally(() => setUploading(false));
                  }}
                />
                {uploading ? "Загрузка..." : "Загрузить изображение"}
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
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Редактирование</div>
                <div className="mt-1 text-xs text-slate-600">{editing.id}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Отмена
                </button>
                <button
                  type="button"
                  disabled={savingEdit}
                  onClick={async () => {
                    setSavingEdit(true);
                    try {
                      await apiFetch<{ certificate: CertificateDto }>(`/admin/certificates/${editing.id}`, {
                        method: "PATCH",
                        body: JSON.stringify({
                          name: editing.name,
                          category: editing.category,
                          imageUrl: editing.imageUrl,
                          description: editing.description,
                          issuedBy: editing.issuedBy,
                          sortOrder: editing.sortOrder,
                          published: editing.published
                        })
                      });
                      setEditing(null);
                      await reload();
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
                <div className="text-sm font-medium text-slate-700">Категория</div>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value as CertificateCategory })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="certificate">Сертификат</option>
                  <option value="dealer">Дилерское соглашение</option>
                  <option value="award">Награда</option>
                </select>
              </label>
              <label className="block">
                <div className="text-sm font-medium text-slate-700">Выдан кем</div>
                <input
                  value={editing.issuedBy ?? ""}
                  onChange={(e) => setEditing({ ...editing, issuedBy: e.target.value || null })}
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
                <div className="text-sm font-medium text-slate-700">Описание</div>
                <textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value || null })}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </label>
              <label className="block lg:col-span-2">
                <div className="text-sm font-medium text-slate-700">URL изображения</div>
                <input
                  value={editing.imageUrl ?? ""}
                  onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value || null })}
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
                          .then((url) => setEditing({ ...editing, imageUrl: url }))
                          .finally(() => setUploadingEdit(false));
                      }}
                    />
                    {uploadingEdit ? "Загрузка..." : "Загрузить новое"}
                  </label>
                  {resolveImageUrl(editing.imageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={resolveImageUrl(editing.imageUrl)!}
                      alt={editing.name}
                      className="h-14 w-20 rounded-md border border-slate-200 bg-white object-contain"
                    />
                  ) : (
                    <div className="h-14 w-20 rounded-md border border-slate-200 bg-slate-50" />
                  )}
                </div>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.published} onChange={(e) => setEditing({ ...editing, published: e.target.checked })} />
                Published
              </label>
            </div>
          </div>
        ) : null}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Изображение</th>
                <th className="px-4 py-3 font-medium">Название</th>
                <th className="px-4 py-3 font-medium">Тип</th>
                <th className="px-4 py-3 font-medium">Выдан кем</th>
                <th className="px-4 py-3 font-medium">Sort</th>
                <th className="px-4 py-3 font-medium">Published</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    {resolveImageUrl(c.imageUrl) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={resolveImageUrl(c.imageUrl)!} alt={c.name} className="h-14 w-20 rounded-md border border-slate-200 bg-white object-contain" />
                    ) : (
                      <div className="h-14 w-20 rounded-md border border-slate-200 bg-slate-50" />
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-slate-600">{CATEGORY_LABELS[c.category]}</td>
                  <td className="px-4 py-3 text-slate-600">{c.issuedBy ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{c.sortOrder}</td>
                  <td className="px-4 py-3">{c.published ? "Да" : "Нет"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button type="button" onClick={() => setEditing(c)} className="text-sm font-semibold text-slate-900 hover:underline">
                        Редактировать
                      </button>
                      <button type="button" onClick={() => deleteCertificate(c.id)} className="text-sm font-semibold text-red-600 hover:underline">
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan={7}>
                    Сертификатов пока нет.
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
