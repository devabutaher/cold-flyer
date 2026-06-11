"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({ error, reset }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh] p-8">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold text-foreground">Dashboard Error</p>
        <p className="text-sm text-muted-foreground max-w-md">
          {error?.message || "An unexpected error occurred in the dashboard."}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
