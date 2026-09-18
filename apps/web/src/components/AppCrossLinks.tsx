// Перелинковка со страниц приложений: смежные услуги и статьи по теме.
// Раньше страницы /apps* были «висячими» — вели только друг на друга и в каталог,
// поэтому вес с них никуда не передавался, а посетитель не находил услугу.
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ARTICLES, articleImg } from "@/lib/articlesData";
import { CROSS_UI } from "@/lib/appsExtrasContent";

export async function AppCrossLinks({
  locale,
  services,
  articles,
}: {
  locale: string;
  services: string[];
  articles: string[];
}) {
  const ts = await getTranslations({ locale, namespace: "services" });
  const ui = CROSS_UI[locale] ?? CROSS_UI.ru;
  const posts = articles
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a && a.loc[locale]));

  return (
    <>
      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{ui.services}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {services.map((k) => (
          <Link
            key={k}
            href={`/solutions/${k}`}
            className="group rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-400"
          >
            <div className="font-semibold text-slate-900 group-hover:text-brand-700">{ts(`${k}.title`)}</div>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-slate-500">{ts(`${k}.desc`)}</p>
          </Link>
        ))}
      </div>

      {posts.length > 0 && (
        <>
          <h2 className="mt-12 text-2xl font-semibold text-slate-900">{ui.articles}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {posts.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-brand-400"
              >
                <img
                  src={articleImg(a.slug)}
                  alt={a.loc[locale].title}
                  loading="lazy"
                  className="aspect-[16/8] w-full object-cover"
                />
                <div className="p-4">
                  <div className="font-semibold leading-snug text-slate-900 group-hover:text-brand-700">
                    {a.loc[locale].title}
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-snug text-slate-500">{a.loc[locale].excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
