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
