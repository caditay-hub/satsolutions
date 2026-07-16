// Переводы маркетинговых описаний брендов на uz/en/tr/zh.
// Ключ = slug бренда (как в BRAND_CONFIG). displayName — имя собственное, не переводится.
// RU берётся из BRAND_CONFIG.description (фолбэк).
import { routing } from "@/i18n/routing";

type Loc = { uz: string; en: string; tr: string; zh: string };

const BRAND_DESC: Record<string, Loc> = {
  dahua: {
    en: "Dahua Technology is one of the world's leading manufacturers of video surveillance, access control, intrusion alarm and intelligent security solutions.",
    uz: "Dahua Technology — videokuzatuv, kirishni nazorat qilish, qo'riqlash signalizatsiyasi va aqlli xavfsizlik yechimlarining yetakchi jahon ishlab chiqaruvchilaridan biri.",
    tr: "Dahua Technology, video gözetim, geçiş kontrolü, hırsız alarmı ve akıllı güvenlik çözümlerinin dünyadaki önde gelen üreticilerinden biridir.",
    zh: "Dahua Technology（大华）是全球领先的视频监控、门禁、入侵报警和智能安防解决方案制造商之一。",
  },
  hikvision: {
    en: "Hikvision is a global leader in innovative security products and solutions: IP cameras, thermal imagers, access control and video analytics systems.",
    uz: "Hikvision — innovatsion xavfsizlik mahsulotlari va yechimlari bo'yicha jahon yetakchisi: IP kameralar, termovizorlar, kirishni nazorat qilish va videoanalitika tizimlari.",
    tr: "Hikvision, yenilikçi güvenlik ürünleri ve çözümlerinde dünya lideridir: IP kameralar, termal kameralar, geçiş kontrolü ve video analitik sistemleri.",
    zh: "海康威视（Hikvision）是创新安防产品和解决方案的全球领导者：IP摄像机、热成像仪、门禁和视频分析系统。",
  },
  rubezh: {
    en: "Rubezh is a Russian manufacturer of fire and security alarm, access control, notification and automation systems. The Rubezh R3 series is an addressable intelligent security system.",
    uz: "Rubezh — yong'in va qo'riqlash signalizatsiyasi, kirishni nazorat qilish, ogohlantirish va avtomatika tizimlarining rossiyalik ishlab chiqaruvchisi. Rubezh R3 seriyasi — manzilli aqlli xavfsizlik tizimi.",
    tr: "Rubezh, yangın ve güvenlik alarmı, geçiş kontrolü, anons ve otomasyon sistemlerinin Rus üreticisidir. Rubezh R3 serisi, adreslenebilir akıllı güvenlik sistemidir.",
    zh: "Rubezh 是俄罗斯的消防和安防报警、门禁、广播和自动化系统制造商。Rubezh R3 系列是可寻址智能安防系统。",
  },
  bolid: {
    en: "Bolid is a Russian manufacturer of the ISO Orion integrated security systems: fire and intrusion alarm, access control, video surveillance and notification.",
    uz: "Bolid — ISO Orion integrallashgan qo'riqlash tizimlarining rossiyalik ishlab chiqaruvchisi: yong'in va qo'riqlash signalizatsiyasi, kirishni nazorat qilish, videokuzatuv va ogohlantirish.",
    tr: "Bolid, ISO Orion entegre güvenlik sistemlerinin Rus üreticisidir: yangın ve hırsız alarmı, geçiş kontrolü, video gözetim ve anons.",
    zh: "Bolid 是俄罗斯 ISO Orion 集成安防系统制造商：消防和入侵报警、门禁、视频监控和广播。",
  },
  "sibirskiy-arsenal": {
    en: "Sibirsky Arsenal is a Russian manufacturer of fire and security alarm control panels: the Grand Magistr and Altai series, notification devices and automation.",
    uz: "Sibirsky Arsenal — qo'riqlash-yong'in signalizatsiyasi qabul-nazorat qurilmalarining rossiyalik ishlab chiqaruvchisi: «Grand Magistr» va «Altai» seriyalari, ogohlantirish qurilmalari va avtomatika.",
    tr: "Sibirsky Arsenal, yangın ve güvenlik alarmı kontrol panellerinin Rus üreticisidir: «Grand Magistr» ve «Altai» serileri, anons cihazları ve otomasyon.",
    zh: "Sibirsky Arsenal 是俄罗斯的消防和安防报警控制设备制造商：Grand Magistr 和 Altai 系列、广播设备及自动化产品。",
  },
  avigilon: {
    en: "Avigilon (Motorola Solutions) — premium high-resolution IP cameras with built-in AI video analytics and the Unity / Alta platform for cloud and on-premise management.",
    uz: "Avigilon (Motorola Solutions) — o'rnatilgan sun'iy intellekt videoanalitikasi va bulutli hamda lokal boshqaruv uchun Unity / Alta platformasiga ega yuqori aniqlikdagi premium IP kameralar.",
    tr: "Avigilon (Motorola Solutions) — yerleşik yapay zeka video analitiği ve bulut ile yerel yönetim için Unity / Alta platformuna sahip premium yüksek çözünürlüklü IP kameralar.",
    zh: "Avigilon（摩托罗拉解决方案）——内置 AI 视频分析的高分辨率高端 IP 摄像机，配备用于云端和本地管理的 Unity / Alta 平台。",
  },
  hilook: {
    en: "HiLook by Hikvision is an affordable video surveillance range: IP and HD cameras, recorders and PoE switches with Hikvision's signature quality.",
    uz: "HiLook by Hikvision — hamyonbop videokuzatuv liniyasi: Hikvision sifatiga ega IP va HD kameralar, videoregistratorlar va PoE kommutatorlar.",
    tr: "HiLook by Hikvision, uygun fiyatlı video gözetim serisidir: Hikvision kalitesinde IP ve HD kameralar, kaydediciler ve PoE switchler.",
    zh: "HiLook by Hikvision 是经济实惠的视频监控产品线：具备海康威视品质的 IP 和 HD 摄像机、录像机和 PoE 交换机。",
  },
  tplink: {
    en: "TP-Link is one of the world's largest networking manufacturers: switches, routers, Omada access points and business solutions.",
    uz: "TP-Link — tarmoq uskunalarining eng yirik jahon ishlab chiqaruvchilaridan biri: kommutatorlar, marshrutizatorlar, Omada kirish nuqtalari va biznes yechimlari.",
    tr: "TP-Link, dünyanın en büyük ağ ekipmanı üreticilerinden biridir: switchler, yönlendiriciler, Omada erişim noktaları ve işletme çözümleri.",
    zh: "TP-Link（普联）是全球最大的网络设备制造商之一：交换机、路由器、Omada 接入点和企业解决方案。",
  },
  tapo: {
    en: "Tapo is TP-Link's smart device brand: Wi-Fi cameras for home and business, video surveillance and smart home accessories.",
    uz: "Tapo — TP-Link'ning aqlli qurilmalar brendi: uy va biznes uchun Wi-Fi kameralar, videokuzatuv va aqlli uy aksessuarlari.",
    tr: "Tapo, TP-Link'in akıllı cihaz markasıdır: ev ve işletme için Wi-Fi kameralar, video gözetim ve akıllı ev aksesuarları.",
    zh: "Tapo 是 TP-Link 的智能设备品牌：家用和商用 Wi-Fi 摄像机、视频监控和智能家居配件。",
  },
  mercusys: {
    en: "Mercusys is affordable networking gear from the TP-Link group: Mesh systems, routers and switches for home and office.",
    uz: "Mercusys — TP-Link guruhidan hamyonbop tarmoq uskunalari: uy va ofis uchun Mesh tizimlar, marshrutizatorlar va kommutatorlar.",
    tr: "Mercusys, TP-Link grubundan uygun fiyatlı ağ ekipmanlarıdır: ev ve ofis için Mesh sistemler, yönlendiriciler ve switchler.",
    zh: "Mercusys（水星）是 TP-Link 集团旗下的经济型网络设备：适用于家庭和办公室的 Mesh 系统、路由器和交换机。",
  },
  witek: {
    en: "Wi-Tek is networking equipment for video surveillance and communications: PoE switches, routers and wireless bridges.",
    uz: "Wi-Tek — videokuzatuv va aloqa tizimlari uchun tarmoq uskunalari: PoE kommutatorlar, marshrutizatorlar va simsiz ko'priklar.",
    tr: "Wi-Tek, video gözetim ve iletişim sistemleri için ağ ekipmanlarıdır: PoE switchler, yönlendiriciler ve kablosuz köprüler.",
    zh: "Wi-Tek 是用于视频监控和通信的网络设备：PoE 交换机、路由器和无线网桥。",
  },
  kanihad: {
    en: "KANIHAD provides access control and passage automation equipment: turnstiles, barriers and switches.",
    uz: "KANIHAD — kirishni nazorat qilish va o'tishni avtomatlashtirish uskunalari: turniketlar, shlagbaumlar va kommutatorlar.",
    tr: "KANIHAD, geçiş kontrolü ve geçiş otomasyonu ekipmanları sunar: turnikeler, bariyerler ve switchler.",
    zh: "KANIHAD 提供门禁和通道自动化设备：闸机、道闸和交换机。",
  },
  zkteco: {
    en: "ZKTeco is a global manufacturer of biometric security systems: face and fingerprint recognition terminals, access control, turnstiles and cameras.",
    uz: "ZKTeco — biometrik xavfsizlik tizimlarining jahon ishlab chiqaruvchisi: yuz va barmoq izini tanish terminallari, SKUD, turniketlar va kameralar.",
    tr: "ZKTeco, biyometrik güvenlik sistemlerinin küresel üreticisidir: yüz ve parmak izi tanıma terminalleri, geçiş kontrolü, turnikeler ve kameralar.",
    zh: "ZKTeco（中控智慧）是全球生物识别安防系统制造商：人脸和指纹识别终端、门禁、闸机和摄像机。",
  },
  ubiquiti: {
    en: "Ubiquiti offers professional UniFi networking solutions: Wi-Fi access points, switches and carrier-grade routers.",
    uz: "Ubiquiti — professional UniFi tarmoq yechimlari: Wi-Fi kirish nuqtalari, kommutatorlar va operator darajasidagi marshrutizatorlar.",
    tr: "Ubiquiti, profesyonel UniFi ağ çözümleri sunar: Wi-Fi erişim noktaları, switchler ve operatör sınıfı yönlendiriciler.",
    zh: "Ubiquiti 提供专业的 UniFi 网络解决方案：Wi-Fi 接入点、交换机和运营商级路由器。",
  },
  mikrotik: {
    en: "MikroTik makes routers, switches and wireless systems on RouterOS for ISPs, offices and complex networks.",
    uz: "MikroTik — provayderlar, ofislar va murakkab tarmoqlar uchun RouterOS asosidagi marshrutizatorlar, kommutatorlar va simsiz tizimlar.",
    tr: "MikroTik, internet sağlayıcıları, ofisler ve karmaşık ağlar için RouterOS tabanlı yönlendiriciler, switchler ve kablosuz sistemler üretir.",
    zh: "MikroTik 为运营商、办公室和复杂网络提供基于 RouterOS 的路由器、交换机和无线系统。",
  },
  ruijie: {
    en: "Ruijie Networks — Reyee cloud networks: routers, managed switches, Wi-Fi 6/7 access points and radio bridges for business and ISPs.",
    uz: "Ruijie Networks — Reyee bulutli tarmoqlari: biznes va provayderlar uchun marshrutizatorlar, boshqariladigan kommutatorlar, Wi-Fi 6/7 kirish nuqtalari va radioko'priklar.",
    tr: "Ruijie Networks — Reyee bulut ağları: işletmeler ve internet sağlayıcıları için yönlendiriciler, yönetilebilir switchler, Wi-Fi 6/7 erişim noktaları ve radyo köprüleri.",
    zh: "Ruijie Networks（锐捷）——Reyee 云网络：面向企业和运营商的路由器、网管交换机、Wi-Fi 6/7 接入点和无线网桥。",
  },
  prochee: {
    en: "Components and related equipment: brackets and mounting accessories, cable, fiber optics, hard drives, notification and fire safety.",
    uz: "Komplektlovchi va yondosh uskunalar: kronshteynlar va montaj aksessuarlari, kabel, optika, qattiq disklar, ogohlantirish va yong'in xavfsizligi.",
    tr: "Bileşenler ve ilgili ekipmanlar: braketler ve montaj aksesuarları, kablo, fiber optik, sabit diskler, anons ve yangın güvenliği.",
    zh: "配件及相关设备：支架和安装配件、线缆、光纤、硬盘、广播和消防安全。",
  },
  pixietech: {
    en: "Pixietech — network and telecom infrastructure: switches, SFP modules, fiber optics and structured cabling, telecom cabinets, UPS, IP telephony, server equipment and tools.",
    uz: "Pixietech — tarmoq va telekom infratuzilmasi: kommutatorlar, SFP modullar, optika va SKS, telekommunikatsiya shkaflari, UPS, IP-telefoniya, server uskunalari va asboblar.",
    tr: "Pixietech — ağ ve telekom altyapısı: switchler, SFP modüller, fiber optik ve yapısal kablolama, telekom kabinleri, UPS, IP telefon, sunucu ekipmanları ve araçlar.",
    zh: "Pixietech——网络和电信基础设施：交换机、SFP 模块、光纤和综合布线、通信机柜、UPS、IP 电话、服务器设备和工具。",
  },
  snr: {
    en: "SNR — telecom and networking equipment: managed switches, optical distribution frames and boxes, media converters, CWDM multiplexers, SFP modules and power supplies.",
    uz: "SNR — telekom va tarmoq uskunalari: boshqariladigan kommutatorlar, optik krosslar va bokslar, mediakonverterlar, CWDM multipleksorlar, SFP modullar va quvvat manbalari.",
    tr: "SNR — telekom ve ağ ekipmanları: yönetilebilir switchler, optik dağıtım çerçeveleri ve kutuları, medya dönüştürücüler, CWDM çoğullayıcılar, SFP modüller ve güç kaynakları.",
    zh: "SNR——电信和网络设备：网管交换机、光纤配线架和配线盒、媒体转换器、CWDM 复用器、SFP 模块和电源。",
  },
  tuya: {
    en: "Tuya — Wi-Fi smart home devices: cameras, sensors, smart plugs and switches, locks, thermostats and alarm systems.",
    uz: "Tuya — Wi-Fi aqlli uy qurilmalari: kameralar, datchiklar, aqlli rozetkalar va vyklyuchatellar, qulflar, termostatlar va signalizatsiya tizimlari.",
    tr: "Tuya — Wi-Fi akıllı ev cihazları: kameralar, sensörler, akıllı prizler ve anahtarlar, kilitler, termostatlar ve alarm sistemleri.",
    zh: "Tuya（涂鸦）——Wi-Fi 智能家居设备：摄像机、传感器、智能插座和开关、门锁、温控器和报警系统。",
  },
  cambium: {
    en: "Cambium Networks — carrier wireless solutions: ePMP/PMP radio bridges, access points and access network equipment.",
    uz: "Cambium Networks — operator simsiz yechimlari: ePMP/PMP radioko'priklar, kirish nuqtalari va kirish tarmog'i uskunalari.",
    tr: "Cambium Networks — operatör kablosuz çözümleri: ePMP/PMP radyo köprüleri, erişim noktaları ve erişim ağı ekipmanları.",
    zh: "Cambium Networks——运营商无线解决方案：ePMP/PMP 无线网桥、接入点和接入网设备。",
  },
  cisco: {
    en: "Cisco is a global networking leader: enterprise-class switches, routers and IP telephony.",
    uz: "Cisco — tarmoq uskunalarining jahon yetakchisi: korporativ darajadagi kommutatorlar, marshrutizatorlar va IP-telefoniya.",
    tr: "Cisco, küresel ağ lideridir: kurumsal sınıf switchler, yönlendiriciler ve IP telefon.",
    zh: "Cisco（思科）是全球网络领导者：企业级交换机、路由器和 IP 电话。",
  },
  vertiv: {
    en: "Vertiv — uninterruptible power supplies (UPS), power and cooling systems for data centers and telecom infrastructure.",
    uz: "Vertiv — uzluksiz quvvat manbalari (UPS), ma'lumotlar markazlari va telekom infratuzilmasi uchun elektr ta'minoti va sovutish tizimlari.",
    tr: "Vertiv — kesintisiz güç kaynakları (UPS), veri merkezleri ve telekom altyapısı için güç ve soğutma sistemleri.",
    zh: "Vertiv（维谛）——用于数据中心和电信基础设施的不间断电源（UPS）、供电和制冷系统。",
  },
  teltonika: {
    en: "Teltonika Networks — industrial cellular routers and gateways (RUT/TRB), IoT and M2M solutions for reliable connectivity.",
    uz: "Teltonika Networks — sanoat uyali marshrutizatorlari va shlyuzlari (RUT/TRB), ishonchli aloqa uchun IoT va M2M yechimlari.",
    tr: "Teltonika Networks — endüstriyel hücresel yönlendiriciler ve ağ geçitleri (RUT/TRB), güvenilir bağlantı için IoT ve M2M çözümleri.",
    zh: "Teltonika Networks——工业蜂窝路由器和网关（RUT/TRB），用于可靠连接的物联网和 M2M 解决方案。",
  },
  fanvil: {
    en: "Fanvil — IP phones, SIP door phones and intercoms for offices, hotels and communication systems.",
    uz: "Fanvil — ofislar, mehmonxonalar va aloqa tizimlari uchun IP-telefonlar, SIP-domofonlar va interkomlar.",
    tr: "Fanvil — ofisler, oteller ve iletişim sistemleri için IP telefonlar, SIP kapı telefonları ve interkomlar.",
    zh: "Fanvil（方位）——用于办公室、酒店和通信系统的 IP 电话、SIP 门禁电话和对讲机。",
  },
  eltex: {
    en: "Eltex is a telecom equipment manufacturer: switches, routers, GPON/GEPON and subscriber devices.",
    uz: "Eltex — telekom uskunalari ishlab chiqaruvchisi: kommutatorlar, marshrutizatorlar, GPON/GEPON va abonent qurilmalari.",
    tr: "Eltex, telekom ekipmanı üreticisidir: switchler, yönlendiriciler, GPON/GEPON ve abone cihazları.",
    zh: "Eltex 是电信设备制造商：交换机、路由器、GPON/GEPON 和用户终端设备。",
  },
  finen: {
    en: "FINEN — telecom and server cabinets (floor-standing and wall-mounted) and equipment mounting accessories.",
    uz: "FINEN — telekommunikatsiya va server shkaflari (poldan va devorga o'rnatiladigan) hamda uskunalarni montaj qilish aksessuarlari.",
    tr: "FINEN — telekom ve sunucu kabinleri (yer ve duvar tipi) ve ekipman montaj aksesuarları.",
    zh: "FINEN——电信和服务器机柜（落地式和壁挂式）及设备安装配件。",
  },
  siklu: {
    en: "Siklu — millimeter-wave radio relay systems (E-band/V-band) for high-speed wireless links.",
    uz: "Siklu — yuqori tezlikdagi simsiz kanallar uchun millimetr diapazonidagi radiorele tizimlari (E-band/V-band).",
    tr: "Siklu — yüksek hızlı kablosuz bağlantılar için milimetre dalga radyo röle sistemleri (E-band/V-band).",
    zh: "Siklu——用于高速无线链路的毫米波无线电中继系统（E-band/V-band）。",
  },
  "v-sol": {
    en: "V-SOL — GPON/EPON optical access equipment: OLT station terminals and ONU/ONT subscriber units.",
    uz: "V-SOL — GPON/EPON optik kirish uskunalari: OLT stansiya terminallari va ONU/ONT abonent qurilmalari.",
    tr: "V-SOL — GPON/EPON optik erişim ekipmanları: OLT istasyon terminalleri ve ONU/ONT abone birimleri.",
    zh: "V-SOL——GPON/EPON 光接入设备：OLT 局端终端和 ONU/ONT 用户终端。",
  },
  huawei: {
    en: "Huawei — enterprise switches, routers and carrier-grade networking solutions.",
    uz: "Huawei — korporativ kommutatorlar, marshrutizatorlar va operator darajasidagi tarmoq yechimlari.",
    tr: "Huawei — kurumsal switchler, yönlendiriciler ve operatör sınıfı ağ çözümleri.",
    zh: "Huawei（华为）——企业级交换机、路由器和运营商级网络解决方案。",
  },
  bdcom: {
    en: "BDCOM — broadband access equipment: GPON/EPON OLT station terminals and ONU subscriber units.",
    uz: "BDCOM — keng polosali kirish uskunalari: GPON/EPON OLT stansiya terminallari va ONU abonent qurilmalari.",
    tr: "BDCOM — geniş bant erişim ekipmanları: GPON/EPON OLT istasyon terminalleri ve ONU abone birimleri.",
    zh: "BDCOM（迪威科）——宽带接入设备：GPON/EPON OLT 局端终端和 ONU 用户终端。",
  },
  "c-data": {
    en: "C-Data — GPON/EPON optical access solutions: OLT terminals and ONU/ONT subscriber devices.",
    uz: "C-Data — GPON/EPON optik kirish yechimlari: OLT terminallari va ONU/ONT abonent qurilmalari.",
    tr: "C-Data — GPON/EPON optik erişim çözümleri: OLT terminalleri ve ONU/ONT abone cihazları.",
    zh: "C-Data——GPON/EPON 光接入解决方案：OLT 终端和 ONU/ONT 用户设备。",
  },
  h3c: {
    en: "H3C — enterprise networks: managed switches, routers and data center solutions.",
    uz: "H3C — korporativ tarmoqlar: boshqariladigan kommutatorlar, marshrutizatorlar va ma'lumotlar markazi yechimlari.",
    tr: "H3C — kurumsal ağlar: yönetilebilir switchler, yönlendiriciler ve veri merkezi çözümleri.",
    zh: "H3C（新华三）——企业网络：网管交换机、路由器和数据中心解决方案。",
  },
  apc: {
    en: "APC — uninterruptible power supplies (UPS), surge protectors and power solutions for IT equipment.",
    uz: "APC — uzluksiz quvvat manbalari (UPS), tarmoq filtrlari va IT uskunalari uchun elektr ta'minoti yechimlari.",
    tr: "APC — kesintisiz güç kaynakları (UPS), akım korumalar ve BT ekipmanları için güç çözümleri.",
    zh: "APC——不间断电源（UPS）、电涌保护器和 IT 设备供电解决方案。",
  },
};

/** Локализованное описание бренда (фолбэк на русское из BRAND_CONFIG). */
export function localizeBrandDesc(slug: string | undefined, fallback: string, locale: string): string {
  if (!slug || locale === routing.defaultLocale) return fallback;
  const e = BRAND_DESC[slug.toLowerCase()];
  if (!e) return fallback;
  return (e as Record<string, string>)[locale]?.trim() || fallback;
}

// Имена брендов: переводим/транслитерируем только те, что по-русски (псевдобренд + рос. вендоры).
// Настоящие бренды (Hikvision, Dahua, …) — имена собственные, возвращаем как есть.
const BRAND_NAME: Record<string, Loc> = {
  prochee: { uz: "Butlovchi qismlar va aksessuarlar", en: "Components & Accessories", tr: "Bileşenler ve Aksesuarlar", zh: "配件与辅材" },
  rubezh: { uz: "Rubezh", en: "Rubezh", tr: "Rubezh", zh: "Rubezh" },
  bolid: { uz: "Bolid", en: "Bolid", tr: "Bolid", zh: "Bolid" },
  "sibirskiy-arsenal": { uz: "Sibirsky Arsenal", en: "Sibirsky Arsenal", tr: "Sibirsky Arsenal", zh: "Sibirsky Arsenal" },
};

/** Локализованное имя бренда (для названий с кириллицей; настоящие бренды — фолбэк без изменений). */
export function localizeBrandName(slug: string | undefined, fallback: string, locale: string): string {
  if (!slug || locale === routing.defaultLocale) return fallback;
  const e = BRAND_NAME[slug.toLowerCase()];
  if (!e) return fallback;
  return (e as Record<string, string>)[locale]?.trim() || fallback;
}
