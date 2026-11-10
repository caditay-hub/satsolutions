// B0, проход 4: поверх автоматической сверки — (1) правило «PDF того же семейства»,
// (2) ручные решения из review_decisions.json. Итог — b0_final.json.
const fs = require('fs'), path = require('path');
const { extract } = require('./verify.cjs');
const { plausibility } = require('./parse.cjs');
const DIR = __dirname;
const res = JSON.parse(fs.readFileSync(path.join(DIR, 'b0_result.json'), 'utf8'));
const dec = JSON.parse(fs.readFileSync(path.join(DIR, 'review_decisions.json'), 'utf8'));
const fkey = (f) => (f ? `${f[0]}-${f[1]}` : '?');
const same = (a, b) => JSON.stringify([a.hfovDeg ?? a.h, a.vfovDeg ?? a.v]) === JSON.stringify([b.h ?? b.hfovDeg, b.v ?? b.vfovDeg]);
const pickDecision = (model) => {
  const keys = Object.keys(dec).filter((k) => !k.startsWith('_') && model.includes(k)).sort((a, b) => b.length - a.length);
  return keys.length ? { key: keys[0], ...dec[keys[0]] } : null;
};

for (const r of res) {
  r.flags = [];
  if (r.cardLensConflict) r.flags.push('card_lens_conflict');
  // (1) PDF соседнего исполнения: документ есть, но в нём базовый код семейства (…-LI вместо …-LI2UY).
  // Принимаем вариант, только если фокус и углы совпали со страницей до градуса.
  const pdfTxtFile = path.join(DIR, 'pdf', `${r.slug}.txt`);
  if (r.reasons.includes('нет PDF-datasheet') && fs.existsSync(pdfTxtFile) && r.variants.length) {
    const fam = extract(fs.readFileSync(pdfTxtFile, 'utf8'));
    const famModel = (fs.readFileSync(pdfTxtFile, 'utf8').match(/\b(?:i?DS|IPC|DH|SD|HAC)-[A-Z0-9-]+/i) || [''])[0];
    let all = true;
    for (const v of r.variants) {
      const twin = fam.variants.find((x) => fkey(x.f) === fkey(v.focalMm));
      if (twin && same(v, twin)) v.notes = v.notes.filter((q) => !/PDF/.test(q));
      else all = false;
    }
    if (all) {
      r.reasons = r.reasons.filter((q) => q !== 'нет PDF-datasheet');
      r.flags.push('family_pdf');
      r.familyPdfModel = famModel;
    }
  }
  // (2) ручные решения
  const d = pickDecision(r.model);
  if (d) {
    r.decision = d.note;
    if (d.unsupported) { r.status = 'unsupported'; r.unsupported = d.unsupported; continue; }
    if (d.review) { r.status = 'needs_review'; continue; }
    if (d.override) {
      // ручная сверка закрывает и «конфликт объектива»: вариант выбран по документам глазами
      r.cardLensConflict = null;
      r.flags = r.flags.filter((f) => f !== 'card_lens_conflict');
      r.variants = d.override.map((o) => ({ ...o, status: 'verified', notes: [] }));
      r.reasons = r.reasons.filter((q) => !/нет углов|не найден/.test(q));
    }
    if (d.rejectFocal) r.variants.forEach((v) => { if (d.rejectFocal.includes(fkey(v.focalMm))) { v.status = 'rejected'; v.notes = [d.note]; } });
    if (d.accept) r.variants.forEach((v) => { if (v.status !== 'rejected') v.notes = v.notes.filter((q) => !/эквив|V\/H/.test(q)); });
    if (d.flag) r.flags.push(d.flag);
  }
  // пересчёт статусов вариантов и карточки
  for (const v of r.variants) if (v.status !== 'rejected') v.status = v.notes.length || r.reasons.length ? 'needs_review' : 'verified';
  const live = r.variants.filter((v) => v.status !== 'rejected');
  r.status = !live.length ? (r.variants.length ? 'needs_review' : 'no_data') : live.every((v) => v.status === 'verified') ? 'verified' : 'needs_review';
}
fs.writeFileSync(path.join(DIR, 'b0_final.json'), JSON.stringify(res, null, 1));
const c = (f) => res.reduce((a, x) => ((a[f(x)] = (a[f(x)] || 0) + 1), a), {});
console.log('итог', c((x) => x.status));
console.log('флаги', c((x) => x.flags.join('+') || '—'));
