// Получение refresh-токена для Google Business Profile API.
//
// Запускать ЛОКАЛЬНО (на компьютере владельца), а не на сервере: в браузере нужно
// войти в тот Google-аккаунт, у которого есть права на карточку SAT Solutions.
// Пароль вводит владелец в окне Google — скрипт его не видит и не сохраняет.
//
//   node scripts/gbp/auth.cjs                 # печатает ссылку, ждёт подтверждения
//
// Результат: файл gbp_oauth.json рядом со скриптом. Его нужно скопировать на сервер:
//   scp scripts/gbp/gbp_oauth.json satweb-prod:/root/.gbp_oauth.json
// и удалить локальную копию.
//
// Предварительно в Google Cloud Console (проект тот же, что у Ads):
//   1. включить «My Business Business Information API» и «My Business Account Management API»;
//   2. в OAuth-клиенте добавить разрешённый адрес http://localhost:8765/callback;
//   3. на экране согласия добавить свой аккаунт в тестовые пользователи (если режим «Тестирование»);
//   4. при первом обращении Google может попросить заявку на доступ к Business Profile API —
//      квота по умолчанию нулевая, одобрение приходит письмом.
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL, URLSearchParams } = require("url");

const PORT = 8765;
const REDIRECT = `http://localhost:${PORT}/callback`;
const SCOPE = "https://www.googleapis.com/auth/business.manage";
const OUT = path.join(__dirname, "gbp_oauth.json");

// client_id/secret берём из переменных окружения или из файла рядом (client.json),
// чтобы не хранить их в репозитории.
function credentials() {
  if (process.env.GBP_CLIENT_ID && process.env.GBP_CLIENT_SECRET) {
    return { client_id: process.env.GBP_CLIENT_ID, client_secret: process.env.GBP_CLIENT_SECRET };
  }
  const local = path.join(__dirname, "client.json");
  if (fs.existsSync(local)) {
    const j = JSON.parse(fs.readFileSync(local, "utf8"));
    const c = j.installed || j.web || j;
    return { client_id: c.client_id, client_secret: c.client_secret };
  }
  console.error(
    "Нет client_id/client_secret.\n" +
      "Положите рядом файл scripts/gbp/client.json (скачивается кнопкой «Скачать JSON»\n" +
      "у OAuth-клиента в Google Cloud Console) или задайте GBP_CLIENT_ID и GBP_CLIENT_SECRET."
  );
  process.exit(1);
}

function post(host, pathname, body) {
  return new Promise((resolve, reject) => {
    const data = new URLSearchParams(body).toString();
    const req = https.request(
      { host, path: pathname, method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(data) } },
      (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          const text = Buffer.concat(chunks).toString("utf8");
          try { resolve({ status: res.statusCode, json: JSON.parse(text) }); } catch { resolve({ status: res.statusCode, json: null, text }); }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

const { client_id, client_secret } = credentials();

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  }).toString();

const server = http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://localhost:${PORT}`);
  if (u.pathname !== "/callback") { res.writeHead(404).end(); return; }
  const code = u.searchParams.get("code");
  const err = u.searchParams.get("error");
  if (err || !code) {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("Доступ не выдан: " + (err || "нет кода"));
    server.close();
    return;
  }
  const r = await post("oauth2.googleapis.com", "/token", {
    code, client_id, client_secret, redirect_uri: REDIRECT, grant_type: "authorization_code",
  });
  if (r.status !== 200 || !r.json?.refresh_token) {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("Google не вернул refresh_token, смотрите консоль.");
    console.error("Ошибка обмена кода:", r.status, r.text || JSON.stringify(r.json).slice(0, 300));
    server.close();
    return;
  }
  fs.writeFileSync(OUT, JSON.stringify({ client_id, client_secret, refresh_token: r.json.refresh_token }, null, 2));
  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" }).end("Готово. Токен сохранён, окно можно закрыть.");
  console.log("\nТокен сохранён:", OUT);
  console.log("Скопируйте его на сервер и удалите локальную копию:");
  console.log("  scp scripts/gbp/gbp_oauth.json satweb-prod:/root/.gbp_oauth.json");
  server.close();
});

server.listen(PORT, () => {
  console.log("Откройте ссылку в браузере и войдите в аккаунт с правами на карточку:\n");
  console.log(authUrl + "\n");
  console.log(`Жду ответа на ${REDIRECT} …`);
});
