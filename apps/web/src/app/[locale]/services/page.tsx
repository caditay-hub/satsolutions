import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default async function ServicesRedirectPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const page = typeof sp.page === "string" && sp.page ? `?page=${encodeURIComponent(sp.page)}` : "";
  // 308 permanent — легаси-раздел /services консолидирован в /solutions (передаём вес, убираем из индекса).
  // permanentRedirect не знает про локаль — без префикса узбекский посетитель
  // улетал на русскую страницу (ru — локаль по умолчанию, она без префикса).
  const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
  permanentRedirect(`${lp}/solutions${page}`);
}
