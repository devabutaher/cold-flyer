"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";

export function RecentOrders({ orders, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
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
        <CardHeader><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">No orders yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Recent Orders</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {orders.slice(0, 5).map((order) => (
          <div
            key={order._id}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 shrink-0">
                <Package className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="font-mono text-xs truncate">
                {order.orderNumber || `#${order._id?.slice(-6).toUpperCase()}`}
              </span>
            </div>
            <span className="font-medium">৳{order.total?.toLocaleString()}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function TopProducts({ products, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Top Products</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!products?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Top Products</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">No products sold yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader><CardTitle className="text-sm">Top Products</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        {products.slice(0, 5).map((product, i) => (
          <div
            key={product._id}
            className="flex items-center justify-between text-sm"
          >
            <span className="truncate flex-1">
              <span className="font-medium text-muted-foreground mr-2">#{i + 1}</span>
              {product.name}
            </span>
            <span className="text-muted-foreground text-xs">{product.totalSold || 0} sold</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
