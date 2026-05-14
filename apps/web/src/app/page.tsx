import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCategories, getPortfolio, getServices, getSitePage } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";
import ReactDOM from "react-dom";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import dynamic from "next/dynamic";

const ClientLogosSlider = dynamic(() => import("@/components/ClientLogosSlider").then(m => m.ClientLogosSlider), {
  ssr: true,
  loading: () => <div className="h-20 w-full animate-pulse bg-slate-50" />
});

const FeedbackForm = dynamic(() => import("@/components/FeedbackForm").then(m => m.FeedbackForm), {
  ssr: true,
  loading: () => <div className="h-64 w-full animate-pulse rounded-2xl bg-slate-50" />
});

import { HandwriteText } from "@/components/HandwriteText";

const ABOUT_FALLBACK =
  "SAT Solutions – один из ведущих лидеров на рынке IT коммуникаций, систем видеонаблюдения и безопасности, которая на протяжении длительного времени обеспечивает стабильные поставки и интеграционные решения на всей территории республики. Обладает опытной командой инженеров, осуществляющих интеграцию широкого спектра телекоммуникационного оборудования, а также…";

export const metadata: Metadata = {
  title: "Главная",
  description: "SAT Solutions — ведущий лидер в сфере систем видеонаблюдения, безопасности и IT-коммуникаций в Узбекистане. Профессиональный монтаж и поставка оборудования."
};

export default async function HomePage() {
  // During `next build` the API might be offline; don't fail prerender — just show empty blocks.
  const [{ categories }, { items: services }, { items: portfolio }, about] = await Promise.all([
    getCategories().catch(() => ({ categories: [] })),
    getServices(1, 3).catch(() => ({ items: [], total: 0 })),
    getPortfolio(1, 50).catch(() => ({ items: [], total: 0 })), // Increased limit to get all portfolios
    getSitePage("about").catch(() => ({ page: { title: "О компании", content: "" } as any }))
  ]);

  let heroSubtitle = "CCTV, контроль доступа и smart‑решения безопасности.";
  let heroSlides: HeroSlide[] = [];
  let heroBgColor: string | null = null;
  try {
    const { page } = await getSitePage("site");
    heroBgColor = (page as any)?.data?.heroBgColor || null;
    const v = (page as any)?.data?.heroSubtitle;
    if (typeof v === "string" && v.trim()) heroSubtitle = v.trim();
    const raw = (page as any)?.data?.heroSlides;
    if (Array.isArray(raw)) {
      heroSlides = raw
        .map((it: any, idx: number) => ({
          id: typeof it?.id === "string" ? it.id : String(idx + 1),
          title: typeof it?.title === "string" ? it.title : "",
          text: typeof it?.text === "string" ? it.text : "",
          imageUrl: typeof it?.imageUrl === "string" ? it.imageUrl : "",
          sortOrder: typeof it?.sortOrder === "number" ? it.sortOrder : Number(it?.sortOrder ?? 0) || 0,
          published: typeof it?.published === "boolean" ? it.published : true,
          buttons: Array.isArray(it?.buttons)
            ? it.buttons
              .map((b: any) => ({
                label: typeof b?.label === "string" ? b.label.trim() : "",
                href: typeof b?.href === "string" ? b.href.trim() : ""
              }))
              .filter((b: any) => b.label && b.href)
              .slice(0, 3)
            : []
        }))
        .filter((s: HeroSlide) => s.id && s.imageUrl);
    }
  } catch {
    // ignore
  }

  const top = categories
    .filter((c) => !c.parentId)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 3);

  /* 
     LCP optimization: 
     HeroCarousel is rendered with { ssr: true }, and its first image 
     has the 'priority' prop. This automatically handles preloading 
     the optimized image URL. Manual preload here would cause 
     double-loading of the raw image URL.
  */

  return (
    <div>
      <section
        className={`border-b-2 border-slate-300 ${heroBgColor ? "" : "bg-white"} mb-[10px]`}
        style={heroBgColor ? { backgroundColor: heroBgColor } : {}}
      >
        <div className="container-page !py-[10px] !px-0">
          <HeroCarousel slides={heroSlides} fallbackTitle="SAT Solutions" fallbackText={heroSubtitle} />
        </div>
      </section>

      <section className="container-page mt-[10px] pb-8 sm:pb-10">
        <div className="grid items-start gap-6 lg:grid-cols-2">
          <div className="h-max rounded-2xl border-2 border-slate-300 bg-slate-50 p-4 sm:p-6">
            <div className="text-sm font-semibold text-slate-900">Быстрый старт</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-900">
              <li>
                - Перейдите в{" "}
                <Link className="font-bold text-blue-800 underline hover:text-blue-900" href="/categories">
                  Категории
                </Link>
                , чтобы выбрать раздел.
              </li>
              <li>
                - Откройте{" "}
                <Link className="font-bold text-blue-800 underline hover:text-blue-900" href="/products">
                  Продукты
                </Link>{" "}
                and use the filter.
              </li>
            </ul>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <Link href="/solutions" className="rounded-xl border-2 border-slate-200 bg-white p-3 sm:p-4 hover:bg-slate-50 hover:border-brand-500">
                <div className="text-sm font-semibold text-slate-900">Решения</div>
                <div className="mt-1 text-xs text-slate-800">Открыть →</div>
              </Link>
              <Link href="/categories" className="rounded-xl border-2 border-slate-200 bg-white p-3 sm:p-4 hover:bg-slate-50 hover:border-brand-500">
                <div className="text-sm font-semibold text-slate-900">Категории</div>
                <div className="mt-1 text-xs text-slate-800">Открыть →</div>
              </Link>
              <Link href="/portfolio" className="rounded-xl border-2 border-slate-200 bg-white p-3 sm:p-4 hover:bg-slate-50 hover:border-brand-500">
                <div className="text-sm font-semibold text-slate-900">Портфолио</div>
                <div className="mt-1 text-xs text-slate-800">Открыть →</div>
              </Link>
            </div>
          </div>

          <div className="h-max min-h-[260px] rounded-2xl border-2 border-slate-300 bg-white p-4 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div className="text-sm font-semibold text-slate-900">О компании</div>
              <Link href="/about" className="text-sm font-semibold text-brand-700 hover:underline">
                Подробнее →
              </Link>
            </div>
            <div className="mt-3">
              <HandwriteText text={(about as any)?.page?.content ?? ABOUT_FALLBACK} maxChars={420} reserveFinalHeight />
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-8 sm:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4" data-aos="fade-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Решения</h2>
            <p className="mt-1 text-sm text-slate-700">Популярные направления.</p>
          </div>
          <Link href="/solutions" className="inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors">
            Все решения <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const img = resolveImageUrl(s.coverImageUrl);
            return (
              <Link
                key={s.id}
                href={`/solutions/${s.slug}`}
                className="card-interactive group flex flex-col border-2 border-slate-200 hover:border-brand-500 rounded-2xl overflow-hidden"
                data-aos="fade-up"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
                  {img ? (
                    <Image
                      alt={s.title}
                      src={img}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      quality={75}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-bold text-slate-400">Нет изображения</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="text-xl font-bold text-slate-950 line-clamp-2">{s.title}</div>
                  {s.excerpt ? <p className="mt-2 line-clamp-2 text-base font-semibold text-slate-700 leading-relaxed">{s.excerpt}</p> : null}
                  <div className="mt-auto pt-5 text-sm font-black text-brand-700 uppercase tracking-wider">Подробнее →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <ClientLogosSlider logos={portfolio} />

      <section className="container-page pb-8 sm:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4" data-aos="fade-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Портфолио</h2>
            <p className="mt-1 text-sm text-slate-700">Последние выполненные проекты.</p>
          </div>
          <Link href="/portfolio" className="inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors">
            Все проекты <span className="ml-1">→</span>
          </Link>
        </div>
        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((p) => {
            const img = resolveImageUrl(p.coverImageUrl);
            return (
              <Link
                key={p.id}
                href={`/portfolio/${p.slug}`}
                className="card-interactive group flex flex-col border-2 border-slate-200 hover:border-brand-500 rounded-2xl overflow-hidden"
                data-aos="fade-up"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-slate-100">
                  {img ? (
                    <Image
                      alt={p.title}
                      src={img}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      quality={75}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-200 text-sm font-bold text-slate-400">Нет изображения</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xl font-bold text-slate-950 line-clamp-1">{p.title}</div>
                  {p.excerpt ? <p className="mt-2 line-clamp-1 text-base font-semibold text-slate-700">{p.excerpt}</p> : null}
                  <div className="mt-5 text-sm font-black text-brand-700 uppercase tracking-wider">Сmoтреть →</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page pb-8 sm:pb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4" data-aos="fade-up">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Категории</h2>
            <p className="mt-1 text-sm text-slate-700">Основные категории из базы данных.</p>
          </div>
          <Link href="/categories" className="inline-flex items-center text-sm font-semibold text-brand-700 hover:text-brand-800 transition-colors">
            Все категории <span className="ml-1">→</span>
          </Link>
        </div>

        <div className="mt-6 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {top.map((c) => {
            const img = resolveImageUrl(c.coverImageUrl);
            return (
              <Link
                key={c.id}
                href={`/products?category=${encodeURIComponent(c.slug)}`}
                className="card-interactive group flex flex-col border-2 border-slate-200 hover:border-brand-500 rounded-2xl overflow-hidden"
                data-aos="fade-up"
              >
                <div className="relative aspect-[16/11] w-full overflow-hidden bg-white">
                  {img ? (
                    <Image
                      alt={c.name}
                      src={img}
                      fill
                      sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      quality={75}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-sm font-bold text-slate-400">Нет изображения</div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-xl font-bold text-slate-950 line-clamp-1">{c.name}</div>
                  <div className="mt-4 text-sm font-black text-brand-700 uppercase tracking-wider">Открыть →</div>
                </div>
              </Link>
            );
          })}
          {top.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-700 lg:col-span-3">
              Категорий пока нет.
            </div>
          ) : null}
        </div>
      </section>

      <section className="container-page pb-10 sm:pb-14">
        <div className="mx-auto w-full lg:w-3/5">
          <div className="mb-4 text-center" data-aos="fade-up">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Обратная связь</h2>
            <p className="mt-1 text-sm text-slate-700">Напишите нам — оператор ответит как можно быстрее.</p>
          </div>
          <FeedbackForm />
        </div>
      </section>
    </div>
  );
}

