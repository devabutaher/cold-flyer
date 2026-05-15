"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart, Package, X, Loader2, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { useAuth } from "@/components/providers";
import api from "@/lib/api-client";
import { QuantityInput } from "@/components/carts/quantity-input";

function CartEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <ShoppingCart size={36} className="text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">Your cart is empty</h2>
      <p className="mb-7 text-sm text-muted-foreground">
        Looks like you haven&apos;t added anything yet.
      </p>
      <Button asChild>
        <Link href="/items">Start Shopping</Link>
      </Button>
    </div>
  );
}

function CartLoading() {
  return (
    <div className="space-y-4 py-8">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-4 p-4 bg-card rounded-xl border border-border">
          <Skeleton className="h-24 w-24 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

function CartContent() {
  const router = useRouter();
  const { backendUser } = useAuth();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");

  const subtotal = items.reduce(
    (total, p) => total + p.price * p.quantity,
    0,
  );
  const vatAmount = subtotal * 0.05;
  const totalAmount = subtotal + 60 + vatAmount;

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
          product: item.productRef || item.productId,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
        })),
        paymentMethod: "card",
        isPickup: false,
        ...(couponCode && { couponCode }),
      };

      // Create order first, then get checkout URL
      const response = await api.apiPost("/orders", orderData);

      if (response.success && response.data?.order?._id) {
        const orderId = response.data.order._id;
        
        // Create checkout session
        const sessionResponse = await api.apiPost(`/orders/${orderId}/checkout`, {});
        
        if (sessionResponse.success && sessionResponse.data?.checkoutUrl) {
          clearCart();
          window.location.href = sessionResponse.data.checkoutUrl;
        } else {
          toast.error(sessionResponse.message || "Failed to create checkout");
        }
      } else {
        toast.error(response.message || "Failed to create order");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {items.map((product) => {
          const slug = product.slug || product.productId;
          return (
            <div
              key={product.id}
              className="flex gap-4 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm sm:gap-5 sm:p-5"
            >
              <Link
                href={`/items/${slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-28 sm:w-28"
              >
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package size={24} className="text-muted-foreground/40" />
                  </div>
                )}
              </Link>

              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-full">
                    <Link
                      href={`/items/${slug}`}
                      className="font-semibold leading-tight text-foreground hover:text-primary"
                    >
                      {product.name}
                    </Link>
                    {product.description && (
                      <p className="mt-0.5 line-clamp-1 md:line-clamp-2 text-xs text-muted-foreground md:w-1/2">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X size={15} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <QuantityInput
                    quantity={product.quantity}
                    onChange={(qty) => updateQuantity(product.id, qty)}
                  />
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      ৳{(product.price * product.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ৳{product.price.toLocaleString()} each
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground"
            asChild
          >
            <Link href="/items">Continue Shopping</Link>
          </Button>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-bold text-foreground">Order Summary</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal ({items.reduce((s, p) => s + p.quantity, 0)} items)</span>
            <span className="font-medium text-foreground">
              ৳{subtotal.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="font-medium text-foreground">৳60</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>VAT (5%)</span>
            <span className="font-medium text-foreground">
              ৳{vatAmount.toFixed(0)}
            </span>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Coupon code"
              className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
          {couponCode && (
            <button
              onClick={() => setCouponCode("")}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">Total</span>
          <span className="text-xl font-extrabold text-primary">
            ৳{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/items">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            My Cart
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">
            Shopping Cart
          </h1>
        </div>

        <Suspense fallback={<CartLoading />}>
          {isHydrated ? <CartContent /> : <CartLoading />}
        </Suspense>
      </div>
    </div>
  );
}