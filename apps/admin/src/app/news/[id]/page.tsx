"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type PostDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { ConfirmDialog } from "@/components/ConfirmDialog";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;

  const [post, setPost] = useState<PostDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ post: PostDto }>(`/admin/news/${id}`)
      .then((r) => setPost(r.post))
      .catch(() => null);
  }, [id]);

  async function save() {
    if (!post) return;
    setSaving(true);
    try {
      const res = await apiFetch<{ post: PostDto }>(`/admin/news/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImageUrl: post.coverImageUrl,
          published: post.published
        })
      });
      setPost(res.post);
    } finally {
      setSaving(false);
    }
  }

  async function doDelete() {
    setError(null);
    setDeleting(true);
    try {
      await apiFetch(`/admin/news/${id}`, { method: "DELETE" });
      router.replace("/news");
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
          title="Удалить новость?"
          description="Это действие нельзя отменить."
          loading={deleting}
          onClose={() => setDeleteOpen(false)}
          onConfirm={doDelete}
        />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Редактировать новость</h1>
            <p className="mt-1 text-sm text-slate-600">{post?.id ?? "…"}</p>
            <Link href="/news" className="mt-1 inline-block text-sm font-semibold text-slate-700 hover:underline">
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

        {!post ? (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">Загрузка...</div>
        ) : (
          <div className="mt-6 grid items-start gap-6 lg:grid-cols-2">
            {error ? (
              <div className="lg:col-span-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>
            ) : null}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="space-y-4">
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Заголовок</div>
                  <input
                    value={post.title}
                    onChange={(e) => setPost({ ...post, title: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Slug</div>
                  <input
                    value={post.slug}
                    onChange={(e) => setPost({ ...post, slug: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Краткое описание</div>
                  <textarea
                    value={post.excerpt ?? ""}
                    onChange={(e) => setPost({ ...post, excerpt: e.target.value || null })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    rows={3}
                  />
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">URL обложки</div>
                  <input
                    value={post.coverImageUrl ?? ""}
                    onChange={(e) => setPost({ ...post, coverImageUrl: e.target.value || null })}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                  {post.coverImageUrl && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-slate-700 mb-2">Предпросмотр изображения:</div>
                      <div className="relative w-full h-48 border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                        <img
                          src={post.coverImageUrl}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  )}
                </label>
                <label className="block">
                  <div className="text-sm font-medium text-slate-700">Загрузить обложку</div>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    disabled={uploading}
                    className="mt-1 block w-full text-sm"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      setUploading(true);
                      uploadImage(f, { kind: "news" })
                        .then((url) => setPost({ ...post, coverImageUrl: url }))
                        .finally(() => setUploading(false));
                    }}
                  />
                  <div className="mt-1 text-xs text-slate-500">{uploading ? "Загрузка..." : "URL заполнится автоматически."}</div>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={post.published} onChange={(e) => setPost({ ...post, published: e.target.checked })} />
                  Опубликована
                </label>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <label className="block">
                <div className="text-sm font-medium text-slate-700">Контент</div>
                <textarea
                  value={post.content ?? ""}
                  onChange={(e) => setPost({ ...post, content: e.target.value || null })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  rows={14}
                />
              </label>
              <div className="mt-3 text-xs text-slate-500">Позже можно добавить rich‑editor.</div>
            </div>
          </div>
        )}
      </div>
    </AuthGate>
  );
}

