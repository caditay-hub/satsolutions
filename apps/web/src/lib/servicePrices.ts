// Ценовой ориентир на страницах услуг.
//
// Зачем: ключи вроде «сервер цена», «установка видеонаблюдения цена» приводят людей на
// страницу услуги, где до сих пор не было ни одной цифры — человек не находил ответ
// на свой вопрос и уходил. Google оценивал такие посадочные как «ниже среднего»
// (0 из 50 ключей имели оценку «выше среднего» по посадочной, замер 21.08.2026).
//
// Цены — минимальные по опубликованным товарам соответствующих разделов каталога,
// сверены по прод-БД 21.08.2026. При заметном изменении прайса обновлять здесь же.
export type PriceRow = { label: string; price: string; href: string };
export type ServicePriceBlock = { title: string; rows: PriceRow[]; note: string };

type Loc = "ru" | "uz" | "en" | "tr" | "zh";

const CCTV_LINKS = {
  cams: "/products/type/ip-kamery",
  nvr: "/products/type/ip-videoregistratory-nvr",
  kits: "/kits",
};
const SERVER_LINK = "/products/type/servernoe-oborudovanie";

const DATA: Record<string, Record<Loc, ServicePriceBlock>> = {
  cctv: {
    ru: {
      title: "Сколько стоит оборудование",
      rows: [
        { label: "IP-камеры", price: "от 234 900 сум", href: CCTV_LINKS.cams },
        { label: "Видеорегистраторы (NVR)", price: "от 308 900 сум", href: CCTV_LINKS.nvr },
        { label: "Готовый комплект с монтажом", price: "от 4 000 000 сум", href: CCTV_LINKS.kits },
      ],
      note: "Это цены на оборудование из каталога. Стоимость монтажа зависит от объекта: числа камер, длины трасс и типа стен — посчитайте в калькуляторе или вызовите инженера на замер.",
    },
    uz: {
      title: "Uskuna qancha turadi",
      rows: [
        { label: "IP-kameralar", price: "234 900 so'mdan", href: CCTV_LINKS.cams },
        { label: "Videoregistratorlar (NVR)", price: "308 900 so'mdan", href: CCTV_LINKS.nvr },
        { label: "Montaj bilan tayyor to'plam", price: "4 000 000 so'mdan", href: CCTV_LINKS.kits },
      ],
      note: "Bu — katalogdagi uskuna narxlari. Montaj narxi obyektga bog'liq: kameralar soni, kabel uzunligi va devor turi. Kalkulyatorda hisoblang yoki muhandisni chaqiring.",
    },
    en: {
      title: "What the equipment costs",
      rows: [
        { label: "IP cameras", price: "from 234,900 UZS", href: CCTV_LINKS.cams },
        { label: "Recorders (NVR)", price: "from 308,900 UZS", href: CCTV_LINKS.nvr },
        { label: "Ready kit with installation", price: "from 4,000,000 UZS", href: CCTV_LINKS.kits },
      ],
      note: "These are catalogue prices for hardware. Installation depends on the site — the number of cameras, cable runs and wall type. Use the calculator or book an engineer for a survey.",
    },
    tr: {
      title: "Ekipman ne kadar",
      rows: [
        { label: "IP kameralar", price: "234.900 UZS'den", href: CCTV_LINKS.cams },
        { label: "Kayıt cihazları (NVR)", price: "308.900 UZS'den", href: CCTV_LINKS.nvr },
        { label: "Montajlı hazır set", price: "4.000.000 UZS'den", href: CCTV_LINKS.kits },
      ],
      note: "Bunlar katalogdaki donanım fiyatlarıdır. Montaj bedeli sahaya göre değişir: kamera sayısı, kablo uzunluğu ve duvar tipi. Hesaplayıcıyı kullanın veya keşif için mühendis çağırın.",
    },
    zh: {
      title: "设备价格",
      rows: [
        { label: "网络摄像机", price: "234 900 苏姆起", href: CCTV_LINKS.cams },
        { label: "录像机（NVR）", price: "308 900 苏姆起", href: CCTV_LINKS.nvr },
        { label: "含安装成套方案", price: "4 000 000 苏姆起", href: CCTV_LINKS.kits },
      ],
      note: "以上为目录中的设备价格。安装费用视现场情况而定：摄像机数量、布线长度与墙体类型。可使用计算器估算，或预约工程师上门勘察。",
    },
  },
  servers: {
    ru: {
      title: "Сколько стоит оборудование",
      rows: [
        { label: "Комплектующие: диски, память, сетевые карты", price: "от 137 900 сум", href: SERVER_LINK },
        { label: "Готовые серверы и серверы видеонаблюдения", price: "от 20 374 900 сум", href: SERVER_LINK },
      ],
      note: "Сервер под конкретную задачу считается индивидуально: цена зависит от числа ядер, объёма памяти и дисковой подсистемы. Пришлите число пользователей и объём данных — вернёмся с двумя-тремя конфигурациями и ценой.",
    },
    uz: {
      title: "Uskuna qancha turadi",
      rows: [
        { label: "Butlovchilar: disklar, xotira, tarmoq kartalari", price: "137 900 so'mdan", href: SERVER_LINK },
        { label: "Tayyor serverlar va videokuzatuv serverlari", price: "20 374 900 so'mdan", href: SERVER_LINK },
      ],
      note: "Aniq vazifa uchun server alohida hisoblanadi: narx yadrolar soni, xotira hajmi va disk quyi tizimiga bog'liq. Foydalanuvchilar soni va ma'lumot hajmini yuboring — ikki-uchta konfiguratsiya va narx bilan qaytamiz.",
    },
    en: {
      title: "What the equipment costs",
      rows: [
        { label: "Components: drives, memory, network cards", price: "from 137,900 UZS", href: SERVER_LINK },
        { label: "Ready servers and video surveillance servers", price: "from 20,374,900 UZS", href: SERVER_LINK },
      ],
      note: "A server for a specific workload is quoted individually: the price depends on core count, memory and the disk subsystem. Send us the number of users and your data volume — we will come back with two or three configurations and a price.",
    },
    tr: {
      title: "Ekipman ne kadar",
      rows: [
        { label: "Bileşenler: diskler, bellek, ağ kartları", price: "137.900 UZS'den", href: SERVER_LINK },
        { label: "Hazır sunucular ve video gözetim sunucuları", price: "20.374.900 UZS'den", href: SERVER_LINK },
      ],
      note: "Belirli bir iş yükü için sunucu ayrıca fiyatlandırılır: fiyat çekirdek sayısına, belleğe ve disk alt sistemine bağlıdır. Kullanıcı sayısını ve veri hacmini gönderin — iki üç konfigürasyon ve fiyatla dönelim.",
    },
    zh: {
      title: "设备价格",
      rows: [
        { label: "配件：硬盘、内存、网卡", price: "137 900 苏姆起", href: SERVER_LINK },
        { label: "整机服务器与视频监控服务器", price: "20 374 900 苏姆起", href: SERVER_LINK },
      ],
      note: "针对具体业务的服务器需单独报价：价格取决于核心数、内存容量与磁盘子系统。请告知用户数量和数据量，我们将提供两到三套配置及报价。",
    },
  },
};

export function servicePrices(serviceKey: string, locale: string): ServicePriceBlock | null {
  const entry = DATA[serviceKey];
  if (!entry) return null;
  const loc = (["ru", "uz", "en", "tr", "zh"] as const).includes(locale as Loc) ? (locale as Loc) : "ru";
  return entry[loc] ?? entry.ru;
}
