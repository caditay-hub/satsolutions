// Кастомные SEO-тайтлы/дескрипшены для приоритетных тип-страниц каталога.
// Написаны под реальные поисковые запросы (срез спроса из Ads 20.08.2026:
// mikrotik 1963, wifi router 951, шлагбаум 845, poe switch 845, огнетушитель 691,
// nvr 621, hdd 513, видеорегистратор 486, стабилизатор 464, ups 401, роутер 403,
// серверный шкаф 402, турникет 391, коммутатор 375). Фолбэк локалей: tr/zh → en.
// Остальные типы продолжают использовать общий шаблон из messages.

type LocText = { ru: string; uz: string; en: string; tr?: string; zh?: string };

export const TYPE_SEO: Record<string, { title: LocText; desc: LocText }> = {
  kommutatory: {
    title: {
      ru: "Купить коммутатор в Ташкенте — PoE и управляемые, цены",
      uz: "Kommutator (switch) narxlari Toshkentda — PoE switch sotib olish",
      en: "Network Switches in Tashkent — PoE & Managed, Prices",
    },
    desc: {
      ru: "Сетевые коммутаторы в наличии в Ташкенте: PoE-свитчи для камер, управляемые L2/L3, гигабитные и 10G. Hikvision, MikroTik, TP-Link, Ruijie, Wi-Tek. Цены, гарантия, доставка по Узбекистану.",
      uz: "Tarmoq kommutatorlari Toshkentda: kameralar uchun PoE switch, boshqariladigan L2/L3, gigabit va 10G. Hikvision, MikroTik, TP-Link. Narxlar, kafolat, O'zbekiston bo'ylab yetkazib berish.",
      en: "Network switches in stock in Tashkent: PoE for cameras, managed L2/L3, gigabit and 10G. Hikvision, MikroTik, TP-Link, Ruijie. Prices, warranty, delivery across Uzbekistan.",
    },
  },
  marshrutizatory: {
    title: {
      ru: "Купить роутер в Ташкенте — Wi-Fi и GPON маршрутизаторы",
      uz: "Router narxlari Toshkentda — Wi-Fi va GPON marshrutizatorlar",
      en: "Routers in Tashkent — Wi-Fi & GPON, MikroTik, Prices",
    },
    desc: {
      ru: "Маршрутизаторы в наличии: Wi-Fi роутеры для дома и офиса, GPON, MikroTik и Ruijie для бизнеса. Подбор, настройка, гарантия. Цены в Ташкенте, доставка по Узбекистану.",
      uz: "Marshrutizatorlar: uy va ofis uchun Wi-Fi routerlar, GPON, biznes uchun MikroTik va Ruijie. Tanlash, sozlash, kafolat. Toshkentda narxlar, O'zbekiston bo'ylab yetkazib berish.",
      en: "Routers in stock: Wi-Fi for home and office, GPON, MikroTik and Ruijie for business. Selection, setup, warranty. Tashkent prices, delivery across Uzbekistan.",
    },
  },
  "turnikety-i-shlagbaumy": {
    title: {
      ru: "Турникеты и шлагбаумы — купить с установкой в Ташкенте",
      uz: "Turniket va shlagbaum narxlari — o'rnatish bilan, Toshkent",
      en: "Turnstiles & Barrier Gates in Tashkent — Supply + Install",
    },
    desc: {
      ru: "Турникеты-триподы, распашные, полноростовые и автоматические шлагбаумы Hikvision, ZKTeco. Продажа с монтажом под ключ, интеграция со СКУД и Face ID. Цены, гарантия, сервис по Узбекистану.",
      uz: "Tripod turniketlar, avtomatik shlagbaumlar Hikvision, ZKTeco. O'rnatish bilan sotish, SKUD va Face ID integratsiyasi. Narxlar, kafolat, O'zbekiston bo'ylab servis.",
      en: "Tripod, swing and full-height turnstiles, automatic barrier gates by Hikvision and ZKTeco. Supply with turnkey installation, ACS and Face ID integration. Prices and service across Uzbekistan.",
    },
  },
  "pozharnaya-bezopasnost": {
    title: {
      ru: "Огнетушители и пожарное оборудование — купить в Ташкенте",
      uz: "O't o'chirgichlar va yong'in jihozlari — Toshkentda narxlari",
      en: "Fire Extinguishers & Fire Safety Equipment in Tashkent",
    },
    desc: {
      ru: "Огнетушители ОП/ОУ, пожарные шкафы, рукава и щиты в наличии в Ташкенте. Комплектация объектов под требования МЧС, монтаж пожарной сигнализации с лицензией. Цены, доставка по Узбекистану.",
      uz: "O't o'chirgichlar, yong'in shkaflari va jihozlari Toshkentda mavjud. Ob'ektlarni FVV talablariga muvofiq jihozlash, litsenziya bilan yong'in signalizatsiyasi montaji. Narxlar, yetkazib berish.",
      en: "Fire extinguishers, fire cabinets, hoses and boards in stock in Tashkent. Site outfitting to fire-safety regulations, licensed fire alarm installation. Prices, delivery across Uzbekistan.",
    },
  },
  "ibp-i-elektropitanie": {
    title: {
      ru: "Купить ИБП и стабилизатор напряжения в Ташкенте — цены",
      uz: "UPS va kuchlanish stabilizatori narxlari Toshkentda",
      en: "UPS & Voltage Stabilizers in Tashkent — Prices",
    },
    desc: {
      ru: "ИБП (UPS) для серверов, видеонаблюдения и офиса, стабилизаторы напряжения, аккумуляторы. Подбор по мощности, монтаж. Цены в Ташкенте, гарантия, доставка по Узбекистану.",
      uz: "Serverlar, videokuzatuv va ofis uchun UPS, kuchlanish stabilizatorlari, akkumulyatorlar. Quvvat bo'yicha tanlash, o'rnatish. Toshkentda narxlar, kafolat, yetkazib berish.",
      en: "UPS units for servers, CCTV and office, voltage stabilizers, batteries. Sizing assistance and installation. Tashkent prices, warranty, delivery across Uzbekistan.",
    },
  },
  "ip-videoregistratory-nvr": {
    title: {
      ru: "Купить видеорегистратор NVR в Ташкенте — Hikvision, цены",
      uz: "Videoregistrator NVR narxlari Toshkentda — Hikvision",
      en: "NVR Video Recorders in Tashkent — Hikvision, Prices",
    },
    desc: {
      ru: "IP-видеорегистраторы NVR на 4–64 канала: Hikvision, Dahua, HiLook. Подбор под количество камер, настройка, гарантия. Цены в Ташкенте, доставка по Узбекистану.",
      uz: "4–64 kanalli NVR videoregistratorlar: Hikvision, Dahua, HiLook. Kamera soniga qarab tanlash, sozlash, kafolat. Toshkentda narxlar, yetkazib berish.",
      en: "IP NVR recorders for 4–64 channels: Hikvision, Dahua, HiLook. Sizing to camera count, configuration, warranty. Tashkent prices, delivery across Uzbekistan.",
    },
  },
  "zhestkie-diski": {
    title: {
      ru: "Купить HDD для видеонаблюдения в Ташкенте — WD Purple",
      uz: "Videokuzatuv uchun HDD narxlari Toshkentda — WD Purple",
      en: "Surveillance HDD in Tashkent — WD Purple, Prices",
    },
    desc: {
      ru: "Жёсткие диски для видеорегистраторов и серверов: WD Purple, Seagate SkyHawk на 1–18 ТБ. Расчёт объёма архива под ваши камеры. Цены в Ташкенте, гарантия, доставка.",
      uz: "Videoregistrator va serverlar uchun qattiq disklar: WD Purple, Seagate SkyHawk 1–18 TB. Arxiv hajmini hisoblash. Toshkentda narxlar, kafolat, yetkazib berish.",
      en: "Hard drives for NVRs and servers: WD Purple, Seagate SkyHawk 1–18 TB. Archive capacity sizing for your cameras. Tashkent prices, warranty, delivery.",
    },
  },
  "telekommunikacionnye-shkafy": {
    title: {
      ru: "Купить серверный шкаф в Ташкенте — 19″ стойки, цены",
      uz: "Server shkafi narxlari Toshkentda — 19″ stoykalar",
      en: "Server Racks & Cabinets in Tashkent — 19″, Prices",
    },
    desc: {
      ru: "Телекоммуникационные и серверные шкафы 19″: настенные и напольные 4U–47U, стойки, аксессуары. Сборка и монтаж серверных под ключ. Цены в Ташкенте, доставка по Узбекистану.",
      uz: "19″ telekommunikatsiya va server shkaflari: devoriy va polga o'rnatiladigan 4U–47U, stoykalar. Server xonalarini yig'ish va montaj. Toshkentda narxlar, yetkazib berish.",
      en: "19″ telecom and server cabinets: wall-mount and floor-standing 4U–47U, racks, accessories. Turnkey server room assembly. Tashkent prices, delivery across Uzbekistan.",
    },
  },
  "wi-fi-tochki-dostupa": {
    title: {
      ru: "Купить Wi-Fi точку доступа в Ташкенте — UniFi, TP-Link",
      uz: "Wi-Fi ulanish nuqtasi narxlari Toshkentda — UniFi, TP-Link",
      en: "Wi-Fi Access Points in Tashkent — UniFi, TP-Link",
    },
    desc: {
      ru: "Wi-Fi точки доступа для офиса, склада и гостиницы: TP-Link Omada, Ruijie, Hikvision. Бесшовный роуминг, проектирование покрытия, монтаж. Цены в Ташкенте, гарантия.",
      uz: "Ofis, ombor va mehmonxona uchun Wi-Fi ulanish nuqtalari: TP-Link Omada, Ruijie. Uzluksiz rouming, qamrovni loyihalash, montaj. Toshkentda narxlar, kafolat.",
      en: "Wi-Fi access points for office, warehouse and hotel: TP-Link Omada, Ruijie, Hikvision. Seamless roaming, coverage design, installation. Tashkent prices, warranty.",
    },
  },
  "ip-kamery": {
    title: {
      ru: "Купить IP-камеру в Ташкенте — Hikvision, Dahua, цены",
      uz: "IP kamera narxlari Toshkentda — Hikvision, Dahua",
      en: "IP Cameras in Tashkent — Hikvision, Dahua, Prices",
    },
    desc: {
      ru: "IP-камеры видеонаблюдения 2–8 Мп: Hikvision, Dahua, HiLook, Avigilon. Уличные и внутренние, ColorVu и AcuSense. Подбор, монтаж под ключ. Цены в Ташкенте, гарантия, доставка.",
      uz: "2–8 Mp IP videokuzatuv kameralari: Hikvision, Dahua, HiLook. Tashqi va ichki, ColorVu va AcuSense. Tanlash, montaj. Toshkentda narxlar, kafolat, yetkazib berish.",
      en: "2–8 MP IP surveillance cameras: Hikvision, Dahua, HiLook, Avigilon. Outdoor and indoor, ColorVu and AcuSense. Selection and turnkey installation. Tashkent prices, warranty.",
    },
  },
};

export function typeSeoFor(slug: string, locale: string): { title: string; description: string } | null {
  const e = TYPE_SEO[slug];
  if (!e) return null;
  const pick = (t: LocText) =>
    locale === "uz" ? t.uz : locale === "en" ? t.en : locale === "tr" ? (t.tr ?? t.en) : locale === "zh" ? (t.zh ?? t.en) : t.ru;
  return { title: pick(e.title), description: pick(e.desc) };
}

// ── Контент-лендинги приоритетных тип-страниц (SEO-план 31.08.2026): интро,
// лонгрид и FAQ на 5 языках. Рендер: products/type/[slug] → CatalogView.typeLanding.
export type TypeLanding = { intro: string; long: string[]; faq: [string, string][] };
export const TYPE_LANDING: Record<string, Record<string, TypeLanding>> = {
  "telekommunikacionnye-shkafy": {
    ru: {
      intro: "Серверные и телекоммуникационные шкафы 19″: настенные 4–15U, напольные до 42U, стойки и аксессуары — со склада в Ташкенте.",
      long: ["Серверный шкаф выбирают от объёма оборудования в юнитах: коммутатор — 1U, патч-панель — 1U, регистратор — 1–2U, ИБП — 2U и больше. Сложите юниты и добавьте 30–40 % на развитие и вентиляционные зазоры. Для этажного узла и видеонаблюдения хватает настенного 6–12U; серверная комната начинается с напольного 22–42U глубиной 800–1000 мм — глубину диктуют серверы, а не коммутаторы.", "Смотрите на нагрузку и охлаждение: напольный шкаф должен держать сотни килограммов, а вентиляторные полки и щёточные вводы — обязательная гигиена, если внутри больше пары активных устройств. Стекло в двери красиво для офиса; перфорация правильнее для теплоотвода. К шкафу сразу считаются полки, органайзеры, блоки розеток и заземление.", "На складе — настенные и напольные шкафы KANIHAD и FINEN от 4U до 42U, полки, замки-ручки и кабельные органайзеры. Соберём шкаф под ваш проект: привезём, смонтируем, разложим кабель по органайзерам и подпишем порты."],
      faq: [["Какой шкаф нужен под видеонаблюдение на 16 камер?", "Настенный 6–9U: регистратор 2U, коммутатор PoE 1U, патч-панель 1U, ИБП 2U — и остаётся запас. Если ИБП напольный, хватит и 6U."], ["Чем серверный шкаф отличается от телекоммуникационного?", "Условность: «серверные» глубже (800–1000 мм) и рассчитаны на тяжёлые серверы, «телекоммуникационные» — 450–600 мм под коммутаторы и кроссы. Стандарт ширины один — 19 дюймов."], ["Настенный или напольный?", "До 12–15U и без серверов — настенный: дешевле и не занимает пол. Серверы, ИБП с батареями и рост парка — напольный от 22U."]],
    },
    uz: {
      intro: "19″ server va telekommunikatsiya shkaflari: devoriy 4–15U, polga o'rnatiladigan 42U gacha, stoykalar va aksessuarlar — Toshkentdagi ombordan.",
      long: ["Server shkafi uskunalar hajmidan (yunitlarda) tanlanadi: kommutator — 1U, patch-panel — 1U, registrator — 1–2U, UPS — 2U va undan ko'p. Yunitlarni qo'shing va rivojlanish hamda shamollatish uchun 30–40 % qo'shing. Qavat uzeli va videokuzatuvga devoriy 6–12U yetadi; server xonasi 800–1000 mm chuqurlikdagi polga o'rnatiladigan 22–42U dan boshlanadi.", "Yuk va sovutishga qarang: polga o'rnatiladigan shkaf yuzlab kilogrammni ko'tarishi kerak, ventilyator tokchalari va cho'tkali kirishlar — ichida bir nechta aktiv qurilma bo'lsa majburiy gigiena. Eshikdagi oyna ofis uchun chiroyli; issiqlik chiqarish uchun perforatsiya to'g'riroq.", "Omborda — KANIHAD va FINEN devoriy va polga o'rnatiladigan shkaflari 4U dan 42U gacha, tokchalar, qulf-ruchkalar va kabel organayzerlari. Shkafni loyihangizga yig'amiz: olib kelamiz, o'rnatamiz, kabelni organayzerlar bo'ylab joylashtiramiz."],
      faq: [["16 kamerali videokuzatuvga qanday shkaf kerak?", "Devoriy 6–9U: registrator 2U, PoE kommutator 1U, patch-panel 1U, UPS 2U — va zaxira qoladi."], ["Server shkafi telekommunikatsiya shkafidan nimasi bilan farq qiladi?", "Shartlilik: «serverlik» chuqurroq (800–1000 mm) va og'ir serverlarga mo'ljallangan, «telekommunikatsiya» — kommutator va krosslarga 450–600 mm. Kenglik standarti bitta — 19 dyuym."], ["Devoriymi yoki polga o'rnatiladiganmi?", "12–15U gacha va serverlarsiz — devoriy: arzonroq va pol egallamaydi. Serverlar va batareyali UPS — 22U dan polga o'rnatiladigan."]],
    },
    en: {
      intro: "19-inch server and telecom cabinets: wall-mount 4–15U, floor-standing up to 42U, racks and accessories — from Tashkent stock.",
      long: ["A server cabinet is sized by equipment units: a switch is 1U, a patch panel 1U, an NVR 1–2U, a UPS 2U and up. Add the units plus 30–40 % for growth and airflow. A floor node or CCTV setup fits a 6–12U wall cabinet; a server room starts with a floor-standing 22–42U at 800–1000 mm depth — servers dictate the depth, not switches.", "Watch load and cooling: a floor cabinet must carry hundreds of kilograms, and fan shelves plus brush cable entries are basic hygiene once more than a couple of active devices live inside. A glass door looks good in an office; perforation cools better. Shelves, organisers, PDU strips and earthing are counted with the cabinet from the start.", "In stock: KANIHAD and FINEN wall and floor cabinets from 4U to 42U, shelves, lock handles and cable organisers. We assemble the cabinet for your project: deliver, mount, dress the cables and label the ports."],
      faq: [["Which cabinet fits a 16-camera CCTV system?", "A 6–9U wall cabinet: a 2U NVR, a 1U PoE switch, a 1U patch panel, a 2U UPS — with headroom to spare."], ["Server vs telecom cabinet — what is the difference?", "Convention: server cabinets are deeper (800–1000 mm) for heavy servers; telecom ones are 450–600 mm for switches and cross-connects. The 19-inch width is the same."], ["Wall-mount or floor-standing?", "Up to 12–15U with no servers — wall-mount: cheaper and off the floor. Servers, battery UPSs and growth — floor-standing from 22U."]],
    },
    tr: {
      intro: "19 inç sunucu ve telekom kabinleri: duvar tipi 4–15U, dikili tip 42U'ya kadar, raflar ve aksesuarlar — Taşkent stoğundan.",
      long: ["Kabin, ekipmanın yunit hacmine göre seçilir: switch 1U, patch panel 1U, NVR 1–2U, UPS 2U ve üzeri. Yunitleri toplayın, büyüme ve hava akışı için %30–40 ekleyin. Kat düğümü ve kameralar için 6–12U duvar kabini yeter; sunucu odası 800–1000 mm derinlikte 22–42U dikili kabinle başlar.", "Yük ve soğutmaya bakın: dikili kabin yüzlerce kiloyu taşımalı; içinde birkaç aktif cihazdan fazlası varsa fan rafı ve fırçalı giriş temel hijyendir. Kapıda cam ofiste şık durur; delikli kapı ısıyı daha iyi atar. Raflar, organizerlar, priz blokları ve topraklama kabinle birlikte hesaplanır.", "Stokta 4U'dan 42U'ya KANIHAD ve FINEN duvar ve dikili kabinler, raflar, kilitli kollar ve kablo organizerları. Kabini projenize göre toplarız: getirir, monte eder, kabloları düzenler, portları etiketleriz."],
      faq: [["16 kameralı sistem için hangi kabin?", "6–9U duvar kabini: 2U NVR, 1U PoE switch, 1U patch panel, 2U UPS — payıyla birlikte."], ["Sunucu kabini ile telekom kabini farkı?", "Gelenek: sunucu kabinleri daha derindir (800–1000 mm); telekom kabinleri switch ve krosslar için 450–600 mm'dir. 19 inç genişlik ortaktır."], ["Duvar tipi mi dikili mi?", "12–15U'ya kadar ve sunucusuz — duvar tipi. Sunucular, akülü UPS ve büyüme — 22U'dan dikili."]],
    },
    zh: {
      intro: "19英寸服务器与网络机柜：壁挂式4–15U、落地式至42U，机架与配件——塔什干现货。",
      long: ["机柜按设备体积（U数）选择：交换机1U、配线架1U、录像机1–2U、UPS 2U起。把U数相加，再留30–40%用于扩容和散热。楼层节点和监控用6–12U壁挂柜即可；机房从22–42U落地柜起步，深度800–1000毫米——深度由服务器决定，而非交换机。", "注意承重与散热：落地柜要承数百公斤；柜内超过两三台有源设备时，风扇单元和毛刷进线口是基本卫生。玻璃门适合办公室好看；散热更好的是网孔门。层板、理线器、PDU电源和接地要与机柜一起配齐。", "现货供应KANIHAD和FINEN壁挂与落地机柜（4U–42U）、层板、锁把手和理线器。按项目整柜交付：送货、安装、理线并标注端口。"],
      faq: [["16路监控配多大机柜？", "6–9U壁挂柜：录像机2U、PoE交换机1U、配线架1U、UPS 2U——还有余量。"], ["服务器机柜与网络机柜的区别？", "习惯叫法：服务器柜更深（800–1000毫米）承重型服务器；网络柜450–600毫米放交换机和配线。19英寸宽度相同。"], ["壁挂还是落地？", "12–15U以内且无服务器——壁挂：更省钱不占地。有服务器、带电池UPS或要扩容——22U起落地。"]],
    },
  },
  "optika-i-aksessuary": {
    ru: {
      intro: "Оптоволокно и всё для ВОЛС: кабель, PLC-делители, кроссы, пигтейлы, быстрые коннекторы и инструмент — со склада в Ташкенте.",
      long: ["Оптоволокно передаёт данные светом: километры без потерь, полная нечувствительность к электромагнитным помехам и грозам — поэтому магистрали между зданиями и этажами давно делают оптикой, а GPON доводит её до квартир. Одномодовое волокно (жёлтое) — стандарт для расстояний и провайдерских сетей; многомод (оранжевый/бирюзовый) живёт внутри ЦОДов на коротких линках.", "Линия ВОЛС — это не только кабель: на концах стоят кроссы (ODF) с пигтейлами и адаптерами, в разветвлениях — PLC-делители (1×2…1×64 для GPON), соединения выполняются сваркой или быстрыми коннекторами. Разъёмы SC/UPC (синие) и SC/APC (зелёные) не взаимозаменяемы: APC со скошенным торцом обязателен в GPON.", "На складе — оптический кабель для улицы и помещений, PLC-делители всех номиналов, кроссы, пигтейлы, патч-корды, быстрые коннекторы и инструмент: скалыватели, страйпперы, VFL-тестеры. Варим оптику и сдаём трассы с рефлектометрией — по Ташкенту и всему Узбекистану."],
      faq: [["Чем одномод отличается от многомода?", "Одномод (9/125, жёлтый) тянет километры и стал стандартом даже для коротких линий; многомод (50/125) дешевле в паре с трансиверами, но ограничен сотнями метров — сегодня его берут в основном внутри серверных."], ["SC/UPC или SC/APC — какой разъём нужен?", "UPC (синий) — стандарт локальных сетей; APC (зелёный, со скосом 8°) обязателен в GPON и там, где важны минимальные обратные отражения. Смешивать их нельзя — стык даст потери."], ["Быстрый коннектор или сварка?", "Сварка надёжнее и даёт меньшие потери — стандарт для магистралей. Быстрые коннекторы выручают на абонентке и в ремонтах, где сварочника нет под рукой."]],
    },
    uz: {
      intro: "Optik tola va VOLS uchun hamma narsa: kabel, PLC-bo'luvchilar, krosslar, pigteyllar, tezkor konnektorlar va asboblar — Toshkentdagi ombordan.",
      long: ["Optik tola ma'lumotni yorug'lik bilan uzatadi: yo'qotishsiz kilometrlar, elektromagnit xalaqit va momaqaldiroqqa to'liq befarqlik — shuning uchun binolar orasidagi magistrallar allaqachon optikada, GPON esa uni kvartiralargacha yetkazadi. Bir modali tola (sariq) — masofalar va provayder tarmoqlari standarti; ko'p modali qisqa linklarda data-markazlar ichida yashaydi.", "VOLS liniyasi faqat kabel emas: uchlarida pigteyl va adapterli krosslar (ODF), tarmoqlanishlarda PLC-bo'luvchilar (GPON uchun 1×2…1×64), ulanishlar payvand yoki tezkor konnektorlar bilan bajariladi. SC/UPC (ko'k) va SC/APC (yashil) razyomlari almashtirilmaydi: qiya torets li APC GPON'da majburiy.", "Omborda — ko'cha va xona uchun optik kabel, barcha nominaldagi PLC-bo'luvchilar, krosslar, pigteyllar, patch-kordlar, tezkor konnektorlar va asboblar: skalyvatellar, stripperlar, VFL-testerlar. Optikani payvandlaymiz va trassalarni reflektometriya bilan topshiramiz."],
      faq: [["Bir modali ko'p modalidan nimasi bilan farq qiladi?", "Bir modali (9/125, sariq) kilometrlarni tortadi va qisqa liniyalar uchun ham standartga aylandi; ko'p modali transiverlar bilan arzonroq, lekin yuzlab metr bilan cheklangan."], ["SC/UPC yoki SC/APC — qaysi razyom kerak?", "UPC (ko'k) — lokal tarmoqlar standarti; APC (yashil, 8° qiya) GPON'da va minimal qaytish aks-sadosi muhim joylarda majburiy. Ularni aralashtirib bo'lmaydi."], ["Tezkor konnektor yoki payvand?", "Payvand ishonchliroq va kam yo'qotish beradi — magistrallar standarti. Tezkor konnektorlar abonent liniyasida va payvand apparati yo'q ta'mirlarda qutqaradi."]],
    },
    en: {
      intro: "Fibre optics and everything for FTTx: cable, PLC splitters, ODFs, pigtails, fast connectors and tools — from Tashkent stock.",
      long: ["Fibre carries data as light: kilometres without loss and full immunity to electromagnetic noise and lightning — which is why building-to-building backbones went optical long ago, and GPON brings fibre to apartments. Single-mode (yellow) is the standard for distance and carrier networks; multimode lives on short data-centre links.", "A fibre line is more than cable: ODF frames with pigtails and adapters terminate the ends, PLC splitters (1×2…1×64 for GPON) branch it, and joints are fused or made with fast connectors. SC/UPC (blue) and SC/APC (green) are not interchangeable: the angled APC is mandatory in GPON.", "In stock: outdoor and indoor fibre cable, PLC splitters of every ratio, ODFs, pigtails, patch cords, fast connectors and tools — cleavers, strippers, VFL testers. We splice and hand over routes with OTDR reports, across Tashkent and Uzbekistan."],
      faq: [["Single-mode vs multimode?", "Single-mode (9/125, yellow) runs kilometres and has become the default even for short links; multimode is cheaper with its transceivers but limited to hundreds of metres — today mostly inside server rooms."], ["SC/UPC or SC/APC?", "UPC (blue) is the LAN standard; APC (green, 8° angle) is mandatory in GPON and wherever back-reflection matters. Never mix them — the joint will lose signal."], ["Fast connector or fusion splice?", "Fusion is more reliable with lower loss — the backbone standard. Fast connectors save the day on subscriber drops and repairs without a splicer at hand."]],
    },
    tr: {
      intro: "Fiber optik ve FTTx için her şey: kablo, PLC splitterlar, ODF'ler, pigtailler, hızlı konnektörler ve aletler — Taşkent stoğundan.",
      long: ["Fiber veriyi ışıkla taşır: kayıpsız kilometreler, elektromanyetik gürültüye ve yıldırıma tam bağışıklık — bu yüzden binalar arası omurgalar çoktan optik, GPON ise fiberi dairelere getiriyor. Tek mod (sarı) mesafe ve operatör ağlarının standardı; çok mod kısa veri merkezi linklerinde yaşar.", "Fiber hattı yalnız kablo değildir: uçlarda pigtail ve adaptörlü ODF'ler, dallanmalarda PLC splitterlar (GPON için 1×2…1×64), ekler füzyonla veya hızlı konnektörle yapılır. SC/UPC (mavi) ile SC/APC (yeşil) birbirinin yerine geçmez: açılı APC, GPON'da zorunludur.", "Stokta dış ve iç ortam fiber kablo, her oranda PLC splitter, ODF, pigtail, patch cord, hızlı konnektör ve aletler: cleaver, stripper, VFL test cihazları. Fiberi ekler, hatları OTDR raporuyla teslim ederiz."],
      faq: [["Tek mod ile çok mod farkı?", "Tek mod (9/125, sarı) kilometreler taşır ve kısa linklerde bile varsayılan oldu; çok mod alıcı-vericileriyle daha ucuz ama yüzlerce metreyle sınırlı."], ["SC/UPC mi SC/APC mi?", "UPC (mavi) LAN standardı; APC (yeşil, 8° açılı) GPON'da ve geri yansımanın önemli olduğu yerlerde zorunlu. Karıştırmayın — ek kayıp verir."], ["Hızlı konnektör mü füzyon ek mi?", "Füzyon daha güvenilir ve düşük kayıplıdır — omurga standardı. Hızlı konnektörler abone hatlarında ve ek cihazsız onarımlarda kurtarır."]],
    },
    zh: {
      intro: "光纤与FTTx全套器材：光缆、PLC分光器、配线架、尾纤、快速连接器和工具——塔什干现货。",
      long: ["光纤以光传输数据：公里级零损耗，完全不受电磁干扰和雷击影响——因此楼宇间主干早已光纤化，GPON更把光纤送进住户。单模光纤（黄色）是长距离和运营商网络的标准；多模用于数据中心内的短链路。", "光纤线路不只是光缆：两端是带尾纤和适配器的配线架（ODF），分支处是PLC分光器（GPON用1×2…1×64），接续用熔接或快速连接器。SC/UPC（蓝）与SC/APC（绿）不可互换：斜面APC在GPON中是强制要求。", "现货供应室外/室内光缆、各分光比PLC、配线架、尾纤、跳线、快速连接器及工具：切割刀、剥线钳、红光笔。提供熔接施工，线路交付附OTDR测试报告——覆盖塔什干及全乌兹别克斯坦。"],
      faq: [["单模和多模有何区别？", "单模（9/125，黄色）可跑数公里，如今连短链路也默认用它；多模配收发器更便宜，但限于几百米——今天主要用在机房内部。"], ["选SC/UPC还是SC/APC？", "UPC（蓝）是局域网标准；APC（绿，8°斜面）在GPON及对回波敏感的场合强制使用。两者不可混接——接点会产生损耗。"], ["快速连接器还是熔接？", "熔接更可靠、损耗更低——主干标准。快速连接器适合入户线路和手边没有熔接机的抢修。"]],
    },
  },
  "marshrutizatory": {
    ru: {
      intro: "Wi-Fi и GPON роутеры, MikroTik для бизнеса — со склада в Ташкенте, с настройкой и гарантией.",
      long: ["Роутер для дома выбирается по трём вещам: стандарт Wi-Fi, площадь покрытия и тип подключения провайдера. Wi-Fi 6 сегодня — разумный минимум: он быстрее и стабильнее при десятке устройств в квартире. Если интернет заведён оптикой в квартиру, нужен GPON-роутер или связка «терминал провайдера + свой роутер»; для больших квартир и домов смотрите Mesh-системы — несколько модулей дают одну бесшовную сеть без мёртвых зон.", "Для офиса и бизнеса домашних моделей мало: нужны маршрутизаторы MikroTik и Ruijie — с VPN для филиалов, резервным каналом, гостевой сетью и шейпингом трафика. MikroTik hEX и hAP — рабочие лошадки малого офиса; для десятков сотрудников и телефонии берут CCR-серию. Настройка таких роутеров — отдельная работа, и мы делаем её при поставке: VPN, VLAN, резервирование канала.", "В каталоге — роутеры от домашних TP-Link и Tenda до MikroTik CCR: подберём под провайдера и задачу, настроим и дадим гарантию. Не уверены, что нужен именно роутер? Опишите объект — посчитаем сеть целиком: роутер, коммутаторы, точки доступа."],
      faq: [["Какой роутер купить для дома в 2026 году?", "Wi-Fi 6 роутер среднего класса закрывает квартиру до 80–100 м²; для большего метража или толстых стен — Mesh-система из двух-трёх модулей. При оптике в квартиру нужен GPON-совместимый вариант."], ["Чем MikroTik отличается от обычного роутера?", "Это профессиональная маршрутизация: VPN между филиалами, шейпинг, резервный канал, тонкая настройка. Дом обойдётся обычным роутером; офису и сети филиалов MikroTik экономит и деньги, и нервы."], ["Роутер и маршрутизатор — это одно и то же?", "Да, это синонимы. «Роутер» — калька с английского router, «маршрутизатор» — русский термин; устройство одно."]],
    },
    uz: {
      intro: "Wi-Fi va GPON routerlar, biznes uchun MikroTik — Toshkentdagi ombordan, sozlash va kafolat bilan.",
      long: ["Uy uchun router uch narsaga qarab tanlanadi: Wi-Fi standarti, qamrov maydoni va provayder ulanish turi. Wi-Fi 6 bugun oqilona minimum: kvartirada o'nlab qurilma bo'lganda tezroq va barqarorroq. Internet kvartiraga optika bilan kirgan bo'lsa, GPON-router yoki «provayder terminali + o'z routeringiz» bog'lami kerak; katta kvartira va uylar uchun Mesh-tizimlarga qarang — bir necha modul o'lik zonalarsiz yagona tarmoq beradi.", "Ofis va biznes uchun uy modellari yetmaydi: filiallar uchun VPN, zaxira kanal, mehmon tarmog'i va trafik shejpingi bilan MikroTik va Ruijie kerak. MikroTik hEX va hAP — kichik ofisning ish otlari; o'nlab xodim va telefoniya uchun CCR-seriya olinadi. Bunday routerlarni sozlash — alohida ish, biz uni yetkazib berishda qilamiz.", "Katalogda — uy uchun TP-Link va Tenda'dan MikroTik CCR'gacha: provayder va vazifaga moslab tanlaymiz, sozlaymiz va kafolat beramiz. Router kerakligiga ishonchingiz komil emasmi? Obyektni tasvirlab bering — tarmoqni butunlay hisoblaymiz."],
      faq: [["2026-yilda uy uchun qanday router olish kerak?", "O'rta sinf Wi-Fi 6 router 80–100 m² gacha kvartirani yopadi; kattaroq maydon yoki qalin devorlar uchun — ikki-uch modulli Mesh-tizim. Kvartiraga optika kirgan bo'lsa GPON-mos variant kerak."], ["MikroTik oddiy routerdan nimasi bilan farq qiladi?", "Bu professional marshrutlash: filiallar orasida VPN, shejping, zaxira kanal, nozik sozlash. Uyga oddiy router yetadi; ofis va filiallar tarmog'iga MikroTik pul ham, asabni ham tejaydi."], ["Router va marshrutizator bir xilmi?", "Ha, bular sinonimlar: qurilma bitta."]],
    },
    en: {
      intro: "Wi-Fi and GPON routers, MikroTik for business — from Tashkent stock, configured and under warranty.",
      long: ["A home router comes down to three things: the Wi-Fi standard, the coverage area and the ISP connection type. Wi-Fi 6 is the sensible minimum today — faster and steadier with a dozen devices online. With fibre into the apartment you need a GPON router or an ISP terminal plus your own router; for larger homes look at Mesh systems — several units make one seamless network without dead zones.", "Offices outgrow home models: MikroTik and Ruijie routers bring branch VPNs, a backup uplink, guest networks and traffic shaping. MikroTik hEX and hAP are the small-office workhorses; dozens of staff and telephony call for the CCR series. Configuring these is real work — we do it on delivery: VPN, VLANs, uplink failover.", "The catalogue spans home TP-Link and Tenda units to MikroTik CCR: we match the ISP and the task, configure and warrant. Not sure a router is what you need? Describe the site — we design the whole network: router, switches, access points."],
      faq: [["Which router should I buy for a home in 2026?", "A midrange Wi-Fi 6 router covers an 80–100 m² apartment; for more area or thick walls take a two-three unit Mesh system. With fibre to the apartment you need a GPON-compatible option."], ["How is MikroTik different from a regular router?", "It is professional routing: site-to-site VPN, shaping, uplink failover, fine-grained control. A home is fine with a regular router; an office network saves money and nerves on MikroTik."], ["Are router and gateway the same thing?", "In home use the ISP box usually combines both; strictly, the router routes between networks while a gateway may add modem functions."]],
    },
    tr: {
      intro: "Wi-Fi ve GPON routerlar, işletmeler için MikroTik — Taşkent stoğundan, kurulum ve garantiyle.",
      long: ["Ev routerı üç şeye bakar: Wi-Fi standardı, kapsama alanı ve sağlayıcı bağlantı tipi. Wi-Fi 6 bugün makul minimumdur — onlarca cihazla daha hızlı ve kararlı. Daireye fiber giriyorsa GPON router veya sağlayıcı terminali + kendi routerınız gerekir; büyük evlerde Mesh sistemlere bakın — birkaç modül ölü bölgesiz tek ağ verir.", "Ofisler ev modellerini aşar: şubeler arası VPN, yedek hat, misafir ağı ve trafik şekillendirme için MikroTik ve Ruijie gerekir. MikroTik hEX ve hAP küçük ofisin iş atlarıdır; onlarca personel ve telefon için CCR serisi alınır. Bunların kurulumu ayrı iştir — teslimatta biz yaparız: VPN, VLAN, hat yedekleme.", "Katalog ev tipi TP-Link ve Tenda'dan MikroTik CCR'a uzanır: sağlayıcı ve göreve göre seçer, kurar, garanti veririz. Router mu gerektiğinden emin değil misiniz? Sahayı anlatın — ağı bütün olarak tasarlarız."],
      faq: [["2026'da ev için hangi router alınır?", "Orta sınıf Wi-Fi 6 router 80–100 m²'lik daireyi karşılar; daha büyük alan veya kalın duvarlar için iki-üç modüllü Mesh. Daireye fiber giriyorsa GPON uyumlu seçenek gerekir."], ["MikroTik'in normal routerdan farkı ne?", "Profesyonel yönlendirme: şubeler arası VPN, şekillendirme, hat yedekleme, ince ayar. Eve normal router yeter; ofis ağı MikroTik'le hem para hem sinir kazanır."], ["Router ile modem aynı şey mi?", "Ev kullanımında sağlayıcı kutusu ikisini birleştirir; teknik olarak router ağlar arasında yönlendirir, modem hat sinyalini çevirir."]],
    },
    zh: {
      intro: "Wi-Fi与GPON路由器、企业级MikroTik——塔什干现货，含配置与保修。",
      long: ["家用路由器看三点：Wi-Fi标准、覆盖面积和运营商接入方式。Wi-Fi 6是如今的合理起点——十几台设备在线时更快更稳。光纤入户需要GPON路由器，或「运营商终端+自购路由器」组合；大户型和别墅考虑Mesh系统——多个模块组成无死角的统一网络。", "办公场景家用型号不够用：需要MikroTik和锐捷——分支VPN、备份线路、访客网络和流量整形。MikroTik hEX和hAP是小型办公室的主力；数十名员工加IP电话则选CCR系列。这类路由器的配置是专业活——我们随货完成：VPN、VLAN、线路容灾。", "目录覆盖从家用TP-Link、Tenda到MikroTik CCR：按运营商和需求选型、配置并保修。不确定是否需要路由器？描述一下场地——我们整体设计网络：路由器、交换机、接入点。"],
      faq: [["2026年家用买哪种路由器？", "中端Wi-Fi 6路由器覆盖80–100平方米公寓；面积更大或墙厚选两三个模块的Mesh。光纤入户需GPON兼容型号。"], ["MikroTik和普通路由器有何区别？", "专业级路由：分支间VPN、流量整形、线路容灾、精细控制。家用普通路由器足够；办公网络用MikroTik省钱又省心。"], ["路由器和光猫是一回事吗？", "家用运营商盒子常二合一；严格说路由器负责组网转发，光猫负责光电信号转换。"]],
    },
  },
  "pon-oborudovanie": {
    ru: {
      intro: "GPON-оборудование: терминалы ONU/ONT, OLT, роутеры с GPON-портом — для провайдеров и корпоративных сетей.",
      long: ["GPON — это оптика до самой квартиры или офиса: один волоконный ввод даёт гигабитный интернет без активного оборудования на трассе. Со стороны абонента ставится терминал ONU/ONT — отдельный или совмещённый с Wi-Fi роутером; со стороны провайдера — станционный OLT, обслуживающий десятки и сотни абонентов на одном волокне через сплиттеры.", "Корпоративный сценарий GPON недооценён: кампус, гостиница или бизнес-центр разводятся оптикой дешевле, чем медью, — без этажных коммутаторов и с запасом по скорости на годы. Пассивные сплиттеры не требуют питания и обслуживания, а один OLT заменяет стойку доступа.", "Поставляем GPON-роутеры и терминалы, OLT, SFP-модули, сплиттеры и весь пассив — кроссы, пигтейлы, патч-корды. Поможем со схемой сети, сварим оптику и сдадим трассу с измерениями рефлектометром."],
      faq: [["Чем GPON-роутер отличается от обычного?", "У него оптический GPON-порт вместо WAN-разъёма под витую пару: волокно провайдера подключается напрямую, без отдельного терминала. Если оптика уже заведена — это самый аккуратный вариант."], ["Что такое ONU и OLT?", "ONU/ONT — абонентский терминал в квартире или офисе; OLT — станционное устройство провайдера, к которому через пассивные сплиттеры подключаются десятки абонентов."], ["Подходит ли GPON для офисного здания?", "Да: кампусы и бизнес-центры разводят GPON вместо этажных коммутаторов — меньше активного оборудования, питания и точек отказа. Посчитаем схему под ваше здание."]],
    },
    uz: {
      intro: "GPON uskunalari: ONU/ONT terminallar, OLT, GPON-portli routerlar — provayderlar va korporativ tarmoqlar uchun.",
      long: ["GPON — optika to'g'ridan-to'g'ri kvartira yoki ofisgacha: bitta tolali kirish trassada aktiv uskunasiz gigabit internet beradi. Abonent tomonida ONU/ONT terminal o'rnatiladi — alohida yoki Wi-Fi router bilan birlashgan; provayder tomonida — splitterlar orqali bitta tolada o'nlab-yuzlab abonentga xizmat qiluvchi OLT.", "GPON'ning korporativ stsenariysi kam baholangan: kampus, mehmonxona yoki biznes-markaz optika bilan misdan arzonroq tarqatiladi — qavat kommutatorlarisiz va yillarga yetadigan tezlik zaxirasi bilan. Passiv splitterlar quvvat va xizmat talab qilmaydi.", "GPON-routerlar va terminallar, OLT, SFP-modullar, splitterlar va butun passivni yetkazamiz — krosslar, pigteyllar, patch-kordlar. Tarmoq sxemasida yordam beramiz, optikani payvandlaymiz va trassani reflektometr o'lchovlari bilan topshiramiz."],
      faq: [["GPON-router oddiysidan nimasi bilan farq qiladi?", "Unda vitaya para WAN o'rniga optik GPON-port bor: provayder tolasi alohida terminalsiz to'g'ridan-to'g'ri ulanadi."], ["ONU va OLT nima?", "ONU/ONT — kvartira yoki ofisdagi abonent terminali; OLT — provayderning stansiya qurilmasi, unga passiv splitterlar orqali o'nlab abonentlar ulanadi."], ["GPON ofis binosiga mosmi?", "Ha: kampus va biznes-markazlar qavat kommutatorlari o'rniga GPON tarqatadi — aktiv uskuna, quvvat va nosozlik nuqtalari kamroq."]],
    },
    en: {
      intro: "GPON equipment: ONU/ONT terminals, OLTs, routers with a GPON port — for ISPs and enterprise networks.",
      long: ["GPON brings fibre all the way to the apartment or office: one fibre drop delivers gigabit internet with no powered equipment along the route. On the subscriber side sits an ONU/ONT — standalone or combined with a Wi-Fi router; on the provider side an OLT serves tens to hundreds of subscribers over one fibre through passive splitters.", "The enterprise case for GPON is underrated: a campus, hotel or business centre wires cheaper on fibre than on copper — no floor switches, with speed headroom for years. Passive splitters need no power or maintenance, and one OLT replaces an access rack.", "We supply GPON routers and terminals, OLTs, SFP modules, splitters and all the passives — ODFs, pigtails, patch cords. We help with the network design, splice the fibre and hand over the route with OTDR measurements."],
      faq: [["How is a GPON router different from a regular one?", "It has an optical GPON port instead of a copper WAN jack: the provider's fibre plugs in directly, no separate terminal needed."], ["What are ONU and OLT?", "The ONU/ONT is the subscriber terminal in the apartment or office; the OLT is the provider-side unit serving dozens of subscribers through passive splitters."], ["Does GPON suit an office building?", "Yes: campuses and business centres wire GPON instead of floor switches — less active gear, power and failure points. We can design the scheme for your building."]],
    },
    tr: {
      intro: "GPON ekipmanları: ONU/ONT terminaller, OLT'ler, GPON portlu routerlar — sağlayıcılar ve kurumsal ağlar için.",
      long: ["GPON fiberi daireye veya ofise kadar getirir: tek fiber giriş, hat boyunca beslemeli cihaz olmadan gigabit internet verir. Abone tarafında ONU/ONT durur — bağımsız veya Wi-Fi routerla birleşik; sağlayıcı tarafında pasif splitterlarla tek fiberde onlarca-yüzlerce aboneye hizmet veren OLT bulunur.", "GPON'un kurumsal senaryosu hafife alınır: kampüs, otel veya iş merkezi fiberle bakırdan ucuza döşenir — kat switchleri olmadan ve yıllarca yetecek hız payıyla. Pasif splitterlar güç ve bakım istemez.", "GPON router ve terminaller, OLT, SFP modüller, splitterlar ve tüm pasifleri tedarik ederiz — ODF, pigtail, patch cord. Ağ şemasında yardım eder, fiberi ekler, hattı OTDR ölçümleriyle teslim ederiz."],
      faq: [["GPON routerın normalden farkı ne?", "Bakır WAN yerine optik GPON portu vardır: sağlayıcının fiberi ayrı terminal olmadan doğrudan takılır."], ["ONU ve OLT nedir?", "ONU/ONT abone tarafındaki terminaldir; OLT, pasif splitterlarla onlarca aboneye hizmet veren sağlayıcı cihazıdır."], ["GPON ofis binasına uyar mı?", "Evet: kampüs ve iş merkezleri kat switchleri yerine GPON döşer — daha az aktif cihaz, güç ve arıza noktası."]],
    },
    zh: {
      intro: "GPON设备：ONU/ONT终端、OLT、带GPON口的路由器——面向运营商和企业网络。",
      long: ["GPON把光纤一路铺到住户或办公室：一根光纤入户即可提供千兆互联网，线路上无需任何供电设备。用户侧放ONU/ONT终端——独立式或与Wi-Fi路由器一体；运营商侧是OLT，经无源分光器在一根光纤上服务数十到数百用户。", "GPON的企业场景被低估：园区、酒店或写字楼用光纤布线比铜缆更省——不需要楼层交换机，速度余量够用多年。无源分光器不用电、免维护，一台OLT顶得上一柜接入设备。", "我们供应GPON路由器和终端、OLT、SFP模块、分光器及全部无源器材——配线架、尾纤、跳线。协助设计网络方案、熔接光纤，并附OTDR测试报告交付线路。"],
      faq: [["GPON路由器和普通路由器有何区别？", "它用光纤GPON口代替铜缆WAN口：运营商光纤直接插入，无需单独光猫。"], ["ONU和OLT是什么？", "ONU/ONT是住户或办公室侧的用户终端；OLT是运营商局端设备，经无源分光器带几十个用户。"], ["GPON适合办公楼吗？", "适合：园区和写字楼用GPON替代楼层交换机——有源设备、供电和故障点都更少。可为您的楼宇设计方案。"]],
    },
  },
  "turnikety-i-shlagbaumy": {
    ru: {
      intro: "Турникеты, шлагбаумы и автоматика проезда — со склада в Ташкенте, с монтажом под ключ и интеграцией со СКУД.",
      long: ["Шлагбаум подбирается по трём параметрам: длина стрелы (проезд 3–6 метров), интенсивность (для двора хватает 50 % «включённости», для бизнес-центра нужен интенсивный привод) и способ управления — пульт, карта, вызов с телефона или распознавание номеров (ANPR). Камера ANPR избавляет от пультов: свои машины проезжают без остановки, гости — по звонку охраннику, а каждый проезд фиксируется с фото.", "Турникет выбирают по потоку людей и уровню контроля: трипод — стандарт проходной на 20–30 человек в минуту, распашная калитка — для инвалидов и грузов, полноростовой — там, где нельзя перепрыгнуть (стройки, стадионы, склады). Считыватели — карты, отпечаток, лицо; интеграция с учётом рабочего времени закрывает табель автоматически.", "Мы поставляем ZKTeco и Hikvision со склада в Ташкенте, монтируем под ключ (фундамент, петли индукции, автоматика), подключаем к СКУД и 1С и обслуживаем по всему Узбекистану. Цена комплекта «шлагбаум + ANPR» известна до начала работ — пришлите план въезда, вернём смету за день."],
      faq: [["Сколько стоит шлагбаум с установкой?", "Комплект «стрела 4–6 м + привод + монтаж» — от бюджетных ZKTeco до интенсивных Hikvision; точная цена зависит от длины проезда и автоматики. Выезд инженера и смета — бесплатно."], ["Можно ли открывать шлагбаум с телефона?", "Да: по звонку с разрешённого номера, из мобильного приложения или автоматически по номеру машины (ANPR)."], ["Какой турникет выбрать для проходной?", "Для офиса — трипод с картами или лицом; для завода — полноростовой; рядом ставится калитка для габаритных грузов и маломобильных посетителей."]],
    },
    uz: {
      intro: "Turniket va shlagbaumlar — Toshkentdagi ombordan, kalit topshirish sharti bilan o'rnatish va SKUD bilan integratsiya.",
      long: ["Shlagbaum uch parametr bo'yicha tanlanadi: strela uzunligi (3–6 metr), intensivlik va boshqaruv usuli — pult, karta, telefon yoki avtoraqamni tanish (ANPR). ANPR kamera pultlarsiz ishlaydi: o'z mashinalari to'xtamasdan o'tadi, mehmonlar qo'riqchi ruxsati bilan, har bir o'tish foto bilan qayd etiladi.", "Turniket odamlar oqimi va nazorat darajasiga qarab tanlanadi: tripod — daqiqasiga 20–30 kishilik o'tish joyi standarti, ochiladigan kalitka — nogironlar va yuklar uchun, to'liq bo'yli — hatlab o'tib bo'lmaydigan joylarda. O'quvchilar — karta, barmoq izi, yuz; ish vaqtini hisobga olish bilan integratsiya tabelni avtomatik yopadi.", "ZKTeco va Hikvision'ni Toshkentdagi ombordan yetkazamiz, kalit topshirish sharti bilan o'rnatamiz (poydevor, induksiya halqalari, avtomatika), SKUD va 1C ga ulaymiz, butun O'zbekiston bo'ylab servis qilamiz. «Shlagbaum + ANPR» narxi ishlar boshlanishidan oldin ma'lum — kirish rejasini yuboring, bir kunda smeta qaytaramiz."],
      faq: [["Shlagbaum o'rnatish bilan qancha turadi?", "«4–6 m strela + privod + montaj» to'plami — byudjetli ZKTeco'dan intensiv Hikvision'gacha; aniq narx o'tish uzunligi va avtomatikaga bog'liq. Muhandis chiqishi va smeta — bepul."], ["Shlagbaumni telefondan ochish mumkinmi?", "Ha: ruxsat etilgan raqamdan qo'ng'iroq, mobil ilova yoki mashina raqami bo'yicha avtomatik (ANPR)."], ["O'tish joyi uchun qaysi turniketni tanlash kerak?", "Ofis uchun — karta yoki yuz bilan tripod; zavod uchun — to'liq bo'yli; yonida yuklar va nogironlar uchun kalitka o'rnatiladi."]],
    },
    en: {
      intro: "Turnstiles, barrier gates and entry automation — in stock in Tashkent, with turnkey installation and access-control integration.",
      long: ["A barrier gate is chosen by three parameters: boom length (3–6 m openings), duty cycle, and the control method — remote, card, phone call or licence plate recognition (ANPR). An ANPR camera removes remotes entirely: registered cars pass without stopping, guests are let in by the guard, and every pass is logged with a photo.", "A turnstile is chosen by people flow and control level: a tripod is the standard for 20–30 people per minute, a swing gate serves wheelchairs and goods, and full-height units guard sites where climbing over is a risk. Readers take cards, fingerprints or faces; time-attendance integration fills the timesheet automatically.", "We supply ZKTeco and Hikvision from Tashkent stock, install turnkey (foundation, induction loops, automation), integrate with access control and 1C, and service across Uzbekistan. The price of a barrier-plus-ANPR kit is fixed before work starts — send the entrance plan and get an estimate within a day."],
      faq: [["How much does a barrier gate with installation cost?", "A boom 4–6 m plus drive and installation ranges from budget ZKTeco to heavy-duty Hikvision; the exact price depends on the opening and automation. The site visit and estimate are free."], ["Can a barrier be opened from a phone?", "Yes: by a call from an allowed number, from the mobile app, or automatically by plate recognition (ANPR)."], ["Which turnstile fits an office entrance?", "A tripod with cards or face recognition; factories take full-height units, with a gate beside for bulky goods and accessibility."]],
    },
    tr: {
      intro: "Turnikeler, bariyerler ve geçiş otomasyonu — Taşkent stoğundan, anahtar teslim kurulum ve geçiş kontrolü entegrasyonuyla.",
      long: ["Bariyer üç parametreye göre seçilir: kol uzunluğu (3–6 m), yoğunluk ve kontrol yöntemi — kumanda, kart, telefon veya plaka tanıma (ANPR). ANPR kamera kumandaları ortadan kaldırır: kayıtlı araçlar durmadan geçer, misafirleri güvenlik alır, her geçiş fotoğrafla kaydedilir.", "Turnike, insan akışına ve kontrol düzeyine göre seçilir: tripod dakikada 20–30 kişilik girişlerin standardıdır, kanatlı kapı engelli ve yükler içindir, tam boy turnike atlanamaması gereken sahaları korur. Okuyucular kart, parmak izi veya yüz alır; mesai entegrasyonu puantajı otomatik doldurur.", "ZKTeco ve Hikvision'ı Taşkent stoğundan tedarik eder, anahtar teslim kurar (temel, indüksiyon halkaları, otomasyon), geçiş kontrolü ve 1C ile entegre eder, tüm Özbekistan'da servis veririz. Bariyer+ANPR setinin fiyatı işe başlamadan bellidir — giriş planını gönderin, bir günde teklif alın."],
      faq: [["Kurulumla bariyer ne kadar?", "4–6 m kol + sürücü + montaj seti bütçe ZKTeco'dan yoğun kullanımlı Hikvision'a uzanır; kesin fiyat açıklık ve otomasyona bağlıdır. Keşif ve teklif ücretsizdir."], ["Bariyer telefondan açılabilir mi?", "Evet: izinli numaradan arama, mobil uygulama veya plaka tanımayla (ANPR) otomatik."], ["Ofis girişine hangi turnike uygun?", "Kartlı veya yüz tanımalı tripod; fabrikalara tam boy, yanına yükler için kanatlı kapı."]],
    },
    zh: {
      intro: "闸机、道闸与出入口自动化——塔什干现货，交钥匙安装，与门禁系统集成。",
      long: ["道闸按三个参数选择：栏杆长度（3–6米）、使用强度和控制方式——遥控、刷卡、电话或车牌识别（ANPR）。ANPR摄像机让遥控器成为多余：登记车辆不停车通行，访客由保安放行，每次通行都留有照片记录。", "闸机按人流量和管控级别选择：三辊闸是每分钟20–30人通道的标准，摆闸便于轮椅和货物通行，全高闸用于禁止翻越的场所。读卡器支持卡片、指纹或人脸；与考勤集成后自动生成考勤表。", "我们从塔什干仓库供应中控智慧（ZKTeco）和海康威视设备，交钥匙安装（基础、地感线圈、自动化），对接门禁和1C系统，服务覆盖全乌兹别克斯坦。道闸+车牌识别套装价格开工前即确定——发来入口平面图，一天内回复报价。"],
      faq: [["道闸带安装多少钱？", "4–6米栏杆+机芯+安装的套装，从经济型中控智慧到重载型海康威视不等；具体价格取决于通道宽度和自动化程度。勘查与报价免费。"], ["能用手机开道闸吗？", "能：授权号码来电、手机App，或车牌识别（ANPR）自动放行。"], ["办公楼入口选哪种闸机？", "刷卡或人脸的三辊闸；工厂选全高闸，旁边加摆闸供大件货物和无障碍通行。"]],
    },
  },
  "ip-videoregistratory-nvr": {
    ru: {
      intro: "IP-видеорегистраторы (NVR) на 4–128 каналов: Hikvision, Dahua, HiLook — со склада, с подбором под ваши камеры.",
      long: ["NVR — это видеорегистратор для IP-камер: он принимает потоки по сети, пишет архив и раздаёт удалённый просмотр. Не путайте с автомобильным видеорегистратором — здесь речь о системах видеонаблюдения. Главные параметры: число каналов (берите с запасом на 30 %), входящий битрейт, поддержка PoE (камеры питаются от регистратора одним кабелем) и максимальное разрешение — современные модели пишут 4K.", "Глубину архива определяет диск: 8 камер по 4 Мп на HDD 4 ТБ дают примерно две недели записи. Мы считаем архив под ваши камеры и требования (для многих объектов норматив — 30 суток), ставим диски WD Purple и Seagate SkyHawk, настраиваем детекцию движения — она удлиняет архив в разы.", "В каталоге — NVR Hikvision, Dahua и HiLook от 4 до 128 каналов, включая AcuSense-модели с фильтрацией ложных тревог. Подберём регистратор под существующие камеры, настроим просмотр с телефона и возьмём систему на обслуживание — по Ташкенту и всему Узбекистану."],
      faq: [["Чем NVR отличается от DVR?", "NVR работает с IP-камерами по сети, DVR — с аналоговыми по коаксиалу. Для новых объектов ставят NVR; DVR берут при модернизации старой проводки."], ["Сколько камер потянет регистратор?", "Смотрите на число каналов и входящий битрейт: 8-канальный NVR с 80 Мбит/с примет восемь камер по 4 Мп. Берите каналы с запасом под расширение."], ["Какой диск нужен для 30 дней архива?", "Для 8 камер 4 Мп — порядка 8 ТБ при постоянной записи; с детекцией движения хватает вдвое меньшего. Точный расчёт сделаем под ваш объект бесплатно."]],
    },
    uz: {
      intro: "IP videoregistratorlar (NVR) 4–128 kanal: Hikvision, Dahua, HiLook — ombordan, kameralaringizga moslab tanlash bilan.",
      long: ["NVR — IP-kameralar uchun videoregistrator: tarmoq orqali oqimlarni qabul qiladi, arxiv yozadi va masofaviy ko'rishni beradi. Avtomobil registratori bilan adashtirmang — bu videokuzatuv tizimlari. Asosiy parametrlar: kanallar soni (30 % zaxira bilan oling), kiruvchi bitreyt, PoE (kameralar bitta kabel bilan quvvat oladi) va maksimal ruxsat — zamonaviy modellar 4K yozadi.", "Arxiv chuqurligini disk belgilaydi: 4 Mp li 8 kamera 4 TB diskda taxminan ikki hafta yozuv beradi. Arxivni kameralaringiz va talablarga qarab hisoblaymiz (ko'p obyektlar uchun me'yor — 30 kun), WD Purple va Seagate SkyHawk disklarini o'rnatamiz, harakat detektsiyasini sozlaymiz — u arxivni bir necha barobar uzaytiradi.", "Katalogda — 4 dan 128 kanalgacha Hikvision, Dahua va HiLook NVR'lari, jumladan yolg'on trevogalarni filtrlash bilan AcuSense modellari. Registratorni mavjud kameralarga moslab tanlaymiz, telefondan ko'rishni sozlaymiz va tizimni xizmatga olamiz — Toshkent va butun O'zbekiston bo'ylab."],
      faq: [["NVR DVR'dan nimasi bilan farq qiladi?", "NVR IP-kameralar bilan tarmoq orqali, DVR analog kameralar bilan koaksial orqali ishlaydi. Yangi obyektlarga NVR o'rnatiladi."], ["Registrator nechta kamerani ko'taradi?", "Kanallar soni va kiruvchi bitreytga qarang: 80 Mbit/s li 8 kanalli NVR 4 Mp li sakkizta kamerani qabul qiladi. Kengaytirish uchun zaxira bilan oling."], ["30 kunlik arxiv uchun qanday disk kerak?", "4 Mp li 8 kamera uchun doimiy yozuvda 8 TB atrofida; harakat detektsiyasi bilan ikki barobar kam yetadi. Aniq hisobni bepul qilamiz."]],
    },
    en: {
      intro: "IP video recorders (NVR) for 4–128 channels: Hikvision, Dahua, HiLook — in stock, matched to your cameras.",
      long: ["An NVR is the recorder for IP cameras: it takes streams over the network, keeps the archive and serves remote viewing. Key parameters: channel count (take 30 % headroom), incoming bitrate, PoE support (cameras are powered by the recorder over one cable) and maximum resolution — current models record 4K.", "Retention is set by the disk: eight 4 MP cameras on a 4 TB HDD keep roughly two weeks. We size the archive to your cameras and requirements (30 days is a common norm), fit WD Purple or Seagate SkyHawk drives and tune motion detection, which stretches the archive severalfold.", "The catalogue holds Hikvision, Dahua and HiLook NVRs from 4 to 128 channels, including AcuSense models that filter false alarms. We match a recorder to existing cameras, set up mobile viewing and maintain the system across Uzbekistan."],
      faq: [["How is an NVR different from a DVR?", "An NVR works with IP cameras over the network; a DVR takes analogue cameras over coax. New sites get an NVR; DVRs suit legacy cabling."], ["How many cameras can a recorder take?", "Check channels and incoming bitrate: an 8-channel NVR with 80 Mbit/s takes eight 4 MP cameras. Keep spare channels for growth."], ["What disk gives 30 days of archive?", "Around 8 TB for eight 4 MP cameras on continuous recording; motion detection halves it. We calculate it for your site free of charge."]],
    },
    tr: {
      intro: "4–128 kanal IP kayıt cihazları (NVR): Hikvision, Dahua, HiLook — stoktan, kameralarınıza göre seçim.",
      long: ["NVR, IP kameraların kayıt cihazıdır: akışları ağdan alır, arşivi tutar ve uzaktan izleme sunar. Ana parametreler: kanal sayısı (%30 pay bırakın), gelen bit hızı, PoE desteği (kameralar tek kabloyla beslenir) ve maksimum çözünürlük — güncel modeller 4K kaydeder.", "Arşiv süresini disk belirler: 4 TB diskte sekiz 4 MP kamera yaklaşık iki hafta tutar. Arşivi kameralarınıza ve gereksinimlere göre boyutlandırır (yaygın norm 30 gündür), WD Purple veya Seagate SkyHawk takar, hareket algılamayı ayarlarız — arşivi kat kat uzatır.", "Katalogda 4'ten 128 kanala Hikvision, Dahua ve HiLook NVR'ları, yanlış alarmları süzen AcuSense modelleri dahil. Mevcut kameralara uygun cihazı seçer, mobil izlemeyi kurar ve tüm Özbekistan'da bakımını üstleniriz."],
      faq: [["NVR ile DVR farkı nedir?", "NVR ağ üzerinden IP kameralarla, DVR koaksiyel üzerinden analog kameralarla çalışır. Yeni sahalara NVR kurulur."], ["Bir kayıt cihazı kaç kamera alır?", "Kanal sayısına ve gelen bit hızına bakın: 80 Mbit/s'lik 8 kanallı NVR sekiz 4 MP kamera alır. Büyüme için kanal payı bırakın."], ["30 günlük arşiv için hangi disk?", "Sekiz 4 MP kamera için sürekli kayıtta yaklaşık 8 TB; hareket algılamayla yarısı yeter. Sahanıza göre ücretsiz hesaplarız."]],
    },
    zh: {
      intro: "4–128路IP网络录像机（NVR）：海康威视、大华、HiLook——现货供应，按摄像机配置选型。",
      long: ["NVR是IP摄像机的录像机：通过网络接收视频流、存储录像并提供远程回放。关键参数：通道数（预留30%余量）、接入带宽、PoE供电（一根网线为摄像机供电）和最大分辨率——现款机型支持4K录制。", "存储时长由硬盘决定：8路4MP摄像机在4TB硬盘上约存两周。我们按摄像机数量和要求（常见规范为30天）计算容量，配WD Purple或希捷SkyHawk监控盘，并调校移动侦测——可将存储时长成倍延长。", "目录内有海康威视、大华和HiLook的4至128路NVR，含过滤误报的AcuSense机型。我们按现有摄像机选配录像机、配置手机远程查看，并在全乌兹别克斯坦提供维保。"],
      faq: [["NVR和DVR有什么区别？", "NVR通过网络接IP摄像机，DVR通过同轴线接模拟摄像机。新项目用NVR，旧线路改造才用DVR。"], ["一台录像机能接几路摄像机？", "看通道数和接入带宽：80 Mbit/s的8路NVR可接8台4MP摄像机。建议预留通道便于扩容。"], ["存30天录像需要多大硬盘？", "8路4MP连续录像约需8TB；开移动侦测可省一半。我们免费为您的项目精确计算。"]],
    },
  },
  "kommutatory": {
    ru: {
      intro: "Сетевые коммутаторы (свитчи) — PoE для камер, управляемые L2/L3, 10G для серверных: Hikvision, MikroTik, TP-Link, Ruijie, H3C.",
      long: ["Коммутатор (свитч) соединяет устройства в локальную сеть. Для видеонаблюдения главный вопрос — PoE: свитч питает камеры по тому же кабелю, что передаёт данные; следите за общим бюджетом мощности (у 8-портового обычно 60–120 Вт) и запасом под камеры с подогревом. Для офиса важнее управляемость: VLAN, приоритизация трафика, мониторинг портов.", "Уровень L2 хватает этажу и небольшому офису; L3-коммутаторы маршрутизируют между подсетями и ставятся в ядро сети предприятия. Для серверных и видеоархивов берите аплинки 10G — SFP+ порты уже стандарт даже в средних моделях. Стекируемые модели позволяют наращивать сеть без замены ядра.", "На складе в Ташкенте — от 4-портовых PoE для пары камер до магистральных H3C и Ruijie: подберём под задачу, преднастроим VLAN и отдадим с гарантией. Для проектов — партнёрские цены H3C и помощь с проектированием сети."],
      faq: [["Какой PoE-коммутатор нужен для 8 камер?", "8 портов PoE с бюджетом от 90 Вт: обычной камере хватает 6–8 Вт, поворотной PTZ — до 25 Вт. Плюс два порта аплинка для регистратора и сети."], ["Чем управляемый свитч отличается от неуправляемого?", "Управляемый умеет VLAN, приоритизацию, зеркалирование портов и мониторинг — обязателен для офисных сетей и крупных систем видеонаблюдения. Неуправляемый — просто «разветвитель» для простых задач."], ["L2 или L3 — что выбрать?", "L2 — доступ (этаж, кабинет), L3 — ядро с маршрутизацией между отделами. В малом офисе достаточно L2 с гигабитным аплинком."]],
    },
    uz: {
      intro: "Tarmoq kommutatorlari (switch) — kameralar uchun PoE, boshqariladigan L2/L3, server xonalari uchun 10G: Hikvision, MikroTik, TP-Link, Ruijie, H3C.",
      long: ["Kommutator (switch) qurilmalarni lokal tarmoqqa ulaydi. Videokuzatuv uchun asosiy savol — PoE: switch kameralarni ma'lumot uzatadigan kabel orqali quvvatlaydi; umumiy quvvat byudjetiga (8 portlida odatda 60–120 Vt) va isitiladigan kameralar zaxirasiga e'tibor bering. Ofis uchun boshqaruv muhimroq: VLAN, trafik prioriteti, portlar monitoringi.", "L2 daraja qavat va kichik ofisga yetadi; L3 kommutatorlar quyi tarmoqlar orasida marshrutlaydi va korxona tarmog'i yadrosiga o'rnatiladi. Server xonalari uchun 10G aplinklar oling — SFP+ portlar o'rta modellarda ham standart.", "Toshkentdagi omborda — bir juft kamera uchun 4 portli PoE'dan magistral H3C va Ruijie'gacha: vazifaga moslab tanlaymiz, VLAN'ni oldindan sozlaymiz va kafolat bilan beramiz. Loyihalar uchun — H3C hamkorlik narxlari va tarmoqni loyihalashda yordam."],
      faq: [["8 kamera uchun qanday PoE kommutator kerak?", "90 Vt dan byudjetli 8 ta PoE port: oddiy kameraga 6–8 Vt, PTZ ga 25 Vt gacha yetadi. Registrator va tarmoq uchun yana ikkita aplink port."], ["Boshqariladigan switch oddiysidan nimasi bilan farq qiladi?", "Boshqariladigani VLAN, prioritet, port monitoringini biladi — ofis tarmoqlari va yirik videokuzatuv uchun majburiy."], ["L2 yoki L3 — qaysi birini tanlash?", "L2 — kirish darajasi (qavat, xona), L3 — bo'limlar orasida marshrutlash bilan yadro. Kichik ofisga gigabit aplinkli L2 yetadi."]],
    },
    en: {
      intro: "Network switches — PoE for cameras, managed L2/L3, 10G for server rooms: Hikvision, MikroTik, TP-Link, Ruijie, H3C.",
      long: ["A switch joins devices into a LAN. For CCTV the key question is PoE: the switch powers cameras over the data cable; watch the total power budget (60–120 W on a typical 8-port) and keep headroom for heated cameras. For offices manageability matters more: VLANs, traffic priority, port monitoring.", "L2 covers a floor or a small office; L3 switches route between subnets and sit at the enterprise core. For server rooms and video archives take 10G uplinks — SFP+ ports are standard even midrange. Stackable models grow the network without replacing the core.", "Tashkent stock ranges from 4-port PoE units to H3C and Ruijie backbone switches: we match the task, preconfigure VLANs and ship with warranty. For projects — H3C partner pricing and network design help."],
      faq: [["Which PoE switch suits 8 cameras?", "8 PoE ports with a 90 W+ budget: a regular camera takes 6–8 W, a PTZ up to 25 W. Plus two uplink ports for the NVR and the LAN."], ["Managed vs unmanaged — what is the difference?", "A managed switch does VLANs, QoS, port mirroring and monitoring — essential for office networks and large CCTV. Unmanaged is a plain splitter for simple jobs."], ["L2 or L3?", "L2 for access (a floor, a room), L3 for the core with inter-VLAN routing. A small office is fine with L2 and a gigabit uplink."]],
    },
    tr: {
      intro: "Ağ switchleri — kameralar için PoE, yönetilebilir L2/L3, sunucu odaları için 10G: Hikvision, MikroTik, TP-Link, Ruijie, H3C.",
      long: ["Switch, cihazları yerel ağa bağlar. Kamera sistemlerinde kilit soru PoE'dir: switch, kameraları veri kablosundan besler; toplam güç bütçesine (8 portluda 60–120 W) ve ısıtmalı kameralar için paya dikkat edin. Ofiste yönetilebilirlik öndedir: VLAN, trafik önceliği, port izleme.", "L2 bir katı veya küçük ofisi karşılar; L3 switchler alt ağlar arasında yönlendirir ve kurumsal çekirdeğe konur. Sunucu odaları için 10G uplink alın — SFP+ portlar orta sınıfta bile standarttır.", "Taşkent stoğunda 4 portlu PoE'den H3C ve Ruijie omurga switchlerine kadar seçenek var: göreve göre seçer, VLAN'ları önceden kurar, garantiyle teslim ederiz. Projelere H3C partner fiyatları ve ağ tasarım desteği."],
      faq: [["8 kamera için hangi PoE switch?", "90 W+ bütçeli 8 PoE port: normal kamera 6–8 W, PTZ 25 W'a kadar çeker. NVR ve ağ için iki uplink portu da gerekir."], ["Yönetilebilir switch farkı nedir?", "VLAN, QoS, port aynalama ve izleme yapar — ofis ağları ve büyük kamera sistemleri için şarttır."], ["L2 mi L3 mü?", "Erişim için L2 (kat, oda), yönlendirmeli çekirdek için L3. Küçük ofise gigabit uplinkli L2 yeter."]],
    },
    zh: {
      intro: "网络交换机——摄像机PoE供电、可管理L2/L3、机房10G：海康威视、MikroTik、TP-Link、锐捷、新华三。",
      long: ["交换机把设备连成局域网。监控系统的关键是PoE：交换机通过数据线为摄像机供电；注意总功率预算（8口机型通常60–120W），并为加热型摄像机留余量。办公网络更看重可管理性：VLAN、流量优先级、端口监控。", "L2覆盖楼层或小型办公室；L3交换机在子网间路由，用于企业网络核心。机房和视频存储选10G上联——SFP+端口在中端机型已是标配。可堆叠机型无需更换核心即可扩容。", "塔什干仓库备货从4口PoE到新华三、锐捷骨干交换机：按需求选型、预配VLAN、含保修交付。项目享新华三合作伙伴价格及网络设计支持。"],
      faq: [["8台摄像机配哪种PoE交换机？", "8个PoE口、功率预算90W以上：普通摄像机6–8W，球机最高25W。另需两个上联口接录像机和网络。"], ["可管理与非管理交换机的区别？", "可管理型支持VLAN、QoS、端口镜像和监控——办公网络和大型监控必备；非管理型只是简单分线。"], ["选L2还是L3？", "接入层用L2（楼层、房间），核心层用L3做子网间路由。小型办公室配千兆上联的L2即可。"]],
    },
  },
  "ibp-i-elektropitanie": {
    ru: {
      intro: "ИБП (UPS, упс) и стабилизаторы напряжения для серверных, видеонаблюдения и офиса — подбор по мощности, монтаж и обслуживание.",
      long: ["Стабилизатор напряжения защищает технику от скачков сети, ИБП добавляет автономность при отключении света. Для видеонаблюдения и серверов правильный порядок такой: стабилизатор выравнивает входное напряжение, ИБП держит систему во время пропадания — камеры продолжают писать, а сервер корректно завершает работу.", "Подбор считается по суммарной мощности нагрузки плюс 25–30 % запаса: 8 камер с регистратором укладываются в 300–500 ВА, серверная стойка требует уже киловатты и внешние батарейные модули под нужное время автономии. Для распределённых объектов ставим локальные ИБП у каждого узла — дешевле и надёжнее одного центрального.", "Поставляем ИБП и стабилизаторы под задачу — от розеточных моделей до стоечных с батарейными полками, со склада и под заказ. Рассчитаем мощность и время автономии бесплатно, смонтируем и возьмём на сервис с регулярной проверкой батарей — именно они умирают первыми."],
      faq: [["Как выбрать мощность ИБП?", "Сложите мощность нагрузки и добавьте 25–30 % запаса. Для 8 камер с NVR достаточно 300–500 ВА; серверная стойка считается отдельно с батарейными модулями под нужные минуты автономии."], ["Нужен ли стабилизатор, если есть ИБП?", "В сетях с постоянными скачками — да: стабилизатор принимает удары на себя, а ИБП работает только при пропадании питания и живёт заметно дольше."], ["Сколько живут батареи ИБП?", "Обычно 3–5 лет. Мы проверяем их в рамках сервиса и меняем до того, как ИБП подведёт при первом же отключении."]],
    },
    uz: {
      intro: "Server, videokuzatuv va ofis uchun UPS va kuchlanish stabilizatorlari — quvvat bo'yicha tanlash, montaj va servis.",
      long: ["Stabilizator texnikani tarmoq sakrashlaridan himoya qiladi, UPS esa svet o'chganda avtonomlik beradi. Videokuzatuv va serverlar uchun to'g'ri tartib: stabilizator kirish kuchlanishini tekislaydi, UPS o'chish paytida tizimni ushlab turadi — kameralar yozishda davom etadi, server to'g'ri o'chadi.", "Tanlash yuklama umumiy quvvati plyus 25–30 % zaxira bo'yicha hisoblanadi: registratorli 8 kamera 300–500 VA ga sig'adi, server stoykasi kilovattlar va kerakli avtonomiya vaqtiga batareya modullarini talab qiladi.", "UPS va stabilizatorlarni vazifaga moslab yetkazamiz — rozetka modellaridan batareya tokchali stoyka modellarigacha, ombordan va buyurtma asosida. Quvvat va avtonomiya vaqtini bepul hisoblaymiz, o'rnatamiz va batareyalarni muntazam tekshirish bilan servisga olamiz."],
      faq: [["UPS quvvatini qanday tanlash kerak?", "Yuklama quvvatini qo'shing va 25–30 % zaxira qo'shing. NVR li 8 kamera uchun 300–500 VA yetadi; server stoykasi alohida hisoblanadi."], ["UPS bo'lsa stabilizator kerakmi?", "Doimiy sakrashli tarmoqlarda — ha: zarbalarni stabilizator oladi, UPS faqat svet o'chganda ishlaydi va ancha uzoq xizmat qiladi."], ["UPS batareyalari qancha yashaydi?", "Odatda 3–5 yil. Servis doirasida tekshiramiz va birinchi o'chishda pand bermasidan oldin almashtiramiz."]],
    },
    en: {
      intro: "UPS units and voltage stabilizers for server rooms, CCTV and offices — sized to load, installed and serviced.",
      long: ["A stabilizer protects equipment from mains surges; a UPS adds runtime through outages. For CCTV and servers the right order is: the stabilizer levels the input, the UPS carries the system through a blackout — cameras keep recording and servers shut down cleanly.", "Sizing is total load plus 25–30 % headroom: eight cameras with an NVR fit in 300–500 VA, a server rack needs kilowatts and external battery packs for the required runtime. On distributed sites we place local UPS units at each node — cheaper and more reliable than one central unit.", "We supply UPSs and stabilizers to the task — from desktop units to rack models with battery shelves, from stock and to order. Sizing and runtime calculation are free; we install and service the fleet, testing the batteries that always fail first."],
      faq: [["How do I size a UPS?", "Add up the load and 25–30 % headroom. Eight cameras with an NVR fit 300–500 VA; a server rack is sized separately with battery modules for the minutes you need."], ["Do I need a stabilizer if I have a UPS?", "In surge-prone grids, yes: the stabilizer takes the hits, the UPS only carries outages and lasts much longer."], ["How long do UPS batteries live?", "Typically 3–5 years. We test them under the service contract and replace them before the first real outage exposes them."]],
    },
    tr: {
      intro: "Sunucu odaları, kamera sistemleri ve ofisler için UPS ve voltaj regülatörleri — yüke göre seçim, kurulum ve servis.",
      long: ["Regülatör ekipmanı şebeke dalgalanmalarından korur; UPS kesintide çalışma süresi ekler. Kameralar ve sunucular için doğru sıra: regülatör girişi düzler, UPS kesintiyi taşır — kameralar kayda devam eder, sunucular düzgün kapanır.", "Boyutlandırma toplam yük artı %25–30 paydır: NVR'lı sekiz kamera 300–500 VA'ya sığar; sunucu kabini kilovatlar ve istenen süre için harici akü modülleri ister. Dağıtık sahalarda her düğüme yerel UPS koyarız — tek merkezden daha ucuz ve güvenilir.", "Masaüstü modellerden akü raflı kabin tiplerine kadar UPS ve regülatör tedarik ederiz — stoktan ve siparişle. Güç ve süre hesabı ücretsiz; kurar, servis eder ve önce ölen aküleri düzenli test ederiz."],
      faq: [["UPS gücü nasıl seçilir?", "Yükü toplayıp %25–30 pay ekleyin. NVR'lı sekiz kameraya 300–500 VA yeter; sunucu kabini akü modülleriyle ayrıca hesaplanır."], ["UPS varken regülatör gerekir mi?", "Dalgalanmalı şebekelerde evet: darbeleri regülatör alır, UPS yalnız kesintide çalışır ve çok daha uzun ömürlü olur."], ["UPS aküleri ne kadar dayanır?", "Genelde 3–5 yıl. Servis kapsamında test eder, ilk kesintide yüzüstü bırakmadan değiştiririz."]],
    },
    zh: {
      intro: "机房、监控和办公用UPS与稳压器——按负载选型，安装并维保。",
      long: ["稳压器保护设备免受电网波动，UPS在停电时提供续航。监控和服务器的正确接法：稳压器整平输入电压，UPS撑过断电——摄像机持续录像，服务器正常关机。", "选型按总负载加25–30%余量：8台摄像机加录像机在300–500VA以内；服务器机柜需要千瓦级功率和外接电池组以满足续航要求。分布式项目在每个节点放本地UPS——比单台中心机更省更可靠。", "从桌面型到带电池架的机架型，现货加订货供应UPS和稳压器。功率与续航免费核算；负责安装和维保，定期检测最先老化的电池。"],
      faq: [["UPS功率怎么选？", "负载相加再加25–30%余量。8台摄像机加NVR选300–500VA；服务器机柜按所需续航分钟数配电池模块单独计算。"], ["有UPS还需要稳压器吗？", "电压波动频繁的电网需要：稳压器扛冲击，UPS只在断电时工作，寿命明显更长。"], ["UPS电池能用多久？", "一般3–5年。维保时定期检测，在第一次真正断电前提前更换。"]],
    },
  },
  "pozharnaya-bezopasnost": {
    ru: {
      intro: "Огнетушители ОП и ОУ, пожарные шкафы, рукава и знаки — комплектация объектов под требования МЧС, со склада в Ташкенте.",
      long: ["Огнетушитель подбирается по классу пожара и площади: порошковые ОП универсальны и закрывают классы A, B, C и электроустановки — это стандарт для офисов, магазинов и складов; углекислотные ОУ не оставляют следов и ставятся у серверных и электрощитовых. Ходовые номиналы — ОП-4/ОП-5 для помещений и ОП-25…ОП-100 на производство и АЗС.", "Комплектация объекта — это не только огнетушители: нужны пожарные шкафы с рукавами и вентилями, знаки эвакуации, планы и журнал учёта. Нормы задают количество и размещение от площади и категории помещений — мы считаем комплект под ваш объект так, чтобы проверка МЧС прошла без замечаний.", "На складе — огнетушители РИФ от ОП-4 до ОП-100, рукава, вентили и знаки; для организаций — счёт с НДС и доставка по Узбекистану. Плюс перезарядка по регламенту и монтаж пожарной сигнализации с лицензией — объект закрывается под ключ одной командой."],
      faq: [["Какой огнетушитель нужен в офис?", "Порошковый ОП-4 или ОП-5 из расчёта не менее одного на 50–100 м²; возле серверной и электрощитов добавьте углекислотный ОУ."], ["Чем ОП отличается от ОУ?", "Порошковый (ОП) универсален, но оставляет порошок на технике; углекислотный (ОУ) тушит электронику без следов, зато дороже и тяжелее."], ["Как часто перезаряжать огнетушители?", "Порошковые — раз в 5 лет, углекислотные — по контролю массы ежегодно; после любого срабатывания — сразу. Ведём график перезарядки за вас."]],
    },
    uz: {
      intro: "OP va OU o't o'chirgichlar, yong'in shkaflari, shlanglar va belgilar — obyektlarni FVV talablariga moslab jihozlash, Toshkentdagi ombordan.",
      long: ["O't o'chirgich yong'in sinfi va maydonga qarab tanlanadi: kukunli OP universaldir va A, B, C sinflari hamda elektr qurilmalarini yopadi — ofis, do'kon va omborlar standarti; karbonat angidridli OU iz qoldirmaydi va server hamda elektr shchitlari yoniga qo'yiladi. Yurgan nominallar — xonalar uchun OP-4/OP-5, ishlab chiqarish uchun OP-25…OP-100.", "Obyektni jihozlash — bu faqat o't o'chirgichlar emas: shlang va ventilli yong'in shkaflari, evakuatsiya belgilari, rejalar va hisob jurnali kerak. Me'yorlar soni va joylashuvini maydon va toifadan belgilaydi — biz to'plamni FVV tekshiruvi e'tirozsiz o'tadigan qilib hisoblaymiz.", "Omborda — OP-4 dan OP-100 gacha RIF o't o'chirgichlari, shlanglar, ventillar va belgilar; tashkilotlar uchun QQS li hisob va O'zbekiston bo'ylab yetkazish. Reglament bo'yicha qayta zaryadlash va litsenziya bilan yong'in signalizatsiyasi montaji ham bizda."],
      faq: [["Ofisga qanday o't o'chirgich kerak?", "Har 50–100 m² ga kamida bitta kukunli OP-4 yoki OP-5; server va elektr shchitlari yoniga karbonat angidridli OU qo'shing."], ["OP OU dan nimasi bilan farq qiladi?", "Kukunli (OP) universal, lekin texnikada kukun qoldiradi; karbonat angidridli (OU) elektronikani izsiz o'chiradi, ammo qimmatroq."], ["O't o'chirgichlar qanchada qayta zaryadlanadi?", "Kukunlilar — 5 yilda bir, karbonat angidridlilar — har yili massa nazorati bo'yicha; har qanday ishlatishdan keyin — darhol."]],
    },
    en: {
      intro: "Powder and CO2 extinguishers, fire cabinets, hoses and signage — site outfitting to fire-code requirements, from Tashkent stock.",
      long: ["An extinguisher is chosen by fire class and area: powder units are universal for classes A, B, C and live electrics — the standard for offices, shops and warehouses; CO2 units leave no residue and belong near server rooms and switchboards. Common sizes are 4–5 kg for rooms and 25–100 kg wheeled units for industry.", "Outfitting a site is more than extinguishers: fire cabinets with hoses and valves, evacuation signage, plans and a logbook. The codes set quantity and placement by area and occupancy — we calculate the set so the fire inspection passes without remarks.", "In stock: RIF extinguishers from 4 to 100 kg, hoses, valves and signs; VAT invoicing for organisations and delivery across Uzbekistan. Plus scheduled recharging and licensed fire-alarm installation — one contractor closes the whole site."],
      faq: [["Which extinguisher does an office need?", "A 4–5 kg powder unit per 50–100 m² at minimum; add a CO2 unit near the server room and switchboards."], ["Powder vs CO2 — what is the difference?", "Powder is universal but leaves residue on equipment; CO2 puts out electronics cleanly but costs and weighs more."], ["How often are extinguishers recharged?", "Powder every 5 years, CO2 by annual weight check; after any use — immediately. We keep the recharge schedule for you."]],
    },
    tr: {
      intro: "Tozlu ve CO2 söndürücüler, yangın dolapları, hortum ve levhalar — tesisleri yönetmeliğe göre donatma, Taşkent stoğundan.",
      long: ["Söndürücü, yangın sınıfı ve alana göre seçilir: tozlu tipler A, B, C ve elektrik için evrenseldir — ofis, mağaza ve depoların standardı; CO2 iz bırakmaz, sunucu odası ve panoların yanına konur. Yaygın boylar odalar için 4–5 kg, sanayi için 25–100 kg'dır.", "Tesisi donatmak yalnız söndürücü değildir: hortum ve vanalı yangın dolapları, tahliye levhaları, planlar ve kayıt defteri gerekir. Yönetmelik adet ve yerleşimi alana göre belirler — seti, denetim sorunsuz geçecek şekilde hesaplarız.", "Stokta 4–100 kg RIF söndürücüler, hortum, vana ve levhalar; kurumlara KDV'li fatura ve tüm Özbekistan'a teslimat. Periyodik dolum ve lisanslı yangın alarmı kurulumuyla tesis tek elden kapanır."],
      faq: [["Ofise hangi söndürücü gerekir?", "Her 50–100 m² için en az bir 4–5 kg tozlu tip; sunucu odası ve panoların yanına CO2 ekleyin."], ["Tozlu ile CO2 farkı nedir?", "Tozlu evrenseldir ama cihazlarda kalıntı bırakır; CO2 elektroniği temiz söndürür, daha pahalı ve ağırdır."], ["Söndürücüler ne sıklıkla dolum ister?", "Tozlular 5 yılda bir, CO2 yıllık tartıyla; her kullanımdan sonra hemen. Dolum takvimini biz tutarız."]],
    },
    zh: {
      intro: "干粉与二氧化碳灭火器、消防箱、水带和标识——按消防要求为场所配齐，塔什干现货。",
      long: ["灭火器按火灾类别和面积选择：干粉型通用，覆盖A、B、C类及带电设备——办公室、商店和仓库的标准配置；二氧化碳型不留残迹，放在机房和配电箱旁。常用规格：室内4–5公斤，工业场所25–100公斤推车式。", "场所配置不止灭火器：还需带水带阀门的消防箱、疏散标识、平面图和台账。规范按面积和场所类别规定数量与位置——我们按您的场所计算配置，确保消防检查零整改。", "现货供应RIF灭火器（4–100公斤）、水带、阀门和标识；单位客户开增值税发票，全乌兹别克斯坦配送。另提供按规程再充装和持证消防报警安装——一支队伍交钥匙搞定。"],
      faq: [["办公室需要哪种灭火器？", "每50–100平方米至少一具4–5公斤干粉灭火器；机房和配电箱旁加配二氧化碳型。"], ["干粉和二氧化碳有何区别？", "干粉通用但会在设备上留粉；二氧化碳干净扑灭电子设备火灾，但更贵更重。"], ["灭火器多久充装一次？", "干粉每5年一次，二氧化碳每年称重检查；任何使用后立即充装。充装台账我们代管。"]],
    },
  },
  "wi-fi-tochki-dostupa": {
    ru: {
      intro: "Wi-Fi точки доступа для офиса, склада и гостиницы — TP-Link Omada, Ruijie, MikroTik: бесшовный роуминг и проектирование покрытия.",
      long: ["Точка доступа отличается от домашнего роутера тем, что строит управляемую сеть: десятки точек работают как одна система с единым контроллером, а телефон переключается между ними без обрыва звонка — это и есть бесшовный роуминг. Для офиса берут потолочные модели Wi-Fi 6, для склада и улицы — защищённые корпуса с направленными антеннами.", "Главная ошибка при самостоятельной установке — ставить точки «где розетка есть»: получаются мёртвые зоны и интерференция. Мы проектируем покрытие по плану помещения — считаем зоны, каналы и мощность, а питание подаём по PoE от коммутатора, так что розетки у точки не нужны вовсе.", "В каталоге — TP-Link Omada, Ruijie и MikroTik со склада в Ташкенте: от одной точки в кабинет до сети на гостиницу или завод с контроллером, гостевым порталом и авторизацией. Монтаж, настройка роуминга и обслуживание — по всему Узбекистану."],
      faq: [["Сколько точек доступа нужно на офис?", "Ориентир — одна точка на 80–120 м² открытого пространства; бетонные стены и переговорки уменьшают радиус. Точное число даёт расчёт покрытия по плану — делаем его бесплатно."], ["Что такое бесшовный роуминг?", "Телефон или ноутбук переходит между точками без разрыва соединения: звонок в мессенджере не прерывается, когда вы идёте по офису. Требует точек одной системы и правильной настройки."], ["Чем точка доступа лучше роутера?", "Роутер рассчитан на одну квартиру. Точки доступа масштабируются: единое имя сети, центральное управление, PoE-питание и десятки точек под одним контроллером."]],
    },
    uz: {
      intro: "Ofis, ombor va mehmonxona uchun Wi-Fi ulanish nuqtalari — TP-Link Omada, Ruijie, MikroTik: uzluksiz rouming va qamrovni loyihalash.",
      long: ["Ulanish nuqtasi uy routeridan boshqariladigan tarmoq qurishi bilan farq qiladi: o'nlab nuqtalar yagona kontroller ostida bitta tizim bo'lib ishlaydi, telefon esa ular orasida qo'ng'iroqni uzmasdan o'tadi — bu uzluksiz rouming. Ofis uchun shiftga o'rnatiladigan Wi-Fi 6 modellari, ombor va ko'cha uchun himoyalangan korpuslar olinadi.", "Mustaqil o'rnatishda asosiy xato — nuqtalarni «rozetka bor joyga» qo'yish: o'lik zonalar va interferensiya paydo bo'ladi. Biz qamrovni xona rejasi bo'yicha loyihalaymiz — zonalar, kanallar va quvvatni hisoblaymiz, quvvatni esa kommutatordan PoE orqali beramiz.", "Katalogda — Toshkentdagi ombordan TP-Link Omada, Ruijie va MikroTik: kabinetga bitta nuqtadan kontroller, mehmon portali va avtorizatsiyali mehmonxona yoki zavod tarmog'igacha. Montaj, rouming sozlash va servis — butun O'zbekiston bo'ylab."],
      faq: [["Ofisga nechta ulanish nuqtasi kerak?", "Mo'ljal — ochiq maydonning har 80–120 m² iga bitta nuqta; beton devorlar radiusni kamaytiradi. Aniq sonni reja bo'yicha qamrov hisobi beradi — buni bepul qilamiz."], ["Uzluksiz rouming nima?", "Telefon nuqtalar orasida ulanishni uzmasdan o'tadi: ofis bo'ylab yurganingizda messenjer qo'ng'irog'i uzilmaydi."], ["Ulanish nuqtasi routerdan nimasi bilan yaxshi?", "Router bitta kvartiraga mo'ljallangan. Nuqtalar masshtablanadi: yagona tarmoq nomi, markaziy boshqaruv, PoE quvvat va bitta kontroller ostida o'nlab nuqtalar."]],
    },
    en: {
      intro: "Wi-Fi access points for offices, warehouses and hotels — TP-Link Omada, Ruijie, MikroTik: seamless roaming and coverage design.",
      long: ["An access point differs from a home router by building a managed network: dozens of APs run as one system under a controller, and a phone hops between them without dropping a call — that is seamless roaming. Offices take ceiling Wi-Fi 6 models; warehouses and outdoors need rated enclosures and directional antennas.", "The classic DIY mistake is mounting APs wherever a socket happens to be: dead zones and interference follow. We design coverage from the floor plan — zones, channels and power — and feed the APs over PoE from the switch, so no sockets are needed at all.", "The catalogue holds TP-Link Omada, Ruijie and MikroTik from Tashkent stock: from a single AP for a room to a hotel- or factory-scale network with a controller, guest portal and authorisation. Installation, roaming tuning and service across Uzbekistan."],
      faq: [["How many APs does an office need?", "Roughly one per 80–120 m² of open space; concrete walls shrink the radius. The exact count comes from a coverage plan — we draw it free."], ["What is seamless roaming?", "A phone or laptop moves between APs without dropping the connection: a messenger call survives a walk across the office."], ["Why an AP instead of a router?", "A router serves one apartment. APs scale: one SSID, central management, PoE power and dozens of units under one controller."]],
    },
    tr: {
      intro: "Ofis, depo ve oteller için Wi-Fi erişim noktaları — TP-Link Omada, Ruijie, MikroTik: kesintisiz dolaşım ve kapsama tasarımı.",
      long: ["Erişim noktası, ev routerından yönetilen bir ağ kurmasıyla ayrılır: onlarca nokta tek kontrolcü altında tek sistem gibi çalışır, telefon aralarında görüşmeyi düşürmeden geçer — kesintisiz dolaşım budur. Ofise tavan tipi Wi-Fi 6, depo ve dış mekâna korumalı gövdeler alınır.", "Kendin-yap kurulumun klasik hatası noktaları «priz neredeyse oraya» asmaktır: ölü bölgeler ve girişim doğar. Kapsamayı kat planından tasarlarız — bölgeler, kanallar, güç — beslemeyi switchten PoE ile veririz; prize gerek kalmaz.", "Katalogda Taşkent stoğundan TP-Link Omada, Ruijie ve MikroTik: tek odalık noktadan kontrolcülü, misafir portallı otel veya fabrika ağına kadar. Kurulum, dolaşım ayarı ve tüm Özbekistan'da servis."],
      faq: [["Ofise kaç erişim noktası gerekir?", "Açık alanda 80–120 m²'ye bir nokta; beton duvarlar yarıçapı küçültür. Kesin sayıyı plandan çıkan kapsama hesabı verir — ücretsiz yaparız."], ["Kesintisiz dolaşım nedir?", "Telefon noktalar arasında bağlantıyı düşürmeden geçer: ofiste yürürken görüşme kopmaz."], ["Router yerine neden erişim noktası?", "Router tek daire içindir. Noktalar ölçeklenir: tek SSID, merkezi yönetim, PoE besleme, tek kontrolcüde onlarca nokta."]],
    },
    zh: {
      intro: "办公、仓库和酒店用Wi-Fi接入点——TP-Link Omada、锐捷、MikroTik：无缝漫游与覆盖设计。",
      long: ["接入点与家用路由器的区别在于组建可管理网络：数十个AP在控制器下协同为一个系统，手机在其间切换而通话不断——这就是无缝漫游。办公室用吸顶式Wi-Fi 6机型，仓库和室外用防护外壳与定向天线。", "自装的经典错误是「哪有插座装哪」：结果是死角和干扰。我们按平面图设计覆盖——分区、信道、功率——并由交换机PoE供电，AP处完全不需要插座。", "目录内有塔什干现货的TP-Link Omada、锐捷和MikroTik：从单间一个AP到带控制器、访客门户和认证的酒店级、厂区级网络。安装、漫游调优与维保覆盖全乌兹别克斯坦。"],
      faq: [["办公室需要几个接入点？", "开阔空间约每80–120平方米一个；混凝土墙会缩小半径。精确数量由平面图覆盖测算得出——我们免费出图。"], ["什么是无缝漫游？", "手机或电脑在AP间切换而连接不断：在办公室边走边聊，通话不掉线。"], ["为什么用AP而不是路由器？", "路由器面向单套住宅。AP可扩展：统一网络名、集中管理、PoE供电，一个控制器带几十个点。"]],
    },
  },
};

export function typeLandingFor(slug: string, locale: string): TypeLanding | null {
  const e = TYPE_LANDING[slug];
  if (!e) return null;
  return e[locale] ?? e.en ?? e.ru ?? null;
}
