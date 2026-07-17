// Содержательный SEO-текст для топ-денежных страниц услуг /solutions/<key>.
// Цель: глубина контента под голые высокочастотные запросы (видеонаблюдение 590,
// камеры видеонаблюдения 390, скуд 170, пожарная 140, домофон 260/мес — данные
// Google Keyword Planner, гео Узбекистан). Текст — реальная польза, а не набивка:
// что за система, что входит, от чего зависит цена, локальный сигнал (Ташкент/Узбекистан).
//
// Фолбэк: нет ключа для локали → блок просто не рендерится (лучше пусто, чем
// машинный перевод). RU — источник; uz/en догоняются вручную позже.

export type ServiceContent = { heading: string; paragraphs: string[] };

const ru: Record<string, ServiceContent> = {
  cctv: {
    heading: "Установка видеонаблюдения под ключ в Ташкенте и по Узбекистану",
    paragraphs: [
      "SAT Solutions проектирует и монтирует системы видеонаблюдения для объектов любого масштаба — от квартиры и небольшого магазина до заводов, складов и распределённых сетей филиалов. Мы работаем с IP- и аналоговыми (HDCVI/TVI) камерами, устанавливаем видеорегистраторы NVR и DVR, настраиваем локальный и облачный архив, а также удалённый просмотр камер с телефона и компьютера из любой точки.",
      "Установка камер видеонаблюдения начинается с бесплатного выезда инженера на объект: определяем зоны обзора, точки подключения и оптимальное количество камер, после чего готовим смету и коммерческое предложение. В работу входит прокладка кабельных трасс, монтаж оборудования, пусконаладка, настройка детекции движения и видеоаналитики, обучение персонала.",
      "Стоимость видеонаблюдения зависит от числа камер, их разрешения, глубины архива и сложности монтажа — рассчитываем индивидуально под задачу и бюджет. Поставляем оборудование Hikvision, Dahua, HiLook и других проверенных брендов с официальной гарантией, даём гарантию на работы и берём систему на сервисное обслуживание по всему Узбекистану.",
    ],
  },
  access: {
    heading: "Системы контроля доступа (СКУД) в Ташкенте под ключ",
    paragraphs: [
      "Система контроля доступа (СКУД) ограничивает и учитывает проход на объект: сотрудники и посетители попадают внутрь по картам, брелокам, PIN-коду, отпечатку пальца или распознаванию лица. SAT Solutions проектирует и устанавливает СКУД для офисов, бизнес-центров, производств, школ и жилых комплексов — от одной двери до сотен точек прохода с единым управлением.",
      "В состав системы входят контроллеры, считыватели, электромагнитные и электромеханические замки, турникеты и калитки, доводчики и кнопки выхода, а также ПО для гибкой настройки прав доступа по зонам и расписанию. СКУД интегрируется с видеонаблюдением и учётом рабочего времени: события прохода привязываются к видеозаписи, а отработанные часы автоматически выгружаются в табель и 1С.",
      "Мы подбираем оборудование под задачу и бюджет — от бюджетных карточных систем до биометрических терминалов ZKTeco и Hikvision. Устанавливаем СКУД под ключ в Ташкенте и по всему Узбекистану, даём гарантию и берём систему на сервисное обслуживание.",
    ],
  },
  fire: {
    heading: "Монтаж пожарной сигнализации и СОУЭ в Ташкенте",
    paragraphs: [
      "Автоматическая пожарная сигнализация (АПС) обнаруживает возгорание на ранней стадии по дыму, теплу или пламени и запускает систему оповещения и управления эвакуацией (СОУЭ). SAT Solutions выполняет проектирование, поставку и монтаж пожарной сигнализации для офисов, магазинов, складов, производств и общественных зданий в соответствии с нормами пожарной безопасности Узбекистана.",
      "В систему входят пожарные извещатели (дымовые, тепловые, ручные), приёмно-контрольные приборы, звуковые и световые оповещатели, а при необходимости — автоматика управления дымоудалением, пожаротушением и инженерными системами здания. Мы готовим проектную документацию, согласуем её и сдаём объект надзорным органам.",
      "Монтаж пожарной сигнализации ведём под ключ: от расчёта и проекта до пусконаладки и сдачи в эксплуатацию. Предоставляем гарантию, регламентное обслуживание и поддержку по всему Узбекистану, чтобы система всегда была в рабочем состоянии.",
    ],
  },
  intercom: {
    heading: "Установка домофонов в Ташкенте: IP и видеодомофоны",
    paragraphs: [
      "Домофон обеспечивает контроль входа и связь с посетителем до открытия двери. SAT Solutions устанавливает аудио- и видеодомофоны для частных домов, квартир, офисов и жилых комплексов: от простой вызывной панели на одну дверь до многоабонентских IP-систем подъезда с индивидуальными мониторами у жильцов.",
      "Современные IP- и видеодомофоны дают чёткое изображение посетителя, запись событий и просмотр с телефона — вы отвечаете на вызов и открываете дверь удалённо, даже находясь вне дома или офиса. Домофон интегрируется со СКУД, электронными замками и видеонаблюдением в единую систему безопасности объекта.",
      "Подбираем и монтируем домофоны Hikvision, Dahua и других брендов под ваш объект и бюджет. Устанавливаем под ключ в Ташкенте и по Узбекистану — с настройкой удалённого доступа, гарантией и сервисным обслуживанием.",
    ],
  },
  turnstile: {
    heading: "Установка турникетов и проходных в Ташкенте",
    paragraphs: [
      "Турникеты организуют упорядоченный и контролируемый проход на объект: сотрудники и посетители проходят по картам, QR-кодам, отпечатку пальца или распознаванию лица, а система фиксирует каждый вход и выход. SAT Solutions поставляет и устанавливает турникеты для бизнес-центров, заводов, стадионов, школ, фитнес-клубов и проходных предприятий.",
      "Мы работаем с турникетами-триподами, роторными и полноростовыми турникетами, скоростными проходами (speed gate) и калитками для маломобильных посетителей. Турникет объединяется со СКУД и учётом рабочего времени в единую систему: доступ настраивается по зонам и расписанию, а отработанные часы автоматически попадают в табель.",
      "Подбираем модель под проходимость и дизайн объекта, монтируем под ключ в Ташкенте и по всему Узбекистану, интегрируем с существующей системой безопасности. Даём гарантию на оборудование и работы, берём проходную на сервисное обслуживание.",
    ],
  },
  alarm: {
    heading: "Установка охранной сигнализации в Ташкенте",
    paragraphs: [
      "Охранная сигнализация мгновенно оповещает о проникновении на объект: датчики движения, открытия дверей и окон, разбития стекла и тревожные кнопки передают сигнал на пульт охраны и на ваш смартфон. SAT Solutions проектирует и монтирует охранные системы для квартир, домов, офисов, магазинов и складов.",
      "Мы устанавливаем проводные и беспроводные охранные панели, настраиваем разделы и сценарии постановки под охрану, подключаем сирены и оповещение. Систему можно объединить с видеонаблюдением и контролем доступа: тревога сопровождается видеозаписью, а управление ведётся из одного приложения.",
      "Подбираем оборудование под объект и бюджет, устанавливаем под ключ в Ташкенте и по всему Узбекистану. При необходимости выводим сигнал на пульт вневедомственной охраны, даём гарантию и сервисное обслуживание.",
    ],
  },
  network: {
    heading: "Монтаж СКС и локальных сетей (ЛВС) в Ташкенте",
    paragraphs: [
      "Структурированная кабельная система (СКС) — это основа IT-инфраструктуры офиса и предприятия: единая кабельная сеть для компьютеров, телефонии, видеонаблюдения и Wi-Fi. SAT Solutions проектирует и монтирует СКС и локальные сети (ЛВС) для офисов, бизнес-центров, производств и распределённых объектов.",
      "В работу входят прокладка медных и оптических кабельных трасс, установка серверных шкафов и стоек, монтаж патч-панелей, розеток и коммутаторов, организация серверной, маркировка и тестирование каждой линии. Мы сдаём кабельный журнал и исполнительную документацию.",
      "Проектируем сеть с запасом под рост нагрузки, используем оборудование проверенных брендов и соблюдаем стандарты монтажа. Выполняем работы под ключ в Ташкенте и по всему Узбекистану — с гарантией и последующим сервисным сопровождением.",
    ],
  },
  wifi: {
    heading: "Настройка Wi-Fi сетей для офиса в Ташкенте",
    paragraphs: [
      "Надёжный Wi-Fi — обязательное условие работы современного офиса, склада, отеля или производства. SAT Solutions проектирует и настраивает беспроводные сети с бесшовным роумингом, чтобы устройства переключались между точками доступа без разрывов, а покрытие было стабильным на всей площади объекта.",
      "Мы выполняем радиообследование, рассчитываем количество и расположение точек доступа, монтируем оборудование и настраиваем контроллер, гостевые сети, ограничение скорости и авторизацию. Корпоративный Wi-Fi отделяется от гостевого, а нагрузка распределяется между точками для стабильной работы.",
      "Используем оборудование Ubiquiti, MikroTik, TP-Link и других проверенных брендов, подбираем решение под площадь и число пользователей. Настраиваем Wi-Fi под ключ в Ташкенте и по всему Узбекистану — с гарантией и поддержкой.",
    ],
  },
  gates: {
    heading: "Установка и автоматизация ворот в Ташкенте",
    paragraphs: [
      "Автоматические ворота — это удобство и безопасность въезда: створки открываются с пульта, по телефону или автоматически при распознавании номера автомобиля. SAT Solutions устанавливает и автоматизирует откатные, распашные, секционные и роллетные ворота для частных домов, предприятий, складов и жилых комплексов.",
      "Мы подбираем и монтируем приводы под вес и тип ворот, устанавливаем фотоэлементы безопасности, сигнальные лампы, пульты и кнопки, при необходимости подключаем распознавание автономеров (ANPR) и интеграцию со СКУД. Автоматику ставим как на новые, так и на уже установленные ворота.",
      "Используем надёжные приводы проверенных производителей, настраиваем плавное открытие и защиту от защемления. Выполняем работы под ключ в Ташкенте и по всему Узбекистану — с гарантией и сервисным обслуживанием.",
    ],
  },
  barrier: {
    heading: "Установка автоматических шлагбаумов в Ташкенте",
    paragraphs: [
      "Шлагбаум ограничивает и упорядочивает въезд на территорию: стрела поднимается с пульта, по карте, по телефону или автоматически при распознавании автономера. SAT Solutions поставляет и устанавливает автоматические шлагбаумы для парковок, дворов, предприятий, бизнес-центров и жилых комплексов.",
      "Мы подбираем шлагбаум под ширину проезда и интенсивность движения, монтируем тумбу и стрелу, устанавливаем фотоэлементы и петли безопасности, подключаем пульты, брелоки и распознавание номеров (ANPR) с белым списком. Шлагбаум интегрируется с системой парковки и СКУД.",
      "Ставим оборудование, рассчитанное на интенсивную работу, настраиваем логику проезда и защиту от опускания на автомобиль. Монтируем под ключ в Ташкенте и по всему Узбекистану — с гарантией и обслуживанием.",
    ],
  },
  smarthome: {
    heading: "Установка систем умного дома в Ташкенте",
    paragraphs: [
      "Умный дом объединяет освещение, климат, шторы, видеонаблюдение, охрану и бытовые сценарии в одном приложении на смартфоне. SAT Solutions проектирует и устанавливает системы умного дома для квартир, коттеджей, офисов и апартаментов — от отдельных сценариев до полной автоматизации объекта.",
      "Мы настраиваем управление светом и климатом, автоматические сценарии (утро, отъезд, ночь), датчики движения, протечки и дыма, умные розетки и выключатели, а также интеграцию с видеонаблюдением и охранной сигнализацией. Управлять домом можно голосом, со смартфона или по расписанию.",
      "Подбираем оборудование под задачи и бюджет, работаем с проводными и беспроводными решениями. Устанавливаем умный дом под ключ в Ташкенте и по всему Узбекистану — с настройкой, обучением и гарантией.",
    ],
  },
  attendance: {
    heading: "Системы учёта рабочего времени в Ташкенте",
    paragraphs: [
      "Система учёта рабочего времени автоматически фиксирует приход и уход сотрудников по карте, отпечатку пальца или распознаванию лица и формирует точный табель без ручных подсчётов. SAT Solutions внедряет учёт рабочего времени для офисов, производств, магазинов и предприятий любого размера.",
      "Мы устанавливаем биометрические терминалы и считыватели, настраиваем графики, смены, опоздания и переработки, а данные автоматически выгружаются в табель и 1С. Учёт времени объединяется со СКУД: один терминал и контролирует доступ, и считает отработанные часы.",
      "Подбираем оборудование под численность персонала и задачи, настраиваем отчёты под вашу учётную политику. Внедряем под ключ в Ташкенте и по всему Узбекистану — с обучением, гарантией и поддержкой.",
    ],
  },
};

const uz: Record<string, ServiceContent> = {
  cctv: {
    heading: "Toshkent va O'zbekiston bo'ylab kalit topshirish asosida videokuzatuv o'rnatish",
    paragraphs: [
      "SAT Solutions har qanday miqyosdagi obyektlar uchun videokuzatuv tizimlarini loyihalaydi va o'rnatadi — kvartira va kichik do'kondan tortib zavodlar, omborlar va filiallar tarmog'igacha. Biz IP va analog (HDCVI/TVI) kameralar bilan ishlaymiz, NVR va DVR videoregistratorlarini o'rnatamiz, lokal va bulutli arxivni hamda telefon va kompyuterdan masofaviy ko'rishni sozlaymiz.",
      "Videokuzatuv kameralarini o'rnatish muhandisning obyektga bepul chiqishidan boshlanadi: ko'rish zonalari, ulanish nuqtalari va kameralarning maqbul sonini aniqlaymiz, so'ng smeta va tijorat taklifini tayyorlaymiz. Ishga kabel trassalarini yotqizish, uskunani montaj qilish, ishga tushirish, harakatni aniqlash va videotahlilni sozlash, xodimlarni o'qitish kiradi.",
      "Videokuzatuv narxi kameralar soni, ularning ruxsati, arxiv chuqurligi va montaj murakkabligiga bog'liq — har bir vazifa va byudjet uchun alohida hisoblaymiz. Hikvision, Dahua, HiLook va boshqa ishonchli brendlar uskunasini rasmiy kafolat bilan yetkazamiz, ishlarga kafolat beramiz va tizimni butun O'zbekiston bo'ylab servis xizmatiga olamiz.",
    ],
  },
  access: {
    heading: "Toshkentda kirishni boshqarish tizimi (SKUD) kalit topshirish asosida",
    paragraphs: [
      "Kirishni boshqarish tizimi (SKUD) obyektga o'tishni cheklaydi va hisobga oladi: xodimlar va tashrifchilar ichkariga kartalar, breloklar, PIN-kod, barmoq izi yoki yuzni aniqlash orqali kiradi. SAT Solutions ofislar, biznes-markazlar, ishlab chiqarish, maktablar va turar-joy majmualari uchun SKUD loyihalaydi va o'rnatadi — bitta eshikdan yagona boshqaruvli yuzlab o'tish nuqtalarigacha.",
      "Tizim tarkibiga kontrollerlar, o'quvchilar, elektromagnit va elektromexanik qulflar, turniketlar va kalitkalar, dovodchiklar va chiqish tugmalari, shuningdek zonalar va jadval bo'yicha kirish huquqlarini moslashuvchan sozlash uchun dastur kiradi. SKUD videokuzatuv va ish vaqtini hisobga olish bilan integratsiyalashadi: o'tish hodisalari videoyozuvga bog'lanadi, ishlangan soatlar esa tabel va 1C ga avtomatik yuklanadi.",
      "Biz uskunani vazifa va byudjetga qarab tanlaymiz — arzon kartali tizimlardan ZKTeco va Hikvision biometrik terminallarigacha. SKUD ni Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida o'rnatamiz, kafolat beramiz va tizimni servis xizmatiga olamiz.",
    ],
  },
  fire: {
    heading: "Toshkentda yong'in signalizatsiyasi va SOUE montaji",
    paragraphs: [
      "Avtomatik yong'in signalizatsiyasi (APS) yong'inni tutun, issiqlik yoki alanga bo'yicha erta bosqichda aniqlaydi va ogohlantirish hamda evakuatsiyani boshqarish tizimini (SOUE) ishga tushiradi. SAT Solutions ofislar, do'konlar, omborlar, ishlab chiqarish va jamoat binolari uchun yong'in signalizatsiyasini O'zbekiston yong'in xavfsizligi normalariga muvofiq loyihalash, yetkazib berish va montaj qilishni bajaradi.",
      "Tizimga yong'in datchiklari (tutun, issiqlik, qo'l), qabul-nazorat qurilmalari, ovozli va yorug'lik ogohlantirgichlari, zarur bo'lganda esa tutunni chiqarish, yong'inni o'chirish va binoning muhandislik tizimlarini boshqarish avtomatikasi kiradi. Biz loyiha hujjatlarini tayyorlaymiz, kelishib olamiz va obyektni nazorat organlariga topshiramiz.",
      "Yong'in signalizatsiyasi montajini kalit topshirish asosida olib boramiz: hisob-kitob va loyihadan ishga tushirish va foydalanishga topshirishgacha. Tizim doimo ishchi holatda bo'lishi uchun kafolat, reglament xizmat va butun O'zbekiston bo'ylab qo'llab-quvvatlash beramiz.",
    ],
  },
  intercom: {
    heading: "Toshkentda domofon o'rnatish: IP va video domofonlar",
    paragraphs: [
      "Domofon kirishni nazorat qilish va eshik ochilishidan oldin tashrifchi bilan aloqani ta'minlaydi. SAT Solutions xususiy uylar, kvartiralar, ofislar va turar-joy majmualari uchun audio va video domofonlarni o'rnatadi: bitta eshikka oddiy chaqiruv panelidan tortib har bir kvartirada alohida monitorli ko'p abonentli IP-tizimlargacha.",
      "Zamonaviy IP va video domofonlar tashrifchining aniq tasvirini, hodisalar yozuvini va telefondan ko'rishni beradi — siz chaqiruvga javob berasiz va eshikni masofadan ochasiz, hatto uy yoki ofisdan tashqarida bo'lsangiz ham. Domofon SKUD, elektron qulflar va videokuzatuv bilan yagona xavfsizlik tizimiga integratsiyalashadi.",
      "Hikvision, Dahua va boshqa brendlar domofonlarini obyektingiz va byudjetingizga mos tanlaymiz va montaj qilamiz. Toshkentda va O'zbekiston bo'ylab kalit topshirish asosida — masofaviy kirishni sozlash, kafolat va servis xizmati bilan o'rnatamiz.",
    ],
  },
  turnstile: {
    heading: "Toshkentda turniketlar va o'tish yo'laklarini o'rnatish",
    paragraphs: [
      "Turniketlar obyektga tartibli va nazorat qilinadigan o'tishni tashkil etadi: xodimlar va tashrifchilar kartalar, QR-kodlar, barmoq izi yoki yuzni aniqlash orqali o'tadi, tizim esa har bir kirish va chiqishni qayd etadi. SAT Solutions biznes-markazlar, zavodlar, stadionlar, maktablar, fitnes-klublar va korxona o'tish joylari uchun turniketlarni yetkazib beradi va o'rnatadi.",
      "Biz tripod, rotorli va to'liq bo'yli turniketlar, tezkor o'tish yo'laklari (speed gate) va nogiron tashrifchilar uchun kalitkalar bilan ishlaymiz. Turniket SKUD va ish vaqtini hisobga olish bilan yagona tizimga birlashadi: kirish zonalar va jadval bo'yicha sozlanadi, ishlangan soatlar esa avtomatik tabelga tushadi.",
      "Modelni obyektning o'tkazuvchanligi va dizayniga qarab tanlaymiz, Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida montaj qilamiz, mavjud xavfsizlik tizimi bilan integratsiya qilamiz. Uskuna va ishlarga kafolat beramiz, o'tish joyini servis xizmatiga olamiz.",
    ],
  },
  alarm: {
    heading: "Toshkentda qo'riqlash signalizatsiyasini o'rnatish",
    paragraphs: [
      "Qo'riqlash signalizatsiyasi obyektga kirishni bir zumda xabar beradi: harakat, eshik va deraza ochilishi, oyna sinishi datchiklari va trevoga tugmalari signalni qo'riqlash pultiga va smartfoningizga uzatadi. SAT Solutions kvartiralar, uylar, ofislar, do'konlar va omborlar uchun qo'riqlash tizimlarini loyihalaydi va montaj qiladi.",
      "Biz simli va simsiz qo'riqlash panellarini o'rnatamiz, qo'riqlashga qo'yish bo'limlari va ssenariylarini sozlaymiz, sirenalar va ogohlantirishni ulaymiz. Tizimni videokuzatuv va kirishni boshqarish bilan birlashtirish mumkin: trevoga videoyozuv bilan hamroh bo'ladi, boshqaruv esa bitta ilovadan olib boriladi.",
      "Uskunani obyekt va byudjetga qarab tanlaymiz, Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida o'rnatamiz. Zarur bo'lganda signalni idoraviy bo'lmagan qo'riqlash pultiga chiqaramiz, kafolat va servis xizmatini beramiz.",
    ],
  },
  network: {
    heading: "Toshkentda SKS va lokal tarmoqlar (LVS) montaji",
    paragraphs: [
      "Strukturali kabel tizimi (SKS) — ofis va korxona IT-infratuzilmasining asosi: kompyuterlar, telefoniya, videokuzatuv va Wi-Fi uchun yagona kabel tarmog'i. SAT Solutions ofislar, biznes-markazlar, ishlab chiqarish va taqsimlangan obyektlar uchun SKS va lokal tarmoqlarni (LVS) loyihalaydi va montaj qiladi.",
      "Ishga mis va optik kabel trassalarini yotqizish, server shkaflari va stoykalarini o'rnatish, patch-panellar, rozetkalar va kommutatorlarni montaj qilish, server xonasini tashkil etish, har bir liniyani belgilash va sinovdan o'tkazish kiradi. Biz kabel jurnali va ijro hujjatlarini topshiramiz.",
      "Tarmoqni yuklama o'sishi zaxirasi bilan loyihalaymiz, ishonchli brendlar uskunasidan foydalanamiz va montaj standartlariga rioya qilamiz. Ishlarni Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida bajaramiz — kafolat va keyingi servis bilan.",
    ],
  },
  wifi: {
    heading: "Toshkentda ofis uchun Wi-Fi tarmoqlarini sozlash",
    paragraphs: [
      "Ishonchli Wi-Fi — zamonaviy ofis, ombor, mehmonxona yoki ishlab chiqarish ishining majburiy sharti. SAT Solutions uzluksiz rouming bilan simsiz tarmoqlarni loyihalaydi va sozlaydi, shunda qurilmalar kirish nuqtalari o'rtasida uzilishlarsiz o'tadi, qamrov esa butun obyekt maydonida barqaror bo'ladi.",
      "Biz radio tekshiruvni bajaramiz, kirish nuqtalari soni va joylashuvini hisoblaymiz, uskunani montaj qilamiz va kontroller, mehmon tarmoqlari, tezlik cheklovi va avtorizatsiyani sozlaymiz. Korporativ Wi-Fi mehmon tarmog'idan ajratiladi, yuklama esa barqaror ish uchun nuqtalar o'rtasida taqsimlanadi.",
      "Ubiquiti, MikroTik, TP-Link va boshqa ishonchli brendlar uskunasidan foydalanamiz, yechimni maydon va foydalanuvchilar soniga qarab tanlaymiz. Wi-Fi ni Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida sozlaymiz — kafolat va qo'llab-quvvatlash bilan.",
    ],
  },
  gates: {
    heading: "Toshkentda darvozalarni o'rnatish va avtomatlashtirish",
    paragraphs: [
      "Avtomatik darvozalar — kirishning qulayligi va xavfsizligi: tavaqalar pultdan, telefon orqali yoki avtomobil raqamini aniqlashda avtomatik ochiladi. SAT Solutions xususiy uylar, korxonalar, omborlar va turar-joy majmualari uchun suriladigan, ochiladigan, seksiyali va rolikli darvozalarni o'rnatadi va avtomatlashtiradi.",
      "Biz privodlarni darvozaning og'irligi va turiga qarab tanlaymiz va montaj qilamiz, xavfsizlik fotoelementlari, signal chiroqlari, pultlar va tugmalarni o'rnatamiz, zarur bo'lganda avtoraqamni aniqlash (ANPR) va SKUD bilan integratsiyani ulaymiz. Avtomatikani ham yangi, ham allaqachon o'rnatilgan darvozalarga qo'yamiz.",
      "Ishonchli ishlab chiqaruvchilarning privodlaridan foydalanamiz, silliq ochilish va qisilishdan himoyani sozlaymiz. Ishlarni Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida bajaramiz — kafolat va servis xizmati bilan.",
    ],
  },
  barrier: {
    heading: "Toshkentda avtomatik shlagbaumlarni o'rnatish",
    paragraphs: [
      "Shlagbaum hududga kirishni cheklaydi va tartibga soladi: strela pultdan, karta orqali, telefon orqali yoki avtoraqamni aniqlashda avtomatik ko'tariladi. SAT Solutions avtoturargohlar, hovlilar, korxonalar, biznes-markazlar va turar-joy majmualari uchun avtomatik shlagbaumlarni yetkazib beradi va o'rnatadi.",
      "Biz shlagbaumni o'tish kengligi va harakat intensivligiga qarab tanlaymiz, tumba va strelani montaj qilamiz, fotoelementlar va xavfsizlik halqalarini o'rnatamiz, pultlar, breloklar va oq ro'yxatli raqamni aniqlash (ANPR) ni ulaymiz. Shlagbaum avtoturargoh tizimi va SKUD bilan integratsiyalashadi.",
      "Intensiv ishlash uchun mo'ljallangan uskunani o'rnatamiz, o'tish mantiqini va avtomobilga tushishdan himoyani sozlaymiz. Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida montaj qilamiz — kafolat va xizmat bilan.",
    ],
  },
  smarthome: {
    heading: "Toshkentda aqlli uy tizimlarini o'rnatish",
    paragraphs: [
      "Aqlli uy yoritish, iqlim, pardalar, videokuzatuv, qo'riqlash va maishiy ssenariylarni smartfondagi bitta ilovada birlashtiradi. SAT Solutions kvartiralar, kottejlar, ofislar va apartamentlar uchun aqlli uy tizimlarini loyihalaydi va o'rnatadi — alohida ssenariylardan tortib obyektni to'liq avtomatlashtirishgacha.",
      "Biz yorug'lik va iqlimni boshqarishni, avtomatik ssenariylarni (ertalab, ketish, tun), harakat, suv oqishi va tutun datchiklarini, aqlli rozetkalar va o'chirgichlarni, shuningdek videokuzatuv va qo'riqlash signalizatsiyasi bilan integratsiyani sozlaymiz. Uyni ovoz bilan, smartfondan yoki jadval bo'yicha boshqarish mumkin.",
      "Uskunani vazifa va byudjetga qarab tanlaymiz, simli va simsiz yechimlar bilan ishlaymiz. Aqlli uyni Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida o'rnatamiz — sozlash, o'qitish va kafolat bilan.",
    ],
  },
  attendance: {
    heading: "Toshkentda ish vaqtini hisobga olish tizimlari",
    paragraphs: [
      "Ish vaqtini hisobga olish tizimi xodimlarning kelishi va ketishini karta, barmoq izi yoki yuzni aniqlash orqali avtomatik qayd etadi va qo'lda hisoblashsiz aniq tabel shakllantiradi. SAT Solutions ofislar, ishlab chiqarish, do'konlar va har qanday o'lchamdagi korxonalar uchun ish vaqtini hisobga olishni joriy etadi.",
      "Biz biometrik terminallar va o'quvchilarni o'rnatamiz, jadvallar, smenalar, kechikishlar va qo'shimcha ishlarni sozlaymiz, ma'lumotlar esa tabel va 1C ga avtomatik yuklanadi. Vaqtni hisobga olish SKUD bilan birlashadi: bitta terminal ham kirishni nazorat qiladi, ham ishlangan soatlarni hisoblaydi.",
      "Uskunani xodimlar soni va vazifalarga qarab tanlaymiz, hisobotlarni sizning hisob siyosatingizga moslab sozlaymiz. Toshkentda va butun O'zbekiston bo'ylab kalit topshirish asosida joriy etamiz — o'qitish, kafolat va qo'llab-quvvatlash bilan.",
    ],
  },
};

const BY_LOCALE: Record<string, Record<string, ServiceContent>> = { ru, uz };

export function getServiceContent(locale: string, key: string): ServiceContent | null {
  return BY_LOCALE[locale]?.[key] ?? null;
}
