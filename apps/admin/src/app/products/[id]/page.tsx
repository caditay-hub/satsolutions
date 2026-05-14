"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type BrandDto, type CategoryDto, type ProductDto } from "@/lib/api";
import { CharacteristicsEditor, type CharacteristicRow } from "@/components/CharacteristicsEditor";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [characteristicsRows, setCharacteristicsRows] = useState<CharacteristicRow[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [brands, setBrands] = useState<BrandDto[]>([]);

  function humanError(e: any) {
    const msg = String(e?.message ?? e ?? "");
    if (msg.includes("at most 500")) return "Краткое описание должно быть не длиннее 500 символов.";
    return msg || "Ошибка";
  }

  useEffect(() => {
    apiFetch<{ product: ProductDto }>(`/admin/products/${id}`)
      .then((r) => setProduct(r.product))
      .catch(() => null);
  }, [id]);

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

  useEffect(() => {
    if (!product) return;
    const obj = product.characteristics ?? {};
    const rows = Object.entries(obj).map(([key, value]) => ({ key, value }));
    setCharacteristicsRows(rows);
  }, [product?.id]);

  async function save() {
    if (!product) return;
    setError(null);
    setSaving(true);
    try {
      const characteristicsObj: Record<string, string> = {};
      for (const row of characteristicsRows) {
        const k = row.key.trim();
        const v = row.value.trim();
        if (!k || !v) continue;
        characteristicsObj[k] = v;
      }
      const res = await apiFetch<{ product: ProductDto }>(`/admin/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: product.name,
          slug: product.slug,
          price: product.price,
          isUsd: product.isUsd ?? false,
          recommended: (product as any).recommended ?? false,
          shortDescription: (product.shortDescription ?? "").trim().slice(0, 500) || null,
          description: product.description,
          characteristics: Object.keys(characteristicsObj).length ? characteristicsObj : null,
          coverImageUrl: product.coverImageUrl,
          published: product.published,
          categoryId: product.categoryId,
          brandId: product.brandId ?? null
        })
      });
      setProduct(res.product);
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
      setProduct((p) => (p ? { ...p, coverImageUrl: url } : p));
    } finally {
      setUploading(false);
    }
  }

  async function doDelete() {
    setError(null);
    setDeleting(true);
    try {
      await apiFetch(`/admin/products/${id}`, { method: "DELETE" });
      router.replace("/products");
    } catch (e: any) {
      setError(humanError(e));
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
          title="Удалить продукт?"
          description="Это действие нельзя отменить."
          loading={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={doDelete}
        />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Редактировать продукт</h1>
            <p className="mt-1 text-sm text-slate-600">{product?.id ?? "…"}</p>
            <Link href="/products" className="mt-1 inline-block text-sm font-semibold text-slate-700 hover:underline">
              ← Назад
            </Link>
          </div>
          <div className="flex gap-2">
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

        {!product ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка...</div>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              {error ? (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
              ) : null}
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Название</div>
                  <input
                    value={product.name}
                    onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Slug</div>
                  <input
                    value={product.slug}
                    onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Категория</div>
                  <select
                    value={product.categoryId ?? ""}
                    onChange={(e) => setProduct({ ...product, categoryId: e.target.value || null })}
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
                    value={product.brandId ?? ""}
                    onChange={(e) => setProduct({ ...product, brandId: e.target.value || null })}
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
                    value={product.price}
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    inputMode="decimal"
                  />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.isUsd ?? false}
                    onChange={(e) => setProduct({ ...product, isUsd: e.target.checked })}
                  />
                  Цена в USD (будет конвертироваться по курсу)
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean((product as any).recommended)}
                    onChange={(e) => setProduct({ ...product, recommended: e.target.checked } as any)}
                  />
                  Рекомендуемый товар
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Краткое описание</div>
                  <textarea
                    value={product.shortDescription ?? ""}
                    onChange={(e) => {
                      const v = e.target.value.slice(0, 500);
                      setProduct({ ...product, shortDescription: v ? v : null });
                    }}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    rows={3}
                    maxLength={500}
                  />
                  <div className="mt-1 text-xs text-slate-500">{String(product.shortDescription ?? "").length}/500</div>
                </label>
                <div>
                  <div className="text-sm font-medium text-slate-700">Характеристики</div>
                  <div className="mt-2">
                    <CharacteristicsEditor rows={characteristicsRows} onChange={setCharacteristicsRows} />
                  </div>
                </div>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">URL обложки</div>
                  <input
                    value={product.coverImageUrl ?? ""}
                    onChange={(e) => setProduct({ ...product, coverImageUrl: e.target.value || null })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  <div className="mt-1 text-xs text-slate-500">Можно вставить ссылку вручную или загрузить файл ниже.</div>
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
                  <div className="mt-1 text-xs text-slate-500">{uploading ? "Загрузка..." : "Загрузите файл и сохраните."}</div>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={product.published}
                    onChange={(e) => setProduct({ ...product, published: e.target.checked })}
                  />
                  Опубликован
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <label className="block">
                <div className="text-sm font-medium text-slate-700">Описание</div>
                <textarea
                  value={product.description ?? ""}
                  onChange={(e) => setProduct({ ...product, description: e.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={14}
                />
              </label>
              <div className="mt-3 text-xs text-slate-500">
                Сейчас plain text. Позже можно добавить WYSIWYG редактор (TipTap/Quill).
              </div>
              
              {product.coverImageUrl && (
                <div className="mt-6">
                  <div className="text-sm font-medium text-slate-700 mb-2">Предпросмотр изображения:</div>
                  <div className="relative w-full h-48 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <img
                      src={product.coverImageUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

