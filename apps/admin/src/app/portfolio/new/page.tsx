"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type PortfolioCategoryDto, type PortfolioDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";

export default function NewPortfolioProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [portfolioCategoryId, setPortfolioCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<PortfolioCategoryDto[]>([]);
  const [clientName, setClientName] = useState("");
  const [clientlogourl, setClientlogourl] = useState("");
  const [clientTasks, setClientTasks] = useState("");
  const [location, setLocation] = useState("");
  const [galleryImageUrls, setGalleryImageUrls] = useState<string[]>([]);
  const [completedAt, setCompletedAt] = useState("");
  type DescBlock = { description: string; subDescriptions: string[] };
  type Card = { descriptions: DescBlock[] };
  const [workItems, setWorkItems] = useState<Array<{ title: string; cards: Card[] }>>([]);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingClientLogo, setUploadingClientLogo] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    apiFetch<{ categories: PortfolioCategoryDto[] }>("/admin/portfolio-categories")
      .then((r) => setCategories(r.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch<{ item: PortfolioDto }>("/admin/portfolio", {
        method: "POST",
        body: JSON.stringify({
          title,
          excerpt: excerpt || null,
          content: content || null,
          coverImageUrl: coverImageUrl || null,
          portfolioCategoryId: portfolioCategoryId || null,
          galleryImageUrls: galleryImageUrls.length ? galleryImageUrls : null,
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
          clientName: clientName || null,
          clientlogourl: clientlogourl || null,
          clientTasks: clientTasks || null,
          location: location || null,
          completedAt: completedAt || null,
          published
        })
      });
      router.replace(`/portfolio/${res.item.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold">Новый проект (портфолио)</h1>
            <Link href="/portfolio" className="text-xs text-slate-600 hover:underline">← Назад</Link>
          </div>
          <button
            type="submit"
            form="portfolio-form"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Сохранение..." : "Создать"}
          </button>
        </div>
        <form id="portfolio-form" onSubmit={onSubmit} className="mt-3 flex flex-col gap-3">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch">
            {/* 1-й div: Заголовок, Slug, Краткое описание, обложка, Опубликовано */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2">
              <div className="space-y-2">
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Название</div>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    required
                  />
                </label>

                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Краткое описание</div>
                  <textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    rows={3}
                  />
                </label>

                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Категория (опционально)</div>
                  <select
                    value={portfolioCategoryId}
                    onChange={(e) => setPortfolioCategoryId(e.target.value)}
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
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    placeholder="https://... или /uploads/images/..."
                  />
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
                        .then((url) => setCoverImageUrl(url))
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
                        setGalleryImageUrls((prev) => [...prev, ...urls]);
                      } finally {
                        setUploadingGallery(false);
                      }
                    }}
                  />
                  <div className="mt-1 text-xs text-slate-500">
                    {uploadingGallery ? "Загрузка..." : "Можно выбрать несколько файлов сразу."}
                  </div>
                  {galleryImageUrls.length ? (
                    <div className="mt-3 space-y-2">
                      {galleryImageUrls.map((u, idx) => (
                        <div key={`${u}-${idx}`} className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <div className="truncate text-xs text-slate-700">{u}</div>
                          <button
                            type="button"
                            className="text-xs font-semibold text-red-700 hover:text-red-800"
                            onClick={() => setGalleryImageUrls((prev) => prev.filter((_, i) => i !== idx))}
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

            {/* 2-й div: Клиент, Локация, Задачи, Дата, Контент, Sort order, Опубликовано */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2 min-w-0">
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Клиент</div>
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                  <label className="block">
                    <div className="text-xs font-medium text-slate-700">Локация</div>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    />
                  </label>
                </div>

                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Логотип клиента</div>
                  <input
                    value={clientlogourl}
                    onChange={(e) => setClientlogourl(e.target.value)}
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
                        .then((url) => setClientlogourl(url))
                        .finally(() => setUploadingClientLogo(false));
                    }}
                  />
                  <span className="text-xs text-slate-500">{uploadingClientLogo ? "Загрузка..." : "URL заполнится автоматически."}</span>
                </label>

                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Задачи заказчика</div>
                  <textarea
                    value={clientTasks}
                    onChange={(e) => setClientTasks(e.target.value)}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    rows={8}
                    placeholder="Опишите задачи, которые ставил заказчик"
                  />
                </label>

                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Дата завершения (опционально)</div>
                  <input
                    type="date"
                    value={completedAt}
                    onChange={(e) => setCompletedAt(e.target.value)}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Контент</div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[200px]"
                    rows={14}
                  />
                </label>

                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Sort order</div>
                  <input
                    type="number"
                    value={0}
                    onChange={(e) => {}}
                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                    inputMode="numeric"
                    disabled
                  />
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                  Опубликовано
                </label>
              </div>
            </div>
          </div>

          {/* 3-й div: Решения внутри раздела — 100% */}
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
                        onChange={(e) =>
                          setWorkItems((prev) => prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))
                        }
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
                              onClick={() =>
                                setWorkItems((prev) =>
                                  prev.map((x, i) => (i === idx ? { ...x, cards: x.cards.filter((_, j) => j !== cIdx) } : x))
                                )
                              }
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
                                    placeholder="Краткое описание"
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
      </div>
    </AuthGate>
  );
}

