"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCancelOrder, useOrderQuery } from "@/hooks/queries/orders";
import { getClient } from "@/lib/http-client";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Download,
  Loader2,
  MapPin,
  Package,
  ReceiptText,
  Smartphone,
  Truck,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrderDetailSkeleton } from "./order-detail-skeleton";
import { OrderItemRow } from "./order-item-row";
import { PriceRow } from "./price-row";
import { StatusPill } from "./status-pill";

const ORDER_STATUS = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600 border-blue-200" },
  processing: { label: "Processing", className: "bg-indigo-500/10 text-indigo-600 border-indigo-200" },
  shipped: { label: "Shipped", className: "bg-primary/10 text-primary border-primary/20" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600 border-green-200" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive border-destructive/20" },
  refunded: { label: "Refunded", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const PAYMENT_STATUS = {
  paid: { label: "Paid", className: "bg-green-500/10 text-green-600 border-green-200" },
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600 border-amber-200" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
  refunded: { label: "Refunded", className: "bg-destructive/10 text-destructive border-destructive/20" },
  partially_refunded: { label: "Partial Refund", className: "bg-orange-500/10 text-orange-600 border-orange-200" },
};

export function OrderDetails({ orderId }) {
  const router = useRouter();
  const { data: order, isLoading, isError, error, refetch } = useOrderQuery(orderId);
  const cancelOrder = useCancelOrder();
  const [paying, setPaying] = useState(false);

  if (isLoading) return <OrderDetailSkeleton />;

  if (isError) {
    return (
      <div className="py-16 text-center">
        <Package size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-destructive mb-2">Failed to load order details.</p>
        <p className="text-xs text-muted-foreground mb-4">{error?.message || "An unexpected error occurred."}</p>
        <Button asChild size="sm">
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <Package size={48} className="mx-auto mb-4 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground mb-4">Order not found.</p>
        <Button asChild size="sm">
          <Link href="/dashboard/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  const handlePayment = async (provider = "stripe") => {
    setPaying(true);
    try {
      const res = await getClient()
        .post(`/orders/${orderId}/checkout`, { provider })
        .then((r) => r.data);
      if (res.success && res.data?.checkoutUrl) {
        router.push(res.data.checkoutUrl);
      }
    } catch {
      console.error("Failed to create payment");
      toast.error("Failed to initiate payment. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync({ orderId, reason: "Customer request" });
      refetch();
    } catch {
      console.error("Failed to cancel order");
      toast.error("Failed to cancel order. Please try again.");
    }
  };

  const downloadInvoice = async () => {
    try {
      const [{ default: InvoiceDoc }, { pdf }] = await Promise.all([
        import("@/components/dashboard/orders/invoice-pdf"),
        import("@react-pdf/renderer"),
      ]);
      const blob = await pdf(<InvoiceDoc order={order} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.orderNumber ?? order._id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      console.error("Failed to generate invoice");
      toast.error("Failed to generate invoice.");
    }
  };

  const canPay = order.paymentMethod !== "cod" && order.paymentStatus !== "paid" && order.status !== "cancelled";
  const canCancel = canPay || order.paymentMethod === "cod";
  const orderRef = order.orderNumber ?? `#${order._id?.slice(-8).toUpperCase()}`;

  return (
    <div className="max-w-5xl">
      <div className="mb-7 flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0 rounded-lg" asChild>
          <Link href="/dashboard/orders">
            <ArrowLeft size={16} />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div className="min-w-0">
          <h1 className="text-lg font-semibold tracking-tight truncate">Order {orderRef}</h1>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays size={11} />
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>·</span>
            <StatusPill value={order.status} map={ORDER_STATUS} />
            <StatusPill value={order.paymentStatus} map={PAYMENT_STATUS} />
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <Package size={15} className="text-primary" />
                Order Items
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  {order.items?.length ?? 0} {order.items?.length === 1 ? "item" : "items"}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="divide-y divide-border">
                {order.items?.map((item, i) => (
                  <OrderItemRow key={item._id ?? i} item={item} />
                ))}
              </div>
            </CardContent>
          </Card>

          {order.shippingAddress && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <MapPin size={15} className="text-primary" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-muted-foreground space-y-0.5">
                {order.shippingAddress.fullName && (
                  <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                )}
                {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                {order.shippingAddress.address && (
                  <p>{order.shippingAddress.address}</p>
                )}
                {(order.shippingAddress.thana || order.shippingAddress.district) && (
                  <p>
                    {[order.shippingAddress.thana, order.shippingAddress.district].filter(Boolean).join(", ")}
                  </p>
                )}
                {order.shippingAddress.instructions && (
                  <p className="mt-1 text-xs italic">Note: {order.shippingAddress.instructions}</p>
                )}
              </CardContent>
            </Card>
          )}

          {order.trackingNumber && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Truck size={15} className="text-primary" />
                  Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <p className="font-mono text-muted-foreground">{order.trackingNumber}</p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-primary text-xs hover:underline"
                  >
                    Track shipment →
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-5">
          {order.user && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <User size={15} className="text-primary" />
                  Customer
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm space-y-1">
                <p className="font-medium">{order.user.name || "—"}</p>
                {order.user.email && (
                  <p className="text-muted-foreground">{order.user.email}</p>
                )}
                {order.user.phone && (
                  <p className="text-muted-foreground">{order.user.phone}</p>
                )}
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                <ReceiptText size={15} className="text-primary" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <PriceRow label="Subtotal" value={`৳${order.subtotal?.toLocaleString()}`} muted />
              {order.discount > 0 && (
                <PriceRow label="Discount" value={`−৳${order.discount?.toLocaleString()}`} className="text-green-600" />
              )}
              {order.couponDiscount > 0 && (
                <PriceRow
                  label="Coupon"
                  value={`−৳${order.couponDiscount?.toLocaleString()}`}
                  className="text-green-600"
                />
              )}
              <PriceRow
                label="Shipping"
                value={order.shippingCost > 0 ? `৳${order.shippingCost?.toLocaleString()}` : "Free"}
                muted
              />
              <PriceRow label="Tax" value={`৳${order.tax?.toFixed(2)}`} muted />
              <Separator className="my-1" />
              <PriceRow label="Total" value={`৳${order.total?.toLocaleString()}`} highlight />
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Button variant="outline" className="w-full gap-2" onClick={downloadInvoice}>
              <Download size={14} />
              Download Invoice
            </Button>

            {order.paymentMethod === "cod" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-sm text-amber-700">
                Cash on Delivery — pay when you receive your order
              </div>
            )}

            {canPay && (
              <div className="space-y-2">
                <Button className="w-full gap-2" onClick={() => handlePayment("stripe")} disabled={paying}>
                  {paying ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                  {paying ? "Processing…" : "Pay with Card (Stripe)"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => handlePayment("sslcommerz")}
                  disabled={paying}
                >
                  {paying ? <Loader2 size={14} className="animate-spin" /> : <Smartphone size={14} />}
                  {paying ? "Processing…" : "Pay with SSLCOMMERZ (bKash/Nagad)"}
                </Button>
              </div>
            )}

            {canCancel && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                  >
                    <X size={14} />
                    Cancel Order
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Order <strong>{orderRef}</strong> will be permanently cancelled.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Order</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      onClick={handleCancel}
                      disabled={cancelOrder.isPending}
                    >
                      {cancelOrder.isPending ? "Cancelling…" : "Cancel Order"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
