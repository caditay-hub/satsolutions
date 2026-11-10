import { NextResponse, type NextRequest } from "next/server";
import opticsData from "@/data/cameraOptics.json";
import { getProductBySlug } from "@/lib/api";
import type { OpticsCamera } from "@/lib/cameraDesigner/match";
import { resolveImageUrl } from "@/lib/image";
import { priceInfo } from "@/lib/product";
import { localizeProductName } from "@/lib/productI18n";
import { routing } from "@/i18n/routing";

// Камеры каталога для плана объекта (SAT Camera Designer, этап C).
// Без параметров — компактный список камер с углами из документации (verified и needs_review):
// по нему редактор ищет модель и копирует углы в проект. С ?slugs= — название на языке
// страницы, цена, наличие и фото для таблицы камер под планом (только камеры из списка).
// Ссылки на документы производителя наружу не отдаём (правило сайта).

type Raw = OpticsCamera & { variants: (OpticsCamera["variants"][number] & { focalMm: [number, number] | null })[] };
const CAMERAS = (opticsData as unknown as { cameras: Raw[] }).cameras;

export type PlanCatalogCamera = {
  slug: string;
  brand: string;
  model: string;
  kind?: string;
  lensType: "fixed" | "varifocal" | "ptz";
  status: "verified" | "needs_review";
  nx: number;
  ny: number;
  variants: { focalMm: [number, number] | null; hfovDeg: [number, number]; vfovDeg: [number, number] | null; status: "verified" | "needs_review" }[];
  distortion?: boolean;
};

export type PlanCameraInfo = { slug: string; name: string; price: string | null; priceNum: number | null; inStock: boolean; image: string | null };

const LIST: PlanCatalogCamera[] = CAMERAS
  .filter((c) => (c.status === "verified" || c.status === "needs_review") && c.lensType && c.widthPx && c.heightPx && c.variants.length)
  .map((c) => ({
    slug: c.slug, brand: c.brand, model: c.model, kind: c.kind,
    lensType: c.lensType!, status: c.status as "verified" | "needs_review",
    nx: c.widthPx!, ny: c.heightPx!,
    variants: c.variants.map((v) => ({ focalMm: v.focalMm, hfovDeg: v.hfovDeg, vfovDeg: v.vfovDeg, status: v.status })),
    ...(c.flags?.includes("wide_distortion") ? { distortion: true } : {}),
  }));
const KNOWN = new Set(LIST.map((c) => c.slug));

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const headers = { "X-Robots-Tag": "noindex" };
  const raw = sp.get("slugs");
  if (raw === null) {
    return NextResponse.json({ cameras: LIST }, { headers: { ...headers, "Cache-Control": "public, max-age=3600" } });
  }
  const slugs = [...new Set(raw.split(",").map((s) => s.trim()).filter(Boolean))];
  if (slugs.length > 64 || slugs.some((s) => !KNOWN.has(s))) return NextResponse.json({ error: "bad_params" }, { status: 400, headers });
  const locale = (routing.locales as readonly string[]).includes(sp.get("locale") || "") ? (sp.get("locale") as string) : routing.defaultLocale;
  const info = await Promise.all(slugs.map(async (slug): Promise<PlanCameraInfo | null> => {
    try {
      const { product: p } = await getProductBySlug(slug);
      if (!p || p.published === false) return null;
      const pi = priceInfo(p);
      return {
        slug,
        name: localizeProductName(p, locale),
        price: !p.isUsd && pi?.kind === "value" ? pi.value : null,
        // для суммы в таблице: только цена в сумах, как она показана на карточке
        priceNum: !p.isUsd && pi?.kind === "value" && Number(p.price) > 0 ? Number(p.price) : null,
        inStock: p.inStock !== false,
        image: resolveImageUrl(p.coverImageUrl),
      };
    } catch {
      return null;
    }
  }));
  return NextResponse.json({ info: info.filter(Boolean) }, { headers: { ...headers, "Cache-Control": "public, max-age=300" } });
}
