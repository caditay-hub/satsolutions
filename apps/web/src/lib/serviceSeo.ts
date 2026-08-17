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
    title: "Видеонаблюдение и СКУД для банка в Ташкенте — под ключ | SAT",
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
    title: "Bank uchun videokuzatuv va SKUD — Toshkentda | SAT",
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
    title: "Bank CCTV and access control in Tashkent | SAT",
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

const BY_LOCALE: Record<string, Record<string, ServiceSeo>> = { ru, uz, en };

export function getServiceSeo(locale: string, key: string): ServiceSeo | null {
  return BY_LOCALE[locale]?.[key] ?? null;
}
