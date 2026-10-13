/* Кейс StreetParking: камеры DH-MPT230 пишут в 2K (подтвердил владелец 13.10.2026), а в RU-тексте
 * кейса стояло «Full HD». Правим content и equipmentSupply и меняем схему решения в галерее на
 * исправленную копию bodycam-architecture-2k.webp (новое имя — старый адрес закэширован браузерами на год).
 * Переводы uz/en/tr/zh — apps/web/src/lib/contentI18n.ts тем же коммитом.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-bodycam-case-2k-20261013.ts [--apply] */
import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { PortfolioProject } from "./models/PortfolioProject.js";

const APPLY = process.argv.includes("--apply");
const SLUG = "sistema-videonablyudeniya-na-bodikamerah-dahua";
const TEXT: [string, string][] = [
  ["Full HD-запись со звуком", "2K-запись со звуком"],
  ["(Full HD, смена работы)", "(2K, смена работы)"],
];
const OLD_IMG = "https://api.satsolutions.uz/uploads/portfolio/bodycam-architecture.webp";
const NEW_IMG = "https://api.satsolutions.uz/uploads/portfolio/bodycam-architecture-2k.webp";

async function main() {
  initModels();
  await connectDb();
  const p: any = await PortfolioProject.findOne({ where: { slug: SLUG } });
  if (!p) { console.log("✗ кейс не найден"); process.exit(1); }
  const changes: Record<string, any> = {};
  for (const field of ["content", "equipmentSupply", "excerpt", "seoDescription", "clientTasks"]) {
    const v: string | null = p[field];
    if (!v) continue;
    let nv = v;
    for (const [a, b] of TEXT) nv = nv.split(a).join(b);
    if (nv !== v) changes[field] = nv;
  }
  const gal: string[] = p.galleryImageUrls ?? [];
  const ng = gal.map((u) => (u === OLD_IMG ? NEW_IMG : u));
  if (JSON.stringify(ng) !== JSON.stringify(gal)) changes.galleryImageUrls = ng;
  if (!Object.keys(changes).length) { console.log("= уже так"); process.exit(0); }
  for (const [k, v] of Object.entries(changes)) {
    if (k === "galleryImageUrls") console.log(`${k}:\n  было  ${gal.join(" | ")}\n  стало ${(v as string[]).join(" | ")}`);
    else for (const [a, b] of TEXT) if ((p[k] as string).includes(a)) console.log(`${k}: «${a}» → «${b}»`);
  }
  const left = Object.values(changes).some((v) => typeof v === "string" && /Full ?HD/.test(v));
  if (left) console.log("⚠ в изменённых полях ещё есть Full HD");
  if (APPLY) { Object.assign(p, changes); if (changes.galleryImageUrls) p.changed("galleryImageUrls", true); await p.save(); console.log("ЗАПИСАНО"); }
  else console.log("Сухой прогон");
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
