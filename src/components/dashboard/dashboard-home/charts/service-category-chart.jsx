"use client";

import { memo, useMemo } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_COLORS = {
  installation: "var(--color-chart-1)",
  maintenance: "var(--color-chart-2)",
  repair: "var(--color-chart-3)",
  support: "var(--color-chart-4)",
  consultation: "var(--color-chart-5)",
};

function buildConfig(dist) {
  const c = {};
  (dist || []).forEach((d) => {
    c[d._id || "unknown"] = {
      label: (d._id || "unknown").charAt(0).toUpperCase() + (d._id || "unknown").slice(1),
      color: CATEGORY_COLORS[d._id] || "var(--color-muted-foreground)",
    };
  });
  return c;
}

export const ServiceCategoryChart = memo(function ServiceCategoryChart({ data, loading }) {
  const config = useMemo(() => buildConfig(data), [data]);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Service Categories</CardTitle></CardHeader>
        <CardContent><Skeleton className="h-64 w-full" /></CardContent>
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-sm">Service Categories</CardTitle></CardHeader>
        <CardContent><p className="text-sm text-muted-foreground text-center py-16">No service data yet</p></CardContent>
      </Card>
    );
  }

  const chartData = useMemo(() => data.filter((d) => d._id), [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Service Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-64 w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Pie data={chartData} dataKey="count" nameKey="_id" innerRadius={60} strokeWidth={2} isAnimationActive={false}>
              {chartData.map((entry) => (
                <Cell key={entry._id} fill={CATEGORY_COLORS[entry._id] || "var(--color-muted-foreground)"} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
