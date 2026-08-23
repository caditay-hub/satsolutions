/**
 * Число для показа человеку: разряды разделены неразрывным узким пробелом,
 * чтобы «3213» читалось как «3 213» и не переносилось по разрядам.
 * Цены на сайте так выводились всегда, а счётчики — нет.
 */
export function formatNumber(n: number | string | null | undefined): string {
  const v = typeof n === "string" ? Number(n.replace(/\s/g, "")) : n;
  if (v == null || !Number.isFinite(Number(v))) return String(n ?? "");
  return new Intl.NumberFormat("ru-RU").format(Number(v)).replace(/\u00A0/g, "\u202F");
}
