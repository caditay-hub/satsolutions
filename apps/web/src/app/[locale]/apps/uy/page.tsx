// SAT Uy — приложение жителям ЖК и кабинет управляющей компании. Контент — lib/appsUyContent.ts (5 локалей).
// SEO: SoftwareApplication + FAQPage, hreflang. Ключи: «приложение для жителей ЖК», «домофон на телефон», «пропуск гостя по QR».
import type { Metadata } from "next";
import { AppProductPage } from "@/components/AppProductPage";
import { hreflangAlternates } from "@/lib/hreflang";
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
    description: d.metaDesc,
    alternates: hreflangAlternates("/apps/uy", locale),
    openGraph: { title: d.metaTitle, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function SatUyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = pick(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "SAT Uy",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Android",
        description: d.metaDesc,
        url: "https://satsolutions.uz/apps/uy",
        author: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz" },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
      },
      { "@type": "FAQPage", mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AppProductPage
        d={d}
        otherHref="/apps/davomat"
        download={{ label: DOWNLOAD[locale] ?? DOWNLOAD.ru, href: "https://uy.satsolutions.uz/download/SAT-Uy.apk" }}
      />
    </>
  );
}
