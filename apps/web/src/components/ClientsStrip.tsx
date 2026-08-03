import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

/**
 * Полоса «Среди наших заказчиков» для B2B-страниц.
 * Пока показываем названия набором (согласовано 03.08.2026: названия + логотипы).
 * Как только появятся файлы логотипов в uploads/clients/<key>.svg — достаточно
 * проставить logo у нужной записи, разметка уже это поддерживает.
 */
const LOGO_BASE = "https://api.satsolutions.uz/uploads/clients";

type Client = { key: string; name: string; note: string; href?: string; logo?: string };

const CLIENTS: Client[] = [
  { key: "uzum", name: "Uzum", note: "склады и 100+ пунктов выдачи", href: "/portfolio/uzum-videonablyudenie-skladov-i-punktov-vydachi", logo: "uzum.png" },
  { key: "ucell", name: "Ucell", note: "видеостена ситуационного центра", href: "/portfolio/ucell-ustanovka-videosteny-dahua-v-situacionnom-centre", logo: "ucell.svg" },
  { key: "damira", name: "Damira Beverages", note: "завод: СКУД и 67 км трасс", href: "/portfolio/skud-zavod-damira-beverages", logo: "damira.png" },
  { key: "towerup", name: "ЖК Tower Up", note: "безопасность жилого комплекса", href: "/portfolio/zhk-tower-up-intellektualnaya-sistema-bezopasnosti-i-videomonitoringa", logo: "towerup.png" },
  { key: "streetparking", name: "StreetParking", note: "видеонаблюдение на бодикамерах", href: "/portfolio/sistema-videonablyudeniya-na-bodikamerah-dahua", logo: "streetparking.png" },
  { key: "granit", name: "Granit", note: "48 камер Dahua и СКУД", logo: "granit.png" },
  { key: "gov", name: "Госорганизации", note: "объекты по гособеспечению" },
];

export async function ClientsStrip({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "clients" });
  return (
    <section className="mt-14">
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">{t("title")}</h2>
      <p className="mt-1.5 text-sm text-slate-600">{t("subtitle")}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CLIENTS.map((c) => {
          const inner = (
            <div className="flex h-full items-center gap-3 rounded-xl bg-white px-4 py-3.5 ring-1 ring-slate-200 transition-shadow hover:shadow-md">
              {c.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <span className="flex h-9 w-[130px] shrink-0 items-center"><img src={`${LOGO_BASE}/${c.logo}`} alt={c.name} className="max-h-8 w-auto max-w-full object-contain object-left" /></span>
              ) : (
                <span className="text-base font-black text-slate-800">{c.name}</span>
              )}
              <span className="ml-auto text-right text-[12px] leading-tight text-slate-500">{c.note}</span>
            </div>
          );
          return c.href ? (
            <Link key={c.key} href={c.href} className="block">{inner}</Link>
          ) : (
            <div key={c.key}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}
