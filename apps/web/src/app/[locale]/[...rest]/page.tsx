import { notFound } from "next/navigation";

// Ловушка для несопоставленных путей внутри локали. Без неё запрос вроде
// /uz/chego-to-net уходил выше [locale] в рутовый not-found, который
// пререндерится статически и потому отдавал русский текст поисковикам.
// Здесь notFound() поднимает [locale]/not-found.tsx — уже с нужным языком.
export const dynamic = "force-dynamic";

export default function CatchAllNotFound() {
  notFound();
}
