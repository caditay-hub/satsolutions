import type { Metadata } from "next";
import { site } from "./site";
import { OG_LOCALE } from "./ogLocale";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://satsolutions.uz";

/** Обрезает текст до ~max символов по границе слова (без обрыва посреди слова). */
export function clip(text: string, max = 160): string {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.5 ? cut.slice(0, lastSpace) : cut).replace(/[\s.,;:–—-]+$/, "") + "…";
}

/**
 * Как clip, но режет по концу предложения (14.10.2026): у ~2 600 товаров на каждом языке
 * сниппет обрывался «…» посреди фразы перед хвостом с ценой. Порядок: последнее целое
 * предложение (не короче 45% лимита) → последняя запятая/точка с запятой/тире у самого
 * конца (≥75%, чтобы не съедать характеристики) с точкой → обрезка по слову с «…».
 */
export function clipSentence(text: string, max = 160): string {
    const t = (text || "").replace(/\s+/g, " ").trim();
    if (t.length <= max) return t;
    const cut = t.slice(0, max);
    let end = -1;
    for (const m of cut.matchAll(/[.!?。！？](?=\s|$)|[。！？]/g)) {
        const e = (m.index ?? 0) + m[0].length;
        if (e >= max * 0.45) end = e;
    }
    if (end > 0) return cut.slice(0, end).trim();
    let sep = -1;
    for (const m of cut.matchAll(/[,;，；]\s|\s[—–-]\s|：|:\s/g)) {
        if ((m.index ?? 0) >= max * 0.75) sep = m.index ?? 0;
    }
    if (sep > 0) return cut.slice(0, sep).replace(/[\s,;:–—-]+$/, "") + (/[一-鿿]/.test(cut) ? "。" : ".");
    return clip(t, max);
}

/**
 * og:url = canonical страницы. Обёртка для generateMetadata каждой страницы (05.10.2026):
 * у ~1960 страниц og:url не было вовсе — openGraph страницы целиком заменяет openGraph
 * layout (Next не сливает его по полям), а url в нём никто не ставил.
 * Страницам без своего openGraph собираем его здесь же: иначе подстановка одного url
 * затёрла бы унаследованные из layout title/описание/картинку.
 */
// ── Длина сниппета (15.10.2026) ────────────────────────────────────────────────────────────
// Google обрезает заголовок примерно на 60 знаках (по ширине: иероглиф ≈ две латинские буквы),
// описание — на ~155. По seo:check длинных заголовков было 346, описаний 224; на позициях 6–8
// сервисные запросы («установка домофона в ташкенте цена» 101 показ, «турникет» 105) давали
// 0 кликов. Подгонка здесь, в общей обёртке, покрывает все 38 страниц с generateMetadata.
// Заголовок: своё многоточие не ставим — режем по естественной границе (двоеточие, тире,
// вертикальная черта), бренд приписываем только если помещается; описание — по концу предложения.
const CJK_RE = /[\u3040-\u30ff\u3400-\u9fff\uff00-\uffef]/;
const BRAND_TAIL = /\s*[—–|-]\s*SAT(?:\s+Solutions)?\s*$/i;
const HAS_BRAND = /\bSAT\b/;
const TITLE_SEPS = [" — ", " – ", ": ", "：", " | ", " - "];
// служебные слова, на которых заголовок обрывать нельзя («…программу Hikvision для»)
const FUNC_WORDS = new Set(["и", "или", "а", "в", "во", "на", "с", "со", "к", "ко", "о", "об", "у", "за", "из", "от", "до", "по", "под", "при", "для", "без", "над", "про", "не",
    "va", "yoki", "uchun", "bilan", "da", "dan", "ga", "ni", "ning", "haqida", "the", "a", "an", "and", "or", "of", "for", "with", "in", "on", "to", "at", "by", "from", "ve", "veya", "için", "ile", "bir", "&"]);
const CONJ_WORDS = new Set(["и", "или", "va", "yoki", "and", "or", "ve", "veya", "&", "с", "with", "bilan", "ile"]);
export const TITLE_MAX = 60;
export const DESC_MAX = 160;

/** Ширина строки в «латинских» знаках: иероглиф и полноширинный знак считаем за два. */
export function visualLength(s: string): number {
    let n = 0;
    for (const ch of s) n += CJK_RE.test(ch) ? 2 : 1;
    return n;
}

/** Снять с конца служебные слова и висящие «… and fire» (союз + одно слово). */
function trimDangling(s: string): string {
    const words = s.replace(/[\s,;:–—(-]+$/, "").split(" ");
    for (;;) {
        if (words.length < 2) break;
        const last = words[words.length - 1].toLowerCase();
        if (FUNC_WORDS.has(last)) { words.pop(); continue; }
        const prev = words[words.length - 2].toLowerCase();
        if (CONJ_WORDS.has(prev) && words.length > 3) { words.pop(); words.pop(); continue; }
        break;
    }
    let out = words.join(" ");
    // незакрытая скобка «(Mesh» — обрезаем до неё
    const open = out.lastIndexOf("(");
    if (open > 0 && out.indexOf(")", open) === -1) out = out.slice(0, open);
    return out.replace(/[\s,;:–—(-]+$/, "");
}

// Код модели: цифра + латинская буква в одном слове (DS-2CD1047G2H, RB912R-2nD, PXT-PLC-M-1x4),
// но не единица измерения (4МП, 2.8mm, 15U, 180кг, 1200Вт) и не «L2»/«Wi-Fi 6».
const MEASURE_RE = /^\(?\d+([.,]\d+)?[-–]?\d*(мп|mp|мм|mm|м|m|u|кг|kg|w|вт|в|v|a|а|ач|ah|гб|gb|тб|tb|ггц|ghz|мгц|mhz|гбит|gbit|мбит|mbit|дб|db|км|km|к|k|p|п|нм|nm|°|%|x|х|шт|pcs|ch|ms)?[)\.,;:]*$/i;
function isModelToken(tok: string): boolean {
    const t = tok.replace(/[()[\],;:]/g, "");
    if (t.length < 4) return false;
    // артикулы без цифр: PXT-OCC-SC, MPO-MPO, SC/UPC — заглавные латинские сегменты через дефис или слэш
    if (/^[A-Z0-9]{2,}([-/][A-Z0-9]{1,})+$/.test(t) && /[A-Z]/.test(t) && t.length >= 5) return true;
    if (!/\d/.test(t) || !/[A-Za-z]/.test(t)) return false;
    if (MEASURE_RE.test(t)) return false;
    return true;
}
/** Обрезка, сохраняющая числовой хвост («…шириной 800 мм, глубиной 1200 мм», «…, высота 2U»):
 *  у товаров без кода модели различия сидят именно в размерах в конце, и обычная обрезка
 *  справа делала карточки одинаковыми. Снимаем слова головы справа, хвост (с описательного
 *  слова перед первым числом) не трогаем. null — если так не помещается. */
function tailPreservingCut(words: string[], max: number): string | null {
    const di = words.findIndex((x, i) => i >= 1 && /\d/.test(x));
    if (di < 1) return null;
    const tailFrom = di - 1;
    const tail = words.slice(tailFrom).join(" ");
    if (visualLength(tail) > max * 0.9) return null;
    let head = words.slice(0, tailFrom);
    while (head.length > 0) {
        const h = trimDangling(head.join(" "));
        if (h && visualLength(`${h} ${tail}`) <= max) return `${h} ${tail}`;
        head = h ? h.split(" ").slice(0, -1) : head.slice(0, -1);
    }
    return null;
}
/** Индекс (в словах) первого кода модели в строке, либо -1. */
function modelWordIndex(words: string[]): number {
    return words.findIndex(isModelToken);
}

/** Обрезка по слову слева направо до max, без многоточия (его дорисует сам поисковик). */
function wordCut(s: string, max: number): string {
    let cut = "";
    for (const ch of s) {
        if (visualLength(cut + ch) > max) break;
        cut += ch;
    }
    const sp = cut.lastIndexOf(" ");
    return trimDangling(sp > max * 0.6 ? cut.slice(0, sp) : cut);
}

/** Заголовок ≤ TITLE_MAX (по ширине): полный текст + « — SAT Solutions» → полный + « | SAT» →
 *  полный без бренда → часть до последней естественной границы, в которую бренд ещё влезает →
 *  обрезка по слову. Бренд в конце снимается и приписывается заново; если бренд уже внутри
 *  текста (главная, страницы партнёров) — второй раз не добавляется.
 *  Код модели неприкосновенен: по артикулам идёт основной трафик карточек (56,7 тыс. показов за
 *  90 дней), и обрезка «…4МП Hikvision» делала 148 карточек RU одинаковыми. Если граница срезает
 *  код — вместо этого снимаем описательные слова слева («Цилиндрическая IP-камера 4МП Hikvision
 *  DS-2CD1047G2H-LIUF/SRB(2.8mm)» → «IP-камера 4МП Hikvision DS-2CD1047G2H-LIUF/SRB(2.8mm)»). */
export function fitTitle(text: string, max = TITLE_MAX): string {
    const core = (text || "").replace(/\s+/g, " ").trim().replace(BRAND_TAIL, "").trim();
    if (!core) return (text || "").trim();
    const w = visualLength;
    const branded = HAS_BRAND.test(core);
    const withBrand = (s: string) => {
        if (branded) return s;
        if (w(s) + " — SAT Solutions".length <= max) return `${s} — SAT Solutions`;
        if (w(s) + " | SAT".length <= max) return `${s} | SAT`;
        return s;
    };
    if (w(core) <= max) return withBrand(core);
    const words = core.split(" ");
    const mi = modelWordIndex(words);
    const model = mi >= 0 ? words[mi] : "";
    // границы: берём самую длинную часть, которая помещается (и не теряет код модели)
    let best = "";
    for (const sep of TITLE_SEPS) {
        let i = core.indexOf(sep);
        while (i !== -1) {
            const part = core.slice(0, i).trim();
            if (i > 15 && w(part) <= max && w(part) > w(best) && (!model || part.includes(model))) best = part;
            i = core.indexOf(sep, i + 1);
        }
    }
    if (best) return withBrand(best);
    if (mi >= 0) {
        // база — часть до первой границы, если код модели в ней, иначе весь текст
        let base = core;
        let firstSep = -1;
        for (const sep of TITLE_SEPS) {
            const i = core.indexOf(sep);
            if (i > 0 && (firstSep === -1 || i < firstSep)) firstSep = i;
        }
        if (firstSep > 0 && core.slice(0, firstSep).includes(model)) base = core.slice(0, firstSep).trim();
        const bw = base.split(" ");
        const bmi = bw.indexOf(model);
        // снимаем описательные слова слева, пока не поместится; код модели и его хвост не трогаем
        let from = 0;
        while (from < bmi && w(bw.slice(from).join(" ")) > max) from++;
        let rest = bw.slice(from);
        // не начинать с обрывка скобки «(внутренняя станция)»
        while (rest.length > 1 && rest[0].startsWith("(") && rest.indexOf(rest.find((x) => x.endsWith(")")) ?? "") >= 0 && !rest[0].endsWith(")")) {
            const close = rest.findIndex((x) => x.endsWith(")"));
            if (close < 0 || close >= rest.length - 1) break;
            rest = rest.slice(close + 1);
        }
        let out = rest.join(" ");
        if (w(out) > max) out = wordCut(out, max); // сам код с хвостом длиннее лимита — режем хвост
        if (from > 0 && out && /^[a-zа-яё]/.test(out)) out = out[0].toUpperCase() + out.slice(1);
        return withBrand(out);
    }
    // без кода модели: сначала попытка сохранить числовой хвост, иначе обрезка по слову
    let base = core;
    for (const sep of TITLE_SEPS) {
        const i = core.indexOf(sep);
        if (i > 15 && (base === core || i < base.length)) base = core.slice(0, i).trim();
    }
    return withBrand(tailPreservingCut(base.split(" "), max) ?? wordCut(core, max));
}

/** Описание ≤ DESC_MAX знаков: по концу предложения, иначе по запятой у конца, иначе по слову.
 *  160, а не 155: у карточек товара описание собирается как текст + хвост с ценой ровно до 158,
 *  и лимит 155 срезал бы у них именно цену. Иероглифы не удваиваем: китайские описания
 *  товаров тоже заканчиваются ценой, а потерь от длинного description у Google нет. */
export function fitDesc(text: string, max = DESC_MAX): string {
    const t = (text || "").replace(/\s+/g, " ").trim();
    return t.length <= max ? t : clipSentence(t, max);
}

/** Применить fitTitle/fitDesc к <title> и meta description страницы; og/twitter не трогаем. */
function fitMeta<T extends Metadata>(m: T): T {
    let out: Metadata = m;
    const t = m.title as any;
    if (typeof t === "string") out = { ...out, title: { absolute: fitTitle(t) } };
    else if (t && typeof t === "object" && typeof t.absolute === "string") out = { ...out, title: { ...t, absolute: fitTitle(t.absolute) } };
    if (typeof m.description === "string") out = { ...out, description: fitDesc(m.description) };
    return out as T;
}

export function withOgUrl<T extends Metadata | null | undefined>(m: T): T {
    if (!m) return m;
    return withOgUrlInner(fitMeta(m as Metadata)) as T;
}

function withOgUrlInner(m: Metadata): Metadata {
    const c = m.alternates?.canonical as string | URL | { url: string | URL } | null | undefined;
    const url = c && typeof c === "object" && "url" in c ? c.url : c;
    if (!url) return m;
    if (m.openGraph) {
        if ((m.openGraph as any).url) return m;
        return { ...m, openGraph: { ...m.openGraph, url } };
    }
    const path = new URL(String(url), siteUrl).pathname.split("/")[1];
    const locale = ["uz", "en", "tr", "zh"].includes(path) ? path : "ru";
    const t = m.title as any;
    const title = typeof t === "string" ? t : t?.absolute ?? t?.default ?? site.name;
    return {
        ...m,
        openGraph: {
            type: "website",
            url,
            siteName: site.name,
            locale: OG_LOCALE[locale],
            title,
            description: typeof m.description === "string" ? m.description : site.description,
            images: [{ url: site.defaultOgImagePath, width: 1200, height: 630, alt: site.name }],
        },
    };
}

export function createMetadata(overrides?: Partial<Metadata>): Metadata {
    const title = overrides?.title || {
        default: site.name,
        template: `%s — ${site.name}`
    };

    const description = typeof overrides?.description === 'string'
        ? overrides.description
        : site.description;

    // og:url = canonical страницы. Раньше здесь всегда стоял адрес главной: 16 270 карточек
    // товаров и страницы без своего openGraph (наследуют layout) отдавали og:url=https://satsolutions.uz
    // (сплошной обход 02.10.2026). Нет canonical (layout) — og:url не ставим вовсе, чтобы его не
    // наследовали дочерние страницы.
    const canonical = overrides?.alternates?.canonical as string | URL | { url: string | URL } | null | undefined;
    const ogUrl = (overrides?.openGraph as any)?.url
        ?? (canonical && typeof canonical === 'object' && 'url' in canonical ? canonical.url : canonical)
        ?? undefined;

    return {
        metadataBase: new URL(siteUrl),
        title,
        description,
        // meta keywords убраны 18.09.2026: поисковики их не учитывают, а русский
        // список на китайских и турецких страницах смешивал языковой сигнал.
        authors: [{ name: "SAT Solutions" }],
        creator: "SAT Solutions",
        publisher: "SAT Solutions",
        // Подтверждение владения для Bing Webmaster Tools (кабинет заведён 10.09.2026).
        // Тег нужен постоянно: Bing периодически перепроверяет владение и снимает сайт,
        // если подтверждение исчезло. Индекс Bing — источник ответов поиска ChatGPT и Copilot.
        // Ahrefs Webmaster Tools (09.10.2026): бесплатный аудит и ссылочный профиль; тег тоже не удалять.
        verification: { other: { "msvalidate.01": "8B426810555837A71D264757187B02D2", "ahrefs-site-verification": "db4a4c401a23703d68b780e598c8c75ddbfaaf46d0b944bc6711a8bf27983e6f" } },
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        icons: {
            icon: [
                { url: "/icon.png", type: "image/png", sizes: "192x192" },
                { url: "/favicon.ico", sizes: "any" },
            ],
            apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
        },
        alternates: overrides?.alternates,
        openGraph: {
            type: "website",
            locale: (overrides?.openGraph as any)?.locale ?? site.locale,
            ...(ogUrl ? { url: ogUrl } : {}),
            siteName: site.name,
            title: typeof overrides?.openGraph?.title === 'string' ? overrides.openGraph.title : site.name,
            description: typeof overrides?.openGraph?.description === 'string' ? overrides.openGraph.description : site.description,
            images: overrides?.openGraph?.images || [
                {
                    url: site.defaultOgImagePath,
                    width: 1200,
                    height: 630,
                    alt: site.name,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            // twitter по умолчанию повторяет og (иначе при шере товара/категории в X — обезличенная карточка)
            title: typeof overrides?.twitter?.title === 'string'
                ? overrides.twitter.title
                : (typeof overrides?.openGraph?.title === 'string' ? overrides.openGraph.title : site.name),
            description: typeof overrides?.twitter?.description === 'string'
                ? overrides.twitter.description
                : (typeof overrides?.openGraph?.description === 'string' ? overrides.openGraph.description : site.description),
            images: overrides?.twitter?.images || overrides?.openGraph?.images || [site.defaultOgImagePath],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}
