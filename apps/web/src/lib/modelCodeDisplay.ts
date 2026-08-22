import { routing } from "@/i18n/routing";

// Артикул производителя показываем как есть — по нему ищут и его печатают на
// коробке. Но у 215 позиций в артикуле сидит русское описательное слово
// («Огнетушитель ОП-100 РИФ», «Обжим YY-HS-N5684R», «ПУГНП 2×2,5»), и на
// нерусских локалях оно дублировало уже переведённое название кириллицей.
// Латинскую часть посетитель всё равно видит внутри перевода названия
// («Kukunli o't o'chirgich OP-100 RIF»), поэтому такую строку просто скрываем.
export function displayModelCode(code: string | null | undefined, locale: string): string | null {
  if (!code) return null;
  if (locale === routing.defaultLocale) return code;
  return /[А-Яа-яЁё]/.test(code) ? null : code;
}
