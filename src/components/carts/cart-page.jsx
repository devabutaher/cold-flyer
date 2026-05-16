"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { useCart } from "@/store/cart";
import { useAuth } from "@/components/providers";
import { apiPost } from "@/lib/api-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Cart } from "./cart";
import { CartSkeleton } from "./cart-skeleton";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

export default function CartPage() {
  const t = useTranslations("cart");
  const { items, updateQuantity, removeItem, clearCart, isLoading } = useCart();
  const { backendUser } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("stripe");

  const PAYMENT_PROVIDERS = [
    { value: "stripe", label: "Card (Visa/MasterCard)", icon: CreditCard },
    { value: "sslcommerz", label: "SSLCOMMERZ (bKash/Nagad/Card)", icon: Smartphone },
    { value: "cod", label: "Cash on Delivery", icon: Banknote },
  ];

  const handleUpdateQuantity = (id, qty) => {
    updateQuantity(id, qty);
  };

  const handleRemoveProduct = (id) => {
    removeItem(id);
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error(t("emptyTitle"));
      return;
    }

    if (!backendUser) {
      toast.error(t("loginToCheckout"));
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

        if (sessionResponse.success) {
          clearCart();
          if (sessionResponse.data?.checkoutUrl) {
            window.location.href = sessionResponse.data.checkoutUrl;
          } else {
            router.push(`/order/${orderId}?success=true&provider=${paymentProvider}`);
          }
        } else {
          toast.error(sessionResponse.message || t("failedCheckout"));
        }
      } else {
        toast.error(response.message || t("failedOrder"));
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const errData = error.data;
      const errorMsg = errData?.message || error.message || "";

      if (errorMsg.includes("payment_method_types") || errorMsg.includes("SSLCOMMERZ")) {
        toast.error(t("paymentUnavailable"));
      } else if (errData?.errors) {
        const firstError = errData.errors[0]?.message || t("failedCheckout");
        toast.error(firstError);
      } else if (error.status === 400) {
        toast.error(errorMsg || t("unableToProcess"));
      } else {
        toast.error(errorMsg || t("failedCheckout"));
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
