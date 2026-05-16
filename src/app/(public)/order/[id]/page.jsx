"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const POLL_INTERVAL = 2000;
const POLL_TIMEOUT = 20000;

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { backendUser } = useAuth();
  const orderId = params.id;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);
  const [pollTimedOut, setPollTimedOut] = useState(false);
  const pollingRef = useRef(null);

  const isSuccess = searchParams.get("success") !== "false";
  const provider = searchParams.get("provider") || "stripe";

  useEffect(() => {
    if (!orderId || !backendUser) return;

    let mounted = true;
    let intervalId = null;
    let timeoutId = null;
    let startedAt = Date.now();

    const fetchOrder = async (isPoll = false) => {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok || !mounted) return;

        const data = await response.json();
        const fetchedOrder = data.data?.order || data.order;
        if (!mounted) return;

        setOrder(fetchedOrder);

        if (fetchedOrder.paymentStatus === "paid") {
          setPolling(false);
          if (intervalId) clearInterval(intervalId);
          if (timeoutId) clearTimeout(timeoutId);
          setLoading(false);
          return;
        }

        if (isPoll) {
          setPolling(true);
          if (Date.now() - startedAt > POLL_TIMEOUT) {
            setPollTimedOut(true);
            setPolling(false);
            setLoading(false);
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
          }
        } else {
          setLoading(false);
          if (isSuccess) {
            startedAt = Date.now();
            setPolling(true);
            timeoutId = setTimeout(() => {
              if (mounted) {
                setPollTimedOut(true);
                setPolling(false);
              }
            }, POLL_TIMEOUT);
            intervalId = setInterval(() => fetchOrder(true), POLL_INTERVAL);
          }
        }
      } catch {
        if (mounted && isPoll) {
          if (Date.now() - startedAt > POLL_TIMEOUT) {
            setPollTimedOut(true);
            setPolling(false);
            setLoading(false);
            if (intervalId) clearInterval(intervalId);
            if (timeoutId) clearTimeout(timeoutId);
          }
        } else if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrder(false);

    return () => {
      mounted = false;
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId, backendUser, isSuccess]);

  if (loading || polling) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            {polling && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 size={14} className="animate-spin" />
                Confirming payment...
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
              <h1 className="mb-2 text-2xl font-bold">Order Placed Successfully!</h1>
              <p className="mb-6 text-muted-foreground">
                Your order has been placed. Pay with cash upon delivery.
              </p>
            </>
          ) : isSuccess && isPaid ? (
            <>
              <div className="mb-4 flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
              <p className="mb-6 text-muted-foreground">
                {provider === "sslcommerz"
                  ? "Your payment via SSLCOMMERZ has been processed successfully."
                  : "Thank you for your order. Your payment has been processed."}
              </p>
            </>
          ) : pollTimedOut && !isPaid ? (
            <>
              <div className="mb-4 flex justify-center">
                <Loader2 className="h-16 w-16 text-amber-500" />
              </div>
              <h1 className="mb-2 text-2xl font-bold">Payment Processing</h1>
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
                Payment {order?.paymentStatus === "failed" ? "Failed" : "Cancelled"}
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
                <span>Order #{order.orderNumber}</span>
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
                        : "text-red-600"
                  )}
                >
                  {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentStatus?.toUpperCase()}
                </span>
              </p>
              <p className="mt-2 text-lg font-bold">Total: ৳{order.total?.toLocaleString()}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link href={`/dashboard/orders/${orderId}`}>
              <Button className="w-full">View Order Details</Button>
            </Link>
            {(!isPaid || pollTimedOut) && (
              <Link href={`/dashboard/orders/${orderId}`}>
                <Button variant="outline" className="w-full">
                  Retry Payment
                </Button>
              </Link>
            )}
            {pollTimedOut && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.reload()}
              >
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
