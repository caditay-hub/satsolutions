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
  "avigilon-": "avigilon", // старые подразделы avigilon-domes/avigilon-ptz (GSC 404, 06.09)
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

/**
 * Те же исчезнувшие разделы, но пойманные через /products/type/<slug> — Google знает
 * их и по этому маршруту (70 адресов в логах). Ключ — typeSlug() от имени мёртвой
 * категории. Совпадения с живыми типами исключены при сборке карты: «Жёсткие диски»
 * была и пустым разделом hdd-hik, и рабочим типом, и редирект увёл бы рабочую страницу.
 */
const DEAD_TYPE_SLUGS: Record<string, string> = {
  "adresnye-rasshiriteli": "/catalog/bolid",
  "aksessuary-dlya-dosok": "/products/type/kronshteyny-i-aksessuary",
  "besprovodnye-aksessuary": "/products/type/kronshteyny-i-aksessuary",
  "besprovodnye-mosty": "/products/type/radiomosty",
  "besprovodnye-registratory": "/products/type/ip-videoregistratory-nvr",
  "biometricheskie-terminaly": "/products/type/terminaly-i-schityvateli",
  "bloki-indikacii": "/catalog/bolid",
  "bytovye-zaryadnye-stancii": "/categories",
  "cifrovye-videoregistratory-dvr": "/products/type/videoregistratory-dvr",
  "datchiki-i-detektory": "/products/type/detektory-i-datchiki",
  "dmss-mobilnoe": "/catalog/dahua",
  "dorozhnye-kamery": "/products/type/ip-kamery",
  "dss-express": "/catalog/dahua",
  "dss-pro": "/catalog/dahua",
  "dymoudalenie": "/catalog/rubezh",
  "dymovye-izveschateli": "/catalog/bolid",
  "fisheye-kamery": "/products/type/ip-kamery",
  "hdcvi-aksessuary": "/products/type/kronshteyny-i-aksessuary",
  "intellektualnye-vychisleniya": "/categories",
  "interaktivnye-displei": "/products/type/displei-i-monitory",
  "interaktivnye-doski": "/products/type/displei-i-monitory",
  "izolyatory-linii": "/catalog/bolid",
  "kamery": "/products/type/ip-kamery",
  "karty-pamyati": "/catalog/hikvision",
  "klaviatury-upravleniya": "/products/type/pribory-i-moduli",
  "kommercheskie-zaryadnye-stancii": "/categories",
  "kontrol-dostupa": "/products/type/kontrollery-dostupa",
  "kontrollery-adresnoy-linii": "/catalog/bolid",
  "led-displei": "/products/type/displei-i-monitory",
  "mikrotik-routers": "/catalog/mikrotik",
  "mini-kamery": "/products/type/ip-kamery",
  "mobilnoe-prilozhenie": "/catalog/dahua",
  "mobilnye-dvr-nvr": "/products/type/videoregistratory-dvr",
  "mobilnye-stoyki": "/products/type/kronshteyny-i-aksessuary",
  "monitory-dlya-videonablyudeniya": "/products/type/displei-i-monitory",
  "monitory-videonablyudeniya": "/catalog/hikvision",
  "nakopiteli": "/products/type/zhestkie-diski",
  "oblachnye-servisy-dolynk": "/catalog/dahua",
  "oblako-dolynk": "/catalog/dahua",
  "obnaruzhenie-pozharov": "/products/type/pozharnaya-bezopasnost",
  "ohrannaya-signalizaciya": "/catalog/rubezh",
  "opoveschateli": "/catalog/bolid",
  "pitanie": "/catalog/rubezh",
  "pozharnaya-signalizaciya": "/products/type/pozharnaya-bezopasnost",
  "pozharotushenie": "/products/type/pozharnaya-bezopasnost",
  "pozharotushenie-modulnoe": "/catalog/rubezh",
  "preobrazovateli-interfeysa": "/catalog/bolid",
  "priemno-kontrolnye-pribory": "/catalog/bolid",
  "prochee-oborudovanie": "/catalog/bolid",
  "programmnoe-obespechenie": "/products/type/pribory-i-moduli",
  "programmnoe-obespechenie-skud": "/products/type/zamki-i-skud",
  "promyshlennye-kommutatory": "/products/type/kommutatory",
  "pt-kamery": "/products/type/ptz-kamery",
  "ptz-speed-dome": "/products/type/ptz-kamery",
  "pxt-switches": "/catalog/pixietech",
  "ruchnye-pozharnye-izveschateli": "/catalog/bolid",
  "ruchnye-teplovizory": "/categories",
  "sd-karty-dlya-videonablyudeniya": "/products/type/zhestkie-diski",
  "setevye-ip-kamery": "/products/type/ip-kamery",
  "setevye-videodekodery": "/catalog/hikvision",
  "setevye-videoregistratory": "/products/type/ip-videoregistratory-nvr",
  "sfp-transivery": "/products/type/sfp-moduli-i-transivery",
  "sireny-i-opoveschateli": "/products/type/opoveschenie",
  "skud-r3": "/catalog/rubezh",
  "smartpss": "/catalog/dahua",
  "soue-1-2-tip": "/catalog/rubezh",
  "soue-3-tip-na-nizkoomnyh-dinamikah": "/catalog/rubezh",
  "sredniy-uroven": "/catalog/rubezh",
  "ssd-nakopiteli": "/catalog/hikvision",
  "teplovizionnye-izmeritelnye": "/categories",
  "teplovizionnye-kamery": "/products/type/ip-kamery",
  "teplovizionnye-moduli-oem": "/categories",
  "teplovizionnye-produkty": "/categories",
  "terminaly-raspoznavaniya-lic": "/products/type/terminaly-i-schityvateli",
  "tochki-dostupa-wi-fi": "/products/type/wi-fi-tochki-dostupa",
  "turbohd-kamery": "/products/type/analogovye-kamery",
  "turnikety": "/products/type/turnikety-i-shlagbaumy",
  "umnye-gorodskie-resheniya": "/categories",
  "umnye-zamki": "/products/type/zamki-i-skud",
  "upravlenie-inzhenernym-oborudovaniem": "/catalog/rubezh",
  "verhniy-uroven": "/catalog/rubezh",
  "videodomofonnye-aksessuary": "/products/type/domofoniya",
  "videoregistratory": "/products/type/ip-videoregistratory-nvr",
  "videosteny": "/products/type/displei-i-monitory",
  "vzryvozaschischennoe-oborudovanie": "/catalog/rubezh",
  "vzryvozaschischennye-kamery": "/products/type/ip-kamery",
  "zaryadnye-stancii-dlya-elektromobiley": "/categories",
  "zhestkie-diski-dlya-videonablyudeniya": "/products/type/zhestkie-diski",
};

/** Куда увести /products/type/<slug>, если живого типа с таким слагом нет. */
export function deadTypeTarget(slug: string): string | null {
  return DEAD_TYPE_SLUGS[(slug || "").toLowerCase()] ?? null;
}
