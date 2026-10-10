// Грузится лениво из instrumentation-client.ts. Именованный импорт, а не `import("@sentry/nextjs")`
// целиком: иначе в чанк уезжают Replay, Feedback и трейсинг (~300 КБ gzip вместо нужного минимума).
import { init } from "@sentry/nextjs";
import { SENTRY_DATA_COLLECTION, SENTRY_DSN, scrubEvent } from "./sentryShared";

export function startSentry() {
  init({
    dsn: SENTRY_DSN,
    environment: "production",
    dataCollection: SENTRY_DATA_COLLECTION,
    beforeSend: scrubEvent,
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "ResizeObserver loop completed with undelivered notifications",
      "Non-Error promise rejection captured",
      /^Script error\.?$/,
    ],
    // Расширения браузера и чужие счётчики — не наши ошибки.
    denyUrls: [
      /^(chrome|moz|safari(-web)?)-extension:/i,
      /extensions\//i,
      /mc\.yandex\.ru/i,
      /googletagmanager\.com|google-analytics\.com|googleadservices\.com/i,
    ],
  });
}
