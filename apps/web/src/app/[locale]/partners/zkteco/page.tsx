import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { getProducts } from "@/lib/api";
import { resolveImageUrl } from "@/lib/image";

const locPath = (locale: string, p: string) => (locale === "ru" ? p : `/${locale}${p}`);

type Row = { f: string; zk: string; hik: string };
type Block = {
  badge: string; h1: string; lead: string; title: string; metaDesc: string;
  stats: { v: string; l: string }[];
  sections: { h: string; p: string[] }[];
  cases: { h: string; t: string }[];
  cmpTitle: string; cmpLead: string; cmpCols: [string, string, string]; cmp: Row[]; cmpNote: string;
  equipTitle: string; priceOnReq: string; allProducts: string;
  ctaTitle: string; ctaText: string; ctaBtn: string;
};

// Тексты держим в файле, как на странице H3C: их немного, а править партнёрскую
// страницу удобнее целиком, чем собирать по ключам из пяти JSON.
const D: Record<string, Block> = {
  ru: {
    badge: "Партнёр ZKTeco",
    h1: "ZKTeco в Узбекистане: СКУД, турникеты и шлагбаумы под ключ",
    lead: "SAT Solutions — партнёр ZKTeco: поставляем, проектируем и монтируем системы контроля доступа целиком — от терминала на двери до шлагбаума на въезде. Всё оборудование одного производителя и работает в одной программе, а не связкой из четырёх разных.",
    title: "ZKTeco в Ташкенте — СКУД, турникеты, шлагбаумы под ключ | SAT Solutions",
    metaDesc: "Партнёр ZKTeco в Узбекистане: турникеты, шлагбаумы, биометрические терминалы, распознавание номеров и парковка на единой платформе ZKBio CVSecurity. Проектирование, монтаж, интеграция и сервис в Ташкенте.",
    stats: [
      { v: "100+", l: "стран присутствия" },
      { v: "950+", l: "инженеров R&D" },
      { v: "5", l: "центров разработки" },
      { v: "топ-17", l: "мировых охранных компаний" },
    ],
    sections: [
      {
        h: "Полный цикл СКУД от одного производителя",
        p: [
          "Турникеты всех типов — триподы, стеклянные калитки, флап-барьеры, полноростовые. Шлагбаумы от бытовых до скоростных на сервоприводе. Биометрические терминалы, контроллеры, считыватели, электронные замки. Камеры распознавания номеров, UHF-считыватели дальнего действия, тикет-боксы и парковочные барьеры.",
          "Всё это ZKTeco разрабатывает и производит сам. На объекте это значит одну гарантию вместо четырёх, один сервис и отсутствие вопроса «чьё оборудование виновато», когда что-то не срабатывает на стыке.",
        ],
      },
      {
        h: "Шлагбаум и турникет — в одной системе, а не рядом друг с другом",
        p: [
          "Обычно проходная и въезд живут отдельно: своя программа для людей, своя для транспорта, и списки сотрудников ведутся дважды. У ZKTeco всё сходится в платформе ZKBio CVSecurity — турникеты, шлагбаумы, терминалы на дверях, лифты, парковка и видео управляются из одного окна.",
          "Права выдаются человеку и его машине одновременно: сотрудник уволился — пропуск и номер автомобиля перестают работать в один клик. Есть API, поэтому систему можно связать с 1С, кадровым учётом и вашей CRM: приняли человека — доступ появился автоматически.",
        ],
      },
      {
        h: "Один пропуск на всё, включая QR-код",
        p: [
          "Проход подтверждается как удобно: лицом, ладонью, отпечатком, картой, QR-кодом или телефоном по NFC. Один и тот же идентификатор работает и на турникете в холле, и на шлагбауме на въезде.",
          "QR удобен для гостей и подрядчиков: пропуск отправляется в мессенджер, действует ограниченное время и открывает ровно те точки, которые разрешены — включая въезд на парковку. Не нужно печатать бумажные пропуска и выдавать карты, которые потом не возвращают.",
        ],
      },
      {
        h: "Что делаем мы",
        p: [
          "Обследование объекта и проект: сколько точек, где проходят трассы, какая пропускная способность нужна. Поставка оборудования, монтаж, пусконаладка и настройка платформы. Обучение вашей охраны и кадровой службы, интеграция с 1С и CRM, гарантия и сервис в Ташкенте.",
          "Отдельно считаем стоимость монтажных работ — можно прикинуть бюджет заранее в калькуляторе на сайте.",
        ],
      },
    ],
    cases: [
      { h: "Бизнес-центр", t: "Турникеты в холле, шлагбаум на паркинге, гостевые QR-пропуска и учёт рабочего времени арендаторов." },
      { h: "Жилой комплекс", t: "Въезд по распознаванию номера, калитки для жильцов, домофония и доступ к подъездам с телефона." },
      { h: "Завод и склад", t: "Полноростовые турникеты на периметре, учёт смен, весовой контроль транспорта и разграничение цехов." },
      { h: "Школа и вуз", t: "Триподы на входе, уведомление родителям о приходе ребёнка, доступ в лаборатории по расписанию." },
      { h: "Платная парковка", t: "Распознавание номеров, тикет-боксы, барьеры и тарификация — без оператора на въезде." },
    ],
    cmpTitle: "ZKTeco или Hikvision: что выбрать для СКУД",
    cmpLead: "Оба бренда рабочие, но сильны в разном. Коротко и честно, чтобы вы понимали, за что платите.",
    cmpCols: ["Что сравниваем", "ZKTeco", "Hikvision"],
    cmp: [
      { f: "Профиль компании", zk: "Биометрия и контроль доступа — основной бизнес", hik: "Видеонаблюдение — основной бизнес" },
      { f: "Турникеты, шлагбаумы, терминалы", zk: "Своё производство, единая линейка", hik: "Есть, но связка более модульная" },
      { f: "Единая платформа", zk: "ZKBio CVSecurity: доступ, транспорт, парковка, лифты, видео", hik: "Управление через свои модули, часть задач — сторонними" },
      { f: "Биометрия", zk: "Лицо, ладонь, отпечаток — собственные алгоритмы", hik: "Лицо, отпечаток" },
      { f: "QR и мобильный пропуск", zk: "Сквозной: двери, турникеты, шлагбаум", hik: "Поддерживается" },
      { f: "Видеонаблюдение", zk: "Есть, но это не профиль бренда", hik: "Сильная сторона, широкая линейка" },
      { f: "Ограничения в госзакупках США и ЕС", zk: "Не применяются", hik: "Действуют, важно для проектов с внешним аудитом" },
    ],
    cmpNote: "Если на объекте уже стоит видеонаблюдение Hikvision, их биометрия ляжет в ту же экосистему проще — мы это скажем прямо и не будем навязывать замену. Если СКУД строится с нуля и нужно, чтобы люди и транспорт жили в одной системе, ZKTeco выгоднее.",
    equipTitle: "Оборудование ZKTeco в наличии и под заказ",
    priceOnReq: "Цена по запросу",
    allProducts: "Весь каталог ZKTeco",
    ctaTitle: "Нужен проект на оборудовании ZKTeco?",
    ctaText: "Посчитаем количество точек, подберём модели под задачу и подготовим спецификацию. Выезд инженера по Ташкенту — бесплатно.",
    ctaBtn: "Обсудить проект",
  },

  uz: {
    badge: "ZKTeco hamkori",
    h1: "O'zbekistonda ZKTeco: SKUD, turniketlar va shlagbaumlar kalit topshirish sharti bilan",
    lead: "SAT Solutions — ZKTeco hamkori: kirish nazorati tizimlarini to'liq yetkazib beramiz, loyihalaymiz va o'rnatamiz — eshikdagi terminaldan kiraverishdagi shlagbaumgacha. Barcha uskunalar bitta ishlab chiqaruvchiniki va bitta dasturda ishlaydi.",
    title: "Toshkentda ZKTeco — SKUD, turniket, shlagbaum | SAT Solutions",
    metaDesc: "O'zbekistonda ZKTeco hamkori: turniketlar, shlagbaumlar, biometrik terminallar, raqam tanish va parkovka yagona ZKBio CVSecurity platformasida. Loyihalash, montaj, integratsiya va Toshkentda servis.",
    stats: [
      { v: "100+", l: "davlatda faoliyat" },
      { v: "950+", l: "R&D muhandisi" },
      { v: "5", l: "ishlab chiqish markazi" },
      { v: "top-17", l: "jahon xavfsizlik kompaniyalari" },
    ],
    sections: [
      {
        h: "Bitta ishlab chiqaruvchidan to'liq SKUD tsikli",
        p: [
          "Barcha turdagi turniketlar — tripodlar, shisha qanotli swing, flap-barerlar, to'liq bo'yli. Maishiydan servoprivodli tezkorgacha shlagbaumlar. Biometrik terminallar, kontrollerlar, o'quvchilar, elektron qulflar. Raqam tanish kameralari, uzoq masofali UHF o'quvchilar, tikit-bokslar va parkovka barerlari.",
          "Bularning barchasini ZKTeco o'zi ishlab chiqadi. Obyektda bu to'rtta emas, bitta kafolat va bitta servis degani.",
        ],
      },
      {
        h: "Shlagbaum va turniket — yonma-yon emas, bitta tizimda",
        p: [
          "Odatda o'tish nuqtasi va kiraverish alohida yashaydi: odamlar uchun bir dastur, transport uchun boshqasi. ZKTecoda hammasi ZKBio CVSecurity platformasida birlashadi — turniketlar, shlagbaumlar, eshik terminallari, liftlar, parkovka va video bitta oynadan boshqariladi.",
          "Huquqlar odamga va uning avtomobiliga bir vaqtda beriladi: xodim ishdan bo'shadi — propusk ham, avtomobil raqami ham bir bosishda ishlamay qoladi. API bor, shuning uchun tizimni 1C, kadrlar hisobi va CRM bilan bog'lash mumkin.",
        ],
      },
      {
        h: "Hamma narsaga bitta propusk, jumladan QR-kod",
        p: [
          "O'tish qulay tarzda tasdiqlanadi: yuz, kaft, barmoq izi, karta, QR-kod yoki NFC orqali telefon. Bir xil identifikator holldagi turniketda ham, kiraverishdagi shlagbaumda ham ishlaydi.",
          "QR mehmonlar va pudratchilar uchun qulay: propusk messenjerga yuboriladi, cheklangan vaqt amal qiladi va faqat ruxsat etilgan nuqtalarni ochadi — parkovkaga kirish ham shunga kiradi.",
        ],
      },
      {
        h: "Biz nima qilamiz",
        p: [
          "Obyektni ko'rish va loyiha: nechta nuqta, trassalar qayerdan o'tadi, qanday o'tkazuvchanlik kerak. Uskuna yetkazib berish, montaj, ishga tushirish va platformani sozlash. Xodimlaringizni o'qitish, 1C va CRM bilan integratsiya, Toshkentda kafolat va servis.",
          "Montaj ishlari narxini alohida hisoblaymiz — byudjetni saytdagi kalkulyatorda oldindan chamalash mumkin.",
        ],
      },
    ],
    cases: [
      { h: "Biznes-markaz", t: "Holldagi turniketlar, parkingdagi shlagbaum, mehmon QR-propusklari va ijarachilar ish vaqtini hisobga olish." },
      { h: "Turar-joy majmuasi", t: "Raqam tanish orqali kirish, aholi uchun kalitkalar, domofon va telefondan podyezdga kirish." },
      { h: "Zavod va ombor", t: "Perimetrda to'liq bo'yli turniketlar, smenalarni hisobga olish, transport nazorati va sexlarni ajratish." },
      { h: "Maktab va OTM", t: "Kiraverishda tripodlar, ota-onaga bola kelgani haqida xabar, laboratoriyalarga jadval bo'yicha kirish." },
      { h: "Pullik parkovka", t: "Raqam tanish, tikit-bokslar, barerlar va tariflash — kiraverishda operatorsiz." },
    ],
    cmpTitle: "SKUD uchun ZKTeco yoki Hikvision",
    cmpLead: "Ikkala brend ham ishlaydi, lekin turli sohada kuchli. Qisqa va halol.",
    cmpCols: ["Nimani solishtiramiz", "ZKTeco", "Hikvision"],
    cmp: [
      { f: "Kompaniya profili", zk: "Biometriya va kirish nazorati — asosiy biznes", hik: "Videokuzatuv — asosiy biznes" },
      { f: "Turniket, shlagbaum, terminal", zk: "O'z ishlab chiqarishi, yagona liniya", hik: "Bor, lekin bog'lanish ko'proq modulli" },
      { f: "Yagona platforma", zk: "ZKBio CVSecurity: kirish, transport, parkovka, lift, video", hik: "O'z modullari orqali, bir qismi uchinchi tomon" },
      { f: "Biometriya", zk: "Yuz, kaft, barmoq izi — o'z algoritmlari", hik: "Yuz, barmoq izi" },
      { f: "QR va mobil propusk", zk: "Uzluksiz: eshik, turniket, shlagbaum", hik: "Qo'llab-quvvatlanadi" },
      { f: "Videokuzatuv", zk: "Bor, lekin brend profili emas", hik: "Kuchli tomoni, keng liniya" },
      { f: "AQSh va Yevropa davlat xaridlaridagi cheklovlar", zk: "Qo'llanilmaydi", hik: "Amal qiladi, tashqi auditli loyihalarda muhim" },
    ],
    cmpNote: "Agar obyektda allaqachon Hikvision videokuzatuvi bo'lsa, ularning biometriyasi o'sha ekotizimga osonroq tushadi — buni to'g'ridan-to'g'ri aytamiz. Agar SKUD noldan qurilsa va odamlar bilan transport bitta tizimda bo'lishi kerak bo'lsa, ZKTeco foydaliroq.",
    equipTitle: "ZKTeco uskunalari mavjud va buyurtma bo'yicha",
    priceOnReq: "Narxi so'rov bo'yicha",
    allProducts: "Butun ZKTeco katalogi",
    ctaTitle: "ZKTeco uskunasida loyiha kerakmi?",
    ctaText: "Nuqtalar sonini hisoblaymiz, vazifaga mos modellarni tanlaymiz va spetsifikatsiya tayyorlaymiz. Toshkent bo'ylab muhandis chiqishi — bepul.",
    ctaBtn: "Loyihani muhokama qilish",
  },

  en: {
    badge: "ZKTeco partner",
    h1: "ZKTeco in Uzbekistan: access control, turnstiles and barriers turnkey",
    lead: "SAT Solutions is a ZKTeco partner: we supply, design and install complete access control — from the door terminal to the barrier at the gate. All hardware comes from one manufacturer and runs in one piece of software, not a bundle of four.",
    title: "ZKTeco in Tashkent — access control, turnstiles, barriers | SAT Solutions",
    metaDesc: "ZKTeco partner in Uzbekistan: turnstiles, barrier gates, biometric terminals, plate recognition and parking on the single ZKBio CVSecurity platform. Design, installation, integration and service in Tashkent.",
    stats: [
      { v: "100+", l: "countries covered" },
      { v: "950+", l: "R&D engineers" },
      { v: "5", l: "R&D centres" },
      { v: "top-17", l: "global security companies" },
    ],
    sections: [
      {
        h: "A complete access control line from one manufacturer",
        p: [
          "Turnstiles of every type — tripods, glass swing barriers, flap barriers, full-height. Barrier gates from basic to high-speed servo models. Biometric terminals, controllers, readers, electronic locks. Plate recognition cameras, long-range UHF readers, ticket boxes and parking barriers.",
          "ZKTeco develops and manufactures all of it. On site that means one warranty instead of four, one service contact, and no argument about whose device failed at the seam between systems.",
        ],
      },
      {
        h: "The barrier and the turnstile in one system, not side by side",
        p: [
          "Usually the entrance lobby and the vehicle gate live apart: one program for people, another for cars, and staff lists maintained twice. With ZKTeco everything meets in ZKBio CVSecurity — turnstiles, barriers, door terminals, lifts, parking and video are managed from a single screen.",
          "Rights are granted to a person and their car at once: when an employee leaves, both the pass and the plate stop working in one click. There is an API, so the system links to your ERP, HR records and CRM.",
        ],
      },
      {
        h: "One credential for everything, QR code included",
        p: [
          "Passage is confirmed whichever way suits: face, palm, fingerprint, card, QR code or phone over NFC. The same credential works at the lobby turnstile and at the vehicle barrier.",
          "QR suits guests and contractors: the pass is sent to a messenger, lives for a limited time and opens exactly the points allowed — including the parking entrance.",
        ],
      },
      {
        h: "What we do",
        p: [
          "Site survey and design: how many points, where the routes run, what throughput is needed. Supply, installation, commissioning and platform setup. Training for your security and HR teams, integration with ERP and CRM, warranty and service in Tashkent.",
          "Installation work is priced separately — you can estimate the budget in advance with the calculator on this site.",
        ],
      },
    ],
    cases: [
      { h: "Business centre", t: "Turnstiles in the lobby, a barrier at the car park, guest QR passes and tenant time tracking." },
      { h: "Residential complex", t: "Plate-recognition entry, resident gates, door entry and access from a phone." },
      { h: "Plant and warehouse", t: "Full-height turnstiles on the perimeter, shift tracking, vehicle control and zoning between workshops." },
      { h: "School and university", t: "Tripods at the entrance, notification to parents on arrival, lab access by timetable." },
      { h: "Paid parking", t: "Plate recognition, ticket boxes, barriers and tariffs — with no operator at the gate." },
    ],
    cmpTitle: "ZKTeco or Hikvision for access control",
    cmpLead: "Both brands work, but they are strong in different things. Short and honest, so you know what you pay for.",
    cmpCols: ["Criterion", "ZKTeco", "Hikvision"],
    cmp: [
      { f: "Company focus", zk: "Biometrics and access control is the core business", hik: "Video surveillance is the core business" },
      { f: "Turnstiles, barriers, terminals", zk: "In-house manufacturing, one product line", hik: "Available, but the stack is more modular" },
      { f: "Single platform", zk: "ZKBio CVSecurity: access, vehicles, parking, lifts, video", hik: "Own modules, some tasks via third parties" },
      { f: "Biometrics", zk: "Face, palm, fingerprint — in-house algorithms", hik: "Face, fingerprint" },
      { f: "QR and mobile credentials", zk: "End-to-end: doors, turnstiles, barrier", hik: "Supported" },
      { f: "Video surveillance", zk: "Available, but not the brand's focus", hik: "Its strong side, wide range" },
      { f: "US and EU public procurement limits", zk: "Not applicable", hik: "In force; matters for externally audited projects" },
    ],
    cmpNote: "If the site already runs Hikvision video, their biometrics will fit that ecosystem more easily — we will say so directly instead of pushing a replacement. If access control is built from scratch and people and vehicles must live in one system, ZKTeco is the better buy.",
    equipTitle: "ZKTeco equipment in stock and to order",
    priceOnReq: "Price on request",
    allProducts: "Full ZKTeco catalogue",
    ctaTitle: "Planning a project on ZKTeco equipment?",
    ctaText: "We will count the points, pick models for the task and prepare a specification. Engineer visit within Tashkent is free.",
    ctaBtn: "Discuss the project",
  },

  tr: {
    badge: "ZKTeco iş ortağı",
    h1: "Özbekistan'da ZKTeco: geçiş kontrol, turnike ve bariyer anahtar teslim",
    lead: "SAT Solutions ZKTeco iş ortağıdır: geçiş kontrol sistemlerini baştan sona sağlar, projelendirir ve kurar — kapıdaki terminalden girişteki bariyere kadar. Tüm donanım tek üreticiye ait ve tek yazılımda çalışır.",
    title: "Taşkent'te ZKTeco — geçiş kontrol, turnike, bariyer | SAT Solutions",
    metaDesc: "Özbekistan'da ZKTeco iş ortağı: turnikeler, bariyerler, biyometrik terminaller, plaka tanıma ve otopark tek ZKBio CVSecurity platformunda. Projelendirme, montaj, entegrasyon ve Taşkent'te servis.",
    stats: [
      { v: "100+", l: "ülkede faaliyet" },
      { v: "950+", l: "Ar-Ge mühendisi" },
      { v: "5", l: "Ar-Ge merkezi" },
      { v: "top-17", l: "küresel güvenlik şirketi" },
    ],
    sections: [
      {
        h: "Tek üreticiden eksiksiz geçiş kontrol hattı",
        p: [
          "Her tipte turnike — tripedler, cam kanatlı swing, flap bariyerler, tam boy. Temel modelden servo motorlu hızlı modellere kadar bariyerler. Biyometrik terminaller, kontrol panelleri, okuyucular, elektronik kilitler. Plaka tanıma kameraları, uzun menzilli UHF okuyucular, bilet kutuları ve otopark bariyerleri.",
          "Bunların tamamını ZKTeco kendisi geliştirip üretir. Sahada bu, dört yerine tek garanti ve tek servis demektir.",
        ],
      },
      {
        h: "Bariyer ve turnike yan yana değil, tek sistemde",
        p: [
          "Genelde giriş holü ile araç girişi ayrı yaşar: insanlar için bir program, araçlar için başka biri. ZKTeco'da her şey ZKBio CVSecurity'de buluşur — turnikeler, bariyerler, kapı terminalleri, asansörler, otopark ve video tek ekrandan yönetilir.",
          "Yetki kişiye ve aracına aynı anda verilir: personel ayrıldığında hem kart hem plaka tek tıkla devre dışı kalır. API sayesinde sistem ERP, İK kayıtları ve CRM ile bağlanır.",
        ],
      },
      {
        h: "Her şey için tek kimlik, QR kod dahil",
        p: [
          "Geçiş istediğiniz yöntemle doğrulanır: yüz, avuç içi, parmak izi, kart, QR kod veya NFC ile telefon. Aynı kimlik hem lobideki turnikede hem girişteki bariyerde çalışır.",
          "QR misafirler ve taşeronlar için pratiktir: kart mesajla gönderilir, sınırlı süre geçerlidir ve yalnızca izin verilen noktaları açar — otopark girişi dahil.",
        ],
      },
      {
        h: "Biz ne yapıyoruz",
        p: [
          "Saha keşfi ve proje: kaç nokta, güzergâhlar nereden geçecek, hangi kapasite gerekli. Tedarik, montaj, devreye alma ve platform kurulumu. Güvenlik ve İK ekibinize eğitim, ERP ve CRM entegrasyonu, Taşkent'te garanti ve servis.",
          "Montaj işçiliğini ayrıca hesaplıyoruz — bütçeyi sitedeki hesaplayıcıyla önceden görebilirsiniz.",
        ],
      },
    ],
    cases: [
      { h: "İş merkezi", t: "Lobide turnikeler, otoparkta bariyer, misafir QR kartları ve kiracı mesai takibi." },
      { h: "Konut sitesi", t: "Plaka tanımayla giriş, sakinler için kapılar, diafon ve telefondan erişim." },
      { h: "Fabrika ve depo", t: "Çevrede tam boy turnikeler, vardiya takibi, araç kontrolü ve bölüm ayrımı." },
      { h: "Okul ve üniversite", t: "Girişte tripedler, veliye geliş bildirimi, laboratuvara programa göre erişim." },
      { h: "Ücretli otopark", t: "Plaka tanıma, bilet kutuları, bariyerler ve ücretlendirme — girişte operatör olmadan." },
    ],
    cmpTitle: "Geçiş kontrol için ZKTeco mu Hikvision mu",
    cmpLead: "İki marka da çalışır ama farklı alanlarda güçlü. Kısa ve dürüst.",
    cmpCols: ["Karşılaştırma", "ZKTeco", "Hikvision"],
    cmp: [
      { f: "Şirket odağı", zk: "Biyometri ve geçiş kontrol ana iş", hik: "Video güvenlik ana iş" },
      { f: "Turnike, bariyer, terminal", zk: "Kendi üretimi, tek ürün hattı", hik: "Var, ancak yapı daha modüler" },
      { f: "Tek platform", zk: "ZKBio CVSecurity: geçiş, araç, otopark, asansör, video", hik: "Kendi modülleri, bazı işler üçüncü taraf" },
      { f: "Biyometri", zk: "Yüz, avuç içi, parmak izi — kendi algoritmaları", hik: "Yüz, parmak izi" },
      { f: "QR ve mobil kimlik", zk: "Uçtan uca: kapı, turnike, bariyer", hik: "Destekleniyor" },
      { f: "Video güvenlik", zk: "Var, ancak markanın odağı değil", hik: "Güçlü yanı, geniş ürün gamı" },
      { f: "ABD ve AB kamu alım kısıtları", zk: "Uygulanmıyor", hik: "Yürürlükte; dış denetimli projelerde önemli" },
    ],
    cmpNote: "Sahada halihazırda Hikvision video varsa, onların biyometrisi o ekosisteme daha kolay oturur — bunu açıkça söyleriz. Geçiş kontrol sıfırdan kuruluyorsa ve insanlarla araçlar tek sistemde olmalıysa ZKTeco daha avantajlıdır.",
    equipTitle: "Stokta ve siparişe özel ZKTeco ekipmanları",
    priceOnReq: "Fiyat için sorun",
    allProducts: "Tüm ZKTeco kataloğu",
    ctaTitle: "ZKTeco ekipmanıyla proje mi planlıyorsunuz?",
    ctaText: "Nokta sayısını çıkarır, göreve uygun modelleri seçer ve şartname hazırlarız. Taşkent içi keşif ücretsizdir.",
    ctaBtn: "Projeyi görüşelim",
  },

  zh: {
    badge: "ZKTeco 合作伙伴",
    h1: "ZKTeco 在乌兹别克斯坦：门禁、闸机与道闸一站式交付",
    lead: "SAT Solutions 是 ZKTeco 的合作伙伴：从门口终端到入口道闸，我们提供完整门禁系统的供货、设计与安装。全部设备出自同一厂商，并在同一套软件中运行，而非四套系统拼接。",
    title: "塔什干 ZKTeco — 门禁、闸机、道闸一站式 | SAT Solutions",
    metaDesc: "ZKTeco 在乌兹别克斯坦的合作伙伴：闸机、道闸、生物识别终端、车牌识别与停车场，统一接入 ZKBio CVSecurity 平台。塔什干提供设计、安装、集成与售后。",
    stats: [
      { v: "100+", l: "覆盖国家和地区" },
      { v: "950+", l: "研发工程师" },
      { v: "5", l: "研发中心" },
      { v: "前 17", l: "全球安防企业" },
    ],
    sections: [
      {
        h: "同一厂商的完整门禁产品线",
        p: [
          "各类闸机——三辊闸、玻璃摆闸、翼闸、全高闸。道闸从基础型到伺服高速型。生物识别终端、控制器、读头、电子锁。车牌识别摄像机、远距离 UHF 读头、出票机与停车位锁。",
          "以上均由 ZKTeco 自行研发生产。落到项目上，这意味着一份质保而非四份，一个售后入口，出现故障时不必在不同厂商之间扯皮。",
        ],
      },
      {
        h: "道闸与闸机在同一系统内，而不是各自为政",
        p: [
          "通常人行通道与车行入口彼此独立：人员一套程序，车辆另一套，名单要维护两遍。ZKTeco 将其统一到 ZKBio CVSecurity——闸机、道闸、门禁终端、电梯、停车场与视频在同一界面管理。",
          "权限同时授予人和其车辆：员工离职后，通行证与车牌一键失效。系统提供 API，可与 ERP、人事系统和 CRM 打通。",
        ],
      },
      {
        h: "一张通行凭证走遍全场，含二维码",
        p: [
          "通行方式任选：人脸、掌纹、指纹、刷卡、二维码或手机 NFC。同一凭证在大堂闸机与入口道闸同样有效。",
          "二维码适合访客与承包商：凭证发送到聊天软件，限时有效，且只开放被允许的点位，包括停车场入口。",
        ],
      },
      {
        h: "我们负责什么",
        p: [
          "现场勘察与设计：点位数量、线路走向、所需通行能力。设备供货、安装、调试与平台配置。对贵方安保与人事团队的培训，与 ERP、CRM 的集成，以及塔什干的质保与售后。",
          "安装施工费单独核算——可先用本站计算器估算预算。",
        ],
      },
    ],
    cases: [
      { h: "写字楼", t: "大堂闸机、停车场道闸、访客二维码通行与租户考勤。" },
      { h: "住宅小区", t: "车牌识别入场、住户通道、可视对讲与手机开门。" },
      { h: "工厂与仓库", t: "周界全高闸、班次考勤、车辆管控与车间分区。" },
      { h: "学校与高校", t: "入口三辊闸、学生到校通知家长、实验室按课表授权。" },
      { h: "收费停车场", t: "车牌识别、出票机、道闸与计费——入口无需人工值守。" },
    ],
    cmpTitle: "门禁选 ZKTeco 还是 Hikvision",
    cmpLead: "两个品牌都可用，但强项不同。以下说明简短且客观。",
    cmpCols: ["对比项", "ZKTeco", "Hikvision"],
    cmp: [
      { f: "公司主业", zk: "生物识别与门禁为核心业务", hik: "视频监控为核心业务" },
      { f: "闸机、道闸、终端", zk: "自主生产，统一产品线", hik: "具备，但组合更偏模块化" },
      { f: "统一平台", zk: "ZKBio CVSecurity：门禁、车辆、停车、电梯、视频", hik: "自有模块，部分功能依赖第三方" },
      { f: "生物识别", zk: "人脸、掌纹、指纹，自有算法", hik: "人脸、指纹" },
      { f: "二维码与手机凭证", zk: "全链路：门、闸机、道闸", hik: "支持" },
      { f: "视频监控", zk: "具备，但非品牌重心", hik: "强项，产品线丰富" },
      { f: "美欧公共采购限制", zk: "不适用", hik: "存在，涉外部审计项目需注意" },
    ],
    cmpNote: "若现场已部署 Hikvision 视频系统，其生物识别接入同一生态更顺畅——我们会如实告知，而不会强推更换。若门禁从零建设，且要求人与车在同一系统内管理，选择 ZKTeco 更划算。",
    equipTitle: "现货及可订购的 ZKTeco 设备",
    priceOnReq: "价格面议",
    allProducts: "ZKTeco 全部产品",
    ctaTitle: "打算采用 ZKTeco 设备做项目？",
    ctaText: "我们会核算点位、按需求选型并出具设备清单。塔什干市内工程师上门勘察免费。",
    ctaBtn: "沟通项目",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = D[locale] ?? D.en;
  return {
    title: { absolute: d.title },
    description: d.metaDesc,
    alternates: hreflangAlternates("/partners/zkteco", locale),
    openGraph: { title: d.title, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function ZKTecoPartnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = D[locale] ?? D.en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

  // Витрина: реальные карточки бренда из каталога. API упал — секцию не рисуем.
  let products: Awaited<ReturnType<typeof getProducts>>["items"] = [];
  try {
    const r = await getProducts(1, 12, { brand: "zkteco" });
    products = r.items ?? [];
  } catch {
    /* ignore */
  }

  const crumbHome = ({ ru: "Главная", uz: "Bosh sahifa", en: "Home", tr: "Ana sayfa", zh: "首页" } as Record<string, string>)[locale] ?? "Home";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumbHome, item: `${siteUrl}${locPath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: "ZKTeco", item: `${siteUrl}${locPath(locale, "/partners/zkteco")}` },
    ],
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: d.h1,
    description: d.metaDesc,
    url: `${siteUrl}${locPath(locale, "/partners/zkteco")}`,
    about: { "@type": "Brand", name: "ZKTeco" },
    provider: { "@type": "Organization", name: "SAT Solutions", url: siteUrl },
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />

      <div className="container-page py-8 sm:py-12">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">{d.badge}</span>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{d.h1}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-700 sm:text-base">{d.lead}</p>

        {/* цифры производителя */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {d.stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="text-2xl font-black text-brand-700">{s.v}</div>
              <div className="mt-1 text-[13px] leading-snug text-slate-600">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex max-w-3xl flex-col gap-8">
          {d.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{s.h}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {s.p.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-slate-700 sm:text-base">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* сценарии по типам объектов */}
        <section className="mt-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {d.cases.map((c, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-4">
                <div className="text-sm font-black text-slate-900">{c.h}</div>
                <p className="mt-1.5 text-[13px] leading-relaxed text-slate-600">{c.t}</p>
              </div>
            ))}
          </div>
        </section>

        {/* сравнение с Hikvision */}
        <section className="mt-14">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{d.cmpTitle}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{d.cmpLead}</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-2 pr-4">{d.cmpCols[0]}</th>
                  <th className="py-2 pr-4 text-brand-700">{d.cmpCols[1]}</th>
                  <th className="py-2">{d.cmpCols[2]}</th>
                </tr>
              </thead>
              <tbody>
                {d.cmp.map((r, i) => (
                  <tr key={i} className="border-b border-slate-100 align-top last:border-0">
                    <td className="py-3 pr-4 font-semibold text-slate-700">{r.f}</td>
                    <td className="py-3 pr-4 text-slate-800">{r.zk}</td>
                    <td className="py-3 text-slate-500">{r.hik}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13px] leading-relaxed text-slate-600">{d.cmpNote}</p>
        </section>

        {/* витрина каталога */}
        {products.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{d.equipTitle}</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((p: any) => (
                <Link key={p.id} href={`/products/${p.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-colors hover:border-brand-300">
                  <div className="flex h-36 items-center justify-center bg-white p-3">
                    {resolveImageUrl(p.coverImageUrl) ? (
                      <Image src={resolveImageUrl(p.coverImageUrl) as string} alt={p.name} width={180} height={130}
                        className="max-h-[124px] w-auto object-contain" />
                    ) : null}
                  </div>
                  <div className="border-t border-slate-100 p-3">
                    <div className="line-clamp-2 text-[13px] font-semibold text-slate-800 group-hover:text-brand-700">{p.name}</div>
                    <div className="mt-1 text-[12px] font-bold text-brand-700">
                      {Number(p.price) > 0 ? `${Math.round(Number(p.price)).toLocaleString("ru-RU")} ${locale === "ru" ? "сум" : "UZS"}` : d.priceOnReq}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/catalog/zkteco" className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-bold text-brand-800 hover:bg-brand-100">
              {d.allProducts} →
            </Link>
          </section>
        )}
      </div>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="container-page flex flex-col items-center gap-5 py-12 text-center sm:py-14">
          <h2 className="max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">{d.ctaTitle}</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-300">{d.ctaText}</p>
          <RequestQuoteButton label={d.ctaBtn} variant="brand" productName="Заявка со страницы партнёрства ZKTeco" />
        </div>
      </section>
    </div>
  );
}
