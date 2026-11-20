// Ошибки в браузере → Sentry. Модуль грузится отдельным чанком, когда браузер простаивает,
// чтобы не трогать LCP/TBT (PSI держим ~98). Ошибки первых секунд до загрузки теряются — осознанно.
// Только боевой домен: локальная сборка и превью ничего не шлют.
import { installBuildSkewGuard } from "./lib/buildSkew";

// Рассинхрон сборок (reading 'call' / ChunkLoadError) → одна перезагрузка страницы, см. lib/buildSkew.ts.
// Ставится сразу, до Sentry: ошибка приходит при предзагрузке ссылок в первые секунды.
if (process.env.NODE_ENV === "production") installBuildSkewGuard();

if (typeof window !== "undefined" && /(^|\.)satsolutions\.uz$/.test(window.location.hostname)) {
  const start = () =>
    import("./lib/sentryClient").then((m) => m.startSentry()).catch(() => {});
  if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 5000 });
  else setTimeout(start, 3000);
}
