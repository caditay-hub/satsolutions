// Детерминированный slug для страниц типа товаров: имя типа (кириллица) → чистый latin-slug.
// Чистая функция — используется и в client-ссылках, и в роуте /products/type/[slug], и в sitemap,
// чтобы ссылки/редиректы/резолв совпадали без хранимого слага.

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** "IP-камеры" → "ip-kamery", "Wi-Fi точки доступа" → "wi-fi-tochki-dostupa". */
export function typeSlug(name: string): string {
  const lower = (name || "").toLowerCase();
  let out = "";
  for (const ch of lower) {
    out += ch in TRANSLIT ? TRANSLIT[ch] : ch;
  }
  return out
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
