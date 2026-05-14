"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminNav } from "@/components/AdminNav";
import { AuthGate } from "@/components/AuthGate";
import { apiFetch, type PostDto } from "@/lib/api";
import { uploadImage } from "@/lib/upload";

export default function NewPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [published, setPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiFetch<{ post: PostDto }>("/admin/news", {
        method: "POST",
        body: JSON.stringify({
          title,
          excerpt: excerpt || null,
          content: content || null,
          coverImageUrl: coverImageUrl || null,
          published
        })
      });
      router.replace(`/news/${res.post.id}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AuthGate>
      <AdminNav />
      <div className="container-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Новая новость</h1>
            <Link href="/news" className="mt-1 inline-block text-sm font-semibold text-slate-700 hover:underline">
              ← Назад
            </Link>
          </div>
        </div>
        <form onSubmit={onSubmit} className="mt-6 max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6">
          <label className="block">
            <div className="text-sm font-medium text-slate-700">Заголовок</div>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Краткое описание</div>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={3}
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">Контент</div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              rows={10}
              placeholder="Текст новости..."
            />
          </label>

          <label className="block">
            <div className="text-sm font-medium text-slate-700">URL обложки</div>
            <input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="https://... или /uploads/images/..."
            />
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
                  .then((url) => setCoverImageUrl(url))
                  .finally(() => setUploading(false));
              }}
            />
            <div className="mt-1 text-xs text-slate-500">{uploading ? "Загрузка..." : "URL заполнится автоматически."}</div>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            Опубликована
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

