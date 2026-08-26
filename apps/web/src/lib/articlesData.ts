// Инфо-статьи (блог) под предпокупочный long-tail: «сколько стоит видеонаблюдение»,
// «как выбрать камеру», «что такое СКУД» и т.п. Такие запросы легче ранжируются и
// приводят целевой трафик, который перелинковкой (related) уходит на коммерческие
// страницы услуг /solutions/<key>. RU + UZ (два языка рынка).
//
// Рендер: /blog (список) + /blog/<slug> (статья, Article + BreadcrumbList JSON-LD).
// Локаль без контента статьи → её нет в списке и detail отдаёт 404 (чистый hreflang).

export type ArticleSection = { h: string; p: string[] };
export type ArticleFaqItem = { q: string; a: string };
// faq → блок «Частые вопросы» + FAQPage JSON-LD на странице статьи (rich-сниппеты)
export type ArticleBody = { title: string; excerpt: string; sections: ArticleSection[]; faq?: ArticleFaqItem[] };

// Обложка статьи: /blog-img/<slug>.jpg в public (карточка списка + фон шапки статьи)
export const articleImg = (slug: string) => `/blog-img/${slug}.jpg`;
export type Article = {
  slug: string;
  date: string;              // ISO — дата публикации
  related: string[];         // ключи услуг для перелинковки (serviceByKey)
  loc: Record<string, ArticleBody>;
};

export const ARTICLES: Article[] = [
  {
    slug: "elektronnyj-zamok-na-dver-kak-vybrat",
    date: "2026-08-05",
    related: ["locks", "access", "intercom"],
    loc: {
      ru: {
        title: "Электронный замок на дверь: магнитный, кодовый или smart — что выбрать",
        excerpt: "Электромагнитный, электромеханический, кодовый или smart-замок: чем они отличаются, что подходит офису, квартире и калитке — и когда замок стоит подключать к домофону и СКУД.",
        sections: [
          { h: "Четыре типа электронных замков", p: [
            "Электромагнитный замок держит дверь силой магнита — от 180 до 500 кг удержания. Он не имеет движущихся частей, потому практически вечен, но требует постоянного питания: пропало электричество — дверь открыта. Ставится на входные двери офисов и подъездов в паре с доводчиком.",
            "Электромеханический замок, наоборот, заперт и без питания — ригель удерживает дверь механически, а электричество нужно только на открытие. Это выбор для калиток и дверей, которые должны оставаться запертыми при отключении света. Кодовый замок и smart-замок — это по сути способ управления: клавиатура с кодом, карта, отпечаток пальца или приложение на смартфоне.",
          ] },
          { h: "Что ставить на офис, квартиру и калитку", p: [
            "Для двери офиса классика — электромагнитный замок со считывателем карт и кнопкой выхода: сотрудники проходят по карте или отпечатку, журнал фиксирует, кто и когда вошёл. Для серверной или кабинета руководителя добавляют второй фактор — код плюс карта.",
            "В квартиру чаще ставят smart-замок: открытие с телефона, временные коды для гостей и уборщицы, уведомления о каждом открытии. На уличную калитку — электромеханический замок в погодозащищённом исполнении: он переживает дождь и пыль и не откроется при отключении электричества.",
          ] },
          { h: "Замок + домофон + СКУД: когда объединять", p: [
            "Замок редко живёт один. В связке с видеодомофоном он открывается кнопкой с монитора или из приложения — гостя видно до того, как открыли. В офисной СКУД замки на всех дверях управляются одной системой: уволили сотрудника — доступ отозван одним кликом, а не сбором ключей.",
            "Важный момент по нормам: на путях эвакуации электромагнитные замки обязаны разблокироваться при пожарной тревоге. Мы всегда подключаем замки к пожарной сигнализации, если она есть на объекте — это требование, а не опция.",
          ] },
        ],
        faq: [
          { q: "Что будет с замком при отключении света?", a: "Электромагнитный откроется (fail-open), электромеханический останется заперт (fail-secure). Для дверей, которые должны быть заперты всегда, ставят электромеханику или добавляют ИБП; для путей эвакуации разблокировка при пропадании питания — требование норм." },
          { q: "Сколько стоит электронный замок с установкой?", a: "Бюджетный электромагнитный замок с кнопкой выхода и установкой — самый доступный вариант; smart-замок или биометрический считыватель дороже. Точную смету считаем после короткого осмотра двери — обычно в тот же день." },
          { q: "Можно ли открывать замок с телефона?", a: "Да — smart-замки открываются из приложения, а замок в связке с IP-домофоном или СКУД открывается из их приложений, в том числе удалённо: например, впустить курьера, пока вы не в офисе." },
        ],
      },
      uz: {
        title: "Eshikka elektron qulf: magnit, kodli yoki smart — qaysi birini tanlash",
        excerpt: "Elektromagnit, elektromexanik, kodli yoki smart-qulf: ular nimasi bilan farq qiladi, ofis, kvartira va kalitkaga nima mos keladi — va qulfni qachon domofon hamda SKUDga ulash kerak.",
        sections: [
          { h: "Elektron qulflarning to'rt turi", p: [
            "Elektromagnit qulf eshikni magnit kuchi bilan ushlaydi — 180 dan 500 kg gacha. Harakatlanuvchi qismlari yo'q, shuning uchun deyarli abadiy, lekin doimiy quvvat talab qiladi: elektr o'chsa — eshik ochiq. Ofis va pod'ezd kirish eshiklariga dovodchik bilan juft qo'yiladi.",
            "Elektromexanik qulf, aksincha, quvvatsiz ham yopiq — rigel eshikni mexanik ushlaydi, elektr faqat ochish uchun kerak. Bu svet o'chganda yopiq qolishi kerak bo'lgan kalitka va eshiklar uchun tanlov. Kodli va smart-qulf — bu aslida boshqarish usuli: kodli klaviatura, karta, barmoq izi yoki smartfondagi ilova.",
          ] },
          { h: "Ofis, kvartira va kalitkaga nima qo'yish kerak", p: [
            "Ofis eshigi uchun klassika — karta o'quvchisi va chiqish tugmasi bilan elektromagnit qulf: xodimlar karta yoki barmoq izi bilan o'tadi, jurnal kim va qachon kirganini qayd etadi. Serverxona yoki rahbar kabinetiga ikkinchi omil qo'shiladi — kod plyus karta.",
            "Kvartiraga ko'proq smart-qulf qo'yiladi: telefondan ochish, mehmonlar uchun vaqtinchalik kodlar, har ochilish haqida bildirishnoma. Ko'cha kalitkasiga — ob-havodan himoyalangan elektromexanik qulf: u yomg'ir va changga chidaydi, elektr o'chganda ochilib qolmaydi.",
          ] },
          { h: "Qulf + domofon + SKUD: qachon birlashtirish kerak", p: [
            "Qulf kamdan-kam yolg'iz ishlaydi. Videodomofon bilan juftlikda u monitor tugmasi yoki ilovadan ochiladi — mehmonni ochishdan oldin ko'rasiz. Ofis SKUDida barcha eshiklardagi qulflar bitta tizimdan boshqariladi: xodim ishdan ketdi — kirish bir klik bilan bekor qilinadi.",
            "Me'yorlar bo'yicha muhim jihat: evakuatsiya yo'llaridagi elektromagnit qulflar yong'in signalida ochilishi SHART. Obyektda yong'in signalizatsiyasi bo'lsa, qulflarni doim unga ulaymiz — bu talab, tanlov emas.",
          ] },
        ],
        faq: [
          { q: "Svet o'chganda qulf nima bo'ladi?", a: "Elektromagnit ochiladi (fail-open), elektromexanik yopiq qoladi (fail-secure). Doim yopiq bo'lishi kerak eshiklarga elektromexanika yoki UPS qo'yiladi; evakuatsiya yo'llarida quvvat yo'qolganda ochilish — me'yor talabi." },
          { q: "Elektron qulf o'rnatish bilan qancha turadi?", a: "Chiqish tugmali byudjet elektromagnit qulf o'rnatish bilan — eng arzon variant; smart-qulf yoki biometrik o'quvchi qimmatroq. Aniq smetani eshikni qisqa ko'rikdan so'ng hisoblaymiz — odatda o'sha kuni." },
          { q: "Qulfni telefondan ochish mumkinmi?", a: "Ha — smart-qulflar ilovadan ochiladi, IP-domofon yoki SKUD bilan bog'langan qulf esa ularning ilovalaridan, jumladan masofadan: masalan, ofisda bo'lmaganingizda kuryerni kiritish." },
        ],
      },
      en: {
        title: "Electronic door lock: magnetic, coded or smart — which to choose",
        excerpt: "Electromagnetic, electromechanical, coded or smart lock: how they differ, what suits an office, a flat and a gate — and when a lock should be tied to an intercom and access control.",
        sections: [
          { h: "Four types of electronic locks", p: [
            "An electromagnetic lock holds the door by magnet force — 180 to 500 kg. It has no moving parts, so it lasts practically forever, but it needs constant power: power gone — door open. It goes on office and entrance doors paired with a closer.",
            "An electromechanical lock is the opposite: locked even without power — the bolt holds mechanically, electricity is only needed to open. That is the choice for gates and doors that must stay locked in a blackout. Coded and smart locks are essentially a control method: a keypad, a card, a fingerprint or a phone app.",
          ] },
          { h: "What to put on an office, a flat and a gate", p: [
            "For an office door the classic is an electromagnetic lock with a card reader and an exit button: staff pass by card or fingerprint and the log records who entered and when. A server room or a director's office gets a second factor — code plus card.",
            "A flat more often gets a smart lock: phone unlocking, temporary codes for guests, notifications on every opening. An outdoor gate takes a weatherproof electromechanical lock: it survives rain and dust and will not swing open in a blackout.",
          ] },
          { h: "Lock + intercom + access control: when to combine", p: [
            "A lock rarely lives alone. Paired with a video intercom it opens from the monitor or the app — you see the guest before the door opens. In office access control every door lock is run by one system: an employee leaves — access is revoked in one click, not by collecting keys.",
            "A code note: on escape routes electromagnetic locks must release on a fire alarm. We always wire locks to the fire alarm where one exists — that is a requirement, not an option.",
          ] },
        ],
        faq: [
          { q: "What happens to the lock in a power cut?", a: "An electromagnetic lock opens (fail-open), an electromechanical one stays locked (fail-secure). Doors that must always stay locked get electromechanics or a UPS; escape routes must unlock on power loss by code." },
          { q: "How much does an electronic lock with installation cost?", a: "A budget electromagnetic lock with an exit button and installation is the most affordable option; a smart lock or biometric reader costs more. We quote after a short door survey — usually the same day." },
          { q: "Can the lock be opened from a phone?", a: "Yes — smart locks open from an app, and a lock tied to an IP intercom or access control opens from their apps, including remotely: for instance letting a courier in while you are away." },
        ],
      },
      tr: {
        title: "Elektronik kapı kilidi: manyetik, şifreli veya akıllı — hangisi seçilmeli",
        excerpt: "Elektromanyetik, elektromekanik, şifreli veya akıllı kilit: farkları neler, ofise, daireye ve bahçe kapısına ne uyar — kilit ne zaman interkom ve geçiş kontrolüne bağlanmalı.",
        sections: [
          { h: "Dört tip elektronik kilit", p: [
            "Elektromanyetik kilit kapıyı mıknatıs gücüyle tutar — 180–500 kg. Hareketli parçası yoktur, bu yüzden neredeyse sonsuz ömürlüdür; ama sürekli güç ister: elektrik gitti — kapı açık. Ofis ve bina girişlerine kapı kapatıcıyla birlikte takılır.",
            "Elektromekanik kilit tam tersidir: güç olmadan da kilitlidir — dil kapıyı mekanik tutar, elektrik yalnızca açmak için gerekir. Elektrik kesintisinde kilitli kalması gereken bahçe kapıları için seçimdir. Şifreli ve akıllı kilitler aslında kontrol yöntemidir: tuş takımı, kart, parmak izi veya telefon uygulaması.",
          ] },
          { h: "Ofise, daireye ve bahçe kapısına ne konur", p: [
            "Ofis kapısı için klasik: kart okuyuculu ve çıkış butonlu elektromanyetik kilit — personel kartla veya parmak iziyle geçer, günlük kimin ne zaman girdiğini kaydeder. Sunucu odasına ikinci faktör eklenir — şifre artı kart.",
            "Daireye daha çok akıllı kilit takılır: telefondan açma, misafirler için geçici şifreler, her açılışta bildirim. Dış bahçe kapısına hava koşullarına dayanıklı elektromekanik kilit uygundur.",
          ] },
          { h: "Kilit + interkom + geçiş kontrolü: ne zaman birleştirilir", p: [
            "Kilit nadiren tek başına çalışır. Görüntülü interkomla monitörden veya uygulamadan açılır — misafiri kapıyı açmadan görürsünüz. Ofis geçiş kontrolünde tüm kapı kilitleri tek sistemden yönetilir: çalışan ayrıldı — erişim tek tıkla iptal.",
            "Yönetmelik notu: kaçış yollarındaki elektromanyetik kilitler yangın alarmında açılmak ZORUNDADIR. Tesiste yangın alarmı varsa kilitleri her zaman ona bağlarız.",
          ] },
        ],
        faq: [
          { q: "Elektrik kesintisinde kilide ne olur?", a: "Elektromanyetik açılır (fail-open), elektromekanik kilitli kalır (fail-secure). Hep kilitli kalması gereken kapılara elektromekanik veya UPS konur; kaçış yolları yönetmelik gereği güç kesilince açılmalıdır." },
          { q: "Montajla elektronik kilit ne kadar?", a: "Çıkış butonlu bütçe elektromanyetik kilit montajla en uygun seçenektir; akıllı kilit veya biyometrik okuyucu daha pahalıdır. Kısa bir kapı keşfinden sonra fiyat veririz — genelde aynı gün." },
          { q: "Kilit telefondan açılabilir mi?", a: "Evet — akıllı kilitler uygulamadan açılır; IP interkom veya geçiş kontrolüne bağlı kilit de onların uygulamalarından, uzaktan dahil açılır." },
        ],
      },
      zh: {
        title: "电子门锁怎么选：磁力锁、密码锁还是智能锁",
        excerpt: "电磁锁、电机械锁、密码锁与智能锁的区别，办公室、住宅与院门各适合哪种——以及何时应把门锁接入可视对讲与门禁系统。",
        sections: [
          { h: "电子锁的四种类型", p: [
            "电磁锁靠磁力吸持门体——吸力 180 至 500 公斤。没有运动部件，几乎不会损坏，但需要持续供电：断电即开门。通常与闭门器配套装在办公室和单元门上。",
            "电机械锁正相反：断电时仍然锁闭——锁舌机械保持，电力只用于开锁。适合停电时必须保持锁闭的院门。密码锁和智能锁本质上是控制方式：键盘输码、刷卡、指纹或手机 App。",
          ] },
          { h: "办公室、住宅、院门分别装什么", p: [
            "办公室门的经典配置：电磁锁加读卡器加出门按钮——员工刷卡或指纹通行，日志记录每次进出。机房或经理室可加第二重验证——密码加卡。",
            "住宅更常用智能锁：手机开锁、给访客的临时密码、每次开门推送通知。室外院门用防水防尘的电机械锁：耐雨淋灰尘，停电也不会自动打开。",
          ] },
          { h: "门锁与对讲、门禁何时联动", p: [
            "门锁很少单独工作。与可视对讲联动后，可在室内机或 App 上开门——先看到访客再放行。办公门禁中所有门锁由一套系统管理：员工离职，一键撤权，无需收钥匙。",
            "规范要点：疏散通道上的电磁锁在火警时必须自动释放。若现场有火灾报警系统，我们一律将门锁与其联动——这是强制要求。",
          ] },
        ],
        faq: [
          { q: "停电时门锁会怎样？", a: "电磁锁断电即开（fail-open），电机械锁保持锁闭（fail-secure）。必须常闭的门选电机械锁或配 UPS；疏散通道按规范必须断电即开。" },
          { q: "电子锁连安装多少钱？", a: "带出门按钮的基础电磁锁连安装最经济；智能锁或生物识别读头更贵。简单查看门体后即可报价——通常当天完成。" },
          { q: "能用手机开锁吗？", a: "可以——智能锁通过 App 开启；接入 IP 对讲或门禁的门锁也可在对应 App 中远程开门，例如人不在办公室时给快递员开门。" },
        ],
      },
    },
  },
  {
    slug: "pozharnaya-signalizatsiya-dlya-biznesa-trebovaniya",
    date: "2026-08-05",
    related: ["fire"],
    loc: {
      ru: {
        title: "Пожарная сигнализация для бизнеса: что требует инспекция в Узбекистане",
        excerpt: "Кому обязательна пожарная сигнализация, чем пороговая система отличается от адресной, что проверяет инспектор и как пройти проверку с первого раза.",
        sections: [
          { h: "Кому сигнализация обязательна", p: [
            "Практически любому бизнес-помещению: магазину, офису, кафе, складу, учебному центру. Требования зависят от площади, этажности и числа людей: небольшому арендному помещению достаточно пороговой сигнализации с датчиками дыма и сиреной, зданию с этажами нужна адресная система и оповещение о эвакуации (СОУЭ).",
            "Ответственность лежит на собственнике или арендаторе — как прописано в договоре. Отсутствие работающей сигнализации — это предписания и штрафы при проверке, а при происшествии — прямая ответственность.",
          ] },
          { h: "Пороговая или адресная: в чём разница", p: [
            "Пороговая система — датчики на общем шлейфе: панель видит «тревога на линии 2», но не знает, какой именно датчик сработал. Это дёшево и достаточно для помещений до ~300 м². Приборы Рубеж и Алтай — типовой сертифицированный вариант.",
            "Адресная система знает каждый датчик по имени: панель показывает конкретное помещение, следит за запылённостью камер и сама сообщает о неисправностях. Для зданий со множеством помещений это не роскошь, а требование норм — плюс кратно быстрее реакция и дешевле обслуживание.",
          ] },
          { h: "Что проверяет инспектор", p: [
            "Проект и исполнительную документацию от лицензированной организации, сертификаты на оборудование, работоспособность каждого извещателя, звук и видимость оповещателей, таблички «Выход», журнал технического обслуживания. Система без договора на ТО формально считается неработающей.",
            "Мы делаем весь цикл: обследование и проект по нормам, монтаж, пусконаладку с проверкой каждого датчика и сдачу инспекции, затем регламентное обслуживание. Объект проходит проверку с первого раза — это и есть критерий сдачи работ.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит пожарная сигнализация для магазина?", a: "Для помещения до 300 м² пороговая система с датчиками, сиреной и табло «Выход» — самый доступный вариант, монтаж занимает 1–3 дня. Точная смета — после бесплатного обследования: состав диктуют нормы, а не прайс." },
          { q: "Можно ли поставить сигнализацию без проекта?", a: "Для простых небольших помещений допускается монтаж по акту обследования, но для зданий и объектов с массовым пребыванием людей проект от лицензированной организации обязателен — инспекция спросит его в первую очередь." },
          { q: "Что такое СОУЭ и нужно ли оно мне?", a: "Это система оповещения и управления эвакуацией: сирены, световые табло, речевые сообщения. Тип (1–5) зависит от здания: магазину достаточно сирен и табло, торговому центру или школе требуется речевое оповещение по зонам." },
        ],
      },
      uz: {
        title: "Biznes uchun yong'in signalizatsiyasi: O'zbekistonda inspeksiya nimani talab qiladi",
        excerpt: "Kimga yong'in signalizatsiyasi majburiy, chegara tizimi adreslisidan nimasi bilan farq qiladi, inspektor nimani tekshiradi va tekshiruvdan birinchi urinishda qanday o'tish mumkin.",
        sections: [
          { h: "Signalizatsiya kimga majburiy", p: [
            "Deyarli har qanday biznes-xonaga: do'kon, ofis, kafe, ombor, o'quv markazi. Talablar maydon, qavatlilik va odamlar soniga bog'liq: kichik ijara xonasiga tutun datchiklari va sirenali chegara signalizatsiyasi yetarli, qavatli binoga adresli tizim va evakuatsiya ogohlantirishi (SOUE) kerak.",
            "Javobgarlik mulkdor yoki ijarachida — shartnomada yozilganidek. Ishlaydigan signalizatsiya yo'qligi — tekshiruvda ko'rsatma va jarima, hodisa yuz berganda esa to'g'ridan-to'g'ri javobgarlik.",
          ] },
          { h: "Chegara yoki adresli: farqi nimada", p: [
            "Chegara tizimi — umumiy shleyfdagi datchiklar: panel «2-liniyada trevoga»ni ko'radi, lekin aynan qaysi datchik ishlaganini bilmaydi. Bu arzon va ~300 m² gacha xonalar uchun yetarli. Rubej va Oltoy asboblari — namunaviy sertifikatlangan variant.",
            "Adresli tizim har datchikni nomi bilan biladi: panel aniq xonani ko'rsatadi, kameralar changlanishini kuzatadi va nosozliklar haqida o'zi xabar beradi. Ko'p xonali binolar uchun bu hashamat emas, me'yor talabi — bundan tashqari reaksiya tezroq va xizmat arzonroq.",
          ] },
          { h: "Inspektor nimani tekshiradi", p: [
            "Litsenziyali tashkilot loyihasi va ijro hujjatlarini, uskuna sertifikatlarini, har izveshchatelning ishlashini, ogohlantirgichlar ovozi va ko'rinishini, «Chiqish» tablolarini, texnik xizmat jurnalini. TO shartnomasisiz tizim rasman ishlamayotgan hisoblanadi.",
            "Biz butun siklni qilamiz: me'yorlar bo'yicha tekshiruv va loyiha, montaj, har datchikni tekshirish bilan ishga tushirish va inspeksiyaga topshirish, so'ngra reglament xizmat. Obyekt tekshiruvdan birinchi urinishda o'tadi — ishlarni topshirish mezoni shu.",
          ] },
        ],
        faq: [
          { q: "Do'kon uchun yong'in signalizatsiyasi qancha turadi?", a: "300 m² gacha xona uchun datchiklar, sirena va «Chiqish» tablosi bilan chegara tizimi — eng arzon variant, montaj 1–3 kun. Aniq smeta — bepul tekshiruvdan keyin: tarkibni prays emas, me'yorlar belgilaydi." },
          { q: "Loyihasiz signalizatsiya qo'yish mumkinmi?", a: "Oddiy kichik xonalar uchun tekshiruv akti bo'yicha montajga ruxsat beriladi, lekin binolar va odamlar ko'p obyektlar uchun litsenziyali tashkilot loyihasi majburiy — inspeksiya birinchi navbatda uni so'raydi." },
          { q: "SOUE nima va u menga kerakmi?", a: "Bu ogohlantirish va evakuatsiyani boshqarish tizimi: sirenalar, yorug'lik tablolari, nutqiy xabarlar. Turi (1–5) binoga bog'liq: do'konga sirena va tablo yetarli, savdo markazi yoki maktabga zonalar bo'yicha nutqiy ogohlantirish kerak." },
        ],
      },
      en: {
        title: "Fire alarm for business: what inspection requires in Uzbekistan",
        excerpt: "Who must have a fire alarm, how a conventional system differs from an addressable one, what the inspector checks and how to pass inspection first time.",
        sections: [
          { h: "Who must have an alarm", p: [
            "Practically every business premises: a shop, an office, a café, a warehouse, a training centre. Requirements depend on area, floors and occupancy: a small rented unit needs a conventional alarm with smoke detectors and a sounder, a multi-floor building needs an addressable system and evacuation alerting.",
            "Responsibility sits with the owner or the tenant — as written in the lease. A missing or dead alarm means orders and fines at inspection, and direct liability if something happens.",
          ] },
          { h: "Conventional or addressable: the difference", p: [
            "A conventional system has detectors on a shared loop: the panel sees an alarm on line 2 but not which detector fired. It is cheap and sufficient up to ~300 m². Rubezh and Altai panels are the typical certified choice.",
            "An addressable system knows every detector by name: the panel shows the exact room, watches chamber contamination and reports faults itself. For buildings with many rooms it is not a luxury but a code requirement — plus faster response and cheaper maintenance.",
          ] },
          { h: "What the inspector checks", p: [
            "Design and as-built documents from a licensed organisation, equipment certificates, operation of every detector, sounder audibility, EXIT signs, the maintenance log. A system without a service contract formally counts as non-operational.",
            "We do the full cycle: survey and code-compliant design, installation, commissioning with every detector tested, inspection handover and then scheduled maintenance. The site passes inspection first time — that is our acceptance criterion.",
          ] },
        ],
        faq: [
          { q: "How much is a fire alarm for a shop?", a: "For premises up to 300 m² a conventional system with detectors, a sounder and EXIT signs is the most affordable option; installation takes 1–3 days. An exact estimate follows a free survey: codes, not a price list, dictate the composition." },
          { q: "Can an alarm be installed without a design?", a: "Simple small premises may be fitted per a survey act, but buildings and high-occupancy sites require a design from a licensed organisation — it is the first thing inspection asks for." },
          { q: "What is evacuation alerting and do I need it?", a: "It is the sounders, illuminated signs and voice messages that manage evacuation. The type (1–5) depends on the building: a shop needs sounders and signs, a mall or a school needs zoned voice alerting." },
        ],
      },
      tr: {
        title: "İşletmeler için yangın alarmı: Özbekistan'da denetim ne ister",
        excerpt: "Kimde yangın alarmı zorunlu, konvansiyonel sistem adresliden nasıl ayrılır, müfettiş neyi kontrol eder ve denetimden ilk seferde nasıl geçilir.",
        sections: [
          { h: "Alarm kimde zorunlu", p: [
            "Neredeyse her işletmede: dükkân, ofis, kafe, depo, eğitim merkezi. Gereksinimler alana, kat sayısına ve kişi sayısına bağlıdır: küçük kiralık birime duman dedektörlü ve sirenli konvansiyonel alarm yeter; çok katlı binaya adresli sistem ve tahliye uyarısı gerekir.",
            "Sorumluluk sözleşmeye göre mal sahibinde veya kiracıdadır. Çalışmayan alarm denetimde ihtar ve ceza, olay hâlinde doğrudan sorumluluk demektir.",
          ] },
          { h: "Konvansiyonel mi adresli mi", p: [
            "Konvansiyonel sistemde dedektörler ortak hattadır: panel «2. hatta alarm» der ama hangi dedektör olduğunu bilmez. Ucuzdur ve ~300 m²'ye kadar yeterlidir. Rubezh ve Altai panelleri tipik sertifikalı seçimdir.",
            "Adresli sistem her dedektörü adıyla bilir: panel tam odayı gösterir, kirlenmeyi izler ve arızayı kendisi bildirir. Çok odalı binalarda bu lüks değil yönetmelik gereğidir.",
          ] },
          { h: "Müfettiş neyi kontrol eder", p: [
            "Lisanslı kuruluşun projesi ve uygulama belgeleri, ekipman sertifikaları, her dedektörün çalışması, sirenlerin duyulurluğu, ÇIKIŞ levhaları, bakım defteri. Bakım sözleşmesi olmayan sistem resmen çalışmıyor sayılır.",
            "Tüm döngüyü biz yaparız: keşif ve projeden montaja, her dedektörün testiyle devreye almaya, denetime teslimden periyodik bakıma. Tesis denetimden ilk seferde geçer — kabul ölçütümüz budur.",
          ] },
        ],
        faq: [
          { q: "Dükkân için yangın alarmı ne kadar?", a: "300 m²'ye kadar yerlerde dedektörlü, sirenli ve ÇIKIŞ levhalı konvansiyonel sistem en ekonomik seçenektir; montaj 1–3 gün sürer. Kesin fiyat ücretsiz keşiften sonra verilir." },
          { q: "Projesiz alarm kurulabilir mi?", a: "Basit küçük yerlerde keşif tutanağıyla montaj mümkündür; ancak binalarda ve kalabalık tesislerde lisanslı kuruluş projesi zorunludur — denetim önce onu sorar." },
          { q: "Tahliye uyarı sistemi nedir, bana gerekli mi?", a: "Sirenler, ışıklı levhalar ve sesli anonslardan oluşan sistemdir. Tipi (1–5) binaya bağlıdır: dükkâna siren ve levha yeter, AVM veya okula bölgesel sesli anons gerekir." },
        ],
      },
      zh: {
        title: "企业消防报警系统：乌兹别克斯坦消防检查要求什么",
        excerpt: "哪些场所必须安装火灾报警，多线制与总线制系统的区别，检查人员查什么，以及如何一次通过验收。",
        sections: [
          { h: "哪些场所必须安装", p: [
            "几乎所有经营场所：商店、办公室、咖啡馆、仓库、培训中心。要求取决于面积、层数与人员数量：小型租赁场所配感烟探测器加警笛的多线制系统即可，多层建筑则需要总线制系统与疏散广播。",
            "责任由业主或租户承担——以合同约定为准。没有正常工作的报警系统，检查时会被责令整改并罚款，发生事故则承担直接责任。",
          ] },
          { h: "多线制与总线制的区别", p: [
            "多线制系统的探测器共用回路：主机只知道「2 号回路报警」，不知道具体是哪只探测器。价格低，适合约 300 平米以内的场所。Rubezh 与 Altai 主机是典型的认证选择。",
            "总线制系统认识每一只探测器：主机直接显示具体房间，监测探测器污染并自动上报故障。对多房间建筑而言这不是奢侈品而是规范要求——响应更快，维护更省。",
          ] },
          { h: "检查人员查什么", p: [
            "持证单位的设计与竣工文件、设备证书、每只探测器的动作、警报器的声响与可见性、「安全出口」标志、维保记录。没有维保合同的系统在形式上视为不工作。",
            "我们提供全流程：按规范勘察设计、安装、逐只探测器调试、协助通过消防验收，之后是定期维保。现场一次通过检查——这就是我们的交付标准。",
          ] },
        ],
        faq: [
          { q: "商店装一套火灾报警要多少钱？", a: "300 平米以内场所，配探测器、警笛与出口标志灯的多线制系统最经济，安装 1–3 天。准确报价在免费勘察之后——系统构成由规范决定，而非价目表。" },
          { q: "不做设计能直接安装吗？", a: "简单的小场所可凭勘察记录安装，但建筑物及人员密集场所必须有持证单位的设计文件——检查首先要查它。" },
          { q: "什么是疏散广播，我需要吗？", a: "即管理疏散的警笛、发光标志与语音播报系统。类型（1–5 类）取决于建筑：商店有警笛和标志即可，商场或学校则需要分区语音广播。" },
        ],
      },
    },
  },
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
      en: {
        title: "How to Choose an Intercom for a Home or Office",
        excerpt: "Audio or video, analogue or IP, calls to your phone — how to choose an intercom for an apartment, house, office or residential complex.",
        sections: [
          { h: "Audio or video intercom", p: [
            "An audio intercom gives only voice communication and door release — a budget option for an entrance hall. A video intercom shows the visitor on a monitor, which is noticeably safer and more convenient.",
            "For private houses, offices and apartments today the choice is video intercoms.",
          ] },
          { h: "IP or analogue", p: [
            "An analogue video intercom is simple and reliable for one or two points. An IP intercom delivers high-quality video, event recording, viewing from your phone anywhere and integration with access control and smart home.",
            "For apartment buildings and residential complexes we design multi-tenant IP systems with entrance panels and individual monitors.",
          ] },
          { h: "Useful features", p: [
            "Look for calls and door release from a smartphone, motion-triggered recording, night illumination of the panel and — outdoors — vandal and weather protection.",
            "We will select and install an intercom for your site — with remote access setup and warranty.",
          ] },
        ],
      },
      tr: {
        title: "Ev ve Ofis İçin Diafon Nasıl Seçilir",
        excerpt: "Sesli mi görüntülü mü, analog mu IP mi, telefona arama — daire, ev, ofis veya site için diafon seçimi.",
        sections: [
          { h: "Sesli mi görüntülü mü", p: [
            "Sesli diafon yalnızca konuşma ve kapı açma sağlar — apartman girişi için bütçe dostu seçenek. Görüntülü diafon ziyaretçiyi ekranda gösterir; bu belirgin şekilde daha güvenli ve pratiktir.",
            "Müstakil ev, ofis ve daireler için bugün tercih görüntülü diafonlardan yanadır.",
          ] },
          { h: "IP mi analog mu", p: [
            "Analog görüntülü diafon bir-iki nokta için basit ve güvenilirdir. IP diafon yüksek görüntü kalitesi, olay kaydı, her yerden telefonla izleme ve geçiş kontrolü ile akıllı ev entegrasyonu sunar.",
            "Apartmanlar ve siteler için çağrı panelli, bağımsız monitörlü çok aboneli IP sistemler projelendirilir.",
          ] },
          { h: "Faydalı özellikler", p: [
            "Akıllı telefondan arama ve kapı açma, harekete duyarlı kayıt, panelin gece aydınlatması, dış mekânda ise vandalizme ve hava koşullarına dayanıklılığa dikkat edin.",
            "Sahanıza uygun diafonu seçer ve kurarız — uzaktan erişim ayarı ve garantiyle.",
          ] },
        ],
      },
      zh: {
        title: "如何为住宅和办公室选择楼宇对讲",
        excerpt: "语音还是可视、模拟还是IP、手机接听——如何为公寓、住宅、办公室或小区选择对讲系统。",
        sections: [
          { h: "语音对讲还是可视对讲", p: [
            "语音对讲只提供通话和开门功能，是楼道的经济方案。可视对讲能在屏幕上看到访客，明显更安全、更方便。",
            "如今私人住宅、办公室和公寓都首选可视对讲。",
          ] },
          { h: "IP还是模拟", p: [
            "模拟可视对讲适合一两个点位，简单可靠。IP对讲提供高清视频、事件录像、随时随地手机查看，并可与门禁和智能家居集成。",
            "对于多层住宅和小区，我们设计带门口机和户内分机的多户IP系统。",
          ] },
          { h: "实用功能", p: [
            "关注手机呼叫与开门、移动侦测录像、面板夜间背光；室外面板还要防破坏、防风雨。",
            "我们为您的项目选型并安装对讲系统——包含远程访问配置和质保。",
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
      en: {
        title: "How Much Does Access Control Cost: What Makes Up the Price",
        excerpt: "Breaking down the cost of an access control system: entry points, identification type, locks and turnstiles — and where you can save.",
        sections: [
          { h: "What makes up the cost of ACS", p: [
            "The price of an access control system depends on the number of entry points, the identification type (card, code, fingerprint, face), the locking devices (lock or turnstile) and the software. The more doors and the more complex the access logic, the higher the hardware and installation cost.",
            "Integration is priced separately — with time attendance, CCTV or 1C. A basic single-door ACS is inexpensive; a checkpoint with turnstiles and biometrics costs more.",
          ] },
          { h: "From cards to biometrics", p: [
            "The most budget-friendly option is card readers with an electromagnetic lock on one door. Biometric terminals (fingerprint, facial recognition) and turnstiles for high-traffic checkpoints cost more.",
            "We balance price against the task: sometimes cards are enough, sometimes biometrics is needed, and at the checkpoint — a turnstile with time attendance.",
          ] },
          { h: "What the project includes", p: [
            "The price covers controllers, readers, locks or turnstiles, exit buttons, power supply, cabling, installation, access rights configuration and staff training.",
            "For an exact quote, book a free engineer visit — we will size an ACS for your site in Tashkent and across Uzbekistan.",
          ] },
        ],
      },
      tr: {
        title: "Geçiş Kontrol Sistemi Kurulumu Ne Kadar Tutar: Fiyat Neye Bağlı",
        excerpt: "Geçiş kontrol sisteminin maliyetini inceliyoruz: geçiş noktaları, kimlik doğrulama türü, kilitler ve turnikeler — ve nereden tasarruf edilebilir.",
        sections: [
          { h: "Maliyet neye bağlı", p: [
            "Sistemin fiyatı geçiş noktası sayısına, kimlik doğrulama türüne (kart, kod, parmak izi, yüz), kilitleme cihazlarına (kilit veya turnike) ve yazılıma bağlıdır. Kapı sayısı ve erişim mantığı karmaşıklaştıkça donanım ve montaj maliyeti artar.",
            "Entegrasyon ayrı hesaplanır — mesai takibi, CCTV veya 1C ile. Tek kapılık temel sistem ucuzdur; turnikeli ve biyometrik danışma girişi daha pahalıdır.",
          ] },
          { h: "Karttan biyometriye", p: [
            "En ekonomik seçenek tek kapıya kartlı okuyucu ve elektromanyetik kilittir. Biyometrik terminaller (parmak izi, yüz tanıma) ve yoğun girişler için turnikeler daha pahalıdır.",
            "Fiyat ile ihtiyacı dengeliyoruz: bazen kart yeterli, bazen biyometri gerekli; girişte ise mesai takibi yapan turnike.",
          ] },
          { h: "Projeye neler dahil", p: [
            "Fiyata kontrolörler, okuyucular, kilitler veya turnikeler, çıkış butonları, güç kaynağı, kablolama, montaj, yetki yapılandırması ve personel eğitimi dahildir.",
            "Kesin teklif için ücretsiz keşif talep edin — Taşkent'te ve tüm Özbekistan'da sahanıza uygun sistemi hesaplayalım.",
          ] },
        ],
      },
      zh: {
        title: "安装门禁系统要多少钱：价格由什么构成",
        excerpt: "解析门禁系统的成本：通行点数量、识别方式、锁具和闸机——以及哪些地方可以节省。",
        sections: [
          { h: "门禁系统的成本构成", p: [
            "门禁系统的价格取决于通行点数量、识别方式（卡片、密码、指纹、人脸）、锁闭装置（锁具或闸机）和软件。门越多、权限逻辑越复杂，设备和安装费用越高。",
            "与考勤、视频监控或1C的集成单独计价。单门基础门禁很经济；带闸机和生物识别的出入口造价更高。",
          ] },
          { h: "从刷卡到生物识别", p: [
            "最经济的方案是单门刷卡读卡器加电磁锁。生物识别终端（指纹、人脸识别）和大人流出入口的闸机价格更高。",
            "我们在价格和需求之间取得平衡：有的场景刷卡足够，有的需要生物识别，出入口则配备带考勤功能的闸机。",
          ] },
          { h: "项目包含什么", p: [
            "费用包含控制器、读卡器、锁具或闸机、出门按钮、电源、线缆、安装、权限配置和人员培训。",
            "如需精确报价，请预约工程师免费上门——我们为您在塔什干及乌兹别克斯坦全境的项目做门禁测算。",
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
      en: {
        title: "Time Attendance: How to Choose a System",
        excerpt: "How automatic time attendance works, what to choose — card, fingerprint or face — and how to export the timesheet to 1C.",
        sections: [
          { h: "How time attendance works", p: [
            "Employees clock in at a terminal with a card, fingerprint or face; the system automatically records arrivals and departures and counts hours worked. Manual timesheets and overtime disputes become a thing of the past.",
            "Managers see the data in real time: who is on site, who is late, how many hours were worked per shift and per month.",
          ] },
          { h: "Card, fingerprint or face", p: [
            "Cards are cheap but get passed around. Fingerprints are more reliable but require clean, dry hands. Facial recognition is the most convenient and contactless option — especially relevant after the pandemic.",
            "We match the clock-in method to the site's discipline and budget; cards and biometrics are often combined.",
          ] },
          { h: "Integration and reports", p: [
            "The system exports timesheets to 1C and other accounting software and builds reports on lateness and overtime. Time attendance merges with access control: one terminal both admits the employee and counts the hours.",
            "We deploy turnkey in Tashkent and across Uzbekistan — with reports configured to your accounting policy, training and support.",
          ] },
        ],
      },
      tr: {
        title: "Personel Devam Kontrol (Mesai Takibi): Sistem Nasıl Seçilir",
        excerpt: "Otomatik mesai takibi nasıl çalışır, kart mı parmak izi mi yüz mü seçmeli ve puantaj 1C'ye nasıl aktarılır.",
        sections: [
          { h: "Mesai takibi nasıl çalışır", p: [
            "Çalışanlar terminalde kart, parmak izi veya yüzle kayıt olur; sistem geliş-gidişleri otomatik kaydeder ve çalışılan saatleri hesaplar. Elle puantaj ve fazla mesai tartışmaları geçmişte kalır.",
            "Veriler yöneticiye gerçek zamanlı açıktır: kim yerinde, kim geç kaldı, vardiyada ve ayda kaç saat çalışıldı.",
          ] },
          { h: "Kart, parmak izi veya yüz", p: [
            "Kart ucuzdur ama elden ele verilebilir. Parmak izi daha güvenilirdir ama temiz ve kuru el ister. Yüz tanıma en pratik ve temassız yöntemdir — pandemi sonrası özellikle günceldir.",
            "Kayıt yöntemini sahadaki disipline ve bütçeye göre seçiyoruz; genellikle kart ve biyometri birlikte kullanılır.",
          ] },
          { h: "Entegrasyon ve raporlar", p: [
            "Sistem puantajı 1C ve diğer muhasebe programlarına aktarır, geç kalma ve fazla mesai raporları oluşturur. Mesai takibi geçiş kontrolüyle birleşir: tek terminal hem kapıyı açar hem saatleri sayar.",
            "Taşkent'te ve tüm Özbekistan'da anahtar teslim kuruyoruz — raporlar muhasebe politikanıza göre ayarlanır, eğitim ve destek dahildir.",
          ] },
        ],
      },
      zh: {
        title: "考勤系统：如何选择",
        excerpt: "自动考勤如何运作，该选刷卡、指纹还是人脸，以及如何把考勤表导出到1C。",
        sections: [
          { h: "考勤系统如何运作", p: [
            "员工在终端用卡片、指纹或人脸打卡；系统自动记录上下班并统计工时。手工考勤表和加班争议从此成为过去。",
            "管理者可实时查看数据：谁在岗、谁迟到、每班次和每月工作了多少小时。",
          ] },
          { h: "刷卡、指纹还是人脸", p: [
            "卡片便宜，但容易代打卡。指纹更可靠，但需要手指干净干燥。人脸识别最方便且无接触——疫情之后尤其实用。",
            "我们根据现场管理要求和预算选择打卡方式；常见做法是卡片与生物识别结合。",
          ] },
          { h: "集成与报表", p: [
            "系统可将考勤表导出到1C等财务软件，生成迟到和加班报表。考勤与门禁合二为一：同一台终端既放行员工又统计工时。",
            "我们在塔什干及乌兹别克斯坦全境提供交钥匙部署——按您的核算制度配置报表，并提供培训和支持。",
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
      en: {
        title: "Wi-Fi for Office and Warehouse: Building a Seamless Network",
        excerpt: "Why one router is not enough, how many access points you need and what matters when installing corporate Wi-Fi.",
        sections: [
          { h: "Why one router is not enough", p: [
            "A consumer router cannot cover an entire office or warehouse: the signal drops in far rooms and devices lose connection while moving. You need a network of access points with seamless roaming — devices switch between points without dropping.",
            "For business this is critical: video calls, POS, warehouse operations and IP telephony must work reliably anywhere in the building.",
          ] },
          { h: "How many access points you need", p: [
            "The number of points depends on the area, walls and user density. An open office needs roughly one point per 100–150 m²; a warehouse with tall racks and concrete demands denser placement.",
            "An on-site radio survey gives the exact figure — we visit, measure coverage and design a network with no dead zones.",
          ] },
          { h: "What matters during installation", p: [
            "A separate guest network, a single controller managing all points, PoE power (one cable for data and power) and correct channel planning against interference.",
            "We deploy turnkey Wi-Fi on Ubiquiti, MikroTik and TP-Link equipment in Tashkent and across Uzbekistan — with warranty and support.",
          ] },
        ],
      },
      tr: {
        title: "Ofis ve Depo İçin Wi-Fi: Kesintisiz Ağ Nasıl Kurulur",
        excerpt: "Neden tek router yetmez, kaç erişim noktası gerekir ve kurumsal Wi-Fi kurulumunda neler önemlidir.",
        sections: [
          { h: "Neden tek router yetmez", p: [
            "Ev tipi router ofisi veya depoyu tamamen kapsayamaz: uzak odalarda sinyal düşer, hareket eden cihazlar bağlantıyı koparır. Kesintisiz dolaşımlı (roaming) erişim noktaları ağı gerekir — cihaz noktalar arasında kopmadan geçer.",
            "İş için bu kritiktir: görüntülü görüşmeler, kasa, depo ve IP telefon binanın her yerinde istikrarlı çalışmalıdır.",
          ] },
          { h: "Kaç erişim noktası gerekir", p: [
            "Nokta sayısı alana, duvarlara ve kullanıcı yoğunluğuna bağlıdır. Açık ofiste yaklaşık her 100–150 m²'ye bir nokta; yüksek raflı, betonarme depo daha sık yerleşim ister.",
            "Kesin hesabı sahada radyo keşfi verir — gelir, kapsamayı ölçer ve ölü bölgesi olmayan bir ağ tasarlarız.",
          ] },
          { h: "Kurulumda neler önemli", p: [
            "Ayrı misafir ağı, tüm noktaları yöneten tek kontrolör, PoE ile besleme (tek kablo — veri ve güç) ve parazite karşı doğru kanal planlaması.",
            "Ubiquiti, MikroTik, TP-Link ekipmanıyla anahtar teslim Wi-Fi kuruyoruz — Taşkent'te ve tüm Özbekistan'da, garanti ve destekle.",
          ] },
        ],
      },
      zh: {
        title: "办公室和仓库Wi-Fi：如何打造无缝网络",
        excerpt: "为什么一台路由器不够用，需要多少个接入点，企业级Wi-Fi施工要注意什么。",
        sections: [
          { h: "为什么一台路由器不够用", p: [
            "家用路由器无法覆盖整个办公室或仓库：远端房间信号衰减，设备移动时连接中断。需要由多个接入点组成的无缝漫游网络——设备在接入点之间切换而不断线。",
            "这对企业至关重要：视频会议、收银、仓储和IP电话必须在楼内任何位置稳定运行。",
          ] },
          { h: "需要多少个接入点", p: [
            "接入点数量取决于面积、墙体和用户密度。开放式办公室约每100–150平方米一个接入点；高货架和混凝土结构的仓库需要更密集的布点。",
            "精确数字来自现场无线勘测——我们上门测量覆盖，设计没有盲区的网络。",
          ] },
          { h: "施工中的要点", p: [
            "独立的访客网络、统一管理所有接入点的控制器、PoE供电（一根网线同时传数据和供电）以及合理的信道规划以避免干扰。",
            "我们使用Ubiquiti、MikroTik、TP-Link设备提供交钥匙Wi-Fi部署——覆盖塔什干及乌兹别克斯坦全境，含质保和支持。",
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
      en: {
        title: "Smart Home: Where to Start and What It Costs",
        excerpt: "You don't have to automate everything at once — where to start a smart home, wired or wireless, and what can be automated.",
        sections: [
          { h: "Where to start", p: [
            "You don't have to automate everything at once. Start with a basic scenario — scheduled lighting and climate, leak and smoke sensors, CCTV in one app. The system is easy to expand later as budget allows.",
            "This step-by-step approach lowers the initial cost and shows which scenarios you actually need.",
          ] },
          { h: "Wired or wireless", p: [
            "Wireless systems (Wi-Fi/Zigbee) are cheaper and install without renovation — a good fit for a finished apartment. Wired systems are more reliable and go in during construction or major renovation.",
            "We match the solution to your site and renovation stage — from single scenarios to full automation of a house.",
          ] },
          { h: "What can be automated", p: [
            "Lighting and scenes (morning, away, night), climate and curtains, smart sockets and locks, motion, leak and smoke sensors, integration with CCTV and intruder alarm. Control by voice, smartphone or schedule.",
            "We install smart homes turnkey in Tashkent and across Uzbekistan — with setup, training and warranty.",
          ] },
        ],
      },
      tr: {
        title: "Akıllı Ev: Nereden Başlamalı ve Ne Kadar Tutar",
        excerpt: "Her şeyi bir anda otomatikleştirmek gerekmez — akıllı eve nereden başlanır, kablolu mu kablosuz mu ve neler otomatikleştirilebilir.",
        sections: [
          { h: "Nereden başlamalı", p: [
            "Her şeyi bir anda otomatikleştirmek gerekmez. Temel senaryoyla başlayın — programlı ışık ve iklimlendirme, su kaçağı ve duman sensörleri, tek uygulamada kamera izleme. Sistem daha sonra bütçeye göre kolayca genişletilir.",
            "Bu aşamalı yaklaşım başlangıç maliyetini düşürür ve hangi senaryolara gerçekten ihtiyacınız olduğunu gösterir.",
          ] },
          { h: "Kablolu mu kablosuz mu", p: [
            "Kablosuz sistemler (Wi-Fi/Zigbee) daha ucuzdur ve tadilatsız kurulur — hazır daire için uygundur. Kablolu sistemler daha güvenilirdir ve inşaat veya kapsamlı tadilat aşamasında döşenir.",
            "Çözümü sahanıza ve tadilat aşamasına göre seçiyoruz — tek senaryolardan villanın tam otomasyonuna kadar.",
          ] },
          { h: "Neler otomatikleştirilebilir", p: [
            "Aydınlatma ve senaryolar (sabah, evden çıkış, gece), iklimlendirme ve perdeler, akıllı prizler ve kilitler, hareket, su kaçağı ve duman sensörleri, kamera ve alarm entegrasyonu. Kontrol sesle, telefonla veya programla yapılır.",
            "Akıllı evi anahtar teslim kuruyoruz — Taşkent'te ve tüm Özbekistan'da, kurulum, eğitim ve garantiyle.",
          ] },
        ],
      },
      zh: {
        title: "智能家居：从哪里开始，需要多少钱",
        excerpt: "不必一次把所有东西都自动化——智能家居从哪里入手、有线还是无线、可以自动化哪些场景。",
        sections: [
          { h: "从哪里开始", p: [
            "不必一次把所有东西都自动化。从基础场景开始——灯光和空调按时间表运行、漏水和烟雾传感器、监控集中在一个App里。之后可以根据预算轻松扩展。",
            "这种循序渐进的方式降低了起步成本，也能让您弄清真正需要哪些场景。",
          ] },
          { h: "有线还是无线", p: [
            "无线系统（Wi-Fi/Zigbee）更便宜，无需装修即可安装，适合已装修好的住宅。有线系统更可靠，应在建造或大修阶段预埋。",
            "我们根据您的房屋和装修阶段选择方案——从单个场景到别墅的全屋自动化。",
          ] },
          { h: "可以自动化哪些场景", p: [
            "灯光与情景模式（清晨、离家、夜间）、空调与窗帘、智能插座与门锁、移动/漏水/烟雾传感器，以及与视频监控和防盗报警的联动。可通过语音、手机或时间表控制。",
            "我们在塔什干及乌兹别克斯坦全境提供智能家居交钥匙安装——含调试、培训和质保。",
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
      en: {
        title: "How to Choose a Turnstile for a Checkpoint",
        excerpt: "Turnstile types (tripod, full-height, speed gate), throughput and ACS integration — how to match one to your traffic and task.",
        sections: [
          { h: "Turnstile types", p: [
            "Turnstiles come in three main types: tripods (the most affordable, for offices and small checkpoints), rotor and full-height (maximum security, for restricted facilities) and speed gates (for business centres and high-traffic areas).",
            "The choice depends on the required level of control and the look: sometimes economy matters, sometimes prestige and high throughput.",
          ] },
          { h: "Throughput and traffic", p: [
            "A tripod passes roughly 20–30 people per minute — enough for an office or a small enterprise. A factory gate or stadium at peak hours needs several lanes or speed gates.",
            "We calculate the number of lanes for your real traffic so no queues build up at the entrance during peak hours.",
          ] },
          { h: "Identification and integration", p: [
            "A turnstile works together with ACS: passage by card, fingerprint or facial recognition, integration with time attendance and CCTV. We include a gate for visitors with limited mobility.",
            "We install turnstiles turnkey in Tashkent and across Uzbekistan — with warranty and service.",
          ] },
        ],
      },
      tr: {
        title: "Giriş İçin Turnike Nasıl Seçilir",
        excerpt: "Turnike türleri (tripod, boy turnike, hızlı geçiş), geçiş kapasitesi ve geçiş kontrol entegrasyonu — akışa ve göreve göre seçim.",
        sections: [
          { h: "Turnike türleri", p: [
            "Turnikeler üç ana türdedir: tripodlar (en ekonomik, ofisler ve küçük girişler için), rotorlu ve boy turnikeleri (maksimum güvenlik, kontrollü tesisler için) ve hızlı geçiş kapıları speed gate (iş merkezleri ve yoğun akış için).",
            "Seçim istenen kontrol düzeyine ve görünüme bağlıdır: bazen tasarruf, bazen prestij ve yüksek kapasite önemlidir.",
          ] },
          { h: "Geçiş kapasitesi ve akış", p: [
            "Tripod dakikada yaklaşık 20–30 kişi geçirir — ofis veya küçük işletme için yeterli. Fabrika girişi veya stadyum için yoğun saatlerde birkaç şerit veya speed gate gerekir.",
            "Yoğun saatlerde girişte kuyruk oluşmaması için şerit sayısını gerçek akışınıza göre hesaplıyoruz.",
          ] },
          { h: "Kimlik doğrulama ve entegrasyon", p: [
            "Turnike geçiş kontrol sistemiyle birlikte çalışır: kart, parmak izi veya yüz tanımayla geçiş, mesai takibi ve CCTV entegrasyonu. Hareket kısıtlı ziyaretçiler için kapı öngörüyoruz.",
            "Turnikeleri anahtar teslim kuruyoruz — Taşkent'te ve tüm Özbekistan'da, garanti ve servisle.",
          ] },
        ],
      },
      zh: {
        title: "如何为出入口选择闸机",
        excerpt: "闸机类型（三辊闸、全高闸、速通门）、通行能力与门禁集成——如何按人流量和需求选型。",
        sections: [
          { h: "闸机类型", p: [
            "闸机主要有三类：三辊闸（最经济，适合办公室和小型出入口）、转闸和全高闸（安全性最高，适合管制场所）、速通门（适合商务中心和大人流场所）。",
            "选择取决于所需的管控级别和外观：有的场合讲究经济，有的场合讲究气派和高通行量。",
          ] },
          { h: "通行能力与人流", p: [
            "三辊闸每分钟约通行20–30人——办公室或小型企业足够。工厂大门或体育场高峰时段需要多条通道或速通门。",
            "我们按实际人流计算通道数量，确保高峰时段入口不排长队。",
          ] },
          { h: "识别方式与系统集成", p: [
            "闸机与门禁系统联动：刷卡、指纹或人脸识别通行，并与考勤和视频监控集成。同时预留无障碍通道。",
            "我们在塔什干及乌兹别克斯坦全境提供闸机交钥匙安装——含质保和维护服务。",
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
      en: {
        title: "Barrier Gate with Licence Plate Recognition: How It Works",
        excerpt: "Automatic entry by car number: how an ANPR system works, what it includes and where it is used.",
        sections: [
          { h: "How automatic entry works", p: [
            "An ANPR camera reads the licence plate of an approaching car and, if it is on the whitelist, the barrier opens by itself — no cards, fobs or guard. Every passage is logged with a photo and timestamp.",
            "This removes entrance queues and the human factor: authorised cars pass in seconds.",
          ] },
          { h: "What the system includes", p: [
            "A motorised barrier, a plate recognition camera, a controller, safety photocells (so the boom never drops onto a car), remotes for guests and software with white and black lists. Paid parking adds entry/exit tariffing.",
            "The barrier integrates with ACS and the parking system into a single solution.",
          ] },
          { h: "Where it is used", p: [
            "Residential complexes, business centres, car parks, enterprises and guarded territories — anywhere a controlled yet convenient entrance is needed.",
            "We install ANPR barriers turnkey in Tashkent and across Uzbekistan — with warranty and service.",
          ] },
        ],
      },
      tr: {
        title: "Plaka Tanımalı Bariyer: Nasıl Çalışır",
        excerpt: "Araç plakasıyla otomatik giriş: ANPR sistemi nasıl kurulur, neleri içerir ve nerelerde kullanılır.",
        sections: [
          { h: "Otomatik giriş nasıl çalışır", p: [
            "ANPR kamerası yaklaşan aracın plakasını okur; plaka beyaz listedeyse bariyer kendiliğinden açılır — kartsız, kumandasız ve görevlisiz. Her geçiş fotoğraf ve zamanla kayda alınır.",
            "Bu, girişteki kuyrukları ve insan faktörünü ortadan kaldırır: kayıtlı araçlar saniyeler içinde geçer.",
          ] },
          { h: "Sistem neleri içerir", p: [
            "Motorlu bariyer, plaka tanıma kamerası, kontrolör, güvenlik fotoselleri (kol araca inmesin diye), misafirler için kumandalar ve beyaz/kara listeli yazılım. Ücretli otoparklara giriş-çıkış tarifelendirmesi eklenir.",
            "Bariyer, geçiş kontrolü ve otopark sistemiyle tek çözümde birleşir.",
          ] },
          { h: "Nerelerde kullanılır", p: [
            "Siteler, iş merkezleri, otoparklar, işletmeler ve korunan alanlar — kontrollü ve pratik girişin gerektiği her yerde.",
            "ANPR'li bariyerleri anahtar teslim monte ediyoruz — Taşkent'te ve tüm Özbekistan'da, garanti ve servisle.",
          ] },
        ],
      },
      zh: {
        title: "车牌识别道闸：工作原理",
        excerpt: "按车牌自动放行：ANPR系统如何构成、包含什么、应用在哪些场景。",
        sections: [
          { h: "自动放行如何实现", p: [
            "ANPR摄像机识别驶近车辆的车牌，若在白名单内，道闸自动抬杆——无需卡片、遥控器或保安。每次通行都带照片和时间记录在日志中。",
            "这消除了入口排队和人为因素：授权车辆几秒内即可通过。",
          ] },
          { h: "系统包含什么", p: [
            "电动道闸、车牌识别摄像机、控制器、安全光电（防止闸杆砸到车辆）、访客遥控器，以及带黑白名单的软件。收费停车场还可增加出入口计费。",
            "道闸可与门禁和停车场系统集成为统一方案。",
          ] },
          { h: "应用场景", p: [
            "住宅小区、商务中心、停车场、企业和封闭园区——任何需要既受控又便捷出入口的地方。",
            "我们在塔什干及乌兹别克斯坦全境提供ANPR道闸交钥匙安装——含质保和维护。",
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
      en: {
        title: "Intruder Alarm: How to Choose One for Home and Office",
        excerpt: "How an intruder alarm works, wired or wireless, and how to route alerts to a monitoring station and your smartphone.",
        sections: [
          { h: "How an intruder alarm works", p: [
            "Motion, door/window opening and glass-break sensors react to intrusion and send the signal to a monitoring station and to your smartphone. A panic button summons help instantly.",
            "The system arms with one tap or on a schedule, and on alarm triggers the siren and notifications.",
          ] },
          { h: "Wired or wireless", p: [
            "A wireless system installs without chasing walls and suits a finished space; wired is more reliable and goes in during renovation. For most apartments and offices a wireless system with backup power for outages is enough.",
            "We select the sensor set for your layout: motion in corridors, opening at entrances, glass-break by shop windows.",
          ] },
          { h: "Monitoring station and integration", p: [
            "The alarm can be routed to a state or private security company and combined with CCTV — each alert comes with video for verification.",
            "We install intruder alarms turnkey in Tashkent and across Uzbekistan — with warranty and service.",
          ] },
        ],
      },
      tr: {
        title: "Hırsız Alarmı: Ev ve Ofis İçin Nasıl Seçilir",
        excerpt: "Hırsız alarmı nasıl çalışır, kablolu mu kablosuz mu, alarm merkezi ve telefona bildirim nasıl yönlendirilir.",
        sections: [
          { h: "Hırsız alarmı nasıl çalışır", p: [
            "Hareket, kapı-pencere açılma ve cam kırılma sensörleri izinsiz girişe tepki verir; sinyal alarm merkezine ve telefonunuza iletilir. Panik butonu yardımı anında çağırır.",
            "Sistem tek dokunuşla veya programla kurulur; alarm durumunda siren ve bildirimleri devreye alır.",
          ] },
          { h: "Kablolu mu kablosuz mu", p: [
            "Kablosuz sistem duvar kırmadan kurulur ve hazır mekâna uygundur; kablolu daha güvenilirdir ve tadilatta döşenir. Çoğu daire ve ofis için elektrik kesintisine karşı yedek beslemeli kablosuz sistem yeterlidir.",
            "Sensör setini plana göre seçiyoruz: koridorlarda hareket, girişlerde açılma, vitrinlerde cam kırılma.",
          ] },
          { h: "Alarm merkezi ve entegrasyon", p: [
            "Alarm, resmi veya özel güvenlik şirketinin merkezine bağlanabilir ve CCTV ile birleştirilebilir — her alarm doğrulama için video kaydıyla gelir.",
            "Hırsız alarmını anahtar teslim kuruyoruz — Taşkent'te ve tüm Özbekistan'da, garanti ve servisle.",
          ] },
        ],
      },
      zh: {
        title: "防盗报警：住宅和办公室如何选择",
        excerpt: "防盗报警如何工作、有线还是无线、如何把警情推送到保安中心和手机。",
        sections: [
          { h: "防盗报警如何工作", p: [
            "移动、门窗开启和玻璃破碎传感器对入侵作出反应，将信号发送到保安中心和您的手机。紧急按钮可立即呼叫援助。",
            "系统可一键布防或按时间表布防，报警时启动警笛和通知。",
          ] },
          { h: "有线还是无线", p: [
            "无线系统无需开槽即可安装，适合已装修空间；有线更可靠，应在装修时敷设。大多数公寓和办公室配备带停电备用电源的无线系统即可。",
            "我们按户型配置传感器：走廊装移动侦测、入口装门磁、橱窗旁装玻璃破碎探测。",
          ] },
          { h: "接入保安中心与联动", p: [
            "报警可接入国家或私人保安公司的接警中心，并与视频监控联动——每次报警都附带录像以便核实。",
            "我们在塔什干及乌兹别克斯坦全境提供防盗报警交钥匙安装——含质保和维护。",
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
      en: {
        title: "Automatic Gates: How to Choose a Drive",
        excerpt: "Gate types (sliding, swing, sectional) and drives, what matters when choosing and whether existing gates can be automated.",
        sections: [
          { h: "Gate and drive types", p: [
            "Gates come as sliding, swing, sectional and roller — each type has its own drive. Sliding gates suit wide entrances, swing gates are the classic for yards, sectional doors save space in a garage.",
            "The drive is matched to the leaf weight and opening frequency: the heavier and more frequent, the more powerful the mechanism must be.",
          ] },
          { h: "What matters when choosing", p: [
            "Drive power matched to leaf weight, duty cycle (frequent entry needs a drive with headroom), safety photocells and a warning lamp, remotes and optional plate recognition.",
            "Skimping on the drive leads to rapid wear — better to take a mechanism with a load margin.",
          ] },
          { h: "Automating existing gates", p: [
            "Automation can be fitted to gates that are already installed. We configure smooth opening, anti-pinch protection and integration with ACS and plate recognition.",
            "We work turnkey in Tashkent and across Uzbekistan — with warranty and service.",
          ] },
        ],
      },
      tr: {
        title: "Otomatik Kapılar: Motor Nasıl Seçilir",
        excerpt: "Kapı türleri (yana kayar, kanatlı, seksiyonel) ve motorlar, seçimde neler önemli ve mevcut kapılar otomatikleştirilebilir mi.",
        sections: [
          { h: "Kapı ve motor türleri", p: [
            "Kapılar yana kayar, kanatlı, seksiyonel ve rulo tip olur — her türün kendi motoru vardır. Yana kayar geniş girişler için uygundur, kanatlı avlular için klasiktir, seksiyonel garajda yer kazandırır.",
            "Motor, kanat ağırlığına ve açılma sıklığına göre seçilir: ne kadar ağır ve sıksa, mekanizma o kadar güçlü olmalıdır.",
          ] },
          { h: "Seçimde neler önemli", p: [
            "Kanat ağırlığına uygun motor gücü, çalışma yoğunluğu (sık giriş için yedekli motor), güvenlik fotoselleri ve uyarı lambası, kumandalar ve plaka tanıma seçeneği.",
            "Motordan tasarruf hızlı aşınmaya yol açar — yük payı olan mekanizma almak daha iyidir.",
          ] },
          { h: "Mevcut kapıların otomasyonu", p: [
            "Otomasyon, halihazırda monte edilmiş kapılara da takılabilir. Yumuşak açılış, sıkışma koruması, geçiş kontrolü ve plaka tanıma entegrasyonunu ayarlıyoruz.",
            "Anahtar teslim çalışıyoruz — Taşkent'te ve tüm Özbekistan'da, garanti ve servisle.",
          ] },
        ],
      },
      zh: {
        title: "自动大门：如何选择电机",
        excerpt: "大门类型（平移门、平开门、翻板门）与电机，选择要点，以及现有大门能否加装自动化。",
        sections: [
          { h: "大门与电机类型", p: [
            "大门分平移、平开、翻板和卷帘式——每种类型配相应的电机。平移门适合宽阔入口，平开门是庭院经典之选，翻板门节省车库空间。",
            "电机按门扇重量和开启频率选择：门越重、开启越频繁，机构就需要越大功率。",
          ] },
          { h: "选择要点", p: [
            "电机功率要匹配门扇重量、工作强度（频繁出入需要有余量的电机）、安全光电和警示灯、遥控器以及车牌识别选项。",
            "在电机上省钱会导致快速磨损——最好选择负载有余量的机构。",
          ] },
          { h: "现有大门的自动化改造", p: [
            "已安装的大门也可以加装自动化。我们调试平滑开启、防夹保护，并与门禁和车牌识别集成。",
            "我们在塔什干及乌兹别克斯坦全境提供交钥匙服务——含质保和维护。",
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
      en: {
        title: "Structured Cabling (SCS) and Office LAN Installation: Stages",
        excerpt: "What a structured cabling system is, what stages installation involves and what matters for a reliable office network.",
        sections: [
          { h: "What SCS is and why you need it", p: [
            "A structured cabling system (SCS) is the unified cable backbone of an office: one wiring plant for computers, telephony, Wi-Fi, CCTV and other systems. A well-built SCS eliminates cable chaos and makes connecting new devices easy.",
            "It is the foundation of the IT infrastructure: the stability of the whole company network depends on cabling quality.",
          ] },
          { h: "Installation stages", p: [
            "Design and workplace layout, cable route installation (trays, trunking), server cabinet and patch panels, outlet installation and switch connection, labelling and testing of every line, as-built documentation handover.",
            "Precision matters at every stage — redoing a cable route costs more than doing it right the first time.",
          ] },
          { h: "What matters during installation", p: [
            "Cable and components of proven categories (Cat5e/Cat6), spare ports for company growth, tidy cable management and a cable journal for maintenance.",
            "We install SCS and office LANs turnkey in Tashkent and across Uzbekistan — with warranty and ongoing support.",
          ] },
        ],
      },
      tr: {
        title: "Yapısal Kablolama ve Ofis Yerel Ağı Kurulumu: Aşamalar",
        excerpt: "Yapısal kablolama sistemi nedir, kurulum hangi aşamalardan oluşur ve güvenilir ofis ağı için neler önemlidir.",
        sections: [
          { h: "Yapısal kablolama nedir, neden gerekli", p: [
            "Yapısal kablolama sistemi ofisin tek kablo altyapısıdır: bilgisayarlar, telefon, Wi-Fi, kamera ve diğer sistemler için tek tesisat. Doğru kurulmuş sistem kablo karmaşasını ortadan kaldırır ve yeni cihaz bağlamayı kolaylaştırır.",
            "Bu, BT altyapısının temelidir: tüm şirket ağının istikrarı kablolama kalitesine bağlıdır.",
          ] },
          { h: "Kurulum aşamaları", p: [
            "Projelendirme ve çalışma yerleri şeması, kablo güzergâhlarının döşenmesi (tavalar, kanallar), sunucu kabini ve patch panellerin kurulumu, priz montajı ve switch bağlantısı, her hattın etiketlenip test edilmesi, uygulama dokümantasyonunun teslimi.",
            "Her aşamada titizlik önemlidir — kablo güzergâhını yeniden yapmak, baştan doğru yapmaktan pahalıdır.",
          ] },
          { h: "Kurulumda neler önemli", p: [
            "Kanıtlanmış kategoride kablo ve bileşenler (Cat5e/Cat6), şirket büyümesi için yedek portlar, düzenli kablo yönetimi ve bakım için kablo defteri.",
            "Yapısal kablolama ve yerel ağları anahtar teslim kuruyoruz — Taşkent'te ve tüm Özbekistan'da, garanti ve sonraki destekle.",
          ] },
        ],
      },
      zh: {
        title: "办公室综合布线（SCS）与局域网施工：步骤",
        excerpt: "什么是综合布线系统，施工分哪些阶段，可靠的办公网络要注意什么。",
        sections: [
          { h: "什么是综合布线，为什么需要", p: [
            "综合布线系统（SCS）是办公室统一的线缆基础：一套布线同时服务电脑、电话、Wi-Fi、视频监控等系统。规范的布线消除了线缆混乱，接入新设备也更简单。",
            "这是IT基础设施的地基：整个企业网络的稳定性取决于布线质量。",
          ] },
          { h: "施工步骤", p: [
            "设计与工位图、敷设线缆路由（桥架、线槽）、安装机柜和配线架、安装面板并接入交换机、每条链路标记与测试、移交竣工文档。",
            "每个环节都要精细——返工线缆路由比一次做对更昂贵。",
          ] },
          { h: "施工要点", p: [
            "使用可靠等级的线缆和配件（Cat5e/Cat6）、为公司发展预留端口、整洁的理线以及便于维护的线缆台账。",
            "我们在塔什干及乌兹别克斯坦全境提供综合布线和局域网交钥匙施工——含质保和后续支持。",
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
      en: {
        title: "IP Telephony for the Office: How to Choose a PBX",
        excerpt: "Why IP telephony beats legacy lines, cloud vs on-premise PBX, and what can be configured — CRM integration, recording, queues.",
        sections: [
          { h: "Why IP telephony beats legacy lines", p: [
            "IP telephony works over the internet and replaces outdated analogue lines: multi-channel numbers, internal extensions, voice menus, call recording and statistics. Staff make calls from desk phones, computers and a mobile app.",
            "One number serves the whole company, and call costs between offices and branches drop.",
          ] },
          { h: "Cloud or on-premise PBX", p: [
            "A cloud PBX needs no hardware of your own and deploys quickly — convenient for small teams. An on-premise one (e.g. on Asterisk) gives full control and suits large offices and call centres.",
            "We match the solution to company size and requirements for reliability and integrations.",
          ] },
          { h: "What can be configured", p: [
            "Call routing scenarios, forwarding, queues, CRM integration (a call opens the client card), call recording and call analytics.",
            "We deploy IP telephony turnkey in Tashkent and across Uzbekistan — with setup, training and support.",
          ] },
        ],
      },
      tr: {
        title: "Ofis İçin IP Telefon: Santral Nasıl Seçilir",
        excerpt: "IP telefon klasik hatlardan neden iyidir, bulut mu yerel santral mi, neler yapılandırılabilir — CRM entegrasyonu, kayıt, kuyruklar.",
        sections: [
          { h: "IP telefon neden daha iyi", p: [
            "IP telefon internet üzerinden çalışır ve eski analog hatların yerini alır: çok kanallı numaralar, dahili hatlar, sesli menü, görüşme kaydı ve istatistik. Çalışanlar masa telefonundan, bilgisayardan ve mobil uygulamadan arar.",
            "Tek numara tüm şirkete hizmet eder; ofisler ve şubeler arası görüşme maliyeti düşer.",
          ] },
          { h: "Bulut mu yerel santral mi", p: [
            "Bulut santral kendi donanımınızı gerektirmez ve hızla devreye girer — küçük ekipler için pratiktir. Yerel santral (örneğin Asterisk) tam kontrol sağlar; büyük ofisler ve çağrı merkezleri için uygundur.",
            "Çözümü şirket büyüklüğüne, güvenilirlik ve entegrasyon gereksinimlerine göre seçiyoruz.",
          ] },
          { h: "Neler yapılandırılabilir", p: [
            "Çağrı karşılama senaryoları, yönlendirme, kuyruklar, CRM entegrasyonu (arama müşteri kartını açar), görüşme kaydı ve çağrı analitiği.",
            "IP telefonu anahtar teslim kuruyoruz — Taşkent'te ve tüm Özbekistan'da, kurulum, eğitim ve destekle.",
          ] },
        ],
      },
      zh: {
        title: "办公室IP电话：如何选择电话交换机（PBX）",
        excerpt: "IP电话比传统电话强在哪里、云端还是本地PBX、可以配置什么——CRM集成、录音、排队。",
        sections: [
          { h: "IP电话强在哪里", p: [
            "IP电话通过互联网运行，取代过时的模拟线路：多通道号码、内部分机、语音菜单、通话录音和统计。员工可用座机、电脑和手机App拨打电话。",
            "一个号码服务全公司，办公室和分支机构之间的通话成本大幅下降。",
          ] },
          { h: "云端还是本地PBX", p: [
            "云PBX无需自购设备，部署迅速——适合小团队。本地PBX（如基于Asterisk）提供完全控制，适合大型办公室和呼叫中心。",
            "我们根据公司规模及对可靠性和集成的要求选择方案。",
          ] },
          { h: "可以配置什么", p: [
            "来电处理场景、转接、排队、CRM集成（来电自动弹出客户卡片）、通话录音和通话分析。",
            "我们在塔什干及乌兹别克斯坦全境提供IP电话交钥匙部署——含配置、培训和支持。",
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
      en: {
        title: "Turnkey Server Room: What You Need",
        excerpt: "What goes into a server room, why power and cooling come first, and how to design a server room with headroom for growth.",
        sections: [
          { h: "What goes into a server room", p: [
            "The server room is the heart of the IT infrastructure. It includes server cabinets and racks, structured cabling, uninterruptible power (UPS) and, where needed, a diesel generator, air conditioning, gas fire suppression and access control.",
            "All of it must work as a single complex — business continuity depends on it.",
          ] },
          { h: "Power and cooling come first", p: [
            "Servers fear overheating and power interruptions. A UPS carries the load during an outage until the generator starts, while a precision air conditioner keeps temperature and humidity stable.",
            "This is not where to economise — server downtime and data loss cost more than proper engineering.",
          ] },
          { h: "Designing for the task", p: [
            "We build in power and space headroom for growth, redundancy of critical nodes, microclimate monitoring and remote status control.",
            "We design and build server rooms and data centres turnkey in Tashkent and across Uzbekistan — with documentation and service support.",
          ] },
        ],
      },
      tr: {
        title: "Anahtar Teslim Sunucu Odası: Neler Gerekir",
        excerpt: "Sunucu odasına neler girer, güç ve soğutma neden en önemlisi ve büyüme payıyla sunucu odası nasıl projelendirilir.",
        sections: [
          { h: "Sunucu odasına neler girer", p: [
            "Sunucu odası BT altyapısının kalbidir. İçinde sunucu kabinleri ve raflar, yapısal kablolama, kesintisiz güç kaynağı (UPS) ve gerekirse dizel jeneratör, iklimlendirme, gazlı söndürme sistemi ve geçiş kontrolü bulunur.",
            "Bunların hepsi tek bir kompleks olarak çalışmalıdır — işin sürekliliği buna bağlıdır.",
          ] },
          { h: "Güç ve soğutma en önemlisi", p: [
            "Sunucular aşırı ısınmadan ve güç kesintisinden korkar. UPS, elektrik kesildiğinde jeneratör devreye girene kadar yükü taşır; hassas klima ise sıcaklık ve nemi sabit tutar.",
            "Burada tasarruf edilmez — sunucu duruşu ve veri kaybı doğru mühendislikten pahalıdır.",
          ] },
          { h: "Göreve göre projelendirme", p: [
            "Büyüme için güç ve alan payı, kritik düğümlerde yedeklilik, mikroklima izleme ve uzaktan durum kontrolü öngörüyoruz.",
            "Sunucu odaları ve veri merkezlerini anahtar teslim projelendirip kuruyoruz — Taşkent'te ve tüm Özbekistan'da, dokümantasyon ve servis desteğiyle.",
          ] },
        ],
      },
      zh: {
        title: "交钥匙机房建设：需要什么",
        excerpt: "机房包含什么，为什么供电和制冷最关键，以及如何按需求设计并为发展预留余量。",
        sections: [
          { h: "机房包含什么", p: [
            "机房是IT基础设施的心脏。它包括服务器机柜和机架、综合布线、不间断电源（UPS）、必要时的柴油发电机、空调、气体灭火系统和门禁。",
            "这一切必须作为统一整体运行——业务的连续性取决于此。",
          ] },
          { h: "供电和制冷最关键", p: [
            "服务器最怕过热和断电。UPS在停电时支撑负载直到发电机启动，精密空调保持温湿度稳定。",
            "这方面不能省钱——服务器停机和数据丢失的损失远高于规范的工程投入。",
          ] },
          { h: "按需求设计", p: [
            "我们为发展预留功率和空间余量，对关键节点做冗余，配备微环境监测和远程状态监控。",
            "我们在塔什干及乌兹别克斯坦全境提供机房和数据中心的交钥匙设计与建设——含文档和维保服务。",
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
      en: {
        title: "Video Analytics and Facial Recognition: What It Is and Why",
        excerpt: "What video analytics can do, where it pays off — retail, business centres, parking — and how to add it to existing cameras.",
        sections: [
          { h: "What video analytics can do", p: [
            "Video analytics turns ordinary cameras into a smart system: facial and licence plate recognition, visitor counting, perimeter and zone control, detection of abandoned objects and unusual behaviour — all in real time, without a full-time operator.",
            "The system draws attention to an event itself instead of making someone watch monitors for hours.",
          ] },
          { h: "Where it pays off", p: [
            "Retail counts shopper traffic and builds heat maps, business centres admit staff by face, car parks open the barrier by plate, security gets an alert when the perimeter is crossed.",
            "Analytics turns CCTV from a “just-in-case archive” into a working tool for management and security.",
          ] },
          { h: "How to deploy it", p: [
            "Some analytics run directly on the cameras, some on an AI server. Analytics can also be added to already-installed cameras via server software, without replacing the whole system.",
            "We deploy video analytics turnkey in Tashkent and across Uzbekistan — with operator training and support.",
          ] },
        ],
      },
      tr: {
        title: "Video Analitiği ve Yüz Tanıma: Nedir ve Ne İşe Yarar",
        excerpt: "Video analitiği neler yapabilir, nerede fayda sağlar — perakende, iş merkezleri, otoparklar — ve mevcut kameralara nasıl eklenir.",
        sections: [
          { h: "Video analitiği neler yapabilir", p: [
            "Video analitiği sıradan kameraları akıllı sisteme dönüştürür: yüz ve plaka tanıma, ziyaretçi sayma, çevre ve bölge kontrolü, bırakılan eşya ve olağan dışı davranış tespiti — hepsi gerçek zamanlı, sürekli operatör olmadan.",
            "Sistem olaya dikkati kendisi çeker; saatlerce monitör izlemeye gerek kalmaz.",
          ] },
          { h: "Nerede fayda sağlar", p: [
            "Perakende müşteri akışını sayar ve ısı haritaları çıkarır, iş merkezleri çalışanları yüzle içeri alır, otoparklar bariyeri plakayla açar, güvenlik çevre ihlalinde alarm alır.",
            "Analitik, kamera sistemini “ne olur ne olmaz arşivi”nden yönetim ve güvenliğin çalışan aracına dönüştürür.",
          ] },
          { h: "Nasıl devreye alınır", p: [
            "Analitiğin bir kısmı doğrudan kameralarda, bir kısmı yapay zekâlı sunucuda çalışır. Analitik, sistem tamamen değiştirilmeden, sunucu yazılımıyla mevcut kameralara da eklenebilir.",
            "Video analitiğini anahtar teslim kuruyoruz — Taşkent'te ve tüm Özbekistan'da, operatör eğitimi ve destekle.",
          ] },
        ],
      },
      zh: {
        title: "视频分析与人脸识别：是什么、有什么用",
        excerpt: "视频分析能做什么，在哪些场景创造价值——零售、商务中心、停车场——以及如何在现有摄像机上部署。",
        sections: [
          { h: "视频分析能做什么", p: [
            "视频分析把普通摄像机变成智能系统：人脸和车牌识别、客流统计、周界和区域防范、遗留物和异常行为检测——全部实时进行，无需专人值守。",
            "系统会主动提示事件，而不是让人盯着监视器看几个小时。",
          ] },
          { h: "在哪些场景创造价值", p: [
            "零售统计客流并生成热力图，商务中心刷脸放行员工，停车场按车牌抬杆，周界被穿越时保安立即收到警报。",
            "视频分析让监控从“备查档案”变成管理和安防的实用工具。",
          ] },
          { h: "如何部署", p: [
            "一部分分析功能直接运行在摄像机上，另一部分运行在AI服务器上。通过服务器软件也可以为已安装的摄像机添加分析功能，无需整体更换系统。",
            "我们在塔什干及乌兹别克斯坦全境提供视频分析交钥匙部署——含操作员培训和支持。",
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
  {
    slug: "videonablyudenie-cherez-telefon",
    date: "2026-07-29",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Видеонаблюдение через телефон: как смотреть камеры удалённо",
        excerpt: "Как настроить просмотр камер видеонаблюдения со смартфона: что для этого нужно, какие приложения использовать и что делать, если камера «не видна» из другого города.",
        sections: [
          { h: "Как это работает", p: [
            "Современные камеры и регистраторы подключаются к облачному сервису производителя по технологии P2P: устройство само устанавливает связь с сервером, а приложение на телефоне находит его по серийному номеру или QR-коду. Белый IP-адрес, проброс портов и настройка роутера не нужны — достаточно интернета на объекте.",
            "Задержка при таком просмотре обычно 1–3 секунды, а качество автоматически подстраивается под скорость мобильного интернета: в приложении можно переключаться между плавным потоком и полным разрешением.",
          ] },
          { h: "Что нужно для просмотра с телефона", p: [
            "Три вещи: камера или регистратор с поддержкой облака, интернет на объекте (кабель, Wi-Fi или 4G-роутер) и приложение производителя на смартфоне. Для одной-двух камер достаточно Wi-Fi-моделей, для системы из 4+ камер правильнее поставить регистратор — тогда в телефоне будет и живой просмотр, и архив.",
            "Скорости интернета много не нужно: для просмотра одной камеры в среднем качестве хватает 1–2 Мбит/с исходящего канала. Важно лишь, чтобы соединение было стабильным.",
          ] },
          { h: "Какие приложения использовать", p: [
            "У каждого производителя своё приложение: Hik-Connect для Hikvision, DMSS для Dahua, EZVIZ для одноимённых камер, V380 Pro для бюджетных Wi-Fi-моделей. Все они бесплатны, работают на Android и iOS и позволяют смотреть несколько камер одновременно, получать push-уведомления о движении и листать архив.",
            "Если на объекте оборудование разных брендов, удобнее вывести всё на один регистратор — и смотреть в одном приложении, а не в трёх.",
          ] },
          { h: "Настройка за четыре шага", p: [
            "Первый шаг — подключить камеру или регистратор к интернету кабелем или по Wi-Fi. Второй — установить приложение и создать аккаунт. Третий — добавить устройство сканированием QR-кода с корпуса или из меню регистратора. Четвёртый — задать надёжный пароль и проверить просмотр, отключив телефон от Wi-Fi объекта.",
            "На этом же этапе стоит настроить уведомления: зоны детекции движения и расписание, чтобы телефон не звенел от каждой проехавшей машины.",
          ] },
          { h: "Частые проблемы и решения", p: [
            "«Устройство офлайн» — почти всегда интернет на объекте: проверьте роутер и кабель до камеры. «Видео тормозит» — переключитесь на субпоток или уменьшите разрешение просмотра. «Нет уведомлений» — проверьте, что приложению разрешены push-уведомления, а на регистраторе включена детекция движения.",
            "Если камера подключена, но архив не листается — обычно не установлен или переполнен жёсткий диск в регистраторе, либо карта памяти в камере вышла из строя.",
          ] },
          { h: "Безопасность удалённого доступа", p: [
            "Смените заводской пароль на уникальный и включите двухфакторную аутентификацию в аккаунте облака, если она доступна. Не передавайте главный аккаунт сотрудникам — приложения позволяют «поделиться» камерой с ограниченными правами: только просмотр, без архива и настроек.",
            "Мы настраиваем удалённый просмотр на каждом объекте под ключ: камеры, регистратор, приложение на ваших телефонах и права доступа для семьи или сотрудников.",
          ] },
        ],
        faq: [
          { q: "Можно ли смотреть камеры без интернета на объекте?", a: "Для удалённого просмотра интернет обязателен. Если кабельного интернета нет, ставим 4G-роутер с SIM-картой — этого достаточно для просмотра и уведомлений." },
          { q: "Сколько камер можно добавить в приложение?", a: "Десятки — ограничений для обычных объектов нет. Камеры группируются по объектам, а через регистратор добавляются все сразу одним устройством." },
          { q: "Платный ли облачный сервис?", a: "Базовый P2P-просмотр у Hikvision, Dahua и EZVIZ бесплатный. Деньги берут только за облачное хранение архива, но при регистраторе с жёстким диском оно не нужно." },
          { q: "Могут ли камеры смотреть несколько человек одновременно?", a: "Да. Владелец делится доступом из приложения — каждому со своими правами: например, только живой просмотр без архива и настроек." },
        ],
      },
      uz: {
        title: "Telefon orqali videokuzatuv: kameralarni masofadan qanday ko'rish",
        excerpt: "Smartfondan kameralarni ko'rishni qanday sozlash: nima kerak, qaysi ilovalardan foydalanish va kamera boshqa shahardan «ko'rinmasa» nima qilish kerak.",
        sections: [
          { h: "Bu qanday ishlaydi", p: [
            "Zamonaviy kameralar va registratorlar P2P texnologiyasi orqali ishlab chiqaruvchining bulut xizmatiga ulanadi: qurilma o'zi server bilan aloqa o'rnatadi, telefondagi ilova esa uni seriya raqami yoki QR-kod bo'yicha topadi. Oq IP-manzil va router sozlamalari kerak emas — obyektda internet bo'lsa kifoya.",
            "Bunday ko'rishda kechikish odatda 1–3 soniya, sifat esa mobil internet tezligiga avtomatik moslashadi.",
          ] },
          { h: "Telefondan ko'rish uchun nima kerak", p: [
            "Uchta narsa: bulutni qo'llab-quvvatlaydigan kamera yoki registrator, obyektda internet (kabel, Wi-Fi yoki 4G-router) va smartfonda ishlab chiqaruvchi ilovasi. Bitta-ikkita kamera uchun Wi-Fi modellari yetarli, 4+ kamerali tizim uchun registrator to'g'riroq — telefonda jonli ko'rish ham, arxiv ham bo'ladi.",
            "Internet tezligi ko'p kerak emas: bitta kamerani o'rtacha sifatda ko'rish uchun 1–2 Mbit/s chiquvchi kanal yetadi.",
          ] },
          { h: "Qaysi ilovalardan foydalanish", p: [
            "Har bir ishlab chiqaruvchining o'z ilovasi bor: Hikvision uchun Hik-Connect, Dahua uchun DMSS, EZVIZ kameralari uchun EZVIZ, byudjet Wi-Fi modellari uchun V380 Pro. Ularning barchasi bepul, Android va iOS'da ishlaydi, bir nechta kamerani bir vaqtda ko'rish, harakat haqida push-bildirishnoma olish va arxivni ko'rish imkonini beradi.",
            "Obyektda turli brend uskunalari bo'lsa, hammasini bitta registratorga ulash qulayroq — uchta emas, bitta ilovada ko'rasiz.",
          ] },
          { h: "To'rt qadamda sozlash", p: [
            "Birinchi qadam — kamera yoki registratorni kabel yoki Wi-Fi orqali internetga ulash. Ikkinchi — ilovani o'rnatib, akkaunt yaratish. Uchinchi — korpusdagi yoki registrator menyusidagi QR-kodni skanerlash orqali qurilmani qo'shish. To'rtinchi — ishonchli parol qo'yib, telefonni obyekt Wi-Fi'sidan uzgan holda ko'rishni tekshirish.",
            "Shu bosqichda bildirishnomalarni ham sozlash kerak: harakat zonalari va jadval — telefon har bir o'tgan mashinadan jiringlamasligi uchun.",
          ] },
          { h: "Tez-tez uchraydigan muammolar", p: [
            "«Qurilma oflayn» — deyarli har doim obyektdagi internet: routerni va kameragacha kabelni tekshiring. «Video sekinlashadi» — sub-oqimga o'ting yoki ko'rish sifatini kamaytiring. «Bildirishnoma kelmaydi» — ilovaga push ruxsati berilganini va registratorda harakat detektori yoqilganini tekshiring.",
            "Kamera ulangan, lekin arxiv ochilmasa — odatda registratordagi qattiq disk o'rnatilmagan yoki to'lgan.",
          ] },
          { h: "Masofaviy kirish xavfsizligi", p: [
            "Zavod parolini noyob parolga almashtiring va bulut akkauntida ikki bosqichli autentifikatsiyani yoqing. Asosiy akkauntni xodimlarga bermang — ilovalar kamerani cheklangan huquqlar bilan «ulashish» imkonini beradi: faqat ko'rish, arxiv va sozlamalarsiz.",
            "Biz har bir obyektda masofaviy ko'rishni kalit topshirish sharti bilan sozlaymiz: kameralar, registrator, telefonlaringizdagi ilova va kirish huquqlari.",
          ] },
        ],
        faq: [
          { q: "Obyektda internetsiz kameralarni ko'rish mumkinmi?", a: "Masofadan ko'rish uchun internet shart. Kabel internet bo'lmasa, SIM-kartali 4G-router o'rnatamiz — ko'rish va bildirishnomalar uchun yetarli." },
          { q: "Ilovaga nechta kamera qo'shish mumkin?", a: "O'nlab — oddiy obyektlar uchun cheklov yo'q. Registrator orqali barcha kameralar bitta qurilma sifatida qo'shiladi." },
          { q: "Bulut xizmati pullikmi?", a: "Hikvision, Dahua va EZVIZ'da asosiy P2P-ko'rish bepul. Faqat bulutda arxiv saqlash pullik, lekin qattiq diskli registrator bo'lsa u kerak emas." },
          { q: "Kameralarni bir necha kishi ko'ra oladimi?", a: "Ha. Egasi ilovadan kirishni ulashadi — har kimga o'z huquqlari bilan: masalan, faqat jonli ko'rish." },
        ],
      },
      en: {
        title: "How to Watch CCTV Cameras Remotely from Your Phone",
        excerpt: "How to set up smartphone viewing for your security cameras: what you need, which apps to use, and what to do when a camera shows up as offline from another city.",
        sections: [
          { h: "How it works", p: [
            "Modern cameras and recorders connect to the manufacturer's cloud service via P2P: the device establishes the link to the server on its own, and the phone app finds it by serial number or QR code. No static IP, port forwarding or router configuration is required — an internet connection at the site is enough.",
            "Latency with this kind of viewing is typically 1–3 seconds, and quality adapts automatically to your mobile connection speed: the app lets you switch between a smooth stream and full resolution.",
          ] },
          { h: "What you need for mobile viewing", p: [
            "Three things: a camera or recorder with cloud support, internet at the site (wired, Wi-Fi or a 4G router) and the manufacturer's app on your smartphone. For one or two cameras, Wi-Fi models are enough; for a system of 4+ cameras it makes more sense to install a recorder — then your phone gets both live view and archive playback.",
            "You don't need much bandwidth: 1–2 Mbps of upload is enough to watch one camera at medium quality. What matters is that the connection stays stable.",
          ] },
          { h: "Which apps to use", p: [
            "Each manufacturer has its own app: Hik-Connect for Hikvision, DMSS for Dahua, EZVIZ for cameras of the same brand, V380 Pro for budget Wi-Fi models. All are free, run on Android and iOS, and let you watch several cameras at once, receive motion push notifications and browse recordings.",
            "If the site mixes equipment from different brands, it's more convenient to route everything through a single recorder — and watch it all in one app instead of three.",
          ] },
          { h: "Setup in four steps", p: [
            "Step one — connect the camera or recorder to the internet by cable or Wi-Fi. Step two — install the app and create an account. Step three — add the device by scanning the QR code on its housing or from the recorder's menu. Step four — set a strong password and verify remote viewing by disconnecting your phone from the site's Wi-Fi.",
            "This is also the right moment to configure notifications: motion detection zones and a schedule, so your phone doesn't buzz for every passing car.",
          ] },
          { h: "Common problems and fixes", p: [
            "\"Device offline\" — almost always the internet at the site: check the router and the cable to the camera. \"Video is laggy\" — switch to the sub-stream or lower the viewing resolution. \"No notifications\" — make sure the app is allowed to send push notifications and motion detection is enabled on the recorder.",
            "If the camera is connected but you can't browse recordings, the recorder's hard drive is usually missing or full, or the camera's memory card has failed.",
          ] },
          { h: "Securing remote access", p: [
            "Replace the factory password with a unique one and enable two-factor authentication on the cloud account if it's available. Don't hand the main account to staff — the apps let you share a camera with limited rights: live view only, no archive or settings access.",
            "We set up remote viewing on every project turnkey: cameras, recorder, the app on your phones and access rights for family members or employees.",
          ] },
        ],
        faq: [
          { q: "Can I watch the cameras if the site has no internet?", a: "Remote viewing requires internet. If there's no wired connection, we install a 4G router with a SIM card — that's enough for live view and notifications." },
          { q: "How many cameras can I add to the app?", a: "Dozens — there's no practical limit for typical sites. Cameras are grouped by site, and with a recorder they're all added at once as a single device." },
          { q: "Is the cloud service paid?", a: "Basic P2P viewing is free with Hikvision, Dahua and EZVIZ. You only pay for cloud archive storage, and with a recorder that has a hard drive you don't need it." },
          { q: "Can several people watch the cameras at the same time?", a: "Yes. The owner shares access from the app — each person gets their own permissions: for example, live view only, without archive or settings." },
        ],
      },
      tr: {
        title: "Telefondan Video İzleme: Kameralara Uzaktan Erişim",
        excerpt: "Güvenlik kameralarını akıllı telefondan izleme nasıl kurulur: neler gerekir, hangi uygulamalar kullanılır ve kamera başka bir şehirden \"görünmüyorsa\" ne yapılır.",
        sections: [
          { h: "Nasıl çalışır", p: [
            "Modern kameralar ve kayıt cihazları, üreticinin bulut servisine P2P teknolojisiyle bağlanır: cihaz sunucuyla bağlantıyı kendisi kurar, telefondaki uygulama ise onu seri numarası veya QR koduyla bulur. Statik IP, port yönlendirme veya router ayarı gerekmez — tesiste internet olması yeterlidir.",
            "Bu tür izlemede gecikme genellikle 1–3 saniyedir ve görüntü kalitesi mobil internet hızına otomatik uyum sağlar: uygulamada akıcı yayın ile tam çözünürlük arasında geçiş yapabilirsiniz.",
          ] },
          { h: "Telefondan izlemek için ne gerekir", p: [
            "Üç şey: bulut destekli bir kamera veya kayıt cihazı, tesiste internet (kablo, Wi-Fi veya 4G router) ve akıllı telefonda üreticinin uygulaması. Bir-iki kamera için Wi-Fi modeller yeterlidir; 4 ve üzeri kameralı bir sistemde ise kayıt cihazı kurmak daha doğrudur — böylece telefonda hem canlı izleme hem de arşiv olur.",
            "Yüksek internet hızına gerek yoktur: bir kamerayı orta kalitede izlemek için 1–2 Mbit/s yükleme hızı yeterlidir. Önemli olan bağlantının stabil olmasıdır.",
          ] },
          { h: "Hangi uygulamalar kullanılır", p: [
            "Her üreticinin kendi uygulaması vardır: Hikvision için Hik-Connect, Dahua için DMSS, aynı adlı kameralar için EZVIZ, bütçe dostu Wi-Fi modeller için V380 Pro. Hepsi ücretsizdir, Android ve iOS'ta çalışır; birden fazla kamerayı aynı anda izlemeye, hareket algılandığında push bildirim almaya ve arşivde gezinmeye imkân verir.",
            "Tesiste farklı markaların ekipmanı varsa, hepsini tek bir kayıt cihazında toplamak daha pratiktir — üç ayrı uygulama yerine tek uygulamadan izlersiniz.",
          ] },
          { h: "Dört adımda kurulum", p: [
            "Birinci adım — kamerayı veya kayıt cihazını kabloyla ya da Wi-Fi üzerinden internete bağlayın. İkinci adım — uygulamayı yükleyip hesap oluşturun. Üçüncü adım — cihazın gövdesindeki veya kayıt cihazı menüsündeki QR kodu okutarak cihazı ekleyin. Dördüncü adım — güçlü bir şifre belirleyin ve telefonu tesisin Wi-Fi ağından ayırarak izlemeyi test edin.",
            "Aynı aşamada bildirimleri de ayarlamakta fayda var: hareket algılama bölgeleri ve zamanlama sayesinde telefon her geçen araçta çalmaz.",
          ] },
          { h: "Sık karşılaşılan sorunlar ve çözümleri", p: [
            "\"Cihaz çevrimdışı\" — neredeyse her zaman tesisteki internettir: router'ı ve kameraya giden kabloyu kontrol edin. \"Görüntü takılıyor\" — alt akışa (sub-stream) geçin veya izleme çözünürlüğünü düşürün. \"Bildirim gelmiyor\" — uygulamaya push bildirim izni verildiğinden ve kayıt cihazında hareket algılamanın açık olduğundan emin olun.",
            "Kamera bağlı ama arşivde gezinilemiyorsa — genellikle kayıt cihazında sabit disk takılı değildir ya da dolmuştur, veya kameradaki hafıza kartı arızalanmıştır.",
          ] },
          { h: "Uzaktan erişim güvenliği", p: [
            "Fabrika şifresini benzersiz bir şifreyle değiştirin ve bulut hesabında varsa iki faktörlü doğrulamayı açın. Ana hesabı çalışanlara vermeyin — uygulamalar kamerayı sınırlı yetkilerle \"paylaşmaya\" izin verir: yalnızca canlı izleme, arşiv ve ayarlara erişim olmadan.",
            "Her tesiste uzaktan izlemeyi anahtar teslim kuruyoruz: kameralar, kayıt cihazı, telefonlarınızda uygulama ve aile üyeleri ya da çalışanlar için erişim yetkileri.",
          ] },
        ],
        faq: [
          { q: "Tesiste internet olmadan kameralar izlenebilir mi?", a: "Uzaktan izleme için internet şarttır. Kablolu internet yoksa SIM kartlı bir 4G router kuruyoruz — izleme ve bildirimler için bu yeterlidir." },
          { q: "Uygulamaya kaç kamera eklenebilir?", a: "Onlarca — sıradan tesisler için bir sınırlama yoktur. Kameralar tesislere göre gruplanır; kayıt cihazı üzerinden ise hepsi tek cihaz olarak bir seferde eklenir." },
          { q: "Bulut servisi ücretli mi?", a: "Hikvision, Dahua ve EZVIZ'de temel P2P izleme ücretsizdir. Ücret yalnızca bulutta arşiv depolama için alınır; sabit diskli bir kayıt cihazı varsa buna gerek kalmaz." },
          { q: "Kameraları aynı anda birden fazla kişi izleyebilir mi?", a: "Evet. Sahip, uygulama üzerinden erişimi paylaşır — herkese kendi yetkileriyle: örneğin arşiv ve ayarlar olmadan yalnızca canlı izleme." },
        ],
      },
      zh: {
        title: "手机远程查看监控摄像头的方法",
        excerpt: "如何在智能手机上查看监控摄像头画面：需要哪些设备、用什么应用，以及从外地打开时摄像头显示离线该怎么办。",
        sections: [
          { h: "工作原理", p: [
            "如今的摄像机和录像机通过 P2P 技术接入厂商的云服务：设备自行与服务器建立连接，手机应用则通过序列号或二维码找到它。无需公网 IP、端口映射或路由器配置——现场有网络即可。",
            "这种方式的观看延迟通常为 1–3 秒，画质会根据移动网络速度自动调整：在应用中可以在流畅画面和全分辨率之间切换。",
          ] },
          { h: "手机观看需要什么", p: [
            "三样东西：支持云服务的摄像机或录像机、现场的网络连接（有线、Wi-Fi 或 4G 路由器），以及手机上的厂商应用。一两台摄像机用 Wi-Fi 型号就够了；4 台以上的系统更适合配一台录像机——这样手机上既能实时观看，也能回放录像。",
            "对网速要求不高：以中等画质观看一路摄像机，1–2 Mbps 的上行带宽就足够。关键是连接要稳定。",
          ] },
          { h: "该用哪些应用", p: [
            "每个厂商都有自己的应用：Hikvision 用 Hik-Connect，Dahua 用 DMSS，EZVIZ 摄像机用同名应用，入门级 Wi-Fi 型号用 V380 Pro。它们全部免费，支持 Android 和 iOS，可同时观看多路画面、接收移动侦测推送并回放录像。",
            "如果现场混用了不同品牌的设备，更方便的做法是全部接到一台录像机上——在一个应用里看完所有画面，而不是来回切换三个应用。",
          ] },
          { h: "四步完成设置", p: [
            "第一步——用网线或 Wi-Fi 把摄像机或录像机接入互联网。第二步——安装应用并注册账号。第三步——扫描机身上或录像机菜单中的二维码添加设备。第四步——设置高强度密码，并让手机断开现场 Wi-Fi 来验证远程观看是否正常。",
            "在这一步也建议顺便配置通知：设置移动侦测区域和时间计划，免得每辆路过的汽车都让手机响个不停。",
          ] },
          { h: "常见问题及解决办法", p: [
            "\"设备离线\"——几乎总是现场网络的问题：检查路由器和通往摄像机的网线。\"画面卡顿\"——切换到子码流或降低观看分辨率。\"收不到通知\"——确认应用已获得推送权限，且录像机上已开启移动侦测。",
            "如果摄像机在线但无法回放录像——通常是录像机没装硬盘或硬盘已满，或者摄像机内的存储卡已损坏。",
          ] },
          { h: "远程访问的安全性", p: [
            "把出厂密码改成独一无二的密码，如果云账号支持双重验证，请务必开启。不要把主账号交给员工——应用支持以受限权限\"分享\"摄像头：仅限实时观看，不能查看录像或修改设置。",
            "我们为每个项目提供远程观看的一站式部署：摄像机、录像机、您手机上的应用，以及为家人或员工分配的访问权限。",
          ] },
        ],
        faq: [
          { q: "现场没有网络能看摄像头吗？", a: "远程观看必须有网络。如果没有有线宽带，我们会安装带 SIM 卡的 4G 路由器——足以满足观看和推送通知的需求。" },
          { q: "应用里能添加多少台摄像机？", a: "几十台——对普通项目来说没有实际限制。摄像机可按场所分组；通过录像机添加时，所有摄像机作为一台设备一次性接入。" },
          { q: "云服务收费吗？", a: "Hikvision、Dahua 和 EZVIZ 的基础 P2P 观看是免费的。只有云端录像存储才收费，而配有硬盘的录像机并不需要它。" },
          { q: "多个人能同时观看摄像头吗？", a: "可以。所有者在应用中分享访问权限——每个人拥有各自的权限：例如仅实时观看，不含录像回放和设置。" },
        ],
      },
    },
  },
  {
    slug: "kak-podklyuchit-ip-kameru-hikvision",
    date: "2026-07-29",
    related: ["cctv", "network"],
    loc: {
      ru: {
        title: "Как подключить IP-камеру Hikvision: пошаговая инструкция",
        excerpt: "Подключаем IP-камеру Hikvision с нуля: питание и кабель, активация через SADP, добавление в Hik-Connect и к регистратору, типичные ошибки новичков.",
        sections: [
          { h: "Что понадобится", p: [
            "Сама камера, кабель витая пара (UTP cat5e или выше), источник питания — PoE-коммутатор, PoE-инжектор или блок 12 В, и компьютер либо смартфон для настройки. Если камер несколько, сразу берите PoE-коммутатор: питание и данные пойдут по одному кабелю, без розеток у каждой камеры.",
            "Для настройки с компьютера скачайте бесплатную утилиту SADP с сайта Hikvision — она находит все камеры в сети и показывает их IP-адреса.",
          ] },
          { h: "Шаг 1. Подключаем кабель и питание", p: [
            "Обожмите витую пару разъёмами RJ45 по стандарту T568B с обеих сторон и соедините камеру с PoE-портом коммутатора. Через 30–60 секунд камера загрузится — на разъёме замигает индикатор линка. Максимальная длина кабеля для PoE — 100 метров; на большие расстояния ставят удлинители PoE или оптику.",
            "При питании от блока 12 В следите за полярностью и сечением кабеля питания: на длинных трассах напряжение просаживается, и камера начинает перезагружаться по ночам, когда включается ИК-подсветка.",
          ] },
          { h: "Шаг 2. Активация и пароль", p: [
            "Новая камера Hikvision неактивна: при первом включении она требует задать пароль администратора. Запустите SADP, найдите камеру в списке (статус Inactive), отметьте её и задайте пароль — минимум 8 символов с буквами и цифрами. Там же можно сменить IP-адрес на адрес вашей сети.",
            "Запишите пароль в надёжное место: сброс забытого пароля на камерах Hikvision — процедура через кнопку Reset или обращение в сервис с кодом устройства, быстро восстановить его не выйдет.",
          ] },
          { h: "Шаг 3. Добавляем в телефон (Hik-Connect)", p: [
            "Включите в веб-интерфейсе камеры (раздел «Сеть → Доступ к платформе») облако Hik-Connect и задайте код верификации. Затем в приложении Hik-Connect на смартфоне нажмите «плюс» и отсканируйте QR-код с корпуса камеры. Через минуту появится живое видео — можно смотреть из любой точки мира.",
            "Если камера работает с регистратором, добавлять в приложение нужно регистратор, а не каждую камеру отдельно — так проще и с архивом.",
          ] },
          { h: "Шаг 4. Подключение к регистратору", p: [
            "Камеры Hikvision добавляются в свой NVR почти автоматически: подключите камеру к PoE-порту регистратора — он сам активирует её со своим паролем и выведет картинку. При подключении через внешний коммутатор зайдите в меню регистратора «Камера → Добавить», найдите камеру поиском и введите её пароль.",
            "Чужой бренд регистратора тоже возможен — по протоколу ONVIF, но фирменные функции (умная аналитика, точная детекция) могут работать не полностью.",
          ] },
          { h: "Типичные ошибки", p: [
            "Камера «не находится» — чаще всего она в другой подсети: компьютер 192.168.1.х, а камера с завода 192.168.1.64, но роутер раздаёт 192.168.0.х. Лечится сменой IP через SADP. Вторая по частоте ошибка — плохой обжим кабеля: линк то есть, то нет, камера перезагружается.",
            "И главное: не оставляйте камеры «смотреть в интернет» с заводскими настройками и без обновления прошивки — именно такие устройства попадают в ботнеты. Если не хочется разбираться — подключим и настроим под ключ, с гарантией на монтаж.",
          ] },
        ],
        faq: [
          { q: "Какой кабель нужен для IP-камеры?", a: "Витая пара UTP cat5e или cat6. Для улицы — уличного исполнения или в гофре; при трассе больше 100 м — PoE-удлинитель либо оптика с медиаконвертерами." },
          { q: "Можно ли подключить камеру без регистратора?", a: "Да: камера пишет на карту памяти и в облако, просмотр — через Hik-Connect. Регистратор нужен, когда камер несколько и требуется длинный локальный архив." },
          { q: "Почему SADP не видит камеру?", a: "Проверьте, что компьютер и камера в одной локальной сети, отключите VPN и брандмауэр, проверьте индикатор линка на разъёме. Часто помогает прямое подключение камеры к компьютеру." },
          { q: "Что делать, если забыл пароль от камеры?", a: "На большинстве моделей — длинное нажатие кнопки Reset (сброс к заводским). Если кнопки нет, пароль сбрасывается через код экспорта в SADP и поддержку Hikvision." },
        ],
      },
      uz: {
        title: "Hikvision IP-kamerasini qanday ulash: bosqichma-bosqich yo'riqnoma",
        excerpt: "Hikvision IP-kamerasini noldan ulaymiz: quvvat va kabel, SADP orqali aktivatsiya, Hik-Connect va registratorga qo'shish, yangi boshlovchilarning odatiy xatolari.",
        sections: [
          { h: "Nima kerak bo'ladi", p: [
            "Kameraning o'zi, vitaya para kabeli (UTP cat5e yoki yuqori), quvvat manbai — PoE-kommutator, PoE-injektor yoki 12 V blok, hamda sozlash uchun kompyuter yoki smartfon. Kameralar bir nechta bo'lsa, darhol PoE-kommutator oling: quvvat va ma'lumot bitta kabel orqali boradi.",
            "Kompyuterdan sozlash uchun Hikvision saytidan bepul SADP dasturini yuklab oling — u tarmoqdagi barcha kameralarni topib, IP-manzillarini ko'rsatadi.",
          ] },
          { h: "1-qadam. Kabel va quvvatni ulaymiz", p: [
            "Vitaya parani ikki tomondan T568B standarti bo'yicha RJ45 ulagichlar bilan siqib, kamerani kommutatorning PoE-portiga ulang. 30–60 soniyadan keyin kamera yuklanadi — ulagichda link indikatori miltillaydi. PoE uchun kabelning maksimal uzunligi — 100 metr.",
            "12 V blokdan quvvatlashda polyarlik va kabel kesimiga e'tibor bering: uzun trassalarda kuchlanish pasayadi va kamera kechalari, IQ-yoritish yonganda, qayta yuklana boshlaydi.",
          ] },
          { h: "2-qadam. Aktivatsiya va parol", p: [
            "Yangi Hikvision kamerasi noaktiv: birinchi yoqilganda administrator parolini talab qiladi. SADP'ni ishga tushiring, ro'yxatdan kamerani toping (Inactive holati), belgilang va parol qo'ying — kamida 8 belgi, harf va raqamlar bilan. Shu yerda IP-manzilni tarmog'ingiz manziliga almashtirish mumkin.",
            "Parolni ishonchli joyga yozib qo'ying: unutilgan parolni tiklash — Reset tugmasi yoki qurilma kodi bilan servisga murojaat orqali, tez bo'lmaydi.",
          ] },
          { h: "3-qadam. Telefonga qo'shamiz (Hik-Connect)", p: [
            "Kameraning veb-interfeysida («Tarmoq → Platformaga kirish») Hik-Connect bulutini yoqing va tasdiqlash kodini qo'ying. Keyin smartfondagi Hik-Connect ilovasida «plyus» bosib, kamera korpusidagi QR-kodni skanerlang. Bir daqiqadan so'ng jonli video paydo bo'ladi.",
            "Kamera registrator bilan ishlasa, ilovaga har bir kamerani emas, registratorni qo'shing — arxiv bilan ham osonroq.",
          ] },
          { h: "4-qadam. Registratorga ulash", p: [
            "Hikvision kameralari o'z NVR'iga deyarli avtomatik qo'shiladi: kamerani registratorning PoE-portiga ulang — u o'zi aktivlashtirib, tasvirni chiqaradi. Tashqi kommutator orqali ulanganda registrator menyusida «Kamera → Qo'shish» bo'limiga kirib, qidiruv orqali toping va parolni kiriting.",
            "Boshqa brend registratori ham mumkin — ONVIF protokoli orqali, lekin firma funksiyalari to'liq ishlamasligi mumkin.",
          ] },
          { h: "Odatiy xatolar", p: [
            "Kamera «topilmaydi» — ko'pincha u boshqa pastki tarmoqda: SADP orqali IP-manzilni almashtirish davolaydi. Ikkinchi keng tarqalgan xato — kabelning yomon siqilishi: link goh bor, goh yo'q, kamera qayta yuklanadi.",
            "Va asosiysi: kameralarni zavod sozlamalari bilan «internetga qarab» qoldirmang — aynan shunday qurilmalar botnetlarga tushadi. O'zingiz shug'ullanishni istamasangiz — kalit topshirish sharti bilan ulab, sozlab beramiz.",
          ] },
        ],
        faq: [
          { q: "IP-kamera uchun qanday kabel kerak?", a: "UTP cat5e yoki cat6 vitaya para. Ko'cha uchun — ko'cha ijrosida yoki gofrada; trassa 100 m dan uzun bo'lsa — PoE-uzaytirgich yoki optika." },
          { q: "Kamerani registratorsiz ulash mumkinmi?", a: "Ha: kamera xotira kartasiga va bulutga yozadi, ko'rish — Hik-Connect orqali. Registrator kameralar ko'p va uzoq lokal arxiv kerak bo'lganda zarur." },
          { q: "Nega SADP kamerani ko'rmayapti?", a: "Kompyuter va kamera bitta lokal tarmoqda ekanini tekshiring, VPN va brandmauerni o'chiring. Ko'pincha kamerani kompyuterga to'g'ridan-to'g'ri ulash yordam beradi." },
          { q: "Kamera parolini unutsam nima qilaman?", a: "Ko'p modellarda — Reset tugmasini uzoq bosish (zavod sozlamalariga qaytarish). Tugma bo'lmasa — SADP'dagi eksport kodi va Hikvision qo'llab-quvvatlashi orqali." },
        ],
      },
      en: {
        title: "How to Connect a Hikvision IP Camera: Step-by-Step Guide",
        excerpt: "Setting up a Hikvision IP camera from scratch: power and cabling, activation via SADP, adding it to Hik-Connect and to a recorder, plus the mistakes beginners typically make.",
        sections: [
          { h: "What you'll need", p: [
            "The camera itself, a twisted-pair cable (UTP cat5e or higher), a power source — a PoE switch, PoE injector or a 12 V adapter — and a computer or smartphone for setup. If you have several cameras, go straight for a PoE switch: power and data run over a single cable, with no power outlet needed at each camera.",
            "For setup from a computer, download the free SADP utility from the Hikvision website — it discovers every camera on the network and shows their IP addresses.",
          ] },
          { h: "Step 1. Cable and power", p: [
            "Terminate the twisted pair with RJ45 connectors using the T568B standard on both ends and connect the camera to a PoE port on the switch. The camera boots in 30–60 seconds — the link indicator on the connector starts blinking. The maximum cable run for PoE is 100 meters; for longer distances use PoE extenders or fiber.",
            "If you're powering from a 12 V adapter, watch the polarity and the gauge of the power cable: on long runs the voltage sags, and the camera starts rebooting at night when the IR illumination kicks in.",
          ] },
          { h: "Step 2. Activation and password", p: [
            "A new Hikvision camera ships inactive: on first power-up it requires you to set an administrator password. Launch SADP, find the camera in the list (status Inactive), select it and set a password — at least 8 characters with letters and digits. You can change the IP address to match your network in the same window.",
            "Store the password somewhere safe: recovering a forgotten password on Hikvision cameras means either the Reset button or contacting support with a device export code — there's no quick way around it.",
          ] },
          { h: "Step 3. Adding it to your phone (Hik-Connect)", p: [
            "In the camera's web interface (Network → Platform Access), enable the Hik-Connect cloud and set a verification code. Then in the Hik-Connect app on your smartphone, tap the plus button and scan the QR code on the camera housing. Live video appears within a minute — you can watch from anywhere in the world.",
            "If the camera works with a recorder, add the recorder to the app rather than each camera individually — it's simpler and gives you archive access too.",
          ] },
          { h: "Step 4. Connecting to a recorder", p: [
            "Hikvision cameras join their own NVR almost automatically: plug the camera into the recorder's PoE port — it activates the camera with its own password and brings up the picture. When connecting through an external switch, open the recorder menu Camera → Add, find the camera via search and enter its password.",
            "A recorder from another brand works too — via the ONVIF protocol — but proprietary features (smart analytics, accurate detection) may not work in full.",
          ] },
          { h: "Typical mistakes", p: [
            "The camera \"can't be found\" — most often it sits in a different subnet: the computer is on 192.168.1.x while the camera's factory address is 192.168.1.64, but the router hands out 192.168.0.x. The fix is changing the IP via SADP. The second most common mistake is a poorly crimped cable: the link comes and goes, and the camera keeps rebooting.",
            "Most importantly: don't leave cameras exposed to the internet with factory settings and outdated firmware — those are exactly the devices that end up in botnets. If you'd rather not deal with any of this, we'll connect and configure everything turnkey, with an installation warranty.",
          ] },
        ],
        faq: [
          { q: "What cable does an IP camera need?", a: "Twisted pair, UTP cat5e or cat6. Outdoors — outdoor-rated cable or conduit; for runs over 100 m, a PoE extender or fiber with media converters." },
          { q: "Can I connect a camera without a recorder?", a: "Yes: the camera records to a memory card and to the cloud, and you watch via Hik-Connect. A recorder is needed when you have several cameras and want a long local archive." },
          { q: "Why doesn't SADP see the camera?", a: "Make sure the computer and the camera are on the same local network, disable VPN and firewall, and check the link indicator on the connector. Connecting the camera directly to the computer often helps." },
          { q: "What if I forgot the camera password?", a: "On most models — a long press of the Reset button (factory reset). If there's no button, the password is reset through an export code in SADP and Hikvision support." },
        ],
      },
      tr: {
        title: "Hikvision IP Kamera Nasıl Bağlanır: Adım Adım Rehber",
        excerpt: "Hikvision IP kamerayı sıfırdan kuruyoruz: güç ve kablolama, SADP ile aktivasyon, Hik-Connect'e ve kayıt cihazına ekleme, yeni başlayanların tipik hataları.",
        sections: [
          { h: "Neler gerekli", p: [
            "Kameranın kendisi, çift bükümlü kablo (UTP cat5e veya üzeri), bir güç kaynağı — PoE switch, PoE enjektör veya 12 V adaptör — ve kurulum için bir bilgisayar ya da akıllı telefon. Birden fazla kamera varsa doğrudan PoE switch alın: güç ve veri tek kablodan gider, her kameranın yanında prize gerek kalmaz.",
            "Bilgisayardan kurulum için Hikvision'un sitesinden ücretsiz SADP aracını indirin — ağdaki tüm kameraları bulur ve IP adreslerini gösterir.",
          ] },
          { h: "Adım 1. Kablo ve güç bağlantısı", p: [
            "Çift bükümlü kabloyu her iki uçtan T568B standardına göre RJ45 konnektörlerle sıkın ve kamerayı switch'in PoE portuna bağlayın. Kamera 30–60 saniyede açılır — konnektördeki link göstergesi yanıp sönmeye başlar. PoE için maksimum kablo uzunluğu 100 metredir; daha uzun mesafelerde PoE uzatıcı veya fiber kullanılır.",
            "12 V adaptörle besliyorsanız polariteye ve güç kablosunun kesitine dikkat edin: uzun hatlarda gerilim düşer ve IR aydınlatma devreye girdiğinde kamera geceleri yeniden başlamaya başlar.",
          ] },
          { h: "Adım 2. Aktivasyon ve şifre", p: [
            "Yeni bir Hikvision kamera aktif değildir: ilk açılışta yönetici şifresi belirlemenizi ister. SADP'yi çalıştırın, listede kamerayı bulun (durumu Inactive), işaretleyin ve bir şifre belirleyin — harf ve rakam içeren en az 8 karakter. Aynı ekrandan IP adresini kendi ağınıza uygun şekilde değiştirebilirsiniz.",
            "Şifreyi güvenli bir yere not edin: Hikvision kameralarda unutulan şifreyi sıfırlamak Reset düğmesiyle ya da cihaz koduyla servise başvurarak yapılan bir işlemdir — hızlıca geri almak mümkün değildir.",
          ] },
          { h: "Adım 3. Telefona ekleme (Hik-Connect)", p: [
            "Kameranın web arayüzünde (Ağ → Platform Erişimi bölümü) Hik-Connect bulutunu etkinleştirin ve bir doğrulama kodu belirleyin. Ardından akıllı telefondaki Hik-Connect uygulamasında artı simgesine dokunun ve kameranın gövdesindeki QR kodu okutun. Bir dakika içinde canlı görüntü gelir — dünyanın her yerinden izleyebilirsiniz.",
            "Kamera bir kayıt cihazıyla çalışıyorsa, uygulamaya her kamerayı ayrı ayrı değil kayıt cihazını ekleyin — hem daha kolaydır hem de arşive erişim sağlar.",
          ] },
          { h: "Adım 4. Kayıt cihazına bağlama", p: [
            "Hikvision kameralar kendi NVR'ına neredeyse otomatik eklenir: kamerayı kayıt cihazının PoE portuna takın — cihaz kamerayı kendi şifresiyle aktive eder ve görüntüyü ekrana getirir. Harici switch üzerinden bağlantıda kayıt cihazının menüsünde Kamera → Ekle bölümüne girin, kamerayı aramayla bulun ve şifresini girin.",
            "Başka marka kayıt cihazı da mümkündür — ONVIF protokolüyle; ancak markaya özel işlevler (akıllı analiz, hassas algılama) tam çalışmayabilir.",
          ] },
          { h: "Tipik hatalar", p: [
            "Kamera \"bulunamıyor\" — çoğu zaman farklı bir alt ağdadır: bilgisayar 192.168.1.x'te, kameranın fabrika adresi 192.168.1.64, ama router 192.168.0.x dağıtıyordur. Çözüm, SADP ile IP değiştirmektir. İkinci en sık hata kötü sıkılmış kablodur: link bir gelir bir gider, kamera sürekli yeniden başlar.",
            "Ve en önemlisi: kameraları fabrika ayarlarıyla ve güncellenmemiş yazılımla \"internete açık\" bırakmayın — botnet'lere düşen cihazlar tam da bunlardır. Uğraşmak istemiyorsanız — anahtar teslim bağlayıp kuruyoruz, montaj garantisiyle.",
          ] },
        ],
        faq: [
          { q: "IP kamera için hangi kablo gerekir?", a: "Çift bükümlü UTP cat5e veya cat6. Dış mekân için — dış ortam kablosu veya spiral boru içinde; 100 m'yi aşan hatlarda PoE uzatıcı ya da medya konvertörlü fiber." },
          { q: "Kayıt cihazı olmadan kamera bağlanabilir mi?", a: "Evet: kamera hafıza kartına ve buluta kayıt yapar, izleme Hik-Connect üzerinden olur. Kayıt cihazı, kamera sayısı fazlaysa ve uzun yerel arşiv gerekiyorsa lazımdır." },
          { q: "SADP kamerayı neden görmüyor?", a: "Bilgisayar ile kameranın aynı yerel ağda olduğundan emin olun, VPN'i ve güvenlik duvarını kapatın, konnektördeki link göstergesini kontrol edin. Kamerayı doğrudan bilgisayara bağlamak çoğu zaman işe yarar." },
          { q: "Kameranın şifresini unuttuysam ne yapmalıyım?", a: "Çoğu modelde — Reset düğmesine uzun basmak (fabrika ayarlarına dönüş). Düğme yoksa şifre, SADP'deki dışa aktarma kodu ve Hikvision destek üzerinden sıfırlanır." },
        ],
      },
      zh: {
        title: "Hikvision 网络摄像机接入教程：手把手图解",
        excerpt: "从零开始接入 Hikvision 网络摄像机：供电与布线、通过 SADP 激活、添加到 Hik-Connect 和录像机，以及新手常犯的错误。",
        sections: [
          { h: "需要准备什么", p: [
            "摄像机本身、双绞线网线（UTP cat5e 或以上）、供电设备——PoE 交换机、PoE 供电器或 12 V 电源适配器——以及用于调试的电脑或手机。如果摄像机不止一台，建议直接选 PoE 交换机：供电和数据走同一根网线，无需在每台摄像机旁布置电源插座。",
            "用电脑调试时，请从 Hikvision 官网下载免费的 SADP 工具——它能找到网络中的所有摄像机并显示其 IP 地址。",
          ] },
          { h: "第一步：接线和供电", p: [
            "按 T568B 标准在网线两端压接 RJ45 水晶头，把摄像机接到交换机的 PoE 端口。30–60 秒后摄像机完成启动——接口上的链路指示灯开始闪烁。PoE 的最大传输距离为 100 米；更远的距离需要使用 PoE 延长器或光纤。",
            "使用 12 V 电源供电时，注意极性和电源线的线径：线路过长会导致电压下降，夜间红外补光一开启，摄像机就会反复重启。",
          ] },
          { h: "第二步：激活并设置密码", p: [
            "新的 Hikvision 摄像机处于未激活状态：首次通电时要求设置管理员密码。打开 SADP，在列表中找到该摄像机（状态为 Inactive），勾选后设置密码——至少 8 位，包含字母和数字。在同一界面还可以把 IP 地址改成您所在网络的地址。",
            "请把密码记在可靠的地方：Hikvision 摄像机找回密码需要通过 Reset 按键，或凭设备码联系售后处理，无法快速恢复。",
          ] },
          { h: "第三步：添加到手机（Hik-Connect）", p: [
            "在摄像机的网页管理界面（\"网络 → 平台接入\"）开启 Hik-Connect 云服务并设置验证码。然后在手机的 Hik-Connect 应用中点击\"加号\"，扫描机身上的二维码。约一分钟后即可看到实时画面——在世界任何地方都能查看。",
            "如果摄像机配合录像机使用，应把录像机添加到应用，而不是逐台添加摄像机——这样更省事，也方便回放录像。",
          ] },
          { h: "第四步：接入录像机", p: [
            "Hikvision 摄像机接入自家 NVR 几乎是全自动的：把摄像机插到录像机的 PoE 端口——录像机会用自己的密码激活它并显示画面。如果通过外部交换机连接，请进入录像机菜单\"摄像机 → 添加\"，搜索找到摄像机并输入其密码。",
            "接入其他品牌的录像机也可行——通过 ONVIF 协议，但品牌专属功能（智能分析、精准侦测）可能无法完全发挥。",
          ] },
          { h: "常见错误", p: [
            "\"找不到摄像机\"——多数情况是网段不一致：电脑在 192.168.1.x，摄像机的出厂地址是 192.168.1.64，而路由器分配的却是 192.168.0.x。用 SADP 修改 IP 即可解决。第二常见的错误是水晶头压接不良：链路时通时断，摄像机反复重启。",
            "最重要的一点：不要让摄像机保持出厂设置、不更新固件就直接暴露在公网上——沦为僵尸网络肉鸡的正是这类设备。如果不想自己折腾——我们可以提供一站式接入和调试服务，并对施工提供质保。",
          ] },
        ],
        faq: [
          { q: "网络摄像机需要用什么网线？", a: "UTP cat5e 或 cat6 双绞线。室外使用需选室外级线材或穿波纹管；线路超过 100 米时，需使用 PoE 延长器或配光纤收发器的光纤线路。" },
          { q: "没有录像机能接摄像机吗？", a: "可以：摄像机把录像存到存储卡和云端，通过 Hik-Connect 观看。当摄像机较多且需要较长的本地录像存档时，才需要录像机。" },
          { q: "为什么 SADP 找不到摄像机？", a: "确认电脑和摄像机在同一局域网内，关闭 VPN 和防火墙，检查接口上的链路指示灯。把摄像机直接连到电脑上往往能解决问题。" },
          { q: "忘记摄像机密码怎么办？", a: "大多数型号——长按 Reset 按键（恢复出厂设置）。如果没有按键，则通过 SADP 导出设备码并联系 Hikvision 售后来重置密码。" },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-videoregistrator",
    date: "2026-07-29",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Как выбрать видеорегистратор: NVR или DVR, каналы, диски",
        excerpt: "Разбираем выбор видеорегистратора: чем NVR отличается от DVR, сколько каналов и какой жёсткий диск брать, зачем нужны PoE-порты и на что смотреть в характеристиках.",
        sections: [
          { h: "NVR или DVR: в чём разница", p: [
            "NVR (сетевой регистратор) работает с IP-камерами по витой паре и «понимает» их умные функции — детекцию людей и машин, пересечение линии. DVR (гибридный/аналоговый) принимает камеры по коаксиальному кабелю и нужен в основном там, где сохраняется старая аналоговая проводка.",
            "Для новых объектов сегодня выбирают NVR и IP-камеры: выше разрешение, питание по тому же кабелю (PoE), умная аналитика вместо ложных срабатываний «на листву».",
          ] },
          { h: "Сколько каналов брать", p: [
            "Каналы — это сколько камер регистратор принимает одновременно. Правило простое: берите с запасом на треть. Стоят 4 камеры — берите 8-канальный: докупить камеру дешевле, чем менять регистратор. Типовые линейки — 4, 8, 16 и 32 канала.",
            "Смотрите не только на число каналов, но и на «входящую пропускную способность» (Мбит/с): бюджетный 8-канальник может не переварить восемь камер по 8 Мп на полном битрейте.",
          ] },
          { h: "Разрешение и декодирование", p: [
            "Регистратор должен поддерживать разрешение ваших камер с запасом: для камер 4 Мп — модели с поддержкой до 8 Мп. Вторая цифра — сколько потоков он может показывать на мониторе одновременно: дешёвые модели при раскладке 4×4 переключаются на субпотоки, и картинка мылится.",
            "Полезная функция — кодек H.265: он вдвое сокращает объём архива по сравнению с H.264 без потери качества.",
          ] },
          { h: "Жёсткий диск и глубина архива", p: [
            "Диск покупается отдельно и обязательно серии для видеонаблюдения (WD Purple, Seagate SkyHawk) — обычные десктопные диски не рассчитаны на круглосуточную запись и быстро умирают. Ориентир по объёму: 4 камеры по 4 Мп с H.265 пишут около 1 ТБ за 8–10 суток непрерывной записи.",
            "Запись по детекции движения увеличивает глубину архива в 2–4 раза. Для 30 суток архива на 8 камер обычно достаточно 6–8 ТБ.",
          ] },
          { h: "PoE-регистраторы: когда удобно", p: [
            "NVR со встроенными PoE-портами питает камеры сам: воткнули кабель — камера работает, отдельный коммутатор не нужен. Это идеальный вариант для дома и небольшого офиса на 4–8 камер: минимум оборудования и настройки.",
            "На больших объектах гибче схема с отдельными PoE-коммутаторами: камеры группируются по этажам, а до регистратора идёт один магистральный кабель.",
          ] },
          { h: "Итог: как не ошибиться", p: [
            "Формула выбора: каналы с запасом ×1.5, поддержка разрешения ваших камер, H.265, диск Purple/SkyHawk нужного объёма и облачный доступ с телефона. Остальное — детали конкретного объекта.",
            "Пришлите список камер или план объекта — подберём регистратор и диск под нужную глубину архива, установим и настроим просмотр с телефона.",
          ] },
        ],
        faq: [
          { q: "Сколько дней хранится запись?", a: "Зависит от объёма диска, числа камер и режима записи. Типовой пример: 8 камер 4 Мп, H.265, запись по движению, диск 6 ТБ — около месяца архива." },
          { q: "Какой жёсткий диск нужен для регистратора?", a: "Специализированный для видеонаблюдения: WD Purple или Seagate SkyHawk. Они рассчитаны на круглосуточную запись и работу в RAID/многодисковых NVR." },
          { q: "Подойдут ли камеры другого бренда к регистратору?", a: "Да, по протоколу ONVIF большинство IP-камер совместимы с любым NVR. Но умная аналитика и тонкие настройки полноценно работают в связке «камера и регистратор одного бренда»." },
          { q: "Нужен ли монитор для регистратора?", a: "Для первичной настройки удобен, но не обязателен: регистратор настраивается через веб-интерфейс с компьютера, а ежедневный просмотр идёт с телефона." },
        ],
      },
      uz: {
        title: "Videoregistratorni qanday tanlash: NVR yoki DVR, kanallar, disklar",
        excerpt: "Videoregistrator tanlashni ko'rib chiqamiz: NVR DVR'dan nimasi bilan farq qiladi, nechta kanal va qanday qattiq disk olish kerak, PoE-portlar nima uchun kerak.",
        sections: [
          { h: "NVR yoki DVR: farqi nimada", p: [
            "NVR (tarmoq registratori) IP-kameralar bilan vitaya para orqali ishlaydi va ularning aqlli funksiyalarini «tushunadi» — odam va mashina detektori, chiziqni kesib o'tish. DVR esa kameralarni koaksial kabel orqali qabul qiladi va asosan eski analog simlar saqlanib qolgan joylarda kerak.",
            "Yangi obyektlar uchun bugun NVR va IP-kameralar tanlanadi: yuqoriroq aniqlik, o'sha kabel orqali quvvat (PoE), «barglarga» yolg'on ishlash o'rniga aqlli analitika.",
          ] },
          { h: "Nechta kanal olish kerak", p: [
            "Kanallar — registrator bir vaqtda nechta kamerani qabul qilishi. Qoida oddiy: uchdan bir zaxira bilan oling. 4 ta kamera tursa — 8 kanallik oling: kamera qo'shib olish registratorni almashtirishdan arzon. Odatiy liniyalar — 4, 8, 16 va 32 kanal.",
            "Faqat kanallar soniga emas, «kiruvchi o'tkazish qobiliyati»ga (Mbit/s) ham qarang: byudjet 8-kanallik sakkizta 8 Mp kamerani to'liq bitreytda ko'tara olmasligi mumkin.",
          ] },
          { h: "Aniqlik va dekodlash", p: [
            "Registrator kameralaringiz aniqligini zaxira bilan qo'llab-quvvatlashi kerak: 4 Mp kameralar uchun — 8 Mp gacha modellari. Ikkinchi raqam — monitorda bir vaqtda nechta oqim ko'rsata olishi: arzon modellar 4×4 joylashuvda sub-oqimlarga o'tadi va tasvir xiralashadi.",
            "Foydali funksiya — H.265 kodeki: u arxiv hajmini H.264 ga nisbatan ikki baravar kamaytiradi.",
          ] },
          { h: "Qattiq disk va arxiv chuqurligi", p: [
            "Disk alohida sotib olinadi va albatta videokuzatuv seriyasidan (WD Purple, Seagate SkyHawk) — oddiy desktop disklar sutkalik yozuvga mo'ljallanmagan va tez ishdan chiqadi. Hajm bo'yicha mo'ljal: H.265 bilan 4 Mp'li 4 ta kamera uzluksiz yozuvda 1 TB'ni 8–10 kunda to'ldiradi.",
            "Harakat bo'yicha yozish arxiv chuqurligini 2–4 baravar oshiradi. 8 kamera uchun 30 kunlik arxivga odatda 6–8 TB yetadi.",
          ] },
          { h: "PoE-registratorlar: qachon qulay", p: [
            "Ichki PoE-portli NVR kameralarni o'zi quvvatlaydi: kabelni ulading — kamera ishlaydi, alohida kommutator kerak emas. Bu 4–8 kamerali uy va kichik ofis uchun ideal variant.",
            "Katta obyektlarda alohida PoE-kommutatorli sxema moslashuvchanroq: kameralar qavatlar bo'yicha guruhlanadi.",
          ] },
          { h: "Xulosa: qanday adashmaslik", p: [
            "Tanlash formulasi: kanallar ×1.5 zaxira bilan, kameralaringiz aniqligini qo'llab-quvvatlash, H.265, kerakli hajmdagi Purple/SkyHawk disk va telefondan bulutli kirish.",
            "Kameralar ro'yxatini yoki obyekt rejasini yuboring — kerakli arxiv chuqurligiga registrator va disk tanlab, o'rnatib, telefondan ko'rishni sozlab beramiz.",
          ] },
        ],
        faq: [
          { q: "Yozuv necha kun saqlanadi?", a: "Disk hajmi, kameralar soni va yozuv rejimiga bog'liq. Odatiy misol: 8 ta 4 Mp kamera, H.265, harakat bo'yicha yozuv, 6 TB disk — taxminan bir oylik arxiv." },
          { q: "Registrator uchun qanday qattiq disk kerak?", a: "Videokuzatuv uchun maxsus: WD Purple yoki Seagate SkyHawk. Ular sutkalik yozuvga mo'ljallangan." },
          { q: "Boshqa brend kameralari registratorga mos keladimi?", a: "Ha, ONVIF protokoli orqali ko'pchilik IP-kameralar istalgan NVR bilan mos. Lekin aqlli analitika bitta brend juftligida to'liq ishlaydi." },
          { q: "Registrator uchun monitor kerakmi?", a: "Birinchi sozlash uchun qulay, lekin shart emas: registrator kompyuterdan veb-interfeys orqali sozlanadi, kundalik ko'rish telefondan bo'ladi." },
        ],
      },
      en: {
        title: "Choosing a Video Recorder: NVR vs DVR, Channels, Drives",
        excerpt: "A practical guide to choosing a video recorder: how an NVR differs from a DVR, how many channels and which hard drive to get, why PoE ports matter, and which specs to check.",
        sections: [
          { h: "NVR or DVR: What's the Difference", p: [
            "An NVR (network video recorder) works with IP cameras over twisted-pair cabling and understands their smart features — human and vehicle detection, line crossing. A DVR (hybrid/analog recorder) takes cameras over coaxial cable and is mainly needed where legacy analog wiring is still in place.",
            "For new sites the standard choice today is an NVR with IP cameras: higher resolution, power over the same cable (PoE), and smart analytics instead of false alarms triggered by swaying leaves.",
          ] },
          { h: "How Many Channels Do You Need", p: [
            "Channels define how many cameras the recorder can handle at once. The rule is simple: leave about a third in reserve. Installing 4 cameras? Get an 8-channel unit — adding a camera later is cheaper than replacing the recorder. Typical lineups come in 4, 8, 16 and 32 channels.",
            "Look beyond the channel count at the incoming bandwidth (Mbps): a budget 8-channel recorder may choke on eight 8 MP cameras streaming at full bitrate.",
          ] },
          { h: "Resolution and Decoding", p: [
            "The recorder should support your cameras' resolution with headroom: for 4 MP cameras, pick models rated up to 8 MP. The second figure to check is how many streams it can display on a monitor simultaneously: cheap models switch to sub-streams in a 4×4 layout, and the picture turns blurry.",
            "A valuable feature is the H.265 codec: it halves archive size compared to H.264 with no loss in quality.",
          ] },
          { h: "Hard Drive and Archive Depth", p: [
            "The drive is bought separately and must be a surveillance-grade series (WD Purple, Seagate SkyHawk) — regular desktop drives are not built for 24/7 recording and fail quickly. As a capacity benchmark: 4 cameras at 4 MP with H.265 fill about 1 TB in 8–10 days of continuous recording.",
            "Motion-triggered recording extends archive depth by 2–4 times. For 30 days of footage from 8 cameras, 6–8 TB is usually enough.",
          ] },
          { h: "PoE Recorders: When They Make Sense", p: [
            "An NVR with built-in PoE ports powers the cameras itself: plug in the cable and the camera is running — no separate switch required. It's the ideal option for a home or small office with 4–8 cameras: minimal hardware and setup.",
            "On larger sites a layout with dedicated PoE switches is more flexible: cameras are grouped by floor, and a single trunk cable runs to the recorder.",
          ] },
          { h: "Bottom Line: How to Get It Right", p: [
            "The selection formula: channels with a ×1.5 reserve, support for your cameras' resolution, H.265, a Purple/SkyHawk drive of the right capacity, and cloud access from your phone. Everything else comes down to the specifics of your site.",
            "Send us your camera list or a site plan — we'll match a recorder and drive to the archive depth you need, install everything and set up mobile viewing.",
          ] },
        ],
        faq: [
          { q: "How many days of footage are stored?", a: "It depends on drive capacity, the number of cameras and the recording mode. A typical example: 8 cameras at 4 MP, H.265, motion-triggered recording, a 6 TB drive — about a month of archive." },
          { q: "Which hard drive does a video recorder need?", a: "A surveillance-grade one: WD Purple or Seagate SkyHawk. They are designed for 24/7 recording and for RAID/multi-drive NVR operation." },
          { q: "Will cameras from another brand work with my recorder?", a: "Yes — via the ONVIF protocol most IP cameras are compatible with any NVR. However, smart analytics and fine-grained settings work fully only when the camera and recorder come from the same brand." },
          { q: "Do I need a monitor for the recorder?", a: "It's handy for initial setup but not required: the recorder can be configured through its web interface from a computer, while day-to-day viewing happens on your phone." },
        ],
      },
      tr: {
        title: "Kayıt Cihazı Seçimi: NVR mi DVR mi, Kanallar, Diskler",
        excerpt: "Kayıt cihazı seçimini adım adım ele alıyoruz: NVR ile DVR arasındaki fark, kaç kanal ve hangi sabit disk alınmalı, PoE portları ne işe yarar ve teknik özelliklerde nelere bakılmalı.",
        sections: [
          { h: "NVR mi DVR mi: Fark Nedir", p: [
            "NVR (ağ tabanlı kayıt cihazı) IP kameralarla twisted-pair kablo üzerinden çalışır ve kameraların akıllı özelliklerini destekler: insan ve araç algılama, çizgi geçişi tespiti. DVR (hibrit/analog kayıt cihazı) kameraları koaksiyel kablo üzerinden alır ve genellikle eski analog kablolamanın korunduğu yerlerde gerekir.",
            "Yeni projelerde bugün tercih NVR ve IP kameralardan yanadır: daha yüksek çözünürlük, aynı kablo üzerinden besleme (PoE) ve yapraklardan kaynaklanan yanlış alarmlar yerine akıllı analitik.",
          ] },
          { h: "Kaç Kanal Almalı", p: [
            "Kanal sayısı, cihazın aynı anda kaç kamerayı kabul edebileceğini gösterir. Kural basit: üçte bir oranında yedek payı bırakın. 4 kameranız mı var? 8 kanallı alın — sonradan kamera eklemek, cihazı değiştirmekten daha ucuzdur. Tipik seriler 4, 8, 16 ve 32 kanallıdır.",
            "Yalnızca kanal sayısına değil, gelen bant genişliğine (Mbps) de bakın: bütçe dostu bir 8 kanallı cihaz, tam bit hızında yayın yapan sekiz adet 8 MP kamerayı kaldıramayabilir.",
          ] },
          { h: "Çözünürlük ve Kod Çözme", p: [
            "Kayıt cihazı, kameralarınızın çözünürlüğünü pay bırakarak desteklemelidir: 4 MP kameralar için 8 MP'ye kadar destek sunan modelleri seçin. İkinci önemli değer, ekranda aynı anda kaç akışı gösterebildiğidir: ucuz modeller 4×4 düzeninde alt akışlara geçer ve görüntü bulanıklaşır.",
            "H.265 codec'i çok faydalı bir özelliktir: kalite kaybı olmadan arşiv boyutunu H.264'e kıyasla yarıya indirir.",
          ] },
          { h: "Sabit Disk ve Arşiv Süresi", p: [
            "Disk ayrıca satın alınır ve mutlaka video gözetim serisi olmalıdır (WD Purple, Seagate SkyHawk) — sıradan masaüstü diskleri 7/24 kayda göre tasarlanmamıştır ve hızla bozulur. Kapasite için referans: H.265 ile 4 adet 4 MP kamera, kesintisiz kayıtta 8–10 günde yaklaşık 1 TB doldurur.",
            "Hareket algılamalı kayıt, arşiv süresini 2–4 kat uzatır. 8 kamera için 30 günlük arşive genellikle 6–8 TB yeterlidir.",
          ] },
          { h: "PoE'li Kayıt Cihazları: Ne Zaman Mantıklı", p: [
            "Dahili PoE portlu bir NVR, kameraları kendisi besler: kabloyu taktığınız anda kamera çalışır, ayrıca switch gerekmez. Ev ve 4–8 kameralı küçük ofisler için ideal seçenektir: minimum ekipman ve kurulum.",
            "Büyük tesislerde ayrı PoE switch'li mimari daha esnektir: kameralar katlara göre gruplanır ve kayıt cihazına tek bir ana hat kablosu çekilir.",
          ] },
          { h: "Özet: Hata Yapmamak İçin", p: [
            "Seçim formülü: ×1,5 yedekli kanal sayısı, kameralarınızın çözünürlüğüne destek, H.265, uygun kapasitede Purple/SkyHawk disk ve telefondan bulut erişimi. Gerisi projenin kendine özgü detaylarıdır.",
            "Kamera listenizi veya tesis planınızı gönderin — ihtiyacınız olan arşiv süresine uygun kayıt cihazı ve diski seçelim, kurulumu yapıp telefondan izlemeyi ayarlayalım.",
          ] },
        ],
        faq: [
          { q: "Kayıtlar kaç gün saklanır?", a: "Disk kapasitesine, kamera sayısına ve kayıt moduna bağlıdır. Tipik örnek: 8 adet 4 MP kamera, H.265, hareket algılamalı kayıt, 6 TB disk — yaklaşık bir aylık arşiv." },
          { q: "Kayıt cihazı için hangi sabit disk gerekir?", a: "Video gözetime özel bir disk: WD Purple veya Seagate SkyHawk. Bu diskler 7/24 kayda ve RAID/çok diskli NVR çalışmasına göre tasarlanmıştır." },
          { q: "Başka markanın kameraları kayıt cihazıyla uyumlu olur mu?", a: "Evet, ONVIF protokolü sayesinde çoğu IP kamera herhangi bir NVR ile uyumludur. Ancak akıllı analitik ve ince ayarlar, kamera ile kayıt cihazı aynı markadan olduğunda tam kapasite çalışır." },
          { q: "Kayıt cihazı için monitör gerekli mi?", a: "İlk kurulumda kullanışlıdır ama zorunlu değildir: cihaz bilgisayardan web arayüzü üzerinden yapılandırılır, günlük izleme ise telefondan yapılır." },
        ],
      },
      zh: {
        title: "如何选择录像机：NVR还是DVR、通道数与硬盘",
        excerpt: "详解录像机选购要点：NVR与DVR的区别、该选多少通道和哪种硬盘、PoE端口的作用，以及技术参数中需要关注的指标。",
        sections: [
          { h: "NVR还是DVR：区别在哪里", p: [
            "NVR（网络录像机）通过双绞线连接IP摄像机，并支持其智能功能——人形和车辆检测、越线侦测。DVR（混合/模拟录像机）通过同轴电缆接入摄像机，主要用于保留旧模拟布线的场所。",
            "如今新建项目普遍选择NVR加IP摄像机：分辨率更高，同一根网线即可供电（PoE），智能分析取代了因树叶晃动引起的误报。",
          ] },
          { h: "该选多少通道", p: [
            "通道数决定录像机可同时接入多少台摄像机。规则很简单：留出约三分之一的余量。装4台摄像机就选8通道——日后加装摄像机比更换录像机便宜得多。常见产品线为4、8、16和32通道。",
            "除了通道数，还要关注接入带宽（Mbps）：入门级8通道录像机在满码率下可能无法承载八台800万像素摄像机。",
          ] },
          { h: "分辨率与解码能力", p: [
            "录像机对摄像机分辨率的支持应留有余量：400万像素摄像机应搭配支持800万像素的型号。第二个指标是可同时在显示器上解码的路数：廉价型号在4×4分屏时会切换到子码流，画面变得模糊。",
            "H.265编码是非常实用的功能：与H.264相比，可在不损失画质的前提下将存储占用减少一半。",
          ] },
          { h: "硬盘与存储时长", p: [
            "硬盘需单独购买，且必须选择监控专用系列（WD Purple、Seagate SkyHawk）——普通桌面硬盘不适合全天候录像，很快就会损坏。容量参考：4台400万像素摄像机采用H.265连续录像，约8–10天写满1 TB。",
            "移动侦测录像可将存储时长延长2–4倍。8台摄像机存30天录像，通常6–8 TB即可。",
          ] },
          { h: "PoE录像机：什么场景更方便", p: [
            "内置PoE端口的NVR可直接为摄像机供电：插上网线摄像机即可工作，无需单独的交换机。这是家庭和4–8台摄像机的小型办公室的理想方案：设备和配置都降到最少。",
            "在大型项目中，采用独立PoE交换机的方案更灵活：摄像机按楼层分组，只需一条主干线缆连接到录像机。",
          ] },
          { h: "总结：如何避免选错", p: [
            "选购公式：通道数按×1.5留余量、支持现有摄像机的分辨率、H.265、容量合适的Purple/SkyHawk硬盘，以及手机云端访问。其余都是具体项目的细节问题。",
            "把摄像机清单或场地平面图发给我们——我们会按所需存储时长匹配录像机和硬盘，并完成安装和手机观看的调试。",
          ] },
        ],
        faq: [
          { q: "录像能保存多少天？", a: "取决于硬盘容量、摄像机数量和录像模式。典型示例：8台400万像素摄像机、H.265、移动侦测录像、6 TB硬盘——约可保存一个月。" },
          { q: "录像机需要什么样的硬盘？", a: "监控专用硬盘：WD Purple或Seagate SkyHawk。它们专为全天候录像以及RAID/多盘位NVR环境设计。" },
          { q: "其他品牌的摄像机能接入录像机吗？", a: "可以，借助ONVIF协议，大多数IP摄像机可兼容任意NVR。但智能分析和精细设置只有在摄像机与录像机同品牌搭配时才能完整发挥。" },
          { q: "录像机需要配显示器吗？", a: "初次配置时有显示器更方便，但并非必需：录像机可通过电脑的网页界面进行设置，日常查看则用手机完成。" },
        ],
      },
    },
  },
  {
    slug: "kamera-dlya-doma",
    date: "2026-07-29",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Камера для дома и квартиры: как выбрать и что учесть",
        excerpt: "Wi-Fi или проводная, внутренняя или уличная, с записью в облако или на карту — выбираем камеру для дома, квартиры и подъезда без переплаты.",
        sections: [
          { h: "С чего начать выбор", p: [
            "Сначала определите задачу: присмотр за домом в отпуске, контроль няни или ремонта, двор и вход в частном доме, машина под окнами. От задачи зависит всё: тип камеры, место установки и способ записи.",
            "Для одной комнаты достаточно поворотной Wi-Fi-камеры за небольшие деньги. Для периметра частного дома нужны уличные камеры с ИК-подсветкой и, как правило, регистратор.",
          ] },
          { h: "Wi-Fi или проводная", p: [
            "Wi-Fi-камера ставится за пять минут: воткнули в розетку, привязали к приложению — готово. Минусы — зависимость от качества Wi-Fi и розетки рядом. Это выбор для квартиры и небольших задач.",
            "Проводная IP-камера с питанием PoE работает стабильнее: один кабель даёт и сеть, и питание, никаких обрывов из-за перегруженного роутера. Для дома с двором и несколькими камерами — только провод.",
          ] },
          { h: "Внутренняя или уличная", p: [
            "Уличная камера обязана иметь защиту от влаги и пыли (IP66/IP67) и рабочую температуру до −30…−40 °C — зимы в Узбекистане мягкие, но на солнце корпус нагревается до +60 °C, поэтому запас по температуре важен в обе стороны.",
            "Внутренние камеры компактнее и часто умеют поворачиваться за движением. Ставить внутреннюю камеру на улицу нельзя — конденсат убьёт её за один сезон.",
          ] },
          { h: "Разрешение и ночная съёмка", p: [
            "Для дома достаточно 2–4 Мп: этого хватает, чтобы узнать лицо на расстоянии нескольких метров. Гнаться за 8 Мп ради квартиры не нужно — вырастет только объём архива.",
            "Ночью решает не количество мегапикселей, а подсветка: ИК-подсветка даёт чёрно-белую картинку, технологии типа ColorVu/Full-Color — цветную. Для двора цветная ночная съёмка заметно информативнее.",
          ] },
          { h: "Куда писать: карта, регистратор или облако", p: [
            "Карта памяти в камере — самый простой вариант для 1–2 камер: недорого, но карту могут унести вместе с камерой. Облако решает эту проблему, но требует подписки. Регистратор с жёстким диском — правильный выбор от 3–4 камер: недели архива и никаких абонентских платежей.",
            "Хорошая практика — комбинировать: запись на регистратор плюс важные события в облако.",
          ] },
          { h: "Типовые комплекты и цена вопроса", p: [
            "Квартира: одна Wi-Fi-камера с картой памяти. Частный дом: 2–4 уличные камеры, PoE-регистратор, диск на месяц архива. Подъезд или двор многоквартирного дома — решается вместе с соседями и управляющей компанией, мы поможем с проектом.",
            "В нашем каталоге камеры Hikvision, Dahua, EZVIZ и TP-Link Tapo в наличии в Ташкенте — подберём под бюджет, установим и настроим просмотр с телефона.",
          ] },
        ],
        faq: [
          { q: "Какую камеру поставить в квартиру, чтобы смотреть с телефона?", a: "Поворотную Wi-Fi-камеру 2–4 Мп с картой памяти: установка за пять минут, просмотр через приложение из любой точки мира. Из нашего каталога — EZVIZ или TP-Link Tapo." },
          { q: "Нужен ли интернет для домашней камеры?", a: "Для записи — нет: камера пишет на карту или регистратор локально. Интернет нужен для просмотра с телефона и уведомлений." },
          { q: "Сколько стоит видеонаблюдение для частного дома?", a: "Зависит от числа камер и монтажа. Типовой комплект «4 уличные камеры + регистратор + диск» с установкой — рассчитаем бесплатно после выезда инженера." },
          { q: "Записывает ли камера звук?", a: "Большинство домашних камер — да, встроенный микрофон есть. У многих есть и динамик для двусторонней связи: можно говорить с посетителем через приложение." },
        ],
      },
      uz: {
        title: "Uy va kvartira uchun kamera: qanday tanlash va nimalarga e'tibor berish",
        excerpt: "Wi-Fi yoki simli, ichki yoki tashqi, bulutga yoki kartaga yozish — uy, kvartira va podez uchun kamerani ortiqcha to'lovsiz tanlaymiz.",
        sections: [
          { h: "Tanlashni nimadan boshlash", p: [
            "Avval vazifani aniqlang: ta'tilda uyni kuzatish, enaga yoki ta'mirni nazorat qilish, xususiy uyda hovli va kirish, deraza ostidagi mashina. Vazifadan hammasi bog'liq: kamera turi, o'rnatish joyi va yozish usuli.",
            "Bitta xona uchun arzon aylanuvchi Wi-Fi kamera yetarli. Xususiy uy perimetri uchun IQ-yoritishli tashqi kameralar va odatda registrator kerak.",
          ] },
          { h: "Wi-Fi yoki simli", p: [
            "Wi-Fi kamera besh daqiqada o'rnatiladi: rozetkaga ulading, ilovaga bog'lading — tayyor. Kamchiliklari — Wi-Fi sifatiga va yaqin atrofdagi rozetkaga bog'liqlik. Bu kvartira va kichik vazifalar uchun tanlov.",
            "PoE quvvatli simli IP-kamera barqarorroq ishlaydi: bitta kabel ham tarmoq, ham quvvat beradi. Hovlili uy va bir nechta kamera uchun — faqat sim.",
          ] },
          { h: "Ichki yoki tashqi", p: [
            "Tashqi kamera namlik va changdan himoyaga (IP66/IP67) hamda keng ish haroratiga ega bo'lishi shart — quyoshda korpus +60 °C gacha qiziydi, shuning uchun har ikki tomonga zaxira muhim.",
            "Ichki kameralar ixchamroq va ko'pincha harakat ortidan burila oladi. Ichki kamerani ko'chaga o'rnatib bo'lmaydi — kondensat uni bir mavsumda ishdan chiqaradi.",
          ] },
          { h: "Aniqlik va tungi suratga olish", p: [
            "Uy uchun 2–4 Mp yetarli: bir necha metr masofada yuzni tanish uchun shu kifoya. Kvartira uchun 8 Mp ketidan quvish shart emas — faqat arxiv hajmi o'sadi.",
            "Kechasi megapiksel emas, yoritish hal qiladi: IQ-yoritish oq-qora tasvir beradi, ColorVu/Full-Color texnologiyalari — rangli. Hovli uchun rangli tungi surat ancha ma'lumotliroq.",
          ] },
          { h: "Qayerga yozish: karta, registrator yoki bulut", p: [
            "Kameradagi xotira kartasi — 1–2 kamera uchun eng oddiy variant: arzon, lekin kartani kamera bilan birga olib ketishlari mumkin. Bulut bu muammoni hal qiladi, lekin obuna talab qiladi. Qattiq diskli registrator — 3–4 kameradan boshlab to'g'ri tanlov: haftalab arxiv va hech qanday abonent to'lovisiz.",
            "Yaxshi amaliyot — kombinatsiya: registratorga yozish plyus muhim voqealarni bulutga.",
          ] },
          { h: "Odatiy to'plamlar va narx", p: [
            "Kvartira: xotira kartali bitta Wi-Fi kamera. Xususiy uy: 2–4 tashqi kamera, PoE-registrator, bir oylik arxivga disk. Ko'p kvartirali uy podezi — qo'shnilar va boshqaruv kompaniyasi bilan birga hal qilinadi.",
            "Katalogimizda Hikvision, Dahua, EZVIZ va TP-Link Tapo kameralari Toshkentda mavjud — byudjetga mos tanlab, o'rnatib, telefondan ko'rishni sozlab beramiz.",
          ] },
        ],
        faq: [
          { q: "Telefondan ko'rish uchun kvartiraga qanday kamera qo'yish kerak?", a: "Xotira kartali 2–4 Mp aylanuvchi Wi-Fi kamera: besh daqiqada o'rnatiladi, dunyoning istalgan nuqtasidan ilova orqali ko'riladi." },
          { q: "Uy kamerasi uchun internet kerakmi?", a: "Yozish uchun — yo'q: kamera kartaga yoki registratorga lokal yozadi. Internet telefondan ko'rish va bildirishnomalar uchun kerak." },
          { q: "Xususiy uy uchun videokuzatuv qancha turadi?", a: "Kameralar soni va montajga bog'liq. «4 tashqi kamera + registrator + disk» odatiy to'plamini muhandis chiqishidan keyin bepul hisoblab beramiz." },
          { q: "Kamera ovoz yozadimi?", a: "Ko'pchilik uy kameralari — ha, o'rnatilgan mikrofon bor. Ko'plarida ikki tomonlama aloqa uchun dinamik ham bor." },
        ],
      },
      en: {
        title: "Home and Apartment Cameras: How to Choose the Right One",
        excerpt: "Wi-Fi or wired, indoor or outdoor, cloud or memory-card recording — how to pick a camera for your home, apartment or building entrance without overpaying.",
        sections: [
          { h: "Where to Start", p: [
            "First, define the task: keeping an eye on the house while on vacation, watching a nanny or a renovation crew, covering the yard and entrance of a private home, or a car parked under your windows. Everything follows from the task — camera type, mounting spot and recording method.",
            "For a single room, an inexpensive pan-and-tilt Wi-Fi camera is enough. For the perimeter of a private house you'll need outdoor cameras with IR illumination and, in most cases, a recorder.",
          ] },
          { h: "Wi-Fi or Wired", p: [
            "A Wi-Fi camera takes five minutes to set up: plug it into an outlet, pair it with the app — done. The downsides are dependence on Wi-Fi quality and the need for a nearby outlet. It's the right pick for an apartment and small-scale tasks.",
            "A wired IP camera powered over PoE runs far more reliably: one cable carries both network and power, with no dropouts from an overloaded router. For a house with a yard and several cameras, wired is the only way to go.",
          ] },
          { h: "Indoor or Outdoor", p: [
            "An outdoor camera must be dust- and water-proof (IP66/IP67) and rated down to −30…−40 °C. Winters in Uzbekistan are mild, but in direct sun the housing heats up to +60 °C, so temperature headroom matters in both directions.",
            "Indoor cameras are more compact and often track motion by panning. Never mount an indoor camera outside — condensation will kill it within a single season.",
          ] },
          { h: "Resolution and Night Vision", p: [
            "For a home, 2–4 MP is enough to recognize a face from several meters away. Chasing 8 MP for an apartment is pointless — it only inflates the archive size.",
            "At night, what matters is not megapixels but illumination: IR gives a black-and-white picture, while technologies like ColorVu/Full-Color deliver color. For a yard, color night footage is noticeably more informative.",
          ] },
          { h: "Where to Record: Card, Recorder or Cloud", p: [
            "A memory card inside the camera is the simplest option for 1–2 cameras: cheap, but the card can be carried off along with the camera. Cloud storage solves that, yet requires a subscription. A recorder with a hard drive is the right choice from 3–4 cameras up: weeks of archive and no monthly fees.",
            "A good practice is to combine both: record to the recorder and push key events to the cloud.",
          ] },
          { h: "Typical Kits and What They Cost", p: [
            "Apartment: one Wi-Fi camera with a memory card. Private house: 2–4 outdoor cameras, a PoE recorder and a drive sized for a month of archive. An entrance hall or courtyard of an apartment building is arranged together with neighbors and the building management — we'll help with the project.",
            "Our catalog stocks Hikvision, Dahua, EZVIZ and TP-Link Tapo cameras in Tashkent — we'll match one to your budget, install it and set up viewing from your phone.",
          ] },
        ],
        faq: [
          { q: "Which camera should I put in my apartment to watch from my phone?", a: "A pan-and-tilt Wi-Fi camera at 2–4 MP with a memory card: five-minute setup, viewing through the app from anywhere in the world. From our catalog — EZVIZ or TP-Link Tapo." },
          { q: "Does a home camera need the internet?", a: "Not for recording: the camera writes to a card or a recorder locally. The internet is needed for viewing from your phone and for notifications." },
          { q: "How much does video surveillance for a private house cost?", a: "It depends on the number of cameras and the installation work. For a typical kit — 4 outdoor cameras, a recorder and a drive, installed — we'll calculate the price for free after an engineer's site visit." },
          { q: "Does the camera record sound?", a: "Most home cameras do — a built-in microphone is standard. Many also have a speaker for two-way audio, so you can talk to a visitor through the app." },
        ],
      },
      tr: {
        title: "Ev ve Daire İçin Kamera: Nasıl Seçilir, Nelere Dikkat Edilir",
        excerpt: "Wi-Fi mi kablolu mu, iç mekân mı dış mekân mı, buluta mı karta mı kayıt — ev, daire ve apartman girişi için fazla ödemeden doğru kamerayı seçiyoruz.",
        sections: [
          { h: "Seçime Nereden Başlamalı", p: [
            "Önce ihtiyacı belirleyin: tatildeyken evi gözetmek, bakıcıyı veya tadilatı takip etmek, müstakil evin bahçesi ve girişi ya da pencere altındaki araba. Her şey bu ihtiyaca bağlıdır: kamera tipi, montaj yeri ve kayıt yöntemi.",
            "Tek bir oda için uygun fiyatlı, döner başlıklı bir Wi-Fi kamera yeterlidir. Müstakil evin çevresi içinse IR aydınlatmalı dış mekân kameraları ve genellikle bir kayıt cihazı gerekir.",
          ] },
          { h: "Wi-Fi mi Kablolu mu", p: [
            "Wi-Fi kamera beş dakikada kurulur: prize takın, uygulamaya bağlayın — hazır. Eksileri, Wi-Fi kalitesine bağımlılık ve yakında priz gereksinimidir. Daire ve küçük çaplı işler için doğru tercihtir.",
            "PoE beslemeli kablolu IP kamera çok daha kararlı çalışır: tek kablo hem ağı hem beslemeyi taşır, aşırı yüklenen router yüzünden kopma yaşanmaz. Bahçeli ev ve birden fazla kamera için tek seçenek kablodur.",
          ] },
          { h: "İç Mekân mı Dış Mekân mı", p: [
            "Dış mekân kamerası neme ve toza karşı korumalı (IP66/IP67) olmalı ve −30…−40 °C'ye kadar çalışabilmelidir. Özbekistan'da kışlar ılımandır, ancak güneş altında gövde +60 °C'ye kadar ısınır; bu yüzden sıcaklık payı her iki yönde de önemlidir.",
            "İç mekân kameraları daha kompakttır ve çoğu harekete göre dönebilir. İç mekân kamerasını dışarıya takmak olmaz — yoğuşma onu bir sezonda bitirir.",
          ] },
          { h: "Çözünürlük ve Gece Çekimi", p: [
            "Ev için 2–4 MP yeterlidir: birkaç metre mesafeden yüz tanımaya bu kadarı yeter. Daire için 8 MP peşinde koşmaya gerek yok — sadece arşiv boyutu büyür.",
            "Gece belirleyici olan megapiksel sayısı değil aydınlatmadır: IR aydınlatma siyah-beyaz görüntü verir, ColorVu/Full-Color gibi teknolojiler ise renkli. Bahçe için renkli gece görüntüsü belirgin şekilde daha bilgilendiricidir.",
          ] },
          { h: "Kayıt Nereye: Kart, Kayıt Cihazı veya Bulut", p: [
            "Kameradaki hafıza kartı 1–2 kamera için en basit çözümdür: ucuzdur, ama kartı kamerayla birlikte götürebilirler. Bulut bu sorunu çözer ancak abonelik ister. Sabit diskli kayıt cihazı, 3–4 kameradan itibaren doğru tercihtir: haftalarca arşiv ve hiçbir aylık ücret yok.",
            "İyi bir uygulama ikisini birleştirmektir: kayıt cihazına kayıt, önemli olaylar ise buluta.",
          ] },
          { h: "Tipik Setler ve Maliyet", p: [
            "Daire: hafıza kartlı bir Wi-Fi kamera. Müstakil ev: 2–4 dış mekân kamerası, PoE kayıt cihazı ve bir aylık arşive yetecek disk. Apartman girişi veya sitenin avlusu komşular ve site yönetimiyle birlikte çözülür — projede size yardımcı oluruz.",
            "Kataloğumuzda Hikvision, Dahua, EZVIZ ve TP-Link Tapo kameralar Taşkent'te stoktan mevcut — bütçenize uygun modeli seçelim, kurulumu yapalım ve telefondan izlemeyi ayarlayalım.",
          ] },
        ],
        faq: [
          { q: "Telefondan izlemek için daireye hangi kamera kurulmalı?", a: "Hafıza kartlı, 2–4 MP döner başlıklı bir Wi-Fi kamera: beş dakikada kurulum, dünyanın her yerinden uygulama üzerinden izleme. Kataloğumuzdan — EZVIZ veya TP-Link Tapo." },
          { q: "Ev kamerası için internet gerekli mi?", a: "Kayıt için gerekmez: kamera yerel olarak karta veya kayıt cihazına yazar. İnternet, telefondan izleme ve bildirimler için gereklidir." },
          { q: "Müstakil ev için video gözetim sistemi ne kadar tutar?", a: "Kamera sayısına ve montaja bağlıdır. Tipik set olan «4 dış mekân kamerası + kayıt cihazı + disk» kurulum dahil — mühendis keşfinden sonra ücretsiz hesaplarız." },
          { q: "Kamera ses kaydeder mi?", a: "Ev kameralarının çoğu kaydeder — dahili mikrofon vardır. Birçoğunda çift yönlü konuşma için hoparlör de bulunur: uygulama üzerinden ziyaretçiyle konuşabilirsiniz." },
        ],
      },
      zh: {
        title: "家用摄像机怎么选：住宅与公寓选购指南",
        excerpt: "Wi-Fi还是有线、室内还是室外、云端还是存储卡录像——教你为住宅、公寓和楼道选择合适的摄像机，不花冤枉钱。",
        sections: [
          { h: "从哪里开始选择", p: [
            "首先明确需求：度假时照看房屋、监督保姆或装修、私人住宅的院子和入口，还是窗下的汽车。摄像机类型、安装位置和录像方式全都取决于需求。",
            "看护一个房间，一台价格不高的云台Wi-Fi摄像机就够了。私人住宅的周界则需要带红外补光的室外摄像机，通常还要配一台录像机。",
          ] },
          { h: "Wi-Fi还是有线", p: [
            "Wi-Fi摄像机五分钟即可装好：插上电源、绑定App就能用。缺点是依赖Wi-Fi信号质量，且附近必须有插座。适合公寓和小规模场景。",
            "采用PoE供电的有线IP摄像机运行更稳定：一根网线同时提供网络和供电，不会因路由器过载而断线。带院子、多台摄像机的住宅，只能选有线方案。",
          ] },
          { h: "室内还是室外", p: [
            "室外摄像机必须具备防尘防水能力（IP66/IP67），工作温度需低至−30…−40 °C——乌兹别克斯坦的冬天虽然温和，但阳光直射下外壳会升到+60 °C，因此温度余量在两个方向上都很重要。",
            "室内摄像机更小巧，且往往支持跟随移动转动。室内摄像机不能装到室外——冷凝水一个季度就会让它报废。",
          ] },
          { h: "分辨率与夜视", p: [
            "家用场景200–400万像素就足够在几米外认清人脸。为公寓追求800万像素没有必要——只会让存储占用变大。",
            "夜间起决定作用的不是像素，而是补光：红外补光输出黑白画面，ColorVu/Full-Color之类的技术则输出彩色画面。对院子来说，彩色夜视的信息量明显更高。",
          ] },
          { h: "录到哪里：存储卡、录像机还是云端", p: [
            "摄像机内的存储卡是1–2台摄像机时最简单的方案：便宜，但卡可能连同摄像机一起被拿走。云端能解决这个问题，但需要订阅付费。配硬盘的录像机是3–4台摄像机起的正确选择：数周的录像存档且没有任何月费。",
            "更好的做法是组合使用：录像存在录像机上，重要事件同时上传云端。",
          ] },
          { h: "典型配置与费用", p: [
            "公寓：一台带存储卡的Wi-Fi摄像机。私人住宅：2–4台室外摄像机、PoE录像机和可存一个月录像的硬盘。多层住宅的楼道或院落需与邻居和物业公司共同商定——我们可以协助规划方案。",
            "我们的目录中有Hikvision、Dahua、EZVIZ和TP-Link Tapo摄像机，塔什干现货供应——按预算选型、安装并调试手机观看。",
          ] },
        ],
        faq: [
          { q: "公寓装什么摄像机可以用手机查看？", a: "一台200–400万像素、带存储卡的云台Wi-Fi摄像机：五分钟装好，在世界任何地方通过App查看。可从我们目录中选择EZVIZ或TP-Link Tapo。" },
          { q: "家用摄像机需要联网吗？", a: "录像本身不需要：摄像机会把录像写入存储卡或录像机本地。联网是为了手机远程查看和接收通知。" },
          { q: "私人住宅的视频监控要多少钱？", a: "取决于摄像机数量和施工量。典型套装“4台室外摄像机+录像机+硬盘”含安装——工程师上门勘察后免费为您报价。" },
          { q: "摄像机能录声音吗？", a: "大多数家用摄像机可以，均内置麦克风。许多型号还带扬声器支持双向对讲：可以通过App与来访者通话。" },
        ],
      },
    },
  },
  {
    slug: "videonablyudenie-bez-interneta",
    date: "2026-07-29",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Видеонаблюдение без интернета: дача, склад, стройка",
        excerpt: "Как организовать камеры там, где нет проводного интернета и даже электричества: 4G-камеры, роутеры с SIM-картой, автономные решения на солнечных панелях.",
        sections: [
          { h: "Запись без интернета — это нормально", p: [
            "Распространённый миф: без интернета камеры не работают. На деле интернет нужен только для удалённого просмотра — сама запись идёт локально, на карту памяти или регистратор. Система на объекте без сети полноценно пишет архив, который можно посмотреть на месте.",
            "Вопрос обычно в другом: хочется видеть дачу или склад с телефона. Для этого есть три решения.",
          ] },
          { h: "Решение 1: 4G-роутер + обычные камеры", p: [
            "Самый универсальный вариант: ставится роутер с SIM-картой, к нему подключаются обычные IP-камеры и регистратор. Мобильного интернета достаточно — для просмотра хватает 2–5 Мбит/с, а пуш-уведомления почти ничего не потребляют.",
            "Плюс решения — масштабируемость: хоть одна камера, хоть восемь, и любые модели из каталога. Тариф с 10–20 ГБ в месяц покрывает регулярный просмотр.",
          ] },
          { h: "Решение 2: камеры со встроенной SIM-картой", p: [
            "4G-камеры со слотом для SIM работают вообще без роутера: вставили карту — камера в сети. Идеально для одной-двух точек: ворота дачи, въезд на участок, стройплощадка.",
            "Минус — каждая камера требует свою SIM и тариф, поэтому на 3+ камер выгоднее вернуться к схеме с роутером.",
          ] },
          { h: "Решение 3: полная автономия с солнечной панелью", p: [
            "Там, где нет и электричества, работают комплекты «камера + аккумулятор + солнечная панель». Камера просыпается по датчику движения, пишет ролик и шлёт его через 4G. В экономном режиме такой комплект живёт без солнца до недели.",
            "Это решение для удалённых объектов: полей, вагончиков, периметров строек — где тянуть кабель дороже, чем поставить автономную точку.",
          ] },
          { h: "Что учесть при выборе", p: [
            "Проверьте покрытие сотовой сети на объекте заранее — от него зависит всё. На металлических ангарах и в низинах антенну роутера иногда выносят наружу. Для записи выбирайте детекцию движения — она в разы экономит и трафик, и место на карте.",
            "И не экономьте на грозозащите: длинные кабельные трассы на открытых участках без неё выгорают в первый же сезон гроз.",
          ] },
          { h: "Итог", p: [
            "Дача с электричеством — 4G-роутер и 2–4 камеры. Одна точка без хлопот — камера со встроенной SIM. Чистое поле — автономный комплект с солнечной панелью. Все варианты есть в нашем каталоге, поможем с подбором тарифа и настроим просмотр с телефона.",
          ] },
        ],
        faq: [
          { q: "Будет ли камера писать, если пропал интернет?", a: "Да. Запись идёт локально на карту или регистратор и не зависит от интернета — он нужен только для просмотра с телефона и уведомлений." },
          { q: "Сколько мобильного трафика ест видеонаблюдение?", a: "Пуш-уведомления и превью — мегабайты в день. Регулярный живой просмотр — примерно 1 ГБ на каждые 2–3 часа. Тарифа 10–20 ГБ в месяц обычно достаточно." },
          { q: "Работают ли 4G-камеры зимой?", a: "Уличные модели рассчитаны на −30 °C и ниже. У автономных комплектов зимой сокращается запас аккумулятора — панель и батарею берут с запасом." },
          { q: "Можно ли поставить камеру на стройке на пару месяцев?", a: "Да, это типовая задача: автономная 4G-камера на мачте или контейнере, монтируется за час и переезжает на следующий объект." },
        ],
      },
      uz: {
        title: "Internetsiz videokuzatuv: dala hovli, ombor, qurilish",
        excerpt: "Simli internet va hatto elektr bo'lmagan joyda kameralarni qanday tashkil qilish: 4G-kameralar, SIM-kartali routerlar, quyosh panelidagi avtonom yechimlar.",
        sections: [
          { h: "Internetsiz yozish — bu normal", p: [
            "Keng tarqalgan afsona: internetsiz kameralar ishlamaydi. Aslida internet faqat masofadan ko'rish uchun kerak — yozuvning o'zi lokal boradi: xotira kartasiga yoki registratorga. Tarmoqsiz obyektdagi tizim arxivni to'liq yozadi.",
            "Savol odatda boshqacha: dala hovli yoki omborni telefondan ko'rish istagi. Buning uchun uchta yechim bor.",
          ] },
          { h: "1-yechim: 4G-router + oddiy kameralar", p: [
            "Eng universal variant: SIM-kartali router o'rnatiladi, unga oddiy IP-kameralar va registrator ulanadi. Mobil internet yetarli — ko'rish uchun 2–5 Mbit/s kifoya.",
            "Yechimning plyusi — kengaytiriluvchanlik: xoh bitta kamera, xoh sakkizta. Oyiga 10–20 GB tarif muntazam ko'rishni qoplaydi.",
          ] },
          { h: "2-yechim: SIM-karta o'rnatilgan kameralar", p: [
            "SIM sloti bor 4G-kameralar umuman routersiz ishlaydi: kartani soldingiz — kamera tarmoqda. Bir-ikki nuqta uchun ideal: dala hovli darvozasi, uchastkaga kirish, qurilish maydoni.",
            "Kamchiligi — har bir kamera o'z SIM va tarifini talab qiladi, shuning uchun 3+ kamerada router sxemasiga qaytish foydaliroq.",
          ] },
          { h: "3-yechim: quyosh paneli bilan to'liq avtonomiya", p: [
            "Elektr ham bo'lmagan joyda «kamera + akkumulyator + quyosh paneli» to'plamlari ishlaydi. Kamera harakat datchigidan uyg'onadi, rolik yozib, 4G orqali yuboradi. Tejamkor rejimda bunday to'plam quyoshsiz bir haftagacha yashaydi.",
            "Bu uzoq obyektlar uchun yechim: dalalar, vagonchalar, qurilish perimetrlari — kabel tortish avtonom nuqta qo'yishdan qimmat bo'lgan joylar.",
          ] },
          { h: "Tanlashda nimani hisobga olish", p: [
            "Obyektda uyali aloqa qamrovini oldindan tekshiring — hammasi unga bog'liq. Metall angarlarda router antennasini ba'zan tashqariga chiqaradilar. Yozish uchun harakat detektorini tanlang — u trafik va karta joyini bir necha barobar tejaydi.",
            "Va momaqaldiroq himoyasidan tejamang: ochiq uchastkalardagi uzun kabel trassalari usiz birinchi mavsumdayoq kuyadi.",
          ] },
          { h: "Xulosa", p: [
            "Elektrli dala hovli — 4G-router va 2–4 kamera. Tashvishsiz bitta nuqta — SIM o'rnatilgan kamera. Ochiq dala — quyosh panelli avtonom to'plam. Barcha variantlar katalogimizda bor, tarif tanlashda yordam beramiz va telefondan ko'rishni sozlaymiz.",
          ] },
        ],
        faq: [
          { q: "Internet uzilsa kamera yozadimi?", a: "Ha. Yozuv kartaga yoki registratorga lokal boradi va internetga bog'liq emas — u faqat telefondan ko'rish va bildirishnomalar uchun kerak." },
          { q: "Videokuzatuv qancha mobil trafik yeydi?", a: "Push-bildirishnomalar — kuniga megabaytlar. Muntazam jonli ko'rish — har 2–3 soatga taxminan 1 GB. Oyiga 10–20 GB tarif odatda yetarli." },
          { q: "4G-kameralar qishda ishlaydimi?", a: "Tashqi modellar −30 °C va undan pastga mo'ljallangan. Avtonom to'plamlarda qishda akkumulyator zaxirasi kamayadi — panel va batareya zaxira bilan olinadi." },
          { q: "Qurilishga bir necha oyga kamera qo'yish mumkinmi?", a: "Ha, bu odatiy vazifa: machta yoki konteynerdagi avtonom 4G-kamera bir soatda o'rnatiladi va keyingi obyektga ko'chadi." },
        ],
      },
      en: {
        title: "CCTV Without Internet: Cottage, Warehouse, Construction Site",
        excerpt: "How to set up cameras where there is no wired internet or even electricity: 4G cameras, routers with a SIM card, and self-powered solar-panel solutions.",
        sections: [
          { h: "Recording without internet is perfectly normal", p: [
            "A common myth says cameras stop working without internet. In reality, internet is only needed for remote viewing — recording itself happens locally, to a memory card or a recorder. A system on a site with no connectivity keeps a full archive that can be reviewed on the spot.",
            "The real question is usually different: you want to check your cottage or warehouse from your phone. There are three ways to do that.",
          ] },
          { h: "Option 1: a 4G router + regular cameras", p: [
            "The most versatile setup: install a router with a SIM card and connect regular IP cameras and a recorder to it. Mobile internet is enough — 2–5 Mbps covers live viewing, and push notifications consume almost nothing.",
            "Its main advantage is scalability: one camera or eight, and any models from the catalog. A plan with 10–20 GB per month covers regular viewing.",
          ] },
          { h: "Option 2: cameras with a built-in SIM slot", p: [
            "4G cameras with a SIM slot need no router at all: insert the card and the camera is online. Perfect for one or two spots: a cottage gate, a driveway entrance, a construction site.",
            "The downside is that every camera needs its own SIM and data plan, so with 3+ cameras the router setup becomes more economical.",
          ] },
          { h: "Option 3: fully off-grid with a solar panel", p: [
            "Where there is no electricity either, kits combining a camera, a battery and a solar panel do the job. The camera wakes up on motion detection, records a clip and sends it over 4G. In power-saving mode such a kit lasts up to a week without sun.",
            "This is the solution for remote sites: fields, site cabins, construction perimeters — anywhere running a cable costs more than installing a self-contained unit.",
          ] },
          { h: "What to consider before you choose", p: [
            "Check cellular coverage at the site in advance — everything depends on it. On metal hangars and in low-lying areas the router antenna is sometimes mounted outside. For recording, use motion detection — it cuts both data traffic and memory card usage many times over.",
            "And do not skimp on surge protection: without it, long cable runs in open areas burn out in the very first thunderstorm season.",
          ] },
          { h: "Bottom line", p: [
            "A cottage with power — a 4G router and 2–4 cameras. A single hassle-free spot — a camera with a built-in SIM. An open field — an off-grid kit with a solar panel. All options are in our catalog; we will help pick a data plan and set up viewing from your phone.",
          ] },
        ],
        faq: [
          { q: "Will the camera keep recording if the internet goes down?", a: "Yes. Recording happens locally to a memory card or a recorder and does not depend on the internet — it is only needed for viewing from your phone and for notifications." },
          { q: "How much mobile data does video surveillance use?", a: "Push notifications and previews take megabytes per day. Regular live viewing uses roughly 1 GB per 2–3 hours. A 10–20 GB monthly plan is usually enough." },
          { q: "Do 4G cameras work in winter?", a: "Outdoor models are rated for −30 °C and below. Off-grid kits lose some battery capacity in winter, so the panel and battery should be sized with a margin." },
          { q: "Can I put a camera on a construction site for a couple of months?", a: "Yes, that is a typical job: a self-contained 4G camera on a mast or a container, installed within an hour and moved to the next site afterwards." },
        ],
      },
      tr: {
        title: "İnternetsiz Kamera Sistemi: Bağ Evi, Depo, Şantiye",
        excerpt: "Kablolu internetin, hatta elektriğin bile olmadığı yerlerde kamera nasıl kurulur: 4G kameralar, SIM kartlı router'lar ve güneş panelli bağımsız çözümler.",
        sections: [
          { h: "İnternetsiz kayıt gayet normaldir", p: [
            "Yaygın bir efsane: internet olmadan kameralar çalışmaz. Gerçekte internet yalnızca uzaktan izleme için gereklidir — kayıt işlemi yerel olarak hafıza kartına veya kayıt cihazına yapılır. Ağ bağlantısı olmayan bir tesisteki sistem, yerinde izlenebilecek eksiksiz bir arşiv tutar.",
            "Asıl soru genellikle başkadır: bağ evini veya depoyu telefondan görmek istersiniz. Bunun için üç çözüm var.",
          ] },
          { h: "Çözüm 1: 4G router + standart kameralar", p: [
            "En çok yönlü seçenek: SIM kartlı bir router kurulur, buna standart IP kameralar ve kayıt cihazı bağlanır. Mobil internet yeterlidir — izleme için 2–5 Mbps yeter, anlık bildirimler ise neredeyse hiç veri tüketmez.",
            "Bu çözümün artısı ölçeklenebilirlik: ister bir kamera ister sekiz, katalogdaki her model kullanılabilir. Aylık 10–20 GB'lık bir tarife düzenli izlemeyi karşılar.",
          ] },
          { h: "Çözüm 2: dahili SIM kartlı kameralar", p: [
            "SIM yuvalı 4G kameralar router olmadan çalışır: kartı takarsınız, kamera çevrimiçi olur. Bir-iki nokta için idealdir: bağ evi kapısı, arazi girişi, şantiye.",
            "Eksisi, her kameranın kendi SIM kartına ve tarifesine ihtiyaç duymasıdır; bu yüzden 3 ve üzeri kamerada router'lı şemaya dönmek daha ekonomiktir.",
          ] },
          { h: "Çözüm 3: güneş paneliyle tam bağımsızlık", p: [
            "Elektriğin bile olmadığı yerlerde «kamera + akü + güneş paneli» setleri iş görür. Kamera hareket sensörüyle uyanır, kısa bir video kaydeder ve 4G üzerinden gönderir. Tasarruf modunda böyle bir set güneşsiz bir haftaya kadar dayanır.",
            "Bu, uzak tesisler için bir çözümdür: tarlalar, şantiye konteynerleri, inşaat çevre hatları — kablo çekmenin bağımsız bir nokta kurmaktan daha pahalı olduğu her yer.",
          ] },
          { h: "Seçerken nelere dikkat etmeli", p: [
            "Tesisteki mobil şebeke kapsamasını önceden kontrol edin — her şey buna bağlıdır. Metal hangarlarda ve çukur arazilerde router anteni bazen dışarıya taşınır. Kayıt için hareket algılamayı seçin — hem trafiği hem kart alanını kat kat azaltır.",
            "Yıldırım ve aşırı gerilim korumasından da tasarruf etmeyin: açık alanlardaki uzun kablo hatları onsuz ilk fırtına sezonunda yanar.",
          ] },
          { h: "Özet", p: [
            "Elektrikli bağ evi — 4G router ve 2–4 kamera. Zahmetsiz tek nokta — dahili SIM'li kamera. Boş arazi — güneş panelli bağımsız set. Tüm seçenekler kataloğumuzda mevcut; tarife seçiminde yardımcı olur, telefondan izlemeyi de kurarız.",
          ] },
        ],
        faq: [
          { q: "İnternet kesilirse kamera kayda devam eder mi?", a: "Evet. Kayıt yerel olarak karta veya kayıt cihazına yapılır ve internete bağlı değildir — internet yalnızca telefondan izleme ve bildirimler için gereklidir." },
          { q: "Video gözetim ne kadar mobil veri tüketir?", a: "Anlık bildirimler ve önizlemeler günde birkaç megabayt tutar. Düzenli canlı izleme yaklaşık her 2–3 saatte 1 GB harcar. Aylık 10–20 GB'lık tarife genellikle yeterlidir." },
          { q: "4G kameralar kışın çalışır mı?", a: "Dış mekân modelleri −30 °C ve altına dayanıklıdır. Bağımsız setlerde kışın akü kapasitesi azalır — panel ve akü yedek payıyla seçilir." },
          { q: "Şantiyeye birkaç aylığına kamera kurulabilir mi?", a: "Evet, bu tipik bir iştir: direğe veya konteynere monte edilen bağımsız 4G kamera bir saatte kurulur ve sonra bir sonraki tesise taşınır." },
        ],
      },
      zh: {
        title: "无网络视频监控：别墅、仓库与工地",
        excerpt: "在没有有线网络甚至没有电的地方如何布置摄像机：4G 摄像机、插 SIM 卡的路由器，以及太阳能供电的独立方案。",
        sections: [
          { h: "没有网络也能正常录像", p: [
            "一个常见的误区：没有网络摄像机就无法工作。实际上，网络只在远程查看时才需要——录像本身在本地进行，写入存储卡或录像机。现场没有网络的系统照样完整保存录像档案，可在现场随时调阅。",
            "问题通常在别处：人们希望用手机随时查看别墅或仓库。为此有三种方案。",
          ] },
          { h: "方案一：4G 路由器 + 普通摄像机", p: [
            "最通用的做法：安装一台插 SIM 卡的路由器，再接上普通 IP 摄像机和录像机。移动网络完全够用——观看只需 2–5 Mbps，推送通知几乎不耗流量。",
            "这一方案的优点是可扩展：一台摄像机也行，八台也行，目录中任何型号都可用。每月 10–20 GB 的套餐足以支撑日常查看。",
          ] },
          { h: "方案二：内置 SIM 卡的摄像机", p: [
            "带 SIM 卡槽的 4G 摄像机完全不需要路由器：插卡即联网。非常适合一两个点位：别墅大门、院区入口、施工现场。",
            "缺点是每台摄像机都需要单独的 SIM 卡和套餐，因此 3 台以上时改用路由器方案更划算。",
          ] },
          { h: "方案三：太阳能板全自供电", p: [
            "在连电都没有的地方，可以使用“摄像机 + 电池 + 太阳能板”套装。摄像机由移动侦测唤醒，录制短片并通过 4G 发送。省电模式下，这样的套装无日照也能坚持长达一周。",
            "这是偏远场所的方案：农田、工地板房、施工围界——凡是拉线成本高于安装一个独立点位的地方。",
          ] },
          { h: "选型时要注意什么", p: [
            "先在现场确认移动网络覆盖——一切都取决于它。在金属厂房和低洼地带，有时需要把路由器天线引到室外。录像建议启用移动侦测——它能成倍节省流量和存储卡空间。",
            "另外不要在防雷防浪涌上省钱：露天长距离线路没有防护，第一个雷雨季就会烧毁。",
          ] },
          { h: "小结", p: [
            "有电的别墅——4G 路由器加 2–4 台摄像机。省心的单点——内置 SIM 卡的摄像机。空旷野外——太阳能独立套装。所有方案我们目录中都有，可协助选择套餐并帮您设置手机查看。",
          ] },
        ],
        faq: [
          { q: "断网后摄像机还会录像吗？", a: "会。录像在本地写入存储卡或录像机，不依赖网络——网络只用于手机查看和推送通知。" },
          { q: "视频监控要消耗多少移动流量？", a: "推送通知和预览每天只有几兆。经常性实时观看约每 2–3 小时消耗 1 GB。每月 10–20 GB 的套餐通常够用。" },
          { q: "4G 摄像机冬天能用吗？", a: "户外型号可耐 −30 °C 及更低温度。独立供电套装冬季电池续航会缩短——太阳能板和电池要留出余量。" },
          { q: "能在工地临时装几个月摄像机吗？", a: "可以，这是典型需求：独立供电的 4G 摄像机装在立杆或集装箱上，一小时装好，之后可搬到下一个工地。" },
        ],
      },
    },
  },
  {
    slug: "ip-kvm-udlinitel",
    date: "2026-07-29",
    related: ["server", "network"],
    loc: {
      ru: {
        title: "IP KVM удлинитель: как управлять компьютером на расстоянии",
        excerpt: "Что такое KVM-удлинитель, чем HDMI-удлинитель отличается от KVM, и как вынести монитор, клавиатуру и мышь на десятки метров от системного блока или сервера.",
        sections: [
          { h: "Что такое KVM-удлинитель", p: [
            "KVM расшифровывается как Keyboard, Video, Mouse. KVM-удлинитель переносит изображение с компьютера и управление (клавиатура + мышь) на расстояние — по обычной витой паре. Системный блок стоит в серверной или подсобке, а оператор работает за монитором в другом помещении.",
            "Комплект состоит из передатчика у компьютера и приёмника у рабочего места: между ними один кабель UTP длиной до 60–120 метров в зависимости от модели.",
          ] },
          { h: "Чем KVM отличается от HDMI-удлинителя", p: [
            "HDMI-удлинитель передаёт только картинку — он подходит, чтобы вынести телевизор или рекламный экран. KVM-удлинитель дополнительно передаёт USB: на стороне приёмника подключаются клавиатура и мышь, и вы полноценно управляете удалённым компьютером.",
            "Если нужно просто показать изображение — достаточно HDMI Extender. Если нужно работать — берите KVM.",
          ] },
          { h: "Где это применяется", p: [
            "Классика — пост охраны: регистратор видеонаблюдения заперт в серверной, а охранник листает камеры с монитора и мыши на посту. Также: операторские и диспетчерские, кассы и терминалы, промышленные компьютеры в цехах, шумные системные блоки, вынесенные из кабинета руководителя.",
            "В серверных KVM-удлинители избавляют от «монитора на табуретке» рядом со стойкой.",
          ] },
          { h: "На что смотреть при выборе", p: [
            "Дальность: типовые модели — 60 и 120 метров по cat5e/cat6. Разрешение: для офисных задач достаточно 1080p, для видеонаблюдения с мультиэкраном лучше 4K-модели. Задержка: у качественных удлинителей она незаметна для работы мышью.",
            "Обратите внимание на количество USB-портов приёмника: кроме клавиатуры и мыши иногда нужно подключить флешку или сканер.",
          ] },
          { h: "Монтаж и типичные ошибки", p: [
            "Кабель — цельная витая пара без скруток и переходов, обжатая по T568B. Прокладывайте трассу отдельно от силовых кабелей: наводки от 220 В дают артефакты на картинке. Питание передатчика и приёмника — от комплектных адаптеров.",
            "Если картинка мигает или пропадает — почти всегда виноват кабель: скрутки, длина за пределами спецификации или дешёвый омеднённый алюминий вместо меди.",
          ] },
          { h: "Что есть в наличии", p: [
            "В каталоге SAT Solutions — HDMI- и KVM-удлинители на 30, 60 и 120 метров в наличии в Ташкенте, с гарантией и доставкой по Узбекистану. Поможем выбрать под вашу задачу и проложим трассу под ключ.",
          ] },
        ],
        faq: [
          { q: "Какой кабель нужен для KVM-удлинителя?", a: "Цельная витая пара UTP cat5e или cat6, обжатая по стандарту T568B, без скруток и соединителей по трассе. Медь, не омеднённый алюминий." },
          { q: "Есть ли задержка при управлении?", a: "У качественных удлинителей задержка незаметна: курсор двигается как на локальном компьютере. Заметный лаг — признак проблем с кабелем или дешёвого решения." },
          { q: "Можно ли передать сигнал дальше 120 метров?", a: "Да: каскадом из двух удлинителей, по оптике с медиаконвертерами или решениями «KVM over IP» через локальную сеть — подберём под вашу дистанцию." },
          { q: "Подойдёт ли KVM-удлинитель для видеорегистратора?", a: "Да, это самое частое применение: регистратор в серверной, монитор и мышь — на посту охраны. Управление регистратором полностью сохраняется." },
        ],
      },
      uz: {
        title: "IP KVM uzaytirgich: kompyuterni masofadan qanday boshqarish",
        excerpt: "KVM-uzaytirgich nima, HDMI-uzaytirgich KVM'dan nimasi bilan farq qiladi va monitor, klaviatura va sichqonchani tizim blokidan o'nlab metrga qanday chiqarish mumkin.",
        sections: [
          { h: "KVM-uzaytirgich nima", p: [
            "KVM — Keyboard, Video, Mouse degani. KVM-uzaytirgich kompyuterdan tasvir va boshqaruvni (klaviatura + sichqoncha) masofaga — oddiy vitaya para orqali uzatadi. Tizim bloki serverxonada turadi, operator esa boshqa xonadagi monitorda ishlaydi.",
            "To'plam kompyuter yonidagi uzatuvchi va ish joyi yonidagi qabul qiluvchidan iborat: ular orasida modelga qarab 60–120 metrgacha bitta UTP kabel.",
          ] },
          { h: "KVM HDMI-uzaytirgichdan nimasi bilan farq qiladi", p: [
            "HDMI-uzaytirgich faqat tasvirni uzatadi — televizor yoki reklama ekranini chiqarish uchun mos. KVM-uzaytirgich qo'shimcha USB uzatadi: qabul qiluvchi tomonda klaviatura va sichqoncha ulanadi va siz masofadagi kompyuterni to'liq boshqarasiz.",
            "Faqat tasvir ko'rsatish kerak bo'lsa — HDMI Extender yetarli. Ishlash kerak bo'lsa — KVM oling.",
          ] },
          { h: "Qayerda qo'llaniladi", p: [
            "Klassika — qo'riqlash posti: videokuzatuv registratori serverxonada qulflangan, qo'riqchi esa postdagi monitor va sichqoncha bilan kameralarni ko'radi. Shuningdek: operator va dispetcher xonalari, kassalar, sexlardagi sanoat kompyuterlari.",
            "Serverxonalarda KVM-uzaytirgichlar stoyka yonidagi «kursidagi monitor»dan xalos qiladi.",
          ] },
          { h: "Tanlashda nimaga qarash kerak", p: [
            "Masofa: odatiy modellar — cat5e/cat6 orqali 60 va 120 metr. Aniqlik: ofis vazifalari uchun 1080p yetarli, multiekranli videokuzatuv uchun 4K modellari yaxshiroq. Kechikish: sifatli uzaytirgichlarda u sichqoncha bilan ishlashda sezilmaydi.",
            "Qabul qiluvchining USB-portlari soniga e'tibor bering: klaviatura va sichqonchadan tashqari ba'zan fleshka ulash kerak bo'ladi.",
          ] },
          { h: "Montaj va odatiy xatolar", p: [
            "Kabel — trassada ulanish va o'ramlarsiz yaxlit vitaya para, T568B bo'yicha siqilgan. Trassani kuch kabellaridan alohida yotqizing: 220 V dan induksiya tasvirda artefaktlar beradi.",
            "Tasvir miltillasa yoki yo'qolsa — deyarli har doim kabel aybdor: o'ramlar, spetsifikatsiyadan ortiq uzunlik yoki mis o'rniga arzon alyuminiy.",
          ] },
          { h: "Nima mavjud", p: [
            "SAT Solutions katalogida — 30, 60 va 120 metrli HDMI- va KVM-uzaytirgichlar Toshkentda mavjud, kafolat va O'zbekiston bo'ylab yetkazib berish bilan. Vazifangizga mosini tanlashga yordam beramiz.",
          ] },
        ],
        faq: [
          { q: "KVM-uzaytirgich uchun qanday kabel kerak?", a: "T568B standarti bo'yicha siqilgan, trassada o'ram va ulagichlarsiz yaxlit UTP cat5e yoki cat6. Mis, alyuminiy emas." },
          { q: "Boshqarishda kechikish bormi?", a: "Sifatli uzaytirgichlarda kechikish sezilmaydi: kursor lokal kompyuterdagidek harakatlanadi." },
          { q: "Signalni 120 metrdan uzoqroqqa uzatish mumkinmi?", a: "Ha: ikkita uzaytirgich kaskadi, mediakonvertorli optika yoki lokal tarmoq orqali «KVM over IP» yechimlari bilan." },
          { q: "KVM-uzaytirgich videoregistrator uchun mos keladimi?", a: "Ha, bu eng ko'p qo'llanish: registrator serverxonada, monitor va sichqoncha qo'riqlash postida. Boshqaruv to'liq saqlanadi." },
        ],
      },
      en: {
        title: "IP KVM Extender: Control a Computer From a Distance",
        excerpt: "What a KVM extender is, how it differs from an HDMI extender, and how to move your monitor, keyboard and mouse dozens of meters away from the PC or server.",
        sections: [
          { h: "What a KVM extender is", p: [
            "KVM stands for Keyboard, Video, Mouse. A KVM extender carries the computer's video output and its controls (keyboard + mouse) over a distance — via ordinary twisted-pair cable. The PC sits in a server room or utility closet while the operator works at a monitor in another room.",
            "The kit consists of a transmitter at the computer and a receiver at the workstation, connected by a single UTP cable up to 60–120 meters long depending on the model.",
          ] },
          { h: "How KVM differs from an HDMI extender", p: [
            "An HDMI extender carries video only — good for moving a TV or a digital-signage screen. A KVM extender also carries USB: a keyboard and mouse plug into the receiver side, giving you full control of the remote computer.",
            "If you just need to show a picture, an HDMI Extender is enough. If you need to work, get a KVM.",
          ] },
          { h: "Where it is used", p: [
            "The classic case is a security post: the surveillance recorder is locked in a server room while the guard browses cameras with a monitor and mouse at the post. Also: control and dispatch rooms, cash desks and terminals, industrial PCs on factory floors, and noisy desktop towers moved out of an executive's office.",
            "In server rooms, KVM extenders do away with the 'monitor on a stool' next to the rack.",
          ] },
          { h: "What to look at when choosing", p: [
            "Range: typical models cover 60 and 120 meters over cat5e/cat6. Resolution: 1080p is enough for office work; for surveillance with multi-screen views, 4K models are the better choice. Latency: on quality extenders it is imperceptible when working with a mouse.",
            "Also check the number of USB ports on the receiver: besides a keyboard and mouse, you may occasionally need to plug in a flash drive or a scanner.",
          ] },
          { h: "Installation and common mistakes", p: [
            "Use a single continuous run of twisted pair with no splices or couplers, terminated to T568B. Route it away from power cables: interference from 220 V lines causes image artifacts. Power the transmitter and receiver from the adapters supplied in the kit.",
            "If the picture flickers or drops out, the cable is almost always to blame: splices, a run beyond the spec, or cheap copper-clad aluminum instead of pure copper.",
          ] },
          { h: "What we have in stock", p: [
            "The SAT Solutions catalog offers HDMI and KVM extenders for 30, 60 and 120 meters, in stock in Tashkent, with warranty and delivery across Uzbekistan. We will help you choose the right model for your task and install the cable run turnkey.",
          ] },
        ],
        faq: [
          { q: "What cable does a KVM extender need?", a: "A single continuous run of UTP cat5e or cat6, terminated to the T568B standard, with no splices or couplers along the route. Pure copper, not copper-clad aluminum." },
          { q: "Is there any lag when controlling the computer?", a: "With quality extenders the latency is imperceptible: the cursor moves as if on a local machine. Noticeable lag points to cable problems or a cheap unit." },
          { q: "Can the signal go farther than 120 meters?", a: "Yes: with two extenders in cascade, over fiber with media converters, or with KVM over IP solutions across a local network — we will match one to your distance." },
          { q: "Will a KVM extender work with a video recorder?", a: "Yes, that is the most common use case: the recorder in a server room, the monitor and mouse at the security post. Full control of the recorder is preserved." },
        ],
      },
      tr: {
        title: "IP KVM Uzatıcı: Bilgisayarı Uzaktan Kontrol Etmek",
        excerpt: "KVM uzatıcı nedir, HDMI uzatıcıdan farkı ne ve monitör, klavye ile fareyi kasadan veya sunucudan onlarca metre öteye nasıl taşırsınız.",
        sections: [
          { h: "KVM uzatıcı nedir", p: [
            "KVM, Keyboard, Video, Mouse ifadesinin kısaltmasıdır. KVM uzatıcı, bilgisayarın görüntüsünü ve kontrolünü (klavye + fare) sıradan bir bükümlü çift kabloyla uzağa taşır. Kasa sunucu odasında veya depoda dururken operatör başka bir odadaki monitörde çalışır.",
            "Set, bilgisayar tarafındaki vericiden ve çalışma yerindeki alıcıdan oluşur; aralarında modele göre 60–120 metreye kadar tek bir UTP kablo bulunur.",
          ] },
          { h: "KVM'in HDMI uzatıcıdan farkı", p: [
            "HDMI uzatıcı yalnızca görüntüyü iletir — televizyonu veya reklam ekranını uzağa taşımak için uygundur. KVM uzatıcı buna ek olarak USB iletir: alıcı tarafına klavye ve fare bağlanır ve uzaktaki bilgisayarı eksiksiz yönetirsiniz.",
            "Sadece görüntü göstermek gerekiyorsa HDMI Extender yeterlidir. Çalışmak gerekiyorsa KVM alın.",
          ] },
          { h: "Nerelerde kullanılır", p: [
            "Klasik senaryo güvenlik noktasıdır: kayıt cihazı sunucu odasında kilitliyken güvenlik görevlisi kameraları noktadaki monitör ve fareyle gezer. Ayrıca: operatör ve dispeçer odaları, kasalar ve terminaller, atölyelerdeki endüstriyel bilgisayarlar, yönetici ofisinden dışarı alınan gürültülü kasalar.",
            "Sunucu odalarında KVM uzatıcılar, kabinin yanındaki «tabure üstünde monitör» derdini ortadan kaldırır.",
          ] },
          { h: "Seçerken nelere bakmalı", p: [
            "Mesafe: tipik modeller cat5e/cat6 üzerinden 60 ve 120 metredir. Çözünürlük: ofis işleri için 1080p yeterlidir; çoklu ekranlı video gözetim için 4K modeller daha iyidir. Gecikme: kaliteli uzatıcılarda fareyle çalışırken fark edilmez.",
            "Alıcıdaki USB port sayısına da dikkat edin: klavye ve farenin yanı sıra bazen USB bellek veya tarayıcı bağlamak gerekir.",
          ] },
          { h: "Montaj ve tipik hatalar", p: [
            "Kablo, ek yeri ve geçiş olmadan tek parça bükümlü çift olmalı ve T568B'ye göre sonlandırılmalıdır. Hattı güç kablolarından ayrı döşeyin: 220 V hatlarının paraziti görüntüde bozulmalara yol açar. Vericiyi ve alıcıyı setle gelen adaptörlerden besleyin.",
            "Görüntü titriyor veya kayboluyorsa suçlu neredeyse her zaman kablodur: ek yerleri, spesifikasyon dışı uzunluk veya saf bakır yerine ucuz bakır kaplı alüminyum.",
          ] },
          { h: "Stokta neler var", p: [
            "SAT Solutions kataloğunda 30, 60 ve 120 metrelik HDMI ve KVM uzatıcılar Taşkent'te stoktan sunulur; garanti ve Özbekistan geneline teslimat vardır. İşinize uygun modeli seçmenize yardımcı olur, hattı anahtar teslim döşeriz.",
          ] },
        ],
        faq: [
          { q: "KVM uzatıcı için hangi kablo gerekir?", a: "T568B standardına göre sonlandırılmış, hat boyunca ek yeri ve konnektör içermeyen tek parça UTP cat5e veya cat6. Saf bakır olmalı, bakır kaplı alüminyum değil." },
          { q: "Kontrolde gecikme olur mu?", a: "Kaliteli uzatıcılarda gecikme fark edilmez: imleç yerel bilgisayardaki gibi hareket eder. Belirgin gecikme, kablo sorununun veya ucuz bir çözümün işaretidir." },
          { q: "Sinyal 120 metreden öteye taşınabilir mi?", a: "Evet: iki uzatıcıyı kaskat bağlayarak, medya dönüştürücülü fiber üzerinden veya yerel ağ üzerinden «KVM over IP» çözümleriyle — mesafenize uygun olanı seçeriz." },
          { q: "KVM uzatıcı video kayıt cihazına uygun mu?", a: "Evet, en yaygın kullanım budur: kayıt cihazı sunucu odasında, monitör ve fare güvenlik noktasında. Kayıt cihazının kontrolü tamamen korunur." },
        ],
      },
      zh: {
        title: "IP KVM 延长器：如何远距离操控电脑",
        excerpt: "什么是 KVM 延长器，它与 HDMI 延长器有何区别，以及如何把显示器、键盘和鼠标从主机或服务器延伸出几十米。",
        sections: [
          { h: "什么是 KVM 延长器", p: [
            "KVM 是 Keyboard、Video、Mouse 的缩写。KVM 延长器通过普通双绞线，把电脑画面和操作（键盘 + 鼠标）传输到远处。主机放在机房或杂物间，操作员则在另一间房的显示器前工作。",
            "套装由电脑端的发射器和工作位端的接收器组成：两者之间只需一根 UTP 网线，长度依型号可达 60–120 米。",
          ] },
          { h: "KVM 与 HDMI 延长器的区别", p: [
            "HDMI 延长器只传输画面——适合把电视或广告屏移到远处。KVM 延长器还传输 USB：在接收端接上键盘和鼠标，即可完整操控远端电脑。",
            "只需显示画面，HDMI Extender 就够了；需要实际操作，就选 KVM。",
          ] },
          { h: "应用场景", p: [
            "最经典的是保安值班室：监控录像机锁在机房里，保安在值班台用显示器和鼠标翻看摄像画面。此外还有：操作室和调度室、收银台和终端、车间里的工业电脑，以及从经理办公室移出去的高噪音主机。",
            "在机房里，KVM 延长器让你告别机柜旁“放在凳子上的显示器”。",
          ] },
          { h: "选购要点", p: [
            "距离：常见型号通过 cat5e/cat6 传输 60 米和 120 米。分辨率：办公用途 1080p 足够；多画面监控最好选 4K 型号。延迟：优质延长器的延迟在用鼠标操作时察觉不到。",
            "还要注意接收器的 USB 接口数量：除键盘鼠标外，有时还需接 U 盘或扫描仪。",
          ] },
          { h: "安装与常见错误", p: [
            "线缆须为整根双绞线，中途不得有接头和转接，按 T568B 标准压接。走线要与强电线路分开：220 V 线路的干扰会造成画面瑕疵。发射器和接收器请使用套装自带的电源适配器供电。",
            "画面闪烁或时有时无，几乎总是线缆的问题：有接头、长度超标，或用了廉价的铜包铝线而不是纯铜线。",
          ] },
          { h: "现货供应", p: [
            "SAT Solutions 目录中备有 30、60、120 米的 HDMI 和 KVM 延长器，塔什干现货，提供质保并配送至乌兹别克斯坦全境。我们可帮您按需求选型，并提供布线交钥匙服务。",
          ] },
        ],
        faq: [
          { q: "KVM 延长器需要什么线缆？", a: "整根 UTP cat5e 或 cat6 双绞线，按 T568B 标准压接，线路中不得有接头和转接件。要纯铜线，不要铜包铝。" },
          { q: "操控时会有延迟吗？", a: "优质延长器的延迟察觉不到：光标移动与本地电脑无异。明显卡顿说明线缆有问题或设备过于廉价。" },
          { q: "信号能传得比 120 米更远吗？", a: "可以：两台延长器级联、配光纤收发器走光缆，或通过局域网的 KVM over IP 方案——我们可按您的距离选配。" },
          { q: "KVM 延长器适合接录像机吗？", a: "适合，这正是最常见的用法：录像机放机房，显示器和鼠标放保安值班台，对录像机的操控完全不受影响。" },
        ],
      },
    },
  },
  {
    slug: "slabotochnye-sistemy",
    date: "2026-07-29",
    related: ["cctv", "fire", "network"],
    loc: {
      ru: {
        title: "Слаботочные системы здания: что входит и как проектируют",
        excerpt: "Видеонаблюдение, СКУД, пожарная сигнализация, сети и телефония — разбираем, из чего состоят слаботочные системы офиса или здания и почему их проектируют вместе.",
        sections: [
          { h: "Что такое «слаботочка»", p: [
            "Слаботочными называют системы, работающие на малых токах: они передают информацию, а не питают оборудование. В современном здании это видеонаблюдение, контроль доступа, пожарная и охранная сигнализация, структурированные кабельные сети, Wi-Fi, телефония, домофония и оповещение.",
            "Формально к слаботочным относят цепи до 24–48 В — но на практике под словом «слаботочка» понимают весь комплекс инженерных систем безопасности и связи.",
          ] },
          { h: "Состав типового проекта", p: [
            "Офис или здание обычно включает: СКС (сетевые розетки и кабели до серверной), видеонаблюдение по периметру и в ключевых зонах, СКУД на входах и турникеты, пожарную сигнализацию с оповещением (обязательна по нормам), охранную сигнализацию и Wi-Fi.",
            "Для бизнес-центров и производств добавляются переговорные с видеосвязью, IP-телефония, видеостены диспетчерских и системы парковки.",
          ] },
          { h: "Почему проектировать нужно вместе", p: [
            "Все слаботочные системы делят общую инфраструктуру: кабельные трассы, лотки, серверную, питание и коммутаторы. Спроектированные по отдельности, они дублируют трассы и оборудование — это лишние деньги и хаос за фальшпотолком.",
            "Единый проект экономит до трети бюджета: одна серверная стойка, общие лотки, один подрядчик и согласованные сроки с ремонтом.",
          ] },
          { h: "Этапы: от проекта до сдачи", p: [
            "Порядок такой: обследование объекта и техзадание → проект с планами трасс и спецификацией → закладка кабелей на этапе черновой отделки → монтаж оборудования после чистовой → пусконаладка и обучение персонала.",
            "Ключевой момент — успеть с кабелями до отделки: прокладка по готовому ремонту дороже и оставляет короба на стенах.",
          ] },
          { h: "Нормы и лицензии", p: [
            "Пожарная сигнализация и оповещение проектируются по нормам пожарной безопасности и требуют лицензированного подрядчика — иначе объект не пройдёт проверку. СКУД на путях эвакуации обязан разблокироваться по пожарному сигналу — это тоже вопрос грамотного проекта.",
            "SAT Solutions имеет государственные лицензии на проектирование и монтаж противопожарных систем.",
          ] },
          { h: "С чего начать", p: [
            "Пришлите план помещения или пригласите инженера на объект: составим техзадание, спецификацию и смету по всем системам сразу — с этапностью под ваш ремонт и бюджет. Проект, монтаж, сервис — из одних рук, с гарантией.",
          ] },
        ],
        faq: [
          { q: "Можно ли делать слаботочку после ремонта?", a: "Можно, но дороже и заметнее: кабели пойдут в коробах по стенам либо потребуется частичный демонтаж отделки. Правильно закладывать трассы на этапе черновых работ." },
          { q: "Какие системы обязательны по закону?", a: "Пожарная сигнализация и система оповещения об эвакуации — для коммерческих и общественных зданий обязательны. Остальные системы — по задачам собственника." },
          { q: "Сколько длится монтаж слаботочных систем офиса?", a: "Типовой офис 200–500 м²: кабельные трассы — одна-две недели на черновом этапе, монтаж и наладка оборудования — ещё одна-две недели после отделки." },
          { q: "Вы работаете как субподрядчик у строителей?", a: "Да, регулярно выполняем слаботочный раздел в составе генподряда: со своим проектом, графиком и исполнительной документацией." },
        ],
      },
      uz: {
        title: "Binoning kuchsiz tok tizimlari: nimalar kiradi va qanday loyihalanadi",
        excerpt: "Videokuzatuv, SKUD, yong'in signalizatsiyasi, tarmoqlar va telefoniya — ofis yoki binoning kuchsiz tok tizimlari nimadan iborat va nega ular birga loyihalanadi.",
        sections: [
          { h: "«Kuchsiz tok» nima", p: [
            "Kuchsiz tok tizimlari — kichik toklarda ishlaydigan tizimlar: ular uskunani quvvatlamaydi, axborot uzatadi. Zamonaviy binoda bu videokuzatuv, kirishni nazorat qilish, yong'in va qo'riqlash signalizatsiyasi, strukturali kabel tarmoqlari, Wi-Fi, telefoniya, domofoniya va ogohlantirish.",
            "Amalda «kuchsiz tok» so'zi ostida xavfsizlik va aloqa muhandislik tizimlarining butun kompleksi tushuniladi.",
          ] },
          { h: "Odatiy loyiha tarkibi", p: [
            "Ofis yoki bino odatda quyidagilarni o'z ichiga oladi: SKS (tarmoq rozetkalari va serverxonagacha kabellar), perimetr va asosiy zonalarda videokuzatuv, kirishlarda SKUD va turniketlar, ogohlantirish bilan yong'in signalizatsiyasi (normalar bo'yicha majburiy), qo'riqlash signalizatsiyasi va Wi-Fi.",
            "Biznes-markazlar va ishlab chiqarishlar uchun videoaloqa xonalari, IP-telefoniya, dispetcher videodevorlari qo'shiladi.",
          ] },
          { h: "Nega birga loyihalash kerak", p: [
            "Barcha kuchsiz tok tizimlari umumiy infratuzilmani bo'lishadi: kabel trassalari, lotoklar, serverxona, quvvat va kommutatorlar. Alohida loyihalanganda ular trassalar va uskunani takrorlaydi — bu ortiqcha pul.",
            "Yagona loyiha byudjetning uchdan birigacha tejaydi: bitta server stoykasi, umumiy lotoklar, bitta pudratchi.",
          ] },
          { h: "Bosqichlar: loyihadan topshirishgacha", p: [
            "Tartib shunday: obyektni tekshirish va texnik topshiriq → trassalar rejasi va spetsifikatsiya bilan loyiha → qora pardozlash bosqichida kabellarni yotqizish → toza pardozdan keyin uskunani o'rnatish → ishga tushirish va xodimlarni o'qitish.",
            "Asosiy moment — kabellarga pardozgacha ulgurish: tayyor ta'mir bo'ylab yotqizish qimmatroq.",
          ] },
          { h: "Normalar va litsenziyalar", p: [
            "Yong'in signalizatsiyasi va ogohlantirish yong'in xavfsizligi normalari bo'yicha loyihalanadi va litsenziyali pudratchini talab qiladi — aks holda obyekt tekshiruvdan o'tmaydi. Evakuatsiya yo'llaridagi SKUD yong'in signali bo'yicha blokdan chiqishi shart.",
            "SAT Solutions yong'inga qarshi tizimlarni loyihalash va montaj qilish uchun davlat litsenziyalariga ega.",
          ] },
          { h: "Nimadan boshlash", p: [
            "Xona rejasini yuboring yoki muhandisni obyektga taklif qiling: barcha tizimlar bo'yicha birdaniga texnik topshiriq, spetsifikatsiya va smeta tuzamiz — ta'miringiz va byudjetingizga mos bosqichlar bilan. Loyiha, montaj, servis — bir qo'ldan, kafolat bilan.",
          ] },
        ],
        faq: [
          { q: "Ta'mirdan keyin kuchsiz tok qilish mumkinmi?", a: "Mumkin, lekin qimmatroq va ko'rinadi: kabellar devor bo'ylab korobkalarda boradi. To'g'risi — trassalarni qora ishlar bosqichida yotqizish." },
          { q: "Qonun bo'yicha qaysi tizimlar majburiy?", a: "Yong'in signalizatsiyasi va evakuatsiya haqida ogohlantirish tizimi — tijorat va jamoat binolari uchun majburiy. Qolganlari — mulkdor vazifalari bo'yicha." },
          { q: "Ofis kuchsiz tok montaji qancha davom etadi?", a: "200–500 m² odatiy ofis: kabel trassalari — qora bosqichda bir-ikki hafta, uskunani o'rnatish va sozlash — pardozdan keyin yana bir-ikki hafta." },
          { q: "Quruvchilarda subpudratchi sifatida ishlaysizmi?", a: "Ha, muntazam ravishda genpudrat tarkibida kuchsiz tok bo'limini bajaramiz: o'z loyihamiz, jadvalimiz va ijro hujjatlari bilan." },
        ],
      },
      en: {
        title: "Low-Voltage Building Systems: Scope and Design Approach",
        excerpt: "CCTV, access control, fire alarm, networks and telephony — we break down what makes up the low-voltage systems of an office or building and why they should be designed together.",
        sections: [
          { h: "What low-voltage systems are", p: [
            "Low-voltage (or low-current) systems are those that operate at small currents: they carry information rather than power equipment. In a modern building this covers video surveillance, access control, fire and intruder alarms, structured cabling networks, Wi-Fi, telephony, intercoms and public address.",
            "Formally, the term covers circuits up to 24–48 V — but in practice \"low-voltage\" means the entire set of security and communication systems in a building.",
          ] },
          { h: "What a typical project includes", p: [
            "An office or building usually gets: SCS (network outlets and cabling to the server room), CCTV around the perimeter and in key areas, access control at entrances plus turnstiles, a fire alarm with voice evacuation (mandatory by code), an intruder alarm and Wi-Fi.",
            "Business centers and industrial sites add video-conference meeting rooms, IP telephony, control-room video walls and parking systems.",
          ] },
          { h: "Why they must be designed together", p: [
            "All low-voltage systems share the same infrastructure: cable routes, trays, the server room, power and switches. Designed separately, they duplicate routes and equipment — wasted money and chaos above the suspended ceiling.",
            "A unified design saves up to a third of the budget: one server rack, shared cable trays, a single contractor and a schedule coordinated with the fit-out.",
          ] },
          { h: "Stages: from design to handover", p: [
            "The sequence is: site survey and requirements brief → design with route plans and a bill of materials → cable installation during the rough fit-out stage → equipment installation after finishing → commissioning and staff training.",
            "The key point is to run the cables before the finishing work: installing them over a completed interior costs more and leaves surface trunking on the walls.",
          ] },
          { h: "Codes and licenses", p: [
            "Fire alarm and evacuation systems are designed to fire-safety codes and require a licensed contractor — otherwise the site will fail inspection. Access control on escape routes must unlock on a fire signal, which is also a matter of proper design.",
            "SAT Solutions holds state licenses for the design and installation of fire-protection systems.",
          ] },
          { h: "Where to start", p: [
            "Send us a floor plan or invite an engineer to your site: we will prepare the requirements brief, a bill of materials and a cost estimate for all systems at once — phased to fit your renovation schedule and budget. Design, installation and service from a single provider, with a warranty.",
          ] },
        ],
        faq: [
          { q: "Can low-voltage systems be installed after renovation?", a: "Yes, but it costs more and is more visible: cables run in surface trunking along the walls, or parts of the finish have to be removed. The right way is to lay the routes during the rough construction stage." },
          { q: "Which systems are required by law?", a: "A fire alarm and an evacuation notification system are mandatory for commercial and public buildings. All other systems depend on the owner's needs." },
          { q: "How long does low-voltage installation take for an office?", a: "A typical 200–500 m² office: cable routes take one to two weeks at the rough stage, then equipment installation and commissioning take another one to two weeks after finishing." },
          { q: "Do you work as a subcontractor for construction companies?", a: "Yes, we regularly deliver the low-voltage package within general contracts — with our own design, schedule and as-built documentation." },
        ],
      },
      tr: {
        title: "Binalarda Zayıf Akım Sistemleri: Kapsamı ve Projelendirilmesi",
        excerpt: "Kamera sistemleri, geçiş kontrolü, yangın alarmı, ağ ve telefon altyapısı — bir ofis veya binanın zayıf akım sistemlerinin nelerden oluştuğunu ve neden birlikte projelendirilmesi gerektiğini anlatıyoruz.",
        sections: [
          { h: "Zayıf akım nedir", p: [
            "Zayıf akım sistemleri, düşük akımlarla çalışan sistemlerdir: ekipmanı beslemek yerine bilgi taşırlar. Modern bir binada bu kapsama video gözetim, geçiş kontrolü, yangın ve hırsız alarmı, yapısal kablolama ağları, Wi-Fi, telefon, interkom ve anons sistemleri girer.",
            "Resmî olarak 24–48 V'a kadar olan devreler zayıf akım sayılır — ancak pratikte \"zayıf akım\" denince binadaki tüm güvenlik ve iletişim sistemleri bütünü anlaşılır.",
          ] },
          { h: "Tipik bir projenin kapsamı", p: [
            "Bir ofis veya bina genellikle şunları içerir: SCS (ağ prizleri ve sistem odasına giden kablolama), çevre ve kritik alanlarda kamera sistemi, girişlerde geçiş kontrolü ve turnikeler, sesli tahliye anonslu yangın alarmı (mevzuata göre zorunlu), hırsız alarmı ve Wi-Fi.",
            "İş merkezleri ve üretim tesislerinde bunlara video konferanslı toplantı odaları, IP telefon, kontrol odası video duvarları ve otopark sistemleri eklenir.",
          ] },
          { h: "Neden birlikte projelendirilmeli", p: [
            "Tüm zayıf akım sistemleri ortak altyapıyı paylaşır: kablo güzergâhları, tavalar, sistem odası, besleme ve anahtarlar (switch). Ayrı ayrı projelendirildiklerinde güzergâhlar ve ekipman mükerrer olur — bu, boşa harcanan para ve asma tavan arkasında kaos demektir.",
            "Tek bir bütünleşik proje bütçenin üçte birine kadar tasarruf sağlar: tek sunucu kabini, ortak kablo tavaları, tek yüklenici ve tadilatla uyumlu bir takvim.",
          ] },
          { h: "Aşamalar: projeden teslime", p: [
            "Sıra şöyledir: saha keşfi ve teknik şartname → güzergâh planları ve keşif listesiyle proje → kaba inşaat aşamasında kabloların döşenmesi → ince işlerden sonra ekipman montajı → devreye alma ve personel eğitimi.",
            "Kritik nokta, kabloları ince işlerden önce yetiştirmektir: bitmiş bir mekânda kablo çekmek daha pahalıdır ve duvarlarda kablo kanalları bırakır.",
          ] },
          { h: "Mevzuat ve lisanslar", p: [
            "Yangın alarmı ve tahliye anons sistemleri yangın güvenliği mevzuatına göre projelendirilir ve lisanslı bir yüklenici gerektirir — aksi hâlde tesis denetimden geçemez. Kaçış yollarındaki geçiş kontrol sistemleri yangın sinyaliyle otomatik açılmak zorundadır — bu da doğru projelendirme meselesidir.",
            "SAT Solutions, yangın koruma sistemlerinin projelendirilmesi ve montajı için devlet lisanslarına sahiptir.",
          ] },
          { h: "Nereden başlamalı", p: [
            "Bize kat planını gönderin veya mühendisimizi sahaya davet edin: tüm sistemler için teknik şartnameyi, keşif listesini ve maliyet tahminini tek seferde hazırlayalım — tadilat takviminize ve bütçenize uygun aşamalarla. Proje, montaj ve servis tek elden, garantili.",
          ] },
        ],
        faq: [
          { q: "Zayıf akım sistemleri tadilattan sonra yapılabilir mi?", a: "Yapılabilir ama daha pahalı ve daha görünür olur: kablolar duvarlarda kanal içinden gider ya da kaplamanın bir kısmının sökülmesi gerekir. Doğrusu, güzergâhları kaba inşaat aşamasında döşemektir." },
          { q: "Hangi sistemler yasal olarak zorunlu?", a: "Yangın alarmı ve tahliye anons sistemi ticari ve kamusal binalar için zorunludur. Diğer sistemler mülk sahibinin ihtiyaçlarına göre belirlenir." },
          { q: "Bir ofisin zayıf akım montajı ne kadar sürer?", a: "Tipik 200–500 m² bir ofiste: kablo güzergâhları kaba aşamada bir-iki hafta, ekipman montajı ve devreye alma ince işlerden sonra bir-iki hafta daha sürer." },
          { q: "İnşaat firmalarına alt yüklenici olarak çalışıyor musunuz?", a: "Evet, ana yüklenicilik kapsamında zayıf akım bölümünü düzenli olarak üstleniyoruz: kendi projemiz, iş programımız ve as-built dokümantasyonumuzla." },
        ],
      },
      zh: {
        title: "楼宇弱电系统：包含哪些内容，如何设计",
        excerpt: "视频监控、门禁、消防报警、网络与电话——本文解析办公楼或建筑的弱电系统由哪些部分组成，以及为什么应统一设计。",
        sections: [
          { h: "什么是弱电系统", p: [
            "弱电系统是指以小电流运行的系统：它们传输信息，而不是为设备供电。在现代建筑中，这包括视频监控、门禁控制、消防与防盗报警、结构化布线网络、Wi-Fi、电话、可视对讲和广播系统。",
            "严格来说，弱电指 24–48 V 以下的电路——但在实际工程中，\"弱电\"泛指建筑内全部安防与通信系统的总和。",
          ] },
          { h: "典型项目的组成", p: [
            "办公楼或建筑通常包括：SCS 综合布线（网络插座及通往机房的线缆）、周界及重点区域的视频监控、出入口门禁和闸机、带疏散广播的消防报警系统（按规范强制配备）、防盗报警和 Wi-Fi。",
            "商务中心和工业厂区还会增加视频会议室、IP 电话、调度室拼接大屏和停车场管理系统。",
          ] },
          { h: "为什么必须统一设计", p: [
            "所有弱电系统共用同一套基础设施：线缆路由、桥架、机房、供电和交换机。如果各自单独设计，路由和设备就会重复——不仅浪费资金，吊顶内也会一片混乱。",
            "统一设计可节省多达三分之一的预算：一个机柜、共用桥架、单一承包商，以及与装修同步的工期安排。",
          ] },
          { h: "实施阶段：从设计到交付", p: [
            "流程如下：现场勘察与技术任务书 → 含路由图和设备清单的设计方案 → 在毛坯装修阶段敷设线缆 → 精装完成后安装设备 → 调试并培训人员。",
            "关键在于赶在装修收尾前完成布线：在已完工的室内敷设线缆成本更高，还会在墙面留下明装线槽。",
          ] },
          { h: "规范与资质", p: [
            "消防报警和疏散广播系统必须按消防安全规范设计，并由持证承包商施工——否则项目无法通过验收。疏散通道上的门禁必须在火警信号触发时自动解锁，这同样取决于设计是否专业。",
            "SAT Solutions 持有消防系统设计与安装的国家资质。",
          ] },
          { h: "从哪里开始", p: [
            "把平面图发给我们，或邀请工程师到现场：我们将一次性编制全部系统的技术任务书、设备清单和预算——并按您的装修进度和预算分阶段实施。设计、安装、售后服务一站式完成，提供质保。",
          ] },
        ],
        faq: [
          { q: "装修完成后还能做弱电吗？", a: "可以，但成本更高且更显眼：线缆只能沿墙走明装线槽，或需要局部拆除装修。正确的做法是在毛坯施工阶段预埋线路。" },
          { q: "哪些系统是法律强制要求的？", a: "消防报警和疏散广播系统对商业及公共建筑是强制性的。其余系统由业主根据需求自行决定。" },
          { q: "办公楼弱电系统安装需要多长时间？", a: "典型 200–500 平方米的办公室：毛坯阶段敷设线缆需一到两周，装修完成后的设备安装与调试还需一到两周。" },
          { q: "你们承接建筑公司的分包业务吗？", a: "是的，我们经常在总承包框架内承担弱电专业分包：自带设计方案、施工进度计划和竣工资料。" },
        ],
      },
    },
  },
  {
    slug: "chto-takoe-poe",
    date: "2026-07-29",
    related: ["network", "cctv"],
    loc: {
      ru: {
        title: "Что такое PoE: питание камер и точек доступа по витой паре",
        excerpt: "PoE передаёт питание и данные по одному сетевому кабелю. Разбираем стандарты, бюджет мощности и то, как PoE упрощает монтаж камер, точек доступа и телефонов.",
        sections: [
          { h: "PoE простыми словами", p: [
            "PoE (Power over Ethernet) — технология, которая передаёт электропитание по тому же кабелю витой пары, что и данные. Камера, точка доступа или IP-телефон подключаются одним кабелем — без розетки и блока питания рядом с устройством.",
            "Питание подаёт PoE-коммутатор или инжектор, а устройство просто работает: согласование мощности происходит автоматически и безопасно для не-PoE устройств.",
          ] },
          { h: "Стандарты и мощность", p: [
            "Три основных стандарта: 802.3af (до 15,4 Вт) — камеры и телефоны; 802.3at, он же PoE+ (до 30 Вт) — поворотные камеры и точки доступа Wi-Fi 6; 802.3bt, он же PoE++ (до 60–90 Вт) — PTZ-камеры с обогревом, видеотерминалы, мощные точки доступа.",
            "Дальность любого стандарта — 100 метров по cat5e/cat6. Дальше — PoE-удлинители или оптика.",
          ] },
          { h: "Бюджет мощности коммутатора", p: [
            "У каждого PoE-коммутатора два предела: мощность на порт и общий бюджет. Восьмипортовый коммутатор с бюджетом 65 Вт не вытянет восемь камер по 12 Вт — суммарно нужно 96 Вт. Это самая частая ошибка при самостоятельном подборе.",
            "Правило: сложите паспортную мощность всех устройств и добавьте 25–30 % запаса — получите минимальный бюджет коммутатора.",
          ] },
          { h: "Зачем PoE видеонаблюдению", p: [
            "Один кабель вместо двух трасс (сеть + 220 В) — вдвое меньше монтажа и точек отказа. Централизованное питание: один ИБП в стойке держит все камеры при отключении света. Удалённая перезагрузка зависшей камеры — отключением PoE-порта, без поездки на объект.",
            "Поэтому современные системы видеонаблюдения строятся почти исключительно на PoE.",
          ] },
          { h: "Инжектор или коммутатор", p: [
            "PoE-инжектор — «переходник» для одного устройства: дёшево, когда нужно запитать одну камеру от обычного коммутатора. От трёх-четырёх устройств выгоднее PoE-коммутатор: меньше коробок, общий мониторинг и управление портами.",
            "Есть и обратные устройства — PoE-сплиттеры: выделяют питание из кабеля для устройств без поддержки PoE.",
          ] },
          { h: "Итог", p: [
            "PoE — стандарт де-факто для камер, точек доступа и IP-телефонов: меньше кабелей, центральный ИБП, удалённое управление питанием. В каталоге SAT Solutions — PoE-коммутаторы на 4–48 портов, инжекторы и удлинители в наличии в Ташкенте; поможем посчитать бюджет мощности под ваш проект.",
          ] },
        ],
        faq: [
          { q: "Можно ли подключить обычное устройство в PoE-порт?", a: "Да, это безопасно: коммутатор подаёт питание только после согласования с PoE-устройством. Обычный ноутбук или принтер получит только данные." },
          { q: "На какое расстояние работает PoE?", a: "До 100 метров по витой паре cat5e/cat6 — как и сама сеть Ethernet. Дальше используют PoE-удлинители (ещё +100 м на каждый) или оптику с PoE-медиаконвертерами." },
          { q: "Чем PoE+ отличается от обычного PoE?", a: "Мощностью: PoE (802.3af) отдаёт до 15,4 Вт, PoE+ (802.3at) — до 30 Вт. Поворотным камерам, Wi-Fi 6 точкам и камерам с обогревом нужен PoE+ и выше." },
          { q: "Что будет, если мощности коммутатора не хватит?", a: "Коммутатор начнёт отключать порты по приоритету — камеры будут случайно «отваливаться». Поэтому бюджет мощности считают с запасом 25–30 %." },
        ],
      },
      uz: {
        title: "PoE nima: kamera va ulanish nuqtalarini vitaya para orqali quvvatlash",
        excerpt: "PoE quvvat va ma'lumotni bitta tarmoq kabeli orqali uzatadi. Standartlar, quvvat byudjeti va PoE kameralar montajini qanday soddalashtirishini ko'rib chiqamiz.",
        sections: [
          { h: "PoE oddiy tilda", p: [
            "PoE (Power over Ethernet) — elektr quvvatni ma'lumot bilan bir xil vitaya para kabeli orqali uzatadigan texnologiya. Kamera, ulanish nuqtasi yoki IP-telefon bitta kabel bilan ulanadi — qurilma yonida rozetka va quvvat blokisiz.",
            "Quvvatni PoE-kommutator yoki injektor beradi: quvvat kelishuvi avtomatik va PoE bo'lmagan qurilmalar uchun xavfsiz.",
          ] },
          { h: "Standartlar va quvvat", p: [
            "Uchta asosiy standart: 802.3af (15,4 Vt gacha) — kameralar va telefonlar; 802.3at yoki PoE+ (30 Vt gacha) — aylanuvchi kameralar va Wi-Fi 6 nuqtalari; 802.3bt yoki PoE++ (60–90 Vt gacha) — isitgichli PTZ-kameralar, videoterminallar.",
            "Har qanday standart masofasi — cat5e/cat6 orqali 100 metr. Undan uzoqqa — PoE-uzaytirgichlar yoki optika.",
          ] },
          { h: "Kommutator quvvat byudjeti", p: [
            "Har bir PoE-kommutatorda ikkita chegara bor: portga quvvat va umumiy byudjet. 65 Vt byudjetli sakkiz portli kommutator 12 Vt dan sakkizta kamerani tortmaydi — jami 96 Vt kerak. Bu mustaqil tanlashdagi eng ko'p uchraydigan xato.",
            "Qoida: barcha qurilmalarning pasport quvvatini qo'shing va 25–30 % zaxira qo'shing.",
          ] },
          { h: "Videokuzatuvga PoE nima uchun kerak", p: [
            "Ikki trassa (tarmoq + 220 V) o'rniga bitta kabel — montaj va nosozlik nuqtalari ikki baravar kam. Markazlashgan quvvat: stoykadagi bitta UPS svet o'chganda barcha kameralarni ushlab turadi. Qotib qolgan kamerani masofadan qayta yuklash — PoE-portni o'chirish bilan.",
            "Shuning uchun zamonaviy videokuzatuv tizimlari deyarli faqat PoE asosida quriladi.",
          ] },
          { h: "Injektor yoki kommutator", p: [
            "PoE-injektor — bitta qurilma uchun «o'tkazgich»: oddiy kommutatordan bitta kamerani quvvatlash kerak bo'lganda arzon. Uch-to'rt qurilmadan boshlab PoE-kommutator foydaliroq: kamroq qutilar, umumiy monitoring.",
            "Teskari qurilmalar ham bor — PoE-splitterlar: PoE'ni qo'llamaydigan qurilmalar uchun kabeldan quvvatni ajratadi.",
          ] },
          { h: "Xulosa", p: [
            "PoE — kameralar, ulanish nuqtalari va IP-telefonlar uchun de-fakto standart: kamroq kabel, markaziy UPS, quvvatni masofadan boshqarish. SAT Solutions katalogida — 4–48 portli PoE-kommutatorlar, injektorlar va uzaytirgichlar Toshkentda mavjud; loyihangiz uchun quvvat byudjetini hisoblashga yordam beramiz.",
          ] },
        ],
        faq: [
          { q: "PoE-portga oddiy qurilmani ulash mumkinmi?", a: "Ha, bu xavfsiz: kommutator quvvatni faqat PoE-qurilma bilan kelishuvdan keyin beradi. Oddiy noutbuk faqat ma'lumot oladi." },
          { q: "PoE qancha masofaga ishlaydi?", a: "Cat5e/cat6 vitaya para orqali 100 metrgacha. Undan uzoqqa PoE-uzaytirgichlar (har biri +100 m) yoki PoE-mediakonvertorli optika ishlatiladi." },
          { q: "PoE+ oddiy PoE'dan nimasi bilan farq qiladi?", a: "Quvvat bilan: PoE (802.3af) 15,4 Vt gacha, PoE+ (802.3at) 30 Vt gacha beradi. Aylanuvchi kameralar va Wi-Fi 6 nuqtalariga PoE+ va undan yuqori kerak." },
          { q: "Kommutator quvvati yetmasa nima bo'ladi?", a: "Kommutator portlarni ustuvorlik bo'yicha o'chira boshlaydi — kameralar tasodifiy «uzilib» turadi. Shuning uchun quvvat byudjeti 25–30 % zaxira bilan hisoblanadi." },
        ],
      },
      en: {
        title: "What Is PoE: Powering Cameras and APs over One Cable",
        excerpt: "PoE delivers power and data over a single network cable. We cover the standards, power budgets, and how PoE simplifies installing cameras, access points and phones.",
        sections: [
          { h: "PoE in plain terms", p: [
            "PoE (Power over Ethernet) is a technology that delivers electrical power over the same twisted-pair cable as the data. A camera, access point or IP phone connects with a single cable — no power outlet or adapter needed next to the device.",
            "Power comes from a PoE switch or injector, and the device simply works: power negotiation happens automatically and is safe for non-PoE devices.",
          ] },
          { h: "Standards and power levels", p: [
            "There are three main standards: 802.3af (up to 15.4 W) — cameras and phones; 802.3at, also known as PoE+ (up to 30 W) — pan-tilt cameras and Wi-Fi 6 access points; 802.3bt, also known as PoE++ (up to 60–90 W) — PTZ cameras with heaters, video terminals, high-power access points.",
            "Every standard reaches 100 meters over Cat5e/Cat6. Beyond that, use PoE extenders or fiber.",
          ] },
          { h: "The switch power budget", p: [
            "Every PoE switch has two limits: per-port power and the total budget. An 8-port switch with a 65 W budget cannot power eight 12 W cameras — that requires 96 W in total. This is the most common mistake in DIY equipment selection.",
            "The rule: add up the rated power of all devices and allow a 25–30% margin — that gives you the minimum switch budget.",
          ] },
          { h: "Why CCTV needs PoE", p: [
            "One cable instead of two runs (network + 220 V mains) means half the installation work and half the points of failure. Centralized power: a single UPS in the rack keeps all cameras running through a blackout. And a frozen camera can be rebooted remotely by cycling its PoE port — no site visit required.",
            "That is why modern video surveillance systems are built almost exclusively on PoE.",
          ] },
          { h: "Injector or switch", p: [
            "A PoE injector is an \"adapter\" for a single device: a cheap way to power one camera from a regular switch. From three or four devices onward, a PoE switch pays off: fewer boxes, plus centralized monitoring and port management.",
            "There are also devices that work the other way — PoE splitters, which extract power from the cable for devices without PoE support.",
          ] },
          { h: "Bottom line", p: [
            "PoE is the de facto standard for cameras, access points and IP phones: fewer cables, a central UPS, remote power management. The SAT Solutions catalog offers 4–48 port PoE switches, injectors and extenders in stock in Tashkent; we will help you calculate the power budget for your project.",
          ] },
        ],
        faq: [
          { q: "Can I plug a regular device into a PoE port?", a: "Yes, it is safe: the switch supplies power only after negotiating with a PoE device. A regular laptop or printer will simply receive data." },
          { q: "What is the maximum PoE distance?", a: "Up to 100 meters over Cat5e/Cat6 twisted pair — the same as Ethernet itself. For longer runs, use PoE extenders (+100 m each) or fiber with PoE media converters." },
          { q: "How is PoE+ different from regular PoE?", a: "It is about power: PoE (802.3af) delivers up to 15.4 W, while PoE+ (802.3at) delivers up to 30 W. Pan-tilt cameras, Wi-Fi 6 access points and cameras with heaters need PoE+ or higher." },
          { q: "What happens if the switch runs out of power?", a: "The switch starts shutting down ports by priority — cameras will randomly drop offline. That is why the power budget is always calculated with a 25–30% margin." },
        ],
      },
      tr: {
        title: "PoE Nedir: Kamera ve Erişim Noktalarını Ağ Kablosuyla Besleme",
        excerpt: "PoE, güç ve veriyi tek bir ağ kablosuyla iletir. Standartları, güç bütçesini ve PoE'nin kamera, erişim noktası ve telefon montajını nasıl kolaylaştırdığını anlatıyoruz.",
        sections: [
          { h: "En basit haliyle PoE", p: [
            "PoE (Power over Ethernet), elektrik beslemesini veriyle aynı bakır ağ kablosu (twisted pair) üzerinden ileten bir teknolojidir. Kamera, erişim noktası veya IP telefon tek kabloyla bağlanır — cihazın yanında prize ya da adaptöre gerek kalmaz.",
            "Gücü bir PoE switch veya enjektör sağlar; cihaz doğrudan çalışır: güç uzlaşması otomatik gerçekleşir ve PoE desteklemeyen cihazlar için güvenlidir.",
          ] },
          { h: "Standartlar ve güç seviyeleri", p: [
            "Üç temel standart vardır: 802.3af (15,4 W'a kadar) — kameralar ve telefonlar; PoE+ olarak da bilinen 802.3at (30 W'a kadar) — hareketli kameralar ve Wi-Fi 6 erişim noktaları; PoE++ olarak da bilinen 802.3bt (60–90 W'a kadar) — ısıtıcılı PTZ kameralar, görüntülü terminaller, yüksek güçlü erişim noktaları.",
            "Tüm standartların menzili Cat5e/Cat6 üzerinden 100 metredir. Daha uzun mesafeler için PoE uzatıcılar veya fiber kullanılır.",
          ] },
          { h: "Switch'in güç bütçesi", p: [
            "Her PoE switch'in iki sınırı vardır: port başına güç ve toplam bütçe. 65 W bütçeli 8 portlu bir switch, her biri 12 W çeken sekiz kamerayı besleyemez — toplamda 96 W gerekir. Bu, kendi başına ekipman seçerken yapılan en yaygın hatadır.",
            "Kural şu: tüm cihazların etiket güçlerini toplayın ve %25–30 pay ekleyin — çıkan değer switch'in asgari güç bütçesidir.",
          ] },
          { h: "Video gözetimde PoE'nin önemi", p: [
            "İki güzergâh (ağ + 220 V) yerine tek kablo — yarı yarıya daha az montaj ve arıza noktası. Merkezî besleme: kabindeki tek bir UPS, elektrik kesintisinde tüm kameraları ayakta tutar. Donan bir kamera, PoE portu kapatılıp açılarak uzaktan yeniden başlatılır — sahaya gitmeye gerek kalmaz.",
            "Bu yüzden modern video gözetim sistemleri neredeyse tamamen PoE üzerine kurulur.",
          ] },
          { h: "Enjektör mü switch mi", p: [
            "PoE enjektörü tek cihaz için bir \"ara aparattır\": sıradan bir switch'ten tek bir kamerayı beslemek gerektiğinde ucuz çözümdür. Üç-dört cihazdan itibaren PoE switch daha avantajlıdır: daha az kutu, merkezî izleme ve port yönetimi.",
            "Tersine çalışan cihazlar da vardır — PoE splitter'lar: PoE desteklemeyen cihazlar için kablodaki gücü ayırır.",
          ] },
          { h: "Özet", p: [
            "PoE; kameralar, erişim noktaları ve IP telefonlar için fiilî standarttır: daha az kablo, merkezî UPS, uzaktan güç yönetimi. SAT Solutions kataloğunda 4–48 portlu PoE switch'ler, enjektörler ve uzatıcılar Taşkent'te stoktan sunulur; projeniz için güç bütçesini hesaplamanıza yardımcı oluruz.",
          ] },
        ],
        faq: [
          { q: "PoE porta sıradan bir cihaz bağlanabilir mi?", a: "Evet, güvenlidir: switch, gücü yalnızca PoE cihazıyla uzlaştıktan sonra verir. Sıradan bir dizüstü ya da yazıcı sadece veri alır." },
          { q: "PoE hangi mesafeye kadar çalışır?", a: "Cat5e/Cat6 kablo üzerinden 100 metreye kadar — Ethernet ağının kendisi gibi. Daha uzun mesafelerde PoE uzatıcılar (her biri +100 m) veya PoE medya dönüştürücülü fiber kullanılır." },
          { q: "PoE+ ile standart PoE arasındaki fark nedir?", a: "Fark güçtedir: PoE (802.3af) 15,4 W'a, PoE+ (802.3at) 30 W'a kadar verir. Hareketli kameralar, Wi-Fi 6 erişim noktaları ve ısıtıcılı kameralar PoE+ ve üzerini gerektirir." },
          { q: "Switch'in gücü yetmezse ne olur?", a: "Switch, portları öncelik sırasına göre kapatmaya başlar — kameralar rastgele devreden düşer. Bu yüzden güç bütçesi her zaman %25–30 payla hesaplanır." },
        ],
      },
      zh: {
        title: "什么是 PoE：通过网线为摄像机和 AP 供电",
        excerpt: "PoE 通过一根网线同时传输电力和数据。本文介绍相关标准、功率预算，以及 PoE 如何简化摄像机、无线 AP 和话机的安装。",
        sections: [
          { h: "通俗理解 PoE", p: [
            "PoE（Power over Ethernet，以太网供电）是一种通过传输数据的同一根双绞线网线供电的技术。摄像机、无线 AP 或 IP 话机只需一根网线即可接入——设备旁无需电源插座和电源适配器。",
            "电力由 PoE 交换机或供电器（注入器）提供，设备即插即用：功率协商自动完成，对非 PoE 设备也完全安全。",
          ] },
          { h: "标准与功率", p: [
            "三个主要标准：802.3af（最高 15.4 W）——摄像机和话机；802.3at，即 PoE+（最高 30 W）——云台摄像机和 Wi-Fi 6 无线 AP；802.3bt，即 PoE++（最高 60–90 W）——带加热器的 PTZ 摄像机、可视终端和大功率 AP。",
            "任何标准在 Cat5e/Cat6 网线上的传输距离都是 100 米。更远的距离需要 PoE 延长器或光纤。",
          ] },
          { h: "交换机的功率预算", p: [
            "每台 PoE 交换机都有两个限制：单端口功率和总功率预算。一台总预算 65 W 的 8 口交换机带不动八台 12 W 的摄像机——总共需要 96 W。这是自行选型时最常见的错误。",
            "选型规则：把所有设备的标称功率相加，再留出 25–30% 的余量——得到的就是交换机的最低功率预算。",
          ] },
          { h: "视频监控为什么需要 PoE", p: [
            "一根网线取代两条线路（网络 + 220 V 电源）——施工量和故障点都减少一半。集中供电：机柜里一台 UPS 就能在停电时维持所有摄像机运行。摄像机死机时可远程断开 PoE 端口重启，无需到现场。",
            "因此，现代视频监控系统几乎全部基于 PoE 构建。",
          ] },
          { h: "供电器还是交换机", p: [
            "PoE 供电器相当于单台设备的\"转接头\"：当只需从普通交换机给一台摄像机供电时，它是便宜的方案。设备达到三四台以上时，PoE 交换机更划算：盒子更少，还能集中监控和管理端口。",
            "还有反向工作的设备——PoE 分离器：从网线中分出电力，供不支持 PoE 的设备使用。",
          ] },
          { h: "总结", p: [
            "PoE 是摄像机、无线 AP 和 IP 话机的事实标准：线缆更少、集中 UPS 供电、远程电源管理。SAT Solutions 产品目录提供 4–48 口 PoE 交换机、供电器和延长器，塔什干现货；我们可协助您为项目计算功率预算。",
          ] },
        ],
        faq: [
          { q: "普通设备可以接到 PoE 端口上吗？", a: "可以，完全安全：交换机只有在与 PoE 设备完成功率协商后才会供电。普通笔记本电脑或打印机只会收到数据。" },
          { q: "PoE 的传输距离是多少？", a: "在 Cat5e/Cat6 双绞线上最远 100 米——与以太网本身相同。更远的距离可使用 PoE 延长器（每个再延伸 100 米）或带 PoE 光电转换器的光纤。" },
          { q: "PoE+ 与普通 PoE 有什么区别？", a: "区别在功率：PoE（802.3af）最高输出 15.4 W，PoE+（802.3at）最高 30 W。云台摄像机、Wi-Fi 6 无线 AP 和带加热器的摄像机需要 PoE+ 及以上标准。" },
          { q: "如果交换机功率不够会怎样？", a: "交换机会按优先级逐个关闭端口——摄像机会随机掉线。因此功率预算必须留出 25–30% 的余量。" },
        ],
      },
    },
  },
  {
    slug: "kamera-narxlari",
    date: "2026-08-20",
    related: ["cctv"],
    loc: {
      uz: {
        title: "Kamera narxlari 2026: videokuzatuv qancha turadi",
        excerpt: "Toshkentda videokuzatuv kameralari narxlari: mini kameradan professional IP-kameragacha, to'plam narxi, o'rnatish qiymati va nimaga pul to'lash arziydi.",
        sections: [
          { h: "Kamera narxi nimaga bog'liq", p: [
            "Narxni to'rt narsa belgilaydi: aniqlik (2–8 Mp), korpus turi (ichki, ko'cha, aylanuvchi PTZ), tungi ko'rish texnologiyasi va brend. Xitoyning nomsiz modeli bilan Hikvision yoki Dahua o'rtasidagi farq — kafolat, dasturiy ta'minot sifati va bir necha yillik ishonchli ishlash.",
            "Eng arzon Wi-Fi kameralar 300–500 ming so'mdan boshlanadi, sifatli ko'cha IP-kameralar 700 ming — 1,5 million so'm oralig'ida, aylanuvchi PTZ va maxsus modellar undan qimmatroq.",
          ] },
          { h: "Mini kameralar: nima uchun arzon", p: [
            "«Mini kamera narxlari» so'rovi bo'yicha odatda kichik Wi-Fi kameralar topiladi — ular uy ichida, bolalar yoki xodimlarni kuzatish uchun qulay. Narxi past, lekin cheklovlari bor: kuchsiz tungi yoritish, xotira kartasiga bog'liqlik va Wi-Fi sifatiga sezgirlik.",
            "Hovli, do'kon yoki ombor uchun mini kamera yaramaydi — u yerda ko'cha korpusi (IP66), IQ-yoritish va registratorga simli ulanish kerak.",
          ] },
          { h: "To'plam narxi: uy va do'kon uchun", p: [
            "Amalda narx bitta kameraga emas, to'plamga qaraladi. Uy uchun tipik to'plam: 4 ta ko'cha kamerasi + PoE-registrator + qattiq disk + kabel va montaj. Do'kon uchun: 2–4 ta ichki kamera kassa va zal ustida, registrator va telefondan ko'rish sozlamasi.",
            "To'plam narxiga uskunadan tashqari kabel, quvvat manbai, ishchi soatlar va sozlash kiradi — shuning uchun «faqat kamera narxi»ga qarab byudjet tuzish noto'g'ri.",
          ] },
          { h: "O'rnatish qancha turadi", p: [
            "Montaj narxi kameralar soni, kabel uzunligi va obyekt murakkabligiga bog'liq: yangi qurilishda kabel yotqizish oson, tayyor ta'mirda esa gofra va korobkalar kerak bo'ladi. Muhandisning chiqishi va smeta hisob-kitobi bizda bepul.",
            "Ba'zan tejash mumkin: agar kamera registratorga yaqin bo'lsa yoki tayyor kabel trassasi bo'lsa, ishlar arzonlashadi.",
          ] },
          { h: "Nimaga pul to'lash arziydi", p: [
            "Uch narsaga tejamang: asosiy zonalardagi kamera sifati (kirish, kassa), registrator diski (videokuzatuv uchun maxsus seriya) va montaj. Qolganida kelishuv mumkin: brend, arxiv chuqurligi, qo'shimcha funksiyalar.",
            "Katalogimizda 3000 dan ortiq tovar bor, kameralar Toshkentda mavjud, narxlar so'mda va kafolat bilan. Vazifangizni ayting — byudjetga mos to'plamni tanlab, aniq narxni hisoblab beramiz.",
          ] },
        ],
        faq: [{ q: "Kamera o'rnatish narxi qancha?", a: "O'rnatish kameralar soni va kabel uzunligiga bog'liq: bitta kamera montaji o'rtacha 150–300 ming so'm, 4 kamerali to'plam kalit topshirish bilan — smetaga qarab. Muhandis chiqishi va hisob-kitob bepul." },
          { q: "Eng arzon kamera qancha turadi?", a: "Oddiy ichki Wi-Fi kamera 300–500 ming so'mdan boshlanadi. Ko'cha uchun sifatli IP-kamera odatda 700 ming so'mdan yuqori." },
          { q: "4 kameradan iborat to'plam qancha bo'ladi?", a: "Uskuna, registrator, disk, kabel va montaj bilan birga — obyektga bog'liq. Muhandis chiqib, bepul smeta tuzib beradi." },
          { q: "Registrator shartmi?", a: "1–2 kamera uchun xotira kartasi yetarli. 3+ kamera va uzoq arxiv kerak bo'lsa — registrator arzonroq va ishonchliroq." },
          { q: "Kafolat bormi?", a: "Ha, barcha uskunaga rasmiy kafolat va montaj ishlariga kafolat beramiz." },
        ],
      },
      ru: {
        title: "Цены на камеры видеонаблюдения в Ташкенте: от чего зависят",
        excerpt: "Сколько стоят камеры видеонаблюдения в Ташкенте: мини-камеры, уличные IP-камеры, готовые комплекты и монтаж — и на чём не стоит экономить.",
        sections: [
          { h: "От чего зависит цена камеры", p: [
            "Цену определяют четыре вещи: разрешение (2–8 Мп), тип корпуса (внутренняя, уличная, поворотная PTZ), технология ночной съёмки и бренд. Разница между безымянной моделью и Hikvision или Dahua — это гарантия, качество прошивки и годы стабильной работы.",
            "Самые доступные Wi-Fi камеры начинаются от 300–500 тысяч сум, качественные уличные IP-камеры — в диапазоне 700 тысяч — 1,5 млн сум, поворотные PTZ и специальные модели дороже.",
          ] },
          { h: "Мини-камеры: почему дёшево", p: [
            "Под «мини-камерами» обычно понимают компактные Wi-Fi модели для дома — присмотр за ребёнком, комнатой, персоналом. Цена низкая, но есть ограничения: слабая ночная подсветка, зависимость от карты памяти и качества Wi-Fi.",
            "Для двора, магазина или склада мини-камера не подходит — там нужен уличный корпус (IP66), ИК-подсветка и проводное подключение к регистратору.",
          ] },
          { h: "Цена комплекта: дом и магазин", p: [
            "На практике считают не одну камеру, а комплект. Для дома типовой набор: 4 уличные камеры + PoE-регистратор + жёсткий диск + кабель и монтаж. Для магазина: 2–4 внутренние камеры над кассой и залом, регистратор и настройка просмотра с телефона.",
            "В стоимость комплекта кроме оборудования входят кабель, питание, работы и настройка — поэтому планировать бюджет только по «цене камеры» неверно.",
          ] },
          { h: "Сколько стоит установка", p: [
            "Цена монтажа зависит от числа камер, длины трасс и сложности объекта: в новостройке проложить кабель просто, в готовом ремонте нужны гофра и короба. Выезд инженера и расчёт сметы у нас бесплатные.",
            "Иногда можно сэкономить: если камеры рядом с регистратором или есть готовая кабельная трасса, работы обходятся дешевле.",
          ] },
          { h: "На чём не стоит экономить", p: [
            "Три вещи, где экономия выходит боком: качество камер в ключевых зонах (вход, касса), жёсткий диск регистратора (специальная серия для видеонаблюдения) и монтаж. В остальном можно выбирать: бренд, глубину архива, дополнительные функции.",
            "В нашем каталоге более 3000 товаров, камеры в наличии в Ташкенте, цены в сумах и с гарантией. Опишите задачу — подберём комплект под бюджет и посчитаем точную стоимость.",
          ] },
        ],
        faq: [{ q: "Сколько стоит установка одной камеры?", a: "Монтаж зависит от числа камер и длины кабеля: одна камера — в среднем 150–300 тысяч сум, комплект из 4 камер под ключ — по смете. Выезд инженера и расчёт бесплатные." },
          { q: "Сколько стоит самая недорогая камера?", a: "Простая внутренняя Wi-Fi камера — от 300–500 тысяч сум. Качественная уличная IP-камера обычно от 700 тысяч сум." },
          { q: "Во сколько обойдётся комплект из 4 камер?", a: "Зависит от объекта: оборудование, регистратор, диск, кабель и монтаж. Инженер выезжает и составляет смету бесплатно." },
          { q: "Обязателен ли регистратор?", a: "Для 1–2 камер достаточно карты памяти. От 3 камер и при необходимости длинного архива регистратор дешевле и надёжнее." },
          { q: "Есть ли гарантия?", a: "Да, на всё оборудование — официальная гарантия, на монтажные работы — гарантия компании." },
        ],
      },
      en: {
        title: "CCTV Camera Prices in Tashkent: What Drives the Cost",
        excerpt: "How much CCTV cameras cost in Tashkent: mini cameras, outdoor IP cameras, ready-made kits and installation — and where cutting corners backfires.",
        sections: [
          { h: "What determines the price of a camera", p: [
            "Four factors set the price: resolution (2–8 MP), housing type (indoor, outdoor, PTZ), night-vision technology and the brand. The gap between a no-name model and Hikvision or Dahua comes down to warranty, firmware quality and years of trouble-free operation.",
            "The most affordable Wi-Fi cameras start at 300,000–500,000 UZS, quality outdoor IP cameras run from 700,000 to 1.5 million UZS, while PTZ and specialty models cost more.",
          ] },
          { h: "Mini cameras: why they are cheap", p: [
            "\"Mini cameras\" usually means compact Wi-Fi models for the home — keeping an eye on a child, a room or staff. The price is low, but so are the capabilities: weak night illumination, reliance on a memory card and on your Wi-Fi quality.",
            "For a yard, a shop or a warehouse a mini camera is the wrong tool — those sites need a weatherproof housing (IP66), IR illumination and a wired connection to a recorder.",
          ] },
          { h: "Kit pricing: home and retail", p: [
            "In practice you budget for a kit, not a single camera. A typical home setup: 4 outdoor cameras + a PoE NVR + a hard drive + cabling and installation. For a shop: 2–4 indoor cameras over the till and the sales floor, a recorder and mobile viewing set up on your phone.",
            "Besides the hardware, a kit's price includes cable, power supplies, labour and configuration — so planning a budget around the \"camera price\" alone is a mistake.",
          ] },
          { h: "How much installation costs", p: [
            "Installation pricing depends on the number of cameras, cable run lengths and site complexity: routing cable in a new build is easy, while a finished interior calls for conduit and trunking. Our engineer's site visit and cost estimate are free.",
            "Sometimes you can save: if the cameras sit close to the recorder or an existing cable route is available, the labour costs less.",
          ] },
          { h: "Where not to cut corners", p: [
            "Three places where saving money backfires: camera quality in key zones (entrance, till), the recorder's hard drive (use a surveillance-rated series) and the installation itself. Everything else is negotiable: brand, archive depth, extra features.",
            "Our catalogue holds over 3,000 products, cameras are in stock in Tashkent, prices are in UZS and come with a warranty. Describe your task — we will match a kit to your budget and calculate the exact cost.",
          ] },
        ],
        faq: [
          { q: "How much does installing one camera cost?", a: "Installation depends on the number of cameras and cable length: a single camera averages 150,000–300,000 UZS, a turnkey 4-camera kit is priced by estimate. The engineer's visit and calculation are free." },
          { q: "How much is the cheapest camera?", a: "A basic indoor Wi-Fi camera starts at 300,000–500,000 UZS. A quality outdoor IP camera usually starts from 700,000 UZS." },
          { q: "What will a 4-camera kit cost?", a: "It depends on the site: equipment, recorder, hard drive, cable and installation. An engineer visits and prepares the estimate free of charge." },
          { q: "Is a recorder mandatory?", a: "For 1–2 cameras a memory card is enough. From 3 cameras up, or when you need long footage retention, a recorder is cheaper and more reliable." },
          { q: "Is there a warranty?", a: "Yes — all equipment carries an official manufacturer warranty, and installation work is covered by our company warranty." },
        ],
      },
      tr: {
        title: "Taşkent'te Güvenlik Kamerası Fiyatları Neye Bağlı?",
        excerpt: "Taşkent'te güvenlik kameraları ne kadar: mini kameralar, dış mekân IP kameralar, hazır setler ve montaj — ve nereden kısmamak gerektiği.",
        sections: [
          { h: "Kamera fiyatını ne belirler", p: [
            "Fiyatı dört etken belirler: çözünürlük (2–8 MP), gövde tipi (iç mekân, dış mekân, PTZ), gece görüş teknolojisi ve marka. İsimsiz bir modelle Hikvision veya Dahua arasındaki fark garanti, yazılım kalitesi ve yıllarca sorunsuz çalışmadır.",
            "En uygun Wi-Fi kameralar 300.000–500.000 UZS'den başlar; kaliteli dış mekân IP kameralar 700.000 ile 1,5 milyon UZS arasındadır; PTZ ve özel modeller daha pahalıdır.",
          ] },
          { h: "Mini kameralar: neden ucuz", p: [
            "\"Mini kamera\" denince genellikle ev için kompakt Wi-Fi modeller anlaşılır — çocuğu, odayı veya personeli izlemek için. Fiyatı düşüktür ama sınırları vardır: zayıf gece aydınlatması, hafıza kartına ve Wi-Fi kalitesine bağımlılık.",
            "Avlu, mağaza veya depo için mini kamera uygun değildir — buralarda dış mekân gövdesi (IP66), IR aydınlatma ve kayıt cihazına kablolu bağlantı gerekir.",
          ] },
          { h: "Set fiyatı: ev ve mağaza", p: [
            "Pratikte tek kamera değil, set hesaplanır. Ev için tipik paket: 4 dış mekân kamera + PoE kayıt cihazı + sabit disk + kablo ve montaj. Mağaza için: kasa ve satış alanına 2–4 iç mekân kamera, kayıt cihazı ve telefondan izleme kurulumu.",
            "Set fiyatına ekipmanın yanı sıra kablo, güç kaynağı, işçilik ve yapılandırma da girer — bu yüzden bütçeyi yalnızca \"kamera fiyatına\" göre planlamak yanlıştır.",
          ] },
          { h: "Montaj ne kadar tutar", p: [
            "Montaj fiyatı kamera sayısına, kablo güzergâhlarının uzunluğuna ve mekânın zorluğuna bağlıdır: yeni binada kablo çekmek kolaydır, bitmiş dekorasyonda spiral boru ve kablo kanalı gerekir. Mühendisin keşif ziyareti ve fiyat hesabı bizde ücretsizdir.",
            "Bazen tasarruf mümkündür: kameralar kayıt cihazına yakınsa veya hazır bir kablo güzergâhı varsa işçilik daha ucuza gelir.",
          ] },
          { h: "Nereden kısılmamalı", p: [
            "Tasarrufun geri teptiği üç nokta: kritik bölgelerdeki (giriş, kasa) kamera kalitesi, kayıt cihazının sabit diski (güvenlik kamerası için özel seri) ve montaj. Gerisi tercihe kalmıştır: marka, arşiv süresi, ek özellikler.",
            "Kataloğumuzda 3.000'den fazla ürün var; kameralar Taşkent'te stokta, fiyatlar UZS cinsinden ve garantilidir. İhtiyacınızı anlatın — bütçenize uygun seti seçip kesin fiyatı hesaplayalım.",
          ] },
        ],
        faq: [
          { q: "Bir kameranın montajı ne kadar?", a: "Montaj, kamera sayısına ve kablo uzunluğuna bağlıdır: tek kamera ortalama 150.000–300.000 UZS, 4 kameralık anahtar teslim set keşif sonrası fiyatlandırılır. Mühendis ziyareti ve hesaplama ücretsizdir." },
          { q: "En ucuz kamera ne kadar?", a: "Basit bir iç mekân Wi-Fi kamera 300.000–500.000 UZS'den başlar. Kaliteli bir dış mekân IP kamera genellikle 700.000 UZS'den başlar." },
          { q: "4 kameralık set kaça mal olur?", a: "Mekâna bağlıdır: ekipman, kayıt cihazı, disk, kablo ve montaj. Mühendis ücretsiz keşfe gelir ve fiyat teklifini hazırlar." },
          { q: "Kayıt cihazı şart mı?", a: "1–2 kamera için hafıza kartı yeterlidir. 3 kameradan itibaren ve uzun arşiv gerektiğinde kayıt cihazı hem daha ucuz hem daha güvenilirdir." },
          { q: "Garanti var mı?", a: "Evet, tüm ekipmanda resmi garanti, montaj işlerinde ise şirket garantisi vardır." },
        ],
      },
      zh: {
        title: "塔什干监控摄像头价格：由哪些因素决定",
        excerpt: "塔什干监控摄像头多少钱：迷你摄像头、室外IP摄像头、成套方案与安装费用，以及哪些环节不该省钱。",
        sections: [
          { h: "摄像头价格由什么决定", p: [
            "价格取决于四个因素：分辨率（2–8 MP）、外壳类型（室内、室外、PTZ云台）、夜视技术和品牌。杂牌产品与Hikvision、Dahua之间的差距，体现在质保、固件质量和多年稳定运行上。",
            "最便宜的Wi-Fi摄像头约30万–50万苏姆起，优质室外IP摄像头在70万至150万苏姆之间，PTZ云台及特种型号价格更高。",
          ] },
          { h: "迷你摄像头为什么便宜", p: [
            "所谓“迷你摄像头”，通常指家用的小型Wi-Fi机型——用来照看孩子、房间或店员。价格虽低，但局限明显：夜视补光弱，依赖存储卡，还受Wi-Fi信号质量影响。",
            "院子、商店或仓库并不适合迷你摄像头——这些场景需要室外防护外壳（IP66）、红外补光，并通过有线方式接入录像机。",
          ] },
          { h: "成套方案价格：住宅与商铺", p: [
            "实际预算按整套方案计算，而不是单个摄像头。住宅典型配置：4台室外摄像头 + PoE录像机 + 硬盘 + 线缆与安装。商铺配置：收银台和营业区上方2–4台室内摄像头，加录像机并配置手机远程查看。",
            "成套价格除设备外，还包含线缆、电源、施工和调试——因此只按“摄像头单价”做预算是不准确的。",
          ] },
          { h: "安装费用是多少", p: [
            "安装费取决于摄像头数量、布线长度和现场复杂度：毛坯新房布线简单，已装修的房间则需要波纹管和线槽。我们的工程师上门勘察和报价免费。",
            "有时可以省钱：如果摄像头离录像机较近，或已有现成的走线通道，施工费用会更低。",
          ] },
          { h: "哪些环节不该省钱", p: [
            "三个省钱容易吃亏的环节：关键区域（入口、收银台）的摄像头品质、录像机硬盘（应选监控专用系列）以及安装施工。其余方面可以灵活取舍：品牌、录像保存时长、附加功能。",
            "我们的目录有3000多种商品，摄像头在塔什干有现货，以苏姆计价并提供质保。告诉我们您的需求——我们会按预算配好方案并核算准确报价。",
          ] },
        ],
        faq: [
          { q: "安装一台摄像头多少钱？", a: "安装费取决于摄像头数量和布线长度：单台摄像头平均15万–30万苏姆，4台摄像头的整套交钥匙方案按报价单计算。工程师上门与核算免费。" },
          { q: "最便宜的摄像头多少钱？", a: "简单的室内Wi-Fi摄像头约30万–50万苏姆起。优质室外IP摄像头一般70万苏姆起。" },
          { q: "4台摄像头的整套方案要多少钱？", a: "取决于现场情况：设备、录像机、硬盘、线缆和安装。工程师免费上门并出具报价单。" },
          { q: "必须配录像机吗？", a: "1–2台摄像头用存储卡即可。3台以上或需要较长录像保存期时，录像机更划算也更可靠。" },
          { q: "有质保吗？", a: "有。所有设备均提供官方质保，安装工程由公司提供质保。" },
        ],
      },
    },
  },
  {
    slug: "videokuzatuv-ornatish-narxi",
    date: "2026-07-30",
    related: ["cctv"],
    loc: {
      uz: {
        title: "Kamera ustanovka narxi: videokuzatuv o'rnatish bosqichlari (Toshkent)",
        excerpt: "Kamera o'rnatish qanday boradi: obyektni ko'rish, kameralar sonini aniqlash, kabel yotqizish, sozlash va telefondan ko'rish. Narx nimalardan tashkil topadi.",
        sections: [
          { h: "Ishlar qanday boshlanadi", p: [
            "Avval muhandis obyektga chiqadi (bepul): kirish joylari, kassa, ombor, hovli va «ko'r nuqtalar» belgilanadi. Shundan keyin kameralar soni, turi va kabel trassalari aniqlanadi — aynan shu bosqichda narx tug'iladi.",
            "Yaxshi loyihada kameralar soni minimal, lekin qamrov to'liq: bitta to'g'ri joylashtirilgan kamera ikkita noto'g'ri o'rnatilganidan foydaliroq.",
          ] },
          { h: "Montaj bosqichlari", p: [
            "Kabel yotqizish (gofra, lotok yoki devor ichida), kameralarni kronshteynga o'rnatish, registrator va quvvat manbaini shkafga yig'ish, tarmoqni sozlash, kameralarni fokuslash va yozuvni tekshirish. Yakunida telefonga ilova sozlanadi va xodimlarga ko'rsatiladi.",
            "O'rtacha uy yoki do'kon obyekti bir kunda tugaydi, katta obyektlar — bir necha kun.",
          ] },
          { h: "Narx nimalardan tashkil topadi", p: [
            "Uskuna (kameralar, registrator, disk), sarf materiallari (kabel, gofra, konnektorlar, quvvat bloklari) va ishchi soatlar. Tayyor ta'mirdagi obyektda montaj qimmatroq: trassalarni yashirish qiyin.",
            "Alohida hisoblanadi: ustunga o'rnatish, uzun ko'cha trassalari, optik aloqa va ko'cha shkaflari — bular hovli va ishlab chiqarish obyektlarida uchraydi.",
          ] },
          { h: "Sozlash va telefondan ko'rish", p: [
            "Montajdan keyin biz albatta sozlaymiz: harakat detektori zonalari, yozuv jadvali, arxiv chuqurligi, telefonda ilova va kirish huquqlari. Sizga tayyor ishlaydigan tizim topshiriladi, «keyin o'zingiz sozlarsiz» degan gap bo'lmaydi.",
            "Telefondan ko'rish qanday ishlashini alohida maqolada yozganmiz — Hik-Connect, DMSS va boshqa ilovalar bo'yicha.",
          ] },
          { h: "Kafolat va servis", p: [
            "Uskunaga rasmiy kafolat, montaj ishlariga kompaniya kafolati. Keyinchalik texnik xizmat ko'rsatish shartnomasini tuzish mumkin: profilaktika, kameralarni tozalash, disk holatini tekshirish.",
            "O'lchov va smeta uchun qo'ng'iroq qiling yoki saytdagi chatga yozing — muhandis chiqib, aniq narxni hisoblab beradi.",
          ] },
        ],
        faq: [
          { q: "O'rnatish qancha vaqt oladi?", a: "Uy yoki do'kon uchun odatda bir kun. Katta obyekt (ombor, ishlab chiqarish, hovli) — bir necha kun, kabel hajmiga qarab." },
          { q: "Smeta pulli emasmi?", a: "Yo'q, muhandisning chiqishi va smeta hisob-kitobi bepul." },
          { q: "Tayyor ta'mirda kabel qanday yotqiziladi?", a: "Gofra yoki kabel-kanal orqali devor bo'ylab, imkon bo'lsa shift ostidan. Loyiha bosqichida qaysi yo'l chiroyliroq ekanini kelishamiz." },
          { q: "Kameralarni o'zim sotib olsam bo'ladimi?", a: "Ha, faqat montaj xizmatini ham bajaramiz. Lekin bunda kafolat faqat ishlarimizga tegishli bo'ladi." },
        ],
      },
      ru: {
        title: "Установка видеонаблюдения: этапы работ и из чего складывается цена",
        excerpt: "Как проходит установка камер: обследование объекта, подбор количества камер, прокладка кабеля, настройка и просмотр с телефона — и из чего складывается стоимость.",
        sections: [
          { h: "С чего начинаются работы", p: [
            "Сначала инженер выезжает на объект (бесплатно): отмечаются входы, касса, склад, двор и «слепые зоны». После этого определяется количество камер, их тип и кабельные трассы — именно здесь и рождается цена.",
            "В хорошем проекте камер минимум, а покрытие полное: одна правильно расположенная камера полезнее двух установленных наугад.",
          ] },
          { h: "Этапы монтажа", p: [
            "Прокладка кабеля (гофра, лоток или в стене), установка камер на кронштейны, сборка регистратора и питания в шкафу, настройка сети, фокусировка камер и проверка записи. В конце настраивается приложение на телефоне и проводится обучение сотрудников.",
            "Средний объект — дом или магазин — закрывается за один день, крупные объекты требуют нескольких дней.",
          ] },
          { h: "Из чего складывается цена", p: [
            "Оборудование (камеры, регистратор, диск), расходные материалы (кабель, гофра, коннекторы, блоки питания) и работы. На объекте с готовым ремонтом монтаж дороже: трассы сложнее спрятать.",
            "Отдельно считаются установка на столбы, длинные уличные трассы, оптика и уличные шкафы — это встречается на дворовых и производственных объектах.",
          ] },
          { h: "Настройка и просмотр с телефона", p: [
            "После монтажа мы обязательно настраиваем: зоны детекции движения, расписание записи, глубину архива, приложение на телефоне и права доступа. Вы получаете готовую работающую систему, а не «дальше настроите сами».",
            "Как устроен удалённый просмотр, мы подробно разобрали в отдельной статье — по приложениям Hik-Connect, DMSS и другим.",
          ] },
          { h: "Гарантия и сервис", p: [
            "На оборудование — официальная гарантия, на монтажные работы — гарантия компании. В дальнейшем можно заключить договор на техобслуживание: профилактика, чистка камер, проверка состояния диска.",
            "Для замера и сметы позвоните или напишите в чат на сайте — инженер выедет и посчитает точную стоимость.",
          ] },
        ],
        faq: [
          { q: "Сколько времени занимает установка?", a: "Для дома или магазина обычно один день. Крупный объект (склад, производство, двор) — несколько дней в зависимости от объёма кабельных работ." },
          { q: "Смета платная?", a: "Нет, выезд инженера и расчёт сметы бесплатные." },
          { q: "Как прокладывают кабель в готовом ремонте?", a: "В гофре или кабель-канале по стенам, где возможно — за подвесным потолком. На этапе проекта согласуем наиболее аккуратный вариант." },
          { q: "Можно купить камеры самому?", a: "Да, выполняем и только монтаж. Но в этом случае гарантия распространяется лишь на наши работы." },
        ],
      },
      en: {
        title: "CCTV Installation Cost: Work Stages and Price Breakdown",
        excerpt: "How camera installation works: site survey, choosing the number of cameras, cabling, configuration and mobile viewing — and what makes up the cost.",
        sections: [
          { h: "Where the work begins", p: [
            "It starts with a free site visit by an engineer: entrances, the till, the warehouse, the yard and blind spots are mapped out. From there the number of cameras, their types and the cable routes are decided — and that is exactly where the price is born.",
            "A good design uses the minimum number of cameras with full coverage: one well-placed camera beats two installed at random.",
          ] },
          { h: "Installation stages", p: [
            "Cable routing (conduit, tray or in-wall), mounting cameras on brackets, assembling the recorder and power supplies in a cabinet, network setup, camera focusing and recording checks. Finally, the mobile app is configured and your staff are trained.",
            "An average site — a house or a shop — is completed in a single day; large sites take several days.",
          ] },
          { h: "What makes up the price", p: [
            "Equipment (cameras, recorder, hard drive), consumables (cable, conduit, connectors, power supplies) and labour. On a site with a finished interior, installation costs more: cable routes are harder to conceal.",
            "Pole mounting, long outdoor runs, fibre optics and outdoor cabinets are priced separately — these come up on yards and industrial sites.",
          ] },
          { h: "Configuration and mobile viewing", p: [
            "After installation we always configure the essentials: motion detection zones, the recording schedule, archive retention, the mobile app and access rights. You get a finished, working system — not a \"set the rest up yourself\".",
            "How remote viewing works — through Hik-Connect, DMSS and other apps — we cover in detail in a separate article.",
          ] },
          { h: "Warranty and service", p: [
            "Equipment carries an official manufacturer warranty; installation work is covered by our company warranty. Later you can sign a maintenance contract: preventive checks, camera cleaning and hard-drive health monitoring.",
            "For a site survey and an estimate, call us or write in the website chat — an engineer will visit and calculate the exact cost.",
          ] },
        ],
        faq: [
          { q: "How long does installation take?", a: "For a house or a shop, usually one day. A large site (warehouse, factory, yard) takes several days, depending on the amount of cabling work." },
          { q: "Is the estimate paid?", a: "No — the engineer's visit and the cost estimate are free." },
          { q: "How is cable routed in a finished interior?", a: "In conduit or surface trunking along the walls, and above a suspended ceiling where possible. At the design stage we agree on the tidiest option." },
          { q: "Can I buy the cameras myself?", a: "Yes, we also do installation-only jobs. In that case, however, our warranty covers only the work we performed." },
        ],
      },
      tr: {
        title: "Kamera Kurulum Fiyatı: Montaj Aşamaları ve Maliyet",
        excerpt: "Kamera kurulumu nasıl ilerler: keşif, kamera sayısının belirlenmesi, kablo çekimi, yapılandırma ve telefondan izleme — fiyat nelerden oluşur.",
        sections: [
          { h: "İşler nereden başlar", p: [
            "Önce mühendis mekâna gelir (ücretsiz): girişler, kasa, depo, avlu ve kör noktalar işaretlenir. Ardından kamera sayısı, tipleri ve kablo güzergâhları belirlenir — fiyat tam da burada ortaya çıkar.",
            "İyi bir projede kamera sayısı minimum, kapsama alanı ise tamdır: doğru yerleştirilmiş tek kamera, rastgele takılmış iki kameradan daha faydalıdır.",
          ] },
          { h: "Montaj aşamaları", p: [
            "Kablo çekimi (spiral boru, kablo tavası veya duvar içi), kameraların braketlere montajı, kayıt cihazı ve güç kaynaklarının panoya yerleştirilmesi, ağ ayarları, kameraların odaklanması ve kayıt kontrolü. Sonunda telefondaki uygulama kurulur ve personel eğitilir.",
            "Ortalama bir mekân — ev veya mağaza — bir günde tamamlanır; büyük projeler birkaç gün sürer.",
          ] },
          { h: "Fiyat nelerden oluşur", p: [
            "Ekipman (kameralar, kayıt cihazı, disk), sarf malzemeleri (kablo, spiral boru, konnektörler, güç kaynakları) ve işçilik. Dekorasyonu bitmiş mekânda montaj daha pahalıdır: güzergâhları gizlemek zorlaşır.",
            "Direğe montaj, uzun dış mekân hatları, fiber optik ve dış mekân panoları ayrıca hesaplanır — bunlara avlu ve sanayi tesislerinde rastlanır.",
          ] },
          { h: "Yapılandırma ve telefondan izleme", p: [
            "Montajdan sonra mutlaka şunları ayarlarız: hareket algılama bölgeleri, kayıt programı, arşiv süresi, telefon uygulaması ve erişim yetkileri. \"Gerisini kendiniz ayarlarsınız\" değil, çalışır durumda hazır bir sistem teslim alırsınız.",
            "Uzaktan izlemenin nasıl çalıştığını — Hik-Connect, DMSS ve diğer uygulamalar üzerinden — ayrı bir yazıda ayrıntılı anlattık.",
          ] },
          { h: "Garanti ve servis", p: [
            "Ekipmanda resmi garanti, montaj işlerinde şirket garantisi vardır. Sonrasında bakım sözleşmesi yapılabilir: periyodik kontrol, kamera temizliği, disk durumunun izlenmesi.",
            "Keşif ve fiyat teklifi için bizi arayın veya sitedeki sohbete yazın — mühendis gelir ve kesin fiyatı hesaplar.",
          ] },
        ],
        faq: [
          { q: "Kurulum ne kadar sürer?", a: "Ev veya mağaza için genellikle bir gün. Büyük mekânlar (depo, üretim tesisi, avlu) kablo işlerinin hacmine göre birkaç gün sürer." },
          { q: "Keşif ücretli mi?", a: "Hayır, mühendis ziyareti ve fiyat hesaplaması ücretsizdir." },
          { q: "Bitmiş dekorasyonda kablo nasıl çekilir?", a: "Duvar boyunca spiral boru veya kablo kanalı içinde, mümkün olan yerlerde asma tavan üzerinden. Proje aşamasında en temiz çözümü birlikte belirleriz." },
          { q: "Kameraları kendim alabilir miyim?", a: "Evet, yalnızca montaj hizmeti de veriyoruz. Ancak bu durumda garanti sadece yaptığımız işleri kapsar." },
        ],
      },
      zh: {
        title: "视频监控安装价格：施工流程与费用构成",
        excerpt: "摄像头安装如何进行：现场勘察、确定摄像头数量、布线施工、系统调试与手机远程查看——以及费用由哪些部分构成。",
        sections: [
          { h: "工程从哪里开始", p: [
            "首先由工程师免费上门勘察：标出入口、收银台、仓库、院子和监控盲区。随后确定摄像头数量、类型和布线路径——价格正是在这一步形成的。",
            "好的方案用最少的摄像头实现全覆盖：一台位置正确的摄像头，胜过两台随意安装的。",
          ] },
          { h: "安装施工步骤", p: [
            "布线（波纹管、桥架或墙内暗线）、支架安装摄像头、在机柜内组装录像机和电源、配置网络、调整摄像头焦距并测试录像。最后配置手机App并对员工进行使用培训。",
            "普通项目——住宅或商铺——一天即可完工，大型项目需要数天。",
          ] },
          { h: "价格由哪些部分构成", p: [
            "设备（摄像头、录像机、硬盘）、耗材（线缆、波纹管、接头、电源）和施工费。已装修完的场所安装费更高：走线更难隐藏。",
            "立杆安装、室外长距离布线、光纤和室外机柜单独计价——这些常见于院区和工业场所。",
          ] },
          { h: "系统调试与手机查看", p: [
            "安装完成后我们一定会做好调试：移动侦测区域、录像计划、录像保存时长、手机App和访问权限。您拿到的是一套可直接使用的完整系统，而不是“剩下的自己设置”。",
            "远程查看如何实现——通过Hik-Connect、DMSS等App——我们在另一篇文章中做了详细讲解。",
          ] },
          { h: "质保与售后服务", p: [
            "设备享受官方质保，安装工程由公司质保。之后还可签订维保合同：定期检查、清洁摄像头、检测硬盘状态。",
            "如需上门测量和报价，请致电或在网站聊天窗口留言——工程师将上门核算准确费用。",
          ] },
        ],
        faq: [
          { q: "安装需要多长时间？", a: "住宅或商铺通常一天完成。大型场所（仓库、工厂、院区）视布线工程量需要数天。" },
          { q: "报价收费吗？", a: "不收费，工程师上门勘察和报价均免费。" },
          { q: "已装修的房间怎么布线？", a: "沿墙使用波纹管或线槽，可行时走吊顶内部。在方案阶段我们会与您确认最美观的走线方式。" },
          { q: "可以自己购买摄像头吗？", a: "可以，我们也承接纯安装服务。但这种情况下质保仅覆盖我们的施工部分。" },
        ],
      },
    },
  },
  {
    slug: "turniket-narxi",
    date: "2026-08-20",
    related: ["turnstile", "access"],
    loc: {
      ru: {
        title: "Сколько стоит турникет с установкой в Ташкенте",
        excerpt: "Цены на турникеты в 2026 году: трипод, распашной, полноростовой и с Face ID. Из чего складывается стоимость под ключ и на чём можно сэкономить.",
        sections: [
          { h: "Типы турникетов и порядок цен", p: [
            "Турникет-трипод — самый доступный вариант для офиса и проходной: базовые модели ZKTeco и Hikvision начинаются примерно от 4–6 млн сум. Распашные калитки для МГН и переносов грузов сопоставимы по цене, скоростные проходы (speed gate) со стеклянными створками — заметно дороже, от 15–20 млн сум за проход. Полноростовые турникеты для периметра и стадионов — верх диапазона.",
            "К турникету почти всегда добавляется идентификация: считыватель карт — недорого, а биометрический терминал с распознаванием лиц (Face ID) — от 2,5–3 млн сум. Именно связка «турникет + Face ID + учёт рабочего времени» чаще всего и нужна бизнесу в Ташкенте.",
          ] },
          { h: "Из чего складывается цена под ключ", p: [
            "Итоговая смета — это оборудование + монтаж + пусконаладка. Монтаж включает крепление к полу, подводку питания, подключение к СКУД и настройку сценариев прохода. Для одного трипода с установкой ориентируйтесь от 6–8 млн сум, точная цифра зависит от объекта.",
            "Если нужен учёт рабочего времени, добавляется программная часть: интеграция терминалов с ПО и выгрузка табеля. Мы делаем это в том же проекте — отдельный подрядчик не нужен.",
          ] },
          { h: "На чём можно сэкономить", p: [
            "Не переплачивайте за скоростные проходы там, где хватит трипода: для офиса до 100 сотрудников это лишние десятки миллионов. Экономить на биометрии наоборот не стоит — карты теряют и передают друг другу, Face ID закрывает эту дыру раз и навсегда.",
            "Вторая экономия — правильный проект: если сразу заложить количество точек прохода и запас по питанию, не придётся переделывать. Выезд инженера и смета у нас бесплатные.",
          ] },
          { h: "Что дальше", p: [
            "Посмотрите турникеты и шлагбаумы в каталоге — цены в сумах, наличие в Ташкенте. Опишите проходную (число сотрудников, ширина проёма, нужен ли учёт времени) — предложим 2–3 варианта с точной сметой за один день.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит самый недорогой турникет?", a: "Турникет-трипод начального уровня — примерно от 4–6 млн сум за оборудование. С установкой и настройкой — от 6–8 млн сум." },
          { q: "Сколько стоит турникет с распознаванием лиц?", a: "К цене турникета добавьте биометрический терминал — от 2,5–3 млн сум за точку прохода. Для двух направлений нужны два терминала." },
          { q: "Сколько времени занимает установка?", a: "Один трипод с подключением к СКУД — обычно 1 день. Комплекс из нескольких проходов с учётом времени — 2–5 дней." },
          { q: "Работаете ли вы с юрлицами и тендерами?", a: "Да: договор, счёт-фактура, работа с НДС, сдача объекта с актами. Участвуем в закупках на биржевых площадках." },
        ],
      },
      uz: {
        title: "Turniket narxi qancha? Toshkentda o'rnatish bilan",
        excerpt: "2026-yilda turniket narxlari: tripod, qanotli, to'liq bo'yli va Face ID bilan. Narx nimadan iborat va qayerda tejash mumkin.",
        sections: [
          { h: "Turniket turlari va narxlar tartibi", p: [
            "Tripod turniket — ofis va o'tish punkti uchun eng arzon variant: ZKTeco va Hikvision bazaviy modellari taxminan 4–6 mln so'mdan boshlanadi. Shisha qanotli tezkor o'tishlar (speed gate) ancha qimmat — bir o'tish uchun 15–20 mln so'mdan. To'liq bo'yli turniketlar perimetr va stadionlar uchun — eng yuqori narx toifasida.",
            "Turniketga deyarli har doim identifikatsiya qo'shiladi: karta o'qigich arzon, yuzni tanuvchi biometrik terminal (Face ID) esa 2,5–3 mln so'mdan. Toshkentda biznesga aynan «turniket + Face ID + ish vaqtini hisobga olish» kombinatsiyasi ko'proq kerak bo'ladi.",
          ] },
          { h: "«Kalit topshirish» narxi nimadan iborat", p: [
            "Yakuniy smeta — uskuna + montaj + ishga tushirish. Montajga polga mahkamlash, elektr ta'minoti, SKUD tizimiga ulash va o'tish stsenariylarini sozlash kiradi. O'rnatish bilan bitta tripod uchun taxminan 6–8 mln so'mdan mo'ljallang.",
            "Ish vaqtini hisobga olish kerak bo'lsa, dasturiy qism qo'shiladi: terminallarni dastur bilan integratsiya qilish va tabel yuklab olish. Buni ham o'sha loyihada bajaramiz.",
          ] },
          { h: "Qayerda tejash mumkin", p: [
            "Tripod yetadigan joyda speed gate uchun ortiqcha to'lamang: 100 nafargacha xodimli ofis uchun bu o'nlab million ortiqcha xarajat. Biometriyada tejash esa kerak emas — kartalar yo'qoladi va birovga beriladi, Face ID bu muammoni butunlay yopadi.",
            "Ikkinchi tejash — to'g'ri loyiha: o'tish nuqtalari soni va quvvat zaxirasi boshidan hisoblansa, keyin qayta ishlash kerak bo'lmaydi. Muhandis chiqishi va smeta bizda bepul.",
          ] },
          { h: "Keyingi qadam", p: [
            "Katalogdagi turniket va shlagbaumlarni ko'ring — narxlar so'mda, Toshkentda mavjud. O'tish punktingizni tasvirlab bering (xodimlar soni, eshik kengligi, vaqt hisobi kerakmi) — bir kunda aniq smeta bilan 2–3 variant taklif qilamiz.",
          ] },
        ],
        faq: [
          { q: "Eng arzon turniket qancha turadi?", a: "Boshlang'ich tripod turniket — uskuna uchun taxminan 4–6 mln so'mdan. O'rnatish va sozlash bilan — 6–8 mln so'mdan." },
          { q: "Face ID bilan turniket qancha?", a: "Turniket narxiga biometrik terminal qo'shiladi — har bir o'tish nuqtasiga 2,5–3 mln so'mdan. Ikki yo'nalish uchun ikkita terminal kerak." },
          { q: "O'rnatish qancha vaqt oladi?", a: "SKUD'ga ulangan bitta tripod — odatda 1 kun. Bir nechta o'tishli komplekslar — 2–5 kun." },
          { q: "Yuridik shaxslar bilan ishlaysizmi?", a: "Ha: shartnoma, schyot-faktura, QQS bilan ishlash, aktlar bilan topshirish. Birja maydonchalarida xaridlarda qatnashamiz." },
        ],
      },
      en: {
        title: "Turnstile Price in Tashkent: Supply and Installation Costs",
        excerpt: "Turnstile prices in 2026: tripod, swing, full-height and Face ID options. What a turnkey installation costs and where you can save.",
        sections: [
          { h: "Turnstile types and price ranges", p: [
            "A tripod turnstile is the most affordable option for an office entrance: basic ZKTeco and Hikvision models start at roughly 4–6 million UZS. Speed gates with glass wings cost noticeably more — from 15–20 million UZS per lane. Full-height turnstiles for perimeters and stadiums sit at the top of the range.",
            "Identification is almost always added: a card reader is inexpensive, while a facial-recognition terminal (Face ID) starts at 2.5–3 million UZS. The combination businesses in Tashkent need most is turnstile + Face ID + time attendance.",
          ] },
          { h: "What a turnkey price includes", p: [
            "The final estimate is equipment + installation + commissioning: floor mounting, power supply, connection to the access control system and pass-scenario setup. For one tripod installed, budget from 6–8 million UZS.",
            "If you need time attendance, a software part is added — terminal integration and timesheet export. We deliver it within the same project.",
          ] },
          { h: "Where you can save", p: [
            "Do not overpay for speed gates where a tripod is enough — for an office under 100 staff that is tens of millions of extra cost. Do not save on biometrics though: cards get lost and shared, Face ID closes that gap for good.",
            "The second saving is a correct design: plan the number of lanes and power reserve upfront. An engineer visit and estimate are free.",
          ] },
          { h: "Next step", p: [
            "Browse turnstiles and barrier gates in our catalog — prices in UZS, stock in Tashkent. Describe your entrance (headcount, doorway width, attendance needs) and we will propose 2–3 options with an exact quote within one day.",
          ] },
        ],
        faq: [
          { q: "How much is the cheapest turnstile?", a: "An entry-level tripod is about 4–6 million UZS for hardware, or 6–8 million UZS installed and configured." },
          { q: "How much is a turnstile with face recognition?", a: "Add a biometric terminal to the turnstile price — from 2.5–3 million UZS per lane; two directions need two terminals." },
          { q: "How long does installation take?", a: "One tripod connected to access control usually takes a day; multi-lane systems with attendance — 2–5 days." },
          { q: "Do you work with companies and tenders?", a: "Yes: contract, VAT invoicing, handover with acts, and participation in exchange-platform procurement." },
        ],
      },
      tr: {
        title: "Taşkent'te Turnike Fiyatları: Montaj Dahil Maliyetler",
        excerpt: "2026 turnike fiyatları: tripod, kanatlı, tam boy ve Face ID'li modeller. Anahtar teslim kurulum neye mal olur, nereden tasarruf edilir.",
        sections: [
          { h: "Turnike türleri ve fiyat aralıkları", p: [
            "Tripod turnike, ofis girişi için en ekonomik çözümdür: ZKTeco ve Hikvision'ın temel modelleri yaklaşık 4–6 milyon UZS'den başlar. Cam kanatlı hızlı geçişler (speed gate) belirgin şekilde daha pahalıdır — şerit başına 15–20 milyon UZS'den. Tam boy turnikeler fiyat aralığının üst sınırındadır.",
            "Turnikeye neredeyse her zaman kimlik doğrulama eklenir: kart okuyucu ucuzdur, yüz tanıma terminali (Face ID) ise 2,5–3 milyon UZS'den başlar. Taşkent'te işletmelerin en çok ihtiyaç duyduğu kombinasyon: turnike + Face ID + mesai takibi.",
          ] },
          { h: "Anahtar teslim fiyata neler dahil", p: [
            "Nihai teklif = ekipman + montaj + devreye alma: zemine sabitleme, güç beslemesi, geçiş kontrol sistemine bağlantı ve senaryo ayarları. Montajlı tek tripod için 6–8 milyon UZS'den bütçe ayırın.",
            "Mesai takibi gerekiyorsa yazılım kısmı eklenir — terminal entegrasyonu ve puantaj çıktısı. Bunu aynı proje içinde teslim ediyoruz.",
          ] },
          { h: "Nereden tasarruf edilir", p: [
            "Tripodun yeterli olduğu yerde speed gate için fazladan ödeme yapmayın. Biyometriden ise tasarruf etmeyin: kartlar kaybolur ve devredilir, Face ID bu açığı kalıcı olarak kapatır.",
            "İkinci tasarruf doğru projedir: şerit sayısı ve güç rezervi baştan planlanırsa yeniden işçilik gerekmez. Mühendis keşfi ve teklif ücretsizdir.",
          ] },
          { h: "Sonraki adım", p: [
            "Katalogdaki turnike ve bariyerlere göz atın — fiyatlar UZS cinsinden, stoklar Taşkent'te. Girişinizi tarif edin (personel sayısı, kapı genişliği, mesai takibi) — bir gün içinde net teklifle 2–3 seçenek sunalım.",
          ] },
        ],
        faq: [
          { q: "En uygun turnike ne kadar?", a: "Giriş seviyesi tripod, ekipman olarak yaklaşık 4–6 milyon UZS; montaj ve ayarlarla 6–8 milyon UZS'den." },
          { q: "Yüz tanımalı turnike ne kadar?", a: "Turnike fiyatına şerit başına 2,5–3 milyon UZS biyometrik terminal ekleyin; iki yön için iki terminal gerekir." },
          { q: "Montaj ne kadar sürer?", a: "Geçiş kontrolüne bağlı tek tripod genelde 1 gün; mesai takipli çok şeritli sistemler 2–5 gün." },
          { q: "Kurumsal ve ihale çalışıyor musunuz?", a: "Evet: sözleşme, KDV faturası, tutanaklarla teslim ve ihale platformlarında katılım." },
        ],
      },
      zh: {
        title: "塔什干闸机价格：设备与安装费用指南",
        excerpt: "2026年闸机价格：三辊闸、摆闸、全高闸及人脸识别方案。交钥匙安装的费用构成与省钱要点。",
        sections: [
          { h: "闸机类型与价格区间", p: [
            "三辊闸是办公楼入口最经济的方案：ZKTeco和海康威视基础型号约400–600万苏姆起。玻璃翼闸（速通门）明显更贵——每通道1500–2000万苏姆起。全高旋转闸用于周界和体育场，价格位于区间顶端。",
            "闸机几乎都要配识别设备：刷卡读头便宜，人脸识别终端（Face ID）每通道250–300万苏姆起。塔什干企业最常用的组合是：闸机＋人脸识别＋考勤。",
          ] },
          { h: "交钥匙价格包含什么", p: [
            "最终报价＝设备＋安装＋调试：地面固定、供电、接入门禁系统及通行方案设置。单台三辊闸含安装约600–800万苏姆起。",
            "如需考勤，还要加软件部分——终端对接与考勤表导出，我们在同一项目内交付。",
          ] },
          { h: "哪里可以省钱", p: [
            "三辊闸够用的场合不必为速通门多花钱；但不要在生物识别上省——卡片会丢失、转借，人脸识别彻底堵住这个漏洞。",
            "第二个省钱点是正确的方案设计：通道数量和电力冗余提前规划，就不用返工。工程师上门勘测与报价免费。",
          ] },
          { h: "下一步", p: [
            "欢迎浏览产品目录中的闸机和道闸——苏姆计价，塔什干现货。告诉我们入口情况（人数、门洞宽度、是否需要考勤），一天内给出2–3套方案与准确报价。",
          ] },
        ],
        faq: [
          { q: "最便宜的闸机多少钱？", a: "入门级三辊闸设备约400–600万苏姆；含安装调试600–800万苏姆起。" },
          { q: "人脸识别闸机多少钱？", a: "在闸机价格上加每通道250–300万苏姆的生物识别终端；双向通行需要两台终端。" },
          { q: "安装需要多久？", a: "接入门禁的单台三辊闸通常1天；带考勤的多通道系统2–5天。" },
          { q: "是否支持企业合作与招标？", a: "支持：签订合同、增值税发票、验收单据齐全，并参与交易所平台采购。" },
        ],
      },
    },
  },
  {
    slug: "domofon-narxi",
    date: "2026-08-20",
    related: ["intercom", "locks"],
    loc: {
      ru: {
        title: "Сколько стоит домофон с установкой в Ташкенте",
        excerpt: "Цены на аудио- и видеодомофоны в 2026 году: квартира, частный дом, офис и многоквартирный дом. Стоимость установки и что влияет на смету.",
        sections: [
          { h: "Порядок цен на домофоны", p: [
            "Простой аудиодомофон для квартиры — самый доступный вариант, от нескольких сотен тысяч сум. Видеодомофон с монитором (Hikvision, Dahua) — от 1,2–1,5 млн сум за комплект «вызывная панель + монитор». IP-видеодомофон с переадресацией звонка на смартфон — от 2–4 млн сум в зависимости от панели и числа мониторов.",
            "Для частного дома чаще берут комплект с уличной антивандальной панелью и электромеханическим замком или защёлкой — это ещё плюс 700 тысяч — 1,5 млн сум к смете.",
          ] },
          { h: "Стоимость установки", p: [
            "Монтаж зависит от готовности кабельных трасс: в новостройке с закладными — быстрее и дешевле, в готовом ремонте добавляется аккуратная прокладка кабеля. Ориентир по работам — от 300–500 тысяч сум за точку, точную цифру даёт смета после выезда инженера (выезд бесплатный).",
            "IP-домофония для офиса или многоквартирного дома считается проектно: панелей и мониторов больше, добавляется коммутатор с PoE и интеграция со СКУД — открытие двери по карте, коду или лицу.",
          ] },
          { h: "Что выбрать: аналог или IP", p: [
            "Аналоговый видеодомофон дешевле и полностью закрывает задачу «видеть и открывать». IP-домофон стоит дороже, но умеет главное для занятых людей: звонок приходит на телефон, где бы вы ни были, открыть дверь можно удалённо, а история вызовов сохраняется.",
            "Если планируете видеонаблюдение или СКУД — берите IP сразу: всё объединяется в одну систему, и не придётся менять оборудование через год.",
          ] },
          { h: "Что дальше", p: [
            "В каталоге — домофоны Hikvision и комплекты с ценами в сумах. Напишите, куда нужен домофон (квартира, дом, офис, подъезд) — подберём вариант и посчитаем установку за один день.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит видеодомофон для квартиры?", a: "Комплект «панель + монитор» — от 1,2–1,5 млн сум. С установкой — примерно плюс 300–500 тысяч сум." },
          { q: "Можно ли отвечать на звонки с телефона?", a: "Да, для этого нужен IP-домофон (например, Hikvision): звонок переадресуется в приложение, дверь открывается из любой точки мира." },
          { q: "Ставите ли домофоны в частные дома?", a: "Да: уличная антивандальная панель, монитор в доме, электромеханический замок на калитку. Кабель прокладываем аккуратно, под ключ." },
          { q: "Сколько занимает установка?", a: "Квартира или дом — обычно 2–4 часа. Офис или подъезд с несколькими мониторами — от одного дня, по проекту." },
        ],
      },
      uz: {
        title: "Domofon narxi qancha? Toshkentda o'rnatish bilan",
        excerpt: "2026-yilda audio va video domofonlar narxi: kvartira, hovli, ofis va ko'p qavatli uy uchun. O'rnatish qiymati va smetaga nima ta'sir qiladi.",
        sections: [
          { h: "Domofon narxlari tartibi", p: [
            "Kvartira uchun oddiy audiodomofon — eng arzon variant, bir necha yuz ming so'mdan. Monitorli videodomofon (Hikvision, Dahua) — «chaqiruv paneli + monitor» to'plami 1,2–1,5 mln so'mdan. Qo'ng'iroqni smartfonga yo'naltiruvchi IP-videodomofon — panel va monitorlar soniga qarab 2–4 mln so'mdan.",
            "Hovli uchun ko'pincha antivandal ko'cha paneli va elektromexanik qulf bilan to'plam olinadi — bu smetaga yana 700 ming — 1,5 mln so'm qo'shadi.",
          ] },
          { h: "O'rnatish qiymati", p: [
            "Montaj kabel trassalarining tayyorligiga bog'liq: yangi binoda tezroq va arzonroq, tayyor ta'mirda ehtiyotkor kabel yotqizish qo'shiladi. Ishlar bo'yicha mo'ljal — har bir nuqta uchun 300–500 ming so'mdan; aniq raqamni muhandis chiqishidan keyin smeta beradi (chiqish bepul).",
            "Ofis yoki ko'p qavatli uy uchun IP-domofoniya loyiha bo'yicha hisoblanadi: panellar ko'proq, PoE kommutator va SKUD bilan integratsiya qo'shiladi — eshikni karta, kod yoki yuz orqali ochish.",
          ] },
          { h: "Nimani tanlash: analog yoki IP", p: [
            "Analog videodomofon arzonroq va «ko'rish va ochish» vazifasini to'liq bajaradi. IP-domofon qimmatroq, lekin asosiy afzalligi bor: qo'ng'iroq qayerda bo'lsangiz ham telefoningizga keladi, eshikni masofadan ochish mumkin, chaqiruvlar tarixi saqlanadi.",
            "Videokuzatuv yoki SKUD rejalashtirilgan bo'lsa — darhol IP oling: hammasi bitta tizimga birlashadi va bir yildan keyin uskunani almashtirish kerak bo'lmaydi.",
          ] },
          { h: "Keyingi qadam", p: [
            "Katalogda — Hikvision domofonlari va to'plamlar, narxlar so'mda. Domofon qayerga kerakligini yozing (kvartira, hovli, ofis, podez) — bir kunda variant tanlab, o'rnatishni hisoblaymiz.",
          ] },
        ],
        faq: [
          { q: "Kvartira uchun videodomofon qancha turadi?", a: "«Panel + monitor» to'plami — 1,2–1,5 mln so'mdan. O'rnatish bilan — taxminan yana 300–500 ming so'm qo'shiladi." },
          { q: "Qo'ng'iroqqa telefondan javob berish mumkinmi?", a: "Ha, buning uchun IP-domofon kerak (masalan, Hikvision): qo'ng'iroq ilovaga yo'naltiriladi, eshikni istalgan joydan ochasiz." },
          { q: "Hovlilarga domofon o'rnatasizmi?", a: "Ha: antivandal ko'cha paneli, uyda monitor, darvozaga elektromexanik qulf. Kabelni ozoda yotqizamiz, kalit topshirish sharti bilan." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Kvartira yoki hovli — odatda 2–4 soat. Bir nechta monitorli ofis yoki podez — loyihaga qarab bir kundan." },
        ],
      },
      en: {
        title: "Intercom Price in Tashkent: Audio, Video and IP Systems",
        excerpt: "Audio and video intercom prices in 2026 for apartments, houses and offices. Installation costs and what drives the estimate.",
        sections: [
          { h: "Intercom price ranges", p: [
            "A simple audio intercom is the cheapest option, from a few hundred thousand UZS. A video intercom kit (door station + monitor) by Hikvision or Dahua starts at 1.2–1.5 million UZS. An IP video intercom that forwards calls to your smartphone runs from 2–4 million UZS depending on the panel and number of monitors.",
            "For a private house, a vandal-proof outdoor panel plus an electromechanical lock adds another 0.7–1.5 million UZS to the estimate.",
          ] },
          { h: "Installation cost", p: [
            "Labour depends on cable readiness: faster in new buildings with conduits, more careful routing in finished interiors. A working reference is 300–500 thousand UZS per point; the exact figure comes from a free engineer visit.",
            "Office and apartment-building IP intercom systems are calculated as projects: more panels and monitors, a PoE switch, and access-control integration — opening by card, code or face.",
          ] },
          { h: "Analog or IP", p: [
            "An analog video intercom is cheaper and fully covers see-and-open. IP costs more but calls reach your phone anywhere, the door opens remotely, and call history is stored.",
            "If CCTV or access control is planned, choose IP right away — everything merges into one system and nothing needs replacing a year later.",
          ] },
          { h: "Next step", p: [
            "Our catalog lists Hikvision intercoms and kits with UZS prices. Tell us where the intercom goes (apartment, house, office, building entrance) — we will pick an option and quote installation within a day.",
          ] },
        ],
        faq: [
          { q: "How much is a video intercom for an apartment?", a: "A panel + monitor kit is 1.2–1.5 million UZS; installation adds roughly 300–500 thousand UZS." },
          { q: "Can I answer calls from my phone?", a: "Yes — with an IP intercom (e.g. Hikvision) calls are forwarded to the app and you can open the door from anywhere." },
          { q: "Do you install intercoms in private houses?", a: "Yes: vandal-proof outdoor panel, indoor monitor, electromechanical gate lock — turnkey with neat cabling." },
          { q: "How long does installation take?", a: "An apartment or house — usually 2–4 hours. An office or building entrance with several monitors — from one day, per project." },
        ],
      },
      tr: {
        title: "Taşkent'te İnterkom (Diafon) Fiyatları ve Montaj",
        excerpt: "2026 sesli ve görüntülü diafon fiyatları: daire, müstakil ev ve ofis için. Montaj maliyeti ve teklifi neler etkiler.",
        sections: [
          { h: "Diafon fiyat aralıkları", p: [
            "Basit sesli diafon en ucuz seçenektir, birkaç yüz bin UZS'den başlar. Hikvision/Dahua görüntülü set (kapı paneli + monitör) 1,2–1,5 milyon UZS'den. Aramayı akıllı telefona yönlendiren IP görüntülü diafon, panele ve monitör sayısına göre 2–4 milyon UZS'den başlar.",
            "Müstakil ev için genelde darbeye dayanıklı dış panel ve elektromekanik kilitli set tercih edilir — teklife 0,7–1,5 milyon UZS daha ekler.",
          ] },
          { h: "Montaj maliyeti", p: [
            "İşçilik kablo altyapısına bağlıdır: yeni binada daha hızlı ve ucuz, bitmiş dekorasyonda özenli kablo çekimi eklenir. Nokta başına 300–500 bin UZS referans alın; kesin rakamı ücretsiz mühendis keşfi verir.",
            "Ofis ve apartman IP interkom sistemleri proje olarak hesaplanır: daha çok panel ve monitör, PoE switch ve geçiş kontrol entegrasyonu — kapıyı kart, şifre veya yüzle açma.",
          ] },
          { h: "Analog mu IP mi", p: [
            "Analog görüntülü diafon daha ucuzdur ve 'gör ve aç' işini tam karşılar. IP daha pahalıdır ama arama nerede olursanız olun telefonunuza gelir, kapı uzaktan açılır, arama geçmişi saklanır.",
            "Kamera veya geçiş kontrol planlanıyorsa baştan IP seçin — her şey tek sistemde birleşir.",
          ] },
          { h: "Sonraki adım", p: [
            "Katalogda Hikvision diafonlar ve setler UZS fiyatlarıyla listelidir. Diafonun nereye gerektiğini yazın (daire, ev, ofis, apartman girişi) — bir günde seçenek belirleyip montajı fiyatlandıralım.",
          ] },
        ],
        faq: [
          { q: "Daire için görüntülü diafon ne kadar?", a: "Panel + monitör seti 1,2–1,5 milyon UZS; montaj yaklaşık 300–500 bin UZS ekler." },
          { q: "Aramalara telefondan cevap verilir mi?", a: "Evet — IP diafonla (örn. Hikvision) arama uygulamaya yönlenir, kapıyı her yerden açarsınız." },
          { q: "Müstakil eve diafon kuruyor musunuz?", a: "Evet: dış darbeye dayanıklı panel, içeride monitör, bahçe kapısına elektromekanik kilit — anahtar teslim." },
          { q: "Montaj ne kadar sürer?", a: "Daire veya ev genelde 2–4 saat; birkaç monitörlü ofis veya apartman girişi projeye göre 1 günden itibaren." },
        ],
      },
      zh: {
        title: "塔什干可视对讲机价格：设备与安装",
        excerpt: "2026年音频与可视对讲价格：公寓、别墅与办公室方案。安装费用及影响报价的因素。",
        sections: [
          { h: "对讲机价格区间", p: [
            "公寓用普通音频对讲最便宜，几十万苏姆起。海康威视/大华可视对讲套装（门口机＋室内机）120–150万苏姆起。可将呼叫转到手机的IP可视对讲，视门口机与室内机数量200–400万苏姆起。",
            "别墅常选防暴力室外门口机加电机锁的套装——报价再加70–150万苏姆。",
          ] },
          { h: "安装费用", p: [
            "工费取决于布线条件：新楼有预埋管更快更省，精装房需要精细走线。参考价每点位30–50万苏姆；准确数字由免费上门勘测后的报价确定。",
            "办公楼与住宅楼的IP对讲按项目核算：门口机和室内机更多，需要PoE交换机并与门禁联动——刷卡、密码或人脸开门。",
          ] },
          { h: "选模拟还是IP", p: [
            "模拟可视对讲更便宜，完全满足\"看到并开门\"。IP更贵，但呼叫随时到手机、可远程开门、通话记录可查。",
            "若计划上监控或门禁，直接选IP——全部并入一套系统，一年后无需换设备。",
          ] },
          { h: "下一步", p: [
            "目录中有海康威视对讲机及套装，苏姆计价。告诉我们安装位置（公寓、别墅、办公室、单元门）——一天内选型并核算安装费。",
          ] },
        ],
        faq: [
          { q: "公寓可视对讲多少钱？", a: "门口机＋室内机套装120–150万苏姆；安装约再加30–50万苏姆。" },
          { q: "能用手机接听吗？", a: "可以——IP对讲（如海康威视）呼叫转到App，在任何地方都能开门。" },
          { q: "别墅能装吗？", a: "能：室外防暴力门口机、室内机、院门电机锁，走线整洁，交钥匙工程。" },
          { q: "安装要多久？", a: "公寓或别墅通常2–4小时；多室内机的办公楼或单元门按项目1天起。" },
        ],
      },
    },
  },
  {
    slug: "yongin-signalizatsiyasi-narxi",
    date: "2026-08-20",
    related: ["fire"],
    loc: {
      ru: {
        title: "Сколько стоит пожарная сигнализация в Ташкенте",
        excerpt: "Цена пожарной сигнализации под ключ в 2026 году: за точку и за объект, адресная и безадресная система, проект, монтаж и сдача МЧС.",
        sections: [
          { h: "От чего зависит цена", p: [
            "Стоимость складывается из проекта, оборудования (приёмно-контрольный прибор, извещатели, оповещатели, кабель) и монтажа. Главные множители — площадь объекта, высота потолков и тип системы: безадресная дешевле и подходит небольшим помещениям, адресная (Рубеж, Болид, Dahua) — стандарт для офисов, магазинов и складов, где важно видеть точное место срабатывания.",
            "Практичный ориентир — цена за точку (извещатель с кабелем и работами). Для небольшого офиса или магазина комплексная система под ключ обычно начинается от 5–10 млн сум, объекты от 500 м² считаются по проекту.",
          ] },
          { h: "Почему нельзя без проекта", p: [
            "Пожарная сигнализация — не «датчики на потолке», а система по нормам: количество и расстановка извещателей, зоны оповещения, резервное питание. Проект нужен и для сдачи объекта инспекции МЧС — без него систему не примут.",
            "У SAT Solutions есть лицензия на проектирование и монтаж: делаем проект, монтируем, пускаем и сдаём с актами — одна ответственная компания на весь цикл.",
          ] },
          { h: "Адресная или безадресная", p: [
            "Безадресная система показывает только шлейф, где сработал датчик — для помещения из пары комнат этого достаточно и дешевле. Адресная показывает конкретный извещатель, самодиагностируется и экономит кабель — на объектах от 10 помещений она быстро окупает разницу в цене.",
            "Для арендаторов в ТЦ и БЦ часто нужен стык с общей системой здания — согласуем протоколы и оборудование с управляющей компанией.",
          ] },
          { h: "Что дальше", p: [
            "Пришлите план помещения или просто площадь и назначение — за один день посчитаем смету по двум вариантам (адресная/безадресная) с оборудованием в наличии в Ташкенте.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит пожарная сигнализация для маленького офиса?", a: "Небольшой офис или магазин под ключ — обычно от 5–10 млн сум: проект, оборудование, монтаж и пусконаладка. Точную цифру даёт бесплатная смета." },
          { q: "Нужна ли лицензия для монтажа?", a: "Да, проектирование и монтаж пожарной сигнализации — лицензируемая деятельность. У нас лицензия есть, объект сдаём с полным пакетом документов." },
          { q: "Адресная система сильно дороже?", a: "Оборудование дороже, но кабеля и работ меньше. На объектах от 10 помещений итоговая разница небольшая, а эксплуатация заметно удобнее." },
          { q: "Делаете ли обслуживание?", a: "Да, ежемесячное ТО по договору: проверка извещателей, приборов и оповещения с отметками в журнале — как требуют нормы." },
        ],
      },
      uz: {
        title: "Yong'in signalizatsiyasi narxi qancha? Toshkentda",
        excerpt: "2026-yilda yong'in signalizatsiyasining «kalit topshirish» narxi: nuqta va obyekt bo'yicha, manzilli va manzilsiz tizim, loyiha, montaj va FVV'ga topshirish.",
        sections: [
          { h: "Narx nimaga bog'liq", p: [
            "Qiymat loyiha, uskuna (qabul-nazorat pribori, xabar bergichlar, ogohlantirgichlar, kabel) va montajdan iborat. Asosiy omillar — obyekt maydoni, ship balandligi va tizim turi: manzilsiz tizim arzonroq va kichik xonalarga mos, manzilli (Rubej, Bolid, Dahua) — ofis, do'kon va omborlar standarti, chunki qaysi datchik ishlaganini aniq ko'rsatadi.",
            "Amaliy mo'ljal — nuqta narxi (xabar bergich + kabel + ishlar). Kichik ofis yoki do'kon uchun tizim «kalit topshirish» sharti bilan odatda 5–10 mln so'mdan boshlanadi, 500 m² dan katta obyektlar loyiha bo'yicha hisoblanadi.",
          ] },
          { h: "Nega loyihasiz bo'lmaydi", p: [
            "Yong'in signalizatsiyasi — «shipdagi datchiklar» emas, balki me'yorlar bo'yicha tizim: xabar bergichlar soni va joylashuvi, ogohlantirish zonalari, zaxira quvvat. Loyiha FVV inspeksiyasiga topshirish uchun ham shart — usiz tizim qabul qilinmaydi.",
            "SAT Solutions'da loyihalash va montaj litsenziyasi bor: loyiha qilamiz, o'rnatamiz, ishga tushiramiz va aktlar bilan topshiramiz — butun sikl uchun bitta mas'ul kompaniya.",
          ] },
          { h: "Manzilli yoki manzilsiz", p: [
            "Manzilsiz tizim faqat qaysi shleyf ishlaganini ko'rsatadi — ikki-uch xonali joy uchun bu yetarli va arzonroq. Manzilli tizim aniq xabar bergichni ko'rsatadi, o'zini tekshiradi va kabelni tejaydi — 10 va undan ortiq xonali obyektlarda narx farqini tez qoplaydi.",
            "Savdo va biznes markazlaridagi ijarachilar uchun ko'pincha binoning umumiy tizimiga ulanish kerak — protokol va uskunani boshqaruvchi kompaniya bilan kelishamiz.",
          ] },
          { h: "Keyingi qadam", p: [
            "Xona rejasini yoki shunchaki maydon va vazifasini yuboring — bir kunda ikki variant bo'yicha smeta hisoblaymiz (manzilli/manzilsiz), uskunalar Toshkentda mavjud.",
          ] },
        ],
        faq: [
          { q: "Kichik ofis uchun yong'in signalizatsiyasi qancha turadi?", a: "Kichik ofis yoki do'kon «kalit topshirish» bilan — odatda 5–10 mln so'mdan: loyiha, uskuna, montaj va ishga tushirish. Aniq raqamni bepul smeta beradi." },
          { q: "Montaj uchun litsenziya kerakmi?", a: "Ha, yong'in signalizatsiyasini loyihalash va montaj qilish litsenziyalanadigan faoliyat. Bizda litsenziya bor, obyektni to'liq hujjatlar bilan topshiramiz." },
          { q: "Manzilli tizim ancha qimmatmi?", a: "Uskuna qimmatroq, lekin kabel va ish kamroq. 10+ xonali obyektlarda yakuniy farq katta emas, ekspluatatsiya esa ancha qulay." },
          { q: "Texnik xizmat ko'rsatasizmi?", a: "Ha, shartnoma bo'yicha oylik TX: xabar bergichlar, priborlar va ogohlantirishni jurnalga belgilagan holda tekshirish — me'yorlar talab qilganidek." },
        ],
      },
      en: {
        title: "Fire Alarm System Price in Tashkent: Turnkey Costs",
        excerpt: "Fire alarm cost in 2026: per detector and per site, addressable vs conventional, design, installation and handover to fire authorities.",
        sections: [
          { h: "What drives the price", p: [
            "The cost combines design, equipment (control panel, detectors, sounders, cable) and installation. Key multipliers are floor area, ceiling height and system type: conventional is cheaper and fits small premises; addressable (Rubezh, Bolid, Dahua) is the standard for offices, shops and warehouses where the exact alarm point matters.",
            "A practical reference is the price per point (detector with cable and labour). A small office or shop usually starts from 5–10 million UZS turnkey; sites over 500 m² are quoted per design.",
          ] },
          { h: "Why a design is mandatory", p: [
            "A fire alarm is not detectors on a ceiling but a system built to code: detector counts and spacing, notification zones, backup power. The design is also required for handover to the fire-safety inspection.",
            "SAT Solutions holds a design-and-installation licence: we design, install, commission and hand over with full documentation — one responsible contractor for the whole cycle.",
          ] },
          { h: "Addressable or conventional", p: [
            "A conventional system only shows the triggered loop — enough and cheaper for a couple of rooms. An addressable one identifies the exact detector, self-diagnoses and saves cable; from about 10 rooms it quickly pays back the price difference.",
            "Tenants in malls and business centres often need to tie into the building system — we align protocols and equipment with the management company.",
          ] },
          { h: "Next step", p: [
            "Send a floor plan, or just the area and purpose — within a day we will quote two options (addressable/conventional) with equipment in stock in Tashkent.",
          ] },
        ],
        faq: [
          { q: "How much is a fire alarm for a small office?", a: "A small office or shop turnkey usually starts from 5–10 million UZS: design, equipment, installation and commissioning. A free estimate gives the exact figure." },
          { q: "Is a licence required for installation?", a: "Yes, fire alarm design and installation are licensed activities. We hold the licence and hand over sites with a complete document package." },
          { q: "Is an addressable system much more expensive?", a: "Hardware costs more but needs less cable and labour. From ~10 rooms the total difference is small while operation is far more convenient." },
          { q: "Do you provide maintenance?", a: "Yes, monthly contract service: checking detectors, panels and notification with journal records, as regulations require." },
        ],
      },
      tr: {
        title: "Taşkent'te Yangın Alarm Sistemi Fiyatları",
        excerpt: "2026 anahtar teslim yangın alarmı maliyeti: nokta ve tesis bazında, adresli/adressiz sistem, proje, montaj ve itfaiye teslimi.",
        sections: [
          { h: "Fiyatı ne belirler", p: [
            "Maliyet; proje, ekipman (kontrol paneli, dedektörler, sirenler, kablo) ve montajdan oluşur. Ana çarpanlar: alan, tavan yüksekliği ve sistem tipi. Adressiz sistem küçük mekânlara uygun ve ucuzdur; adresli (Rubezh, Bolid, Dahua) ofis, mağaza ve depoların standardıdır — alarmın tam yerini gösterir.",
            "Pratik referans nokta fiyatıdır (dedektör + kablo + işçilik). Küçük ofis/mağaza anahtar teslim genelde 5–10 milyon UZS'den başlar; 500 m² üzeri tesisler projeye göre fiyatlanır.",
          ] },
          { h: "Neden projesiz olmaz", p: [
            "Yangın alarmı tavandaki dedektörler değil, standartlara göre kurulan bir sistemdir: dedektör sayısı ve yerleşimi, anons bölgeleri, yedek besleme. Proje, itfaiye denetimine teslim için de zorunludur.",
            "SAT Solutions proje ve montaj lisansına sahiptir: projelendirir, kurar, devreye alır ve tam evrakla teslim ederiz — tüm süreçte tek sorumlu firma.",
          ] },
          { h: "Adresli mi adressiz mi", p: [
            "Adressiz sistem sadece tetiklenen hattı gösterir — birkaç odalık yer için yeterli ve daha ucuz. Adresli sistem dedektörü tek tek tanır, kendini test eder ve kablodan tasarruf sağlar; 10+ odalı tesislerde fark hızla amorti olur.",
            "AVM ve iş merkezlerindeki kiracılar için bina ana sistemiyle entegrasyon gerekir — protokolleri yönetimle koordine ederiz.",
          ] },
          { h: "Sonraki adım", p: [
            "Kat planını veya sadece alan ve kullanım amacını gönderin — bir günde iki seçenekli (adresli/adressiz) teklif hazırlayalım; ekipman Taşkent'te stokta.",
          ] },
        ],
        faq: [
          { q: "Küçük ofis için yangın alarmı ne kadar?", a: "Küçük ofis/mağaza anahtar teslim genelde 5–10 milyon UZS'den: proje, ekipman, montaj, devreye alma. Kesin rakam ücretsiz keşifle." },
          { q: "Montaj için lisans gerekli mi?", a: "Evet, yangın alarmı proje ve montajı lisanslı iştir. Lisansımız mevcut, tesisi tam evrak paketiyle teslim ederiz." },
          { q: "Adresli sistem çok mu pahalı?", a: "Ekipman daha pahalı ama kablo ve işçilik daha az. 10+ odada toplam fark küçük, işletme ise çok daha rahat." },
          { q: "Bakım yapıyor musunuz?", a: "Evet, sözleşmeli aylık bakım: dedektör, panel ve anons testleri kayıt defteriyle — mevzuatın istediği gibi." },
        ],
      },
      zh: {
        title: "塔什干火灾报警系统价格：交钥匙费用",
        excerpt: "2026年火灾报警造价：按点位与项目计价，总线制与多线制对比，设计、施工及消防验收。",
        sections: [
          { h: "价格由什么决定", p: [
            "费用由设计、设备（控制主机、探测器、声光报警器、线缆）和施工构成。关键因素是面积、层高和系统类型：多线制便宜、适合小场所；总线制（Rubezh、Bolid、大华）是办公、商铺和仓库的标准——能精确显示报警点位。",
            "实用的参考是点位价（探测器＋线缆＋工费）。小型办公室或商铺交钥匙通常500–1000万苏姆起；500㎡以上按设计方案报价。",
          ] },
          { h: "为什么必须有设计", p: [
            "火灾报警不是\"天花板上装探头\"，而是按规范建设的系统：探测器数量与布点、广播分区、备用电源。设计文件也是消防部门验收的必要条件。",
            "SAT Solutions持有设计与施工资质：设计、安装、调试并出具全套文件验收——全流程一家负责。",
          ] },
          { h: "总线制还是多线制", p: [
            "多线制只显示报警回路——两三个房间够用且便宜。总线制精确到探测器、可自检、省线缆；10个房间以上很快抵消差价。",
            "商场写字楼的租户常需接入大楼总系统——我们与物业协调协议与设备。",
          ] },
          { h: "下一步", p: [
            "发来平面图，或告知面积与用途——一天内给出总线/多线两套报价，设备塔什干现货。",
          ] },
        ],
        faq: [
          { q: "小办公室的火灾报警多少钱？", a: "小型办公或商铺交钥匙通常500–1000万苏姆起：含设计、设备、施工与调试。免费勘测出准确报价。" },
          { q: "施工需要资质吗？", a: "需要，火灾报警设计与施工是许可经营项目。我们持有资质，验收文件齐全。" },
          { q: "总线制贵很多吗？", a: "设备贵一些，但线缆和工费更少。10个房间以上总差价不大，使用体验好得多。" },
          { q: "提供维保吗？", a: "提供：合同制月度维保，按规范测试探测器、主机与广播并记录台账。" },
        ],
      },
    },
  },
  {
    slug: "videoregistrator-narxi",
    date: "2026-08-20",
    related: ["cctv"],
    loc: {
      ru: {
        title: "Сколько стоит видеорегистратор для камер в Ташкенте",
        excerpt: "Цены на NVR и DVR в 2026 году: 4, 8 и 16 каналов, с PoE и без, сколько добавит жёсткий диск и как не ошибиться с выбором под свои камеры.",
        sections: [
          { h: "Порядок цен: NVR и DVR", p: [
            "Сетевые регистраторы (NVR) для IP-камер: 4-канальные — примерно от 800 тысяч до 1,5 млн сум, 8-канальные — 1,5–3 млн сум, 16-канальные — от 3 млн сум. Модели со встроенным PoE-коммутатором дороже, но избавляют от отдельного свитча и блоков питания — для 4–8 камер это чаще всего выгоднее.",
            "DVR для аналоговых (Turbo HD/HDCVI) камер традиционно дешевле NVR на ту же канальность — рабочий вариант, если камеры уже аналоговые и менять их пока не планируете.",
          ] },
          { h: "Не забудьте про диск", p: [
            "Регистратор продаётся без жёсткого диска. Для видеонаблюдения нужны специализированные HDD — WD Purple или Seagate SkyHawk: 1 ТБ — от ~450–600 тысяч сум, 4 ТБ — 1,5–2 млн сум. Обычный «компьютерный» диск в регистраторе живёт заметно меньше.",
            "Объём считается от числа камер, разрешения и глубины архива: 4 камеры по 4 Мп с архивом 14 дней — это примерно 4 ТБ. Посчитаем точно под вашу задачу — бесплатно.",
          ] },
          { h: "Как выбрать канальность", p: [
            "Берите регистратор с запасом хотя бы на 2 канала: камеры почти всегда добавляются. Смотрите не только на число каналов, но и на входящий битрейт и поддержку разрешения — дешёвый 8-канальник может не «переварить» восемь камер по 8 Мп.",
            "Для дома и малого бизнеса достаточно серии HiLook или базовых Hikvision/Dahua; для складов и производств с аналитикой — старшие серии с AcuSense/WizSense.",
          ] },
          { h: "Что дальше", p: [
            "В каталоге — видеорегистраторы Hikvision, Dahua и HiLook с ценами в сумах и наличием в Ташкенте. Напишите, сколько у вас камер и какой нужен архив — подберём регистратор и диск за один день.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит регистратор на 4 камеры?", a: "4-канальный NVR — примерно от 800 тысяч сум, с встроенным PoE — от 1,2–1,5 млн сум. Плюс жёсткий диск от ~500 тысяч сум." },
          { q: "Подойдёт ли обычный жёсткий диск?", a: "Работать будет, но недолго: диски видеонаблюдения (WD Purple, SkyHawk) рассчитаны на круглосуточную запись и живут в разы дольше." },
          { q: "NVR или DVR — что выбрать?", a: "Для IP-камер — только NVR. DVR имеет смысл, если у вас уже стоят аналоговые камеры и задача — заменить только регистратор." },
          { q: "Поможете перенести архив и настроить телефон?", a: "Да: настраиваем запись, доступ с телефона (Hik-Connect, DMSS), уведомления и при необходимости переносим настройки со старого регистратора." },
        ],
      },
      uz: {
        title: "Videoregistrator narxi qancha? NVR va DVR, Toshkent",
        excerpt: "2026-yilda NVR va DVR narxlari: 4, 8 va 16 kanal, PoE bilan va usiz, qattiq disk qancha qo'shadi va kameralarga mos registratorni qanday tanlash.",
        sections: [
          { h: "Narxlar tartibi: NVR va DVR", p: [
            "IP-kameralar uchun tarmoq registratorlari (NVR): 4 kanalli — taxminan 800 ming — 1,5 mln so'm, 8 kanalli — 1,5–3 mln so'm, 16 kanalli — 3 mln so'mdan. Ichki PoE kommutatorli modellar qimmatroq, lekin alohida switch va quvvat bloklarini talab qilmaydi — 4–8 kamera uchun ko'pincha shu foydali.",
            "Analog (Turbo HD/HDCVI) kameralar uchun DVR odatda xuddi shu kanalli NVR'dan arzonroq — kameralaringiz analog bo'lsa va hozircha almashtirmoqchi bo'lmasangiz, ishchi variant.",
          ] },
          { h: "Diskni unutmang", p: [
            "Registrator qattiq disksiz sotiladi. Videokuzatuv uchun maxsus HDD kerak — WD Purple yoki Seagate SkyHawk: 1 TB — ~450–600 ming so'mdan, 4 TB — 1,5–2 mln so'm. Oddiy «kompyuter» diski registratorda ancha kam yashaydi.",
            "Hajm kameralar soni, aniqlik va arxiv chuqurligidan hisoblanadi: 4 Mp'li 4 kamera 14 kunlik arxiv bilan — taxminan 4 TB. Vazifangizga aniq hisoblab beramiz — bepul.",
          ] },
          { h: "Kanallar sonini qanday tanlash", p: [
            "Kamida 2 kanal zaxira bilan oling: kameralar deyarli har doim qo'shiladi. Faqat kanallar soniga emas, kiruvchi bitreyt va aniqlik qo'llab-quvvatlashiga ham qarang — arzon 8 kanallik 8 Mp'li sakkiz kamerani «hazm qilmasligi» mumkin.",
            "Uy va kichik biznes uchun HiLook yoki bazaviy Hikvision/Dahua yetarli; analitikali ombor va ishlab chiqarishlar uchun — AcuSense/WizSense'li katta seriyalar.",
          ] },
          { h: "Keyingi qadam", p: [
            "Katalogda — Hikvision, Dahua va HiLook videoregistratorlari, narxlar so'mda, Toshkentda mavjud. Nechta kamera va qanday arxiv kerakligini yozing — bir kunda registrator va diskni tanlab beramiz.",
          ] },
        ],
        faq: [
          { q: "4 kamera uchun registrator qancha turadi?", a: "4 kanalli NVR — taxminan 800 ming so'mdan, ichki PoE bilan — 1,2–1,5 mln so'mdan. Qo'shimcha qattiq disk ~500 ming so'mdan." },
          { q: "Oddiy qattiq disk to'g'ri keladimi?", a: "Ishlaydi, lekin uzoq emas: videokuzatuv disklari (WD Purple, SkyHawk) kecha-kunduz yozishga mo'ljallangan va bir necha barobar uzoq xizmat qiladi." },
          { q: "NVR yoki DVR — qaysi birini tanlash?", a: "IP-kameralar uchun — faqat NVR. DVR analog kameralaringiz bo'lsa va faqat registratorni almashtirish kerak bo'lsa mantiqli." },
          { q: "Telefonni sozlab berasizmi?", a: "Ha: yozishni, telefondan kirishni (Hik-Connect, DMSS), bildirishnomalarni sozlaymiz va kerak bo'lsa eski registratordan sozlamalarni ko'chiramiz." },
        ],
      },
      en: {
        title: "NVR and DVR Price in Tashkent: Video Recorder Costs",
        excerpt: "NVR and DVR prices in 2026: 4, 8 and 16 channels, with or without PoE, what the hard drive adds and how to match a recorder to your cameras.",
        sections: [
          { h: "Price ranges: NVR and DVR", p: [
            "Network recorders (NVR) for IP cameras: 4-channel — roughly 0.8–1.5 million UZS, 8-channel — 1.5–3 million UZS, 16-channel — from 3 million UZS. Models with a built-in PoE switch cost more but remove the separate switch and PSUs — usually the better deal for 4–8 cameras.",
            "A DVR for analog (Turbo HD/HDCVI) cameras is traditionally cheaper than an NVR of the same channel count — a solid choice if your cameras are already analog.",
          ] },
          { h: "Do not forget the drive", p: [
            "Recorders ship without a hard drive. Surveillance needs purpose-built HDDs — WD Purple or Seagate SkyHawk: 1 TB from ~450–600 thousand UZS, 4 TB about 1.5–2 million UZS. A regular desktop drive lasts far less in a recorder.",
            "Capacity depends on camera count, resolution and archive depth: four 4 MP cameras with a 14-day archive need about 4 TB. We calculate it for your case free of charge.",
          ] },
          { h: "Choosing the channel count", p: [
            "Take at least 2 spare channels — cameras almost always get added. Check incoming bitrate and resolution support, not just channels: a cheap 8-channel unit may not handle eight 8 MP cameras.",
            "For homes and small business, HiLook or entry Hikvision/Dahua series are enough; for warehouses and production with analytics — higher series with AcuSense/WizSense.",
          ] },
          { h: "Next step", p: [
            "Our catalog lists Hikvision, Dahua and HiLook recorders with UZS prices and Tashkent stock. Tell us how many cameras and what archive you need — we will match a recorder and drive within a day.",
          ] },
        ],
        faq: [
          { q: "How much is a recorder for 4 cameras?", a: "A 4-channel NVR from about 800 thousand UZS; with built-in PoE from 1.2–1.5 million UZS, plus a hard drive from ~500 thousand UZS." },
          { q: "Will a regular hard drive work?", a: "It will, but not for long: surveillance drives (WD Purple, SkyHawk) are built for 24/7 recording and last several times longer." },
          { q: "NVR or DVR — which one?", a: "For IP cameras — only NVR. A DVR makes sense when analog cameras are already installed and only the recorder needs replacing." },
          { q: "Do you set up phone access?", a: "Yes: recording, mobile access (Hik-Connect, DMSS), notifications, and settings migration from an old recorder if needed." },
        ],
      },
      tr: {
        title: "Taşkent'te NVR ve DVR Kayıt Cihazı Fiyatları",
        excerpt: "2026 NVR/DVR fiyatları: 4, 8 ve 16 kanal, PoE seçenekleri, hard diskin maliyeti ve kameralara uygun cihaz seçimi.",
        sections: [
          { h: "Fiyat aralıkları: NVR ve DVR", p: [
            "IP kameralar için ağ kayıt cihazları (NVR): 4 kanal 0,8–1,5 milyon UZS, 8 kanal 1,5–3 milyon UZS, 16 kanal 3 milyon UZS'den. Dahili PoE'li modeller daha pahalıdır ama ayrı switch ve adaptörleri ortadan kaldırır — 4–8 kamera için çoğu zaman daha avantajlıdır.",
            "Analog (Turbo HD/HDCVI) kameralar için DVR, aynı kanal sayısındaki NVR'dan geleneksel olarak ucuzdur.",
          ] },
          { h: "Diski unutmayın", p: [
            "Kayıt cihazı disksiz satılır. Güvenlik kaydı için özel HDD gerekir — WD Purple veya Seagate SkyHawk: 1 TB ~450–600 bin UZS'den, 4 TB 1,5–2 milyon UZS. Normal bilgisayar diski kayıt cihazında çok daha kısa ömürlüdür.",
            "Kapasite; kamera sayısı, çözünürlük ve arşiv derinliğine göre hesaplanır: 4 MP dört kamera, 14 günlük arşiv ≈ 4 TB. Sizin için ücretsiz hesaplarız.",
          ] },
          { h: "Kanal sayısı seçimi", p: [
            "En az 2 kanal yedekle alın — kameralar hep eklenir. Sadece kanal sayısına değil, gelen bit hızına ve çözünürlük desteğine bakın: ucuz bir 8 kanallı, 8 MP sekiz kamerayı kaldıramayabilir.",
            "Ev ve küçük işletmeye HiLook veya giriş seviyesi Hikvision/Dahua yeter; analitikli depo ve üretim için AcuSense/WizSense üst seriler.",
          ] },
          { h: "Sonraki adım", p: [
            "Katalogda Hikvision, Dahua ve HiLook kayıt cihazları UZS fiyatları ve Taşkent stoklarıyla listeli. Kaç kameranız ve nasıl arşiv gerektiğini yazın — bir günde cihaz ve disk seçelim.",
          ] },
        ],
        faq: [
          { q: "4 kamera için kayıt cihazı ne kadar?", a: "4 kanallı NVR yaklaşık 800 bin UZS'den, dahili PoE'li 1,2–1,5 milyon UZS'den; artı ~500 bin UZS'den hard disk." },
          { q: "Normal hard disk olur mu?", a: "Çalışır ama kısa ömürlü olur: güvenlik diskleri (WD Purple, SkyHawk) 7/24 kayda göre tasarlanmıştır ve kat kat uzun dayanır." },
          { q: "NVR mi DVR mi?", a: "IP kameralarda yalnız NVR. DVR, mevcut analog kameralarda sadece kayıt cihazı değişecekse mantıklıdır." },
          { q: "Telefon erişimini kuruyor musunuz?", a: "Evet: kayıt, mobil erişim (Hik-Connect, DMSS), bildirimler ve gerekirse eski cihazdan ayar aktarımı." },
        ],
      },
      zh: {
        title: "塔什干录像机价格：NVR与DVR选购指南",
        excerpt: "2026年NVR/DVR价格：4路、8路、16路，带PoE与否，硬盘要加多少钱，以及如何按摄像机选型。",
        sections: [
          { h: "价格区间：NVR与DVR", p: [
            "IP摄像机用网络录像机（NVR）：4路约80–150万苏姆，8路150–300万苏姆，16路300万苏姆起。内置PoE的型号更贵，但省去独立交换机和电源——4–8路摄像机通常更划算。",
            "模拟（Turbo HD/HDCVI）摄像机用DVR，同路数一般比NVR便宜——若现有模拟摄像机暂不更换，是务实之选。",
          ] },
          { h: "别忘了硬盘", p: [
            "录像机不含硬盘。监控需要专用盘——WD Purple或希捷SkyHawk：1TB约45–60万苏姆，4TB约150–200万苏姆。普通电脑硬盘在录像机里寿命短得多。",
            "容量按摄像机数量、分辨率和存档天数计算：4台400万像素、存14天≈4TB。我们免费为您精确核算。",
          ] },
          { h: "如何选路数", p: [
            "至少留2路余量——摄像机几乎总会加装。除路数外还要看接入码流与分辨率支持：便宜的8路机可能带不动8台800万像素。",
            "家庭与小微企业选HiLook或海康/大华入门系列即可；带智能分析的仓库与工厂选AcuSense/WizSense高端系列。",
          ] },
          { h: "下一步", p: [
            "目录中有海康威视、大华与HiLook录像机，苏姆计价、塔什干现货。告诉我们摄像机数量与存档需求——一天内选好录像机与硬盘。",
          ] },
        ],
        faq: [
          { q: "4路录像机多少钱？", a: "4路NVR约80万苏姆起，内置PoE的120–150万苏姆起；另加约50万苏姆起的硬盘。" },
          { q: "普通硬盘能用吗？", a: "能用但不耐久：监控盘（WD Purple、SkyHawk）为7×24录像设计，寿命长数倍。" },
          { q: "选NVR还是DVR？", a: "IP摄像机只能配NVR；已有模拟摄像机且只换录像机时选DVR。" },
          { q: "帮忙设置手机观看吗？", a: "帮：配置录像、手机端（Hik-Connect、DMSS）、消息推送，需要时迁移旧机设置。" },
        ],
      },
    },
  },
  {
    slug: "yongin-xavfsizligi",
    date: "2026-08-26",
    related: ["fire", "pa"],
    loc: {
      uz: {
        title: "Yong'in xavfsizligi: biznes uchun talablar, tizimlar va narxlar",
        excerpt: "Obyekt uchun yong'in xavfsizligi nimadan iborat: signalizatsiya, ovozli ogohlantirish, o't o'chirgichlar. Tekshiruvga nima kerak va bularning barchasi qancha turadi.",
        sections: [
          { h: "Yong'in xavfsizligi tizimi nimadan iborat", p: [
            "To'liq tizim to'rt qismdan tuziladi: yong'in signalizatsiyasi (tutun va harorat datchiklari, qabul-nazorat priborlari), ovozli ogohlantirish va evakuatsiya boshqaruvi (SOUE), birlamchi o't o'chirish vositalari — o't o'chirgichlar va yong'in shkaflari — hamda evakuatsiya yo'llarining belgilari va yoritilishi.",
            "Kichik ofisga ko'pincha signalizatsiya va o't o'chirgichlar yetarli. Do'kon, ombor, sex yoki odam ko'p yig'iladigan joylarda SOUE ham talab qilinadi — bu tekshiruvda birinchi so'raladigan narsalardan biri.",
          ] },
          { h: "Biznes uchun qanday talablar bor", p: [
            "Har qanday tijorat obyekti yong'in xavfsizligi talablariga javob berishi kerak: ishlaydigan signalizatsiya, muddati o'tmagan o't o'chirgichlar, bo'sh evakuatsiya yo'llari va mas'ul xodim. Tekshiruvchi hujjatlarni ham so'raydi: tizim loyihasi, xizmat ko'rsatish shartnomasi, o't o'chirgichlar jurnali.",
            "Eng ko'p uchraydigan xatolar — muddati o'tgan o't o'chirgichlar, ishlamaydigan datchiklar va evakuatsiya chiqishi oldidagi omborga aylangan yo'laklar. Bularning barchasi jarima va faoliyatni to'xtatib qo'yishgacha olib borishi mumkin.",
          ] },
          { h: "Yong'in signalizatsiyasi qancha turadi", p: [
            "Narx xonalar soni va maydonga bog'liq: datchiklar soni, kabel uzunligi va priborning turi shundan kelib chiqadi. Kichik ofis (3–5 xona) uchun to'plam o'rnatish bilan odatda bir necha million so'mdan boshlanadi; ombor va sexlarda maydon katta bo'lgani uchun smeta obyekt bo'yicha hisoblanadi.",
            "Muhandisning chiqishi va smeta bizda bepul: obyektni ko'rib, datchiklarni rejalashtirib, aniq narxni bir kunda beramiz. Rubezh, Bolid va Hikvision uskunalari Toshkentdagi ombordan.",
          ] },
          { h: "O't o'chirgichlar: qaysi va qancha", p: [
            "Ofis va do'kon uchun standart tanlov — kukunli OP-4/OP-5 o't o'chirgichlar, elektronika ko'p joyda uglekislotali OU ham qo'yiladi. Narxlar hajmga qarab bir necha yuz ming so'mdan boshlanadi, katta OP-25/OP-100 modellari qimmatroq.",
            "Katalogimizda o't o'chirgichlar va yong'in xavfsizligi vositalari mavjud — narxlar so'mda, Toshkentda ombordan. Soni bo'yicha maslahat beramiz: maydon va xavf toifasiga qarab nechta va qayerga qo'yish kerakligini hisoblaymiz.",
          ] },
          { h: "Qanday buyurtma qilinadi", p: [
            "Ish tartibi oddiy: muhandis chiqadi, obyektni o'lchaydi, loyiha va smeta tayyorlaydi. Montaj kichik obyektda 1–3 kun. Ishdan so'ng hujjatlar to'liq topshiriladi: aktlar, sxemalar, jurnal — tekshiruvga tayyor holda.",
            "Yuridik shaxslar bilan shartnoma, hisob-faktura va NDS bilan ishlaymiz. Uskunaga rasmiy kafolat, montajga kompaniya kafolati beriladi.",
          ] },
        ],
        faq: [
          { q: "Yong'in signalizatsiyasi narxi qancha?", a: "Kichik ofis uchun to'plam o'rnatish bilan bir necha million so'mdan boshlanadi. Aniq narx xonalar soni va maydonga bog'liq — muhandis chiqishi va smeta bepul." },
          { q: "Tekshiruvga nima tayyorlash kerak?", a: "Ishlaydigan signalizatsiya, muddati o'tmagan o't o'chirgichlar, bo'sh evakuatsiya yo'llari va hujjatlar: loyiha, xizmat shartnomasi, o't o'chirgichlar jurnali. Yetishmayotganini bir chiqishda aniqlab beramiz." },
          { q: "O't o'chirgich qancha turadi?", a: "Kukunli OP-4/OP-5 — bir necha yuz ming so'mdan. Katalogda mavjud, soni bo'yicha maydonga qarab maslahat beramiz." },
          { q: "Montaj qancha vaqt oladi?", a: "Kichik ofis — 1–3 kun. Ombor va katta obyektlarda muddat loyihaga bog'liq, smetada aniq ko'rsatiladi." },
          { q: "Hujjatlar bilan yordam berasizmi?", a: "Ha: loyiha, montaj aktlari, sxemalar va jurnal — to'liq topshiriladi. Yuridik shaxslar bilan NDS va shartnoma asosida ishlaymiz." },
        ],
      },
      ru: {
        title: "Пожарная безопасность объекта: системы, требования и цены",
        excerpt: "Из чего состоит пожарная безопасность бизнеса: сигнализация, оповещение, огнетушители. Что спросят на проверке и сколько это стоит в Ташкенте.",
        sections: [
          { h: "Из чего состоит система пожарной безопасности", p: [
            "Полная система складывается из четырёх частей: пожарная сигнализация (дымовые и тепловые датчики, приёмно-контрольный прибор), система оповещения и управления эвакуацией (СОУЭ), первичные средства пожаротушения — огнетушители и пожарные шкафы — и обозначенные, освещённые пути эвакуации.",
            "Небольшому офису часто достаточно сигнализации и огнетушителей. В магазине, на складе, в цехе и везде, где собираются люди, требуется и СОУЭ — это одно из первого, что смотрят на проверке.",
          ] },
          { h: "Какие требования к бизнесу", p: [
            "Любой коммерческий объект должен отвечать требованиям пожарной безопасности: работающая сигнализация, огнетушители с действующим сроком, свободные пути эвакуации и ответственный сотрудник. Проверяющий спросит и документы: проект системы, договор на обслуживание, журнал огнетушителей.",
            "Самые частые нарушения — просроченные огнетушители, неработающие датчики и заставленные проходы к эвакуационным выходам. Всё это грозит штрафами вплоть до приостановки деятельности.",
          ] },
          { h: "Сколько стоит пожарная сигнализация", p: [
            "Цена зависит от числа помещений и площади: от этого считаются датчики, кабель и тип прибора. Комплект для небольшого офиса (3–5 комнат) с установкой обычно начинается от нескольких миллионов сум; для складов и цехов смета считается по объекту.",
            "Выезд инженера и смета у нас бесплатные: осмотрим объект, распланируем датчики и назовём точную цену за день. Оборудование Rubezh, Bolid и Hikvision — со склада в Ташкенте.",
          ] },
          { h: "Огнетушители: какие и почём", p: [
            "Стандартный выбор для офиса и магазина — порошковые ОП-4/ОП-5, там, где много электроники, ставят и углекислотные ОУ. Цены начинаются от нескольких сотен тысяч сум в зависимости от объёма, крупные ОП-25/ОП-100 дороже.",
            "Огнетушители и средства пожарной безопасности есть в нашем каталоге — цены в сумах, со склада в Ташкенте. Подскажем по количеству: посчитаем, сколько и куда ставить по площади и категории риска.",
          ] },
          { h: "Как заказать", p: [
            "Порядок простой: инженер выезжает, обмеряет объект, готовит проект и смету. Монтаж на небольшом объекте — 1–3 дня. После работ передаём полный пакет документов: акты, схемы, журнал — в готовом для проверки виде.",
            "С юрлицами работаем по договору, со счетами-фактурами и НДС. На оборудование — официальная гарантия, на монтаж — гарантия компании.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит пожарная сигнализация для офиса?", a: "Комплект для небольшого офиса с установкой — от нескольких миллионов сум. Точная цена зависит от числа помещений — выезд инженера и смета бесплатные." },
          { q: "Что подготовить к проверке?", a: "Работающую сигнализацию, огнетушители с действующим сроком, свободные пути эвакуации и документы: проект, договор обслуживания, журнал огнетушителей. Чего не хватает — определим за один выезд." },
          { q: "Сколько стоит огнетушитель?", a: "Порошковые ОП-4/ОП-5 — от нескольких сотен тысяч сум. Есть в каталоге, по количеству проконсультируем исходя из площади." },
          { q: "Сколько занимает монтаж?", a: "Небольшой офис — 1–3 дня. На складах и крупных объектах срок зависит от проекта и указывается в смете." },
          { q: "Помогаете с документами?", a: "Да: проект, акты монтажа, схемы и журнал передаются полным пакетом. С юрлицами работаем с НДС по договору." },
        ],
      },
    },
  },
  {
    slug: "lokal-tarmoq-narxi",
    date: "2026-08-26",
    related: ["network", "wifi", "fiber"],
    loc: {
      uz: {
        title: "Lokal tarmoq o'rnatish: ofis uchun narxi va bosqichlar",
        excerpt: "Ofisda kompyuter tarmog'i (SKS) qancha turadi: kabel, rozetkalar, kommutator va Wi-Fi. Narx nimaga bog'liq va ish qanday bosqichlarda bajariladi.",
        sections: [
          { h: "Lokal tarmoq nimadan iborat", p: [
            "Ofis tarmog'i — bu strukturali kabel tizimi (SKS): har bir ish o'rniga vitaya para kabeli, rozetkalar, patch-panel va server shkafi. Markazida kommutator turadi, internetni router taqsimlaydi, simsiz qurilmalar uchun Wi-Fi nuqtalari qo'shiladi.",
            "To'g'ri qurilgan tarmoqda printer, kamera, IP-telefon va kompyuterlar bitta tizimda ishlaydi. Keyinchalik videokuzatuv yoki telefoniya qo'shish ham oson bo'ladi — kabel allaqachon bor.",
          ] },
          { h: "Narx nimaga bog'liq", p: [
            "Uchta asosiy omil: ish o'rinlari soni, kabel trassalarining uzunligi va obyekt holati. Yangi qurilishda kabel yotqizish oson va arzon; ta'miri tugagan ofisda gofra, korobkalar va ehtiyotkor ish kerak — bu vaqtni oshiradi.",
            "Kabel toifasi ham rol o'ynaydi: Cat5e ko'p ofislar uchun yetarli, Cat6 esa tezroq va kelajakka zaxira bilan. Server shkafi, kommutator darajasi va Wi-Fi qamrovi ham smetaga kiradi.",
          ] },
          { h: "O'rtacha narxlar", p: [
            "Amalda hisob ish o'rni bo'yicha yuritiladi: bitta to'liq nuqta — kabel, rozetka, ulash va test bilan — o'rtacha bir necha yuz ming so'm. 10–15 ish o'rinli ofis tarmog'i kommutator va shkaf bilan birga — smetaga qarab, odatda bir necha million so'm.",
            "Muhandisning chiqishi va smeta bepul: rejani ko'rib, trassalarni o'lchab, aniq narxni beramiz. Kabel, rozetkalar va kommutatorlar Toshkentdagi ombordan.",
          ] },
          { h: "Optika qachon kerak", p: [
            "Ikki bino orasida, uzun koridorlarda yoki 90 metrdan uzoq masofalarda mis kabel yetmaydi — optik tola ishlatiladi. Optika chaqmoqdan himoyalangan, tezligi yuqori va masofani sezmaydi.",
            "Biz optik kabelni yotqizamiz, payvandlaymiz va reflektometr bilan o'lchab, pasport bilan topshiramiz. Ofis ichidagi tarmoq va binolar orasidagi optika — bitta loyihada.",
          ] },
          { h: "Ish bosqichlari", p: [
            "Birinchi bosqich — loyiha: ish o'rinlari, trassalar va shkaf joyi rejada belgilanadi. Keyin montaj: kabel yotqizish, rozetkalar, patch-panel va kommutatorni ulash. Oxirida har bir liniya testdan o'tkaziladi va sxemalar bilan topshiriladi.",
            "Kichik ofis odatda 1–3 kunda tayyor bo'ladi. Yuridik shaxslar bilan shartnoma va NDS asosida ishlaymiz, ishlarga kafolat beramiz.",
          ] },
        ],
        faq: [
          { q: "Bitta ish o'rni qancha turadi?", a: "Kabel, rozetka, ulash va test bilan — o'rtacha bir necha yuz ming so'm. Aniq narx trassa uzunligi va obyekt holatiga bog'liq — smeta bepul." },
          { q: "10 kishilik ofis tarmog'i qancha bo'ladi?", a: "Kabel, rozetkalar, kommutator va shkaf bilan — odatda bir necha million so'm. Muhandis chiqib, bir kunda aniq smeta beradi." },
          { q: "Cat5e yoki Cat6 — qaysi birini tanlash kerak?", a: "Oddiy ofis uchun Cat5e yetarli. Katta fayllar, video va kelajakka zaxira kerak bo'lsa — Cat6 tavsiya qilamiz, farqi katta emas." },
          { q: "Wi-Fi ham qo'shib berasizmi?", a: "Ha, tarmoq loyihasida Wi-Fi nuqtalarini qamrov bo'yicha rejalashtiramiz — ofisning har burchagida barqaror signal bo'ladi." },
          { q: "Ish qancha vaqt oladi?", a: "Kichik ofis — 1–3 kun. Katta obyektlarda muddat loyihaga bog'liq va smetada ko'rsatiladi." },
        ],
      },
      ru: {
        title: "Монтаж локальной сети в офисе: цена и этапы",
        excerpt: "Сколько стоит компьютерная сеть (СКС) в офисе: кабель, розетки, коммутатор и Wi-Fi. От чего зависит цена и как идёт работа по этапам.",
        sections: [
          { h: "Из чего состоит локальная сеть", p: [
            "Офисная сеть — это структурированная кабельная система (СКС): витая пара к каждому рабочему месту, розетки, патч-панель и серверный шкаф. В центре — коммутатор, интернет раздаёт маршрутизатор, для беспроводных устройств добавляются точки Wi-Fi.",
            "В правильно построенной сети принтер, камеры, IP-телефоны и компьютеры работают в одной системе. Позже легко добавить видеонаблюдение или телефонию — кабель уже проложен.",
          ] },
          { h: "От чего зависит цена", p: [
            "Три главных фактора: число рабочих мест, длина кабельных трасс и состояние объекта. В новостройке прокладывать кабель просто и дёшево; в офисе с готовым ремонтом нужны гофра, короба и аккуратность — это увеличивает время.",
            "Категория кабеля тоже играет роль: Cat5e достаточно большинству офисов, Cat6 быстрее и с запасом на будущее. Серверный шкаф, класс коммутатора и покрытие Wi-Fi также входят в смету.",
          ] },
          { h: "Средние цены", p: [
            "На практике считают по рабочим местам: одна полная точка — кабель, розетка, подключение и тест — в среднем несколько сотен тысяч сум. Сеть офиса на 10–15 мест с коммутатором и шкафом — по смете, обычно несколько миллионов сум.",
            "Выезд инженера и смета бесплатные: посмотрим план, промерим трассы и назовём точную цену. Кабель, розетки и коммутаторы — со склада в Ташкенте.",
          ] },
          { h: "Когда нужна оптика", p: [
            "Между зданиями, в длинных коридорах и на расстояниях больше 90 метров медный кабель не работает — используется оптоволокно. Оптика защищена от гроз, быстра и не чувствительна к расстоянию.",
            "Мы прокладываем и свариваем оптический кабель, измеряем рефлектометром и сдаём с паспортом. Сеть внутри офиса и оптика между зданиями — в одном проекте.",
          ] },
          { h: "Этапы работы", p: [
            "Первый этап — проект: на плане отмечаются рабочие места, трассы и место шкафа. Затем монтаж: прокладка кабеля, розетки, патч-панель и подключение коммутатора. В конце каждая линия тестируется и сдаётся со схемами.",
            "Небольшой офис обычно готов за 1–3 дня. С юрлицами работаем по договору с НДС, на работы даём гарантию.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит одно рабочее место?", a: "Кабель, розетка, подключение и тест — в среднем несколько сотен тысяч сум. Точная цена зависит от длины трасс и состояния объекта — смета бесплатная." },
          { q: "Сколько стоит сеть на офис из 10 человек?", a: "С кабелем, розетками, коммутатором и шкафом — обычно несколько миллионов сум. Инженер выезжает и за день считает точную смету." },
          { q: "Cat5e или Cat6 — что выбрать?", a: "Для обычного офиса достаточно Cat5e. Если гоняете большие файлы, видео и хотите запас на будущее — рекомендуем Cat6, разница в цене небольшая." },
          { q: "Wi-Fi тоже сделаете?", a: "Да, в проекте сети планируем точки Wi-Fi по покрытию — стабильный сигнал в каждом углу офиса." },
          { q: "Сколько времени занимает работа?", a: "Небольшой офис — 1–3 дня. На крупных объектах срок зависит от проекта и указывается в смете." },
        ],
      },
    },
  },
  {
    slug: "eshik-qulfi-narxi",
    date: "2026-08-26",
    related: ["locks", "access", "intercom"],
    loc: {
      uz: {
        title: "Eshik qulfi narxlari: elektron, kodli va aqlli qulflar",
        excerpt: "Toshkentda eshik qulflari qancha turadi: elektromagnit, elektromexanik, kodli va aqlli (smart) qulflar. Kvartira, ofis va kalitka uchun nimani tanlash kerak.",
        sections: [
          { h: "Qulf turlari va narxlar tartibi", p: [
            "Elektron qulflarning to'rt asosiy turi bor. Elektromagnit — eng arzoni, ofis va pod'ezd eshiklari uchun: narxi bir necha yuz ming so'mdan. Elektromexanik — kalitka va tashqi eshiklarga, svet o'chsa ham yopiq qoladi. Kodli qulf klaviatura bilan ochiladi, aqlli (smart) qulf esa telefon, barmoq izi yoki karta bilan.",
            "Aqlli qulflar narxi funksiyaga qarab taxminan 1–3 mln so'm oralig'ida: barmoq izi, ilova, vaqtinchalik kodlar. Biometrik SKUD o'quvchilari bilan to'liq tizim qimmatroq chiqadi.",
          ] },
          { h: "Kvartira uchun: aqlli qulf", p: [
            "Kvartiraga ko'pincha aqlli qulf qo'yiladi: kalit esdan chiqdi degan muammo yo'q — telefon yoki barmoq izi bilan ochiladi. Mehmon yoki farroshga vaqtinchalik kod berish, har ochilish haqida bildirishnoma olish mumkin.",
            "Tanlashda eshik turiga e'tibor bering: har qulf har eshikka tushmaydi. Muhandisimiz eshikni ko'rib, mos modelni tavsiya qiladi — chiqish bepul.",
          ] },
          { h: "Ofis uchun: qulf + SKUD", p: [
            "Ofisda qulf yolg'iz ishlamaydi — u kirish nazorati (SKUD) tizimiga ulanadi: xodimlar karta yoki barmoq izi bilan kiradi, jurnal kim qachon kelganini yozadi. Xodim ishdan ketsa, kirish bir klik bilan bekor qilinadi.",
            "Domofon bilan juftlikda qulf monitor yoki ilovadan ochiladi — mehmonni ko'rib, keyin eshikni ochasiz. Yong'in signalizatsiyasi bo'lsa, evakuatsiya eshiklari signalda avtomatik ochilishi shart — buni doim sozlaymiz.",
          ] },
          { h: "O'rnatish qancha turadi", p: [
            "Montaj narxi eshik va qulf turiga bog'liq: elektromagnit qulfni chiqish tugmasi bilan o'rnatish — eng oddiy ish, aqlli qulf yoki biometrika sozlash bilan biroz qimmatroq. O'rtacha montaj bir necha yuz ming so'mdan boshlanadi.",
            "Muhandisning chiqishi va smeta bepul. Qulflar, o'quvchilar va SKUD uskunalari Toshkentdagi ombordan, rasmiy kafolat bilan.",
          ] },
          { h: "Qayerdan olish va qanday buyurtma qilish", p: [
            "Katalogimizda elektromagnit va aqlli qulflar, SKUD o'quvchilari va aksessuarlar bor — narxlar so'mda. Vazifangizni ayting: kvartira, ofis yoki kalitka — mos variantlarni tanlab, o'rnatish bilan aniq narxni hisoblaymiz.",
            "Yuridik shaxslar bilan shartnoma va NDS asosida ishlaymiz. Uskunaga rasmiy kafolat, montajga kompaniya kafolati.",
          ] },
        ],
        faq: [
          { q: "Eng arzon elektron qulf qancha turadi?", a: "Elektromagnit qulf chiqish tugmasi bilan — bir necha yuz ming so'mdan. O'rnatish bilan birga narx eshik turiga bog'liq — smeta bepul." },
          { q: "Aqlli qulf qancha turadi?", a: "Funksiyaga qarab taxminan 1–3 mln so'm: barmoq izi, telefon ilovasi, vaqtinchalik kodlar. Modelni eshikka qarab tavsiya qilamiz." },
          { q: "Svet o'chsa qulf ochilib qoladimi?", a: "Elektromagnit ochiladi, elektromexanik yopiq qoladi. Doim yopiq turishi kerak eshiklarga elektromexanika yoki UPS qo'yiladi." },
          { q: "Qulfni telefondan ochish mumkinmi?", a: "Ha — aqlli qulflar ilovadan, SKUD yoki domofonga ulangan qulflar esa ularning ilovalaridan ochiladi, masofadan ham." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Bitta qulf odatda bir necha soatda o'rnatiladi. SKUD bilan to'liq tizim — 1–2 kun." },
        ],
      },
      ru: {
        title: "Цены на дверные замки: электронные, кодовые и smart",
        excerpt: "Сколько стоят дверные замки в Ташкенте: электромагнитные, электромеханические, кодовые и умные (smart). Что выбрать для квартиры, офиса и калитки.",
        sections: [
          { h: "Типы замков и порядок цен", p: [
            "У электронных замков четыре основных типа. Электромагнитный — самый доступный, для офисных и подъездных дверей: цена от нескольких сотен тысяч сум. Электромеханический — для калиток и уличных дверей, остаётся запертым при отключении света. Кодовый открывается с клавиатуры, умный (smart) — телефоном, отпечатком или картой.",
            "Умные замки стоят примерно 1–3 млн сум в зависимости от функций: отпечаток, приложение, временные коды. Полная система с биометрическими считывателями СКУД выходит дороже.",
          ] },
          { h: "Для квартиры: smart-замок", p: [
            "В квартиру чаще ставят умный замок: проблема забытых ключей исчезает — открытие телефоном или отпечатком. Гостю или уборщице можно выдать временный код и получать уведомление о каждом открытии.",
            "При выборе важен тип двери: не каждый замок подходит каждой двери. Наш инженер осмотрит дверь и порекомендует подходящую модель — выезд бесплатный.",
          ] },
          { h: "Для офиса: замок + СКУД", p: [
            "В офисе замок не живёт один — он подключается к системе контроля доступа (СКУД): сотрудники входят по карте или отпечатку, журнал фиксирует, кто и когда пришёл. Уволился сотрудник — доступ отзывается одним кликом.",
            "В паре с домофоном замок открывается с монитора или из приложения — сначала видите гостя, потом открываете. Если есть пожарная сигнализация, эвакуационные двери обязаны открываться по тревоге автоматически — мы всегда это настраиваем.",
          ] },
          { h: "Сколько стоит установка", p: [
            "Цена монтажа зависит от двери и типа замка: электромагнитный с кнопкой выхода — самая простая работа, smart-замок или биометрия с настройкой немного дороже. В среднем монтаж начинается от нескольких сотен тысяч сум.",
            "Выезд инженера и смета бесплатные. Замки, считыватели и оборудование СКУД — со склада в Ташкенте, с официальной гарантией.",
          ] },
          { h: "Где купить и как заказать", p: [
            "В нашем каталоге — электромагнитные и умные замки, считыватели СКУД и аксессуары, цены в сумах. Опишите задачу: квартира, офис или калитка — подберём варианты и посчитаем точную цену с установкой.",
            "С юрлицами работаем по договору с НДС. На оборудование — официальная гарантия, на монтаж — гарантия компании.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит самый недорогой электронный замок?", a: "Электромагнитный замок с кнопкой выхода — от нескольких сотен тысяч сум. Цена с установкой зависит от двери — смета бесплатная." },
          { q: "Сколько стоит умный замок?", a: "Примерно 1–3 млн сум в зависимости от функций: отпечаток, приложение, временные коды. Модель порекомендуем под вашу дверь." },
          { q: "Замок откроется при отключении света?", a: "Электромагнитный откроется, электромеханический останется заперт. На двери, которые должны быть заперты всегда, ставят электромеханику или ИБП." },
          { q: "Можно ли открывать замок с телефона?", a: "Да — smart-замки открываются из приложения, а замки в связке со СКУД или домофоном — из их приложений, в том числе удалённо." },
          { q: "Сколько занимает установка?", a: "Один замок обычно ставится за несколько часов. Полная система со СКУД — 1–2 дня." },
        ],
      },
    },
  },

  {
    slug: "shlagbaum-narxi",
    date: "2026-08-26",
    related: ["barrier", "gates", "anpr"],
    loc: {
      uz: {
        title: "Shlagbaum narxi qancha? Toshkentda o'rnatish bilan",
        excerpt: "Toshkentda avtomatik shlagbaum narxlari: strela uzunligi, pult va raqam aniqlash (ANPR) bilan. O'rnatish qancha turadi va hovli, avtoturargoh, KPP uchun nimani tanlash kerak.",
        sections: [
          { h: "Shlagbaum narxi nimaga bog'liq", p: [
            "Asosiy omillar: strela uzunligi (3 dan 6 metrgacha), ishlash intensivligi (hovli yoki band avtoturargoh) va brend. Oddiy hovli uchun bazaviy avtomatik shlagbaum o'rnatish bilan bir necha million so'mdan boshlanadi; intensiv KPP uchun kuchliroq privod kerak va narx yuqoriroq bo'ladi.",
            "Boshqaruv usuli ham narxga ta'sir qiladi: pult — standart, karta o'quvchi yoki telefon orqali ochish — qo'shimcha, avtoraqamni aniqlash (ANPR) bilan tizim eng qulay, lekin kamera va dasturiy ta'minot hisobiga qimmatroq.",
          ] },
          { h: "Hovli, avtoturargoh va KPP uchun tanlov", p: [
            "TJM hovlisi uchun odatiy yechim — 4–6 metrli strela, pultlar va telefondan ochish. Avtoturargohga chiptali yoki raqam aniqlaydigan tizim mos: kirish avtomatik, hisob yuritiladi. Korxona KPPsida shlagbaum SKUD bilan bog'lanadi — faqat ruxsat etilgan transport kiradi.",
            "Raqam aniqlash (ANPR) bilan doimiy mashinalar ro'yxat bo'yicha o'zi kiradi — qorovul tugma bosmaydi, mehmonlar esa qo'ng'iroq orqali. Bu hovli va ofis markazlarida eng ko'p so'raladigan konfiguratsiya.",
          ] },
          { h: "O'rnatish qancha turadi", p: [
            "Montaj narxiga poydevor (fundament), elektr ta'minoti, privodni sozlash va xavfsizlik datchiklari kiradi. Standart o'rnatish odatda 1 kun oladi. Muhandisning chiqishi va smeta bepul — joyni ko'rib, strela uzunligi va privod kuchini to'g'ri tanlaymiz.",
            "Tejashning to'g'ri yo'li — loyihani boshidan to'g'ri qilish: noto'g'ri tanlangan kuchsiz privod band kirishda tez ishdan chiqadi va qimmatga tushadi.",
          ] },
          { h: "Qayerdan olish", p: [
            "Katalogimizda shlagbaumlar, privodlar, pultlar va ANPR kameralari bor — narxlar so'mda, Toshkentda ombordan. Kirish turini ayting (hovli, avtoturargoh, KPP) — mos variantni tanlab, o'rnatish bilan aniq narxni bir kunda hisoblaymiz.",
            "Yuridik shaxslar bilan shartnoma va NDS asosida ishlaymiz. Uskunaga rasmiy kafolat, montajga kompaniya kafolati.",
          ] },
        ],
        faq: [
          { q: "Eng arzon shlagbaum qancha turadi?", a: "Hovli uchun bazaviy avtomatik shlagbaum o'rnatish bilan — bir necha million so'mdan. Aniq narx strela uzunligi va intensivlikka bog'liq — smeta bepul." },
          { q: "Raqam aniqlash (ANPR) bilan qancha bo'ladi?", a: "Shlagbaum narxiga ANPR kamerasi va sozlash qo'shiladi. Doimiy mashinalar ro'yxat bo'yicha avtomatik kiradi — hovli va ofislar uchun eng qulay yechim." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Standart o'rnatish — 1 kun: poydevor, privod montaji, sozlash. Murakkab obyektlarda muddat smetada ko'rsatiladi." },
          { q: "Pult yo'qolsa nima qilamiz?", a: "Yangi pultni dasturlab beramiz, yo'qolganini tizimdan o'chiramiz. Telefon orqali ochishni ham sozlash mumkin — pult umuman kerak bo'lmaydi." },
          { q: "Kafolat bormi?", a: "Ha: uskunaga rasmiy kafolat, montaj ishlariga kompaniya kafolati. Servis va ehtiyot qismlar Toshkentda." },
        ],
      },
      ru: {
        title: "Сколько стоит шлагбаум с установкой в Ташкенте",
        excerpt: "Цены на автоматические шлагбаумы в Ташкенте: длина стрелы, пульты и распознавание номеров (ANPR). Сколько стоит установка и что выбрать для двора, парковки и КПП.",
        sections: [
          { h: "От чего зависит цена шлагбаума", p: [
            "Главные факторы: длина стрелы (от 3 до 6 метров), интенсивность работы (двор или загруженная парковка) и бренд. Базовый автоматический шлагбаум для двора с установкой начинается от нескольких миллионов сум; для интенсивного КПП нужен более мощный привод — и цена выше.",
            "Способ управления тоже влияет: пульт — стандарт, считыватель карт или открытие с телефона — доплата, а система с распознаванием номеров (ANPR) удобнее всего, но дороже за счёт камеры и софта.",
          ] },
          { h: "Что выбрать для двора, парковки и КПП", p: [
            "Для двора ЖК типовое решение — стрела 4–6 метров, пульты и открытие с телефона. Парковке подходит система с билетами или распознаванием номеров: въезд автоматический, ведётся учёт. На КПП предприятия шлагбаум связывается со СКУД — заезжает только разрешённый транспорт.",
            "С распознаванием номеров (ANPR) постоянные машины въезжают сами по списку — охранник не жмёт кнопку, гости въезжают по звонку. Это самая востребованная конфигурация для дворов и офисных центров.",
          ] },
          { h: "Сколько стоит установка", p: [
            "В цену монтажа входят фундамент, подводка питания, настройка привода и датчики безопасности. Стандартная установка обычно занимает 1 день. Выезд инженера и смета бесплатные — осмотрим место и правильно подберём длину стрелы и мощность привода.",
            "Правильная экономия — сразу верный проект: слабый привод на загруженном въезде быстро выходит из строя и обходится дороже.",
          ] },
          { h: "Где купить", p: [
            "В каталоге — шлагбаумы, приводы, пульты и ANPR-камеры, цены в сумах, со склада в Ташкенте. Опишите въезд (двор, парковка, КПП) — подберём вариант и за день посчитаем точную цену с установкой.",
            "С юрлицами работаем по договору с НДС. На оборудование — официальная гарантия, на монтаж — гарантия компании.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит самый недорогой шлагбаум?", a: "Базовый автоматический шлагбаум для двора с установкой — от нескольких миллионов сум. Точная цена зависит от длины стрелы и интенсивности — смета бесплатная." },
          { q: "Сколько стоит шлагбаум с распознаванием номеров?", a: "К цене шлагбаума добавляются ANPR-камера и настройка. Постоянные машины въезжают автоматически по списку — самое удобное решение для дворов и офисов." },
          { q: "Сколько занимает установка?", a: "Стандартная установка — 1 день: фундамент, монтаж привода, настройка. На сложных объектах срок указывается в смете." },
          { q: "Что делать, если потерялся пульт?", a: "Запрограммируем новый, потерянный удалим из системы. Можно настроить открытие с телефона — пульт вообще не понадобится." },
          { q: "Есть ли гарантия?", a: "Да: на оборудование — официальная гарантия, на монтаж — гарантия компании. Сервис и запчасти в Ташкенте." },
        ],
      },
    },
  },

  {
    slug: "davomat-tizimi",
    date: "2026-08-26",
    related: ["attendance", "access"],
    loc: {
      uz: {
        title: "Davomat tizimi: maktab, ofis va zavod uchun narxi",
        excerpt: "Biometrik davomat tizimi qancha turadi: Face ID terminallar, kartalar, avtomatik tabel va 1C ga yuklash. Maktab, ofis va ishlab chiqarish uchun yechimlar.",
        sections: [
          { h: "Davomat tizimi qanday ishlaydi", p: [
            "Kirish joyiga terminal o'rnatiladi: xodim yoki o'quvchi yuz (Face ID), barmoq izi yoki karta bilan belgilanadi. Tizim kelish-ketish vaqtini avtomatik yozadi, kechikish va erta ketishlarni ko'rsatadi, tabelni o'zi tuzadi.",
            "Qog'oz jurnal va qo'lda tabel yuritishga qaraganda farq katta: hech kim boshqasi uchun belgilana olmaydi (yuz va barmoq izi almashtirib bo'lmaydi), hisobot esa bir tugma bilan chiqadi.",
          ] },
          { h: "Maktab va o'quv markazlari uchun", p: [
            "Maktablarda davomat tizimi ota-onalarga xabar yuborish bilan ulanadi: bola maktabga kirdi — telefonga bildirishnoma keladi. Bu xavfsizlik va ishonch masalasi, ko'p xususiy maktablar aynan shu funksiya uchun tizim o'rnatadi.",
            "O'quv markazlarida tizim guruhlar bo'yicha davomatni yuritadi va to'lov bilan bog'lash mumkin: nechta dars qatnashgani avtomatik hisoblanadi.",
          ] },
          { h: "Ofis va ishlab chiqarish uchun", p: [
            "Ofisda davomat tizimi ish vaqtini hisobga olish bilan birlashadi: kechikishlar, ortiqcha ishlagan soatlar, tabelning 1C ga yuklanishi. Turniket bilan birga qo'yilsa, kirish nazorati ham hal bo'ladi.",
            "Zavod va ishlab chiqarishda smenali jadval, tungi smenalar va yuzlab xodimlar bilan ishlash muhim — terminallar bunga mo'ljallangan, ZKTeco va Hikvision uskunalari sekundiga bir necha kishini o'tkazadi.",
          ] },
          { h: "Narxi qancha", p: [
            "Kichik ofis uchun bitta Face ID terminal va sozlash bilan tizim bir necha million so'mdan boshlanadi. Maktab yoki zavod uchun narx kirish nuqtalari va xodimlar soniga bog'liq — turniketlar qo'shilsa, smeta kattaroq bo'ladi.",
            "Muhandisning chiqishi va smeta bepul. Terminallar Toshkentdagi ombordan, o'rnatish odatda 1 kun, 1C bilan integratsiya alohida sozlanadi.",
          ] },
          { h: "Qanday buyurtma qilinadi", p: [
            "Vazifani ayting: nechta odam, nechta kirish, tabel qayerga yuklanadi. Mos terminallarni tanlab, o'rnatish bilan aniq narxni bir kunda hisoblaymiz.",
            "Yuridik shaxslar bilan shartnoma va NDS asosida ishlaymiz. Uskunaga rasmiy kafolat, o'rnatishga kompaniya kafolati.",
          ] },
        ],
        faq: [
          { q: "Davomat tizimi narxi qancha?", a: "Bitta Face ID terminal va sozlash bilan — bir necha million so'mdan. Aniq narx kirish nuqtalari va xodimlar soniga bog'liq — smeta bepul." },
          { q: "Maktab uchun ota-onalarga xabar yuborish bormi?", a: "Ha: bola belgilanganda ota-onaga bildirishnoma boradi. Bu maktablar uchun eng ko'p so'raladigan funksiya." },
          { q: "1C bilan integratsiya qilasizmi?", a: "Ha, tabel 1C ga avtomatik yuklanadi. Zarplata hisobiga tayyor ma'lumot boradi." },
          { q: "Terminal aldab bo'ladimi — boshqa odam belgilansa?", a: "Yuz va barmoq izi bilan — yo'q: biometriya boshqa odamni qabul qilmaydi. Aynan shuning uchun kartadan ko'ra biometrik terminal tavsiya qilamiz." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Bitta terminal — bir necha soat. Turniketlar bilan to'liq tizim — 1–2 kun." },
        ],
      },
      ru: {
        title: "Система учёта посещаемости: цены для школы, офиса и завода",
        excerpt: "Сколько стоит биометрическая система учёта посещаемости: терминалы Face ID, карты, автоматический табель и выгрузка в 1С. Решения для школ, офисов и производств.",
        sections: [
          { h: "Как работает система учёта посещаемости", p: [
            "На входе ставится терминал: сотрудник или ученик отмечается лицом (Face ID), отпечатком или картой. Система автоматически пишет время прихода и ухода, показывает опоздания и ранние уходы, сама формирует табель.",
            "Разница с бумажным журналом и ручным табелем принципиальная: никто не отметится за другого (лицо и отпечаток не передашь), а отчёт выгружается одной кнопкой.",
          ] },
          { h: "Для школ и учебных центров", p: [
            "В школах учёт посещаемости подключается к уведомлениям родителей: ребёнок вошёл в школу — на телефон приходит сообщение. Это вопрос безопасности и доверия — многие частные школы ставят систему именно ради этой функции.",
            "В учебных центрах система ведёт посещаемость по группам, и её можно связать с оплатой: количество посещённых занятий считается автоматически.",
          ] },
          { h: "Для офиса и производства", p: [
            "В офисе учёт посещаемости объединяется с учётом рабочего времени: опоздания, переработки, выгрузка табеля в 1С. В паре с турникетом закрывается и контроль доступа.",
            "На заводе важны сменные графики, ночные смены и сотни сотрудников — терминалы на это рассчитаны: оборудование ZKTeco и Hikvision пропускает несколько человек в секунду.",
          ] },
          { h: "Сколько стоит", p: [
            "Для небольшого офиса система с одним Face ID терминалом и настройкой начинается от нескольких миллионов сум. Для школы или завода цена зависит от числа входов и сотрудников; с турникетами смета больше.",
            "Выезд инженера и смета бесплатные. Терминалы со склада в Ташкенте, установка обычно 1 день, интеграция с 1С настраивается отдельно.",
          ] },
          { h: "Как заказать", p: [
            "Опишите задачу: сколько людей, сколько входов, куда выгружать табель. Подберём терминалы и за день посчитаем точную цену с установкой.",
            "С юрлицами работаем по договору с НДС. На оборудование — официальная гарантия, на монтаж — гарантия компании.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит система учёта посещаемости?", a: "С одним Face ID терминалом и настройкой — от нескольких миллионов сум. Точная цена зависит от числа входов и сотрудников — смета бесплатная." },
          { q: "Есть ли уведомления родителям для школ?", a: "Да: когда ребёнок отмечается, родителю приходит уведомление. Это самая востребованная функция у школ." },
          { q: "Делаете интеграцию с 1С?", a: "Да, табель выгружается в 1С автоматически — готовые данные идут в расчёт зарплаты." },
          { q: "Можно ли отметиться за другого?", a: "С лицом и отпечатком — нет: биометрия чужого не примет. Именно поэтому рекомендуем биометрические терминалы вместо карт." },
          { q: "Сколько занимает установка?", a: "Один терминал — несколько часов. Полная система с турникетами — 1–2 дня." },
        ],
      },
    },
  },
  {
    slug: "aqlli-uy-narxi",
    date: "2026-08-26",
    related: ["smarthome", "cctv", "locks"],
    loc: {
      uz: {
        title: "Aqlli uy narxi: tizim qancha turadi va nimadan boshlash kerak",
        excerpt: "Toshkentda aqlli uy tizimi narxlari: yoritish, pardalar, iqlim, videokuzatuv va aqlli qulflar bitta ilovada. Nimadan boshlash arzon va qanday kengaytirish mumkin.",
        sections: [
          { h: "Aqlli uy nimalardan iborat", p: [
            "Aqlli uy — bu bitta ilovadan boshqariladigan qurilmalar to'plami: yoritish va rozetkalar, pardalar, konditsioner boshqaruvi, videokuzatuv, aqlli qulf va datchiklar (suv toshqini, tutun, harakat).",
            "Hammasi birdan shart emas: tizim modulli. Ko'pchilik yoritish va pardalardan boshlaydi, keyin kamera, qulf va datchiklarni qo'shadi — bitta ekotizimda hammasi birga ishlaydi.",
          ] },
          { h: "Narxlar: nimadan boshlash arzon", p: [
            "Boshlang'ich to'plam — aqlli rozetkalar, lampalar va bitta datchik — bir necha yuz ming so'mdan yig'iladi. O'rtacha kvartira uchun yoritish, pardalar va iqlim boshqaruvi bilan tizim bir necha million so'mga chiqadi.",
            "To'liq loyiha — videokuzatuv, aqlli qulf, ovozli boshqaruv va ssenariylar bilan — kvartira maydoni va qurilmalar soniga bog'liq. Smeta bepul: xonalarni ko'rib, bosqichma-bosqich rejani taklif qilamiz.",
          ] },
          { h: "Xavfsizlik: kamera, qulf va datchiklar", p: [
            "Aqlli uyning eng foydali qismi — xavfsizlik: eshikda aqlli qulf va kamera, uyda harakat va tutun datchiklari, suv toshqini datchigi oshxona va sanuzelda. Hammasi telefonga xabar yuboradi.",
            "Uydan chiqqanda bitta ssenariy hammasi o'chiradi va qo'riqlashga qo'yadi; qaytganda yoritish va konditsioner o'zi yonadi. Tuya, Hikvision va boshqa ekotizimlar bilan ishlaymiz.",
          ] },
          { h: "Qanday buyurtma qilinadi", p: [
            "Kvartira yoki hovli rejasini yuboring — qaysi xonada nima kerakligini aytamiz va ikki-uch variantda smeta beramiz: boshlang'ich, o'rtacha va to'liq. O'rnatish ta'mirga bog'liq: yangi ta'mirda simli yechimlar, tayyor uyda simsiz.",
            "Uskunalar Toshkentdagi ombordan, o'rnatish va sozlash bizniki, ilovani telefonga o'rnatib, ishlatishni o'rgatamiz. Kafolat — rasmiy.",
          ] },
        ],
        faq: [
          { q: "Aqlli uy tizimi narxi qancha?", a: "Boshlang'ich to'plam — bir necha yuz ming so'mdan. Kvartira uchun yoritish, pardalar va iqlim bilan — bir necha million. Aniq narx reja bo'yicha, smeta bepul." },
          { q: "Nimadan boshlash kerak?", a: "Eng ko'p foyda beradigan narsalardan: aqlli qulf, kamera va suv toshqini datchigi. Keyin yoritish va pardalarni qo'shish oson." },
          { q: "Ta'mir tugagan uyga o'rnatish mumkinmi?", a: "Ha — simsiz qurilmalar devorni buzmasdan o'rnatiladi. Yangi ta'mirda simli yechimlar ishonchliroq bo'ladi." },
          { q: "Hammasi bitta ilovada ishlaydimi?", a: "Ha, tizimni bitta ekotizimda yig'amiz — yoritish, pardalar, kamera va qulf bitta ilovadan boshqariladi." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Boshlang'ich to'plam — bir kun. To'liq loyiha — kvartira hajmiga qarab, smetada aniq ko'rsatiladi." },
        ],
      },
      ru: {
        title: "Сколько стоит умный дом: цены и с чего начать",
        excerpt: "Цены на систему умного дома в Ташкенте: свет, шторы, климат, видеонаблюдение и умные замки в одном приложении. С чего дёшево начать и как расширять.",
        sections: [
          { h: "Из чего состоит умный дом", p: [
            "Умный дом — это набор устройств, управляемых из одного приложения: свет и розетки, шторы, управление кондиционером, видеонаблюдение, умный замок и датчики (протечка, дым, движение).",
            "Всё сразу не обязательно: система модульная. Большинство начинает со света и штор, потом добавляет камеры, замок и датчики — в одной экосистеме всё работает вместе.",
          ] },
          { h: "Цены: с чего начать недорого", p: [
            "Стартовый набор — умные розетки, лампы и один датчик — собирается от нескольких сотен тысяч сум. Система для средней квартиры со светом, шторами и климатом выходит в несколько миллионов сум.",
            "Полный проект — с видеонаблюдением, умным замком, голосовым управлением и сценариями — зависит от площади и числа устройств. Смета бесплатная: посмотрим комнаты и предложим поэтапный план.",
          ] },
          { h: "Безопасность: камеры, замок и датчики", p: [
            "Самая полезная часть умного дома — безопасность: умный замок и камера на входе, датчики движения и дыма в доме, датчик протечки на кухне и в санузле. Всё шлёт уведомления на телефон.",
            "При выходе из дома один сценарий всё выключает и ставит на охрану; по возвращении свет и кондиционер включаются сами. Работаем с Tuya, Hikvision и другими экосистемами.",
          ] },
          { h: "Как заказать", p: [
            "Пришлите план квартиры или дома — скажем, что нужно в каждой комнате, и дадим смету в двух-трёх вариантах: стартовый, средний и полный. Монтаж зависит от ремонта: в новом — проводные решения, в готовом — беспроводные.",
            "Оборудование со склада в Ташкенте, установка и настройка наши, приложение поставим и научим пользоваться. Гарантия официальная.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит система умного дома?", a: "Стартовый набор — от нескольких сотен тысяч сум. Для квартиры со светом, шторами и климатом — несколько миллионов. Точная цена по плану, смета бесплатная." },
          { q: "С чего начать?", a: "С самого полезного: умный замок, камера и датчик протечки. Свет и шторы легко добавить позже." },
          { q: "Можно ли поставить в квартиру с готовым ремонтом?", a: "Да — беспроводные устройства ставятся без штробления. В новом ремонте надёжнее проводные решения." },
          { q: "Всё будет в одном приложении?", a: "Да, собираем систему в одной экосистеме — свет, шторы, камеры и замок управляются из одного приложения." },
          { q: "Сколько занимает установка?", a: "Стартовый набор — один день. Полный проект — по объёму квартиры, срок указывается в смете." },
        ],
      },
    },
  },
  {
    slug: "avtomatik-darvoza-narxi",
    date: "2026-08-26",
    related: ["gates", "barrier", "anpr"],
    loc: {
      uz: {
        title: "Avtomatik darvoza: privod narxi va o'rnatish",
        excerpt: "Darvozani avtomatlashtirish qancha turadi: suriladigan va ochiladigan darvozalar uchun privodlar, pultlar, telefondan ochish. Mavjud darvozaga o'rnatish mumkinmi.",
        sections: [
          { h: "Qanday darvozalarni avtomatlashtirish mumkin", p: [
            "Ikki asosiy tur: suriladigan (otkatnoy) va ochiladigan (raspashnoy) darvozalar. Har biriga o'z privodi bor: suriladigan darvozaga tishli reyka bilan bitta privod, ochiladiganga har tavaqaga bittadan.",
            "Muhimi: avtomatikani mavjud darvozangizga o'rnatish mumkin — darvozani almashtirish shart emas. Muhandis og'irlik va o'lchamni ko'rib, mos quvvatdagi privodni tanlaydi.",
          ] },
          { h: "Privod narxi nimaga bog'liq", p: [
            "Asosiy omil — darvoza og'irligi va ishlash intensivligi. Hovli uchun yengil privodlar bir necha million so'mdan boshlanadi; og'ir temir darvoza va tez-tez ochiladigan kirishlarga kuchliroq va qimmatroq privod kerak.",
            "To'plamga privoddan tashqari pultlar, fotoelementlar (xavfsizlik), signal chiroq va o'rnatish kiradi. Telefondan ochish va SKUD bilan bog'lash — qo'shimcha imkoniyat.",
          ] },
          { h: "KPP va korxonalar uchun", p: [
            "Korxona kirishida avtomatik darvoza shlagbaum va SKUD bilan birga ishlaydi: ruxsat etilgan transport ro'yxat bo'yicha kiradi, raqam aniqlash (ANPR) bilan qorovul tugma ham bosmaydi.",
            "Intensiv kirishlarda sanoat darajasidagi privodlar qo'yiladi — ular kuniga yuzlab ochilishga mo'ljallangan va kafolat bilan xizmat qiladi.",
          ] },
          { h: "O'rnatish va buyurtma", p: [
            "Standart o'rnatish 1 kun: privod montaji, fotoelementlar, pultlarni dasturlash va sozlash. Muhandisning chiqishi va smeta bepul — darvozani ko'rib, aniq narxni aytamiz.",
            "Privodlar va avtomatika Toshkentdagi ombordan, rasmiy kafolat bilan. Yuridik shaxslar bilan shartnoma va NDS asosida ishlaymiz.",
          ] },
        ],
        faq: [
          { q: "Darvozani avtomatlashtirish qancha turadi?", a: "Hovli darvozasi uchun privod to'plami o'rnatish bilan — bir necha million so'mdan. Aniq narx darvoza og'irligi va turiga bog'liq — smeta bepul." },
          { q: "Mavjud darvozaga o'rnatish mumkinmi?", a: "Ha, ko'p hollarda darvozani almashtirish shart emas — privod mavjud darvozaga o'rnatiladi. Muhandis chiqib, mosligini tekshiradi." },
          { q: "Telefondan ochish bo'ladimi?", a: "Ha: pultdan tashqari telefon ilovasi yoki qo'ng'iroq orqali ochishni sozlaymiz. SKUD va raqam aniqlash bilan ham bog'lash mumkin." },
          { q: "Svet o'chsa darvoza ochiladimi?", a: "Privodlarda mexanik razblokirovka bor — kalit bilan ochib, darvozani qo'lda ochish mumkin. Zaxira quvvat (UPS) ham qo'yish mumkin." },
          { q: "O'rnatish qancha vaqt oladi?", a: "Standart o'rnatish — 1 kun: montaj, fotoelementlar, sozlash va pultlarni dasturlash." },
        ],
      },
      ru: {
        title: "Автоматические ворота: цена привода и установка",
        excerpt: "Сколько стоит автоматизация ворот: приводы для откатных и распашных ворот, пульты, открытие с телефона. Можно ли поставить автоматику на существующие ворота.",
        sections: [
          { h: "Какие ворота можно автоматизировать", p: [
            "Два основных типа: откатные и распашные ворота. У каждого свой привод: откатным нужен один привод с зубчатой рейкой, распашным — по приводу на каждую створку.",
            "Важно: автоматику можно поставить на ваши существующие ворота — менять их не нужно. Инженер оценивает вес и размеры и подбирает привод подходящей мощности.",
          ] },
          { h: "От чего зависит цена привода", p: [
            "Главный фактор — вес ворот и интенсивность работы. Лёгкие приводы для двора начинаются от нескольких миллионов сум; тяжёлым железным воротам и часто открывающимся въездам нужен привод мощнее и дороже.",
            "В комплект кроме привода входят пульты, фотоэлементы (безопасность), сигнальная лампа и установка. Открытие с телефона и связка со СКУД — дополнительная опция.",
          ] },
          { h: "Для КПП и предприятий", p: [
            "На въезде предприятия автоматические ворота работают вместе со шлагбаумом и СКУД: разрешённый транспорт въезжает по списку, а с распознаванием номеров (ANPR) охранник даже не жмёт кнопку.",
            "На интенсивных въездах ставятся приводы промышленного класса — они рассчитаны на сотни открытий в день и работают с гарантией.",
          ] },
          { h: "Установка и заказ", p: [
            "Стандартная установка — 1 день: монтаж привода, фотоэлементы, программирование пультов и настройка. Выезд инженера и смета бесплатные — осмотрим ворота и назовём точную цену.",
            "Приводы и автоматика со склада в Ташкенте, с официальной гарантией. С юрлицами работаем по договору с НДС.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит автоматизация ворот?", a: "Комплект привода для дворовых ворот с установкой — от нескольких миллионов сум. Точная цена зависит от веса и типа ворот — смета бесплатная." },
          { q: "Можно ли поставить на существующие ворота?", a: "Да, в большинстве случаев менять ворота не нужно — привод ставится на существующие. Инженер выедет и проверит совместимость." },
          { q: "Будет ли открытие с телефона?", a: "Да: кроме пульта настроим открытие из приложения или по звонку. Можно связать со СКУД и распознаванием номеров." },
          { q: "Откроются ли ворота при отключении света?", a: "У приводов есть механическая разблокировка — ключом можно расцепить и открыть ворота вручную. Можно поставить и резервное питание (ИБП)." },
          { q: "Сколько занимает установка?", a: "Стандартная установка — 1 день: монтаж, фотоэлементы, настройка и программирование пультов." },
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

// Статьи, привязанные к услуге (related) — перелинковка товар/услуга → блог.
export function articlesForService(serviceKey: string | null | undefined, locale: string, limit = 3): Article[] {
  if (!serviceKey) return [];
  return ARTICLES.filter((a) => a.loc[locale] && a.related.includes(serviceKey)).slice(0, limit);
}
