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
};

const BY_LOCALE: Record<string, Record<string, ServiceContent>> = { ru, uz };

export function getServiceContent(locale: string, key: string): ServiceContent | null {
  return BY_LOCALE[locale]?.[key] ?? null;
}
