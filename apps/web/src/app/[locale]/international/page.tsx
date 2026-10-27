// Посадочная для иностранных компаний/инвесторов: security integrator для входящих в Узбекистан.
// Контент 5 локалей инлайном (EN — основной таргет: security company tashkent, cctv installation
// uzbekistan и т.п.; TR/ZH — турецкие подрядчики и китайские компании в УЗ). SEO: FAQPage + Service LD.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { withOgUrl } from "@/lib/metadata";

type Dict = {
  metaTitle: string; metaDesc: string;
  h1: string; intro: string;
  whyTitle: string; why: { t: string; d: string }[];
  servicesTitle: string; services: { t: string; d: string }[];
  faqTitle: string; faq: { q: string; a: string }[];
  // 27.10.2026: раздел «Поставка Hikvision и Dahua» — необязательный, ссылки на каталоги брендов
  supplyTitle?: string; supply?: string[]; supplyLinks?: { label: string; href: string }[];
  ctaTitle: string; ctaText: string; ctaButton: string; ctaCall: string;
};

const D: Record<string, Dict> = {
  en: {
    metaTitle: "Security Systems Integrator in Tashkent, Uzbekistan — CCTV, Fire Alarm, Access Control",
    metaDesc: "Licensed security systems contractor in Tashkent for international companies: CCTV installation, fire alarm systems, access control and turnstiles. English-speaking team, contracts for foreign legal entities, projects across Uzbekistan.",
    h1: "Security systems for international companies in Uzbekistan",
    intro: "SAT Solutions is a licensed security systems integrator based in Tashkent. We help international companies entering Uzbekistan — factories, warehouses, offices, hotels and retail — select, install and maintain CCTV, fire alarm and access control systems that meet local regulations. One contractor, full cycle: survey, equipment selection and layout, supply, installation, commissioning and service.",
    whyTitle: "Why international clients choose us",
    why: [
      { t: "Licensed for security & fire systems", d: "State licenses from the National Guard of Uzbekistan (security systems) and the Ministry of Emergency Situations (fire alarm and suppression). Your facility passes local inspections." },
      { t: "3 000+ products in stock in Tashkent", d: "Hikvision, Dahua, ZKTeco, TP-Link, Bolid, Rubezh and more — with our own warehouse, no long import lead times for standard equipment." },
      { t: "English-speaking project manager", d: "Specifications, BOQs, contracts and invoices in English for foreign legal entities. Payment by bank transfer, VAT documents provided." },
      { t: "Installations across Uzbekistan", d: "Installation teams work in Tashkent and travel to any region — SEZ and industrial parks included. References available on request." },
    ],
    servicesTitle: "What we deliver",
    services: [
      { t: "CCTV / video surveillance", d: "IP cameras, NVRs, video analytics, ANPR — equipment selection, layout and turnkey installation." },
      { t: "Fire alarm & suppression", d: "Addressable fire alarm (Rubezh, Bolid), voice evacuation, certified to local fire codes." },
      { t: "Access control & turnstiles", d: "Face recognition terminals, card and biometric access, turnstiles and barriers (ZKTeco, Hikvision)." },
      { t: "Networks & structured cabling", d: "LAN/SCS, Wi-Fi, server rooms — the infrastructure your systems run on." },
      { t: "Maintenance & SLA", d: "Scheduled service, spare parts from stock, response times fixed in contract." },
    ],
    supplyTitle: "Hikvision and Dahua supply in Uzbekistan",
    supply: [
      "SAT Solutions is a Hikvision and Dahua supplier in Tashkent with 700+ Hikvision and 270+ Dahua models in stock — IP and PTZ cameras, NVRs, thermal cameras, intercoms, access control terminals and turnstiles. Prices are published in UZS in the catalogue, stock is updated daily, and standard models ship from our Tashkent warehouse without import lead times.",
      "For international companies we supply equipment under contract with VAT documents in English, and the same engineers who install the systems configure and commission the cameras. Every unit carries the manufacturer's warranty; our own warranty on installation work is 3 years. Send us a bill of quantities or a floor plan and we will return a priced specification within one working day.",
    ],
    supplyLinks: [
      { label: "Hikvision catalogue: 700+ models with prices", href: "/catalog/hikvision" },
      { label: "Dahua catalogue: 270+ models with prices", href: "/catalog/dahua" },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Do you work with foreign legal entities?", a: "Yes. We sign contracts with foreign companies and local subsidiaries, issue invoices and full accounting documents. English versions of documents are provided." },
      { q: "Can you handle a turnkey installation outside Tashkent?", a: "Yes. Our teams install systems across Uzbekistan, including special economic zones and industrial parks. Equipment selection, supply, installation and commissioning by one contractor." },
      { q: "Are your fire alarm systems accepted by local authorities?", a: "Yes. We hold a Ministry of Emergency Situations license, install to Uzbek fire codes and support the facility during inspection." },
      { q: "How fast can we get a quotation?", a: "Send your floor plan or BOQ to sales@satsolutions.uz — a budget estimate is usually ready within 24 hours, an engineer site visit in Tashkent is free." },
    ],
    ctaTitle: "Start with a free site survey",
    ctaText: "Send your requirements or request a call — we reply within one business day.",
    ctaButton: "Contact us",
    ctaCall: "WhatsApp / Call: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  ru: {
    metaTitle: "Системы безопасности для иностранных компаний в Узбекистане",
    metaDesc: "Лицензированный интегратор систем безопасности в Ташкенте для иностранных компаний: видеонаблюдение, пожарная сигнализация, СКУД. Договоры с иностранными юрлицами, документы на английском, проекты по всему Узбекистану.",
    h1: "Системы безопасности для иностранных компаний в Узбекистане",
    intro: "SAT Solutions — лицензированный интегратор систем безопасности в Ташкенте. Помогаем иностранным компаниям, выходящим на рынок Узбекистана — заводам, складам, офисам, отелям и ритейлу — подобрать, смонтировать и обслуживать видеонаблюдение, пожарную сигнализацию и СКУД в соответствии с местными нормами. Один подрядчик — полный цикл: обследование, подбор оборудования и схема размещения, поставка, монтаж, пусконаладка, сервис.",
    whyTitle: "Почему нас выбирают международные клиенты",
    why: [
      { t: "Лицензии на охранные и пожарные системы", d: "Гослицензии Национальной гвардии РУз (охранные системы) и МЧС РУз (пожарная сигнализация и пожаротушение). Объект проходит местные проверки." },
      { t: "3 000+ товаров на складе в Ташкенте", d: "Hikvision, Dahua, ZKTeco, TP-Link, Болид, Рубеж — собственный склад, без долгих сроков импорта." },
      { t: "Англоговорящий менеджер проекта", d: "Спецификации, сметы, договоры и счета на английском для иностранных юрлиц. Оплата по перечислению, документы для бухгалтерии." },
      { t: "Объекты по всему Узбекистану", d: "Монтажные бригады работают в Ташкенте и выезжают в любой регион, включая СЭЗ и индустриальные парки." },
    ],
    servicesTitle: "Что мы делаем",
    services: [
      { t: "Видеонаблюдение", d: "IP-камеры, регистраторы, видеоаналитика, распознавание номеров — подбор, схема размещения и монтаж под ключ." },
      { t: "Пожарная сигнализация", d: "Адресные системы (Рубеж, Болид), оповещение и эвакуация, сертификация по нормам РУз." },
      { t: "СКУД и турникеты", d: "Терминалы распознавания лиц, карты и биометрия, турникеты и шлагбаумы (ZKTeco, Hikvision)." },
      { t: "Сети и СКС", d: "ЛВС, Wi-Fi, серверные — инфраструктура, на которой работают системы." },
      { t: "Обслуживание и SLA", d: "Плановый сервис, запчасти со склада, время реакции фиксируется договором." },
    ],
    supplyTitle: "Поставка Hikvision и Dahua в Узбекистане",
    supply: [
      "SAT Solutions — поставщик Hikvision и Dahua в Ташкенте: более 700 моделей Hikvision и 270 моделей Dahua в наличии — IP- и поворотные камеры, регистраторы, тепловизоры, домофоны, терминалы доступа и турникеты. Цены в сумах опубликованы в каталоге, наличие обновляется ежедневно, ходовые модели отгружаются со склада в Ташкенте без ожидания импорта.",
      "Иностранным компаниям поставляем оборудование по договору с документами на английском и счётом с НДС, а настраивают и запускают камеры те же инженеры, что монтируют системы. На каждое устройство — гарантия производителя, на монтажные работы — наша гарантия 3 года. Пришлите спецификацию или план помещений — вернём расценённую спецификацию в течение рабочего дня.",
    ],
    supplyLinks: [
      { label: "Каталог Hikvision: 700+ моделей с ценами", href: "/catalog/hikvision" },
      { label: "Каталог Dahua: 270+ моделей с ценами", href: "/catalog/dahua" },
    ],
    faqTitle: "Частые вопросы",
    faq: [
      { q: "Работаете ли вы с иностранными юрлицами?", a: "Да. Заключаем договоры с иностранными компаниями и их местными «дочками», выставляем счета и полный пакет бухгалтерских документов, при необходимости — версии на английском." },
      { q: "Делаете ли объекты под ключ за пределами Ташкента?", a: "Да, бригады работают по всему Узбекистану, включая СЭЗ и индустриальные парки. Подбор оборудования, поставка, монтаж и пусконаладка — один подрядчик." },
      { q: "Примут ли вашу пожарную систему надзорные органы?", a: "Да. У нас лицензия МЧС, монтируем по нормам РУз и сопровождаем объект при проверке." },
      { q: "Как быстро получить смету?", a: "Пришлите план помещений или спецификацию на sales@satsolutions.uz — предварительная смета обычно готова в течение 24 часов, выезд инженера по Ташкенту бесплатный." },
    ],
    ctaTitle: "Начните с бесплатного обследования объекта",
    ctaText: "Отправьте требования или закажите звонок — ответим в течение рабочего дня.",
    ctaButton: "Связаться с нами",
    ctaCall: "WhatsApp / Телефон: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  uz: {
    metaTitle: "Oʻzbekistondagi xorijiy kompaniyalar uchun xavfsizlik tizimlari",
    metaDesc: "Toshkentdagi litsenziyalangan integrator: videokuzatuv, yongʻin signalizatsiyasi, SKUD. Xorijiy yuridik shaxslar bilan shartnomalar, butun Oʻzbekiston boʻylab loyihalar.",
    h1: "Oʻzbekistondagi xorijiy kompaniyalar uchun xavfsizlik tizimlari",
    intro: "SAT Solutions — Toshkentdagi litsenziyalangan xavfsizlik tizimlari integratori. Oʻzbekiston bozoriga kirayotgan xorijiy kompaniyalarga — zavodlar, omborlar, ofislar, mehmonxonalarga — mahalliy talablarga mos videokuzatuv, yongʻin signalizatsiyasi va SKUD tizimlarini tanlash, oʻrnatish va xizmat koʻrsatishda yordam beramiz. Bitta pudratchi — toʻliq sikl.",
    whyTitle: "Nega xalqaro mijozlar bizni tanlaydi",
    why: [
      { t: "Davlat litsenziyalari", d: "Milliy gvardiya (qoʻriqlash tizimlari) va FVV (yongʻin tizimlari) litsenziyalari — obyekt mahalliy tekshiruvlardan oʻtadi." },
      { t: "Toshkentda 3 000+ tovar omborda", d: "Hikvision, Dahua, ZKTeco, TP-Link, Bolid, Rubej — oʻz omborimiz, uzoq import muddatlarisiz." },
      { t: "Ingliz tilida hujjatlar", d: "Xorijiy yuridik shaxslar uchun smeta, shartnoma va hisob-fakturalar ingliz tilida." },
      { t: "Butun Oʻzbekiston boʻylab", d: "Montaj brigadalari Toshkentda va istalgan hududda, EIZ va sanoat parklarida ishlaydi." },
    ],
    servicesTitle: "Xizmatlarimiz",
    services: [
      { t: "Videokuzatuv", d: "IP-kameralar, registratorlar, videoanalitika — uskuna tanlash, joylashuv sxemasi va montaj." },
      { t: "Yongʻin signalizatsiyasi", d: "Manzilli tizimlar (Rubej, Bolid), ogohlantirish, mahalliy meʼyorlar boʻyicha." },
      { t: "SKUD va turniketlar", d: "Yuz aniqlash terminallari, kartalar, biometriya (ZKTeco, Hikvision)." },
      { t: "Tarmoqlar va SKS", d: "LAN, Wi-Fi, server xonalari." },
      { t: "Servis va SLA", d: "Rejali xizmat, ombordan ehtiyot qismlar, shartnomada belgilangan javob vaqti." },
    ],
    supplyTitle: "Oʻzbekistonda Hikvision va Dahua yetkazib berish",
    supply: [
      "SAT Solutions — Toshkentdagi Hikvision va Dahua yetkazib beruvchisi: 700 dan ortiq Hikvision va 270 dan ortiq Dahua modeli mavjud — IP va aylanuvchi kameralar, registratorlar, termal kameralar, domofonlar, kirish terminallari va turniketlar. Narxlar soʻmda katalogda eʼlon qilingan, mavjudlik har kuni yangilanadi, ommabop modellar importni kutmasdan Toshkentdagi omborimizdan joʻnatiladi.",
      "Xorijiy kompaniyalarga uskunani ingliz tilidagi hujjatlar va QQS li hisob-faktura bilan shartnoma asosida yetkazamiz; kameralarni tizimlarni oʻrnatadigan oʻsha muhandislar sozlaydi va ishga tushiradi. Har bir qurilmaga ishlab chiqaruvchi kafolati, montaj ishlariga — bizning 3 yillik kafolatimiz. Spetsifikatsiya yoki xonalar rejasini yuboring — ish kuni davomida narxlangan spetsifikatsiyani qaytaramiz.",
    ],
    supplyLinks: [
      { label: "Hikvision katalogi: narxlari bilan 700+ model", href: "/catalog/hikvision" },
      { label: "Dahua katalogi: narxlari bilan 270+ model", href: "/catalog/dahua" },
    ],
    faqTitle: "Koʻp soʻraladigan savollar",
    faq: [
      { q: "Xorijiy yuridik shaxslar bilan ishlaysizmi?", a: "Ha. Xorijiy kompaniyalar va ularning mahalliy sho''ba korxonalari bilan shartnoma tuzamiz, toʻliq hujjatlar paketini beramiz." },
      { q: "Toshkentdan tashqaridagi obyektlarda ishlaysizmi?", a: "Ha, brigadalarimiz butun Oʻzbekiston boʻylab, jumladan EIZ va sanoat parklarida ishlaydi." },
      { q: "Yongʻin tizimingizni nazorat organlari qabul qiladimi?", a: "Ha. FVV litsenziyamiz bor, Oʻzbekiston meʼyorlari boʻyicha oʻrnatamiz va tekshiruvda hamrohlik qilamiz." },
      { q: "Smetani qancha vaqtda olamiz?", a: "Reja yoki spetsifikatsiyani sales@satsolutions.uz ga yuboring — smeta odatda 24 soat ichida tayyor." },
    ],
    ctaTitle: "Bepul obyekt koʻrigidan boshlang",
    ctaText: "Talablaringizni yuboring yoki qoʻngʻiroq buyurtma qiling.",
    ctaButton: "Bogʻlanish",
    ctaCall: "WhatsApp / Tel: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  tr: {
    metaTitle: "Özbekistan'da Yabancı Şirketler için Güvenlik Sistemleri — Taşkent",
    metaDesc: "Taşkent'te lisanslı güvenlik sistemleri entegratörü: kamera sistemleri (CCTV), yangın alarm, geçiş kontrol ve turnikeler. Yabancı tüzel kişilerle sözleşme, tüm Özbekistan'da projeler.",
    h1: "Özbekistan'da yabancı şirketler için güvenlik sistemleri",
    intro: "SAT Solutions, Taşkent merkezli lisanslı bir güvenlik sistemleri entegratörüdür. Özbekistan pazarına giren yabancı şirketlere — fabrikalar, depolar, ofisler, oteller — yerel mevzuata uygun CCTV, yangın alarm ve geçiş kontrol sistemlerinin seçimi, kurulumu ve bakımında destek veriyoruz. Tek yüklenici, tam döngü: keşif, ekipman seçimi ve yerleşim şeması, tedarik, montaj, devreye alma ve servis.",
    whyTitle: "Uluslararası müşteriler neden bizi seçiyor",
    why: [
      { t: "Güvenlik ve yangın sistemleri lisansları", d: "Özbekistan Ulusal Muhafızları (güvenlik) ve Acil Durumlar Bakanlığı (yangın) devlet lisansları — tesisiniz yerel denetimlerden geçer." },
      { t: "Taşkent'te stokta 3 000+ ürün", d: "Hikvision, Dahua, ZKTeco, TP-Link, Bolid, Rubej — kendi depomuz, uzun ithalat süreleri yok." },
      { t: "İngilizce dokümantasyon", d: "Yabancı tüzel kişiler için şartname, sözleşme ve faturalar İngilizce hazırlanır. Banka havalesiyle ödeme." },
      { t: "Tüm Özbekistan'da kurulum", d: "Montaj ekiplerimiz Taşkent'te ve tüm bölgelerde — serbest ekonomik bölgeler ve sanayi parkları dahil — çalışır." },
    ],
    servicesTitle: "Hizmetlerimiz",
    services: [
      { t: "CCTV / kamera sistemleri", d: "IP kameralar, NVR, video analitik, plaka tanıma — anahtar teslim kurulum." },
      { t: "Yangın alarm sistemleri", d: "Adresli sistemler (Rubej, Bolid), sesli tahliye, yerel yangın mevzuatına uygun." },
      { t: "Geçiş kontrol ve turnikeler", d: "Yüz tanıma terminalleri, kart ve biyometri, turnike ve bariyerler (ZKTeco, Hikvision)." },
      { t: "Ağ ve yapısal kablolama", d: "LAN/SCS, Wi-Fi, sistem odaları." },
      { t: "Bakım ve SLA", d: "Planlı servis, stoktan yedek parça, sözleşmeyle sabitlenen müdahale süreleri." },
    ],
    supplyTitle: "Özbekistan'da Hikvision ve Dahua tedariki",
    supply: [
      "SAT Solutions, Taşkent'te Hikvision ve Dahua tedarikçisidir: stokta 700'den fazla Hikvision ve 270'den fazla Dahua modeli — IP ve PTZ kameralar, kayıt cihazları, termal kameralar, interkomlar, geçiş terminalleri ve turnikeler. Fiyatlar katalogda UZS olarak yayımlanır, stok günlük güncellenir, standart modeller ithalat beklemeden Taşkent depomuzdan sevk edilir.",
      "Yabancı şirketlere ekipmanı İngilizce evrak ve KDV'li faturayla sözleşme kapsamında tedarik ederiz; kameraları, sistemleri kuran aynı mühendisler yapılandırır ve devreye alır. Her cihazda üretici garantisi, montaj işçiliğinde 3 yıl kendi garantimiz vardır. Metraj listenizi veya kat planınızı gönderin, bir iş günü içinde fiyatlandırılmış şartname iletelim.",
    ],
    supplyLinks: [
      { label: "Hikvision kataloğu: fiyatlı 700+ model", href: "/catalog/hikvision" },
      { label: "Dahua kataloğu: fiyatlı 270+ model", href: "/catalog/dahua" },
    ],
    faqTitle: "Sık sorulan sorular",
    faq: [
      { q: "Yabancı tüzel kişilerle çalışıyor musunuz?", a: "Evet. Yabancı şirketler ve yerel iştirakleriyle sözleşme imzalıyor, fatura ve tam muhasebe evrakı düzenliyoruz." },
      { q: "Taşkent dışında anahtar teslim kurulum yapıyor musunuz?", a: "Evet. Ekiplerimiz tüm Özbekistan'da, serbest bölgeler ve sanayi parkları dahil, kurulum yapar." },
      { q: "Yangın sisteminiz yerel makamlarca kabul ediliyor mu?", a: "Evet. Acil Durumlar Bakanlığı lisansımız var, Özbek mevzuatına göre kurulum yapıyoruz." },
      { q: "Teklifi ne kadar sürede alırız?", a: "Planınızı veya keşif listenizi sales@satsolutions.uz adresine gönderin — bütçe teklifi genellikle 24 saat içinde hazır." },
    ],
    ctaTitle: "Ücretsiz keşifle başlayın",
    ctaText: "Gereksinimlerinizi gönderin veya arama talep edin — bir iş günü içinde yanıt veriyoruz.",
    ctaButton: "İletişime geçin",
    ctaCall: "WhatsApp / Tel: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  zh: {
    metaTitle: "乌兹别克斯坦外资企业安防系统 — 塔什干 CCTV、消防报警、门禁",
    metaDesc: "塔什干持牌安防系统集成商，服务进入乌兹别克斯坦的外资企业：视频监控安装、消防报警系统、门禁与闸机。可与外国法人签约，项目覆盖全乌兹别克斯坦。",
    h1: "为进入乌兹别克斯坦的外资企业提供安防系统",
    intro: "SAT Solutions 是一家位于塔什干的持牌安防系统集成商。我们帮助进入乌兹别克斯坦的外资企业——工厂、仓库、办公室、酒店和零售——选型、安装并维护符合当地法规的视频监控、消防报警和门禁系统。一个承包商，全流程服务：勘察、选型与布置方案、供货、安装、调试和维保。",
    whyTitle: "国际客户选择我们的理由",
    why: [
      { t: "安防与消防系统国家牌照", d: "持有乌兹别克斯坦国民近卫军（安防系统）和紧急情况部（消防系统）颁发的国家许可证，项目可顺利通过当地验收。" },
      { t: "塔什干现货库存 3000+ 种产品", d: "海康威视、大华、ZKTeco、TP-Link、Bolid、Rubezh 等品牌自有仓库，无需漫长进口周期。" },
      { t: "英文项目文档", d: "为外国法人提供英文规格书、合同与发票，支持银行转账，提供全套财务凭证。" },
      { t: "项目覆盖全乌兹别克斯坦", d: "安装团队常驻塔什干，可赴任何地区施工，包括经济特区和工业园区。" },
    ],
    servicesTitle: "服务内容",
    services: [
      { t: "视频监控 (CCTV)", d: "IP 摄像机、录像机、视频分析、车牌识别——选型、布置方案与交钥匙安装。" },
      { t: "消防报警系统", d: "总线制系统（Rubezh、Bolid）、语音疏散，符合当地消防规范认证。" },
      { t: "门禁与闸机", d: "人脸识别终端、刷卡与生物识别、闸机和道闸（ZKTeco、海康威视）。" },
      { t: "网络与综合布线", d: "局域网、Wi-Fi、机房——系统运行的基础设施。" },
      { t: "维保与 SLA", d: "计划性维护、现货备件、合同约定响应时间。" },
    ],
    supplyTitle: "乌兹别克斯坦海康威视与大华供应",
    supply: [
      "SAT Solutions 是塔什干的海康威视（Hikvision）和大华（Dahua）供应商：现货 700 多款海康威视和 270 多款大华产品——IP 与云台摄像机、录像机、热成像摄像机、楼宇对讲、门禁终端和闸机。目录中以苏姆标价，库存每日更新，常规型号从塔什干仓库直接发货，无需等待进口。",
      "面向外资企业，我们按合同供货，提供英文文件和含增值税发票；摄像机由负责安装系统的同一批工程师配置并调试。每台设备享有厂家保修，安装工程质保 3 年。发来设备清单或平面图，我们将在一个工作日内回复带价格的配置清单。",
    ],
    supplyLinks: [
      { label: "海康威视目录：700 多款带价格", href: "/catalog/hikvision" },
      { label: "大华目录：270 多款带价格", href: "/catalog/dahua" },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "你们与外国法人签约吗？", a: "是的。我们与外国公司及其本地子公司签订合同，开具发票和全套会计凭证，可提供英文版本文件。" },
      { q: "塔什干以外的交钥匙项目能做吗？", a: "可以。我们的团队在全乌兹别克斯坦施工，包括经济特区和工业园区。选型、供货、安装、调试由一个承包商完成。" },
      { q: "你们的消防系统能通过当地部门验收吗？", a: "能。我们持有紧急情况部许可证，按乌兹别克斯坦消防规范施工，并在验收时提供支持。" },
      { q: "多快能拿到报价？", a: "将平面图或设备清单发送至 sales@satsolutions.uz——预算报价通常 24 小时内完成，塔什干市内工程师上门勘察免费。" },
    ],
    ctaTitle: "从免费现场勘察开始",
    ctaText: "发送您的需求或预约通话——我们将在一个工作日内回复。",
    ctaButton: "联系我们",
    ctaCall: "WhatsApp / 电话: +998 97 862 66 99 · 微信 WeChat: cadi2104 · sales@satsolutions.uz",
  },
};

async function generateMetadataBase({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = D[locale] ?? D.en;
  return {
    title: d.metaTitle,
    description: d.metaDesc,
    alternates: hreflangAlternates("/international", locale),
    openGraph: { title: d.metaTitle, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function InternationalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = D[locale] ?? D.en;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: d.h1,
        provider: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz", telephone: "+998-97-862-66-99", email: "sales@satsolutions.uz" },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
        serviceType: "Security systems integration: CCTV, fire alarm, access control",
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{d.h1}</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">{d.intro}</p>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.whyTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {d.why.map((w) => (
          <div key={w.t} className="rounded-xl border border-slate-200 p-5 bg-white">
            <div className="font-semibold text-slate-900">{w.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{w.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.servicesTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {d.services.map((s) => (
          <div key={s.t} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
            <div className="font-semibold text-slate-900">{s.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>

      {d.supplyTitle && (
        <section>
          <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.supplyTitle}</h2>
          {d.supply?.map((p) => (
            <p key={p.slice(0, 40)} className="mt-4 text-slate-600 leading-relaxed">{p}</p>
          ))}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {d.supplyLinks?.map((l) => (
              <Link key={l.href} href={l.href} className="font-semibold text-brand-700 hover:underline">{l.label} →</Link>
            ))}
          </div>
        </section>
      )}
      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.faqTitle}</h2>
      <div className="mt-6 space-y-4">
        {d.faq.map((f) => (
          <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="font-medium text-slate-900 cursor-pointer">{f.q}</summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-slate-900 text-white p-8 sm:p-10">
        <h2 className="text-2xl font-semibold">{d.ctaTitle}</h2>
        <p className="mt-3 text-slate-300">{d.ctaText}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link href="/contact" className="inline-flex items-center rounded-lg bg-white text-slate-900 px-6 py-3 font-semibold hover:bg-slate-100 transition">
            {d.ctaButton}
          </Link>
          <span className="text-slate-300 text-sm">{d.ctaCall}</span>
        </div>
      </div>
    </div>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
