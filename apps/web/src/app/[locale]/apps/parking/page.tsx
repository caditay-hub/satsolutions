// SAT Parking — платная парковка без кассира (14.10.2026). Контент — lib/appsParkingContent.ts (5 локалей).
// SEO: SoftwareApplication + FAQPage, hreflang. Ключи: «платная парковка», «автоматизация парковки», «оплата парковки Payme/Click».
import type { Metadata } from "next";
import { clampDesc } from "@/lib/seoText";
import { AppProductPage } from "@/components/AppProductPage";
import { hreflangAlternates } from "@/lib/hreflang";
import { CRUMBS } from "@/lib/appsContent";
import { ogLocale } from "@/lib/ogLocale";
import { PARKING } from "@/lib/appsParkingContent";
import { withOgUrl } from "@/lib/metadata";

const pick = (locale: string) => PARKING[locale] ?? PARKING.ru;

async function generateMetadataBase({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: clampDesc(d.metaDesc),
    alternates: hreflangAlternates("/apps/parking", locale),
    openGraph: { title: d.metaTitle, description: clampDesc(d.metaDesc), locale: ogLocale(locale), images: ["/apps-img/parking-hero.jpg"] },
  };
}

export default async function SatParkingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = pick(locale);
  const crumbs = CRUMBS[locale] ?? CRUMBS.ru;
  // Ссылки в крошках — на языковую версию страницы, чтобы путь совпадал с canonical.
  const site = `https://satsolutions.uz${locale === "ru" ? "" : `/${locale}`}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "SAT Parking",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: clampDesc(d.metaDesc),
        url: "https://satsolutions.uz/apps/parking",
        screenshot: ["https://satsolutions.uz/apps-img/shots/shot-parking-pay.jpg", "https://satsolutions.uz/apps-img/shots/shot-parking-guard.jpg"],
        // цена договорная: Offer нужен, чтобы сниппет приложения показывался вообще
        offers: { "@type": "Offer", price: "0", priceCurrency: "UZS", availability: "https://schema.org/InStock" },
        author: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz" },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
      },
      { "@type": "FAQPage", mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumbs.home, item: `${site}/` },
          { "@type": "ListItem", position: 2, name: crumbs.apps, item: `${site}/apps` },
          { "@type": "ListItem", position: 3, name: "SAT Parking" },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppProductPage d={d} locale={locale} otherHref="/apps/uy" app="parking" />
    </>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
