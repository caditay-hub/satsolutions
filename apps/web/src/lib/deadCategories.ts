import { typeSlug } from "./typeSlug";

// Старые URL /categories/<slug> из доиндексной таксономии.
//
// Зачем: API /categories отдаёт только категории С опубликованными товарами (пустые
// записи-словарь не должны попадать в sitemap/фасеты), поэтому страница не находила
// такой slug и отдавала 404. В GSC накопилось 1145 «Не найдено», и Googlebot
// продолжал их долбить (bolid-loop-controllers — 20 обращений за 2 недели,
// ip-kamery — 18, sirens — 17), выжигая краулинговый бюджет: из-за него новые
// страницы неделями ждут первого обхода.
//
// Лечим 308-редиректом на ближайшую живую страницу. Где уверенного соответствия
// нет — ведём на индекс каталога, а не выдумываем тип.
// Список собран из логов nginx за 2 недели (94 адреса), сверен с БД: у всех 0 товаров.

/** Брендовые подкатегории → каталог бренда (сохраняем бренд-контекст). */
const BRAND_PREFIX: Record<string, string> = {
  "bolid-": "bolid",
  "rubezh-": "rubezh",
  "mikrotik-": "mikrotik",
  "ruijie-": "ruijie",
  "dolynk-": "dahua", // облачные сервисы Dahua
};

/** Хвост «-hik» остался от старых hikvision-разделов. */
const HIK_SUFFIX = "-hik";

/** ПО и мобильные приложения Dahua — отдельными правилами, префикса нет. */
const DAHUA_SOFTWARE = new Set(["dmss", "dss-pro", "dss-express", "smartpss"]);

/** Слитые разделы → имя ЖИВОГО типа (slug считаем через typeSlug, как в роуте). */
const TO_TYPE: Record<string, string> = {
  // камеры
  "ip-kamery": "IP-камеры",
  "vnutrennie-ip-kamery": "IP-камеры",
  "setevye-kamery": "IP-камеры",
  kamery: "IP-камеры",
  fisheye: "IP-камеры",
  "mini-cam": "IP-камеры",
  "road-cameras": "IP-камеры",
  "explosion-proof": "IP-камеры",
  "thermal-cameras": "IP-камеры",
  ptz: "PTZ-камеры",
  "pt-cameras": "PTZ-камеры",
  "turbo-hd": "Аналоговые камеры",
  // регистраторы
  nvr: "IP-видеорегистраторы (NVR)",
  registratory: "IP-видеорегистраторы (NVR)",
  "wireless-nvr": "IP-видеорегистраторы (NVR)",
  dvr: "Видеорегистраторы (DVR)",
  "mobile-dvr": "Видеорегистраторы (DVR)",
  // хранение
  ssd: "Жёсткие диски",
  memory: "Жёсткие диски",
  "surveillance-hdd": "Жёсткие диски",
  "sd-cards": "Жёсткие диски",
  // сети
  "industrial-switches": "Коммутаторы",
  "sfp-transceivers": "SFP-модули и трансиверы",
  "wireless-bridges": "Радиомосты",
  // СКУД и замки
  "smart-locks": "Замки и СКУД",
  "access-software": "Замки и СКУД",
  "kontrol-dostupa": "Контроллеры доступа",
  "biometric-terminals": "Терминалы и считыватели",
  "face-terminals": "Терминалы и считыватели",
  // пожарная и охранная
  "obnar-pozhar": "Пожарная безопасность",
  sirens: "Оповещение",
  datchiki: "Детекторы и датчики",
  // экраны
  "video-walls": "Дисплеи и мониторы",
  "led-displays": "Дисплеи и мониторы",
  "interactive-displays": "Дисплеи и мониторы",
  "interactive-whiteboards": "Дисплеи и мониторы",
  "surveillance-monitors": "Дисплеи и мониторы",
  // домофония
  "intercom-accessories": "Домофония",
  // аксессуары
  "hdcvi-accessories": "Кронштейны и аксессуары",
  "whiteboard-accessories": "Кронштейны и аксессуары",
  "wireless-accessories": "Кронштейны и аксессуары",
  "mobile-stands": "Кронштейны и аксессуары",
  // прочее
  software: "Приборы и модули",
  "alarm-keyboards": "Приборы и модули",
};

/** Тематика ушла целиком (зарядки, тепловизоры, умный город) — честнее вести в каталог. */
const TO_INDEX = new Set([
  "ev-charger", "home-ev-charger", "commercial-ev-charger",
  "thermal-measurement", "thermal-modules", "thermal-products", "ruchnye-th",
  "smart-city", "intelligent-computing",
  "sistema-videonablyudeniya",
]);

/** Бренд-страницы, которые раньше жили под /categories/<brand>. */
const TO_BRAND = new Set(["hikvision", "dahua"]);

/**
 * Куда увести старый /categories/<slug>, если такой категории больше нет.
 * null — соответствия нет, оставляем честный 404.
 */
export function deadCategoryTarget(slug: string): string | null {
  const s = (slug || "").toLowerCase();
  if (TO_BRAND.has(s)) return `/catalog/${s}`;
  if (DAHUA_SOFTWARE.has(s)) return "/catalog/dahua";
  if (s.endsWith(HIK_SUFFIX)) return "/catalog/hikvision";
  for (const [prefix, brand] of Object.entries(BRAND_PREFIX)) {
    if (s.startsWith(prefix)) return `/catalog/${brand}`;
  }
  if (TO_TYPE[s]) return `/products/type/${typeSlug(TO_TYPE[s])}`;
  if (TO_INDEX.has(s)) return "/categories";
  return null;
}
