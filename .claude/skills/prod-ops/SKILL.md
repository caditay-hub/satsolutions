---
name: prod-ops
description: Работа с прод-сервером satsolutions/sats.uz: SSH, прод-БД (psql), PM2, логи, файлы, секреты. Использовать при «посмотри на сервере», «проверь БД», «перезапусти», «логи бота».
---

# Прод-сервер: доступ и правила

## Доступ
- SSH-алиас: `ssh satweb-prod` (host key принят; альтернатива plink/pscp — детали в памяти satsolutions-server-access).
- satweb: /var/www/satweb (tracked-файлы НЕ править — только git pull; .env-файлы можно).
- CRM (sats.uz): /var/www/sat — репо SERVER-ONLY, править прямо там, БД `sat`.

## БД
- Креды в apps/api/.env на сервере; psql от них.
- Выгрузки: `\copy` (клиентская), НЕ `COPY` (серверные права).
- Записи в прод-данные — через seed-скрипты на моделях (tsx), не сырой SQL.

## PM2
- Процессы: sat-web, sat-api, sat-admin, sat-crm-api, sat-crm-bot, sat-attendance-bot, sat-monitor-bot, sat-web-bot.
- Перезапуск ботов после правки: `pm2 restart <name>`; логи `pm2 logs <name> --lines 50 --nostream`.

## Секреты (НИКОГДА не выводить значения — только имена файлов)
- /root/.fal_key, /root/.perplexity_key, /root/.serper_key (+ _key2 — первый без кредитов), /root/.yandex_token, /root/.gads_oauth.json, /root/.gads_dev_token; Anthropic — в apps/api/.env; зеркала в .secrets/.
- Проверять наличие ключа ПЕРЕД тем как говорить «нужен ключ».
- Новые токены: пользователь кладёт в файл на рабочем столе → scp на сервер → локальный файл удалить.

## Грабли шелла
- `pkill -f`/`pgrep -f` в ssh-команде матчит саму ssh-команду → exit 255: использовать `[x]`-скобки (`pkill -f "[i]ndexCheck"`).
- Windows python: вывод cp1251 ломается — писать результат в файл utf-8 и читать Read'ом.
- Голый curl к satsolutions.uz → 403: всегда `-A "Mozilla/5.0..."`.
