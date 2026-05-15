"use client";

import { TrendingUp, ShoppingCart, Users, Package, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({ title, value, icon: Icon, prefix, loading }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="text-2xl font-bold">
            {prefix}
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function StatsCards({ data, loading }) {
  const cards = [
    {
      title: "Total Revenue",
      value: data?.revenue ?? 0,
      icon: DollarSign,
      prefix: "৳",
    },
    {
      title: "Total Orders",
      value: data?.totalOrders ?? 0,
      icon: ShoppingCart,
    },
    {
      title: "Total Products",
      value: data?.totalProducts ?? 0,
      icon: Package,
    },
    {
      title: "Total Customers",
      value: data?.totalUsers ?? 0,
      icon: Users,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <StatCard key={card.title} {...card} loading={loading} />
      ))}
    </div>
  );
}
