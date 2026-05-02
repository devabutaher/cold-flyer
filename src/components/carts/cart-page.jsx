"use client";

import { useState } from "react";

import { Cart } from "./cart";

const INITIAL_PRODUCTS = [
  {
    id: "prod-1",
    imageUrl:
      "https://raw.githubusercontent.com/stackzero-labs/ui/refs/heads/main/public/placeholders/headphone-1.jpg",
    name: "Wireless Headphones",
    sub: "Noise Cancelling · Black",
    price: 8500,
    quantity: 1,
  },
  {
    id: "prod-2",
    imageUrl:
      "https://raw.githubusercontent.com/stackzero-labs/ui/refs/heads/main/public/placeholders/smartwatch-01.jpg",
    name: "Smart Watch",
    sub: "Series 5 · Silver",
    price: 12999,
    quantity: 2,
  },
  {
    id: "prod-3",
    imageUrl:
      "https://raw.githubusercontent.com/stackzero-labs/ui/refs/heads/main/public/placeholders/speaker-01.jpg",
    name: "Bluetooth Speaker",
    sub: "Portable · White",
    price: 6500,
    quantity: 1,
  },
];

export default function CartPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateQuantity = (id, qty) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)),
    );

  const handleRemoveProduct = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleCheckout = (payload) => {
    alert(
      `Checkout! ${payload.products.reduce((s, p) => s + p.quantity, 0)} items · Total ৳${payload.totalAmount.toFixed(0)}`,
    );
  };

  return (
    <Cart
      products={products}
      isLoading={isLoading}
      errorMessage={errorMessage}
      currencyPrefix="৳"
      shippingCost={60}
      vatRate={0.05}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveProduct={handleRemoveProduct}
      onCheckout={handleCheckout}
      onContinueShopping={() => {}}
    />
  );
}