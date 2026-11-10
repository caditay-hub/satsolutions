// B0: документы из mapped_sources.json. page — официальная страница (→ raw/), pdf — официальный
// datasheet (→ pdf/), pdf2 — второй официальный PDF (другой регион/язык), если страницы нет:
// кладётся в pdf2/ и после pdf2txt.py копируется в raw/ как второй документ.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw'), PDF = path.join(DIR, 'pdf'), PDF2 = path.join(DIR, 'pdf2');
fs.mkdirSync(PDF2, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const map = JSON.parse(fs.readFileSync(path.join(DIR, 'mapped_sources.json'), 'utf8'));
const logFile = path.join(DIR, 'pass2_pdfs.json');
const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&nbsp;/g, ' ');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
// карточки ключа: точное вхождение ключа как отдельного кода (за ним — конец, пробел, «(» или «/»)
const cardsFor = (key) => inv.filter((r) => new RegExp(`(^|[^A-Z0-9-])(DH-|DHI-)?${key.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}($|[\\s(/])`, 'i').test(r.model));
async function get(url) {
  const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' }, signal: AbortSignal.timeout(90000) });
  return { resp, buf: Buffer.from(await resp.arrayBuffer()) };
}

(async () => {
  for (const [key, src] of Object.entries(map)) {
    if (key.startsWith('_')) continue;
    const cards = cardsFor(key);
    if (!cards.length) { console.log('нет карточек для', key); continue; }
    try {
      if (src.page) {
        const { resp, buf } = await get(src.page);
        const txt = toLines(buf.toString('utf8')).join('\n');
        for (const r of cards) fs.writeFileSync(path.join(RAW, `${r.slug}.txt`), `URL: ${resp.url}\nSTATUS: ${resp.status}\nFETCHED: ${new Date().toISOString()}\nFOUND: search\n\n` + txt);
        await sleep(800);
      }
      for (const [k, dir] of [['pdf', PDF], ['pdf2', PDF2]]) {
        if (!src[k]) continue;
        const { resp, buf } = await get(src[k]);
        if (!resp.ok || buf.slice(0, 4).toString() !== '%PDF') { console.log('--', key, k, resp.status); continue; }
        for (const r of cards) {
          fs.writeFileSync(path.join(dir, `${r.slug}.pdf`), buf);
          const tf = path.join(dir, `${r.slug}.txt`);
          if (fs.existsSync(tf)) fs.unlinkSync(tf);
          if (k === 'pdf') {
            const i = log.findIndex((x) => x.slug === r.slug);
            const e = { slug: r.slug, pdf: src.pdf, bytes: buf.length, foundBy: 'search' };
            if (i >= 0) log[i] = e; else log.push(e);
          } else fs.writeFileSync(path.join(dir, `${r.slug}.url`), src.pdf2);
        }
        await sleep(800);
      }
      console.log('ok', key, '→', cards.map((c) => c.model).join(' | '));
    } catch (e) { console.log('--', key, String(e.message || e).slice(0, 80)); }
  }
  fs.writeFileSync(logFile, JSON.stringify(log, null, 1));
})();
