export type LatLng = { lat: number; lng: number };

function isFiniteNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function normalizePair(a: number, b: number): LatLng | null {
  // Prefer interpreting as lat,lng; if invalid, try swapping (yandex often uses lng,lat).
  const lat1 = a;
  const lng1 = b;
  if (Math.abs(lat1) <= 90 && Math.abs(lng1) <= 180) return { lat: lat1, lng: lng1 };
  const lat2 = b;
  const lng2 = a;
  if (Math.abs(lat2) <= 90 && Math.abs(lng2) <= 180) return { lat: lat2, lng: lng2 };
  return null;
}

export function parseLatLngFromText(input: unknown): LatLng | null {
  const s = typeof input === "string" ? input.trim() : "";
  if (!s) return null;

  // Exact "lat, lng"
  let m = s.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (m) {
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (Number.isFinite(a) && Number.isFinite(b)) return normalizePair(a, b);
  }

  // Try extracting from URL/text (first plausible pair)
  const decoded = (() => {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  })();
  m = decoded.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
  if (!m) return null;
  const a = Number(m[1]);
  const b = Number(m[2]);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  return normalizePair(a, b);
}

export function contactGeo(data: any): { latLng: LatLng | null; href: string | null; widgetSrc: string | null } {
  const lat = data && isFiniteNumber(data.geoLat) ? data.geoLat : null;
  const lng = data && isFiniteNumber(data.geoLng) ? data.geoLng : null;
  const url = data && typeof data.geoUrl === "string" ? data.geoUrl : null;

  const ll = lat !== null && lng !== null ? { lat, lng } : parseLatLngFromText(url);
  const href = ll ? yandexOpenHref(ll.lat, ll.lng) : (url ? url.trim() : null);
  const widgetSrc = ll ? yandexWidgetSrc(ll.lat, ll.lng) : null;
  return { latLng: ll, href, widgetSrc };
}

export function yandexWidgetSrc(lat: number, lng: number) {
  const ll = `${lng},${lat}`;
  const pt = `${lng},${lat},pm2rdm`;
  // Yandex expects ll in "lng,lat" order.
  return `https://yandex.uz/map-widget/v1/?ll=${encodeURIComponent(ll)}&z=16&pt=${encodeURIComponent(pt)}&l=map`;
}

export function yandexOpenHref(lat: number, lng: number) {
  const ll = `${lng},${lat}`;
  const pt = `${lng},${lat},pm2rdm`;
  return `https://yandex.uz/maps/?ll=${encodeURIComponent(ll)}&z=16&pt=${encodeURIComponent(pt)}&l=map`;
}

