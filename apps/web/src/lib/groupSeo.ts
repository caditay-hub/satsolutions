/* Гео-коммерческий SEO-оверлей страниц групп каталога /products/group/<slug>.
   Причина: головные товарные запросы («камеры видеонаблюдения ташкент», «скуд»,
   «домофон») Google трактует как shopping-интент — в топе каталоги с ценами,
   а не страницы услуг. Hub-страницы групп — наш канонический ответ на эти
   запросы; здесь их title/H1/интро затачиваются под головной кейворд + гео.
   Группа без записи → фолбэк на generic «<Группа> — купить в Ташкенте». */

export type GroupSeo = {
  /** <title> (≤ ~60 символов, головной кейворд первым) */
  title: string;
  /** meta description */
  desc: string;
  /** видимый H1 hub-страницы */
  h1: string;
  /** интро-абзац под H1 (1-2 предложения, SSR-текст) */
  intro: string;
  /** ссылка на профильную услугу (интент-мост «купить ↔ установить») */
  serviceHref: string;
  /** анкор ссылки на услугу */
  serviceLabel: string;
  /** развёрнутый текст под каталогом: как выбрать и что считать кроме самих товаров.
      Появился 19.08.2026: по данным Ads страница группы держала «посадочная ниже
      среднего» по головным запросам («камеры видеонаблюдения» — 607 показов),
      живя на одном интро-предложении. Нет поля — блок не рендерится. */
  long?: string;
};

type LocaleMap = Record<string, Record<string, GroupSeo>>;

/** Анкоры групповых страниц для обратной ссылки услуга → каталог группы. */
export const SERVICE_TO_GROUP: Record<string, { href: string; label: Record<string, string> }> = {
  cctv: {
    href: "/products/group/videonablyudenie",
    label: {
      ru: "Камеры видеонаблюдения в Ташкенте — каталог с ценами",
      uz: "Toshkentda videokuzatuv kameralari — narxlar bilan katalog",
      en: "CCTV cameras in Tashkent — catalogue with prices",
      tr: "Taşkent'te güvenlik kameraları — fiyatlı katalog",
      zh: "塔什干监控摄像机——含价格目录",
    },
  },
  access: {
    href: "/products/group/kontrol-dostupa",
    label: {
      ru: "Оборудование СКУД — каталог с ценами",
      uz: "SKUD uskunalari — narxlar bilan katalog",
      en: "Access control equipment — catalogue with prices",
      tr: "Geçiş kontrol ekipmanları — fiyatlı katalog",
      zh: "门禁设备——含价格目录",
    },
  },
  barrier: {
    href: "/products/group/kontrol-dostupa",
    label: {
      ru: "Шлагбаумы и оборудование въезда — каталог с ценами",
      uz: "Shlagbaumlar va kirish uskunalari — narxlar bilan katalog",
      en: "Barrier gates and entry equipment — catalogue with prices",
      tr: "Bariyerler ve giriş ekipmanları — fiyatlı katalog",
      zh: "道闸与出入口设备——含价格目录",
    },
  },
  turnstile: {
    href: "/products/group/kontrol-dostupa",
    label: {
      ru: "Турникеты и СКУД — каталог с ценами",
      uz: "Turniketlar va SKUD — narxlar bilan katalog",
      en: "Turnstiles and access control — catalogue with prices",
      tr: "Turnikeler ve geçiş kontrolü — fiyatlı katalog",
      zh: "闸机与门禁——含价格目录",
    },
  },
  fire: {
    href: "/products/group/ohranno-pozharnaya",
    label: {
      ru: "Пожарная сигнализация — каталог оборудования",
      uz: "Yong'in signalizatsiyasi — uskunalar katalogi",
      en: "Fire alarm equipment — catalogue",
      tr: "Yangın alarm ekipmanları — katalog",
      zh: "火灾报警设备目录",
    },
  },
  alarm: {
    href: "/products/group/ohranno-pozharnaya",
    label: {
      ru: "Охранная сигнализация — каталог оборудования",
      uz: "Qo'riqlash signalizatsiyasi — uskunalar katalogi",
      en: "Intruder alarm equipment — catalogue",
      tr: "Hırsız alarm ekipmanları — katalog",
      zh: "防盗报警设备目录",
    },
  },
  intercom: {
    href: "/products/group/domofoniya",
    label: {
      ru: "Домофоны в Ташкенте — каталог с ценами",
      uz: "Toshkentda domofonlar — narxlar bilan katalog",
      en: "Intercoms in Tashkent — catalogue with prices",
      tr: "Taşkent'te diafonlar — fiyatlı katalog",
      zh: "塔什干楼宇对讲——含价格目录",
    },
  },
};

const SEO: LocaleMap = {
  ru: {
    videonablyudenie: {
      title: "Камеры видеонаблюдения в Ташкенте — купить, цены",
      desc: "Камеры видеонаблюдения в Ташкенте: IP, Wi-Fi, PTZ и аналоговые камеры, регистраторы Hikvision, Dahua, HiLook. Цены в каталоге, доставка по Узбекистану, установка под ключ.",
      h1: "Камеры видеонаблюдения в Ташкенте",
      intro: "IP, Wi-Fi, PTZ и аналоговые камеры, видеорегистраторы и комплекты Hikvision, Dahua, HiLook, Avigilon — в наличии в Ташкенте с доставкой по всему Узбекистану.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Установка видеонаблюдения под ключ →",
      long:
        "Каталог группы собран так, чтобы закрыть объект одним заказом: IP- и аналоговые камеры, беспроводные модели, поворотные PTZ, видеорегистраторы NVR и DVR, готовые комплекты на 4–16 камер, а также кабель, блоки питания и коммутаторы PoE. Бренды — Hikvision, Dahua, HiLook, Avigilon: по ним есть склад в Ташкенте, официальная гарантия и сервис.\n\nВыбор сводится к четырём параметрам. Разрешение: 2–4 Мп хватает для дома и небольшого офиса, 4–8 Мп берут там, где нужно различать лица и автомобильные номера. Работа в темноте: инфракрасная подсветка даёт чёрно-белую картинку, технологии вроде ColorVu — цветную при слабом свете. Место установки: для улицы нужен защищённый корпус и рабочий диапазон температур, для помещения важнее угол обзора. Способ подключения: IP-камеры питаются по тому же кабелю, что передаёт данные (PoE), аналоговые дешевле и работают по уже проложенному коаксиалу.\n\nК камерам обязательно считается остальное: регистратор с диском под нужную глубину архива, питание, кабель и коммутатор. Глубина архива — параметр, который чаще всего забывают: при большом числе камер и высоком разрешении диск переписывается быстрее, чем к записи успевают обратиться. Мы считаем комплект целиком и говорим заранее, сколько дней записи получится, а при необходимости берём и монтаж — с проектом, прокладкой трасс, настройкой удалённого доступа и гарантией на работы.",
    },
    "kontrol-dostupa": {
      title: "СКУД в Ташкенте — купить оборудование, цены",
      desc: "Оборудование СКУД в Ташкенте: контроллеры, считыватели, биометрические терминалы, турникеты и замки ZKTeco, Hikvision, Dahua. Цены в каталоге, монтаж под ключ.",
      h1: "СКУД — контроль доступа в Ташкенте",
      intro: "Контроллеры, считыватели, биометрия, турникеты и электрозамки ZKTeco, Hikvision, Dahua — оборудование СКУД в наличии, с учётом рабочего времени и интеграцией с 1С.",
      serviceHref: "/solutions/access",
      serviceLabel: "Установка СКУД под ключ →",
    },
    "ohranno-pozharnaya": {
      title: "Пожарная и охранная сигнализация в Ташкенте — купить",
      desc: "Оборудование пожарной и охранной сигнализации в Ташкенте: извещатели, приборы, оповещение — Болид, Рубеж, Hikvision AX PRO. Цены в каталоге, проект и монтаж по нормам.",
      h1: "Пожарная и охранная сигнализация в Ташкенте",
      intro: "Извещатели, приёмно-контрольные приборы и оповещение Болид, Рубеж, Hikvision AX PRO — оборудование в наличии, проектируем и сдаём по нормам Узбекистана.",
      serviceHref: "/solutions/fire",
      serviceLabel: "Монтаж пожарной сигнализации под ключ →",
    },
    domofoniya: {
      title: "Домофоны в Ташкенте — купить, цены в каталоге",
      desc: "Домофоны в Ташкенте: видеодомофоны, вызывные панели и мониторы Hikvision, Dahua — для квартиры, дома и офиса. Цены в каталоге, установка и настройка под ключ.",
      h1: "Домофоны в Ташкенте",
      intro: "Видеодомофоны, вызывные панели и внутренние мониторы Hikvision и Dahua — аудио- и IP-домофония для квартир, домов, офисов и жилых комплексов.",
      long:
        "Домофон выбирают по объекту. Квартире достаточно комплекта «вызывная панель + монитор»: аудио — бюджетно, видео — стандарт, IP-модель добавляет просмотр и открытие с телефона из любой точки. Частному дому берут панель на калитку с защитой от осадков и монитор внутри, часто с управлением замком и воротами. Для подъезда и жилого комплекса ставятся многоабонентские системы: одна антивандальная панель обслуживает десятки квартир, жильцы открывают дверь картой, ключом или со смартфона.\n\nIP-домофония — сегодняшний стандарт для новых объектов: вызов приходит в приложение, даже когда вас нет дома, видео пишется в архив, а сама система объединяется со СКУД и видеонаблюдением в один контур. Офисам домофон заменяет секретаря на входе: вызов уходит на пост охраны или сразу нескольким сотрудникам.\n\nВ каталоге — видеодомофоны, вызывные панели и мониторы Hikvision и Dahua со склада в Ташкенте. Подберём комплект под квартиру, дом или подъезд, установим под ключ, настроим приложение и возьмём на обслуживание — по всему Узбекистану.",
      serviceHref: "/solutions/intercom",
      serviceLabel: "Установка домофона под ключ →",
    },
  },
  uz: {
    videonablyudenie: {
      title: "Toshkentda videokuzatuv kameralari — narxlar",
      desc: "Toshkentda videokuzatuv kameralari: IP, Wi-Fi, PTZ va analog kameralar, Hikvision, Dahua, HiLook registratorlari. Katalogda narxlar, O'zbekiston bo'ylab yetkazish, o'rnatish.",
      h1: "Toshkentda videokuzatuv kameralari",
      intro: "IP, Wi-Fi, PTZ va analog kameralar, videoregistratorlar hamda Hikvision, Dahua, HiLook, Avigilon to'plamlari — Toshkentda mavjud, butun O'zbekiston bo'ylab yetkazib beramiz.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Videokuzatuvni kalit topshirish asosida o'rnatish →",
      long:
        "Guruh katalogi obyektni bitta buyurtma bilan yopadigan qilib yig'ilgan: IP va analog kameralar, simsiz modellar, aylanuvchi PTZ, NVR va DVR registratorlar, 4–16 kameralik tayyor to'plamlar, shuningdek kabel, quvvat bloklari va PoE kommutatorlari. Brendlar — Hikvision, Dahua, HiLook, Avigilon: ular bo'yicha Toshkentda ombor, rasmiy kafolat va servis bor.\n\nTanlov to'rt parametrga keladi. Ruxsat: uy va kichik ofis uchun 2–4 Mp yetadi, yuz va avtomobil raqamlarini ajratish kerak bo'lganda 4–8 Mp olinadi. Qorong'ida ishlash: infraqizil yoritish oq-qora tasvir beradi, ColorVu kabi texnologiyalar — kam yorug'likda rangli. O'rnatish joyi: ko'cha uchun himoyalangan korpus va harorat diapazoni, xona uchun ko'rish burchagi muhimroq. Ulanish usuli: IP-kameralar ma'lumot uzatadigan o'sha kabel orqali quvvat oladi (PoE), analoglar arzonroq va allaqachon yotqizilgan koaksialda ishlaydi.\n\nKameralarga qolgan hamma narsa ham hisoblanadi: kerakli arxiv chuqurligiga mos diskli registrator, quvvat, kabel va kommutator. Arxiv chuqurligi — ko'pincha unutiladigan parametr: kameralar ko'p va ruxsat yuqori bo'lsa, disk yozuvga murojaat qilishga ulgurmasdan qayta yoziladi. Biz to'plamni butunlay hisoblaymiz va necha kunlik yozuv chiqishini oldindan aytamiz, kerak bo'lsa montajni ham olamiz — loyiha, trassalar, masofaviy kirishni sozlash va ishlarga kafolat bilan.",
    },
    "kontrol-dostupa": {
      title: "Toshkentda SKUD — uskunalar, narxlar",
      desc: "Toshkentda SKUD uskunalari: kontrollerlar, o'quvchilar, biometrik terminallar, turniketlar va qulflar — ZKTeco, Hikvision, Dahua. Katalogda narxlar, montaj.",
      h1: "SKUD — Toshkentda kirishni boshqarish",
      intro: "ZKTeco, Hikvision, Dahua kontrollerlari, o'quvchilari, biometriyasi, turniketlari va elektroqulflari — ish vaqtini hisobga olish va 1C integratsiyasi bilan.",
      serviceHref: "/solutions/access",
      serviceLabel: "SKUD ni kalit topshirish asosida o'rnatish →",
    },
    "ohranno-pozharnaya": {
      title: "Toshkentda yong'in va qo'riqlash signalizatsiyasi",
      desc: "Toshkentda yong'in va qo'riqlash signalizatsiyasi uskunalari: datchiklar, priborlar, ogohlantirish — Bolid, Rubezh, Hikvision AX PRO. Loyiha va montaj me'yorlar bo'yicha.",
      h1: "Yong'in va qo'riqlash signalizatsiyasi — Toshkent",
      intro: "Bolid, Rubezh, Hikvision AX PRO datchiklari, qabul-nazorat priborlari va ogohlantirish tizimlari — loyihalaymiz va O'zbekiston me'yorlari bo'yicha topshiramiz.",
      serviceHref: "/solutions/fire",
      serviceLabel: "Yong'in signalizatsiyasini o'rnatish →",
    },
    domofoniya: {
      title: "Toshkentda domofonlar — narxlar katalogi",
      desc: "Toshkentda domofonlar: video domofonlar, chaqiruv panellari va monitorlar Hikvision, Dahua — kvartira, uy va ofis uchun. Katalogda narxlar, o'rnatish va sozlash.",
      h1: "Toshkentda domofonlar",
      intro: "Hikvision va Dahua video domofonlari, chaqiruv panellari va ichki monitorlari — kvartiralar, uylar, ofislar va turar-joy majmualari uchun audio va IP domofoniya.",
      long:
        "Domofon obyektga qarab tanlanadi. Kvartiraga «chaqiruv paneli + monitor» to'plami yetadi: audio — hamyonbop, video — standart, IP-model istalgan joydan telefon orqali ko'rish va ochishni qo'shadi. Hovlili uyga yog'ingarchilikdan himoyalangan kalitka paneli va ichkariga monitor olinadi, ko'pincha qulf va darvoza boshqaruvi bilan. Podezd va turar-joy majmuasiga ko'p abonentli tizimlar o'rnatiladi: bitta antivandal panel o'nlab kvartiraga xizmat qiladi.\n\nIP-domofoniya — yangi obyektlar uchun bugungi standart: chaqiruv uyda bo'lmaganingizda ham ilovaga keladi, video arxivga yoziladi, tizim esa SKUD va videokuzatuv bilan bitta konturga birlashadi. Ofislarga domofon kirishdagi kotibni almashtiradi.\n\nKatalogda — Toshkentdagi ombordan Hikvision va Dahua video domofonlari, chaqiruv panellari va monitorlari. Kvartira, uy yoki podezdga to'plamni tanlaymiz, kalit topshirish sharti bilan o'rnatamiz, ilovani sozlaymiz va xizmatga olamiz.",
      serviceHref: "/solutions/intercom",
      serviceLabel: "Domofonni kalit topshirish asosida o'rnatish →",
    },
  },
  en: {
    videonablyudenie: {
      title: "CCTV Cameras in Tashkent — Buy, Prices",
      desc: "CCTV cameras in Tashkent: IP, Wi-Fi, PTZ and analogue cameras, NVRs by Hikvision, Dahua, HiLook. Catalogue prices, delivery across Uzbekistan, turnkey installation.",
      h1: "CCTV Cameras in Tashkent",
      intro: "IP, Wi-Fi, PTZ and analogue cameras, video recorders and kits by Hikvision, Dahua, HiLook, Avigilon — in stock in Tashkent with delivery across Uzbekistan.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Turnkey CCTV installation →",
      long:
        "The group catalogue is assembled so that a single order covers the whole site: IP and analogue cameras, wireless models, PTZ units, NVR and DVR recorders, ready-made kits for four to sixteen cameras, plus cable, power supplies and PoE switches. The brands are Hikvision, Dahua, HiLook and Avigilon, held in stock in Tashkent with official warranty and service.\n\nThe choice comes down to four parameters. Resolution: 2–4 MP suits a home or small office, 4–8 MP is for places where faces and vehicle plates must be readable. Low light: infrared illumination gives a black-and-white image, technologies such as ColorVu keep colour in dim conditions. Location: outdoors needs a rated housing and a working temperature range, indoors the field of view matters more. Connection: IP cameras take power over the data cable (PoE), while analogue is cheaper and reuses existing coaxial runs.\n\nEverything around the cameras counts too: a recorder with a disk sized for the retention you need, power, cabling and a switch. Retention is the parameter most often forgotten — with many cameras at high resolution the disk overwrites itself before anyone gets to the footage. We price the full set, say in advance how many days of recording it will hold, and can take on the installation as well, with design, cable routes, remote access setup and a warranty on the work.",
    },
    "kontrol-dostupa": {
      title: "Access Control in Tashkent — Equipment, Prices",
      desc: "Access control equipment in Tashkent: controllers, readers, biometric terminals, turnstiles and locks by ZKTeco, Hikvision, Dahua. Catalogue prices, turnkey installation.",
      h1: "Access Control (ACS) in Tashkent",
      intro: "Controllers, readers, biometrics, turnstiles and electric locks by ZKTeco, Hikvision, Dahua — with time attendance and 1C integration.",
      serviceHref: "/solutions/access",
      serviceLabel: "Turnkey access control installation →",
    },
    "ohranno-pozharnaya": {
      title: "Fire & Intruder Alarms in Tashkent — Buy",
      desc: "Fire and intruder alarm equipment in Tashkent: detectors, control panels, notification — Bolid, Rubezh, Hikvision AX PRO. Code-compliant design and installation.",
      h1: "Fire & Intruder Alarm Systems in Tashkent",
      intro: "Detectors, control panels and notification systems by Bolid, Rubezh, Hikvision AX PRO — we design and commission to Uzbekistan fire-safety codes.",
      serviceHref: "/solutions/fire",
      serviceLabel: "Turnkey fire alarm installation →",
    },
    domofoniya: {
      title: "Intercoms in Tashkent — Buy, Catalogue Prices",
      desc: "Intercoms in Tashkent: video intercoms, door stations and monitors by Hikvision, Dahua — for apartments, houses and offices. Catalogue prices, turnkey installation.",
      h1: "Intercoms in Tashkent",
      intro: "Video intercoms, door stations and indoor monitors by Hikvision and Dahua — audio and IP intercom systems for apartments, houses, offices and residential complexes.",
      long:
        "An intercom is chosen by the site. An apartment needs a door-station-plus-monitor kit: audio is the budget option, video the standard, and an IP model adds viewing and unlocking from the phone anywhere. A private house takes a weather-protected gate station and an indoor monitor, often controlling the lock and the gate. Apartment blocks get multi-tenant systems: one vandal-proof panel serves dozens of flats, residents open with a card, a fob or a smartphone.\n\nIP intercoms are today's standard for new sites: the call reaches the app even when you are away, video is archived, and the system merges with access control and CCTV into one loop. In offices the intercom replaces a receptionist at the door: the call lands on the guard post or several employees at once.\n\nThe catalogue holds Hikvision and Dahua video intercoms, door stations and monitors from Tashkent stock. We match a kit to an apartment, house or entrance, install turnkey, set up the app and service it across Uzbekistan.",
      serviceHref: "/solutions/intercom",
      serviceLabel: "Turnkey intercom installation →",
    },
  },
  tr: {
    videonablyudenie: {
      title: "Taşkent'te Güvenlik Kameraları — Fiyatlar",
      desc: "Taşkent'te güvenlik kameraları: IP, Wi-Fi, PTZ ve analog kameralar, Hikvision, Dahua, HiLook kayıt cihazları. Katalog fiyatları, Özbekistan geneli teslimat, kurulum.",
      h1: "Taşkent'te Güvenlik Kameraları",
      intro: "Hikvision, Dahua, HiLook, Avigilon IP, Wi-Fi, PTZ ve analog kameralar, kayıt cihazları ve setler — Taşkent'te stokta, tüm Özbekistan'a teslimat.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Anahtar teslim kamera kurulumu →",
    },
    "kontrol-dostupa": {
      title: "Taşkent'te Geçiş Kontrolü — Ekipman, Fiyatlar",
      desc: "Taşkent'te geçiş kontrol ekipmanları: kontrolörler, okuyucular, biyometrik terminaller, turnikeler ve kilitler — ZKTeco, Hikvision, Dahua. Katalog fiyatları, kurulum.",
      h1: "Taşkent'te Geçiş Kontrol Sistemleri",
      intro: "ZKTeco, Hikvision, Dahua kontrolörleri, okuyucuları, biyometrisi, turnikeleri ve elektrikli kilitleri — mesai takibi ve 1C entegrasyonuyla.",
      serviceHref: "/solutions/access",
      serviceLabel: "Anahtar teslim geçiş kontrolü kurulumu →",
    },
    "ohranno-pozharnaya": {
      title: "Taşkent'te Yangın ve Hırsız Alarmı — Satın Al",
      desc: "Taşkent'te yangın ve hırsız alarm ekipmanları: dedektörler, paneller, uyarı sistemleri — Bolid, Rubezh, Hikvision AX PRO. Yönetmeliğe uygun proje ve montaj.",
      h1: "Taşkent'te Yangın ve Hırsız Alarm Sistemleri",
      intro: "Bolid, Rubezh, Hikvision AX PRO dedektörleri, panelleri ve uyarı sistemleri — Özbekistan yangın yönetmeliklerine göre projelendirip teslim ediyoruz.",
      serviceHref: "/solutions/fire",
      serviceLabel: "Anahtar teslim yangın alarmı kurulumu →",
    },
    domofoniya: {
      title: "Taşkent'te Diafonlar — Katalog Fiyatları",
      desc: "Taşkent'te diafonlar: görüntülü diafonlar, kapı panelleri ve monitörler — Hikvision, Dahua. Daire, ev ve ofisler için. Katalog fiyatları, kurulum ve ayar.",
      h1: "Taşkent'te Diafonlar",
      intro: "Hikvision ve Dahua görüntülü diafonları, kapı panelleri ve iç monitörleri — daireler, evler, ofisler ve siteler için sesli ve IP diafon sistemleri.",
      long:
        "Diafon sahaya göre seçilir. Daireye kapı paneli + monitör seti yeter: sesli olan bütçe, görüntülü olan standart, IP model her yerden telefonla izleme ve açma ekler. Müstakil eve hava korumalı bahçe paneli ve içeride monitör alınır; çoğu zaman kilit ve kapı kontrolüyle. Apartman ve sitelere çok aboneli sistemler kurulur: tek vandal korumalı panel onlarca daireye hizmet eder.\n\nIP diafon yeni sahaların bugünkü standardıdır: çağrı evde değilken bile uygulamaya düşer, görüntü arşivlenir, sistem geçiş kontrolü ve kameralarla tek halkada birleşir. Ofislerde diafon kapıdaki resepsiyonu ikame eder.\n\nKatalogda Taşkent stoğundan Hikvision ve Dahua görüntülü diafonlar, kapı panelleri ve monitörler var. Daireye, eve veya girişe seti seçer, anahtar teslim kurar, uygulamayı ayarlar ve tüm Özbekistan'da servis veririz.",
      serviceHref: "/solutions/intercom",
      serviceLabel: "Anahtar teslim diafon kurulumu →",
    },
  },
  zh: {
    videonablyudenie: {
      title: "塔什干监控摄像机——购买与价格",
      desc: "塔什干监控摄像机：IP、Wi-Fi、PTZ和模拟摄像机，海康威视、大华、HiLook录像机。目录含价格，乌兹别克斯坦全境配送，交钥匙安装。",
      h1: "塔什干监控摄像机",
      intro: "海康威视、大华、HiLook、Avigilon的IP、Wi-Fi、PTZ和模拟摄像机、录像机及套装——塔什干现货，全乌兹别克斯坦配送。",
      serviceHref: "/solutions/cctv",
      serviceLabel: "视频监控交钥匙安装 →",
    },
    "kontrol-dostupa": {
      title: "塔什干门禁系统——设备与价格",
      desc: "塔什干门禁设备：控制器、读卡器、生物识别终端、闸机和电锁——中控智慧、海康威视、大华。目录含价格，交钥匙安装。",
      h1: "塔什干门禁系统（ACS）",
      intro: "中控智慧（ZKTeco）、海康威视、大华的控制器、读卡器、生物识别、闸机和电锁——支持考勤和1C集成。",
      serviceHref: "/solutions/access",
      serviceLabel: "门禁系统交钥匙安装 →",
    },
    "ohranno-pozharnaya": {
      title: "塔什干消防与防盗报警——购买",
      desc: "塔什干消防和防盗报警设备：探测器、主机、警报装置——Bolid、Rubezh、海康威视AX PRO。按规范设计与安装。",
      h1: "塔什干消防与防盗报警系统",
      intro: "Bolid、Rubezh、海康威视AX PRO的探测器、控制主机和警报系统——按乌兹别克斯坦消防规范设计并交验。",
      serviceHref: "/solutions/fire",
      serviceLabel: "火灾报警交钥匙安装 →",
    },
    domofoniya: {
      title: "塔什干楼宇对讲——购买与价格",
      desc: "塔什干楼宇对讲：海康威视、大华可视对讲、门口机和室内机——适用于公寓、住宅和办公室。目录含价格，交钥匙安装调试。",
      h1: "塔什干楼宇对讲",
      intro: "海康威视和大华的可视对讲、门口机和室内机——面向公寓、住宅、办公室和小区的语音及IP对讲系统。",
      long:
        "楼宇对讲按场所选择。公寓配「门口机+室内机」套装即可：音频最省，视频是标准，IP机型可在任何地方用手机查看和开门。独栋住宅选防雨庭院门口机加室内机，常带门锁和大门控制。单元楼和小区装多户系统：一台防暴门口机服务几十户，住户用卡、钥匙扣或手机开门。\n\nIP对讲是新项目的当今标准：人不在家呼叫也到手机App，视频入档，系统与门禁和监控合成一个环路。办公室里对讲替代门口前台：呼叫转到保安岗或同时转给几名员工。\n\n目录内有塔什干现货的海康威视和大华可视对讲、门口机和室内机。按公寓、住宅或单元配套，交钥匙安装，配置App，全乌兹别克斯坦维保。",
      serviceHref: "/solutions/intercom",
      serviceLabel: "楼宇对讲交钥匙安装 →",
    },
  },
};

/** SEO-оверлей группы каталога или null (фолбэк на generic-мету). */
export function getGroupSeo(locale: string, groupSlug: string): GroupSeo | null {
  return SEO[locale]?.[groupSlug] ?? SEO.ru?.[groupSlug] ?? null;
}
