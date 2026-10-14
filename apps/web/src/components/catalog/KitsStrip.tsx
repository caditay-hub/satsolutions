import { Link } from "@/i18n/navigation";
import { KITS } from "@/lib/kitsData";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";

// Блок «Готовые комплекты с монтажом» внутри каталога камер и регистраторов (после первого ряда
// товаров). Сюда ведёт реклама по товарным запросам («камеры hikvision», «камеры видеонаблюдения»),
// а каталог давал обращений в 3–5 раз меньше страницы услуги (Ads, 90 дней: 3–5 % против 17,8 %,
// разбор 14.10.2026). Человеку, который не готов выбрать одну камеру, — понятный следующий шаг:
// комплект «под ключ» с ценой или подбор со сметой.
const T: Record<string, { h: string; sub: string; cta: string; all: string }> = {
  ru: { h: "Готовые комплекты видеонаблюдения с монтажом", sub: "Камеры, регистратор, диск и установка — одна цена под ключ.", cta: "Подбор и смета за 1 день", all: "Все комплекты →" },
  uz: { h: "Montaji bilan tayyor videokuzatuv toʻplamlari", sub: "Kameralar, registrator, disk va oʻrnatish — toʻliq tayyor holda bitta narx.", cta: "1 kunda tanlov va smeta", all: "Barcha toʻplamlar →" },
  en: { h: "Ready-made CCTV kits with installation", sub: "Cameras, recorder, drive and installation — one turnkey price.", cta: "Selection and quote in 1 day", all: "All kits →" },
  tr: { h: "Kurulum dahil hazır kamera setleri", sub: "Kameralar, kayıt cihazı, disk ve kurulum — anahtar teslim tek fiyat.", cta: "1 günde seçim ve teklif", all: "Tüm setler →" },
  zh: { h: "含安装的监控套装", sub: "摄像机、录像机、硬盘和安装——交钥匙一口价。", cta: "1天内选型并报价", all: "全部套装 →" },
};

export function KitsStrip({ locale }: { locale: string }) {
  const t = T[locale] ?? T.ru;
  const kits = KITS.filter((k) => k.loc[locale]);
  if (!kits.length) return null;
  const cheapest = kits.reduce((a, b) => (b.priceFrom < a.priceFrom ? b : a));
  return (
    <section className="my-2 rounded-2xl border border-brand-200 bg-brand-50/60 p-4 sm:p-5" aria-label={t.h}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-black tracking-tight text-slate-900 sm:text-lg">
            {t.h} — {cheapest.loc[locale].priceLabel}
          </h2>
          <p className="mt-1 text-sm text-slate-600">{t.sub}</p>
        </div>
        <Link href="/kits" className="text-sm font-bold text-brand-700 hover:underline">{t.all}</Link>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {kits.map((k) => (
          <Link
            key={k.slug}
            href={`/kits/${k.slug}`}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-brand-300"
          >
            <span className="text-[13px] font-semibold leading-snug text-slate-800">{k.loc[locale].title}</span>
            <span className="mt-2 text-[13px] font-bold text-brand-700">{k.loc[locale].priceLabel}</span>
          </Link>
        ))}
      </div>
      <div className="mt-3">
        <RequestQuoteButton label={t.cta} variant="brand" productName="Подбор комплекта видеонаблюдения (каталог камер)" />
      </div>
    </section>
  );
}
