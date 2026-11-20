// Разбор ошибок Sentry для плановой проверки Claude (каждые 2 часа днём, решение владельца 20.11.2026).
// Только чтение Sentry. Показывает проблемы, которые появились или выросли с прошлого разбора,
// с подробностями последних событий: браузер, адрес, стек с датами сборки файлов, действия перед ошибкой.
//
// Запуск на сервере:
//   node /root/sentry_watch/triage.cjs            — что нового с прошлого разбора (состояние не меняется)
//   node /root/sentry_watch/triage.cjs --all      — все нерешённые проблемы за 14 дней
//   node /root/sentry_watch/triage.cjs --mark     — запомнить текущее состояние как разобранное
//   node /root/sentry_watch/triage.cjs --json     — то же в JSON
// Состояние: /root/sentry_watch/triage_state.json. Токен: /root/.sentry_token (только чтение, значение не печатается).
const fs = require('fs');
const path = require('path');
const ORG = 'sat-solutions';
const API = 'https://de.sentry.io/api/0';
const DIR = '/root/sentry_watch';
const STATE = `${DIR}/triage_state.json`;
const TOKEN_FILE = '/root/.sentry_token';
const CHUNKS = '/var/www/satweb/apps/web/.next/static/chunks';
const BUILD_ID_FILE = '/var/www/satweb/apps/web/.next/BUILD_ID';
const ARG = new Set(process.argv.slice(2));
const ALL = ARG.has('--all'), MARK = ARG.has('--mark'), JSON_OUT = ARG.has('--json');
const EVENTS_PER_ISSUE = 4;
const GROW_FACTOR = 2, GROW_MIN = 10;

const NOISE = [
  [/AbortError: signal is aborted/i, 'отменённый запрос'],
  [/document\.head is null|React expected a <head>/i, 'страницу разобрал сборщик данных'],
  [/SMOKE TEST/i, 'проверочное событие'],
  [/ResizeObserver loop/i, 'служебное сообщение браузера'],
];
const SKEW = /Cannot read properties of undefined \(reading 'call'\)|can't access property "call"|undefined is not an object \(evaluating '[^']*\.call'\)|ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk/i;

const rd = (p) => fs.readFileSync(p, 'utf8').trim();
const scrub = (s) => String(s ?? '').replace(/\+?998[\d\s\-()]{8,}|\b\d{9,}\b/g, '[номер]');
const tk = (iso) => { if (!iso) return '-'; const d = new Date(new Date(iso).getTime() + 5 * 3600e3); const p = (n) => String(n).padStart(2, '0'); return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`; };
// Дата сборки файла кода по его времени на сервере: так видно, файлы одной ли сборки в стеке.
const fileDate = (f) => { try { return 'сборка ' + tk(fs.statSync(path.join(CHUNKS, f)).mtime.toISOString()); } catch { return 'нет на сервере'; } };

async function sentry(p) {
  const r = await fetch(API + p, { headers: { Authorization: 'Bearer ' + rd(TOKEN_FILE) } });
  const text = await r.text();
  if (!r.ok) { const e = new Error(`Sentry ${r.status}: ${text.slice(0, 200)}`); e.status = r.status; throw e; }
  return JSON.parse(text);
}

function eventView(e) {
  const tags = Object.fromEntries((e.tags || []).map((t) => [t.key, t.value]));
  const ex = (e.entries || []).find((x) => x.type === 'exception');
  const values = ex ? ex.data.values : [];
  const frames = values.flatMap((v) => (v.stacktrace ? v.stacktrace.frames : [])).slice(-12).map((f) => {
    const file = String(f.filename || '').replace(/^app:\/\/\/_next\/static\/chunks\//, '');
    const dated = /\.js$/.test(file) && !/^https?:/.test(file) ? `${file} [${fileDate(file)}]` : file;
    return `${f.function || '?'} | ${dated}${f.lineno ? ` ${f.lineno}:${f.colno}` : ''}${f.inApp ? ' | наш код' : ''}`;
  });
  const bc = (e.entries || []).find((x) => x.type === 'breadcrumbs');
  const crumbs = bc ? bc.data.values.slice(-6).map((b) => `${b.category || b.type}:${scrub(String(b.message || (b.data && (b.data.url || b.data.to)) || '')).replace('https://satsolutions.uz', '').replace(/\?.*/, '').slice(0, 60)}`) : [];
  const req = (e.entries || []).find((x) => x.type === 'request');
  const ua = req ? (req.data.headers || []).filter((h) => /user-agent/i.test(h[0])).map((h) => h[1]).join('').slice(0, 120) : '';
  return {
    time: tk(e.dateCreated), browser: tags.browser, os: tags.os, device: tags['device.family'] || '-', locale: (e.contexts && e.contexts.culture && e.contexts.culture.locale) || '-',
    url: scrub(String(tags.url || '')).replace('https://satsolutions.uz', ''), mechanism: String(tags.mechanism || '').replace('auto.browser.global_handlers.', ''), handled: tags.handled, boundary: tags.boundary || '-',
    transaction: tags.transaction || e.transaction || '-', ua,
    exception: values.map((v) => `${v.type}: ${scrub(v.value).slice(0, 200)}`), frames, crumbs,
  };
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { issues: {}, lastRun: null };
  const issues = await sentry(`/organizations/${ORG}/issues/?project=-1&query=${encodeURIComponent('is:unresolved')}&statsPeriod=14d&limit=100&sort=date`);
  let buildId = '-'; try { buildId = rd(BUILD_ID_FILE); } catch {}
  const out = { now: tk(new Date().toISOString()), lastRun: state.lastRun ? tk(state.lastRun) : 'ещё не было', buildId, unresolved: issues.length, items: [] };
  for (const i of issues) {
    const cnt = Number(i.count || 0); const known = state.issues[i.id];
    let change = 'без изменений';
    if (!known) change = 'НОВАЯ';
    else if (cnt >= known.count * GROW_FACTOR && cnt - known.count >= GROW_MIN) change = `ВЫРОСЛА: было ${known.count}, стало ${cnt}`;
    else if (cnt > known.count) change = `+${cnt - known.count} событий с прошлого разбора`;
    const noise = NOISE.find(([re]) => re.test(i.title || ''));
    const cls = noise ? `шум (${noise[1]})` : SKEW.test(i.title || '') ? 'рассинхрон сборок' : 'разобрать';
    const item = { shortId: i.shortId, project: i.project?.slug, change, cls, title: scrub(i.title).slice(0, 200), culprit: scrub(i.culprit || '').slice(0, 160), count: cnt, users: i.userCount ?? 0, firstSeen: tk(i.firstSeen), lastSeen: tk(i.lastSeen), permalink: i.permalink, events: [] };
    const needDetails = ALL || change !== 'без изменений';
    if (needDetails && !noise) {
      try { const ev = await sentry(`/organizations/${ORG}/issues/${i.id}/events/?limit=${EVENTS_PER_ISSUE}&full=true`); item.events = ev.map(eventView); } catch (e) { item.events = [{ error: e.message }]; }
    }
    if (needDetails) out.items.push(item);
    if (MARK) state.issues[i.id] = { shortId: i.shortId, count: cnt, lastSeen: i.lastSeen };
  }
  if (MARK) { state.lastRun = new Date().toISOString(); fs.writeFileSync(STATE, JSON.stringify(state, null, 1)); }
  if (JSON_OUT) { console.log(JSON.stringify(out, null, 1)); return; }
  console.log(`Разбор Sentry ${out.now} (Ташкент). Прошлый разбор: ${out.lastRun}. Текущая сборка сайта: ${buildId}. Нерешённых проблем за 14 дней: ${out.unresolved}. ${ALL ? 'Показаны все.' : `Новых или изменившихся: ${out.items.length}.`}`);
  for (const it of out.items) {
    console.log(`\n=== ${it.shortId} | ${it.project} | ${it.change} | класс: ${it.cls}\n${it.title}\nГде: ${it.culprit || '-'} | событий ${it.count}, посетителей ${it.users} | первый ${it.firstSeen}, последний ${it.lastSeen}\n${it.permalink || ''}`);
    for (const e of it.events) {
      if (e.error) { console.log('  события не прочитаны:', e.error); continue; }
      console.log(`  -- ${e.time} | ${e.browser} | ${e.os} | ${e.device} | язык ${e.locale} | ${e.url} | механизм ${e.mechanism} | handled ${e.handled} | boundary ${e.boundary}`);
      for (const x of e.exception) console.log('     ' + x);
      for (const f of e.frames) console.log('       ' + f);
      if (e.crumbs.length) console.log('     действия: ' + e.crumbs.join(' → '));
    }
  }
  if (MARK) console.log('\nСостояние разбора сохранено.'); else console.log('\n(состояние не менялось; --mark, чтобы запомнить как разобранное)');
})().catch((e) => { console.error('сбой:', e.message); process.exit(1); });
