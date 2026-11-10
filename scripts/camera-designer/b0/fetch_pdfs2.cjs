// B0: PDF-datasheet для страниц, найденных позже (повторы и проход 1b). Ссылку на PDF берём
// со страницы модели заново; правило выбора то же, что в fetch_pdfs.cjs.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw'), PDF = path.join(DIR, 'pdf');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const logFile = path.join(DIR, 'pass2_pdfs.json');
const log = JSON.parse(fs.readFileSync(logFile, 'utf8'));
const norm = (s) => s.toLowerCase().replace(/^(dh-|ds-|ids-)/, '').replace(/\(.*?\)/g, '').replace(/[^a-z0-9]/g, '');

(async () => {
  const todo = fs.readdirSync(RAW).map((f) => f.replace(/\.txt$/, '')).filter((s) => !fs.existsSync(path.join(PDF, `${s}.pdf`)) && !log.some((x) => x.slug === s && x.bytes));
  for (const slug of todo) {
    const url = (fs.readFileSync(path.join(RAW, `${slug}.txt`), 'utf8').match(/^URL: (.*)$/m) || [])[1];
    const r = inv.find((x) => x.slug === slug);
    let entry = { slug, pdf: null, why: 'нет ссылки на PDF на странице' };
    try {
      const html = await (await fetch(url, { headers: { 'user-agent': UA } })).text();
      const pdfs = [...new Set((html.match(/https?:\/\/[^"'\s]+?\.pdf/gi) || []).filter((u) => /datasheet|spec/i.test(u)))];
      const m = norm(r.model.replace(/\s.*$/, ''));
      pdfs.sort((a, b) => ((norm(a).includes(m.slice(0, 10)) ? 0 : 2) + (/[_-](LA|JP|BR|KR|Jordan)/i.test(a) ? 1 : 0)) - ((norm(b).includes(m.slice(0, 10)) ? 0 : 2) + (/[_-](LA|JP|BR|KR|Jordan)/i.test(b) ? 1 : 0)));
      if (pdfs[0]) {
        await sleep(800);
        const resp = await fetch(pdfs[0], { headers: { 'user-agent': UA } });
        const buf = Buffer.from(await resp.arrayBuffer());
        if (resp.ok && buf.slice(0, 4).toString() === '%PDF') { fs.writeFileSync(path.join(PDF, `${slug}.pdf`), buf); entry = { slug, pdf: pdfs[0], bytes: buf.length }; }
        else entry = { slug, pdf: pdfs[0], why: `HTTP ${resp.status} / не PDF` };
      }
    } catch (e) { entry = { slug, pdf: null, why: String(e.message || e).slice(0, 100) }; }
    const i = log.findIndex((x) => x.slug === slug);
    if (i >= 0) log[i] = entry; else log.push(entry);
    console.log(slug, entry.bytes ? 'pdf ok' : entry.why);
    await sleep(800);
  }
  fs.writeFileSync(logFile, JSON.stringify(log, null, 1));
})();
