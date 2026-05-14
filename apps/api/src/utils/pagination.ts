export function parsePositiveInt(input: unknown, fallback: number) {
  const n = Number(input);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.floor(n));
}

export function parseLimit(input: unknown, fallback: number, max: number) {
  const n = Number(input);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(1, Math.floor(n)));
}

