import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-slate-600">{t("text")}</p>
      <div className="mt-6">
        <Link href="/" className="text-sm font-semibold text-brand-700 hover:text-brand-800">
          {t("home")} →
        </Link>
      </div>
    </div>
  );
}

