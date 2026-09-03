// Экспортные лендинги: поставки оборудования безопасности в Таджикистан и
// Туркменистан. Спрос по исследованию 23.07 — русскоязычный, поэтому контент
// RU-центричный, но по правилу сайта отдаём все 5 локалей (шаблон + страна).
// SEO: Service LD + FAQPage. Ключи: «видеонаблюдение Таджикистан», «поставка
// оборудования Душанбе», «Hikvision Душанбе», «оборудование безопасности Ашхабад».
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

type Country = {
  slug: string;
  ru: { name: string; gen: string; dat: string; cities: string; delivery: string };
  uz: { name: string; cities: string; delivery: string };
  en: { name: string; cities: string; delivery: string };
  tr: { name: string; cities: string; delivery: string };
  zh: { name: string; cities: string; delivery: string };
};

const COUNTRIES: Record<string, Country> = {
  tajikistan: {
    slug: "tajikistan",
    ru: { name: "Таджикистан", gen: "Таджикистана", dat: "Таджикистан", cities: "Душанбе, Худжанд, Бохтар", delivery: "Автодоставка со склада в Ташкенте: до Худжанда — 1–2 дня, до Душанбе — 2–3 дня." },
    uz: { name: "Tojikiston", cities: "Dushanbe, Xo'jand, Boxtar", delivery: "Toshkentdagi ombordan avtoyetkazish: Xo'jandgacha 1–2 kun, Dushanbegacha 2–3 kun." },
    en: { name: "Tajikistan", cities: "Dushanbe, Khujand, Bokhtar", delivery: "Road delivery from our Tashkent warehouse: 1–2 days to Khujand, 2–3 days to Dushanbe." },
    tr: { name: "Tacikistan", cities: "Duşanbe, Hucand, Bohtar", delivery: "Taşkent depomuzdan karayoluyla: Hucand'a 1–2 gün, Duşanbe'ye 2–3 gün." },
    zh: { name: "塔吉克斯坦", cities: "杜尚别、苦盏、博赫塔尔", delivery: "从塔什干仓库公路直达：至苦盏1–2天，至杜尚别2–3天。" },
  },
  turkmenistan: {
    slug: "turkmenistan",
    ru: { name: "Туркменистан", gen: "Туркменистана", dat: "Туркменистан", cities: "Ашхабад, Туркменабад, Мары", delivery: "Автодоставка со склада в Ташкенте до границы или до объекта — сроки и маршрут согласуем под заказ." },
    uz: { name: "Turkmaniston", cities: "Ashxobod, Turkmanobod, Mari", delivery: "Toshkentdagi ombordan chegara yoki obyektgacha avtoyetkazish — muddat va marshrut buyurtmaga kelishiladi." },
    en: { name: "Turkmenistan", cities: "Ashgabat, Turkmenabat, Mary", delivery: "Road delivery from our Tashkent warehouse to the border or the site — timing and route agreed per order." },
    tr: { name: "Türkmenistan", cities: "Aşkabat, Türkmenabat, Mary", delivery: "Taşkent depomuzdan sınıra veya sahaya karayolu teslimatı — süre ve güzergâh siparişe göre kararlaştırılır." },
    zh: { name: "土库曼斯坦", cities: "阿什哈巴德、土库曼纳巴德、马雷", delivery: "从塔什干仓库公路运输至边境或现场——时间和路线按订单商定。" },
  },
};

type Dict = {
  metaTitle: (c: Country) => string; metaDesc: (c: Country) => string;
  h1: (c: Country) => string; intro: (c: Country) => string;
  whyTitle: string; why: (c: Country) => { t: string; d: string }[];
  faqTitle: string; faq: (c: Country) => { q: string; a: string }[];
  ctaTitle: string; ctaText: string; ctaButton: string;
};

const D: Record<string, Dict> = {
  ru: {
    metaTitle: (c) => `Поставки оборудования безопасности в ${c.ru.dat} | SAT Solutions`,
    metaDesc: (c) => `Экспорт систем безопасности в ${c.ru.dat} из Узбекистана: видеонаблюдение Hikvision и Dahua, СКУД, пожарные системы, сети MikroTik — 3000+ позиций со склада в Ташкенте, экспортный контракт, инвойс, доставка. ${c.ru.cities}.`,
    h1: (c) => `Поставки оборудования безопасности в ${c.ru.dat}`,
    intro: (c) => `SAT Solutions поставляет системы безопасности и сетевое оборудование компаниям и подрядчикам из ${c.ru.gen}: видеонаблюдение, СКУД, пожарную сигнализацию, серверы и сети. Отгружаем со своего склада в Ташкенте — более 3000 позиций Hikvision, Dahua, ZKTeco, MikroTik, TP-Link, H3C в наличии, без ожидания поставки из Китая. Работаем по экспортному контракту с полным пакетом документов.`,
    whyTitle: "Почему закупаться у нас",
    why: (c) => [
      { t: "Склад рядом, а не за морем", d: `${c.ru.delivery} Складские позиции отгружаем в день оплаты — против недель ожидания при заказе напрямую из Китая.` },
      { t: "Экспортный контракт и документы", d: "Готовим контракт ВЭД, инвойс, упаковочный лист и сертификаты на оборудование. Оплата — валютным переводом по контракту." },
      { t: "Подбор и КП за 24 часа", d: "Пришлите спецификацию, проект или просто список задач — инженер подберёт оборудование, предложит аналоги и вернёт КП в течение суток." },
      { t: "Гарантия и поддержка", d: "Гарантийные обязательства фиксируем в контракте; замена оборудования — через Ташкент. Консультируем ваших монтажников по настройке удалённо." },
    ],
    faqTitle: "Частые вопросы",
    faq: (c) => [
      { q: `Как оплатить поставку из ${c.ru.gen}?`, a: "Заключаем экспортный контракт, выставляем инвойс — оплата валютным банковским переводом. Для регулярных закупок согласуем рамочный контракт с отгрузками по заявкам." },
      { q: "Сколько идёт доставка?", a: c.ru.delivery + " Возможен самовывоз с нашего склада в Ташкенте вашим транспортом или перевозчиком." },
      { q: "Что с гарантией на оборудование?", a: "Гарантия производителя действует; гарантийные случаи решаем через Ташкент — заменой или ремонтом. Условия и сроки фиксируем в контракте." },
      { q: "Вы выполняете монтаж или только поставляете?", a: `Базово — поставка и техническая поддержка вашей монтажной команды: схемы, настройка, консультации. Выезд наших инженеров в ${c.ru.dat} на пусконаладку крупного проекта обсуждается отдельно.` },
    ],
    ctaTitle: "Пришлите спецификацию — вернём КП за 24 часа",
    ctaText: "sales@satsolutions.uz или форма на странице контактов. Считает инженер: подберём оборудование под задачу и бюджет, предложим аналоги дефицитных позиций.",
    ctaButton: "Отправить запрос",
  },
  uz: {
    metaTitle: (c) => `${c.uz.name}ga xavfsizlik uskunalari ta'minoti | SAT Solutions`,
    metaDesc: (c) => `O'zbekistondan ${c.uz.name}ga xavfsizlik tizimlari eksporti: Hikvision va Dahua videokuzatuv, SKUD, yong'in tizimlari, MikroTik tarmoqlari — Toshkent omboridan 3000+ pozitsiya, eksport kontrakti, invoys, yetkazib berish. ${c.uz.cities}.`,
    h1: (c) => `${c.uz.name}ga xavfsizlik uskunalari ta'minoti`,
    intro: (c) => `SAT Solutions ${c.uz.name}dagi kompaniya va pudratchilarga xavfsizlik tizimlari va tarmoq uskunalarini yetkazadi: videokuzatuv, SKUD, yong'in signalizatsiyasi, serverlar va tarmoqlar. Toshkentdagi omborimizdan jo'natamiz — Hikvision, Dahua, ZKTeco, MikroTik, TP-Link, H3C dan 3000 dan ortiq pozitsiya mavjud. Eksport kontrakti va to'liq hujjatlar paketi bilan ishlaymiz.`,
    whyTitle: "Nega bizdan xarid qilish kerak",
    why: (c) => [
      { t: "Ombor dengiz ortida emas, yonida", d: `${c.uz.delivery} Ombor pozitsiyalari to'lov kunida jo'natiladi — Xitoydan to'g'ridan-to'g'ri buyurtmadagi haftalab kutishga qarshi.` },
      { t: "Eksport kontrakti va hujjatlar", d: "TIF kontrakti, invoys, qadoqlash varag'i va uskuna sertifikatlarini tayyorlaymiz. To'lov — kontrakt bo'yicha valyuta o'tkazmasi." },
      { t: "24 soatda tanlov va KP", d: "Spetsifikatsiya, loyiha yoki oddiy vazifalar ro'yxatini yuboring — muhandis uskunani tanlaydi, analoglar taklif qiladi va bir sutkada KP qaytaradi." },
      { t: "Kafolat va qo'llab-quvvatlash", d: "Kafolat majburiyatlari kontraktda belgilanadi; uskuna almashtirish — Toshkent orqali. Montajchilaringizga sozlash bo'yicha masofadan maslahat beramiz." },
    ],
    faqTitle: "Tez-tez so'raladigan savollar",
    faq: (c) => [
      { q: `${c.uz.name}dan to'lovni qanday qilish mumkin?`, a: "Eksport kontrakti tuzamiz, invoys chiqaramiz — to'lov valyuta bank o'tkazmasi bilan. Muntazam xaridlarga arizalar bo'yicha jo'natmali ramka kontraktini kelishamiz." },
      { q: "Yetkazib berish qancha vaqt oladi?", a: c.uz.delivery + " Toshkentdagi omborimizdan o'z transportingiz yoki tashuvchingiz bilan olib ketish ham mumkin." },
      { q: "Uskuna kafolati bilan nima bo'ladi?", a: "Ishlab chiqaruvchi kafolati amal qiladi; kafolat holatlarini Toshkent orqali hal qilamiz — almashtirish yoki ta'mirlash bilan. Shartlar kontraktda belgilanadi." },
      { q: "Montaj qilasizmi yoki faqat yetkazasizmi?", a: `Bazaviy — ta'minot va montaj jamoangizni texnik qo'llab-quvvatlash: sxemalar, sozlash, maslahatlar. Yirik loyihani ishga tushirishga muhandislarimizning ${c.uz.name}ga borishi alohida kelishiladi.` },
    ],
    ctaTitle: "Spetsifikatsiyani yuboring — 24 soatda KP qaytaramiz",
    ctaText: "sales@satsolutions.uz yoki kontaktlar sahifasidagi forma. Muhandis hisoblaydi: vazifa va byudjetga uskuna tanlaymiz, defitsit pozitsiyalarga analoglar taklif qilamiz.",
    ctaButton: "So'rov yuborish",
  },
  en: {
    metaTitle: (c) => `Security equipment supply to ${c.en.name} | SAT Solutions`,
    metaDesc: (c) => `Export of security systems to ${c.en.name} from Uzbekistan: Hikvision and Dahua CCTV, access control, fire systems, MikroTik networking — 3,000+ items from our Tashkent warehouse, export contract, invoice, delivery. ${c.en.cities}.`,
    h1: (c) => `Security equipment supply to ${c.en.name}`,
    intro: (c) => `SAT Solutions supplies security systems and networking equipment to companies and contractors in ${c.en.name}: CCTV, access control, fire alarm, servers and networks. We ship from our own Tashkent warehouse — over 3,000 items by Hikvision, Dahua, ZKTeco, MikroTik, TP-Link and H3C in stock, with no waiting for shipments from China. We work under an export contract with a full document package.`,
    whyTitle: "Why buy from us",
    why: (c) => [
      { t: "A warehouse next door, not overseas", d: `${c.en.delivery} Stock items ship the day of payment — versus weeks of waiting when ordering directly from China.` },
      { t: "Export contract and documents", d: "We prepare the foreign-trade contract, invoice, packing list and equipment certificates. Payment — by currency bank transfer under the contract." },
      { t: "Selection and a quote in 24 hours", d: "Send a specification, a design or simply a task list — an engineer selects the equipment, offers alternatives and returns a quote within a day." },
      { t: "Warranty and support", d: "Warranty obligations are fixed in the contract; replacements go through Tashkent. We advise your installers on configuration remotely." },
    ],
    faqTitle: "Frequently asked questions",
    faq: (c) => [
      { q: `How do we pay from ${c.en.name}?`, a: "We sign an export contract and issue an invoice — payment by currency bank transfer. For regular purchases we agree a frame contract with shipments per request." },
      { q: "How long does delivery take?", a: c.en.delivery + " Pickup from our Tashkent warehouse by your transport or carrier is also possible." },
      { q: "What about the equipment warranty?", a: "The manufacturer's warranty applies; warranty cases are resolved through Tashkent — by replacement or repair. Terms are fixed in the contract." },
      { q: "Do you install or only supply?", a: `The base offer is supply plus technical support of your installation team: diagrams, configuration, advice. Our engineers travelling to ${c.en.name} for commissioning of a large project is discussed separately.` },
    ],
    ctaTitle: "Send a specification — we return a quote in 24 hours",
    ctaText: "sales@satsolutions.uz or the form on the contacts page. An engineer does the numbers: equipment matched to the task and budget, alternatives for scarce items.",
    ctaButton: "Send a request",
  },
  tr: {
    metaTitle: (c) => `${c.tr.name}'a güvenlik ekipmanı tedariki | SAT Solutions`,
    metaDesc: (c) => `Özbekistan'dan ${c.tr.name}'a güvenlik sistemleri ihracatı: Hikvision ve Dahua kameralar, geçiş kontrolü, yangın sistemleri, MikroTik ağ — Taşkent depomuzdan 3.000+ kalem, ihracat sözleşmesi, fatura, teslimat. ${c.tr.cities}.`,
    h1: (c) => `${c.tr.name}'a güvenlik ekipmanı tedariki`,
    intro: (c) => `SAT Solutions, ${c.tr.name}'daki şirket ve yüklenicilere güvenlik sistemleri ve ağ ekipmanı tedarik eder: kameralar, geçiş kontrolü, yangın alarmı, sunucular ve ağlar. Kendi Taşkent depomuzdan sevk ediyoruz — Hikvision, Dahua, ZKTeco, MikroTik, TP-Link ve H3C'den 3.000'i aşkın kalem stokta. İhracat sözleşmesi ve tam evrak paketiyle çalışıyoruz.`,
    whyTitle: "Neden bizden almalısınız",
    why: (c) => [
      { t: "Depo denizaşırı değil, yanı başınızda", d: `${c.tr.delivery} Stok kalemleri ödeme günü sevk edilir — Çin'den doğrudan siparişte haftalarca beklemeye karşı.` },
      { t: "İhracat sözleşmesi ve evraklar", d: "Dış ticaret sözleşmesi, fatura, çeki listesi ve ekipman sertifikalarını hazırlarız. Ödeme — sözleşme kapsamında döviz havalesiyle." },
      { t: "24 saatte seçim ve teklif", d: "Spesifikasyon, proje veya sadece görev listesi gönderin — mühendis ekipmanı seçer, alternatifler önerir ve bir gün içinde teklif döner." },
      { t: "Garanti ve destek", d: "Garanti yükümlülükleri sözleşmede sabitlenir; değişimler Taşkent üzerinden yürür. Montajcılarınıza yapılandırmada uzaktan danışmanlık veririz." },
    ],
    faqTitle: "Sık sorulan sorular",
    faq: (c) => [
      { q: `${c.tr.name}'dan ödeme nasıl yapılır?`, a: "İhracat sözleşmesi imzalar, fatura keseriz — ödeme döviz banka havalesiyle. Düzenli alımlar için talebe göre sevkiyatlı çerçeve sözleşme kararlaştırırız." },
      { q: "Teslimat ne kadar sürer?", a: c.tr.delivery + " Taşkent depomuzdan kendi aracınız veya taşıyıcınızla teslim almak da mümkün." },
      { q: "Ekipman garantisi ne olacak?", a: "Üretici garantisi geçerlidir; garanti vakaları Taşkent üzerinden değişim veya onarımla çözülür. Şartlar sözleşmede sabitlenir." },
      { q: "Montaj yapıyor musunuz yoksa yalnızca tedarik mi?", a: `Temel teklif — tedarik ve montaj ekibinize teknik destek: şemalar, yapılandırma, danışmanlık. Büyük projenin devreye alınması için mühendislerimizin ${c.tr.name}'a gitmesi ayrıca görüşülür.` },
    ],
    ctaTitle: "Spesifikasyonu gönderin — 24 saatte teklif dönelim",
    ctaText: "sales@satsolutions.uz veya iletişim sayfasındaki form. Hesabı mühendis yapar: göreve ve bütçeye uygun ekipman, kıt kalemlere alternatifler.",
    ctaButton: "Talep gönder",
  },
  zh: {
    metaTitle: (c) => `向${c.zh.name}供应安防设备 | SAT Solutions`,
    metaDesc: (c) => `从乌兹别克斯坦向${c.zh.name}出口安防系统：海康和大华监控、门禁、消防系统、MikroTik网络——塔什干仓库3000多种现货，出口合同、形式发票、运输。${c.zh.cities}。`,
    h1: (c) => `向${c.zh.name}供应安防设备`,
    intro: (c) => `SAT Solutions为${c.zh.name}的公司和承包商供应安防系统和网络设备：视频监控、门禁、火灾报警、服务器和网络。从塔什干自有仓库发货——海康、大华、中控、MikroTik、TP-Link、H3C共3000多种现货，无需等待中国发货。按出口合同操作，单据齐全。`,
    whyTitle: "为什么选择我们",
    why: (c) => [
      { t: "仓库就在隔壁，不在海外", d: `${c.zh.delivery} 现货当天付款当天发——相比直接从中国订货的数周等待。` },
      { t: "出口合同与单据", d: "我们准备外贸合同、发票、装箱单和设备证书。付款——按合同银行外汇转账。" },
      { t: "24小时内选型报价", d: "发来清单、设计或任务描述——工程师选型、推荐替代方案，一天内回复报价。" },
      { t: "保修与支持", d: "保修条款写入合同；换货经塔什干办理。远程指导贵方安装队完成配置。" },
    ],
    faqTitle: "常见问题",
    faq: (c) => [
      { q: `从${c.zh.name}如何付款？`, a: "签订出口合同并开具发票——银行外汇转账付款。长期采购可签框架合同，按订单分批发货。" },
      { q: "运输需要多久？", a: c.zh.delivery + " 也可用贵方车辆或承运商到塔什干仓库自提。" },
      { q: "设备保修怎么办？", a: "原厂保修有效；保修问题经塔什干以换货或维修解决。条款在合同中约定。" },
      { q: "你们负责安装还是只供货？", a: `基础方案是供货加对贵方安装队的技术支持：图纸、配置、咨询。大项目调试派工程师赴${c.zh.name}另行商谈。` },
    ],
    ctaTitle: "发来清单——24小时内回复报价",
    ctaText: "sales@satsolutions.uz或联系页表单。由工程师核算：按需求和预算选型，紧缺型号提供替代方案。",
    ctaButton: "发送询价",
  },
};

const pick = (locale: string): Dict => D[locale] ?? D.ru;

export function generateStaticParams() {
  return Object.keys(COUNTRIES).map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; country: string }> }): Promise<Metadata> {
  const { locale, country } = await params;
  const c = COUNTRIES[country];
  if (!c) return {};
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle(c) },
    description: d.metaDesc(c),
    alternates: hreflangAlternates(`/export/${country}`, locale),
    openGraph: { title: d.metaTitle(c), description: d.metaDesc(c), locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function ExportCountryPage({ params }: { params: Promise<{ locale: string; country: string }> }) {
  const { locale, country } = await params;
  const c = COUNTRIES[country];
  if (!c) notFound();
  const d = pick(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: d.h1(c),
        provider: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz", email: "sales@satsolutions.uz" },
        areaServed: { "@type": "Country", name: c.en.name },
        serviceType: "Security equipment export and supply",
      },
      {
        "@type": "FAQPage",
        mainEntity: d.faq(c).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">{d.h1(c)}</h1>
      <p className="mt-5 text-lg text-slate-600 leading-relaxed">{d.intro(c)}</p>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.whyTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {d.why(c).map((w) => (
          <div key={w.t} className="rounded-xl border border-slate-200 p-5 bg-white">
            <div className="font-semibold text-slate-900">{w.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{w.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.faqTitle}</h2>
      <div className="mt-6 space-y-4">
        {d.faq(c).map((f) => (
          <details key={f.q} className="rounded-xl border border-slate-200 bg-white p-5">
            <summary className="font-medium text-slate-900 cursor-pointer">{f.q}</summary>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">{f.a}</p>
          </details>
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
