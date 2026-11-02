// Бренды, временно снятые с продажи: Tapo, HiLook, Mercusys (решение владельца 02.11.2026 — «временно»).
// Пока у бренда нет опубликованных товаров, его страница, пары «бренд × тип» и карточки ведут
// ВРЕМЕННЫМ редиректом (307) на близкий живой раздел — без тупика «Найдено: 0» и без 404.
// Срабатывает только на пустом бренде / ненайденной карточке: вернутся товары — редирект
// перестанет срабатывать сам, удалять ничего не нужно.

const LOCALE_DEFAULT = "ru";

export const HIDDEN_BRAND_TARGET: Record<string, string> = {
  tapo: "/products/group/videonablyudenie", // основная часть ассортимента — Wi-Fi камеры
  hilook: "/catalog/hikvision",             // суббренд Hikvision
  mercusys: "/catalog/tplink",              // суббренд TP-Link
};

function lp(locale: string) {
  return locale === LOCALE_DEFAULT ? "" : `/${locale}`;
}

// Карточка снятого товара → раздел того же назначения (по префиксу слага)
export function hiddenProductTarget(slug: string, locale: string): string | null {
  const s = slug.toLowerCase();
  let to: string | null = null;
  if (s.startsWith("hil-") || s.startsWith("hilook-")) to = HIDDEN_BRAND_TARGET.hilook;
  else if (s.startsWith("mcs-") || s.startsWith("mercusys-")) to = HIDDEN_BRAND_TARGET.mercusys;
  else if (s.startsWith("tapo-")) {
    if (/^tapo-tapo-c\d/.test(s)) to = "/products/group/videonablyudenie";   // камеры C…
    else if (/^tapo-tapo-dl\d/.test(s)) to = "/products/type/zamki-i-skud";  // замки DL…
    else if (/^tapo-tapo-d\d/.test(s)) to = "/products/group/domofoniya";    // видеозвонки D…
    else to = "/solutions/smarthome";                                         // хаб, датчики, розетки
  }
  return to ? `${lp(locale)}${to}` : null;
}

// Страница бренда / пары бренда: куда вести, если бренд пуст. typePath — раздел типа для пар
// «бренд × тип» (typeHubHref: склеенные с группой типы — сразу на группу).
export function hiddenBrandTarget(brand: string, locale: string, typePath?: string): string | null {
  const to = HIDDEN_BRAND_TARGET[brand.toLowerCase()];
  if (!to) return null;
  return `${lp(locale)}${typePath ?? to}`;
}
