import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { serviceForCategory } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { WorkTerms } from "@/components/WorkTerms";

/**
 * Перелинковка категория→услуга. Живая внутренняя ссылка с проиндексированной
 * страницы каталога (type / brand×type) на профильную страницу услуги
 * (`/solutions/<key>`), которая часто ещё не в индексе. Анкор — keyword-rich H1
 * услуги («Установка видеонаблюдения в Ташкенте») там, где есть SEO-оверлей
 * (ru/uz/en), иначе локализованное название услуги (tr/zh). Передаёт целевой
 * странице ссылочный вес и релевантный анкор → ускоряет обход и ранжирование.
 *
 * Язык в адрес подставляем сами: next/link его не знает, и до 09.10.2026 плашка на
 * uz/en/tr/zh-страницах вела на русскую услугу (544 ссылки в обходе).
 *
 * Возвращает null, если для типа нет профильной услуги — тогда ничего не рендерим.
 *
 * terms — блок «Условия работы» над ссылкой (10.10.2026): на каталожные посадочные ведёт
 * реклама («Гарантия до 3 лет», «Свой монтажный штат», «Выезд инженера сегодня»), а на самих
 * страницах этих фактов не было — конверсия /catalog/hikvision/ip-kamery 3,8 % против 10–36 %
 * на страницах услуг. Показываем только там, где у типа есть услуга монтажа.
 */
export async function CategoryServiceLink({
  typeName,
  locale,
  terms = false,
}: {
  typeName: string | null | undefined;
  locale: string;
  terms?: boolean;
}) {
  const svc = serviceForCategory(typeName);
  if (!svc) return null;
  const t = await getTranslations({ locale });
  const anchor = getServiceSeo(locale, svc.key)?.h1 ?? t(`services.${svc.key}.title`);
  return (
    <div className="container-page pb-10">
      {terms && <WorkTerms locale={locale} className="mb-8" />}
      <Link
        href={locale === "ru" ? `/solutions/${svc.key}` : `/${locale}/solutions/${svc.key}`}
        className="flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 transition-colors hover:bg-brand-50"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-xl">🛠</span>
        <span className="flex-1">
          <span className="block text-xs font-bold uppercase tracking-wider text-brand-700">{t("product.turnkey")}</span>
          <span className="block text-sm font-semibold text-slate-900">{anchor} — {t("product.designInstall")}</span>
        </span>
        <span className="shrink-0 font-bold text-brand-600">→</span>
      </Link>
    </div>
  );
}
