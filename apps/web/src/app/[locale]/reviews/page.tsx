import type { Metadata } from "next";
import { ReviewsSection, type Review } from "@/components/ReviewsSection";
import { ReviewForm } from "@/components/ReviewForm";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

type ApiReview = { id: string; rating: number; authorName: string | null; text: string | null; serviceKey: string | null; createdAt: string };
type ApiResp = { avg: number; count: number; items: ApiReview[] };

const UI: Record<string, { title: string; subtitle: string; sectionTitle: string; empty: string; crumbHome: string; googleCta: string }> = {
  ru: { title: "Отзывы клиентов", subtitle: "Оцените нашу работу и почитайте, что говорят клиенты о SAT Solutions.", sectionTitle: "Что говорят клиенты", empty: "Пока нет отзывов — станьте первым, оценив нашу работу выше.", crumbHome: "Главная", googleCta: "Оценить нас на Google Картах" },
  uz: { title: "Mijozlar sharhlari", subtitle: "Ishimizni baholang va SAT Solutions haqida mijozlar nima deyishini o'qing.", sectionTitle: "Mijozlar nima deydi", empty: "Hozircha sharhlar yo'q — birinchi bo'lib ishimizni yuqorida baholang.", crumbHome: "Bosh sahifa", googleCta: "Google Xaritada baholang" },
  en: { title: "Customer reviews", subtitle: "Rate our work and see what clients say about SAT Solutions.", sectionTitle: "What clients say", empty: "No reviews yet — be the first by rating our work above.", crumbHome: "Home", googleCta: "Rate us on Google Maps" },
  tr: { title: "Müşteri yorumları", subtitle: "Çalışmamızı değerlendirin ve müşterilerin SAT Solutions hakkında ne söylediğini okuyun.", sectionTitle: "Müşteriler ne diyor", empty: "Henüz yorum yok — yukarıdan değerlendirerek ilk siz olun.", crumbHome: "Ana sayfa", googleCta: "Google Haritalar'da değerlendirin" },
  zh: { title: "客户评价", subtitle: "为我们的服务打分，并看看客户如何评价 SAT Solutions。", sectionTitle: "客户怎么说", empty: "暂无评价 — 欢迎在上方成为第一位评价者。", crumbHome: "首页", googleCta: "在谷歌地图上评价我们" },
};

const BASED_ON: Record<string, (n: number) => string> = {
  ru: (n) => `на основе ${n} отзывов`,
  uz: (n) => `${n} ta sharh asosida`,
  en: (n) => `based on ${n} reviews`,
  tr: (n) => `${n} yoruma göre`,
  zh: (n) => `基于 ${n} 条评价`,
};
const GOOGLE_REVIEW_URL = "https://g.page/r/CekxZiczSJPYEBM/review";

function apiBase() {
  if (typeof window === "undefined") return process.env.API_INTERNAL_URL ?? "http://localhost:4005";
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4005";
}

const MONTHS: Record<string, string[]> = {
  ru: ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"],
  uz: ["yanvar","fevral","mart","aprel","may","iyun","iyul","avgust","sentabr","oktabr","noyabr","dekabr"],
  en: ["January","February","March","April","May","June","July","August","September","October","November","December"],
  tr: ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"],
  zh: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
};
function fmtDate(iso: string, locale = "ru"): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const m = (MONTHS[locale] ?? MONTHS.ru)[d.getMonth()];
  return locale === "zh" ? `${d.getFullYear()}年${m}` : `${m} ${d.getFullYear()}`;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  return {
    title: { absolute: `${ui.title} — SAT Solutions` },
    description: ui.subtitle,
    alternates: hreflangAlternates("/reviews", locale),
    openGraph: { title: ui.title, description: ui.subtitle, locale: ogLocale(locale), images: ["/og.png"] },
    // Тестовая страница: не индексируем, пока не наполнится реальными отзывами
    robots: { index: false, follow: true },
  };
}

export default async function ReviewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;

  let data: ApiResp = { avg: 0, count: 0, items: [] };
  try {
    const r = await fetch(`${apiBase()}/reviews`, { next: { revalidate: 60 } });
    if (r.ok) data = (await r.json()) as ApiResp;
  } catch {
    /* API недоступен — покажем пустое состояние */
  }

  const items: Review[] = data.items.map((r) => ({
    name: r.authorName?.trim() || "Клиент",
    rating: r.rating,
    date: fmtDate(r.createdAt, locale),
    text: r.text?.trim() || "",
  }));

  return (
    <div className="bg-white">
      <div className="container-page py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{ui.title}</h1>
        <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-600">{ui.subtitle}</p>

        <div className="mt-8 max-w-xl">
          <ReviewForm locale={locale} />
          <a
            href={GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800 transition-colors hover:bg-amber-100"
          >
            <span aria-hidden>⭐</span>
            {ui.googleCta}
          </a>
        </div>
      </div>

      {items.length > 0 ? (
        <ReviewsSection title={ui.sectionTitle} avg={data.avg} count={data.count} items={items} basedOn={BASED_ON[locale]?.(data.count) ?? BASED_ON.ru(data.count)} />
      ) : (
        <div className="container-page pb-16">
          <p className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-6 text-slate-500">{ui.empty}</p>
        </div>
      )}
    </div>
  );
}
