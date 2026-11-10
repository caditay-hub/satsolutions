// B0, проход 1c: модели без страницы — пробуем стандартные адреса архива Dahua
// (discontinued-products/<раздел>/<модель>) и разделы Hikvision по шаблону. Принимаем
// страницу только с точным кодом модели в тексте, как и раньше.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&nbsp;/g, ' ');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const core = (m) => m.replace(/\(.*$/, '').replace(/\s.*$/, '').replace(/\/.*$/, '').replace(/^DHI?-/i, '');

const SECTIONS = { ip: ['network-cameras'], ptz: ['ptz-cameras', 'network-cameras'], analog: ['hdcvi-cameras'], fisheye: ['network-cameras'], thermal: ['thermal-cameras'] };
(async () => {
  const out = [];
  const todo = inv.filter((r) => r.brand === 'Dahua' && !fs.existsSync(path.join(RAW, `${r.slug}.txt`)));
  for (const r of todo) {
    const m = core(r.model).toLowerCase();
    const urls = [];
    for (const s of SECTIONS[r.kind] || ['network-cameras']) for (const v of [m, `${m}=s2`, `${m}-s2`]) urls.push(`https://www.dahuasecurity.com/products/discontinued-products/${s}/${v}`);
    let found = null;
    for (const url of urls) {
      try {
        const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' }, signal: AbortSignal.timeout(60000) });
        if (resp.ok) {
          const lines = toLines(await resp.text());
          if (flat(lines.join(' ')).includes(flat(core(r.model)))) {
            fs.writeFileSync(path.join(RAW, `${r.slug}.txt`), `URL: ${resp.url}\nSTATUS: ${resp.status}\nFETCHED: ${new Date().toISOString()}\nMATCH: ${core(r.model)}\n\n` + lines.join('\n'));
            found = resp.url; break;
          }
        }
      } catch { /* следующий адрес */ }
      await sleep(700);
    }
    out.push({ slug: r.slug, model: r.model, url: found });
    console.log(found ? 'OK ' : '-- ', r.model);
  }
  fs.writeFileSync(path.join(DIR, 'pass1c_patterns.json'), JSON.stringify(out, null, 1));
  console.log('found', out.filter((x) => x.url).length, '/', out.length);
})();
