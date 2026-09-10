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
  "sistemnaya-integraciya": {
    h1: "Системная интеграция в Ташкенте — безопасность и ИТ в одном комплексе",
    title: "Системный интегратор в Ташкенте — сети и безопасность | SAT",
    desc: "Системная интеграция в Ташкенте: видеонаблюдение, СКУД, сигнализация, сети и серверы в одном комплексе. Открытые протоколы, интеграция с 1С, единый пост охраны.",
  },
  "obsluzhivanie": {
    h1: "Обслуживание пожарной сигнализации и систем безопасности — Ташкент",
    title: "Обслуживание пожарной сигнализации и видеонаблюдения | SAT",
    desc: "Договор ТО в Ташкенте: регламентные проверки АПС и СОУЭ по нормам, обслуживание смонтированных нами систем, журнал для инспекции, модернизация с заменой оборудования",
  },
  "proektirovanie": {
    h1: "Проектирование систем безопасности в Ташкенте — АПС, видео, СКУД",
    title: "Проектирование пожарной сигнализации и безопасности | SAT",
    desc: "Рабочие проекты по нормам РУз: пожарная сигнализация (ШНК), видеонаблюдение, СКУД, СКС. Планы, спецификации, сметы, сопровождение экспертизы. Ташкент и регионы.",
  },
  "slabotochnye-sistemy": {
    h1: "Слаботочные системы в Ташкенте — монтаж под ключ",
    title: "Слаботочные системы в Ташкенте — проект и монтаж | SAT",
    desc: "Монтаж слаботочных систем под ключ в Ташкенте: видеонаблюдение, СКУД, пожарная сигнализация, СКС, домофония. Сдача с документами, субподряд для строек, гарантия.",
  },
  cctv: {
    // «системы видеонаблюдения» — QS 1/10 в Ads: запрос обязан быть в H1/title (методика LT)
    h1: "Системы видеонаблюдения в Ташкенте — установка под ключ",
    title: "Системы видеонаблюдения в Ташкенте — установка камер | SAT",
    desc: "Системы видеонаблюдения под ключ в Ташкенте: установка IP и аналоговых камер, бесплатный выезд, проект, монтаж, удалённый доступ с телефона. Гарантия и сервис.",
  },
  analytics: {
    h1: "Видеоаналитика и распознавание лиц в Ташкенте",
    title: "Видеоаналитика в Ташкенте — распознавание лиц | SAT",
    desc: "Видеоаналитика и ИИ в Ташкенте: распознавание лиц и автономеров, подсчёт посетителей, тепловые карты, детекция событий. Внедрение на объекте, гарантия и сервис.",
  },
  servers: {
    // «серверное оборудование» — QS 3/10: витрина /solutions/servers без гео-заголовка
    h1: "Серверное оборудование в Ташкенте — серверы под заказ",
    title: "Серверное оборудование в Ташкенте — серверы под заказ | SAT",
    desc: "Серверное оборудование в Ташкенте: серверы под заказ для 1С, офиса и виртуализации, стойки, ИБП, сетевое оборудование. Подбор конфигурации, поставка и монтаж.",
  },
  access: {
    h1: "Системы контроля доступа (СКУД) в Ташкенте",
    title: "СКУД в Ташкенте — установка систем контроля доступа | SAT",
    desc: "Монтаж СКУД в Ташкенте под ключ: турникеты, электронные замки, считыватели карт, доступ по лицу (Face ID), учёт рабочего времени. Монтаж и сервис по Узбекистану.",
  },
  fire: {
    h1: "Монтаж пожарной сигнализации в Ташкенте",
    title: "Пожарная сигнализация в Ташкенте — монтаж АПС и СОУЭ | SAT",
    desc: "Проектирование и монтаж пожарной сигнализации (АПС) и СОУЭ в Ташкенте: датчики, оповещение, автоматика. Сдача проекта, гарантия и обслуживание по всему Узбекистану.",
  },
  pa: {
    h1: "Системы оповещения и трансляции в Ташкенте",
    title: "Оповещение и трансляция в Ташкенте — СОУЭ | SAT",
    desc: "Системы оповещения и трансляции в Ташкенте: СОУЭ и речевое оповещение по нормам, фоновая музыка, зонное вещание, микрофонные консоли. Проект, монтаж, гарантия.",
  },
  intercom: {
    // Заголовок начинается с «Установка», а не с «Домофоны»: слово в слово с H1
    // каталожной группы /products/group/domofoniya, и по запросу «домофон»
    // (590/мес) страницы конкурировали друг с другом — услуга 27,0, каталог 47,0.
    // Каталог берёт «домофон», услуга — «установку домофона».
    h1: "Установка домофонов в Ташкенте",
    title: "Установка домофона в Ташкенте — монтаж IP-домофонов | SAT",
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
    desc: "Автоматические шлагбаумы в Ташкенте: цена с установкой, монтаж, пульты и распознавание номеров (ANPR). Въезды, парковки и дворы по всему Узбекистану. Гарантия.",
  },
  alarm: {
    h1: "Охранная сигнализация для квартиры и дома в Ташкенте",
    title: "Сигнализация для квартиры и дома в Ташкенте | SAT",
    desc: "Беспроводная охранная сигнализация для квартиры, частного дома и дачи: датчики движения и открытия, сирена, уведомления на телефон. Установка за день без штробления.",
  },
  "ohrannye-sistemy": {
    h1: "Охранные системы для офиса, склада и производства — Ташкент",
    title: "Охранные системы для бизнеса в Ташкенте | SAT",
    desc: "Охранные системы для офисов, складов, магазинов и производства: проводные и гибридные шлейфы, вывод на пультовую охрану, интеграция со СКУД и видеонаблюдением.",
  },
  perimeter: {
    h1: "Охрана периметра объекта в Ташкенте",
    title: "Охрана периметра в Ташкенте — ИК-барьеры и датчики | SAT",
    desc: "Охрана периметра в Ташкенте: ИК-барьеры, вибрационные и радиолучевые датчики на ограждении, тепловизоры и видеоаналитика на заборе. Проект, монтаж, гарантия.",
  },
  gates: {
    h1: "Автоматика для ворот: виды приводов и подбор",
    title: "Автоматика для ворот — виды приводов и подбор | SAT",
    desc: "Как выбрать автоматику для ворот: приводы откатных, распашных и секционных полотен, расчёт по массе и интенсивности, обязательная безопасность.",
  },
  attendance: {
    h1: "Учёт рабочего времени в Ташкенте",
    title: "Учёт рабочего времени в Ташкенте — системы СКУД | SAT",
    desc: "Системы учёта рабочего времени в Ташкенте: биометрия и карты, автоматический табель, выгрузка в 1С. Установка и настройка по всему Узбекистану.",
  },
  network: {
    h1: "Структурированные кабельные системы (СКС) в Ташкенте — монтаж под ключ",
    title: "СКС в Ташкенте — монтаж кабельных систем и сетей | SAT",
    desc: "Структурированные кабельные системы и ЛВС в Ташкенте: проектирование, монтаж трасс, серверные шкафы, коммутаторы, тестирование линий. Сдача документации, гарантия.",
  },
  videowall: {
    h1: "Видеостены в Ташкенте — установка под ключ",
    title: "Видеостена в Ташкенте — установка 2×2, 3×3 под ключ | SAT",
    desc: "Установка видеостен в Ташкенте: конфигурации 2×2 и 3×3, панели 46–55 дюймов с тонким швом, контроллеры, кронштейны, настройка. Диспетчерские центры под ключ.",
  },
  wifi: {
    h1: "Настройка Wi-Fi сетей в Ташкенте",
    title: "Wi-Fi для офиса в Ташкенте — установка сетей | SAT",
    desc: "Проектирование и настройка Wi-Fi сетей в Ташкенте: бесшовный роуминг, точки доступа для офиса, склада и отеля. Монтаж и поддержка по всему Узбекистану.",
  },
  radiobridge: {
    h1: "Радиомосты и беспроводные каналы связи в Ташкенте",
    title: "Радиомост в Ташкенте — беспроводной канал связи | SAT",
    desc: "Радиомосты в Ташкенте: каналы точка-точка и точка-многоточка между объектами, расчёт трассы и частот, юстировка антенн. Монтаж и гарантия по Узбекистану.",
  },
  smarthome: {
    h1: "Умный дом в Ташкенте — установка систем",
    title: "Умный дом в Ташкенте — установка под ключ | SAT",
    desc: "Системы умного дома в Ташкенте: освещение, климат, шторы, видеонаблюдение и сценарии в одном приложении. Установка и настройка по всему Узбекистану.",
  },
  anpr: {
    h1: "Распознавание автономеров в Ташкенте",
    title: "Распознавание номеров (ANPR) в Ташкенте — установка | SAT",
    desc: "Системы распознавания автономеров (ANPR) в Ташкенте: автоматический въезд по номеру, шлагбаумы, белые списки, интеграция с парковкой и СКУД. Монтаж и гарантия.",
  },
  "intellektualnoe-upravlenie-parkingom": {
    h1: "Интеллектуальное управление парковкой в Ташкенте",
    title: "Умная парковка в Ташкенте — оборудование и ПО | SAT",
    desc: "Оборудование умной парковки: распознавание номеров, датчики занятости и табло свободных мест, тарификация и оплата, интеграция с существующими системами.",
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
    desc: "Поставка серверов H3C и внедрение виртуализации в Ташкенте: консолидация нагрузок, отказоустойчивость, резервное копирование. Проект и внедрение по стране.",
  },
  locks: {
    h1: "Электронные и умные замки в Ташкенте",
    title: "Электронные и умные замки в Ташкенте — установка | SAT",
    desc: "Установка электронных и умных замков в Ташкенте: биометрия, карты, коды и приложение, интеграция со СКУД. Монтаж для дома и офиса по всему Узбекистану.",
  },
  // ── отрасли (B2B: крупные объекты, проекты под ключ) ──
  industry: {
    h1: "Системы безопасности для завода и производства",
    title: "Видеонаблюдение и СКУД для завода в Ташкенте | SAT",
    desc: "Системы безопасности на производстве: видеонаблюдение цехов и периметра, СКУД и учёт рабочего времени, пожарная сигнализация, СКС. Монтаж без остановки цехов.",
  },
  warehouse: {
    h1: "Видеонаблюдение и охрана склада",
    title: "Видеонаблюдение для склада в Ташкенте — под ключ | SAT",
    desc: "Безопасность складов и логистики: видеонаблюдение зон приёмки и отгрузки, контроль погрузки, СКУД для персонала и транспорта, ANPR на воротах. Ташкент и регионы.",
  },
  bank: {
    h1: "Системы безопасности для банков и офисов",
    // офисные ключи Ads ведут сюда же — слово «офис» обязано быть в title
    title: "Видеонаблюдение и СКУД для офиса и банка — Ташкент | SAT",
    desc: "Защита банков, филиалов и офисов: видеонаблюдение операционных зон и касс, СКУД и зоны ограниченного доступа, тревожные кнопки. Проект и монтаж по Узбекистану.",
  },
  retail: {
    h1: "Системы безопасности для магазинов и торговых сетей",
    title: "Видеонаблюдение для магазина и сети в Ташкенте | SAT",
    desc: "Видеонаблюдение торговых залов, касс и складов, подсчёт посетителей, контроль кассовых операций и защита от краж. Единая система для сети магазинов из офиса.",
  },
  residential: {
    h1: "Системы безопасности для жилых комплексов",
    title: "Видеонаблюдение и домофония для ЖК в Ташкенте | SAT",
    desc: "Оснащение жилых комплексов: видеонаблюдение территории и подъездов, IP-домофония с вызовом на смартфон, СКУД и шлагбаумы на въезде, распознавание автономеров.",
  },
  school: {
    h1: "Системы безопасности для школ и учебных заведений",
    title: "Видеонаблюдение и турникеты для школы в Ташкенте | SAT",
    desc: "Безопасность школ, колледжей и вузов: турникеты и СКУД на входе, видеонаблюдение территории и коридоров, уведомление родителей о проходе ребёнка. Под ключ.",
  },
  parking: {
    h1: "Организация парковки в ТЦ, ЖК и бизнес-центрах — Ташкент",
    title: "Парковка для ТЦ и бизнес-центра в Ташкенте | SAT",
    desc: "Порядок на парковке торгового центра, ЖК или офиса: закреплённые места для арендаторов и жильцов, пропуск гостей, контроль въезда и отчёты по загрузке.",
  },
  city: {
    h1: "Городские системы видеонаблюдения «Безопасный город»",
    title: "Безопасный город — проект городского видеонаблюдения | SAT",
    desc: "Городские системы безопасности: сеть уличного видеонаблюдения, распознавание лиц и автономеров, каналы связи и ЦОД для видеоархива, ситуационный центр.",
  },
  bus: {
    h1: "Видеонаблюдение и мониторинг для транспорта",
    title: "Видеонаблюдение в автобусе — мобильные системы и GPS | SAT",
    desc: "Мобильное видеонаблюдение для автобусов и спецтехники: камеры в салоне и кабине, GPS-мониторинг, подсчёт пассажиров, передача видео по 4G. Оснащение автопарков.",
  },
  construction: {
    h1: "Видеонаблюдение и охрана строительной площадки",
    title: "Видеонаблюдение на стройке в Ташкенте — охрана объекта | SAT",
    desc: "Охрана строительных площадок: автономные камеры на 4G, контроль техники и материалов, СКУД на бытовки и въезд, охрана периметра, просмотр с телефона.",
  },
  medical: {
    h1: "Системы безопасности для клиник и больниц",
    title: "Видеонаблюдение и СКУД для клиники в Ташкенте | SAT",
    desc: "Оснащение клиник и больниц: видеонаблюдение холлов и коридоров, СКУД в отделения и аптеку, тревожные кнопки, пожарная сигнализация и оповещение. Ташкент.",
  },
  hotel: {
    h1: "Системы безопасности для гостиниц",
    title: "Видеонаблюдение и замки для отеля в Ташкенте | SAT",
    desc: "Оснащение гостиниц и апарт-отелей: электронные замки на номера с картами, видеонаблюдение общих зон, СКУД служебных помещений, пожарная сигнализация.",
  },
  fuel: {
    h1: "Системы безопасности для АЗС и нефтебаз",
    title: "Видеонаблюдение для АЗС в Ташкенте — монтаж под ключ | SAT",
    desc: "Безопасность АЗС, газозаправок и нефтебаз: видеонаблюдение колонок и кассы, распознавание автономеров, охрана периметра, пожарная сигнализация. Ташкент.",
  },
};

const uz: Record<string, ServiceSeo> = {
  "sistemnaya-integraciya": {
    h1: "Toshkentda tizimli integratsiya — xavfsizlik va IT yagona kompleksda",
    title: "Toshkentda tizim integratori — xavfsizlik va tarmoq | SAT",
    desc: "Toshkentda tizimli integratsiya: videokuzatuv, SKUD, signalizatsiya, tarmoq va serverlar yagona kompleksda. Ochiq protokollar, 1C bilan integratsiya, yagona post.",
  },
  "obsluzhivanie": {
    h1: "Yongʻin signalizatsiyasi va xavfsizlik tizimlariga xizmat — Toshkent",
    title: "Yongʻin signalizatsiyasi va videokuzatuvga xizmat | SAT",
    desc: "Toshkentda TX shartnomasi: APS va SOUE reglament tekshiruvlari, oʻzimiz oʻrnatgan tizimlarga xizmat, inspeksiya jurnali, uskunalarni almashtirib modernizatsiya.",
  },
  "proektirovanie": {
    h1: "Toshkentda xavfsizlik tizimlarini loyihalash — APS, video, SKUD",
    title: "Yongʻin signalizatsiyasi va xavfsizlikni loyihalash | SAT",
    desc: "OʻzR meʼyorlari boʻyicha ishchi loyihalar: yongʻin signalizatsiyasi (ShNQ), videokuzatuv, SKUD, SKS. Rejalar, spetsifikatsiyalar, smetalar. Toshkent va viloyatlar.",
  },
  "slabotochnye-sistemy": {
    h1: "Toshkentda kuchsiz tok tizimlari — kalit topshirish montaji",
    title: "Kuchsiz tok tizimlari Toshkentda — loyiha va montaj | SAT",
    desc: "Toshkentda kuchsiz tok tizimlari montaji: videokuzatuv, SKUD, yongʻin signalizatsiyasi, SKS, domofoniya. Hujjatlar bilan topshirish, subpudrat, kafolat.",
  },
  servers: {
    h1: "Server uskunalari Toshkentda — buyurtma asosida serverlar",
    title: "Server uskunalari Toshkentda — serverlar | SAT",
    desc: "Toshkentda server uskunalari: 1C, ofis va virtualizatsiya uchun buyurtma serverlari, stoykalar, UPS, tarmoq uskunalari. Yetkazib berish va montaj mamlakat boʻylab.",
  },
  cctv: {
    h1: "Toshkentda videokuzatuv oʻrnatish",
    title: "Toshkentda videokuzatuv oʻrnatish — kamera montaji | SAT",
    desc: "Toshkentda videokuzatuv kameralarini kalit topshirish asosida oʻrnatamiz: bepul chiqish, loyiha, IP va analog tizimlar montaji, telefondan kirish. Kafolat va servis.",
  },
  analytics: {
    h1: "Toshkentda videoanalitika va yuzni tanish",
    title: "Videoanalitika Toshkentda — yuzni tanish | SAT",
    desc: "Toshkentda videoanalitika va sunʼiy intellekt: yuz va avtoraqamlarni tanish, tashrifchilarni sanash, issiqlik xaritalari, hodisalarni aniqlash. Joriy etish, kafolat.",
  },
  access: {
    h1: "SKUD tizimi Toshkentda — kirishni boshqarish",
    title: "SKUD tizimi Toshkentda — oʻrnatish va narxi | SAT",
    desc: "Toshkentda SKUD montaji: turniketlar, elektron qulflar, karta oʻquvchilar, yuz boʻyicha kirish va biometriya, ish vaqti hisobi. Montaj va servis mamlakat boʻylab.",
  },
  fire: {
    h1: "Yongʻin xavfsizligi tizimlari Toshkentda — montaj",
    title: "Yongʻin xavfsizligi va signalizatsiyasi Toshkentda | SAT",
    desc: "Toshkentda yongʻin signalizatsiyasi (APS) va SOUE loyihalash hamda montaji: datchiklar, ogohlantirish, avtomatika. Loyihani topshirish, kafolat va xizmat koʻrsatish.",
  },
  pa: {
    h1: "Toshkentda ogohlantirish va translyatsiya tizimlari",
    title: "Ogohlantirish va translyatsiya — SOUE Toshkentda | SAT",
    desc: "Toshkentda ogohlantirish va translyatsiya tizimlari: meʼyorlar boʻyicha SOUE va nutqli ogohlantirish, fon musiqasi, zonali eshittirish. Loyiha, montaj, kafolat.",
  },
  intercom: {
    h1: "Toshkentda domofon oʻrnatish",
    title: "Toshkentda domofon oʻrnatish — IP-domofon montaji | SAT",
    desc: "Toshkentda domofon oʻrnatish: uy, ofis va TJM uchun IP va video domofonlar, smartfonga qoʻngʻiroq, SKUD bilan integratsiya. Montaj va servis mamlakat boʻylab.",
  },
  turnstile: {
    h1: "Toshkentda turniketlar — kalit topshirish montaji",
    title: "Turniketlar Toshkentda — sotish va oʻrnatish | SAT",
    desc: "Toshkentda turniketlarni sotish va oʻrnatish: oʻtish yoʻlaklari, kalitkalar, SKUD va ish vaqti hisobi bilan integratsiya. Montaj va xizmat mamlakat boʻylab.",
  },
  barrier: {
    h1: "Toshkentda shlagbaumlar — oʻrnatish va avtomatika",
    title: "Shlagbaum narxi va oʻrnatish Toshkentda — avtomatik | SAT",
    desc: "Toshkentda avtomatik shlagbaumlar: sotish, montaj, pultlar va avtoraqamni aniqlash (ANPR). Kirish yoʻllari, avtoturargoh va hovlilarga oʻrnatish. Kafolat.",
  },
  alarm: {
    h1: "Toshkentda kvartira va uy uchun qoʻriqlash signalizatsiyasi",
    title: "Kvartira va uy uchun signalizatsiya Toshkentda | SAT",
    desc: "Kvartira, xususiy uy va dala hovli uchun simsiz signalizatsiya: harakat va ochilish datchiklari, sirena, telefonga xabar. Bir kunda shtrobasiz oʻrnatiladi.",
  },
  "ohrannye-sistemy": {
    h1: "Ofis, ombor va ishlab chiqarish uchun qoʻriqlash tizimlari",
    title: "Biznes uchun qoʻriqlash tizimlari Toshkentda | SAT",
    desc: "Ofis, ombor, doʻkon va ishlab chiqarish uchun qoʻriqlash tizimlari: simli va gibrid shleyflar, pultli qoʻriqlashga chiqarish, SKUD va videokuzatuvga integratsiya.",
  },
  perimeter: {
    h1: "Toshkentda obyekt perimetrini qoʻriqlash",
    title: "Perimetr qoʻriqlash Toshkentda — IQ-barerlar | SAT",
    desc: "Toshkentda perimetr qoʻriqlash: IQ-barerlar, vibratsion va radionurli datchiklar, teplovizorlar va panjara boʻylab videoanalitika. Loyiha, montaj va kafolat.",
  },
  gates: {
    h1: "Darvoza avtomatikasi: privod turlari va tanlash",
    title: "Darvoza avtomatikasi — privod turlari va tanlash | SAT",
    desc: "Darvoza avtomatikasini qanday tanlash: surma, tavaqali va seksiyali privodlar, massa va intensivlik boʻyicha hisob, majburiy xavfsizlik va boshqaruv.",
  },
  attendance: {
    h1: "Davomat tizimi va ish vaqtini hisobga olish — Toshkent",
    title: "Davomat tizimi Toshkentda — ish vaqtini hisobga olish | SAT",
    desc: "Toshkentda ish vaqtini hisobga olish tizimlari: biometriya va kartalar, avtomatik tabel, 1C ga yuklash. Oʻrnatish va sozlash butun Oʻzbekiston boʻylab.",
  },
  network: {
    h1: "Toshkentda SKS va lokal tarmoqlar montaji",
    title: "SKS va LVS montaji Toshkentda — lokal tarmoqlar | SAT",
    desc: "Toshkentda strukturali kabel tizimlari (SKS) va lokal tarmoqlar: loyihalash, kabel trassalari montaji, server shkaflari, kommutatorlar, hujjatlar topshiriladi.",
  },
  videowall: {
    h1: "Toshkentda videodevorlar — kalit topshirish asosida oʻrnatish",
    title: "Videodevor Toshkentda — 2×2, 3×3 oʻrnatish | SAT",
    desc: "Toshkentda videodevorlar oʻrnatish: 2×2 va 3×3 konfiguratsiyalar, 46–55 dyuymli ingichka chokli panellar, kontrollerlar, sozlash. Dispetcherlik markazlari.",
  },
  wifi: {
    h1: "Toshkentda Wi-Fi tarmoqlarini sozlash",
    title: "Ofis uchun Wi-Fi Toshkentda — tarmoq oʻrnatish | SAT",
    desc: "Toshkentda Wi-Fi tarmoqlarini loyihalash va sozlash: uzluksiz rouming, ofis, ombor va mehmonxona uchun kirish nuqtalari. Montaj va qoʻllab-quvvatlash. Kafolat.",
  },
  radiobridge: {
    h1: "Toshkentda radiokoʻpriklar va simsiz aloqa kanallari",
    title: "Radiokoʻprik Toshkentda — simsiz aloqa kanali | SAT",
    desc: "Toshkentda radiokoʻpriklar: obyektlar orasida nuqta-nuqta va nuqta-koʻp nuqta kanallari, trassa va chastota hisobi, antennalarni yustirovka. Montaj va kafolat.",
  },
  smarthome: {
    h1: "Toshkentda aqlli uy — tizim oʻrnatish",
    title: "Aqlli uy Toshkentda — kalit topshirish oʻrnatish | SAT",
    desc: "Toshkentda aqlli uy tizimlari: yoritish, iqlim, pardalar, videokuzatuv va ssenariylar bitta ilovada. Oʻrnatish va sozlash butun Oʻzbekiston boʻylab.",
  },
  anpr: {
    h1: "Toshkentda avtoraqamlarni aniqlash",
    title: "Avtoraqamlarni aniqlash (ANPR) Toshkentda | SAT",
    desc: "Toshkentda avtoraqamlarni aniqlash (ANPR) tizimlari: raqam boʻyicha avtomatik kirish, shlagbaumlar, oq roʻyxatlar, avtoturargoh va SKUD bilan integratsiya.",
  },
  "intellektualnoe-upravlenie-parkingom": {
    h1: "Toshkentda avtoturargohni aqlli boshqarish",
    title: "Aqlli avtoturargoh Toshkentda — uskuna va dastur | SAT",
    desc: "Aqlli avtoturargoh uskunasi: avtoraqamlarni tanish, band joy datchiklari va boʻsh joylar taxtasi, tariflash va toʻlov, mavjud tizimlar bilan integratsiya.",
  },
  telephony: {
    h1: "IP telefoniya Toshkentda — ofis uchun ATS",
    title: "IP telefoniya Toshkentda — ATS oʻrnatish narxi | SAT",
    desc: "Toshkentda IP-telefoniya va ofis ATS oʻrnatish: koʻp kanalli raqamlar, suhbatlarni yozib olish, CRM bilan integratsiya. Sozlash va qoʻllab-quvvatlash. Kafolat.",
  },
  mikrotik: {
    h1: "Toshkentda MikroTik sozlash",
    title: "MikroTik sozlash Toshkentda — routerlar va VPN | SAT",
    desc: "Toshkentda MikroTik routerlarini sozlash: marshrutlash, VPN, kanallarni balanslash, firewall va Hotspot. Chiqish, tarmoq autsorsingi va qoʻllab-quvvatlash.",
  },
  fiber: {
    h1: "Toshkentda optik tolani yotqizish",
    title: "Optik tola Toshkentda — VOLS yotqizish va payvandlash | SAT",
    desc: "Toshkentda optik tola liniyalarini (VOLS) yotqizish va payvandlash: kabel montaji, muftalar, kross, reflektometr oʻlchovlari. Ishlar Oʻzbekiston boʻylab.",
  },
  server: {
    h1: "Toshkentda server xonasi va maʼlumot markazi",
    title: "Server xonasi Toshkentda — kalit topshirish montaji | SAT",
    desc: "Toshkentda server xonalari va maʼlumot markazlarini loyihalash va montaji: stoykalar, SKS, uzluksiz quvvat, sovitish va kirish nazorati. Kalit topshirish asosida.",
  },
  virtualization: {
    h1: "Toshkentda H3C serverlari va virtualizatsiya",
    title: "H3C serverlari va virtualizatsiya Toshkentda | SAT",
    desc: "Toshkentda H3C serverlarini yetkazib berish va virtualizatsiyani joriy etish: yuklamalar konsolidatsiyasi, xatolarga chidamlilik, zaxira nusxa. Loyiha va montaj.",
  },
  locks: {
    h1: "Toshkentda elektron va aqlli qulflar",
    title: "Elektron va aqlli qulflar Toshkentda — oʻrnatish | SAT",
    desc: "Toshkentda elektron va aqlli qulflarni oʻrnatish: biometriya, kartalar, kodlar va ilova, SKUD bilan integratsiya. Uy va ofis uchun montaj Oʻzbekiston boʻylab.",
  },
  // ── tarmoqlar (B2B) ──
  industry: {
    h1: "Zavod va ishlab chiqarish uchun xavfsizlik tizimlari",
    title: "Zavod uchun videokuzatuv va SKUD — Toshkentda loyiha | SAT",
    desc: "Ishlab chiqarishda xavfsizlik tizimlari: sexlar va perimetr videokuzatuvi, SKUD va ish vaqti hisobi, yongʻin signalizatsiyasi, SKS. Montaj sexlarni toʻxtatmasdan.",
  },
  warehouse: {
    h1: "Ombor uchun videokuzatuv va xavfsizlik",
    title: "Ombor uchun videokuzatuv — Toshkentda kalit topshirish | SAT",
    desc: "Ombor va logistika markazlari xavfsizligi: qabul va joʻnatish zonalari videokuzatuvi, xodimlar va transport uchun SKUD, darvozada ANPR. Loyiha, montaj va servis.",
  },
  bank: {
    h1: "Banklar va ofislar uchun xavfsizlik tizimlari",
    title: "Ofis va bank uchun videokuzatuv va SKUD — Toshkent | SAT",
    desc: "Banklar, filiallar va ofislarni himoya qilish: operatsion zona va kassalar videokuzatuvi, SKUD va cheklangan kirish zonalari, trevoga tugmalari. Loyiha va montaj.",
  },
  retail: {
    h1: "Doʻkonlar va savdo tarmoqlari uchun xavfsizlik",
    title: "Doʻkon uchun videokuzatuv — Toshkentda montaj | SAT",
    desc: "Savdo zali, kassa va omborlar videokuzatuvi, tashrifchilarni sanash, kassa operatsiyalari nazorati va oʻgʻirlikdan himoya. Butun tarmoq uchun yagona tizim.",
  },
  residential: {
    h1: "Turar-joy majmualari uchun xavfsizlik tizimlari",
    title: "TJM uchun videokuzatuv va domofon — Toshkentda | SAT",
    desc: "Turar-joy majmualarini jihozlash: hudud va podyezdlar videokuzatuvi, smartfonga qoʻngʻiroqli IP-domofon, kirishda SKUD va shlagbaum, avtoraqamlarni tanish.",
  },
  school: {
    h1: "Maktab va oʻquv muassasalari uchun xavfsizlik",
    title: "Maktab uchun videokuzatuv va turniketlar — Toshkentda | SAT",
    desc: "Maktab, kollej va oliygohlar xavfsizligi: kirishda turniket va SKUD, hudud va koridorlar videokuzatuvi, ota-onalarga bolaning kirib-chiqishi haqida xabar.",
  },
  parking: {
    h1: "Savdo markazi, TJM va biznes-markaz avtoturargohi — Toshkent",
    title: "TJM va biznes-markaz avtoturargohi Toshkentda | SAT",
    desc: "Savdo markazi, TJM yoki ofis avtoturargohida tartib: ijarachi va yashovchilar uchun biriktirilgan joylar, mehmonlarni oʻtkazish, kirish nazorati va hisobotlar.",
  },
  city: {
    h1: "«Xavfsiz shahar» shahar videokuzatuv tizimlari",
    title: "Xavfsiz shahar — shahar videokuzatuv loyihasi | SAT",
    desc: "Shahar xavfsizlik tizimlari: koʻcha videokuzatuv tarmogʻi, yuz va avtoraqamlarni tanish, aloqa kanallari va videoarxiv markazi, vaziyat markazi. Loyihalash.",
  },
  bus: {
    h1: "Transport uchun videokuzatuv va monitoring",
    title: "Avtobusda videokuzatuv — mobil tizimlar va GPS | SAT",
    desc: "Avtobus va maxsus texnika uchun mobil videokuzatuv: salon va kabinada kameralar, GPS-monitoring, yoʻlovchilarni sanash, 4G orqali dispetcherlik markaziga uzatish.",
  },
  construction: {
    h1: "Qurilish maydoni uchun videokuzatuv va qoʻriqlash",
    title: "Qurilishda videokuzatuv — obyektni qoʻriqlash | SAT",
    desc: "Qurilish maydonlarini qoʻriqlash: 4G avtonom kameralar, texnika va materiallar nazorati, vagon va kirishda SKUD, perimetr qoʻriqlash, masofaviy koʻrish.",
  },
  medical: {
    h1: "Klinika va shifoxonalar uchun xavfsizlik tizimlari",
    title: "Klinika uchun videokuzatuv va SKUD — Toshkentda | SAT",
    desc: "Tibbiyot muassasalarini jihozlash: xoll va koridorlar videokuzatuvi, boʻlim va dorixonaga SKUD, trevoga tugmalari, yongʻin signalizatsiyasi va ogohlantirish tizimi.",
  },
  hotel: {
    h1: "Mehmonxonalar uchun xavfsizlik tizimlari",
    title: "Mehmonxona uchun videokuzatuv va qulflar — Toshkentda | SAT",
    desc: "Mehmonxona va apart-otellarni jihozlash: karta bilan ochiladigan elektron qulflar, umumiy zonalar videokuzatuvi, xizmat xonalari SKUD, yongʻin signalizatsiyasi.",
  },
  fuel: {
    h1: "Shaxobcha va neft bazalari uchun xavfsizlik",
    title: "Shaxobcha uchun videokuzatuv — Toshkentda montaj | SAT",
    desc: "Yoqilgʻi shaxobchalari va neft bazalari xavfsizligi: kolonka va kassa videokuzatuvi, avtoraqamlarni tanish, perimetr qoʻriqlash, yongʻin signalizatsiyasi.",
  },
};

const en: Record<string, ServiceSeo> = {
  "sistemnaya-integraciya": {
    h1: "System Integration in Tashkent — Security and IT in One Complex",
    title: "System Integrator in Tashkent — Security & Networks | SAT",
    desc: "System integration in Tashkent: CCTV, access control, alarms, networks and servers in one complex. Open protocols, 1C integration, a single control post. Free audit.",
  },
  "obsluzhivanie": {
    h1: "Fire Alarm & Security Maintenance in Tashkent",
    title: "Fire Alarm & CCTV Maintenance in Tashkent | SAT",
    desc: "Maintenance contracts in Tashkent: scheduled fire alarm inspections to code, service for the systems we installed, inspection logbooks, upgrades with new equipment.",
  },
  "proektirovanie": {
    h1: "Security Systems Design in Tashkent — Fire Alarm, CCTV, ACS",
    title: "Fire Alarm & Security Systems Design in Tashkent | SAT",
    desc: "Working designs to Uzbekistan codes: fire alarm, CCTV, access control, structured cabling. Layouts, specifications, budgets and expert-review support in Tashkent.",
  },
  "slabotochnye-sistemy": {
    h1: "Low-Voltage Systems in Tashkent — Turnkey Installation",
    title: "Low-Voltage Systems in Tashkent — Installation | SAT",
    desc: "Turnkey low-voltage installation in Tashkent: CCTV, access control, fire alarm, structured cabling, intercom. Documented handover, subcontracting for construction.",
  },
  servers: {
    h1: "Server Hardware in Tashkent — Custom-Built Servers",
    title: "Server Hardware in Tashkent — Custom Servers | SAT",
    desc: "Server hardware in Tashkent: custom-built servers for 1C, office and virtualization, racks, UPS and network equipment. Configuration, supply and installation.",
  },
  cctv: {
    h1: "CCTV Installation Company in Tashkent, Uzbekistan",
    title: "CCTV Installation in Tashkent — Cameras & Service | SAT",
    desc: "Turnkey CCTV camera installation in Tashkent: free site survey, design, IP and analog system setup, remote access from your phone. Warranty and service.",
  },
  analytics: {
    h1: "Video Analytics and AI in Tashkent",
    title: "Video Analytics in Tashkent — Face Recognition | SAT",
    desc: "Video analytics and AI in Tashkent: face and licence plate recognition, visitor counting, heat maps and event detection. Rollout on site, warranty and service.",
  },
  access: {
    h1: "Access Control Systems in Tashkent",
    title: "Access Control in Tashkent — Turnstiles & Locks | SAT",
    desc: "Turnkey access control (ACS) in Tashkent: turnstiles, electronic locks, card readers, face recognition and biometrics, time and attendance. Installation and service.",
  },
  fire: {
    h1: "Fire Alarm System Design & Installation in Uzbekistan",
    title: "Fire Alarm Design & Installation in Tashkent | SAT",
    desc: "Fire alarm and voice evacuation design and installation in Tashkent: detectors, notification, automation. Project handover, warranty and maintenance in Uzbekistan.",
  },
  pa: {
    h1: "Public Address and Voice Evacuation in Tashkent",
    title: "Public Address & Voice Evacuation in Tashkent | SAT",
    desc: "Public address and broadcasting systems in Tashkent: voice evacuation to code, background music, zone broadcasting, microphone consoles. Design and installation.",
  },
  intercom: {
    h1: "Intercom Installation in Tashkent",
    title: "Intercoms in Tashkent — IP & Video Intercom Setup | SAT",
    desc: "Intercom installation in Tashkent: IP and video intercoms for homes, offices and residential complexes, call to smartphone, ACS integration. Warranty and service.",
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
    h1: "Home and Apartment Security Alarms in Tashkent",
    title: "Home Security Alarm in Tashkent — Apartments | SAT",
    desc: "Wireless security alarms for apartments, houses and dachas in Tashkent: motion and door sensors, siren, alerts to your phone. Fitted in a day, no wall chasing.",
  },
  "ohrannye-sistemy": {
    h1: "Security Systems for Offices, Warehouses and Plants",
    title: "Business Security Systems in Tashkent | SAT",
    desc: "Security systems for offices, warehouses, shops and production: wired and hybrid loops, connection to a monitoring station, integration with access control and CCTV.",
  },
  perimeter: {
    h1: "Perimeter Protection in Tashkent",
    title: "Perimeter Protection in Tashkent — IR Barriers | SAT",
    desc: "Perimeter protection in Tashkent: IR barriers, vibration and microwave sensors on the fence, thermal cameras and fence-line video analytics. Design and installation.",
  },
  gates: {
    h1: "Gate Automation: Drive Types and How to Choose",
    title: "Gate Automation — Drive Types and Sizing | SAT",
    desc: "How to choose gate automation: drives for sliding, swing and sectional leaves, sizing by leaf mass and duty cycle, mandatory safety devices and controls.",
  },
  attendance: {
    h1: "Time & Attendance Systems in Tashkent",
    title: "Time & Attendance in Tashkent — Access Systems | SAT",
    desc: "Time and attendance systems in Tashkent: biometrics and cards, automatic timesheets, export to 1C. Installation and setup across Uzbekistan.",
  },
  network: {
    h1: "Structured Cabling & LAN Installation in Tashkent, Uzbekistan",
    title: "Structured Cabling & LAN in Tashkent — Networks | SAT",
    desc: "Structured cabling (SCS) and LAN design and installation in Tashkent: cable routes, server racks, switches. Documentation handover across Uzbekistan.",
  },
  videowall: {
    h1: "Video Walls in Tashkent — Turnkey Installation",
    title: "Video Wall in Tashkent — 2×2, 3×3 Installation | SAT",
    desc: "Video wall installation in Tashkent: 2×2 and 3×3 configurations, 46–55 inch slim-bezel panels, controllers, mounts and calibration. Dispatch and situation centers.",
  },
  wifi: {
    h1: "Wi-Fi Network Setup in Tashkent",
    title: "Office Wi-Fi in Tashkent — Network Installation | SAT",
    desc: "Wi-Fi network design and setup in Tashkent: seamless roaming, access points for office, warehouse and hotel. Installation and support across Uzbekistan.",
  },
  radiobridge: {
    h1: "Radio Bridges and Wireless Links in Tashkent",
    title: "Radio Bridge in Tashkent — Wireless Link | SAT",
    desc: "Radio bridges in Tashkent: point-to-point and point-to-multipoint links between sites, path and frequency planning, antenna alignment. Installation and warranty.",
  },
  smarthome: {
    h1: "Smart Home in Tashkent — System Installation",
    title: "Smart Home in Tashkent — Turnkey Installation | SAT",
    desc: "Smart home systems in Tashkent: lighting, climate, blinds, CCTV and scenes in one app. Installation and setup across Uzbekistan.",
  },
  anpr: {
    h1: "License Plate Recognition in Tashkent",
    title: "License Plate Recognition (ANPR) in Tashkent | SAT",
    desc: "License plate recognition (ANPR) systems in Tashkent: automatic entry by plate, barriers, whitelists, parking and access control integration. Installation, warranty.",
  },
  "intellektualnoe-upravlenie-parkingom": {
    h1: "Smart Parking Management in Tashkent",
    title: "Smart Parking in Tashkent — Hardware & Software | SAT",
    desc: "Smart parking hardware in Tashkent: plate recognition, occupancy sensors and free-space displays, tariffs and payment, integration with the systems you already run.",
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
    desc: "Security systems for manufacturing: CCTV for workshops and perimeter, access control with time attendance, fire alarm, cabling. Installed without stopping the plant.",
  },
  warehouse: {
    h1: "Warehouse CCTV and security systems",
    title: "Warehouse CCTV in Tashkent — turnkey installation | SAT",
    desc: "Security for warehouses and logistics centres: CCTV of receiving and dispatch areas, loading control, access control for staff and vehicles, ANPR at the gates.",
  },
  bank: {
    h1: "Security systems for banks and offices",
    title: "Office & Bank CCTV and Access Control in Tashkent | SAT",
    desc: "Protection for banks, branches and offices: CCTV of teller areas and cash desks, access control and restricted zones, panic buttons. Design and installation.",
  },
  retail: {
    h1: "Security systems for shops and retail chains",
    title: "Retail CCTV in Tashkent — turnkey installation | SAT",
    desc: "CCTV for sales floors, checkouts and stockrooms, visitor counting, POS transaction control and loss prevention. One system for the whole chain, run from head office.",
  },
  residential: {
    h1: "Security systems for residential complexes",
    title: "CCTV and Intercom for Residential Complexes | SAT",
    desc: "Equipment for residential complexes in Tashkent: CCTV of grounds and entrances, IP intercom with calls to smartphone, access control and barriers, plate recognition.",
  },
  school: {
    h1: "Security systems for schools and universities",
    title: "School CCTV and turnstiles in Tashkent | SAT",
    desc: "Safety for schools, colleges and universities: turnstiles and access control at the entrance, CCTV of grounds and corridors, alerts to parents on a child entry.",
  },
  parking: {
    h1: "Parking Order for Malls, Residential and Business Centres",
    title: "Parking for Malls and Business Centres | SAT",
    desc: "Order on the car park of a mall, residential or office complex in Tashkent: reserved bays for tenants and residents, guest entry and occupancy reports.",
  },
  city: {
    h1: "Safe City urban video surveillance",
    title: "Safe City — urban video surveillance project | SAT",
    desc: "Urban security systems: street CCTV network, face and licence plate recognition, transmission channels and a data centre for the video archive, situation centre.",
  },
  bus: {
    h1: "CCTV and monitoring for public transport",
    title: "Bus CCTV — mobile systems and GPS tracking | SAT",
    desc: "Mobile CCTV for buses and special vehicles: cameras in the cabin and saloon, GPS monitoring, passenger counting, video streaming to the dispatch centre over 4G.",
  },
  construction: {
    h1: "CCTV and security for construction sites",
    title: "Construction site CCTV in Tashkent — site security | SAT",
    desc: "Construction site protection: autonomous 4G cameras, control of machinery and materials, access control for site cabins and entry, perimeter alarm, remote viewing.",
  },
  medical: {
    h1: "Security systems for clinics and hospitals",
    title: "Clinic CCTV and access control in Tashkent | SAT",
    desc: "Equipment for medical facilities: CCTV of halls and corridors, access control for wards and pharmacy, panic buttons, fire alarm and evacuation warning systems.",
  },
  hotel: {
    h1: "Security systems for hotels",
    title: "Hotel CCTV and electronic locks in Tashkent | SAT",
    desc: "Equipment for hotels and apart-hotels: electronic room locks with cards, CCTV of public areas, access control for service rooms, fire alarm and warning systems.",
  },
  fuel: {
    h1: "Security systems for petrol stations and oil depots",
    title: "Petrol station CCTV in Tashkent — turnkey | SAT",
    desc: "Security for petrol and gas stations and oil depots: CCTV of pumps and cash desk, licence plate recognition, perimeter protection, fire alarm. Tashkent and regions.",
  },
};

const tr: Record<string, ServiceSeo> = {
  "sistemnaya-integraciya": {
    h1: "Taşkent'te Sistem Entegrasyonu — Güvenlik ve BT Tek Komplekste",
    title: "Taşkent'te Sistem Entegratörü — Güvenlik, Ağ, Sunucu | SAT",
    desc: "Sistem entegrasyonu: CCTV, geçiş, alarm, ağ ve sunucular tek komplekste. Açık protokoller, 1C entegrasyonu, H3C sunucuları, tek kontrol noktası. Ücretsiz denetim.",
  },
  "obsluzhivanie": {
    h1: "Taşkent'te Yangın Alarmı ve Güvenlik Bakımı",
    title: "Taşkent'te Yangın Alarmı ve Kamera Bakımı | SAT",
    desc: "Taşkent'te bakım sözleşmeleri: mevzuata uygun periyodik yangın alarmı kontrolleri, kurduğumuz sistemlerin bakımı, denetim defteri, ekipman değişimiyle modernizasyon.",
  },
  "proektirovanie": {
    h1: "Taşkent'te Güvenlik Sistemleri Projelendirme — Yangın, CCTV, Geçiş",
    title: "Taşkent'te Yangın Alarmı ve Güvenlik Projesi | SAT",
    desc: "Özbekistan normlarına göre çalışma projeleri: yangın alarmı, CCTV, geçiş kontrolü, yapısal kablolama. Planlar, şartnameler, bütçeler ve ekspertiz desteği.",
  },
  "slabotochnye-sistemy": {
    h1: "Taşkent'te Zayıf Akım Sistemleri — Anahtar Teslim Montaj",
    title: "Taşkent'te Zayıf Akım Sistemleri — Montaj | SAT",
    desc: "Taşkent'te anahtar teslim zayıf akım montajı: CCTV, geçiş kontrolü, yangın alarmı, yapısal kablolama, interkom. Evraklı teslim, inşaatlara taşeronluk, garanti.",
  },
  cctv: {
    h1: "Taşkent'te güvenlik kamerası sistemi — anahtar teslim",
    title: "Taşkent'te Güvenlik Kamerası Sistemi Kurulumu | SAT",
    desc: "Taşkent'te anahtar teslim güvenlik kamerası sistemleri: ücretsiz keşif, proje, IP ve analog kamera montajı, telefondan uzaktan erişim. Garanti ve servis.",
  },
  analytics: {
    h1: "Taşkent'te video analitik ve yüz tanıma",
    title: "Taşkent'te Video Analitik — Yüz Tanıma | SAT",
    desc: "Taşkent'te video analitik ve yapay zekâ: yüz ve plaka tanıma, ziyaretçi sayımı, ısı haritaları, olay tespiti. Sahada devreye alma, garanti ve servis.",
  },
  servers: {
    h1: "Taşkent'te sunucu ekipmanları — siparişe özel sunucular",
    title: "Taşkent'te Sunucu Ekipmanları — Özel Sunucular | SAT",
    desc: "Taşkent'te sunucu ekipmanları: 1C, ofis ve sanallaştırma için siparişe özel sunucular, kabinetler, UPS ve ağ cihazları. Konfigürasyon, tedarik ve montaj.",
  },
  access: {
    h1: "Taşkent'te geçiş kontrol sistemleri — anahtar teslim",
    title: "Taşkent'te Geçiş Kontrol Sistemi Kurulumu | SAT",
    desc: "Taşkent'te geçiş kontrol sistemi montajı: turnikeler, elektronik kilitler, kart okuyucular, Face ID ve biyometri, personel devam takibi. Kurulum ve servis.",
  },
  fire: {
    h1: "Taşkent'te yangın alarm sistemi montajı",
    title: "Taşkent'te Yangın Alarm Sistemi Montajı | SAT",
    desc: "Taşkent'te yangın alarm ve sesli uyarı sistemi projelendirme ve montajı: dedektörler, ihbar, otomasyon. Proje teslimi, garanti ve Özbekistan genelinde bakım.",
  },
  pa: {
    h1: "Taşkent'te seslendirme ve anons sistemleri",
    title: "Taşkent'te Anons ve Seslendirme Sistemleri | SAT",
    desc: "Taşkent'te anons ve seslendirme sistemleri: mevzuata uygun sesli uyarı, fon müziği, bölgesel yayın, mikrofon konsolları. Proje, montaj ve garanti.",
  },
  intercom: {
    h1: "Taşkent'te diafon ve IP interkom kurulumu",
    title: "Taşkent'te Diafon Kurulumu — IP Diafon | SAT",
    desc: "Taşkent'te diafon kurulumu: ev, ofis ve siteler için IP ve görüntülü diafonlar, akıllı telefona çağrı, geçiş kontrol entegrasyonu. Montaj, servis ve garanti.",
  },
  turnstile: {
    h1: "Taşkent'te turnike kurulumu — anahtar teslim",
    title: "Taşkent'te Turnike Satışı ve Kurulumu | SAT",
    desc: "Taşkent'te turnike satışı ve montajı: geçiş turnikeleri, engelli kapıları, geçiş kontrol ve personel devam takibi entegrasyonu. Özbekistan genelinde kurulum.",
  },
  barrier: {
    h1: "Taşkent'te bariyer kurulumu ve otomasyonu",
    title: "Taşkent'te Otomatik Bariyer Kurulumu | SAT",
    desc: "Taşkent'te otomatik bariyerler: kurulum dahil fiyat, montaj, kumandalar ve plaka tanıma (ANPR). Girişler, otoparklar ve siteler için kurulum, garanti.",
  },
  alarm: {
    h1: "Taşkent'te ev ve daire için hırsız alarm sistemi",
    title: "Taşkent'te Ev ve Daire Alarm Sistemi | SAT",
    desc: "Daire, müstakil ev ve yazlık için kablosuz hırsız alarmı: hareket ve kapı sensörleri, siren, telefona bildirim. Kırım dökümsüz, bir günde kurulum. Taşkent geneli.",
  },
  "ohrannye-sistemy": {
    h1: "Ofis, depo ve üretim için güvenlik sistemleri",
    title: "Taşkent'te İşletmeler için Güvenlik Sistemleri | SAT",
    desc: "Ofis, depo, mağaza ve üretim için güvenlik sistemleri: kablolu ve hibrit hatlar, izleme merkezine bağlantı, geçiş kontrol ve kamera sistemiyle entegrasyon.",
  },
  perimeter: {
    h1: "Taşkent'te tesis çevre güvenliği",
    title: "Taşkent'te Çevre Güvenliği — IR Bariyerler | SAT",
    desc: "Taşkent'te çevre güvenliği: IR bariyerler, çit üzerinde titreşim ve mikrodalga sensörler, termal kameralar ve çit hattı video analitiği. Proje ve montaj.",
  },
  gates: {
    h1: "Kapı otomasyonu: motor tipleri ve seçim",
    title: "Kapı Otomasyonu — Motor Tipleri ve Seçimi | SAT",
    desc: "Kapı otomasyonu nasıl seçilir: yana kayar, çift kanatlı ve seksiyonel motorlar, ağırlık ve yoğunluğa göre hesap, zorunlu güvenlik ve kumanda biçimleri.",
  },
  attendance: {
    h1: "Taşkent'te personel devam takibi (PDKS)",
    title: "Taşkent'te Personel Devam Takip Sistemi | SAT",
    desc: "Taşkent'te personel devam takip sistemleri: biyometri ve kartlı geçiş, otomatik puantaj, 1C'ye aktarım. Özbekistan genelinde kurulum, ayarlama ve teknik destek.",
  },
  network: {
    h1: "Taşkent'te yapısal kablolama (SKS) montajı",
    title: "Taşkent'te Yapısal Kablolama Montajı | SAT",
    desc: "Taşkent'te yapısal kablolama ve yerel ağ kurulumu: projelendirme, kablo tesisatı, sunucu kabinetleri, switchler, hat testi. Dokümantasyon teslimi ve garanti.",
  },
  videowall: {
    h1: "Taşkent'te video duvar kurulumu — anahtar teslim",
    title: "Taşkent'te Video Duvar Kurulumu 2×2, 3×3 | SAT",
    desc: "Taşkent'te video duvar kurulumu: 2×2 ve 3×3 konfigürasyonlar, ince çerçeveli 46–55 inç paneller, kontrolcüler, askılar, ayar. Kontrol merkezleri anahtar teslim.",
  },
  wifi: {
    h1: "Taşkent'te Wi-Fi ağ kurulumu ve ayarları",
    title: "Taşkent'te Ofis için Wi-Fi Ağ Kurulumu | SAT",
    desc: "Taşkent'te Wi-Fi ağ projelendirme ve kurulumu: kesintisiz dolaşım, ofis, depo ve otel için erişim noktaları. Özbekistan genelinde montaj ve teknik destek hizmeti.",
  },
  radiobridge: {
    h1: "Taşkent'te radyolink ve kablosuz bağlantı",
    title: "Taşkent'te Radyolink — Kablosuz Bağlantı | SAT",
    desc: "Taşkent'te radyolink köprüleri: tesisler arasında noktadan noktaya ve noktadan çok noktaya bağlantı, güzergâh ve frekans hesabı, anten ayarı. Montaj ve garanti.",
  },
  smarthome: {
    h1: "Taşkent'te akıllı ev sistemleri kurulumu",
    title: "Taşkent'te Akıllı Ev Sistemi Kurulumu | SAT",
    desc: "Taşkent'te akıllı ev sistemleri: aydınlatma, iklim, perdeler, güvenlik kamerası ve senaryolar tek bir uygulamada. Özbekistan genelinde kurulum ve ayarlama hizmeti.",
  },
  anpr: {
    h1: "Taşkent'te plaka tanıma sistemleri (ANPR)",
    title: "Taşkent'te Plaka Tanıma (ANPR) Kurulumu | SAT",
    desc: "Taşkent'te plaka tanıma (ANPR) sistemleri: plakayla otomatik giriş, bariyerler, beyaz listeler, otopark ve geçiş kontrol entegrasyonu. Kurulum ve garanti.",
  },
  "intellektualnoe-upravlenie-parkingom": {
    h1: "Taşkent'te akıllı otopark yönetimi",
    title: "Taşkent'te Akıllı Otopark — Donanım ve Yazılım | SAT",
    desc: "Akıllı otopark donanımı: plaka tanıma, doluluk sensörleri ve boş yer panoları, ücretlendirme ve ödeme, mevcut sistemlerle entegrasyon. Taşkent ve bölgeler.",
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
    desc: "Üretim tesisleri için güvenlik: atölye ve çevre kameraları, geçiş kontrol ve mesai takibi, yangın alarm sistemi. Taşkent'te anahtar teslim proje ve montaj.",
  },
  warehouse: {
    h1: "Depo güvenlik kamerası sistemi ve koruması",
    title: "Taşkent'te depo için güvenlik kamerası sistemi | SAT",
    desc: "Depo ve lojistik merkezleri için güvenlik: kabul ve sevkiyat bölgelerinde kamera, personel ve araç için geçiş kontrol, kapıda ANPR. Taşkent'te montaj.",
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
    desc: "Konut kompleksleri için tam donanım: bahçe ve giriş kameraları, akıllı telefona çağrı veren IP interkom, girişte geçiş kontrol ve bariyer, plaka tanıma.",
  },
  school: {
    h1: "Okullar ve eğitim kurumları için güvenlik sistemleri",
    title: "Taşkent'te okul için kamera ve turnike sistemi | SAT",
    desc: "Okul, kolej ve üniversitelerde güvenlik: girişte turnike ve geçiş kontrol sistemi, bahçe ve koridor kameraları, veliye giriş bildirimi. Özbekistan'da anahtar teslim.",
  },
  parking: {
    h1: "AVM, konut ve iş merkezlerinde otopark düzeni — Taşkent",
    title: "AVM ve İş Merkezi Otoparkı — Taşkent | SAT",
    desc: "AVM, konut kompleksi veya ofis otoparkında düzen: kiracı ve sakinlere ayrılmış yerler, misafir geçişi, giriş denetimi ve doluluk raporları. Taşkent ve bölgeler.",
  },
  city: {
    h1: "«Güvenli Şehir» kent güvenlik kamerası sistemleri",
    title: "Güvenli Şehir — kent video gözetim projesi | SAT",
    desc: "Kent ölçekli güvenlik sistemleri: sokak kamerası ağı, yüz ve plaka tanıma, iletişim altyapısı ve video arşivi için veri merkezi, durum merkezi. Proje ve montaj.",
  },
  bus: {
    h1: "Toplu taşıma için kamera ve GPS izleme sistemleri",
    title: "Otobüste kamera — mobil sistemler ve GPS | SAT",
    desc: "Otobüs ve iş makineleri için mobil kamera sistemi: salon ve kabin kameraları, GPS izleme, yolcu sayımı, 4G ile merkeze canlı görüntü. Filolara anahtar teslim.",
  },
  construction: {
    h1: "Taşkent'te şantiye güvenlik kamerası ve koruması",
    title: "Taşkent'te şantiye kamerası — saha güvenliği | SAT",
    desc: "Şantiye koruması: 4G'li otonom kameralar, makine ve malzeme kontrolü, konteyner ve girişte geçiş kontrol, çevre alarmı, telefondan izleme. Hızlı montaj ve taşıma.",
  },
  medical: {
    h1: "Klinik ve hastaneler için güvenlik sistemleri",
    title: "Taşkent'te klinik için kamera ve geçiş kontrol | SAT",
    desc: "Sağlık kuruluşları için donanım: hol ve koridor kameraları, servis ve eczaneye geçiş kontrol, panik butonu, yangın alarm sistemi ve seslendirme. Taşkent geneli.",
  },
  hotel: {
    h1: "Taşkent'te oteller için güvenlik sistemleri",
    title: "Taşkent'te otel için kamera ve kapı kilitleri | SAT",
    desc: "Otel ve apart otel donanımı: kartla açılan oda kilitleri, ortak alan kameraları, servis alanlarında geçiş kontrol, yangın alarm sistemi. Montaj ve servis.",
  },
  fuel: {
    h1: "Akaryakıt istasyonları ve petrol depoları için güvenlik",
    title: "Taşkent'te akaryakıt istasyonu için kamera | SAT",
    desc: "Akaryakıt ve gaz istasyonları ile petrol depolarında güvenlik: pompa ve kasa kameraları, plaka tanıma, çevre koruması, yangın alarm sistemi. Taşkent geneli.",
  },
};

const zh: Record<string, ServiceSeo> = {
  "sistemnaya-integraciya": {
    h1: "塔什干系统集成——安防与 IT 合为一体",
    title: "塔什干系统集成商——安防、网络、服务器 | SAT",
    desc: "系统集成：监控、门禁、报警、网络与服务器合为一体。开放协议、1C 集成、H3C 服务器、统一值班台。免费审计，覆盖塔什干及各州。",
  },
  "obsluzhivanie": {
    h1: "塔什干消防报警与安防维保",
    title: "乌兹别克斯坦安防与消防维保合同 | SAT Solutions",
    desc: "塔什干维保合同：按规范定期检查消防报警，维护我方施工的监控与门禁系统，检查台账，所供设备质保，并可更换设备进行升级改造。",
  },
  "proektirovanie": {
    h1: "塔什干安防系统设计——消防、监控、门禁",
    title: "乌兹别克斯坦消防报警与安防系统设计 | SAT Solutions",
    desc: "按乌兹别克斯坦规范出具施工图：消防报警、视频监控、门禁、综合布线。平面图、清单、预算、报审配合、设计者监督。覆盖塔什干及各州。",
  },
  "slabotochnye-sistemy": {
    h1: "塔什干弱电系统——交钥匙安装",
    title: "塔什干弱电系统——设计与安装 | SAT Solutions",
    desc: "塔什干交钥匙弱电安装：视频监控、门禁、消防报警、综合布线、对讲。设计、施工、资料交付。承接建筑分包。提供保修。",
  },
  cctv: {
    h1: "塔什干视频监控系统 — 整套安装服务",
    title: "塔什干视频监控系统 — 摄像头安装 | SAT",
    desc: "在塔什干及乌兹别克斯坦全境提供视频监控整套解决方案：免费上门勘察、方案设计、IP 与模拟摄像头安装、手机远程查看设置，并提供长期质保与售后服务。",
  },
  analytics: {
    h1: "塔什干视频智能分析与人脸识别",
    title: "塔什干视频智能分析 — 人脸识别 | SAT",
    desc: "塔什干视频智能分析与 AI 应用：人脸与车牌识别、客流统计、热力图、事件检测告警。现场部署调试，提供质保与售后服务。",
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
  pa: {
    h1: "塔什干公共广播与应急疏散广播",
    title: "塔什干公共广播与应急广播系统 | SAT",
    desc: "塔什干公共广播与紧急广播系统：符合规范的应急疏散语音广播、背景音乐、分区播放、话筒控制台。方案设计、施工安装与质保。",
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
    h1: "塔什干公寓与住宅防盗报警安装",
    title: "塔什干公寓与住宅防盗报警系统 | SAT",
    desc: "面向公寓、独栋住宅与别墅的无线防盗报警：红外移动探测器、门磁开关、警号，报警推送到手机。免开槽布线，一天内完成安装。",
  },
  "ohrannye-sistemy": {
    h1: "面向企业与项目现场的安防报警系统",
    title: "塔什干企业安防报警系统工程 | SAT",
    desc: "面向办公室、仓库、门店与生产车间的安防报警系统：有线与混合防区、接入联网报警中心、与门禁及视频监控联动，配套处警流程。",
  },
  perimeter: {
    h1: "塔什干周界防范系统",
    title: "塔什干周界防范 — 红外对射与探测器 | SAT",
    desc: "塔什干周界防范工程：红外对射、振动光纤与微波探测器、热成像摄像机以及围墙视频智能分析。方案设计、施工安装与质保。",
  },
  gates: {
    h1: "大门自动化：开门机类型与选型指南",
    title: "大门开门机选型指南 — 类型与参数 | SAT",
    desc: "如何为大门选配开门机：平移门、平开门与提升门电机的区别，按门扇重量、长度和使用强度选型，必备的安全装置，以及遥控器、手机和门禁等控制方式说明。",
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
    title: "塔什干拼接屏安装 2×2、3×3 整套 | SAT",
    desc: "塔什干视频墙安装：2×2 与 3×3 拼接方案，46–55 英寸窄边拼接屏、控制器、支架及整体调试。为乌兹别克斯坦的监控中心与指挥中心提供整套交付。",
  },
  wifi: {
    h1: "塔什干 Wi-Fi 无线网络部署与调试",
    title: "塔什干 Wi-Fi 网络部署 — 办公无线 | SAT",
    desc: "塔什干 Wi-Fi 网络设计与调试：无缝漫游，面向办公室、仓库和酒店的无线接入点部署。乌兹别克斯坦全境提供安装施工与长期技术支持。",
  },
  radiobridge: {
    h1: "塔什干无线网桥与点对点链路",
    title: "塔什干无线网桥 — 点对点链路 | SAT",
    desc: "塔什干无线网桥工程：楼宇之间的点对点与点对多点无线链路，路径与频率规划、天线对准调试。施工安装并提供质保服务。",
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
  "intellektualnoe-upravlenie-parkingom": {
    h1: "塔什干智慧停车管理系统",
    title: "塔什干智慧停车 — 设备与系统 | SAT",
    desc: "智慧停车场设备：车牌识别、车位占用探测与空位显示屏、计时计费与在线支付，并可与既有系统对接。塔什干及乌兹别克斯坦全境施工。",
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
    desc: "为生产企业设计并安装安防系统：车间与周界视频监控、门禁系统与考勤管理、火灾报警系统、综合布线。分阶段施工，不停产完成安装，服务乌兹别克斯坦全境。",
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
    h1: "商场、住宅区与写字楼的停车场管理",
    title: "塔什干商场与写字楼停车场管理 | SAT",
    desc: "让商场、住宅小区或写字楼的停车场井然有序：为租户和业主预留车位、访客放行、出入管理与车位使用报表。塔什干及全境服务。",
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
