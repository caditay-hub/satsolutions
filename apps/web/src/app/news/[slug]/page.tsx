import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/lib/api";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { HandwriteText } from "@/components/HandwriteText";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { post } = await getNewsBySlug(slug);
    const ogImage = resolveImageUrl(post.coverImageUrl) ?? undefined;
    return {
      title: post.title,
      description: post.excerpt ?? post.title,
      alternates: { canonical: `/news/${post.slug}` },
      openGraph: {
        title: post.title,
        description: post.excerpt ?? post.title,
        images: ogImage ? [{ url: ogImage }] : undefined
      }
    };
  } catch {
    return { title: "Новость" };
  }
}

export default async function NewsDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { post } = await getNewsBySlug(slug);
    const img = resolveImageUrl(post.coverImageUrl);
    return (
      <div className="container-page py-6 sm:py-10">
        <div className="mb-4">
          <BackButton />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            {img ? (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <Image
                  alt={post.title}
                  src={img}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="flex w-full items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 py-16 text-sm text-slate-600">
                Нет изображения
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{post.title}</h1>
            {post.excerpt ? (
              <div className="mt-3 text-slate-600">
                <HandwriteText
                  text={post.excerpt}
                  maxChars={10000}
                  speedMs={8}
                  reserveFinalHeight
                  className="text-slate-600"
                  textClassName="font-sans text-base leading-relaxed"
                />
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-10 max-w-4xl">
          {post.content ? (
            <div className="prose prose-slate max-w-none">
              <p>{post.content}</p>
            </div>
          ) : null}
        </div>
      </div>
    );
  } catch {
    notFound();
  }
}

