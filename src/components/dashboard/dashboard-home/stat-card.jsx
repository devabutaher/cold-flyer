"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatCard = memo(function StatCard({ title, value, icon: Icon, prefix, suffix, trend, loading, className }) {
  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">
              {prefix}
              {typeof value === "number" ? value.toLocaleString() : value}
              {suffix}
            </div>
            {trend !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center text-xs font-medium",
                  trend >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                {Math.abs(trend)}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
});
