import { getSitePage } from "@/lib/api";
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

  const logoImg = logoImageUrl ? resolveImageUrl(logoImageUrl) : null;

  return <SiteHeaderClient logoImageUrl={logoImg} />;
}

