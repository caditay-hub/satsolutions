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
  /** ссылки на профильные услуги под текстом `long` (26.10.2026: хаб видеонаблюдения →
      монтаж / видеоаналитика / ЖК). Нет поля — блок не рендерится. */
  links?: { label: string; href: string }[];
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
      uz: "Yongʻin signalizatsiyasi — uskunalar katalogi",
      en: "Fire alarm equipment — catalogue",
      tr: "Yangın alarm ekipmanları — katalog",
      zh: "火灾报警设备目录",
    },
  },
  alarm: {
    href: "/products/group/ohranno-pozharnaya",
    label: {
      ru: "Охранная сигнализация — каталог оборудования",
      uz: "Qoʻriqlash signalizatsiyasi — uskunalar katalogi",
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
    "umnyy-dom": {
      title: "Умный дом в Ташкенте — оборудование и цены",
      desc: "Оборудование умного дома в Ташкенте: датчики, реле и выключатели, умные розетки, шлюзы и камеры. Цены в каталоге, настройка сценариев и монтаж под ключ.",
      h1: "Умный дом в Ташкенте",
      intro: "Датчики, реле и выключатели, умные розетки, шлюзы и камеры для дома — совместимое оборудование в наличии, с настройкой сценариев и приложения.",
      serviceHref: "/solutions/smarthome",
      serviceLabel: "Умный дом под ключ →",
    },
    "setevoe-oborudovanie": {
      title: "Сетевое оборудование в Ташкенте",
      desc: "Коммутаторы PoE, маршрутизаторы, SFP-модули, PON и серверное оборудование H3C, MikroTik, IP-COM. Цены в каталоге, проектирование и монтаж сетей.",
      h1: "Сетевое оборудование в Ташкенте",
      intro: "Коммутаторы PoE, маршрутизаторы, SFP-модули, оборудование PON и серверные решения H3C, MikroTik, IP-COM — со склада в Ташкенте.",
      serviceHref: "/solutions/network",
      serviceLabel: "Монтаж сетей и СКС под ключ →",
    },
    "instrumenty-i-aksessuary": {
      title: "Кронштейны, инструмент и диски — Ташкент",
      desc: "Кронштейны для камер, монтажный инструмент, обжимки и тестеры, жёсткие диски под круглосуточную запись. Цены в каталоге, доставка по Узбекистану.",
      h1: "Инструменты и аксессуары для монтажа",
      intro: "Кронштейны и крепёж, монтажный инструмент, тестеры и обжимки, жёсткие диски под круглосуточную запись — всё, что нужно бригаде на объекте.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Монтаж видеонаблюдения под ключ →",
    },
    "pitanie-i-shkafy": {
      title: "ИБП, питание и серверные шкафы — Ташкент",
      desc: "Источники бесперебойного питания, блоки питания для камер и СКУД, настенные и напольные телекоммуникационные шкафы 6U–42U. Цены в каталоге, доставка.",
      h1: "Питание и телекоммуникационные шкафы",
      intro: "ИБП и блоки питания для камер, СКУД и сетей, настенные и напольные шкафы 6U–42U, полки и органайзеры — в наличии в Ташкенте.",
      serviceHref: "/solutions/server",
      serviceLabel: "Серверные и ЦОД под ключ →",
    },
    videonablyudenie: {
      title: "Камеры видеонаблюдения в Ташкенте — купить, цены",
      desc: "Камеры видеонаблюдения в Ташкенте: IP, Wi-Fi, PTZ и аналоговые камеры, регистраторы Hikvision, Dahua, HiLook. Цены в каталоге, доставка по Узбекистану, установка под ключ.",
      h1: "Камеры видеонаблюдения в Ташкенте",
      intro: "IP, Wi-Fi, PTZ и аналоговые камеры, видеорегистраторы и комплекты Hikvision, Dahua, Tapo, HiLook — в наличии в Ташкенте с доставкой по всему Узбекистану.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Установка видеонаблюдения под ключ →",
      long:
        "Каталог группы собран так, чтобы закрыть объект одним заказом: IP- и аналоговые камеры, беспроводные модели, поворотные PTZ, видеорегистраторы NVR и DVR, готовые комплекты на 4–16 камер, а также кабель, блоки питания и коммутаторы PoE. Бренды — Hikvision, Dahua, Tapo, HiLook: по ним есть склад в Ташкенте, официальная гарантия и сервис.\n\nВыбор сводится к четырём параметрам. Разрешение: 2–4 Мп хватает для дома и небольшого офиса, 4–8 Мп берут там, где нужно различать лица и автомобильные номера. Работа в темноте: инфракрасная подсветка даёт чёрно-белую картинку, технологии вроде ColorVu — цветную при слабом свете. Место установки: для улицы нужен защищённый корпус и рабочий диапазон температур, для помещения важнее угол обзора. Способ подключения: IP-камеры питаются по тому же кабелю, что передаёт данные (PoE), аналоговые дешевле и работают по уже проложенному коаксиалу.\n\nК камерам обязательно считается остальное: регистратор с диском под нужную глубину архива, питание, кабель и коммутатор. Глубина архива — параметр, который чаще всего забывают: при большом числе камер и высоком разрешении диск переписывается быстрее, чем к записи успевают обратиться. Мы считаем комплект целиком и говорим заранее, сколько дней записи получится, а при необходимости берём и монтаж — со схемой размещения, прокладкой трасс, настройкой удалённого доступа и гарантией на работы.\n\n## Вопросы и ответы\nQ: Какое приложение нужно для просмотра камер с телефона?\nA: Зависит от бренда: Hikvision и HiLook — Hik-Connect, Dahua — DMSS, камеры Tapo — приложение Tapo. Все три бесплатны для iOS и Android, показывают живое видео и архив и присылают уведомления о движении. При монтаже мы подключаем камеры к приложению и показываем, как им пользоваться.\n\nQ: Как устроена камера видеонаблюдения?\nA: Объектив собирает свет на матрицу, процессор сжимает картинку в поток H.264/H.265 и отдаёт его по кабелю или Wi-Fi на регистратор, в облако или на телефон. Ночью работает ИК-подсветка, у уличных моделей — герметичный корпус (IP66/IP67). IP-камера получает питание по тому же кабелю, что передаёт данные (PoE), аналоговая — по отдельному проводу.\n\nQ: Что такое CCTV?\nA: CCTV (closed-circuit television) — «замкнутое телевидение»: видео с камер идёт не в эфир, а только на свой регистратор и экраны. Так называют любую систему видеонаблюдения — аналоговую или IP. В каталоге это раздел камер, регистраторов и комплектов, а установка описана на странице услуги.\n\nQ: Что нужно для видеонаблюдения на улице частного дома?\nA: 2–4 уличные камеры с ИК-подсветкой на въезд, двор и периметр, регистратор с диском на 2–4 недели архива (или Wi-Fi-камеры с картой памяти там, где кабель не протянуть), блок питания или PoE-коммутатор и приложение на телефоне. Готовые комплекты на 4 камеры есть в каталоге; монтаж такого набора — 2,1–2,63 млн сум за работы и занимает один день.",
      links: [
        { label: "Установка видеонаблюдения: цены на монтаж", href: "/solutions/cctv" },
        { label: "Видеоаналитика: распознавание лиц и автономеров", href: "/solutions/analytics" },
        { label: "Видеонаблюдение и домофония для жилого комплекса", href: "/solutions/residential" },
      ],
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
      long:
        "Охранно-пожарный контур объекта собирается из трёх слоёв. Пожарная сигнализация — обязательный: извещатели дыма и тепла, приёмно-контрольный прибор, оповещатели и, где требуется, речевое оповещение СОУЭ; проект и сдача — по нормам Узбекистана. Охранная сигнализация — датчики движения и открытия, тревожные кнопки для персонала (стационарные у кассы и носимые радиобрелоки), сирены и уведомления на телефон или пульт охраны. Третий слой — интеграция: сработки привязываются к видеозаписи, доступы — к СКУД, и объект виден в одной системе.\n\nОборудование в каталоге — адресные системы Болид и Рубеж, беспроводная охранная панель Hikvision AX PRO, извещатели, оповещатели, тревожные кнопки и источники питания. Для бизнеса важно, что мы закрываем цикл целиком: лицензированное проектирование, монтаж, пусконаладка, сдача надзору и регламентное обслуживание.\n\nНе знаете, с чего начать? Пришлите план помещения — посчитаем состав системы и смету бесплатно, подскажем, что требуется по нормам именно вашему типу объекта.",
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
    "umnyy-dom": {
      title: "Toshkentda aqlli uy uskunalari",
      desc: "Toshkentda aqlli uy uskunalari: datchiklar, rele va vyklyuchatellar, aqlli rozetkalar, shlyuz va kameralar. Katalogda narxlar, ssenariylarni sozlash va montaj.",
      h1: "Toshkentda aqlli uy",
      intro: "Datchiklar, rele va vyklyuchatellar, aqlli rozetkalar, shlyuzlar va kameralar — mos uskunalar mavjud, ssenariy va ilova sozlanadi.",
      serviceHref: "/solutions/smarthome",
      serviceLabel: "Aqlli uy toʻliq tayyor holda →",
    },
    "setevoe-oborudovanie": {
      title: "Toshkentda tarmoq uskunalari",
      desc: "PoE kommutatorlar, marshrutizatorlar, SFP-modullar, PON va server uskunalari H3C, MikroTik, IP-COM. Katalogda narxlar, tarmoq loyihasi va montaji.",
      h1: "Toshkentda tarmoq uskunalari",
      intro: "PoE kommutatorlar, marshrutizatorlar, SFP-modullar, PON uskunalari va server yechimlari H3C, MikroTik, IP-COM — Toshkentdagi omborda.",
      serviceHref: "/solutions/network",
      serviceLabel: "Tarmoq va SKS montaji →",
    },
    "instrumenty-i-aksessuary": {
      title: "Kronshteyn, asbob va disklar — Toshkent",
      desc: "Kameralar uchun kronshteynlar, montaj asboblari, klesh va testerlar, kechayu kunduz yozuv uchun qattiq disklar. Katalogda narxlar, yetkazib berish bor.",
      h1: "Montaj uchun asbob va aksessuarlar",
      intro: "Kronshteyn va mahkamlagichlar, montaj asboblari, tester va kleshlar, uzluksiz yozuvga moʻljallangan qattiq disklar — brigadaga kerak boʻlgan hamma narsa.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Videokuzatuv montaji →",
    },
    "pitanie-i-shkafy": {
      title: "UPS, quvvat bloklari va shkaflar",
      desc: "Uzluksiz quvvat manbalari, kamera va SKUD uchun quvvat bloklari, devoriy va poldagi telekommunikatsiya shkaflari 6U–42U. Katalogda narxlar.",
      h1: "Quvvat manbalari va telekommunikatsiya shkaflari",
      intro: "Kamera, SKUD va tarmoq uchun UPS va quvvat bloklari, 6U–42U devoriy va poldagi shkaflar, javon va organayzerlar — Toshkentda mavjud.",
      serviceHref: "/solutions/server",
      serviceLabel: "Server xonasi va ma'lumot markazi →",
    },
    videonablyudenie: {
      title: "Toshkentda videokuzatuv kameralari — narxlar",
      desc: "Toshkentda videokuzatuv kameralari: IP, Wi-Fi, PTZ va analog kameralar, Hikvision, Dahua, HiLook registratorlari. Katalogda narxlar, Oʻzbekiston boʻylab yetkazish, oʻrnatish.",
      h1: "Toshkentda videokuzatuv kameralari",
      intro: "IP, Wi-Fi, PTZ va analog kameralar, videoregistratorlar hamda Hikvision, Dahua, Tapo, HiLook toʻplamlari — Toshkentda mavjud, butun Oʻzbekiston boʻylab yetkazib beramiz.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Videokuzatuvni toʻliq tayyor holda oʻrnatish →",
      long:
        "Guruh katalogi obyektni bitta buyurtma bilan yopadigan qilib yigʻilgan: IP va analog kameralar, simsiz modellar, aylanuvchi PTZ, NVR va DVR registratorlar, 4–16 kameralik tayyor toʻplamlar, shuningdek kabel, quvvat bloklari va PoE kommutatorlari. Brendlar — Hikvision, Dahua, Tapo, HiLook: ular boʻyicha Toshkentda ombor, rasmiy kafolat va servis bor.\n\nTanlov toʻrt parametrga keladi. Ruxsat: uy va kichik ofis uchun 2–4 Mp yetadi, yuz va avtomobil raqamlarini ajratish kerak boʻlganda 4–8 Mp olinadi. Qorongʻida ishlash: infraqizil yoritish oq-qora tasvir beradi, ColorVu kabi texnologiyalar — kam yorugʻlikda rangli. Oʻrnatish joyi: koʻcha uchun himoyalangan korpus va harorat diapazoni, xona uchun koʻrish burchagi muhimroq. Ulanish usuli: IP-kameralar maʼlumot uzatadigan oʻsha kabel orqali quvvat oladi (PoE), analoglar arzonroq va allaqachon yotqizilgan koaksialda ishlaydi.\n\nKameralarga qolgan hamma narsa ham hisoblanadi: kerakli arxiv chuqurligiga mos diskli registrator, quvvat, kabel va kommutator. Arxiv chuqurligi — koʻpincha unutiladigan parametr: kameralar koʻp va ruxsat yuqori boʻlsa, disk yozuvga murojaat qilishga ulgurmasdan qayta yoziladi. Biz toʻplamni butunlay hisoblaymiz va necha kunlik yozuv chiqishini oldindan aytamiz, kerak boʻlsa montajni ham olamiz — joylashtirish sxemasi, trassalar, masofaviy kirishni sozlash va ishlarga kafolat bilan.\n\n## FAQ\nQ: Kameralarni telefondan koʻrish uchun qanday ilova kerak?\nA: Brendga bogʻliq: Hikvision va HiLook — Hik-Connect, Dahua — DMSS, Tapo kameralari — Tapo ilovasi. Uchalasi iOS va Android uchun bepul, jonli tasvir va arxivni koʻrsatadi, harakat haqida bildirishnoma yuboradi. Montajda kameralarni ilovaga ulab, foydalanishni koʻrsatib beramiz.\n\nQ: Videokuzatuv kamerasi qanday tuzilgan?\nA: Obyektiv yorugʻlikni matritsaga yigʻadi, protsessor tasvirni H.264/H.265 oqimiga siqib, kabel yoki Wi-Fi orqali registratorga, bulutga yoki telefonga uzatadi. Kechasi infraqizil yoritish ishlaydi, koʻcha modellarida germetik korpus (IP66/IP67) bor. IP-kamera quvvatni maʼlumot uzatadigan oʻsha kabeldan (PoE) oladi, analog kamera — alohida simdan.\n\nQ: CCTV nima?\nA: CCTV (closed-circuit television) — «yopiq televideniye»: kameralardan video efirga emas, faqat oʻz registratori va ekranlariga boradi. Har qanday videokuzatuv tizimi — analog yoki IP — shunday ataladi. Katalogda bu kameralar, registratorlar va toʻplamlar boʻlimi; oʻrnatish xizmat sahifasida yoritilgan.\n\nQ: Xususiy uy hovlisi uchun videokuzatuvga nima kerak?\nA: Kirish, hovli va perimetrga infraqizil yoritishli 2–4 ta koʻcha kamerasi, 2–4 haftalik arxiv uchun diskli registrator (kabel tortib boʻlmaydigan joyda — xotira kartali Wi-Fi kameralar), quvvat bloki yoki PoE kommutator va telefondagi ilova. 4 kameralik tayyor toʻplamlar katalogda bor; bunday toʻplam montaji — ishlar uchun 2,1–2,63 mln soʻm, bir kunda bajariladi.",
      links: [
        { label: "Videokuzatuv oʻrnatish: montaj narxlari", href: "/solutions/cctv" },
        { label: "Videoanalitika: yuz va avtoraqamlarni tanish", href: "/solutions/analytics" },
        { label: "Turar-joy majmuasi uchun videokuzatuv va domofoniya", href: "/solutions/residential" },
      ],
    },
    "kontrol-dostupa": {
      title: "Toshkentda SKUD — uskunalar, narxlar",
      desc: "Toshkentda SKUD uskunalari: kontrollerlar, oʻquvchilar, biometrik terminallar, turniketlar va qulflar — ZKTeco, Hikvision, Dahua. Katalogda narxlar, montaj.",
      h1: "SKUD — Toshkentda kirishni boshqarish",
      intro: "ZKTeco, Hikvision, Dahua kontrollerlari, oʻquvchilari, biometriyasi, turniketlari va elektroqulflari — ish vaqtini hisobga olish va 1C integratsiyasi bilan.",
      serviceHref: "/solutions/access",
      serviceLabel: "SKUD ni toʻliq tayyor holda oʻrnatish →",
    },
    "ohranno-pozharnaya": {
      title: "Toshkentda yongʻin va qoʻriqlash signalizatsiyasi",
      desc: "Toshkentda yongʻin va qoʻriqlash signalizatsiyasi uskunalari: datchiklar, priborlar, ogohlantirish — Bolid, Rubezh, Hikvision AX PRO. Loyiha va montaj meʼyorlar boʻyicha.",
      h1: "Yongʻin va qoʻriqlash signalizatsiyasi — Toshkent",
      intro: "Bolid, Rubezh, Hikvision AX PRO datchiklari, qabul-nazorat priborlari va ogohlantirish tizimlari — loyihalaymiz va Oʻzbekiston meʼyorlari boʻyicha topshiramiz.",
      long:
        "Obyektning qoʻriqlash-yongʻin konturi uch qatlamdan yigʻiladi. Yongʻin signalizatsiyasi — majburiy: tutun va issiqlik datchiklari, qabul-nazorat pribori, ogohlantirgichlar va kerak joyda SOUE nutqli ogohlantirishi; loyiha va topshirish Oʻzbekiston meʼyorlari boʻyicha. Qoʻriqlash signalizatsiyasi — harakat va ochilish datchiklari, xodimlar uchun trevoga tugmalari (kassa yonida statsionar va olib yuriladigan radiobreloklar), sirenalar va telefon yoki pultga xabarlar. Uchinchi qatlam — integratsiya: ishga tushishlar videoyozuvga, kirishlar SKUDga bogʻlanadi.\n\nKatalogdagi uskunalar — Bolid va Rubezh adresli tizimlari, Hikvision AX PRO simsiz paneli, datchiklar, ogohlantirgichlar, trevoga tugmalari va quvvat manbalari. Biznes uchun muhimi: biz tsiklni toʻliq yopamiz — litsenziyali loyihalash, montaj, ishga tushirish, nazoratga topshirish va reglament servisi.\n\nNimadan boshlashni bilmayapsizmi? Xona rejasini yuboring — tizim tarkibi va smetani bepul hisoblaymiz.",
      serviceHref: "/solutions/fire",
      serviceLabel: "Yongʻin signalizatsiyasini oʻrnatish →",
    },
    domofoniya: {
      title: "Toshkentda domofonlar — narxlar katalogi",
      desc: "Toshkentda domofonlar: video domofonlar, chaqiruv panellari va monitorlar Hikvision, Dahua — kvartira, uy va ofis uchun. Katalogda narxlar, oʻrnatish va sozlash.",
      h1: "Toshkentda domofonlar",
      intro: "Hikvision va Dahua video domofonlari, chaqiruv panellari va ichki monitorlari — kvartiralar, uylar, ofislar va turar-joy majmualari uchun audio va IP domofoniya.",
      long:
        "Domofon obyektga qarab tanlanadi. Kvartiraga «chaqiruv paneli + monitor» toʻplami yetadi: audio — hamyonbop, video — standart, IP-model istalgan joydan telefon orqali koʻrish va ochishni qoʻshadi. Hovlili uyga yogʻingarchilikdan himoyalangan kalitka paneli va ichkariga monitor olinadi, koʻpincha qulf va darvoza boshqaruvi bilan. Podezd va turar-joy majmuasiga koʻp abonentli tizimlar oʻrnatiladi: bitta antivandal panel oʻnlab kvartiraga xizmat qiladi.\n\nIP-domofoniya — yangi obyektlar uchun bugungi standart: chaqiruv uyda boʻlmaganingizda ham ilovaga keladi, video arxivga yoziladi, tizim esa SKUD va videokuzatuv bilan bitta konturga birlashadi. Ofislarga domofon kirishdagi kotibni almashtiradi.\n\nKatalogda — Toshkentdagi ombordan Hikvision va Dahua video domofonlari, chaqiruv panellari va monitorlari. Kvartira, uy yoki podezdga toʻplamni tanlaymiz, toʻliq tayyor holda oʻrnatamiz, ilovani sozlaymiz va xizmatga olamiz.",
      serviceHref: "/solutions/intercom",
      serviceLabel: "Domofonni toʻliq tayyor holda oʻrnatish →",
    },
  },
  en: {
    "umnyy-dom": {
      title: "Smart home equipment in Tashkent",
      desc: "Smart home equipment in Tashkent: sensors, relays and switches, smart sockets, gateways and cameras. Catalog prices, scenario setup and turnkey installation.",
      h1: "Smart home in Tashkent",
      intro: "Sensors, relays and switches, smart sockets, gateways and cameras — compatible equipment in stock, with scenarios and the app set up for you.",
      serviceHref: "/solutions/smarthome",
      serviceLabel: "Turnkey smart home →",
    },
    "setevoe-oborudovanie": {
      title: "Network equipment in Tashkent",
      desc: "PoE switches, routers, SFP modules, PON and server hardware from H3C, MikroTik and IP-COM. Catalog prices, network design and installation.",
      h1: "Network equipment in Tashkent",
      intro: "PoE switches, routers, SFP modules, PON gear and server solutions from H3C, MikroTik and IP-COM — from the Tashkent warehouse.",
      serviceHref: "/solutions/network",
      serviceLabel: "Turnkey network and cabling →",
    },
    "instrumenty-i-aksessuary": {
      title: "Brackets, tools and drives — Tashkent",
      desc: "Camera brackets, installation tools, crimpers and testers, surveillance-grade hard drives. Catalog prices, delivery across Uzbekistan.",
      h1: "Installation tools and accessories",
      intro: "Brackets and fixings, installation tools, testers and crimpers, hard drives rated for round-the-clock recording — everything a crew needs on site.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Turnkey CCTV installation →",
    },
    "pitanie-i-shkafy": {
      title: "UPS, power supplies and cabinets",
      desc: "Uninterruptible power supplies, power units for cameras and access control, wall and floor telecom cabinets 6U–42U. Catalog prices and delivery.",
      h1: "Power supplies and telecom cabinets",
      intro: "UPS units and power supplies for cameras, access control and networks, 6U–42U wall and floor cabinets, shelves and organisers — in stock in Tashkent.",
      serviceHref: "/solutions/server",
      serviceLabel: "Turnkey server rooms →",
    },
    videonablyudenie: {
      title: "CCTV Cameras in Tashkent — Buy, Prices",
      desc: "CCTV cameras in Tashkent: IP, Wi-Fi, PTZ and analogue cameras, NVRs by Hikvision, Dahua, HiLook. Catalogue prices, delivery across Uzbekistan, turnkey installation.",
      h1: "CCTV Cameras in Tashkent",
      intro: "IP, Wi-Fi, PTZ and analogue cameras, video recorders and kits by Hikvision, Dahua, Tapo, HiLook — in stock in Tashkent with delivery across Uzbekistan.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Turnkey CCTV installation →",
      long:
        "The group catalogue is assembled so that a single order covers the whole site: IP and analogue cameras, wireless models, PTZ units, NVR and DVR recorders, ready-made kits for four to sixteen cameras, plus cable, power supplies and PoE switches. The brands are Hikvision, Dahua, Tapo and HiLook, held in stock in Tashkent with official warranty and service.\n\nThe choice comes down to four parameters. Resolution: 2–4 MP suits a home or small office, 4–8 MP is for places where faces and vehicle plates must be readable. Low light: infrared illumination gives a black-and-white image, technologies such as ColorVu keep colour in dim conditions. Location: outdoors needs a rated housing and a working temperature range, indoors the field of view matters more. Connection: IP cameras take power over the data cable (PoE), while analogue is cheaper and reuses existing coaxial runs.\n\nEverything around the cameras counts too: a recorder with a disk sized for the retention you need, power, cabling and a switch. Retention is the parameter most often forgotten — with many cameras at high resolution the disk overwrites itself before anyone gets to the footage. We price the full set, say in advance how many days of recording it will hold, and can take on the installation as well, with a placement layout, cable routes, remote access setup and a warranty on the work.\n\n## FAQ\nQ: Which app do I need to view cameras on my phone?\nA: It depends on the brand: Hikvision and HiLook use Hik-Connect, Dahua uses DMSS, Tapo cameras use the Tapo app. All three are free for iOS and Android, show live video and the archive, and send motion alerts. During installation we connect the cameras to the app and show you how to use it.\n\nQ: How does a CCTV camera work?\nA: The lens focuses light onto the sensor, the processor compresses the image into an H.264/H.265 stream and sends it over cable or Wi-Fi to a recorder, the cloud or your phone. At night infrared illumination takes over; outdoor models have a sealed housing (IP66/IP67). An IP camera is powered over the same cable that carries data (PoE), an analogue camera over a separate wire.\n\nQ: What is CCTV?\nA: CCTV stands for closed-circuit television: the video from the cameras is not broadcast but goes only to your own recorder and screens. The term covers any video surveillance system, analogue or IP. In the catalogue this is the section for cameras, recorders and kits; installation is described on the service page.\n\nQ: What do I need for outdoor CCTV at a private house?\nA: Two to four outdoor cameras with infrared illumination covering the gate, yard and perimeter, a recorder with a disk for two to four weeks of archive (or Wi-Fi cameras with a memory card where cable cannot be run), a power supply or PoE switch and the app on your phone. Ready-made four-camera kits are in the catalogue; installing such a kit costs 2.1–2.63 million UZS in labour and takes one day.",
      links: [
        { label: "CCTV installation: labour prices", href: "/solutions/cctv" },
        { label: "Video analytics: face and plate recognition", href: "/solutions/analytics" },
        { label: "CCTV and intercom for residential complexes", href: "/solutions/residential" },
      ],
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
      long:
        "A site's security-and-fire loop is built in three layers. Fire alarm is mandatory: smoke and heat detectors, a control panel, sounders and, where required, voice evacuation; design and commissioning follow Uzbekistan codes. Intruder alarm adds motion and door sensors, panic buttons for staff (fixed at the till and wearable radio fobs), sirens and notifications to a phone or a monitoring station. The third layer is integration: alarm events tie to video, entries to access control, and the site lives in one system.\n\nThe catalogue holds Bolid and Rubezh addressable systems, the Hikvision AX PRO wireless panel, detectors, sounders, panic buttons and power supplies. For business the point is a closed cycle: licensed design, installation, commissioning, handover to the inspectorate and scheduled service.\n\nNot sure where to start? Send the floor plan — we will size the system and the estimate for free.",
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
    "umnyy-dom": {
      title: "Taşkent’te akıllı ev ekipmanları",
      desc: "Taşkent’te akıllı ev ekipmanları: sensörler, röleler ve anahtarlar, akıllı prizler, ağ geçitleri ve kameralar. Katalog fiyatları, senaryo kurulumu ve montaj.",
      h1: "Taşkent’te akıllı ev",
      intro: "Sensörler, röleler ve anahtarlar, akıllı prizler, ağ geçitleri ve kameralar — uyumlu ekipman stokta, senaryolar ve uygulama kurulumuyla.",
      serviceHref: "/solutions/smarthome",
      serviceLabel: "Anahtar teslim akıllı ev →",
    },
    "setevoe-oborudovanie": {
      title: "Taşkent’te ağ ekipmanları",
      desc: "PoE switch’ler, yönlendiriciler, SFP modüller, PON ve sunucu donanımı: H3C, MikroTik, IP-COM. Katalog fiyatları, ağ projesi ve montajı.",
      h1: "Taşkent’te ağ ekipmanları",
      intro: "PoE switch’ler, yönlendiriciler, SFP modüller, PON ekipmanı ve sunucu çözümleri H3C, MikroTik, IP-COM — Taşkent deposundan.",
      serviceHref: "/solutions/network",
      serviceLabel: "Anahtar teslim ağ ve kablolama →",
    },
    "instrumenty-i-aksessuary": {
      title: "Braket, alet ve diskler — Taşkent",
      desc: "Kamera braketleri, montaj aletleri, pens ve test cihazları, kesintisiz kayda uygun sabit diskler. Katalog fiyatları, Özbekistan geneline teslimat.",
      h1: "Montaj alet ve aksesuarları",
      intro: "Braket ve bağlantı elemanları, montaj aletleri, test cihazları ve pensler, 7/24 kayda uygun sabit diskler — ekibin sahada ihtiyacı olan her şey.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Anahtar teslim kamera montajı →",
    },
    "pitanie-i-shkafy": {
      title: "UPS, güç kaynakları ve kabinler",
      desc: "Kesintisiz güç kaynakları, kamera ve geçiş kontrolü için güç üniteleri, duvar ve yer tipi telekom kabinleri 6U–42U. Katalog fiyatları ve teslimat.",
      h1: "Güç kaynakları ve telekom kabinleri",
      intro: "Kamera, geçiş kontrolü ve ağlar için UPS ve güç kaynakları, 6U–42U duvar ve yer tipi kabinler, raflar ve organizatörler — Taşkent’te stokta.",
      serviceHref: "/solutions/server",
      serviceLabel: "Anahtar teslim sunucu odası →",
    },
    videonablyudenie: {
      title: "Taşkent'te Güvenlik Kameraları — Fiyatlar",
      desc: "Taşkent'te güvenlik kameraları: IP, Wi-Fi, PTZ ve analog kameralar, Hikvision, Dahua, HiLook kayıt cihazları. Katalog fiyatları, Özbekistan geneli teslimat, kurulum.",
      h1: "Taşkent'te Güvenlik Kameraları",
      intro: "Hikvision, Dahua, Tapo, HiLook IP, Wi-Fi, PTZ ve analog kameralar, kayıt cihazları ve setler — Taşkent'te stokta, tüm Özbekistan'a teslimat.",
      serviceHref: "/solutions/cctv",
      serviceLabel: "Anahtar teslim kamera kurulumu →",
      long:
        "Grup kataloğu, tesisi tek siparişle kapatacak şekilde derlenmiştir: IP ve analog kameralar, kablosuz modeller, PTZ kameralar, NVR ve DVR kayıt cihazları, 4–16 kameralık hazır setler, ayrıca kablo, güç kaynakları ve PoE switch'ler. Markalar — Hikvision, Dahua, Tapo, HiLook: Taşkent'te stok, resmi garanti ve servis mevcuttur.\n\nSeçim dört parametreye iner. Çözünürlük: ev ve küçük ofis için 2–4 MP yeter, yüzlerin ve plakaların ayırt edilmesi gereken yerlerde 4–8 MP alınır. Karanlıkta çalışma: kızılötesi aydınlatma siyah-beyaz görüntü verir, ColorVu gibi teknolojiler düşük ışıkta renkli görüntü sağlar. Montaj yeri: dış mekân için korumalı gövde ve çalışma sıcaklığı aralığı gerekir, iç mekânda görüş açısı daha önemlidir. Bağlantı yöntemi: IP kameralar veri taşıyan aynı kablodan güç alır (PoE), analog kameralar daha ucuzdur ve döşeli koaksiyel kablo üzerinde çalışır.\n\nKameralara mutlaka geri kalanı da eklenir: gereken arşiv derinliğine uygun diskli kayıt cihazı, güç, kablo ve switch. Arşiv derinliği en sık unutulan parametredir: kamera sayısı fazla ve çözünürlük yüksekse disk, kayda bakılmaya fırsat kalmadan üzerine yazılır. Seti bütün olarak hesaplar, kaç günlük kayıt çıkacağını önceden söyleriz; gerekirse montajı da üstleniriz — yerleşim şeması, kablo güzergâhları, uzaktan erişim ayarı ve işçilik garantisiyle.\n## FAQ\nQ: Kameraları telefondan izlemek için hangi uygulama gerekir?\nA: Markaya bağlı: Hikvision ve HiLook — Hik-Connect, Dahua — DMSS, Tapo kameralar — Tapo uygulaması. Üçü de iOS ve Android için ücretsizdir, canlı görüntü ve arşivi gösterir, hareket bildirimi gönderir. Montajda kameraları uygulamaya bağlar ve kullanımını gösteririz.\n\nQ: Güvenlik kamerası nasıl çalışır?\nA: Lens ışığı sensöre toplar, işlemci görüntüyü H.264/H.265 akışına sıkıştırır ve kablo ya da Wi-Fi ile kayıt cihazına, buluta veya telefona iletir. Gece kızılötesi aydınlatma devreye girer; dış mekân modellerinde sızdırmaz gövde (IP66/IP67) bulunur. IP kamera gücü veri taşıyan aynı kablodan (PoE) alır, analog kamera ayrı bir kablodan.\n\nQ: CCTV nedir?\nA: CCTV (closed-circuit television) — «kapalı devre televizyon»: kameraların görüntüsü yayına değil, yalnızca kendi kayıt cihazınıza ve ekranlarınıza gider. Analog ya da IP, her güvenlik kamerası sistemi böyle adlandırılır. Katalogda bu, kamera, kayıt cihazı ve set bölümüdür; kurulum hizmet sayfasında anlatılır.\n\nQ: Müstakil evin dış mekânı için ne gerekir?\nA: Giriş, avlu ve çevre için kızılötesi aydınlatmalı 2–4 dış mekân kamerası, 2–4 haftalık arşiv için diskli kayıt cihazı (kablo çekilemeyen yerde hafıza kartlı Wi-Fi kamera), güç kaynağı veya PoE switch ve telefonda uygulama. Katalogda hazır 4 kameralı setler var; böyle bir setin montajı işçilik olarak 2,1–2,63 milyon UZS tutar ve bir günde biter.",
      links: [
        { label: "Kamera kurulumu: işçilik fiyatları", href: "/solutions/cctv" },
        { label: "Video analitik: yüz ve plaka tanıma", href: "/solutions/analytics" },
        { label: "Konut siteleri için kamera ve interkom", href: "/solutions/residential" },
      ],
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
      long:
        "Bir tesisin güvenlik-yangın halkası üç katmandan kurulur. Yangın alarmı zorunludur: duman ve ısı dedektörleri, kontrol paneli, sirenler ve gereken yerde sesli tahliye; proje ve teslim Özbekistan normlarına göredir. Hırsız alarmı hareket ve kapı sensörleri, personel için panik butonları (kasada sabit ve taşınabilir telsiz), sirenler ve telefona veya merkeze bildirim ekler. Üçüncü katman entegrasyondur: olaylar videoya, girişler geçiş kontrolüne bağlanır.\n\nKatalogda Bolid ve Rubezh adresli sistemleri, Hikvision AX PRO kablosuz paneli, dedektörler, sirenler, panik butonları ve güç kaynakları var. İş için önemli olan kapalı döngüdür: lisanslı proje, montaj, devreye alma, denetime teslim ve periyodik bakım.\n\nNereden başlayacağınızı bilmiyor musunuz? Planı gönderin — sistemi ve teklifi ücretsiz boyutlandıralım.",
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
    "umnyy-dom": {
      title: "塔什干智能家居 — 设备选购与报价",
      desc: "塔什干智能家居设备：传感器、继电器与开关、智能插座、网关与摄像机。目录含价格，提供场景配置与整体安装。",
      h1: "塔什干智能家居",
      intro: "传感器、继电器与开关、智能插座、网关与摄像机——兼容设备现货，含场景与手机应用配置。",
      serviceHref: "/solutions/smarthome",
      serviceLabel: "智能家居整体方案 →",
    },
    "setevoe-oborudovanie": {
      title: "塔什干网络设备 — 选购与报价",
      desc: "PoE 交换机、路由器、SFP 模块、PON 与服务器设备：H3C、MikroTik、IP-COM。目录含价格，提供网络设计与施工。",
      h1: "塔什干网络设备",
      intro: "PoE 交换机、路由器、SFP 模块、PON 设备与服务器方案 H3C、MikroTik、IP-COM——塔什干仓库现货。",
      serviceHref: "/solutions/network",
      serviceLabel: "网络与综合布线施工 →",
    },
    "instrumenty-i-aksessuary": {
      title: "支架、工具与硬盘 — 塔什干",
      desc: "摄像机支架、安装工具、压线钳与测试仪、适合 7×24 录像的硬盘。目录含价格，全乌兹别克斯坦配送。",
      h1: "安装工具与配件",
      intro: "支架与固定件、安装工具、测试仪与压线钳、适合全天候录像的硬盘——施工班组现场所需的一切。",
      serviceHref: "/solutions/cctv",
      serviceLabel: "视频监控整体安装 →",
    },
    "pitanie-i-shkafy": {
      title: "UPS、电源与服务器机柜 — 塔什干",
      desc: "不间断电源、摄像机与门禁电源、6U–42U 壁挂与落地通信机柜。目录含价格，提供配送。",
      h1: "电源与通信机柜",
      intro: "用于摄像机、门禁与网络的 UPS 和电源，6U–42U 壁挂与落地机柜，托板与理线件——塔什干现货。",
      serviceHref: "/solutions/server",
      serviceLabel: "机房与数据中心方案 →",
    },
    videonablyudenie: {
      title: "塔什干监控摄像机——购买与价格",
      desc: "塔什干监控摄像机：IP、Wi-Fi、PTZ和模拟摄像机，海康威视、大华、HiLook录像机。目录含价格，乌兹别克斯坦全境配送，交钥匙安装。",
      h1: "塔什干监控摄像机",
      intro: "海康威视、大华、Tapo、HiLook的IP、Wi-Fi、PTZ和模拟摄像机、录像机及套装——塔什干现货，全乌兹别克斯坦配送。",
      serviceHref: "/solutions/cctv",
      serviceLabel: "视频监控交钥匙安装 →",
      long:
        "本分类目录的编排目标是一次下单覆盖整个场所：IP 和模拟摄像机、无线机型、PTZ 云台机、NVR 和 DVR 录像机、4–16 路成品套装，以及线缆、电源和 PoE 交换机。品牌为海康威视、大华、Tapo、HiLook：塔什干有现货，提供官方质保和售后服务。\n\n选型归结为四个参数。分辨率：家庭和小型办公室 2–4 兆像素足够，需要分辨人脸和车牌的地方选 4–8 兆像素。夜间工作：红外补光给出黑白画面，ColorVu 之类的技术在弱光下保持彩色。安装位置：室外需要防护外壳和工作温度范围，室内更看重视角。连接方式：IP 摄像机通过传输数据的同一根网线供电（PoE），模拟摄像机更便宜，可沿用已敷设的同轴线。\n\n除摄像机之外还必须计算其余部分：按所需存储时长配硬盘的录像机、电源、线缆和交换机。存储时长是最常被忽略的参数：摄像机多、分辨率高时，硬盘会在有人来得及查看之前就被覆盖。我们整套核算，并事先告知能存多少天录像；如有需要也承接安装——含点位布置图、线路敷设、远程访问配置和施工质保。\n## FAQ\nQ: 用什么 App 在手机上看摄像机？\nA: 取决于品牌：海康威视和 HiLook 用 Hik-Connect，大华用 DMSS，Tapo 摄像机用 Tapo。三款均在 iOS 和 Android 免费，可看实时画面和录像回放，并推送移动侦测提醒。安装时我们把摄像机接入 App 并教您使用。\n\nQ: 监控摄像机是怎样工作的？\nA: 镜头把光聚到传感器上，处理器把画面压缩为 H.264/H.265 码流，通过网线或 Wi-Fi 传到录像机、云端或手机。夜间由红外补光工作，室外机型采用密封外壳（IP66/IP67）。IP 摄像机通过传数据的同一根网线供电（PoE），模拟摄像机需单独电源线。\n\nQ: 什么是 CCTV？\nA: CCTV 即闭路电视（closed-circuit television）：摄像机画面不对外播出，只传到自己的录像机和屏幕。任何视频监控系统——模拟或 IP——都可以这样称呼。目录中对应摄像机、录像机和套装分类；安装服务见服务页面。\n\nQ: 私人住宅室外监控需要什么？\nA: 覆盖大门、院子和周界的 2–4 台带红外补光的室外摄像机，配 2–4 周存储硬盘的录像机（无法布线处用带存储卡的 Wi-Fi 摄像机），电源或 PoE 交换机，以及手机 App。目录中有 4 路成套方案；此类套装的安装工费为 210–263 万苏姆，一天完工。",
      links: [
        { label: "视频监控安装：工费价格", href: "/solutions/cctv" },
        { label: "视频智能分析：人脸与车牌识别", href: "/solutions/analytics" },
        { label: "住宅小区视频监控与楼宇对讲", href: "/solutions/residential" },
      ],
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
      long:
        "场所的安防消防体系分三层。火灾报警是强制项：烟感与温感探测器、控制主机、声光警报器，必要处配语音疏散；设计与验收按乌兹别克斯坦规范。防盗报警增加移动与开门探测器、员工紧急按钮（收银台固定式和随身无线钮）、警笛及推送到手机或监控中心。第三层是集成：报警联动录像、出入联动门禁，全场所一套系统尽收眼底。\n\n目录内有Bolid和Rubezh总线制系统、海康威视AX PRO无线主机、探测器、警报器、紧急按钮和电源。对企业的关键是闭环服务：持证设计、安装、调试、消防验收和定期维保。\n\n不知从何入手？发来平面图——免费核算系统构成和造价。",
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
