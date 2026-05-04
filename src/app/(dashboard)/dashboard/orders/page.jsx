"use client";

import { useEffect, useState } from "react";

import { ordersApi } from "@/lib/api/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Download, CreditCard, Eye, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingOrderId, setPayingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getOrders();
      setOrders(response.data?.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (orderId) => {
    setPayingOrderId(orderId);
    try {
      const response = await ordersApi.createPaymentLink(orderId);
      
      if (response.success && response.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl;
      } else {
        toast.success("Order payment link created! You can pay later.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Failed to create payment");
    } finally {
      setPayingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await ordersApi.cancelOrder(orderId);
      toast.success("Order cancelled");
      fetchOrders();
    } catch (error) {
      toast.error("Failed to cancel order");
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">PAID</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">PENDING</Badge>;
      case "failed":
        return <Badge className="bg-red-500">FAILED</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getOrderStatusBadge = (status) => {
    const variants = {
      pending: "outline",
      confirmed: "default",
      processing: "default",
      shipped: "default",
      delivered: "default",
      cancelled: "destructive",
      refunded: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>My Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">My Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <Link href="/items">
                <Button>Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.itemCount} items
                    </TableCell>
                    <TableCell className="font-bold">
                      ৳{order.total?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getOrderStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.paymentStatus !== "paid" && (
                          <Button
                            size="sm"
                            onClick={() => handlePayment(order._id)}
                            disabled={payingOrderId === order._id}
                          >
                            {payingOrderId === order._id ? (
                              "Processing..."
                            ) : (
                              <>
                                <CreditCard size={14} className="mr-1" />
                                Pay Now
                              </>
                            )}
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/orders/${order._id}`}>
                                <Eye size={14} className="mr-2" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            {order.paymentStatus !== "paid" && order.status !== "cancelled" && (
                              <DropdownMenuItem 
                                onClick={() => handleCancelOrder(order._id)}
                                className="text-destructive"
                              >
                                <X size={14} className="mr-2" />
                                Cancel Order
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}