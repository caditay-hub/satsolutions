#!/usr/bin/env bash
# ПРЕДЛОЖЕНИЕ (НЕ ПРИМЕНЕНО, НЕ ЗАПУСКАТЬ КАК ЕСТЬ). R6, аудит 09.09.2026.
#
# Здесь лежат ДВА куска, которые заменят соответствующие места в scripts/deploy.sh,
# когда владелец даст «да» на переход к мягкому перезапуску:
#   A) сохранение static/ предыдущей сборки — лечит 404 на /_next/static у открытых вкладок;
#   B) шаг 5: pm2 reload вместо pm2 restart — лечит окно 502 (~3 с на каждый рестарт).
#
# Пункт B работает ТОЛЬКО после перевода sat-web/sat-admin в cluster_mode —
# см. scripts/ecosystem.satweb.proposed.js. В нынешнем fork-режиме `pm2 reload`
# молча не перезапускает приложение (уже проверялось, поэтому в deploy.sh стоит restart).
#
# Пункт A самодостаточен и может внедряться отдельно от B.

set -euo pipefail

WEB=/var/www/satweb/apps/web
ADMIN=/var/www/satweb/apps/admin
KEEP=/var/www/satweb/.next-static-keep     # вне .next, чтобы clean его не задел

# ─────────────────────────────────────────────────────────────────────────────
# A) СОХРАНЕНИЕ STATIC ПРЕДЫДУЩЕЙ СБОРКИ
#
# Проблема (трек I): generateBuildId не задан, поэтому BUILD_ID меняется на каждой
# сборке. Вкладка, открытая до деплоя, продолжает просить /_next/static/<старый хеш>/…
# Файлы уже удалены → 404 (79/49/41 штук в дни деплоев) и «Failed to find Server Action».
#
# Решение: перед очисткой .next складываем static/ в сторону, после сборки
# докладываем в новый .next/static только те файлы, которых там нет.
# Коллизий не бывает: имена содержат хеш содержимого, одинаковое имя = одинаковый файл.
# Храним ДВА поколения: этого хватает, чтобы пережить вкладку, открытую пару деплоев назад.
#
# Цена: ~2×размер static (сейчас порядка сотни МБ), свободно 23 ГБ.

save_static() {                       # вызывать ПЕРЕД очисткой .next (шаг 3b)
  local app="$1" name="$2"
  [ -d "$app/.next/static" ] || return 0
  rm -rf "$KEEP/$name.prev"
  [ -d "$KEEP/$name.last" ] && mv "$KEEP/$name.last" "$KEEP/$name.prev"
  mkdir -p "$KEEP"
  cp -a "$app/.next/static" "$KEEP/$name.last"
}

restore_static() {                    # вызывать ПОСЛЕ успешной сборки, ДО pm2
  local app="$1" name="$2" gen
  for gen in prev last; do
    [ -d "$KEEP/$name.$gen" ] || continue
    # -n: не перезаписывать файлы новой сборки; докладываем только отсутствующие
    cp -a -n "$KEEP/$name.$gen/." "$app/.next/static/" 2>/dev/null || true
  done
  echo "    static предыдущих сборок доложен в $app/.next/static"
}

# как встроить в scripts/deploy.sh:
#   перед  clean_next_keep_cache …      →  save_static    "$WEB" web ;  save_static    "$ADMIN" admin
#   после  проверки полноты сборки (4b) →  restore_static "$WEB" web ;  restore_static "$ADMIN" admin

# ─────────────────────────────────────────────────────────────────────────────
# B) ШАГ 5: МЯГКИЙ ПЕРЕЗАПУСК
#
# Было:
#   pm2 restart sat-api sat-web sat-admin --update-env
#   pm2 save
# Станет:

soft_restart() {
  # sat-api остаётся на restart: fork-режим, node dist/index.js, поднимается за доли
  # секунды. Именно он держит /socket.io, поэтому его окно рестарта останется —
  # это отдельная задача.
  pm2 restart sat-api --update-env

  # sat-web / sat-admin — cluster_mode, reload поднимает новый воркер, дожидается
  # от него `listening` и только потом гасит старый.
  pm2 reload sat-web sat-admin --update-env

  # Контроль: если reload не поднял воркеров, откатываемся на restart, чтобы не
  # оставить сайт лежащим.
  local code
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -H 'Host: satsolutions.uz' \
         http://localhost:3000/ || echo 000)
  if [ "$code" != "200" ]; then
    echo "    !! после reload главная отдала $code — аварийный pm2 restart"
    pm2 restart sat-web sat-admin --update-env
  fi
  pm2 save
}

# ─────────────────────────────────────────────────────────────────────────────
# ПРОВЕРКА ЭФФЕКТА (запускать в соседней сессии во время деплоя)
#   while :; do curl -s -o /dev/null -w '%{http_code} ' -m 5 \
#     -H 'Host: satsolutions.uz' http://localhost:3000/ru/catalog; sleep 0.2; done
#   Сейчас в окне рестарта видно 502; после внедрения ожидается сплошной 200.
#
# ОТКАТ
#   A) rm -rf /var/www/satweb/.next-static-keep  и убрать вызовы save/restore_static.
#      Ничего, кроме дискового места, это не занимает; на работу сайта не влияет.
#   B) вернуть строку `pm2 restart sat-api sat-web sat-admin --update-env`
#      и перевести процессы обратно в fork (см. раздел ОТКАТ в ecosystem.satweb.proposed.js).
#
# РИСКИ
# 1. (A) Разрастание диска: два поколения static. Смягчение — хранить ровно два
#    поколения, как здесь; при желании чистить всё, что старше 7 дней.
# 2. (A) `cp -n` не перезапишет файлы новой сборки, но если хеширование когда-нибудь
#    сменится на неконтентное, старый файл с тем же именем может «залипнуть».
#    Смягчение: не трогаем совпадающие имена вообще (-n), и BUILD_ID у новой сборки
#    всё равно другой.
# 3. (B) reload в cluster_mode кратковременно держит удвоенное число воркеров —
#    пик по памяти. На 3,9 ГБ ОЗУ с уже занятым swap это главный риск; при
#    instances: 1 пик равен двум процессам Next вместо одного.
# 4. (B) Если новый воркер стартует дольше listen_timeout (15 с), pm2 сочтёт его
#    неудачным. Сборка каталога тяжёлая — время старта надо померить заранее:
#      /usr/bin/time -f %e node_modules/next/dist/bin/next start -p 3010
# 5. (B) sat-api по-прежнему рестартует жёстко: 502 на /socket.io и на API-запросах
#    в момент деплоя останутся. Полное лечение — отдельная задача (два экземпляра
#    API за upstream nginx с отдельным reload).
