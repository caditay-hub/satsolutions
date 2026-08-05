import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { articlesForLocale, articleImg } from "@/lib/articlesData";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

// UI-строки блога (инлайн, чтобы не раздувать 5 message-файлов; контент статей — ru/uz)
const UI: Record<string, { title: string; h1: string; metaTitle: string; subtitle: string; read: string; empty: string; crumbHome: string }> = {
  ru: { title: "Блог", h1: "Блог о видеонаблюдении, СКУД и пожарной безопасности", metaTitle: "Блог о видеонаблюдении, СКУД и пожарной сигнализации — статьи SAT Solutions", subtitle: "Полезные статьи о видеонаблюдении, СКУД, пожарной сигнализации и безопасности — как выбрать, сколько стоит и на что смотреть.", read: "Читать", empty: "Материалы скоро появятся.", crumbHome: "Главная" },
  uz: { title: "Blog", h1: "Videokuzatuv, SKUD va yong'in xavfsizligi haqida blog", metaTitle: "Videokuzatuv, SKUD va yong'in signalizatsiyasi haqida blog — SAT Solutions maqolalari", subtitle: "Videokuzatuv, SKUD, yong'in signalizatsiyasi va xavfsizlik haqida foydali maqolalar — qanday tanlash, qancha turadi va nimaga e'tibor berish kerak.", read: "O'qish", empty: "Materiallar tez orada paydo bo'ladi.", crumbHome: "Bosh sahifa" },
  en: { title: "Blog", h1: "Blog on CCTV, access control and fire safety", metaTitle: "Blog on CCTV, access control and fire alarms — SAT Solutions articles", subtitle: "Useful articles on CCTV, access control, fire alarms and security — how to choose, how much it costs and what to look for.", read: "Read", empty: "Articles are coming soon.", crumbHome: "Home" },
  tr: { title: "Blog", h1: "Güvenlik, kamera ve geçiş kontrolü blogu", metaTitle: "Güvenlik, kamera ve geçiş kontrolü blogu — SAT Solutions", subtitle: "Güvenlik, kamera ve geçiş kontrolü hakkında faydalı makaleler.", read: "Oku", empty: "Makaleler yakında.", crumbHome: "Ana sayfa" },
  zh: { title: "博客", h1: "视频监控、门禁与消防安全博客", metaTitle: "视频监控、门禁与消防安全博客 — SAT Solutions", subtitle: "关于视频监控、门禁和消防安全的实用文章。", read: "阅读", empty: "文章即将推出。", crumbHome: "首页" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  return {
    title: { absolute: ui.metaTitle },
    description: ui.subtitle,
    alternates: hreflangAlternates("/blog", locale),
    openGraph: { title: ui.title, description: ui.subtitle, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function BlogListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  const articles = articlesForLocale(locale);

  return (
    <div className="bg-white">
      <div className="container-page py-8 sm:py-12">
        <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400">
          <Link href="/" className="hover:text-slate-900 transition-colors">{ui.crumbHome}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 normal-case tracking-normal">{ui.title}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{ui.h1}</h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">{ui.subtitle}</p>

        {articles.length === 0 ? (
          <p className="mt-10 text-slate-500">{ui.empty}</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => {
              const b = a.loc[locale]!;
              return (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    {/* Обложки лежат в public/blog-img/<slug>.jpg; оптимизатор Next на сайте отключён — обычный img */}
                    <img
                      src={articleImg(a.slug)}
                      alt={b.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="text-lg font-black leading-snug tracking-tight text-slate-900 group-hover:text-brand-700">{b.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{b.excerpt}</p>
                    <span className="mt-4 text-sm font-bold text-brand-600">{ui.read} →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
