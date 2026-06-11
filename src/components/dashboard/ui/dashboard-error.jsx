import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DashboardError({ message = "Something went wrong loading this page.", backHref, backLabel = "Go Back" }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="size-7 text-destructive" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold text-foreground">Error</p>
        <p className="text-sm text-muted-foreground max-w-md">{message}</p>
      </div>
      {backHref && (
        <Button variant="outline" size="sm" asChild>
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      )}
    </div>
  );
}
