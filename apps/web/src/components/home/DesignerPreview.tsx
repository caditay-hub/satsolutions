/**
 * Превью проектировщика видеонаблюдения на главной (решение владельца 11.11, вариант А):
 * анимированный пример плана — камеры, зоны обзора, покрытие, смета. Только SVG и CSS, без кода
 * редактора: главная не тяжелеет. Клик открывает полную страницу с этим же примером (?example=office).
 *
 * Геометрия — из lib/cameraDesigner/plan/example.ts, дальности зон — по углам и разрешению камеры
 * примера и порогам IEC 62676-4:2014 (глубина по оси), цвета — как у зон в редакторе. Покрытие и
 * сумму передаёт страница: это расчёт того же примера (exampleCoverage / exampleTotal).
 */
import { Link } from "@/i18n/navigation";
import { EXAMPLE_CAMERA, EXAMPLE_ROOMS, EXAMPLE_SIZE, exampleCameras, type ExampleRoom } from "@/lib/cameraDesigner/plan/example";
import { visibleLevels } from "@/lib/cameraDesigner/standards";
import { levelColor } from "@/lib/cameraDesigner/palette";

export type DesignerPreviewText = {
  kicker: string; title: string; text: string; btn: string; hint: string;
  covered: string; est1: string; est2: string; total: string; totalLine: string;
  storage: string; office: string; hall: string; aria: string;
};

const S = 10; // единиц рисунка на метр
const PAD = 16;
const W = EXAMPLE_SIZE.w * S + PAD * 2;
const H = EXAMPLE_SIZE.h * S + PAD * 2;
const X = (m: number) => PAD + m * S;
const Y = (m: number) => PAD + m * S;

/** Сектор обзора: вершина в камере, радиус — дальность уровня по оси, раствор — горизонтальный угол. */
function sector(cx: number, cy: number, panDeg: number, hfovDeg: number, r: number) {
  const a = ((panDeg - hfovDeg / 2) * Math.PI) / 180, b = ((panDeg + hfovDeg / 2) * Math.PI) / 180;
  const p = (t: number) => `${(cx + r * Math.cos(t)).toFixed(1)} ${(cy + r * Math.sin(t)).toFixed(1)}`;
  return `M${cx.toFixed(1)} ${cy.toFixed(1)}L${p(a)}A${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${p(b)}Z`;
}

const LEVELS = visibleLevels("2014", false); // по возрастанию плотности: обнаружение … идентификация
const HFOV = EXAMPLE_CAMERA.variants[0].hfovDeg[0];
const RANGE = LEVELS.map((l) => EXAMPLE_CAMERA.nx / (2 * Math.tan((HFOV * Math.PI) / 360) * l.ppm)); // м
/** Примерная ширина строки в единицах рисунка: иероглифы вдвое шире латиницы и кириллицы. */
const textW = (s: string, px: number) => [...s].reduce((w, ch) => w + (ch.codePointAt(0)! >= 0x2e80 ? px : px * 0.57), 0);
const roomOf = (x: number, y: number) => EXAMPLE_ROOMS.find((r) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h)!;

// анимация: цикл 8 с — план, камеры по очереди с зонами, покрытие, смета; при «уменьшить движение» — сразу итог
const CSS = `
.dp-plan{animation:dpPlan 8s infinite}
.dp-cam{transform-box:fill-box;transform-origin:center}
.dp-z{transform-box:view-box}
.dp-c1{animation:dpCam1 8s infinite}.dp-c2{animation:dpCam2 8s infinite}.dp-c3{animation:dpCam3 8s infinite}
.dp-z1{animation:dpZ1 8s infinite}.dp-z2{animation:dpZ2 8s infinite}.dp-z3{animation:dpZ3 8s infinite}
.dp-badge{animation:dpBadge 8s infinite}.dp-est{animation:dpEst 8s infinite}
@keyframes dpPlan{0%{opacity:0}7%,90%{opacity:1}100%{opacity:0}}
@keyframes dpCam1{0%,10%{transform:scale(0);opacity:0}13%{transform:scale(1.35);opacity:1}15%,90%{transform:scale(1);opacity:1}100%{opacity:0}}
@keyframes dpCam2{0%,22%{transform:scale(0);opacity:0}25%{transform:scale(1.35);opacity:1}27%,90%{transform:scale(1);opacity:1}100%{opacity:0}}
@keyframes dpCam3{0%,34%{transform:scale(0);opacity:0}37%{transform:scale(1.35);opacity:1}39%,90%{transform:scale(1);opacity:1}100%{opacity:0}}
@keyframes dpZ1{0%,13%{transform:scale(0);opacity:0}23%,90%{transform:scale(1);opacity:1}100%{opacity:0}}
@keyframes dpZ2{0%,25%{transform:scale(0);opacity:0}35%,90%{transform:scale(1);opacity:1}100%{opacity:0}}
@keyframes dpZ3{0%,37%{transform:scale(0);opacity:0}47%,90%{transform:scale(1);opacity:1}100%{opacity:0}}
@keyframes dpBadge{0%,50%{opacity:0;transform:translateY(6px)}55%,90%{opacity:1;transform:none}100%{opacity:0}}
@keyframes dpEst{0%,58%{opacity:0;transform:translateY(8px)}64%,90%{opacity:1;transform:none}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.dp-card svg *{animation:none!important}}
`;

export function DesignerPreview({ t, coverage, total }: { t: DesignerPreviewText; coverage: string; total: string | null }) {
  const cams = exampleCameras();
  const room = (r: ExampleRoom) => ({ storage: t.storage, office: t.office, hall: t.hall })[r.key];
  // подписи помещений — в свободных от зон углах
  const labelAt: Record<ExampleRoom["key"], [number, number]> = { storage: [12.4, 1.6], office: [18.4, 8.1], hall: [26, 17.1] };
  const badgeW = Math.max(96, 30 + textW(t.covered.replace("{p}", coverage), 11.5));
  const totalText = total ? t.total.replace("{v}", total) : "";
  // ширина карточки сметы — по самой длинной строке
  const estW = Math.max(138, 20 + Math.max(textW(t.est1, 9.5), textW(t.est2, 9.5), textW(totalText, 11.5)));
  return (
    <Link href="/tools/camera-lens-calculator?example=office#plan"
      className="dp-card group flex h-full flex-col gap-4 rounded-2xl border border-brand-200 bg-white p-5 shadow-sm transition-colors hover:border-brand-500 sm:p-6">
      <style>{CSS}</style>
      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full rounded-xl bg-[#f4fafb]" role="img" aria-label={t.aria}>
        <defs>
          <pattern id="dpGrid" width={S} height={S} patternUnits="userSpaceOnUse"><path d={`M${S} 0H0V${S}`} fill="none" stroke="#e3eef1" strokeWidth="1" /></pattern>
          {EXAMPLE_ROOMS.map((r) => (
            <clipPath key={r.key} id={`dpRoom-${r.key}`}><rect x={X(r.x)} y={Y(r.y)} width={r.w * S} height={r.h * S} /></clipPath>
          ))}
        </defs>
        <g className="dp-plan">
          <rect x="0" y="0" width={W} height={H} fill="url(#dpGrid)" />
        </g>
        {cams.map((c, i) => {
          const cx = X(c.x), cy = Y(c.y);
          return (
            <g key={c.id} className={`dp-z dp-z${i + 1}`} style={{ transformOrigin: `${cx}px ${cy}px` }} clipPath={`url(#dpRoom-${roomOf(c.x, c.y).key})`}>
              {/* от дальнего уровня к ближнему: ближние темнее и ложатся сверху */}
              {RANGE.map((r, j) => (
                <path key={j} d={sector(cx, cy, c.panDeg, HFOV, Math.min(r, 60) * S)} fill={levelColor(LEVELS.length - 1 - j, LEVELS.length)} opacity={0.75} />
              ))}
            </g>
          );
        })}
        <g className="dp-plan">
          <rect x={X(0)} y={Y(0)} width={EXAMPLE_SIZE.w * S} height={EXAMPLE_SIZE.h * S} rx="3" fill="none" stroke="#334155" strokeWidth="4" />
          <path d={`M${X(15)} ${Y(0)}V${Y(18)}M${X(15)} ${Y(9)}H${X(32)}`} stroke="#334155" strokeWidth="3" fill="none" />
          {EXAMPLE_ROOMS.map((r) => (
            <text key={r.key} x={X(labelAt[r.key][0])} y={Y(labelAt[r.key][1])} fontSize="10" fontWeight="600" fill="#334155"
              stroke="#fff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" textAnchor="middle">{room(r)}</text>
          ))}
        </g>
        {cams.map((c, i) => (
          <g key={c.id} className={`dp-cam dp-c${i + 1}`}>
            <circle cx={X(c.x)} cy={Y(c.y)} r="9" fill="#328fa8" stroke="#fff" strokeWidth="2" />
            <text x={X(c.x)} y={Y(c.y) + 3.5} fontSize="9" fontWeight="700" fill="#fff" textAnchor="middle">{i + 1}</text>
          </g>
        ))}
        <g className="dp-badge">
          <rect x={X(15) + 14} y={Y(9) + 14} width={badgeW} height="26" rx="13" fill="#fff" stroke="#addbe3" />
          <circle cx={X(15) + 30} cy={Y(9) + 27} r="5" fill="#22c55e" />
          <text x={X(15) + 40} y={Y(9) + 31} fontSize="11" fontWeight="700" fill="#0f172a">{t.covered.replace("{p}", coverage)}</text>
        </g>
        {total ? (
          <g className="dp-est max-sm:hidden">
            <rect x={X(0.8)} y={Y(12.6)} width={estW} height="48" rx="8" fill="#fff" stroke="#addbe3" />
            <text x={X(0.8) + 10} y={Y(12.6) + 17} fontSize="9.5" fill="#64748b">{t.est1}</text>
            <text x={X(0.8) + 10} y={Y(12.6) + 29} fontSize="9.5" fill="#64748b">{t.est2}</text>
            <text x={X(0.8) + 10} y={Y(12.6) + 43} fontSize="11" fontWeight="800" fill="#0f172a">{totalText}</text>
          </g>
        ) : null}
      </svg>
      {/* на телефоне подпись сметы внутри рисунка слишком мелкая — сумма обычным текстом */}
      {total ? <p className="-mt-2 text-xs font-semibold text-slate-600 sm:hidden">{t.totalLine.replace("{v}", total)}</p> : null}
      <div>
        <p className="text-[11px] font-black uppercase tracking-widest text-brand-600">{t.kicker}</p>
        <p className="mt-1 text-lg font-black leading-tight text-slate-900 sm:text-2xl">{t.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{t.text}</p>
      </div>
      <div className="mt-auto flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors group-hover:bg-brand-500">{t.btn} →</span>
        <span className="max-w-[240px] text-[11px] leading-snug text-slate-500">{t.hint}</span>
      </div>
    </Link>
  );
}
