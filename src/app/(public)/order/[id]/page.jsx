"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { CheckCircle, Package } from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.id;
  const success = searchParams.get("success");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      // Check if user is logged in
      const user = getUser();
      if (!user) {
        toast.error("Please login to view your order");
        return;
      }

      // Fetch order with auth
      const response = await fetch(`/api/orders/${orderId}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrder(data.data?.order || data.order);
      }
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchOrder]);

  if (loading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="pt-8 space-y-4">
            <Skeleton className="h-16 w-16 rounded-full mx-auto" />
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
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
              <Button className="w-full">View Order Details</Button>
            </Link>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full">View All Orders</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost" className="w-full">Continue Shopping</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}