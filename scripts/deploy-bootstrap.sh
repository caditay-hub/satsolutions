#!/usr/bin/env bash
# Загрузчик деплоя satweb. Лежит на сервере: /root/deploy-satweb.sh
#
# Здесь ТОЛЬКО то, что нельзя доверить обновляемому файлу. Вся логика деплоя —
# в репозитории (scripts/deploy.sh) и приезжает с GitHub при каждом запуске,
# поэтому руками на сервер её больше копировать не надо.
#
# Три задачи загрузчика:
#   1. Отвязать деплой от SSH-сессии. Проверено 22.08.2026: удалённая команда,
#      которая пишет в stdout, умирает ровно в момент обрыва связи. Именно так
#      оборвалась сборка 21.08 — .next остался недописанным, pm2 не рестартовал,
#      сайт 8,5 часов отдавал 200 без стилей. Теперь вывод идёт в файл на
#      сервере, а клиент лишь смотрит на него через tail: обрыв связи гасит
#      tail, но не деплой.
#   2. Не дать запуститься второму деплою поверх первого — две параллельные
#      сборки пишут в один .next.
#   3. Забрать свежий scripts/deploy.sh из origin/main в ОТДЕЛЬНЫЙ файл.
#      Проверено: git-обновление файла безопасно даже во время его выполнения,
#      а вот scp/cp поверх работающего скрипта ломает его на середине
#      (unexpected EOF) — поэтому пишем в новый файл, а не поверх себя.
set -uo pipefail

LOG=/root/deploy-last.log
RC=/root/deploy-last.rc
RUN=/root/deploy-run.sh
LOCK=/root/deploy.lock

# ── родительский проход: отвязка + слежение за логом ────────────────────────
if [ "${SATWEB_DEPLOY_CHILD:-}" != "1" ]; then
  exec 9>"$LOCK"
  if ! flock -n 9; then
    echo "!! деплой уже идёт. Смотреть: ssh satweb-prod 'tail -f $LOG'"
    exit 75
  fi
  exec 9>&-                      # отпускаем: блокировку возьмёт дочерний процесс
  rm -f "$RC"; : > "$LOG"
  SATWEB_DEPLOY_CHILD=1 setsid bash "$0" >"$LOG" 2>&1 </dev/null &
  child=$!
  sleep 1
  tail -f --pid="$child" "$LOG" 2>/dev/null
  rc=$(cat "$RC" 2>/dev/null || echo 1)
  if [ "$rc" != "0" ]; then
    echo "!! деплой завершился с кодом $rc (полный лог: $LOG)"
  fi
  exit "$rc"
fi

# ── дочерний проход: собственно работа ──────────────────────────────────────
exec 9>"$LOCK"
flock -n 9 || { echo "!! не удалось взять блокировку"; echo 75 >"$RC"; exit 75; }
trap 'echo $? >"$RC"' EXIT

cd /var/www/satweb
if git fetch -q origin 2>/dev/null && git show origin/main:scripts/deploy.sh >"$RUN.tmp" 2>/dev/null && [ -s "$RUN.tmp" ]; then
  mv "$RUN.tmp" "$RUN"
  echo "==> [загрузчик] рабочий скрипт обновлён из origin/main"
else
  rm -f "$RUN.tmp"
  if [ ! -s "$RUN" ]; then
    echo "!! GitHub недоступен и прежней версии $RUN нет — деплой невозможен"
    exit 1
  fi
  echo "==> [загрузчик] GitHub недоступен, работаем прежней версией $RUN"
fi

bash "$RUN"
