import type { Metadata } from "next";
import Link from "next/link";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

export const revalidate = 86400;

// Путь с языковым префиксом (ru — без префикса), без домена.
const locPath = (locale: string, path: string) => `${locale === "ru" ? "" : `/${locale}`}${path}`;

// Партнёрский лендинг H3C — авторитетный (E-E-A-T) и линкуемый актив.
// SAT Solutions — партнёр H3C в Узбекистане (серверы, виртуализация H3C CAS, сети/ЦОД).
// Ссылается на бренд-каталог H3C, услуги (server/virtualization/network) и реальный кейс.
type Sec = { h: string; p: string[] };
type Dict = {
  title: string; metaDesc: string; h1: string; lead: string;
  badge: string; sections: Sec[];
  linksTitle: string; catalog: string; caseLink: string; svcServer: string; svcVirt: string; svcNet: string;
  ctaTitle: string; ctaText: string; ctaBtn: string;
};

const CASE_SLUG = "montazh-servernoy-komnaty";

const D: Record<string, Dict> = {
  ru: {
    title: "H3C в Узбекистане — партнёр SAT Solutions | серверы, виртуализация, сети",
    metaDesc:
      "SAT Solutions — партнёр H3C в Узбекистане: поставка и внедрение серверов H3C UniServer, платформы виртуализации H3C CAS, коммутаторов и решений для ЦОД под ключ в Ташкенте. Проект, миграция, вендорская поддержка.",
    h1: "H3C в Узбекистане — партнёр SAT Solutions",
    lead:
      "SAT Solutions — партнёр H3C в Узбекистане. Поставляем и внедряем корпоративное оборудование H3C под ключ: серверы, платформу виртуализации, коммутаторы и решения для центров обработки данных — от аудита и спецификации до миграции рабочих систем и вендорской поддержки.",
    badge: "Официальное партнёрство",
    sections: [
      {
        h: "Кто такой H3C",
        p: [
          "H3C (New H3C Technologies) — один из мировых лидеров в корпоративной ИТ-инфраструктуре: серверы, системы хранения, сетевое оборудование, платформы виртуализации и облачные решения. Оборудование H3C используют дата-центры, банки, операторы связи и промышленные предприятия по всему миру.",
          "Для бизнеса в Узбекистане H3C — это надёжная альтернатива привычным вендорам с сильной линейкой для ЦОД и виртуализации, конкурентной ценой и полноценной вендорской поддержкой.",
        ],
      },
      {
        h: "Что мы поставляем и внедряем",
        p: [
          "Серверы H3C UniServer — стоечные серверы для виртуализации, баз данных и корпоративных приложений: многоядерные процессоры, память DDR5, NVMe/SSD-хранилище, сетевые интерфейсы 10/25GbE.",
          "H3C CAS — платформа виртуализации корпоративного класса: кластеры высокой доступности с автоматическим перезапуском виртуальных машин, миграция «на лету» без переустановки, единая консоль управления инфраструктурой.",
          "Сетевое оборудование H3C — управляемые коммутаторы, маршрутизаторы и решения для ЦОД: построение отказоустойчивой сети предприятия, сегментация, агрегация каналов.",
        ],
      },
      {
        h: "Почему под ключ с SAT Solutions",
        p: [
          "Мы ведём проект целиком: обследование инфраструктуры, подбор конфигурации под нагрузку, поставка, монтаж в стойку, развёртывание платформы, миграция существующих систем, настройка резервного копирования и обучение администраторов заказчика.",
          "Подключаем годовую вендорскую поддержку H3C и остаёмся на связи после сдачи — сопровождаем инфраструктуру и помогаем масштабировать её без замены платформы.",
        ],
      },
    ],
    linksTitle: "Подробнее",
    catalog: "Оборудование H3C в каталоге",
    caseLink: "Наш кейс: монтаж серверной комнаты под ключ",
    svcServer: "Серверы и серверные под ключ",
    svcVirt: "Виртуализация инфраструктуры",
    svcNet: "Корпоративные сети и СКС",
    ctaTitle: "Нужен проект на оборудовании H3C?",
    ctaText: "Рассчитаем конфигурацию под вашу нагрузку и подготовим спецификацию — бесплатно.",
    ctaBtn: "Обсудить проект",
  },
  uz: {
    title: "O'zbekistonda H3C — SAT Solutions hamkori | serverlar, virtualizatsiya, tarmoqlar",
    metaDesc:
      "SAT Solutions — O'zbekistonda H3C hamkori: H3C UniServer serverlari, H3C CAS virtualizatsiya platformasi, kommutatorlar va ma'lumotlar markazi yechimlarini Toshkentda kalit topshirish asosida yetkazib berish va joriy etish. Loyiha, ko'chirish, vendor qo'llab-quvvatlash.",
    h1: "O'zbekistonda H3C — SAT Solutions hamkori",
    lead:
      "SAT Solutions — O'zbekistonda H3C hamkori. H3C korporativ uskunalarini kalit topshirish asosida yetkazib beramiz va joriy etamiz: serverlar, virtualizatsiya platformasi, kommutatorlar va ma'lumotlar markazi yechimlari — auditdan va spetsifikatsiyadan ishlayotgan tizimlarni ko'chirish va vendor qo'llab-quvvatlashgacha.",
    badge: "Rasmiy hamkorlik",
    sections: [
      {
        h: "H3C nima",
        p: [
          "H3C (New H3C Technologies) — korporativ IT-infratuzilma bo'yicha jahon yetakchilaridan biri: serverlar, saqlash tizimlari, tarmoq uskunalari, virtualizatsiya platformalari va bulutli yechimlar. H3C uskunalaridan butun dunyo bo'ylab ma'lumotlar markazlari, banklar, aloqa operatorlari va sanoat korxonalari foydalanadi.",
          "O'zbekistondagi biznes uchun H3C — ma'lumotlar markazi va virtualizatsiya uchun kuchli liniyaga, raqobatbardosh narxga va to'liq vendor qo'llab-quvvatlashga ega ishonchli muqobil.",
        ],
      },
      {
        h: "Biz nima yetkazib beramiz va joriy etamiz",
        p: [
          "H3C UniServer serverlari — virtualizatsiya, ma'lumotlar bazasi va korporativ ilovalar uchun stojli serverlar: ko'p yadroli protsessorlar, DDR5 xotira, NVMe/SSD saqlash, 10/25GbE tarmoq interfeyslari.",
          "H3C CAS — korporativ darajadagi virtualizatsiya platformasi: virtual mashinalar avtomatik qayta ishga tushadigan yuqori ishonchlilik klasterlari, qayta o'rnatishsiz «uchishda» ko'chirish, infratuzilmani boshqarishning yagona konsoli.",
          "H3C tarmoq uskunalari — boshqariladigan kommutatorlar, marshrutizatorlar va ma'lumotlar markazi yechimlari: korxonaning uzilishsiz tarmog'ini qurish, segmentatsiya, kanallarni birlashtirish.",
        ],
      },
      {
        h: "Nega SAT Solutions bilan kalit topshirish asosida",
        p: [
          "Loyihani to'liq olib boramiz: infratuzilmani tekshirish, yuklamaga mos konfiguratsiyani tanlash, yetkazib berish, stojga o'rnatish, platformani joylashtirish, mavjud tizimlarni ko'chirish, zaxira nusxalashni sozlash va buyurtmachi administratorlarini o'qitish.",
          "H3C yillik vendor qo'llab-quvvatlashini ulaymiz va topshirgandan keyin ham aloqada bo'lamiz — infratuzilmani kuzatib boramiz va platformani almashtirmasdan masshtablashga yordam beramiz.",
        ],
      },
    ],
    linksTitle: "Batafsil",
    catalog: "Katalogda H3C uskunalari",
    caseLink: "Bizning keys: server xonasini kalit topshirish asosida montaj qilish",
    svcServer: "Serverlar va server xonalari kalit topshirish asosida",
    svcVirt: "Infratuzilma virtualizatsiyasi",
    svcNet: "Korporativ tarmoqlar va SKS",
    ctaTitle: "H3C uskunalarida loyiha kerakmi?",
    ctaText: "Yuklamangizga mos konfiguratsiyani hisoblaymiz va spetsifikatsiya tayyorlaymiz — bepul.",
    ctaBtn: "Loyihani muhokama qilish",
  },
  en: {
    title: "H3C in Uzbekistan — SAT Solutions partner | servers, virtualization, networks",
    metaDesc:
      "SAT Solutions is an H3C partner in Uzbekistan: turnkey supply and deployment of H3C UniServer servers, the H3C CAS virtualization platform, switches and data-center solutions in Tashkent. Design, migration, vendor support.",
    h1: "H3C in Uzbekistan — SAT Solutions partner",
    lead:
      "SAT Solutions is an H3C partner in Uzbekistan. We supply and deploy H3C enterprise equipment turnkey: servers, the virtualization platform, switches and data-center solutions — from audit and specification to migration of production systems and vendor support.",
    badge: "Official partnership",
    sections: [
      {
        h: "Who H3C is",
        p: [
          "H3C (New H3C Technologies) is one of the world leaders in enterprise IT infrastructure: servers, storage, networking equipment, virtualization platforms and cloud solutions. H3C hardware powers data centers, banks, telecom operators and industrial enterprises worldwide.",
          "For businesses in Uzbekistan, H3C is a reliable alternative to the usual vendors — with a strong data-center and virtualization line-up, competitive pricing and full vendor support.",
        ],
      },
      {
        h: "What we supply and deploy",
        p: [
          "H3C UniServer servers — rack servers for virtualization, databases and enterprise applications: multi-core processors, DDR5 memory, NVMe/SSD storage, 10/25GbE network interfaces.",
          "H3C CAS — an enterprise-class virtualization platform: high-availability clusters with automatic restart of virtual machines, live migration without reinstallation, a single console to manage the infrastructure.",
          "H3C networking — managed switches, routers and data-center solutions: building a fault-tolerant enterprise network, segmentation, link aggregation.",
        ],
      },
      {
        h: "Why turnkey with SAT Solutions",
        p: [
          "We run the whole project: infrastructure survey, configuration sizing for the workload, supply, rack installation, platform deployment, migration of existing systems, backup setup and training of the customer's administrators.",
          "We connect a one-year H3C vendor support subscription and stay in touch after handover — we maintain the infrastructure and help scale it without replacing the platform.",
        ],
      },
    ],
    linksTitle: "Learn more",
    catalog: "H3C equipment in the catalog",
    caseLink: "Our case study: turnkey server room installation",
    svcServer: "Turnkey servers and server rooms",
    svcVirt: "Infrastructure virtualization",
    svcNet: "Enterprise networks and cabling",
    ctaTitle: "Need a project on H3C equipment?",
    ctaText: "We will size a configuration for your workload and prepare a specification — free of charge.",
    ctaBtn: "Discuss the project",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = D[locale] ?? D.en;
  return {
    title: { absolute: d.title },
    description: d.metaDesc,
    alternates: hreflangAlternates("/partners/h3c", locale),
    openGraph: { title: d.title, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function H3CPartnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = D[locale] ?? D.en;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

  const crumbHome = ({ ru: "Главная", uz: "Bosh sahifa", en: "Home", tr: "Ana sayfa", zh: "首页" } as Record<string, string>)[locale] ?? "Home";
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: crumbHome, item: `${siteUrl}${locPath(locale, "/")}` },
      { "@type": "ListItem", position: 2, name: "H3C", item: `${siteUrl}${locPath(locale, "/partners/h3c")}` },
    ],
  };
  const pageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: d.h1,
    description: d.metaDesc,
    url: `${siteUrl}${locPath(locale, "/partners/h3c")}`,
    about: { "@type": "Brand", name: "H3C" },
    provider: { "@type": "Organization", name: "SAT Solutions", url: siteUrl },
  };

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }} />
      <div className="container-page py-8 sm:py-12">
        <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand-700">{d.badge}</span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{d.h1}</h1>
        <p className="mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-slate-700">{d.lead}</p>

        <div className="mt-10 flex flex-col gap-8 max-w-3xl">
          {d.sections.map((s, i) => (
            <section key={i}>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">{s.h}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {s.p.map((p, j) => (
                  <p key={j} className="text-sm sm:text-base leading-relaxed text-slate-700">{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <div className="text-sm font-bold uppercase tracking-wider text-brand-600">{d.linksTitle}</div>
          <ul className="mt-3 flex flex-col gap-2.5 text-sm font-semibold">
            <li><Link href={`/catalog/h3c`} className="text-brand-700 hover:underline">{d.catalog} →</Link></li>
            <li><Link href={`/portfolio/${CASE_SLUG}`} className="text-brand-700 hover:underline">{d.caseLink} →</Link></li>
            <li><Link href={`/solutions/server`} className="text-brand-700 hover:underline">{d.svcServer} →</Link></li>
            <li><Link href={`/solutions/virtualization`} className="text-brand-700 hover:underline">{d.svcVirt} →</Link></li>
            <li><Link href={`/solutions/network`} className="text-brand-700 hover:underline">{d.svcNet} →</Link></li>
          </ul>
        </div>

        <div className="mt-10 max-w-3xl rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-slate-50 p-6">
          <div className="text-lg font-bold text-slate-900">{d.ctaTitle}</div>
          <p className="mt-1 text-sm text-slate-600">{d.ctaText}</p>
          <Link href={`/contact`} className="btn-primary mt-4 !bg-brand-700 hover:!bg-brand-800">{d.ctaBtn}</Link>
        </div>
      </div>
    </div>
  );
}
