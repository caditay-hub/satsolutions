// B0: найденные поиском официальные PDF (extra_pdfs.json) и запасные официальные страницы
// (_altPages, если на основной странице нет углов). Страница заменяется, только если в запасной
// есть точный код модели и углы; PDF кладётся, если своего подходящего не было.
const fs = require('fs'), path = require('path');
const { extract, core, flat } = require('./verify.cjs');
const DIR = __dirname, RAW = path.join(DIR, 'raw'), PDF = path.join(DIR, 'pdf');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const map = JSON.parse(fs.readFileSync(path.join(DIR, 'extra_pdfs.json'), 'utf8'));
const logFile = path.join(DIR, 'pass2_pdfs.json');
const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&nbsp;/g, ' ');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
const cardsFor = (key) => inv.filter((r) => r.model.includes(key));
const pdfOk = (slug, model) => { const f = path.join(PDF, `${slug}.txt`); return fs.existsSync(f) && flat(fs.readFileSync(f, 'utf8')).includes(flat(core(model))); };

(async () => {
  for (const [key, url] of Object.entries(map)) {
    if (key.startsWith('_')) continue;
    const cards = cardsFor(key).filter((r) => !pdfOk(r.slug, r.model));
    if (!cards.length) continue;
    try {
      const resp = await fetch(url, { headers: { 'user-agent': UA } });
      const buf = Buffer.from(await resp.arrayBuffer());
      if (!resp.ok || buf.slice(0, 4).toString() !== '%PDF') { console.log('--', key, resp.status); continue; }
      for (const r of cards) {
        fs.writeFileSync(path.join(PDF, `${r.slug}.pdf`), buf);
        const tf = path.join(PDF, `${r.slug}.txt`);
        if (fs.existsSync(tf)) fs.unlinkSync(tf); // пересоздаст pdf2txt.py
        const i = log.findIndex((x) => x.slug === r.slug);
        const e = { slug: r.slug, pdf: url, bytes: buf.length, foundBy: 'search' };
        if (i >= 0) log[i] = e; else log.push(e);
        console.log('pdf', r.model);
      }
    } catch (e) { console.log('--', key, String(e.message || e).slice(0, 80)); }
    await sleep(800);
  }
  for (const [key, url] of Object.entries(map._altPages || {})) {
    for (const r of cardsFor(key)) {
      const cur = path.join(RAW, `${r.slug}.txt`);
      if (fs.existsSync(cur) && extract(fs.readFileSync(cur, 'utf8')).variants.length) continue;
      const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' } });
      const lines = toLines(await resp.text());
      const txt = lines.join('\n');
      if (resp.ok && flat(txt).includes(flat(core(r.model))) && extract(txt).variants.length) {
        fs.writeFileSync(cur, `URL: ${resp.url}\nSTATUS: ${resp.status}\nFETCHED: ${new Date().toISOString()}\nALT: основная страница без углов\n\n` + txt);
        console.log('page', r.model, resp.url);
      } else console.log('-- page', r.model, resp.status);
      await sleep(800);
    }
  }
  fs.writeFileSync(logFile, JSON.stringify(log, null, 1));
})();
