// Переводы названий категорий/типов и групп каталога на uz/en/tr/zh.
// Ключ = русское имя (как в CATALOG_GROUPS и в поле type товара). RU — исходник и фолбэк.
// Используется в мега-меню, на /categories, в крошках, заголовках и фильтре по типу.
import { routing } from "@/i18n/routing";

// ru — необязательный оверрайд отображаемого имени для русского (переименование типа
// БЕЗ смены имени категории в БД и без смены slug/URL). Не задан — берётся имя из БД.
type Loc = { ru?: string; uz: string; en: string; tr: string; zh: string };

const CAT_NAMES: Record<string, Loc> = {
  // ── Группы ──────────────────────────────────────────────────────────────
  "Видеонаблюдение": { uz: "Videokuzatuv", en: "Video surveillance", tr: "Video gözetim", zh: "视频监控" },
  "Контроль доступа": { uz: "Kirishni nazorat qilish", en: "Access control", tr: "Geçiş kontrolü", zh: "门禁控制" },
  "Охранно-пожарная": { ru: "Охранно-пожарные системы", uz: "Qo'riqlash va yong'in tizimlari", en: "Security & fire systems", tr: "Güvenlik ve yangın sistemleri", zh: "安防与消防系统" },
  "Домофония": { uz: "Domofoniya", en: "Intercoms", tr: "İnterkom", zh: "楼宇对讲" },
  "IP-телефония": { uz: "IP-telefoniya", en: "IP telephony", tr: "IP telefon", zh: "IP电话" },
  "Умный дом": { uz: "Aqlli uy", en: "Smart home", tr: "Akıllı ev", zh: "智能家居" },
  "Сетевое оборудование": { uz: "Tarmoq uskunalari", en: "Networking", tr: "Ağ ekipmanları", zh: "网络设备" },
  "Wi-Fi и беспроводное": { uz: "Wi-Fi va simsiz", en: "Wi-Fi & wireless", tr: "Wi-Fi ve kablosuz", zh: "Wi-Fi与无线" },
  "СКС, кабель, оптика": { uz: "SKS, kabel, optika", en: "Cabling, cable, fiber", tr: "Kablolama, kablo, fiber", zh: "综合布线、线缆、光纤" },
  "Питание и шкафы": { uz: "Quvvat va shkaflar", en: "Power & cabinets", tr: "Güç ve kabinler", zh: "电源与机柜" },
  "Дисплеи": { uz: "Displeylar", en: "Displays", tr: "Ekranlar", zh: "显示屏" },
  "Инструменты и аксессуары": { uz: "Asboblar va aksessuarlar", en: "Tools & accessories", tr: "Araçlar ve aksesuarlar", zh: "工具与配件" },

  // ── Типы ────────────────────────────────────────────────────────────────
  "IP-камеры": { uz: "IP kameralar", en: "IP cameras", tr: "IP kameralar", zh: "IP摄像机" },
  "Проектное оборудование": { uz: "Loyiha uskunalari", en: "Project equipment", tr: "Proje ekipmanları", zh: "项目设备" },
  "Сетевые камеры": { uz: "Tarmoq kameralari", en: "Network cameras", tr: "Ağ kameraları", zh: "网络摄像机" },
  "Беспроводные камеры": { uz: "Simsiz kameralar", en: "Wireless cameras", tr: "Kablosuz kameralar", zh: "无线摄像机" },
  "PTZ-камеры": { uz: "PTZ kameralar", en: "PTZ cameras", tr: "PTZ kameralar", zh: "PTZ摄像机" },
  "Wi-Fi камеры": { uz: "Wi-Fi kameralar", en: "Wi-Fi cameras", tr: "Wi-Fi kameralar", zh: "Wi-Fi摄像机" },
  "IP-видеорегистраторы (NVR)": { uz: "IP videoregistratorlar (NVR)", en: "IP recorders (NVR)", tr: "IP kaydediciler (NVR)", zh: "IP录像机 (NVR)" },
  "HD-камеры (Turbo HD)": { uz: "HD kameralar (Turbo HD)", en: "HD cameras (Turbo HD)", tr: "HD kameralar (Turbo HD)", zh: "HD摄像机 (Turbo HD)" },
  "Видеорегистраторы (DVR)": { uz: "Videoregistratorlar (DVR)", en: "Video recorders (DVR)", tr: "Video kaydediciler (DVR)", zh: "录像机 (DVR)" },
  "HDCVI-регистраторы": { uz: "HDCVI registratorlar", en: "HDCVI recorders", tr: "HDCVI kaydediciler", zh: "HDCVI录像机" },
  "Купольные камеры": { uz: "Gumbazsimon kameralar", en: "Dome cameras", tr: "Dome kameralar", zh: "半球摄像机" },
  "Аналоговые камеры": { uz: "Analog kameralar", en: "Analog cameras", tr: "Analog kameralar", zh: "模拟摄像机" },
  "HDCVI-камеры": { uz: "HDCVI kameralar", en: "HDCVI cameras", tr: "HDCVI kameralar", zh: "HDCVI摄像机" },
  "Цилиндрические и корпусные камеры": { uz: "Silindrik va korpusli kameralar", en: "Bullet & box cameras", tr: "Bullet ve box kameralar", zh: "筒型与盒式摄像机" },
  "Специальные камеры": { uz: "Maxsus kameralar", en: "Specialty cameras", tr: "Özel kameralar", zh: "特种摄像机" },
  "Панорамные камеры 360°": { uz: "Panorama kameralar 360°", en: "Panoramic cameras 360°", tr: "Panoramik kameralar 360°", zh: "360°全景摄像机" },
  "PTZ — поворотные камеры": { uz: "PTZ — aylanuvchi kameralar", en: "PTZ — pan-tilt cameras", tr: "PTZ — döner kameralar", zh: "PTZ — 旋转摄像机" },
  "Системы распознавания номеров (ANPR)": { uz: "Raqam tanish tizimlari (ANPR)", en: "License plate recognition (ANPR)", tr: "Plaka tanıma sistemleri (ANPR)", zh: "车牌识别系统 (ANPR)" },
  "Терминалы и считыватели": { uz: "Terminallar va o'qish qurilmalari", en: "Terminals & readers", tr: "Terminaller ve okuyucular", zh: "终端与读卡器" },
  "Турникеты и шлагбаумы": { uz: "Turniketlar va shlagbaumlar", en: "Turnstiles & barriers", tr: "Turnikeler ve bariyerler", zh: "闸机与道闸" },
  "Замки и СКУД": { uz: "Qulflar va SKUD", en: "Locks & access control", tr: "Kilitler ve geçiş kontrolü", zh: "门锁与门禁" },
  "Терминалы доступа": { uz: "Kirish terminallari", en: "Access terminals", tr: "Geçiş terminalleri", zh: "门禁终端" },
  "Считыватели и конвертеры": { uz: "O'qish qurilmalari va konverterlar", en: "Readers & converters", tr: "Okuyucular ve dönüştürücüler", zh: "读卡器与转换器" },
  "Контроллеры доступа": { uz: "Kirish kontrollerlari", en: "Access controllers", tr: "Geçiş kontrolörleri", zh: "门禁控制器" },
  "Металлодетекторы": { uz: "Metall detektorlar", en: "Metal detectors", tr: "Metal dedektörler", zh: "金属探测器" },
  "Пожарная безопасность": { uz: "Yong'in xavfsizligi", en: "Fire safety", tr: "Yangın güvenliği", zh: "消防安全" },
  "Охранная сигнализация AX PRO": { ru: "Беспроводная сигнализация Hikvision AX PRO", uz: "Hikvision AX PRO simsiz signalizatsiya", en: "Hikvision AX PRO wireless alarm", tr: "Hikvision AX PRO kablosuz alarm", zh: "海康威视 AX PRO 无线报警" },
  "Оборудование": { uz: "Uskunalar", en: "Equipment", tr: "Ekipman", zh: "设备" },
  "Оповещение": { uz: "Ogohlantirish", en: "Notification", tr: "Uyarı sistemleri", zh: "报警通知" },
  "Приборы и модули": { uz: "Asboblar va modullar", en: "Devices & modules", tr: "Cihazlar ve modüller", zh: "设备与模块" },
  "Извещатели": { uz: "Datchiklar", en: "Detectors", tr: "Dedektörler", zh: "探测器" },
  "Детекторы и датчики": { uz: "Detektorlar va datchiklar", en: "Detectors & sensors", tr: "Dedektörler ve sensörler", zh: "探测器与传感器" },
  "Оповещатели": { uz: "Ogohlantirgichlar", en: "Sounders", tr: "Uyarıcılar", zh: "声光报警器" },
  "Контрольные панели": { uz: "Nazorat panellari", en: "Control panels", tr: "Kontrol panelleri", zh: "控制主机" },
  "Программное обеспечение": { uz: "Dasturiy ta'minot", en: "Software", tr: "Yazılım", zh: "软件" },
  "Пульты": { uz: "Pultlar", en: "Keypads", tr: "Kumandalar", zh: "控制键盘" },
  "Внутренние мониторы": { uz: "Ichki monitorlar", en: "Indoor monitors", tr: "İç mekan monitörleri", zh: "室内分机" },
  "Вызывные панели": { uz: "Chaqiruv panellari", en: "Door stations", tr: "Kapı panelleri", zh: "门口机" },
  "Видеодомофоны": { uz: "Videodomofonlar", en: "Video intercoms", tr: "Görüntülü interkom", zh: "可视对讲" },
  "Мастер-станции": { uz: "Master-stansiyalar", en: "Master stations", tr: "Ana istasyonlar", zh: "管理主机" },
  "Коммутаторы": { uz: "Kommutatorlar", en: "Switches", tr: "Switchler", zh: "交换机" },
  "Беспроводное и сетевое": { uz: "Simsiz va tarmoq", en: "Wireless & networking", tr: "Kablosuz ve ağ", zh: "无线与网络" },
  "SFP-модули и трансиверы": { uz: "SFP modullar va transiverlar", en: "SFP modules & transceivers", tr: "SFP modüller ve alıcı-vericiler", zh: "SFP模块与光模块" },
  "Маршрутизаторы": { uz: "Marshrutizatorlar", en: "Routers", tr: "Yönlendiriciler", zh: "路由器" },
  "Серверное оборудование": { uz: "Server uskunalari", en: "Server equipment", tr: "Sunucu ekipmanları", zh: "服务器设备" },
  "PON-оборудование": { uz: "PON uskunalari", en: "PON equipment", tr: "PON ekipmanları", zh: "PON设备" },
  "Оптические коммутаторы": { uz: "Optik kommutatorlar", en: "Optical switches", tr: "Optik switchler", zh: "光交换机" },
  "Wi-Fi точки доступа": { uz: "Wi-Fi kirish nuqtalari", en: "Wi-Fi access points", tr: "Wi-Fi erişim noktaları", zh: "Wi-Fi接入点" },
  "Радиомосты": { uz: "Radioko'priklar", en: "Radio bridges", tr: "Radyo köprüleri", zh: "无线网桥" },
  "Точки доступа и роутеры": { uz: "Kirish nuqtalari va routerlar", en: "Access points & routers", tr: "Erişim noktaları ve routerlar", zh: "接入点与路由器" },
  "Mesh-системы": { uz: "Mesh tizimlar", en: "Mesh systems", tr: "Mesh sistemler", zh: "Mesh系统" },
  "Wi-Fi мосты": { uz: "Wi-Fi ko'priklar", en: "Wi-Fi bridges", tr: "Wi-Fi köprüleri", zh: "Wi-Fi网桥" },
  "Усилители сигнала": { uz: "Signal kuchaytirgichlari", en: "Signal boosters", tr: "Sinyal güçlendiriciler", zh: "信号放大器" },
  "USB-адаптеры": { uz: "USB adapterlar", en: "USB adapters", tr: "USB adaptörler", zh: "USB适配器" },
  "Оптика и аксессуары": { uz: "Optika va aksessuarlar", en: "Fiber & accessories", tr: "Fiber ve aksesuarlar", zh: "光纤与配件" },
  "СКС (витая пара)": { uz: "SKS (o'ralgan juftlik)", en: "Structured cabling (twisted pair)", tr: "Yapısal kablolama (twisted pair)", zh: "综合布线 (双绞线)" },
  "Кабель": { uz: "Kabel", en: "Cable", tr: "Kablo", zh: "线缆" },
  "Оптика и HDMI": { uz: "Optika va HDMI", en: "Fiber & HDMI", tr: "Fiber ve HDMI", zh: "光纤与HDMI" },
  "Телекоммуникационные шкафы": { uz: "Telekommunikatsiya shkaflari", en: "Telecom cabinets", tr: "Telekom kabinleri", zh: "通信机柜" },
  "ИБП и электропитание": { uz: "UPS va elektr ta'minoti", en: "UPS & power", tr: "UPS ve güç kaynağı", zh: "UPS与供电" },
  "Дисплеи и мониторы": { uz: "Displeylar va monitorlar", en: "Displays & monitors", tr: "Ekranlar ve monitörler", zh: "显示屏与监视器" },
  "Декодеры и контроллеры стен": { uz: "Dekoderlar va devor kontrollerlari", en: "Decoders & wall controllers", tr: "Kod çözücüler ve duvar kontrolörleri", zh: "解码器与拼接控制器" },
  "Кронштейны и аксессуары": { uz: "Kronshteynlar va aksessuarlar", en: "Brackets & accessories", tr: "Braketler ve aksesuarlar", zh: "支架与配件" },
  "Инструменты": { uz: "Asboblar", en: "Tools", tr: "Araçlar", zh: "工具" },
  "Жёсткие диски": { uz: "Qattiq disklar", en: "Hard drives", tr: "Sabit diskler", zh: "硬盘" },
  "Аксессуары": { uz: "Aksessuarlar", en: "Accessories", tr: "Aksesuarlar", zh: "配件" },
  "Медиаконвертеры": { uz: "Mediakonverterlar", en: "Media converters", tr: "Medya dönüştürücüler", zh: "媒体转换器" },
  "Прочее оборудование": { uz: "Boshqa uskunalar", en: "Other equipment", tr: "Diğer ekipmanlar", zh: "其他设备" },
};

/** Локализованное имя категории/типа/группы (фолбэк на русское). */
export function localizeCatName(name: string | null | undefined, locale: string): string {
  const base = name ?? "";
  if (!base) return base;
  const e = CAT_NAMES[base];
  if (!e) return base;
  if (locale === routing.defaultLocale) return e.ru?.trim() || base;
  return (e as Record<string, string>)[locale]?.trim() || base;
}
