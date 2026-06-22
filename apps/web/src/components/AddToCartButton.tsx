"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { addToCart, loadCart } from "@/lib/cart";

export function AddToCartButton({
  item,
  className
}: {
  item: { productId: string; slug: string; name: string; price: string; coverImageUrl: string | null };
  className?: string;
}) {
  const router = useRouter();
  const [inCart, setInCart] = useState(false);

  useEffect(() => {
    const sync = () => {
      const exists = loadCart().some((x) => x.productId === item.productId);
      setInCart(exists);
    };
    sync();
    window.addEventListener("sat_cart_changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sat_cart_changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, [item.productId]);

  return (
    <button
      type="button"
      className={
        className ??
        "btn-secondary !px-2 !py-1.5 !text-[11px] whitespace-nowrap"
      }
      onClick={(e) => {
        // If button is inside a <Link>, don't navigate.
        e.preventDefault();
        e.stopPropagation();
        if (inCart) {
          router.push("/cart");
          return;
        }
        addToCart(item, 1);
        setInCart(true);
      }}
    >
      {inCart ? "Добавлено" : "В корзину"}
    </button>
  );
}

