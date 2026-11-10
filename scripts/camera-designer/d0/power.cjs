// D0: потребление камер для бюджета PoE — из тех же двух официальных документов, что углы в B0
// (страница b0/raw/<slug>.txt и datasheet b0/pdf/<slug>.txt). Берём максимальную мощность и
// стандарт PoE. verified — оба документа дают одинаковое значение (±0,5 Вт) и стандарт.
const fs = require('fs'), path = require('path');
const DIR = __dirname, B0 = path.join(DIR, '..', 'b0');
const optics = JSON.parse(fs.readFileSync('D:/sat_web_github/apps/web/src/data/cameraOptics.json', 'utf8')).cameras;

/** Фрагменты текста про питание: строка с меткой и 2 следующие строки. */
function powerText(txt) {
  const lines = txt.split('\n');
  const out = [];
  lines.forEach((l, i) => {
    if (/^(Power( Consumption( and Current)?| Supply)?|Power Consumption|PoE|Power Input|Power\s*&\s*Current)\b/i.test(l.trim()) && !/Power[- ]on|Power[- ]off|Powered by|Power & Utilities|Power-Utilities/i.test(l)) {
      // Dahua: «Power Consumption / Basic: … / Max. (…): 6.4 W (12 VDC); 7.7 W (PoE)» — до 4 строк
      out.push([l, ...lines.slice(i + 1, i + 5)].join(' '));
    }
  });
  return out.join(' || ');
}

function parse(t) {
  if (!t) return null;
  const s = t.replace(/\s+/g, ' ');
  // мощности: «max. 6.5 W», «<6.2W», «≤ 4.5 W», «Max 18W», «6.5W max»
  const ws = [...s.matchAll(/(?:max\.?|maximum|<|≤|up to)\s*:?\s*(\d+(?:\.\d+)?)\s*W\b|(\d+(?:\.\d+)?)\s*W\s*(?:\(?max\.?\)?|maximum)/gi)]
    .map((m) => Number(m[1] || m[2])).filter((v) => v > 0 && v < 200);
  // Dahua: «Max. (условия): 6.4 W (12 VDC); 7.7 W (PoE)» — все мощности после «Max. (…):»
  const dh = s.match(/Max\.?\s*\([^)]*\)\s*:\s*([^|]{0,80})/i);
  if (dh) for (const m of dh[1].matchAll(/(\d+(?:\.\d+)?)\s*W\b/g)) ws.push(Number(m[1]));
  // «PoE: ... max. X W» — потребление именно от PoE, если указано отдельно
  const poeW = [...s.matchAll(/PoE[^|]{0,80}?(?:max\.?|<|≤)\s*(\d+(?:\.\d+)?)\s*W/gi)].map((m) => Number(m[1]));
  const std = /Hi-?PoE/i.test(s) ? 'hipoe' : /802\.3bt/i.test(s) ? 'bt' : /802\.3at|PoE\+|Class\s*4/i.test(s) ? 'at' : /802\.3af|Class\s*[0-3]\b|PoE/i.test(s) ? 'af' : null;
  const cls = s.match(/Class\s*([0-8])/i)?.[1] ?? null;
  // в сумме «12 VDC, max. 18 W, including max. 1.6 W for heater» берём наибольшее — это предел камеры
  const maxW = ws.length ? Math.max(...ws, ...poeW) : poeW.length ? Math.max(...poeW) : null;
  return { maxW, std, cls: cls === null ? null : Number(cls), poeOnly: poeW.length ? Math.max(...poeW) : null };
}

const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
const res = optics.filter((c) => c.status !== 'unsupported').map((c) => {
  const page = parse(powerText(read(path.join(B0, 'raw', `${c.slug}.txt`))));
  const pdf = parse(powerText(read(path.join(B0, 'pdf', `${c.slug}.txt`))));
  const a = page?.maxW ?? null, b = pdf?.maxW ?? null;
  const agree = a !== null && b !== null && Math.abs(a - b) <= 0.5;
  // оба документа без PoE (аналоговые, Wi-Fi с адаптером 12 В) — это факт «нужен блок питания», а не пропуск
  const std = pdf?.std || page?.std || (agree ? 'none' : null);
  const stdAgree = (page?.std ?? null) === (pdf?.std ?? null) || !page?.std || !pdf?.std;
  const bothNone = !page?.std && !pdf?.std;
  const status = agree && (bothNone || (stdAgree && page?.std && pdf?.std)) ? 'verified' : a !== null || b !== null ? 'needs_review' : 'no_data';
  return { slug: c.slug, model: c.model, kind: c.kind, status, maxW: a !== null && b !== null ? Math.max(a, b) : a ?? b, std, cls: pdf?.cls ?? page?.cls ?? null, page, pdf };
});
fs.writeFileSync(path.join(DIR, 'camera_power.json'), JSON.stringify(res, null, 1));
const n = (k) => res.filter((x) => x.status === k).length;
console.log('cams', res.length, 'verified', n('verified'), 'review', n('needs_review'), 'no_data', n('no_data'));
const std = {}; for (const x of res) std[x.std] = (std[x.std] || 0) + 1; console.log('std', std);
console.log(res.filter((x) => x.status === 'needs_review').slice(0, 25).map((x) => `${x.model}: page ${x.page?.maxW} pdf ${x.pdf?.maxW} ${x.page?.std}/${x.pdf?.std}`).join('\n'));
