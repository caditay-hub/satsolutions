import type { NextFunction, Request, Response, Router } from "express";

// Express 4 не ловит ошибки async-обработчиков: отклонённый промис уходит в unhandledRejection,
// а запрос остаётся без ответа, пока его не оборвёт nginx (60 с). Так 17.11.2026 зависли
// GET /product-questions?productId=1 и ?productId=5488 — Postgres не принял значение как uuid
// (Sentry SATSOLUTIONS-API-2; в логе nginx 499 и 504).
//
// asyncSafe обходит уже зарегистрированные маршруты роутера и оборачивает обработчики так,
// чтобы любая ошибка — синхронная или из промиса — уходила в общий обработчик ошибок
// (index.ts: Sentry + ответ 500). Вызывать после импорта роутера и до app.use(router).

type Handler = (req: Request, res: Response, next: NextFunction) => unknown;
type Layer = { handle?: unknown; route?: { stack?: Layer[] } };

const WRAPPED = Symbol("asyncSafe");

function wrap(handler: Handler): Handler {
  if ((handler as unknown as Record<symbol, unknown>)[WRAPPED]) return handler;
  // Ровно три параметра: по числу параметров Express отличает обычный обработчик от обработчика ошибок.
  const safe: Handler = function (this: unknown, req, res, next) {
    try {
      const result = handler.call(this, req, res, next) as { then?: unknown; catch?: (fn: (e: unknown) => void) => unknown } | undefined;
      if (result && typeof result.then === "function" && typeof result.catch === "function") result.catch(next);
    } catch (e) {
      next(e);
    }
  };
  (safe as unknown as Record<symbol, unknown>)[WRAPPED] = true;
  return safe;
}

function walk(stack: Layer[] | undefined, seen: WeakSet<object>) {
  for (const layer of stack ?? []) {
    if (seen.has(layer)) continue;
    seen.add(layer);
    const inner = (layer.handle as { stack?: Layer[] } | undefined)?.stack;
    if (layer.route?.stack) {
      // router.get/post/…: у маршрута свой список обработчиков
      for (const l of layer.route.stack) if (typeof l.handle === "function" && l.handle.length < 4) l.handle = wrap(l.handle as Handler);
    } else if (Array.isArray(inner)) {
      walk(inner, seen); // вложенный роутер
    } else if (typeof layer.handle === "function" && layer.handle.length < 4) {
      layer.handle = wrap(layer.handle as Handler); // router.use(fn)
    }
  }
}

export function asyncSafe<T extends Router>(router: T): T {
  walk((router as unknown as { stack?: Layer[] }).stack, new WeakSet());
  return router;
}
