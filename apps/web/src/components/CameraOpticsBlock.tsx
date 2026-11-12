// Блок «Угол обзора и дальности DORI» на карточке камеры (SAT Camera Designer, этап B).
// Серверный компонент: текст и цифры в HTML — работают на запросы по артикулу («… 2.8mm угол обзора»).
// Данные — apps/web/src/data/cameraOptics.json (этап B0: углы из документации производителя);
// дальности считает то же ядро, что калькулятор. Ссылок на сайты производителей нет (правило сайта).
import { Link } from "@/i18n/navigation";
import opticsData from "@/data/cameraOptics.json";
import { DEFAULT_INPUT, type CalcInput } from "@/lib/cameraDesigner/calculate";
import { catalogContentFor } from "@/lib/cameraDesigner/catalogContent";
import { contentFor } from "@/lib/cameraDesigner/content";
import type { OpticsCamera } from "@/lib/cameraDesigner/match";
import { depthForPpm, opticsFromFov } from "@/lib/cameraDesigner/optics";
import { toQuery } from "@/lib/cameraDesigner/query";
import { PROFILES } from "@/lib/cameraDesigner/standards";

const BY_ID = new Map((opticsData as unknown as { cameras: OpticsCamera[] }).cameras.map((c) => [c.productId, c]));
const DORI = PROFILES["2014"].levels.filter((l) => l.base);
const DEC: Record<string, string> = { en: ".", zh: "." };
const num = (locale: string, v: number, frac = 1) => String(Math.round(v * 10 ** frac) / 10 ** frac).replace(".", DEC[locale] ?? ",");

/** Есть ли у товара данные для блока — чтобы страница могла не рендерить пустое место. */
export const hasCameraOptics = (productId: string) => {
  const c = BY_ID.get(productId);
  return !!c && (c.status === "verified" || c.status === "needs_review") && c.variants.length > 0;
};

export function CameraOpticsBlock({ productId, locale }: { productId: string; locale: string }) {
  const cam = BY_ID.get(productId);
  if (!cam || !hasCameraOptics(productId)) return null;
  const t = catalogContentFor(locale).product;
  const levels = contentFor(locale).levels;
  const nx = cam.widthPx, ny = cam.heightPx;
  const u = t.units;

  // строки: фиксированный объектив — одна, вариофокал/PTZ — широкий и узкий край
  const rows = cam.variants.flatMap((v) => {
    const f = v.focalMm;
    const zoom = !!f && f[0] !== f[1];
    const ends = zoom ? [0, 1] : [0];
    return ends.map((i) => ({
      key: `${f ? f.join("-") : "x"}-${i}`,
      lens: f ? `${num(locale, f[i])} ${u.mm}${zoom ? ` (${i === 0 ? t.wide : t.tele})` : ""}` : "—",
      h: v.hfovDeg[i], vv: v.vfovDeg ? v.vfovDeg[i] : null,
    }));
  });

  // дальности уровней DORI для каждой строки (то же ядро, что калькулятор)
  const data = rows.map((r) => {
    const o = nx && ny ? opticsFromFov({ hfovDeg: r.h, vfovDeg: r.vv, nx, ny }) : null;
    return {
      key: r.key, lens: r.lens,
      fov: `${num(locale, r.h)}°${r.vv ? ` × ${num(locale, r.vv)}°` : ""}`,
      dori: nx ? DORI.map((l) => {
        const d = o ? depthForPpm(o, l.ppm) : null;
        // дальше километра решают атмосфера и подсветка, а не пиксели — точную цифру не показываем
        return { code: l.code, txt: !d ? "—" : d > 1000 ? `> 1000 ${u.m}` : `${num(locale, d, d >= 100 ? 0 : 1)} ${u.m}` };
      }) : [],
    };
  });

  // ссылка в калькулятор с параметрами этой модели (первый вариант объектива)
  const v0 = cam.variants[0];
  const f0 = v0.focalMm;
  const zoom0 = !!f0 && f0[0] !== f0[1];
  const calcInput: CalcInput = {
    ...DEFAULT_INPUT,
    // задача по умолчанию — как в простом режиме калькулятора: «действия человека»
    lvl: "observe",
    nx: nx ?? DEFAULT_INPUT.nx, ny: ny ?? DEFAULT_INPUT.ny,
    ...(zoom0 && f0
      ? { lens: "vari", fmin: f0[0], fmax: f0[1], hw: v0.hfovDeg[0], ht: v0.hfovDeg[1], f: f0[0] }
      : { lens: "fixed", hfov: v0.hfovDeg[0], vfov: v0.vfovDeg ? v0.vfovDeg[0] : null, f: f0 ? f0[0] : DEFAULT_INPUT.f }),
  };

  return (
    <section className="mt-4 overflow-hidden rounded-xl border border-slate-200">
      <h2 className="font-body bg-slate-50 px-4 py-2 text-sm font-semibold">{t.title}</h2>
      <div className="bg-white px-4 py-3">
        <p className="text-[13px] leading-relaxed text-slate-600">{t.lead}</p>
        {/* Таблица — с 640 px; на телефоне — строка объектива и сетка 2×2 дальностей: таблица в шесть
            колонок либо растягивала карточку (страница 521 px при экране 375), либо рвала заголовки
            посреди слова. */}
        <table className="mt-3 hidden w-full border-collapse text-sm sm:table">
          <thead>
            <tr className="border-b border-slate-200 text-left text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <th className="py-2 pr-3">{t.colLens}</th>
              <th className="py-2 pr-3">{t.colFov}</th>
              {nx ? DORI.map((l) => <th key={l.code} className="py-2 pr-3 text-right">{levels[l.code].name}</th>) : null}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.key} className="border-b border-slate-100 last:border-0">
                <td className="py-2 pr-3 font-semibold text-slate-800">{r.lens}</td>
                <td className="py-2 pr-3 tabular-nums text-slate-700">{r.fov}</td>
                {r.dori.map((d) => <td key={d.code} className="py-2 pr-3 text-right tabular-nums text-slate-700">{d.txt}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 space-y-3 sm:hidden">
          {data.map((r) => (
            <div key={r.key} className="rounded-lg border border-slate-100 p-3">
              <div className="text-[13px] font-semibold text-slate-800">{r.lens} · <span className="tabular-nums font-normal text-slate-700">{r.fov}</span></div>
              {r.dori.length ? (
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
                  {r.dori.map((d) => (
                    <div key={d.code}>
                      <dt className="text-[11px] text-slate-500">{levels[d.code].name}</dt>
                      <dd className="text-[13px] font-semibold tabular-nums text-slate-800">{d.txt}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
          {cam.status === "verified" && cam.variants.every((v) => v.status === "verified") ? t.verifiedNote : t.reviewNote}
          {cam.flags?.includes("wide_distortion") ? ` ${t.distortion}` : ""}
        </p>
        <Link href={`/tools/camera-lens-calculator?${toQuery(calcInput)}`}
          className="mt-3 inline-flex min-h-[40px] items-center rounded-lg border border-brand-300 bg-brand-50 px-3 py-2 text-xs font-bold text-brand-800 hover:border-brand-500">
          {t.openCalc} →
        </Link>
      </div>
    </section>
  );
}
