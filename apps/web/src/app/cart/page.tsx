import type { Metadata } from "next";
import { CartClient } from "./ui";

export const metadata: Metadata = {
  title: "Корзина",
  description: "Оформление заказа"
};

export default function CartPage() {
  return (
    <div className="container-page py-6 sm:py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Корзина</h1>
      <CartClient />
    </div>
  );
}

