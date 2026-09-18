import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { kitsForLocale } from "@/lib/kitsData";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

const UI: Record<string, { title: string; desc: string; sub: string; home: string; from: string; more: string }> = {
  ru: { title: "Готовые комплекты безопасности с ценой", desc: "Комплекты видеонаблюдения и СКУД под ключ для дома, магазина, офиса и склада: состав, цена «от» и монтаж за 1–2 дня.", sub: "Оборудование + монтаж + настройка телефона. Цена «от» — за типовой объект; точную смету считаем бесплатно за 1 день.", home: "Главная", from: "от", more: "Подробнее" },
  uz: { title: "Narxi bilan tayyor xavfsizlik toʻplamlari", desc: "Uy, doʻkon, ofis va ombor uchun toʻliq tayyor videokuzatuv va SKUD toʻplamlari: tarkibi, narxi va 1–2 kunda montaj.", sub: "Uskuna + montaj + telefon sozlash. Narx — tipik obyekt uchun; aniq smeta 1 kunda, bepul.", home: "Bosh sahifa", from: "", more: "Batafsil" },
  en: { title: "Security Kits with Upfront Pricing", desc: "Turnkey CCTV and access-control kits for home, shop, office and warehouse: contents, starting price, 1–2 day installation.", sub: "Hardware + installation + phone setup. Prices are for a typical site; an exact quote is free within 1 day.", home: "Home", from: "from", more: "Details" },
  tr: { title: "Fiyatı Belli Hazır Güvenlik Setleri", desc: "Ev, mağaza, ofis ve depo için anahtar teslim kamera ve geçiş kontrol setleri: içerik, başlangıç fiyatı, 1–2 günde montaj.", sub: "Donanım + montaj + telefon kurulumu. Fiyatlar tipik tesis içindir; net teklif 1 günde ücretsiz.", home: "Ana sayfa", from: "", more: "Detay" },
  zh: { title: "明码标价的安防套装", desc: "家庭、商铺、办公室与仓库的交钥匙监控与门禁套装：清单、起价、1–2天安装。", sub: "设备＋安装＋手机设置。价格为典型场地起价；准确报价1天内免费提供。", home: "首页", from: "", more: "详情" },
};

const LONG: Record<string, { h2a: string; pa: string; h2b: string; pb: string; h2c: string; pc: string; more: string; l1: string; l2: string; l3: string }> = {
  ru: { h2a: "Что входит в комплект", pa: "Комплект — это не коробка с оборудованием, а работающая система: камеры или считыватели, регистратор либо контроллер, блок питания, кабель и крепёж, работа монтажной бригады, пусконаладка и настройка просмотра с телефона. Цена «от» посчитана для типового объекта: частный дом в один этаж, торговый зал до 100 м², офис на 10–15 сотрудников или склад с одним въездом.", h2b: "Как выбрать комплект", pb: "Считать начинают не с числа камер, а с задач. Нужно видеть лица на входе — берут камеру с разрешением от 4 Мп и ставят её на уровне головы, а не под потолком. Нужно контролировать двор ночью — смотрят на инфракрасную подсветку и светочувствительность. Для магазина важен обзор кассы и торгового зала, для склада — ворота и погрузка, для офиса — вход и коридоры. Второй по важности параметр — глубина архива: чем больше камер и выше разрешение, тем быстрее перезаписывается диск, и это считают заранее.", h2c: "Что считается отдельно", pc: "В цену «от» не входят работы, которые зависят от состояния объекта: штробление и прокладка трасс в готовом ремонте, монтаж на высоте с автовышки, дополнительный жёсткий диск под длинный архив, источник бесперебойного питания и подключение к интернету, если его на объекте нет. Всё это мы называем до начала работ, а не в конце — смету на нетиповой объект считаем бесплатно за один день.", more: "Нужен расчёт под свой объект:", l1: "Установка видеонаблюдения", l2: "Системы контроля доступа", l3: "Каталог оборудования" },
  uz: { h2a: "Toʻplamga nima kiradi", pa: "Toʻplam — bu uskunalar solingan quti emas, ishlayotgan tizim: kameralar yoki oʻqish qurilmalari, registrator yoki kontroller, quvvat bloki, kabel va mahkamlagichlar, montaj brigadasining ishi, sozlash va telefondan koʻrishni ishga tushirish. «Dan» narxi tipik obyekt uchun hisoblangan: bir qavatli uy, 100 m² gacha savdo zali, 10–15 xodimli ofis yoki bitta kirishli ombor.", h2b: "Toʻplamni qanday tanlash kerak", pb: "Hisob kameralar sonidan emas, vazifadan boshlanadi. Kirishda yuzni koʻrish kerak boʻlsa — 4 Mp dan yuqori kamera olinadi va u shift ostiga emas, bosh balandligiga oʻrnatiladi. Hovlini tunda kuzatish kerak boʻlsa — infraqizil yoritish va yorugʻlikka sezgirlikka qaraladi. Doʻkon uchun kassa va savdo zali, ombor uchun darvoza va yuklash joyi, ofis uchun kirish va yoʻlaklar muhim. Ikkinchi muhim parametr — arxiv chuqurligi: kamera koʻp va ruxsat yuqori boʻlsa, disk tezroq qayta yoziladi, buni oldindan hisoblaymiz.", h2c: "Alohida hisoblanadigan ishlar", pc: "«Dan» narxiga obyekt holatiga bogʻliq ishlar kirmaydi: tayyor taʼmirda shtroba ochish va trassa yotqizish, avtovyshka bilan balandlikda montaj, uzoq arxiv uchun qoʻshimcha qattiq disk, uzluksiz quvvat manbai va obyektda internet boʻlmasa — uni ulash. Bularning barchasini ish boshlanishidan oldin aytamiz; notipik obyekt smetasi bir kunda va bepul.", more: "Oʻz obyektingiz uchun hisob kerakmi:", l1: "Videokuzatuv oʻrnatish", l2: "Kirishni nazorat qilish tizimlari", l3: "Uskunalar katalogi" },
  en: { h2a: "What the kit includes", pa: "A kit is not a box of hardware but a working system: cameras or readers, a recorder or controller, power supply, cable and mounts, the installation crew’s work, commissioning and phone access set up for you. The starting price is calculated for a typical site: a single-storey house, a retail floor up to 100 m², an office of 10–15 people or a warehouse with one gate.", h2b: "How to choose a kit", pb: "The count starts with the task, not with the number of cameras. If faces at the entrance must be readable, you take a camera of 4 MP or more and mount it at head height rather than under the ceiling. If the yard has to be watched at night, infrared range and light sensitivity matter. A shop needs the till and the floor covered, a warehouse the gate and loading area, an office the entrance and corridors. The second parameter is archive depth: more cameras at higher resolution overwrite the disk faster, so it is calculated in advance.", h2c: "What is quoted separately", pc: "The starting price excludes work that depends on the state of the building: chasing walls and running conduit in a finished interior, work at height from a lift, an extra hard drive for a longer archive, an uninterruptible power supply and an internet connection if the site has none. We name all of it before the work starts, not at the end — a quote for a non-standard site is free within one day.", more: "Need a calculation for your site:", l1: "CCTV installation", l2: "Access control systems", l3: "Equipment catalog" },
  tr: { h2a: "Sete neler dahil", pa: "Set, donanım kutusu değil çalışan bir sistemdir: kameralar veya okuyucular, kayıt cihazı ya da kontrolör, güç kaynağı, kablo ve montaj malzemesi, ekibin işçiliği, devreye alma ve telefondan izlemenin kurulumu. Başlangıç fiyatı tipik bir tesis için hesaplanır: tek katlı ev, 100 m²’ye kadar satış alanı, 10–15 kişilik ofis veya tek kapılı depo.", h2b: "Set nasıl seçilir", pb: "Hesap kamera sayısıyla değil, ihtiyaçla başlar. Girişte yüzlerin okunması gerekiyorsa 4 MP ve üzeri kamera alınır ve tavana değil, baş hizasına takılır. Bahçe gece izlenecekse kızılötesi mesafe ve ışık hassasiyeti önemlidir. Mağazada kasa ve satış alanı, depoda kapı ve yükleme, ofiste giriş ve koridorlar kapsanır. İkinci parametre arşiv derinliğidir: kamera sayısı ve çözünürlük arttıkça disk daha hızlı üzerine yazar, bu önceden hesaplanır.", h2c: "Ayrı fiyatlandırılanlar", pc: "Başlangıç fiyatına, binanın durumuna bağlı işler dahil değildir: bitmiş mekânda kanal açma ve tesisat çekme, platformla yüksekte çalışma, uzun arşiv için ek sabit disk, kesintisiz güç kaynağı ve tesiste yoksa internet bağlantısı. Bunların hepsini işin sonunda değil, başında söyleriz — standart dışı tesis için teklif bir günde ve ücretsizdir.", more: "Kendi tesisiniz için hesap gerekiyorsa:", l1: "Kamera montajı", l2: "Geçiş kontrol sistemleri", l3: "Ekipman kataloğu" },
  zh: { h2a: "套装包含什么", pa: "套装不是一箱设备，而是一套能用的系统：摄像机或读卡器、录像机或控制器、电源、线缆与支架，以及施工班组的人工、调试和手机远程查看的设置。起价按典型场地计算：单层住宅、100 平方米以内的卖场、10–15 人的办公室，或只有一个出入口的仓库。", h2b: "如何选择套装", pb: "先看任务，而不是先数摄像机。若要在入口看清人脸，就选 4MP 以上的摄像机，并装在与头部齐平的高度，而不是吊顶下。若要夜间看清院子，就看红外距离与低照度能力。商铺要覆盖收银台与卖场，仓库要覆盖大门与装卸区，办公室要覆盖入口与走廊。第二个关键参数是录像保存天数：摄像机越多、分辨率越高，硬盘覆写越快，这要提前算好。", h2c: "哪些单独计价", pc: "起价不含与现场状况相关的工作：在已完成装修的空间开槽布管、使用升降平台高空作业、为延长保存天数增加硬盘、不间断电源，以及现场没有网络时的接入。这些我们在开工前就讲清楚，而不是结账时才提——非标准场地的报价一天内免费给出。", more: "需要按您的场地测算：", l1: "视频监控安装", l2: "门禁系统", l3: "设备目录" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  return {
    title: ui.title,
    description: ui.desc,
    alternates: hreflangAlternates("/kits", locale),
    openGraph: { title: ui.title, description: ui.desc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function KitsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const ui = UI[locale] ?? UI.ru;
  const kits = kitsForLocale(locale);
  const lg = LONG[locale] ?? LONG.ru;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
  const lp = locale !== "ru" ? `/${locale}` : "";

  const listLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: kits.map((k, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: k.loc[locale].title,
      url: `${siteUrl}${lp}/kits/${k.slug}`,
    })),
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <header className="bg-slate-900">
        <div className="container-page py-10 sm:py-16">
          <nav className="mb-5 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-300/80">
            <Link href="/" className="hover:text-white transition-colors">{ui.home}</Link>
          </nav>
          <h1 className="max-w-3xl text-2xl sm:text-4xl font-black tracking-tight text-white">{ui.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-200">{ui.sub}</p>
        </div>
      </header>

      <section className="container-page py-8 sm:py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {kits.map((k) => {
            const b = k.loc[locale];
            return (
              <Link key={k.slug} href={`/kits/${k.slug}`}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-brand-300 hover:bg-white">
                <p className="text-lg font-black tracking-tight text-slate-900 group-hover:text-brand-700">{b.title}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{b.tagline}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="rounded-full bg-brand-600 px-4 py-1.5 text-sm font-black text-white">{b.priceLabel}</span>
                  <span className="text-sm font-bold text-brand-700">{ui.more} →</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Страница жила на одних карточках (101 слово) и не попадала в индекс ни в одной
            локали — Google считал её малоценной. Разбор состава и перелинковка. */}
        <div className="mt-12 max-w-3xl space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{lg.h2a}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">{lg.pa}</p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{lg.h2b}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">{lg.pb}</p>
          </section>
          <section>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{lg.h2c}</h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-slate-600">{lg.pc}</p>
          </section>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-6 text-sm">
            <span className="font-bold text-slate-900">{lg.more}</span>
            <Link href="/solutions/cctv" className="font-bold text-brand-700 hover:underline">{lg.l1} →</Link>
            <Link href="/solutions/access" className="font-bold text-brand-700 hover:underline">{lg.l2} →</Link>
            <Link href="/products" className="font-bold text-brand-700 hover:underline">{lg.l3} →</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
