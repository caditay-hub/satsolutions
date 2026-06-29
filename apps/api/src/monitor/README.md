# Агент-мониторинг satsolutions.uz

Тянет данные из **Google Search Console**, **GA4** и **PageSpeed Insights**, сравнивает
неделя-к-неделе, ловит проблемы по порогам, прогоняет цифры через Claude для
приоритетных рекомендаций и шлёт отчёт/алерты в Telegram-бот **CRM_SAT** (`https://t.me/CRM_SAT_bot`).

Без новых npm-зависимостей: JWT сервис-аккаунта подписывается через `jsonwebtoken`
(уже в проекте), к Google REST API ходим обычным `fetch` (Node 20).

```
apps/api/src/monitor/
  config.ts            конфиг (env/файлы-секреты, пороги алертов)
  googleAuth.ts        JWT сервис-аккаунта → access token (GSC+GA4)
  telegram.ts          отправка в CRM_SAT_bot
  snapshot.ts          хранение JSON-снапшотов (история, WoW)
  analyze.ts           правила-алерты + нарратив через Claude
  run.ts               оркестратор (точка входа для cron)
  sources/
    searchConsole.ts   Search Analytics + быстрые победы
    ga4.ts             GA4 Data API (трафик/конверсии/каналы)
    psi.ts             Core Web Vitals (mobile) по ключевым URL
```

## Команды

```bash
cd apps/api
npm run monitor:dry      # полный прогон, печать в консоль (БЕЗ Telegram) — для проверки
npm run monitor          # полный прогон + отчёт в Telegram
npm run monitor:alerts   # только жёсткие алерты (для частых проверок), пишет лишь при проблемах
```

---

## Настройка (один раз) — чек-лист секретов

Без этих доступов агент запустится, но честно покажет `⚠ Ошибки сбора`. Делаем
поэтапно: сперва GSC + GA4 + PSI, Google Ads — отдельно (Phase 2, см. ниже).

### 1. Google Cloud: проект + сервис-аккаунт
1. В [console.cloud.google.com](https://console.cloud.google.com) создать (или взять) проект.
2. **Enable APIs**: `Google Search Console API`, `Google Analytics Data API`, `PageSpeed Insights API`.
3. IAM → **Service Accounts** → создать аккаунт (роли не нужны) → **Keys** → Add key → JSON.
4. Скачанный JSON положить на сервер: **`/root/.gsc_sa.json`** (или задать путь в `GOOGLE_SA_KEY_FILE`).
   - Запомни `client_email` из этого файла (вида `...@...iam.gserviceaccount.com`) — его выдаём в доступы ниже.

### 2. Доступ сервис-аккаунту к данным
- **Search Console** → Settings → Users and permissions → Add user → вставить `client_email`, права **Full** (read).
  - Ресурс у satsolutions — доменный, поэтому в конфиге `GSC_PROPERTY=sc-domain:satsolutions.uz` (по умолчанию).
- **GA4** → Admin → Property access management → добавить `client_email` ролью **Viewer/Analyst**.
  - Узнать **числовой Property ID**: GA4 → Admin → Property Settings → «Property ID» (это НЕ `G-SHQYK1BS1S`).
  - Прописать его в env: `GA4_PROPERTY_ID=123456789`.

### 3. PageSpeed Insights (необязательно, но желательно)
- API key: Cloud Console → APIs & Services → Credentials → Create API key.
- Положить в **`/root/.psi_key`** (или env `PSI_API_KEY`). Без ключа PSI тоже работает, но с жёстким анонимным лимитом.

### 4. Telegram-бот CRM_SAT
- Токен бота (от @BotFather) → **`/root/.telegram_monitor_bot`** (или env `TELEGRAM_BOT_TOKEN`).
- Chat ID получателя (личный chat_id или id группы/канала, куда добавлен бот) → **`/root/.telegram_monitor_chat`** (или env `TELEGRAM_CHAT_ID`).
  - Узнать chat_id: написать боту что-нибудь и открыть `https://api.telegram.org/bot<ТОКЕН>/getUpdates` → поле `chat.id`.

### 5. Claude (нарратив) — уже есть
`ANTHROPIC_API_KEY` берётся из окружения (он уже в `apps/api/.env`). Модель — `claude-opus-4-8` (env `MONITOR_CLAUDE_MODEL`).

### Переменные окружения (сводка)
| Переменная | Назначение | Дефолт |
|---|---|---|
| `GOOGLE_SA_KEY_FILE` | путь к JSON сервис-аккаунта | `/root/.gsc_sa.json` |
| `GSC_PROPERTY` | ресурс Search Console | `sc-domain:satsolutions.uz` |
| `GA4_PROPERTY_ID` | **числовой** id ресурса GA4 | — (обязательно) |
| `PSI_API_KEY` / `/root/.psi_key` | ключ PageSpeed | — |
| `PSI_URLS` | URL для замера CWV (через запятую) | главная/каталог/решения |
| `TELEGRAM_BOT_TOKEN` / `/root/.telegram_monitor_bot` | токен бота | — |
| `TELEGRAM_CHAT_ID` / `/root/.telegram_monitor_chat` | получатель | — |
| `MONITOR_DATA_DIR` | каталог снапшотов | `/root/monitor-data` |
| `ANTHROPIC_API_KEY` | ключ Claude | из `.env` |

Пороги алертов (падение кликов/сессий, ухудшение позиции, плохие CWV) — в `config.ts → thresholds`.

---

## Cron на сервере

Через PM2 (в проекте уже используется) — `ecosystem`/`pm2` с cron-рестартом, либо системный crontab.
Системный crontab проще:

```cron
# Ежедневный полный отчёт в 08:30 (Asia/Tashkent)
30 8 * * *  cd /var/www/satweb/apps/api && /usr/bin/npm run monitor >> /var/log/sat-monitor.log 2>&1
# Частая проверка алертов каждые 3 часа (пишет в Telegram только при проблеме)
0 */3 * * * cd /var/www/satweb/apps/api && /usr/bin/npm run monitor:alerts >> /var/log/sat-monitor.log 2>&1
```

> Путь деплоя — `/var/www/satweb` (git-чекаут `main`, PM2). NB: на сервере есть отдельный CRM-проект с ботами — его не трогаем.
> Часовой пояс задаётся в crontab (`CRON_TZ=Asia/Tashkent`) или временем сервера.

---

## Phase 2 — Google Ads (отдельно)
Требует `developer_token` (заявка в MCC-аккаунте, модерация Google), OAuth client + refresh token.
Когда токен будет — добавим `sources/googleAds.ts` (GAQL: расход, CPC, конверсии, поисковые запросы,
показатель качества) по той же схеме `fetch` + порог `cpcRisePct` уже заложен в `config.ts`.
