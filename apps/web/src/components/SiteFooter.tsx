"use client";

import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { getSitePage } from "@/lib/api";
import { SocialLinks } from "@/components/SocialLinks";
import { resolveImageUrl } from "@/lib/image";
import { contactGeo } from "@/lib/geo";
import { SatLogo } from "@/components/SatLogo";
import { localizeAddress } from "@/lib/contentI18n";

function pick(data: any, key: string) {
  return typeof data?.[key] === "string" ? (data[key] as string) : null;
}

export function SiteFooter() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [data, setData] = useState<{
    phone: string | null;
    email: string | null;
    address: string | null;
    geoUrl: string | null;
    geoWidgetSrc: string | null;
    geoHref: string | null;
    tagline: string;
    instagramUrl: string | null;
    telegramUrl: string | null;
    facebookUrl: string | null;
    logoImg: string | null;
  }>({
    phone: null,
    email: null,
    address: null,
    geoUrl: null,
    geoWidgetSrc: null,
    geoHref: null,
    tagline: "CCTV, контроль доступа и smart‑решения безопасности.",
    instagramUrl: null,
    telegramUrl: null,
    facebookUrl: null,
    logoImg: null,
  });

  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [{ page: contact }, { page: site }, { page: about }] = await Promise.all([
          getSitePage("contact"),
          getSitePage("site"),
          getSitePage("about")
        ]);
        const phone = pick(contact.data, "phone");
        const email = pick(contact.data, "email");
        const address = pick(contact.data, "address");
        const geoUrl = pick(contact.data, "geoUrl");
        const geo = contactGeo(contact.data);
        const taglineValue = pick(site.data, "heroSubtitle");
        const instagramUrl = typeof site.data?.social?.instagram === "string" ? site.data.social.instagram : null;
        const telegramUrl = typeof site.data?.social?.telegram === "string" ? site.data.social.telegram : null;
        const facebookUrl = typeof site.data?.social?.facebook === "string" ? site.data.social.facebook : null;
        const logoUrl = typeof about.data?.logoImageUrl === "string" ? about.data.logoImageUrl : null;

        setData({
          phone,
          email,
          address,
          geoUrl,
          geoWidgetSrc: geo.widgetSrc,
          geoHref: geo.href,
          tagline: taglineValue && taglineValue.trim() ? taglineValue.trim() : data.tagline,
          instagramUrl,
          telegramUrl,
          facebookUrl,
          logoImg: logoUrl ? resolveImageUrl(logoUrl) : null,
        });
      } catch {
        // ignore
      }
    }
    fetchData();
  }, []);

  return (
    <footer className="border-t border-slate-300 bg-white" id="site-footer">
      <div className="container-page py-5">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:items-start">
          <div>
            <SatLogo size="md" />
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">{t("tagline")}</p>
            <div className="mt-4">
              <SocialLinks
                instagramUrl={data.instagramUrl}
                telegramUrl={data.telegramUrl}
                facebookUrl={data.facebookUrl}
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
              <li><Link href="/catalog" className="hover:text-brand-700">{tn("catalog")}</Link></li>
              <li><Link href="/portfolio" className="hover:text-brand-700">{tn("portfolio")}</Link></li>
              <li><Link href="/blog" className="hover:text-brand-700">{({ ru: "Блог", uz: "Blog", en: "Blog", tr: "Blog", zh: "博客" } as Record<string, string>)[locale] ?? "Блог"}</Link></li>
              <li><Link href="/about" className="hover:text-brand-700">{tn("about")}</Link></li>
              <li><Link href="/delivery" className="hover:text-brand-700">{t("delivery")}</Link></li>
              <li><Link href="/returns" className="hover:text-brand-700">{t("returns")}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-700">{tc("contacts")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-950">{tc("contacts")}</div>
            <div className="mt-3 text-sm font-semibold text-slate-800">
              <div className="flex flex-col gap-y-3">
                {data.phone ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">{t("phone")}</div>
                    <a href={`tel:${data.phone.replace(/[^+\d]/g, "")}`} className="mt-1 block font-bold text-slate-950 hover:text-brand-700">{data.phone}</a>
                  </div>
                ) : null}
                {data.email ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">Email</div>
                    <a href={`mailto:${data.email}`} className="mt-1 block text-slate-950 hover:text-brand-700">{data.email}</a>
                  </div>
                ) : null}
                {data.address ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">{t("address")}</div>
                    <div className="mt-1 text-slate-700 leading-tight">{localizeAddress(data.address, locale)}</div>
                  </div>
                ) : null}
                {data.geoUrl && data.geoHref ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">{t("geo")}</div>
                    <div className="mt-1">
                      <a href={data.geoHref} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 hover:underline">
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
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white relative min-h-[140px] sm:min-h-[200px] flex items-center justify-center group">
              {data.geoWidgetSrc ? (
                <>
                  {!showMap ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                      <div className="mb-3 text-xs text-slate-700">{t("loadMap")}</div>
                      <button
                        onClick={() => setShowMap(true)}
                        className="btn-primary !bg-brand-700 hover:!bg-brand-800 !px-4 !py-2 !text-xs"
                      >
                        {t("map")}
                      </button>
                    </div>
                  ) : (
                    <iframe
                      title="Карта"
                      src={data.geoWidgetSrc}
                      className="h-44 w-full min-h-[140px] sm:h-52 z-0"
                      loading="lazy"
                      sandbox="allow-scripts allow-same-origin allow-popups"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </>
              ) : (
                <div className="p-4 text-sm text-slate-700">{t("geoNotSet")}</div>
              )}
            </div>
            {/* Google review CTA — рычаг локального SEO: отзывы в GBP дают ⭐ в Картах/local pack.
               g.page/r/…/review открывает сразу диалог написания отзыва (из GBP-дашборда). */}
            <a
              href="https://g.page/r/CekxZiczSJPYEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 transition-colors hover:bg-amber-100"
            >
              <span aria-hidden>⭐</span>
              {({ ru: "Оценить нас на Google Картах", uz: "Google Xaritada baholang", en: "Rate us on Google Maps", tr: "Google Haritalar'da değerlendirin", zh: "在 Google 地图上评价我们" } as Record<string, string>)[locale] ?? "Оценить нас на Google Картах"}
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

