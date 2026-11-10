// D0, шаг 4: apps/web/src/data/estimateEquipment.json — характеристики оборудования для сметы
// (без цен: цена и наличие берутся из API в момент расчёта). Запись только с --apply.
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const OUT = 'D:/sat_web_github/apps/web/src/data/estimateEquipment.json';
const res = JSON.parse(fs.readFileSync(path.join(DIR, 'd0_result.json'), 'utf8'));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inventory.json'), 'utf8'));
const log = JSON.parse(fs.readFileSync(path.join(DIR, 'fetch_log.json'), 'utf8'));
const power = JSON.parse(fs.readFileSync(path.join(DIR, 'camera_power.json'), 'utf8'));
const catOf = (slug) => inv.find((x) => x.slug === slug)?.cat ?? null;
const src = (slug) => { const l = log.find((x) => x.slug === slug) || {}; return { sourcePage: l.page || null, sourcePdf: l.pdf || null }; };
const today = new Date().toISOString().slice(0, 10);
const keep = (r) => r.status === 'verified' || r.status === 'needs_review';

const recorders = res.filter((r) => (r.grp === 'nvr' || r.grp === 'dvr') && keep(r)).map((r) => ({
  slug: r.slug, brand: r.brand, model: r.model, kind: r.grp, status: r.status,
  channels: r.channels, bandwidthMbps: r.grp === 'nvr' ? r.bandwidthMbps : null, maxMP: r.maxMP ?? null,
  bays: r.bays, maxTbPerBay: r.maxTbPerBay ?? null, poePorts: r.poePorts || 0, poeBudgetW: r.poeBudgetW ?? null, poeAt: !!r.poeAt,
  powerW: r.powerW ?? null, notes: [...r.notes, ...(r.info || [])], ...src(r.slug), cat: catOf(r.slug), checkedAt: today,
})).filter((r) => r.channels && r.bays);

const switches = res.filter((r) => r.grp === 'poe' && keep(r) && r.poePorts && r.budgetW).map((r) => ({
  slug: r.slug, brand: r.brand, model: r.model, status: r.status, poePorts: r.poePorts, budgetW: r.budgetW,
  at: !!r.at, hiPoe: !!r.hiPoe, powerW: r.powerW ?? null, notes: [...r.notes, ...(r.info || [])], ...src(r.slug), cat: catOf(r.slug), checkedAt: today,
}));

const ups = res.filter((r) => r.grp === 'ups' && keep(r) && r.w).map((r) => ({ slug: r.slug, model: r.model, status: r.status, w: r.w, va: r.va, notes: r.notes, ...src(r.slug), cat: catOf(r.slug), checkedAt: today }));

// диски: нужна только ёмкость — название, характеристика «Объём» и код модели должны совпасть
const tbOf = (s) => { const m = String(s || '').match(/(\d+(?:[.,]\d+)?)\s*(TB|ТБ|GB|ГБ)/i); return m ? Number(m[1].replace(',', '.')) / (/[GГ]/i.test(m[2]) ? 1000 : 1) : null; }; // «ГБ» — кириллицей
const codeTb = (name) => {
  let m = name.match(/WD(\d{2,3})PURX/i); if (m) return m[1].length === 3 ? Number(m[1].slice(0, 2)) : Math.floor(Number(m[1]) / 10); // WD40PURX → 4, WD62PURX → 6, WD101PURX → 10
  m = name.match(/DS(\d{2,3})HK(?:VS|AI)/i); if (m) return Number(m[1]) / 10; // DS40HKVS → 4, DS120HKAI → 12
  return null;
};
const hdds = inv.filter((x) => x.grp === 'hdd' && Number(x.price) >= 0).map((x) => {
  const a = tbOf(x.name), b = tbOf(x.ch && x.ch['Объём']), c = codeTb(x.name);
  const ok = a !== null && b !== null && a === b && (c === null || c === a);
  const server = /SAS|2\.5"|Серверн/i.test(x.name);
  return { slug: x.slug, cat: x.cat, name: x.name, tb: a, surveillance: /видеонаблюд|SkyHawk|PURX|HKVS|HKAI/i.test(x.name), status: server ? 'unsupported' : ok ? 'verified' : 'needs_review', notes: server ? ['серверный диск (SAS / 2,5")'] : ok ? [] : [`название ${a}, «Объём» ${b}, код ${c}`] };
}).filter((h) => h.tb && h.status !== 'unsupported');

// кабель и расходники — по названию товара (длина бухты, исполнение)
const bySlug = (s) => inv.find((x) => x.slug === s);
const cables = [
  { slug: 'knd-kabel-utp-kanihad-5-kateg-vnutrennyi-oranzhevyi-4-2-0-5-305-metr', outdoor: false, meters: 305 },
  { slug: 'knd-kabel-utp-kanihad-6-kateg-naruzhnyi-chernyi-4-2-0-56-305-metr', outdoor: true, meters: 305 },
].filter((c) => bySlug(c.slug)).map((c) => ({ ...c, cat: bySlug(c.slug).cat }));
const rj45 = bySlug('pxt-pxt-rj-45') ? { slug: 'pxt-pxt-rj-45', cat: bySlug('pxt-pxt-rj-45').cat } : null;
const gofra = bySlug('pro-gofrirovannyi-shlang-25-50metr') ? { slug: 'pro-gofrirovannyi-shlang-25-50metr', meters: 50, cat: bySlug('pro-gofrirovannyi-shlang-25-50metr').cat } : null;

const cameraPower = Object.fromEntries(power.filter((p) => p.status !== 'no_data').map((p) => [p.slug, { w: p.maxW, poe: p.std, status: p.status }]));

const out = {
  version: 'cd-equip-1', generatedAt: today,
  method: 'Характеристики со страницы производителя и из PDF-datasheet той же модели; verified — совпали в обоих документах. Предел диска в отсеке при расхождении — меньшее значение, потребление — большее. Цены и наличие — из API на момент расчёта.',
  totals: {
    recorders: { verified: recorders.filter((r) => r.status === 'verified').length, review: recorders.filter((r) => r.status === 'needs_review').length },
    switches: { verified: switches.filter((r) => r.status === 'verified').length, review: switches.filter((r) => r.status === 'needs_review').length },
    ups: ups.length, hdds: hdds.length, cameraPower: { verified: power.filter((p) => p.status === 'verified').length, review: power.filter((p) => p.status === 'needs_review').length, noData: power.filter((p) => p.status === 'no_data').length },
  },
  recorders, switches, ups, hdds, cables, rj45, gofra, cameraPower,
};
console.log(JSON.stringify(out.totals), 'cables', cables.length, 'rj45', !!rj45, 'gofra', !!gofra);
console.log('hdd', hdds.map((h) => `${h.tb}${h.surveillance ? 'S' : ''}:${h.status}`).join(' '));
if (process.argv.includes('--apply')) { fs.writeFileSync(OUT, JSON.stringify(out, null, 1) + '\n'); console.log('written', OUT); }
else console.log('сухой прогон: запись — с --apply');
