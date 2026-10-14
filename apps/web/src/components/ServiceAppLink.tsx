// Врезка «наше приложение» на страницах услуг: домофония и СКУД → SAT Uy,
// учёт рабочего времени → SAT Davomat, въезд и парковки → SAT Parking (рядом с SAT Uy, решение
// владельца 14.10.2026). Даёт страницам приложений входящие ссылки по теме.
import { Link } from "@/i18n/navigation";

type Card = { href: "/apps/uy" | "/apps/davomat" | "/apps/parking"; title: string; text: string; link: string };

const UY_KEYS = new Set(["intercom", "access", "barrier", "locks", "residential", "intellektualnoe-upravlenie-parkingom", "parking"]);
const DAVOMAT_KEYS = new Set(["attendance", "turnstile"]);
const PARKING_KEYS = new Set(["barrier", "anpr", "parking", "intellektualnoe-upravlenie-parkingom"]);

const T: Record<string, { uy: Card; davomat: Card; parking: Card }> = {
  ru: {
    uy: { href: "/apps/uy", title: "Наше приложение SAT Uy", text: "К этой системе подключается приложение для жителей: подъезд и шлагбаум с телефона, гости по QR-коду, заявки в УК и счёт за месяц.", link: "Посмотреть SAT Uy" },
    davomat: { href: "/apps/davomat", title: "Наша программа SAT Davomat", text: "К терминалам подключается учёт рабочего времени: табель по сотрудникам, опоздания и переработки, выгрузка в 1С.", link: "Посмотреть SAT Davomat" },
    parking: { href: "/apps/parking", title: "Наша программа SAT Parking", text: "Платная парковка без кассира: камера читает номер, шлагбаум открывается сам, на выезде оплата через Payme или Click по QR-коду. Владелец видит выручку и журнал проездов в своём кабинете.", link: "Узнать о SAT Parking" },
  },
  uz: {
    uy: { href: "/apps/uy", title: "Bizning SAT Uy ilovamiz", text: "Bu tizimga aholi uchun ilova ulanadi: yoʻlak va shlagbaum telefondan, mehmonlar QR orqali, BKga arizalar va oylik hisob.", link: "SAT Uyni koʻrish" },
    davomat: { href: "/apps/davomat", title: "Bizning SAT Davomat dasturimiz", text: "Terminallarga ish vaqti hisobi ulanadi: xodimlar boʻyicha tabel, kechikish va ortiqcha ish, 1Cga yuklash.", link: "SAT Davomatni koʻrish" },
    parking: { href: "/apps/parking", title: "Bizning SAT Parking dasturimiz", text: "Kassirsiz pullik avtoturargoh: kamera raqamni oʻqiydi, shlagbaum oʻzi ochiladi, chiqishda QR-kod orqali Payme yoki Click bilan toʻlov. Egasi tushum va oʻtishlar jurnalini oʻz kabinetida koʻradi.", link: "SAT Parking haqida" },
  },
  en: {
    uy: { href: "/apps/uy", title: "Our SAT Uy app", text: "This system connects to the resident app: entrance and barrier from a phone, guests by QR code, requests to the management company and the monthly bill.", link: "See SAT Uy" },
    davomat: { href: "/apps/davomat", title: "Our SAT Davomat software", text: "Terminals connect to time tracking: per-employee timesheets, late arrivals and overtime, export to 1C.", link: "See SAT Davomat" },
    parking: { href: "/apps/parking", title: "Our SAT Parking software", text: "Paid parking without a cashier: a camera reads the plate, the barrier opens by itself, and drivers pay at the exit with Payme or Click via a QR code. The owner sees revenue and the pass log in their dashboard.", link: "About SAT Parking" },
  },
  tr: {
    uy: { href: "/apps/uy", title: "SAT Uy uygulamamız", text: "Bu sisteme sakin uygulaması bağlanır: kapı ve bariyer telefondan, misafirler QR ile, yönetime talepler ve aylık fatura.", link: "SAT Uy’u inceleyin" },
    davomat: { href: "/apps/davomat", title: "SAT Davomat yazılımımız", text: "Terminaller mesai takibine bağlanır: personel puantajı, geç kalma ve fazla mesai, 1C aktarımı.", link: "SAT Davomat’ı inceleyin" },
    parking: { href: "/apps/parking", title: "SAT Parking yazılımımız", text: "Kasiyersiz ücretli otopark: kamera plakayı okur, bariyer kendiliğinden açılır, çıkışta QR kodla Payme veya Click ile ödeme. Sahibi geliri ve geçiş kaydını kendi panelinde görür.", link: "SAT Parking’i inceleyin" },
  },
  zh: {
    uy: { href: "/apps/uy", title: "我们的 SAT Uy 应用", text: "该系统可接入住户应用：手机开单元门与道闸、访客二维码、向物业报修以及月度账单。", link: "查看 SAT Uy" },
    davomat: { href: "/apps/davomat", title: "我们的 SAT Davomat 软件", text: "终端可接入考勤管理：按员工统计考勤、迟到与加班、导出到 1C。", link: "查看 SAT Davomat" },
    parking: { href: "/apps/parking", title: "我们的 SAT Parking 软件", text: "无人收费停车场：摄像机识别车牌，道闸自动抬杆，出口扫码用 Payme 或 Click 支付。业主在后台查看收入和通行记录。", link: "了解 SAT Parking" },
  },
};

export function ServiceAppLink({ serviceKey, locale }: { serviceKey: string; locale: string }) {
  const kinds = [
    UY_KEYS.has(serviceKey) ? "uy" : DAVOMAT_KEYS.has(serviceKey) ? "davomat" : null,
    PARKING_KEYS.has(serviceKey) ? "parking" : null,
  ].filter((k): k is "uy" | "davomat" | "parking" => Boolean(k));
  if (!kinds.length) return null;
  const t = T[locale] ?? T.ru;
  return (
    <div className={`mt-12 grid gap-5 ${kinds.length > 1 ? "md:grid-cols-2" : ""}`}>
      {kinds.map((k) => {
        const c = t[k];
        return (
          <section key={k} className="flex flex-col items-start rounded-2xl border border-brand-100 bg-brand-50 p-6 sm:p-8">
            <div className="text-lg font-bold text-slate-900">{c.title}</div>
            {/* flex-1: при двух карточках рядом кнопки стоят на одной линии */}
            <p className="mt-2 max-w-3xl flex-1 text-sm leading-relaxed text-slate-600">{c.text}</p>
            <Link href={c.href} className="mt-4 inline-flex items-center rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
              {c.link}
            </Link>
          </section>
        );
      })}
    </div>
  );
}
