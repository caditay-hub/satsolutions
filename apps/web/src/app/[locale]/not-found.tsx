import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export default async function NotFound() {
  // Локаль берём из пути (заголовок x-pathname проставляет middleware): в контексте
  // notFound() параметры маршрута недоступны, а getTranslations с явной локалью не
  // зависит от request-контекста (иначе useTranslations падает → встроенная 404 Next).
  const h = await headers();
  const pathname = h.get("x-pathname") ?? "";
  const seg = pathname.split("/")[1];
  const locale = (routing.locales as readonly string[]).includes(seg) ? seg : routing.defaultLocale;
  const homeHref = locale === routing.defaultLocale ? "/" : `/${locale}`;
  const t = await getTranslations({ locale, namespace: "notFound" });

  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("text")}</p>
      <div className="mt-6">
        <a href={homeHref} className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          {t("home")} →
        </a>
      </div>
    </div>
  );
}
