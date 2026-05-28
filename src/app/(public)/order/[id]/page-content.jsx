"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrderQuery, useVerifyPayment, useVerifySSLCommerzPayment } from "@/hooks/queries/orders";

const POLL_TIMEOUT = 20000;

export default function OrderSuccessPage() {
  const params = useParams();
  const t = useTranslations("order");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { backendUser } = useAuth();
  const orderId = params.id;
  const [timedOut, setTimedOut] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const verifiedRef = useRef(false);

  const isSuccess = searchParams.get("success") !== "false";
  const provider = searchParams.get("provider") || "stripe";

  const { data: order, isLoading } = useOrderQuery(orderId);
  const verifyStripe = useVerifyPayment();
  const verifySSL = useVerifySSLCommerzPayment();

  useEffect(() => {
    if (!order || verifiedRef.current || !backendUser) return;
    if (!isSuccess || order.paymentStatus === "paid") {
      verifiedRef.current = true;
      return;
    }
    verifiedRef.current = true;
    let cancelled = false;
    const doVerify = async () => {
      setVerifying(true);
      try {
        if (provider === "sslcommerz") {
          await verifySSL.mutateAsync(orderId);
        } else if (order.stripeSessionId) {
          await verifyStripe.mutateAsync({ orderId, sessionId: order.stripeSessionId });
        }
      } catch {
        // verification failure is non-fatal — polling continues
      } finally {
        if (!cancelled) setVerifying(false);
      }
    };
    doVerify();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?._id, isSuccess, backendUser]);

  useEffect(() => {
    if (!isSuccess || !order || order.paymentStatus === "paid" || order.paymentStatus === "failed") return;
    const timer = setTimeout(() => setTimedOut(true), POLL_TIMEOUT);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, order?.paymentStatus]);

  const loading = isLoading || verifying;
  const polling = !!order && isSuccess && order.paymentStatus !== "paid" && order.paymentStatus !== "failed" && !timedOut;

  if (loading || polling) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            {(polling || verifying) && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                {verifying ? t("verifying") : t("confirming")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPaid = order?.paymentStatus === "paid";

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8">
          {isSuccess && provider === "cod" ? (
            <>
              <div className="mb-4 flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">{t("orderPlaced")}</h1>
              <p className="mb-6 text-muted-foreground">{t("orderPlacedDesc")}</p>
            </>
          ) : isSuccess && isPaid ? (
            <>
              <div className="mb-4 flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">{t("paymentSuccessful")}</h1>
              <p className="mb-6 text-muted-foreground">
                {provider === "sslcommerz"
                  ? "Your payment via SSLCOMMERZ has been processed successfully."
                  : "Thank you for your order. Your payment has been processed."}
              </p>
            </>
          ) : timedOut && !isPaid ? (
            <>
              <div className="mb-4 flex justify-center">
                <Loader2 className="h-16 w-16 text-amber-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">{t("paymentProcessing")}</h1>
              <p className="mb-6 text-muted-foreground">
                Your payment is being confirmed. This can take a few moments. Please check your order status.
              </p>
            </>
          ) : (
            <>
              <div className="mb-4 flex justify-center">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">
                {order?.paymentStatus === "failed" ? t("paymentFailed") : t("paymentCancelled")}
              </h1>
              <p className="mb-6 text-muted-foreground">
                {provider === "sslcommerz"
                  ? "Your SSLCOMMERZ transaction could not be completed. Please try again."
                  : "Your payment could not be completed. Please try again."}
              </p>
            </>
          )}

          {order && (
            <div className="mb-6 rounded-lg bg-muted p-4 text-left">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package size={16} />
                <span>{t("orderLabel", { number: order.orderNumber })}</span>
              </div>
              <p className="mt-2 text-sm">
                Status:{" "}
                <span className={cn("font-medium", order.status === "cancelled" ? "text-red-600" : "text-green-600")}>
                  {order.status?.toUpperCase()}
                </span>
              </p>
              <p className="text-sm">
                Payment:{" "}
                <span
                  className={cn(
                    "font-medium",
                    order.paymentMethod === "cod"
                      ? "text-amber-600"
                      : order.paymentStatus === "paid"
                        ? "text-green-600"
                        : "text-red-600",
                  )}
                >
                  {order.paymentMethod === "cod" ? t("cashOnDelivery") : order.paymentStatus?.toUpperCase()}
                </span>
              </p>
              <p className="mt-2 text-lg font-bold">{t("total", { amount: order.total?.toLocaleString() })}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link href={`/dashboard/orders/${orderId}`}>
              <Button className="w-full">{t("viewDetails")}</Button>
            </Link>
            {(!isPaid || timedOut) && (
              <Link href={`/dashboard/orders/${orderId}`}>
                <Button variant="outline" className="w-full">
                  Retry Payment
                </Button>
              </Link>
            )}
            {timedOut && (
              <Button variant="outline" className="w-full" onClick={() => router.refresh()}>
                Refresh Status
              </Button>
            )}
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
