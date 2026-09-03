import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPortfolioBySlug, getPortfolioCategories, getProductBySlug, getSitePage } from "@/lib/api";
import { ProductCard } from "@/components/Cards";
import { portfolioLinks } from "@/lib/portfolioLinks";
import { serviceByKey } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { localizeProductName } from "@/lib/productI18n";
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

// Подписи блоков перелинковки (кейс → каталог и услуги). Отдельный словарь, а не
// messages/*.json: строки нужны только здесь и в 5 локалях сразу.
const LINK_UI: Record<string, { equipment: string; equipmentHint: string; services: string; all: string }> = {
  ru: { equipment: "Оборудование на объекте", equipmentHint: "Позиции того же класса, что применялись на проекте — с актуальными ценами.", services: "Услуги по этому направлению", all: "Весь каталог" },
  uz: { equipment: "Obyektdagi uskunalar", equipmentHint: "Loyihada qo‘llanilgan turdagi pozitsiyalar — dolzarb narxlar bilan.", services: "Ushbu yo‘nalish bo‘yicha xizmatlar", all: "Butun katalog" },
  en: { equipment: "Equipment used on site", equipmentHint: "Same-class items as installed on this project, with current prices.", services: "Related services", all: "Full catalogue" },
  tr: { equipment: "Sahada kullanılan ekipman", equipmentHint: "Projede kullanılanla aynı sınıftaki ürünler, güncel fiyatlarla.", services: "İlgili hizmetler", all: "Tüm katalog" },
  zh: { equipment: "项目所用设备", equipmentHint: "与本项目同类的产品，价格为最新价。", services: "相关服务", all: "全部产品" },
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
    // RU: приоритет seoTitle/seoDescription из БД (заточены под поисковые запросы);
    // остальные локали — локализованный title/excerpt (переводы seo-полей нет).
    const title = (locale === "ru" && rawItem.seoTitle) || item.title;
    const description = (locale === "ru" && rawItem.seoDescription) || item.excerpt || item.title;
    const img = resolveImageUrl(item.coverImageUrl);
    return {
      title,
      description,
      alternates: hreflangAlternates(`/portfolio/${item.slug}`, locale),
      openGraph: { title, description, ...(img ? { images: [{ url: img }] } : {}) }
    };
  } catch {
    return { title: t("projectFallback") };
  }
}

export default async function PortfolioDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  try {
    const { locale, slug } = await params;
    const t = await getTranslations("portfolio");
    const tnav = await getTranslations("nav");
    const dateLocale = DATE_LOCALE[locale] ?? "ru-RU";
    const [{ item: rawItem }, { categories }] = await Promise.all([
      getPortfolioBySlug(slug),
      getPortfolioCategories().catch(() => ({ categories: [] }))
    ]);
    const item = localizePortfolioProject(rawItem, locale);
    const img = resolveImageUrl(item.coverImageUrl);
    const works = item.items ?? [];
    const gallery = (item.galleryImageUrls ?? []).map((u) => resolveImageUrl(u)).filter(Boolean) as string[];

    // Перелинковка кейса: оборудование того же класса + профильные услуги/отрасли.
    // Кейсы — доверенные страницы, отсюда вес идёт на коммерческие разделы.
    const links = portfolioLinks(slug);
    const linkUi = LINK_UI[locale] ?? LINK_UI.ru;
    let caseProducts: Awaited<ReturnType<typeof getProductBySlug>>["product"][] = [];
    let usdToUzs = 1;
    if (links?.products.length) {
      const loaded = await Promise.all(
        links.products.map((s) => getProductBySlug(s).then((r) => r.product).catch(() => null))
      );
      caseProducts = loaded.filter(Boolean) as typeof caseProducts;
      if (caseProducts.some((p: any) => p?.isUsd)) {
        try {
          const { page } = await getSitePage("site");
          const v = (page.data as any)?.usdToUzs;
          const n = typeof v === "number" ? v : Number(v);
          if (Number.isFinite(n) && n > 0) usdToUzs = n;
        } catch {
          // курс не критичен: карточка отрисуется по цене из БД
        }
      }
    }
    const caseServices = (links?.services ?? [])
      .filter((k) => serviceByKey[k])
      .map((k) => ({ key: k, label: getServiceSeo(locale, k)?.h1 ?? serviceByKey[k].title }));
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

    // JSON-LD: Article (кейс) + BreadcrumbList — кейсы должны ранжироваться по
    // запросам вида «бодикамеры», «установка видеостены», «монтаж серверной»
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
    const lp = locale !== "ru" ? `/${locale}` : "";
    const articleLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: item.title,
      description: item.excerpt ?? undefined,
      image: img ?? undefined,
      datePublished: item.publishedAt ?? item.createdAt,
      dateModified: item.updatedAt,
      author: { "@type": "Organization", name: "SAT Solutions", url: siteUrl },
      publisher: { "@type": "Organization", name: "SAT Solutions", logo: { "@type": "ImageObject", url: `${siteUrl}/logo.png` } },
      mainEntityOfPage: `${siteUrl}${lp}/portfolio/${item.slug}`,
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: tnav("home"), item: `${siteUrl}${lp}/` },
        { "@type": "ListItem", position: 2, name: t("title"), item: `${siteUrl}${lp}/portfolio` },
        { "@type": "ListItem", position: 3, name: item.title },
      ],
    };
    return (
      <div className="container-page py-6 sm:py-10">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
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

        {/* Состав решения — мини-спецификация кейса (equipmentSupply): то, что ЛПР
            пересылает подрядчику. Многострочное поле → маркированный список. */}
        {(item as any).equipmentSupply?.trim() ? (
          <div className="mt-10 max-w-4xl rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="text-lg font-bold tracking-tight text-slate-950">
              {({ ru: "Состав решения", uz: "Yechim tarkibi", en: "Solution stack", tr: "Çözüm bileşenleri", zh: "方案构成" } as Record<string, string>)[locale] ?? "Состав решения"}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {String((item as any).equipmentSupply).split(/\n+/).map((l: string) => l.trim()).filter(Boolean).map((l: string) => (
                <li key={l} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                  {l}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {works.length || gallery.length ? <PortfolioWorksAccordion works={works} images={gallery} /> : null}

        {caseProducts.length > 0 && (
          <section className="mt-12 border-t border-slate-200 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950">{linkUi.equipment}</h2>
                <p className="mt-1.5 max-w-2xl text-sm text-slate-600">{linkUi.equipmentHint}</p>
              </div>
              <Link
                href="/products"
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                {linkUi.all} →
              </Link>
            </div>
            <div className="mt-5 grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {caseProducts.map((p: any) => (
                <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} name={localizeProductName(p, locale)} />
              ))}
            </div>
          </section>
        )}

        {caseServices.length > 0 && (
          <section className="mt-10 border-t border-slate-200 pt-6">
            <p className="text-xs font-black uppercase tracking-widest text-brand-600">{linkUi.services}</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {caseServices.map((s) => (
                <Link
                  key={s.key}
                  href={`/solutions/${s.key}`}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch {
    notFound();
  }
}
