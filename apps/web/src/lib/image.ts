export function resolveImageUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("/")) {
    const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";
    return `${base}${url}`;
  }
  return url;
}

