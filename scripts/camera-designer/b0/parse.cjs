// B0: разбор полей оптики (страница или PDF) в варианты объектива + проверки правдоподобия.
const n = (s) => Number(String(s).replace(',', '.'));
const RANGE = '([\\d.]+)\\s*°?(?:\\s*(?:to|-|–|~)\\s*([\\d.]+))?\\s*°';

/** Варианты из строк «Focal Length & FOV» (Hikvision) или «Field of View» (Dahua). */
function parseVariants(lines, focalField = '') {
  const out = [];
  const focalOf = (s) => {
    const m = s.match(/([\d.]+)\s*(?:mm)?\s*(?:to|-|–|~)\s*([\d.]+)\s*mm/i) || s.match(/([\d.]+)\s*mm/i);
    return m ? [n(m[1]), n(m[2] ?? m[1])] : null;
  };
  const ang = (s, re) => {
    const m = s.match(re);
    return m ? [n(m[1]), n(m[2] ?? m[1])] : null;
  };
  for (const raw of lines.flatMap((l) => l.split(' | '))) {
    const s = raw.replace(/\s+/g, ' ');
    const h = ang(s, new RegExp(`(?:horizontal(?: FOV| field of view)?|\\bH)\\s*:?\\s*${RANGE}`, 'i'));
    if (!h) continue;
    const v = ang(s, new RegExp(`(?:vertical(?: FOV| field of view)?|\\bV)\\s*:?\\s*${RANGE}`, 'i'));
    const d = ang(s, new RegExp(`(?:diagonal(?: FOV| field of view)?|\\bD)\\s*:?\\s*${RANGE}`, 'i'));
    const focal = focalOf(s.split(/horizontal|\bH\s*:/i)[0]) || focalOf(focalField);
    out.push({ focal, h, v, d, src: s.slice(0, 200) });
  }
  return out;
}

function parseResolution(lines) {
  for (const s of lines) {
    const m = s.match(/(\d{3,5})\s*(?:\(H\))?\s*[×x*]\s*(\d{3,5})/i);
    if (m) return [n(m[1]), n(m[2])];
  }
  return null;
}

const rad = (d) => (d * Math.PI) / 180;
const NOMINAL_W = { '1/1.2': 10.7, '1/1.8': 7.2, '1/2': 6.4, '1/2.3': 6.17, '1/2.5': 5.76, '1/2.7': 5.37, '1/2.8': 5.12, '1/2.9': 4.96, '1/3': 4.8, '1/3.4': 4.23, '1/4': 3.6 };
function sensorWidth(sensorText) {
  const m = String(sensorText || '').match(/1\/(\d+(?:\.\d+)?)/);
  return m ? NOMINAL_W[`1/${m[1]}`] ?? null : null;
}

/** Проверки одного варианта; возвращает список замечаний (пусто — правдоподобно). */
function plausibility(v, res, sensorText) {
  const issues = [];
  const ends = [[v.h?.[0], v.v?.[0], v.focal?.[0]], [v.h?.[1], v.v?.[1], v.focal?.[1]]];
  for (const [h, vv, f] of ends) {
    if (!(h > 0 && h < 180)) { issues.push(`H вне 0–180: ${h}`); continue; }
    if (vv !== undefined && !(vv > 0 && vv < h)) issues.push(`V=${vv} не меньше H=${h}`);
    if (res && vv) {
      const ratio = Math.tan(rad(vv / 2)) / Math.tan(rad(h / 2)) / (res[1] / res[0]);
      if (ratio < 0.65 || ratio > 1.1) issues.push(`V/H не сходится с кадром ${res[0]}×${res[1]}: ${ratio.toFixed(2)}`);
    }
    if (f) {
      const sw = 2 * f * Math.tan(rad(h / 2));
      const nom = sensorWidth(sensorText);
      if (nom && (sw / nom < 0.7 || sw / nom > 1.7)) issues.push(`эквив. ширина матрицы ${sw.toFixed(2)} мм против ~${nom} мм (${sensorText})`);
    }
  }
  if (v.h && v.h[0] < v.h[1]) issues.push('широкий угол меньше узкого');
  return issues;
}

module.exports = { parseVariants, parseResolution, plausibility, sensorWidth };
