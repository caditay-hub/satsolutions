import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const res = intlMiddleware(req);
  // Пробрасываем путь в заголовок — нужен странице not-found, чтобы определить локаль
  // (в контексте notFound() параметры маршрута недоступны).
  res.headers.set("x-pathname", req.nextUrl.pathname);
  return res;
}

export const config = {
  // Применяем ко всем путям, кроме api, статики, файлов с расширением и служебных
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
