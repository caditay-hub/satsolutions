// B0: экспорт результата сверки в репозиторий.
//   apps/web/src/data/cameraOptics.json — данные для калькулятора и подбора (этап B)
//   reports/camera-designer/b0_cards.csv  — построчный отчёт для владельца
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const REPO = 'D:/sat_web_github';
const res = JSON.parse(fs.readFileSync(path.join(DIR, 'b0_final.json'), 'utf8'));

const lensType = (c) => {
  // PTZ — только при диапазоне углов; поворотная PT-камера с фиксированным объективом — «fixed»
  const v = c.variants.filter((x) => x.status !== 'rejected');
  const zoom = v.some((x) => (x.focalMm && x.focalMm[0] !== x.focalMm[1]) || (x.hfovDeg && x.hfovDeg[0] !== x.hfovDeg[1]));
  return !zoom ? 'fixed' : c.kind === 'ptz' ? 'ptz' : 'varifocal';
};
const round = (a) => (a ? a.map((x) => Math.round(x * 100) / 100) : null);

const cameras = res
  .filter((c) => c.status !== 'no_data')
  .map((c) => ({
    productId: c.productId,
    slug: c.slug,
    brand: c.brand,
    model: c.model,
    kind: c.kind, // ip | analog | ptz | fisheye | thermal — по разделу каталога
    status: c.status, // verified | needs_review | unsupported
    ...(c.status === 'unsupported' ? { unsupported: c.unsupported } : {}),
    lensType: c.status === 'unsupported' ? null : lensType(c),
    widthPx: c.widthPx,
    heightPx: c.heightPx,
    sensorFormat: c.sensorFormat,
    variants: c.status === 'unsupported' ? [] : c.variants.filter((v) => v.status !== 'rejected').map((v) => ({
      focalMm: round(v.focalMm), hfovDeg: round(v.hfovDeg), vfovDeg: round(v.vfovDeg), dfovDeg: round(v.dfovDeg),
      status: v.status,
      ...(v.notes && v.notes.length ? { notes: v.notes } : {}),
      ...(v.info && v.info.length ? { info: v.info } : {}),
    })),
    flags: c.flags && c.flags.length ? c.flags : undefined,
    cardLensConflict: c.cardLensConflict || undefined,
    reasons: c.reasons && c.reasons.length && c.status !== 'verified' ? c.reasons : undefined,
    decision: c.decision || undefined,
    sourcePage: c.sourcePage || null,
    sourcePdf: c.sourcePdf || null,
    familyPdfModel: c.familyPdfModel || undefined,
    checkedAt: c.checkedAt,
  }));

const count = (s) => res.filter((c) => c.status === s).length;
const out = {
  version: 'cd-optics-data-1',
  generatedAt: new Date().toISOString().slice(0, 10),
  method: 'Углы — из официальной страницы производителя и официального PDF-datasheet той же модели (с ревизией, если указана); verified = оба документа совпали (допуск 1°, с заметкой) и арифметика правдоподобна. Процесс и ручные решения: docs/camera-designer/04-CATALOG-MAPPING.md',
  totals: { cards: res.length, verified: count('verified'), needs_review: count('needs_review'), unsupported: count('unsupported'), no_data: count('no_data') },
  cameras,
};
// правило проекта: запись в репозиторий — только по флагу --apply, без него — сухой прогон
const APPLY = process.argv.includes('--apply');
if (!APPLY) { console.log('сухой прогон:', out.totals, '— для записи запустите с --apply'); process.exit(0); }
fs.writeFileSync(path.join(REPO, 'apps/web/src/data/cameraOptics.json'), JSON.stringify(out, null, 1) + '\n');

const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
const rows = [['status', 'brand', 'model', 'slug', 'variants (фокус: H/V)', 'flags', 'причины/заметки', 'конфликт карточки', 'страница', 'PDF'].map(esc).join(',')];
for (const c of res) {
  rows.push([
    c.status, c.brand, c.model, c.slug,
    c.variants.map((v) => `${v.focalMm ? v.focalMm.join('–') : '?'} мм: ${v.hfovDeg ? v.hfovDeg.join('–') : '?'}°/${v.vfovDeg ? v.vfovDeg.join('–') : '?'}°${v.status === 'rejected' ? ' (отклонён)' : ''}`).join('; '),
    (c.flags || []).join(' '),
    [...(c.reasons || []), ...c.variants.flatMap((v) => [...(v.notes || []), ...(v.info || [])]), c.decision || ''].filter(Boolean).join(' | '),
    c.cardLensConflict || '', c.sourcePage || '', c.sourcePdf || '',
  ].map(esc).join(','));
}
fs.mkdirSync(path.join(REPO, 'reports/camera-designer'), { recursive: true });
fs.writeFileSync(path.join(REPO, 'reports/camera-designer/b0_cards.csv'), '\ufeff' + rows.join('\n'));
console.log('экспорт:', out.totals, 'в JSON:', cameras.length, 'карточек');
