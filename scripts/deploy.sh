#!/usr/bin/env bash
# Канонический скрипт деплоя satweb.
# ЖИВАЯ копия, которую реально запускает `npm run deploy`, лежит на сервере:
#   /root/deploy-satweb.sh
# Если правишь этот файл — синхронизируй на сервер: `npm run deploy:push-script`
set -euo pipefail
cd /var/www/satweb
echo "==> [satweb deploy] start $(date -u +%FT%TZ)"

# 1) Safety: back up any direct/uncommitted server edits before touching the tree
if [ -n "$(git status --porcelain)" ]; then
  ts=$(date -u +%Y%m%dT%H%M%SZ)
  git stash push -u -m "auto-backup before deploy $ts"
  echo "    direct server edits backed up -> git stash: auto-backup before deploy $ts"
fi

# 2) Match GitHub main exactly
git fetch origin
git reset --hard origin/main
echo "    now at $(git rev-parse --short HEAD): $(git log -1 --pretty=%s)"

# 3) Install deps (include dev tools needed for the build)
npm install --include=dev --no-audit --no-fund

# 4) Build api + web + admin
npm run build

# 5) Reload ONLY the satweb apps (never the CRM / bots)
pm2 reload sat-api sat-web sat-admin --update-env
pm2 save
echo "==> [satweb deploy] DONE $(date -u +%FT%TZ)"
