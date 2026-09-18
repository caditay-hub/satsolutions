// Тексты дополнительных блоков на страницах приложений: схема прохода гостя, журнал
// событий, «было / стало», графики учёта времени, схема работы на объекте и полоса
// совместимой техники. Пять локалей, как и весь сайт.

export type Step = { t: string; d: string };
export type EventItem = { t: string; d: string; icon: "door" | "call" | "guest" };
export type Row = { was: string; now: string };
export type Chart = { title: string; labels: string[]; values: number[]; hi: number };

export type UyExtras = {
  flowTitle: string;
  flowLead: string;
  flow: Step[];
  feedTitle: string;
  feedLead: string;
  feed: EventItem[];
  tableTitle: string;
  colWas: string;
  colNow: string;
  rows: Row[];
};

export type DavomatExtras = {
  chartsTitle: string;
  chartsLead: string;
  arrival: Chart;
  late: Chart;
};

export type HubExtras = {
  schemeTitle: string;
  schemeLead: string;
  nodes: Step[];
  brandsTitle: string;
  brands: string[];
};

export const UY_EXTRAS: Record<string, UyExtras> = {
  ru: {
    flowTitle: "Как гость попадает внутрь",
    flowLead: "Житель выдаёт пропуск сам, диспетчеру звонить не нужно.",
    flow: [
      { t: "Житель создаёт пропуск", d: "на один визит или на срок" },
      { t: "Гостю уходит ссылка", d: "в ней кнопка и QR-код" },
      { t: "QR к терминалу", d: "или нажатие прямо в ссылке" },
      { t: "Дверь открыта", d: "проход записан в журнал" },
    ],
    feedTitle: "Журнал: видно каждый проход",
    feedLead: "События приходят жителю и в кабинет управляющей компании.",
    feed: [
      { t: "Открыли подъезд 4", d: "Азиз · сегодня, 18:49", icon: "door" },
      { t: "Звонок в домофон", d: "калитка · сегодня, 18:12", icon: "call" },
      { t: "Гость пришёл — курьер", d: "пропуск по QR · сегодня, 17:30", icon: "guest" },
    ],
    tableTitle: "Что меняется у управляющей компании",
    colWas: "Было",
    colNow: "Стало",
    rows: [
      { was: "Заявки в тетради и личных чатах", now: "Заявка с этапами: принята, в работе, исполнитель, оценка жителя" },
      { was: "Ключи и брелоки теряются, меняются за деньги", now: "Доступ выдаётся и снимается в кабинете за секунду" },
      { was: "Кто заходил — неизвестно", now: "Журнал проходов: кто, куда, когда и чем открыл" },
      { was: "Квитанции разносят вручную", now: "Начисления в приложении, оплата через Click" },
    ],
  },
  uz: {
    flowTitle: "Mehmon ichkariga qanday kiradi",
    flowLead: "Ruxsatnomani aholi oʻzi beradi, dispetcherga qoʻngʻiroq qilish shart emas.",
    flow: [
      { t: "Aholi ruxsatnoma yaratadi", d: "bir tashrifga yoki muddatga" },
      { t: "Mehmonga havola boradi", d: "unda tugma va QR-kod bor" },
      { t: "QR terminalga koʻrsatiladi", d: "yoki havoladagi tugma bosiladi" },
      { t: "Eshik ochildi", d: "oʻtish jurnalga yozildi" },
    ],
    feedTitle: "Jurnal: har bir oʻtish koʻrinadi",
    feedLead: "Voqealar aholiga ham, boshqaruv kompaniyasi kabinetiga ham tushadi.",
    feed: [
      { t: "4-podyezd ochildi", d: "Aziz · bugun, 18:49", icon: "door" },
      { t: "Domofonga qoʻngʻiroq", d: "darvozacha · bugun, 18:12", icon: "call" },
      { t: "Mehmon keldi — kuryer", d: "QR ruxsatnoma · bugun, 17:30", icon: "guest" },
    ],
    tableTitle: "Boshqaruv kompaniyasida nima oʻzgaradi",
    colWas: "Ilgari",
    colNow: "Endi",
    rows: [
      { was: "Arizalar daftarda va shaxsiy chatlarda", now: "Ariza bosqichlari bilan: qabul qilindi, ishda, ijrochi, aholi bahosi" },
      { was: "Kalit va brelok yoʻqoladi, pulga almashtiriladi", now: "Ruxsat kabinetda bir soniyada beriladi va olib qoʻyiladi" },
      { was: "Kim kirgani nomaʼlum", now: "Oʻtish jurnali: kim, qayerga, qachon va nima bilan ochgan" },
      { was: "Kvitansiyalar qoʻlda tarqatiladi", now: "Hisob-kitob ilovada, toʻlov Click orqali" },
    ],
  },
  en: {
    flowTitle: "How a guest gets in",
    flowLead: "The resident issues the pass; no call to the front desk.",
    flow: [
      { t: "Resident creates a pass", d: "for one visit or for a period" },
      { t: "The guest gets a link", d: "with a button and a QR code" },
      { t: "QR at the terminal", d: "or a tap inside the link" },
      { t: "The door opens", d: "the entry is written to the log" },
    ],
    feedTitle: "The log: every entry is visible",
    feedLead: "Events reach the resident and the management company alike.",
    feed: [
      { t: "Entrance 4 opened", d: "Aziz · today, 18:49", icon: "door" },
      { t: "Intercom call", d: "side gate · today, 18:12", icon: "call" },
      { t: "Guest arrived — courier", d: "QR pass · today, 17:30", icon: "guest" },
    ],
    tableTitle: "What changes for the management company",
    colWas: "Before",
    colNow: "After",
    rows: [
      { was: "Requests in a notebook and private chats", now: "A request with stages: accepted, in progress, assignee, resident's rating" },
      { was: "Keys and fobs get lost and cost money to replace", now: "Access is granted and revoked in the dashboard in a second" },
      { was: "Nobody knows who came in", now: "Entry log: who, where, when and how they opened it" },
      { was: "Bills are delivered by hand", now: "Charges in the app, payment through Click" },
    ],
  },
  tr: {
    flowTitle: "Misafir içeri nasıl giriyor",
    flowLead: "Geçiş iznini sakin kendisi veriyor, danışmayı aramaya gerek yok.",
    flow: [
      { t: "Sakin geçiş izni oluşturur", d: "tek ziyaret ya da belirli süre için" },
      { t: "Misafire bağlantı gider", d: "içinde buton ve QR kod var" },
      { t: "QR terminale okutulur", d: "veya bağlantıdaki butona basılır" },
      { t: "Kapı açılır", d: "geçiş kayda düşer" },
    ],
    feedTitle: "Kayıt: her geçiş görünür",
    feedLead: "Olaylar hem sakine hem yönetim şirketine ulaşır.",
    feed: [
      { t: "4. blok kapısı açıldı", d: "Aziz · bugün, 18:49", icon: "door" },
      { t: "Diafon araması", d: "yan kapı · bugün, 18:12", icon: "call" },
      { t: "Misafir geldi — kurye", d: "QR geçiş · bugün, 17:30", icon: "guest" },
    ],
    tableTitle: "Yönetim şirketinde ne değişiyor",
    colWas: "Önce",
    colNow: "Sonra",
    rows: [
      { was: "Talepler deftere ve özel sohbetlere yazılıyor", now: "Aşamalı talep: alındı, işlemde, sorumlu, sakinin puanı" },
      { was: "Anahtar ve kumandalar kayboluyor, parayla yenileniyor", now: "Yetki panelden saniyede veriliyor ve geri alınıyor" },
      { was: "Kimin girdiği bilinmiyor", now: "Geçiş kaydı: kim, nereye, ne zaman ve neyle açtı" },
      { was: "Faturalar elden dağıtılıyor", now: "Tahakkuklar uygulamada, ödeme Click ile" },
    ],
  },
  zh: {
    flowTitle: "访客如何进门",
    flowLead: "住户自己发放通行证，无需给调度打电话。",
    flow: [
      { t: "住户创建通行证", d: "按单次到访或按有效期" },
      { t: "访客收到链接", d: "内含按钮与二维码" },
      { t: "二维码对准终端", d: "或直接点击链接中的按钮" },
      { t: "门已打开", d: "本次通行记入日志" },
    ],
    feedTitle: "日志：每次通行都可见",
    feedLead: "事件同时推送给住户和物业后台。",
    feed: [
      { t: "4 号单元门已开", d: "阿齐兹 · 今天 18:49", icon: "door" },
      { t: "可视对讲来电", d: "边门 · 今天 18:12", icon: "call" },
      { t: "访客到达 — 快递员", d: "二维码通行证 · 今天 17:30", icon: "guest" },
    ],
    tableTitle: "物业公司会有什么变化",
    colWas: "以前",
    colNow: "现在",
    rows: [
      { was: "报修写在本子和私人聊天里", now: "报修带流程：已受理、处理中、负责人、住户评分" },
      { was: "钥匙和门禁卡易丢失，补办要花钱", now: "权限在后台一秒内发放与收回" },
      { was: "谁进过楼无从得知", now: "通行日志：谁、去哪里、何时、用什么方式开门" },
      { was: "账单靠人工派送", now: "账单在应用内，通过 Click 支付" },
    ],
  },
};

export const DAVOMAT_EXTRAS: Record<string, DavomatExtras> = {
  ru: {
    chartsTitle: "Что видно руководителю",
    chartsLead: "Пример отчётов: во сколько приходят на работу и где копятся опоздания.",
    arrival: { title: "Приход по времени", labels: ["8:30", "8:45", "9:00", "9:15", "9:30", "позже"], values: [22, 48, 96, 64, 30, 14], hi: 2 },
    late: { title: "Опоздания за месяц", labels: ["офис", "склад", "цех", "охрана", "сервис"], values: [34, 20, 88, 46, 26], hi: 2 },
  },
  uz: {
    chartsTitle: "Rahbar nimani koʻradi",
    chartsLead: "Hisobot namunasi: ishga qachon kelishadi va kechikish qayerda toʻplanadi.",
    arrival: { title: "Kelish vaqti", labels: ["8:30", "8:45", "9:00", "9:15", "9:30", "keyinroq"], values: [22, 48, 96, 64, 30, 14], hi: 2 },
    late: { title: "Oylik kechikishlar", labels: ["ofis", "ombor", "sex", "qorovul", "servis"], values: [34, 20, 88, 46, 26], hi: 2 },
  },
  en: {
    chartsTitle: "What the manager sees",
    chartsLead: "Sample reports: when people arrive and where late arrivals pile up.",
    arrival: { title: "Arrival time", labels: ["8:30", "8:45", "9:00", "9:15", "9:30", "later"], values: [22, 48, 96, 64, 30, 14], hi: 2 },
    late: { title: "Late arrivals this month", labels: ["office", "warehouse", "shop floor", "security", "service"], values: [34, 20, 88, 46, 26], hi: 2 },
  },
  tr: {
    chartsTitle: "Yönetici ne görüyor",
    chartsLead: "Örnek raporlar: işe kaçta geliniyor ve geç kalmalar nerede birikiyor.",
    arrival: { title: "Geliş saati", labels: ["8:30", "8:45", "9:00", "9:15", "9:30", "sonra"], values: [22, 48, 96, 64, 30, 14], hi: 2 },
    late: { title: "Ay içindeki geç kalmalar", labels: ["ofis", "depo", "atölye", "güvenlik", "servis"], values: [34, 20, 88, 46, 26], hi: 2 },
  },
  zh: {
    chartsTitle: "管理者能看到什么",
    chartsLead: "报表示例：员工何时到岗，以及迟到集中在哪个部门。",
    arrival: { title: "到岗时间", labels: ["8:30", "8:45", "9:00", "9:15", "9:30", "更晚"], values: [22, 48, 96, 64, 30, 14], hi: 2 },
    late: { title: "本月迟到", labels: ["办公室", "仓库", "车间", "保安", "服务"], values: [34, 20, 88, 46, 26], hi: 2 },
  },
};

export const HUB_EXTRAS: Record<string, HubExtras> = {
  ru: {
    schemeTitle: "Как это работает на объекте",
    schemeLead: "Приложение не заменяет технику, а управляет той, что уже стоит.",
    nodes: [
      { t: "Техника объекта", d: "домофон, терминал лиц, шлагбаум" },
      { t: "Шлюз на месте", d: "небольшой блок в щитовой" },
      { t: "Сервер в Узбекистане", d: "данные остаются в стране" },
      { t: "Телефон и кабинет", d: "житель, сотрудник, управляющая компания" },
    ],
    brandsTitle: "С чем работает",
    brands: ["Домофоны Hikvision", "Терминалы лиц Dahua", "Контроллеры и турникеты ZKTeco", "Шлагбаумы по сухому контакту", "Оплата через Click"],
  },
  uz: {
    schemeTitle: "Obyektda qanday ishlaydi",
    schemeLead: "Ilova texnikani almashtirmaydi, balki allaqachon turgan texnikani boshqaradi.",
    nodes: [
      { t: "Obyekt texnikasi", d: "domofon, yuz terminali, shlagbaum" },
      { t: "Joydagi shlyuz", d: "shchitovoydagi kichik blok" },
      { t: "Oʻzbekistondagi server", d: "maʼlumot mamlakat ichida qoladi" },
      { t: "Telefon va kabinet", d: "aholi, xodim, boshqaruv kompaniyasi" },
    ],
    brandsTitle: "Nima bilan ishlaydi",
    brands: ["Hikvision domofonlari", "Dahua yuz terminallari", "ZKTeco kontrollerlari va turniketlari", "Quruq kontakt orqali shlagbaumlar", "Click orqali toʻlov"],
  },
  en: {
    schemeTitle: "How it works on site",
    schemeLead: "The app does not replace the hardware — it drives what is already installed.",
    nodes: [
      { t: "Hardware on site", d: "intercom, face terminal, barrier" },
      { t: "Local gateway", d: "a small box in the switchboard room" },
      { t: "Server in Uzbekistan", d: "data stays in the country" },
      { t: "Phone and dashboard", d: "resident, employee, management company" },
    ],
    brandsTitle: "What it works with",
    brands: ["Hikvision intercoms", "Dahua face terminals", "ZKTeco controllers and turnstiles", "Barriers via dry contact", "Payments through Click"],
  },
  tr: {
    schemeTitle: "Sahada nasıl çalışıyor",
    schemeLead: "Uygulama donanımın yerini almaz, hâlihazırda kurulu olanı yönetir.",
    nodes: [
      { t: "Sahadaki donanım", d: "diafon, yüz terminali, bariyer" },
      { t: "Yerel ağ geçidi", d: "pano odasındaki küçük kutu" },
      { t: "Özbekistan’daki sunucu", d: "veriler ülke içinde kalır" },
      { t: "Telefon ve panel", d: "sakin, çalışan, yönetim şirketi" },
    ],
    brandsTitle: "Nelerle çalışıyor",
    brands: ["Hikvision diafonlar", "Dahua yüz terminalleri", "ZKTeco kontrolörler ve turnikeler", "Kuru kontakla bariyerler", "Click ile ödeme"],
  },
  zh: {
    schemeTitle: "在现场如何运作",
    schemeLead: "应用不替换设备，而是驱动现场已安装的设备。",
    nodes: [
      { t: "现场设备", d: "可视对讲、人脸终端、道闸" },
      { t: "本地网关", d: "配电间里的小型盒子" },
      { t: "乌兹别克斯坦服务器", d: "数据留在境内" },
      { t: "手机与后台", d: "住户、员工、物业公司" },
    ],
    brandsTitle: "可对接的设备",
    brands: ["海康威视可视对讲", "大华人脸终端", "ZKTeco 控制器与闸机", "干接点控制的道闸", "通过 Click 支付"],
  },
};

/** Подписи врезок внутри статей блога. */
export const ARTICLE_UI: Record<string, { summary: string; more: string }> = {
  ru: { summary: "Коротко", more: "Смотреть приложение" },
  uz: { summary: "Qisqacha", more: "Ilovani koʻrish" },
  en: { summary: "In short", more: "See the app" },
  tr: { summary: "Kısaca", more: "Uygulamayı gör" },
  zh: { summary: "要点", more: "查看应用" },
};
