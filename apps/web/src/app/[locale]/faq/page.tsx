// Общий FAQ компании — «вопросные» запросы (как заказать, оплата, гарантия,
// доставка, лицензии) + хаб перелинковки на услуги/каталог/тендеры. Контент
// 5 локалей инлайном (по образцу /tenders). SEO: FAQPage LD со всеми вопросами.
// Сервисные FAQ живут на страницах услуг — здесь только общие вопросы, без дублей.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

type QA = { q: string; a: string };
type Dict = {
  metaTitle: string; metaDesc: string;
  h1: string; intro: string;
  groups: { title: string; items: QA[] }[];
  linksTitle: string;
  links: { href: string; label: string }[];
  ctaTitle: string; ctaText: string; ctaButton: string;
};

const D: Record<string, Dict> = {
  ru: {
    metaTitle: "Частые вопросы — заказ, оплата, гарантия, монтаж | SAT Solutions",
    metaDesc: "Ответы на частые вопросы о работе SAT Solutions: как заказать монтаж и получить КП, способы оплаты и документы для юрлиц, лицензии, сроки монтажа, гарантия и обслуживание, доставка по Узбекистану.",
    h1: "Частые вопросы",
    intro: "Собрали ответы на вопросы, которые задают чаще всего — о заказе, оплате, сроках, гарантии и документах. Вопросы по конкретным системам (видеонаблюдение, СКУД, пожарная сигнализация) — на страницах услуг.",
    groups: [
      { title: "Заказ и цены", items: [
        { q: "Как заказать монтаж или получить коммерческое предложение?", a: "Оставьте заявку на сайте, напишите в Telegram или позвоните. Инженер приедет на объект, посчитает смету и подготовит КП — обычно в течение рабочего дня. Для типовых задач хватает описания объекта или плана по телефону." },
        { q: "Сколько стоит выезд инженера и расчёт?", a: "По Ташкенту — бесплатно: осмотр объекта, замеры, смета и коммерческое предложение ни к чему не обязывают. По регионам выезд согласуем отдельно." },
        { q: "Вы работаете с частными лицами или только с компаниями?", a: "И с теми, и с другими. Частным клиентам — камеры для дома, домофоны, умные замки и сигнализации; юридическим лицам — полный документооборот: договор, счёт с НДС, акты." },
        { q: "Где посмотреть цены на оборудование?", a: "В каталоге на сайте — более 3000 позиций с актуальными ценами со склада в Ташкенте. Стоимость монтажа зависит от объекта и считается по смете после осмотра или по вашему плану." },
      ]},
      { title: "Оплата и документы", items: [
        { q: "Какие способы оплаты вы принимаете?", a: "Юридические лица платят перечислением по счёту с НДС. Частные клиенты — наличными или картой. Для тендерных поставок следуем условиям закупочной документации." },
        { q: "Какие документы получает юридическое лицо?", a: "Договор поставки или подряда, счёт-фактуру с НДС, накладные и акты выполненных работ, паспорта и сертификаты на оборудование, гарантийные обязательства — полный пакет для бухгалтерии." },
        { q: "У вас есть лицензии на работы?", a: "Да: монтаж охранных систем — лицензия Национальной гвардии РУз, пожарная сигнализация и оповещение — лицензия МЧС. Объекты сдаём надзорным органам с исполнительной документацией." },
      ]},
      { title: "Монтаж и сроки", items: [
        { q: "Сколько времени занимает монтаж?", a: "Квартира или небольшой дом — обычно один день. Офис или магазин — от одного до трёх дней. Крупные объекты — по графику проекта, который фиксируем в договоре." },
        { q: "Вы работаете в регионах Узбекистана?", a: "Да, поставляем оборудование и выполняем монтаж по всей стране: от Ташкента до любого региона. Для удалённых объектов планируем работы так, чтобы закрыть всё за одну командировку." },
        { q: "Можно ли выполнить монтаж без остановки работы объекта?", a: "Да, это наш стандартный режим: шумные работы выносим в нерабочие часы или ночь, объект делим на этапы. Магазины, клиники и производства продолжают работать." },
        { q: "Вы поставляете оборудование без монтажа?", a: "Да, поставка — самостоятельное направление. Комплектуем объект по вашей спецификации или проекту, монтаж может выполнять ваш подрядчик." },
      ]},
      { title: "Гарантия и обслуживание", items: [
        { q: "Какая гарантия на оборудование и работы?", a: "На оборудование действует гарантия производителя, на монтажные работы — наша гарантия; сроки фиксируем в договоре. Гарантийные случаи закрываем своим сервисом, ходовые запчасти держим на складе." },
        { q: "Что после окончания гарантии?", a: "Предлагаем договор технического обслуживания: регламентные проверки, чистка датчиков и камер, аварийные выезды. Для пожарной сигнализации регулярное ТО — требование норм, журнал обслуживания проверяет инспектор." },
        { q: "Возьмёте на обслуживание систему, которую монтировали не вы?", a: "Да. Начинаем с бесплатного аудита: проверяем состояние, составляем дефектную ведомость, и вы решаете, что чинить сейчас, а что планировать. Дальше система встаёт на регламент." },
      ]},
      { title: "Оборудование и партнёрства", items: [
        { q: "С какими брендами вы работаете?", a: "Hikvision, Dahua, ZKTeco, Болид, Рубеж, MikroTik, TP-Link, H3C и другие — более 3000 позиций со склада в Ташкенте. Мы сертифицированный партнёр H3C и интегратор Dahua." },
        { q: "Вы участвуете в тендерах и корпоративных закупках?", a: "Да: готовим КП и спецификации под требования закупки за 24 часа, поставляем по договору, даём полный пакет документов. Подробности — на странице «Поставки и тендеры»." },
      ]},
    ],
    linksTitle: "Куда дальше",
    links: [
      { href: "/services", label: "Все услуги и цены" },
      { href: "/catalog", label: "Каталог оборудования" },
      { href: "/tenders", label: "Поставки и тендеры" },
      { href: "/portfolio", label: "Реализованные проекты" },
    ],
    ctaTitle: "Не нашли свой вопрос?",
    ctaText: "Напишите или позвоните — инженер ответит по делу и при необходимости бесплатно приедет на объект.",
    ctaButton: "Задать вопрос",
  },
  uz: {
    metaTitle: "Tez-tez so'raladigan savollar — buyurtma, to'lov, kafolat | SAT Solutions",
    metaDesc: "SAT Solutions ishi haqida savollarga javoblar: montajga buyurtma va KP olish, to'lov usullari va yuridik shaxslar hujjatlari, litsenziyalar, montaj muddatlari, kafolat va xizmat, O'zbekiston bo'ylab yetkazib berish.",
    h1: "Tez-tez so'raladigan savollar",
    intro: "Eng ko'p beriladigan savollarga javoblarni yig'dik — buyurtma, to'lov, muddatlar, kafolat va hujjatlar haqida. Muayyan tizimlar bo'yicha savollar (videokuzatuv, SKUD, yong'in signalizatsiyasi) — xizmatlar sahifalarida.",
    groups: [
      { title: "Buyurtma va narxlar", items: [
        { q: "Montajga qanday buyurtma berish yoki KP olish mumkin?", a: "Saytda ariza qoldiring, Telegramga yozing yoki qo'ng'iroq qiling. Muhandis obyektga keladi, smeta hisoblaydi va KP tayyorlaydi — odatda bir ish kuni ichida. Tipik vazifalarga obyekt tavsifi yoki telefon orqali plan yetarli." },
        { q: "Muhandis chiqishi va hisob-kitob qancha turadi?", a: "Toshkent bo'ylab — bepul: obyektni ko'rish, o'lchovlar, smeta va tijorat taklifi hech narsaga majbur qilmaydi. Viloyatlarga chiqishni alohida kelishamiz." },
        { q: "Jismoniy shaxslar bilan ishlaysizmi yoki faqat kompaniyalar bilanmi?", a: "Ikkalasi bilan ham. Xususiy mijozlarga — uy kameralari, domofonlar, aqlli qulflar va signalizatsiyalar; yuridik shaxslarga — to'liq hujjat aylanmasi: shartnoma, QQS li hisob, aktlar." },
        { q: "Uskunalar narxini qayerda ko'rish mumkin?", a: "Saytdagi katalogda — Toshkentdagi ombordan dolzarb narxlar bilan 3000 dan ortiq pozitsiya. Montaj narxi obyektga bog'liq va ko'rikdan keyin yoki planingiz bo'yicha smeta bilan hisoblanadi." },
      ]},
      { title: "To'lov va hujjatlar", items: [
        { q: "Qanday to'lov usullarini qabul qilasiz?", a: "Yuridik shaxslar QQS li hisob bo'yicha o'tkazma bilan to'laydi. Xususiy mijozlar — naqd yoki karta bilan. Tender ta'minotlarida xarid hujjatlari shartlariga amal qilamiz." },
        { q: "Yuridik shaxs qanday hujjatlar oladi?", a: "Ta'minot yoki pudrat shartnomasi, QQS li hisob-faktura, nakladnoy va bajarilgan ishlar aktlari, uskunalarga pasport va sertifikatlar, kafolat majburiyatlari — buxgalteriya uchun to'liq paket." },
        { q: "Ishlarga litsenziyalaringiz bormi?", a: "Ha: qo'riqlash tizimlari montaji — O'zR Milliy gvardiyasi litsenziyasi, yong'in signalizatsiyasi va ogohlantirish — FVV litsenziyasi. Obyektlarni ijro hujjatlari bilan nazorat organlariga topshiramiz." },
      ]},
      { title: "Montaj va muddatlar", items: [
        { q: "Montaj qancha vaqt oladi?", a: "Kvartira yoki kichik uy — odatda bir kun. Ofis yoki do'kon — bir kundan uch kungacha. Yirik obyektlar — shartnomada belgilangan loyiha grafigi bo'yicha." },
        { q: "O'zbekiston viloyatlarida ishlaysizmi?", a: "Ha, butun mamlakat bo'ylab uskuna yetkazamiz va montaj qilamiz: Toshkentdan istalgan viloyatgacha. Uzoq obyektlarga ishlarni bitta safarda yopadigan qilib rejalashtiramiz." },
        { q: "Obyekt ishini to'xtatmasdan montaj qilish mumkinmi?", a: "Ha, bu bizning standart rejimimiz: shovqinli ishlarni ish vaqtidan tashqari yoki tunga chiqaramiz, obyektni bosqichlarga bo'lamiz. Do'konlar, klinikalar va ishlab chiqarishlar ishlashda davom etadi." },
        { q: "Montajsiz faqat uskuna yetkazasizmi?", a: "Ha, ta'minot — mustaqil yo'nalish. Obyektni spetsifikatsiyangiz yoki loyiha bo'yicha butlaymiz, montajni pudratchingiz bajarishi mumkin." },
      ]},
      { title: "Kafolat va xizmat", items: [
        { q: "Uskuna va ishlarga qanday kafolat bor?", a: "Uskunaga ishlab chiqaruvchi kafolati, montaj ishlariga — bizning kafolatimiz amal qiladi; muddatlar shartnomada belgilanadi. Kafolat holatlarini o'z servisimiz yopadi, yurimli ehtiyot qismlar omborda." },
        { q: "Kafolat tugagach nima bo'ladi?", a: "Texnik xizmat shartnomasini taklif qilamiz: reglamentli tekshiruvlar, datchik va kameralarni tozalash, avariya chiqishlari. Yong'in signalizatsiyasiga muntazam TX — normalar talabi, jurnalni inspektor tekshiradi." },
        { q: "Boshqalar o'rnatgan tizimni xizmatga olasizmi?", a: "Ha. Bepul auditdan boshlaymiz: holatni tekshiramiz, nuqson vedomostini tuzamiz, nimani hozir tuzatish, nimani rejalashtirish — siz hal qilasiz. Keyin tizim reglamentga o'tadi." },
      ]},
      { title: "Uskunalar va hamkorliklar", items: [
        { q: "Qaysi brendlar bilan ishlaysiz?", a: "Hikvision, Dahua, ZKTeco, Bolid, Rubej, MikroTik, TP-Link, H3C va boshqalar — Toshkentdagi ombordan 3000 dan ortiq pozitsiya. Biz H3C sertifikatlangan hamkori va Dahua integratorimiz." },
        { q: "Tender va korporativ xaridlarda qatnashasizmi?", a: "Ha: xarid talablariga KP va spetsifikatsiyalarni 24 soatda tayyorlaymiz, shartnoma bo'yicha yetkazamiz, to'liq hujjatlar paketini beramiz. Batafsil — «Ta'minot va tenderlar» sahifasida." },
      ]},
    ],
    linksTitle: "Keyin qayerga",
    links: [
      { href: "/services", label: "Barcha xizmatlar va narxlar" },
      { href: "/catalog", label: "Uskunalar katalogi" },
      { href: "/tenders", label: "Ta'minot va tenderlar" },
      { href: "/portfolio", label: "Amalga oshirilgan loyihalar" },
    ],
    ctaTitle: "Savolingizni topmadingizmi?",
    ctaText: "Yozing yoki qo'ng'iroq qiling — muhandis aniq javob beradi va kerak bo'lsa obyektga bepul keladi.",
    ctaButton: "Savol berish",
  },
  en: {
    metaTitle: "FAQ — ordering, payment, warranty, installation | SAT Solutions",
    metaDesc: "Answers to frequent questions about SAT Solutions: how to order installation and get a quote, payment methods and documents for companies, licenses, installation timelines, warranty and service, delivery across Uzbekistan.",
    h1: "Frequently asked questions",
    intro: "The questions we hear most often — about ordering, payment, timelines, warranty and paperwork. Questions about specific systems (CCTV, access control, fire alarm) live on the service pages.",
    groups: [
      { title: "Ordering and prices", items: [
        { q: "How do I order installation or get a quote?", a: "Leave a request on the site, write on Telegram or call. An engineer visits the site, calculates the estimate and prepares a quote — usually within a working day. For typical tasks a description of the site or a floor plan over the phone is enough." },
        { q: "How much does the engineer's visit and calculation cost?", a: "In Tashkent — free: the site survey, measurements, estimate and quote carry no obligations. Visits to the regions are agreed separately." },
        { q: "Do you work with individuals or only companies?", a: "Both. Private clients get home cameras, intercoms, smart locks and alarms; companies get full paperwork: a contract, a VAT invoice, acts." },
        { q: "Where can I see equipment prices?", a: "In the site catalog — over 3,000 items with current prices from our Tashkent warehouse. Installation cost depends on the site and is estimated after a survey or from your plan." },
      ]},
      { title: "Payment and documents", items: [
        { q: "What payment methods do you accept?", a: "Companies pay by bank transfer against a VAT invoice. Private clients — cash or card. For tender supplies we follow the terms of the procurement documentation." },
        { q: "What documents does a company receive?", a: "A supply or works contract, a VAT invoice, waybills and acts of completed works, equipment passports and certificates, warranty obligations — the full package for accounting." },
        { q: "Are you licensed?", a: "Yes: security system installation — a license of the National Guard of Uzbekistan; fire alarm and voice notification — a license of the Ministry of Emergency Situations. We hand sites over to the supervising authorities with as-built documentation." },
      ]},
      { title: "Installation and timelines", items: [
        { q: "How long does installation take?", a: "An apartment or a small house — usually one day. An office or store — one to three days. Large sites follow the project schedule fixed in the contract." },
        { q: "Do you work in the regions of Uzbekistan?", a: "Yes, we supply and install across the whole country, from Tashkent to any region. For remote sites we plan the work to close everything in one trip." },
        { q: "Can you install without stopping our operations?", a: "Yes, that is our standard mode: noisy work moves to off-hours or night, the site is split into stages. Stores, clinics and production sites keep working." },
        { q: "Do you supply equipment without installation?", a: "Yes, supply is a standalone service. We assemble the order from your specification or design; your own contractor can do the installation." },
      ]},
      { title: "Warranty and service", items: [
        { q: "What warranty covers the equipment and the works?", a: "Equipment carries the manufacturer's warranty, installation carries ours; the terms are fixed in the contract. Warranty cases are handled by our own service team, with popular spares kept in stock." },
        { q: "What happens after the warranty ends?", a: "We offer a maintenance contract: scheduled checks, detector and camera cleaning, emergency call-outs. For fire alarms regular maintenance is a legal requirement — the inspector checks the log." },
        { q: "Will you service a system installed by someone else?", a: "Yes. We start with a free audit: we check the condition, draw up a defect list, and you decide what to fix now and what to plan. Then the system goes onto a schedule." },
      ]},
      { title: "Equipment and partnerships", items: [
        { q: "Which brands do you work with?", a: "Hikvision, Dahua, ZKTeco, Bolid, Rubezh, MikroTik, TP-Link, H3C and others — over 3,000 items from our Tashkent warehouse. We are a certified H3C partner and a Dahua integrator." },
        { q: "Do you take part in tenders and corporate procurement?", a: "Yes: we prepare quotes and specifications to procurement requirements within 24 hours, supply under contract and provide the full document package. Details — on the Supply and tenders page." },
      ]},
    ],
    linksTitle: "Where to next",
    links: [
      { href: "/services", label: "All services and prices" },
      { href: "/catalog", label: "Equipment catalog" },
      { href: "/tenders", label: "Supply and tenders" },
      { href: "/portfolio", label: "Completed projects" },
    ],
    ctaTitle: "Didn't find your question?",
    ctaText: "Write or call — an engineer will answer to the point and, if needed, visit your site free of charge.",
    ctaButton: "Ask a question",
  },
  tr: {
    metaTitle: "SSS — sipariş, ödeme, garanti, montaj | SAT Solutions",
    metaDesc: "SAT Solutions hakkında sık sorulan sorulara yanıtlar: montaj siparişi ve teklif alma, ödeme yöntemleri ve şirketler için evraklar, lisanslar, montaj süreleri, garanti ve servis, Özbekistan geneli teslimat.",
    h1: "Sık sorulan sorular",
    intro: "En sık duyduğumuz soruları topladık — sipariş, ödeme, süreler, garanti ve evrak hakkında. Belirli sistemlerle ilgili sorular (kamera, geçiş kontrolü, yangın alarmı) hizmet sayfalarındadır.",
    groups: [
      { title: "Sipariş ve fiyatlar", items: [
        { q: "Montaj siparişi nasıl verilir veya teklif nasıl alınır?", a: "Sitede talep bırakın, Telegram'dan yazın veya arayın. Mühendis sahaya gelir, keşfi hesaplar ve teklifi hazırlar — genelde bir iş günü içinde. Tipik işler için sahanın tarifi veya telefonda bir plan yeterlidir." },
        { q: "Mühendis ziyareti ve hesaplama ne kadar?", a: "Taşkent içinde ücretsiz: saha turu, ölçümler, keşif ve teklif hiçbir yükümlülük getirmez. Bölgelere ziyaret ayrıca kararlaştırılır." },
        { q: "Bireylerle mi yalnızca şirketlerle mi çalışıyorsunuz?", a: "Her ikisiyle de. Bireysel müşterilere ev kameraları, interkomlar, akıllı kilitler ve alarmlar; şirketlere tam evrak düzeni: sözleşme, KDV'li fatura, tutanaklar." },
        { q: "Ekipman fiyatlarını nerede görebilirim?", a: "Sitedeki katalogda — Taşkent depomuzdan güncel fiyatlarla 3.000'den fazla kalem. Montaj bedeli sahaya bağlıdır; keşif sonrası veya planınıza göre hesaplanır." },
      ]},
      { title: "Ödeme ve evraklar", items: [
        { q: "Hangi ödeme yöntemlerini kabul ediyorsunuz?", a: "Şirketler KDV'li faturayla havale öder. Bireysel müşteriler nakit veya kartla. Tender teslimatlarında ihale dokümantasyonunun şartlarına uyarız." },
        { q: "Şirket hangi evrakları alır?", a: "Tedarik veya iş sözleşmesi, KDV'li fatura, irsaliyeler ve iş tutanakları, ekipman pasaport ve sertifikaları, garanti taahhütleri — muhasebe için tam paket." },
        { q: "Lisanslarınız var mı?", a: "Evet: güvenlik sistemi montajı — Özbekistan Ulusal Muhafızları lisansı; yangın alarmı ve anons — Acil Durumlar Bakanlığı lisansı. Sahaları uygulama dokümanlarıyla denetim makamlarına teslim ederiz." },
      ]},
      { title: "Montaj ve süreler", items: [
        { q: "Montaj ne kadar sürer?", a: "Daire veya küçük ev — genelde bir gün. Ofis veya mağaza — bir ila üç gün. Büyük sahalar sözleşmede sabitlenen proje takvimine göre ilerler." },
        { q: "Özbekistan'ın bölgelerinde çalışıyor musunuz?", a: "Evet, tüm ülkede tedarik ve montaj yapıyoruz: Taşkent'ten her bölgeye. Uzak sahalarda işi tek seferde bitirecek şekilde planlarız." },
        { q: "Faaliyeti durdurmadan montaj mümkün mü?", a: "Evet, standart düzenimiz bu: gürültülü işler mesai dışına veya geceye alınır, saha etaplara bölünür. Mağazalar, klinikler ve üretimler çalışmaya devam eder." },
        { q: "Montajsız yalnızca ekipman tedarik ediyor musunuz?", a: "Evet, tedarik ayrı bir hizmettir. Siparişi spesifikasyonunuza veya projeye göre toplarız; montajı kendi yükleniciniz yapabilir." },
      ]},
      { title: "Garanti ve servis", items: [
        { q: "Ekipman ve işçilik garantisi nedir?", a: "Ekipmanda üretici garantisi, montajda bizim garantimiz geçerlidir; süreler sözleşmede sabitlenir. Garanti vakalarını kendi servisimiz kapatır, yaygın yedekler stokta tutulur." },
        { q: "Garanti bitince ne olur?", a: "Bakım sözleşmesi öneririz: planlı kontroller, dedektör ve kamera temizliği, arıza çıkışları. Yangın alarmında düzenli bakım norm gereğidir — defteri müfettiş kontrol eder." },
        { q: "Başkasının kurduğu sistemi bakıma alır mısınız?", a: "Evet. Ücretsiz denetimle başlarız: durumu kontrol eder, kusur listesi çıkarırız; neyin şimdi, neyin sonra yapılacağına siz karar verirsiniz. Sonra sistem programa girer." },
      ]},
      { title: "Ekipman ve iş ortaklıkları", items: [
        { q: "Hangi markalarla çalışıyorsunuz?", a: "Hikvision, Dahua, ZKTeco, Bolid, Rubezh, MikroTik, TP-Link, H3C ve diğerleri — Taşkent depomuzdan 3.000'den fazla kalem. Sertifikalı H3C iş ortağı ve Dahua entegratörüyüz." },
        { q: "Tenderlere ve kurumsal alımlara katılıyor musunuz?", a: "Evet: alım gereksinimlerine göre teklif ve spesifikasyonları 24 saatte hazırlar, sözleşmeyle teslim eder, tam evrak paketi veririz. Ayrıntılar — Tedarik ve tenderler sayfasında." },
      ]},
    ],
    linksTitle: "Sırada ne var",
    links: [
      { href: "/services", label: "Tüm hizmetler ve fiyatlar" },
      { href: "/catalog", label: "Ekipman kataloğu" },
      { href: "/tenders", label: "Tedarik ve tenderler" },
      { href: "/portfolio", label: "Tamamlanan projeler" },
    ],
    ctaTitle: "Sorunuzu bulamadınız mı?",
    ctaText: "Yazın veya arayın — mühendis net yanıt verir, gerekirse sahanıza ücretsiz gelir.",
    ctaButton: "Soru sorun",
  },
  zh: {
    metaTitle: "常见问题——下单、付款、保修、安装 | SAT Solutions",
    metaDesc: "关于SAT Solutions的常见问题解答：如何预约安装和获取报价、付款方式与企业单据、资质许可、施工周期、保修与维保、乌兹别克斯坦全境配送。",
    h1: "常见问题",
    intro: "这里汇总了客户问得最多的问题——下单、付款、周期、保修和单据。关于具体系统（视频监控、门禁、火灾报警）的问题请见各服务页面。",
    groups: [
      { title: "下单与价格", items: [
        { q: "如何预约安装或获取报价？", a: "在网站留言、写Telegram或来电即可。工程师上门勘察、核算预算并出具报价——通常一个工作日内。典型项目只需描述场地或电话里给个平面图就够。" },
        { q: "工程师上门和核算收费吗？", a: "塔什干范围内免费：勘察、测量、预算和报价均不构成任何义务。外地上门另行商定。" },
        { q: "你们只服务企业还是也接个人客户？", a: "两者都接。个人客户——家用摄像机、对讲、智能锁和报警；企业客户——完整单据流：合同、增值税发票、验收单。" },
        { q: "在哪里能看到设备价格？", a: "网站目录里——塔什干仓库现货3000多种，价格实时。安装费取决于场地，勘察后或按您的图纸出预算。" },
      ]},
      { title: "付款与单据", items: [
        { q: "接受哪些付款方式？", a: "企业按增值税发票转账；个人客户现金或刷卡。投标供货按采购文件条款执行。" },
        { q: "企业能拿到哪些单据？", a: "供货或施工合同、增值税发票、送货单和完工验收单、设备合格证和证书、保修承诺——财务所需的全套。" },
        { q: "你们有施工资质吗？", a: "有：安防系统安装——乌兹别克斯坦国民卫队许可；火灾报警和广播——紧急情况部许可。项目连同竣工文档移交监管部门验收。" },
      ]},
      { title: "施工与周期", items: [
        { q: "安装需要多长时间？", a: "公寓或小型住宅通常一天；办公室或商店一到三天；大型项目按合同中约定的进度执行。" },
        { q: "外地项目做吗？", a: "做，供货和施工覆盖全国：从塔什干到任何州。偏远项目会把工作规划成一次出差全部完成。" },
        { q: "能不停业施工吗？", a: "能，这是我们的标准模式：吵闹工序放到非营业时间或夜间，场地分段推进。商店、诊所和工厂照常运转。" },
        { q: "只买设备不要安装可以吗？", a: "可以，供货是独立业务。按您的清单或设计配齐，安装可由贵方施工队完成。" },
      ]},
      { title: "保修与维保", items: [
        { q: "设备和施工的保修如何？", a: "设备享受原厂保修，施工由我们保修；期限写进合同。保修问题由自有服务团队处理，常用备件仓库常备。" },
        { q: "保修期过后怎么办？", a: "可签维保合同：定期巡检、清洁探测器和摄像机、故障上门。火灾报警的定期维保是法规要求——检查员会查台账。" },
        { q: "别家装的系统你们接维保吗？", a: "接。先做免费审计：查状态、列缺陷清单，修什么、缓什么由您决定，之后系统进入定期维保。" },
      ]},
      { title: "设备与合作", items: [
        { q: "你们做哪些品牌？", a: "海康、大华、中控、Bolid、Rubezh、MikroTik、TP-Link、H3C等——塔什干仓库3000多种现货。我们是H3C认证合作伙伴和大华集成商。" },
        { q: "参与投标和企业采购吗？", a: "参与：24小时内按采购要求出报价和清单，按合同供货，提供全套单据。详见«供货与投标»页面。" },
      ]},
    ],
    linksTitle: "接下来看",
    links: [
      { href: "/services", label: "全部服务与价格" },
      { href: "/catalog", label: "设备目录" },
      { href: "/tenders", label: "供货与投标" },
      { href: "/portfolio", label: "已完成项目" },
    ],
    ctaTitle: "没找到您的问题？",
    ctaText: "写给我们或来电——工程师直接解答，必要时免费上门勘察。",
    ctaButton: "提问",
  },
};

const pick = (locale: string): Dict => D[locale] ?? D.ru;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: d.metaDesc,
    alternates: hreflangAlternates("/faq", locale),
    openGraph: { title: d.metaTitle, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = pick(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: d.groups.flatMap((g) => g.items).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{d.h1}</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">{d.intro}</p>

      {d.groups.map((g) => (
        <section key={g.title}>
          <h2 className="mt-12 text-2xl font-semibold text-slate-900">{g.title}</h2>
          <div className="mt-5 space-y-4">
            {g.items.map((f) => (
              <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
                <summary className="font-medium text-slate-900 cursor-pointer">{f.q}</summary>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.linksTitle}</h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        {d.links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-xl border border-slate-200 bg-slate-50 p-4 font-semibold text-slate-900 hover:border-brand-600 hover:text-brand-700 transition">
            {l.label}
          </Link>
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-slate-900 text-white p-8 sm:p-10">
        <h2 className="text-2xl font-semibold">{d.ctaTitle}</h2>
        <p className="mt-3 text-slate-300">{d.ctaText}</p>
        <div className="mt-6">
          <Link href="/contact" className="inline-flex items-center rounded-lg bg-white text-slate-900 px-6 py-3 font-semibold hover:bg-slate-100 transition">
            {d.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
