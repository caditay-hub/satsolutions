// B0, проход 1b: модели без прямого совпадения в sitemap. Кандидаты — страницы той же базы
// модели; страница принимается, только если в её тексте есть точный код модели (ядро без
// объектива, региона и цвета). Иначе — в список для поиска по дистрибьюторам.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const locs = (f) => (fs.readFileSync(path.join(DIR, f), 'utf8').match(/<loc>[^<]*<\/loc>/g) || []).map((x) => x.slice(5, -6));
const all = [...locs('hik_en.xml'), ...locs('hik_europe.xml'), ...locs('dh_en.xml')].filter((u) => /products/i.test(u));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&nbsp;/g, ' ');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
/** Ядро модели: без объектива «(2.8mm)», региона «(O-STD)», хвоста после пробела и цвета после «/». */
const core = (m) => m.replace(/\(.*$/, '').replace(/\s.*$/, '').replace(/\/.*$/, '').replace(/^DHI?-/i, '');
const base = (m) => flat(core(m)).replace(/^(ds|ids)/, '').slice(0, 9);

(async () => {
  const out = [];
  const todo = inv.filter((r) => !r.srcUrls.length && /Hikvision|Dahua/.test(r.brand));
  for (const r of todo) {
    const b = base(r.model), want = flat(core(r.model));
    const cands = [...new Set(all.filter((u) => flat(decodeURIComponent(u.split('/').filter(Boolean).pop())).includes(b)))]
      .sort((x, y) => (/\/en\//.test(y) ? 1 : 0) - (/\/en\//.test(x) ? 1 : 0)).slice(0, 6);
    let found = null;
    for (const url of cands) {
      try {
        const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
        const html = await resp.text();
        const lines = toLines(html);
        if (resp.ok && flat(lines.join(' ')).includes(want)) {
          fs.writeFileSync(path.join(RAW, `${r.slug}.txt`), `URL: ${resp.url}\nSTATUS: ${resp.status}\nFETCHED: ${new Date().toISOString()}\nMATCH: ${core(r.model)}\n\n` + lines.join('\n'));
          found = resp.url; break;
        }
      } catch { /* следующий кандидат */ }
      await sleep(800);
    }
    out.push({ slug: r.slug, model: r.model, core: core(r.model), candidates: cands.length, url: found });
    console.log(`${found ? 'OK ' : '-- '} ${r.model} (${cands.length})`);
  }
  fs.writeFileSync(path.join(DIR, 'pass1b_candidates.json'), JSON.stringify(out, null, 1));
  console.log('found', out.filter((x) => x.url).length, '/', out.length);
})();
