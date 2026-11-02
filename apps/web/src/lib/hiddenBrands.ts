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

// Комплектующие, снятые в ту же чистку 02.11.2026 (HDMI, безымянная мелочь < 100 тыс.), у которых были
// показы в Google (seo-critical-urls.json) — иначе 404. Ведём в раздел того же назначения.
const REMOVED_ITEM_TARGET: Record<string, string> = {
  "pxt-ksvpp-5e-2h2h0-52": "/products/type/sks-vitaya-para",            // кабель КСВПП cat.5e, 254 показа
  "pro-soedinitelnye-klemmy-skotch-lok": "/products/type/sks-vitaya-para",
  "pro-smk": "/products/type/izveschateli",                               // магнитоконтактный СМК
  "pro-pulsoksimetr": "/products",                                        // профильного раздела нет
};

// Снятые товары без бренда (pro-…) и Pixietech (pxt-…) с показами в Google: раздел по словам в слаге
// (аудит 02.11.2026, ~300 адресов, ≈2 800 показов за 90 дней — Claude outputs/redirekty-audit-2026-11-02).
// Порядок важен: первое совпадение побеждает.
const ITEM_RULES: [RegExp, string][] = [
  [/^pxt-rb\d/, "/products/type/marshrutizatory"],                         // MikroTik hEX под Pixietech
  [/^pxt-odf/, "/products/type/optika-i-aksessuary"],                      // оптические кроссы
  [/hdmi/, "/products/group/videonablyudenie"],                            // HDMI соединяет регистратор с монитором
  [/tester|obzhim|nozh|otv[eo]rt|nasadk|ploskogub|kusachk|schipcy|zachistk|kleshch|instrument/, "/products/type/instrumenty"],
  [/(^|-)foc(-|$)|optik|fiber|(^|-)(sc|lc)-(sc|lc)(-|$)|patchkord-dublex|pigt/, "/products/type/optika-i-aksessuary"],
  [/ksv|utp|ftp|vitoi|rj-?45|rozetochn|patch-kabel|kolpoch|lan-adapter|skotch-lok/, "/products/type/sks-vitaya-para"],
  [/kabelnaya-klipsa|homut|chupik|samorez|izolent|gofr|gibkii-perehod|germetichn|(^|-)boks-|korobk|kronsht|kreplen|zaschita-uglov/, "/products/type/kronshteyny-i-aksessuary"],
  [/(^|-)kabel-|(^|-)ks-\d|pvs|pugnp|trp|kspv|p-274/, "/products/type/kabel"],
  [/(^|-)ibp-|akkum|udlinitel|shteker|bns/, "/products/type/ibp-i-elektropitanie"],
  [/organaizer/, "/products/type/telekommunikacionnye-shkafy"],
  [/knopk|exit|karta|brelok/, "/products/type/zamki-i-skud"],
  [/ipr|smk|datchik|izvesh|teplovoi|dymovoi|strob/, "/products/type/izveschateli"],
  [/sprinkler/, "/products/type/pozharnaya-bezopasnost"],
  [/dinamik/, "/products/type/opoveschenie"],
  [/pult|shlagb|lezhach/, "/products/type/shlagbaumy"],
  [/poe-splitter|swich|wifi/, "/products/group/setevoe-oborudovanie"],
];

// Карточка снятого товара → раздел того же назначения (по префиксу и словам слага)
export function hiddenProductTarget(slug: string, locale: string): string | null {
  const s = slug.toLowerCase();
  let to: string | null = REMOVED_ITEM_TARGET[s] ?? null;
  if (!to) {
    if (/^(hil|hlk|hilook)-/.test(s)) to = HIDDEN_BRAND_TARGET.hilook;      // hlk- — старый префикс HiLook
    else if (/^(mcs|mrc|mercusys)-/.test(s)) to = HIDDEN_BRAND_TARGET.mercusys; // mrc- — старый префикс Mercusys
    else if (s.startsWith("tapo-")) {
      if (/^tapo-tapo-c\d/.test(s)) to = "/products/group/videonablyudenie";   // камеры C…
      else if (/^tapo-tapo-dl\d/.test(s)) to = "/products/type/zamki-i-skud";  // замки DL…
      else if (/^tapo-tapo-d\d/.test(s)) to = "/products/group/domofoniya";    // видеозвонки D…
      else to = "/solutions/smarthome";                                         // хаб, датчики, розетки
    } else if (/^(pro|pxt)-/.test(s)) {
      to = ITEM_RULES.find(([rx]) => rx.test(s))?.[1]
        ?? (s.startsWith("pxt-") ? "/catalog/pixietech" : "/products");     // без профильного раздела — каталог
    } else if (/transiver/.test(s)) to = "/products/type/sfp-moduli-i-transivery";
    else if (s.startsWith("knd-")) to = "/catalog/kanihad";
  }
  return to ? `${lp(locale)}${to}` : null;
}

// Тип (раздел), опустевший после снятия бренда: временно — на соседний раздел, пока пуст.
export const HIDDEN_TYPE_TARGET: Record<string, string> = {
  "usiliteli-signala": "/products/type/wi-fi-tochki-dostupa", // были только репитеры Mercusys
};
export function hiddenTypeTarget(slug: string, locale: string): string | null {
  const to = HIDDEN_TYPE_TARGET[(slug || "").toLowerCase()];
  return to ? `${lp(locale)}${to}` : null;
}

// Страница бренда / пары бренда: куда вести, если бренд пуст. typePath — раздел типа для пар
// «бренд × тип» (typeHubHref: склеенные с группой типы — сразу на группу).
export function hiddenBrandTarget(brand: string, locale: string, typePath?: string): string | null {
  const to = HIDDEN_BRAND_TARGET[brand.toLowerCase()];
  if (!to) return null;
  return `${lp(locale)}${typePath ?? to}`;
}
