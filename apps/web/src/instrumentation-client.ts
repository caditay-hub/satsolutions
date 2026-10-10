// Ошибки в браузере → Sentry. Модуль грузится отдельным чанком, когда браузер простаивает,
// чтобы не трогать LCP/TBT (PSI держим ~98). Ошибки первых секунд до загрузки теряются — осознанно.
// Только боевой домен: локальная сборка и превью ничего не шлют.
if (typeof window !== "undefined" && /(^|\.)satsolutions\.uz$/.test(window.location.hostname)) {
  const start = () =>
    import("./lib/sentryClient").then((m) => m.startSentry()).catch(() => {});
  if ("requestIdleCallback" in window) window.requestIdleCallback(start, { timeout: 5000 });
  else setTimeout(start, 3000);
}
