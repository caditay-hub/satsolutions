// WebP-копии фото страниц услуг (07.10.2026, пункт AO): uploads/services-page/<key>.jpg →
// <key>.webp рядом. Главное фото первого экрана грузилось до ~2,2 с на медленном 4G, деля
// канал со скриптами и шрифтами; WebP примерно вдвое легче JPEG того же качества.
// JPEG остаются: их берут og:image и всё, что ссылается на .jpg.
//
// Сухой прогон по умолчанию — только размеры «было → станет». Запись: --apply
//   node scripts/services-hero-webp.mjs [--apply] [--dir=/path/to/services-page]
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const APPLY = process.argv.includes("--apply");
const dirArg = process.argv.find((a) => a.startsWith("--dir="));
const DIR = dirArg ? dirArg.slice(6) : path.join(here, "..", "uploads", "services-page");
const QUALITY = 78;

const files = fs.readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f)).sort();
let before = 0, after = 0, written = 0, skipped = 0;
for (const f of files) {
  const src = path.join(DIR, f);
  const out = path.join(DIR, f.replace(/\.jpe?g$/i, ".webp"));
  const jpgSize = fs.statSync(src).size;
  if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) { skipped++; continue; }
  const buf = await sharp(src).rotate().webp({ quality: QUALITY, effort: 5 }).toBuffer();
  before += jpgSize;
  after += buf.length;
  console.log(`${f.padEnd(40)} ${String(Math.round(jpgSize / 1024)).padStart(4)} КБ → ${String(Math.round(buf.length / 1024)).padStart(4)} КБ`);
  if (APPLY) { fs.writeFileSync(out, buf); written++; }
}
console.log(`\nфайлов: ${files.length}, к обработке: ${files.length - skipped}, уже актуальны: ${skipped}`);
console.log(`JPEG ${Math.round(before / 1024)} КБ → WebP ${Math.round(after / 1024)} КБ (${before ? Math.round((1 - after / before) * 100) : 0}% легче)`);
console.log(APPLY ? `записано: ${written}` : "сухой прогон — ничего не записано (запись: --apply)");
