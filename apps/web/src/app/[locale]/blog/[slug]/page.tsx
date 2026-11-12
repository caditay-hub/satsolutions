import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { fillLiveMins } from "@/lib/typeSeo";
import { ARTICLES, articleBySlug, articleImg, relatedArticles } from "@/lib/articlesData";
import type { ArticleSection, ArticleTable } from "@/lib/articlesData";
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
const BRAND_NAMES: Record<string, { lat: string; zh: string; kind?: "fire" }> = {
  hikvision: { lat: "Hikvision", zh: "海康威视" },
  dahua: { lat: "Dahua", zh: "大华" },
  // бренд АПС (12.11.2026): анкор «Пожарная сигнализация <Бренд>», а не «Камеры»
  "qr-systems": { lat: "QR Systems", zh: "QR Systems", kind: "fire" },
};
function brandAnchor(n: { lat: string; zh: string; kind?: "fire" }, locale: string): string {
  if (n.kind === "fire") {
    switch (locale) {
      case "uz": return `${n.lat} yongʻin signalizatsiyasi`;
      case "en": return `${n.lat} fire alarm`;
      case "tr": return `${n.lat} yangın alarmı`;
      case "zh": return `${n.zh} 火灾报警`;
      default: return `Пожарная сигнализация ${n.lat}`;
    }
  }
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
  "hik-ds-2cd1043g2-i-2-8mm": {"ru": "Уличная IP-камера 4 Мп Hikvision DS-2CD1043G2-I (IP67, EXIR)", "uz": "4 Mp tashqi IP-kamera Hikvision DS-2CD1043G2-I (IP67, EXIR)", "en": "Hikvision DS-2CD1043G2-I 4 MP outdoor IP camera (IP67, EXIR)", "tr": "4 MP dış IP kamera Hikvision DS-2CD1043G2-I (IP67, EXIR)", "zh": "海康威视 DS-2CD1043G2-I 400万像素室外网络摄像机（IP67，EXIR）"},
  "zkt-zkteco-zamok-gl300w": {"ru": "Умный замок ZKTeco GL300W для стеклянных дверей (отпечаток, код, карта, смартфон)", "uz": "Shisha eshiklar uchun ZKTeco GL300W aqlli qulfi (barmoq izi, kod, karta, smartfon)", "en": "ZKTeco GL300W smart lock for glass doors (fingerprint, code, card, smartphone)", "tr": "Cam kapılar için ZKTeco GL300W akıllı kilit (parmak izi, kod, kart, akıllı telefon)", "zh": "ZKTeco GL300W 玻璃门智能锁（指纹、密码、卡、手机）"},
  "bld-s2000r-ost-isp-01-vyhod": {"ru": "Радиоканальное световое табло «Выход» Болид С2000Р-ОСТ исп.01", "uz": "Bolid S2000R-OST isp.01 «Chiqish» radiokanalli yorugʻlik tablosi", "en": "Bolid S2000R-OST ver.01 radio “Exit” light sign", "tr": "Bolid S2000R-OST ver.01 radyo hatlı “Çıkış” ışıklı levha", "zh": "Bolid S2000R-OST 01版 无线“出口”指示灯"},
  "bld-s2000-kdl": {"ru": "Контроллер адресной линии Болид С2000-КДЛ (до 127 устройств)", "uz": "Bolid S2000-KDL manzilli liniya kontrolleri (127 tagacha qurilma)", "en": "Bolid S2000-KDL addressable loop controller (up to 127 devices)", "tr": "Bolid S2000-KDL adresli hat kontrolörü (127 cihaza kadar)", "zh": "Bolid S2000-KDL 编址回路控制器（最多127个设备）"},
  "rbz-ppkopu-r3-rubezh-2op": {"ru": "Адресный прибор Рубеж R3-Рубеж-2ОП (2 линии по 250 устройств)", "uz": "Rubej R3-Rubej-2OP manzilli asbobi (har biri 250 qurilmali 2 liniya)", "en": "Rubezh R3-Rubezh-2OP addressable panel (2 loops of 250 devices)", "tr": "Rubezh R3-Rubezh-2OP adresli panel (250'şer cihazlık 2 hat)", "zh": "Rubezh R3-Rubezh-2OP 编址控制器（2条回路，每条250个设备）"},
  "bld-dip-34a-03-bolid": {"ru": "Проводной адресно-аналоговый дымовой извещатель Болид ДИП-34А-03", "uz": "Bolid DIP-34A-03 simli manzilli-analog tutun xabar beruvchisi", "en": "Bolid DIP-34A-03 wired analogue addressable smoke detector", "tr": "Bolid DIP-34A-03 kablolu analog adresli duman dedektörü", "zh": "Bolid DIP-34A-03 有线模拟量编址感烟探测器"},
  "tapo-tapo-dl105": {"ru": "Умный дверной замок Tapo DL105 (отпечаток, код, приложение)", "uz": "Tapo DL105 aqlli eshik qulfi (barmoq izi, kod, ilova)", "en": "Tapo DL105 smart door lock (fingerprint, code, app)", "tr": "Tapo DL105 akıllı kapı kilidi (parmak izi, kod, uygulama)", "zh": "Tapo DL105 智能门锁（指纹、密码、应用）"},
  "knd-tk-d1-pro": {"ru": "Умный замок KANIHAD TK-D1 Pro (приложение, карта, отпечаток, код, ключ)", "uz": "KANIHAD TK-D1 Pro aqlli qulfi (ilova, karta, barmoq izi, kod, kalit)", "en": "KANIHAD TK-D1 Pro smart lock (app, card, fingerprint, code, key)", "tr": "KANIHAD TK-D1 Pro akıllı kilit (uygulama, kart, parmak izi, kod, anahtar)", "zh": "KANIHAD TK-D1 Pro 智能锁（应用、卡、指纹、密码、钥匙）"},
  "knd-tk-606a-tw": {"ru": "Умный замок KANIHAD TK-606A-TW с Tuya Wi-Fi", "uz": "Tuya Wi-Fi li KANIHAD TK-606A-TW aqlli qulfi", "en": "KANIHAD TK-606A-TW smart lock with Tuya Wi-Fi", "tr": "Tuya Wi-Fi'li KANIHAD TK-606A-TW akıllı kilit", "zh": "KANIHAD TK-606A-TW 涂鸦Wi-Fi智能锁"},
  "zkt-zkteco-hbl400-elektronnyi-biometricheskii-zamok-s-raspoznavaniem-lic": {"ru": "Биометрический замок ZKTeco HBL400 с распознаванием лица", "uz": "Yuzni taniydigan ZKTeco HBL400 biometrik qulfi", "en": "ZKTeco HBL400 biometric lock with face recognition", "tr": "Yüz tanımalı ZKTeco HBL400 biyometrik kilit", "zh": "ZKTeco HBL400 人脸识别生物识别锁"},
  "hik-ds-pwa64-kit-wb": {"ru": "Беспроводной комплект охранной сигнализации Hikvision AX PRO DS-PWA64-Kit-WB", "uz": "Hikvision AX PRO DS-PWA64-Kit-WB simsiz qoʻriqlash signalizatsiyasi toʻplami", "en": "Hikvision AX PRO DS-PWA64-Kit-WB wireless alarm kit", "tr": "Hikvision AX PRO DS-PWA64-Kit-WB kablosuz alarm seti", "zh": "海康威视 AX PRO DS-PWA64-Kit-WB 无线报警套装"},
  "hik-ds-pdpc12p-eg2-wb": {"ru": "Беспроводной датчик движения с камерой Hikvision DS-PDPC12P-EG2-WB", "uz": "Kamerali simsiz harakat datchigi Hikvision DS-PDPC12P-EG2-WB", "en": "Hikvision DS-PDPC12P-EG2-WB wireless motion detector with camera", "tr": "Kameralı kablosuz hareket dedektörü Hikvision DS-PDPC12P-EG2-WB", "zh": "海康威视 DS-PDPC12P-EG2-WB 带摄像头无线移动探测器"},
  "hik-ds-ps1-e-wb": {"ru": "Уличная беспроводная сирена Hikvision DS-PS1-E-WB (IP65, 110 дБ)", "uz": "Tashqi simsiz sirena Hikvision DS-PS1-E-WB (IP65, 110 dB)", "en": "Hikvision DS-PS1-E-WB outdoor wireless siren (IP65, 110 dB)", "tr": "Dış mekân kablosuz siren Hikvision DS-PS1-E-WB (IP65, 110 dB)", "zh": "海康威视 DS-PS1-E-WB 室外无线警号（IP65，110分贝）"},
  "dahua-dhi-arc3800h-w2-868": {"ru": "Охранный хаб Dahua AirShield DHI-ARC3800H-W2(868)", "uz": "Dahua AirShield DHI-ARC3800H-W2(868) qoʻriqlash habi", "en": "Dahua AirShield DHI-ARC3800H-W2(868) alarm hub", "tr": "Dahua AirShield DHI-ARC3800H-W2(868) alarm hub'ı", "zh": "大华 AirShield DHI-ARC3800H-W2(868) 报警主机"},
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
  // Товары статей под цитирование ИИ (10.11.2026): слаги сверены с API — опубликованы, в наличии
  "hik-ds-7732ni-k4-std": {
    ru: "IP-видеорегистратор на 32 канала Hikvision DS-7732NI-K4 (4 SATA, 256 Мбит/с)",
    uz: "32 kanalli IP-videoregistrator Hikvision DS-7732NI-K4 (4 SATA, 256 Mbit/s)",
    en: "Hikvision DS-7732NI-K4 32-channel NVR (4 SATA, 256 Mbps)",
    tr: "32 kanallı NVR Hikvision DS-7732NI-K4 (4 SATA, 256 Mbps)",
    zh: "海康威视 DS-7732NI-K4 32路网络录像机（4盘位，256 Mbps）",
  },
  "hik-ds-3e1526p-si-24p2f": {
    ru: "PoE-коммутатор на 24 порта Hikvision DS-3E1526P-SI-24P2F (2 SFP, бюджет 370 Вт)",
    uz: "24 portli PoE-kommutator Hikvision DS-3E1526P-SI-24P2F (2 SFP, 370 Vt)",
    en: "Hikvision DS-3E1526P-SI-24P2F 24-port PoE switch (2 SFP, 370 W budget)",
    tr: "24 portlu PoE switch Hikvision DS-3E1526P-SI-24P2F (2 SFP, 370 W bütçe)",
    zh: "海康威视 DS-3E1526P-SI-24P2F 24口PoE交换机（2个SFP，PoE总功率370瓦）",
  },
  "hik-ds-2cd2143g2-i-2-8mm-o-std": {
    ru: "Купольная IP-камера 4 Мп Hikvision DS-2CD2143G2-I (2,8 мм, ИК до 30 м)",
    uz: "4 Mp gumbazli IP-kamera Hikvision DS-2CD2143G2-I (2,8 mm, IQ-yoritish 30 m gacha)",
    en: "Hikvision DS-2CD2143G2-I 4 MP dome IP camera (2.8 mm, IR up to 30 m)",
    tr: "4 MP dome IP kamera Hikvision DS-2CD2143G2-I (2,8 mm, 30 m'ye kadar IR)",
    zh: "海康威视 DS-2CD2143G2-I 400万像素半球网络摄像机（2.8毫米，红外30米）",
  },
  "hik-ds-2cd2t43g2-4i-2-8mm": {
    ru: "Цилиндрическая IP-камера 4 Мп Hikvision DS-2CD2T43G2-4I (2,8 мм, ИК до 80 м)",
    uz: "4 Mp silindrik IP-kamera Hikvision DS-2CD2T43G2-4I (2,8 mm, IQ-yoritish 80 m gacha)",
    en: "Hikvision DS-2CD2T43G2-4I 4 MP bullet IP camera (2.8 mm, IR up to 80 m)",
    tr: "4 MP bullet IP kamera Hikvision DS-2CD2T43G2-4I (2,8 mm, 80 m'ye kadar IR)",
    zh: "海康威视 DS-2CD2T43G2-4I 400万像素筒型网络摄像机（2.8毫米，红外80米）",
  },
  "dahua-dhi-nvr5232-ei": {
    ru: "IP-видеорегистратор на 32 канала Dahua DHI-NVR5232-EI",
    uz: "32 kanalli IP-videoregistrator Dahua DHI-NVR5232-EI",
    en: "Dahua DHI-NVR5232-EI 32-channel NVR",
    tr: "32 kanallı NVR Dahua DHI-NVR5232-EI",
    zh: "大华 DHI-NVR5232-EI 32路网络录像机",
  },
  "dahua-dss-onebox-h1-128": {
    ru: "Сервер видеонаблюдения «всё в одном» Dahua DSS-OneBox-H1/128",
    uz: "«Hammasi bitta qurilmada» videokuzatuv serveri Dahua DSS-OneBox-H1/128",
    en: "Dahua DSS-OneBox-H1/128 all-in-one video surveillance server",
    tr: "Hepsi bir arada video gözetim sunucusu Dahua DSS-OneBox-H1/128",
    zh: "大华 DSS-OneBox-H1/128 一体化视频监控服务器",
  },
  "hik-ds-mcw406-64g-gps-wifi": {
    ru: "Боди-камера (нательный видеорегистратор) Hikvision DS-MCW406/64G/GPS/WIFI",
    uz: "Bodikamera (tanaga taqiladigan videoregistrator) Hikvision DS-MCW406/64G/GPS/WIFI",
    en: "Hikvision DS-MCW406/64G/GPS/WIFI body-worn camera",
    tr: "Hikvision DS-MCW406/64G/GPS/WIFI vücut kamerası (yaka kamerası)",
    zh: "海康威视 DS-MCW406/64G/GPS/WIFI 执法记录仪",
  },
};

// Раздел с таблицами / нумерованными шагами / списком (ArticleSection.table|ol|ul, 10.11.2026).
// Блоки встают после `at` абзацев (по умолчанию — после всех); на одной позиции: ol → таблицы → ul.
// Таблица — настоящий <table> в контейнере с горизонтальной прокруткой: на телефоне не ломает
// ширину страницы, а робот и ИИ-поиск получают строки и столбцы как есть.
const TOTAL_ROW = /^(итого|всего|jami|hammasi|total|grand total|toplam|genel toplam|合计|总计|小计)/i;
function ArticleTableView({ t }: { t: ArticleTable }) {
  return (
    <figure className="my-1">
      {t.caption && <figcaption className="mb-2 text-sm sm:text-base font-bold text-slate-900">{t.caption}</figcaption>}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[480px] border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-slate-50">
            <tr>
              {t.head.map((c, i) => (
                <th key={i} scope="col" className="border-b border-slate-200 px-3 py-2 font-bold text-slate-900 align-bottom">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r, i) => {
              const total = TOTAL_ROW.test(r[0] ?? "");
              return (
                <tr key={i} className={total ? "bg-slate-50 font-bold text-slate-900" : "text-slate-600 even:bg-slate-50/50"}>
                  {r.map((c, j) => (
                    <td key={j} className="border-t border-slate-100 px-3 py-2 align-top leading-relaxed">{c}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
function SectionBody({ s }: { s: ArticleSection }) {
  const tables = s.table ? (Array.isArray(s.table) ? s.table : [s.table]) : [];
  const n = s.p.length;
  const out: ReactNode[] = [];
  for (let k = 0; k <= n; k++) {
    if (s.ol && (s.olAt ?? n) === k) {
      out.push(
        <ol key={`ol${k}`} className="list-decimal space-y-2 pl-6 text-sm sm:text-base leading-relaxed text-slate-600 marker:font-bold marker:text-brand-600">
          {s.ol.map((li, j) => <li key={j} className="pl-1">{li}</li>)}
        </ol>,
      );
    }
    tables.forEach((t, j) => {
      if ((t.at ?? n) === k) out.push(<ArticleTableView key={`t${k}-${j}`} t={t} />);
    });
    if (s.ul && (s.ulAt ?? n) === k) {
      out.push(
        <ul key={`ul${k}`} className="space-y-2">
          {s.ul.map((li, j) => (
            <li key={j} className="flex gap-2 text-sm sm:text-base leading-relaxed text-slate-600">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600" />
              <span>{li}</span>
            </li>
          ))}
        </ul>,
      );
    }
    if (k < n) out.push(<p key={`p${k}`} className="text-sm sm:text-base leading-relaxed text-slate-600">{s.p[k]}</p>);
  }
  return <>{out}</>;
}

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
                  {s.table || s.ol || s.ul ? (
                    <SectionBody s={s} />
                  ) : (
                    s.p.map((para, j) => (
                      <p key={j} className="text-sm sm:text-base leading-relaxed text-slate-600">{para}</p>
                    ))
                  )}
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

          {/* Скачиваемый шаблон к статье (Article.loc[*].download) — файл из public/docs */}
          {body.download && (
            <div className="mt-8 rounded-xl border border-brand-200 bg-brand-50 p-4 sm:p-5">
              <a
                href={body.download.href}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-500"
              >
                <span aria-hidden>↓</span> {body.download.label}
              </a>
              {body.download.note && <p className="mt-3 text-sm leading-relaxed text-slate-600">{body.download.note}</p>}
            </div>
          )}

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
