// Тексты страниц собственных приложений: /apps (хаб), /apps/uy (жителям ЖК и УК), /apps/davomat (учёт рабочего времени).
// Контент на 5 локалях инлайном, как в /tenders и /international. Цены не указываем — их считает менеджер по объекту.
// Ключи: «приложение для жителей ЖК», «домофон на телефон», «пропуск гостя по QR», «учёт рабочего времени по лицу», «табель 1С».

/** Пара «заголовок — пояснение»: карточки возможностей, шаги, факты. */
export type Item = { t: string; d: string };

export type AppsHub = {
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  cardsTitle: string;
  uy: { title: string; tagline: string; bullets: string[]; link: string };
  davomat: { title: string; tagline: string; bullets: string[]; link: string };
  whyTitle: string;
  why: Item[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
};

export type AppPage = {
  metaTitle: string;
  metaDesc: string;
  h1: string;
  intro: string;
  screensTitle: string;
  screens: string[];
  forWhomTitle: string;
  forWhom: Item[];
  secondTitle: string;
  second: Item[];
  howTitle: string;
  how: Item[];
  techTitle: string;
  techText: string;
  tech: string[];
  faqTitle: string;
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  otherApp: string;
};

/** Подписи хлебных крошек по локалям: хаб приложений и обе продуктовые страницы. */
export const CRUMBS: Record<string, { home: string; apps: string }> = {
  ru: { home: "Главная", apps: "Приложения" },
  uz: { home: "Bosh sahifa", apps: "Ilovalar" },
  en: { home: "Home", apps: "Apps" },
  tr: { home: "Ana sayfa", apps: "Uygulamalar" },
  zh: { home: "首页", apps: "应用" },
};

export const HUB: Record<string, AppsHub> = {
  ru: {
    metaTitle: "Приложения SAT: для жителей ЖК и для учёта рабочего времени | SAT Solutions",
    metaDesc: "Собственные приложения SAT Solutions: SAT Uy — подъезд с телефона, гости по QR, заявки и счета для жителей ЖК и кабинет управляющей компании; SAT Davomat — учёт рабочего времени по лицу с табелем и выгрузкой в 1С.",
    h1: "Приложения SAT",
    intro: "Мы не только монтируем оборудование, но и пишем программы, которые им управляют. Два приложения работают с техникой, которая уже стоит на объекте: домофонами, терминалами распознавания лиц, контроллерами дверей и шлагбаумов.",
    cardsTitle: "Два приложения",
    uy: {
      title: "SAT Uy",
      tagline: "Жителям жилого комплекса и управляющей компании",
      bullets: [
        "Подъезд, калитка и шлагбаум открываются с телефона",
        "Гостю уходит ссылка с QR-кодом на нужный срок",
        "Заявки в управляющую компанию с этапами и исполнителем",
        "Счёт за месяц, оплата и журнал проходов",
      ],
      link: "Подробно о SAT Uy",
    },
    davomat: {
      title: "SAT Davomat",
      tagline: "Учёт рабочего времени по лицу",
      bullets: [
        "Приход и уход отмечаются за доли секунды",
        "Табель по сотрудникам, опоздания и переработки",
        "Выгрузка табеля в 1С",
        "Несколько объектов и подразделений в одном кабинете",
      ],
      link: "Подробно о SAT Davomat",
    },
    whyTitle: "Почему это работает лучше коробочных программ",
    why: [
      { t: "Своя разработка", d: "Мы сами пишем и сопровождаем код, поэтому дорабатываем приложение под правила вашего объекта." },
      { t: "Работает с вашей техникой", d: "Домофоны Hikvision и Dahua, терминалы распознавания лиц, контроллеры ZKTeco — менять оборудование не нужно." },
      { t: "Поддержка в Ташкенте", d: "Мы же монтируем технику и обслуживаем её: одна ответственная компания вместо поставщика, программиста и монтажника." },
    ],
    faqTitle: "Частые вопросы",
    faq: [
      { q: "Нужно ли менять домофоны и контроллеры?", a: "Обычно нет. Если техника сетевая и рабочая, мы подключаем её к приложению. Замена нужна только для устаревших аналоговых систем." },
      { q: "Что делать, если на объекте пропал интернет?", a: "Проход по лицу и карте продолжает работать: решение принимает сам терминал. Открытие с телефона и гостевые QR-коды восстанавливаются вместе со связью." },
      { q: "Где хранятся данные?", a: "На сервере в Узбекистане. Пароли от оборудования остаются на объекте и в облако не передаются." },
    ],
    ctaTitle: "Покажем приложение на вашем объекте",
    ctaText: "Приезжаем, смотрим, какая техника уже стоит, и показываем работу приложения на ней. Расчёт готовим после осмотра.",
    ctaButton: "Оставить заявку",
  },
  uz: {
    metaTitle: "SAT ilovalari: TJM aholisi uchun va ish vaqtini hisobga olish | SAT Solutions",
    metaDesc: "SAT Solutions ilovalari: SAT Uy — yoʻlakni telefondan ochish, mehmonlar uchun QR, arizalar va hisob, boshqaruv kompaniyasi kabineti; SAT Davomat — yuz orqali ish vaqtini hisobga olish, tabel va 1Cga yuklash.",
    h1: "SAT ilovalari",
    intro: "Biz uskunani oʻrnatibgina qolmay, uni boshqaradigan dasturlarni ham yozamiz. Ikkala ilova obyektda allaqachon turgan texnika bilan ishlaydi: domofonlar, yuzni tanish terminallari, eshik va shlagbaum kontrollerlari.",
    cardsTitle: "Ikkita ilova",
    uy: {
      title: "SAT Uy",
      tagline: "Turar joy majmuasi aholisi va boshqaruv kompaniyasi uchun",
      bullets: [
        "Yoʻlak, darvozacha va shlagbaum telefondan ochiladi",
        "Mehmonga kerakli muddatga QR-kodli havola boradi",
        "Boshqaruv kompaniyasiga arizalar: bosqichlar va ijrochi",
        "Oylik hisob, toʻlov va oʻtishlar jurnali",
      ],
      link: "SAT Uy haqida batafsil",
    },
    davomat: {
      title: "SAT Davomat",
      tagline: "Yuz orqali ish vaqtini hisobga olish",
      bullets: [
        "Kelish va ketish bir soniyada qayd etiladi",
        "Xodimlar boʻyicha tabel, kechikish va ortiqcha ish",
        "Tabelni 1Cga yuklash",
        "Bitta kabinetda bir nechta obyekt va boʻlim",
      ],
      link: "SAT Davomat haqida batafsil",
    },
    whyTitle: "Nega bu tayyor dasturlardan qulayroq",
    why: [
      { t: "Oʻz ishlanmamiz", d: "Kodni oʻzimiz yozamiz va qoʻllab-quvvatlaymiz, shuning uchun ilovani obyekt qoidalariga moslaymiz." },
      { t: "Sizdagi texnika bilan ishlaydi", d: "Hikvision va Dahua domofonlari, yuzni tanish terminallari, ZKTeco kontrollerlari — uskunani almashtirish shart emas." },
      { t: "Toshkentda qoʻllab-quvvatlash", d: "Texnikani ham biz oʻrnatamiz va xizmat koʻrsatamiz: yetkazib beruvchi, dasturchi va ustalar oʻrniga bitta mas’ul kompaniya." },
    ],
    faqTitle: "Koʻp beriladigan savollar",
    faq: [
      { q: "Domofon va kontrollerlarni almashtirish kerakmi?", a: "Odatda yoʻq. Texnika tarmoqqa ulangan va ishlayotgan boʻlsa, uni ilovaga ulaymiz. Faqat eski analog tizimlarni almashtirish kerak boʻladi." },
      { q: "Obyektda internet uzilsa nima boʻladi?", a: "Yuz va karta orqali oʻtish ishlayveradi: qarorni terminalning oʻzi qabul qiladi. Telefondan ochish va mehmon QR-kodlari aloqa tiklangach qayta ishlaydi." },
      { q: "Ma’lumotlar qayerda saqlanadi?", a: "Oʻzbekistondagi serverda. Uskunaning parollari obyektda qoladi va bulutga uzatilmaydi." },
    ],
    ctaTitle: "Ilovani obyektingizda koʻrsatamiz",
    ctaText: "Kelamiz, qanday texnika turganini koʻramiz va ilovani oʻsha texnikada ishlatib koʻrsatamiz. Hisob-kitobni koʻrikdan soʻng tayyorlaymiz.",
    ctaButton: "Ariza qoldirish",
  },
  en: {
    metaTitle: "SAT apps: for residential complexes and workforce time tracking | SAT Solutions",
    metaDesc: "In-house apps by SAT Solutions: SAT Uy — open the entrance from a phone, guest QR passes, requests and bills for residents plus a management company dashboard; SAT Davomat — face-based time tracking with timesheets and 1C export.",
    h1: "SAT apps",
    intro: "We install hardware and we write the software that runs it. Both apps work with equipment already installed on site: intercoms, face recognition terminals, door and barrier controllers.",
    cardsTitle: "Two apps",
    uy: {
      title: "SAT Uy",
      tagline: "For residents and the management company",
      bullets: [
        "Entrance door, gate and barrier open from a phone",
        "A guest receives a QR link valid for a set period",
        "Requests to the management company with stages and an assignee",
        "Monthly bill, payment and the access log",
      ],
      link: "More about SAT Uy",
    },
    davomat: {
      title: "SAT Davomat",
      tagline: "Face-based time and attendance",
      bullets: [
        "Entry and exit are recorded in a fraction of a second",
        "Timesheets per employee, late arrivals and overtime",
        "Timesheet export to 1C",
        "Several sites and departments in one dashboard",
      ],
      link: "More about SAT Davomat",
    },
    whyTitle: "Why this beats off-the-shelf software",
    why: [
      { t: "Built in-house", d: "We write and maintain the code ourselves, so we adapt the app to the rules of your site." },
      { t: "Works with your hardware", d: "Hikvision and Dahua intercoms, face terminals, ZKTeco controllers — no need to replace equipment." },
      { t: "Support in Tashkent", d: "We also install and service the hardware: one responsible company instead of a vendor, a developer and an installer." },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Do intercoms and controllers have to be replaced?", a: "Usually not. If the hardware is networked and working, we connect it to the app. Only outdated analogue systems need replacing." },
      { q: "What happens if the site loses internet access?", a: "Face and card access keeps working: the terminal decides locally. Phone unlocking and guest QR codes resume as soon as the connection is back." },
      { q: "Where is the data stored?", a: "On a server in Uzbekistan. Equipment passwords stay on site and are never sent to the cloud." },
    ],
    ctaTitle: "We will demo the app at your site",
    ctaText: "We visit, check what hardware is already in place and run the app on it. The quote follows the survey.",
    ctaButton: "Request a demo",
  },
  tr: {
    metaTitle: "SAT uygulamaları: konut siteleri ve personel devam takibi | SAT Solutions",
    metaDesc: "SAT Solutions’ın kendi uygulamaları: SAT Uy — kapıyı telefondan açma, misafir için QR geçiş, talepler ve faturalar, yönetim şirketi paneli; SAT Davomat — yüzle devam takibi, puantaj ve 1C aktarımı.",
    h1: "SAT uygulamaları",
    intro: "Yalnızca donanım kurmuyoruz, onu çalıştıran yazılımı da biz yazıyoruz. Her iki uygulama da sahada hâlihazırda bulunan cihazlarla çalışır: interkomlar, yüz tanıma terminalleri, kapı ve bariyer kontrolörleri.",
    cardsTitle: "İki uygulama",
    uy: {
      title: "SAT Uy",
      tagline: "Site sakinleri ve yönetim şirketi için",
      bullets: [
        "Bina kapısı, bahçe kapısı ve bariyer telefondan açılır",
        "Misafire belirli süre geçerli QR bağlantısı gider",
        "Yönetime talepler: aşamalar ve sorumlu kişi",
        "Aylık fatura, ödeme ve geçiş kaydı",
      ],
      link: "SAT Uy hakkında ayrıntı",
    },
    davomat: {
      title: "SAT Davomat",
      tagline: "Yüz tanımayla mesai takibi",
      bullets: [
        "Giriş ve çıkış saniyenin altında kaydedilir",
        "Personel bazlı puantaj, geç kalma ve fazla mesai",
        "Puantajın 1C’ye aktarımı",
        "Tek panelde birden çok saha ve departman",
      ],
      link: "SAT Davomat hakkında ayrıntı",
    },
    whyTitle: "Hazır yazılımlara göre avantajı",
    why: [
      { t: "Kendi geliştirmemiz", d: "Kodu biz yazıyor ve sürdürüyoruz; uygulamayı sahanızın kurallarına göre uyarlıyoruz." },
      { t: "Mevcut donanımla çalışır", d: "Hikvision ve Dahua interkomları, yüz terminalleri, ZKTeco kontrolörleri — cihaz değiştirmeye gerek yok." },
      { t: "Taşkent’te destek", d: "Donanımı da biz kuruyor ve bakımını yapıyoruz: tedarikçi, yazılımcı ve montajcı yerine tek sorumlu şirket." },
    ],
    faqTitle: "Sık sorulan sorular",
    faq: [
      { q: "İnterkom ve kontrolörler değişmeli mi?", a: "Genelde hayır. Cihazlar ağa bağlı ve çalışır durumdaysa uygulamaya bağlarız. Yalnızca eski analog sistemler değişir." },
      { q: "Sahada internet kesilirse ne olur?", a: "Yüz ve kartla geçiş çalışmaya devam eder: kararı terminal verir. Telefonla açma ve misafir QR kodları bağlantı gelince yeniden çalışır." },
      { q: "Veriler nerede tutuluyor?", a: "Özbekistan’daki sunucuda. Cihaz şifreleri sahada kalır, buluta gönderilmez." },
    ],
    ctaTitle: "Uygulamayı sahanızda gösterelim",
    ctaText: "Geliyoruz, mevcut donanımı inceliyor ve uygulamayı onun üzerinde çalıştırıyoruz. Teklif keşiften sonra hazırlanır.",
    ctaButton: "Talep gönderin",
  },
  zh: {
    metaTitle: "SAT 应用：住宅小区与考勤管理 | SAT Solutions",
    metaDesc: "SAT Solutions 自研应用：SAT Uy——手机开门、访客二维码通行、报修与账单，物业管理后台；SAT Davomat——人脸考勤、考勤表与导出到 1C。",
    h1: "SAT 应用",
    intro: "我们不仅安装设备，也自己编写运行这些设备的软件。两款应用都可对接现场已有设备：楼宇对讲、人脸识别终端、门禁与道闸控制器。",
    cardsTitle: "两款应用",
    uy: {
      title: "SAT Uy",
      tagline: "面向小区住户与物业公司",
      bullets: [
        "单元门、小门与道闸用手机打开",
        "访客收到限时有效的二维码链接",
        "向物业报修：进度与负责人一目了然",
        "月度账单、缴费与通行记录",
      ],
      link: "了解 SAT Uy",
    },
    davomat: {
      title: "SAT Davomat",
      tagline: "人脸考勤",
      bullets: [
        "上下班打卡在一秒内完成",
        "按员工统计考勤、迟到与加班",
        "考勤表导出到 1C",
        "一个后台管理多个场所与部门",
      ],
      link: "了解 SAT Davomat",
    },
    whyTitle: "相比成品软件的优势",
    why: [
      { t: "自主研发", d: "代码由我们编写和维护，可按贵单位的规则调整功能。" },
      { t: "兼容现有设备", d: "海康与大华对讲、人脸终端、ZKTeco 控制器均可接入，无需更换设备。" },
      { t: "塔什干本地支持", d: "设备也由我们安装与维护：一家公司负责到底，无需在供应商、开发者与安装方之间周旋。" },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "需要更换对讲和控制器吗？", a: "通常不需要。只要设备联网且运行正常，我们即可接入应用；只有老旧模拟系统才需要更换。" },
      { q: "现场断网怎么办？", a: "人脸与刷卡通行照常可用：由终端本地判断。手机开门与访客二维码在网络恢复后自动恢复。" },
      { q: "数据存放在哪里？", a: "存放在乌兹别克斯坦境内的服务器；设备密码保留在现场，不上传云端。" },
    ],
    ctaTitle: "我们可到现场演示",
    ctaText: "我们上门查看现有设备，并在这些设备上演示应用。报价在勘察之后提供。",
    ctaButton: "提交需求",
  },
};
