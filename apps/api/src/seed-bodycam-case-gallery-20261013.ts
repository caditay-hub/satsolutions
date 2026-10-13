/* Кейс StreetParking (бодикамеры Dahua): в галерее 2 из 4 кадров были мобильными видеорегистраторами
 * (Hikvision и Dahua для транспорта), к проекту отношения не имевшими. Заменяем их официальными кадрами
 * Dahua того, что реально поставлено: DH-MPT230 спереди/сзади и модуль управления EEC300.
 * Файлы уже лежат в uploads/portfolio/. Схема решения и ракурс DH-MPT230 остаются.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-bodycam-case-gallery-20261013.ts [--apply] */
import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { PortfolioProject } from "./models/PortfolioProject.js";

const APPLY = process.argv.includes("--apply");
const SLUG = "sistema-videonablyudeniya-na-bodikamerah-dahua";
const B = "https://api.satsolutions.uz/uploads";
const REPLACE: Record<string, string> = {
  [`${B}/images/6c2a9c48-618c-4cca-97d7-f00e2d4b54b3.webp`]: `${B}/portfolio/bodycam-mpt230-front-back.webp`,
  [`${B}/images/caac9824-9575-4a12-9c25-8f6ef3b1686a.webp`]: `${B}/portfolio/bodycam-eec300-control.webp`,
};

async function main() {
  initModels();
  await connectDb();
  const p: any = await PortfolioProject.findOne({ where: { slug: SLUG } });
  if (!p) { console.log("✗ кейс не найден"); process.exit(1); }
  const was: string[] = p.galleryImageUrls ?? [];
  const now = was.map((u) => REPLACE[u] ?? u);
  console.log("было:\n  " + was.join("\n  ") + "\nстало:\n  " + now.join("\n  "));
  if (JSON.stringify(was) === JSON.stringify(now)) { console.log("= уже так"); process.exit(0); }
  if (APPLY) { p.galleryImageUrls = now; p.changed("galleryImageUrls", true); await p.save(); console.log("ЗАПИСАНО"); }
  else console.log("Сухой прогон");
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
