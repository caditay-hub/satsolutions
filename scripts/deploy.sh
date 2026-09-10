#!/usr/bin/env bash
# Канонический скрипт деплоя satweb — ЭТОТ файл и есть рабочая логика.
# На сервере лежит только загрузчик /root/deploy-satweb.sh (= scripts/deploy-bootstrap.sh),
# который при каждом запуске забирает `scripts/deploy.sh` из origin/main в /root/deploy-run.sh
# и выполняет его. То есть правки здесь доезжают до прода САМИ — после `git push`.
# Копировать этот файл на сервер вручную НЕ нужно (`npm run deploy:push-script` не существует;
# загрузчик обновляется отдельно: `npm run deploy:push-bootstrap`).
set -euo pipefail
cd /var/www/satweb
echo "==> [satweb deploy] start $(date -u +%FT%TZ)"

# 1) Бэкап прямых правок на сервере перед сбросом дерева.
#    ВАЖНО: tracked-файлы (напр. productI18n.json) правим ЛОКАЛЬНО через git, НЕ на сервере —
#    иначе reset --hard ниже их откатит. Этот стеш — лишь страховочная сетка.
if [ -n "$(git status --porcelain)" ]; then
  ts=$(date -u +%Y%m%dT%H%M%SZ)
  git stash push -u -m "auto-backup before deploy $ts"
  echo "    direct server edits backed up -> git stash: auto-backup before deploy $ts"
fi

# 1b) Подрезаем старые авто-бэкапы, чтобы стеши не копились бесконечно (оставляем 3 свежих)
while [ "$(git stash list 2>/dev/null | grep -c 'auto-backup before deploy')" -gt 3 ]; do
  idx=$(git stash list | grep 'auto-backup before deploy' | tail -1 | sed 's/^stash@{\([0-9]*\)}.*/\1/')
  [ -n "$idx" ] && git stash drop "stash@{$idx}" >/dev/null 2>&1 || break
done

# 2) Точное соответствие GitHub main
git fetch origin
git reset --hard origin/main
echo "    now at $(git rev-parse --short HEAD): $(git log -1 --pretty=%s)"

# 3) Зависимости (с dev — нужны для сборки)
npm install --include=dev --no-audit --no-fund

# 3b) Очистка .next БЕЗ каталога cache/.
#    Было: `npm run build` в apps/web и apps/admin начинается с `npm run clean`,
#    который сносит ВЕСЬ .next — вместе с .next/cache/images. Это кэш оптимизатора
#    картинок: после каждого деплоя он пересоздавался с нуля (аудит 09.09.2026 —
#    самый старый файл кэша ровно от последнего деплоя, 658 файлов/13 МБ за сутки).
#    При 10–33 деплоях в день это давало всплески 504 «upstream image response
#    timed out» на /_next/image: холодная AVIF-конвертация w=1200 занимает 1,6 с,
#    шесть параллельных — до 6 с при таймауте оптимизатора 7 с.
#    Стало: чистим содержимое .next, но НЕ cache/ — и артефакты детерминированы,
#    и кэш картинок с webpack-кэшем переживают деплой (webpack-кэш заодно
#    сокращает время сборки, а значит и окно, в котором ловятся 504).
#    Страховка от разрастания: cache/webpack растёт от сборки к сборке; если весь
#    cache/ перевалил за 2 ГБ — сносим webpack-часть, но cache/images оставляем
#    (её цена как раз в том, чтобы пережить деплой).
clean_next_keep_cache() {
  local d="$1"
  [ -d "$d" ] || return 0
  # Живой сервер во время очистки дописывает ISR-страницы в server/app, и rm -rf
  # падает с «Directory not empty» (10.09.2026: деплой оборвался под set -e,
  # .next остался выпотрошенным, CSS отдавал 400). Повторяем до пяти раз.
  local i
  for i in 1 2 3 4 5; do
    find "$d" -mindepth 1 -maxdepth 1 ! -name cache -exec rm -rf {} + 2>/dev/null && break
    [ "$i" -eq 5 ] && { echo "    !! не удалось очистить $d за 5 попыток"; return 1; }
    sleep 1
  done
  local mb
  mb=$(du -sm "$d/cache" 2>/dev/null | cut -f1 || echo 0)
  if [ "${mb:-0}" -gt 2048 ]; then
    echo "    cache/ = ${mb} МБ (> 2 ГБ) — чистим cache/webpack, cache/images оставляем"
    rm -rf "$d/cache/webpack"
  fi
}
clean_next_keep_cache /var/www/satweb/apps/web/.next
clean_next_keep_cache /var/www/satweb/apps/admin/.next
echo "    .next очищен, cache/ сохранён: \
web $(du -sh /var/www/satweb/apps/web/.next/cache 2>/dev/null | cut -f1 || echo -), \
admin $(du -sh /var/www/satweb/apps/admin/.next/cache 2>/dev/null | cut -f1 || echo -)"

# 4) Сборка api + web + admin — с таймаутом и одним ретраем.
#    Сборка НЕ должна висеть вечно: timeout аварийно прервёт зависший билд
#    (старый сайт продолжает работать — pm2 restart ниже только после успеха).
#    Историческая причина зависаний: next/font тянул шрифты из Google на каждом
#    билде; теперь шрифты self-hosted, но таймаут оставляем как страховку.
#    ВАЖНО: web и admin собираются напрямую через `next build`, минуя
#    `npm run build -w …`, потому что тот начинается с `npm run clean` (см. шаг 3b).
#    Очистку мы уже сделали сами — с сохранением cache/.
NEXT_BIN=/var/www/satweb/node_modules/.bin/next
[ -x "$NEXT_BIN" ] || NEXT_BIN="npx --no-install next"
build_once() {
  timeout 420 bash -c "
    set -e
    cd /var/www/satweb
    npm run build -w @satsolutions/api
    ( cd /var/www/satweb/apps/web   && $NEXT_BIN build )
    ( cd /var/www/satweb/apps/admin && $NEXT_BIN build )
  "
}
if ! build_once; then
  echo "    !! сборка упала/зависла — повтор через 5с (с повторной очисткой, cache/ снова сохраняем)"
  sleep 5
  clean_next_keep_cache /var/www/satweb/apps/web/.next
  clean_next_keep_cache /var/www/satweb/apps/admin/.next
  build_once
fi

# 4b) Проверка полноты сборки. Оборванный `next build` оставляет .next без
#    prerender-manifest.json — сайт после рестарта уходит в 502, а до рестарта
#    процесс живёт со старым билдом в памяти и раздаёт хеши файлов, которых на
#    диске уже нет (авария 22.08.2026: 8,5 ч сайта без стилей при HTTP 200).
W=/var/www/satweb/apps/web/.next
for f in BUILD_ID prerender-manifest.json routes-manifest.json build-manifest.json; do
  if [ ! -s "$W/$f" ]; then
    echo "    !! СБОРКА НЕПОЛНАЯ: нет $W/$f"
    echo "       Рестарт НЕ выполняется — старый сайт продолжает работать."
    exit 1
  fi
done
if ! ls "$W"/static/css/*.css >/dev/null 2>&1; then
  echo "    !! СБОРКА НЕПОЛНАЯ: нет ни одного CSS в $W/static/css"
  exit 1
fi
echo "    сборка полная (BUILD_ID $(cat "$W/BUILD_ID"))"

# 5) Перезапуск ТОЛЬКО satweb-приложений (CRM/боты не трогаем).
#    sat-api остаётся на restart: fork-режим, node dist/index.js, поднимается за доли
#    секунды. sat-web/sat-admin с 09.09.2026 живут в cluster_mode (см.
#    scripts/ecosystem.satweb.config.js), поэтому им — reload: новый воркер поднимается,
#    отдаёт `listening`, и только потом гаснет старый. Это убирает окно 502 на каждом
#    деплое (за 03.09 их было 280, за 08.09 — 229, все внутри окон рестарта).
pm2 restart sat-api --update-env
pm2 reload sat-web sat-admin --update-env
# Страховка: если reload по какой-то причине не поднял воркера, не оставляем сайт
# лежащим — возвращаемся к жёсткому рестарту.
code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H 'Host: satsolutions.uz' http://localhost:3000/ || echo 000)
if [ "$code" != "200" ]; then
  echo "    !! после reload главная отдала $code — аварийный pm2 restart"
  pm2 restart sat-web sat-admin --update-env
fi
pm2 save

# 6) Сброс устаревших ISR-пререндеров каталога и прогрев.
#    Иначе Next отдаёт старый статический prerender (revalidate=300) ещё ~5 мин,
#    и фронт-правки видны не сразу. Удаляем ТОЛЬКО prerender-артефакты (.html/.rsc/.meta/.body),
#    но НЕ серверный модуль page.js. Паттерны ниже матчат файлы вида `<route>.html`,
#    лежащие РЯДОМ с папкой роута, и не задевают содержимое самой папки роута.
WEB_APP=/var/www/satweb/apps/web/.next/server/app
if [ -d "$WEB_APP" ]; then
  # catalog (индекс): артефакты catalog.html/.rsc/.meta — сиблинги папки catalog/
  find "$WEB_APP" -type f \( -name 'catalog.html' -o -name 'catalog.rsc' -o -name 'catalog.meta' -o -name 'catalog.body' \) -delete 2>/dev/null || true
  # catalog/other: артефакты other.html/.rsc/.meta — сиблинги папки other/.
  # Точка после `other` (other.*) исключает совпадение с other/page.js (other/...).
  find "$WEB_APP" -type f -path '*/catalog/other.*' -delete 2>/dev/null || true
  sleep 2
  for L in ru uz en tr zh; do
    curl -s -o /dev/null -m 30 "http://localhost:3000/$L/catalog" || true
    curl -s -o /dev/null -m 30 "http://localhost:3000/$L/catalog/other" || true
  done
  echo "    ISR-пререндеры каталога сброшены и прогреты"
fi

# 7) Контроль: живой сайт должен ссылаться на файлы, которые реально отдаются.
#    Именно эта проверка ловит рассинхрон «процесс на старом билде, диск на новом».
#
#    ⚠ ЖДЁМ, А НЕ ПАДАЕМ СРАЗУ. С переходом на `pm2 reload` (10.09.2026) старый воркер
#    доигрывает запросы до kill_timeout — до десяти секунд, — и всё это время отвечает
#    ПРЕДЫДУЩЕЙ сборкой. Проверка, запущенная сразу после reload, ловила именно его и
#    роняла деплой на живом и здоровом сайте. Даём до 40 секунд на смену воркера.
CSS=""
CODE=""
for i in $(seq 1 20); do
  HTML=$(curl -s -m 30 -H 'Host: satsolutions.uz' http://localhost:3000/ || true)
  CSS=$(printf '%s' "$HTML" | grep -o '/_next/static/css/[a-z0-9]*\.css' | head -1)
  if [ -n "$CSS" ]; then
    CODE=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H 'Host: satsolutions.uz' "http://localhost:3000$CSS")
    [ "$CODE" = "200" ] && break
  fi
  sleep 2
done
if [ -z "$CSS" ]; then
  echo "    !! главная не отдала HTML со ссылкой на CSS — проверьте pm2 logs sat-web"
  exit 1
fi
if [ "$CODE" != "200" ]; then
  # Не оставляем сайт без стилей: сначала лечим жёстким рестартом, потом проверяем снова.
  echo "    !! за 40 с воркер не сменился ($CSS -> $CODE) — аварийный pm2 restart sat-web"
  pm2 restart sat-web --update-env
  for i in $(seq 1 15); do
    sleep 2
    HTML=$(curl -s -m 30 -H 'Host: satsolutions.uz' http://localhost:3000/ || true)
    CSS=$(printf '%s' "$HTML" | grep -o '/_next/static/css/[a-z0-9]*\.css' | head -1)
    [ -z "$CSS" ] && continue
    CODE=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H 'Host: satsolutions.uz' "http://localhost:3000$CSS")
    [ "$CODE" = "200" ] && break
  done
fi
if [ "$CODE" != "200" ]; then
  echo "    !! КРИТИЧНО: даже после рестарта главная ссылается на $CSS, а он отдаёт $CODE."
  echo "       Процесс раздаёт не ту сборку, что лежит на диске — сайт будет без стилей."
  exit 1
fi
echo "    живая сборка сходится: $CSS -> 200"

# 8) Переотправить sitemap в Search Console (сервис-аккаунт «Владелец») — Google быстрее перечитает карту
(cd /var/www/satweb/apps/api && npx tsx src/monitor/sitemapSubmit.ts) || echo "    (переотправка sitemap не удалась — не критично)"
(cd /var/www/satweb/apps/api && npx tsx src/monitor/indexNow.ts) || echo "    (IndexNow не удался — не критично)"

echo "==> [satweb deploy] DONE $(date -u +%FT%TZ)"
