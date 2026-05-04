"use client";

import { Cart } from "./cart";
import { useCart } from "@/context/cart-context";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, updateQuantity, removeItem, isLoading } = useCart();
  const router = useRouter();
  const errorMessage = "";

  const handleUpdateQuantity = (id, qty) => {
    updateQuantity(id, qty);
  };

  const handleRemoveProduct = (id) => {
    removeItem(id);
  };

  const handleCheckout = (payload) => {
    alert(
      `Checkout! ${payload.products.reduce((s, p) => s + p.quantity, 0)} items · Total ৳${payload.totalAmount.toFixed(0)}`,
    );
  };

  const handleContinueShopping = () => {
    router.push("/items");
  };

  return (
    <Cart
      products={items}
      isLoading={isLoading}
      errorMessage={errorMessage}
      currencyPrefix="৳"
      shippingCost={60}
      vatRate={0.05}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveProduct={handleRemoveProduct}
      onCheckout={handleCheckout}
      onContinueShopping={handleContinueShopping}
    />
  );
}