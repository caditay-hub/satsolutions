"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type BrandDto, type CategoryDto, type ProductDto } from "@/lib/api";
import { CharacteristicsEditor, type CharacteristicRow } from "@/components/CharacteristicsEditor";
import { uploadImage } from "@/lib/upload";

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [isUsd, setIsUsd] = useState(false);
  const [recommended, setRecommended] = useState(false);
  const [categoryId, setCategoryId] = useState<string>("");
  const [brandId, setBrandId] = useState<string>("");
  const [shortDescription, setShortDescription] = useState("");
  const [characteristics, setCharacteristics] = useState<CharacteristicRow[]>([]);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);

  function humanError(e: any) {
    const msg = String(e?.message ?? e ?? "");
    if (msg.includes("at most 500")) return "Краткое описание должно быть не длиннее 500 символов.";
    return msg || "Ошибка";
  }

  useEffect(() => {
    apiFetch<{ categories: CategoryDto[] }>("/admin/categories")
      .then((r) => setCategories(r.categories))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    apiFetch<{ brands: BrandDto[] }>("/admin/brands")
      .then((r) => setBrands(r.brands ?? []))
      .catch(() => setBrands([]));
  }, []);

  function categoryLabel(cat: CategoryDto) {
    const parts: string[] = [cat.name];
    let cur = cat;
    const seen = new Set<string>();
    while (cur.parentId) {
      if (seen.has(cur.parentId)) break;
      seen.add(cur.parentId);
      const parent = categories.find((c) => c.id === cur.parentId);
      if (!parent) break;
      parts.unshift(parent.name);
      cur = parent;
    }
    return parts.join(" / ");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const characteristicsObj: Record<string, string> = {};
      for (const row of characteristics) {
        const k = row.key.trim();
        const v = row.value.trim();
        if (!k || !v) continue;
        characteristicsObj[k] = v;
      }
      const short = shortDescription.trim().slice(0, 500);
      const res = await apiFetch<{ product: ProductDto }>("/admin/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          price,
          isUsd,
          recommended,
          categoryId: categoryId || null,
          brandId: brandId || null,
          shortDescription: short || null,
          characteristics: Object.keys(characteristicsObj).length ? characteristicsObj : null,
          coverImageUrl: coverImageUrl || null,
          published
        })
      });
      router.replace(`/products/${res.product.id}`);
    } catch (e: any) {
      setError(humanError(e));
    } finally {
      setSaving(false);
    }
  }

  async function uploadFile(file: File) {
    setUploading(true);
    try {
      const url = await uploadImage(file, { kind: "product" });
      setCoverImageUrl(url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Новый продукт</h1>
            <Link href="/products" className="mt-1 inline-block text-sm font-semibold text-slate-700 hover:underline">
              ← Назад
            </Link>
          </div>
        </div>
        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
        ) : null}
        <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block">
            <div className="text-sm font-medium text-slate-700">Название</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Категория</div>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              required
            >
              <option value="" disabled>
                Выберите категорию…
              </option>
              {categories
                .slice()
                .sort((a, b) => categoryLabel(a).localeCompare(categoryLabel(b)))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {categoryLabel(c)}
                  </option>
                ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Бренд (опционально)</div>
            <select
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              <option value="">Без бренда</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Цена</div>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              inputMode="decimal"
              placeholder="0"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isUsd} onChange={(e) => setIsUsd(e.target.checked)} />
            Цена в USD (будет конвертироваться по курсу)
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={recommended} onChange={(e) => setRecommended(e.target.checked)} />
            Рекомендуемый товар
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Краткое описание продукта</div>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value.slice(0, 500))}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={3}
              maxLength={500}
            />
            <div className="mt-1 text-xs text-slate-500">{shortDescription.length}/500</div>
          </label>

          <div>
            <div className="text-sm font-medium text-slate-700">Характеристики</div>
            <div className="mt-2">
              <CharacteristicsEditor rows={characteristics} onChange={setCharacteristics} />
            </div>
          </div>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">URL обложки</div>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="https://..."
            />
            <div className="mt-1 text-xs text-slate-500">
              Это ссылка на изображение обложки. Можно вставить ссылку вручную или загрузить файл ниже.
            </div>
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Загрузить изображение</div>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={uploading}
              className="mt-1 block w-full text-sm"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFile(f).catch(() => null);
              }}
            />
            <div className="mt-1 text-xs text-slate-500">
              {uploading ? "Загрузка..." : "После загрузки URL автоматически подставится в поле выше."}
            </div>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Опубликован
          </label>

          <button
            disabled={saving}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
          >
            {saving ? "Сохранение..." : "Создать"}
          </button>
        </form>
      </div>
    </AuthGate>
  );
}

