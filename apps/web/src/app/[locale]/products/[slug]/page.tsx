import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound, permanentRedirect } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getProductBySlug, getProducts, getSitePage, getBrands, getCategories, getSearchSuggest, getProductReviews, getProductQuestions, getBrandTypePairs } from "@/lib/api";
import { typeSlug } from "@/lib/typeSlug";
import { ReviewForm } from "@/components/ReviewForm";
import { QuestionForm } from "@/components/QuestionForm";
import { getTranslations } from "next-intl/server";
import { createMetadata, clip } from "@/lib/metadata";
import { localizeProduct, localizeProductName, localizeCharacteristics, localizeDescription } from "@/lib/productI18n";
import { localizeCatName } from "@/lib/catalogI18n";
import { localizeBrandName } from "@/lib/brandI18n";
import { displayModelCode } from "@/lib/modelCodeDisplay";
import { ogLocale } from "@/lib/ogLocale";
import { hreflangAlternates } from "@/lib/hreflang";
import { RichDescription } from "@/components/RichDescription";
import { parseRichDescription } from "@/lib/richDescription";
import { serviceForCategory } from "@/lib/servicesData";
import { getServiceSeo } from "@/lib/serviceSeo";
import { articlesForService } from "@/lib/articlesData";

// Заголовок блока «Статьи по теме» (инлайн, как UI-строки блога — не раздуваем messages)
const ARTICLES_UI: Record<string, string> = {
  ru: "Статьи по теме",
  uz: "Mavzu bo'yicha maqolalar",
  en: "Related articles",
  tr: "İlgili makaleler",
  zh: "相关文章",
};

/**
 * Восстановление товара по старому/битому slug (после пересборки каталога слаги сменились).
 * Ищем по коду модели из slug; редиректим (301/308) только при надёжном совпадении модели.
 */
async function recoverProductSlug(slug: string): Promise<string | null> {
  const reqTokens = slug.toLowerCase().split("-").filter(Boolean);
  const modelTok = reqTokens
    .filter((t) => /\d/.test(t) && t.length >= 4)
    .sort((a, b) => b.length - a.length)[0];
  if (!modelTok) return null; // нет надёжного кода модели — не рискуем редиректить
  try {
    const sug = await getSearchSuggest(modelTok); // ищем по одному токену-коду модели
    let best: { slug: string; score: number } | null = null;
    for (const p of sug.products || []) {
      const cand = (p.slug || "").toLowerCase();
      if (!cand || cand === slug || !cand.includes(modelTok)) continue;
      const candTokens = new Set(cand.split("-"));
      const score = reqTokens.filter((t) => candTokens.has(t)).length; // совпадение токенов
      if (!best || score > best.score) best = { slug: p.slug as string, score };
    }
    if (best && best.score >= 2) return best.slug; // ≥2 совпавших токена = надёжно
  } catch {
    // ignore
  }
  return null;
}
import Image from "next/image";
import { resolveImageUrl } from "@/lib/image";
import { BackButton } from "@/components/BackButton";
import { ContactButtons } from "@/components/ContactButtons";
import { ProductCard } from "@/components/Cards";
import { OrderButton } from "@/components/OrderButton";
import { ProductGallery } from "@/components/ProductGallery";
import { priceInfo, productIcon, isNewProduct } from "@/lib/product";

function pickRate(data: any): number | null {
  const v = data?.usdToUzs;
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

// Pick an emoji icon for a given characteristic key (best-effort)
function iconFor(key: string): string {
  const k = key.toLowerCase();
  if (/(разрешен|пиксел|мп|мегапикс|mp$|\d\s*mp)/i.test(k)) return "📷";
  if (/(угол|обзор|fov|360|панорам)/i.test(k)) return "📐";
  if (/(защ|ip\d|ik\d|water|вода|пыль)/i.test(k)) return "🛡";
  if (/(питан|вольт|вт|poe|power|вход)/i.test(k)) return "⚡";
  if (/(аналитик|ии|ai|deep|нейр)/i.test(k)) return "🤖";
  if (/(термо|темпера|°c)/i.test(k)) return "🌡";
  if (/(ик|ir|подсвет|ноч)/i.test(k)) return "🌙";
  if (/(аудио|микрофон|звук|sound)/i.test(k)) return "🔊";
  if (/(кадр|fps|fr\.)/i.test(k)) return "🎬";
  if (/(зум|zoom|объект|lens|фокус)/i.test(k)) return "🔍";
  if (/(сенсор|matrix|cmos)/i.test(k)) return "📸";
  if (/(установ|montag|места|внутр|снаруж)/i.test(k)) return "📍";
  if (/(плат|unity|alta|onvif)/i.test(k)) return "🔗";
  if (/(сд|sd|карта|пам|память|storage)/i.test(k)) return "💾";
  if (/(гаран|warranty)/i.test(k)) return "✅";
  if (/(статус|снят|eol)/i.test(k)) return "ℹ";
  return "▸";
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });
  try {
    const { product } = await getProductBySlug(slug);
    // Нет товара → 404 уже на этапе метаданных: иначе Next успевает отдать статус 200
    // до notFound() в теле страницы (стриминг), и GSC копит «ложные 404».
    if (!product) {
      const recovered = await recoverProductSlug(slug);
      if (recovered) permanentRedirect(`${locale === routing.defaultLocale ? "" : `/${locale}`}/products/${recovered}`);
      notFound();
    }
    const loc = localizeProduct(product, locale);
    const ogImage = resolveImageUrl(product.coverImageUrl) ?? undefined;
    const desc = clip(loc.shortDescription || loc.name, 160);
    return createMetadata({
      // title с коммерч. интентом + гео (важнейший фактор ранжирования)
      title: { absolute: `${loc.name} — ${t("product.titleBuy")}` },
      description: desc,
      alternates: hreflangAlternates(`/products/${product.slug}`, locale),
      openGraph: {
        title: loc.name,
        description: desc,
        locale: ogLocale(locale),
        images: ogImage ? [{ url: ogImage }] : undefined
      }
    });
  } catch (e) {
    // Служебные throw Next (notFound/permanentRedirect выше) — пробрасываем как есть
    if (String((e as any)?.digest || "").startsWith("NEXT_")) throw e;
    const msg = String((e as any)?.message || e);
    if (msg.includes("404")) {
      const recovered = await recoverProductSlug(slug);
      if (recovered) permanentRedirect(`${locale === routing.defaultLocale ? "" : `/${locale}`}/products/${recovered}`);
      notFound();
    }
    return { title: t("product.fallbackTitle") };
  }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale });

  // Фетч товара отдельно. 404 («Страница не найдена») — ТОЛЬКО если товар реально
  // отсутствует (API вернул 404). При временном сбое (таймаут/5xx/сеть, частый при
  // холодном рендере) — один ретрай, и при повторной ошибке бросаем (Next покажет
  // ошибку/повторит), а НЕ превращаем в постоянный 404.
  let product: Awaited<ReturnType<typeof getProductBySlug>>["product"] | undefined;
  try {
    ({ product } = await getProductBySlug(slug));
  } catch (e) {
    const msg = String((e as any)?.message || e);
    if (msg.includes("404")) {
      const recovered = await recoverProductSlug(slug);
      if (recovered) permanentRedirect(`${locale === routing.defaultLocale ? "" : `/${locale}`}/products/${recovered}`);
      notFound();
    }
    try {
      ({ product } = await getProductBySlug(slug)); // ретрай на временный сбой
    } catch {
      throw e; // не 404 — реальный сбой рендера
    }
  }
  if (!product) {
    const recovered = await recoverProductSlug(slug);
    if (recovered) permanentRedirect(`${locale === routing.defaultLocale ? "" : `/${locale}`}/products/${recovered}`);
    notFound();
  }

  // Отзывы товара (одобренные) — рейтинг + AggregateRating в разметку (только если count>0)
  const productReviews = await getProductReviews(product.id);
  const productQuestions = await getProductQuestions(product.id);

  try {
    // Локализованные name/shortDescription (uz/en/tr/zh), фолбэк на русский из БД
    const loc = localizeProduct(product, locale);
    const locName = loc.name;
    const locShortDesc = loc.shortDescription;
    const locDescription = localizeDescription(product.id, product.description, locale);

    let usdToUzs = 1;
    try {
      const { page } = await getSitePage("site");
      usdToUzs = pickRate(page.data) ?? 1;
    } catch {
      // ignore
    }

    // Resolve brand + category for breadcrumbs and badge
    let brandInfo: { slug: string; name: string } | null = null;
    let categoryInfo: { slug: string; name: string } | null = null;
    try {
      const [{ brands }, { categories }] = await Promise.all([getBrands(), getCategories()]);
      const b = brands.find((x: any) => x.id === (product as any).brandId);
      if (b) brandInfo = { slug: b.slug, name: b.name };
      const c = categories.find((x: any) => x.id === product.categoryId);
      if (c) categoryInfo = { slug: c.slug, name: c.name };
    } catch {
      // ignore
    }

    // Ссылка крошки категории: пара бренд×категория (если есть в белом списке), иначе страница типа напрямую (без 308-хопа /categories)
    let categoryHref: string | null = null;
    if (categoryInfo) {
      const tSlug = typeSlug(categoryInfo.name);
      categoryHref = `/products/type/${tSlug}`;
      if (brandInfo) {
        try {
          const { pairs } = await getBrandTypePairs();
          if (pairs.some((p) => p.brand.toLowerCase() === brandInfo!.slug && typeSlug(p.type) === tSlug)) {
            categoryHref = `/catalog/${brandInfo.slug}/${tSlug}`;
          }
        } catch {
          // ignore
        }
      }
    }

    const characteristics = localizeCharacteristics(product.id, product.characteristics ?? {}, locale);
    // «Цена» в характеристиках — служебный маркер «по запросу», не показываем в таблице
    const charEntries = Object.entries(characteristics).filter(([k]) => k !== "Цена");
    // Выжимка-плитки: потребительские параметры вперёд (объектив в мм важнее кодеков),
    // технические маркеры (Кодеки/Статус/Гарантия) в плитки не берём — они остаются в таблице.
    const HL_PRIORITY = ["объектив", "разрешение", "матрица", "ик-подсветка", "питание", "мощность", "длина", "порт", "скорость", "ёмкость", "емкость", "зоны", "количество шс", "дальность"];
    const HL_SKIP = ["кодек", "статус", "гарантия", "артикул"];
    const hlRank = (k: string) => {
      const kl = k.toLowerCase();
      const i = HL_PRIORITY.findIndex((p) => kl.includes(p));
      return i === -1 ? HL_PRIORITY.length : i;
    };
    const highlights = charEntries
      .filter(([k]) => !HL_SKIP.some((s) => k.toLowerCase().includes(s)))
      .sort((a, b) => hlRank(a[0]) - hlRank(b[0]))
      .slice(0, 4);
    const img = resolveImageUrl(product.coverImageUrl);
    const modelCode = (product as any).modelCode as string | null;
    // Цена: с числом — «от X сум» через переводы; без числа — блок «под проект»
    const pInfo = priceInfo(product);
    const priceProject = pInfo?.kind !== "value";
    const priceValue = pInfo?.kind === "value" ? pInfo.value : "";
    const isEol = !!characteristics["Статус"]?.toString().toLowerCase().includes("снят");
    // inStock=false → «под заказ»: карточка живёт в каталоге и индексе, меняются
    // бейдж, микроразметка (BackOrder) и availability в Merchant-фиде
    const onOrder = (product as any).inStock === false;

    // Similar products from same category (excluding current)
    let similarItems: any[] = [];
    if (categoryInfo) {
      try {
        const similar = await getProducts(1, 12, { category: categoryInfo.slug, brand: brandInfo?.slug });
        similarItems = similar.items.filter((p: any) => p.id !== product.id).slice(0, 6);
        // Фолбэк: если внутри бренда похожих мало — добираем по категории без бренда
        if (similarItems.length < 3) {
          const wide = await getProducts(1, 12, { category: categoryInfo.slug });
          const seen = new Set([product.id, ...similarItems.map((p: any) => p.id)]);
          for (const p of wide.items) {
            if (!seen.has(p.id)) { seen.add(p.id); similarItems.push(p); }
            if (similarItems.length >= 6) break;
          }
        }
      } catch {
        // ignore
      }
    }

    // «С этим покупают»: сопутствующие из смежных категорий (кросс-селл + внутренние
    // ссылки между ветками каталога — глубина обхода). Карта: категория → аксессуары.
    const ACCESSORY_MAP: Array<[RegExp, string[]]> = [
      [/регистратор|nvr|dvr/i, ["Жёсткие диски", "ИБП и электропитание"]],
      [/камер|видеонаблюд/i, ["Кронштейны и аксессуары", "Жёсткие диски", "СКС (витая пара)"]],
      [/коммутатор|маршрутизатор/i, ["SFP-модули и трансиверы", "СКС (витая пара)", "Телекоммуникационные шкафы"]],
      [/wi-?fi|точк|радиомост|беспровод/i, ["СКС (витая пара)", "Кронштейны и аксессуары"]],
      [/сервер/i, ["ИБП и электропитание", "Телекоммуникационные шкафы", "Жёсткие диски"]],
      [/домофон/i, ["Терминалы и считыватели", "Кабель"]],
      [/скуд|турникет|терминал|считыват|замок/i, ["Кабель", "ИБП и электропитание"]],
      [/пожарн|извещател|сигнализац|оповещ/i, ["Кабель", "ИБП и электропитание"]],
      [/pon|оптик|sfp/i, ["Оптика и аксессуары"]],
      [/телефон/i, ["СКС (витая пара)", "Коммутаторы"]],
    ];
    let accessoryItems: any[] = [];
    if (categoryInfo) {
      const accCats = ACCESSORY_MAP.find(([re]) => re.test(categoryInfo.name))?.[1] ?? [];
      if (accCats.length) {
        try {
          const lists = await Promise.all(
            accCats.slice(0, 3).map((n) => getProducts(1, 3, { type: n }).catch(() => ({ items: [] as any[] })))
          );
          const seen = new Set<string>([product.id, ...similarItems.map((p: any) => p.id)]);
          for (const l of lists) {
            for (const p of l.items as any[]) {
              if (!seen.has(p.id)) { seen.add(p.id); accessoryItems.push(p); }
            }
          }
          accessoryItems = accessoryItems.slice(0, 6);
        } catch {
          // ignore
        }
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
    // Цена для offers: только если есть валидное число и цена в сумах (UZS). Для «по запросу» — без offers.
    const priceNum = typeof product.price === "string" ? Number(product.price) : (product.price as unknown as number);
    const hasPrice = Number.isFinite(priceNum) && priceNum > 0 && !(product as any).isUsd;
    // sku/mpn — только настоящий артикул: один токен без пробелов, без разметки/кавычек,
    // ≤50 симв. Описательные «коды» (Болид/Рубеж, «Tp-Link RackMount Kit-D226» и т.п.)
    // Google отвергает как «недопустимое значение sku» — для них поля опускаем (необязательные).
    const skuRaw = (modelCode ?? "").trim();
    const skuVal = skuRaw.length > 0 && skuRaw.length <= 50 && !/[\s<>"]/.test(skuRaw) ? skuRaw : null;
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: locName,
      ...(skuVal ? { sku: skuVal, mpn: skuVal } : {}),
      ...(img ? { image: img } : {}),
      description: locShortDesc || locName,
      ...(brandInfo ? { brand: { "@type": "Brand", name: brandInfo.name } } : {}),
      ...(hasPrice
        ? {
            offers: {
              "@type": "Offer",
              price: Math.round(priceNum),
              priceCurrency: "UZS",
              availability: (product as any).inStock === false
                ? "https://schema.org/BackOrder"
                : "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              url: `${siteUrl}/products/${product.slug}`,
              seller: { "@type": "Organization", name: "SAT Solutions" },
              // Согласовано со страницами /returns (14 дней) и /delivery — важно для Merchant Center
              hasMerchantReturnPolicy: {
                "@type": "MerchantReturnPolicy",
                applicableCountry: "UZ",
                returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
                merchantReturnDays: 14,
                returnMethod: "https://schema.org/ReturnInStore",
                returnFees: "https://schema.org/FreeReturn",
              },
              // shippingDetails: регион и реальные сроки со страницы /delivery (Ташкент 1–2 дня,
              // по УЗ 2–5). shippingRate НЕ указываем — стоимость договорная (габариты/регион),
              // выдумывать тариф нельзя. Снимает GSC-warning «Missing field shippingDetails».
              shippingDetails: {
                "@type": "OfferShippingDetails",
                shippingDestination: { "@type": "DefinedRegion", addressCountry: "UZ" },
                deliveryTime: {
                  "@type": "ShippingDeliveryTime",
                  handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
                  transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 5, unitCode: "DAY" },
                },
              },
            },
          }
        : {}),
      ...(charEntries.length
        ? { additionalProperty: charEntries.slice(0, 12).map(([k, v]) => ({ "@type": "PropertyValue", name: k, value: String(v) })) }
        : {}),
      // AggregateRating — только при наличии реальных одобренных отзывов (Google требует реальные)
      ...(productReviews.count > 0
        ? { aggregateRating: { "@type": "AggregateRating", ratingValue: productReviews.avg, reviewCount: productReviews.count, bestRating: 5, worstRating: 1 } }
        : {}),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("nav.home"), item: siteUrl },
        { "@type": "ListItem", position: 2, name: t("nav.catalog"), item: `${siteUrl}/catalog` },
        ...(brandInfo ? [{ "@type": "ListItem", position: 3, name: localizeBrandName(brandInfo.slug, brandInfo.name, locale), item: `${siteUrl}/catalog/${brandInfo.slug}` }] : []),
        ...(categoryInfo && categoryHref
          ? [{ "@type": "ListItem", position: brandInfo ? 4 : 3, name: localizeCatName(categoryInfo.name, locale), item: `${siteUrl}${categoryHref}` }]
          : []),
        { "@type": "ListItem", position: (brandInfo ? 4 : 3) + (categoryInfo && categoryHref ? 1 : 0), name: locName, item: `${siteUrl}/products/${product.slug}` },
      ],
    };
    // FAQ-схема (FAQPage) из структурированного описания — для расширенных сниппетов Google
    const faqItems = parseRichDescription(locDescription).faq;
    const faqLd =
      faqItems.length > 0
        ? {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }
        : null;

    return (
      <div className="container-page py-3 sm:py-4">
        {/* Product-схема только при цене: без offers Google считает её критической
            ошибкой («задайте offers/review/aggregateRating», письмо GSC 29.08.2026).
            «Цена по запросу» → страница без Product LD (сниппета всё равно не будет). */}
        {hasPrice ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} /> : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          <Link href="/" className="hover:text-slate-900 transition-colors">{t("nav.home")}</Link>
          <span className="text-slate-300">/</span>
          <Link href="/catalog" className="hover:text-slate-900 transition-colors">{t("nav.catalog")}</Link>
          {brandInfo && (
            <>
              <span className="text-slate-300">/</span>
              <Link href={`/catalog/${brandInfo.slug}`} className="hover:text-slate-900 transition-colors">
                {localizeBrandName(brandInfo.slug, brandInfo.name, locale)}
              </Link>
            </>
          )}
          {categoryInfo && categoryHref && (
            <>
              <span className="text-slate-300">/</span>
              <Link href={categoryHref} className="hover:text-slate-900 transition-colors">
                {localizeCatName(categoryInfo.name, locale)}
              </Link>
            </>
          )}
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 normal-case tracking-normal">{displayModelCode(modelCode, locale) ?? locName ?? product.slug}</span>
        </nav>

        <div className="grid gap-4 lg:gap-6 lg:grid-cols-[32%_1fr]">
          {/* Left: image */}
          <div>
            {img ? (
              <ProductGallery
                alt={locName}
                images={[img, ...((product.galleryImageUrls ?? []).map((u) => resolveImageUrl(u)).filter(Boolean) as string[])]}
              />
            ) : (
              <div className="relative flex w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border border-slate-200 bg-gradient-to-br from-slate-100 via-white to-brand-50 py-20">
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, #0f2231 1.5px, transparent 1.5px)", backgroundSize: "22px 22px" }} aria-hidden />
                <span className="relative text-7xl opacity-50" aria-hidden>{productIcon(product.name)}</span>
                <span className="relative rounded-full bg-white/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-slate-500 shadow-sm">{t("common.noPhoto")}</span>
              </div>
            )}
          </div>

          {/* Right: meta + actions + specs */}
          <div>
            {/* Brand & status badges */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {brandInfo && (
                <Link
                  href={`/catalog/${brandInfo.slug}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-md text-xs font-bold uppercase tracking-wide transition-colors"
                >
                  <span style={{ color: "#e02020" }}>●</span> {localizeBrandName(brandInfo.slug, brandInfo.name, locale)}
                </Link>
              )}
              {isEol ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  ⚠ {t("product.eol")}
                </span>
              ) : onOrder ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> {t("common.onOrder")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {t("common.inStock")}
                </span>
              )}
              {(product as any).recommended && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{t("product.hit")}</span>
              )}
              {isNewProduct(product) && (
                <span className="px-2 py-0.5 bg-green-600 text-white text-xs font-extrabold rounded-full">{t("common.newBadge")}</span>
              )}
            </div>

            {/* Title + model code (артикул не дублируем, если он уже есть в названии) */}
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl leading-tight">{locName}</h1>
            {displayModelCode(modelCode, locale) && !locName.toLowerCase().includes(String(modelCode).toLowerCase()) ? (
              <div className="mt-1 text-base font-mono font-semibold text-slate-600 tracking-wide">
                {displayModelCode(modelCode, locale)}
              </div>
            ) : null}
            {locShortDesc ? (
              <p className="mt-2 text-sm text-slate-600">{locShortDesc}</p>
            ) : null}

            {/* Цена + CTA в одном ряду — компактнее, контент поднимается выше */}
            <div className="mt-3">
              {/* Есть цена — показываем «от X сум» (локализованно, а не хардкодом).
                  Нет цены — это проектное оборудование (Avigilon, H3C, Eltex): вместо сухого
                  «Цена по запросу» объясняем, почему цены нет и когда придёт расчёт. */}
              {priceProject ? (
                <div className="rounded-xl border border-brand-200 bg-brand-50/70 px-4 py-3">
                  <div className="text-lg font-black text-brand-800">{t("product.priceProject")}</div>
                  <p className="mt-1 text-sm text-slate-600">{t("product.priceProjectNote")}</p>
                </div>
              ) : (
                // Точная цена без «от» — требование Merchant Center: цена на странице
                // должна совпадать с фидом, «от» читается как «купить по этой цене нельзя»
                <div className="text-2xl font-black text-[#e02020]">
                  {t("common.priceExact", { value: priceValue })}
                </div>
              )}
              {/* Заказать — Telegram — WhatsApp: три одинаковые кнопки в один ряд (моб. и десктоп) */}
              <div className="mt-3 grid grid-cols-3 gap-2">
                <OrderButton
                  productId={product.id}
                  productName={`${locName}${modelCode ? ` (${modelCode})` : ""}`}
                  price={product.price}
                  label={t("common.order")}
                  variant="primary"
                  fullWidth
                />
                <ContactButtons compact hideCall full />
              </div>
              <div className="mt-2">
                <BackButton />
              </div>
            </div>

            {/* Key highlights (icons) */}
            {highlights.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 border border-slate-200 rounded-xl p-3 bg-gradient-to-br from-slate-50 to-white">
                {highlights.map(([k, v]) => (
                  <div key={k} className="text-center">
                    <div className="text-xl">{iconFor(k)}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1" title={k}>{k}</div>
                    <div className="text-sm font-bold line-clamp-2" title={String(v)}>{String(v)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Full characteristics + description (no tabs since data is sparse) */}
            {charEntries.length > 0 && (
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
                <div className="bg-slate-50 px-4 py-2 text-sm font-semibold">{t("product.characteristics")}</div>
                <dl className="divide-y divide-slate-100 bg-white">
                  {charEntries.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-1 gap-1 px-4 py-2 sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm text-slate-500">{k}</dt>
                      <dd className="text-sm font-semibold text-slate-800 sm:col-span-2">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <RichDescription text={locDescription} />

            {(() => {
              const relSvc = serviceForCategory(categoryInfo?.name);
              if (!relSvc) return null;
              // Анкор — keyword-rich H1 услуги («Установка видеонаблюдения в Ташкенте»),
              // как на страницах каталога (CategoryServiceLink). Карточек товаров 3000+,
              // и это самый массовый внутренний анкор на сайте: раньше стоял голый
              // relSvc.title («Видеонаблюдение») — и он же был русским на всех локалях.
              const anchor = getServiceSeo(locale, relSvc.key)?.h1 ?? t(`services.${relSvc.key}.title`);
              return (
                <Link
                  href={`/solutions/${relSvc.key}`}
                  className="mt-6 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 transition-colors hover:bg-brand-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-xl">🛠</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-brand-600">{t("product.turnkey")}</span>
                    <span className="block text-sm font-semibold text-slate-900">{anchor} — {t("product.designInstall")}</span>
                  </span>
                  <span className="shrink-0 font-bold text-brand-600">→</span>
                </Link>
              );
            })()}

            {/* Статьи по теме: товар → блог (перелинковка, краулинг статей) */}
            {(() => {
              const relSvc = serviceForCategory(categoryInfo?.name);
              const arts = articlesForService(relSvc?.key, locale);
              if (!arts.length) return null;
              return (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{ARTICLES_UI[locale] ?? ARTICLES_UI.ru}</p>
                  <ul className="mt-2 space-y-1.5">
                    {arts.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/blog/${a.slug}`} className="text-sm font-semibold text-brand-700 hover:underline">
                          {a.loc[locale]!.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Help banner — "Need help choosing?" */}
        <div className="mt-8 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100 p-4 sm:p-6 flex flex-wrap items-center gap-4">
          <div className="text-3xl">💬</div>
          <div className="flex-1 min-w-[200px]">
            <div className="font-bold text-base">{t("product.helpTitle")}</div>
            <div className="text-xs sm:text-sm text-slate-600">{t("product.helpText")}</div>
          </div>
          <Link
            href="/contact"
            className="rounded-lg text-white px-5 py-2.5 font-bold text-sm hover:opacity-90"
            style={{ backgroundColor: "#e02020" }}
          >
            {t("product.getConsult")} →
          </Link>
        </div>

        {/* Отзывы о товаре: оценка (productId) + список одобренных */}
        <div className="mt-8">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold tracking-tight">
              {locale === "uz" ? "Mahsulot sharhlari" : locale === "en" ? "Product reviews" : locale === "tr" ? "Ürün yorumları" : locale === "zh" ? "产品评价" : "Отзывы о товаре"}
            </h2>
            {productReviews.count > 0 && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-slate-600">
                <span className="inline-flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} viewBox="0 0 20 20" className={`h-4 w-4 ${i <= Math.round(productReviews.avg) ? "text-amber-400" : "text-slate-200"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
                  ))}
                </span>
                <span className="tabular-nums">{productReviews.avg.toFixed(1)}</span>
                <span className="text-slate-400">· {productReviews.count}</span>
              </span>
            )}
          </div>
          <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="max-w-xl">
              <ReviewForm locale={locale} productId={product.id} />
            </div>
            {productReviews.count > 0 && (
              <div className="space-y-3">
                {productReviews.items.slice(0, 4).map((r) => (
                  <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-black text-slate-900">{r.authorName?.trim() || "Клиент"}</span>
                      <span className="inline-flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} viewBox="0 0 20 20" className={`h-3.5 w-3.5 ${s <= r.rating ? "text-amber-400" : "text-slate-200"}`} fill="currentColor"><path d="M10 1.6l2.47 5.01 5.53.8-4 3.9.94 5.5L10 14.2l-4.94 2.6.94-5.5-4-3.9 5.53-.8L10 1.6z" /></svg>
                        ))}
                      </span>
                    </div>
                    {r.text && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{r.text}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Q&A: вопрос инженеру + опубликованные ответы (FAQPage-схема при наличии) */}
        <div className="mt-8">
          {productQuestions.count > 0 && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: productQuestions.items.map((q) => ({
                    "@type": "Question",
                    name: q.question,
                    acceptedAnswer: { "@type": "Answer", text: q.answer ?? "" },
                  })),
                }),
              }}
            />
          )}
          <h2 className="text-lg font-bold tracking-tight">
            {locale === "uz" ? "Savol-javob" : locale === "en" ? "Questions & answers" : locale === "tr" ? "Soru & cevap" : locale === "zh" ? "问答" : "Вопросы и ответы"}
          </h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-2 lg:items-start">
            <div className="max-w-xl">
              <QuestionForm locale={locale} productId={product.id} />
            </div>
            {productQuestions.count > 0 && (
              <div className="space-y-3">
                {productQuestions.items.slice(0, 6).map((q) => (
                  <div key={q.id} className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-sm font-black text-slate-900">{q.name?.trim() || (locale === "uz" ? "Xaridor" : locale === "en" ? "Customer" : locale === "tr" ? "Müşteri" : locale === "zh" ? "买家" : "Покупатель")}: <span className="font-semibold text-slate-700">{q.question}</span></p>
                    {q.answer && (
                      <p className="mt-2 rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                        <span className="font-black text-brand-700">SAT: </span>{q.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Similar items in same category */}
        {similarItems.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold tracking-tight">
                {categoryInfo ? `${t("product.similar")}: ${localizeCatName(categoryInfo.name, locale)}` : t("product.similarProducts")}
              </div>
              {categoryInfo && categoryHref && (
                <Link href={categoryHref} className="text-xs font-bold text-[#e02020] hover:underline">
                  {t("product.wholeCategory")} →
                </Link>
              )}
            </div>
            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {similarItems.map((p: any) => (
                <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} name={localizeProductName(p, locale)} />
              ))}
            </div>
          </div>
        )}

        {/* «С этим покупают» — сопутствующие из смежных категорий (кросс-селл + перелинковка) */}
        {accessoryItems.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 text-lg font-bold tracking-tight">{t("product.boughtWith")}</div>
            <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
              {accessoryItems.map((p: any) => (
                <ProductCard key={p.id} p={p} usdToUzs={usdToUzs} name={localizeProductName(p, locale)} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } catch (e) {
    // Товар уже найден выше; ошибка здесь — это рендер/данные (или служебный
    // throw от notFound/permanentRedirect) — пробрасываем, не делаем ложный 404.
    throw e;
  }
}
