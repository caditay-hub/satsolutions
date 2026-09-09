import type { Metadata } from "next";
import { hreflangAlternates } from "@/lib/hreflang";
import { ogLocale } from "@/lib/ogLocale";

// Доставка и оплата — сервисная страница (требование Google Merchant Center:
// прозрачный процесс покупки). Инлайн-словарь по образцу /returns.
const D: Record<string, {
  title: string; metaDesc: string; h1: string; intro: string;
  sections: { h: string; items: string[] }[]; contact: string;
}> = {
  ru: {
    title: "Доставка и оплата",
    metaDesc: "Условия доставки и оплаты SAT Solutions: доставка по Ташкенту и Узбекистану, оплата по счёту или при получении, без предоплаты. Заказ на сайте за 1 минуту.",
    h1: "Доставка и оплата",
    intro: "Заказать оборудование можно прямо на сайте: нажмите «Заказать» на странице товара, укажите количество и телефон — менеджер свяжется с вами для подтверждения в рабочее время (Пн–Пт 9:00–18:00).",
    sections: [
      { h: "Как оформить заказ", items: [
        "Нажмите кнопку «Заказать» на странице товара, укажите количество, имя и телефон.",
        "После отправки вы получите номер заказа, а менеджер перезвонит для подтверждения наличия, цены и сроков.",
        "Для юридических лиц выставляем счёт-фактуру; по запросу подготовим коммерческое предложение.",
      ]},
      { h: "Доставка", items: [
        "По Ташкенту — курьером, обычно 1–2 рабочих дня после подтверждения заказа.",
        "По Узбекистану — транспортными службами, обычно 2–5 рабочих дней.",
        "Самовывоз — г. Ташкент, ул. Катта Дархон, 5 (Пн–Пт 9:00–18:00), бесплатно.",
        "Стоимость доставки зависит от габаритов и региона — менеджер сообщит её при подтверждении заказа.",
      ]},
      { h: "Оплата", items: [
        "Перечислением по счёту — для юридических лиц и ИП (основной способ для B2B).",
        "Наличными или картой при получении — для физических лиц.",
        "Предоплата на сайте не требуется: вы платите после подтверждения заказа менеджером.",
        "Все цены на сайте указаны в сумах (UZS), включая НДС.",
      ]},
      { h: "Монтаж и гарантия", items: [
        "По желанию выполним профессиональный монтаж и настройку купленного оборудования — рассчитаем в том же заказе.",
        "На всё оборудование действует гарантия производителя (от 1 года); условия возврата — на странице «Возврат и обмен».",
      ]},
    ],
    contact: "Вопросы по доставке: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  uz: {
    title: "Yetkazib berish va toʻlov",
    metaDesc: "SAT Solutions yetkazib berish va toʻlov shartlari: Toshkent va Oʻzbekiston boʻylab yetkazib berish, hisob orqali yoki qabul qilishda toʻlov, oldindan toʻlovsiz.",
    h1: "Yetkazib berish va toʻlov",
    intro: "Uskunani toʻgʻridan-toʻgʻri saytda buyurtma qilishingiz mumkin: tovar sahifasida «Buyurtma berish» tugmasini bosing, miqdor va telefonni koʻrsating — menejer ish vaqtida (Du–Ju 9:00–18:00) tasdiqlash uchun bogʻlanadi.",
    sections: [
      { h: "Buyurtmani qanday rasmiylashtirish", items: [
        "Tovar sahifasida «Buyurtma berish» tugmasini bosing, miqdor, ism va telefonni kiriting.",
        "Yuborilgandan soʻng buyurtma raqamini olasiz, menejer mavjudlik, narx va muddatlarni tasdiqlash uchun qoʻngʻiroq qiladi.",
        "Yuridik shaxslar uchun hisob-faktura taqdim etamiz; soʻrov boʻyicha tijoriy taklif tayyorlaymiz.",
      ]},
      { h: "Yetkazib berish", items: [
        "Toshkent boʻylab — kuryer orqali, odatda tasdiqlashdan keyin 1–2 ish kuni.",
        "Oʻzbekiston boʻylab — transport xizmatlari orqali, odatda 2–5 ish kuni.",
        "Oʻzi olib ketish — Toshkent sh., Katta Darxon koʻchasi, 5 (Du–Ju 9:00–18:00), bepul.",
        "Yetkazib berish narxi oʻlcham va hududga bogʻliq — menejer buyurtmani tasdiqlashda aytadi.",
      ]},
      { h: "Toʻlov", items: [
        "Hisob orqali pul oʻtkazish — yuridik shaxslar va YaTT uchun (B2B uchun asosiy usul).",
        "Qabul qilishda naqd yoki karta orqali — jismoniy shaxslar uchun.",
        "Saytda oldindan toʻlov talab qilinmaydi: menejer buyurtmani tasdiqlagandan keyin toʻlaysiz.",
        "Saytdagi barcha narxlar soʻmda (UZS), QQS bilan koʻrsatilgan.",
      ]},
      { h: "Montaj va kafolat", items: [
        "Xohishingizga koʻra sotib olingan uskunani professional oʻrnatish va sozlashni bajaramiz — oʻsha buyurtmada hisoblaymiz.",
        "Barcha uskunalarga ishlab chiqaruvchi kafolati amal qiladi (1 yildan); qaytarish shartlari — «Qaytarish va almashtirish» sahifasida.",
      ]},
    ],
    contact: "Yetkazib berish boʻyicha savollar: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  en: {
    title: "Delivery & Payment",
    metaDesc: "SAT Solutions delivery and payment terms: delivery across Tashkent and Uzbekistan, payment by invoice or on delivery, no prepayment. Order online in 1 minute.",
    h1: "Delivery & Payment",
    intro: "You can order equipment directly on our website: click \"Order now\" on a product page, enter the quantity and your phone number — our manager will contact you to confirm during business hours (Mon–Fri 9:00–18:00).",
    sections: [
      { h: "How to place an order", items: [
        "Click the \"Order now\" button on a product page and enter the quantity, your name and phone number.",
        "You will receive an order number, and our manager will call you to confirm availability, price and delivery time.",
        "For businesses we issue an invoice; a formal quotation is available on request.",
      ]},
      { h: "Delivery", items: [
        "Within Tashkent — by courier, usually 1–2 business days after confirmation.",
        "Across Uzbekistan — by transport companies, usually 2–5 business days.",
        "Pickup — 5 Katta Darxon street, Tashkent (Mon–Fri 9:00–18:00), free of charge.",
        "Delivery cost depends on size and region — the manager will quote it when confirming your order.",
      ]},
      { h: "Payment", items: [
        "Bank transfer by invoice — for companies and entrepreneurs (the main B2B option).",
        "Cash or card on delivery — for individuals.",
        "No online prepayment is required: you pay after the order is confirmed by our manager.",
        "All prices on the website are in Uzbek som (UZS), VAT included.",
      ]},
      { h: "Installation & warranty", items: [
        "On request we professionally install and configure the purchased equipment — quoted within the same order.",
        "All equipment carries the manufacturer's warranty (from 1 year); return terms are on the Returns & Exchange page.",
      ]},
    ],
    contact: "Delivery enquiries: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  tr: {
    title: "Teslimat ve Ödeme",
    metaDesc: "SAT Solutions teslimat ve ödeme koşulları: Taşkent ve Özbekistan geneline teslimat, fatura ile veya teslimatta ödeme, ön ödemesiz. 1 dakikada online sipariş.",
    h1: "Teslimat ve Ödeme",
    intro: "Ekipmanı doğrudan sitemizden sipariş edebilirsiniz: ürün sayfasında \"Sipariş ver\" düğmesine tıklayın, adet ve telefonunuzu girin — yöneticimiz çalışma saatleri içinde (Pzt–Cum 9:00–18:00) onay için sizi arayacaktır.",
    sections: [
      { h: "Sipariş nasıl verilir", items: [
        "Ürün sayfasındaki \"Sipariş ver\" düğmesine tıklayın; adet, ad ve telefon girin.",
        "Sipariş numaranızı alırsınız; yöneticimiz stok, fiyat ve süreyi onaylamak için arar.",
        "Tüzel kişiler için fatura düzenliyoruz; talep üzerine resmi teklif hazırlarız.",
      ]},
      { h: "Teslimat", items: [
        "Taşkent içi — kurye ile, onaydan sonra genellikle 1–2 iş günü.",
        "Özbekistan geneli — nakliye firmaları ile, genellikle 2–5 iş günü.",
        "Mağazadan teslim — Katta Darxon caddesi 5, Taşkent (Pzt–Cum 9:00–18:00), ücretsiz.",
        "Teslimat ücreti boyut ve bölgeye bağlıdır — yönetici sipariş onayında bildirir.",
      ]},
      { h: "Ödeme", items: [
        "Fatura ile havale — şirketler ve girişimciler için (temel B2B yöntemi).",
        "Teslimatta nakit veya kart — bireysel müşteriler için.",
        "Online ön ödeme gerekmez: yönetici siparişi onayladıktan sonra ödersiniz.",
        "Sitedeki tüm fiyatlar Özbek somu (UZS) cinsinden olup KDV dahildir.",
      ]},
      { h: "Kurulum ve garanti", items: [
        "İsteğe bağlı olarak satın alınan ekipmanın profesyonel kurulum ve yapılandırmasını yapıyoruz — aynı siparişte fiyatlandırılır.",
        "Tüm ekipmanlar üretici garantilidir (1 yıldan itibaren); iade koşulları İade ve Değişim sayfasındadır.",
      ]},
    ],
    contact: "Teslimat soruları: +998 97 862 66 99 · sales@satsolutions.uz",
  },
  zh: {
    title: "配送与付款",
    metaDesc: "SAT Solutions 配送与付款条款：塔什干及乌兹别克斯坦全境配送，银行转账或货到付款，无需预付。1分钟在线下单。",
    h1: "配送与付款",
    intro: "您可以直接在网站上订购设备：在产品页面点击“立即下单”，填写数量和电话——我们的经理将在工作时间（周一至周五 9:00–18:00）与您联系确认。",
    sections: [
      { h: "如何下单", items: [
        "在产品页面点击“立即下单”按钮，填写数量、姓名和电话。",
        "提交后您将获得订单号，经理会致电确认库存、价格和交货期。",
        "面向企业客户开具发票；如需正式报价单可随时索取。",
      ]},
      { h: "配送", items: [
        "塔什干市内——快递配送，确认后通常1–2个工作日送达。",
        "乌兹别克斯坦全境——物流公司配送，通常2–5个工作日。",
        "自提——塔什干市 Katta Darxon 街5号（周一至周五 9:00–18:00），免费。",
        "运费视尺寸和地区而定——经理确认订单时告知。",
      ]},
      { h: "付款", items: [
        "银行转账（凭发票）——适用于企业和个体经营者（B2B 主要方式）。",
        "货到付款（现金或刷卡）——适用于个人客户。",
        "网站无需预付款：经理确认订单后再付款。",
        "网站所有价格以乌兹别克斯坦索姆（UZS）计，含增值税。",
      ]},
      { h: "安装与保修", items: [
        "可根据需要提供所购设备的专业安装与调试——在同一订单中报价。",
        "所有设备均享有制造商保修（1 年起）；退货条款见“退换货政策”页面。",
      ]},
    ],
    contact: "配送咨询：+998 97 862 66 99 · sales@satsolutions.uz",
  },
};

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const d = D[locale] ?? D.ru;
  return {
    title: d.title,
    description: d.metaDesc,
    alternates: hreflangAlternates("/delivery", locale),
    openGraph: { title: d.title, description: d.metaDesc, locale: ogLocale(locale), images: ["/og.png"] },
  };
}

export default async function DeliveryPage({ params }: { params: Promise<{ locale: string }> }) {
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
