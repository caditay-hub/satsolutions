import { redirect } from "next/navigation";

export default async function ServicesRedirectPage({
  searchParams
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const page = typeof sp.page === "string" && sp.page ? `?page=${encodeURIComponent(sp.page)}` : "";
  redirect(`/solutions${page}`);
}
