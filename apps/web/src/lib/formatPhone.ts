/**
 * Телефон для показа человеку: цифры разбиты пробелами, чтобы номер читался
 * с одного взгляда. В базе он лежит слитно (+998978626699), и до этого так же
 * и выводился — сплошной строкой, которую глазом не разобрать.
 *
 * Узбекский формат: +998 XX XXX XX XX. Всё, что не подошло под шаблон,
 * возвращаем как есть — лучше показать как есть, чем испортить.
 * Для ссылки tel: используйте исходное значение, а не это.
 */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("998")) {
    const d = digits.slice(3);
    return `+998 ${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 7)} ${d.slice(7, 9)}`;
  }
  if (digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  }
  return raw;
}
