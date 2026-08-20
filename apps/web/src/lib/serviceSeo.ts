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
    // «системы видеонаблюдения» — QS 1/10 в Ads: запрос обязан быть в H1/title (методика LT)
    h1: "Системы видеонаблюдения в Ташкенте — установка под ключ",
    title: "Системы видеонаблюдения в Ташкенте — установка камер | SAT",
    desc: "Системы видеонаблюдения под ключ в Ташкенте и по Узбекистану: установка камер, бесплатный выезд, проект, монтаж IP и аналоговых систем, настройка удалённого доступа с телефона. Гарантия и сервис.",
  },
  servers: {
    // «серверное оборудование» — QS 3/10: витрина /solutions/servers без гео-заголовка
    h1: "Серверное оборудование в Ташкенте — серверы под заказ",
    title: "Серверное оборудование в Ташкенте — серверы под заказ | SAT",
    desc: "Серверное оборудование в Ташкенте: серверы под заказ для 1С, офиса и виртуализации, стойки, ИБП, сетевое оборудование. Подбор конфигурации, поставка и монтаж по всему Узбекистану.",
  },
  access: {
    h1: "Системы контроля доступа (СКУД) в Ташкенте",
    title: "СКУД в Ташкенте — установка систем контроля доступа | SAT",
    desc: "Монтаж СКУД в Ташкенте под ключ: турникеты, электронные замки, считыватели карт, контроль доступа по лицу (Face ID) и биометрия, учёт рабочего времени. Проектирование, установка и сервис по всему Узбекистану.",
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
    desc: "Автоматические шлагбаумы в Ташкенте: цена с установкой, продажа, монтаж, пульты и распознавание номеров (ANPR). Установка на въезды, парковки и дворы по всему Узбекистану.",
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
    h1: "Структурированные кабельные системы (СКС) в Ташкенте — монтаж под ключ",
    title: "СКС в Ташкенте — монтаж структурированных кабельных систем | SAT",
    desc: "Структурированные кабельные системы и сети (СКС, ЛВС) в Ташкенте: проектирование, монтаж кабельных трасс, серверные шкафы, коммутаторы, тестирование линий. Сдача документации по всему Узбекистану.",
  },
  videowall: {
    h1: "Видеостены в Ташкенте — установка под ключ",
    title: "Видеостена в Ташкенте — установка 2х2, 3х3 под ключ | SAT",
    desc: "Установка видеостен в Ташкенте: конфигурации 2х2 и 3х3, панели 46–55\" с тонким швом, контроллеры, кронштейны, настройка. Диспетчерские и ситуационные центры под ключ по Узбекистану.",
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
  anpr: {
    h1: "Распознавание автономеров в Ташкенте",
    title: "Распознавание номеров (ANPR) в Ташкенте — установка | SAT",
    desc: "Системы распознавания автономеров (ANPR) в Ташкенте: автоматический въезд по номеру, шлагбаумы, белые списки, интеграция с парковкой и СКУД. Установка по всему Узбекистану.",
  },
  telephony: {
    h1: "IP-телефония для офиса в Ташкенте",
    title: "IP-телефония в Ташкенте — АТС для офиса под ключ | SAT",
    desc: "Установка IP-телефонии и офисной АТС в Ташкенте: многоканальные номера, запись разговоров, интеграция с CRM. Настройка и поддержка по всему Узбекистану.",
  },
  mikrotik: {
    h1: "Настройка MikroTik в Ташкенте",
    title: "Настройка MikroTik в Ташкенте — роутеры и VPN | SAT",
    desc: "Настройка роутеров MikroTik в Ташкенте: маршрутизация, VPN, балансировка каналов, файрвол и Hotspot. Выезд, аутсорсинг сети и поддержка по всему Узбекистану.",
  },
  fiber: {
    h1: "Прокладка оптоволокна в Ташкенте",
    title: "Оптоволокно в Ташкенте — прокладка и сварка ВОЛС | SAT",
    desc: "Прокладка и сварка оптоволоконных линий (ВОЛС) в Ташкенте: монтаж кабеля, муфты, кроссы, измерения рефлектометром. Работы по всему Узбекистану.",
  },
  server: {
    h1: "Серверные и ЦОД под ключ в Ташкенте",
    title: "Серверная под ключ в Ташкенте — монтаж ЦОД | SAT",
    desc: "Проектирование и монтаж серверных и ЦОД в Ташкенте: стойки, СКС, бесперебойное питание, охлаждение и контроль доступа. Сдача под ключ по всему Узбекистану.",
  },
  virtualization: {
    h1: "Серверы H3C и виртуализация в Ташкенте",
    title: "Серверы H3C и виртуализация в Ташкенте | SAT Solutions",
    desc: "Поставка серверов H3C и внедрение виртуализации в Ташкенте: консолидация нагрузок, отказоустойчивость, резервное копирование. Проект и внедрение по всему Узбекистану.",
  },
  locks: {
    h1: "Электронные и умные замки в Ташкенте",
    title: "Электронные и умные замки в Ташкенте — установка | SAT",
    desc: "Установка электронных и умных замков в Ташкенте: биометрия, карты, коды и приложение, интеграция со СКУД. Монтаж для дома и офиса по всему Узбекистану.",
  },
  // ── отрасли (B2B: крупные объекты, проекты под ключ) ──
  industry: {
    h1: "Системы безопасности для завода и производства",
    title: "Видеонаблюдение и СКУД для завода в Ташкенте — проект под ключ | SAT",
    desc: "Проектирование и монтаж систем безопасности на производстве: видеонаблюдение цехов и периметра, СКУД и учёт рабочего времени, пожарная сигнализация, СКС. Опыт на объектах от 500 камер, работаем по всему Узбекистану.",
  },
  warehouse: {
    h1: "Видеонаблюдение и охрана склада",
    title: "Видеонаблюдение для склада в Ташкенте — монтаж под ключ | SAT",
    desc: "Системы безопасности складов и логистических комплексов: видеонаблюдение зон приёмки и отгрузки, контроль погрузки, СКУД для персонала и транспорта, ANPR на воротах. Проект, монтаж и сервис по Узбекистану.",
  },
  bank: {
    h1: "Системы безопасности для банков и офисов",
    // офисные ключи Ads ведут сюда же — слово «офис» обязано быть в title
    title: "Видеонаблюдение и СКУД для офиса и банка — Ташкент | SAT",
    desc: "Комплексная защита банков, филиалов и офисов: видеонаблюдение операционных зон и касс, СКУД и зоны ограниченного доступа, тревожные кнопки, интеграция с охраной. Проектирование и монтаж по всему Узбекистану.",
  },
  retail: {
    h1: "Системы безопасности для магазинов и торговых сетей",
    title: "Видеонаблюдение для магазина и сети в Ташкенте — под ключ | SAT",
    desc: "Видеонаблюдение торговых залов, касс и складов, подсчёт посетителей, контроль кассовых операций и защита от краж. Единая система для сети магазинов с доступом из офиса. Монтаж и обслуживание по Узбекистану.",
  },
  residential: {
    h1: "Системы безопасности для жилых комплексов",
    title: "Видеонаблюдение и домофония для ЖК в Ташкенте — под ключ | SAT",
    desc: "Комплексное оснащение жилых комплексов: видеонаблюдение территории и подъездов, IP-домофония с вызовом на смартфон, СКУД и шлагбаумы на въезде, распознавание автономеров. Проект, монтаж и обслуживание.",
  },
  school: {
    h1: "Системы безопасности для школ и учебных заведений",
    title: "Видеонаблюдение и турникеты для школы в Ташкенте | SAT",
    desc: "Безопасность школ, колледжей и вузов: турникеты и СКУД на входе, видеонаблюдение территории и коридоров, оповещение и уведомление родителей о проходе ребёнка. Монтаж под ключ по всему Узбекистану.",
  },
  parking: {
    h1: "Системы автоматизации парковок",
    title: "Система парковки в Ташкенте — шлагбаумы и ANPR под ключ | SAT",
    desc: "Автоматизация парковок и въездных групп: распознавание автономеров (ANPR), шлагбаумы и ворота, белые списки, учёт мест и тарификация, интеграция со СКУД. Проектирование и монтаж по Узбекистану.",
  },
  city: {
    h1: "Городские системы видеонаблюдения «Безопасный город»",
    title: "Безопасный город — проект городского видеонаблюдения | SAT",
    desc: "Городские системы безопасности: сеть уличного видеонаблюдения, распознавание лиц и автономеров, каналы связи и ЦОД для видеоархива, ситуационный центр. Проектирование, монтаж и сопровождение.",
  },
  bus: {
    h1: "Видеонаблюдение и мониторинг для транспорта",
    title: "Видеонаблюдение в автобусе — мобильные системы и GPS | SAT",
    desc: "Мобильное видеонаблюдение для автобусов и спецтехники: камеры в салоне и кабине, GPS-мониторинг, подсчёт пассажиров, передача видео в диспетчерскую по 4G. Оснащение автопарков под ключ.",
  },
  construction: {
    h1: "Видеонаблюдение и охрана строительной площадки",
    title: "Видеонаблюдение на стройке в Ташкенте — охрана объекта | SAT",
    desc: "Охрана строительных площадок: автономные камеры на 4G, контроль техники и материалов, СКУД на бытовки и въезд, периметральная сигнализация, удалённый просмотр с телефона. Быстрый монтаж и перенос при переезде объекта.",
  },
  medical: {
    h1: "Системы безопасности для клиник и больниц",
    title: "Видеонаблюдение и СКУД для клиники в Ташкенте | SAT",
    desc: "Оснащение медицинских учреждений: видеонаблюдение холлов и коридоров, СКУД в отделения и аптеку, тревожные кнопки, пожарная сигнализация и оповещение. Проектирование с учётом требований к медучреждениям.",
  },
  hotel: {
    h1: "Системы безопасности для гостиниц",
    title: "Видеонаблюдение и замки для отеля в Ташкенте — под ключ | SAT",
    desc: "Оснащение гостиниц и апарт-отелей: электронные замки на номера с картами и телефоном, видеонаблюдение общих зон, СКУД служебных помещений, пожарная сигнализация и оповещение. Монтаж и обслуживание.",
  },
  fuel: {
    h1: "Системы безопасности для АЗС и нефтебаз",
    title: "Видеонаблюдение для АЗС в Ташкенте — монтаж под ключ | SAT",
    desc: "Безопасность АЗС, газозаправок и нефтебаз: видеонаблюдение колонок и кассы, распознавание автономеров, периметральная охрана, взрывозащищённое исполнение, пожарная сигнализация. Проект и монтаж по Узбекистану.",
  },
};

const uz: Record<string, ServiceSeo> = {
  servers: {
    h1: "Server uskunalari Toshkentda — buyurtma asosida serverlar",
    title: "Server uskunalari Toshkentda — serverlar | SAT",
    desc: "Toshkentda server uskunalari: 1C, ofis va virtualizatsiya uchun buyurtma asosida serverlar, stoykalar, UPS, tarmoq uskunalari. Konfiguratsiya tanlash, yetkazib berish va montaj O'zbekiston bo'ylab.",
  },
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
    desc: "Toshkentda strukturali kabel tizimlari (SKS) va lokal tarmoqlar (LVS) loyihalash hamda montaji: kabel trassalari, server shkaflari, kommutatorlar. Hujjatlarni topshirish O'zbekiston bo'ylab.",
  },
  videowall: {
    h1: "Toshkentda videodevorlar — kalit topshirish asosida o'rnatish",
    title: "Videodevor Toshkentda — 2x2, 3x3 o'rnatish | SAT",
    desc: "Toshkentda videodevorlar o'rnatish: 2x2 va 3x3 konfiguratsiyalar, 46–55\" ingichka chokli panellar, kontrollerlar, sozlash. Dispetcherlik va situatsion markazlar O'zbekiston bo'ylab.",
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
  anpr: {
    h1: "Toshkentda avtoraqamlarni aniqlash",
    title: "Avtoraqamlarni aniqlash (ANPR) Toshkentda | SAT",
    desc: "Toshkentda avtoraqamlarni aniqlash (ANPR) tizimlari: raqam bo'yicha avtomatik kirish, shlagbaumlar, oq ro'yxatlar, avtoturargoh va SKUD bilan integratsiya. O'zbekiston bo'ylab o'rnatish.",
  },
  telephony: {
    h1: "Toshkentda ofis uchun IP-telefoniya",
    title: "IP-telefoniya Toshkentda — ofis uchun ATS | SAT",
    desc: "Toshkentda IP-telefoniya va ofis ATS o'rnatish: ko'p kanalli raqamlar, suhbatlarni yozib olish, CRM bilan integratsiya. Sozlash va qo'llab-quvvatlash O'zbekiston bo'ylab.",
  },
  mikrotik: {
    h1: "Toshkentda MikroTik sozlash",
    title: "MikroTik sozlash Toshkentda — routerlar va VPN | SAT",
    desc: "Toshkentda MikroTik routerlarini sozlash: marshrutlash, VPN, kanallarni balanslash, firewall va Hotspot. Chiqish, tarmoq autsorsingi va qo'llab-quvvatlash O'zbekiston bo'ylab.",
  },
  fiber: {
    h1: "Toshkentda optik tolani yotqizish",
    title: "Optik tola Toshkentda — VOLS yotqizish va payvandlash | SAT",
    desc: "Toshkentda optik tola liniyalarini (VOLS) yotqizish va payvandlash: kabel montaji, muftalar, kross, reflektometr o'lchovlari. Ishlar O'zbekiston bo'ylab.",
  },
  server: {
    h1: "Toshkentda server xonasi va ma'lumot markazi",
    title: "Server xonasi Toshkentda — kalit topshirish montaji | SAT",
    desc: "Toshkentda server xonalari va ma'lumot markazlarini loyihalash va montaji: stoykalar, SKS, uzluksiz quvvat, sovitish va kirish nazorati. Kalit topshirish O'zbekiston bo'ylab.",
  },
  virtualization: {
    h1: "Toshkentda H3C serverlari va virtualizatsiya",
    title: "H3C serverlari va virtualizatsiya Toshkentda | SAT",
    desc: "Toshkentda H3C serverlarini yetkazib berish va virtualizatsiyani joriy etish: yuklamalarni konsolidatsiya qilish, xatolarga chidamlilik, zaxira nusxa. Loyiha va joriy etish O'zbekiston bo'ylab.",
  },
  locks: {
    h1: "Toshkentda elektron va aqlli qulflar",
    title: "Elektron va aqlli qulflar Toshkentda — o'rnatish | SAT",
    desc: "Toshkentda elektron va aqlli qulflarni o'rnatish: biometriya, kartalar, kodlar va ilova, SKUD bilan integratsiya. Uy va ofis uchun montaj O'zbekiston bo'ylab.",
  },
  // ── tarmoqlar (B2B) ──
  industry: {
    h1: "Zavod va ishlab chiqarish uchun xavfsizlik tizimlari",
    title: "Zavod uchun videokuzatuv va SKUD — Toshkentda loyiha | SAT",
    desc: "Ishlab chiqarish obyektlarida xavfsizlik tizimlari: sexlar va perimetr videokuzatuvi, SKUD va ish vaqti hisobi, yong'in signalizatsiyasi, SKS. 500 dan ortiq kameralik obyektlarda tajriba, butun O'zbekiston bo'ylab.",
  },
  warehouse: {
    h1: "Ombor uchun videokuzatuv va xavfsizlik",
    title: "Ombor uchun videokuzatuv — Toshkentda kalit topshirish | SAT",
    desc: "Ombor va logistika markazlari xavfsizligi: qabul va jo'natish zonalari videokuzatuvi, yuklashni nazorat qilish, xodimlar va transport uchun SKUD, darvozada ANPR. Loyiha, montaj va servis.",
  },
  bank: {
    h1: "Banklar va ofislar uchun xavfsizlik tizimlari",
    title: "Ofis va bank uchun videokuzatuv va SKUD — Toshkent | SAT",
    desc: "Banklar, filiallar va ofislarni himoya qilish: operatsion zona va kassalar videokuzatuvi, SKUD va cheklangan kirish zonalari, trevoga tugmalari, qo'riqlash bilan integratsiya. Loyihalash va montaj.",
  },
  retail: {
    h1: "Do'konlar va savdo tarmoqlari uchun xavfsizlik",
    title: "Do'kon uchun videokuzatuv — Toshkentda montaj | SAT",
    desc: "Savdo zali, kassa va omborlar videokuzatuvi, tashrifchilarni sanash, kassa operatsiyalari nazorati va o'g'irlikdan himoya. Butun tarmoq uchun yagona tizim va ofisdan kirish imkoni.",
  },
  residential: {
    h1: "Turar-joy majmualari uchun xavfsizlik tizimlari",
    title: "TJM uchun videokuzatuv va domofon — Toshkentda | SAT",
    desc: "Turar-joy majmualarini jihozlash: hudud va podyezdlar videokuzatuvi, smartfonga qo'ng'iroqli IP-domofon, kirishda SKUD va shlagbaum, avtoraqamlarni tanish. Loyiha, montaj va xizmat ko'rsatish.",
  },
  school: {
    h1: "Maktab va o'quv muassasalari uchun xavfsizlik",
    title: "Maktab uchun videokuzatuv va turniketlar — Toshkentda | SAT",
    desc: "Maktab, kollej va oliygohlar xavfsizligi: kirishda turniket va SKUD, hudud hamda koridorlar videokuzatuvi, ota-onalarga bolaning kirib-chiqishi haqida xabar. Kalit topshirish asosida montaj.",
  },
  parking: {
    h1: "Avtoturargohlarni avtomatlashtirish tizimlari",
    title: "Avtoturargoh tizimi — shlagbaum va ANPR Toshkentda | SAT",
    desc: "Avtoturargoh va kirish guruhlarini avtomatlashtirish: avtoraqamlarni tanish (ANPR), shlagbaum va darvozalar, oq ro'yxatlar, joylar hisobi va tariflash, SKUD bilan integratsiya.",
  },
  city: {
    h1: "«Xavfsiz shahar» shahar videokuzatuv tizimlari",
    title: "Xavfsiz shahar — shahar videokuzatuv loyihasi | SAT",
    desc: "Shahar xavfsizlik tizimlari: ko'cha videokuzatuv tarmog'i, yuz va avtoraqamlarni tanish, aloqa kanallari va videoarxiv uchun ma'lumot markazi, vaziyat markazi. Loyihalash va montaj.",
  },
  bus: {
    h1: "Transport uchun videokuzatuv va monitoring",
    title: "Avtobusda videokuzatuv — mobil tizimlar va GPS | SAT",
    desc: "Avtobus va maxsus texnika uchun mobil videokuzatuv: salon va kabinada kameralar, GPS-monitoring, yo'lovchilarni sanash, 4G orqali dispetcherlik markaziga uzatish.",
  },
  construction: {
    h1: "Qurilish maydoni uchun videokuzatuv va qo'riqlash",
    title: "Qurilishda videokuzatuv — obyektni qo'riqlash Toshkentda | SAT",
    desc: "Qurilish maydonlarini qo'riqlash: 4G'li avtonom kameralar, texnika va materiallar nazorati, vagon va kirishda SKUD, perimetr signalizatsiyasi, telefondan masofaviy ko'rish.",
  },
  medical: {
    h1: "Klinika va shifoxonalar uchun xavfsizlik tizimlari",
    title: "Klinika uchun videokuzatuv va SKUD — Toshkentda | SAT",
    desc: "Tibbiyot muassasalarini jihozlash: xoll va koridorlar videokuzatuvi, bo'lim va dorixonaga SKUD, trevoga tugmalari, yong'in signalizatsiyasi va ogohlantirish tizimi.",
  },
  hotel: {
    h1: "Mehmonxonalar uchun xavfsizlik tizimlari",
    title: "Mehmonxona uchun videokuzatuv va qulflar — Toshkentda | SAT",
    desc: "Mehmonxona va apart-otellarni jihozlash: karta va telefon bilan ochiladigan elektron qulflar, umumiy zonalar videokuzatuvi, xizmat xonalari uchun SKUD, yong'in signalizatsiyasi.",
  },
  fuel: {
    h1: "Shaxobcha va neft bazalari uchun xavfsizlik",
    title: "Shaxobcha uchun videokuzatuv — Toshkentda montaj | SAT",
    desc: "Yoqilg'i quyish shaxobchalari va neft bazalari xavfsizligi: kolonka va kassa videokuzatuvi, avtoraqamlarni tanish, perimetr qo'riqlash, portlashdan himoyalangan ijro, yong'in signalizatsiyasi.",
  },
};

const en: Record<string, ServiceSeo> = {
  servers: {
    h1: "Server Hardware in Tashkent — Custom-Built Servers",
    title: "Server Hardware in Tashkent — Custom Servers | SAT",
    desc: "Server hardware in Tashkent: custom-built servers for 1C, office and virtualization, racks, UPS and network equipment. Configuration, supply and installation across Uzbekistan.",
  },
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
  videowall: {
    h1: "Video Walls in Tashkent — Turnkey Installation",
    title: "Video Wall in Tashkent — 2x2, 3x3 Installation | SAT",
    desc: "Video wall installation in Tashkent: 2x2 and 3x3 configurations, 46–55\" slim-bezel panels, controllers, mounts and calibration. Dispatch and situation centers across Uzbekistan.",
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
  anpr: {
    h1: "License Plate Recognition in Tashkent",
    title: "License Plate Recognition (ANPR) in Tashkent | SAT",
    desc: "License plate recognition (ANPR) systems in Tashkent: automatic entry by plate, barriers, whitelists, parking and access control integration. Installation across Uzbekistan.",
  },
  telephony: {
    h1: "Office IP Telephony in Tashkent",
    title: "IP Telephony in Tashkent — Office PBX | SAT",
    desc: "IP telephony and office PBX setup in Tashkent: multi-channel numbers, call recording, CRM integration. Setup and support across Uzbekistan.",
  },
  mikrotik: {
    h1: "MikroTik Configuration in Tashkent",
    title: "MikroTik Setup in Tashkent — Routers & VPN | SAT",
    desc: "MikroTik router configuration in Tashkent: routing, VPN, channel balancing, firewall and Hotspot. On-site, network outsourcing and support across Uzbekistan.",
  },
  fiber: {
    h1: "Fiber Optic Cabling in Tashkent",
    title: "Fiber Optics in Tashkent — Cabling & Splicing | SAT",
    desc: "Fiber optic line (FOCL) laying and splicing in Tashkent: cable installation, splice closures, patch panels, OTDR measurements. Work across Uzbekistan.",
  },
  server: {
    h1: "Server Rooms & Data Centers in Tashkent",
    title: "Turnkey Server Room in Tashkent — Data Center | SAT",
    desc: "Server room and data center design and installation in Tashkent: racks, cabling, UPS power, cooling and access control. Turnkey delivery across Uzbekistan.",
  },
  virtualization: {
    h1: "H3C Servers & Virtualization in Tashkent",
    title: "H3C Servers & Virtualization in Tashkent | SAT",
    desc: "H3C server supply and virtualization in Tashkent: workload consolidation, fault tolerance, backups. Project and rollout across Uzbekistan.",
  },
  locks: {
    h1: "Electronic & Smart Locks in Tashkent",
    title: "Electronic & Smart Locks in Tashkent — Installation | SAT",
    desc: "Electronic and smart lock installation in Tashkent: biometrics, cards, codes and app control, ACS integration. Home and office fitting across Uzbekistan.",
  },
  // ── industries (B2B) ──
  industry: {
    h1: "Security systems for factories and manufacturing",
    title: "Factory CCTV and access control in Tashkent — turnkey | SAT",
    desc: "Design and installation of security systems for manufacturing: CCTV for workshops and perimeter, access control with time attendance, fire alarm, structured cabling. Experience on sites with 500+ cameras across Uzbekistan.",
  },
  warehouse: {
    h1: "Warehouse CCTV and security systems",
    title: "Warehouse CCTV in Tashkent — turnkey installation | SAT",
    desc: "Security for warehouses and logistics centres: CCTV of receiving and dispatch areas, loading control, access control for staff and vehicles, ANPR at the gates. Design, installation and service across Uzbekistan.",
  },
  bank: {
    h1: "Security systems for banks and offices",
    title: "Office & Bank CCTV and Access Control in Tashkent | SAT",
    desc: "Complete protection for banks, branches and offices: CCTV of teller areas and cash desks, access control and restricted zones, panic buttons, integration with security services. Design and installation.",
  },
  retail: {
    h1: "Security systems for shops and retail chains",
    title: "Retail CCTV in Tashkent — turnkey installation | SAT",
    desc: "CCTV for sales floors, checkouts and stockrooms, visitor counting, POS transaction control and loss prevention. One system for the whole chain with access from head office.",
  },
  residential: {
    h1: "Security systems for residential complexes",
    title: "CCTV and intercom for residential complexes in Tashkent | SAT",
    desc: "Turnkey equipment for residential complexes: CCTV of grounds and entrances, IP intercom with calls to smartphone, access control and barriers at the entry, licence plate recognition.",
  },
  school: {
    h1: "Security systems for schools and universities",
    title: "School CCTV and turnstiles in Tashkent | SAT",
    desc: "Safety for schools, colleges and universities: turnstiles and access control at the entrance, CCTV of grounds and corridors, public address and parent notifications about the child's entry.",
  },
  parking: {
    h1: "Parking automation systems",
    title: "Parking system in Tashkent — barriers and ANPR | SAT",
    desc: "Automation of car parks and entry points: licence plate recognition (ANPR), barriers and gates, whitelists, space counting and tariffs, integration with access control.",
  },
  city: {
    h1: "Safe City urban video surveillance",
    title: "Safe City — urban video surveillance project | SAT",
    desc: "Urban security systems: street CCTV network, face and licence plate recognition, transmission channels and a data centre for the video archive, situation centre. Design, installation and support.",
  },
  bus: {
    h1: "CCTV and monitoring for public transport",
    title: "Bus CCTV — mobile systems and GPS tracking | SAT",
    desc: "Mobile CCTV for buses and special vehicles: cameras in the cabin and saloon, GPS monitoring, passenger counting, video streaming to the dispatch centre over 4G.",
  },
  construction: {
    h1: "CCTV and security for construction sites",
    title: "Construction site CCTV in Tashkent — site security | SAT",
    desc: "Construction site protection: autonomous 4G cameras, control of machinery and materials, access control for site cabins and entry, perimeter alarm, remote viewing from a phone.",
  },
  medical: {
    h1: "Security systems for clinics and hospitals",
    title: "Clinic CCTV and access control in Tashkent | SAT",
    desc: "Equipment for medical facilities: CCTV of halls and corridors, access control for wards and pharmacy, panic buttons, fire alarm and evacuation warning systems.",
  },
  hotel: {
    h1: "Security systems for hotels",
    title: "Hotel CCTV and electronic locks in Tashkent | SAT",
    desc: "Equipment for hotels and apart-hotels: electronic room locks with cards and phone, CCTV of public areas, access control for service rooms, fire alarm and warning systems.",
  },
  fuel: {
    h1: "Security systems for petrol stations and oil depots",
    title: "Petrol station CCTV in Tashkent — turnkey | SAT",
    desc: "Security for petrol and gas stations and oil depots: CCTV of pumps and cash desk, licence plate recognition, perimeter protection, explosion-proof equipment, fire alarm.",
  },
};

const tr: Record<string, ServiceSeo> = {
  cctv: {
    h1: "Taşkent'te güvenlik kamerası sistemi — anahtar teslim",
    title: "Taşkent'te Güvenlik Kamerası Sistemi Kurulumu | SAT",
    desc: "Taşkent ve tüm Özbekistan'da anahtar teslim güvenlik kamerası sistemleri: ücretsiz keşif, proje, IP ve analog kamera montajı, telefondan uzaktan erişim. Garanti ve servis.",
  },
  servers: {
    h1: "Taşkent'te sunucu ekipmanları — siparişe özel sunucular",
    title: "Taşkent'te Sunucu Ekipmanları — Özel Sunucular | SAT",
    desc: "Taşkent'te sunucu ekipmanları: 1C, ofis ve sanallaştırma için siparişe özel sunucular, kabinetler, UPS ve ağ cihazları. Tüm Özbekistan'da konfigürasyon, tedarik ve montaj.",
  },
  access: {
    h1: "Taşkent'te geçiş kontrol sistemleri — anahtar teslim",
    title: "Taşkent'te Geçiş Kontrol Sistemi Kurulumu | SAT",
    desc: "Taşkent'te geçiş kontrol sistemi montajı: turnikeler, elektronik kilitler, kart okuyucular, Face ID ve biyometri, personel devam takibi. Özbekistan genelinde kurulum ve servis.",
  },
  fire: {
    h1: "Taşkent'te yangın alarm sistemi montajı",
    title: "Taşkent'te Yangın Alarm Sistemi Montajı | SAT",
    desc: "Taşkent'te yangın alarm sistemi ve sesli uyarı sistemi projelendirme ve montajı: dedektörler, ihbar, otomasyon. Proje teslimi, garanti ve Özbekistan genelinde bakım hizmeti.",
  },
  intercom: {
    h1: "Taşkent'te diafon ve IP interkom kurulumu",
    title: "Taşkent'te Diafon Kurulumu — IP Diafon | SAT",
    desc: "Taşkent'te diafon kurulumu: ev, ofis ve siteler için IP ve görüntülü diafonlar, akıllı telefona çağrı, geçiş kontrol sistemi entegrasyonu. Özbekistan genelinde montaj ve servis.",
  },
  turnstile: {
    h1: "Taşkent'te turnike kurulumu — anahtar teslim",
    title: "Taşkent'te Turnike Satışı ve Kurulumu | SAT",
    desc: "Taşkent'te turnike satışı ve montajı: geçiş turnikeleri, engelli kapıları, geçiş kontrol sistemi ve personel devam takibi entegrasyonu. Özbekistan genelinde kurulum ve bakım.",
  },
  barrier: {
    h1: "Taşkent'te bariyer kurulumu ve otomasyonu",
    title: "Taşkent'te Otomatik Bariyer Kurulumu | SAT",
    desc: "Taşkent'te otomatik bariyerler: kurulum dahil fiyat, satış, montaj, kumandalar ve plaka tanıma (ANPR). Girişler, otoparklar ve siteler için Özbekistan genelinde kurulum.",
  },
  alarm: {
    h1: "Taşkent'te hırsız alarm sistemi kurulumu",
    title: "Taşkent'te Hırsız Alarm Sistemi Kurulumu | SAT",
    desc: "Taşkent'te hırsız alarm sistemi montajı: hareket ve kapı sensörleri, panik butonları, izleme merkezine ve akıllı telefona bildirim. Özbekistan genelinde kurulum ve servis.",
  },
  gates: {
    h1: "Taşkent'te otomatik bahçe kapısı kurulumu",
    title: "Taşkent'te Otomatik Kapı — Motor Montajı | SAT",
    desc: "Taşkent'te kapı otomasyonu ve montajı: sürgülü, kanatlı ve seksiyonel kapılar, motorlar ve kumandalar. Özbekistan genelinde profesyonel kurulum ve düzenli bakım hizmeti.",
  },
  attendance: {
    h1: "Taşkent'te personel devam takibi (PDKS)",
    title: "Taşkent'te Personel Devam Takip Sistemi | SAT",
    desc: "Taşkent'te personel devam takip sistemleri: biyometri ve kartlı geçiş, otomatik puantaj, 1C'ye aktarım. Özbekistan genelinde kurulum, ayarlama ve teknik destek.",
  },
  network: {
    h1: "Taşkent'te yapısal kablolama (SKS) montajı",
    title: "Taşkent'te Yapısal Kablolama Montajı | SAT",
    desc: "Taşkent'te yapısal kablolama ve yerel ağ kurulumu: projelendirme, kablo tesisatı montajı, sunucu kabinetleri, switchler, hat testi. Özbekistan genelinde dokümantasyon teslimi.",
  },
  videowall: {
    h1: "Taşkent'te video duvar kurulumu — anahtar teslim",
    title: "Taşkent'te Video Duvar Kurulumu 2x2, 3x3 | SAT",
    desc: "Taşkent'te video duvar kurulumu: 2x2 ve 3x3 konfigürasyonlar, ince çerçeveli 46–55 inç paneller, kontrolcüler, askılar, ayar. Özbekistan genelinde kontrol merkezleri.",
  },
  wifi: {
    h1: "Taşkent'te Wi-Fi ağ kurulumu ve ayarları",
    title: "Taşkent'te Ofis için Wi-Fi Ağ Kurulumu | SAT",
    desc: "Taşkent'te Wi-Fi ağ projelendirme ve kurulumu: kesintisiz dolaşım, ofis, depo ve otel için erişim noktaları. Özbekistan genelinde montaj ve teknik destek hizmeti.",
  },
  smarthome: {
    h1: "Taşkent'te akıllı ev sistemleri kurulumu",
    title: "Taşkent'te Akıllı Ev Sistemi Kurulumu | SAT",
    desc: "Taşkent'te akıllı ev sistemleri: aydınlatma, iklim, perdeler, güvenlik kamerası ve senaryolar tek bir uygulamada. Özbekistan genelinde kurulum ve ayarlama hizmeti.",
  },
  anpr: {
    h1: "Taşkent'te plaka tanıma sistemleri (ANPR)",
    title: "Taşkent'te Plaka Tanıma (ANPR) Kurulumu | SAT",
    desc: "Taşkent'te plaka tanıma (ANPR) sistemleri: plakayla otomatik giriş, bariyerler, beyaz listeler, otopark ve geçiş kontrol sistemi entegrasyonu. Özbekistan genelinde kurulum.",
  },
  telephony: {
    h1: "Taşkent'te ofis için IP telefon santrali",
    title: "Taşkent'te IP Telefon Santrali Kurulumu | SAT",
    desc: "Taşkent'te IP telefon ve ofis santrali kurulumu: çok hatlı numaralar, görüşme kaydı, CRM entegrasyonu. Özbekistan genelinde ayarlama ve teknik destek hizmeti.",
  },
  mikrotik: {
    h1: "Taşkent'te MikroTik router kurulumu",
    title: "Taşkent'te MikroTik Kurulumu — VPN Ayarı | SAT",
    desc: "Taşkent'te MikroTik router ayarları: yönlendirme, VPN, hat dengeleme, güvenlik duvarı ve Hotspot. Yerinde servis, ağ dış kaynak ve Özbekistan genelinde destek.",
  },
  fiber: {
    h1: "Taşkent'te fiber optik kablo döşeme",
    title: "Taşkent'te fiber optik döşeme ve kaynak | SAT",
    desc: "Taşkent'te fiber optik hat döşeme ve kaynak: kablo montajı, ek muflar, kroslar, reflektometre ölçümleri. Tüm Özbekistan'da keşif ve anahtar teslim hizmet.",
  },
  server: {
    h1: "Taşkent'te anahtar teslim sunucu odası ve veri merkezi",
    title: "Taşkent'te sunucu odası ve veri merkezi kurulumu | SAT",
    desc: "Taşkent'te sunucu odası ve veri merkezi projesi ve montajı: kabinetler, yapısal kablolama, kesintisiz güç, soğutma ve geçiş kontrol sistemi. Tüm Özbekistan'da.",
  },
  virtualization: {
    h1: "Taşkent'te H3C sunucuları ve sanallaştırma",
    title: "Taşkent'te H3C sunucu ve sanallaştırma | SAT",
    desc: "Taşkent'te H3C sunucu tedariki ve sanallaştırma: iş yüklerinin birleştirilmesi, yüksek erişilebilirlik ve yedekleme. Tüm Özbekistan'da proje ve uygulama.",
  },
  locks: {
    h1: "Taşkent'te elektronik ve akıllı kilit montajı",
    title: "Taşkent'te elektronik ve akıllı kilit montajı | SAT",
    desc: "Taşkent'te elektronik ve akıllı kilit montajı: biyometri, kart, şifre ve mobil uygulama, geçiş kontrol sistemi entegrasyonu. Ev ve ofis için Özbekistan genelinde.",
  },
  industry: {
    h1: "Fabrika ve üretim tesisleri için güvenlik sistemleri",
    title: "Taşkent'te fabrika için kamera ve geçiş kontrol | SAT",
    desc: "Üretim tesisleri için güvenlik: atölye ve çevre güvenlik kamerası sistemi, geçiş kontrol ve mesai takibi, yangın alarm sistemi. Tüm Özbekistan'da anahtar teslim proje.",
  },
  warehouse: {
    h1: "Depo güvenlik kamerası sistemi ve koruması",
    title: "Taşkent'te depo için güvenlik kamerası sistemi | SAT",
    desc: "Depo ve lojistik merkezleri için güvenlik: kabul ve sevkiyat bölgelerinde kamera, personel ve araç için geçiş kontrol sistemi, kapıda ANPR. Özbekistan genelinde montaj.",
  },
  bank: {
    h1: "Banka ve ofisler için güvenlik sistemleri",
    title: "Banka ve ofis için kamera, geçiş kontrol — Taşkent | SAT",
    desc: "Banka şubeleri ve ofisler için kapsamlı koruma: kasa ve işlem alanı kameraları, kısıtlı bölgelerde geçiş kontrol sistemi, panik butonu. Özbekistan genelinde montaj.",
  },
  retail: {
    h1: "Mağaza ve zincir marketler için güvenlik sistemleri",
    title: "Taşkent'te mağaza için güvenlik kamerası sistemi | SAT",
    desc: "Satış alanı, kasa ve depo kameraları, ziyaretçi sayımı, kasa işlemlerinin denetimi ve hırsızlık önleme. Zincir mağazalar için ofisten erişilen tek sistem kurulumu.",
  },
  residential: {
    h1: "Konut kompleksleri için güvenlik sistemleri",
    title: "Taşkent'te konut kompleksi için kamera ve interkom | SAT",
    desc: "Konut kompleksleri için tam donanım: bahçe ve giriş kameraları, akıllı telefona çağrı veren IP interkom, girişte geçiş kontrol ve bariyer, plaka tanıma. Montaj ve servis.",
  },
  school: {
    h1: "Okullar ve eğitim kurumları için güvenlik sistemleri",
    title: "Taşkent'te okul için kamera ve turnike sistemi | SAT",
    desc: "Okul, kolej ve üniversitelerde güvenlik: girişte turnike ve geçiş kontrol sistemi, bahçe ve koridor kameraları, veliye giriş bildirimi. Özbekistan'da anahtar teslim.",
  },
  parking: {
    h1: "Taşkent'te otopark otomasyon sistemleri",
    title: "Taşkent'te otopark sistemi: bariyer ve ANPR | SAT",
    desc: "Otopark ve giriş gruplarının otomasyonu: plaka tanıma (ANPR), bariyer ve kapılar, beyaz liste, yer sayımı ve ücretlendirme, geçiş kontrol entegrasyonu. Özbekistan genelinde.",
  },
  city: {
    h1: "«Güvenli Şehir» kent güvenlik kamerası sistemleri",
    title: "Güvenli Şehir — kent video gözetim projesi | SAT",
    desc: "Kent ölçekli güvenlik sistemleri: sokak kamerası ağı, yüz ve plaka tanıma, iletişim altyapısı ve video arşivi için veri merkezi, durum merkezi. Proje, montaj ve destek.",
  },
  bus: {
    h1: "Toplu taşıma için kamera ve GPS izleme sistemleri",
    title: "Otobüste kamera — mobil sistemler ve GPS | SAT",
    desc: "Otobüs ve iş makineleri için mobil kamera sistemi: salon ve kabin kameraları, GPS izleme, yolcu sayımı, 4G ile merkeze canlı görüntü. Filolara anahtar teslim donanım.",
  },
  construction: {
    h1: "Taşkent'te şantiye güvenlik kamerası ve koruması",
    title: "Taşkent'te şantiye kamerası — saha güvenliği | SAT",
    desc: "Şantiye koruması: 4G'li otonom kameralar, makine ve malzeme kontrolü, konteyner ve girişte geçiş kontrol, çevre alarmı, telefondan izleme. Hızlı montaj ve taşıma.",
  },
  medical: {
    h1: "Klinik ve hastaneler için güvenlik sistemleri",
    title: "Taşkent'te klinik için kamera ve geçiş kontrol | SAT",
    desc: "Sağlık kuruluşları için donanım: hol ve koridor kameraları, servis ve eczaneye geçiş kontrol sistemi, panik butonu, yangın alarm sistemi ve seslendirme. Mevzuata uygun.",
  },
  hotel: {
    h1: "Taşkent'te oteller için güvenlik sistemleri",
    title: "Taşkent'te otel için kamera ve kapı kilitleri | SAT",
    desc: "Otel ve apart otel donanımı: kartlı ve telefonla açılan oda kilitleri, ortak alan kameraları, servis alanlarında geçiş kontrol, yangın alarm sistemi. Montaj ve servis.",
  },
  fuel: {
    h1: "Akaryakıt istasyonları ve petrol depoları için güvenlik",
    title: "Taşkent'te akaryakıt istasyonu için kamera | SAT",
    desc: "Akaryakıt ve gaz istasyonları ile petrol depolarında güvenlik: pompa ve kasa kameraları, plaka tanıma, çevre koruması, exproof ekipman, yangın alarm sistemi. Özbekistan'da.",
  },
};

const zh: Record<string, ServiceSeo> = {
  cctv: {
    h1: "塔什干视频监控系统 — 整套安装服务",
    title: "塔什干视频监控系统 — 摄像头安装 | SAT",
    desc: "在塔什干及乌兹别克斯坦全境提供视频监控整套解决方案：免费上门勘察、方案设计、IP 与模拟摄像头安装、手机远程查看设置，并提供长期质保与售后服务。",
  },
  servers: {
    h1: "塔什干服务器设备 — 按需定制服务器",
    title: "塔什干服务器设备 — 定制服务器供应 | SAT",
    desc: "塔什干服务器设备供应：面向 1C、办公与虚拟化的定制服务器、机柜、UPS 与网络设备。我们在乌兹别克斯坦全境提供配置选型、供货与安装调试服务。",
  },
  access: {
    h1: "塔什干门禁系统安装与调试",
    title: "塔什干门禁系统安装 — 门禁工程 | SAT",
    desc: "在塔什干承接门禁系统整套安装：闸机、电子锁、读卡器、人脸识别（Face ID）与生物识别、考勤管理。乌兹别克斯坦全境提供方案设计、施工安装与售后服务。",
  },
  fire: {
    h1: "塔什干火灾报警系统安装",
    title: "塔什干火灾报警系统安装工程 | SAT",
    desc: "塔什干火灾报警系统与应急广播疏散系统的设计与安装：探测器、声光报警、联动控制。提供工程验收交付、质保以及乌兹别克斯坦全境的维保服务。",
  },
  intercom: {
    h1: "塔什干楼宇对讲系统安装",
    title: "塔什干楼宇对讲安装 — IP 可视对讲 | SAT",
    desc: "塔什干楼宇对讲安装：适用于住宅、办公与小区的 IP 可视对讲，呼叫可直达手机，并能与门禁系统联动。乌兹别克斯坦全境提供安装与售后服务。",
  },
  turnstile: {
    h1: "塔什干闸机安装 — 整套交付",
    title: "塔什干闸机销售与安装 — 通道闸机 | SAT",
    desc: "塔什干闸机销售与安装：三辊闸、摆闸与平开门通道，可与门禁系统和考勤管理系统联动。乌兹别克斯坦全境提供安装、调试与长期维护服务。",
  },
  barrier: {
    h1: "塔什干道闸安装与自动化控制",
    title: "塔什干道闸安装 — 自动道闸工程 | SAT",
    desc: "塔什干自动道闸：含安装报价、设备销售与施工、遥控器及车牌识别（ANPR）。适用于出入口、停车场和小区，乌兹别克斯坦全境提供安装服务。",
  },
  alarm: {
    h1: "塔什干防盗报警系统安装",
    title: "塔什干防盗报警系统整套安装 | SAT",
    desc: "塔什干防盗报警系统安装：红外移动探测器、门磁开关、紧急报警按钮，可接入监控中心并推送到手机。乌兹别克斯坦全境提供安装与售后服务。",
  },
  gates: {
    h1: "塔什干自动大门安装与改造",
    title: "塔什干自动门安装 — 开门机安装 | SAT",
    desc: "塔什干大门自动化改造与安装：平移门、平开门、工业提升门，配套开门机与遥控系统。乌兹别克斯坦全境提供专业施工安装与定期维护服务。",
  },
  attendance: {
    h1: "塔什干员工考勤管理系统安装",
    title: "塔什干考勤管理系统 — 门禁考勤 | SAT",
    desc: "塔什干考勤管理系统：支持生物识别与刷卡打卡，自动生成考勤表，并可导出至 1C。乌兹别克斯坦全境提供安装、系统配置与技术支持。",
  },
  network: {
    h1: "塔什干综合布线系统施工",
    title: "塔什干综合布线施工 — 弱电布线 | SAT",
    desc: "塔什干综合布线与局域网工程：方案设计、桥架与线缆敷设、服务器机柜、交换机安装、链路测试。乌兹别克斯坦全境提供施工与竣工资料交付。",
  },
  videowall: {
    h1: "塔什干视频墙拼接屏整套安装",
    title: "塔什干拼接屏安装 2x2、3x3 整套 | SAT",
    desc: "塔什干视频墙安装：2x2 与 3x3 拼接方案，46–55 英寸窄边拼接屏、控制器、支架及整体调试。为乌兹别克斯坦的监控中心与指挥中心提供整套交付。",
  },
  wifi: {
    h1: "塔什干 Wi-Fi 无线网络部署与调试",
    title: "塔什干 Wi-Fi 网络部署 — 办公无线 | SAT",
    desc: "塔什干 Wi-Fi 网络设计与调试：无缝漫游，面向办公室、仓库和酒店的无线接入点部署。乌兹别克斯坦全境提供安装施工与长期技术支持。",
  },
  smarthome: {
    h1: "塔什干智能家居系统整套安装",
    title: "塔什干智能家居系统安装 — 整套 | SAT",
    desc: "塔什干智能家居系统：照明、空调温控、窗帘、视频监控与场景联动，全部集中在一个手机应用中。乌兹别克斯坦全境提供安装与调试服务。",
  },
  anpr: {
    h1: "塔什干车牌识别系统 ANPR 安装",
    title: "塔什干车牌识别（ANPR）系统安装 | SAT",
    desc: "塔什干车牌识别（ANPR）系统：凭车牌自动放行、道闸联动、白名单管理，可对接停车场与门禁系统。乌兹别克斯坦全境提供安装与调试服务。",
  },
  telephony: {
    h1: "塔什干办公 IP 电话系统部署",
    title: "塔什干 IP 电话 — 办公电话交换机 | SAT",
    desc: "塔什干 IP 电话与办公电话交换机部署：多线路号码、通话录音、与 CRM 系统对接。乌兹别克斯坦全境提供配置调试与长期技术支持。",
  },
  mikrotik: {
    h1: "塔什干 MikroTik 路由器配置服务",
    title: "塔什干 MikroTik 配置 — 路由与 VPN | SAT",
    desc: "塔什干 MikroTik 路由器配置：路由策略、VPN、多线路负载均衡、防火墙与 Hotspot。提供上门服务、网络外包运维及乌兹别克斯坦全境技术支持。",
  },
  fiber: {
    h1: "塔什干光纤线路铺设与熔接",
    title: "塔什干光纤铺设与熔接施工 | SAT",
    desc: "在塔什干提供光纤线路铺设与熔接服务：光缆敷设、接续盒与光纤配线架安装、OTDR反射仪测量验收。工程覆盖乌兹别克斯坦全境，可现场勘察并提供报价。",
  },
  server: {
    h1: "塔什干服务器机房与数据中心整体交付",
    title: "塔什干服务器机房建设与数据中心施工 | SAT",
    desc: "在塔什干设计并施工服务器机房与数据中心：机柜、综合布线、不间断电源、精密空调与门禁系统。乌兹别克斯坦全境交钥匙交付，并提供后期运维支持。",
  },
  virtualization: {
    h1: "塔什干H3C服务器与虚拟化部署",
    title: "塔什干H3C服务器与虚拟化方案 | SAT",
    desc: "在塔什干供应H3C服务器并实施虚拟化：整合业务负载、提升高可用性、完善备份方案。面向乌兹别克斯坦全境提供方案设计、部署实施与技术支持。",
  },
  locks: {
    h1: "塔什干电子锁与智能门锁安装",
    title: "塔什干电子锁与智能锁安装服务 | SAT",
    desc: "在塔什干安装电子锁与智能门锁：生物识别、刷卡、密码与手机App开锁，可与门禁系统联动。为家庭与办公室提供乌兹别克斯坦全境上门安装服务。",
  },
  industry: {
    h1: "工厂与生产企业安防系统解决方案",
    title: "塔什干工厂视频监控与门禁系统 | SAT",
    desc: "为生产企业设计并安装安防系统：车间与周界视频监控、门禁系统与考勤管理、火灾报警系统、综合布线。拥有500路以上摄像机项目经验，服务乌兹别克斯坦全境。",
  },
  warehouse: {
    h1: "仓库视频监控与安防解决方案",
    title: "塔什干仓库视频监控安装工程 | SAT",
    desc: "为仓库与物流中心提供安防：收货与发货区视频监控、装卸过程管控、员工与车辆门禁系统、大门ANPR车牌识别。乌兹别克斯坦全境设计、施工与售后服务。",
  },
  bank: {
    h1: "银行与办公室安防系统解决方案",
    title: "塔什干银行与办公室监控及门禁 | SAT",
    desc: "为银行网点与办公室提供整体防护：营业区与柜台视频监控、门禁系统与受限区域管理、紧急报警按钮、与安保联动。乌兹别克斯坦全境设计与安装。",
  },
  retail: {
    h1: "商店与连锁零售安防系统方案",
    title: "塔什干商店与连锁店视频监控 | SAT",
    desc: "覆盖卖场、收银台与库房的视频监控，客流统计、收银操作稽核与防盗管理。连锁门店统一平台，总部可远程查看。乌兹别克斯坦全境安装与维护。",
  },
  residential: {
    h1: "住宅小区安防系统整体解决方案",
    title: "塔什干住宅小区监控与楼宇对讲 | SAT",
    desc: "住宅小区整体安防：园区与单元门视频监控、可呼叫手机的IP楼宇对讲、出入口门禁系统与道闸、车牌识别。提供设计、施工与长期维护服务。",
  },
  school: {
    h1: "学校与教育机构安防系统方案",
    title: "塔什干学校视频监控与闸机安装 | SAT",
    desc: "面向中小学、职校与高校：入口闸机与门禁系统、校园与走廊视频监控、广播提示及学生进出的家长通知。乌兹别克斯坦全境交钥匙安装。",
  },
  parking: {
    h1: "塔什干停车场自动化管理系统",
    title: "塔什干停车系统：道闸与ANPR工程 | SAT",
    desc: "停车场与出入口自动化：ANPR车牌识别、道闸与电动门、白名单管理、车位统计与计费、与门禁系统对接。乌兹别克斯坦全境设计与施工。",
  },
  city: {
    h1: "「平安城市」城市视频监控系统",
    title: "平安城市：城市视频监控项目 | SAT",
    desc: "城市级安防系统：街道视频监控网络、人脸与车牌识别、传输链路与视频存储数据中心、指挥调度中心。提供规划设计、施工建设与长期运维支持。",
  },
  bus: {
    h1: "公共交通车载监控与GPS调度",
    title: "公交车车载视频监控与GPS系统 | SAT",
    desc: "公交车与工程车辆的移动视频监控：车厢与驾驶室摄像机、GPS定位监控、客流计数、4G实时回传至调度中心。为车队提供整体改装与交钥匙交付。",
  },
  construction: {
    h1: "塔什干建筑工地视频监控与安防",
    title: "塔什干建筑工地视频监控与看护 | SAT",
    desc: "建筑工地安防：4G独立供电摄像机、机械与材料监管、板房与出入口门禁系统、周界报警、手机远程查看。安装快速，工地转场可整体迁移复用。",
  },
  medical: {
    h1: "诊所与医院安防系统解决方案",
    title: "塔什干诊所视频监控与门禁系统 | SAT",
    desc: "医疗机构整体配置：大厅与走廊视频监控、病区与药房门禁系统、紧急呼叫按钮、火灾报警系统与消防广播。按医疗机构规范要求进行设计与施工。",
  },
  hotel: {
    h1: "塔什干酒店安防系统解决方案",
    title: "塔什干酒店视频监控与门锁工程 | SAT",
    desc: "酒店与公寓式酒店配置：支持房卡与手机开门的客房电子锁、公共区域视频监控、员工区门禁系统、火灾报警系统与广播。提供安装与长期维护。",
  },
  fuel: {
    h1: "加油站与油库安防系统解决方案",
    title: "塔什干加油站视频监控安装工程 | SAT",
    desc: "加油站、加气站与油库安防：加油机与收银区视频监控、车牌识别、周界防护、防爆型设备、火灾报警系统。乌兹别克斯坦全境提供设计与施工。",
  },
};

const BY_LOCALE: Record<string, Record<string, ServiceSeo>> = { ru, uz, en, tr, zh };

export function getServiceSeo(locale: string, key: string): ServiceSeo | null {
  return BY_LOCALE[locale]?.[key] ?? null;
}
