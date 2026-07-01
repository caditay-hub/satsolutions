import { permanentRedirect } from "next/navigation";

export default async function ServiceSlugRedirectPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // 308 permanent — легаси /services/<slug> → /solutions/<slug> (консолидация старых URL).
  permanentRedirect(`/solutions/${encodeURIComponent(slug)}`);
}
