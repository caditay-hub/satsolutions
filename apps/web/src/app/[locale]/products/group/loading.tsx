import { LoadingDots } from "@/components/LoadingDots";

/* Мгновенный индикатор при переходе на страницу каталога/поиска: серверный рендер
   результатов (умный поиск ждёт до ~2.5с) не оставляет пользователя перед «мёртвой»
   страницей — Next показывает этот fallback, пока готовится ответ.

   min-h-[100dvh]: короткий скелет (10 карточек ≈ 600 px) поднимал подвал во вьюпорт,
   а приход реальной выдачи уводил его вниз — это и давало CLS 0,196 на десктопе.

   Без getTranslations: loading.tsx не получает params, поэтому любой перевод здесь
   читал бы локаль из заголовков запроса и делал весь /products/group/[slug]
   динамическим в обход объявленного revalidate. Индикатор обходится без текста. */
export default function ProductsLoading() {
  return (
    <div className="container-page !pt-3 !pb-10 min-h-[100dvh]">
      <div className="mb-5 flex items-center gap-2.5 text-[15px] font-semibold text-slate-500">
        <LoadingDots className="text-brand-600" />
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
