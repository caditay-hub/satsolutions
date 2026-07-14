import type { ProductDto } from "@/lib/api";

// Цена: "от X сум" если есть число; "Цена по запросу" для звонить-позиций; иначе null (сайт информационный)
export function priceLabel(p: Pick<ProductDto, "price" | "characteristics">): string | null {
  const n = typeof p.price === "string" ? Number(p.price) : (p.price as unknown as number);
  if (Number.isFinite(n) && n > 0) {
    const fmt = Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
    return `от ${fmt} сум`;
  }
  // Нет цены — всегда «Цена по запросу» (карточка не должна быть без ценового блока)
  return "Цена по запросу";
}

// i18n-вариант: возвращает структуру, а текст собирается через переводы (common.priceFrom/priceOnRequest).
export type PriceInfo = { kind: "value"; value: string } | { kind: "onRequest" } | null;
export function priceInfo(p: Pick<ProductDto, "price" | "characteristics">): PriceInfo {
  const n = typeof p.price === "string" ? Number(p.price) : (p.price as unknown as number);
  if (Number.isFinite(n) && n > 0) {
    const value = Math.round(n).toLocaleString("ru-RU").replace(/,/g, " ");
    return { kind: "value", value };
  }
  // Нет цены — всегда «Цена по запросу» (карточка не должна быть без ценового блока)
  return { kind: "onRequest" };
}

// Эмодзи-иконка по типу товара (для карточек без фото)
export function productIcon(name: string): string {
  const n = (name || "").toLowerCase();
  if (/(sfp|трансивер|qsfp|cwdm)/.test(n)) return "🔌";
  if (/(коммутатор|switch|свитч)/.test(n)) return "🔀";
  if (/(маршрутизатор|роутер|router|точка доступа|wi-fi|access point|мост)/.test(n)) return "📡";
  if (/(оптическ|патч-корд|пигтейл|волокн|кросс|муфт|fiber|делител|сплиттер)/.test(n)) return "🧵";
  if (/(кабель|витая пара|utp|ftp|провод)/.test(n)) return "🪢";
  if (/(шкаф|стойк|rack|полк|вентилятор)/.test(n)) return "🗄️";
  if (/(ибп|ups|бесперебой|аккумул|батаре|питани|преобразовател|розетк)/.test(n)) return "🔋";
  if (/(телефон|voip|атс|fanvil)/.test(n)) return "☎️";
  if (/(сервер|server|процессор|память|ssd|жестк|диск)/.test(n)) return "🖥️";
  if (/(сварочн|инструмент|нож|стриппер|тестер|узк|кримпер)/.test(n)) return "🛠️";
  if (/(камер|видеонаблюд)/.test(n)) return "📷";
  if (/(датчик|сигнализ|умн|штор|лампа)/.test(n)) return "🏠";
  if (/(патч-панел|розетк|keystone|коннектор|krone)/.test(n)) return "🧩";
  if (/(модуль|pon|onu|olt)/.test(n)) return "📶";
  return "📦";
}
