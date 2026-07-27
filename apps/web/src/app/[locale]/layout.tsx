import type { Viewport } from "next";
import { Suspense } from "react";
// ВСЕ шрифты (Jura, Inter, Caveat) — self-hosted из /public/fonts + font-display:optional
// (см. @font-face ниже). optional = нет swap-периода → сдвиг вёрстки (CLS) невозможен;
// preload критичных файлов грузит их до отрисовки. @fontsource-импорты убраны 27.07:
// они собирались с font-display:swap и давали полевой CLS 0.33 (перескок всего текста).
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

// Шрифты self-hosted из public/fonts: сборка НЕ ходит в Google Fonts.
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

  // WebSite + SearchAction: сайт-поиск в выдаче Google (sitelinks searchbox) — поиск каталога ?q=
  const webSiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SAT Solutions",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${siteUrl}/products?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        {/* Preload критичных шрифтов — грузим до отрисовки, чтобы display:optional успел показать их без сдвига.
            Caveat и *-ext не прелоадим: optional гарантирует ноль CLS, а файлы догрузятся в кэш для следующих переходов. */}
        <link rel="preload" href="/fonts/jura-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/jura-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-cyrillic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{
          __html: `
          /* Jura Variable — self-hosted, preload + display:optional (фикс CLS от font-swap).
             optional: нет swap-периода → нет сдвига; preload грузит до отрисовки. */
          @font-face {
            font-family: 'Jura Variable';
            font-style: normal;
            font-weight: 300 700;
            font-display: optional;
            src: url(/fonts/jura-cyrillic.woff2) format('woff2-variations');
            unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
          }
          @font-face {
            font-family: 'Jura Variable';
            font-style: normal;
            font-weight: 300 700;
            font-display: optional;
            src: url(/fonts/jura-latin.woff2) format('woff2-variations');
            unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          }
          /* Inter Variable (текст) и Caveat Variable (акценты) — self-hosted, display:optional
             (были @fontsource со swap → полевой CLS 0.33; optional исключает сдвиг в принципе). */
          @font-face {
            font-family: 'Inter Variable';
            font-style: normal;
            font-weight: 100 900;
            font-display: optional;
            src: url(/fonts/inter-cyrillic.woff2) format('woff2-variations');
            unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
          }
          @font-face {
            font-family: 'Inter Variable';
            font-style: normal;
            font-weight: 100 900;
            font-display: optional;
            src: url(/fonts/inter-cyrillic-ext.woff2) format('woff2-variations');
            unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
          }
          @font-face {
            font-family: 'Inter Variable';
            font-style: normal;
            font-weight: 100 900;
            font-display: optional;
            src: url(/fonts/inter-latin.woff2) format('woff2-variations');
            unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          }
          @font-face {
            font-family: 'Inter Variable';
            font-style: normal;
            font-weight: 100 900;
            font-display: optional;
            src: url(/fonts/inter-latin-ext.woff2) format('woff2-variations');
            unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          }
          @font-face {
            font-family: 'Caveat Variable';
            font-style: normal;
            font-weight: 400 700;
            font-display: optional;
            src: url(/fonts/caveat-cyrillic.woff2) format('woff2-variations');
            unicode-range: U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;
          }
          @font-face {
            font-family: 'Caveat Variable';
            font-style: normal;
            font-weight: 400 700;
            font-display: optional;
            src: url(/fonts/caveat-cyrillic-ext.woff2) format('woff2-variations');
            unicode-range: U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F;
          }
          @font-face {
            font-family: 'Caveat Variable';
            font-style: normal;
            font-weight: 400 700;
            font-display: optional;
            src: url(/fonts/caveat-latin.woff2) format('woff2-variations');
            unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
          }
          @font-face {
            font-family: 'Caveat Variable';
            font-style: normal;
            font-weight: 400 700;
            font-display: optional;
            src: url(/fonts/caveat-latin-ext.woff2) format('woff2-variations');
            unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
          }
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteLd) }}
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
