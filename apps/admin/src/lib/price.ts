export function formatPrice(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";

  let n: number;
  if (typeof value === "number") {
    n = value;
  } else {
    const raw = String(value).trim();
    if (!raw) return "";
    const normalized = raw
      .replace(/[\u00A0\u202F]/g, " ")
      .replace(/\s+/g, "")
      .replace(",", ".")
      .replace(/[^\d.-]/g, "");
    n = Number(normalized);
  }

  if (!Number.isFinite(n)) return String(value);

  const int = n >= 0 ? Math.trunc(n) : -Math.trunc(Math.abs(n));
  const formatted = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(int);
  return formatted.replace(/[\u00A0\u202F]/g, " ");
}

