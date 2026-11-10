import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { installPrices, packageRange, turnkeyFrom, fmtSum } from "@/lib/installPrices";

/**
 * «Сколько стоит установка … в Ташкенте» — раздел на страницах видеонаблюдения, домофонов,
 * замков, СКУД и пожарной сигнализации (22.09.2026, по разбору посадочных Google Ads).
 * Расценки на работы и ориентиры считаются из calcPricing — те же цифры, что в калькуляторе;
 * оборудование — минимальные цены каталога (installPrices.ts). Тексты — namespace installPrices.
 */
export async function ServiceInstallPrices({ k, locale }: { k: string; locale: string }) {
  const data = installPrices(k);
  if (!data) return null;
  const t = await getTranslations({ locale, namespace: "installPrices" });
  const title = t(`title.${k}`);
  const pkgs = data.pkgs.map((p) => ({ k: p.k, ...packageRange(p) }));
  const turnkey = (data.turnkey ?? []).map((x) => ({ k: x.k, from: turnkeyFrom(x) }));

  return (
    <section className="mt-12" aria-labelledby={`install-prices-${k}`}>
      <p className="text-xs font-black uppercase tracking-widest text-brand-700">{t("label")}</p>
      <h2 id={`install-prices-${k}`} className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{t("lead")}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        {/* Расценки на работы */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-black text-slate-900">{t("worksTitle")}</div>
          <table className="w-full text-sm">
            <tbody>
              {data.works.map((w) => (
                <tr key={w.k} className="border-b border-slate-100 last:border-0">
                  <td className="px-5 py-2.5 text-slate-700">{t(`work.${w.k}`)}</td>
                  <td className="whitespace-nowrap px-5 py-2.5 text-right font-black tabular-nums text-slate-900">
                    {fmtSum(w.price, locale)}
                    <span className="ml-1 text-xs font-semibold text-slate-500">{t(`per.${w.per}`)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Оборудование из каталога */}
        <div className="overflow-hidden rounded-2xl border border-brand-200 bg-brand-50/60">
          <div className="border-b border-brand-200 px-5 py-3 text-sm font-black text-slate-900">{t("equipTitle")}</div>
          <ul>
            {data.equip.map((e) => (
              <li key={e.k} className="border-b border-brand-200/70 last:border-0">
                <Link href={e.href} className="flex items-center justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-brand-100/60">
                  <span className="text-sm text-slate-700">{t(`equip.${e.k}`)}</span>
                  <span className="whitespace-nowrap text-sm font-black tabular-nums text-slate-900">{t("from") ? `${t("from")} ` : ""}{fmtSum(e.price, locale)}{t("fromSuffix")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="px-5 py-3 text-xs leading-relaxed text-slate-500">{t("equipNote")}</p>
        </div>
      </div>

      {/* Ориентир по работам для типовых объектов */}
      <div className="mt-6">
        <div className="text-sm font-black text-slate-900">{t("pkgTitle")}</div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {pkgs.map((p) => (
            <div key={p.k} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="text-[13px] font-semibold leading-snug text-slate-600">{t(`pkg.${p.k}`)}</div>
              <div className="mt-2 text-base font-black tabular-nums text-slate-900">{fmtSum(p.low, locale)} – {fmtSum(p.high, locale)}</div>
              <div className="mt-0.5 text-xs text-slate-500">{t("pkgUnit")}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Под ключ: оборудование + монтаж (10.11.2026) */}
      {turnkey.length ? (
        <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
          <div className="text-sm font-black text-slate-900">{t("turnkeyTitle")}</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {turnkey.map((x) => (
              <div key={x.k} className="rounded-xl border border-brand-200 bg-white p-4">
                <div className="text-[13px] font-semibold leading-snug text-slate-600">{t(`turnkey.${x.k}`)}</div>
                <div className="mt-2 text-lg font-black tabular-nums text-slate-900">{t("from") ? `${t("from")} ` : ""}{fmtSum(x.from, locale)}{t("fromSuffix")}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-500">{t("turnkeyNote")}</p>
        </div>
      ) : null}
      <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600">
        {t("note")}{" "}
        <Link href="/calculator" className="font-semibold text-brand-700 underline-offset-2 hover:underline">{t("calcLink")}</Link>
      </p>
    </section>
  );
}
