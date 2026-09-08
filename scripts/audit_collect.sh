#!/usr/bin/env bash
# Сборщик данных для сплошного аудита satsolutions.uz. ТОЛЬКО ЧТЕНИЕ: ничего не меняет
# ни на сайте, ни в рекламе, ни в базе. Запуск с рабочей машины:
#   ssh satweb-prod 'bash -s' < scripts/audit_collect.sh
# Результат: каталог /root/audit-<дата>/ с текстовыми файлами и архив /root/audit-<дата>.tgz.
# Дальше архив забирается scp и передаётся аудитору (Google Drive, приватный репозиторий).
set -u
STAMP=$(date +%Y%m%d-%H%M)
OUT=/root/audit-$STAMP
mkdir -p "$OUT"
log() { echo "[$(date +%H:%M:%S)] $*"; }
run() { # run <имя файла> <команда...>
  local name=$1; shift
  log "$name"
  { echo "### $*"; echo; "$@"; } > "$OUT/$name.txt" 2>&1 || echo "EXIT $?" >> "$OUT/$name.txt"
}

# 1. Google Ads: сплошной срез (скрипты уже лежат в /root, все read-only)
for s in final_audit audit2 precheck qs2 gap lp_rel land overlap convsplit goals budg serving groups ads_check; do
  [ -f /root/$s.cjs ] && run "ads_$s" node /root/$s.cjs
done
[ -f /root/sat-analytics/deep_audit.cjs ] && run ads_deep_audit node /root/sat-analytics/deep_audit.cjs
[ -f /root/sat-analytics/qs_report.cjs ] && run ads_qs_report node /root/sat-analytics/qs_report.cjs

# 2. Merchant Center
[ -f /root/mc_api.cjs ] && run mc_status node /root/mc_api.cjs status
[ -f /root/mc_scorecard_full.cjs ] && run mc_scorecard node /root/mc_scorecard_full.cjs

# 3. Прод-база: контрольные числа и списки без персональных данных
PSQL="sudo -u postgres psql satsolutions -X -A -F $'\t'"
run db_counts $PSQL -c "select 'products' k, count(*) from products union all select 'published', count(*) from products where published union all select 'published_no_price', count(*) from products where published and coalesce(price,0)=0 union all select 'published_no_cover', count(*) from products where published and coalesce(\"coverImageUrl\",'')='' union all select 'categories', count(*) from categories union all select 'brands', count(*) from brands union all select 'reviews_total', count(*) from reviews union all select 'reviews_approved', count(*) from reviews where status='APPROVED' union all select 'portfolio', count(*) from portfolio_projects"
run db_longread_keys $PSQL -c "select key, length(content) from site_pages where key like 'category:%' order by key"
run db_products_seo $PSQL -c "select slug, published, price, \"inStock\", length(description) desc_len, coalesce(length(\"seoTitle\"),0) seo_t, coalesce(length(\"seoDescription\"),0) seo_d, \"modelCode\" ~ '\\s' model_has_space, coalesce(array_length(\"galleryImageUrls\",1),0) gallery, \"updatedAt\" from products order by slug"
run db_categories $PSQL -c "select c.slug, c.name, count(p.id) products from categories c left join products p on p.\"categoryId\"=c.id and p.published group by c.slug, c.name order by c.name"
run db_brands $PSQL -c "select b.slug, b.name, b.published, count(p.id) products from brands b left join products p on p.\"brandId\"=b.id and p.published group by b.slug, b.name, b.published order by b.name"
run db_site_pages $PSQL -c "select key, \"updatedAt\" from site_pages order by key"

# 4. Файлы: тяжёлые картинки и дубли обложек
run uploads_heavy find /var/www/satweb/apps/api/uploads -type f -size +150k -printf '%s\t%p\n'
run uploads_summary bash -c 'for d in /var/www/satweb/apps/api/uploads/*/; do printf "%s\t%s files\t%s\n" "$d" "$(find "$d" -type f | wc -l)" "$(du -sh "$d" | cut -f1)"; done'
[ -f /root/dup_covers.py ] && run uploads_dup_covers python3 /root/dup_covers.py

# 5. Логи: коды ответа и боты за две недели, ошибки приложения
run nginx_status_codes bash -c 'zcat -f /var/log/nginx/access.log* 2>/dev/null | awk "{print \$9}" | sort | uniq -c | sort -rn | head -20'
run nginx_404_top bash -c 'zcat -f /var/log/nginx/access.log* 2>/dev/null | awk "\$9==404 {print \$7}" | sort | uniq -c | sort -rn | head -200'
run nginx_5xx_top bash -c 'zcat -f /var/log/nginx/access.log* 2>/dev/null | awk "\$9>=500 {print \$9, \$7}" | sort | uniq -c | sort -rn | head -100'
run nginx_bots bash -c 'zcat -f /var/log/nginx/access.log* 2>/dev/null | grep -o -i -E "googlebot|bingbot|yandexbot|yandex|ahrefsbot|semrushbot|gptbot|claudebot|petalbot|applebot" | tr A-Z a-z | sort | uniq -c | sort -rn'
run nginx_googlebot_404 bash -c 'zcat -f /var/log/nginx/access.log* 2>/dev/null | grep -i googlebot | awk "\$9==404 {print \$7}" | sort | uniq -c | sort -rn | head -100'
run pm2_list pm2 jlist
run pm2_web_err bash -c 'tail -n 300 /root/.pm2/logs/sat-web-error.log 2>/dev/null'
run pm2_api_err bash -c 'tail -n 300 /root/.pm2/logs/sat-api-error.log 2>/dev/null'
run robots_static cat /var/www/satweb-static/robots.txt

# 6. Живой сайт: карты и коды ответа корней локалей
UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36'
for s in sitemap sitemap-pages sitemap-catalog sitemap-products sitemap-content image-sitemap; do
  log "sitemap $s"; curl -sS -A "$UA" "https://satsolutions.uz/$s.xml" -o "$OUT/$s.xml"
done
run sitemap_counts bash -c "for f in $OUT/sitemap*.xml $OUT/image-sitemap.xml; do printf '%s\t%s\n' \"\$(basename \$f)\" \"\$(grep -o '<loc>' \$f | wc -l)\"; done"
run live_locale_roots bash -c "for p in / /uz /en /tr /zh /solutions/cctv /products/type/ip-kamery /catalog/hikvision /blog /faq; do printf '%s\t' \$p; curl -sS -o /dev/null -w '%{http_code}\t%{redirect_url}\t%{time_total}\n' -A '$UA' https://satsolutions.uz\$p; done"

# 7. Индексация и скорость через уже настроенные инструменты монитора
if [ -d /var/www/satweb/apps/api ]; then
  ( cd /var/www/satweb/apps/api && run index_check npx tsx src/monitor/indexCheck.ts )
  [ -f /root/psi3.mts ] && ( cd /var/www/satweb/apps/api && run psi npx tsx /root/psi3.mts )
  [ -f /root/gindex_daily.log ] && run gindex_log tail -n 200 /root/gindex_daily.log
fi

tar czf "$OUT.tgz" -C /root "$(basename "$OUT")"
log "готово: $OUT.tgz ($(du -sh "$OUT.tgz" | cut -f1))"
