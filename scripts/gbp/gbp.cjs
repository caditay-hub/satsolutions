// Работа с карточкой Google Business Profile: показать данные, поправить ссылку на сайт.
// Токен: /root/.gbp_oauth.json (получается скриптом scripts/gbp/auth.cjs на компьютере владельца).
//
//   node gbp.cjs                       # аккаунты, карточки, текущая ссылка на сайт — только чтение
//   node gbp.cjs --set-website URL     # сухой прогон: покажет, что изменится
//   node gbp.cjs --set-website URL --apply    # записать
//
// Правка ссылки нужна из-за utm-меток: адрес с хвостом Google индексирует как
// отдельную страницу, и она конкурирует с главной в выдаче.
const https = require("https");
const fs = require("fs");

const TOKEN_FILE = "/root/.gbp_oauth.json";
const APPLY = process.argv.includes("--apply");
const setIdx = process.argv.indexOf("--set-website");
const NEW_SITE = setIdx > -1 ? process.argv[setIdx + 1] : null;

if (!fs.existsSync(TOKEN_FILE)) {
  console.error(`Нет ${TOKEN_FILE}. Сначала получите токен: node scripts/gbp/auth.cjs (локально).`);
  process.exit(1);
}
const oauth = JSON.parse(fs.readFileSync(TOKEN_FILE, "utf8"));

function request(host, path, { method = "GET", headers = {}, body } = {}) {
  return new Promise((resolve, reject) => {
    const data = body === undefined ? null : typeof body === "string" ? body : JSON.stringify(body);
    const h = { ...headers };
    if (data) h["Content-Length"] = Buffer.byteLength(data);
    const req = https.request({ host, path, method, headers: h }, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        try { resolve({ status: res.statusCode, json: JSON.parse(text), text }); }
        catch { resolve({ status: res.statusCode, json: null, text }); }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}

async function token() {
  const body = new URLSearchParams({
    client_id: oauth.client_id, client_secret: oauth.client_secret,
    refresh_token: oauth.refresh_token, grant_type: "refresh_token",
  }).toString();
  const r = await request("oauth2.googleapis.com", "/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body,
  });
  if (!r.json?.access_token) { console.error("Не удалось обновить токен:", r.status, r.text.slice(0, 300)); process.exit(1); }
  return r.json.access_token;
}

(async () => {
  const at = await token();
  const H = { Authorization: `Bearer ${at}` };

  const acc = await request("mybusinessaccountmanagement.googleapis.com", "/v1/accounts", { headers: H });
  if (acc.status !== 200) {
    console.error("Аккаунты недоступны:", acc.status, acc.text.slice(0, 400));
    console.error("\nЧаще всего это значит: API не включён в проекте либо не одобрена заявка на доступ к Business Profile API.");
    process.exit(1);
  }
  const accounts = acc.json.accounts || [];
  console.log("Аккаунты:", accounts.map((a) => `${a.name} (${a.accountName})`).join(", ") || "нет");

  for (const a of accounts) {
    const fields = "name,title,websiteUri,phoneNumbers,storefrontAddress,regularHours,metadata";
    const loc = await request(
      "mybusinessbusinessinformation.googleapis.com",
      `/v1/${a.name}/locations?readMask=${encodeURIComponent(fields)}&pageSize=100`,
      { headers: H }
    );
    if (loc.status !== 200) { console.error("  карточки недоступны:", loc.status, loc.text.slice(0, 300)); continue; }
    for (const l of loc.json.locations || []) {
      console.log(`\nКарточка: ${l.title}`);
      console.log(`  id:     ${l.name}`);
      console.log(`  сайт:   ${l.websiteUri || "не задан"}`);
      console.log(`  телефон:${(l.phoneNumbers?.primaryPhone) || "—"}`);

      if (!NEW_SITE) continue;
      if (l.websiteUri === NEW_SITE) { console.log("  ссылка уже такая — правка не нужна"); continue; }
      console.log(`  правка: ${l.websiteUri} → ${NEW_SITE}`);
      if (!APPLY) { console.log("  (сухой прогон, для записи добавьте --apply)"); continue; }
      const upd = await request(
        "mybusinessbusinessinformation.googleapis.com",
        `/v1/${l.name}?updateMask=websiteUri`,
        { method: "PATCH", headers: { ...H, "Content-Type": "application/json" }, body: { websiteUri: NEW_SITE } }
      );
      console.log("  результат:", upd.status, upd.status === 200 ? "записано" : upd.text.slice(0, 300));
    }
  }
})();
