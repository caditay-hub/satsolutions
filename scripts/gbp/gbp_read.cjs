// Полная читалка карточки Google Business Profile (только чтение, ничего не меняет).
// Токен: /root/.gbp_oauth.json. Запуск: node gbp_read.cjs [часть названия, по умолчанию "SAT"]
const https = require("https");
const fs = require("fs");
const TOKEN_FILE = "/root/.gbp_oauth.json";
const FILTER = (process.argv[2] || "SAT").toLowerCase();
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
        try { resolve({ status: res.statusCode, json: JSON.parse(text), text }); } catch { resolve({ status: res.statusCode, json: null, text }); }
      });
    });
    req.on("error", reject);
    if (data) req.write(data);
    req.end();
  });
}
async function token() {
  const body = new URLSearchParams({ client_id: oauth.client_id, client_secret: oauth.client_secret, refresh_token: oauth.refresh_token, grant_type: "refresh_token" }).toString();
  const r = await request("oauth2.googleapis.com", "/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body });
  if (!r.json?.access_token) { console.error("токен:", r.status, r.text.slice(0, 300)); process.exit(1); }
  return r.json.access_token;
}
(async () => {
  const H = { Authorization: `Bearer ${await token()}` };
  const acc = await request("mybusinessaccountmanagement.googleapis.com", "/v1/accounts", { headers: H });
  const accounts = acc.json?.accounts || [];
  const fields = "name,title,languageCode,storeCode,categories,storefrontAddress,phoneNumbers,websiteUri,regularHours,specialHours,serviceArea,labels,latlng,openInfo,metadata,profile,relationshipData,moreHours,serviceItems,adWordsLocationExtensions";
  for (const a of accounts) {
    const loc = await request("mybusinessbusinessinformation.googleapis.com", `/v1/${a.name}/locations?readMask=${encodeURIComponent(fields)}&pageSize=100`, { headers: H });
    if (loc.status !== 200) { console.error("locations:", loc.status, loc.text.slice(0, 400)); continue; }
    for (const l of loc.json.locations || []) {
      if (!(l.title || "").toLowerCase().includes(FILTER)) continue;
      console.log(JSON.stringify(l, null, 2));
      // атрибуты — отдельный вызов
      const attrs = await request("mybusinessbusinessinformation.googleapis.com", `/v1/${l.name}/attributes`, { headers: H });
      console.log("ATTRIBUTES:", attrs.status, attrs.status === 200 ? JSON.stringify(attrs.json, null, 1).slice(0, 4000) : attrs.text.slice(0, 300));
    }
  }
})();
