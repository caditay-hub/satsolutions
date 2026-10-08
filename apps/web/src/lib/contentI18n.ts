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
  /** SEO-заголовок и описание для выдачи (RU — поля seoTitle/seoDescription в БД). */
  seoTitle?: string;
  seoDescription?: string;
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
  // ЖК TowerUp, 2-я очередь: ВОЛС между 8 домами (08.10.2026). Картинки — иллюстрации (lib/illustrative).
  "zhk-towerup-vols-mezhdu-domami": {
    uz: {
      title: "TowerUp turar-joy majmuasi — 8 ta uy oʻrtasida optik aloqa liniyasi va videokuzatuv tuguni",
      seoTitle: "TowerUp TJM: 8 ta uy oʻrtasida optik tola liniyasi, Toshkent",
      seoDescription: "SAT Solutions keysi: TowerUp TJMda 8 ta uy oʻrtasida 849 m osma optik kabel, reflektometr bilan tekshirilgan 24 ta payvand, 28 TB arxivli videokuzatuv tuguni.",
      location: "Toshkent, Sergeli tumani",
      excerpt: "Toshkentdagi TowerUp turar-joy majmuasining ikkinchi navbati: SAT Solutions sakkizta turar-joy binosi oʻrtasida 849 m osma optik kabel yotqizdi va markaziy videokuzatuv tugunini yigʻdi — reflektometr bilan tekshirilgan 24 ta payvand, 8 ta optik kross, 28 TB arxiv.",
      clientTasks: "Ikkinchi navbatdagi sakkizta yangi uyning (2/9–2/16 blok-seksiyalar) videokuzatuvini bitta tizimga birlashtirish: har bir uydan signalni markaziy tugungacha yoʻqotishlarsiz va xalaqitlarsiz yetkazish, umumiy arxiv va elektr uzilishlaridan himoya bilan.",
      content: "TowerUp turar-joy majmuasining ikkinchi navbati — Toshkentda, TKAD boʻylab «Yangi Oʻzbekiston» massividagi sakkizta koʻp qavatli turar-joy binosi (2/9–2/16 blok-seksiyalar). Har bir uyning videokuzatuvini bitta markaziy tugunga birlashtirish kerak edi, uylar orasidagi va tugungacha boʻlgan masofa esa yuzlab metrni tashkil etadi. Mis tarmoq kabelining chegarasi 100 m, bu masofaga u yaramaydi, shuning uchun aloqa optik tolada qurildi.\nQiyinchilik nimada edi:\n— trassa uylar orasidan havo orqali oʻtdi: kabel balandlikda poʻlat trosga osildi, yoʻlning bir qismi kabel kanalizatsiyasi orqali oʻtdi;\n— ishlar faol qurilish maydonida olib borildi, shuning uchun kabel alohida metall ustunlarga mahkamlandi;\n— tolaning har bir ulanishi soʻnishga tekshiruvdan oʻtishi kerak edi.\nNima qilindi:\n— 4 tolali 849 m osma optik kabel yotqizildi; loyihada 1 307 m koʻzda tutilgan edi — amalda kamroq kerak boʻldi va buyurtmachi haqiqiy hajm uchun toʻladi;\n— kabelni osish uchun 8 ta metall ustun, tugunda esa kabel lotoklari oʻrnatildi;\n— tolalar 24 joyda payvandlandi, har bir payvandning soʻnishi reflektometr bilan tekshirildi;\n— har bir uyga devorga oʻrnatiladigan optik kross qoʻyildi, liniyalar uchlariga 20 km gacha masofaga moʻljallangan 16 ta SFP-modul oʻrnatildi;\n— markaziy tugun yigʻildi: 8 portli 19\" optik kross, 12U devor shkafi, boshqariladigan kommutator, 28 TB arxivli 32 kanalli Dahua registratori va 3 kVA quvvatli onlayn UPS.\nNatija:\n— sakkiz uyning har biri markaziy tugunga oʻz optik liniyasi bilan ulangan: binolar orasidagi masofa va elektromagnit xalaqitlar videoga taʼsir qilmaydi;\n— barcha uylardagi yozuvlar bitta arxivga tushadi, elektr oʻchganda tugun UPS hisobiga ishlashda davom etadi;\n— ishlar ijro hujjatlari bilan birga 2 va 3-shakldagi dalolatnomalar boʻyicha topshirildi; keyingi bosqichda ushbu liniyaga uylarning videokuzatuvi — 24 ta kamera ulandi.",
    },
    en: {
      title: "TowerUp residential complex — fiber-optic link between 8 buildings and a CCTV hub",
      seoTitle: "Fiber-optic link between 8 apartment buildings in Tashkent",
      seoDescription: "SAT Solutions case: 849 m of aerial fiber between 8 TowerUp apartment buildings, 24 fusion splices tested with an OTDR, a CCTV hub with a 28 TB archive.",
      location: "Tashkent, Sergeli district",
      excerpt: "Phase two of the TowerUp residential complex in Tashkent: SAT Solutions laid 849 m of aerial fiber-optic cable between eight apartment buildings and built a central video surveillance hub — 24 fusion splices tested with an OTDR, 8 optical distribution boxes, a 28 TB archive.",
      clientTasks: "Bring the video surveillance of eight new phase-two buildings (block sections 2/9–2/16) into one system: deliver the signal from every building to the central hub without loss or interference, with a shared archive and protection against power outages.",
      content: "Phase two of the TowerUp residential complex is eight high-rise apartment buildings (block sections 2/9–2/16) in the Yangi Uzbekiston area along the Tashkent Ring Road. The video surveillance of every building had to be brought into one central hub, while the distances between the buildings and to the hub run to hundreds of metres. Copper network cable is limited to 100 m, so it could not do the job — the link was built on fiber.\nWhat made it difficult:\n— the route ran overhead between the buildings: the cable was hung on a steel messenger wire at height, with part of the way through underground cable ducts;\n— the work was done on an active construction site, so the cable was fixed to dedicated metal poles;\n— every fiber joint had to pass an attenuation test.\nWhat we did:\n— laid 849 m of 4-fiber aerial optical cable; the design called for 1,307 m — less was needed in practice, and the customer paid for the actual length;\n— installed 8 metal poles for the aerial run and cable trays at the hub;\n— made 24 fusion splices and checked the loss of each one with an OTDR;\n— fitted a wall-mounted optical distribution box in every building and 16 SFP modules rated for up to 20 km at the line ends;\n— assembled the central hub: a 19\" 8-port fiber patch panel, a 12U wall cabinet, a managed switch, a 32-channel Dahua recorder with a 28 TB archive and a 3 kVA online UPS.\nResult:\n— each of the eight buildings is connected to the central hub by its own fiber line: distance and interference between the buildings do not affect the video;\n— recordings from all buildings go to a single archive, and during a power cut the hub keeps running on the UPS;\n— the work was handed over under Form 2 and Form 3 acceptance certificates with as-built documentation; at the next stage the video surveillance of the buildings — 24 cameras — was connected to this line.",
    },
    tr: {
      title: "TowerUp konut kompleksi — 8 bina arasında fiber optik hat ve video gözetim merkezi",
      seoTitle: "Taşkent'te 8 apartman arasında fiber optik hat kurulumu",
      seoDescription: "SAT Solutions projesi: TowerUp konut kompleksinde 8 bina arasında 849 m havai fiber, OTDR ile test edilen 24 füzyon ek ve 28 TB arşivli video gözetim merkezi.",
      location: "Taşkent, Sergeli ilçesi",
      excerpt: "Taşkent'teki TowerUp konut kompleksinin ikinci etabı: SAT Solutions sekiz apartman binası arasına 849 m havai fiber optik kablo çekti ve merkezi video gözetim düğümünü kurdu — OTDR ile test edilen 24 füzyon ek, 8 optik dağıtım kutusu, 28 TB arşiv.",
      clientTasks: "İkinci etabın sekiz yeni binasının (blok 2/9–2/16) video gözetimini tek sistemde birleştirmek: her binadan merkezi düğüme sinyali kayıpsız ve parazitsiz ulaştırmak, ortak arşiv kurmak ve elektrik kesintilerine karşı koruma sağlamak.",
      content: "TowerUp konut kompleksinin ikinci etabı, Taşkent çevre yolu boyunca Yangi Özbekistan bölgesinde yer alan sekiz çok katlı apartman binasından (blok 2/9–2/16) oluşuyor. Her binanın video gözetimi tek bir merkezi düğümde toplanmalıydı; binalar arasındaki ve düğüme kadar olan mesafeler ise yüzlerce metreyi buluyor. Bakır ağ kablosunun sınırı 100 m olduğu için burada çözüm olamazdı, bu yüzden bağlantı fiber optik üzerine kuruldu.\nZorluk neydi:\n— hat binalar arasında havadan geçti: kablo yükseklikte çelik taşıyıcı tele asıldı, yolun bir kısmı yer altı kablo kanalından geçti;\n— çalışmalar aktif bir şantiyede yürütüldü, bu nedenle kablo ayrı metal direklere sabitlendi;\n— her fiber ekinin zayıflama testinden geçmesi gerekiyordu.\nNeler yaptık:\n— 4 lifli 849 m havai fiber optik kablo çektik; projede 1.307 m öngörülmüştü — uygulamada daha azı yetti ve müşteri gerçek uzunluğun bedelini ödedi;\n— askı için 8 metal direk, düğümde ise kablo tavaları kurduk;\n— 24 füzyon ek yaptık ve her birinin kaybını OTDR ile ölçtük;\n— her binaya duvar tipi optik dağıtım kutusu, hat uçlarına 20 km'ye kadar mesafe için 16 SFP modül yerleştirdik;\n— merkezi düğümü kurduk: 8 portlu 19\" fiber patch panel, 12U duvar kabini, yönetilebilir switch, 28 TB arşivli 32 kanallı Dahua kayıt cihazı ve 3 kVA online UPS.\nSonuç:\n— sekiz binanın her biri merkezi düğüme kendi fiber hattıyla bağlı: binalar arası mesafe ve parazit görüntüyü etkilemiyor;\n— tüm binaların kayıtları tek arşive gidiyor, elektrik kesildiğinde düğüm UPS ile çalışmaya devam ediyor;\n— işler, uygulama dokümantasyonuyla birlikte 2 ve 3 numaralı form tutanaklarıyla teslim edildi; bir sonraki aşamada bu hatta binaların video gözetimi — 24 kamera — bağlandı.",
    },
    zh: {
      title: "TowerUp 住宅小区——8 栋楼之间的光纤通信线路与视频监控中心节点",
      seoTitle: "塔什干 8 栋住宅楼之间的光纤线路敷设案例",
      seoDescription: "SAT Solutions 案例：在 TowerUp 住宅小区 8 栋楼之间架设 849 米光缆，24 个熔接点经 OTDR 测试，建成存储 28 TB 的视频监控中心节点。",
      location: "塔什干，谢尔盖利区",
      excerpt: "塔什干 TowerUp 住宅小区二期：SAT Solutions 在八栋住宅楼之间架设了 849 米架空光缆，并搭建了视频监控中心节点——24 个熔接点均经 OTDR 测试，8 台光纤配线箱，录像存储 28 TB。",
      clientTasks: "将二期八栋新楼（2/9–2/16 号楼）的视频监控整合为一个系统：把每栋楼的信号无损耗、无干扰地传到中心节点，统一存储录像，并防止停电造成中断。",
      content: "TowerUp 住宅小区二期由八栋高层住宅楼（2/9–2/16 号楼）组成，位于塔什干环城公路沿线的 Yangi Uzbekiston 片区。每栋楼的视频监控需要汇聚到一个中心节点，而楼与楼之间以及到节点的距离达数百米。铜质网线的传输极限为 100 米，无法满足要求，因此采用光纤组网。\n难点在哪里：\n— 线路在楼宇之间架空敷设：光缆挂在高处的钢绞线上，部分路段走地下电缆管道；\n— 施工在正在建设的工地上进行，因此光缆固定在专设的金属立杆上；\n— 每个光纤接点都必须通过衰减测试。\n我们做了什么：\n— 敷设 849 米 4 芯架空光缆；设计用量为 1307 米——实际用量更少，客户按实际长度付款；\n— 安装 8 根架空用金属立杆，并在节点处安装电缆桥架；\n— 完成 24 个光纤熔接点，每个接点的损耗均用 OTDR 检测；\n— 每栋楼安装一台壁挂式光纤配线箱，线路两端配 16 个传输距离 20 公里的 SFP 模块；\n— 搭建中心节点：19 英寸 8 口光纤配线架、12U 壁挂机柜、网管型交换机、大华 32 路录像机（存储 28 TB）以及 3 kVA 在线式 UPS。\n成果：\n— 八栋楼各自通过独立的光纤线路连接中心节点：楼间距离和电磁干扰不影响视频；\n— 所有楼的录像存入同一存储，停电时节点由 UPS 继续供电；\n— 工程按 2 号和 3 号表格验收单并附竣工资料完成交付；下一阶段在该线路上接入了各楼的视频监控——24 台摄像机。",
    },
  },

  "uzum-videonablyudenie-skladov-i-punktov-vydachi": {
    uz: {
      title: "Uzum — omborlar va buyurtma topshirish punktlarida videokuzatuv",
      location: "Toshkent",
      clientTasks: "Omborlar va 100+ topshirish punktida videokuzatuv; Dahua jihozlari; montaj, SKS, ishga tushirish, masofaviy monitoring.",
      excerpt: "Uzum marketpleysi uchun videokuzatuv tizimi: Toshkentdagi 1000 m²dan ortiq markaziy omborlar va butun O‘zbekiston bo‘ylab 100+ buyurtma topshirish punktlari tarmog‘i. Dahua jihozlari, to‘liq tayyor holda — montaj, SKS, ishga tushirish va masofaviy monitoring.",
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
      content: "Ucell aloqa operatorining vaziyat markazi uchun SAT Solutions mutaxassislari Dahua videodevorini montaj qilib, ishga tushirdi.\n\nYechim tarkibi:\n— 12 ta LC55UL panelidan iborat 3×4 videodevor, diagonali 55\", panellararo chok 1,8 mm\n— DVM X100-D8/8 videodevor kontrolleri: 8 ta HDMI kirish va 8 ta HDMI chiqish\n— to‘liq suriladigan kronshteynlarda tayyorlangan o‘yiqqa montaj — devorni buzmasdan panellarga xizmat ko‘rsatish imkoniyati\n— markaz operatorlarining ish o‘rinlaridan maʼlumotni kecha-kunduz chiqarish\n\nIshga tushirgandan so‘ng xodimlarni o‘qitdik va kontrollerni sozlash bo‘yicha maslahatlar berdik. Videodevor vaziyat markazida asosiy ko‘rsatish vositasi sifatida 24/7 ishlaydi.",
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
      content: "For the control room of the mobile operator Ucell, SAT Solutions specialists installed and commissioned a Dahua video wall.\n\nScope of the solution:\n— a 3×4 video wall of 12 LC55UL panels, 55\" diagonal, 1.8 mm inter-panel seam\n— DVM X100-D8/8 video wall controller: 8 HDMI inputs and 8 HDMI outputs\n— installation into a prepared recess on full-extension brackets — panels can be serviced without dismantling the wall\n— round-the-clock display of information from the operators' workstations\n\nAfter commissioning we trained the staff and advised on configuring the controller. The video wall runs 24/7 as the main display in the control room.",
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
      content: "Ucell mobil operatörünün durum merkezi için SAT Solutions uzmanları Dahua video duvarını kurdu ve devreye aldı.\n\nÇözüm kapsamı:\n— 12 adet LC55UL panelden oluşan 3×4 video duvarı, 55\" köşegen, 1,8 mm panel arası ek yeri\n— DVM X100-D8/8 video duvarı denetleyicisi: 8 HDMI giriş ve 8 HDMI çıkış\n— hazırlanmış nişe tam çekmeli bağlantılarla montaj — panellere duvar sökülmeden bakım yapılabilir\n— merkez operatörlerinin çalışma istasyonlarından bilgilerin yedi gün yirmi dört saat görüntülenmesi\n\nDevreye almanın ardından personele eğitim verdik ve denetleyicinin yapılandırılması konusunda danışmanlık sağladık. Video duvarı, durum merkezinde ana görüntüleme aracı olarak 7/24 çalışmaktadır.",
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
      content: "SAT Solutions 的专家为通信运营商 Ucell 的指挥中心安装并调试了大华视频墙。\n\n方案构成：\n— 由 12 块 LC55UL 拼接屏组成的 3×4 视频墙，55 英寸对角线，拼缝 1.8 毫米\n— DVM X100-D8/8 视频墙控制器：8 路 HDMI 输入与 8 路 HDMI 输出\n— 采用全抽出式支架安装于预留壁龛内 — 无需拆除墙体即可维护屏体\n— 七日二十四小时展示中心各坐席的画面信息\n\n调试完成后，我们为工作人员提供了培训，并就控制器配置提供咨询。视频墙作为指挥中心的主要显示设备 7×24 小时运行。",
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
      excerpt: "Toshkentda server xonasini to‘liq tayyor holda montaj qilish: server shkaflarini o‘rnatish, kabel trassalari, SKS/LVS va elektr ta’minotini tashkil etish.",
      content: "SAT Solutions mutaxassislari Toshkentda server xonasini to‘liq tayyor holda montaj qildi — xonani tayyorlashdan tartibli muhandislik infratuzilmasigacha.\n\nIshlar tarkibi:\n— samarali sovutish uchun perforatsiyalangan eshikli bir qator server shkaflarini o‘rnatish\n— shift ostida kabel lotoklari va trassalarini montaj qilish, past kuchlanishli va kuch liniyalarini ozoda tarqatish\n— strukturali kabel tizimi (SKS) va lokal tarmoq (LVS)\n— stoykalar elektr ta’minotini tashkil etish\n— keyingi xizmat ko‘rsatishga qulay standartlar bo‘yicha kabelni markirovka qilish va yotqizish\n\nNatija — ishonchli, masshtablanadigan va ozoda montaj qilingan, faol uskunalarni joylashtirish uchun tayyor server xonasi."
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

  "virtualizaciya-h3c-cas-finansovaya-organizaciya": {
    uz: {
      title: "Moliyaviy tashkilot uchun H3C serverlarida virtualizatsiya",
      location: "Toshkent",
      clientTasks: "Serverlarni konsolidatsiya qilish, ishonchli klaster, tizimlarni toʻxtatishsiz koʻchirish",
      excerpt: "Ishonchli virtualizatsiya klasteri: ikkita H3C UniServer R4900 G6 serveri va H3C CAS Enterprise platformasi, ishlayotgan tizimlarni uzoq toʻxtashlarsiz koʻchirish bilan.",
      content: "Toshkentdagi moliyaviy tashkilot uchun SAT Solutions mutaxassislari H3C uskunalarida virtualizatsiya platformasini loyihaladi va joriy etdi — serverlarni yetkazib berishdan ishlayotgan tizimlarni koʻchirishgacha.\n\nVazifa: tarqoq fizik serverlarni konsolidatsiya qilish, muhim servislarning ishonchliligini taʼminlash va zaxira nusxalashni soddalashtirish — platformani almashtirmasdan oʻsish zaxirasi bilan.\n\nLoyiha doirasida bajarildi:\n\nikkita H3C UniServer R4900 G6 serverini yetkazib berish — har birida ikkita 16 yadroli Intel Xeon protsessori, 512 GB DDR5 operativ xotira, sakkizta 7,68 TB SSD va 25GbE tarmoq interfeyslari;\nH3C CAS Cloud Virtualization Manager Enterprise platformasini oʻrnatish;\nserverlarni virtual mashinalar avtomatik qayta ishga tushadigan ishonchli klasterga birlashtirish;\nmavjud tizimlarni H3C CAS Migration Tool yordamida virtual muhitga koʻchirish — qayta oʻrnatishsiz va uzoq toʻxtashlarsiz;\nzaxira nusxalashni sozlash va buyurtmachi administratorlarini oʻqitish;\nH3C yillik vendor qoʻllab-quvvatlashini ulash.\n\nNatija: muhim servislar yuqori ishonchlilik klasterida ishlaydi — bir uzel ishdan chiqsa, virtual mashinalar ikkinchisida avtomatik qayta ishga tushadi. Yangi serverlar endi haftalab uskuna sotib olish oʻrniga daqiqalarda beriladi, butun infratuzilma yagona konsoldan boshqariladi.\n\nSAT Solutions — Oʻzbekistonda H3C hamkori: bunday loyihalarni toʻliq tayyor holda bajaramiz — audit va spetsifikatsiyadan koʻchirish va qoʻllab-quvvatlashgacha."
    },
    en: {
      title: "Virtualization on H3C servers for a financial organization",
      location: "Tashkent",
      clientTasks: "Server consolidation, high-availability cluster, migration without downtime",
      excerpt: "A high-availability virtualization cluster: two H3C UniServer R4900 G6 servers and the H3C CAS Enterprise platform, with migration of live systems without long downtime.",
      content: "For a financial organization in Tashkent, SAT Solutions specialists designed and deployed a virtualization platform on H3C equipment — from server supply to migration of production systems.\n\nThe task: consolidate scattered physical servers, ensure fault tolerance of critical services and simplify backups — with room to grow without replacing the platform.\n\nThe following work was carried out:\n\nsupply of two H3C UniServer R4900 G6 servers — each with two 16-core Intel Xeon processors, 512 GB of DDR5 memory, eight 7.68 TB SSDs and 25GbE network interfaces;\ndeployment of the H3C CAS Cloud Virtualization Manager Enterprise platform;\nclustering of the servers with automatic restart of virtual machines on node failure;\nmigration of existing systems into the virtual environment with the native H3C CAS Migration Tool — without reinstallation or long downtime;\nbackup configuration and training of the customer's administrators;\na one-year H3C vendor support subscription.\n\nThe result: critical services run in a high-availability cluster — if one node fails, virtual machines automatically restart on the second. New servers are now provisioned in minutes instead of weeks of hardware procurement, and the whole infrastructure is managed from a single console.\n\nSAT Solutions is an H3C partner in Uzbekistan: we deliver such projects turnkey — from audit and specification to migration and support."
    },
    tr: {
      title: "Bir finans kuruluşu için H3C sunucularında sanallaştırma",
      location: "Taşkent",
      clientTasks: "Sunucu konsolidasyonu, yüksek erişilebilirlik kümesi, kesintisiz taşıma",
      excerpt: "Yüksek erişilebilirlikli sanallaştırma kümesi: iki H3C UniServer R4900 G6 sunucu ve H3C CAS Enterprise platformu, çalışan sistemlerin uzun kesinti olmadan taşınmasıyla.",
      content: "Taşkent'teki bir finans kuruluşu için SAT Solutions uzmanları, H3C ekipmanı üzerinde sanallaştırma platformu tasarladı ve kurdu — sunucu tedarikinden canlı sistemlerin taşınmasına kadar.\n\nGörev: dağınık fiziksel sunucuları konsolide etmek, kritik servislerin hata toleransını sağlamak ve yedeklemeyi basitleştirmek — platform değişmeden büyüme payıyla.\n\nProje kapsamında yapılanlar:\n\niki H3C UniServer R4900 G6 sunucunun tedariki — her birinde iki adet 16 çekirdekli Intel Xeon işlemci, 512 GB DDR5 bellek, sekiz adet 7,68 TB SSD ve 25GbE ağ arabirimleri;\nH3C CAS Cloud Virtualization Manager Enterprise platformunun kurulumu;\nsunucuların, düğüm arızasında sanal makinelerin otomatik yeniden başlatıldığı bir kümede birleştirilmesi;\nmevcut sistemlerin H3C CAS Migration Tool ile sanal ortama taşınması — yeniden kurulum ve uzun kesinti olmadan;\nyedekleme yapılandırması ve müşteri yöneticilerinin eğitimi;\nbir yıllık H3C üretici desteğinin bağlanması.\n\nSonuç: kritik servisler yüksek erişilebilirlikli kümede çalışıyor — bir düğüm arızalanırsa sanal makineler ikincisinde otomatik başlıyor. Yeni sunucular artık haftalar süren donanım alımı yerine dakikalar içinde veriliyor, tüm altyapı tek konsoldan yönetiliyor.\n\nSAT Solutions, Özbekistan'da H3C iş ortağıdır: bu tür projeleri anahtar teslim yürütüyoruz — denetim ve şartnameden taşıma ve desteğe kadar."
    },
    zh: {
      title: "为金融机构部署 H3C 服务器虚拟化",
      location: "塔什干",
      clientTasks: "服务器整合、高可用集群、业务系统无停机迁移",
      excerpt: "高可用虚拟化集群：两台 H3C UniServer R4900 G6 服务器与 H3C CAS Enterprise 平台，业务系统迁移无长时间停机。",
      content: "SAT Solutions 的专家为塔什干一家金融机构设计并部署了基于 H3C 设备的虚拟化平台——从服务器供货到生产系统迁移。\n\n任务：整合分散的物理服务器，保障关键业务的容错能力，简化备份——并预留扩展空间而无需更换平台。\n\n项目完成内容：\n\n供应两台 H3C UniServer R4900 G6 服务器——每台配备两颗16核 Intel Xeon 处理器、512 GB DDR5 内存、八块 7.68 TB SSD 及 25GbE 网络接口；\n部署 H3C CAS Cloud Virtualization Manager Enterprise 虚拟化平台；\n将服务器组成高可用集群，节点故障时虚拟机自动重启；\n使用 H3C CAS Migration Tool 将现有系统迁移至虚拟环境——无需重装、无长时间停机；\n配置备份并培训客户管理员；\n接入 H3C 一年期厂商支持。\n\n成果：关键业务运行在高可用集群中——一个节点故障时虚拟机自动切换到另一节点。新服务器的交付从数周的硬件采购缩短到几分钟，整套基础设施通过统一控制台管理。\n\nSAT Solutions 是 H3C 在乌兹别克斯坦的合作伙伴：此类项目我们提供一站式交付——从评估、选型到迁移与支持。"
    }
  },

  "skud-zavod-damira-beverages": {
    uz: {
      title: "Damira Beverages zavodida SKUD va videokuzatuv",
      location: "Toshkent",
      excerpt: "Toshkentdagi yangi Damira Beverages ichimliklar zavodining kompleks xavfsizlik tizimlari: turniketlar va Hikvisionning 112 ta kirish nazorati nuqtasi, yuzni tanish, ish vaqti hisobi, kirishlarda ANPR, Dahua videokuzatuvi va korxonaning 67 km kabel trassalari.",
      content: "SAT Solutions mutaxassislari Toshkentdagi yangi Damira Beverages Enterprise (dbe.uz) ichimliklar zavodida kuchsiz tok tizimlari kompleksini bajardi — o‘tish joylaridan ishlab chiqarish sexlari va perimetrgacha.\n\nKirish nazorati (Hikvision):\n— o‘tish joylarida 8 ta DS-K3B501SX turniket seksiyasi va darvozachalar\n— 112 ta kirish nuqtasi: o‘qigichlar, elektromagnit qulflar, chiqish tugmalari\n— asosiy kirishlarda yuzni tanuvchi 12 ta terminal\n— 32 ta DS-K2604T tarmoq kirish kontrolleri, 130 ta eshik uchun HikCentral Professional dasturiy taʼminoti\n— ish vaqti hisobi moduli: xodimlarning avtomatik tabeli\n— kirishlarda avtoraqamlarni tanish (ANPR), shlagbaumlar va o‘tishni boshqarish\n\nVideokuzatuv:\n— sexlar, omborlar va hudud perimetrida Dahua IP-kameralari\n— sharhli buriluvchi PTZ-kameralar, ko‘p terabaytli arxivga ega videoregistratorlar\n\nZavodning tarmoq infratuzilmasi:\n— 67 km kabel trassasi, shundan 42 km 6-toifali o‘ralgan juftlik\n— taxminan 20 km optik magistral: payvandlash, krosslar, ko‘chada har qanday ob-havoga chidamli shkaflar\n— o‘nlab telekommunikatsiya shkaflari, patch-panellar, PoE-kommutatorlar\n\nNatijada zavod yagona xavfsizlik tizimiga ega bo‘ldi: karta va yuz bo‘yicha o‘tish, aniq ish vaqti tabeli, kirishlarda transport nazorati va ishlab chiqarishning to‘liq videoqamrovi."
    },
    en: {
      title: "Access control and CCTV at the Damira Beverages plant",
      location: "Tashkent",
      excerpt: "A complete security package for the new Damira Beverages drinks plant in Tashkent: turnstiles and 112 Hikvision access points, face recognition, time attendance, ANPR at the entrances, Dahua CCTV and 67 km of cable routes across the site.",
      content: "SAT Solutions specialists delivered the full low-voltage package at the new Damira Beverages Enterprise drinks plant (dbe.uz) in Tashkent — from the gatehouses to the production halls and the perimeter.\n\nAccess control (Hikvision):\n— 8 DS-K3B501SX turnstile sections and swing gates at the gatehouses\n— 112 access points: readers, electromagnetic locks, exit buttons\n— 12 face recognition terminals at key entrances\n— 32 DS-K2604T network access controllers, HikCentral Professional software for 130 doors\n— time attendance module: automatic staff timesheets\n— automatic number plate recognition (ANPR) at the entrances, barriers and traffic control\n\nCCTV:\n— Dahua IP cameras in the workshops, warehouses and around the perimeter\n— overview PTZ cameras, recorders with a multi-terabyte archive\n\nPlant network infrastructure:\n— 67 km of cable routes, including 42 km of category 6 twisted pair\n— around 20 km of fibre backbone: splicing, patch panels, all-weather outdoor cabinets\n— dozens of telecom cabinets, patch panels, PoE switches\n\nThe result: the plant has a single security system — entry by card and face, accurate time records, vehicle control at the entrances and full video coverage of production."
    },
    tr: {
      title: "Damira Beverages fabrikasında geçiş kontrolü ve kamera sistemi",
      location: "Taşkent",
      excerpt: "Taşkent'teki yeni Damira Beverages içecek fabrikası için komple güvenlik sistemleri: turnikeler ve 112 Hikvision geçiş noktası, yüz tanıma, mesai takibi, girişlerde ANPR, Dahua kamera sistemi ve tesis genelinde 67 km kablo güzergâhı.",
      content: "SAT Solutions uzmanları, Taşkent'teki yeni Damira Beverages Enterprise (dbe.uz) içecek fabrikasında zayıf akım sistemlerinin tamamını hayata geçirdi — giriş kabinlerinden üretim salonlarına ve çevre hattına kadar.\n\nGeçiş kontrolü (Hikvision):\n— giriş kabinlerinde 8 adet DS-K3B501SX turnike bölümü ve kanatlı geçitler\n— 112 geçiş noktası: okuyucular, elektromanyetik kilitler, çıkış butonları\n— ana girişlerde 12 adet yüz tanıma terminali\n— 32 adet DS-K2604T ağ geçiş denetleyicisi, 130 kapı için HikCentral Professional yazılımı\n— mesai takip modülü: personelin otomatik puantajı\n— girişlerde otomatik plaka tanıma (ANPR), bariyerler ve geçiş yönetimi\n\nKamera sistemi:\n— atölyelerde, depolarda ve saha çevresinde Dahua IP kameralar\n— genel görüş PTZ kameraları, çok terabaytlı arşive sahip kayıt cihazları\n\nFabrikanın ağ altyapısı:\n— 67 km kablo güzergâhı, bunun 42 km'si kategori 6 burgulu çift\n— yaklaşık 20 km fiber omurga: ek yapımı, kroslar, dış mekân her hava koşuluna uygun kabinler\n— onlarca telekom kabini, patch panel, PoE anahtar\n\nSonuçta fabrika tek bir güvenlik sistemine kavuştu: kart ve yüzle geçiş, doğru mesai kaydı, girişlerde araç denetimi ve üretimin eksiksiz kamera kapsaması."
    },
    zh: {
      title: "Damira Beverages 工厂门禁与视频监控",
      location: "塔什干",
      excerpt: "为塔什干新建的 Damira Beverages 饮料厂提供的整套安防系统：闸机与 112 个 Hikvision 门禁点位、人脸识别、考勤管理、出入口车牌识别、Dahua 视频监控，以及厂区 67 公里线缆敷设。",
      content: "SAT Solutions 的专家在塔什干新建的 Damira Beverages Enterprise 饮料厂（dbe.uz）完成了全部弱电系统工程——从门岗到生产车间及厂区周界。\n\n门禁系统（Hikvision）：\n— 门岗处 8 组 DS-K3B501SX 闸机与平开小门\n— 112 个门禁点位：读头、电磁锁、出门按钮\n— 主要出入口配置 12 台人脸识别终端\n— 32 台 DS-K2604T 网络门禁控制器，130 门规模的 HikCentral Professional 软件\n— 考勤模块：自动生成员工考勤表\n— 出入口车牌自动识别（ANPR）、道闸与车辆通行管理\n\n视频监控：\n— 车间、仓库及厂区周界部署 Dahua IP 摄像机\n— 全景球机，配多 TB 容量归档的录像机\n\n厂区网络基础设施：\n— 67 公里线缆敷设，其中 42 公里为六类双绞线\n— 约 20 公里光纤主干：熔接、配线架、室外全天候机柜\n— 数十个通信机柜、配线架与 PoE 交换机\n\n最终，工厂获得了统一的安防体系：刷卡与人脸通行、精确的考勤记录、出入口车辆管控，以及覆盖全部生产区域的视频监控。"
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

/** «Состав решения» кейса (поле equipmentSupply в БД — только RU): строки через перевод строки. 14.09.2026. */
const EQUIPMENT: Record<string, Record<Loc, string>> = {
  "zhk-towerup-vols-mezhdu-domami": {
    uz: "Osma optik kabel, 4 tola — 849 m\nDevorga oʻrnatiladigan optik krosslar — 8 dona (har bir uyga bittadan)\n8 ta SC-portli 19\" optik kross\n1310 nm SFP-modullar, 20 km gacha — 16 dona\nDahua DHI-NVR4232-4KS3 videoregistratori, 32 kanal\n14 TB qattiq disklar — 2 dona (28 TB arxiv)\nPixietech PXT-S2790G-8TX boshqariladigan kommutatori\n12U devor shkafi, 3 kVA onlayn UPS",
    en: "Aerial fiber-optic cable, 4 fibers — 849 m\nWall-mounted optical distribution boxes — 8 pcs (one per building)\n19\" fiber patch panel, 8 SC ports\n1310 nm SFP modules, up to 20 km — 16 pcs\nDahua DHI-NVR4232-4KS3 recorder, 32 channels\n14 TB hard drives — 2 pcs (28 TB archive)\nPixietech PXT-S2790G-8TX managed switch\n12U wall cabinet, 3 kVA online UPS",
    tr: "Havai fiber optik kablo, 4 lif — 849 m\nDuvar tipi optik dağıtım kutuları — 8 adet (her binaya bir)\n8 SC portlu 19\" fiber patch panel\n1310 nm SFP modüller, 20 km'ye kadar — 16 adet\nDahua DHI-NVR4232-4KS3 kayıt cihazı, 32 kanal\n14 TB sabit diskler — 2 adet (28 TB arşiv)\nPixietech PXT-S2790G-8TX yönetilebilir switch\n12U duvar kabini, 3 kVA online UPS",
    zh: "架空光缆，4 芯——849 米\n壁挂式光纤配线箱——8 台（每栋楼一台）\n19 英寸光纤配线架，8 个 SC 口\n1310 nm SFP 模块，传输距离 20 公里——16 个\n大华 DHI-NVR4232-4KS3 录像机，32 路\n14 TB 硬盘——2 块（存储 28 TB）\nPixietech PXT-S2790G-8TX 网管型交换机\n12U 壁挂机柜，3 kVA 在线式 UPS",
  },
  "montazh-servernoy-komnaty": {
    uz: "Perforatsiyalangan eshikli server shkaflari\nKabel lotoklari va trassalari\nSKS va lokal tarmoq (LVS)\nStoykalarning elektr taʼminoti\nKabellarni markirovkalash va yotqizish",
    en: "Server cabinets with perforated doors\nCable trays and routes\nStructured cabling and LAN\nRack power supply\nCable labeling and routing",
    tr: "Perfore kapılı sunucu kabinleri\nKablo tavaları ve güzergâhları\nYapısal kablolama ve yerel ağ (LAN)\nKabin güç beslemesi\nKablo etiketleme ve düzenleme",
    zh: "带网孔门的服务器机柜\n桥架与线缆路由\n综合布线与局域网（LAN）\n机柜供电\n线缆标识与理线",
  },
  "sistema-videonablyudeniya-na-bodikamerah-dahua": {
    uz: "Dahua DH-MPT230 bodikameralari (Full HD, butun smena davomida)\nDahua DH-EEC300D8-N1 yig‘ish stansiyalari, 8 slot\nDH-EEC300 nazorat modullari\nArxivni avtomatik yuklash va zaryadlash",
    en: "Dahua DH-MPT230 body cameras (Full HD, a full shift of operation)\nDahua DH-EEC300D8-N1 docking stations, 8 slots\nDH-EEC300 management modules\nAutomatic archive upload and charging",
    tr: "Dahua DH-MPT230 yaka kameraları (Full HD, tam vardiya çalışma)\n8 yuvalı Dahua DH-EEC300D8-N1 toplama istasyonları\nDH-EEC300 kontrol modülleri\nOtomatik arşiv aktarımı ve şarj",
    zh: "大华 DH-MPT230 执法记录仪（全高清，续航一个班次）\n大华 DH-EEC300D8-N1 采集站，8 槽位\nDH-EEC300 管理模块\n录像自动上传与充电",
  },
  "skud-zavod-damira-beverages": {
    uz: "Hikvision DS-K3B501SX turniketlari — 8 seksiya va kalitkalar\n112 ta kirish nuqtasi: o‘quvchilar, qulflar, chiqish tugmalari\n12 ta yuzni tanish terminali\n32 ta DS-K2604T tarmoq kontrolleri\n130 eshik uchun HikCentral Professional dasturi",
    en: "Hikvision DS-K3B501SX turnstiles — 8 sections and wicket gates\n112 access points: readers, locks, exit buttons\n12 face recognition terminals\n32 DS-K2604T network controllers\nHikCentral Professional software for 130 doors",
    tr: "Hikvision DS-K3B501SX turnikeler — 8 bölüm ve yaya kapıları\n112 geçiş noktası: okuyucular, kilitler, çıkış butonları\n12 yüz tanıma terminali\n32 adet DS-K2604T ağ kontrolörü\n130 kapı için HikCentral Professional yazılımı",
    zh: "海康威视 DS-K3B501SX 闸机——8 通道及小门\n112 个门禁点：读卡器、门锁、出门按钮\n12 台人脸识别终端\n32 台 DS-K2604T 网络门禁控制器\nHikCentral Professional 软件，130 门",
  },
  "ucell-ustanovka-videosteny-dahua-v-situacionnom-centre": {
    uz: "Dahua videodevorlari\nDahua IP-kamerasi\nVideodevor uchun SKS va optik tolali liniyalar\nSCADA / NOC",
    en: "Dahua video walls\nDahua IP camera\nStructured cabling and fiber-optic lines for the video wall\nSCADA / NOC",
    tr: "Dahua video duvarları\nDahua IP kamera\nVideo duvarı için yapısal kablolama ve fiber optik hatlar\nSCADA / NOC",
    zh: "大华视频墙\n大华 IP 摄像机\n视频墙综合布线与光纤线路\nSCADA / NOC",
  },
  "uzum-videonablyudenie-skladov-i-punktov-vydachi": {
    uz: "Dahua IP-kameralari — omborlar va yuklash zonalari\n100+ buyurtma topshirish punktida videokuzatuv\nKabel tarmog‘i va kommutatsiya\nButun mamlakat bo‘ylab montaj va ishga tushirish",
    en: "Dahua IP cameras — warehouses and shipping areas\nVideo surveillance at 100+ order pickup points\nCabling and switching\nInstallation and commissioning nationwide",
    tr: "Dahua IP kameralar — depolar ve sevkiyat alanları\n100+ sipariş teslim noktasında video gözetim\nKablo ağı ve anahtarlama\nÜlke genelinde kurulum ve devreye alma",
    zh: "大华 IP 摄像机——仓库与发货区\n100 多个自提点的视频监控\n线缆网络与交换设备\n全国范围安装与调试",
  },
  "virtualizaciya-h3c-cas-finansovaya-organizaciya": {
    uz: "2 ta H3C UniServer R4900 G6 serveri\nHar bir serverda 2 ta Intel Xeon protsessori (16 yadro)\nH3C CAS virtualizatsiya platformasi\nIshlayotgan servislarni ko‘chirish va zaxiralash",
    en: "2 × H3C UniServer R4900 G6 servers\n2 × Intel Xeon processors (16 cores) in each server\nH3C CAS virtualization platform\nMigration of running services and redundancy",
    tr: "2 adet H3C UniServer R4900 G6 sunucu\nHer sunucuda 2 adet Intel Xeon işlemci (16 çekirdek)\nH3C CAS sanallaştırma platformu\nÇalışan hizmetlerin taşınması ve yedeklilik",
    zh: "2 台 H3C UniServer R4900 G6 服务器\n每台服务器配 2 颗 Intel Xeon 处理器（16 核）\nH3C CAS 虚拟化平台\n运行中业务迁移与冗余备份",
  },
  "zhk-tower-up-intellektualnaya-sistema-bezopasnosti-i-videomonitoringa": {
    uz: "Dahua\nHikvision\nIP-domofoniya\nTarmoq uskunalari\nKirishni nazorat qilish tizimi\nLCD videodevor",
    en: "Dahua\nHikvision\nIP intercom\nNetwork equipment\nAccess control system\nLCD video wall",
    tr: "Dahua\nHikvision\nIP interkom\nAğ ekipmanları\nGeçiş kontrol sistemi\nLCD video duvarı",
    zh: "大华\n海康威视\nIP 楼宇对讲\n网络设备\n门禁系统\nLCD 视频墙",
  },
};

/** SEO-заголовок/описание кейса: RU — из БД, остальные языки — из перевода (если задан). */
export function portfolioSeo(
  p: { slug: string; seoTitle?: string | null; seoDescription?: string | null },
  locale: string
): { title: string | null; description: string | null } {
  if (!isLoc(locale)) return { title: p.seoTitle || null, description: p.seoDescription || null };
  const tr = PROJECT[p.slug]?.[locale];
  return { title: tr?.seoTitle ?? null, description: tr?.seoDescription ?? null };
}

/** Накладывает перевод на проект портфолио (по slug). RU/неизвестные — без изменений. */
export function localizePortfolioProject<T extends { slug: string; items?: any }>(p: T, locale: string): T {
  if (!isLoc(locale)) return p;
  const tr = PROJECT[p.slug]?.[locale];
  const eq = EQUIPMENT[p.slug]?.[locale];
  if (!tr && !eq) return p;
  const out: any = { ...p };
  if (eq && (p as any).equipmentSupply) out.equipmentSupply = eq;
  if (!tr) return out as T;
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
