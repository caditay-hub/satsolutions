export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: string; // snapshot
  coverImageUrl: string | null;
  quantity: number;
};

const KEY = "sat_cart_v1";
const EVENT = "sat_cart_changed";

export function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as any[];
    if (!Array.isArray(arr)) return [];
    return arr
      .map((x) => ({
        productId: String(x.productId ?? ""),
        slug: String(x.slug ?? ""),
        name: String(x.name ?? ""),
        price: String(x.price ?? "0"),
        coverImageUrl: x.coverImageUrl ? String(x.coverImageUrl) : null,
        quantity: Number(x.quantity ?? 0)
      }))
      .filter((x) => x.productId && x.slug && x.name && Number.isFinite(x.quantity) && x.quantity > 0);
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
  try {
    window.dispatchEvent(new Event(EVENT));
  } catch {
    // ignore
  }
}

export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const q = Math.max(1, Math.floor(quantity));
  const items = loadCart();
  const idx = items.findIndex((x) => x.productId === item.productId);
  if (idx >= 0) items[idx] = { ...items[idx]!, quantity: items[idx]!.quantity + q };
  else items.push({ ...item, quantity: q });
  saveCart(items);
  return items;
}

export function updateCartQuantity(productId: string, quantity: number) {
  const q = Math.max(1, Math.floor(quantity));
  const items = loadCart().map((x) => (x.productId === productId ? { ...x, quantity: q } : x));
  saveCart(items);
  return items;
}

export function removeFromCart(productId: string) {
  const items = loadCart().filter((x) => x.productId !== productId);
  saveCart(items);
  return items;
}

export function clearCart() {
  saveCart([]);
}

