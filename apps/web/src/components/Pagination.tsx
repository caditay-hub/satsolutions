import { Link } from "@/i18n/navigation";

function toPositiveInt(v: unknown, fallback: number) {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n)) return fallback;
  const i = Math.floor(n);
  return i > 0 ? i : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function buildHref(basePath: string, params: Record<string, string | undefined | null>, page: number) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const val = typeof v === "string" ? v.trim() : "";
    if (!val) continue;
    qs.set(k, val);
  }
  if (page > 1) qs.set("page", String(page));
  const s = qs.toString();
  return s ? `${basePath}?${s}` : basePath;
}

export function Pagination({
  basePath,
  page,
  limit,
  total,
  params
}: {
  basePath: string;
  page: number;
  limit: number;
  total: number;
  params?: Record<string, string | undefined | null>;
}) {
  const cur = toPositiveInt(page, 1);
  const lim = toPositiveInt(limit, 12);
  const tot = Math.max(0, toPositiveInt(total, 0));
  const pages = Math.max(1, Math.ceil(tot / lim));
  const current = clamp(cur, 1, pages);
  if (pages <= 1) return null;

  const p = params ?? {};

  const windowSize = 2;
  const start = Math.max(1, current - windowSize);
  const end = Math.min(pages, current + windowSize);

  const items: Array<number | "…"> = [];
  items.push(1);
  if (start > 2) items.push("…");
  for (let i = Math.max(2, start); i <= Math.min(pages - 1, end); i++) items.push(i);
  if (end < pages - 1) items.push("…");
  if (pages > 1) items.push(pages);

  return (
    <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={buildHref(basePath, p, Math.max(1, current - 1))}
        aria-disabled={current === 1}
        className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
          current === 1 ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400" : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        ←
      </Link>

      {items.map((it, idx) => {
        if (it === "…") {
          return (
            <span key={`dots-${idx}`} className="px-2 text-sm text-slate-500">
              …
            </span>
          );
        }
        const active = it === current;
        return (
          <Link
            key={it}
            href={buildHref(basePath, p, it)}
            className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
              active ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
            }`}
          >
            {it}
          </Link>
        );
      })}

      <Link
        href={buildHref(basePath, p, Math.min(pages, current + 1))}
        aria-disabled={current === pages}
        className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
          current === pages ? "pointer-events-none border-slate-200 bg-slate-100 text-slate-400" : "border-slate-300 bg-white text-slate-900 hover:bg-slate-50"
        }`}
      >
        →
      </Link>
    </div>
  );
}

