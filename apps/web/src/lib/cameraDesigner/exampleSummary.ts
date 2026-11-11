import { getProductBySlug } from "@/lib/api";
import { exampleCoverage, exampleProject } from "./plan/example";
import { makeFmt } from "./format";
import { planContentFor } from "./planContent";
import { cableRun, DEFAULT_CABLE_M } from "./plan/project";
import { estimate, type EstCam, type PriceMap } from "./estimate/estimate";
import { loadEquipment } from "./estimate/equipmentData";

// Цифры превью на главной (решение владельца 11.11): покрытие и итог сметы — настоящий расчёт
// того же примера, что открывается по кнопке, теми же функциями, что и в редакторе плана.
// Покрытие — exampleCoverage() в plan/example.ts (без цен, считается один раз).

/** Нижняя граница итога сметы примера, сум; null — цены не загрузились (превью покажет блок без суммы). */
export async function exampleTotal(locale: string): Promise<number | null> {
  try {
    const p = exampleProject();
    const [{ body, failed }, cam] = await Promise.all([
      loadEquipment(locale, 300),
      getProductBySlug(p.cams[0].spec.slug!).then((r) => r.product).catch(() => null),
    ]);
    const camPrice = cam && !cam.isUsd && Number(cam.price) > 0 ? Number(cam.price) : null;
    if (failed || camPrice === null) return null;
    const cams: EstCam[] = p.cams.map((c) => {
      const pw = body.power[c.spec.slug!];
      return {
        key: c.spec.slug!, slug: c.spec.slug, brand: c.spec.brand, nx: c.spec.nx, ny: c.spec.ny, kind: "ip",
        outdoor: !!c.outdoor, mountM: c.mountM, cableM: p.rack ? cableRun(c, p.rack) : DEFAULT_CABLE_M,
        powerW: pw?.w ?? null, poe: pw?.poe ?? null, powerReview: pw?.review,
      };
    });
    const pm: PriceMap = Object.fromEntries(Object.entries(body.prices).map(([k, v]) => [k, { price: v.price, inStock: v.inStock }]));
    const r = estimate(cams, { [p.cams[0].spec.slug!]: camPrice }, p.est, body.equipment, pm);
    return r.totals.low > 0 ? r.totals.low : null;
  } catch {
    return null;
  }
}

/** Подписи для превью (главная, «Видеонаблюдение»): «96 %» и «от …» — нижняя граница сметы вниз до 10 000 сум. */
export async function examplePreview(locale: string): Promise<{ coverage: string; total: string | null }> {
  const total = await exampleTotal(locale);
  return {
    coverage: `${Math.round(exampleCoverage() * 100)} %`,
    total: total ? planContentFor(locale).money.replace("{v}", makeFmt(locale).num(Math.floor(total / 10000) * 10000, 0)) : null,
  };
}
