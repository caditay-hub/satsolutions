import { permanentRedirect } from "next/navigation";

// Сервис-категории не используются в навигации (единственный линкер удалён) —
// схлопываем на индекс услуг, чтобы не плодить сиротские страницы.
export default async function SolutionsCategoryRedirect() {
  permanentRedirect("/solutions");
}
