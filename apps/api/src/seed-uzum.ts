import "dotenv/config";
import { connectDb } from "./db.js";
import { initModels } from "./models/index.js";
import { PortfolioProject } from "./models/PortfolioProject.js";
import { PortfolioCategory } from "./models/PortfolioCategory.js";
import { Brand } from "./models/Brand.js";

const API = "https://api.satsolutions.uz";
const SLUG = "uzum-videonablyudenie-skladov-i-punktov-vydachi";

async function main() {
  initModels();
  await connectDb();

  // 1) Логотип бренда «Сибирский Арсенал»
  const brand = await Brand.findOne({ where: { slug: "sibirskiy-arsenal" } });
  if (brand) {
    brand.logoImageUrl = `${API}/uploads/brands/sibirskiy-arsenal-std.png?v=1`;
    await brand.save();
    console.log("[uzum-seed] brand logo set ->", brand.logoImageUrl);
  } else {
    console.log("[uzum-seed] WARN: brand sibirskiy-arsenal not found");
  }

  // 2) Кейс портфолио Uzum
  const cat = await PortfolioCategory.findOne({ where: { slug: "videonablyudenie" } });

  const fields = {
    title: "Uzum — видеонаблюдение на складах и в пунктах выдачи",
    excerpt:
      "Видеонаблюдение для маркетплейса Uzum: центральные склады в Ташкенте площадью более 1000 м² и сеть из 100+ пунктов выдачи по всему Узбекистану. Оборудование Dahua, работы под ключ — монтаж, СКС, пусконаладка и удалённый мониторинг.",
    content:
      "Для экосистемы Uzum — крупнейшего маркетплейса Узбекистана — специалисты SAT Solutions развернули систему видеонаблюдения на ключевых логистических объектах: центральных складах в Ташкенте площадью более 1000 м² и в сети из более чем 100 пунктов выдачи заказов по всему Узбекистану.\n\nВ рамках проекта выполнено:\n\nподбор и поставка оборудования Dahua;\nмонтаж IP-камер на складах — контроль зон приёмки, хранения и отгрузки;\nоснащение видеонаблюдением пунктов выдачи заказов в городах по всей стране;\nпрокладка структурированных кабельных сетей (СКС);\nустановка и настройка сетевых видеорегистраторов (NVR) и хранилища;\nпусконаладка системы и настройка удалённого доступа и мониторинга;\nобучение персонала работе с системой.\n\nРеализованное решение обеспечило сохранность товара на складах, контроль операций приёмки и отгрузки, а также прозрачный централизованный мониторинг всей сети пунктов выдачи 24/7.",
    clientName: "Uzum",
    clientTasks:
      "Видеонаблюдение на складах и в 100+ пунктах выдачи; оборудование Dahua; монтаж, СКС, пусконаладка, удалённый мониторинг.",
    location: "Ташкент",
    portfolioCategoryId: cat ? cat.id : null,
    coverImageUrl: `${API}/uploads/portfolio/${SLUG}-cover.jpg?v=1`,
    galleryImageUrls: [
      `${API}/uploads/images/uzum-pvz.webp`,
      `${API}/uploads/images/uzum-monitoring.webp`,
      `${API}/uploads/images/uzum-sklad.webp`,
    ],
    published: true,
  };

  const existing = await PortfolioProject.findOne({ where: { slug: SLUG } });
  if (existing) {
    await existing.update(fields);
    console.log("[uzum-seed] portfolio project UPDATED:", SLUG);
  } else {
    await PortfolioProject.create({
      slug: SLUG,
      ...fields,
      publishedAt: new Date(),
      sortOrder: 0,
    } as any);
    console.log("[uzum-seed] portfolio project CREATED:", SLUG);
  }

  console.log("[uzum-seed] category:", cat ? `${cat.slug} (${cat.id})` : "none");
  process.exit(0);
}

main().catch((e) => {
  console.error("[uzum-seed] FAILED:", e);
  process.exit(1);
});
