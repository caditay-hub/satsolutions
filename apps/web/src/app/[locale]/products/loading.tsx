import { getTranslations } from "next-intl/server";
import { LoadingDots } from "@/components/LoadingDots";

/* Мгновенный индикатор при переходе на страницу каталога/поиска: серверный рендер
   результатов (умный поиск ждёт до ~2.5с) не оставляет пользователя перед «мёртвой»
   страницей — Next показывает этот fallback, пока готовится ответ. */
export default async function ProductsLoading() {
  const t = await getTranslations("common");
  return (
    <div className="container-page !pt-3 !pb-10">
      <div className="mb-5 flex items-center gap-2.5 text-[15px] font-semibold text-slate-500">
        <LoadingDots className="text-brand-600" />
        <span>{t("loading")}…</span>
      </div>
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-white p-3">
            <div className="aspect-square w-full rounded-lg bg-slate-100" />
            <div className="mt-3 h-3.5 w-4/5 rounded bg-slate-100" />
            <div className="mt-2 h-3 w-2/5 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
