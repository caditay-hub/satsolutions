import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// Сервис-категории не используются в навигации (единственный линкер удалён) —
// схлопываем на индекс услуг, чтобы не плодить сиротские страницы.
export default async function SolutionsCategoryRedirect({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const lp = locale !== routing.defaultLocale ? `/${locale}` : "";
  permanentRedirect(`${lp}/solutions`);
}
