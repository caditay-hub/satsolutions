import * as Sentry from "@sentry/nextjs";
import { SENTRY_DSN, SENTRY_DATA_COLLECTION, scrubEvent } from "./lib/sentryShared";

// Ошибки серверного рендера Next → Sentry (проект satsolutions-web). Только на проде:
// локальный next dev ничего не шлёт. Edge (middleware) не подключаем — лишний вес бандла.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: "production",
    dataCollection: SENTRY_DATA_COLLECTION,
    beforeSend: scrubEvent,
  });
}

export const onRequestError = Sentry.captureRequestError;
