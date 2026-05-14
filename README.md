# SAT Solutions (Node.js + Next.js + Sequelize + PostgreSQL)

Проект состоит из 3 приложений:

- `apps/api` — backend на Node.js (Express), **Sequelize + PostgreSQL**, JWT auth, CRUD.
- `apps/web` — публичный сайт (Next.js) — **SEO/SSR/SSG**.
- `apps/admin` — админ‑панель (Next.js) — управление продуктами/новостями/категориями.

## Требования

- Node.js 20+
- PostgreSQL (локально)

## Быстрый старт

1) Создайте БД и пользователя в PostgreSQL (пример):

```bash
psql -U postgres
```

Внутри `psql`:

```sql
CREATE USER satsolutions WITH PASSWORD 'satsolutions';
CREATE DATABASE satsolutions OWNER satsolutions;
```

2) Скопируйте env файлы:

- `apps/api/.env.example` → `apps/api/.env`
- `apps/web/.env.example` → `apps/web/.env`
- `apps/admin/.env.example` → `apps/admin/.env`

3) Проверьте `DATABASE_URL` в `apps/api/.env`:

- **по умолчанию**: `postgres://satsolutions:satsolutions@localhost:5432/satsolutions`

4) Установите зависимости:

```bash
npm install
```

5) Примените миграции и создайте admin пользователя (seed):

```bash
npm run migrate -w @satsolutions/api
npm run seed -w @satsolutions/api
```

6) Запустите dev:

```bash
npm run dev
```

## URL (по умолчанию)

- API: `http://localhost:4000`
- WEB: `http://localhost:3000`
- ADMIN: `http://localhost:3001`

## SEO

Публичный сайт на Next.js использует SSR/SSG: `metadata`, `sitemap`, `robots`, canonical, OpenGraph/Twitter meta.
Идеальные показатели зависят от контента и Lighthouse‑аудита, но технически проект сделан максимально SEO‑friendly.

