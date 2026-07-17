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
];

export const articleBySlug: Record<string, Article> = Object.fromEntries(ARTICLES.map((a) => [a.slug, a]));

// Статьи, доступные для локали (есть перевод) — для списка и sitemap.
export function articlesForLocale(locale: string): Article[] {
  return ARTICLES.filter((a) => a.loc[locale]);
}
