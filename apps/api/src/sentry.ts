import * as Sentry from "@sentry/node";

// Ошибки API → Sentry (10.10.2026; орг sat-solutions, EU, проект satsolutions-api).
// Только ловля ошибок: без трейсинга и без OpenTelemetry. Только на проде.
// Телефоны, тела запросов и cookies вырезаются до отправки — в API идут заявки и чат.
const PHONE_RE = /\+?998[\d\s\-()]{8,}|\b\d{9,}\b/g;
const scrub = (s?: string) => (s ? s.replace(PHONE_RE, "[phone]") : s);

Sentry.init({
  dsn:
    process.env.SENTRY_DSN ??
    "https://b33adc7a7910c1a806c2d735ef71193f@o4512230801670144.ingest.de.sentry.io/4512230804881488",
  enabled: process.env.NODE_ENV === "production",
  environment: "production",
  // v11 по умолчанию собирает всё, включая локальные переменные стека (телефон из заявки).
  dataCollection: {
    userInfo: false,
    cookies: false,
    httpHeaders: { request: { allow: ["user-agent", "referer", "accept-language"] }, response: false },
    httpBodies: [],
    urlQueryParams: false,
    databaseQueryData: false,
    stackFrameVariables: false,
  },
  defaultIntegrations: false,
  integrations: Sentry.getDefaultIntegrationsWithoutPerformance(),
  beforeSend(event) {
    delete event.user;
    if (event.request) {
      delete event.request.data;
      delete event.request.cookies;
      delete event.request.query_string;
      event.request.headers = {};
      event.request.url = event.request.url?.split("?")[0];
    }
    event.message = scrub(event.message);
    for (const ex of event.exception?.values ?? []) ex.value = scrub(ex.value);
    event.breadcrumbs = (event.breadcrumbs ?? []).map((b) => ({ ...b, message: scrub(b.message) }));
    return event;
  },
});

export { Sentry };
