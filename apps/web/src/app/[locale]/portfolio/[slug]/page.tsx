import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getPortfolioCategories } from "@/lib/api";
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { PortfolioWorksAccordion } from "@/components/PortfolioWorksAccordion";
import { getTranslations } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { localizePortfolioProject, localizeCategoryName } from "@/lib/contentI18n";

const DATE_LOCALE: Record<string, string> = {
  ru: "ru-RU", uz: "uz-UZ", en: "en-US", tr: "tr-TR", zh: "zh-CN"
};

type ContentBlock = { type: "p"; text: string } | { type: "ul"; items: string[] };

function parseContent(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line) continue;
    const m = line.match(/^[—–-]\s*(.+)$/);
    if (m) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul") last.items.push(m[1]);
      else blocks.push({ type: "ul", items: [m[1]] });
    } else {
      blocks.push({ type: "p", text: line });
    }
  }
  return blocks;
}

function ProjectContent({ text }: { text: string }) {
  const blocks = parseContent(text);
  return (
    <div className="space-y-4 text-base leading-relaxed text-slate-700">
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className={b.text.endsWith(":") && blocks[i + 1]?.type === "ul" ? "font-bold text-slate-900" : undefined}>
            {b.text}
          </p>
        ) : (
          <ul key={i} className="space-y-2">
            {b.items.map((it, j) => (
              <li key={j} className="flex gap-3">
                <span className="mt-[7px] h-2 w-2 shrink-0 rounded-full bg-brand-600" aria-hidden />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        )
      )}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio" });
  try {
    const { item: rawItem } = await getPortfolioBySlug(slug);
    const item = localizePortfolioProject(rawItem, locale);
    return {
      title: item.title,
      description: item.excerpt ?? item.title,
      alternates: hreflangAlternates(`/portfolio/${item.slug}`, locale)
    };
  } catch {
    return { title: t("projectFallback") };
  }
}

export default async function PortfolioDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  try {
    const { locale, slug } = await params;
    const t = await getTranslations("portfolio");
    const dateLocale = DATE_LOCALE[locale] ?? "ru-RU";
    const [{ item: rawItem }, { categories }] = await Promise.all([
      getPortfolioBySlug(slug),
      getPortfolioCategories().catch(() => ({ categories: [] }))
    ]);
    const item = localizePortfolioProject(rawItem, locale);
    const img = resolveImageUrl(item.coverImageUrl);
    const works = item.items ?? [];
    const gallery = (item.galleryImageUrls ?? []).map((u) => resolveImageUrl(u)).filter(Boolean) as string[];
    const cat = item.portfolioCategoryId
      ? categories.find((c) => c.id === item.portfolioCategoryId)
      : undefined;
    const facts = [
      item.clientName ? { label: t("client"), value: item.clientName } : null,
      item.location ? { label: t("location"), value: item.location } : null,
      item.completedAt
        ? {
            label: t("completed"),
            value: new Date(item.completedAt).toLocaleDateString(dateLocale, { month: "long", year: "numeric" })
          }
        : null,
      cat ? { label: t("category"), value: localizeCategoryName(cat.slug, cat.name, locale) } : null
    ].filter(Boolean) as { label: string; value: string }[];
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
                {t("noImage")}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{item.title}</h1>
            {item.excerpt ? (
              <p className="mt-3 text-base leading-relaxed text-slate-600">{item.excerpt}</p>
            ) : null}
            {facts.length ? (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {facts.map((f) => (
                  <div key={f.label} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{f.label}</div>
                    <div className="mt-1 text-sm font-bold text-slate-900 first-letter:uppercase">{f.value}</div>
                  </div>
                ))}
              </div>
            ) : null}
            {item.clientTasks ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm font-semibold text-slate-800">{t("clientTasks")}</div>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{item.clientTasks}</p>
              </div>
            ) : null}
          </div>
        </div>

        {item.content ? (
          <div className="mt-10 max-w-4xl">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">{t("about")}</h2>
            <div className="mt-4">
              <ProjectContent text={item.content} />
            </div>
          </div>
        ) : null}

        {works.length || gallery.length ? <PortfolioWorksAccordion works={works} images={gallery} /> : null}
      </div>
    );
  } catch {
    notFound();
  }
}
