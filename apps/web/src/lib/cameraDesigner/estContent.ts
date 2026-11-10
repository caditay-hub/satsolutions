/**
 * Тексты сметы и коммерческого предложения (SAT Camera Designer, этап D) на пяти языках.
 * Названия работ совпадают с прайсом монтажа на сайте (messages → installPrices.work), адрес и
 * часы — как в контактах сайта. Шаблоны {n}, {d}, {tb}, {mbps}, {days}, {w}, {m}, {a}, {b},
 * {brand}, {brands}, {cams} подставляет компонент.
 */
export type CdEstUi = {
  title: string; lead: string; empty: string; loading: string; error: string;
  archive: string; record: string; continuous: string; motion: string; codec: string;
  trace: string; traceNeed: string; traceReady: string; cableAvg: string; mountAvg: string;
  rackTool: string; rackHint: string; rackNone: string; outdoor: string; outdoorHint: string;
  equipTitle: string; laborTitle: string; colItem: string; colQty: string; colPrice: string; colSum: string;
  units: { pc: string; bobbin: string; m: string; set: string };
  lines: { bracket: string; psu: string; hipoe: string; coax: string; cableIn: string; cableOut: string };
  labor: { camIn: string; camOut: string; camPtz: string; camPnr: string; nvr: string; nvrBig: string; remote: string; switch: string; cableOpen: string; gofra: string; shtroba: string; cableTray: string };
  equipTotal: string; laborTotal: string; total: string; range: string; onRequest: string; onRequestNote: string; engineer: string;
  storage: string; poe: string; bitrateNote: string; review: string;
  warn: { noNvr: string; noDvr: string; onvif: string; longCable: string; noUps: string; powerEstimate: string };
  kp: string; manualStart: string; manualTitle: string; manualHint: string; manualAdd: string; backToPlan: string; qty: string; remove: string;
  kpTitle: string; kpSub: string; kpNo: string; kpTerms: string; kpContacts: string; kpAddress: string; kpHours: string; kpMethod: string; kpPlan: string; kpCameras: string;
};

const ru: CdEstUi = {
  title: "Смета", lead: "Оборудование подобрано по камерам на плане: регистратор того же бренда, диски под архив, питание PoE, ИБП, кабель. Монтаж — по прайсу на слаботочные работы.",
  empty: "Добавьте камеры, чтобы получить смету.", loading: "Загружаем цены…", error: "Цены не загрузились. Обновите страницу или отправьте проект инженеру.",
  archive: "Архив, суток", record: "Запись", continuous: "Круглосуточно", motion: "По движению", codec: "Кодек",
  trace: "Кабельные трассы", traceNeed: "Прокладываем с нуля", traceReady: "Лотки и гофра уже есть", cableAvg: "Средняя длина кабеля до шкафа, м", mountAvg: "Высота установки, м",
  rackTool: "Шкаф", rackHint: "Поставьте на план шкаф с регистратором — длина кабеля посчитается до каждой камеры: по стенам, со спусками и запасом 10 %.",
  rackNone: "Шкаф не отмечен на плане — длина кабеля взята средней, {m} м на камеру.",
  outdoor: "Уличная установка", outdoorHint: "Отметьте уличные камеры: у них другая расценка монтажа и уличный кабель.",
  equipTitle: "Оборудование", laborTitle: "Работы", colItem: "Позиция", colQty: "Кол-во", colPrice: "Цена", colSum: "Сумма",
  units: { pc: "шт.", bobbin: "бухта", m: "м", set: "компл." },
  lines: {
    bracket: "Кронштейны и монтажные коробки", psu: "Блоки питания 12 В для камер без PoE", hipoe: "Питание Hi-PoE для поворотных камер",
    coax: "Кабель или видеобалуны для аналоговых камер", cableIn: "внутренний", cableOut: "уличный",
  },
  labor: {
    camIn: "Монтаж внутренней камеры", camOut: "Монтаж уличной камеры", camPtz: "Монтаж поворотной (PTZ) камеры", camPnr: "Настройка и пусконаладка камеры",
    nvr: "Установка и настройка регистратора (до 16 камер)", nvrBig: "Установка и настройка регистратора (свыше 16 камер)", remote: "Настройка удалённого доступа с телефона",
    switch: "Монтаж коммутатора", cableOpen: "Прокладка кабеля", gofra: "Укладка кабеля в гофру", shtroba: "Штробление", cableTray: "Затяжка кабеля в трассу",
  },
  equipTotal: "Итого оборудование", laborTotal: "Работы", total: "Итого", range: "{a} – {b}", onRequest: "по запросу",
  onRequestNote: "Без учёта позиций «по запросу» ({n}) — цену уточнит инженер.", engineer: "подберёт инженер",
  storage: "Архив: {tb} ТБ — {mbps} Мбит/с, {days} сут.", poe: "Нагрузка PoE: {w} Вт",
  bitrateNote: "Битрейт — типовой для разрешения камер (оценка): фактический зависит от сцены, освещения и настроек камеры.",
  review: "нужна проверка",
  warn: {
    noNvr: "IP-регистратор под эту задачу среди проверенных моделей не найден (каналы, входящий поток или архив) — подберёт инженер.",
    noDvr: "Видеорегистратор для аналоговых камер среди проверенных моделей не найден — подберёт инженер.",
    onvif: "Камеры {brands} подключаются к регистратору {brand} по ONVIF: часть функций аналитики может быть недоступна.",
    longCable: "Линии длиннее 90 м: {cams}. Предел Ethernet — 100 м: нужен промежуточный коммутатор или оптика.",
    noUps: "ИБП подходящей мощности среди проверенных моделей нет — подберёт инженер.",
    powerEstimate: "Потребление части камер взято по классу PoE (оценка) — бюджет PoE рассчитан с запасом.",
  },
  kp: "Коммерческое предложение (PDF)", manualStart: "Смета без плана", manualTitle: "Смета по списку камер",
  manualHint: "Добавьте камеры из каталога и укажите количество. Длина кабеля — средняя на камеру.", manualAdd: "Добавить", backToPlan: "К плану объекта", qty: "Кол-во", remove: "Удалить",
  kpTitle: "Коммерческое предложение", kpSub: "Предварительный расчёт системы видеонаблюдения", kpNo: "№ {n} от {d}",
  kpTerms: "Расчёт ориентировочный: цены каталога на дату формирования, действительны 3 дня. Точную сумму подтвердит инженер после осмотра объекта.",
  kpContacts: "Контакты", kpAddress: "Ташкент, ул. Катта Дархон, 5", kpHours: "Пн–Пт 9:00–18:00",
  kpMethod: "Подбор оборудования — SAT Camera Designer по документации производителей; монтаж — по прайсу на слаботочные работы.", kpPlan: "План объекта", kpCameras: "Камеры на плане",
};

const uz: CdEstUi = {
  title: "Smeta", lead: "Uskunalar rejadagi kameralar boʻyicha tanlangan: shu brenddagi registrator, arxiv uchun disklar, PoE taʼminoti, UPS, kabel. Montaj — kam tokli ishlar narxnomasi boʻyicha.",
  empty: "Smeta olish uchun kameralar qoʻshing.", loading: "Narxlar yuklanmoqda…", error: "Narxlar yuklanmadi. Sahifani yangilang yoki loyihani muhandisga yuboring.",
  archive: "Arxiv, sutka", record: "Yozuv", continuous: "Kecha-kunduz", motion: "Harakat boʻyicha", codec: "Kodek",
  trace: "Kabel trassalari", traceNeed: "Noldan yotqizamiz", traceReady: "Lotok va gofra allaqachon bor", cableAvg: "Shkafgacha oʻrtacha kabel uzunligi, m", mountAvg: "Oʻrnatish balandligi, m",
  rackTool: "Shkaf", rackHint: "Registratorli shkafni rejaga qoʻying — kabel uzunligi har bir kameragacha hisoblanadi: devorlar boʻylab, tushishlar va 10 % zaxira bilan.",
  rackNone: "Shkaf rejada belgilanmagan — kabel uzunligi oʻrtacha olingan, har bir kameraga {m} m.",
  outdoor: "Koʻchada oʻrnatish", outdoorHint: "Koʻcha kameralarini belgilang: ularning montaj narxi boshqa va koʻcha kabeli kerak.",
  equipTitle: "Uskunalar", laborTitle: "Ishlar", colItem: "Pozitsiya", colQty: "Soni", colPrice: "Narxi", colSum: "Summa",
  units: { pc: "dona", bobbin: "gʻaltak", m: "m", set: "kompl." },
  lines: {
    bracket: "Kronshteynlar va montaj qutilari", psu: "PoE boʻlmagan kameralar uchun 12 V quvvat bloklari", hipoe: "Burilma kameralar uchun Hi-PoE taʼminoti",
    coax: "Analog kameralar uchun kabel yoki videobalunlar", cableIn: "ichki", cableOut: "koʻcha",
  },
  labor: {
    camIn: "Ichki kamera montaji", camOut: "Koʻcha kamerasi montaji", camPtz: "Burilma (PTZ) kamera montaji", camPnr: "Kamerani sozlash va ishga tushirish",
    nvr: "Registratorni oʻrnatish va sozlash (16 kameragacha)", nvrBig: "Registratorni oʻrnatish va sozlash (16 dan ortiq kamera)", remote: "Telefondan masofaviy kirishni sozlash",
    switch: "Kommutator montaji", cableOpen: "Kabel yotqizish", gofra: "Kabelni gofraga joylash", shtroba: "Shtroba ochish", cableTray: "Trassaga kabel tortish",
  },
  equipTotal: "Uskunalar jami", laborTotal: "Ishlar", total: "Jami", range: "{a} – {b}", onRequest: "soʻrov boʻyicha",
  onRequestNote: "«Soʻrov boʻyicha» pozitsiyalar ({n}) hisobga olinmagan — narxini muhandis aniqlaydi.", engineer: "muhandis tanlaydi",
  storage: "Arxiv: {tb} TB — {mbps} Mbit/s, {days} sutka.", poe: "PoE yuklamasi: {w} Vt",
  bitrateNote: "Bitreyt — kamera ruxsati uchun odatiy qiymat (taxminiy): haqiqiysi sahna, yoritish va kamera sozlamalariga bogʻliq.",
  review: "tekshirish kerak",
  warn: {
    noNvr: "Bu vazifa uchun IP-registrator tekshirilgan modellar orasida topilmadi (kanallar, kiruvchi oqim yoki arxiv) — muhandis tanlaydi.",
    noDvr: "Analog kameralar uchun videoregistrator tekshirilgan modellar orasida topilmadi — muhandis tanlaydi.",
    onvif: "{brands} kameralari {brand} registratoriga ONVIF orqali ulanadi: tahlil funksiyalarining bir qismi ishlamasligi mumkin.",
    longCable: "90 m dan uzun liniyalar: {cams}. Ethernet chegarasi — 100 m: oraliq kommutator yoki optika kerak.",
    noUps: "Tekshirilgan modellar orasida mos quvvatli UPS yoʻq — muhandis tanlaydi.",
    powerEstimate: "Ayrim kameralarning isteʼmoli PoE sinfi boʻyicha olingan (taxminiy) — PoE byudjeti zaxira bilan hisoblangan.",
  },
  kp: "Tijorat taklifi (PDF)", manualStart: "Rejasiz smeta", manualTitle: "Kameralar roʻyxati boʻyicha smeta",
  manualHint: "Katalogdan kameralarni qoʻshing va sonini kiriting. Kabel uzunligi — har bir kameraga oʻrtacha.", manualAdd: "Qoʻshish", backToPlan: "Obyekt rejasiga", qty: "Soni", remove: "Oʻchirish",
  kpTitle: "Tijorat taklifi", kpSub: "Videokuzatuv tizimining dastlabki hisobi", kpNo: "№ {n}, {d}",
  kpTerms: "Hisob taxminiy: narxlar tuzilgan sanadagi katalog boʻyicha, 3 kun amal qiladi. Aniq summani muhandis obyektni koʻrgandan keyin tasdiqlaydi.",
  kpContacts: "Aloqa", kpAddress: "Toshkent, Katta Darxon koʻchasi, 5", kpHours: "Du–Ju 9:00–18:00",
  kpMethod: "Uskunalar tanlovi — SAT Camera Designer, ishlab chiqaruvchilar hujjatlari boʻyicha; montaj — kam tokli ishlar narxnomasi boʻyicha.", kpPlan: "Obyekt rejasi", kpCameras: "Rejadagi kameralar",
};

const en: CdEstUi = {
  title: "Estimate", lead: "Equipment is selected for the cameras on the plan: a recorder of the same brand, disks for the archive, PoE power, a UPS and cable. Installation follows our low-voltage works price list.",
  empty: "Add cameras to get an estimate.", loading: "Loading prices…", error: "Prices did not load. Refresh the page or send the project to an engineer.",
  archive: "Archive, days", record: "Recording", continuous: "24/7", motion: "On motion", codec: "Codec",
  trace: "Cable routes", traceNeed: "Laid from scratch", traceReady: "Trays and conduit already in place", cableAvg: "Average cable length to the rack, m", mountAvg: "Mounting height, m",
  rackTool: "Rack", rackHint: "Place the recorder rack on the plan and the cable length is calculated to every camera: along the walls, with drops and a 10% margin.",
  rackNone: "No rack on the plan — the cable length uses an average of {m} m per camera.",
  outdoor: "Outdoor installation", outdoorHint: "Mark outdoor cameras: they have a different installation rate and need outdoor cable.",
  equipTitle: "Equipment", laborTitle: "Works", colItem: "Item", colQty: "Qty", colPrice: "Price", colSum: "Amount",
  units: { pc: "pcs", bobbin: "reel", m: "m", set: "set" },
  lines: {
    bracket: "Brackets and junction boxes", psu: "12 V power supplies for cameras without PoE", hipoe: "Hi-PoE power for PTZ cameras",
    coax: "Cable or video baluns for analogue cameras", cableIn: "indoor", cableOut: "outdoor",
  },
  labor: {
    camIn: "Indoor camera installation", camOut: "Outdoor camera installation", camPtz: "PTZ camera installation", camPnr: "Camera setup and commissioning",
    nvr: "Recorder installation and setup (up to 16 cameras)", nvrBig: "Recorder installation and setup (over 16 cameras)", remote: "Remote access setup on a phone",
    switch: "Switch installation", cableOpen: "Cable laying", gofra: "Cable laying in conduit", shtroba: "Wall chasing", cableTray: "Pulling cable into route",
  },
  equipTotal: "Equipment total", laborTotal: "Works", total: "Total", range: "{a} – {b}", onRequest: "on request",
  onRequestNote: "Excluding items “on request” ({n}) — an engineer will confirm their price.", engineer: "selected by an engineer",
  storage: "Archive: {tb} TB — {mbps} Mbps, {days} days.", poe: "PoE load: {w} W",
  bitrateNote: "The bitrate is a typical value for the camera resolution (an estimate): the actual value depends on the scene, lighting and camera settings.",
  review: "needs checking",
  warn: {
    noNvr: "No checked IP recorder model fits this task (channels, incoming bandwidth or archive) — an engineer will select one.",
    noDvr: "No checked recorder model fits the analogue cameras — an engineer will select one.",
    onvif: "{brands} cameras connect to the {brand} recorder via ONVIF: some analytics features may be unavailable.",
    longCable: "Lines longer than 90 m: {cams}. The Ethernet limit is 100 m, so an intermediate switch or fibre is needed.",
    noUps: "No checked UPS model has enough power — an engineer will select one.",
    powerEstimate: "Power consumption of some cameras is taken from their PoE class (an estimate), so the PoE budget includes a margin.",
  },
  kp: "Quotation (PDF)", manualStart: "Estimate without a plan", manualTitle: "Estimate from a camera list",
  manualHint: "Add cameras from the catalogue and enter quantities. The cable length is an average per camera.", manualAdd: "Add", backToPlan: "Back to the site plan", qty: "Qty", remove: "Delete",
  kpTitle: "Quotation", kpSub: "Preliminary calculation of a video surveillance system", kpNo: "No. {n} dated {d}",
  kpTerms: "This is an approximate calculation: catalogue prices on the date of issue, valid for 3 days. An engineer will confirm the exact amount after a site visit.",
  kpContacts: "Contacts", kpAddress: "5 Katta Darkhon St., Tashkent", kpHours: "Mon–Fri 9:00–18:00",
  kpMethod: "Equipment selected by SAT Camera Designer from manufacturer documentation; installation priced from the low-voltage works price list.", kpPlan: "Site plan", kpCameras: "Cameras on the plan",
};

const tr: CdEstUi = {
  title: "Maliyet hesabı", lead: "Ekipman plandaki kameralara göre seçildi: aynı markadan kayıt cihazı, arşiv için diskler, PoE beslemesi, UPS ve kablo. Montaj, zayıf akım işleri fiyat listemize göre hesaplanır.",
  empty: "Maliyet hesabı için kamera ekleyin.", loading: "Fiyatlar yükleniyor…", error: "Fiyatlar yüklenemedi. Sayfayı yenileyin veya projeyi mühendise gönderin.",
  archive: "Arşiv, gün", record: "Kayıt", continuous: "7/24", motion: "Harekette", codec: "Kodek",
  trace: "Kablo güzergâhları", traceNeed: "Sıfırdan çekilecek", traceReady: "Kanal ve spiral boru hazır", cableAvg: "Kabine ortalama kablo uzunluğu, m", mountAvg: "Montaj yüksekliği, m",
  rackTool: "Kabin", rackHint: "Kayıt cihazının bulunduğu kabini plana yerleştirin; kablo uzunluğu her kameraya kadar hesaplanır: duvarlar boyunca, inişler ve %10 pay ile.",
  rackNone: "Planda kabin işaretlenmedi — kablo uzunluğu kamera başına ortalama {m} m alındı.",
  outdoor: "Dış mekân montajı", outdoorHint: "Dış mekân kameralarını işaretleyin: montaj fiyatları farklıdır ve dış mekân kablosu gerekir.",
  equipTitle: "Ekipman", laborTitle: "İşçilik", colItem: "Kalem", colQty: "Adet", colPrice: "Fiyat", colSum: "Tutar",
  units: { pc: "adet", bobbin: "makara", m: "m", set: "takım" },
  lines: {
    bracket: "Braketler ve montaj kutuları", psu: "PoE olmayan kameralar için 12 V adaptörler", hipoe: "PTZ kameralar için Hi-PoE besleme",
    coax: "Analog kameralar için kablo veya video balunlar", cableIn: "iç mekân", cableOut: "dış mekân",
  },
  labor: {
    camIn: "İç mekân kamera montajı", camOut: "Dış mekân kamera montajı", camPtz: "PTZ kamera montajı", camPnr: "Kamera ayarı ve devreye alma",
    nvr: "Kayıt cihazı montajı ve ayarı (16 kameraya kadar)", nvrBig: "Kayıt cihazı montajı ve ayarı (16 kameradan fazla)", remote: "Telefondan uzaktan erişim ayarı",
    switch: "Anahtar montajı", cableOpen: "Kablo çekimi", gofra: "Kablonun spiral boruya döşenmesi", shtroba: "Duvar kanalı açma", cableTray: "Güzergâha kablo çekimi",
  },
  equipTotal: "Ekipman toplamı", laborTotal: "İşçilik", total: "Toplam", range: "{a} – {b}", onRequest: "talep üzerine",
  onRequestNote: "“Talep üzerine” kalemler ({n}) hariç — fiyatını mühendis netleştirir.", engineer: "mühendis seçer",
  storage: "Arşiv: {tb} TB — {mbps} Mbit/s, {days} gün.", poe: "PoE yükü: {w} W",
  bitrateNote: "Bit hızı kamera çözünürlüğü için tipik bir değerdir (tahmin): gerçek değer sahneye, aydınlatmaya ve kamera ayarlarına bağlıdır.",
  review: "kontrol gerekli",
  warn: {
    noNvr: "Bu iş için doğrulanmış IP kayıt cihazı modeli bulunamadı (kanal, gelen bant genişliği veya arşiv) — mühendis seçer.",
    noDvr: "Analog kameralar için doğrulanmış kayıt cihazı modeli bulunamadı — mühendis seçer.",
    onvif: "{brands} kameraları {brand} kayıt cihazına ONVIF ile bağlanır: bazı analiz işlevleri kullanılamayabilir.",
    longCable: "90 m'den uzun hatlar: {cams}. Ethernet sınırı 100 m'dir: ara anahtar veya fiber gerekir.",
    noUps: "Doğrulanmış modeller arasında yeterli güçte UPS yok — mühendis seçer.",
    powerEstimate: "Bazı kameraların tüketimi PoE sınıfına göre alındı (tahmin) — PoE bütçesi payla hesaplandı.",
  },
  kp: "Teklif (PDF)", manualStart: "Plansız maliyet hesabı", manualTitle: "Kamera listesine göre maliyet hesabı",
  manualHint: "Katalogdan kamera ekleyin ve adet girin. Kablo uzunluğu kamera başına ortalamadır.", manualAdd: "Ekle", backToPlan: "Tesis planına dön", qty: "Adet", remove: "Sil",
  kpTitle: "Ticari teklif", kpSub: "Video gözetim sisteminin ön hesabı", kpNo: "No. {n}, {d}",
  kpTerms: "Hesap yaklaşıktır: düzenleme tarihindeki katalog fiyatları, 3 gün geçerlidir. Kesin tutarı mühendis tesis keşfinden sonra onaylar.",
  kpContacts: "İletişim", kpAddress: "Taşkent, Katta Darhon Cad. 5", kpHours: "Pzt–Cum 9:00–18:00",
  kpMethod: "Ekipman seçimi — üretici belgelerine göre SAT Camera Designer; montaj — zayıf akım işleri fiyat listesine göre.", kpPlan: "Tesis planı", kpCameras: "Plandaki kameralar",
};

const zh: CdEstUi = {
  title: "报价单", lead: "设备按平面图上的摄像机选配：同品牌录像机、满足存储天数的硬盘、PoE 供电、UPS 和线缆。安装费用按弱电工程价目表计算。",
  empty: "添加摄像机即可生成报价单。", loading: "正在加载价格…", error: "价格未能加载。请刷新页面或把项目发给工程师。",
  archive: "存储天数", record: "录像方式", continuous: "全天录像", motion: "移动侦测录像", codec: "编码",
  trace: "线缆路由", traceNeed: "从零敷设", traceReady: "已有线槽和波纹管", cableAvg: "到机柜的平均线长（米）", mountAvg: "安装高度（米）",
  rackTool: "机柜", rackHint: "把放录像机的机柜放到平面图上，系统会计算到每台摄像机的线长：沿墙走线，含上下引线和 10% 余量。",
  rackNone: "平面图上未标出机柜——线长按平均每台 {m} 米计算。",
  outdoor: "室外安装", outdoorHint: "请标出室外摄像机：其安装单价不同，并需要室外线缆。",
  equipTitle: "设备", laborTitle: "施工", colItem: "项目", colQty: "数量", colPrice: "单价", colSum: "金额",
  units: { pc: "台", bobbin: "卷", m: "米", set: "套" },
  lines: {
    bracket: "支架和接线盒", psu: "无 PoE 摄像机的 12 V 电源", hipoe: "云台摄像机的 Hi-PoE 供电",
    coax: "模拟摄像机用线缆或视频传输器", cableIn: "室内", cableOut: "室外",
  },
  labor: {
    camIn: "室内摄像机安装", camOut: "室外摄像机安装", camPtz: "云台（PTZ）摄像机安装", camPnr: "摄像机调试与投入使用",
    nvr: "录像机安装与设置（16 路以内）", nvrBig: "录像机安装与设置（16 路以上）", remote: "手机远程访问设置",
    switch: "交换机安装", cableOpen: "布线", gofra: "线缆穿波纹管", shtroba: "墙面开槽", cableTray: "线路穿线",
  },
  equipTotal: "设备合计", laborTotal: "施工", total: "合计", range: "{a} – {b}", onRequest: "价格面议",
  onRequestNote: "不含“价格面议”项目（{n} 项）——价格由工程师确认。", engineer: "由工程师选配",
  storage: "存储：{tb} TB — {mbps} Mbps，{days} 天。", poe: "PoE 负载：{w} W",
  bitrateNote: "码率为该分辨率的典型值（估算）：实际码率取决于场景、照明和摄像机设置。",
  review: "需要核实",
  warn: {
    noNvr: "已核实型号中没有适合本任务的网络录像机（路数、接入带宽或存储）——由工程师选配。",
    noDvr: "已核实型号中没有适合模拟摄像机的录像机——由工程师选配。",
    onvif: "{brands} 摄像机通过 ONVIF 接入 {brand} 录像机：部分智能分析功能可能无法使用。",
    longCable: "超过 90 米的线路：{cams}。以太网上限为 100 米，需要中继交换机或光纤。",
    noUps: "已核实型号中没有功率足够的 UPS——由工程师选配。",
    powerEstimate: "部分摄像机功耗按 PoE 等级估算——PoE 预算已留有余量。",
  },
  kp: "商业报价（PDF）", manualStart: "不用平面图报价", manualTitle: "按摄像机清单报价",
  manualHint: "从目录添加摄像机并填写数量。线长按每台平均值计算。", manualAdd: "添加", backToPlan: "返回现场平面图", qty: "数量", remove: "删除",
  kpTitle: "商业报价", kpSub: "视频监控系统初步测算", kpNo: "编号 {n}，{d}",
  kpTerms: "本测算为估算：价格为出具日目录价格，有效期 3 天。准确金额由工程师现场勘察后确认。",
  kpContacts: "联系方式", kpAddress: "塔什干 Katta Darkhon 街 5 号", kpHours: "周一至周五 9:00–18:00",
  kpMethod: "设备由 SAT Camera Designer 按制造商文件选配；安装按弱电工程价目表计价。", kpPlan: "现场平面图", kpCameras: "平面图上的摄像机",
};

export const EST_CONTENT: Record<string, CdEstUi> = { ru, uz, en, tr, zh };
export const estContentFor = (locale: string): CdEstUi => EST_CONTENT[locale] ?? ru;
