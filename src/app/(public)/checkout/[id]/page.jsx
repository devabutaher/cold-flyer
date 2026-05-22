"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Package, CreditCard, Smartphone, Banknote, Check, Loader2, MapPin, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/providers";
import { useCart } from "@/store/cart";
import { getClient } from "@/lib/http-client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";



const inputClass =
  "flex h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

export default function CheckoutPage() {
  const params = useParams();
  const t = useTranslations("checkout");
  const PAYMENT_PROVIDERS = [
    { value: "stripe", label: t("card"), icon: CreditCard },
    { value: "sslcommerz", label: t("sslcommerz"), icon: Smartphone },
    { value: "cod", label: t("cod"), icon: Banknote },
  ];
  const router = useRouter();
  const { backendUser } = useAuth();
  const { clearCart } = useCart();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const defaultAddr = backendUser?.addresses?.find((a) => a.isDefault);
  const [shipping, setShipping] = useState({
    fullName: backendUser?.name || "",
    phone: backendUser?.phone || "",
    addressLine1: defaultAddr?.addressLine1 || "",
    addressLine2: defaultAddr?.addressLine2 || "",
    city: defaultAddr?.city || "",
    state: defaultAddr?.state || "",
    postalCode: defaultAddr?.postalCode || "",
    country: defaultAddr?.country || "Bangladesh",
  });
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [saveToProfile, setSaveToProfile] = useState(false);

  useEffect(() => {
    if (!orderId || !backendUser) return;
    getClient()
      .get(`/orders/${orderId}`)
      .then((res) => {
        const fetchedOrder = res.data?.data?.order || res.data?.order;
        setOrder(fetchedOrder);
        if (fetchedOrder?.shippingAddress?.fullName) {
          setShipping((prev) => ({ ...prev, ...fetchedOrder.shippingAddress }));
        }
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [orderId, backendUser, router]);

  const handleField = (field) => (e) => setShipping((prev) => ({ ...prev, [field]: e.target.value }));

  const handlePlaceOrder = async () => {
    if (!shipping.fullName || !shipping.phone || !shipping.addressLine1 || !shipping.city) {
      toast.error(t("fillAddress"));
      return;
    }
    setSubmitting(true);
    try {
      await getClient().patch(`/orders/${orderId}`, { shippingAddress: shipping });

      if (saveToProfile) {
        try {
          await getClient().post("/users/addresses", {
            ...shipping,
            isDefault: true,
            label: "Shipping",
          });
        } catch {}
      }

      const checkoutRes = await getClient()
        .post(`/orders/${orderId}/checkout`, { provider: paymentProvider })
        .then((r) => r.data);

      if (checkoutRes.success) {
        clearCart();
        if (checkoutRes.data?.checkoutUrl) {
          window.location.href = checkoutRes.data.checkoutUrl;
        } else {
          router.push(`/order/${orderId}?success=true&provider=${paymentProvider}`);
        }
      } else {
        toast.error(checkoutRes.message || t("checkoutFailed"));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || t("somethingWrong"));
    } finally {
      setSubmitting(false);
    }
  };

  if (!backendUser) return null;

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-3xl">
          <CardContent className="space-y-6 p-8">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <p className="text-muted-foreground">{t("orderNotFound")}</p>
      </div>
    );
  }

  const subtotal = order.subtotal || order.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const discount = order.couponDiscount || order.discount || 0;
  const shippingCost = order.shippingCost || 0;
  const tax = order.tax || 0;
  const total = order.total || subtotal - discount + shippingCost + tax;

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-10">
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft size={16} />
            Back to Cart
          </Link>
        </div>

        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("pageTitle")}</span>
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">{t("orderNumber", {number: order.orderNumber})}</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* Left: Shipping form */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="mb-5 flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <h2 className="text-lg font-bold text-foreground">{t("shippingAddress")}</h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("fullName")}</label>
                  <input className={inputClass} value={shipping.fullName} onChange={handleField("fullName")} placeholder={t("fullNamePlaceholder")} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("phone")}</label>
                  <input className={inputClass} value={shipping.phone} onChange={handleField("phone")} placeholder={t("phonePlaceholder")} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("addressLine1")}</label>
                  <input className={inputClass} value={shipping.addressLine1} onChange={handleField("addressLine1")} placeholder={t("addressLine1Placeholder")} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("addressLine2")}</label>
                  <input className={inputClass} value={shipping.addressLine2} onChange={handleField("addressLine2")} placeholder={t("addressLine2Placeholder")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("city")}</label>
                  <input className={inputClass} value={shipping.city} onChange={handleField("city")} placeholder={t("cityPlaceholder")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("state")}</label>
                  <input className={inputClass} value={shipping.state} onChange={handleField("state")} placeholder="Dhaka" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("postalCode")}</label>
                  <input className={inputClass} value={shipping.postalCode} onChange={handleField("postalCode")} placeholder={t("postalCodePlaceholder")} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("country")}</label>
                  <input className={inputClass} value={shipping.country} onChange={handleField("country")} placeholder={t("countryPlaceholder")} />
                </div>
              </div>

              <label className="mt-4 flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={saveToProfile}
                  onChange={(e) => setSaveToProfile(e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-primary"
                />
                <span className="text-xs text-muted-foreground">{t("saveAddress")}</span>
              </label>
            </div>

            {/* Order items */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("items")}</h2>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-4 py-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover rounded-lg" />
                      ) : (
                        <Package size={18} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{t("qty", {count: item.quantity})}</p>
                    </div>
                    <p className="text-sm font-semibold text-foreground">৳{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary + Payment */}
          <div className="h-fit space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("orderSummary")}</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({order.itemCount || order.items.length} items)</span>
                  <span className="font-medium text-foreground">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t("coupon", {code: order.appliedCoupon?.code || ""})}</span>
                    <span className="font-medium">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("shippingCost")}</span>
                  <span className="font-medium text-foreground">৳{shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("vat")}</span>
                  <span className="font-medium text-foreground">৳{Math.round(tax).toLocaleString()}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex items-center justify-between">
                <span className="font-bold text-foreground">{t("total")}</span>
                <span className="text-xl font-extrabold text-primary">৳{Math.round(total).toLocaleString()}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("paymentMethod")}</h2>
              <div className="grid gap-1.5">
                {PAYMENT_PROVIDERS.map((p) => {
                  const Icon = p.icon;
                  const selected = paymentProvider === p.value;
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPaymentProvider(p.value)}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition-colors",
                        selected
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground/30"
                      )}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{p.label}</span>
                      {selected && <Check size={14} className="text-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handlePlaceOrder} disabled={submitting}>
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  {t("processing")}
                </span>
              ) : (
                `Place Order - ৳${Math.round(total).toLocaleString()}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
