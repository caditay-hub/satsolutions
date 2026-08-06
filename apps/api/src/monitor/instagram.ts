// Конвейер Instagram-постов: карточка товара (python-генератор) → аппрув в боте → публикация
// через Instagram Graph API. Токен: /root/.meta_token (JSON {accessToken, igUserId}) — до его
// появления работает всё, кроме самой публикации.
import { execFile } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

const execFileP = promisify(execFile);

const API_BASE = `http://localhost:${process.env.PORT || 4005}`;
const UPLOADS_PUBLIC = "https://api.satsolutions.uz/uploads/ig";
const META_TOKEN_PATH = "/root/.meta_token";
// Токен типа instagram_login (IGAA...) работает через graph.instagram.com
const GRAPH = "https://graph.instagram.com/v21.0";

export type IgProduct = {
  slug: string;
  name: string;
  price: string;
  coverImageUrl: string;
  characteristics: Record<string, string> | null;
  brandName?: string | null;
};

export type IgDraft = { product: IgProduct; imageUrl: string; caption: string };

async function api<T>(path: string): Promise<T> {
  const r = await fetch(`${API_BASE}${path}`);
  if (!r.ok) throw new Error(`API ${path}: ${r.status}`);
  return (await r.json()) as T;
}

/** Товар по slug или случайный (published, с фото и ценой). */
export async function pickProduct(slug?: string): Promise<IgProduct> {
  if (slug) {
    const { product } = await api<{ product: any }>(`/products/${encodeURIComponent(slug)}`).catch(() => ({ product: null }));
    if (!product) throw new Error(`товар «${slug}» не найден`);
    return product;
  }
  const { total } = await api<{ total: number }>(`/products?limit=1`);
  for (let i = 0; i < 8; i++) {
    const page = 1 + Math.floor(Math.random() * total);
    const { items } = await api<{ items: any[] }>(`/products?limit=1&page=${page}`);
    const p = items[0];
    if (p && Number(p.price) > 0 && p.coverImageUrl) return p;
  }
  throw new Error("не удалось подобрать товар с фото и ценой");
}

/** Сгенерировать карточку 1080×1350; вернуть публичный URL картинки. */
export async function generateCard(product: IgProduct): Promise<string> {
  const script = resolve(process.cwd(), "scripts/ig_card.py");
  const outDir = resolve(process.cwd(), "uploads/ig");
  mkdirSync(outDir, { recursive: true });
  const fname = `${product.slug}-${Date.now()}.png`;
  const tmpJson = join(tmpdir(), `igcard-${process.pid}.json`);
  writeFileSync(tmpJson, JSON.stringify(product), "utf8");
  await execFileP("python3", [script, tmpJson, join(outDir, fname)], { timeout: 60000 });
  return `${UPLOADS_PUBLIC}/${fname}`;
}

const HASHTAGS =
  "#tashkent #toshkent #xavfsizlik #videokuzatuv #kamera #видеонаблюдение #ташкент #узбекистан #безопасность";

/** Двуязычная подпись (uz + ru). Имя товара оставляем как в каталоге. */
export function buildCaption(p: IgProduct): string {
  const price = Number(p.price);
  const priceStr = price.toLocaleString("ru-RU").replace(/,/g, " ");
  const chars = Object.entries(p.characteristics ?? {})
    .filter(([, v]) => String(v).length <= 34)
    .slice(0, 3)
    .map(([k, v]) => `▪️ ${k}: ${v}`)
    .join("\n");
  const brandTag = p.brandName ? ` #${p.brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}` : "";
  return (
    `📦 ${p.name}\n\n` +
    `💰 Narxi: ${priceStr} so'mdan / Цена: от ${priceStr} сум\n` +
    `✅ Omborda mavjud / В наличии на складе в Ташкенте\n` +
    (chars ? `\n${chars}\n` : "") +
    `\n🚚 O'rnatish va kafolat / Монтаж и гарантия\n` +
    `📞 +998 97 862-66-99 (WhatsApp / Telegram)\n` +
    `🌐 satsolutions.uz\n` +
    `📍 Toshkent, Katta Darxon ko'chasi 5\n\n` +
    HASHTAGS + brandTag
  );
}

/** Черновик поста: товар → карточка + подпись. */
export async function prepareDraft(slug?: string): Promise<IgDraft> {
  const product = await pickProduct(slug);
  const imageUrl = await generateCard(product);
  return { product, imageUrl, caption: buildCaption(product) };
}

export function igConfigured(): boolean {
  return existsSync(META_TOKEN_PATH);
}

/** Публикация фото в Instagram (Graph API: media → media_publish). */
export async function publishInstagram(imageUrl: string, caption: string): Promise<string> {
  if (!igConfigured()) {
    throw new Error("Meta-токен не настроен (/root/.meta_token). Публикация недоступна, карточку можно запостить вручную.");
  }
  const { accessToken, igUserId } = JSON.parse(readFileSync(META_TOKEN_PATH, "utf8"));
  const create = await fetch(`${GRAPH}/${igUserId}/media`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ image_url: imageUrl, caption, access_token: accessToken }),
  });
  const cd = (await create.json()) as any;
  if (!create.ok || !cd.id) throw new Error(`media: ${JSON.stringify(cd).slice(0, 300)}`);
  const publish = await fetch(`${GRAPH}/${igUserId}/media_publish`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ creation_id: cd.id, access_token: accessToken }),
  });
  const pd = (await publish.json()) as any;
  if (!publish.ok || !pd.id) throw new Error(`media_publish: ${JSON.stringify(pd).slice(0, 300)}`);
  const perma = await fetch(`${GRAPH}/${pd.id}?fields=permalink&access_token=${accessToken}`);
  const pj = (await perma.json()) as any;
  return pj.permalink ?? `media_id ${pd.id}`;
}
