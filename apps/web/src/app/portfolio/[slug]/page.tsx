import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioBySlug } from "@/lib/api";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { HandwriteText } from "@/components/HandwriteText";
import { PortfolioWorksAccordion } from "@/components/PortfolioWorksAccordion";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { item } = await getPortfolioBySlug(slug);
    return {
      title: item.title,
      description: item.excerpt ?? item.title,
      alternates: { canonical: `/portfolio/${item.slug}` }
    };
  } catch {
    return { title: "Проект" };
  }
}

export default async function PortfolioDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { item } = await getPortfolioBySlug(slug);
    const img = resolveImageUrl(item.coverImageUrl);
    const works = item.items ?? [];
    const gallery = (item.galleryImageUrls ?? []).map((u) => resolveImageUrl(u)).filter(Boolean) as string[];
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
                  alt={item.title}
                  src={img}
                  width={1600}
                  height={1200}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-auto w-full object-cover"
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
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h1>
            {item.excerpt ? (
              <div className="mt-3 text-slate-600">
                <HandwriteText
                  text={item.excerpt}
                  maxChars={10000}
                  speedMs={8}
                  reserveFinalHeight
                  className="text-slate-600"
                  textClassName="font-sans text-base leading-relaxed"
                />
              </div>
            ) : null}
            <div className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
              {item.clientName ? (
                <div>
                  <span className="font-semibold">Клиент:</span> {item.clientName}
                </div>
              ) : null}
              {item.location ? (
                <div>
                  <span className="font-semibold">Локация:</span> {item.location}
                </div>
              ) : null}
              {item.completedAt ? (
                <div>
                  <span className="font-semibold">Дата:</span> {String(item.completedAt).slice(0, 10)}
                </div>
              ) : null}
            </div>
            {item.clientTasks ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-800">Задачи заказчика</div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.clientTasks}</p>
              </div>
            ) : null}
          </div>
        </div>

        {works.length || gallery.length ? <PortfolioWorksAccordion works={works} images={gallery} /> : null}

        {item.content ? (
          <div className="mt-10 max-w-4xl">
            <div className="prose prose-slate max-w-none">
              <p>{item.content}</p>
            </div>
          </div>
        ) : null}
      </div>
    );
  } catch {
    notFound();
  }
}

