#!/usr/bin/env bash
# Канонический скрипт деплоя satweb.
# ЖИВАЯ копия, которую реально запускает `npm run deploy`, лежит на сервере:
#   /root/deploy-satweb.sh
# Если правишь этот файл — синхронизируй на сервер: `npm run deploy:push-script`
set -euo pipefail
cd /var/www/satweb
echo "==> [satweb deploy] start $(date -u +%FT%TZ)"

# 1) Бэкап прямых правок на сервере перед сбросом дерева
if [ -n "$(git status --porcelain)" ]; then
  ts=$(date -u +%Y%m%dT%H%M%SZ)
  git stash push -u -m "auto-backup before deploy $ts"
  echo "    direct server edits backed up -> git stash: auto-backup before deploy $ts"
fi

# 2) Точное соответствие GitHub main
git fetch origin
git reset --hard origin/main
echo "    now at $(git rev-parse --short HEAD): $(git log -1 --pretty=%s)"

# 3) Зависимости (с dev — нужны для сборки)
npm install --include=dev --no-audit --no-fund

# 4) Сборка api + web + admin
npm run build

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

echo "==> [satweb deploy] DONE $(date -u +%FT%TZ)"
