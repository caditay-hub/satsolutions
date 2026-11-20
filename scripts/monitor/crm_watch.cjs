// Контроль ошибок CRM sats.uz → Telegram, бот мониторинга (20.11.2026, «сделай так же для ошибок CRM»).
// Только чтение журналов на сервере. Пишет в Telegram ТОЛЬКО о новой ошибке, резком учащении или
// устойчивом сбое; если нового нет — молчит (правило владельца: бот пишет только при проблеме).
//
// Источники:
//   1. сервер CRM: /var/www/sat/backend/logs/error.log (winston, JSON, уровень error — ответы 500);
//   2. браузер сотрудников и мини-приложение: logs/client-errors.log (появится после выкладки приёма ошибок);
//   3. боты: журналы PM2 sat-crm-bot, sat-expense-bot, sat-attendance-bot, sat-didox-bot + статус и перезапуски;
//   4. обмены (1С, Didox, биржи и др.): журналы logs/*.log — run_failed, Traceback, ошибки Node; «застывшие» обмены;
//   5. nginx: ответы 5xx на /api/ (журнал общий с сайтом — адрес показывается как есть);
//   6. доступность: главная https://sats.uz/.
//
// Запуск на сервере:
//   node /root/crm_watch/watch.cjs            — сухой прогон: что было бы отправлено; состояние не меняется
//   node /root/crm_watch/watch.cjs --init     — запомнить текущее как известное, ничего не отправляя
//   node /root/crm_watch/watch.cjs --apply    — отправить новое в Telegram и сохранить состояние (так запускает cron)
// Состояние: /root/crm_watch/state.json (подписи ошибок, счётчики, по 3 последних примера — их читает triage.cjs).
const fs = require('fs');
const { execFileSync } = require('child_process');

const DIR = process.env.CRM_WATCH_DIR || '/root/crm_watch'; // другая папка — только для проверки скрипта
const STATE = `${DIR}/state.json`;
const LOGS = '/var/www/sat/backend/logs';
const PM2LOGS = '/root/.pm2/logs';
const APPLY = process.argv.includes('--apply');
const INIT = process.argv.includes('--init');
const MAX_READ = 5 * 1024 * 1024; // за один запуск читаем из файла не больше 5 МБ нового
const log = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);
const rd = (p) => fs.readFileSync(p, 'utf8').trim();

// Порог «участилась»: событий стало вдвое больше, чем при прошлом сообщении, и прибавилось не меньше 10.
const ESC_FACTOR = 2, ESC_MIN = 10;
// Боты: «fetch failed» бывает ~190 раз в сутки у каждого (≈2 за 15 минут) — это обрывы связи сервера с Telegram.
// Сообщаем, только если за запуск их ≥ BOT_NET_MIN и так NET_RUNS запусков подряд (≈45 минут).
const BOT_NET_MIN = 10, NET_RUNS = 3;
// Обмены: внешние сбои (сеть, Didox 5xx, 1С 403 ночью) сообщаем, только если источник падает FAIL_RUNS запусков подряд.
const FAIL_RUNS = 3;
// Ошибки рассинхрона сборок в браузере (после выкладки CRM у открытых вкладок): только от SKEW_MIN событий.
const SKEW_MIN = 15;
const SKEW = /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk/i;

const BOTS = [
  { pm2: 'sat-crm-bot', ru: 'бот CRM' },
  { pm2: 'sat-expense-bot', ru: 'бот «SAT Расходы»' },
  { pm2: 'sat-attendance-bot', ru: 'бот «Приход / Уход»' },
  { pm2: 'sat-didox-bot', ru: 'бот «Документы»' },
];
const PM2_ALSO = ['sat-crm-api'];
// Строки журналов ботов, которые не ошибки нашего кода.
const BOT_NET = /fetch failed|Telegram не ответил|ETIMEDOUT|ECONNRESET|EAI_AGAIN|ENETUNREACH|socket hang up|UND_ERR/i;
const BOT_NOISE = /Too Many Requests|message is not modified|message can't be deleted|message to delete not found|query is too old|^\s+at /i;

// Журналы обменов: имя файла → как назвать; stale — сколько минут без записей считать «застыл» (только частые обмены).
const SYNCS = [
  { f: 'didox-sync.log', ru: 'обмен с Didox', stale: 60 },
  { f: 'didox-payments.log', ru: 'оплаты Didox', stale: 30 },
  { f: 'reconcile-didox.log', ru: 'сверка Didox и 1С' },
  { f: 'onec-sync.log', ru: 'обмен с 1С' },
  { f: 'onec-profit.log', ru: 'прибыль из 1С' },
  { f: 'onec-cycle.log', ru: 'цикл 1С' },
  { f: 'contract-stock.log', ru: 'сверка со складом', stale: 60 },
  { f: 'contract-posts.log', ru: 'сообщения по договорам' },
  { f: 'doc-expectations.log', ru: 'ожидание документов' },
  { f: 'receipt-agent.log', ru: 'помощник по приходу' },
  { f: 'nom-match.log', ru: 'сопоставление номенклатуры' },
  { f: 'nom-import-1c.log', ru: 'номенклатура из 1С' },
  { f: 'deal-items.log', ru: 'позиции договоров с бирж' },
  { f: 'deal-stages.err', ru: 'сделки по договорам' },
  { f: 'exchange-robot.log', ru: 'робот бирж' },
  { f: 'sync-feedback.log', ru: 'заявки с сайта', stale: 40 },
  { f: 'cbu-rate.log', ru: 'курс ЦБ' },
  { f: 'didox-alerts.log', ru: 'уведомления Didox' },
];
// Внешние, преходящие причины сбоя обмена.
const EXTERNAL = /URLError|timed out|Timeout|name resolution|No route to host|Connection (refused|reset|aborted)|ECONN|EAI_AGAIN|fetch failed|cURL error|HTTP 5\d\d|HTTP 403|HTTP 429|Bad Gateway|Service Unavailable|NetworkError|socket hang up/i;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const scrub = (s) => String(s ?? '').replace(/\+?998[\d\s\-()]{8,}|\b\d{9,}\b/g, '[номер]').replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, '[почта]').replace(/(Bearer|token|password|passwd|secret)["'=:\s]+[^\s"',}]+/gi, '$1 [скрыто]');
const norm = (s) => scrub(s).replace(/\?.*$/, '').replace(/[0-9a-f]{8}-[0-9a-f-]{27,}/gi, ':id').replace(/\b[0-9A-F]{24,}\b/g, ':id').replace(/\d+/g, 'N').replace(/\s+/g, ' ').trim().slice(0, 200);
const tashkent = (d) => { const t = new Date(new Date(d).getTime() + 5 * 3600e3); const p = (n) => String(n).padStart(2, '0'); return `${p(t.getUTCDate())}.${p(t.getUTCMonth() + 1)} ${p(t.getUTCHours())}:${p(t.getUTCMinutes())}`; };

async function telegram(html) {
  const token = rd('/root/.telegram_monitor_bot'), chat = rd('/root/.telegram_monitor_chat');
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text: html.slice(0, 4000), parse_mode: 'HTML', disable_web_page_preview: true }) });
  const j = await r.json(); if (!j.ok) throw new Error('Telegram: ' + JSON.stringify(j).slice(0, 200));
}

// Новое содержимое файла с прошлого запуска. Файл стал короче (ротация в полночь) — читаем с начала.
function readNew(state, key, file) {
  let st; try { st = fs.statSync(file); } catch { return null; }
  const prev = state.offsets[key];
  let from = prev && prev.size <= st.size && prev.ino === st.ino ? prev.size : (prev ? 0 : st.size);
  if (st.size - from > MAX_READ) from = st.size - MAX_READ;
  let text = '';
  if (st.size > from) { const fd = fs.openSync(file, 'r'); const buf = Buffer.alloc(st.size - from); fs.readSync(fd, buf, 0, buf.length, from); fs.closeSync(fd); text = buf.toString('utf8'); }
  state.offsets[key] = { size: st.size, ino: st.ino };
  return { text, mtime: st.mtimeMs, first: !prev };
}

// Учёт подписи ошибки. Возвращает 'new' | 'escalated' | null. По одной подписи — не больше одного сообщения за запуск.
const sentThisRun = new Set();
function bump(state, sig, meta, n, sample) {
  const now = new Date().toISOString();
  let s = state.sigs[sig];
  if (!s) { s = state.sigs[sig] = { ...meta, count: 0, notified: 0, first: now, last: now, samples: [] }; }
  s.count += n; s.last = now;
  if (sample) { s.samples.unshift({ at: now, text: scrub(sample).slice(0, 1500) }); s.samples = s.samples.slice(0, 3); }
  if (sentThisRun.has(sig)) { if (s.notified) s.notified = s.count; return null; }
  if (!s.notified && !s.quiet) { s.notified = s.count; sentThisRun.add(sig); return 'new'; }
  if (s.notified && s.count >= s.notified * ESC_FACTOR && s.count - s.notified >= ESC_MIN) { s.notified = s.count; sentThisRun.add(sig); return 'escalated'; }
  return null;
}
// Одна и та же ошибка обмена приходит строкой run_failed и строкой исключения после Traceback:
// «didox/documents run_failed: InvalidDatetimeFormat: …» и «psycopg2.errors.InvalidDatetimeFormat: …» — одна подпись.
const failKey = (msg) => norm(String(msg).replace(/^.*?run_failed:\s*/, '').replace(/^(?:[a-z_][\w]*\.)+(?=[A-Z]\w*)/, ''));

function card(head, lines) { return [`<b>${esc(head)}</b>`, ...lines.filter(Boolean).map((l) => esc(l))].join('\n'); }

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { offsets: {}, sigs: {}, runs: {}, pm2: {}, first: true };
  state.runs ||= {}; state.pm2 ||= {}; state.sigs ||= {}; state.offsets ||= {};
  const out = []; const stat = { api: 0, web: 0, bots: 0, syncs: 0, nginx: 0, noise: 0 };
  const quietStart = state.first || INIT;

  // 1. Сервер CRM: error.log
  const api = readNew(state, 'api', `${LOGS}/error.log`);
  if (api && api.text) {
    for (const line of api.text.split('\n').filter(Boolean)) {
      let j; try { j = JSON.parse(line); } catch { continue; }
      if (j.level !== 'error') continue;
      stat.api++;
      const where = `${j.method || ''} ${norm(String(j.url || ''))}`.trim();
      const sig = `api|${norm(j.message)}|${where}`;
      const r = bump(state, sig, { kind: 'api', title: scrub(j.message).slice(0, 200), where, quiet: quietStart || undefined }, 1, `${j.timestamp} ${j.method} ${scrub(String(j.url || '').replace(/\?.*/, ''))}\n${j.message}\n${String(j.stack || '').split('\n').slice(0, 12).join('\n')}`);
      if (r) out.push(card(r === 'new' ? '🔴 CRM: новая ошибка сервера' : '🟠 CRM: ошибка сервера участилась', [scrub(j.message).slice(0, 220), `Где: ${where}`, `Раз: ${state.sigs[sig].count}, последний ${tashkent(Date.now())}`]));
    }
  }

  // 2. Браузер сотрудников и мини-приложение: client-errors.log (JSON по строке)
  const web = readNew(state, 'web', `${LOGS}/client-errors.log`);
  if (web && web.text) {
    for (const line of web.text.split('\n').filter(Boolean)) {
      let j; try { j = JSON.parse(line); } catch { continue; }
      stat.web++;
      const page = norm(String(j.page || j.url || '').replace(/^https?:\/\/[^/]+/, ''));
      const isSkew = SKEW.test(j.message || '');
      const sig = `web|${norm(j.message)}|${isSkew ? '*' : page}`;
      const r = bump(state, sig, { kind: 'web', title: scrub(j.message).slice(0, 200), where: page, app: j.app, skew: isSkew || undefined, quiet: (quietStart || isSkew) || undefined }, 1, `${j.at || ''} ${j.app || ''} ${page} user=${j.userId ?? '-'} ${scrub(j.ua || '').slice(0, 120)}\n${j.message}\n${String(j.stack || '').split('\n').slice(0, 12).join('\n')}`);
      const s = state.sigs[sig];
      if (isSkew && !s.notified && s.count >= SKEW_MIN) { s.notified = s.count; out.push(card('🔴 CRM: после выкладки вкладки не подгружают код', [scrub(j.message).slice(0, 200), `Раз: ${s.count}`])); continue; }
      if (r && !isSkew) out.push(card(r === 'new' ? `🔴 CRM: новая ошибка в ${j.app === 'miniapp' ? 'мини-приложении' : 'браузере'}` : '🟠 CRM: ошибка в браузере участилась', [scrub(j.message).slice(0, 220), `Страница: ${page || '-'}`, `Раз: ${s.count}`]));
    }
  }

  // 3. Боты: журналы ошибок PM2, статус и перезапуски
  let pm2list = [];
  try { pm2list = JSON.parse(execFileSync('pm2', ['jlist'], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 })); } catch (e) { log('pm2 jlist не прочитан:', e.message); }
  for (const name of [...BOTS.map((b) => b.pm2), ...PM2_ALSO]) {
    const p = pm2list.find((x) => x.name === name); if (!p) continue;
    const ru = (BOTS.find((b) => b.pm2 === name) || { ru: 'сервер CRM' }).ru;
    const status = p.pm2_env.status, restarts = p.pm2_env.restart_time, prev = state.pm2[name];
    if (status !== 'online') { if (!prev || prev.status === 'online') out.push(card(`⛔ CRM: ${ru} не работает`, [`Процесс ${name}: ${status}`])); }
    else if (prev && prev.status !== 'online') out.push(card(`✅ CRM: ${ru} снова работает`, [`Процесс ${name}: online`]));
    // Перезапуск после выкладки — нормален; сообщаем о частых: ≥3 за 15 минут.
    if (prev && restarts - prev.restarts >= 3) out.push(card(`🟠 CRM: ${ru} перезапускается`, [`Перезапусков за 15 минут: ${restarts - prev.restarts}`]));
    state.pm2[name] = { status, restarts };
  }
  for (const b of BOTS) {
    const r = readNew(state, `bot:${b.pm2}`, `${PM2LOGS}/${b.pm2}-error.log`);
    if (!r || !r.text) { state.runs[`net:${b.pm2}`] = 0; continue; }
    let net = 0; const lines = r.text.split('\n').filter(Boolean);
    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i].replace(/^\d{4}-\d\d-\d\dT[\d:.]+Z?:\s*/, '');
      if (BOT_NET.test(raw)) { net++; continue; }
      if (BOT_NOISE.test(raw)) { stat.noise++; continue; }
      stat.bots++;
      const sig = `bot|${b.pm2}|${norm(raw)}`;
      const stack = lines.slice(i, i + 10).join('\n');
      const res = bump(state, sig, { kind: 'bot', bot: b.pm2, title: scrub(raw).slice(0, 200), where: b.ru, quiet: quietStart || undefined }, 1, stack);
      if (res) out.push(card(res === 'new' ? `🔴 CRM: новая ошибка — ${b.ru}` : `🟠 CRM: ошибка участилась — ${b.ru}`, [scrub(raw).slice(0, 220), `Раз: ${state.sigs[sig].count}`]));
    }
    stat.noise += net;
    const k = `net:${b.pm2}`;
    state.runs[k] = net >= BOT_NET_MIN ? (state.runs[k] || 0) + 1 : 0;
    if (state.runs[k] === NET_RUNS) out.push(card(`🟠 CRM: ${b.ru} не достучится до Telegram`, [`Обрывы связи с Telegram уже ~${NET_RUNS * 15} минут подряд (${net} за последние 15 минут).`, 'Обычно это сеть сервера; бот сам переподключится.']));
  }

  // 4. Обмены: run_failed, Traceback, ошибки Node; «застывшие»
  for (const s of SYNCS) {
    const r = readNew(state, `sync:${s.f}`, `${LOGS}/${s.f}`);
    if (!r) continue;
    const k = `fail:${s.f}`;
    if (s.stale && Date.now() - r.mtime > s.stale * 60e3) {
      if (!state.runs[`stale:${s.f}`]) { state.runs[`stale:${s.f}`] = 1; if (!quietStart) out.push(card(`🟠 CRM: ${s.ru} не запускается`, [`В журнале ${s.f} нет записей ${Math.round((Date.now() - r.mtime) / 60e3)} минут (обычно чаще, чем раз в ${s.stale} минут).`])); }
    } else if (state.runs[`stale:${s.f}`]) { state.runs[`stale:${s.f}`] = 0; out.push(card(`✅ CRM: ${s.ru} снова работает`, [`Журнал ${s.f} обновился.`])); }
    if (!r.text) continue;
    const fails = [];
    const lines = r.text.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (/run_failed/.test(l)) fails.push({ msg: l.replace(/^\[[\d:]+\]\s*/, '').replace(/^ERROR\s+/, ''), ctx: lines.slice(Math.max(0, i - 3), i + 2).join('\n') });
      else if (/^Traceback \(most recent call last\)/.test(l)) {
        let j = i + 1; while (j < lines.length && (/^\s/.test(lines[j]) || /^(During handling|The above exception)/.test(lines[j]) || lines[j] === '' || /^Traceback/.test(lines[j]))) j++;
        fails.push({ msg: lines[j] || 'Traceback', ctx: lines.slice(i, Math.min(j + 1, i + 40)).join('\n'), tb: true });
        i = j;
      } else if (/^(\w*Error|SequelizeDatabaseError|UnhandledPromiseRejection)\b[:\s]/.test(l) && !/^\w*Error: 0\b/.test(l)) fails.push({ msg: l, ctx: lines.slice(i, i + 8).join('\n') });
    }
    if (!fails.length) { state.runs[k] = 0; continue; }
    // Склейка: строка run_failed и Traceback одной ошибки — одна запись; раз = больше из двух счётчиков; контекст — от Traceback.
    const groups = new Map();
    for (const f of fails) {
      const key = failKey(f.msg); const g = groups.get(key) || { msg: f.msg, ctx: f.ctx, tb: 0, other: 0 };
      if (f.tb) { g.tb++; g.ctx = f.ctx; } else { g.other++; if (/run_failed/.test(f.msg)) g.msg = f.msg; }
      groups.set(key, g);
    }
    stat.syncs += groups.size;
    state.runs[k] = (state.runs[k] || 0) + 1;
    for (const [key, f] of groups) {
      const external = EXTERNAL.test(f.msg + '\n' + f.ctx.slice(-400));
      const sig = `sync|${s.f}|${key}`;
      const res = bump(state, sig, { kind: 'sync', file: s.f, title: scrub(f.msg).slice(0, 220), where: s.ru, external: external || undefined, quiet: (quietStart || external) || undefined }, Math.max(f.tb, f.other), f.ctx);
      if (res && !external) out.push(card(res === 'new' ? `🔴 CRM: новая ошибка — ${s.ru}` : `🟠 CRM: ошибка участилась — ${s.ru}`, [scrub(f.msg).slice(0, 220), `Журнал: ${s.f}`, `Раз: ${state.sigs[sig].count}`]));
    }
    if (state.runs[k] === FAIL_RUNS && fails.every((f) => EXTERNAL.test(f.msg))) out.push(card(`🟠 CRM: ${s.ru} падает ${FAIL_RUNS} проверки подряд`, [scrub(fails[fails.length - 1].msg).slice(0, 220), 'Причина внешняя (сеть, Didox или 1С); если не пройдёт — проверить доступ.']));
  }

  // 5. nginx: 5xx на /api/ (журнал общий с сайтом)
  const ng = readNew(state, 'nginx', '/var/log/nginx/access.log');
  if (ng && ng.text) {
    const by = {};
    for (const l of ng.text.split('\n')) {
      const m = l.match(/"(GET|POST|PUT|PATCH|DELETE) (\S+) HTTP\/[\d.]+" (5\d\d) /); if (!m) continue;
      if (!/^\/api\//.test(m[2]) || /^\/socket\.io/.test(m[2])) continue;
      const k = `${m[3]} ${m[1]} ${norm(m[2])}`; (by[k] ||= []).push(l.slice(0, 300));
    }
    for (const [k, arr] of Object.entries(by)) {
      stat.nginx += arr.length;
      const sig = `nginx|${k}`;
      const res = bump(state, sig, { kind: 'nginx', title: k, where: 'nginx', quiet: (quietStart || arr.length < 3) || undefined }, arr.length, scrub(arr.slice(-3).join('\n')));
      if (res) out.push(card('🔴 CRM: сервер отвечает ошибкой', [k, `Раз за 15 минут: ${arr.length}`]));
      else if (state.sigs[sig].quiet && !state.sigs[sig].notified && arr.length >= 3 && !quietStart) { state.sigs[sig].notified = state.sigs[sig].count; out.push(card('🔴 CRM: сервер отвечает ошибкой', [k, `Раз за 15 минут: ${arr.length}`])); }
    }
  }

  // 6. Доступность: главная sats.uz, два провала подряд
  let up = false; try { const r = await fetch('https://sats.uz/', { signal: AbortSignal.timeout(15000) }); up = r.ok; } catch {}
  state.runs.down = up ? 0 : (state.runs.down || 0) + 1;
  if (state.runs.down === 2) out.push(card('⛔ CRM sats.uz не открывается', ['Главная не ответила две проверки подряд (30 минут).']));
  if (up && state.runs.wasDown) out.push(card('✅ CRM sats.uz снова открывается', []));
  state.runs.wasDown = state.runs.down >= 2 ? 1 : (up ? 0 : state.runs.wasDown);

  // Тихий первый запуск: всё текущее — известное, без сообщений.
  if (quietStart) { for (const s of Object.values(state.sigs)) if (!s.notified) s.notified = s.count; out.length = 0; }
  else for (const s of Object.values(state.sigs)) if (s.quiet && !s.external && !s.skew && s.kind !== 'nginx') delete s.quiet;
  state.first = false;
  // Старые подписи (не встречались 30 дней) — забываем.
  for (const [k, s] of Object.entries(state.sigs)) if (Date.now() - new Date(s.last).getTime() > 30 * 864e5) delete state.sigs[k];

  log(`сервер: ${stat.api}, браузер: ${stat.web}, боты: ${stat.bots}, обмены: ${stat.syncs}, nginx 5xx: ${stat.nginx}, шум: ${stat.noise}; к отправке: ${out.length}${quietStart ? ' (первый запуск: текущее запомнено, сообщений нет)' : ''}`);
  for (const m of out) { if (APPLY) { try { await telegram(m); } catch (e) { log(e.message); } } else console.log('--- было бы отправлено ---\n' + m.replace(/<[^>]+>/g, '')); }
  if (APPLY || INIT) fs.writeFileSync(STATE, JSON.stringify(state, null, 1)); else log('сухой прогон: состояние не сохранено, в Telegram ничего не ушло');
})().catch((e) => { log('сбой:', e.message); process.exit(1); });
