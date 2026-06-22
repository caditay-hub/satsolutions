/**
 * seed-dahua-products.ts
 *
 * 1. Обновляет coverImageUrl всех категорий Dahua реальными фото с CDN Dahua.
 * 2. Создаёт продукты (серии) в каждой подкатегории.
 *
 * Запуск из папки apps/api:
 *   npx tsx src/seed-dahua-products.ts
 */

import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Brand } from "./models/Brand.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";

// ─── helpers ──────────────────────────────────────────────────────────────────
function toSlug(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => RU[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const RU: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",
  к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
  х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
};

async function setImg(slug: string, url: string) {
  const [n] = await Category.update({ coverImageUrl: url }, { where: { slug } });
  if (n) console.log(`  [img] ${slug}`);
}

async function upsertProduct(data: {
  name: string;
  slugKey: string;
  shortDescription: string;
  description?: string;
  coverImageUrl: string | null;
  characteristics?: Record<string, string>;
  categorySlug: string;
  brandId: string;
  price?: number;
  isUsd?: boolean;
  recommended?: boolean;
}) {
  const category = await Category.findOne({ where: { slug: data.categorySlug } });
  if (!category) {
    console.warn(`  [skip] category not found: ${data.categorySlug}`);
    return;
  }
  const [prod, created] = await Product.findOrCreate({
    where: { slug: data.slugKey },
    defaults: {
      id: undefined as any,
      name: data.name,
      slug: data.slugKey,
      shortDescription: data.shortDescription,
      description: data.description ?? null,
      coverImageUrl: data.coverImageUrl,
      characteristics: data.characteristics ?? null,
      categoryId: category.id,
      brandId: data.brandId,
      price: String(data.price ?? 0),
      isUsd: data.isUsd ?? true,
      recommended: data.recommended ?? false,
      published: true,
    }
  });
  if (!created) {
    prod.name = data.name;
    prod.shortDescription = data.shortDescription;
    prod.coverImageUrl = data.coverImageUrl;
    if (data.characteristics) prod.characteristics = data.characteristics;
    await prod.save();
  }
  console.log(`  ${created ? "+" : "~"} ${data.name}`);
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  initModels();
  await connectDb();

  const dahua = await Brand.findOne({ where: { slug: "dahua" } });
  if (!dahua) { console.error('Бренд "dahua" не найден'); process.exit(1); }
  const bid = dahua.id;

  // ═══════════════════════════════════════════════════════════
  // ОБНОВЛЕНИЕ ФОТО КАТЕГОРИЙ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Обновление фотографий категорий ===");

  // Топ-уровень
  await setImg("dahua-network-products",    "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260311/Network_Cameras_2.png");
  await setImg("dahua-wireless-products",   "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/3.png");
  await setImg("dahua-hdcvi-products",      "https://materialfile.dahuasecurity.com/new_uploads/image/20251014/HDCVI_Cameras_1.png");
  await setImg("dahua-thermal-products",    "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260320/22_4.png");
  await setImg("dahua-video-intercoms",     "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Android-Series.png");
  await setImg("dahua-access-control",      "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png");
  await setImg("dahua-alarms",              "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png");
  await setImg("dahua-interactive-whiteboards", "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png");
  await setImg("dahua-memory",              "https://material.dahuasecurity.com/uploads/image/20220906/Memory-Card11.png");
  await setImg("dahua-ev-charger",          "https://materialfile.dahuasecurity.com/uploads/image/20240821/D-Volt-Mini380.png");
  await setImg("dahua-transmission",        "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png");
  await setImg("dahua-software",            "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png");
  await setImg("dahua-intelligent-traffic", "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png");
  await setImg("dahua-dolynk-cloud",        "https://materialfile.dahuasecurity.com/uploads/image/20240926/imgx-spand.png");
  await setImg("dahua-display-control",     "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png");

  // Подкатегории — Сетевые продукты
  await setImg("dahua-network-cameras",     "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260311/Network_Cameras_2.png");
  await setImg("dahua-ptz-cameras",         "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260311/PTZ_Cameras.png");
  await setImg("dahua-pt-cameras",          "https://materialfile.dahuasecurity.com/new_uploads/image/20250910/PT_1.png");
  await setImg("dahua-nvr",                 "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png");
  await setImg("dahua-explosion-proof",     "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/special.png");
  await setImg("dahua-intelligent-computing","https://materialfile.dahuasecurity.com/new_uploads/image/20250519/7.png");

  // Подкатегории — Беспроводные
  await setImg("dahua-wireless-cameras",    "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/2.png");
  await setImg("dahua-wireless-nvr",        "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260512/WIFI-KIT1.png");

  // Подкатегории — HDCVI
  await setImg("dahua-hdcvi-cameras",       "https://materialfile.dahuasecurity.com/new_uploads/image/20251014/HDCVI_Cameras_1.png");
  await setImg("dahua-hdcvi-recorders",     "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/HDCVI-records.png");
  await setImg("dahua-hdcvi-accessories",   "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/HDCVI-Accessory.png");

  // Подкатегории — Тепловизионные
  await setImg("dahua-thermal-cameras",     "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260320/22_4.png");
  await setImg("dahua-thermal-measurement", "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260320/22_4.png");

  // Подкатегории — Домофоны
  await setImg("dahua-door-stations",       "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Android-Series.png");
  await setImg("dahua-indoor-monitors",     "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/2.png");

  // Подкатегории — Контроль доступа
  await setImg("dahua-access-controllers",  "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png");
  await setImg("dahua-biometric-terminals", "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Time-Attendance.png");
  await setImg("dahua-barriers-turnstiles", "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png");
  await setImg("dahua-card-readers",        "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png");

  // Подкатегории — Сигнализация
  await setImg("dahua-alarm-panels",        "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png");
  await setImg("dahua-detectors",           "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png");

  // Подкатегории — Доски
  await setImg("dahua-interactive-displays","https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png");

  // Подкатегории — Накопители
  await setImg("dahua-sd-cards",            "https://material.dahuasecurity.com/uploads/image/20220906/Memory-Card11.png");
  await setImg("dahua-surveillance-hdd",    "https://material.dahuasecurity.com/uploads/image/20220906/Memory-Card11.png");
  await setImg("dahua-ssd",                 "https://material.dahuasecurity.com/uploads/image/20220906/Internal-SSD1.png");

  // Подкатегории — Передача данных
  await setImg("dahua-poe-switches",        "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png");
  await setImg("dahua-industrial-switches", "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png");

  // EV
  await setImg("dahua-home-ev-charger",     "https://materialfile.dahuasecurity.com/uploads/image/20240821/D-Volt-Mini380.png");
  await setImg("dahua-commercial-ev-charger","https://materialfile.dahuasecurity.com/uploads/image/20240821/D-Volt-Mini380.png");

  // Транспорт
  await setImg("dahua-road-cameras",        "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png");
  await setImg("dahua-anpr",                "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png");
  await setImg("dahua-mobile-dvr",          "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png");

  // ═══════════════════════════════════════════════════════════
  // ПРОДУКТЫ — СЕТЕВЫЕ КАМЕРЫ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Сетевые камеры ===");
  const camCat = "dahua-network-cameras";

  await upsertProduct({
    name: "WizMind 8 Series — Сетевые камеры",
    slugKey: "dahua-cam-wizmind-8",
    shortDescription: "Флагманская серия IP-камер с передовым ИИ, многоканальной детекцией и максимальным качеством изображения.",
    description: "Серия WizMind 8 — вершина линейки Dahua для профессиональных инсталляций. Поддержка технологий AI Codec, SMD Plus, распознавание лиц и мониторинг периметра. Разрешение до 4K, широкий динамический диапазон WDR 120 дБ, инфракрасная подсветка до 80 м.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/8.png",
    characteristics: {
      "Разрешение": "до 8 МП (4K)",
      "Матрица": "1/2.8\" CMOS",
      "ИК-подсветка": "до 80 м",
      "WDR": "120 дБ",
      "Сжатие": "H.265+/H.265/H.264+",
      "ИИ-функции": "SMD Plus, распознавание лиц, ANPR",
      "Защита": "IP67, IK10",
      "Питание": "PoE (802.3af/at)",
    },
    categorySlug: camCat, brandId: bid, price: 0, isUsd: true, recommended: true,
  });

  await upsertProduct({
    name: "WizMind 7 Series — Сетевые камеры",
    slugKey: "dahua-cam-wizmind-7",
    shortDescription: "Высокопроизводительные IP-камеры для крупных проектов с расширенной аналитикой.",
    description: "WizMind 7 — профессиональная серия для торговых центров, транспортных узлов и периметровой охраны. Встроенный алгоритм ИИ обеспечивает точное обнаружение людей и транспортных средств, ANPR и распознавание поведения.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/7.png",
    characteristics: {
      "Разрешение": "до 8 МП",
      "Матрица": "1/2.8\" CMOS",
      "ИК-подсветка": "до 60 м",
      "WDR": "120 дБ",
      "ИИ-функции": "Детекция людей/авто, подсчёт посетителей",
      "Интерфейс": "RJ45 10/100 Base-T",
      "Защита": "IP67",
    },
    categorySlug: camCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "WizMind 5 Series — Сетевые камеры",
    slugKey: "dahua-cam-wizmind-5",
    shortDescription: "Оптимальное соотношение цены и качества: ИИ-аналитика и чёткая картинка для среднего бизнеса.",
    description: "Серия WizMind 5 обеспечивает надёжную видеоаналитику по доступной цене. AI Codec снижает битрейт до 90%, сохраняя детализацию. Подходит для офисов, магазинов и складов.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20260109/wimind_5_new.png",
    characteristics: {
      "Разрешение": "до 4 МП",
      "ИК-подсветка": "до 50 м",
      "WDR": "120 дБ",
      "ИИ-функции": "SMD, детекция периметра",
      "Сжатие": "H.265+/AI Codec",
      "Питание": "PoE (802.3af)",
    },
    categorySlug: camCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "WizSense 3 Series — Сетевые камеры",
    slugKey: "dahua-cam-wizsense-3",
    shortDescription: "Доступные IP-камеры с базовым ИИ для малого и среднего бизнеса.",
    description: "WizSense 3 — экономичная серия с технологией SMD (Smart Motion Detection), которая отфильтровывает ложные тревоги. Простая установка, стабильная работа 24/7.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20260302/WizSense_3_Series.png",
    characteristics: {
      "Разрешение": "до 4 МП",
      "ИК-подсветка": "до 30 м",
      "ИИ-функции": "SMD (детекция людей/авто)",
      "Сжатие": "H.265+/H.264+",
      "Питание": "PoE (802.3af)",
      "Защита": "IP67",
    },
    categorySlug: camCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "WizSense 2 Series — Сетевые камеры",
    slugKey: "dahua-cam-wizsense-2",
    shortDescription: "Бюджетные IP-камеры для дома и небольших объектов с надёжным изображением.",
    description: "Серия начального уровня WizSense 2 идеальна для домашнего видеонаблюдения и небольших магазинов. Быстрый монтаж благодаря технологии Easy4ip.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260319/Frame-1321322401.png",
    characteristics: {
      "Разрешение": "2 МП / 4 МП",
      "ИК-подсветка": "до 30 м",
      "Сжатие": "H.265+",
      "Питание": "PoE (802.3af)",
      "Протокол": "ONVIF, RTSP",
    },
    categorySlug: camCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "WizMind Panoramic — Панорамные камеры",
    slugKey: "dahua-cam-panoramic",
    shortDescription: "Многосенсорные панорамные камеры 180°/360° с ИИ для охвата больших площадей.",
    description: "Панорамные камеры Dahua WizMind заменяют несколько обычных камер одним устройством. Поддержка мультиплатформенного просмотра, детекция объектов по всему периметру.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260325/Frame_1321321333.png",
    characteristics: {
      "Угол обзора": "180° / 360°",
      "Разрешение": "до 32 МП (суммарно)",
      "Датчиков": "2 / 4 / 8",
      "ИИ-функции": "Обнаружение объектов по всему периметру",
      "ИК-подсветка": "до 40 м",
    },
    categorySlug: camCat, brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // PTZ-КАМЕРЫ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== PTZ-камеры ===");
  const ptzCat = "dahua-ptz-cameras";

  await upsertProduct({
    name: "X-Spans — Скоростные PTZ-камеры",
    slugKey: "dahua-ptz-xspans",
    shortDescription: "Сверхскоростные поворотные камеры с молниеносным обнаружением и сопровождением цели.",
    description: "Серия X-Spans обеспечивает скорость поворота до 500°/с и мгновенный старт слежения. Применяется для охраны аэропортов, стадионов и крупных промышленных объектов.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240926/imgx-spand.png",
    characteristics: {
      "Оптический зум": "до 42x",
      "Скорость поворота": "до 500°/с",
      "Разрешение": "4 МП / 8 МП",
      "ИК-подсветка": "до 200 м",
      "ИИ-функции": "Авто-трекинг, детекция периметра",
      "Защита": "IP66, IK10",
    },
    categorySlug: ptzCat, brandId: bid, price: 0, isUsd: true, recommended: true,
  });

  await upsertProduct({
    name: "WizMind — PTZ-камеры",
    slugKey: "dahua-ptz-wizmind",
    shortDescription: "Профессиональные поворотные камеры с мощным зумом и ИК-подсветкой дальнего действия.",
    description: "Серия WizMind PTZ для крупных объектов: аэропорты, порты, склады. Оптический зум до 40x, ИК до 500 м, поддержка ANPR и автоматического сопровождения цели.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250915/9.png",
    characteristics: {
      "Оптический зум": "до 40x",
      "ИК-подсветка": "до 500 м",
      "Разрешение": "4 МП",
      "ИИ-функции": "Auto-tracking, SMD Plus",
      "Протокол": "Pelco-D/P, ONVIF",
      "Защита": "IP66, IK10",
    },
    categorySlug: ptzCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "WizSense — PTZ-камеры",
    slugKey: "dahua-ptz-wizsense",
    shortDescription: "Надёжные поворотные камеры для среднего бизнеса с базовой ИИ-аналитикой.",
    description: "WizSense PTZ — оптимальный выбор для торговых центров, парковок и офисных комплексов. Баланс надёжности, качества изображения и стоимости.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250915/Wizsense.png",
    characteristics: {
      "Оптический зум": "до 25x",
      "ИК-подсветка": "до 100 м",
      "Разрешение": "2 МП / 4 МП",
      "ИИ-функции": "SMD, детекция людей",
      "Питание": "24 В AC / PoE+",
    },
    categorySlug: ptzCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Беспроводная — PTZ-камера",
    slugKey: "dahua-ptz-wireless",
    shortDescription: "Беспроводная PTZ-камера для объектов без кабельной инфраструктуры.",
    description: "Серия Wireless PTZ не требует прокладки кабелей. Встроенный Wi-Fi модуль, аккумулятор и солнечная панель (опционально) для автономной работы.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240926/wireless380.png",
    characteristics: {
      "Подключение": "Wi-Fi 2.4/5 ГГц",
      "Оптический зум": "до 10x",
      "Питание": "Аккумулятор / солнечная панель",
      "Разрешение": "4 МП",
      "Защита": "IP66",
    },
    categorySlug: ptzCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Специальные PTZ — Позиционирование",
    slugKey: "dahua-ptz-special",
    shortDescription: "Специализированные PTZ для энергетики, водных объектов и транспорта.",
    description: "Серия Special PTZ разработана для применения в сложных условиях: взрывозащита, экстремальные температуры, антикоррозийное покрытие. Подходит для нефтяных платформ, ГЭС и железных дорог.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png",
    characteristics: {
      "Исполнение": "Взрывозащищённое / Антивандальное",
      "Оптический зум": "до 36x",
      "Температура работы": "-40°C … +70°C",
      "Защита": "IP68, IK10",
      "Сертификаты": "ATEX, Ex",
    },
    categorySlug: ptzCat, brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // PT-КАМЕРЫ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== PT-камеры ===");
  await upsertProduct({
    name: "Dahua PT Series — Поворотно-наклонные камеры",
    slugKey: "dahua-pt-series",
    shortDescription: "Компактные PT-камеры с горизонтальным и вертикальным поворотом без оптического зума.",
    description: "PT-камеры Dahua предназначены для домашнего видеонаблюдения и небольших офисов. Дистанционное управление через приложение DMSS, двусторонняя аудиосвязь.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250910/PT_1.png",
    characteristics: {
      "Угол поворота": "360° (горизонт.) / 90° (вертик.)",
      "Разрешение": "2 МП / 4 МП",
      "Аудио": "Двусторонняя связь",
      "Подключение": "Wi-Fi / RJ45",
      "Приложение": "DMSS / IMOU",
    },
    categorySlug: "dahua-pt-cameras", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // СЕТЕВЫЕ РЕГИСТРАТОРЫ (NVR)
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== NVR ===");
  const nvrCat = "dahua-nvr";

  await upsertProduct({
    name: "WizMind NVR — Профессиональный регистратор",
    slugKey: "dahua-nvr-wizmind",
    shortDescription: "Топовые сетевые регистраторы с ИИ-аналитикой, до 128 каналов и производительностью уровня Enterprise.",
    description: "Серия WizMind NVR от Dahua — флагманская линейка для крупных систем видеонаблюдения. Поддержка до 128 IP-каналов, встроенный ИИ-движок для видеоаналитики, горячая замена HDD, резервный источник питания.",
    coverImageUrl: "https://material.dahuasecurity.com/uploads/image/20230625/NVR608RH-128-XI_1_thumb.png",
    characteristics: {
      "Каналов": "до 128",
      "Разрешение записи": "до 32 МП",
      "Сжатие": "H.265+/H.265/H.264+",
      "Отсеков HDD": "до 16",
      "Пропускная способность": "до 1024 Мбит/с",
      "ИИ-функции": "SMD Plus, ANPR, распознавание лиц",
      "RAID": "0, 1, 5, 6, 10",
    },
    categorySlug: nvrCat, brandId: bid, price: 0, isUsd: true, recommended: true,
  });

  await upsertProduct({
    name: "WizSense NVR — Средний сегмент",
    slugKey: "dahua-nvr-wizsense",
    shortDescription: "Надёжные регистраторы для средних объектов с ИИ-детекцией и поддержкой 4K.",
    description: "WizSense NVR обеспечивает запись до 32 каналов с поддержкой 4K и встроенным алгоритмом SMD. Идеален для магазинов, офисных центров и складских комплексов.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250915/wizsense_1.png",
    characteristics: {
      "Каналов": "8 / 16 / 32",
      "Разрешение записи": "до 8 МП (4K)",
      "Сжатие": "H.265+/H.264+",
      "Отсеков HDD": "до 8",
      "ИИ-функции": "SMD, детекция периметра",
      "Выход": "HDMI 4K, VGA",
    },
    categorySlug: nvrCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Lite NVR — Бюджетная серия",
    slugKey: "dahua-nvr-lite",
    shortDescription: "Компактные регистраторы начального уровня для дома и малого бизнеса.",
    description: "Lite NVR — доступные решения для домашних систем видеонаблюдения и небольших магазинов. Простая настройка, удалённый доступ через DMSS.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250915/lite_1.png",
    characteristics: {
      "Каналов": "4 / 8 / 16",
      "Разрешение записи": "до 4 МП",
      "Отсеков HDD": "1–2",
      "Сжатие": "H.265+",
      "Удалённый доступ": "DMSS, P2P",
    },
    categorySlug: nvrCat, brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "WiFi Kit — Беспроводной комплект NVR",
    slugKey: "dahua-nvr-wifi-kit",
    shortDescription: "Готовый комплект: NVR + беспроводные камеры. Быстрая установка без прокладки кабелей.",
    description: "WiFi Kit включает регистратор и набор беспроводных IP-камер. Автоматическое сопряжение, удалённый просмотр с телефона. Идеально для дома, дачи или небольшого офиса.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260512/WIFI-KIT1.png",
    characteristics: {
      "Комплект": "NVR + 4/8 IP-камер",
      "Подключение": "Wi-Fi 2.4/5 ГГц",
      "Разрешение": "4 МП",
      "Хранение": "HDD до 8 ТБ",
      "Доступ": "DMSS / P2P",
    },
    categorySlug: nvrCat, brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // HDCVI
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== HDCVI ===");

  await upsertProduct({
    name: "HDCVI Cameras — Аналоговые HD-камеры",
    slugKey: "dahua-hdcvi-cam",
    shortDescription: "HD-камеры по коаксиальному кабелю — замена аналогового видеонаблюдения без замены кабелей.",
    description: "Технология HDCVI передаёт HD-видео по стандартному коаксиальному кабелю до 500 м. Экономичная модернизация существующих аналоговых систем.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20251014/HDCVI_Cameras_1.png",
    characteristics: { "Разрешение": "до 8 МП (4K)", "Кабель": "Коаксиальный (RG59)", "Дальность": "до 500 м", "ИК-подсветка": "до 80 м", "Форм-фактор": "Буллет / Купол / Turret" },
    categorySlug: "dahua-hdcvi-cameras", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "HDCVI PTZ — Поворотные HD-камеры",
    slugKey: "dahua-hdcvi-ptz",
    shortDescription: "Поворотные HD-камеры по коаксиальному кабелю — без прокладки новых линий.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/hdcvi-ptz.png",
    characteristics: { "Оптический зум": "до 20x", "Разрешение": "2 МП / 4 МП", "Кабель": "Коаксиальный", "ИК-подсветка": "до 100 м" },
    categorySlug: "dahua-hdcvi-cameras", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "HDCVI Recorders — DVR/XVR регистраторы",
    slugKey: "dahua-hdcvi-recorder",
    shortDescription: "Мультиформатные регистраторы (XVR) для HDCVI, AHD, CVBS и IP-камер одновременно.",
    description: "XVR Dahua поддерживает одновременную работу с камерами разных стандартов: HDCVI, AHD, TVI, CVBS и IP. Гибкий переход на IP-видеонаблюдение без полной замены оборудования.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/HDCVI-records.png",
    characteristics: { "Каналов": "4 / 8 / 16 / 32", "Форматы": "HDCVI, AHD, TVI, CVBS, IP", "Разрешение": "до 4K", "HDD": "до 8", "Сжатие": "H.265+" },
    categorySlug: "dahua-hdcvi-recorders", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ТЕПЛОВИЗИОННЫЕ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Тепловизионные ===");

  await upsertProduct({
    name: "Thermal Network Camera — Тепловизионные камеры",
    slugKey: "dahua-thermal-net-cam",
    shortDescription: "Тепловизионные IP-камеры для охраны периметра и обнаружения угроз в кромешной темноте.",
    description: "Серия тепловизионных камер Dahua работает при полном отсутствии освещения, в условиях тумана и задымления. Применение: периметровая охрана, лесные пожары, промышленные объекты, медицина.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260320/22_4.png",
    characteristics: {
      "Матрица": "Некладированный болометр",
      "Разрешение тепло": "256×192 / 640×512",
      "Дальность обнаружения": "до 3000 м",
      "Температурный диапазон": "-40°C … +550°C",
      "ИИ-функции": "Детекция огня, людей, авто",
      "Защита": "IP66/67",
    },
    categorySlug: "dahua-thermal-cameras", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Thermal Measurement — Измерительные камеры",
    slugKey: "dahua-thermal-measurement",
    shortDescription: "Бесконтактное измерение температуры с тревожным сигналом при превышении порога.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260320/22_4.png",
    characteristics: { "Точность": "±2°C / ±2%", "Дальность": "до 10 м", "Применение": "Медицина, промышленность, энергетика" },
    categorySlug: "dahua-thermal-measurement", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ВИДЕОДОМОФОНЫ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Видеодомофоны ===");

  await upsertProduct({
    name: "Android Series — Вызывные панели",
    slugKey: "dahua-intercom-android-panel",
    shortDescription: "Умные вызывные панели на Android с сенсорным экраном, распознаванием лиц и QR-кодов.",
    description: "Android-серия вызывных панелей Dahua оснащена мощным процессором и широкоугольной камерой 2 МП. Поддержка открытия двери по лицу, QR-коду, карте Mifare или пин-коду. Интеграция с СКУД.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Android-Series.png",
    characteristics: {
      "ОС": "Android",
      "Экран": "Сенсорный IPS",
      "Камера": "2 МП, широкоугольная",
      "Открытие": "Лицо / QR / Карта / Код",
      "Защита": "IP65, IK08",
      "Интеграция": "СКУД, лифт, GSM",
    },
    categorySlug: "dahua-door-stations", brandId: bid, price: 0, isUsd: true, recommended: true,
  });

  await upsertProduct({
    name: "Внутренний монитор — видеодомофон",
    slugKey: "dahua-indoor-monitor",
    shortDescription: "Цветные видеомониторы для квартир и офисов с поддержкой нескольких вызывных панелей.",
    description: "Внутренние мониторы Dahua с экраном 7–10 дюймов, цветным изображением и возможностью видеозаписи. Поддержка нескольких квартир, звонки на смартфон через Dahua iVMS.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/2.png",
    characteristics: {
      "Экран": "7\" / 10\" IPS",
      "Разрешение экрана": "1024×600",
      "Запись": "Фото / видео",
      "Мощность": "PoE / 12В DC",
      "Приложение": "iVMS-4200 / DMSS",
    },
    categorySlug: "dahua-indoor-monitors", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // КОНТРОЛЬ ДОСТУПА
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Контроль доступа ===");

  await upsertProduct({
    name: "Access Controller — Контроллер доступа",
    slugKey: "dahua-access-ctrl",
    shortDescription: "Сетевые контроллеры СКУД на 1–8 дверей с поддержкой карт, биометрии и шлагбаумов.",
    description: "Контроллеры Dahua управляют доступом в здание через карты Mifare, биометрические данные или PIN-код. Поддержка до 100 000 пользователей, журнал до 500 000 событий.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png",
    characteristics: {
      "Дверей": "1 / 2 / 4 / 8",
      "Считывателей": "RS485 / Wiegand",
      "Карточек": "до 100 000",
      "Событий": "до 500 000",
      "Интерфейс": "TCP/IP, RS485",
      "Питание": "12В DC / PoE",
    },
    categorySlug: "dahua-access-controllers", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Биометрический терминал — Face & Fingerprint",
    slugKey: "dahua-biometric-terminal",
    shortDescription: "Терминал контроля доступа с распознаванием лица, отпечатка пальца и карты.",
    description: "Терминал Dahua с двойной камерой для распознавания лица в масках, точность 99,9%. Учёт рабочего времени, интеграция с 1С и SAP. Работает автономно без сети.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Time-Attendance.png",
    characteristics: {
      "Лица": "до 50 000",
      "Отпечатки": "до 5 000",
      "Карты": "до 100 000",
      "Экран": "4.3\" TFT сенсор",
      "Распознавание": "< 0.3 сек",
      "В масках": "Да",
    },
    categorySlug: "dahua-biometric-terminals", brandId: bid, price: 0, isUsd: true, recommended: true,
  });

  await upsertProduct({
    name: "Шлагбаум — Автоматический барьер",
    slugKey: "dahua-barrier-gate",
    shortDescription: "Автоматические шлагбаумы и парковочные барьеры с ANPR для управления въездом.",
    description: "Шлагбаумы Dahua оснащены встроенной камерой ANPR для автоматического распознавания номерных знаков. Интеграция с парковочными системами и СКУД.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png",
    characteristics: {
      "Скорость": "1.5–3 сек",
      "Длина стрелы": "до 6 м",
      "ANPR": "Встроенная камера",
      "Интеграция": "СКУД, парковочные системы",
      "Защита": "IP54",
    },
    categorySlug: "dahua-barriers-turnstiles", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ОХРАННАЯ СИГНАЛИЗАЦИЯ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Охранная сигнализация ===");

  await upsertProduct({
    name: "Wireless Alarm Hub — Центральная панель",
    slugKey: "dahua-alarm-hub",
    shortDescription: "Беспроводная охранная панель с поддержкой до 64 зон и дистанционным управлением.",
    description: "Интеллектуальная охранная панель Dahua поддерживает до 64 беспроводных зон, управление через приложение DMSS. Встроенный GSM/4G модуль для оповещения при отключении интернета.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png",
    characteristics: {
      "Зон": "до 64",
      "Пользователей": "до 50",
      "Связь": "Wi-Fi / 4G / Ethernet",
      "Оповещение": "Приложение, SMS, звонок",
      "Резерв питания": "72 часа",
    },
    categorySlug: "dahua-alarm-panels", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "PIR & МВ детектор — Датчик движения",
    slugKey: "dahua-pir-detector",
    shortDescription: "Датчики PIR Dahua с защитой от ложных тревог и иммунитетом к домашним животным.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png",
    characteristics: { "Дальность": "10–12 м", "Угол": "90°–110°", "Связь": "868 МГц", "Питание": "2×AA", "Температура": "-10°C … +55°C" },
    categorySlug: "dahua-detectors", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ИНТЕРАКТИВНЫЕ ДОСКИ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Интерактивные доски ===");

  await upsertProduct({
    name: "Education Series — Интерактивная доска",
    slugKey: "dahua-whiteboard-edu",
    shortDescription: "Интерактивные дисплеи для образования и совещаний с 4K-экраном и Android OS.",
    description: "Серия Education — многофункциональные интерактивные дисплеи на базе Android с 4K-разрешением. Поддержка одновременного письма до 20 точками касания, встроенный OPS-слот для ПК.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Размер": "65\" / 75\" / 86\" / 98\"",
      "Разрешение": "3840×2160 (4K)",
      "Касания": "до 20 одновременных",
      "ОС": "Android 11",
      "Интерфейс": "HDMI, USB-C, Wi-Fi, BT",
      "Камера": "встроенная 8 МП",
    },
    categorySlug: "dahua-interactive-displays", brandId: bid, price: 0, isUsd: true, recommended: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ПЕРЕДАЧА ДАННЫХ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Передача данных ===");

  await upsertProduct({
    name: "PoE Switch — Коммутатор с питанием по кабелю",
    slugKey: "dahua-poe-switch",
    shortDescription: "Неуправляемые и управляемые PoE-коммутаторы для питания IP-камер без отдельного блока питания.",
    description: "PoE-коммутаторы Dahua обеспечивают одновременное питание и передачу данных для IP-камер, точек доступа Wi-Fi и VoIP-телефонов по одному кабелю Cat5e/Cat6.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Портов PoE": "4 / 8 / 16 / 24 / 48",
      "Мощность PoE": "до 802.3at (30 Вт), 802.3bt (90 Вт)",
      "Суммарная мощность": "до 500 Вт",
      "Скорость": "10/100/1000 Мбит/с",
      "Управление": "Неуправляемый / Web / SNMP",
    },
    categorySlug: "dahua-poe-switches", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Industrial Switch — Промышленный коммутатор",
    slugKey: "dahua-industrial-switch",
    shortDescription: "Надёжные коммутаторы для промышленных объектов, транспорта и улицы.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: { "Температура": "-40°C … +75°C", "Питание": "9–48В DC / Двойное", "Защита": "IP40", "MTBF": "> 200 000 ч", "Din-рейка": "Да" },
    categorySlug: "dahua-industrial-switches", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // НАКОПИТЕЛИ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Накопители ===");

  await upsertProduct({
    name: "MicroSD — SD-карты для видеонаблюдения",
    slugKey: "dahua-sd-card",
    shortDescription: "Специализированные microSD-карты оптимизированы для непрерывной записи 24/7.",
    description: "SD-карты серии Dahua P600 разработаны для IP-камер: выдерживают до 40 000 циклов перезаписи, скорость записи 90 МБ/с, температура работы -25°C … +85°C.",
    coverImageUrl: "https://material.dahuasecurity.com/uploads/image/20220906/Memory-Card11.png",
    characteristics: {
      "Ёмкость": "64 ГБ / 128 ГБ / 256 ГБ",
      "Запись": "до 90 МБ/с",
      "Считывание": "до 100 МБ/с",
      "Ресурс": "40 000 циклов",
      "Температура": "-25°C … +85°C",
      "Класс": "UHS-I, Class 10",
    },
    categorySlug: "dahua-sd-cards", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Surveillance HDD — Жёсткие диски",
    slugKey: "dahua-hdd",
    shortDescription: "Жёсткие диски специально для видеонаблюдения: тихие, надёжные, рассчитаны на 24/7.",
    coverImageUrl: "https://material.dahuasecurity.com/uploads/image/20220906/Memory-Card11.png",
    characteristics: { "Объём": "1 / 2 / 4 / 6 / 8 / 10 / 12 ТБ", "Скорость": "до 256 МБ/с", "Режим": "24/7 непрерывная запись", "Скорость вращения": "5400 RPM", "MTBF": "1 000 000 часов" },
    categorySlug: "dahua-surveillance-hdd", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Internal SSD — Твёрдотельные накопители",
    slugKey: "dahua-ssd-internal",
    shortDescription: "Быстрые SSD для видеорегистраторов с интеллектуальным хранением данных.",
    coverImageUrl: "https://material.dahuasecurity.com/uploads/image/20220906/Internal-SSD1.png",
    characteristics: { "Объём": "256 ГБ / 512 ГБ / 1 ТБ / 2 ТБ", "Запись": "до 500 МБ/с", "Интерфейс": "SATA III", "Режим": "24/7" },
    categorySlug: "dahua-ssd", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ЗАРЯДНЫЕ СТАНЦИИ EV
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== EV Charger ===");

  await upsertProduct({
    name: "D-Volt Mini — Бытовая зарядная станция",
    slugKey: "dahua-ev-home",
    shortDescription: "Компактная домашняя зарядная станция для электромобилей, мощность 7–22 кВт.",
    description: "D-Volt Mini — интеллектуальная зарядная станция для дома. Управление через приложение, ограничение тока, таймер зарядки, учёт потреблённой энергии. Сертифицирована CE.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240821/D-Volt-Mini380.png",
    characteristics: {
      "Мощность": "7 кВт / 11 кВт / 22 кВт",
      "Фазы": "1-фазная / 3-фазная",
      "Разъём": "Type 2 (IEC 62196)",
      "Защита": "IP65",
      "Управление": "Приложение / RFID",
      "Сертификаты": "CE, TÜV",
    },
    categorySlug: "dahua-home-ev-charger", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "D-Volt Commercial — Коммерческая зарядная станция",
    slugKey: "dahua-ev-commercial",
    shortDescription: "Мощные многопортовые зарядные станции с удалённым управлением и биллингом.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240821/D-Volt-Mini380.png",
    characteristics: { "Мощность": "22 кВт / 60 кВт / 120 кВт", "Розеток": "2", "Оплата": "RFID / QR / Приложение", "Экран": "7\" сенсорный", "Защита": "IP54" },
    categorySlug: "dahua-commercial-ev-charger", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // ТРАНСПОРТ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Транспорт ===");

  await upsertProduct({
    name: "ANPR Camera — Распознавание номеров",
    slugKey: "dahua-anpr-camera",
    shortDescription: "Специализированные камеры распознавания автомобильных номерных знаков.",
    description: "ANPR-камеры Dahua обеспечивают точность распознавания >99% при скорости движения до 250 км/ч. Поддержка белых/чёрных списков, интеграция с парковочными и пропускными системами.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png",
    characteristics: { "Точность": "> 99%", "Скорость авто": "до 250 км/ч", "Дальность": "до 30 м", "Списки": "Белый / Чёрный", "ПО": "DSS / SmartPSS" },
    categorySlug: "dahua-anpr", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Mobile DVR — Регистратор для транспорта",
    slugKey: "dahua-mobile-dvr",
    shortDescription: "Транспортные DVR с GPS-треком, G-сенсором и дистанционным мониторингом.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png",
    characteristics: { "Каналов": "4 / 8", "GPS": "Встроенный", "4G": "Опционально", "Вибрация": "MIL-STD-810G", "Температура": "-40°C … +70°C", "Накопитель": "SSD / microSD" },
    categorySlug: "dahua-mobile-dvr", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  // БЕСПРОВОДНЫЕ КАМЕРЫ
  // ═══════════════════════════════════════════════════════════
  console.log("\n=== Беспроводные камеры ===");

  await upsertProduct({
    name: "Indoor Wireless Camera — Внутренняя Wi-Fi",
    slugKey: "dahua-wifi-indoor",
    shortDescription: "Умные домашние камеры Dahua с ИИ и уведомлениями на смартфон.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/2.png",
    characteristics: { "Разрешение": "2 МП / 4 МП", "Wi-Fi": "2.4/5 ГГц", "Аудио": "Двусторонняя", "Хранение": "microSD / Cloud", "Приложение": "IMOU / DMSS" },
    categorySlug: "dahua-wireless-cameras", brandId: bid, price: 0, isUsd: true,
  });

  await upsertProduct({
    name: "Outdoor Wireless Camera — Уличная Wi-Fi",
    slugKey: "dahua-wifi-outdoor",
    shortDescription: "Уличные Wi-Fi камеры с полноцветным ночным видением — без ИК, только свет.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/3.png",
    characteristics: { "Разрешение": "4 МП", "Wi-Fi": "2.4/5 ГГц", "Ночное видение": "Цветное (Full Color)", "Прожектор": "Встроенный LED", "Защита": "IP67" },
    categorySlug: "dahua-wireless-cameras", brandId: bid, price: 0, isUsd: true,
  });

  // ═══════════════════════════════════════════════════════════
  console.log("\n✅ Готово! Все продукты и фото категорий обновлены.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error("Ошибка:", e); process.exit(1); });
