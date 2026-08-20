import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { kitsForLocale } from "@/lib/kitsData";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const UI: Record<string, { title: string; desc: string; sub: string; home: string; from: string; more: string }> = {
  ru: { title: "Готовые комплекты безопасности с ценой", desc: "Комплекты видеонаблюдения и СКУД под ключ для дома, магазина, офиса и склада: состав, цена «от» и монтаж за 1–2 дня.", sub: "Оборудование + монтаж + настройка телефона. Цена «от» — за типовой объект; точную смету считаем бесплатно за 1 день.", home: "Главная", from: "от", more: "Подробнее" },
  uz: { title: "Narxi bilan tayyor xavfsizlik to'plamlari", desc: "Uy, do'kon, ofis va ombor uchun kalit topshirish videokuzatuv va SKUD to'plamlari: tarkibi, narxi va 1–2 kunda montaj.", sub: "Uskuna + montaj + telefon sozlash. Narx — tipik obyekt uchun; aniq smeta 1 kunda, bepul.", home: "Bosh sahifa", from: "", more: "Batafsil" },
  en: { title: "Security Kits with Upfront Pricing", desc: "Turnkey CCTV and access-control kits for home, shop, office and warehouse: contents, starting price, 1–2 day installation.", sub: "Hardware + installation + phone setup. Prices are for a typical site; an exact quote is free within 1 day.", home: "Home", from: "from", more: "Details" },
  tr: { title: "Fiyatı Belli Hazır Güvenlik Setleri", desc: "Ev, mağaza, ofis ve depo için anahtar teslim kamera ve geçiş kontrol setleri: içerik, başlangıç fiyatı, 1–2 günde montaj.", sub: "Donanım + montaj + telefon kurulumu. Fiyatlar tipik tesis içindir; net teklif 1 günde ücretsiz.", home: "Ana sayfa", from: "", more: "Detay" },
  zh: { title: "明码标价的安防套装", desc: "家庭、商铺、办公室与仓库的交钥匙监控与门禁套装：清单、起价、1–2天安装。", sub: "设备＋安装＋手机设置。价格为典型场地起价；准确报价1天内免费提供。", home: "首页", from: "", more: "详情" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  return {
    title: ui.title,
    description: ui.desc,
    alternates: hreflangAlternates("/kits", locale),
    openGraph: { title: ui.title, description: ui.desc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function KitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  const kits = kitsForLocale(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: kits.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k.loc[locale].title,
      url: `${siteUrl}${lp}/kits/${k.slug}`,
    })),
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <header className="bg-slate-900">
        <div className="container-page py-10 sm:py-16">
          <nav className="mb-5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-300/80">
            <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
          </nav>
          <h1 className="max-w-3xl text-2xl sm:text-4xl font-black tracking-tight text-white">{ui.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200">{ui.sub}</p>
        </div>
      </header>

      <section className="container-page py-8 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {kits.map((k) => {
            const b = k.loc[locale];
            return (
              <Link key={k.slug} href={`/kits/${k.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-brand-300 hover:bg-white">
                <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-brand-700">{b.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{b.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-black text-white">{b.priceLabel}</span>
                  <span className="text-sm font-bold text-brand-700">{ui.more} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
