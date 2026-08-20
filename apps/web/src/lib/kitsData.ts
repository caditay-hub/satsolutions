// Готовые комплекты «под ключ» с ценой «от» — посадочные под спрос
// «видеонаблюдение для дома/офиса/магазина/склада» (срез спроса Ads 20.08.2026).
// Цены собраны из реальных позиций каталога (HiLook/Hikvision/Dahua/SkyHawk),
// округлены вниз до «от»; включают оборудование, расходники и монтаж.
// Правило: любой новый контент — сразу 5 локалей (ru/uz/en/tr/zh).

export type KitBody = {
  title: string;        // H1 и title
  tagline: string;      // подзаголовок
  audience: string;     // для кого
  includes: string[];   // состав комплекта
  mount: string[];      // что входит в монтаж
  faq: { q: string; a: string }[];
  cta: string;          // текст кнопки/призыва
  priceLabel: string;   // «от 4 000 000 сум»
};

export type Kit = {
  slug: string;
  priceFrom: number;    // UZS, для schema
  relatedService: string; // ключ услуги для перелинковки
  loc: Record<string, KitBody>;
};

const f = (n: number) => new Intl.NumberFormat("ru-RU").format(n).replace(/ /g, " ");

export const KITS: Kit[] = [
  {
    slug: "videonablyudenie-dlya-doma",
    priceFrom: 4000000,
    relatedService: "cctv",
    loc: {
      ru: {
        title: "Комплект видеонаблюдения для дома под ключ",
        tagline: "4 уличные IP-камеры 4 Мп, регистратор, диск и монтаж — просмотр с телефона в день установки.",
        audience: "Частный дом, дача, таунхаус: двор, ворота, периметр и вход.",
        includes: [
          "4 уличные IP-камеры 4 Мп (HiLook/Hikvision, ИК-подсветка, IP67)",
          "IP-видеорегистратор на 8 каналов — с запасом на расширение",
          "Жёсткий диск для видеонаблюдения 1 ТБ (архив ~2 недели)",
          "Кабель, коннекторы, блок питания, монтажные коробки",
          "Настройка просмотра с телефона (Hik-Connect) и уведомлений",
        ],
        mount: ["Выезд инженера и разметка точек", "Прокладка кабеля до 80 м", "Монтаж и юстировка камер", "Пусконаладка и обучение"],
        faq: [
          { q: "Можно ли поставить больше камер?", a: "Да, регистратор на 8 каналов — доставите ещё до 4 камер без замены оборудования. Цена пересчитывается по смете." },
          { q: "Сколько хранится архив?", a: "С диском 1 ТБ — около 2 недель записи 4 камер. Для месяца архива берите 2 ТБ (+~250 тыс. сум)." },
          { q: "Сколько занимает установка?", a: "Типовой дом — один рабочий день, включая настройку телефона." },
        ],
        cta: "Получить точную смету за 1 день",
        priceLabel: `от ${f(4000000)} сум`,
      },
      uz: {
        title: "Uy uchun videokuzatuv to'plami — kalit topshirish",
        tagline: "4 ta ko'cha IP-kamerasi 4 Mp, registrator, disk va montaj — o'rnatilgan kuniyoq telefondan ko'rasiz.",
        audience: "Hovli, dala hovli, taunxaus: hovli, darvoza, perimetr va kirish.",
        includes: [
          "4 ta ko'cha IP-kamerasi 4 Mp (HiLook/Hikvision, IK-yoritish, IP67)",
          "8 kanalli IP-videoregistrator — kengaytirish zaxirasi bilan",
          "Videokuzatuv uchun 1 TB qattiq disk (~2 haftalik arxiv)",
          "Kabel, konnektorlar, quvvat bloki, montaj qutilari",
          "Telefondan ko'rish (Hik-Connect) va bildirishnomalarni sozlash",
        ],
        mount: ["Muhandis chiqishi va nuqtalarni belgilash", "80 m gacha kabel yotqizish", "Kameralarni o'rnatish va sozlash", "Ishga tushirish va o'rgatish"],
        faq: [
          { q: "Ko'proq kamera qo'ysa bo'ladimi?", a: "Ha, registrator 8 kanalli — uskunani almashtirmasdan yana 4 tagacha kamera qo'shasiz. Narx smeta bo'yicha qayta hisoblanadi." },
          { q: "Arxiv qancha saqlanadi?", a: "1 TB disk bilan 4 kamera yozuvi ~2 hafta. Bir oylik arxiv uchun 2 TB oling (+~250 ming so'm)." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Oddiy hovli — bir ish kuni, telefon sozlamalari bilan birga." },
        ],
        cta: "1 kunda aniq smeta oling",
        priceLabel: `${f(4000000)} so'mdan`,
      },
      en: {
        title: "Turnkey Home CCTV Kit",
        tagline: "Four 4 MP outdoor IP cameras, recorder, drive and installation — phone viewing on day one.",
        audience: "Private house, cottage, townhouse: yard, gate, perimeter and entrance.",
        includes: [
          "4 outdoor 4 MP IP cameras (HiLook/Hikvision, IR, IP67)",
          "8-channel NVR — room to expand",
          "1 TB surveillance hard drive (~2 weeks of archive)",
          "Cable, connectors, PSU, junction boxes",
          "Phone viewing setup (Hik-Connect) and alerts",
        ],
        mount: ["Engineer visit and point layout", "Up to 80 m of cabling", "Camera mounting and adjustment", "Commissioning and training"],
        faq: [
          { q: "Can I add more cameras?", a: "Yes — the NVR has 8 channels, so up to 4 more cameras fit without replacing hardware. Price is re-quoted." },
          { q: "How long is footage stored?", a: "About 2 weeks for 4 cameras with 1 TB. For a month take 2 TB (+~250k UZS)." },
          { q: "How long does installation take?", a: "A typical house — one working day including phone setup." },
        ],
        cta: "Get an exact quote in 1 day",
        priceLabel: `from ${f(4000000)} UZS`,
      },
      tr: {
        title: "Ev için Anahtar Teslim Kamera Seti",
        tagline: "4 adet 4 MP dış mekân IP kamera, kayıt cihazı, disk ve montaj — kurulum günü telefondan izleme.",
        audience: "Müstakil ev, bağ evi, sıra ev: avlu, kapı, çevre ve giriş.",
        includes: [
          "4 dış mekân 4 MP IP kamera (HiLook/Hikvision, IR, IP67)",
          "8 kanallı NVR — genişleme payıyla",
          "1 TB güvenlik diski (~2 haftalık arşiv)",
          "Kablo, konnektörler, güç kaynağı, buatlar",
          "Telefondan izleme (Hik-Connect) ve bildirim kurulumu",
        ],
        mount: ["Mühendis keşfi ve nokta planı", "80 m'ye kadar kablolama", "Kamera montajı ve ayarı", "Devreye alma ve eğitim"],
        faq: [
          { q: "Daha fazla kamera eklenebilir mi?", a: "Evet — NVR 8 kanallı, donanım değişmeden 4 kamera daha eklenir. Fiyat teklifle güncellenir." },
          { q: "Kayıt ne kadar saklanır?", a: "1 TB ile 4 kamera ~2 hafta. Bir ay için 2 TB alın (+~250 bin UZS)." },
          { q: "Kurulum ne kadar sürer?", a: "Tipik ev — telefon kurulumu dahil bir iş günü." },
        ],
        cta: "1 günde net teklif alın",
        priceLabel: `${f(4000000)} UZS'den`,
      },
      zh: {
        title: "家用监控套装（交钥匙）",
        tagline: "4台400万像素室外IP摄像机＋录像机＋硬盘＋安装——当天即可手机观看。",
        audience: "别墅、独栋、联排：院子、大门、周界与入口。",
        includes: [
          "4台室外400万像素IP摄像机（HiLook/海康威视，红外，IP67）",
          "8路NVR录像机——预留扩容",
          "1TB监控专用硬盘（约2周存档）",
          "线缆、接头、电源、接线盒",
          "手机观看（Hik-Connect）与推送设置",
        ],
        mount: ["工程师上门与点位规划", "最长80米布线", "摄像机安装与调试", "系统调试与使用培训"],
        faq: [
          { q: "能加装更多摄像机吗？", a: "可以——NVR为8路，无需换设备可再加4台，价格按报价单更新。" },
          { q: "录像保存多久？", a: "1TB下4台约2周；存一个月请选2TB（约加25万苏姆）。" },
          { q: "安装要多久？", a: "普通住宅一个工作日完成，含手机端设置。" },
        ],
        cta: "1天内获取准确报价",
        priceLabel: `${f(4000000)} 苏姆起`,
      },
    },
  },
  {
    slug: "videonablyudenie-dlya-magazina",
    priceFrom: 4000000,
    relatedService: "cctv",
    loc: {
      ru: {
        title: "Комплект видеонаблюдения для магазина",
        tagline: "Касса, зал и вход под контролем: 4 камеры, архив 2 недели и удалённый доступ владельца.",
        audience: "Магазин, аптека, кафе, салон: кассовая зона, торговый зал, вход и подсобка.",
        includes: [
          "4 внутренние/уличные IP-камеры 4 Мп (широкий угол для зала)",
          "IP-видеорегистратор на 8 каналов",
          "Жёсткий диск 1 ТБ (архив ~2 недели)",
          "Кабель, коннекторы, питание, короб",
          "Удалённый доступ владельца с телефона, зоны приватности",
        ],
        mount: ["Разметка под кассу/зал/вход", "Прокладка кабеля до 80 м", "Монтаж и настройка детекции", "Обучение персонала"],
        faq: [
          { q: "Видно ли купюры на кассе?", a: "Камеру над кассой ставим прицельно; для распознавания номиналов рекомендуем 4 Мп и выше — входит в комплект." },
          { q: "Можно смотреть несколько магазинов в одном приложении?", a: "Да, все точки добавляются в один аккаунт Hik-Connect — переключение в два касания." },
          { q: "Работаете ли ночью/в выходные?", a: "Монтаж планируем на нерабочие часы магазина, чтобы не останавливать торговлю." },
        ],
        cta: "Получить точную смету за 1 день",
        priceLabel: `от ${f(4000000)} сум`,
      },
      uz: {
        title: "Do'kon uchun videokuzatuv to'plami",
        tagline: "Kassa, zal va kirish nazoratda: 4 kamera, 2 haftalik arxiv va egasi uchun masofaviy kirish.",
        audience: "Do'kon, dorixona, kafe, salon: kassa zonasi, savdo zali, kirish va ombor.",
        includes: [
          "4 ta ichki/ko'cha IP-kamerasi 4 Mp (zal uchun keng burchak)",
          "8 kanalli IP-videoregistrator",
          "1 TB qattiq disk (~2 haftalik arxiv)",
          "Kabel, konnektorlar, quvvat, korob",
          "Egasi uchun telefondan masofaviy kirish",
        ],
        mount: ["Kassa/zal/kirish bo'yicha belgilash", "80 m gacha kabel", "Montaj va detektsiya sozlash", "Xodimlarni o'rgatish"],
        faq: [
          { q: "Kassadagi pul ko'rinadimi?", a: "Kassa ustiga kamerani aniq yo'naltiramiz; kupyuralarni ajratish uchun 4 Mp va undan yuqori tavsiya etiladi — to'plamga kiradi." },
          { q: "Bir ilovada bir nechta do'konni ko'rish mumkinmi?", a: "Ha, barcha nuqtalar bitta Hik-Connect akkauntiga qo'shiladi." },
          { q: "Kechasi/dam olish kunlari ishlaysizmi?", a: "Montajni do'kon ishlamaydigan soatlarga rejalashtiramiz — savdo to'xtamaydi." },
        ],
        cta: "1 kunda aniq smeta oling",
        priceLabel: `${f(4000000)} so'mdan`,
      },
      en: {
        title: "CCTV Kit for a Shop",
        tagline: "Checkout, floor and entrance covered: 4 cameras, 2-week archive and remote owner access.",
        audience: "Shop, pharmacy, café, salon: checkout, sales floor, entrance and back room.",
        includes: [
          "4 indoor/outdoor 4 MP IP cameras (wide angle for the floor)",
          "8-channel NVR",
          "1 TB hard drive (~2 weeks of archive)",
          "Cable, connectors, power, trunking",
          "Owner's remote phone access, privacy zones",
        ],
        mount: ["Layout for checkout/floor/entrance", "Up to 80 m of cabling", "Mounting and detection setup", "Staff training"],
        faq: [
          { q: "Can banknotes at the till be seen?", a: "The till camera is aimed precisely; 4 MP and above is recommended for reading denominations — included in the kit." },
          { q: "Can I watch several shops in one app?", a: "Yes, all sites go into one Hik-Connect account — switch in two taps." },
          { q: "Do you install at night/weekends?", a: "We schedule installation outside trading hours so the shop keeps working." },
        ],
        cta: "Get an exact quote in 1 day",
        priceLabel: `from ${f(4000000)} UZS`,
      },
      tr: {
        title: "Mağaza için Kamera Seti",
        tagline: "Kasa, salon ve giriş kontrol altında: 4 kamera, 2 haftalık arşiv, sahibine uzaktan erişim.",
        audience: "Mağaza, eczane, kafe, salon: kasa bölgesi, satış alanı, giriş ve depo.",
        includes: [
          "4 iç/dış mekân 4 MP IP kamera (salon için geniş açı)",
          "8 kanallı NVR",
          "1 TB disk (~2 haftalık arşiv)",
          "Kablo, konnektör, güç, kanal",
          "Sahibi için telefondan uzaktan erişim",
        ],
        mount: ["Kasa/salon/giriş plan çizimi", "80 m'ye kadar kablolama", "Montaj ve algılama ayarı", "Personel eğitimi"],
        faq: [
          { q: "Kasadaki banknotlar görülür mü?", a: "Kasa kamerası hedefli konumlanır; küpür ayrımı için 4 MP ve üzeri önerilir — sette mevcut." },
          { q: "Birkaç mağaza tek uygulamada izlenir mi?", a: "Evet, tüm noktalar tek Hik-Connect hesabına eklenir." },
          { q: "Gece/hafta sonu çalışıyor musunuz?", a: "Montajı mağazanın kapalı saatlerine planlarız — satış durmaz." },
        ],
        cta: "1 günde net teklif alın",
        priceLabel: `${f(4000000)} UZS'den`,
      },
      zh: {
        title: "商铺监控套装",
        tagline: "收银台、卖场与入口全覆盖：4台摄像机、2周存档、店主远程查看。",
        audience: "商店、药店、咖啡馆、美容院：收银区、卖场、入口与后仓。",
        includes: [
          "4台室内/室外400万像素IP摄像机（卖场广角）",
          "8路NVR录像机",
          "1TB硬盘（约2周存档）",
          "线缆、接头、电源、线槽",
          "店主手机远程查看，隐私遮挡",
        ],
        mount: ["收银/卖场/入口点位规划", "最长80米布线", "安装与侦测设置", "员工培训"],
        faq: [
          { q: "收银台的纸币看得清吗？", a: "收银摄像机精准对位；识别面额建议400万像素及以上——套装已含。" },
          { q: "多家店能在一个App里看吗？", a: "可以，全部门店加入同一Hik-Connect账号，两次点击切换。" },
          { q: "能夜间或周末施工吗？", a: "安装安排在营业时间之外，不影响生意。" },
        ],
        cta: "1天内获取准确报价",
        priceLabel: `${f(4000000)} 苏姆起`,
      },
    },
  },
  {
    slug: "videonablyudenie-i-skud-dlya-ofisa",
    priceFrom: 5000000,
    relatedService: "access",
    loc: {
      ru: {
        title: "Комплект для офиса: видеонаблюдение + СКУД",
        tagline: "4 камеры и электронный замок со считывателем на входную дверь — безопасность и контроль доступа разом.",
        audience: "Офис до 30 сотрудников: вход, ресепшен, опенспейс, серверная/склад.",
        includes: [
          "4 IP-камеры 4 Мп (вход, ресепшен, кабинеты)",
          "IP-видеорегистратор на 8 каналов + диск 1 ТБ",
          "Электромагнитный замок, считыватель карт, кнопка выхода",
          "Комплект карт доступа (10 шт.)",
          "Кабель, питание, доводчик; настройка с телефона",
        ],
        mount: ["Проект расстановки", "Кабельные трассы в коробе", "Монтаж камер и СКУД на дверь", "Пусконаладка, карты, обучение"],
        faq: [
          { q: "Можно ли добавить учёт рабочего времени?", a: "Да — вместо простого считывателя ставим биометрический терминал (Face ID) с выгрузкой табеля; доплата от ~2,5 млн сум." },
          { q: "Что будет при отключении света?", a: "Замок подключаем через резервируемый блок питания: дверь работает от аккумулятора несколько часов." },
          { q: "Сколько длится монтаж?", a: "Типовой офис — 1–2 рабочих дня без остановки работы команды." },
        ],
        cta: "Получить точную смету за 1 день",
        priceLabel: `от ${f(5000000)} сум`,
      },
      uz: {
        title: "Ofis uchun to'plam: videokuzatuv + SKUD",
        tagline: "4 kamera va kirish eshigiga o'qigichli elektron qulf — xavfsizlik va kirish nazorati birgalikda.",
        audience: "30 nafargacha xodimli ofis: kirish, resepshn, openspeys, server/ombor.",
        includes: [
          "4 ta IP-kamera 4 Mp (kirish, resepshn, xonalar)",
          "8 kanalli IP-videoregistrator + 1 TB disk",
          "Elektromagnit qulf, karta o'qigich, chiqish tugmasi",
          "Kirish kartalari to'plami (10 dona)",
          "Kabel, quvvat, dovodchik; telefondan sozlash",
        ],
        mount: ["Joylashuv loyihasi", "Korobda kabel trassalari", "Kamera va eshikka SKUD montaji", "Ishga tushirish, kartalar, o'rgatish"],
        faq: [
          { q: "Ish vaqtini hisobga olishni qo'shsa bo'ladimi?", a: "Ha — oddiy o'qigich o'rniga biometrik terminal (Face ID) o'rnatamiz, tabel yuklab olinadi; qo'shimcha ~2,5 mln so'mdan." },
          { q: "Svet o'chsa nima bo'ladi?", a: "Qulfni zaxira quvvat blokiga ulaymiz: eshik akkumulyatordan bir necha soat ishlaydi." },
          { q: "Montaj qancha davom etadi?", a: "Oddiy ofis — jamoa ishini to'xtatmasdan 1–2 ish kuni." },
        ],
        cta: "1 kunda aniq smeta oling",
        priceLabel: `${f(5000000)} so'mdan`,
      },
      en: {
        title: "Office Kit: CCTV + Access Control",
        tagline: "Four cameras plus an electronic lock with card reader on the entrance — security and access in one project.",
        audience: "Office up to 30 staff: entrance, reception, open space, server room/storage.",
        includes: [
          "4 IP cameras 4 MP (entrance, reception, rooms)",
          "8-channel NVR + 1 TB drive",
          "Magnetic lock, card reader, exit button",
          "Access card pack (10 pcs)",
          "Cable, power, door closer; phone setup",
        ],
        mount: ["Placement design", "Cable runs in trunking", "Camera and door ACS installation", "Commissioning, cards, training"],
        faq: [
          { q: "Can time attendance be added?", a: "Yes — a biometric Face ID terminal replaces the reader and exports timesheets; from ~2.5M UZS extra." },
          { q: "What happens in a power cut?", a: "The lock runs from a battery-backed PSU — the door keeps working for hours." },
          { q: "How long is installation?", a: "A typical office takes 1–2 working days without stopping the team." },
        ],
        cta: "Get an exact quote in 1 day",
        priceLabel: `from ${f(5000000)} UZS`,
      },
      tr: {
        title: "Ofis Seti: Kamera + Geçiş Kontrol",
        tagline: "4 kamera ve giriş kapısına kartlı elektronik kilit — güvenlik ve erişim tek projede.",
        audience: "30 kişiye kadar ofis: giriş, resepsiyon, açık ofis, sunucu/depo.",
        includes: [
          "4 IP kamera 4 MP (giriş, resepsiyon, odalar)",
          "8 kanallı NVR + 1 TB disk",
          "Manyetik kilit, kart okuyucu, çıkış butonu",
          "Erişim kartı paketi (10 adet)",
          "Kablo, güç, kapı hidroliği; telefon kurulumu",
        ],
        mount: ["Yerleşim projesi", "Kanal içinde kablo hatları", "Kamera ve kapı ACS montajı", "Devreye alma, kartlar, eğitim"],
        faq: [
          { q: "Mesai takibi eklenir mi?", a: "Evet — okuyucu yerine Face ID biyometrik terminal kurulur, puantaj alınır; ek ~2,5 milyon UZS'den." },
          { q: "Elektrik kesilirse ne olur?", a: "Kilit akülü güç kaynağına bağlanır — kapı saatlerce çalışır." },
          { q: "Montaj ne kadar sürer?", a: "Tipik ofis 1–2 iş günü, ekip çalışması durmadan." },
        ],
        cta: "1 günde net teklif alın",
        priceLabel: `${f(5000000)} UZS'den`,
      },
      zh: {
        title: "办公室套装：监控＋门禁",
        tagline: "4台摄像机＋入口电子锁与读卡器——安防与门禁一次到位。",
        audience: "30人以内办公室：入口、前台、开放区、机房/库房。",
        includes: [
          "4台400万像素IP摄像机（入口、前台、办公室）",
          "8路NVR＋1TB硬盘",
          "磁力锁、读卡器、出门按钮",
          "门禁卡10张",
          "线缆、电源、闭门器；手机端设置",
        ],
        mount: ["点位设计", "线槽内布线", "摄像机与门禁安装", "调试、发卡、培训"],
        faq: [
          { q: "能加考勤吗？", a: "能——把读卡器换成人脸识别终端（Face ID）并导出考勤表；加价约250万苏姆起。" },
          { q: "停电了怎么办？", a: "门锁接入带电池的备用电源，断电后仍可工作数小时。" },
          { q: "施工要多久？", a: "普通办公室1–2个工作日，不影响团队办公。" },
        ],
        cta: "1天内获取准确报价",
        priceLabel: `${f(5000000)} 苏姆起`,
      },
    },
  },
  {
    slug: "videonablyudenie-dlya-sklada",
    priceFrom: 7500000,
    relatedService: "warehouse",
    loc: {
      ru: {
        title: "Комплект видеонаблюдения для склада",
        tagline: "8 камер на зоны приёмки, отгрузки и стеллажи, месяц архива и доступ для нескольких сотрудников.",
        audience: "Склад, цех, база: ворота, рампы, проходы, периметр.",
        includes: [
          "8 IP-камер 4 Мп (уличные и внутренние, ИК до 30 м)",
          "IP-видеорегистратор на 8–16 каналов с PoE",
          "Жёсткий диск 2 ТБ (архив до месяца)",
          "Кабельные трассы, шкаф, питание",
          "Доступ с телефонов для руководителя и охраны",
        ],
        mount: ["Проект по плану склада", "Кабель до 300 м, высотные работы", "Монтаж, юстировка, детекция зон", "Пусконаладка и регламент хранения"],
        faq: [
          { q: "Потянет ли система 12–16 камер?", a: "Да, закладываем регистратор с запасом каналов — расширение без замены основы." },
          { q: "Можно ли контролировать погрузку по номерам машин?", a: "Да, добавляется ANPR-камера на ворота с распознаванием номеров — от ~3 млн сум." },
          { q: "Есть ли договор и акты для юрлица?", a: "Да: договор, счёт-фактура с НДС, акты и исполнительная схема — полный пакет." },
        ],
        cta: "Получить точную смету за 1 день",
        priceLabel: `от ${f(7500000)} сум`,
      },
      uz: {
        title: "Ombor uchun videokuzatuv to'plami",
        tagline: "Qabul, jo'natish va stellajlar uchun 8 kamera, bir oylik arxiv va bir nechta xodim uchun kirish.",
        audience: "Ombor, sex, baza: darvozalar, rampalar, yo'laklar, perimetr.",
        includes: [
          "8 ta IP-kamera 4 Mp (ko'cha va ichki, IK 30 m gacha)",
          "PoE bilan 8–16 kanalli IP-videoregistrator",
          "2 TB qattiq disk (bir oygacha arxiv)",
          "Kabel trassalari, shkaf, quvvat",
          "Rahbar va qo'riqlash uchun telefondan kirish",
        ],
        mount: ["Ombor rejasi bo'yicha loyiha", "300 m gacha kabel, balandlik ishlari", "Montaj, sozlash, zona detektsiyasi", "Ishga tushirish va saqlash reglamenti"],
        faq: [
          { q: "Tizim 12–16 kamerani ko'taradimi?", a: "Ha, registratorni kanal zaxirasi bilan tanlaymiz — asosni almashtirmasdan kengayasiz." },
          { q: "Yuklashni mashina raqamlari bo'yicha nazorat qilsa bo'ladimi?", a: "Ha, darvozaga raqam taniydigan ANPR-kamera qo'shiladi — ~3 mln so'mdan." },
          { q: "Yuridik shaxs uchun shartnoma va aktlar bormi?", a: "Ha: shartnoma, QQS bilan schyot-faktura, aktlar va ijro sxemasi — to'liq paket." },
        ],
        cta: "1 kunda aniq smeta oling",
        priceLabel: `${f(7500000)} so'mdan`,
      },
      en: {
        title: "Warehouse CCTV Kit",
        tagline: "Eight cameras over receiving, dispatch and racking, a month of archive and multi-user access.",
        audience: "Warehouse, workshop, depot: gates, ramps, aisles, perimeter.",
        includes: [
          "8 IP cameras 4 MP (outdoor and indoor, IR up to 30 m)",
          "8–16 channel PoE NVR",
          "2 TB hard drive (up to a month of archive)",
          "Cable runs, cabinet, power",
          "Phone access for manager and security",
        ],
        mount: ["Design over the floor plan", "Up to 300 m of cabling, work at height", "Mounting, adjustment, zone detection", "Commissioning and retention policy"],
        faq: [
          { q: "Will it scale to 12–16 cameras?", a: "Yes — we size the NVR with spare channels, so you expand without replacing the core." },
          { q: "Can loading be controlled by number plates?", a: "Yes, an ANPR camera is added at the gate — from ~3M UZS." },
          { q: "Contract and acts for a legal entity?", a: "Yes: contract, VAT invoice, acts and as-built diagram — the full pack." },
        ],
        cta: "Get an exact quote in 1 day",
        priceLabel: `from ${f(7500000)} UZS`,
      },
      tr: {
        title: "Depo için Kamera Seti",
        tagline: "Mal kabul, sevkiyat ve raflara 8 kamera, bir aylık arşiv, çok kullanıcılı erişim.",
        audience: "Depo, atölye, tesis: kapılar, rampalar, koridorlar, çevre.",
        includes: [
          "8 IP kamera 4 MP (iç/dış, 30 m IR)",
          "8–16 kanallı PoE NVR",
          "2 TB disk (bir aya kadar arşiv)",
          "Kablo hatları, kabinet, güç",
          "Yönetici ve güvenlik için telefon erişimi",
        ],
        mount: ["Yerleşim planı üzerinden proje", "300 m'ye kadar kablo, yüksekte çalışma", "Montaj, ayar, bölge algılama", "Devreye alma ve saklama düzeni"],
        faq: [
          { q: "12–16 kameraya çıkar mı?", a: "Evet — NVR kanal payıyla seçilir, çekirdek değişmeden genişlersiniz." },
          { q: "Yükleme plakaya göre izlenir mi?", a: "Evet, kapıya plaka tanıma (ANPR) kamerası eklenir — ~3 milyon UZS'den." },
          { q: "Kurumsal sözleşme ve tutanak var mı?", a: "Evet: sözleşme, KDV faturası, tutanaklar ve uygulama şeması — tam paket." },
        ],
        cta: "1 günde net teklif alın",
        priceLabel: `${f(7500000)} UZS'den`,
      },
      zh: {
        title: "仓库监控套装",
        tagline: "收货、发货与货架区8台摄像机，一个月存档，多人访问权限。",
        audience: "仓库、车间、基地：大门、装卸台、通道、周界。",
        includes: [
          "8台400万像素IP摄像机（室内外，红外30米）",
          "8–16路PoE NVR",
          "2TB硬盘（存档最长一个月）",
          "线缆桥架、机柜、供电",
          "经理与保安手机查看权限",
        ],
        mount: ["按平面图设计", "最长300米布线及高空作业", "安装、调试、区域侦测", "系统调试与存档制度"],
        faq: [
          { q: "以后能扩到12–16台吗？", a: "能——NVR按余量选型，扩容无需更换核心设备。" },
          { q: "能按车牌管控装卸吗？", a: "能，大门加装车牌识别（ANPR）摄像机——约300万苏姆起。" },
          { q: "有对公合同和验收单吗？", a: "有：合同、增值税发票、验收单与竣工图——全套齐备。" },
        ],
        cta: "1天内获取准确报价",
        priceLabel: `${f(7500000)} 苏姆起`,
      },
    },
  },
];

export const kitBySlug = (slug: string) => KITS.find((k) => k.slug === slug);
export const kitsForLocale = (locale: string) => KITS.filter((k) => k.loc[locale]);
