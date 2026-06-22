"use client";

import { Link } from "@/i18n/navigation";
import { useEffect, useMemo, useState } from "react";
import { loadCart } from "@/lib/cart";

function countItems() {
  // Count distinct products in cart (not quantities sum)
  return loadCart().length;
}

export function CartIconButton({ className }: { className?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(countItems());
    const onChange = () => setCount(countItems());
    window.addEventListener("sat_cart_changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("sat_cart_changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  const label = useMemo(() => (count > 0 ? `Корзина: ${count}` : "Корзина"), [count]);

  const base =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-900 hover:bg-slate-50";

  return (
    <Link
      href="/cart"
      aria-label={label}
      title={label}
      className={className ? `${base} ${className}` : base}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 6h15l-2 9H7L6 6Z" />
        <path d="M6 6L5 3H2" />
        <path d="M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        <path d="M17 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
      </svg>
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

