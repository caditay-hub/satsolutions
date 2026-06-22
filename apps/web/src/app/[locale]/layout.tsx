import type { Viewport } from "next";
import { Suspense } from "react";
import { Caveat, Jura } from "next/font/google";
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

const jura = Jura({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jura",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const caveat = Caveat({
  subsets: ["latin", "cyrillic"],
  variable: "--font-caveat",
  display: "swap",
  preload: false,
});

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
    openGraph: { description, locale: OG_LOCALE[locale] ?? "ru_RU" } as any,
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

  const tm = await getTranslations({ locale, namespace: "meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    name: site.name,
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
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998-99-554-69-69",
      email: "sales@satsolutions.uz",
      contactType: "customer service",
    },
  };

  return (
    <html lang={locale} className={`${caveat.variable} ${jura.variable}`} suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
          :root { 
            --font-jura: ${jura.style.fontFamily}, sans-serif;
            --font-caveat: ${caveat.style.fontFamily}, cursive;
            --brand-700: #1d4ed8;
            font-size: 16px; 
            font-display: swap; 
            font-weight: 600; 
          }
          @media (min-width: 1024px) { :root { font-size: 18px; } }
          *,::before,::after{box-sizing:border-box;border:0 solid}
          html { -webkit-text-size-adjust:100%; background:#fff; }
          body {
            margin:0; font-family: var(--font-jura); font-weight: 600;
            line-height: 1.5; color: #000000; background:#fff;
            overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh;
          }
          .font-main { font-family: var(--font-jura); }
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
        <link rel="dns-prefetch" href="http://localhost:4000" />
        <link rel="preconnect" href="http://localhost:4000" crossOrigin="anonymous" />
        <meta name="language" content={META_LANGUAGE[locale] ?? "Russian"} />
        <meta name="geo.region" content="UZ" />
        <meta name="geo.placename" content="Tashkent" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google tag (gtag.js) — Google Ads AW-18194158897 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-18194158897" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18194158897');`
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-main bg-white text-slate-950 antialiased">
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
