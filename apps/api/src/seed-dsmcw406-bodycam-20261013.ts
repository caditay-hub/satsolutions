/* Нательная камера Hikvision DS-MCW406/64G/GPS/WIFI (slug hik-ds-mcw406-64g-gps-wifi) — слова спроса
 * в названии и SEO-полях: «боди-камера / бодикамера / нательный (нагрудный) видеорегистратор».
 * До правки ни в name, ни в seoTitle, ни в описании этих слов не было, и по «бодикамера» карточка
 * не показывалась (разбор 13.10.2026, план органики О7, «да» владельца на план).
 * Меняются RU-поля: name, shortDescription, первое предложение description, seoTitle, seoDescription.
 * seoTitle без цены (правило проекта: цена уезжает при переоценке, живой хвост добавляет страница).
 * Переводы uz/en/tr/zh — в apps/web/src/data/productI18n.json, SEO на 5 языках — в
 * apps/web/src/data/productSeoI18n.json (блок i18n в JSON — справочно, сид его не пишет). Slug не меняется.
 * Данные и прежние значения — seed-dsmcw406-bodycam-20261013.json; --rollback возвращает их.
 * Сухой прогон по умолчанию, запись только с --apply. Идемпотентно.
 * Запуск: cd /var/www/satweb/apps/api && npx tsx src/seed-dsmcw406-bodycam-20261013.ts [--apply] [--rollback] */
import "dotenv/config";
import { readFileSync } from "node:fs";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { Product } from "./models/Product.js";

const APPLY = process.argv.includes("--apply");
const ROLLBACK = process.argv.includes("--rollback");
type Fields = Record<string, string | null>;
// JSON рядом со скриптом (пакет apps/api — ESM, как в seed-hik-new-20261009.ts): не зависит от cwd
const MAP: Record<string, { slug: string; set: Fields; old: Fields }> = JSON.parse(
  readFileSync(new URL("./seed-dsmcw406-bodycam-20261013.json", import.meta.url), "utf8"),
);
// Поля без защиты «на проде уже не то»: SEO-поля переписываем целиком в любом случае
const FREE = ["seoTitle", "seoDescription"];
const show = (f: string, v: string | null) => (f === "description" ? `${String(v ?? "").length} симв., начало «${String(v ?? "").slice(0, 90)}…»` : `«${v ?? "—"}»`);

async function main() {
  initModels();
  await connectDb();
  let todo = 0, fields = 0;
  for (const [id, e] of Object.entries(MAP)) {
    const p: any = await Product.findByPk(id);
    if (!p) { console.log(`✗ ${e.slug}: НЕ НАЙДЕН`); continue; }
    if (p.slug !== e.slug) { console.log(`✗ ${id}: slug на проде «${p.slug}», ожидали «${e.slug}» — пропускаю`); continue; }
    const target = ROLLBACK ? e.old : e.set;
    // защита: поле должно совпадать с исходным состоянием — при прямом прогоне с тем, что было
    // при подготовке сида, при откате с тем, что записал сид (иначе откат затрёт позднюю правку)
    const expect = ROLLBACK ? e.set : e.old;
    const diff: string[] = [];
    for (const [f, v] of Object.entries(target)) {
      const now = p[f] ?? null;
      if (now === (v ?? null)) continue;
      if (f in expect && now !== (expect[f] ?? null) && !FREE.includes(f)) {
        console.log(`✗ ${e.slug}.${f}: на проде уже не то, что ожидалось — пропускаю поле`);
        continue;
      }
      diff.push(`  ${f}:\n    было  ${show(f, now)}\n    стало ${show(f, v)}`);
      p[f] = v;
    }
    if (!diff.length) { console.log(`= ${e.slug}: уже так`); continue; }
    console.log(`${e.slug}\n${diff.join("\n")}`);
    todo++; fields += diff.length;
    if (APPLY) await p.save();
  }
  console.log(`\n${APPLY ? "ЗАПИСАНО" : "Сухой прогон, будет изменено"}: ${todo} товаров, ${fields} полей${ROLLBACK ? " (откат)" : ""}`);
  process.exit(0);
}
main().catch((e) => { console.error("ОШИБКА", e); process.exit(1); });
