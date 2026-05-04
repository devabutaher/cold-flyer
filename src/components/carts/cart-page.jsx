"use client";

import { useState } from "react";

import { useCart } from "@/context/cart-context";
import { ordersApi } from "@/lib/api/orders";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cart } from "./cart";
import { CartSkeleton } from "./cart-skeleton";

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const errorMessage = "";

  const handleUpdateQuantity = (id, qty) => {
    updateQuantity(id, qty);
  };

  const handleRemoveProduct = (id) => {
    removeItem(id);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.productRef || item.productId || item._id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        paymentMethod: "card",
        isPickup: false,
      };

      const response = await ordersApi.createOrder(orderData);

      if (response.data?.order?._id) {
        const orderId = response.data.order._id;

        try {
          const sessionResponse =
            await ordersApi.createCheckoutSession(orderId);

          if (sessionResponse.success && sessionResponse.data?.checkoutUrl) {
            clearCart();
            window.location.href = sessionResponse.data.checkoutUrl;
          } else {
            // Payment failed but order was saved
            clearCart();
            toast.success("Order created! You can pay later.");
          }
        } catch (paymentError) {
          clearCart();
          toast.success("Order created! You can pay later.");
        }
      } else {
        toast.error(response.message || "Failed to create order");
      }
    } catch (error) {
      const errData = error.data;
      const errorMsg = errData?.message || error.message || "";

      if (errorMsg.includes("payment_method_types")) {
        toast.error("Payment system unavailable. Please try again later.");
      } else if (errData?.errors) {
        const firstError =
          errData.errors[0]?.message || "Failed to create checkout";
        toast.error(firstError);
      } else if (error.status === 400) {
        toast.error("Unable to process order. Please check your cart items.");
      } else {
        toast.error("Failed to create checkout. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
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
      loadingSkeleton={<CartSkeleton />}
      isProcessing={isProcessing}
    />
  );
}
