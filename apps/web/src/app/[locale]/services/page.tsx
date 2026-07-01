import { permanentRedirect } from "next/navigation";

export default async function ServicesRedirectPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" && sp.page ? `?page=${encodeURIComponent(sp.page)}` : "";
  // 308 permanent — легаси-раздел /services консолидирован в /solutions (передаём вес, убираем из индекса).
  permanentRedirect(`/solutions${page}`);
}
