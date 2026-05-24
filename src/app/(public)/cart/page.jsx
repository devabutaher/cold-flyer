"use client";
import { useTranslations } from "next-intl";

import { Suspense, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShoppingCart, Package, X, Loader2, Tag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/store/cart";
import { useAuth } from "@/components/providers";
import { getClient } from "@/lib/http-client";
import { QuantityInput } from "@/components/carts/quantity-input";

function CartEmpty() {
  const t = useTranslations("cart-page");
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <ShoppingCart size={36} className="text-muted-foreground" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">{t("emptyTitle")}</h2>
      <p className="mb-7 text-sm text-muted-foreground">{t("emptyDesc")}</p>
      <Button asChild>
        <Link href="/items">{t("startShopping")}</Link>
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
  const t = useTranslations("cart-page");
  const ct = useTranslations("cart");
  const router = useRouter();
  const { backendUser } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, coupon, couponLoading, applyCoupon, setCouponLoading, removeCoupon } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");

  const subtotal = items.reduce((total, p) => total + p.price * p.quantity, 0);
  const vatAmount = subtotal * 0.05;
  const shipping = 60;
  const discount = coupon?.calculatedDiscount || 0;
  const totalAmount = subtotal + shipping + vatAmount - discount;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponLoading(true);
    try {
      const lookup = await getClient().get(`/coupons/lookup/${couponCode}`).then((r) => r.data);
      if (!lookup.success || !lookup.data?.coupon) {
        throw new Error(ct("invalidCoupon"));
      }
      const couponInfo = lookup.data.coupon;
      if (couponInfo.minOrderValue > 0 && subtotal < couponInfo.minOrderValue) {
        throw new Error(`Minimum order of ৳${couponInfo.minOrderValue.toLocaleString()} required`);
      }
      const res = await getClient().patch("/cart/apply-coupon", { code: couponCode }).then((r) => r.data);
      if (res.success) {
        applyCoupon(res.data.coupon);
        toast.success(ct("couponApplied"));
      }
    } catch (err) {
      const msg = err?.response?.data?.message || ct("invalidCoupon");
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await getClient().delete("/cart/remove-coupon");
      removeCoupon();
      setCouponCode("");
      toast.success("Coupon removed");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove coupon");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error(t("emptyCartToast"));
      return;
    }

    if (!backendUser) {
      toast.error(t("loginToast"));
      router.push(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
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
        ...(coupon?.code && { couponCode: coupon.code }),
      };

      const response = await getClient().post("/orders", orderData).then((r) => r.data);

      if (response.success && response.data?.order?._id) {
        router.push(`/checkout/${response.data.order._id}`);
      } else {
        toast.error(response.message || t("orderFailed"));
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || t("somethingWrong");
      toast.error(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return <CartEmpty />;

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
                  <Image src={product.imageUrl} alt={product.name} fill sizes="100px" className="object-cover" />
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
                  <QuantityInput quantity={product.quantity} onChange={(qty) => updateQuantity(product.id, qty)} />
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">
                      ৳{(product.price * product.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">৳{product.price.toLocaleString()} {t("each")}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2">
          <Button variant="outline" size="sm" className="text-muted-foreground" asChild>
            <Link href="/items">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>

      <div className="h-fit rounded-2xl border border-border bg-card p-6">
        <h2 className="mb-5 text-lg font-bold text-foreground">{t("orderSummary")}</h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>{t('subtotal', { count: items.reduce((s, p) => s + p.quantity, 0) })} ({items.reduce((s, p) => s + p.quantity, 0)} items)</span>
            <span className="font-medium text-foreground">৳{subtotal.toLocaleString()}</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>{t("shipping")}</span>
            <span className="font-medium text-foreground">৳60</span>
          </div>

          <div className="flex justify-between text-muted-foreground">
            <span>{t("vat")}</span>
            <span className="font-medium text-foreground">৳{vatAmount.toFixed(0)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{ct("coupon", { code: coupon?.code || "" })}</span>
              <span className="font-medium">-৳{discount.toLocaleString()}</span>
            </div>
          )}
        </div>

        <Separator className="my-4" />

        {coupon ? (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <Tag size={14} className="text-green-600" />
              <span className="text-sm font-medium text-green-700">{coupon.code}</span>
              <span className="text-xs text-green-600">-৳{discount.toLocaleString()}</span>
            </div>
            <button onClick={handleRemoveCoupon} className="text-green-600 hover:text-green-800">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponError(""); }}
                  placeholder={t("couponPlaceholder")}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
              <Button
                size="sm"
                onClick={handleApplyCoupon}
                disabled={!couponCode.trim() || couponLoading}
                className="h-9 shrink-0"
              >
                {couponLoading ? <Loader2 size={14} className="animate-spin" /> : ct("applyCoupon")}
              </Button>
              {couponCode && (
                <button onClick={() => { setCouponCode(""); setCouponError(""); }} className="text-xs text-muted-foreground hover:text-foreground shrink-0">
                  <X size={14} />
                </button>
              )}
            </div>
            {couponError && <p className="mt-1 text-xs text-destructive">{couponError}</p>}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="font-bold text-foreground">{t("total")}</span>
          <span className="text-xl font-extrabold text-primary">
            ৳{totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
        </div>

        <div className="mt-6 space-y-3">
          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                {t("processing")}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {t("proceedToCheckout")}
                <ArrowRight size={16} />
              </span>
            )}
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/items">{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const t = useTranslations("cart-page");
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
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("pageTitle")}</span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl md:text-4xl">{t("pageHeading")}</h1>
        </div>

        <Suspense fallback={<CartLoading />}>{isHydrated ? <CartContent /> : <CartLoading />}</Suspense>
      </div>
    </div>
  );
}
