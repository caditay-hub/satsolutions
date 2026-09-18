import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getSitePage } from "@/lib/api";
import { formatPhone } from "@/lib/formatPhone";
import { resolveImageUrl } from "@/lib/image";
import { SocialLinks } from "@/components/SocialLinks";
import { FeedbackForm } from "@/components/FeedbackForm";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hreflangAlternates } from "@/lib/hreflang";
import { localizeAddress } from "@/lib/contentI18n";

const INFO: Record<string, { h2a: string; pa: string; h2b: string; pb: string; h2c: string; pc: string; more: string; l1: string; l2: string; l3: string }> = {
  ru: { h2a: "Как мы отвечаем на обращение", pa: "Заявку с сайта и сообщение в мессенджер берём в работу в рабочие часы — с понедельника по пятницу с 9:00 до 18:00, по субботам по договорённости. Сначала уточняем задачу и тип объекта, затем предлагаем время бесплатного выезда инженера: он замеряет объект, проверяет существующие трассы и питание и говорит, что реально нужно, а что можно не покупать. Смету присылаем в течение одного рабочего дня после выезда.", h2b: "Куда выезжаем", pb: "Работаем по Ташкенту и Ташкентской области, на объекты в других регионах Узбекистана выезжаем под проект — от жилых комплексов и складов до АЗС и производств. Обслуживание смонтированных систем ведём по договору: регламентные проверки, замена оборудования, аварийные выезды.", h2c: "Что подготовить к разговору", pc: "Быстрее всего расчёт идёт, когда есть план помещения или хотя бы площадь и число входов, понятно, есть ли на объекте интернет и готов ли ремонт, и известно, нужна ли запись с архивом или достаточно просмотра в реальном времени. Если ничего этого пока нет — не страшно: подскажем по фотографиям объекта.", more: "Пока ждёте ответа:", l1: "Посчитать стоимость", l2: "Готовые комплекты с ценой", l3: "Услуги и монтаж" },
  uz: { h2a: "Murojaatga qanday javob beramiz", pa: "Saytdagi ariza va messenjerdagi xabarni ish vaqtida koʻrib chiqamiz — dushanbadan jumagacha 9:00 dan 18:00 gacha, shanba kuni kelishuv boʻyicha. Avval vazifa va obyekt turini aniqlaymiz, soʻng muhandisning bepul chiqishi uchun vaqt taklif qilamiz: u obyektni oʻlchaydi, mavjud trassa va quvvatni tekshiradi va nima kerakligini, nimani sotib olmasa ham boʻlishini aytadi. Smetani chiqishdan keyin bir ish kuni ichida yuboramiz.", h2b: "Qayerlarga chiqamiz", pb: "Toshkent shahri va Toshkent viloyati boʻyicha ishlaymiz, Oʻzbekistonning boshqa hududlariga loyiha boʻyicha chiqamiz — turar joy majmualaridan va omborlardan tortib shoxobcha va ishlab chiqarishgacha. Oʻrnatilgan tizimlarni shartnoma asosida xizmat koʻrsatamiz: rejali tekshiruv, uskunani almashtirish, favqulodda chiqish.", h2c: "Suhbatga nima tayyorlash kerak", pc: "Hisob tezroq boʻladi, agar bino rejasi yoki hech boʻlmasa maydon va kirishlar soni boʻlsa, obyektda internet bor-yoʻqligi va taʼmir tugaganligi maʼlum boʻlsa, hamda arxivli yozuv kerakmi yoki jonli koʻrish yetarlimi aniq boʻlsa. Hozircha bularning hech biri boʻlmasa ham muammo emas — obyekt suratlari boʻyicha maslahat beramiz.", more: "Javobni kutayotganda:", l1: "Narxni hisoblash", l2: "Narxi bilan tayyor toʻplamlar", l3: "Xizmatlar va montaj" },
  en: { h2a: "How we handle an enquiry", pa: "Requests from the site and messages in chat are picked up during working hours — Monday to Friday, 9:00 to 18:00, Saturdays by arrangement. First we clarify the task and the type of site, then offer a slot for a free engineer visit: they measure the site, check existing cable routes and power, and say what is really needed and what you can skip. The quote follows within one working day of the visit.", h2b: "Where we travel", pb: "We work across Tashkent and the Tashkent region, and travel to other regions of Uzbekistan for projects — from residential complexes and warehouses to filling stations and production sites. Systems we install are maintained under contract: scheduled checks, equipment replacement, emergency call-outs.", h2c: "What to have ready", pc: "A quote goes fastest when there is a floor plan, or at least the area and the number of entrances; when it is clear whether the site has internet and whether the fit-out is finished; and when you know if recording with an archive is required or live viewing is enough. If none of that exists yet, that is fine — we can advise from photos of the site.", more: "While you wait for our reply:", l1: "Calculate the cost", l2: "Kits with upfront pricing", l3: "Services and installation" },
  tr: { h2a: "Talebi nasıl karşılıyoruz", pa: "Siteden gelen talepler ve mesajlar çalışma saatlerinde ele alınır — pazartesiden cumaya 9:00–18:00, cumartesi mutabakatla. Önce işi ve tesis tipini netleştiriyoruz, ardından ücretsiz mühendis ziyareti için saat öneriyoruz: tesisi ölçüyor, mevcut güzergâh ve enerjiyi kontrol ediyor, neyin gerçekten gerektiğini ve neyin alınmasına gerek olmadığını söylüyor. Teklif, ziyaretten sonra bir iş günü içinde gönderilir.", h2b: "Nerelere gidiyoruz", pb: "Taşkent ve Taşkent bölgesinde çalışıyor, proje bazında Özbekistan’ın diğer bölgelerine gidiyoruz — konut sitelerinden ve depolardan akaryakıt istasyonlarına ve üretim tesislerine kadar. Kurduğumuz sistemleri sözleşmeyle bakıma alıyoruz: planlı kontroller, ekipman değişimi, acil çağrılar.", h2c: "Görüşmeye ne hazırlamalı", pc: "Hesap en hızlı; kat planı ya da en azından alan ve giriş sayısı varsa, tesiste internet olup olmadığı ve tadilatın bitip bitmediği belliyse, arşivli kayıt mı yoksa canlı izleme mi gerektiği biliniyorsa çıkar. Henüz hiçbiri yoksa sorun değil — tesis fotoğraflarından da yönlendiririz.", more: "Yanıtı beklerken:", l1: "Maliyeti hesapla", l2: "Fiyatı belli setler", l3: "Hizmetler ve montaj" },
  zh: { h2a: "我们如何处理咨询", pa: "网站上的申请和聊天消息在工作时间处理——周一至周五 9:00 至 18:00，周六另行约定。我们先确认需求与场地类型，再安排工程师免费上门：现场测量、检查既有线路与供电，并说明哪些确实需要、哪些可以不买。报价在上门后一个工作日内发出。", h2b: "服务范围", pb: "我们在塔什干市与塔什干州开展工作，按项目前往乌兹别克斯坦其他地区——从住宅小区、仓库到加油站与生产厂区。我们安装的系统按合同维护：定期巡检、设备更换、紧急出勤。", h2c: "沟通前请准备什么", pc: "如果有平面图，或至少有面积与出入口数量；如果清楚现场是否有网络、装修是否完工；如果明确需要带存储的录像还是实时查看即可，报价会最快。暂时都没有也没关系——我们可以根据现场照片给出建议。", more: "等待回复时可以先看：", l1: "费用测算", l2: "明码标价的套装", l3: "服务与安装" },
};

function pick(data: any, key: string) {
  return typeof data?.[key] === "string" ? (data[key] as string) : null;
}

// ISR: контакты приходят из site-pages API
export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const info = INFO[locale] ?? INFO.ru;
  try {
    const { page } = await getSitePage("contact");
    return {
      title: locale === "ru" ? (page.title || t("title")) : t("title"),
      description: t("metaDesc"),
      alternates: hreflangAlternates("/contact", locale)
    };
  } catch {
    return { title: t("title") };
  }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  // Явная локаль: без неё маршрут динамический на каждый запрос
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contact" });
  const info = INFO[locale] ?? INFO.ru;
  try {
    const [{ page }, { page: site }] = await Promise.all([getSitePage("contact"), getSitePage("site")]);
    const img = resolveImageUrl(page.coverImageUrl);
    const phone = pick(page.data, "phone");
    const email = pick(page.data, "email");
    const address = localizeAddress(pick(page.data, "address"), locale);
    const instagramUrl = typeof site.data?.social?.instagram === "string" ? site.data.social.instagram : null;
    const telegramUrl = typeof site.data?.social?.telegram === "string" ? site.data.social.telegram : null;
    const facebookUrl = typeof site.data?.social?.facebook === "string" ? site.data.social.facebook : null;

    return (
      <div className="container-page !pt-3 !pb-10">
        <div className={`mx-auto max-w-6xl ${img ? "" : "flex flex-col items-center text-center"}`}>
          <h1 className="mb-2 text-2xl font-black tracking-tight sm:text-3xl text-slate-950">{locale === "ru" ? page.title : t("title")}</h1>
          {page.content ? (
            <p className="mb-4 max-w-2xl text-base font-medium text-slate-700">{page.content}</p>
          ) : null}

          <div className={`mt-4 grid w-full gap-8 ${img ? "lg:grid-cols-2 lg:items-center" : "max-w-3xl"}`}>
            {img ? (
              <div className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition-all hover:scale-[1.01]">
                <Image
                  alt={page.title}
                  src={img}
                  width={800}
                  height={1000}
                  className="h-full min-h-[400px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            ) : null}

            <div className={`flex flex-col gap-8 ${!img ? "w-full" : ""}`}>
              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10 text-left">
                <div className="mb-10">
                  <h2 className="text-4xl font-bold tracking-tight text-slate-950">{t("feedback")}</h2>
                  <div className="mt-2 h-1.5 w-20 rounded-full bg-brand-600" />
                </div>

                <div className="space-y-10">
                  <div className="grid gap-8 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-600" />
                        <span className="text-sm font-black uppercase tracking-widest text-slate-600">{t("contactInfo")}</span>
                      </div>
                      <div className="space-y-2 text-2xl font-bold text-slate-950">
                        {phone ? <div className="hover:text-brand-600 transition-colors cursor-default">{formatPhone(phone)}</div> : null}
                        {email ? <div className="text-xl hover:text-brand-600 transition-colors cursor-default">{email}</div> : null}
                        {address ? <div className="text-base font-semibold text-slate-700">{address}</div> : null}
                        {!phone && !email && !address ? (
                          <div className="text-base text-slate-500 italic font-medium">{t("dataLater")}</div>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-brand-600" />
                        <span className="text-sm font-black uppercase tracking-widest text-slate-600">{t("social")}</span>
                      </div>
                      <div className="mt-1">
                        <SocialLinks instagramUrl={instagramUrl} telegramUrl={telegramUrl} facebookUrl={facebookUrl} wechatId="cadi2104" linkedinUrl="https://www.linkedin.com/company/sat-solutions-uz" />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-100" />

                  <FeedbackForm hideHeader />
                </div>
              </div>
            </div>
          </div>

          {/* Страница состояла из реквизитов и формы — 27 слов, самая тонкая на сайте.
              Здесь то, что спрашивают до звонка: часы, порядок выезда, зона работ. */}
          <div className="mt-10 max-w-3xl space-y-8">
            <section>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{info.h2a}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{info.pa}</p>
            </section>
            <section>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{info.h2b}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{info.pb}</p>
            </section>
            <section>
              <h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">{info.h2c}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base">{info.pc}</p>
            </section>
            <p className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-6 text-sm">
              <span className="font-bold text-slate-900">{info.more}</span>
              <Link href="/calculator" className="font-bold text-brand-700 hover:underline">{info.l1} →</Link>
              <Link href="/kits" className="font-bold text-brand-700 hover:underline">{info.l2} →</Link>
              <Link href="/solutions" className="font-bold text-brand-700 hover:underline">{info.l3} →</Link>
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return (
      <div className="container-page py-6 sm:py-10">
        <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          {t("notReady")}
        </div>
      </div>
    );
  }
}

