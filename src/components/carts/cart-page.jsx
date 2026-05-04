"use client";

import { useState } from "react";

import { Cart } from "./cart";
import { useCart } from "@/context/cart-context";
import { ordersApi } from "@/lib/api/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function CartSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 rounded-2xl border border-border bg-card p-4 sm:gap-5 sm:p-5"
          >
            <Skeleton className="h-24 w-24 shrink-0 rounded-xl sm:h-28 sm:w-28" />
            <div className="flex flex-1 flex-col justify-between gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-bold text-foreground">
          Order Summary
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between text-muted-foreground">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="mt-6 space-y-3">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, updateQuantity, removeItem, isLoading } = useCart();
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

      console.log('Sending order data:', JSON.stringify(orderData, null, 2));
      
      const response = await ordersApi.createOrder(orderData);

      if (response.data?.order?._id) {
        const orderId = response.data.order._id;
        const sessionResponse = await ordersApi.createCheckoutSession(orderId);

        if (sessionResponse.data?.checkoutUrl) {
          window.location.href = sessionResponse.data.checkoutUrl;
        } else {
          toast.success("Order created! Redirecting to payment...");
        }
      } else {
        toast.error(response.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      // Show generic error in toast, full error in console
      const errorMsg = error.data?.message || error.message || "";
      if (errorMsg.includes("payment_method_types")) {
        toast.error("Payment system unavailable. Please try again later.");
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