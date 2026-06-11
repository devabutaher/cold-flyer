"use client";

import { memo, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS = {
  pending: "var(--color-chart-1)",
  confirmed: "var(--color-chart-2)",
  processing: "var(--color-chart-3)",
  shipped: "var(--color-chart-4)",
  delivered: "var(--color-chart-5)",
  cancelled: "var(--color-muted-foreground)",
  refunded: "var(--color-destructive)",
  failed: "var(--color-destructive)",
};

function buildConfig(dist) {
  const c = {};
  (dist || []).forEach((d) => {
    c[d._id] = { label: d._id.charAt(0).toUpperCase() + d._id.slice(1), color: STATUS_COLORS[d._id] || "var(--color-muted-foreground)" };
  });
  return c;
}

export const OrderPieChart = memo(function OrderPieChart({ data, title = "Order Status", loading }) {
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
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No data yet</p></CardContent>
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
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie data={data} dataKey="count" nameKey="_id" innerRadius={60} strokeWidth={2} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry._id} fill={STATUS_COLORS[entry._id] || "var(--color-muted-foreground)"} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
