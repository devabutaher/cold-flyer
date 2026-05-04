"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { ordersApi } from "@/lib/api/orders";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, CreditCard, ArrowLeft, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id;
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await ordersApi.getOrderById(orderId);
      setOrder(response.data?.order);
    } catch (error) {
      console.error("Failed to fetch order:", error);
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setPaying(true);
    try {
      const response = await ordersApi.createPaymentLink(orderId);

      if (response.success && response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.success("Payment link created!");
      }
    } catch (error) {
      toast.error("Failed to create payment");
    } finally {
      setPaying(false);
    }
  };

  const handleCancelOrder = async () => {
    try {
      await ordersApi.cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrder();
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const downloadInvoice = async () => {
    try {
      const MyDocument = (await import("@/components/orders/invoice-pdf"))
        .default;
      const { pdf } = await import("@react-pdf/renderer");

      const blob = await pdf(<MyDocument order={order} user={user} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.orderNumber || order._id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF error:", error);
      toast.error("Failed to generate invoice");
    }
  };

  if (loading) {
    return (
      <div className="container py-8 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-8 text-center">
        <p>Order not found</p>
        <Link href="/dashboard/orders">
          <Button className="mt-4">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">
            #{order.orderNumber || order._id}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-12 w-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{item.name}</p>
                            {item.sku && (
                              <p className="text-xs text-muted-foreground">
                                SKU: {item.sku}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell className="text-right">
                        ৳{item.price?.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ৳{item.total?.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={
                    order.status === "cancelled" ? "destructive" : "default"
                  }
                >
                  {order.status?.toUpperCase()}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment</span>
                <Badge
                  variant={
                    order.paymentStatus === "paid" ? "default" : "outline"
                  }
                >
                  {order.paymentStatus?.toUpperCase()}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>৳{order.subtotal?.toLocaleString()}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-৳{order.discount?.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>
                    {order.shippingCost > 0
                      ? `৳${order.shippingCost?.toLocaleString()}`
                      : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>৳{order.tax?.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>৳{order.total?.toLocaleString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                <Button className="w-full" onClick={downloadInvoice}>
                  <Download size={16} className="mr-2" />
                  Download Invoice
                </Button>

                {order.paymentStatus !== "paid" &&
                  order.status !== "cancelled" && (
                    <>
                      <Button
                        className="w-full"
                        onClick={handlePayment}
                        disabled={paying}
                      >
                        <CreditCard size={16} className="mr-2" />
                        {paying ? "Processing..." : "Pay Now"}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full text-destructive"
                        onClick={handleCancelOrder}
                      >
                        <X size={16} className="mr-2" />
                        Cancel Order
                      </Button>
                    </>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Order Date */}
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Order placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
