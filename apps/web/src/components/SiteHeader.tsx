import { getSitePage, getPortfolio } from "@/lib/api";
import { getLocale } from "next-intl/server";
import { localizePortfolioProject } from "@/lib/contentI18n";
// Refreshed component to fix hydration issues
import { resolveImageUrl } from "@/lib/image";
import dynamic from "next/dynamic";
const SiteHeaderClient = dynamic(() => import("@/components/SiteHeaderClient").then(m => m.SiteHeaderClient), { ssr: true });

function pickString(data: any, key: string) {
  return typeof data?.[key] === "string" ? (data[key] as string) : null;
}

export async function SiteHeader() {
  let logoImageUrl: string | null = null;

  try {
    const { page: aboutPage } = await getSitePage("about");
    logoImageUrl = pickString(aboutPage.data, "logoImageUrl") || null;
  } catch {
    // ignore
  }

  // Кейсы для выпадашки «Портфолио»: локализуем на сервере (оверлей в бандл не тянем)
  let portfolioItems: { title: string; slug: string }[] = [];
  try {
    const locale = await getLocale();
    const { items } = await getPortfolio(1, 8);
    portfolioItems = items.map((p) => {
      const l = localizePortfolioProject(p, locale);
      return { title: l.title, slug: p.slug };
    });
  } catch {
    // ignore
  }

  const logoImg = logoImageUrl ? resolveImageUrl(logoImageUrl) : null;

  return <SiteHeaderClient logoImageUrl={logoImg} portfolioItems={portfolioItems} />;
}

