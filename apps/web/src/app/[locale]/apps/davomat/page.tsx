// SAT Davomat — учёт рабочего времени по лицу. Контент — lib/appsDavomatContent.ts (5 локалей).
// SEO: SoftwareApplication + FAQPage, hreflang. Ключи: «учёт рабочего времени», «табель 1С», «приход уход по лицу».
import type { Metadata } from "next";
import { clampDesc } from "@/lib/seoText";
import { AppProductPage } from "@/components/AppProductPage";
import { hreflangAlternates } from "@/lib/hreflang";
import { CRUMBS } from "@/lib/appsContent";
import { ogLocale } from "@/lib/ogLocale";
import { DAVOMAT } from "@/lib/appsDavomatContent";

const pick = (locale: string) => DAVOMAT[locale] ?? DAVOMAT.ru;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: clampDesc(d.metaDesc),
    alternates: hreflangAlternates("/apps/davomat", locale),
    openGraph: { title: d.metaTitle, description: clampDesc(d.metaDesc), locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function SatDavomatPage({ params }: { params: Promise<{ locale: string }> }) {
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
        name: "SAT Davomat",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: clampDesc(d.metaDesc),
        url: "https://satsolutions.uz/apps/davomat",
        author: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz" },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
      },
      { "@type": "FAQPage", mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: crumbs.home, item: `${site}/` },
          { "@type": "ListItem", position: 2, name: crumbs.apps, item: `${site}/apps` },
          { "@type": "ListItem", position: 3, name: "SAT Davomat" },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppProductPage d={d} locale={locale} otherHref="/apps/uy" app="davomat" />
    </>
  );
}
