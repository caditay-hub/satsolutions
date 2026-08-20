---
name: seo-check
description: Полная SEO-проверка satsolutions.uz. Использовать при «проверь SEO», «что с индексацией», «как дела с Google/Яндекс», после крупных изменений структуры или по еженедельному срезу.
---

# SEO-проверка satsolutions.uz

Полный промпт-чек-лист лежит в `prompt-seo-check.md` (корень репо) — при глубокой проверке следовать ему. Быстрый порядок:

## 1. Индексация (GSC URL Inspection)
- На сервере: `apps/api/src/monitor/indexCheck.ts` — прогон 258+ SEO-URL, есть в боте sat-monitor-bot команда `/index`; cron пн 09:00.
- Авторизация: SA через `getGoogleAccessToken` (googleAuth.ts), scope webmasters.

## 2. Техническая база (curl всегда с -A "Mozilla/5.0...")
- Sitemap: `https://satsolutions.uz/sitemap.xml` — без редиректящих/404 URL.
- Выборочно страницы: canonical, hreflang (ru/uz/en/tr/zh — все пять локалей переведены полностью, фолбэка на en больше нет), title/description, JSON-LD.
- Sitemap обязан содержать ВСЕ 5 локалей отдельными `<loc>`, а не только в hreflang-альтернатах (проверка: `sitemap-*.xml` → счётчик по первому сегменту пути должен быть равным для ru/uz/en/tr/zh).
- 404-кандидаты: снятые товары должны отдавать 308 на /catalog/<brand> (removedProducts.ts + middleware, 470 записей). Новые 404 из GSC-экспортов → добавлять туда же.
- Фильтровые URL — noindex; редиректы старого сайта (/product/show, /category, /brand) работают.

## 3. Данные мониторинга
- Отчёт: бот sat-monitor-bot по запросу (cron отключён). Источники: GSC, GA4, PSI, Google Ads, Яндекс (Метрика 98915892 + Вебмастер).
- GA4-разрыв с серверными логами = adblock+выборка, НЕ баг; ручной page_view НЕ добавлять (Enhanced Measurement сам трекает SPA).
- Для анализа прогонов есть агент `seo-monitor` (.claude/agents).

## 4. Правило из памяти (ВСЕГДА)
Любое изменение сайта — с учётом SEO: slug/301, canonical+hreflang, sitemap, i18n 5 языков, семантика. Любое изменение товара — обновить i18n JSON (uz/en/tr/zh) и seoTitle/seoDescription.

## Яндекс
- IndexNow дифф-отправка встроена в деплой (indexNow.ts, ключ-файл в public/).
- Вебмастер API v4: user 818563776, host `https:satsolutions.uz:443`, токен /root/.yandex_token.
