// B0, проход 2: официальный PDF-datasheet той же модели — второй, независимый документ.
// Скачивает PDF (по одному, с паузой); текст вытаскивает pdf2txt.py (pypdf).
const fs = require('fs'), path = require('path');
const DIR = __dirname, PDF = path.join(DIR, 'pdf');
fs.mkdirSync(PDF, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pages = JSON.parse(fs.readFileSync(path.join(DIR, 'pass1_pages.json'), 'utf8'));
const norm = (s) => s.toLowerCase().replace(/^(dh-|ds-|ids-)/, '').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');

(async () => {
  const log = [];
  for (const p of pages) {
    if (!p.pdfs || !p.pdfs.length) { log.push({ slug: p.slug, pdf: null, why: 'нет ссылки на PDF на странице' }); continue; }
    const m = norm(p.model.replace(/\s.*$/, ''));
    // предпочитаем datasheet, в имени которого есть модель; региональные (_LA, _JP, -Jordan) — в конец
    const ranked = [...p.pdfs].sort((a, b) => {
      const sa = (norm(a).includes(m.slice(0, 10)) ? 0 : 2) + (/[_-](LA|JP|BR|KR|Jordan)/i.test(a) ? 1 : 0);
      const sb = (norm(b).includes(m.slice(0, 10)) ? 0 : 2) + (/[_-](LA|JP|BR|KR|Jordan)/i.test(b) ? 1 : 0);
      return sa - sb;
    });
    const url = ranked[0];
    const file = path.join(PDF, `${p.slug}.pdf`);
    try {
      const r = await fetch(url, { headers: { 'user-agent': UA } });
      const buf = Buffer.from(await r.arrayBuffer());
      if (r.ok && buf.slice(0, 4).toString() === '%PDF') { fs.writeFileSync(file, buf); log.push({ slug: p.slug, pdf: url, bytes: buf.length }); }
      else log.push({ slug: p.slug, pdf: url, why: `HTTP ${r.status} / не PDF` });
    } catch (e) { log.push({ slug: p.slug, pdf: url, why: String(e.message || e) }); }
    await sleep(800);
  }
  fs.writeFileSync(path.join(DIR, 'pass2_pdfs.json'), JSON.stringify(log, null, 1));
  console.log('pdf ok', log.filter((x) => x.bytes).length, '/', log.length);
})();
