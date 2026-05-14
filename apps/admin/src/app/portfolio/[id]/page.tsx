"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type PortfolioCategoryDto, type PortfolioDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function EditPortfolioProjectPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [item, setItem] = useState<PortfolioDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingClientLogo, setUploadingClientLogo] = useState(false);
  type DescBlock = { description: string; subDescriptions: string[] };
  type Card = { descriptions: DescBlock[] };
  const [workItems, setWorkItems] = useState<Array<{ title: string; cards: Card[] }>>([]);
  const [categories, setCategories] = useState<PortfolioCategoryDto[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function normWorkItem(it: any): { title: string; cards: Card[] } {
    const title = (it?.title ?? "").toString();
    if (Array.isArray(it?.cards) && it.cards.length > 0) {
      return {
        title,
        cards: it.cards.map((c: any) => {
          if (Array.isArray(c?.descriptions) && c.descriptions.length > 0) {
            return {
              descriptions: c.descriptions.map((d: any) => ({
                description: ((d?.description ?? d?.subDescription) ?? "").toString(),
                subDescriptions: Array.isArray(d?.subDescriptions) ? d.subDescriptions.map((s: any) => s.toString()) : []
              }))
            };
          }
          return {
            descriptions: [
              {
                description: ((c?.description ?? c?.subDescription) ?? "").toString(),
                subDescriptions: []
              }
            ]
          };
        })
      };
    }
    return {
      title,
      cards: [
        {
          descriptions: [
            {
              description: ((it?.description ?? it?.subDescription) ?? "").toString(),
              subDescriptions: []
            }
          ]
        }
      ]
    };
  }

  useEffect(() => {
    apiFetch<{ item: PortfolioDto }>(`/admin/portfolio/${id}`)
      .then((r) => {
        setItem(r.item);
        setWorkItems((r.item.items ?? []).map(normWorkItem));
      })
      .catch(() => null);
  }, [id]);

  useEffect(() => {
    apiFetch<{ categories: PortfolioCategoryDto[] }>("/admin/portfolio-categories")
      .then((r) => setCategories(r.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  async function save() {
    if (!item) return;
    setSaving(true);
    try {
      const res = await apiFetch<{ item: PortfolioDto }>(`/admin/portfolio/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: item.title,
          slug: item.slug,
          excerpt: item.excerpt,
          content: item.content,
          coverImageUrl: item.coverImageUrl,
          galleryImageUrls: item.galleryImageUrls,
          portfolioCategoryId: item.portfolioCategoryId ?? null,
          items: workItems.length
            ? workItems
                .filter((it) => it.title.trim())
                .map((it) => ({
                  title: it.title.trim(),
                  cards: it.cards.map((c) => ({
                    descriptions: c.descriptions.map((d) => ({
                      description: d.description.trim() || null,
                      subDescriptions: d.subDescriptions?.map((s) => s.trim()).filter(Boolean) || []
                    }))
                  }))
                }))
            : null,
          clientName: item.clientName,
          clientlogourl: item.clientlogourl,
          clientTasks: item.clientTasks ?? null,
          location: item.location,
          completedAt: item.completedAt,
          sortOrder: item.sortOrder,
          published: item.published
        })
      });
      setItem(res.item);
      setWorkItems((res.item.items ?? []).map(normWorkItem));
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    setError(null);
    setDeleting(true);
    try {
      await apiFetch(`/admin/portfolio/${id}`, { method: "DELETE" });
      router.replace("/portfolio");
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
      <div className="container-page py-8">
        <ConfirmDialog
          open={deleteOpen}
          title="Удалить проект?"
          description="Это действие нельзя отменить."
          loading={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={doDelete}
        />
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Редактировать проект</h1>
            <Link href="/portfolio" className="text-xs text-slate-600 hover:underline">← Назад</Link>
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
              type="submit"
              form="portfolio-form"
              disabled={saving}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>

        {!item ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка...</div>
        ) : (
          <form id="portfolio-form" onSubmit={save} className="mt-3 flex flex-col gap-3">
            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
            ) : null}

            <div className="flex flex-col lg:flex-row gap-3 items-stretch">
              <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2">
                <div className="space-y-2">
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Название</div>
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
                  <div className="text-xs font-medium text-slate-700">Категория (опционально)</div>
                  <select
                    value={item.portfolioCategoryId ?? ""}
                    onChange={(e) => setItem({ ...item, portfolioCategoryId: e.target.value || null })}
                    className="mt-0.5 w-full rounded border border-slate-300 bg-white px-2 py-1.5 text-sm"
                  >
                    <option value="">Без категории</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
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
                      <div className="text-xs font-medium text-slate-700 mb-2">Предпросмотр изображения:</div>
                      <div className="relative w-full h-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <img
                          src={item.coverImageUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </label>
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Загрузить обложку</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={uploadingCover}
                    className="mt-0.5 block w-full text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploadingCover(true);
                      uploadImage(f, { kind: "portfolio" })
                        .then((url) => setItem({ ...item, coverImageUrl: url }))
                        .finally(() => setUploadingCover(false));
                    }}
                  />
                  <span className="text-xs text-slate-500">{uploadingCover ? "Загрузка..." : "URL заполнится автоматически."}</span>
                </label>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-sm font-medium text-slate-700">Галерея (несколько фото)</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    multiple
                    disabled={uploadingGallery}
                    className="mt-2 block w-full text-sm"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (!files.length) return;
                      setUploadingGallery(true);
                      try {
                        const urls = await Promise.all(files.map((f) => uploadImage(f, { kind: "portfolioGallery" })));
                        setItem({ ...item, galleryImageUrls: [...(item.galleryImageUrls ?? []), ...urls] });
                      } finally {
                        setUploadingGallery(false);
                      }
                    }}
                  />
                  <div className="mt-1 text-xs text-slate-500">
                    {uploadingGallery ? "Загрузка..." : "Можно выбрать несколько файлов сразу."}
                  </div>

                  {(item.galleryImageUrls ?? []).length ? (
                    <div className="mt-3 space-y-2">
                      {(item.galleryImageUrls ?? []).map((u, idx) => (
                        <div
                          key={`${u}-${idx}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                        >
                          <div className="truncate text-xs text-slate-700">{u}</div>
                          <button
                            type="button"
                            className="text-xs font-semibold text-red-700 hover:text-red-800"
                            onClick={() =>
                              setItem({
                                ...item,
                                galleryImageUrls: (item.galleryImageUrls ?? []).filter((_, i) => i !== idx)
                              })
                            }
                          >
                            Удалить
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-600">Пока пусто.</div>
                  )}
                </div>
              </div>
            </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2 min-w-0">
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <div className="text-xs font-medium text-slate-700">Клиент</div>
                      <input
                        value={item.clientName ?? ""}
                        onChange={(e) => setItem({ ...item, clientName: e.target.value || null })}
                        className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="block">
                      <div className="text-xs font-medium text-slate-700">Локация</div>
                      <input
                        value={item.location ?? ""}
                        onChange={(e) => setItem({ ...item, location: e.target.value || null })}
                        className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                      />
                    </label>
                  </div>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Логотип клиента</div>
                    <input
                      value={item.clientlogourl ?? ""}
                      onChange={(e) => setItem({ ...item, clientlogourl: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                      placeholder="https://... или /uploads/images/..."
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Загрузить логотип клиента</div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      disabled={uploadingClientLogo}
                      className="mt-0.5 block w-full text-sm"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        setUploadingClientLogo(true);
                        uploadImage(f, { kind: "logo" })
                          .then((url) => setItem({ ...item, clientlogourl: url }))
                          .finally(() => setUploadingClientLogo(false));
                      }}
                    />
                    <span className="text-xs text-slate-500">{uploadingClientLogo ? "Загрузка..." : "URL заполнится автоматически."}</span>
                  </label>

                  {item.clientlogourl && (
                    <div className="mt-3">
                      <div className="text-xs font-medium text-slate-700 mb-2">Предпросмотр логотипа:</div>
                      <div className="relative w-full h-20 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center">
                        <img
                          src={item.clientlogourl}
                          alt="Client Logo Preview"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Задачи заказчика</div>
                    <textarea
                      value={item.clientTasks ?? ""}
                      onChange={(e) => setItem({ ...item, clientTasks: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                      rows={8}
                      placeholder="Опишите задачи, которые ставил заказчик"
                    />
                  </label>

                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Дата завершения (опционально)</div>
                    <input
                      type="date"
                      value={(item.completedAt ?? "").slice(0, 10)}
                      onChange={(e) => setItem({ ...item, completedAt: e.target.value || null })}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>

                  <label className="block">
                    <div className="text-sm font-medium text-slate-700">Контент</div>
                    <textarea
                      value={item.content ?? ""}
                      onChange={(e) => setItem({ ...item, content: e.target.value || null })}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[200px]"
                      rows={14}
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
            </div>

            <div className="w-full">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="text-sm font-medium text-slate-700">Решения внутри раздела</div>
                  <button
                    type="button"
                    className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50"
                    onClick={() => setWorkItems((prev) => [...prev, { title: "", cards: [{ descriptions: [{ description: "", subDescriptions: [] }] }] }])}
                  >
                    + Элемент
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {workItems.map((it, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 bg-white p-2">
                      <div className="flex gap-2 items-center">
                        <input
                          value={it.title}
                          onChange={(e) => setWorkItems((prev) => prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))}
                          className="flex-1 min-w-0 rounded border border-slate-300 px-2 py-1 text-sm"
                          placeholder="Заголовок, напр. Монтаж"
                        />
                        <button
                          type="button"
                          className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                          onClick={() => setWorkItems((prev) => prev.filter((_, i) => i !== idx))}
                        >
                          Удалить
                        </button>
                      </div>

                      <div className="mt-2 pl-2 border-l-2 border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600">Карточки описания</span>
                          <button
                            type="button"
                            className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs hover:bg-slate-50"
                            onClick={() =>
                              setWorkItems((prev) =>
                                prev.map((x, i) => (i === idx ? { ...x, cards: [...x.cards, { descriptions: [{ description: "", subDescriptions: [] }] }] } : x))
                              )
                            }
                          >
                            + Карточка
                          </button>
                        </div>

                        {it.cards.map((card, cIdx) => (
                          <div key={cIdx} className="rounded border border-slate-100 bg-slate-50/50 p-2">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                className="text-xs text-red-600 hover:underline"
                                onClick={() => setWorkItems((prev) => prev.map((x, i) => (i === idx ? { ...x, cards: x.cards.filter((_, j) => j !== cIdx) } : x)))}
                              >
                                Удалить карточку
                              </button>
                            </div>

                            <div className="mt-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-500">Краткие описания</span>
                                <button
                                  type="button"
                                  className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs hover:bg-slate-50"
                                  onClick={() =>
                                    setWorkItems((prev) =>
                                      prev.map((x, i) =>
                                        i === idx
                                          ? {
                                              ...x,
                                              cards: x.cards.map((c, j) =>
                                                j === cIdx ? { ...c, descriptions: [...c.descriptions, { description: "", subDescriptions: [] }] } : c
                                              )
                                            }
                                          : x
                                      )
                                    )
                                  }
                                >
                                  + Описание
                                </button>
                              </div>

                              {card.descriptions.map((block, bIdx) => (
                                <div key={bIdx} className="rounded border border-slate-200 bg-white p-1.5">
                                  <div className="flex justify-end mb-0.5">
                                    <button
                                      type="button"
                                      className="text-xs text-red-600 hover:underline"
                                      onClick={() =>
                                        setWorkItems((prev) =>
                                          prev.map((x, i) =>
                                            i === idx
                                              ? {
                                                  ...x,
                                                  cards: x.cards.map((c, j) =>
                                                    j === cIdx ? { ...c, descriptions: c.descriptions.filter((_, bi) => bi !== bIdx) } : c
                                                  )
                                                }
                                              : x
                                          )
                                        )
                                      }
                                    >
                                      Удалить
                                    </button>
                                  </div>

                                  <label className="block">
                                    <span className="text-xs font-medium text-slate-600">Описание</span>
                                    <input
                                      value={block.description}
                                      onChange={(e) =>
                                        setWorkItems((prev) =>
                                          prev.map((x, i) =>
                                            i === idx
                                              ? {
                                                  ...x,
                                                  cards: x.cards.map((c, j) =>
                                                    j === cIdx
                                                      ? {
                                                          ...c,
                                                          descriptions: c.descriptions.map((d, di) => (di === bIdx ? { ...d, description: e.target.value } : d))
                                                        }
                                                      : c
                                                  )
                                                }
                                              : x
                                          )
                                        )
                                      }
                                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                                      placeholder="Описание"
                                    />
                                  </label>
                                  <div className="mt-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-medium text-slate-600">Подписания</span>
                                      <button
                                        type="button"
                                        className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs hover:bg-slate-50"
                                        onClick={() =>
                                          setWorkItems((prev) =>
                                            prev.map((x, i) =>
                                              i === idx
                                                ? {
                                                    ...x,
                                                    cards: x.cards.map((c, j) =>
                                                      j === cIdx
                                                        ? {
                                                            ...c,
                                                            descriptions: c.descriptions.map((d, di) =>
                                                              di === bIdx
                                                                ? { ...d, subDescriptions: [...d.subDescriptions, ""] }
                                                                : d
                                                            )
                                                          }
                                                        : c
                                                    )
                                                  }
                                                : x
                                            )
                                          )
                                        }
                                      >
                                        + Подписание
                                      </button>
                                    </div>
                                    {block.subDescriptions.map((sub, sIdx) => (
                                      <div key={sIdx} className="mt-1 flex items-center gap-2">
                                        <input
                                          value={sub}
                                          onChange={(e) =>
                                            setWorkItems((prev) =>
                                              prev.map((x, i) =>
                                                i === idx
                                                  ? {
                                                      ...x,
                                                      cards: x.cards.map((c, j) =>
                                                        j === cIdx
                                                          ? {
                                                              ...c,
                                                              descriptions: c.descriptions.map((d, di) =>
                                                                di === bIdx
                                                                  ? {
                                                                      ...d,
                                                                      subDescriptions: d.subDescriptions.map((s, si) => (si === sIdx ? e.target.value : s))
                                                                    }
                                                                  : d
                                                              )
                                                            }
                                                          : c
                                                      )
                                                    }
                                                  : x
                                              )
                                            )
                                          }
                                          className="flex-1 rounded border border-slate-300 px-2 py-1 text-sm"
                                          placeholder="Подписание"
                                        />
                                        <button
                                          type="button"
                                          className="text-xs text-red-600 hover:underline"
                                          onClick={() =>
                                            setWorkItems((prev) =>
                                              prev.map((x, i) =>
                                                i === idx
                                                  ? {
                                                      ...x,
                                                      cards: x.cards.map((c, j) =>
                                                        j === cIdx
                                                          ? {
                                                              ...c,
                                                              descriptions: c.descriptions.map((d, di) =>
                                                                di === bIdx
                                                                  ? {
                                                                      ...d,
                                                                      subDescriptions: d.subDescriptions.filter((_, si) => si !== sIdx)
                                                                    }
                                                                  : d
                                                              )
                                                            }
                                                          : c
                                                      )
                                                    }
                                                  : x
                                              )
                                            )
                                          }
                                        >
                                          Удалить
                                        </button>
                                      </div>
                                    ))}
                                    {block.subDescriptions.length === 0 ? (
                                      <div className="text-xs text-slate-500">Нажмите «+ Подписание».</div>
                                    ) : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                            {card.descriptions.length === 0 ? <div className="text-xs text-slate-500">Нажмите «+ Описание».</div> : null}
                          </div>
                        ))}
                        {it.cards.length === 0 ? <div className="text-xs text-slate-500">Нет карточек. Нажмите «+ Карточка».</div> : null}
                      </div>
                    </div>
                  ))}
                </div>
                {workItems.length === 0 ? <div className="text-xs text-slate-500">Пока пусто. Нажмите «+ Элемент».</div> : null}
              </div>
            </div>
          </form>
        )}
      </div>
    </AuthGate>
  );
}

