// Тип (имя категории) → slug канонического лонгрида (site_pages «category:<slug>»).
// Рендерится в CatalogView на /products/type/<slug>, поэтому ключ обязан совпадать с
// ЖИВЫМ именем типа: после укрупнения каталога (69→42, см. typeRedirects.ts) 28 ключей
// указывали на исчезнувшие имена и не срабатывали никогда — убраны 09.09.2026.
//
// На тип приходится ровно один текст: у 11 живых типов кандидатов 2–11 (по одному на
// брендовую подкатегорию), выбран самый крупный по числу опубликованных товаров.
// Не привязаны намеренно: nvr, ruijie-wifi, mikrotik-wifi — написаны для категорий с
// нулём товаров и оперируют выдуманными количествами.
export const TYPE_LONGREAD_SLUG: Record<string,string> = {
  "IP-видеорегистраторы (NVR)": "hik-nvr",
  "IP-камеры": "hik-ip-cameras",
  "Аналоговые камеры": "hik-hd-cameras",
  "IP-телефония": "pxt-voip",
  "PON-оборудование": "pxt-pon",
  "PTZ-камеры": "hik-ptz-cameras",
  "SFP-модули и трансиверы": "pxt-sfp",
  "Wi-Fi точки доступа": "tplink-wifi",
  "Беспроводное и сетевое": "pxt-wireless",
  "Беспроводные камеры": "hik-wireless-cameras",
  "Видеорегистраторы (DVR)": "hik-dvr",
  "Внутренние мониторы": "indoor-monitors",
  "Вызывные панели": "door-stations",
  "Детекторы и датчики": "detectors",
  "Дисплеи и мониторы": "displei-hik",
  "Домофония": "hik-intercoms",
  "Жёсткие диски": "prochee-hdd",
  "Замки и СКУД": "kanihad-locks",
  "ИБП и электропитание": "pxt-ups",
  "Извещатели": "rubezh-detectors",
  "Инструменты": "pxt-tools",
  "Кабель": "prochee-cable",
  "Коммутаторы": "pxt-switches",
  "Контроллеры доступа": "access-controllers",
  "Кронштейны и аксессуары": "prochee-accessories",
  "Маршрутизаторы": "mikrotik-routers",
  "Металлодетекторы": "metal-detectors",
  "Оповещение": "prochee-pa",
  "Оптика и аксессуары": "pxt-fiber",
  "Охранная сигнализация AX PRO": "hik-axpro",
  "Пожарная безопасность": "prochee-fire",
  "Приборы и модули": "bolid-panels",
  "Проектное оборудование": "hik-project",
  "Радиомосты": "mikrotik-wireless",
  "СКС (витая пара)": "pxt-scs",
  "Серверное оборудование": "pxt-server",
  "Телекоммуникационные шкафы": "pxt-racks",
  "Терминалы и считыватели": "hik-access-terminals",
  "Турникеты и шлагбаумы": "hik-turnstiles",
  "Умный дом": "pxt-smart",
  "Усилители сигнала": "mercusys-extenders",
};
