"use client";

import { useState } from "react";

import { useCart } from "@/store/cart";
import { useAuth } from "@/components/providers";
import { apiPost } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cart } from "./cart";
import { CartSkeleton } from "./cart-skeleton";
import { CreditCard, Smartphone } from "lucide-react";

const PAYMENT_PROVIDERS = [
  { value: "stripe", label: "Card (Visa/MasterCard)", icon: CreditCard },
  { value: "sslcommerz", label: "SSLCOMMERZ (bKash/Nagad/Card)", icon: Smartphone },
];

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const { backendUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("stripe");

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

    if (!backendUser) {
      toast.error("Please login to proceed to checkout");
      router.push("/auth");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.productId || item.productRef,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        paymentMethod: "card",
        isPickup: false,
      };

      const response = await apiPost("/orders", orderData);

      if (response.data?.order?._id) {
        const orderId = response.data.order._id;
        const sessionResponse = await apiPost(`/orders/${orderId}/checkout`, { provider: paymentProvider });

        if (sessionResponse.success && sessionResponse.data?.checkoutUrl) {
          window.location.href = sessionResponse.data.checkoutUrl;
          clearCart();
        } else {
          toast.error(sessionResponse.message || "Failed to create checkout");
        }
      } else {
        toast.error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errData = error.data;
      const errorMsg = errData?.message || error.message || "";

      if (errorMsg.includes("payment_method_types") || errorMsg.includes("SSLCOMMERZ")) {
        toast.error("Payment system unavailable. Please try again later.");
      } else if (errData?.errors) {
        const firstError = errData.errors[0]?.message || "Failed to create checkout";
        toast.error(firstError);
      } else if (error.status === 400) {
        toast.error(errorMsg || "Unable to process order. Please check your cart items.");
      } else {
        toast.error(errorMsg || "Failed to create checkout. Please try again.");
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
      paymentProvider={paymentProvider}
      onPaymentProviderChange={setPaymentProvider}
      paymentProviders={PAYMENT_PROVIDERS}
    />
  );
}
