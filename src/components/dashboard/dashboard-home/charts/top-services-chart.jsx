"use client";

import { memo, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const config = {
  count: { label: "Bookings", color: "var(--color-chart-2)" },
};

export const TopServicesChart = memo(function TopServicesChart({ data, loading }) {
  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Top Services</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Top Services</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No service bookings yet</p></CardContent>
      </Card>
    );
  }

  const chartData = useMemo(
    () => data.slice(0, 8).map((s) => ({
      name: s._id && s._id.length > 20 ? s._id.slice(0, 20) + "..." : s._id || "Unknown",
      count: s.count || 0,
      fullName: s._id || "Unknown",
    })).reverse(),
    [data]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Top Services</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <BarChart data={chartData} layout="vertical" margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} width={130} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" labelKey="fullName" />} />
            <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} name="count" isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
