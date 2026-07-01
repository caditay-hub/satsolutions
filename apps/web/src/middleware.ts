import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Применяем ко всем путям, кроме api, статики, файлов с расширением и служебных
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
