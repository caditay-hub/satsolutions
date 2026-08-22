import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function ServiceSlugRedirectPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  // 308 permanent — легаси /services/<slug> → /solutions/<slug> (консолидация старых URL).
  const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
  permanentRedirect(`${lp}/solutions/${encodeURIComponent(slug)}`);
}
