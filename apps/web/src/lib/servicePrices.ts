// Ценовой ориентир на страницах услуг.
//
// Зачем: ключи вроде «сервер цена», «установка видеонаблюдения цена» приводят людей на
// страницу услуги, где до сих пор не было ни одной цифры — человек не находил ответ
// на свой вопрос и уходил. Google оценивал такие посадочные как «ниже среднего»
// (0 из 50 ключей имели оценку «выше среднего» по посадочной, замер 21.08.2026).
//
// Цены — минимальные по опубликованным товарам соответствующих разделов каталога,
// сверены по прод-БД 21.08.2026. При заметном изменении прайса обновлять здесь же.
// live — имя раздела каталога: цена «от» берётся из его фасетов при отрисовке (09.10.2026,
// у IP-камер здесь стояло «от 234 900» при живых 209 900). price — запасная, если API не ответил.
// liveSlug — цена конкретной карточки (+ add): у шлагбаумов минимум раздела — пульт за 43 290,
// поэтому «от» берём с базовой модели, а «с установкой» = её цена + монтаж (14.10.2026).
export type PriceRow = { label: string; price: string; href: string; live?: string; liveSlug?: string; add?: number };
export type ServicePriceBlock = { title: string; rows: PriceRow[]; note: string };

type Loc = "ru" | "uz" | "en" | "tr" | "zh";

const CCTV_LINKS = {
  cams: "/products/type/ip-kamery",
  nvr: "/products/type/ip-videoregistratory-nvr",
  kits: "/kits",
};
const SERVER_LINK = "/products/type/servernoe-oborudovanie";
// Шлагбаумы: монтаж «от 1 500 000» — установка и настройка (решение владельца 14.10.2026; реальная
// продажа 16.02.2026 — 1 500 000 с НДС). Фундамент, кабель и индукционная петля — по объекту.
const BARRIER_LINK = "/products/type/shlagbaumy";
const BARRIER_ORDER = "/solutions/barrier#order";
const BARRIER_BASE = "knd-kanihad-shlagbaum-knd-bgm350-l";
const BARRIER_MOUNT = 1500000;

const DATA: Record<string, Record<Loc, ServicePriceBlock>> = {
  barrier: {
    ru: {
      title: "Сколько стоит шлагбаум с установкой",
      rows: [
        { label: "Шлагбаум — оборудование", price: "от 4 082 900 сум", href: BARRIER_LINK, liveSlug: BARRIER_BASE },
        { label: "Установка и настройка", price: "от 1 500 000 сум", href: BARRIER_ORDER },
        { label: "Шлагбаум с установкой", price: "от 5 582 900 сум", href: BARRIER_LINK, liveSlug: BARRIER_BASE, add: BARRIER_MOUNT },
      ],
      note: "Оборудование — по ценам каталога, монтаж — установка и настройка шлагбаума. Фундамент под стойку, прокладка кабеля и индукционная петля считаются по объекту: пришлите ширину проезда и сколько машин проезжает за день — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Oʻrnatish bilan shlagbaum qancha turadi",
      rows: [
        { label: "Shlagbaum — uskuna", price: "4 082 900 soʻmdan", href: BARRIER_LINK, liveSlug: BARRIER_BASE },
        { label: "Oʻrnatish va sozlash", price: "1 500 000 soʻmdan", href: BARRIER_ORDER },
        { label: "Oʻrnatish bilan shlagbaum", price: "5 582 900 soʻmdan", href: BARRIER_LINK, liveSlug: BARRIER_BASE, add: BARRIER_MOUNT },
      ],
      note: "Uskuna — katalog narxlarida, montaj — shlagbaumni oʻrnatish va sozlash. Ustun ostidagi poydevor, kabel yotqizish va induksion halqa obyektga qarab hisoblanadi: kirish yoʻli kengligini va kuniga qancha mashina oʻtishini yuboring — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What a barrier gate with installation costs",
      rows: [
        { label: "Barrier gate — hardware", price: "from 4,082,900 UZS", href: BARRIER_LINK, liveSlug: BARRIER_BASE },
        { label: "Installation and setup", price: "from 1,500,000 UZS", href: BARRIER_ORDER },
        { label: "Barrier gate, installed", price: "from 5,582,900 UZS", href: BARRIER_LINK, liveSlug: BARRIER_BASE, add: BARRIER_MOUNT },
      ],
      note: "Hardware is priced from the catalogue; installation covers mounting and setting up the barrier. The base under the post, cable runs and the induction loop are quoted per site: send us the lane width and how many cars pass per day, and we will return a quote within one working day.",
    },
    tr: {
      title: "Kurulum dahil bariyer ne kadar",
      rows: [
        { label: "Bariyer — ekipman", price: "4.082.900 UZS'den", href: BARRIER_LINK, liveSlug: BARRIER_BASE },
        { label: "Kurulum ve ayar", price: "1.500.000 UZS'den", href: BARRIER_ORDER },
        { label: "Kurulum dahil bariyer", price: "5.582.900 UZS'den", href: BARRIER_LINK, liveSlug: BARRIER_BASE, add: BARRIER_MOUNT },
      ],
      note: "Ekipman katalog fiyatlarıyla, montaj bariyerin kurulumunu ve ayarını kapsar. Direk altı temel, kablo döşeme ve endüksiyon döngüsü sahaya göre hesaplanır: geçiş genişliğini ve günde kaç aracın geçtiğini gönderin, bir iş günü içinde teklif iletelim.",
    },
    zh: {
      title: "道闸含安装多少钱",
      rows: [
        { label: "道闸设备", price: "4 082 900 苏姆起", href: BARRIER_LINK, liveSlug: BARRIER_BASE },
        { label: "安装与调试", price: "1 500 000 苏姆起", href: BARRIER_ORDER },
        { label: "道闸含安装", price: "5 582 900 苏姆起", href: BARRIER_LINK, liveSlug: BARRIER_BASE, add: BARRIER_MOUNT },
      ],
      note: "设备按目录价格计算，安装费包含道闸的安装与调试。立柱基础、线缆敷设和地感线圈按现场另行报价：请告知车道宽度和每日车流量，我们将在一个工作日内提供报价。",
    },
  },
  cctv: {
    ru: {
      title: "Сколько стоит оборудование",
      rows: [
        { label: "IP-камеры", price: "от 234 900 сум", href: CCTV_LINKS.cams, live: "IP-камеры" },
        { label: "Видеорегистраторы (NVR)", price: "от 308 900 сум", href: CCTV_LINKS.nvr, live: "IP-видеорегистраторы (NVR)" },
        { label: "Готовый комплект с монтажом", price: "от 4 000 000 сум", href: CCTV_LINKS.kits },
      ],
      note: "Это цены на оборудование из каталога. Стоимость монтажа зависит от объекта: числа камер, длины трасс и типа стен — посчитайте в калькуляторе или вызовите инженера на замер.",
    },
    uz: {
      title: "Uskuna qancha turadi",
      rows: [
        { label: "IP-kameralar", price: "234 900 soʻmdan", href: CCTV_LINKS.cams, live: "IP-камеры" },
        { label: "Videoregistratorlar (NVR)", price: "308 900 soʻmdan", href: CCTV_LINKS.nvr, live: "IP-видеорегистраторы (NVR)" },
        { label: "Montaj bilan tayyor toʻplam", price: "4 000 000 soʻmdan", href: CCTV_LINKS.kits },
      ],
      note: "Bu — katalogdagi uskuna narxlari. Montaj narxi obyektga bogʻliq: kameralar soni, kabel uzunligi va devor turi. Kalkulyatorda hisoblang yoki muhandisni chaqiring.",
    },
    en: {
      title: "What the equipment costs",
      rows: [
        { label: "IP cameras", price: "from 234,900 UZS", href: CCTV_LINKS.cams, live: "IP-камеры" },
        { label: "Recorders (NVR)", price: "from 308,900 UZS", href: CCTV_LINKS.nvr, live: "IP-видеорегистраторы (NVR)" },
        { label: "Ready kit with installation", price: "from 4,000,000 UZS", href: CCTV_LINKS.kits },
      ],
      note: "These are catalogue prices for hardware. Installation depends on the site — the number of cameras, cable runs and wall type. Use the calculator or book an engineer for a survey.",
    },
    tr: {
      title: "Ekipman ne kadar",
      rows: [
        { label: "IP kameralar", price: "234.900 UZS'den", href: CCTV_LINKS.cams, live: "IP-камеры" },
        { label: "Kayıt cihazları (NVR)", price: "308.900 UZS'den", href: CCTV_LINKS.nvr, live: "IP-видеорегистраторы (NVR)" },
        { label: "Montajlı hazır set", price: "4.000.000 UZS'den", href: CCTV_LINKS.kits },
      ],
      note: "Bunlar katalogdaki donanım fiyatlarıdır. Montaj bedeli sahaya göre değişir: kamera sayısı, kablo uzunluğu ve duvar tipi. Hesaplayıcıyı kullanın veya keşif için mühendis çağırın.",
    },
    zh: {
      title: "设备价格",
      rows: [
        { label: "网络摄像机", price: "234 900 苏姆起", href: CCTV_LINKS.cams, live: "IP-камеры" },
        { label: "录像机（NVR）", price: "308 900 苏姆起", href: CCTV_LINKS.nvr, live: "IP-видеорегистраторы (NVR)" },
        { label: "含安装成套方案", price: "4 000 000 苏姆起", href: CCTV_LINKS.kits },
      ],
      note: "以上为目录中的设备价格。安装费用视现场情况而定：摄像机数量、布线长度与墙体类型。可使用计算器估算，或预约工程师上门勘察。",
    },
  },
  servers: {
    ru: {
      title: "Сколько стоит оборудование",
      rows: [
        { label: "Комплектующие: диски, память, сетевые карты", price: "от 218 900 сум", href: SERVER_LINK, live: "Серверное оборудование" },
        { label: "Готовые серверы и серверы видеонаблюдения", price: "от 20 374 900 сум", href: SERVER_LINK },
      ],
      note: "Сервер под конкретную задачу считается индивидуально: цена зависит от числа ядер, объёма памяти и дисковой подсистемы. Пришлите число пользователей и объём данных — вернёмся с двумя-тремя конфигурациями и ценой.",
    },
    uz: {
      title: "Uskuna qancha turadi",
      rows: [
        { label: "Butlovchilar: disklar, xotira, tarmoq kartalari", price: "218 900 soʻmdan", href: SERVER_LINK, live: "Серверное оборудование" },
        { label: "Tayyor serverlar va videokuzatuv serverlari", price: "20 374 900 soʻmdan", href: SERVER_LINK },
      ],
      note: "Aniq vazifa uchun server alohida hisoblanadi: narx yadrolar soni, xotira hajmi va disk quyi tizimiga bogʻliq. Foydalanuvchilar soni va maʼlumot hajmini yuboring — ikki-uchta konfiguratsiya va narx bilan qaytamiz.",
    },
    en: {
      title: "What the equipment costs",
      rows: [
        { label: "Components: drives, memory, network cards", price: "from 218,900 UZS", href: SERVER_LINK, live: "Серверное оборудование" },
        { label: "Ready servers and video surveillance servers", price: "from 20,374,900 UZS", href: SERVER_LINK },
      ],
      note: "A server for a specific workload is quoted individually: the price depends on core count, memory and the disk subsystem. Send us the number of users and your data volume — we will come back with two or three configurations and a price.",
    },
    tr: {
      title: "Ekipman ne kadar",
      rows: [
        { label: "Bileşenler: diskler, bellek, ağ kartları", price: "218.900 UZS'den", href: SERVER_LINK, live: "Серверное оборудование" },
        { label: "Hazır sunucular ve video gözetim sunucuları", price: "20.374.900 UZS'den", href: SERVER_LINK },
      ],
      note: "Belirli bir iş yükü için sunucu ayrıca fiyatlandırılır: fiyat çekirdek sayısına, belleğe ve disk alt sistemine bağlıdır. Kullanıcı sayısını ve veri hacmini gönderin — iki üç konfigürasyon ve fiyatla dönelim.",
    },
    zh: {
      title: "设备价格",
      rows: [
        { label: "配件：硬盘、内存、网卡", price: "218 900 苏姆起", href: SERVER_LINK, live: "Серверное оборудование" },
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

function fromPrice(n: number, loc: string): string {
  const v = Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  switch (loc) {
    case "uz": return `${v} soʻmdan`;
    case "en": return `from ${v.replace(/ /g, ",")} UZS`;
    case "tr": return `${v.replace(/ /g, ".")} UZS'den`;
    case "zh": return `${v} 苏姆起`;
    default: return `от ${v} сум`;
  }
}

/** Блок с живыми ценами «от» для строк, привязанных к разделу каталога (поле live). */
export async function servicePricesLive(serviceKey: string, locale: string): Promise<ServicePriceBlock | null> {
  const block = servicePrices(serviceKey, locale);
  if (!block) return null;
  const { getProductFacets, getProductBySlug } = await import("@/lib/api");
  const rows = await Promise.all(block.rows.map(async (r) => {
    if (r.liveSlug) {
      try {
        const { product } = await getProductBySlug(r.liveSlug);
        const p = Number(product?.price) || 0;
        return p > 0 ? { ...r, price: fromPrice(p + (r.add ?? 0), locale) } : r;
      } catch {
        return r;
      }
    }
    if (!r.live) return r;
    try {
      const f = await getProductFacets(r.live);
      return f?.price?.min > 0 ? { ...r, price: fromPrice(f.price.min, locale) } : r;
    } catch {
      return r;
    }
  }));
  return { ...block, rows };
}
