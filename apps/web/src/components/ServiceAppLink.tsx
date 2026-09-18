// Врезка «наше приложение» на страницах услуг: домофония и СКУД → SAT Uy,
// учёт рабочего времени → SAT Davomat. Даёт страницам приложений входящие ссылки по теме.
import { Link } from "@/i18n/navigation";

type Card = { href: "/apps/uy" | "/apps/davomat"; title: string; text: string; link: string };

const UY_KEYS = new Set(["intercom", "access", "barrier", "locks", "residential", "intellektualnoe-upravlenie-parkingom", "parking"]);
const DAVOMAT_KEYS = new Set(["attendance", "turnstile"]);

const T: Record<string, { uy: Card; davomat: Card }> = {
  ru: {
    uy: { href: "/apps/uy", title: "Наше приложение SAT Uy", text: "К этой системе подключается приложение для жителей: подъезд и шлагбаум с телефона, гости по QR-коду, заявки в УК и счёт за месяц.", link: "Посмотреть SAT Uy" },
    davomat: { href: "/apps/davomat", title: "Наша программа SAT Davomat", text: "К терминалам подключается учёт рабочего времени: табель по сотрудникам, опоздания и переработки, выгрузка в 1С.", link: "Посмотреть SAT Davomat" },
  },
  uz: {
    uy: { href: "/apps/uy", title: "Bizning SAT Uy ilovamiz", text: "Bu tizimga aholi uchun ilova ulanadi: yoʻlak va shlagbaum telefondan, mehmonlar QR orqali, BKga arizalar va oylik hisob.", link: "SAT Uyni koʻrish" },
    davomat: { href: "/apps/davomat", title: "Bizning SAT Davomat dasturimiz", text: "Terminallarga ish vaqti hisobi ulanadi: xodimlar boʻyicha tabel, kechikish va ortiqcha ish, 1Cga yuklash.", link: "SAT Davomatni koʻrish" },
  },
  en: {
    uy: { href: "/apps/uy", title: "Our SAT Uy app", text: "This system connects to the resident app: entrance and barrier from a phone, guests by QR code, requests to the management company and the monthly bill.", link: "See SAT Uy" },
    davomat: { href: "/apps/davomat", title: "Our SAT Davomat software", text: "Terminals connect to time tracking: per-employee timesheets, late arrivals and overtime, export to 1C.", link: "See SAT Davomat" },
  },
  tr: {
    uy: { href: "/apps/uy", title: "SAT Uy uygulamamız", text: "Bu sisteme sakin uygulaması bağlanır: kapı ve bariyer telefondan, misafirler QR ile, yönetime talepler ve aylık fatura.", link: "SAT Uy’u inceleyin" },
    davomat: { href: "/apps/davomat", title: "SAT Davomat yazılımımız", text: "Terminaller mesai takibine bağlanır: personel puantajı, geç kalma ve fazla mesai, 1C aktarımı.", link: "SAT Davomat’ı inceleyin" },
  },
  zh: {
    uy: { href: "/apps/uy", title: "我们的 SAT Uy 应用", text: "该系统可接入住户应用：手机开单元门与道闸、访客二维码、向物业报修以及月度账单。", link: "查看 SAT Uy" },
    davomat: { href: "/apps/davomat", title: "我们的 SAT Davomat 软件", text: "终端可接入考勤管理：按员工统计考勤、迟到与加班、导出到 1C。", link: "查看 SAT Davomat" },
  },
};

export function ServiceAppLink({ serviceKey, locale }: { serviceKey: string; locale: string }) {
  const kind = UY_KEYS.has(serviceKey) ? "uy" : DAVOMAT_KEYS.has(serviceKey) ? "davomat" : null;
  if (!kind) return null;
  const c = (T[locale] ?? T.ru)[kind];
  return (
    <section className="mt-12 rounded-2xl border border-brand-100 bg-brand-50 p-6 sm:p-8">
      <div className="text-lg font-bold text-slate-900">{c.title}</div>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">{c.text}</p>
      <Link href={c.href} className="mt-4 inline-flex items-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
        {c.link}
      </Link>
    </section>
  );
}
