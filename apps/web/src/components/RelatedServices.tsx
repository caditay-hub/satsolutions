import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

// Перекрёстные ссылки внутри «семей» услуг: с любой страницы семьи виден весь
// спектр направлений (посетителю — навигация, Google — связность кластера).
const FAMILIES: string[][] = [
  ["network", "wifi", "fiber", "radiobridge", "mikrotik"],
  ["server", "servers", "virtualization"],
];

export async function RelatedServices({ current }: { current: string }) {
  const family = FAMILIES.find((f) => f.includes(current));
  if (!family) return null;
  const ts = await getTranslations("services");
  const tp = await getTranslations("solutionsPage");
  const others = family.filter((k) => k !== current);

  return (
    <div className="mt-12">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{tp("relatedLabel")}</p>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{tp("relatedTitle")}</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {others.map((k) => (
          <Link
            key={k}
            href={`/solutions/${k}`}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-brand-500 hover:shadow-md"
          >
            <p className="text-sm font-black text-slate-900 group-hover:text-brand-700">{ts(`${k}.title`)}</p>
            <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-slate-500">{ts(`${k}.desc`)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
