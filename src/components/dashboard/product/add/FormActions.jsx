"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, RotateCcw, Save } from "lucide-react";

export function FormActions({ onReset, isPending }) {
  return (
    <div>
      <Separator />
      <div className="flex items-center justify-between pt-4">
        <p className="text-xs text-muted-foreground">
          Fields marked <span className="text-destructive font-medium">*</span>{" "}
          are required.
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onReset}
            disabled={isPending}
            className="gap-1.5"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isPending}
            className="gap-1.5 min-w-27.5"
          >
            {isPending ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                Save Product
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
