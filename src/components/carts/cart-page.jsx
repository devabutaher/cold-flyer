"use client";

import { Cart } from "./cart";
import { useCart } from "@/context/cart-context";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

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
      loadingSkeleton={<CartSkeleton />}
    />
  );
}