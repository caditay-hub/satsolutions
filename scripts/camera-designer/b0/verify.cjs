// B0, проход 3: сверка «страница производителя ↔ PDF-datasheet» по каждой карточке.
// Один и тот же извлекатель для обоих источников; статус verified — только при полном
// совпадении углов и разрешения в двух документах и без замечаний правдоподобия.
const fs = require('fs'), path = require('path');
const { plausibility } = require('./parse.cjs');
const DIR = __dirname;
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const pdfLog = fs.existsSync(path.join(DIR, 'pass2_pdfs.json')) ? JSON.parse(fs.readFileSync(path.join(DIR, 'pass2_pdfs.json'), 'utf8')) : [];
const n = (s) => Number(String(s).replace(',', '.'));
const A = '([\\d.]+)\\s*°(?:\\s*(?:to|-|–|~)\\s*([\\d.]+)\\s*°)?';

/** Все варианты объектива в тексте документа. */
function extract(text) {
  // нормализация записи: «112° (W)–47° (T)», «—», «Horizontal 103° × Vertical 53°»
  const t = text.replace(/\s+/g, ' ').replace(/\s*\((?:W|T|wide|tele|wide\s*-\s*tele|tele\s*-\s*wide)\)/gi, '').replace(/[—―]/g, '–').replace(/°\s*×\s*/g, '°; ').replace(/Horizontal\s*:\s*H\s*:/gi, 'H:');
  const vars = [];
  // Hikvision: «2.8 mm, horizontal FOV 98°, vertical FOV 54°, diagonal FOV 114°»; бывает «2.8 to 12 mm: horizontal FOV102°» и без диагонали
  const hik = new RegExp(`(?<![\\d./])([\\d.]+)(?:\\s*(?:to|-|–)\\s*([\\d.]+))?\\s*mm\\s*[,:]\\s*horizontal FOV:?\\s*${A}\\s*[,;]\\s*vertical FOV:?\\s*${A}(?:\\s*[,;]\\s*diagonal FOV:?\\s*${A})?`, 'gi');
  for (const m of t.matchAll(hik)) vars.push({ f: [n(m[1]), n(m[2] ?? m[1])], h: [n(m[3]), n(m[4] ?? m[3])], v: [n(m[5]), n(m[6] ?? m[5])], d: m[7] ? [n(m[7]), n(m[8] ?? m[7])] : null });
  // Dahua: «2.8 mm: H: 102°; V: 54°; D: 121°», старые PDF — «Angle of View H: 114°–47°, V: 62°–26°» (без D)
  const dh = new RegExp(`(?:([\\d.]+)\\s*mm\\s*:\\s*)?H\\s*:\\s*${A}\\s*[;,]?\\s*V\\s*:\\s*${A}(?:\\s*[;,]?\\s*D\\s*:\\s*${A})?`, 'g');
  const dhFocal = t.match(/Focal Length:?\s*([\d.]+)\s*(?:mm)?\s*(?:–|-|to)\s*([\d.]+)\s*mm/i);
  for (const m of t.matchAll(dh)) {
    const f = m[1] ? [n(m[1]), n(m[1])] : dhFocal ? [n(dhFocal[1]), n(dhFocal[2])] : null;
    vars.push({ f, h: [n(m[2]), n(m[3] ?? m[2])], v: [n(m[4]), n(m[5] ?? m[4])], d: m[6] ? [n(m[6]), n(m[7] ?? m[6])] : null });
  }
  // Dahua, новый шаблон: «Field of View Horizontal: 108°–34° Vertical: 56°–19° Diagonal: 130°–39°»
  const dh2 = new RegExp(`(?:([\\d.]+)\\s*mm\\s*:?\\s*)?Horizontal\\s*:?\\s*${A}\\s*;?\\s*Vertical\\s*:?\\s*${A}\\s*;?\\s*Diagonal\\s*:?\\s*${A}`, 'gi');
  for (const m of t.matchAll(dh2)) {
    const f = m[1] ? [n(m[1]), n(m[1])] : dhFocal ? [n(dhFocal[1]), n(dhFocal[2])] : null;
    vars.push({ f, h: [n(m[2]), n(m[3] ?? m[2])], v: [n(m[4]), n(m[5] ?? m[4])], d: [n(m[6]), n(m[7] ?? m[6])] });
  }
  // Hikvision PTZ и часть фиксированных: «FOV Horizontal field of view: 112° to 46°, Vertical field of view: …»,
  // несколько объективов — тем же списком по порядку («Focal Length 2.8 mm;4 mm FOV …; …»)
  if (!vars.length) {
    // необязательная приставка «4 mm:» перед блоком (PDF Hikvision пишут блоки с фокусом и не по порядку)
    const blk = new RegExp(`(?:([\\d.]+)\\s*mm\\s*:\\s*)?Horizontal field of view:?\\s*${A}\\s*[,;]?\\s*Vertical field of view:?\\s*${A}(?:\\s*[,;]?\\s*Diagonal field of view:?\\s*${A})?`, 'gi');
    const found = [...t.matchAll(blk)].map((m) => { const g = [m[0], ...m.slice(2)]; g.index = m.index; g.pre = m[1]; return g; });
    const seen = new Set(), list = [];
    for (const m of found) { const k = m.slice(1, 7).join(','); if (!seen.has(k)) { seen.add(k); list.push(m); } }
    if (list.length) {
      // фокус — из ближайшей «Focal Length» перед первым блоком углов (не из меню страницы)
      const before = t.slice(Math.max(0, list[0].index - 400), list[0].index);
      const at = before.lastIndexOf('Focal Length');
      // от последней «Focal Length» до блока углов; оптический зум («4 × optical») отрезаем
      const fText = at >= 0 ? before.slice(at + 12).replace(/[\d.]+\s*[×x]\s*optical.*$/i, '') : '';
      const range = fText.match(/([\d.]+)\s*(?:mm)?\s*(?:to|-|–)\s*([\d.]+)\s*mm/i);
      const singles = [...fText.matchAll(/([\d.]+)\s*mm/gi)].map((x) => n(x[1]));
      list.forEach((m, i) => {
        const f = m.pre ? [n(m.pre), n(m.pre)] : list.length === 1 && range ? [n(range[1]), n(range[2])] : singles.length === list.length ? [singles[i], singles[i]] : null;
        vars.push({ f, h: [n(m[1]), n(m[2] ?? m[1])], v: [n(m[3]), n(m[4] ?? m[3])], d: m[5] ? [n(m[5]), n(m[6] ?? m[5])] : null });
      });
    }
  }
  // порядок «широкий край → узкий»: часть документов пишет диапазон углов по возрастанию (9.4°–40.8°)
  for (const x of vars) for (const k of ['h', 'v', 'd']) if (x[k] && x[k][0] < x[k][1]) x[k] = [x[k][1], x[k][0]];
  const key = (x) => JSON.stringify([x.f, x.h, x.v, x.d]);
  const uniq = [...new Map(vars.map((x) => [key(x), x])).values()];
  const r = t.match(/Max\.?\s*Resolution:?\s*(\d{3,5})\s*(?:\(H\))?\s*[×x*]\s*(\d{3,5})/i);
  const s = t.match(/Image Sensor:?\s*(1\/\d+(?:\.\d+)?)/i);
  return { variants: uniq, res: r ? [n(r[1]), n(r[2])] : null, sensor: s ? s[1] : null };
}

const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const core = (m) => m.replace(/\(.*$/, '').replace(/\s.*$/, '').replace(/\/.*$/, '').replace(/^DHI?-/i, '');
const sameAngles = (a, b) => a && b && JSON.stringify([a.h, a.v]) === JSON.stringify([b.h, b.v]);
const fkey = (f) => (f ? `${f[0]}-${f[1]}` : '?');
// вариант карточки «2.8mm» / «2.8-12mm» → ключ фокуса
const lensKey = (l) => { const m = l.match(/([\d.]+)(?:-([\d.]+))?mm/); return m ? `${n(m[1])}-${n(m[2] ?? m[1])}` : null; };

function main() {
const out = [];
for (const r of inv) {
  const pageTxt = read(path.join(DIR, 'raw', `${r.slug}.txt`));
  const pdfTxt = read(path.join(DIR, 'pdf', `${r.slug}.txt`));
  // документ принимается, только если в нём есть точный код модели (ядро без объектива/региона/цвета):
  // редирект на страницу серии или datasheet соседней модели — не источник для этой карточки
  // + домен документа должен принадлежать бренду карточки (короткие коды вроде H2C/C5A
  // встречались в чужих страницах); у PDF домен смотрим по ссылке в журнале
  const DOMAIN = { Hikvision: /hikvision\.com/i, Dahua: /dahuasecurity\.com/i, ZKTeco: /zkteco/i };
  const domOk = (url) => !DOMAIN[r.brand] || !url || DOMAIN[r.brand].test(url);
  const pageUrl0 = pageTxt ? (pageTxt.match(/^URL: (.*)$/m) || [])[1] : null;
  const pdfUrl0 = (pdfLog.find((x) => x.slug === r.slug) || {}).pdf || null;
  // ревизия Hikvision в скобках — другое железо (T5/S5/S6/S7/C0): документ должен называть её же
  const rev = (r.model.match(/\((T\d|S\d|C\d)\)/i) || [])[1] || (r.model.match(/\s(T\d|S\d)\b/) || [])[1] || '';
  const hasModel = (txt, url) => txt && domOk(url) && flat(txt).includes(flat(core(r.model)) + flat(rev));
  const page = hasModel(pageTxt, pageUrl0) ? extract(pageTxt) : null;
  const pdf = hasModel(pdfTxt, pdfUrl0) && !pdfTxt.startsWith('!!ERROR') ? extract(pdfTxt) : null;
  const pageUrl = pageTxt ? (pageTxt.match(/^URL: (.*)$/m) || [])[1] : null;
  const pdfUrl = (pdfLog.find((x) => x.slug === r.slug) || {}).pdf || null;
  const reasons = [];
  if (!page) reasons.push('нет официальной страницы');
  else if (!page.variants.length) reasons.push('на странице нет углов обзора');
  if (!pdf) reasons.push('нет PDF-datasheet');
  else if (!pdf.variants.length) reasons.push('в PDF нет углов обзора');
  if (page?.res && pdf?.res && page.res.join('x') !== pdf.res.join('x')) reasons.push(`разрешение: страница ${page.res.join('×')}, PDF ${pdf.res.join('×')}`);
  const res = page?.res || pdf?.res || null;
  const sensor = page?.sensor || pdf?.sensor || r.sensor;

  // какие варианты объектива относятся к карточке
  // объектив в коде модели («…(2.8mm)…», «… 2.8MM») = карточка конкретного исполнения:
  // другие объективы из характеристик («2.8/3.6/6 mm») к ней не относятся
  // источники: код модели, название товара, адрес (slug «…-2-8mm», «…-2-8-12mm»); ровно один объектив = исполнение
  const lensKeysIn = (s) => [...s.replace(/мм/gi, 'mm').matchAll(/(?<![\d.,])(\d+(?:[.,]\d+)?)\s*(?:[-–]\s*(\d+(?:[.,]\d+)?))?\s*mm/gi)].map((x) => `${n(x[1])}-${n(x[2] ?? x[1])}`);
  const slugLens = (() => { const m = r.slug.match(/-(\d+)-(\d+)(?:-(\d+)(?:-(\d+))?)?mm(?:-|$)/) || r.slug.match(/-(\d+)mm(?:-|$)/); if (!m) return [];
    if (m.length <= 2 || m[2] === undefined) return [`${n(m[1])}-${n(m[1])}`];
    const a = `${m[1]}.${m[2]}`; return m[3] === undefined ? [`${n(a)}-${n(a)}`] : [`${n(a)}-${n(m[4] !== undefined ? `${m[3]}.${m[4]}` : m[3])}`]; })();
  const skuKeys = [...new Set([...lensKeysIn(r.model), ...lensKeysIn(r.name || ''), ...slugLens])];
  const modelLens = skuKeys.length === 1 ? skuKeys[0] : null;
  const want = modelLens ? [modelLens] : r.lenses.map(lensKey).filter(Boolean);
  const srcVars = page?.variants?.length ? page.variants : pdf?.variants || [];
  let chosen = want.length ? srcVars.filter((v) => want.includes(fkey(v.f))) : srcVars;
  // объектив в карточке противоречит документам производителя: берём варианты из документов,
  // карточку помечаем — это ошибка каталога, а не источника (список — в отчёт владельцу)
  let cardLensConflict = null;
  if (want.length && srcVars.length && !chosen.length) {
    cardLensConflict = `в карточке ${r.lenses.join(', ')}, в документах ${srcVars.map((v) => fkey(v.f)).join(', ')} мм`;
    chosen = srcVars;
  }

  // пара во втором документе: по фокусу; если фокус в одном из документов не указан — единственный вариант
  const twinOf = (v) => pdf?.variants?.find((x) => fkey(x.f) === fkey(v.f))
    || ((!v.f || pdf?.variants?.every((x) => !x.f)) && pdf?.variants?.length === 1 ? pdf.variants[0] : null);
  // допуск 1°: ревизии документов одного года и соседних лет часто округляют по-разному
  const within1 = (a, b) => a && b && [0, 1].every((i) => Math.abs(a.h[i] - b.h[i]) <= 1 && (!a.v || !b.v || Math.abs(a.v[i] - b.v[i]) <= 1));
  const variants = chosen.map((v) => {
    const twin = twinOf(v);
    const issues = plausibility({ focal: v.f, h: v.h, v: v.v }, res, sensor);
    const vr = [], info = [];
    if (!pdf) { /* причина уже на уровне карточки: «нет PDF-datasheet» */ }
    else if (!twin) vr.push(`в PDF нет объектива ${fkey(v.f)} (есть: ${pdf.variants.map((x) => fkey(x.f)).join(', ') || '—'})`);
    else if (!sameAngles(v, twin)) {
      if (within1(v, twin)) info.push(`PDF: H ${twin.h.join('–')}°, V ${twin.v ? twin.v.join('–') : '—'}° (расхождение ≤ 1°, взяты значения страницы)`);
      else vr.push(`углы расходятся: страница H${v.h} V${v.v}, PDF H${twin.h} V${twin.v}`);
    }
    vr.push(...issues);
    return { focalMm: v.f || twin?.f || null, hfovDeg: v.h, vfovDeg: v.v, dfovDeg: v.d, status: vr.length || reasons.length ? 'needs_review' : 'verified', notes: vr, info };
  });
  out.push({
    productId: r.id, slug: r.slug, brand: r.brand, model: r.model, kind: r.kind, inStock: r.in_stock,
    cardLenses: r.lenses, widthPx: res?.[0] ?? null, heightPx: res?.[1] ?? null, sensorFormat: sensor || null,
    sourcePage: pageUrl, sourcePdf: pdfUrl, checkedAt: new Date().toISOString().slice(0, 10),
    status: variants.length && variants.every((v) => v.status === 'verified') && !reasons.length ? 'verified' : variants.length ? 'needs_review' : 'no_data',
    reasons, variants, cardLensConflict,
  });
}
fs.writeFileSync(path.join(DIR, 'b0_result.json'), JSON.stringify(out, null, 1));
const c = (f) => out.reduce((a, x) => ((a[f(x)] = (a[f(x)] || 0) + 1), a), {});
console.log('итог', c((x) => x.status));
console.log('по типу', c((x) => `${x.kind}:${x.status}`));
const rs = {}; out.forEach((x) => [...x.reasons, ...x.variants.flatMap((v) => v.notes)].forEach((q) => { const k = q.replace(/[\d.,×°HV\[\]-]+/g, '#').slice(0, 60); rs[k] = (rs[k] || 0) + 1; }));
console.log('причины', Object.entries(rs).sort((a, b) => b[1] - a[1]).slice(0, 15));
}
module.exports = { extract, core, flat };
if (require.main === module) main();
