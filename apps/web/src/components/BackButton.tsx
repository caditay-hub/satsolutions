// DEPRECATED: единая кнопка «Назад» теперь рендерится глобально через
// <GlobalBackButton/> в layout (фиксированная позиция, одна на всех страницах).
// Старые инлайн-вызовы <BackButton/> оставлены в коде, но ничего не выводят,
// чтобы не было двух кнопок «Назад» одновременно.
export function BackButton(_props?: { label?: string; fallback?: string }) {
  return null;
}
