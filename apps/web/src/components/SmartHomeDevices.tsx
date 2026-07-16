import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { getProducts } from "@/lib/api";
import { localizeProductName } from "@/lib/productI18n";
import { resolveImageUrl } from "@/lib/image";

// Витрина устройств Tuya на странице «Умный дом»: живые товары каталога с фото
// и перелинковкой на карточки (SEO). Кураторский список по slug — стабильные
// представители групп: шторы, замки, камеры, датчики, розетки, климат, хабы.
const GROUPS: { key: string; slugs: string[] }[] = [
  { key: "curtains", slugs: ["pxt-pst-ysmt750", "pxt-pst-wf-ec", "pxt-pst-ms104"] },
  { key: "locks", slugs: ["pxt-pst-hr04", "pxt-pst-hg200"] },
  { key: "cameras", slugs: ["pxt-pst-9620-g1", "pxt-pst-st-382", "pxt-pst-twk08bm"] },
  { key: "sensors", slugs: ["pxt-pst-s09", "pxt-pst-zb-s1", "pxt-pst-wsa01"] },
  { key: "power", slugs: ["pxt-pst-ps-1606", "pxt-pst-zeu-003", "pxt-pst-wf-ed"] },
  { key: "climate", slugs: ["pxt-pst-6000-wifi", "pxt-pst-fm400", "pxt-pst-wf-ef"] },
  { key: "hubs", slugs: ["pxt-pst-z1", "pxt-pst-tyzbg-01", "pxt-pst-zmai-90"] },
];

export async function SmartHomeDevices() {
  const locale = await getLocale();
  const ts = await getTranslations("services");
  let items: any[] = [];
  try {
    const r = await getProducts(1, 60, { brand: "tuya" });
    items = r.items || [];
  } catch {
    return null; // API недоступен — блок просто не показываем
  }
  const bySlug = new Map(items.map((p: any) => [p.slug, p]));

  return (
    <div className="mt-12">
      <p className="text-xs font-black uppercase tracking-widest text-brand-600">{ts("smarthome.details.devicesLabel")}</p>
      <h2 className="mt-1 text-xl sm:text-2xl font-black tracking-tight text-slate-900">{ts("smarthome.details.devicesTitle")}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{ts("smarthome.details.devicesText")}</p>

      <div className="mt-6 space-y-8">
        {GROUPS.map((g) => {
          const products = g.slugs.map((s) => bySlug.get(s)).filter(Boolean);
          if (!products.length) return null;
          return (
            <div key={g.key}>
              <h3 className="text-base font-black tracking-tight text-slate-900">{ts(`smarthome.details.groups.${g.key}`)}</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {products.map((p: any) => {
                  const img = resolveImageUrl(p.coverImageUrl);
                  const name = localizeProductName(p, locale);
                  return (
                    <Link
                      key={p.slug}
                      href={`/products/${p.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
                    >
                      <div className="relative aspect-square bg-white p-2">
                        {img ? (
                          <Image src={img} alt={name} fill sizes="(max-width:640px) 50vw, 220px" className="object-contain p-2" unoptimized />
                        ) : null}
                      </div>
                      <div className="border-t border-slate-100 p-3">
                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-slate-800 group-hover:text-brand-700">{name}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <Link href="/catalog/tuya" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:border-brand-500 hover:text-brand-700">
          {ts("smarthome.details.allDevices")} →
        </Link>
      </div>
    </div>
  );
}
