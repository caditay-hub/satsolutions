// Google Click ID для офлайн-конверсий: заявка → CRM → выгрузка сделки в Ads.
// gtag (AW-18194158897) сам кладёт клик в cookie _gcl_aw в формате GCL.<ts>.<gclid>;
// свежий переход надёжнее брать прямо из URL (?gclid=...).
export function getGclid(): string | null {
  if (typeof document === "undefined") return null;
  try {
    const fromUrl = new URLSearchParams(window.location.search).get("gclid");
    if (fromUrl && /^[\w.-]{10,200}$/.test(fromUrl)) return fromUrl;
    const m = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/);
    if (m) {
      const parts = decodeURIComponent(m[1]).split(".");
      const id = parts.slice(2).join(".");
      if (id && /^[\w.-]{10,200}$/.test(id)) return id;
    }
  } catch {
    /* приватный режим без cookie — просто без gclid */
  }
  return null;
}
