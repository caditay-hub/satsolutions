import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getBrands, getProducts } from "@/lib/api";
import { BrandCatalog } from "@/components/BrandCatalog";
import { resolveImageUrl } from "@/lib/image";
import { hreflangAlternates } from "@/lib/hreflang";

// ─── supported brand slugs ────────────────────────────────────────────────────
const BRAND_CONFIG: Record<string, { displayName: string; description: string }> = {
  dahua: {
    displayName: "Dahua Technology",
    description:
      "Dahua Technology — один из ведущих мировых производителей систем видеонаблюдения, контроля доступа, охранной сигнализации и интеллектуальных решений безопасности.",
  },
  hikvision: {
    displayName: "Hikvision",
    description:
      "Hikvision — мировой лидер в области инновационных продуктов и решений безопасности: IP-камеры, тепловизоры, системы контроля доступа и видеоаналитики.",
  },
  rubezh: {
    displayName: "Рубеж",
    description:
      "Рубеж — российский производитель систем пожарной и охранной сигнализации, контроля доступа, оповещения и автоматики. Серия Рубеж Р3 — адресная интеллектуальная система безопасности.",
  },
  bolid: {
    displayName: "Болид",
    description:
      "Болид — российский производитель интегрированных систем охраны ИСО Орион: пожарная и охранная сигнализация, контроль доступа, видеонаблюдение, оповещение.",
  },
  avigilon: {
    displayName: "Avigilon",
    description:
      "Avigilon (Motorola Solutions) — премиальные IP-камеры высокого разрешения с встроенной ИИ-видеоаналитикой и платформой Unity / Alta для облачного и локального управления.",
  },
  hilook: {
    displayName: "HiLook",
    description:
      "HiLook by Hikvision — доступная линейка систем видеонаблюдения: IP- и HD-камеры, видеорегистраторы и PoE-коммутаторы с фирменным качеством Hikvision.",
  },
  tplink: {
    displayName: "TP-Link",
    description:
      "TP-Link — один из крупнейших мировых производителей сетевого оборудования: коммутаторы, маршрутизаторы, точки доступа Omada и решения для бизнеса.",
  },
  tapo: {
    displayName: "Tapo",
    description:
      "Tapo — бренд умных устройств TP-Link: Wi-Fi камеры для дома и бизнеса, видеонаблюдение и аксессуары умного дома.",
  },
  mercusys: {
    displayName: "Mercusys",
    description:
      "Mercusys — доступное сетевое оборудование от группы TP-Link: Mesh-системы, маршрутизаторы и коммутаторы для дома и офиса.",
  },
  witek: {
    displayName: "Wi-Tek",
    description:
      "Wi-Tek — сетевое оборудование для систем видеонаблюдения и связи: PoE-коммутаторы, маршрутизаторы и беспроводные мосты.",
  },
  kanihad: {
    displayName: "KANIHAD",
    description:
      "KANIHAD — оборудование для контроля доступа и автоматизации проезда: турникеты, шлагбаумы и коммутаторы.",
  },
  zkteco: {
    displayName: "ZKTeco",
    description:
      "ZKTeco — мировой производитель биометрических систем безопасности: терминалы распознавания лиц и отпечатков, СКУД, турникеты и камеры.",
  },
  ubiquiti: {
    displayName: "Ubiquiti",
    description:
      "Ubiquiti — профессиональные сетевые решения UniFi: точки доступа Wi-Fi, коммутаторы и маршрутизаторы операторского класса.",
  },
  mikrotik: {
    displayName: "MikroTik",
    description:
      "MikroTik — маршрутизаторы, коммутаторы и беспроводные системы на RouterOS для провайдеров, офисов и сложных сетей.",
  },
  ruijie: {
    displayName: "Ruijie",
    description:
      "Ruijie Networks — облачные сети Reyee: маршрутизаторы, управляемые коммутаторы, точки доступа Wi-Fi 6/7 и радиомосты для бизнеса и провайдеров.",
  },
  prochee: {
    displayName: "Прочее оборудование",
    description:
      "Комплектующие и сопутствующее оборудование: кронштейны и монтажные аксессуары, кабель, оптика, жёсткие диски, оповещение и пожарная безопасность.",
  },
  pixietech: {
    displayName: "Pixietech",
    description:
      "Pixietech — сетевая и телеком-инфраструктура: коммутаторы, SFP-модули, оптика и СКС, телекоммуникационные шкафы, ИБП, IP-телефония, серверное оборудование и инструменты.",
  },
  snr: {
    displayName: "SNR",
    description:
      "SNR — телеком и сетевое оборудование: управляемые коммутаторы, оптические кроссы и боксы, медиаконвертеры, CWDM-мультиплексоры, SFP-модули и источники питания.",
  },
  tuya: {
    displayName: "Tuya",
    description:
      "Tuya — устройства умного дома с Wi-Fi: камеры, датчики, умные розетки и выключатели, замки, термостаты и системы сигнализации.",
  },
  cambium: {
    displayName: "Cambium Networks",
    description:
      "Cambium Networks — операторские беспроводные решения: радиомосты ePMP/PMP, точки доступа и оборудование для сетей доступа.",
  },
  cisco: {
    displayName: "Cisco",
    description:
      "Cisco — мировой лидер сетевого оборудования: коммутаторы, маршрутизаторы и IP-телефония корпоративного класса.",
  },
  vertiv: {
    displayName: "Vertiv",
    description:
      "Vertiv — источники бесперебойного питания (ИБП), системы электропитания и охлаждения для ЦОД и телеком-инфраструктуры.",
  },
  teltonika: {
    displayName: "Teltonika",
    description:
      "Teltonika Networks — промышленные сотовые маршрутизаторы и шлюзы (RUT/TRB), IoT и M2M решения для надёжной связи.",
  },
  fanvil: {
    displayName: "Fanvil",
    description:
      "Fanvil — IP-телефоны, SIP-домофоны и интеркомы для офисов, гостиниц и систем связи.",
  },
  eltex: {
    displayName: "Eltex",
    description:
      "Eltex — производитель телеком-оборудования: коммутаторы, маршрутизаторы, GPON/GEPON и абонентские устройства.",
  },
  finen: {
    displayName: "FINEN",
    description:
      "FINEN — телекоммуникационные и серверные шкафы (напольные и настенные) и аксессуары для монтажа оборудования.",
  },
  siklu: {
    displayName: "Siklu",
    description:
      "Siklu — радиорелейные системы миллиметрового диапазона (E-band/V-band) для высокоскоростных беспроводных каналов.",
  },
  "v-sol": {
    displayName: "V-SOL",
    description:
      "V-SOL — оборудование оптического доступа GPON/EPON: станционные терминалы OLT и абонентские ONU/ONT.",
  },
  huawei: {
    displayName: "Huawei",
    description:
      "Huawei — корпоративные коммутаторы, маршрутизаторы и сетевые решения операторского класса.",
  },
  bdcom: {
    displayName: "BDCOM",
    description:
      "BDCOM — оборудование широкополосного доступа: станционные терминалы OLT GPON/EPON и абонентские ONU.",
  },
  "c-data": {
    displayName: "C-Data",
    description:
      "C-Data — решения оптического доступа GPON/EPON: терминалы OLT и абонентские устройства ONU/ONT.",
  },
  h3c: {
    displayName: "H3C",
    description:
      "H3C — корпоративные сети: управляемые коммутаторы, маршрутизаторы и решения для ЦОД.",
  },
  apc: {
    displayName: "APC",
    description:
      "APC — источники бесперебойного питания (ИБП), сетевые фильтры и решения электропитания для ИТ-оборудования.",
  },
};

// ─── metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>;
}): Promise<Metadata> {
  const { locale, brand } = await params;
  const cfg = BRAND_CONFIG[brand.toLowerCase()];
  if (!cfg) return { title: "Каталог продукции" };
  const title = `${cfg.displayName} — Каталог продукции`;
  return {
    title,
    description: cfg.description,
    alternates: hreflangAlternates(`/catalog/${brand.toLowerCase()}`, locale),
    openGraph: { title, description: cfg.description },
  };
}

// ─── page ─────────────────────────────────────────────────────────────────────
export default async function BrandCatalogPage({
  params,
  searchParams,
}: {
  params: Promise<{ brand: string }>;
  searchParams: Promise<{ cat?: string }>;
}) {
  const [{ brand }, sp] = await Promise.all([params, searchParams]);
  const brandSlug = brand.toLowerCase();
  const cfg = BRAND_CONFIG[brandSlug];
  if (!cfg) notFound();

  const [{ categories }, { brands }, productsPage] = await Promise.all([
    getCategories({ brand: brandSlug }).catch(() => ({ categories: [] })),
    getBrands().catch(() => ({ brands: [] })),
    getProducts(1, 2000, { brand: brandSlug }).catch(() => ({ items: [] as any[] })),
  ]);

  // Map categoryId -> first product image of THIS brand (so covers stay on-brand)
  const brandCoverByCategory: Record<string, string> = {};
  for (const p of (productsPage.items ?? []) as any[]) {
    if (p.categoryId && p.coverImageUrl && !brandCoverByCategory[p.categoryId]) {
      brandCoverByCategory[p.categoryId] = p.coverImageUrl;
    }
  }

  const brandInfo = brands.find((b) => b.slug.toLowerCase() === brandSlug);
  const logoUrl = brandInfo?.logoImageUrl ? resolveImageUrl(brandInfo.logoImageUrl) : null;

  // Популярность = насыщенность категории товарами. Считаем товары по всему поддереву
  // (товар → его топ-предок) и сортируем топ-категории по убыванию количества, а не по алфавиту.
  const catById = new Map(categories.map((c) => [c.id, c] as const));
  const topAncestorId = (catId?: string | null): string | null => {
    let c = catId ? catById.get(catId) : undefined;
    let guard = 0;
    while (c && c.parentId && guard++ < 12) c = catById.get(c.parentId);
    return c?.id ?? null;
  };
  const countByTop: Record<string, number> = {};
  for (const p of (productsPage.items ?? []) as any[]) {
    const tid = topAncestorId(p.categoryId);
    if (tid) countByTop[tid] = (countByTop[tid] ?? 0) + 1;
  }
  const topCategories = categories
    .filter((c) => !c.parentId)
    .sort((a, b) => {
      const d = (countByTop[b.id] ?? 0) - (countByTop[a.id] ?? 0);
      return d !== 0 ? d : a.name.localeCompare(b.name, "ru");
    });

  // Начальная активная категория из URL (?cat=slug); без него — "Все товары"
  const initialCat = sp.cat
    ? (categories.find((c) => c.slug === sp.cat) ?? null)
    : null;

  return (
    <BrandCatalog
      topCategories={topCategories}
      allCategories={categories}
      brandName={cfg.displayName}
      brandDescription={cfg.description}
      brandSlug={brandSlug}
      logoUrl={logoUrl}
      initialCategoryId={initialCat?.id ?? null}
      brandCoverByCategory={brandCoverByCategory}
    />
  );
}
