// D0, шаг 2: официальная страница модели (текст — доказательство) + PDF-datasheet со страницы.
// Страница из кандидатов принимается, только если в её тексте есть точный код модели.
// Только чтение чужих сайтов, по одному запросу с паузой.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw'), PDF = path.join(DIR, 'pdf');
fs.mkdirSync(RAW, { recursive: true }); fs.mkdirSync(PDF, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = JSON.parse(fs.readFileSync(path.join(DIR, 'd0_list.json'), 'utf8'));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const only = process.argv[2] ? new Set(process.argv[2].split(',')) : null;

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' }, redirect: 'follow', signal: AbortSignal.timeout(60000) });
  return { r, html: await r.text() };
}

(async () => {
  const log = [];
  for (const [n, x] of list.entries()) {
    if (only && !only.has(x.slug)) continue;
    const rawFile = path.join(RAW, `${x.slug}.txt`);
    let page = null, pdfs = [];
    const tryUrls = [...x.urls.sort((a, b) => (/\/en\//.test(b) ? 1 : 0) - (/\/en\//.test(a) ? 1 : 0)), ...x.cands];
    for (const url of tryUrls) {
      try {
        const { r, html } = await get(url);
        const lines = toLines(html);
        if (r.ok && flat(lines.join(' ')).includes(x.want)) {
          fs.writeFileSync(rawFile, `URL: ${r.url}\nSTATUS: ${r.status}\nFETCHED: ${new Date().toISOString()}\nMATCH: ${x.core}\n\n` + lines.join('\n'));
          page = r.url;
          pdfs = [...new Set((html.match(/https?:\/\/[^"'\s]+?\.pdf/gi) || []).filter((u) => /datasheet|spec/i.test(u)))];
          break;
        }
      } catch { /* следующий адрес */ }
      await sleep(800);
    }
    let pdf = null;
    if (pdfs.length) {
      const m = flat(x.core.replace(/\/.*$/, ''));
      pdfs.sort((a, b) => (flat(b).includes(m) ? 1 : 0) - (flat(a).includes(m) ? 1 : 0) || (/[_-](LA|JP|BR|KR)/i.test(a) ? 1 : 0) - (/[_-](LA|JP|BR|KR)/i.test(b) ? 1 : 0));
      for (const url of pdfs.slice(0, 2)) {
        try {
          const r = await fetch(url, { headers: { 'user-agent': UA }, signal: AbortSignal.timeout(90000) });
          const buf = Buffer.from(await r.arrayBuffer());
          if (r.ok && buf.slice(0, 4).toString() === '%PDF') { fs.writeFileSync(path.join(PDF, `${x.slug}.pdf`), buf); pdf = url; break; }
        } catch { /* второй PDF */ }
        await sleep(800);
      }
    }
    log.push({ slug: x.slug, model: x.model, grp: x.grp, page, pdf, pdfCands: pdfs.length });
    console.log(`${n + 1}/${list.length} ${page ? 'P' : '-'}${pdf ? 'D' : '-'} ${x.model}`);
  }
  const f = path.join(DIR, 'fetch_log.json');
  const prev = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : [];
  const merged = [...prev.filter((p) => !log.some((l) => l.slug === p.slug)), ...log];
  fs.writeFileSync(f, JSON.stringify(merged, null, 1));
  console.log('pages', merged.filter((x) => x.page).length, 'pdfs', merged.filter((x) => x.pdf).length, '/', merged.length);
})();
