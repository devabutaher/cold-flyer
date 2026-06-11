"use client";

import { memo, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS = {
  pending: "var(--color-chart-1)",
  confirmed: "var(--color-chart-2)",
  scheduled: "var(--color-chart-3)",
  in_progress: "var(--color-chart-4)",
  completed: "var(--color-chart-5)",
  cancelled: "var(--color-muted-foreground)",
};

const statusTickFormatter = (v) => v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

function buildConfig(data) {
  const c = {};
  (data || []).forEach((d) => {
    const label = d._id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
    c[d._id] = { label, color: STATUS_COLORS[d._id] || "var(--color-muted-foreground)" };
  });
  return c;
}

export const BookingBarChart = memo(function BookingBarChart({ data, title = "Bookings by Status", loading }) {
  const config = useMemo(() => buildConfig(data), [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">{title}</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No booking data yet</p></CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="_id" tickLine={false} axisLine={false} tickMargin={8} fontSize={11}
              tickFormatter={statusTickFormatter} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} fontSize={11} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry._id} fill={STATUS_COLORS[entry._id] || "var(--color-muted-foreground)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
