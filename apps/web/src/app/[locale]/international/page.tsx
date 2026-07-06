// Посадочная для иностранных компаний/инвесторов: security integrator для входящих в Узбекистан.
// Контент 5 локалей инлайном (EN — основной таргет: security company tashkent, cctv installation
// uzbekistan и т.п.; TR/ZH — турецкие подрядчики и китайские компании в УЗ). SEO: FAQPage + Service LD.
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

type Dict = {
  metaTitle: string; metaDesc: string;
  h1: string; intro: string;
  whyTitle: string; why: { t: string; d: string }[];
  servicesTitle: string; services: { t: string; d: string }[];
  faqTitle: string; faq: { q: string; a: string }[];
  ctaTitle: string; ctaText: string; ctaButton: string; ctaCall: string;
};

const D: Record<string, Dict> = {
  en: {
    metaTitle: "Security Systems Integrator in Tashkent, Uzbekistan — CCTV, Fire Alarm, Access Control",
    metaDesc: "Licensed security systems contractor in Tashkent for international companies: CCTV installation, fire alarm systems, access control and turnstiles. English-speaking team, contracts for foreign legal entities, projects across Uzbekistan.",
    h1: "Security systems for international companies in Uzbekistan",
    intro: "SAT Solutions is a licensed security systems integrator based in Tashkent. We help international companies entering Uzbekistan — factories, warehouses, offices, hotels and retail — design, install and maintain CCTV, fire alarm and access control systems that meet local regulations. One contractor, full cycle: survey, design, supply, installation, commissioning and service.",
    whyTitle: "Why international clients choose us",
    why: [
      { t: "Licensed for security & fire systems", d: "State licenses from the National Guard of Uzbekistan (security systems) and the Ministry of Emergency Situations (fire alarm and suppression). Your facility passes local inspections." },
      { t: "3 000+ products in stock in Tashkent", d: "Hikvision, Dahua, ZKTeco, TP-Link, Bolid, Rubezh and more — with our own warehouse, no long import lead times for standard equipment." },
      { t: "English-speaking project manager", d: "Specifications, BOQs, contracts and invoices in English for foreign legal entities. Payment by bank transfer, VAT documents provided." },
      { t: "Projects across Uzbekistan", d: "Installation teams work in Tashkent and travel to any region — SEZ and industrial parks included. References available on request." },
    ],
    servicesTitle: "What we deliver",
    services: [
      { t: "CCTV / video surveillance", d: "IP cameras, NVRs, video analytics, ANPR — design and turnkey installation." },
      { t: "Fire alarm & suppression", d: "Addressable fire alarm (Rubezh, Bolid), voice evacuation, certified to local fire codes." },
      { t: "Access control & turnstiles", d: "Face recognition terminals, card and biometric access, turnstiles and barriers (ZKTeco, Hikvision)." },
      { t: "Networks & structured cabling", d: "LAN/SCS, Wi-Fi, server rooms — the infrastructure your systems run on." },
      { t: "Maintenance & SLA", d: "Scheduled service, spare parts from stock, response times fixed in contract." },
    ],
    faqTitle: "Frequently asked questions",
    faq: [
      { q: "Do you work with foreign legal entities?", a: "Yes. We sign contracts with foreign companies and local subsidiaries, issue invoices and full accounting documents. English versions of documents are provided." },
      { q: "Can you handle a turnkey project outside Tashkent?", a: "Yes. Our teams install systems across Uzbekistan, including special economic zones and industrial parks. Design, supply, installation and commissioning by one contractor." },
      { q: "Are your fire alarm systems accepted by local authorities?", a: "Yes. We hold a Ministry of Emergency Situations license, design to Uzbek fire codes and support the facility during inspection." },
      { q: "How fast can we get a quotation?", a: "Send your floor plan or BOQ to sales@satsolutions.uz — a budget estimate is usually ready within 24 hours, an engineer site visit in Tashkent is free." },
    ],
    ctaTitle: "Start with a free site survey",
    ctaText: "Send your requirements or request a call — we reply within one business day.",
    ctaButton: "Contact us",
    ctaCall: "WhatsApp / Call: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  ru: {
    metaTitle: "Системы безопасности для иностранных компаний в Узбекистане",
    metaDesc: "Лицензированный интегратор систем безопасности в Ташкенте для иностранных компаний: видеонаблюдение, пожарная сигнализация, СКУД. Договоры с иностранными юрлицами, документы на английском, проекты по всему Узбекистану.",
    h1: "Системы безопасности для иностранных компаний в Узбекистане",
    intro: "SAT Solutions — лицензированный интегратор систем безопасности в Ташкенте. Помогаем иностранным компаниям, выходящим на рынок Узбекистана — заводам, складам, офисам, отелям и ритейлу — спроектировать, смонтировать и обслуживать видеонаблюдение, пожарную сигнализацию и СКУД в соответствии с местными нормами. Один подрядчик — полный цикл: обследование, проект, поставка, монтаж, пусконаладка, сервис.",
    whyTitle: "Почему нас выбирают международные клиенты",
    why: [
      { t: "Лицензии на охранные и пожарные системы", d: "Гослицензии Национальной гвардии РУз (охранные системы) и МЧС РУз (пожарная сигнализация и пожаротушение). Объект проходит местные проверки." },
      { t: "3 000+ товаров на складе в Ташкенте", d: "Hikvision, Dahua, ZKTeco, TP-Link, Болид, Рубеж — собственный склад, без долгих сроков импорта." },
      { t: "Англоговорящий менеджер проекта", d: "Спецификации, сметы, договоры и счета на английском для иностранных юрлиц. Оплата по перечислению, документы для бухгалтерии." },
      { t: "Проекты по всему Узбекистану", d: "Монтажные бригады работают в Ташкенте и выезжают в любой регион, включая СЭЗ и индустриальные парки." },
    ],
    servicesTitle: "Что мы делаем",
    services: [
      { t: "Видеонаблюдение", d: "IP-камеры, регистраторы, видеоаналитика, распознавание номеров — проект и монтаж под ключ." },
      { t: "Пожарная сигнализация", d: "Адресные системы (Рубеж, Болид), оповещение и эвакуация, сертификация по нормам РУз." },
      { t: "СКУД и турникеты", d: "Терминалы распознавания лиц, карты и биометрия, турникеты и шлагбаумы (ZKTeco, Hikvision)." },
      { t: "Сети и СКС", d: "ЛВС, Wi-Fi, серверные — инфраструктура, на которой работают системы." },
      { t: "Обслуживание и SLA", d: "Плановый сервис, запчасти со склада, время реакции фиксируется договором." },
    ],
    faqTitle: "Частые вопросы",
    faq: [
      { q: "Работаете ли вы с иностранными юрлицами?", a: "Да. Заключаем договоры с иностранными компаниями и их местными «дочками», выставляем счета и полный пакет бухгалтерских документов, при необходимости — версии на английском." },
      { q: "Делаете ли проекты под ключ за пределами Ташкента?", a: "Да, бригады работают по всему Узбекистану, включая СЭЗ и индустриальные парки. Проект, поставка, монтаж и пусконаладка — один подрядчик." },
      { q: "Примут ли вашу пожарную систему надзорные органы?", a: "Да. У нас лицензия МЧС, проектируем по нормам РУз и сопровождаем объект при проверке." },
      { q: "Как быстро получить смету?", a: "Пришлите план помещений или спецификацию на sales@satsolutions.uz — предварительная смета обычно готова в течение 24 часов, выезд инженера по Ташкенту бесплатный." },
    ],
    ctaTitle: "Начните с бесплатного обследования объекта",
    ctaText: "Отправьте требования или закажите звонок — ответим в течение рабочего дня.",
    ctaButton: "Связаться с нами",
    ctaCall: "WhatsApp / Телефон: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  uz: {
    metaTitle: "O'zbekistondagi xorijiy kompaniyalar uchun xavfsizlik tizimlari",
    metaDesc: "Toshkentdagi litsenziyalangan integrator: videokuzatuv, yong'in signalizatsiyasi, SKUD. Xorijiy yuridik shaxslar bilan shartnomalar, butun O'zbekiston bo'ylab loyihalar.",
    h1: "O'zbekistondagi xorijiy kompaniyalar uchun xavfsizlik tizimlari",
    intro: "SAT Solutions — Toshkentdagi litsenziyalangan xavfsizlik tizimlari integratori. O'zbekiston bozoriga kirayotgan xorijiy kompaniyalarga — zavodlar, omborlar, ofislar, mehmonxonalarga — mahalliy talablarga mos videokuzatuv, yong'in signalizatsiyasi va SKUD tizimlarini loyihalash, o'rnatish va xizmat ko'rsatishda yordam beramiz. Bitta pudratchi — to'liq sikl.",
    whyTitle: "Nega xalqaro mijozlar bizni tanlaydi",
    why: [
      { t: "Davlat litsenziyalari", d: "Milliy gvardiya (qo'riqlash tizimlari) va FVV (yong'in tizimlari) litsenziyalari — obyekt mahalliy tekshiruvlardan o'tadi." },
      { t: "Toshkentda 3 000+ tovar omborda", d: "Hikvision, Dahua, ZKTeco, TP-Link, Bolid, Rubej — o'z omborimiz, uzoq import muddatlarisiz." },
      { t: "Ingliz tilida hujjatlar", d: "Xorijiy yuridik shaxslar uchun smeta, shartnoma va hisob-fakturalar ingliz tilida." },
      { t: "Butun O'zbekiston bo'ylab", d: "Montaj brigadalari Toshkentda va istalgan hududda, EIZ va sanoat parklarida ishlaydi." },
    ],
    servicesTitle: "Xizmatlarimiz",
    services: [
      { t: "Videokuzatuv", d: "IP-kameralar, registratorlar, videoanalitika — loyiha va montaj." },
      { t: "Yong'in signalizatsiyasi", d: "Manzilli tizimlar (Rubej, Bolid), ogohlantirish, mahalliy me'yorlar bo'yicha." },
      { t: "SKUD va turniketlar", d: "Yuz aniqlash terminallari, kartalar, biometriya (ZKTeco, Hikvision)." },
      { t: "Tarmoqlar va SKS", d: "LAN, Wi-Fi, server xonalari." },
      { t: "Servis va SLA", d: "Rejali xizmat, ombordan ehtiyot qismlar, shartnomada belgilangan javob vaqti." },
    ],
    faqTitle: "Ko'p so'raladigan savollar",
    faq: [
      { q: "Xorijiy yuridik shaxslar bilan ishlaysizmi?", a: "Ha. Xorijiy kompaniyalar va ularning mahalliy sho''ba korxonalari bilan shartnoma tuzamiz, to'liq hujjatlar paketini beramiz." },
      { q: "Toshkentdan tashqarida loyihalar qilasizmi?", a: "Ha, brigadalarimiz butun O'zbekiston bo'ylab, jumladan EIZ va sanoat parklarida ishlaydi." },
      { q: "Yong'in tizimingizni nazorat organlari qabul qiladimi?", a: "Ha. FVV litsenziyamiz bor, O'zbekiston me'yorlari bo'yicha loyihalaymiz va tekshiruvda hamrohlik qilamiz." },
      { q: "Smetani qancha vaqtda olamiz?", a: "Reja yoki spetsifikatsiyani sales@satsolutions.uz ga yuboring — smeta odatda 24 soat ichida tayyor." },
    ],
    ctaTitle: "Bepul obyekt ko'rigidan boshlang",
    ctaText: "Talablaringizni yuboring yoki qo'ng'iroq buyurtma qiling.",
    ctaButton: "Bog'lanish",
    ctaCall: "WhatsApp / Tel: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  tr: {
    metaTitle: "Özbekistan'da Yabancı Şirketler için Güvenlik Sistemleri — Taşkent",
    metaDesc: "Taşkent'te lisanslı güvenlik sistemleri entegratörü: kamera sistemleri (CCTV), yangın alarm, geçiş kontrol ve turnikeler. Yabancı tüzel kişilerle sözleşme, tüm Özbekistan'da projeler.",
    h1: "Özbekistan'da yabancı şirketler için güvenlik sistemleri",
    intro: "SAT Solutions, Taşkent merkezli lisanslı bir güvenlik sistemleri entegratörüdür. Özbekistan pazarına giren yabancı şirketlere — fabrikalar, depolar, ofisler, oteller — yerel mevzuata uygun CCTV, yangın alarm ve geçiş kontrol sistemlerinin projelendirilmesi, kurulumu ve bakımında destek veriyoruz. Tek yüklenici, tam döngü: keşif, proje, tedarik, montaj, devreye alma ve servis.",
    whyTitle: "Uluslararası müşteriler neden bizi seçiyor",
    why: [
      { t: "Güvenlik ve yangın sistemleri lisansları", d: "Özbekistan Ulusal Muhafızları (güvenlik) ve Acil Durumlar Bakanlığı (yangın) devlet lisansları — tesisiniz yerel denetimlerden geçer." },
      { t: "Taşkent'te stokta 3 000+ ürün", d: "Hikvision, Dahua, ZKTeco, TP-Link, Bolid, Rubej — kendi depomuz, uzun ithalat süreleri yok." },
      { t: "İngilizce dokümantasyon", d: "Yabancı tüzel kişiler için şartname, sözleşme ve faturalar İngilizce hazırlanır. Banka havalesiyle ödeme." },
      { t: "Tüm Özbekistan'da projeler", d: "Montaj ekiplerimiz Taşkent'te ve tüm bölgelerde — serbest ekonomik bölgeler ve sanayi parkları dahil — çalışır." },
    ],
    servicesTitle: "Hizmetlerimiz",
    services: [
      { t: "CCTV / kamera sistemleri", d: "IP kameralar, NVR, video analitik, plaka tanıma — anahtar teslim kurulum." },
      { t: "Yangın alarm sistemleri", d: "Adresli sistemler (Rubej, Bolid), sesli tahliye, yerel yangın mevzuatına uygun." },
      { t: "Geçiş kontrol ve turnikeler", d: "Yüz tanıma terminalleri, kart ve biyometri, turnike ve bariyerler (ZKTeco, Hikvision)." },
      { t: "Ağ ve yapısal kablolama", d: "LAN/SCS, Wi-Fi, sistem odaları." },
      { t: "Bakım ve SLA", d: "Planlı servis, stoktan yedek parça, sözleşmeyle sabitlenen müdahale süreleri." },
    ],
    faqTitle: "Sık sorulan sorular",
    faq: [
      { q: "Yabancı tüzel kişilerle çalışıyor musunuz?", a: "Evet. Yabancı şirketler ve yerel iştirakleriyle sözleşme imzalıyor, fatura ve tam muhasebe evrakı düzenliyoruz." },
      { q: "Taşkent dışında anahtar teslim proje yapıyor musunuz?", a: "Evet. Ekiplerimiz tüm Özbekistan'da, serbest bölgeler ve sanayi parkları dahil, kurulum yapar." },
      { q: "Yangın sisteminiz yerel makamlarca kabul ediliyor mu?", a: "Evet. Acil Durumlar Bakanlığı lisansımız var, Özbek mevzuatına göre projelendiriyoruz." },
      { q: "Teklifi ne kadar sürede alırız?", a: "Planınızı veya keşif listenizi sales@satsolutions.uz adresine gönderin — bütçe teklifi genellikle 24 saat içinde hazır." },
    ],
    ctaTitle: "Ücretsiz keşifle başlayın",
    ctaText: "Gereksinimlerinizi gönderin veya arama talep edin — bir iş günü içinde yanıt veriyoruz.",
    ctaButton: "İletişime geçin",
    ctaCall: "WhatsApp / Tel: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  zh: {
    metaTitle: "乌兹别克斯坦外资企业安防系统 — 塔什干 CCTV、消防报警、门禁",
    metaDesc: "塔什干持牌安防系统集成商，服务进入乌兹别克斯坦的外资企业：视频监控安装、消防报警系统、门禁与闸机。可与外国法人签约，项目覆盖全乌兹别克斯坦。",
    h1: "为进入乌兹别克斯坦的外资企业提供安防系统",
    intro: "SAT Solutions 是一家位于塔什干的持牌安防系统集成商。我们帮助进入乌兹别克斯坦的外资企业——工厂、仓库、办公室、酒店和零售——设计、安装并维护符合当地法规的视频监控、消防报警和门禁系统。一个承包商，全流程服务：勘察、设计、供货、安装、调试和维保。",
    whyTitle: "国际客户选择我们的理由",
    why: [
      { t: "安防与消防系统国家牌照", d: "持有乌兹别克斯坦国民近卫军（安防系统）和紧急情况部（消防系统）颁发的国家许可证，项目可顺利通过当地验收。" },
      { t: "塔什干现货库存 3000+ 种产品", d: "海康威视、大华、ZKTeco、TP-Link、Bolid、Rubezh 等品牌自有仓库，无需漫长进口周期。" },
      { t: "英文项目文档", d: "为外国法人提供英文规格书、合同与发票，支持银行转账，提供全套财务凭证。" },
      { t: "项目覆盖全乌兹别克斯坦", d: "安装团队常驻塔什干，可赴任何地区施工，包括经济特区和工业园区。" },
    ],
    servicesTitle: "服务内容",
    services: [
      { t: "视频监控 (CCTV)", d: "IP 摄像机、录像机、视频分析、车牌识别——设计与交钥匙安装。" },
      { t: "消防报警系统", d: "总线制系统（Rubezh、Bolid）、语音疏散，符合当地消防规范认证。" },
      { t: "门禁与闸机", d: "人脸识别终端、刷卡与生物识别、闸机和道闸（ZKTeco、海康威视）。" },
      { t: "网络与综合布线", d: "局域网、Wi-Fi、机房——系统运行的基础设施。" },
      { t: "维保与 SLA", d: "计划性维护、现货备件、合同约定响应时间。" },
    ],
    faqTitle: "常见问题",
    faq: [
      { q: "你们与外国法人签约吗？", a: "是的。我们与外国公司及其本地子公司签订合同，开具发票和全套会计凭证，可提供英文版本文件。" },
      { q: "塔什干以外的交钥匙项目能做吗？", a: "可以。我们的团队在全乌兹别克斯坦施工，包括经济特区和工业园区。设计、供货、安装、调试由一个承包商完成。" },
      { q: "你们的消防系统能通过当地部门验收吗？", a: "能。我们持有紧急情况部许可证，按乌兹别克斯坦消防规范设计，并在验收时提供支持。" },
      { q: "多快能拿到报价？", a: "将平面图或设备清单发送至 sales@satsolutions.uz——预算报价通常 24 小时内完成，塔什干市内工程师上门勘察免费。" },
    ],
    ctaTitle: "从免费现场勘察开始",
    ctaText: "发送您的需求或预约通话——我们将在一个工作日内回复。",
    ctaButton: "联系我们",
    ctaCall: "WhatsApp / 电话: +998 99 554-69-69 · sales@satsolutions.uz",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
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
        provider: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz", telephone: "+998-99-554-69-69", email: "sales@satsolutions.uz" },
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
