/* Карусель главной: слайд «Проект видеонаблюдения онлайн» последним (решение владельца 11.11.2026,
 * картинка — тёмный план с зонами, нарисована без fal). Слайды лежат в site_pages key=site, data.heroSlides
 * на русском; переводы uz/en/tr/zh — по индексу в messages home.heroSlides[18] (коммит 4a4fa41).
 * Перед записью старый data.heroSlides сохраняется в /root/backup/hero-slides-<время>.json.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно (по id слайда).
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-hero-slide-camera-designer-20261111.ts [--apply] */
import "dotenv/config";
import { mkdirSync, writeFileSync } from "node:fs";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { SitePage } from "./models/SitePage.js";

const APPLY = process.argv.includes("--apply");
const EXPECTED = 18; // столько слайдов было на 11.11; новый встаёт 19-м, его индекс 18 совпадает с переводами

const SLIDE = {
  id: "dir-camera-designer",
  title: "Проект видеонаблюдения онлайн",
  text: "Камеры на плане, зоны обзора и смета с монтажом — бесплатно",
  imageUrl: "https://api.satsolutions.uz/uploads/hero/camera-designer.webp",
  videoUrl: "",
  sortOrder: EXPECTED,
  published: true,
  buttons: [
    { label: "Попробовать", href: "/tools/camera-lens-calculator" },
    { label: "Открыть пример", href: "/tools/camera-lens-calculator?example=office#plan" },
  ],
};

async function main() {
  initModels();
  await connectDb();
  const page: any = await SitePage.findOne({ where: { key: "site" } });
  if (!page) { console.log("✗ site_pages key=site не найдена"); process.exit(1); }
  const data = (page.data ?? {}) as Record<string, any>;
  const slides: any[] = Array.isArray(data.heroSlides) ? data.heroSlides : [];
  if (slides.some((s) => s?.id === SLIDE.id)) { console.log(`= слайд ${SLIDE.id} уже есть — ничего не делаю`); process.exit(0); }
  if (slides.length !== EXPECTED) { console.log(`✗ слайдов ${slides.length}, ожидалось ${EXPECTED}: индекс переводов разъедется — ничего не записано`); process.exit(1); }
  const maxSort = Math.max(...slides.map((s) => Number(s?.sortOrder ?? 0) || 0));
  if (maxSort >= SLIDE.sortOrder) { console.log(`✗ наибольший sortOrder ${maxSort} ≥ ${SLIDE.sortOrder}: слайд не встанет последним`); process.exit(1); }
  console.log(`слайдов сейчас ${slides.length}, последний: ${slides[slides.length - 1]?.title} (sortOrder ${maxSort})`);
  console.log("добавляется 19-м:", JSON.stringify(SLIDE, null, 1));
  if (APPLY) {
    mkdirSync("/root/backup", { recursive: true });
    const bak = `/root/backup/hero-slides-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    writeFileSync(bak, JSON.stringify(slides, null, 1));
    page.data = { ...data, heroSlides: [...slides, SLIDE] }; // новый объект — иначе Sequelize не увидит изменения JSONB
    await page.save();
    console.log(`\nЗАПИСАНО. Бэкап прежних слайдов: ${bak}`);
  } else console.log("\nСухой прогон — ничего не записано");
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
