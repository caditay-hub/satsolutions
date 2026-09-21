/**
 * Словарь, который уезжает в браузер вместе с RSC-потоком.
 *
 * `NextIntlClientProvider` без явного `messages` сериализует ВЕСЬ словарь локали
 * в inline-скрипты на каждой странице. Для ru это 182 КБ JSON, из них 132 КБ —
 * тела услуг (`services.*.details/faq/works/intro`), которые рендерит сервер:
 * на клиенте из этого раздела нужен только `title` для выпадающего меню шапки
 * (SiteHeaderClient) и `desc` для подписей.
 *
 * Замер 21.09.2026 (карточка товара): 375 КБ HTML, из них 295 КБ — RSC-поток,
 * почти целиком этот словарь. Googlebot за 14 дней выкачал 5,8 ГБ с карточек —
 * ровно на этом балласте.
 */
/** Поля раздела `services`, нужные клиентским компонентам. */
const SERVICE_CLIENT_FIELDS = ["title", "desc"] as const;

export function clientMessages<T extends Record<string, any>>(messages: T): T {
  const services = messages.services;
  if (!services || typeof services !== "object") return messages;

  const trimmed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(services as Record<string, unknown>)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      trimmed[key] = value; // плоские ключи раздела оставляем как есть
      continue;
    }
    const src = value as Record<string, unknown>;
    const short: Record<string, unknown> = {};
    for (const field of SERVICE_CLIENT_FIELDS) {
      if (field in src) short[field] = src[field];
    }
    trimmed[key] = short;
  }

  return { ...messages, services: trimmed } as T;
}
