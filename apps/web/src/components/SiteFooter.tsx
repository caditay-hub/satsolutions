import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import { getSitePage } from "@/lib/api";
import { SocialLinks } from "@/components/SocialLinks";
import { contactGeo } from "@/lib/geo";
import { SatLogo } from "@/components/SatLogo";
import { FooterMap } from "@/components/FooterMap";
import { localizeAddress } from "@/lib/contentI18n";

function pick(data: any, key: string) {
  return typeof data?.[key] === "string" ? (data[key] as string) : null;
}

/**
 * Подвал сайта. Рендерится на сервере: раньше он грузился отдельным чанком
 * после гидратации (dynamic + ssr:false), и его сквозные ссылки — разделы,
 * телефон, адрес — не попадали в исходный HTML, то есть доставались поисковику
 * только при выполнении JavaScript. Интерактив остался один — карта.
 */
export async function SiteFooter() {
  const [t, tn, tc, locale] = await Promise.all([
    getTranslations("footer"),
    getTranslations("nav"),
    getTranslations("common"),
    getLocale(),
  ]);

  // Данные подвала берём с сервера. Ошибка API не должна ронять весь макет —
  // тогда просто не покажем контакты, а навигация и копирайт останутся.
  let phone: string | null = null, email: string | null = null, address: string | null = null;
  let geoUrl: string | null = null, geoWidgetSrc: string | null = null, geoHref: string | null = null;
  let instagramUrl: string | null = null, telegramUrl: string | null = null, facebookUrl: string | null = null;
  try {
    const [{ page: contact }, { page: site }] = await Promise.all([
      getSitePage("contact"),
      getSitePage("site"),
    ]);
    phone = pick(contact.data, "phone");
    email = pick(contact.data, "email");
    address = pick(contact.data, "address");
    geoUrl = pick(contact.data, "geoUrl");
    const geo = contactGeo(contact.data);
    geoWidgetSrc = geo.widgetSrc;
    geoHref = geo.href;
    instagramUrl = typeof site.data?.social?.instagram === "string" ? site.data.social.instagram : null;
    telegramUrl = typeof site.data?.social?.telegram === "string" ? site.data.social.telegram : null;
    facebookUrl = typeof site.data?.social?.facebook === "string" ? site.data.social.facebook : null;
  } catch {
    // ignore
  }

  const blogLabel = ({ ru: "Блог", uz: "Blog", en: "Blog", tr: "Blog", zh: "博客" } as Record<string, string>)[locale] ?? "Блог";
  const calcLabel = ({ ru: "Калькулятор стоимости", uz: "Narx kalkulyatori", en: "Cost calculator", tr: "Maliyet hesaplayıcı", zh: "费用计算器" } as Record<string, string>)[locale] ?? "Калькулятор стоимости";
  const h3cLabel = ({ ru: "Партнёр H3C", uz: "H3C hamkori", en: "H3C partner", tr: "H3C ortağı", zh: "H3C 合作伙伴" } as Record<string, string>)[locale] ?? "Партнёр H3C";
  const zktecoLabel = ({ ru: "Партнёр ZKTeco", uz: "ZKTeco hamkori", en: "ZKTeco partner", tr: "ZKTeco ortağı", zh: "ZKTeco 合作伙伴" } as Record<string, string>)[locale] ?? "Партнёр ZKTeco";
  const reviewLabel = ({ ru: "Оценить нас на Google Картах", uz: "Google Xaritada baholang", en: "Rate us on Google Maps", tr: "Google Haritalar'da değerlendirin", zh: "在 Google 地图上评价我们" } as Record<string, string>)[locale] ?? "Оценить нас на Google Картах";

  return (
    <footer className="border-t border-slate-300 bg-white" id="site-footer">
      <div className="container-page py-5">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          <div>
            <SatLogo size="md" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">{t("tagline")}</p>
            <div className="mt-4">
              <SocialLinks
                instagramUrl={instagramUrl}
                telegramUrl={telegramUrl}
                facebookUrl={facebookUrl}
                wechatId="cadi2104"
                linkedinUrl="https://www.linkedin.com/company/sat-solutions-uz"
              />
            </div>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-950">{t("sections")}</div>
            <ul className="mt-3 flex flex-col gap-2.5 text-sm font-semibold text-slate-800">
              <li><Link href="/" className="hover:text-brand-700">{tn("home")}</Link></li>
              <li><Link href="/solutions" className="hover:text-brand-700">{tn("services")}</Link></li>
              <li><Link href="/calculator" className="hover:text-brand-700">{calcLabel}</Link></li>
              <li><Link href="/catalog" className="hover:text-brand-700">{tn("catalog")}</Link></li>
              <li><Link href="/portfolio" className="hover:text-brand-700">{tn("portfolio")}</Link></li>
              <li><Link href="/blog" className="hover:text-brand-700">{blogLabel}</Link></li>
              <li><Link href="/about" className="hover:text-brand-700">{tn("about")}</Link></li>
              <li><Link href="/partners/zkteco" className="hover:text-brand-700">{zktecoLabel}</Link></li>
              <li><Link href="/partners/h3c" className="hover:text-brand-700">{h3cLabel}</Link></li>
              <li><Link href="/delivery" className="hover:text-brand-700">{t("delivery")}</Link></li>
              <li><Link href="/returns" className="hover:text-brand-700">{t("returns")}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-700">{tc("contacts")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-950">{tc("contacts")}</div>
            <div className="mt-3 text-sm font-semibold text-slate-800">
              <div className="flex flex-col gap-y-3">
                {phone ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">{t("phone")}</div>
                    <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="mt-1 block font-bold text-slate-950 hover:text-brand-700">{phone}</a>
                  </div>
                ) : null}
                {email ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">Email</div>
                    <a href={`mailto:${email}`} className="mt-1 block text-slate-950 hover:text-brand-700">{email}</a>
                  </div>
                ) : null}
                {address ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">{t("address")}</div>
                    <div className="mt-1 text-slate-700 leading-tight">{localizeAddress(address, locale)}</div>
                  </div>
                ) : null}
                {geoUrl && geoHref ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">{t("geo")}</div>
                    <div className="mt-1">
                      <a href={geoHref} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 hover:underline">
                        {tc("more")} →
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900">{t("map")}</div>
            <FooterMap
              widgetSrc={geoWidgetSrc}
              mapLabel={t("map")}
              loadLabel={t("loadMap")}
              notSetLabel={t("geoNotSet")}
            />
            {/* Google review CTA — рычаг локального SEO: отзывы в GBP дают ⭐ в Картах/local pack.
               g.page/r/…/review открывает сразу диалог написания отзыва (из GBP-дашборда). */}
            <a
              href="https://g.page/r/CekxZiczSJPYEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
            >
              <span aria-hidden>⭐</span>
              {reviewLabel}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container-page flex flex-col items-center justify-center gap-1 py-5 text-center text-xs font-bold text-slate-700">
          <div>© 2026 SAT Solutions. {t("rights")}.</div>
          <div>ООО &quot;SUPPLY AND TRANSPORTATION&quot;</div>
        </div>
      </div>
    </footer>
  );
}
