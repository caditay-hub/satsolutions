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
      content: "StreetParking kompaniyasi uchun SAT Solutions mutaxassislari Toshkent parkovka zonalari uchun Dahua taqiladigan kameralar (bodikameralar) asosidagi avtomatlashtirilgan videokuzatuv tizimini kompleks yetkazib berish va sozlashni amalga oshirdi.\n\nBodikameralar parking xodimlarining ishini qayd etadi, suratga olingan materiallar markazlashgan saqlash joyiga yuklanadi va videoarxivda mavjud bo‘ladi. Guruhli aloqa moduli operatorlar va joylardagi xodimlarga real vaqtda aloqada bo‘lish imkonini beradi, barcha kameralar esa Dahua DSS Pro dasturi orqali markazlashgan boshqariladi.\n\nYetkazib berish tarkibi:\n— 150 dan ortiq Dahua bodikamerasi\n— ma’lumotlarni saqlash tizimi\n— DH-EEC300D8-N1 saqlash uskunasi\n— bazaviy video-litsenziya va DSS8PRV video-kanal litsenziyalari\n— guruhli aloqa moduli"
    },
    en: {
      title: "Video surveillance system based on Dahua body cameras",
      location: "Tashkent",
      excerpt: "Supply and setup of more than 150 Dahua body cameras with DSS Pro software for the automated surveillance system of the StreetParking service in Tashkent.",
      clientTasks: "Set up video recording of parking staff's work in the city's parking zones: round-the-clock recording, centralized video-archive storage, and management of the entire camera fleet from a single center.",
      content: "For StreetParking, SAT Solutions specialists carried out the complete supply and setup of an automated surveillance system based on Dahua wearable cameras (body cameras) for Tashkent's parking zones.\n\nThe body cameras record the work of parking staff; the footage is uploaded to centralized storage and available in the video archive. A group-communication module lets operators and field staff stay in touch in real time, while the entire camera fleet is managed centrally via Dahua DSS Pro software.\n\nScope of supply:\n— more than 150 Dahua body cameras\n— a data storage system\n— DH-EEC300D8-N1 storage equipment\n— a base video license and DSS8PRV video-channel licenses\n— a group-communication module"
    },
    tr: {
      title: "Dahua beden kameralarıyla video gözetim sistemi",
      location: "Taşkent",
      excerpt: "Taşkent'teki StreetParking hizmetinin otomatik gözetim sistemi için DSS Pro yazılımıyla 150'den fazla Dahua beden kamerasının tedariki ve devreye alınması.",
      clientTasks: "Şehrin otopark bölgelerinde otopark personelinin çalışmasının video kaydını sağlamak: 7/24 kayıt, merkezi video arşivi depolama ve tüm kamera filosunun tek merkezden yönetimi.",
      content: "StreetParking için SAT Solutions uzmanları, Taşkent otopark bölgeleri için Dahua giyilebilir kameralara (beden kameraları) dayalı otomatik gözetim sisteminin eksiksiz tedarik ve kurulumunu gerçekleştirdi.\n\nBeden kameraları otopark personelinin çalışmasını kaydeder; çekilen görüntüler merkezi depolamaya yüklenir ve video arşivinde erişilebilir. Grup iletişim modülü, operatörlerin ve sahadaki personelin gerçek zamanlı iletişimde kalmasını sağlar; tüm kamera filosu ise Dahua DSS Pro yazılımıyla merkezi olarak yönetilir.\n\nTedarik kapsamı:\n— 150'den fazla Dahua beden kamerası\n— veri depolama sistemi\n— DH-EEC300D8-N1 depolama ekipmanı\n— temel video lisansı ve DSS8PRV video kanal lisansları\n— grup iletişim modülü"
    },
    zh: {
      title: "基于大华执法记录仪的视频监控系统",
      location: "塔什干",
      excerpt: "为塔什干StreetParking服务的自动化监控系统供应并调试150多台搭载DSS Pro软件的大华执法记录仪。",
      clientTasks: "在城市停车区域对停车工作人员的工作进行视频记录：全天候录制、集中存储视频档案，并从统一中心管理所有摄像设备。",
      content: "SAT Solutions的专家为StreetParking公司完成了基于大华可穿戴摄像机（执法记录仪）的自动化监控系统的整体供应与调试，服务于塔什干的各停车区域。\n\n执法记录仪记录停车工作人员的工作，拍摄的素材上传至集中存储并可在视频档案中查阅。集群通信模块使操作员与现场人员保持实时联络，而整个摄像设备群通过大华DSS Pro软件集中管理。\n\n供货清单：\n— 150多台大华执法记录仪\n— 数据存储系统\n— DH-EEC300D8-N1存储设备\n— 基础视频授权及DSS8PRV视频通道授权\n— 集群通信模块"
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
