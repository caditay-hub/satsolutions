"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getSitePage } from "@/lib/api";
import { SocialLinks } from "@/components/SocialLinks";
import { resolveImageUrl } from "@/lib/image";
import { contactGeo } from "@/lib/geo";

function pick(data: any, key: string) {
  return typeof data?.[key] === "string" ? (data[key] as string) : null;
}

export function SiteFooter() {
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
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              {data.logoImg ? (
                <span className="inline-flex h-[50px] w-[110px] items-center justify-center rounded-lg bg-white">
                  <Image alt="Логотип" src={data.logoImg} width={110} height={50} className="h-full w-full rounded-lg object-contain" />
                </span>
              ) : (
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-sm font-semibold text-white">S</div>
              )}
              <div>
                <div className="text-sm font-semibold text-slate-950" suppressHydrationWarning>SAT Solutions</div>
                <div className="text-xs font-bold text-slate-700" suppressHydrationWarning>Системы видеонаблюдения и безопасности</div>
              </div>
            </div>
            <p className="mt-4 max-w-prose text-sm font-medium text-slate-800">{data.tagline}</p>
            <div className="mt-4">
              <SocialLinks
                instagramUrl={data.instagramUrl}
                telegramUrl={data.telegramUrl}
                facebookUrl={data.facebookUrl}
              />
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-sm font-bold text-slate-950">Разделы</div>
            <ul className="mt-3 grid grid-cols-3 gap-x-6 gap-y-2 text-sm font-semibold text-slate-800 lg:grid-cols-2">
              <li><Link href="/" className="hover:text-brand-700">Главная</Link></li>
              <li><Link href="/categories" className="hover:text-brand-700">Категории</Link></li>
              <li><Link href="/products" className="hover:text-brand-700">Продукты</Link></li>
              <li><Link href="/solutions" className="hover:text-brand-700">Решения</Link></li>
              <li><Link href="/portfolio" className="hover:text-brand-700">Портфолио</Link></li>
              <li><Link href="/news" className="hover:text-brand-700">Новости</Link></li>
              <li><Link href="/about" className="hover:text-brand-700">О компании</Link></li>
              <li><Link href="/partners" className="hover:text-brand-700">Партнеры</Link></li>
              <li><Link href="/contact" className="hover:text-brand-700">Контакты</Link></li>
              <li><Link href="/cart" className="hover:text-brand-700">Корзина</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="text-sm font-bold text-slate-950">Контакты</div>
            <div className="mt-3 text-sm font-semibold text-slate-800">
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-[700px] sm:max-w-full sm:flex sm:flex-col sm:space-y-3 sm:gap-0">
                {data.phone ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">Телефон</div>
                    <div className="mt-1 text-slate-950">{data.phone}</div>
                  </div>
                ) : null}
                {data.email ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">Email</div>
                    <div className="mt-1 text-slate-950">{data.email}</div>
                  </div>
                ) : null}
                {data.address ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">Адрес</div>
                    <div className="mt-1 text-slate-700 leading-tight">{data.address}</div>
                  </div>
                ) : null}
                {data.geoUrl && data.geoHref ? (
                  <div>
                    <div className="text-xs font-black uppercase tracking-wide text-brand-700">Геолокация</div>
                    <div className="mt-1">
                      <a href={data.geoHref} target="_blank" rel="noopener noreferrer" className="font-bold text-brand-700 hover:underline">
                        Открыть на карте →
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="text-sm font-semibold text-slate-900">Карта</div>
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-white relative min-h-[140px] sm:min-h-[200px] flex items-center justify-center group">
              {data.geoWidgetSrc ? (
                <>
                  {!showMap ? (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-4 text-center">
                      <div className="mb-3 text-xs text-slate-700">Нажмите, чтобы загрузить карту (Яндекс.Карты могут использовать cookies)</div>
                      <button
                        onClick={() => setShowMap(true)}
                        className="btn-primary !bg-brand-700 hover:!bg-brand-800 !px-4 !py-2 !text-xs"
                      >
                        Загрузить карту
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
                <div className="p-4 text-sm text-slate-700">Геолокация не настроена.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container-page flex flex-col items-center justify-center gap-1 py-5 text-center text-xs font-bold text-slate-700">
          <div>© 2026 SAT Solutions. Все права защищены.</div>
          <div>ООО &quot;SUPPLY AND TRANSPORTATION&quot;</div>
        </div>
      </div>
    </footer>
  );
}

