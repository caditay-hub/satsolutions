// Экстрактор данных 44 страниц услуг для макетов (read-only).
// Запуск из apps/web:  npx tsx ../../docs/mockups/src/extract_pages.ts ../../docs/mockups/src/pages.json
import { ALL_SERVICES, SERVICE_FAQ } from "../../../apps/web/src/lib/servicesData";
import { getServiceContent } from "../../../apps/web/src/lib/serviceContent";
import { getServiceSeo } from "../../../apps/web/src/lib/serviceSeo";
import { servicePrices } from "../../../apps/web/src/lib/servicePrices";
import { getIndustryDetails, INDUSTRY_SERVICES } from "../../../apps/web/src/lib/industryDetails";
import { articlesForService } from "../../../apps/web/src/lib/articlesData";
import { KITS } from "../../../apps/web/src/lib/kitsData";
import ru from "../../../apps/web/messages/ru.json";
import * as fs from "fs";

const out: any[] = [];
for (const s of ALL_SERVICES) {
  const m: any = (ru as any).services?.[s.key] ?? {};
  const kitsPrices = KITS.filter((k) => k.relatedService === s.key).map((k) => k.priceFrom);
  out.push({
    key: s.key, group: s.group, title: s.title, desc: s.desc,
    intro: m.intro ?? (s as any).intro ?? "",
    works: m.works ?? (s as any).works ?? [],
    h1: getServiceSeo("ru", s.key)?.h1 ?? s.title,
    content: getServiceContent("ru", s.key),
    details: m.details ?? null,
    faq: SERVICE_FAQ[s.key] ?? [],
    prices: servicePrices(s.key, "ru"),
    kitsPrices,
    articles: articlesForService(s.key, "ru", 3).map((a) => ({ slug: a.slug, title: a.loc.ru?.title })),
    industry: s.group === "industry" ? getIndustryDetails("ru", s.key) : null,
    industryServices: INDUSTRY_SERVICES[s.key] ?? [],
  });
}
fs.writeFileSync(process.argv[2], JSON.stringify({ pages: out, industryStats: (ru as any).industryStats ?? null }, null, 0));
console.log("pages:", out.length);
