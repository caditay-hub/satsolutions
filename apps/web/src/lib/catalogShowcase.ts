// Курированная витрина типов каталога для главной (≈27 ключевых типов по всем 12 группам).
// name — точное имя типа (совпадает с категорией в БД → typeSlug даёт рабочий /products/type/<slug>,
// localizeCatName переводит на 5 языков). icon — имя файла 3D-иконки: /cat-icons/<icon>.webp.
export type ShowcaseType = { name: string; icon: string };

export const SHOWCASE_TYPES: ShowcaseType[] = [
  { name: "IP-камеры", icon: "ip-camera" },
  { name: "IP-видеорегистраторы (NVR)", icon: "nvr" },
  { name: "PTZ-камеры", icon: "ptz" },
  { name: "Wi-Fi камеры", icon: "wifi-camera" },
  { name: "Терминалы и считыватели", icon: "access-terminal" },
  { name: "Турникеты и шлагбаумы", icon: "turnstile" },
  { name: "Замки и СКУД", icon: "lock" },
  { name: "Пожарная безопасность", icon: "fire" },
  { name: "Охранная сигнализация AX PRO", icon: "alarm" },
  { name: "Домофония", icon: "intercom" },
  { name: "IP-телефония", icon: "ip-phone" },
  { name: "Умный дом", icon: "smart-home" },
  { name: "Коммутаторы", icon: "switch" },
  { name: "Маршрутизаторы", icon: "router" },
  { name: "SFP-модули и трансиверы", icon: "sfp" },
  { name: "Серверное оборудование", icon: "server" },
  { name: "Wi-Fi точки доступа", icon: "access-point" },
  { name: "Радиомосты", icon: "radio-bridge" },
  { name: "СКС (витая пара)", icon: "twisted-pair" },
  { name: "Оптика и аксессуары", icon: "fiber" },
  { name: "Кабель", icon: "cable" },
  { name: "Телекоммуникационные шкафы", icon: "cabinet" },
  { name: "ИБП и электропитание", icon: "ups" },
  { name: "Дисплеи и мониторы", icon: "monitor" },
  { name: "Инструменты", icon: "tool" },
  { name: "Кронштейны и аксессуары", icon: "bracket" },
  { name: "Жёсткие диски", icon: "hdd" },
];
