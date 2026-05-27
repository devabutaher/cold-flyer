"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ error, unstable_retry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 text-center">
      <h2 className="mb-4 text-3xl font-semibold">Dashboard error</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || "An unexpected error occurred in the dashboard"}
      </p>
      <div className="flex gap-4 items-center">
        <Button size="lg" onClick={() => unstable_retry()}>
          Try again
        </Button>
      </div>
    </div>
  );
}
