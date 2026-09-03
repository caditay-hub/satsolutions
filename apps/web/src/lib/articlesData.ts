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
  hubs?: string[];           // слаги товарных хабов /products/type/<slug> — «Каталог по теме»
  loc: Record<string, ArticleBody>;
};

export const ARTICLES: Article[] = [
  {
    slug: "router-sozlash",
    date: "2026-09-03",
    related: ["network", "wifi"],
    hubs: ["marshrutizatory", "wi-fi-tochki-dostupa"],
    loc: {
      ru: {
        title: "Как настроить роутер правильно: чек-лист из семи шагов",
        excerpt: "Настройка домашнего или офисного роутера без «оставим как было»: пароли, Wi-Fi, гостевая сеть, обновления, проброс для камер. Семь шагов, после которых сеть работает и защищена.",
        sections: [
          { h: "Шаг 1: смените оба пароля", p: [
            "У роутера два пароля, и путают их постоянно: пароль Wi-Fi (для подключения к сети) и пароль администратора (для входа в настройки). Заводской админ-пароль вроде admin/admin известен всем ботам интернета — меняйте оба при первом включении.",
            "Хороший пароль Wi-Fi — длинная фраза, а не восемь символов с заглавной буквой. Взлом идёт перебором, и длина бьёт сложность: три несвязанных слова надёжнее, чем «Qwerty1!».",
          ] },
          { h: "Шаг 2: обновите прошивку", p: [
            "Роутеры взламывают не «хакеры в капюшонах», а автоматические сети, сканирующие интернет на старые дыры. Обновление прошивки закрывает известные уязвимости — это пять минут в меню «Обновление» или в мобильном приложении производителя.",
            "Там же проверьте, что удалённый доступ к настройкам из интернета выключен, если вы им осознанно не пользуетесь. Это самая частая дверь для чужих рук в вашей сети.",
          ] },
          { h: "Шаг 3: выберите диапазон и канал с умом", p: [
            "Современный роутер вещает на 2,4 и 5 ГГц. Правило простое: всё, что умеет 5 ГГц и стоит недалеко — туда (быстро и свободно); датчики умного дома и дальние устройства — на 2,4 (дальнобойность).",
            "Каналы в многоэтажке лучше задать вручную: для 2,4 ГГц — 1, 6 или 11 по результатам анализатора. Автовыбор у дешёвых роутеров часто «прилипает» к загруженному каналу.",
          ] },
          { h: "Шаг 4: заведите гостевую сеть", p: [
            "Гостевая сеть — отдельный Wi-Fi для гостей и «умных» устройств: у них нет доступа к вашим компьютерам, дискам и камерам. Взломанная китайская лампочка из гостевой сети никуда дальше не пролезет.",
            "В офисе это не опция, а норма: гости и личные телефоны сотрудников — в гостевом сегменте, рабочие машины и принтеры — в основном. На нормальном оборудовании это делается VLAN-ами.",
          ] },
          { h: "Шаг 5: DHCP и резервирование адресов", p: [
            "Устройствам, к которым вы обращаетесь — принтеру, камере, регистратору, NAS — закрепите постоянные IP-адреса через резервирование DHCP. Иначе адрес однажды поменяется, и «пропавший» принтер будут искать всем офисом.",
            "Диапазон DHCP оставьте с запасом: типичная ошибка — пул на 50 адресов в офисе, где полсотни телефонов плюс ноутбуки, и новые устройства перестают подключаться в разгар дня.",
          ] },
          { h: "Шаг 6: доступ к камерам снаружи — без проброса портов", p: [
            "Классический проброс портов наружу — способ из прошлого десятилетия: открытый порт регистратора наружу находят сканерами за часы. Правильные пути: облачный P2P-доступ производителя (Hik-Connect и аналоги) или VPN до роутера.",
            "VPN — самый надёжный вариант для бизнеса: снаружи не открыто ничего, а вы из любой точки попадаете в сеть как из офиса. Современные роутеры поднимают WireGuard за вечер.",
          ] },
          { h: "Шаг 7: проверьте скорость и запишите настройки", p: [
            "После настройки замерьте скорость по кабелю и по Wi-Fi рядом с роутером: так вы узнаете реальный потолок и не будете грешить на провайдера в дальней комнате. И запишите админ-пароль в надёжное место — сброс роутера из-за забытого пароля означает настройку заново.",
            "Если после всех шагов сеть всё равно тормозит или не добивает — дело уже не в настройках, а в покрытии или железе. Мы настраиваем и строим сети любого масштаба — от квартиры до офиса: приедем, разберёмся, сделаем.",
          ] },
        ],
        faq: [
          { q: "Нужно ли перезагружать роутер «для профилактики»?", a: "Исправный роутер работает месяцами без перезагрузок. Если помогает только ежедневный ресет — устройство перегревается, не тянет нагрузку или ловит проблему в прошивке; это повод обновиться или заменить его, а не ритуал." },
          { q: "Роутер провайдера — оставить или поставить свой?", a: "Провайдерский обычно справляется с базой. Свой роутер ставят ради нормального Wi-Fi, VPN, гостевых сетей и VLAN. Часто лучший вариант — перевести провайдерский в режим моста и отдать всё своему." },
          { q: "Сколько устройств выдержит домашний роутер?", a: "Бюджетные модели честно тянут 15–25 активных клиентов, дальше начинаются обрывы. Дом с умными устройствами легко набирает полсотни — тогда смотрите на роутеры классом выше или связку роутер + точки доступа." },
        ],
      },
      uz: {
        title: "Routerni to'g'ri sozlash: yetti qadamlik chek-list",
        excerpt: "Uy yoki ofis routerini «qanday bo'lsa shunday qolsin»siz sozlash: parollar, Wi-Fi, mehmon tarmog'i, yangilanishlar, kameralarga kirish. Yetti qadam — tarmoq ishlaydi va himoyalangan.",
        sections: [
          { h: "1-qadam: ikkala parolni almashtiring", p: [
            "Routerda ikkita parol bor va ularni doim adashtirishadi: Wi-Fi paroli (tarmoqqa ulanish uchun) va administrator paroli (sozlamalarga kirish uchun). admin/admin kabi zavod admin-paroli internetning barcha botlariga ma'lum — birinchi yoqishda ikkalasini ham almashtiring.",
            "Yaxshi Wi-Fi parol — sakkiz belgi emas, uzun ibora. Buzish terib chiqish bilan boradi va uzunlik murakkablikni yengadi: uchta bog'lanmagan so'z «Qwerty1!» dan ishonchliroq.",
          ] },
          { h: "2-qadam: proshivkani yangilang", p: [
            "Routerlarni «kapyushonli xakerlar» emas, internetni eski teshiklarga skanerlaydigan avtomatik tarmoqlar buzadi. Proshivka yangilanishi ma'lum zaifliklarni yopadi — bu «Yangilash» menyusida yoki ishlab chiqaruvchi ilovasida besh daqiqa.",
            "O'sha yerda internetdan sozlamalarga masofaviy kirish o'chirilganini tekshiring — agar undan ongli foydalanmasangiz. Bu tarmog'ingizga begona qo'llar uchun eng ko'p uchraydigan eshik.",
          ] },
          { h: "3-qadam: diapazon va kanalni aql bilan tanlang", p: [
            "Zamonaviy router 2,4 va 5 GGts da ishlaydi. Qoida oddiy: 5 GGts ni biladigan va uzoq turmaydigan hamma narsa — o'sha yoqqa (tez va bo'sh); aqlli uy datchiklari va uzoq qurilmalar — 2,4 ga (uzoqqa uradi).",
            "Ko'p qavatlida kanallarni qo'lda qo'ygan yaxshi: 2,4 GGts uchun analizator natijasi bo'yicha 1, 6 yoki 11. Arzon routerlarda avtotanlash ko'pincha band kanalga «yopishib» qoladi.",
          ] },
          { h: "4-qadam: mehmon tarmog'ini oching", p: [
            "Mehmon tarmog'i — mehmonlar va «aqlli» qurilmalar uchun alohida Wi-Fi: ular kompyuterlaringiz, disklar va kameralarga kira olmaydi. Mehmon tarmog'idagi buzilgan xitoy lampochkasi boshqa hech qayoqqa o'tolmaydi.",
            "Ofisda bu opsiya emas, norma: mehmonlar va xodimlarning shaxsiy telefonlari — mehmon segmentida, ish mashinalari va printerlar — asosiysida. Normal uskunada bu VLANlar bilan qilinadi.",
          ] },
          { h: "5-qadam: DHCP va manzillarni band qilish", p: [
            "Murojaat qiladigan qurilmalarga — printer, kamera, registrator, NAS — DHCP rezervlash orqali doimiy IP biriktiring. Aks holda manzil bir kun o'zgaradi va «yo'qolgan» printerni butun ofis qidiradi.",
            "DHCP diapazonini zaxira bilan qoldiring: tipik xato — ellikta telefon plus noutbuklar bo'lgan ofisda 50 talik pul, va kun qizig'ida yangi qurilmalar ulanmay qoladi.",
          ] },
          { h: "6-qadam: kameralarga tashqaridan kirish — portlarni ochmasdan", p: [
            "Portlarni tashqariga klassik ochish — o'tgan o'n yillik usuli: registratorning ochiq portini skanerlashda soatlarda topishadi. To'g'ri yo'llar: ishlab chiqaruvchining bulutli P2P kirishi (Hik-Connect va o'xshashlari) yoki routergacha VPN.",
            "VPN — biznes uchun eng ishonchli variant: tashqarida hech narsa ochiq emas, siz esa istalgan joydan tarmoqqa ofisdagidek kirasiz. Zamonaviy routerlar WireGuard ni bir kechada ko'taradi.",
          ] },
          { h: "7-qadam: tezlikni o'lchang va sozlamalarni yozib qo'ying", p: [
            "Sozlashdan keyin kabel va router yonida Wi-Fi orqali tezlikni o'lchang: real shipni bilasiz va uzoq xonada provayderni ayblamaysiz. Admin-parolni ishonchli joyga yozib qo'ying — unutilgan parol tufayli router tashlash hammasini qaytadan sozlash degani.",
            "Barcha qadamlardan keyin tarmoq baribir tormozlansa yoki yetmasa — gap endi sozlamalarda emas, qamrov yoki temirda. Biz istalgan masshtabdagi tarmoqni sozlaymiz va quramiz — kvartiradan ofisgacha: kelamiz, aniqlaymiz, qilamiz.",
          ] },
        ],
        faq: [
          { q: "Routerni «profilaktika uchun» qayta yuklash kerakmi?", a: "Soz router oylab qayta yuklashsiz ishlaydi. Faqat har kungi reset yordam bersa — qurilma qizib ketyapti, yukni tortmayapti yoki proshivkada muammo bor; bu ritual emas, yangilash yoki almashtirish sababi." },
          { q: "Provayder routeri — qoldirishmi yoki o'zimniki?", a: "Provaydernikiga baza yetadi. O'z routerini normal Wi-Fi, VPN, mehmon tarmoqlari va VLAN uchun qo'yishadi. Ko'pincha eng yaxshisi — provaydernikini ko'prik rejimiga o'tkazib, hammasini o'znikiga berish." },
          { q: "Uy routeri nechta qurilmani ko'taradi?", a: "Byudjet modellar halol 15–25 faol mijozni tortadi, keyin uzilishlar boshlanadi. Aqlli qurilmali uy ellikni oson yig'adi — unda yuqoriroq klass routerga yoki router + kirish nuqtalari bog'lamiga qarang." },
        ],
      },
      en: {
        title: "How to set up a router properly: a seven-step checklist",
        excerpt: "Setting up a home or office router without 'leave it as is': passwords, Wi-Fi, a guest network, updates, camera access. Seven steps after which the network works and stays protected.",
        sections: [
          { h: "Step 1: change both passwords", p: [
            "A router has two passwords, and people mix them up constantly: the Wi-Fi password (to join the network) and the admin password (to enter the settings). A factory admin password like admin/admin is known to every bot on the internet — change both at first power-on.",
            "A good Wi-Fi password is a long phrase, not eight characters with a capital letter. Cracking is brute force, and length beats complexity: three unrelated words are stronger than 'Qwerty1!'.",
          ] },
          { h: "Step 2: update the firmware", p: [
            "Routers are broken not by 'hackers in hoodies' but by automated networks scanning the internet for old holes. A firmware update closes the known vulnerabilities — five minutes in the Update menu or the vendor's mobile app.",
            "While there, check that remote access to the settings from the internet is off unless you use it deliberately. It is the most common door for strangers into your network.",
          ] },
          { h: "Step 3: pick the band and channel wisely", p: [
            "A modern router broadcasts on 2.4 and 5 GHz. The rule is simple: everything that supports 5 GHz and sits nearby goes there (fast and clear); smart-home sensors and distant devices stay on 2.4 (longer reach).",
            "In an apartment block set the channels manually: for 2.4 GHz — 1, 6 or 11, guided by an analyzer app. Cheap routers' auto-select often sticks to a congested channel.",
          ] },
          { h: "Step 4: create a guest network", p: [
            "A guest network is a separate Wi-Fi for visitors and smart devices: they get no access to your computers, drives and cameras. A hacked smart bulb in the guest network cannot crawl any further.",
            "In an office it is not an option but the norm: guests and personal phones in the guest segment, work machines and printers in the main one. On decent equipment this is done with VLANs.",
          ] },
          { h: "Step 5: DHCP and address reservation", p: [
            "Give fixed IP addresses via DHCP reservation to the devices you address — the printer, camera, recorder, NAS. Otherwise the address changes one day and the whole office hunts for the 'missing' printer.",
            "Leave the DHCP range with headroom: a typical mistake is a 50-address pool in an office with fifty phones plus laptops, and new devices stop connecting at midday.",
          ] },
          { h: "Step 6: outside access to cameras — without port forwarding", p: [
            "Classic port forwarding is a method from the last decade: an open recorder port is found by scanners within hours. The right ways: the vendor's cloud P2P access (Hik-Connect and the like) or a VPN to the router.",
            "A VPN is the most reliable option for business: nothing is open to the outside, and from anywhere you enter the network as if from the office. Modern routers bring up WireGuard in an evening.",
          ] },
          { h: "Step 7: measure the speed and write the settings down", p: [
            "After the setup, measure the speed over cable and over Wi-Fi next to the router: you learn the real ceiling and stop blaming the ISP in the far room. And write the admin password somewhere safe — resetting a router over a forgotten password means configuring everything again.",
            "If after all the steps the network still lags or falls short, the problem is no longer settings but coverage or hardware. We configure and build networks of any scale — from an apartment to an office: we come, figure it out and do it.",
          ] },
        ],
        faq: [
          { q: "Should I reboot the router 'preventively'?", a: "A healthy router runs for months without reboots. If only a daily reset helps, the device overheats, cannot carry the load or hits a firmware bug; that is a reason to update or replace it, not a ritual." },
          { q: "The ISP's router — keep it or install my own?", a: "The ISP's box usually covers the basics. People install their own for proper Wi-Fi, VPN, guest networks and VLANs. Often the best option is bridging the ISP router and letting your own do everything." },
          { q: "How many devices can a home router carry?", a: "Budget models honestly carry 15–25 active clients, then drops begin. A smart home easily reaches fifty — then look at a higher class of router or a router-plus-access-points combination." },
        ],
      },
      tr: {
        title: "Router doğru nasıl kurulur: yedi adımlık kontrol listesi",
        excerpt: "Ev veya ofis router'ını 'olduğu gibi kalsın' demeden kurmak: şifreler, Wi-Fi, misafir ağı, güncellemeler, kameralara erişim. Yedi adım — ağ çalışır ve korunur.",
        sections: [
          { h: "Adım 1: iki şifreyi de değiştirin", p: [
            "Router'da iki şifre vardır ve sürekli karıştırılır: Wi-Fi şifresi (ağa bağlanmak için) ve yönetici şifresi (ayarlara girmek için). admin/admin gibi fabrika şifresini internetin bütün botları bilir — ilk açılışta ikisini de değiştirin.",
            "İyi bir Wi-Fi şifresi sekiz karakter değil, uzun bir ifadedir. Kırma denemeyle gider ve uzunluk karmaşıklığı yener: üç alakasız kelime 'Qwerty1!'den sağlamdır.",
          ] },
          { h: "Adım 2: yazılımı güncelleyin", p: [
            "Router'ları 'kapüşonlu hackerlar' değil, interneti eski açıklar için tarayan otomatik ağlar kırar. Yazılım güncellemesi bilinen açıkları kapatır — Güncelleme menüsünde veya üreticinin uygulamasında beş dakika.",
            "Oradayken, bilerek kullanmıyorsanız ayarlara internetten uzak erişimin kapalı olduğunu kontrol edin. Ağınıza yabancı eller için en yaygın kapı budur.",
          ] },
          { h: "Adım 3: bant ve kanalı akıllıca seçin", p: [
            "Güncel router 2,4 ve 5 GHz yayınlar. Kural basit: 5 GHz bilen ve yakında duran her şey oraya (hızlı ve boş); akıllı ev sensörleri ve uzak cihazlar 2,4'te kalır (uzun menzil).",
            "Apartmanda kanalları elle ayarlayın: 2,4 GHz için analiz uygulamasına göre 1, 6 veya 11. Ucuz router'ların otomatiği çoğu kez dolu kanala yapışır.",
          ] },
          { h: "Adım 4: misafir ağı açın", p: [
            "Misafir ağı, konuklar ve akıllı cihazlar için ayrı Wi-Fi'dır: bilgisayarlarınıza, disklere ve kameralara erişemezler. Misafir ağındaki kırılmış akıllı ampul daha öteye geçemez.",
            "Ofiste bu seçenek değil normdur: misafirler ve kişisel telefonlar misafir segmentinde, iş makineleri ve yazıcılar ana ağda. Düzgün ekipmanda bu VLAN'larla yapılır.",
          ] },
          { h: "Adım 5: DHCP ve adres rezervasyonu", p: [
            "Başvurduğunuz cihazlara — yazıcı, kamera, kayıt cihazı, NAS — DHCP rezervasyonuyla sabit IP verin. Yoksa adres bir gün değişir ve 'kaybolan' yazıcıyı bütün ofis arar.",
            "DHCP aralığını paylı bırakın: tipik hata, elli telefon artı dizüstülerin olduğu ofiste 50 adreslik havuzdur — gün ortasında yeni cihazlar bağlanamaz olur.",
          ] },
          { h: "Adım 6: kameralara dışarıdan erişim — port açmadan", p: [
            "Klasik port yönlendirme geçen on yılın yöntemidir: dışarı açık kayıt cihazı portunu tarayıcılar saatler içinde bulur. Doğru yollar: üreticinin bulut P2P erişimi (Hik-Connect ve benzerleri) veya router'a VPN.",
            "VPN iş için en güvenilir seçenektir: dışarıya hiçbir şey açık değildir ve her yerden ağa ofisteymiş gibi girersiniz. Güncel router'lar WireGuard'ı bir akşamda kaldırır.",
          ] },
          { h: "Adım 7: hızı ölçün ve ayarları not edin", p: [
            "Kurulumdan sonra hızı kabloyla ve router'ın yanında Wi-Fi ile ölçün: gerçek tavanı öğrenir, uzak odada suçu servis sağlayıcıya atmazsınız. Yönetici şifresini güvenli bir yere yazın — unutulan şifre yüzünden sıfırlama, her şeyi yeniden kurmak demektir.",
            "Tüm adımlardan sonra ağ hâlâ yavaşsa veya yetmiyorsa, sorun artık ayarlarda değil kapsama veya donanımdadır. Her ölçekte ağ kuruyor ve yapılandırıyoruz — daireden ofise: gelir, çözer, yaparız.",
          ] },
        ],
        faq: [
          { q: "Router'ı 'önlem olarak' yeniden başlatmalı mıyım?", a: "Sağlıklı router aylarca yeniden başlatılmadan çalışır. Yalnızca günlük reset yardım ediyorsa cihaz ısınıyor, yükü taşıyamıyor veya yazılım hatasına takılıyordur; bu ritüel değil, güncelleme ya da değiştirme nedenidir." },
          { q: "Sağlayıcının router'ı — kalsın mı, kendiminkini mi kurayım?", a: "Sağlayıcınınki temeli genelde karşılar. Kendi router'ı düzgün Wi-Fi, VPN, misafir ağları ve VLAN için kurulur. Çoğu kez en iyisi, sağlayıcınınkini köprü moduna alıp her şeyi kendininkine bırakmaktır." },
          { q: "Ev router'ı kaç cihaz taşır?", a: "Bütçe modeller dürüstçe 15–25 aktif istemci taşır, sonra kopmalar başlar. Akıllı cihazlı ev kolayca elliye ulaşır — o zaman üst sınıf router'a veya router artı erişim noktalarına bakın." },
        ],
      },
      zh: {
        title: "路由器正确设置指南：七步清单",
        excerpt: "家用或办公路由器不能“开箱就用”：密码、Wi-Fi、访客网络、固件、摄像机远程访问。做完这七步，网络既好用又安全。",
        sections: [
          { h: "第一步：两个密码都要改", p: [
            "路由器有两个密码，总被搞混：Wi-Fi密码（连网用）和管理员密码（进设置用）。admin/admin这类出厂管理密码全网的机器人都知道——首次开机就把两个都改掉。",
            "好的Wi-Fi密码是一句长口令，不是八位加个大写字母。破解靠穷举，长度胜过复杂度：三个不相关的词比“Qwerty1!”结实。",
          ] },
          { h: "第二步：升级固件", p: [
            "攻破路由器的不是“连帽衫黑客”，而是满网扫描旧漏洞的自动化网络。升级固件即可堵住已知漏洞——在“升级”菜单或厂商App里五分钟搞定。",
            "顺手确认：如果不是刻意使用，就关掉从互联网远程管理设置的功能。这是外人进入您网络最常见的门。",
          ] },
          { h: "第三步：明智选择频段和信道", p: [
            "现代路由器同时发2.4和5GHz。规则简单：支持5GHz且离得近的设备都放5GHz（快而空）；智能家居传感器和远处设备留在2.4GHz（穿透远）。",
            "居民楼里信道最好手动指定：2.4GHz按分析App结果选1、6或11。廉价路由器的自动选择常“粘”在拥挤信道上。",
          ] },
          { h: "第四步：开访客网络", p: [
            "访客网络是给客人和智能设备的独立Wi-Fi：它们碰不到您的电脑、硬盘和摄像机。被攻破的智能灯泡困在访客网络里，再也爬不进来。",
            "办公室里这不是选项而是规范：访客和员工私人手机进访客段，办公电脑和打印机在主网。像样的设备上用VLAN实现。",
          ] },
          { h: "第五步：DHCP与地址保留", p: [
            "常被访问的设备——打印机、摄像机、录像机、NAS——用DHCP保留固定IP。否则哪天地址一变，全办公室找“消失”的打印机。",
            "DHCP地址池要留余量：典型错误是五十部手机加笔记本的办公室只设50个地址，中午新设备就连不上了。",
          ] },
          { h: "第六步：外网看摄像机——不开端口映射", p: [
            "传统端口映射是上个十年的做法：暴露在外的录像机端口几小时就被扫描到。正确途径：厂商云P2P（Hik-Connect之类）或到路由器的VPN。",
            "VPN是商用最稳的选择：对外什么都不开放，而您在任何地方都像在办公室一样进内网。现代路由器一个晚上就能架好WireGuard。",
          ] },
          { h: "第七步：测速并记下设置", p: [
            "设置完后分别用网线和路由器旁的Wi-Fi测速：知道真实上限，就不会在远房间错怪运营商。管理员密码记到可靠的地方——忘密码重置路由器等于一切重来。",
            "七步做完网络仍卡或覆盖不够——问题已不在设置，而在覆盖或硬件。任何规模的网络我们都能搭——从住宅到办公室：上门、诊断、干活。",
          ] },
        ],
        faq: [
          { q: "需要“定期重启”路由器吗？", a: "健康的路由器几个月不重启也正常。若只有每天重启才救得了——设备过热、带不动负载或固件有病；这是升级或换机的理由，不是仪式。" },
          { q: "运营商的路由器留着还是换自己的？", a: "运营商的盒子应付基础够用。换自己的是为了像样的Wi-Fi、VPN、访客网络和VLAN。常见最优解：运营商设备改桥接，一切交给自己的路由器。" },
          { q: "家用路由器带得动多少设备？", a: "入门型号老老实实带15–25个活跃终端，再多就开始掉线。智能设备多的家轻松过五十——那就看更高档的路由器，或路由器加接入点的组合。" },
        ],
      },
    },
  },
  {
    slug: "kamera-ploho-pokazyvaet",
    date: "2026-09-03",
    related: ["cctv"],
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
    loc: {
      ru: {
        title: "Камера видеонаблюдения плохо показывает: причины и лечение",
        excerpt: "Мутная картинка, засветка ночью, рябь и подтормаживание — разбираем типовые причины плохого изображения с камер и что с каждой делать: от протирки объектива до настроек битрейта.",
        sections: [
          { h: "Мутное или размытое изображение", p: [
            "Первая и самая частая причина банальна: грязный объектив. Пыль, дождевые разводы, паутина за пару месяцев превращают картинку в туман — протрите купол или стекло мягкой салфеткой, и «сломанная» камера чинится за минуту.",
            "Если после протирки мутность осталась — проверьте фокус. У вариофокальных камер он сбивается от вибраций; подстройка делается кольцом на объективе или моторизованно из меню. Третья причина — конденсат внутри купола: значит, нарушена герметичность, и камере нужен сервис до того, как влага убьёт плату.",
          ] },
          { h: "Ночью всё в засветке или темноте", p: [
            "Классика ночных проблем — ИК-подсветка бьёт в препятствие: козырёк, стену, ветку или паутину прямо перед объективом. Отражённый свет превращает кадр в белое молоко. Лечится переносом камеры или зачисткой поля обзора.",
            "Если ночью просто темно — проверьте, включается ли ИК (красное свечение диодов), и не выставлен ли в настройках принудительный дневной режим. Для больших дворов штатной подсветки может не хватать: решается ИК-прожектором или камерой с большей дальностью подсветки.",
          ] },
          { h: "Картинка дёргается или рассыпается", p: [
            "Рябь, артефакты и рассыпание — почти всегда сеть или питание. По витой паре больше 100 метров сигнал деградирует; плохие обжимы и скрутки дают потери пакетов. Проверьте кабель тестером и переобожмите коннекторы.",
            "Если камер много и все подтормаживают — смотрите на коммутатор: суммарный поток камер мог упереться в его возможности, а PoE-бюджет — в потолок. Симптом PoE-голодания: камеры перезагружаются ночью, когда включается подсветка.",
          ] },
          { h: "Изображение есть, но качество «мыльное» в записи", p: [
            "Живая картинка нормальная, а архив мутный — это настройки записи: занижен битрейт или разрешение записи меньше, чем у камеры. Регистратор так экономит место на диске — ценой читаемости номеров и лиц.",
            "Поднимите битрейт и разрешение записи для важных камер и пересчитайте глубину архива: возможно, понадобится диск побольше. Лучше 20 суток читаемого архива, чем 60 суток мыла.",
          ] },
          { h: "Камера «слепнет» днём от солнца", p: [
            "Контровый свет — солнце или яркое окно в кадре — превращает людей в силуэты. Полностью убирает проблему только правильный ракурс при монтаже, частично — режим WDR (широкий динамический диапазон) в настройках.",
            "Если камера смотрит на въезд против солнца, а перевесить нельзя — помогает камера с честным аппаратным WDR от 120 дБ. Это тот случай, когда замена одной камеры дешевле, чем ежедневные слепые часы.",
          ] },
          { h: "Когда звать специалистов", p: [
            "Зовите, если: мутность не уходит после чистки, конденсат внутри, картинка рассыпается на нескольких камерах сразу, или система в принципе не давала читаемой картинки с монтажа — вероятно, ошибки проекта: не те фокусные, не те ракурсы.",
            "Мы диагностируем системы любых брендов: приезжаем, проверяем камеры, сеть, питание и настройки, даём дефектную ведомость. Дальше вы решаете — чинить точечно или модернизировать. Выезд по Ташкенту бесплатный.",
          ] },
        ],
        faq: [
          { q: "Почему камера показывает чёрно-белым днём?", a: "Камера застряла в ночном режиме: чаще всего залип ИК-фильтр (слышны щелчки при переключении) или в настройках принудительно включён ночной режим. Перезагрузите камеру; если не помогло — фильтру нужен сервис." },
          { q: "Помогут ли настройки «резкости» в меню?", a: "Чуть-чуть: цифровая резкость подчёркивает контуры, но не возвращает детали. Мутность лечится чисткой, фокусом и битрейтом, а не ползунком Sharpness." },
          { q: "Сколько стоит диагностика?", a: "По Ташкенту выезд и осмотр бесплатны: проверим камеры, сеть и настройки, назовём причину и цену устранения до начала работ." },
        ],
      },
      uz: {
        title: "Videokuzatuv kamerasi yomon ko'rsatyapti: sabablar va davosi",
        excerpt: "Xira tasvir, kechasi yorug'lik urishi, shovqin va tormozlanish — kameralardan yomon tasvirning tipik sabablarini va har biri bilan nima qilishni ko'rib chiqamiz: obyektivni artishdan bitreyt sozlamalarigacha.",
        sections: [
          { h: "Xira yoki loyqa tasvir", p: [
            "Birinchi va eng ko'p uchraydigan sabab oddiy: iflos obyektiv. Chang, yomg'ir izlari, o'rgimchak to'ri bir-ikki oyda tasvirni tumanga aylantiradi — gumbaz yoki oynani yumshoq salfetka bilan arting, «buzilgan» kamera bir daqiqada tuzaladi.",
            "Artishdan keyin xiralik qolsa — fokusni tekshiring. Variofokal kameralarda u tebranishdan buziladi; obyektivdagi halqa bilan yoki menyudan motorli sozlanadi. Uchinchi sabab — gumbaz ichidagi kondensat: demak germetiklik buzilgan va namlik platani o'ldirishidan oldin kameraga servis kerak.",
          ] },
          { h: "Kechasi hammasi yorug'likda yoki qorong'ida", p: [
            "Tungi muammolar klassikasi — IK-yoritish to'siqqa uradi: kozyryok, devor, shox yoki obyektiv oldidagi o'rgimchak to'ri. Qaytgan yorug'lik kadrni oq sutga aylantiradi. Kamerani ko'chirish yoki ko'rish maydonini tozalash bilan davolanadi.",
            "Kechasi shunchaki qorong'i bo'lsa — IK yonayotganini tekshiring (diodlarning qizil nuri) va sozlamalarda majburiy kunduzgi rejim qo'yilmaganmi. Katta hovlilarga shtatniy yoritish yetmasligi mumkin: IK-projektor yoki yoritish masofasi kattaroq kamera bilan hal qilinadi.",
          ] },
          { h: "Tasvir titraydi yoki sochiladi", p: [
            "Shovqin, artefaktlar va sochilish — deyarli doim tarmoq yoki quvvat. Vitaya para bo'ylab 100 metrdan ortiqda signal buziladi; yomon objimlar va skrutkalar paket yo'qotishlarini beradi. Kabelni tester bilan tekshiring va konnektorlarni qayta objimlang.",
            "Kameralar ko'p va hammasi tormozlansa — kommutatorga qarang: kameralarning umumiy oqimi uning imkoniyatlariga, PoE-byudjet esa shipga tiralgan bo'lishi mumkin. PoE-ochligining simptomi: kechasi yoritish yonganda kameralar qayta yuklanadi.",
          ] },
          { h: "Tasvir bor, lekin yozuvda sifat «sovunli»", p: [
            "Jonli tasvir normal, arxiv esa xira — bu yozuv sozlamalari: bitreyt pasaytirilgan yoki yozuv ruxsati kameranikidan kichik. Registrator diskda joy tejaydi — raqam va yuzlar o'qilishi hisobiga.",
            "Muhim kameralarga yozuv bitreyti va ruxsatini ko'taring va arxiv chuqurligini qayta hisoblang: kattaroq disk kerak bo'lishi mumkin. 60 sutka sovundan 20 sutka o'qiladigan arxiv yaxshi.",
          ] },
          { h: "Kamera kunduzi quyoshdan «ko'r bo'ladi»", p: [
            "Kontr yorug'lik — kadrda quyosh yoki yorqin deraza — odamlarni siluetga aylantiradi. Muammoni to'liq faqat montajdagi to'g'ri rakurs yo'q qiladi, qisman — sozlamalardagi WDR (keng dinamik diapazon) rejimi.",
            "Kamera quyoshga qarshi kirishga qarasa va ko'chirib bo'lmasa — 120 dB dan halol apparat WDR li kamera yordam beradi. Bu bitta kamerani almashtirish har kungi ko'r soatlardan arzon bo'lgan holat.",
          ] },
          { h: "Qachon mutaxassislarni chaqirish kerak", p: [
            "Chaqiring, agar: xiralik tozalashdan keyin ketmasa, ichida kondensat bo'lsa, tasvir bir nechta kamerada birdan sochilsa, yoki tizim montajdan beri umuman o'qiladigan tasvir bermagan bo'lsa — ehtimol loyiha xatolari: fokuslar va rakurslar noto'g'ri.",
            "Biz istalgan brend tizimlarini diagnostika qilamiz: kelamiz, kamera, tarmoq, quvvat va sozlamalarni tekshiramiz, nuqson vedomostini beramiz. Keyin siz hal qilasiz — nuqtali tuzatish yoki modernizatsiya. Toshkent bo'ylab chiqish bepul.",
          ] },
        ],
        faq: [
          { q: "Nega kamera kunduzi oq-qora ko'rsatadi?", a: "Kamera tungi rejimda qotib qolgan: ko'pincha IK-filtr yopishgan (almashishda chiqillash eshitiladi) yoki sozlamalarda tungi rejim majburiy yoqilgan. Kamerani qayta yuklang; yordam bermasa — filtrga servis kerak." },
          { q: "Menyudagi «keskinlik» sozlamalari yordam beradimi?", a: "Ozgina: raqamli keskinlik konturlarni bo'rttiradi, lekin detallarni qaytarmaydi. Xiralik tozalash, fokus va bitreyt bilan davolanadi, Sharpness polzunogi bilan emas." },
          { q: "Diagnostika qancha turadi?", a: "Toshkent bo'ylab chiqish va ko'rik bepul: kamera, tarmoq va sozlamalarni tekshiramiz, sabab va bartaraf etish narxini ishlar boshlanishidan oldin aytamiz." },
        ],
      },
      en: {
        title: "A CCTV camera shows a poor picture: causes and cures",
        excerpt: "A blurry image, night glare, noise and stutter — the typical causes of a bad camera picture and what to do about each: from wiping the lens to bitrate settings.",
        sections: [
          { h: "A hazy or blurred image", p: [
            "The first and most common cause is banal: a dirty lens. Dust, rain streaks and cobwebs turn the picture into fog within a couple of months — wipe the dome or glass with a soft cloth and the 'broken' camera is fixed in a minute.",
            "If the haze stays after cleaning, check the focus. On varifocal cameras it drifts with vibration; it is adjusted by the lens ring or motorized from the menu. The third cause is condensation inside the dome: the seal has failed, and the camera needs service before moisture kills the board.",
          ] },
          { h: "At night everything glares or goes dark", p: [
            "The classic night problem: IR illumination hitting an obstacle — a hood, a wall, a branch or a cobweb right in front of the lens. The reflected light turns the frame into white milk. Cured by moving the camera or clearing its field of view.",
            "If the night is simply dark, check that the IR turns on (a red glow of the diodes) and that a forced day mode is not set. For large yards the built-in illumination may not be enough: an IR floodlight or a camera with longer IR range solves it.",
          ] },
          { h: "The picture stutters or breaks apart", p: [
            "Noise, artifacts and break-up are almost always the network or the power. Beyond 100 meters of twisted pair the signal degrades; bad crimps and twisted joints lose packets. Test the cable and re-crimp the connectors.",
            "If there are many cameras and all of them stutter, look at the switch: the combined stream may have hit its limits, and the PoE budget its ceiling. The PoE-starvation symptom: cameras reboot at night when the IR turns on.",
          ] },
          { h: "Live view is fine, but recordings are 'soapy'", p: [
            "A normal live picture with a muddy archive means recording settings: the bitrate is lowered or the recording resolution is below the camera's. The recorder saves disk space — at the cost of readable plates and faces.",
            "Raise the recording bitrate and resolution for the important cameras and recount the archive depth: a bigger disk may be needed. Twenty days of readable archive beat sixty days of soap.",
          ] },
          { h: "The camera goes blind in daytime sun", p: [
            "Backlight — the sun or a bright window in the frame — turns people into silhouettes. Only the right mounting angle removes the problem fully; WDR (wide dynamic range) in the settings helps partially.",
            "If the camera faces an entrance against the sun and cannot be moved, a camera with true hardware WDR of 120 dB or more helps. That is the case where replacing one camera is cheaper than daily blind hours.",
          ] },
          { h: "When to call the specialists", p: [
            "Call if: the haze survives cleaning, there is condensation inside, the picture breaks up on several cameras at once, or the system never produced a readable image since installation — likely design mistakes: wrong focal lengths, wrong angles.",
            "We diagnose systems of any brand: we come, check the cameras, network, power and settings, and hand over a defect list. Then you decide — fix pointwise or modernize. The visit is free in Tashkent.",
          ] },
        ],
        faq: [
          { q: "Why does the camera show black and white in daytime?", a: "It is stuck in night mode: usually a jammed IR-cut filter (you can hear clicking when it switches) or a forced night mode in the settings. Reboot the camera; if that does not help, the filter needs service." },
          { q: "Will the 'sharpness' settings help?", a: "A little: digital sharpness emphasizes contours but does not bring back detail. Haze is cured by cleaning, focus and bitrate, not by the Sharpness slider." },
          { q: "What does diagnostics cost?", a: "In Tashkent the visit and inspection are free: we check the cameras, network and settings, and name the cause and the repair price before any work starts." },
        ],
      },
      tr: {
        title: "Güvenlik kamerası kötü gösteriyor: nedenler ve çözümler",
        excerpt: "Bulanık görüntü, gece parlaması, parazit ve takılma — kameralardan kötü görüntünün tipik nedenleri ve her biriyle ne yapılacağı: lens silmekten bit hızı ayarlarına.",
        sections: [
          { h: "Bulanık veya flu görüntü", p: [
            "İlk ve en yaygın neden basit: kirli lens. Toz, yağmur izleri ve örümcek ağı birkaç ayda görüntüyü sise çevirir — kubbeyi veya camı yumuşak bezle silin, 'bozuk' kamera bir dakikada düzelir.",
            "Silmeden sonra bulanıklık kalıyorsa odağı kontrol edin. Varifokal kameralarda titreşimle kayar; lens halkasıyla veya menüden motorlu ayarlanır. Üçüncü neden kubbe içindeki yoğuşmadır: sızdırmazlık bozulmuştur ve nem kartı öldürmeden kameraya servis gerekir.",
          ] },
          { h: "Gece her yer parlıyor veya karanlık", p: [
            "Gece sorunlarının klasiği: IR aydınlatmanın bir engele vurması — siperlik, duvar, dal veya lensin hemen önündeki ağ. Yansıyan ışık kareyi beyaz süte çevirir. Kamerayı taşımak veya görüş alanını temizlemekle geçer.",
            "Gece sadece karanlıksa IR'nin yandığını (diyotların kızıl parıltısı) ve ayarlarda zorunlu gündüz modu olmadığını kontrol edin. Büyük avlulara dahili aydınlatma yetmeyebilir: IR projektör veya daha uzun menzilli kamera çözer.",
          ] },
          { h: "Görüntü takılıyor veya dağılıyor", p: [
            "Parazit, artefakt ve dağılma hemen hep ağ veya güçtür. 100 metreyi aşan bakırda sinyal bozulur; kötü sıkmalar ve ekler paket kaybettirir. Kabloyu test edin, konnektörleri yeniden sıkın.",
            "Kamera çoksa ve hepsi takılıyorsa switch'e bakın: toplam akış sınırına, PoE bütçesi tavanına dayanmış olabilir. PoE açlığının belirtisi: geceleri IR yanınca kameraların yeniden başlaması.",
          ] },
          { h: "Canlı görüntü iyi, kayıt 'sabunlu'", p: [
            "Canlı normal, arşiv bulanıksa bu kayıt ayarlarıdır: bit hızı düşürülmüş veya kayıt çözünürlüğü kameranınkinden düşük. Kayıt cihazı disk yerinden tasarruf eder — plaka ve yüz okunurluğu pahasına.",
            "Önemli kameralarda kayıt bit hızını ve çözünürlüğünü yükseltin, arşiv derinliğini yeniden hesaplayın: daha büyük disk gerekebilir. Altmış gün sabundansa yirmi gün okunur arşiv iyidir.",
          ] },
          { h: "Kamera gündüz güneşten kör oluyor", p: [
            "Ters ışık — karede güneş veya parlak pencere — insanları silüete çevirir. Sorunu tam olarak yalnızca montajdaki doğru açı giderir; ayarlardaki WDR (geniş dinamik aralık) kısmen yardım eder.",
            "Kamera güneşe karşı girişe bakıyorsa ve taşınamıyorsa, 120 dB ve üzeri gerçek donanım WDR'li kamera yardım eder. Bu, tek kamerayı değiştirmenin günlük kör saatlerden ucuz olduğu durumdur.",
          ] },
          { h: "Uzmanlar ne zaman çağrılır", p: [
            "Şu durumlarda çağırın: bulanıklık temizlikten sonra geçmiyor, içeride yoğuşma var, görüntü birkaç kamerada birden dağılıyor veya sistem montajdan beri okunur görüntü hiç vermedi — muhtemelen proje hataları: yanlış odaklar, yanlış açılar.",
            "Her markanın sistemine bakıyoruz: gelir, kameraları, ağı, gücü ve ayarları kontrol eder, kusur listesi veririz. Sonra siz karar verirsiniz — noktasal onarım mı modernizasyon mu. Taşkent'te ziyaret ücretsiz.",
          ] },
        ],
        faq: [
          { q: "Kamera gündüz neden siyah-beyaz gösteriyor?", a: "Gece modunda takılı kalmış: çoğu kez IR-cut filtresi sıkışmıştır (geçişte tıkırtı duyulur) veya ayarlarda gece modu zorlanmıştır. Kamerayı yeniden başlatın; geçmezse filtreye servis gerekir." },
          { q: "Menüdeki 'keskinlik' ayarı yardım eder mi?", a: "Birazcık: dijital keskinlik konturları vurgular ama ayrıntıyı geri getirmez. Bulanıklık temizlik, odak ve bit hızıyla geçer, Sharpness kaydırıcısıyla değil." },
          { q: "Teşhis kaça mal olur?", a: "Taşkent'te ziyaret ve inceleme ücretsiz: kameraları, ağı ve ayarları kontrol eder, nedeni ve giderme fiyatını iş başlamadan söyleriz." },
        ],
      },
      zh: {
        title: "监控摄像机画面差：原因与对策",
        excerpt: "画面模糊、夜间泛白、雪花和卡顿——逐一拆解摄像机画质差的典型原因及处理办法：从擦镜头到码流设置。",
        sections: [
          { h: "画面发雾或模糊", p: [
            "第一大原因很平常：镜头脏了。灰尘、雨痕、蛛网几个月就把画面糊成雾——用软布擦净球罩或玻璃，“坏了”的摄像机一分钟修好。",
            "擦完仍模糊就查对焦。变焦摄像机的焦点会被振动带偏；用镜头调节环或菜单里电动调整。第三个原因是罩内结露：说明密封失效，趁潮气毁掉主板之前送修。",
          ] },
          { h: "夜里一片白或一片黑", p: [
            "夜间问题的经典：红外补光打在障碍物上——遮檐、墙面、树枝或镜头前的蛛网。反射光把画面变成白雾。挪机位或清理视场即可。",
            "如果夜里只是黑——检查红外是否点亮（灯珠泛红光）、设置里是否强制了白天模式。大院子自带补光可能不够：加红外射灯或换补光距离更远的机型。",
          ] },
          { h: "画面抖动或碎裂", p: [
            "雪花、马赛克和碎裂几乎都是网络或供电问题。网线超过100米信号劣化；水晶头压接差、有接头会丢包。用测线仪查线、重新压接。",
            "如果多台摄像机同时卡顿——看交换机：总码流可能顶到了背板上限，PoE预算也可能见顶。PoE不足的典型症状：夜里红外一开摄像机就重启。",
          ] },
          { h: "实时画面正常，回放却“糊”", p: [
            "实时清晰、录像模糊——是录像参数：码流被压低或录像分辨率低于摄像机本身。录像机在省硬盘——代价是车牌和人脸读不出来。",
            "把重点摄像机的录像码流和分辨率提上去，重新核算存档天数：可能需要更大的硬盘。20天能看清的录像胜过60天的糊片。",
          ] },
          { h: "白天被太阳晃瞎", p: [
            "逆光——画面里有太阳或亮窗——把人拍成剪影。彻底解决只有安装时选对机位；设置里的宽动态（WDR）能缓解一部分。",
            "如果摄像机只能逆光对着入口，换不了机位——上真硬件宽动态120dB以上的机型。这种情况换一台摄像机比每天几个小时的盲区便宜。",
          ] },
          { h: "什么时候请专业人员", p: [
            "这些情况请人：清洁后仍发雾、罩内结露、多台同时花屏，或系统从装好起就没出过能看清的画面——多半是设计错误：焦距不对、机位不对。",
            "任何品牌的系统我们都能诊断：上门检查摄像机、网络、供电和设置，出具缺陷清单。之后由您决定——逐点修还是升级。塔什干范围上门免费。",
          ] },
        ],
        faq: [
          { q: "摄像机白天为什么是黑白的？", a: "卡在夜间模式了：多半是红外滤片卡住（切换时能听到咔哒声）或设置里强制了夜间模式。重启摄像机；无效则滤片需要检修。" },
          { q: "菜单里的“锐度”有用吗？", a: "作用有限：数字锐化只描边，不还原细节。模糊要靠清洁、对焦和码流解决，不靠Sharpness滑块。" },
          { q: "诊断多少钱？", a: "塔什干范围上门检查免费：查摄像机、网络和设置，开工前告知原因和修复价格。" },
        ],
      },
    },
  },
  {
    slug: "signalizatsiya-narxi",
    date: "2026-09-03",
    related: ["alarm", "cctv"],
    loc: {
      ru: {
        title: "Сколько стоит охранная сигнализация для дома и магазина",
        excerpt: "Из чего складывается цена охранной сигнализации в Ташкенте: датчики, панель, монтаж, пультовая охрана. Ориентиры по типам объектов и на чём можно сэкономить без потери защиты.",
        sections: [
          { h: "Из чего складывается цена", p: [
            "Смета охранной сигнализации — это четыре части: контрольная панель (мозг системы), датчики (движение, открытие, разбитие стекла), оповещение (сирена, приложение, при желании пульт охраны) и монтаж. Панель и датчики — основная часть стоимости оборудования.",
            "Главная развилка — проводная или беспроводная система. Беспроводная дороже по железу, но монтируется за полдня без штробления: для готового ремонта почти всегда выгоднее. Проводная дешевле в оборудовании и вечна по батарейкам, но требует прокладки кабеля — её закладывают на этапе ремонта.",
          ] },
          { h: "Квартира и дом", p: [
            "Базовый набор для квартиры: панель, два-три датчика движения, датчики открытия на входную дверь, сирена. Управление — с брелока или из приложения, уведомления о тревоге приходят на телефон.",
            "Для частного дома добавляются уличный периметр: датчики открытия на все двери и окна первого этажа, уличная сирена, при желании — уличные датчики движения с защитой от животных. Дом дороже квартиры в полтора-два раза за счёт числа зон.",
          ] },
          { h: "Магазин и офис", p: [
            "В коммерческом объекте сигнализация решает две задачи: ночная охрана помещения и тревожная кнопка на случай конфликта днём. Датчики движения в зале и подсобке, датчики открытия и разбития на витринах, раздельная постановка зон — склад под охраной, пока зал работает.",
            "Практически всегда сигнализацию здесь связывают с видеонаблюдением: тревога приходит с кадром, и вы за секунды понимаете — это грабитель или кошка задела коробку. Такая связка почти полностью убирает ложные выезды.",
          ] },
          { h: "Пультовая охрана: подключать или нет", p: [
            "Сигнализация с уведомлением в телефон дешевле, но ночью в три часа реагировать на тревогу придётся вам. Подключение к пульту охранной компании добавляет ежемесячную плату, зато на объект едет экипаж.",
            "Разумный компромисс для многих объектов: свои уведомления с видеоподтверждением плюс тревожная кнопка на пульт. Мы монтируем системы под любой сценарий и помогаем с подключением к пультовым компаниям.",
          ] },
          { h: "На чём можно и нельзя экономить", p: [
            "Можно: не ставить датчики в каждом помещении — грамотная расстановка перекрывает пути движения нарушителя меньшим числом зон; взять панель без лишних модулей расширения; совместить сигнализацию с уже существующими камерами.",
            "Нельзя: на резервном питании (отключение света не должно снимать объект с охраны), на датчиках дешёвых марок с ложными срабатываниями и на монтаже «своими силами» — криво поставленный датчик либо молчит, либо будит вас каждую ночь.",
          ] },
          { h: "Как узнать точную цену", p: [
            "Точная смета появляется после осмотра: число зон, длина трасс, проводная или беспроводная схема. По Ташкенту выезд инженера и расчёт бесплатны — приедем, посчитаем и предложим два-три варианта под бюджет.",
            "Работаем с проверенным оборудованием — беспроводные комплекты Hikvision AX PRO и проводные системы для крупных объектов, всё со склада с гарантией и обслуживанием.",
          ] },
        ],
        faq: [
          { q: "Сколько служат батарейки в беспроводных датчиках?", a: "Обычно два-четыре года в зависимости от датчика и частоты срабатываний. Система сама предупреждает о разряде заранее — замена занимает минуты." },
          { q: "Можно ли поставить сигнализацию в съёмную квартиру?", a: "Да, беспроводной комплект ставится без сверления и переезжает вместе с вами: панель и датчики крепятся на двусторонний скотч и демонтируются без следов." },
          { q: "Что лучше: сигнализация или камеры?", a: "Это разные задачи: камеры фиксируют и показывают, сигнализация — мгновенно поднимает тревогу. Лучший результат даёт связка: тревога с видеоподтверждением без ложных вызовов." },
        ],
      },
      uz: {
        title: "Uy va do'kon uchun qo'riqlash signalizatsiyasi qancha turadi",
        excerpt: "Toshkentda qo'riqlash signalizatsiyasi narxi nimadan yig'iladi: datchiklar, panel, montaj, pult qo'riqlovi. Obyekt turlari bo'yicha mo'ljallar va himoyani yo'qotmasdan nimada tejash mumkin.",
        sections: [
          { h: "Narx nimadan yig'iladi", p: [
            "Qo'riqlash signalizatsiyasi smetasi — to'rt qism: nazorat paneli (tizim miyasi), datchiklar (harakat, ochilish, oyna sinishi), ogohlantirish (sirena, ilova, xohishga qarab qo'riqlash pulti) va montaj. Panel va datchiklar — uskuna narxining asosiy qismi.",
            "Bosh tanlov — simli yoki simsiz tizim. Simsiz temir bo'yicha qimmatroq, lekin shtrobsiz yarim kunda o'rnatiladi: tayyor ta'mir uchun deyarli doim foydaliroq. Simli uskunada arzonroq va batareykalar bo'yicha abadiy, lekin kabel yotqizishni talab qiladi — uni ta'mir bosqichida qo'yishadi.",
          ] },
          { h: "Kvartira va uy", p: [
            "Kvartira uchun bazaviy to'plam: panel, ikki-uchta harakat datchigi, kirish eshigiga ochilish datchiklari, sirena. Boshqaruv — brelokdan yoki ilovadan, trevoga bildirishnomalari telefonga keladi.",
            "Xususiy uyga ko'cha perimetri qo'shiladi: birinchi qavatning barcha eshik va derazalariga ochilish datchiklari, ko'cha sirenasi, xohishga qarab — hayvonlardan himoyali ko'cha harakat datchiklari. Uy zonalar soni hisobiga kvartiradan bir yarim-ikki baravar qimmat.",
          ] },
          { h: "Do'kon va ofis", p: [
            "Tijorat obyektida signalizatsiya ikki vazifani hal qiladi: xonani tungi qo'riqlash va kunduzgi nizo holatiga trevoga tugmasi. Zal va podsobkada harakat datchiklari, vitrinalarda ochilish va sinish datchiklari, zonalarni alohida qo'yish — zal ishlayotganda ombor qo'riqlovda.",
            "Bu yerda signalizatsiyani deyarli doim videokuzatuv bilan bog'lashadi: trevoga kadr bilan keladi va soniyalarda tushunasiz — bu o'g'rimi yoki mushuk qutini turtdimi. Bunday bog'lam yolg'on chiqishlarni deyarli butunlay yo'q qiladi.",
          ] },
          { h: "Pult qo'riqlovi: ulash kerakmi", p: [
            "Telefonga bildirishnomali signalizatsiya arzonroq, lekin kechasi soat uchda trevogaga o'zingiz javob berasiz. Qo'riqlash kompaniyasi pultiga ulanish oylik to'lov qo'shadi, evaziga obyektga ekipaj boradi.",
            "Ko'p obyektlar uchun oqilona kelishuv: video tasdiqli o'z bildirishnomalaringiz plus pultga trevoga tugmasi. Biz istalgan stsenariyga tizim o'rnatamiz va pult kompaniyalariga ulanishga yordam beramiz.",
          ] },
          { h: "Nimada tejash mumkin va mumkin emas", p: [
            "Mumkin: har xonaga datchik qo'ymaslik — savodli joylashtirish buzg'unchi harakat yo'llarini kamroq zona bilan yopadi; ortiqcha kengaytirish modullarisiz panel olish; signalizatsiyani mavjud kameralar bilan birlashtirish.",
            "Mumkin emas: zaxira quvvatda (svet o'chishi obyektni qo'riqlovdan olmasligi kerak), yolg'on ishlaydigan arzon marka datchiklarida va «o'z kuchi bilan» montajda — qiyshiq qo'yilgan datchik yo jim turadi, yo har kecha uyg'otadi.",
          ] },
          { h: "Aniq narxni qanday bilish mumkin", p: [
            "Aniq smeta ko'rikdan keyin chiqadi: zonalar soni, trassalar uzunligi, simli yoki simsiz sxema. Toshkent bo'ylab muhandis chiqishi va hisob bepul — kelamiz, hisoblaymiz va byudjetga ikki-uch variant taklif qilamiz.",
            "Sinalgan uskuna bilan ishlaymiz — Hikvision AX PRO simsiz komplektlari va yirik obyektlarga simli tizimlar, hammasi ombordan kafolat va xizmat bilan.",
          ] },
        ],
        faq: [
          { q: "Simsiz datchiklarda batareyka qancha ishlaydi?", a: "Odatda datchik va ishga tushishlar chastotasiga qarab ikki-to'rt yil. Tizim zaryadsizlanish haqida oldindan o'zi ogohlantiradi — almashtirish daqiqalar ishi." },
          { q: "Ijara kvartiraga signalizatsiya qo'yish mumkinmi?", a: "Ha, simsiz komplekt teshmasdan o'rnatiladi va siz bilan ko'chadi: panel va datchiklar ikki tomonlama skotchga yopishtiriladi va izsiz yechiladi." },
          { q: "Nima yaxshi: signalizatsiya yoki kameralar?", a: "Bu turli vazifalar: kameralar qayd etadi va ko'rsatadi, signalizatsiya — bir zumda trevoga ko'taradi. Eng yaxshi natijani bog'lam beradi: yolg'on chaqiriqlarsiz video tasdiqli trevoga." },
        ],
      },
      en: {
        title: "What a burglar alarm costs for a home or a store",
        excerpt: "What makes up the price of an intrusion alarm in Tashkent: sensors, panel, installation, central monitoring. Reference points by site type and where you can save without losing protection.",
        sections: [
          { h: "What the price is made of", p: [
            "An alarm estimate has four parts: the control panel (the system's brain), the sensors (motion, opening, glass break), the notification path (siren, app, optionally a monitoring station) and the installation. The panel and sensors carry most of the hardware cost.",
            "The main fork is wired versus wireless. Wireless costs more in hardware but installs in half a day with no chasing: for a finished renovation it almost always wins. Wired is cheaper in hardware and never needs batteries, but requires cabling — it is planned at renovation stage.",
          ] },
          { h: "Apartment and house", p: [
            "The base kit for an apartment: a panel, two or three motion sensors, opening sensors on the entrance door, a siren. Control from a fob or the app, alarm notifications on the phone.",
            "A private house adds an outdoor perimeter: opening sensors on every ground-floor door and window, an outdoor siren, optionally pet-immune outdoor motion sensors. A house costs one and a half to two times more than an apartment because of the zone count.",
          ] },
          { h: "Store and office", p: [
            "In a commercial site the alarm solves two tasks: guarding the premises at night and a panic button for daytime conflicts. Motion sensors in the hall and back room, opening and glass-break sensors on the storefront, separate arming by zone — the stockroom stays armed while the floor works.",
            "Here the alarm is almost always linked to CCTV: the alert arrives with a frame, and in seconds you know whether it is a burglar or a cat knocking over a box. That link removes almost all false call-outs.",
          ] },
          { h: "Central monitoring: to connect or not", p: [
            "An app-notification alarm is cheaper, but at three in the morning the one reacting is you. A monitoring company adds a monthly fee, and in exchange a patrol drives to the site.",
            "A sensible compromise for many sites: your own notifications with video confirmation plus a panic button wired to the station. We build systems for any scenario and help connect to monitoring companies.",
          ] },
          { h: "Where you can and cannot save", p: [
            "You can: skip a sensor in every room — smart placement covers the intruder's paths with fewer zones; take a panel without unused expansion modules; pair the alarm with cameras you already have.",
            "You cannot: on backup power (a blackout must not disarm the site), on cheap-brand sensors with false alarms, and on DIY installation — a badly placed sensor either stays silent or wakes you every night.",
          ] },
          { h: "How to get the exact price", p: [
            "The exact estimate appears after a survey: zone count, cable runs, wired or wireless scheme. In Tashkent the engineer's visit and the calculation are free — we come, count and offer two or three options for the budget.",
            "We work with proven equipment — Hikvision AX PRO wireless kits and wired systems for large sites, all from stock with warranty and service.",
          ] },
        ],
        faq: [
          { q: "How long do wireless sensor batteries last?", a: "Usually two to four years depending on the sensor and trigger frequency. The system warns about low charge in advance — replacement takes minutes." },
          { q: "Can I install an alarm in a rented apartment?", a: "Yes, a wireless kit installs without drilling and moves with you: the panel and sensors mount on tape and come off without a trace." },
          { q: "Which is better: an alarm or cameras?", a: "Different jobs: cameras record and show, an alarm raises the alert instantly. The best result is the pair: an alert with video confirmation and no false call-outs." },
        ],
      },
      tr: {
        title: "Ev ve mağaza için hırsız alarmı ne kadar tutar",
        excerpt: "Taşkent'te hırsız alarmı fiyatı neyden oluşur: sensörler, panel, montaj, merkez bağlantısı. Saha türüne göre referanslar ve korumadan ödün vermeden nerede tasarruf edilir.",
        sections: [
          { h: "Fiyat neyden oluşur", p: [
            "Alarm keşfi dört parçadır: kontrol paneli (sistemin beyni), sensörler (hareket, açılma, cam kırılması), bildirim yolu (siren, uygulama, istenirse merkez) ve montaj. Donanım maliyetinin çoğu panel ve sensörlerdedir.",
            "Ana yol ayrımı kablolu mu kablosuz mu. Kablosuz donanımda pahalıdır ama kanal açmadan yarım günde kurulur: bitmiş tadilatta neredeyse hep kazanır. Kablolu donanımda ucuzdur ve pil derdi yoktur, ama kablolama ister — tadilat aşamasında planlanır.",
          ] },
          { h: "Daire ve ev", p: [
            "Daire için temel set: panel, iki-üç hareket sensörü, giriş kapısına açılma sensörleri, siren. Kumandadan veya uygulamadan yönetim, alarm bildirimleri telefona düşer.",
            "Müstakil ev dış çevre ekler: zemin kattaki tüm kapı ve pencerelere açılma sensörleri, dış siren, istenirse hayvana duyarsız dış hareket sensörleri. Bölge sayısı yüzünden ev, daireden bir buçuk-iki kat pahalıdır.",
          ] },
          { h: "Mağaza ve ofis", p: [
            "Ticari sahada alarm iki iş görür: geceleri mekân koruması ve gündüz çatışmalarına panik butonu. Salonda ve arka odada hareket sensörleri, vitrinlerde açılma ve cam kırılması sensörleri, bölge bazlı ayrı kurma — salon çalışırken depo korumada kalır.",
            "Burada alarm hemen hep kameralarla bağlanır: uyarı kareyle gelir ve saniyeler içinde hırsız mı, kutuyu deviren kedi mi anlarsınız. Bu bağ, yanlış çağrıları neredeyse tamamen kaldırır.",
          ] },
          { h: "Merkez bağlantısı: bağlanmalı mı", p: [
            "Uygulama bildirimli alarm ucuzdur ama gece üçte tepki verecek olan sizsiniz. Güvenlik şirketi merkezi aylık ücret ekler; karşılığında sahaya ekip gider.",
            "Birçok saha için makul orta yol: video doğrulamalı kendi bildirimleriniz artı merkeze bağlı panik butonu. Her senaryoya sistem kurar, merkez şirketlerine bağlanmada yardım ederiz.",
          ] },
          { h: "Nerede tasarruf edilir, nerede edilmez", p: [
            "Edilir: her odaya sensör koymamak — akıllı yerleşim, davetsizin yollarını daha az bölgeyle kapatır; kullanılmayacak genişletme modülsüz panel almak; alarmı mevcut kameralarla eşlemek.",
            "Edilmez: yedek güçte (elektrik kesintisi sahayı korumadan düşürmemeli), yanlış alarm veren ucuz marka sensörlerde ve 'kendin yap' montajda — kötü yerleştirilen sensör ya susar ya her gece uyandırır.",
          ] },
          { h: "Kesin fiyat nasıl öğrenilir", p: [
            "Kesin keşif, saha turundan sonra çıkar: bölge sayısı, hat uzunlukları, kablolu veya kablosuz şema. Taşkent'te mühendis ziyareti ve hesap ücretsiz — gelir, sayar ve bütçeye iki-üç seçenek sunarız.",
            "Kanıtlanmış ekipmanla çalışıyoruz — Hikvision AX PRO kablosuz setleri ve büyük sahalara kablolu sistemler; hepsi stoktan, garantili ve servisli.",
          ] },
        ],
        faq: [
          { q: "Kablosuz sensör pilleri ne kadar gider?", a: "Sensöre ve tetiklenme sıklığına göre genelde iki-dört yıl. Sistem azalmayı önceden bildirir — değişim dakikalar sürer." },
          { q: "Kiralık daireye alarm kurulur mu?", a: "Evet, kablosuz set delmeden kurulur ve sizinle taşınır: panel ve sensörler bantla yapışır, iz bırakmadan sökülür." },
          { q: "Hangisi iyi: alarm mı kameralar mı?", a: "Farklı işler: kameralar kaydeder ve gösterir, alarm anında uyarır. En iyi sonucu ikili verir: yanlış çağrısız, video doğrulamalı uyarı." },
        ],
      },
      zh: {
        title: "家庭和商铺防盗报警系统要多少钱",
        excerpt: "塔什干防盗报警的价格构成：探测器、主机、安装、联网接警。按场所类型给出参考，以及哪些地方能省钱而不牺牲防护。",
        sections: [
          { h: "价格由什么构成", p: [
            "报警系统的预算分四块：主机（系统大脑）、探测器（移动、门磁、玻璃破碎）、通知渠道（警笛、App，可选接警中心）和安装费。设备成本主要在主机和探测器上。",
            "最大的分岔是有线还是无线。无线设备贵一些，但半天装完、不开槽：装修好的房子几乎总是选它。有线设备便宜、不用换电池，但要布线——在装修阶段规划。",
          ] },
          { h: "公寓与住宅", p: [
            "公寓基础套装：主机、两三个移动探测器、入户门门磁、警笛。遥控或App操作，报警推送到手机。",
            "独栋住宅要加室外周界：一层所有门窗装门磁、室外警笛，可选防宠物误报的室外移动探测器。因为防区多，住宅比公寓贵一倍半到两倍。",
          ] },
          { h: "商铺与办公室", p: [
            "商业场所的报警干两件事：夜间守护房屋、白天冲突时一键报警。卖场和后仓装移动探测器，橱窗装门磁和玻破，防区分开布防——卖场营业时仓库照样设防。",
            "这里几乎都会把报警和监控联动：警报带着画面推送，几秒就能分清是窃贼还是猫碰倒了箱子。这种联动基本消灭了误出警。",
          ] },
          { h: "要不要接联网接警", p: [
            "只推送手机的报警更便宜，但凌晨三点响铃时得您自己处理。接入保安公司的接警中心要交月费，换来的是出警车组。",
            "对很多场所合理的折中：自己收带视频确认的推送，另配一键报警接中心。任何方案我们都能施工，并协助对接接警公司。",
          ] },
          { h: "哪里能省、哪里不能省", p: [
            "能省：不必每间房都装探测器——合理布点用更少防区封住入侵路线；主机不买用不上的扩展模块；报警与已有摄像机联动。",
            "不能省：后备电源（停电不能让场所撤防）、爱误报的杂牌探测器、以及“自己动手”安装——装歪的探测器要么不响，要么每晚吵醒您。",
          ] },
          { h: "怎么拿到准确报价", p: [
            "准确预算要等勘察之后：防区数量、线路长度、有线或无线方案。塔什干范围内工程师上门和核算免费——上门测算，按预算给两三个方案。",
            "设备用经过验证的——无线选海康AX PRO套装，大型场所用有线系统，全部现货、含保修和维保。",
          ] },
        ],
        faq: [
          { q: "无线探测器的电池能用多久？", a: "视探测器和触发频率，通常两到四年。系统会提前提示电量不足——换电池只要几分钟。" },
          { q: "租的房子能装报警吗？", a: "能，无线套装免打孔安装，搬家可带走：主机和探测器用双面胶固定，拆下不留痕。" },
          { q: "报警和摄像机哪个更好？", a: "各司其职：摄像机负责记录和查看，报警负责即时示警。最好的效果是联动：带视频确认的警报，没有误出警。" },
        ],
      },
    },
  },
  {
    slug: "sbros-parolya-hikvision",
    date: "2026-09-03",
    related: ["cctv"],
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
    loc: {
      ru: {
        title: "Забыли пароль от камеры или регистратора Hikvision: что делать",
        excerpt: "Штатные способы восстановить доступ к своей камере или NVR Hikvision: SADP, код на почту, файл запроса в поддержку. Без «волшебных» кнопок и с честным ответом, когда поможет только сервис.",
        sections: [
          { h: "Сразу о главном", p: [
            "У современных устройств Hikvision нет кнопки, которая просто сбрасывает пароль: это сделано намеренно, чтобы чужой человек не получил доступ к вашим камерам за минуту. Восстановление всегда идёт через подтверждение, что устройство ваше.",
            "Все способы ниже — штатные, от производителя, и работают только при физическом доступе к устройству в одной сети с компьютером. Речь про ваше оборудование: доступ к чужим камерам — уголовная статья, и таких вопросов мы не решаем.",
          ] },
          { h: "Способ 1: код на привязанную почту", p: [
            "Если при активации устройства вы указали e-mail для восстановления — задача на пять минут. В веб-интерфейсе или в SADP нажмите «Forgot password»: устройство предложит отправить код подтверждения на привязанную почту.",
            "Вводите код — задаёте новый пароль. Это самый быстрый путь, и именно поэтому мы всегда привязываем почту при монтаже: проверьте, возможно ваш монтажник сделал так же.",
          ] },
          { h: "Способ 2: файл запроса через SADP", p: [
            "Скачайте утилиту SADP с сайта Hikvision, подключите компьютер в одну сеть с устройством. SADP найдёт его и покажет кнопку «Forgot password»: устройство сформирует файл запроса (XML) или QR-код.",
            "Этот файл отправляется в поддержку Hikvision или официальному дистрибьютору вместе с фото наклейки устройства и подтверждением покупки. В ответ приходит файл сброса — импортируете его в SADP и задаёте новый пароль. Обычно занимает от нескольких часов до пары дней.",
          ] },
          { h: "Способ 3: секретные вопросы и GUID-файл", p: [
            "При активации регистратора Hikvision предлагает настроить секретные вопросы и выгрузить GUID-файл на флешку. Если это было сделано — сброс делается локально с монитора регистратора: отвечаете на вопросы или подставляете файл.",
            "Мораль на будущее: эти три минуты при настройке экономят дни при восстановлении. Настраивая систему, всегда заполняйте и почту, и вопросы, и держите GUID-файл в надёжном месте.",
          ] },
          { h: "Чего делать не нужно", p: [
            "Не прошивайте устройство «сбросными» прошивками с форумов: ими часто окирпичивают камеры, а иногда вместе с прошивкой приезжает чужой бэкдор. Не покупайте «услуги сброса» у анонимов в мессенджерах — им придётся дать полный доступ к вашей сети.",
            "Кнопка Reset на корпусе камеры у большинства моделей сбрасывает настройки сети, но не пароль администратора — а на старых прошивках после неё устройство может вовсе перестать активироваться без поддержки.",
          ] },
          { h: "Если ничего не помогло", p: [
            "Останется путь через сервис: подтверждение владения и сброс силами дистрибьютора или сервисного центра. Мы делаем это для клиентов регулярно — привозите устройство или зовите инженера на объект.",
            "И системный вывод: пароли системы видеонаблюдения должны храниться не в голове монтажника, а в паспорте системы у владельца. При сдаче объектов мы передаём заказчику документацию со всеми доступами — спросите свою у подрядчика.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит сброс пароля в сервисе?", a: "Зависит от устройства и способа подтверждения владения; уточняйте у нас или дистрибьютора. Дешевле всего — не терять доступы: привязанная почта делает сброс бесплатным и мгновенным." },
          { q: "Поможет ли перепрошивка?", a: "Нет: обновление прошивки не сбрасывает пароль администратора, а «специальные» прошивки с форумов опасны. Пользуйтесь только штатными способами." },
          { q: "У меня камера Dahua/другого бренда — логика та же?", a: "Похожая: у Dahua тоже есть привязка почты и файл запроса через ConfigTool. Принцип одинаков — производители не оставляют лазеек, восстановление идёт через подтверждение владения." },
        ],
      },
      uz: {
        title: "Hikvision kamera yoki registrator parolini unutdingizmi: nima qilish kerak",
        excerpt: "O'z Hikvision kamera yoki NVR ga kirishni tiklashning shtatniy usullari: SADP, pochtaga kod, qo'llab-quvvatlashga so'rov fayli. «Sehrli» tugmalarsiz va faqat servis yordam beradigan holatlar haqida halol javob bilan.",
        sections: [
          { h: "Avvalo asosiysi", p: [
            "Zamonaviy Hikvision qurilmalarida parolni shunchaki tashlaydigan tugma yo'q: bu ataylab qilingan — begona odam bir daqiqada kameralaringizga kirmasligi uchun. Tiklash doim qurilma sizniki ekanini tasdiqlash orqali boradi.",
            "Quyidagi barcha usullar shtatniy, ishlab chiqaruvchidan va faqat qurilmaga jismoniy kirish hamda kompyuter bilan bitta tarmoqda ishlaydi. Gap o'z uskunangiz haqida: begona kameralarga kirish — jinoiy modda, bunday savollarni biz hal qilmaymiz.",
          ] },
          { h: "1-usul: bog'langan pochtaga kod", p: [
            "Agar qurilmani faollashtirishda tiklash uchun e-mail ko'rsatgan bo'lsangiz — vazifa besh daqiqalik. Veb-interfeys yoki SADP da «Forgot password» ni bosing: qurilma bog'langan pochtaga tasdiqlash kodini yuborishni taklif qiladi.",
            "Kodni kiritasiz — yangi parol qo'yasiz. Bu eng tez yo'l, shuning uchun biz montajda doim pochtani bog'laymiz: tekshiring, balki montajchingiz ham shunday qilgandir.",
          ] },
          { h: "2-usul: SADP orqali so'rov fayli", p: [
            "Hikvision saytidan SADP utilitasini yuklab oling, kompyuterni qurilma bilan bitta tarmoqqa ulang. SADP uni topadi va «Forgot password» tugmasini ko'rsatadi: qurilma so'rov faylini (XML) yoki QR-kod yaratadi.",
            "Bu fayl qurilma naklekasining fotosi va xarid tasdig'i bilan Hikvision qo'llab-quvvatlashiga yoki rasmiy distribyutorga yuboriladi. Javobga tashlash fayli keladi — uni SADP ga import qilib yangi parol qo'yasiz. Odatda bir necha soatdan bir-ikki kungacha.",
          ] },
          { h: "3-usul: maxfiy savollar va GUID-fayl", p: [
            "Registratorni faollashtirishda Hikvision maxfiy savollarni sozlash va GUID-faylni fleshkaga chiqarishni taklif qiladi. Agar bu qilingan bo'lsa — tashlash registrator monitoridan lokal qilinadi: savollarga javob berasiz yoki faylni qo'yasiz.",
            "Kelajak uchun xulosa: sozlashdagi shu uch daqiqa tiklashda kunlarni tejaydi. Tizimni sozlashda doim pochtani ham, savollarni ham to'ldiring, GUID-faylni ishonchli joyda saqlang.",
          ] },
          { h: "Nima qilmaslik kerak", p: [
            "Forumlardagi «tashlash» proshivkalarini quymang: ular bilan kameralar tez-tez g'ishtga aylanadi, ba'zan proshivka bilan birga begona bekdor ham keladi. Messenjerlardagi anonimlardan «tashlash xizmatini» sotib olmang — ularga tarmog'ingizga to'liq kirish berish kerak bo'ladi.",
            "Kamera korpusidagi Reset tugmasi ko'p modellarda tarmoq sozlamalarini tashlaydi, administrator parolini emas — eski proshivkalarda esa undan keyin qurilma qo'llab-quvvatlashsiz umuman faollashmay qolishi mumkin.",
          ] },
          { h: "Hech narsa yordam bermasa", p: [
            "Servis orqali yo'l qoladi: egalikni tasdiqlash va distribyutor yoki servis markazi kuchi bilan tashlash. Biz buni mijozlar uchun muntazam qilamiz — qurilmani olib keling yoki muhandisni obyektga chaqiring.",
            "Tizimli xulosa: videokuzatuv tizimi parollari montajchi xotirasida emas, egadagi tizim pasportida saqlanishi kerak. Obyekt topshirishda biz buyurtmachiga barcha kirishlar bilan hujjatlarni beramiz — o'zingiznikini pudratchidan so'rang.",
          ] },
        ],
        faq: [
          { q: "Servisda parol tashlash qancha turadi?", a: "Qurilma va egalikni tasdiqlash usuliga bog'liq; bizdan yoki distribyutordan aniqlang. Eng arzoni — kirishlarni yo'qotmaslik: bog'langan pochta tashlashni bepul va oniy qiladi." },
          { q: "Qayta proshivka yordam beradimi?", a: "Yo'q: proshivka yangilash administrator parolini tashlamaydi, forumlardagi «maxsus» proshivkalar esa xavfli. Faqat shtatniy usullardan foydalaning." },
          { q: "Menda Dahua/boshqa brend kamera — mantiq bir xilmi?", a: "O'xshash: Dahua da ham pochta bog'lash va ConfigTool orqali so'rov fayli bor. Printsip bir — ishlab chiqaruvchilar teshik qoldirmaydi, tiklash egalikni tasdiqlash orqali boradi." },
        ],
      },
      en: {
        title: "Forgot the password to a Hikvision camera or recorder: what to do",
        excerpt: "The official ways to recover access to your own Hikvision camera or NVR: SADP, an email code, a request file to support. No magic buttons — and an honest answer about when only service can help.",
        sections: [
          { h: "The main thing first", p: [
            "Modern Hikvision devices have no button that simply resets the password: that is deliberate, so a stranger cannot take over your cameras in a minute. Recovery always goes through proving the device is yours.",
            "Every method below is official, from the manufacturer, and works only with physical access to the device on the same network as your computer. This is about your own equipment: accessing someone else's cameras is a criminal offense, and we do not help with that.",
          ] },
          { h: "Method 1: a code to the linked email", p: [
            "If you entered a recovery e-mail when activating the device, this is a five-minute task. In the web interface or SADP click 'Forgot password': the device offers to send a verification code to the linked email.",
            "Enter the code — set a new password. It is the fastest path, which is why we always link an email during installation: check, your installer may have done the same.",
          ] },
          { h: "Method 2: a request file via SADP", p: [
            "Download the SADP utility from the Hikvision site and put your computer on the same network as the device. SADP finds it and shows a 'Forgot password' button: the device generates a request file (XML) or a QR code.",
            "That file goes to Hikvision support or the official distributor together with a photo of the device label and proof of purchase. A reset file comes back — import it in SADP and set a new password. Usually takes from a few hours to a couple of days.",
          ] },
          { h: "Method 3: security questions and the GUID file", p: [
            "When activating a recorder, Hikvision offers to set security questions and export a GUID file to a flash drive. If that was done, the reset happens locally from the recorder's monitor: answer the questions or supply the file.",
            "The moral for the future: those three minutes at setup save days at recovery. When configuring a system, always fill in the email and the questions, and keep the GUID file somewhere safe.",
          ] },
          { h: "What not to do", p: [
            "Do not flash 'reset' firmware from forums: it regularly bricks cameras, and sometimes a stranger's backdoor arrives with it. Do not buy 'reset services' from anonymous accounts in messengers — they will need full access to your network.",
            "The Reset button on the camera body resets network settings on most models, not the admin password — and on old firmware the device may stop activating at all afterwards without support.",
          ] },
          { h: "If nothing helped", p: [
            "The service path remains: proof of ownership and a reset by the distributor or a service center. We do this for clients regularly — bring the device in or call an engineer to the site.",
            "And the systemic conclusion: CCTV passwords belong in the owner's system passport, not in the installer's head. At handover we give the client documentation with all credentials — ask your contractor for yours.",
          ] },
        ],
        faq: [
          { q: "How much does a service reset cost?", a: "It depends on the device and the way ownership is proven; ask us or the distributor. The cheapest option is not losing access: a linked email makes the reset free and instant." },
          { q: "Will reflashing help?", a: "No: a firmware update does not reset the admin password, and 'special' firmware from forums is dangerous. Use only the official methods." },
          { q: "I have a Dahua or another brand — same logic?", a: "Similar: Dahua also offers email linking and a request file via ConfigTool. The principle is the same — manufacturers leave no loopholes, recovery goes through proof of ownership." },
        ],
      },
      tr: {
        title: "Hikvision kamera veya kayıt cihazının şifresini unuttunuz: ne yapmalı",
        excerpt: "Kendi Hikvision kameranıza veya NVR'ınıza erişimi kurtarmanın resmî yolları: SADP, e-postaya kod, desteğe istek dosyası. Sihirli düğmeler yok — yalnızca servisin yardım edebileceği durumlar hakkında dürüst yanıt var.",
        sections: [
          { h: "Önce en önemlisi", p: [
            "Modern Hikvision cihazlarında şifreyi öylece sıfırlayan bir düğme yok: bu kasıtlı — bir yabancı kameralarınızı bir dakikada ele geçirmesin diye. Kurtarma her zaman cihazın size ait olduğunu kanıtlamaktan geçer.",
            "Aşağıdaki tüm yöntemler resmîdir, üreticidendir ve yalnızca cihaza fiziksel erişimle, bilgisayarla aynı ağda çalışır. Konu kendi ekipmanınız: başkasının kameralarına erişim suçtur ve bu tür sorulara yardım etmeyiz.",
          ] },
          { h: "Yöntem 1: bağlı e-postaya kod", p: [
            "Cihazı etkinleştirirken kurtarma e-postası girdiyseniz iş beş dakikalıktır. Web arayüzünde veya SADP'de 'Forgot password'a basın: cihaz bağlı e-postaya doğrulama kodu göndermeyi önerir.",
            "Kodu girer, yeni şifre koyarsınız. En hızlı yol budur; bu yüzden montajda e-postayı hep bağlarız — kontrol edin, montajcınız da yapmış olabilir.",
          ] },
          { h: "Yöntem 2: SADP ile istek dosyası", p: [
            "Hikvision sitesinden SADP aracını indirin, bilgisayarı cihazla aynı ağa alın. SADP cihazı bulur ve 'Forgot password' düğmesini gösterir: cihaz bir istek dosyası (XML) veya QR kod üretir.",
            "Bu dosya, cihaz etiketinin fotoğrafı ve satın alma kanıtıyla Hikvision desteğine veya resmî distribütöre gönderilir. Yanıt olarak sıfırlama dosyası gelir — SADP'ye aktarır ve yeni şifre koyarsınız. Genelde birkaç saatle birkaç gün arasında.",
          ] },
          { h: "Yöntem 3: güvenlik soruları ve GUID dosyası", p: [
            "Kayıt cihazını etkinleştirirken Hikvision güvenlik soruları kurmayı ve GUID dosyasını flaş belleğe aktarmayı önerir. Bu yapıldıysa sıfırlama, kayıt cihazının ekranından yerel yapılır: soruları yanıtlar veya dosyayı verirsiniz.",
            "Geleceğe ders: kurulumdaki o üç dakika, kurtarmada günler kazandırır. Sistemi kurarken e-postayı da soruları da doldurun, GUID dosyasını güvenli yerde saklayın.",
          ] },
          { h: "Ne yapılmamalı", p: [
            "Forumlardaki 'sıfırlama' yazılımlarını yüklemeyin: kameralar sık sık tuğlaya döner, bazen yazılımla birlikte yabancı bir arka kapı da gelir. Mesajlaşma uygulamalarındaki anonimlerden 'sıfırlama hizmeti' satın almayın — ağınıza tam erişim vermeniz gerekir.",
            "Kamera gövdesindeki Reset düğmesi çoğu modelde ağ ayarlarını sıfırlar, yönetici şifresini değil — eski yazılımlarda ise sonrasında cihaz destek olmadan hiç etkinleşmeyebilir.",
          ] },
          { h: "Hiçbiri işe yaramadıysa", p: [
            "Servis yolu kalır: sahiplik kanıtı ve distribütör veya servis merkezi eliyle sıfırlama. Bunu müşteriler için düzenli yapıyoruz — cihazı getirin ya da mühendisi sahaya çağırın.",
            "Sistemli sonuç: kamera sistemi şifreleri montajcının aklında değil, sahibin sistem pasaportunda durmalı. Teslimde müşteriye tüm erişimlerle dokümantasyon veriyoruz — sizinkini yükleniciden isteyin.",
          ] },
        ],
        faq: [
          { q: "Serviste şifre sıfırlama kaça mal olur?", a: "Cihaza ve sahiplik kanıtı yöntemine bağlı; bize veya distribütöre sorun. En ucuzu erişimi kaybetmemek: bağlı e-posta sıfırlamayı ücretsiz ve anlık yapar." },
          { q: "Yeniden yazılım yüklemek yardım eder mi?", a: "Hayır: yazılım güncellemesi yönetici şifresini sıfırlamaz; forumlardaki 'özel' yazılımlar tehlikelidir. Yalnızca resmî yöntemleri kullanın." },
          { q: "Dahua veya başka marka kameram var — mantık aynı mı?", a: "Benzer: Dahua'da da e-posta bağlama ve ConfigTool ile istek dosyası var. İlke aynı — üreticiler açık kapı bırakmaz, kurtarma sahiplik kanıtından geçer." },
        ],
      },
      zh: {
        title: "忘记海康摄像机或录像机密码怎么办",
        excerpt: "找回自己海康设备访问权限的官方途径：SADP、邮箱验证码、向售后提交请求文件。没有“神奇按钮”——并诚实说明哪些情况只能靠服务网点。",
        sections: [
          { h: "先说重点", p: [
            "现代海康设备没有一键清除密码的按钮：这是有意为之，防止陌生人一分钟内接管您的摄像机。找回流程始终要证明设备属于您。",
            "下面的方法全部是官方方案，且都要求物理接触设备、与电脑同网段。这里说的是您自己的设备：入侵他人摄像机是刑事犯罪，此类问题我们不做。",
          ] },
          { h: "方法一：绑定邮箱收验证码", p: [
            "如果激活设备时填过找回邮箱，这就是五分钟的事。在网页界面或SADP点“Forgot password”，设备会向绑定邮箱发送验证码。",
            "输入验证码、设置新密码即可。这是最快的路，所以我们施工时总会绑定邮箱——查一下，您的安装方可能也这么做了。",
          ] },
          { h: "方法二：SADP导出请求文件", p: [
            "到海康官网下载SADP工具，电脑与设备接入同一网络。SADP找到设备后会显示“Forgot password”：设备生成请求文件（XML）或二维码。",
            "把该文件连同设备标签照片和购买凭证发给海康售后或官方经销商，对方回传重置文件——导入SADP设置新密码。通常几小时到一两天。",
          ] },
          { h: "方法三：密保问题与GUID文件", p: [
            "激活录像机时海康会建议设置密保问题并把GUID文件导出到U盘。如果当时做了，就能在录像机本机屏幕上重置：答题或插入文件即可。",
            "给未来的教训：配置时的三分钟能省下找回时的好几天。装系统时邮箱、密保都填上，GUID文件放妥当。",
          ] },
          { h: "千万别做的事", p: [
            "别刷论坛上的“解密固件”：经常把设备刷成砖，有时固件里还捆着别人的后门。别在聊天软件上向匿名者购买“解锁服务”——那要交出整个网络的访问权。",
            "机身上的Reset键在多数型号上只复位网络设置，不清管理员密码——老固件甚至可能按完之后没有售后就无法再激活。",
          ] },
          { h: "都不行的话", p: [
            "只剩服务网点这条路：证明所有权，由经销商或服务中心重置。我们常年为客户办理——送修设备或请工程师上门都行。",
            "系统性的结论：监控系统的密码应写进业主手里的系统档案，而不是装在安装工脑子里。我们交付项目时会把全部访问信息连文档移交甲方——向您的承包商索要您的那份。",
          ] },
        ],
        faq: [
          { q: "到服务网点重置要多少钱？", a: "取决于设备和所有权证明方式；向我们或经销商询价。最便宜的是别丢访问权：绑好邮箱，重置免费且即时。" },
          { q: "重刷固件行吗？", a: "不行：升级固件不会清除管理员密码，论坛上的“特制固件”还很危险。只用官方途径。" },
          { q: "我的是大华或其他品牌——逻辑一样吗？", a: "类似：大华也有邮箱绑定和通过ConfigTool的请求文件。原则相同——厂商不留后门，找回都要证明所有权。" },
        ],
      },
    },
  },
  {
    slug: "wifi-signalini-kuchaytirish",
    date: "2026-09-03",
    related: ["wifi", "network"],
    hubs: ["wi-fi-tochki-dostupa", "marshrutizatory"],
    loc: {
      ru: {
        title: "Как усилить сигнал Wi-Fi дома и в офисе",
        excerpt: "Почему Wi-Fi не добивает до дальних комнат и что реально помогает: место роутера, каналы, mesh, точки доступа. Разбор без мифов — что работает, а что пустая трата денег.",
        sections: [
          { h: "Почему сигнал слабый", p: [
            "Wi-Fi — это радио, и ему мешает всё, из чего построен дом: бетонные стены с арматурой съедают сигнал сильнее всего, за ними — зеркала, металлические двери и тёплые полы. Через две бетонные стены уверенно проходит редкий роутер, а через три — практически никакой.",
            "Вторая причина — соседи. В многоквартирном доме на частоте 2,4 ГГц одновременно работают десятки сетей, и они делят между собой одни и те же каналы. Скорость падает не потому, что сигнал слабый, а потому что эфир занят.",
          ] },
          { h: "Что попробовать бесплатно", p: [
            "Сначала — место: роутер должен стоять по центру квартиры, на высоте, не в шкафу и не за телевизором. Каждый метр от центра к углу — минус зона покрытия в противоположном углу.",
            "Затем — канал: в настройках роутера смените автоматический выбор канала на конкретный свободный (для 2,4 ГГц это 1, 6 или 11). Посмотреть занятость каналов можно бесплатным приложением-анализатором. И проверьте диапазон: если устройства поддерживают 5 ГГц — переводите их туда, этот диапазон быстрее и свободнее.",
          ] },
          { h: "Репитер: когда помогает, а когда вредит", p: [
            "Репитер (повторитель) ловит сигнал роутера и передаёт дальше — но делит скорость пополам и добавляет задержку. Для телевизора или камеры в дальней комнате сгодится, для работы и игр — раздражает.",
            "Главная ошибка — ставить репитер там, где сигнал уже плохой: он усилит и ретранслирует плохой сигнал. Ставить нужно на полпути, где сигнал роутера ещё уверенный.",
          ] },
          { h: "Правильное решение — точка доступа по кабелю", p: [
            "Кардинально вопрос решает не усиление, а вторая точка раздачи: к дальней части дома прокладывается сетевой кабель, на нём ставится точка доступа. Кабель не теряет скорость на препятствиях, а точка раздаёт полноценный Wi-Fi в своей зоне.",
            "В офисах это единственный правильный путь: точки доступа с PoE-питанием по потолку, одна сеть с бесшовным роумингом — телефон сам переключается на ближайшую точку, звонок не рвётся при переходе между кабинетами.",
          ] },
          { h: "Mesh-системы: за что вы платите", p: [
            "Mesh — это несколько узлов, которые сами строят единую сеть и ведут устройство от узла к узлу. Ставится за вечер без кабелей, выглядит аккуратно, работает заметно лучше репитера — узлы связаны выделенным радиоканалом.",
            "Честная оговорка: mesh по радио всё равно уступает точкам по кабелю. Идеальная схема — mesh-узлы, соединённые кабелем (Ethernet backhaul): и простота mesh, и скорость проводов.",
          ] },
          { h: "Что выбрать под вашу ситуацию", p: [
            "Квартира до трёх комнат — правильно расположенный современный роутер, при необходимости один mesh-узел. Большая квартира или дом — mesh из 2–3 узлов, лучше с кабельной связкой между этажами. Офис — точки доступа по кабелю с PoE и контроллером, посчитанные по плану помещения.",
            "Мы делаем радиообследование, считаем количество и расположение точек и монтируем под ключ — от квартиры до офиса на сотню сотрудников. Оборудование TP-Link Omada и MikroTik со склада в Ташкенте.",
          ] },
        ],
        faq: [
          { q: "Поможет ли роутер помощнее?", a: "Мощность передачи ограничена законом, и флагманский роутер бетонную стену не пробьёт. Он поможет за счёт лучших антенн и 5/6 ГГц рядом с ним, но дальние комнаты решаются только второй точкой раздачи." },
          { q: "Wi-Fi 6 стоит того?", a: "Да, если устройств много: Wi-Fi 6 эффективнее делит эфир между десятками клиентов. Для двух ноутбуков и телевизора заметной разницы со свежим Wi-Fi 5 роутером не будет." },
          { q: "Сколько стоит сделать Wi-Fi в офисе нормально?", a: "Зависит от площади и числа сотрудников: считаем по плану помещения бесплатно — с радиообследованием, схемой точек и сметой." },
        ],
      },
      uz: {
        title: "Uyda va ofisda Wi-Fi signalini qanday kuchaytirish mumkin",
        excerpt: "Nega Wi-Fi uzoq xonalarga yetib bormaydi va nima real yordam beradi: router joyi, kanallar, mesh, kirish nuqtalari. Afsonalarsiz tahlil — nima ishlaydi, nima pulni bekor sarflash.",
        sections: [
          { h: "Nega signal kuchsiz", p: [
            "Wi-Fi — bu radio, unga uy qurilgan hamma narsa xalaqit beradi: armaturali beton devorlar signalni eng ko'p yeydi, keyin oynalar, metall eshiklar va issiq pollar. Ikkita beton devordan kamdan-kam router ishonchli o'tadi, uchtadan — deyarli hech qaysi.",
            "Ikkinchi sabab — qo'shnilar. Ko'p qavatli uyda 2,4 GGts chastotada bir vaqtda o'nlab tarmoq ishlaydi va ular bir xil kanallarni bo'lishadi. Tezlik signal kuchsizligidan emas, efir bandligidan tushadi.",
          ] },
          { h: "Bepul nimani sinab ko'rish mumkin", p: [
            "Avvalo — joy: router kvartira markazida, balandda turishi kerak, shkafda yoki televizor ortida emas. Markazdan burchakka har metr — qarama-qarshi burchakda qamrov zonasidan minus.",
            "Keyin — kanal: router sozlamalarida avtomatik kanal tanlashni aniq bo'sh kanalga almashtiring (2,4 GGts uchun bu 1, 6 yoki 11). Kanallar bandligini bepul analizator-ilova bilan ko'rish mumkin. Diapazonni ham tekshiring: qurilmalar 5 GGts ni qo'llasa — ularni o'sha yoqqa o'tkazing, bu diapazon tezroq va bo'shroq.",
          ] },
          { h: "Repiter: qachon yordam beradi, qachon zarar", p: [
            "Repiter (takrorlagich) router signalini tutib uzatadi — lekin tezlikni ikkiga bo'ladi va kechikish qo'shadi. Uzoq xonadagi televizor yoki kameraga yaraydi, ish va o'yinlarga — asabga tegadi.",
            "Bosh xato — repiterni signal allaqachon yomon joyga qo'yish: u yomon signalni kuchaytirib uzatadi. Yarim yo'lda, router signali hali ishonchli joyda qo'yish kerak.",
          ] },
          { h: "To'g'ri yechim — kabel orqali kirish nuqtasi", p: [
            "Masalani kuchaytirish emas, ikkinchi tarqatish nuqtasi tubdan hal qiladi: uyning uzoq qismiga tarmoq kabeli yotqiziladi, unga kirish nuqtasi qo'yiladi. Kabel to'siqlarda tezlik yo'qotmaydi, nuqta esa o'z zonasida to'laqonli Wi-Fi tarqatadi.",
            "Ofislarda bu yagona to'g'ri yo'l: ship bo'ylab PoE quvvatli kirish nuqtalari, uzluksiz roumingli bitta tarmoq — telefon o'zi eng yaqin nuqtaga o'tadi, xonalar orasida qo'ng'iroq uzilmaydi.",
          ] },
          { h: "Mesh-tizimlar: nimaga pul to'laysiz", p: [
            "Mesh — bu o'zlari yagona tarmoq quradigan va qurilmani uzeldan uzelga olib boradigan bir necha uzel. Kabelsiz bir kechada o'rnatiladi, chiroyli ko'rinadi, repiterdan sezilarli yaxshi ishlaydi — uzellar ajratilgan radiokanal bilan bog'langan.",
            "Halol izoh: radio orqali mesh baribir kabelli nuqtalardan past. Ideal sxema — kabel bilan bog'langan mesh-uzellar (Ethernet backhaul): mesh soddaligi ham, sim tezligi ham.",
          ] },
          { h: "Vaziyatingizga nimani tanlash", p: [
            "Uch xonagacha kvartira — to'g'ri joylashtirilgan zamonaviy router, kerak bo'lsa bitta mesh-uzel. Katta kvartira yoki uy — 2–3 uzelli mesh, qavatlar orasi kabel bog'lamli bo'lsa yaxshi. Ofis — xona plani bo'yicha hisoblangan PoE va kontrollerli kabelli kirish nuqtalari.",
            "Biz radiotekshiruv qilamiz, nuqtalar soni va joyini hisoblaymiz va kalit topshirish bilan o'rnatamiz — kvartiradan yuz xodimli ofisgacha. TP-Link Omada va MikroTik uskunalari Toshkentdagi ombordan.",
          ] },
        ],
        faq: [
          { q: "Kuchliroq router yordam beradimi?", a: "Uzatish quvvati qonun bilan cheklangan, flagman router ham beton devorni teshmaydi. U yaxshi antennalar va yonidagi 5/6 GGts hisobiga yordam beradi, lekin uzoq xonalarni faqat ikkinchi tarqatish nuqtasi hal qiladi." },
          { q: "Wi-Fi 6 arziydimi?", a: "Ha, qurilmalar ko'p bo'lsa: Wi-Fi 6 efirni o'nlab mijozlar orasida samaraliroq bo'ladi. Ikkita noutbuk va televizorga yangi Wi-Fi 5 routerdan sezilarli farq bo'lmaydi." },
          { q: "Ofisda Wi-Fi ni normal qilish qancha turadi?", a: "Maydon va xodimlar soniga bog'liq: xona plani bo'yicha bepul hisoblaymiz — radiotekshiruv, nuqtalar sxemasi va smeta bilan." },
        ],
      },
      en: {
        title: "How to boost Wi-Fi signal at home and in the office",
        excerpt: "Why Wi-Fi does not reach the far rooms and what actually helps: router placement, channels, mesh, access points. A no-myth breakdown — what works and what wastes money.",
        sections: [
          { h: "Why the signal is weak", p: [
            "Wi-Fi is radio, and everything a building is made of interferes: reinforced concrete walls eat the signal most, followed by mirrors, metal doors and heated floors. Few routers push confidently through two concrete walls, and practically none through three.",
            "The second reason is the neighbors. In an apartment block, dozens of networks share the same 2.4 GHz channels at once. Speed drops not because the signal is weak, but because the air is busy.",
          ] },
          { h: "What to try for free", p: [
            "Placement first: the router belongs in the center of the home, up high, not in a cabinet or behind the TV. Every meter from the center toward a corner costs coverage in the opposite corner.",
            "Then the channel: switch automatic channel selection to a specific free one (1, 6 or 11 for 2.4 GHz). A free analyzer app shows channel congestion. And check the band: if your devices support 5 GHz, move them there — it is faster and less crowded.",
          ] },
          { h: "Repeaters: when they help and when they hurt", p: [
            "A repeater catches the router's signal and passes it on — but halves the speed and adds latency. Fine for a TV or a camera in a far room; annoying for work and games.",
            "The classic mistake is placing the repeater where the signal is already poor: it amplifies and relays a poor signal. It belongs halfway, where the router's signal is still solid.",
          ] },
          { h: "The right solution — a wired access point", p: [
            "What solves the problem radically is not amplification but a second distribution point: a network cable runs to the far part of the building and an access point sits on it. Cable loses no speed to obstacles, and the AP serves full Wi-Fi in its zone.",
            "In offices this is the only right way: PoE-powered ceiling access points, one network with seamless roaming — the phone switches to the nearest AP by itself, and a call survives the walk between rooms.",
          ] },
          { h: "Mesh systems: what you pay for", p: [
            "Mesh is several nodes that build one network themselves and hand devices from node to node. It installs in an evening without cables, looks neat and clearly beats a repeater — the nodes talk over a dedicated radio link.",
            "An honest caveat: radio mesh still trails wired access points. The ideal scheme is mesh nodes linked by cable (Ethernet backhaul): mesh simplicity plus wire speed.",
          ] },
          { h: "What to choose for your case", p: [
            "An apartment up to three rooms — a well-placed modern router, one mesh node if needed. A large apartment or house — a 2–3 node mesh, ideally cabled between floors. An office — wired PoE access points with a controller, calculated from the floor plan.",
            "We run a radio survey, calculate the number and placement of points and install turnkey — from an apartment to an office of a hundred staff. TP-Link Omada and MikroTik equipment from our Tashkent warehouse.",
          ] },
        ],
        faq: [
          { q: "Will a more powerful router help?", a: "Transmit power is capped by law, and a flagship router will not pierce a concrete wall. It helps through better antennas and 5/6 GHz near it, but far rooms are only solved by a second distribution point." },
          { q: "Is Wi-Fi 6 worth it?", a: "Yes, with many devices: Wi-Fi 6 shares the air between dozens of clients more efficiently. For two laptops and a TV, you will not notice a difference from a recent Wi-Fi 5 router." },
          { q: "What does proper office Wi-Fi cost?", a: "It depends on the area and headcount: we calculate from the floor plan free of charge — with a radio survey, an AP layout and an estimate." },
        ],
      },
      tr: {
        title: "Evde ve ofiste Wi-Fi sinyali nasıl güçlendirilir",
        excerpt: "Wi-Fi uzak odalara neden ulaşmaz ve gerçekten ne işe yarar: router yeri, kanallar, mesh, erişim noktaları. Efsanesiz bir analiz — ne çalışır, ne para israfıdır.",
        sections: [
          { h: "Sinyal neden zayıf", p: [
            "Wi-Fi bir radyodur ve binanın yapıldığı her şey ona engeldir: demirli beton duvarlar sinyali en çok yer; ardından aynalar, metal kapılar ve yerden ısıtma gelir. İki beton duvarı az router güvenle geçer, üçünü neredeyse hiçbiri.",
            "İkinci neden komşulardır. Apartmanda 2,4 GHz bandında aynı anda onlarca ağ aynı kanalları paylaşır. Hız, sinyal zayıf olduğundan değil, hava meşgul olduğundan düşer.",
          ] },
          { h: "Ücretsiz neler denenir", p: [
            "Önce yer: router evin ortasında, yüksekte durmalı; dolapta veya televizyonun arkasında değil. Merkezden köşeye her metre, karşı köşedeki kapsamadan eksilir.",
            "Sonra kanal: otomatik kanal seçimini belirli boş bir kanala çevirin (2,4 GHz için 1, 6 veya 11). Kanal doluluğunu ücretsiz analiz uygulaması gösterir. Bandı da kontrol edin: cihazlar 5 GHz destekliyorsa oraya taşıyın — daha hızlı ve boş.",
          ] },
          { h: "Repeater: ne zaman yardım eder, ne zaman zarar", p: [
            "Repeater router sinyalini yakalayıp iletir — ama hızı yarıya böler ve gecikme ekler. Uzak odadaki televizyon veya kameraya uyar; iş ve oyun için sinir bozucudur.",
            "Klasik hata, repeater'ı sinyalin zaten kötü olduğu yere koymaktır: kötü sinyali güçlendirip aktarır. Yeri, router sinyalinin hâlâ sağlam olduğu yarı yoldur.",
          ] },
          { h: "Doğru çözüm — kablolu erişim noktası", p: [
            "Sorunu kökten çözen güçlendirme değil, ikinci dağıtım noktasıdır: binanın uzak kısmına ağ kablosu çekilir, ucuna erişim noktası konur. Kablo engellerde hız kaybetmez; nokta kendi bölgesinde tam Wi-Fi dağıtır.",
            "Ofislerde tek doğru yol budur: tavanda PoE beslemeli erişim noktaları, kesintisiz dolaşımlı tek ağ — telefon en yakın noktaya kendisi geçer, odalar arası yürürken görüşme kopmaz.",
          ] },
          { h: "Mesh sistemleri: neye para veriyorsunuz", p: [
            "Mesh, tek ağı kendileri kuran ve cihazı düğümden düğüme taşıyan birkaç düğümdür. Kablosuz bir akşamda kurulur, düzgün görünür, repeater'dan belirgin iyidir — düğümler ayrılmış radyo hattıyla konuşur.",
            "Dürüst not: radyo mesh, kablolu noktaların yine de gerisindedir. İdeal şema kabloyla bağlı mesh düğümleridir (Ethernet backhaul): mesh kolaylığı artı kablo hızı.",
          ] },
          { h: "Durumunuza göre ne seçmeli", p: [
            "Üç odaya kadar daire — doğru yerleştirilmiş güncel router, gerekirse bir mesh düğümü. Büyük daire veya ev — katlar arası tercihen kablolu 2–3 düğümlü mesh. Ofis — kat planından hesaplanan, kontrollü ve PoE'li kablolu erişim noktaları.",
            "Radyo keşfi yapıyor, nokta sayısını ve yerini hesaplıyor ve anahtar teslim kuruyoruz — daireden yüz kişilik ofise kadar. TP-Link Omada ve MikroTik ekipmanı Taşkent depomuzdan.",
          ] },
        ],
        faq: [
          { q: "Daha güçlü router yardım eder mi?", a: "Verici gücü yasayla sınırlıdır; amiral gemisi router da beton duvarı delmez. Yakınında daha iyi antenler ve 5/6 GHz ile yardım eder, ama uzak odaları yalnızca ikinci dağıtım noktası çözer." },
          { q: "Wi-Fi 6 değer mi?", a: "Cihaz çoksa evet: Wi-Fi 6 havayı onlarca istemci arasında daha verimli paylaşır. İki dizüstü ve bir televizyon için yeni bir Wi-Fi 5 router'dan fark hissetmezsiniz." },
          { q: "Ofiste düzgün Wi-Fi kaça mal olur?", a: "Alana ve kişi sayısına bağlı: kat planından ücretsiz hesaplıyoruz — radyo keşfi, nokta şeması ve keşifle birlikte." },
        ],
      },
      zh: {
        title: "家里和办公室Wi-Fi信号增强指南",
        excerpt: "为什么Wi-Fi到不了远处的房间、什么才真正有用：路由器位置、信道、mesh、接入点。破除迷思——哪些有效，哪些纯属浪费钱。",
        sections: [
          { h: "信号为什么弱", p: [
            "Wi-Fi是无线电，房子的建材都在跟它作对：带钢筋的混凝土墙吃信号最狠，其次是镜子、金属门和地暖。能稳定穿透两堵混凝土墙的路由器很少，三堵墙几乎没有。",
            "第二个原因是邻居。居民楼里2.4GHz频段同时挤着几十个网络，共享同样的信道。速度下降不是因为信号弱，而是因为空口太挤。",
          ] },
          { h: "先试试免费的办法", p: [
            "首先是位置：路由器应放在户型中央、放高处，不要塞柜子里或电视后面。离中心每远一米，对角房间的覆盖就少一分。",
            "然后是信道：把自动选择改成具体的空闲信道（2.4GHz选1、6或11）。信道占用可用免费的分析App查看。还有频段：设备支持5GHz就切过去——更快也更空。",
          ] },
          { h: "中继器：何时有用、何时帮倒忙", p: [
            "中继器接收路由器信号再转发——但速度减半、延迟增加。给远房间的电视或摄像头凑合能用，办公和游戏会抓狂。",
            "最常见的错误是把中继器放在信号已经很差的地方：它放大并转发的还是差信号。正确位置在半路上，即路由器信号仍然稳定的地方。",
          ] },
          { h: "正解——有线接入点", p: [
            "根治问题的不是放大，而是第二个发射点：往远端拉一根网线，接一台接入点。网线不怕障碍物，接入点在自己区域内发射满血Wi-Fi。",
            "办公室只有这一条正路：吊顶PoE供电接入点、支持无缝漫游的统一网络——手机自动切换到最近的点，走动中通话不断。",
          ] },
          { h: "Mesh系统：钱花在哪", p: [
            "Mesh是几个自组网的节点，设备在节点间自动切换。一个晚上无线装完、外观清爽、明显强于中继器——节点之间走专用无线回程。",
            "诚实地说：无线mesh仍然不如有线接入点。理想方案是节点之间拉网线（有线回程）：既有mesh的省事，又有网线的速度。",
          ] },
          { h: "按场景怎么选", p: [
            "三居以内的公寓——摆对位置的新款路由器，必要时加一个mesh节点。大户型或别墅——2–3节点mesh，层间最好走网线。办公室——按平面图核算的有线PoE接入点加控制器。",
            "我们做无线勘测、核算点位数量和位置、交钥匙施工——从住宅到百人办公室。TP-Link Omada和MikroTik设备塔什干现货。",
          ] },
        ],
        faq: [
          { q: "换更强的路由器行吗？", a: "发射功率受法规限制，旗舰路由器也穿不透混凝土墙。它靠更好的天线和近距离的5/6GHz有些提升，但远房间只能靠第二个发射点解决。" },
          { q: "Wi-Fi 6值得上吗？", a: "设备多就值：Wi-Fi 6在几十个终端间分配空口更高效。只有两台笔记本加电视的话，与较新的Wi-Fi 5路由器差别不大。" },
          { q: "办公室Wi-Fi做规范要多少钱？", a: "取决于面积和人数：按平面图免费核算——含无线勘测、点位方案和预算。" },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-ognetushitel",
    date: "2026-09-03",
    related: ["fire"],
    hubs: ["ognetushiteli", "pozharnaya-bezopasnost"],
    loc: {
      ru: {
        title: "Как выбрать огнетушитель: ОП или ОУ, расчёт количества, сроки перезарядки",
        excerpt: "Порошковый или углекислотный, сколько огнетушителей нужно на офис и склад по нормам, что вешать у серверной и как не завалить проверку: практичный разбор с ценами.",
        sections: [{
            h: "Классы пожара решают всё",
            p: ["Буквы на корпусе огнетушителя — не украшение. A — твёрдые материалы (дерево, бумага, ткань), B — жидкости (бензин, масла, растворители), C — газы, E — электроустановки под напряжением. Порошковый огнетушитель (ОП) закрывает A, B, C и электрику до 1000 В — поэтому он стал стандартом по умолчанию для офисов, магазинов, складов и автомобилей.", "Углекислотный (ОУ) работает по B, C и E, но его главное преимущество в другом: CO2 испаряется, не оставляя ни порошка, ни пены. Сработавший ОП в серверной означает чистку каждой платы, а часто — списание техники; ОУ просто испарится. Правило простое: где электроника дорогая — там углекислотный."]
          }, {
            h: "Считаем количество по нормам",
            p: ["Ориентир для помещений: минимум один порошковый ОП-4 или ОП-5 на каждые 50–100 м² площади и не менее двух огнетушителей на этаж. Для производств и складов с горючими материалами нормы жёстче — там ставят ОП-10, ОП-25, а на большие площади — передвижные ОП-50 и ОП-100 на колёсах.", "К расчёту добавьте размещение: огнетушитель вешается на видном месте у выхода, на высоте до 1,5 м, зимой — не на морозе (порошок слёживается, баллон теряет давление). У серверной и электрощитовой — углекислотный ОУ-5 в дополнение к порошковым. Комплект завершают пожарный шкаф, знаки и журнал учёта — без них проверка находит замечания даже при исправных огнетушителях."]
          }, {
            h: "Цены и сроки службы",
            p: ["Порошковые РИФ: ОП-4 — 122 900 сум, ОП-5 — 141 900, ОП-8 — 184 900, ОП-10 — 246 900, ОП-25 — 803 900, передвижные ОП-50 — 1 298 900 и ОП-100 — 2 474 900 сум. Углекислотный ОУ-5 — 543 900 сум. Для организаций — счёт с НДС, доставка по Узбекистану.", "Огнетушитель — не «купил и забыл»: порошковый перезаряжается раз в 5 лет, углекислотный ежегодно проходит контроль массы, а после любого срабатывания заряд восстанавливается немедленно. Заведите график — или отдайте его нам: посчитаем комплект под ваш объект, поставим со склада в Ташкенте и будем напоминать о перезарядке сами."]
          }],
        faq: [{
            q: "Какой огнетушитель нужен в автомобиль?",
            a: "Порошковый ОП-2 или ОП-4 (для грузовых и автобусов — от ОП-5). Главное — крепление в салоне, а не в глубине багажника: при возгорании счёт идёт на секунды."
          }, {
            q: "Что повесить рядом с серверной?",
            a: "Углекислотный ОУ-5: он тушит электроустановки под напряжением и не оставляет следов на технике. Порошковый рядом тоже уместен — для остальных помещений."
          }, {
            q: "Огнетушитель просрочен — можно перезарядить или покупать новый?",
            a: "Перезаряжать можно многократно, пока баллон проходит освидетельствование. Обычно выгоднее перезарядка; новый берут при повреждении корпуса или потере паспорта."
          }, {
            q: "Сколько огнетушителей требует проверка МЧС для офиса 200 м²?",
            a: "Минимум два-четыре ОП-4/ОП-5 (по одному на 50–100 м², не менее двух на этаж) плюс знаки, кронштейны и журнал учёта. Посчитаем точный комплект под вашу планировку бесплатно."
          }]
      },
      uz: {
        title: "O't o'chirgichni qanday tanlash: OP yoki OU, miqdor hisobi, qayta zaryadlash muddatlari",
        excerpt: "Kukunlimi yoki karbonat angidridlimi, ofis va omborga me'yor bo'yicha nechta kerak, server yoniga nima osish va tekshiruvdan qanday o'tish: narxlar bilan amaliy tahlil.",
        sections: [{
            h: "Yong'in sinflari hammasini hal qiladi",
            p: ["O't o'chirgich korpusidagi harflar bezak emas. A — qattiq materiallar (yog'och, qog'oz, mato), B — suyuqliklar (benzin, moylar), C — gazlar, E — kuchlanish ostidagi elektr qurilmalari. Kukunli o't o'chirgich (OP) A, B, C va 1000 V gacha elektrni yopadi — shuning uchun u ofis, do'kon, ombor va avtomobillar uchun standart bo'ldi.", "Karbonat angidridli (OU) B, C va E bo'yicha ishlaydi, lekin uning kuchi boshqa narsada: CO2 na kukun, na ko'pik qoldirmasdan bug'lanadi. Serverda ishlagan OP har bir platani tozalashni, ko'pincha texnikani hisobdan chiqarishni anglatadi; OU shunchaki bug'lanadi. Qoida oddiy: elektronika qimmat joyda — karbonat angidridli."]
          }, {
            h: "Miqdorni me'yor bo'yicha hisoblaymiz",
            p: ["Xonalar uchun mo'ljal: har 50–100 m² maydonga kamida bitta kukunli OP-4 yoki OP-5 va qavatga kamida ikkita o't o'chirgich. Yonuvchi materialli ishlab chiqarish va omborlarda me'yorlar qattiqroq — u yerda OP-10, OP-25, katta maydonlarga g'ildirakli OP-50 va OP-100 qo'yiladi.", "Hisobga joylashuvni qo'shing: o't o'chirgich chiqish yonidagi ko'rinadigan joyga, 1,5 m gacha balandlikka osiladi, qishda sovuqda emas (kukun zichlashadi, ballon bosim yo'qotadi). Server va elektr shchitxonasi yonida — kukunlilarga qo'shimcha karbonat angidridli OU-5. To'plamni yong'in shkafi, belgilar va hisob jurnali yakunlaydi — ularsiz tekshiruv soz o't o'chirgichlarda ham e'tiroz topadi."]
          }, {
            h: "Narxlar va xizmat muddatlari",
            p: ["Kukunli RIF: OP-4 — 122 900 so'm, OP-5 — 141 900, OP-8 — 184 900, OP-10 — 246 900, OP-25 — 803 900, g'ildirakli OP-50 — 1 298 900 va OP-100 — 2 474 900 so'm. Karbonat angidridli OU-5 — 543 900 so'm. Tashkilotlarga QQS li hisob, O'zbekiston bo'ylab yetkazish.", "O't o'chirgich «oldim-unutdim» emas: kukunlisi 5 yilda bir qayta zaryadlanadi, karbonat angidridlisi har yili massa nazoratidan o'tadi, har ishlashdan keyin zaryad darhol tiklanadi. Grafik yuriting — yoki bizga topshiring: to'plamni obyektingizga hisoblaymiz, Toshkentdagi ombordan yetkazamiz va qayta zaryadlashni o'zimiz eslatamiz."]
          }],
        faq: [{
            q: "Avtomobilga qanday o't o'chirgich kerak?",
            a: "Kukunli OP-2 yoki OP-4 (yuk mashinasi va avtobuslarga OP-5 dan). Asosiysi — bagaj tubida emas, salonda mahkamlash: yong'inda soniyalar hal qiladi."
          }, {
            q: "Server yoniga nima osish kerak?",
            a: "Karbonat angidridli OU-5: u kuchlanish ostidagi elektr qurilmalarini o'chiradi va texnikada iz qoldirmaydi. Yonida kukunli ham o'rinli — boshqa xonalar uchun."
          }, {
            q: "Muddati o'tgan o't o'chirgichni qayta zaryadlash mumkinmi?",
            a: "Ballon guvohlantirishdan o'tar ekan, ko'p marta qayta zaryadlash mumkin. Odatda qayta zaryadlash foydali; korpus shikastlanganda yangisini olishadi."
          }, {
            q: "200 m² ofisga tekshiruv nechta o't o'chirgich talab qiladi?",
            a: "Kamida ikki-to'rtta OP-4/OP-5 (har 50–100 m² ga bittadan, qavatga kamida ikkita) hamda belgilar, kronshteynlar va hisob jurnali. Aniq to'plamni rejangizga bepul hisoblaymiz."
          }]
      },
      en: {
        title: "Choosing a Fire Extinguisher: Powder vs CO2, Quantity Maths, Recharge Intervals",
        excerpt: "Powder or CO2, how many extinguishers an office and a warehouse need by code, what to hang near the server room and how to pass inspection: a practical guide with prices.",
        sections: [{
            h: "Fire classes decide everything",
            p: ["The letters on the cylinder are not decoration. A — solids (wood, paper, fabric), B — liquids (petrol, oils, solvents), C — gases, E — live electrical equipment. A powder extinguisher covers A, B, C and electrics up to 1000 V — which is why it became the default for offices, shops, warehouses and cars.", "A CO2 unit handles B, C and E, but its superpower is different: the gas evaporates leaving neither powder nor foam. A powder discharge in a server room means cleaning every board and often writing off equipment; CO2 simply evaporates. The rule is simple: where the electronics are expensive, go CO2."]
          }, {
            h: "Counting units by code",
            p: ["The room guideline: at least one 4–5 kg powder unit per 50–100 m² and no fewer than two extinguishers per floor. Production areas and warehouses with combustibles demand more — 10 and 25 kg units, and wheeled 50–100 kg units for large floors.", "Add placement to the maths: an extinguisher hangs in plain sight near the exit, no higher than 1.5 m, and never in frost (powder cakes, cylinders lose pressure). Near server and switchboard rooms — a CO2 unit on top of the powder ones. Fire cabinets, signage and a logbook complete the set — without them an inspection finds faults even with healthy extinguishers."]
          }, {
            h: "Prices and service life",
            p: ["RIF powder units: OP-4 — 122,900 UZS, OP-5 — 141,900, OP-8 — 184,900, OP-10 — 246,900, OP-25 — 803,900, wheeled OP-50 — 1,298,900 and OP-100 — 2,474,900 UZS. The CO2 OU-5 — 543,900 UZS. VAT invoicing for organisations, delivery across Uzbekistan.", "An extinguisher is not buy-and-forget: powder units are recharged every 5 years, CO2 units pass an annual weight check, and any discharged unit is refilled at once. Keep a schedule — or hand it to us: we calculate the set for your site, deliver from Tashkent stock and send the recharge reminders ourselves."]
          }],
        faq: [{
            q: "Which extinguisher belongs in a car?",
            a: "A 2–4 kg powder unit (5 kg and up for trucks and buses). What matters is mounting it in the cabin, not deep in the boot: a fire gives you seconds."
          }, {
            q: "What should hang near a server room?",
            a: "A CO2 OU-5: it fights live electrical fires and leaves no residue on equipment. A powder unit nearby is fine too — for the other rooms."
          }, {
            q: "An extinguisher expired — recharge or replace?",
            a: "Recharging works repeatedly as long as the cylinder passes certification. Recharge is usually cheaper; buy new when the body is damaged or the passport is lost."
          }, {
            q: "How many units does a 200 m² office need to pass inspection?",
            a: "At least two to four 4–5 kg powder units (one per 50–100 m², minimum two per floor) plus signage, brackets and a logbook. We calculate the exact set for your layout for free."
          }]
      },
      tr: {
        title: "Yangın Söndürücü Nasıl Seçilir: Tozlu mu CO2 mi, Adet Hesabı, Dolum Aralıkları",
        excerpt: "Tozlu mu karbondioksitli mi, ofis ve depoya yönetmelikçe kaç adet gerekir, sunucu odasının yanına ne asılır ve denetim nasıl geçilir: fiyatlarla pratik rehber.",
        sections: [{
            h: "Yangın sınıfları her şeyi belirler",
            p: ["Tüpün üzerindeki harfler süs değildir. A — katılar (ahşap, kâğıt, kumaş), B — sıvılar (benzin, yağlar), C — gazlar, E — gerilim altındaki elektrik. Tozlu söndürücü A, B, C ve 1000 V'a kadar elektriği kapsar — bu yüzden ofis, mağaza, depo ve araçların varsayılanı oldu.", "CO2 tüpü B, C ve E'de çalışır ama asıl gücü başka: gaz, ne toz ne köpük bırakmadan buharlaşır. Sunucu odasında boşalan tozlu tüp her kartın temizliği, çoğu zaman cihazların hurdaya ayrılması demektir; CO2 sadece uçar. Kural basit: elektronik pahalıysa CO2."]
          }, {
            h: "Adedi yönetmeliğe göre sayalım",
            p: ["Oda kılavuzu: her 50–100 m² için en az bir 4–5 kg tozlu tüp ve kat başına en az iki söndürücü. Yanıcı bulunan üretim ve depolarda daha fazlası gerekir — 10 ve 25 kg tüpler, büyük alanlara tekerlekli 50–100 kg.", "Hesaba yerleşimi ekleyin: söndürücü çıkışın yanına, göz önüne, en fazla 1,5 m yüksekliğe asılır ve asla ayazda durmaz (toz kekleşir, tüp basınç kaybeder). Sunucu ve pano odalarının yanına tozluların üstüne bir CO2. Seti yangın dolabı, levhalar ve kayıt defteri tamamlar — bunlar olmadan denetim, tüpler sağlam olsa bile eksik bulur."]
          }, {
            h: "Fiyatlar ve ömür",
            p: ["RIF tozlu tüpler: OP-4 — 122.900 UZS, OP-5 — 141.900, OP-8 — 184.900, OP-10 — 246.900, OP-25 — 803.900, tekerlekli OP-50 — 1.298.900 ve OP-100 — 2.474.900 UZS. CO2 OU-5 — 543.900 UZS. Kurumlara KDV'li fatura, tüm Özbekistan'a teslimat.", "Söndürücü al-unut değildir: tozlu 5 yılda bir dolum ister, CO2 her yıl tartı kontrolünden geçer, boşalan tüp hemen doldurulur. Takvim tutun — ya da bize bırakın: seti tesisinize göre hesaplar, Taşkent stoğundan teslim eder, dolum hatırlatmalarını biz göndeririz."]
          }],
        faq: [{
            q: "Araca hangi söndürücü konur?",
            a: "2–4 kg tozlu tüp (kamyon ve otobüslere 5 kg ve üzeri). Önemli olan bagajın dibine değil kabine sabitlemek: yangında saniyeler sayılır."
          }, {
            q: "Sunucu odasının yanına ne asılmalı?",
            a: "CO2 OU-5: gerilim altındaki elektrik yangınlarını söndürür ve cihazlarda kalıntı bırakmaz. Yanına diğer odalar için bir tozlu tüp de uygundur."
          }, {
            q: "Süresi geçen tüp doldurulur mu, yenisi mi alınır?",
            a: "Tüp muayeneden geçtiği sürece defalarca doldurulur. Genelde dolum daha ekonomiktir; gövde hasarlıysa yenisi alınır."
          }, {
            q: "200 m² ofis denetim için kaç tüp ister?",
            a: "En az iki-dört adet 4–5 kg tozlu (her 50–100 m² için bir, kat başına en az iki) artı levhalar, braketler ve kayıt defteri. Yerleşiminize göre tam seti ücretsiz hesaplarız."
          }]
      },
      zh: {
        title: "灭火器怎么选：干粉还是二氧化碳、数量怎么算、多久充装一次",
        excerpt: "干粉还是二氧化碳，办公室和仓库按规范要配几具，机房旁挂什么，怎样顺利通过消防检查：附价格的实用指南。",
        sections: [{
            h: "火灾类别决定一切",
            p: ["瓶身上的字母不是装饰。A——固体（木材、纸张、织物），B——液体（汽油、油类、溶剂），C——气体，E——带电设备。干粉灭火器覆盖 A、B、C 及 1000V 以内电气——因此它成了办公室、商店、仓库和车辆的默认选择。", "二氧化碳型适用 B、C、E，但它的绝活在别处：气体挥发后不留粉末与泡沫。干粉在机房喷洒意味着逐块清洗电路板、甚至设备报废；二氧化碳则直接挥发。规则很简单：电子设备贵重的地方，用二氧化碳。"]
          }, {
            h: "按规范计算数量",
            p: ["房间参考值：每 50–100 平方米至少一具 4–5 公斤干粉灭火器，每层不少于两具。有可燃物的生产区和仓库要求更高——配 10 公斤、25 公斤，大面积用 50–100 公斤推车式。", "数量之外还有位置：灭火器挂在出口附近显眼处，高度不超过 1.5 米，冬季不可置于严寒中（干粉板结、瓶体失压）。机房和配电室旁在干粉之外再加一具二氧化碳。消防箱、标识和台账使配置完整——缺了它们，即使灭火器完好检查也会挑出问题。"]
          }, {
            h: "价格与使用年限",
            p: ["RIF 干粉系列：OP-4——122,900 苏姆，OP-5——141,900，OP-8——184,900，OP-10——246,900，OP-25——803,900，推车式 OP-50——1,298,900，OP-100——2,474,900 苏姆。二氧化碳 OU-5——543,900 苏姆。单位客户开增值税发票，全乌兹别克斯坦配送。", "灭火器不是买完就忘：干粉每 5 年充装一次，二氧化碳每年称重检查，任何喷放后立即补充。自己记台账——或交给我们：按场所计算配置、塔什干现货发货、到期充装我们主动提醒。"]
          }],
        faq: [{
            q: "车里放哪种灭火器？",
            a: "2–4 公斤干粉型（货车和大巴用 5 公斤以上）。关键是固定在驾驶舱内而非后备箱深处：起火时以秒计算。"
          }, {
            q: "机房旁边挂什么？",
            a: "二氧化碳 OU-5：可扑灭带电设备火灾且不损伤设备。旁边再放一具干粉型也合适——用于其他房间。"
          }, {
            q: "灭火器过期了，充装还是买新的？",
            a: "只要钢瓶通过检验就能反复充装，通常更划算；瓶体损伤或证件遗失时才买新的。"
          }, {
            q: "200 平方米办公室过检查要几具？",
            a: "至少两到四具 4–5 公斤干粉型（每 50–100 平方米一具，每层至少两具），另加标识、支架和台账。按您的平面图免费精确计算。"
          }]
      }
    }
  },
  {
    slug: "kak-vybrat-stabilizator-napryazheniya",
    date: "2026-08-31",
    related: ["servers"],
    hubs: ["ibp-i-elektropitanie"],
    loc: {
      ru: {
        title: "Как выбрать стабилизатор напряжения для дома, офиса и серверной",
        excerpt: "Релейный, сервоприводный или инверторный? Считаем мощность с запасом, разбираем однофазные и трёхфазные модели и решаем, когда стабилизатора мало и нужен ИБП.",
        sections: [{ h: "Когда нужен стабилизатор, а когда — ИБП", p: ["Стабилизатор выравнивает напряжение: если в сети хронические 180 или 250 вольт, техника получает ровные 220. Но при отключении света он бессилен — на этот случай нужен ИБП с батареями. Классическая связка для серверной и видеонаблюдения: стабилизатор на входе принимает скачки, ИБП за ним держит систему во время пропаданий.", "Признаки, что стабилизатор нужен уже вчера: мигают лампы при включении чайника, гудят блоки питания, зимой напряжение проседает ниже 200 В, а холодильник или котёл уходят в ошибку. Для газовых котлов и насосов стабилизатор фактически обязателен — их электроника гибнет от скачков первой."] }, { h: "Типы стабилизаторов: релейный, сервоприводный, инверторный", p: ["Релейный — самый доступный: ступенчато переключает обмотки, точность ±8 %, для бытовой техники достаточно. Сервоприводный ведёт напряжение плавно и точно (±3 %), но имеет механику, которая изнашивается, и не любит мороз. Инверторный (двойного преобразования) — эталон: мгновенная реакция, точность ±2 %, тишина; за это платят самой высокой ценой.", "Для дома и офиса чаще всего берут релейные и инверторные; для медицинского и лабораторного оборудования — только инверторные. Смотрите и на диапазон входного напряжения: дешёвые модели работают от 140–160 В, при более глубоких просадках просто отключаются."] }, { h: "Считаем мощность правильно", p: ["Сложите мощность всех потребителей и добавьте запас 30 %. Внимание на пусковые токи: компрессор холодильника и насос при старте берут в 3–5 раз больше номинала — их считают по пусковой мощности. Стабилизатор на 5 кВА — стандарт квартиры; дом с котлом и насосами — 8–10 кВА; трёхфазный ввод требует либо трёхфазную модель, либо три однофазных.", "В сумах экономия на мощности выходит боком: перегруженный стабилизатор живёт недолго и отключается в самый неподходящий момент. Мы бесплатно считаем нагрузку по списку техники и подбираем модель со склада в Ташкенте — с установкой и гарантией."] },  { h: "Установка: место решает срок службы", p: [
            "Стабилизатор — это трансформатор, и он греется: ему нужны вентиляция и запас пространства, а не глухая ниша за шкафом. Ставьте его до защищаемой техники, но после автомата защиты, и не на пол в сыром подвале — влага убивает контакты быстрее перегрузок.",
            "Для сервисных работ полезен байпас: техника остаётся с питанием, пока стабилизатор обслуживается или меняется. Мы подбираем модель по реальной нагрузке с запасом, монтируем с байпасом и заземлением и даём гарантию — включая честный совет, когда стабилизатор не нужен вовсе.",
          ] },
        ],
        faq: [{ q: "Какой стабилизатор нужен для газового котла?", a: "Инверторный или качественный релейный на 500–1000 ВА с широким входным диапазоном. Котлу важна и правильная синусоида, и защита от скачков — дешёвые ступенчатые модели с этим справляются плохо." }, { q: "Стабилизатор или ИБП — что выбрать?", a: "Скачки и просадки — стабилизатор; отключения света — ИБП. Полная защита серверной — связка обоих: стабилизатор на входе, ИБП за ним." }, { q: "Можно ли ставить стабилизатор на всю квартиру?", a: "Да, модель на 5–10 кВА ставится на ввод после счётчика и защищает всё сразу. Монтаж занимает пару часов, для трёхфазного ввода нужна трёхфазная схема." }],
      },
      uz: {
        title: "Uy, ofis va server xonasi uchun kuchlanish stabilizatorini qanday tanlash",
        excerpt: "Releli, servoprivodli yoki invertorli? Quvvatni zaxira bilan hisoblaymiz, bir fazali va uch fazali modellarni ko'rib chiqamiz va qachon stabilizator kamlik qilib, UPS kerakligini hal qilamiz.",
        sections: [{ h: "Qachon stabilizator, qachon UPS kerak", p: ["Stabilizator kuchlanishni tekislaydi: tarmoqda surunkali 180 yoki 250 volt bo'lsa, texnika tekis 220 oladi. Lekin svet o'chganda u ojiz — bunga batareyali UPS kerak. Server va videokuzatuv uchun klassik bog'lam: kirishdagi stabilizator sakrashlarni oladi, undan keyingi UPS o'chishlarda tizimni ushlaydi.", "Stabilizator kechagidan kerakligining belgilari: choynak yoqilganda lampalar miltillaydi, quvvat bloklari g'uvillaydi, qishda kuchlanish 200 V dan pastga tushadi, muzlatgich yoki qozon xatoga chiqadi. Gaz qozonlari va nasoslar uchun stabilizator amalda majburiy."] }, { h: "Stabilizator turlari: releli, servoprivodli, invertorli", p: ["Releli — eng hamyonbop: chulg'amlarni pog'onali almashtiradi, aniqlik ±8 %, maishiy texnikaga yetadi. Servoprivodli kuchlanishni silliq va aniq boshqaradi (±3 %), lekin yeyiladigan mexanikasi bor. Invertorli (ikki marta o'zgartirish) — etalon: bir zumda javob, ±2 % aniqlik, jimlik; buning uchun eng yuqori narx to'lanadi.", "Uy va ofisga ko'pincha releli va invertorlilar olinadi; tibbiy va laboratoriya uskunalariga — faqat invertorli. Kirish kuchlanishi diapazoniga ham qarang: arzon modellar 140–160 V dan ishlaydi, chuqurroq pasayishlarda shunchaki o'chadi."] }, { h: "Quvvatni to'g'ri hisoblaymiz", p: ["Barcha iste'molchilar quvvatini qo'shing va 30 % zaxira qo'shing. Ishga tushirish toklariga e'tibor: muzlatgich kompressori va nasos startda nominaldan 3–5 barobar ko'p oladi. 5 kVA stabilizator — kvartira standarti; qozon va nasosli uy — 8–10 kVA; uch fazali kirish uch fazali modelni yoki uchta bir fazalini talab qiladi.", "Quvvatda tejash qimmatga tushadi: ortiqcha yuklangan stabilizator uzoq yashamaydi. Biz texnika ro'yxati bo'yicha yuklamani bepul hisoblaymiz va Toshkentdagi ombordan modelni tanlaymiz — o'rnatish va kafolat bilan."] },  { h: "O'rnatish: joy xizmat muddatini hal qiladi", p: [
            "Stabilizator — transformator, u qiziydi: unga ventilyatsiya va joy zaxirasi kerak, shkaf ortidagi berk tokcha emas. Uni himoyalanadigan texnikagacha, lekin himoya avtomatidan keyin qo'ying, nam yerto'lada polga emas — namlik kontaktlarni yuklamalardan tez o'ldiradi.",
            "Servis ishlariga baypas foydali: stabilizator xizmatlanayotganda yoki almashtirilayotganda texnika quvvat bilan qoladi. Modelni real yukka zaxira bilan tanlaymiz, baypas va yerga ulash bilan montaj qilamiz va kafolat beramiz — stabilizator umuman kerak emasligini halol maslahat bilan birga.",
          ] },
        ],
        faq: [{ q: "Gaz qozoni uchun qanday stabilizator kerak?", a: "Keng kirish diapazonli 500–1000 VA invertorli yoki sifatli releli. Qozonga to'g'ri sinusoida ham, sakrashlardan himoya ham muhim." }, { q: "Stabilizator yoki UPS — qaysi birini tanlash?", a: "Sakrash va pasayishlar — stabilizator; svet o'chishi — UPS. Server xonasining to'liq himoyasi — ikkalasining bog'lami." }, { q: "Butun kvartiraga stabilizator qo'yish mumkinmi?", a: "Ha, 5–10 kVA model hisoblagichdan keyin kirishga o'rnatiladi va hammasini birdan himoya qiladi. Montaj bir necha soat oladi." }],
      },
      en: {
        title: "How to choose a voltage stabilizer for a home, office or server room",
        excerpt: "Relay, servo or inverter type? Sizing with headroom, single- vs three-phase, and when a stabilizer is not enough and you need a UPS.",
        sections: [{ h: "When you need a stabilizer — and when a UPS", p: ["A stabilizer levels the voltage: with a grid stuck at 180 or 250 volts, your equipment still gets a clean 220. It is helpless during a blackout — that is what a battery UPS is for. The classic pairing for server rooms and CCTV: a stabilizer at the input absorbs the surges, a UPS behind it rides through the outages.", "Signs you needed one yesterday: lights flicker when the kettle starts, power supplies hum, winter voltage sags below 200 V, the boiler or fridge trips into error. For gas boilers and pumps a stabilizer is effectively mandatory — their electronics die from surges first."] }, { h: "Stabilizer types: relay, servo, inverter", p: ["Relay is the budget choice: it switches windings in steps, ±8 % accuracy, fine for household loads. Servo units track voltage smoothly (±3 %) but carry wearing mechanics and dislike frost. Inverter (double conversion) is the benchmark: instant response, ±2 %, silence — at the highest price.", "Homes and offices mostly take relay or inverter units; medical and lab equipment only inverter. Watch the input range too: cheap models work from 140–160 V and simply shut down on deeper sags."] }, { h: "Sizing it right", p: ["Add up all loads and put 30 % on top. Mind inrush: a fridge compressor or a pump draws 3–5 times its rating at start. 5 kVA is the apartment standard; a house with a boiler and pumps needs 8–10 kVA; a three-phase feed takes either a three-phase unit or three single-phase ones.", "Skimping on capacity backfires: an overloaded stabilizer lives short and trips at the worst moment. We calculate the load from your equipment list for free and match a model from Tashkent stock — installed and under warranty."] },  { h: "Installation: the location decides the lifespan", p: [
            "A stabilizer is a transformer, and it heats up: it needs ventilation and clearance, not a blind niche behind a cabinet. Install it upstream of the protected equipment but after the circuit breaker, and not on the floor of a damp basement — moisture kills contacts faster than overloads.",
            "A bypass helps during service: the equipment keeps its power while the stabilizer is maintained or replaced. We size the model to the real load with margin, install it with a bypass and earthing, and back it with a warranty — including the honest advice when a stabilizer is not needed at all.",
          ] },
        ],
        faq: [{ q: "Which stabilizer suits a gas boiler?", a: "An inverter or a good relay unit of 500–1000 VA with a wide input range. A boiler needs both a clean sine wave and surge protection." }, { q: "Stabilizer or UPS?", a: "Surges and sags — stabilizer; blackouts — UPS. Full protection for a server room is both: stabilizer at the input, UPS behind it." }, { q: "Can one stabilizer cover the whole apartment?", a: "Yes — a 5–10 kVA unit at the incomer after the meter protects everything at once. Installation takes a couple of hours." }],
      },
      tr: {
        title: "Ev, ofis ve sunucu odası için voltaj regülatörü nasıl seçilir",
        excerpt: "Röleli, servo veya inverter tip? Payla boyutlandırma, monofaze/trifaze seçimi ve regülatörün yetmediği, UPS gereken durumlar.",
        sections: [{ h: "Ne zaman regülatör, ne zaman UPS", p: ["Regülatör voltajı düzler: şebeke 180 veya 250 voltta takılı kalsa da ekipman temiz 220 alır. Kesintide ise çaresizdir — onun için akülü UPS gerekir. Sunucu odası ve kameralar için klasik ikili: girişteki regülatör dalgalanmaları emer, arkasındaki UPS kesintiyi taşır.", "Dünden gerekli olduğunun işaretleri: su ısıtıcısı çalışınca lambalar titrer, güç kaynakları uğuldar, kışın voltaj 200 V altına iner, kombi hataya düşer. Kombi ve pompalar için regülatör fiilen zorunludur."] }, { h: "Regülatör tipleri: röleli, servo, inverter", p: ["Röleli en ekonomik olandır: sargıları kademeli değiştirir, ±%8 hassasiyet, ev yükleri için yeterli. Servo tip voltajı yumuşak izler (±%3) ama aşınan mekaniği vardır. Inverter (çift çevrim) etalondur: anlık tepki, ±%2, sessizlik — en yüksek fiyata.", "Ev ve ofise çoğunlukla röleli veya inverter alınır; medikal ve laboratuvar cihazlarına yalnız inverter. Giriş aralığına da bakın: ucuz modeller 140–160 V'tan çalışır, daha derin çöküşte kapanır."] }, { h: "Gücü doğru hesaplamak", p: ["Tüm yükleri toplayın, %30 pay ekleyin. Kalkış akımına dikkat: buzdolabı kompresörü ve pompa kalkışta anma değerinin 3–5 katını çeker. 5 kVA daire standardı; kombili ve pompalı ev 8–10 kVA ister; trifaze giriş ya trifaze cihaz ya üç monofaze ister.", "Kapasiteden kısmak pahalıya patlar: aşırı yüklü regülatör kısa yaşar. Cihaz listenize göre yükü ücretsiz hesaplar, Taşkent stoğundan modeli kurulum ve garantiyle veririz."] },  { h: "Montaj: yer, ömrü belirler", p: [
            "Stabilizatör bir trafodur ve ısınır: ona havalandırma ve boşluk gerekir, dolap arkasındaki kör niş değil. Onu korunan cihazlardan önce ama sigortadan sonra kurun; rutubetli bodrumda yere değil — nem kontakları aşırı yükten hızlı öldürür.",
            "Servis işlerinde baypas işe yarar: stabilizatör bakılırken veya değişirken cihazlar beslemede kalır. Modeli gerçek yüke göre payla seçer, baypas ve topraklamayla kurar, garanti veririz — stabilizatörün hiç gerekmediği durumda dürüst tavsiye dahil.",
          ] },
        ],
        faq: [{ q: "Kombi için hangi regülatör?", a: "Geniş giriş aralıklı 500–1000 VA inverter veya kaliteli röleli tip. Kombiye temiz sinüs ve darbe koruması birlikte gerekir." }, { q: "Regülatör mü UPS mi?", a: "Dalgalanma ve çökme — regülatör; kesinti — UPS. Sunucu odasının tam koruması ikisinin birlikte kullanımıdır." }, { q: "Tek regülatör tüm daireyi korur mu?", a: "Evet — sayaç sonrası girişe konan 5–10 kVA'lık model her şeyi birden korur. Montaj birkaç saat sürer." }],
      },
      zh: {
        title: "家庭、办公室和机房如何选择稳压器",
        excerpt: "继电器式、伺服式还是逆变式？带余量计算功率、单相与三相的选择，以及什么时候光有稳压器不够、还需要UPS。",
        sections: [{ h: "什么时候需要稳压器，什么时候需要UPS", p: ["稳压器整平电压：即使电网长期只有180或250伏，设备仍能得到平稳的220伏。但停电时它无能为力——那是带电池UPS的工作。机房和监控的经典组合：入口稳压器吸收冲击，其后的UPS撑过断电。", "早该装稳压器的信号：烧水壶一开灯就闪、电源嗡嗡响、冬天电压跌破200伏、锅炉或冰箱报错。燃气锅炉和水泵实际上必须配稳压器——它们的电子板最先被电压冲击损坏。"] }, { h: "稳压器类型：继电器式、伺服式、逆变式", p: ["继电器式最经济：分级切换绕组，精度±8%，家用足够。伺服式平滑跟踪电压（±3%），但有会磨损的机械结构，怕严寒。逆变式（双变换）是标杆：瞬时响应、±2%精度、安静——价格也最高。", "家庭和办公室多选继电器式或逆变式；医疗和实验设备只用逆变式。还要看输入范围：便宜型号从140–160伏起工作，更深的跌落直接停机。"] }, { h: "正确计算功率", p: ["把所有负载功率相加，再加30%余量。注意启动电流：冰箱压缩机和水泵启动时是额定值的3–5倍。5kVA是公寓标准；带锅炉和水泵的住宅要8–10kVA；三相进线要三相机型或三台单相。", "在容量上省钱会吃亏：过载的稳压器寿命短，且在最不巧的时刻跳停。我们按设备清单免费核算负载，从塔什干现货选型——含安装和保修。"] },  { h: "安装：位置决定寿命", p: [
            "稳压器本质是变压器，它会发热：需要通风和空间余量，而不是柜子后面的闷龛。装在被保护设备的上游、断路器的下游；别放在潮湿地下室的地面上——潮气比过载更快弄坏触点。",
            "旁路开关在检修时很有用：维护或更换稳压器时设备照常供电。我们按真实负载留余量选型、带旁路和接地安装并提供质保——包括当稳压器根本没必要时的诚实劝告。",
          ] },
        ],
        faq: [{ q: "燃气锅炉配哪种稳压器？", a: "宽输入范围的500–1000VA逆变式或优质继电器式。锅炉既要正弦波干净，也要防冲击。" }, { q: "选稳压器还是UPS？", a: "电压波动选稳压器；停电选UPS。机房完整保护是两者组合：稳压器在前，UPS在后。" }, { q: "一台稳压器能保护整套公寓吗？", a: "能——5–10kVA机型装在电表后进线上，一次保护全部。安装只需几小时。" }],
      },
    },
  },
  {
    slug: "shlagbaum-dlya-dvora-i-parkovki",
    date: "2026-08-31",
    related: ["barrier", "parking"],
    hubs: ["turnikety-i-shlagbaumy"],
    loc: {
      ru: {
        title: "Шлагбаум для двора и парковки: виды, автоматика и из чего складывается цена",
        excerpt: "Стрела на 3–6 метров, интенсивность, управление с пульта, телефона или по номеру машины: разбираем, какой шлагбаум подходит двору, офису и ТЦ, и что входит в честную смету.",
        sections: [{ h: "Какие бывают шлагбаумы", p: ["Главные параметры — длина стрелы и интенсивность. Для двора на 3–4 метра проезда хватает базового привода с «включённостью» 50 %: открылся-закрылся несколько сотен раз в день. Бизнес-центру и ТЦ нужен интенсивный привод (70–100 %), рассчитанный на тысячи циклов, — иначе редуктор не доживёт до конца гарантии.", "Стрелы бывают круглые, прямоугольные и со светодиодной подсветкой; для длинных проездов ставят складные. В холодном климате смотрите на подогрев блока — зимой дешёвые приводы замерзают."] }, { h: "Управление: пульт, телефон, ANPR", p: ["Базовый вариант — брелоки: дёшево, но брелоки теряются и передаются посторонним. Звонок с телефона удобнее: номер жильца в белом списке, звонок бесплатный — шлагбаум открылся. Вершина удобства — камера распознавания номеров (ANPR): свои машины проезжают без остановки, гости по звонку охраннику, и каждый проезд записан с фото.", "ANPR окупается на объектах от 50 машин: исчезают очереди на въезде и спор «кто открыл». Интеграция со СКУД добавляет общий журнал: кто и когда въехал — видно в одной системе с проходами через двери."] }, { h: "Из чего складывается цена", p: ["Честная смета — это привод со стрелой, фундамент и закладные, петля индукции или фотоэлементы безопасности (чтобы стрела не легла на крышу), блок управления и выбранный способ доступа. На нестабильной сети добавьте ИБП — обесточенный шлагбаум блокирует весь двор.", "Мы ставим шлагбаумы ZKTeco и Hikvision со склада в Ташкенте: монтаж под ключ за один-два дня, гарантия и сервис. Пришлите фото и ширину проезда — вернём точную смету в тот же день."] },  { h: "Монтаж, зима и обслуживание", p: [
            "Правильный монтаж — половина срока службы: фундамент или закладная под тумбу, фотоэлементы и петлевой детектор, чтобы стрела никогда не опустилась на автомобиль, заземление и аккуратная подводка питания. Для двора с постоянным потоком берите интенсивный привод: бытовой на тысячах циклов в день живёт один сезон.",
            "Зимой шлагбаум сдаёт экзамен: плавный старт не даёт рвать примёрзшую стрелу, а сезонная смазка сохраняет механику. Мы настраиваем зимние режимы при установке и обслуживаем шлагбаумы по договору — смазка, регулировки, батарейки в пультах и фотоэлементах.",
          ] },
        ],
        faq: [{ q: "Сколько стоит шлагбаум с установкой?", a: "Зависит от длины стрелы, интенсивности привода и способа управления: базовый комплект для двора дешевле, интенсивный с ANPR — дороже. Выезд инженера и смета бесплатны." }, { q: "Что делать при отключении света?", a: "У приводов есть расблокировка — стрела поднимается вручную ключом. Лучше сразу поставить небольшой ИБП: шлагбаум переживает отключения без участия жильцов." }, { q: "Нужно ли согласовывать шлагбаум во дворе?", a: "Для двора многоквартирного дома нужно решение собственников и согласование с районными службами — проезд спецтехники обязан сохраняться. Помогаем подготовить схему установки для согласования." }],
      },
      uz: {
        title: "Hovli va parkovka uchun shlagbaum: turlari, avtomatika va narx nimadan iborat",
        excerpt: "3–6 metrlik strela, intensivlik, pult, telefon yoki avtoraqam orqali boshqarish: hovli, ofis va savdo markaziga qaysi shlagbaum mosligini va halol smetaga nima kirishini ko'rib chiqamiz.",
        sections: [{ h: "Shlagbaumlar qanday bo'ladi", p: ["Asosiy parametrlar — strela uzunligi va intensivlik. 3–4 metrlik hovli o'tish joyiga 50 % «yoqiqlik»dagi bazaviy privod yetadi. Biznes-markaz va savdo markaziga minglab tsiklga mo'ljallangan intensiv privod (70–100 %) kerak — aks holda reduktor kafolat oxirigacha yetmaydi.", "Strelalar dumaloq, to'rtburchak va LED yoritishli bo'ladi; uzun o'tish joylariga buklanadigan o'rnatiladi. Sovuq iqlimda blok isitishiga qarang — qishda arzon privodlar muzlaydi."] }, { h: "Boshqaruv: pult, telefon, ANPR", p: ["Bazaviy variant — brelok: arzon, lekin breloklar yo'qoladi va begonalarga o'tadi. Telefon qo'ng'irog'i qulayroq: yashovchi raqami oq ro'yxatda, qo'ng'iroq bepul — shlagbaum ochildi. Qulaylik cho'qqisi — avtoraqamni tanish kamerasi (ANPR): o'z mashinalari to'xtamasdan o'tadi, mehmonlar qo'riqchi ruxsati bilan, har bir o'tish foto bilan yozilgan.", "ANPR 50 tadan ortiq mashinali obyektlarda o'zini oqlaydi: kirishda navbatlar yo'qoladi. SKUD bilan integratsiya umumiy jurnal beradi: kim qachon kirgani eshik o'tishlari bilan bitta tizimda ko'rinadi."] }, { h: "Narx nimadan iborat", p: ["Halol smeta — strelali privod, poydevor va zakladnoylar, xavfsizlik induksiya halqasi yoki fotoelementlar, boshqaruv bloki va tanlangan kirish usuli. Beqaror tarmoqda UPS qo'shing — toksiz shlagbaum butun hovlini bloklaydi.", "Biz Toshkentdagi ombordan ZKTeco va Hikvision shlagbaumlarini o'rnatamiz: bir-ikki kunda kalit topshirish, kafolat va servis. O'tish joyi fotosi va kengligini yuboring — o'sha kuni aniq smeta qaytaramiz."] },  { h: "Montaj, qish va xizmat", p: [
            "To'g'ri montaj — xizmat muddatining yarmi: tumba ostiga poydevor yoki zakladnoy, strela hech qachon mashinaga tushmasligi uchun fotoelementlar va petlevoy detektor, yerga ulash va ozoda quvvat kirishi. Doimiy oqimli hovliga intensiv privod oling: kuniga minglab sikllarda maishiysi bir mavsum yashaydi.",
            "Qishda shlagbaum imtihon topshiradi: silliq start muzlagan strelani yulishga yo'l qo'ymaydi, mavsumiy moy mexanikani saqlaydi. O'rnatishda qishki rejimlarni sozlaymiz va shlagbaumlarni shartnoma bo'yicha xizmatlaymiz — moylash, sozlashlar, pult va fotoelement batareykalari.",
          ] },
        ],
        faq: [{ q: "Shlagbaum o'rnatish bilan qancha turadi?", a: "Strela uzunligi, privod intensivligi va boshqaruv usuliga bog'liq: hovli uchun bazaviy to'plam arzonroq, ANPR li intensiv qimmatroq. Muhandis chiqishi va smeta bepul." }, { q: "Svet o'chganda nima qilish kerak?", a: "Privodlarda qo'lda ochish bor — strela kalit bilan ko'tariladi. Yaxshisi kichik UPS qo'ying: shlagbaum o'chishlarni yashovchilar ishtirokisiz o'tkazadi." }, { q: "Hovlida shlagbaumni kelishish kerakmi?", a: "Ko'p kvartirali uy hovlisi uchun mulkdorlar qarori va tuman xizmatlari bilan kelishuv kerak — maxsus texnika o'tishi saqlanishi shart. Kelishuv uchun o'rnatish sxemasini tayyorlashda yordam beramiz." }],
      },
      en: {
        title: "A barrier gate for a yard or car park: types, automation and what a fair quote includes",
        excerpt: "A 3–6 m boom, duty cycle, control by remote, phone or plate recognition: which barrier fits a yard, an office or a mall, and what belongs in an honest estimate.",
        sections: [{ h: "Barrier types", p: ["The key parameters are boom length and duty cycle. A 3–4 m yard entrance is fine with a base drive at 50 % duty — a few hundred cycles a day. A business centre or mall needs an intensive drive (70–100 %) built for thousands of cycles, or the gearbox will not outlive the warranty.", "Booms come round, rectangular and LED-lit; long openings take folding booms. In cold climates check for cabinet heating — budget drives freeze in winter."] }, { h: "Control: remote, phone, ANPR", p: ["Remotes are the base option: cheap, but they get lost and passed around. A phone call is better: a resident's number in the whitelist, a free call — the barrier opens. The top of convenience is plate recognition (ANPR): registered cars pass without stopping, guests are let in by the guard, every pass is logged with a photo.", "ANPR pays off from about 50 cars: entrance queues disappear along with the who-opened-it disputes. Access-control integration adds one journal for gates and doors alike."] }, { h: "What makes up the price", p: ["An honest quote covers the drive with the boom, the foundation, an induction loop or safety photocells, the control unit and your chosen access method. On an unstable grid add a small UPS — a dead barrier blocks the whole yard.", "We install ZKTeco and Hikvision barriers from Tashkent stock: turnkey in one-two days, with warranty and service. Send a photo and the opening width — you get an exact quote the same day."] },  { h: "Installation, winter and service", p: [
            "Proper installation is half the lifespan: a foundation or embed under the cabinet, photocells and a loop detector so the boom never drops onto a car, earthing and neat power routing. For a yard with constant flow take an intensive drive: a domestic one at thousands of cycles a day lasts one season.",
            "In winter the barrier sits its exam: a soft start keeps it from tearing a frozen boom, and seasonal grease preserves the mechanics. We configure winter modes at installation and service barriers under contract — lubrication, adjustments, batteries in remotes and photocells.",
          ] },
        ],
        faq: [{ q: "How much is a barrier with installation?", a: "It depends on boom length, drive duty and the control method: a base yard kit costs less, an intensive ANPR setup more. The engineer visit and the estimate are free." }, { q: "What happens during a power cut?", a: "Drives have a manual release — the boom lifts with a key. Better, add a small UPS so the barrier rides through outages on its own." }, { q: "Does a residential yard barrier need approvals?", a: "A block-of-flats yard needs an owners' decision and district approvals — emergency vehicle access must remain. We help prepare the installation scheme for approval." }],
      },
      tr: {
        title: "Avlu ve otopark için bariyer: tipler, otomasyon ve fiyat neyi içerir",
        excerpt: "3–6 m kol, kullanım yoğunluğu, kumanda, telefon veya plaka tanımayla kontrol: avluya, ofise ve AVM'ye hangi bariyer uyar, dürüst teklif neleri kapsar.",
        sections: [{ h: "Bariyer tipleri", p: ["Ana parametreler kol uzunluğu ve yoğunluktur. 3–4 m'lik avlu girişine %50 yoğunluklu taban sürücü yeter. İş merkezi ve AVM binlerce çevrime dayanan yoğun sürücü (%70–100) ister — yoksa redüktör garantiyi çıkaramaz.", "Kollar yuvarlak, dikdörtgen ve LED ışıklı olur; uzun açıklıklara katlanır kol konur. Soğuk iklimde kabin ısıtmasına bakın — ucuz sürücüler kışın donar."] }, { h: "Kontrol: kumanda, telefon, ANPR", p: ["Kumanda taban seçenektir: ucuzdur ama kaybolur, elden ele geçer. Telefon araması daha iyidir: beyaz listedeki numaradan ücretsiz arama — bariyer açılır. Konforun zirvesi plaka tanıma (ANPR): kayıtlı araçlar durmadan geçer, misafirleri güvenlik alır, her geçiş fotoğrafla kayıtlıdır.", "ANPR yaklaşık 50 araçtan itibaren kendini öder: giriş kuyrukları ve «kim açtı» tartışması biter. Geçiş kontrolü entegrasyonu kapı ve bariyeri tek günlükte birleştirir."] }, { h: "Fiyat neyi içerir", p: ["Dürüst teklif; kol ve sürücüyü, temeli, güvenlik için indüksiyon halkası veya fotoseli, kontrol ünitesini ve seçtiğiniz erişim yolunu kapsar. Dengesiz şebekede küçük bir UPS ekleyin — elektriksiz bariyer bütün avluyu kilitler.", "Taşkent stoğundan ZKTeco ve Hikvision bariyerleri kurarız: bir-iki günde anahtar teslim, garanti ve servisle. Fotoğraf ve açıklık genişliğini gönderin — aynı gün net teklif alın."] },  { h: "Montaj, kış ve bakım", p: [
            "Doğru montaj ömrün yarısıdır: gövde altına temel veya ankraj, kolun asla araca inmemesi için fotoseller ve loop dedektörü, topraklama ve düzenli güç hattı. Sürekli akışlı avluya yoğun tip motor alın: günde binlerce çevrimde ev tipi bir sezon dayanır.",
            "Kışın bariyer sınava girer: yumuşak kalkış donmuş kolu koparmayı önler, mevsimlik gres mekaniği korur. Kurulumda kış modlarını ayarlar, bariyerlere sözleşmeyle bakarız — yağlama, ayarlar, kumanda ve fotosel pilleri.",
          ] },
        ],
        faq: [{ q: "Kurulumla bariyer ne kadar?", a: "Kol uzunluğu, sürücü yoğunluğu ve kontrol yöntemine bağlıdır: avlu için taban set daha ucuz, ANPR'li yoğun set daha pahalıdır. Keşif ve teklif ücretsizdir." }, { q: "Elektrik kesilince ne olur?", a: "Sürücülerde manuel açma vardır — kol anahtarla kalkar. En iyisi küçük bir UPS eklemek: bariyer kesintileri kendi başına atlatır." }, { q: "Site avlusunda bariyer izin ister mi?", a: "Apartman avlusu için kat malikleri kararı ve ilçe onayları gerekir — acil araç geçişi korunmalıdır. Onay için kurulum şemasını hazırlamaya yardım ederiz." }],
      },
      zh: {
        title: "小区与停车场道闸：类型、自动化与价格构成",
        excerpt: "3–6米栏杆、使用强度、遥控/电话/车牌识别控制：哪种道闸适合小区、写字楼和商场，一份实在的报价应包含什么。",
        sections: [{ h: "道闸有哪些类型", p: ["关键参数是栏杆长度和使用强度。3–4米的小区入口用50%占空比的基础机芯即可——每天几百次起落。写字楼和商场需要高强度机芯（70–100%），可承受数千次循环，否则减速箱撑不过保修期。", "栏杆有圆形、方形和LED发光款；较宽通道用折叠杆。寒冷地区注意机箱加热——便宜机芯冬天会冻住。"] }, { h: "控制方式：遥控、电话、车牌识别", p: ["遥控是基础方案：便宜，但遥控器会丢、会外借。电话开闸更方便：住户号码进白名单，免费拨打即开。最省心的是车牌识别（ANPR）：登记车辆不停车通行，访客由保安放行，每次通行都有照片记录。", "车位50个以上ANPR就回本：入口不再排队，也没有「谁开的门」之争。与门禁集成后，门和闸的通行记录在同一系统。"] }, { h: "价格由什么构成", p: ["实在的报价包括：机芯与栏杆、基础与预埋、防砸地感线圈或光电、控制器及所选的开闸方式。电网不稳的地方加配小UPS——断电的道闸会堵住整个院子。", "我们从塔什干现货安装中控智慧和海康威视道闸：一两天交钥匙，含保修与维保。发来现场照片和通道宽度——当天回复精确报价。"] },  { h: "安装、过冬与维保", p: [
            "正确的安装占寿命的一半：机箱下打基础或预埋，红外对射加地感线圈保证闸杆永不砸车，接地和规整的供电走线。车流不断的院区要选重载电机：家用型每天数千次循环只能撑一季。",
            "冬天是道闸的考场：缓启动避免硬拽冻住的闸杆，换季润滑保护机械。我们安装时调好冬季模式，并按合同维保——润滑、调校、更换遥控器和对射的电池。",
          ] },
        ],
        faq: [{ q: "道闸带安装多少钱？", a: "取决于栏杆长度、机芯强度和控制方式：小区基础套装较便宜，带车牌识别的高强度套装较贵。勘查与报价免费。" }, { q: "停电了怎么办？", a: "机芯有手动释放——用钥匙即可抬杆。更好的做法是配小UPS，道闸自己撑过停电。" }, { q: "小区装道闸要审批吗？", a: "多层住宅小区需业主决议和区级部门核准——必须保留消防救护通道。我们协助准备报批安装方案。" }],
      },
    },
  },
  {
    slug: "kak-vybrat-kommutator-switch",
    date: "2026-08-31",
    related: ["network"],
    hubs: ["kommutatory"],
    loc: {
      ru: {
        title: "Как выбрать сетевой коммутатор (свитч): PoE, управляемость, L2 или L3",
        excerpt: "Управляемый или нет, сколько PoE-мощности нужно камерам, когда хватает L2 и зачем ядру сети L3: практичный разбор для офиса, видеонаблюдения и серверной.",
        sections: [{ h: "Управляемый или неуправляемый", p: ["Неуправляемый свитч — «разветвитель»: воткнул и работает. Для дома или пары устройств в кабинете этого достаточно. Управляемый добавляет VLAN (изоляция камер от офисной сети), приоритизацию трафика, мониторинг портов и защиту от петель — в офисной сети и системах видеонаблюдения он быстро окупает разницу в цене первым же разобранным инцидентом.", "Правило простое: если устройств больше десятка или в сети есть камеры и телефония — берите управляемый."] }, { h: "PoE: питание камер по витой паре", p: ["PoE-коммутатор питает камеры, точки доступа и IP-телефоны по тому же кабелю, что передаёт данные, — розетки у камеры не нужны. Считайте бюджет мощности: обычная камера берёт 6–8 Вт, купол с ИК — до 12 Вт, поворотная PTZ — до 25 Вт, а точка доступа Wi-Fi 6 — до 20 Вт. У 8-портового свитча бюджет обычно 60–120 Вт — на восемь PTZ его не хватит.", "Смотрите и стандарт: 802.3af даёт до 15 Вт на порт, 802.3at (PoE+) — до 30 Вт, bt — до 60–90 Вт для тяжёлых потребителей. Запас 20–30 % по мощности обязателен — зимой подогрев камер добавляет нагрузку."] }, { h: "L2, L3 и аплинки", p: ["L2-коммутатор работает внутри одной сети — это уровень доступа: этаж, кабинет, стойка с камерами. L3 умеет маршрутизировать между подсетями и становится ядром сети предприятия: отделы изолированы, трафик между ними контролируется. В малом офисе L3 не нужен — хватает L2 с гигабитным аплинком к роутеру.", "Аплинк — узкое место: если к свитчу подключены 24 гигабитных порта, разумно иметь SFP+ аплинк на 10G к ядру или серверу. Мы подбираем коммутаторы Hikvision, MikroTik, TP-Link, Ruijie и H3C под задачу, преднастраиваем VLAN и даём партнёрские цены H3C на проекты."] },  { h: "Три ошибки, которые всплывают потом", p: [
            "Первая — PoE-бюджет «впритык»: камеры с зимним подогревом удваивают потребление, и в мороз дальние порты начинают отваливаться. Вторая — каскады бытовых свитчей: петли, узкие места и сеть, которую невозможно диагностировать. Третья — ноунейм в серьёзной системе: под нагрузкой из десятка потоков он зависает, и камеры «моргают» без видимой причины.",
            "Рецепт скучный, но рабочий: бюджет мощности с запасом 30 %, нормальное ядро вместо каскадов и бренд с управлением там, где есть камеры и кассы. Мы преднастраиваем коммутаторы при поставке — VLAN и мониторинг включены с первого дня.",
          ] },
        ],
        faq: [{ q: "Какой коммутатор нужен для 8 камер видеонаблюдения?", a: "8-портовый PoE с бюджетом от 90 Вт и двумя аплинками — под регистратор и сеть. Для камер с подогревом и PTZ считайте мощность отдельно." }, { q: "Чем свитч отличается от роутера?", a: "Роутер соединяет сеть с интернетом и раздаёт адреса; свитч множит порты внутри сети. В типовом офисе они работают в паре: роутер на входе, свитчи — на этажах." }, { q: "Что такое VLAN и зачем он мне?", a: "VLAN делит один физический свитч на изолированные сети: камеры не видят бухгалтерию, гостевой Wi-Fi не видит серверы. Настраивается один раз на управляемом коммутаторе." }],
      },
      uz: {
        title: "Tarmoq kommutatorini (switch) qanday tanlash: PoE, boshqaruv, L2 yoki L3",
        excerpt: "Boshqariladiganmi yoki yo'qmi, kameralarga qancha PoE quvvat kerak, qachon L2 yetadi va tarmoq yadrosiga nega L3 kerak: ofis, videokuzatuv va server xonasi uchun amaliy tahlil.",
        sections: [{ h: "Boshqariladigan yoki oddiy", p: ["Oddiy switch — «taqsimlagich»: ulading — ishlaydi. Uy yoki kabinetdagi bir juft qurilmaga shu yetadi. Boshqariladigani VLAN (kameralarni ofis tarmog'idan ajratish), trafik prioriteti, port monitoringi va halqalardan himoya qo'shadi — ofis tarmog'i va videokuzatuvda narx farqini birinchi hal qilingan hodisayoq oqlaydi.", "Qoida oddiy: qurilmalar o'ntadan ko'p bo'lsa yoki tarmoqda kamera va telefoniya bo'lsa — boshqariladiganini oling."] }, { h: "PoE: kameralarni vitaya para orqali quvvatlash", p: ["PoE kommutator kamera, ulanish nuqtalari va IP-telefonlarni ma'lumot kabeli orqali quvvatlaydi — kamera yonida rozetka kerak emas. Quvvat byudjetini hisoblang: oddiy kamera 6–8 Vt, IK li gumbaz 12 Vt gacha, PTZ 25 Vt gacha, Wi-Fi 6 nuqtasi 20 Vt gacha oladi. 8 portli switch byudjeti odatda 60–120 Vt.", "Standartga ham qarang: 802.3af portga 15 Vt gacha, 802.3at (PoE+) 30 Vt gacha, bt — og'ir iste'molchilarga 60–90 Vt. Quvvatda 20–30 % zaxira majburiy — qishda kamera isitish yuk qo'shadi."] }, { h: "L2, L3 va aplinklar", p: ["L2 kommutator bitta tarmoq ichida ishlaydi — kirish darajasi: qavat, kabinet, kamerali stoyka. L3 quyi tarmoqlar orasida marshrutlaydi va korxona tarmog'i yadrosiga aylanadi. Kichik ofisda L3 kerak emas — routerga gigabit aplinkli L2 yetadi.", "Aplink — tor joy: switchga 24 gigabit port ulangan bo'lsa, yadro yoki serverga 10G SFP+ aplink oqilona. Hikvision, MikroTik, TP-Link, Ruijie va H3C kommutatorlarini vazifaga tanlaymiz, VLAN'ni oldindan sozlaymiz, loyihalarga H3C hamkorlik narxlarini beramiz."] },  { h: "Keyin chiqadigan uch xato", p: [
            "Birinchisi — «zo'rg'a» PoE-byudjet: qishki isitgichli kameralar iste'molni ikki barobar oshiradi, sovuqda uzoq portlar uzila boshlaydi. Ikkinchisi — maishiy svitchlar kaskadi: halqalar, tor joylar va diagnostika qilib bo'lmaydigan tarmoq. Uchinchisi — jiddiy tizimda noneym: o'nlab oqim yukida u osilib qoladi, kameralar sababsiz «miltillaydi».",
            "Retsept zerikarli, lekin ishlaydi: 30 % zaxirali quvvat byudjeti, kaskadlar o'rniga normal yadro va kamera hamda kassalar bor joyda boshqaruvli brend. Kommutatorlarni yetkazishda oldindan sozlaymiz — VLAN va monitoring birinchi kundan yoqilgan.",
          ] },
        ],
        faq: [{ q: "8 ta kamera uchun qanday kommutator kerak?", a: "90 Vt dan byudjetli va ikkita aplinkli 8 portli PoE — registrator va tarmoq uchun. Isitiladigan va PTZ kameralarga quvvatni alohida hisoblang." }, { q: "Switch routerdan nimasi bilan farq qiladi?", a: "Router tarmoqni internetga ulaydi va manzillar beradi; switch tarmoq ichida portlarni ko'paytiradi. Odatiy ofisda ular juft ishlaydi." }, { q: "VLAN nima va u menga nimaga kerak?", a: "VLAN bitta jismoniy switchni izolyatsiyalangan tarmoqlarga bo'ladi: kameralar buxgalteriyani ko'rmaydi, mehmon Wi-Fi serverlarni ko'rmaydi." }],
      },
      en: {
        title: "How to choose a network switch: PoE, management, L2 vs L3",
        excerpt: "Managed or unmanaged, how much PoE power cameras really need, when L2 is enough and why a network core wants L3 — a practical guide for offices, CCTV and server rooms.",
        sections: [{ h: "Managed or unmanaged", p: ["An unmanaged switch is a splitter: plug in and it works — fine for a home or a couple of devices. A managed one adds VLANs (isolating cameras from the office LAN), QoS, port monitoring and loop protection; in an office network it repays the price difference with the first incident you actually diagnose.", "The rule of thumb: more than a dozen devices, or cameras and telephony on the network — go managed."] }, { h: "PoE: powering cameras over the data cable", p: ["A PoE switch powers cameras, access points and IP phones over the data cable — no sockets at the camera. Count the power budget: a regular camera draws 6–8 W, an IR dome up to 12 W, a PTZ up to 25 W, a Wi-Fi 6 AP up to 20 W. A typical 8-port switch carries 60–120 W — not enough for eight PTZs.", "Watch the standard too: 802.3af gives up to 15 W per port, 802.3at (PoE+) up to 30 W, bt up to 60–90 W. Keep 20–30 % headroom — winter camera heating adds load."] }, { h: "L2, L3 and uplinks", p: ["An L2 switch lives inside one network — the access layer: a floor, a room, a camera rack. L3 routes between subnets and becomes the enterprise core: departments are isolated, inter-VLAN traffic is controlled. A small office does not need L3 — L2 with a gigabit uplink to the router is enough.", "The uplink is the bottleneck: with 24 gigabit ports in use, a 10G SFP+ uplink to the core or server is the sane choice. We match Hikvision, MikroTik, TP-Link, Ruijie and H3C switches to the task, preconfigure VLANs and offer H3C partner pricing on projects."] },  { h: "Three mistakes that surface later", p: [
            "First — a PoE budget \"just enough\": cameras with winter heating double their draw, and in frost the far ports start dropping. Second — cascades of household switches: loops, bottlenecks and a network impossible to diagnose. Third — a no-name in a serious system: under a dozen streams it hangs, and cameras \"blink\" for no visible reason.",
            "The recipe is boring but works: a power budget with 30 % margin, a proper core instead of cascades, and a managed brand wherever cameras and tills live. We preconfigure switches at delivery — VLANs and monitoring enabled from day one.",
          ] },
        ],
        faq: [{ q: "Which switch fits 8 CCTV cameras?", a: "An 8-port PoE unit with a 90 W+ budget and two uplinks — for the NVR and the LAN. Heated and PTZ cameras need their power counted separately." }, { q: "How is a switch different from a router?", a: "The router connects the network to the internet and hands out addresses; the switch multiplies ports inside the network. A typical office runs both." }, { q: "What is a VLAN for?", a: "A VLAN splits one physical switch into isolated networks: cameras cannot see accounting, guest Wi-Fi cannot see servers. Configured once on a managed switch." }],
      },
      tr: {
        title: "Ağ switchi nasıl seçilir: PoE, yönetim, L2 mi L3 mü",
        excerpt: "Yönetilebilir mi değil mi, kameralara gerçekte ne kadar PoE gücü gerekir, L2 ne zaman yeter ve çekirdek neden L3 ister — ofis, kamera sistemi ve sunucu odası için pratik rehber.",
        sections: [{ h: "Yönetilebilir mi, değil mi", p: ["Yönetilemeyen switch bir çoklayıcıdır: tak ve çalışsın — ev veya birkaç cihaz için yeterli. Yönetilebilir olan VLAN (kameraları ofis ağından yalıtma), QoS, port izleme ve döngü koruması ekler; ofis ağında fiyat farkını çözülen ilk arıza öder.", "Kural basit: cihaz sayısı onu geçiyorsa ya da ağda kamera ve telefon varsa — yönetilebilir alın."] }, { h: "PoE: kameraları veri kablosundan beslemek", p: ["PoE switch kamera, erişim noktası ve IP telefonları veri kablosundan besler — kamerada priz gerekmez. Güç bütçesini sayın: normal kamera 6–8 W, IR dome 12 W'a, PTZ 25 W'a, Wi-Fi 6 AP 20 W'a kadar çeker. Tipik 8 portlu 60–120 W taşır.", "Standarda da bakın: 802.3af port başına 15 W, 802.3at (PoE+) 30 W, bt 60–90 W verir. %20–30 pay şarttır — kışın kamera ısıtması yük ekler."] }, { h: "L2, L3 ve uplinkler", p: ["L2 tek ağ içinde yaşar — erişim katmanı: kat, oda, kamera kabini. L3 alt ağlar arasında yönlendirir ve kurumsal çekirdek olur. Küçük ofise L3 gerekmez — routera gigabit uplinkli L2 yeter.", "Uplink dar boğazdır: 24 gigabit port doluysa çekirdeğe 10G SFP+ uplink akıllıca olur. Hikvision, MikroTik, TP-Link, Ruijie ve H3C switchlerini göreve göre seçer, VLAN'ları önceden kurar, projelere H3C partner fiyatı veririz."] },  { h: "Sonradan ortaya çıkan üç hata", p: [
            "Birincisi «ucu ucuna» PoE bütçesi: kış ısıtmalı kameralar tüketimi ikiye katlar, ayazda uzak portlar düşmeye başlar. İkincisi ev tipi switch kaskadları: döngüler, dar boğazlar ve teşhis edilemeyen ağ. Üçüncüsü ciddi sistemde markasız cihaz: onlarca akış yükünde donar, kameralar görünür sebepsiz «göz kırpar».",
            "Reçete sıkıcı ama işe yarar: %30 paylı güç bütçesi, kaskad yerine düzgün çekirdek ve kameralarla kasaların olduğu yerde yönetilebilir marka. Switch'leri teslimatta ön-ayarlarız — VLAN ve izleme ilk günden açık.",
          ] },
        ],
        faq: [{ q: "8 kamera için hangi switch?", a: "90 W+ bütçeli, iki uplinkli 8 portlu PoE — NVR ve ağ için. Isıtmalı ve PTZ kameraların gücü ayrı sayılır." }, { q: "Switch ile router farkı?", a: "Router ağı internete bağlar ve adres dağıtır; switch ağ içinde portları çoğaltır. Tipik ofiste ikisi birlikte çalışır." }, { q: "VLAN ne işe yarar?", a: "VLAN tek fiziksel switchi yalıtılmış ağlara böler: kameralar muhasebeyi, misafir Wi-Fi sunucuları görmez." }],
      },
      zh: {
        title: "如何选择网络交换机：PoE、可管理性、L2还是L3",
        excerpt: "选可管理还是非管理、摄像机到底需要多少PoE功率、L2什么时候够用、网络核心为何要L3——面向办公室、监控和机房的实用指南。",
        sections: [{ h: "可管理还是非管理", p: ["非管理交换机就是「分线器」：插上就能用——家里或几台设备够了。可管理型增加VLAN（把摄像机与办公网隔离）、QoS、端口监控和环路保护；在办公网络里，第一次排查故障就能赚回差价。", "经验法则：设备超过十台，或网络里有摄像机和电话——选可管理型。"] }, { h: "PoE：用网线为摄像机供电", p: ["PoE交换机通过数据线为摄像机、AP和IP话机供电——摄像机旁不需要插座。算好功率预算：普通摄像机6–8W，红外半球最高12W，球机最高25W，Wi-Fi 6 AP最高20W。典型8口机型总预算60–120W——带八台球机是不够的。", "还要看标准：802.3af每口最高15W，802.3at（PoE+）30W，bt可达60–90W。留20–30%余量——冬季摄像机加热会增加负载。"] }, { h: "L2、L3与上联", p: ["L2交换机在单个网络内工作——接入层：楼层、房间、摄像机机柜。L3在子网间路由，充当企业核心：部门相互隔离，跨网流量可控。小办公室不需要L3——千兆上联到路由器的L2就够。", "上联是瓶颈：24个千兆口都在用时，到核心或服务器应配10G SFP+上联。我们按需求选配海康威视、MikroTik、TP-Link、锐捷和新华三交换机，预配VLAN，项目享新华三合作伙伴价。"] },  { h: "三个日后才显形的错误", p: [
            "其一，PoE预算「刚刚好」：带冬季加热的摄像机功耗翻倍，严寒里远端端口开始掉线。其二，家用交换机层层级联：环路、瓶颈、一张无法诊断的网。其三，正经系统里用杂牌：十几路码流的负载下它就死机，摄像机无缘无故「眨眼」。",
            "药方乏味但管用：功率预算留30%余量、用像样的核心替代级联、有摄像机和收银的地方用可管理的品牌。我们发货前预配置——VLAN和监控第一天就开着。",
          ] },
        ],
        faq: [{ q: "8台监控摄像机配哪种交换机？", a: "8口PoE、功率预算90W以上、带两个上联口——接录像机和网络。加热型和球机功率单独计算。" }, { q: "交换机和路由器有何区别？", a: "路由器连接互联网并分配地址；交换机在网内扩展端口。典型办公室两者配合使用。" }, { q: "VLAN有什么用？", a: "VLAN把一台物理交换机分成隔离网络：摄像机看不到财务，访客Wi-Fi看不到服务器。可管理交换机上配置一次即可。" }],
      },
    },
  },

  {
    slug: "ivms-4200-skachat-nastroit",
    date: "2026-08-31",
    related: ["cctv"],
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
    loc: {
      ru: {
        title: "iVMS-4200: как скачать и настроить программу Hikvision для просмотра камер",
        excerpt: "iVMS-4200 — бесплатная программа Hikvision для просмотра камер и архива с компьютера. Где скачать официальную версию, как добавить регистратор и камеры, и что делать с типовыми ошибками подключения.",
        sections: [{ h: "Что такое iVMS-4200 и зачем она нужна", p: ["iVMS-4200 — официальная бесплатная программа Hikvision для Windows и macOS: живой просмотр камер, воспроизведение архива, скачивание записей, управление PTZ и уведомления о событиях. Она работает с регистраторами NVR/DVR и IP-камерами Hikvision и HiLook, поддерживает десятки устройств одновременно — стандартный инструмент поста охраны и администратора.", "В отличие от мобильного Hik-Connect, iVMS-4200 рассчитана на постоянную работу на компьютере: многоэкранные раскладки, экспорт видео для разбора инцидентов, карты объектов и учёт событий. Для дома достаточно приложения на телефоне; для офиса и склада с постом наблюдения нужна именно iVMS-4200."] }, { h: "Где скачать официальную версию", p: ["Скачивайте iVMS-4200 только с официального сайта Hikvision — раздел Support → Download → Software (hikvision.com). Там всегда лежит актуальная версия для Windows и macOS без рекламы и переупаковки. Сторонние «сборки» с файлообменников нередко содержат лишнее — рисковать постом охраны не стоит.", "Для стран Центральной Азии Hikvision держит отдельный портал загрузок CATC — версии те же. После установки язык интерфейса переключается на русский в настройках (System Configuration → General → Language)."] }, { h: "Как добавить регистратор и камеры", p: ["Откройте Device Management → Add. Если компьютер в одной сети с регистратором, нажмите Online Device — программа сама найдёт устройства, останется ввести логин и пароль. Для добавления по адресу выбирайте IP/Domain и вводите адрес устройства, порт 8000, логин и пароль администратора.", "Если объект удалённый и белого IP нет — добавляйте через Hik-Connect Domain: включите Hik-Connect на регистраторе (Network → Advanced → Platform Access), войдите в аккаунт в iVMS-4200 и устройства подтянутся сами. После добавления откройте Main View и перетащите камеры в окна раскладки — живой просмотр готов; вкладка Remote Playback открывает архив."] }, { h: "Типовые проблемы и их решения", p: ["«Устройство не найдено» в одной сети — проверьте, что компьютер и регистратор в одной подсети, и отключите на время поиска брандмауэр. Ошибка пароля после нескольких попыток блокирует учётку на несколько минут — подождите и вводите заново, раскладку клавиатуры проверьте. Чёрные окна вместо видео при большом числе камер лечатся включением аппаратного декодирования (Image → Hardware Decoding) или просмотром дополнительного потока.", "Если после обновления Windows программа перестала видеть устройства — переустановите iVMS-4200 свежей версией с официального сайта: старые сборки конфликтуют с новыми компонентами системы. Настройки и список устройств при обновлении сохраняются."] }],
        faq: [{ q: "iVMS-4200 бесплатная?", a: "Да, полностью: Hikvision распространяет её свободно для своих устройств. Платных «про-версий» не существует — если где-то просят денег за скачивание, это не официальный источник." }, { q: "Работает ли iVMS-4200 с камерами HiLook и другими брендами?", a: "С HiLook — да, это суббренд Hikvision. Камеры других производителей подключаются по ONVIF, но без части функций; для смешанных систем удобнее универсальные VMS." }, { q: "Можно ли смотреть камеры без белого IP?", a: "Да — через облако Hik-Connect: включите Platform Access на регистраторе и войдите в аккаунт в iVMS-4200. Проброс портов и статический адрес не нужны." }],
      },
      uz: {
        title: "iVMS-4200: Hikvision kameralarini kompyuterdan ko'rish dasturini yuklab olish va sozlash",
        excerpt: "iVMS-4200 — Hikvision'ning kameralar va arxivni kompyuterdan ko'rish uchun bepul dasturi. Rasmiy versiyani qayerdan yuklab olish, registrator va kameralarni qanday qo'shish va odatiy xatolar bilan nima qilish.",
        sections: [{ h: "iVMS-4200 nima va nima uchun kerak", p: ["iVMS-4200 — Hikvision'ning Windows va macOS uchun rasmiy bepul dasturi: kameralarni jonli ko'rish, arxivni qayta ko'rish, yozuvlarni yuklab olish, PTZ boshqaruvi va hodisa xabarlari. NVR/DVR registratorlar hamda Hikvision va HiLook IP-kameralari bilan ishlaydi, bir vaqtda o'nlab qurilmani qo'llab-quvvatlaydi.", "Mobil Hik-Connect'dan farqli o'laroq, iVMS-4200 kompyuterda doimiy ishlashga mo'ljallangan: ko'p ekranli joylashuvlar, hodisalarni tahlil qilish uchun video eksporti, obyekt xaritalari. Uy uchun telefon ilovasi yetadi; kuzatuv postli ofis va ombor uchun aynan iVMS-4200 kerak."] }, { h: "Rasmiy versiyani qayerdan yuklab olish", p: ["iVMS-4200'ni faqat Hikvision rasmiy saytidan yuklab oling — Support → Download → Software bo'limi (hikvision.com). U yerda har doim Windows va macOS uchun dolzarb versiya bor. Fayl almashish saytlaridagi «yig'malar»da ortiqcha narsalar bo'lishi mumkin — qo'riqlash posti bilan tavakkal qilmang.", "Markaziy Osiyo davlatlari uchun Hikvision alohida CATC yuklab olish portalini yuritadi — versiyalar bir xil. O'rnatilgandan keyin interfeys tili sozlamalarda o'zgartiriladi (System Configuration → General → Language)."] }, { h: "Registrator va kameralarni qanday qo'shish", p: ["Device Management → Add oching. Kompyuter registrator bilan bitta tarmoqda bo'lsa, Online Device bosing — dastur qurilmalarni o'zi topadi, login va parolni kiritish qoladi. Manzil bo'yicha qo'shish uchun IP/Domain tanlab, qurilma manzili, 8000 port, administrator login-parolini kiriting.", "Obyekt masofada bo'lsa va oq IP bo'lmasa — Hik-Connect Domain orqali qo'shing: registratorda Hik-Connect'ni yoqing (Network → Advanced → Platform Access), iVMS-4200'da akkauntga kiring — qurilmalar o'zi keladi. Qo'shilgach Main View'da kameralarni oynalarga torting; Remote Playback arxivni ochadi."] }, { h: "Odatiy muammolar va yechimlar", p: ["Bitta tarmoqda «qurilma topilmadi» — kompyuter va registrator bitta quyi tarmoqda ekanini tekshiring, qidiruv payti brandmauerni o'chiring. Bir necha urinishdan keyin parol xatosi akkauntni bir necha daqiqaga bloklaydi — kutib qayta kiriting. Ko'p kamerada qora oynalar Hardware Decoding'ni yoqish bilan davolanadi.", "Windows yangilanishidan keyin dastur qurilmalarni ko'rmay qolsa — rasmiy saytdan yangi versiya bilan qayta o'rnating: sozlamalar va qurilmalar ro'yxati saqlanadi."] }],
        faq: [{ q: "iVMS-4200 bepulmi?", a: "Ha, to'liq bepul: Hikvision uni o'z qurilmalari uchun erkin tarqatadi. Pullik «pro-versiyalar» yo'q — yuklab olish uchun pul so'ralsa, bu rasmiy manba emas." }, { q: "iVMS-4200 HiLook va boshqa brendlar bilan ishlaydimi?", a: "HiLook bilan — ha, bu Hikvision sub-brendi. Boshqa ishlab chiqaruvchilar kameralari ONVIF orqali ulanadi, lekin funksiyalarning bir qismisiz." }, { q: "Oq IP bo'lmasa kameralarni ko'rish mumkinmi?", a: "Ha — Hik-Connect buluti orqali: registratorda Platform Access'ni yoqing va iVMS-4200'da akkauntga kiring. Port ochish va statik manzil kerak emas." }],
      },
      en: {
        title: "iVMS-4200: how to download and set up Hikvision's PC viewing software",
        excerpt: "iVMS-4200 is Hikvision's free desktop software for live view and playback. Where to download the official build, how to add an NVR and cameras, and how to fix the usual connection errors.",
        sections: [{ h: "What iVMS-4200 is for", p: ["iVMS-4200 is Hikvision's official free application for Windows and macOS: live view, archive playback, clip export, PTZ control and event notifications. It talks to Hikvision and HiLook NVRs, DVRs and IP cameras and handles dozens of devices at once — the standard tool for a guard post or an administrator.", "Unlike the mobile Hik-Connect app, iVMS-4200 is built for permanent desktop duty: multi-screen layouts, video export for incident review, site maps and event logs. A phone app is enough at home; an office or warehouse with a monitoring post needs iVMS-4200."] }, { h: "Where to download the official build", p: ["Download iVMS-4200 only from the official Hikvision site — Support → Download → Software (hikvision.com). The current Windows and macOS builds are always there, with no repacks. Third-party bundles from file hosts often carry extras you do not want on a security workstation.", "For Central Asia Hikvision runs a separate CATC download portal with the same builds. After installation the interface language is switched in System Configuration → General → Language."] }, { h: "Adding an NVR and cameras", p: ["Open Device Management → Add. On the same LAN, click Online Device — the app discovers devices itself; enter the admin login and password. To add by address, choose IP/Domain and enter the device address, port 8000 and admin credentials.", "For a remote site without a public IP, add via Hik-Connect Domain: enable Hik-Connect on the recorder (Network → Advanced → Platform Access), sign in to the account in iVMS-4200 and the devices appear. Then drag cameras into the Main View layout; Remote Playback opens the archive."] }, { h: "Common problems and fixes", p: ["Device not found on the same LAN — check both are in one subnet and pause the firewall during discovery. Repeated wrong passwords lock the account for a few minutes — wait and retype. Black tiles with many cameras are cured by Hardware Decoding (Image settings) or by viewing the sub-stream.", "If the app stops seeing devices after a Windows update, reinstall the latest build from the official site — settings and the device list survive the upgrade."] }],
        faq: [{ q: "Is iVMS-4200 free?", a: "Yes, completely: Hikvision distributes it freely for its devices. There is no paid pro edition — any site charging for the download is not official." }, { q: "Does it work with HiLook and other brands?", a: "HiLook — yes, it is a Hikvision sub-brand. Other makers' cameras connect over ONVIF with reduced features; mixed fleets are happier on a universal VMS." }, { q: "Can I view cameras without a public IP?", a: "Yes — through the Hik-Connect cloud: enable Platform Access on the recorder and sign in inside iVMS-4200. No port forwarding or static IP needed." }],
      },
      tr: {
        title: "iVMS-4200: Hikvision'ın PC izleme yazılımını indirme ve kurma",
        excerpt: "iVMS-4200, canlı izleme ve kayıt oynatma için Hikvision'ın ücretsiz masaüstü yazılımıdır. Resmi sürüm nereden indirilir, NVR ve kameralar nasıl eklenir, tipik bağlantı hataları nasıl çözülür.",
        sections: [{ h: "iVMS-4200 nedir, ne işe yarar", p: ["iVMS-4200, Hikvision'ın Windows ve macOS için resmi ücretsiz uygulamasıdır: canlı izleme, arşiv oynatma, klip dışa aktarma, PTZ kontrolü ve olay bildirimleri. Hikvision ve HiLook NVR/DVR'ları ve IP kameralarıyla çalışır, onlarca cihazı aynı anda yönetir.", "Mobil Hik-Connect'ten farklı olarak iVMS-4200 sürekli masaüstü görevi için tasarlanmıştır: çok ekranlı düzenler, olay incelemesi için video dışa aktarma, saha haritaları. Evde telefon uygulaması yeter; izleme noktalı ofis ve depoya iVMS-4200 gerekir."] }, { h: "Resmi sürüm nereden indirilir", p: ["iVMS-4200'ü yalnızca resmi Hikvision sitesinden indirin — Support → Download → Software (hikvision.com). Güncel Windows ve macOS sürümleri her zaman oradadır. Dosya paylaşım sitelerindeki paketler güvenlik bilgisayarında istenmeyen ekler taşıyabilir.", "Orta Asya için Hikvision aynı sürümleri sunan ayrı bir CATC indirme portalı işletir. Kurulumdan sonra arayüz dili System Configuration → General → Language'ten değiştirilir."] }, { h: "NVR ve kamera ekleme", p: ["Device Management → Add açın. Aynı ağdaysanız Online Device'a basın — uygulama cihazları kendisi bulur; yönetici adı ve şifresini girin. Adresle eklemek için IP/Domain seçin: cihaz adresi, 8000 portu ve yönetici bilgileri.", "Genel IP'si olmayan uzak saha için Hik-Connect Domain kullanın: kayıt cihazında Platform Access'i açın, iVMS-4200'de hesaba girin — cihazlar kendiliğinden gelir. Sonra kameraları Main View düzenine sürükleyin; Remote Playback arşivi açar."] }, { h: "Tipik sorunlar ve çözümleri", p: ["Aynı ağda cihaz bulunamıyorsa — ikisinin de aynı alt ağda olduğunu doğrulayın, arama sırasında güvenlik duvarını durdurun. Üst üste yanlış şifre hesabı birkaç dakika kilitler — bekleyip yeniden girin. Çok kamerada siyah kareler Hardware Decoding ile veya alt akış izlenerek çözülür.", "Windows güncellemesinden sonra cihazlar görünmezse resmi siteden son sürümü yeniden kurun — ayarlar ve cihaz listesi korunur."] }],
        faq: [{ q: "iVMS-4200 ücretsiz mi?", a: "Evet, tamamen: Hikvision kendi cihazları için serbestçe dağıtır. Ücretli pro sürüm yoktur — indirme için para isteyen kaynak resmi değildir." }, { q: "HiLook ve diğer markalarla çalışır mı?", a: "HiLook ile evet — Hikvision'ın alt markasıdır. Diğer üreticilerin kameraları ONVIF ile kısıtlı özelliklerle bağlanır." }, { q: "Genel IP olmadan izleme mümkün mü?", a: "Evet — Hik-Connect bulutu üzerinden: kayıt cihazında Platform Access'i açın, iVMS-4200'de hesaba girin. Port yönlendirme gerekmez." }],
      },
      zh: {
        title: "iVMS-4200：海康威视电脑客户端下载与设置指南",
        excerpt: "iVMS-4200是海康威视免费的电脑客户端，用于实时预览和录像回放。在哪里下载官方版本、如何添加录像机和摄像机、常见连接错误怎么解决。",
        sections: [{ h: "iVMS-4200是什么", p: ["iVMS-4200是海康威视面向Windows和macOS的官方免费客户端：实时预览、录像回放、片段导出、PTZ控制和事件通知。它连接海康威视和HiLook的NVR/DVR及IP摄像机，可同时管理数十台设备——是值班室和管理员的标准工具。", "与手机端Hik-Connect不同，iVMS-4200为电脑常驻值守设计：多屏布局、事件取证导出、电子地图和事件日志。家用手机App够用；有监控值守的办公室和仓库需要iVMS-4200。"] }, { h: "在哪里下载官方版本", p: ["请只从海康威视官网下载iVMS-4200——Support → Download → Software（hikvision.com）。那里始终提供最新的Windows和macOS版本。网盘上的第三方打包版常夹带多余内容，安防工作站不值得冒险。", "海康威视为中亚地区设有单独的CATC下载门户，版本相同。安装后在System Configuration → General → Language切换界面语言。"] }, { h: "添加录像机和摄像机", p: ["打开Device Management → Add。同一局域网内点Online Device——程序自动发现设备，输入管理员账号密码即可。按地址添加则选IP/Domain：输入设备地址、端口8000和管理员凭据。", "远程站点没有公网IP时，通过Hik-Connect Domain添加：在录像机上开启Hik-Connect（Network → Advanced → Platform Access），在iVMS-4200登录账号，设备自动出现。之后把摄像机拖入Main View布局；Remote Playback打开录像回放。"] }, { h: "常见问题与解决", p: ["同网段找不到设备——确认电脑与录像机在同一子网，搜索时暂时关闭防火墙。多次密码错误会锁定账号几分钟——稍候重输。摄像机多时出现黑窗，开启硬件解码或改看子码流即可。", "Windows更新后看不到设备——从官网重装最新版本：设置和设备列表会保留。"] }],
        faq: [{ q: "iVMS-4200免费吗？", a: "完全免费：海康威视为自家设备免费提供。不存在付费专业版——任何收费下载都不是官方渠道。" }, { q: "支持HiLook和其他品牌吗？", a: "HiLook支持——它是海康威视子品牌。其他品牌摄像机可通过ONVIF接入，但功能受限。" }, { q: "没有公网IP能看摄像机吗？", a: "能——通过Hik-Connect云：在录像机开启Platform Access，在iVMS-4200登录账号即可，无需端口映射和固定IP。" }],
      },
    },
  },

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
          { h: "Питание и пожарная безопасность", p: [
            "Электронный замок жив, пока есть питание, поэтому блок питания с резервным аккумулятором — не опция, а часть замка: без него первое отключение света оставит дверь нараспашку или наглухо закрытой, смотря по типу. Магнитный замок при пропадании питания открывается — его место на путях эвакуации; электромеханический остаётся закрытым — он для входных дверей.",
            "Вторая обязательная связка — с пожарной сигнализацией: по тревоге замки на путях эвакуации должны разблокироваться автоматически. Это требование норм закладывается в проект при монтаже — мы делаем это штатно в каждой установке.",
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
          { h: "Quvvat va yong'in xavfsizligi", p: [
            "Elektron qulf quvvat borida tirik, shuning uchun zaxira akkumulyatorli quvvat bloki opsiya emas, qulfning qismi: usiz birinchi svet o'chishi eshikni turiga qarab lang ochiq yoki butunlay yopiq qoldiradi. Magnit qulf quvvat yo'qolganda ochiladi — uning joyi evakuatsiya yo'llarida; elektromexanik yopiq qoladi — u kirish eshiklariga.",
            "Ikkinchi majburiy bog'lam — yong'in signalizatsiyasi bilan: trevoga bo'yicha evakuatsiya yo'llaridagi qulflar avtomatik ochilishi kerak. Bu me'yor talabi montajda loyihaga kiritiladi — buni har o'rnatishda shtatniy qilamiz.",
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
          { h: "Power and fire safety", p: [
            "An electronic lock lives while power lives, so a supply with a backup battery is not an option but part of the lock: without it the first outage leaves the door either wide open or shut tight, depending on the type. A magnetic lock opens when power fails — its place is on evacuation routes; an electromechanical one stays locked — it belongs on entrance doors.",
            "The second mandatory link is with the fire alarm: on alarm, locks on evacuation routes must release automatically. This code requirement goes into the design at installation — we do it as standard on every job.",
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
          { h: "Güç ve yangın güvenliği", p: [
            "Elektronik kilit güç varken yaşar; bu yüzden yedek akülü besleme bir seçenek değil kilidin parçasıdır: onsuz ilk kesinti kapıyı tipine göre ya ardına dek açık ya da sımsıkı kapalı bırakır. Manyetik kilit güç gidince açılır — yeri kaçış yollarıdır; elektromekanik kilitli kalır — giriş kapılarına aittir.",
            "İkinci zorunlu bağ yangın alarmıyladır: alarmda kaçış yollarındaki kilitler otomatik açılmalıdır. Bu norm gereği montajda projeye konur — her kurulumda bunu standart yaparız.",
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
          { h: "供电与消防安全", p: [
            "电子锁有电才活着，所以带备用电池的电源不是选配而是锁的一部分：没有它，第一次停电就会让门要么大敞要么死锁，取决于锁型。磁力锁断电即开——它属于疏散通道；电机锁断电保持锁闭——它属于入户门。",
            "第二个强制联动是与火灾报警：报警时疏散通道上的锁必须自动释放。这条规范要求在安装时写进方案——我们每单都标准执行。",
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
    hubs: ["pozharnaya-bezopasnost", "ognetushiteli"],
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
          { h: "Стоимость и жизнь после сдачи", p: [
            "Бюджет складывается из площади и категорий помещений, числа извещателей и шлейфов, типа прибора и состава оповещения. Маленький магазин закрывается пороговой системой за скромные деньги; офисному зданию нужна адресная — дороже на старте, но дешевле в эксплуатации за счёт точной диагностики. Честную смету даёт только выезд: мы считаем бесплатно по вашей планировке.",
            "После сдачи начинается регламент: проверки извещателей по графику, замена аккумуляторов, записи в журнале ТО — именно журнал инспектор открывает первым. Мы берём объекты на обслуживание с выездами по графику: система остаётся рабочей, а проверки проходят без замечаний и штрафов.",
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
          { h: "Narx va topshirilgandan keyingi hayot", p: [
            "Byudjet xonalar maydoni va kategoriyalari, xabar beruvchi va shleyflar soni, prib turi va ogohlantirish tarkibidan yig'iladi. Kichik do'kon chegaraviy tizim bilan kamtar pulga yopiladi; ofis binosiga manzilli kerak — startda qimmatroq, lekin aniq diagnostika hisobiga ekspluatatsiyada arzonroq. Halol smetani faqat chiqish beradi: rejangiz bo'yicha bepul hisoblaymiz.",
            "Topshirilgandan keyin reglament boshlanadi: jadval bo'yicha xabar beruvchilarni tekshirish, akkumulyatorlarni almashtirish, TX jurnaliga yozuvlar — inspektor birinchi bo'lib aynan jurnalni ochadi. Obyektlarni jadvalli chiqishlar bilan xizmatga olamiz: tizim ishchi qoladi, tekshiruvlar e'tiroz va jarimalarsiz o'tadi.",
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
          { h: "The cost, and life after handover", p: [
            "The budget is built from the area and category of the rooms, the number of detectors and loops, the panel type and the evacuation setup. A small shop is covered by a conventional system for modest money; an office building needs an addressable one — pricier upfront but cheaper to run thanks to precise diagnostics. Only a site visit yields an honest estimate: we calculate free of charge from your floor plan.",
            "After handover the schedule begins: detector checks on a calendar, battery replacement, entries in the maintenance log — the log is the first thing an inspector opens. We take sites onto scheduled service: the system stays operational, and inspections pass without findings or fines.",
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
          { h: "Maliyet ve teslimden sonraki hayat", p: [
            "Bütçe; alanların büyüklüğü ve kategorisi, dedektör ve zon sayısı, panel tipi ve tahliye düzeninden oluşur. Küçük mağaza mütevazı paraya konvansiyonel sistemle kapanır; ofis binasına adresli gerekir — başta pahalı ama hassas teşhis sayesinde işletmede ucuzdur. Dürüst teklifi yalnız keşif verir: kat planınıza göre ücretsiz hesaplarız.",
            "Teslimden sonra takvim başlar: programlı dedektör kontrolleri, akü değişimi, bakım defterine kayıtlar — müfettişin ilk açtığı şey o defterdir. Tesisleri programlı servise alırız: sistem çalışır kalır, denetimler bulgusuz ve cezasız geçer.",
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
          { h: "造价，以及交付之后的日子", p: [
            "预算由房间面积和类别、探测器和回路数量、主机类型及广播构成。小商店用总线制系统花不了多少钱；办公楼需要编址系统——前期贵些，但凭精确诊断在使用中更省。诚实的报价只能来自现场勘测：按您的平面图免费核算。",
            "交付之后规程开始运转：按计划检查探测器、更换电池、登记维保台账——检查员第一个翻的就是台账。我们按计划上门维保：系统始终在岗，检查零整改、零罚款。",
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
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
    loc: {
      ru: {
        title: "Сколько стоит видеонаблюдение: из чего складывается цена",
        excerpt: "Разбираем стоимость системы видеонаблюдения по частям: камеры, регистратор, диск, кабель и монтаж. Ориентиры цен для квартиры, магазина и склада — и на чём можно сэкономить без потери качества.",
        sections: [
          { h: "Из чего складывается цена", p: [
            "Стоимость видеонаблюдения складывается из четырёх частей: камеры, регистратор с жёстким диском, кабель с расходниками и работа по монтажу и настройке. В типовой смете на оборудование приходится 60–70 %, на монтаж — остальное. Чем больше камер и выше их разрешение, тем дороже и железо, и объём работ: каждая камера — это трасса кабеля, крепёж и точка настройки.",
            "Отдельная строка — глубина архива. Чтобы хранить запись 30 суток вместо 7, нужен диск в разы ёмче: восемь камер по 2 Мп при постоянной записи занимают порядка терабайта в неделю. Влияют и условия объекта: высота потолков, расстояние до регистратора, необходимость штробления или, наоборот, возможность пройти кабель-каналом по готовому ремонту.",
          ] },
          { h: "Ориентиры по бюджету", p: [
            "Квартира или небольшой дом на 2 камеры с регистратором и диском — самый доступный уровень: базовые IP-камеры 2 Мп стоят от 150–300 тысяч сум за штуку, простые регистраторы — от полумиллиона. Магазин или офис на 4–8 камер — средний сегмент: здесь уже нужны PoE-коммутатор, нормальный диск на 4–6 ТБ и день-два монтажа.",
            "Склад, производство или территория от 8–16 камер считаются только по проекту: появляются уличные камеры с ИК-подсветкой на 30–80 метров, оптика или радиомосты до дальних углов, шкаф с ИБП. Смета двух одинаковых по числу камер объектов может отличаться вдвое из-за трасс и условий — поэтому честный ответ на «сколько стоит» начинается с выезда инженера, у нас он бесплатный.",
          ] },
          { h: "Сколько камер нужно на самом деле", p: [
            "Для квартиры обычно достаточно 1–2 камер, для магазина или офиса — 4–8, для склада и территории — от 8. Точное число определяется задачами: закрыть входы, кассу, зоны хранения и слепые углы. Камеры общего обзора смотрят «что происходит», камеры идентификации — «кто это»: для лица на входе нужна камера ближе и с большим разрешением, чем для общего плана зала.",
            "Больше камер — не всегда лучше. Одна правильно расположенная камера 4 Мп с подходящим объективом закрывает зону эффективнее двух дешёвых, поставленных «для количества». Деньги, сэкономленные на лишних точках, разумнее вложить в качество камер на ключевых направлениях и в глубину архива.",
          ] },
          { h: "На чём можно и нельзя экономить", p: [
            "Разумная экономия: взять HiLook вместо старших линеек Hikvision на второстепенные зоны, отказаться от облачных подписок при достаточном локальном архиве, не переплачивать за 4K там, где хватает 2–4 Мп. Аналоговые комплекты HDCVI до сих пор выигрывают по цене при модернизации, где уже проложен коаксиал.",
            "Экономить нельзя на трёх вещах: камерах в ключевых зонах (касса, вход, приёмка), жёстком диске — обычный компьютерный диск не рассчитан на круглосуточную запись и умирает первым — и на монтаже. Скрутки вместо коннекторов, кабель без запаса по сечению питания и «настройка по умолчанию» всплывают через полгода, а переделка стоит дороже разницы.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит видеонаблюдение для магазина на 4 камеры?", a: "Базовый IP-комплект: 4 камеры 2 Мп, регистратор, диск 2–4 ТБ, PoE-коммутатор, кабель и монтаж за один день. Точную смету считаем после бесплатного выезда — на цену влияют длины трасс и условия прокладки." },
          { q: "Что дороже — IP или аналоговая система?", a: "IP дороже по оборудованию, но даёт выше разрешение, питание по одному кабелю (PoE) и аналитику. Аналог HDCVI выгоден при модернизации, где коаксиал уже проложен. На новых объектах мы почти всегда считаем IP." },
          { q: "Входит ли настройка просмотра с телефона в стоимость?", a: "Да. Настройка приложений, удалённого доступа и уведомлений входит в монтаж — доплат за «настройку телефона» у нас нет." },
          { q: "Можно ли поставить систему поэтапно?", a: "Да, это частая практика: сначала критичные зоны — вход и касса, затем расширение. Важно сразу взять регистратор с запасом каналов, чтобы не менять его на втором этапе." },
        ],
      },
      uz: {
        title: "Videokuzatuv qancha turadi: narx nimalardan tashkil topadi",
        excerpt: "Videokuzatuv tizimi narxini qismlarga ajratamiz: kameralar, registrator, disk, kabel va montaj. Kvartira, do'kon va ombor uchun narx mo'ljallari — hamda sifatni yo'qotmasdan qayerda tejash mumkin.",
        sections: [
          { h: "Narx nimalardan tashkil topadi", p: [
            "Videokuzatuv narxi to'rt qismdan iborat: kameralar, qattiq diskli registrator, kabel va sarf materiallari hamda montaj va sozlash ishlari. Tipik smetada uskunaga 60–70 % to'g'ri keladi, qolgani — montajga. Kameralar qancha ko'p va ruxsati yuqori bo'lsa, temir ham, ish hajmi ham shuncha qimmat: har kamera — bu kabel trassasi, mahkamlash va sozlash nuqtasi.",
            "Alohida qator — arxiv chuqurligi. Yozuvni 7 kun o'rniga 30 kun saqlash uchun bir necha barobar sig'imli disk kerak: doimiy yozuvda 2 Mp li sakkiz kamera haftasiga taxminan bir terabayt egallaydi. Obyekt sharoitlari ham ta'sir qiladi: ship balandligi, registratorgacha masofa, shtroblash zarurati yoki aksincha, tayyor ta'mirda kabel-kanal bilan o'tish imkoni.",
          ] },
          { h: "Byudjet bo'yicha mo'ljallar", p: [
            "Registrator va diskli 2 kamerali kvartira yoki kichik uy — eng arzon daraja: bazaviy 2 Mp IP-kameralar donasi 150–300 ming so'mdan, oddiy registratorlar yarim milliondan boshlanadi. 4–8 kamerali do'kon yoki ofis — o'rta segment: bu yerda PoE-kommutator, 4–6 TB normal disk va bir-ikki kun montaj kerak bo'ladi.",
            "8–16 kameradan boshlanadigan ombor, ishlab chiqarish yoki hudud faqat loyiha bo'yicha hisoblanadi: 30–80 metrga IK-yoritishli ko'cha kameralari, uzoq burchaklargacha optika yoki radioko'priklar, UPS li shkaf paydo bo'ladi. Kamera soni bir xil ikki obyekt smetasi trassalar va sharoitlar tufayli ikki barobar farq qilishi mumkin — shuning uchun «qancha turadi»ga halol javob muhandis chiqishidan boshlanadi, bizda u bepul.",
          ] },
          { h: "Aslida nechta kamera kerak", p: [
            "Kvartiraga odatda 1–2 kamera yetadi, do'kon yoki ofisga — 4–8, ombor va hududga — 8 dan. Aniq son vazifalardan kelib chiqadi: kirishlar, kassa, saqlash zonalari va ko'r burchaklarni yopish. Umumiy ko'rinish kameralari «nima bo'layotganini» ko'radi, identifikatsiya kameralari — «bu kim»: kirishdagi yuz uchun zal umumiy planidan ko'ra yaqinroq va yuqori ruxsatli kamera kerak.",
            "Ko'proq kamera — har doim ham yaxshi emas. Mos obyektivli, to'g'ri joylashtirilgan bitta 4 Mp kamera zonani «son uchun» qo'yilgan ikkita arzon kameradan samaraliroq yopadi. Ortiqcha nuqtalarda tejalgan pulni asosiy yo'nalishlardagi kameralar sifatiga va arxiv chuqurligiga qo'ygan oqilona.",
          ] },
          { h: "Qayerda tejash mumkin va mumkin emas", p: [
            "Oqilona tejash: ikkinchi darajali zonalarga Hikvision katta liniyalari o'rniga HiLook olish, lokal arxiv yetarli bo'lsa bulutli obunalardan voz kechish, 2–4 Mp yetadigan joyda 4K uchun ortiqcha to'lamaslik. Koaksial allaqachon yotqizilgan modernizatsiyada HDCVI analog to'plamlari hamon narxda yutadi.",
            "Uch narsada tejash mumkin emas: asosiy zonalardagi kameralar (kassa, kirish, qabul), qattiq disk — oddiy kompyuter diski kecha-kunduz yozuvga mo'ljallanmagan va birinchi bo'lib o'ladi — va montaj. Konnektor o'rniga o'rashlar, quvvat kesimi zaxirasisiz kabel va «standart sozlash» yarim yildan keyin chiqadi, qayta qilish esa farqdan qimmat turadi.",
          ] },
        ],
        faq: [
          { q: "4 kamerali do'kon uchun videokuzatuv qancha turadi?", a: "Bazaviy IP-to'plam: 4 ta 2 Mp kamera, registrator, 2–4 TB disk, PoE-kommutator, kabel va bir kunlik montaj. Aniq smetani bepul chiqishdan keyin hisoblaymiz — narxga trassa uzunliklari va yotqizish sharoitlari ta'sir qiladi." },
          { q: "Qaysi biri qimmat — IP yoki analog tizim?", a: "IP uskuna bo'yicha qimmatroq, lekin yuqori ruxsat, bitta kabeldan quvvat (PoE) va analitika beradi. Koaksial yotqizilgan modernizatsiyada HDCVI analog foydali. Yangi obyektlarda deyarli doim IP hisoblaymiz." },
          { q: "Telefondan ko'rishni sozlash narxga kiradimi?", a: "Ha. Ilovalar, masofaviy kirish va bildirishnomalarni sozlash montajga kiradi — bizda «telefon sozlash» uchun qo'shimcha to'lov yo'q." },
          { q: "Tizimni bosqichma-bosqich o'rnatsa bo'ladimi?", a: "Ha, bu keng tarqalgan amaliyot: avval kritik zonalar — kirish va kassa, keyin kengaytirish. Ikkinchi bosqichda almashtirmaslik uchun registratorni darhol kanallar zaxirasi bilan olish muhim." },
        ],
      },
      en: {
        title: "How Much Does CCTV Cost: What Makes Up the Price",
        excerpt: "Breaking the cost of a surveillance system into parts: cameras, recorder, disk, cabling and installation. Budget guides for an apartment, a shop and a warehouse — and where to save without losing quality.",
        sections: [
          { h: "What makes up the price", p: [
            "The cost of CCTV consists of four parts: cameras, a recorder with a hard drive, cabling with consumables, and installation with setup. In a typical estimate, hardware takes 60–70 % and labor the rest. More cameras and higher resolution mean more of both: every camera is a cable run, mounting hardware and a point to configure.",
            "Archive depth is its own line. Storing 30 days instead of 7 needs a drive several times larger: eight 2 MP cameras recording continuously fill roughly a terabyte a week. Site conditions matter too: ceiling height, distance to the recorder, wall chasing — or, conversely, the option to run trunking over a finished interior.",
          ] },
          { h: "Budget reference points", p: [
            "An apartment or small house with 2 cameras, a recorder and a disk is the entry level: basic 2 MP IP cameras start at 150–300 thousand UZS apiece, simple recorders from half a million. A shop or office with 4–8 cameras is the middle segment: it adds a PoE switch, a proper 4–6 TB drive and a day or two of installation.",
            "A warehouse, factory or grounds from 8–16 cameras is quoted only from a design: outdoor cameras with 30–80 m IR, fiber or radio links to far corners, and a cabinet with a UPS enter the picture. Two sites with equal camera counts can differ twofold because of cable runs and conditions — so an honest answer to \"how much\" starts with an engineer's visit, which is free with us.",
          ] },
          { h: "How many cameras you actually need", p: [
            "An apartment usually needs 1–2 cameras, a shop or office 4–8, a warehouse or grounds 8 and up. The exact number follows the tasks: cover the entrances, the till, storage zones and blind corners. Overview cameras answer \"what is happening\"; identification cameras answer \"who is it\": a face at the entrance needs a closer camera with more resolution than a general view of the floor.",
            "More cameras is not always better. One well-placed 4 MP camera with the right lens covers a zone more effectively than two cheap ones installed \"for the count\". Money saved on redundant points is better invested in camera quality on key directions and in archive depth.",
          ] },
          { h: "Where you can and cannot save", p: [
            "Reasonable savings: HiLook instead of higher Hikvision lines for secondary zones, no cloud subscriptions when a local archive suffices, no 4K premium where 2–4 MP does the job. Analog HDCVI kits still win on price when upgrading sites with coax already in the walls.",
            "Never save on three things: cameras in key zones (till, entrance, goods-in), the hard drive — a desktop drive is not built for 24/7 recording and dies first — and the installation. Twisted joints instead of connectors, undersized power runs and \"default settings\" surface six months later, and redoing costs more than the difference.",
          ] },
        ],
        faq: [
          { q: "How much does CCTV for a 4-camera shop cost?", a: "A basic IP kit: four 2 MP cameras, a recorder, a 2–4 TB drive, a PoE switch, cabling and one day of installation. We give an exact quote after a free site visit — cable runs and conditions drive the price." },
          { q: "Which is more expensive — IP or analog?", a: "IP costs more in hardware but gives higher resolution, single-cable power (PoE) and analytics. Analog HDCVI pays off when upgrading sites with existing coax. For new sites we almost always quote IP." },
          { q: "Is phone viewing setup included in the price?", a: "Yes. App setup, remote access and notifications are part of the installation — we charge nothing extra for \"phone setup\"." },
          { q: "Can the system be installed in stages?", a: "Yes, and it is common: critical zones first — entrance and till — then expansion. Just pick a recorder with spare channels from the start so it does not need replacing at stage two." },
        ],
      },
      tr: {
        title: "Kamera Sistemi Ne Kadar Tutar: Fiyat Neyden Oluşur",
        excerpt: "Güvenlik kamerası sisteminin maliyetini parçalara ayırıyoruz: kameralar, kayıt cihazı, disk, kablo ve montaj. Daire, mağaza ve depo için bütçe rehberi — ve kaliteden ödün vermeden nerede tasarruf edilir.",
        sections: [
          { h: "Fiyat neyden oluşur", p: [
            "Kamera sisteminin maliyeti dört parçadan oluşur: kameralar, diskli kayıt cihazı, kablo ve sarf malzemeleri, montaj ve ayar işçiliği. Tipik teklifte donanım %60–70, işçilik kalanını alır. Kamera sayısı ve çözünürlük arttıkça ikisi de büyür: her kamera bir kablo güzergâhı, montaj malzemesi ve ayar noktasıdır.",
            "Arşiv derinliği ayrı kalemdir. 7 yerine 30 gün kayıt, kat kat büyük disk ister: sürekli kayıtta sekiz 2 MP kamera haftada yaklaşık bir terabayt doldurur. Saha koşulları da etkiler: tavan yüksekliği, kayıt cihazına mesafe, kırım gereği — veya tersine, bitmiş tadilatta kanalla geçme imkânı.",
          ] },
          { h: "Bütçe için referanslar", p: [
            "Kayıt cihazı ve diskli 2 kameralı daire veya küçük ev giriş seviyesidir: temel 2 MP IP kameralar adet 150–300 bin somdan, basit kayıt cihazları yarım milyondan başlar. 4–8 kameralı mağaza veya ofis orta segmenttir: PoE switch, düzgün 4–6 TB disk ve bir-iki gün montaj eklenir.",
            "8–16 kameradan başlayan depo, fabrika veya açık alan yalnızca projeyle fiyatlanır: 30–80 m IR'li dış kameralar, uzak köşelere fiber veya telsiz köprüler, UPS'li kabin devreye girer. Kamera sayısı aynı iki tesis, güzergâhlar ve koşullar yüzünden iki kat farklı çıkabilir — bu yüzden «ne kadar»ın dürüst yanıtı mühendis keşfiyle başlar; bizde ücretsizdir.",
          ] },
          { h: "Gerçekte kaç kamera gerekir", p: [
            "Daireye genelde 1–2 kamera yeter, mağaza veya ofise 4–8, depo ve açık alana 8 ve üzeri. Kesin sayı görevlerden çıkar: girişleri, kasayı, depolama bölgelerini ve kör noktaları kapatmak. Genel bakış kameraları «ne oluyor»u, kimlik kameraları «kim»i yanıtlar: girişteki yüz için, salonun genel planından daha yakın ve yüksek çözünürlüklü kamera gerekir.",
            "Daha çok kamera her zaman daha iyi değildir. Doğru lensli, iyi konumlanmış tek 4 MP kamera, «sayı olsun» diye takılan iki ucuz kameradan etkilidir. Gereksiz noktalardan artan para, kilit yönlerdeki kamera kalitesine ve arşiv derinliğine yatırılmalıdır.",
          ] },
          { h: "Nerede tasarruf edilir, nerede edilmez", p: [
            "Makul tasarruf: ikincil bölgelere üst Hikvision serileri yerine HiLook, yerel arşiv yetiyorsa bulut aboneliği yok, 2–4 MP'nin yettiği yerde 4K primi yok. Koaksiyelin döşeli olduğu yenilemelerde analog HDCVI setleri hâlâ fiyatta kazanır.",
            "Üç şeyden tasarruf edilmez: kilit bölgelerdeki kameralar (kasa, giriş, mal kabul), disk — masaüstü disk 7/24 kayda göre değildir ve önce o ölür — ve montaj. Konnektör yerine büküm, kesiti yetersiz besleme hattı ve «varsayılan ayarlar» altı ay sonra ortaya çıkar; yeniden yapmak aradaki farktan pahalıdır.",
          ] },
        ],
        faq: [
          { q: "4 kameralı mağaza için sistem ne kadar tutar?", a: "Temel IP set: dört 2 MP kamera, kayıt cihazı, 2–4 TB disk, PoE switch, kablo ve bir günlük montaj. Kesin teklifi ücretsiz keşiften sonra veririz — fiyatı güzergâh uzunlukları ve koşullar belirler." },
          { q: "Hangisi pahalı — IP mi analog mu?", a: "IP donanımda daha pahalıdır ama yüksek çözünürlük, tek kablodan güç (PoE) ve analitik verir. Koaksiyel hazırsa analog HDCVI yenilemede kârlıdır. Yeni tesislerde neredeyse hep IP hesaplarız." },
          { q: "Telefondan izleme ayarı fiyata dahil mi?", a: "Evet. Uygulama, uzaktan erişim ve bildirim ayarları montaja dahildir — «telefon kurulumu» için ek ücret almayız." },
          { q: "Sistem aşamalı kurulabilir mi?", a: "Evet, yaygın bir uygulamadır: önce kritik bölgeler — giriş ve kasa — sonra genişleme. İkinci aşamada değiştirmemek için kayıt cihazını baştan kanal yedeğiyle seçmek önemlidir." },
        ],
      },
      zh: {
        title: "视频监控要花多少钱：价格由什么构成",
        excerpt: "把监控系统的费用拆开看：摄像机、录像机、硬盘、线缆和施工。公寓、商店和仓库的预算参考——以及哪里可以省钱而不牺牲质量。",
        sections: [
          { h: "价格由什么构成", p: [
            "视频监控的费用由四部分组成：摄像机、带硬盘的录像机、线缆和辅材、安装调试的人工。典型预算里设备占60–70%，其余是施工。摄像机越多、分辨率越高，两者都水涨船高：每台摄像机都意味着一条线缆路由、一套支架和一个调试点。",
            "存储时长是单独一项。要把录像从7天延长到30天，硬盘容量要翻几倍：八台2MP摄像机连续录像每周约占一个TB。现场条件同样影响价格：层高、到录像机的距离、要不要开槽——或者反过来，已装修房能否走线槽。",
          ] },
          { h: "预算参考", p: [
            "公寓或小型住宅配2台摄像机加录像机和硬盘是入门级：基础2MP IP摄像机每台15–30万苏姆起，简单录像机50万起。4–8台摄像机的商店或办公室是中间档：要加PoE交换机、4–6TB的像样硬盘和一两天施工。",
            "8–16台起的仓库、工厂或场区只按方案报价：会出现30–80米红外的室外机、通向远端的光纤或无线网桥、带UPS的机柜。摄像机数量相同的两个项目，因路由和条件不同，造价可能差一倍——所以「多少钱」的诚实回答从工程师勘测开始，我们的勘测免费。",
          ] },
          { h: "到底需要几台摄像机", p: [
            "公寓通常1–2台就够，商店或办公室4–8台，仓库和场区8台起。确切数量由任务决定：盖住出入口、收银台、存储区和视觉死角。全景摄像机回答「发生了什么」，识别摄像机回答「是谁」：拍清入口人脸需要的机位和分辨率，远高于卖场的全景。",
            "摄像机不是越多越好。一台位置正确、镜头合适的4MP摄像机，比两台「凑数」的便宜货更能盖住一个区域。省下冗余点位的钱，更该投到关键方向的摄像机品质和存储时长上。",
          ] },
          { h: "哪里能省、哪里不能省", p: [
            "合理的节省：次要区域用HiLook替代海康威视高端线，本地存储够用就不订云服务，2–4MP够用的地方不为4K多花钱。已有同轴线的改造项目，模拟HDCVI套装至今在价格上占优。",
            "三样东西不能省：关键区域的摄像机（收银台、入口、收货区）、硬盘——普通电脑硬盘不是为7×24录像设计的，最先坏的就是它——还有施工。用绞接代替接头、供电线径不留余量、「默认设置」交付，半年后全会暴露，返工比差价贵得多。",
          ] },
        ],
        faq: [
          { q: "4台摄像机的商店监控要多少钱？", a: "基础IP套装：四台2MP摄像机、录像机、2–4TB硬盘、PoE交换机、线缆加一天施工。免费勘测后给出精确报价——路由长度和施工条件决定价格。" },
          { q: "IP和模拟哪个更贵？", a: "IP设备更贵，但分辨率更高、一线供电（PoE）、支持智能分析。已有同轴线的改造用模拟HDCVI划算。新项目我们几乎都按IP核算。" },
          { q: "手机看监控的配置包含在价格里吗？", a: "包含。应用、远程访问和推送的配置属于施工内容——我们不收「调手机」的额外费用。" },
          { q: "系统能分期安装吗？", a: "可以，这很常见：先装关键区域——入口和收银台，之后扩展。关键是录像机一开始就选带余量通道的，免得第二期换机。" },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-kameru-videonablyudeniya",
    date: "2026-07-17",
    related: ["cctv"],
    hubs: ["ip-kamery"],
    loc: {
      ru: {
        title: "Как выбрать камеру видеонаблюдения: разрешение, объектив, ночная съёмка",
        excerpt: "Практичный разбор характеристик камеры: сколько мегапикселей нужно на самом деле, как выбрать фокусное расстояние, что важно для ночной съёмки и улицы — без маркетинговой шелухи.",
        sections: [
          { h: "Разрешение: сколько мегапикселей нужно", p: [
            "Мегапиксели — первое, чем продают камеру, и первое, в чём переплачивают. Для общего наблюдения за комнатой или двором достаточно 2 Мп (Full HD): видно, что происходит, кто вошёл и куда пошёл. Чтобы уверенно узнавать лица на входе или читать ценники у кассы, берут 4 Мп. Разрешение 8 Мп (4K) оправдано на широких планах, из которых нужно вырезать детали: парковка, периметр, торговый зал целиком.",
            "Важно помнить: выше разрешение — больше архив и нагрузка на сеть. Камера 8 Мп занимает на диске вчетверо больше 2 Мп, а на слабом регистраторе четыре таких камеры просто не потянут запись. Разрешение подбирается под задачу зоны, а не «побольше про запас».",
          ] },
          { h: "Объектив и угол обзора", p: [
            "Фокусное расстояние определяет, что увидит камера. Стандартные 2,8 мм дают широкий угол около 100° — это выбор для комнат, входных групп и небольших дворов: всё видно, но лица различимы только вблизи. Объектив 4 мм сужает угол и «приближает» картинку — им закрывают коридоры и подходы. 6–12 мм смотрят далеко и узко: въезд, касса с расстояния, номер машины на воротах.",
            "Есть простое правило: одна камера — одна задача. Попытка одной камерой «видеть всё и читать лица» заканчивается тем, что она не делает ни того, ни другого. Для гибкости существуют вариофокальные модели с настраиваемым фокусным и моторизованные, которые можно перенастраивать удалённо.",
          ] },
          { h: "Ночная съёмка и улица", p: [
            "Ночью камера работает с ИК-подсветкой: в паспорте пишут дальность 20, 30, 50 или 80 метров, и это честный предел различимости, а не «что-то видно». Для двора хватает 30 метров, для периметра склада берут 50–80. Технология ColorVu (Hikvision) и её аналоги дают цветную ночную картинку — цвет одежды и машины ночью часто важнее лишних мегапикселей.",
            "Для улицы смотрите класс защиты: IP66/IP67 против пыли и ливня, рабочая температура до −40° для нашей зимы, антивандальный корпус IK10 там, где до камеры можно дотянуться. Уличная камера без подогрева объектива в мороз запотевает изнутри — на этом экономят чаще всего, и зря.",
          ] },
          { h: "IP или аналог, и что ещё учесть", p: [
            "IP-камера передаёт цифровую картинку по сети и питается по тому же кабелю (PoE), поддерживает аналитику — детекцию людей и машин, пересечение линий. Аналоговая HDCVI/TVI дешевле и работает по коаксиалу — разумный выбор при модернизации старой системы. В новых проектах мы почти всегда ставим IP: разница в цене окупается возможностями.",
            "Из «мелочей», которые оказываются важными: микрофон, если нужен звук; слот microSD для локальной записи на случай обрыва сети; аналитика на борту (AcuSense у Hikvision, SMD у Dahua), которая отличает человека от собаки и ветки — без неё уведомления с уличной камеры превращаются в спам. Мы подбираем камеры под задачи объекта и бесплатно считаем комплект — со склада в Ташкенте, с гарантией.",
          ] },
        ],
        faq: [
          { q: "Какая камера нужна, чтобы узнавать лица на входе?", a: "4 Мп с объективом, при котором на лицо приходится достаточно пикселей на дистанции входа: обычно 4 мм на 3–5 метрах. Ставится на уровне лица, а не под потолком «сверху вниз»." },
          { q: "Что такое ColorVu и стоит ли переплачивать?", a: "Это цветная ночная съёмка на светосильной матрице с мягкой подсветкой. Для дворов, парковок и касс — да, стоит: цвет машины и одежды ночью даёт больше, чем пара лишних мегапикселей." },
          { q: "Купольная или цилиндрическая — какая лучше?", a: "Дело не в форме, а в месте: купольные аккуратнее в помещениях и антивандальнее, цилиндрические с большой ИК-подсветкой лучше на улице и периметре. Характеристики важнее корпуса." },
          { q: "Можно ли поставить одну поворотную PTZ вместо трёх обычных?", a: "PTZ смотрит в одну сторону в каждый момент времени: пока она повёрнута к воротам, двор не пишется. PTZ хороша как дополнение к стационарным камерам под живое наблюдение, а не вместо них." },
        ],
      },
      uz: {
        title: "Videokuzatuv kamerasini qanday tanlash: ruxsat, obyektiv, tungi suratga olish",
        excerpt: "Kamera xususiyatlarining amaliy tahlili: aslida nechta megapiksel kerak, fokus masofasini qanday tanlash, tungi va ko'cha suratga olishda nima muhim — marketing po'chog'isiz.",
        sections: [
          { h: "Ruxsat: nechta megapiksel kerak", p: [
            "Megapiksellar — kamerani sotishda birinchi ko'rsatiladigan va ko'pincha ortiqcha to'lanadigan narsa. Xona yoki hovlini umumiy kuzatishga 2 Mp (Full HD) yetadi: nima bo'layotgani, kim kirib qayoqqa ketgani ko'rinadi. Kirishda yuzlarni ishonchli tanish yoki kassa yonida narxlarni o'qish uchun 4 Mp olinadi. 8 Mp (4K) detallar kesib olinadigan keng planlarda o'zini oqlaydi: parking, perimetr, butun savdo zali.",
            "Esda tuting: ruxsat yuqori — arxiv katta va tarmoqqa yuk ko'p. 8 Mp kamera diskda 2 Mp dan to'rt barobar ko'p joy oladi, kuchsiz registratorda to'rtta bunday kamera yozuvni tortmaydi. Ruxsat «zaxiraga kattaroq» emas, zona vazifasiga qarab tanlanadi.",
          ] },
          { h: "Obyektiv va ko'rish burchagi", p: [
            "Fokus masofasi kamera nimani ko'rishini belgilaydi. Standart 2,8 mm taxminan 100° keng burchak beradi — xonalar, kirish guruhlari va kichik hovlilar tanlovi: hammasi ko'rinadi, lekin yuzlar faqat yaqindan farqlanadi. 4 mm obyektiv burchakni toraytirib tasvirni «yaqinlashtiradi» — u bilan koridor va yo'laklar yopiladi. 6–12 mm uzoqqa va tor qaraydi: kirish, masofadagi kassa, darvozadagi mashina raqami.",
            "Oddiy qoida bor: bitta kamera — bitta vazifa. Bitta kamera bilan «hammasini ko'rish va yuzlarni o'qish»ga urinish u na unisini, na bunisini qilmasligi bilan tugaydi. Moslashuvchanlik uchun sozlanadigan fokusli variofokal va masofadan qayta sozlanadigan motorli modellar bor.",
          ] },
          { h: "Tungi suratga olish va ko'cha", p: [
            "Kechasi kamera IK-yoritish bilan ishlaydi: pasportda 20, 30, 50 yoki 80 metr masofa yoziladi — bu «nimadir ko'rinadi» emas, halol farqlash chegarasi. Hovliga 30 metr yetadi, ombor perimetriga 50–80 olinadi. ColorVu (Hikvision) texnologiyasi va uning o'xshashlari rangli tungi tasvir beradi — kechasi kiyim va mashina rangi ko'pincha ortiqcha megapiksellardan muhimroq.",
            "Ko'cha uchun himoya sinfiga qarang: chang va jalaga qarshi IP66/IP67, bizning qish uchun −40° gacha ish harorati, kameraga qo'l yetadigan joyda IK10 antivandal korpus. Obyektiv isitgichisiz ko'cha kamerasi sovuqda ichidan terlaydi — eng ko'p shunda tejashadi, va bekorga.",
          ] },
          { h: "IP yoki analog, va yana nimani hisobga olish", p: [
            "IP-kamera raqamli tasvirni tarmoq orqali uzatadi va o'sha kabeldan quvvatlanadi (PoE), analitikani qo'llaydi — odam va mashina detektsiyasi, chiziq kesish. Analog HDCVI/TVI arzonroq va koaksialda ishlaydi — eski tizimni modernizatsiya qilishda oqilona tanlov. Yangi loyihalarda deyarli doim IP qo'yamiz: narx farqi imkoniyatlar bilan qoplanadi.",
            "Muhim bo'lib chiqadigan «mayda-chuydalar»: ovoz kerak bo'lsa mikrofon; tarmoq uzilganda lokal yozuv uchun microSD sloti; bortdagi analitika (Hikvision da AcuSense, Dahua da SMD) — odamni it va shoxdan farqlaydi, usiz ko'cha kamerasidan bildirishnomalar spamga aylanadi. Kameralarni obyekt vazifalariga tanlaymiz va to'plamni bepul hisoblaymiz — Toshkentdagi ombordan, kafolat bilan.",
          ] },
        ],
        faq: [
          { q: "Kirishda yuzlarni tanish uchun qanday kamera kerak?", a: "Kirish masofasida yuzga yetarli piksel to'g'ri keladigan obyektivli 4 Mp: odatda 3–5 metrda 4 mm. Ship ostidan «tepadan pastga» emas, yuz darajasida o'rnatiladi." },
          { q: "ColorVu nima va ortiqcha to'lashga arziydimi?", a: "Bu yorug' sezgir matritsa va yumshoq yoritishli rangli tungi surat. Hovli, parking va kassalarga — ha, arziydi: kechasi mashina va kiyim rangi bir juft ortiqcha megapikseldan ko'proq beradi." },
          { q: "Gumbazli yoki silindrli — qaysi biri yaxshi?", a: "Gap shaklda emas, joyda: gumbazlilar xonalarda ozodaroq va antivandalroq, katta IK-yoritishli silindrlilar ko'cha va perimetrda yaxshiroq. Xususiyatlar korpusdan muhim." },
          { q: "Uchta oddiy kamera o'rniga bitta burma PTZ qo'ysa bo'ladimi?", a: "PTZ har lahzada bir tomonga qaraydi: u darvozaga burilganda hovli yozilmaydi. PTZ statsionar kameralarga jonli kuzatuv uchun qo'shimcha sifatida yaxshi, ular o'rniga emas." },
        ],
      },
      en: {
        title: "How to Choose a CCTV Camera: Resolution, Lens, Night Vision",
        excerpt: "A practical guide to camera specs: how many megapixels you really need, how to pick the focal length, what matters for night and outdoor use — without the marketing fluff.",
        sections: [
          { h: "Resolution: how many megapixels you need", p: [
            "Megapixels are the first thing cameras are sold on and the first thing people overpay for. For general observation of a room or a yard, 2 MP (Full HD) is enough: you see what happens, who came in and where they went. To reliably recognise faces at an entrance or read price tags at a till, take 4 MP. 8 MP (4K) earns its price on wide views you need to crop details from: a parking lot, a perimeter, a whole sales floor.",
            "Remember: more resolution means more archive and network load. An 8 MP camera fills a disk four times faster than a 2 MP one, and a weak recorder simply cannot record four of them. Resolution follows the zone's task, not \"more, just in case\".",
          ] },
          { h: "Lens and field of view", p: [
            "Focal length defines what the camera sees. The standard 2.8 mm gives a wide angle of about 100° — the choice for rooms, entrances and small yards: everything is visible, but faces are distinguishable only up close. A 4 mm lens narrows the angle and \"zooms in\" — it covers corridors and approaches. 6–12 mm looks far and narrow: a driveway, a till from a distance, a plate at the gate.",
            "A simple rule: one camera — one task. Trying to make a single camera \"see everything and read faces\" ends with it doing neither. For flexibility there are varifocal models with adjustable focal length and motorized ones you can retune remotely.",
          ] },
          { h: "Night vision and outdoor duty", p: [
            "At night a camera works with IR illumination: the datasheet states 20, 30, 50 or 80 meters, and that is the honest limit of distinguishability, not \"something visible\". A yard needs 30 meters; a warehouse perimeter takes 50–80. ColorVu (Hikvision) and its analogues deliver a color night picture — the color of clothes and cars at night often matters more than extra megapixels.",
            "For outdoor use check the protection class: IP66/IP67 against dust and rain, operating temperature down to −40° for our winters, an IK10 vandal-proof body wherever the camera is within reach. An outdoor camera without lens heating fogs up from inside in frost — the most common place to cut corners, and the wrong one.",
          ] },
          { h: "IP or analog, and what else to check", p: [
            "An IP camera sends a digital picture over the network and takes power over the same cable (PoE), and supports analytics — person and vehicle detection, line crossing. Analog HDCVI/TVI is cheaper and runs over coax — a sensible choice when upgrading an old system. In new projects we almost always install IP: the price difference pays for itself in capability.",
            "Small things that turn out to matter: a microphone if you need audio; a microSD slot for local recording when the network drops; on-board analytics (Hikvision AcuSense, Dahua SMD) that tells a person from a dog or a branch — without it, notifications from an outdoor camera become spam. We match cameras to the site's tasks and quote the kit for free — from Tashkent stock, under warranty.",
          ] },
        ],
        faq: [
          { q: "What camera do I need to recognise faces at the entrance?", a: "A 4 MP with a lens that puts enough pixels on a face at the entrance distance: usually 4 mm at 3–5 meters. Mounted at face level, not under the ceiling looking down." },
          { q: "What is ColorVu and is it worth the premium?", a: "Color night vision on a high-sensitivity sensor with soft illumination. For yards, parking lots and tills — yes: the color of a car or clothing at night gives more than a couple of extra megapixels." },
          { q: "Dome or bullet — which is better?", a: "It is not the shape but the place: domes are neater indoors and more vandal-resistant, bullets with long-range IR do better outdoors and on perimeters. Specs matter more than the body." },
          { q: "Can one PTZ replace three fixed cameras?", a: "A PTZ looks one way at a time: while it is turned to the gate, the yard is not being recorded. PTZ works well as an addition to fixed cameras for live monitoring, not instead of them." },
        ],
      },
      tr: {
        title: "Güvenlik Kamerası Nasıl Seçilir: Çözünürlük, Lens, Gece Görüşü",
        excerpt: "Kamera özelliklerinin pratik rehberi: gerçekte kaç megapiksel gerekir, odak uzaklığı nasıl seçilir, gece ve dış mekân için ne önemlidir — pazarlama cilası olmadan.",
        sections: [
          { h: "Çözünürlük: kaç megapiksel gerekir", p: [
            "Megapiksel, kameranın satışında öne çıkarılan ve en çok fazla ödenen şeydir. Oda veya avlunun genel gözetimi için 2 MP (Full HD) yeter: ne olduğu, kimin girip nereye gittiği görülür. Girişte yüzleri güvenle tanımak veya kasada etiket okumak için 4 MP alınır. 8 MP (4K), detay kesilecek geniş planlarda hak eder: otopark, çevre hattı, satış katının tamamı.",
            "Unutmayın: çözünürlük arttıkça arşiv ve ağ yükü büyür. 8 MP kamera diski 2 MP'den dört kat hızlı doldurur; zayıf kayıt cihazı dört böyle kamerayı kaydedemez. Çözünürlük «fazlası yedek olsun» değil, bölgenin görevine göre seçilir.",
          ] },
          { h: "Lens ve görüş açısı", p: [
            "Odak uzaklığı kameranın ne göreceğini belirler. Standart 2,8 mm yaklaşık 100° geniş açı verir — odalar, girişler ve küçük avlular için: her şey görünür ama yüzler yalnız yakından seçilir. 4 mm açıyı daraltır ve görüntüyü «yaklaştırır» — koridorlar ve yaklaşma yolları onunla kapatılır. 6–12 mm uzağa ve dar bakar: araç girişi, uzaktan kasa, kapıdaki plaka.",
            "Basit kural: bir kamera — bir görev. Tek kamerayla «her şeyi görüp yüz okumaya» çalışmak, ikisini de yapamamasıyla biter. Esneklik için ayarlanabilir odaklı varifokal ve uzaktan ayarlanan motorlu modeller vardır.",
          ] },
          { h: "Gece görüşü ve dış mekân", p: [
            "Gece kamera IR aydınlatmayla çalışır: katalogda 20, 30, 50 veya 80 metre yazar — bu «bir şeyler görünür» değil, dürüst seçilebilirlik sınırıdır. Avluya 30 metre yeter; depo çevresine 50–80 alınır. ColorVu (Hikvision) ve benzerleri renkli gece görüntüsü verir — gece kıyafet ve araba rengi çoğu kez fazladan megapikselden önemlidir.",
            "Dış mekân için koruma sınıfına bakın: toza ve sağanağa IP66/IP67, kışımız için −40°'ye çalışma sıcaklığı, kameraya el uzanan yerde IK10 vandal korumalı gövde. Lens ısıtıcısı olmayan dış kamera ayazda içeriden buğulanır — en çok burada kısılır ve boşuna.",
          ] },
          { h: "IP mi analog mu, başka neye bakılır", p: [
            "IP kamera dijital görüntüyü ağdan iletir, gücü aynı kablodan alır (PoE) ve analitik destekler — insan/araç algılama, çizgi geçişi. Analog HDCVI/TVI daha ucuzdur ve koaksiyelde çalışır — eski sistemi yenilerken mantıklı seçim. Yeni projelerde neredeyse hep IP koyarız: fiyat farkı yetenekle geri döner.",
            "Önemli çıkan «ayrıntılar»: ses gerekiyorsa mikrofon; ağ koptuğunda yerel kayıt için microSD yuvası; insanı köpekten ve daldan ayıran yerleşik analitik (Hikvision AcuSense, Dahua SMD) — onsuz dış kameranın bildirimleri spama döner. Kameraları tesisin görevlerine göre seçer, seti ücretsiz fiyatlandırırız — Taşkent stoğundan, garantiyle.",
          ] },
        ],
        faq: [
          { q: "Girişte yüz tanımak için hangi kamera gerekir?", a: "Giriş mesafesinde yüze yeterli piksel düşüren lensli 4 MP: genelde 3–5 metrede 4 mm. Tavan altından «yukarıdan aşağı» değil, yüz hizasında monte edilir." },
          { q: "ColorVu nedir, fazladan ödemeye değer mi?", a: "Yüksek hassasiyetli sensörde yumuşak aydınlatmalı renkli gece görüşü. Avlu, otopark ve kasalar için — evet: gece araç ve kıyafet rengi birkaç fazla megapikselden çok şey verir." },
          { q: "Dome mu bullet mı — hangisi iyi?", a: "Mesele şekil değil yerdir: dome içeride daha derli toplu ve vandala dayanıklı, uzun IR'li bullet dışarıda ve çevre hattında iyidir. Özellikler gövdeden önemlidir." },
          { q: "Üç sabit kamera yerine bir PTZ konabilir mi?", a: "PTZ her an tek yöne bakar: kapıya dönükken avlu kaydedilmez. PTZ, canlı izleme için sabit kameralara ek olarak iyidir; onların yerine değil." },
        ],
      },
      zh: {
        title: "如何选监控摄像机：分辨率、镜头、夜视",
        excerpt: "摄像机参数的实用指南：到底需要几百万像素、焦距怎么选、夜视和室外使用看什么——不讲营销话术。",
        sections: [
          { h: "分辨率：到底需要多少像素", p: [
            "像素是卖摄像机时最先吹的参数，也是最容易多花钱的地方。看看房间或院子里发生了什么，2MP（全高清）足够：谁进来了、去了哪里都看得清。要在入口可靠认出人脸或看清收银台的价签，选4MP。8MP（4K）在需要从大画面里抠细节的场景才值：停车场、周界、整个卖场。",
            "记住：分辨率越高，存储和网络负载越大。8MP摄像机占用的硬盘是2MP的四倍，性能弱的录像机根本录不动四台。分辨率跟着区域任务走，而不是「大点儿备用」。",
          ] },
          { h: "镜头与视场角", p: [
            "焦距决定摄像机看到什么。标准2.8mm给出约100°的广角——适合房间、入口和小院：什么都看得见，但人脸只有凑近才认得出。4mm收窄视角、把画面「拉近」——用来盖走廊和通道。6–12mm看得远而窄：车道入口、远处的收银台、大门口的车牌。",
            "有条简单规则：一台摄像机只干一件事。想让一台机器「既看全景又认人脸」，结局是两样都做不好。需要灵活性时有可调焦距的变焦型号，以及能远程调整的电动变焦款。",
          ] },
          { h: "夜视与室外", p: [
            "夜间摄像机靠红外补光工作：规格书标20、30、50或80米——那是能分辨清楚的诚实极限，不是「隐约可见」。院子30米够用，仓库周界选50–80米。ColorVu（海康威视）及同类技术提供彩色夜视——夜里衣服和车的颜色往往比多几百万像素更有用。",
            "室外要看防护等级：IP66/IP67防尘防暴雨，工作温度低至−40°应对我们的冬天，够得着的位置选IK10防暴力外壳。没有镜头加热的室外机在严寒中会从里面起雾——这是最常被省掉的配置，省错了地方。",
          ] },
          { h: "IP还是模拟，还要注意什么", p: [
            "IP摄像机通过网络传输数字画面并由同一根线供电（PoE），支持智能分析——人车检测、越线报警。模拟HDCVI/TVI更便宜、走同轴线——老系统改造时是理性选择。新项目我们几乎都装IP：差价被能力补回来。",
            "那些后来才发现重要的「小事」：需要声音就选带麦克风的；配microSD卡槽，断网时本地续录；机内分析（海康威视AcuSense、大华SMD）能把人和狗、树枝区分开——没有它，室外机的推送就成了垃圾信息。我们按现场任务选型并免费核算整套——塔什干现货，带质保。",
          ] },
        ],
        faq: [
          { q: "入口认人脸需要什么样的摄像机？", a: "4MP并配上在入口距离能给人脸足够像素的镜头：通常3–5米配4mm。装在接近人脸的高度，而不是吊顶下俯拍。" },
          { q: "ColorVu是什么，值得加钱吗？", a: "基于高感光传感器加柔和补光的彩色夜视。院子、停车场和收银台——值得：夜里车和衣服的颜色比多几百万像素有用。" },
          { q: "半球机和枪机哪个好？", a: "关键不在外形在位置：半球机在室内更整洁、更防破坏；带远距离红外的枪机在室外和周界表现更好。参数比外壳重要。" },
          { q: "能用一台球机（PTZ）代替三台固定摄像机吗？", a: "球机每一刻只看一个方向：它转向大门时，院子就没在录。球机适合作为固定摄像机之外的人工追踪补充，不能取而代之。" },
        ],
      },
    },
  },
  {
    slug: "chto-takoe-skud",
    date: "2026-07-17",
    related: ["access", "turnstile", "attendance"],
    hubs: ["turnikety-i-shlagbaumy"],
    loc: {
      ru: {
        title: "Что такое СКУД: как работает система контроля доступа",
        excerpt: "Объясняем простыми словами, из чего состоит система контроля и управления доступом, какие бывают способы идентификации, что она умеет в связке с учётом времени и видео — и с чего начать внедрение.",
        sections: [
          { h: "Как это работает", p: [
            "СКУД — система контроля и управления доступом — решает, кого и куда пускать. Сотрудник прикладывает карту, палец или показывает лицо; контроллер сверяет идентификатор с базой и открывает замок или турникет. Каждое событие — проход, отказ, дверь, оставленная открытой, — записывается в журнал с точным временем.",
            "Главная ценность не в «двери с картой», а в управляемости: доступ настраивается по зонам и расписанию. Бухгалтерия открыта своим с 8 до 20, склад — только кладовщикам, серверная — двум админам. Уволился сотрудник — его пропуск блокируется одной кнопкой, и не нужно менять замки, как в мире механических ключей.",
          ] },
          { h: "Из чего состоит система", p: [
            "Минимальный состав на одну дверь: контроллер (мозг системы), считыватель у двери, электромагнитный или электромеханический замок, кнопка выхода, доводчик и блок питания с резервным аккумулятором — чтобы дверь работала и при отключении света. На проходной вместо замка встаёт турникет, на въезде — шлагбаум.",
            "Дальше система растёт без замены ядра: сетевые контроллеры объединяют десятки дверей в одну базу с общим журналом, ПО раздаёт права по группам, а гостям выписываются временные пропуска. Для дома или маленького офиса бывает достаточно автономного комплекта без компьютера вовсе.",
          ] },
          { h: "Карта, палец или лицо", p: [
            "Карты и брелоки — самый дешёвый и привычный способ, но карту можно забыть, потерять или передать коллеге, чтобы тот «отметился». Отпечаток пальца передать нельзя, зато он плохо читается на производстве с грязными или сухими руками. Распознавание лица снимает оба ограничения: терминал пропускает за доли секунды, ничего не нужно прикладывать, а фотографией современный терминал не обмануть — он проверяет объём лица.",
            "На практике способы комбинируют: сотрудники ходят по лицу или карте, в серверную — карта плюс PIN, гости получают QR-код на один визит. Оборудование ZKTeco и Hikvision позволяет собрать любой сценарий в одной системе.",
          ] },
          { h: "Связки, которые окупают систему", p: [
            "СКУД редко живёт одна. В связке с учётом рабочего времени тот же терминал считает часы и опоздания, а табель уходит в 1С без кадровика. С видеонаблюдением каждый проход привязывается к записи — спор «кто заходил» решается за минуту. С пожарной сигнализацией связка обязательна: при тревоге двери на путях эвакуации разблокируются автоматически.",
            "Начать проще, чем кажется: одна дверь с контроллером и считывателем ставится за день. Мы бесплатно выезжаем на объект, считаем точки прохода и предлагаем состав под бюджет — от одной двери офиса до проходной завода с турникетами. Оборудование со склада в Ташкенте, гарантия и обслуживание по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Чем СКУД отличается от домофона?", a: "Домофон решает задачу «поговорить и открыть гостю». СКУД управляет доступом постоянных людей: права по зонам и времени, журнал проходов, интеграция с учётом времени. На практике они объединяются в одну систему." },
          { q: "Что будет с дверями при отключении электричества?", a: "Электромагнитные замки открываются (поэтому их ставят на пути эвакуации), электромеханические остаются закрытыми и открываются ключом. Блок питания с аккумулятором держит систему часами — это обязательная часть комплекта." },
          { q: "Можно ли поставить СКУД на одну дверь, а потом расширять?", a: "Да, это типовой путь: автономный или сетевой контроллер на одну дверь, затем добавление точек в ту же систему. Важно сразу выбрать расширяемую платформу — мы это учитываем в подборе." },
          { q: "Сколько стоит СКУД на офис?", a: "Дверь с картами — базовый бюджет: контроллер, считыватель, замок, кнопка, питание. Face ID-терминал дороже, но убирает карты и даёт учёт времени. Точный расчёт — после бесплатного выезда инженера." },
        ],
      },
      uz: {
        title: "SKUD nima: kirishni nazorat qilish tizimi qanday ishlaydi",
        excerpt: "Oddiy so'zlar bilan tushuntiramiz: kirishni nazorat qilish tizimi nimalardan iborat, qanday identifikatsiya usullari bor, vaqt hisobi va video bilan bog'lanishda nimalarga qodir — va joriy etishni nimadan boshlash kerak.",
        sections: [
          { h: "Bu qanday ishlaydi", p: [
            "SKUD — kirishni nazorat qilish va boshqarish tizimi — kimni qayerga qo'yishni hal qiladi. Xodim karta yoki barmog'ini qo'yadi yoki yuzini ko'rsatadi; kontroller identifikatorni baza bilan solishtirib, qulf yoki turniketni ochadi. Har hodisa — o'tish, rad, ochiq qoldirilgan eshik — aniq vaqt bilan jurnalga yoziladi.",
            "Asosiy qiymat «kartali eshik»da emas, boshqariluvchanlikda: kirish zonalar va jadval bo'yicha sozlanadi. Buxgalteriya o'zinikilarga 8 dan 20 gacha ochiq, ombor — faqat omborchilarga, serverxona — ikki adminga. Xodim ketdi — ruxsatnomasi bir tugma bilan bloklanadi, mexanik kalitlar dunyosidagidek qulflarni almashtirish shart emas.",
          ] },
          { h: "Tizim nimalardan iborat", p: [
            "Bitta eshikka minimal tarkib: kontroller (tizim miyasi), eshik yonidagi o'qigich, elektromagnit yoki elektromexanik qulf, chiqish tugmasi, dovodchik va zaxira akkumulyatorli quvvat bloki — eshik svet o'chganda ham ishlashi uchun. Prohodnayada qulf o'rniga turniket, kirishda shlagbaum turadi.",
            "Keyin tizim yadroni almashtirmasdan o'sadi: tarmoq kontrollerlari o'nlab eshiklarni umumiy jurnalli bitta bazaga birlashtiradi, dastur huquqlarni guruhlar bo'yicha beradi, mehmonlarga vaqtinchalik ruxsatnomalar yoziladi. Uy yoki kichik ofisga umuman kompyutersiz avtonom to'plam yetarli bo'lishi mumkin.",
          ] },
          { h: "Karta, barmoq yoki yuz", p: [
            "Karta va breloklar — eng arzon va odatiy usul, lekin kartani unutish, yo'qotish yoki «belgilanib qo'yish» uchun hamkasbga berish mumkin. Barmoq izini berib bo'lmaydi, ammo qo'li kir yoki quruq ishlab chiqarishda yomon o'qiladi. Yuzni tanish ikkala cheklovni olib tashlaydi: terminal soniya ulushida o'tkazadi, hech narsa qo'yish kerak emas, zamonaviy terminalni fotosurat bilan aldab bo'lmaydi — u yuz hajmini tekshiradi.",
            "Amalda usullar birlashtiriladi: xodimlar yuz yoki karta bilan yuradi, serverxonaga — karta plyus PIN, mehmonlar bir tashrifga QR-kod oladi. ZKTeco va Hikvision uskunalari istalgan stsenariyni bitta tizimda yig'ish imkonini beradi.",
          ] },
          { h: "Tizimni oqlaydigan bog'lanishlar", p: [
            "SKUD kamdan-kam yolg'iz yashaydi. Ish vaqti hisobi bilan bog'lanishda o'sha terminal soat va kechikishlarni sanaydi, tabel kadrchisiz 1C ga ketadi. Videokuzatuv bilan har o'tish yozuvga bog'lanadi — «kim kirgan» bahsi bir daqiqada hal bo'ladi. Yong'in signalizatsiyasi bilan bog'lanish majburiy: trevogada evakuatsiya yo'llaridagi eshiklar avtomatik ochiladi.",
            "Boshlash o'ylagandan oson: kontroller va o'qigichli bitta eshik bir kunda o'rnatiladi. Obyektga bepul chiqamiz, o'tish nuqtalarini hisoblaymiz va byudjetga mos tarkibni taklif qilamiz — ofisning bitta eshigidan turniketli zavod prohodnayasigacha. Uskuna Toshkentdagi ombordan, kafolat va xizmat butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "SKUD domofondan nimasi bilan farq qiladi?", a: "Domofon «gaplashish va mehmonga ochish» vazifasini hal qiladi. SKUD doimiy odamlar kirishini boshqaradi: zona va vaqt bo'yicha huquqlar, o'tishlar jurnali, vaqt hisobi bilan integratsiya. Amalda ular bitta tizimga birlashadi." },
          { q: "Svet o'chganda eshiklar nima bo'ladi?", a: "Elektromagnit qulflar ochiladi (shuning uchun ular evakuatsiya yo'llariga qo'yiladi), elektromexaniklar yopiq qoladi va kalit bilan ochiladi. Akkumulyatorli quvvat bloki tizimni soatlab ushlaydi — bu to'plamning majburiy qismi." },
          { q: "SKUDni bitta eshikka qo'yib, keyin kengaytirsa bo'ladimi?", a: "Ha, bu tipik yo'l: bitta eshikka avtonom yoki tarmoq kontrolleri, keyin o'sha tizimga nuqtalar qo'shish. Boshidanoq kengayadigan platformani tanlash muhim — buni tanlovda hisobga olamiz." },
          { q: "Ofisga SKUD qancha turadi?", a: "Kartali eshik — bazaviy byudjet: kontroller, o'qigich, qulf, tugma, quvvat. Face ID terminal qimmatroq, lekin kartalarni olib tashlaydi va vaqt hisobini beradi. Aniq hisob — muhandisning bepul chiqishidan keyin." },
        ],
      },
      en: {
        title: "What Is an Access Control System and How It Works",
        excerpt: "In plain words: what an access control system consists of, which identification methods exist, what it can do together with time attendance and CCTV — and how to start.",
        sections: [
          { h: "How it works", p: [
            "An access control system decides who gets in and where. An employee presents a card, a finger or a face; the controller checks the identifier against the database and opens the lock or the turnstile. Every event — a pass, a denial, a door left open — is logged with an exact timestamp.",
            "The real value is not \"a door with a card\" but manageability: access is configured by zone and schedule. Accounting is open to its staff from 8 to 20, the warehouse only to storekeepers, the server room to two admins. When someone leaves the company, their pass is blocked with one click — no changing locks as in the world of mechanical keys.",
          ] },
          { h: "What the system consists of", p: [
            "The minimum for one door: a controller (the brain), a reader by the door, an electromagnetic or electromechanical lock, an exit button, a closer and a power supply with a backup battery — so the door works during outages. At a staffed entrance a turnstile replaces the lock; at a vehicle gate, a barrier.",
            "From there the system grows without replacing the core: networked controllers join dozens of doors into one database with a common log, software assigns rights by group, and guests get temporary passes. A home or a small office can even run on an autonomous kit with no computer at all.",
          ] },
          { h: "Card, finger or face", p: [
            "Cards and fobs are the cheapest and most familiar, but a card can be forgotten, lost or handed to a colleague to \"clock in\". A fingerprint cannot be lent, but reads poorly in production with dirty or dry hands. Facial recognition removes both limits: the terminal passes a person in a fraction of a second, nothing needs presenting, and a photo cannot fool a modern terminal — it checks the face in 3D.",
            "In practice the methods are combined: staff pass by face or card, the server room takes card plus PIN, guests get a QR code for one visit. ZKTeco and Hikvision equipment lets any scenario run in a single system.",
          ] },
          { h: "The integrations that pay for the system", p: [
            "Access control rarely lives alone. Linked with time attendance, the same terminal counts hours and lateness, and the timesheet goes to the ERP without HR. Linked with CCTV, every pass ties to footage — the \"who entered\" dispute takes a minute. The link with the fire alarm is mandatory: on alarm, doors on evacuation routes unlock automatically.",
            "Starting is easier than it seems: one door with a controller and a reader takes a day. We survey the site for free, count the access points and propose a configuration for the budget — from a single office door to a factory entrance with turnstiles. Equipment from Tashkent stock, warranty and service across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "How is access control different from an intercom?", a: "An intercom answers \"talk to a guest and open the door\". Access control manages regular people: rights by zone and time, a pass log, attendance integration. In practice both merge into one system." },
          { q: "What happens to the doors during a power outage?", a: "Electromagnetic locks open (which is why they go on evacuation routes); electromechanical locks stay shut and open with a key. A battery-backed power supply keeps the system running for hours — a mandatory part of the kit." },
          { q: "Can I start with one door and expand later?", a: "Yes, that is the typical path: an autonomous or networked controller for one door, then more points in the same system. The key is choosing an expandable platform from the start — we factor that into the selection." },
          { q: "How much does office access control cost?", a: "A card door is the base budget: controller, reader, lock, button, power. A Face ID terminal costs more but removes cards and adds time tracking. An exact quote follows a free site survey." },
        ],
      },
      tr: {
        title: "Geçiş Kontrol Sistemi (PDKS) Nedir ve Nasıl Çalışır",
        excerpt: "Sade bir dille: geçiş kontrol sistemi nelerden oluşur, hangi kimlik doğrulama yöntemleri vardır, mesai takibi ve kameralarla birlikte neler yapar — ve nereden başlanır.",
        sections: [
          { h: "Nasıl çalışır", p: [
            "Geçiş kontrol sistemi kimin nereye gireceğine karar verir. Çalışan kart, parmak veya yüz gösterir; kontrolör kimliği veritabanıyla karşılaştırır ve kilidi veya turnikeyi açar. Her olay — geçiş, ret, açık bırakılan kapı — tam zaman damgasıyla kayda geçer.",
            "Asıl değer «kartlı kapı» değil, yönetilebilirliktir: erişim bölge ve programa göre ayarlanır. Muhasebe kendi ekibine 8–20 arası açık, depo yalnız depoculara, sistem odası iki yöneticiye. Biri işten ayrılınca kartı tek tıkla bloke edilir — mekanik anahtar dünyasındaki gibi kilit değiştirmek gerekmez.",
          ] },
          { h: "Sistem nelerden oluşur", p: [
            "Tek kapı için asgari set: kontrolör (beyin), kapı yanında okuyucu, elektromanyetik veya elektromekanik kilit, çıkış butonu, kapı kapatıcı ve yedek akülü güç kaynağı — kapı elektrik kesintisinde de çalışsın. Personel girişinde kilidin yerini turnike, araç girişinde bariyer alır.",
            "Sistem çekirdeği değiştirmeden büyür: ağ kontrolörleri onlarca kapıyı ortak kayıtlı tek veritabanında birleştirir, yazılım yetkileri gruplara dağıtır, misafirlere süreli kart verilir. Ev veya küçük ofis, bilgisayarsız bağımsız setle bile idare edebilir.",
          ] },
          { h: "Kart, parmak veya yüz", p: [
            "Kart ve anahtarlık en ucuz ve alışıldık yöntemdir; ama kart unutulur, kaybolur veya «giriş bassın» diye meslektaşa verilir. Parmak izi devredilemez ama elleri kirli veya kuru üretimde zayıf okur. Yüz tanıma iki sınırı da kaldırır: terminal saniyenin kesrinde geçirir, bir şey göstermek gerekmez, modern terminal fotoğrafla kandırılmaz — yüzü üç boyutlu doğrular.",
            "Uygulamada yöntemler birleştirilir: personel yüz veya kartla geçer, sistem odasına kart artı PIN, misafire tek ziyaretlik QR verilir. ZKTeco ve Hikvision ekipmanı her senaryoyu tek sistemde çalıştırır.",
          ] },
          { h: "Sistemi amorti eden entegrasyonlar", p: [
            "Geçiş kontrolü nadiren yalnız yaşar. Mesai takibiyle aynı terminal saatleri ve gecikmeleri sayar, puantaj İK olmadan ERP'ye gider. Kameralarla her geçiş görüntüye bağlanır — «kim girdi» tartışması bir dakika sürer. Yangın alarmıyla bağlantı zorunludur: alarmda kaçış yollarındaki kapılar otomatik açılır.",
            "Başlamak sanıldığından kolaydır: kontrolör ve okuyuculu tek kapı bir günde kurulur. Tesisi ücretsiz keşfeder, geçiş noktalarını sayar ve bütçeye göre yapı öneririz — tek ofis kapısından turnikeli fabrika girişine kadar. Ekipman Taşkent stoğundan; garanti ve servis tüm Özbekistan'da.",
          ] },
        ],
        faq: [
          { q: "PDKS diafondan nasıl ayrılır?", a: "Diafon «misafirle konuş ve kapıyı aç» işini çözer. PDKS sürekli girenleri yönetir: bölge ve zamana göre yetki, geçiş kaydı, mesai entegrasyonu. Uygulamada ikisi tek sistemde birleşir." },
          { q: "Elektrik kesilince kapılara ne olur?", a: "Elektromanyetik kilitler açılır (bu yüzden kaçış yollarına konur); elektromekanikler kilitli kalır ve anahtarla açılır. Akülü güç kaynağı sistemi saatlerce taşır — setin zorunlu parçasıdır." },
          { q: "Tek kapıyla başlayıp sonra genişletebilir miyim?", a: "Evet, tipik yol budur: tek kapıya bağımsız veya ağ kontrolörü, sonra aynı sisteme yeni noktalar. Önemli olan baştan genişleyebilir platform seçmektir — seçimde bunu gözetiriz." },
          { q: "Ofis için PDKS ne kadar tutar?", a: "Kartlı kapı taban bütçedir: kontrolör, okuyucu, kilit, buton, güç. Face ID terminali daha pahalıdır ama kartları kaldırır ve mesai takibi ekler. Kesin teklif ücretsiz keşiften sonra." },
        ],
      },
      zh: {
        title: "什么是门禁系统：它如何工作",
        excerpt: "用大白话讲清楚：门禁系统由什么组成、有哪些识别方式、与考勤和视频联动能做什么——以及从哪里开始部署。",
        sections: [
          { h: "它如何工作", p: [
            "门禁系统决定谁能进、能进哪里。员工刷卡、按指纹或刷脸；控制器把凭证与数据库比对，然后开锁或放行闸机。每个事件——通行、拒绝、门未关好——都带精确时间戳记入日志。",
            "真正的价值不在「带卡的门」，而在可管理性：权限按区域和时间表配置。财务室对本部门8点到20点开放，仓库只对库管员开放，机房只对两位管理员开放。员工离职，一键注销通行证——不必像机械钥匙时代那样换锁。",
          ] },
          { h: "系统由什么组成", p: [
            "单扇门的最小配置：控制器（系统大脑）、门旁读卡器、磁力锁或电机锁、出门按钮、闭门器和带备用电池的电源——停电时门照常工作。有人值守的入口用闸机代替锁，车辆入口用道闸。",
            "之后系统无需换核心即可生长：联网控制器把几十扇门并入共享日志的同一数据库，软件按组分配权限，访客发放临时通行证。住宅或小办公室甚至可以用不接电脑的独立套件。",
          ] },
          { h: "刷卡、指纹还是人脸", p: [
            "卡和钥匙扣最便宜也最常见，但卡会忘带、会丢，还能借给同事「代打卡」。指纹借不出去，可在手部易脏或干燥的车间识别率低。人脸识别解决这两个问题：终端瞬间放行、无需出示任何东西，现代终端做立体检测、照片骗不过。",
            "实践中多种方式组合使用：员工刷脸或刷卡，机房用卡加密码，访客拿一次性二维码。中控智慧（ZKTeco）和海康威视的设备能把任意场景装进同一套系统。",
          ] },
          { h: "让系统回本的联动", p: [
            "门禁很少单干。与考勤联动后，同一台终端统计工时和迟到，考勤表不经人事直接进入管理系统。与视频联动后，每次通行绑定录像——「谁进来过」的争论一分钟解决。与火灾报警的联动是强制要求：报警时疏散通道的门自动解锁。",
            "起步比想象容易：一扇门配控制器和读卡器，一天装好。我们免费上门勘测、清点通行点，并按预算给出配置——从办公室的一扇门到带闸机的工厂门岗。设备塔什干现货，质保和维保覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "门禁和楼宇对讲有什么区别？", a: "对讲解决「跟访客说话并开门」。门禁管理常驻人员：按区域和时间授权、通行日志、考勤集成。实践中两者会合并进一套系统。" },
          { q: "停电时门会怎样？", a: "磁力锁断电即开（所以装在疏散通道上）；电机锁保持锁闭，可用钥匙打开。带电池的电源能撑数小时——是套件的必备部分。" },
          { q: "能先装一扇门以后再扩展吗？", a: "可以，这是典型路径：先给一扇门装独立或联网控制器，之后往同一系统加点位。关键是一开始就选可扩展的平台——我们在选型时会考虑。" },
          { q: "办公室装门禁要多少钱？", a: "刷卡门是基础预算：控制器、读卡器、锁、按钮、电源。人脸终端更贵，但省掉卡片还自带考勤。精确报价在工程师免费勘测之后。" },
        ],
      },
    },
  },
  {
    slug: "pozharnaya-signalizatsiya-vidy",
    date: "2026-07-17",
    related: ["fire", "pa"],
    hubs: ["pozharnaya-bezopasnost"],
    loc: {
      ru: {
        title: "Виды пожарной сигнализации: пороговая, адресная, адресно-аналоговая",
        excerpt: "Чем отличаются пороговые, адресные и адресно-аналоговые системы, какие извещатели бывают и куда их ставят, что требует закон — и какую систему выбрать для офиса, магазина и склада.",
        sections: [
          { h: "Три типа систем — в чём разница", p: [
            "Пороговая (неадресная) сигнализация — самая простая и дешёвая: извещатели собраны в шлейфы, и при срабатывании прибор показывает только номер шлейфа. «Тревога во втором шлейфе» означает поиск по всему этажу. Для маленького магазина или офиса из пары комнат этого достаточно; для объекта побольше поиск источника тревоги превращается в проблему.",
            "Адресная система знает каждый извещатель по имени: прибор показывает не шлейф, а конкретную точку — «дым, кабинет 214». Адресно-аналоговая идёт дальше: извещатель постоянно передаёт уровень задымлённости, прибор сам отличает запылённость от возгорания и сообщает о загрязнении датчика заранее. Меньше ложных тревог, выше живучесть линии — стандарт для средних и крупных объектов.",
          ] },
          { h: "Какие бывают извещатели", p: [
            "Дымовые оптические — основной тип для офисов, гостиниц и магазинов: реагируют на ранней стадии тления. Тепловые ставят там, где дым и пар в порядке вещей, — кухни, парилки, некоторые цеха: они срабатывают на температуру или скорость её роста. Извещатели пламени ловят открытый огонь за секунды и работают в высоких цехах и на складах ГСМ, где дым до потолка дойдёт слишком поздно.",
            "Ручные извещатели — красные кнопки у выходов — обязательны на путях эвакуации: человек, увидевший огонь, поднимает тревогу раньше любого датчика. Дополняют картину линейные извещатели для протяжённых пространств и аспирационные системы для ЦОД и музеев, где важно поймать самую раннюю стадию.",
          ] },
          { h: "Что требует закон", p: [
            "Автоматическая пожарная сигнализация и система оповещения (СОУЭ) в Узбекистане обязательны для офисных и торговых зданий, складов, производств, школ и гостиниц — тип системы и состав оповещения зависят от площади, этажности и назначения объекта. Проект по нормам ШНК проходит согласование, а объект сдаётся инспекции с исполнительной документацией.",
            "Сигнализация не работает в одиночку: по её сигналу запускается оповещение, разблокируются двери на путях эвакуации, останавливается вентиляция и включается дымоудаление. Эти связки — не опция, а требование норм, и закладывать их надо в проект, а не после замечаний инспектора.",
          ] },
          { h: "Как выбрать под свой объект", p: [
            "Практичное правило: до 10–15 помещений на одном этаже — пороговая система оправдана бюджетом; офисное здание, гостиница, школа — адресная; объект со сложной планировкой, запылённое производство, большой склад — адресно-аналоговая с её устойчивостью к ложным срабатываниям. Мы работаем с оборудованием Rubezh, Bolid и «Сибирский арсенал» со склада в Ташкенте.",
            "Начинается всё с бесплатного выезда: считаем помещения и категории, предлагаем тип системы и смету, проектируем по нормам, монтируем и сдаём инспекции. После сдачи берём систему на регламентное обслуживание — без журнала ТО претензии у проверки будут даже к исправной системе.",
          ] },
        ],
        faq: [
          { q: "Какая сигнализация нужна небольшому магазину?", a: "Обычно достаточно пороговой: прибор на 2–4 шлейфа, дымовые извещатели, ручник у выхода и сирена. Это самый доступный по бюджету вариант, отвечающий нормам." },
          { q: "Чем адресная система лучше пороговой?", a: "Она показывает точное место тревоги — не «шлейф 2», а конкретное помещение. Плюс контроль исправности каждого извещателя: обрыв или снятый датчик виден сразу." },
          { q: "Почему сигнализация «ложно» срабатывает и как это лечится?", a: "Частые причины — пыль в камере извещателя, пар, насекомые. Лечится регламентной чисткой и правильным подбором типа датчика; адресно-аналоговые системы предупреждают о загрязнении заранее." },
          { q: "Обязательно ли обслуживать сигнализацию после монтажа?", a: "Да, регламентные проверки с записями в журнале требуют нормы — именно журнал первым смотрит инспектор. Мы обслуживаем системы по договору с выездами по графику." },
        ],
      },
      uz: {
        title: "Yong'in signalizatsiyasi turlari: chegaraviy, manzilli, manzilli-analog",
        excerpt: "Chegaraviy, manzilli va manzilli-analog tizimlar nimasi bilan farq qiladi, qanday xabar beruvchilar bor va ular qayerga qo'yiladi, qonun nimani talab qiladi — ofis, do'kon va omborga qaysi tizimni tanlash.",
        sections: [
          { h: "Uch xil tizim — farqi nimada", p: [
            "Chegaraviy (manzilsiz) signalizatsiya — eng oddiy va arzon: xabar beruvchilar shleyflarga yig'ilgan, ishga tushganda prib faqat shleyf raqamini ko'rsatadi. «Ikkinchi shleyfda trevoga» butun qavat bo'ylab qidiruvni anglatadi. Kichik do'kon yoki bir juft xonali ofisga bu yetarli; kattaroq obyektda trevoga manbasini topish muammoga aylanadi.",
            "Manzilli tizim har xabar beruvchini nomma-nom biladi: prib shleyfni emas, aniq nuqtani ko'rsatadi — «tutun, 214-xona». Manzilli-analog undan nariga boradi: xabar beruvchi tutun darajasini doimiy uzatadi, prib changni yong'indan o'zi farqlaydi va datchik ifloslanishini oldindan aytadi. Yolg'on trevogalar kam, liniya yashovchanligi yuqori — o'rta va yirik obyektlar standarti.",
          ] },
          { h: "Xabar beruvchilar qanday bo'ladi", p: [
            "Optik tutun datchiklari — ofis, mehmonxona va do'konlarning asosiy turi: bijg'ishning erta bosqichida javob beradi. Issiqlik datchiklari tutun va bug' odatiy joylarga qo'yiladi — oshxonalar, bug'xonalar, ayrim sexlar: ular haroratga yoki uning o'sish tezligiga ishlaydi. Alanga datchiklari ochiq olovni soniyalarda ushlaydi va tutun shipga juda kech yetadigan baland sexlar va YoQM omborlarida ishlaydi.",
            "Qo'l datchiklari — chiqishlar yonidagi qizil tugmalar — evakuatsiya yo'llarida majburiy: olovni ko'rgan odam istalgan datchikdan oldin trevoga ko'taradi. Manzarani cho'zilgan makonlar uchun chiziqli datchiklar va eng erta bosqichni tutish muhim bo'lgan DPM va muzeylar uchun aspiratsion tizimlar to'ldiradi.",
          ] },
          { h: "Qonun nimani talab qiladi", p: [
            "O'zbekistonda avtomatik yong'in signalizatsiyasi va ogohlantirish tizimi (SOUE) ofis va savdo binolari, omborlar, ishlab chiqarish, maktab va mehmonxonalar uchun majburiy — tizim turi va ogohlantirish tarkibi maydon, qavatlilik va obyekt maqsadiga bog'liq. Loyiha ShNQ me'yorlari bo'yicha kelishuvdan o'tadi, obyekt ijro hujjatlari bilan inspeksiyaga topshiriladi.",
            "Signalizatsiya yolg'iz ishlamaydi: uning signali bo'yicha ogohlantirish ishga tushadi, evakuatsiya yo'llaridagi eshiklar ochiladi, ventilyatsiya to'xtaydi va tutun chiqarish yoqiladi. Bu bog'lanishlar opsiya emas, me'yor talabi — ularni inspektor e'tirozidan keyin emas, loyihaga kiritish kerak.",
          ] },
          { h: "O'z obyektingizga qanday tanlash", p: [
            "Amaliy qoida: bir qavatda 10–15 tagacha xona — chegaraviy tizim byudjet bilan oqlanadi; ofis binosi, mehmonxona, maktab — manzilli; murakkab planirovkali obyekt, changli ishlab chiqarish, katta ombor — yolg'on ishga chidamli manzilli-analog. Toshkentdagi ombordan Rubezh, Bolid va «Sibirskiy arsenal» uskunalari bilan ishlaymiz.",
            "Hammasi bepul chiqishdan boshlanadi: xona va kategoriyalarni hisoblaymiz, tizim turi va smetani taklif qilamiz, me'yorlar bo'yicha loyihalaymiz, montaj qilamiz va inspeksiyaga topshiramiz. Topshirgach tizimni reglament xizmatiga olamiz — TX jurnalisiz tekshiruv soz tizimga ham e'tiroz bildiradi.",
          ] },
        ],
        faq: [
          { q: "Kichik do'konga qanday signalizatsiya kerak?", a: "Odatda chegaraviy yetadi: 2–4 shleyfli prib, tutun datchiklari, chiqish yonida qo'l tugmasi va sirena. Bu me'yorlarga javob beradigan eng arzon variant." },
          { q: "Manzilli tizim chegaraviydan nimasi bilan yaxshi?", a: "U trevoganing aniq joyini ko'rsatadi — «2-shleyf» emas, aniq xona. Qo'shimcha har datchik sozligini nazorat qiladi: uzilish yoki olib qo'yilgan datchik darhol ko'rinadi." },
          { q: "Signalizatsiya nega «yolg'on» ishlaydi va buni qanday davolash mumkin?", a: "Tez-tez sabablari — datchik kamerasidagi chang, bug', hasharotlar. Reglament tozalash va datchik turini to'g'ri tanlash bilan davolanadi; manzilli-analog tizimlar ifloslanish haqida oldindan ogohlantiradi." },
          { q: "Montajdan keyin signalizatsiyaga xizmat ko'rsatish majburiymi?", a: "Ha, jurnalga yozuvli reglament tekshiruvlarini me'yorlar talab qiladi — inspektor birinchi bo'lib jurnalni ko'radi. Tizimlarga jadval bo'yicha chiqishli shartnoma asosida xizmat ko'rsatamiz." },
        ],
      },
      en: {
        title: "Types of Fire Alarm Systems: Conventional, Addressable, Analogue Addressable",
        excerpt: "How conventional, addressable and analogue addressable systems differ, which detectors exist and where they go, what the law requires — and which system fits an office, a shop and a warehouse.",
        sections: [
          { h: "Three system types — the difference", p: [
            "A conventional (non-addressable) alarm is the simplest and cheapest: detectors are grouped into loops, and on activation the panel shows only the loop number. \"Alarm in loop two\" means searching the whole floor. For a small shop or a two-room office that is fine; on anything bigger, locating the alarm source becomes a problem.",
            "An addressable system knows every detector by name: the panel shows not a loop but the exact point — \"smoke, room 214\". Analogue addressable goes further: the detector continuously reports the smoke level, the panel itself tells dust from fire and warns about a dirty detector in advance. Fewer false alarms, higher line survivability — the standard for medium and large sites.",
          ] },
          { h: "Detector types", p: [
            "Optical smoke detectors are the workhorse for offices, hotels and shops: they react at the early smoldering stage. Heat detectors go where smoke and steam are normal — kitchens, steam rooms, some workshops: they respond to temperature or its rate of rise. Flame detectors catch open fire within seconds and serve tall workshops and fuel warehouses, where smoke would reach the ceiling too late.",
            "Manual call points — the red boxes by the exits — are mandatory on evacuation routes: a person who sees fire raises the alarm before any sensor. Beam detectors cover long spaces, and aspirating systems serve data centers and museums where the earliest possible detection matters.",
          ] },
          { h: "What the law requires", p: [
            "In Uzbekistan an automatic fire alarm and a voice evacuation system are mandatory for office and retail buildings, warehouses, factories, schools and hotels — the system type and the evacuation setup depend on the area, the number of floors and the building's purpose. The design is approved under the national codes, and the site is handed to the inspectorate with as-built documentation.",
            "The alarm does not work alone: its signal starts the evacuation announcement, unlocks doors on escape routes, stops ventilation and starts smoke extraction. These links are not options but code requirements — they belong in the design, not in fixes after an inspector's remarks.",
          ] },
          { h: "Choosing for your site", p: [
            "A practical rule: up to 10–15 rooms on one floor — a conventional system is justified by budget; an office building, hotel or school — addressable; a complex layout, a dusty factory or a large warehouse — analogue addressable with its resistance to false alarms. We work with Rubezh, Bolid and Sibirsky Arsenal equipment from Tashkent stock.",
            "It all starts with a free survey: we count the rooms and categories, propose the system type and an estimate, design to code, install and hand over to the inspectorate. After handover we take the system onto scheduled maintenance — without a service log, inspectors will fault even a working system.",
          ] },
        ],
        faq: [
          { q: "What alarm does a small shop need?", a: "Usually a conventional one: a 2–4 loop panel, smoke detectors, a call point by the exit and a sounder. The most affordable option that meets the codes." },
          { q: "Why is addressable better than conventional?", a: "It shows the exact alarm location — a specific room, not \"loop 2\". Plus each detector's health is supervised: a break or a removed detector is visible immediately." },
          { q: "Why do alarms trigger falsely and what is the cure?", a: "Common causes are dust in the detector chamber, steam and insects. The cure is scheduled cleaning and the right detector type; analogue addressable systems warn about contamination in advance." },
          { q: "Is maintenance mandatory after installation?", a: "Yes — the codes require scheduled checks with log entries, and the log is the first thing an inspector opens. We service systems under contract with scheduled visits." },
        ],
      },
      tr: {
        title: "Yangın Alarm Sistemi Türleri: Konvansiyonel, Adresli, Analog Adresli",
        excerpt: "Konvansiyonel, adresli ve analog adresli sistemler nasıl ayrışır, hangi dedektörler vardır ve nereye konur, yasa ne ister — ofis, mağaza ve depoya hangi sistem uyar.",
        sections: [
          { h: "Üç sistem türü — fark nerede", p: [
            "Konvansiyonel (adressiz) alarm en basit ve en ucuzdur: dedektörler zonlara toplanır, tetiklenince panel yalnız zon numarasını gösterir. «İkinci zonda alarm», bütün katı aramak demektir. Küçük mağaza veya iki odalı ofise yeter; daha büyüğünde alarm kaynağını bulmak soruna dönüşür.",
            "Adresli sistem her dedektörü adıyla bilir: panel zonu değil noktayı gösterir — «duman, oda 214». Analog adresli daha ileri gider: dedektör duman düzeyini sürekli iletir, panel tozu yangından kendisi ayırır ve kirlenen dedektörü önceden haber verir. Daha az yanlış alarm, daha dayanıklı hat — orta ve büyük tesislerin standardı.",
          ] },
          { h: "Dedektör türleri", p: [
            "Optik duman dedektörleri ofis, otel ve mağazaların ana tipidir: için için yanmanın erken evresinde tepki verir. Isı dedektörleri duman ve buharın olağan olduğu yerlere konur — mutfaklar, buhar odaları, bazı atölyeler: sıcaklığa veya artış hızına çalışır. Alev dedektörleri açık ateşi saniyeler içinde yakalar; dumanın tavana çok geç ulaşacağı yüksek atölyeler ve akaryakıt depoları içindir.",
            "Buton (manuel ihbar) — çıkışlardaki kırmızı kutular — kaçış yollarında zorunludur: yangını gören insan her sensörden önce alarm verir. Uzun hacimleri ışın (beam) dedektörleri, en erken evrenin önemli olduğu veri merkezleri ve müzeleri hava örneklemeli sistemler tamamlar.",
          ] },
          { h: "Yasa ne istiyor", p: [
            "Özbekistan'da otomatik yangın alarmı ve sesli tahliye sistemi ofis ve ticaret binaları, depolar, fabrikalar, okullar ve oteller için zorunludur — sistem tipi ve tahliye düzeni alana, kat sayısına ve binanın amacına bağlıdır. Proje ulusal normlara göre onaylanır, tesis as-built dokümantasyonla denetime teslim edilir.",
            "Alarm yalnız çalışmaz: sinyaliyle anons başlar, kaçış yollarındaki kapılar açılır, havalandırma durur ve duman tahliyesi devreye girer. Bu bağlantılar seçenek değil norm gereğidir — müfettiş uyarısından sonra değil, projede yer alır.",
          ] },
          { h: "Tesisinize göre seçim", p: [
            "Pratik kural: tek katta 10–15 odaya kadar — konvansiyonel bütçeyle haklıdır; ofis binası, otel, okul — adresli; karmaşık plan, tozlu üretim, büyük depo — yanlış alarma dirençli analog adresli. Taşkent stoğundan Rubezh, Bolid ve Sibirsky Arsenal ekipmanıyla çalışırız.",
            "Her şey ücretsiz keşifle başlar: odaları ve kategorileri sayar, sistem tipi ve teklif önerir, norma göre projelendirir, kurar ve denetime teslim ederiz. Teslimden sonra sistemi periyodik bakıma alırız — bakım defteri olmadan denetim, çalışan sisteme bile kusur bulur.",
          ] },
        ],
        faq: [
          { q: "Küçük mağazaya hangi alarm gerekir?", a: "Genelde konvansiyonel yeter: 2–4 zonlu panel, duman dedektörleri, çıkışta buton ve siren. Normlara uyan en ekonomik seçenek." },
          { q: "Adresli sistem konvansiyonelden neden iyidir?", a: "Alarmın tam yerini gösterir — «zon 2» değil, belirli oda. Ayrıca her dedektörün sağlığı izlenir: kopukluk veya sökülen dedektör anında görünür." },
          { q: "Alarm neden «yanlış» çalar ve çaresi nedir?", a: "Sık nedenler dedektör haznesindeki toz, buhar ve böceklerdir. Çare periyodik temizlik ve doğru dedektör tipidir; analog adresli sistemler kirlenmeyi önceden bildirir." },
          { q: "Montajdan sonra bakım zorunlu mu?", a: "Evet — normlar deftere işlenen periyodik kontrolleri ister; müfettişin ilk açtığı şey o defterdir. Sistemlere programlı ziyaretli sözleşmeyle bakarız." },
        ],
      },
      zh: {
        title: "火灾报警系统的类型：总线制、编址式、模拟量编址式",
        excerpt: "总线制、编址式和模拟量编址式系统有何区别，探测器有哪些、装在哪里，法规要求什么——办公室、商店和仓库各该选哪种。",
        sections: [
          { h: "三种系统的区别", p: [
            "总线制（非编址）报警最简单便宜：探测器串成回路，触发时主机只显示回路号。「二号回路报警」意味着要找遍整层楼。对小商店或两间房的办公室够用；再大一点的场所，定位警源就成了难题。",
            "编址系统认识每一个探测器：主机显示的不是回路而是具体点位——「烟感，214室」。模拟量编址更进一步：探测器持续上报烟雾浓度，主机自己区分灰尘和火情，并提前提示探测器脏污。误报更少、线路存活性更高——是中大型场所的标准。",
          ] },
          { h: "探测器有哪些", p: [
            "光电感烟探测器是办公室、酒店和商店的主力：在阴燃早期就有反应。感温探测器装在烟和蒸汽属于常态的地方——厨房、蒸汽间、某些车间：它们对温度或升温速率起爆。火焰探测器几秒内捕捉明火，适合高大车间和油料仓库——那里烟升到天花板就太迟了。",
            "手动报警按钮——出口旁的红色小盒——在疏散通道上是强制项：看见火的人比任何传感器更早报警。线型光束探测器覆盖狭长空间，吸气式系统服务数据中心和博物馆——那里最早期的探测最重要。",
          ] },
          { h: "法规要求什么", p: [
            "在乌兹别克斯坦，自动火灾报警和疏散广播系统对办公、商业建筑、仓库、工厂、学校和酒店是强制性的——系统类型和广播构成取决于面积、层数和建筑用途。设计按国家规范审批，项目连同竣工文档向监管部门交付。",
            "报警系统不是单打独斗：它的信号启动疏散广播、解锁疏散通道的门、停止通风并开启排烟。这些联动不是选配而是规范要求——要写进设计方案，而不是等检查员提意见后补。",
          ] },
          { h: "怎么按场所选择", p: [
            "实用规则：单层10–15个房间以内——总线制在预算上合理；办公楼、酒店、学校——编址式；布局复杂的场所、多尘车间、大型仓库——抗误报的模拟量编址式。我们经营塔什干现货的Rubezh、Bolid和「西伯利亚兵工厂」设备。",
            "一切从免费勘测开始：清点房间和类别、给出系统类型和预算、按规范设计、施工并交付验收。交付后承接定期维保——没有维保记录，检查机构连正常工作的系统也会挑毛病。",
          ] },
        ],
        faq: [
          { q: "小商店需要什么样的报警系统？", a: "通常总线制就够：2–4回路主机、感烟探测器、出口旁的手报和警笛。这是符合规范的最经济方案。" },
          { q: "编址式比总线制好在哪？", a: "它显示报警的精确位置——不是「回路2」而是具体房间。而且每个探测器的健康状态受监控：断线或被摘下的探测器立即可见。" },
          { q: "报警为什么会误报，怎么治？", a: "常见原因是探测器暗室积灰、蒸汽和昆虫。对策是定期清洁和选对探测器类型；模拟量编址系统会提前预警脏污。" },
          { q: "装完以后必须维保吗？", a: "必须——规范要求按计划检查并记入台账，检查员第一个翻的就是台账。我们按合同定期上门维保。" },
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
        title: "Как выбрать домофон: аудио, видео или IP",
        excerpt: "Разбираем типы домофонов для квартиры, дома и офиса: чем IP отличается от аналогового, что даёт вызов на смартфон, какой комплект нужен на калитку частного дома — и что учесть при замене старой системы.",
        sections: [
          { h: "Аудио, видео или IP — три уровня", p: [
            "Аудиодомофон — минимальный уровень: слышно гостя, кнопка открывает дверь. Для подъезда со сложившимися привычками и для служебных входов этого хватает. Видеодомофон добавляет главное — вы видите, кто пришёл, прежде чем открыть: монитор в прихожей показывает картинку с вызывной панели, а многие модели пишут посетителей в память.",
            "IP-домофон — современный стандарт: вызов идёт по сети, и кроме монитора его принимает смартфон, где бы вы ни были. Курьер у калитки, а вы на работе — отвечаете с телефона и открываете дверь удалённо. IP-модели Hikvision и Dahua интегрируются с камерами и СКУД: домофон становится частью общей системы безопасности, а не отдельной коробкой.",
          ] },
          { h: "Что нужно для частного дома", p: [
            "Комплект на калитку — это не только панель и монитор. Понадобится электромеханический замок (он остаётся закрытым при отключении света — для уличной калитки это правильный выбор), блок питания, а при желании — считыватель, чтобы свои входили по карте или брелоку без звонка. Панель берите антивандальную и с ИК-подсветкой: гость приходит и в темноте.",
            "Кабель до калитки — то, о чём вспоминают поздно: трасса под панель и замок закладывается заранее, лучше на этапе забора или дорожек. Если копать уже нечего, выручают беспроводные комплекты и IP-панели по Wi-Fi, но проводное решение всегда стабильнее — особенно зимой.",
          ] },
          { h: "Квартира и подъезд: что менять и на что", p: [
            "В квартире с координатным подъездным домофоном трубку можно заменить на монитор с адаптером — увидите гостя у подъездной панели без переделки всей системы. Полный апгрейд подъезда на IP — решение для ЖК и ТСЖ: каждый житель получает вызов на монитор и смартфон, ключи-таблетки меняются на карты или приложение, а журнал событий видит управляющая компания.",
            "Для офиса логика другая: вызывная панель на входе со связью на ресепшен или пост охраны, открытие из приложения или со стационарного монитора, интеграция со СКУД — сотрудники проходят по карте, гости по звонку. Такой комплект ставится за день.",
          ] },
          { h: "На что смотреть при выборе", p: [
            "Разрешение панели: старые аналоговые дают мыльную картинку, современные IP — Full HD, на которой видно лицо, а не силуэт. Угол обзора панели 90–120° показывает не только лицо, но и пространство рядом — важно, если гость пришёл не один. Память на события, детекция движения у панели, работа замка при отключении света — вопросы, которые стоит задать до покупки, а не после.",
            "Мы подбираем и устанавливаем домофоны Hikvision, Dahua и других брендов под ключ: панель, замок, монитор, настройка смартфонов и обучение. Выезд и расчёт бесплатны, оборудование со склада в Ташкенте, гарантия и сервис по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Можно ли подключить домофон к телефону?", a: "Да, IP-домофоны переводят вызов на смартфон через приложение: видите гостя и открываете дверь из любой точки. Для аналоговых моделей есть IP-конвертеры, но нативный IP работает стабильнее." },
          { q: "Какой замок ставить на калитку — магнитный или электромеханический?", a: "На улицу — электромеханический: при отключении света он остаётся закрытым. Электромагнитный при пропадании питания открывается, поэтому его место — на путях эвакуации внутри зданий." },
          { q: "Заменит ли домофон видеонаблюдение у входа?", a: "Частично: панель видит гостя в момент звонка, а камера пишет всё происходящее постоянно. Лучшее решение — связка: домофон для связи и открытия, камера для записи. В IP-системах они работают вместе." },
          { q: "Сколько стоит установка видеодомофона в частный дом?", a: "Комплект «панель + монитор + электромеханический замок + монтаж» — от бюджетных аналоговых до IP с вызовом на смартфон. Точная цена зависит от длины трассы до калитки — считаем бесплатно после выезда." },
        ],
      },
      uz: {
        title: "Domofonni qanday tanlash: audio, video yoki IP",
        excerpt: "Kvartira, uy va ofis uchun domofon turlarini ko'rib chiqamiz: IP analogdan nimasi bilan farq qiladi, smartfonga chaqiruv nima beradi, xususiy uy kalitkasiga qanday to'plam kerak — va eski tizimni almashtirishda nimani hisobga olish.",
        sections: [
          { h: "Audio, video yoki IP — uch daraja", p: [
            "Audiodomofon — minimal daraja: mehmon eshitiladi, tugma eshikni ochadi. Odatlari shakllangan podyezd va xizmat kirishlariga shu yetadi. Videodomofon asosiysini qo'shadi — ochishdan oldin kim kelganini ko'rasiz: yo'lakdagi monitor chaqiruv paneli tasvirini ko'rsatadi, ko'p modellar tashrif buyuruvchilarni xotiraga yozadi.",
            "IP-domofon — zamonaviy standart: chaqiruv tarmoq orqali boradi va monitordan tashqari uni qayerda bo'lsangiz ham smartfon qabul qiladi. Kuryer kalitka yonida, siz ishdasiz — telefondan javob berib eshikni masofadan ochasiz. Hikvision va Dahua IP-modellari kameralar va SKUD bilan integratsiya bo'ladi: domofon alohida quti emas, umumiy xavfsizlik tizimining qismiga aylanadi.",
          ] },
          { h: "Xususiy uyga nima kerak", p: [
            "Kalitka to'plami — bu faqat panel va monitor emas. Elektromexanik qulf kerak bo'ladi (svet o'chganda u yopiq qoladi — ko'cha kalitkasi uchun to'g'ri tanlov), quvvat bloki, xohlasangiz — o'zinikilar qo'ng'iroqsiz karta yoki brelok bilan kirishi uchun o'qigich. Panelni antivandal va IK-yoritishli oling: mehmon qorong'ida ham keladi.",
            "Kalitkagacha kabel — kech eslanadigan narsa: panel va qulf trassasi oldindan, yaxshisi to'siq yoki yo'lakchalar bosqichida yotqiziladi. Kavlashga joy qolmagan bo'lsa, simsiz to'plamlar va Wi-Fi orqali IP-panellar qutqaradi, lekin simli yechim doim barqarorroq — ayniqsa qishda.",
          ] },
          { h: "Kvartira va podyezd: nimani nimaga almashtirish", p: [
            "Koordinatali podyezd domofonli kvartirada trubkani adapterli monitorga almashtirish mumkin — butun tizimni qayta qilmasdan podyezd panelidagi mehmonni ko'rasiz. Podyezdni IP ga to'liq yangilash — TJM va ShKlar yechimi: har turar joy egasi monitor va smartfonga chaqiruv oladi, tabletka-kalitlar karta yoki ilovaga almashadi, hodisalar jurnalini boshqaruvchi kompaniya ko'radi.",
            "Ofis uchun mantiq boshqa: kirishdagi chaqiruv paneli resepshen yoki qo'riq posti bilan bog'lanadi, ilova yoki statsionar monitordan ochiladi, SKUD bilan integratsiya — xodimlar karta bilan, mehmonlar qo'ng'iroq bilan o'tadi. Bunday to'plam bir kunda o'rnatiladi.",
          ] },
          { h: "Tanlashda nimaga qarash", p: [
            "Panel ruxsati: eski analoglar loyqa tasvir beradi, zamonaviy IP — yuz ko'rinadigan Full HD. Panelning 90–120° ko'rish burchagi faqat yuzni emas, yonidagi makonni ham ko'rsatadi — mehmon yolg'iz kelmagan bo'lsa muhim. Hodisalar xotirasi, panel yonidagi harakat detektsiyasi, svet o'chganda qulf ishlashi — xariddan keyin emas, oldin beriladigan savollar.",
            "Hikvision, Dahua va boshqa brendlar domofonlarini kalit topshirish sharti bilan tanlaymiz va o'rnatamiz: panel, qulf, monitor, smartfonlarni sozlash va o'rgatish. Chiqish va hisob bepul, uskuna Toshkentdagi ombordan, kafolat va servis butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "Domofonni telefonga ulash mumkinmi?", a: "Ha, IP-domofonlar chaqiruvni ilova orqali smartfonga o'tkazadi: istalgan nuqtadan mehmonni ko'rib eshikni ochasiz. Analog modellarga IP-konverterlar bor, lekin sof IP barqarorroq ishlaydi." },
          { q: "Kalitkaga qanday qulf qo'yish — magnitmi yoki elektromexanik?", a: "Ko'chaga — elektromexanik: svet o'chganda yopiq qoladi. Elektromagnit quvvat yo'qolganda ochiladi, shuning uchun uning joyi — binolar ichidagi evakuatsiya yo'llarida." },
          { q: "Domofon kirishdagi videokuzatuv o'rnini bosadimi?", a: "Qisman: panel mehmonni qo'ng'iroq paytida ko'radi, kamera esa bo'layotganning hammasini doimiy yozadi. Eng yaxshisi — bog'lam: aloqa va ochish uchun domofon, yozuv uchun kamera. IP-tizimlarda ular birga ishlaydi." },
          { q: "Xususiy uyga videodomofon o'rnatish qancha turadi?", a: "«Panel + monitor + elektromexanik qulf + montaj» to'plami — byudjet analoglardan smartfonga chaqiruvli IP gacha. Aniq narx kalitkagacha trassa uzunligiga bog'liq — chiqishdan keyin bepul hisoblaymiz." },
        ],
      },
      en: {
        title: "How to Choose an Intercom: Audio, Video or IP",
        excerpt: "Intercom types for an apartment, a house and an office: how IP differs from analog, what smartphone calling gives you, what a private house gate kit includes — and what to consider when replacing an old system.",
        sections: [
          { h: "Audio, video or IP — three levels", p: [
            "An audio intercom is the minimum: you hear the guest, a button opens the door. For an apartment entrance with settled habits and for service doors it is enough. A video intercom adds the main thing — you see who came before you open: the hallway monitor shows the door panel's picture, and many models record visitors to memory.",
            "An IP intercom is the modern standard: the call travels over the network, and besides the monitor it reaches your smartphone wherever you are. A courier at the gate while you are at work — you answer from the phone and open remotely. Hikvision and Dahua IP models integrate with cameras and access control: the intercom becomes part of the overall security system rather than a separate box.",
          ] },
          { h: "What a private house needs", p: [
            "A gate kit is more than a panel and a monitor. You need an electromechanical lock (it stays locked during power cuts — the right choice for a street gate), a power supply, and optionally a reader so family members enter by card or fob without ringing. Take a vandal-proof panel with IR illumination: guests arrive after dark too.",
            "The cable to the gate is what people remember too late: the run for the panel and the lock should be laid in advance, ideally when the fence or the paths are built. If there is nothing left to dig, wireless kits and Wi-Fi IP panels help out — but a wired solution is always more stable, especially in winter.",
          ] },
          { h: "Apartment and entrance: what to replace with what", p: [
            "In an apartment served by an old coordinate entrance intercom, the handset can be swapped for a monitor with an adapter — you will see the guest at the entrance panel without rebuilding the whole system. A full entrance upgrade to IP suits residential complexes and homeowner associations: every resident gets calls on a monitor and a smartphone, iButton keys give way to cards or an app, and the management company sees the event log.",
            "An office follows a different logic: a door panel at the entrance linked to reception or the security desk, opening from an app or a desk monitor, integration with access control — staff pass by card, guests by call. Such a kit is installed in a day.",
          ] },
          { h: "What to look at when choosing", p: [
            "Panel resolution: old analog panels give a soapy picture, modern IP delivers Full HD where you see a face, not a silhouette. A 90–120° viewing angle shows not just the face but the space beside it — important if the guest did not come alone. Event memory, motion detection at the panel, lock behavior during outages — questions to ask before buying, not after.",
            "We select and install Hikvision, Dahua and other brands turnkey: panel, lock, monitor, smartphone setup and training. The survey and calculation are free, equipment comes from Tashkent stock, with warranty and service across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "Can an intercom ring my phone?", a: "Yes — IP intercoms forward the call to a smartphone via an app: you see the guest and open the door from anywhere. Analog models can use IP converters, but native IP works more reliably." },
          { q: "Which lock for a gate — magnetic or electromechanical?", a: "Outdoors — electromechanical: it stays locked during a power cut. A magnetic lock opens when power fails, so its place is on evacuation routes inside buildings." },
          { q: "Does an intercom replace a camera at the entrance?", a: "Partially: the panel sees the guest at the moment of the call, while a camera records continuously. The best answer is both: the intercom for talking and opening, the camera for recording. In IP systems they work together." },
          { q: "How much does a video intercom for a house cost?", a: "The \"panel + monitor + electromechanical lock + installation\" kit ranges from budget analog to IP with smartphone calls. The exact price depends on the cable run to the gate — we quote for free after a visit." },
        ],
      },
      tr: {
        title: "Diafon Nasıl Seçilir: Sesli, Görüntülü veya IP",
        excerpt: "Daire, ev ve ofis için diafon türleri: IP analogdan nasıl ayrılır, telefona çağrı ne kazandırır, müstakil ev kapısına hangi set gerekir — ve eski sistemi değiştirirken nelere bakılır.",
        sections: [
          { h: "Sesli, görüntülü veya IP — üç seviye", p: [
            "Sesli diafon asgari seviyedir: misafir duyulur, düğme kapıyı açar. Alışkanlıkları oturmuş apartman girişi ve servis kapıları için yeter. Görüntülü diafon asıl olanı ekler — açmadan önce kimin geldiğini görürsünüz: antredeki monitör kapı panelinin görüntüsünü verir, çoğu model ziyaretçileri hafızaya yazar.",
            "IP diafon modern standarttır: çağrı ağ üzerinden gider ve monitörün yanı sıra nerede olursanız olun telefonunuza düşer. Kurye kapıda, siz iştesiniz — telefondan yanıtlar, kapıyı uzaktan açarsınız. Hikvision ve Dahua IP modelleri kameralar ve geçiş kontrolüyle entegre olur: diafon ayrı bir kutu değil, genel güvenlik sisteminin parçası olur.",
          ] },
          { h: "Müstakil eve ne gerekir", p: [
            "Bahçe kapısı seti panel ve monitörden ibaret değildir. Elektromekanik kilit gerekir (elektrik kesilince kilitli kalır — sokak kapısı için doğru seçim), güç kaynağı ve istenirse ev halkı zile basmadan kart veya anahtarlıkla girsin diye okuyucu. Paneli vandala dayanıklı ve IR aydınlatmalı alın: misafir karanlıkta da gelir.",
            "Kapıya giden kablo, geç hatırlanan şeydir: panel ve kilit hattı önceden, en iyisi çit veya yollar yapılırken döşenir. Kazacak yer kalmadıysa kablosuz setler ve Wi-Fi IP paneller kurtarır; ama kablolu çözüm her zaman daha kararlıdır — özellikle kışın.",
          ] },
          { h: "Daire ve apartman girişi: neyi neyle değiştirmeli", p: [
            "Eski koordinat tipli apartman diafonu olan dairede ahize, adaptörlü monitörle değiştirilebilir — tüm sistemi elden geçirmeden giriş panelindeki misafiri görürsünüz. Girişin komple IP'ye geçişi siteler ve yönetimler için çözümdür: her sakin monitöre ve telefona çağrı alır, düğme anahtarlar karta veya uygulamaya döner, olay kaydını yönetim görür.",
            "Ofiste mantık farklıdır: girişteki panel resepsiyona veya güvenlik masasına bağlanır, uygulamadan veya masaüstü monitörden açılır, geçiş kontrolüyle entegre edilir — personel kartla, misafir çağrıyla geçer. Böyle bir set bir günde kurulur.",
          ] },
          { h: "Seçerken neye bakmalı", p: [
            "Panel çözünürlüğü: eski analoglar bulanık görüntü verir; modern IP, yüzün silüet değil yüz olarak göründüğü Full HD sunar. Panelin 90–120° görüş açısı yalnız yüzü değil yanındaki alanı da gösterir — misafir yalnız gelmediyse önemlidir. Olay hafızası, panelde hareket algılama, kesintide kilidin davranışı — satın almadan önce sorulacak sorulardır.",
            "Hikvision, Dahua ve diğer markaları anahtar teslim seçip kurarız: panel, kilit, monitör, telefon kurulumu ve eğitim. Keşif ve hesap ücretsiz; ekipman Taşkent stoğundan, garanti ve servis tüm Özbekistan'da.",
          ] },
        ],
        faq: [
          { q: "Diafon telefonu arayabilir mi?", a: "Evet — IP diafonlar çağrıyı uygulama üzerinden telefona yönlendirir: misafiri görür, kapıyı her yerden açarsınız. Analoglara IP çevirici takılabilir ama yerli IP daha kararlı çalışır." },
          { q: "Bahçe kapısına hangi kilit — manyetik mi elektromekanik mi?", a: "Dış mekâna elektromekanik: elektrik kesilince kilitli kalır. Manyetik kilit güç gidince açılır; onun yeri bina içindeki kaçış yollarıdır." },
          { q: "Diafon girişteki kameranın yerini tutar mı?", a: "Kısmen: panel misafiri çağrı anında görür, kamera ise sürekli kaydeder. En iyisi ikisi birlikte: konuşup açmak için diafon, kayıt için kamera. IP sistemlerde birlikte çalışırlar." },
          { q: "Müstakil eve görüntülü diafon ne kadar tutar?", a: "«Panel + monitör + elektromekanik kilit + montaj» seti, ekonomik analogdan telefona çağrılı IP'ye kadar değişir. Kesin fiyat kapıya giden hattın uzunluğuna bağlıdır — keşiften sonra ücretsiz hesaplarız." },
        ],
      },
      zh: {
        title: "怎么选门口对讲：音频、可视还是IP",
        excerpt: "公寓、私宅和办公室的对讲类型详解：IP与模拟的区别、呼叫转手机有什么用、私宅院门套装包含什么——以及更换旧系统要注意的事。",
        sections: [
          { h: "音频、可视、IP——三个层级", p: [
            "音频对讲是最低配置：听得见访客，按键开门。对习惯已成的单元门和后勤通道足够。可视对讲补上关键一环——开门之前先看到来人：玄关的室内机显示门口机画面，多数型号还把访客存入记录。",
            "IP对讲是现代标准：呼叫走网络，除了室内机，无论您在哪里手机都能接。快递员在院门口、您在上班——用手机应答并远程开门。海康威视和大华的IP型号可与摄像机和门禁集成：对讲成为整套安防的一部分，而不是一只孤立的盒子。",
          ] },
          { h: "私宅需要什么", p: [
            "院门套装不只是门口机加室内机。还需要电机锁（停电时保持锁闭——街门的正确选择）、电源，愿意的话再加读卡器——家人刷卡或钥匙扣进门，不用按铃。门口机要选防破坏外壳带红外补光的：客人天黑也会来。",
            "通往院门的线缆是最容易想起来太晚的事：门口机和锁的线路要提前埋，最好在砌围墙或铺路时。实在没法开挖时，无线套装和Wi-Fi的IP门口机能救急——但有线方案永远更稳定，冬天尤其如此。",
          ] },
          { h: "公寓和单元门：旧换新怎么换", p: [
            "老式模拟单元对讲的住户，可以把话机换成带适配器的室内屏——不动整个系统就能看到单元门口的访客。单元门整体升级到IP适合小区和业委会：每户在室内机和手机上接听，纽扣钥匙换成卡或应用，物业还能查看事件日志。",
            "办公室的逻辑不同：入口门口机接到前台或保安台，从应用或桌面室内机开门，与门禁集成——员工刷卡、访客按铃。这样一套一天装完。",
          ] },
          { h: "选购时看什么", p: [
            "门口机分辨率：老式模拟机画面模糊，现代IP是全高清——看到的是脸，不是轮廓。90–120°的视角不仅拍到脸，还能看到旁边的空间——如果访客不是一个人来，这很重要。事件存储、门口机移动侦测、停电时锁的行为——这些问题要在买之前问，不是之后。",
            "我们一站式选配安装海康威视、大华等品牌：门口机、锁、室内机、手机配置和使用培训。勘测和报价免费，设备塔什干现货，质保和服务覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "对讲能接到手机上吗？", a: "能——IP对讲通过应用把呼叫转到手机：随时随地看到访客并开门。模拟型号可加IP转换器，但原生IP更稳定。" },
          { q: "院门装什么锁——磁力锁还是电机锁？", a: "室外用电机锁：停电时保持锁闭。磁力锁断电即开，它的位置是建筑内部的疏散通道。" },
          { q: "对讲能替代入口的监控摄像机吗？", a: "只能部分替代：门口机在按铃那一刻看到访客，摄像机则全程连续录像。最佳答案是组合：对讲负责通话开门，摄像机负责记录。IP系统里两者协同工作。" },
          { q: "私宅装可视对讲多少钱？", a: "「门口机＋室内机＋电机锁＋安装」的套装，从经济型模拟到可呼叫手机的IP不等。确切价格取决于到院门的布线长度——上门后免费核算。" },
        ],
      },
    },
  },
  {
    slug: "skolko-stoit-skud",
    date: "2026-07-17",
    related: ["access", "turnstile", "attendance"],
    hubs: ["turnikety-i-shlagbaumy"],
    loc: {
      ru: {
        title: "Сколько стоит СКУД: цена системы контроля доступа",
        excerpt: "Из чего складывается цена СКУД: считаем комплект на одну дверь, офис и проходную с турникетом. Чем отличаются бюджеты карточной и биометрической систем — и где спрятаны расходы, о которых забывают.",
        sections: [
          { h: "Считаем на примере одной двери", p: [
            "Минимальный комплект на дверь: контроллер, считыватель, электромагнитный или электромеханический замок, кнопка выхода, доводчик и блок питания с аккумулятором. По оборудованию это самый доступный уровень СКУД; монтаж двери «под ключ» занимает один день. Карты докупаются пачками по мере надобности и стоят копейки.",
            "Цена растёт от способа идентификации: кодовая клавиатура и карты — базовый бюджет, биометрический терминал с отпечатком — средний, распознавание лица — верхний. Терминал Face ID стоит заметно дороже считывателя карт, но убирает сами карты, их выдачу, потери и передачу «отметься за меня».",
          ] },
          { h: "Офис, проходная, предприятие", p: [
            "Офис на 3–5 дверей — это уже сетевая система: контроллеры объединяются в одну базу, права раздаются по группам из одного окна. Бюджет растёт не линейно: ПО и сервер общие, а каждая новая дверь добавляет только свой комплект железа. Проходная с турникетом — отдельная лига: сам турникет-трипод, считыватели с двух сторон, контроллер и врезка в учёт рабочего времени.",
            "На предприятии добавляются позиции, о которых редко думают заранее: антипассбэк, шлюзы на режимные зоны, резервированное питание, интеграция с пожарной сигнализацией для разблокировки эвакуационных дверей — она обязательна по нормам. Именно поэтому смету предприятия считают по проекту, а не «по прайсу за дверь».",
          ] },
          { h: "Скрытые расходы, о которых забывают", p: [
            "Первое — двери. СКУД ставится на дверь, и если само полотно кривое, петли просели, а коробка гуляет, электроника не поможет: замок будет закусывать, доводчик — хлопать. Иногда в смете появляется строка «привести дверь в порядок», и это честнее, чем сдать неработающую систему.",
            "Второе — администрирование. Кто будет заводить новых сотрудников и блокировать уволенных? Мы настраиваем систему так, чтобы это делал ваш администратор за минуты, и обучаем его. Третье — обслуживание: аккумуляторы в блоках питания живут 2–3 года, и их замена по регламенту дешевле, чем открытая дверь в час пик из-за севшего резерва.",
          ] },
          { h: "Как сэкономить без потери качества", p: [
            "Рабочие способы: карты вместо биометрии на второстепенных дверях, автономные контроллеры для помещений без требований к журналу, поэтапное внедрение — сначала проходная и серверная, потом кабинеты. Оборудование ZKTeco даёт лучшую цену за функциональность, Hikvision — глубокую интеграцию с видео.",
            "Не работают: экономия на блоке питания без аккумулятора (дверь встаёт при каждом мигании света), дешёвые замки на тяжёлых дверях, «пока без доводчика». Мы считаем смету после бесплатного выезда: состав под задачу и бюджет, оборудование со склада в Ташкенте, гарантия и обслуживание по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Сколько стоит СКУД на одну дверь офиса?", a: "Комплект «контроллер + считыватель + замок + кнопка + питание» с монтажом за один день — базовый бюджет системы. С картами дешевле, с Face ID дороже. Точную цену считаем бесплатно по вашей двери." },
          { q: "Что выгоднее — карты или биометрия?", a: "По железу карты дешевле. Но биометрия убирает выдачу и потери карт и исключает «отметься за меня» — на дисциплине и учёте времени она окупается за месяцы. Часто комбинируют: биометрия на входе, карты внутри." },
          { q: "Нужен ли для СКУД отдельный сервер?", a: "Малым системам — нет: хватает контроллеров и ПО на обычном рабочем компьютере. Сервер появляется на десятках дверей, при интеграции с 1С и видеонаблюдением." },
          { q: "Во сколько обходится обслуживание СКУД?", a: "Регламент — проверка замков, доводчиков, питания и БД — по договору с выездами по графику. Это дешевле разовых аварийных вызовов: большинство отказов СКУД — севшие аккумуляторы и разболтавшиеся доводчики." },
        ],
      },
      uz: {
        title: "SKUD qancha turadi: kirishni nazorat qilish tizimi narxi",
        excerpt: "SKUD narxi nimadan yig'iladi: bitta eshik, ofis va turniketli prohodnaya to'plamini hisoblaymiz. Kartali va biometrik tizimlar byudjetlari nimasi bilan farq qiladi — va unutiladigan xarajatlar qayerda yashiringan.",
        sections: [
          { h: "Bitta eshik misolida hisoblaymiz", p: [
            "Eshikka minimal to'plam: kontroller, o'qigich, elektromagnit yoki elektromexanik qulf, chiqish tugmasi, dovodchik va akkumulyatorli quvvat bloki. Uskuna bo'yicha bu SKUDning eng arzon darajasi; eshikni «kalit topshirish» montaji bir kun oladi. Kartalar kerak bo'lganda pachka-pachka olinadi va arzimagan pul turadi.",
            "Narx identifikatsiya usulidan o'sadi: kodli klaviatura va kartalar — bazaviy byudjet, barmoq izli biometrik terminal — o'rta, yuzni tanish — yuqori. Face ID terminali karta o'qigichdan sezilarli qimmat, lekin kartalarning o'zini, berilishini, yo'qolishini va «men uchun belgilab qo'y»ni olib tashlaydi.",
          ] },
          { h: "Ofis, prohodnaya, korxona", p: [
            "3–5 eshikli ofis — bu allaqachon tarmoq tizimi: kontrollerlar bitta bazaga birlashadi, huquqlar bir oynadan guruhlar bo'yicha beriladi. Byudjet chiziqli o'smaydi: dastur va server umumiy, har yangi eshik faqat o'z temir to'plamini qo'shadi. Turniketli prohodnaya — alohida liga: tripod-turniketning o'zi, ikki tomondan o'qigichlar, kontroller va ish vaqti hisobiga ulanish.",
            "Korxonada oldindan kam o'ylanadigan pozitsiyalar qo'shiladi: antipassbek, rejimli zonalarga shlyuzlar, zaxiralangan quvvat, evakuatsiya eshiklarini ochish uchun yong'in signalizatsiyasi bilan integratsiya — u me'yorlar bo'yicha majburiy. Aynan shuning uchun korxona smetasi «eshik uchun prays» bo'yicha emas, loyiha bo'yicha hisoblanadi.",
          ] },
          { h: "Unutiladigan yashirin xarajatlar", p: [
            "Birinchisi — eshiklar. SKUD eshikka qo'yiladi, agar polotno qiyshiq, oshiq-moshiqlar cho'kkan, quti yursa — elektronika yordam bermaydi: qulf tishlaydi, dovodchik taraqlaydi. Ba'zan smetada «eshikni tartibga keltirish» qatori paydo bo'ladi — bu ishlamaydigan tizimni topshirishdan halolroq.",
            "Ikkinchisi — administratorlik. Yangi xodimlarni kim kiritadi, ketganlarni kim bloklaydi? Tizimni sizning administratoringiz buni daqiqalarda qiladigan qilib sozlaymiz va uni o'rgatamiz. Uchinchisi — xizmat: quvvat bloklaridagi akkumulyatorlar 2–3 yil yashaydi, ularni reglament bo'yicha almashtirish o'tirib qolgan zaxira tufayli eng band soatda ochiq qolgan eshikdan arzon.",
          ] },
          { h: "Sifatni yo'qotmasdan qanday tejash", p: [
            "Ishlaydigan usullar: ikkinchi darajali eshiklarga biometriya o'rniga kartalar, jurnal talab qilinmaydigan xonalarga avtonom kontrollerlar, bosqichma-bosqich joriy etish — avval prohodnaya va serverxona, keyin kabinetlar. ZKTeco uskunasi funksionallik uchun eng yaxshi narxni, Hikvision video bilan chuqur integratsiyani beradi.",
            "Ishlamaydiganlari: akkumulyatorsiz quvvat blokida tejash (har svet miltillashida eshik to'xtaydi), og'ir eshiklarga arzon qulflar, «hozircha dovodchiksiz». Smetani bepul chiqishdan keyin hisoblaymiz: vazifa va byudjetga mos tarkib, uskuna Toshkentdagi ombordan, kafolat va xizmat butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "Ofisning bitta eshigiga SKUD qancha turadi?", a: "«Kontroller + o'qigich + qulf + tugma + quvvat» to'plami bir kunlik montaj bilan — tizimning bazaviy byudjeti. Kartalar bilan arzonroq, Face ID bilan qimmatroq. Aniq narxni eshigingiz bo'yicha bepul hisoblaymiz." },
          { q: "Nima foydali — kartalar yoki biometriya?", a: "Temir bo'yicha kartalar arzon. Lekin biometriya karta berish va yo'qotishlarni olib tashlaydi, «men uchun belgila»ni istisno qiladi — intizom va vaqt hisobida u oylarda o'zini oqlaydi. Ko'pincha birlashtiriladi: kirishda biometriya, ichkarida kartalar." },
          { q: "SKUD uchun alohida server kerakmi?", a: "Kichik tizimlarga — yo'q: kontrollerlar va oddiy ish kompyuteridagi dastur yetadi. Server o'nlab eshiklarda, 1C va videokuzatuv bilan integratsiyada paydo bo'ladi." },
          { q: "SKUD xizmati qanchaga tushadi?", a: "Reglament — qulflar, dovodchiklar, quvvat va bazani tekshirish — jadvalli chiqishlar bilan shartnoma bo'yicha. Bu bir martalik avariya chaqiruvlaridan arzon: SKUD nosozliklarining ko'pi — o'tirgan akkumulyatorlar va bo'shagan dovodchiklar." },
        ],
      },
      en: {
        title: "How Much Does Access Control Cost",
        excerpt: "What builds the price of an access control system: a single door, an office, and a turnstile entrance. How card and biometric budgets differ — and where the forgotten costs hide.",
        sections: [
          { h: "Starting with one door", p: [
            "The minimum kit for a door: a controller, a reader, an electromagnetic or electromechanical lock, an exit button, a closer and a battery-backed power supply. Hardware-wise this is the entry level of access control; a turnkey door install takes one day. Cards are bought in packs as needed and cost pennies.",
            "The price climbs with the identification method: a keypad and cards are the base budget, a fingerprint terminal the middle, facial recognition the top. A Face ID terminal costs noticeably more than a card reader, but it removes the cards themselves — their issuing, losses and the \"clock in for me\" trick.",
          ] },
          { h: "Office, entrance, enterprise", p: [
            "An office with 3–5 doors is already a networked system: controllers join one database, rights are assigned by group from one window. The budget does not grow linearly: the software and server are shared, and each new door adds only its own hardware kit. A turnstile entrance is a different league: the tripod turnstile itself, readers on both sides, a controller and a tie-in to time attendance.",
            "An enterprise adds items rarely thought of in advance: anti-passback, mantraps for restricted zones, redundant power, and integration with the fire alarm to unlock evacuation doors — mandatory by code. That is why an enterprise estimate is calculated from a design, not from a \"price per door\".",
          ] },
          { h: "The hidden costs people forget", p: [
            "First — the doors themselves. Access control mounts onto a door, and if the leaf is warped, the hinges sagged and the frame moves, electronics will not help: the lock will bind and the closer will slam. Sometimes the estimate gains a line called \"bring the door into order\" — more honest than handing over a system that does not work.",
            "Second — administration. Who will enroll new staff and block leavers? We configure the system so your administrator does it in minutes, and we train them. Third — maintenance: batteries in power supplies live 2–3 years, and scheduled replacement is cheaper than a door stuck open at rush hour because the backup died.",
          ] },
          { h: "How to save without losing quality", p: [
            "What works: cards instead of biometrics on secondary doors, autonomous controllers for rooms with no logging requirements, phased rollout — the entrance and the server room first, offices later. ZKTeco gives the best price for functionality; Hikvision offers deep integration with video.",
            "What does not: skipping the battery in the power supply (the door stops at every power flicker), cheap locks on heavy doors, \"no closer for now\". We quote after a free survey: a configuration for the task and budget, equipment from Tashkent stock, warranty and service across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "How much is access control for one office door?", a: "The \"controller + reader + lock + button + power\" kit with a one-day install is the system's base budget. Cards are cheaper, Face ID costs more. We quote your specific door for free." },
          { q: "Which is more economical — cards or biometrics?", a: "Cards are cheaper in hardware. But biometrics removes card issuing and losses and rules out \"clock in for me\" — on discipline and time tracking it pays back within months. A common mix: biometrics at the entrance, cards inside." },
          { q: "Does access control need a dedicated server?", a: "Small systems — no: controllers plus software on an ordinary office PC suffice. A server appears at dozens of doors and with ERP or CCTV integration." },
          { q: "What does access control maintenance cost?", a: "Scheduled checks of locks, closers, power and the database run under a contract with planned visits. Cheaper than one-off emergency calls: most access control failures are dead batteries and loosened closers." },
        ],
      },
      tr: {
        title: "Geçiş Kontrol Sistemi Ne Kadar Tutar",
        excerpt: "PDKS fiyatını ne oluşturur: tek kapı, ofis ve turnikeli giriş hesabı. Kartlı ve biyometrik bütçeler nasıl ayrışır — ve unutulan masraflar nerede saklanır.",
        sections: [
          { h: "Tek kapıyla başlayalım", p: [
            "Kapı için asgari set: kontrolör, okuyucu, elektromanyetik veya elektromekanik kilit, çıkış butonu, kapı kapatıcı ve aküyle desteklenmiş güç kaynağı. Donanım olarak bu, geçiş kontrolünün giriş seviyesidir; anahtar teslim kapı kurulumu bir gün sürer. Kartlar gerektikçe paketle alınır ve yok pahasınadır.",
            "Fiyat kimlik doğrulama yöntemiyle tırmanır: tuş takımı ve kartlar taban bütçe, parmak izi terminali orta, yüz tanıma üst seviyedir. Face ID terminali kart okuyucudan belirgin pahalıdır ama kartların kendisini — dağıtımını, kayıplarını ve «benim yerime bas» numarasını — ortadan kaldırır.",
          ] },
          { h: "Ofis, giriş, işletme", p: [
            "3–5 kapılı ofis artık ağ sistemidir: kontrolörler tek veritabanında birleşir, yetkiler tek ekrandan gruplara dağıtılır. Bütçe doğrusal büyümez: yazılım ve sunucu ortaktır, her yeni kapı yalnız kendi donanım setini ekler. Turnikeli giriş ayrı liga: tripod turnikenin kendisi, iki yönde okuyucular, kontrolör ve mesai takibine bağlantı.",
            "İşletmede önceden az düşünülen kalemler eklenir: anti-passback, kısıtlı bölgelere mantrap, yedekli güç ve kaçış kapılarını açmak için yangın alarmı entegrasyonu — normlarca zorunludur. Bu yüzden işletme teklifi «kapı başı fiyattan» değil projeden hesaplanır.",
          ] },
          { h: "Unutulan gizli masraflar", p: [
            "Birincisi — kapıların kendisi. PDKS kapıya monte edilir; kanat eğri, menteşeler çökmüş, kasa oynuyorsa elektronik çare olmaz: kilit sıkışır, kapatıcı çarpar. Bazen teklife «kapıyı düzene sok» kalemi girer — çalışmayan sistem teslim etmekten dürüsttür.",
            "İkincisi — yönetim. Yeni personeli kim tanıtacak, ayrılanları kim bloke edecek? Sistemi, yöneticiniz bunu dakikalar içinde yapacak şekilde kurar ve onu eğitiriz. Üçüncüsü — bakım: güç kaynaklarındaki aküler 2–3 yıl yaşar; planlı değişim, biten yedek yüzünden mesai saatinde açık kalan kapıdan ucuzdur.",
          ] },
          { h: "Kaliteden ödün vermeden tasarruf", p: [
            "İşe yarayanlar: ikincil kapılarda biyometri yerine kart, kayıt gereksinimi olmayan odalara bağımsız kontrolör, aşamalı kurulum — önce giriş ve sistem odası, sonra ofisler. ZKTeco işlevsellik başına en iyi fiyatı, Hikvision videoyla derin entegrasyonu verir.",
            "İşe yaramayanlar: aküsüz güç kaynağıyla tasarruf (her voltaj oynamasında kapı durur), ağır kapılara ucuz kilit, «şimdilik kapatıcısız». Teklifi ücretsiz keşiften sonra veririz: göreve ve bütçeye göre yapı, Taşkent stoğundan ekipman, tüm Özbekistan'da garanti ve servis.",
          ] },
        ],
        faq: [
          { q: "Bir ofis kapısına PDKS ne kadar?", a: "«Kontrolör + okuyucu + kilit + buton + güç» seti bir günlük montajla sistemin taban bütçesidir. Kartla daha ucuz, Face ID ile daha pahalı. Kapınıza özel teklifi ücretsiz hesaplarız." },
          { q: "Hangisi ekonomik — kart mı biyometri mi?", a: "Donanımda kart ucuzdur. Ama biyometri kart dağıtımını ve kayıplarını kaldırır, «yerime bas»ı imkânsız kılar — disiplin ve mesaide aylar içinde amorti eder. Yaygın karışım: girişte biyometri, içeride kart." },
          { q: "PDKS için ayrı sunucu gerekir mi?", a: "Küçük sistemlere hayır: kontrolörler ve sıradan ofis bilgisayarındaki yazılım yeter. Sunucu onlarca kapıda, ERP ve kamera entegrasyonunda devreye girer." },
          { q: "PDKS bakımı neye mal olur?", a: "Kilitlerin, kapatıcıların, gücün ve veritabanının planlı kontrolü, programlı ziyaretli sözleşmeyle yürür. Tek seferlik acil çağrılardan ucuzdur: arızaların çoğu biten aküler ve gevşeyen kapatıcılardır." },
        ],
      },
      zh: {
        title: "门禁系统要多少钱",
        excerpt: "门禁系统的价格由什么构成：单扇门、办公室和带闸机的门岗各怎么算。刷卡与生物识别的预算差在哪——以及常被遗忘的开销藏在何处。",
        sections: [
          { h: "从一扇门算起", p: [
            "单扇门的最小套件：控制器、读卡器、磁力锁或电机锁、出门按钮、闭门器和带电池的电源。就设备而言这是门禁的入门级；一扇门一站式安装一天完成。卡片按需成包购买，价格便宜。",
            "价格随识别方式攀升：密码键盘和刷卡是基础预算，指纹终端居中，人脸识别最高。人脸终端比读卡器贵得多，但省掉了卡片本身——发卡、丢卡，以及「替我打卡」的把戏。",
          ] },
          { h: "办公室、门岗、企业", p: [
            "3–5扇门的办公室已是联网系统：控制器并入同一数据库，权限在一个界面按组分配。预算并非线性增长：软件和服务器共用，每扇新门只增加自己那套硬件。带闸机的门岗是另一个量级：三辊闸本体、两侧读卡器、控制器，还要接入考勤。",
            "企业级会冒出很少提前想到的项目：防尾随、涉密区互锁通道、冗余供电、与火灾报警联动解锁疏散门——这是规范强制项。所以企业的预算按设计方案核算，而不是按「每扇门单价」。",
          ] },
          { h: "常被遗忘的隐藏开销", p: [
            "第一是门本身。门禁装在门上，门扇变形、合页下沉、门框晃动，电子设备无能为力：锁会卡涩、闭门器会砰砰作响。有时预算里会出现「修整门体」一行——这比交付一套不好用的系统诚实。",
            "第二是日常管理。谁来录入新员工、注销离职者？我们把系统配置到您的管理员几分钟就能搞定，并做好培训。第三是维保：电源里的电池寿命2–3年，按计划更换比高峰期因备电耗尽而敞开的大门便宜得多。",
          ] },
          { h: "怎么省钱而不失品质", p: [
            "行得通的：次要的门用卡代替生物识别，无日志要求的房间用独立控制器，分期部署——先门岗和机房，再各办公室。中控智慧（ZKTeco）性价比最好，海康威视则与视频深度集成。",
            "行不通的：电源省掉电池（每次电压波动门就罢工）、重门配便宜锁、「闭门器以后再说」。免费勘测后出预算：按任务和预算配型，设备塔什干现货，质保和维保覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "办公室一扇门的门禁多少钱？", a: "「控制器＋读卡器＋锁＋按钮＋电源」套件加一天安装，是系统的基础预算。刷卡便宜些，人脸贵些。按您的具体门型免费报价。" },
          { q: "刷卡和生物识别哪个更划算？", a: "硬件上刷卡便宜。但生物识别省去发卡和补卡，杜绝「替我打卡」——在纪律和考勤上几个月就回本。常见组合：入口用生物识别，内部用卡。" },
          { q: "门禁需要专门的服务器吗？", a: "小系统不需要：控制器加普通办公电脑上的软件就够。几十扇门、要对接ERP和视频监控时才需要服务器。" },
          { q: "门禁的维保费用如何？", a: "按合同定期检查锁具、闭门器、电源和数据库。比临时抢修便宜：门禁的大多数故障就是电池耗尽和闭门器松动。" },
        ],
      },
    },
  },
  {
    slug: "uchet-rabochego-vremeni",
    date: "2026-07-17",
    related: ["attendance", "access"],
    hubs: ["turnikety-i-shlagbaumy"],
    loc: {
      ru: {
        title: "Учёт рабочего времени: биометрия против бумажного табеля",
        excerpt: "Почему ручной табель всегда врёт, как биометрический терминал закрывает вопрос доверия, что настроить кроме «пришёл-ушёл» — и как данные попадают в зарплату без участия кадровика.",
        sections: [
          { h: "Почему бумажный табель врёт", p: [
            "Ручной табель не выдерживает встречи с реальностью: «9:00» ставится всем, кто пришёл до десяти, вечерние переработки не записывает никто, а «отметь меня, я опоздаю» — часть корпоративной культуры. В конце месяца кадровик тратит дни на сведение и споры, и проигрывают обе стороны: компания платит за неотработанные часы, добросовестные сотрудники не получают за переработки.",
            "Автоматический учёт убирает не людей, а почву для споров: время фиксируется в момент прохода терминалом, которому всё равно, кто чей друг. Табель собирается сам и в любой момент готов к проверке — трудовой инспекции или собственному аудиту.",
          ] },
          { h: "Терминал вместо журнала", p: [
            "Биометрический терминал узнаёт сотрудника по лицу или отпечатку — отметиться за коллегу невозможно физически. Распознавание лица работает на ходу и с гигиеной без вопросов; отпечаток дешевле, но капризен на производстве с грязными руками. Для офисов с невысокими требованиями остаются карты, для выездных бригад — отметка в мобильном приложении с геопривязкой.",
            "Терминал ZKTeco или Hikvision совмещает учёт со СКУД: одно устройство открывает дверь и пишет время. Отдельная «вертушка для табеля» не нужна — и это сразу минус одна позиция в смете.",
          ] },
          { h: "Правила, которые делают систему полезной", p: [
            "Ценность системы — в настройке под вашу учётную политику. Графики и смены, включая ночные и скользящие; допуск на опоздание — 5 минут или ноль, решаете вы; обед фиксированный или плавающий; командировки и отпуска. Система сама считает опоздания, ранние уходы, переработки и ночные часы — по правилам, которые вы задали один раз.",
            "Руководитель получает картину дня в реальном времени: кто на месте, кто опоздал, кого нет вообще. Не отчёт в конце месяца, а инструмент оперативного управления: видно, что смена в цехе недоукомплектована, ещё утром, а не по итогам недели.",
          ] },
          { h: "Дорога данных в зарплату", p: [
            "Учёт ради учёта бессмысленен — данные должны доехать до расчёта зарплаты. Мы настраиваем выгрузку табеля в 1С и учётные системы: отработанные часы, переработки и ночные попадают в расчёт без ручного переноса и ошибок «человеческого фактора». Отчёты — по подразделениям, объектам и проектам.",
            "Внедрение не останавливает работу: терминалы на проходной — день монтажа, заведение сотрудников — ещё день (на больших штатах импортируем список из 1С или Excel). Обучаем кадровика и администратора, дальше система живёт своими силами. Выезд и расчёт бесплатны, оборудование со склада в Ташкенте, гарантия и поддержка по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Сколько времени занимает внедрение учёта рабочего времени?", a: "Типовой офис или цех: день на монтаж терминалов, день на заведение сотрудников и настройку графиков. С понедельника система уже считает." },
          { q: "Что делать с выездными сотрудниками и стройплощадками?", a: "Мобильная отметка с геопривязкой: сотрудник отмечается с телефона, система проверяет, что он действительно на объекте. Для временных площадок есть переносные терминалы." },
          { q: "Сотрудники против биометрии — что делать?", a: "Терминалы хранят не фото, а математический шаблон, по которому нельзя восстановить изображение. Обычно достаточно объяснить это плюс показать, что честным сотрудникам система выгодна: переработки перестают теряться." },
          { q: "Можно ли связать учёт времени с уже стоящей СКУД?", a: "Чаще всего да: если контроллеры и считыватели поддерживаются, учёт настраивается поверх существующих проходов. Приезжаем, смотрим оборудование и говорим честно — что переиспользуем, что придётся заменить." },
        ],
      },
      uz: {
        title: "Ish vaqtini hisobga olish: biometriya qog'oz tabelga qarshi",
        excerpt: "Nega qo'l tabeli doim aldaydi, biometrik terminal ishonch masalasini qanday yopadi, «keldi-ketdi»dan tashqari nimani sozlash kerak — va ma'lumotlar kadrchisiz ish haqiga qanday yetib boradi.",
        sections: [
          { h: "Nega qog'oz tabel aldaydi", p: [
            "Qo'l tabeli haqiqat bilan uchrashuvga chidamaydi: «9:00» o'ngacha kelganlarning hammasiga qo'yiladi, kechki qayta ishlashlarni hech kim yozmaydi, «meni belgilab qo'y, kechikaman» esa korporativ madaniyatning qismi. Oy oxirida kadrchi kunlarni solishtirish va bahslarga sarflaydi, ikkala tomon ham yutqazadi: kompaniya ishlanmagan soatlarga to'laydi, halol xodimlar qayta ishlash uchun olmaydi.",
            "Avtomatik hisob odamlarni emas, bahs uchun zaminni olib tashlaydi: vaqt kimning kim bilan do'stligi baribir bo'lgan terminal orqali o'tish paytida qayd etiladi. Tabel o'zi yig'iladi va istalgan paytda tekshiruvga tayyor — mehnat inspeksiyasiga ham, o'z auditingizga ham.",
          ] },
          { h: "Jurnal o'rniga terminal", p: [
            "Biometrik terminal xodimni yuz yoki barmoq izidan taniydi — hamkasb o'rniga belgilanish jismonan mumkin emas. Yuzni tanish yurib ketayotganda ishlaydi va gigiyena bo'yicha savolsiz; barmoq izi arzonroq, lekin qo'li kir ishlab chiqarishda injiq. Talablari baland bo'lmagan ofislarga kartalar, sayyor brigadalarga — geolokatsiyali mobil ilovada belgilanish qoladi.",
            "ZKTeco yoki Hikvision terminali hisobni SKUD bilan birlashtiradi: bitta qurilma eshikni ochadi va vaqtni yozadi. Alohida «tabel uchun aylanma» kerak emas — bu smetada darhol bitta pozitsiya kam degani.",
          ] },
          { h: "Tizimni foydali qiladigan qoidalar", p: [
            "Tizim qiymati — sizning hisob siyosatingizga sozlashda. Grafik va smenalar, jumladan tungi va suriluvchi; kechikish ruxsati — 5 daqiqa yoki nol, siz hal qilasiz; tushlik qat'iy yoki suzuvchi; xizmat safarlari va ta'tillar. Tizim kechikish, erta ketish, qayta ishlash va tungi soatlarni o'zi sanaydi — bir marta bergan qoidalaringiz bo'yicha.",
            "Rahbar kun manzarasini real vaqtda oladi: kim joyida, kim kechikdi, kim umuman yo'q. Oy oxiridagi hisobot emas, operativ boshqaruv quroli: sexdagi smena to'liq emasligi hafta yakunida emas, ertalaboq ko'rinadi.",
          ] },
          { h: "Ma'lumotlarning ish haqiga yo'li", p: [
            "Hisob uchun hisob ma'nosiz — ma'lumotlar ish haqi hisobigacha yetib borishi kerak. Tabelni 1C va hisob tizimlariga yuklashni sozlaymiz: ishlangan soatlar, qayta ishlash va tungilar qo'l ko'chirishsiz va «inson omili» xatolarisiz hisobga tushadi. Hisobotlar — bo'lim, obyekt va loyihalar bo'yicha.",
            "Joriy etish ishni to'xtatmaydi: prohodnayadagi terminallar — bir kun montaj, xodimlarni kiritish — yana bir kun (katta shtatlarda ro'yxatni 1C yoki Excel dan import qilamiz). Kadrchi va administratorni o'rgatamiz, keyin tizim o'z kuchi bilan yashaydi. Chiqish va hisob bepul, uskuna Toshkentdagi ombordan, kafolat va qo'llab-quvvatlash butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "Ish vaqti hisobini joriy etish qancha vaqt oladi?", a: "Tipik ofis yoki sex: terminallar montajiga bir kun, xodimlarni kiritish va grafiklarni sozlashga yana bir kun. Dushanbadan tizim allaqachon sanaydi." },
          { q: "Sayyor xodimlar va qurilish maydonchalari bilan nima qilish kerak?", a: "Geolokatsiyali mobil belgilanish: xodim telefondan belgilanadi, tizim uning haqiqatan obyektda ekanini tekshiradi. Vaqtinchalik maydonchalarga ko'chma terminallar bor." },
          { q: "Xodimlar biometriyaga qarshi — nima qilish kerak?", a: "Terminallar foto emas, tasvirni tiklab bo'lmaydigan matematik shablon saqlaydi. Odatda buni tushuntirish va halol xodimlarga tizim foydali ekanini ko'rsatish yetadi: qayta ishlashlar yo'qolmay qo'yadi." },
          { q: "Vaqt hisobini turgan SKUD bilan bog'lasa bo'ladimi?", a: "Ko'pincha ha: kontroller va o'qigichlar qo'llab-quvvatlansa, hisob mavjud o'tishlar ustidan sozlanadi. Kelamiz, uskunani ko'ramiz va halol aytamiz — nimani qayta ishlatamiz, nimani almashtirish kerak." },
        ],
      },
      en: {
        title: "Time Attendance: Biometrics vs the Paper Timesheet",
        excerpt: "Why a manual timesheet always lies, how a biometric terminal closes the trust question, what to configure beyond \"in and out\" — and how the data reaches payroll without HR's manual work.",
        sections: [
          { h: "Why the paper timesheet lies", p: [
            "A manual timesheet does not survive contact with reality: \"9:00\" gets written for everyone who arrived before ten, evening overtime goes unrecorded, and \"clock me in, I'm running late\" is part of the office culture. At month end HR spends days reconciling, and both sides lose: the company pays for hours not worked, and honest employees are not paid for overtime.",
            "Automated tracking removes not people but the grounds for argument: time is captured at the moment of passage by a terminal that does not care who is whose friend. The timesheet assembles itself and is ready for any audit at any moment — a labor inspection or your own.",
          ] },
          { h: "A terminal instead of a logbook", p: [
            "A biometric terminal recognises an employee by face or fingerprint — clocking in for a colleague is physically impossible. Facial recognition works on the move with no hygiene questions; fingerprints are cheaper but fussy in production with dirty hands. Offices with lighter requirements can stay on cards; field crews check in through a mobile app with geolocation.",
            "A ZKTeco or Hikvision terminal combines attendance with access control: one device opens the door and logs the time. No separate \"timesheet turnstile\" needed — one line item fewer in the estimate.",
          ] },
          { h: "The rules that make the system useful", p: [
            "The system's value is in tuning it to your policy. Schedules and shifts, including night and rotating ones; a lateness allowance of 5 minutes or zero — your call; fixed or floating lunch; business trips and vacations. The system itself counts lateness, early departures, overtime and night hours — by rules you set once.",
            "A manager gets the day's picture in real time: who is in, who is late, who is absent. Not a month-end report but an operational tool: an understaffed shift in the workshop is visible in the morning, not in the weekly summary.",
          ] },
          { h: "The data's road to payroll", p: [
            "Tracking for its own sake is pointless — the data must reach payroll. We configure timesheet export to 1C and other ERP systems: worked hours, overtime and night shifts land in the calculation without manual transfer or human-factor errors. Reports come by department, site and project.",
            "Deployment does not stop the business: terminals at the entrance take a day to install, enrolling staff another day (for large headcounts we import the list from 1C or Excel). We train HR and the administrator, and the system then runs on its own. The survey and quote are free, equipment from Tashkent stock, warranty and support across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "How long does deployment take?", a: "A typical office or workshop: a day for terminal installation, a day for enrolling staff and configuring schedules. By Monday the system is already counting." },
          { q: "What about field staff and construction sites?", a: "Mobile check-in with geolocation: the employee checks in from a phone, and the system verifies they are actually on site. Portable terminals exist for temporary sites." },
          { q: "Employees object to biometrics — what then?", a: "Terminals store not photos but a mathematical template from which no image can be reconstructed. Explaining that, plus showing that honest staff benefit — overtime stops getting lost — usually settles it." },
          { q: "Can attendance connect to an existing access control system?", a: "Usually yes: if the controllers and readers are supported, attendance is configured on top of existing passages. We come, inspect the hardware and say honestly what can be reused and what needs replacing." },
        ],
      },
      tr: {
        title: "Mesai Takibi: Biyometri Kâğıt Puantaja Karşı",
        excerpt: "Elle tutulan puantaj neden hep yalan söyler, biyometrik terminal güven sorununu nasıl kapatır, «geldi-gitti»nin ötesinde ne ayarlanır — ve veri İK'nın el emeği olmadan bordroya nasıl ulaşır.",
        sections: [
          { h: "Kâğıt puantaj neden yalan söyler", p: [
            "Elle puantaj gerçekle karşılaşmaya dayanmaz: ondan önce gelen herkese «9:00» yazılır, akşam mesailerini kimse kaydetmez, «girişimi bas, geç kalıyorum» kurum kültürünün parçasıdır. Ay sonunda İK günlerce mutabakat yapar ve iki taraf da kaybeder: şirket çalışılmayan saate öder, dürüst çalışan fazla mesaisini alamaz.",
            "Otomatik takip insanları değil tartışma zeminini kaldırır: süre, kimin kimin arkadaşı olduğu umurunda olmayan terminalce geçiş anında kaydedilir. Puantaj kendiliğinden oluşur ve her an denetime hazırdır — iş müfettişine de kendi denetiminize de.",
          ] },
          { h: "Defter yerine terminal", p: [
            "Biyometrik terminal çalışanı yüzden veya parmak izinden tanır — arkadaşın yerine giriş basmak fiziken imkânsızdır. Yüz tanıma yürürken çalışır, hijyen sorusu yoktur; parmak izi ucuzdur ama kirli elli üretimde nazlıdır. Beklentisi hafif ofisler kartla kalabilir; saha ekipleri konum doğrulamalı mobil uygulamayla giriş yapar.",
            "ZKTeco veya Hikvision terminali mesaiyi geçiş kontrolüyle birleştirir: tek cihaz kapıyı açar ve süreyi yazar. Ayrı «puantaj turnikesi» gerekmez — teklifte bir kalem eksik demektir.",
          ] },
          { h: "Sistemi faydalı kılan kurallar", p: [
            "Sistemin değeri, sizin politikanıza göre ayarlanmasındadır. Gece ve dönüşümlü dahil çizelgeler ve vardiyalar; 5 dakikalık veya sıfır gecikme payı — karar sizin; sabit veya esnek öğle arası; seyahatler ve izinler. Sistem gecikmeleri, erken çıkışları, fazla mesaiyi ve gece saatlerini bir kez koyduğunuz kurallara göre kendisi sayar.",
            "Yönetici günün resmini gerçek zamanlı alır: kim içeride, kim geç, kim hiç yok. Ay sonu raporu değil, operasyon aracı: atölyedeki eksik vardiya hafta özetinde değil, daha sabah görünür.",
          ] },
          { h: "Verinin bordroya yolu", p: [
            "Takip için takip anlamsızdır — veri bordroya ulaşmalıdır. Puantajın 1C ve ERP sistemlerine aktarımını kurarız: çalışılan saatler, fazla mesai ve gece vardiyaları elle taşınmadan, insan hatasız hesaba düşer. Raporlar departman, lokasyon ve proje bazındadır.",
            "Kurulum işi durdurmaz: girişteki terminaller bir günde monte edilir, personelin tanıtımı bir gün daha sürer (kalabalık kadroda listeyi 1C veya Excel'den alırız). İK'yı ve yöneticiyi eğitiriz; sistem sonra kendi başına yaşar. Keşif ve teklif ücretsiz, ekipman Taşkent stoğundan, garanti ve destek tüm Özbekistan'da.",
          ] },
        ],
        faq: [
          { q: "Kurulum ne kadar sürer?", a: "Tipik ofis veya atölye: terminallere bir gün, personel tanıtımı ve çizelge ayarına bir gün. Pazartesi sistem saymaya başlamıştır." },
          { q: "Saha personeli ve şantiyeler ne olacak?", a: "Konum doğrulamalı mobil giriş: çalışan telefondan giriş yapar, sistem gerçekten sahada olduğunu doğrular. Geçici sahalar için taşınabilir terminaller vardır." },
          { q: "Çalışanlar biyometriye karşıysa?", a: "Terminaller fotoğraf değil, görüntüye geri çevrilemeyen matematiksel şablon saklar. Bunu anlatmak ve dürüst çalışanın kazandığını göstermek — fazla mesai artık kaybolmuyor — genelde yeter." },
          { q: "Mesai takibi mevcut PDKS'ye bağlanır mı?", a: "Çoğunlukla evet: kontrolör ve okuyucular destekleniyorsa takip mevcut geçişlerin üstüne kurulur. Gelir, donanıma bakar ve dürüstçe söyleriz — ne kullanılır, ne değişmeli." },
        ],
      },
      zh: {
        title: "考勤管理：生物识别对阵纸质考勤表",
        excerpt: "为什么手工考勤表永远不准，生物识别终端如何终结信任问题，除了「上下班打卡」还要配置什么——以及数据如何不经人事手工就进入工资核算。",
        sections: [
          { h: "纸质考勤表为什么不准", p: [
            "手工考勤表经不起现实检验：十点前到的都写「9:00」，晚上的加班没人登记，「帮我打个卡，我要迟到了」是企业文化的一部分。月底人事花好几天对账吵架，两边都输：公司为没上的班付钱，老实人加了班却拿不到钱。",
            "自动考勤去掉的不是人，而是争吵的土壤：时间在通过终端的那一刻被记录，终端不管谁跟谁是朋友。考勤表自动生成，随时经得起核查——无论是劳动监察还是自家审计。",
          ] },
          { h: "终端取代登记本", p: [
            "生物识别终端凭人脸或指纹认人——替同事打卡在物理上不可能。人脸识别边走边过、卫生无虞；指纹更便宜，但在手脏的车间不好用。要求不高的办公室可以继续用卡，外勤班组用带定位校验的手机打卡。",
            "中控智慧（ZKTeco）或海康威视的终端把考勤和门禁合二为一：一台设备既开门又记时。不需要单独的「考勤闸机」——预算里直接少一项。",
          ] },
          { h: "让系统真正有用的规则", p: [
            "系统的价值在于按您的考勤制度调校。班次和排班（含夜班和轮班）；迟到宽限5分钟还是零容忍——您说了算；午休固定还是弹性；出差和休假。迟到、早退、加班和夜班工时由系统按您定好的规则自动计算。",
            "管理者实时掌握当天全貌：谁在岗、谁迟到、谁压根没来。这不是月底的报表，而是即时管理工具：车间班组缺员早上就能看到，而不是等到周报。",
          ] },
          { h: "数据通往工资的路", p: [
            "为考勤而考勤没有意义——数据必须抵达工资核算。我们配置考勤表导出到1C等管理系统：工时、加班和夜班直接进入核算，没有手工誊抄，没有「人为因素」出错。报表按部门、场所和项目出。",
            "部署不停工：门口终端一天装好，录入员工再一天（人多时从1C或Excel导入名单）。培训人事和管理员，之后系统自己运转。勘测和报价免费，设备塔什干现货，质保和支持覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "部署考勤系统要多久？", a: "典型办公室或车间：装终端一天，录员工、配排班再一天。到周一系统就已经在计数了。" },
          { q: "外勤员工和工地怎么办？", a: "带定位的手机打卡：员工用手机签到，系统校验他确实在现场。临时工地还有便携终端。" },
          { q: "员工反对生物识别怎么办？", a: "终端存的不是照片，而是无法还原成图像的数学模板。解释清楚这一点，再让大家看到老实人受益——加班不再被漏记——通常就够了。" },
          { q: "考勤能接入已有的门禁系统吗？", a: "多数情况可以：只要控制器和读卡器受支持，考勤就架在现有通行点之上。我们上门看设备，实话实说——哪些能复用，哪些得换。" },
        ],
      },
    },
  },
  {
    slug: "wifi-dlya-ofisa",
    date: "2026-07-17",
    related: ["wifi", "network"],
    hubs: ["wi-fi-tochki-dostupa", "marshrutizatory"],
    loc: {
      ru: {
        title: "Wi-Fi для офиса: почему домашний роутер не справляется",
        excerpt: "Разбираем, чем корпоративный Wi-Fi отличается от домашнего: ёмкость вместо «радиуса», бесшовный роуминг, гостевая сеть с авторизацией — и как спроектировать сеть, которая не тормозит в час пик.",
        sections: [
          { h: "Дело не в радиусе, а в ёмкости", p: [
            "Домашний роутер в офисе — самая частая причина жалоб «интернет тормозит». Он рассчитан на десяток устройств, а офис на двадцать человек несёт полсотни: ноутбуки, телефоны, принтеры, телевизор в переговорке, кассы. Проблема не в «слабом сигнале» — антенны видно из любого угла, — а в ёмкости: чипу роутера не хватает ресурсов обслуживать всех одновременно.",
            "Корпоративная точка доступа держит десятки активных клиентов, а несколько точек управляются центральным контроллером и балансируют нагрузку между собой. Сеть не деградирует, когда все вышли в видеозвонки, — именно этим и отличается офисное решение от бытового, а не ценником на коробке.",
          ] },
          { h: "Роуминг: чтобы звонок не рвался", p: [
            "Вторая офисная болезнь — «мёртвые зоны» и обрывы при переходе между кабинетами. Телефон цепляется за дальнюю точку до последнего, звонок квакает и рвётся. Лечится это бесшовным роумингом: точки с поддержкой стандартов 802.11k/v/r мягко передают клиента друг другу, и Zoom-звонок переживает прогулку по всему этажу.",
            "Для этого сеть нужно проектировать: радиообследование, план размещения точек с правильным перекрытием сот, настройка мощности — слишком громкая точка мешает роумингу не меньше, чем слабая. «Повесим побольше роутеров» без плана даёт эфир, забитый взаимными помехами.",
          ] },
          { h: "Гостевая сеть и безопасность", p: [
            "Раздавать гостям пароль от рабочего Wi-Fi — значит пускать чужие устройства в сеть, где живут серверы, принтеры и бухгалтерия. Правильная схема: корпоративный сегмент и гостевой изолированы VLAN-ами и файрволом, гости получают интернет через портал с авторизацией по коду или клику и с ограничением скорости.",
            "Отдельные сегменты выделяются камерам, кассам и IoT-устройствам: взломанная «умная колонка» не должна видеть файловый сервер. Это не паранойя, а базовая гигиена, которая настраивается один раз и не мешает никому работать.",
          ] },
          { h: "Что мы делаем и что вы получаете", p: [
            "Проектируем сеть по плану помещения с учётом стен и помех, прокладываем СКС и ставим PoE-коммутаторы — точки питаются по тому же кабелю, что несёт данные, розетки под потолком не нужны. Работаем с Ubiquiti UniFi, MikroTik, TP-Link Omada и Ruijie со склада в Ташкенте: платформу подбираем под масштаб и бюджет.",
            "На выходе — сеть с понятной схемой, доступами к контроллеру и инструкцией по гостевым кодам. Даём гарантию, берём Wi-Fi на сопровождение: мониторинг, обновления, разбор «у нас тормозит» по графикам контроллера, а не гаданием. Выезд и расчёт бесплатны, работаем по Ташкенту и всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Сколько точек доступа нужно офису на 30 человек?", a: "Обычно две-четыре: зависит от планировки, стен и переговорок. Точный ответ даёт радиообследование — мы делаем его бесплатно при расчёте проекта." },
          { q: "Можно ли оставить провайдерский роутер?", a: "Да, как шлюз в интернет: за ним ставится своя сеть с точками доступа и коммутатором. Раздачу Wi-Fi провайдерской коробке лучше не доверять — она и есть узкое место." },
          { q: "Что такое бесшовный роуминг и правда ли он бесшовный?", a: "Стандарты 802.11k/v/r помогают устройству переключаться между точками за миллисекунды — звонок не замечает перехода. Работает при грамотном проектировании перекрытия сот; просто «много точек» роуминга не дают." },
          { q: "Как закрыть Wi-Fi склад с металлическими стеллажами?", a: "Металл экранирует сигнал, поэтому склад проектируется с запасом перекрытия и направленными антеннами вдоль проходов. Терминалы сбора данных чувствительны к роумингу — это учитывается в плане размещения точек." },
        ],
      },
      uz: {
        title: "Ofis uchun Wi-Fi: nega uy routeri uddalay olmaydi",
        excerpt: "Korporativ Wi-Fi uynikidan nimasi bilan farq qilishini ko'rib chiqamiz: «radius» o'rniga sig'im, uzluksiz rouming, avtorizatsiyali mehmon tarmog'i — va eng band soatda tormozlamaydigan tarmoqni qanday loyihalash.",
        sections: [
          { h: "Gap radiusda emas, sig'imda", p: [
            "Ofisdagi uy routeri — «internet tormozlayapti» shikoyatlarining eng ko'p sababi. U o'nta qurilmaga mo'ljallangan, yigirma kishilik ofis esa elliktasini olib yuradi: noutbuklar, telefonlar, printerlar, muzokara xonasidagi televizor, kassalar. Muammo «kuchsiz signal»da emas — antennalar har burchakdan ko'rinadi, — sig'imda: router chipiga hammani birdan xizmatlashga resurs yetmaydi.",
            "Korporativ ulanish nuqtasi o'nlab faol mijozni ushlaydi, bir nechta nuqta markaziy kontroller orqali boshqariladi va yukni o'zaro taqsimlaydi. Hamma videoqo'ng'iroqqa chiqqanda tarmoq cho'kmaydi — ofis yechimi maishiydan qutidagi narx bilan emas, aynan shu bilan farq qiladi.",
          ] },
          { h: "Rouming: qo'ng'iroq uzilmasligi uchun", p: [
            "Ikkinchi ofis kasali — «o'lik zonalar» va kabinetlar orasida o'tishda uzilishlar. Telefon oxirigacha uzoq nuqtaga yopishadi, qo'ng'iroq vaqillaydi va uziladi. Buni uzluksiz rouming davolaydi: 802.11k/v/r standartlarini qo'llaydigan nuqtalar mijozni bir-biriga yumshoq uzatadi, Zoom-qo'ng'iroq butun qavat bo'ylab sayrga chidaydi.",
            "Buning uchun tarmoqni loyihalash kerak: radiotekshiruv, sotalarning to'g'ri qoplanishi bilan nuqtalar joylashuv plani, quvvat sozlash — haddan baland nuqta roumingga kuchsizidan kam xalaqit bermaydi. Rejasiz «ko'proq router osamiz» o'zaro xalaqitga to'la efir beradi.",
          ] },
          { h: "Mehmon tarmog'i va xavfsizlik", p: [
            "Mehmonlarga ish Wi-Fi parolini tarqatish — server, printer va buxgalteriya yashaydigan tarmoqqa begona qurilmalarni kiritish degani. To'g'ri sxema: korporativ va mehmon segmentlari VLAN va fayrvol bilan izolyatsiya qilinadi, mehmonlar internetni kod yoki klik avtorizatsiyali portal orqali tezlik cheklovi bilan oladi.",
            "Kamera, kassa va IoT-qurilmalarga alohida segmentlar ajratiladi: buzilgan «aqlli kolonka» fayl serverni ko'rmasligi kerak. Bu paranoyya emas, bir marta sozlanadigan va hech kimga ishlashga xalaqit bermaydigan bazaviy gigiyena.",
          ] },
          { h: "Biz nima qilamiz va siz nima olasiz", p: [
            "Tarmoqni xona plani bo'yicha devor va xalaqitlarni hisobga olib loyihalaymiz, SKS o'tkazamiz va PoE-kommutatorlar qo'yamiz — nuqtalar ma'lumot olib boradigan o'sha kabeldan quvvatlanadi, ship ostida rozetka kerak emas. Toshkentdagi ombordan Ubiquiti UniFi, MikroTik, TP-Link Omada va Ruijie bilan ishlaymiz: platformani ko'lam va byudjetga tanlaymiz.",
            "Natijada — tushunarli sxemali tarmoq, kontrollerga kirishlar va mehmon kodlari yo'riqnomasi. Kafolat beramiz, Wi-Fi ni kuzatuvga olamiz: monitoring, yangilanishlar, «tormozlayapti»ni taxmin bilan emas, kontroller grafiklari bo'yicha tahlil. Chiqish va hisob bepul, Toshkent va butun O'zbekiston bo'ylab ishlaymiz.",
          ] },
        ],
        faq: [
          { q: "30 kishilik ofisga nechta ulanish nuqtasi kerak?", a: "Odatda ikki-to'rtta: planirovka, devorlar va muzokara xonalariga bog'liq. Aniq javobni radiotekshiruv beradi — loyiha hisobida uni bepul qilamiz." },
          { q: "Provayder routerini qoldirsa bo'ladimi?", a: "Ha, internetga shlyuz sifatida: uning ortiga ulanish nuqtalari va kommutatorli o'z tarmog'ingiz quriladi. Wi-Fi tarqatishni provayder qutisiga ishonmagan ma'qul — tor joy aynan o'sha." },
          { q: "Uzluksiz rouming nima va u rostdan uzluksizmi?", a: "802.11k/v/r standartlari qurilmaga nuqtalar orasida millisekundlarda o'tishga yordam beradi — qo'ng'iroq o'tishni sezmaydi. Sotalar qoplanishi to'g'ri loyihalanganda ishlaydi; shunchaki «ko'p nuqta» rouming bermaydi." },
          { q: "Metall stellajli omborni Wi-Fi bilan qanday yopish mumkin?", a: "Metall signalni ekranlaydi, shuning uchun ombor qoplanish zaxirasi va yo'laklar bo'ylab yo'naltirilgan antennalar bilan loyihalanadi. Ma'lumot yig'ish terminallari roumingga sezgir — bu nuqtalar joylashuv planida hisobga olinadi." },
        ],
      },
      en: {
        title: "Office Wi-Fi: Why a Home Router Cannot Cope",
        excerpt: "How corporate Wi-Fi differs from home Wi-Fi: capacity instead of \"range\", seamless roaming, a guest network with authorization — and how to design a network that does not choke at peak hours.",
        sections: [
          { h: "It is capacity, not range", p: [
            "A home router in an office is the most common cause of \"the internet is slow\" complaints. It is built for a dozen devices, while a twenty-person office carries fifty: laptops, phones, printers, the meeting room TV, POS terminals. The problem is not \"weak signal\" — the antennas are visible from every corner — but capacity: the router's chip lacks the resources to serve everyone at once.",
            "An enterprise access point holds dozens of active clients, and several points are managed by a central controller and balance the load between themselves. The network does not degrade when everyone joins video calls — that, not the price on the box, is what separates an office solution from a household one.",
          ] },
          { h: "Roaming: so the call does not drop", p: [
            "The second office disease is dead zones and drops when walking between rooms. The phone clings to the far access point until the last moment; the call croaks and dies. The cure is seamless roaming: points supporting 802.11k/v/r hand the client to each other smoothly, and a Zoom call survives a walk across the whole floor.",
            "This requires design: a site survey, a placement plan with correct cell overlap, power tuning — a too-loud point hurts roaming as much as a weak one. \"Just hang more routers\" without a plan produces an airspace jammed with mutual interference.",
          ] },
          { h: "Guest network and security", p: [
            "Sharing the office Wi-Fi password with guests means letting strangers' devices into the network where servers, printers and accounting live. The proper scheme: the corporate and guest segments are isolated with VLANs and a firewall, and guests get internet through a captive portal with code or one-click authorization and a speed cap.",
            "Separate segments go to cameras, POS and IoT devices: a hacked \"smart speaker\" must not see the file server. This is not paranoia but basic hygiene — configured once, invisible to everyone's daily work.",
          ] },
          { h: "What we do and what you get", p: [
            "We design the network from the floor plan accounting for walls and interference, run structured cabling and install PoE switches — access points take power over the same cable that carries data, no ceiling outlets needed. We work with Ubiquiti UniFi, MikroTik, TP-Link Omada and Ruijie from Tashkent stock, choosing the platform for your scale and budget.",
            "The result is a network with a clear diagram, controller credentials and guest code instructions. We provide a warranty and ongoing support: monitoring, updates, and \"it's slow\" investigated with controller graphs rather than guesswork. The survey and quote are free; we work across Tashkent and all of Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "How many access points does a 30-person office need?", a: "Usually two to four, depending on the layout, walls and meeting rooms. The exact answer comes from a site survey — free as part of our project calculation." },
          { q: "Can we keep the ISP's router?", a: "Yes, as the internet gateway: your own network with access points and a switch goes behind it. Just do not trust the ISP box with Wi-Fi distribution — it is the bottleneck." },
          { q: "What is seamless roaming and is it really seamless?", a: "The 802.11k/v/r standards help a device switch between points in milliseconds — a call does not notice the handover. It works when cell overlap is engineered properly; merely \"many points\" gives no roaming." },
          { q: "How do you cover a warehouse with metal racking?", a: "Metal shields the signal, so a warehouse is designed with overlap margin and directional antennas along the aisles. Barcode terminals are roaming-sensitive — that is factored into the placement plan." },
        ],
      },
      tr: {
        title: "Ofis için Wi-Fi: Ev Tipi Router Neden Yetmez",
        excerpt: "Kurumsal Wi-Fi ev tipinden nasıl ayrılır: «menzil» yerine kapasite, kesintisiz dolaşım, yetkilendirmeli misafir ağı — ve yoğun saatte boğulmayan ağ nasıl tasarlanır.",
        sections: [
          { h: "Mesele menzil değil kapasite", p: [
            "Ofisteki ev tipi router, «internet yavaş» şikâyetlerinin en yaygın nedenidir. Bir düzine cihaz için tasarlanmıştır; yirmi kişilik ofis elli cihaz taşır: dizüstüler, telefonlar, yazıcılar, toplantı odasındaki TV, kasalar. Sorun «zayıf sinyal» değil — antenler her köşeden görünür — kapasitedir: router çipinin herkese aynı anda hizmet edecek gücü yoktur.",
            "Kurumsal erişim noktası onlarca aktif istemciyi taşır; birkaç nokta merkezi kontrolcüyle yönetilir ve yükü aralarında dengeler. Herkes görüntülü aramaya girince ağ çökmez — ofis çözümünü ev tipinden ayıran, kutudaki fiyat değil budur.",
          ] },
          { h: "Dolaşım: görüşme kopmasın diye", p: [
            "İkinci ofis hastalığı ölü bölgeler ve odalar arası geçişte kopmalardır. Telefon son âna dek uzaktaki noktaya yapışır; görüşme hırıldar ve düşer. Çare kesintisiz dolaşımdır: 802.11k/v/r destekli noktalar istemciyi birbirine yumuşakça devreder, Zoom görüşmesi kat boyu yürüyüşe dayanır.",
            "Bunun için ağ tasarlanmalıdır: saha etüdü, doğru hücre örtüşmeli yerleşim planı, güç ayarı — fazla gür nokta dolaşıma zayıfı kadar zarar verir. Plansız «daha çok router asalım», karşılıklı parazitle dolu bir hava sahası üretir.",
          ] },
          { h: "Misafir ağı ve güvenlik", p: [
            "Misafire iş Wi-Fi şifresini vermek; sunucuların, yazıcıların ve muhasebenin yaşadığı ağa yabancı cihazları sokmak demektir. Doğru şema: kurumsal ve misafir segmentleri VLAN ve güvenlik duvarıyla yalıtılır; misafir interneti kod veya tıkla-onayla portalından, hız sınırıyla alır.",
            "Kameralara, kasalara ve IoT cihazlarına ayrı segmentler verilir: ele geçirilen «akıllı hoparlör» dosya sunucusunu görmemelidir. Bu paranoya değil, bir kez kurulan ve kimsenin işine karışmayan temel hijyendir.",
          ] },
          { h: "Ne yapıyoruz, ne alıyorsunuz", p: [
            "Ağı kat planından, duvarları ve parazitleri hesaba katarak tasarlar, yapısal kablolama çeker ve PoE switch kurarız — noktalar veriyi taşıyan kablodan beslenir, tavan altına priz gerekmez. Taşkent stoğundan Ubiquiti UniFi, MikroTik, TP-Link Omada ve Ruijie ile çalışır, platformu ölçeğe ve bütçeye göre seçeriz.",
            "Sonuç: net şemalı ağ, kontrolcü erişimleri ve misafir kodu talimatı. Garanti verir, Wi-Fi'ı izleriz: takip, güncellemeler ve «yavaş» şikâyetinin tahminle değil kontrolcü grafikleriyle çözümü. Keşif ve teklif ücretsiz; Taşkent ve tüm Özbekistan'da çalışıyoruz.",
          ] },
        ],
        faq: [
          { q: "30 kişilik ofise kaç erişim noktası gerekir?", a: "Genelde iki-dört: plana, duvarlara ve toplantı odalarına bağlı. Kesin yanıtı saha etüdü verir — proje hesabında ücretsizdir." },
          { q: "Sağlayıcının routerı kalabilir mi?", a: "Evet, internet geçidi olarak: arkasına erişim noktalı ve switch'li kendi ağınız kurulur. Wi-Fi dağıtımını sağlayıcı kutusuna emanet etmeyin — dar boğaz tam da odur." },
          { q: "Kesintisiz dolaşım nedir, gerçekten kesintisiz mi?", a: "802.11k/v/r standartları cihazın noktalar arasında milisaniyelerde geçmesini sağlar — görüşme devri fark etmez. Hücre örtüşmesi doğru tasarlanınca çalışır; yalnızca «çok nokta» dolaşım vermez." },
          { q: "Metal raflı depo nasıl kapsanır?", a: "Metal sinyali perdeler; depo bu yüzden örtüşme payıyla ve koridorlar boyunca yönlü antenlerle tasarlanır. El terminalleri dolaşıma duyarlıdır — yerleşim planında gözetilir." },
        ],
      },
      zh: {
        title: "办公室Wi-Fi：家用路由器为什么撑不住",
        excerpt: "企业级Wi-Fi与家用的区别：容量而非「覆盖半径」、无缝漫游、带认证的访客网络——以及如何设计一张高峰期不卡顿的网络。",
        sections: [
          { h: "关键不是半径，是容量", p: [
            "办公室用家用路由器，是「网卡了」投诉的头号来源。它为十来台设备设计，二十人的办公室却挂着五十台：笔记本、手机、打印机、会议室电视、收银机。问题不在「信号弱」——天线哪个角落都看得见——而在容量：路由器芯片没有资源同时伺候所有人。",
            "企业级接入点单台承载数十个活跃客户端，多台由中央控制器统一管理并互相分担负载。所有人同时开视频会议网络也不垮——办公方案与家用的区别正在这里，而不是包装盒上的价格。",
          ] },
          { h: "漫游：让通话不掉线", p: [
            "办公室第二种通病是「死区」和走动时掉线。手机死抱着远处的接入点不放，通话卡顿然后中断。治法是无缝漫游：支持802.11k/v/r标准的接入点把客户端平滑地互相移交，Zoom通话能撑过穿越整层楼的散步。",
            "这需要设计：现场勘测、带正确蜂窝重叠的点位规划、功率调校——信号过强的接入点对漫游的伤害不亚于信号弱的。没有规划的「多挂几个路由器」，得到的是一片互相干扰的频谱。",
          ] },
          { h: "访客网络与安全", p: [
            "把办公Wi-Fi密码发给客人，等于把陌生设备放进服务器、打印机和财务所在的网络。正确做法：办公段和访客段用VLAN和防火墙隔离，访客通过认证门户上网——凭码或一键连接，并限速。",
            "摄像机、收银机和物联网设备再分独立网段：被入侵的「智能音箱」不应看得见文件服务器。这不是多疑，是配置一次、不妨碍任何人干活的基本卫生。",
          ] },
          { h: "我们做什么、您得到什么", p: [
            "按平面图设计网络，考虑墙体和干扰源；敷设综合布线并安装PoE交换机——接入点由传数据的同一根线供电，吊顶下不需要插座。设备用塔什干现货的Ubiquiti UniFi、MikroTik、TP-Link Omada和锐捷：平台按规模和预算选。",
            "交付的是一张有清晰图纸的网络：控制器账号、访客码发放说明。提供质保并持续运维：监控、升级，「网慢了」用控制器图表诊断而不是猜。勘测和报价免费，服务覆盖塔什干及全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "30人的办公室需要几个接入点？", a: "通常两到四个，取决于布局、墙体和会议室数量。准确答案来自现场勘测——它包含在我们的免费方案测算里。" },
          { q: "运营商的路由器能留着吗？", a: "能，当互联网网关用：它后面架设您自己的接入点和交换机网络。别把Wi-Fi分发交给运营商的盒子——瓶颈就是它。" },
          { q: "无缝漫游是什么，真的无缝吗？", a: "802.11k/v/r标准让设备在毫秒级完成接入点切换——通话察觉不到移交。前提是蜂窝重叠设计得当；单纯「多装几个点」不产生漫游。" },
          { q: "金属货架的仓库怎么覆盖？", a: "金属屏蔽信号，所以仓库要按加倍的重叠余量设计，并沿通道使用定向天线。手持终端对漫游敏感——点位规划时都会考虑。" },
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
        title: "Умный дом: с чего начать и на чём не обжечься",
        excerpt: "Первые шаги в автоматизации без переделки ремонта: какие сценарии дают эффект с первого дня, чем проводная система отличается от беспроводной, и почему главный враг умного дома — зоопарк приложений.",
        sections: [
          { h: "Начните со сценариев, а не с гаджетов", p: [
            "Умный дом покупают не ради лампочки с телефона — ради сценариев, которые убирают рутину. «Утро»: шторы открываются, свет плавно разгорается, кондиционер выходит из ночного режима. «Ушли»: гаснет весь свет, обесточиваются розетки с утюгом, встаёт охрана. «Отпуск»: дом вечерами включает свет, имитируя присутствие. Один раз настроенный сценарий срабатывает по кнопке, расписанию или геолокации.",
            "Практичный первый шаг — выбрать три сценария, которые нужны именно вам, и собрать систему под них. Расширяться проще, чем переделывать: платформа остаётся, устройства добавляются.",
          ] },
          { h: "Безопасность окупается первой", p: [
            "Самые рациональные вложения в умный дом — защитные. Датчик протечки с электрокраном перекрывает воду за секунды, пока не затоплены соседи; датчик дыма будит ночью и шлёт уведомление, даже когда вас нет; датчики открытия и движения превращаются в охранную сигнализацию с сиреной и тревогой на телефон.",
            "Сюда же — камеры и видеодомофон в том же приложении: звонок в дверь приходит на смартфон, где бы вы ни были. Этот контур окупается первым же предотвращённым потопом — а потоп случается чаще пожара и кражи вместе взятых.",
          ] },
          { h: "Проводная или беспроводная", p: [
            "Развилка зависит от стадии ремонта. Беспроводные решения на Zigbee и Wi-Fi (Tuya, Aqara) ставятся на готовый ремонт без штробления: реле прячутся в подрозетники, датчики клеятся и живут от батареек годами. Проводную шину закладывают на этапе стройки: она надёжнее, не зависит от радиоэфира и рассчитана на большие дома со сложной автоматикой.",
            "Честный ответ для большинства квартир — беспроводной системы достаточно. Свет стройте на умных выключателях, а не только лампах: обычная клавиша на стене продолжает работать для всех, кто не хочет доставать телефон, — это спасает от главной семейной претензии к умному дому.",
          ] },
          { h: "Главная ошибка самостоятельной сборки", p: [
            "Зоопарк приложений: лампы в одном, розетки в другом, камеры в третьем, и ничто ни с чем не дружит. Сценарий «ушли» в таком доме невозможен — некому выключить всё разом. Мы собираем систему на единой платформе: устройства видят друг друга, сценарии общие, семья пользуется одним приложением с понятными правами.",
            "Обследование и проект сценариев — бесплатно; стартовый комплект на квартиру — неделя от заявки до работающих сценариев. Оборудование со склада в Ташкенте, гарантия, поддержка и расширение системы по мере запросов — по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Можно ли сделать умный дом в квартире с готовым ремонтом?", a: "Да, беспроводные системы ставятся без штробления: реле в подрозетники, датчики на клейкой основе. Ремонт не страдает, монтаж занимает день-два." },
          { q: "Что поставить в первую очередь при ограниченном бюджете?", a: "Защитный контур: датчики протечки с электрокраном, дым, открытие дверей. Затем свет по сценариям и климат. Развлечения — голосовые колонки и шторы — добавляются потом на ту же платформу." },
          { q: "Будет ли система работать без интернета?", a: "Локальные сценарии на Zigbee-хабе работают и без интернета: свет, датчики, автоматизации. Интернет нужен для управления извне дома и уведомлений." },
          { q: "Умный дом — это дорого?", a: "Стартовый комплект на квартиру сопоставим со стоимостью среднего смартфона. Дальше система растёт по мере желания — платформа остаётся, докупаются только устройства." },
        ],
      },
      uz: {
        title: "Aqlli uy: nimadan boshlash va nimada kuymaslik",
        excerpt: "Ta'mirni buzmasdan avtomatlashtirishdagi birinchi qadamlar: qaysi stsenariylar birinchi kundan samara beradi, simli tizim simsizdan nimasi bilan farq qiladi va nega aqlli uyning bosh dushmani — ilovalar hayvonot bog'i.",
        sections: [
          { h: "Gadjetlardan emas, stsenariylardan boshlang", p: [
            "Aqlli uyni telefondagi lampochka uchun emas, kundalik yumushni olib tashlaydigan stsenariylar uchun olishadi. «Tong»: pardalar ochiladi, chiroq asta yonadi, konditsioner tungi rejimdan chiqadi. «Ketdik»: butun chiroq o'chadi, dazmolli rozetkalar tokdan uziladi, qo'riqlash turadi. «Ta'til»: uy kechqurunlari chiroq yoqib, borlikni imitatsiya qiladi. Bir marta sozlangan stsenariy tugma, jadval yoki geolokatsiya bo'yicha ishlaydi.",
            "Amaliy birinchi qadam — aynan sizga kerak uchta stsenariyni tanlab, tizimni ular ostida yig'ish. Kengayish qayta qilishdan oson: platforma qoladi, qurilmalar qo'shiladi.",
          ] },
          { h: "Xavfsizlik birinchi bo'lib o'zini oqlaydi", p: [
            "Aqlli uyga eng oqilona sarmoya — himoya. Elektrokranli suv oqishi datchigi qo'shnilar bosilmasdan suvni soniyalarda yopadi; tutun datchigi kechasi uyg'otadi va uyda bo'lmasangiz ham xabar yuboradi; ochilish va harakat datchiklari sirena va telefonga trevogali qo'riqlash signalizatsiyasiga aylanadi.",
            "Shu yerga — o'sha ilovadagi kameralar va videodomofon: eshik qo'ng'irog'i qayerda bo'lsangiz ham smartfonga keladi. Bu kontur birinchi oldini olingan suv toshqinidayoq o'zini oqlaydi — toshqin esa yong'in va o'g'irlik qo'shilganidan ko'ra tez-tez bo'ladi.",
          ] },
          { h: "Simli yoki simsiz", p: [
            "Tanlov ta'mir bosqichiga bog'liq. Zigbee va Wi-Fi dagi simsiz yechimlar (Tuya, Aqara) tayyor ta'mirga shtroblashsiz o'rnatiladi: rele podrozetnikka yashirinadi, datchiklar yopishtiriladi va batareyadan yillab yashaydi. Simli shina qurilish bosqichida yotqiziladi: ishonchliroq, radioefirga bog'liq emas va murakkab avtomatikali katta uylarga mo'ljallangan.",
            "Ko'pchilik kvartiralar uchun halol javob — simsiz tizim yetarli. Yoritishni faqat lampalarga emas, aqlli vyklyuchatellarga quring: devordagi oddiy klavisha telefon chiqargisi kelmaydiganlar uchun ishlashda davom etadi — bu aqlli uyga bosh oilaviy e'tirozdan qutqaradi.",
          ] },
          { h: "Mustaqil yig'ishning bosh xatosi", p: [
            "Ilovalar hayvonot bog'i: lampalar birida, rozetkalar boshqasida, kameralar uchinchisida — hech narsa hech narsa bilan do'st emas. Bunday uyda «ketdik» stsenariysi mumkin emas — hammasini birdan o'chiradigan yo'q. Tizimni yagona platformada yig'amiz: qurilmalar bir-birini ko'radi, stsenariylar umumiy, oila tushunarli huquqli bitta ilovadan foydalanadi.",
            "Tekshiruv va stsenariylar loyihasi — bepul; kvartiraga start to'plami — arizadan ishlaydigan stsenariylargacha bir hafta. Uskuna Toshkentdagi ombordan, kafolat, qo'llab-quvvatlash va tizimni so'rov bo'yicha kengaytirish — butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "Tayyor ta'mirli kvartirada aqlli uy qilsa bo'ladimi?", a: "Ha, simsiz tizimlar shtroblashsiz o'rnatiladi: rele podrozetnikka, datchiklar yelimli asosga. Ta'mir zarar ko'rmaydi, montaj bir-ikki kun oladi." },
          { q: "Cheklangan byudjetda birinchi navbatda nima qo'yish kerak?", a: "Himoya konturi: elektrokranli suv oqishi datchiklari, tutun, eshik ochilishi. Keyin stsenariyli yoritish va iqlim. Ko'ngilochar — ovozli kolonkalar va pardalar — keyin o'sha platformaga qo'shiladi." },
          { q: "Tizim internetsiz ishlaydimi?", a: "Zigbee-xabdagi lokal stsenariylar internetsiz ham ishlaydi: yoritish, datchiklar, avtomatlashtirishlar. Internet uydan tashqaridan boshqarish va xabarlar uchun kerak." },
          { q: "Aqlli uy qimmatmi?", a: "Kvartiraga start to'plami o'rtacha smartfon narxi bilan taqqoslanadi. Keyin tizim xohishga qarab o'sadi — platforma qoladi, faqat qurilmalar sotib olinadi." },
        ],
      },
      en: {
        title: "Smart Home: Where to Start and What Not to Get Burned By",
        excerpt: "First steps in automation without redoing the renovation: which scenarios pay off from day one, how wired differs from wireless, and why the smart home's worst enemy is a zoo of apps.",
        sections: [
          { h: "Start with scenarios, not gadgets", p: [
            "A smart home is bought not for a phone-controlled bulb but for scenarios that remove routine. \"Morning\": curtains open, light fades in, the air conditioner leaves night mode. \"Away\": all lights off, the iron's socket de-energised, security armed. \"Vacation\": the house switches lights on in the evenings, simulating presence. A scenario configured once fires by button, schedule or geofence.",
            "The practical first step is choosing the three scenarios you personally need and building the system around them. Expanding is easier than redoing: the platform stays, devices get added.",
          ] },
          { h: "Safety pays off first", p: [
            "The most rational smart home investments are protective. A leak sensor with a motorised valve shuts the water in seconds, before the neighbours below are flooded; a smoke sensor wakes you at night and sends an alert even when you are away; contact and motion sensors become a burglar alarm with a siren and phone notifications.",
            "Add cameras and a video intercom in the same app: the doorbell rings on your smartphone wherever you are. This circuit pays for itself with the first prevented flood — and floods happen more often than fires and burglaries combined.",
          ] },
          { h: "Wired or wireless", p: [
            "The fork depends on the renovation stage. Wireless solutions on Zigbee and Wi-Fi (Tuya, Aqara) install onto a finished interior with no chasing: relays hide in wall boxes, sensors stick on and run on batteries for years. A wired bus is laid during construction: more robust, independent of the radio environment, made for large houses with complex automation.",
            "The honest answer for most apartments: wireless is enough. Build lighting on smart switches, not just smart bulbs: the ordinary wall key keeps working for everyone who does not want to reach for a phone — which saves you from the family's number one complaint about smart homes.",
          ] },
          { h: "The main DIY mistake", p: [
            "A zoo of apps: bulbs in one, sockets in another, cameras in a third — and nothing talks to anything. The \"away\" scenario is impossible in such a home: there is nobody to switch everything off at once. We build on a single platform: devices see each other, scenarios are shared, and the family uses one app with sensible permissions.",
            "The survey and scenario design are free; a starter apartment kit takes a week from request to working scenarios. Equipment from Tashkent stock, warranty, support and system growth on demand — across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "Can a smart home be added to a finished apartment?", a: "Yes — wireless systems install without chasing: relays go into wall boxes, sensors are adhesive. The renovation is untouched; installation takes a day or two." },
          { q: "What to install first on a limited budget?", a: "The protective circuit: leak sensors with a motorised valve, smoke, door contacts. Then scenario lighting and climate. Entertainment — speakers and curtains — joins the same platform later." },
          { q: "Does the system work without internet?", a: "Local scenarios on a Zigbee hub work offline: lighting, sensors, automations. Internet is needed for control from outside the home and for notifications." },
          { q: "Is a smart home expensive?", a: "A starter apartment kit is comparable to a mid-range smartphone. The system then grows at your pace — the platform stays, you only add devices." },
        ],
      },
      tr: {
        title: "Akıllı Ev: Nereden Başlamalı, Nerede Yanmamalı",
        excerpt: "Tadilatı bozmadan otomasyona ilk adımlar: hangi senaryolar ilk günden işe yarar, kablolu kablosuzdan nasıl ayrılır ve akıllı evin baş düşmanı neden uygulama hayvanat bahçesidir.",
        sections: [
          { h: "Cihazlarla değil senaryolarla başlayın", p: [
            "Akıllı ev telefondan yanan ampul için değil, rutini kaldıran senaryolar için alınır. «Sabah»: perdeler açılır, ışık yumuşakça artar, klima gece modundan çıkar. «Çıktık»: tüm ışıklar söner, ütünün prizi kesilir, alarm kurulur. «Tatil»: ev akşamları ışık yakıp varlık taklidi yapar. Bir kez kurulan senaryo düğme, program veya konumla tetiklenir.",
            "Pratik ilk adım: size gerçekten gereken üç senaryoyu seçip sistemi onlara göre kurmak. Genişlemek yeniden yapmaktan kolaydır: platform kalır, cihaz eklenir.",
          ] },
          { h: "Önce güvenlik amorti eder", p: [
            "Akıllı eve en akılcı yatırım koruyucu olandır. Motorlu vanalı su kaçağı sensörü, alt komşu su basmadan suyu saniyelerde keser; duman sensörü gece uyandırır ve evde değilken bile bildirim yollar; kontak ve hareket sensörleri sirenli, telefona alarmlı hırsız alarmına dönüşür.",
            "Buna aynı uygulamadaki kameralar ve görüntülü diafon eklenir: kapı zili nerede olursanız olun telefonda çalar. Bu devre ilk önlenen su baskınıyla kendini öder — baskın ise yangın ve hırsızlığın toplamından sık olur.",
          ] },
          { h: "Kablolu mu kablosuz mu", p: [
            "Yol ayrımı tadilat aşamasına bağlıdır. Zigbee ve Wi-Fi tabanlı kablosuz çözümler (Tuya, Aqara) bitmiş tadilata kırım olmadan kurulur: röleler kasalara saklanır, sensörler yapıştırılır ve pille yıllarca çalışır. Kablolu bara inşaatta döşenir: daha sağlam, radyo ortamından bağımsız, karmaşık otomasyonlu büyük evler için.",
            "Çoğu daire için dürüst yanıt: kablosuz yeter. Aydınlatmayı yalnız ampullere değil akıllı anahtarlara kurun: duvardaki tuş, telefon çıkarmak istemeyen herkes için çalışmayı sürdürür — bu, ailenin akıllı eve bir numaralı itirazından kurtarır.",
          ] },
          { h: "Kendin-yap kurulumun ana hatası", p: [
            "Uygulama hayvanat bahçesi: ampuller birinde, prizler diğerinde, kameralar üçüncüsünde — hiçbiri diğeriyle konuşmaz. Böyle evde «çıktık» senaryosu imkânsızdır: her şeyi bir anda kapatacak kimse yoktur. Tek platformda kurarız: cihazlar birbirini görür, senaryolar ortak, aile mantıklı yetkili tek uygulama kullanır.",
            "Keşif ve senaryo tasarımı ücretsizdir; daireye başlangıç seti talepten çalışan senaryolara bir hafta sürer. Ekipman Taşkent stoğundan; garanti, destek ve talebe göre büyüme — tüm Özbekistan'da.",
          ] },
        ],
        faq: [
          { q: "Bitmiş tadilatlı daireye akıllı ev kurulur mu?", a: "Evet — kablosuz sistemler kırımsız kurulur: röleler kasalara, sensörler yapışkanla. Tadilat zarar görmez; kurulum bir-iki gün." },
          { q: "Kısıtlı bütçeyle önce ne alınmalı?", a: "Koruma devresi: motorlu vanalı kaçak sensörleri, duman, kapı kontakları. Sonra senaryolu ışık ve iklim. Eğlence — hoparlör ve perdeler — sonra aynı platforma eklenir." },
          { q: "Sistem internetsiz çalışır mı?", a: "Zigbee hub'daki yerel senaryolar çevrimdışı da çalışır: ışık, sensörler, otomasyonlar. İnternet, ev dışından kontrol ve bildirimler için gerekir." },
          { q: "Akıllı ev pahalı mı?", a: "Daire başlangıç seti orta sınıf telefon fiyatıyla kıyaslanır. Sistem sonra sizin hızınızda büyür — platform kalır, yalnız cihaz eklenir." },
        ],
      },
      zh: {
        title: "智能家居：从哪开始、别在哪踩坑",
        excerpt: "不动装修的自动化第一步：哪些场景从第一天就见效，有线与无线系统怎么选，以及为什么智能家居的头号敌人是应用「动物园」。",
        sections: [
          { h: "从场景开始，而不是从设备开始", p: [
            "买智能家居不是为了用手机开灯，而是为了消灭琐事的场景。「早晨」：窗帘打开、灯光渐亮、空调退出夜间模式。「离家」：全屋灯灭、熨斗插座断电、安防布防。「度假」：傍晚自动开灯模拟有人在家。场景配置一次，即可按按钮、时间表或地理围栏触发。",
            "务实的第一步：选出您真正需要的三个场景，围绕它们搭系统。扩展比推倒重来容易：平台不变，设备往上加。",
          ] },
          { h: "安全类投入最先回本", p: [
            "智能家居里最理性的投入是保护类。漏水传感器配电动阀几秒关水，赶在淹到楼下之前；烟雾传感器夜里叫醒您，人不在家也推送警报；门磁和移动传感器组成带警笛和手机报警的防盗系统。",
            "再加上同一应用里的摄像机和可视门铃：无论身在何处，门铃都响在手机上。这个保护环第一次拦住水患就回本了——而水患比火灾加盗窃加起来还常见。",
          ] },
          { h: "有线还是无线", p: [
            "分岔取决于装修阶段。Zigbee和Wi-Fi的无线方案（Tuya、Aqara）不开槽就能装进成品房：继电器藏进底盒，传感器贴上即可，电池能用数年。有线总线在建造阶段敷设：更可靠、不受无线环境影响，适合自动化复杂的大宅。",
            "对大多数公寓的诚实答案：无线足够。照明要建在智能开关上，而不只是智能灯泡：墙上的普通按键对不想掏手机的家人照常工作——这能免去家人对智能家居的头号抱怨。",
          ] },
          { h: "自己攒设备的最大错误", p: [
            "应用「动物园」：灯在一个App、插座在另一个、摄像机在第三个——谁也不认识谁。这样的家里「离家」场景无法实现：没有谁能一键关掉一切。我们把系统建在统一平台上：设备互通、场景共享，全家用一个应用、权限清晰。",
            "勘测和场景设计免费；公寓入门套装从下单到场景可用约一周。设备塔什干现货，质保、支持和按需扩展——覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "已装修的公寓能做智能家居吗？", a: "能——无线系统无需开槽：继电器进底盒，传感器背胶粘贴。装修毫发无损，安装一到两天。" },
          { q: "预算有限先装什么？", a: "保护环：漏水传感器加电动阀、烟感、门磁。然后是场景照明和空调。娱乐类——音箱和窗帘——之后加到同一平台。" },
          { q: "断网了系统还能用吗？", a: "Zigbee网关上的本地场景离线照常工作：照明、传感器、自动化。互联网只在外出遥控和接收推送时需要。" },
          { q: "智能家居贵吗？", a: "公寓入门套装与一部中端手机相当。之后按您的节奏成长——平台不变，只添设备。" },
        ],
      },
    },
  },
  {
    slug: "kak-vybrat-turniket",
    date: "2026-07-17",
    related: ["turnstile", "access", "attendance"],
    hubs: ["turnikety-i-shlagbaumy"],
    loc: {
      ru: {
        title: "Как выбрать турникет: трипод, роторный или спидгейт",
        excerpt: "Разбираем типы турникетов под задачи: где хватит трипода, когда нужен полноростовый роторный, зачем бизнес-центрам спидгейты — и из чего на самом деле складывается стоимость проходной.",
        sections: [
          { h: "Тип турникета — от того, что он должен предотвратить", p: [
            "Трипод — три вращающиеся штанги — самый распространённый и доступный турникет для офисов и проходных небольших предприятий. Он дисциплинирует поток «по одному» и хорошо считает проходы, но перепрыгнуть его физически возможно — трипод работает там, где рядом охрана или консьерж.",
            "Полноростовый роторный турникет исключает проход физически: конструкция в рост человека, перелезть невозможно. Его место — периметры заводов, стройплощадки, стадионы, удалённые проходные без постоянной охраны. Спидгейты — скоростные калитки со стеклянными створками — выбирают бизнес-центры и приёмные: красиво, быстро, поток до 30 человек в минуту на полосу.",
          ] },
          { h: "Идентификация и пропускная способность", p: [
            "Способ идентификации диктуется потоком. Карты и брелоки дёшевы и привычны, но утренняя волна упирается в «достань карту из сумки». Распознавание лица пропускает на ходу — терминал узнаёт сотрудника за доли секунды, руки свободны. QR-коды удобны разовым посетителям: пропуск приходит на телефон ещё до визита.",
            "Считайте пиковую нагрузку честно: если смена в 500 человек заходит за 20 минут, нужны несколько полос или быстрая биометрия, иначе очередь на улице гарантирована. Мы моделируем поток при подборе и говорим прямо, сколько полос нужно вашей проходной.",
          ] },
          { h: "Что кроме турникета входит в проходную", p: [
            "Сам турникет — половина сметы. К нему нужны считыватели с двух сторон, контроллер СКУД, блок питания с резервом, ограждения, формирующие коридор, и обязательная распашная калитка — для маломобильных посетителей, габаритных грузов и эвакуации. При пожарной тревоге турникеты должны разблокироваться автоматически — это требование норм, и связка с пожарной сигнализацией закладывается в проект.",
            "Интеграции превращают проходную в источник данных: связка с учётом рабочего времени отдаёт табель в 1С, с видеонаблюдением — привязывает каждый проход к записи, антипассбэк не пускает второго человека по тому же пропуску.",
          ] },
          { h: "Стоимость и внедрение", p: [
            "Бюджет зависит от типа: трипод — самый доступный, спидгейт — в разы дороже за счёт механики и стекла, роторный — между ними в зависимости от исполнения. Прибавьте монтаж с анкеровкой в пол, пусконаладку и настройку прав. Уличное исполнение с подогревом — отдельная строка для КПП без павильона.",
            "Мы ставим турникеты ZKTeco и Hikvision со склада в Ташкенте: выезд, подбор под поток и дизайн, монтаж за один-два дня, интеграция со СКУД и учётом времени, гарантия и обслуживание по всему Узбекистану. Расчёт проходной — бесплатно.",
          ] },
        ],
        faq: [
          { q: "Какой турникет поставить в офис на 50 сотрудников?", a: "Обычно хватает одного трипода с распознаванием лица или картами плюс калитка. Такой комплект держит утренний поток без очередей и закрывает учёт времени." },
          { q: "Что делать с посетителями и курьерами?", a: "Разовые QR-пропуска на телефон, кнопка вызова на ресепшен или проход через калитку под контролем охраны. Гостевые сценарии настраиваются в СКУД без раздачи «лишних» карт." },
          { q: "Можно ли обойти трипод и как с этим бороться?", a: "Перепрыгнуть трипод физически можно. Там, где это критично, ставят датчики перелаза с тревогой, камеру на проходную или полноростовый роторный турникет — он исключает обход конструктивно." },
          { q: "Как проходная работает при пожаре?", a: "По сигналу пожарной сигнализации турникеты разблокируются, штанги триподов складываются (антипаника), калитки открываются. Эта связка обязательна и проверяется при сдаче объекта." },
        ],
      },
      uz: {
        title: "Turniketni qanday tanlash: tripod, rotorli yoki spidgeyt",
        excerpt: "Turniket turlarini vazifalarga qarab ko'rib chiqamiz: qayerda tripod yetadi, qachon to'liq bo'yli rotorli kerak, biznes-markazlarga spidgeytlar nega — va prohodnaya narxi aslida nimadan yig'iladi.",
        sections: [
          { h: "Turniket turi — u nimaning oldini olishi kerakligidan", p: [
            "Tripod — uch aylanadigan shtanga — ofislar va kichik korxonalar prohodnayalari uchun eng keng tarqalgan va arzon turniket. U oqimni «bittadan» intizomga soladi va o'tishlarni yaxshi sanaydi, lekin ustidan sakrash jismonan mumkin — tripod yonida qo'riq yoki konserj bor joyda ishlaydi.",
            "To'liq bo'yli rotorli turniket o'tishni jismonan istisno qiladi: konstruksiya odam bo'yi, oshib o'tib bo'lmaydi. Uning joyi — zavod perimetrlari, qurilish maydonchalari, stadionlar, doimiy qo'riqsiz uzoq prohodnayalar. Spidgeytlar — shisha tavaqali tezkor kalitkalar — biznes-markazlar va qabulxonalar tanlovi: chiroyli, tez, polosaga daqiqasiga 30 kishigacha oqim.",
          ] },
          { h: "Identifikatsiya va o'tkazish qobiliyati", p: [
            "Identifikatsiya usulini oqim belgilaydi. Karta va breloklar arzon va odatiy, lekin ertalabki to'lqin «kartani sumkadan ol»ga qadaladi. Yuzni tanish yurib ketayotganda o'tkazadi — terminal xodimni soniya ulushida taniydi, qo'llar bo'sh. QR-kodlar bir martalik mehmonlarga qulay: ruxsatnoma tashrifdan oldin telefonga keladi.",
            "Cho'qqi yukni halol hisoblang: 500 kishilik smena 20 daqiqada kirsa, bir necha polosa yoki tez biometriya kerak, aks holda ko'chada navbat kafolatlangan. Tanlovda oqimni modellashtiramiz va prohodnayangizga nechta polosa kerakligini to'g'ri aytamiz.",
          ] },
          { h: "Prohodnayaga turniketdan tashqari nima kiradi", p: [
            "Turniketning o'zi — smetaning yarmi. Unga ikki tomondan o'qigichlar, SKUD kontrolleri, zaxirali quvvat bloki, koridor hosil qiluvchi to'siqlar va majburiy tavaqali kalitka kerak — imkoniyati cheklanganlar, katta yuklar va evakuatsiya uchun. Yong'in trevogasida turniketlar avtomatik ochilishi shart — bu me'yor talabi, yong'in signalizatsiyasi bilan bog'lanish loyihaga kiritiladi.",
            "Integratsiyalar prohodnayani ma'lumot manbaiga aylantiradi: ish vaqti hisobi bilan bog'lanish tabelni 1C ga beradi, videokuzatuv bilan — har o'tishni yozuvga bog'laydi, antipassbek o'sha ruxsatnoma bilan ikkinchi odamni kiritmaydi.",
          ] },
          { h: "Narx va joriy etish", p: [
            "Byudjet turga bog'liq: tripod — eng arzon, spidgeyt mexanika va shisha hisobiga bir necha barobar qimmat, rotorli — bajarilishiga qarab ular orasida. Polga ankerlash bilan montaj, ishga tushirish va huquqlarni sozlashni qo'shing. Isitishli ko'cha bajarilishi — pavilonsiz KPP uchun alohida qator.",
            "Toshkentdagi ombordan ZKTeco va Hikvision turniketlarini o'rnatamiz: chiqish, oqim va dizaynga tanlash, bir-ikki kunda montaj, SKUD va vaqt hisobi bilan integratsiya, kafolat va xizmat butun O'zbekiston bo'ylab. Prohodnaya hisobi — bepul.",
          ] },
        ],
        faq: [
          { q: "50 xodimli ofisga qanday turniket qo'yish kerak?", a: "Odatda yuzni tanish yoki kartali bitta tripod plyus kalitka yetadi. Bunday to'plam ertalabki oqimni navbatsiz ushlaydi va vaqt hisobini yopadi." },
          { q: "Mehmonlar va kuryerlar bilan nima qilish kerak?", a: "Telefonga bir martalik QR-ruxsatnomalar, resepshenga chaqiruv tugmasi yoki qo'riq nazoratida kalitkadan o'tish. Mehmon stsenariylari «ortiqcha» kartalar tarqatmasdan SKUDda sozlanadi." },
          { q: "Tripodni aylanib o'tish mumkinmi va bunga qarshi nima qilish kerak?", a: "Tripod ustidan sakrash jismonan mumkin. Bu kritik joylarda trevogali oshib o'tish datchiklari, prohodnayaga kamera yoki to'liq bo'yli rotorli turniket qo'yiladi — u aylanib o'tishni konstruktiv istisno qiladi." },
          { q: "Yong'inda prohodnaya qanday ishlaydi?", a: "Yong'in signalizatsiyasi signali bo'yicha turniketlar ochiladi, tripod shtangalari yig'iladi (antipanika), kalitkalar ochiladi. Bu bog'lanish majburiy va obyekt topshirishda tekshiriladi." },
        ],
      },
      en: {
        title: "How to Choose a Turnstile: Tripod, Full-Height or Speed Gate",
        excerpt: "Turnstile types by task: where a tripod suffices, when a full-height rotor is needed, why business centers pick speed gates — and what the entrance actually costs beyond the turnstile itself.",
        sections: [
          { h: "The type follows what it must prevent", p: [
            "The tripod — three rotating arms — is the most common and affordable turnstile for offices and small factory entrances. It disciplines the flow to one-by-one and counts passages well, but jumping over it is physically possible — a tripod works where a guard or a concierge is nearby.",
            "A full-height rotor turnstile rules passage out physically: a person-height structure that cannot be climbed. Its place is factory perimeters, construction sites, stadiums and remote checkpoints without permanent guards. Speed gates — fast lanes with glass wings — are the choice of business centers and lobbies: elegant, quick, up to 30 people per minute per lane.",
          ] },
          { h: "Identification and throughput", p: [
            "The flow dictates the identification method. Cards and fobs are cheap and familiar, but the morning wave stalls on \"dig the card out of the bag\". Facial recognition passes people on the move — the terminal recognises an employee in a fraction of a second, hands free. QR codes suit one-time visitors: the pass arrives on the phone before the visit.",
            "Count the peak honestly: if a 500-person shift enters in 20 minutes, you need several lanes or fast biometrics, otherwise a queue outside is guaranteed. We model the flow during selection and say plainly how many lanes your entrance needs.",
          ] },
          { h: "What the entrance includes beyond the turnstile", p: [
            "The turnstile itself is half the estimate. It needs readers on both sides, an access controller, backed-up power, railings to form the corridor, and a mandatory swing gate — for wheelchair users, bulky loads and evacuation. On a fire alarm the turnstiles must unlock automatically — a code requirement, so the link to the fire alarm goes into the design.",
            "Integrations turn the entrance into a data source: the attendance link sends the timesheet to the ERP, the CCTV link ties every passage to footage, and anti-passback stops a second person on the same pass.",
          ] },
          { h: "Cost and rollout", p: [
            "The budget depends on the type: a tripod is the most affordable; a speed gate costs severalfold more for its mechanics and glass; a rotor sits between, depending on the build. Add installation with floor anchoring, commissioning and rights configuration. An outdoor version with heating is a separate line for gate posts without a pavilion.",
            "We install ZKTeco and Hikvision turnstiles from Tashkent stock: survey, selection for flow and design, installation in one or two days, integration with access control and attendance, warranty and service across Uzbekistan. The entrance calculation is free.",
          ] },
        ],
        faq: [
          { q: "Which turnstile for a 50-person office?", a: "Usually one tripod with facial recognition or cards plus a gate. That kit holds the morning flow without queues and covers time tracking." },
          { q: "What about visitors and couriers?", a: "One-time QR passes to the phone, a call button to reception, or passage through the gate under the guard's control. Guest scenarios are configured in the access system without handing out spare cards." },
          { q: "Can a tripod be bypassed, and what helps?", a: "Jumping a tripod is physically possible. Where that matters, climb-over sensors with an alarm, a camera on the entrance, or a full-height rotor turnstile — which rules out bypass by design — solve it." },
          { q: "How does the entrance behave in a fire?", a: "On the fire alarm signal turnstiles unlock, tripod arms drop (anti-panic), gates open. This link is mandatory and is checked at handover." },
        ],
      },
      tr: {
        title: "Turnike Nasıl Seçilir: Tripod, Boy Turnikesi veya Speed Gate",
        excerpt: "Görevlere göre turnike türleri: tripod nerede yeter, boy turnikesi ne zaman gerekir, iş merkezleri neden speed gate seçer — ve girişin gerçek maliyeti turnikenin ötesinde nelerden oluşur.",
        sections: [
          { h: "Tür, neyi önleyeceğine göre seçilir", p: [
            "Tripod — üç döner kol — ofisler ve küçük fabrika girişleri için en yaygın ve ekonomik turnikedir. Akışı teker teker düzenler ve geçişleri iyi sayar, ama üzerinden atlamak fiziken mümkündür — tripod, yakında güvenlik veya danışma olan yerde çalışır.",
            "Boy turnikesi geçişi fiziken dışlar: insan boyunda yapı, üzerinden aşılamaz. Yeri fabrika çevreleri, şantiyeler, stadyumlar ve sürekli görevlisi olmayan uzak girişlerdir. Speed gate'ler — cam kanatlı hızlı geçitler — iş merkezleri ve lobilerin seçimidir: şık, hızlı, şerit başına dakikada 30 kişiye kadar.",
          ] },
          { h: "Kimlik doğrulama ve geçiş kapasitesi", p: [
            "Yöntemi akış belirler. Kart ve anahtarlık ucuz ve alışıldıktır ama sabah dalgası «kartı çantadan çıkar»da tıkanır. Yüz tanıma yürürken geçirir — terminal çalışanı saniyenin kesrinde tanır, eller serbest. QR kod tek seferlik ziyaretçiye uygundur: kart, ziyaretten önce telefona gelir.",
            "Zirveyi dürüst sayın: 500 kişilik vardiya 20 dakikada giriyorsa birkaç şerit veya hızlı biyometri gerekir; yoksa dışarıda kuyruk garantidir. Seçimde akışı modeller ve girişinize kaç şerit gerektiğini açıkça söyleriz.",
          ] },
          { h: "Girişte turnikeden başka ne var", p: [
            "Turnikenin kendisi teklifin yarısıdır. İki yönde okuyucular, geçiş kontrolörü, yedekli güç, koridoru oluşturan korkuluklar ve zorunlu çarpma kapısı gerekir — tekerlekli sandalye, hacimli yük ve tahliye için. Yangın alarmında turnikeler otomatik açılmalıdır — norm gereğidir; yangın alarmı bağlantısı projeye konur.",
            "Entegrasyonlar girişi veri kaynağına çevirir: mesai bağlantısı puantajı ERP'ye yollar, kamera bağlantısı her geçişi görüntüye bağlar, anti-passback aynı kartla ikinci kişiyi durdurur.",
          ] },
          { h: "Maliyet ve kurulum", p: [
            "Bütçe türe bağlıdır: tripod en ekonomik; speed gate mekanik ve cam nedeniyle kat kat pahalı; rotor yapıya göre arada. Zemine ankrajlı montajı, devreye almayı ve yetki ayarını ekleyin. Isıtmalı dış mekân modeli, kulübesiz kontrol noktaları için ayrı kalemdir.",
            "Taşkent stoğundan ZKTeco ve Hikvision turnikeleri kurarız: keşif, akışa ve tasarıma göre seçim, bir-iki günde montaj, geçiş kontrolü ve mesaiyle entegrasyon, tüm Özbekistan'da garanti ve servis. Giriş hesabı ücretsizdir.",
          ] },
        ],
        faq: [
          { q: "50 kişilik ofise hangi turnike?", a: "Genelde yüz tanımalı veya kartlı tek tripod artı kapı yeter. Bu set sabah akışını kuyruksuz taşır ve mesai takibini kapatır." },
          { q: "Ziyaretçiler ve kuryeler ne olacak?", a: "Telefona tek seferlik QR kart, resepsiyona çağrı butonu veya güvenlik gözetiminde kapıdan geçiş. Misafir senaryoları fazladan kart dağıtmadan sistemde kurulur." },
          { q: "Tripod atlanabilir mi, çare ne?", a: "Tripodu atlamak fiziken mümkün. Kritikse alarmlı tırmanma sensörleri, girişe kamera veya boy turnikesi konur — o, atlatmayı yapısal olarak dışlar." },
          { q: "Yangında giriş nasıl davranır?", a: "Yangın alarmı sinyaliyle turnikeler açılır, tripod kolları düşer (anti-panik), kapılar açılır. Bu bağlantı zorunludur ve teslimde denetlenir." },
        ],
      },
      zh: {
        title: "怎么选闸机：三辊闸、全高转闸还是速通门",
        excerpt: "按任务拆解闸机类型：哪里三辊闸就够，什么时候需要全高转闸，商务中心为什么选速通门——以及通道的真实造价除了闸机还有什么。",
        sections: [
          { h: "类型取决于要防住什么", p: [
            "三辊闸——三根旋转杆——是办公室和小型厂区门岗最常见、最实惠的闸机。它把人流约束成一人一杆并准确计数，但翻越在物理上可行——三辊闸适合旁边有保安或前台的场合。",
            "全高转闸从物理上杜绝通行：一人高的笼式结构，翻不过去。它的位置是工厂周界、工地、体育场和无人常驻的远端门岗。速通门——玻璃摆翼的快速通道——是商务中心和大堂的选择：美观、快速，单通道每分钟最多30人。",
          ] },
          { h: "识别方式与通行能力", p: [
            "识别方式由人流决定。卡和钥匙扣便宜又熟悉，但早高峰会卡在「从包里掏卡」上。人脸识别边走边过——终端瞬间认出员工，双手空闲。二维码适合一次性访客：通行证在到访前就发到手机。",
            "峰值要诚实计算：500人的班次要在20分钟内进场，就需要多条通道或快速生物识别，否则门外排队是必然。选型时我们会做人流模拟，直接告诉您的门岗需要几条通道。",
          ] },
          { h: "通道里除了闸机还有什么", p: [
            "闸机本身只占预算一半。还需要两侧读卡器、门禁控制器、带备份的电源、构成通道的护栏，以及必配的平开边门——供轮椅、大件货物和疏散使用。火灾报警时闸机必须自动释放——这是规范要求，与火灾报警的联动要写进设计。",
            "联动让门岗变成数据来源：接考勤后考勤表进入ERP，接视频后每次通行绑定录像，防尾随功能拦住用同一凭证的第二个人。",
          ] },
          { h: "费用与实施", p: [
            "预算取决于类型：三辊闸最实惠；速通门因机械结构和玻璃贵出数倍；全高转闸按配置介于两者之间。再加地面锚固安装、调试和权限配置。带加热的室外型是无岗亭卡口的单列项目。",
            "我们安装塔什干现货的中控智慧（ZKTeco）和海康威视闸机：勘测、按人流和装修风格选型、一至两天安装、对接门禁和考勤，质保和维保覆盖全乌兹别克斯坦。通道方案免费测算。",
          ] },
        ],
        faq: [
          { q: "50人的办公室装什么闸机？", a: "通常一台人脸或刷卡的三辊闸加一扇边门即可。这套配置扛得住早高峰不排队，还顺带解决考勤。" },
          { q: "访客和快递怎么办？", a: "发到手机的一次性二维码、呼叫前台的按钮，或在保安监督下走边门。访客场景在门禁系统里配置，无需散发多余卡片。" },
          { q: "三辊闸能被绕过吗，怎么防？", a: "翻越三辊闸物理上可行。在意这一点的场合装带报警的翻越探测、通道摄像机，或直接上全高转闸——它从结构上杜绝绕行。" },
          { q: "火灾时通道怎么工作？", a: "收到火灾报警信号后闸机释放，三辊闸落杆（防恐慌），边门打开。这一联动是强制项，交付验收时会检查。" },
        ],
      },
    },
  },
  {
    slug: "shlagbaum-anpr",
    date: "2026-07-17",
    related: ["barrier", "anpr", "gates"],
    hubs: ["turnikety-i-shlagbaumy", "ip-kamery"],
    loc: {
      ru: {
        title: "Шлагбаум с распознаванием номеров: как это работает",
        excerpt: "Как ANPR-камера открывает шлагбаум своим и не пускает чужих, из чего состоит комплект въезда, что настроить для жильцов и гостей — и почему точность распознавания решается монтажом, а не ценой камеры.",
        sections: [
          { h: "Как устроен автоматический въезд", p: [
            "Схема проста: ANPR-камера читает номер подъезжающей машины, контроллер сверяет его со списками и, если номер в белом списке, открывает шлагбаум — водитель проезжает, не открывая окна и не доставая пульт. Проезд фиксируется в журнале со снимком: кто, когда, на какой машине.",
            "Пульты и брелоки при этом никуда не деваются — они остаются резервным способом на случай грязного номера или гостевой машины. Но основной поток идёт «по номеру», и очередь на въезде исчезает: машина не останавливается вовсе.",
          ] },
          { h: "Состав комплекта", p: [
            "Минимальный въезд: шлагбаум с интенсивным приводом, ANPR-камера, контроллер со списками, фотоэлементы и петлевой детектор — чтобы стрела не опустилась на автомобиль. Для двора жилого дома этого достаточно. Дальше комплект растёт по задачам: вызывная панель для гостей, светофор на узком проезде, вторая камера на выезд, если журнал должен видеть обе стороны.",
            "Шлагбаум подбирается по ширине проезда и интенсивности: для ЖК и бизнес-центра нужен привод, рассчитанный на тысячи циклов в сутки и работу в мороз и жару. Бытовая модель на интенсивном въезде живёт один сезон — это самая частая ошибка экономии.",
          ] },
          { h: "Списки и сценарии: жильцы, гости, должники", p: [
            "Белый список открывает шлагбаум своим автоматически. Для ЖК настраиваются лимиты машин на квартиру и гостевые часы; для бизнес-центра — зоны арендаторов; для предприятия — окна для грузовиков поставщиков. Гость заезжает по звонку охране, разовой заявке из приложения или QR-коду.",
            "Чёрный список работает наоборот: нежелательная машина не проедет, а охрана получит уведомление. Для платных парковок добавляется тарификация: время въезда фиксировано, должник не выедет, пока не оплатит — касса самообслуживания или QR-оплата закрывают вопрос без кассира.",
          ] },
          { h: "Точность распознавания — вопрос монтажа", p: [
            "Камера с честными 99 % распознавания легко превращается в 80 % кривым монтажом: слишком острый угол к полосе, встречный свет фар, номер перекрывается соседней машиной. Мы ставим камеру под правильным углом и на правильной высоте, с ИК-подсветкой для ночи — и проверяем на реальном потоке, включая грязные и транзитные номера.",
            "Комплекты Hikvision и Dahua со склада в Ташкенте, монтаж въезда за один-два дня, настройка списков и обучение охраны: добавлять и удалять номера вы будете сами. Гарантия и обслуживание по всему Узбекистану; выезд и расчёт бесплатны.",
          ] },
        ],
        faq: [
          { q: "Что будет, если номер грязный или не читается?", a: "Работают резервные способы: пульт, звонок охране, вызывная панель. Хорошо смонтированная система читает и загрязнённые номера — критичен угол установки и подсветка." },
          { q: "Можно ли добавить ANPR к уже стоящему шлагбауму?", a: "Да, чаще всего достаточно камеры и контроллера: существующий привод остаётся. Приезжаем, смотрим модель шлагбаума и геометрию въезда, называем состав и цену." },
          { q: "Как заезжают гости и такси?", a: "По звонку охране, по разовой заявке жильца из приложения или QR-коду. Для ЖК настраиваются гостевые часы и лимиты — правила определяет управляющая компания." },
          { q: "Пишется ли журнал въездов и где он хранится?", a: "Каждый проезд фиксируется со снимком, датой и номером. Журнал хранится локально на регистраторе или сервере объекта; глубина архива настраивается под ваши требования." },
        ],
      },
      uz: {
        title: "Raqam taniydigan shlagbaum: bu qanday ishlaydi",
        excerpt: "ANPR-kamera shlagbaumni o'zinikilarga qanday ochadi va begonalarni kiritmaydi, kirish to'plami nimadan iborat, aholi va mehmonlar uchun nimani sozlash kerak — va nega tanish aniqligi kamera narxi bilan emas, montaj bilan hal bo'ladi.",
        sections: [
          { h: "Avtomatik kirish qanday tuzilgan", p: [
            "Sxema oddiy: ANPR-kamera yaqinlashayotgan mashina raqamini o'qiydi, kontroller uni ro'yxatlar bilan solishtiradi va raqam oq ro'yxatda bo'lsa shlagbaumni ochadi — haydovchi oynani ochmasdan va pult olmasdan o'tadi. O'tish surat bilan jurnalga yoziladi: kim, qachon, qaysi mashinada.",
            "Pult va breloklar hech qayerga ketmaydi — ular iflos raqam yoki mehmon mashinasi uchun zaxira usul bo'lib qoladi. Lekin asosiy oqim «raqam bo'yicha» boradi va kirishdagi navbat yo'qoladi: mashina umuman to'xtamaydi.",
          ] },
          { h: "To'plam tarkibi", p: [
            "Minimal kirish: intensiv privodli shlagbaum, ANPR-kamera, ro'yxatli kontroller, fotoelementlar va petlevoy detektor — strela mashinaga tushmasligi uchun. Turar-joy hovlisiga shu yetadi. Keyin to'plam vazifalarga qarab o'sadi: mehmonlarga chaqiruv paneli, tor o'tish joyiga svetofor, jurnal ikki tomonni ko'rishi kerak bo'lsa chiqishga ikkinchi kamera.",
            "Shlagbaum o'tish kengligi va intensivligiga tanlanadi: TJM va biznes-markazga kuniga minglab siklga hamda sovuq va issiqda ishlashga mo'ljallangan privod kerak. Intensiv kirishdagi maishiy model bir mavsum yashaydi — bu tejashning eng ko'p uchraydigan xatosi.",
          ] },
          { h: "Ro'yxatlar va stsenariylar: aholi, mehmonlar, qarzdorlar", p: [
            "Oq ro'yxat shlagbaumni o'zinikilarga avtomatik ochadi. TJM uchun kvartiraga mashina limitlari va mehmon soatlari sozlanadi; biznes-markazga — ijarachi zonalari; korxonaga — yetkazuvchi yuk mashinalari oynalari. Mehmon qo'riqqa qo'ng'iroq, ilovadan bir martalik ariza yoki QR-kod bilan kiradi.",
            "Qora ro'yxat teskari ishlaydi: nomaqbul mashina o'tmaydi, qo'riq xabar oladi. Pullik parkinglarga tarifikatsiya qo'shiladi: kirish vaqti qayd etilgan, qarzdor to'lamaguncha chiqmaydi — o'z-o'ziga xizmat kassasi yoki QR-to'lov masalani kassirsiz yopadi.",
          ] },
          { h: "Tanish aniqligi — montaj masalasi", p: [
            "Halol 99 % taniydigan kamera qiyshiq montaj bilan osongina 80 % ga aylanadi: polosaga o'ta o'tkir burchak, qarshi fara nuri, raqamni qo'shni mashina to'sib qo'yishi. Kamerani to'g'ri burchak va balandlikka, kecha uchun IK-yoritish bilan o'rnatamiz — va real oqimda tekshiramiz, iflos va tranzit raqamlar bilan birga.",
            "Toshkentdagi ombordan Hikvision va Dahua to'plamlari, kirish montaji bir-ikki kun, ro'yxatlarni sozlash va qo'riqni o'rgatish: raqam qo'shish va o'chirishni o'zingiz qilasiz. Kafolat va xizmat butun O'zbekiston bo'ylab; chiqish va hisob bepul.",
          ] },
        ],
        faq: [
          { q: "Raqam iflos yoki o'qilmasa nima bo'ladi?", a: "Zaxira usullar ishlaydi: pult, qo'riqqa qo'ng'iroq, chaqiruv paneli. Yaxshi montaj qilingan tizim iflos raqamlarni ham o'qiydi — o'rnatish burchagi va yoritish kritik." },
          { q: "Turgan shlagbaumga ANPR qo'shsa bo'ladimi?", a: "Ha, ko'pincha kamera va kontroller yetadi: mavjud privod qoladi. Kelamiz, shlagbaum modeli va kirish geometriyasini ko'ramiz, tarkib va narxni aytamiz." },
          { q: "Mehmonlar va taksi qanday kiradi?", a: "Qo'riqqa qo'ng'iroq, aholining ilovadan bir martalik arizasi yoki QR-kod bilan. TJM uchun mehmon soatlari va limitlar sozlanadi — qoidalarni boshqaruvchi kompaniya belgilaydi." },
          { q: "Kirishlar jurnali yoziladimi va qayerda saqlanadi?", a: "Har o'tish surat, sana va raqam bilan qayd etiladi. Jurnal obyekt registratori yoki serverida lokal saqlanadi; arxiv chuqurligi talablaringizga sozlanadi." },
        ],
      },
      en: {
        title: "A Barrier with Plate Recognition: How It Works",
        excerpt: "How an ANPR camera opens the barrier for residents and keeps strangers out, what an entrance kit consists of, what to configure for residents and guests — and why recognition accuracy is decided by installation, not camera price.",
        sections: [
          { h: "How an automatic entrance works", p: [
            "The scheme is simple: an ANPR camera reads the plate of the approaching car, the controller checks it against the lists, and if the plate is whitelisted, the barrier opens — the driver passes without opening a window or reaching for a remote. The passage is logged with a snapshot: who, when, in which car.",
            "Remotes and fobs do not disappear — they remain the backup for a dirty plate or a guest car. But the main flow goes \"by plate\", and the entrance queue vanishes: cars simply do not stop.",
          ] },
          { h: "What the kit consists of", p: [
            "A minimal entrance: a barrier with an intensive-duty drive, an ANPR camera, a controller with the lists, photocells and a loop detector — so the boom never drops onto a car. For a residential courtyard that is enough. The kit then grows by task: a call panel for guests, a traffic light on a narrow lane, a second camera on the exit if the log must see both directions.",
            "The barrier is chosen by lane width and duty: a residential complex or business center needs a drive rated for thousands of cycles a day and for frost and heat. A domestic model at an intensive entrance lives one season — the most common false economy.",
          ] },
          { h: "Lists and scenarios: residents, guests, debtors", p: [
            "The whitelist opens the barrier for residents automatically. Residential complexes get per-apartment car limits and guest hours; business centers get tenant zones; factories get delivery truck windows. A guest enters by a call to the guard, a one-time request from the app, or a QR code.",
            "The blacklist works in reverse: an unwanted car does not pass and the guard is notified. Paid parking adds tariffs: the entry time is fixed, and a debtor does not leave until payment — a self-service pay station or QR payment closes the matter without a cashier.",
          ] },
          { h: "Accuracy is an installation question", p: [
            "A camera with an honest 99 % recognition rate easily becomes 80 % through poor installation: too sharp an angle to the lane, oncoming headlights, a plate blocked by the next car. We mount the camera at the right angle and height, with IR for the night — and test on real traffic, dirty and transit plates included.",
            "Hikvision and Dahua kits from Tashkent stock, entrance installation in one or two days, list setup and guard training: you will add and remove plates yourself. Warranty and service across Uzbekistan; the survey and quote are free.",
          ] },
        ],
        faq: [
          { q: "What if the plate is dirty or unreadable?", a: "The backups work: a remote, a call to the guard, the call panel. A well-installed system reads even dirty plates — the mounting angle and illumination are what matter." },
          { q: "Can ANPR be added to an existing barrier?", a: "Yes — usually a camera and a controller are enough, the existing drive stays. We come, check the barrier model and entrance geometry, and name the configuration and price." },
          { q: "How do guests and taxis get in?", a: "By a call to the guard, a resident's one-time request from the app, or a QR code. Residential complexes configure guest hours and limits — the rules are set by the management company." },
          { q: "Is there an entry log and where is it stored?", a: "Every passage is recorded with a snapshot, date and plate. The log is stored locally on the site's recorder or server; archive depth is configured to your requirements." },
        ],
      },
      tr: {
        title: "Plaka Tanımalı Bariyer: Nasıl Çalışır",
        excerpt: "ANPR kamera bariyeri sakinlere nasıl açar ve yabancıları nasıl durdurur, giriş seti nelerden oluşur, sakinler ve misafirler için ne ayarlanır — ve tanıma doğruluğu neden kamera fiyatıyla değil montajla belirlenir.",
        sections: [
          { h: "Otomatik giriş nasıl kurulu", p: [
            "Şema basittir: ANPR kamera yaklaşan aracın plakasını okur, kontrolör listelerle karşılaştırır ve plaka beyaz listedeyse bariyer açılır — sürücü cam açmadan, kumandaya uzanmadan geçer. Geçiş fotoğrafla kayda girer: kim, ne zaman, hangi araçla.",
            "Kumandalar ve anahtarlıklar yok olmaz — kirli plaka veya misafir aracı için yedek yöntem olarak kalır. Ama ana akış «plakayla» gider ve giriş kuyruğu kaybolur: araç hiç durmaz.",
          ] },
          { h: "Set nelerden oluşur", p: [
            "Asgari giriş: yoğun kullanımlı motorlu bariyer, ANPR kamera, listeli kontrolör, fotoseller ve loop dedektörü — kol araca inmesin diye. Konut avlusuna bu yeter. Sonra set göreve göre büyür: misafirlere zil paneli, dar geçide trafik ışığı, kayıt iki yönü de görmeliyse çıkışa ikinci kamera.",
            "Bariyer, şerit genişliğine ve yoğunluğa göre seçilir: site ve iş merkezine günde binlerce çevrime, dona ve sıcağa dayanan motor gerekir. Yoğun girişteki ev tipi model bir sezon yaşar — en yaygın yanlış tasarruf budur.",
          ] },
          { h: "Listeler ve senaryolar: sakinler, misafirler, borçlular", p: [
            "Beyaz liste bariyeri sakinlere otomatik açar. Sitelerde daire başına araç limiti ve misafir saatleri; iş merkezlerinde kiracı bölgeleri; fabrikalarda tedarikçi kamyonu pencereleri ayarlanır. Misafir; güvenliği arayarak, uygulamadan tek seferlik taleple veya QR kodla girer.",
            "Kara liste tersine çalışır: istenmeyen araç geçmez, güvenlik bildirim alır. Ücretli otoparka tarife eklenir: giriş saati kayıtlıdır, borçlu ödemeden çıkamaz — self-servis kasa veya QR ödeme konuyu kasiyersiz kapatır.",
          ] },
          { h: "Doğruluk bir montaj sorusudur", p: [
            "Dürüst %99 tanıyan kamera, kötü montajla kolayca %80'e düşer: şeride fazla keskin açı, karşı far ışığı, yandaki araçça kapatılan plaka. Kamerayı doğru açı ve yüksekliğe, gece için IR ile monte eder ve gerçek trafikte test ederiz — kirli ve transit plakalar dahil.",
            "Taşkent stoğundan Hikvision ve Dahua setleri, giriş montajı bir-iki gün, liste ayarları ve güvenlik eğitimi: plakaları kendiniz ekleyip sileceksiniz. Tüm Özbekistan'da garanti ve servis; keşif ve teklif ücretsiz.",
          ] },
        ],
        faq: [
          { q: "Plaka kirliyse veya okunmuyorsa ne olur?", a: "Yedekler devrede: kumanda, güvenliği arama, zil paneli. İyi monte edilmiş sistem kirli plakayı da okur — montaj açısı ve aydınlatma belirleyicidir." },
          { q: "Mevcut bariyere ANPR eklenir mi?", a: "Evet — çoğu kez kamera ve kontrolör yeter, mevcut motor kalır. Gelir, bariyer modeline ve giriş geometrisine bakar, yapı ve fiyatı söyleriz." },
          { q: "Misafirler ve taksiler nasıl girer?", a: "Güvenliği arayarak, sakinin uygulamadan tek seferlik talebiyle veya QR kodla. Sitelerde misafir saatleri ve limitler ayarlanır — kuralları yönetim belirler." },
          { q: "Giriş kaydı tutulur mu, nerede saklanır?", a: "Her geçiş fotoğraf, tarih ve plakayla kaydedilir. Kayıt tesisin kayıt cihazında veya sunucusunda yerel tutulur; arşiv derinliği ihtiyacınıza göre ayarlanır." },
        ],
      },
      zh: {
        title: "带车牌识别的道闸：它如何工作",
        excerpt: "ANPR摄像机如何为业主抬杆、把陌生车辆拦在外面，入口套件由什么组成，业主和访客要配置什么——以及为什么识别率取决于安装而不是摄像机的价格。",
        sections: [
          { h: "自动入口的工作原理", p: [
            "原理很简单：ANPR摄像机读取驶近车辆的号牌，控制器与名单比对，号牌在白名单里就抬杆——司机不开窗、不掏遥控器直接通过。通行连同抓拍记入日志：谁、何时、开哪辆车。",
            "遥控器和钥匙扣并不会被淘汰——它们仍是号牌脏污或访客车辆时的备用方式。但主流量走「凭号牌」，入口排队就此消失：车辆根本无需停下。",
          ] },
          { h: "套件构成", p: [
            "最小配置：重载电机的道闸、ANPR摄像机、带名单的控制器、红外对射和地感线圈——闸杆永不砸车。住宅院落这些就够了。之后按需求扩展：给访客的对讲面板、窄车道的信号灯、需要记录双向时在出口加第二台摄像机。",
            "道闸按车道宽度和使用强度选型：小区和商务中心需要每天数千次循环、耐寒耐热的电机。家用型放在高强度入口只能撑一季——这是最常见的省错钱。",
          ] },
          { h: "名单与场景：业主、访客、欠费者", p: [
            "白名单自动为业主抬杆。小区可设每户车位限额和访客时段；商务中心分租户区域；工厂为供应商货车设通行时间窗。访客通过呼叫门卫、业主在应用里的一次性申请或二维码进入。",
            "黑名单反向工作：不受欢迎的车过不去，门卫同时收到提醒。收费停车场再加计费：入场时间已记录，欠费者缴清才能离场——自助缴费机或扫码支付无人值守解决。",
          ] },
          { h: "识别率是安装问题", p: [
            "标称99%识别率的摄像机，安装不当轻松跌到80%：对车道角度太斜、逆着车灯、号牌被邻车遮挡。我们把摄像机装在正确的角度和高度、配夜间红外——并用真实车流验证，包括脏污和外地号牌。",
            "海康威视和大华套件塔什干现货，入口一至两天装完，配置名单并培训门卫：添加、删除号牌您自己就能做。质保和维保覆盖全乌兹别克斯坦；勘测和报价免费。",
          ] },
        ],
        faq: [
          { q: "号牌脏了或读不出来怎么办？", a: "备用方式顶上：遥控器、呼叫门卫、对讲面板。安装到位的系统连脏号牌也能读——关键在安装角度和补光。" },
          { q: "已有的道闸能加装车牌识别吗？", a: "能——通常加一台摄像机和一个控制器就够，原有电机保留。我们上门看道闸型号和入口条件，给出配置和价格。" },
          { q: "访客和出租车怎么进？", a: "呼叫门卫、业主在应用里发一次性申请，或扫二维码。小区可配置访客时段和限额——规则由物业决定。" },
          { q: "有进出记录吗，存在哪里？", a: "每次通行都带抓拍、日期和号牌入档。日志存放在现场的录像机或服务器上；保存时长按您的要求配置。" },
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
        title: "Как выбрать охранную сигнализацию: проводная или беспроводная",
        excerpt: "Из чего состоит охранная система, когда беспроводная панель лучше проводной, какие датчики нужны квартире, магазину и складу — и что даёт вывод на пульт охраны против уведомлений на телефон.",
        sections: [
          { h: "Из чего состоит система", p: [
            "Ядро — приёмно-контрольная панель: она принимает сигналы датчиков, включает сирену и рассылает тревоги. Вокруг неё — датчики движения, открытия дверей и окон, разбития стекла, тревожная кнопка для персонала и сирены, внутренняя и уличная. Управление — с брелока, клавиатуры, карты или из приложения.",
            "Датчики подбираются под сценарий проникновения. Датчик открытия ловит дверь в момент взлома, объёмник контролирует комнату целиком, акустический реагирует на звон стекла до того, как кто-то влез. Для дома с котом или собакой берутся иммунные датчики — ложные тревоги отучают пользоваться системой быстрее всего.",
          ] },
          { h: "Проводная или беспроводная", p: [
            "Беспроводная панель — например, Hikvision AX PRO — ставится за один день без штробления: датчики на защищённом радиоканале живут от батареек годами и сами сообщают о разряде. Для квартир, готовых офисов и магазинов это стандартный выбор.",
            "Проводную систему закладывают на этапе стройки или ремонта: кабель в стенах надёжнее радиоканала, датчики не требуют батареек, а стоимость точки ниже. На больших складах и производствах чаще собирают гибрид: проводная база плюс радиодатчики там, куда кабель тянуть дорого.",
          ] },
          { h: "Телефон или пульт охраны", p: [
            "Уведомления на телефон бесплатны и мгновенны: постановка, снятие, тревога, разряд батареи. Но телефон может быть в беззвучном, а вы — в самолёте. Вывод на пульт охранного предприятия добавляет физическую реакцию: экипаж выезжает по тревоге круглосуточно, независимо от того, видели вы уведомление или нет.",
            "Рабочая схема для бизнеса — обе линии сразу: тревога уходит и владельцу, и на пульт. Мы настраиваем цепочку уведомлений по нарастающей — пуш, SMS, звонок, — чтобы тревога не потерялась в ночи.",
          ] },
          { h: "Что выбрать под ваш объект", p: [
            "Квартира: беспроводная панель, датчики на входную дверь и окна первого-последнего этажей, объёмник в коридоре. Магазин: плюс тревожная кнопка у кассы и акустические датчики на витрины. Склад и производство: гибридная система с периметральным контуром — датчики на ограждении и лучевые барьеры ловят нарушителя до подхода к зданию.",
            "Сигнализацию связываем с видеонаблюдением: сработка привязывается к записи, и вы видите картинку события ещё до звонка охране. Монтаж квартиры — день, магазина — один-два, склад считаем после бесплатного выезда. Оборудование со склада в Ташкенте, гарантия и обслуживание по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Сработает ли беспроводная система при отключении света?", a: "Да: панель держит встроенный аккумулятор, датчики работают от батареек, тревога уходит по GSM-каналу даже при обрыве интернета. Резерв питания — обязательная часть комплекта." },
          { q: "Как избежать ложных тревог из-за кота?", a: "Ставятся pet-иммунные датчики движения, игнорирующие животных до определённого веса, и правильно выбирается их высота и зона. Это решённая задача — ложных тревог быть не должно." },
          { q: "Можно ли поставить сигнализацию только на время отпуска?", a: "Система ставится постоянно, а используется по необходимости: уехали — поставили на охрану со смартфона. Беспроводной комплект при переезде снимается и переносится в новое жильё." },
          { q: "Что лучше для магазина — сигнализация или камеры?", a: "Это разные задачи: сигнализация мгновенно поднимает тревогу, камеры дают картину и доказательства. В связке сработка привязывается к видео — мы почти всегда рекомендуем обе системы, начиная с приоритетной по бюджету." },
        ],
      },
      uz: {
        title: "Qo'riqlash signalizatsiyasini qanday tanlash: simli yoki simsiz",
        excerpt: "Qo'riqlash tizimi nimadan iborat, simsiz panel qachon simlidan yaxshi, kvartira, do'kon va omborga qanday datchiklar kerak — va qo'riq pultiga ulanish telefon xabarlariga nisbatan nima beradi.",
        sections: [
          { h: "Tizim nimadan iborat", p: [
            "Yadro — qabul-nazorat paneli: u datchik signallarini qabul qiladi, sirenani yoqadi va trevogalarni tarqatadi. Uning atrofida — harakat, eshik-deraza ochilishi, oyna sinishi datchiklari, xodimlar uchun trevoga tugmasi hamda ichki va ko'cha sirenalari. Boshqaruv — brelok, klaviatura, karta yoki ilovadan.",
            "Datchiklar kirish stsenariysiga tanlanadi. Ochilish datchigi eshikni buzish paytida ushlaydi, hajmiy datchik xonani to'liq nazorat qiladi, akustik kimdir kirmasdan oldin oyna jarangiga javob beradi. Mushuk yoki itli uyga immun datchiklar olinadi — yolg'on trevogalar tizimdan foydalanishdan hammadan tez bezdiradi.",
          ] },
          { h: "Simli yoki simsiz", p: [
            "Simsiz panel — masalan, Hikvision AX PRO — shtroblashsiz bir kunda o'rnatiladi: himoyalangan radiokanaldagi datchiklar batareyadan yillab yashaydi va zaryad tugashini o'zi aytadi. Kvartira, tayyor ofis va do'konlarga bu standart tanlov.",
            "Simli tizim qurilish yoki ta'mir bosqichida yotqiziladi: devordagi kabel radiokanaldan ishonchliroq, datchiklar batareyka talab qilmaydi, nuqta narxi pastroq. Katta ombor va ishlab chiqarishda ko'proq gibrid yig'iladi: simli baza plyus kabel tortish qimmat joylarga radiodatchiklar.",
          ] },
          { h: "Telefon yoki qo'riq pulti", p: [
            "Telefonga xabarlar bepul va bir zumda: qo'yish, olish, trevoga, batareya zaryadi. Lekin telefon ovozsizda, siz esa samolyotda bo'lishingiz mumkin. Qo'riqlash korxonasi pultiga ulanish jismoniy javob qo'shadi: ekipaj xabarni ko'rgan-ko'rmaganingizdan qat'i nazar kecha-kunduz trevoga bo'yicha chiqadi.",
            "Biznes uchun ishlaydigan sxema — ikkala liniya birdan: trevoga ham egaga, ham pultga ketadi. Xabarlar zanjirini kuchayib boradigan qilib sozlaymiz — push, SMS, qo'ng'iroq — trevoga tunda yo'qolib qolmasligi uchun.",
          ] },
          { h: "Obyektingizga nimani tanlash", p: [
            "Kvartira: simsiz panel, kirish eshigi va birinchi-oxirgi qavat derazalariga datchiklar, koridorga hajmiy datchik. Do'kon: plyus kassa yonida trevoga tugmasi va vitrinalarga akustik datchiklar. Ombor va ishlab chiqarish: perimetr konturli gibrid tizim — to'siqdagi datchiklar va nurli barerlar buzg'unchini binoga yetmasdan ushlaydi.",
            "Signalizatsiyani videokuzatuv bilan bog'laymiz: ishga tushish yozuvga bog'lanadi va hodisa tasvirini qo'riqqa qo'ng'iroqdan oldin ko'rasiz. Kvartira montaji — bir kun, do'kon — bir-ikki, omborni bepul chiqishdan keyin hisoblaymiz. Uskuna Toshkentdagi ombordan, kafolat va xizmat butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "Svet o'chganda simsiz tizim ishlaydimi?", a: "Ha: panel ichki akkumulyator ushlaydi, datchiklar batareyadan ishlaydi, trevoga internet uzilganda ham GSM-kanal orqali ketadi. Quvvat zaxirasi — to'plamning majburiy qismi." },
          { q: "Mushuk tufayli yolg'on trevogalardan qanday qochish mumkin?", a: "Ma'lum vazngacha hayvonlarni e'tiborsiz qoldiradigan pet-immun harakat datchiklari qo'yiladi, balandlik va zona to'g'ri tanlanadi. Bu yechilgan masala — yolg'on trevoga bo'lmasligi kerak." },
          { q: "Signalizatsiyani faqat ta'til vaqtiga qo'ysa bo'ladimi?", a: "Tizim doimiy o'rnatiladi, kerak bo'lganda ishlatiladi: ketdingiz — smartfondan qo'riqlashga qo'ydingiz. Simsiz to'plam ko'chishda yechib olinib, yangi uyga ko'chiriladi." },
          { q: "Do'konga nima yaxshi — signalizatsiya yoki kameralar?", a: "Bular har xil vazifalar: signalizatsiya bir zumda trevoga ko'taradi, kameralar manzara va dalil beradi. Bog'lamda ishga tushish videoga bog'lanadi — deyarli doim ikkala tizimni tavsiya qilamiz, byudjet bo'yicha ustuvoridan boshlab." },
        ],
      },
      en: {
        title: "How to Choose a Burglar Alarm: Wired or Wireless",
        excerpt: "What a security system consists of, when a wireless panel beats a wired one, which sensors an apartment, a shop and a warehouse need — and what central monitoring adds over phone notifications.",
        sections: [
          { h: "What the system consists of", p: [
            "The core is the control panel: it receives sensor signals, sounds the siren and sends out alarms. Around it are motion sensors, door and window contacts, glass-break detectors, a panic button for staff, and indoor and outdoor sirens. Control is by fob, keypad, card or app.",
            "Sensors are chosen for the intrusion scenario. A contact catches the door at the moment of forcing, a motion detector covers the whole room, an acoustic sensor reacts to breaking glass before anyone climbs in. Homes with a cat or dog get pet-immune detectors — false alarms turn people off a system faster than anything.",
          ] },
          { h: "Wired or wireless", p: [
            "A wireless panel — Hikvision AX PRO, for example — installs in a day with no chasing: sensors on an encrypted radio link run on batteries for years and report low charge themselves. For apartments, finished offices and shops this is the standard choice.",
            "A wired system is laid during construction or renovation: cable in the walls is more robust than radio, sensors need no batteries, and the per-point cost is lower. Large warehouses and factories more often get a hybrid: a wired base plus radio sensors where pulling cable is expensive.",
          ] },
          { h: "Phone or monitoring station", p: [
            "Phone notifications are free and instant: arming, disarming, alarm, low battery. But the phone may be on silent and you may be on a plane. A monitoring company connection adds physical response: a crew rolls out on alarm around the clock, whether you saw the notification or not.",
            "The working scheme for a business is both lines at once: the alarm goes to the owner and to the station. We chain notifications in escalation — push, SMS, call — so an alarm cannot get lost in the night.",
          ] },
          { h: "What fits your site", p: [
            "An apartment: a wireless panel, contacts on the entrance door and the windows of the first and top floors, a motion detector in the hallway. A shop: plus a panic button at the till and acoustic sensors on the display windows. A warehouse or factory: a hybrid system with a perimeter loop — fence sensors and beam barriers catch the intruder before he reaches the building.",
            "We link the alarm to CCTV: an activation ties to footage, and you see the event before calling security. An apartment takes a day to install, a shop one or two; a warehouse is quoted after a free survey. Equipment from Tashkent stock, warranty and service across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "Does a wireless system work during a power cut?", a: "Yes: the panel has a built-in battery, sensors run on their own batteries, and the alarm goes out over GSM even if the internet is down. Backup power is a mandatory part of the kit." },
          { q: "How do we avoid false alarms from the cat?", a: "Pet-immune motion detectors ignore animals up to a set weight, and mounting height and zones are chosen properly. This is a solved problem — there should be no false alarms." },
          { q: "Can the alarm be used only during vacations?", a: "The system is installed permanently and used as needed: leaving — arm it from the smartphone. A wireless kit can be taken down and moved to a new home." },
          { q: "What is better for a shop — an alarm or cameras?", a: "Different jobs: the alarm raises the alert instantly, cameras give the picture and the evidence. Linked, an activation ties to video — we almost always recommend both, starting with whichever the budget prioritises." },
        ],
      },
      tr: {
        title: "Hırsız Alarmı Nasıl Seçilir: Kablolu mu Kablosuz mu",
        excerpt: "Alarm sistemi nelerden oluşur, kablosuz panel kabloludan ne zaman iyidir, daireye, mağazaya ve depoya hangi sensörler gerekir — ve izleme merkezi bağlantısı telefon bildirimine göre ne katar.",
        sections: [
          { h: "Sistem nelerden oluşur", p: [
            "Çekirdek, kontrol panelidir: sensör sinyallerini alır, sireni çalar ve alarmları dağıtır. Çevresinde hareket sensörleri, kapı-pencere kontakları, cam kırılma dedektörleri, personel için panik butonu ile iç ve dış sirenler vardır. Kontrol kumanda, tuş takımı, kart veya uygulamayladır.",
            "Sensörler giriş senaryosuna göre seçilir. Kontak, kapıyı zorlanma anında yakalar; hareket dedektörü odanın tamamını kapsar; akustik sensör biri içeri girmeden cam sesine tepki verir. Kedili köpekli evlere evcil hayvan bağışık dedektörler alınır — yanlış alarm, insanı sistemden her şeyden hızlı soğutur.",
          ] },
          { h: "Kablolu mu kablosuz mu", p: [
            "Kablosuz panel — örneğin Hikvision AX PRO — kırım olmadan bir günde kurulur: şifreli radyo bağlantısındaki sensörler pille yıllarca çalışır ve düşük şarjı kendileri bildirir. Daireler, bitmiş ofisler ve mağazalar için standart seçim budur.",
            "Kablolu sistem inşaat veya tadilatta döşenir: duvardaki kablo radyodan sağlamdır, sensörler pil istemez, nokta maliyeti düşüktür. Büyük depo ve fabrikalarda daha çok hibrit kurulur: kablolu taban artı kablo çekmenin pahalı olduğu yerlere telsiz sensörler.",
          ] },
          { h: "Telefon mu izleme merkezi mi", p: [
            "Telefon bildirimleri ücretsiz ve anlıktır: kurma, çözme, alarm, düşük pil. Ama telefon sessizde, siz uçakta olabilirsiniz. İzleme merkezi bağlantısı fiziksel müdahale ekler: bildirimi görseniz de görmeseniz de ekip 7/24 alarma çıkar.",
            "İşletme için çalışan şema ikisidir: alarm hem sahibine hem merkeze gider. Bildirimleri tırmanan zincirle kurarız — push, SMS, arama — alarm gecede kaybolmasın diye.",
          ] },
          { h: "Tesisinize ne uyar", p: [
            "Daire: kablosuz panel, giriş kapısına ve ilk-son kat pencerelerine kontaklar, koridora hareket dedektörü. Mağaza: artı kasada panik butonu ve vitrinlere akustik sensörler. Depo ve fabrika: çevre halkalı hibrit sistem — çit sensörleri ve ışın bariyerleri davetsizi binaya varmadan yakalar.",
            "Alarmı kameralara bağlarız: tetikleme görüntüye bağlanır, olayı güvenliği aramadan görürsünüz. Daire kurulumu bir gün, mağaza bir-iki; depo ücretsiz keşiften sonra fiyatlanır. Ekipman Taşkent stoğundan; tüm Özbekistan'da garanti ve servis.",
          ] },
        ],
        faq: [
          { q: "Elektrik kesintisinde kablosuz sistem çalışır mı?", a: "Evet: panelde dahili akü vardır, sensörler kendi pilleriyle çalışır, alarm internet kesik olsa da GSM üzerinden gider. Yedek güç setin zorunlu parçasıdır." },
          { q: "Kedi yüzünden yanlış alarm nasıl önlenir?", a: "Belirli ağırlığa dek hayvanı yok sayan bağışık dedektörler konur; yükseklik ve bölgeler doğru seçilir. Bu çözülmüş bir sorundur — yanlış alarm olmamalıdır." },
          { q: "Alarm yalnız tatilde kullanılabilir mi?", a: "Sistem kalıcı kurulur, gerektiğinde kullanılır: çıktınız — telefondan kurdunuz. Kablosuz set taşınırken sökülüp yeni eve taşınabilir." },
          { q: "Mağazaya hangisi iyi — alarm mı kameralar mı?", a: "Farklı işler: alarm anında haber verir, kameralar tabloyu ve kanıtı sunar. Bağlandığında tetikleme videoya bağlanır — neredeyse hep ikisini öneririz, bütçenin önceliklediğinden başlayarak." },
        ],
      },
      zh: {
        title: "防盗报警怎么选：有线还是无线",
        excerpt: "报警系统由什么组成，无线主机什么时候优于有线，公寓、商店和仓库各需要哪些传感器——以及接入联网中心比手机推送多了什么。",
        sections: [
          { h: "系统由什么组成", p: [
            "核心是报警主机：接收传感器信号、鸣响警笛、分发警情。围绕它的是移动传感器、门窗磁、玻璃破碎探测器、供员工用的紧急按钮，以及室内外警笛。控制方式有遥控、键盘、刷卡或手机应用。",
            "传感器按入侵场景选择。门磁在撬门瞬间报警，红外探测器覆盖整个房间，声学探测器在有人爬进来之前就对玻璃碎裂作出反应。养猫狗的家庭用防宠物探测器——误报比什么都更快让人弃用系统。",
          ] },
          { h: "有线还是无线", p: [
            "无线主机——例如海康威视 AX PRO——一天装好、无需开槽：加密无线信道上的传感器用电池能撑数年，电量不足自动上报。公寓、已装修办公室和商店的标准选择就是它。",
            "有线系统在建造或装修阶段敷设：墙里的线缆比无线更可靠，传感器不用换电池，单点成本更低。大型仓库和工厂更多用混合方案：有线为主，拉线太贵的位置用无线传感器。",
          ] },
          { h: "手机推送还是联网中心", p: [
            "手机通知免费且即时：布防、撤防、报警、低电量。但手机可能静音，您可能在飞机上。接入保安公司联网中心增加了实体处置：无论您是否看到通知，巡逻队全天候按警情出动。",
            "对企业行之有效的方案是两条线并用：警情同时发给业主和联网中心。我们把通知配成逐级升级的链条——推送、短信、电话——警报不会消失在深夜里。",
          ] },
          { h: "按您的场所怎么配", p: [
            "公寓：无线主机、入户门和首层顶层窗户装门磁、走廊装红外。商店：再加收银台紧急按钮和橱窗的声学探测器。仓库和工厂：带周界防线的混合系统——围栏传感器和对射光栅在入侵者接近建筑之前就发现他。",
            "报警与视频监控联动：触发即绑定录像，打电话给保安之前就能看到现场。公寓一天装完，商店一到两天，仓库免费勘测后报价。设备塔什干现货，质保和维保覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "停电时无线系统还能用吗？", a: "能：主机内置电池，传感器用自己的电池，断网时警情通过GSM通道照发。备用电源是套件的必备部分。" },
          { q: "怎么避免猫引起的误报？", a: "使用能忽略一定体重以下动物的防宠物探测器，并选对安装高度和探测区。这是已解决的问题——不应该有误报。" },
          { q: "能只在度假时用报警吗？", a: "系统常装常备，按需使用：出门时用手机一键布防。无线套装搬家时可拆下带到新居。" },
          { q: "商店装报警还是装摄像机好？", a: "两者任务不同：报警即时示警，摄像机提供画面和证据。联动后触发绑定录像——我们几乎总是建议两套都上，按预算先装优先级高的。" },
        ],
      },
    },
  },
  {
    slug: "avtomaticheskie-vorota-kak-vybrat",
    date: "2026-07-17",
    related: ["gates", "barrier"],
    hubs: ["turnikety-i-shlagbaumy"],
    loc: {
      ru: {
        title: "Автоматические ворота: откатные, распашные или секционные",
        excerpt: "Какой тип ворот выбрать под участок и гараж, как подобрать привод по весу и ветру, какая автоматика безопасности обязательна — и когда есть смысл автоматизировать уже стоящие ворота.",
        sections: [
          { h: "Тип ворот диктует участок", p: [
            "Откатные ворота уходят вдоль забора и не требуют места на распахивание — сугроб перед въездом им тоже не помеха. Расплата — нужен прямой участок забора в полторы ширины проёма под откат. Распашные проще и дешевле, но створкам нужно пространство, и зимой его придётся чистить.",
            "Секционные ворота — гаражное решение: полотно уходит под потолок, не занимая места ни перед гаражом, ни внутри. Роллетные наматываются в компактный короб и выручают там, где нет ни места вдоль забора, ни высоты под направляющие. Мы честно говорим на выезде, какой тип встанет на ваш проём без компромиссов.",
          ] },
          { h: "Привод: вес, ширина, ветер, интенсивность", p: [
            "Привод подбирается с запасом, а не «впритык». Для откатных считается масса полотна; для распашных — длина створки и парусность: сплошной профнастил ловит ветер, как парус, и слабый привод на широкой створке живёт один сезон. Отдельный параметр — интенсивность: домашнему въезду хватает бытового привода, воротам ЖК или предприятия нужен интенсивный, рассчитанный на сотни циклов в день.",
            "Зимний пакет — не маркетинг: плавный старт, чтобы автоматика не рвала примёрзшую створку, и смазка, работающая в мороз. Это настраивается при монтаже и продлевает жизнь механики на годы.",
          ] },
          { h: "Безопасность и управление", p: [
            "Обязательный минимум безопасности: фотоэлементы, останавливающие створку при препятствии, сигнальная лампа и регулировка усилия с реверсом — ворота не должны дожимать машину или человека. Ручная разблокировка на случай отключения света обязательна: вы откроете ворота ключом, не разбирая привод.",
            "Управление — по вашему сценарию: пульты, GSM-модуль для открытия бесплатным звонком, приложение, кнопка у охраны. Для предприятия и ЖК подключаем распознавание номеров: свои машины заезжают без остановки, гости по звонку, каждый въезд пишется со снимком.",
          ] },
          { h: "Автоматизация существующих ворот и цена", p: [
            "Стоящие ворота чаще всего можно автоматизировать без замены: привод, фотоэлементы и лампа ставятся за один день. Условие — исправная механика: ролики, петли и геометрия. Если створку клинит вручную, привод не вылечит, а добьёт — и мы честно скажем, что сначала ремонтировать.",
            "Цена складывается из типа ворот, класса привода и способа управления. Полный комплект с нуля дороже автоматизации готовых ворот в разы — но и живёт дольше при правильном подборе. Выезд и расчёт бесплатны; монтаж — один-три дня, гарантия на механику и работы, обслуживание по всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Можно ли автоматизировать старые распашные ворота?", a: "В большинстве случаев да: линейные приводы ставятся на створки за день. Главное условие — исправные петли и геометрия: если ворота клинит рукой, сначала ремонт, потом автоматика." },
          { q: "Что делать при отключении света?", a: "У каждого привода есть ручная разблокировка ключом — ворота открываются вручную. Для частого отключения ставим резервный аккумулятор: автоматика переживает несколько циклов без сети." },
          { q: "Какой привод нужен на ворота из профнастила шириной 4 метра?", a: "Сплошное полотно парусит, поэтому привод берётся с запасом по усилию и с учётом ветровой нагрузки региона. Точную модель подбираем по месту — на выезде замеряем и считаем бесплатно." },
          { q: "Ворота или шлагбаум — что выбрать для двора?", a: "Шлагбаум быстрее и дешевле, но закрывает только проезд машин. Ворота дают физическую защиту и приватность. Для ЖК часто ставят оба: шлагбаум днём, ворота на ночь." },
        ],
      },
      uz: {
        title: "Avtomatik darvozalar: surma, tavaqali yoki seksiyali",
        excerpt: "Uchastka va garajga qaysi darvoza turini tanlash, privodni og'irlik va shamolga qarab qanday olish, qanday xavfsizlik avtomatikasi majburiy — va turgan darvozani avtomatlashtirish qachon mantiqli.",
        sections: [
          { h: "Darvoza turini uchastka belgilaydi", p: [
            "Surma darvoza to'siq bo'ylab suriladi va ochilish joyini talab qilmaydi — kirish oldidagi qor uyumi ham unga to'siq emas. Evaziga — surilish uchun proyom kengligining bir yarmicha to'g'ri to'siq uchastkasi kerak. Tavaqalisi oddiyroq va arzonroq, lekin tavaqalarga joy kerak va qishda uni tozalashga to'g'ri keladi.",
            "Seksiyali darvoza — garaj yechimi: polotno ship ostiga ketadi, garaj oldida ham, ichida ham joy olmaydi. Rolletlisi ixcham qutiga o'raladi va to'siq bo'ylab joy ham, yo'naltiruvchilarga balandlik ham yo'q joyda qutqaradi. Chiqishda proyomingizga qaysi tur kompromissiz turishini halol aytamiz.",
          ] },
          { h: "Privod: og'irlik, kenglik, shamol, intensivlik", p: [
            "Privod «zo'rg'a» emas, zaxira bilan tanlanadi. Surma darvozaga polotno massasi hisoblanadi; tavaqaliga — tavaqa uzunligi va yelkanlik: yaxlit profnastil shamolni yelkandek tutadi, keng tavaqadagi kuchsiz privod bir mavsum yashaydi. Alohida parametr — intensivlik: uy kirishiga maishiy privod yetadi, TJM yoki korxona darvozasiga kuniga yuzlab siklga mo'ljallangan intensiv kerak.",
            "Qishki paket — marketing emas: avtomatika yopishib qolgan tavaqani yulmasligi uchun silliq start va sovuqda ishlaydigan moy. Bu montajda sozlanadi va mexanika umrini yillarga uzaytiradi.",
          ] },
          { h: "Xavfsizlik va boshqaruv", p: [
            "Xavfsizlikning majburiy minimumi: to'siq borida tavaqani to'xtatadigan fotoelementlar, signal chiroq va revers bilan kuch sozlamasi — darvoza mashina yoki odamni siqmasligi kerak. Svet o'chganda qo'lda ochish majburiy: privodni buzmasdan darvozani kalit bilan ochasiz.",
            "Boshqaruv — sizning stsenariyingiz bo'yicha: pultlar, bepul qo'ng'iroq bilan ochadigan GSM-modul, ilova, qo'riqdagi tugma. Korxona va TJM ga raqam tanishni ulaymiz: o'z mashinalar to'xtamasdan kiradi, mehmonlar qo'ng'iroq bilan, har kirish surat bilan yoziladi.",
          ] },
          { h: "Turgan darvozani avtomatlashtirish va narx", p: [
            "Turgan darvozani ko'pincha almashtirmasdan avtomatlashtirsa bo'ladi: privod, fotoelementlar va chiroq bir kunda o'rnatiladi. Shart — soz mexanika: roliklar, oshiq-moshiqlar va geometriya. Tavaqa qo'lda qisilsa, privod davolamaydi, o'ldiradi — avval nimani ta'mirlashni halol aytamiz.",
            "Narx darvoza turi, privod sinfi va boshqaruv usulidan yig'iladi. Noldan to'liq to'plam tayyor darvozani avtomatlashtirishdan bir necha barobar qimmat — lekin to'g'ri tanlovda uzoqroq ham yashaydi. Chiqish va hisob bepul; montaj — bir-uch kun, mexanika va ishlarga kafolat, xizmat butun O'zbekiston bo'ylab.",
          ] },
        ],
        faq: [
          { q: "Eski tavaqali darvozani avtomatlashtirsa bo'ladimi?", a: "Ko'p hollarda ha: chiziqli privodlar tavaqalarga bir kunda o'rnatiladi. Bosh shart — soz oshiq-moshiq va geometriya: darvoza qo'lda qisilsa, avval ta'mir, keyin avtomatika." },
          { q: "Svet o'chsa nima qilish kerak?", a: "Har privodda kalitli qo'lda ochish bor — darvoza qo'lda ochiladi. Tez-tez o'chadigan joyga zaxira akkumulyator qo'yamiz: avtomatika tarmoqsiz bir necha siklga chidaydi." },
          { q: "4 metrli profnastil darvozaga qanday privod kerak?", a: "Yaxlit polotno yelkan bo'ladi, shuning uchun privod kuch zaxirasi va hudud shamol yuki bilan olinadi. Aniq modelni joyida tanlaymiz — chiqishda o'lchab bepul hisoblaymiz." },
          { q: "Hovliga darvoza yoki shlagbaum — nimani tanlash?", a: "Shlagbaum tezroq va arzonroq, lekin faqat mashinalar o'tishini yopadi. Darvoza jismoniy himoya va maxfiylik beradi. TJM larda ko'pincha ikkalasi: kunduzi shlagbaum, kechasi darvoza." },
        ],
      },
      en: {
        title: "Automatic Gates: Sliding, Swing or Sectional",
        excerpt: "Which gate type fits your plot and garage, how to size the drive for weight and wind, which safety automation is mandatory — and when it makes sense to automate the gates you already have.",
        sections: [
          { h: "The plot dictates the gate type", p: [
            "Sliding gates travel along the fence and need no swing clearance — a snowdrift before the entrance does not bother them either. The price: a straight fence run of about one and a half opening widths for the travel. Swing gates are simpler and cheaper, but the leaves need space, and in winter that space needs clearing.",
            "Sectional doors are the garage answer: the panel goes up under the ceiling, taking no room in front or inside. Roller gates coil into a compact box and save the day where there is neither room along the fence nor height for tracks. At the survey we say honestly which type fits your opening without compromises.",
          ] },
          { h: "The drive: weight, width, wind, duty", p: [
            "The drive is sized with a margin, not \"just enough\". For sliding gates the panel mass matters; for swing gates, the leaf length and windage: solid profiled sheet catches wind like a sail, and a weak drive on a wide leaf lasts one season. Duty cycle is separate: a home entrance runs fine on a residential drive, while a housing estate or factory gate needs an intensive one rated for hundreds of cycles a day.",
            "The winter package is not marketing: a soft start so the drive does not tear a frozen leaf, and grease that works in frost. It is configured at installation and adds years to the mechanics.",
          ] },
          { h: "Safety and control", p: [
            "The mandatory safety minimum: photocells that stop the leaf at an obstacle, a warning lamp, and force adjustment with reverse — a gate must never squeeze a car or a person. Manual release for power cuts is obligatory: you open the gate with a key without dismantling the drive.",
            "Control follows your scenario: remotes, a GSM module that opens with a free call, an app, a guard's button. For enterprises and residential complexes we add plate recognition: company cars enter without stopping, guests by call, and every entry is logged with a snapshot.",
          ] },
          { h: "Automating existing gates, and the price", p: [
            "Existing gates can usually be automated without replacement: the drive, photocells and lamp go on in a day. The condition is sound mechanics: rollers, hinges and geometry. If the leaf jams by hand, a drive will not cure it but finish it off — and we will say honestly what to repair first.",
            "The price is built from the gate type, the drive class and the control method. A complete new set costs severalfold more than automating existing gates — and lasts longer when sized properly. The survey and quote are free; installation takes one to three days, with a warranty on mechanics and work, and service across Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "Can old swing gates be automated?", a: "In most cases yes: linear drives mount on the leaves in a day. The key condition is sound hinges and geometry: if the gate jams by hand, repair first, automation second." },
          { q: "What happens during a power cut?", a: "Every drive has a manual key release — the gate opens by hand. Where outages are frequent we add a backup battery: the automation survives several cycles without mains." },
          { q: "What drive suits a 4-meter profiled sheet gate?", a: "A solid panel acts as a sail, so the drive is taken with force margin and the region's wind load in mind. We pick the exact model on site — measured and quoted for free." },
          { q: "A gate or a barrier for a courtyard?", a: "A barrier is faster and cheaper but only controls vehicle passage. Gates give physical protection and privacy. Residential complexes often use both: the barrier by day, the gates at night." },
        ],
      },
      tr: {
        title: "Otomatik Kapılar: Yana Kayar, Çift Kanat veya Seksiyonel",
        excerpt: "Arsanıza ve garajınıza hangi kapı tipi uyar, motor ağırlığa ve rüzgâra göre nasıl seçilir, hangi güvenlik otomasyonu zorunludur — ve mevcut kapıyı otomatikleştirmek ne zaman mantıklıdır.",
        sections: [
          { h: "Kapı tipini arsa belirler", p: [
            "Yana kayar kapı çit boyunca kayar, açılma boşluğu istemez — giriş önündeki kar da engel değildir. Bedeli: kayma için açıklığın bir buçuk katı düz çit hattı. Çift kanat daha basit ve ucuzdur, ama kanatlara alan gerekir ve kışın o alan küreklenir.",
            "Seksiyonel kapı garaj çözümüdür: panel tavan altına toplanır, ne önde ne içeride yer kaplar. Rulo kapı kompakt kutuya sarılır; çit boyunca yer de ray için yükseklik de yoksa kurtarır. Keşifte açıklığınıza hangi tipin ödünsüz oturacağını dürüstçe söyleriz.",
          ] },
          { h: "Motor: ağırlık, genişlik, rüzgâr, yoğunluk", p: [
            "Motor «ucu ucuna» değil payla seçilir. Kayar kapıda panel kütlesi; çift kanatta kanat boyu ve yelken etkisi önemlidir: dolu trapez sac rüzgârı yelken gibi tutar, geniş kanatta zayıf motor bir sezon dayanır. Yoğunluk ayrı parametredir: ev girişine konut motoru yeter; site veya fabrika kapısına günde yüzlerce çevrimlik yoğun tip gerekir.",
            "Kış paketi pazarlama değildir: donmuş kanadı koparmasın diye yumuşak kalkış ve ayazda çalışan gres. Montajda ayarlanır ve mekaniğe yıllar ekler.",
          ] },
          { h: "Güvenlik ve kontrol", p: [
            "Zorunlu güvenlik asgarisi: engelde kanadı durduran fotoseller, uyarı lambası ve geri dönüşlü kuvvet ayarı — kapı asla araca veya insana yüklenmemelidir. Kesinti için manuel kurtarma şarttır: motoru sökmeden kapıyı anahtarla açarsınız.",
            "Kontrol sizin senaryonuza göre: kumandalar, ücretsiz aramayla açan GSM modülü, uygulama, güvenlikçi butonu. İşletme ve sitelere plaka tanıma ekleriz: kayıtlı araçlar durmadan girer, misafir aramayla; her giriş fotoğrafla kaydedilir.",
          ] },
          { h: "Mevcut kapının otomasyonu ve fiyat", p: [
            "Mevcut kapı çoğu kez değiştirilmeden otomatikleştirilir: motor, fotoseller ve lamba bir günde takılır. Şart, sağlam mekaniktir: makaralar, menteşeler ve geometri. Kanat elle zorlanıyorsa motor iyileştirmez, bitirir — önce neyin onarılacağını dürüstçe söyleriz.",
            "Fiyat; kapı tipi, motor sınıfı ve kontrol yönteminden oluşur. Sıfırdan komple set, mevcut kapının otomasyonundan kat kat pahalıdır — ama doğru seçimde daha uzun yaşar. Keşif ve teklif ücretsiz; montaj bir-üç gün, mekanik ve işçilik garantili, tüm Özbekistan'da servis.",
          ] },
        ],
        faq: [
          { q: "Eski çift kanat kapı otomatikleştirilebilir mi?", a: "Çoğu durumda evet: lineer motorlar kanatlara bir günde takılır. Ana şart sağlam menteşe ve geometri: kapı elle zorlanıyorsa önce onarım, sonra otomasyon." },
          { q: "Elektrik kesilince ne olur?", a: "Her motorda anahtarlı manuel kurtarma vardır — kapı elle açılır. Kesintinin sık olduğu yere yedek akü koyarız: otomasyon şebekesiz birkaç çevrim dayanır." },
          { q: "4 metrelik trapez sac kapıya hangi motor?", a: "Dolu panel yelken yapar; motor bu yüzden kuvvet payıyla ve bölgenin rüzgâr yüküne göre alınır. Kesin modeli yerinde seçeriz — ölçer, ücretsiz hesaplarız." },
          { q: "Avluya kapı mı bariyer mi?", a: "Bariyer hızlı ve ucuzdur ama yalnız araç geçişini kapatır. Kapı fiziksel koruma ve mahremiyet verir. Siteler çoğu kez ikisini kullanır: gündüz bariyer, gece kapı." },
        ],
      },
      zh: {
        title: "自动大门：平移、平开还是翻板",
        excerpt: "按场地和车库选门型，按重量和风载选电机，哪些安全装置是必配——以及什么时候值得给现有大门加装电机。",
        sections: [
          { h: "场地决定门型", p: [
            "平移门沿围墙滑行、不占开启空间——门前积雪也不碍事。代价是：需要约一倍半门洞宽度的直线围墙供门体滑行。平开门更简单便宜，但门扇需要空间，冬天还得给这块空间铲雪。",
            "翻板门是车库方案：门板收到顶棚下，门前门内都不占地。卷帘门卷进紧凑卷箱，在围墙边没空间、也没高度装轨道时是救星。勘测时我们会照实说哪种门型能不打折扣地装进您的门洞。",
          ] },
          { h: "电机：重量、宽度、风载、强度", p: [
            "电机要留余量选，不能「刚刚好」。平移门算门体质量；平开门看门扇长度和受风面：整片压型板像帆一样兜风，宽门扇配小电机一季就报废。使用强度是另一参数：家用入口普通电机够用，小区或工厂大门要每天数百次循环的重载型。",
            "冬季套餐不是营销话术：缓启动让电机不去硬拽冻住的门扇，润滑脂要耐严寒。这些在安装时调好，能让机械多用好几年。",
          ] },
          { h: "安全与控制", p: [
            "安全装置的强制下限：遇障碍立停的红外对射、警示灯、带反转的推力调节——大门绝不能压向汽车或行人。停电手动释放是必须的：不拆电机也能用钥匙打开大门。",
            "控制按您的场景配：遥控器、免费来电开门的GSM模块、手机应用、门卫按钮。企业和小区可加车牌识别：自家车不停车进入，访客凭来电，每次进出连抓拍入档。",
          ] },
          { h: "现有大门的自动化与价格", p: [
            "现有大门大多不用换就能自动化：电机、红外对射和警示灯一天装好。前提是机械完好：滑轮、合页和门体几何。如果手推都卡，电机治不了病、只会送终——我们会照实说先修什么。",
            "价格由门型、电机等级和控制方式构成。全新成套比给现有门装电机贵数倍——但选型得当也用得更久。勘测和报价免费；安装一到三天，机械和施工带质保，维保覆盖全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "旧的平开门能加装电机吗？", a: "多数情况可以：直臂电机一天装上门扇。关键前提是合页和几何完好：手推都卡的门要先修再自动化。" },
          { q: "停电了怎么办？", a: "每台电机都有钥匙手动释放——大门可以手动打开。经常停电的地方我们加备用电池：断电后自动系统还能撑几个循环。" },
          { q: "4米宽的压型板大门配什么电机？", a: "整片门板兜风，所以电机按推力余量并结合当地风载选型。具体型号现场确定——上门测量、免费核算。" },
          { q: "院子装大门还是道闸？", a: "道闸更快更便宜，但只管车辆通行。大门提供物理防护和私密性。小区常常两样都装：白天用道闸，夜里关大门。" },
        ],
      },
    },
  },
  {
    slug: "montazh-sks",
    date: "2026-07-17",
    related: ["network", "fiber", "wifi"],
    hubs: ["kommutatory", "telekommunikacionnye-shkafy"],
    loc: {
      ru: {
        title: "Монтаж СКС: как строят сеть, которая не подведёт",
        excerpt: "Что такое структурированная кабельная система, чем Cat5e отличается от Cat6, зачем нужны тестирование и кабельный журнал — и по каким признакам отличить профессиональный монтаж от «скруток за потолком».",
        sections: [
          { h: "Что такое СКС и зачем она бизнесу", p: [
            "Структурированная кабельная система — это единая кабельная инфраструктура здания, по которой работают компьютеры, телефония, камеры, СКУД и Wi-Fi. «Структурированная» — значит построенная по стандарту: одинаковые розетки, патч-панели, маркировка, документация. Любой порт прослеживается от рабочего места до коммутатора за минуту.",
            "Противоположность СКС — «историческая» сеть, которую годами доращивали разные люди: провода за потолком без подписей, свитчи по тумбочкам, никто не знает, что куда идёт. Работает — пока не перестанет; а диагностика любой проблемы превращается в археологию.",
          ] },
          { h: "Категория кабеля: Cat5e, Cat6 или выше", p: [
            "Cat5e держит гигабит на сто метров — этого хватает подавляющему большинству офисов, камерам и телефонии. Cat6 даёт запас: 10 гигабит на коротких дистанциях, жёстче требования к помехам — разумный выбор для серверных узлов и новых зданий «на вырост». Cat6A и оптика — уровень магистралей между этажами и корпусами.",
            "Правило простое: горизонталка до рабочих мест — Cat5e или Cat6 по бюджету, магистрали — оптика. Переплачивать за Cat7 в обычном офисе незачем, а вот сэкономить на меди сомнительного происхождения — верный способ получить сеть с «плавающими» проблемами, которые не находит даже тестер.",
          ] },
          { h: "Признаки профессионального монтажа", p: [
            "Кабель уложен в лотки и короба с соблюдением радиусов изгиба, слаботочка разнесена с силовыми линиями, каждая линия заведена на патч-панель и промаркирована с двух сторон. В шкафу — организаторы и аккуратные пучки, а не «борода» из проводов. Все розетки одного стандарта, запас портов заложен под рост.",
            "И главное — документы: каждая линия протестирована кабельным анализатором, результаты сведены в протокол, заказчику передаются кабельный журнал и схема трасс. Через три года при переезде отдела или ремонте новый подрядчик разберётся в сети по бумагам, а не методом прозвона каждой жилы.",
          ] },
          { h: "Как заказать и что по деньгам", p: [
            "Стоимость СКС считается прозрачно: число портов, категория кабеля, сложность трасс, состав шкафов и активного оборудования. Мы выезжаем бесплатно, считаем по плану помещения и отдаём смету с позициями — не «цену за точку», за которой прячутся доплаты.",
            "Монтируем офисы, склады и производства по Ташкенту и всему Узбекистану: новые объекты — на этапе отделки, действующие — без остановки работы, с переключением в нерабочие часы. Гарантия на линии и работы, дальше — сопровождение сети от замены патч-корда до дежурного администрирования.",
          ] },
        ],
        faq: [
          { q: "Сколько портов закладывать на рабочее место?", a: "Стандарт — две розетки на место: компьютер и телефон или запас. Плюс отдельные порты под принтеры, камеры, точки доступа и переговорки. Запас 20–30 % окупается при первом же росте штата." },
          { q: "Можно ли проложить СКС в офисе с готовым ремонтом?", a: "Да: используются декоративные короба, пространство за фальшпотолком и фальшполом. Аккуратно, без штробления. Единственное отличие от стройки — чуть больше времени на трассы." },
          { q: "Чем плоха сеть «на свитчах по тумбочкам»?", a: "Каскад бытовых свитчей — это петли, узкие места и невозможность диагностики: где-то тормозит, а где — не видно. СКС с нормальным ядром убирает каскады, и сеть становится наблюдаемой." },
          { q: "Что такое тестирование линий и зачем оно мне?", a: "Кабельный анализатор проверяет каждую линию: схему разводки, длину, затухание, перекрёстные помехи. Протокол — ваша гарантия, что сеть держит заявленную скорость, и опора при любых будущих спорах с подрядчиками." },
        ],
      },
      uz: {
        title: "SKS montaji: pand bermaydigan tarmoq qanday quriladi",
        excerpt: "Strukturalangan kabel tizimi nima, Cat5e Cat6 dan nimasi bilan farq qiladi, testlash va kabel jurnali nega kerak — va professional montajni «ship ortidagi o'rashlar»dan qanday belgilar bo'yicha ajratish mumkin.",
        sections: [
          { h: "SKS nima va biznesga nega kerak", p: [
            "Strukturalangan kabel tizimi — bino yagona kabel infratuzilmasi: unda kompyuterlar, telefoniya, kameralar, SKUD va Wi-Fi ishlaydi. «Strukturalangan» — standart bo'yicha qurilgan degani: bir xil rozetkalar, patch-panellar, markirovka, hujjatlar. Istalgan port ish o'rnidan kommutatorgacha bir daqiqada kuzatiladi.",
            "SKS ning teskarisi — har xil odamlar yillab o'stirgan «tarixiy» tarmoq: ship ortida imzosiz simlar, tumbochkalardagi svitchlar, nima qayoqqa borishini hech kim bilmaydi. Ishlaydi — to'xtaguncha; istalgan muammo diagnostikasi esa arxeologiyaga aylanadi.",
          ] },
          { h: "Kabel toifasi: Cat5e, Cat6 yoki yuqoriroq", p: [
            "Cat5e yuz metrga gigabitni ushlaydi — bu ofislarning mutlaq ko'pchiligiga, kamera va telefoniyaga yetadi. Cat6 zaxira beradi: qisqa masofada 10 gigabit, xalaqitga qattiqroq talablar — server uzellari va «o'sishga» yangi binolar uchun oqilona tanlov. Cat6A va optika — qavatlar va korpuslar orasidagi magistrallar darajasi.",
            "Qoida oddiy: ish o'rinlarigacha gorizontal — byudjetga qarab Cat5e yoki Cat6, magistrallar — optika. Oddiy ofisda Cat7 uchun ortiqcha to'lash keraksiz, shubhali kelib chiqishli misda tejash esa tester ham topolmaydigan «suzuvchi» muammoli tarmoq olishning aniq yo'li.",
          ] },
          { h: "Professional montaj belgilari", p: [
            "Kabel egilish radiuslariga rioya qilib lotok va koroblarga yotqizilgan, kuchsiz tok kuch liniyalaridan ajratilgan, har liniya patch-panelga chiqarilgan va ikki tomondan markalangan. Shkafda — organayzerlar va ozoda bog'lamlar, simlardan «soqol» emas. Barcha rozetkalar bir standartda, o'sishga port zaxirasi qo'yilgan.",
            "Eng muhimi — hujjatlar: har liniya kabel analizatori bilan testlangan, natijalar protokolga yig'ilgan, buyurtmachiga kabel jurnali va trassa sxemasi topshirilgan. Uch yildan keyin bo'lim ko'chishi yoki ta'mirda yangi pudratchi tarmoqni har tolani jiringlatib emas, qog'ozlar bo'yicha tushunadi.",
          ] },
          { h: "Qanday buyurtma qilish va narxi qancha", p: [
            "SKS narxi shaffof hisoblanadi: portlar soni, kabel toifasi, trassalar murakkabligi, shkaflar va aktiv uskuna tarkibi. Bepul chiqamiz, xona plani bo'yicha hisoblaymiz va moddali smeta beramiz — ortida qo'shimcha to'lovlar yashiringan «nuqta narxi» emas.",
            "Toshkent va butun O'zbekiston bo'ylab ofis, ombor va ishlab chiqarishlarni montaj qilamiz: yangi obyektlar — pardozlash bosqichida, ishlayotganlar — ishni to'xtatmasdan, ishlanmaydigan soatlarda ulash bilan. Liniya va ishlarga kafolat, keyin — patch-kord almashtirishdan navbatchi administratorlikkacha tarmoq kuzatuvi.",
          ] },
        ],
        faq: [
          { q: "Ish o'rniga nechta port qo'yish kerak?", a: "Standart — o'ringa ikki rozetka: kompyuter va telefon yoki zaxira. Plyus printerlar, kameralar, ulanish nuqtalari va muzokara xonalariga alohida portlar. 20–30 % zaxira shtatning birinchi o'sishidayoq o'zini oqlaydi." },
          { q: "Tayyor ta'mirli ofisda SKS o'tkazsa bo'ladimi?", a: "Ha: dekorativ koroblar, soxta ship va soxta pol orti ishlatiladi. Ozoda, shtroblashsiz. Qurilishdan yagona farq — trassalarga biroz ko'proq vaqt." },
          { q: "«Tumbochkalardagi svitchlar» tarmog'i nimasi bilan yomon?", a: "Maishiy svitchlar kaskadi — bu halqalar, tor joylar va diagnostika imkonsizligi: qayerdadir tormozlaydi, qayerda — ko'rinmaydi. Normal yadroli SKS kaskadlarni olib tashlaydi va tarmoq kuzatiladigan bo'ladi." },
          { q: "Liniyalarni testlash nima va menga nega kerak?", a: "Kabel analizatori har liniyani tekshiradi: ulanish sxemasi, uzunlik, so'nish, o'zaro xalaqitlar. Protokol — tarmoq e'lon qilingan tezlikni ushlashining kafolati va kelajakdagi pudratchilar bilan har qanday bahsda tayanchingiz." },
        ],
      },
      en: {
        title: "Structured Cabling Installation: Building a Network That Will Not Fail",
        excerpt: "What structured cabling is, how Cat5e differs from Cat6, why testing and a cable journal matter — and how to tell professional installation from \"twists above the ceiling\".",
        sections: [
          { h: "What SCS is and why business needs it", p: [
            "A structured cabling system is a building's unified cable infrastructure carrying computers, telephony, cameras, access control and Wi-Fi. \"Structured\" means built to a standard: identical outlets, patch panels, labeling, documentation. Any port traces from the workplace to the switch in a minute.",
            "The opposite of SCS is the \"historical\" network grown over years by different hands: unlabeled wires above the ceiling, switches on bedside tables, nobody knows what goes where. It works — until it does not; and diagnosing any problem becomes archaeology.",
          ] },
          { h: "Cable category: Cat5e, Cat6 or higher", p: [
            "Cat5e carries gigabit over a hundred meters — enough for the vast majority of offices, cameras and telephony. Cat6 gives headroom: 10 gigabit over short runs and stricter noise margins — a sensible choice for server nodes and new buildings sized for growth. Cat6A and fiber are the league of backbones between floors and buildings.",
            "The rule is simple: horizontal runs to workplaces — Cat5e or Cat6 by budget; backbones — fiber. Overpaying for Cat7 in a regular office is pointless, while saving on copper of dubious origin is a sure way to get a network with \"floating\" problems even a tester cannot pin down.",
          ] },
          { h: "Signs of professional installation", p: [
            "Cable laid in trays and trunking with bend radii respected, low-voltage separated from power lines, every line landed on a patch panel and labeled at both ends. In the cabinet — organisers and neat bundles, not a \"beard\" of wires. All outlets to one standard, with port headroom for growth.",
            "And above all — documents: every line tested with a cable analyzer, results in a report, and the customer receives a cable journal and route diagrams. Three years later, at an office move or renovation, a new contractor reads the network from paper instead of toning out every wire.",
          ] },
          { h: "How to order and what it costs", p: [
            "Structured cabling is priced transparently: port count, cable category, route complexity, cabinets and active equipment. We survey for free, calculate from the floor plan and hand over an itemised estimate — not a \"price per point\" with surcharges hiding behind it.",
            "We build offices, warehouses and factories across Tashkent and Uzbekistan: new sites during fit-out, working ones without stopping the business, with cutover out of hours. Warranty on lines and work; afterwards, network support from patch cord replacement to standby administration.",
          ] },
        ],
        faq: [
          { q: "How many ports per workplace?", a: "The standard is two outlets per desk: computer and phone, or spare. Plus dedicated ports for printers, cameras, access points and meeting rooms. A 20–30 % reserve pays off at the first headcount growth." },
          { q: "Can cabling be installed in an office with a finished interior?", a: "Yes: decorative trunking and the space above suspended ceilings and under raised floors are used. Neat, no chasing. The only difference from a construction-stage install is a little more time on the routes." },
          { q: "What is wrong with a network of desktop switches?", a: "A cascade of household switches means loops, bottlenecks and no diagnostics: something is slow somewhere, but where is invisible. SCS with a proper core removes the cascades and makes the network observable." },
          { q: "What is line testing and why do I need it?", a: "A cable analyzer verifies every line: wiring map, length, attenuation, crosstalk. The report is your guarantee the network holds its rated speed — and your evidence in any future dispute with contractors." },
        ],
      },
      tr: {
        title: "Yapısal Kablolama Montajı: Yarı Yolda Bırakmayan Ağ Nasıl Kurulur",
        excerpt: "Yapısal kablolama nedir, Cat5e Cat6'dan nasıl ayrılır, test ve kablo defteri neden önemlidir — ve profesyonel montaj «asma tavan üstü bükümlerden» hangi işaretlerle ayrılır.",
        sections: [
          { h: "SKS nedir, işletmeye neden gerekir", p: [
            "Yapısal kablolama, binanın tek kablo altyapısıdır: bilgisayarlar, telefon, kameralar, geçiş kontrolü ve Wi-Fi onun üzerinde çalışır. «Yapısal» demek standarda göre kurulmuş demektir: aynı prizler, patch paneller, etiketleme, dokümantasyon. Her port, çalışma yerinden switch'e bir dakikada izlenir.",
            "SKS'nin zıttı, yıllarca farklı ellerce büyütülmüş «tarihî» ağdır: asma tavan üstünde imzasız kablolar, komodinlerde switch'ler; neyin nereye gittiğini kimse bilmez. Çalışır — çalışmayana dek; her sorunun teşhisi arkeolojiye döner.",
          ] },
          { h: "Kablo kategorisi: Cat5e, Cat6 veya üstü", p: [
            "Cat5e yüz metrede gigabit taşır — ofislerin büyük çoğunluğuna, kameralara ve telefona yeter. Cat6 pay verir: kısa mesafede 10 gigabit, daha sıkı parazit payları — sunucu düğümleri ve büyümeye göre yeni binalar için makul seçim. Cat6A ve fiber, katlar ve binalar arası omurgaların ligidir.",
            "Kural basit: çalışma yerlerine yatay hatlar — bütçeye göre Cat5e veya Cat6; omurgalar — fiber. Sıradan ofiste Cat7'ye fazla ödemek anlamsız; menşei şüpheli bakırdan kısmak ise testerin bile bulamadığı «gezici» sorunlu ağ almanın garantili yoludur.",
          ] },
          { h: "Profesyonel montajın işaretleri", p: [
            "Kablo, bükülme yarıçaplarına uyularak tava ve kanallara döşenmiş; zayıf akım kuvvetli akımdan ayrılmış; her hat patch panele sonlandırılmış ve iki uçtan etiketlenmiştir. Kabinde organizerlar ve derli toplu demetler vardır — kablo «sakalı» değil. Tüm prizler tek standartta, büyüme için port payı konmuştur.",
            "Ve en önemlisi belgeler: her hat kablo analizörüyle test edilmiş, sonuçlar rapora işlenmiş, müşteriye kablo defteri ve güzergâh şemaları teslim edilmiştir. Üç yıl sonra taşınmada veya tadilatta yeni yüklenici ağı her damarı çınlatarak değil, kâğıttan okur.",
          ] },
          { h: "Nasıl sipariş edilir, maliyeti ne", p: [
            "SKS şeffaf fiyatlanır: port sayısı, kablo kategorisi, güzergâh zorluğu, kabinler ve aktif ekipman. Ücretsiz keşfe gelir, kat planından hesaplar ve kalem kalem teklif veririz — arkasında ek ücret saklanan «nokta fiyatı» değil.",
            "Taşkent ve tüm Özbekistan'da ofis, depo ve fabrika kurarız: yeni tesisler ince işte, çalışanlar iş durmadan, geçişler mesai dışında. Hatlara ve işçiliğe garanti; sonrasında patch kablo değişiminden nöbetçi yönetime kadar ağ desteği.",
          ] },
        ],
        faq: [
          { q: "Çalışma yeri başına kaç port konmalı?", a: "Standart, masa başına iki priz: bilgisayar ve telefon veya yedek. Artı yazıcılara, kameralara, erişim noktalarına ve toplantı odalarına ayrı portlar. %20–30 pay, ilk kadro büyümesinde kendini öder." },
          { q: "Bitmiş tadilatlı ofiste kablolama yapılır mı?", a: "Evet: dekoratif kanallar, asma tavan üstü ve yükseltilmiş döşeme altı kullanılır. Temiz, kırımsız. İnşaat aşamasından tek fark, güzergâhlara biraz daha fazla zaman." },
          { q: "Komodin switch'li ağın nesi kötü?", a: "Ev tipi switch kaskadı döngüler, dar boğazlar ve teşhissizlik demektir: bir yerde yavaşlık var ama nerede, görünmez. Düzgün omurgalı SKS kaskadları kaldırır ve ağ gözlemlenebilir olur." },
          { q: "Hat testi nedir, bana neden lazım?", a: "Kablo analizörü her hattı doğrular: bağlantı şeması, uzunluk, zayıflama, karışma. Rapor, ağın beyan edilen hızı taşıdığının garantisi ve gelecekte yüklenicilerle her tartışmada dayanağınızdır." },
        ],
      },
      zh: {
        title: "综合布线施工：怎样建一张不掉链子的网络",
        excerpt: "什么是综合布线，Cat5e和Cat6差在哪，测试和线缆台账为什么重要——以及怎么把专业施工和「吊顶上的绞接」区分开。",
        sections: [
          { h: "什么是综合布线，企业为什么需要", p: [
            "综合布线是建筑统一的线缆基础设施：电脑、电话、摄像机、门禁和Wi-Fi都跑在上面。「综合（结构化）」意味着按标准建设：统一的面板、配线架、标识和文档。任何端口从工位到交换机一分钟就能追溯。",
            "综合布线的反面是多年由不同人东拼西凑的「历史遗留」网络：吊顶上没有标记的线、床头柜上的交换机，谁也说不清哪根通哪里。它能用——直到不能用；而任何故障的排查都变成考古。",
          ] },
          { h: "线缆类别：Cat5e、Cat6还是更高", p: [
            "Cat5e在一百米内跑千兆——绝大多数办公室、摄像机和电话足够。Cat6留有余量：短距离10千兆、抗干扰指标更严——适合服务器节点和「为增长而建」的新楼。Cat6A和光纤是楼层间、楼栋间骨干的量级。",
            "规则很简单：到工位的水平布线按预算选Cat5e或Cat6，骨干走光纤。普通办公室为Cat7多花钱没有意义；而在来路不明的铜缆上省钱，则稳稳收获一张连测试仪都定位不了的「时好时坏」的网络。",
          ] },
          { h: "专业施工的标志", p: [
            "线缆按弯曲半径敷设在桥架和线槽里，弱电与强电分开走，每条链路端接到配线架并两端标记。机柜里是理线器和整齐的线束，而不是一把「胡子」。所有面板同一标准，端口为增长留有余量。",
            "最重要的是文档：每条链路用测线仪测试过、结果汇成报告，客户拿到线缆台账和路由图。三年后部门搬迁或装修时，新承包商按图纸就能读懂网络，而不用逐芯寻线。",
          ] },
          { h: "怎么下单，花多少钱", p: [
            "综合布线报价透明：端口数、线缆类别、路由难度、机柜和有源设备构成。我们免费上门，按平面图核算，给出逐项预算——不是背后藏着加价的「每点单价」。",
            "在塔什干及全乌兹别克斯坦施工办公室、仓库和工厂：新项目在装修阶段进场，在用场所不停业施工、割接安排在非工作时间。链路和施工带质保；之后提供网络运维——从换根跳线到值守管理。",
          ] },
        ],
        faq: [
          { q: "每个工位留几个端口？", a: "标准是每桌两个：电脑加电话，或留一个备用。打印机、摄像机、AP和会议室另配端口。20–30%的余量在第一次扩员时就回本。" },
          { q: "已装修的办公室能布线吗？", a: "能：走装饰线槽、吊顶上方和架空地板下。干净利落、不开槽。与毛坯施工的唯一区别是路由上多花点时间。" },
          { q: "「床头柜交换机」式网络差在哪？", a: "家用交换机层层级联意味着环路、瓶颈和无法诊断：明明卡顿，却看不到卡在哪。带像样核心的综合布线消灭级联，网络变得可观测。" },
          { q: "链路测试是什么，对我有什么用？", a: "测线仪逐条验证：线序、长度、衰减、串扰。报告是网络达到标称速率的保证书，也是将来与任何承包商争议时的依据。" },
        ],
      },
    },
  },
  {
    slug: "ip-telefoniya-dlya-ofisa",
    date: "2026-07-17",
    related: ["telephony", "network"],
    hubs: ["kommutatory", "marshrutizatory"],
    loc: {
      ru: {
        title: "IP-телефония для офиса: зачем менять привычные линии",
        excerpt: "Что меняется для клиентов и руководителя при переходе на IP-АТС: многоканальность, голосовое меню, запись и статистика звонков — и как выбрать между облачной и локальной станцией.",
        sections: [
          { h: "Что слышит клиент", p: [
            "Главное изменение для звонящего: «занято» исчезает. Многоканальный номер принимает все вызовы сразу, голосовое меню разводит их по отделам, а если менеджер не взял трубку — звонок уходит коллеге, на мобильный или в очередь с музыкой. Каждый пропущенный фиксируется с номером, и перезвонить можно всем.",
            "Для компании это прямые деньги: пропущенный звонок в отдел продаж — это ушедший к конкуренту клиент. IP-АТС превращает поток звонков из чёрного ящика в управляемый процесс.",
          ] },
          { h: "Что видит руководитель", p: [
            "Телефония становится измеримой. Статистика показывает, сколько звонков принято и упущено, кто сколько говорит и в какие часы пик нагрузки — смены и штат планируются по цифрам, а не по ощущениям. Запись разговоров снимает споры «кто что обещал» и становится инструментом обучения новичков.",
            "Интеграция с CRM замыкает контур: при входящем звонке всплывает карточка клиента, разговор пишется в историю сделки, а пропущенные автоматически превращаются в задачи «перезвонить». Менеджер больше не «забывает» лида — система не даёт.",
          ] },
          { h: "Облачная или локальная АТС", p: [
            "Облачная станция запускается за день и не требует железа: помесячная плата, обслуживание на стороне провайдера. Это правильный старт для небольших команд и компаний без своего айтишника. Локальная АТС — в том числе на Asterisk — окупается на большом штате: никаких помесячных платежей, полный контроль, гибкие доработки под нестандартные сценарии и интеграции.",
            "Гибрид тоже работает: локальная станция в офисе плюс облачные номера под рекламные кампании — каждый канал рекламы получает свой номер, и вы видите, откуда реально звонят.",
          ] },
          { h: "Оборудование и внедрение", p: [
            "Аппараты подбираются под роли: настольные IP-телефоны менеджерам, гарнитуры операторам колл-центра, DECT-трубки складу, программные телефоны на компьютерах — там, где физический аппарат не нужен. Сеть готовим правильно: телефония выделяется в свой VLAN с приоритетом, чтобы голос не «квакал» под нагрузкой.",
            "Внедрение — от одного дня для облачной АТС до недели для колл-центра с интеграциями: переносим номера, настраиваем меню и очереди, обучаем сотрудников. Дальше сопровождаем по заявкам — изменения в сценариях не требуют «искать специалиста». Работаем по Ташкенту и всему Узбекистану.",
          ] },
        ],
        faq: [
          { q: "Сохранится ли наш городской номер при переходе?", a: "Да, существующие номера переносятся или подключаются к IP-АТС через шлюз. Клиенты продолжают звонить на привычный номер — меняется только то, что происходит после гудка." },
          { q: "Что будет со связью при отключении интернета?", a: "Настраивается переадресация на мобильные: звонки не теряются даже при полном обрыве канала. Для критичных офисов резервируем интернет вторым провайдером или LTE." },
          { q: "Сколько стоит IP-телефония на офис из 10 человек?", a: "Облачный вариант — помесячная плата за номера и рабочие места плюс IP-телефоны или гарнитуры. Локальная АТС дороже на старте, но без абонентки. Считаем оба варианта бесплатно под ваш профиль звонков." },
          { q: "Можно ли записывать разговоры и законно ли это?", a: "Запись — штатная функция АТС. Для законности сотрудники уведомляются под подпись, а клиенты — фразой в приветствии. Помогаем оформить это корректно." },
        ],
      },
      uz: {
        title: "Ofis uchun IP-telefoniya: odatiy liniyalarni nega almashtirish kerak",
        excerpt: "IP-ATS ga o'tishda mijozlar va rahbar uchun nima o'zgaradi: ko'p kanallilik, ovozli menyu, qo'ng'iroqlar yozuvi va statistikasi — hamda bulutli va lokal stansiya orasida qanday tanlash.",
        sections: [
          { h: "Mijoz nimani eshitadi", p: [
            "Qo'ng'iroq qiluvchi uchun bosh o'zgarish: «band» yo'qoladi. Ko'p kanalli raqam barcha qo'ng'iroqlarni birdan qabul qiladi, ovozli menyu ularni bo'limlarga ajratadi, menejer go'shakni olmasa — qo'ng'iroq hamkasbga, mobil raqamga yoki musiqali navbatga ketadi. Har o'tkazib yuborilgan raqam bilan qayd etiladi, hammaga qayta qo'ng'iroq qilish mumkin.",
            "Kompaniya uchun bu to'g'ridan-to'g'ri pul: savdo bo'limiga o'tkazib yuborilgan qo'ng'iroq — raqobatchiga ketgan mijoz. IP-ATS qo'ng'iroqlar oqimini qora qutidan boshqariladigan jarayonga aylantiradi.",
          ] },
          { h: "Rahbar nimani ko'radi", p: [
            "Telefoniya o'lchanadigan bo'ladi. Statistika nechta qo'ng'iroq qabul qilingani va yo'qotilgani, kim qancha gaplashishi va qaysi soatlar eng band ekanini ko'rsatadi — smena va shtat his bilan emas, raqamlar bilan rejalashtiriladi. Suhbatlar yozuvi «kim nima va'da bergan» bahslarini yopadi va yangilarni o'qitish quroliga aylanadi.",
            "CRM bilan integratsiya konturni yopadi: kiruvchi qo'ng'iroqda mijoz kartochkasi ochiladi, suhbat bitim tarixiga yoziladi, o'tkazib yuborilganlar avtomatik «qayta qo'ng'iroq qilish» vazifasiga aylanadi. Menejer endi lidni «unutmaydi» — tizim qo'ymaydi.",
          ] },
          { h: "Bulutli yoki lokal ATS", p: [
            "Bulutli stansiya bir kunda ishga tushadi va temir talab qilmaydi: oylik to'lov, xizmat provayder tomonida. Bu kichik jamoalar va o'z aytishnikisiz kompaniyalar uchun to'g'ri start. Lokal ATS — jumladan Asterisk da — katta shtatda o'zini oqlaydi: oylik to'lovlar yo'q, to'liq nazorat, nostandart stsenariylar va integratsiyalarga moslashuvchan qayta ishlash.",
            "Gibrid ham ishlaydi: ofisda lokal stansiya plyus reklama kampaniyalariga bulutli raqamlar — har reklama kanali o'z raqamini oladi va qayerdan real qo'ng'iroq qilishayotganini ko'rasiz.",
          ] },
          { h: "Uskuna va joriy etish", p: [
            "Apparatlar rollarga tanlanadi: menejerlarga stol IP-telefonlari, call-markaz operatorlariga garnituralar, omborga DECT-go'shaklar, jismoniy apparat kerak bo'lmagan joyga kompyuterdagi dasturiy telefonlar. Tarmoqni to'g'ri tayyorlaymiz: telefoniya ustuvorlikli o'z VLAN iga ajratiladi, ovoz yuk ostida «vaqillamasligi» uchun.",
            "Joriy etish — bulutli ATS ga bir kundan integratsiyali call-markazga bir haftagacha: raqamlarni ko'chiramiz, menyu va navbatlarni sozlaymiz, xodimlarni o'rgatamiz. Keyin arizalar bo'yicha kuzatib boramiz — stsenariy o'zgarishlari «mutaxassis qidirish»ni talab qilmaydi. Toshkent va butun O'zbekiston bo'ylab ishlaymiz.",
          ] },
        ],
        faq: [
          { q: "O'tishda shahar raqamimiz saqlanadimi?", a: "Ha, mavjud raqamlar ko'chiriladi yoki shlyuz orqali IP-ATS ga ulanadi. Mijozlar odatiy raqamga qo'ng'iroq qilishda davom etadi — faqat gudokdan keyin nima bo'lishi o'zgaradi." },
          { q: "Internet uzilsa aloqa nima bo'ladi?", a: "Mobil raqamlarga yo'naltirish sozlanadi: kanal to'liq uzilganda ham qo'ng'iroqlar yo'qolmaydi. Kritik ofislarga internetni ikkinchi provayder yoki LTE bilan zaxiralaymiz." },
          { q: "10 kishilik ofisga IP-telefoniya qancha turadi?", a: "Bulutli variant — raqam va ish o'rinlari uchun oylik to'lov plyus IP-telefon yoki garnituralar. Lokal ATS startda qimmatroq, lekin abonent to'lovisiz. Qo'ng'iroqlar profilingizga ikkala variantni bepul hisoblaymiz." },
          { q: "Suhbatlarni yozish mumkinmi va bu qonuniymi?", a: "Yozuv — ATS ning shtat funksiyasi. Qonuniylik uchun xodimlar imzo bilan xabardor qilinadi, mijozlar — salomlashuvdagi ibora bilan. Buni to'g'ri rasmiylashtirishga yordam beramiz." },
        ],
      },
      en: {
        title: "Office IP Telephony: Why Replace the Familiar Lines",
        excerpt: "What changes for clients and the owner with an IP PBX: multi-channel numbers, a voice menu, call recording and statistics — and how to choose between a cloud and an on-premise system.",
        sections: [
          { h: "What the client hears", p: [
            "The main change for the caller: \"busy\" disappears. A multi-channel number takes all calls at once, the voice menu routes them to departments, and if a manager does not pick up, the call goes to a colleague, a mobile, or a queue with music. Every missed call is logged with the number — everyone gets called back.",
            "For the company this is direct money: a missed call to sales is a client gone to a competitor. An IP PBX turns the call flow from a black box into a managed process.",
          ] },
          { h: "What the owner sees", p: [
            "Telephony becomes measurable. Statistics show how many calls were taken and lost, who talks how much, and which hours peak — shifts and headcount are planned from numbers, not from gut feeling. Call recording ends the \"who promised what\" disputes and doubles as a training tool for newcomers.",
            "CRM integration closes the loop: an incoming call pops the client card, the conversation lands in the deal history, and missed calls become \"call back\" tasks automatically. A manager can no longer \"forget\" a lead — the system does not let them.",
          ] },
          { h: "Cloud or on-premise PBX", p: [
            "A cloud system launches in a day and needs no hardware: a monthly fee, with maintenance on the provider's side. The right start for small teams and companies without their own IT person. An on-premise PBX — Asterisk included — pays off at larger headcounts: no monthly fees, full control, flexible customisation for non-standard scenarios and integrations.",
            "Hybrid works too: an on-premise system in the office plus cloud numbers for advertising campaigns — each ad channel gets its own number, and you see where calls really come from.",
          ] },
          { h: "Hardware and rollout", p: [
            "Devices follow roles: desk IP phones for managers, headsets for call center operators, DECT handsets for the warehouse, softphones on computers where a physical device is unnecessary. The network is prepared properly: telephony gets its own prioritised VLAN so the voice does not croak under load.",
            "Rollout takes from one day for a cloud PBX to a week for a call center with integrations: we port the numbers, configure menus and queues, and train the staff. Then we support by request — scenario changes do not require \"finding a specialist\". We work across Tashkent and all of Uzbekistan.",
          ] },
        ],
        faq: [
          { q: "Do we keep our city number after the switch?", a: "Yes — existing numbers are ported or connected to the IP PBX through a gateway. Clients keep calling the familiar number; only what happens after the ring changes." },
          { q: "What happens to calls if the internet goes down?", a: "Forwarding to mobiles is configured: calls are not lost even in a full outage. For critical offices we add a second ISP or an LTE backup." },
          { q: "How much does IP telephony cost for a 10-person office?", a: "The cloud option is a monthly fee for numbers and seats plus IP phones or headsets. An on-premise PBX costs more upfront but has no subscription. We quote both options for free against your call profile." },
          { q: "Can calls be recorded, and is it legal?", a: "Recording is a standard PBX feature. For legality, staff are notified in writing and clients hear a notice in the greeting. We help set this up correctly." },
        ],
      },
      tr: {
        title: "Ofis için IP Telefon: Alışıldık Hatları Neden Değiştirmeli",
        excerpt: "IP santrale geçişte müşteriler ve patron için ne değişir: çok kanallı numaralar, sesli menü, kayıt ve çağrı istatistiği — ve bulut ile yerinde santral arasında nasıl seçim yapılır.",
        sections: [
          { h: "Müşteri ne duyar", p: [
            "Arayan için ana değişiklik: «meşgul» kaybolur. Çok kanallı numara tüm aramaları aynı anda alır, sesli menü bölümlere dağıtır; yönetici açmazsa arama meslektaşa, cebe veya müzikli kuyruğa gider. Her cevapsız, numarasıyla kaydedilir — herkes geri aranır.",
            "Şirket için bu doğrudan paradır: satışa gelen cevapsız arama, rakibe giden müşteridir. IP santral çağrı akışını kara kutudan yönetilen sürece çevirir.",
          ] },
          { h: "Patron ne görür", p: [
            "Telefon ölçülebilir olur. İstatistik kaç aramanın alındığını ve kaçırıldığını, kimin ne kadar konuştuğunu, yükün hangi saatte zirve yaptığını gösterir — vardiya ve kadro hisle değil rakamla planlanır. Kayıt, «kim ne söz verdi» tartışmalarını bitirir ve yeni başlayanların eğitim aracına dönüşür.",
            "CRM entegrasyonu döngüyü kapatır: gelen aramada müşteri kartı açılır, görüşme fırsat geçmişine yazılır, cevapsızlar otomatik «geri ara» görevine dönüşür. Yönetici lead'i artık «unutamaz» — sistem izin vermez.",
          ] },
          { h: "Bulut mu yerinde santral mi", p: [
            "Bulut santral bir günde açılır, donanım istemez: aylık ücret, bakım sağlayıcıda. Küçük ekipler ve BT'cisi olmayan şirketler için doğru başlangıç. Yerinde santral — Asterisk dahil — kalabalık kadroda amorti eder: aylık ödeme yok, tam kontrol, standart dışı senaryolara ve entegrasyonlara esnek uyarlama.",
            "Hibrit de çalışır: ofiste yerel santral artı reklam kampanyalarına bulut numaraları — her kanal kendi numarasını alır ve aramaların gerçekte nereden geldiğini görürsünüz.",
          ] },
          { h: "Donanım ve kurulum", p: [
            "Cihazlar role göre seçilir: yöneticilere masa IP telefonları, çağrı merkezi operatörlerine kulaklıklar, depoya DECT el cihazları, fiziksel cihaz gerekmeyen yere bilgisayarda softphone. Ağ doğru hazırlanır: telefon, öncelikli kendi VLAN'ına alınır — ses yük altında hırıldamasın.",
            "Kurulum bulut santral için bir günden, entegrasyonlu çağrı merkezi için bir haftaya: numaraları taşır, menü ve kuyrukları kurar, personeli eğitiriz. Sonrası talep üzerine destek — senaryo değişikliği «uzman aramayı» gerektirmez. Taşkent ve tüm Özbekistan'da çalışıyoruz.",
          ] },
        ],
        faq: [
          { q: "Geçişte şehir numaramız kalır mı?", a: "Evet — mevcut numaralar taşınır veya ağ geçidiyle IP santrale bağlanır. Müşteriler bildikleri numarayı aramaya devam eder; yalnız zil sesinden sonrası değişir." },
          { q: "İnternet kesilirse aramalara ne olur?", a: "Cebe yönlendirme kurulur: tam kesintide bile arama kaybolmaz. Kritik ofislere ikinci sağlayıcı veya LTE yedeği ekleriz." },
          { q: "10 kişilik ofise IP telefon ne kadar tutar?", a: "Bulut seçeneği numara ve koltuk başına aylık ücret artı IP telefon veya kulaklıklar. Yerinde santral başlangıçta pahalı ama aboneliksizdir. Arama profilinize göre ikisini de ücretsiz hesaplarız." },
          { q: "Görüşmeler kaydedilebilir mi, yasal mı?", a: "Kayıt santralin standart özelliğidir. Yasallık için personel imzayla bilgilendirilir, müşteri karşılamada duyuru duyar. Bunu doğru kurmaya yardım ederiz." },
        ],
      },
      zh: {
        title: "办公室IP电话：为什么要换掉习惯的线路",
        excerpt: "换成IP电话系统后，客户和老板各会感受到什么：多通道号码、语音菜单、录音和通话报表——以及云端和本地部署怎么选。",
        sections: [
          { h: "客户听到什么", p: [
            "对打电话的人，最大变化是：不再占线。多通道号码同时接起所有来电，语音菜单分流到各部门；经理没接，来电转给同事、转到手机或进入音乐等待队列。每个未接来电连号码入档——每一个都能回拨。",
            "对公司这是真金白银：打给销售部的未接来电，就是流向对手的客户。IP电话系统把来电流从黑箱变成可管理的流程。",
          ] },
          { h: "老板看到什么", p: [
            "电话变得可度量。报表显示接起和漏接的数量、谁通话多久、哪些时段最忙——排班和编制按数字规划，而不是凭感觉。通话录音终结「谁承诺过什么」的争论，还是新人培训的现成教材。",
            "与CRM集成后闭环形成：来电弹出客户卡片，通话写入成交历史，未接来电自动生成「回拨」任务。经理再也「忘不掉」线索——系统不允许。",
          ] },
          { h: "云端还是本地部署", p: [
            "云端系统一天上线、无需硬件：按月付费，维护在服务商那边。这是小团队和没有专职IT的公司的正确起点。本地系统——包括Asterisk——在人数多时更划算：没有月费、完全掌控、可为非标场景和集成灵活定制。",
            "混合方案同样可行：办公室放本地系统，广告投放用云端号码——每个广告渠道一个专属号码，谁在真正带来电话一目了然。",
          ] },
          { h: "设备与实施", p: [
            "话机按岗位配：经理用桌面IP话机，呼叫中心坐席用耳麦，仓库用DECT无绳手柄，不需要实体话机的岗位用电脑软电话。网络也要备好：语音单独划入高优先级VLAN，高负载下声音不卡顿。",
            "实施周期：云端一天，带集成的呼叫中心一周：迁移号码、配置菜单和队列、培训员工。之后按需支持——改个场景不必「另请高明」。服务覆盖塔什干及全乌兹别克斯坦。",
          ] },
        ],
        faq: [
          { q: "换系统后城市号码还能保留吗？", a: "能——现有号码可携转或通过网关接入IP系统。客户照旧拨打熟悉的号码；变的只是铃声之后发生的事。" },
          { q: "断网了电话怎么办？", a: "预先配置转接到手机：即使线路全断，来电也不会丢。关键办公室再加第二家运营商或LTE备份。" },
          { q: "10人办公室的IP电话要多少钱？", a: "云端方案是号码和坐席的月费，加上IP话机或耳麦。本地系统前期投入高但没有月费。按您的通话画像免费核算两种方案。" },
          { q: "能录音吗，合法吗？", a: "录音是系统的标准功能。合规做法：员工签署知情确认，客户在欢迎语中听到提示。我们协助正确落地。" },
        ],
      },
    },
  },
  {
    slug: "servernaya-komnata",
    date: "2026-07-17",
    related: ["server", "network", "virtualization"],
    hubs: ["telekommunikacionnye-shkafy", "ibp-i-elektropitanie"],
    loc: {
      ru: {
        title: "Серверная комната: требования, ошибки и как сделать правильно",
        excerpt: "Каким должно быть помещение под серверную, как считать питание и охлаждение, зачем газовое пожаротушение и СКУД — и какие ошибки при обустройстве всплывают через полгода простоями.",
        sections: [
          { h: "Помещение: где серверной не место", p: [
            "Серверной не место под трубами водопровода и отопления, рядом с мокрыми зонами и на солнечной стороне без охлаждения. Классика жанра — сервер в бухгалтерии под полкой с архивом или в кладовке уборщицы: работает до первой протечки или первого лета. Правильное помещение — без окон или с заложенными окнами, с запасом по нагрузке на перекрытие и местом для обслуживания стоек спереди и сзади.",
            "Минимальная площадь считается от числа шкафов: даже одному шкафу нужно пространство открыть двери на 120° и стоять техником с обеих сторон. Теснота — это невозможность обслуживания, а значит, простои там, где хватило бы получаса работы.",
          ] },
          { h: "Питание: сколько минут вы переживёте", p: [
            "Электрика серверной начинается с отдельного ввода и щита: серверы не должны сидеть на одной линии с чайником и кондиционерами офиса. ИБП подбирается по мощности и времени автономии, и правильная постановка вопроса — «сколько минут нам нужно»: типовой офисной серверной хватает 15–30 минут на корректное завершение работы, критичным сервисам нужны часы и дизель-генератор.",
            "Аккумуляторы ИБП живут 3–5 лет и умирают тихо: узнают об этом в момент аварии, когда резерв держит секунды вместо минут. Замена батарей по регламенту — дешёвая страховка от самого обидного вида простоя.",
          ] },
          { h: "Охлаждение и пожаротушение", p: [
            "Стойка серверов греет как несколько обогревателей — круглый год, включая зиму. Бытовой настенный кондиционер на такую работу не рассчитан: он не умеет работать на охлаждение в мороз и не имеет ротации. Ставят пару инверторных или прецизионных кондиционеров с автоматической ротацией и резервом, а температуру и протечки выводят в мониторинг с уведомлениями на телефон.",
            "Тушить серверную водой или порошком — значит доломать то, что не сгорело. Правильный ответ — газовое пожаротушение: состав вытесняет кислород и не оставляет следов на оборудовании. Дополняется ранним обнаружением дыма и автоматическим отключением вентиляции.",
          ] },
          { h: "Доступ, порядок и документация", p: [
            "Дверь серверной закрывается СКУД с журналом: «кто и когда заходил к стойкам» — вопрос, на который у ИТ-директора должен быть ответ. Внутри — порядок, который экономит часы при каждой аварии: организация кабеля, маркировка линий, кабельные журналы, схема размещения.",
            "Мы проектируем и строим серверные под ключ: помещение, электрика с ИБП, охлаждение, газовое пожаротушение, СКУД и мониторинг — и модернизируем действующие без остановки сервисов. Обследование бесплатно; работаем по Ташкенту и всему Узбекистану с гарантией и сервисным сопровождением.",
          ] },
        ],
        faq: [
          { q: "Можно ли обойтись шкафом вместо отдельной комнаты?", a: "Для малого офиса — да: серверный шкаф с ИБП и вентиляцией в общем помещении. Граница проходит по теплу и шуму: от двух-трёх серверов и выше нужна отдельная комната с нормальным охлаждением." },
          { q: "Какая температура должна быть в серверной?", a: "Рабочий диапазон — 20–25 °C при стабильной влажности. Важнее абсолютного значения стабильность: качели температуры убивают диски быстрее, чем постоянные 27." },
          { q: "Почему нельзя поставить обычный кондиционер?", a: "Бытовой сплит не рассчитан на круглосуточную работу круглый год и отказывается охлаждать в мороз. Для серверной нужны модели с зимним комплектом и ротацией — иначе первое января система встретит перегревом." },
          { q: "Что входит в мониторинг серверной?", a: "Минимум: температура в горячей и холодной зонах, влажность, протечка, состояние ИБП и открытие двери. Уведомления — на телефон дежурного. Это настраивается за день и снимает «узнали о проблеме от пользователей»." },
        ],
      },
      uz: {
        title: "Server xonasi: talablar, xatolar va to'g'ri qilish yo'li",
        excerpt: "Server xonasi uchun xona qanday bo'lishi kerak, quvvat va sovutishni qanday hisoblash, gazli o't o'chirish va SKUD nega kerak — va jihozlashdagi qaysi xatolar yarim yildan keyin to'xtashlar bilan chiqadi.",
        sections: [
          { h: "Xona: server xonasiga qayer joy emas", p: [
            "Server xonasiga vodoprovod va isitish quvurlari ostida, nam zonalar yonida va sovutishsiz quyosh tomonda joy yo'q. Janr klassikasi — buxgalteriyada arxiv tokchasi ostidagi yoki farrosh omborchasidagi server: birinchi oqish yoki birinchi yozgacha ishlaydi. To'g'ri xona — derazasiz yoki derazalari yopilgan, yopma yukiga zaxirali va stoykalarni oldi-orqasidan xizmatlash joyli.",
            "Minimal maydon shkaflar sonidan hisoblanadi: bitta shkafga ham eshiklarni 120° ochish va texnik ikki tomondan turishi uchun joy kerak. Torlik — xizmatlash imkonsizligi, demak yarim soat ish yetadigan joyda to'xtashlar.",
          ] },
          { h: "Quvvat: necha daqiqa yashaysiz", p: [
            "Server xonasi elektri alohida kirish va shchitdan boshlanadi: serverlar choynak va ofis konditsionerlari bilan bir liniyada o'tirmasligi kerak. UPS quvvat va avtonomiya vaqtiga tanlanadi, savolning to'g'ri qo'yilishi — «bizga necha daqiqa kerak»: tipik ofis server xonasiga ishni to'g'ri yakunlashga 15–30 daqiqa yetadi, kritik servislarga soatlar va dizel-generator kerak.",
            "UPS akkumulyatorlari 3–5 yil yashaydi va jim o'ladi: bu haqda avariya paytida, zaxira daqiqalar o'rniga soniyalar ushlaganda bilishadi. Batareyalarni reglament bo'yicha almashtirish — eng alamli to'xtash turidan arzon sug'urta.",
          ] },
          { h: "Sovutish va o't o'chirish", p: [
            "Server stoykasi bir nechta isitgichdek isitadi — yil bo'yi, qish bilan birga. Maishiy devor konditsioneri bunday ishga mo'ljallanmagan: sovuqda sovutishni bilmaydi va rotatsiyasi yo'q. Avtomatik rotatsiya va zaxirali bir juft invertor yoki pretsizion konditsioner qo'yiladi, harorat va oqishlar telefonga xabarli monitoringga chiqariladi.",
            "Server xonasini suv yoki kukun bilan o'chirish — yonmaganini ham sindirish degani. To'g'ri javob — gazli o't o'chirish: tarkib kislorodni siqib chiqaradi va uskunada iz qoldirmaydi. Tutunni erta aniqlash va ventilyatsiyani avtomatik o'chirish bilan to'ldiriladi.",
          ] },
          { h: "Kirish, tartib va hujjatlar", p: [
            "Server xonasi eshigi jurnalli SKUD bilan yopiladi: «stoykalarga kim va qachon kirgan» — IT-direktorda javobi bo'lishi kerak bo'lgan savol. Ichkarida — har avariyada soatlarni tejaydigan tartib: kabel tashkiloti, liniyalar markirovkasi, kabel jurnallari, joylashuv sxemasi.",
            "Server xonalarini kalit topshirish sharti bilan loyihalaymiz va quramiz: xona, UPS li elektrika, sovutish, gazli o't o'chirish, SKUD va monitoring — ishlayotganlarni servislarni to'xtatmasdan modernizatsiya qilamiz. Tekshiruv bepul; Toshkent va butun O'zbekiston bo'ylab kafolat va servis kuzatuvi bilan ishlaymiz.",
          ] },
        ],
        faq: [
          { q: "Alohida xona o'rniga shkaf bilan cheklansa bo'ladimi?", a: "Kichik ofisga — ha: umumiy xonada UPS va ventilyatsiyali server shkafi. Chegara issiqlik va shovqindan o'tadi: ikki-uch serverdan boshlab normal sovutishli alohida xona kerak." },
          { q: "Server xonasida qanday harorat bo'lishi kerak?", a: "Ish diapazoni — barqaror namlikda 20–25 °C. Mutlaq qiymatdan barqarorlik muhimroq: harorat tebranishlari disklarni doimiy 27 dan tezroq o'ldiradi." },
          { q: "Nega oddiy konditsioner qo'yib bo'lmaydi?", a: "Maishiy split yil bo'yi kecha-kunduz ishlashga mo'ljallanmagan va sovuqda sovutishdan bosh tortadi. Server xonasiga qishki to'plam va rotatsiyali modellar kerak — aks holda birinchi yanvarni tizim qizib kutib oladi." },
          { q: "Server xonasi monitoringiga nima kiradi?", a: "Minimum: issiq va sovuq zonalar harorati, namlik, oqish, UPS holati va eshik ochilishi. Xabarlar — navbatchi telefoniga. Bu bir kunda sozlanadi va «muammoni foydalanuvchilardan bildik»ni olib tashlaydi." },
        ],
      },
      en: {
        title: "The Server Room: Requirements, Mistakes, and Doing It Right",
        excerpt: "What the room itself must be, how to size power and cooling, why gas suppression and access control matter — and which setup mistakes surface six months later as downtime.",
        sections: [
          { h: "The room: where a server room does not belong", p: [
            "A server room does not belong under water or heating pipes, next to wet areas, or on the sunny side without cooling. The classic of the genre is a server in the accounting office under an archive shelf, or in the cleaner's closet: it works until the first leak or the first summer. The right room has no windows (or bricked-up ones), floor load margin, and service space in front of and behind the racks.",
            "The minimum area follows the cabinet count: even one cabinet needs its doors to open 120° and a technician to stand on both sides. Crampedness means no serviceability — and that means downtime where half an hour of work would have sufficed.",
          ] },
          { h: "Power: how many minutes will you survive", p: [
            "Server room electrics start with a dedicated feed and panel: servers must not share a line with the kettle and the office air conditioners. The UPS is sized by capacity and runtime, and the right question is \"how many minutes do we need\": a typical office server room needs 15–30 minutes for a clean shutdown, while critical services need hours and a diesel generator.",
            "UPS batteries live 3–5 years and die quietly: you find out during an outage, when the backup holds seconds instead of minutes. Scheduled battery replacement is cheap insurance against the most annoying kind of downtime.",
          ] },
          { h: "Cooling and fire suppression", p: [
            "A rack of servers heats like several space heaters — all year round, winter included. A household wall split is not built for this: it cannot cool in frost and has no rotation. The answer is a pair of inverter or precision units with automatic rotation and standby, with temperature and leak sensors wired into monitoring with phone alerts.",
            "Extinguishing a server room with water or powder means finishing off what did not burn. The right answer is gas suppression: the agent displaces oxygen and leaves no trace on the equipment. It is complemented by early smoke detection and automatic ventilation shutdown.",
          ] },
          { h: "Access, order and documentation", p: [
            "The server room door is closed with logged access control: \"who entered the racks and when\" is a question the IT director must be able to answer. Inside — the order that saves hours in every incident: cable management, line labeling, cable journals, a layout diagram.",
            "We design and build server rooms turnkey: the room, electrics with UPS, cooling, gas suppression, access control and monitoring — and modernise live rooms without stopping services. The survey is free; we work across Tashkent and all of Uzbekistan with a warranty and service support.",
          ] },
        ],
        faq: [
          { q: "Can a cabinet replace a separate room?", a: "For a small office — yes: a server cabinet with a UPS and ventilation in a shared room. The boundary is heat and noise: from two or three servers up, you need a separate room with proper cooling." },
          { q: "What temperature should a server room keep?", a: "The working range is 20–25 °C with stable humidity. Stability matters more than the absolute value: temperature swings kill disks faster than a constant 27 does." },
          { q: "Why not install an ordinary air conditioner?", a: "A household split is not made for 24/7 year-round duty and refuses to cool in frost. A server room needs units with a winter kit and rotation — otherwise the system greets January 1st with overheating." },
          { q: "What goes into server room monitoring?", a: "The minimum: temperature in the hot and cold zones, humidity, leaks, UPS status and door opening. Alerts go to the duty engineer's phone. It is set up in a day and ends \"we learned about the problem from the users\"." },
        ],
      },
      tr: {
        title: "Sistem Odası: Gereksinimler, Hatalar ve Doğrusu",
        excerpt: "Sistem odası için mekân nasıl olmalı, güç ve soğutma nasıl hesaplanır, gazlı söndürme ve geçiş kontrolü neden önemli — ve kurulumdaki hangi hatalar altı ay sonra kesinti olarak geri döner.",
        sections: [
          { h: "Mekân: sistem odasının yeri olmayan yerler", p: [
            "Sistem odasının yeri su ve kalorifer borularının altı, ıslak hacimlerin yanı ve soğutmasız güneş cephesi değildir. Türün klasiği: muhasebede arşiv rafının altındaki veya temizlikçi dolabındaki sunucu — ilk kaçağa veya ilk yaza kadar çalışır. Doğru mekân penceresizdir (veya pencereleri kapatılmıştır), döşeme yükünde pay ve kabinlerin önünde-arkasında servis alanı vardır.",
            "Asgari alan kabin sayısından hesaplanır: tek kabine bile kapıları 120° açacak ve iki yanında teknisyen duracak yer gerekir. Sıkışıklık bakım imkânsızlığıdır — yani yarım saatlik işin yeteceği yerde kesinti.",
          ] },
          { h: "Güç: kaç dakika hayatta kalırsınız", p: [
            "Sistem odası elektriği ayrı besleme ve panoyla başlar: sunucular; su ısıtıcısı ve ofis klimalarıyla aynı hatta oturmamalıdır. UPS kapasite ve süreye göre boyutlandırılır; doğru soru «bize kaç dakika lazım»dır: tipik ofis odasına düzgün kapanış için 15–30 dakika yeter, kritik servislere saatler ve dizel jeneratör gerekir.",
            "UPS aküleri 3–5 yıl yaşar ve sessizce ölür: bunu kesinti anında, yedek dakikalar yerine saniyeler tutunca öğrenirsiniz. Planlı akü değişimi, kesintinin en can sıkıcı türüne karşı ucuz sigortadır.",
          ] },
          { h: "Soğutma ve yangın söndürme", p: [
            "Sunucu kabini birkaç ısıtıcı gibi ısıtır — kış dahil bütün yıl. Ev tipi duvar split buna göre yapılmamıştır: ayazda soğutamaz, rotasyonu yoktur. Doğrusu, otomatik rotasyonlu ve yedekli bir çift inverter veya hassas klimadır; sıcaklık ve kaçak sensörleri telefona uyarılı izlemeye bağlanır.",
            "Sistem odasını suyla veya tozla söndürmek, yanmayanı da bitirmek demektir. Doğru yanıt gazlı söndürmedir: gaz oksijeni iter ve ekipmanda iz bırakmaz. Erken duman algılama ve havalandırmanın otomatik kapanmasıyla tamamlanır.",
          ] },
          { h: "Erişim, düzen ve dokümantasyon", p: [
            "Sistem odasının kapısı kayıtlı geçiş kontrolüyle kapatılır: «kabinlere kim, ne zaman girdi» BT direktörünün yanıtlayabilmesi gereken sorudur. İçeride her arızada saat kazandıran düzen: kablo yönetimi, hat etiketleri, kablo defterleri, yerleşim şeması.",
            "Sistem odalarını anahtar teslim tasarlar ve kurarız: mekân, UPS'li elektrik, soğutma, gazlı söndürme, geçiş kontrolü ve izleme — çalışan odaları da servisleri durdurmadan yenileriz. Keşif ücretsiz; Taşkent ve tüm Özbekistan'da garanti ve servis desteğiyle çalışırız.",
          ] },
        ],
        faq: [
          { q: "Ayrı oda yerine kabin yeter mi?", a: "Küçük ofise evet: ortak mekânda UPS'li ve havalandırmalı sunucu kabini. Sınır ısı ve gürültüden geçer: iki-üç sunucudan itibaren düzgün soğutmalı ayrı oda gerekir." },
          { q: "Sistem odası kaç derece olmalı?", a: "Çalışma aralığı, kararlı nemle 20–25 °C. Mutlak değerden çok kararlılık önemlidir: sıcaklık salınımları diskleri sabit 27'den hızlı öldürür." },
          { q: "Neden sıradan klima olmaz?", a: "Ev tipi split yıl boyu 7/24 çalışmaya göre değildir ve ayazda soğutmayı reddeder. Sistem odasına kış kitli ve rotasyonlu modeller gerekir — yoksa sistem 1 Ocak'ı aşırı ısınmayla karşılar." },
          { q: "Sistem odası izlemesine ne girer?", a: "Asgari: sıcak ve soğuk bölge sıcaklıkları, nem, kaçak, UPS durumu ve kapı açılması. Uyarılar nöbetçinin telefonuna düşer. Bir günde kurulur ve «sorunu kullanıcılardan öğrendik»i bitirir." },
        ],
      },
      zh: {
        title: "机房建设：要求、常见错误与正确做法",
        excerpt: "机房选址有什么要求，供电和制冷怎么核算，为什么要气体灭火和门禁——以及哪些建设失误会在半年后以停机的方式显形。",
        sections: [
          { h: "选址：哪里不配放机房", p: [
            "机房不能放在水管暖气管下方、湿区旁边，也不能放在没有制冷的向阳面。经典反面案例：财务室档案架下的服务器，或保洁间里的服务器——撑到第一次漏水或第一个夏天。合格的房间无窗（或封窗）、楼板承重有余量、机柜前后留有维护空间。",
            "最小面积按机柜数量核算：哪怕一个机柜也需要门能开到120°、技术员能站在两侧。局促意味着无法维护——也就意味着本来半小时能解决的事变成停机。",
          ] },
          { h: "供电：你们能撑几分钟", p: [
            "机房电气从专用进线和配电箱开始：服务器不能和烧水壶、办公空调挤一条线。UPS按容量和续航选型，正确的问题是「我们需要几分钟」：典型办公机房15–30分钟够体面关机，关键业务需要数小时外加柴油发电机。",
            "UPS电池寿命3–5年，死得悄无声息：往往在断电那一刻才发现备电只撑几秒而不是几分钟。按计划换电池，是对最憋屈的一类停机的廉价保险。",
          ] },
          { h: "制冷与灭火", p: [
            "一柜服务器的发热相当于几台取暖器——全年如此，包括冬天。家用壁挂空调干不了这活：严寒时无法制冷、也没有轮换。正确做法是一对带自动轮换和互备的变频或精密空调，温度和漏水传感器接入监控、告警推送到手机。",
            "用水或干粉扑救机房，等于把没烧掉的也毁掉。正确答案是气体灭火：药剂排挤氧气、不在设备上留痕。再配早期烟雾探测和通风自动联锁。",
          ] },
          { h: "门禁、秩序与文档", p: [
            "机房的门用带日志的门禁管住：「谁在什么时候进过机柜」——IT主管必须答得上来。屋里是每次故障都省下数小时的秩序：理线、线路标识、线缆台账、设备布置图。",
            "我们一站式设计建设机房：房间、带UPS的电气、制冷、气体灭火、门禁和监控——在用机房的改造不停业务进行。勘测免费；服务覆盖塔什干及全乌兹别克斯坦，带质保和维保。",
          ] },
        ],
        faq: [
          { q: "能用一个机柜代替单独的机房吗？", a: "小办公室可以：公共空间里放一个带UPS和通风的服务器机柜。分界线在发热和噪音：两三台服务器起就需要带正经制冷的独立房间。" },
          { q: "机房该保持多少度？", a: "工作区间是20–25 °C、湿度稳定。稳定比绝对值更重要：温度大幅波动比恒定27度更快弄坏硬盘。" },
          { q: "为什么不能装普通空调？", a: "家用分体机不是为全年7×24设计的，严寒时拒绝制冷。机房要配冬季组件和轮换功能的机型——否则元旦那天系统就用过热迎接你。" },
          { q: "机房监控都包括什么？", a: "最低配置：冷热区温度、湿度、漏水、UPS状态和门的开启。告警推送到值班手机。一天配好，从此告别「用户先发现问题」。" },
        ],
      },
    },
  },
  {
    slug: "videoanalitika-raspoznavanie-lic",
    date: "2026-07-17",
    related: ["analytics", "cctv", "anpr"],
    hubs: ["ip-kamery"],
    loc: {
      ru: {
        title: "Видеоаналитика и распознавание лиц: что умеют умные камеры",
        excerpt: "Как аналитика превращает камеры из архива в работающую систему: распознавание лиц и номеров, подсчёт посетителей, защита периметра — и что можно добавить к уже установленным камерам.",
        sections: [
          { h: "Зачем камерам интеллект", p: [
            "Обычное видеонаблюдение — это архив «на всякий случай»: события находят постфактум, листая записи. Аналитика меняет роль камер: система сама замечает пересечение линии, лицо из стоп-листа или машину не из белого списка — и поднимает тревогу в момент события, а не наутро.",
            "Честный факт: оператор перестаёт замечать происходящее на мониторах уже через двадцать минут наблюдения. Алгоритмы не устают — они фильтруют поток и показывают человеку только то, что требует решения.",
          ] },
          { h: "Распознавание лиц: доступ и списки", p: [
            "В СКУД лицо работает бесконтактным пропуском: терминал отличает живое лицо от фотографии и пропускает сотрудника за доли секунды. В безопасности — фильтром по спискам: система сверяет лица с базами «нежелательных» и VIP и тихо уведомляет охрану или менеджера.",
            "Для банков и ритейла это рабочий инструмент — от предотвращения мошенничества до персональной встречи важного клиента. Важно понимать техническую основу: терминалы хранят не фотографии, а математические шаблоны, по которым нельзя восстановить изображение.",
          ] },
          { h: "Аналитика для бизнеса и охраны", p: [
            "Ритейлу аналитика даёт цифры, которых нет у кассы: подсчёт посетителей и конверсию в чек, тепловые карты зала — где покупатели задерживаются и какие полки обходят, — алерты про очередь на кассе, когда пора открывать вторую. Маркетинг получает данные для решений вместо ощущений.",
            "Охране аналитика закрывает периметр: виртуальная линия на изображении заменяет километры сигнального кабеля, алгоритмы AcuSense отличают человека от собаки и качающейся ветки — ложных тревог на порядок меньше, чем у простой детекции движения. Детекция оставленных предметов и праздношатания дополняет картину в ТЦ и на вокзалах.",
          ] },
          { h: "Камера или сервер — и как начать", p: [
            "Базовые алгоритмы современные камеры Hikvision и Dahua несут «на борту» — периметру и детекции сервер не нужен. Распознавание по большим базам лиц, подсчёт в масштабе сети магазинов и сложные сценарии требуют серверной платформы с ИИ. Мы считаем оба варианта честно — и часто добавляем аналитику к уже установленным камерам без замены парка.",
            "Начинаем со сценариев, а не с прайса: что должно происходить при тревоге, кому приходит уведомление, какие отчёты нужны руководителю. Затем пилот на одной-двух камерах и тираж. Внедряем под ключ по Ташкенту и всему Узбекистану — с обучением операторов, гарантией и поддержкой.",
          ] },
        ],
        faq: [
          { q: "Можно ли добавить аналитику к нашим старым камерам?", a: "Чаще всего да: серверное ПО анализирует поток с любых камер приличного разрешения. Приезжаем, смотрим парк и говорим честно, что заработает, а где камеру лучше заменить." },
          { q: "Сколько лиц может быть в базе распознавания?", a: "Терминалы держат тысячи шаблонов на борту, серверные платформы — сотни тысяч. Для проходной на 500 сотрудников хватает терминала; сети объектов и большие списки — задача сервера." },
          { q: "Работает ли распознавание в маске или очках?", a: "Современные алгоритмы узнают лицо в обычных очках и с частичным перекрытием; медицинская маска снижает точность — для таких условий настраивается дополнительный фактор: карта или QR." },
          { q: "Что с приватностью и законностью?", a: "Система хранит математические шаблоны, а не фото; доступ к базе ограничивается СКУД и журналируется. Помогаем оформить уведомления сотрудников и посетителей корректно." },
        ],
      },
      uz: {
        title: "Videoanalitika va yuzni tanish: aqlli kameralar nimaga qodir",
        excerpt: "Analitika kameralarni arxivdan ishlaydigan tizimga qanday aylantiradi: yuz va raqamlarni tanish, tashrif buyuruvchilar hisobi, perimetr himoyasi — va o'rnatilgan kameralarga nima qo'shish mumkin.",
        sections: [
          { h: "Kameralarga intellekt nega kerak", p: [
            "Oddiy videokuzatuv — «har ehtimolga qarshi» arxiv: hodisalar yozuvlarni varaqlab keyin topiladi. Analitika kameralar rolini o'zgartiradi: tizim chiziq kesilishini, stop-ro'yxatdagi yuzni yoki oq ro'yxatda bo'lmagan mashinani o'zi payqaydi — va trevogani ertalab emas, hodisa paytida ko'taradi.",
            "Halol fakt: operator monitorlardagi bo'layotganni yigirma daqiqa kuzatuvdan keyin payqamay qo'yadi. Algoritmlar charchamaydi — ular oqimni filtrlaydi va odamga faqat qaror talab qiladiganini ko'rsatadi.",
          ] },
          { h: "Yuzni tanish: kirish va ro'yxatlar", p: [
            "SKUDda yuz kontaktsiz ruxsatnoma bo'lib ishlaydi: terminal tirik yuzni fotosuratdan farqlaydi va xodimni soniya ulushida o'tkazadi. Xavfsizlikda — ro'yxatlar filtri: tizim yuzlarni «nomaqbullar» va VIP bazalari bilan solishtiradi va qo'riq yoki menejerga jimgina xabar beradi.",
            "Bank va riteyl uchun bu ish quroli — firibgarlikning oldini olishdan muhim mijozni shaxsan kutib olishgacha. Texnik asosni tushunish muhim: terminallar fotosurat emas, tasvirni tiklab bo'lmaydigan matematik shablonlar saqlaydi.",
          ] },
          { h: "Biznes va qo'riq uchun analitika", p: [
            "Riteylga analitika kassada yo'q raqamlarni beradi: tashrif hisobi va chekka konversiya, zal issiqlik xaritalari — xaridorlar qayerda to'xtaydi va qaysi peshtaxtalarni aylanib o'tadi, — kassadagi navbat alertlari, ikkinchisini ochish payti kelganda. Marketing his o'rniga qaror uchun ma'lumot oladi.",
            "Qo'riqqa analitika perimetrni yopadi: tasvirdagi virtual chiziq kilometrlab signal kabelini almashtiradi, AcuSense algoritmlari odamni it va chayqalayotgan shoxdan farqlaydi — yolg'on trevogalar oddiy harakat detektsiyasidan o'n barobar kam. Qoldirilgan buyumlar va bekorchilik detektsiyasi savdo markazi va vokzallarda manzarani to'ldiradi.",
          ] },
          { h: "Kamera yoki server — va qanday boshlash", p: [
            "Bazaviy algoritmlarni zamonaviy Hikvision va Dahua kameralari «bortida» olib yuradi — perimetr va detektsiyaga server kerak emas. Katta yuz bazalari bo'yicha tanish, do'konlar tarmog'i ko'lamidagi hisob va murakkab stsenariylar sun'iy intellektli server platformasini talab qiladi. Ikkala variantni halol hisoblaymiz — va ko'pincha analitikani parkni almashtirmasdan o'rnatilgan kameralarga qo'shamiz.",
            "Prays bilan emas, stsenariylar bilan boshlaymiz: trevogada nima bo'lishi kerak, xabar kimga keladi, rahbarga qanday hisobotlar kerak. Keyin bir-ikki kamerada pilot va tiraj. Toshkent va butun O'zbekiston bo'ylab kalit topshirish sharti bilan joriy etamiz — operatorlarni o'qitish, kafolat va qo'llab-quvvatlash bilan.",
          ] },
        ],
        faq: [
          { q: "Eski kameralarimizga analitika qo'shsa bo'ladimi?", a: "Ko'pincha ha: server dasturi munosib ruxsatli istalgan kamera oqimini tahlil qiladi. Kelamiz, parkni ko'ramiz va nima ishlashini, qayerda kamerani almashtirgan ma'qulligini halol aytamiz." },
          { q: "Tanish bazasida nechta yuz bo'lishi mumkin?", a: "Terminallar bortda minglab shablon ushlaydi, server platformalari — yuz minglab. 500 xodimli prohodnayaga terminal yetadi; obyektlar tarmog'i va katta ro'yxatlar — server vazifasi." },
          { q: "Niqob yoki ko'zoynakda tanish ishlaydimi?", a: "Zamonaviy algoritmlar oddiy ko'zoynakli va qisman yopilgan yuzni taniydi; tibbiy niqob aniqlikni pasaytiradi — bunday sharoitga qo'shimcha omil sozlanadi: karta yoki QR." },
          { q: "Maxfiylik va qonuniylik bilan nima?", a: "Tizim foto emas, matematik shablonlar saqlaydi; bazaga kirish SKUD bilan cheklanadi va jurnalga yoziladi. Xodim va tashrif buyuruvchilarni xabardor qilishni to'g'ri rasmiylashtirishga yordam beramiz." },
        ],
      },
      en: {
        title: "Video Analytics and Facial Recognition: What Smart Cameras Can Do",
        excerpt: "How analytics turns cameras from an archive into a working system: face and plate recognition, visitor counting, perimeter protection — and what can be added to cameras you already have.",
        sections: [
          { h: "Why cameras need intelligence", p: [
            "Conventional CCTV is a \"just in case\" archive: events are found after the fact by scrolling through footage. Analytics changes the cameras' role: the system itself notices a crossed line, a face from a stop list or a car missing from the whitelist — and raises the alarm at the moment of the event, not the next morning.",
            "An honest fact: an operator stops noticing what happens on the monitors after about twenty minutes of watching. Algorithms do not tire — they filter the stream and show a person only what needs a decision.",
          ] },
          { h: "Facial recognition: access and lists", p: [
            "In access control a face works as a contactless pass: the terminal tells a live face from a photo and passes an employee in a fraction of a second. In security it is a list filter: the system checks faces against \"unwanted\" and VIP databases and quietly notifies the guards or a manager.",
            "For banks and retail it is a working tool — from fraud prevention to personally greeting an important client. The technical basis matters: terminals store not photographs but mathematical templates from which no image can be reconstructed.",
          ] },
          { h: "Analytics for business and security", p: [
            "Retail gets numbers the till does not have: visitor counting and conversion, floor heat maps — where shoppers linger and which shelves they bypass — and queue alerts when it is time to open another till. Marketing gets data for decisions instead of hunches.",
            "For security, analytics closes the perimeter: a virtual line on the image replaces kilometers of sensor cable, and AcuSense-class algorithms tell a person from a dog or a swaying branch — an order of magnitude fewer false alarms than plain motion detection. Abandoned object and loitering detection completes the picture in malls and at stations.",
          ] },
          { h: "Camera or server — and how to start", p: [
            "Modern Hikvision and Dahua cameras carry the basic algorithms on board — perimeter and detection need no server. Recognition against large face databases, counting across a store chain and complex scenarios call for an AI server platform. We price both options honestly — and often add analytics to cameras already installed, with no fleet replacement.",
            "We start with scenarios, not a price list: what must happen on an alarm, who gets the notification, which reports management needs. Then a pilot on one or two cameras, and rollout. Turnkey across Tashkent and all of Uzbekistan — with operator training, warranty and support.",
          ] },
        ],
        faq: [
          { q: "Can analytics be added to our old cameras?", a: "Usually yes: server software analyses the stream from any camera of decent resolution. We come, look at the fleet and say honestly what will work and where a camera is better replaced." },
          { q: "How many faces can the recognition database hold?", a: "Terminals keep thousands of templates on board, server platforms hundreds of thousands. A 500-employee entrance runs fine on a terminal; site networks and big lists are a server's job." },
          { q: "Does recognition work with a mask or glasses?", a: "Modern algorithms recognise a face in ordinary glasses and with partial occlusion; a medical mask reduces accuracy — for such conditions a second factor is configured: a card or a QR code." },
          { q: "What about privacy and legality?", a: "The system stores mathematical templates, not photos; database access is restricted by access control and logged. We help draft employee and visitor notifications correctly." },
        ],
      },
      tr: {
        title: "Video Analitik ve Yüz Tanıma: Akıllı Kameralar Ne Yapabilir",
        excerpt: "Analitik kameraları arşivden çalışan sisteme nasıl çevirir: yüz ve plaka tanıma, ziyaretçi sayımı, çevre koruması — ve mevcut kameralara neler eklenebilir.",
        sections: [
          { h: "Kameralara zekâ neden gerekir", p: [
            "Klasik kamera sistemi «ne olur ne olmaz» arşividir: olaylar kayıtlar taranarak sonradan bulunur. Analitik, kameraların rolünü değiştirir: sistem aşılan çizgiyi, kara listedeki yüzü veya beyaz listede olmayan aracı kendisi fark eder — ve alarmı ertesi sabah değil, olay anında verir.",
            "Dürüst gerçek: operatör yaklaşık yirmi dakika sonra ekranlarda olanı fark etmez olur. Algoritmalar yorulmaz — akışı süzer ve insana yalnız karar gerektireni gösterir.",
          ] },
          { h: "Yüz tanıma: erişim ve listeler", p: [
            "Geçiş kontrolünde yüz, temassız kart gibi çalışır: terminal canlı yüzü fotoğraftan ayırır ve çalışanı saniyenin kesrinde geçirir. Güvenlikte liste filtresidir: sistem yüzleri «istenmeyen» ve VIP veritabanlarıyla karşılaştırır, güvenliği veya yöneticiyi sessizce bilgilendirir.",
            "Bankalar ve perakende için çalışan bir araçtır — dolandırıcılığı önlemekten önemli müşteriyi kişisel karşılamaya. Teknik temel önemlidir: terminaller fotoğraf değil, görüntüye geri çevrilemeyen matematiksel şablonlar saklar.",
          ] },
          { h: "İş ve güvenlik için analitik", p: [
            "Perakende, kasada olmayan rakamları alır: ziyaretçi sayımı ve dönüşüm, kat ısı haritaları — müşteri nerede oyalanıyor, hangi rafları pas geçiyor — ve ikinci kasayı açma vakti gelince kuyruk uyarıları. Pazarlama, hisler yerine karar verisi alır.",
            "Güvenlik için analitik çevreyi kapatır: görüntüdeki sanal çizgi kilometrelerce sensör kablosunun yerini alır; AcuSense sınıfı algoritmalar insanı köpekten ve sallanan daldan ayırır — yanlış alarm, düz hareket algılamadan kat kat azdır. Bırakılan eşya ve oyalanma algılama AVM ve garlarda tabloyu tamamlar.",
          ] },
          { h: "Kamera mı sunucu mu — ve nasıl başlamalı", p: [
            "Modern Hikvision ve Dahua kameralar temel algoritmaları üzerinde taşır — çevre ve algılama için sunucu gerekmez. Büyük yüz veritabanları, zincir ölçeğinde sayım ve karmaşık senaryolar yapay zekâlı sunucu platformu ister. İkisini de dürüstçe fiyatlandırırız — ve analitiği çoğu kez filo değiştirmeden kurulu kameralara ekleriz.",
            "Fiyat listesiyle değil senaryolarla başlarız: alarmda ne olmalı, bildirim kime gitmeli, yönetime hangi raporlar gerekli. Sonra bir-iki kamerada pilot ve yaygınlaştırma. Taşkent ve tüm Özbekistan'da anahtar teslim — operatör eğitimi, garanti ve destekle.",
          ] },
        ],
        faq: [
          { q: "Eski kameralarımıza analitik eklenir mi?", a: "Çoğunlukla evet: sunucu yazılımı, makul çözünürlükteki her kameranın akışını analiz eder. Gelir, filoya bakar ve neyin çalışacağını, hangi kameranın değişmesinin daha iyi olduğunu dürüstçe söyleriz." },
          { q: "Tanıma veritabanı kaç yüz alır?", a: "Terminaller binlerce şablonu üzerinde tutar, sunucu platformları yüz binlerce. 500 kişilik giriş terminalle yürür; tesis ağları ve büyük listeler sunucunun işidir." },
          { q: "Maske veya gözlükle tanıma çalışır mı?", a: "Modern algoritmalar sıradan gözlüklü ve kısmen kapalı yüzü tanır; tıbbi maske doğruluğu düşürür — böyle koşullara ikinci faktör kurulur: kart veya QR." },
          { q: "Mahremiyet ve yasallık ne durumda?", a: "Sistem fotoğraf değil matematiksel şablon saklar; veritabanı erişimi geçiş kontrolüyle kısıtlanır ve kayda geçer. Çalışan ve ziyaretçi bilgilendirmelerini doğru düzenlemeye yardım ederiz." },
        ],
      },
      zh: {
        title: "视频分析与人脸识别：智能摄像机能做什么",
        excerpt: "分析算法如何把摄像机从录像库变成主动工作的系统：人脸和车牌识别、客流统计、周界防护——以及现有摄像机能叠加什么能力。",
        sections: [
          { h: "摄像机为什么需要智能", p: [
            "普通监控是「备查」的档案库：事件靠事后翻录像才找到。分析改变了摄像机的角色：系统自己发现越线、命中布控名单的人脸、不在白名单的车辆——在事件发生的那一刻报警，而不是第二天早上。",
            "一个诚实的事实：值班员盯屏约二十分钟后就开始漏看。算法不会疲劳——它过滤整条视频流，只把需要决策的事推给人。",
          ] },
          { h: "人脸识别：门禁与名单", p: [
            "在门禁里，人脸就是无接触通行证：终端区分真人和照片，瞬间放行员工。在安防里是名单过滤器：系统把人脸与「不受欢迎者」和VIP库比对，悄悄通知保安或经理。",
            "对银行和零售这是实用工具——从防欺诈到贵宾进门即有人相迎。技术底层值得了解：终端存储的不是照片，而是无法还原成图像的数学模板。",
          ] },
          { h: "面向经营与安防的分析", p: [
            "零售拿到收银机给不出的数字：客流量和成交转化、卖场热力图——顾客在哪里停留、绕开哪些货架——以及该开第二个收银台时的排队提醒。市场部用数据而不是感觉做决策。",
            "对安防，分析封住周界：画面上的虚拟警戒线替代成公里的传感电缆，AcuSense级算法把人和狗、摇晃的树枝区分开——误报比普通移动侦测少一个数量级。遗留物和徘徊检测在商场和车站补全防线。",
          ] },
          { h: "算法放在哪、从哪开始", p: [
            "现代海康威视和大华摄像机自带基础算法——周界和检测不需要服务器。基于大型人脸库的识别、连锁规模的客流统计和复杂场景才需要AI服务器平台。两种方案我们都如实核算——并常常在不更换现有摄像机的前提下叠加分析。",
            "我们从场景出发而不是从价格表：报警时应发生什么、通知发给谁、管理层要什么报表。然后一两台摄像机试点、再铺开。塔什干及全乌兹别克斯坦一站式交付——含值班员培训、质保和支持。",
          ] },
        ],
        faq: [
          { q: "我们的旧摄像机能加分析吗？", a: "大多数能：服务器软件可分析任何分辨率过得去的摄像机码流。我们上门看设备，照实说哪些能用、哪台建议更换。" },
          { q: "识别库能装多少张人脸？", a: "终端本机存数千个模板，服务器平台存数十万。500人的门岗一台终端就够；多站点网络和大名单是服务器的事。" },
          { q: "戴口罩或眼镜还能识别吗？", a: "现代算法认得戴普通眼镜和部分遮挡的脸；医用口罩会降低准确率——这类场合配第二因子：刷卡或二维码。" },
          { q: "隐私和合法性怎么办？", a: "系统存的是数学模板而非照片；识别库的访问受门禁限制并全程留痕。我们协助规范地做好员工和访客告知。" },
        ],
      },
    },
  },
  {
    slug: "hikvision-vs-dahua",
    date: "2026-07-19",
    related: ["cctv"],
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
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
          { h: "Сервис и прошивки в Узбекистане", p: [
            "Оба бренда официально представлены в регионе, но зрелость сервиса отличается по конкретным линейкам: перед покупкой стоит проверить не «бренд вообще», а доступность запчастей и сроки гарантийного ремонта именно вашей модели. Мы держим на складе ходовые камеры и регистраторы обеих марок, поэтому замена по гарантии занимает дни, а не недели ожидания поставки.",
            "Отдельный пункт — прошивки: у Hikvision и Dahua региональные версии ПО различаются, и камера с «серого» рынка может не обновляться или не активироваться в облаке. Покупайте у поставщика, который отвечает за происхождение устройства — это дешевле, чем разбираться с заблокированной партией камер на смонтированном объекте.",
          ] },
          { h: "Вывод", p: [
            "Неправильного выбора здесь нет: и Hikvision, и Dahua — надёжные рабочие лошадки. Правильный вопрос — не «какой бренд лучше», а «какая модель решает вашу задачу за ваш бюджет». Пришлите план объекта — подберём конфигурацию в обеих марках и покажете разницу в цифрах: и по цене, и по функциям.",
          ] },
        ],
          faq: [
            { q: "Можно ли смешивать камеры Hikvision и Dahua в одной системе?", a: "Да, по стандарту ONVIF камеры обеих марок подключаются к любому регистратору, но фирменная аналитика и умный поиск работают полноценно только в родной экосистеме. Для новых объектов мы советуем один бренд." },
            { q: "Какой бренд дешевле при равных характеристиках?", a: "Разница в цене на сопоставимых моделях обычно в пределах 5–15% и меняется от партии к партии. Решает не прайс, а задача: аналитика, интеграция с СКУД, требования заказчика." },
            { q: "Что с санкционными ограничениями этих брендов?", a: "Ограничения США на госзакупки не действуют в Узбекистане: для коммерческих и частных объектов обе марки продаются и обслуживаются официально." },
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
          { h: "O'zbekistonda servis va proshivkalar", p: [
            "Ikkala brend ham mintaqada rasmiy mavjud, lekin servis yetukligi liniyalarga qarab farq qiladi: xariddan oldin «brendni umuman» emas, aynan sizning modelingiz uchun ehtiyot qismlar va kafolat ta'miri muddatlarini tekshirish kerak. Biz omborda ikkala markaning yurimli kamera va registratorlarini saqlaymiz, shuning uchun kafolat bo'yicha almashtirish haftalab kutish emas, kunlar masalasi.",
            "Alohida band — proshivkalar: Hikvision va Dahua da dasturiy ta'minotning mintaqaviy versiyalari farq qiladi, «kulrang» bozordan kelgan kamera yangilanmasligi yoki bulutda faollashmasligi mumkin. Qurilma kelib chiqishiga javob beradigan yetkazib beruvchidan oling — bu montaj qilingan obyektda bloklangan kamera partiyasi bilan ovora bo'lishdan arzonroq.",
          ] },
          { h: "Xulosa", p: [
            "Bu yerda noto'g'ri tanlov yo'q: Hikvision ham, Dahua ham ishonchli. To'g'ri savol — «qaysi brend yaxshiroq» emas, «qaysi model sizning vazifangizni sizning byudjetingizda hal qiladi». Obyekt rejasini yuboring — ikkala markada konfiguratsiya tanlab, farqni raqamlarda ko'rsatamiz.",
          ] },
        ],
          faq: [
            { q: "Bitta tizimda Hikvision va Dahua kameralarini aralashtirish mumkinmi?", a: "Ha, ONVIF standarti bo'yicha ikkala marka kameralari istalgan registratorga ulanadi, lekin firmaviy analitika va aqlli qidiruv faqat o'z ekotizimida to'liq ishlaydi. Yangi obyektlarga bitta brendni tavsiya qilamiz." },
            { q: "Teng xususiyatlarda qaysi brend arzonroq?", a: "Solishtirma modellarda narx farqi odatda 5–15% ichida va partiyadan partiyaga o'zgaradi. Praysning o'zi emas, vazifa hal qiladi: analitika, SKUD bilan integratsiya, buyurtmachi talablari." },
            { q: "Bu brendlarning sanksiya cheklovlari bilan nima gap?", a: "AQShning davlat xaridlariga cheklovlari O'zbekistonda amal qilmaydi: tijorat va xususiy obyektlar uchun ikkala marka rasmiy sotiladi va xizmat ko'rsatiladi." },
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
          { h: "Service and firmware in Uzbekistan", p: [
            "Both brands are officially present in the region, yet service maturity differs by product line: before buying, check not the brand in general but parts availability and warranty turnaround for your specific model. We stock popular cameras and recorders of both makes, so a warranty swap takes days rather than weeks of waiting for a shipment.",
            "Firmware is a separate point: Hikvision and Dahua ship regional software builds, and a grey-market camera may refuse updates or cloud activation. Buy from a supplier who answers for the device's origin — that is cheaper than untangling a blocked batch of cameras on an already-installed site.",
          ] },
          { h: "Conclusion", p: [
            "There is no wrong choice here: both Hikvision and Dahua are reliable workhorses. The right question is not \"which brand is better\" but \"which model solves your task within your budget\". Send us your site plan — we will spec both brands and show you the difference in numbers.",
          ] },
        ],
          faq: [
            { q: "Can Hikvision and Dahua cameras be mixed in one system?", a: "Yes, via the ONVIF standard cameras of both makes connect to any recorder, but native analytics and smart search work fully only inside their own ecosystem. For new sites we advise a single brand." },
            { q: "Which brand is cheaper at equal specs?", a: "The price gap on comparable models is usually within 5–15% and shifts from batch to batch. The task decides, not the price list: analytics, access-control integration, the client's requirements." },
            { q: "What about sanctions on these brands?", a: "US government-procurement restrictions do not apply in Uzbekistan: for commercial and private sites both makes are sold and serviced officially." },
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
          { h: "Özbekistan'da servis ve yazılımlar", p: [
            "İki marka da bölgede resmî olarak var, ancak servis olgunluğu ürün serisine göre değişir: satın almadan önce genel markayı değil, tam olarak modelinizin yedek parça bulunurluğunu ve garanti onarım süresini kontrol edin. İki markanın da yaygın kamera ve kayıt cihazlarını stokta tutuyoruz; garanti değişimi haftalarca sevkiyat beklemek yerine günler sürer.",
            "Yazılım ayrı bir konu: Hikvision ve Dahua bölgesel yazılım sürümleri kullanır; gri pazardan gelen kamera güncellenmeyebilir veya bulutta etkinleşmeyebilir. Cihazın menşeinden sorumlu bir tedarikçiden alın — kurulu sahada bloke olmuş kamera partisiyle uğraşmaktan ucuzdur.",
          ] },
          { h: "Sonuç", p: [
            "Burada yanlış seçim yok: Hikvision da Dahua da güvenilirdir. Doğru soru \"hangi marka daha iyi\" değil, \"hangi model görevi bütçenizde çözer\". Saha planınızı gönderin — iki markada da konfigürasyon çıkarıp farkı rakamlarla gösterelim.",
          ] },
        ],
          faq: [
            { q: "Hikvision ve Dahua kameralar tek sistemde karışabilir mi?", a: "Evet, ONVIF standardıyla iki markanın kameraları her kayıt cihazına bağlanır; ancak markaya özel analitik ve akıllı arama yalnızca kendi ekosisteminde tam çalışır. Yeni sahalar için tek marka öneriyoruz." },
            { q: "Eşit özelliklerde hangi marka daha ucuz?", a: "Karşılaştırılabilir modellerde fark genelde %5–15 içindedir ve partiden partiye değişir. Fiyat listesi değil, görev belirler: analitik, geçiş kontrolü entegrasyonu, müşteri gereksinimleri." },
            { q: "Bu markaların yaptırım kısıtlamaları ne durumda?", a: "ABD'nin kamu alımı kısıtlamaları Özbekistan'da geçerli değildir: ticari ve özel sahalarda iki marka da resmî satılır ve servis görür." },
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
          { h: "乌兹别克斯坦的服务与固件", p: [
            "两个品牌在本地区都有官方渠道，但服务成熟度因产品线而异：购买前要核实的不是“品牌整体”，而是您那款型号的备件供应和保修周期。我们库存两家的热门摄像机和录像机，保修更换以天计，而不是等货数周。",
            "固件是另一个要点：海康和大华的软件分区域版本，水货摄像机可能无法升级或无法云激活。请从对设备来源负责的供应商处购买——这比在已装好的项目上处理被锁定的一批摄像机便宜得多。",
          ] },
          { h: "结论", p: [
            "这里没有错误的选择：海康威视和大华都是可靠的主力。正确的问题不是“哪个品牌更好”，而是“哪个型号在您的预算内解决您的任务”。把项目平面图发给我们——我们按两个品牌分别配置，用数字给您看差异。",
          ] },
        ],
          faq: [
            { q: "海康和大华的摄像机能混用在一套系统里吗？", a: "可以，通过ONVIF标准两家的摄像机都能接任意录像机，但原厂智能分析和智能检索只有在自家生态里才完整可用。新项目我们建议只选一个品牌。" },
            { q: "同等规格下哪家更便宜？", a: "可比型号的差价通常在5–15%以内，且随批次波动。决定因素是需求而非报价单：智能分析、门禁联动、甲方要求。" },
            { q: "这两个品牌的制裁限制影响吗？", a: "美国的政府采购限制在乌兹别克斯坦不适用：商业和民用项目上两家都正常销售并提供官方服务。" },
          ],
      },
    },
  },
  {
    slug: "ip-ili-analogovaya-kamera",
    date: "2026-07-19",
    related: ["cctv"],
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
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
          { h: "Гибрид на практике: как объекты переходят на IP", p: [
            "Реальные объекты редко бывают «чистыми»: типичный магазин живёт с аналоговыми камерами по коаксиалу и хочет добавить пару IP с распознаванием на вход. Это штатная схема — гибридный регистратор принимает оба типа, и апгрейд идёт поэтапно, без остановки записи и замены всей проводки.",
            "Планируя переход, начните с зон, где важна детализация: вход, касса, периметр. Старый аналог остаётся в подсобках и коридорах до конца своего ресурса. Мы считаем такие миграции регулярно — приезжайте с планом объекта или зовите инженера, маршрут перехода будет бесплатным.",
          ] },
          { h: "Вывод", p: [
            "Технология — не религия, а инструмент под бюджет и состояние объекта. Мы монтируем и то и другое: пришлите фото объекта или план — посчитаем оба варианта, и вы сравните не абстракции, а конкретные сметы.",
          ] },
        ],
          faq: [
            { q: "Можно ли подключить старые аналоговые камеры к новой IP-системе?", a: "Да, через гибридный регистратор (XVR): он принимает и аналоговые, и IP-каналы. Так объект переходит на IP поэтапно, не выбрасывая работающие камеры." },
            { q: "Правда ли, что аналоговая камера надёжнее в простых условиях?", a: "Она проще: нет сетевых настроек, прошивок и IP-адресов, картинка идёт по коаксиалу напрямую. Но и возможностей минимум — ни аналитики, ни удалённого доступа без регистратора." },
            { q: "Какая разница в цене на систему из 4 камер?", a: "Аналоговый комплект обойдётся примерно на 20–30% дешевле, но разрыв сокращается: массовые IP-камеры подешевели, а выигрыш в детализации и аналитике окупает разницу уже на первом инциденте." },
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
          { h: "Amaliyotda gibrid: obyektlar IP ga qanday o'tadi", p: [
            "Real obyektlar kamdan-kam «toza» bo'ladi: tipik do'kon koaksialdagi analog kameralar bilan yashaydi va kirishga tanishli bir juft IP qo'shmoqchi. Bu shtatniy sxema — gibrid registrator ikkala turni qabul qiladi, apgreyd yozuvni to'xtatmasdan va butun simlarni almashtirmasdan bosqichma-bosqich boradi.",
            "O'tishni rejalashtirganda detalizatsiya muhim zonalardan boshlang: kirish, kassa, perimetr. Eski analog resursi tugaguncha yordamchi xona va koridorlarda qoladi. Bunday migratsiyalarni muntazam hisoblaymiz — obyekt plani bilan keling yoki muhandisni chaqiring, o'tish marshruti bepul bo'ladi.",
          ] },
          { h: "Xulosa", p: [
            "Texnologiya — din emas, byudjet va obyekt holatiga mos vosita. Biz ikkalasini ham o'rnatamiz: obyekt suratini yoki rejasini yuboring — ikkala variantni hisoblaymiz, siz esa mavhumlikni emas, aniq smetalarni taqqoslaysiz.",
          ] },
        ],
          faq: [
            { q: "Eski analog kameralarni yangi IP-tizimga ulash mumkinmi?", a: "Ha, gibrid registrator (XVR) orqali: u analog kanallarni ham, IP-kanallarni ham qabul qiladi. Shunday qilib obyekt ishlayotgan kameralarni tashlamasdan IP ga bosqichma-bosqich o'tadi." },
            { q: "Analog kamera oddiy sharoitda ishonchliroq degani rostmi?", a: "U soddaroq: tarmoq sozlamalari, proshivkalar va IP-manzillar yo'q, tasvir koaksial orqali to'g'ridan-to'g'ri boradi. Lekin imkoniyatlar ham minimal — na analitika, na registratorsiz masofaviy kirish." },
            { q: "4 kamerali tizimda narx farqi qancha?", a: "Analog komplekt taxminan 20–30% arzonroq chiqadi, lekin farq qisqaryapti: ommaviy IP-kameralar arzonlashdi, detallashtirish va analitikadagi yutuq esa farqni birinchi hodisadayoq oqlaydi." },
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
          { h: "Hybrid in practice: how sites move to IP", p: [
            "Real sites are rarely \"pure\": a typical shop lives with analog cameras over coax and wants to add a couple of IP units with recognition at the entrance. That is a standard scheme — a hybrid recorder accepts both types, and the upgrade goes in stages without stopping recording or replacing all the wiring.",
            "When planning the move, start with the zones where detail matters: the entrance, the till, the perimeter. The old analog stays in back rooms and corridors until the end of its life. We calculate such migrations regularly — come with a site plan or call an engineer; the migration route is free.",
          ] },
          { h: "Conclusion", p: [
            "Technology is not a religion — it is a tool matched to your budget and the state of the site. We install both: send a photo or plan of your site and we will price both options, so you compare real estimates, not abstractions.",
          ] },
        ],
          faq: [
            { q: "Can old analog cameras join a new IP system?", a: "Yes, via a hybrid recorder (XVR): it accepts both analog and IP channels. That way a site migrates to IP in stages without discarding working cameras." },
            { q: "Is an analog camera really more reliable in simple setups?", a: "It is simpler: no network settings, firmware or IP addresses, the picture runs straight over coax. But capabilities are minimal too — no analytics, no remote access without a recorder." },
            { q: "What is the price gap for a 4-camera system?", a: "An analog kit comes out roughly 20–30% cheaper, but the gap is closing: mainstream IP cameras got cheaper, and the gain in detail and analytics pays the difference back at the first incident." },
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
          { h: "Pratikte hibrit: tesisler IP'ye nasıl geçer", p: [
            "Gerçek tesisler nadiren «saf» olur: tipik mağaza koaksiyeldeki analog kameralarla yaşar ve girişe tanımalı birkaç IP eklemek ister. Bu standart şemadır — hibrit kayıt cihazı iki tipi de kabul eder; yükseltme, kaydı durdurmadan ve tüm kabloyu değiştirmeden aşamalı gider.",
            "Geçişi planlarken detayın önemli olduğu bölgelerden başlayın: giriş, kasa, çevre. Eski analog, ömrü bitene dek arka odalarda ve koridorlarda kalır. Bu tür geçişleri düzenli hesaplıyoruz — tesis planıyla gelin veya mühendis çağırın; geçiş rotası ücretsizdir.",
          ] },
          { h: "Sonuç", p: [
            "Teknoloji din değil, bütçeye ve sahanın durumuna göre seçilen bir araçtır. İkisini de kuruyoruz: sahanızın fotoğrafını veya planını gönderin, iki seçeneği de fiyatlandıralım — soyutlamaları değil somut teklifleri karşılaştırın.",
          ] },
        ],
          faq: [
            { q: "Eski analog kameralar yeni IP sisteme bağlanır mı?", a: "Evet, hibrit kayıt cihazı (XVR) ile: hem analog hem IP kanalları kabul eder. Böylece saha, çalışan kameraları atmadan IP'ye kademeli geçer." },
            { q: "Basit koşullarda analog kamera gerçekten daha mı güvenilir?", a: "Daha basittir: ağ ayarı, yazılım ve IP adresi yoktur; görüntü koaksiyelden doğrudan gider. Ama yetenekler de asgaridir — ne analitik ne de kayıt cihazsız uzaktan erişim." },
            { q: "4 kameralı sistemde fiyat farkı ne kadar?", a: "Analog set yaklaşık %20–30 ucuza çıkar, ama makas kapanıyor: yaygın IP kameralar ucuzladı; detay ve analitik kazancı, farkı ilk olayda geri öder." },
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
          { h: "混合方案的实践：现场怎样过渡到IP", p: [
            "真实的现场很少「纯粹」：典型的商店用同轴模拟摄像机过日子，又想在入口加两台带识别的IP机。这是标准方案——混合录像机两种都收，升级分阶段进行，录像不中断、线路不必全换。",
            "规划过渡时，从需要细节的区域开始：入口、收银台、周界。老的模拟机留在后仓和走廊，用到寿终正寝。这类迁移我们经常核算——带着平面图来，或叫工程师上门，过渡路线图免费。",
          ] },
          { h: "结论", p: [
            "技术不是信仰，而是匹配预算和现场条件的工具。两种我们都安装：把现场照片或平面图发给我们，两个方案都报价——您比较的将是具体预算，而非抽象概念。",
          ] },
        ],
          faq: [
            { q: "旧的模拟摄像机能接进新的IP系统吗？", a: "能，用混合录像机（XVR）：它同时接模拟通道和IP通道。这样项目可以分阶段迁移到IP，不必扔掉还能用的摄像机。" },
            { q: "简单场景下模拟摄像机真的更可靠吗？", a: "它更简单：没有网络配置、固件和IP地址，图像走同轴线直达。但功能也是最低限度——没有智能分析，离开录像机就没有远程访问。" },
            { q: "4路系统的价差有多大？", a: "模拟套装大约便宜20–30%，但差距在缩小：主流IP摄像机降价了，而清晰度和智能分析的优势在第一次事件时就能赚回差价。" },
          ],
      },
    },
  },
  {
    slug: "zkteco-vs-hikvision-biometriya",
    date: "2026-07-19",
    related: ["access", "attendance"],
    hubs: ["turnikety-i-shlagbaumy"],
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
          { h: "Цены и наш практический выбор", p: [
            "По бюджету ZKTeco выигрывает в классике «дверь + учёт времени»: терминалы дешевле при сопоставимой точности, и для проходной на 50–500 человек это самый частый выбор. Hikvision берёт своё там, где биометрия — часть большой системы: единая платформа с камерами, домофонами и турникетами, один журнал и один интерфейс для охраны.",
            "Наша практика: офисы и производства чаще получают ZKTeco по соотношению цена/функции, объекты с развитым видеонаблюдением Hikvision — терминалы того же вендора. Оба варианта со склада в Ташкенте; привозим на объект, показываем скорость распознавания вживую и считаем комплект бесплатно.",
          ] },
          { h: "Вывод", p: [
            "ZKTeco — про биометрию и учёт времени за разумные деньги, Hikvision — про единую экосистему безопасности. Мы внедряем обе марки, включая интеграцию с 1С и зарплатными модулями: расскажите, какие отчёты и сценарии прохода вам нужны — предложим конфигурацию в двух вариантах с ценами.",
          ] },
        ],
          faq: [
            { q: "Работают ли терминалы ZKTeco и Hikvision с 1С и зарплатными системами?", a: "Да, у обоих есть SDK и выгрузка событий; данные учёта рабочего времени передаются в 1С или кадровую систему. Мы делаем такие интеграции — уточните вашу конфигурацию." },
            { q: "Распознавание лиц работает в темноте и в маске?", a: "Современные терминалы обеих марок используют ИК-подсветку и распознают лицо в темноте; с медицинской маской работают старшие модели, но точность ниже — надёжнее комбинировать лицо с картой или отпечатком." },
            { q: "Сколько сотрудников выдерживает один терминал?", a: "Базовые модели хранят 500–3000 шаблонов лиц, старшие — десятки тысяч. Для проходной на сотни человек важнее скорость распознавания: терминал должен пропускать поток без очереди, это мы проверяем при подборе." },
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
          { h: "Narxlar va bizning amaliy tanlovimiz", p: [
            "Byudjet bo'yicha ZKTeco «eshik + vaqt hisobi» klassikasida yutadi: terminallar taqqoslanadigan aniqlikda arzonroq, 50–500 kishilik prohodnayaga bu eng ko'p tanlov. Hikvision biometriya katta tizimning qismi bo'lgan joyda o'zinikini oladi: kameralar, domofonlar va turniketlar bilan yagona platforma, qo'riq uchun bitta jurnal va bitta interfeys.",
            "Amaliyotimiz: ofis va ishlab chiqarishlar narx/funksiya nisbatida ko'proq ZKTeco oladi, rivojlangan Hikvision videokuzatuvli obyektlar — o'sha vendor terminallarini. Ikkala variant Toshkentdagi ombordan; obyektga olib kelamiz, tanish tezligini jonli ko'rsatamiz va to'plamni bepul hisoblaymiz.",
          ] },
          { h: "Xulosa", p: [
            "ZKTeco — oqilona pulga biometriya va vaqt hisobi haqida, Hikvision — yagona xavfsizlik ekotizimi haqida. Biz ikkala markani, shu jumladan 1C va ish haqi modullari bilan integratsiyani joriy etamiz: qanday hisobot va o'tish stsenariylari kerakligini ayting — narxlari bilan ikki variantda konfiguratsiya taklif qilamiz.",
          ] },
        ],
          faq: [
            { q: "ZKTeco va Hikvision terminallari 1C va oylik tizimlari bilan ishlaydimi?", a: "Ha, ikkalasida ham SDK va hodisalarni yuklash bor; ish vaqti hisobi ma'lumotlari 1C yoki kadrlar tizimiga uzatiladi. Biz bunday integratsiyalarni qilamiz — konfiguratsiyangizni aniqlashtiring." },
            { q: "Yuzni tanish qorong'ida va niqobda ishlaydimi?", a: "Ikkala markaning zamonaviy terminallari IK-yoritishdan foydalanadi va yuzni qorong'ida taniydi; tibbiy niqob bilan katta modellar ishlaydi, lekin aniqlik pastroq — yuzni karta yoki barmoq izi bilan birlashtirish ishonchliroq." },
            { q: "Bitta terminal nechta xodimni ko'taradi?", a: "Bazaviy modellar 500–3000 yuz shablonini saqlaydi, kattalari — o'n minglab. Yuzlab odamlik prohodnoyda tanish tezligi muhimroq: terminal oqimni navbatsiz o'tkazishi kerak, buni tanlashda tekshiramiz." },
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
          { h: "Prices and our practical pick", p: [
            "On budget, ZKTeco wins the classic \"door + time attendance\" case: terminals are cheaper at comparable accuracy, and for a 50–500 person entrance it is the most frequent choice. Hikvision takes over where biometrics is part of a bigger system: one platform with cameras, intercoms and turnstiles, one log and one interface for security.",
            "Our practice: offices and factories more often get ZKTeco for price/features, while sites with an established Hikvision CCTV setup get the same vendor's terminals. Both are in Tashkent stock; we bring them to your site, demonstrate recognition speed live and quote the kit for free.",
          ] },
          { h: "Conclusion", p: [
            "ZKTeco is about biometrics and time tracking for sensible money; Hikvision is about a unified security ecosystem. We deploy both, including 1C and payroll integration: tell us which reports and entry scenarios you need — we will propose two configurations with prices.",
          ] },
        ],
          faq: [
            { q: "Do ZKTeco and Hikvision terminals work with 1C and payroll systems?", a: "Yes, both offer SDKs and event export; time-attendance data flows into 1C or an HR system. We build such integrations — tell us your configuration." },
            { q: "Does face recognition work in the dark and with a mask?", a: "Modern terminals of both makes use IR illumination and recognize faces in the dark; higher-end models handle medical masks, though accuracy drops — combining face with a card or fingerprint is more reliable." },
            { q: "How many employees can one terminal handle?", a: "Entry models store 500–3,000 face templates, senior ones — tens of thousands. For a checkpoint with hundreds of people recognition speed matters more: the terminal must pass the flow without queues, which we verify during selection." },
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
          { h: "Fiyatlar ve pratikte bizim seçimimiz", p: [
            "Bütçede ZKTeco, klasik «kapı + mesai» senaryosunu kazanır: terminaller benzer doğrulukta daha ucuzdur ve 50–500 kişilik giriş için en sık seçimdir. Hikvision, biyometrinin büyük sistemin parçası olduğu yerde öne geçer: kameralar, diafonlar ve turnikelerle tek platform, güvenlik için tek kayıt ve tek arayüz.",
            "Pratiğimiz: ofisler ve fabrikalar fiyat/özellik oranıyla çoğunlukla ZKTeco alır; oturmuş Hikvision kamera altyapısı olan tesisler aynı üreticinin terminallerini seçer. İkisi de Taşkent stoğunda; tesise getirir, tanıma hızını canlı gösterir ve seti ücretsiz hesaplarız.",
          ] },
          { h: "Sonuç", p: [
            "ZKTeco makul paraya biyometri ve mesai takibi; Hikvision bütünleşik güvenlik ekosistemi demektir. İkisini de kuruyoruz, 1C ve bordro entegrasyonu dahil: hangi raporlara ve geçiş senaryolarına ihtiyacınız olduğunu söyleyin — fiyatlarıyla iki konfigürasyon önerelim.",
          ] },
        ],
          faq: [
            { q: "ZKTeco ve Hikvision terminalleri 1C ve bordro sistemleriyle çalışır mı?", a: "Evet, ikisinde de SDK ve olay aktarımı var; mesai verileri 1C'ye veya İK sistemine akar. Bu entegrasyonları yapıyoruz — konfigürasyonunuzu iletin." },
            { q: "Yüz tanıma karanlıkta ve maskeyle çalışır mı?", a: "İki markanın güncel terminalleri IR aydınlatma kullanır ve karanlıkta yüzü tanır; üst modeller tıbbi maskeyle çalışır ama doğruluk düşer — yüzü kart ya da parmak iziyle birleştirmek daha güvenilirdir." },
            { q: "Bir terminal kaç çalışanı kaldırır?", a: "Giriş modelleri 500–3000 yüz şablonu tutar, üst modeller on binlerce. Yüzlerce kişilik girişte tanıma hızı daha önemlidir: terminal akışı kuyruksuz geçirmeli; seçimde bunu doğruluyoruz." },
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
          { h: "价格与我们的实战选择", p: [
            "论预算，ZKTeco赢在「门禁＋考勤」的经典场景：精度相当、终端更便宜，50–500人的门岗它是最常见的选择。当生物识别是大系统的一环时，海康威视占优：与摄像机、对讲和闸机同平台，保安只看一个日志、一个界面。",
            "我们的实践：办公室和工厂按性价比多选ZKTeco；已有成熟海康威视监控的场所选同厂终端。两种都是塔什干现货；带到现场实测识别速度，套件免费核算。",
          ] },
          { h: "结论", p: [
            "ZKTeco代表花合理的钱做生物识别和考勤；海康威视代表统一的安防生态。两个品牌我们都做，包括1C和工资模块对接：告诉我们您需要哪些报表和通行场景——我们给出两套带价格的配置方案。",
          ] },
        ],
          faq: [
            { q: "ZKTeco和海康的终端能对接1C和薪资系统吗？", a: "能，两家都提供SDK和事件导出；考勤数据可传入1C或人事系统。这类集成我们来做——告诉我们您的配置即可。" },
            { q: "人脸识别在黑暗中、戴口罩时好用吗？", a: "两家的现代终端都带红外补光，黑暗中可识别人脸；高端型号支持医用口罩但精度下降——人脸加刷卡或指纹组合更稳妥。" },
            { q: "一台终端能承载多少员工？", a: "入门型号存500–3000个人脸模板，高端型号数万。对几百人的门岗更关键的是识别速度：终端必须让人流不排队通过，选型时我们会实测。" },
          ],
      },
    },
  },
  {
    slug: "poe-kommutator-ili-bloki-pitaniya",
    date: "2026-07-19",
    related: ["cctv", "network"],
    hubs: ["kommutatory", "ibp-i-elektropitanie"],
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
          { h: "Типичные ошибки при выборе питания", p: [
            "Главная ошибка — считать порты, а не ватты: коммутатор «8 портов PoE» с бюджетом 65 Вт не вытянет восемь камер с ИК-подсветкой и обогревом по 12–15 Вт каждая. Всегда складывайте максимальное потребление всех камер и оставляйте запас 20–30% — зимой подсветка и обогрев работают одновременно.",
            "Вторая ошибка — пассивный PoE вместо стандарта: дешёвые «PoE-инжекторы» подают напряжение без согласования и способны сжечь порт камеры, рассчитанной на 802.3af/at. Третья — длина: за пределами 100 метров по меди нужен либо удлинитель PoE, либо оптика с медиаконвертером, а не «авось дотянет».",
          ] },
          { h: "Вывод", p: [
            "До 2–3 камер на готовых розетках — блоки питания допустимы. От 3–4 камер и в любой системе, которая должна работать при отключении света, — PoE без вариантов. Поможем подобрать PoE-коммутатор под ваше количество камер и посчитать бюджет мощности — напишите нам в чат или Telegram.",
          ] },
        ],
          faq: [
            { q: "Можно ли питать по PoE не только камеры?", a: "Да: точки Wi-Fi, IP-телефоны, домофонные панели и контроллеры СКУД тоже питаются по стандартному PoE — одна инфраструктура закрывает всю слаботочку." },
            { q: "Что будет, если мощности коммутатора не хватит?", a: "Коммутатор отключит порты с наименьшим приоритетом или камеры начнут перезагружаться ночью при включении ИК-подсветки — плавающая неисправность, которую сложно диагностировать." },
            { q: "PoE-коммутатор нужно заземлять?", a: "Да, как и любое активное оборудование: заземление и грозозащита на уличных линиях защищают и коммутатор, и камеры — особенно на длинных трассах между зданиями." },
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
          { h: "Quvvatlashni tanlashdagi tipik xatolar", p: [
            "Asosiy xato — vatt emas, portlarni sanash: 65 Vt byudjetli «8 port PoE» kommutator har biri 12–15 Vt bo'lgan IK-yoritish va isitishli sakkiz kamerani tortmaydi. Doim barcha kameralarning maksimal iste'molini qo'shing va 20–30% zaxira qoldiring — qishda yoritish va isitish bir vaqtda ishlaydi.",
            "Ikkinchi xato — standart o'rniga passiv PoE: arzon «PoE-injektorlar» kuchlanishni kelishuvsiz beradi va 802.3af/at ga mo'ljallangan kamera portini kuydirishi mumkin. Uchinchisi — uzunlik: mis orqali 100 metrdan nariga PoE uzaytirgich yoki mediakonvertorli optika kerak, «yetib borar» emas.",
          ] },
          { h: "Xulosa", p: [
            "Tayyor rozetkalarda 2–3 kameragacha — quvvat bloklari joiz. 3–4 kameradan boshlab va svet o'chganda ishlashi kerak bo'lgan har qanday tizimda — variantsiz PoE. Kameralaringiz soniga mos PoE-kommutator tanlash va quvvat byudjetini hisoblashda yordam beramiz — chat yoki Telegram orqali yozing.",
          ] },
        ],
          faq: [
            { q: "PoE orqali faqat kameralarni quvvatlash mumkinmi?", a: "Yo'q, boshqalarni ham: Wi-Fi nuqtalari, IP-telefonlar, domofon panellari va SKUD kontrollerlari ham standart PoE bilan ishlaydi — bitta infratuzilma butun kuchsiz tok tizimini yopadi." },
            { q: "Kommutator quvvati yetmasa nima bo'ladi?", a: "Kommutator eng past prioritetli portlarni o'chiradi yoki kameralar kechasi IK-yoritish yonganda qayta yuklana boshlaydi — tashxis qo'yish qiyin bo'lgan suzuvchi nosozlik." },
            { q: "PoE-kommutatorni yerga ulash kerakmi?", a: "Ha, har qanday faol uskuna kabi: yerga ulash va ko'cha liniyalarida momaqaldiroq himoyasi kommutatorni ham, kameralarni ham asraydi — ayniqsa binolar orasidagi uzun trassalarda." },
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
          { h: "Typical power-selection mistakes", p: [
            "The main mistake is counting ports instead of watts: an '8-port PoE' switch with a 65 W budget will not carry eight cameras with IR and heaters at 12–15 W each. Always sum the maximum draw of every camera and keep 20–30% headroom — in winter illumination and heating run at the same time.",
            "The second mistake is passive PoE instead of the standard: cheap 'PoE injectors' push voltage without negotiation and can burn the port of a camera built for 802.3af/at. The third is length: beyond 100 meters of copper you need a PoE extender or fiber with a media converter, not wishful thinking.",
          ] },
          { h: "Conclusion", p: [
            "Up to 2–3 cameras with outlets already in place — power supplies are acceptable. From 3–4 cameras, and in any system that must survive blackouts, — PoE, no question. We will help you pick a PoE switch for your camera count and calculate the power budget — message us in chat or Telegram.",
          ] },
        ],
          faq: [
            { q: "Can PoE power more than cameras?", a: "Yes: Wi-Fi access points, IP phones, intercom panels and access controllers also run on standard PoE — one infrastructure covers the whole low-current stack." },
            { q: "What happens if the switch runs out of power?", a: "The switch drops the lowest-priority ports, or cameras start rebooting at night when IR turns on — a floating fault that is hard to diagnose." },
            { q: "Does a PoE switch need grounding?", a: "Yes, like any active gear: grounding and surge protection on outdoor lines protect both the switch and the cameras — especially on long runs between buildings." },
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
          { h: "Güç seçiminde tipik hatalar", p: [
            "Ana hata watt yerine port saymaktır: 65 W bütçeli '8 port PoE' switch, her biri 12–15 W çeken IR aydınlatmalı ve ısıtıcılı sekiz kamerayı taşımaz. Her kameranın azami tüketimini toplayın ve %20–30 pay bırakın — kışın aydınlatma ve ısıtma aynı anda çalışır.",
            "İkinci hata standart yerine pasif PoE: ucuz 'PoE enjektörleri' gerilimi anlaşmasız basar ve 802.3af/at için yapılmış kameranın portunu yakabilir. Üçüncüsü mesafe: bakırda 100 metrenin ötesinde PoE genişletici ya da medya çeviricili fiber gerekir, şansa bırakmak değil.",
          ] },
          { h: "Sonuç", p: [
            "Hazır prizli 2–3 kameraya kadar adaptörler kabul edilebilir. 3–4 kameradan itibaren ve kesintide çalışması gereken her sistemde — tartışmasız PoE. Kamera sayınıza uygun PoE switch seçimi ve güç bütçesi hesabında yardımcı olalım — chat veya Telegram'dan yazın.",
          ] },
        ],
          faq: [
            { q: "PoE ile kameradan başka ne beslenir?", a: "Wi-Fi erişim noktaları, IP telefonlar, interkom panelleri ve geçiş kontrolcüleri de standart PoE ile çalışır — tek altyapı tüm zayıf akımı kapatır." },
            { q: "Switch'in gücü yetmezse ne olur?", a: "Switch en düşük öncelikli portları düşürür ya da kameralar gece IR açılınca yeniden başlar — teşhisi zor, gezici bir arıza." },
            { q: "PoE switch topraklanmalı mı?", a: "Evet, her aktif cihaz gibi: topraklama ve dış hatlarda parafudr hem switch'i hem kameraları korur — özellikle binalar arası uzun hatlarda." },
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
          { h: "选电源的典型错误", p: [
            "最大的错误是数端口而不算瓦数：功率预算65W的“8口PoE”交换机带不动八台各吃12–15W的带红外和加热的摄像机。永远把所有摄像机的最大功耗加总，并留20–30%余量——冬天红外和加热是同时工作的。",
            "第二个错误是用无源PoE替代标准PoE：廉价“PoE供电器”不经协商直接送电，可能烧毁按802.3af/at设计的摄像机端口。第三是距离：铜缆超过100米就要上PoE延长器或光纤加收发器，不能指望“凑合能到”。",
          ] },
          { h: "结论", p: [
            "已有现成插座且不超过2–3台——独立电源可以接受。3–4台以上、以及任何要求停电不停机的系统——毫无疑问选PoE。我们可按您的摄像机数量选型PoE交换机并计算功率预算——欢迎通过在线聊天或Telegram联系。",
          ] },
        ],
          faq: [
            { q: "PoE只能给摄像机供电吗？", a: "不止：Wi-Fi接入点、IP话机、对讲面板和门禁控制器都吃标准PoE——一套基础设施覆盖整个弱电系统。" },
            { q: "交换机功率不够会怎样？", a: "交换机会掐掉优先级最低的端口，或者摄像机夜里红外一开就反复重启——一种很难排查的漂移故障。" },
            { q: "PoE交换机要接地吗？", a: "要，和所有有源设备一样：接地加室外线路防雷，既保交换机也保摄像机——楼宇间的长线路尤其如此。" },
          ],
      },
    },
  },
  {
    slug: "videonablyudenie-cherez-telefon",
    date: "2026-07-29",
    related: ["cctv"],
    hubs: ["ip-kamery"],
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
    hubs: ["ip-kamery", "kommutatory"],
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
    hubs: ["ip-videoregistratory-nvr", "zhestkie-diski"],
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
    hubs: ["ip-kamery"],
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
    hubs: ["ip-kamery", "marshrutizatory"],
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
          { h: "Сколько это стоит", p: [
            "Самый доступный вариант — 4G-роутер с обычными камерами: к смете стандартной системы добавляются роутер, антенна и SIM-карта с пакетом трафика. Камеры со встроенной SIM дороже обычных примерно в полтора-два раза, зато не требуют роутера вовсе — выгодно для одной-двух точек. Автономный комплект с солнечной панелью и аккумулятором — самое дорогое решение, его берут там, где нет и электричества.",
            "Ежемесячные расходы определяет трафик: просмотр по событиям расходует гигабайты, постоянная трансляция — десятки гигабайт. Мы настраиваем запись на карту памяти или регистратор, а в сеть отдаём только тревожные события и просмотр по запросу — так пакета в 20–30 ГБ хватает даже на несколько камер.",
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
          { h: "Bu qancha turadi", p: [
            "Eng arzon variant — oddiy kameralar bilan 4G-router: standart tizim smetasiga router, antenna va trafik paketli SIM-karta qo'shiladi. Ichki SIM li kameralar oddiylaridan bir yarim-ikki baravar qimmat, lekin routerni umuman talab qilmaydi — bir-ikki nuqta uchun foydali. Quyosh paneli va akkumulyatorli avtonom komplekt — eng qimmat yechim, uni elektr ham yo'q joylarda olishadi.",
            "Oylik xarajatlarni trafik belgilaydi: hodisalar bo'yicha ko'rish gigabaytlarni, doimiy translyatsiya o'nlab gigabaytlarni sarflaydi. Biz yozuvni xotira kartasi yoki registratorga sozlaymiz, tarmoqqa faqat trevoga hodisalari va so'rov bo'yicha ko'rishni beramiz — shunda 20–30 GB paket bir necha kameraga ham yetadi.",
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
          { h: "What it costs", p: [
            "The most affordable option is a 4G router with regular cameras: the standard system estimate gains a router, an antenna and a SIM with a data plan. Cameras with a built-in SIM cost roughly one and a half to two times more but need no router at all — worthwhile for one or two points. An autonomous kit with a solar panel and battery is the priciest and is chosen where there is no electricity either.",
            "Monthly costs come down to traffic: event-based viewing burns gigabytes, continuous streaming — tens of them. We configure recording to an SD card or a recorder and send only alarm events and on-demand viewing over the network, so a 20–30 GB plan covers even several cameras.",
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
          { h: "Maliyeti ne kadar", p: [
            "En uygun seçenek sıradan kameralarla 4G router: standart sistem keşfine router, anten ve tarifeli SIM eklenir. Dahili SIM'li kameralar sıradanından bir buçuk-iki kat pahalıdır ama router hiç istemez — bir-iki nokta için mantıklıdır. Güneş panelli ve aküllü otonom set en pahalısıdır; elektriğin de olmadığı yerlerde tercih edilir.",
            "Aylık gideri trafik belirler: olay bazlı izleme gigabaytlar, sürekli yayın onlarca gigabayt yakar. Kaydı SD karta veya kayıt cihazına alır, ağa yalnızca alarm olaylarını ve talep üzerine izlemeyi veririz — böylece 20–30 GB'lık paket birkaç kameraya bile yeter.",
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
          { h: "要花多少钱", p: [
            "最省的方案是4G路由器配普通摄像机：在标准系统预算上加一台路由器、天线和带流量套餐的SIM卡。内置SIM的摄像机比普通款贵约一倍半到两倍，但完全不需要路由器——一两个点位很划算。带太阳能板和电池的自供电套装最贵，用在连电都没有的地方。",
            "月度开销取决于流量：按事件查看耗费几个GB，持续直播则是几十GB。我们把录像存到存储卡或录像机，网络上只传报警事件和按需查看——这样20–30GB的套餐带几台摄像机都够用。",
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
    hubs: ["kommutatory", "telekommunikacionnye-shkafy"],
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
          { h: "KVM по IP-сети и матричные системы", p: [
            "Классическая пара «передатчик — приёмник» соединяет одно рабочее место с одним компьютером. Когда машин и операторов много, выгоднее KVM-over-IP: передатчики и приёмники включаются в обычный гигабитный коммутатор, и любой оператор переключается на любой компьютер горячей клавишей. Так строятся диспетчерские, посты охраны и серверные с десятками машин.",
            "Матричный режим добавляет видеостены: один источник выводится на несколько экранов или несколько источников — на одну стену. Важно закладывать под KVM-over-IP отдельный VLAN или физически выделенный коммутатор: несжатый видеопоток загружает сеть, и соседство с офисным трафиком портит и картинку, и работу сети.",
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
          { h: "IP-tarmoq orqali KVM va matritsali tizimlar", p: [
            "Klassik «uzatgich — qabul qilgich» jufti bitta ish o'rnini bitta kompyuter bilan bog'laydi. Mashinalar va operatorlar ko'p bo'lsa, KVM-over-IP foydaliroq: uzatgich va qabul qilgichlar oddiy gigabit kommutatorga ulanadi, istalgan operator istalgan kompyuterga tezkor tugma bilan o'tadi. Dispetcherlik, qo'riqlash postlari va o'nlab mashinali serverxonalar shunday quriladi.",
            "Matritsali rejim videodevorlarni qo'shadi: bitta manba bir nechta ekranga yoki bir nechta manba bitta devorga chiqariladi. KVM-over-IP uchun alohida VLAN yoki jismonan ajratilgan kommutator rejalashtirish muhim: siqilmagan videopotok tarmoqni yuklaydi, ofis trafigi bilan qo'shnichilik ham tasvirni, ham tarmoq ishini buzadi.",
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
          { h: "KVM over IP and matrix systems", p: [
            "The classic transmitter–receiver pair links one workplace to one computer. With many machines and operators, KVM-over-IP pays off: transmitters and receivers plug into an ordinary gigabit switch, and any operator hot-keys to any computer. That is how control rooms, guard posts and server rooms with dozens of machines are built.",
            "Matrix mode adds video walls: one source goes to several screens, or several sources to one wall. Plan a dedicated VLAN or a physically separate switch for KVM-over-IP: the uncompressed video stream loads the network, and sharing it with office traffic spoils both the picture and the network.",
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
          { h: "IP üzerinden KVM ve matris sistemler", p: [
            "Klasik verici–alıcı çifti bir çalışma yerini bir bilgisayara bağlar. Makine ve operatör sayısı arttığında KVM-over-IP kazandırır: verici ve alıcılar sıradan gigabit switch'e takılır, her operatör kısayol tuşuyla istediği bilgisayara geçer. Kumanda odaları, güvenlik noktaları ve onlarca makineli sistem odaları böyle kurulur.",
            "Matris modu video duvarları ekler: bir kaynak birden çok ekrana, ya da birden çok kaynak tek duvara verilir. KVM-over-IP için ayrı VLAN veya fiziksel ayrık switch planlayın: sıkıştırılmamış video akışı ağı yükler; ofis trafiğiyle komşuluk hem görüntüyü hem ağı bozar.",
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
          { h: "IP网络KVM与矩阵系统", p: [
            "经典的发射端—接收端一对一连接一个工位和一台电脑。机器和操作员多时，KVM-over-IP更合算：收发器都接进普通千兆交换机，任何操作员按热键即可切到任何电脑。调度室、安保岗和几十台机器的机房都是这样搭的。",
            "矩阵模式还能做视频墙：一个信号源上多块屏，或多个源上一面墙。KVM-over-IP务必规划独立VLAN或物理独立的交换机：无压缩视频流很吃带宽，和办公流量混跑既毁画面也拖垮网络。",
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
    hubs: ["kommutatory", "telekommunikacionnye-shkafy"],
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
          { h: "Сколько стоит слаботочка", p: [
            "В бюджете стройки слаботочные системы обычно занимают 3–7% — на порядок меньше отделки, но именно они определяют, будет ли здание работать: связь, безопасность, контроль доступа. Цена складывается из проекта, кабельной инфраструктуры, оборудования и пусконаладки; кабель и монтаж часто составляют до половины сметы, поэтому объединение систем в общие трассы даёт заметную экономию.",
            "Ориентиры для оценки: офис на 20–30 рабочих мест со СКС, видеонаблюдением, СКУД и пожарной сигнализацией — от нескольких сотен миллионов сумов; точную цифру даёт только проект. Мы считаем смету бесплатно по планировке объекта — с разбивкой по системам, чтобы заказчик видел, из чего складывается сумма, и мог поэтапно распределить бюджет.",
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
          { h: "Kuchsiz tok tizimlari qancha turadi", p: [
            "Qurilish byudjetida kuchsiz tok tizimlari odatda 3–7% ni egallaydi — pardozdan ancha kam, lekin bino ishlashini aynan ular belgilaydi: aloqa, xavfsizlik, kirish nazorati. Narx loyiha, kabel infratuzilmasi, uskuna va ishga tushirishdan yig'iladi; kabel va montaj ko'pincha smetaning yarmigacha boradi, shuning uchun tizimlarni umumiy trassalarga birlashtirish sezilarli tejash beradi.",
            "Baholash uchun mo'ljallar: SKS, videokuzatuv, SKUD va yong'in signalizatsiyali 20–30 ish o'rinli ofis — bir necha yuz million so'mdan; aniq raqamni faqat loyiha beradi. Biz smetani obyekt planirovkasi bo'yicha bepul hisoblaymiz — tizimlar bo'yicha taqsimlab, buyurtmachi summa nimadan yig'ilishini ko'rsin va byudjetni bosqichma-bosqich taqsimlay olsin.",
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
          { h: "What low-current systems cost", p: [
            "In a construction budget, low-current systems usually take 3–7% — far less than finishing, yet they decide whether the building works: communications, security, access control. The price is made of design, cable infrastructure, equipment and commissioning; cable and installation often reach half the estimate, so merging systems into shared routes brings real savings.",
            "Reference points: an office for 20–30 workplaces with SCS, CCTV, access control and a fire alarm starts from several hundred million UZS; only a design gives the exact figure. We calculate the estimate free of charge from the floor plan — broken down by system, so the client sees what the sum is made of and can phase the budget.",
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
          { h: "Zayıf akım ne kadar tutar", p: [
            "İnşaat bütçesinde zayıf akım sistemleri genelde %3–7 yer tutar — ince işlerden kat kat az; ama binanın çalışıp çalışmayacağını onlar belirler: iletişim, güvenlik, geçiş kontrolü. Fiyat proje, kablo altyapısı, ekipman ve devreye almadan oluşur; kablo ve montaj çoğu kez keşfin yarısına ulaşır, bu yüzden sistemleri ortak güzergâhlarda birleştirmek ciddi tasarruf sağlar.",
            "Değerlendirme için referans: SCS, kamera, geçiş kontrolü ve yangın alarmı olan 20–30 kişilik ofis birkaç yüz milyon UZS'den başlar; kesin rakamı yalnızca proje verir. Keşfi kat planına göre ücretsiz çıkarırız — sistem sistem ayrılmış hâlde; müşteri tutarın neyden oluştuğunu görür ve bütçeyi aşamalara bölebilir.",
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
          { h: "弱电系统要花多少钱", p: [
            "在建筑预算里弱电系统通常占3–7%——远低于装修，但楼宇能否运转恰恰由它决定：通信、安防、门禁。费用由设计、线缆基础设施、设备和调试构成；线缆和施工常占预算一半，因此把各系统合并进公共线槽能省下可观的钱。",
            "估算参考：一个20–30个工位、含综合布线、监控、门禁和火灾报警的办公室，从数亿苏姆起步；准确数字只有设计能给出。我们按平面图免费出预算——按系统拆分，让甲方看清钱花在哪，并可分期安排。",
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
    hubs: ["kommutatory"],
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
          { h: "Пассивный PoE и совместимость", p: [
            "Кроме стандартов 802.3af/at/bt существует пассивный PoE: напряжение подаётся в кабель без согласования с устройством. Так питается часть оборудования MikroTik и Ubiquiti — но подключать к пассивному инжектору камеру, рассчитанную на стандарт, опасно: она может получить 24 В вместо ожидаемых 48 В и не заработать или выйти из строя.",
            "Правило совместимости простое: стандартный PoE-коммутатор безопасен для любых устройств — перед подачей питания он опрашивает потребителя и ничего не подаст в неподдерживающий порт. Пассивное питание допустимо только в паре «инжектор и устройство одного производителя с одинаковым напряжением». Сомневаетесь — пришлите модели, проверим по спецификациям.",
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
          { h: "Passiv PoE va moslik", p: [
            "802.3af/at/bt standartlaridan tashqari passiv PoE mavjud: kuchlanish kabelga qurilma bilan kelishuvsiz beriladi. MikroTik va Ubiquiti uskunalarining bir qismi shunday quvvatlanadi — lekin standartga mo'ljallangan kamerani passiv injektorga ulash xavfli: u kutilgan 48 V o'rniga 24 V olishi va ishlamasligi yoki buzilishi mumkin.",
            "Moslik qoidasi oddiy: standart PoE-kommutator istalgan qurilma uchun xavfsiz — quvvat berishdan oldin u iste'molchini so'raydi va qo'llamaydigan portga hech narsa bermaydi. Passiv quvvatlash faqat «bir ishlab chiqaruvchining bir xil kuchlanishli injektori va qurilmasi» juftida joiz. Shubhalansangiz — modellarni yuboring, spetsifikatsiyalar bo'yicha tekshiramiz.",
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
          { h: "Passive PoE and compatibility", p: [
            "Besides the 802.3af/at/bt standards there is passive PoE: voltage goes into the cable with no negotiation with the device. Part of MikroTik and Ubiquiti gear is powered this way — but plugging a standards-based camera into a passive injector is risky: it may receive 24 V instead of the expected 48 V and fail to start or break.",
            "The compatibility rule is simple: a standard PoE switch is safe for any device — before powering it interrogates the consumer and feeds nothing into a non-supporting port. Passive power is acceptable only as a pair of injector and device from one vendor at one voltage. In doubt — send us the models, we will check the specs.",
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
          { h: "Pasif PoE ve uyumluluk", p: [
            "802.3af/at/bt standartlarının yanında pasif PoE vardır: gerilim, cihazla anlaşma olmadan kabloya verilir. MikroTik ve Ubiquiti ekipmanının bir kısmı böyle beslenir — ama standarda göre yapılmış kamerayı pasif enjektöre takmak risklidir: beklediği 48 V yerine 24 V alabilir, çalışmaz ya da bozulur.",
            "Uyumluluk kuralı basit: standart PoE switch her cihaz için güvenlidir — güç vermeden önce tüketiciyi sorgular ve desteklemeyen porta hiçbir şey basmaz. Pasif besleme yalnızca aynı üreticinin aynı gerilimli enjektör-cihaz çiftinde kabul edilir. Emin değilseniz modelleri gönderin, spesifikasyonlardan kontrol edelim.",
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
          { h: "无源PoE与兼容性", p: [
            "在802.3af/at/bt标准之外还有无源PoE：电压不经协商直接进线。MikroTik和Ubiquiti的部分设备就是这样供电的——但把按标准设计的摄像机接到无源供电器上有风险：它可能收到24V而不是预期的48V，轻则不启动，重则损坏。",
            "兼容规则很简单：标准PoE交换机对任何设备都安全——供电前会先询问受电端，不支持的端口一点电也不给。无源供电只允许“同一厂商、同一电压的供电器配设备”成对使用。拿不准就把型号发给我们，按规格书帮您核对。",
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
    hubs: ["ip-kamery"],
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
        { h: "2026-yil sentyabr: katalogdan real narx orientirlari", p: ["Toshkentdagi omborimizdagi joriy «...dan» narxlar: Wi-Fi kamera — 197 900 so'mdan, 2 Mp IP-kamera — 234 900 so'mdan, aylanuvchi mini-PTZ — 221 900 so'mdan, 4 Mp IP-kamera — 395 900 so'mdan, NVR registrator — 308 900 so'mdan. Bular katalogdagi eng arzon modellari; brend va funksiyalarga qarab narx yuqoriroq bo'ladi.", "To'plam narxini taxminan hisoblash oson: kameralar + registrator + har kameraga 8–12 metr kabel va quvvat. 4 kamerali bazaviy to'plam montaj bilan odatda kvartira darajasidagi byudjetga sig'adi — aniq smeta uchun obyekt rejasini yuboring, bir kunda hisoblab beramiz."] }],
        faq: [{ q: "Kamera o'rnatish narxi qancha?", a: "O'rnatish kameralar soni va kabel uzunligiga bog'liq: bitta kamera montaji o'rtacha 150–300 ming so'm, 4 kamerali to'plam kalit topshirish bilan — smetaga qarab. Muhandis chiqishi va hisob-kitob bepul." },
          { q: "Eng arzon kamera qancha turadi?", a: "Oddiy ichki Wi-Fi kamera 300–500 ming so'mdan boshlanadi. Ko'cha uchun sifatli IP-kamera odatda 700 ming so'mdan yuqori." },
          { q: "4 kameradan iborat to'plam qancha bo'ladi?", a: "Uskuna, registrator, disk, kabel va montaj bilan birga — obyektga bog'liq. Muhandis chiqib, bepul smeta tuzib beradi." },
          { q: "Registrator shartmi?", a: "1–2 kamera uchun xotira kartasi yetarli. 3+ kamera va uzoq arxiv kerak bo'lsa — registrator arzonroq va ishonchliroq." },
          { q: "Kafolat bormi?", a: "Ha, barcha uskunaga rasmiy kafolat va montaj ishlariga kafolat beramiz." },
        { q: "Nega narxlar «...dan» ko'rsatilgan?", a: "Kamera narxi ruxsat, brend va funksiyalarga (ColorVu, ANPR, PTZ) bog'liq. «...dan» — katalogdagi eng arzon joriy model; aniq narxlar katalogda, smeta bepul." }],
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
        { h: "Сентябрь 2026: реальные ориентиры цен из каталога", p: ["Актуальные цены «от» со склада в Ташкенте: Wi-Fi камера — от 197 900 сум, IP-камера 2 Мп — от 234 900, поворотная мини-PTZ — от 221 900, IP-камера 4 Мп — от 395 900, регистратор NVR — от 308 900 сум. Это самые доступные модели каталога; бренд и функции поднимают цену выше.", "Комплект прикидывается просто: камеры + регистратор + по 8–12 метров кабеля и питание на каждую точку. Базовый комплект на 4 камеры с монтажом обычно укладывается в квартирный бюджет — за точной сметой пришлите план объекта, посчитаем за день."] }],
        faq: [{ q: "Сколько стоит установка одной камеры?", a: "Монтаж зависит от числа камер и длины кабеля: одна камера — в среднем 150–300 тысяч сум, комплект из 4 камер под ключ — по смете. Выезд инженера и расчёт бесплатные." },
          { q: "Сколько стоит самая недорогая камера?", a: "Простая внутренняя Wi-Fi камера — от 300–500 тысяч сум. Качественная уличная IP-камера обычно от 700 тысяч сум." },
          { q: "Во сколько обойдётся комплект из 4 камер?", a: "Зависит от объекта: оборудование, регистратор, диск, кабель и монтаж. Инженер выезжает и составляет смету бесплатно." },
          { q: "Обязателен ли регистратор?", a: "Для 1–2 камер достаточно карты памяти. От 3 камер и при необходимости длинного архива регистратор дешевле и надёжнее." },
          { q: "Есть ли гарантия?", a: "Да, на всё оборудование — официальная гарантия, на монтажные работы — гарантия компании." },
        { q: "Почему цены указаны «от»?", a: "Цена камеры зависит от разрешения, бренда и функций (ColorVu, ANPR, PTZ). «От» — самая доступная актуальная модель каталога; точные цены в каталоге, смета бесплатна." }],
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
        { h: "September 2026: real price anchors from the catalogue", p: ["Current from-prices from Tashkent stock: a Wi-Fi camera from 197,900 UZS, a 2 MP IP camera from 234,900, a mini PTZ from 221,900, a 4 MP IP camera from 395,900, an NVR from 308,900 UZS. These are the most affordable catalogue models; brand and features raise the price.", "A kit is easy to estimate: cameras + a recorder + 8–12 metres of cable and power per point. A basic 4-camera kit with installation usually fits an apartment-level budget — send the floor plan for an exact quote within a day."] }],
        faq: [
          { q: "How much does installing one camera cost?", a: "Installation depends on the number of cameras and cable length: a single camera averages 150,000–300,000 UZS, a turnkey 4-camera kit is priced by estimate. The engineer's visit and calculation are free." },
          { q: "How much is the cheapest camera?", a: "A basic indoor Wi-Fi camera starts at 300,000–500,000 UZS. A quality outdoor IP camera usually starts from 700,000 UZS." },
          { q: "What will a 4-camera kit cost?", a: "It depends on the site: equipment, recorder, hard drive, cable and installation. An engineer visits and prepares the estimate free of charge." },
          { q: "Is a recorder mandatory?", a: "For 1–2 cameras a memory card is enough. From 3 cameras up, or when you need long footage retention, a recorder is cheaper and more reliable." },
          { q: "Is there a warranty?", a: "Yes — all equipment carries an official manufacturer warranty, and installation work is covered by our company warranty." },
        { q: "Why are prices shown as from?", a: "A camera's price depends on resolution, brand and features (ColorVu, ANPR, PTZ). The from-price is the most affordable current model; exact prices are in the catalogue, quotes are free." }],
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
        { h: "Eylül 2026: katalogdan gerçek fiyat çapaları", p: ["Taşkent stoğundan güncel başlangıç fiyatları: Wi-Fi kamera 197.900 UZS'den, 2 MP IP kamera 234.900'den, mini PTZ 221.900'den, 4 MP IP kamera 395.900'den, NVR 308.900 UZS'den. Bunlar katalogun en uygun modelleri; marka ve özellikler fiyatı yükseltir.", "Seti kestirmek kolaydır: kameralar + kayıt cihazı + nokta başına 8–12 metre kablo ve besleme. Montajlı 4 kameralık temel set genelde daire bütçesine sığar — kesin teklif için planı gönderin, bir günde hesaplayalım."] }],
        faq: [
          { q: "Bir kameranın montajı ne kadar?", a: "Montaj, kamera sayısına ve kablo uzunluğuna bağlıdır: tek kamera ortalama 150.000–300.000 UZS, 4 kameralık anahtar teslim set keşif sonrası fiyatlandırılır. Mühendis ziyareti ve hesaplama ücretsizdir." },
          { q: "En ucuz kamera ne kadar?", a: "Basit bir iç mekân Wi-Fi kamera 300.000–500.000 UZS'den başlar. Kaliteli bir dış mekân IP kamera genellikle 700.000 UZS'den başlar." },
          { q: "4 kameralık set kaça mal olur?", a: "Mekâna bağlıdır: ekipman, kayıt cihazı, disk, kablo ve montaj. Mühendis ücretsiz keşfe gelir ve fiyat teklifini hazırlar." },
          { q: "Kayıt cihazı şart mı?", a: "1–2 kamera için hafıza kartı yeterlidir. 3 kameradan itibaren ve uzun arşiv gerektiğinde kayıt cihazı hem daha ucuz hem daha güvenilirdir." },
          { q: "Garanti var mı?", a: "Evet, tüm ekipmanda resmi garanti, montaj işlerinde ise şirket garantisi vardır." },
        { q: "Fiyatlar neden başlangıç olarak verildi?", a: "Kamera fiyatı çözünürlük, marka ve özelliklere bağlıdır. Başlangıç fiyatı katalogdaki en uygun güncel modeldir; kesin fiyatlar katalogda, teklif ücretsizdir." }],
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
        { h: "2026年9月：目录里的真实价格参照", p: ["塔什干现货的当前起价：Wi-Fi摄像机197,900苏姆起，2MP IP摄像机234,900起，迷你球机221,900起，4MP IP摄像机395,900起，NVR录像机308,900苏姆起。这些是目录中最实惠的型号；品牌和功能会抬高价格。", "套装很好估算：摄像机+录像机+每点8–12米线缆和供电。含安装的4路基础套装通常在公寓级预算内——发来平面图，一天内给出精确报价。"] }],
        faq: [
          { q: "安装一台摄像头多少钱？", a: "安装费取决于摄像头数量和布线长度：单台摄像头平均15万–30万苏姆，4台摄像头的整套交钥匙方案按报价单计算。工程师上门与核算免费。" },
          { q: "最便宜的摄像头多少钱？", a: "简单的室内Wi-Fi摄像头约30万–50万苏姆起。优质室外IP摄像头一般70万苏姆起。" },
          { q: "4台摄像头的整套方案要多少钱？", a: "取决于现场情况：设备、录像机、硬盘、线缆和安装。工程师免费上门并出具报价单。" },
          { q: "必须配录像机吗？", a: "1–2台摄像头用存储卡即可。3台以上或需要较长录像保存期时，录像机更划算也更可靠。" },
          { q: "有质保吗？", a: "有。所有设备均提供官方质保，安装工程由公司提供质保。" },
        { q: "为什么价格标注为「起」？", a: "摄像机价格取决于分辨率、品牌和功能（ColorVu、车牌识别、PTZ）。起价是目录中当前最实惠的型号；准确价格见目录，报价免费。" }],
      },
    },
  },
  {
    slug: "videokuzatuv-ornatish-narxi",
    date: "2026-07-30",
    related: ["cctv"],
    hubs: ["ip-kamery", "ip-videoregistratory-nvr"],
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
          { h: "Buyurtmachilar qayerda pul yo'qotadi", p: [
            "Uch eng qimmat xato: maxsus disk o'rniga kompyuter diski (kecha-kunduz yozuvdan birinchi bo'lib o'ladi), detalizatsiya kerak kassaga arzon kamera va quvvat zaxirasisiz «qanday bo'lsa» kabel — qishda uzoq kameralar qayta yuklana boshlaydi. Bu tejashlarning har biri narx farqidan qimmatga tushadi.",
            "To'g'ri tartib boshqa: avval bepul chiqish va zonalar vazifalariga hisob, keyin to'liq smeta — kameralar, registrator, disk, kabel, montaj va yashirin to'lovlarsiz telefonlarni sozlash. Shunda tizim birinchi qishgacha emas, yillab ishlaydi.",
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
          { h: "На чём заказчики теряют деньги", p: [
            "Три самые дорогие ошибки: компьютерный диск вместо специализированного (умирает от круглосуточной записи первым), дешёвая камера на кассе, где нужна детализация, и кабель «какой был» без запаса по питанию — зимой дальние камеры начинают перезагружаться. Каждая из этих экономий стоит дороже разницы в цене.",
            "Правильный порядок другой: сначала бесплатный выезд и расчёт под задачи зон, затем смета целиком — камеры, регистратор, диск, кабель, монтаж и настройка телефонов без скрытых доплат. Так система работает годами, а не до первой зимы.",
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
          { h: "Where customers lose money", p: [
            "The three costliest mistakes: a desktop disk instead of a surveillance-rated one (it dies first from round-the-clock recording), a cheap camera at the till where detail matters, and \"whatever cable was around\" without power margin — in winter the far cameras start rebooting. Each of these savings costs more than the price difference.",
            "The right order is different: first a free survey and a calculation per zone task, then a complete estimate — cameras, recorder, disk, cable, installation and phone setup with no hidden charges. That way the system works for years, not until the first winter.",
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
          { h: "Müşteriler nerede para kaybeder", p: [
            "En pahalı üç hata: gözetim sınıfı yerine masaüstü disk (7/24 kayıttan önce o ölür), detayın önemli olduğu kasada ucuz kamera ve güç payı olmayan «eldeki» kablo — kışın uzak kameralar yeniden başlamaya başlar. Bu tasarrufların her biri fiyat farkından pahalıya oturur.",
            "Doğru sıra farklıdır: önce ücretsiz keşif ve bölge görevlerine göre hesap, sonra komple teklif — kameralar, kayıt cihazı, disk, kablo, montaj ve gizli ücretsiz telefon kurulumu. Böylece sistem ilk kışa kadar değil, yıllarca çalışır.",
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
          { h: "客户最容易在哪里赔钱", p: [
            "三个最贵的错误：用电脑硬盘代替监控盘（7×24录像最先累死的就是它）、在需要细节的收银台装便宜摄像机、用「手头现有」的线缆不留供电余量——到了冬天远端摄像机开始反复重启。每一项省钱都比差价更贵。",
            "正确的顺序是另一种：先免费勘测、按各区任务核算，然后整套报价——摄像机、录像机、硬盘、线缆、施工和手机配置，没有隐藏加价。这样系统才能用上几年，而不是撑到第一个冬天。",
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
    hubs: ["turnikety-i-shlagbaumy"],
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
          { h: "Монтаж и связки, которые делают проходную", p: [
            "Турникет без окружения — просто механика: рабочей проходную делают анкеровка в пол, ограждения, калитка для маломобильных и грузов, резервированное питание и связка со СКУД. По сигналу пожарной тревоги планки складываются, а калитки открываются — эта связка обязательна по нормам и закладывается в проект.",
            "Интеграция с учётом времени превращает проходную в источник табеля для 1С, а привязка проходов к видеозаписи закрывает споры. Монтируем проходные за один-два дня, обучаем охрану и администратора, обслуживаем по договору.",
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
          { h: "Prohodnayani yaratadigan montaj va bog'lamlar", p: [
            "Atrofisiz turniket — shunchaki mexanika: prohodnayani ishchi qiladigan narsalar — polga ankerlash, to'siqlar, imkoniyati cheklanganlar va yuklar uchun kalitka, zaxiralangan quvvat va SKUD bilan bog'lam. Yong'in trevogasi signali bo'yicha plankalar yig'iladi, kalitkalar ochiladi — bu bog'lam me'yorlar bo'yicha majburiy va loyihaga kiritiladi.",
            "Vaqt hisobi bilan integratsiya prohodnayani 1C uchun tabel manbaiga aylantiradi, o'tishlarni videoyozuvga bog'lash bahslarni yopadi. Prohodnayalarni bir-ikki kunda montaj qilamiz, qo'riq va administratorni o'rgatamiz, shartnoma bo'yicha xizmatlaymiz.",
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
          { h: "The installation and links that make an entrance", p: [
            "A turnstile without its surroundings is just mechanics: what makes the entrance work is floor anchoring, railings, a gate for wheelchair users and loads, redundant power and the access control link. On a fire alarm the arms drop and the gates open — this link is mandatory by code and goes into the design.",
            "Integration with time attendance turns the entrance into a timesheet source for the ERP, and tying passages to video closes disputes. We install entrances in one or two days, train the guards and the administrator, and service under contract.",
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
          { h: "Girişi giriş yapan montaj ve bağlar", p: [
            "Çevresi olmayan turnike yalnız mekaniktir: girişi çalışır kılan şeyler zemine ankraj, korkuluklar, engelliler ve yükler için kapı, yedekli besleme ve geçiş kontrolü bağıdır. Yangın alarmında kollar düşer, kapılar açılır — bu bağ normlarca zorunludur ve projeye konur.",
            "Mesai entegrasyonu girişi ERP için puantaj kaynağına çevirir; geçişleri videoya bağlamak tartışmaları kapatır. Girişleri bir-iki günde kurar, güvenliği ve yöneticiyi eğitir, sözleşmeyle bakarız.",
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
          { h: "让门岗成为门岗的安装与联动", p: [
            "光秃秃的闸机只是机械：让门岗真正运转的是地面锚固、护栏、供轮椅和货物的边门、冗余供电和与门禁的联动。火灾报警时落杆、边门放开——这一联动是规范强制项，要写进设计。",
            "接入考勤后门岗变成1C考勤表的数据源，通行绑定录像让争议无处遁形。门岗一到两天装好，培训保安和管理员，按合同维保。",
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
          { h: "Что входит в комплект кроме панели", p: [
            "Вызывная панель — только видимая часть: для работающей двери нужны электромеханический или магнитный замок, доводчик, блок питания с резервным аккумулятором и кнопка выхода. Для подъезда добавляется антивандальное исполнение. Экономия на доводчике заканчивается хлопающей дверью и разбитым замком за полгода.",
            "IP-домофоны окупают разницу удобством: вызов приходит на смартфон, где бы вы ни были, а связка со СКУД пускает своих по карте. Считаем комплект целиком под вашу дверь или подъезд — выезд и смета бесплатны.",
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
          { h: "Panel dan tashqari to'plamga nima kiradi", p: [
            "Chaqiruv paneli — faqat ko'rinadigan qism: ishlaydigan eshikka elektromexanik yoki magnit qulf, dovodchik, zaxira akkumulyatorli quvvat bloki va chiqish tugmasi kerak. Podyezdga antivandal bajarilish qo'shiladi. Dovodchikda tejash yarim yilda taraqlaydigan eshik va singan qulf bilan tugaydi.",
            "IP-domofonlar farqni qulaylik bilan oqlaydi: chaqiruv qayerda bo'lsangiz ham smartfonga keladi, SKUD bilan bog'lam o'zinikilarni karta bilan kiritadi. To'plamni eshigingiz yoki podyezdingiz uchun to'liq hisoblaymiz — chiqish va smeta bepul.",
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
          { h: "What the kit includes besides the panel", p: [
            "The door panel is only the visible part: a working door needs an electromechanical or magnetic lock, a closer, a power supply with a backup battery and an exit button. An entrance block adds a vandal-proof build. Saving on the closer ends with a slamming door and a broken lock within half a year.",
            "IP intercoms repay the difference in convenience: the call reaches your smartphone wherever you are, and the access control link lets residents in by card. We quote the complete kit for your door or entrance — the visit and the estimate are free.",
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
          { h: "Panel dışında sete ne girer", p: [
            "Zil paneli yalnız görünen kısımdır: çalışan kapıya elektromekanik veya manyetik kilit, kapı kapatıcı, yedek akülü güç kaynağı ve çıkış butonu gerekir. Apartman girişine vandala dayanıklı yapı eklenir. Kapatıcıdan kısmak, yarım yılda çarpan kapı ve kırık kilitle biter.",
            "IP diafonlar farkı konforla öder: çağrı nerede olursanız olun telefonunuza gelir, geçiş kontrolü bağı sakinleri kartla içeri alır. Seti kapınız veya girişiniz için komple hesaplarız — keşif ve teklif ücretsizdir.",
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
          { h: "套件里除了门口机还有什么", p: [
            "门口机只是看得见的部分：一扇能用的门还需要电机锁或磁力锁、闭门器、带备用电池的电源和出门按钮。单元门再加防破坏外壳。省掉闭门器的结局：半年后门砰砰作响、锁被砸坏。",
            "IP对讲用便利偿还差价：无论身在何处呼叫都到手机，联动门禁后住户刷卡即入。按您的门或单元整套核算——上门和报价免费。",
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
    hubs: ["pozharnaya-bezopasnost", "ognetushiteli"],
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
          { h: "Обслуживание: без него система не считается", p: [
            "Смонтированная сигнализация без обслуживания — это просроченный огнетушитель на стене: формально есть, фактически нет. Нормы требуют регламентных проверок с записями в журнале, и именно журнал ТО инспектор открывает первым. Пыль в камерах извещателей — главный источник ложных тревог, которые отучают персонал реагировать.",
            "Мы берём системы на регламент: чистка и проверка извещателей, тест оповещения, замена аккумуляторов, ведение журнала. Обслуживаем и системы, смонтированные другими подрядчиками, — после бесплатного аудита с честной дефектной ведомостью.",
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
          { h: "Xizmat: usiz tizim hisobga o'tmaydi", p: [
            "Xizmatsiz montaj qilingan signalizatsiya — devordagi muddati o'tgan o't o'chirgich: rasman bor, amalda yo'q. Me'yorlar jurnalga yozuvli reglament tekshiruvlarni talab qiladi, inspektor birinchi bo'lib aynan TX jurnalini ochadi. Xabar beruvchi kameralaridagi chang — xodimlarni javob berishdan bezdiradigan yolg'on trevogalarning bosh manbai.",
            "Tizimlarni reglamentga olamiz: xabar beruvchilarni tozalash va tekshirish, ogohlantirish testi, akkumulyatorlarni almashtirish, jurnal yuritish. Boshqa pudratchilar montaj qilgan tizimlarga ham xizmat ko'rsatamiz — halol nuqson vedomostli bepul auditdan keyin.",
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
          { h: "Maintenance: without it the system does not count", p: [
            "An installed alarm without maintenance is an expired extinguisher on the wall: formally present, practically absent. The codes require scheduled checks with log entries, and the maintenance log is the first thing an inspector opens. Dust in detector chambers is the main source of false alarms that teach the staff to ignore the system.",
            "We take systems onto a schedule: cleaning and testing detectors, checking the sounders, replacing batteries, keeping the log. We also service systems installed by other contractors — after a free audit with an honest defect list.",
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
          { h: "Bakım: onsuz sistem sayılmaz", p: [
            "Bakımı olmayan kurulu alarm, duvardaki süresi geçmiş söndürücü gibidir: resmen var, fiilen yok. Normlar deftere işlenen programlı kontrolleri ister; müfettişin ilk açtığı şey bakım defteridir. Dedektör haznelerindeki toz, personeli tepki vermemeye alıştıran yanlış alarmların baş kaynağıdır.",
            "Sistemleri programa alırız: dedektör temizliği ve testi, anons denemesi, akü değişimi, defter tutma. Başka yüklenicilerin kurduğu sistemlere de bakarız — dürüst kusur listesiyle ücretsiz denetimden sonra.",
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
          { h: "维保：没有它系统等于没装", p: [
            "装好却不维保的报警系统，就像墙上过期的灭火器：形式上有，实际上没有。规范要求按计划检查并记入台账，检查员第一个翻的就是维保台账。探测器暗室里的灰尘是误报的头号来源——而误报会教会员工对警报无动于衷。",
            "我们承接定期规程：清洁和测试探测器、试验广播、更换电池、登记台账。别的承包商装的系统也接——先做免费审计，出一份诚实的缺陷清单。",
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
    hubs: ["ip-videoregistratory-nvr", "zhestkie-diski"],
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
          { h: "Настройка, которая продлевает архив", p: [
            "Правильно настроенная детекция движения удлиняет архив в разы: регистратор пишет постоянно только кассу и вход, остальные зоны — по событию. Модели с AcuSense фильтруют ложные срабатывания от веток и животных, и уведомления на телефон снова начинают что-то значить.",
            "Вторая настройка, о которой забывают, — двойной поток: основной в архив, лёгкий для просмотра с телефона. Без него мобильное приложение «жуёт» трафик и тормозит. Мы настраиваем оба потока, детекцию и доступ с телефонов при каждом монтаже — это входит в цену.",
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
          { h: "Arxivni uzaytiradigan sozlash", p: [
            "To'g'ri sozlangan harakat detektsiyasi arxivni bir necha barobar uzaytiradi: registrator faqat kassa va kirishni doimiy yozadi, qolgan zonalar — hodisa bo'yicha. AcuSense li modellar shox va hayvonlardan yolg'on ishga tushishlarni filtrlaydi, telefonga bildirishnomalar yana nimanidir anglata boshlaydi.",
            "Unutiladigan ikkinchi sozlash — ikkilangan oqim: asosiysi arxivga, yengili telefondan ko'rishga. Usiz mobil ilova trafik «chaynaydi» va tormozlaydi. Har montajda ikkala oqim, detektsiya va telefonlardan kirishni sozlaymiz — bu narxga kiradi.",
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
          { h: "The configuration that stretches the archive", p: [
            "Properly configured motion detection stretches the archive severalfold: the recorder writes continuously only for the till and the entrance, the rest by event. AcuSense models filter false triggers from branches and animals — and phone notifications start meaning something again.",
            "The second forgotten setting is the dual stream: the main one for the archive, a light one for phone viewing. Without it the mobile app chews traffic and lags. We configure both streams, detection and phone access at every installation — it is included in the price.",
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
          { h: "Arşivi uzatan yapılandırma", p: [
            "Doğru kurulan hareket algılama arşivi kat kat uzatır: kayıt cihazı yalnız kasayı ve girişi sürekli yazar, kalan bölgeleri olaya göre. AcuSense modeller dallardan ve hayvanlardan gelen yanlış tetiklemeleri süzer — telefon bildirimleri yeniden anlam kazanır.",
            "Unutulan ikinci ayar çift akıştır: ana akış arşive, hafif akış telefondan izlemeye. Onsuz mobil uygulama trafiği yer ve takılır. Her montajda iki akışı, algılamayı ve telefon erişimini kurarız — fiyata dahildir.",
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
          { h: "让存储更耐用的配置", p: [
            "调好移动侦测能让存储时长翻几倍：录像机只对收银台和入口连续录像，其余区域按事件触发。带AcuSense的型号过滤树枝和动物的误触发——手机推送重新变得有意义。",
            "第二个常被遗忘的设置是双码流：主码流进存储，轻码流供手机观看。没有它，手机应用既费流量又卡顿。我们每次施工都配好双码流、侦测和手机访问——包含在价格里。",
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
    hubs: ["pozharnaya-bezopasnost", "ognetushiteli"],
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
          { h: "Xizmat ko'rsatish: tizim yashashi kerak", p: [
            "Tizimni o'rnatish — ishning yarmi: yong'in signalizatsiyasi muntazam texnik xizmatni talab qiladi. Har oy priborlar va datchiklarning ishlashi tekshiriladi, yiliga bir marta o't o'chirgichlar ko'rikdan o'tkaziladi va reglament bo'yicha qayta zaryadlanadi, nosozliklar esa «qachondir» emas, darhol bartaraf etiladi — tekshiruvda inspektor xizmat jurnalini ham ko'radi.",
            "Datchiklar vaqt o'tishi bilan changlanadi va yo jim qoladi, yo yolg'on trevoga beradi — ikkalasi ham xavfli: birinchisi yong'inni o'tkazib yuboradi, ikkinchisi xodimlarni sirenani e'tiborsiz qoldirishga o'rgatadi. Biz o'rnatilgan tizimlarga xizmat shartnomalarini tuzamiz: rejali tashriflar, datchiklarni tozalash, hujjat yuritish va nosozlikda yetib borish.",
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
          { h: "Обслуживание: система должна жить", p: [
            "Смонтировать систему — половина дела: пожарная сигнализация требует регулярного технического обслуживания. Ежемесячно проверяется работоспособность приборов и датчиков, раз в год огнетушители осматриваются и по регламенту перезаряжаются, а неисправности устраняются не «когда-нибудь», а сразу — на проверке инспектор смотрит и журнал обслуживания.",
            "Датчики со временем пылятся и начинают либо молчать, либо давать ложные тревоги — обе ситуации опасны: первая пропустит пожар, вторая приучит персонал игнорировать сирену. Мы заключаем договоры на обслуживание смонтированных систем: плановые визиты, чистка датчиков, ведение документации и выезд при неисправности.",
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
      en: {
        title: "Fire Safety for Business: Systems, Requirements and Prices",
        excerpt: "What business fire safety consists of: alarm systems, voice evacuation, extinguishers. What inspectors check and what it all costs in Tashkent.",
        sections: [
          { h: "What a fire safety system consists of", p: [
            "A complete system has four parts: a fire alarm (smoke and heat detectors, a control panel), a voice evacuation system, primary extinguishing means — extinguishers and fire cabinets — and marked, lit escape routes.",
            "A small office often needs only an alarm and extinguishers. A shop, a warehouse, a workshop and any place where people gather also requires voice evacuation — one of the first things an inspection checks.",
          ] },
          { h: "What is required of a business", p: [
            "Any commercial site must meet fire safety requirements: a working alarm, extinguishers within their service date, clear escape routes and a responsible employee. The inspector will also ask for documents: the system design, a maintenance contract, the extinguisher log.",
            "The most common violations are expired extinguishers, dead detectors and escape exits blocked by storage. All of these carry fines up to suspension of operations.",
          ] },
          { h: "What a fire alarm costs", p: [
            "The price depends on the number of rooms and the floor area: they determine the detectors, cable and panel type. A kit for a small office (3–5 rooms) with installation usually starts from a few million UZS; warehouses are quoted per site.",
            "Our engineer's visit and the estimate are free: we survey the site, plan the detectors and give the exact price within a day. Rubezh, Bolid and Hikvision equipment from stock in Tashkent.",
          ] },
          { h: "Extinguishers: which and how much", p: [
            "The standard choice for offices and shops is powder OP-4/OP-5 extinguishers; where there is a lot of electronics, CO2 units are added. Prices start from a few hundred thousand UZS depending on volume.",
            "Extinguishers and fire safety equipment are in our catalogue — UZS prices, in stock in Tashkent. We will calculate how many you need and where to place them.",
          ] },
          { h: "Maintenance: the system must stay alive", p: [
            "Installing the system is half the job: a fire alarm needs regular maintenance. Devices and detectors are checked monthly, extinguishers are inspected yearly and recharged per schedule, and faults are fixed immediately, not 'someday' — during an inspection the officer also reads the maintenance log.",
            "Detectors gather dust over time and either go silent or raise false alarms — both are dangerous: the first misses a fire, the second teaches staff to ignore the siren. We sign maintenance contracts for installed systems: scheduled visits, detector cleaning, documentation and call-outs on failure.",
          ] },
          { h: "How to order", p: [
            "The process is simple: an engineer visits, measures the site, prepares the design and the estimate. Installation on a small site takes 1–3 days. After the work you receive the full document package, ready for inspection.",
            "We work with legal entities under contract with VAT invoices. Equipment carries an official warranty, installation a company warranty.",
          ] },
        ],
        faq: [
          { q: "How much does a fire alarm for an office cost?", a: "A kit for a small office with installation starts from a few million UZS. The exact price depends on the number of rooms — the engineer's visit and estimate are free." },
          { q: "What should be ready for an inspection?", a: "A working alarm, in-date extinguishers, clear escape routes and documents: the design, a maintenance contract, the extinguisher log. One site visit identifies what is missing." },
          { q: "How much does an extinguisher cost?", a: "Powder OP-4/OP-5 units start from a few hundred thousand UZS. They are in the catalogue; we advise on quantity by floor area." },
          { q: "How long does installation take?", a: "A small office — 1–3 days. On warehouses and large sites the timeline follows the design and is stated in the estimate." },
          { q: "Do you help with the paperwork?", a: "Yes: the design, installation acts, diagrams and the log are handed over as a full package. We work with legal entities with VAT under contract." },
        ],
      },
      tr: {
        title: "İşletmeler için Yangın Güvenliği: Sistemler, Şartlar ve Fiyatlar",
        excerpt: "İşletme yangın güvenliği nelerden oluşur: alarm, sesli tahliye, yangın tüpleri. Denetimde neler sorulur ve Taşkent'te tüm bunlar ne kadar tutar.",
        sections: [
          { h: "Yangın güvenliği sistemi nelerden oluşur", p: [
            "Tam bir sistem dört bölümden oluşur: yangın alarmı (duman ve ısı dedektörleri, kontrol paneli), sesli tahliye sistemi, birincil söndürme araçları — yangın tüpleri ve dolapları — ve işaretli, aydınlatılmış kaçış yolları.",
            "Küçük bir ofise çoğu zaman alarm ve tüpler yeterlidir. Mağaza, depo, atölye ve insanların toplandığı her yerde sesli tahliye de gerekir — denetimde ilk bakılan şeylerden biri budur.",
          ] },
          { h: "İşletmelerden neler istenir", p: [
            "Her ticari tesis yangın güvenliği şartlarını karşılamalıdır: çalışan alarm, süresi geçmemiş tüpler, açık kaçış yolları ve sorumlu personel. Denetçi belgeleri de sorar: sistem projesi, bakım sözleşmesi, tüp kayıt defteri.",
            "En sık ihlaller: süresi geçmiş tüpler, çalışmayan dedektörler ve depoya dönüşmüş kaçış koridorları. Bunlar para cezasından faaliyet durdurmaya kadar gider.",
          ] },
          { h: "Yangın alarmı ne kadar tutar", p: [
            "Fiyat oda sayısına ve alana bağlıdır: dedektör sayısı, kablo ve panel tipi buradan çıkar. Küçük ofis (3–5 oda) için montajlı set genellikle birkaç milyon UZS'den başlar; depolarda keşif sonrası fiyat verilir.",
            "Mühendis keşfi ve fiyat teklifi ücretsizdir. Rubezh, Bolid ve Hikvision ekipmanları Taşkent'teki depodan.",
          ] },
          { h: "Yangın tüpleri: hangisi, ne kadar", p: [
            "Ofis ve mağazalar için standart seçim toz tipi OP-4/OP-5 tüplerdir; elektroniğin yoğun olduğu yerlere CO2 tüpleri eklenir. Fiyatlar hacme göre birkaç yüz bin UZS'den başlar.",
            "Tüpler ve yangın güvenliği ürünleri kataloğumuzda — UZS fiyatlı, Taşkent'te stokta. Alana göre kaç adet ve nereye konulacağını hesaplarız.",
          ] },
          { h: "Bakım: sistem yaşamalı", p: [
            "Sistemi kurmak işin yarısı: yangın alarmı düzenli bakım ister. Cihazlar ve dedektörler her ay kontrol edilir, tüpler yılda bir gözden geçirilip programa göre yeniden doldurulur; arızalar 'bir ara' değil hemen giderilir — denetimde müfettiş bakım defterine de bakar.",
            "Dedektörler zamanla tozlanır ve ya susar ya yanlış alarm verir — ikisi de tehlikelidir: ilki yangını kaçırır, ikincisi personeli sireni umursamamaya alıştırır. Kurduğumuz sistemlere bakım sözleşmesi yapıyoruz: planlı ziyaretler, dedektör temizliği, evrak takibi ve arızada müdahale.",
          ] },
          { h: "Nasıl sipariş verilir", p: [
            "Süreç basit: mühendis gelir, tesisi ölçer, proje ve teklifi hazırlar. Küçük tesiste montaj 1–3 gün sürer. İş bitince denetime hazır tam evrak paketi teslim edilir.",
            "Tüzel kişilerle KDV'li sözleşmeyle çalışırız. Ekipmanda resmi, montajda şirket garantisi vardır.",
          ] },
        ],
        faq: [
          { q: "Ofis için yangın alarmı ne kadar?", a: "Küçük ofis için montajlı set birkaç milyon UZS'den başlar. Kesin fiyat oda sayısına bağlıdır — keşif ve teklif ücretsizdir." },
          { q: "Denetime ne hazırlanmalı?", a: "Çalışan alarm, süresi geçmemiş tüpler, açık kaçış yolları ve belgeler: proje, bakım sözleşmesi, tüp defteri. Eksikleri tek keşifte belirleriz." },
          { q: "Yangın tüpü ne kadar?", a: "Toz tipi OP-4/OP-5 — birkaç yüz bin UZS'den. Katalogda mevcut; alana göre adet öneririz." },
          { q: "Montaj ne kadar sürer?", a: "Küçük ofis — 1–3 gün. Büyük tesislerde süre projeye bağlıdır ve teklifte belirtilir." },
          { q: "Evraklarda yardım ediyor musunuz?", a: "Evet: proje, montaj tutanakları, şemalar ve defter tam paket halinde teslim edilir." },
        ],
      },
      zh: {
        title: "企业消防安全：系统、要求与价格",
        excerpt: "企业消防安全包括什么：报警系统、语音疏散、灭火器。检查时会查什么，在塔什干这一切要花多少钱。",
        sections: [
          { h: "消防安全系统的组成", p: [
            "完整系统由四部分组成：火灾报警（烟感和温感探测器、控制主机）、语音疏散系统、初级灭火器材（灭火器和消防柜）以及有标识和照明的疏散通道。",
            "小型办公室通常只需报警系统和灭火器。商店、仓库、车间以及人员聚集场所还需要语音疏散系统——这是检查时首先要看的项目之一。",
          ] },
          { h: "对企业的要求", p: [
            "任何商业场所都必须符合消防要求：报警系统正常工作、灭火器在有效期内、疏散通道畅通并有专责人员。检查人员还会查阅文件：系统设计、维保合同、灭火器台账。",
            "最常见的违规是灭火器过期、探测器失效以及疏散出口被货物堵塞。这些都可能导致罚款甚至停业。",
          ] },
          { h: "火灾报警系统的价格", p: [
            "价格取决于房间数量和面积：由此确定探测器数量、线缆和主机类型。小型办公室（3–5间）的整套系统含安装通常从几百万苏姆起；仓库按现场核算。",
            "工程师上门和报价免费。Rubezh、Bolid 和 Hikvision 设备塔什干现货。",
          ] },
          { h: "灭火器：选哪种、多少钱", p: [
            "办公室和商店的标准选择是 OP-4/OP-5 干粉灭火器；电子设备多的场所会加配二氧化碳灭火器。价格按容量从几十万苏姆起。",
            "灭火器和消防器材在我们的目录中——苏姆计价，塔什干现货。我们会按面积计算所需数量和摆放位置。",
          ] },
          { h: "维保：系统必须一直活着", p: [
            "装好系统只是一半：火灾报警需要定期维保。每月检查主机和探测器是否正常，灭火器每年检视并按规程再充装，故障要立刻处理而不是“改天”——消防检查时检查员也会翻维保记录。",
            "探测器日久积尘，要么失灵沉默，要么频繁误报——两种都危险：前者漏掉火情，后者让员工习惯性无视警报。我们为已装系统签维保合同：计划巡检、探测器清洁、台账记录、故障上门。",
          ] },
          { h: "如何订购", p: [
            "流程简单：工程师上门测量，出设计和报价。小型场所安装 1–3 天。完工后移交全套文件，可直接用于检查。",
            "与法人单位按合同和增值税发票合作。设备享官方保修，安装享公司保修。",
          ] },
        ],
        faq: [
          { q: "办公室火灾报警系统多少钱？", a: "小型办公室整套含安装从几百万苏姆起。具体价格取决于房间数量——上门和报价免费。" },
          { q: "检查前要准备什么？", a: "正常工作的报警系统、有效期内的灭火器、畅通的疏散通道及文件：设计、维保合同、灭火器台账。" },
          { q: "灭火器多少钱？", a: "OP-4/OP-5 干粉灭火器从几十万苏姆起。目录有货，按面积建议数量。" },
          { q: "安装需要多久？", a: "小型办公室 1–3 天。大型场所按设计定，报价中注明。" },
          { q: "帮助办理文件吗？", a: "是：设计、安装记录、图纸和台账整套移交。与法人按增值税合同合作。" },
        ],
      },
    },
  },
  {
    slug: "lokal-tarmoq-narxi",
    date: "2026-08-26",
    related: ["network", "wifi", "fiber"],
    hubs: ["kommutatory", "wi-fi-tochki-dostupa"],
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
          { h: "Kelajak uchun zaxira: kabel toifasi va PoE", p: [
            "Kabel o'n yil va undan ko'proqqa yotqiziladi, shuning uchun toifada tejash foydasiz: Cat5e gigabitni yopadi, lekin Cat6 narxdagi 10–15% farq bilan qisqa liniyalarda 10G gacha zaxira beradi. Kabelning o'zi smetaning kichik qismi, ta'mirdan keyin qayta yotqizish esa butun dastlabki tarmoqdan qimmatga tushadi.",
            "Ikkinchi zaxira — kabel orqali quvvat: oddiy o'rniga PoE-kommutator keyinroq elektriksiz va yangi rozetkalarsiz kamera, Wi-Fi nuqtalari va IP-telefonlar qo'shish imkonini beradi. Bo'sh portlarni ham rejalashtiring: amaliyot ko'rsatadiki, bir-ikki yilda ofis +30–50% ulanishga o'sadi — rozetka va patch-panelni boshidanoq zaxira bilan qo'ygan ma'qul.",
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
          { h: "Запас на будущее: категория кабеля и PoE", p: [
            "Кабель прокладывается на десять и более лет, поэтому экономить на категории невыгодно: Cat5e закрывает гигабит, но Cat6 при разнице в цене 10–15% даёт запас до 10G на коротких линиях. Стоимость самого кабеля — малая часть сметы, а перекладка после ремонта обойдётся дороже всей исходной сети.",
            "Второй запас — питание по кабелю: PoE-коммутатор вместо обычного позволяет позже добавить камеры, точки Wi-Fi и IP-телефоны без электрика и новых розеток. Планируйте и свободные порты: практика показывает, что за пару лет офис дорастает до +30–50% подключений — розетки и патч-панель лучше заложить с запасом сразу.",
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
      en: {
        title: "Office Network Installation: Price and Stages",
        excerpt: "What a structured cabling system (LAN) costs for an office: cable, sockets, switch and Wi-Fi. What drives the price and how the work proceeds.",
        sections: [
          { h: "What a local network consists of", p: [
            "An office network is a structured cabling system: twisted-pair cable to every workplace, sockets, a patch panel and a server cabinet. A switch sits at the centre, a router distributes the internet, and Wi-Fi points cover wireless devices.",
            "In a properly built network, printers, cameras, IP phones and computers work as one system. Adding CCTV or telephony later is easy — the cable is already in place.",
          ] },
          { h: "What drives the price", p: [
            "Three main factors: the number of workplaces, cable run lengths and the state of the premises. A new build is easy to cable; a finished office needs conduit, trunking and careful work, which takes longer.",
            "Cable category matters too: Cat5e is enough for most offices, Cat6 is faster with headroom. The server cabinet, switch class and Wi-Fi coverage also go into the estimate.",
          ] },
          { h: "Average prices", p: [
            "In practice the count is per workplace: one complete point — cable, socket, termination and testing — averages a few hundred thousand UZS. A 10–15 seat office network with switch and cabinet usually comes to a few million UZS by estimate.",
            "The engineer's visit and estimate are free. Cable, sockets and switches from stock in Tashkent.",
          ] },
          { h: "When fibre is needed", p: [
            "Between buildings, along long corridors and beyond 90 metres copper does not work — optical fibre is used. Fibre resists lightning, is fast and indifferent to distance.",
            "We lay and splice fibre, measure it with an OTDR and hand it over with a passport. The office LAN and inter-building fibre go in one project.",
          ] },
          { h: "Headroom for the future: cable category and PoE", p: [
            "Cabling goes in for ten years or more, so saving on category does not pay: Cat5e covers gigabit, but Cat6 at a 10–15% price difference gives headroom up to 10G on short runs. The cable itself is a small share of the estimate, while re-laying it after renovation costs more than the whole original network.",
            "The second reserve is power over the cable: a PoE switch instead of a plain one lets you add cameras, Wi-Fi points and IP phones later without an electrician or new outlets. Plan spare ports too: in practice an office grows by 30–50% of connections within a couple of years — put in outlets and patch panel capacity from the start.",
          ] },
          { h: "Work stages", p: [
            "First the design: workplaces, routes and the cabinet location on the plan. Then installation: cabling, sockets, patch panel and switch. Finally every line is tested and handed over with diagrams.",
            "A small office is usually ready in 1–3 days. We work with legal entities under VAT contracts and warranty the work.",
          ] },
        ],
        faq: [
          { q: "How much does one workplace cost?", a: "Cable, socket, termination and test — a few hundred thousand UZS on average. The exact price depends on run lengths — the estimate is free." },
          { q: "What does a 10-person office network cost?", a: "With cable, sockets, switch and cabinet — usually a few million UZS. An engineer visits and produces the exact estimate within a day." },
          { q: "Cat5e or Cat6?", a: "Cat5e is enough for a regular office. For heavy files, video and future headroom we recommend Cat6 — the price difference is small." },
          { q: "Will you add Wi-Fi too?", a: "Yes, we plan Wi-Fi points for coverage within the network design — stable signal in every corner." },
          { q: "How long does the work take?", a: "A small office — 1–3 days. Larger sites follow the design; the timeline is stated in the estimate." },
        ],
      },
      tr: {
        title: "Ofiste Yerel Ağ Kurulumu: Fiyat ve Aşamalar",
        excerpt: "Ofiste bilgisayar ağı (SKS) ne kadar tutar: kablo, prizler, switch ve Wi-Fi. Fiyatı ne belirler, iş hangi aşamalarla ilerler.",
        sections: [
          { h: "Yerel ağ nelerden oluşur", p: [
            "Ofis ağı yapısal kablolama sistemidir: her çalışma noktasına çift bükümlü kablo, prizler, patch panel ve sunucu kabini. Merkezde switch, interneti router dağıtır, kablosuz cihazlar için Wi-Fi noktaları eklenir.",
            "Doğru kurulmuş ağda yazıcı, kameralar, IP telefonlar ve bilgisayarlar tek sistemde çalışır. Sonradan kamera veya telefon eklemek kolaydır — kablo zaten çekilmiştir.",
          ] },
          { h: "Fiyatı ne belirler", p: [
            "Üç ana etken: çalışma noktası sayısı, kablo güzergâh uzunluğu ve mekânın durumu. Yeni binada kablo çekmek kolaydır; bitmiş ofiste kanal ve dikkatli işçilik gerekir, bu süreyi uzatır.",
            "Kablo kategorisi de önemlidir: çoğu ofise Cat5e yeter, Cat6 daha hızlı ve geleceğe dönüktür. Kabin, switch sınıfı ve Wi-Fi kapsaması da teklife girer.",
          ] },
          { h: "Ortalama fiyatlar", p: [
            "Pratikte hesap nokta başınadır: kablo, priz, sonlandırma ve test dahil tam bir nokta ortalama birkaç yüz bin UZS. Switch ve kabinli 10–15 kişilik ofis ağı genellikle birkaç milyon UZS tutar.",
            "Keşif ve teklif ücretsizdir. Kablo, priz ve switchler Taşkent'te stoktan.",
          ] },
          { h: "Fiber ne zaman gerekir", p: [
            "Binalar arasında, uzun koridorlarda ve 90 metreyi aşan mesafelerde bakır çalışmaz — fiber optik kullanılır. Fiber yıldırımdan etkilenmez, hızlıdır ve mesafeye duyarsızdır.",
            "Fiberi döşer, ekleriz, OTDR ile ölçer ve pasaportuyla teslim ederiz. Ofis içi ağ ve binalar arası fiber tek projede.",
          ] },
          { h: "Gelecek payı: kablo kategorisi ve PoE", p: [
            "Kablo on yıl ve fazlası için döşenir; kategoriden kısmak kazandırmaz: Cat5e gigabiti karşılar ama Cat6, %10–15 fiyat farkıyla kısa hatlarda 10G'ye kadar pay bırakır. Kablonun kendisi keşfin küçük bir kısmıdır; tadilattan sonra yeniden döşemekse ilk ağın tamamından pahalıya gelir.",
            "İkinci pay kablodan güç: sıradan yerine PoE switch, sonradan elektrikçisiz ve yeni prizsiz kamera, Wi-Fi noktası ve IP telefon eklemeyi sağlar. Boş port da planlayın: pratikte ofis birkaç yılda bağlantıların %30–50'si kadar büyür — priz ve patch panel kapasitesini baştan geniş tutun.",
          ] },
          { h: "İş aşamaları", p: [
            "Önce proje: planda çalışma noktaları, güzergâhlar ve kabin yeri. Sonra montaj: kablolama, prizler, patch panel ve switch bağlantısı. Sonda her hat test edilir, şemalarla teslim edilir.",
            "Küçük ofis genelde 1–3 günde hazır olur. Tüzel kişilerle KDV'li sözleşmeyle çalışır, işe garanti veririz.",
          ] },
        ],
        faq: [
          { q: "Bir çalışma noktası ne kadar?", a: "Kablo, priz, bağlantı ve test — ortalama birkaç yüz bin UZS. Kesin fiyat güzergâh uzunluğuna bağlıdır — teklif ücretsizdir." },
          { q: "10 kişilik ofis ağı ne kadar?", a: "Kablo, prizler, switch ve kabinle — genellikle birkaç milyon UZS. Mühendis keşfe gelir, bir günde kesin teklifi çıkarır." },
          { q: "Cat5e mi Cat6 mı?", a: "Normal ofise Cat5e yeter. Büyük dosya, video ve gelecek payı için Cat6 öneririz — fiyat farkı azdır." },
          { q: "Wi-Fi de yapıyor musunuz?", a: "Evet, ağ projesinde Wi-Fi noktalarını kapsamaya göre planlarız — her köşede stabil sinyal." },
          { q: "İş ne kadar sürer?", a: "Küçük ofis — 1–3 gün. Büyük tesislerde süre projeye bağlıdır, teklifte belirtilir." },
        ],
      },
      zh: {
        title: "办公室局域网布线：价格与流程",
        excerpt: "办公室综合布线（局域网）要花多少钱：线缆、插座、交换机和 Wi-Fi。价格由什么决定，施工分哪些阶段。",
        sections: [
          { h: "局域网的组成", p: [
            "办公网络是一套综合布线系统：每个工位的双绞线、插座、配线架和机柜。核心是交换机，路由器分配互联网，无线设备由 Wi-Fi 热点覆盖。",
            "正确搭建的网络中，打印机、摄像机、IP 电话和电脑在同一系统内工作。以后加装监控或电话也容易——线已到位。",
          ] },
          { h: "价格由什么决定", p: [
            "三个主要因素：工位数量、线缆路由长度和场地状况。新建场所布线简单便宜；装修完的办公室需要线槽和精细施工，耗时更多。",
            "线缆类别也有影响：Cat5e 满足多数办公室，Cat6 更快且有余量。机柜、交换机级别和 Wi-Fi 覆盖也计入报价。",
          ] },
          { h: "平均价格", p: [
            "实际按工位计价：一个完整点位——线缆、插座、端接和测试——平均几十万苏姆。10–15 工位的办公网络含交换机和机柜通常几百万苏姆。",
            "工程师上门和报价免费。线缆、插座和交换机塔什干现货。",
          ] },
          { h: "何时需要光纤", p: [
            "楼宇之间、长走廊和超过 90 米的距离铜缆无法工作——需要光纤。光纤防雷、速度快、不受距离影响。",
            "我们敷设并熔接光纤，用 OTDR 测量并附检测报告交付。室内网络和楼宇间光纤在同一项目内完成。",
          ] },
          { h: "为未来留余量：线缆类别与PoE", p: [
            "布线一装就是十年以上，在类别上省钱不划算：Cat5e够跑千兆，而Cat6只贵10–15%，短链路上留出了10G的余量。线缆本身只占预算一小部分，装修后重新布线却比整个原始网络还贵。",
            "第二个余量是网线供电：用PoE交换机替代普通款，日后加摄像机、Wi-Fi点和IP话机不必找电工、不必新增电源插座。也要规划空余端口：经验上办公室两三年内接入量会涨30–50%——插座和配线架一开始就留足。",
          ] },
          { h: "施工阶段", p: [
            "先设计：在图纸上标注工位、路由和机柜位置。然后施工：布线、插座、配线架和交换机。最后逐条链路测试并附图纸交付。",
            "小型办公室通常 1–3 天完工。与法人单位按增值税合同合作，施工享保修。",
          ] },
        ],
        faq: [
          { q: "一个工位多少钱？", a: "线缆、插座、端接和测试——平均几十万苏姆。具体取决于路由长度——报价免费。" },
          { q: "10 人办公室的网络多少钱？", a: "含线缆、插座、交换机和机柜——通常几百万苏姆。工程师上门一天内出准确报价。" },
          { q: "选 Cat5e 还是 Cat6？", a: "普通办公室 Cat5e 足够。传大文件、视频或留余量建议 Cat6，差价不大。" },
          { q: "也做 Wi-Fi 吗？", a: "是，网络设计中按覆盖规划 Wi-Fi 热点——每个角落信号稳定。" },
          { q: "施工需要多久？", a: "小型办公室 1–3 天。大型场所按设计定，报价中注明。" },
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
          { h: "Quvvat va svet o'chsa nima bo'ladi", p: [
            "Elektron qulfga bosh savol — elektr yo'g'ida o'zini tutishi. Elektromagnit qulf quvvat yo'qolganda ochiladi: evakuatsiya uchun bu plyus, himoya uchun minus, shuning uchun u akkumulyatorli zaxira quvvat bloki bilan juft qo'yiladi. Elektromexanik esa aksincha yopiq qoladi — va mexanik kalit bilan ochiladi.",
            "Batareykali aqlli qulflarning o'z reglamenti bor: komplekt yarim yil-bir yilga yetadi, zaryadsizlanish haqida qulf oldindan ogohlantiradi, eng oxirgi holat uchun avariya kaliti yoki «krona» batareykasiga tashqi razyom bor. Biz qulfni faqat narx va ko'rinishga emas, svet o'chish stsenariysini hisobga olib tanlaymiz.",
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
          { h: "Питание и что будет при отключении света", p: [
            "Главный вопрос к электронному замку — поведение без электричества. Электромагнитный при пропадании питания открывается: для эвакуации это плюс, для защиты — минус, поэтому его ставят в паре с резервным блоком питания с аккумулятором. Электромеханический, наоборот, остаётся заперт — и открывается механическим ключом.",
            "У smart-замков на батарейках свой регламент: комплекта хватает на полгода-год, о разряде замок предупреждает заранее, а на крайний случай есть аварийный ключ или внешний разъём для батарейки-«кроны». Мы подбираем замок с учётом сценария отключения — а не только по цене и внешнему виду.",
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
      en: {
        title: "Door Lock Prices: Electronic, Coded and Smart",
        excerpt: "What door locks cost in Tashkent: electromagnetic, electromechanical, coded and smart. What to choose for a flat, an office and a gate.",
        sections: [
          { h: "Lock types and price ranges", p: [
            "Electronic locks come in four main types. Electromagnetic — the most affordable, for office and entrance doors: from a few hundred thousand UZS. Electromechanical — for gates and outdoor doors, stays locked in a blackout. Coded opens from a keypad, smart — by phone, fingerprint or card.",
            "Smart locks run roughly 1–3 million UZS depending on features: fingerprint, app, temporary codes. A full system with biometric access-control readers costs more.",
          ] },
          { h: "For a flat: a smart lock", p: [
            "Flats usually get a smart lock: forgotten keys stop being a problem — you open by phone or fingerprint. Guests get temporary codes, and every opening sends a notification.",
            "Door type matters: not every lock fits every door. Our engineer inspects the door and recommends a matching model — the visit is free.",
          ] },
          { h: "For an office: lock + access control", p: [
            "In an office a lock connects to access control: staff enter by card or fingerprint, the log records who came and when. An employee leaves — access is revoked in one click.",
            "Paired with an intercom the lock opens from the monitor or the app. Where a fire alarm exists, escape doors must release on alarm — we always configure this.",
          ] },
          { h: "What installation costs", p: [
            "Installation depends on the door and lock type: an electromagnetic lock with an exit button is the simplest job; a smart lock or biometrics with setup costs a bit more. On average installation starts from a few hundred thousand UZS.",
            "The engineer's visit and estimate are free. Locks, readers and access equipment from stock in Tashkent with official warranty.",
          ] },
          { h: "Power, and what happens in a blackout", p: [
            "The key question for an electronic lock is its behavior without electricity. A magnetic lock opens when power drops: good for evacuation, bad for protection — so it is paired with a backup power unit with a battery. An electromechanical lock, on the contrary, stays locked — and opens with a mechanical key.",
            "Battery-powered smart locks have their own routine: a set lasts six months to a year, the lock warns of low charge in advance, and for the worst case there is an emergency key or an external 9V battery contact. We pick a lock for the blackout scenario — not just for price and looks.",
          ] },
          { h: "Where to buy and how to order", p: [
            "Our catalogue holds electromagnetic and smart locks, readers and accessories with UZS prices. Describe the task — a flat, an office or a gate — and we will match options and quote the exact installed price.",
            "We work with legal entities under VAT contracts. Official warranty on equipment, company warranty on installation.",
          ] },
        ],
        faq: [
          { q: "How much is the cheapest electronic lock?", a: "An electromagnetic lock with an exit button — from a few hundred thousand UZS. The installed price depends on the door — the estimate is free." },
          { q: "How much is a smart lock?", a: "Roughly 1–3 million UZS depending on features: fingerprint, app, temporary codes. We recommend a model for your door." },
          { q: "Will the lock open in a power cut?", a: "An electromagnetic one opens, an electromechanical one stays locked. Doors that must stay locked get electromechanics or a UPS." },
          { q: "Can it be opened from a phone?", a: "Yes — smart locks open from an app, and locks tied to access control or an intercom open from their apps, remotely too." },
          { q: "How long does installation take?", a: "One lock — a few hours. A full system with access control — 1–2 days." },
        ],
      },
      tr: {
        title: "Kapı Kilidi Fiyatları: Elektronik, Şifreli ve Akıllı",
        excerpt: "Taşkent'te kapı kilitleri ne kadar: elektromanyetik, elektromekanik, şifreli ve akıllı. Daire, ofis ve bahçe kapısı için hangisi seçilmeli.",
        sections: [
          { h: "Kilit tipleri ve fiyat aralıkları", p: [
            "Elektronik kilitler dört ana tiptedir. Elektromanyetik — en uygunu, ofis ve bina girişleri için: birkaç yüz bin UZS'den. Elektromekanik — bahçe kapıları ve dış kapılar için, elektrik kesilse de kilitli kalır. Şifreli tuş takımıyla, akıllı kilit telefon, parmak izi veya kartla açılır.",
            "Akıllı kilitler özelliklere göre yaklaşık 1–3 milyon UZS'dir. Biyometrik okuyuculu tam sistem daha pahalıdır.",
          ] },
          { h: "Daire için: akıllı kilit", p: [
            "Daireye çoğunlukla akıllı kilit takılır: unutulan anahtar sorunu biter — telefonla veya parmak iziyle açarsınız. Misafire geçici şifre verilir, her açılışta bildirim gelir.",
            "Kapı tipi önemlidir: her kilit her kapıya uymaz. Mühendisimiz kapıyı inceleyip uygun modeli önerir — keşif ücretsizdir.",
          ] },
          { h: "Ofis için: kilit + geçiş kontrolü", p: [
            "Ofiste kilit geçiş kontrolüne bağlanır: personel kart veya parmak iziyle girer, günlük kim ne zaman geldi kaydeder. Çalışan ayrılınca erişim tek tıkla iptal edilir.",
            "İnterkomla birlikte kilit monitörden veya uygulamadan açılır. Yangın alarmı olan yerlerde kaçış kapıları alarmda açılmak zorundadır — bunu her zaman ayarlarız.",
          ] },
          { h: "Montaj ne kadar", p: [
            "Montaj kapıya ve kilit tipine bağlıdır: çıkış butonlu elektromanyetik en basit iştir; akıllı kilit veya biyometri kurulumuyla biraz daha pahalıdır. Ortalama montaj birkaç yüz bin UZS'den başlar.",
            "Keşif ve teklif ücretsizdir. Kilitler ve okuyucular Taşkent'te stoktan, resmi garantili.",
          ] },
          { h: "Güç ve elektrik kesilince ne olur", p: [
            "Elektronik kilide baş soru elektriksiz davranışıdır. Manyetik kilit güç gidince açılır: tahliye için artı, koruma için eksidir — bu yüzden aküllü yedek güç kaynağıyla birlikte kurulur. Elektromekanik ise tersine kilitli kalır — ve mekanik anahtarla açılır.",
            "Pilli akıllı kilitlerin kendi düzeni var: bir takım pil altı ay-bir yıl gider, kilit azalmayı önceden bildirir; en kötü ihtimal için acil anahtar ya da harici 9V pil teması vardır. Kilidi yalnızca fiyata ve görünüşe değil, kesinti senaryosuna göre seçiyoruz.",
          ] },
          { h: "Nereden alınır, nasıl sipariş verilir", p: [
            "Kataloğumuzda elektromanyetik ve akıllı kilitler, okuyucular ve aksesuarlar UZS fiyatlarıyla mevcut. İhtiyacı anlatın — daire, ofis veya bahçe kapısı — uygun seçenekleri bulup montajlı kesin fiyatı hesaplayalım.",
            "Tüzel kişilerle KDV'li sözleşmeyle çalışırız. Ekipmanda resmi, montajda şirket garantisi.",
          ] },
        ],
        faq: [
          { q: "En ucuz elektronik kilit ne kadar?", a: "Çıkış butonlu elektromanyetik kilit — birkaç yüz bin UZS'den. Montajlı fiyat kapıya bağlıdır — teklif ücretsizdir." },
          { q: "Akıllı kilit ne kadar?", a: "Özelliklere göre yaklaşık 1–3 milyon UZS: parmak izi, uygulama, geçici şifreler. Kapınıza uygun modeli öneririz." },
          { q: "Elektrik kesilince kilit açılır mı?", a: "Elektromanyetik açılır, elektromekanik kilitli kalır. Hep kilitli kalması gereken kapılara elektromekanik veya UPS konur." },
          { q: "Telefondan açılabilir mi?", a: "Evet — akıllı kilitler uygulamadan; geçiş kontrolüne veya interkoma bağlı kilitler onların uygulamalarından, uzaktan da açılır." },
          { q: "Montaj ne kadar sürer?", a: "Tek kilit — birkaç saat. Geçiş kontrollü tam sistem — 1–2 gün." },
        ],
      },
      zh: {
        title: "门锁价格：电子锁、密码锁与智能锁",
        excerpt: "塔什干门锁价格：电磁锁、电机锁、密码锁和智能锁。公寓、办公室和院门该怎么选。",
        sections: [
          { h: "门锁类型与价格区间", p: [
            "电子锁有四种主要类型。电磁锁最实惠，适合办公室和楼道门：几十万苏姆起。电机锁适合院门和室外门，断电时保持锁闭。密码锁用键盘开启，智能锁用手机、指纹或卡片。",
            "智能锁按功能约 100–300 万苏姆：指纹、App、临时密码。带生物识别读头的整套门禁系统价格更高。",
          ] },
          { h: "公寓：智能锁", p: [
            "公寓通常装智能锁：忘带钥匙不再是问题——手机或指纹开门。可给客人发临时密码，每次开门都有通知。",
            "门的类型很重要：不是每把锁都适合每扇门。工程师上门查看并推荐匹配型号——上门免费。",
          ] },
          { h: "办公室：门锁 + 门禁", p: [
            "办公室的锁接入门禁系统：员工刷卡或指纹进入，日志记录出入。员工离职——一键撤销权限。",
            "与可视对讲配合，锁可从室内机或 App 开启。有火灾报警的场所，疏散门必须在报警时自动释放——我们始终会配置。",
          ] },
          { h: "安装费用", p: [
            "安装取决于门和锁的类型：带出门按钮的电磁锁最简单；智能锁或生物识别含调试略贵。安装平均几十万苏姆起。",
            "工程师上门和报价免费。锁具、读头和门禁设备塔什干现货，官方保修。",
          ] },
          { h: "供电问题：停电了怎么办", p: [
            "对电子锁的头号问题是断电后的表现。磁力锁断电即开：利于疏散，不利于防护——所以要配带电池的后备电源使用。电机锁则相反，断电保持上锁——用机械钥匙开启。",
            "电池款智能锁有自己的节奏：一组电池用半年到一年，电量不足会提前提醒，最坏情况还有应急钥匙或外接9V电池触点。我们选锁时把停电场景算进去——而不只是看价格和外观。",
          ] },
          { h: "在哪买、怎么订", p: [
            "目录中有电磁锁、智能锁、读头和配件，苏姆计价。说明需求——公寓、办公室或院门——我们匹配方案并给出含安装的准确价格。",
            "与法人单位按增值税合同合作。设备官方保修，安装公司保修。",
          ] },
        ],
        faq: [
          { q: "最便宜的电子锁多少钱？", a: "带出门按钮的电磁锁——几十万苏姆起。含安装价格取决于门——报价免费。" },
          { q: "智能锁多少钱？", a: "按功能约 100–300 万苏姆：指纹、App、临时密码。按您的门推荐型号。" },
          { q: "断电时锁会打开吗？", a: "电磁锁会打开，电机锁保持锁闭。须常闭的门装电机锁或配 UPS。" },
          { q: "能用手机开锁吗？", a: "能——智能锁用 App 开启；接入门禁或对讲的锁可远程开启。" },
          { q: "安装要多久？", a: "单把锁几小时。含门禁的整套系统 1–2 天。" },
        ],
      },
    },
  },

  {
    slug: "shlagbaum-narxi",
    date: "2026-08-26",
    related: ["barrier", "gates", "anpr"],
    hubs: ["turnikety-i-shlagbaumy"],
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
          { h: "Yashirin xarajat moddalari", p: [
            "Kirish smetasida shlagbaumdan tashqari montajda eslanadigan pozitsiyalar yashaydi: poydevor yoki zakladnoy, quvvat kirishi, strela kapotga yotmasligi uchun fotoelementlar va petlevoy detektor. TJMga mehmonlar uchun chaqiruv paneli va ANPR-kamera qo'shing — ularsiz qo'riq «domofonga qo'ng'iroq» bilan ishlashda davom etadi.",
            "Boshqaruv usulida tejash oqilona (pultlar ANPR dan arzon), lekin privod sinfida emas: intensiv kirishdagi maishiy shlagbaum — mavsumdan keyin almashtirish degani. Kirish guruhini to'liq hisoblaymiz va ishlar boshlanishidan oldin to'liq narxni aytamiz.",
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
          { h: "Скрытые статьи расходов", p: [
            "В смете въезда кроме шлагбаума живут позиции, о которых вспоминают на монтаже: фундамент или закладная, подвод питания, фотоэлементы и петлевой детектор, чтобы стрела не легла на капот. Для ЖК прибавьте вызывную панель для гостей и ANPR-камеру — без них охрана продолжит работать «звонком в домофон».",
            "Экономить разумно на способе управления (пульты дешевле ANPR), но не на классе привода: бытовой шлагбаум на интенсивном въезде — это замена через сезон. Считаем въездную группу целиком и называем полную цену до начала работ.",
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
      en: {
        title: "Barrier Gate Price in Tashkent: Supply and Installation",
        excerpt: "Automatic barrier prices in Tashkent: boom length, remotes and plate recognition (ANPR). What installation costs and what to choose for a yard, a car park and a checkpoint.",
        sections: [
          { h: "What drives the barrier price", p: [
            "Main factors: boom length (3 to 6 metres), duty cycle (a yard or a busy car park) and the brand. A basic automatic barrier for a yard with installation starts from a few million UZS; an intensive checkpoint needs a heavier drive and costs more.",
            "The control method matters too: a remote is standard, card readers or phone opening cost extra, and plate recognition (ANPR) is the most convenient but pricier due to the camera and software.",
          ] },
          { h: "Yard, car park or checkpoint", p: [
            "For a residential yard the typical setup is a 4–6 m boom, remotes and phone opening. A car park suits a ticket or plate-recognition system with automatic entry and accounting. At a company checkpoint the barrier ties into access control — only authorised vehicles enter.",
            "With ANPR regular cars enter by whitelist — the guard presses nothing, guests enter on request. It is the most demanded configuration for yards and office centres.",
          ] },
          { h: "What installation costs", p: [
            "The installation price covers the foundation, power feed, drive setup and safety sensors. A standard install takes about a day. The engineer's visit and estimate are free — we size the boom and the drive correctly on site.",
            "The right way to save is a correct design from the start: an undersized drive on a busy entrance fails quickly and costs more.",
          ] },
          { h: "Where to buy", p: [
            "Barriers, drives, remotes and ANPR cameras are in the catalogue — UZS prices, in stock in Tashkent. Describe the entrance and we will quote the exact installed price within a day.",
            "We work with legal entities under VAT contracts. Official warranty on equipment, company warranty on installation.",
          ] },
          { h: "The hidden cost lines", p: [
            "Besides the barrier, the entrance estimate holds items remembered only at installation: a foundation or embed, power supply, photocells and a loop detector so the boom never lands on a hood. For a residential complex add a guest call panel and an ANPR camera — without them the guards keep working \"by intercom call\".",
            "It is reasonable to save on the control method (remotes are cheaper than ANPR) but not on the drive class: a domestic barrier at an intensive entrance means replacement within a season. We quote the entrance as a whole and name the full price before work begins.",
          ] },
        ],
        faq: [
          { q: "How much is the cheapest barrier?", a: "A basic automatic barrier for a yard with installation — from a few million UZS. The exact price depends on boom length and duty — the estimate is free." },
          { q: "What does ANPR add?", a: "A camera and setup on top of the barrier price. Regular cars enter automatically by whitelist — the most convenient option for yards and offices." },
          { q: "How long does installation take?", a: "A standard install — 1 day: foundation, drive, setup. Complex sites are stated in the estimate." },
          { q: "What if a remote is lost?", a: "We program a new one and delete the lost one from the system. Phone opening can be set up so remotes are not needed at all." },
          { q: "Is there a warranty?", a: "Yes: official warranty on equipment and company warranty on installation. Service and parts in Tashkent." },
        ],
      },
      tr: {
        title: "Taşkent'te Bariyer Fiyatları: Ürün ve Montaj",
        excerpt: "Taşkent'te otomatik bariyer fiyatları: kol uzunluğu, kumandalar ve plaka tanıma (ANPR). Montaj ne kadar, avlu, otopark ve giriş için hangisi seçilmeli.",
        sections: [
          { h: "Bariyer fiyatını ne belirler", p: [
            "Ana etkenler: kol uzunluğu (3–6 metre), kullanım yoğunluğu (avlu mu, yoğun otopark mı) ve marka. Avlu için temel otomatik bariyer montajla birkaç milyon UZS'den başlar; yoğun girişe daha güçlü ve pahalı motor gerekir.",
            "Kontrol yöntemi de fiyata yansır: kumanda standarttır, kart okuyucu veya telefonla açma ek ücretlidir; plaka tanıma (ANPR) en konforlusudur ama kamera ve yazılım nedeniyle daha pahalıdır.",
          ] },
          { h: "Avlu, otopark ve giriş için seçim", p: [
            "Site avlusu için tipik çözüm: 4–6 m kol, kumandalar ve telefonla açma. Otoparka biletli veya plaka tanımalı sistem uygundur. İşletme girişinde bariyer geçiş kontrolüne bağlanır — yalnızca izinli araçlar girer.",
            "ANPR ile kayıtlı araçlar listeden otomatik girer, misafirler talep üzerine. Avlular ve ofis merkezlerinde en çok istenen konfigürasyon budur.",
          ] },
          { h: "Montaj ne kadar", p: [
            "Montaj fiyatına temel, güç hattı, motor ayarı ve güvenlik sensörleri girer. Standart montaj yaklaşık bir gün sürer. Keşif ve teklif ücretsizdir — kol boyunu ve motor gücünü yerinde doğru seçeriz.",
            "Doğru tasarruf baştan doğru projedir: yoğun girişte zayıf motor çabuk bozulur ve pahalıya patlar.",
          ] },
          { h: "Nereden alınır", p: [
            "Bariyerler, motorlar, kumandalar ve ANPR kameraları katalogda — UZS fiyatlı, Taşkent'te stokta. Girişi anlatın, montajlı kesin fiyatı bir günde hesaplayalım.",
            "Tüzel kişilerle KDV'li sözleşmeyle çalışırız. Ekipmanda resmi, montajda şirket garantisi.",
          ] },
          { h: "Gizli masraf kalemleri", p: [
            "Giriş teklifinde bariyerin yanında ancak montajda hatırlanan kalemler yaşar: temel veya ankraj, güç beslemesi, kolun kaputa inmemesi için fotoseller ve loop dedektörü. Siteye misafir zil paneli ve ANPR kamera ekleyin — onlarsız güvenlik «diafonu arayarak» çalışmaya devam eder.",
            "Kontrol yönteminden kısmak mantıklıdır (kumanda ANPR'den ucuz) ama motor sınıfından değil: yoğun girişteki ev tipi bariyer bir sezonda değişim demektir. Girişi bütün olarak hesaplar, işe başlamadan tam fiyatı söyleriz.",
          ] },
        ],
        faq: [
          { q: "En ucuz bariyer ne kadar?", a: "Avlu için temel otomatik bariyer montajla — birkaç milyon UZS'den. Kesin fiyat kol boyuna ve yoğunluğa bağlıdır — teklif ücretsizdir." },
          { q: "Plaka tanıma ne ekler?", a: "Bariyer fiyatına ANPR kamerası ve kurulum eklenir. Kayıtlı araçlar listeden otomatik girer — avlular için en pratik çözüm." },
          { q: "Montaj ne kadar sürer?", a: "Standart montaj — 1 gün: temel, motor, ayar. Karmaşık tesislerde süre teklifte belirtilir." },
          { q: "Kumanda kaybolursa?", a: "Yenisini programlar, kaybolanı sistemden sileriz. Telefonla açma da ayarlanabilir — kumandaya hiç gerek kalmaz." },
          { q: "Garanti var mı?", a: "Evet: ekipmanda resmi, montajda şirket garantisi. Servis ve yedek parça Taşkent'te." },
        ],
      },
      zh: {
        title: "塔什干道闸价格：设备与安装",
        excerpt: "塔什干自动道闸价格：闸杆长度、遥控器和车牌识别（ANPR）。安装多少钱，院区、停车场和门岗该怎么选。",
        sections: [
          { h: "道闸价格由什么决定", p: [
            "主要因素：闸杆长度（3–6 米）、使用强度（院区还是繁忙停车场）和品牌。院区基础自动道闸含安装从几百万苏姆起；高频门岗需要更强的电机，价格更高。",
            "控制方式也影响价格：遥控器是标配，刷卡或手机开闸加价，车牌识别（ANPR）最方便，但因摄像机和软件而更贵。",
          ] },
          { h: "院区、停车场和门岗怎么选", p: [
            "住宅院区的典型方案：4–6 米闸杆、遥控器和手机开闸。停车场适合取票或车牌识别系统，自动进出并记账。企业门岗的道闸接入门禁——只放行授权车辆。",
            "有 ANPR 时常驻车辆按白名单自动进入——保安无需按键，访客按请求放行。这是院区和写字楼最受欢迎的配置。",
          ] },
          { h: "安装费用", p: [
            "安装价格包含基础、供电、电机调试和安全传感器。标准安装约一天。工程师上门和报价免费——现场正确选定杆长和电机功率。",
            "省钱的正确方式是一开始就做对设计：繁忙入口配弱电机很快损坏，反而更贵。",
          ] },
          { h: "在哪购买", p: [
            "道闸、电机、遥控器和 ANPR 摄像机都在目录中——苏姆计价，塔什干现货。说明入口情况，一天内给出含安装的准确报价。",
            "与法人单位按增值税合同合作。设备官方保修，安装公司保修。",
          ] },
          { h: "隐藏的费用项", p: [
            "入口预算里除了道闸，还有那些到施工时才想起的项目：基础或预埋、供电、防止闸杆压上引擎盖的红外对射和地感线圈。小区还要加访客对讲面板和ANPR摄像机——没有它们，保安还得靠「打对讲电话」干活。",
            "在控制方式上省钱是合理的（遥控比车牌识别便宜），但电机等级不能省：高强度入口装家用道闸等于一季后重买。我们把入口整组核算，开工前就报出全价。",
          ] },
        ],
        faq: [
          { q: "最便宜的道闸多少钱？", a: "院区基础自动道闸含安装——几百万苏姆起。具体取决于杆长和使用强度——报价免费。" },
          { q: "加车牌识别贵多少？", a: "在道闸价格上加 ANPR 摄像机和调试。常驻车辆按白名单自动进入——院区最实用的方案。" },
          { q: "安装要多久？", a: "标准安装 1 天：基础、电机、调试。复杂场所在报价中注明。" },
          { q: "遥控器丢了怎么办？", a: "编程新遥控器并从系统删除丢失的。也可设置手机开闸——完全不需要遥控器。" },
          { q: "有保修吗？", a: "有：设备官方保修，安装公司保修。塔什干本地服务和配件。" },
        ],
      },
    },
  },

  {
    slug: "davomat-tizimi",
    date: "2026-08-26",
    related: ["attendance", "access"],
    hubs: ["turnikety-i-shlagbaumy"],
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
          { h: "Ma'lumotlar yo'li: terminaldan ish haqigacha", p: [
            "Hisob qiymati ma'lumotlar hisob-kitobgacha yetganda ochiladi: tabelni 1C ga yuklash qo'l ko'chirish va xatolarni olib tashlaydi, bo'limlar bo'yicha hisobotlar istalgan davr uchun kechikish va qayta ishlashlarni ko'rsatadi. Rahbar kun manzarasini oy oxirida emas, real vaqtda ko'radi.",
            "Qoidalarni siyosatingizga sozlaymiz — grafiklar, smenalar, kechikish ruxsatlari — va administratorni yangi xodimlarni mustaqil kiritishga o'rgatamiz. Joriy etish bir-ikki kun oladi va ishni to'xtatmaydi.",
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
          { h: "Дорога данных: из терминала в зарплату", p: [
            "Ценность учёта раскрывается, когда данные доезжают до расчёта: выгрузка табеля в 1С убирает ручной перенос и ошибки, отчёты по подразделениям показывают опоздания и переработки за любой период. Руководитель видит картину дня в реальном времени, а не в конце месяца.",
            "Мы настраиваем правила под вашу политику — графики, смены, допуски на опоздание — и обучаем администратора заводить новых сотрудников самостоятельно. Внедрение занимает пару дней и не останавливает работу.",
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
      en: {
        title: "Attendance System: Prices for Schools, Offices and Factories",
        excerpt: "What a biometric attendance system costs: Face ID terminals, cards, automatic timesheets and 1C export. Solutions for schools, offices and manufacturing.",
        sections: [
          { h: "How an attendance system works", p: [
            "A terminal goes at the entrance: an employee or pupil checks in by face (Face ID), fingerprint or card. The system logs arrival and departure times automatically, flags lateness and builds the timesheet itself.",
            "The difference from a paper log is fundamental: nobody can check in for someone else — a face or a fingerprint cannot be handed over — and the report exports in one click.",
          ] },
          { h: "For schools and learning centres", p: [
            "In schools attendance ties into parent notifications: the child enters the school — a message arrives on the parent's phone. Many private schools install the system for this feature alone.",
            "Learning centres track attendance by group and can link it to payments: attended lessons are counted automatically.",
          ] },
          { h: "For offices and manufacturing", p: [
            "In an office attendance merges with time tracking: lateness, overtime, timesheet export to 1C. Paired with a turnstile it also covers access control.",
            "Factories need shift schedules, night shifts and hundreds of staff — ZKTeco and Hikvision terminals pass several people per second.",
          ] },
          { h: "What it costs", p: [
            "A system with one Face ID terminal and setup starts from a few million UZS for a small office. For a school or a factory the price follows the number of entrances and people; turnstiles increase the estimate.",
            "The engineer's visit and estimate are free. Terminals from stock in Tashkent; installation usually takes a day; 1C integration is configured separately.",
          ] },
          { h: "How to order", p: [
            "Describe the task: how many people, how many entrances, where the timesheet goes. We match terminals and quote the exact installed price within a day.",
            "We work with legal entities under VAT contracts. Official warranty on equipment, company warranty on installation.",
          ] },
          { h: "The data's route: from terminal to payroll", p: [
            "Attendance shows its value when data reaches payroll: timesheet export to the ERP removes manual transfer and errors, and per-department reports show lateness and overtime for any period. The manager sees the day in real time, not at month end.",
            "We configure the rules to your policy — schedules, shifts, lateness allowances — and train the administrator to enroll new employees independently. Deployment takes a couple of days and does not stop the business.",
          ] },
        ],
        faq: [
          { q: "How much does an attendance system cost?", a: "With one Face ID terminal and setup — from a few million UZS. The exact price depends on entrances and headcount — the estimate is free." },
          { q: "Are there parent notifications for schools?", a: "Yes: when the child checks in, the parent gets a notification. It is the most requested feature among schools." },
          { q: "Do you integrate with 1C?", a: "Yes, the timesheet exports to 1C automatically — ready data goes straight into payroll." },
          { q: "Can someone check in for a colleague?", a: "Not with a face or a fingerprint: biometrics rejects another person. That is why we recommend biometric terminals over cards." },
          { q: "How long does installation take?", a: "One terminal — a few hours. A full system with turnstiles — 1–2 days." },
        ],
      },
      tr: {
        title: "Yoklama Sistemi: Okul, Ofis ve Fabrika İçin Fiyatlar",
        excerpt: "Biyometrik yoklama sistemi ne kadar: Face ID terminaller, kartlar, otomatik puantaj ve 1C aktarımı. Okul, ofis ve üretim için çözümler.",
        sections: [
          { h: "Yoklama sistemi nasıl çalışır", p: [
            "Girişe terminal konur: çalışan veya öğrenci yüz (Face ID), parmak izi veya kartla kaydolur. Sistem geliş-gidiş saatlerini otomatik yazar, gecikmeleri gösterir, puantajı kendisi oluşturur.",
            "Kağıt defterden farkı temeldir: kimse başkası adına kaydolamaz — yüz ve parmak izi devredilemez — rapor tek tuşla alınır.",
          ] },
          { h: "Okullar ve kurslar için", p: [
            "Okullarda yoklama veli bildirimlerine bağlanır: çocuk okula girdi — velinin telefonuna mesaj gider. Birçok özel okul sistemi sırf bu özellik için kurar.",
            "Kurslarda yoklama grup bazında tutulur ve ödemeyle ilişkilendirilebilir: katılınan dersler otomatik sayılır.",
          ] },
          { h: "Ofis ve üretim için", p: [
            "Ofiste yoklama mesai takibiyle birleşir: gecikmeler, fazla mesai, puantajın 1C'ye aktarımı. Turnikeyle birlikte geçiş kontrolü de çözülür.",
            "Fabrikada vardiya düzeni, gece vardiyaları ve yüzlerce çalışan önemlidir — ZKTeco ve Hikvision terminalleri saniyede birkaç kişiyi geçirir.",
          ] },
          { h: "Ne kadar tutar", p: [
            "Küçük ofis için tek Face ID terminalli sistem kurulumla birkaç milyon UZS'den başlar. Okul veya fabrikada fiyat giriş ve kişi sayısına bağlıdır; turnikeler teklifi büyütür.",
            "Keşif ve teklif ücretsizdir. Terminaller Taşkent'te stokta; kurulum genelde bir gün; 1C entegrasyonu ayrıca yapılır.",
          ] },
          { h: "Nasıl sipariş verilir", p: [
            "İhtiyacı anlatın: kaç kişi, kaç giriş, puantaj nereye aktarılacak. Uygun terminalleri seçip montajlı kesin fiyatı bir günde çıkaralım.",
            "Tüzel kişilerle KDV'li sözleşmeyle çalışırız. Ekipmanda resmi, montajda şirket garantisi.",
          ] },
          { h: "Verinin yolu: terminalden bordroya", p: [
            "Takibin değeri veri bordroya ulaşınca ortaya çıkar: puantajın ERP'ye aktarımı elle taşımayı ve hataları kaldırır; departman raporları her dönem için gecikme ve fazla mesaiyi gösterir. Yönetici günü ay sonunda değil, gerçek zamanlı görür.",
            "Kuralları politikanıza göre kurarız — çizelgeler, vardiyalar, gecikme payları — ve yöneticiye yeni çalışanları kendi başına eklemeyi öğretiriz. Kurulum birkaç gün sürer ve işi durdurmaz.",
          ] },
        ],
        faq: [
          { q: "Yoklama sistemi ne kadar?", a: "Tek Face ID terminal ve kurulumla — birkaç milyon UZS'den. Kesin fiyat giriş ve kişi sayısına bağlıdır — teklif ücretsizdir." },
          { q: "Okullar için veli bildirimi var mı?", a: "Evet: çocuk kaydolunca veliye bildirim gider. Okulların en çok istediği özellik budur." },
          { q: "1C entegrasyonu yapıyor musunuz?", a: "Evet, puantaj 1C'ye otomatik aktarılır — hazır veri doğrudan maaş hesabına gider." },
          { q: "Başkası adına kaydolunabilir mi?", a: "Yüz ve parmak iziyle hayır: biyometri başkasını kabul etmez. Bu yüzden kart yerine biyometrik terminal öneririz." },
          { q: "Kurulum ne kadar sürer?", a: "Tek terminal — birkaç saat. Turnikeli tam sistem — 1–2 gün." },
        ],
      },
      zh: {
        title: "考勤系统：学校、办公室和工厂的价格",
        excerpt: "生物识别考勤系统多少钱：Face ID 终端、刷卡、自动考勤表和 1C 导出。适用于学校、办公室和制造业的方案。",
        sections: [
          { h: "考勤系统如何工作", p: [
            "入口安装终端：员工或学生刷脸（Face ID）、指纹或卡片签到。系统自动记录到离时间，标记迟到，自动生成考勤表。",
            "与纸质登记的区别是本质性的：没人能替别人签到——脸和指纹无法转交——报表一键导出。",
          ] },
          { h: "学校与培训中心", p: [
            "学校的考勤可接家长通知：孩子进校——家长手机收到消息。许多私立学校正是为这一功能安装系统。",
            "培训中心按班级记录出勤，并可与缴费关联：已上课时自动统计。",
          ] },
          { h: "办公室与工厂", p: [
            "办公室的考勤与工时统计合并：迟到、加班、考勤表导出到 1C。配合闸机还能解决门禁。",
            "工厂需要排班、夜班和数百名员工——ZKTeco 和 Hikvision 终端每秒可通行数人。",
          ] },
          { h: "价格", p: [
            "小型办公室配一台 Face ID 终端含调试从几百万苏姆起。学校或工厂按入口和人数定价；加闸机则报价更高。",
            "工程师上门和报价免费。终端塔什干现货，安装通常一天，1C 集成另行配置。",
          ] },
          { h: "如何订购", p: [
            "说明需求：多少人、几个入口、考勤表导到哪里。我们匹配终端，一天内给出含安装的准确报价。",
            "与法人单位按增值税合同合作。设备官方保修，安装公司保修。",
          ] },
          { h: "数据之路：从终端到工资单", p: [
            "当数据抵达工资核算，考勤的价值才兑现：考勤表导入1C省去手工誊抄和差错，部门报表随时呈现任意期间的迟到与加班。管理者实时掌握当天，而不是等到月底。",
            "我们按您的制度配置规则——排班、班次、迟到宽限——并教会管理员自行录入新员工。部署只需两三天，业务照常运转。",
          ] },
        ],
        faq: [
          { q: "考勤系统多少钱？", a: "一台 Face ID 终端含调试——几百万苏姆起。具体取决于入口和人数——报价免费。" },
          { q: "有面向学校的家长通知吗？", a: "有：孩子签到时家长收到通知。这是学校最需要的功能。" },
          { q: "能与 1C 集成吗？", a: "能，考勤表自动导出到 1C——数据直接进入工资核算。" },
          { q: "能替同事签到吗？", a: "刷脸和指纹不行：生物识别不认别人。因此我们推荐生物识别终端而非刷卡。" },
          { q: "安装要多久？", a: "单台终端几小时。含闸机的整套系统 1–2 天。" },
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
          { h: "Aqlli uyni qadrsizlantiradigan xatolar", p: [
            "Eng qimmat xato — ilovalar hayvonot bog'i: lampalar birida, rozetkalar boshqasida, kameralar uchinchisida — «uydan ketdik» stsenariysini yig'ishga hech narsa yo'q. Ikkinchisi — yorug'lik faqat aqlli lampalarda: devordagi vyklyuchatel ishlamay qo'yadi va qo'lida smartfonli oila avtomatlashtirishga tez sovuqlashadi.",
            "Tizimni stsenariyli yagona platformada yig'amiz, yorug'likni esa aqlli vyklyuchatellarga quramiz — odatiy klavisha hamma uchun ishlaydi. Tekshiruv va stsenariylar loyihasi bepul: qaysi uchta yumushni olib tashlamoqchi ekaningizni ayting — ularga mos tarkib va narx taklif qilamiz.",
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
          { h: "Ошибки, которые обесценивают умный дом", p: [
            "Самая дорогая ошибка — зоопарк приложений: лампы в одном, розетки в другом, камеры в третьем, и сценарий «ушли из дома» собрать не из чего. Вторая — свет только на умных лампах: выключатель на стене перестаёт работать, и семья со смартфоном в руках быстро охладевает к автоматизации.",
            "Мы собираем систему на единой платформе со сценариями, а свет строим на умных выключателях — привычная клавиша работает для всех. Обследование и проект сценариев бесплатны: расскажите, какие три рутины хотите убрать, — предложим состав и цену под них.",
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
      en: {
        title: "Smart Home Cost: Prices and Where to Start",
        excerpt: "Smart home system prices in Tashkent: lighting, curtains, climate, CCTV and smart locks in one app. Where to start cheaply and how to expand.",
        sections: [
          { h: "What a smart home consists of", p: [
            "A smart home is a set of devices run from one app: lighting and sockets, curtains, air-conditioner control, CCTV, a smart lock and sensors (leak, smoke, motion).",
            "You do not need everything at once: the system is modular. Most people start with lighting and curtains, then add cameras, a lock and sensors — everything works together in one ecosystem.",
          ] },
          { h: "Prices: where to start cheaply", p: [
            "A starter kit — smart sockets, bulbs and one sensor — assembles from a few hundred thousand UZS. A system for an average flat with lighting, curtains and climate comes to a few million UZS.",
            "A full project — with CCTV, a smart lock, voice control and scenes — depends on the floor area and device count. The estimate is free: we survey the rooms and propose a staged plan.",
          ] },
          { h: "Security: cameras, lock and sensors", p: [
            "The most useful part of a smart home is security: a smart lock and camera at the entrance, motion and smoke sensors inside, leak sensors in the kitchen and bathroom. Everything notifies your phone.",
            "One scene switches everything off and arms the home when you leave; on return the lights and AC come on by themselves. We work with Tuya, Hikvision and other ecosystems.",
          ] },
          { h: "How to order", p: [
            "Send the flat or house plan — we will say what belongs in each room and quote two or three tiers: starter, medium and full. Installation depends on the state of the interior: wired solutions for a fresh renovation, wireless for a finished home.",
            "Equipment from stock in Tashkent, installation and setup are ours, we install the app and teach you to use it. Official warranty.",
          ] },
          { h: "The mistakes that devalue a smart home", p: [
            "The costliest mistake is a zoo of apps: bulbs in one, sockets in another, cameras in a third — and there is nothing to build the \"left home\" scenario from. The second is lighting on smart bulbs alone: the wall switch stops working, and a family holding smartphones quickly cools to automation.",
            "We build the system on a single platform with scenarios, and construct lighting on smart switches — the familiar key keeps working for everyone. The survey and scenario design are free: name the three routines you want gone, and we will propose the setup and the price for them.",
          ] },
        ],
        faq: [
          { q: "How much does a smart home system cost?", a: "A starter kit — from a few hundred thousand UZS. For a flat with lighting, curtains and climate — a few million. Exact price per plan, the estimate is free." },
          { q: "Where to start?", a: "With what pays off most: a smart lock, a camera and a leak sensor. Lighting and curtains are easy to add later." },
          { q: "Can it go into a finished renovation?", a: "Yes — wireless devices install without chasing walls. In a fresh renovation wired solutions are more reliable." },
          { q: "Will everything work in one app?", a: "Yes, we build the system in one ecosystem — lighting, curtains, cameras and the lock are controlled from a single app." },
          { q: "How long does installation take?", a: "A starter kit — one day. A full project depends on the flat and is stated in the estimate." },
        ],
      },
      tr: {
        title: "Akıllı Ev Ne Kadar Tutar: Fiyatlar ve Nereden Başlamalı",
        excerpt: "Taşkent'te akıllı ev fiyatları: aydınlatma, perdeler, iklim, kameralar ve akıllı kilit tek uygulamada. Ucuza nereden başlanır, nasıl genişletilir.",
        sections: [
          { h: "Akıllı ev nelerden oluşur", p: [
            "Akıllı ev tek uygulamadan yönetilen cihazlar bütünüdür: aydınlatma ve prizler, perdeler, klima kontrolü, kameralar, akıllı kilit ve sensörler (su kaçağı, duman, hareket).",
            "Hepsi birden şart değil: sistem modülerdir. Çoğu kişi aydınlatma ve perdelerle başlar, sonra kamera, kilit ve sensör ekler — hepsi tek ekosistemde birlikte çalışır.",
          ] },
          { h: "Fiyatlar: ucuza nereden başlanır", p: [
            "Başlangıç seti — akıllı prizler, ampuller ve bir sensör — birkaç yüz bin UZS'den kurulur. Orta bir daire için aydınlatma, perde ve iklimli sistem birkaç milyon UZS eder.",
            "Tam proje — kamera, akıllı kilit, sesli kontrol ve senaryolarla — alana ve cihaz sayısına bağlıdır. Teklif ücretsizdir: odaları görür, kademeli plan öneririz.",
          ] },
          { h: "Güvenlik: kamera, kilit ve sensörler", p: [
            "Akıllı evin en faydalı kısmı güvenliktir: girişte akıllı kilit ve kamera, içeride hareket ve duman sensörleri, mutfak ve banyoda su kaçağı sensörü. Hepsi telefona bildirim yollar.",
            "Evden çıkarken tek senaryo her şeyi kapatır ve alarma alır; dönüşte ışıklar ve klima kendiliğinden açılır. Tuya, Hikvision ve diğer ekosistemlerle çalışırız.",
          ] },
          { h: "Nasıl sipariş verilir", p: [
            "Daire veya ev planını gönderin — her odaya ne gerektiğini söyleyip iki-üç seçenekli teklif verelim: başlangıç, orta ve tam. Montaj tadilat durumuna bağlıdır: yeni tadilatta kablolu, bitmiş evde kablosuz çözümler.",
            "Ekipman Taşkent'te stoktan; kurulum ve ayar bizden, uygulamayı kurar, kullanmayı öğretiriz. Resmi garanti.",
          ] },
          { h: "Akıllı evi değersizleştiren hatalar", p: [
            "En pahalı hata uygulama hayvanat bahçesidir: ampuller birinde, prizler diğerinde, kameralar üçüncüsünde — «evden çıktık» senaryosunu kuracak malzeme yoktur. İkincisi, aydınlatmanın yalnız akıllı ampullerde olmasıdır: duvardaki anahtar çalışmaz olur ve elinde telefonla dolaşan aile otomasyona hızla soğur.",
            "Sistemi senaryolu tek platformda kurar, aydınlatmayı akıllı anahtarlara inşa ederiz — alışıldık tuş herkes için çalışır. Keşif ve senaryo tasarımı ücretsizdir: kaldırmak istediğiniz üç rutini söyleyin, onlara göre yapı ve fiyat önerelim.",
          ] },
        ],
        faq: [
          { q: "Akıllı ev sistemi ne kadar?", a: "Başlangıç seti — birkaç yüz bin UZS'den. Aydınlatma, perde ve iklimli daire için — birkaç milyon. Kesin fiyat plana göre, teklif ücretsiz." },
          { q: "Nereden başlamalı?", a: "En çok işe yarayanlardan: akıllı kilit, kamera ve su kaçağı sensörü. Aydınlatma ve perdeler sonra kolayca eklenir." },
          { q: "Bitmiş tadilata kurulur mu?", a: "Evet — kablosuz cihazlar duvar kırmadan kurulur. Yeni tadilatta kablolu çözümler daha güvenilirdir." },
          { q: "Hepsi tek uygulamada mı çalışır?", a: "Evet, sistemi tek ekosistemde kurarız — aydınlatma, perdeler, kameralar ve kilit tek uygulamadan yönetilir." },
          { q: "Kurulum ne kadar sürer?", a: "Başlangıç seti — bir gün. Tam proje daire büyüklüğüne göre, süre teklifte belirtilir." },
        ],
      },
      zh: {
        title: "智能家居多少钱：价格与入门指南",
        excerpt: "塔什干智能家居系统价格：灯光、窗帘、空调、监控和智能锁集成在一个 App。从哪里开始最省钱，如何逐步扩展。",
        sections: [
          { h: "智能家居的组成", p: [
            "智能家居是一套由一个 App 管理的设备：灯光和插座、窗帘、空调控制、监控、智能锁和传感器（漏水、烟雾、移动）。",
            "不必一步到位：系统是模块化的。多数人从灯光和窗帘开始，再加摄像机、门锁和传感器——同一生态内协同工作。",
          ] },
          { h: "价格：从哪里开始最省", p: [
            "入门套装——智能插座、灯泡和一个传感器——几十万苏姆即可组建。普通公寓配灯光、窗帘和空调控制约几百万苏姆。",
            "完整项目——含监控、智能锁、语音控制和场景——取决于面积和设备数量。报价免费：查看房间后给出分阶段方案。",
          ] },
          { h: "安全：摄像机、门锁和传感器", p: [
            "智能家居最实用的部分是安全：入口的智能锁和摄像机，屋内的移动和烟雾传感器，厨卫的漏水传感器。一切都推送到手机。",
            "出门时一个场景关闭全部并布防；回家时灯光和空调自动开启。我们支持 Tuya、Hikvision 等生态。",
          ] },
          { h: "如何订购", p: [
            "发来户型图——我们说明每个房间需要什么，并按入门、中配、全配三档报价。安装取决于装修：新装修用有线方案，已装修用无线。",
            "设备塔什干现货，安装调试由我们完成，装好 App 并教会使用。官方保修。",
          ] },
          { h: "让智能家居贬值的错误", p: [
            "最昂贵的错误是应用「动物园」：灯在一个App、插座在另一个、摄像机在第三个——「离家模式」根本无从拼起。第二是照明只靠智能灯泡：墙上的开关失灵，举着手机开灯的家人很快就对自动化失去热情。",
            "我们把系统建在带场景的统一平台上，照明建在智能开关上——熟悉的按键对所有人有效。勘测和场景设计免费：说出您想消灭的三件日常琐事，我们按它们给出配置和价格。",
          ] },
        ],
        faq: [
          { q: "智能家居系统多少钱？", a: "入门套装几十万苏姆起。公寓配灯光、窗帘和空调——几百万。按户型报价，免费。" },
          { q: "从哪里开始？", a: "从最实用的开始：智能锁、摄像机和漏水传感器。灯光和窗帘以后加装很容易。" },
          { q: "已装修的房子能装吗？", a: "能——无线设备无需开槽。新装修用有线方案更可靠。" },
          { q: "都在一个 App 里吗？", a: "是，系统建在同一生态——灯光、窗帘、摄像机和门锁一个 App 管理。" },
          { q: "安装要多久？", a: "入门套装一天。完整项目按面积定，报价中注明。" },
        ],
      },
    },
  },
  {
    slug: "avtomatik-darvoza-narxi",
    date: "2026-08-26",
    related: ["gates", "barrier", "anpr"],
    hubs: ["turnikety-i-shlagbaumy"],
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
          { h: "Avtomatika buyurtmasidagi tez-tez xatolar", p: [
            "Bosh xato — tavaqa og'irligi va kengligi bo'yicha «zo'rg'a» privod: yaxlit polotno shamolda yelkan bo'ladi, keng tavaqadagi kuchsiz motor bir mavsum yashaydi. Ikkinchisi — xavfsizlikda tejash: fotoelementlar va kuch sozlamasisiz darvoza bir kuni mashina yoki odamni qisadi, «keyin qo'yamiz» degan signal chiroqni esa hech qachon qo'yishmaydi.",
            "Uchinchi xato — qishni unutish: silliq startsiz avtomatika muzlab qolgan tavaqani yulqiydi, mavsumga mos bo'lmagan moy quyuqlashadi. Biz privodni zaxira bilan tanlaymiz, har to'plamga to'liq xavfsizlik konturini kiritamiz va montajda qishki rejimlarni sozlaymiz — shuning uchun darvozalarimiz yillab ishlaydi.",
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
          { h: "Частые ошибки при заказе автоматики", p: [
            "Главная ошибка — привод «впритык» по весу и ширине створки: сплошное полотно парусит на ветру, и слабый мотор на широкой створке живёт один сезон. Вторая — экономия на безопасности: без фотоэлементов и регулировки усилия ворота однажды прижмут машину или человека, а сигнальную лампу «поставим потом» не ставят никогда.",
            "Третья ошибка — забыть про зиму: без плавного старта автоматика рвёт примёрзшую створку, а смазка не по сезону густеет. Мы подбираем привод с запасом, включаем полный контур безопасности в каждый комплект и настраиваем зимние режимы при монтаже — поэтому наши ворота работают годами.",
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
      en: {
        title: "Automatic Gates: Drive Price and Installation",
        excerpt: "What gate automation costs: drives for sliding and swing gates, remotes, phone opening. Can a drive go on your existing gates.",
        sections: [
          { h: "Which gates can be automated", p: [
            "Two main types: sliding and swing gates. Each takes its own drive: a sliding gate needs one drive with a gear rack, swing gates take a drive per leaf.",
            "Importantly, automation fits your existing gates — no replacement needed. An engineer checks the weight and dimensions and picks a drive of the right power.",
          ] },
          { h: "What drives the price", p: [
            "The main factor is gate weight and duty cycle. Light drives for a yard start from a few million UZS; heavy steel gates and busy entrances need a stronger, pricier drive.",
            "The kit includes remotes, photocells (safety), a signal lamp and installation besides the drive. Phone opening and access-control integration are options.",
          ] },
          { h: "For checkpoints and companies", p: [
            "At a company entrance automatic gates work with a barrier and access control: authorised vehicles enter by whitelist, and with plate recognition (ANPR) the guard presses nothing.",
            "Busy entrances take industrial-grade drives rated for hundreds of cycles a day, under warranty.",
          ] },
          { h: "Installation and ordering", p: [
            "A standard install takes a day: drive mounting, photocells, remote programming and setup. The engineer's visit and estimate are free — we inspect the gates and quote the exact price.",
            "Drives and automation from stock in Tashkent with official warranty. We work with legal entities under VAT contracts.",
          ] },
          { h: "Common mistakes when ordering gate automation", p: [
            "The main mistake is a drive sized \"just enough\" for the leaf's weight and width: a solid panel sails in the wind, and a weak motor on a wide leaf lasts one season. The second is saving on safety: without photocells and force adjustment the gate will one day press on a car or a person, and the warning lamp promised \"for later\" never gets installed.",
            "The third mistake is forgetting about winter: without a soft start the drive tears at a frozen leaf, and off-season grease thickens. We size the drive with a margin, include the full safety loop in every kit and configure winter modes at installation — which is why our gates run for years.",
          ] },
        ],
        faq: [
          { q: "What does gate automation cost?", a: "A drive kit for yard gates with installation — from a few million UZS. The exact price depends on gate weight and type — the estimate is free." },
          { q: "Can it go on existing gates?", a: "Yes, in most cases no replacement is needed — the drive mounts on your gates. An engineer checks compatibility on site." },
          { q: "Will there be phone opening?", a: "Yes: besides the remote we set up opening from an app or by call. Access control and plate recognition can be tied in." },
          { q: "Will the gates open in a power cut?", a: "Drives have a mechanical release — a key disengages the drive so the gates open by hand. A UPS can also be added." },
          { q: "How long does installation take?", a: "A standard install — 1 day: mounting, photocells, setup and remote programming." },
        ],
      },
      tr: {
        title: "Otomatik Kapılar: Motor Fiyatı ve Montaj",
        excerpt: "Kapı otomasyonu ne kadar: yana kayar ve çift kanat kapılar için motorlar, kumandalar, telefonla açma. Mevcut kapıya motor takılır mı.",
        sections: [
          { h: "Hangi kapılar otomatikleştirilir", p: [
            "İki ana tip: yana kayar ve çift kanat kapılar. Her birinin kendi motoru vardır: kayar kapıya kremayerli tek motor, çift kanada kanat başına birer motor.",
            "Önemli: otomasyon mevcut kapınıza takılır — kapıyı değiştirmek gerekmez. Mühendis ağırlığı ve ölçüyü görür, uygun güçte motoru seçer.",
          ] },
          { h: "Fiyatı ne belirler", p: [
            "Ana etken kapının ağırlığı ve kullanım yoğunluğudur. Avlu için hafif motorlar birkaç milyon UZS'den başlar; ağır demir kapılara ve yoğun girişlere daha güçlü, daha pahalı motor gerekir.",
            "Sete motor dışında kumandalar, fotoseller (güvenlik), sinyal lambası ve montaj girer. Telefonla açma ve geçiş kontrolü bağlantısı ek seçenektir.",
          ] },
          { h: "Girişler ve işletmeler için", p: [
            "İşletme girişinde otomatik kapılar bariyer ve geçiş kontrolüyle birlikte çalışır: izinli araçlar listeden girer, plaka tanımayla (ANPR) görevli tuşa bile basmaz.",
            "Yoğun girişlere günde yüzlerce açılışa dayanıklı endüstriyel motorlar konur, garantilidir.",
          ] },
          { h: "Montaj ve sipariş", p: [
            "Standart montaj bir gün sürer: motor, fotoseller, kumanda programlama ve ayar. Keşif ve teklif ücretsizdir — kapıyı görüp kesin fiyatı söyleriz.",
            "Motorlar ve otomasyon Taşkent'te stoktan, resmi garantili. Tüzel kişilerle KDV'li sözleşmeyle çalışırız.",
          ] },
          { h: "Kapı otomasyonu siparişinde sık hatalar", p: [
            "Ana hata, kanadın ağırlığına ve genişliğine «ucu ucuna» motor seçmektir: dolu panel rüzgârda yelken olur, geniş kanatta zayıf motor bir sezon dayanır. İkincisi güvenlikten kısmaktır: fotoseller ve kuvvet ayarı olmadan kapı bir gün araca veya insana yüklenir; «sonra takarız» denen flaşör asla takılmaz.",
            "Üçüncü hata kışı unutmaktır: yumuşak kalkış yoksa motor donmuş kanadı yolar, mevsime uymayan gres katılaşır. Motoru payla seçer, her sete tam güvenlik devresini koyar ve montajda kış modlarını ayarlarız — kapılarımız bu yüzden yıllarca çalışır.",
          ] },
        ],
        faq: [
          { q: "Kapı otomasyonu ne kadar?", a: "Avlu kapısı için motor seti montajla — birkaç milyon UZS'den. Kesin fiyat kapının ağırlığına ve tipine bağlı — teklif ücretsiz." },
          { q: "Mevcut kapıya takılır mı?", a: "Evet, çoğu durumda kapıyı değiştirmek gerekmez — motor mevcut kapıya takılır. Mühendis yerinde uyumu kontrol eder." },
          { q: "Telefonla açma olur mu?", a: "Evet: kumandanın yanında uygulamadan veya aramayla açmayı da ayarlarız. Geçiş kontrolü ve plaka tanıma bağlanabilir." },
          { q: "Elektrik kesilince kapı açılır mı?", a: "Motorlarda mekanik boşaltma vardır — anahtarla ayırıp kapıyı elle açabilirsiniz. UPS de eklenebilir." },
          { q: "Montaj ne kadar sürer?", a: "Standart montaj — 1 gün: kurulum, fotoseller, ayar ve kumanda programlama." },
        ],
      },
      zh: {
        title: "自动大门：电机价格与安装",
        excerpt: "大门自动化要花多少钱：平移门和对开门电机、遥控器、手机开门。现有大门能否加装电机。",
        sections: [
          { h: "哪些大门可以自动化", p: [
            "两种主要类型：平移门和对开门。各配各的电机：平移门用一台带齿条的电机，对开门每扇一台。",
            "重要的是：自动化可加装在您现有的大门上——无需换门。工程师评估重量和尺寸，选配合适功率的电机。",
          ] },
          { h: "价格由什么决定", p: [
            "主要因素是门的重量和使用强度。院门轻型电机从几百万苏姆起；沉重的铁门和高频出入口需要更强、更贵的电机。",
            "套装除电机外含遥控器、红外光电（安全）、警示灯和安装。手机开门和门禁联动为可选项。",
          ] },
          { h: "门岗与企业", p: [
            "企业入口的自动大门与道闸、门禁协同工作：授权车辆按白名单进入，配车牌识别（ANPR）时保安无需按键。",
            "高频出入口配工业级电机——按每天数百次开合设计，享保修。",
          ] },
          { h: "安装与订购", p: [
            "标准安装一天：装电机、光电、遥控器编程和调试。工程师上门和报价免费——看门后给出准确价格。",
            "电机和自动化设备塔什干现货，官方保修。与法人单位按增值税合同合作。",
          ] },
          { h: "订购大门自动化时的常见错误", p: [
            "头号错误是电机按门扇重量和宽度「刚刚好」选：实心门板兜风，宽门扇配小电机一季就报废。第二是省掉安全装置：没有红外对射和推力调节，大门早晚会压到车或人，而说好「以后装」的警示灯永远不会装。",
            "第三个错误是忘了冬天：没有缓启动，电机硬拽冻住的门扇；润滑脂不对季节就会变稠。我们按余量选电机、每套标配完整安全回路、安装时调好冬季模式——所以我们装的大门能用很多年。",
          ] },
        ],
        faq: [
          { q: "大门自动化多少钱？", a: "院门电机套装含安装——几百万苏姆起。具体取决于门的重量和类型——报价免费。" },
          { q: "能装在现有大门上吗？", a: "能，多数情况无需换门——电机装在现有门上。工程师现场确认兼容性。" },
          { q: "能手机开门吗？", a: "能：除遥控器外可设置 App 或来电开门，还可联动门禁和车牌识别。" },
          { q: "停电时门能开吗？", a: "电机有机械释放——用钥匙脱开后可手动开门。也可加装 UPS。" },
          { q: "安装要多久？", a: "标准安装 1 天：装机、光电、调试和遥控器编程。" },
        ],
      },
    },
  },

  {
    slug: "gpon-uzbekistan",
    date: "2026-08-27",
    related: ["fiber", "network"],
    hubs: ["pon-oborudovanie", "optika-i-aksessuary"],
    loc: {
      ru: {
        title: "GPON: как устроена оптическая сеть и сколько стоит её построить",
        excerpt: "Что такое GPON и XPON, из чего состоит сеть — OLT, сплиттеры, ONU, — кому она нужна и сколько стоит оборудование и монтаж в Ташкенте.",
        sections: [
          { h: "Что такое GPON простыми словами", p: [
            "GPON — технология пассивной оптической сети: от станции (OLT) одно волокно через сплиттеры разветвляется на десятки абонентов, у каждого из которых стоит терминал ONU. «Пассивная» значит, что между станцией и абонентом нет активного оборудования — только оптика и делители, которым не нужно питание.",
            "Отсюда главные плюсы: дальность до 20 км, никакой грозозащиты и свитчей в подъездах, гигабитные скорости и почти нулевая деградация. EPON и XPON — родственные варианты: XPON-терминалы работают с обеими станциями.",
          ] },
          { h: "Кому нужна PON-сеть", p: [
            "Классика — провайдер в махалле, посёлке или ЖК: одно волокно на 64–128 квартир вместо гирлянды коммутаторов. Вторая аудитория — предприятия: распределённые цеха, склады и КПП подключаются к серверной без активных узлов по территории.",
            "Третье применение — видеонаблюдение по оптике: камеры на дальних точках (парковка, периметр, соседнее здание) подключаются через недорогие ONU без потери качества на расстоянии.",
          ] },
          { h: "Из чего состоит сеть: OLT, сплиттеры, ONU", p: [
            "Станция OLT ставится в серверной — от 4 до 16 PON-портов, каждый обслуживает до 64–128 абонентов. Дальше пассивные сплиттеры 1:8–1:64 в боксах, оптический кабель и абонентские ONU — простые или с Wi-Fi-роутером.",
            "Мы возим три проверенных бренда: V-SOL и C-Data — доступные OLT и ONU, BDCOM — станции операторского класса с CLI в стиле Cisco. Совместимость между ними проверена на живых сетях.",
          ] },
          { h: "Сколько стоит", p: [
            "Абонентский ONU начинается от нескольких сотен тысяч сум, станционный OLT на 4–8 портов — от нескольких миллионов. Полный бюджет сети складывается из станции, кабеля, сплиттеров, боксов, сварки и настройки.",
            "Смета бесплатная: считаем оптический бюджет по вашей схеме — сколько абонентов, какие расстояния — и даём спецификацию с ценами со склада в Ташкенте за один день.",
          ] },
          { h: "GPON или классический Ethernet", p: [
            "Медный Ethernet ограничен сотней метров до коммутатора — в жилом комплексе или посёлке это означает активные узлы в каждом подъезде: шкафы, питание, обслуживание. GPON покрывает до 20 километров пассивной оптикой: между станцией и абонентом только волокно и сплиттеры, которым не нужны ни электричество, ни кондиционер.",
            "Поэтому на сотнях абонентов PON выигрывает по стоимости владения: меньше активного железа — меньше точек отказа и счетов за электричество. Ethernet остаётся выбором внутри здания и там, где каждому абоненту нужен гарантированный симметричный канал — например, в офисном центре с арендаторами-компаниями. Часто оптимальна связка: GPON до здания, Ethernet внутри.",
          ] },
          { h: "Монтаж и запуск под ключ", p: [
            "Делаем сеть целиком: проект и расчёт оптического бюджета, прокладка кабеля, сварка волокна с измерениями рефлектометром, монтаж боксов и сплиттеров, настройка OLT, привязка ONU и обучение вашего инженера.",
            "Сдаём с паспортом сети и схемами. Договор с юрлицом, НДС, гарантия на оборудование и работы.",
          ] },
        ],
        faq: [
          { q: "Чем GPON отличается от обычной сети на коммутаторах?", a: "Между станцией и абонентом нет активного оборудования — только волокно и пассивные делители. Дальность до 20 км, нет свитчей по подъездам и питания для них, гигабитные скорости." },
          { q: "Что такое XPON?", a: "Универсальные абонентские терминалы, работающие и с GPON, и с EPON станциями. Удобно: один ONU подходит к любой станции." },
          { q: "Сколько стоит ONU для абонента?", a: "Простые модели — от нескольких сотен тысяч сум, с Wi-Fi-роутером дороже. При партии для сети цена ниже — считаем в спецификации." },
          { q: "Какой OLT выбрать: V-SOL, C-Data или BDCOM?", a: "Для старта и средних сетей — V-SOL или C-Data, для крупных операторских узлов — BDCOM. Поможем сравнить под ваш масштаб бесплатно." },
          { q: "Делаете ли сварку и измерения?", a: "Да, свой штат со сварочными аппаратами и рефлектометром. Сдаём сеть с паспортом и измерениями каждой линии." },
        ],
      },
      uz: {
        title: "GPON: optik tarmoq qanday ishlaydi va uni qurish qancha turadi",
        excerpt: "GPON va XPON nima, tarmoq nimadan iborat — OLT, splitterlar, ONU — kimga kerak va Toshkentda uskuna hamda montaj qancha turadi.",
        sections: [
          { h: "GPON oddiy tilda nima", p: [
            "GPON — passiv optik tarmoq texnologiyasi: stansiyadan (OLT) bitta tola splitterlar orqali o'nlab abonentga tarqaladi, har birida ONU terminali turadi. «Passiv» degani — stansiya va abonent orasida faol uskuna yo'q, faqat optika va quvvat talab qilmaydigan bo'luvchilar.",
            "Asosiy afzalliklar shundan: 20 km gacha masofa, pod'ezdlarda svitch va chaqmoq himoyasi keraksiz, gigabit tezliklar. EPON va XPON — qarindosh variantlar: XPON-terminallar ikkala stansiya bilan ham ishlaydi.",
          ] },
          { h: "PON-tarmoq kimga kerak", p: [
            "Klassika — mahalla, posyolka yoki TJMda provayder: 64–128 kvartiraga kommutatorlar shodasi o'rniga bitta tola. Ikkinchi auditoriya — korxonalar: tarqoq sexlar, omborlar va KPPlar hududda faol uzellarsiz serverxonaga ulanadi.",
            "Uchinchi qo'llanish — optika orqali videokuzatuv: uzoq nuqtalardagi kameralar (avtoturargoh, perimetr, qo'shni bino) arzon ONU orqali sifat yo'qotmasdan ulanadi.",
          ] },
          { h: "Tarmoq nimadan iborat: OLT, splitterlar, ONU", p: [
            "OLT stansiyasi serverxonaga qo'yiladi — 4 dan 16 gacha PON-port, har biri 64–128 abonentga xizmat qiladi. Keyin bokslardagi 1:8–1:64 passiv splitterlar, optik kabel va abonent ONU'lari — oddiy yoki Wi-Fi routerli.",
            "Biz uchta tekshirilgan brendni olib kelamiz: V-SOL va C-Data — hamyonbop OLT va ONU'lar, BDCOM — Cisco uslubidagi CLI'ga ega operator darajasidagi stansiyalar. O'zaro mosligi jonli tarmoqlarda tekshirilgan.",
          ] },
          { h: "Qancha turadi", p: [
            "Abonent ONU bir necha yuz ming so'mdan boshlanadi, 4–8 portli OLT — bir necha milliondan. To'liq byudjet stansiya, kabel, splitterlar, bokslar, payvandlash va sozlashdan yig'iladi.",
            "Smeta bepul: sxemangiz bo'yicha optik byudjetni hisoblaymiz — nechta abonent, qanday masofalar — va Toshkentdagi ombor narxlari bilan spetsifikatsiyani bir kunda beramiz.",
          ] },
          { h: "GPON yoki klassik Ethernet", p: [
            "Mis Ethernet kommutatorgacha yuz metr bilan cheklangan — turar-joy majmuasi yoki posyolkada bu har pod'ezdda faol uzellar degani: shkaflar, quvvat, xizmat. GPON passiv optika bilan 20 kilometrgacha qamraydi: stansiya va abonent orasida faqat tola va splitterlar — ularga elektr ham, konditsioner ham kerak emas.",
            "Shuning uchun yuzlab abonentda PON egalik qiymati bo'yicha yutadi: faol temir kam — nosozlik nuqtalari va elektr hisoblari kam. Ethernet bino ichida va har abonentga kafolatlangan simmetrik kanal kerak joylarda tanlov bo'lib qoladi — masalan, kompaniya-ijarachilar bilan ofis markazida. Ko'pincha bog'lam optimal: binogacha GPON, ichkarida Ethernet.",
          ] },
          { h: "Kalit topshirish montaji", p: [
            "Tarmoqni to'liq qilamiz: loyiha va optik byudjet hisobi, kabel yotqizish, reflektometr o'lchovlari bilan tola payvandlash, boks va splitterlar montaji, OLT sozlash, ONU ulash va muhandisingizni o'qitish.",
            "Tarmoq pasporti va sxemalar bilan topshiramiz. Yuridik shaxs bilan shartnoma, NDS, uskuna va ishlarga kafolat.",
          ] },
        ],
        faq: [
          { q: "GPON oddiy kommutator tarmog'idan nimasi bilan farq qiladi?", a: "Stansiya va abonent orasida faol uskuna yo'q — faqat tola va passiv bo'luvchilar. 20 km gacha masofa, pod'ezdlarda svitch va ularga quvvat keraksiz, gigabit tezliklar." },
          { q: "XPON nima?", a: "GPON va EPON stansiyalarining ikkalasi bilan ham ishlaydigan universal abonent terminallari. Qulay: bitta ONU istalgan stansiyaga tushadi." },
          { q: "Abonent uchun ONU qancha turadi?", a: "Oddiy modellar — bir necha yuz ming so'mdan, Wi-Fi routerlisi qimmatroq. Tarmoq uchun partiyada narx pastroq — spetsifikatsiyada hisoblaymiz." },
          { q: "Qaysi OLT'ni tanlash: V-SOL, C-Data yoki BDCOM?", a: "Boshlang'ich va o'rta tarmoqlarga — V-SOL yoki C-Data, yirik operator uzellariga — BDCOM. Masshtabingizga mosini bepul solishtiramiz." },
          { q: "Payvandlash va o'lchovlarni qilasizmi?", a: "Ha, payvand apparatlari va reflektometrli o'z shtatimiz bor. Tarmoqni pasport va har bir liniya o'lchovlari bilan topshiramiz." },
        ],
      },
      en: {
        title: "GPON: How a Passive Optical Network Works and What It Costs",
        excerpt: "What GPON and XPON are, what the network consists of — OLT, splitters, ONU — who needs it and what equipment and installation cost in Tashkent.",
        sections: [
          { h: "GPON in plain words", p: [
            "GPON is passive optical network technology: from the head-end (OLT) a single fibre branches through splitters to dozens of subscribers, each with an ONU terminal. \"Passive\" means no active equipment between the station and the subscriber — only fibre and unpowered splitters.",
            "Hence the key benefits: up to 20 km reach, no switches in stairwells and no power for them, gigabit speeds. EPON and XPON are sibling flavours: XPON terminals work with both head-end types.",
          ] },
          { h: "Who needs a PON network", p: [
            "The classic case is an ISP in a district, settlement or residential complex: one fibre serves 64–128 flats instead of a chain of switches. The second audience is enterprises: remote workshops, warehouses and checkpoints connect to the server room with no active nodes across the site.",
            "The third use is CCTV over fibre: cameras at distant points — car park, perimeter, a neighbouring building — connect through inexpensive ONUs with no quality loss over distance.",
          ] },
          { h: "What the network consists of: OLT, splitters, ONU", p: [
            "The OLT sits in the server room — 4 to 16 PON ports, each serving up to 64–128 subscribers. Then passive 1:8–1:64 splitters in boxes, optical cable and subscriber ONUs — basic or with a Wi-Fi router.",
            "We carry three proven brands: V-SOL and C-Data for affordable OLTs and ONUs, BDCOM for carrier-grade head-ends with a Cisco-style CLI. Cross-compatibility is proven on live networks.",
          ] },
          { h: "What it costs", p: [
            "A subscriber ONU starts from a few hundred thousand UZS, a 4–8 port OLT from a few million. The full network budget adds cable, splitters, boxes, splicing and configuration.",
            "The estimate is free: we calculate the optical budget for your layout — subscriber count, distances — and deliver a priced specification from Tashkent stock within a day.",
          ] },
          { h: "GPON or classic Ethernet", p: [
            "Copper Ethernet is capped at a hundred meters to the switch — in a residential complex or settlement that means active nodes in every entrance: cabinets, power, maintenance. GPON covers up to 20 kilometers with passive optics: between the station and the subscriber there are only fiber and splitters, which need neither electricity nor cooling.",
            "That is why at hundreds of subscribers PON wins on cost of ownership: less active hardware means fewer failure points and power bills. Ethernet remains the pick inside a building and where every subscriber needs a guaranteed symmetric channel — say, an office center with corporate tenants. The combo is often optimal: GPON to the building, Ethernet inside.",
          ] },
          { h: "Turnkey installation", p: [
            "We build the network end to end: design and optical budget, cable laying, fusion splicing with OTDR measurements, boxes and splitters, OLT configuration, ONU provisioning and training for your engineer.",
            "Handover includes the network passport and diagrams. Contract with VAT, warranty on equipment and work.",
          ] },
        ],
        faq: [
          { q: "How does GPON differ from a switched network?", a: "No active equipment between head-end and subscriber — only fibre and passive splitters. Up to 20 km reach, no stairwell switches or power for them, gigabit speeds." },
          { q: "What is XPON?", a: "Universal subscriber terminals that work with both GPON and EPON head-ends. Convenient: one ONU fits any station." },
          { q: "What does a subscriber ONU cost?", a: "Basic models from a few hundred thousand UZS; Wi-Fi router models cost more. Volume pricing for networks is lower — we quote it in the specification." },
          { q: "Which OLT to choose: V-SOL, C-Data or BDCOM?", a: "V-SOL or C-Data for starter and mid-size networks, BDCOM for large carrier nodes. We compare options for your scale free of charge." },
          { q: "Do you splice and measure?", a: "Yes — our own crew with fusion splicers and an OTDR. The network is handed over with a passport and per-line measurements." },
        ],
      },
      tr: {
        title: "GPON: Pasif Optik Ağ Nasıl Çalışır ve Maliyeti Nedir",
        excerpt: "GPON ve XPON nedir, ağ nelerden oluşur — OLT, splitterlar, ONU — kimin işine yarar, Taşkent'te ekipman ve montaj ne kadar tutar.",
        sections: [
          { h: "Sade dille GPON", p: [
            "GPON pasif optik ağ teknolojisidir: santralden (OLT) tek fiber, splitterlar üzerinden onlarca aboneye dallanır; her abonede bir ONU bulunur. \"Pasif\", santral ile abone arasında aktif ekipman olmaması demektir — yalnızca fiber ve güç istemeyen bölücüler.",
            "Başlıca avantajlar: 20 km'ye varan mesafe, merdivenlerde switch ve besleme derdi yok, gigabit hızlar. EPON ve XPON kardeş türlerdir: XPON terminaller iki santral tipiyle de çalışır.",
          ] },
          { h: "PON ağı kime lazım", p: [
            "Klasik senaryo mahallede veya sitede İSS: switch zinciri yerine 64–128 daireye tek fiber. İkinci kitle işletmeler: uzak atölyeler, depolar ve girişler sahada aktif düğüm olmadan sunucu odasına bağlanır.",
            "Üçüncü kullanım fiber üzerinden kamera: uzak noktalardaki kameralar (otopark, çevre, komşu bina) ucuz ONU'larla mesafe kaybı olmadan bağlanır.",
          ] },
          { h: "Ağ nelerden oluşur: OLT, splitter, ONU", p: [
            "OLT sunucu odasına konur — 4–16 PON port, her biri 64–128 aboneye hizmet verir. Sonra kutularda 1:8–1:64 pasif splitterlar, optik kablo ve abone ONU'ları — temel veya Wi-Fi routerlı.",
            "Üç kanıtlanmış marka taşıyoruz: uygun fiyatlı OLT ve ONU'larda V-SOL ile C-Data, Cisco tarzı CLI'ye sahip operatör sınıfı santrallerde BDCOM. Karşılıklı uyum canlı ağlarda kanıtlı.",
          ] },
          { h: "Ne kadar tutar", p: [
            "Abone ONU'su birkaç yüz bin UZS'den, 4–8 portlu OLT birkaç milyondan başlar. Tam bütçeye kablo, splitterlar, kutular, ek ve yapılandırma eklenir.",
            "Teklif ücretsiz: şemanıza göre optik bütçeyi hesaplar — abone sayısı, mesafeler — ve Taşkent stok fiyatlarıyla şartnameyi bir günde veririz.",
          ] },
          { h: "GPON mu klasik Ethernet mi", p: [
            "Bakır Ethernet switch'e yüz metreyle sınırlıdır — sitede veya kasabada bu her girişte aktif düğüm demektir: kabinler, güç, bakım. GPON pasif optikle 20 kilometreye kadar ulaşır: santralle abone arasında yalnızca fiber ve splitter vardır; ne elektrik ne soğutma ister.",
            "Bu yüzden yüzlerce abonede PON, sahip olma maliyetinde kazanır: az aktif donanım, az arıza noktası ve az elektrik faturası demektir. Ethernet bina içinde ve her aboneye garantili simetrik kanal gereken yerlerde tercihtir — örneğin kurumsal kiracılı ofis merkezinde. Çoğu kez ikili en iyisidir: binaya kadar GPON, içeride Ethernet.",
          ] },
          { h: "Anahtar teslim kurulum", p: [
            "Ağı uçtan uca kurarız: proje ve optik bütçe, kablo serimi, OTDR ölçümlü fiber ek, kutular ve splitterlar, OLT ayarı, ONU tanımlama ve mühendisinize eğitim.",
            "Teslimat ağ pasaportu ve şemalarla yapılır. KDV'li sözleşme, ekipman ve işçilik garantisi.",
          ] },
        ],
        faq: [
          { q: "GPON, switchli ağdan nasıl ayrılır?", a: "Santral ile abone arasında aktif ekipman yok — yalnız fiber ve pasif bölücüler. 20 km mesafe, merdiven switchleri ve beslemesi yok, gigabit hızlar." },
          { q: "XPON nedir?", a: "Hem GPON hem EPON santrallerle çalışan evrensel abone terminalleri. Pratik: tek ONU her santrale uyar." },
          { q: "Abone ONU'su ne kadar?", a: "Temel modeller birkaç yüz bin UZS'den; Wi-Fi routerlılar daha pahalı. Ağ adetlerinde fiyat düşer — şartnamede hesaplarız." },
          { q: "Hangi OLT: V-SOL, C-Data, BDCOM?", a: "Başlangıç ve orta ağlara V-SOL veya C-Data, büyük operatör düğümlerine BDCOM. Ölçeğinize göre ücretsiz karşılaştırırız." },
          { q: "Ek ve ölçüm yapıyor musunuz?", a: "Evet — ek cihazları ve OTDR'li kendi ekibimiz var. Ağ, pasaport ve hat ölçümleriyle teslim edilir." },
        ],
      },
      zh: {
        title: "GPON：无源光网络的原理与建设成本",
        excerpt: "什么是 GPON 和 XPON，网络由什么组成——OLT、分光器、ONU——谁需要它，在塔什干设备和施工要多少钱。",
        sections: [
          { h: "通俗理解 GPON", p: [
            "GPON 是无源光网络技术：从局端（OLT）出发的一根光纤经分光器分支到几十个用户，每户一台 ONU 终端。「无源」意味着局端与用户之间没有有源设备——只有光纤和无需供电的分光器。",
            "由此带来核心优势：最远 20 公里、楼道无需交换机和供电、千兆速率。EPON 和 XPON 是同族技术：XPON 终端兼容两种局端。",
          ] },
          { h: "谁需要 PON 网络", p: [
            "经典场景是社区或住宅区的运营商：一根光纤覆盖 64–128 户，替代成串的交换机。第二类是企业：分散的车间、仓库和门岗无需园区有源节点即可接入机房。",
            "第三类是光纤监控：远端点位（停车场、围界、邻楼）通过廉价 ONU 接入，距离不损画质。",
          ] },
          { h: "网络组成：OLT、分光器、ONU", p: [
            "OLT 置于机房——4 至 16 个 PON 口，每口带 64–128 户。其后是盒内 1:8–1:64 无源分光器、光缆和用户 ONU——基础款或带 Wi-Fi 路由。",
            "我们供应三个经过验证的品牌：V-SOL 和 C-Data 主打高性价比 OLT 与 ONU，BDCOM 是带 Cisco 风格 CLI 的运营商级局端。互兼容性已在实网验证。",
          ] },
          { h: "价格", p: [
            "用户 ONU 从几十万苏姆起，4–8 口 OLT 从几百万起。整网预算还包括光缆、分光器、接头盒、熔接与调试。",
            "报价免费：按您的拓扑核算光功率预算——用户数、距离——一天内给出塔什干现货价格的配置清单。",
          ] },
          { h: "选GPON还是传统以太网", p: [
            "铜缆以太网到交换机只有一百米——在住宅区或村镇意味着每个单元都要设有源节点：机柜、供电、维护。GPON用无源光网络覆盖最远20公里：局端到用户之间只有光纤和分光器，不用电也不用空调。",
            "因此几百户规模上PON的持有成本更优：有源设备少，故障点和电费就少。以太网仍是楼内以及每个用户都要保证对称带宽场景的选择——比如企业租户的写字楼。常见的最优解是组合：GPON到楼，楼内以太网。",
          ] },
          { h: "交钥匙施工", p: [
            "整网承建：设计与光功率预算、敷缆、OTDR 测量熔接、盒体与分光器安装、OLT 配置、ONU 注册及工程师培训。",
            "交付附网络档案和图纸。增值税合同，设备与施工保修。",
          ] },
        ],
        faq: [
          { q: "GPON 与交换机组网有何区别？", a: "局端与用户之间无有源设备——只有光纤和无源分光器。20 公里覆盖，无楼道交换机及其供电，千兆速率。" },
          { q: "什么是 XPON？", a: "同时兼容 GPON 和 EPON 局端的通用用户终端。方便：一款 ONU 适配任意局端。" },
          { q: "用户 ONU 多少钱？", a: "基础款几十万苏姆起，带 Wi-Fi 路由更贵。整网批量价更低——在配置清单中核算。" },
          { q: "OLT 选哪家：V-SOL、C-Data 还是 BDCOM？", a: "起步和中型网络选 V-SOL 或 C-Data，大型运营商节点选 BDCOM。按您的规模免费对比。" },
          { q: "提供熔接和测量吗？", a: "提供——自有熔接机和 OTDR 团队。交付附档案及每条链路的测量数据。" },
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
