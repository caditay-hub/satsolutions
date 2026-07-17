import type { Viewport } from "next";
import { Suspense } from "react";
import "@fontsource-variable/jura/wght.css";
import "@fontsource-variable/inter/wght.css";
import "@fontsource-variable/caveat/wght.css";
// Preload критичных сабсетов (заголовки Jura + тело Inter) — убирает CLS от
// font-swap на медленных сетях: шрифт приходит до отрисовки, окно подмены исчезает.
import juraCyrFont from "@fontsource-variable/jura/files/jura-cyrillic-wght-normal.woff2";
import juraLatFont from "@fontsource-variable/jura/files/jura-latin-wght-normal.woff2";
import interCyrFont from "@fontsource-variable/inter/files/inter-cyrillic-wght-normal.woff2";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import "../globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { ClientProviders } from "@/components/ClientProviders";
import { GlobalBackButton } from "@/components/GlobalBackButton";
import { ScrollManager } from "@/components/ScrollManager";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Шрифты self-hosted через @fontsource (выше): сборка НЕ ходит в Google Fonts.
// Заголовки/бренд — Jura Variable; тело/UI — Inter Variable; акценты — Caveat Variable.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

// Локали для og:locale и <meta name="language">
const OG_LOCALE: Record<string, string> = {
  ru: "ru_RU", uz: "uz_UZ", en: "en_US", tr: "tr_TR", zh: "zh_CN"
};
const META_LANGUAGE: Record<string, string> = {
  ru: "Russian", uz: "Uzbek", en: "English", tr: "Turkish", zh: "Chinese"
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tm = await getTranslations({ locale, namespace: "meta" });
  const description = tm("homeDesc");
  return createMetadata({
    description,
    openGraph: { description, siteName: "SAT Solutions", locale: OG_LOCALE[locale] ?? "ru_RU" } as any,
    twitter: { description } as any
  });
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

  const tm = await getTranslations({ locale, namespace: "meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: site.name,
    alternateName: ["SAT Solutions", "Sat Solutions", "satsolutions", "САТ Солюшнс"],
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    image: `${siteUrl}/logo.png`,
    description: tm("homeDesc"),
    telephone: "+998-99-554-69-69",
    email: "sales@satsolutions.uz",
    address: {
      "@type": "PostalAddress",
      streetAddress: "ул. Катта Дархон 5",
      addressLocality: "Ташкент",
      addressCountry: "UZ",
    },
    areaServed: { "@type": "Country", name: "Узбекистан" },
    priceRange: "$$",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "10:00",
        closes: "15:00",
      },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998-99-554-69-69",
      email: "sales@satsolutions.uz",
      contactType: "customer service",
    },
    // Профили компании — Google связывает их с сайтом (knowledge panel, бренд-выдача).
    sameAs: [
      "https://www.instagram.com/satsolutionsuz/",
      "https://www.linkedin.com/company/sat-solutions-uz",
      "https://t.me/satsolutionsuz",
      "https://yandex.ru/maps/org/161031857568",
      "https://maps.google.com/?cid=15605896518310441449",
    ],
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preload" href={juraCyrFont} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={juraLatFont} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={interCyrFont} as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
          @font-face {
            font-family: 'Inter Fallback';
            src: local('Arial');
            ascent-override: 90.44%;
            descent-override: 22.52%;
            line-gap-override: 0%;
            size-adjust: 107.12%;
          }
          @font-face {
            font-family: 'Jura Fallback';
            src: local('Arial');
            ascent-override: 90.47%;
            descent-override: 20.44%;
            line-gap-override: 0%;
            size-adjust: 106.66%;
          }
          :root {
            --font-jura: 'Jura Variable', 'Jura Fallback', sans-serif;
            --font-inter: 'Inter Variable', 'Inter Fallback', system-ui, 'PingFang SC', 'Microsoft YaHei', sans-serif;
            --font-caveat: 'Caveat Variable', cursive;
            --brand-700: #1d4ed8;
            font-size: 16px;
            font-display: swap;
            font-weight: 400;
          }
          @media (min-width: 1024px) { :root { font-size: 18px; } }
          *,::before,::after{box-sizing:border-box;border:0 solid}
          html { -webkit-text-size-adjust:100%; background:#fff; }
          body {
            margin:0; font-family: var(--font-inter); font-weight: 400;
            line-height: 1.6; color: #000000; background:#fff;
            overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh;
          }
          h1,h2,h3,h4,h5,h6 { font-family: var(--font-jura); }
          .font-main { font-family: var(--font-jura); }
          .font-body { font-family: var(--font-inter); }
          .font-handwrite { font-family: var(--font-caveat); }
          .container-page { margin: 0 auto; width: 100%; max-width: 94vw; padding: 20px 1rem; }
          @media (min-width: 1024px) { .container-page { max-width: 92vw; } }
          @media (min-width: 1536px) { .container-page { max-width: 1480px; } }
          img { display:block; max-width:100%; height:auto; }
          
          @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-33.33%); } }
          .animate-scroll { animation: scroll 40s linear infinite; width: max-content; }
          
          .btn-primary { 
            display:inline-flex; align-items:center; justify-content:center;
            border-radius:0.5rem; background:#1d4ed8; color:#fff;
            padding:0.6rem 1.2rem; font-weight:600; text-decoration:none;
          }
          main { flex: 1 0 auto; }
          [suppressHydrationWarning] { visibility: visible !important; }
        `}} />
        <link rel="dns-prefetch" href={apiBase} />
        <link rel="preconnect" href={apiBase} crossOrigin="anonymous" />
        <meta name="language" content={META_LANGUAGE[locale] ?? "Russian"} />
        <meta name="geo.region" content="UZ" />
        <meta name="geo.placename" content="Tashkent" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google tag (gtag.js) — Google Ads AW-18194158897 + GA4 G-SHQYK1BS1S (один gtag.js на оба) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18194158897" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18194158897');
gtag('config', 'G-SHQYK1BS1S');`
          }}
        />
        {/* Яндекс.Метрика 98915892 (счётчик «steel» в аккаунте cadi.tay) — вебвизор, карта кликов, точный отказ */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
ym(98915892, 'init', {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});`
          }}
        />
        <noscript>
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://mc.yandex.ru/watch/98915892" style={{ position: "absolute", left: "-9999px" }} alt="" />
          </div>
        </noscript>
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-950 antialiased">
        <NextIntlClientProvider>
          <ClientProviders>
            <Suspense fallback={null}>
              <ScrollManager />
            </Suspense>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <GlobalBackButton />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
