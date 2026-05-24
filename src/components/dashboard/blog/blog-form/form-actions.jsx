"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export function FormActions({ isPending, submitLabel, onCancel, cancelLabel }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t">
      <p className="text-xs text-muted-foreground">
        Fields marked <span className="text-destructive font-medium">*</span> are required.
      </p>
      <div className="flex items-center gap-2">
        {onCancel && (
          <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isPending} className="gap-1.5">
            <ArrowLeft className="h-3.5 w-3.5" />
            {cancelLabel || "Cancel"}
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isPending} className="gap-1.5 min-w-27.5">
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              {submitLabel || "Save Blog"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
