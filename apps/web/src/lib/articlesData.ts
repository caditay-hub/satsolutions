// Инфо-статьи (блог) под предпокупочный long-tail: «сколько стоит видеонаблюдение»,
// «как выбрать камеру», «что такое СКУД» и т.п. Такие запросы легче ранжируются и
// приводят целевой трафик, который перелинковкой (related) уходит на коммерческие
// страницы услуг /solutions/<key>. RU + UZ (два языка рынка).
//
// Рендер: /blog (список) + /blog/<slug> (статья, Article + BreadcrumbList JSON-LD).
// Локаль без контента статьи → её нет в списке и detail отдаёт 404 (чистый hreflang).

export type ArticleSection = { h: string; p: string[] };
export type ArticleBody = { title: string; excerpt: string; sections: ArticleSection[] };
export type Article = {
  slug: string;
  date: string;              // ISO — дата публикации
  related: string[];         // ключи услуг для перелинковки (serviceByKey)
  loc: Record<string, ArticleBody>;
};

export const ARTICLES: Article[] = [
  {
    slug: "skolko-stoit-videonablyudenie",
    date: "2026-07-17",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Сколько стоит видеонаблюдение: из чего складывается цена",
        excerpt: "Разбираем, из чего складывается стоимость системы видеонаблюдения: камеры, регистратор, монтаж — и на чём можно сэкономить без потери качества.",
        sections: [
          { h: "Из чего складывается цена", p: [
            "Стоимость видеонаблюдения складывается из четырёх частей: камеры, регистратор с накопителем, кабель и расходники, а также работа по монтажу и настройке. Чем больше камер и выше их разрешение, тем дороже и оборудование, и объём работ.",
            "Отдельно считается глубина архива: чтобы хранить запись 30 суток вместо 7, нужен более ёмкий жёсткий диск. На цену влияют и условия объекта — высота стен, расстояние до регистратора, необходимость штробления.",
          ] },
          { h: "Сколько камер нужно", p: [
            "Для квартиры обычно достаточно 1–2 камер, для магазина или офиса — 4–8, для склада, производства или территории — от 8 и больше. Точное число определяется на выезде: важно закрыть входы, кассы, зоны хранения и слепые углы.",
            "Не всегда больше камер — лучше. Иногда одна правильно расположенная камера с хорошим объективом закрывает зону эффективнее двух дешёвых.",
          ] },
          { h: "На чём можно и нельзя экономить", p: [
            "Экономить разумно на бренде регистратора и на облачных подписках, если достаточно локального архива. А вот на качестве камер в ключевых зонах (касса, вход) и на монтаже экономить не стоит — переделка обходится дороже.",
            "Чтобы получить точную смету, закажите бесплатный выезд инженера: мы посчитаем оборудование и работы под ваш объект и бюджет.",
          ] },
        ],
      },
      uz: {
        title: "Videokuzatuv qancha turadi: narx nimalardan tashkil topadi",
        excerpt: "Videokuzatuv tizimi narxi nimalardan tashkil topishini ko'rib chiqamiz: kameralar, registrator, montaj — va sifatni yo'qotmasdan qanday tejash mumkin.",
        sections: [
          { h: "Narx nimalardan tashkil topadi", p: [
            "Videokuzatuv narxi to'rt qismdan iborat: kameralar, накопитель bilan registrator, kabel va sarf materiallari, hamda montaj va sozlash ishlari. Kameralar qancha ko'p va ularning ruxsati qancha yuqori bo'lsa, uskuna ham, ishlar hajmi ham shuncha qimmat.",
            "Arxiv chuqurligi alohida hisoblanadi: 7 kun o'rniga 30 kun yozuvni saqlash uchun sig'imi kattaroq qattiq disk kerak. Narxga obyekt sharoitlari ham ta'sir qiladi — devor balandligi, registratorgacha masofa, shtroblash zarurati.",
          ] },
          { h: "Nechta kamera kerak", p: [
            "Kvartira uchun odatda 1–2 kamera yetarli, do'kon yoki ofis uchun — 4–8, ombor, ishlab chiqarish yoki hudud uchun — 8 va undan ko'p. Aniq son obyektga chiqishda aniqlanadi: kirishlar, kassalar, saqlash zonalari va ko'r burchaklarni yopish muhim.",
            "Har doim ko'p kamera yaxshi emas. Ba'zan yaxshi obyektiv bilan to'g'ri joylashtirilgan bitta kamera zonani ikkita arzon kameradan samaraliroq yopadi.",
          ] },
          { h: "Nimadan tejash mumkin va mumkin emas", p: [
            "Registrator brendida va bulutli obunalarda oqilona tejash mumkin, agar lokal arxiv yetarli bo'lsa. Ammo asosiy zonalardagi (kassa, kirish) kameralar sifatida va montajda tejash tavsiya etilmaydi — qayta qilish qimmatroqqa tushadi.",
            "Aniq smeta olish uchun muhandisning bepul chiqishini buyurtma qiling: uskuna va ishlarni obyektingiz va byudjetingizga qarab hisoblaymiz.",
          ] },
        ],
      },
      en: {
        title: "How Much Does CCTV Cost: What Makes Up the Price",
        excerpt: "Breaking down the cost of a video surveillance system: cameras, recorder, installation — and where you can save without losing quality.",
        sections: [
          { h: "What makes up the price", p: [
            "The cost of CCTV consists of four parts: cameras, a recorder with storage, cabling and consumables, plus installation and setup work. The more cameras and the higher their resolution, the more both the equipment and the labor cost.",
            "Archive depth is calculated separately: storing 30 days of footage instead of 7 requires a larger hard drive. Site conditions also affect the price — wall height, distance to the recorder, the need for wall chasing.",
          ] },
          { h: "How many cameras you need", p: [
            "An apartment usually needs 1–2 cameras, a shop or office — 4–8, a warehouse, production floor or grounds — 8 and more. The exact number is determined during a site visit: entrances, checkouts, storage zones and blind corners must be covered.",
            "More cameras is not always better. Sometimes one properly placed camera with a good lens covers a zone more effectively than two cheap ones.",
          ] },
          { h: "Where you can and cannot save", p: [
            "It is reasonable to save on the recorder brand and on cloud subscriptions if local storage is enough. But do not save on camera quality in key zones (checkout, entrance) or on installation — redoing it costs more.",
            "For an exact estimate, book a free engineer visit: we will spec equipment and work for your site and budget.",
          ] },
        ],
      },
      tr: {
        title: "Kamera Sistemi Ne Kadar Tutar: Fiyat Nelerden Oluşur",
        excerpt: "Video gözetim sisteminin maliyetini ayrıştırıyoruz: kameralar, kayıt cihazı, montaj — ve kaliteden ödün vermeden nerede tasarruf edilir.",
        sections: [
          { h: "Fiyat nelerden oluşur", p: [
            "CCTV maliyeti dört kalemden oluşur: kameralar, depolamalı kayıt cihazı, kablo ve sarf malzemeleri, ayrıca montaj ve kurulum işçiliği. Kamera sayısı ve çözünürlük arttıkça hem ekipman hem işçilik pahalanır.",
            "Arşiv derinliği ayrıca hesaplanır: 7 gün yerine 30 gün kayıt tutmak daha büyük disk gerektirir. Saha koşulları da fiyatı etkiler — duvar yüksekliği, kayıt cihazına mesafe, kanal açma gereksinimi.",
          ] },
          { h: "Kaç kamera gerekir", p: [
            "Daire için genelde 1–2 kamera yeter, mağaza veya ofis için 4–8, depo, üretim veya açık alan için 8 ve üzeri. Kesin sayı keşifte belirlenir: girişler, kasalar, depolama alanları ve kör noktalar kapatılmalıdır.",
            "Daha çok kamera her zaman daha iyi değildir. Bazen iyi lensli doğru konumlanmış tek kamera, iki ucuz kameradan daha etkilidir.",
          ] },
          { h: "Nereden tasarruf edilir, nereden edilmez", p: [
            "Yerel arşiv yeterliyse kayıt cihazı markasından ve bulut aboneliklerinden tasarruf mantıklıdır. Ancak kilit bölgelerdeki (kasa, giriş) kamera kalitesinden ve montajdan tasarruf etmeyin — yeniden yapmak daha pahalıya gelir.",
            "Kesin teklif için ücretsiz mühendis keşfi isteyin: ekipman ve işçiliği sahanıza ve bütçenize göre hesaplayalım.",
          ] },
        ],
      },
      zh: {
        title: "视频监控要花多少钱：价格由什么构成",
        excerpt: "拆解视频监控系统的成本：摄像机、录像机、安装施工——以及在不牺牲质量的前提下哪里可以省钱。",
        sections: [
          { h: "价格由什么构成", p: [
            "监控系统的成本由四部分构成：摄像机、带存储的录像机、线缆及辅材，以及安装调试的人工。摄像机越多、分辨率越高，设备和施工费用就越高。",
            "存储时长单独计算：要保存30天而非7天的录像，需要更大容量的硬盘。现场条件也影响价格——墙体高度、到录像机的距离、是否需要开槽。",
          ] },
          { h: "需要多少台摄像机", p: [
            "住宅通常1–2台足够，商店或办公室4–8台，仓库、厂区或园区则需8台以上。准确数量需现场勘察确定：入口、收银台、存储区和盲角必须覆盖。",
            "并非越多越好。有时一台位置正确、镜头合适的摄像机，比两台便宜货更有效。",
          ] },
          { h: "哪里能省、哪里不能省", p: [
            "如果本地存储够用，在录像机品牌和云订阅上省钱是合理的。但关键区域（收银台、入口）的摄像机质量和安装施工不能省——返工的代价更高。",
            "想要精确报价，请预约工程师免费上门：我们按您的现场和预算核算设备与工程量。",
          ] },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-kameru-videonablyudeniya",
    date: "2026-07-17",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Как выбрать камеру видеонаблюдения: IP или аналоговая",
        excerpt: "IP или аналоговая, разрешение, объектив, ночная съёмка — простое руководство, как выбрать камеру видеонаблюдения под вашу задачу.",
        sections: [
          { h: "IP или аналоговая камера", p: [
            "Аналоговые камеры (HDCVI/TVI) дешевле, работают по коаксиальному кабелю и подходят для небольших систем с локальной записью. IP-камеры дают более высокое разрешение, видеоаналитику и гибкое масштабирование по сети — их выбирают для средних и крупных объектов.",
            "Если система новая и планируется рост — берите IP. Если нужно недорого дополнить существующую аналоговую систему — оставайтесь в её стандарте.",
          ] },
          { h: "Разрешение и объектив", p: [
            "Разрешение 2 Мп (Full HD) достаточно для обзора помещения, 4–8 Мп — когда нужно различать лица и номера на расстоянии. Но высокое разрешение требует большего архива и канала связи.",
            "Объектив определяет угол и дальность: 2.8 мм даёт широкий обзор комнаты, 4–6 мм — коридор или въезд, а вариофокальный объектив позволяет настроить угол под конкретное место.",
          ] },
          { h: "Ночная съёмка и условия", p: [
            "Для тёмных зон важна ИК-подсветка и хорошая светочувствительность; для улицы — защита от пыли и влаги (IP66/IP67) и рабочий температурный диапазон. Для контрового света выбирайте камеры с WDR.",
            "Мы поможем подобрать камеру под конкретную зону и задачу — с учётом освещения, дистанции и бюджета.",
          ] },
        ],
      },
      uz: {
        title: "Videokuzatuv kamerasini qanday tanlash: IP yoki analog",
        excerpt: "IP yoki analog, ruxsat, obyektiv, tungi suratga olish — videokuzatuv kamerasini vazifangizga qarab qanday tanlash bo'yicha oddiy qo'llanma.",
        sections: [
          { h: "IP yoki analog kamera", p: [
            "Analog kameralar (HDCVI/TVI) arzonroq, koaksial kabel orqali ishlaydi va lokal yozuvli kichik tizimlar uchun mos. IP-kameralar yuqoriroq ruxsat, videotahlil va tarmoq bo'yicha moslashuvchan kengaytirishni beradi — ular o'rta va yirik obyektlar uchun tanlanadi.",
            "Agar tizim yangi bo'lsa va o'sish rejalashtirilsa — IP oling. Agar mavjud analog tizimni arzon to'ldirish kerak bo'lsa — uning standartida qoling.",
          ] },
          { h: "Ruxsat va obyektiv", p: [
            "2 Mp (Full HD) ruxsat xonani ko'rish uchun yetarli, 4–8 Mp — masofada yuz va raqamlarni ajratish kerak bo'lganda. Lekin yuqori ruxsat kattaroq arxiv va aloqa kanalini talab qiladi.",
            "Obyektiv burchak va masofani belgilaydi: 2.8 mm xonaning keng ko'rinishini beradi, 4–6 mm — koridor yoki kirish, variofokal obyektiv esa burchakni aniq joyga moslashga imkon beradi.",
          ] },
          { h: "Tungi suratga olish va sharoitlar", p: [
            "Qorong'i zonalar uchun IQ-yoritish va yaxshi yorug'lik sezuvchanligi muhim; ko'cha uchun — chang va namlikdan himoya (IP66/IP67) hamda ishchi harorat diapazoni. Qarshi yorug'lik uchun WDR bilan kameralarni tanlang.",
            "Biz kamerani aniq zona va vazifaga qarab — yoritish, masofa va byudjetni hisobga olib tanlashga yordam beramiz.",
          ] },
        ],
      },
      en: {
        title: "How to Choose a CCTV Camera: IP or Analog",
        excerpt: "IP or analog, resolution, lens, night vision — a simple guide to choosing a surveillance camera for your task.",
        sections: [
          { h: "IP or analog camera", p: [
            "Analog cameras (HDCVI/TVI) are cheaper, run over coax cable and suit small systems with local recording. IP cameras offer higher resolution, video analytics and flexible network scaling — the choice for medium and large sites.",
            "If the system is new and growth is planned — go IP. If you need to inexpensively extend an existing analog system — stay within its standard.",
          ] },
          { h: "Resolution and lens", p: [
            "2 MP (Full HD) is enough for a room overview; 4–8 MP — when you need to distinguish faces and plates at a distance. But high resolution demands more storage and bandwidth.",
            "The lens defines angle and reach: 2.8 mm gives a wide room view, 4–6 mm — a corridor or entrance, and a varifocal lens lets you tune the angle to a specific spot.",
          ] },
          { h: "Night vision and conditions", p: [
            "For dark zones, IR illumination and good light sensitivity matter; outdoors — dust/moisture protection (IP66/IP67) and the right temperature range. Against backlight, choose cameras with WDR.",
            "We will help you match a camera to a specific zone and task — considering lighting, distance and budget.",
          ] },
        ],
      },
      tr: {
        title: "Güvenlik Kamerası Nasıl Seçilir: IP mi Analog mu",
        excerpt: "IP veya analog, çözünürlük, lens, gece görüşü — görevinize uygun kamera seçimi için basit bir rehber.",
        sections: [
          { h: "IP mi analog kamera mı", p: [
            "Analog kameralar (HDCVI/TVI) daha ucuzdur, koaksiyel kabloyla çalışır ve yerel kayıtlı küçük sistemlere uygundur. IP kameralar daha yüksek çözünürlük, video analitiği ve ağ üzerinden esnek ölçekleme sunar — orta ve büyük sahaların tercihi.",
            "Sistem yeniyse ve büyüme planlanıyorsa — IP alın. Mevcut analog sistemi ucuza genişletmek gerekiyorsa — onun standardında kalın.",
          ] },
          { h: "Çözünürlük ve lens", p: [
            "2 MP (Full HD) oda genel görünümü için yeterli; 4–8 MP — mesafeden yüz ve plaka ayırt etmek gerektiğinde. Ancak yüksek çözünürlük daha fazla arşiv ve bant genişliği ister.",
            "Lens açıyı ve menzili belirler: 2.8 mm geniş oda görüşü verir, 4–6 mm koridor veya giriş içindir, varifokal lens ise açıyı belirli bir noktaya göre ayarlamayı sağlar.",
          ] },
          { h: "Gece görüşü ve koşullar", p: [
            "Karanlık bölgeler için IR aydınlatma ve iyi ışık hassasiyeti önemlidir; dış mekân için toz/nem koruması (IP66/IP67) ve uygun sıcaklık aralığı. Ters ışığa karşı WDR'li kameraları seçin.",
            "Aydınlatma, mesafe ve bütçeyi dikkate alarak belirli bölge ve göreve uygun kamerayı seçmenize yardımcı oluruz.",
          ] },
        ],
      },
      zh: {
        title: "如何选择监控摄像机：IP还是模拟",
        excerpt: "IP还是模拟、分辨率、镜头、夜视——按任务选择监控摄像机的简明指南。",
        sections: [
          { h: "IP还是模拟摄像机", p: [
            "模拟摄像机（HDCVI/TVI）更便宜，走同轴电缆，适合本地存储的小型系统。IP摄像机提供更高分辨率、视频分析和灵活的网络扩展——是中大型项目的选择。",
            "如果是新系统且计划扩展——选IP。如果只需低成本补充现有模拟系统——留在原标准内。",
          ] },
          { h: "分辨率与镜头", p: [
            "200万像素（Full HD）足以看清房间全貌；400–800万像素——用于远距离辨认人脸和车牌。但高分辨率需要更大的存储和带宽。",
            "镜头决定视角和距离：2.8毫米适合房间广角，4–6毫米适合走廊或入口，变焦镜头则可按具体位置调整视角。",
          ] },
          { h: "夜视与环境条件", p: [
            "暗区需要红外补光和良好的感光度；室外需要防尘防水（IP66/IP67）和合适的工作温度范围。逆光场景请选带WDR宽动态的摄像机。",
            "我们会根据照明、距离和预算，帮您为具体区域和任务匹配合适的摄像机。",
          ] },
        ],
      },
    },
  },
  {
    slug: "chto-takoe-skud",
    date: "2026-07-17",
    related: ["access", "turnstile", "attendance"],
    loc: {
      ru: {
        title: "Что такое СКУД и как работает система контроля доступа",
        excerpt: "Простыми словами: что такое СКУД, из чего состоит система контроля доступа, как она учитывает рабочее время и с чем интегрируется.",
        sections: [
          { h: "Что такое СКУД", p: [
            "СКУД — система контроля и управления доступом. Она решает, кто, куда и когда может пройти на объект, и фиксирует каждый проход. Вместо обычного ключа используются карты, брелоки, PIN-код, отпечаток пальца или распознавание лица.",
            "СКУД нужна там, где важно ограничить доступ и вести учёт: офисы, производства, склады, школы, жилые комплексы.",
          ] },
          { h: "Из чего состоит система", p: [
            "Базовые элементы: контроллер (мозг системы), считыватель, запорное устройство (электромагнитный или электромеханический замок, турникет), кнопка выхода и ПО для настройки прав. Права выдаются по зонам и расписанию.",
            "Систему можно начать с одной двери и расширять до сотен точек прохода под единым управлением.",
          ] },
          { h: "Учёт времени и интеграции", p: [
            "СКУД автоматически фиксирует приходы и уходы и формирует табель рабочего времени, который выгружается в 1С. Это исключает ручной учёт и споры о переработках.",
            "СКУД интегрируется с видеонаблюдением (проход привязывается к видеозаписи) и охранной сигнализацией. Мы проектируем и устанавливаем СКУД под ключ под ваш объект.",
          ] },
        ],
      },
      uz: {
        title: "SKUD nima va kirishni boshqarish tizimi qanday ishlaydi",
        excerpt: "Oddiy so'zlar bilan: SKUD nima, kirishni boshqarish tizimi nimalardan iborat, u ish vaqtini qanday hisoblaydi va nima bilan integratsiyalashadi.",
        sections: [
          { h: "SKUD nima", p: [
            "SKUD — kirishni nazorat qilish va boshqarish tizimi. U kim, qayerga va qachon obyektga o'ta olishini hal qiladi va har bir o'tishni qayd etadi. Oddiy kalit o'rniga kartalar, breloklar, PIN-kod, barmoq izi yoki yuzni aniqlash ishlatiladi.",
            "SKUD kirishni cheklash va hisob yuritish muhim bo'lgan joylarda kerak: ofislar, ishlab chiqarish, omborlar, maktablar, turar-joy majmualari.",
          ] },
          { h: "Tizim nimalardan iborat", p: [
            "Asosiy elementlar: kontroller (tizim miyasi), o'quvchi, qulflash qurilmasi (elektromagnit yoki elektromexanik qulf, turniket), chiqish tugmasi va huquqlarni sozlash uchun dastur. Huquqlar zonalar va jadval bo'yicha beriladi.",
            "Tizimni bitta eshikdan boshlab yagona boshqaruvli yuzlab o'tish nuqtalarigacha kengaytirish mumkin.",
          ] },
          { h: "Vaqt hisobi va integratsiyalar", p: [
            "SKUD kelish va ketishlarni avtomatik qayd etadi va 1C ga yuklanadigan ish vaqti tabelini shakllantiradi. Bu qo'lda hisoblash va qo'shimcha ishlar bo'yicha nizolarni bartaraf etadi.",
            "SKUD videokuzatuv (o'tish videoyozuvga bog'lanadi) va qo'riqlash signalizatsiyasi bilan integratsiyalashadi. Biz SKUD ni obyektingizga mos kalit topshirish asosida loyihalaymiz va o'rnatamiz.",
          ] },
        ],
      },
      en: {
        title: "What Is Access Control (ACS) and How It Works",
        excerpt: "In plain words: what an access control system is, what it consists of, how it tracks working hours and what it integrates with.",
        sections: [
          { h: "What ACS is", p: [
            "An access control system (ACS) decides who may enter, where and when — and logs every passage. Instead of an ordinary key it uses cards, fobs, PIN codes, fingerprints or facial recognition.",
            "ACS is needed wherever access must be restricted and accounted for: offices, factories, warehouses, schools, residential complexes.",
          ] },
          { h: "What the system consists of", p: [
            "Core elements: a controller (the brain), a reader, a locking device (electromagnetic or electromechanical lock, turnstile), an exit button and software for managing rights. Rights are granted by zone and schedule.",
            "You can start with a single door and scale to hundreds of entry points under one management console.",
          ] },
          { h: "Time attendance and integrations", p: [
            "ACS automatically logs arrivals and departures and builds a timesheet that exports to 1C. This eliminates manual tracking and overtime disputes.",
            "ACS integrates with CCTV (each passage is linked to video) and intruder alarms. We design and install turnkey access control for your site.",
          ] },
        ],
      },
      tr: {
        title: "Geçiş Kontrol Sistemi (PDKS) Nedir ve Nasıl Çalışır",
        excerpt: "Basit anlatım: geçiş kontrol sistemi nedir, nelerden oluşur, mesaiyi nasıl takip eder ve nelerle entegre olur.",
        sections: [
          { h: "Geçiş kontrolü nedir", p: [
            "Geçiş kontrol sistemi kimin, nereye ve ne zaman girebileceğine karar verir ve her geçişi kaydeder. Sıradan anahtar yerine kart, anahtarlık, PIN, parmak izi veya yüz tanıma kullanılır.",
            "Erişimin kısıtlanması ve kayıt altına alınması gereken her yerde gereklidir: ofisler, fabrikalar, depolar, okullar, konut siteleri.",
          ] },
          { h: "Sistem nelerden oluşur", p: [
            "Temel öğeler: kontrolör (sistemin beyni), okuyucu, kilitleme cihazı (elektromanyetik/elektromekanik kilit, turnike), çıkış butonu ve yetki yönetim yazılımı. Yetkiler bölge ve takvime göre verilir.",
            "Tek kapıyla başlayıp tek yönetim altında yüzlerce geçiş noktasına ölçeklenebilir.",
          ] },
          { h: "Mesai takibi ve entegrasyonlar", p: [
            "Sistem giriş-çıkışları otomatik kaydeder ve 1C'ye aktarılan puantaj oluşturur. Bu, elle takibi ve fazla mesai tartışmalarını ortadan kaldırır.",
            "CCTV (geçiş video kaydına bağlanır) ve alarm sistemleriyle entegre olur. Sahanız için anahtar teslim geçiş kontrolü tasarlar ve kurarız.",
          ] },
        ],
      },
      zh: {
        title: "什么是门禁系统（ACS）及其工作原理",
        excerpt: "通俗解释：什么是门禁系统、由什么组成、如何统计考勤、能与哪些系统集成。",
        sections: [
          { h: "什么是门禁系统", p: [
            "门禁系统决定谁、何时、可以进入哪里，并记录每一次通行。它用卡片、钥匙扣、PIN码、指纹或人脸识别取代普通钥匙。",
            "凡是需要限制出入并留痕的场所都需要门禁：办公室、工厂、仓库、学校、住宅小区。",
          ] },
          { h: "系统由什么组成", p: [
            "核心部件：控制器（系统大脑）、读卡器、锁具（电磁锁或电控锁、闸机）、出门按钮，以及权限管理软件。权限按区域和时间表分配。",
            "可以从一扇门起步，在统一管理下扩展到数百个通行点。",
          ] },
          { h: "考勤与系统集成", p: [
            "门禁自动记录上下班时间并生成可导出到1C的考勤表，消除了手工统计和加班争议。",
            "门禁可与视频监控（通行记录关联录像）和防盗报警联动。我们为您的项目提供门禁系统的交钥匙设计与安装。",
          ] },
        ],
      },
    },
  },
  {
    slug: "pozharnaya-signalizatsiya-vidy",
    date: "2026-07-17",
    related: ["fire", "pa"],
    loc: {
      ru: {
        title: "Пожарная сигнализация: виды, состав и что важно знать",
        excerpt: "Какие бывают системы пожарной сигнализации, из чего состоит АПС и СОУЭ, и почему важен проект по нормам пожарной безопасности.",
        sections: [
          { h: "Зачем нужна пожарная сигнализация", p: [
            "Автоматическая пожарная сигнализация (АПС) обнаруживает возгорание на ранней стадии — по дыму, теплу или пламени — и запускает оповещение и эвакуацию (СОУЭ). Для большинства коммерческих и общественных зданий это требование норм пожарной безопасности.",
            "Раннее обнаружение спасает жизни и имущество и позволяет вызвать службы до того, как огонь распространится.",
          ] },
          { h: "Виды систем", p: [
            "Пороговые (безадресные) системы — недорогие, определяют сработавший шлейф; подходят для небольших объектов. Адресные и адресно-аналоговые точно указывают сработавший извещатель и отслеживают его состояние; нужны для крупных и ответственных зданий.",
            "Выбор зависит от площади, назначения здания и требований проекта.",
          ] },
          { h: "Что входит и почему нужен проект", p: [
            "В систему входят извещатели (дымовые, тепловые, ручные), приёмно-контрольный прибор, оповещатели, а при необходимости — автоматика дымоудаления и пожаротушения. Всё это должно быть рассчитано и согласовано в проекте.",
            "Мы готовим проект по нормам, монтируем и сдаём систему надзорным органам, берём на обслуживание.",
          ] },
        ],
      },
      uz: {
        title: "Yong'in signalizatsiyasi: turlari, tarkibi va bilish muhim narsalar",
        excerpt: "Qanday yong'in signalizatsiyasi tizimlari bo'ladi, APS va SOUE nimalardan iborat va nima uchun normalar bo'yicha loyiha muhim.",
        sections: [
          { h: "Yong'in signalizatsiyasi nima uchun kerak", p: [
            "Avtomatik yong'in signalizatsiyasi (APS) yong'inni erta bosqichda — tutun, issiqlik yoki alanga bo'yicha — aniqlaydi va ogohlantirish hamda evakuatsiyani (SOUE) ishga tushiradi. Ko'pchilik tijorat va jamoat binolari uchun bu yong'in xavfsizligi normalari talabidir.",
            "Erta aniqlash hayot va mol-mulkni saqlaydi va olov tarqalgunga qadar xizmatlarni chaqirish imkonini beradi.",
          ] },
          { h: "Tizim turlari", p: [
            "Chegaraviy (manzilsiz) tizimlar — arzon, ishga tushgan shleyfni aniqlaydi; kichik obyektlar uchun mos. Manzilli va manzilli-analog ishga tushgan datchikni aniq ko'rsatadi va uning holatini kuzatadi; yirik va mas'uliyatli binolar uchun kerak.",
            "Tanlov maydon, bino vazifasi va loyiha talablariga bog'liq.",
          ] },
          { h: "Nima kiradi va nima uchun loyiha kerak", p: [
            "Tizimga datchiklar (tutun, issiqlik, qo'l), qabul-nazorat qurilmasi, ogohlantirgichlar, zarur bo'lganda — tutunni chiqarish va yong'inni o'chirish avtomatikasi kiradi. Bularning barchasi loyihada hisoblanishi va kelishilishi kerak.",
            "Biz normalarga muvofiq loyiha tayyorlaymiz, montaj qilamiz va tizimni nazorat organlariga topshiramiz, xizmatga olamiz.",
          ] },
        ],
      },
      en: {
        title: "Fire Alarm Systems: Types, Components and What Matters",
        excerpt: "Types of fire alarm systems, what an automatic fire alarm and evacuation system consist of, and why a code-compliant design matters.",
        sections: [
          { h: "Why you need a fire alarm", p: [
            "An automatic fire alarm detects fire at an early stage — by smoke, heat or flame — and triggers notification and evacuation. For most commercial and public buildings this is a fire-safety code requirement.",
            "Early detection saves lives and property and lets you call emergency services before the fire spreads.",
          ] },
          { h: "System types", p: [
            "Conventional (non-addressable) systems are inexpensive and identify the triggered loop; they suit small sites. Addressable and analogue-addressable systems pinpoint the exact detector and monitor its health; they are required for large and critical buildings.",
            "The choice depends on floor area, building purpose and design requirements.",
          ] },
          { h: "What is included and why a design project matters", p: [
            "The system includes detectors (smoke, heat, manual call points), a control panel, sounders and — where required — smoke extraction and fire suppression automation. All of it must be calculated and approved in a design project.",
            "We prepare code-compliant designs, install the system, hand it over to supervisory authorities and provide maintenance.",
          ] },
        ],
      },
      tr: {
        title: "Yangın Alarm Sistemleri: Türleri, Bileşenleri ve Bilinmesi Gerekenler",
        excerpt: "Yangın alarm sistemi türleri, otomatik alarm ve tahliye sisteminin bileşenleri ve yönetmeliğe uygun projenin önemi.",
        sections: [
          { h: "Yangın alarmı neden gerekli", p: [
            "Otomatik yangın alarmı yangını erken aşamada — duman, ısı veya alevle — algılar ve uyarı ile tahliyeyi başlatır. Çoğu ticari ve kamu binası için bu, yangın güvenliği yönetmeliğinin gereğidir.",
            "Erken algılama can ve mal kurtarır; yangın yayılmadan ekipleri çağırma imkânı verir.",
          ] },
          { h: "Sistem türleri", p: [
            "Konvansiyonel (adressiz) sistemler ucuzdur ve tetiklenen hattı gösterir; küçük sahalara uygundur. Adresli ve adresli-analog sistemler tetiklenen dedektörü tam gösterir ve durumunu izler; büyük ve kritik binalar için gereklidir.",
            "Seçim alana, bina işlevine ve proje gereksinimlerine bağlıdır.",
          ] },
          { h: "Neler dahil ve proje neden şart", p: [
            "Sistem dedektörler (duman, ısı, buton), kontrol paneli, sirenler ve gerektiğinde duman tahliyesi ile söndürme otomasyonunu içerir. Hepsi projede hesaplanmalı ve onaylanmalıdır.",
            "Yönetmeliğe uygun proje hazırlar, montajı yapar, sistemi denetim kurumlarına teslim eder ve bakımını üstleniriz.",
          ] },
        ],
      },
      zh: {
        title: "火灾报警系统：类型、组成与要点",
        excerpt: "火灾报警系统有哪些类型，自动报警和疏散广播由什么组成，为什么合规设计如此重要。",
        sections: [
          { h: "为什么需要火灾报警", p: [
            "自动火灾报警系统在早期阶段——通过烟雾、温度或火焰——发现火情，并启动警报与疏散广播。对大多数商业和公共建筑而言，这是消防规范的强制要求。",
            "早期发现能挽救生命和财产，并在火势蔓延前呼叫救援。",
          ] },
          { h: "系统类型", p: [
            "普通（非编址）系统价格低，只能定位触发的回路，适合小型场所。编址与模拟编址系统能精确定位触发的探测器并监测其状态，是大型和重要建筑的必选。",
            "选择取决于建筑面积、用途和设计要求。",
          ] },
          { h: "系统包含什么、为何需要设计", p: [
            "系统包括探测器（烟感、温感、手报）、报警主机、声光警报器，必要时还有排烟与灭火联动。所有内容都必须在设计中计算并获得批准。",
            "我们按规范出设计、完成安装、向监管部门交验，并提供后续维保。",
          ] },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-domofon",
    date: "2026-07-17",
    related: ["intercom", "access"],
    loc: {
      ru: {
        title: "Как выбрать домофон для дома и офиса",
        excerpt: "Аудио или видео, аналоговый или IP, вызов на телефон — как выбрать домофон под квартиру, дом, офис или жилой комплекс.",
        sections: [
          { h: "Аудио или видеодомофон", p: [
            "Аудиодомофон обеспечивает только голосовую связь и открытие двери — это бюджетный вариант для подъезда. Видеодомофон показывает посетителя на мониторе, что заметно безопаснее и удобнее.",
            "Для частного дома, офиса и квартиры сегодня выбирают именно видеодомофоны.",
          ] },
          { h: "IP или аналоговый", p: [
            "Аналоговый видеодомофон прост и надёжен для одной-двух точек. IP-домофон даёт высокое качество видео, запись событий, просмотр с телефона из любой точки и интеграцию со СКУД и умным домом.",
            "Для многоквартирных домов и ЖК проектируют многоабонентские IP-системы с вызывными панелями и индивидуальными мониторами.",
          ] },
          { h: "Полезные функции", p: [
            "Обратите внимание на вызов и открытие двери со смартфона, запись по движению, ночную подсветку панели, а для улицы — защиту панели от вандализма и погоды.",
            "Мы подберём и установим домофон под ваш объект — с настройкой удалённого доступа и гарантией.",
          ] },
        ],
      },
      uz: {
        title: "Uy va ofis uchun domofonni qanday tanlash",
        excerpt: "Audio yoki video, analog yoki IP, telefonga qo'ng'iroq — kvartira, uy, ofis yoki turar-joy majmuasi uchun domofonni qanday tanlash.",
        sections: [
          { h: "Audio yoki video domofon", p: [
            "Audio domofon faqat ovozli aloqa va eshik ochishni ta'minlaydi — bu podez uchun byudjet variant. Video domofon tashrifchini monitorda ko'rsatadi, bu sezilarli darajada xavfsizroq va qulayroq.",
            "Xususiy uy, ofis va kvartira uchun bugun aynan video domofonlar tanlanadi.",
          ] },
          { h: "IP yoki analog", p: [
            "Analog video domofon bir-ikki nuqta uchun oddiy va ishonchli. IP-domofon yuqori sifatli video, hodisalar yozuvi, istalgan joydan telefondan ko'rish va SKUD hamda aqlli uy bilan integratsiyani beradi.",
            "Ko'p kvartirali uylar va TJM lar uchun chaqiruv panellari va alohida monitorli ko'p abonentli IP-tizimlar loyihalanadi.",
          ] },
          { h: "Foydali funksiyalar", p: [
            "Smartfondan qo'ng'iroq va eshik ochish, harakat bo'yicha yozib olish, panelning tungi yoritilishi, ko'cha uchun esa panelni vandalizm va ob-havodan himoyaga e'tibor bering.",
            "Biz domofonni obyektingizga mos tanlaymiz va o'rnatamiz — masofaviy kirishni sozlash va kafolat bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "skolko-stoit-skud",
    date: "2026-07-17",
    related: ["access", "turnstile", "attendance"],
    loc: {
      ru: {
        title: "Сколько стоит установка СКУД: из чего складывается цена",
        excerpt: "Разбираем стоимость системы контроля доступа: точки прохода, тип идентификации, замки и турникеты — и на чём можно сэкономить.",
        sections: [
          { h: "Из чего складывается стоимость СКУД", p: [
            "Цена системы контроля доступа зависит от числа точек прохода, типа идентификации (карта, код, отпечаток, лицо), запорных устройств (замок или турникет) и ПО. Чем больше дверей и сложнее логика доступа, тем выше стоимость оборудования и монтажа.",
            "Отдельно считается интеграция — с учётом рабочего времени, видеонаблюдением или 1С. Базовая СКУД на одну дверь обходится недорого; проходная с турникетами и биометрией — дороже.",
          ] },
          { h: "От карты до биометрии", p: [
            "Самый бюджетный вариант — карточные считыватели и электромагнитный замок на одну дверь. Дороже — биометрические терминалы (отпечаток, распознавание лица) и турникеты для проходных с большим потоком людей.",
            "Мы подбираем баланс цены и задачи: где-то достаточно карт, где-то нужна биометрия, а на проходной — турникет с учётом рабочего времени.",
          ] },
          { h: "Что входит в проект", p: [
            "В стоимость входят контроллеры, считыватели, замки или турникеты, кнопки выхода, блок питания, кабель, монтаж, настройка прав доступа и обучение персонала.",
            "Чтобы получить точную смету, закажите бесплатный выезд инженера — посчитаем СКУД под ваш объект в Ташкенте и по всему Узбекистану.",
          ] },
        ],
      },
      uz: {
        title: "SKUD o'rnatish qancha turadi: narx nimalardan tashkil topadi",
        excerpt: "Kirishni boshqarish tizimi narxini ko'rib chiqamiz: o'tish nuqtalari, identifikatsiya turi, qulflar va turniketlar — hamda qanday tejash mumkin.",
        sections: [
          { h: "Narx nimalardan tashkil topadi", p: [
            "Kirishni boshqarish tizimi narxi o'tish nuqtalari soni, identifikatsiya turi (karta, kod, barmoq izi, yuz), qulflash qurilmalari (qulf yoki turniket) va dasturga bog'liq. Eshiklar qancha ko'p va kirish mantig'i qancha murakkab bo'lsa, uskuna va montaj shuncha qimmat.",
            "Integratsiya alohida hisoblanadi — ish vaqtini hisobga olish, videokuzatuv yoki 1C bilan. Bitta eshikka bazaviy SKUD arzon; turniket va biometriyali o'tish joyi — qimmatroq.",
          ] },
          { h: "Kartadan biometriyagacha", p: [
            "Eng arzon variant — bitta eshikka kartali o'quvchi va elektromagnit qulf. Qimmatroq — biometrik terminallar (barmoq izi, yuzni aniqlash) va katta oqim uchun turniketlar.",
            "Biz narx va vazifa muvozanatini tanlaymiz: qayerdadir kartalar yetarli, qayerdadir biometriya, o'tish joyida esa ish vaqtini hisobga oluvchi turniket kerak.",
          ] },
          { h: "Loyihaga nima kiradi", p: [
            "Narxga kontrollerlar, o'quvchilar, qulflar yoki turniketlar, chiqish tugmalari, quvvat bloki, kabel, montaj, kirish huquqlarini sozlash va xodimlarni o'qitish kiradi.",
            "Aniq smeta olish uchun muhandisning bepul chiqishini buyurtma qiling — obyektingiz uchun SKUD ni Toshkentda va butun O'zbekiston bo'ylab hisoblaymiz.",
          ] },
        ],
      },
    },
  },
  {
    slug: "uchet-rabochego-vremeni",
    date: "2026-07-17",
    related: ["attendance", "access"],
    loc: {
      ru: {
        title: "Учёт рабочего времени: как выбрать систему",
        excerpt: "Как работает автоматический учёт рабочего времени, что выбрать — карту, отпечаток или лицо, и как выгрузить табель в 1С.",
        sections: [
          { h: "Как работает учёт рабочего времени", p: [
            "Сотрудники отмечаются на терминале картой, отпечатком или по лицу; система автоматически фиксирует приход и уход и считает отработанные часы. Ручной табель и споры о переработках уходят в прошлое.",
            "Данные доступны руководителю в реальном времени: кто на месте, кто опоздал, сколько отработано за смену и месяц.",
          ] },
          { h: "Карта, отпечаток или лицо", p: [
            "Карты — дёшево, но их передают друг другу. Отпечаток надёжнее, но требует чистых сухих рук. Распознавание лица — самое удобное и бесконтактное, особенно актуально после пандемии.",
            "Подбираем способ отметки под дисциплину на объекте и бюджет; часто комбинируют карту и биометрию.",
          ] },
          { h: "Интеграция и отчёты", p: [
            "Система выгружает табель в 1С и другие учётные программы, строит отчёты по опозданиям и переработкам. Учёт времени объединяется со СКУД: один терминал и пускает сотрудника, и считает часы.",
            "Внедряем под ключ в Ташкенте и по всему Узбекистану — с настройкой отчётов под вашу учётную политику, обучением и поддержкой.",
          ] },
        ],
      },
      uz: {
        title: "Ish vaqtini hisobga olish: tizimni qanday tanlash",
        excerpt: "Avtomatik ish vaqti hisobi qanday ishlaydi, nimani tanlash kerak — karta, barmoq izi yoki yuz, va tabelni 1C ga qanday yuklash.",
        sections: [
          { h: "Ish vaqtini hisobga olish qanday ishlaydi", p: [
            "Xodimlar terminalda karta, barmoq izi yoki yuz bilan belgilanadi; tizim kelish va ketishni avtomatik qayd etadi va ishlangan soatlarni hisoblaydi. Qo'lda tabel va qo'shimcha ishlar bo'yicha nizolar o'tmishda qoladi.",
            "Ma'lumotlar rahbarga real vaqtda ochiq: kim joyida, kim kechikdi, smena va oyda qancha ishlangan.",
          ] },
          { h: "Karta, barmoq izi yoki yuz", p: [
            "Kartalar arzon, lekin ularni bir-biriga beradi. Barmoq izi ishonchliroq, lekin toza quruq qo'l talab qiladi. Yuzni aniqlash — eng qulay va kontaktsiz, pandemiyadan keyin ayniqsa dolzarb.",
            "Belgilash usulini obyektdagi intizom va byudjetga qarab tanlaymiz; ko'pincha karta va biometriyani birlashtiradilar.",
          ] },
          { h: "Integratsiya va hisobotlar", p: [
            "Tizim tabelni 1C va boshqa dasturlarga yuklaydi, kechikish va qo'shimcha ishlar bo'yicha hisobotlar tuzadi. Vaqtni hisobga olish SKUD bilan birlashadi: bitta terminal ham xodimni kiritadi, ham soatlarni sanaydi.",
            "Kalit topshirish asosida joriy etamiz — Toshkentda va butun O'zbekiston bo'ylab, hisobotlarni sizning hisob siyosatingizga moslab, o'qitish va qo'llab-quvvatlash bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "wifi-dlya-ofisa",
    date: "2026-07-17",
    related: ["wifi", "network"],
    loc: {
      ru: {
        title: "Wi-Fi для офиса и склада: как сделать бесшовную сеть",
        excerpt: "Почему один роутер не справляется, сколько точек доступа нужно и что важно при монтаже корпоративного Wi-Fi.",
        sections: [
          { h: "Почему один роутер не справляется", p: [
            "Бытовой роутер не покрывает офис или склад целиком: в дальних кабинетах сигнал падает, а устройства при перемещении рвут соединение. Нужна сеть из точек доступа с бесшовным роумингом — устройство переключается между точками без разрыва.",
            "Для бизнеса это критично: видеозвонки, касса, склад и IP-телефония должны работать стабильно в любой точке здания.",
          ] },
          { h: "Сколько точек доступа нужно", p: [
            "Число точек зависит от площади, стен и плотности пользователей. Открытый офис — примерно одна точка на 100–150 м²; склад с высокими стеллажами и бетоном требует более плотной установки.",
            "Точный расчёт даёт радиообследование на объекте — мы приезжаем, замеряем покрытие и проектируем сеть без мёртвых зон.",
          ] },
          { h: "Что важно при монтаже", p: [
            "Отдельная гостевая сеть, единый контроллер для управления всеми точками, питание точек по PoE (один кабель — данные и питание) и правильные каналы против взаимных помех.",
            "Настраиваем Wi-Fi под ключ на оборудовании Ubiquiti, MikroTik, TP-Link в Ташкенте и по всему Узбекистану — с гарантией и поддержкой.",
          ] },
        ],
      },
      uz: {
        title: "Ofis va ombor uchun Wi-Fi: uzluksiz tarmoqni qanday qilish",
        excerpt: "Nega bitta router yetarli emas, nechta kirish nuqtasi kerak va korporativ Wi-Fi montajida nima muhim.",
        sections: [
          { h: "Nega bitta router yetarli emas", p: [
            "Maishiy router ofis yoki omborni to'liq qoplamaydi: uzoq xonalarda signal tushadi, qurilmalar harakatlanganda aloqani uzadi. Uzluksiz rouming bilan kirish nuqtalari tarmog'i kerak — qurilma nuqtalar o'rtasida uzilishlarsiz o'tadi.",
            "Biznes uchun bu muhim: videoqo'ng'iroqlar, kassa, ombor va IP-telefoniya binoning istalgan joyida barqaror ishlashi kerak.",
          ] },
          { h: "Nechta kirish nuqtasi kerak", p: [
            "Nuqtalar soni maydon, devorlar va foydalanuvchilar zichligiga bog'liq. Ochiq ofis — taxminan har 100–150 m² ga bitta nuqta; baland stellajli va betonli ombor zichroq o'rnatishni talab qiladi.",
            "Aniq hisobni obyektda radio tekshiruv beradi — kelamiz, qamrovni o'lchaymiz va o'lik zonalarsiz tarmoq loyihalaymiz.",
          ] },
          { h: "Montajda nima muhim", p: [
            "Alohida mehmon tarmog'i, barcha nuqtalarni boshqarish uchun yagona kontroller, nuqtalarni PoE orqali quvvatlash (bitta kabel — ma'lumot va quvvat) va o'zaro xalaqitlarga qarshi to'g'ri kanallar.",
            "Ubiquiti, MikroTik, TP-Link uskunasida Wi-Fi ni kalit topshirish asosida sozlaymiz — Toshkentda va butun O'zbekiston bo'ylab, kafolat va qo'llab-quvvatlash bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "umnyy-dom-s-chego-nachat",
    date: "2026-07-17",
    related: ["smarthome"],
    loc: {
      ru: {
        title: "Умный дом: с чего начать и сколько стоит",
        excerpt: "Не обязательно автоматизировать всё сразу — рассказываем, с чего начать умный дом, проводной или беспроводной, и что можно автоматизировать.",
        sections: [
          { h: "С чего начать умный дом", p: [
            "Не обязательно автоматизировать всё сразу. Начните с базового сценария — свет и климат по расписанию, датчики протечки и дыма, видеонаблюдение в одном приложении. Дальше систему легко расширять по мере бюджета.",
            "Такой поэтапный подход снижает стартовые затраты и позволяет понять, какие сценарии реально нужны именно вам.",
          ] },
          { h: "Проводной или беспроводной", p: [
            "Беспроводные системы (Wi-Fi/Zigbee) дешевле и ставятся без ремонта — подходят для готовой квартиры. Проводные надёжнее и закладываются на этапе строительства или капитального ремонта.",
            "Подбираем решение под ваш объект и стадию ремонта — от отдельных сценариев до полной автоматизации коттеджа.",
          ] },
          { h: "Что можно автоматизировать", p: [
            "Освещение и сценарии (утро, отъезд, ночь), климат и шторы, умные розетки и замки, датчики движения, протечки и дыма, интеграцию с видеонаблюдением и охранной сигнализацией. Управлять можно голосом, со смартфона или по расписанию.",
            "Устанавливаем умный дом под ключ в Ташкенте и по всему Узбекистану — с настройкой, обучением и гарантией.",
          ] },
        ],
      },
      uz: {
        title: "Aqlli uy: nimadan boshlash va qancha turadi",
        excerpt: "Hammasini birdan avtomatlashtirish shart emas — aqlli uyni nimadan boshlash, simli yoki simsiz, va nimani avtomatlashtirish mumkinligini aytamiz.",
        sections: [
          { h: "Aqlli uyni nimadan boshlash", p: [
            "Hammasini birdan avtomatlashtirish shart emas. Asosiy ssenariydan boshlang — yorug'lik va iqlim jadval bo'yicha, suv oqishi va tutun datchiklari, videokuzatuv bitta ilovada. Keyin tizimni byudjetga qarab oson kengaytirasiz.",
            "Bunday bosqichma-bosqich yondashuv boshlang'ich xarajatlarni kamaytiradi va qaysi ssenariylar sizga haqiqatan kerakligini tushunishga yordam beradi.",
          ] },
          { h: "Simli yoki simsiz", p: [
            "Simsiz tizimlar (Wi-Fi/Zigbee) arzonroq va ta'mirsiz o'rnatiladi — tayyor kvartira uchun mos. Simli tizimlar ishonchliroq va qurilish yoki kapital ta'mir bosqichida qo'yiladi.",
            "Yechimni obyektingiz va ta'mir bosqichiga qarab tanlaymiz — alohida ssenariylardan tortib kottejni to'liq avtomatlashtirishgacha.",
          ] },
          { h: "Nimani avtomatlashtirish mumkin", p: [
            "Yoritish va ssenariylar (ertalab, ketish, tun), iqlim va pardalar, aqlli rozetkalar va qulflar, harakat, suv oqishi va tutun datchiklari, videokuzatuv va qo'riqlash signalizatsiyasi bilan integratsiya. Ovoz, smartfon yoki jadval bilan boshqarish mumkin.",
            "Aqlli uyni kalit topshirish asosida o'rnatamiz — Toshkentda va butun O'zbekiston bo'ylab, sozlash, o'qitish va kafolat bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-turniket",
    date: "2026-07-17",
    related: ["turnstile", "access", "attendance"],
    loc: {
      ru: {
        title: "Как выбрать турникет для проходной",
        excerpt: "Виды турникетов (трипод, роторный, speed gate), пропускная способность и интеграция со СКУД — как подобрать под поток и задачу.",
        sections: [
          { h: "Виды турникетов", p: [
            "Турникеты бывают трёх основных типов: триподы (самые доступные, для офисов и небольших проходных), роторные и полноростовые (максимальная защита, для режимных объектов) и скоростные проходы speed gate (для бизнес-центров и мест с большим потоком).",
            "Выбор зависит от требуемого уровня контроля и внешнего вида: где-то важна экономия, где-то — представительность и высокая пропускная способность.",
          ] },
          { h: "Пропускная способность и поток", p: [
            "Трипод пропускает примерно 20–30 человек в минуту — достаточно для офиса или небольшого предприятия. Для проходной завода или стадиона в час пик нужны несколько линий или speed gate.",
            "Мы считаем число линий под ваш реальный поток, чтобы на входе не собирались очереди в пиковые часы.",
          ] },
          { h: "Идентификация и интеграция", p: [
            "Турникет работает в связке со СКУД: проход по карте, отпечатку или распознаванию лица, интеграция с учётом рабочего времени и видеонаблюдением. Предусматриваем калитку для маломобильных посетителей.",
            "Устанавливаем турникеты под ключ в Ташкенте и по всему Узбекистану — с гарантией и сервисным обслуживанием.",
          ] },
        ],
      },
      uz: {
        title: "O'tish joyi uchun turniketni qanday tanlash",
        excerpt: "Turniket turlari (tripod, rotorli, speed gate), o'tkazuvchanlik va SKUD bilan integratsiya — oqim va vazifaga qarab qanday tanlash.",
        sections: [
          { h: "Turniket turlari", p: [
            "Turniketlar uch asosiy turda bo'ladi: tripodlar (eng arzon, ofis va kichik o'tish joylari uchun), rotorli va to'liq bo'yli (maksimal himoya, rejimli obyektlar uchun) va tezkor o'tish yo'laklari speed gate (biznes-markazlar va katta oqim uchun).",
            "Tanlov kerakli nazorat darajasi va tashqi ko'rinishga bog'liq: qayerdadir tejash muhim, qayerdadir — ko'rkamlik va yuqori o'tkazuvchanlik.",
          ] },
          { h: "O'tkazuvchanlik va oqim", p: [
            "Tripod daqiqasiga taxminan 20–30 kishini o'tkazadi — ofis yoki kichik korxona uchun yetarli. Zavod yoki stadion o'tish joyi uchun cho'qqi soatlarida bir necha liniya yoki speed gate kerak.",
            "Cho'qqi soatlarda kirishda navbat bo'lmasligi uchun haqiqiy oqimingizga qarab liniyalar sonini hisoblaymiz.",
          ] },
          { h: "Identifikatsiya va integratsiya", p: [
            "Turniket SKUD bilan birga ishlaydi: karta, barmoq izi yoki yuzni aniqlash orqali o'tish, ish vaqtini hisobga olish va videokuzatuv bilan integratsiya. Nogiron tashrifchilar uchun kalitka ko'zda tutamiz.",
            "Turniketlarni kalit topshirish asosida o'rnatamiz — Toshkentda va butun O'zbekiston bo'ylab, kafolat va servis xizmati bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "shlagbaum-anpr",
    date: "2026-07-17",
    related: ["barrier", "anpr", "gates"],
    loc: {
      ru: {
        title: "Шлагбаум с распознаванием номеров: как работает",
        excerpt: "Автоматический въезд по номеру автомобиля: как устроена система ANPR, что в неё входит и где применяется.",
        sections: [
          { h: "Как работает автоматический въезд", p: [
            "Камера ANPR распознаёт госномер подъезжающего автомобиля и, если он в белом списке, шлагбаум открывается сам — без карт, брелоков и охранника. Каждый проезд фиксируется в журнале с фото и временем.",
            "Это убирает очереди на въезде и человеческий фактор: «свои» машины проезжают за секунды.",
          ] },
          { h: "Что входит в систему", p: [
            "Шлагбаум с приводом, камера распознавания номеров, контроллер, фотоэлементы безопасности (чтобы стрела не опускалась на машину), пульты для гостей и ПО с белыми и чёрными списками. Для платных парковок добавляется тарификация въезда и выезда.",
            "Шлагбаум интегрируется со СКУД и системой парковки в единое решение.",
          ] },
          { h: "Где применяется", p: [
            "Жилые комплексы, бизнес-центры, паркинги, предприятия и охраняемые территории — везде, где нужен контролируемый и удобный въезд.",
            "Монтируем шлагбаумы с ANPR под ключ в Ташкенте и по всему Узбекистану — с гарантией и обслуживанием.",
          ] },
        ],
      },
      uz: {
        title: "Avtoraqamni aniqlaydigan shlagbaum: qanday ishlaydi",
        excerpt: "Avtomobil raqami bo'yicha avtomatik kirish: ANPR tizimi qanday tuzilgan, unga nima kiradi va qayerda qo'llaniladi.",
        sections: [
          { h: "Avtomatik kirish qanday ishlaydi", p: [
            "ANPR kamerasi yaqinlashayotgan avtomobil davlat raqamini aniqlaydi va agar u oq ro'yxatda bo'lsa, shlagbaum o'zi ochiladi — kartasiz, breloksiz va qorovulsiz. Har bir o'tish rasm va vaqt bilan jurnalda qayd etiladi.",
            "Bu kirishdagi navbat va inson omilini bartaraf etadi: «o'z» mashinalar bir necha soniyada o'tadi.",
          ] },
          { h: "Tizimga nima kiradi", p: [
            "Privodli shlagbaum, raqam aniqlash kamerasi, kontroller, xavfsizlik fotoelementlari (strela mashinaga tushmasligi uchun), mehmonlar uchun pultlar va oq hamda qora ro'yxatli dastur. Pullik avtoturargohlar uchun kirish/chiqish tariflashi qo'shiladi.",
            "Shlagbaum SKUD va avtoturargoh tizimi bilan yagona yechimga integratsiyalashadi.",
          ] },
          { h: "Qayerda qo'llaniladi", p: [
            "Turar-joy majmualari, biznes-markazlar, avtoturargohlar, korxonalar va qo'riqlanadigan hududlar — nazorat qilinadigan va qulay kirish kerak bo'lgan hamma joyda.",
            "ANPR bilan shlagbaumlarni kalit topshirish asosida montaj qilamiz — Toshkentda va butun O'zbekiston bo'ylab, kafolat va xizmat bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "ohrannaya-signalizatsiya-kak-vybrat",
    date: "2026-07-17",
    related: ["alarm", "cctv"],
    loc: {
      ru: {
        title: "Охранная сигнализация: как выбрать для дома и офиса",
        excerpt: "Как работает охранная сигнализация, проводная или беспроводная, и как вывести тревогу на пульт охраны и смартфон.",
        sections: [
          { h: "Как работает охранная сигнализация", p: [
            "Датчики движения, открытия дверей и окон, разбития стекла реагируют на проникновение и передают сигнал на пульт охраны и на ваш смартфон. Тревожная кнопка вызывает помощь мгновенно.",
            "Система ставится под охрану одним нажатием или по расписанию, а при тревоге включает сирену и оповещение.",
          ] },
          { h: "Проводная или беспроводная", p: [
            "Беспроводная система ставится без штробления и подходит для готового помещения; проводная надёжнее и закладывается при ремонте. Для большинства квартир и офисов достаточно беспроводной с резервным питанием на случай отключения света.",
            "Подбираем состав датчиков под планировку: движение в коридорах, открытие на входах, разбитие стекла у витрин.",
          ] },
          { h: "Вывод на пульт и интеграция", p: [
            "Сигнализацию можно вывести на пульт вневедомственной или частной охраны и объединить с видеонаблюдением — тревога сопровождается видеозаписью для проверки.",
            "Устанавливаем охранную сигнализацию под ключ в Ташкенте и по всему Узбекистану — с гарантией и обслуживанием.",
          ] },
        ],
      },
      uz: {
        title: "Qo'riqlash signalizatsiyasi: uy va ofis uchun qanday tanlash",
        excerpt: "Qo'riqlash signalizatsiyasi qanday ishlaydi, simli yoki simsiz, va trevogani qo'riqlash pulti hamda smartfonga qanday chiqarish.",
        sections: [
          { h: "Qo'riqlash signalizatsiyasi qanday ishlaydi", p: [
            "Harakat, eshik va deraza ochilishi, oyna sinishi datchiklari kirishga javob beradi va signalni qo'riqlash pultiga hamda smartfoningizga uzatadi. Trevoga tugmasi yordamni bir zumda chaqiradi.",
            "Tizim bir marta bosish yoki jadval bo'yicha qo'riqlashga qo'yiladi, trevogada esa sirena va ogohlantirishni yoqadi.",
          ] },
          { h: "Simli yoki simsiz", p: [
            "Simsiz tizim shtroblashsiz o'rnatiladi va tayyor xonaga mos; simli ishonchliroq va ta'mir vaqtida qo'yiladi. Ko'pchilik kvartira va ofislar uchun svet o'chganda ishlashi uchun zaxira quvvatli simsiz tizim yetarli.",
            "Datchiklar tarkibini rejaga qarab tanlaymiz: koridorlarda harakat, kirishlarda ochilish, vitrinalar oldida oyna sinishi.",
          ] },
          { h: "Pultga chiqarish va integratsiya", p: [
            "Signalizatsiyani idoraviy yoki xususiy qo'riqlash pultiga chiqarish va videokuzatuv bilan birlashtirish mumkin — trevoga tekshirish uchun videoyozuv bilan hamroh bo'ladi.",
            "Qo'riqlash signalizatsiyasini kalit topshirish asosida o'rnatamiz — Toshkentda va butun O'zbekiston bo'ylab, kafolat va xizmat bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "avtomaticheskie-vorota-kak-vybrat",
    date: "2026-07-17",
    related: ["gates", "barrier"],
    loc: {
      ru: {
        title: "Автоматические ворота: как выбрать привод",
        excerpt: "Типы ворот (откатные, распашные, секционные) и приводов, что важно при выборе и можно ли автоматизировать существующие ворота.",
        sections: [
          { h: "Типы ворот и приводов", p: [
            "Ворота бывают откатные, распашные, секционные и роллетные — под каждый тип свой привод. Откатные удобны для широких въездов, распашные — классика для дворов, секционные экономят место в гараже.",
            "Привод подбирается под вес створки и частоту открывания: чем тяжелее и чаще, тем мощнее нужен механизм.",
          ] },
          { h: "Что важно при выборе", p: [
            "Мощность привода под вес створки, интенсивность работы (для частого въезда нужен привод с запасом), фотоэлементы безопасности и сигнальная лампа, пульты и возможность распознавания номеров.",
            "Экономия на приводе оборачивается быстрым износом — лучше взять механизм с запасом по нагрузке.",
          ] },
          { h: "Автоматизация существующих ворот", p: [
            "Автоматику можно поставить и на уже смонтированные ворота. Настраиваем плавное открытие, защиту от защемления, интеграцию со СКУД и распознаванием номеров.",
            "Работаем под ключ в Ташкенте и по всему Узбекистану — с гарантией и сервисным обслуживанием.",
          ] },
        ],
      },
      uz: {
        title: "Avtomatik darvozalar: privodni qanday tanlash",
        excerpt: "Darvoza turlari (suriladigan, ochiladigan, seksiyali) va privodlar, tanlashda nima muhim va mavjud darvozalarni avtomatlashtirish mumkinmi.",
        sections: [
          { h: "Darvoza va privod turlari", p: [
            "Darvozalar suriladigan, ochiladigan, seksiyali va rolikli bo'ladi — har turga o'z privodi. Suriladigan keng kirishlar uchun qulay, ochiladigan — hovlilar uchun klassika, seksiyali garajda joy tejaydi.",
            "Privod tavaqa og'irligi va ochilish chastotasiga qarab tanlanadi: qancha og'ir va tez-tez bo'lsa, mexanizm shuncha kuchli kerak.",
          ] },
          { h: "Tanlashda nima muhim", p: [
            "Privod quvvati tavaqa og'irligiga mos bo'lishi, ish intensivligi (tez-tez kirish uchun zaxirali privod kerak), xavfsizlik fotoelementlari va signal chirog'i, pultlar va raqam aniqlash imkoniyati.",
            "Privodda tejash tez eskirishga olib keladi — yuklama bo'yicha zaxirali mexanizm olgan ma'qul.",
          ] },
          { h: "Mavjud darvozalarni avtomatlashtirish", p: [
            "Avtomatikani allaqachon o'rnatilgan darvozalarga ham qo'yish mumkin. Silliq ochilish, qisilishdan himoya, SKUD va raqam aniqlash bilan integratsiyani sozlaymiz.",
            "Kalit topshirish asosida ishlaymiz — Toshkentda va butun O'zbekiston bo'ylab, kafolat va servis xizmati bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "montazh-sks",
    date: "2026-07-17",
    related: ["network", "fiber", "wifi"],
    loc: {
      ru: {
        title: "Монтаж СКС и локальной сети в офисе: этапы",
        excerpt: "Что такое структурированная кабельная система, из каких этапов состоит монтаж и что важно для надёжной сети офиса.",
        sections: [
          { h: "Что такое СКС и зачем она нужна", p: [
            "Структурированная кабельная система (СКС) — это единая кабельная основа офиса: одна проводка для компьютеров, телефонии, Wi-Fi, видеонаблюдения и других систем. Грамотная СКС избавляет от хаоса проводов и упрощает подключение новых устройств.",
            "Это фундамент IT-инфраструктуры: от качества кабельной системы зависит стабильность всей сети предприятия.",
          ] },
          { h: "Этапы монтажа", p: [
            "Проектирование и схема рабочих мест, прокладка кабельных трасс (лотки, короба), установка серверного шкафа и патч-панелей, монтаж розеток и подключение коммутаторов, маркировка и тестирование каждой линии, сдача исполнительной документации.",
            "На каждом этапе важна аккуратность — переделка кабельной трассы обходится дороже, чем изначально сделать правильно.",
          ] },
          { h: "Что важно при монтаже", p: [
            "Кабель и компоненты проверенных категорий (Cat5e/Cat6), запас портов под рост компании, аккуратная организация кабельного хозяйства и кабельный журнал для обслуживания.",
            "Выполняем монтаж СКС и локальных сетей под ключ в Ташкенте и по всему Узбекистану — с гарантией и последующим сопровождением.",
          ] },
        ],
      },
      uz: {
        title: "Ofisda SKS va lokal tarmoq montaji: bosqichlar",
        excerpt: "Strukturali kabel tizimi nima, montaj qanday bosqichlardan iborat va ofis tarmog'ining ishonchliligi uchun nima muhim.",
        sections: [
          { h: "SKS nima va nima uchun kerak", p: [
            "Strukturali kabel tizimi (SKS) — ofisning yagona kabel asosi: kompyuterlar, telefoniya, Wi-Fi, videokuzatuv va boshqa tizimlar uchun bitta o'tkazish. To'g'ri SKS simlar tartibsizligini bartaraf etadi va yangi qurilmalarni ulashni osonlashtiradi.",
            "Bu IT-infratuzilmaning poydevori: kabel tizimi sifatiga korxona butun tarmog'ining barqarorligi bog'liq.",
          ] },
          { h: "Montaj bosqichlari", p: [
            "Loyihalash va ish o'rinlari sxemasi, kabel trassalarini yotqizish (lotoklar, koroblar), server shkafi va patch-panellarni o'rnatish, rozetkalar montaji va kommutatorlarni ulash, belgilash va har bir liniyani sinovdan o'tkazish, ijro hujjatlarini topshirish.",
            "Har bir bosqichda aniqlik muhim — kabel trassasini qayta qilish darhol to'g'ri qilishdan qimmatroq.",
          ] },
          { h: "Montajda nima muhim", p: [
            "Ishonchli kategoriyali kabel va komponentlar (Cat5e/Cat6), kompaniya o'sishi uchun portlar zaxirasi, kabel xo'jaligini toza tashkil etish va xizmat ko'rsatish uchun kabel jurnali.",
            "SKS va lokal tarmoqlar montajini kalit topshirish asosida bajaramiz — Toshkentda va butun O'zbekiston bo'ylab, kafolat va keyingi qo'llab-quvvatlash bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "ip-telefoniya-dlya-ofisa",
    date: "2026-07-17",
    related: ["telephony", "network"],
    loc: {
      ru: {
        title: "IP-телефония для офиса: как выбрать АТС",
        excerpt: "Чем IP-телефония лучше обычной, облачная или локальная АТС, и что можно настроить — интеграция с CRM, запись, очереди.",
        sections: [
          { h: "Чем IP-телефония лучше обычной", p: [
            "IP-телефония работает через интернет и заменяет устаревшие аналоговые линии: многоканальные номера, внутренние добавочные, голосовое меню, запись разговоров и статистика. Сотрудники звонят с телефона, компьютера и мобильного приложения.",
            "Один номер обслуживает всю компанию, а расходы на связь между офисами и филиалами снижаются.",
          ] },
          { h: "Облачная или локальная АТС", p: [
            "Облачная АТС не требует своего оборудования и быстро разворачивается — удобно для небольших команд. Локальная (например, на Asterisk) даёт полный контроль и подходит для крупных офисов и колл-центров.",
            "Подбираем решение под размер компании и требования к надёжности и интеграциям.",
          ] },
          { h: "Что можно настроить", p: [
            "Сценарии приёма звонков, переадресацию, очереди, интеграцию с CRM (звонок открывает карточку клиента), запись разговоров и аналитику по звонкам.",
            "Внедряем IP-телефонию под ключ в Ташкенте и по всему Узбекистану — с настройкой, обучением и поддержкой.",
          ] },
        ],
      },
      uz: {
        title: "Ofis uchun IP-telefoniya: ATS ni qanday tanlash",
        excerpt: "IP-telefoniya oddiy telefoniyadan nimasi bilan yaxshi, bulutli yoki lokal ATS, va nimani sozlash mumkin — CRM integratsiya, yozib olish, navbatlar.",
        sections: [
          { h: "IP-telefoniya oddiy telefoniyadan nimasi bilan yaxshi", p: [
            "IP-telefoniya internet orqali ishlaydi va eskirgan analog liniyalarni almashtiradi: ko'p kanalli raqamlar, ichki qo'shimchalar, ovozli menyu, suhbatlarni yozib olish va statistika. Xodimlar telefon, kompyuter va mobil ilovadan qo'ng'iroq qiladi.",
            "Bitta raqam butun kompaniyaga xizmat qiladi, ofis va filiallar o'rtasidagi aloqa xarajatlari esa kamayadi.",
          ] },
          { h: "Bulutli yoki lokal ATS", p: [
            "Bulutli ATS o'z uskunasini talab qilmaydi va tez o'rnatiladi — kichik jamoalar uchun qulay. Lokal (masalan, Asterisk) to'liq nazorat beradi va yirik ofis hamda kol-markazlar uchun mos.",
            "Yechimni kompaniya o'lchami va ishonchlilik hamda integratsiya talablariga qarab tanlaymiz.",
          ] },
          { h: "Nimani sozlash mumkin", p: [
            "Qo'ng'iroqlarni qabul qilish ssenariylari, yo'naltirish, navbatlar, CRM bilan integratsiya (qo'ng'iroq mijoz kartasini ochadi), suhbatlarni yozib olish va qo'ng'iroqlar tahlili.",
            "IP-telefoniyani kalit topshirish asosida joriy etamiz — Toshkentda va butun O'zbekiston bo'ylab, sozlash, o'qitish va qo'llab-quvvatlash bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "servernaya-komnata",
    date: "2026-07-17",
    related: ["server", "network", "virtualization"],
    loc: {
      ru: {
        title: "Серверная комната под ключ: что нужно",
        excerpt: "Что входит в серверную, почему питание и охлаждение — главное, и как спроектировать серверную под задачу с запасом на рост.",
        sections: [
          { h: "Что входит в серверную", p: [
            "Серверная комната — это сердце IT-инфраструктуры. В неё входят серверные шкафы и стойки, структурированная кабельная система, бесперебойное питание (ИБП) и при необходимости дизель-генератор, кондиционирование, система газового пожаротушения и контроль доступа.",
            "Всё это должно работать как единый комплекс — от этого зависит бесперебойность бизнеса.",
          ] },
          { h: "Питание и охлаждение — главное", p: [
            "Серверы боятся перегрева и перебоев питания. ИБП держит нагрузку при отключении света до запуска генератора, а прецизионный кондиционер поддерживает стабильную температуру и влажность.",
            "На этом экономить нельзя — простой сервера и потеря данных обходятся дороже, чем правильная инженерия.",
          ] },
          { h: "Проектирование под задачу", p: [
            "Закладываем запас по мощности и месту под рост, резервирование критичных узлов, мониторинг микроклимата и удалённый контроль состояния.",
            "Проектируем и строим серверные и ЦОД под ключ в Ташкенте и по всему Узбекистану — с документацией и сервисным сопровождением.",
          ] },
        ],
      },
      uz: {
        title: "Server xonasi kalit topshirish asosida: nima kerak",
        excerpt: "Server xonasiga nima kiradi, nima uchun quvvat va sovitish eng muhim, va o'sish zaxirasi bilan server xonasini qanday loyihalash.",
        sections: [
          { h: "Server xonasiga nima kiradi", p: [
            "Server xonasi — IT-infratuzilmaning yuragi. Unga server shkaflari va stoykalar, strukturali kabel tizimi, uzluksiz quvvat (UPS) va zarur bo'lganda dizel-generator, konditsionerlash, gazli yong'in o'chirish tizimi va kirish nazorati kiradi.",
            "Bularning barchasi yagona majmua sifatida ishlashi kerak — biznesning uzluksizligi shunga bog'liq.",
          ] },
          { h: "Quvvat va sovitish — eng muhimi", p: [
            "Serverlar qizib ketish va quvvat uzilishidan qo'rqadi. UPS svet o'chganda generator ishga tushguncha yuklamani ushlab turadi, aniq konditsioner esa barqaror harorat va namlikni saqlaydi.",
            "Bunga tejash mumkin emas — server to'xtashi va ma'lumot yo'qolishi to'g'ri muhandislikdan qimmatroq.",
          ] },
          { h: "Vazifaga qarab loyihalash", p: [
            "O'sish uchun quvvat va joy zaxirasi, muhim tugunlarni zaxiralash, mikroiqlim monitoringi va holatni masofaviy nazorat qilishni ko'zda tutamiz.",
            "Server xonalari va ma'lumot markazlarini kalit topshirish asosida loyihalaymiz va quramiz — Toshkentda va butun O'zbekiston bo'ylab, hujjatlar va servis bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "videoanalitika-raspoznavanie-lic",
    date: "2026-07-17",
    related: ["analytics", "cctv", "anpr"],
    loc: {
      ru: {
        title: "Видеоаналитика и распознавание лиц: что это и зачем",
        excerpt: "Что умеет видеоаналитика, где она приносит пользу — ритейл, бизнес-центры, парковки — и как её внедрить на существующие камеры.",
        sections: [
          { h: "Что умеет видеоаналитика", p: [
            "Видеоаналитика превращает обычные камеры в умную систему: распознавание лиц и автономеров, подсчёт посетителей, контроль периметра и зон, детекция оставленных предметов и нестандартного поведения — всё в реальном времени, без постоянного оператора.",
            "Система сама привлекает внимание к событию, а не заставляет часами смотреть в мониторы.",
          ] },
          { h: "Где это приносит пользу", p: [
            "Ритейл считает поток покупателей и строит тепловые карты, бизнес-центры пускают сотрудников по лицу, парковки открывают шлагбаум по номеру, охрана получает тревогу при пересечении периметра.",
            "Аналитика превращает видеонаблюдение из «архива на всякий случай» в рабочий инструмент управления и безопасности.",
          ] },
          { h: "Как внедрить", p: [
            "Часть аналитики работает прямо на камерах, часть — на сервере с ИИ. Аналитику можно добавить и к уже установленным камерам через серверное ПО, без полной замены системы.",
            "Внедряем видеоаналитику под ключ в Ташкенте и по всему Узбекистану — с обучением операторов и поддержкой.",
          ] },
        ],
      },
      uz: {
        title: "Videotahlil va yuzni aniqlash: bu nima va nima uchun",
        excerpt: "Videotahlil nima qila oladi, u qayerda foyda keltiradi — riteyl, biznes-markazlar, avtoturargohlar — va uni mavjud kameralarga qanday joriy etish.",
        sections: [
          { h: "Videotahlil nima qila oladi", p: [
            "Videotahlil oddiy kameralarni aqlli tizimga aylantiradi: yuz va avtoraqamlarni aniqlash, tashrifchilarni sanash, perimetr va zonalarni nazorat qilish, tashlab ketilgan buyumlar va nostandart xatti-harakatni aniqlash — hammasi real vaqtda, doimiy operatorsiz.",
            "Tizim hodisaga o'zi e'tibor qaratadi, monitorlarga soatlab qarashga majbur qilmaydi.",
          ] },
          { h: "Bu qayerda foyda keltiradi", p: [
            "Riteyl xaridorlar oqimini sanaydi va issiqlik xaritalari tuzadi, biznes-markazlar xodimlarni yuz bo'yicha kiritadi, avtoturargohlar raqam bo'yicha shlagbaumni ochadi, qo'riqlash perimetr kesib o'tilganda trevoga oladi.",
            "Tahlil videokuzatuvni «har ehtimolga qarshi arxiv»dan boshqaruv va xavfsizlikning ishchi vositasiga aylantiradi.",
          ] },
          { h: "Qanday joriy etish", p: [
            "Tahlilning bir qismi to'g'ridan-to'g'ri kameralarda, bir qismi AI bilan serverda ishlaydi. Tahlilni allaqachon o'rnatilgan kameralarga ham server dasturi orqali, tizimni to'liq almashtirmasdan qo'shish mumkin.",
            "Videotahlilni kalit topshirish asosida joriy etamiz — Toshkentda va butun O'zbekiston bo'ylab, operatorlarni o'qitish va qo'llab-quvvatlash bilan.",
          ] },
        ],
      },
    },
  },
  {
    slug: "hikvision-vs-dahua",
    date: "2026-07-19",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Hikvision или Dahua: что выбрать для видеонаблюдения",
        excerpt: "Два мировых лидера видеонаблюдения — честное сравнение: экосистемы, аналитика, цены и что выбрать под конкретную задачу в Узбекистане.",
        sections: [
          { h: "Чем бренды похожи", p: [
            "Hikvision и Dahua — два крупнейших производителя видеонаблюдения в мире, и по базовому качеству картинки они давно идут вровень: сопоставимые матрицы, схожие корпуса, одинаковые классы защиты IP67 и линейки от бюджетных до профессиональных. Оба бренда официально представлены в Узбекистане, на оба действует заводская гарантия, к обоим легко найти совместимые регистраторы, кронштейны и диски.",
            "SAT Solutions — авторизованный стратегический интегратор Dahua Technology и официальный поставщик Hikvision: мы монтируем обе марки ежедневно и видим их сильные и слабые стороны не по брошюрам, а на объектах.",
          ] },
          { h: "Ключевые отличия на практике", p: [
            "Экосистема и приложения. У Hikvision — Hik-Connect и iVMS, у Dahua — DMSS и SmartPSS. Оба удобны, но если на объекте уже стоит оборудование одного бренда (домофония, СКУД), логично оставаться в его экосистеме — единое приложение и меньше проблем с интеграцией.",
            "Аналитика. Hikvision продвигает AcuSense (фильтрация ложных тревог: человек/автомобиль) и ColorVu (цветная ночная съёмка), топовые серии — DeepinMind с распознаванием лиц. У Dahua аналоги — WizSense и WizMind с Full-Color: по функциям паритет, разница в деталях реализации и цене конкретной модели.",
            "Цена. В среднем сегменте Dahua чаще выигрывает по соотношению цена/характеристики, у Hikvision — самый широкий выбор нишевых решений (панорамные, взрывозащищённые, тепловизоры). На бюджетном уровне у обоих есть суббренды — HiLook и Imou.",
          ] },
          { h: "Что выбрать под задачу", p: [
            "Дом или небольшой офис: решает бюджет — смотрите HiLook/Imou либо младшие серии, разницы в надёжности практически нет. Магазин, склад, производство: берите серии с аналитикой (AcuSense/WizSense) — фильтрация ложных срабатываний экономит часы просмотра архива. Крупный объект с интеграцией СКУД и домофонии: выбирайте бренд, в экосистеме которого будет вся система, и закладывайте это в проект.",
            "Смешивать бренды можно — камеры работают по ONVIF с чужими регистраторами, — но умная аналитика полноценно раскрывается только в родной экосистеме. Поэтому наш совет: один объект — один бренд.",
          ] },
          { h: "Вывод", p: [
            "Неправильного выбора здесь нет: и Hikvision, и Dahua — надёжные рабочие лошадки. Правильный вопрос — не «какой бренд лучше», а «какая модель решает вашу задачу за ваш бюджет». Пришлите план объекта — подберём конфигурацию в обеих марках и покажете разницу в цифрах: и по цене, и по функциям.",
          ] },
        ],
      },
      uz: {
        title: "Hikvision yoki Dahua: videokuzatuv uchun qaysi birini tanlash",
        excerpt: "Videokuzatuvning ikki jahon yetakchisi — halol taqqoslash: ekotizimlar, analitika, narxlar va O'zbekistonda aniq vazifa uchun nimani tanlash.",
        sections: [
          { h: "Brendlar nimasi bilan o'xshash", p: [
            "Hikvision va Dahua — dunyodagi eng yirik videokuzatuv ishlab chiqaruvchilari bo'lib, tasvirning bazaviy sifati bo'yicha allaqachon teng: o'xshash matritsalar, IP67 himoya klasslari, byudjetdan professionalgacha liniyalar. Ikkala brend O'zbekistonda rasman mavjud, ikkalasiga zavod kafolati amal qiladi.",
            "SAT Solutions — Dahua Technology'ning avtorizatsiyalangan strategik integratori va Hikvision'ning rasmiy yetkazib beruvchisi: biz ikkala markani har kuni o'rnatamiz va ularning kuchli va zaif tomonlarini obyektlarda ko'ramiz.",
          ] },
          { h: "Amaliyotdagi asosiy farqlar", p: [
            "Ekotizim va ilovalar. Hikvision'da — Hik-Connect va iVMS, Dahua'da — DMSS va SmartPSS. Agar obyektda bitta brend uskunasi (domofon, SKUD) allaqachon bo'lsa, uning ekotizimida qolish mantiqiy — yagona ilova va integratsiya muammolari kamroq.",
            "Analitika. Hikvision AcuSense (yolg'on signallarni filtrlash: odam/avtomobil) va ColorVu (rangli tungi suratga olish) ni ilgari suradi, Dahua'da analoglar — WizSense va Full-Color bilan WizMind: funksiyalar bo'yicha paritet, farq aniq modelning narxi va detallari.",
            "Narx. O'rta segmentda Dahua narx/xususiyat nisbati bo'yicha ko'proq yutadi, Hikvision'da esa maxsus yechimlar tanlovi eng keng (panoramik, portlashdan himoyalangan, teplovizorlar). Byudjet darajasida ikkalasida sub-brendlar bor — HiLook va Imou.",
          ] },
          { h: "Vazifaga qarab nimani tanlash", p: [
            "Uy yoki kichik ofis: byudjet hal qiladi — HiLook/Imou yoki kichik seriyalarni ko'ring. Do'kon, ombor, ishlab chiqarish: analitikali seriyalarni oling (AcuSense/WizSense) — yolg'on signallarni filtrlash arxivni ko'rish soatlarini tejaydi. SKUD va domofon bilan integratsiyalangan yirik obyekt: butun tizim bo'ladigan ekotizim brendini tanlang.",
            "Brendlarni aralashtirish mumkin — kameralar ONVIF orqali begona registratorlar bilan ishlaydi, — lekin aqlli analitika faqat o'z ekotizimida to'liq ochiladi. Shuning uchun maslahatimiz: bitta obyekt — bitta brend.",
          ] },
          { h: "Xulosa", p: [
            "Bu yerda noto'g'ri tanlov yo'q: Hikvision ham, Dahua ham ishonchli. To'g'ri savol — «qaysi brend yaxshiroq» emas, «qaysi model sizning vazifangizni sizning byudjetingizda hal qiladi». Obyekt rejasini yuboring — ikkala markada konfiguratsiya tanlab, farqni raqamlarda ko'rsatamiz.",
          ] },
        ],
      },
      en: {
        title: "Hikvision vs Dahua: Which to Choose for Video Surveillance",
        excerpt: "Two global CCTV leaders compared honestly: ecosystems, analytics, pricing — and which one fits your project in Uzbekistan.",
        sections: [
          { h: "What the brands have in common", p: [
            "Hikvision and Dahua are the world's two largest CCTV manufacturers, and in basic image quality they have long been on par: comparable sensors, similar housings, IP67 protection and product lines from budget to professional. Both brands are officially represented in Uzbekistan with full factory warranty.",
            "SAT Solutions is an authorized strategic integrator of Dahua Technology and an official Hikvision supplier: we install both brands daily and see their strengths and weaknesses on real sites, not in brochures.",
          ] },
          { h: "Key differences in practice", p: [
            "Ecosystem and apps. Hikvision has Hik-Connect and iVMS; Dahua has DMSS and SmartPSS. Both are convenient, but if a site already runs one brand's equipment (intercoms, access control), staying in its ecosystem means one app and fewer integration issues.",
            "Analytics. Hikvision promotes AcuSense (false-alarm filtering: human/vehicle) and ColorVu (full-color night vision); top series feature DeepinMind facial recognition. Dahua's counterparts are WizSense and WizMind with Full-Color: feature parity overall, with differences in implementation details and per-model pricing.",
            "Price. In the mid-range Dahua often wins on price-to-spec ratio, while Hikvision offers the widest choice of niche solutions (panoramic, explosion-proof, thermal). At entry level both have sub-brands — HiLook and Imou.",
          ] },
          { h: "What to choose for your task", p: [
            "Home or small office: budget decides — look at HiLook/Imou or junior series; reliability is practically identical. Shop, warehouse, production: take analytics series (AcuSense/WizSense) — false-alarm filtering saves hours of archive review. Large site with access control and intercom integration: pick the brand whose ecosystem will host the whole system.",
            "Mixing brands is possible — cameras work with third-party recorders via ONVIF — but smart analytics only unfolds fully inside its native ecosystem. Our advice: one site — one brand.",
          ] },
          { h: "Conclusion", p: [
            "There is no wrong choice here: both Hikvision and Dahua are reliable workhorses. The right question is not \"which brand is better\" but \"which model solves your task within your budget\". Send us your site plan — we will spec both brands and show you the difference in numbers.",
          ] },
        ],
      },
      tr: {
        title: "Hikvision mi Dahua mı: Video Gözetim İçin Hangisi",
        excerpt: "İki küresel CCTV liderinin dürüst karşılaştırması: ekosistemler, analitik, fiyatlar — Özbekistan'daki projeniz için hangisi uygun.",
        sections: [
          { h: "Markaların ortak yönleri", p: [
            "Hikvision ve Dahua dünyanın en büyük iki CCTV üreticisidir ve temel görüntü kalitesinde uzun süredir başa baştır: benzer sensörler, IP67 koruma, bütçeden profesyonele uzanan seriler. Her iki marka da Özbekistan'da resmî olarak temsil edilmekte ve fabrika garantisi vermektedir.",
            "SAT Solutions, Dahua Technology'nin yetkili stratejik entegratörü ve resmî Hikvision tedarikçisidir: iki markayı da her gün kuruyor, güçlü ve zayıf yönlerini broşürlerden değil sahadan biliyoruz.",
          ] },
          { h: "Pratikteki temel farklar", p: [
            "Ekosistem ve uygulamalar. Hikvision'da Hik-Connect ve iVMS, Dahua'da DMSS ve SmartPSS var. Sahada zaten bir markanın ekipmanı varsa (interkom, geçiş kontrolü) onun ekosisteminde kalmak tek uygulama ve daha az entegrasyon sorunu demektir.",
            "Analitik. Hikvision AcuSense (yanlış alarm filtreleme) ve ColorVu (renkli gece görüşü) sunar; üst serilerde DeepinMind yüz tanıma vardır. Dahua'nın karşılıkları WizSense ve Full-Color'lı WizMind: özelliklerde denklik, fark model bazındaki fiyat ve detaylarda.",
            "Fiyat. Orta segmentte Dahua fiyat/özellik oranında çoğu kez öndedir; Hikvision ise niş çözümlerde (panoramik, exproof, termal) en geniş seçeneği sunar. Giriş seviyesinde iki markanın da alt markaları var: HiLook ve Imou.",
          ] },
          { h: "Göreve göre seçim", p: [
            "Ev veya küçük ofis: bütçe belirler — HiLook/Imou veya alt serilere bakın. Mağaza, depo, üretim: analitikli serileri alın — yanlış alarm filtreleme arşiv incelemede saatler kazandırır. Geçiş kontrolü ve interkom entegrasyonlu büyük saha: tüm sistemin çalışacağı ekosistemin markasını seçin.",
            "Markaları karıştırmak mümkün — kameralar ONVIF ile üçüncü taraf kayıt cihazlarıyla çalışır — ancak akıllı analitik yalnızca kendi ekosisteminde tam açılır. Önerimiz: bir saha — bir marka.",
          ] },
          { h: "Sonuç", p: [
            "Burada yanlış seçim yok: Hikvision da Dahua da güvenilirdir. Doğru soru \"hangi marka daha iyi\" değil, \"hangi model görevi bütçenizde çözer\". Saha planınızı gönderin — iki markada da konfigürasyon çıkarıp farkı rakamlarla gösterelim.",
          ] },
        ],
      },
      zh: {
        title: "海康威视还是大华：视频监控该选哪个品牌",
        excerpt: "两大全球监控领导品牌的诚实对比：生态系统、智能分析、价格——在乌兹别克斯坦您的项目该选哪个。",
        sections: [
          { h: "两个品牌的相同之处", p: [
            "海康威视（Hikvision）和大华（Dahua）是全球最大的两家视频监控制造商，基础画质早已不相上下：传感器相当、IP67防护、从入门到专业的完整产品线。两个品牌在乌兹别克斯坦均有官方代表并提供原厂保修。",
            "SAT Solutions 是大华科技的授权战略集成商，同时也是海康威视的官方供应商：我们每天都在安装这两个品牌，对其优缺点的了解来自实际工程而非宣传册。",
          ] },
          { h: "实际使用中的关键差异", p: [
            "生态与应用。海康威视有 Hik-Connect 和 iVMS，大华有 DMSS 和 SmartPSS。如果现场已有某品牌设备（对讲、门禁），留在其生态内意味着统一应用、更少的对接问题。",
            "智能分析。海康威视主打 AcuSense（人车过滤误报）和 ColorVu（全彩夜视），高端系列有 DeepinMind 人脸识别；大华对应 WizSense 和带全彩的 WizMind：功能大体相当，差异在具体型号的实现和价格。",
            "价格。中端市场大华的性价比往往更高，而海康威视的细分产品线最全（全景、防爆、热成像）。入门级两家都有子品牌——HiLook 和 Imou。",
          ] },
          { h: "按任务如何选择", p: [
            "家庭或小型办公室：预算决定——看 HiLook/Imou 或入门系列即可。商店、仓库、工厂：选带智能分析的系列——误报过滤能节省大量查录像时间。需要门禁和对讲集成的大型项目：选择整个系统所在生态的品牌。",
            "混用品牌可行——摄像机可通过 ONVIF 接入第三方录像机——但智能分析只有在原生生态中才能完全发挥。我们的建议：一个项目——一个品牌。",
          ] },
          { h: "结论", p: [
            "这里没有错误的选择：海康威视和大华都是可靠的主力。正确的问题不是“哪个品牌更好”，而是“哪个型号在您的预算内解决您的任务”。把项目平面图发给我们——我们按两个品牌分别配置，用数字给您看差异。",
          ] },
        ],
      },
    },
  },
  {
    slug: "ip-ili-analogovaya-kamera",
    date: "2026-07-19",
    related: ["cctv"],
    loc: {
      ru: {
        title: "IP или аналоговая камера (HDCVI): что выбрать",
        excerpt: "Цифровое и аналоговое видеонаблюдение в 2026 году: реальные плюсы и минусы, когда переплата за IP оправдана, а когда HDCVI — разумный выбор.",
        sections: [
          { h: "В чём разница технически", p: [
            "IP-камера — самостоятельное сетевое устройство: сжимает видео сама и передаёт его по витой паре, питание чаще всего по тому же кабелю (PoE). Аналоговая камера современного стандарта HDCVI/TVI/AHD передаёт сигнал по коаксиальному кабелю на видеорегистратор (DVR/XVR), который и занимается оцифровкой и записью.",
            "Миф «аналог — это мыльные 480p» устарел: современные HDCVI-камеры дают 2–8 мегапикселей, то есть Full HD и выше по обычному коаксиалу.",
          ] },
          { h: "Плюсы и минусы каждой технологии", p: [
            "IP: разрешение до 4K и выше, питание PoE одним кабелем, встроенная аналитика (детекция людей/авто, лица), гибкое масштабирование и удалённый доступ без ограничений. Минусы — цена выше, нужна грамотно построенная сеть, а при большом количестве камер — PoE-коммутаторы и правильная пропускная способность.",
            "Аналог (HDCVI): заметно дешевле на камеру, проще в настройке, работает по уже проложенному коаксиалу — идеален при модернизации старой системы без замены проводки, сигнал идёт до 500 м без активного оборудования. Минусы — аналитика беднее, разрешение упирается в 8MP, каждая камера требует отдельного питания 12В.",
          ] },
          { h: "Когда что выбирать", p: [
            "Новый объект с нуля — почти всегда IP: прокладываете витую пару, ставите PoE-коммутатор, получаете запас на годы и полноценную аналитику. Модернизация старой аналоговой системы — HDCVI: меняете камеры и регистратор, кабели остаются, бюджет в 1,5–2 раза ниже. Смешанный случай — гибридный XVR-регистратор: принимает и аналоговые, и IP-камеры, позволяя переходить на цифру поэтапно.",
          ] },
          { h: "Вывод", p: [
            "Технология — не религия, а инструмент под бюджет и состояние объекта. Мы монтируем и то и другое: пришлите фото объекта или план — посчитаем оба варианта, и вы сравните не абстракции, а конкретные сметы.",
          ] },
        ],
      },
      uz: {
        title: "IP yoki analog kamera (HDCVI): nimani tanlash",
        excerpt: "2026 yilda raqamli va analog videokuzatuv: haqiqiy afzallik va kamchiliklar, IP uchun qo'shimcha to'lov qachon oqlanadi, HDCVI qachon oqilona tanlov.",
        sections: [
          { h: "Texnik farq nimada", p: [
            "IP-kamera — mustaqil tarmoq qurilmasi: videoni o'zi siqadi va o'ralgan juftlik orqali uzatadi, quvvat ko'pincha o'sha kabel orqali (PoE). Zamonaviy HDCVI/TVI/AHD standartidagi analog kamera signalni koaksial kabel orqali videoregistratorga (DVR/XVR) uzatadi.",
            "«Analog — xira 480p» degan afsona eskirgan: zamonaviy HDCVI-kameralar oddiy koaksial orqali 2–8 megapiksel, ya'ni Full HD va undan yuqori beradi.",
          ] },
          { h: "Har bir texnologiyaning afzallik va kamchiliklari", p: [
            "IP: 4K gacha va undan yuqori aniqlik, bitta kabel bilan PoE quvvat, o'rnatilgan analitika (odam/avto detektsiyasi, yuzlar), moslashuvchan masshtablash. Kamchiliklari — narx yuqoriroq, to'g'ri qurilgan tarmoq kerak.",
            "Analog (HDCVI): kameraga sezilarli arzonroq, sozlash oddiyroq, allaqachon yotqizilgan koaksial orqali ishlaydi — simlarni almashtirmasdan eski tizimni modernizatsiya qilishda ideal, signal aktiv uskunasiz 500 m gacha boradi. Kamchiliklari — analitika kambag'alroq, har bir kamera alohida 12V quvvat talab qiladi.",
          ] },
          { h: "Qachon nimani tanlash", p: [
            "Noldan yangi obyekt — deyarli har doim IP: o'ralgan juftlik yotqizasiz, PoE-kommutator qo'yasiz, yillarga zaxira va to'liq analitika olasiz. Eski analog tizimni yangilash — HDCVI: kamera va registratorni almashtirasiz, kabellar qoladi, byudjet 1,5–2 barobar past. Aralash holat — gibrid XVR-registrator: ham analog, ham IP-kameralarni qabul qiladi.",
          ] },
          { h: "Xulosa", p: [
            "Texnologiya — din emas, byudjet va obyekt holatiga mos vosita. Biz ikkalasini ham o'rnatamiz: obyekt suratini yoki rejasini yuboring — ikkala variantni hisoblaymiz, siz esa mavhumlikni emas, aniq smetalarni taqqoslaysiz.",
          ] },
        ],
      },
      en: {
        title: "IP or Analog (HDCVI) Camera: Which to Choose",
        excerpt: "Digital vs analog CCTV in 2026: real pros and cons, when paying extra for IP is justified — and when HDCVI is the smart choice.",
        sections: [
          { h: "The technical difference", p: [
            "An IP camera is a standalone network device: it compresses video itself and sends it over twisted pair, usually powered through the same cable (PoE). A modern analog camera (HDCVI/TVI/AHD) sends its signal over coax to a DVR/XVR recorder, which digitizes and stores it.",
            "The myth that \"analog means blurry 480p\" is outdated: modern HDCVI cameras deliver 2–8 megapixels — Full HD and above over ordinary coax.",
          ] },
          { h: "Pros and cons of each technology", p: [
            "IP: resolution up to 4K and beyond, single-cable PoE power, built-in analytics (human/vehicle detection, faces), flexible scaling and unrestricted remote access. Downsides — higher price and the need for a properly built network.",
            "Analog (HDCVI): noticeably cheaper per camera, simpler to set up, runs over existing coax — ideal when upgrading an old system without rewiring; the signal travels up to 500 m without active equipment. Downsides — poorer analytics, resolution capped around 8MP, and each camera needs its own 12V power.",
          ] },
          { h: "When to choose which", p: [
            "A brand-new site — almost always IP: lay twisted pair, install a PoE switch, and you get headroom for years plus full analytics. Upgrading an old analog system — HDCVI: replace cameras and the recorder, keep the cabling, and the budget is 1.5–2× lower. Mixed case — a hybrid XVR recorder accepts both analog and IP cameras, letting you migrate gradually.",
          ] },
          { h: "Conclusion", p: [
            "Technology is not a religion — it is a tool matched to your budget and the state of the site. We install both: send a photo or plan of your site and we will price both options, so you compare real estimates, not abstractions.",
          ] },
        ],
      },
      tr: {
        title: "IP mi Analog (HDCVI) Kamera mı: Hangisini Seçmeli",
        excerpt: "2026'da dijital ve analog gözetim: gerçek artılar ve eksiler, IP'ye ek ödeme ne zaman mantıklı, HDCVI ne zaman akıllıca seçim.",
        sections: [
          { h: "Teknik fark nedir", p: [
            "IP kamera bağımsız bir ağ cihazıdır: videoyu kendisi sıkıştırır ve bükümlü çift üzerinden gönderir; güç çoğunlukla aynı kablodan gelir (PoE). Modern analog kamera (HDCVI/TVI/AHD) sinyali koaksiyel kabloyla DVR/XVR kayıt cihazına iletir.",
            "\"Analog bulanık 480p demektir\" efsanesi eskidi: modern HDCVI kameralar sıradan koaksiyel üzerinden 2–8 megapiksel, yani Full HD ve üzeri sunar.",
          ] },
          { h: "Her teknolojinin artıları ve eksileri", p: [
            "IP: 4K ve üzeri çözünürlük, tek kabloyla PoE güç, yerleşik analitik (insan/araç algılama, yüzler), esnek ölçekleme ve sınırsız uzak erişim. Eksiler — daha yüksek fiyat ve düzgün kurulmuş bir ağ gereksinimi.",
            "Analog (HDCVI): kamera başına belirgin şekilde ucuz, kurulumu basit, mevcut koaksiyel üzerinde çalışır — kablolamayı değiştirmeden eski sistemi yenilerken idealdir; sinyal aktif ekipman olmadan 500 m'ye kadar gider. Eksiler — analitik zayıf, her kameraya ayrı 12V güç gerekir.",
          ] },
          { h: "Ne zaman hangisi", p: [
            "Sıfırdan yeni saha — neredeyse her zaman IP: bükümlü çift çekin, PoE switch koyun, yıllarca yedek kapasite ve tam analitik kazanın. Eski analog sistemi yenileme — HDCVI: kamera ve kayıt cihazını değiştirin, kablolar kalsın; bütçe 1,5–2 kat düşer. Karma durum — hibrit XVR hem analog hem IP kameraları kabul eder, kademeli geçiş sağlar.",
          ] },
          { h: "Sonuç", p: [
            "Teknoloji din değil, bütçeye ve sahanın durumuna göre seçilen bir araçtır. İkisini de kuruyoruz: sahanızın fotoğrafını veya planını gönderin, iki seçeneği de fiyatlandıralım — soyutlamaları değil somut teklifleri karşılaştırın.",
          ] },
        ],
      },
      zh: {
        title: "IP摄像机还是模拟（HDCVI）摄像机：如何选择",
        excerpt: "2026年数字与模拟监控对比：真实的优缺点，什么时候值得为IP多花钱，什么时候HDCVI才是明智之选。",
        sections: [
          { h: "技术上的区别", p: [
            "IP摄像机是独立的网络设备：自行压缩视频并通过网线传输，供电通常也走同一根线（PoE）。现代模拟摄像机（HDCVI/TVI/AHD）则通过同轴电缆把信号送到DVR/XVR录像机，由后者负责数字化和存储。",
            "“模拟就是模糊的480p”早已过时：现代HDCVI摄像机通过普通同轴电缆即可输出2–800万像素，即Full HD及以上。",
          ] },
          { h: "两种技术的优缺点", p: [
            "IP：分辨率可达4K以上，PoE一线供电，内置智能分析（人车检测、人脸），扩展灵活、远程访问无限制。缺点——价格更高，且需要正确搭建的网络。",
            "模拟（HDCVI）：单台成本明显更低、设置简单、可沿用旧同轴线——旧系统改造不换线时的理想选择，信号无需有源设备可传500米。缺点——分析功能弱，分辨率上限约800万，每台摄像机需单独12V供电。",
          ] },
          { h: "什么场景选什么", p: [
            "全新项目——几乎总是IP：布网线、装PoE交换机，获得多年余量和完整分析功能。旧模拟系统改造——HDCVI：只换摄像机和录像机，线缆保留，预算低1.5–2倍。混合场景——XVR混合录像机同时接模拟和IP摄像机，可分步过渡。",
          ] },
          { h: "结论", p: [
            "技术不是信仰，而是匹配预算和现场条件的工具。两种我们都安装：把现场照片或平面图发给我们，两个方案都报价——您比较的将是具体预算，而非抽象概念。",
          ] },
        ],
      },
    },
  },
  {
    slug: "zkteco-vs-hikvision-biometriya",
    date: "2026-07-19",
    related: ["access", "attendance"],
    loc: {
      ru: {
        title: "ZKTeco или Hikvision: биометрия для СКУД и учёта времени",
        excerpt: "Сравниваем биометрические терминалы двух брендов: отпечаток, лицо, учёт рабочего времени и интеграция — что выбрать для проходной и офиса.",
        sections: [
          { h: "Сильные стороны ZKTeco", p: [
            "ZKTeco — специалист именно по биометрии: компания выросла из алгоритмов распознавания отпечатков и делает самые доступные терминалы с мультибиометрией — отпечаток, лицо, ладонь, карта в одном устройстве. Для задач учёта рабочего времени это фактически стандарт: терминалы дружат с ПО ZKBio, отчёты по приходам-уходам собираются из коробки, а цена решения на проходную из 1–2 дверей минимальна.",
          ] },
          { h: "Сильные стороны Hikvision", p: [
            "Hikvision берёт экосистемой: терминалы распознавания лиц серии MinMoe используют те же камерные технологии, что и видеонаблюдение бренда, и управляются из той же платформы. Если на объекте уже стоят камеры и домофония Hikvision — добавление СКУД в единую систему (один сервер, одно приложение, сквозные события «лицо + видео») делает выбор очевидным. Распознавание лиц на терминалах MinMoe быстрое и уверенно работает в сложном освещении.",
          ] },
          { h: "Как выбрать под задачу", p: [
            "Нужен учёт рабочего времени и недорогая проходная — ZKTeco: дешевле, быстрее внедряется, отчёты для бухгалтерии сразу. Нужна единая система безопасности с видео, СКУД и домофонией — Hikvision: дороже на старте, но один подрядчик, одна платформа и меньше «зоопарка» в обслуживании.",
            "Важный практический момент — интеграция с 1С и кадровыми системами: обе марки интегрируются, но состав работ отличается, поэтому требования к отчётам стоит зафиксировать до выбора железа, а не после.",
          ] },
          { h: "Вывод", p: [
            "ZKTeco — про биометрию и учёт времени за разумные деньги, Hikvision — про единую экосистему безопасности. Мы внедряем обе марки, включая интеграцию с 1С и зарплатными модулями: расскажите, какие отчёты и сценарии прохода вам нужны — предложим конфигурацию в двух вариантах с ценами.",
          ] },
        ],
      },
      uz: {
        title: "ZKTeco yoki Hikvision: SKUD va ish vaqtini hisobga olish uchun biometriya",
        excerpt: "Ikki brendning biometrik terminallarini taqqoslaymiz: barmoq izi, yuz, ish vaqtini hisobga olish va integratsiya — o'tish joyi va ofis uchun nimani tanlash.",
        sections: [
          { h: "ZKTeco'ning kuchli tomonlari", p: [
            "ZKTeco — aynan biometriya bo'yicha mutaxassis: kompaniya barmoq izlarini aniqlash algoritmlaridan o'sib chiqqan va multibiometriyali eng arzon terminallarni ishlab chiqaradi — barmoq izi, yuz, kaft, karta bitta qurilmada. Ish vaqtini hisobga olish vazifalari uchun bu amalda standart: terminallar ZKBio dasturi bilan ishlaydi, kelish-ketish hisobotlari darhol yig'iladi, 1–2 eshikli o'tish joyi yechimining narxi minimal.",
          ] },
          { h: "Hikvision'ning kuchli tomonlari", p: [
            "Hikvision ekotizim bilan yutadi: MinMoe seriyasidagi yuz tanish terminallari brend videokuzatuvidagi kamera texnologiyalaridan foydalanadi va o'sha platformadan boshqariladi. Agar obyektda Hikvision kameralari va domofoniyasi allaqachon bo'lsa — SKUDni yagona tizimga qo'shish (bitta server, bitta ilova, «yuz + video» o'zaro hodisalari) tanlovni ochiq-oydin qiladi.",
          ] },
          { h: "Vazifaga qarab qanday tanlash", p: [
            "Ish vaqtini hisobga olish va arzon o'tish joyi kerak — ZKTeco: arzonroq, tezroq joriy etiladi, buxgalteriya uchun hisobotlar darhol. Video, SKUD va domofoniya bilan yagona xavfsizlik tizimi kerak — Hikvision: boshida qimmatroq, lekin bitta pudratchi, bitta platforma.",
            "Muhim amaliy jihat — 1C va kadr tizimlari bilan integratsiya: ikkala marka ham integratsiyalanadi, lekin ishlar tarkibi farq qiladi, shuning uchun hisobot talablarini uskuna tanlashdan OLDIN belgilash kerak.",
          ] },
          { h: "Xulosa", p: [
            "ZKTeco — oqilona pulga biometriya va vaqt hisobi haqida, Hikvision — yagona xavfsizlik ekotizimi haqida. Biz ikkala markani, shu jumladan 1C va ish haqi modullari bilan integratsiyani joriy etamiz: qanday hisobot va o'tish stsenariylari kerakligini ayting — narxlari bilan ikki variantda konfiguratsiya taklif qilamiz.",
          ] },
        ],
      },
      en: {
        title: "ZKTeco or Hikvision: Biometrics for Access Control and Time Attendance",
        excerpt: "Comparing biometric terminals from both brands: fingerprint, face, time attendance and integration — what to pick for your entrance and office.",
        sections: [
          { h: "ZKTeco's strengths", p: [
            "ZKTeco is a biometrics specialist: the company grew out of fingerprint-recognition algorithms and makes the most affordable multi-biometric terminals — fingerprint, face, palm and card in one device. For time-attendance tasks it is a de-facto standard: terminals pair with ZKBio software, check-in/check-out reports work out of the box, and a 1–2-door entrance solution costs a minimum.",
          ] },
          { h: "Hikvision's strengths", p: [
            "Hikvision wins on ecosystem: MinMoe face-recognition terminals use the same camera technology as the brand's CCTV and are managed from the same platform. If your site already runs Hikvision cameras and intercoms, adding access control to a single system — one server, one app, cross-linked \"face + video\" events — makes the choice obvious. MinMoe recognition is fast and reliable even in difficult lighting.",
          ] },
          { h: "How to choose for your task", p: [
            "Need time attendance and an affordable entrance — ZKTeco: cheaper, faster to deploy, accounting-ready reports immediately. Need a unified security system with video, access control and intercoms — Hikvision: pricier at the start, but one contractor, one platform and less of a \"zoo\" to maintain.",
            "One practical point — integration with 1C and HR systems: both brands integrate, but the scope of work differs, so lock down your reporting requirements before choosing hardware, not after.",
          ] },
          { h: "Conclusion", p: [
            "ZKTeco is about biometrics and time tracking for sensible money; Hikvision is about a unified security ecosystem. We deploy both, including 1C and payroll integration: tell us which reports and entry scenarios you need — we will propose two configurations with prices.",
          ] },
        ],
      },
      tr: {
        title: "ZKTeco mu Hikvision mı: Geçiş Kontrolü ve Mesai Takibi İçin Biyometri",
        excerpt: "İki markanın biyometrik terminallerinin karşılaştırması: parmak izi, yüz, mesai takibi ve entegrasyon — giriş ve ofis için hangisi.",
        sections: [
          { h: "ZKTeco'nun güçlü yönleri", p: [
            "ZKTeco tam anlamıyla biyometri uzmanıdır: şirket parmak izi tanıma algoritmalarından doğdu ve en uygun fiyatlı çoklu-biyometrik terminalleri üretiyor — parmak izi, yüz, avuç içi ve kart tek cihazda. Mesai takibi için fiilî standarttır: terminaller ZKBio yazılımıyla çalışır, giriş-çıkış raporları kutudan çıkar, 1–2 kapılı giriş çözümünün maliyeti minimumdur.",
          ] },
          { h: "Hikvision'ın güçlü yönleri", p: [
            "Hikvision ekosistemle kazanır: MinMoe yüz tanıma terminalleri markanın CCTV kamera teknolojisini kullanır ve aynı platformdan yönetilir. Sahada zaten Hikvision kameraları ve interkomları varsa, geçiş kontrolünü tek sisteme eklemek — tek sunucu, tek uygulama, \"yüz + video\" çapraz olayları — seçimi açık hale getirir.",
          ] },
          { h: "Göreve göre seçim", p: [
            "Mesai takibi ve uygun fiyatlı giriş gerekiyorsa — ZKTeco: daha ucuz, daha hızlı devreye alınır, muhasebe raporları hazırdır. Video, geçiş kontrolü ve interkomlu bütünleşik güvenlik sistemi gerekiyorsa — Hikvision: başlangıçta daha pahalı ama tek yüklenici, tek platform.",
            "Pratik bir nokta — 1C ve İK sistemleriyle entegrasyon: iki marka da entegre olur ancak iş kapsamı farklıdır; rapor gereksinimlerini donanım seçiminden ÖNCE netleştirin.",
          ] },
          { h: "Sonuç", p: [
            "ZKTeco makul paraya biyometri ve mesai takibi; Hikvision bütünleşik güvenlik ekosistemi demektir. İkisini de kuruyoruz, 1C ve bordro entegrasyonu dahil: hangi raporlara ve geçiş senaryolarına ihtiyacınız olduğunu söyleyin — fiyatlarıyla iki konfigürasyon önerelim.",
          ] },
        ],
      },
      zh: {
        title: "中控智慧还是海康威视：门禁与考勤的生物识别方案",
        excerpt: "对比两个品牌的生物识别终端：指纹、人脸、考勤与系统集成——门禁通道和办公室该选哪家。",
        sections: [
          { h: "中控智慧（ZKTeco）的优势", p: [
            "ZKTeco是纯粹的生物识别专家：公司起家于指纹识别算法，生产性价比最高的多模态终端——指纹、人脸、掌纹、刷卡集于一机。在考勤场景它几乎是行业标准：终端配套ZKBio软件，上下班报表开箱即用，1–2门的通道方案成本最低。",
          ] },
          { h: "海康威视的优势", p: [
            "海康威视胜在生态：MinMoe人脸识别终端采用与其监控摄像机相同的成像技术，并在同一平台统一管理。如果现场已有海康的摄像机和对讲系统，把门禁并入同一系统——一台服务器、一个应用、“人脸+视频”事件联动——选择就不言自明。MinMoe在复杂光线下识别快速且稳定。",
          ] },
          { h: "按任务如何选择", p: [
            "需要考勤和经济型通道——选ZKTeco：更便宜、部署更快、财务报表即刻可用。需要视频、门禁、对讲一体的统一安防系统——选海康威视：起步贵一些，但只有一个承包商、一个平台，维护更省心。",
            "一个实用要点——与1C及人事系统的集成：两家都能对接，但工作量不同，因此报表需求要在选硬件之前敲定，而不是之后。",
          ] },
          { h: "结论", p: [
            "ZKTeco代表花合理的钱做生物识别和考勤；海康威视代表统一的安防生态。两个品牌我们都做，包括1C和工资模块对接：告诉我们您需要哪些报表和通行场景——我们给出两套带价格的配置方案。",
          ] },
        ],
      },
    },
  },
  {
    slug: "poe-kommutator-ili-bloki-pitaniya",
    date: "2026-07-19",
    related: ["cctv", "network"],
    loc: {
      ru: {
        title: "PoE-коммутатор или блоки питания для камер: что практичнее",
        excerpt: "Два способа запитать IP-камеры — считаем экономику и надёжность: когда достаточно блоков питания 12В, а когда PoE окупается с первого дня.",
        sections: [
          { h: "Как питаются IP-камеры", p: [
            "Вариант первый: классический блок питания 12В возле каждой камеры плюс отдельный кабель питания. Вариант второй: PoE (Power over Ethernet, стандарты 802.3af/at) — питание и данные идут по одной витой паре от PoE-коммутатора, до 100 метров без дополнительных проводов и розеток.",
          ] },
          { h: "Экономика и надёжность", p: [
            "На одну-две камеры блоки питания дешевле: сам БП стоит копейки, а простенький коммутатор без PoE — тоже. Но уже с 3–4 камер экономика переворачивается: каждому БП нужна розетка рядом с камерой (а это монтаж электрики), каждый БП — отдельная точка отказа, и зарезервировать их от отключений света по отдельности почти нереально.",
            "PoE решает всё это одним узлом: коммутатор стоит в шкафу, к нему один ИБП — и вся система видеонаблюдения переживает отключение электричества целиком. Диагностика тоже проще: перезагрузить зависшую камеру можно удалённо, выключив-включив PoE на порту, а не поездкой на объект к её блоку питания.",
          ] },
          { h: "Считаем на примере 8 камер", p: [
            "Вариант с БП: 8 блоков питания, 8 розеток (монтаж!), простой коммутатор, ИБП поставить практически некуда. Вариант с PoE: один PoE-коммутатор на 8+ портов, один ИБП в шкафу, ноль дополнительных розеток. По деньгам разница на старте небольшая, а по стоимости владения PoE выигрывает: меньше точек отказа, резервирование в одном месте, удалённое управление.",
            "Единственное, что важно посчитать заранее, — бюджет мощности PoE: сумма потребления всех камер (обычные — 5–7 Вт, PTZ и с подогревом — 15–25 Вт) должна укладываться в бюджет коммутатора с запасом 20–30%.",
          ] },
          { h: "Вывод", p: [
            "До 2–3 камер на готовых розетках — блоки питания допустимы. От 3–4 камер и в любой системе, которая должна работать при отключении света, — PoE без вариантов. Поможем подобрать PoE-коммутатор под ваше количество камер и посчитать бюджет мощности — напишите нам в чат или Telegram.",
          ] },
        ],
      },
      uz: {
        title: "PoE-kommutator yoki quvvat bloklari: kameralar uchun nima amaliyroq",
        excerpt: "IP-kameralarni quvvatlashning ikki usuli — iqtisod va ishonchlilikni hisoblaymiz: qachon 12V bloklar yetarli, qachon PoE birinchi kundan o'zini oqlaydi.",
        sections: [
          { h: "IP-kameralar qanday quvvatlanadi", p: [
            "Birinchi variant: har bir kamera yonida klassik 12V quvvat bloki va alohida quvvat kabeli. Ikkinchi variant: PoE (Power over Ethernet, 802.3af/at standartlari) — quvvat va ma'lumotlar PoE-kommutatordan bitta o'ralgan juftlik orqali boradi, qo'shimcha simlar va rozetkalarsiz 100 metrgacha.",
          ] },
          { h: "Iqtisod va ishonchlilik", p: [
            "Bir-ikki kameraga quvvat bloklari arzonroq. Lekin 3–4 kameradan boshlab iqtisod ag'dariladi: har bir blokka kamera yonida rozetka kerak (bu elektrik montaji), har bir blok — alohida nosozlik nuqtasi, ularni svet o'chishidan alohida-alohida himoyalash deyarli imkonsiz.",
            "PoE bularning barchasini bitta tugun bilan hal qiladi: kommutator shkafda turadi, unga bitta UPS — butun videokuzatuv tizimi elektr uzilishini to'liq boshdan kechiradi. Diagnostika ham oddiyroq: qotib qolgan kamerani portdagi PoE'ni o'chirib-yoqib masofadan qayta yuklash mumkin.",
          ] },
          { h: "8 kamera misolida hisoblaymiz", p: [
            "Bloklar bilan: 8 quvvat bloki, 8 rozetka (montaj!), oddiy kommutator, UPS qo'yishga deyarli joy yo'q. PoE bilan: 8+ portli bitta PoE-kommutator, shkafda bitta UPS, nol qo'shimcha rozetka. Boshida puldagi farq katta emas, egalik qiymati bo'yicha PoE yutadi: nosozlik nuqtalari kamroq, zaxiralash bir joyda.",
            "Oldindan hisoblash muhim bo'lgan yagona narsa — PoE quvvat byudjeti: barcha kameralar iste'moli yig'indisi (oddiylari — 5–7 Vt, PTZ va isitgichlilari — 15–25 Vt) kommutator byudjetiga 20–30% zaxira bilan sig'ishi kerak.",
          ] },
          { h: "Xulosa", p: [
            "Tayyor rozetkalarda 2–3 kameragacha — quvvat bloklari joiz. 3–4 kameradan boshlab va svet o'chganda ishlashi kerak bo'lgan har qanday tizimda — variantsiz PoE. Kameralaringiz soniga mos PoE-kommutator tanlash va quvvat byudjetini hisoblashda yordam beramiz — chat yoki Telegram orqali yozing.",
          ] },
        ],
      },
      en: {
        title: "PoE Switch or Power Supplies for Cameras: What Works Better",
        excerpt: "Two ways to power IP cameras — economics and reliability compared: when 12V supplies are enough and when PoE pays off from day one.",
        sections: [
          { h: "How IP cameras get power", p: [
            "Option one: a classic 12V power supply next to each camera plus a separate power cable. Option two: PoE (Power over Ethernet, 802.3af/at) — power and data travel over one twisted pair from a PoE switch, up to 100 meters with no extra wiring or outlets.",
          ] },
          { h: "Economics and reliability", p: [
            "For one or two cameras, power supplies are cheaper. But from 3–4 cameras the economics flips: every supply needs an outlet next to its camera (that means electrical work), every supply is a separate point of failure, and backing them up individually against blackouts is nearly impossible.",
            "PoE solves all of that with one node: the switch sits in a cabinet with a single UPS — and the whole CCTV system survives a power cut. Diagnostics get easier too: a frozen camera can be rebooted remotely by cycling PoE on its port instead of driving to the site.",
          ] },
          { h: "An example with 8 cameras", p: [
            "With supplies: 8 PSUs, 8 outlets (installation!), a basic switch, and almost nowhere to fit a UPS. With PoE: one 8+ port PoE switch, one UPS in the cabinet, zero extra outlets. Upfront cost is similar; total cost of ownership favors PoE: fewer failure points, backup in one place, remote management.",
            "The one thing to calculate in advance is the PoE power budget: the sum of all cameras' consumption (regular — 5–7 W, PTZ and heated — 15–25 W) must fit the switch's budget with 20–30% headroom.",
          ] },
          { h: "Conclusion", p: [
            "Up to 2–3 cameras with outlets already in place — power supplies are acceptable. From 3–4 cameras, and in any system that must survive blackouts, — PoE, no question. We will help you pick a PoE switch for your camera count and calculate the power budget — message us in chat or Telegram.",
          ] },
        ],
      },
      tr: {
        title: "PoE Switch mü Adaptör mü: Kameralar İçin Hangisi Pratik",
        excerpt: "IP kameraları beslemenin iki yolu — ekonomi ve güvenilirlik: 12V adaptörler ne zaman yeterli, PoE ne zaman ilk günden kendini amorti eder.",
        sections: [
          { h: "IP kameralar nasıl beslenir", p: [
            "Birinci seçenek: her kameranın yanında klasik 12V adaptör ve ayrı güç kablosu. İkinci seçenek: PoE (Power over Ethernet, 802.3af/at) — güç ve veri, PoE switch'ten tek bükümlü çiftle gider; ek kablo ve priz olmadan 100 metreye kadar.",
          ] },
          { h: "Ekonomi ve güvenilirlik", p: [
            "Bir-iki kamera için adaptörler daha ucuzdur. Ancak 3–4 kameradan itibaren denklem tersine döner: her adaptör kameranın yanında priz ister (elektrik tesisatı işi), her adaptör ayrı bir arıza noktasıdır ve bunları kesintilere karşı tek tek yedeklemek neredeyse imkânsızdır.",
            "PoE bunların hepsini tek düğümle çözer: switch kabinde durur, ona tek UPS bağlanır — tüm kamera sistemi elektrik kesintisini bütün olarak atlatır. Donan kamerayı porttaki PoE'yi kapatıp açarak uzaktan yeniden başlatmak da mümkündür.",
          ] },
          { h: "8 kameralı örnek", p: [
            "Adaptörlerle: 8 adaptör, 8 priz (montaj!), basit switch, UPS'e neredeyse yer yok. PoE ile: 8+ portlu tek PoE switch, kabinde tek UPS, sıfır ek priz. Başlangıç maliyeti benzer; sahip olma maliyetinde PoE kazanır: daha az arıza noktası, tek yerde yedekleme, uzaktan yönetim.",
            "Önceden hesaplanması gereken tek şey PoE güç bütçesidir: tüm kameraların toplam tüketimi (normal — 5–7 W, PTZ ve ısıtmalı — 15–25 W) switch bütçesine %20–30 payla sığmalıdır.",
          ] },
          { h: "Sonuç", p: [
            "Hazır prizli 2–3 kameraya kadar adaptörler kabul edilebilir. 3–4 kameradan itibaren ve kesintide çalışması gereken her sistemde — tartışmasız PoE. Kamera sayınıza uygun PoE switch seçimi ve güç bütçesi hesabında yardımcı olalım — chat veya Telegram'dan yazın.",
          ] },
        ],
      },
      zh: {
        title: "PoE交换机还是独立电源：摄像机供电哪种更实用",
        excerpt: "IP摄像机供电的两种方式——算经济账和可靠性账：什么时候12V电源够用，什么时候PoE从第一天就回本。",
        sections: [
          { h: "IP摄像机如何供电", p: [
            "方式一：每台摄像机旁放一个经典12V电源，外加单独的电源线。方式二：PoE（以太网供电，802.3af/at标准）——供电和数据走同一根网线，由PoE交换机输出，100米内无需额外布线和插座。",
          ] },
          { h: "经济性与可靠性", p: [
            "一两台摄像机用独立电源更便宜。但从3–4台开始账就反过来了：每个电源都需要在摄像机旁有插座（这是电工活），每个电源都是独立故障点，想逐个做断电备份几乎不可能。",
            "PoE用一个节点解决全部问题：交换机装在机柜里，配一台UPS——整套监控系统就能整体扛过停电。诊断也更简单：死机的摄像机可远程断合该端口的PoE重启，无需跑现场。",
          ] },
          { h: "以8台摄像机为例", p: [
            "独立电源方案：8个电源、8个插座（要施工！）、普通交换机，UPS几乎没地方装。PoE方案：一台8口以上PoE交换机、机柜里一台UPS、零额外插座。初期成本相近，总拥有成本PoE胜出：故障点更少、备份集中、可远程管理。",
            "唯一需要提前计算的是PoE功率预算：所有摄像机功耗之和（普通款5–7瓦，云台和加热款15–25瓦）应在交换机预算内留出20–30%余量。",
          ] },
          { h: "结论", p: [
            "已有现成插座且不超过2–3台——独立电源可以接受。3–4台以上、以及任何要求停电不停机的系统——毫无疑问选PoE。我们可按您的摄像机数量选型PoE交换机并计算功率预算——欢迎通过在线聊天或Telegram联系。",
          ] },
        ],
      },
    },
  },
];

export const articleBySlug: Record<string, Article> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

// Статьи, доступные для локали (есть перевод) — для списка и sitemap.
export function articlesForLocale(locale: string): Article[] {
  return ARTICLES.filter((a) => a.loc[locale]);
}
