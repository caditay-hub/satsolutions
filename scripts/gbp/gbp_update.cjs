// Правка карточки Google Business Profile «SAT Solutions» по решению владельца 02.10.2026:
// чистая ссылка на сайт, телефоны (основной 97 862 66 99), категории, описание, список услуг
// с описаниями и ценами «от», атрибуты (убрать «туалетные», добавить LinkedIn).
// Сухой прогон по умолчанию (validateOnly у Google + печать плана), запись только с --apply.
// Запуск на сервере: node gbp_update.cjs [--apply]
const https = require("https");
const fs = require("fs");
const APPLY = process.argv.includes("--apply");
const LOCATION = "locations/6645809122415800101"; // SAT Solutions (НЕ Temirkor)
const oauth = JSON.parse(fs.readFileSync("/root/.gbp_oauth.json", "utf8"));

function request(host, path, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : JSON.stringify(body);
    const h = { ...headers };
    if (data) { h["Content-Type"] = "application/json"; h["Content-Length"] = Buffer.byteLength(data); }
    const req = https.request({ host, path, method, headers: h }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => { const text = Buffer.concat(chunks).toString("utf8"); try { resolve({ status: res.statusCode, json: JSON.parse(text), text }); } catch { resolve({ status: res.statusCode, json: null, text }); } });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}
async function token() {
  const body = new URLSearchParams({ client_id: oauth.client_id, client_secret: oauth.client_secret, refresh_token: oauth.refresh_token, grant_type: "refresh_token" }).toString();
  const r = await new Promise((resolve, reject) => { const req = https.request({ host: "oauth2.googleapis.com", path: "/token", method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) } }, (res) => { const c = []; res.on("data", (k) => c.push(k)); res.on("end", () => resolve(JSON.parse(Buffer.concat(c).toString()))); }); req.on("error", reject); req.write(body); req.end(); });
  if (!r.access_token) { console.error("токен не получен"); process.exit(1); }
  return r.access_token;
}

const CAT = {
  cctv: "categories/gcid:closed_circuit_television",
  fire: "categories/gcid:fire_protection_service",
  sec: "categories/gcid:security_system_installer",
};
const price = (units) => ({ currencyCode: "UZS", units: String(units) });
const svc = (category, displayName, description, p) => ({ freeFormServiceItem: { category, label: { displayName, description, languageCode: "ru" } }, ...(p ? { price: price(p) } : {}) });

const DESCRIPTION = "SAT Solutions — системы безопасности в Ташкенте: продажа, проектирование, монтаж и обслуживание. Видеонаблюдение Hikvision, Dahua, TP-Link; пожарная сигнализация Рубеж и Болид; СКУД, турникеты, шлагбаумы; домофоны, сети и СКС. Более 3000 товаров в каталоге с ценами, собственные монтажные бригады, гарантия на оборудование и работы, выезд инженера на объект. Работаем с бизнесом и госорганизациями по всему Узбекистану. Гарантия 3 года на монтажные работы, лицензии Национальной гвардии и МЧС, учёт рабочего времени с выгрузкой табеля в 1С. Выезд инженера и смета — бесплатно, в день обращения.";

const LOCATION_PATCH = {
  websiteUri: "https://satsolutions.uz/",
  phoneNumbers: { primaryPhone: "+998 97 862 66 99", additionalPhones: ["+998 77 001 55 55"] },
  categories: {
    primaryCategory: { name: CAT.cctv },
    additionalCategories: [
      { name: CAT.fire },
      { name: CAT.sec },
      { name: "categories/gcid:security_system_supplier" },
      { name: "categories/gcid:fire_alarm_supplier" },
      { name: "categories/gcid:burglar_alarm_store" },
      { name: "categories/gcid:telecommunications_contractor" },
    ],
  },
  profile: { description: DESCRIPTION },
  serviceItems: [
    svc(CAT.cctv, "Установка видеонаблюдения", "IP-камеры Hikvision, Dahua и HiLook, регистратор, просмотр с телефона. Монтаж за 1–3 дня, гарантия 3 года на работы. Цена — работы на 4 камеры.", 2_100_000),
    svc(CAT.cctv, "Монтаж камер видеонаблюдения", "Монтаж внутренней камеры 155 000 сум, уличной 180 000, настройка и пусконаладка 77 000 за камеру. Оборудование из каталога отдельно.", 155_000),
    svc(CAT.fire, "Пожарная сигнализация (АПС и СОУЭ)", "Проект, монтаж, сдача надзорным органам. Оборудование Рубеж и Болид, лицензия МЧС. Цена — работы для офиса 150 м².", 1_430_000),
    svc(CAT.fire, "Обслуживание пожарной сигнализации", "Договор ТО по ПКМ № 649: проверка извещателей и шлейфов, журнал, замена аккумуляторов, готовность к проверке. Лицензия МЧС № 913518."),
    svc(CAT.sec, "Контроль доступа (СКУД)", "Терминалы по лицу и карте ZKTeco и Hikvision, контроллеры, замки, учёт рабочего времени с выгрузкой в 1С. Цена — работы на одну дверь.", 780_000),
    svc(CAT.sec, "Турникеты и проходные", "Триподы, калитки и флап-турникеты ZKTeco и Hikvision, в том числе с Face ID. Монтаж за 1–3 дня, интеграция с учётом рабочего времени."),
    svc(CAT.sec, "Шлагбаумы", "Автоматические шлагбаумы ZKTeco и Hikvision со стрелой до 6 м, распознавание номеров, пульт, карта, QR-код. Монтаж за день."),
    svc(CAT.sec, "Домофоны и видеодомофоны", "IP-видеодомофоны Hikvision и Dahua для квартиры, частного дома и подъезда, вызов на смартфон, замок на калитку. Цена — работы для квартиры.", 560_000),
    svc(CAT.sec, "Электронные и умные замки", "Кодовые, биометрические и smart-замки с открытием с телефона. Установка за день. Цена — монтаж электромагнитного замка.", 110_000),
    svc(CAT.sec, "Охранная сигнализация", "Датчики движения и открытия, сирена, тревожная кнопка, уведомления на телефон и вывод на пульт охраны. Для квартиры, дома, офиса и склада."),
    svc(CAT.sec, "СКС и локальные сети", "Прокладка СКС и ЛВС, серверные шкафы, коммутаторы, тестирование и паспорт линий. Для офисов, производств и бизнес-центров."),
    svc(CAT.sec, "Wi-Fi для офиса, склада и гостиницы", "Бесшовный Wi-Fi по радиообследованию: точки доступа UniFi, MikroTik, Omada и Ruijie, гостевая сеть с авторизацией."),
    svc(CAT.sec, "Серверы и серверные", "Серверы H3C под 1С и видеонаблюдение, виртуализация, стойки, ИБП и охлаждение. Серверная и мини-ЦОД под ключ."),
    svc(CAT.sec, "Учёт рабочего времени", "Биометрические терминалы, автоматический табель, выгрузка в 1С по сменам с опозданиями и переработками."),
    svc(CAT.sec, "Умный дом", "Свет, климат, шторы, охрана и камеры в одном приложении на Tuya и Tapo. Установка без штробления на готовый ремонт."),
  ],
};
const UPDATE_MASK = "websiteUri,phoneNumbers,categories,profile.description,serviceItems";

const ATTR_MASK = "attributes/has_wheelchair_accessible_seating,attributes/has_wheelchair_accessible_restroom,attributes/has_restroom_unisex,attributes/url_linkedin";
const ATTR_BODY = { name: `${LOCATION}/attributes`, attributes: [
  { name: "attributes/url_linkedin", valueType: "URL", uriValues: [{ uri: "https://www.linkedin.com/company/sat-solutions-uz" }] },
] };

(async () => {
  const H = { Authorization: `Bearer ${await token()}` };
  console.log(`Описание: ${DESCRIPTION.length} знаков (лимит 750)`);
  for (const s of LOCATION_PATCH.serviceItems) {
    const l = s.freeFormServiceItem.label;
    if (l.displayName.length > 140 || l.description.length > 250) console.log("  ⚠ длина:", l.displayName, l.displayName.length, l.description.length);
  }
  console.log(`Услуг: ${LOCATION_PATCH.serviceItems.length}, с ценой: ${LOCATION_PATCH.serviceItems.filter((s) => s.price).length}`);

  // 1. карточка — validateOnly при сухом прогоне
  const q = APPLY ? "" : "&validateOnly=true";
  const r = await request("mybusinessbusinessinformation.googleapis.com", `/v1/${LOCATION}?updateMask=${encodeURIComponent(UPDATE_MASK)}${q}`, { method: "PATCH", headers: H, body: LOCATION_PATCH });
  console.log(`\nКарточка (${APPLY ? "ЗАПИСЬ" : "проверка Google, validateOnly"}):`, r.status, r.status === 200 ? "OK" : r.text.slice(0, 1500));

  // 2. атрибуты
  if (!APPLY) {
    console.log("\nАтрибуты (план): убрать has_wheelchair_accessible_seating, has_wheelchair_accessible_restroom, has_restroom_unisex; добавить url_linkedin. Запись только с --apply.");
  } else {
    const a = await request("mybusinessbusinessinformation.googleapis.com", `/v1/${LOCATION}/attributes?attributeMask=${encodeURIComponent(ATTR_MASK)}`, { method: "PATCH", headers: H, body: ATTR_BODY });
    console.log("Атрибуты (ЗАПИСЬ):", a.status, a.status === 200 ? "OK" : a.text.slice(0, 800));
  }
})();
