#!/usr/bin/env bash
#
# SEO check for the live SAT Solutions site.
#
# Run from any machine with curl (your laptop or the server itself):
#   ./deploy/check-seo.sh                          # checks https://satsolutions.uz
#   ./deploy/check-seo.sh https://satsolutions.uz  # explicit URL
#   ./deploy/check-seo.sh http://localhost:3000    # on the server, against the app
#
# Send the full output back for analysis.

set -uo pipefail

BASE_URL="${1:-https://satsolutions.uz}"
BASE_URL="${BASE_URL%/}"
UA_BROWSER="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
UA_GOOGLEBOT="Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

hr() { printf '\n========== %s ==========\n' "$1"; }

status_of() { # url user-agent
  curl -sS -o /dev/null -w "%{http_code}" -A "$2" --max-time 20 -L "$1" 2>/dev/null || echo "ERR"
}

hr "1. Доступность (код ответа)"
printf "%-28s браузер: %s   Googlebot: %s\n" "/" \
  "$(status_of "${BASE_URL}/" "${UA_BROWSER}")" \
  "$(status_of "${BASE_URL}/" "${UA_GOOGLEBOT}")"
for p in /robots.txt /sitemap.xml /og.png /logo.png /favicon.ico; do
  printf "%-28s %s\n" "$p" "$(status_of "${BASE_URL}${p}" "${UA_BROWSER}")"
done

HTML="$(curl -sS -A "${UA_BROWSER}" --max-time 20 -L "${BASE_URL}/" 2>/dev/null)"

hr "2. Теги <head> главной страницы"
echo "${HTML}" | grep -oiE '<title>[^<]*</title>' | head -2
echo "${HTML}" | grep -oiE '<meta[^>]*name="description"[^>]*>' | head -2
echo "${HTML}" | grep -oiE '<meta[^>]*name="robots"[^>]*>' | head -2
echo "${HTML}" | grep -oiE '<link[^>]*rel="canonical"[^>]*>' | head -2
echo "${HTML}" | grep -oiE '<html[^>]*lang="[^"]*"' | head -1

hr "3. OpenGraph / Twitter"
echo "${HTML}" | grep -oiE '<meta[^>]*(og:|twitter:)[^>]*>' | head -12

hr "4. Заголовки h1"
H1_COUNT="$(echo "${HTML}" | grep -oiE '<h1[ >]' | wc -l | tr -d ' ')"
echo "Количество <h1> на главной: ${H1_COUNT} (должно быть ровно 1)"
echo "${HTML}" | grep -oiE '<h1[^>]*>[^<]*' | head -3

hr "5. Утечки localhost в HTML"
if echo "${HTML}" | grep -oE 'localhost:[0-9]+' | sort | uniq -c; then
  echo "^ НАЙДЕНЫ упоминания localhost — нужно чинить env/код"
else
  echo "OK — localhost не найден"
fi

hr "6. JSON-LD (структурированные данные)"
echo "${HTML}" | grep -oiE '<script[^>]*application/ld\+json[^>]*>.{0,400}' | head -4

hr "7. robots.txt"
curl -sS -A "${UA_BROWSER}" --max-time 20 "${BASE_URL}/robots.txt" 2>/dev/null | head -20

hr "8. sitemap.xml — домены в URL"
curl -sS -A "${UA_BROWSER}" --max-time 20 "${BASE_URL}/sitemap.xml" 2>/dev/null \
  | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g' | head -15
echo "--- домены, встречающиеся в sitemap: ---"
curl -sS -A "${UA_BROWSER}" --max-time 20 "${BASE_URL}/sitemap.xml" 2>/dev/null \
  | grep -oE 'https?://[^/<]+' | sort | uniq -c

hr "9. Редиректы и HTTPS"
echo "http -> ? :"
curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" --max-time 20 "http://${BASE_URL#*://}/" 2>/dev/null
echo "www -> ? :"
curl -sS -o /dev/null -w "%{http_code} -> %{redirect_url}\n" --max-time 20 "https://www.${BASE_URL#*://}/" 2>/dev/null

hr "Готово"
echo "Пришлите весь вывод выше для анализа."
