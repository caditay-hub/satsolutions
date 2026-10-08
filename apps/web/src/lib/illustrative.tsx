// Кейсы, где фото — иллюстрации (сгенерированы по реальному объекту), а не снимки с объекта.
// Решение владельца 08.10.2026 (ТЗ AE: не выдавать выдуманное за факт): такие картинки
// везде подписываются «Иллюстрация» — на обложке кейса, в галерее и в карточках кейса
// (портфолио, главная, блок кейсов в услугах).
export const ILLUSTRATIVE_CASES = new Set<string>([
  "zhk-towerup-vols-mezhdu-domami",
]);

const LABEL: Record<string, string> = {
  ru: "Иллюстрация",
  uz: "Illyustratsiya",
  en: "Illustration",
  tr: "İllüstrasyon",
  zh: "示意图",
};

export function illustrationLabel(slug: string, locale: string): string | null {
  return ILLUSTRATIVE_CASES.has(slug) ? LABEL[locale] ?? LABEL.ru : null;
}

/** Плашка поверх картинки; родитель должен быть relative. */
export function IllustrationBadge({ label }: { label: string | null }) {
  if (!label) return null;
  return (
    <span className="pointer-events-none absolute bottom-2.5 left-2.5 z-[5] rounded-md bg-slate-900/70 px-2 py-1 text-[11px] font-semibold leading-none tracking-wide text-white">
      {label}
    </span>
  );
}
