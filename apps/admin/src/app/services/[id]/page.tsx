"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type ServiceDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function EditServicePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [item, setItem] = useState<ServiceDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  type DescBlock = { description: string; subDescription: string };
  type Card = { descriptions: DescBlock[] };
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  type KeyTech = {
    id?: string;
    title: string;
    description: string;
    secondaryDescription?: string;
    imageUrl: string;
    secondaryImageUrl?: string;
    sortOrder: number;
  };
  const [keyTechs, setKeyTechs] = useState<KeyTech[]>([]);
  const [serviceItems, setServiceItems] = useState<Array<{ title: string; imageUrl?: string; cards: Card[] }>>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function normItem(it: any): { title: string; imageUrl?: string; cards: Card[] } {
    const title = (it?.title ?? "").toString().trim();
    const imageUrl = (it?.imageUrl ?? "").toString().trim() || undefined; // Extract imageUrl
    if (Array.isArray(it?.cards) && it.cards.length > 0) {
      return {
        title,
        imageUrl,
        cards: it.cards.map((c: any) => {
          if (Array.isArray(c?.descriptions) && c.descriptions.length > 0) {
            return {
              descriptions: c.descriptions.map((d: any) => ({
                description: (d?.description ?? "").toString(),
                subDescription: (d?.subDescription ?? "").toString()
              }))
            };
          }
          return {
            descriptions: [{ description: (c?.description ?? "").toString(), subDescription: (c?.subDescription ?? "").toString() }]
          };
        })
      };
    }
    return {
      title,
      imageUrl,
      cards: [{ descriptions: [{ description: (it?.description ?? "").toString(), subDescription: (it?.subDescription ?? "").toString() }] }]
    };
  }

  useEffect(() => {
    // Fetch service details
    apiFetch<{ item: ServiceDto }>(`/admin/services/${id}`)
      .then((r) => {
        setItem(r.item);
        setServiceItems((r.item.items ?? []).map(normItem));
      })
      .catch(() => null);

    // Fetch all services for parent dropdown
    apiFetch<{ items: ServiceDto[] }>("/admin/services?limit=100")
      .then((res) => setServices(res.items))
      .catch(() => null);

    // Fetch service categories
    apiFetch<{ items: any[] }>("/admin/service-categories")
      .then((res) => setServiceCategories(res.items))
      .catch(() => null);

    // Fetch key technologies
    apiFetch<{ items: any[] }>(`/admin/services/${id}/key-technologies`)
      .then((res) =>
        setKeyTechs(
          res.items.map((k) => ({
            ...k,
            description: k.description ?? "",
            imageUrl: k.imageUrl ?? "",
            secondaryDescription: k.secondaryDescription ?? "",
            secondaryImageUrl: k.secondaryImageUrl ?? ""
          }))
        )
      )
      .catch(() => null);
  }, [id]);

  async function save() {
    if (!item) return;
    setSaving(true);
    try {
      // 1. Save Service
      const res = await apiFetch<{ item: ServiceDto }>(`/admin/services/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          coverImageUrl: item.coverImageUrl,
          overviewImageUrl: item.overviewImageUrl,
          parentId: item.parentId || null,
          serviceCategoryId: item.serviceCategoryId || null,
          items: serviceItems.length
            ? serviceItems
              .map((it) => ({
                title: it.title.trim(),
                imageUrl: it.imageUrl,
                cards: it.cards.map((c) => ({
                  descriptions: c.descriptions.map((d) => ({
                    description: d.description.trim() || null,
                    subDescription: d.subDescription.trim() || null
                  }))
                }))
              }))
              .filter((it) => it.title)
            : null,
          sortOrder: item.sortOrder,
          published: item.published
        })
      });
      setItem(res.item);
      setServiceItems((res.item.items ?? []).map(normItem));

      // 2. Sync Key Technologies
      // For simplicity, we create/update/delete based on what's in keyTechs state
      // But since we don't have bulk sync, we iterate.
      // Or better: Use the separate list UI to manage them.
      // "Create Key Technology" button should immediately create it.
      // "Update" -> immediate update.
      // "Delete" -> immediate delete.
      // The `save()` function manages SERVICE fields.
      // So no changes to `save` needed for key techs if they are managed separately in UI.
      // BUT `parentId` and `overviewImageUrl` ARE service fields, so `save` MUST include them.
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    setError(null);
    setDeleting(true);
    try {
      await apiFetch(`/admin/services/${id}`, { method: "DELETE" });
      router.replace("/services");
    } catch (e: any) {
      setError(String(e?.message ?? "Ошибка удаления"));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-3">
        <ConfirmDialog
          open={deleteOpen}
          title="Удалить решение?"
          description="Это действие нельзя отменить."
          loading={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={doDelete}
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Редактировать решение</h1>
            <Link href="/services" className="text-xs text-slate-600 hover:underline">← Назад</Link>
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-60"
              disabled={deleting}
            >
              Удалить
            </button>
            <button
              disabled={saving}
              onClick={save}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>

        {!item ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-600">Загрузка...</div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>
            ) : null}
            {/* 1-й и 2-й блоки в один ряд (flex) */}
            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
              {/* 1-й div: Заголовок, Slug, Краткое описание, обложка, sort, published */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2">
                <div className="space-y-2">
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Заголовок</div>
                    <input
                      value={item.title}
                      onChange={(e) => setItem({ ...item, title: e.target.value })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Slug</div>
                    <input
                      value={item.slug}
                      onChange={(e) => setItem({ ...item, slug: e.target.value })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Краткое описание</div>
                    <textarea
                      value={item.excerpt ?? ""}
                      onChange={(e) => setItem({ ...item, excerpt: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                      rows={3}
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">URL обложки</div>
                    <input
                      value={item.coverImageUrl ?? ""}
                      onChange={(e) => setItem({ ...item, coverImageUrl: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                    {item.coverImageUrl && (
                      <div className="mt-3">
                        <div className="text-xs font-medium text-slate-700 mb-2">Предпросмотр:</div>
                        <div className="relative w-full h-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                          <img src={item.coverImageUrl} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </label>
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Загрузить обложку</div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploading}
                      className="mt-0.5 block w-full text-sm"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploading(true);
                        uploadImage(f, { kind: "service" })
                          .then((url) => setItem({ ...item, coverImageUrl: url }))
                          .finally(() => setUploading(false));
                      }}
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Родительское решение</div>
                    <select
                      value={item.parentId || ""}
                      onChange={(e) => setItem({ ...item, parentId: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      <option value="">Нет (Корневой раздел)</option>
                      {services.filter(s => s.id !== item.id).map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Категория yechimi (Ota kategoriya)</div>
                    <select
                      value={item.serviceCategoryId || ""}
                      onChange={(e) => setItem({ ...item, serviceCategoryId: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    >
                      <option value="">Нет (Без категории)</option>
                      {serviceCategories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">URL обзорного изображения (Overview)</div>
                    <input
                      value={item.overviewImageUrl ?? ""}
                      onChange={(e) => setItem({ ...item, overviewImageUrl: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Загрузить обзорное изображение</div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={uploading}
                      className="mt-0.5 block w-full text-sm"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploading(true);
                        uploadImage(f, { kind: "service" })
                          .then((url) => setItem({ ...item, overviewImageUrl: url }))
                          .finally(() => setUploading(false));
                      }}
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Sort order</div>
                    <input
                      value={String(item.sortOrder ?? 0)}
                      onChange={(e) => setItem({ ...item, sortOrder: Number(e.target.value) || 0 })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                      inputMode="numeric"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={item.published}
                      onChange={(e) => setItem({ ...item, published: e.target.checked })}
                    />
                    Опубликовано
                  </label>
                </div>
              </div>
              {/* 2-й div: Контент */}
              <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2 min-w-0">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Контент</div>
                  <textarea
                    value={item.content ?? ""}
                    onChange={(e) => setItem({ ...item, content: e.target.value || null })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[200px]"
                    rows={14}
                  />
                </label>
                <div className="mt-2 text-xs text-slate-500">Позже можно добавить rich‑editor.</div>
              </div>
            </div>

            {/* Key Technologies Block */}
            <div className="w-full">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-sm font-medium text-slate-700">Ключевые технологии (Key Technologies)</div>
                  <button
                    type="button"
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                    onClick={async () => {
                      const t = prompt("Название технологии?");
                      if (!t) return;
                      await apiFetch(`/admin/services/${id}/key-technologies`, { method: "POST", body: JSON.stringify({ title: t }) });
                      // Refresh
                      apiFetch<{ items: any[] }>(`/admin/services/${id}/key-technologies`)
                        .then((res) =>
                          setKeyTechs(
                            res.items.map((k) => ({
                              ...k,
                              description: k.description ?? "",
                              imageUrl: k.imageUrl ?? "",
                              secondaryDescription: k.secondaryDescription ?? "",
                              secondaryImageUrl: k.secondaryImageUrl ?? ""
                            }))
                          )
                        )
                        .catch(() => null);
                    }}
                  >
                    + Добавить технологию
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {keyTechs.map((kt) => (
                    <div key={kt.id} className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-2">
                      <div className="space-y-2">
                        {/* Row 1: Title, Desc, Image 1 */}
                        <input
                          value={kt.title}
                          onChange={(e) => {
                            const v = e.target.value;
                            setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, title: v } : x));
                          }}
                          onBlur={(e) => apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ title: e.target.value }) })}
                          className="w-full rounded border border-slate-300 px-2 py-1 text-sm font-medium"
                          placeholder="Название"
                        />
                        <div className="flex gap-2">
                          <div className="flex-1 space-y-2">
                            <textarea
                              value={kt.description}
                              onChange={(e) => {
                                const v = e.target.value;
                                setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, description: v } : x));
                              }}
                              onBlur={(e) => apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ description: e.target.value }) })}
                              className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                              placeholder="Описание 1"
                              rows={2}
                            />
                            <div className="flex gap-2 items-center">
                              <input
                                value={kt.imageUrl}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, imageUrl: v } : x));
                                }}
                                onBlur={(e) => apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ imageUrl: e.target.value }) })}
                                className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
                                placeholder="URL изобр. 1"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                className="text-xs w-24"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  uploadImage(f, { kind: "service" }).then(url => {
                                    setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, imageUrl: url } : x));
                                    apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ imageUrl: url }) });
                                  });
                                }}
                              />
                              {kt.imageUrl && <img src={kt.imageUrl} className="h-8 w-8 object-contain border" />}
                            </div>
                          </div>

                          {/* Row 2/Col 2: Desc 2, Image 2 */}
                          <div className="flex-1 space-y-2 border-l pl-2">
                            <textarea
                              value={kt.secondaryDescription ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, secondaryDescription: v } : x));
                              }}
                              onBlur={(e) => apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ secondaryDescription: e.target.value }) })}
                              className="w-full rounded border border-slate-300 px-2 py-1 text-sm"
                              placeholder="Описание 2 (Доп.)"
                              rows={2}
                            />
                            <div className="flex gap-2 items-center">
                              <input
                                value={kt.secondaryImageUrl ?? ""}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, secondaryImageUrl: v } : x));
                                }}
                                onBlur={(e) => apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ secondaryImageUrl: e.target.value }) })}
                                className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
                                placeholder="URL изобр. 2"
                              />
                              <input
                                type="file"
                                accept="image/*"
                                className="text-xs w-24"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  if (!f) return;
                                  uploadImage(f, { kind: "service" }).then(url => {
                                    setKeyTechs(prev => prev.map(x => x.id === kt.id ? { ...x, secondaryImageUrl: url } : x));
                                    apiFetch(`/admin/key-technologies/${kt.id}`, { method: "PATCH", body: JSON.stringify({ secondaryImageUrl: url }) });
                                  });
                                }}
                              />
                              {kt.secondaryImageUrl && <img src={kt.secondaryImageUrl} className="h-8 w-8 object-contain border" />}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        className="text-red-600 hover:text-red-800 text-xs self-end"
                        onClick={async () => {
                          if (!confirm("Удалить?")) return;
                          await apiFetch(`/admin/key-technologies/${kt.id}`, { method: "DELETE" });
                          setKeyTechs(prev => prev.filter(x => x.id !== kt.id));
                        }}
                      >
                        Удалить технологию
                      </button>
                    </div>
                  ))}
                  {keyTechs.length === 0 && <div className="text-xs text-slate-500 p-2">Нет технологий.</div>}
                </div>
              </div>
            </div>

            {/* 3-й div: Решения внутри раздела — 100%, элементы по 2 в ряд (1fr 1fr) */}
            {/* 3-й div: Решения внутри раздела — 100%, элементы по 2 в ряд (1fr 1fr) */}
            <div className="w-full">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-sm font-medium text-slate-700">Решения внутри раздела (Solution Details)</div>
                  <button
                    type="button"
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                    onClick={() => setServiceItems((prev) => [...prev, { title: "", cards: [{ descriptions: [{ description: "", subDescription: "" }] }] }])}
                  >
                    + Добавить карточку
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {serviceItems.map((x, i) => (
                    <div key={i} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                      {/* Item Header */}
                      <div className="mb-3 space-y-2 border-b border-slate-100 pb-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase">Заголовок карточки (Синий фон)</label>
                          <input
                            className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm font-semibold text-blue-800"
                            value={x.title}
                            onChange={(e) => {
                              const v = e.target.value;
                              setServiceItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, title: v } : it)));
                            }}
                            placeholder="Напр: Автоматический учет..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 uppercase">Изображение (внизу карточки)</label>
                          <div className="flex gap-2">
                            <input
                              className="flex-1 rounded border border-slate-300 px-2 py-1 text-xs"
                              value={x.imageUrl ?? ""}
                              onChange={(e) => {
                                const v = e.target.value;
                                setServiceItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, imageUrl: v } : it)));
                              }}
                              placeholder="URL изображения"
                            />
                            <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-xs flex items-center border">
                              Upload
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) {
                                  uploadImage(f, { kind: "service" }).then(url => {
                                    setServiceItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, imageUrl: url } : it)));
                                  });
                                }
                              }} />
                            </label>
                          </div>
                          {x.imageUrl && <img src={x.imageUrl} className="h-16 w-full object-contain mt-1 bg-slate-50 rounded border border-dashed" />}
                        </div>
                      </div>

                      {/* Cards content */}
                      <div className="space-y-3">
                        {x.cards.map((c, j) => (
                          <div key={j} className="space-y-2">
                            {/* Descriptions */}
                            {c.descriptions.map((d, di) => (
                              <div key={di} className="space-y-2">
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Подзаголовок (Жирный)</label>
                                  <textarea
                                    rows={1}
                                    className="w-full rounded border border-slate-300 px-2 py-1 text-sm font-medium"
                                    placeholder="Напр: Система распознавания..."
                                    value={d.description}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setServiceItems((prev) =>
                                        prev.map((it, idx) => {
                                          if (idx !== i) return it;
                                          const newCards = [...it.cards];
                                          const newDescs = [...newCards[j].descriptions];
                                          newDescs[di] = { ...newDescs[di], description: v };
                                          newCards[j] = { ...newCards[j], descriptions: newDescs };
                                          return { ...it, cards: newCards };
                                        })
                                      );
                                    }}
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-semibold text-slate-400 uppercase">Текст (Детали)</label>
                                  <textarea
                                    rows={3}
                                    className="w-full rounded border border-slate-300 px-2 py-1 text-xs"
                                    placeholder="Детали..."
                                    value={d.subDescription}
                                    onChange={(e) => {
                                      const v = e.target.value;
                                      setServiceItems((prev) =>
                                        prev.map((it, idx) => {
                                          if (idx !== i) return it;
                                          const newCards = [...it.cards];
                                          const newDescs = [...newCards[j].descriptions];
                                          newDescs[di] = { ...newDescs[di], subDescription: v };
                                          newCards[j] = { ...newCards[j], descriptions: newDescs };
                                          return { ...it, cards: newCards };
                                        })
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                      <button
                        className="mt-3 text-red-500 text-xs w-full text-right"
                        onClick={() => setServiceItems((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        Удалить карточку
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

