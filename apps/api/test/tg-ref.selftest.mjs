// Самопроверка журнала кодов кнопки Telegram (routes/telegramClick.ts) на ЛОКАЛЬНОМ API.
// Запуск (API поднят на тестовой базе, тот же JWT_SECRET):
//   BASE=http://localhost:4105 JWT_SECRET=... DATABASE_URL=postgres://.../satweb_tgref_test node test/tg-ref.selftest.mjs
// Работает только с localhost и только с базой, имя которой кончается на _test: в рабочую базу
// и в рабочий API скрипт не пишет. Обращений в CRM не создаёт — CRM здесь не участвует вовсе.
import jwt from "jsonwebtoken";
import pg from "pg";

const BASE = process.env.BASE || "http://localhost:4105";
const { JWT_SECRET, DATABASE_URL } = process.env;
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(BASE)) throw new Error("BASE должен быть локальным адресом");
if (!JWT_SECRET) throw new Error("нужен JWT_SECRET запущенного локального API");
if (!DATABASE_URL || !/_test(\?|$)/.test(DATABASE_URL)) throw new Error("DATABASE_URL должен указывать на базу *_test");

let failed = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "  ок  " : "ОШИБКА"} ${name}${detail ? " — " + detail : ""}`);
  if (!ok) failed++;
}
const rnd = (n) => Array.from({ length: n }, () => "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789"[Math.floor(Math.random() * 56)]).join("");
// так же подписывает запросы бот сайта (mintToken в /root/sat-web-bot/index.js)
const botToken = (role = "ADMIN", secret = JWT_SECRET) =>
  jwt.sign({ sub: "web-bot", role, email: "bot@satsolutions.uz" }, secret, { expiresIn: "5m" });
const post = (body, headers = { "content-type": "text/plain;charset=UTF-8" }) =>
  fetch(`${BASE}/tg-ref`, { method: "POST", headers, body: typeof body === "string" ? body : JSON.stringify(body) });
const get = (token, auth) =>
  fetch(`${BASE}/internal/tg-ref/${token}`, { headers: auth ? { Authorization: `Bearer ${auth}` } : {} });

const db = new pg.Client({ connectionString: DATABASE_URL });
await db.connect();
const GCLID = "TEST-gclid_" + rnd(40) + ".x"; // формат как у настоящей метки: буквы, цифры, _ - .

// 1. Приём кода так, как его шлёт navigator.sendBeacon (text/plain со строкой JSON)
const code = rnd(12);
let r = await post({ token: code, gclid: GCLID, page: "/uz/solutions/video" });
check("приём кода (text/plain, как sendBeacon)", r.status === 204, `HTTP ${r.status}`);
let row = (await db.query('select * from telegram_clicks where token = $1', [code])).rows[0];
check("запись в журнале: метка, страница, время создания", !!row && row.gclid === GCLID && row.page === "/uz/solutions/video" && !!row.createdAt && row.usedAt === null);

// 2. Приём того же запроса как application/json
const code2 = rnd(12);
r = await post({ token: code2, gclid: GCLID, page: "/" }, { "content-type": "application/json" });
check("приём кода (application/json)", r.status === 204, `HTTP ${r.status}`);

// 3. Повтор того же кода запись не меняет
r = await post({ token: code, gclid: "OTHER-gclid_" + rnd(30), page: "/other" });
row = (await db.query('select * from telegram_clicks where token = $1', [code])).rows[0];
check("повтор кода не перезаписывает метку", r.status === 204 && row.gclid === GCLID && row.page === "/uz/solutions/video");

// 4. Проверка формата
r = await post({ token: rnd(12), gclid: "short" });
check("короткая метка отклонена", r.status === 400, `HTTP ${r.status}`);
r = await post({ token: rnd(12), gclid: "bad gclid with spaces <script>" });
check("метка с недопустимыми знаками отклонена", r.status === 400, `HTTP ${r.status}`);
r = await post({ token: "abc", gclid: GCLID });
check("слишком короткий код отклонён", r.status === 400, `HTTP ${r.status}`);
r = await post({ token: rnd(17), gclid: GCLID });
check("код длиннее 16 знаков отклонён", r.status === 400, `HTTP ${r.status}`);
r = await post({ token: "ab_cd-ef.gh!", gclid: GCLID });
check("код с недопустимыми знаками отклонён", r.status === 400, `HTTP ${r.status}`);
r = await post("не json");
check("тело не JSON отклонено", r.status === 400, `HTTP ${r.status}`);
const code3 = rnd(12);
r = await post({ token: code3, gclid: GCLID, page: "https://evil.example/?gclid=1" });
row = (await db.query('select page from telegram_clicks where token = $1', [code3])).rows[0];
check("страница не путём сайта — не сохраняется", r.status === 204 && row && row.page === null);

// 5. Выдача метки боту
r = await get(code);
check("без подписи — отказ", r.status === 401, `HTTP ${r.status}`);
r = await get(code, botToken("ADMIN", "wrong-secret-wrong-secret"));
check("чужая подпись — отказ", r.status === 401, `HTTP ${r.status}`);
r = await get(code, botToken("EDITOR"));
check("подпись верная, роль не ADMIN — отказ", r.status === 403, `HTTP ${r.status}`);
r = await get(code, botToken());
let j = r.ok ? await r.json() : {};
check("подпись бота — метка выдана", r.status === 200 && j.gclid === GCLID && j.page === "/uz/solutions/video", `HTTP ${r.status}`);
row = (await db.query('select "usedAt" from telegram_clicks where token = $1', [code])).rows[0];
const firstUsed = row.usedAt;
check("время использования записано", !!firstUsed);
r = await get(code, botToken());
j = r.ok ? await r.json() : {};
row = (await db.query('select "usedAt" from telegram_clicks where token = $1', [code])).rows[0];
check("повторный запрос: метка та же, время первого использования не меняется", r.status === 200 && j.gclid === GCLID && +row.usedAt === +firstUsed);
r = await get(rnd(12), botToken());
check("неизвестный код — 404", r.status === 404, `HTTP ${r.status}`);
r = await get("bad!code", botToken());
check("код неверного формата — 400", r.status === 400, `HTTP ${r.status}`);

// 6. Срок 90 дней: запись старше срока боту не выдаётся (удаляет её чистка при старте API и раз в сутки)
const oldCode = "OLD" + rnd(9);
await db.query('insert into telegram_clicks (token, gclid, page, "createdAt") values ($1, $2, $3, now() - interval \'91 days\')', [oldCode, GCLID, "/old"]);
r = await get(oldCode, botToken());
check("запись старше 90 дней не выдаётся", r.status === 404, `HTTP ${r.status}`);
const freshCode = "NEW" + rnd(9);
await db.query('insert into telegram_clicks (token, gclid, page, "createdAt") values ($1, $2, $3, now() - interval \'89 days\')', [freshCode, GCLID, "/fresh"]);
r = await get(freshCode, botToken());
check("запись 89 дней выдаётся", r.status === 200, `HTTP ${r.status}`);
console.log(`\nСтарая запись ${oldCode} оставлена в базе: после перезапуска API её должна удалить чистка.`);

// 7. Ограничение частоты проверяется отдельно: локальные адреса под лимит не попадают (как у форм).
await db.end();
console.log(failed ? `\nНЕ ПРОШЛО: ${failed}` : "\nВсе проверки прошли");
process.exit(failed ? 1 : 0);
