"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, RotateCcw, Save, ArrowLeft } from "lucide-react";

export function ServiceFormActions({ onReset, isPending, submitLabel, onCancel, cancelLabel, showReset = true }) {
  return (
    <div>
      <Separator />
      <div className="flex items-center justify-between pt-4">
        <p className="text-xs text-muted-foreground">
          Fields marked <span className="text-destructive font-medium">*</span>{" "}
          are required.
        </p>
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
              className="gap-1.5"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {cancelLabel || "Cancel"}
            </Button>
          )}
          {onReset && showReset && (
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
          )}
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
                {submitLabel || "Save Service"}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}