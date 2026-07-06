import type { Metadata } from "next";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

// Правила возврата и обмена — сервисная страница (требуется Google Merchant Center).
// Инлайн-словарь по образцу /international: страница самодостаточна, без общих json.
const D: Record<string, {
  title: string; metaDesc: string; h1: string; intro: string;
  sections: { h: string; items: string[] }[]; contact: string;
}> = {
  ru: {
    title: "Возврат и обмен товара — SAT Solutions",
    metaDesc: "Правила возврата и обмена товаров SAT Solutions: 14 дней на возврат, обмен при браке, гарантийное обслуживание. Ташкент, Узбекистан.",
    h1: "Возврат и обмен товара",
    intro: "Мы работаем в соответствии с Законом Республики Узбекистан «О защите прав потребителей» и предоставляем следующие условия возврата и обмена.",
    sections: [
      { h: "Возврат товара надлежащего качества", items: [
        "Товар можно вернуть или обменять в течение 14 календарных дней с момента покупки.",
        "Товар не был в эксплуатации, сохранены заводская упаковка, комплектация, пломбы и товарный вид.",
        "При себе необходимо иметь документ, подтверждающий покупку (чек, накладная, счёт-фактура).",
        "Возврат денежных средств осуществляется тем же способом, которым была произведена оплата, в течение 10 рабочих дней.",
      ]},
      { h: "Возврат и обмен товара с браком", items: [
        "При обнаружении заводского брака товар обменивается на аналогичный или принимается к возврату в течение гарантийного срока.",
        "Диагностика неисправности проводится нашим сервисным центром в Ташкенте.",
        "Расходы по замене бракованного товара несёт SAT Solutions.",
      ]},
      { h: "Гарантия", items: [
        "На всё оборудование действует гарантия производителя (обычно 12–24 месяца — указана в карточке товара и гарантийном талоне).",
        "Гарантийное и постгарантийное обслуживание выполняется нашим сервисным центром.",
      ]},
      { h: "Как оформить возврат", items: [
        "Свяжитесь с нами по телефону +998 99 554-69-69 (звонок, Telegram, WhatsApp) или по почте sales@satsolutions.uz.",
        "Привезите товар по адресу: г. Ташкент, ул. Катта Дархон, 5 (Пн–Сб 09:00–18:00) или согласуйте забор курьером.",
      ]},
    ],
    contact: "Вопросы по возврату: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  uz: {
    title: "Tovarni qaytarish va almashtirish — SAT Solutions",
    metaDesc: "SAT Solutions tovarlarni qaytarish va almashtirish qoidalari: 14 kun ichida qaytarish, nuqsonli tovarni almashtirish, kafolat xizmati. Toshkent.",
    h1: "Tovarni qaytarish va almashtirish",
    intro: "Biz O'zbekiston Respublikasining «Iste'molchilarning huquqlarini himoya qilish to'g'risida»gi qonuniga muvofiq ishlaymiz va quyidagi qaytarish shartlarini taqdim etamiz.",
    sections: [
      { h: "Sifatli tovarni qaytarish", items: [
        "Tovarni xarid qilingan kundan boshlab 14 kalendar kun ichida qaytarish yoki almashtirish mumkin.",
        "Tovar ishlatilmagan, zavod qadoqlari, butlash, plombalar va tovar ko'rinishi saqlangan bo'lishi kerak.",
        "Xaridni tasdiqlovchi hujjat (chek, yuk xati, hisob-faktura) bo'lishi zarur.",
        "Pul mablag'lari to'lov amalga oshirilgan usulda 10 ish kuni ichida qaytariladi.",
      ]},
      { h: "Nuqsonli tovarni qaytarish va almashtirish", items: [
        "Zavod nuqsoni aniqlansa, tovar kafolat muddati ichida xuddi shunday tovarga almashtiriladi yoki qaytarib olinadi.",
        "Nosozlik diagnostikasi Toshkentdagi servis markazimizda o'tkaziladi.",
        "Nuqsonli tovarni almashtirish xarajatlarini SAT Solutions o'z zimmasiga oladi.",
      ]},
      { h: "Kafolat", items: [
        "Barcha uskunalarga ishlab chiqaruvchi kafolati amal qiladi (odatda 12–24 oy — tovar kartochkasida va kafolat talonida ko'rsatilgan).",
        "Kafolat va kafolatdan keyingi xizmat servis markazimizda bajariladi.",
      ]},
      { h: "Qaytarishni qanday rasmiylashtirish", items: [
        "Biz bilan bog'laning: +998 99 554-69-69 (qo'ng'iroq, Telegram, WhatsApp) yoki sales@satsolutions.uz.",
        "Tovarni manzilga olib keling: Toshkent sh., Katta Darxon ko'chasi, 5 (Du–Sha 09:00–18:00) yoki kuryer olib ketishini kelishing.",
      ]},
    ],
    contact: "Qaytarish bo'yicha savollar: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  en: {
    title: "Returns & Exchange Policy — SAT Solutions",
    metaDesc: "SAT Solutions return and exchange policy: 14-day returns, defective item exchange, warranty service. Tashkent, Uzbekistan.",
    h1: "Returns & Exchange Policy",
    intro: "We operate in accordance with the Consumer Protection Law of the Republic of Uzbekistan and offer the following return and exchange terms.",
    sections: [
      { h: "Returning items in original condition", items: [
        "Items can be returned or exchanged within 14 calendar days of purchase.",
        "The item must be unused, with original packaging, accessories, seals and presentation preserved.",
        "Proof of purchase is required (receipt, delivery note or invoice).",
        "Refunds are issued via the original payment method within 10 business days.",
      ]},
      { h: "Defective items", items: [
        "Items with manufacturing defects are exchanged or refunded within the warranty period.",
        "Fault diagnostics are performed by our service centre in Tashkent.",
        "SAT Solutions covers the costs of replacing defective items.",
      ]},
      { h: "Warranty", items: [
        "All equipment carries the manufacturer's warranty (typically 12–24 months — stated on the product page and warranty card).",
        "Warranty and post-warranty service is provided by our service centre.",
      ]},
      { h: "How to request a return", items: [
        "Contact us at +998 99 554-69-69 (call, Telegram, WhatsApp) or sales@satsolutions.uz.",
        "Bring the item to: 5 Katta Darxon street, Tashkent (Mon–Sat 9:00–18:00) or arrange courier pickup.",
      ]},
    ],
    contact: "Return enquiries: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  tr: {
    title: "İade ve Değişim Koşulları — SAT Solutions",
    metaDesc: "SAT Solutions iade ve değişim koşulları: 14 gün içinde iade, kusurlu ürün değişimi, garanti servisi. Taşkent, Özbekistan.",
    h1: "İade ve Değişim Koşulları",
    intro: "Özbekistan Cumhuriyeti Tüketici Haklarını Koruma Kanunu'na uygun olarak çalışıyor ve aşağıdaki iade ve değişim koşullarını sunuyoruz.",
    sections: [
      { h: "Kusursuz ürünlerin iadesi", items: [
        "Ürünler satın alma tarihinden itibaren 14 takvim günü içinde iade veya değişim yapılabilir.",
        "Ürün kullanılmamış olmalı; orijinal ambalaj, aksesuarlar, mühürler ve görünüm korunmalıdır.",
        "Satın alma belgesi gereklidir (fiş, irsaliye veya fatura).",
        "Ücret iadesi, ödemenin yapıldığı yöntemle 10 iş günü içinde gerçekleştirilir.",
      ]},
      { h: "Kusurlu ürünler", items: [
        "Üretim hatası tespit edilen ürünler garanti süresi içinde değiştirilir veya iade alınır.",
        "Arıza tespiti Taşkent'teki servis merkezimizde yapılır.",
        "Kusurlu ürün değişim masrafları SAT Solutions'a aittir.",
      ]},
      { h: "Garanti", items: [
        "Tüm ekipmanlar üretici garantisi kapsamındadır (genellikle 12–24 ay — ürün sayfasında ve garanti belgesinde belirtilir).",
        "Garanti ve garanti sonrası servis, servis merkezimiz tarafından sağlanır.",
      ]},
      { h: "İade talebi nasıl yapılır", items: [
        "Bize ulaşın: +998 99 554-69-69 (arama, Telegram, WhatsApp) veya sales@satsolutions.uz.",
        "Ürünü adresimize getirin: Katta Darxon caddesi 5, Taşkent (Pzt–Cmt 09:00–18:00) veya kurye ile teslim alınmasını ayarlayın.",
      ]},
    ],
    contact: "İade soruları: +998 99 554-69-69 · sales@satsolutions.uz",
  },
  zh: {
    title: "退换货政策 — SAT Solutions",
    metaDesc: "SAT Solutions 退换货政策：14天内退货，瑕疵产品换货，保修服务。乌兹别克斯坦塔什干。",
    h1: "退换货政策",
    intro: "我们依据乌兹别克斯坦共和国《消费者权益保护法》开展经营，并提供以下退换货条款。",
    sections: [
      { h: "无质量问题商品的退货", items: [
        "商品可在购买之日起14个日历日内退货或换货。",
        "商品须未经使用，并保留原厂包装、配件、封条及外观。",
        "需提供购买凭证（收据、送货单或发票）。",
        "退款将通过原支付方式在10个工作日内退回。",
      ]},
      { h: "瑕疵商品的退换", items: [
        "发现制造缺陷的商品，在保修期内可换货或退货。",
        "故障检测由我们位于塔什干的服务中心进行。",
        "瑕疵商品的更换费用由 SAT Solutions 承担。",
      ]},
      { h: "保修", items: [
        "所有设备均享有制造商保修（通常为12–24个月，详见产品页面及保修卡）。",
        "保修及保修后服务由我们的服务中心提供。",
      ]},
      { h: "如何申请退货", items: [
        "请联系我们：+998 99 554-69-69（电话、Telegram、WhatsApp）或 sales@satsolutions.uz。",
        "将商品送至：塔什干市 Katta Darxon 街5号（周一至周六 9:00–18:00），或安排快递取件。",
      ]},
    ],
    contact: "退货咨询：+998 99 554-69-69 · sales@satsolutions.uz",
  },
};

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = D[locale] ?? D.ru;
  return {
    title: d.title,
    description: d.metaDesc,
    alternates: hreflangAlternates("/returns", locale),
    openGraph: { title: d.title, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function ReturnsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const d = D[locale] ?? D.ru;
  return (
    <div className="container-page py-10">
      <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{d.h1}</h1>
      <p className="mt-4 max-w-3xl text-slate-600 leading-relaxed">{d.intro}</p>
      <div className="mt-8 flex flex-col gap-8 max-w-3xl">
        {d.sections.map((s) => (
          <section key={s.h}>
            <h2 className="text-lg font-bold text-slate-950">{s.h}</h2>
            <ul className="mt-3 flex flex-col gap-2 list-disc pl-5 text-slate-700 leading-relaxed">
              {s.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-10 text-sm font-semibold text-slate-500">{d.contact}</p>
    </div>
  );
}
