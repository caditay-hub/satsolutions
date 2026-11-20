# Контроль ошибок сайта и CRM и их разбор

Состояние на 20.11.2026. Sentry: организация `sat-solutions` (регион EU, `de.sentry.io`), проекты `satsolutions-web` (сайт) и `satsolutions-api` (API). Токен API только на чтение лежит на сервере в `/root/.sentry_token` (в репозитории и локально его нет).

## Три уровня

| Уровень | Что делает | Где | Как часто |
|---|---|---|---|
| 1. Сигнал в Telegram | Новая ошибка или известная резко участилась → карточка ботом мониторинга. Если нового нет — молчит. | сервер, `/root/sentry_watch.cjs` (копия: `scripts/monitor/sentry_watch.cjs`), cron | каждые 15 минут |
| 2. Разбор Claude | Плановая задача приложения Claude «Ошибки сайта и CRM: разбор каждые 2 часа»: читает новое через `triage.cjs` (сайт и CRM), находит причину в коде, готовит исправление в ветке `fix/sentry-…`, пишет отчёт `docs/sentry/TRIAGE-ГГГГ-ММ-ДД.md` и карточку в Telegram. **Выкладка — только после «да» владельца.** | этот компьютер, задача `sentry-triage-2h` (работает, пока открыто приложение Claude) | каждые 2 часа, 08:00–22:00 |
| 3. Выкладка | Владелец говорит «да» в сессии → ff-merge ветки в main → push → `npm run deploy` → проверка. | сессия владельца | по решению |

## Скрипты на сервере (`/root/sentry_watch/`)

- `triage.cjs` — что появилось или выросло с прошлого разбора, с событиями (браузер, адрес, стек с датой сборки каждого файла, действия). `--all` все нерешённые, `--mark` запомнить разобранным, `--json`. Состояние `triage_state.json`. Копия: `scripts/monitor/sentry_triage.cjs`.
- `notify.cjs` — отправить текст в Telegram ботом мониторинга (аргумент или stdin, HTML). Копия: `scripts/monitor/sentry_notify.cjs`.
- `list.cjs`, `detail*.cjs`, `frames.cjs` — разовые просмотры 19–20.11, только чтение.
- Состояние уровня 1: `state.json`, журнал `cron.log`.

## Рассинхрон сборок («reading 'call'», «e[o].call», ChunkLoadError)

Причина: до 19.11.2026 Next отдавал страницам и предзагрузкам ссылок (RSC) `Cache-Control: s-maxage=60, stale-while-revalidate=31535940`; CDN нет, браузеры хранили ответы прежних сборок год и смешивали их с новыми. Проверка buildId в роутере Next срабатывает уже после подгрузки чанков и не спасает.

Лечение (три слоя):
1. 19.11 — nginx `conf.d/page-cache-control.conf`: таким ответам `private, no-cache`.
2. 20.11 — nginx `conf.d/clear-stale-cache.conf` + две строки в `sites-enabled/satsolutions` (`location /`): HTML-документу без cookie `sat_csd` отдаётся `Clear-Site-Data: "cache"` и cookie на 30 дней — кэш прежних сборок стирается один раз на браузер (Chrome, Edge, Firefox, Safari 17+). Копия настройки: `scripts/monitor/nginx-clear-stale-cache.conf`. Откат: `/root/backups/nginx/satsolutions.20261120-045638`, удалить conf.d-файл, `nginx -t && systemctl reload nginx`.
3. 20.11 — сайт `apps/web/src/lib/buildSkew.ts`: такая ошибка узнаётся в глобальных обработчиках (`instrumentation-client.ts`) и на страницах ошибки (`error.tsx`, `global-error.tsx`) → одна автоматическая перезагрузка страницы, не чаще раза в минуту на вкладку. Тест: `buildSkew.test.ts`.

## Как остановить или поменять

- Уровень 1: закомментировать строку `sentry_watch` в `crontab -e` на сервере.
- Уровень 2: в приложении Claude — список плановых задач, задача «Sentry: разбор ошибок каждые 2 часа» (папка `C:\Users\user\.claude\scheduled-tasks\sentry-triage-2h\SKILL.md` — там полный текст задания).
- Телефоны в заголовках событий вырезаются в обоих скриптах (`scrub`).

## CRM sats.uz (с 20.11.2026)

Sentry в CRM нет — ошибки читаются из журналов на нашем сервере, наружу данные CRM не уходят.

| Что | Где |
|---|---|
| Сигнал в Telegram каждые 15 минут, только новое | `/root/crm_watch/watch.cjs` (копия `scripts/monitor/crm_watch.cjs`), cron `*/15`, журнал `/root/crm_watch/cron.log`, состояние `state.json` |
| Разбор для Claude | `/root/crm_watch/triage.cjs` (копия `scripts/monitor/crm_triage.cjs`): `--all`, `--mark` |
| Исправления | ветки `fix/crm-…` в репозитории caditay-hub/sat-crm, рабочая копия `D:\sat-crm-autofix` (только для плановой задачи) |

Источники и пороги:
- **сервер CRM** — `logs/error.log` (ответы 500): каждая новая ошибка сразу;
- **браузер сотрудников и мини-приложение** — `logs/client-errors.log`, пишет маршрут `POST /api/client-errors` (ветка `crm-client-errors-2026-11-20`, **ждёт «да» на выкладку**); рассинхрон после выкладки CRM — от 15 событий, страница сама перезагружается один раз;
- **боты** (CRM, «SAT Расходы», «Приход / Уход», «Документы») — журналы PM2: ошибки кода сразу; обрывы связи с Telegram (~190 в сутки на бота — норма) — только если ≥10 за 15 минут три проверки подряд; 429 — шум; процесс не online или ≥3 перезапуска за 15 минут;
- **обмены** (1С, Didox, биржи, склад и др., `logs/*.log`) — ошибки кода (`run_failed`, Traceback, TypeError…) сразу; внешние сбои (сеть, Didox 5xx, 1С 403) — если падает 3 проверки подряд; частые обмены без записей дольше порога — «не запускается»;
- **nginx** — 5xx на `/api/` от 3 за 15 минут (журнал общий с сайтом);
- **доступность** — главная sats.uz не открылась две проверки подряд.

Остановить: строка `crm_watch` в `crontab -e` на сервере (копия расписания до правки — `/root/crm_watch/crontab.bak-20261120-052739`).
