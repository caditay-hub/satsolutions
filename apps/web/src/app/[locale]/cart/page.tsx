import { permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// Корзина снята: сайт информационный, AddToCartButton/CartIconButton нигде не
// подключены, оформления заказа нет. Раньше отдавали временный 307 на главную —
// поисковик держал /cart в индексе. Теперь 308 на каталог: постоянный сигнал
// «страницы больше нет, содержимое там», и посетитель попадает к товарам.
// В sitemap /cart не значился — чистить нечего.
export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lp = locale === routing.defaultLocale ? "" : `/${locale}`;
  permanentRedirect(`${lp}/products`);
}
