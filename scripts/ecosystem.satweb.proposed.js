// ПРЕДЛОЖЕНИЕ (НЕ ПРИМЕНЕНО). R6, аудит 09.09.2026.
// Мягкий перезапуск sat-web/sat-admin вместо нынешнего `pm2 restart` поверх npm-обёртки.
//
// ЧТО СЕЙЧАС (проверено на проде 09.09.2026, `pm2 jlist`):
//   sat-web   : exec_mode = fork_mode, script = /usr/bin/npm, args = start --prefix apps/web
//               wait_ready = null, kill_timeout = null, restart_time = 899
//   sat-admin : то же, restart_time = 531
//   Следствия из трека I:
//     · pm2 «видит» не Next, а обёртку npm (в мониторинге sat-web = 24 МБ — это npm,
//       сам next живёт дочерним процессом). Отсюда 1 661 записи «failed to kill - retrying»;
//     · reload в fork-режиме не перезапускает приложение, поэтому в deploy.sh стоит restart;
//     · окно недоступности ~3 с на рестарт: 129 ответов 502 за 07.09 — все внутри
//       21 минуты рестартов; 502 на /socket.io — те же окна;
//     · вкладки, открытые до деплоя, получают 404 на /_next/static (79/49/41 за дни
//       деплоев): старый процесс отдаёт HTML старого BUILD_ID, а файлов на диске уже нет.
//
// ЧТО ПРЕДЛАГАЕТСЯ:
//   · cluster_mode вместо fork — pm2 сам поднимает нового воркера, ждёт от него события
//     `listening` и только потом гасит старого. Это и есть zero-downtime `pm2 reload`;
//   · запуск НАПРЯМУЮ бинарём next, без обёртки npm — pm2 управляет тем самым процессом,
//     который слушает порт, и `failed to kill` уходит вместе с обёрткой;
//   · kill_timeout/listen_timeout заданы явно.
//
// ⚠ ПРО wait_ready: он требует, чтобы приложение само вызвало process.send('ready').
//   `next start` этого НЕ делает. Поэтому здесь wait_ready = false: в cluster_mode
//   pm2 и так дожидается `listening` от воркера — этого достаточно.
//   Включать wait_ready можно только вместе с кастомным server.js в apps/web,
//   который после app.prepare() вызывает process.send('ready') — это правка кода
//   приложения, она в объём R6 не входит.
//
// ⚠ ПРО ПАМЯТЬ: на сервере 3,9 ГБ ОЗУ, свободно ~1,9 ГБ, swap занят на 870 МБ, 2 vCPU.
//   Два воркера Next съедят примерно вдвое больше нынешнего одного. Если памяти в обрез —
//   ставьте instances: 1: в cluster_mode даже один экземпляр перезапускается мягко
//   (новый воркер поднимается до убийства старого), выигрыш по недоступности сохраняется,
//   теряется только параллелизм.

module.exports = {
  apps: [
    {
      name: "sat-web",
      script: "/var/www/satweb/node_modules/next/dist/bin/next",
      args: "start -p 3000",
      cwd: "/var/www/satweb/apps/web",
      exec_mode: "cluster",
      instances: 2,              // при нехватке ОЗУ — 1
      wait_ready: false,         // next start не шлёт process.send('ready') — см. выше
      listen_timeout: 15000,     // сколько ждать порт у нового воркера
      kill_timeout: 10000,       // дать доиграть текущим запросам перед SIGKILL
      max_memory_restart: "700M",
      autorestart: true,
      env: { NODE_ENV: "production", PORT: "3000" },
    },
    {
      name: "sat-admin",
      script: "/var/www/satweb/node_modules/next/dist/bin/next",
      args: "start -p 3001",
      cwd: "/var/www/satweb/apps/admin",
      exec_mode: "cluster",
      instances: 1,              // админку греть двумя воркерами незачем
      wait_ready: false,
      listen_timeout: 15000,
      kill_timeout: 10000,
      max_memory_restart: "500M",
      autorestart: true,
      env: { NODE_ENV: "production", PORT: "3001" },
    },
    // sat-api трогать НЕ нужно: это обычный node dist/index.js в fork-режиме,
    // он рестартует быстро и за 502 на страницах не отвечает.
    // CRM и боты (sat-crm-*, sat-*-bot) — чужие процессы, в этот конфиг не включены.
  ],
};

// ── ПОРЯДОК ВНЕДРЕНИЯ (выполнять только после явного «да» владельца) ─────────────
// 0. Окно: вечер/ночь, когда трафика мало. Заранее записать текущее состояние:
//      ssh satweb-prod 'pm2 jlist > /root/audit_20260909/R6/pm2_before.json; pm2 save'
//      ssh satweb-prod 'cp /root/.pm2/dump.pm2 /root/audit_20260909/R6/dump.pm2.bak'
// 1. Положить файл на сервер и поднять НОВЫМИ именами, не трогая живые:
//      pm2 start ecosystem.satweb.proposed.js --only sat-web   → имя занято, поэтому
//      для обкатки переименовать в sat-web-next на другом порту (3010) и проверить
//      curl localhost:3010, и только потом переводить основной.
// 2. Перевод основного процесса (окно ~5 с, один раз):
//      pm2 delete sat-web && pm2 start ecosystem.satweb.proposed.js --only sat-web && pm2 save
// 3. В scripts/deploy.sh шаг 5 заменить на `pm2 reload sat-web sat-admin --update-env`
//    (см. scripts/deploy-softreload.proposed.sh).
// 4. Проверка: два-три деплоя подряд с параллельным
//      while :; do curl -s -o /dev/null -w '%{http_code} ' -H 'Host: satsolutions.uz' \
//        http://localhost:3000/ru/catalog; sleep 0.2; done
//    Ожидание: ни одного 502.
//
// ── ОТКАТ ───────────────────────────────────────────────────────────────────────
//      pm2 delete sat-web sat-admin
//      pm2 resurrect            # поднимет из /root/.pm2/dump.pm2
//   либо вручную:
//      pm2 start /usr/bin/npm --name sat-web   -- start --prefix /var/www/satweb/apps/web
//      pm2 start /usr/bin/npm --name sat-admin -- start --prefix /var/www/satweb/apps/admin
//      pm2 save
//
// ── РИСКИ ───────────────────────────────────────────────────────────────────────
// 1. Память. Два воркера Next на 3,9 ГБ ОЗУ при уже занятых 870 МБ swap. Смягчение:
//    instances: 1, max_memory_restart, наблюдение за swap первые сутки.
// 2. Совместимость cluster_mode и Next. `next start` поднимает http-сервер сам,
//    порт разделяется через cluster — схема рабочая, но НЕ проверена на этом проде.
//    Обязательна обкатка на отдельном порту (шаг 1), а не сразу на 3000.
// 3. Кэш ISR у каждого воркера свой (файловый кэш общий, но in-memory — нет):
//    два воркера могут отдавать страницу разной свежести в пределах revalidate.
//    Для каталога с revalidate 300 это незаметно; для форм/корзины состояние
//    хранится на клиенте и в API, sticky-сессии не нужны.
// 4. socket.io — ПРОВЕРЕНО: сервер живёт в sat-api (apps/api/src/chatSocket.ts),
//    в Next только клиент (apps/web/src/components/ChatWidget.tsx). Значит sticky-сессии
//    для sat-web не нужны, а 502 на /socket.io в дни деплоев — это окно рестарта
//    sat-api, и лечится оно отдельно (sat-api в конфиг намеренно не включён).
// 5. pm2 save перезаписывает dump.pm2 сразу для ВСЕХ процессов, включая CRM и ботов.
//    Бэкап dump.pm2 (шаг 0) обязателен.
