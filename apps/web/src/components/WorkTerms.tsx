import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * «Условия работы» — единый блок фактов о компании на страницах услуг и отраслей.
 * Появился 22.09.2026 по итогам разбора посадочных Google Ads: объявления обещали
 * гарантию до 3 лет, свой штат, выезд в день обращения, договор с НДС и лицензии,
 * а на страницах этого не было написано. Факты согласованы с владельцем 22.09.2026:
 * гарантия 3 года на работы и 1–3 года на оборудование, 3 инженера и 15 монтажников
 * в штате, лицензии Нацгвардии № 1554491 и МЧС № 913518 (они же на странице «О компании»).
 * Тексты — namespace `workTerms` в messages/*.json, пять языков.
 */
const ICON = {
  className: "w-6 h-6",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

const Shield = () => (<svg {...ICON}><path d="M12 3l7.5 3v5.2c0 4.6-3.1 7.9-7.5 9.3-4.4-1.4-7.5-4.7-7.5-9.3V6z" /><path d="M9 12l2.2 2.2L15.4 10" /></svg>);
const Team = () => (<svg {...ICON}><circle cx="9" cy="8" r="3.1" /><path d="M3.5 19.5v-1.2A4.3 4.3 0 0 1 7.8 14h2.4a4.3 4.3 0 0 1 4.3 4.3v1.2" /><path d="M16.5 5.2a3.1 3.1 0 0 1 0 5.9" /><path d="M18 14.2a4.3 4.3 0 0 1 2.5 3.9v1.4" /></svg>);
const Car = () => (<svg {...ICON}><path d="M4 16v-4.5l2-4.5h12l2 4.5V16" /><path d="M4 16h16" /><circle cx="7.5" cy="16.5" r="1.8" /><circle cx="16.5" cy="16.5" r="1.8" /><path d="M6 11.5h12" /></svg>);
const Calc = () => (<svg {...ICON}><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M8.5 7h7" /><path d="M8.5 11h2M13.5 11h2M8.5 14.5h2M13.5 14.5h2M8.5 18h2M13.5 18h2" /></svg>);
const Docs = () => (<svg {...ICON}><path d="M8 3h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" /><path d="M14 3v4h4" /><path d="M9.5 12.5h5M9.5 16h5" /></svg>);
const Stamp = () => (<svg {...ICON}><circle cx="12" cy="9" r="5.2" /><path d="m9 13.4-1.3 6.1 4.3-2.2 4.3 2.2-1.3-6.1" /><path d="m12 6.6.9 1.9 2 .3-1.5 1.4.4 2-1.8-1-1.8 1 .4-2L9 8.8l2-.3z" /></svg>);

export async function WorkTerms({ locale, className = "" }: { locale: string; className?: string }) {
  const t = await getTranslations({ locale, namespace: "workTerms" });
  const items = [
    { Icon: Shield, k: "warranty" },
    { Icon: Team, k: "team" },
    { Icon: Car, k: "visit" },
    { Icon: Calc, k: "quote" },
    { Icon: Docs, k: "docs" },
    { Icon: Stamp, k: "license" },
  ] as const;
  return (
    <section id="terms" className={`scroll-mt-32 lg:scroll-mt-44 ${className}`} aria-labelledby="work-terms-title">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{t("label")}</p>
      <h2 id="work-terms-title" className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("title")}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ Icon, k }) => (
          <div key={k} className="rounded-2xl bg-white p-5 ring-1 ring-slate-200 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon />
            </div>
            <div className="mt-3 text-sm font-black text-slate-900">{t(`${k}T`)}</div>
            <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">
              {t(`${k}D`)}
              {k === "license" && (
                <>
                  {" "}
                  <Link href="/about" className="font-semibold text-brand-700 underline-offset-2 hover:underline">{t("licenseLink")}</Link>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
