"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/dashboard/table/table-cells";
import { Package } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  confirmed: { label: "Confirmed", className: "bg-blue-500/10 text-blue-600" },
  processing: { label: "Processing", className: "bg-indigo-500/10 text-indigo-600" },
  shipped: { label: "Shipped", className: "bg-purple-500/10 text-purple-600" },
  delivered: { label: "Delivered", className: "bg-green-500/10 text-green-600" },
  cancelled: { label: "Cancelled", className: "bg-destructive/10 text-destructive" },
  refunded: { label: "Refunded", className: "bg-rose-500/10 text-rose-600" },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive" },
};

export const RecentOrdersWidget = memo(function RecentOrdersWidget({ orders, loading, title = "Recent Orders" }) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!orders?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {orders.slice(0, 6).map((order) => (
          <div key={order._id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-xs truncate">
                  {order.orderNumber || `#${order._id?.slice(-6).toUpperCase()}`}
                </p>
                {order.user?.name && (
                  <p className="text-[10px] text-muted-foreground truncate">{order.user.name}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge value={order.status} map={STATUS_MAP} />
              <span className="font-medium text-xs tabular-nums">৳{order.total?.toLocaleString()}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
});
