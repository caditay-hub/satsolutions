// B0: повтор страниц, которые не загрузились в проходе 1 (сеть, 504). Перезаписывает raw/<slug>.txt.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw');
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&nbsp;/g, ' ');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);
const failed = fs.readdirSync(RAW).filter((f) => /^STATUS: (-1|[45]\d\d)$/m.test(fs.readFileSync(path.join(RAW, f), 'utf8'))).map((f) => f.replace(/\.txt$/, ''));

(async () => {
  for (const slug of failed) {
    const r = inv.find((x) => x.slug === slug);
    const url = r.srcUrls.find((u) => /\/en\//.test(u)) || r.srcUrls[0];
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' }, signal: AbortSignal.timeout(90000) });
        const html = await resp.text();
        fs.writeFileSync(path.join(RAW, `${slug}.txt`), `URL: ${resp.url}\nSTATUS: ${resp.status}\nFETCHED: ${new Date().toISOString()}\n\n` + toLines(html).join('\n'));
        console.log(slug, resp.status, `попытка ${attempt}`);
        if (resp.ok) break;
      } catch (e) { console.log(slug, 'ошибка', attempt, String(e.message || e).slice(0, 80)); }
      await sleep(5000);
    }
    await sleep(1500);
  }
})();
