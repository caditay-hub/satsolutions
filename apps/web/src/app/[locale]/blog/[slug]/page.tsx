import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fillLiveMins } from "@/lib/typeSeo";
import { ARTICLES, articleBySlug, articleImg, relatedArticles } from "@/lib/articlesData";
import { ArticleArt } from "@/components/AppBlocks";
import { InView } from "@/components/InView";
import { ARTICLE_UI } from "@/lib/appsExtrasContent";
import { clampDesc, titleWithBrand } from "@/lib/seoText";
import { serviceByKey } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";
import { GROUP_CANONICAL } from "@/lib/groupCanonical";
import { withOgUrl } from "@/lib/metadata";

const READ_ALSO: Record<string, string> = { ru: "Читайте также", uz: "Yana oʻqing", en: "Read also", tr: "Şunları da okuyun", zh: "延伸阅读" };

const UI: Record<string, { blog: string; home: string; related: string; hubsLabel: string; ctaTitle: string; ctaBtn: string; faq: string }> = {
  ru: { blog: "Блог", home: "Главная", related: "Смежные услуги", hubsLabel: "Каталог по теме", ctaTitle: "Нужна консультация или расчёт?", ctaBtn: "Получить КП", faq: "Частые вопросы" },
  uz: { blog: "Blog", home: "Bosh sahifa", related: "Aloqador xizmatlar", hubsLabel: "Mavzu boʻyicha katalog", ctaTitle: "Maslahat yoki hisob-kitob kerakmi?", ctaBtn: "Taklif olish", faq: "Koʻp soʻraladigan savollar" },
  en: { blog: "Blog", home: "Home", related: "Related services", hubsLabel: "Catalog on the topic", ctaTitle: "Need advice or a quote?", ctaBtn: "Get a quote", faq: "FAQ" },
  tr: { blog: "Blog", home: "Ana sayfa", related: "İlgili hizmetler", hubsLabel: "Konuya göre katalog", ctaTitle: "Danışmanlık veya teklif?", ctaBtn: "Teklif al", faq: "SSS" },
  zh: { blog: "博客", home: "首页", related: "相关服务", hubsLabel: "相关产品目录", ctaTitle: "需要咨询或报价？", ctaBtn: "获取报价", faq: "常见问题" },
};

// Названия товарных хабов для чипов «Каталог по теме» (слаг = /products/type/<slug>)
const BRAND_NAMES: Record<string, { lat: string; zh: string }> = {
  hikvision: { lat: "Hikvision", zh: "海康威视" },
  dahua: { lat: "Dahua", zh: "大华" },
};
function brandAnchor(n: { lat: string; zh: string }, locale: string): string {
  switch (locale) {
    case "uz": return `${n.lat} kameralari`;
    case "en": return `${n.lat} cameras`;
    case "tr": return `${n.lat} kameraları`;
    case "zh": return `${n.zh}摄像机`;
    default: return `Камеры ${n.lat}`;
  }
}

const HUB_LABELS: Record<string, Record<string, string>> = {
  // Подписи как в catalogI18n.ts. izveschateli и pribory-i-moduli стояли в hubs двух статей,
  // но без подписи фильтр ниже их молча выкидывал (AF, 07.10.2026)
  "ohrannaya-signalizaciya": { ru: "Охранная сигнализация", uz: "Qoʻriqlash signalizatsiyasi", en: "Intruder alarm", tr: "Hırsız alarmı", zh: "防盗报警" },
  "izveschateli": { ru: "Извещатели", uz: "Datchiklar", en: "Detectors", tr: "Dedektörler", zh: "探测器" },
  "pribory-i-moduli": { ru: "Приборы и модули", uz: "Asboblar va modullar", en: "Devices & modules", tr: "Cihazlar ve modüller", zh: "设备与模块" },
  "ip-kamery": { ru: "IP-камеры", uz: "IP-kameralar", en: "IP cameras", tr: "IP kameralar", zh: "IP摄像机" },
  "ip-videoregistratory-nvr": { ru: "IP-видеорегистраторы (NVR)", uz: "IP-videoregistratorlar (NVR)", en: "Network video recorders (NVR)", tr: "Kayıt cihazları (NVR)", zh: "网络录像机（NVR）" },
  "turnikety-i-shlagbaumy": { ru: "Турникеты и шлагбаумы", uz: "Turniket va shlagbaumlar", en: "Turnstiles and barriers", tr: "Turnikeler ve bariyerler", zh: "闸机与道闸" },
  "shlagbaumy": { ru: "Шлагбаумы", uz: "Shlagbaumlar", en: "Barrier gates", tr: "Bariyerler", zh: "道闸" },
  "kommutatory": { ru: "Коммутаторы", uz: "Kommutatorlar", en: "Switches", tr: "Switch'ler", zh: "交换机" },
  "marshrutizatory": { ru: "Маршрутизаторы", uz: "Marshrutizatorlar", en: "Routers", tr: "Yönlendiriciler", zh: "路由器" },
  "wi-fi-tochki-dostupa": { ru: "Wi-Fi точки доступа", uz: "Wi-Fi kirish nuqtalari", en: "Wi-Fi access points", tr: "Wi-Fi erişim noktaları", zh: "Wi-Fi接入点" },
  "ibp-i-elektropitanie": { ru: "ИБП и электропитание", uz: "UPS va elektr taʼminoti", en: "UPS and power", tr: "UPS ve güç", zh: "UPS与电源" },
  "pozharnaya-bezopasnost": { ru: "Пожарная безопасность", uz: "Yongʻin xavfsizligi", en: "Fire safety", tr: "Yangın güvenliği", zh: "消防安全" },
  "ognetushiteli": { ru: "Огнетушители", uz: "Oʻt oʻchirgichlar", en: "Fire extinguishers", tr: "Yangın tüpleri", zh: "灭火器" },
  "pon-oborudovanie": { ru: "PON-оборудование", uz: "PON uskunalari", en: "PON equipment", tr: "PON ekipmanı", zh: "PON设备" },
  "optika-i-aksessuary": { ru: "Оптика и аксессуары", uz: "Optika va aksessuarlar", en: "Optics and accessories", tr: "Optik ve aksesuarlar", zh: "光纤与配件" },
  "telekommunikacionnye-shkafy": { ru: "Телекоммуникационные шкафы", uz: "Telekommunikatsiya shkaflari", en: "Network cabinets", tr: "Kabinetler", zh: "网络机柜" },
  "zhestkie-diski": { ru: "Жёсткие диски", uz: "Qattiq disklar", en: "Hard drives", tr: "Sabit diskler", zh: "硬盘" },
  "domofoniya": { ru: "Домофония", uz: "Domofoniya", en: "Video intercoms", tr: "Diafon sistemleri", zh: "可视对讲" },
  "zamki-i-skud": { ru: "Замки и СКУД", uz: "Qulflar va SKUD", en: "Locks and access control", tr: "Kilitler ve geçiş kontrolü", zh: "锁具与门禁" },
  "terminaly-i-schityvateli": { ru: "Терминалы и считыватели", uz: "Terminallar va oʻqigichlar", en: "Terminals and readers", tr: "Terminaller ve okuyucular", zh: "门禁终端与读卡器" },
};

// Блок «Товар из статьи» (Article.products): прямая ссылка статья → карточка товара.
// Название задаётся подписью здесь, без запроса к API; слаг без подписи не выводится.
// Заведено 13.10.2026: из статьи про боди-камеры на единственную нательную камеру
// каталога не вело ни одной ссылки, товар оставался сиротой.
// Кнопка на раздел готовых комплектов (/kits) для статей с kits: true
const KITS_LINK: Record<string, string> = { ru: "Готовые комплекты с ценой", uz: "Narxi bilan tayyor toʻplamlar", en: "Ready-made kits with prices", tr: "Fiyatı belli hazır setler", zh: "明码标价的成品套装" };
const PRODUCT_UI: Record<string, { head: string; cta: string }> = {
  ru: { head: "Товар из статьи", cta: "Цена и характеристики в каталоге" },
  uz: { head: "Maqolada tilga olingan mahsulot", cta: "Narxi va xususiyatlari katalogda" },
  en: { head: "Product from this article", cta: "Price and specifications in the catalog" },
  tr: { head: "Makalede geçen ürün", cta: "Fiyat ve özellikler katalogda" },
  zh: { head: "文中提到的产品", cta: "在产品目录中查看价格和参数" },
};
const PRODUCT_LABELS: Record<string, Record<string, string>> = {
  "hik-ds-kis302-p": {"ru": "Гибридный комплект видеодомофона Hikvision DS-KIS302-P (звонок на телефон)", "uz": "Gibrid videodomofon toʻplami Hikvision DS-KIS302-P (telefonga qoʻngʻiroq)", "en": "Hikvision DS-KIS302-P hybrid video intercom kit (calls on your phone)", "tr": "Hibrit görüntülü diyafon seti Hikvision DS-KIS302-P (telefona çağrı)", "zh": "海康威视 DS-KIS302-P 混合可视对讲套装（手机接听）"},
  "hik-ds-kv6113-pe1-c-o-std": {"ru": "IP-вызывная панель Hikvision DS-KV6113-PE1(C) с камерой 2 Мп", "uz": "2 Mp kamerali IP-chaqiruv paneli Hikvision DS-KV6113-PE1(C)", "en": "Hikvision DS-KV6113-PE1(C) IP door station with 2 MP camera", "tr": "2 MP kameralı IP dış ünite Hikvision DS-KV6113-PE1(C)", "zh": "海康威视 DS-KV6113-PE1(C) 200万像素IP门口机"},
  "hik-ds-kh6320-wte1-o-std": {"ru": "IP-монитор видеодомофона Hikvision DS-KH6320-WTE1 (Wi-Fi, PoE)", "uz": "IP-videodomofon monitori Hikvision DS-KH6320-WTE1 (Wi-Fi, PoE)", "en": "Hikvision DS-KH6320-WTE1 IP indoor monitor (Wi-Fi, PoE)", "tr": "IP iç monitör Hikvision DS-KH6320-WTE1 (Wi-Fi, PoE)", "zh": "海康威视 DS-KH6320-WTE1 IP室内机（Wi-Fi、PoE）"},
  "tapo-tapo-d230s1": {"ru": "Беспроводной видеозвонок Tapo D230S1 с хабом", "uz": "Hubli simsiz videoqoʻngʻiroq Tapo D230S1", "en": "Tapo D230S1 wireless video doorbell with hub", "tr": "Hub'lı kablosuz görüntülü zil Tapo D230S1", "zh": "Tapo D230S1 无线可视门铃（含网关）"},
  "hil-hl-ipc-b140ha-luc-2-8mm": {"ru": "Уличная IP-камера 4 Мп HiLook HL-IPC-B140HA-LUC", "uz": "4 Mp tashqi IP-kamera HiLook HL-IPC-B140HA-LUC", "en": "HiLook HL-IPC-B140HA-LUC 4 MP outdoor IP camera", "tr": "4 MP dış IP kamera HiLook HL-IPC-B140HA-LUC", "zh": "HiLook HL-IPC-B140HA-LUC 400万像素室外网络摄像机"},
  "hik-ds-7108ni-q1-8p": {"ru": "IP-видеорегистратор на 8 каналов с PoE Hikvision DS-7108NI-Q1/8P", "uz": "PoE li 8 kanalli IP-videoregistrator Hikvision DS-7108NI-Q1/8P", "en": "Hikvision DS-7108NI-Q1/8P 8-channel PoE NVR", "tr": "PoE'li 8 kanallı NVR Hikvision DS-7108NI-Q1/8P", "zh": "海康威视 DS-7108NI-Q1/8P 8路PoE网络录像机"},
  "pro-seagate-skyhawk-hdd-2tb-dubai": {"ru": "Жёсткий диск для видеонаблюдения Seagate SkyHawk 2 ТБ", "uz": "Videokuzatuv uchun qattiq disk Seagate SkyHawk 2 TB", "en": "Seagate SkyHawk 2 TB surveillance hard drive", "tr": "Kamera sistemleri için sabit disk Seagate SkyHawk 2 TB", "zh": "希捷 SkyHawk 2TB 监控硬盘"},
  "hik-nks424w0h": {"ru": "Wi-Fi комплект видеонаблюдения Hikvision NKS424W0H (2 камеры 4 Мп)", "uz": "Wi-Fi videokuzatuv toʻplami Hikvision NKS424W0H (2 ta 4 Mp kamera)", "en": "Hikvision NKS424W0H Wi-Fi CCTV kit (2 × 4 MP cameras)", "tr": "Wi-Fi kamera seti Hikvision NKS424W0H (2 adet 4 MP kamera)", "zh": "海康威视 NKS424W0H Wi-Fi监控套装（2台400万像素摄像机）"},
  "tpl-tp-link-sg2210p": {"ru": "Смарт-коммутатор PoE с VLAN TP-Link SG2210P", "uz": "VLANli smart PoE-kommutator TP-Link SG2210P", "en": "TP-Link SG2210P smart PoE switch with VLAN", "tr": "VLAN destekli akıllı PoE switch TP-Link SG2210P", "zh": "TP-Link SG2210P 支持VLAN的智能PoE交换机"},
  "tpl-tp-link-er605": {"ru": "VPN-маршрутизатор TP-Link ER605", "uz": "VPN-router TP-Link ER605", "en": "TP-Link ER605 VPN router", "tr": "VPN router TP-Link ER605", "zh": "TP-Link ER605 VPN路由器"},
  "pxt-rb760igs": {"ru": "Маршрутизатор MikroTik hEX S RB760iGS", "uz": "MikroTik hEX S RB760iGS routeri", "en": "MikroTik hEX S RB760iGS router", "tr": "MikroTik hEX S RB760iGS router", "zh": "MikroTik hEX S RB760iGS 路由器"},
  "hik-ds-2cd1027g2h-liu-2-8mm": {
    ru: "Цилиндрическая IP-камера 2 Мп ColorVu с умной подсветкой Hikvision DS-2CD1027G2H-LIU",
    uz: "Aqlli yoritishli 2 Mp ColorVu silindrik IP-kamera Hikvision DS-2CD1027G2H-LIU",
    en: "Hikvision DS-2CD1027G2H-LIU 2 MP ColorVu bullet with smart hybrid light",
    tr: "Akıllı aydınlatmalı 2 MP ColorVu bullet IP kamera Hikvision DS-2CD1027G2H-LIU",
    zh: "海康威视 DS-2CD1027G2H-LIU 200万像素 ColorVu 智能混合补光筒机",
  },
  "hik-ds-2cd2047g2-lu-2-8mm-c-o-std": {
    ru: "Цилиндрическая IP-камера 4 Мп ColorVu с микрофоном Hikvision DS-2CD2047G2-LU",
    uz: "Mikrofonli 4 Mp ColorVu silindrik IP-kamera Hikvision DS-2CD2047G2-LU",
    en: "Hikvision DS-2CD2047G2-LU 4 MP ColorVu bullet with microphone",
    tr: "Mikrofonlu 4 MP ColorVu bullet IP kamera Hikvision DS-2CD2047G2-LU",
    zh: "海康威视 DS-2CD2047G2-LU 4MP ColorVu 带麦克风筒机",
  },
  "dahua-ipc-hfw1239s-a-led-s5": {
    ru: "Цилиндрическая IP-камера 2 Мп Full-color Dahua IPC-HFW1239S-A-LED-S5",
    uz: "2 Mp Full-color silindrik IP-kamera Dahua IPC-HFW1239S-A-LED-S5",
    en: "Dahua IPC-HFW1239S-A-LED-S5 2 MP Full-color bullet camera",
    tr: "2 MP Full-color bullet IP kamera Dahua IPC-HFW1239S-A-LED-S5",
    zh: "大华 IPC-HFW1239S-A-LED-S5 200万像素全彩筒机",
  },
  "dahua-ipc-hdw2449t-s-il": {
    ru: "Купольная IP-камера 4 Мп с двойной подсветкой Dahua IPC-HDW2449T-S-IL",
    uz: "Ikki xil yoritishli 4 Mp gumbazli IP-kamera Dahua IPC-HDW2449T-S-IL",
    en: "Dahua IPC-HDW2449T-S-IL 4 MP dome camera with dual lighting",
    tr: "Çift aydınlatmalı 4 MP dome IP kamera Dahua IPC-HDW2449T-S-IL",
    zh: "大华 IPC-HDW2449T-S-IL 4MP 双光半球摄像机",
  },
  "hik-ds-2cd2043g2-li2u-2-8mm": {
    ru: "Цилиндрическая IP-камера 4 Мп с AcuSense Hikvision DS-2CD2043G2-LI2U",
    uz: "AcuSense bilan 4 Mp silindrik IP-kamera Hikvision DS-2CD2043G2-LI2U",
    en: "Hikvision DS-2CD2043G2-LI2U 4 MP AcuSense bullet camera",
    tr: "AcuSense'li 4 MP bullet IP kamera Hikvision DS-2CD2043G2-LI2U",
    zh: "海康威视 DS-2CD2043G2-LI2U 4MP AcuSense 筒型网络摄像机",
  },
  "hik-ds-2cd2087g3-li2uy-sl-2-8mm": {
    ru: "IP-камера 8 Мп с AcuSense, стробоскопом и голосом Hikvision DS-2CD2087G3-LI2UY/SL",
    uz: "AcuSense, stroboskop va ovozli 8 Mp IP-kamera Hikvision DS-2CD2087G3-LI2UY/SL",
    en: "Hikvision DS-2CD2087G3-LI2UY/SL 8 MP AcuSense camera with strobe and voice",
    tr: "AcuSense, flaş ve sesli 8 MP IP kamera Hikvision DS-2CD2087G3-LI2UY/SL",
    zh: "海康威视 DS-2CD2087G3-LI2UY/SL 8MP AcuSense 爆闪语音摄像机",
  },
  "dahua-ipc-hfw2849t-as-il": {
    ru: "Цилиндрическая IP-камера 8 Мп Dahua IPC-HFW2849T-AS-IL",
    uz: "8 Mp silindrik IP-kamera Dahua IPC-HFW2849T-AS-IL",
    en: "Dahua IPC-HFW2849T-AS-IL 8 MP bullet camera",
    tr: "8 MP bullet IP kamera Dahua IPC-HFW2849T-AS-IL",
    zh: "大华 IPC-HFW2849T-AS-IL 8MP 筒型网络摄像机",
  },
  "hik-ds-7608nxi-k2": {
    ru: "IP-видеорегистратор с AcuSense на 8 каналов Hikvision DS-7608NXI-K2",
    uz: "AcuSense bilan 8 kanalli IP-videoregistrator Hikvision DS-7608NXI-K2",
    en: "Hikvision DS-7608NXI-K2 8-channel AcuSense NVR",
    tr: "AcuSense'li 8 kanallı NVR Hikvision DS-7608NXI-K2",
    zh: "海康威视 DS-7608NXI-K2 8路 AcuSense 网络录像机",
  },
  "hik-ds-2cd2143g2-iu-2-8mm-o-std": {
    ru: "Купольная IP-камера 4 Мп с микрофоном Hikvision DS-2CD2143G2-IU",
    uz: "Mikrofonli 4 Mp gumbazli IP-kamera Hikvision DS-2CD2143G2-IU",
    en: "Hikvision DS-2CD2143G2-IU 4 MP dome camera with microphone",
    tr: "Mikrofonlu 4 MP dome IP kamera Hikvision DS-2CD2143G2-IU",
    zh: "海康威视 DS-2CD2143G2-IU 4MP 带麦克风半球网络摄像机",
  },
  "hik-ds-7616nxi-k2": {
    ru: "IP-видеорегистратор на 16 каналов Hikvision DS-7616NXI-K2",
    uz: "16 kanalli IP-videoregistrator Hikvision DS-7616NXI-K2",
    en: "Hikvision DS-7616NXI-K2 16-channel NVR",
    tr: "16 kanallı NVR Hikvision DS-7616NXI-K2",
    zh: "海康威视 DS-7616NXI-K2 16路网络录像机",
  },
  "pro-seagate-skyhawk-hdd-6tb-dubai": {
    ru: "Жёсткий диск для видеонаблюдения Seagate SkyHawk 6 ТБ",
    uz: "Videokuzatuv uchun qattiq disk Seagate SkyHawk 6 TB",
    en: "Seagate SkyHawk 6 TB surveillance hard drive",
    tr: "Seagate SkyHawk 6 TB güvenlik kamerası diski",
    zh: "希捷 SkyHawk 6 TB 监控硬盘",
  },
  "hik-ds-mcw406-64g-gps-wifi": {
    ru: "Боди-камера (нательный видеорегистратор) Hikvision DS-MCW406/64G/GPS/WIFI",
    uz: "Bodikamera (tanaga taqiladigan videoregistrator) Hikvision DS-MCW406/64G/GPS/WIFI",
    en: "Hikvision DS-MCW406/64G/GPS/WIFI body-worn camera",
    tr: "Hikvision DS-MCW406/64G/GPS/WIFI vücut kamerası (yaka kamerası)",
    zh: "海康威视 DS-MCW406/64G/GPS/WIFI 执法记录仪",
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
// Формат даты публикации по локалям (Intl хочет BCP-47, у нас коды короткие)
const DATE_LOCALE: Record<string, string> = { ru: "ru-RU", uz: "uz-UZ", en: "en-US", tr: "tr-TR", zh: "zh-CN" };

// Статьи пререндерим на сборке — все 63 на пяти языках (350 страниц, +~30 c к билду).
// Раньше здесь был пустой generateStaticParams и ISR по требованию, но для РУССКОЙ
// локали он не работал: у неё нет префикса в URL, next-intl переписывает /blog/x →
// /ru/blog/x, а на переписанном пути Next ISR-кэш НЕ пишет. Проверено 21.09.2026:
// в .next/server/app/ru/ каталога blog не было вовсе, тогда как в uz/ и en/ файлы
// есть. Русская статья рендерилась заново на КАЖДЫЙ запрос и отдавала
// Cache-Control: no-store — ни браузер, ни Googlebot ничего не кэшировали.
export const revalidate = 3600;
export async function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

async function generateMetadataBase({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = articleBySlug[slug];
  const body = article?.loc[locale];
  if (!article || !body) return { title: "Blog" };
  // Обложка статьи вместо общего /og.png: у каждой из статей есть свой кадр 1200×630
  const cover = `${SITE_URL}${articleImg(slug)}`;
  // seoTitle/seoDesc могут содержать живые цены «{{min:Раздел}}»; не получилось — обычные title/excerpt
  const seoTitle = body.seoTitle ? (await fillLiveMins(body.seoTitle, locale)) ?? body.title : body.title;
  const seoDesc = body.seoDesc ? (await fillLiveMins(body.seoDesc, locale)) ?? body.excerpt : body.excerpt;
  return {
    title: { absolute: titleWithBrand(seoTitle) },
    description: clampDesc(seoDesc),
    alternates: hreflangAlternates(`/blog/${slug}`, locale),
    openGraph: { type: "article", title: body.title, description: clampDesc(seoDesc), locale: ogLocale(locale), images: [cover], publishedTime: article.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const article = articleBySlug[slug];
  const body = article?.loc[locale];
  if (!article || !body) notFound();

  const ui = UI[locale] ?? UI.ru;
  const ts = await getTranslations({ locale, namespace: "services" });
  const tcalc = await getTranslations({ locale, namespace: "calc" });
  const siteUrl = SITE_URL;
  const lp = locale !== "ru" ? `/${locale}` : "";
  const cover = `${siteUrl}${articleImg(slug)}`;
  const publishedLabel = new Date(article.date).toLocaleDateString(DATE_LOCALE[locale] ?? "ru-RU", { day: "numeric", month: "long", year: "numeric" });

  // Смежные услуги: локализованный H1 из SEO-оверлея, иначе короткий title
  const related = article.related
    .filter((k) => serviceByKey[k])
    .map((k) => ({ key: k, label: getServiceSeo(locale, k)?.h1 ?? ts(`${k}.title`) }));

  // Товарные хабы «Каталог по теме» — вторая нога перелинковки: статья → /products/type/<slug>
  // Три слага склеены с одноимённой группой (GROUP_CANONICAL): /products/type/<slug>
  // отдаёт по ним 308. Ведём сразу на группу, чтобы не гонять читателя и робота
  // через редирект.
  // Бренд-каталог первым (10.10.2026): по «hikvision» английская /en/catalog/hikvision стояла
  // на 8,9, русская — на 23: из русского контента на русскую страницу бренда не вело ни одной
  // ссылки. Анкор «Камеры <Бренд>» — ровно так ищут.
  const brandHubs = (article.brands ?? [])
    .filter((b) => BRAND_NAMES[b])
    .map((b) => ({ href: `/catalog/${b}`, slug: `brand-${b}`, label: brandAnchor(BRAND_NAMES[b], locale) }));
  const hubs = [
    ...brandHubs,
    ...(article.hubs ?? [])
      .filter((h) => HUB_LABELS[h])
      .map((h) => ({
        href: GROUP_CANONICAL[h] ? `/products/group/${GROUP_CANONICAL[h]}` : `/products/type/${h}`,
        slug: h,
        label: HUB_LABELS[h][locale] ?? HUB_LABELS[h].ru,
      })),
  ];

  const productUi = PRODUCT_UI[locale] ?? PRODUCT_UI.ru;
  const products = (article.products ?? [])
    .filter((p) => PRODUCT_LABELS[p])
    .map((p) => ({ slug: p, label: PRODUCT_LABELS[p][locale] ?? PRODUCT_LABELS[p].ru }));

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: body.title,
    description: clampDesc(body.excerpt),
    image: [cover],
    datePublished: article.date,
    // Article.updated — дата последней правки текста. Без неё сайт объявлял июльскую
    // дату для статей, переписанных в сентябре: свежесть — сигнал и для поиска,
    // и для ИИ-ответов, которые предпочитают цитировать актуальный источник.
    dateModified: article.updated ?? article.date,
    inLanguage: locale,
    author: { "@type": "Organization", name: "SAT Solutions" },
    publisher: { "@type": "Organization", name: "SAT Solutions", url: siteUrl },
    mainEntityOfPage: `${siteUrl}${lp}/blog/${slug}`,
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: ui.home, item: `${siteUrl}${lp}/` },
      { "@type": "ListItem", position: 2, name: ui.blog, item: `${siteUrl}${lp}/blog` },
      { "@type": "ListItem", position: 3, name: body.title },
    ],
  };
  const artUi = ARTICLE_UI[locale] ?? ARTICLE_UI.ru;
  const seeAlso = relatedArticles(slug, locale);
  const faqLd = body.faq?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: body.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}

      {/* Шапка с тематическим фото на заднем фоне (public/blog-img/<slug>.jpg) */}
      <header className="relative overflow-hidden bg-slate-900">
        <img src={articleImg(slug)} alt={body.title} className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-slate-900/40" />
        <div className="container-page relative py-10 sm:py-16">
          <div className="mx-auto max-w-3xl">
          <nav className="crumbs mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-300/80">
            <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
            <span className="text-slate-400/60">/</span>
            <Link href="/blog" className="hover:text-white transition-colors">{ui.blog}</Link>
          </nav>
          <h1 className="max-w-3xl text-2xl sm:text-4xl font-black tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,.5)]">{body.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200 [text-shadow:0_1px_8px_rgba(0,0,0,.5)]">{body.excerpt}</p>
          {/* дата публикации была только в разметке — читателю и Google её видно не было */}
          <time dateTime={article.date} className="mt-4 block text-[11px] font-bold uppercase tracking-widest text-slate-300/80">{publishedLabel}</time>
          </div>
        </div>
      </header>

      <article className="container-page py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {body.summary && body.summary.length > 0 && (
            <div className="mb-8 rounded-xl border border-slate-200 border-l-4 border-l-brand-600 bg-slate-50 p-4 sm:p-5">
              <p className="text-[11px] font-black uppercase tracking-widest text-brand-600">{artUi.summary}</p>
              <ul className="mt-3 space-y-2">
                {body.summary.map((line) => (
                  <li key={line} className="flex gap-2 text-sm sm:text-base leading-relaxed text-slate-700">
                    <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-8">
            {body.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{s.h}</h2>
                <div className="mt-3 space-y-3">
                  {s.p.map((para, j) => (
                    <p key={j} className="text-sm sm:text-base leading-relaxed text-slate-600">{para}</p>
                  ))}
                </div>
                {/* Мост в коммерцию: статьи перехватывают запросы вроде «установка
                    видеонаблюдения» и «скуд», но ведут читателя в никуда. Ссылка с
                    точным анкором после первого раздела передаёт вес профильной услуге
                    и уводит на страницу, где есть цена и заявка. */}
                {i === 0 && article.related[0] && (
                  <p className="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm sm:text-base">
                    <Link href={`/solutions/${article.related[0]}`} className="font-bold text-brand-700 hover:underline">
                      {getServiceSeo(locale, article.related[0])?.h1 ?? ts(`${article.related[0]}.title`)} →
                    </Link>
                  </p>
                )}
                {/* Схема ставится после второй секции: к этому месту читатель уже понял тему. */}
                {article.art && i === 1 && <ArticleArt kind={article.art} locale={locale} alt={body.title} />}
              </section>
            ))}
          </div>

          {/* Товар, о котором говорится в тексте, — сразу после разделов, до FAQ */}
          {products.length > 0 && (
            <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <p className="text-[11px] font-black uppercase tracking-widest text-brand-600">{productUi.head}</p>
              <ul className="mt-3 space-y-3">
                {products.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/products/${p.slug}`} className="group block">
                      <span className="block text-sm sm:text-base font-bold leading-snug text-slate-900 group-hover:text-brand-700">{p.label}</span>
                      <span className="mt-1 block text-xs sm:text-sm font-bold text-brand-700">{productUi.cta} →</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {article.kits && (
            <p className="mt-8 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm sm:text-base">
              <Link href="/kits" className="font-bold text-brand-700 hover:underline">
                {KITS_LINK[locale] ?? KITS_LINK.ru} →
              </Link>
            </p>
          )}

          {article.appHref && (
            <InView className="mt-8">
              <Link
                href={article.appHref}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-5 py-3 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-100"
              >
                {artUi.more} →
              </Link>
            </InView>
          )}

          {body.faq && body.faq.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ui.faq}</h2>
              <div className="mt-4 space-y-4">
                {body.faq.map((f, i) => (
                  <details key={i} className="group rounded-xl border border-slate-200 bg-slate-50 p-4 open:bg-white">
                    <summary className="cursor-pointer list-none text-sm sm:text-base font-bold text-slate-900 marker:content-none group-open:text-brand-700">
                      {f.q}
                    </summary>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-slate-600">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Читатель статьи про монтаж почти всегда прикидывает бюджет — даём
              ему калькулятор здесь же, заодно это входящая ссылка на страницу. */}
          <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
            <div className="max-w-xl">
              <p className="text-base font-black text-slate-900">{tcalc("promoHead")}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{tcalc("promoText")}</p>
            </div>
            <Link href="/calculator"
              className="mt-4 inline-flex shrink-0 items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500 sm:mt-0">
              {tcalc("promoBtn")} →
            </Link>
          </div>

          {seeAlso.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-700">{READ_ALSO[locale] ?? READ_ALSO.ru}</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {seeAlso.map((a) => (
                    <Link
                      key={a.slug}
                      href={`/blog/${a.slug}`}
                      className="group flex gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-colors hover:border-brand-400"
                    >
                      <img src={articleImg(a.slug)} alt={a.loc[locale].title} loading="lazy" className="h-20 w-28 shrink-0 rounded-lg object-cover" />
                      <span className="text-sm font-bold leading-snug text-slate-900 group-hover:text-brand-700">
                        {a.loc[locale].title}
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div className="mt-10 border-t border-slate-200 pt-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-700">{ui.related}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {related.map((r) => (
                  <Link
                    key={r.key}
                    href={`/solutions/${r.key}`}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {r.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {hubs.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-black uppercase tracking-widest text-brand-700">{ui.hubsLabel}</p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {hubs.map((h) => (
                  <Link
                    key={h.slug}
                    href={h.href}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-300 hover:text-brand-700"
                  >
                    {h.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <section className="bg-slate-900 text-white">
        <div className="container-page flex flex-col items-center gap-5 py-12 text-center sm:py-14">
          <h2 className="max-w-2xl text-2xl sm:text-3xl font-black tracking-tight">{ui.ctaTitle}</h2>
          <Link href="/contact" className="rounded-xl bg-brand-500 px-6 py-3 text-sm font-black text-white transition-colors hover:bg-brand-400">
            {ui.ctaBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}

// og:url = canonical (lib/metadata.ts withOgUrl, 05.10.2026)
export async function generateMetadata(props: Parameters<typeof generateMetadataBase>[0]) {
  return withOgUrl(await generateMetadataBase(props));
}
