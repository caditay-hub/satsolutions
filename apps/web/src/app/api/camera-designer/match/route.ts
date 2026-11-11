import { NextResponse, type NextRequest } from "next/server";
import opticsData from "@/data/cameraOptics.json";
import { getProductBySlug } from "@/lib/api";
import { OUTDOOR_IP, ipRating, matchCameras, type LensKind, type MatchItem, type OpticsCamera } from "@/lib/cameraDesigner/match";
import { LIMITS, inRange } from "@/lib/cameraDesigner/optics";
import { resolveImageUrl } from "@/lib/image";
import { priceInfo } from "@/lib/product";
import { localizeProductName } from "@/lib/productI18n";
import { routing } from "@/i18n/routing";

// Подбор камер каталога под задачу калькулятора объектива (SAT Camera Designer, этап B).
// Оптика — apps/web/src/data/cameraOptics.json (этап B0, только данные из документации
// производителя). Цена, наличие и фото — из API на момент запроса, только для показываемых
// камер: снятые с публикации и переименованные выпадают сами (API отвечает 404).
// Ссылки на документы производителя наружу не отдаём (правило сайта: без ссылок на чужие сайты).
// Редизайн, часть 2 (11.11): env=outdoor (улица, парковка, вход) — подходящими считаются камеры с
// IP66+ в карточке товара, камеры без кода защиты идут отдельной группой noIp («уточним»).

const CAMERAS = (opticsData as unknown as { cameras: OpticsCamera[] }).cameras;
const SHOW = { verified: 8, review: 6, noIp: 6 } as const;

export type MatchCard = Omit<MatchItem, "flags" | "notes" | "score"> & {
  name: string;
  price: string | null;
  inStock: boolean;
  image: string | null;
  wideDistortion: boolean;
  reviewNote: boolean;
  /** Степень защиты корпуса из карточки (66 = IP66), null — не указана. */
  ip: number | null;
};

// Сколько лучших по оптике камер дополняем ценой/наличием перед окончательной сортировкой
// (для улицы — больше: часть отсеется по защите корпуса).
const POOL = 30, POOL_OUTDOOR = 60;
const SPECIAL_RE = /ANPR|LPR|взрыво|explosion|-XE\d|4G|солнеч|solar/i;

async function enrich(items: MatchItem[], limit: number, locale: string, pool0 = POOL): Promise<MatchCard[]> {
  // запас под снятые с публикации и под вторичную сортировку по наличию и цене
  const pool = items.slice(0, Math.max(pool0, limit));
  const got = await Promise.all(pool.map(async (m) => {
    try {
      const { product: p } = await getProductBySlug(m.slug);
      if (!p || p.published === false) return null;
      const info = priceInfo(p);
      return {
        ...m,
        name: localizeProductName(p, locale),
        price: !p.isUsd && info?.kind === "value" ? info.value : null,
        inStock: p.inStock !== false,
        image: resolveImageUrl(p.coverImageUrl),
        wideDistortion: m.flags.includes("wide_distortion"),
        reviewNote: m.group === "review",
        ip: ipRating(`${JSON.stringify(p.characteristics ?? {})} ${p.name}`),
        priceNum: !p.isUsd && Number(p.price) > 0 ? Number(p.price) : Infinity,
        // специальные исполнения — после типовых: ANPR, взрывозащита, автономные 4G/солнечные
        special: SPECIAL_RE.test(`${p.name} ${m.model}`),
      };
    } catch {
      return null;
    }
  }));
  // Порядок: типовые камеры раньше специальных → оценка оптики (округлённая до 0,1 — мелкие
  // различия не решают) → в наличии → цена по возрастанию. Цена и наличие решают только среди
  // равноценных по задаче; специальные остаются в выдаче, но не вытесняют типовые решения.
  const bucket = (s: number) => Math.round(s * 10);
  return got.filter((x): x is NonNullable<typeof x> => !!x)
    .sort((a, b) => Number(a.special) - Number(b.special) || bucket(b.score) - bucket(a.score) || Number(b.inStock) - Number(a.inStock) || a.priceNum - b.priceNum)
    .slice(0, limit)
    .map(({ flags: _f, notes: _n, score: _s, priceNum: _p, special: _sp, ...card }) => card);
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const num = (k: string) => (sp.get(k) && /^\d{1,6}(\.\d{1,4})?$/.test(sp.get(k)!) ? Number(sp.get(k)) : NaN);
  const depthM = num("d"), widthM = num("w"), ppm = num("ppm");
  const kind = (["all", "fixed", "zoom"] as const).includes(sp.get("kind") as LensKind) ? (sp.get("kind") as LensKind) : "all";
  const locale = (routing.locales as readonly string[]).includes(sp.get("locale") || "") ? (sp.get("locale") as string) : routing.defaultLocale;
  const headers = { "X-Robots-Tag": "noindex" };
  if (!inRange(depthM, LIMITS.depthM) || !inRange(widthM, LIMITS.widthM) || !inRange(ppm, LIMITS.ppm)) {
    return NextResponse.json({ error: "bad_params" }, { status: 400, headers });
  }
  const outdoor = sp.get("env") === "outdoor";
  const r = matchCameras(CAMERAS, { depthM, widthM, ppm, kind });
  if (!outdoor) {
    const [verified, review] = await Promise.all([enrich(r.verified, SHOW.verified, locale), enrich(r.review, SHOW.review, locale)]);
    return NextResponse.json(
      { verified, review, noIp: [], totals: { verified: r.verified.length, review: r.review.length, noIp: 0 }, rejected: r.rejected },
      { headers: { ...headers, "Cache-Control": "public, max-age=300" } },
    );
  }
  // улица: подходят по оптике И IP66+ в карточке; без кода защиты — отдельно; ниже IP66 — не показываем
  const [all, review] = await Promise.all([enrich(r.verified, POOL_OUTDOOR, locale, POOL_OUTDOOR), enrich(r.review, SHOW.review, locale)]);
  const ok = all.filter((c) => c.ip !== null && c.ip >= OUTDOOR_IP);
  const noIp = all.filter((c) => c.ip === null);
  return NextResponse.json(
    {
      verified: ok.slice(0, SHOW.verified), review, noIp: noIp.slice(0, SHOW.noIp),
      // сколько проверено по защите: только камеры, дополненные данными карточки (лучшие по оптике)
      totals: { verified: ok.length, review: r.review.length, noIp: noIp.length },
      rejected: r.rejected,
    },
    { headers: { ...headers, "Cache-Control": "public, max-age=300" } },
  );
}
