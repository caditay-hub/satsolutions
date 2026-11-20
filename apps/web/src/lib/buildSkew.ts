// Рассинхрон сборок в браузере посетителя (Sentry SATSOLUTIONS-WEB-D…M, 19–20.11.2026).
//
// Как возникает: у посетителя в кэше браузера остались страница или предзагрузка ссылки (RSC) от
// прежней сборки, а новые части кода он получает от текущей — или наоборот. Рантайм webpack одной
// сборки требует модуль, которого в чанке другой сборки нет, и падает с «reading 'call'»
// (Chrome: Cannot read properties of undefined (reading 'call'); Firefox: can't access property "call";
// Safari: undefined is not an object (evaluating 'e[o].call')) либо с ChunkLoadError.
// Проверка buildId в роутере Next срабатывает уже после подгрузки чанков, поэтому не спасает.
//
// Лечение здесь: такую ошибку узнаём и один раз перезагружаем страницу — с 19.11.2026 nginx отдаёт
// страницам и RSC «private, no-cache», и после перезагрузки все части берутся от одной сборки.
// Повторная перезагрузка в той же вкладке раньше чем через минуту не делается: если ошибка не
// рассинхрон, посетитель увидит обычную страницу ошибки, а не бесконечную перезагрузку.
export const BUILD_SKEW_RE =
  /Cannot read properties of undefined \(reading 'call'\)|can't access property "call"|undefined is not an object \(evaluating '[^']*\.call'\)|ChunkLoadError|Loading chunk [\w-]+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|Importing a module script failed/i;

const KEY = "sat_skew_reload";
const WINDOW_MS = 60_000;
// Небольшая задержка, чтобы Sentry успел отправить событие: статистика рассинхронов нужна контролю.
const RELOAD_DELAY_MS = 400;

export function isBuildSkewError(e: unknown): boolean {
  if (e == null) return false;
  const msg = e instanceof Error ? `${e.name}: ${e.message}` : typeof e === "string" ? e : String((e as { message?: unknown }).message ?? "");
  return BUILD_SKEW_RE.test(msg);
}

// true — перезагрузка назначена; false — недавно уже перезагружались (или нет window/sessionStorage).
export function reloadOnceForBuildSkew(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const last = Number(window.sessionStorage.getItem(KEY) || 0);
    if (Date.now() - last < WINDOW_MS) return false;
    window.sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  return true;
}

let installed = false;
// Глобальные обработчики: ошибка рассинхрона чаще всего приходит как необработанный промис
// при предзагрузке ссылок (Sentry: mechanism onunhandledrejection), до любых границ ошибок React.
export function installBuildSkewGuard() {
  if (typeof window === "undefined" || installed) return;
  installed = true;
  window.addEventListener("error", (ev) => {
    if (isBuildSkewError(ev.error ?? ev.message)) reloadOnceForBuildSkew();
  });
  window.addEventListener("unhandledrejection", (ev) => {
    if (isBuildSkewError(ev.reason)) reloadOnceForBuildSkew();
  });
}
