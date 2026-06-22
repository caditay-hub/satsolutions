import { Link } from "@/i18n/navigation";
import type { Metadata } from "next";
import { BackButton } from "@/components/BackButton";
import { CATALOG_GROUPS } from "@/lib/catalogGroups";
import { GroupIcon } from "@/components/GroupIcon";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Каталог по категориям",
    description: "Системы безопасности, видеонаблюдение, сети и СКС — весь каталог SAT Solutions по категориям. Доставка по Ташкенту и Узбекистану.",
    alternates: hreflangAlternates("/categories", locale)
  };
}

export default async function CategoriesPage() {
  const groups = CATALOG_GROUPS.map((g, i) => ({
    idx: i,
    title: g.title,
    icon: g.icon,
    types: g.types.filter((t) => t.c > 0),
  })).filter((g) => g.types.length > 0);

  const total = CATALOG_GROUPS.reduce((a, g) => a + g.types.reduce((s, t) => s + t.c, 0), 0);

  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mb-4"><BackButton /></div>
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Каталог по категориям</h1>
      <p className="mt-2 max-w-prose text-sm text-slate-600">
        Выберите категорию — откроется каталог товаров с фильтром по брендам. Всего в каталоге {total.toLocaleString("ru-RU")} позиций.
      </p>

      <div className="mt-8 grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((g) => (
          <section key={g.title} id={`cat-${g.idx}`} className="scroll-mt-24 break-inside-avoid">
            <div className="mb-2.5 flex items-center gap-2.5 border-b border-slate-200 pb-2">
              <GroupIcon name={g.icon} className="h-5 w-5 shrink-0 text-brand-600" />
              <h2 className="text-[15px] font-semibold text-slate-900">{g.title}</h2>
            </div>
            <ul className="flex flex-col">
              {g.types.map((t) => (
                <li key={t.n}>
                  <Link
                    href={`/products/type/${typeSlug(t.n)}`}
                    className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-[13.5px] text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-700"
                  >
                    <span className="truncate">{t.n}</span>
                    <span className="shrink-0 text-[11px] text-slate-400">{t.c}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-4 border-t border-slate-200 pt-6 text-sm">
        <Link href="/catalog" className="font-semibold text-brand-700 hover:underline">Каталог по брендам →</Link>
        <Link href="/products" className="font-semibold text-slate-600 hover:text-brand-700">Все товары →</Link>
      </div>
    </div>
  );
}
