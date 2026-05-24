"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronLeft, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { DISTRICTS, THANAS } from "@/data/bd-addresses";
import { getClient } from "@/lib/http-client";
import { useAuth } from "@/components/providers";
import { useCart } from "@/store/cart";
import { AddressFormSheet } from "@/components/dashboard/profile/address-form-sheet";
import {
  getAddressesAction, deleteAddressAction, setDefaultAddressAction,
} from "@/lib/actions/user";
import { AddressPicker } from "@/components/checkout/address-picker";
import { OrderItemsList } from "@/components/checkout/order-items-list";
import { PaymentMethodSelector } from "@/components/checkout/payment-method-selector";
import { OrderSummary } from "@/components/checkout/order-summary";

export function CheckoutPage({ orderId }) {
  const router = useRouter();
  const t = useTranslations("checkout");
  const { backendUser, refreshUser } = useAuth();
  const { clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [couponInput, setCouponInput] = useState("");
  const [couponUpdating, setCouponUpdating] = useState(false);

  const addresses = useMemo(() => backendUser?.addresses || [], [backendUser?.addresses]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const effectiveSelectedId = useMemo(
    () => selectedAddressId || addresses.find((a) => a.isDefault)?._id || addresses[0]?._id || null,
    [selectedAddressId, addresses],
  );
  const selectedAddress = useMemo(
    () => addresses.find((a) => a._id === effectiveSelectedId) || null,
    [addresses, effectiveSelectedId],
  );

  useEffect(() => {
    if (!orderId || !backendUser) return;
    getClient()
      .get(`/orders/${orderId}`)
      .then((res) => {
        const fetchedOrder = res.data?.data?.order || res.data?.order;
        setOrder(fetchedOrder);
      })
      .catch(() => router.push("/"))
      .finally(() => setLoading(false));
  }, [orderId, backendUser, router]);

  async function handleAddressSaved() {
    const result = await getAddressesAction();
    if (result.success && result.addresses.length > 0) {
      const last = result.addresses[result.addresses.length - 1];
      setSelectedAddressId(last._id);
    }
    await refreshUser();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    const result = await deleteAddressAction(deleteId);
    setDeleting(false);
    if (result.success) {
      toast.success("Address deleted");
      setDeleteId(null);
      if (effectiveSelectedId === deleteId) setSelectedAddressId(null);
      await refreshUser();
    } else {
      toast.error(result.message || "Failed to delete address");
    }
  }

  async function handleSetDefault(id) {
    const result = await setDefaultAddressAction(id);
    if (result.success) {
      toast.success("Default address updated");
      setSelectedAddressId(id);
      await refreshUser();
    } else {
      toast.error(result.message || "Failed to set default");
    }
  }

  function openAddSheet() {
    setEditingAddress(null);
    setAddressSheetOpen(true);
  }

  async function handleApplyCoupon() {
    if (!couponInput.trim()) return;
    setCouponUpdating(true);
    try {
      const lookup = await getClient().get(`/coupons/lookup/${couponInput}`).then((r) => r.data);
      if (!lookup.success || !lookup.data?.coupon) {
        throw new Error(t("invalidCoupon"));
      }
      const couponInfo = lookup.data.coupon;
      if (couponInfo.minOrderValue > 0 && (order?.subtotal || 0) < couponInfo.minOrderValue) {
        throw new Error(`Minimum order of ৳${couponInfo.minOrderValue.toLocaleString()} required`);
      }
      const res = await getClient().patch(`/orders/${orderId}/coupon`, { couponCode: couponInput }).then((r) => r.data);
      if (res.success) {
        setOrder(res.data.order);
        setCouponInput("");
        toast.success(t("couponApplied"));
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || t("invalidCoupon");
      toast.error(msg);
    } finally {
      setCouponUpdating(false);
    }
  }

  async function handleRemoveCoupon() {
    setCouponUpdating(true);
    try {
      const res = await getClient().patch(`/orders/${orderId}/coupon`, { removeCoupon: true }).then((r) => r.data);
      if (res.success) {
        setOrder(res.data.order);
        toast.success(t("couponRemoved"));
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || t("somethingWrong"));
    } finally {
      setCouponUpdating(false);
    }
  }

  async function handlePlaceOrder() {
    if (!selectedAddress) {
      toast.error(t("fillAddress"));
      return;
    }
    const addr = selectedAddress;
    const districtName = DISTRICTS.find((d) => d.id === addr.district)?.name || addr.district;
    const thanaName = THANAS.find((t) => t.id === addr.thana)?.name || addr.thana;
    const orderAddress = {
      fullName: addr.fullName,
      phone: addr.phone,
      district: districtName,
      thana: thanaName,
      address: addr.address,
      instructions: addr.instructions || undefined,
    };

    setSubmitting(true);
    try {
      await getClient().patch(`/orders/${orderId}`, { shippingAddress: orderAddress });
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
  }

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
          <h1 className="mt-1 text-2xl font-extrabold text-foreground sm:text-3xl">
            {t("orderNumber", { number: order.orderNumber })}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <AddressPicker
                addresses={addresses}
                effectiveSelectedId={effectiveSelectedId}
                onSelect={(id) => setSelectedAddressId(id)}
                onAdd={openAddSheet}
                onEdit={(a) => { setEditingAddress(a); setAddressSheetOpen(true); }}
                onDelete={(id) => setDeleteId(id)}
                onSetDefault={handleSetDefault}
              />
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">Coupon</h2>
              {order.appliedCoupon ? (
                <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-green-700">{order.appliedCoupon.code}</span>
                      <span className="ml-2 text-xs text-green-600">
                        {order.appliedCoupon.discountType === "percentage"
                          ? `${order.appliedCoupon.discountValue}% off`
                          : order.appliedCoupon.discountType === "fixed"
                            ? `৳${order.appliedCoupon.discountValue} off`
                            : "Free shipping"}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleRemoveCoupon} disabled={couponUpdating} className="text-destructive hover:text-destructive h-8">
                    {couponUpdating ? <Loader2 size={14} className="animate-spin" /> : t("removeCoupon")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder={t("couponPlaceholder")}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent pl-9 pr-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    />
                  </div>
                  <Button size="sm" onClick={handleApplyCoupon} disabled={!couponInput.trim() || couponUpdating} className="h-9 shrink-0">
                    {couponUpdating ? <Loader2 size={14} className="animate-spin" /> : t("applyCoupon")}
                  </Button>
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("items")}</h2>
              <OrderItemsList items={order.items} />
            </div>
          </div>

          <div className="h-fit space-y-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-bold text-foreground">{t("paymentMethod")}</h2>
              <PaymentMethodSelector value={paymentProvider} onChange={setPaymentProvider} />
            </div>
            <OrderSummary
              order={order}
              submitting={submitting}
              selectedAddress={selectedAddress}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>

      <AddressFormSheet
        key={editingAddress?._id || "new"}
        open={addressSheetOpen}
        onOpenChange={setAddressSheetOpen}
        address={editingAddress}
        onSaved={handleAddressSaved}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete address?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
