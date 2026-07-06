---
name: crm-bots
description: Правка Telegram-ботов CRM sats.uz (attendance-bot приход/уход, telegram-bot расходы/чеки, monitor-bot). Использовать при «бот не так отвечает», «добавь в бота», «уведомления рабочим».
---

# CRM-боты (sats.uz)

## Где что
- Репо SERVER-ONLY: /var/www/sat (править прямо на сервере через ssh satweb-prod, БД `sat`).
- `backend/attendance-bot.js` — @sat_ish_vaqti_bot: приход/уход, зарплатный модуль, broadcastToWorkers(), pendingNotify (вставленный текст → кнопка «Разослать всем», callbacks nfy:go/nfy:no).
- `backend/telegram-bot.js` — расходы/чеки: конвейер askFlow/flowCleanup/flowFinish, persistence в таблице bot_flows (JSONB), реакции на сообщениях setMessageReaction ✍/🤷, авто-удаление служебных сообщений бота (остаётся только метка «записан расход → куда»).
- monitor-бот satweb: apps/api/src/monitor (это ДРУГОЙ репо — satweb, править локально+деплой).

## Процесс правки
1. Читать файл с сервера, править там же (heredoc/python по ssh или scp туда-обратно).
2. `pm2 restart sat-attendance-bot` / `sat-crm-bot` после правки.
3. Проверить `pm2 logs <bot> --lines 30 --nostream` на ошибки старта.

## Решения, которые НЕ переспрашивать
- Курс USD в расходах — ТОЛЬКО вручную (авто-курс отменён пользователем).
- Строку SG-ботов в мониторинг не добавлять (пользователь сказал «нет»).
- Валентин=5, Искандар=4 (id в зарплатном модуле).

## Стиль ботов
- Бот убирает за собой лишние сообщения; итог — метка на исходном сообщении пользователя, не отдельное сообщение.
- Состояние конвейеров переживает рестарт (bot_flows), новые флоу делать так же.
