import data from "@/data/estimateEquipment.json";
import { getProducts } from "@/lib/api";
import { localizeProductName } from "@/lib/productI18n";
import type { Equipment, PoeStd } from "./estimate";

// Оборудование для сметы (SAT Camera Designer, этап D): характеристики из estimateEquipment.json
// (этап D0, только verified — совпали страница и datasheet производителя) + название на языке
// страницы, цена в сумах и наличие из API на момент запроса. Общий для API сметы и превью на главной.

const D = data as unknown as {
  cables: Equipment["cables"];
  rj45: Equipment["rj45"];
  gofra: Equipment["gofra"];
  recorders: (Equipment["recorders"][number] & { status: string })[];
  switches: (Equipment["switches"][number] & { status: string })[];
  ups: { slug: string; status: string; w: number; va: number }[];
  hdds: { slug: string; status: string; tb: number; surveillance: boolean }[];
  cameraPower: Record<string, { w: number | null; poe: PoeStd; status: string }>;
};
const ok = (x: { status: string }) => x.status === "verified";
const pick = <T extends object, K extends keyof T>(o: T, keys: K[]) => Object.fromEntries(keys.map((k) => [k, o[k]])) as Pick<T, K>;

const EQUIPMENT: Equipment = {
  recorders: D.recorders.filter(ok).map((r) => pick(r, ["slug", "brand", "model", "kind", "channels", "bandwidthMbps", "maxMP", "bays", "maxTbPerBay", "poePorts", "poeBudgetW", "poeAt", "powerW"])),
  switches: D.switches.filter(ok).map((s) => pick(s, ["slug", "brand", "model", "poePorts", "budgetW", "at", "hiPoe", "powerW"])),
  hdds: D.hdds.filter(ok).map((h) => pick(h, ["slug", "tb", "surveillance"])),
  ups: D.ups.filter(ok).map((u) => pick(u, ["slug", "w", "va"])),
  cables: D.cables,
  rj45: D.rj45,
  gofra: D.gofra,
};
const SLUGS = [
  ...EQUIPMENT.recorders, ...EQUIPMENT.switches, ...EQUIPMENT.hdds, ...EQUIPMENT.ups, ...EQUIPMENT.cables,
  ...(EQUIPMENT.rj45 ? [EQUIPMENT.rj45] : []), ...(EQUIPMENT.gofra ? [EQUIPMENT.gofra] : []),
].map((x) => x.slug);
const CATS = [...new Set([...D.recorders, ...D.switches, ...D.hdds, ...D.ups, ...D.cables, D.rj45, D.gofra].filter(Boolean).map((x) => (x as { cat?: string }).cat).filter((c): c is string => !!c))];
// потребление камер для бюджета PoE: verified — оба документа, needs_review — с пометкой «оценка»
const POWER = Object.fromEntries(Object.entries(D.cameraPower).map(([k, v]) => [k, { w: v.w, poe: v.poe, review: v.status !== "verified" }]));

export type EquipmentResponse = {
  equipment: Equipment;
  prices: Record<string, { price: number | null; inStock: boolean; name: string }>;
  power: Record<string, { w: number | null; poe: PoeStd; review: boolean }>;
};

/**
 * Цены — списком по разделам каталога (≈9 запросов), а не по товару: 140 запросов разом
 * упирались в ограничение частоты API, и часть позиций молча выпадала из подбора.
 * revalidate — для страниц с ISR (главная): списки разделов детерминированы, их можно кэшировать.
 */
export async function loadEquipment(locale: string, revalidate?: number): Promise<{ body: EquipmentResponse; failed: boolean }> {
  const want = new Set(SLUGS);
  const lists = await Promise.all(CATS.map((category) => getProducts(1, 500, { category }, revalidate).then((r) => r.items).catch(() => null)));
  const prices: EquipmentResponse["prices"] = {};
  for (const items of lists) for (const p of items ?? []) {
    if (!want.has(p.slug) || p.published === false) continue;
    const n = Number(p.price);
    prices[p.slug] = { price: !p.isUsd && n > 0 ? n : null, inStock: p.inStock !== false, name: localizeProductName(p, locale) };
  }
  // снятые с публикации — из подбора убираем
  const alive = (x: { slug: string }) => !!prices[x.slug];
  const equipment: Equipment = {
    ...EQUIPMENT,
    recorders: EQUIPMENT.recorders.filter(alive), switches: EQUIPMENT.switches.filter(alive), hdds: EQUIPMENT.hdds.filter(alive),
    ups: EQUIPMENT.ups.filter(alive), cables: EQUIPMENT.cables.filter(alive),
    rj45: EQUIPMENT.rj45 && alive(EQUIPMENT.rj45) ? EQUIPMENT.rj45 : null, gofra: EQUIPMENT.gofra && alive(EQUIPMENT.gofra) ? EQUIPMENT.gofra : null,
  };
  return { body: { equipment, prices, power: POWER }, failed: lists.some((l) => l === null) };
}
