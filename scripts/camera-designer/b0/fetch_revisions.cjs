// B0: карточки с ревизией Hikvision (T5/S5/S6/C0) — страница и PDF именно этой ревизии.
// Кандидаты из sitemap: хвост адреса = код модели + ревизия; страница принимается только с этим кодом в тексте.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw'), PDF = path.join(DIR, 'pdf');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const logFile = path.join(DIR, 'pass2_pdfs.json');
const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
const locs = (f) => (fs.readFileSync(path.join(DIR, f), 'utf8').match(/<loc>[^<]*<\/loc>/g) || []).map((x) => x.slice(5, -6));
const all = [...locs('hik_en.xml'), ...locs('hik_europe.xml')].filter((u) => /products/i.test(u));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&nbsp;/g, ' ');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const core = (m) => m.replace(/\(.*$/, '').replace(/\s.*$/, '').replace(/\/.*$/, '');

(async () => {
  for (const r of inv) {
    const rev = (r.model.match(/\((T\d|S\d|C\d)\)/i) || [])[1] || (r.model.match(/\s(T\d|S\d)\b/) || [])[1];
    if (!rev || r.brand !== 'Hikvision') continue;
    const want = flat(core(r.model)) + flat(rev);
    const cands = all.filter((u) => flat(decodeURIComponent(u.split('/').filter(Boolean).pop())) === want)
      .sort((a, b) => (/\/en\//.test(b) ? 1 : 0) - (/\/en\//.test(a) ? 1 : 0)).slice(0, 3);
    let ok = false;
    for (const url of cands) {
      const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
      const html = await resp.text();
      const txt = toLines(html).join('\n');
      if (!resp.ok || !flat(txt).includes(want)) { await sleep(800); continue; }
      fs.writeFileSync(path.join(RAW, `${r.slug}.txt`), `URL: ${resp.url}\nSTATUS: ${resp.status}\nFETCHED: ${new Date().toISOString()}\nREV: ${rev}\n\n` + txt);
      ok = true;
      // PDF той же ревизии, если своего с ревизией ещё нет
      const pdfTxt = path.join(PDF, `${r.slug}.txt`);
      const hasRevPdf = fs.existsSync(pdfTxt) && flat(fs.readFileSync(pdfTxt, 'utf8')).includes(want);
      const pdfs = [...new Set((html.match(/https?:\/\/[^"'\s]+?\.pdf/gi) || []).filter((u) => /datasheet/i.test(u) && flat(u).includes(flat(rev))))];
      if (!hasRevPdf && pdfs[0]) {
        await sleep(800);
        const p = await fetch(pdfs[0], { headers: { 'user-agent': UA } });
        const buf = Buffer.from(await p.arrayBuffer());
        if (p.ok && buf.slice(0, 4).toString() === '%PDF') {
          fs.writeFileSync(path.join(PDF, `${r.slug}.pdf`), buf);
          if (fs.existsSync(pdfTxt)) fs.unlinkSync(pdfTxt);
          const i = log.findIndex((x) => x.slug === r.slug);
          const e = { slug: r.slug, pdf: pdfs[0], bytes: buf.length, foundBy: 'revision' };
          if (i >= 0) log[i] = e; else log.push(e);
        }
      }
      break;
    }
    console.log(ok ? 'OK ' : '-- ', r.model, cands.length);
    await sleep(800);
  }
  fs.writeFileSync(logFile, JSON.stringify(log, null, 1));
})();
