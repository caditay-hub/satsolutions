// D0: модели Dahua без страницы в sitemap — поиск по сайту производителя
// (dahuasecurity.com/search?type=products&keyword=<модель>). Найденные ссылки идут в кандидаты;
// принимает страницу fetch.cjs — только с точным кодом модели в тексте.
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const list = JSON.parse(fs.readFileSync(path.join(DIR, 'd0_list.json'), 'utf8'));
const log = JSON.parse(fs.readFileSync(path.join(DIR, 'fetch_log.json'), 'utf8'));
const flat = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

(async () => {
  const todo = list.filter((x) => x.brand === 'Dahua' && !log.find((l) => l.slug === x.slug && l.page));
  for (const x of todo) {
    const kw = x.core.replace(/^DH-/i, '');
    try {
      // коммутаторы на сайте Dahua называются с префиксом «DH-» — пробуем оба написания
      let html = '';
      for (const k of [kw, `DH-${kw}`]) {
        const r = await fetch(`https://www.dahuasecurity.com/search?type=products&keyword=${encodeURIComponent(k)}`, { headers: { 'user-agent': UA, 'accept-language': 'en' }, signal: AbortSignal.timeout(60000) });
        html += await r.text();
        await sleep(800);
      }
      const hrefs = [...new Set((html.match(/href="(https:\/\/www\.dahuasecurity\.com\/products\/[^"]+)"/g) || []).map((h) => h.slice(6, -1)))]
        .filter((u) => !/\/kits?\//i.test(u))
        // ссылки, в последнем сегменте которых есть код модели; точное совпадение — первым
        .filter((u) => flat(decodeURIComponent(u.split('/').slice(-2).join('/'))).includes(x.want))
        .sort((a, b) => Math.abs(flat(a.split('/').pop()).length - x.want.length) - Math.abs(flat(b.split('/').pop()).length - x.want.length));
      x.cands = [...hrefs.slice(0, 4), ...x.cands].slice(0, 8);
      console.log(hrefs.length ? 'OK ' : '-- ', x.model, hrefs[0] || '');
    } catch (e) { console.log('ERR', x.model, String(e.message || e).slice(0, 60)); }
    await sleep(1000);
  }
  fs.writeFileSync(path.join(DIR, 'd0_list.json'), JSON.stringify(list, null, 1));
  fs.writeFileSync(path.join(DIR, 'retry.txt'), todo.map((x) => x.slug).join(','));
})();
