---
name: ads-audit
description: Аудит и управление рекламой — Google Ads (REST v21) и Яндекс.Директ (API v5). Использовать при «проверь кампании/запросы/минус-слова», «как реклама», «поменяй бюджет/объявления».
---

# Реклама: Google Ads + Яндекс.Директ

## Google Ads REST v21 (скрипты tsx на сервере, паттерн — scratchpad ads_intl.ts в истории)
- CID 6700450278, MCC 7453694082 (header `login-customer-id`), OAuth /root/.gads_oauth.json + dev token /root/.gads_dev_token.
- Кампании: Пожарка 23932578708, СКУД 23932578711, Видео 23937562781, UZ 24004805939, International EN 24009342625.
- Стандарты аккаунта: TARGET_SPEND потолок CPC 400000 micros; гео 1028523/9207614/9230364/9238725/9253516 PRESENCE; языки ru=1031 en=1000 (узбекского 1141 как таргетинга НЕТ — UZ-кампания без языкового); `containsEuPoliticalAdvertising` обязателен при создании кампании.
- ⚠️ УЗБЕКСКИЙ ЯЗЫК В ТЕКСТАХ ОБЪЯВЛЕНИЙ НЕ ПОДДЕРЖИВАЕТСЯ Google Ads: RSA целиком на узбекском → DISAPPROVED (UNSUPPORTED_LANGUAGE, прецедент 15.07.2026). Тексты UZ-кампании И ЛЕНДИНГИ — ТОЛЬКО русские (прецедент 17.07: finalUrl /uz/solutions/cctv → DISAPPROVED при русских текстах; все APPROVED-объявления ведут на ru-страницы). Запросы-ключи узбекские — ок.
- ⚠️ path1/path2 (видимый путь) — тоже «текст»: `path1="kamera"` → DISAPPROVED UNSUPPORTED_LANGUAGE при русских H/D (прецедент 16.07.2026, ad 817127931353). Пути — транслит РУССКИХ слов (kamery, zamki, turnikety — ок). Фикс: ads:mutate updateMask `responsive_search_ad.path1` → авто-перемодерация.
- ПОЛНЫЙ аудит (правило владельца 20.08.2026 — только исчерпывающе, не выборочно): `node /root/sat-analytics/deep_audit.cjs` — 16 секций (все кампании+настройки, гео/языки/устройства/расписания, минусы 3 уровней, все 377 ключей с QS-компонентами, все объявления с модерацией/силой/закреплениями, активы, 1400+ поисковых запросов, конверсии, гео-факт, сети, рекомендации Google, change history). Вывод в файл, читать секциями. Эталонный отчёт: polnyi-audit-ads-organika-2026-08-20.md.
- Аудит запросов: search_term_view через searchStream (GAQL), новые минусы — на уровень кампании; кросс-минусовка между кампаниями (ru↔uz↔en).
- RSA-правки: `ads:mutate` c updateMask `responsive_search_ad.headlines` (пересоздание не нужно).
- Ключевые идеи: KeywordPlanIdeaService generateKeywordIdeas (geo 2860 для RU-выдачи).

## Яндекс.Директ API v5
- Токен /root/.yandex_token (scope direct:api). Кампания 712207459, WB_MAXIMUM_CLICKS, WeeklySpendLimit в микро-единицах ×1e6 (200000000000 = 200K UZS... проверять размерность!).
- RegionIds задаются на ГРУППЕ (10335 Ташкент, 10331 область), не на кампании.

## Конверсии
- Тег AW-18194158897; конверсии: звонок/WhatsApp/Telegram/чат (satsolutions-google-ads в памяти). Конверсии = key events GA4.

## ПРАВИЛО (classifier-прецедент)
Запуск/включение платных кампаний и повышение бюджетов — ТОЛЬКО после явного «запускай» от пользователя с озвученным бюджетом. Подготовить → показать → спросить.
