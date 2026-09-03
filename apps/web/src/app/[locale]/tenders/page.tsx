// «Поставки и тендеры» — посадочная для снабженцев и тендерных отделов: закупки
// оборудования и работ у лицензированного поставщика. Контент 5 локалей инлайном
// (по образцу /international). SEO: FAQPage + Service LD. Ключи: «поставщик систем
// безопасности», «тендер видеонаблюдение», «закупка оборудования безопасности».
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

type Dict = {
  metaTitle: string; metaDesc: string;
  h1: string; intro: string;
  whyTitle: string; why: { t: string; d: string }[];
  factsTitle: string; facts: { t: string; d: string }[];
  faqTitle: string; faq: { q: string; a: string }[];
  ctaTitle: string; ctaText: string; ctaButton: string; docsLink: string;
};

const D: Record<string, Dict> = {
  ru: {
    metaTitle: "Поставки и тендеры — оборудование систем безопасности | SAT Solutions",
    metaDesc: "Поставщик систем безопасности для тендеров и корпоративных закупок: 3000+ позиций со склада в Ташкенте, КП и спецификации под тендер за 24 часа, лицензии, счёт с НДС, договор поставки, доставка по Узбекистану.",
    h1: "Поставки оборудования и участие в тендерах",
    intro: "SAT Solutions — поставщик и монтажный подрядчик для корпоративных закупок и тендеров: видеонаблюдение, пожарная сигнализация, СКУД, сети и серверы. Готовим коммерческие предложения и спецификации под требования закупки, поставляем со своего склада в Ташкенте и выполняем работы по лицензиям Национальной гвардии и МЧС РУз.",
    whyTitle: "Что получает тендерный отдел",
    why: [
      { t: "КП и спецификация за 24 часа", d: "Считаем по вашей спецификации, ТЗ или дефектной ведомости. Предложим аналоги при дефиците позиций — с обоснованием соответствия." },
      { t: "3000+ позиций со склада", d: "Hikvision, Dahua, ZKTeco, Болид, Рубеж, TP-Link, MikroTik, H3C. Складские позиции отгружаем в день оплаты, остальное — короткими сроками поставки." },
      { t: "Полный пакет документов", d: "Договор поставки или подряда, счёт с НДС, накладные и акты, сертификаты и паспорта на оборудование, гарантийные обязательства." },
      { t: "Лицензии на работы", d: "Монтаж охранных систем — лицензия Национальной гвардии; пожарная сигнализация и оповещение — лицензия МЧС. Сдаём объекты надзорным органам." },
    ],
    factsTitle: "Реквизиты для тендерной документации",
    facts: [
      { t: "Компания", d: "ООО «SAT SOLUTIONS», ИНН 308603912, г. Ташкент, ул. Катта Дархон, 5" },
      { t: "Опыт", d: "На рынке с 2021 года: Uzum, Ucell, Damira Beverages, ЖК Tower Up и другие проекты — кейсы в разделе «Портфолио»" },
      { t: "География", d: "Поставки и монтажные бригады — Ташкент и все регионы Узбекистана" },
      { t: "Партнёрства", d: "Сертифицированный партнёр H3C, интегратор Dahua, авторизованный партнёр Lenovo 360 и Eltex — сертификаты на странице «О компании»" },
    ],
    faqTitle: "Частые вопросы снабженцев",
    faq: [
      { q: "Работаете ли вы через платформы госзакупок?", a: "Да, участвуем в корпоративных и государственных закупках: готовим предложения по требованиям площадок, отгружаем по договору с отсрочкой согласно условиям закупки." },
      { q: "Можете ли поставить только оборудование, без монтажа?", a: "Да, поставка — самостоятельное направление: комплектуем объект по спецификации заказчика или проекту, монтаж может выполнять ваш подрядчик." },
      { q: "Даёте ли отсрочку платежа?", a: "Для юридических лиц с договором — обсуждаем отсрочку в зависимости от суммы и истории работы. Для тендерных поставок следуем условиям закупочной документации." },
      { q: "Как быстро вы считаете большие спецификации?", a: "Типовая спецификация до 100 позиций — в течение рабочего дня. Большие ведомости и проекты со сметами — 2–3 дня с проверкой совместимости оборудования." },
    ],
    ctaTitle: "Пришлите спецификацию — вернём КП за 24 часа",
    ctaText: "sales@satsolutions.uz или форма на странице контактов. Приложите спецификацию, ТЗ или проект — предложение подготовит инженер, а не менеджер по прайсу.",
    ctaButton: "Отправить запрос",
    docsLink: "Лицензии и сертификаты — на странице «О компании»",
  },
  uz: {
    metaTitle: "Ta'minot va tenderlar — xavfsizlik tizimlari uskunalari | SAT Solutions",
    metaDesc: "Tender va korporativ xaridlar uchun xavfsizlik tizimlari yetkazib beruvchisi: Toshkentdagi ombordan 3000+ pozitsiya, 24 soatda tender uchun KP va spetsifikatsiya, litsenziyalar, QQS li hisob, yetkazib berish.",
    h1: "Uskunalar ta'minoti va tenderlarda ishtirok",
    intro: "SAT Solutions — korporativ xaridlar va tenderlar uchun yetkazib beruvchi va montaj pudratchisi: videokuzatuv, yong'in signalizatsiyasi, SKUD, tarmoq va serverlar. Xarid talablariga mos tijorat takliflari va spetsifikatsiyalar tayyorlaymiz, Toshkentdagi omborimizdan yetkazamiz va Milliy gvardiya hamda FVV litsenziyalari bo'yicha ishlarni bajaramiz.",
    whyTitle: "Tender bo'limi nima oladi",
    why: [
      { t: "24 soatda KP va spetsifikatsiya", d: "Sizning spetsifikatsiya, TV yoki nuqson vedomosti bo'yicha hisoblaymiz. Yetishmagan pozitsiyalarga asoslangan analoglar taklif qilamiz." },
      { t: "Ombordan 3000+ pozitsiya", d: "Hikvision, Dahua, ZKTeco, Bolid, Rubej, TP-Link, MikroTik, H3C. Ombor pozitsiyalari to'lov kunida jo'natiladi." },
      { t: "To'liq hujjatlar paketi", d: "Ta'minot yoki pudrat shartnomasi, QQS li hisob, nakladnoy va aktlar, uskunalarga sertifikat va pasportlar, kafolat majburiyatlari." },
      { t: "Ishlarga litsenziyalar", d: "Qo'riqlash tizimlari montaji — Milliy gvardiya litsenziyasi; yong'in signalizatsiyasi — FVV litsenziyasi. Obyektlarni nazorat organlariga topshiramiz." },
    ],
    factsTitle: "Tender hujjatlari uchun rekvizitlar",
    facts: [
      { t: "Kompaniya", d: "«SAT SOLUTIONS» MChJ, STIR 308603912, Toshkent sh., Katta Darxon ko'chasi, 5" },
      { t: "Tajriba", d: "Bozorda 2021 yildan: Uzum, Ucell, Damira Beverages, Tower Up TJM va boshqa loyihalar — keyslar «Portfolio» bo'limida" },
      { t: "Geografiya", d: "Ta'minot va montaj brigadalari — Toshkent va O'zbekistonning barcha viloyatlari" },
      { t: "Hamkorliklar", d: "H3C sertifikatlangan hamkori, Dahua integratori, Lenovo 360 va Eltex vakolatli hamkori — sertifikatlar «Kompaniya haqida» sahifasida" },
    ],
    faqTitle: "Ta'minotchilarning tez-tez savollari",
    faq: [
      { q: "Davlat xaridlari platformalari orqali ishlaysizlarmi?", a: "Ha, korporativ va davlat xaridlarida qatnashamiz: maydonchalar talablariga mos takliflar tayyorlaymiz, xarid shartlariga ko'ra kechiktirib to'lash bilan jo'natamiz." },
      { q: "Montajsiz faqat uskuna yetkazib bera olasizlarmi?", a: "Ha, ta'minot — mustaqil yo'nalish: obyektni buyurtmachi spetsifikatsiyasi yoki loyihasi bo'yicha butlaymiz, montajni pudratchingiz bajarishi mumkin." },
      { q: "To'lovni kechiktirish berasizlarmi?", a: "Shartnomali yuridik shaxslarga — summa va ish tarixiga qarab kechiktirishni kelishamiz. Tender ta'minotida xarid hujjatlari shartlariga amal qilamiz." },
      { q: "Katta spetsifikatsiyalarni qancha tez hisoblaysizlar?", a: "100 pozitsiyagacha odatiy spetsifikatsiya — ish kuni davomida. Katta vedomost va smetali loyihalar — moslikni tekshirish bilan 2–3 kun." },
    ],
    ctaTitle: "Spetsifikatsiyani yuboring — 24 soatda KP qaytaramiz",
    ctaText: "sales@satsolutions.uz yoki kontaktlar sahifasidagi forma. Spetsifikatsiya, TV yoki loyihani ilova qiling — taklifni prays menejeri emas, muhandis tayyorlaydi.",
    ctaButton: "So'rov yuborish",
    docsLink: "Litsenziya va sertifikatlar — «Kompaniya haqida» sahifasida",
  },
  en: {
    metaTitle: "Procurement & Tenders — Security Equipment Supply | SAT Solutions",
    metaDesc: "Security systems supplier for tenders and corporate procurement in Uzbekistan: 3,000+ items in Tashkent stock, quotations and BOQs within 24 hours, state licenses, VAT invoicing, delivery nationwide.",
    h1: "Equipment supply and tender participation",
    intro: "SAT Solutions is a supplier and installation contractor for corporate procurement and tenders: CCTV, fire alarm, access control, networks and servers. We prepare quotations and specifications to procurement requirements, ship from our own Tashkent warehouse and carry out works under National Guard and MES licenses.",
    whyTitle: "What the procurement team gets",
    why: [
      { t: "Quotation and BOQ within 24 hours", d: "We price your specification, brief or defect list, and propose justified equivalents for unavailable items." },
      { t: "3,000+ items in stock", d: "Hikvision, Dahua, ZKTeco, Bolid, Rubezh, TP-Link, MikroTik, H3C. Stock items ship on the day of payment." },
      { t: "Full document package", d: "Supply or works contract, VAT invoices, delivery notes and acts, equipment certificates and passports, warranty obligations." },
      { t: "Licensed works", d: "Security systems — National Guard license; fire alarm and evacuation — MES license. We hand facilities over to the authorities." },
    ],
    factsTitle: "Details for tender documentation",
    facts: [
      { t: "Company", d: "SAT SOLUTIONS LLC, TIN 308603912, 5 Katta Darkhon st., Tashkent" },
      { t: "Track record", d: "On the market since 2021: Uzum, Ucell, Damira Beverages, Tower Up and more — cases in the Portfolio section" },
      { t: "Geography", d: "Supply and installation teams across Tashkent and all regions of Uzbekistan" },
      { t: "Partnerships", d: "Certified H3C partner, Dahua integrator, authorised Lenovo 360 and Eltex partner — certificates on the About page" },
    ],
    faqTitle: "Frequent procurement questions",
    faq: [
      { q: "Do you work through public procurement platforms?", a: "Yes, we participate in corporate and state procurement: preparing bids to platform requirements and shipping under contract with deferred payment per procurement terms." },
      { q: "Can you supply equipment only, without installation?", a: "Yes — supply is a standalone line: we kit the site to your specification or design, and your contractor may install." },
      { q: "Do you offer deferred payment?", a: "For contracted legal entities — negotiable depending on amount and history. For tender supplies we follow the procurement terms." },
      { q: "How fast do you price large specifications?", a: "A typical specification up to 100 lines — within a business day. Large BOQs and designs with budgets — 2–3 days including compatibility checks." },
    ],
    ctaTitle: "Send the specification — a quotation comes back within 24 hours",
    ctaText: "sales@satsolutions.uz or the contact form. Attach the specification, brief or design — an engineer prepares the offer, not a price-list manager.",
    ctaButton: "Send a request",
    docsLink: "Licenses and certificates — on the About page",
  },
  tr: {
    metaTitle: "Tedarik ve İhaleler — Güvenlik Ekipmanı | SAT Solutions",
    metaDesc: "Özbekistan'da ihale ve kurumsal satın almalar için güvenlik sistemleri tedarikçisi: Taşkent stoğunda 3.000+ kalem, 24 saatte teklif ve keşif, devlet lisansları, KDV faturası, ülke geneli teslimat.",
    h1: "Ekipman tedariki ve ihale katılımı",
    intro: "SAT Solutions, kurumsal satın almalar ve ihaleler için tedarikçi ve montaj yüklenicisidir: CCTV, yangın alarmı, geçiş kontrolü, ağlar ve sunucular. Satın alma şartlarına uygun teklif ve şartnameler hazırlar, Taşkent'teki kendi depomuzdan sevk eder, Ulusal Muhafız ve Acil Durumlar Bakanlığı lisanslarıyla işleri yürütürüz.",
    whyTitle: "Satın alma ekibi ne kazanır",
    why: [
      { t: "24 saatte teklif ve keşif", d: "Şartnamenize veya eksik listenize göre fiyatlandırırız; bulunmayan kalemlere gerekçeli muadiller öneririz." },
      { t: "Stokta 3.000+ kalem", d: "Hikvision, Dahua, ZKTeco, Bolid, Rubezh, TP-Link, MikroTik, H3C. Stok kalemleri ödeme günü sevk edilir." },
      { t: "Tam evrak paketi", d: "Tedarik veya iş sözleşmesi, KDV faturaları, irsaliye ve tutanaklar, ekipman sertifikaları, garanti taahhütleri." },
      { t: "Lisanslı işler", d: "Güvenlik sistemleri — Ulusal Muhafız lisansı; yangın alarmı — Acil Durumlar Bakanlığı lisansı. Tesisleri makamlara teslim ederiz." },
    ],
    factsTitle: "İhale dosyası için bilgiler",
    facts: [
      { t: "Şirket", d: "SAT SOLUTIONS LLC, VKN 308603912, Katta Darxon cad. 5, Taşkent" },
      { t: "Referanslar", d: "2021'den beri: Uzum, Ucell, Damira Beverages, Tower Up — vakalar Portföy bölümünde" },
      { t: "Coğrafya", d: "Tedarik ve montaj ekipleri — Taşkent ve tüm Özbekistan" },
      { t: "Ortaklıklar", d: "Sertifikalı H3C ortağı, Dahua entegratörü, yetkili Lenovo 360 ve Eltex ortağı — sertifikalar Hakkımızda sayfasında" },
    ],
    faqTitle: "Sık sorulan satın alma soruları",
    faq: [
      { q: "Kamu ihale platformaları üzerinden çalışıyor musunuz?", a: "Evet, kurumsal ve kamu alımlarına katılıyoruz: platform şartlarına göre teklif hazırlar, alım koşullarına göre vadeli sevk ederiz." },
      { q: "Montajsız yalnız ekipman tedarik eder misiniz?", a: "Evet — tedarik bağımsız bir hattır: tesisi şartnamenize göre donatırız, montajı sizin yükleniciniz yapabilir." },
      { q: "Vadeli ödeme var mı?", a: "Sözleşmeli kurumlara — tutara ve geçmişe göre görüşülür. İhale tedariklerinde alım şartlarına uyarız." },
      { q: "Büyük şartnameleri ne kadar sürede fiyatlandırırsınız?", a: "100 kaleme kadar tipik şartname — bir iş günü içinde. Büyük keşifler ve bütçeli projeler — uyumluluk kontrolüyle 2–3 gün." },
    ],
    ctaTitle: "Şartnameyi gönderin — teklif 24 saatte gelsin",
    ctaText: "sales@satsolutions.uz veya iletişim formu. Şartname veya projeyi ekleyin — teklifi fiyat listesi görevlisi değil mühendis hazırlar.",
    ctaButton: "Talep gönder",
    docsLink: "Lisans ve sertifikalar — Hakkımızda sayfasında",
  },
  zh: {
    metaTitle: "采购与投标——安防设备供应 | SAT Solutions",
    metaDesc: "乌兹别克斯坦招投标与企业采购的安防系统供应商：塔什干现货 3000+ 种，24 小时内出报价与清单，持国家执照，开增值税发票，全国配送。",
    h1: "设备供应与投标参与",
    intro: "SAT Solutions 是面向企业采购与招投标的供应商与安装承包商：视频监控、消防报警、门禁、网络与服务器。按采购要求编制报价与规格书，从塔什干自有仓库发货，并持国民卫队与紧急情况部执照施工。",
    whyTitle: "采购部门得到什么",
    why: [
      { t: "24 小时出报价与清单", d: "按您的规格书、任务书或缺陷清单计价；缺货品目提供有依据的替代方案。" },
      { t: "现货 3000+ 种", d: "海康威视、大华、中控智慧、Bolid、Rubezh、TP-Link、MikroTik、H3C。现货当天付款当天发货。" },
      { t: "全套单据", d: "供货或施工合同、增值税发票、送货单与验收单、设备证书与说明书、保修承诺。" },
      { t: "持照施工", d: "安防系统——国民卫队执照；消防报警与疏散——紧急情况部执照。协助向主管部门交付。" },
    ],
    factsTitle: "投标文件所需信息",
    facts: [
      { t: "公司", d: "SAT SOLUTIONS 有限公司，税号 308603912，塔什干市 Katta Darxon 街 5 号" },
      { t: "业绩", d: "2021 年至今：Uzum、Ucell、Damira Beverages、Tower Up 等——案例见作品集" },
      { t: "覆盖范围", d: "供货与安装团队覆盖塔什干及乌兹别克斯坦全境" },
      { t: "合作资质", d: "H3C 认证合作伙伴、大华集成商、联想 360 与 Eltex 授权伙伴——证书见公司简介页" },
    ],
    faqTitle: "采购常见问题",
    faq: [
      { q: "你们通过公共采购平台合作吗？", a: "是——我们参与企业与政府采购：按平台要求投标，按采购条款以约定账期供货。" },
      { q: "可以只供货不施工吗？", a: "可以——供货是独立业务：按您的规格书或设计配齐设备，施工可由贵方承包商完成。" },
      { q: "提供账期吗？", a: "对签约企业——按金额与合作历史协商；投标供货遵循采购文件条款。" },
      { q: "大清单多快能报价？", a: "100 项以内的常规清单当个工作日完成；大型清单及带预算的设计 2–3 天，含兼容性核验。" },
    ],
    ctaTitle: "发来规格书——24 小时内回报价",
    ctaText: "sales@satsolutions.uz 或联系页表单。附上规格书、任务书或设计——由工程师而非报价员为您编制方案。",
    ctaButton: "发送询价",
    docsLink: "执照与证书——见公司简介页",
  },
};

const pick = (locale: string): Dict => D[locale] ?? D.ru;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: d.metaDesc,
    alternates: hreflangAlternates("/tenders", locale),
    openGraph: { title: d.metaTitle, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function TendersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = pick(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: d.h1,
        provider: { "@type": "Organization", name: "SAT Solutions", url: "https://satsolutions.uz", email: "sales@satsolutions.uz" },
        areaServed: { "@type": "Country", name: "Uzbekistan" },
        serviceType: "Security equipment supply, tenders and corporate procurement",
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

      <h2 className="mt-12 text-2xl font-semibold text-slate-900">{d.factsTitle}</h2>
      <div className="mt-6 grid sm:grid-cols-2 gap-5">
        {d.facts.map((f) => (
          <div key={f.t} className="rounded-xl border border-slate-200 p-5 bg-slate-50">
            <div className="font-semibold text-slate-900">{f.t}</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{f.d}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-slate-500">
        <Link href="/about" className="text-brand-700 font-semibold hover:underline">{d.docsLink}</Link>
      </p>

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
        <div className="mt-6">
          <Link href="/contact" className="inline-flex items-center rounded-lg bg-white text-slate-900 px-6 py-3 font-semibold hover:bg-slate-100 transition">
            {d.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
