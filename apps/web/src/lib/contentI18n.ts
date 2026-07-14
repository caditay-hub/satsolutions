// Переводы контента из БД (портфолио, «О компании», адрес) — оверлей по locale.
// RU — оригинал из БД. Для остальных языков накладываем перевод по slug/индексу.
// При изменении контента в админке (RU) переводы здесь нужно синхронизировать вручную.

type Loc = "uz" | "en" | "tr" | "zh";

type SubCard = { title?: string; header?: string; description?: string };
type WorkItem = { title?: string; subCards?: SubCard[] };
type ProjectTr = {
  title?: string;
  excerpt?: string;
  content?: string;
  clientTasks?: string;
  location?: string;
  items?: WorkItem[];
};

// ─── Категории портфолио (по slug) ────────────────────────────────────────────
const CATEGORY: Record<string, Record<Loc, string>> = {
  "videonablyudenie": { uz: "Videokuzatuv", en: "Video surveillance", tr: "Video gözetim", zh: "视频监控" },
  "videosteny": { uz: "Videodevorlar", en: "Video walls", tr: "Video duvarları", zh: "视频墙" },
  "kompleksnaya-bezopasnost": { uz: "Kompleks xavfsizlik", en: "Integrated security", tr: "Entegre güvenlik", zh: "综合安防" },
  "skud": { uz: "Kirish nazorati", en: "Access control", tr: "Geçiş kontrolü", zh: "门禁系统" }
};

// ─── Проекты портфолио (по slug) ──────────────────────────────────────────────
const PROJECT: Record<string, Record<Loc, ProjectTr>> = {
  "uzum-videonablyudenie-skladov-i-punktov-vydachi": {
    uz: {
      title: "Uzum — omborlar va buyurtma topshirish punktlarida videokuzatuv",
      location: "Toshkent",
      clientTasks: "Omborlar va 100+ topshirish punktida videokuzatuv; Dahua jihozlari; montaj, SKS, ishga tushirish, masofaviy monitoring.",
      excerpt: "Uzum marketpleysi uchun videokuzatuv tizimi: Toshkentdagi 1000 m²dan ortiq markaziy omborlar va butun O‘zbekiston bo‘ylab 100+ buyurtma topshirish punktlari tarmog‘i. Dahua jihozlari, kalit topshirish asosida — montaj, SKS, ishga tushirish va masofaviy monitoring.",
      content: "O‘zbekistondagi eng yirik marketpleys Uzum ekotizimi uchun SAT Solutions mutaxassislari asosiy logistika obyektlarida videokuzatuv tizimini joriy etdi: Toshkentdagi 1000 m²dan ortiq markaziy omborlarda va butun O‘zbekiston bo‘ylab 100 dan ortiq buyurtma topshirish punktlari tarmog‘ida.\n\nLoyiha doirasida bajarildi:\n\nDahua jihozlarini tanlash va yetkazib berish;\nomborlarda IP-kameralarni montaj qilish — qabul qilish, saqlash va jo‘natish zonalarini nazorat qilish;\nmamlakat bo‘ylab shaharlardagi buyurtma topshirish punktlarini videokuzatuv bilan jihozlash;\nstrukturalashtirilgan kabel tarmoqlarini (SKS) yotqizish;\ntarmoq videoregistratorlari (NVR) va saqlash xotirasini o‘rnatish va sozlash;\ntizimni ishga tushirish, masofaviy kirish va monitoringni sozlash;\nxodimlarni tizim bilan ishlashga o‘rgatish.\n\nAmalga oshirilgan yechim omborlarda tovar saqlanishini, qabul va jo‘natish operatsiyalarini nazorat qilishni hamda butun topshirish punktlari tarmog‘ini 24/7 rejimda shaffof markazlashgan monitoringini ta’minladi."
    },
    en: {
      title: "Uzum — video surveillance at warehouses and pickup points",
      location: "Tashkent",
      clientTasks: "Surveillance at warehouses and 100+ pickup points; Dahua equipment; installation, structured cabling, commissioning, remote monitoring.",
      excerpt: "A surveillance system for the Uzum marketplace: central warehouses in Tashkent of over 1,000 m² and a network of 100+ order pickup points across Uzbekistan. Dahua equipment, turnkey delivery — installation, structured cabling, commissioning and remote monitoring.",
      content: "For the ecosystem of Uzum — the largest marketplace in Uzbekistan — SAT Solutions specialists deployed a video surveillance system at the key logistics facilities: the central warehouses in Tashkent covering over 1,000 m² and a network of more than 100 order pickup points across the country.\n\nThe following work was carried out as part of the project:\n\nselection and supply of Dahua equipment;\ninstallation of IP cameras at the warehouses — control of the receiving, storage and dispatch zones;\nequipping order pickup points in cities across the country with surveillance;\nlaying of structured cabling systems (SCS);\ninstallation and configuration of network video recorders (NVR) and storage;\ncommissioning of the system and setup of remote access and monitoring;\nstaff training on working with the system.\n\nThe solution ensured the safety of goods in the warehouses, control over receiving and dispatch operations, and transparent centralized 24/7 monitoring of the entire pickup point network."
    },
    tr: {
      title: "Uzum — depolarda ve teslim noktalarında video gözetim",
      location: "Taşkent",
      clientTasks: "Depolarda ve 100+ teslim noktasında gözetim; Dahua ekipmanı; kurulum, yapısal kablolama, devreye alma, uzaktan izleme.",
      excerpt: "Uzum pazaryeri için gözetim sistemi: Taşkent'te 1.000 m²'den büyük merkezi depolar ve Özbekistan genelinde 100'den fazla sipariş teslim noktası ağı. Dahua ekipmanı, anahtar teslim — kurulum, yapısal kablolama, devreye alma ve uzaktan izleme.",
      content: "Özbekistan'ın en büyük pazaryeri Uzum ekosistemi için SAT Solutions uzmanları, ana lojistik tesislerinde bir video gözetim sistemi kurdu: Taşkent'teki 1.000 m²'den büyük merkezi depolar ve ülke genelinde 100'den fazla sipariş teslim noktası ağı.\n\nProje kapsamında aşağıdaki işler yapıldı:\n\nDahua ekipmanının seçimi ve tedariki;\ndepolarda IP kameraların kurulumu — kabul, depolama ve sevkiyat bölgelerinin kontrolü;\nülke genelindeki şehirlerde sipariş teslim noktalarının gözetimle donatılması;\nyapısal kablolama sistemlerinin (SCS) döşenmesi;\nağ video kaydedicilerinin (NVR) ve depolamanın kurulumu ve yapılandırılması;\nsistemin devreye alınması, uzaktan erişim ve izlemenin yapılandırılması;\npersonelin sistem kullanımı konusunda eğitimi.\n\nUygulanan çözüm, depolardaki malların güvenliğini, kabul ve sevkiyat işlemlerinin kontrolünü ve tüm teslim noktası ağının şeffaf, merkezi 7/24 izlenmesini sağladı."
    },
    zh: {
      title: "Uzum — 仓库与自提点视频监控",
      location: "塔什干",
      clientTasks: "仓库及100多个自提点的监控；大华设备；安装、综合布线、调试、远程监控。",
      excerpt: "为 Uzum 电商平台部署的视频监控系统：塔什干1000多平方米的中央仓库，以及覆盖全乌兹别克斯坦的100多个订单自提点网络。采用大华（Dahua）设备，交钥匙工程——安装、综合布线、调试及远程监控。",
      content: "SAT Solutions 的专家为乌兹别克斯坦最大的电商平台 Uzum 的生态系统，在关键物流设施部署了视频监控系统：塔什干1000多平方米的中央仓库，以及覆盖全国的100多个订单自提点网络。\n\n项目范围内完成了以下工作：\n\n大华（Dahua）设备的选型与供应；\n仓库内 IP 摄像机的安装——管控收货、存储和发货区域；\n为全国各城市的订单自提点配备视频监控；\n敷设综合布线系统（SCS）；\n网络录像机（NVR）及存储设备的安装与配置；\n系统调试以及远程访问和监控的设置；\n对员工进行系统操作培训。\n\n该方案确保了仓库货物的安全、收发货操作的管控，以及对整个自提点网络的透明集中式7×24监控。"
    }
  },

  "ucell-ustanovka-videosteny-dahua-v-situacionnom-centre": {
    uz: {
      title: "Ucell — Vaziyat markazida Dahua videodevorini o‘rnatish",
      location: "Toshkent",
      excerpt: "3×4 (12 panel) LC55UL videodevori, diagonali 55\" va 1.8 mm panellararo chok bilan. Videodevor 8 ta HDMI chiqishi va 8 ta HDMI kirishiga ega DVM X100-D8/8 kontrolleri boshqaruvida ishlaydi. Kunu-tun rejimda videodevorga markaz operatorlarining ish joylaridan ma’lumot chiqariladi. Videodevor oldindan tayyorlangan devorga, to‘liq chiqadigan kronshteynlar yordamida nishga o‘rnatilgan. Montajdan so‘ng xodimlar o‘qitildi va videodevor kontrollerini sozlash bo‘yicha keyingi maslahatlar berildi.",
      items: [
        { title: "Dahua videodevori", subCards: [{ title: "LED/LCD videodevor 3×4 (12 panel)", header: "Dahua", description: "•\tProfessional LED/LCD videodevor 3×4 (12 panel) o‘rnatildi\n•\tMinimal panellararo chok\n•\tYuqori yorqinlik va kontrastlik\n•\t24/7 rejimda kuyib qolmasdan ishlash" }] },
        { title: "Boshqaruv kontrolleri", subCards: [{ title: "Boshqaruv kontrolleri", header: "Dahua", description: "•\tDahua videoprotsessorlari o‘rnatildi\n•\tQo‘llab-quvvatlash: Ekranni zonalarga bo‘lish\n• IP-kameralarni chiqarish\n• SCADA / NOC tizimlarini ko‘rsatish\n• Videokonferensiya" }] },
        { title: "Kontent manbalari", subCards: [{ title: "Kontent manbalari", header: "Dahua", description: "Videodevor quyidagilar bilan integratsiyalangan:\n•\tDahua videokuzatuv tizimi\n•\ttarmoq monitoring panellari\n•\tbo‘limlarning hisobot dashboardlari\n•\tvideokonferensaloqa" }] }
      ]
    },
    en: {
      title: "Ucell — Dahua video wall installation in a control room",
      location: "Tashkent",
      excerpt: "A 3×4 (12-panel) LC55UL video wall, 55\" diagonal with a 1.8 mm inter-panel seam. The wall runs on a DVM X100-D8/8 controller with 8 HDMI outputs and 8 HDMI inputs. Around the clock it displays information from the center operators' workstations. The wall was mounted into a niche on a pre-prepared wall using full-extension brackets. After installation, staff were trained and given follow-up consultations on configuring the video-wall controller.",
      items: [
        { title: "Dahua video wall", subCards: [{ title: "LED/LCD video wall 3×4 (12 panels)", header: "Dahua", description: "•\tProfessional LED/LCD video wall 3×4 (12 panels) installed\n•\tMinimal inter-panel seam\n•\tHigh brightness and contrast\n•\t24/7 operation without burn-in" }] },
        { title: "Management controller", subCards: [{ title: "Management controller", header: "Dahua", description: "•\tDahua video processors installed\n•\tSupports: splitting the screen into zones\n• displaying IP cameras\n• showing SCADA / NOC systems\n• video conferencing" }] },
        { title: "Content sources", subCards: [{ title: "Content sources", header: "Dahua", description: "The video wall is integrated with:\n•\tthe Dahua surveillance system\n•\tnetwork monitoring panels\n•\tdepartmental reporting dashboards\n•\tvideo conferencing" }] }
      ]
    },
    tr: {
      title: "Ucell — Durum merkezinde Dahua video duvarı kurulumu",
      location: "Taşkent",
      excerpt: "3×4 (12 panel) LC55UL video duvarı, 55\" köşegen ve 1,8 mm panel arası ek yeri ile. Duvar, 8 HDMI çıkışı ve 8 HDMI girişi olan DVM X100-D8/8 denetleyicisiyle çalışır. 7/24 merkez operatörlerinin iş istasyonlarından bilgi duvara aktarılır. Duvar, önceden hazırlanmış duvara tam açılır braketlerle bir nişe monte edildi. Kurulumdan sonra personel eğitildi ve video duvarı denetleyicisinin yapılandırması konusunda danışmanlık sağlandı.",
      items: [
        { title: "Dahua video duvarı", subCards: [{ title: "LED/LCD video duvarı 3×4 (12 panel)", header: "Dahua", description: "•\tProfesyonel LED/LCD video duvarı 3×4 (12 panel) kuruldu\n•\tMinimum panel arası ek\n•\tYüksek parlaklık ve kontrast\n•\tYanma olmadan 7/24 çalışma" }] },
        { title: "Yönetim denetleyicisi", subCards: [{ title: "Yönetim denetleyicisi", header: "Dahua", description: "•\tDahua video işlemcileri kuruldu\n•\tDestek: Ekranı bölgelere ayırma\n• IP kameraların gösterimi\n• SCADA / NOC sistemlerinin gösterimi\n• Video konferans" }] },
        { title: "İçerik kaynakları", subCards: [{ title: "İçerik kaynakları", header: "Dahua", description: "Video duvarı şunlarla entegredir:\n•\tDahua gözetim sistemi\n•\tağ izleme panelleri\n•\tbirimlerin raporlama panoları\n•\tvideo konferans" }] }
      ]
    },
    zh: {
      title: "Ucell — 在指挥中心安装大华视频墙",
      location: "塔什干",
      excerpt: "3×4（12块拼接屏）LC55UL视频墙，55英寸对角线，拼缝1.8毫米。视频墙由DVM X100-D8/8控制器驱动，配备8路HDMI输出和8路HDMI输入。全天候将中心操作员工作站的信息显示在墙上。视频墙采用全伸缩支架嵌入预先处理好的墙体凹槽中。安装后对员工进行了培训，并就视频墙控制器配置提供了后续咨询。",
      items: [
        { title: "大华视频墙", subCards: [{ title: "LED/LCD视频墙 3×4（12块）", header: "Dahua", description: "•\t安装专业LED/LCD视频墙 3×4（12块）\n•\t极小拼缝\n•\t高亮度高对比度\n•\t7×24运行不烧屏" }] },
        { title: "控制处理器", subCards: [{ title: "控制处理器", header: "Dahua", description: "•\t安装大华视频处理器\n•\t支持：屏幕分区\n• 显示IP摄像机\n• 显示SCADA / NOC系统\n• 视频会议" }] },
        { title: "内容信号源", subCards: [{ title: "内容信号源", header: "Dahua", description: "视频墙已与以下系统集成：\n•\t大华视频监控系统\n•\t网络监控面板\n•\t各部门报表看板\n•\t视频会议" }] }
      ]
    }
  },

  "zhk-tower-up-intellektualnaya-sistema-bezopasnosti-i-videomonitoringa": {
    uz: {
      title: "Tower Up turar-joy majmuasi — Aqlli xavfsizlik va videomonitoring tizimi",
      excerpt: "Toshkentdagi Tower Up turar-joy majmuasida xavfsizlik va videokuzatuv tizimini kompleks joriy etish: liftlardagi va perimetr bo‘ylab kameralar, videodevor, aqlli parkovka, shlagbaumlar va yagona vaziyat markazi.",
      content: "Toshkent shahridagi Tower Up turar-joy majmuasida SAT Solutions mutaxassislari zamonaviy xavfsizlik va markazlashtirilgan videomonitoring tizimlari majmuasini amalga oshirdi.\n\nLoyiha doirasida quyidagi ishlar bajarildi:\n\nliftlarga IP-videokuzatuv kameralarini o‘rnatish;\nmajmua perimetri bo‘ylab kunu-tun videonazoratni tashkil etish;\nyagona monitoring vaziyat markazini joriy etish;\ndispetcherlik va tezkor choralar uchun professional videodevor o‘rnatish;\navtomatik shlagbaumlarni integratsiya qilish;\navtomobillarning kirish-chiqishini nazorat qiluvchi aqlli parkovka tizimini joriy etish;\nobyekt xavfsizlik tizimini markazlashgan boshqarish.\n\nAmalga oshirilgan yechim aholi xavfsizligini oshirish, majmua hududini to‘liq vizual nazorat qilish hamda kirish va parkovkani boshqarishni avtomatlashtirish imkonini berdi.\n\nLoyiha professional jihozlar va IP-videokuzatuv hamda aqlli xavfsizlik tizimlari sohasidagi zamonaviy yechimlar yordamida bajarildi."
    },
    en: {
      title: "Tower Up residential complex — Intelligent security and video-monitoring system",
      excerpt: "Comprehensive deployment of a security and surveillance system at the Tower Up residential complex in Tashkent: cameras in elevators and along the perimeter, a video wall, smart parking, barriers and a unified control center.",
      content: "At the Tower Up residential complex in Tashkent, SAT Solutions specialists implemented a suite of modern security and centralized video-monitoring systems.\n\nThe following work was carried out as part of the project:\n\ninstallation of IP surveillance cameras in the elevators;\nround-the-clock video monitoring along the perimeter of the complex;\ndeployment of a unified monitoring control center;\ninstallation of a professional video wall for dispatching and rapid response;\nintegration of automatic barriers;\ndeployment of a smart parking system with vehicle entry/exit control;\ncentralized management of the site's security system.\n\nThe solution increased residents' safety, provided full visual control of the complex, and automated access and parking management.\n\nThe project was carried out using professional equipment and modern IP-surveillance and intelligent security solutions."
    },
    tr: {
      title: "Tower Up konut sitesi — Akıllı güvenlik ve video izleme sistemi",
      excerpt: "Taşkent'teki Tower Up konut sitesinde güvenlik ve gözetim sisteminin kapsamlı kurulumu: asansörlerde ve çevrede kameralar, video duvarı, akıllı otopark, bariyerler ve birleşik durum merkezi.",
      content: "Taşkent'teki Tower Up konut sitesinde SAT Solutions uzmanları, modern güvenlik ve merkezi video izleme sistemlerinden oluşan bir bütün hayata geçirdi.\n\nProje kapsamında aşağıdaki işler yapıldı:\n\nasansörlere IP gözetim kameralarının kurulumu;\nsitenin çevresinde 7/24 video izleme;\nbirleşik izleme durum merkezinin kurulması;\nsevkiyat ve hızlı müdahale için profesyonel video duvarı kurulumu;\notomatik bariyerlerin entegrasyonu;\naraç giriş-çıkış kontrollü akıllı otopark sisteminin kurulması;\ntesis güvenlik sisteminin merkezi yönetimi.\n\nUygulanan çözüm, sakinlerin güvenliğini artırdı, sitenin tam görsel kontrolünü sağladı ve erişim ile otopark yönetimini otomatikleştirdi.\n\nProje, profesyonel ekipman ve IP gözetim ile akıllı güvenlik alanındaki modern çözümler kullanılarak gerçekleştirildi."
    },
    zh: {
      title: "Tower Up住宅区 — 智能安防与视频监控系统",
      excerpt: "在塔什干Tower Up住宅区全面部署安防与监控系统：电梯内及周界摄像机、视频墙、智能停车、道闸以及统一指挥中心。",
      content: "在塔什干Tower Up住宅区，SAT Solutions的专家部署了一套现代化安防与集中式视频监控系统。\n\n项目范围内完成了以下工作：\n\n在电梯内安装IP监控摄像机；\n对住宅区周界进行全天候视频监控；\n建设统一的监控指挥中心；\n安装专业视频墙用于调度与快速响应；\n集成自动道闸；\n部署带车辆进出控制的智能停车系统；\n对项目安防系统进行集中管理。\n\n该方案提升了住户的安全水平，实现了对小区的全面可视化管控，并使门禁和停车管理实现自动化。\n\n项目采用专业设备及IP监控与智能安防领域的现代化解决方案完成。"
    }
  },

  "sistema-videonablyudeniya-na-bodikamerah-dahua": {
    uz: {
      title: "Dahua bodikameralarida videokuzatuv tizimi",
      location: "Toshkent",
      excerpt: "Toshkentdagi StreetParking parkovkasining avtomatlashtirilgan videokuzatuv tizimi uchun DSS Pro dasturi bilan 150 dan ortiq Dahua bodikamerasini yetkazib berish va sozlash.",
      clientTasks: "Shahar parkovka zonalarida parking xodimlari ishini videoqayd etishni tashkil etish: kunu-tun yozib olish, videoarxivni markazlashgan saqlash va barcha kameralarni yagona markazdan boshqarish.",
      content: "StreetParking kompaniyasi uchun SAT Solutions mutaxassislari Toshkent parkovka zonalari uchun Dahua taqiladigan kameralar (bodikameralar) asosidagi avtomatlashtirilgan videokuzatuv tizimini kompleks yetkazib berish va sozlashni amalga oshirdi.\n\nYetkazib berilgan uskunalar:\n— Dahua DH-MPT230 bodikameralari — ovozli Full HD yozuv, to‘liq ish smenasiga yetadigan batareya\n— har biri 8 uyali Dahua DH-EEC300D8-N1 ma’lumot yig‘ish stansiyalari va DH-EEC300 nazorat modullari — bodikameralarni bir vaqtda quvvatlash va yozuvlarni avtomatik yuklash (umumiy oqim 128 MB/s gacha)\n— markazlashgan videoarxiv uchun server uskunalari va ma’lumotlarni saqlash tizimi\n— Dahua DSS Pro platformasi: bazaviy DSS8PRVB litsenziyasi, DSS8PRV kanal litsenziyalari va DSS8PRGTALK guruhli aloqa moduli\n— operatorlar va joylardagi xodimlarni muvofiqlashtirish uchun guruhli aloqa moduli\n\nYechim arxitekturasi:\n— Smena boshlanishi: xodim stansiyadan quvvatlangan bodikamerani oladi — vaqt va sozlamalar avtomatik sinxronlanadi.\n— Smena davomida kamera parkovka zonasidagi ishni qayd etadi: ovozli video, muhim epizodlarni bir tugma bilan belgilash.\n— Smena yakuni: kamera DH-EEC300D8-N1 dok-stansiyasiga qo‘yiladi — quvvatlash va barcha yozuvlarni markaziy saqlash tizimiga yuklash operatorsiz, avtomatik bajariladi.\n— Videoarxiv markazlashgan holda saqlanadi; saqlash muddatlari va kirish huquqlari DSS Pro siyosatlari orqali belgilanadi.\n— Dispetcherlik markazi DSS Pro orqali butun kamera parkini boshqaradi: qurilmalar holati, quvvat, yuklash nazorati, arxivdan sana, qurilma va parkovka zonasi bo‘yicha qidiruv.\n— Guruhli aloqa moduli markaz operatorlari va joylardagi xodimlarni real vaqtdagi yagona ovozli tarmoqqa birlashtiradi.\n\nMijoz uchun natija:\n— har bir parking xodimining ishi videoga yozib olinadi va markazlashgan arxivda mavjud\n— mijozlar bilan bahsli holatlar yozuv asosida bir necha daqiqada hal qilinadi\n— 150+ kameradan iborat park yozuvlarni qo‘lda yuklashni talab qilmaydi — jarayon to‘liq avtomatlashtirilgan"
    },
    en: {
      title: "Video surveillance system based on Dahua body cameras",
      location: "Tashkent",
      excerpt: "Supply and setup of more than 150 Dahua body cameras with DSS Pro software for the automated surveillance system of the StreetParking service in Tashkent.",
      clientTasks: "Set up video recording of parking staff's work in the city's parking zones: round-the-clock recording, centralized video-archive storage, and management of the entire camera fleet from a single center.",
      content: "For StreetParking, SAT Solutions specialists carried out the complete supply and setup of an automated surveillance system based on Dahua wearable cameras (body cameras) for Tashkent's parking zones.\n\nEquipment supplied:\n— Dahua DH-MPT230 body cameras — Full HD video with audio, battery lasting a full work shift\n— Dahua DH-EEC300D8-N1 data collection stations (8 docks each) and DH-EEC300 control modules — simultaneous charging and automatic footage upload (total throughput up to 128 MB/s)\n— server hardware and a storage system for the centralized video archive\n— the Dahua DSS Pro platform: the DSS8PRVB base license, DSS8PRV channel licenses and the DSS8PRGTALK group-talk module\n— a group-communication module for coordinating operators and field staff\n\nSolution architecture:\n— Shift start: the employee takes a charged body camera from the docking station — time and settings sync automatically.\n— During the shift the camera records work in the parking zone: video with audio, one-button marking of key episodes.\n— Shift end: the camera is docked into the DH-EEC300D8-N1 station — charging and uploading of all footage to central storage happen automatically, with no operator involvement.\n— The video archive is stored centrally; retention periods and access rights are governed by DSS Pro policies.\n— The control room manages the entire camera fleet via DSS Pro: device status, charge, upload control, and archive search by date, device and parking zone.\n— The group-communication module connects control-room operators and field staff into a single real-time voice network.\n\nResults for the client:\n— every parking employee's work is recorded on video and available in the centralized archive\n— customer disputes are resolved from footage within minutes\n— the 150+ camera fleet requires no manual uploads — the process is fully automated"
    },
    tr: {
      title: "Dahua beden kameralarıyla video gözetim sistemi",
      location: "Taşkent",
      excerpt: "Taşkent'teki StreetParking hizmetinin otomatik gözetim sistemi için DSS Pro yazılımıyla 150'den fazla Dahua beden kamerasının tedariki ve devreye alınması.",
      clientTasks: "Şehrin otopark bölgelerinde otopark personelinin çalışmasının video kaydını sağlamak: 7/24 kayıt, merkezi video arşivi depolama ve tüm kamera filosunun tek merkezden yönetimi.",
      content: "StreetParking için SAT Solutions uzmanları, Taşkent otopark bölgeleri için Dahua giyilebilir kameralara (beden kameraları) dayalı otomatik gözetim sisteminin eksiksiz tedarik ve kurulumunu gerçekleştirdi.\n\nTedarik edilen ekipman:\n— Dahua DH-MPT230 beden kameraları — sesli Full HD kayıt, tam vardiyaya yetecek batarya\n— her biri 8 yuvalı Dahua DH-EEC300D8-N1 veri toplama istasyonları ve DH-EEC300 kontrol modülleri — eşzamanlı şarj ve kayıtların otomatik aktarımı (toplam akış 128 MB/s'ye kadar)\n— merkezi video arşivi için sunucu donanımı ve veri depolama sistemi\n— Dahua DSS Pro platformu: DSS8PRVB temel lisansı, DSS8PRV kanal lisansları ve DSS8PRGTALK grup iletişim modülü\n— operatörler ile sahadaki personelin koordinasyonu için grup iletişim modülü\n\nÇözüm mimarisi:\n— Vardiya başlangıcı: personel, istasyondan şarjlı beden kamerasını alır — saat ve ayarlar otomatik senkronize edilir.\n— Vardiya boyunca kamera otopark bölgesindeki çalışmayı kaydeder: sesli video, önemli anların tek tuşla işaretlenmesi.\n— Vardiya sonu: kamera DH-EEC300D8-N1 istasyonuna yerleştirilir — şarj ve tüm kayıtların merkezi depolamaya aktarımı operatörsüz, otomatik yapılır.\n— Video arşivi merkezi olarak saklanır; saklama süreleri ve erişim hakları DSS Pro politikalarıyla yönetilir.\n— Kontrol merkezi DSS Pro üzerinden tüm kamera filosunu yönetir: cihaz durumu, şarj, aktarım kontrolü; arşivde tarih, cihaz ve otopark bölgesine göre arama.\n— Grup iletişim modülü, merkez operatörleri ile sahadaki personeli gerçek zamanlı tek ses ağında birleştirir.\n\nMüşteri için sonuçlar:\n— her otopark çalışanının işi videoya kaydedilir ve merkezi arşivde erişilebilir\n— müşterilerle yaşanan ihtilaflar kayıt üzerinden dakikalar içinde çözülür\n— 150+ kameralık filo manuel aktarım gerektirmez — süreç tamamen otomatiktir"
    },
    zh: {
      title: "基于大华执法记录仪的视频监控系统",
      location: "塔什干",
      excerpt: "为塔什干StreetParking服务的自动化监控系统供应并调试150多台搭载DSS Pro软件的大华执法记录仪。",
      clientTasks: "在城市停车区域对停车工作人员的工作进行视频记录：全天候录制、集中存储视频档案，并从统一中心管理所有摄像设备。",
      content: "SAT Solutions的专家为StreetParking公司完成了基于大华可穿戴摄像机（执法记录仪）的自动化监控系统的整体供应与调试，服务于塔什干的各停车区域。\n\n交付设备：\n— 大华DH-MPT230执法记录仪——带音频的全高清录像，电池续航覆盖整个班次\n— 大华DH-EEC300D8-N1数据采集站（每台8个仓位）及DH-EEC300控制模块——同时充电并自动上传录像（总带宽高达128 MB/s）\n— 用于集中视频存档的服务器设备和数据存储系统\n— 大华DSS Pro平台：DSS8PRVB基础授权、DSS8PRV通道授权及DSS8PRGTALK集群通信模块\n— 用于调度中心与现场人员协同的集群通信模块\n\n方案架构：\n— 班次开始：员工从采集站取下已充满电的记录仪——时间与设置自动同步。\n— 班次期间，记录仪记录停车区域的工作：带声音的视频，一键标记重要片段。\n— 班次结束：记录仪放回DH-EEC300D8-N1采集站——充电和全部录像上传至中央存储自动完成，无需人工操作。\n— 视频档案集中存储；保存期限和访问权限由DSS Pro策略统一管理。\n— 调度中心通过DSS Pro管理整个设备群：设备状态、电量、上传监控，并可按日期、设备和停车区域检索档案。\n— 集群通信模块将调度中心与现场人员连接为实时统一语音网络。\n\n客户收益：\n— 每位停车场员工的工作均有视频记录并存入集中档案\n— 与顾客的争议可在几分钟内凭录像厘清\n— 150余台设备无需人工导出录像——流程完全自动化"
    }
  },

  "montazh-servernoy-komnaty": {
    uz: {
      title: "Server xonasini montaj qilish",
      location: "Toshkent",
      excerpt: "Toshkentda server xonasini kalit topshirish asosida montaj qilish: server shkaflarini o‘rnatish, kabel trassalari, SKS/LVS va elektr ta’minotini tashkil etish.",
      content: "SAT Solutions mutaxassislari Toshkentda server xonasini kalit topshirish asosida montaj qildi — xonani tayyorlashdan tartibli muhandislik infratuzilmasigacha.\n\nIshlar tarkibi:\n— samarali sovutish uchun perforatsiyalangan eshikli bir qator server shkaflarini o‘rnatish\n— shift ostida kabel lotoklari va trassalarini montaj qilish, past kuchlanishli va kuch liniyalarini ozoda tarqatish\n— strukturali kabel tizimi (SKS) va lokal tarmoq (LVS)\n— stoykalar elektr ta’minotini tashkil etish\n— keyingi xizmat ko‘rsatishga qulay standartlar bo‘yicha kabelni markirovka qilish va yotqizish\n\nNatija — ishonchli, masshtablanadigan va ozoda montaj qilingan, faol uskunalarni joylashtirish uchun tayyor server xonasi."
    },
    en: {
      title: "Server room installation",
      location: "Tashkent",
      excerpt: "Turnkey server room installation in Tashkent: server cabinets, cable routes, structured cabling/LAN and power supply organization.",
      content: "SAT Solutions specialists carried out a turnkey server room installation in Tashkent — from preparing the room to a well-organized engineering infrastructure.\n\nScope of work:\n— installation of a row of server cabinets with perforated doors for effective cooling\n— installation of cable trays and routes under the ceiling, neat layout of low-voltage and power lines\n— structured cabling system (SCS) and local area network (LAN)\n— organization of rack power supply\n— labeling and laying cable to standards convenient for future maintenance\n\nThe result is a reliable, scalable and neatly installed server room, ready to house active equipment."
    },
    tr: {
      title: "Sunucu odası kurulumu",
      location: "Taşkent",
      excerpt: "Taşkent'te anahtar teslim sunucu odası kurulumu: sunucu kabinetleri, kablo güzergahları, yapısal kablolama/LAN ve güç beslemesi düzenlemesi.",
      content: "SAT Solutions uzmanları Taşkent'te anahtar teslim bir sunucu odası kurulumu gerçekleştirdi — odanın hazırlanmasından düzenli mühendislik altyapısına kadar.\n\nİş kapsamı:\n— etkili soğutma için delikli kapılı bir dizi sunucu kabineti kurulumu\n— tavan altında kablo kanalları ve güzergahlarının montajı, zayıf akım ve güç hatlarının düzenli dağıtımı\n— yapısal kablolama sistemi (SCS) ve yerel ağ (LAN)\n— kabinet güç beslemesinin düzenlenmesi\n— ileride bakımı kolaylaştıracak standartlara göre kablo etiketleme ve döşeme\n\nSonuç — aktif ekipmanı barındırmaya hazır, güvenilir, ölçeklenebilir ve düzgün kurulmuş bir sunucu odası."
    },
    zh: {
      title: "机房安装工程",
      location: "塔什干",
      excerpt: "在塔什干交钥匙建设机房：安装服务器机柜、桥架走线、综合布线/局域网及供电组织。",
      content: "SAT Solutions的专家在塔什干完成了交钥匙机房建设——从场地准备到规整的机电基础设施。\n\n工作内容：\n— 安装一排带穿孔门的服务器机柜以实现高效散热\n— 在吊顶下安装桥架与走线，整齐布放弱电与强电线路\n— 综合布线系统（SCS）与局域网（LAN）\n— 组织机柜供电\n— 按便于后期维护的标准进行线缆标识与敷设\n\n成果——一间可靠、可扩展、布置整洁的机房，可随时部署有源设备。"
    }
  },

  "skud-zavod-baltika": {
    uz: {
      title: "«Baltika» zavodida kirish nazorati",
      location: "Toshkent",
      excerpt: "Toshkentdagi «Baltika» zavodining o‘tish punktlari va ishlab chiqarish zonalarida kirish nazorati tizimi: turniketlar, biometriya, ish vaqti hisobi va 1C bilan integratsiya.",
      content: "SAT Solutions mutaxassislari Toshkentdagi «Baltika» zavodida kirish nazorati (SKUD) tizimini joriy etdi — o‘tish punktlarida va ishlab chiqarish zonalarida.\n\nIshlar tarkibi:\n— o‘tish punktlarida (KPP) turniket va kalitkalar\n— biometrik terminallar va karta o‘qigichlar\n— ishlab chiqarish va ombor zonalariga kirish nazorati\n— xodimlar ish vaqtini hisobga olish, avtomatik tabel va 1C ga eksport\n— huquqlarni hudud, smena va jadval bo‘yicha sozlash\n— videokuzatuv bilan integratsiya va yagona monitoring\n\nNatija — zavod hududiga xavfsiz o‘tish, aniq ish vaqti hisobi va kirishni markazlashgan boshqarish."
    },
    en: {
      title: "Access control at the Baltika factory",
      location: "Tashkent",
      excerpt: "Access control system at the checkpoints and production areas of the Baltika factory in Tashkent: turnstiles, biometrics, time tracking and 1C integration.",
      content: "SAT Solutions specialists deployed an access control (ACS) system at the Baltika factory in Tashkent — at the checkpoints and in the production areas.\n\nScope of work:\n— turnstiles and gates at the checkpoints\n— biometric terminals and card readers\n— access control to production and storage areas\n— employee working-time tracking with automatic timesheets and export to 1C\n— configuring rights by zone, shift and schedule\n— integration with surveillance and unified monitoring\n\nThe result is secure entry to the factory grounds, accurate working-time tracking and centralized access management."
    },
    tr: {
      title: "Baltika fabrikasında geçiş kontrolü",
      location: "Taşkent",
      excerpt: "Taşkent'teki Baltika fabrikasının giriş noktaları ve üretim alanlarında geçiş kontrol sistemi: turnikeler, biyometri, mesai takibi ve 1C entegrasyonu.",
      content: "SAT Solutions uzmanları Taşkent'teki Baltika fabrikasında geçiş kontrol (SKUD) sistemini hayata geçirdi — giriş noktalarında ve üretim alanlarında.\n\nİş kapsamı:\n— giriş noktalarında turnike ve kapılar\n— biyometrik terminaller ve kart okuyucular\n— üretim ve depo alanlarına geçiş kontrolü\n— çalışanların mesai takibi, otomatik puantaj ve 1C'ye aktarım\n— yetkilerin bölge, vardiya ve programa göre ayarlanması\n— gözetim ile entegrasyon ve birleşik izleme\n\nSonuç — fabrika sahasına güvenli giriş, doğru mesai takibi ve merkezi erişim yönetimi."
    },
    zh: {
      title: "Baltika工厂门禁系统",
      location: "塔什干",
      excerpt: "塔什干Baltika工厂出入口及生产区域的门禁系统：闸机、生物识别、考勤记录及1C集成。",
      content: "SAT Solutions的专家在塔什干Baltika工厂部署了门禁（ACS）系统——位于各出入口及生产区域。\n\n工作内容：\n— 出入口（门卫）安装闸机与通道门\n— 生物识别终端与读卡器\n— 生产区与仓储区的门禁管控\n— 员工考勤，自动生成考勤表并导出至1C\n— 按区域、班次和时段配置权限\n— 与视频监控集成并统一监控\n\n成果——安全进入厂区、精确考勤，对门禁集中管理。"
    }
  }
};

// ─── «О компании»: контент + адрес ────────────────────────────────────────────
const ABOUT: Record<Loc, { content: string; address: string }> = {
  uz: {
    content: "SAT Solutions — xavfsizlik va past kuchlanishli tizimlar sohasidagi kompaniya. Biz biznes, davlat muassasalari va turar-joy obyektlari uchun videokuzatuv, qo‘riqlash va yong‘in signalizatsiyasi, kirish nazorati hamda avtomatlashtirish tizimlarini loyihalaymiz, o‘rnatamiz va xizmat ko‘rsatamiz.\n\nKompaniya qo‘riqlash tizimlarini, shuningdek avtomatik yong‘in o‘chirish va yong‘in signalizatsiyasi tizimlarini montaj qilish, sozlash, ta’mirlash va texnik xizmat ko‘rsatish bo‘yicha rasmiy ruxsatnomalarga ega.\n\nButun O‘zbekiston bo‘ylab ishlaymiz. Har bir bosqichda sifat, muddatlarga rioya qilish va professional xizmatni kafolatlaymiz.",
    address: "Toshkent, Katta Darxon ko‘chasi 5"
  },
  en: {
    content: "SAT Solutions is a company in the field of security and low-voltage systems. We design, install and maintain video surveillance, intruder and fire alarm, access control and automation systems for businesses, government institutions and residential properties.\n\nThe company holds official permits for the installation, commissioning, repair and maintenance of security systems, as well as automatic fire-suppression and fire-alarm systems.\n\nWe work across Uzbekistan. We guarantee quality, adherence to deadlines and professional service at every stage.",
    address: "Tashkent, 5 Katta Darkhon St."
  },
  tr: {
    content: "SAT Solutions, güvenlik ve zayıf akım sistemleri alanında faaliyet gösteren bir şirkettir. İşletmeler, kamu kurumları ve konutlar için video gözetim, hırsız ve yangın alarmı, geçiş kontrolü ve otomasyon sistemleri tasarlar, kurar ve bakımını yaparız.\n\nŞirket; güvenlik sistemlerinin yanı sıra otomatik yangın söndürme ve yangın alarm sistemlerinin montajı, devreye alınması, onarımı ve bakımı için resmi izinlere sahiptir.\n\nTüm Özbekistan genelinde çalışıyoruz. Her aşamada kalite, sürelere uyum ve profesyonel hizmet garanti ediyoruz.",
    address: "Taşkent, Katta Darhon Cad. No:5"
  },
  zh: {
    content: "SAT Solutions是一家专注于安防与弱电系统领域的公司。我们为企业、政府机构和住宅项目设计、安装并维护视频监控、防盗与火灾报警、门禁及自动化系统。\n\n公司持有安防系统以及自动灭火和火灾报警系统的安装、调试、维修和维护的正式许可。\n\n我们的业务覆盖全乌兹别克斯坦。我们在每个阶段都保证质量、按期交付和专业服务。",
    address: "塔什干，Katta Darkhon街5号"
  }
};

function isLoc(l: string): l is Loc {
  return l === "uz" || l === "en" || l === "tr" || l === "zh";
}

function mergeItems(orig: any, tr?: WorkItem[]): any {
  if (!Array.isArray(orig) || !Array.isArray(tr)) return orig;
  return orig.map((it: any, i: number) => {
    const t = tr[i];
    if (!t) return it;
    return {
      ...it,
      title: t.title ?? it.title,
      subCards: Array.isArray(it.subCards)
        ? it.subCards.map((sc: any, j: number) => {
            const ts = t.subCards?.[j];
            if (!ts) return sc;
            return {
              ...sc,
              title: ts.title ?? sc.title,
              header: ts.header ?? sc.header,
              description: ts.description ?? sc.description
            };
          })
        : it.subCards
    };
  });
}

/** Локализованное имя категории портфолио (slug + RU-fallback). */
export function localizeCategoryName(slug: string | null | undefined, name: string, locale: string): string {
  if (!slug || !isLoc(locale)) return name;
  return CATEGORY[slug]?.[locale] ?? name;
}

/** Накладывает перевод на проект портфолио (по slug). RU/неизвестные — без изменений. */
export function localizePortfolioProject<T extends { slug: string; items?: any }>(p: T, locale: string): T {
  if (!isLoc(locale)) return p;
  const tr = PROJECT[p.slug]?.[locale];
  if (!tr) return p;
  const out: any = { ...p };
  if (tr.title) out.title = tr.title;
  if (tr.excerpt) out.excerpt = tr.excerpt;
  if (tr.content) out.content = tr.content;
  if (tr.clientTasks) out.clientTasks = tr.clientTasks;
  if (tr.location) out.location = tr.location;
  if (tr.items) out.items = mergeItems(p.items, tr.items);
  return out as T;
}

/** Локализованный контент страницы «О компании» (3 абзаца). */
export function localizeAboutContent(content: string, locale: string): string {
  if (!isLoc(locale)) return content;
  return ABOUT[locale]?.content ?? content;
}

/** Локализованный адрес (используется в about/contact/footer). */
export function localizeAddress(address: string | null, locale: string): string | null {
  if (!address || !isLoc(locale)) return address;
  return ABOUT[locale]?.address ?? address;
}
