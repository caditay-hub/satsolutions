#!/usr/bin/env bash
# Канонический скрипт деплоя satweb.
# ЖИВАЯ копия, которую реально запускает `npm run deploy`, лежит на сервере:
#   /root/deploy-satweb.sh
# Если правишь этот файл — синхронизируй на сервер: `npm run deploy:push-script`
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

# 4) Сборка api + web + admin — с таймаутом и одним ретраем.
#    Сборка НЕ должна висеть вечно: timeout аварийно прервёт зависший билд
#    (старый сайт продолжает работать — pm2 restart ниже только после успеха).
#    Историческая причина зависаний: next/font тянул шрифты из Google на каждом
#    билде; теперь шрифты self-hosted, но таймаут оставляем как страховку.
build_once() { timeout 420 npm run build; }
if ! build_once; then
  echo "    !! сборка упала/зависла — повтор через 5с"
  sleep 5
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

# 5) Перезапуск ТОЛЬКО satweb-приложений (restart, не reload — в fork-режиме reload
#    не перезапускал sat-web/sat-admin; CRM/боты не трогаем)
pm2 restart sat-api sat-web sat-admin --update-env
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
HTML=$(curl -s -m 30 -H 'Host: satsolutions.uz' http://localhost:3000/ || true)
CSS=$(printf '%s' "$HTML" | grep -o '/_next/static/css/[a-z0-9]*\.css' | head -1)
if [ -z "$CSS" ]; then
  echo "    !! главная не отдала HTML со ссылкой на CSS — проверьте pm2 logs sat-web"
  exit 1
fi
CODE=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H 'Host: satsolutions.uz' "http://localhost:3000$CSS")
if [ "$CODE" != "200" ]; then
  echo "    !! КРИТИЧНО: главная ссылается на $CSS, а он отдаёт $CODE."
  echo "       Процесс раздаёт не ту сборку, что лежит на диске — сайт будет без стилей."
  exit 1
fi
echo "    живая сборка сходится: $CSS -> 200"

# 8) Переотправить sitemap в Search Console (сервис-аккаунт «Владелец») — Google быстрее перечитает карту
(cd /var/www/satweb/apps/api && npx tsx src/monitor/sitemapSubmit.ts) || echo "    (переотправка sitemap не удалась — не критично)"
(cd /var/www/satweb/apps/api && npx tsx src/monitor/indexNow.ts) || echo "    (IndexNow не удался — не критично)"

echo "==> [satweb deploy] DONE $(date -u +%FT%TZ)"
