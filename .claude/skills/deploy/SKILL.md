---
name: deploy
description: Деплой satsolutions.uz (satweb). Использовать при «задеплой», «выкати», «npm run deploy» или после любых изменений в apps/web|apps/api, которые надо доставить на прод.
---

# Деплой satweb

## Порядок
1. Проверить, что все изменения закоммичены: `git status` (git-команды из корня репо `D:\sat_web_github`).
2. `git push` (remote SSH, ключ настроен).
3. **`npm run deploy` — ЗАПУСКАТЬ ТОЛЬКО ЛОКАЛЬНО** (Bash, `run_in_background: true`, timeout 600000). Скрипт сам: тянет git на сервере, собирает, рестартит PM2, чистит ISR каталога, прогревает, шлёт sitemap в GSC и IndexNow.
4. Дождаться `==> [satweb deploy] DONE`, проверить хвост лога: PM2 все `online`, `[sitemap-submit] HTTP 204 OK`.

## Проверка после деплоя
- `curl -sL -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" https://satsolutions.uz/<страница>` — **всегда с -A Mozilla, голый curl получает 403** (nginx бот-фильтр).
- Помнить про ISR: старые страницы живут до revalidate (каталог 300–600 c). Деплой сбрасывает только ISR каталога.
- Клиентские компоненты (SiteFooter и т.п.) не видны в сыром HTML — проверять в браузере или по наличию данных в JS-бандле.

## Грабли
- Шаг 6 деплоя чистит ISR: glob должен быть `other.*`, НЕ `other*` — иначе сносит page.js → 500.
- На сервере НЕ править tracked-файлы (productI18n.json и др.) — только через git.
- API-сборка: build = `tsc --noCheck` (типовой долг, исправлено в 4ccdf7e) — не «чинить» типы в чужом коде ради деплоя.
- Сервер: ssh-алиас `satweb-prod`, PM2-процессы sat-web/sat-api/sat-admin.
