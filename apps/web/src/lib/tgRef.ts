// Метка рекламного клика для обращений через Telegram (решение владельца 16.11.2026).
// В ссылку на личный аккаунт параметр не передать, а в ссылку на бота (?start=) влезает до
// 64 знаков — метка клика Google длиннее. Поэтому посетителю С МЕТКОЙ клика ссылка Telegram
// подменяется на бота с коротким кодом, а пара «код → метка» уходит в API сайта; бот по коду
// из /start g_<код> забирает метку и отдаёт её в CRM. Посетителям без метки ссылка не меняется.

/** Личный рабочий аккаунт — только его ссылки подменяем (не «поделиться», не каналы). */
const SALES_LINK_RE = /^https?:\/\/(?:t\.me|telegram\.me)\/sales_satsolutions\/?(?:[?#].*)?$/i;
const BOT_USERNAME = "SAT_zayavki_online_bot";
const STORAGE_KEY = "sat_tg_ref";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const CODE_LENGTH = 12;

export function isSalesTelegramLink(href: string): boolean {
  return SALES_LINK_RE.test(href.trim());
}

function newCode(): string {
  const bytes = new Uint8Array(CODE_LENGTH);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") crypto.getRandomValues(bytes);
  else for (let i = 0; i < CODE_LENGTH; i++) bytes[i] = Math.floor(Math.random() * 256);
  let out = "";
  for (let i = 0; i < CODE_LENGTH; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

/** Один код на вкладку и метку клика: повторные нажатия не плодят записи в журнале. */
function codeFor(gclid: string): string {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
    if (saved && saved.gclid === gclid && /^[A-Za-z0-9]{8,16}$/.test(String(saved.code))) return saved.code;
  } catch {
    /* хранилище недоступно — просто новый код */
  }
  const code = newCode();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ code, gclid }));
  } catch {
    /* приватный режим — код живёт до перезагрузки страницы */
  }
  return code;
}

const sent = new Set<string>(); // коды, уже отправленные с этой загрузки страницы

function sendRef(code: string, gclid: string) {
  if (sent.has(code)) return;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4005";
  const url = `${base}/tg-ref`;
  // Строка → text/plain: «простой» запрос, уходит без предварительного OPTIONS и успевает до перехода
  const body = JSON.stringify({ token: code, gclid, page: window.location.pathname.slice(0, 300) });
  let queued = false;
  try {
    queued = typeof navigator.sendBeacon === "function" && navigator.sendBeacon(url, body);
  } catch {
    queued = false;
  }
  if (!queued) {
    // sendBeacon нет или очередь браузера переполнена — тот же запрос через fetch с keepalive
    fetch(url, { method: "POST", body, keepalive: true, headers: { "content-type": "text/plain;charset=UTF-8" } }).catch(() => {});
  }
  sent.add(code);
}

/** Ссылка на бота с коротким кодом для посетителя с меткой клика. Код отправляется в API сайта. */
export function adTelegramLink(gclid: string): string {
  const code = codeFor(gclid);
  sendRef(code, gclid);
  return `https://t.me/${BOT_USERNAME}?start=g_${code}`;
}
