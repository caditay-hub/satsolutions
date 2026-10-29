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
// Турникеты (27.10.2026): цены — живые с трёх карточек каталога, минимум раздела (комплектующая Hikvision) не годится.
// Монтаж, считыватели и контроллер — по смете после осмотра проходной, поэтому строки «установка» нет.
// Порядок от дорогого к дешёвому намеренно: heroPrice и minPrice в JSON-LD берут последнюю строку (трипод).
const TURNSTILE_LINK = "/products/type/turnikety-i-shlagbaumy";
const TURNSTILE_FULL = "hik-ds-k3h4410-120";
const TURNSTILE_SPEED = "zkt-zkteco-turniket-steklyannyi-seredina-saturn-s1200";
const TURNSTILE_TRIPOD = "zkt-zkteco-turniket-tripod-ts1000-plus";

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
  turnstile: {
    ru: {
      title: "Турникет: цена в Ташкенте",
      rows: [
        { label: "Полноростовой турникет — оборудование", price: "от 70 289 900 сум", href: TURNSTILE_LINK, liveSlug: TURNSTILE_FULL },
        { label: "Скоростной проход (speed gate)", price: "от 8 042 900 сум", href: TURNSTILE_LINK, liveSlug: TURNSTILE_SPEED },
        { label: "Турникет-трипод — оборудование", price: "от 4 330 900 сум", href: TURNSTILE_LINK, liveSlug: TURNSTILE_TRIPOD },
      ],
      note: "Цены — на оборудование из каталога, живые. Монтаж, считыватели, контроллер и калитка — по смете после осмотра проходной: пришлите число проходов в час и тип идентификации — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Turniket: Toshkentda narxi",
      rows: [
        { label: "Toʻliq boʻyli turniket — uskuna", price: "70 289 900 soʻmdan", href: TURNSTILE_LINK, liveSlug: TURNSTILE_FULL },
        { label: "Tezkor oʻtish yoʻlagi (speed gate)", price: "8 042 900 soʻmdan", href: TURNSTILE_LINK, liveSlug: TURNSTILE_SPEED },
        { label: "Tripod turniket — uskuna", price: "4 330 900 soʻmdan", href: TURNSTILE_LINK, liveSlug: TURNSTILE_TRIPOD },
      ],
      note: "Narxlar — katalogdagi uskunaning joriy narxlari. Montaj, oʻqigichlar, kontroller va kalitka oʻtish punktini koʻrib chiqqandan keyin smeta boʻyicha hisoblanadi: soatiga oʻtishlar sonini va identifikatsiya turini yuboring — ish kuni davomida smeta qaytaramiz.",
    },
    en: {
      title: "Turnstile: price in Tashkent",
      rows: [
        { label: "Full-height turnstile — hardware", price: "from 70,289,900 UZS", href: TURNSTILE_LINK, liveSlug: TURNSTILE_FULL },
        { label: "Speed gate", price: "from 8,042,900 UZS", href: TURNSTILE_LINK, liveSlug: TURNSTILE_SPEED },
        { label: "Tripod turnstile — hardware", price: "from 4,330,900 UZS", href: TURNSTILE_LINK, liveSlug: TURNSTILE_TRIPOD },
      ],
      note: "Live catalogue prices for the hardware. Installation, readers, controller and the gate are quoted after a site survey of the entrance: send the number of passes per hour and the identification type, and we will return an estimate within one working day.",
    },
    tr: {
      title: "Turnike: Taşkent'te fiyat",
      rows: [
        { label: "Tam boy turnike — ekipman", price: "70.289.900 UZS'den", href: TURNSTILE_LINK, liveSlug: TURNSTILE_FULL },
        { label: "Hızlı geçiş (speed gate)", price: "8.042.900 UZS'den", href: TURNSTILE_LINK, liveSlug: TURNSTILE_SPEED },
        { label: "Tripod turnike — ekipman", price: "4.330.900 UZS'den", href: TURNSTILE_LINK, liveSlug: TURNSTILE_TRIPOD },
      ],
      note: "Fiyatlar katalogdaki ekipmanın güncel fiyatlarıdır. Montaj, okuyucular, kontrolör ve kapı, geçiş noktası keşfinden sonra teklifle hesaplanır: saatteki geçiş sayısını ve tanımlama türünü gönderin, bir iş günü içinde teklif iletelim.",
    },
    zh: {
      title: "闸机：塔什干价格",
      rows: [
        { label: "全高闸——设备", price: "70 289 900 苏姆起", href: TURNSTILE_LINK, liveSlug: TURNSTILE_FULL },
        { label: "速通门", price: "8 042 900 苏姆起", href: TURNSTILE_LINK, liveSlug: TURNSTILE_SPEED },
        { label: "三辊闸——设备", price: "4 330 900 苏姆起", href: TURNSTILE_LINK, liveSlug: TURNSTILE_TRIPOD },
      ],
      note: "以上为目录中设备的实时价格。安装、读卡器、控制器和通道门在现场勘察门岗后按预算单独报价：请告知每小时通行人数和识别方式，我们将在一个工作日内回复预算。",
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
  // 27.10.2026 (решение владельца): блоки цен на услугах, где цен не было, — Google по запросам «цена/narxi»
  // отдавал статьи блога вместо услуг. Оборудование — живые цены карточек (liveSlug) или минимум раздела (live),
  // работы — из индекса цен (статья indeks-cen-…, сентябрь 2026). Последняя строка = ориентир «от» для героя и JSON-LD.
  alarm: {
    ru: {
      title: "Сколько стоит охранная сигнализация",
      rows: [
        { label: "Проводная панель Болид Сигнал-20П для офиса и склада", price: "от 1 174 900 сум", href: "/products/type/pribory-i-moduli", liveSlug: "bld-signal-20p-pribor-priemno-kontrolnyi-ohranno-pozharnyi" },
        { label: "Хаб AX PRO отдельно", price: "от 1 335 900 сум", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-l-wb-hub-64" },
        { label: "Беспроводной комплект Hikvision AX PRO: хаб и датчики", price: "от 2 189 900 сум", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-kit-wb" },
      ],
      note: "Цены на оборудование — из каталога, обновляются автоматически. Монтаж зависит от числа датчиков и разделов охраны: в квартире это один визит, на складе — шлейфы, разделы по сменам и вывод на пульт. Пришлите план или число помещений — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Qoʻriqlash signalizatsiyasi qancha turadi",
      rows: [
        { label: "Ofis va ombor uchun simli Bolid Signal-20P paneli", price: "1 174 900 soʻmdan", href: "/products/type/pribory-i-moduli", liveSlug: "bld-signal-20p-pribor-priemno-kontrolnyi-ohranno-pozharnyi" },
        { label: "AX PRO habi alohida", price: "1 335 900 soʻmdan", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-l-wb-hub-64" },
        { label: "Hikvision AX PRO simsiz toʻplami: hab va datchiklar", price: "2 189 900 soʻmdan", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-kit-wb" },
      ],
      note: "Uskuna narxlari — katalogdan, avtomatik yangilanadi. Montaj datchiklar soni va qoʻriqlash boʻlimlariga bogʻliq: kvartirada bu bitta tashrif, omborda — shleyflar, smenalar boʻyicha boʻlimlar va pultga chiqarish. Reja yoki xonalar sonini yuboring — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What a security alarm costs",
      rows: [
        { label: "Bolid Signal-20P wired panel for offices and warehouses", price: "from 1,174,900 UZS", href: "/products/type/pribory-i-moduli", liveSlug: "bld-signal-20p-pribor-priemno-kontrolnyi-ohranno-pozharnyi" },
        { label: "AX PRO hub alone", price: "from 1,335,900 UZS", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-l-wb-hub-64" },
        { label: "Hikvision AX PRO wireless kit: hub and sensors", price: "from 2,189,900 UZS", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-kit-wb" },
      ],
      note: "Equipment prices come from the catalogue and update automatically. Installation depends on the number of sensors and partitions: an apartment is one visit, a warehouse means wired loops, shift partitions and a monitoring-station link. Send a floor plan or room count and we return a quote within one business day.",
    },
    tr: {
      title: "Hırsız alarmı ne kadar",
      rows: [
        { label: "Ofis ve depo için kablolu Bolid Signal-20P paneli", price: "1.174.900 UZS'den", href: "/products/type/pribory-i-moduli", liveSlug: "bld-signal-20p-pribor-priemno-kontrolnyi-ohranno-pozharnyi" },
        { label: "Yalnız AX PRO hub", price: "1.335.900 UZS'den", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-l-wb-hub-64" },
        { label: "Hikvision AX PRO kablosuz set: hub ve sensörler", price: "2.189.900 UZS'den", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-kit-wb" },
      ],
      note: "Ekipman fiyatları katalogdan gelir ve otomatik güncellenir. Montaj, sensör ve bölge sayısına bağlıdır: dairede tek ziyaret, depoda kablolu hatlar, vardiya bölgeleri ve izleme merkezi bağlantısı. Plan veya oda sayısını gönderin, bir iş günü içinde teklif verelim.",
    },
    zh: {
      title: "防盗报警系统价格",
      rows: [
        { label: "面向办公室与仓库的 Bolid Signal-20P 有线主机", price: "1 174 900 苏姆起", href: "/products/type/pribory-i-moduli", liveSlug: "bld-signal-20p-pribor-priemno-kontrolnyi-ohranno-pozharnyi" },
        { label: "AX PRO 主机单独", price: "1 335 900 苏姆起", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-l-wb-hub-64" },
        { label: "海康威视 AX PRO 无线套装：主机与探测器", price: "2 189 900 苏姆起", href: "/products/type/ohrannaya-signalizaciya-ax-pro", liveSlug: "hik-ds-pwa64-kit-wb" },
      ],
      note: "设备价格来自目录并自动更新。安装费用取决于探测器与防区数量：公寓一次上门即可，仓库则需有线防区、按班次分区并接入报警中心。发来平面图或房间数量，我们在一个工作日内报价。",
    },
  },
  network: {
    ru: {
      title: "Сколько стоит СКС и локальная сеть",
      rows: [
        { label: "Прокладка кабеля в коробе или лотке", price: "7 000 сум за метр", href: "/solutions/network#order" },
        { label: "Монтаж розетки RJ-45 с расключением", price: "34 000 сум за точку", href: "/solutions/network#order" },
        { label: "Кабель UTP cat.5e KANIHAD, бухта 305 м", price: "от 432 900 сум", href: "/products/type/sks-vitaya-para", liveSlug: "knd-kabel-utp-kanihad-5-kateg-vnutrennyi-oranzhevyi-4-2-0-5-305-metr" },
        { label: "Точка СКС под ключ: материалы и работы", price: "от 311 000 сум", href: "/solutions/network#order" },
      ],
      note: "Расценки на работы — наши, действующие; минимальный заказ монтажа 560 000 сум. В точку под ключ входят кабель, розетка, патч-панель и патч-корд; коммутатор и шкаф считаются отдельно по каталогу. Пришлите план офиса с числом рабочих мест — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "SKS va lokal tarmoq qancha turadi",
      rows: [
        { label: "Kabelni korob yoki lotokda yotqizish", price: "7 000 soʻm / metr", href: "/solutions/network#order" },
        { label: "RJ-45 rozetkasini oʻrnatish va ulash", price: "34 000 soʻm / nuqta", href: "/solutions/network#order" },
        { label: "UTP cat.5e KANIHAD kabeli, 305 m oʻram", price: "432 900 soʻmdan", href: "/products/type/sks-vitaya-para", liveSlug: "knd-kabel-utp-kanihad-5-kateg-vnutrennyi-oranzhevyi-4-2-0-5-305-metr" },
        { label: "SKS nuqtasi toʻliq tayyor holda: materiallar va ishlar", price: "311 000 soʻmdan", href: "/solutions/network#order" },
      ],
      note: "Ish narxlari — bizning amaldagi narxlarimiz; montajning eng kam buyurtmasi 560 000 soʻm. Toʻliq tayyor nuqtaga kabel, rozetka, patch-panel va patch-kord kiradi; kommutator va shkaf katalog boʻyicha alohida hisoblanadi. Ish oʻrinlari soni bilan ofis rejasini yuboring — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What structured cabling and a LAN cost",
      rows: [
        { label: "Cable run in trunking or tray", price: "7,000 UZS per metre", href: "/solutions/network#order" },
        { label: "RJ-45 outlet fitted and terminated", price: "34,000 UZS per point", href: "/solutions/network#order" },
        { label: "KANIHAD UTP cat.5e cable, 305 m box", price: "from 432,900 UZS", href: "/products/type/sks-vitaya-para", liveSlug: "knd-kabel-utp-kanihad-5-kateg-vnutrennyi-oranzhevyi-4-2-0-5-305-metr" },
        { label: "Turnkey cabling point: materials and labour", price: "from 311,000 UZS", href: "/solutions/network#order" },
      ],
      note: "Labour rates are our current rates; the minimum installation order is 560,000 UZS. A turnkey point includes cable, outlet, patch panel and patch cord; the switch and cabinet are priced separately from the catalogue. Send an office plan with the number of workplaces and we return a quote within one business day.",
    },
    tr: {
      title: "Yapısal kablolama ve yerel ağ ne kadar",
      rows: [
        { label: "Kanal veya tavada kablo çekimi", price: "7.000 UZS / metre", href: "/solutions/network#order" },
        { label: "RJ-45 priz montajı ve sonlandırma", price: "34.000 UZS / nokta", href: "/solutions/network#order" },
        { label: "KANIHAD UTP cat.5e kablo, 305 m kutu", price: "432.900 UZS'den", href: "/products/type/sks-vitaya-para", liveSlug: "knd-kabel-utp-kanihad-5-kateg-vnutrennyi-oranzhevyi-4-2-0-5-305-metr" },
        { label: "Anahtar teslim kablolama noktası: malzeme ve işçilik", price: "311.000 UZS'den", href: "/solutions/network#order" },
      ],
      note: "İşçilik fiyatları güncel fiyatlarımızdır; asgari montaj siparişi 560.000 UZS. Anahtar teslim noktaya kablo, priz, patch panel ve patch kablo dahildir; switch ve kabinet katalogdan ayrıca hesaplanır. Çalışma yeri sayısıyla ofis planını gönderin, bir iş günü içinde teklif verelim.",
    },
    zh: {
      title: "综合布线与局域网价格",
      rows: [
        { label: "线槽或桥架内敷设线缆", price: "7 000 苏姆/米", href: "/solutions/network#order" },
        { label: "RJ-45 信息插座安装与端接", price: "34 000 苏姆/点", href: "/solutions/network#order" },
        { label: "KANIHAD UTP cat.5e 网线，305 米/箱", price: "432 900 苏姆起", href: "/products/type/sks-vitaya-para", liveSlug: "knd-kabel-utp-kanihad-5-kateg-vnutrennyi-oranzhevyi-4-2-0-5-305-metr" },
        { label: "每个信息点整体价格：材料与人工", price: "311 000 苏姆起", href: "/solutions/network#order" },
      ],
      note: "人工单价为我们的现行价格，安装最低起订 560 000 苏姆。整体信息点含线缆、插座、配线架与跳线；交换机与机柜按目录另计。发来标有工位数量的办公室平面图，我们在一个工作日内报价。",
    },
  },
  fiber: {
    ru: {
      title: "Сколько стоит оптика и ВОЛС",
      rows: [
        { label: "Сварка оптического волокна и измерения", price: "по смете: число волокон и муфт", href: "/solutions/fiber#order" },
        { label: "SFP-модуль WDM 1,25G, дальность 3 км", price: "от 168 900 сум", href: "/products/type/sfp-moduli-i-transivery", liveSlug: "pxt-pxt-sfp-w35-3" },
        { label: "Абонентский терминал ONU (GPON/XPON)", price: "от 159 900 сум", href: "/products/type/pon-oborudovanie", live: "PON-оборудование" },
      ],
      note: "Цены на оборудование — из каталога, обновляются автоматически. Стоимость линии зависит от длины трассы, способа прокладки (канализация, опоры, в здании) и числа сварок. Пришлите точки подключения на карте — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Optika va VOLS qancha turadi",
      rows: [
        { label: "Optik tolani payvandlash va oʻlchash", price: "smeta boʻyicha: tolalar va muftalar soni", href: "/solutions/fiber#order" },
        { label: "SFP WDM 1,25G moduli, 3 km", price: "168 900 soʻmdan", href: "/products/type/sfp-moduli-i-transivery", liveSlug: "pxt-pxt-sfp-w35-3" },
        { label: "ONU abonent terminali (GPON/XPON)", price: "159 900 soʻmdan", href: "/products/type/pon-oborudovanie", live: "PON-оборудование" },
      ],
      note: "Uskuna narxlari — katalogdan, avtomatik yangilanadi. Liniya narxi trassa uzunligi, yotqizish usuli (kanalizatsiya, ustunlar, bino ichi) va payvandlar soniga bogʻliq. Ulanish nuqtalarini xaritada yuboring — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What fibre optics cost",
      rows: [
        { label: "Fibre splicing and testing", price: "quoted by fibre and closure count", href: "/solutions/fiber#order" },
        { label: "SFP WDM 1.25G module, 3 km reach", price: "from 168,900 UZS", href: "/products/type/sfp-moduli-i-transivery", liveSlug: "pxt-pxt-sfp-w35-3" },
        { label: "ONU subscriber terminal (GPON/XPON)", price: "from 159,900 UZS", href: "/products/type/pon-oborudovanie", live: "PON-оборудование" },
      ],
      note: "Equipment prices come from the catalogue and update automatically. A line is priced by route length, laying method (ducts, poles, indoors) and splice count. Send the connection points on a map and we return a quote within one business day.",
    },
    tr: {
      title: "Fiber optik ne kadar",
      rows: [
        { label: "Fiber ekleme ve ölçüm", price: "fiber ve ek kutusu sayısına göre teklif", href: "/solutions/fiber#order" },
        { label: "SFP WDM 1,25G modül, 3 km", price: "168.900 UZS'den", href: "/products/type/sfp-moduli-i-transivery", liveSlug: "pxt-pxt-sfp-w35-3" },
        { label: "ONU abone terminali (GPON/XPON)", price: "159.900 UZS'den", href: "/products/type/pon-oborudovanie", live: "PON-оборудование" },
      ],
      note: "Ekipman fiyatları katalogdan gelir ve otomatik güncellenir. Hat bedeli güzergâh uzunluğuna, döşeme yöntemine (kanal, direk, bina içi) ve ek sayısına bağlıdır. Bağlantı noktalarını haritada gönderin, bir iş günü içinde teklif verelim.",
    },
    zh: {
      title: "光纤与光缆线路价格",
      rows: [
        { label: "光纤熔接与测试", price: "按纤芯与接续盒数量报价", href: "/solutions/fiber#order" },
        { label: "SFP WDM 1.25G 光模块，3 公里", price: "168 900 苏姆起", href: "/products/type/sfp-moduli-i-transivery", liveSlug: "pxt-pxt-sfp-w35-3" },
        { label: "ONU 用户终端（GPON/XPON）", price: "159 900 苏姆起", href: "/products/type/pon-oborudovanie", live: "PON-оборудование" },
      ],
      note: "设备价格来自目录并自动更新。线路费用取决于路由长度、敷设方式（管道、杆路、楼内）和熔接点数量。发来地图上的接入点，我们在一个工作日内报价。",
    },
  },
  smarthome: {
    ru: {
      title: "Сколько стоит оборудование умного дома",
      rows: [
        { label: "Хаб Tapo H200: центр сценариев", price: "от 333 900 сум", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-h200" },
        { label: "Умный выключатель Tapo S210", price: "от 172 900 сум", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-s210" },
        { label: "Датчик движения Tapo T100", price: "от 122 900 сум", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t100" },
        { label: "Датчик открытия двери и окна Tapo T110", price: "от 110 900 сум", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t110" },
        { label: "Стартовый набор для квартиры: хаб, два датчика и выключатель", price: "от 740 000 сум", href: "/products/group/umnyy-dom" },
      ],
      note: "Цены — из каталога, обновляются автоматически. Стартовый набор для квартиры (хаб, два датчика и выключатель) выходит около 740 000 сум; сценарии «ушли из дома», «ночь» и уведомления настраиваем при монтаже. Пришлите план квартиры — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Aqlli uy uskunalari qancha turadi",
      rows: [
        { label: "Tapo H200 habi: ssenariylar markazi", price: "333 900 soʻmdan", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-h200" },
        { label: "Aqlli vyklyuchatel Tapo S210", price: "172 900 soʻmdan", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-s210" },
        { label: "Harakat datchigi Tapo T100", price: "122 900 soʻmdan", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t100" },
        { label: "Eshik va deraza ochilish datchigi Tapo T110", price: "110 900 soʻmdan", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t110" },
        { label: "Kvartira uchun boshlangʻich toʻplam: hab, ikki datchik va vyklyuchatel", price: "740 000 soʻmdan", href: "/products/group/umnyy-dom" },
      ],
      note: "Narxlar — katalogdan, avtomatik yangilanadi. Kvartira uchun boshlangʻich toʻplam (hab, ikki datchik va vyklyuchatel) taxminan 740 000 soʻm; «uydan chiqdik», «tun» ssenariylari va xabarnomalarni montajda sozlaymiz. Kvartira rejasini yuboring — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What smart home equipment costs",
      rows: [
        { label: "Tapo H200 hub: automation centre", price: "from 333,900 UZS", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-h200" },
        { label: "Tapo S210 smart switch", price: "from 172,900 UZS", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-s210" },
        { label: "Tapo T100 motion sensor", price: "from 122,900 UZS", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t100" },
        { label: "Tapo T110 door and window sensor", price: "from 110,900 UZS", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t110" },
        { label: "Apartment starter set: hub, two sensors and a switch", price: "from 740,000 UZS", href: "/products/group/umnyy-dom" },
      ],
      note: "Prices come from the catalogue and update automatically. A starter set for an apartment (hub, two sensors and a switch) is about 740,000 UZS; the away, night and alert scenes are configured at installation. Send a floor plan and we return a quote within one business day.",
    },
    tr: {
      title: "Akıllı ev ekipmanları ne kadar",
      rows: [
        { label: "Tapo H200 hub: senaryo merkezi", price: "333.900 UZS'den", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-h200" },
        { label: "Tapo S210 akıllı anahtar", price: "172.900 UZS'den", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-s210" },
        { label: "Tapo T100 hareket sensörü", price: "122.900 UZS'den", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t100" },
        { label: "Tapo T110 kapı ve pencere sensörü", price: "110.900 UZS'den", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t110" },
        { label: "Daire başlangıç seti: hub, iki sensör ve anahtar", price: "740.000 UZS'den", href: "/products/group/umnyy-dom" },
      ],
      note: "Fiyatlar katalogdan gelir ve otomatik güncellenir. Daire için başlangıç seti (hub, iki sensör ve anahtar) yaklaşık 740.000 UZS; evden çıkış, gece ve bildirim senaryoları montajda ayarlanır. Daire planını gönderin, bir iş günü içinde teklif verelim.",
    },
    zh: {
      title: "智能家居设备价格",
      rows: [
        { label: "Tapo H200 网关：场景中枢", price: "333 900 苏姆起", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-h200" },
        { label: "Tapo S210 智能开关", price: "172 900 苏姆起", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-s210" },
        { label: "Tapo T100 人体移动传感器", price: "122 900 苏姆起", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t100" },
        { label: "Tapo T110 门窗传感器", price: "110 900 苏姆起", href: "/products/group/umnyy-dom", liveSlug: "tapo-tapo-t110" },
        { label: "公寓入门套装：网关、两个传感器和一个开关", price: "740 000 苏姆起", href: "/products/group/umnyy-dom" },
      ],
      note: "价格来自目录并自动更新。公寓入门套装（网关、两个传感器和一个开关）约 740 000 苏姆；离家、夜间与通知场景在安装时配置。发来户型图，我们在一个工作日内报价。",
    },
  },
  gates: {
    ru: {
      title: "Сколько стоит автоматика для ворот",
      rows: [
        { label: "Привод распашных ворот ZKTeco ZK-SW300DC, створка до 300 кг", price: "от 6 186 900 сум", href: "/products/zkt-zk-sw300dc", liveSlug: "zkt-zk-sw300dc" },
        { label: "Привод распашных ворот ZKTeco ZK-SW400DC, створка до 400 кг", price: "от 5 939 900 сум", href: "/products/zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc", liveSlug: "zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc" },
      ],
      note: "Цены на комплект привода — из каталога, обновляются автоматически. Монтаж, закладные, кабель и фотоэлементы считаются по объекту: пришлите фото ворот, ширину и вес створок — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Darvoza avtomatikasi qancha turadi",
      rows: [
        { label: "ZKTeco ZK-SW300DC ochiladigan darvoza yuritmasi, tavaqa 300 kg gacha", price: "6 186 900 soʻmdan", href: "/products/zkt-zk-sw300dc", liveSlug: "zkt-zk-sw300dc" },
        { label: "ZKTeco ZK-SW400DC ochiladigan darvoza yuritmasi, tavaqa 400 kg gacha", price: "5 939 900 soʻmdan", href: "/products/zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc", liveSlug: "zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc" },
      ],
      note: "Yuritma toʻplami narxlari — katalogdan, avtomatik yangilanadi. Montaj, oʻrnatma detallar, kabel va fotoelementlar obyektga qarab hisoblanadi: darvoza suratini, tavaqalar kengligi va vaznini yuboring — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What gate automation costs",
      rows: [
        { label: "ZKTeco ZK-SW300DC swing gate operator, leaf up to 300 kg", price: "from 6,186,900 UZS", href: "/products/zkt-zk-sw300dc", liveSlug: "zkt-zk-sw300dc" },
        { label: "ZKTeco ZK-SW400DC swing gate operator, leaf up to 400 kg", price: "from 5,939,900 UZS", href: "/products/zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc", liveSlug: "zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc" },
      ],
      note: "Operator kit prices come from the catalogue and update automatically. Installation, embedded parts, cabling and photocells are priced per site: send photos of the gate with leaf width and weight and we return a quote within one business day.",
    },
    tr: {
      title: "Kapı otomasyonu ne kadar",
      rows: [
        { label: "ZKTeco ZK-SW300DC kanatlı kapı motoru, kanat 300 kg’a kadar", price: "6.186.900 UZS'den", href: "/products/zkt-zk-sw300dc", liveSlug: "zkt-zk-sw300dc" },
        { label: "ZKTeco ZK-SW400DC kanatlı kapı motoru, kanat 400 kg’a kadar", price: "5.939.900 UZS'den", href: "/products/zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc", liveSlug: "zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc" },
      ],
      note: "Motor seti fiyatları katalogdan gelir ve otomatik güncellenir. Montaj, ankraj parçaları, kablo ve fotoseller sahaya göre hesaplanır: kapının fotoğrafını, kanat genişliğini ve ağırlığını gönderin, bir iş günü içinde teklif verelim.",
    },
    zh: {
      title: "自动门驱动价格",
      rows: [
        { label: "ZKTeco ZK-SW300DC 平开门驱动，单扇门体 300 公斤以内", price: "6 186 900 苏姆起", href: "/products/zkt-zk-sw300dc", liveSlug: "zkt-zk-sw300dc" },
        { label: "ZKTeco ZK-SW400DC 平开门驱动，单扇门体 400 公斤以内", price: "5 939 900 苏姆起", href: "/products/zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc", liveSlug: "zkt-zkteco-avtomatika-dlya-vorot-zk-sw400dc" },
      ],
      note: "驱动套装价格来自目录并自动更新。安装、预埋件、布线与光电保护按现场另计：发来大门照片及门扇宽度与重量，我们在一个工作日内报价。",
    },
  },
  attendance: {
    ru: {
      title: "Сколько стоит учёт рабочего времени",
      rows: [
        { label: "Карта доступа Mifare для сотрудника", price: "от 7 390 сум", href: "/products/type/terminaly-i-schityvateli" },
        { label: "Терминал распознавания лиц Hikvision DS-K1T342", price: "от 1 422 900 сум", href: "/products/type/terminaly-i-schityvateli", liveSlug: "hik-ds-k1t342mx" },
        { label: "Терминал учёта по карте и отпечатку", price: "от 432 900 сум", href: "/products/type/terminaly-i-schityvateli" },
      ],
      note: "Цены на оборудование — из каталога и нашей статьи о системах учёта. Табель, отчёты и приложение SAT Davomat настраиваем при запуске; монтаж терминала и подключение к турникету — по смете. Напишите число сотрудников и точек прохода — вернём расчёт в течение рабочего дня.",
    },
    uz: {
      title: "Ish vaqtini hisobga olish qancha turadi",
      rows: [
        { label: "Xodim uchun Mifare kirish kartasi", price: "7 390 soʻmdan", href: "/products/type/terminaly-i-schityvateli" },
        { label: "Hikvision DS-K1T342 yuzni tanish terminali", price: "1 422 900 soʻmdan", href: "/products/type/terminaly-i-schityvateli", liveSlug: "hik-ds-k1t342mx" },
        { label: "Karta va barmoq izi boʻyicha hisob terminali", price: "432 900 soʻmdan", href: "/products/type/terminaly-i-schityvateli" },
      ],
      note: "Uskuna narxlari — katalogdan va hisob tizimlari haqidagi maqolamizdan. Tabel, hisobotlar va SAT Davomat ilovasini ishga tushirishda sozlaymiz; terminal montaji va turniketga ulash — smeta boʻyicha. Xodimlar va oʻtish nuqtalari sonini yozing — ish kuni davomida hisob-kitob yuboramiz.",
    },
    en: {
      title: "What a time and attendance system costs",
      rows: [
        { label: "Mifare access card per employee", price: "from 7,390 UZS", href: "/products/type/terminaly-i-schityvateli" },
        { label: "Hikvision DS-K1T342 face recognition terminal", price: "from 1,422,900 UZS", href: "/products/type/terminaly-i-schityvateli", liveSlug: "hik-ds-k1t342mx" },
        { label: "Card and fingerprint attendance terminal", price: "from 432,900 UZS", href: "/products/type/terminaly-i-schityvateli" },
      ],
      note: "Equipment prices come from the catalogue and our article on attendance systems. Timesheets, reports and the SAT Davomat app are set up at launch; terminal installation and turnstile integration are quoted. Tell us the headcount and the number of entry points and we return a calculation within one business day.",
    },
    tr: {
      title: "Mesai takip sistemi ne kadar",
      rows: [
        { label: "Çalışan başına Mifare kart", price: "7.390 UZS'den", href: "/products/type/terminaly-i-schityvateli" },
        { label: "Hikvision DS-K1T342 yüz tanıma terminali", price: "1.422.900 UZS'den", href: "/products/type/terminaly-i-schityvateli", liveSlug: "hik-ds-k1t342mx" },
        { label: "Kart ve parmak izi mesai terminali", price: "432.900 UZS'den", href: "/products/type/terminaly-i-schityvateli" },
      ],
      note: "Ekipman fiyatları katalogdan ve mesai sistemleri yazımızdan. Puantaj, raporlar ve SAT Davomat uygulaması devreye almada kurulur; terminal montajı ve turnike bağlantısı tekliflendirilir. Çalışan ve geçiş noktası sayısını yazın, bir iş günü içinde hesap gönderelim.",
    },
    zh: {
      title: "考勤系统价格",
      rows: [
        { label: "员工 Mifare 卡", price: "7 390 苏姆起", href: "/products/type/terminaly-i-schityvateli" },
        { label: "海康威视 DS-K1T342 人脸识别终端", price: "1 422 900 苏姆起", href: "/products/type/terminaly-i-schityvateli", liveSlug: "hik-ds-k1t342mx" },
        { label: "刷卡与指纹考勤终端", price: "432 900 苏姆起", href: "/products/type/terminaly-i-schityvateli" },
      ],
      note: "设备价格来自目录及我们关于考勤系统的文章。考勤表、报表与 SAT Davomat 应用在上线时配置；终端安装与闸机联动另行报价。告知员工人数与通道数量，我们在一个工作日内给出测算。",
    },
  },
  telephony: {
    ru: {
      title: "Сколько стоит IP-телефония для офиса",
      rows: [
        { label: "Гарнитура Fanvil HT201 для оператора", price: "от 616 900 сум", href: "/products/group/ip-telefoniya", liveSlug: "pxt-ht201" },
        { label: "IP-телефон Fanvil X2CP для колл-центра", price: "от 565 900 сум", href: "/products/group/ip-telefoniya", liveSlug: "pxt-x2cp" },
        { label: "IP-телефон Fanvil V50P для рабочего места", price: "от 507 900 сум", href: "/products/group/ip-telefoniya", liveSlug: "pxt-v50p" },
      ],
      note: "Цены на телефоны — из каталога, обновляются автоматически. АТС, многоканальный номер и настройка меню считаются по числу внутренних номеров и одновременных разговоров. Напишите, сколько сотрудников и филиалов — вернём смету в течение рабочего дня.",
    },
    uz: {
      title: "Ofis uchun IP-telefoniya qancha turadi",
      rows: [
        { label: "Operator uchun Fanvil HT201 garniturasi", price: "616 900 soʻmdan", href: "/products/group/ip-telefoniya", liveSlug: "pxt-ht201" },
        { label: "Koll-markaz uchun Fanvil X2CP IP-telefoni", price: "565 900 soʻmdan", href: "/products/group/ip-telefoniya", liveSlug: "pxt-x2cp" },
        { label: "Ish oʻrni uchun Fanvil V50P IP-telefoni", price: "507 900 soʻmdan", href: "/products/group/ip-telefoniya", liveSlug: "pxt-v50p" },
      ],
      note: "Telefon narxlari — katalogdan, avtomatik yangilanadi. ATS, koʻp kanalli raqam va menyu sozlash ichki raqamlar va bir vaqtdagi suhbatlar soniga qarab hisoblanadi. Xodimlar va filiallar sonini yozing — ish kuni davomida smeta yuboramiz.",
    },
    en: {
      title: "What office IP telephony costs",
      rows: [
        { label: "Fanvil HT201 operator headset", price: "from 616,900 UZS", href: "/products/group/ip-telefoniya", liveSlug: "pxt-ht201" },
        { label: "Fanvil X2CP IP phone for call centres", price: "from 565,900 UZS", href: "/products/group/ip-telefoniya", liveSlug: "pxt-x2cp" },
        { label: "Fanvil V50P desk IP phone", price: "from 507,900 UZS", href: "/products/group/ip-telefoniya", liveSlug: "pxt-v50p" },
      ],
      note: "Phone prices come from the catalogue and update automatically. The PBX, multi-line number and menu setup are priced by the number of extensions and concurrent calls. Tell us how many staff and branches you have and we return a quote within one business day.",
    },
    tr: {
      title: "Ofis IP telefonu ne kadar",
      rows: [
        { label: "Operatör için Fanvil HT201 kulaklık", price: "616.900 UZS'den", href: "/products/group/ip-telefoniya", liveSlug: "pxt-ht201" },
        { label: "Çağrı merkezi için Fanvil X2CP IP telefon", price: "565.900 UZS'den", href: "/products/group/ip-telefoniya", liveSlug: "pxt-x2cp" },
        { label: "Masa için Fanvil V50P IP telefon", price: "507.900 UZS'den", href: "/products/group/ip-telefoniya", liveSlug: "pxt-v50p" },
      ],
      note: "Telefon fiyatları katalogdan gelir ve otomatik güncellenir. Santral, çok kanallı numara ve menü kurulumu dahili ve eş zamanlı görüşme sayısına göre hesaplanır. Çalışan ve şube sayısını yazın, bir iş günü içinde teklif verelim.",
    },
    zh: {
      title: "办公室 IP 电话价格",
      rows: [
        { label: "话务员耳机 Fanvil HT201", price: "616 900 苏姆起", href: "/products/group/ip-telefoniya", liveSlug: "pxt-ht201" },
        { label: "呼叫中心 IP 话机 Fanvil X2CP", price: "565 900 苏姆起", href: "/products/group/ip-telefoniya", liveSlug: "pxt-x2cp" },
        { label: "办公桌 IP 话机 Fanvil V50P", price: "507 900 苏姆起", href: "/products/group/ip-telefoniya", liveSlug: "pxt-v50p" },
      ],
      note: "话机价格来自目录并自动更新。交换机、多线路号码与语音菜单按分机数与并发通话数计价。告知员工与分支机构数量，我们在一个工作日内报价。",
    },
  },
  wifi: {
    ru: {
      title: "Сколько стоит Wi-Fi для офиса",
      rows: [
        { label: "Наружная точка доступа TP-Link EAP225-Outdoor", price: "от 729 900 сум", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap225-outdoor" },
        { label: "Радиомост между зданиями, комплект из двух", price: "от 432 900 сум", href: "/products/type/radiomosty", live: "Радиомосты" },
        { label: "Монтаж и настройка точки доступа", price: "110 000 сум за точку", href: "/solutions/wifi#order" },
        { label: "Точка доступа TP-Link EAP115 для офиса", price: "от 382 900 сум", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap115" },
      ],
      note: "Цены на оборудование — из каталога, обновляются автоматически; расценка на монтаж — наша, действующая. Число точек зависит от площади, стен и количества устройств: пришлите план этажа — вернём схему покрытия и смету в течение рабочего дня.",
    },
    uz: {
      title: "Ofis uchun Wi-Fi qancha turadi",
      rows: [
        { label: "Tashqi kirish nuqtasi TP-Link EAP225-Outdoor", price: "729 900 soʻmdan", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap225-outdoor" },
        { label: "Binolar orasidagi radiokoʻprik, ikkitadan toʻplam", price: "432 900 soʻmdan", href: "/products/type/radiomosty", live: "Радиомосты" },
        { label: "Kirish nuqtasini oʻrnatish va sozlash", price: "110 000 soʻm / nuqta", href: "/solutions/wifi#order" },
        { label: "Ofis uchun kirish nuqtasi TP-Link EAP115", price: "382 900 soʻmdan", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap115" },
      ],
      note: "Uskuna narxlari — katalogdan, avtomatik yangilanadi; montaj narxi — bizning amaldagi narximiz. Nuqtalar soni maydon, devorlar va qurilmalar soniga bogʻliq: qavat rejasini yuboring — ish kuni davomida qamrov sxemasi va smeta yuboramiz.",
    },
    en: {
      title: "What office Wi-Fi costs",
      rows: [
        { label: "TP-Link EAP225-Outdoor access point", price: "from 729,900 UZS", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap225-outdoor" },
        { label: "Building-to-building radio bridge, pair", price: "from 432,900 UZS", href: "/products/type/radiomosty", live: "Радиомосты" },
        { label: "Access point installed and configured", price: "110,000 UZS per point", href: "/solutions/wifi#order" },
        { label: "TP-Link EAP115 office access point", price: "from 382,900 UZS", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap115" },
      ],
      note: "Equipment prices come from the catalogue and update automatically; the installation rate is our current rate. The number of access points depends on area, walls and device count: send a floor plan and we return a coverage layout and quote within one business day.",
    },
    tr: {
      title: "Ofis Wi-Fi ne kadar",
      rows: [
        { label: "Dış ortam erişim noktası TP-Link EAP225-Outdoor", price: "729.900 UZS'den", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap225-outdoor" },
        { label: "Binalar arası radyo köprü, çift", price: "432.900 UZS'den", href: "/products/type/radiomosty", live: "Радиомосты" },
        { label: "Erişim noktası montajı ve ayarı", price: "110.000 UZS / nokta", href: "/solutions/wifi#order" },
        { label: "Ofis için erişim noktası TP-Link EAP115", price: "382.900 UZS'den", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap115" },
      ],
      note: "Ekipman fiyatları katalogdan gelir ve otomatik güncellenir; montaj bedeli güncel fiyatımızdır. Erişim noktası sayısı alana, duvarlara ve cihaz sayısına bağlıdır: kat planını gönderin, bir iş günü içinde kapsama şeması ve teklif verelim.",
    },
    zh: {
      title: "办公室 Wi-Fi 价格",
      rows: [
        { label: "室外无线接入点 TP-Link EAP225-Outdoor", price: "729 900 苏姆起", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap225-outdoor" },
        { label: "楼宇间无线网桥（一对）", price: "432 900 苏姆起", href: "/products/type/radiomosty", live: "Радиомосты" },
        { label: "接入点安装与调试", price: "110 000 苏姆/点", href: "/solutions/wifi#order" },
        { label: "办公室无线接入点 TP-Link EAP115", price: "382 900 苏姆起", href: "/products/type/wi-fi-tochki-dostupa", liveSlug: "tpl-tp-link-eap115" },
      ],
      note: "设备价格来自目录并自动更新；安装单价为我们的现行价格。接入点数量取决于面积、墙体与终端数量：发来楼层平面图，我们在一个工作日内给出覆盖方案与报价。",
    },
  },
  "slabotochnye-sistemy": {
    ru: {
      title: "Сколько стоят слаботочные системы под ключ",
      rows: [
        { label: "Офис 300 м²: видеонаблюдение, СКУД, пожарная сигнализация и сеть — работы", price: "13,9–17,4 млн сум", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Магазин 200 м²: видеонаблюдение на 8 камер — работы", price: "3,9–4,9 млн сум", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Частный дом 250 м²: видеонаблюдение на 6 камер — работы", price: "от 3 200 000 сум", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      ],
      note: "Это стоимость работ для типовых объектов; оборудование считаем отдельно по каталогу. Для точной сметы пришлите план объекта и список систем — вернём расчёт в течение рабочего дня.",
    },
    uz: {
      title: "Kuchsiz tok tizimlari toʻliq tayyor holda qancha turadi",
      rows: [
        { label: "Ofis 300 m²: videokuzatuv, SKUD, yongʻin signalizatsiyasi va tarmoq — ishlar", price: "13,9–17,4 mln soʻm", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Doʻkon 200 m²: 8 kamerali videokuzatuv — ishlar", price: "3,9–4,9 mln soʻm", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Xususiy uy 250 m²: 6 kamerali videokuzatuv — ishlar", price: "3 200 000 soʻmdan", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      ],
      note: "Bu — tipik obyektlar uchun ishlar narxi; uskunani katalog boʻyicha alohida hisoblaymiz. Aniq smeta uchun obyekt rejasi va tizimlar roʻyxatini yuboring — ish kuni davomida hisob-kitob yuboramiz.",
    },
    en: {
      title: "What turnkey low-voltage systems cost",
      rows: [
        { label: "Office 300 m²: CCTV, access control, fire alarm and network — labour", price: "13.9–17.4 M UZS", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Shop 200 m²: 8-camera CCTV — labour", price: "3.9–4.9 M UZS", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "House 250 m²: 6-camera CCTV — labour", price: "from 3,200,000 UZS", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      ],
      note: "These are labour costs for typical sites; equipment is priced separately from the catalogue. For an exact quote send the site plan and the list of systems and we return a calculation within one business day.",
    },
    tr: {
      title: "Anahtar teslim zayıf akım sistemleri ne kadar",
      rows: [
        { label: "Ofis 300 m²: kamera, geçiş kontrol, yangın alarmı ve ağ — işçilik", price: "13,9–17,4 milyon UZS", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Mağaza 200 m²: 8 kameralı sistem — işçilik", price: "3,9–4,9 milyon UZS", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "Müstakil ev 250 m²: 6 kameralı sistem — işçilik", price: "3.200.000 UZS'den", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      ],
      note: "Bunlar tipik sahalar için işçilik bedelleridir; ekipman katalogdan ayrıca hesaplanır. Kesin teklif için saha planını ve sistem listesini gönderin, bir iş günü içinde hesap verelim.",
    },
    zh: {
      title: "弱电系统整体价格",
      rows: [
        { label: "300 平方米办公室：监控、门禁、火灾报警与网络——人工", price: "1390–1740 万苏姆", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "200 平方米门店：8 路监控——人工", price: "390–490 万苏姆", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
        { label: "250 平方米住宅：6 路监控——人工", price: "3 200 000 苏姆起", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      ],
      note: "以上为典型现场的人工费用；设备按目录另计。如需精确报价，请发来现场平面图与系统清单，我们在一个工作日内给出测算。",
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
