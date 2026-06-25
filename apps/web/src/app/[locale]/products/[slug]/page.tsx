import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound, permanentRedirect } from "next/navigation";
import { getProductBySlug, getProducts, getSitePage, getBrands, getCategories, getSearchSuggest } from "@/lib/api";
import { getTranslations } from "next-intl/server";
import { createMetadata, clip } from "@/lib/metadata";
import { localizeProduct, localizeProductName, localizeCharacteristics, localizeDescription } from "@/lib/productI18n";
import { localizeCatName } from "@/lib/catalogI18n";
import { hreflangAlternates } from "@/lib/hreflang";
import { RichDescription } from "@/components/RichDescription";
import { parseRichDescription } from "@/lib/richDescription";
import { serviceForCategory } from "@/lib/servicesData";

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
import { ProductCard } from "@/components/Cards";
import { RequestQuoteButton } from "@/components/RequestQuoteButton";
import { ProductGallery } from "@/components/ProductGallery";
import { priceLabel, productIcon } from "@/lib/product";

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
    const loc = localizeProduct(product, locale);
    const ogImage = resolveImageUrl(product.coverImageUrl) ?? undefined;
    const desc = clip(loc.shortDescription || loc.name, 160);
    return createMetadata({
      // title с коммерч. интентом + гео (важнейший фактор ранжирования)
      title: { absolute: `${loc.name} — ${t("product.titleBuy")} | SAT Solutions` },
      description: desc,
      alternates: hreflangAlternates(`/products/${product.slug}`, locale),
      openGraph: {
        title: loc.name,
        description: desc,
        images: ogImage ? [{ url: ogImage }] : undefined
      }
    });
  } catch {
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
      if (recovered) permanentRedirect(`/products/${recovered}`);
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
    if (recovered) permanentRedirect(`/products/${recovered}`);
    notFound();
  }

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

    const characteristics = localizeCharacteristics(product.id, product.characteristics ?? {}, locale);
    // «Цена» в характеристиках — служебный маркер «по запросу», не показываем в таблице
    const charEntries = Object.entries(characteristics).filter(([k]) => k !== "Цена");
    const highlights = charEntries.slice(0, 4);
    const img = resolveImageUrl(product.coverImageUrl);
    const modelCode = (product as any).modelCode as string | null;
    const isEol = !!characteristics["Статус"]?.toString().toLowerCase().includes("снят");

    // Similar products from same category (excluding current)
    let similarItems: any[] = [];
    if (categoryInfo) {
      try {
        const similar = await getProducts(1, 12, { category: categoryInfo.slug, brand: brandInfo?.slug });
        similarItems = similar.items.filter((p: any) => p.id !== product.id).slice(0, 6);
      } catch {
        // ignore
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";
    // Цена для offers: только если есть валидное число и цена в сумах (UZS). Для «по запросу» — без offers.
    const priceNum = typeof product.price === "string" ? Number(product.price) : (product.price as unknown as number);
    const hasPrice = Number.isFinite(priceNum) && priceNum > 0 && !(product as any).isUsd;
    const productLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: locName,
      ...(modelCode ? { sku: modelCode, mpn: modelCode } : {}),
      ...(img ? { image: img } : {}),
      description: locShortDesc || locName,
      ...(brandInfo ? { brand: { "@type": "Brand", name: brandInfo.name } } : {}),
      ...(hasPrice
        ? {
            offers: {
              "@type": "Offer",
              price: Math.round(priceNum),
              priceCurrency: "UZS",
              availability: "https://schema.org/InStock",
              itemCondition: "https://schema.org/NewCondition",
              url: `${siteUrl}/products/${product.slug}`,
              seller: { "@type": "Organization", name: "SAT Solutions" },
            },
          }
        : {}),
      ...(charEntries.length
        ? { additionalProperty: charEntries.slice(0, 12).map(([k, v]) => ({ "@type": "PropertyValue", name: k, value: String(v) })) }
        : {}),
    };
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("nav.home"), item: siteUrl },
        { "@type": "ListItem", position: 2, name: t("nav.catalog"), item: `${siteUrl}/catalog` },
        ...(brandInfo ? [{ "@type": "ListItem", position: 3, name: brandInfo.name, item: `${siteUrl}/catalog/${brandInfo.slug}` }] : []),
        { "@type": "ListItem", position: brandInfo ? 4 : 3, name: locName, item: `${siteUrl}/products/${product.slug}` },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
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
                {brandInfo.name}
              </Link>
            </>
          )}
          {categoryInfo && (
            <>
              <span className="text-slate-300">/</span>
              <Link href={`/categories/${categoryInfo.slug}`} className="hover:text-slate-900 transition-colors">
                {localizeCatName(categoryInfo.name, locale)}
              </Link>
            </>
          )}
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 normal-case tracking-normal">{modelCode ?? product.slug}</span>
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
                  <span style={{ color: "#e02020" }}>●</span> {localizeCatName(brandInfo.name, locale)}
                </Link>
              )}
              {isEol ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                  ⚠ {t("product.eol")}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {t("common.inStock")}
                </span>
              )}
              {(product as any).recommended && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">{t("product.hit")}</span>
              )}
            </div>

            {/* Title + model code (артикул не дублируем, если он уже есть в названии) */}
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl leading-tight">{locName}</h1>
            {modelCode && !locName.toLowerCase().includes(modelCode.toLowerCase()) ? (
              <div className="mt-1 text-base font-mono font-semibold text-slate-600 tracking-wide">
                {modelCode}
              </div>
            ) : null}
            {locShortDesc ? (
              <p className="mt-2 text-sm text-slate-600">{locShortDesc}</p>
            ) : null}

            {/* Price (показываем только для товаров с ценой/«по запросу») */}
            {priceLabel(product) ? (
              <div className="mt-3 text-2xl font-black text-brand-700">{priceLabel(product)}</div>
            ) : null}

            {/* Action row */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <BackButton />
              <RequestQuoteButton
                label={t("common.getQuote")}
                variant="primary"
                productName={`${locName}${modelCode ? ` (${modelCode})` : ""}`}
              />
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
              return (
                <Link
                  href={`/solutions/${relSvc.key}`}
                  className="mt-6 flex items-center gap-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4 transition-colors hover:bg-brand-50"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-xl">🛠</span>
                  <span className="flex-1">
                    <span className="block text-xs font-bold uppercase tracking-wider text-brand-600">{t("product.turnkey")}</span>
                    <span className="block text-sm font-semibold text-slate-900">{relSvc.title} — {t("product.designInstall")}</span>
                  </span>
                  <span className="shrink-0 font-bold text-brand-600">→</span>
                </Link>
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

        {/* Similar items in same category */}
        {similarItems.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-bold tracking-tight">
                {categoryInfo ? `${t("product.similar")}: ${localizeCatName(categoryInfo.name, locale)}` : t("product.similarProducts")}
              </div>
              {categoryInfo && (
                <Link href={`/categories/${categoryInfo.slug}`} className="text-xs font-bold text-[#e02020] hover:underline">
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
      </div>
    );
  } catch (e) {
    // Товар уже найден выше; ошибка здесь — это рендер/данные (или служебный
    // throw от notFound/permanentRedirect) — пробрасываем, не делаем ложный 404.
    throw e;
  }
}
