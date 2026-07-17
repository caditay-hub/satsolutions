// Гео-коммерческий SEO-оверлей для страниц /solutions/<key>.
// Задача №1: органический топ по локальным коммерческим запросам (город + интент),
// чтобы уйти от зависимости от платной рекламы. H1 / <title> / meta description
// заточены под запросы вида «<услуга> в Ташкенте», «установка … под ключ».
//
// Фолбэк: если для локали нет ключа — страница берёт services.<key>.title/intro
// (уже переведены на 5 языков), поэтому частичное покрытие безопасно.
// Короткий services.<key>.title остаётся для хлебных крошек, CTA и JSON-LD.

export type ServiceSeo = { h1: string; title: string; desc: string };

const ru: Record<string, ServiceSeo> = {
  cctv: {
    h1: "Установка видеонаблюдения в Ташкенте",
    title: "Видеонаблюдение в Ташкенте — установка камер под ключ | SAT",
    desc: "Установка камер видеонаблюдения под ключ в Ташкенте и по Узбекистану: бесплатный выезд, проект, монтаж IP и аналоговых систем, настройка удалённого доступа с телефона. Гарантия и сервис.",
  },
  access: {
    h1: "Системы контроля доступа (СКУД) в Ташкенте",
    title: "СКУД в Ташкенте — установка систем контроля доступа | SAT",
    desc: "Монтаж СКУД в Ташкенте под ключ: турникеты, электронные замки, считыватели карт и биометрия, учёт рабочего времени. Проектирование, установка и сервис по всему Узбекистану.",
  },
  fire: {
    h1: "Монтаж пожарной сигнализации в Ташкенте",
    title: "Пожарная сигнализация в Ташкенте — монтаж АПС и СОУЭ | SAT",
    desc: "Проектирование и монтаж пожарной сигнализации (АПС) и СОУЭ в Ташкенте: датчики, оповещение, автоматика. Сдача проекта, гарантия и обслуживание по всему Узбекистану.",
  },
  intercom: {
    h1: "Установка домофонов в Ташкенте",
    title: "Домофоны в Ташкенте — установка IP-домофонов под ключ | SAT",
    desc: "Установка домофонов в Ташкенте: IP- и видеодомофоны для дома, офиса и ЖК, вызов на смартфон, интеграция со СКУД. Монтаж и сервис по всему Узбекистану.",
  },
  turnstile: {
    h1: "Турникеты в Ташкенте — установка под ключ",
    title: "Турникеты в Ташкенте — продажа и установка проходных | SAT",
    desc: "Продажа и установка турникетов в Ташкенте: проходные, калитки, интеграция со СКУД и учётом рабочего времени. Монтаж и обслуживание по всему Узбекистану.",
  },
  barrier: {
    h1: "Шлагбаумы в Ташкенте — установка и автоматика",
    title: "Шлагбаумы в Ташкенте — установка автоматических | SAT",
    desc: "Автоматические шлагбаумы в Ташкенте: продажа, монтаж, пульты и распознавание номеров (ANPR). Установка на въезды, парковки и дворы по всему Узбекистану.",
  },
  alarm: {
    h1: "Охранная сигнализация в Ташкенте",
    title: "Охранная сигнализация в Ташкенте — установка под ключ | SAT",
    desc: "Монтаж охранной сигнализации в Ташкенте: датчики движения и открытия, тревожные кнопки, вывод на пульт и смартфон. Установка и сервис по всему Узбекистану.",
  },
  gates: {
    h1: "Автоматические ворота в Ташкенте",
    title: "Автоматические ворота в Ташкенте — установка приводов | SAT",
    desc: "Установка и автоматизация ворот в Ташкенте: откатные, распашные, секционные, приводы и пульты. Монтаж и обслуживание по всему Узбекистану.",
  },
  attendance: {
    h1: "Учёт рабочего времени в Ташкенте",
    title: "Учёт рабочего времени в Ташкенте — системы СКУД | SAT",
    desc: "Системы учёта рабочего времени в Ташкенте: биометрия и карты, автоматический табель, выгрузка в 1С. Установка и настройка по всему Узбекистану.",
  },
  network: {
    h1: "Монтаж СКС и локальных сетей в Ташкенте",
    title: "Монтаж СКС и ЛВС в Ташкенте — локальные сети | SAT",
    desc: "Проектирование и монтаж СКС и локальных сетей (ЛВС) в Ташкенте: кабельные трассы, серверные шкафы, коммутаторы. Сдача документации по всему Узбекистану.",
  },
  wifi: {
    h1: "Настройка Wi-Fi сетей в Ташкенте",
    title: "Wi-Fi для офиса в Ташкенте — установка сетей | SAT",
    desc: "Проектирование и настройка Wi-Fi сетей в Ташкенте: бесшовный роуминг, точки доступа для офиса, склада и отеля. Монтаж и поддержка по всему Узбекистану.",
  },
  smarthome: {
    h1: "Умный дом в Ташкенте — установка систем",
    title: "Умный дом в Ташкенте — установка под ключ | SAT",
    desc: "Системы умного дома в Ташкенте: освещение, климат, шторы, видеонаблюдение и сценарии в одном приложении. Установка и настройка по всему Узбекистану.",
  },
};

const uz: Record<string, ServiceSeo> = {
  cctv: {
    h1: "Toshkentda videokuzatuv o'rnatish",
    title: "Toshkentda videokuzatuv o'rnatish — kamera montaji | SAT",
    desc: "Toshkent va butun O'zbekiston bo'ylab videokuzatuv kameralarini kalit topshirish asosida o'rnatamiz: obyektga bepul chiqish, loyiha, IP va analog tizimlar montaji, telefondan masofaviy kirishni sozlash. Kafolat va servis.",
  },
  access: {
    h1: "Toshkentda kirishni boshqarish tizimi (SKUD)",
    title: "SKUD Toshkentda — kirishni boshqarish tizimini o'rnatish | SAT",
    desc: "Toshkentda SKUD montaji: turniketlar, elektron qulflar, karta o'quvchilar va biometriya, ish vaqtini hisobga olish. Loyihalash, o'rnatish va servis butun O'zbekiston bo'ylab.",
  },
  fire: {
    h1: "Toshkentda yong'in signalizatsiyasi montaji",
    title: "Yong'in signalizatsiyasi Toshkentda — APS va SOUE montaji | SAT",
    desc: "Toshkentda yong'in signalizatsiyasi (APS) va SOUE loyihalash hamda montaji: datchiklar, ogohlantirish, avtomatika. Loyihani topshirish, kafolat va xizmat ko'rsatish O'zbekiston bo'ylab.",
  },
  intercom: {
    h1: "Toshkentda domofon o'rnatish",
    title: "Domofonlar Toshkentda — IP-domofon o'rnatish | SAT",
    desc: "Toshkentda domofon o'rnatish: uy, ofis va TJM uchun IP va video domofonlar, smartfonga qo'ng'iroq, SKUD bilan integratsiya. Montaj va servis butun O'zbekiston bo'ylab.",
  },
  turnstile: {
    h1: "Toshkentda turniketlar — kalit topshirish montaji",
    title: "Turniketlar Toshkentda — sotish va o'rnatish | SAT",
    desc: "Toshkentda turniketlarni sotish va o'rnatish: o'tish yo'laklari, kalitkalar, SKUD va ish vaqtini hisobga olish bilan integratsiya. Montaj va xizmat O'zbekiston bo'ylab.",
  },
  barrier: {
    h1: "Toshkentda shlagbaumlar — o'rnatish va avtomatika",
    title: "Shlagbaumlar Toshkentda — avtomatik shlagbaum o'rnatish | SAT",
    desc: "Toshkentda avtomatik shlagbaumlar: sotish, montaj, pultlar va avtoraqamni aniqlash (ANPR). Kirish yo'llari, avtoturargohlar va hovlilarga o'rnatish O'zbekiston bo'ylab.",
  },
  alarm: {
    h1: "Toshkentda qo'riqlash signalizatsiyasi",
    title: "Qo'riqlash signalizatsiyasi Toshkentda — o'rnatish | SAT",
    desc: "Toshkentda qo'riqlash signalizatsiyasi montaji: harakat va ochilish datchiklari, trevoga tugmalari, pult va smartfonga chiqarish. O'rnatish va servis O'zbekiston bo'ylab.",
  },
  gates: {
    h1: "Toshkentda avtomatik darvozalar",
    title: "Avtomatik darvozalar Toshkentda — privod o'rnatish | SAT",
    desc: "Toshkentda darvozalarni o'rnatish va avtomatlashtirish: suriladigan, ochiladigan, seksiyali darvozalar, privodlar va pultlar. Montaj va xizmat O'zbekiston bo'ylab.",
  },
  attendance: {
    h1: "Toshkentda ish vaqtini hisobga olish",
    title: "Ish vaqtini hisobga olish Toshkentda — SKUD tizimlari | SAT",
    desc: "Toshkentda ish vaqtini hisobga olish tizimlari: biometriya va kartalar, avtomatik tabel, 1C ga yuklash. O'rnatish va sozlash butun O'zbekiston bo'ylab.",
  },
  network: {
    h1: "Toshkentda SKS va lokal tarmoqlar montaji",
    title: "SKS va LVS montaji Toshkentda — lokal tarmoqlar | SAT",
    desc: "Toshkentda SKS va lokal tarmoqlar (LVS) loyihalash hamda montaji: kabel trassalari, server shkaflari, kommutatorlar. Hujjatlarni topshirish O'zbekiston bo'ylab.",
  },
  wifi: {
    h1: "Toshkentda Wi-Fi tarmoqlarini sozlash",
    title: "Ofis uchun Wi-Fi Toshkentda — tarmoq o'rnatish | SAT",
    desc: "Toshkentda Wi-Fi tarmoqlarini loyihalash va sozlash: uzluksiz rouming, ofis, ombor va mehmonxona uchun kirish nuqtalari. Montaj va qo'llab-quvvatlash O'zbekiston bo'ylab.",
  },
  smarthome: {
    h1: "Toshkentda aqlli uy — tizim o'rnatish",
    title: "Aqlli uy Toshkentda — kalit topshirish o'rnatish | SAT",
    desc: "Toshkentda aqlli uy tizimlari: yoritish, iqlim, pardalar, videokuzatuv va ssenariylar bitta ilovada. O'rnatish va sozlash butun O'zbekiston bo'ylab.",
  },
};

const en: Record<string, ServiceSeo> = {
  cctv: {
    h1: "CCTV Installation in Tashkent",
    title: "CCTV Installation in Tashkent — Security Cameras | SAT",
    desc: "Turnkey CCTV camera installation in Tashkent and across Uzbekistan: free site survey, design, IP and analog system setup, remote access from your phone. Warranty and service.",
  },
  access: {
    h1: "Access Control Systems in Tashkent",
    title: "Access Control in Tashkent — Turnstiles, Locks, Biometrics | SAT",
    desc: "Turnkey access control (ACS) in Tashkent: turnstiles, electronic locks, card readers and biometrics, time & attendance. Design, installation and service across Uzbekistan.",
  },
  fire: {
    h1: "Fire Alarm Installation in Tashkent",
    title: "Fire Alarm Systems in Tashkent — Installation | SAT",
    desc: "Fire alarm and voice evacuation (VES) design and installation in Tashkent: detectors, notification, automation. Project handover, warranty and maintenance across Uzbekistan.",
  },
  intercom: {
    h1: "Intercom Installation in Tashkent",
    title: "Intercoms in Tashkent — IP & Video Intercom Setup | SAT",
    desc: "Intercom installation in Tashkent: IP and video intercoms for homes, offices and residential complexes, call to smartphone, ACS integration. Service across Uzbekistan.",
  },
  turnstile: {
    h1: "Turnstiles in Tashkent — Turnkey Installation",
    title: "Turnstiles in Tashkent — Sales and Installation | SAT",
    desc: "Turnstile sales and installation in Tashkent: full-height and tripod turnstiles, gates, integration with access control and time tracking. Service across Uzbekistan.",
  },
  barrier: {
    h1: "Barrier Gates in Tashkent — Installation & Automation",
    title: "Barrier Gates in Tashkent — Automatic Barriers | SAT",
    desc: "Automatic barrier gates in Tashkent: sales, installation, remotes and license plate recognition (ANPR). Entrances, parking and courtyards across Uzbekistan.",
  },
  alarm: {
    h1: "Security Alarm Systems in Tashkent",
    title: "Security Alarm in Tashkent — Turnkey Installation | SAT",
    desc: "Security alarm installation in Tashkent: motion and door sensors, panic buttons, monitoring station and smartphone alerts. Installation and service across Uzbekistan.",
  },
  gates: {
    h1: "Automatic Gates in Tashkent",
    title: "Automatic Gates in Tashkent — Gate Automation | SAT",
    desc: "Gate installation and automation in Tashkent: sliding, swing and sectional gates, drives and remotes. Installation and service across Uzbekistan.",
  },
  attendance: {
    h1: "Time & Attendance Systems in Tashkent",
    title: "Time & Attendance in Tashkent — Access Systems | SAT",
    desc: "Time and attendance systems in Tashkent: biometrics and cards, automatic timesheets, export to 1C. Installation and setup across Uzbekistan.",
  },
  network: {
    h1: "Structured Cabling & LAN in Tashkent",
    title: "Structured Cabling & LAN in Tashkent — Networks | SAT",
    desc: "Structured cabling (SCS) and LAN design and installation in Tashkent: cable routes, server racks, switches. Documentation handover across Uzbekistan.",
  },
  wifi: {
    h1: "Wi-Fi Network Setup in Tashkent",
    title: "Office Wi-Fi in Tashkent — Network Installation | SAT",
    desc: "Wi-Fi network design and setup in Tashkent: seamless roaming, access points for office, warehouse and hotel. Installation and support across Uzbekistan.",
  },
  smarthome: {
    h1: "Smart Home in Tashkent — System Installation",
    title: "Smart Home in Tashkent — Turnkey Installation | SAT",
    desc: "Smart home systems in Tashkent: lighting, climate, blinds, CCTV and scenes in one app. Installation and setup across Uzbekistan.",
  },
};

const BY_LOCALE: Record<string, Record<string, ServiceSeo>> = { ru, uz, en };

export function getServiceSeo(locale: string, key: string): ServiceSeo | null {
  return BY_LOCALE[locale]?.[key] ?? null;
}
