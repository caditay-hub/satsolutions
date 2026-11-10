// B0, проход 1: официальные страницы моделей (hikvision.com / dahuasecurity.com) → текст + поля оптики.
// Только чтение чужих сайтов, по одному запросу с паузой. Текст страниц сохраняется как доказательство.
const fs = require('fs'), path = require('path');
const DIR = __dirname, RAW = path.join(DIR, 'raw');
fs.mkdirSync(RAW, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36';
const inv = JSON.parse(fs.readFileSync(path.join(DIR, 'inv_urls.json'), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#34;|&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const toLines = (html) => decode(html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, '\n')).split('\n').map((x) => x.trim()).filter(Boolean);

// значения поля: строки после метки до следующей «короткой метки»
const LABELS = /^(Max\. Resolution|Image Sensor|Lens Type|Focal Length & FOV|Focal Length|Field of View|Lens Mount|Max\. Aperture|Aperture|Iris|DORI|Zoom|Optical Zoom|Min\. Illumination|Shutter|Close Focus Distance|Angle Adjustment|Lens|Video Compression|Main Stream|Pixel|Effective Pixels|Lens Size|Focus)$/i;
function field(lines, re, max = 6) {
  const out = [];
  lines.forEach((l, i) => {
    if (!re.test(l)) return;
    const vals = [];
    for (let j = i + 1; j < Math.min(lines.length, i + 1 + max); j++) {
      if (LABELS.test(lines[j])) break;
      vals.push(lines[j]);
    }
    out.push(vals.join(' | '));
  });
  return [...new Set(out)];
}

(async () => {
  const res = [];
  const todo = inv.filter((r) => r.srcUrls && r.srcUrls.length);
  for (const [n, r] of todo.entries()) {
    const url = r.srcUrls.find((u) => /\/en\//.test(u)) || r.srcUrls[0];
    let html = '', status = 0, finalUrl = url;
    try {
      const resp = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'en' }, redirect: 'follow' });
      status = resp.status; finalUrl = resp.url; html = await resp.text();
    } catch (e) { status = -1; }
    const lines = toLines(html);
    fs.writeFileSync(path.join(RAW, `${r.slug}.txt`), `URL: ${finalUrl}\nSTATUS: ${status}\nFETCHED: ${new Date().toISOString()}\n\n` + lines.join('\n'));
    const pdfs = [...new Set((html.match(/https?:\/\/[^"'\s]+?\.pdf/gi) || []).filter((u) => /datasheet|spec/i.test(u)))].slice(0, 5);
    res.push({
      slug: r.slug, model: r.model, brand: r.brand, kind: r.kind, lenses: r.lenses, url: finalUrl, status,
      redirected: finalUrl.replace(/\/$/, '').toLowerCase() !== url.replace(/\/$/, '').toLowerCase(),
      resolution: field(lines, /^Max\. Resolution$/i, 2),
      sensor: field(lines, /^Image Sensor$/i, 2),
      lensType: field(lines, /^Lens Type$/i, 2),
      focalFov: field(lines, /^Focal Length & FOV$/i, 8),
      fov: field(lines, /^Field of View$/i, 6),
      focal: field(lines, /^Focal Length$/i, 2),
      pdfs,
    });
    if (n % 20 === 0) console.log(`${n + 1}/${todo.length} ${r.model} ${status}`);
    await sleep(800);
  }
  fs.writeFileSync(path.join(DIR, 'pass1_pages.json'), JSON.stringify(res, null, 1));
  console.log('done', res.length, 'ok', res.filter((x) => x.status === 200).length, 'withFov', res.filter((x) => x.focalFov.length || x.fov.length).length);
})();
