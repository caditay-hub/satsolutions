/**
 * Ссылка на картинку через оптимизатор Next (avif/webp + ресайз по ширине).
 *
 * Нужен там, где обычный <Image> неприменим — прежде всего для атрибута
 * poster у <video>: он принимает только строку-URL. Исходники в uploads
 * лежат в десктопном размере (300–350 КБ на файл), телефон тянул их целиком;
 * через оптимизатор те же кадры весят 12–28 КБ.
 *
 * Каталог сознательно оставлен в стороне: включение оптимизатора на товарных
 * фото откатывали 17.07.2026 (fb145e9) — там тысячи картинок и другая нагрузка.
 */
export function optimizedImg(url: string, width = 750, quality = 70): string {
  if (!url) return url;
  if (url.startsWith("/_next/image")) return url;
  return `/_next/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
