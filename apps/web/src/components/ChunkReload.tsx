"use client";

import { useEffect } from "react";

/* Страховка от «Application error: a client-side exception» после деплоя.

   Деплой пересобирает сайт, и имена js-файлов меняются. У посетителя, который
   держал вкладку открытой или получил страницу из кэша, при первом же переходе
   браузер просит файл прежней сборки. Сервер теперь отдаёт и старые файлы
   (deploy.sh кладёт статику прошлой сборки рядом с новой), но это спасает одну
   выкатку назад, а не десять. Здесь второй рубеж: ловим именно ошибку загрузки
   чанка и один раз перезагружаем страницу — посетитель видит моргание вместо
   пустого экрана с английской ошибкой.

   Флаг в sessionStorage не даёт зациклиться, если перезагрузка не помогла;
   через полминуты он снимается, чтобы следующая выкатка снова была прикрыта. */
const FLAG = "chunk-reload";

const isChunkError = (text: string) =>
  /ChunkLoadError|Loading chunk \d+ failed|Loading CSS chunk|Failed to fetch dynamically imported module|error loading dynamically imported module|Importing a module script failed/i.test(
    text,
  );

export function ChunkReload() {
  useEffect(() => {
    let done = false;
    const reloadOnce = () => {
      if (done) return;
      done = true;
      try {
        if (sessionStorage.getItem(FLAG)) return; // уже пробовали — не зацикливаемся
        sessionStorage.setItem(FLAG, String(Date.now()));
      } catch {
        // приватный режим: перезагружаем без запоминания
      }
      window.location.reload();
    };

    const onError = (e: ErrorEvent) => {
      if (isChunkError(`${e.message ?? ""} ${(e.error as Error | undefined)?.message ?? ""}`)) reloadOnce();
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason as { message?: string } | string | undefined;
      const text = typeof reason === "string" ? reason : reason?.message ?? "";
      if (isChunkError(text)) reloadOnce();
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    // страница ожила — снимаем флаг, чтобы следующая выкатка тоже была прикрыта
    const clear = setTimeout(() => {
      try { sessionStorage.removeItem(FLAG); } catch { /* пусто */ }
    }, 30000);

    return () => {
      clearTimeout(clear);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
