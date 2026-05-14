"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type ServiceDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";

export default function NewServicePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [overviewImageUrl, setOverviewImageUrl] = useState("");
  const [parentId, setParentId] = useState<string | null>(null);
  const [serviceCategoryId, setServiceCategoryId] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceDto[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);

  type DescBlock = { description: string; subDescription: string };
  type Card = { descriptions: DescBlock[] };
  const [items, setItems] = useState<Array<{ title: string; cards: Card[] }>>([]);
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Fetch existing services for parent selection
  useEffect(() => {
    apiFetch<{ items: ServiceDto[] }>("/admin/services?limit=100")
      .then((res) => setServices(res.items))
      .catch((err) => console.error(err));

    apiFetch<{ items: any[] }>("/admin/service-categories")
      .then((res) => setServiceCategories(res.items))
      .catch((err) => console.error(err));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch<{ item: ServiceDto }>("/admin/services", {
        method: "POST",
        body: JSON.stringify({
          title,
          slug: slug || undefined,
          excerpt: excerpt || null,
          content: content || null,
          coverImageUrl: coverImageUrl || null,
          overviewImageUrl: overviewImageUrl || null,
          parentId: parentId || null,
          serviceCategoryId: serviceCategoryId || null,
          items: items.length
            ? items
              .filter((it) => it.title.trim())
              .map((it) => ({
                title: it.title.trim(),
                cards: it.cards.map((c) => ({
                  descriptions: c.descriptions.map((d) => ({
                    description: d.description.trim() || null,
                    subDescription: d.subDescription.trim() || null
                  }))
                }))
              }))
            : null,
          published
        })
      });
      router.replace(`/services/${res.item.id}`);
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
            <h1 className="text-lg font-semibold">Новое решение</h1>
            <Link href="/services" className="text-xs text-slate-600 hover:underline">← Назад</Link>
          </div>
          <button
            type="submit"
            form="new-service-form"
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Сохранение..." : "Создать"}
          </button>
        </div>
        <form id="new-service-form" onSubmit={onSubmit} className="mt-3 flex flex-col gap-3">
          {/* 1-й и 2-й блоки в один ряд (flex) */}
          <div className="flex flex-col lg:flex-row gap-3 items-stretch">
            {/* 1-й div: Заголовок, Slug, Краткое описание, обложка, Опубликовано */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2">
              <div className="space-y-2">
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Заголовок</div>
                  <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm" required />
                </label>
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Slug</div>
                  <input value={slug} onChange={(e) => setSlug(e.target.value)} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm" placeholder="avto-iz-slug" />
                </label>
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">Краткое описание</div>
                  <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm" rows={3} />
                </label>
                <label className="block">
                  <div className="text-xs font-medium text-slate-700">URL обложки</div>
                  <input value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm" placeholder="/uploads/..." />
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
                      uploadImage(f, { kind: "service" }).then((url) => setCoverImageUrl(url)).finally(() => setUploading(false));
                    }}
                  />
                  <span className="text-xs text-slate-500">{uploading ? "Загрузка..." : "URL заполнится автоматически."}</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                  Опубликовано
                </label>
              </div>
            </div>
            {/* 2-й div: Контент */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 w-full lg:w-1/2 min-w-0">
              <label className="block mb-3">
                <div className="text-xs font-medium text-slate-700">Родительское решение</div>
                <select
                  value={parentId || ""}
                  onChange={(e) => setParentId(e.target.value || null)}
                  className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
                >
                  <option value="">Нет (Корневой раздел)</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mb-3">
                <div className="text-xs font-medium text-slate-700">Категория yechimi (Ota kategoriya)</div>
                <select
                  value={serviceCategoryId || ""}
                  onChange={(e) => setServiceCategoryId(e.target.value || null)}
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

              <label className="block mb-3">
                <div className="text-xs font-medium text-slate-700">URL обзорного изображения (Overview)</div>
                <input value={overviewImageUrl} onChange={(e) => setOverviewImageUrl(e.target.value)} className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1.5 text-sm" placeholder="/uploads/..." />
              </label>
              <label className="block mb-3">
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
                    uploadImage(f, { kind: "service" }).then((url) => setOverviewImageUrl(url)).finally(() => setUploading(false));
                  }}
                />
                <span className="text-xs text-slate-500">{uploading ? "Загрузка..." : "URL заполнится автоматически."}</span>
              </label>

              <label className="block">
                <div className="text-sm font-medium text-slate-700">Контент</div>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm min-h-[200px]" rows={14} />
              </label>
            </div>
          </div>

          {/* 3-й div: Решения внутри раздела — 100%, элементы по 2 в ряд */}
          <div className="w-full">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="text-sm font-medium text-slate-700">Решения внутри раздела</div>
                <button type="button" className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-semibold hover:bg-slate-50" onClick={() => setItems((prev) => [...prev, { title: "", cards: [{ descriptions: [{ description: "", subDescription: "" }] }] }])}>
                  + Элемент
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map((it, idx) => (
                  <div key={idx} className="rounded-lg border border-slate-200 bg-white p-2">
                    <div className="flex gap-2 items-center">
                      <input
                        value={it.title}
                        onChange={(e) => setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, title: e.target.value } : x)))}
                        className="flex-1 min-w-0 rounded border border-slate-300 px-2 py-1 text-sm"
                        placeholder="Заголовок, напр. Монтаж"
                      />
                      <button type="button" className="rounded border border-red-200 bg-white px-2 py-1 text-xs text-red-700 hover:bg-red-50" onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}>
                        Удалить
                      </button>
                    </div>
                    <div className="mt-2 pl-2 border-l-2 border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-600">Карточки описания</span>
                        <button
                          type="button"
                          className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs hover:bg-slate-50"
                          onClick={() => setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, cards: [...x.cards, { descriptions: [{ description: "", subDescription: "" }] }] } : x)))}
                        >
                          + Карточка
                        </button>
                      </div>
                      {it.cards.map((card, cIdx) => (
                        <div key={cIdx} className="rounded border border-slate-100 bg-slate-50/50 p-2">
                          <div className="flex justify-end">
                            <button type="button" className="text-xs text-red-600 hover:underline" onClick={() => setItems((prev) => prev.map((x, i) => (i === idx ? { ...x, cards: x.cards.filter((_, j) => j !== cIdx) } : x)))}>Удалить карточку</button>
                          </div>
                          <div className="mt-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-slate-500">Краткие описания</span>
                              <button
                                type="button"
                                className="rounded border border-slate-300 bg-white px-1.5 py-0.5 text-xs hover:bg-slate-50"
                                onClick={() =>
                                  setItems((prev) =>
                                    prev.map((x, i) =>
                                      i === idx ? { ...x, cards: x.cards.map((c, j) => (j === cIdx ? { ...c, descriptions: [...c.descriptions, { description: "", subDescription: "" }] } : c)) } : x
                                    )
                                  )
                                }
                              >
                                + Краткое описание
                              </button>
                            </div>
                            {card.descriptions.map((block, bIdx) => (
                              <div key={bIdx} className="rounded border border-slate-200 bg-white p-1.5">
                                <div className="flex justify-end mb-0.5">
                                  <button
                                    type="button"
                                    className="text-xs text-red-600 hover:underline"
                                    onClick={() =>
                                      setItems((prev) =>
                                        prev.map((x, i) =>
                                          i === idx ? { ...x, cards: x.cards.map((c, j) => (j === cIdx ? { ...c, descriptions: c.descriptions.filter((_, bi) => bi !== bIdx) } : c)) } : x
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
                                      setItems((prev) =>
                                        prev.map((x, i) =>
                                          i === idx
                                            ? { ...x, cards: x.cards.map((c, j) => (j === cIdx ? { ...c, descriptions: c.descriptions.map((d, di) => (di === bIdx ? { ...d, description: e.target.value } : d)) } : c)) }
                                            : x
                                        )
                                      )
                                    }
                                    className="mt-0.5 w-full rounded border border-slate-300 px-2 py-1 text-sm"
                                    placeholder="Краткое описание"
                                  />
                                </label>
                              </div>
                            ))}
                          </div>
                          {card.descriptions.length === 0 ? <div className="text-xs text-slate-500">Нажмите «+ Краткое описание».</div> : null}
                        </div>
                      ))}
                      {it.cards.length === 0 ? <div className="text-xs text-slate-500">Нет карточек. Нажмите «+ Карточка».</div> : null}
                    </div>
                  </div>
                ))}
              </div>
              {items.length === 0 ? <div className="text-xs text-slate-500">Пока пусто. Нажмите «+ Элемент».</div> : null}
            </div>
          </div>
        </form>
      </div>
    </AuthGate>
  );
}

