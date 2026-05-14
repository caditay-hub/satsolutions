export type UploadImageKind =
  | "category"
  | "product"
  | "service"
  | "news"
  | "portfolio"
  | "portfolioGallery"
  | "hero"
  | "logo";

export async function uploadImage(file: File, opts?: { kind?: UploadImageKind }): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const token = window.localStorage.getItem("sat_admin_token");
  const base =
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    `${window.location.protocol}//${window.location.hostname}:4000`;

  const qs = opts?.kind ? `?kind=${encodeURIComponent(opts.kind)}` : "";
  let res: Response;
  try {
    res = await fetch(`${base}/admin/uploads/images${qs}`, {
      method: "POST",
      headers: token ? { authorization: `Bearer ${token}` } : undefined,
      body: form
    });
  } catch {
    throw new Error(`Не удалось подключиться к API (${base}). Проверьте, что API запущен и доступен.`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    let details = text;
    try {
      const j = JSON.parse(text) as any;
      if (j?.error) details = j.error;
    } catch {
      // ignore
    }
    throw new Error(`Upload failed: ${res.status}${details ? ` (${details})` : ""}`);
  }

  const data = (await res.json()) as { url: string };
  return data.url;
}

