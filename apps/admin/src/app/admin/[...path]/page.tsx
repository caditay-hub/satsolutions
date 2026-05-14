import { redirect } from "next/navigation";

export default async function AdminCatchAllRedirectPage({
  params
}: {
  params: Promise<{ path: string[] }>;
}) {
  const { path } = await params;
  const target = "/" + (path ?? []).join("/");
  redirect(target === "/" ? "/dashboard" : target);
}

