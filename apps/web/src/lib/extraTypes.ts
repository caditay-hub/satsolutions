// Типы каталога, оставшиеся вне укрупнённых групп (CATALOG_GROUPS) после слияния
// таксономии. Товары в них живые, страницы отдают 200 и лежат в карте сайта, но
// внутренних ссылок у них не было ни одной: обход 18.09.2026 нашёл 13 таких хабов
// × 5 локалей как страницы-сироты. Сирота без ссылок и с коротким текстом почти
// гарантированно выпадает из индекса, поэтому выводим их отдельным блоком на
// /categories — как минимум одна входящая ссылка с тематической страницы.
//
// Названия совпадают с H1 страниц: localizeCatName переводит их по имени типа.
export const EXTRA_TYPES: Array<{ slug: string; name: string; count: number }> = [
  { slug: "setevye-produkty", name: "Сетевые продукты", count: 73 },
  { slug: "peredacha-dannyh", name: "Передача данных", count: 40 },
  { slug: "besprovodnye-produkty", name: "Беспроводные продукты", count: 25 },
  { slug: "hdcvi-produkty", name: "HDCVI продукты", count: 24 },
  { slug: "ohrannaya-signalizaciya", name: "Охранная сигнализация", count: 20 },
  { slug: "kontrol-dostupa-i-uchet-vremeni", name: "Контроль доступа и учёт времени", count: 18 },
  { slug: "besprovodnye-mosty", name: "Беспроводные мосты", count: 5 },
  { slug: "pt-kamery", name: "PT-камеры", count: 4 },
  { slug: "displei-i-sistemy-upravleniya", name: "Дисплеи и системы управления", count: 3 },
  { slug: "intellektualnyy-transport", name: "Интеллектуальный транспорт", count: 3 },
  { slug: "biometricheskie-terminaly", name: "Биометрические терминалы", count: 2 },
  { slug: "teplovizionnye-kamery", name: "Тепловизионные камеры", count: 2 },
  { slug: "teplovizionnye-produkty", name: "Тепловизионные продукты", count: 2 },
];

/** Подпись блока на /categories. */
export const EXTRA_TYPES_TITLE: Record<string, string> = {
  ru: "Ещё категории",
  uz: "Yana kategoriyalar",
  en: "More categories",
  tr: "Diğer kategoriler",
  zh: "更多分类",
};
