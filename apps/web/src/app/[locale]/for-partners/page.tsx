import type { Metadata } from "next";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

// «Партнёрам и СМИ» — страница для тех, кто ссылается на нас: заказчики (бейдж
// «объект под защитой SAT Solutions»), вендоры (карточка партнёра), журналисты
// (готовые факты и цифры). Появилась 21.09.2026 в рамках работы над ссылочным
// профилем: на тот момент у сайта было 22 внешних ссылки, все на главную.
// Инлайн-словарь по образцу /delivery.
const SITE = "https://satsolutions.uz";

type Dict = {
  title: string; metaDesc: string; h1: string; intro: string;
  badgeH: string; badgeP: string[]; badgeLight: string; badgeDark: string; badgeEn: string; badgeCode: string; badgeAlt: string;
  factsH: string; facts: { k: string; v: string }[];
  pressH: string; press: string[]; pressLinks: { label: string; href: string }[];
  logoH: string; logoP: string; logoLink: string;
  contactH: string; contact: string;
};

const D: Record<string, Dict> = {
  ru: {
    title: "Партнёрам и СМИ",
    metaDesc: "Бейдж «Объект под защитой SAT Solutions» для сайтов заказчиков, логотип, карточка компании и проверенные факты для журналистов и партнёров.",
    h1: "Партнёрам и СМИ",
    intro: "Здесь всё, что нужно, чтобы сослаться на нас корректно: бейдж для сайта заказчика, логотип, реквизиты и факты о компании, на которые можно опираться в публикации.",
    badgeH: "Бейдж для сайта заказчика",
    badgeP: [
      "Если мы построили или обслуживаем систему безопасности на вашем объекте, вы можете поставить на сайт бейдж «Системы безопасности — SAT Solutions». Он ведёт на нашу главную страницу и подтверждает, кто отвечает за видеонаблюдение, СКУД или пожарную сигнализацию объекта.",
      "Три варианта: светлый, тёмный и английский. Вставьте код ниже в подвал сайта или на страницу «О нас» — картинка загружается с нашего сервера, ничего размещать у себя не нужно.",
    ],
    badgeLight: "Светлый", badgeDark: "Тёмный", badgeEn: "Английский",
    badgeCode: "Код для вставки",
    badgeAlt: "Системы безопасности — SAT Solutions",
    factsH: "Карточка компании",
    facts: [
      { k: "Юридическое лицо", v: "ООО «SUPPLY AND TRANSPORTATION», бренд SAT Solutions, ИНН 308603912" },
      { k: "Адрес", v: "г. Ташкент, ул. Катта Дархон, 5" },
      { k: "Направления", v: "Видеонаблюдение, контроль доступа и учёт времени, пожарная и охранная сигнализация, домофония, сети и Wi-Fi, серверные" },
      { k: "Лицензии", v: "Охранные системы — Национальная гвардия РУз, подтверждение № 1554491. Пожарные системы — МЧС РУз, № 913518" },
      { k: "Партнёрские статусы", v: "Dahua — Authorized Strategic System Integrator (2026), Ruijie — Silver Partner, Schneider Electric — Select Partner (APC), H3C, ZKTeco, Hikvision; эксклюзивный дистрибьютор IP-COM в Узбекистане" },
      { k: "Каталог", v: "3 200+ позиций в наличии в Ташкенте, 34 бренда, цены на сайте" },
      { k: "Собственные продукты", v: "SAT Uy — приложение для жителей ЖК, SAT Davomat — учёт рабочего времени с выгрузкой в 1С" },
    ],
    pressH: "Журналистам: цифры, которые можно цитировать",
    press: [
      "Мы публикуем расчёты по собственному каталогу и прайсу на работы, а не оценки «по рынку». У каждой цифры есть дата актуальности и методика — на неё можно сослаться без риска.",
      "Готовы дать комментарий по видеонаблюдению, СКУД, пожарной безопасности и нормам Узбекистана в этой области. Ответ — в течение рабочего дня.",
    ],
    pressLinks: [
      { label: "Индекс цен на слаботочные системы в Ташкенте, 2026", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      { label: "Нормы Узбекистана по системам безопасности: справочник", href: "/blog/normy-slabotochnye-sistemy-uzbekistan" },
      { label: "Калькулятор стоимости монтажа", href: "/calculator" },
      { label: "Реализованные проекты", href: "/portfolio" },
    ],
    logoH: "Логотип",
    logoP: "Логотип можно использовать в публикациях о нас и в списках партнёров. Не меняйте цвета и пропорции, не помещайте на пёстрый фон.",
    logoLink: "Скачать логотип (PNG, 512×164)",
    contactH: "Связаться по вопросам партнёрства",
    contact: "sales@satsolutions.uz · +998 97 862 66 99 · Пн–Пт 9:00–18:00",
  },
  uz: {
    title: "Hamkorlar va OAV uchun",
    metaDesc: "Buyurtmachilar sayti uchun «Obyekt SAT Solutions himoyasida» belgisi, logotip, kompaniya kartochkasi va jurnalistlar hamda hamkorlar uchun tekshirilgan faktlar.",
    h1: "Hamkorlar va OAV uchun",
    intro: "Bizga toʻgʻri havola berish uchun kerak boʻlgan hamma narsa shu yerda: buyurtmachi sayti uchun belgi, logotip, rekvizitlar va nashrda tayanish mumkin boʻlgan faktlar.",
    badgeH: "Buyurtmachi sayti uchun belgi",
    badgeP: [
      "Agar obyektingizdagi xavfsizlik tizimini biz qurgan yoki xizmat koʻrsatayotgan boʻlsak, saytingizga «Xavfsizlik tizimlari — SAT Solutions» belgisini qoʻyishingiz mumkin. U bizning bosh sahifamizga olib boradi va obyektning videokuzatuvi, SKUD yoki yongʻin signalizatsiyasi uchun kim javob berishini tasdiqlaydi.",
      "Uch variant: och, toʻq va inglizcha. Quyidagi kodni sayt pastki qismiga yoki «Biz haqimizda» sahifasiga joylashtiring — rasm bizning serverimizdan yuklanadi, oʻzingizda hech narsa saqlash shart emas.",
    ],
    badgeLight: "Och", badgeDark: "Toʻq", badgeEn: "Inglizcha",
    badgeCode: "Joylashtirish kodi",
    badgeAlt: "Xavfsizlik tizimlari — SAT Solutions",
    factsH: "Kompaniya kartochkasi",
    facts: [
      { k: "Yuridik shaxs", v: "«SUPPLY AND TRANSPORTATION» MChJ, SAT Solutions brendi, STIR 308603912" },
      { k: "Manzil", v: "Toshkent sh., Katta Darxon koʻchasi, 5" },
      { k: "Yoʻnalishlar", v: "Videokuzatuv, kirishni nazorat qilish va ish vaqti hisobi, yongʻin va qoʻriqlash signalizatsiyasi, domofoniya, tarmoqlar va Wi-Fi, server xonalari" },
      { k: "Litsenziyalar", v: "Qoʻriqlash tizimlari — OʻzR Milliy gvardiyasi, tasdiq № 1554491. Yongʻin tizimlari — OʻzR FVV, № 913518" },
      { k: "Hamkorlik maqomlari", v: "Dahua — Authorized Strategic System Integrator (2026), Ruijie — Silver Partner, Schneider Electric — Select Partner (APC), H3C, ZKTeco, Hikvision; Oʻzbekistonda IP-COM eksklyuziv distribyutori" },
      { k: "Katalog", v: "Toshkentda 3 200+ pozitsiya mavjud, 34 brend, narxlar saytda" },
      { k: "Oʻz mahsulotlarimiz", v: "SAT Uy — TJM aholisi uchun ilova, SAT Davomat — 1Cga yuklash bilan ish vaqti hisobi" },
    ],
    pressH: "Jurnalistlarga: iqtibos keltirish mumkin boʻlgan raqamlar",
    press: [
      "Biz «bozor boʻyicha» baholarni emas, oʻz katalogimiz va ishlar narxnomasi asosidagi hisob-kitoblarni chop etamiz. Har bir raqamning dolzarblik sanasi va metodikasi bor — unga xavfsiz tayanish mumkin.",
      "Videokuzatuv, SKUD, yongʻin xavfsizligi va Oʻzbekistonning shu sohadagi meʼyorlari boʻyicha izoh berishga tayyormiz. Javob — ish kuni davomida.",
    ],
    pressLinks: [
      { label: "Toshkentda kuchsiz tokli tizimlar narx indeksi, 2026", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      { label: "Oʻzbekistonning xavfsizlik tizimlari boʻyicha meʼyorlari: maʼlumotnoma", href: "/blog/normy-slabotochnye-sistemy-uzbekistan" },
      { label: "Montaj narxi kalkulyatori", href: "/calculator" },
      { label: "Bajarilgan loyihalar", href: "/portfolio" },
    ],
    logoH: "Logotip",
    logoP: "Logotipdan biz haqimizdagi nashrlarda va hamkorlar roʻyxatida foydalanish mumkin. Ranglar va nisbatlarni oʻzgartirmang, rang-barang fonga qoʻymang.",
    logoLink: "Logotipni yuklab olish (PNG, 512×164)",
    contactH: "Hamkorlik masalalari boʻyicha bogʻlanish",
    contact: "sales@satsolutions.uz · +998 97 862 66 99 · Du–Ju 9:00–18:00",
  },
  en: {
    title: "For partners and media",
    metaDesc: "“Protected by SAT Solutions” badge for client websites, logo, company card and verified facts for journalists and partners.",
    h1: "For partners and media",
    intro: "Everything you need to reference us correctly: a badge for a client's website, our logo, company details and facts you can rely on in a publication.",
    badgeH: "Badge for a client's website",
    badgeP: [
      "If we built or maintain the security system at your site, you can place the “Security systems — SAT Solutions” badge on your website. It links to our homepage and confirms who is responsible for the site's video surveillance, access control or fire alarm.",
      "Three versions: light, dark and English. Paste the code below into your site footer or “About us” page — the image is served from our server, nothing to host on your side.",
    ],
    badgeLight: "Light", badgeDark: "Dark", badgeEn: "English",
    badgeCode: "Embed code",
    badgeAlt: "Security systems — SAT Solutions",
    factsH: "Company card",
    facts: [
      { k: "Legal entity", v: "SUPPLY AND TRANSPORTATION LLC, SAT Solutions brand, TIN 308603912" },
      { k: "Address", v: "5 Katta Darkhon St., Tashkent, Uzbekistan" },
      { k: "Fields", v: "Video surveillance, access control and time attendance, fire and intrusion alarms, intercoms, networks and Wi-Fi, server rooms" },
      { k: "Licences", v: "Security systems — National Guard of Uzbekistan, confirmation No. 1554491. Fire systems — Ministry of Emergency Situations, No. 913518" },
      { k: "Partner statuses", v: "Dahua — Authorized Strategic System Integrator (2026), Ruijie — Silver Partner, Schneider Electric — Select Partner (APC), H3C, ZKTeco, Hikvision; exclusive IP-COM distributor in Uzbekistan" },
      { k: "Catalogue", v: "3,200+ items in stock in Tashkent, 34 brands, prices published on the site" },
      { k: "Own products", v: "SAT Uy — residents' app for housing estates, SAT Davomat — time attendance with 1C export" },
    ],
    pressH: "For journalists: figures you can quote",
    press: [
      "We publish calculations based on our own catalogue and labour price list, not “market estimates”. Every figure carries a validity date and a method — it can be cited safely.",
      "We are available for comment on video surveillance, access control, fire safety and the relevant Uzbek regulations. Reply within one working day.",
    ],
    pressLinks: [
      { label: "Price index for low-voltage systems in Tashkent, 2026", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      { label: "Uzbekistan's security-system regulations: reference", href: "/blog/normy-slabotochnye-sistemy-uzbekistan" },
      { label: "Installation cost calculator", href: "/calculator" },
      { label: "Completed projects", href: "/portfolio" },
    ],
    logoH: "Logo",
    logoP: "The logo may be used in publications about us and in partner lists. Do not change colours or proportions, do not place it on a busy background.",
    logoLink: "Download logo (PNG, 512×164)",
    contactH: "Partnership enquiries",
    contact: "sales@satsolutions.uz · +998 97 862 66 99 · Mon–Fri 9:00–18:00",
  },
  tr: {
    title: "Ortaklar ve basın için",
    metaDesc: "Müşteri siteleri için «SAT Solutions korumasında» rozeti, logo, şirket kartı ve gazeteciler ile ortaklar için doğrulanmış bilgiler.",
    h1: "Ortaklar ve basın için",
    intro: "Bize doğru şekilde atıf yapmak için gereken her şey burada: müşteri sitesi için rozet, logo, şirket bilgileri ve bir yayında güvenle dayanabileceğiniz gerçekler.",
    badgeH: "Müşteri sitesi için rozet",
    badgeP: [
      "Tesisinizdeki güvenlik sistemini biz kurduysak veya bakımını yapıyorsak, sitenize «Güvenlik sistemleri — SAT Solutions» rozetini koyabilirsiniz. Rozet ana sayfamıza yönlendirir ve tesisin video gözetim, geçiş kontrol veya yangın alarmından kimin sorumlu olduğunu doğrular.",
      "Üç sürüm: açık, koyu ve İngilizce. Aşağıdaki kodu sitenizin alt bilgisine veya «Hakkımızda» sayfasına yapıştırın — görsel bizim sunucumuzdan yüklenir, sizin tarafınızda barındırmanız gerekmez.",
    ],
    badgeLight: "Açık", badgeDark: "Koyu", badgeEn: "İngilizce",
    badgeCode: "Gömme kodu",
    badgeAlt: "Güvenlik sistemleri — SAT Solutions",
    factsH: "Şirket kartı",
    facts: [
      { k: "Tüzel kişi", v: "SUPPLY AND TRANSPORTATION LLC, SAT Solutions markası, VKN 308603912" },
      { k: "Adres", v: "Katta Darhon Cad. 5, Taşkent, Özbekistan" },
      { k: "Alanlar", v: "Video gözetim, geçiş kontrol ve mesai takibi, yangın ve hırsız alarmı, diafon, ağ ve Wi-Fi, sunucu odaları" },
      { k: "Lisanslar", v: "Güvenlik sistemleri — Özbekistan Ulusal Muhafızları, onay No. 1554491. Yangın sistemleri — Acil Durumlar Bakanlığı, No. 913518" },
      { k: "Ortaklık statüleri", v: "Dahua — Authorized Strategic System Integrator (2026), Ruijie — Silver Partner, Schneider Electric — Select Partner (APC), H3C, ZKTeco, Hikvision; Özbekistan'da IP-COM münhasır distribütörü" },
      { k: "Katalog", v: "Taşkent'te stokta 3.200+ ürün, 34 marka, fiyatlar sitede" },
      { k: "Kendi ürünlerimiz", v: "SAT Uy — site sakinleri uygulaması, SAT Davomat — 1C aktarımlı mesai takibi" },
    ],
    pressH: "Gazetecilere: alıntılanabilir rakamlar",
    press: [
      "«Piyasa tahminleri» değil, kendi kataloğumuz ve işçilik fiyat listemize dayanan hesaplamalar yayınlıyoruz. Her rakamın geçerlilik tarihi ve yöntemi vardır — güvenle alıntılanabilir.",
      "Video gözetim, geçiş kontrol, yangın güvenliği ve Özbekistan'ın bu alandaki mevzuatı hakkında yorum vermeye hazırız. Yanıt — bir iş günü içinde.",
    ],
    pressLinks: [
      { label: "Taşkent'te zayıf akım sistemleri fiyat endeksi, 2026", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      { label: "Özbekistan güvenlik sistemi mevzuatı: rehber", href: "/blog/normy-slabotochnye-sistemy-uzbekistan" },
      { label: "Montaj maliyeti hesaplayıcısı", href: "/calculator" },
      { label: "Tamamlanan projeler", href: "/portfolio" },
    ],
    logoH: "Logo",
    logoP: "Logo, hakkımızdaki yayınlarda ve ortak listelerinde kullanılabilir. Renkleri ve oranları değiştirmeyin, karmaşık bir arka plana yerleştirmeyin.",
    logoLink: "Logoyu indir (PNG, 512×164)",
    contactH: "Ortaklık için iletişim",
    contact: "sales@satsolutions.uz · +998 97 862 66 99 · Pzt–Cum 9:00–18:00",
  },
  zh: {
    title: "合作伙伴与媒体",
    metaDesc: "供客户网站使用的“由 SAT Solutions 守护”徽章、标志、公司名片，以及供记者和合作伙伴引用的经核实信息。",
    h1: "合作伙伴与媒体",
    intro: "正确引用我们所需的一切都在这里：客户网站徽章、标志、公司信息，以及可在报道中放心引用的事实。",
    badgeH: "客户网站徽章",
    badgeP: [
      "如果贵方场所的安防系统由我们建设或维护，可在网站上放置“安防系统 — SAT Solutions”徽章。徽章链接至我们的首页，说明该场所的视频监控、门禁或火灾报警由谁负责。",
      "三种版本：浅色、深色和英文。将下方代码粘贴到网站页脚或“关于我们”页面即可——图片由我们的服务器提供，无需在贵方托管。",
    ],
    badgeLight: "浅色", badgeDark: "深色", badgeEn: "英文",
    badgeCode: "嵌入代码",
    badgeAlt: "安防系统 — SAT Solutions",
    factsH: "公司名片",
    facts: [
      { k: "法人", v: "SUPPLY AND TRANSPORTATION 有限责任公司，SAT Solutions 品牌，税号 308603912" },
      { k: "地址", v: "乌兹别克斯坦塔什干市 Katta Darkhon 街 5 号" },
      { k: "业务方向", v: "视频监控、门禁与考勤、火灾与入侵报警、楼宇对讲、网络与 Wi-Fi、机房" },
      { k: "许可证", v: "安防系统 — 乌兹别克斯坦国民近卫军，确认号 1554491；消防系统 — 紧急情况部，编号 913518" },
      { k: "合作伙伴资质", v: "大华 Dahua — 授权战略系统集成商（2026），锐捷 Ruijie — Silver Partner，施耐德电气 — Select Partner（APC），H3C、ZKTeco、海康威视；IP-COM 乌兹别克斯坦独家经销商" },
      { k: "产品目录", v: "塔什干现货 3,200 余种，34 个品牌，价格公开于网站" },
      { k: "自有产品", v: "SAT Uy — 住宅小区住户应用，SAT Davomat — 支持导出至 1C 的考勤系统" },
    ],
    pressH: "致记者：可直接引用的数字",
    press: [
      "我们发布的测算基于自有产品目录和施工价目表，而非“市场估计”。每个数字都注明有效日期和方法——可放心引用。",
      "我们可就视频监控、门禁、消防安全以及乌兹别克斯坦相关法规提供评论，一个工作日内答复。",
    ],
    pressLinks: [
      { label: "2026 年塔什干弱电系统价格指数", href: "/blog/indeks-cen-slabotochnye-sistemy-tashkent-2026" },
      { label: "乌兹别克斯坦安防系统法规指南", href: "/blog/normy-slabotochnye-sistemy-uzbekistan" },
      { label: "安装费用计算器", href: "/calculator" },
      { label: "已完成项目", href: "/portfolio" },
    ],
    logoH: "标志",
    logoP: "标志可用于关于我们的报道和合作伙伴列表。请勿更改颜色和比例，勿置于花哨背景上。",
    logoLink: "下载标志（PNG，512×164）",
    contactH: "合作事宜联系",
    contact: "sales@satsolutions.uz · +998 97 862 66 99 · 周一至周五 9:00–18:00",
  },
};

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = D[locale] ?? D.ru;
  return {
    title: d.title,
    description: d.metaDesc,
    alternates: hreflangAlternates("/for-partners", locale),
    openGraph: { title: d.title, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

const BADGES = [
  { key: "light", file: "sat-badge.svg" },
  { key: "dark", file: "sat-badge-dark.svg" },
  { key: "en", file: "sat-badge-en.svg" },
] as const;

function embedCode(file: string, alt: string) {
  return `<a href="${SITE}/" rel="noopener"><img src="${SITE}/badge/${file}" alt="${alt}" width="220" height="56" loading="lazy"></a>`;
}

export default async function ForPartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = D[locale] ?? D.ru;
  const lp = locale === "ru" ? "" : `/${locale}`;
  const labels: Record<(typeof BADGES)[number]["key"], string> = { light: d.badgeLight, dark: d.badgeDark, en: d.badgeEn };
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{d.h1}</h1>
      <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">{d.intro}</p>

      <section className="mt-10 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-950">{d.badgeH}</h2>
        {d.badgeP.map((p) => <p key={p} className="mt-3 text-slate-700 leading-relaxed">{p}</p>)}
        <div className="mt-6 flex flex-col gap-6">
          {BADGES.map((b) => (
            <div key={b.key} className={`rounded-xl border border-slate-200 p-4 ${b.key === "dark" ? "bg-slate-900" : "bg-white"}`}>
              <div className={`text-xs font-bold uppercase tracking-wider ${b.key === "dark" ? "text-slate-300" : "text-slate-500"}`}>{labels[b.key]}</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/badge/${b.file}`} alt={d.badgeAlt} width={220} height={56} className="mt-3" />
              <div className={`mt-3 text-xs font-semibold ${b.key === "dark" ? "text-slate-300" : "text-slate-500"}`}>{d.badgeCode}</div>
              <pre className={`mt-1 overflow-x-auto rounded-lg p-3 text-xs leading-relaxed select-all ${b.key === "dark" ? "bg-slate-800 text-slate-100" : "bg-slate-50 text-slate-800"}`}>
                {embedCode(b.file, b.key === "en" ? "Security systems — SAT Solutions" : d.badgeAlt)}
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-950">{d.factsH}</h2>
        <dl className="mt-4 divide-y divide-slate-200 rounded-xl border border-slate-200">
          {d.facts.map((f) => (
            <div key={f.k} className="grid gap-1 px-4 py-3 sm:grid-cols-[180px_1fr] sm:gap-4">
              <dt className="text-sm font-bold text-slate-500">{f.k}</dt>
              <dd className="text-sm text-slate-800 leading-relaxed">{f.v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-950">{d.pressH}</h2>
        {d.press.map((p) => <p key={p} className="mt-3 text-slate-700 leading-relaxed">{p}</p>)}
        <ul className="mt-4 flex flex-col gap-2 list-disc pl-5">
          {d.pressLinks.map((l) => (
            <li key={l.href}><a href={`${lp}${l.href}`} className="font-semibold text-brand-700 hover:underline">{l.label}</a></li>
          ))}
        </ul>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-950">{d.logoH}</h2>
        <p className="mt-3 text-slate-700 leading-relaxed">{d.logoP}</p>
        <div className="mt-4 inline-block rounded-xl border border-slate-200 bg-white p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SAT Solutions" width={256} height={82} />
        </div>
        <div className="mt-3">
          <a href="/logo.png" download className="font-semibold text-brand-700 hover:underline">{d.logoLink}</a>
        </div>
      </section>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-lg font-bold text-slate-950">{d.contactH}</h2>
        <p className="mt-3 text-sm font-semibold text-slate-600">{d.contact}</p>
      </section>
    </div>
  );
}
