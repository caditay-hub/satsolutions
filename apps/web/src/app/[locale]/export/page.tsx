// Индекс экспортного раздела: /export раньше отдавал 404, хотя /export/tajikistan и
// /export/turkmenistan живые и стоят в sitemap. Редирект на /international был бы
// смысловой подменой (та страница — про иностранные компании ВНУТРИ Узбекистана),
// поэтому делаем хаб: короткий текст + карточки стран. Заодно это входящие ссылки
// на страницы-сироты. Контент инлайном на 5 локалях — как в /export/[country].
import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

type CountryCard = { slug: string; name: string; cities: string; delivery: string };
type Dict = {
  metaTitle: string; metaDesc: string;
  h1: string; intro: string;
  countriesTitle: string; countries: CountryCard[];
  citiesLabel: string; more: string;
  whyTitle: string; why: { t: string; d: string }[];
  ctaTitle: string; ctaText: string; ctaButton: string;
};

const D: Record<string, Dict> = {
  ru: {
    metaTitle: "Экспорт систем безопасности из Узбекистана | SAT Solutions",
    metaDesc: "Поставки оборудования безопасности из Ташкента в страны Центральной Азии: Таджикистан и Туркменистан. Видеонаблюдение, СКУД, пожарная сигнализация, сети — 3000+ позиций со склада, экспортный контракт и документы.",
    h1: "Экспорт оборудования безопасности из Узбекистана",
    intro: "SAT Solutions отгружает системы безопасности и сетевое оборудование подрядчикам и компаниям соседних стран со своего склада в Ташкенте. Более 3000 позиций Hikvision, Dahua, ZKTeco, MikroTik, TP-Link и H3C в наличии — без многонедельного ожидания поставки из Китая. Работаем по экспортному контракту с полным пакетом документов.",
    countriesTitle: "Куда поставляем",
    countries: [
      { slug: "tajikistan", name: "Таджикистан", cities: "Душанбе, Худжанд, Бохтар", delivery: "Автодоставка со склада в Ташкенте: до Худжанда — 1–2 дня, до Душанбе — 2–3 дня." },
      { slug: "turkmenistan", name: "Туркменистан", cities: "Ашхабад, Туркменабад, Мары", delivery: "Автодоставка до границы или до объекта — сроки и маршрут согласуем под заказ." },
    ],
    citiesLabel: "Города",
    more: "Подробнее о поставках",
    whyTitle: "Почему закупаться в Ташкенте",
    why: [
      { t: "Склад рядом, а не за морем", d: "Складские позиции отгружаем в день оплаты — против недель ожидания при заказе напрямую из Китая." },
      { t: "Экспортный контракт и документы", d: "Контракт ВЭД, инвойс, упаковочный лист и сертификаты на оборудование. Оплата — валютным переводом по контракту." },
      { t: "Подбор и КП за 24 часа", d: "Пришлите спецификацию, проект или список задач — инженер подберёт оборудование, предложит аналоги и вернёт КП в течение суток." },
      { t: "Гарантия и поддержка", d: "Гарантийные обязательства в контракте, замена — через Ташкент. Ваших монтажников консультируем по настройке удалённо." },
    ],
    ctaTitle: "Пришлите спецификацию — вернём КП за 24 часа",
    ctaText: "sales@satsolutions.uz или форма на странице контактов. Подберём оборудование под задачу и бюджет, по дефицитным моделям предложим аналоги.",
    ctaButton: "Отправить запрос",
  },
  uz: {
    metaTitle: "O'zbekistondan xavfsizlik tizimlari eksporti | SAT Solutions",
    metaDesc: "Toshkentdan Markaziy Osiyo davlatlariga xavfsizlik uskunalari yetkazib berish: Tojikiston va Turkmaniston. Videokuzatuv, SKUD, yong'in signalizatsiyasi, tarmoqlar — omborda 3000+ pozitsiya, eksport shartnomasi va hujjatlar.",
    h1: "O'zbekistondan xavfsizlik uskunalari eksporti",
    intro: "SAT Solutions qo'shni davlatlarning pudratchi va kompaniyalariga xavfsizlik tizimlari hamda tarmoq uskunalarini Toshkentdagi o'z omboridan jo'natadi. Hikvision, Dahua, ZKTeco, MikroTik, TP-Link va H3C bo'yicha 3000 dan ortiq pozitsiya mavjud — Xitoydan haftalab kutish shart emas. Ish eksport shartnomasi va to'liq hujjatlar paketi asosida olib boriladi.",
    countriesTitle: "Qayerga yetkazamiz",
    countries: [
      { slug: "tajikistan", name: "Tojikiston", cities: "Dushanbe, Xo'jand, Boxtar", delivery: "Toshkentdagi ombordan avtoyetkazish: Xo'jandgacha 1–2 kun, Dushanbegacha 2–3 kun." },
      { slug: "turkmenistan", name: "Turkmaniston", cities: "Ashxobod, Turkmanobod, Mari", delivery: "Chegara yoki obyektgacha avtoyetkazish — muddat va marshrut buyurtmaga kelishiladi." },
    ],
    citiesLabel: "Shaharlar",
    more: "Yetkazib berish haqida batafsil",
    whyTitle: "Nega Toshkentdan xarid qilish qulay",
    why: [
      { t: "Ombor yaqin, dengiz ortida emas", d: "Ombordagi pozitsiyalar to'lov kuni jo'natiladi — Xitoydan to'g'ridan-to'g'ri buyurtma qilishdagi haftalab kutishga qarshi." },
      { t: "Eksport shartnomasi va hujjatlar", d: "Tashqi iqtisodiy shartnoma, invoys, qadoqlash varaqasi va uskunaga sertifikatlar. To'lov — shartnoma bo'yicha valyuta o'tkazmasi." },
      { t: "24 soatda tanlov va tijorat taklifi", d: "Spetsifikatsiya, loyiha yoki vazifalar ro'yxatini yuboring — muhandis uskunani tanlaydi, analoglarni taklif qiladi va bir kunda javob qaytaradi." },
      { t: "Kafolat va qo'llab-quvvatlash", d: "Kafolat majburiyatlari shartnomada, almashtirish — Toshkent orqali. Montajchilaringizga sozlash bo'yicha masofadan maslahat beramiz." },
    ],
    ctaTitle: "Spetsifikatsiyani yuboring — 24 soatda taklif qaytaramiz",
    ctaText: "sales@satsolutions.uz yoki kontaktlar sahifasidagi shakl. Vazifa va byudjetga mos uskunani tanlaymiz, tanqis modellarga analog taklif qilamiz.",
    ctaButton: "So'rov yuborish",
  },
  en: {
    metaTitle: "Security Equipment Export from Uzbekistan | SAT Solutions",
    metaDesc: "Security equipment supply from Tashkent to Central Asia: Tajikistan and Turkmenistan. CCTV, access control, fire alarm and networking — 3000+ items in stock, export contract and full document package.",
    h1: "Security equipment export from Uzbekistan",
    intro: "SAT Solutions ships security systems and networking equipment to contractors and companies in neighbouring countries from its own warehouse in Tashkent. Over 3000 items from Hikvision, Dahua, ZKTeco, MikroTik, TP-Link and H3C are in stock — no multi-week wait for a shipment from China. We work under an export contract with a full set of documents.",
    countriesTitle: "Where we ship",
    countries: [
      { slug: "tajikistan", name: "Tajikistan", cities: "Dushanbe, Khujand, Bokhtar", delivery: "Road delivery from our Tashkent warehouse: 1–2 days to Khujand, 2–3 days to Dushanbe." },
      { slug: "turkmenistan", name: "Turkmenistan", cities: "Ashgabat, Turkmenabat, Mary", delivery: "Road delivery to the border or to the site — timing and route agreed per order." },
    ],
    citiesLabel: "Cities",
    more: "More about supply",
    whyTitle: "Why buy from Tashkent",
    why: [
      { t: "The warehouse is next door", d: "Stock items ship the day payment clears — instead of weeks of waiting when ordering directly from China." },
      { t: "Export contract and paperwork", d: "Foreign trade contract, invoice, packing list and equipment certificates. Payment by bank transfer under the contract." },
      { t: "Selection and quote in 24 hours", d: "Send a specification, a design or just a task list — our engineer picks the equipment, suggests alternatives and comes back within a day." },
      { t: "Warranty and support", d: "Warranty terms are fixed in the contract, replacement goes through Tashkent. We advise your installers on configuration remotely." },
    ],
    ctaTitle: "Send your specification — quote back within 24 hours",
    ctaText: "sales@satsolutions.uz or the form on the contacts page. We match equipment to the task and the budget and offer alternatives for scarce models.",
    ctaButton: "Send a request",
  },
  tr: {
    metaTitle: "Özbekistan'dan Güvenlik Ekipmanı İhracatı | SAT Solutions",
    metaDesc: "Taşkent'ten Orta Asya'ya güvenlik ekipmanı tedariki: Tacikistan ve Türkmenistan. Kamera sistemleri, geçiş kontrol, yangın alarmı ve ağ ürünleri — stokta 3000+ kalem, ihracat sözleşmesi ve tam evrak.",
    h1: "Özbekistan'dan güvenlik ekipmanı ihracatı",
    intro: "SAT Solutions, komşu ülkelerdeki müteahhit ve şirketlere güvenlik sistemleri ile ağ ekipmanını Taşkent'teki kendi deposundan sevk eder. Hikvision, Dahua, ZKTeco, MikroTik, TP-Link ve H3C'den 3000'den fazla kalem stokta — Çin'den haftalarca sevkiyat beklemeye gerek yok. Çalışma, tam evrak paketiyle ihracat sözleşmesi üzerinden yürür.",
    countriesTitle: "Nereye sevk ediyoruz",
    countries: [
      { slug: "tajikistan", name: "Tacikistan", cities: "Duşanbe, Hucand, Bohtar", delivery: "Taşkent depomuzdan karayoluyla: Hucand'a 1–2 gün, Duşanbe'ye 2–3 gün." },
      { slug: "turkmenistan", name: "Türkmenistan", cities: "Aşkabat, Türkmenabat, Mary", delivery: "Sınıra veya sahaya karayolu teslimatı — süre ve güzergâh siparişe göre kararlaştırılır." },
    ],
    citiesLabel: "Şehirler",
    more: "Tedarik hakkında ayrıntı",
    whyTitle: "Neden Taşkent'ten almalı",
    why: [
      { t: "Depo denizaşırı değil, yanı başınızda", d: "Stoktaki kalemler ödemenin geldiği gün sevk edilir — Çin'den doğrudan siparişte haftalarca beklemek yerine." },
      { t: "İhracat sözleşmesi ve evrak", d: "Dış ticaret sözleşmesi, fatura, çeki listesi ve ekipman sertifikaları. Ödeme, sözleşme kapsamında döviz havalesiyle." },
      { t: "24 saatte seçim ve teklif", d: "Şartname, proje ya da sadece iş listesi gönderin — mühendisimiz ekipmanı seçer, muadil önerir ve bir gün içinde döner." },
      { t: "Garanti ve destek", d: "Garanti şartları sözleşmede, değişim Taşkent üzerinden. Montaj ekibinize kurulum konusunda uzaktan destek veririz." },
    ],
    ctaTitle: "Şartnamenizi gönderin — 24 saatte teklif",
    ctaText: "sales@satsolutions.uz veya iletişim sayfasındaki form. Ekipmanı işe ve bütçeye göre seçer, bulunması zor modellere muadil öneririz.",
    ctaButton: "Talep gönder",
  },
  zh: {
    metaTitle: "从乌兹别克斯坦出口安防设备 | SAT Solutions",
    metaDesc: "从塔什干向中亚国家供应安防设备：塔吉克斯坦和土库曼斯坦。视频监控、门禁、火灾报警与网络设备——现货3000多个型号，出口合同与全套单证。",
    h1: "从乌兹别克斯坦出口安防设备",
    intro: "SAT Solutions 从塔什干自有仓库向周边国家的承包商和公司发运安防系统与网络设备。海康威视、大华、ZKTeco、MikroTik、TP-Link 和 H3C 现货型号超过3000个——无需等待数周的中国发货。以出口合同方式合作，单证齐全。",
    countriesTitle: "供货国家",
    countries: [
      { slug: "tajikistan", name: "塔吉克斯坦", cities: "杜尚别、苦盏、博赫塔尔", delivery: "从塔什干仓库公路直达：至苦盏1–2天，至杜尚别2–3天。" },
      { slug: "turkmenistan", name: "土库曼斯坦", cities: "阿什哈巴德、土库曼纳巴德、马雷", delivery: "公路运输至边境或现场——时间和路线按订单商定。" },
    ],
    citiesLabel: "城市",
    more: "了解供货详情",
    whyTitle: "为什么从塔什干采购",
    why: [
      { t: "仓库就在近旁", d: "现货型号在收款当日发运——无需像直接从中国订货那样等待数周。" },
      { t: "出口合同与单证", d: "外贸合同、发票、装箱单及设备证书。按合同以外汇转账付款。" },
      { t: "24小时内选型报价", d: "发来清单、设计或任务描述——工程师选型、推荐替代方案，一天内回复。" },
      { t: "保修与支持", d: "保修条款写入合同，换货经塔什干办理。远程指导贵方安装队完成配置。" },
    ],
    ctaTitle: "发来清单——24小时内回复报价",
    ctaText: "sales@satsolutions.uz 或联系页表单。按需求和预算选型，紧缺型号提供替代方案。",
    ctaButton: "发送询价",
  },
};

const pick = (locale: string): Dict => D[locale] ?? D.ru;

// Контент статичный (инлайн-словари) — держим страницу полностью статической
export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = pick(locale);
  return {
    title: { absolute: d.metaTitle },
    description: d.metaDesc,
    alternates: hreflangAlternates("/export", locale),
    openGraph: { title: d.metaTitle, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function ExportIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = pick(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";

  // ItemList: хаб экспортных направлений — помогает Google связать страны в один кластер
  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: d.h1,
    description: d.metaDesc,
    url: `${siteUrl}${lp}/export`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: d.countries.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.name,
        url: `${siteUrl}${lp}/export/${c.slug}`,
      })),
    },
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <div className="container-page py-8 sm:py-12">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">{d.h1}</h1>
        <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-slate-600">{d.intro}</p>

        <h2 className="mt-10 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{d.countriesTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {d.countries.map((c) => (
            <Link
              key={c.slug}
              href={`/export/${c.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all hover:border-brand-500 hover:shadow-md"
            >
              <p className="text-lg font-black text-slate-900 group-hover:text-brand-700">{c.name}</p>
              <p className="mt-1 text-[13px] font-semibold text-slate-500">{d.citiesLabel}: {c.cities}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{c.delivery}</p>
              <span className="mt-4 inline-block text-sm font-bold text-brand-700">{d.more} →</span>
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{d.whyTitle}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {d.why.map((w) => (
            <div key={w.t} className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5">
              <p className="text-sm font-black text-slate-900">{w.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{w.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-slate-900 p-6 sm:p-8">
          <p className="text-xl font-black text-white">{d.ctaTitle}</p>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">{d.ctaText}</p>
          <Link href="/contact" className="mt-5 inline-block rounded-lg bg-white px-5 py-2.5 text-sm font-bold text-slate-900 hover:bg-slate-100">
            {d.ctaButton}
          </Link>
        </div>
      </div>
    </div>
  );
}
