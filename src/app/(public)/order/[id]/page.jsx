"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2, ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id;
  const success = searchParams.get("success");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyAndFetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      if (success === "true") {
        await ordersApi.verifyPayment(orderId, null);
      }
      const response = await ordersApi.getOrderById(orderId);
      setOrder(response.data?.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId, success]);

  useEffect(() => {
    if (orderId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      verifyAndFetchOrder();
    }
  }, [orderId, verifyAndFetchOrder]);

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center py-12">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="mb-2 text-2xl font-bold">Payment Successful!</h1>
          <p className="mb-6 text-muted-foreground">
            Thank you for your order. Your payment has been processed.
          </p>

          {order && (
            <div className="mb-6 rounded-lg bg-muted p-4 text-left">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package size={16} />
                <span>Order #{order.orderNumber}</span>
              </div>
              <p className="mt-2 text-sm">
                Status: <span className="font-medium text-green-600">{order.status?.toUpperCase()}</span>
              </p>
              <p className="text-sm">
                Payment: <span className="font-medium text-green-600">{order.paymentStatus?.toUpperCase()}</span>
              </p>
              <p className="mt-2 text-lg font-bold">Total: ৳{order.total?.toLocaleString()}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Link href={`/dashboard/orders/${orderId}`}>
              <Button className="w-full">
                View Order Details
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
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