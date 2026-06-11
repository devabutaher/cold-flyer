"use client";

import { memo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const config = {
  total: { label: "Sales", color: "var(--color-primary)" },
};

const xTickFormatter = (v) => v?.slice(5) || "";
const yTickFormatter = (v) => `৳${(v / 1000).toFixed(0)}k`;

export const DailySalesBarChart = memo(function DailySalesBarChart({ data, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Daily Sales</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Daily Sales</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No sales data yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Daily Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="_id" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} tickFormatter={xTickFormatter} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} tickFormatter={yTickFormatter} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[4, 4, 0, 0]} name="total" isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
