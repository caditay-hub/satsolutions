# Instagram-конвейер: что уже работает и как включить автопубликацию

## Уже работает (после деплоя 06.07)
В боте **sat-monitor-bot** команда:
- `/igpost` — случайный товар: бот присылает готовую карточку (фирменный стиль) + подпись uz+ru
- `/igpost <slug>` — конкретный товар (slug из URL страницы товара)
- Кнопки: **✅ Опубликовать** · **🔁 Другой товар** · **✖️ Отмена**

Пока Meta-токен не настроен: карточку и текст бот присылает — можно сохранить и запостить руками.
С токеном кнопка «Опубликовать» будет постить в Instagram сама.

## Как включить автопубликацию (15 минут, один раз)

### Шаг 1. Бизнес-аккаунт + страница Facebook
1. В приложении Instagram: Настройки → Аккаунт → **Переключиться на профессиональный** → Бизнес
   (категория: Товары/услуги). Если уже бизнес — пропусти.
2. Привяжи страницу Facebook: Настройки → Центр аккаунтов → добавить страницу.
   Если страницы «SAT Solutions» на Facebook нет — создай (Меню → Страницы → Создать, название SAT Solutions).

### Шаг 2. Приложение Meta
1. **developers.facebook.com** → My Apps → **Create App** → тип **Business** → имя `SAT Poster`
2. В приложении: Add Product → **Instagram Graph API** (Set up)

### Шаг 3. Токен
1. **developers.facebook.com/tools/explorer** (Graph API Explorer):
   - Application: `SAT Poster`
   - User or Page: **Get User Access Token**
   - Permissions (добавить): `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `business_management`
   - Generate Access Token → разрешить, выбрав страницу SAT Solutions
2. Токен короткоживущий → обменять на длинный (60 дней):
   открой в браузере (подставь свои значения из Settings → Basic приложения):
   `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=<APP_ID>&client_secret=<APP_SECRET>&fb_exchange_token=<КОРОТКИЙ_ТОКЕН>`
   → в ответе `access_token` — это длинный токен.
3. Узнать IG user id: в Graph Explorer запрос `me/accounts` → id страницы → запрос
   `<PAGE_ID>?fields=instagram_business_account` → `instagram_business_account.id` — это igUserId.

### Шаг 4. Передать мне (без чата!)
Создай на рабочем столе файл `meta_token.txt` с содержимым:
```json
{"accessToken": "<длинный токен>", "igUserId": "<id>"}
```
Скажи «токен готов» — я заберу его на сервер (/root/.meta_token) и удалю локальный файл.
Дальше кнопка «Опубликовать» работает. Токен живёт 60 дней — за неделю до истечения напомню обновить.

## Параллельно: два фикса профиля (руками, 2 минуты)
1. **Адрес в био**: «Glinka 41 A» → `Katta Darxon ko'chasi 5, Tashkent` (везде уже новый адрес — Google, сайт, каталоги)
2. **Ссылка**: `satsolutions.uz?utm_source=instagram` (для отслеживания переходов в GA4)

## Ритм после запуска
- 2–3 карточки товаров в неделю через /igpost (можно slug горячих товаров: камеры, комплекты)
- Живые фото объектов/монтажа — снимаете сами, это главный контент
- Позже: cron-напоминание в бот «пора постить» — скажешь, включу
