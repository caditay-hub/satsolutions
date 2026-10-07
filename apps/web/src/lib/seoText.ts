// Заголовок в выдаче обрезается примерно на 60–65 символах, описание — на 160.
// Резать своими многоточиями нельзя: в выдаче это читается как оборванная фраза
// («Что такое СКУД: как работает система контроля… — SAT Solutions»).
// Поэтому режем только по естественной границе — двоеточию или концу предложения,
// а если её нет, отдаём текст целиком: обрезать умеет и сам поисковик, но без «…».

const BRAND = " — SAT Solutions";

/** Описание: сокращаем до целого предложения, иначе оставляем как есть. */
export function clampDesc(text: string, max = 158): string {
  const s = text.trim();
  if (s.length <= max) return s;
  const head = s.slice(0, max);
  const end = Math.max(head.lastIndexOf(". "), head.lastIndexOf("。"), head.lastIndexOf("! "), head.lastIndexOf("? "));
  return end > max * 0.5 ? s.slice(0, end + 1).trim() : s;
}

/** Заголовок: берём часть до двоеточия или тире, иначе отдаём целиком. */
export function clampTitle(text: string, max = 62): string {
  const s = text.trim();
  if (s.length <= max) return s;
  for (const sep of [": ", " — ", " – ", "：", " - "]) {
    const i = s.indexOf(sep);
    if (i > 15 && i <= max) return s.slice(0, i).trim();
  }
  return s;
}

const BRAND_SHORT = " | SAT";

/** Заголовок страницы с брендом: бренд приписываем, только если помещается.
 *  Порядок (AF, 07.10.2026): полный текст + « — SAT Solutions» → полный текст + « | SAT» →
 *  полный текст без бренда → и только если и он длиннее max — обрезка до двоеточия.
 *  Раньше обрезка шла под длинный бренд первой, и 177 из 360 заголовков статей теряли
 *  после двоеточия главное слово запроса: «Сколько стоит СКУД: цена системы контроля
 *  доступа» (49 знаков, влезал целиком) уходил в выдачу как «Сколько стоит СКУД — SAT Solutions». */
export function titleWithBrand(text: string, max = 62): string {
  const s = text.trim();
  if (s.length + BRAND.length <= max) return s + BRAND;
  if (s.length + BRAND_SHORT.length <= max) return s + BRAND_SHORT;
  if (s.length <= max) return s;
  const base = clampTitle(s, max - BRAND.length);
  return base.length + BRAND.length <= max ? base + BRAND : base;
}
