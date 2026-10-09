// Тематические связи «услуга ↔ раздел каталога ↔ бренд» (09.10.2026).
//
// Разбор внутренних ссылок (reports/organic-growth/03_INTERNAL_LINK_PLAN.csv) показал
// дыры внутри кластеров: услуга видеонаблюдения не ссылалась на регистраторы, Hikvision
// и Dahua; IP-камеры и регистраторы — друг на друга; пожарка — на Rubezh и Bolid;
// услуга сетей — на каталог сетевого оборудования. Связи заданы явно, а не подбором по
// словам: строковое совпадение даёт нерелевантные ссылки.
//
// Ключ и цели — пути БЕЗ языкового префикса; язык подставляет компонент RelatedHubs.
// Каждая цель проверена: 200 на всех языках (09.10.2026).

type L5 = { ru: string; uz: string; en: string; tr: string; zh: string };

export const HUB_LABELS: Record<string, L5> = {
  "/products/type/ip-kamery": { ru: "IP-камеры", uz: "IP-kameralar", en: "IP cameras", tr: "IP kameralar", zh: "网络摄像机" },
  "/products/type/ip-videoregistratory-nvr": { ru: "IP-видеорегистраторы (NVR)", uz: "IP-videoregistratorlar (NVR)", en: "IP recorders (NVR)", tr: "IP kayıt cihazları (NVR)", zh: "网络录像机（NVR）" },
  "/products/type/videoregistratory-dvr": { ru: "Видеорегистраторы DVR для аналоговых камер", uz: "Analog kameralar uchun DVR videoregistratorlar", en: "DVR recorders for analog cameras", tr: "Analog kameralar için DVR kayıt cihazları", zh: "模拟摄像机用DVR录像机" },
  "/products/type/ptz-kamery": { ru: "PTZ-камеры", uz: "PTZ-kameralar", en: "PTZ cameras", tr: "PTZ kameralar", zh: "PTZ云台摄像机" },
  "/products/type/turnikety-i-shlagbaumy": { ru: "Турникеты и шлагбаумы", uz: "Turniketlar va shlagbaumlar", en: "Turnstiles and barriers", tr: "Turnikeler ve bariyerler", zh: "闸机与道闸" },
  "/products/type/zamki-i-skud": { ru: "Замки для СКУД", uz: "Kirish nazorati qulflari", en: "Access control locks", tr: "Geçiş kontrol kilitleri", zh: "门禁电锁" },
  "/products/type/terminaly-i-schityvateli": { ru: "Терминалы и считыватели", uz: "Terminallar va oʻquvchilar", en: "Terminals and readers", tr: "Terminaller ve okuyucular", zh: "门禁终端与读卡器" },
  "/products/type/kommutatory": { ru: "Коммутаторы", uz: "Kommutatorlar", en: "Network switches", tr: "Ağ anahtarları", zh: "交换机" },
  "/products/group/ohranno-pozharnaya": { ru: "Охранно-пожарное оборудование", uz: "Qoʻriqlash va yongʻin uskunalari", en: "Security and fire alarm equipment", tr: "Güvenlik ve yangın alarm ekipmanı", zh: "安防与消防报警设备" },
  "/products/group/setevoe-oborudovanie": { ru: "Сетевое оборудование", uz: "Tarmoq uskunalari", en: "Network equipment", tr: "Ağ ekipmanı", zh: "网络设备" },
  "/products/group/kontrol-dostupa": { ru: "Оборудование контроля доступа", uz: "Kirishni nazorat qilish uskunalari", en: "Access control equipment", tr: "Geçiş kontrol ekipmanı", zh: "门禁设备" },
  "/products/group/domofoniya": { ru: "Домофоны", uz: "Domofonlar", en: "Intercoms", tr: "Diyafonlar", zh: "楼宇对讲" },
  "/catalog/hikvision": { ru: "Hikvision", uz: "Hikvision", en: "Hikvision", tr: "Hikvision", zh: "海康威视" },
  "/catalog/dahua": { ru: "Dahua", uz: "Dahua", en: "Dahua", tr: "Dahua", zh: "大华" },
  "/catalog/rubezh": { ru: "Рубеж", uz: "Rubezh", en: "Rubezh", tr: "Rubezh", zh: "Rubezh" },
  "/catalog/bolid": { ru: "Болид", uz: "Bolid", en: "Bolid", tr: "Bolid", zh: "Bolid" },
  "/catalog/zkteco": { ru: "ZKTeco", uz: "ZKTeco", en: "ZKTeco", tr: "ZKTeco", zh: "中控智慧 ZKTeco" },
  "/catalog/mikrotik": { ru: "MikroTik", uz: "MikroTik", en: "MikroTik", tr: "MikroTik", zh: "MikroTik" },
  "/catalog/tplink": { ru: "TP-Link", uz: "TP-Link", en: "TP-Link", tr: "TP-Link", zh: "TP-Link" },
};

export const RELATED_HUBS: Record<string, string[]> = {
  // услуги → оборудование и бренды, на которых строим
  "/solutions/cctv": ["/products/type/ip-kamery", "/products/type/ip-videoregistratory-nvr", "/products/type/videoregistratory-dvr", "/products/type/ptz-kamery", "/catalog/hikvision", "/catalog/dahua"],
  "/solutions/fire": ["/products/group/ohranno-pozharnaya", "/catalog/rubezh", "/catalog/bolid"],
  "/solutions/alarm": ["/products/group/ohranno-pozharnaya", "/catalog/rubezh", "/catalog/bolid"],
  "/solutions/network": ["/products/group/setevoe-oborudovanie", "/products/type/kommutatory", "/catalog/mikrotik", "/catalog/tplink"],
  "/solutions/access": ["/products/group/kontrol-dostupa", "/products/type/terminaly-i-schityvateli", "/products/type/zamki-i-skud", "/products/type/turnikety-i-shlagbaumy", "/catalog/zkteco"],
  "/solutions/turnstile": ["/products/type/turnikety-i-shlagbaumy", "/products/group/kontrol-dostupa", "/catalog/zkteco"],
  "/solutions/locks": ["/products/type/zamki-i-skud", "/products/group/kontrol-dostupa"],
  "/solutions/intercom": ["/products/group/domofoniya", "/catalog/hikvision"],
  // разделы каталога ↔ соседние разделы и бренды
  "/products/type/ip-kamery": ["/products/type/ip-videoregistratory-nvr", "/products/type/videoregistratory-dvr", "/products/type/ptz-kamery", "/catalog/hikvision", "/catalog/dahua"],
  "/products/type/ip-videoregistratory-nvr": ["/products/type/ip-kamery", "/products/type/videoregistratory-dvr", "/catalog/hikvision", "/catalog/dahua"],
  "/products/type/videoregistratory-dvr": ["/products/type/ip-kamery", "/products/type/ip-videoregistratory-nvr", "/catalog/hikvision", "/catalog/dahua"],
  "/products/type/turnikety-i-shlagbaumy": ["/products/type/terminaly-i-schityvateli", "/products/type/zamki-i-skud", "/catalog/zkteco"],
  "/products/type/zamki-i-skud": ["/products/type/terminaly-i-schityvateli", "/products/type/turnikety-i-shlagbaumy"],
  "/products/type/kommutatory": ["/products/group/setevoe-oborudovanie", "/catalog/mikrotik", "/catalog/tplink"],
  "/catalog/rubezh": ["/catalog/bolid", "/products/group/ohranno-pozharnaya"],
  "/catalog/bolid": ["/catalog/rubezh", "/products/group/ohranno-pozharnaya"],
  "/catalog/mercusys": ["/products/group/setevoe-oborudovanie", "/catalog/tplink"],
  "/catalog/hilook": ["/products/type/ip-kamery", "/catalog/hikvision"],
};

export function relatedHubsFor(path: string, locale: string): { href: string; label: string }[] {
  const list = RELATED_HUBS[path];
  if (!list) return [];
  const pre = locale === "ru" ? "" : `/${locale}`;
  return list
    .filter((t) => HUB_LABELS[t])
    .map((t) => ({ href: `${pre}${t}`, label: (HUB_LABELS[t] as any)[locale] ?? HUB_LABELS[t].ru }));
}
