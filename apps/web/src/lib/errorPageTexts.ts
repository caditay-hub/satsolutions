// Тексты страницы ошибки на пяти языках. Словарь встроен в код: в момент ошибки контекст
// переводов может быть недоступен (тот же приём, что в not-found.tsx).
export type ErrorPageText = { title: string; text: string; hint: string; reload: string; home: string };

export const ERROR_LOCALES = ["ru", "uz", "en", "tr", "zh"] as const;

export const ERROR_PAGE_TEXT: Record<string, ErrorPageText> = {
  ru: {
    title: "Страница не смогла открыться",
    text: "Обновите её — обычно этого достаточно.",
    hint: "Если в браузере включён автоматический перевод страницы, выключите его для этого сайта: сайт уже переведён на пять языков.",
    reload: "Обновить страницу",
    home: "На главную",
  },
  uz: {
    title: "Sahifa ochilmadi",
    text: "Sahifani yangilang — odatda shuning o‘zi yetarli.",
    hint: "Brauzerda sahifani avtomatik tarjima qilish yoqilgan bo‘lsa, uni shu sayt uchun o‘chirib qo‘ying: sayt besh tilda ishlaydi.",
    reload: "Sahifani yangilash",
    home: "Bosh sahifaga",
  },
  en: {
    title: "The page could not be displayed",
    text: "Reload it — this is usually enough.",
    hint: "If your browser translates pages automatically, turn translation off for this site: it is already available in five languages.",
    reload: "Reload page",
    home: "Go to homepage",
  },
  tr: {
    title: "Sayfa açılamadı",
    text: "Sayfayı yenileyin — genellikle bu yeterlidir.",
    hint: "Tarayıcınız sayfaları otomatik olarak çeviriyorsa bu site için çeviriyi kapatın: site zaten beş dilde yayında.",
    reload: "Sayfayı yenile",
    home: "Ana sayfaya",
  },
  zh: {
    title: "页面无法打开",
    text: "请刷新页面，通常这样即可恢复。",
    hint: "如果浏览器开启了网页自动翻译，请为本网站关闭翻译：本网站已提供五种语言版本。",
    reload: "刷新页面",
    home: "返回首页",
  },
};

export function errorLocaleFromPath(pathname: string | null | undefined): string {
  const seg = (pathname || "/").split("/")[1];
  return (ERROR_LOCALES as readonly string[]).includes(seg) ? seg : "ru";
}

// Ошибку, пойманную страницей ошибки, React больше не отдаёт в window.onerror —
// без явной отправки Sentry перестал бы её видеть. Только боевой домен, как в instrumentation-client.ts.
export function reportPageError(error: unknown) {
  if (typeof window === "undefined" || !/(^|\.)satsolutions\.uz$/.test(window.location.hostname)) return;
  import("./sentryClient").then((m) => m.reportError(error)).catch(() => {});
}
