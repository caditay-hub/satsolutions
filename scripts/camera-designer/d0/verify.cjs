// D0, шаг 3: поля оборудования для сметы — отдельно со страницы производителя и из PDF-datasheet.
// verified — все нужные поля есть в обоих документах и совпадают (потребление — ±1 Вт).
// Иначе needs_review с перечнем расхождений; без документов — no_data.
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const list = JSON.parse(fs.readFileSync(path.join(DIR, 'd0_list.json'), 'utf8'));
const read = (f) => (fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : '');
// PDF-текст рвётся пробелами и переносами («Gigab it», «6 k V») — склеиваем в одну строку
// на страницах Dahua между меткой и значением остаётся мусор шаблона «{v.name} -->»
const norm = (t) => t.replace(/\r/g, '').replace(/-\n(?=\w)/g, '').replace(/\{v\.name\}\s*-->/g, ' ').replace(/\s+/g, ' ');
const num = (s) => (s === undefined || s === null ? null : Number(String(s).replace(',', '.')));
const first = (s, res) => { for (const re of res) { const m = s.match(re); if (m) return num(m[1]); } return null; };

function extract(t, grp) {
  const s = norm(t);
  if (!s) return null;
  if (grp === 'poe') {
    // строка спецификации «Ports 8 × Gigabit PoE port» — порты Hi-PoE в ней уже учтены
    const ports = first(s, [/Ports\s*(\d+)\s*×\s*(?:1\s*)?(?:Gigabit\s*|Fast Ethernet\s*|10\/100(?:\/1000)?\s*M(?:bps)?\s*)?PoE port/i, /PoE:?\s*Ports?\s*1\s*(?:to|-|–|~)\s*(\d+)/i, /(\d+)\s*x\s*(?:10\/100(?:\/1000)?\s*Mbps\s*)?PoE ports?/i, /(\d+)\s*×\s*(?:Gigabit\s*|Fast Ethernet\s*|10\/100(?:\/1000)?\s*M(?:bps)?\s*)?(?:Hi-)?PoE\s*(?:RJ45\s*)?ports?/i, /(\d+)\s*(?:Gigabit\s*|10\/100\s*M\s*)?PoE\s*ports?/i]);
    const budget = first(s, [/PoE Power Budget\s*:?\s*(\d+(?:\.\d+)?)\s*W/i, /Maximum Total Output\s*:?\s*(\d+(?:\.\d+)?)\s*W/i, /PoE Budget\s*:?\s*(\d+(?:\.\d+)?)\s*W/i, /(?:total|max\.?)\s*PoE\s*(?:power|budget)\s*:?\s*(\d+(?:\.\d+)?)\s*W/i]);
    const perPort = first(s, [/Max\.?\s*(?:Port|Single[- ]Port)\s*Power\s*:?\s*(\d+(?:\.\d+)?)\s*W/i]);
    const idle = first(s, [/Power Consumption in Idle\s*:?\s*(\d+(?:\.\d+)?)\s*W/i, /Idle\s*(?:Power|Consumption)\s*:?\s*(\d+(?:\.\d+)?)\s*W/i]);
    return { poePorts: ports, budgetW: budget, perPortW: perPort, at: /802\.3\s*(?:af\s*\/\s*)?at|802\.3at/i.test(s), hiPoe: /Hi-?PoE/i.test(s), powerW: idle };
  }
  if (grp === 'ups') {
    const m = s.match(/Capacity\s*:?\s*(\d+)\s*VA\s*\/\s*(\d+)\s*W/i);
    return m ? { va: Number(m[1]), w: Number(m[2]) } : { va: null, w: null };
  }
  const isDvr = grp === 'dvr';
  const channels = isDvr
    ? first(s, [/Analog Video Input\s*(\d+)\s*-?\s*ch/i, /(\d+)\s*-?\s*ch(?:annel)?\s*(?:BNC|analog)/i, /Analog Camera Input\s*(\d+)/i, /(\d+)\s*channels?\s*(?:BNC|analog)/i])
    : first(s, [/IP Video Input\s*(\d+)\s*-?\s*ch/i, /Access Channels?\s*(\d+)/i, /IP Camera Input\s*(\d+)/i, /Up to\s*(\d+)\s*-?\s*ch(?:annel)?s?\s*IP/i]);
  // «80/80/60 Mbps incoming/recording/outgoing» — входящий первый; «AI disabled: 160 / AI enabled: 80
  // Mbps incoming» — берём меньшее (безопасная сторона)
  const inc = [...s.matchAll(/(?<![\/\d.])(\d+(?:\.\d+)?)\s*Mbps\s*incoming/gi)].map((m) => Number(m[1]));
  const bandwidth = inc.length ? Math.min(...inc) : first(s, [/Incoming Bandwidth\s*:?\s*(\d+(?:\.\d+)?)\s*Mbps/i, /Network Bandwidth\s*(?:Access|Incoming)\s*:?\s*(\d+(?:\.\d+)?)\s*Mbps/i, /Network Bandwidth\s*(\d+(?:\.\d+)?)\s*Mbps\s*for access/i, /Max\.?\s*(\d+)\s*\/\s*\d+\s*\/\s*\d+\s*Mbps incoming/i, /Incoming bandwidth\s*(?:reaches|:)?\s*(\d+)\s*Mbps/i]);
  const maxMP = first(s, [/Recording Resolution\s*:?\s*(\d+(?:\.\d+)?)\s*MP/i, /Up to\s*(\d+(?:\.\d+)?)\s*MP resolution/i, /resolution up to\s*(\d+(?:\.\d+)?)\s*MP/i, /\bResolution\s*:?\s*(\d+(?:\.\d+)?)\s*MP\s*[;\/,]/i, /each channel can be up to\s*(\d+)\s*MP/i]);
  const bays = first(s, [/SATA\s*:?\s*(\d+)\s*SATA interfaces?/i, /(\d+)\s*SATA (?:III\s*)?(?:ports?|interfaces?|HDDs?)/i, /HDD\s*:?\s*(\d+)\s*SATA/i, /\bSATA\s*(\d+)\s*Capacity/i, /\bSATA\s*(\d+)\s*,\s*SATA interface/i]);
  const maxTb = first(s, [/Up to\s*(\d+)\s*TB\s*capacity\s*(?:for each|per)/i, /up to\s*(\d+)\s*TB\s*for a single HDD/i, /Each disk can contain up to\s*(\d+)\s*TB/i, /SATA (?:port|interface)s?,?\s*up to\s*(\d+)\s*TB/i, /up to\s*(\d+)\s*TB\s*(?:for each|per|each)/i, /(\d+)\s*TB\s*(?:capacity\s*)?(?:for each|per)\s*(?:disk|HDD)/i]);
  const poePorts = isDvr ? 0 : first(s, [/(\d+)\s*independent PoE network interfaces?/i, /PoE Interfaces?\s*:?\s*(\d+)/i, /(\d+)\s*(?:×\s*)?(?:10\/100\s*Mbps\s*)?PoE (?:ports?|interfaces?)/i, /PoE\s*(\d+)\s*(?:ports?|×)/i]) ?? 0;
  const poeBudget = !poePorts ? null : first(s, [/PoE\s*(?:Max\.?\s*)?Power\s*[≤<:]?\s*(?:Max\.?\s*)?(\d+(?:\.\d+)?)\s*W/i, /PoE\s*Interface[^≤<]{0,100}?Power\s*[≤<]\s*(\d+(?:\.\d+)?)\s*W/i, /PoE[^.]{0,40}?(?:Max\.?|total|budget)[^.]{0,20}?(\d+(?:\.\d+)?)\s*W/i, /(?:Max\.?|total)\s*(\d+(?:\.\d+)?)\s*W\s*(?:in total|PoE)/i]);
  const poeAt = !!poePorts && /802\.3\s*af\s*\/\s*at|802\.3at|af\s*\/\s*at/i.test(s);
  const powerW = first(s, [/Consumption\s*:?\s*[≤<]?\s*(\d+(?:\.\d+)?)\s*W\s*\(without (?:HDD|hard disk)/i, /Power Consumption\s*:?\s*[≤<]?\s*(\d+(?:\.\d+)?)\s*W/i, /Consumption\s*[≤<]\s*(\d+(?:\.\d+)?)\s*W/i]);
  // Wi-Fi-регистраторы с записью на microSD — без отсеков под HDD, подбору дисков не подлежат
  const microSd = !bays && /Micro ?SD card storage/i.test(s);
  return { channels, bandwidthMbps: isDvr ? null : bandwidth, maxMP, bays, maxTbPerBay: maxTb, poePorts, poeBudgetW: poeBudget, poeAt, powerW, microSd };
}

const KEYS = {
  nvr: ['channels', 'bandwidthMbps', 'maxMP', 'bays', 'maxTbPerBay', 'poePorts'],
  dvr: ['channels', 'bays', 'maxTbPerBay'],
  poe: ['poePorts', 'budgetW'],
  ups: ['va', 'w'],
};
const res = list.map((x) => {
  const page = extract(read(path.join(DIR, 'raw', `${x.slug}.txt`)), x.grp);
  const pdf = extract(read(path.join(DIR, 'pdf', `${x.slug}.txt`)), x.grp);
  // PoE у регистратора — только у исполнений с «P» в коде (Hikvision «/8P», Dahua «-8P»). Datasheet
  // серии часто описывает все исполнения сразу: у модели без «P» его PoE-порты не берём.
  if (x.grp === 'nvr' && !/[/-]\d*P\b/i.test(x.model)) for (const d of [page, pdf]) if (d) { d.poePorts = 0; d.poeBudgetW = null; d.poeAt = false; }
  const keys = [...KEYS[x.grp]];
  if (x.grp === 'nvr' && ((page?.poePorts || 0) > 0 || (pdf?.poePorts || 0) > 0)) keys.push('poeBudgetW');
  const notes = [];
  const info = [];
  const val = {};
  for (const k of keys) {
    const a = page?.[k] ?? null, b = pdf?.[k] ?? null;
    // предел диска в отсеке: страница новее PDF (прошивки расширяют поддержку дисков) — берём меньшее,
    // это безопасная сторона; расхождение записываем
    if (k === 'maxTbPerBay' && a !== null && b !== null && a !== b) { info.push(`maxTbPerBay: страница ${a}, PDF ${b} — взято меньшее`); val[k] = Math.min(a, b); continue; }
    if (a !== null && b !== null && a !== b) notes.push(`${k}: страница ${a}, PDF ${b}`);
    else if (a === null && b === null) notes.push(`${k}: нет ни в одном документе`);
    else if (a === null || b === null) notes.push(`${k}: только в ${a === null ? 'PDF' : 'странице'}`);
    val[k] = a ?? b;
  }
  // не ключевые поля: берём, где есть; потребление — сверяем с допуском
  for (const k of ['powerW', 'perPortW', 'at', 'hiPoe', 'poeAt']) {
    const a = page?.[k], b = pdf?.[k];
    if (a === undefined && b === undefined) continue;
    val[k] = typeof a === 'boolean' || typeof b === 'boolean' ? !!(a || b) : (a ?? b ?? null);
    // потребление нужно только для ИБП: при расхождении берём большее (запас), не блокируем модель
    if (k === 'powerW' && a != null && b != null && Math.abs(a - b) > 1) { val[k] = Math.max(a, b); info.push(`powerW: страница ${a}, PDF ${b} — взято большее`); }
  }
  const hasDocs = !!(page || pdf);
  const status = page?.microSd || pdf?.microSd ? 'unsupported' : !hasDocs ? 'no_data' : notes.length ? 'needs_review' : 'verified';
  if (status === 'unsupported') notes.splice(0, notes.length, 'запись на microSD, отсеков под HDD нет');
  return { slug: x.slug, grp: x.grp, brand: x.brand, model: x.model, status, ...val, notes, info, page: !!page, pdf: !!pdf };
});
fs.writeFileSync(path.join(DIR, 'd0_result.json'), JSON.stringify(res, null, 1));
const t = {};
for (const r of res) { const k = `${r.brand}|${r.grp}`; t[k] = t[k] || { verified: 0, needs_review: 0, no_data: 0, unsupported: 0 }; t[k][r.status]++; }
console.log(t);
const show = process.argv[2];
if (show) for (const r of res.filter((r) => r.grp === show && r.status === 'needs_review')) console.log(r.model, '|', r.notes.join('; '));
