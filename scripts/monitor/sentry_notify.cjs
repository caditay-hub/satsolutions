// Сообщение в Telegram ботом мониторинга (тот же бот, что у sentry_watch.cjs). Текст — из аргумента или stdin, HTML.
// Запуск на сервере: node /root/sentry_watch/notify.cjs "<b>текст</b>"   или   echo "текст" | node /root/sentry_watch/notify.cjs
const fs = require('fs');
const rd = (p) => fs.readFileSync(p, 'utf8').trim();
(async () => {
  const text = (process.argv[2] || fs.readFileSync(0, 'utf8')).trim();
  if (!text) { console.error('пустой текст'); process.exit(2); }
  const token = rd('/root/.telegram_monitor_bot'), chat = rd('/root/.telegram_monitor_chat');
  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: chat, text: text.slice(0, 4000), parse_mode: 'HTML', disable_web_page_preview: true }) });
  const j = await r.json(); if (!j.ok) { console.error('Telegram:', JSON.stringify(j).slice(0, 200)); process.exit(1); }
  console.log('отправлено');
})().catch((e) => { console.error('сбой:', e.message); process.exit(1); });
