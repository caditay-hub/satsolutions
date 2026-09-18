// SAT Uy — приложение жителям ЖК и кабинет управляющей компании. Контент — lib/appsUyContent.ts (5 локалей).
// SEO: SoftwareApplication + FAQPage, hreflang. Ключи: «приложение для жителей ЖК», «домофон на телефон», «пропуск гостя по QR».
import type { Metadata } from "next";
import { clampDesc } from "@/lib/seoText";
import { AppProductPage } from "@/components/AppProductPage";
import { hreflangAlternates } from "@/lib/hreflang";
import { CRUMBS } from "@/lib/appsContent";
import { ogLocale } from "@/lib/ogLocale";
import { UY } from "@/lib/appsUyContent";

const pick = (locale: string) => UY[locale] ?? UY.ru;

const DOWNLOAD: Record<string, string> = {
  ru: "Скачать приложение",
  uz: "Ilovani yuklab olish",
  en: "Download the app",
  tr: "Uygulamayı indirin",
  zh: "下载应用",
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: clampDesc(d.metaDesc),
    alternates: hreflangAlternates("/apps/uy", locale),
    openGraph: { title: d.metaTitle, description: clampDesc(d.metaDesc), locale: ogLocale(locale), images: ["/apps-img/shots/shot-doors.jpg"] },
  };
}

export default async function SatUyPage({ params }: { params: Promise<{ locale: string }> }) {
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
        name: "SAT Uy",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Android",
        description: clampDesc(d.metaDesc),
        url: "https://satsolutions.uz/apps/uy",
        screenshot: ["https://satsolutions.uz/apps-img/shots/shot-doors.jpg", "https://satsolutions.uz/apps-img/shots/shot-guest.jpg"],
        // приложение бесплатно для жителя — без offers Google не покажет расширенный сниппет
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
          { "@type": "ListItem", position: 3, name: "SAT Uy" },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppProductPage
        d={d}
        locale={locale}
        otherHref="/apps/davomat"
        app="uy"
        download={{ label: DOWNLOAD[locale] ?? DOWNLOAD.ru, href: "https://uy.satsolutions.uz/download/SAT-Uy.apk" }}
      />
    </>
  );
}
