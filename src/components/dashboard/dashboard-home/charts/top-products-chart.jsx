"use client";

import { memo, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const config = {
  sold: { label: "Sold", color: "var(--color-chart-2)" },
};

export const TopProductsChart = memo(function TopProductsChart({ data, loading }) {
  const chartData = useMemo(
    () => (data || []).slice(0, 8).map((p) => ({
      name: p.name?.length > 20 ? p.name.slice(0, 20) + "..." : p.name,
      sold: p.totalSold || 0,
      fullName: p.name,
    })).reverse(),
    [data]
  );

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Top Products</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Top Products</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No products sold yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} width={120} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelKey="fullName" />} />
            <Bar dataKey="sold" fill="var(--color-sold)" radius={[0, 4, 4, 0]} name="sold" isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
