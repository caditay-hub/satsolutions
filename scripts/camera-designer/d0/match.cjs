// D0, шаг 1: оборудование для сметы (NVR, DVR, PoE-коммутаторы Hikvision/Dahua) → кандидаты
// официальных страниц из sitemap производителей (кэш B0). Только чтение.
const fs = require('fs'), path = require('path');
const DIR = __dirname, B0 = path.join(DIR, '..', 'b0');
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inventory.json'), 'utf8'));
const locs = (f) => (fs.readFileSync(path.join(B0, f), 'utf8').match(/<loc>[^<]*<\/loc>/g) || []).map((x) => x.slice(5, -6));
const all = [...locs('hik_en.xml'), ...locs('hik_europe.xml'), ...locs('dh_en.xml')].filter((u) => /products/i.test(u));
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
// ядро модели: без «(STD)(C)», региона, хвоста после пробела; «/» оставляем (у NVR это исполнение: /8P, /M, /W)
const core = (m) => m.replace(/\(.*?\)/g, '').replace(/\s.*$/, '').replace(/^DHI?-/i, '').trim();
const tail = (u) => flat(decodeURIComponent(u.replace(/\/$/, '').split('/').pop()).replace(/^(dhi?-)/i, ''));

// каналы по коду: Hikvision DS-76<16>NI → 16; Dahua NVR21<08> → 8 (последние две цифры серии),
// NVR616H-<128> → 128; XVR1B<08> → 8
const chOf = (x) => {
  const s = x.model || x.name;
  const m = s.match(/(?:DS|iDS|IDS)-\d{1,2}(\d{2,3})N|XVR\d{1,2}?\w?(\d{2})/i);
  if (m) return Number(m[1] || m[2]);
  const d = s.match(/NVR\d{2}(\d{2})(?![\d])/i) || s.match(/NVR\w+-(\d{2,3})-/i);
  return d ? Number(d[1]) : null;
};
const pick = inv.filter((x) => {
  if (x.grp === 'nvr') return !/MCW|DS-A[78]/i.test(x.model || '') && (chOf(x) === null || chOf(x) <= 64);
  if (x.grp === 'dvr') return !/DAE-/i.test(x.model || '');
  if (x.grp === 'poe') return /Hikvision|Dahua/.test(x.brand || '');
  // ИБП для шкафа — линейка Hikvision DS-UPS (у остальных в каталоге мощность в ваттах не указана)
  if (x.grp === 'ups') return /DS-UPS\d+(?:-R)?\b/i.test(x.name) && !/K72|03K/i.test(x.name);
  return false;
});
const idx = new Map();
for (const u of all) { const k = tail(u); if (!idx.has(k)) idx.set(k, []); idx.get(k).push(u); }
const out = pick.map((x) => {
  const model = x.model || x.name.match(/[A-Z]{2,}[-\w/().]+$/)?.[0] || x.name;
  const want = flat(core(model).replace(/^(DS|IDS)-/i, (s) => s));
  // ключ — весь код целиком: tail() режет по «/», и у «DS-3E0106MP-E/M» оставалось бы «m»
  const k = flat(core(model));
  let urls = idx.get(k) || [];
  if (!urls.length) for (const [kk, v] of idx) if (kk.startsWith(k) && kk.length - k.length <= 3) { urls = v; break; }
  // кандидаты по базе модели — страница примется, только если в тексте есть точный код
  const base = flat(core(model).replace(/\/.*$/, '')).replace(/^(ds|ids)/, '').slice(0, 9);
  const cands = urls.length ? [] : [...new Set(all.filter((u) => tail(u).includes(base)))].slice(0, 8);
  return { id: x.id, slug: x.slug, grp: x.grp, brand: x.brand, model, core: core(model), want, name: x.name, price: Number(x.price), usd: x.usd, stock: x.stock, ch: x.ch, urls: urls.slice(0, 3), cands };
});
fs.writeFileSync(path.join(DIR, 'd0_list.json'), JSON.stringify(out, null, 1));
const g = (k) => out.filter((x) => x.grp === k);
for (const k of ['nvr', 'dvr', 'poe']) console.log(k, g(k).length, 'direct', g(k).filter((x) => x.urls.length).length, 'cands', g(k).filter((x) => !x.urls.length && x.cands.length).length, 'none', g(k).filter((x) => !x.urls.length && !x.cands.length).map((x) => x.model).join('; '));
