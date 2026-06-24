import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCategories } from "@/lib/api";
import { hreflangAlternates } from "@/lib/hreflang";
import { typeSlug } from "@/lib/typeSlug";
import { CatalogView } from "../../CatalogView";

export const revalidate = 300;

/** slug → точное имя типа (кириллица), по которому фильтруются товары.
 *  Источник = имена категорий (тот же набор, что эмитит sitemap). */
async function resolveTypeName(slug: string): Promise<string | null> {
  try {
    const { categories } = await getCategories();
    const hit = categories.find((c) => c.name && typeSlug(c.name) === slug);
    return hit?.name ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  const name = await resolveTypeName(slug);
  if (!name) return { title: t("nav.products") };
  const title = `${name} — ${t("product.titleBuy")}`;
  const description = t("product.typeDesc", { type: name });
  return {
    title,
    description,
    alternates: hreflangAlternates(`/products/type/${slug}`, locale),
    openGraph: { title, description },
  };
}

export default async function ProductTypePage({ params, searchParams }: { params: Promise<{ locale: string; slug: string }>; searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const { locale, slug } = await params;
  const sp = (await searchParams) ?? {};
  const name = await resolveTypeName(slug);
  if (!name) notFound();
  // Переиспользуем рендер каталога /products для type=<name>.
  // ВАЖНО: пробрасываем реальные query-параметры из URL (brand, chars, priceMin/Max,
  // sort, perPage, view, page) — иначе фильтр-фасеты «не работают»: URL меняется, а
  // сервер игнорирует фильтры и отдаёт нефильтрованный список.
  // type и __clean задаём принудительно: type — из slug, __clean=1 глушит 301 обратно сюда.
  return CatalogView({
    params: Promise.resolve({ locale }),
    searchParams: Promise.resolve({ ...sp, type: name, __clean: "1" }),
    pathType: name, // тип закодирован в ПУТИ — отдаём фильтру, чтобы «Тип» был отмечен и работал
  } as any);
}
