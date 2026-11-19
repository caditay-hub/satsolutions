// Контроль ошибок Sentry (сайт satsolutions.uz и API) → Telegram, бот мониторинга.
// Только чтение Sentry. Пишет в Telegram ТОЛЬКО когда появилась новая ошибка или известная резко участилась;
// если нового нет — молчит (правило владельца: бот пишет только при проблеме, без сводок).
//
// Запуск на сервере:
//   node /root/sentry_watch.cjs            — сухой прогон: показать, что было бы отправлено; состояние не меняется
//   node /root/sentry_watch.cjs --init     — запомнить текущие ошибки как известные, ничего не отправляя
//   node /root/sentry_watch.cjs --apply    — отправить новое в Telegram и сохранить состояние (так запускает cron)
//
// Токен Sentry (только чтение: org:read, project:read, event:read) — в файле /root/.sentry_token. Значение не печатается.
const fs = require('fs');
const ORG = 'sat-solutions';
const API = 'https://de.sentry.io/api/0'; // организация в регионе EU
const DIR = '/root/sentry_watch';
const STATE = `${DIR}/state.json`;
const TOKEN_FILE = '/root/.sentry_token';
const APPLY = process.argv.includes('--apply');
const INIT = process.argv.includes('--init');
const rd = (p) => fs.readFileSync(p, 'utf8').trim();
const log = (...a) => console.log(`[${new Date().toISOString()}]`, ...a);

// Шум: не наши ошибки. Запоминаем, но не сообщаем (разбор 19.11.2026).
const NOISE = [
  [/AbortError: signal is aborted/i, 'отменённый запрос'],
  [/document\.head is null|React expected a <head>/i, 'страницу разобрал сборщик данных'],
  [/SMOKE TEST/i, 'проверочное событие'],
  [/ResizeObserver loop/i, 'служебное сообщение браузера'],
];
// Порог «резко участилась»: событий стало вдвое больше, чем при прошлом сообщении, и прибавилось не меньше 10.
const ESC_FACTOR = 2, ESC_MIN = 10;
// Рассинхрон сборок в минуты выкладки: у посетителя в браузере осталась страница прежней сборки, и она
// подгружает части новой (или наоборот). 19.11.2026 одна выкладка дала четыре таких «новых ошибки» от одного
// посетителя; переходы по сайту при этом работали. О единичных событиях молчим, сообщаем, только если их
// набралось SKEW_MIN — тогда это уже не момент выкладки, а неисправная сборка.
// Одна и та же ошибка в разных браузерах: Chrome «reading 'call'», Firefox «can't access property "call"», Safari «evaluating '….call'».
const SKEW = /Cannot read properties of undefined \(reading 'call'\)|can't access property "call"|undefined is not an object \(evaluating '[^']*\.call'\)|ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk/i;
// Повторное сообщение о рассинхроне — только когда событий стало в SKEW_FACTOR раз больше прежнего.
const SKEW_FACTOR = 5;
const SKEW_MIN = 15;

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const scrub = (s) => String(s ?? '').replace(/\+?998[\d\s\-()]{8,}|\b\d{9,}\b/g, '[номер]');
const tashkent = (iso) => { const d = new Date(new Date(iso).getTime() + 5 * 3600 * 1000); const p = (n) => String(n).padStart(2, '0'); return `${p(d.getUTCDate())}.${p(d.getUTCMonth() + 1)} ${p(d.getUTCHours())}:${p(d.getUTCMinutes())}`; };
const PROJECT_RU = { 'satsolutions-web': 'сайт', 'satsolutions-api': 'API сайта' };

async function sentry(path) {
  const token = rd(TOKEN_FILE);
  const r = await fetch(API + path, { headers: { Authorization: 'Bearer ' + token } });
  const text = await r.text();
  if (!r.ok) { const e = new Error(`Sentry ${r.status}: ${text.slice(0, 200)}`); e.status = r.status; throw e; }
  return JSON.parse(text);
}

async function telegram(html) {
  const token = rd('/root/.telegram_monitor_bot'), chat = rd('/root/.telegram_monitor_chat');
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text: html, parse_mode: 'HTML', disable_web_page_preview: true }) });
  const j = await r.json(); if (!j.ok) throw new Error('Telegram: ' + JSON.stringify(j).slice(0, 200));
}

function card(i, kind) {
  const where = PROJECT_RU[i.project?.slug] || i.project?.slug || 'проект';
  const head = kind === 'new' ? `🔴 Новая ошибка — ${where}` : `🟠 Ошибка участилась — ${where}`;
  const lines = [
    `<b>${head}</b>`,
    `${esc(i.shortId)}: ${esc(scrub(i.title)).slice(0, 220)}`,
    i.culprit ? `Где: ${esc(scrub(i.culprit)).slice(0, 160)}` : null,
    `Событий: ${i.count}, посетителей: ${i.userCount ?? 0}`,
    `Первый раз: ${tashkent(i.firstSeen)}, последний: ${tashkent(i.lastSeen)}`,
    i.permalink ? `<a href="${esc(i.permalink)}">Открыть в Sentry</a>` : null,
  ];
  return lines.filter(Boolean).join('\n');
}

(async () => {
  fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(TOKEN_FILE)) { log('нет файла токена', TOKEN_FILE, '— контроль не работает'); return; }
  const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { issues: {}, apiFail: null, first: true };
  let issues;
  try {
    issues = await sentry(`/organizations/${ORG}/issues/?project=-1&query=${encodeURIComponent('is:unresolved')}&statsPeriod=14d&limit=100&sort=date`);
    state.apiFail = null;
  } catch (e) {
    log('ошибка чтения Sentry:', e.message);
    // О неработающем контроле — одно сообщение в сутки: молчащий монитор тоже проблема.
    const day = new Date().toISOString().slice(0, 10);
    if (APPLY && state.apiFail !== day) { state.apiFail = day; fs.writeFileSync(STATE, JSON.stringify(state, null, 1)); try { await telegram(`<b>⚠️ Контроль ошибок Sentry не работает</b>\nSentry не отвечает на запрос (код ${e.status || 'нет ответа'}). Если код 401 или 403 — токен в /root/.sentry_token отозван или истёк.`); } catch (t) { log(t.message); } }
    return;
  }
  const out = []; let noise = 0, skew = 0;
  for (const i of issues) {
    const cnt = Number(i.count || 0); const known = state.issues[i.id];
    const isNoise = NOISE.find(([re]) => re.test(i.title || ''));
    const isSkew = SKEW.test(i.title || '');
    if (!known) {
      state.issues[i.id] = { shortId: i.shortId, title: scrub(i.title).slice(0, 160), firstSeen: i.firstSeen, notifiedCount: cnt, noise: isNoise ? isNoise[1] : undefined, skew: isSkew || undefined };
      if (isNoise) { noise++; continue; }
      if (isSkew && cnt < SKEW_MIN) { state.issues[i.id].notifiedCount = 0; skew++; continue; }
      if (!state.first && !INIT) out.push(card(i, 'new'));
    } else if (known.skew && known.notifiedCount === 0) {
      // рассинхрон сборок, о котором ещё не сообщали: сообщаем один раз, когда событий стало много
      if (cnt >= SKEW_MIN) { known.notifiedCount = cnt; out.push(card(i, 'new')); } else skew++;
    } else if (known.skew) {
      if (cnt >= known.notifiedCount * SKEW_FACTOR) { known.notifiedCount = cnt; out.push(card(i, 'escalated')); } else skew++;
    } else if (!known.noise && cnt >= known.notifiedCount * ESC_FACTOR && cnt - known.notifiedCount >= ESC_MIN) {
      known.notifiedCount = cnt; out.push(card(i, 'escalated'));
    }
  }
  const firstRun = state.first; state.first = false;
  log(`ошибок в Sentry без решения: ${issues.length}; шум: ${noise}; рассинхрон сборок, молчим: ${skew}; к отправке: ${out.length}${firstRun || INIT ? ' (первый запуск: текущие ошибки запомнены, сообщений нет)' : ''}`);
  for (const m of out) { if (APPLY) { try { await telegram(m); } catch (e) { log(e.message); } } else console.log('--- было бы отправлено ---\n' + m.replace(/<[^>]+>/g, '')); }
  if (APPLY || INIT) fs.writeFileSync(STATE, JSON.stringify(state, null, 1)); else log('сухой прогон: состояние не сохранено, в Telegram ничего не ушло');
})().catch((e) => { log('сбой:', e.message); process.exit(1); });
