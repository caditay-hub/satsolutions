import type { Viewport } from "next";
import { Caveat, Jura } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { ClientProviders } from "@/components/ClientProviders";
import { createMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

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

export const metadata = createMetadata();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: "UZ",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+998-XX-XXX-XX-XX",
      contactType: "customer service",
    },
  };

  return (
    <html lang="ru" className={`${caveat.variable} ${jura.variable} scroll-smooth`} suppressHydrationWarning>
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
          html { -webkit-text-size-adjust:100%; scroll-behavior:smooth; background:#fff; }
          body {
            margin:0; font-family: var(--font-jura); font-weight: 600;
            line-height: 1.5; color: #000000; background:#fff;
            overflow-x: hidden; display: flex; flex-direction: column; min-height: 100vh;
          }
          .font-main { font-family: var(--font-jura); }
          .font-handwrite { font-family: var(--font-caveat); }
          .container-page { margin: 0 auto; width: 100%; max-width: 90vw; padding: 20px 1rem; }
          @media (min-width: 1024px) { .container-page { max-width: 80vw; } }
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
        <meta name="language" content="Russian" />
        <meta name="geo.region" content="UZ" />
        <meta name="geo.placename" content="Tashkent" />
        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-main bg-white text-slate-950 antialiased">
        <ClientProviders>
          <SiteHeader />
          <main className="flex-1">{children}</main>
        </ClientProviders>
      </body>
    </html>
  );
}
