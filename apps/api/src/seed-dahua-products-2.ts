/**
 * seed-dahua-products-2.ts
 * Заполняет оставшиеся 30 листовых категорий Dahua без продуктов.
 * Запуск: cd apps/api && npx tsx src/seed-dahua-products-2.ts
 */

import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Brand } from "./models/Brand.js";
import { Category } from "./models/Category.js";
import { Product } from "./models/Product.js";

async function upsert(data: {
  name: string;
  slugKey: string;
  shortDescription: string;
  description?: string;
  coverImageUrl: string | null;
  characteristics?: Record<string, string>;
  categorySlug: string;
  brandId: string;
  recommended?: boolean;
}) {
  const category = await Category.findOne({ where: { slug: data.categorySlug } });
  if (!category) { console.warn(`  [skip] не найдена: ${data.categorySlug}`); return; }
  const [, created] = await Product.findOrCreate({
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
      price: "0",
      isUsd: true,
      recommended: data.recommended ?? false,
      published: true,
    },
  });
  console.log(`  ${created ? "+" : "~"} ${data.name}`);
}

async function main() {
  initModels();
  await connectDb();

  const dahua = await Brand.findOne({ where: { slug: "dahua" } });
  if (!dahua) { console.error('Бренд "dahua" не найден'); process.exit(1); }
  const bid = dahua.id;

  // ══════════════════════════════════════════════════════════
  // ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Программное обеспечение ===");

  await upsert({
    name: "DMSS — Мобильное приложение",
    slugKey: "dahua-sw-dmss",
    shortDescription: "Бесплатное мобильное приложение для удалённого просмотра камер и управления системой.",
    description: "DMSS — официальное приложение Dahua для iOS и Android. Поддерживает до 64 устройств: NVR, DVR, IP-камеры. Функции: просмотр в реальном времени, воспроизведение архива, push-уведомления о тревогах, двусторонняя аудиосвязь, E-PTZ.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Платформа": "iOS 12+ / Android 8+",
      "Устройств": "до 64",
      "Функции": "Просмотр, архив, тревоги, аудио",
      "P2P": "Да (Easy4IP)",
      "Стоимость": "Бесплатно",
    },
    categorySlug: "dahua-dmss", brandId: bid,
  });

  await upsert({
    name: "SmartPSS — Клиентский софт",
    slugKey: "dahua-sw-smartpss",
    shortDescription: "Бесплатное ПО для управления видеонаблюдением на ПК: до 256 каналов.",
    description: "SmartPSS — настольный клиент для мониторинга и управления системами Dahua на Windows/macOS. Поддерживает до 256 каналов, E-map, видеостену, аналитику и учёт рабочего времени.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Платформа": "Windows 7–11 / macOS",
      "Каналов": "до 256",
      "Функции": "E-Map, видеостена, аналитика, УРВ",
      "Стоимость": "Бесплатно",
    },
    categorySlug: "dahua-smartpss", brandId: bid,
  });

  await upsert({
    name: "DSS Express — Сервер управления видео",
    slugKey: "dahua-sw-dss-express",
    shortDescription: "Лёгкая платформа VMS для малого и среднего бизнеса до 64 устройств.",
    description: "DSS Express — серверное ПО для централизованного управления камерами и NVR Dahua. Подходит для магазинов, офисов, школ. Включает видеозапись, аналитику, контроль доступа и домофонию.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Устройств": "до 64",
      "Платформа": "Windows Server / Windows 10+",
      "Модули": "Видео, СКУД, домофон, аналитика",
      "Лицензия": "Бесплатно (базовая)",
    },
    categorySlug: "dahua-dss-express", brandId: bid,
  });

  await upsert({
    name: "DSS Pro — Корпоративная VMS платформа",
    slugKey: "dahua-sw-dss-pro",
    shortDescription: "Масштабируемая Enterprise-платформа управления безопасностью для крупных объектов.",
    description: "DSS Pro — профессиональная платформа для интеграции видеонаблюдения, СКУД, охранной сигнализации, домофонии и аналитики в единую систему. Поддержка тысяч каналов, резервирование N+1, открытый API.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Каналов": "неограниченно (лицензируется)",
      "Модули": "Видео, СКУД, сигнализация, LPR, тепловизия",
      "Резервирование": "N+1 Hot-standby",
      "API": "Открытый SDK/API",
      "Платформа": "Windows Server / Linux",
    },
    categorySlug: "dahua-dss-pro", brandId: bid, recommended: true,
  });

  // ══════════════════════════════════════════════════════════
  // HDCVI АКСЕССУАРЫ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== HDCVI аксессуары ===");

  await upsert({
    name: "HDCVI Accessories — Аксессуары",
    slugKey: "dahua-hdcvi-acc",
    shortDescription: "Блоки питания, балуны, кронштейны и кабельные комплекты для HDCVI систем.",
    description: "Широкий ассортимент аксессуаров для монтажа и обслуживания HDCVI систем Dahua: центральные блоки питания на 4/8/16 камер, HD-балуны для передачи видео по витой паре, угловые и потолочные кронштейны.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/HDCVI-Accessory.png",
    characteristics: {
      "Тип": "Блоки питания, балуны, кронштейны",
      "Питание камер": "12В DC, централизованное",
      "Балун": "HD по витой паре до 300 м",
      "Совместимость": "Все HDCVI камеры Dahua",
    },
    categorySlug: "dahua-hdcvi-accessories", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ДИСПЛЕИ И СИСТЕМЫ УПРАВЛЕНИЯ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Дисплеи и системы управления ===");

  await upsert({
    name: "LED Display — Светодиодные экраны",
    slugKey: "dahua-led-display",
    shortDescription: "Профессиональные LED-экраны для ситуационных центров, командных комнат и рекламы.",
    description: "LED-дисплеи Dahua для видеостен и цифровых вывесок с шагом пикселя 1.2–2.5 мм. Яркость до 1200 нит, HDR, поддержка контент-управления через DSS Pro.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Шаг пикселя": "1.2 / 1.5 / 1.8 / 2.5 мм",
      "Яркость": "до 1200 нит",
      "HDR": "Да",
      "Управление": "DSS Pro / CMS",
      "Применение": "Ситуационные центры, рекламные стенды",
    },
    categorySlug: "dahua-led-displays", brandId: bid,
  });

  await upsert({
    name: "Video Wall — Видеостена",
    slugKey: "dahua-video-wall",
    shortDescription: "Системы видеостен из LCD и LED панелей для диспетчерских и командных центров.",
    description: "Видеостены Dahua на базе узкобезрамочных LCD панелей (зазор 1.7 мм) или LED-модулей. Поддержка до 64 входных источников, управление декодерами, интеграция с VMS.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Панели": "46\" / 49\" / 55\" LCD",
      "Зазор": "1.7 мм",
      "Яркость": "500 нит",
      "Матрица": "до 8×8",
      "Управление": "Декодеры + контроллер стены",
    },
    categorySlug: "dahua-video-walls", brandId: bid,
  });

  await upsert({
    name: "Decoder — Декодер видеостены",
    slugKey: "dahua-decoder",
    shortDescription: "Сетевые декодеры для вывода IP-видео на мониторы и видеостены в реальном времени.",
    description: "Декодеры Dahua декодируют потоки с NVR, IP-камер и VMS на видеостены. До 64 каналов на одно устройство, поддержка 4K, H.265+, электронная карта E-Map.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Каналов декодирования": "до 64",
      "Разрешение выхода": "до 4K",
      "Выходы": "HDMI / VGA / BNC",
      "Сжатие": "H.265+ / H.264+",
      "Интеграция": "DSS Pro, SmartPSS",
    },
    categorySlug: "dahua-decoders", brandId: bid,
  });

  await upsert({
    name: "Surveillance Monitor — Профессиональный монитор",
    slugKey: "dahua-surv-monitor",
    shortDescription: "Профессиональные мониторы для круглосуточного видеонаблюдения с IPS-панелью.",
    description: "Мониторы Dahua разработаны для непрерывной работы 24/7 в диспетчерских и охранных постах. IPS-матрица, яркость 300 нит, HDMI + VGA, встроенные динамики.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Размер": "21.5\" / 24\" / 27\" / 32\"",
      "Матрица": "IPS",
      "Разрешение": "1920×1080 / 3840×2160",
      "Яркость": "300 нит",
      "Режим": "24/7",
      "Входы": "HDMI, VGA, BNC",
    },
    categorySlug: "dahua-surveillance-monitors", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ПЕРЕДАЧА ДАННЫХ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Передача данных (доп.) ===");

  await upsert({
    name: "SFP Transceiver — Оптический трансивер",
    slugKey: "dahua-sfp-transceiver",
    shortDescription: "SFP и SFP+ модули для коммутаторов Dahua: одномодовый и многомодовый оптоволоконный канал.",
    description: "Трансиверы Dahua для коммутаторов серий Pro и Commercial. Дальность передачи от 550 м (многомодовый OM3) до 80 км (одномодовый OS2). Скорость 1/10 Гбит/с.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Скорость": "1G / 10G",
      "Одномодовый": "до 80 км (OS2)",
      "Многомодовый": "до 550 м (OM3)",
      "Разъём": "LC Duplex",
      "Совместимость": "Коммутаторы Dahua Pro/Commercial",
    },
    categorySlug: "dahua-sfp-transceivers", brandId: bid,
  });

  await upsert({
    name: "Wireless Bridge — Беспроводной мост",
    slugKey: "dahua-wireless-bridge",
    shortDescription: "Беспроводные мосты 5 ГГц для передачи видеопотока между зданиями без прокладки кабеля.",
    description: "Мосты Dahua передают HD-видео на расстояние до 5 км по беспроводному каналу 5 ГГц. Пропускная способность до 867 Мбит/с, интеграция с PoE-коммутаторами, IP67.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Дальность": "до 5 км",
      "Скорость": "до 867 Мбит/с (5 ГГц)",
      "Питание": "PoE (802.3at)",
      "Защита": "IP67",
      "Применение": "Межздания, стройплощадки",
    },
    categorySlug: "dahua-wireless-bridges", brandId: bid,
  });

  await upsert({
    name: "Media Converter — Медиаконвертер",
    slugKey: "dahua-media-converter",
    shortDescription: "Конвертеры для передачи Ethernet по оптоволокну до 20 км — без потери пакетов.",
    description: "Медиаконвертеры Dahua обеспечивают надёжную передачу сетевого сигнала по одномодовому или многомодовому оптоволокну. DIN-рейка, питание 12В DC или 220В AC.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/Web_1920_cctv_products_img_3.png",
    characteristics: {
      "Скорость": "10/100 Мбит/с",
      "Дальность": "до 20 км (одномодовый)",
      "Монтаж": "DIN-рейка / настольный",
      "Питание": "12В DC / 48В PoE",
    },
    categorySlug: "dahua-media-converters", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ИНТЕРАКТИВНЫЕ ДОСКИ — АКСЕССУАРЫ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Аксессуары для досок ===");

  await upsert({
    name: "Whiteboard Accessories — Аксессуары для досок",
    slugKey: "dahua-wb-accessories",
    shortDescription: "Кронштейны, стилусы, OPS-модули и кабели для интерактивных досок Dahua.",
    description: "Аксессуары Dahua для интерактивных дисплеев: регулируемые напольные стойки, настенные кронштейны с наклоном, сменные стилусы с ластиком, OPS-модули (mini PC) с Windows 11.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Стойки": "Напольные регулируемые (65–98\")",
      "OPS-модуль": "Intel Core i5/i7, Windows 11",
      "Стилус": "Пассивный / активный",
      "Кронштейн": "Настенный VESA 600×400",
    },
    categorySlug: "dahua-whiteboard-accessories", brandId: bid,
  });

  await upsert({
    name: "Mobile Stand — Мобильная стойка для дисплея",
    slugKey: "dahua-mobile-stand",
    shortDescription: "Мобильные напольные стойки с колёсами для интерактивных дисплеев 65–98 дюймов.",
    description: "Мобильные стойки Dahua позволяют перемещать интерактивный дисплей между аудиториями. Регулировка высоты, стальная рама, колёса с тормозом, нагрузка до 120 кг.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Education_Series.png",
    characteristics: {
      "Совместимость": "65\" / 75\" / 86\" / 98\"",
      "VESA": "до 800×600",
      "Нагрузка": "до 120 кг",
      "Колёса": "4 шт. с тормозом",
      "Высота": "регулируемая",
    },
    categorySlug: "dahua-mobile-stands", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // БЕСПРОВОДНЫЕ — АКСЕССУАРЫ И РЕГИСТРАТОРЫ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Беспроводные аксессуары и NVR ===");

  await upsert({
    name: "Wireless Accessories — Аксессуары",
    slugKey: "dahua-wifi-accessories",
    shortDescription: "Кронштейны, удлинители антенн и блоки питания для беспроводных камер Dahua.",
    description: "Аксессуары для монтажа беспроводных камер Dahua: потолочные и угловые кронштейны, удлинительные антенны для улучшения Wi-Fi покрытия, адаптеры питания 12В.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250922/3.png",
    characteristics: {
      "Тип": "Кронштейны, антенны, адаптеры",
      "Антенна": "Удлинитель 3 dBi / 5 dBi",
      "Совместимость": "Все Wi-Fi камеры Dahua/IMOU",
    },
    categorySlug: "dahua-wireless-accessories", brandId: bid,
  });

  await upsert({
    name: "Wi-Fi NVR — Беспроводной регистратор",
    slugKey: "dahua-wifi-nvr",
    shortDescription: "Сетевые регистраторы со встроенным Wi-Fi для работы с беспроводными камерами.",
    description: "Wi-Fi NVR Dahua содержит встроенную точку доступа 2.4/5 ГГц для подключения беспроводных IP-камер без маршрутизатора. Автоматическое сопряжение, поддержка 4/8 каналов, HDD до 8 ТБ.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260512/WIFI-KIT1.png",
    characteristics: {
      "Каналов": "4 / 8",
      "Wi-Fi": "2.4/5 ГГц (встроенная AP)",
      "Разрешение": "до 4 МП",
      "HDD": "до 8 ТБ (1 слот)",
      "P2P": "DMSS / Easy4ip",
    },
    categorySlug: "dahua-wireless-nvr", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ВЗРЫВОЗАЩИЩЁННЫЕ И ИНТЕЛЛЕКТУАЛЬНЫЕ ВЫЧИСЛЕНИЯ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Спецтехника ===");

  await upsert({
    name: "Explosion-Proof Camera — Взрывозащищённая камера",
    slugKey: "dahua-explosion-proof-cam",
    shortDescription: "IP-камеры в взрывозащищённом корпусе ATEX/Ex для нефтяной, газовой и химической отраслей.",
    description: "Взрывозащищённые камеры Dahua соответствуют стандартам ATEX Zone 1/21 и IECEx. Применяются на нефтяных платформах, в шахтах, химических заводах. Корпус из нержавеющей стали, ИК до 60 м.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/special.png",
    characteristics: {
      "Сертификаты": "ATEX Zone 1/2/21/22, IECEx",
      "Разрешение": "2 МП / 4 МП",
      "ИК-подсветка": "до 60 м",
      "Корпус": "316L нержавеющая сталь",
      "Температура": "-55°C … +70°C",
      "Защита": "IP68, IK10",
    },
    categorySlug: "dahua-explosion-proof", brandId: bid,
  });

  await upsert({
    name: "AI Box — Интеллектуальные вычисления на периметре",
    slugKey: "dahua-ai-box",
    shortDescription: "AI-вычислительные блоки для добавления видеоаналитики к существующим камерам.",
    description: "AI Box Dahua подключается к любым IP-камерам и добавляет функции ИИ: распознавание лиц, подсчёт людей, обнаружение транспорта, тепловые карты. Встроенный GPU NPU, до 16 каналов на устройство.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/7.png",
    characteristics: {
      "Каналов": "4 / 8 / 16",
      "NPU": "До 40 TOPS",
      "Аналитика": "Лица, ANPR, поведение, тепловая карта",
      "Интерфейс": "HDMI, USB, RJ45",
      "ОС": "Linux (встроенная)",
    },
    categorySlug: "dahua-intelligent-computing", brandId: bid, recommended: true,
  });

  // ══════════════════════════════════════════════════════════
  // ВИДЕОДОМОФОНЫ — АКСЕССУАРЫ И МАСТЕР-СТАНЦИИ
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Домофоны — доп. оборудование ===");

  await upsert({
    name: "Master Station — Диспетчерский пульт",
    slugKey: "dahua-master-station",
    shortDescription: "Диспетчерские пульты для управления всей домофонной системой здания.",
    description: "Мастер-станции Dahua устанавливаются на охранном посту или у консьержа. Управление всеми вызывными панелями и мониторами квартир, перехват вызовов, открытие дверей, трансляция сообщений.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Android-Series.png",
    characteristics: {
      "Экран": "10\" IPS сенсорный",
      "Квартир": "до 2000",
      "Функции": "Перехват, трансляция, управление лифтами",
      "Интеграция": "DSS Pro, СКУД",
      "Питание": "12В DC / PoE",
    },
    categorySlug: "dahua-master-stations", brandId: bid,
  });

  await upsert({
    name: "Intercom Accessories — Аксессуары домофонов",
    slugKey: "dahua-intercom-acc",
    shortDescription: "Коммутаторы, блоки питания, электромагнитные замки и монтажные боксы для домофонов.",
    description: "Аксессуары Dahua для систем видеодомофонии: сетевые коммутаторы (специальные для домофонов), блоки питания 12/24В, электромагнитные замки 280 кг, монтажные боксы для скрытой установки вызывных панелей.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Android-Series.png",
    characteristics: {
      "Тип": "Замки, боксы, блоки питания, коммутаторы",
      "Замок": "Электромагнитный 280/600 кг",
      "Монтажный бокс": "Скрытая / открытая установка",
      "Блок питания": "12/24В DC",
    },
    categorySlug: "dahua-intercom-accessories", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ОХРАННАЯ СИГНАЛИЗАЦИЯ — ДОПТЕХНИКА
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Сигнализация — доп. ===");

  await upsert({
    name: "Alarm Keyboard — Клавиатура управления",
    slugKey: "dahua-alarm-keyboard",
    shortDescription: "LCD-клавиатуры для постановки/снятия зон охранной сигнализации Dahua.",
    description: "Клавиатуры Dahua с LCD или TFT-дисплеем для удобного управления охранной панелью. Ввод PIN-кода, карта Mifare, индикация статуса зон, тревожная кнопка.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png",
    characteristics: {
      "Дисплей": "LCD / TFT 3.5\"",
      "Аутентификация": "PIN / Mifare карта",
      "Зон": "до 64",
      "Подключение": "RS485 / IP",
      "Питание": "12В DC",
    },
    categorySlug: "dahua-alarm-keyboards", brandId: bid,
  });

  await upsert({
    name: "Siren & Strobe — Сирена с проблесковым маяком",
    slugKey: "dahua-siren-strobe",
    shortDescription: "Проводные и беспроводные сирены 110 дБ со световым маяком для охранной сигнализации.",
    description: "Сирены Dahua мощностью 110 дБ для уличного и внутреннего применения. Встроенный аккумулятор 12В для автономной работы при отключении питания. Совместимы со всеми охранными панелями Dahua.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250519/wireless2.png",
    characteristics: {
      "Громкость": "110 дБ",
      "Тип": "Комбинированная (звук + свет)",
      "Питание": "12В DC / беспроводная 868 МГц",
      "Аккумулятор": "12В 1.2 А/ч",
      "Защита": "IP33 / IP55",
    },
    categorySlug: "dahua-sirens", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // КОНТРОЛЬ ДОСТУПА — ДОПТЕХНИКА
  // ══════════════════════════════════════════════════════════
  console.log("\n=== СКУД — доп. ===");

  await upsert({
    name: "Card Reader — Считыватель карт",
    slugKey: "dahua-card-reader",
    shortDescription: "Бесконтактные считыватели Mifare, EM, BLE и мультиформатные для систем СКУД.",
    description: "Считыватели Dahua поддерживают карты Mifare Classic/Plus/DESFire, EM125 кГц, Bluetooth. Возможности: Wiegand 26/34/66, OSDP, RS485. Защита IP65, рабочая температура -40°C … +65°C.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png",
    characteristics: {
      "Форматы": "Mifare, EM125, BLE, HID",
      "Интерфейс": "Wiegand 26/34, RS485, OSDP",
      "Дальность": "до 10 см (карта) / 5 м (BLE)",
      "Защита": "IP65",
      "Температура": "-40°C … +65°C",
    },
    categorySlug: "dahua-card-readers", brandId: bid,
  });

  await upsert({
    name: "Smart Lock — Умный замок",
    slugKey: "dahua-smart-lock",
    shortDescription: "Электронные замки с распознаванием лица, отпечатка, карты, PIN и приложением.",
    description: "Умные замки Dahua для квартир и офисов с биометрической идентификацией (лицо/отпечаток), картой Mifare, PIN-кодом и управлением через DMSS. Дистанционное открытие, журнал событий, временные пароли для гостей.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240826/con3801.png",
    characteristics: {
      "Аутентификация": "Лицо, отпечаток, карта, PIN, BLE",
      "Батарея": "4×AA (до 12 мес.)",
      "Приложение": "DMSS",
      "Гостевые коды": "Временные пароли",
      "Материал": "Цинковый сплав / нержавеющая сталь",
    },
    categorySlug: "dahua-smart-locks", brandId: bid,
  });

  await upsert({
    name: "Access Control Software — ПО для СКУД",
    slugKey: "dahua-access-software",
    shortDescription: "Программное обеспечение для управления контролем доступа, учётом рабочего времени и посещаемостью.",
    description: "Dahua SmartPSS и DSS Pro включают полноценные модули СКУД: управление картами, расписания доступа, учёт рабочего времени, интеграция с 1С, отчёты о посещаемости.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads/image/20250918/Time-Attendance.png",
    characteristics: {
      "Пользователей": "неограниченно (лицензируется)",
      "УРВ": "Учёт рабочего времени и посещаемости",
      "Интеграция": "1С, SAP, HR-системы",
      "Платформа": "Windows / Web-браузер",
      "Отчёты": "Более 20 шаблонов",
    },
    categorySlug: "dahua-access-software", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // DoLynk CLOUD
  // ══════════════════════════════════════════════════════════
  console.log("\n=== DoLynk Cloud ===");

  await upsert({
    name: "DoLynk App — Облачное приложение",
    slugKey: "dahua-dolynk-app",
    shortDescription: "Облачная платформа Dahua DoLynk для умного дома и видеонаблюдения с любого устройства.",
    description: "DoLynk — облачный сервис Dahua для управления умным домом, видеонаблюдением и безопасностью через единое приложение. Поддержка IP-камер, сигнализации, умных замков, освещения. Работает без статического IP.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240926/imgx-spand.png",
    characteristics: {
      "Платформа": "iOS / Android / Web",
      "Устройств": "неограниченно",
      "Функции": "Видео, сигнализация, умный дом",
      "Облако": "AWS / Alicloud",
      "Стоимость": "Бесплатно / подписка",
    },
    categorySlug: "dahua-dolynk-app", brandId: bid,
  });

  await upsert({
    name: "DoLynk Cloud Services — Облачные сервисы",
    slugKey: "dahua-dolynk-services",
    shortDescription: "Облачное хранилище видео и сервисы AI-аналитики по подписке для домашних камер.",
    description: "DoLynk Cloud Services предоставляет облачное хранение видео (7 / 30 / 90 дней), AI-детекцию объектов в облаке, уведомления с миниатюрами. Без необходимости в NVR и SD-карте.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/uploads/image/20240926/imgx-spand.png",
    characteristics: {
      "Хранение": "7 / 30 / 90 дней",
      "AI в облаке": "Люди, авто, животные",
      "Уведомления": "Push с фото-превью",
      "Шифрование": "AES-128 в облаке",
      "Подписка": "Ежемесячная / годовая",
    },
    categorySlug: "dahua-dolynk-services", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ТЕПЛОВИЗИОННЫЕ МОДУЛИ OEM
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Тепловизионные модули ===");

  await upsert({
    name: "Thermal Module — OEM тепловизионный модуль",
    slugKey: "dahua-thermal-module-oem",
    shortDescription: "OEM тепловизионные ядра и модули для встраивания в промышленные приборы и дроны.",
    description: "Тепловизионные модули Dahua для OEM-интеграции в промышленные приборы, БПЛА, ручные устройства. Некоолируемые матрицы LWIR 12 мкм, NETD < 40 мК, интерфейс USB/MIPI/GigE.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260320/22_4.png",
    characteristics: {
      "Матрица": "256×192 / 384×288 / 640×512",
      "Шаг пикселя": "12 мкм",
      "NETD": "< 40 мК",
      "Интерфейс": "USB 3.0 / MIPI / GigE",
      "Применение": "БПЛА, промышленность, медицина",
    },
    categorySlug: "dahua-thermal-modules", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  // ТРАНСПОРТ — ДОРОЖНЫЕ КАМЕРЫ И УМНЫЙ ГОРОД
  // ══════════════════════════════════════════════════════════
  console.log("\n=== Транспорт — доп. ===");

  await upsert({
    name: "Road Camera — Дорожная камера",
    slugKey: "dahua-road-camera",
    shortDescription: "Дорожные камеры с AI для контроля скорости, нарушений ПДД и мониторинга трафика.",
    description: "Дорожные камеры Dahua выявляют нарушения ПДД (проезд на красный, превышение скорости, нарушение разметки), ведут статистику интенсивности трафика, интегрируются с ЦОДД.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png",
    characteristics: {
      "Разрешение": "до 12 МП",
      "Выдержка": "до 1/50 000 с (без смаза)",
      "ИИ": "Нарушения ПДД, подсчёт ТС, скорость",
      "Ночь": "Белый / ИК LED подсветка",
      "Защита": "IP67, IK10",
    },
    categorySlug: "dahua-road-cameras", brandId: bid,
  });

  await upsert({
    name: "Smart City — Решения для умного города",
    slugKey: "dahua-smart-city-solution",
    shortDescription: "Комплексные IoT и AI решения для городской безопасности: парки, дороги, транспорт.",
    description: "Dahua Smart City включает интегрированные решения для городских сетей видеонаблюдения: умные перекрёстки, распознавание транспорта и лиц в публичных местах, IoT-сенсоры окружающей среды, аналитика толпы и пешеходного потока.",
    coverImageUrl: "https://materialfile.dahuasecurity.com/new_uploads_formal/image/20260324/positioning.png",
    characteristics: {
      "Компоненты": "Камеры, ANPR, IoT-сенсоры, VMS",
      "Аналитика": "Лица, транспорт, толпа, среда",
      "Интеграция": "ЦОДД, МВД, ЖКХ",
      "Платформа": "DSS Pro + City Brain",
    },
    categorySlug: "dahua-smart-city", brandId: bid,
  });

  // ══════════════════════════════════════════════════════════
  console.log("\n✅ Готово! Все оставшиеся 30 категорий заполнены.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => { console.error("Ошибка:", e); process.exit(1); });
