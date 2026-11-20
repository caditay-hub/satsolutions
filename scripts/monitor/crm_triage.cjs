// Разбор ошибок CRM для плановой проверки Claude (каждые 2 часа днём, вместе с Sentry сайта; 20.11.2026).
// Читает состояние контроля /root/crm_watch/state.json (его ведёт watch.cjs каждые 15 минут) и показывает
// ошибки, которые появились или выросли с прошлого разбора, с последними примерами (стек, адрес, контекст журнала).
//
// Запуск на сервере:
//   node /root/crm_watch/triage.cjs          — что нового с прошлого разбора (состояние не меняется)
//   node /root/crm_watch/triage.cjs --all    — все известные ошибки за 30 дней
//   node /root/crm_watch/triage.cjs --mark   — запомнить текущее как разобранное
// Состояние разбора: /root/crm_watch/triage_state.json. Код CRM на сервере: /var/www/sat (репозиторий caditay-hub/sat-crm).
const fs = require('fs');
const DIR = '/root/crm_watch';
const WATCH = `${DIR}/state.json`;
const STATE = `${DIR}/triage_state.json`;
const ALL = process.argv.includes('--all'), MARK = process.argv.includes('--mark');
const KIND_RU = { api: 'сервер CRM', web: 'браузер / мини-приложение', bot: 'бот', sync: 'обмен', nginx: 'nginx 5xx' };
const tk = (iso) => { const d = new Date(new Date(iso).getTime() + 5 * 3600e3); const p = (n) => String(n).padStart(2, '0'); return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`; };

if (!fs.existsSync(WATCH)) { console.log('контроль CRM ещё не запускался: нет', WATCH); process.exit(0); }
const watch = JSON.parse(fs.readFileSync(WATCH, 'utf8'));
const st = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { counts: {}, lastRun: null };
let prod = '-'; try { prod = require('child_process').execFileSync('git', ['-C', '/var/www/sat', 'log', '-1', '--format=%h %ci %s'], { encoding: 'utf8' }).trim().slice(0, 120); } catch {}

const items = [];
for (const [sig, s] of Object.entries(watch.sigs || {})) {
  const was = st.counts[sig];
  let change = 'без изменений';
  if (was === undefined) change = 'НОВАЯ';
  else if (s.count > was) change = s.count >= was * 2 && s.count - was >= 10 ? `ВЫРОСЛА: было ${was}, стало ${s.count}` : `+${s.count - was} с прошлого разбора`;
  if (ALL || change !== 'без изменений') items.push({ sig, s, change });
}
items.sort((a, b) => (a.s.last < b.s.last ? 1 : -1));
const pm2Bad = Object.entries(watch.pm2 || {}).filter(([, v]) => v.status !== 'online').map(([k, v]) => `${k}: ${v.status}`);
const stale = Object.entries(watch.runs || {}).filter(([k, v]) => k.startsWith('stale:') && v).map(([k]) => k.slice(6));
const failing = Object.entries(watch.runs || {}).filter(([k, v]) => k.startsWith('fail:') && v >= 3).map(([k, v]) => `${k.slice(5)} (${v} проверок подряд)`);

console.log(`Разбор ошибок CRM ${tk(new Date().toISOString())} (Ташкент). Прошлый разбор: ${st.lastRun ? tk(st.lastRun) : 'ещё не было'}. Прод CRM: ${prod}.`);
console.log(`${ALL ? 'Показаны все.' : `Новых или изменившихся: ${items.length}.`} Процессы не online: ${pm2Bad.join(', ') || 'нет'}. Застывшие обмены: ${stale.join(', ') || 'нет'}. Обмены, падающие подряд: ${failing.join(', ') || 'нет'}. sats.uz: ${watch.runs && watch.runs.down ? `не открывается (${watch.runs.down} проверок)` : 'открывается'}.`);
for (const { s, change } of items) {
  const tags = [s.external ? 'внешняя причина' : '', s.skew ? 'рассинхрон сборок' : '', s.app || ''].filter(Boolean).join(', ');
  console.log(`\n=== ${KIND_RU[s.kind] || s.kind} | ${change}${tags ? ` | ${tags}` : ''}\n${s.title}\nГде: ${s.where || '-'}${s.file ? ` | журнал logs/${s.file}` : ''}${s.bot ? ` | pm2 ${s.bot}` : ''} | всего ${s.count} | первый ${tk(s.first)}, последний ${tk(s.last)}`);
  for (const x of s.samples || []) console.log(`  -- ${tk(x.at)}\n${x.text.split('\n').map((l) => '     ' + l).join('\n')}`);
}
if (MARK) { st.counts = Object.fromEntries(Object.entries(watch.sigs || {}).map(([k, s]) => [k, s.count])); st.lastRun = new Date().toISOString(); fs.writeFileSync(STATE, JSON.stringify(st, null, 1)); console.log('\nСостояние разбора сохранено.'); }
else console.log('\n(состояние не менялось; --mark, чтобы запомнить как разобранное)');
