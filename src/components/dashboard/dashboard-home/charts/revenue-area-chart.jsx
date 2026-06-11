"use client";

import { memo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const config = {
  revenue: { label: "Revenue", color: "var(--color-primary)" },
};

const yTickFormatter = (v) => `৳${(v / 1000).toFixed(0)}k`;

export const RevenueAreaChart = memo(function RevenueAreaChart({ data, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Revenue Trend</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Revenue Trend</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No revenue data yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="_id" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} tickFormatter={yTickFormatter} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area dataKey="total" type="monotone" fill="url(#fillRevenue)" stroke="var(--color-revenue)" strokeWidth={2} name="revenue" isAnimationActive={false} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
