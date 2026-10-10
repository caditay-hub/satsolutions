import type { ErrorEvent } from "@sentry/nextjs";

// v11 по умолчанию собирает всё: пользователя, cookies, тела запросов, локальные переменные
// стека (а в них — телефон из заявки). Выключаем явно; scrubEvent ниже — вторая линия защиты.
export const SENTRY_DATA_COLLECTION = {
  userInfo: false,
  cookies: false,
  httpHeaders: { request: { allow: ["user-agent", "referer", "accept-language"] }, response: false },
  httpBodies: [],
  urlQueryParams: false,
  databaseQueryData: false,
  stackFrameVariables: false,
};

// Sentry (10.10.2026): DSN публичный по своей природе — он и так уходит в браузер.
// Организация sat-solutions, регион EU (de.sentry.io), проект satsolutions-web.
export const SENTRY_DSN =
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://555655ec27b95f884ab32fe9651c86f5@o4512230801670144.ingest.de.sentry.io/4512230804750416";

// Боты рендерят JS и сыплют своими ошибками — на бесплатном лимите (5000/мес) это шум.
const BOT_UA = /bot|crawler|spider|crawl|slurp|lighthouse|headless|google-inspectiontool|yandex|bytespider/i;

// Телефоны и длинные номера из заявок и чата не должны попасть в Sentry ни в каком виде.
const PHONE_RE = /\+?998[\d\s\-()]{8,}|\b\d{9,}\b/g;
const scrubText = (s?: string) => (s ? s.replace(PHONE_RE, "[phone]") : s);
const stripQuery = (url?: string) => (url ? url.split("?")[0] : url);

export function scrubEvent(event: ErrorEvent): ErrorEvent | null {
  if (typeof navigator !== "undefined" && BOT_UA.test(navigator.userAgent)) return null;
  const ua = event.request?.headers?.["user-agent"] ?? event.request?.headers?.["User-Agent"];
  if (ua && BOT_UA.test(ua)) return null;

  delete event.user;
  if (event.request) {
    delete event.request.data;
    delete event.request.cookies;
    delete event.request.query_string;
    event.request.url = stripQuery(event.request.url);
    const h = event.request.headers ?? {};
    event.request.headers = Object.fromEntries(
      Object.entries(h).filter(([k]) => /^(user-agent|referer|accept-language)$/i.test(k)),
    );
  }
  event.message = scrubText(event.message);
  for (const ex of event.exception?.values ?? []) ex.value = scrubText(ex.value);
  event.breadcrumbs = (event.breadcrumbs ?? [])
    .filter((b) => b.category !== "ui.input")
    .map((b) => ({
      ...b,
      message: scrubText(b.message),
      data: b.data?.url ? { ...b.data, url: stripQuery(String(b.data.url)) } : b.data,
    }));
  return event;
}
