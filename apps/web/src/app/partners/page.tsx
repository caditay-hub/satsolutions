import type { Metadata } from "next";
import Image from "next/image";
import { getPartners } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

export const metadata: Metadata = {
  title: "Партнеры",
  description: "Наши партнеры"
};

export default async function PartnersPage() {
  let partners: Awaited<ReturnType<typeof getPartners>>["partners"] = [];
  try {
    const r = await getPartners();
    partners = r.partners ?? [];
  } catch {
    // If API is unavailable during build, show empty state instead of failing the build.
    partners = [];
  }
  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Партнеры</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {partners.map((p) => {
          const img = resolveImageUrl(p.logoImageUrl);
          const content = (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-center">
                {img ? (
                  <Image alt={p.name} src={img} width={240} height={120} className="h-14 w-auto object-contain" />
                ) : (
                  <div className="text-sm font-semibold text-slate-900">{p.name}</div>
                )}
              </div>
              <div className="mt-3 text-center text-sm font-semibold text-slate-900">{p.name}</div>
            </div>
          );

          return p.websiteUrl ? (
            <a key={p.id} href={p.websiteUrl} target="_blank" rel="noreferrer" className="block hover:opacity-95">
              {content}
            </a>
          ) : (
            <div key={p.id}>{content}</div>
          );
        })}

        {partners.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-sm text-slate-600 lg:col-span-4">
            Партнеров пока нет.
          </div>
        ) : null}
      </div>
    </div>
  );
}

