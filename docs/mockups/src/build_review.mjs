// Собирает локальную версию макета 44 страниц с родными фото с api.satsolutions.uz
// и панелью отметок «подходит / не подходит». Файл открывается на машине владельца.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __dir = path.dirname(fileURLToPath(import.meta.url));
const S = __dir;
const OUT = path.join(__dir, "../service-pages-review.html");
const GAL = {cctv:3,analytics:3,anpr:3,access:3,intercom:3,attendance:3,alarm:3,fire:3,network:3,server:3,wifi:0,fiber:0,radiobridge:0,mikrotik:0,smarthome:0,turnstile:0,locks:0,gates:0,telephony:0,virtualization:0,servers:0,videowall:3,pa:3,barrier:3,perimeter:5,"ohrannye-sistemy":0,"intellektualnoe-upravlenie-parkingom":3,"slabotochnye-sistemy":3,proektirovanie:3,obsluzhivanie:3,"sistemnaya-integraciya":3,bus:4,city:2,parking:3,retail:4,bank:5,school:5,industry:3,residential:2,warehouse:3,construction:3,medical:3,hotel:3,fuel:3};
const EQUIP = {turnstile:["zkteco-turnstiles","hik-turnstiles","kanihad-turnstiles"],barrier:["zkteco-barriers","hik-turnstiles"],access:["access-control","access-controllers"],locks:["zkteco-locks","kanihad-locks"],cctv:["hik-ip-cameras","network-cameras","hik-wireless-cameras"],intercom:["hik-intercoms","indoor-monitors"],fire:["prochee-fire","rubezh-detectors","prochee-ognetushiteli"],servers:["pxt-server"],alarm:["hik-axpro","bolid-detectors","detectors"],"ohrannye-sistemy":["hik-axpro","bolid-detectors","detectors"],pa:["prochee-pa","rubezh-sirens","bolid-sirens"],perimeter:["thermal-cameras","hik-ip-cameras","hik-project"],anpr:["hik-ip-cameras","zkteco-barriers"],"intellektualnoe-upravlenie-parkingom":["zkteco-barriers","hik-turnstiles","displei-hik"],attendance:["hik-access-terminals","zkteco-terminals"],gates:["zkteco-barriers","kanihad-turnstiles"],analytics:["hik-ip-cameras","hik-nvr"],videowall:["displei-hik","displei","hik-nvr"],network:["pxt-scs","pxt-switches","pxt-racks"],wifi:["tplink-wifi","hik-wifi","witek-wifi"],fiber:["pxt-fiber","pxt-tools","pxt-pon"],radiobridge:["mikrotik-wireless","witek-bridges","ruijie-wireless"],mikrotik:["mikrotik-routers","mikrotik-switches","mikrotik-sfp"],telephony:["pxt-voip"],server:["pxt-server","pxt-racks","pxt-ups"],"slabotochnye-sistemy":["hik-ip-cameras","prochee-fire","hik-access-terminals"],proektirovanie:["rubezh-panels","hik-ip-cameras","access-controllers"],obsluzhivanie:["prochee-ognetushiteli","bolid-detectors","prochee-fire"],"sistemnaya-integraciya":["hik-nvr","pxt-server","hik-access-terminals"]};

let html = fs.readFileSync(`${S}/all_pages_template.html`, "utf8");
const data = fs.readFileSync(`${S}/pages.json`, "utf8").replace(/<\/script/gi, "<\\/script");
html = html.replace("{{DATA}}", data);
html = html.replace("<title>Страницы услуг: 44 макета</title>", "<title>Проверка фото: 44 страницы услуг</title>");
html = html.replace("const IMG = {{IMG}};", `const IMG = {}; const API = "https://api.satsolutions.uz"; const GAL = ${JSON.stringify(GAL)}; const EQUIP = ${JSON.stringify(EQUIP)};`);
html = html.replace(/const heroFor = k => \{[^\n]*\n/, `const heroFor = k => API + "/uploads/services-page/" + k + ".jpg?v=11";\n`);
html = html.replace(/const covFor = \(k,i\) => \{[^\n]*\n/, `const covFor = (k,i) => { const ind = byKey[k]?.group==='industry'; const n = GAL[k]||0; const idx = i + 1 + (ind?1:0); return idx <= n ? API + "/uploads/services-page/" + k + "-" + idx + ".jpg?v=11" : null; };\n`);
if (!html.includes('const heroFor = k => API')) throw new Error("heroFor not replaced");
if (!html.includes('const covFor = (k,i) => { const ind')) throw new Error("covFor not replaced");
// заголовок панели
html = html.replace('<p class="hint">44 страницы в новом порядке. Тексты, пакеты, этапы и вопросы взяты с сайта как есть.</p>',
 `<div class="rv"><b id="rvCount">0 отметок</b><div class="rvb"><button id="rvCopy">Скопировать отметки</button><button id="rvDl">Скачать JSON</button><button id="rvClr">Сбросить</button></div><p class="hint">Под каждым фото две кнопки и поле для замечания. Отметки хранятся в браузере до сброса. Когда закончите, «Скопировать отметки» и вставьте текст в чат.</p></div>`);
// вызов enhance после show
html = html.replace("document.getElementById('main').scrollIntoView({block:'start'});", "document.getElementById('main').scrollIntoView({block:'start'});\n  enhance(p);");
const REVIEW_CSS = `
.rv{margin:6px 6px 10px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--bg)}
.rv b{display:block;font:700 14px/1 Jura,sans-serif;margin-bottom:8px}
.rvb{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.rvb button{width:auto;border:1px solid var(--line);background:var(--bg2);padding:6px 9px;font-size:12px;border-radius:8px}
.slot{position:relative}
.slot .bar{display:flex;gap:6px;align-items:center;flex-wrap:wrap;padding:8px 10px;background:var(--bg2);border:1px solid var(--line);border-radius:0 0 12px 12px;margin-top:-6px;font-size:12px}
.slot .bar button{border:1px solid var(--line);background:#fff;color:#0f172a;border-radius:8px;padding:5px 9px;font:700 12px Inter,sans-serif;cursor:pointer}
.slot .bar button.ok.on{background:#16a34a;color:#fff;border-color:#16a34a}
.slot .bar button.no.on{background:#dc2626;color:#fff;border-color:#dc2626}
.slot .bar input{flex:1;min-width:120px;border:1px solid var(--line);border-radius:8px;padding:5px 8px;font-size:12px;background:#fff;color:#0f172a}
.slot .bar small{color:var(--mute);font-size:11px;width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.slot.ok img,.slot.ok .phx,.slot.ok .covx{outline:3px solid #16a34a;outline-offset:-3px}
.slot.no img,.slot.no .phx,.slot.no .covx{outline:3px solid #dc2626;outline-offset:-3px}
.missing{aspect-ratio:16/10;border-radius:20px;background:repeating-linear-gradient(45deg,#fee2e2,#fee2e2 10px,#fff 10px,#fff 20px);display:grid;place-items:center;color:#991b1b;font:700 13px Inter,sans-serif;text-align:center;padding:12px;border:1px solid #fecaca}
.equipgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-top:20px}
.equipgrid .it{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:#fff}
.equipgrid .it .im{height:150px;display:grid;place-items:center;background:#fff;border-bottom:1px solid var(--line)}
.equipgrid .it img{max-height:130px;width:auto;object-fit:contain}
.equipgrid .it .b{padding:10px 12px;font-size:13px;color:var(--ink)}
.equipgrid .it .b span{display:block;color:var(--brand);font-weight:800;margin-top:4px}
.note{font-size:13px;color:var(--mute);margin-top:12px}
`;
html = html.replace("</style>", REVIEW_CSS + "</style>");
const REVIEW_JS = `
<script>
const KEY='sat-photo-review';
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return{}}};
const save=(o)=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch{}; updCount();};
function updCount(){const o=load();const n=Object.keys(o).length;const ok=Object.values(o).filter(x=>x.v==='ok').length;const no=Object.values(o).filter(x=>x.v==='no').length;document.getElementById('rvCount').textContent=n+' отметок: '+ok+' подходит, '+no+' нет';}
function slotify(el, page, slot, url){
  if(!el||el.closest('.slot'))return;
  const wrap=document.createElement('div');wrap.className='slot';el.parentNode.insertBefore(wrap,el);wrap.appendChild(el);
  const id=page+'|'+slot+'|'+(url||'нет');
  const bar=document.createElement('div');bar.className='bar';
  bar.innerHTML='<button class="ok">✓ подходит</button><button class="no">✗ не подходит</button><input placeholder="замечание, какое фото нужно">'+'<small>'+slot+' · '+(url?url.replace(API+'/uploads/',''):'файла нет')+'</small>';
  wrap.appendChild(bar);
  const st=load()[id]||{};
  const okB=bar.querySelector('.ok'),noB=bar.querySelector('.no'),inp=bar.querySelector('input');
  const paint=()=>{const s=load()[id]||{};okB.classList.toggle('on',s.v==='ok');noB.classList.toggle('on',s.v==='no');wrap.classList.toggle('ok',s.v==='ok');wrap.classList.toggle('no',s.v==='no');};
  inp.value=st.c||'';
  const set=(v)=>{const o=load();const cur=o[id]||{};o[id]={page,slot,url:url||null,v:cur.v===v?undefined:v,c:inp.value};if(!o[id].v&&!o[id].c)delete o[id];save(o);paint();};
  okB.onclick=()=>set('ok');noB.onclick=()=>set('no');
  inp.oninput=()=>{const o=load();o[id]={page,slot,url:url||null,v:(o[id]||{}).v,c:inp.value};if(!o[id].v&&!o[id].c)delete o[id];save(o);};
  paint();
  if(el.tagName==='IMG'){el.addEventListener('error',()=>{const m=document.createElement('div');m.className='missing';m.textContent='Фото не загрузилось: '+url.replace(API+'/uploads/','');el.replaceWith(m);});}
}
async function enhance(p){
  const main=document.getElementById('main');
  const hero=main.querySelector('img.ph, .phx'); slotify(hero,p.key,'первый экран',hero?.tagName==='IMG'?hero.src:null);
  main.querySelectorAll('.pkg').forEach((pk,i)=>{const im=pk.querySelector('img.cov, .covx');slotify(im,p.key,'решение '+(i+1),im?.tagName==='IMG'?im.src:null);});
  // витрина оборудования с живого API (если CORS пустит)
  const cats=EQUIP[p.key];
  const eqSec=[...main.querySelectorAll('section')].find(s=>s.textContent.includes('Смотреть в каталоге'));
  if(cats&&eqSec){
    const grid=document.createElement('div');grid.className='equipgrid';eqSec.querySelector('.wrap').appendChild(grid);
    const note=document.createElement('p');note.className='note';note.textContent='Загружаю товары из каталога…';eqSec.querySelector('.wrap').appendChild(note);
    try{
      const lists=await Promise.all(cats.map(c=>fetch(API+'/products?page=1&limit=4&category='+encodeURIComponent(c)).then(r=>r.json()).then(r=>r.items||[]).catch(()=>[])));
      const merged=[];for(let i=0;i<4;i++)for(const l of lists)if(l[i])merged.push(l[i]);
      const items=merged.filter(x=>x.coverImageUrl).slice(0,8);
      if(!items.length){note.textContent='Витрина: товары не загрузились (нет доступа к API из локального файла или пустые категории).';return;}
      note.textContent='Витрина: '+items.length+' товаров из категорий '+cats.join(', ');
      grid.innerHTML=items.map(x=>{const u=x.coverImageUrl.startsWith('http')?x.coverImageUrl:API+x.coverImageUrl;return '<div class="it"><div class="im"><img src="'+u+'" alt=""></div><div class="b">'+esc(x.name)+'<span>'+(Number(x.price)>0?Math.round(Number(x.price)).toLocaleString('ru-RU')+' сум':'цена по запросу')+'</span></div></div>';}).join('');
      grid.querySelectorAll('.it').forEach((it,i)=>slotify(it.querySelector('img'),p.key,'товар '+(i+1),it.querySelector('img').src));
    }catch(e){note.textContent='Витрина: API недоступен из локального файла ('+e.message+').';}
  }
  // кейсы портфолио с живого API
  try{
    const r=await fetch(API+'/portfolio?page=1&limit=3').then(r=>r.json());
    const items=(r.items||[]).slice(0,3);
    const cases=main.querySelectorAll('.case');
    items.forEach((it,i)=>{const c=cases[i];if(!c)return;const ph=c.querySelector('.cph');if(it.coverImageUrl){const u=it.coverImageUrl.startsWith('http')?it.coverImageUrl:API+it.coverImageUrl;const img=document.createElement('img');img.src=u;img.style.cssText='height:140px;width:100%;object-fit:cover';ph.replaceWith(img);c.querySelector('.b b').textContent=it.title||'';slotify(img,p.key,'кейс '+(i+1),u);}});
  }catch{}
}
document.getElementById('rvCopy').onclick=async()=>{const t=JSON.stringify(load(),null,1);try{await navigator.clipboard.writeText(t);alert('Скопировано: вставьте в чат.');}catch{prompt('Скопируйте вручную:',t);}};
document.getElementById('rvDl').onclick=()=>{const b=new Blob([JSON.stringify(load(),null,1)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='photo-review.json';a.click();};
document.getElementById('rvClr').onclick=()=>{if(confirm('Стереть все отметки?')){localStorage.removeItem(KEY);updCount();show(location.hash.slice(1));}};
updCount(); enhance(byKey[(location.hash||'#access').slice(1)]||P[0]);
</script>`;
html = html.replace(/<\/script>\s*$/, "</script>" + REVIEW_JS);
if (!html.includes("const KEY='sat-photo-review'")) throw new Error("review js not appended");
html = "<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" + html.replace("<title>", "<title>").replace("</style>", "</style></head><body>") + "</body></html>";
fs.mkdirSync("/home/user/satsolutions/docs/mockups", { recursive: true });
fs.writeFileSync(OUT, html);
console.log("written", OUT, html.length);
