import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// Cart removed — site is now informational. Keep the route as a redirect
// so any old links/bookmarks land on the home page instead of a 404.
export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(locale === routing.defaultLocale ? "/" : `/${locale}`);
}
