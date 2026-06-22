/**
 * seed-dahua.ts
 * Создаёт полную иерархию категорий Dahua Technology на русском языке.
 * Идемпотентный: повторный запуск не дублирует данные.
 *
 * Запуск:
 *   npm run seed:dahua -w @satsolutions/api
 *   или из папки apps/api:
 *   npx tsx src/seed-dahua.ts
 */

import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Brand } from "./models/Brand.js";
import { Category } from "./models/Category.js";

// ─── helpers ──────────────────────────────────────────────────────────────────
function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => RU_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
const RU_MAP: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",
  к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
  х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"
};

async function upsertCategory(data: {
  name: string;
  slugKey: string;          // уникальный slug — не меняется при переименовании
  parentId: string | null;
  brandId: string;
  coverImageUrl?: string | null;
  description?: string;
}): Promise<Category> {
  const [cat, created] = await Category.findOrCreate({
    where: { slug: data.slugKey },
    defaults: {
      id: undefined as any,
      name: data.name,
      slug: data.slugKey,
      parentId: data.parentId,
      brandId: data.brandId,
      coverImageUrl: data.coverImageUrl ?? null,
    }
  });
  if (!created) {
    // Обновляем название и бренд, если изменились
    cat.name = data.name;
    cat.brandId = data.brandId;
    if (data.parentId !== undefined) cat.parentId = data.parentId;
    if (data.coverImageUrl !== undefined) cat.coverImageUrl = data.coverImageUrl ?? null;
    await cat.save();
  }
  return cat;
}

// ─── main ─────────────────────────────────────────────────────────────────────
async function main() {
  initModels();
  await connectDb();

  // Найти бренд Dahua
  const dahua = await Brand.findOne({ where: { slug: "dahua" } });
  if (!dahua) {
    console.error('[seed-dahua] Бренд "dahua" не найден. Создайте его в админке → Бренды.');
    process.exit(1);
  }
  const bid = dahua.id;
  console.log(`[seed-dahua] Бренд Dahua найден: ${bid}`);

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. СЕТЕВЫЕ ПРОДУКТЫ
  // ═══════════════════════════════════════════════════════════════════════════
  const network = await upsertCategory({
    name: "Сетевые продукты",
    slugKey: "dahua-network-products",
    parentId: null,
    brandId: bid,
    coverImageUrl: null, // Загрузите фото через Администрирование → Категории
  });
  console.log(`[seed-dahua] ✓ Сетевые продукты`);

  const networkSubs = [
    { name: "Сетевые камеры",            slugKey: "dahua-network-cameras",        img: null },
    { name: "PTZ-камеры",                slugKey: "dahua-ptz-cameras",            img: null },
    { name: "PT-камеры",                 slugKey: "dahua-pt-cameras",             img: null },
    { name: "Сетевые видеорегистраторы", slugKey: "dahua-nvr",                   img: null },
    { name: "Взрывозащищённые камеры",   slugKey: "dahua-explosion-proof",        img: null },
    { name: "Интеллектуальные вычисления",slugKey: "dahua-intelligent-computing", img: null },
  ];
  for (const s of networkSubs) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: network.id, brandId: bid, coverImageUrl: s.img });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. БЕСПРОВОДНЫЕ ПРОДУКТЫ
  // ═══════════════════════════════════════════════════════════════════════════
  const wireless = await upsertCategory({
    name: "Беспроводные продукты",
    slugKey: "dahua-wireless-products",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Беспроводные продукты`);

  for (const s of [
    { name: "Беспроводные камеры",       slugKey: "dahua-wireless-cameras" },
    { name: "Беспроводные регистраторы", slugKey: "dahua-wireless-nvr" },
    { name: "Беспроводные аксессуары",   slugKey: "dahua-wireless-accessories" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: wireless.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. HDCVI ПРОДУКТЫ
  // ═══════════════════════════════════════════════════════════════════════════
  const hdcvi = await upsertCategory({
    name: "HDCVI продукты",
    slugKey: "dahua-hdcvi-products",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ HDCVI продукты`);

  for (const s of [
    { name: "HDCVI-камеры",      slugKey: "dahua-hdcvi-cameras" },
    { name: "HDCVI-регистраторы",slugKey: "dahua-hdcvi-recorders" },
    { name: "HDCVI-аксессуары",  slugKey: "dahua-hdcvi-accessories" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: hdcvi.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. ТЕПЛОВИЗИОННЫЕ ПРОДУКТЫ
  // ═══════════════════════════════════════════════════════════════════════════
  const thermal = await upsertCategory({
    name: "Тепловизионные продукты",
    slugKey: "dahua-thermal-products",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Тепловизионные продукты`);

  for (const s of [
    { name: "Тепловизионные камеры",           slugKey: "dahua-thermal-cameras" },
    { name: "Тепловизионные измерительные",    slugKey: "dahua-thermal-measurement" },
    { name: "Тепловизионные модули (OEM)",     slugKey: "dahua-thermal-modules" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: thermal.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ВИДЕОДОМОФОНЫ
  // ═══════════════════════════════════════════════════════════════════════════
  const intercom = await upsertCategory({
    name: "Видеодомофоны",
    slugKey: "dahua-video-intercoms",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Видеодомофоны`);

  for (const s of [
    { name: "Вызывные панели",       slugKey: "dahua-door-stations" },
    { name: "Внутренние мониторы",   slugKey: "dahua-indoor-monitors" },
    { name: "Мастер-станции",        slugKey: "dahua-master-stations" },
    { name: "Видеодомофонные аксессуары", slugKey: "dahua-intercom-accessories" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: intercom.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. КОНТРОЛЬ ДОСТУПА И УЧЁТ ВРЕМЕНИ
  // ═══════════════════════════════════════════════════════════════════════════
  const access = await upsertCategory({
    name: "Контроль доступа и учёт времени",
    slugKey: "dahua-access-control",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Контроль доступа и учёт времени`);

  for (const s of [
    { name: "Контроллеры доступа",          slugKey: "dahua-access-controllers" },
    { name: "Биометрические терминалы",     slugKey: "dahua-biometric-terminals" },
    { name: "Умные замки",                  slugKey: "dahua-smart-locks" },
    { name: "Шлагбаумы и турникеты",       slugKey: "dahua-barriers-turnstiles" },
    { name: "Считыватели карт",             slugKey: "dahua-card-readers" },
    { name: "Программное обеспечение СКУД", slugKey: "dahua-access-software" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: access.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. ОХРАННАЯ СИГНАЛИЗАЦИЯ
  // ═══════════════════════════════════════════════════════════════════════════
  const alarm = await upsertCategory({
    name: "Охранная сигнализация",
    slugKey: "dahua-alarms",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Охранная сигнализация`);

  for (const s of [
    { name: "Контрольные панели",       slugKey: "dahua-alarm-panels" },
    { name: "Детекторы и датчики",      slugKey: "dahua-detectors" },
    { name: "Сирены и оповещатели",     slugKey: "dahua-sirens" },
    { name: "Клавиатуры управления",    slugKey: "dahua-alarm-keyboards" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: alarm.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. ИНТЕРАКТИВНЫЕ ДОСКИ
  // ═══════════════════════════════════════════════════════════════════════════
  const whiteboard = await upsertCategory({
    name: "Интерактивные доски",
    slugKey: "dahua-interactive-whiteboards",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Интерактивные доски`);

  for (const s of [
    { name: "Интерактивные дисплеи",  slugKey: "dahua-interactive-displays" },
    { name: "Мобильные стойки",       slugKey: "dahua-mobile-stands" },
    { name: "Аксессуары для досок",   slugKey: "dahua-whiteboard-accessories" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: whiteboard.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 9. ПЕРЕДАЧА ДАННЫХ
  // ═══════════════════════════════════════════════════════════════════════════
  const transmission = await upsertCategory({
    name: "Передача данных",
    slugKey: "dahua-transmission",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Передача данных`);

  for (const s of [
    { name: "PoE-коммутаторы",               slugKey: "dahua-poe-switches" },
    { name: "Промышленные коммутаторы",      slugKey: "dahua-industrial-switches" },
    { name: "Медиаконвертеры",               slugKey: "dahua-media-converters" },
    { name: "SFP-трансиверы",               slugKey: "dahua-sfp-transceivers" },
    { name: "Беспроводные мосты",           slugKey: "dahua-wireless-bridges" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: transmission.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 10. ИНТЕЛЛЕКТУАЛЬНЫЕ ТРАНСПОРТНЫЕ СИСТЕМЫ
  // ═══════════════════════════════════════════════════════════════════════════
  const traffic = await upsertCategory({
    name: "Интеллектуальный транспорт",
    slugKey: "dahua-intelligent-traffic",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Интеллектуальный транспорт`);

  for (const s of [
    { name: "Дорожные камеры",                     slugKey: "dahua-road-cameras" },
    { name: "Мобильные DVR/NVR",                   slugKey: "dahua-mobile-dvr" },
    { name: "Системы распознавания номеров (ANPR)", slugKey: "dahua-anpr" },
    { name: "Умные городские решения",             slugKey: "dahua-smart-city" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: traffic.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 11. ЗАРЯДНЫЕ СТАНЦИИ ДЛЯ ЭЛЕКТРОМОБИЛЕЙ
  // ═══════════════════════════════════════════════════════════════════════════
  const ev = await upsertCategory({
    name: "Зарядные станции для электромобилей",
    slugKey: "dahua-ev-charger",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Зарядные станции для электромобилей`);

  for (const s of [
    { name: "Бытовые зарядные станции",       slugKey: "dahua-home-ev-charger" },
    { name: "Коммерческие зарядные станции",  slugKey: "dahua-commercial-ev-charger" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: ev.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 12. НАКОПИТЕЛИ
  // ═══════════════════════════════════════════════════════════════════════════
  const memory = await upsertCategory({
    name: "Накопители",
    slugKey: "dahua-memory",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Накопители`);

  for (const s of [
    { name: "SD-карты для видеонаблюдения",     slugKey: "dahua-sd-cards" },
    { name: "Жёсткие диски для видеонаблюдения",slugKey: "dahua-surveillance-hdd" },
    { name: "SSD-накопители",                   slugKey: "dahua-ssd" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: memory.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 13. ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ
  // ═══════════════════════════════════════════════════════════════════════════
  const software = await upsertCategory({
    name: "Программное обеспечение",
    slugKey: "dahua-software",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Программное обеспечение`);

  for (const s of [
    { name: "DSS Pro",         slugKey: "dahua-dss-pro" },
    { name: "SmartPSS",        slugKey: "dahua-smartpss" },
    { name: "DMSS (мобильное)",slugKey: "dahua-dmss" },
    { name: "DSS Express",     slugKey: "dahua-dss-express" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: software.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 14. ОБЛАКО DOLYNK
  // ═══════════════════════════════════════════════════════════════════════════
  const dolynk = await upsertCategory({
    name: "Облако DoLynk",
    slugKey: "dahua-dolynk-cloud",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Облако DoLynk`);

  for (const s of [
    { name: "Облачные сервисы DoLynk",  slugKey: "dahua-dolynk-services" },
    { name: "Мобильное приложение",     slugKey: "dahua-dolynk-app" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: dolynk.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // 15. ДИСПЛЕИ И СИСТЕМЫ УПРАВЛЕНИЯ
  // ═══════════════════════════════════════════════════════════════════════════
  const display = await upsertCategory({
    name: "Дисплеи и системы управления",
    slugKey: "dahua-display-control",
    parentId: null,
    brandId: bid,
  });
  console.log(`[seed-dahua] ✓ Дисплеи и системы управления`);

  for (const s of [
    { name: "Видеостены",                       slugKey: "dahua-video-walls" },
    { name: "Мониторы для видеонаблюдения",     slugKey: "dahua-surveillance-monitors" },
    { name: "LED-дисплеи",                      slugKey: "dahua-led-displays" },
    { name: "Декодеры и контроллеры стен",      slugKey: "dahua-decoders" },
  ]) {
    await upsertCategory({ name: s.name, slugKey: s.slugKey, parentId: display.id, brandId: bid });
    console.log(`[seed-dahua]   ✓ ${s.name}`);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  console.log("\n[seed-dahua] ✅ Готово! Все категории Dahua созданы.");
  console.log("[seed-dahua] Откройте Администрирование → Категории товаров, чтобы добавить фотографии.");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("[seed-dahua] Ошибка:", e);
    process.exit(1);
  });
