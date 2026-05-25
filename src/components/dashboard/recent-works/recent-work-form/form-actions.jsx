"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function FormActions({ onCancel, isPending, submitLabel = "Save" }) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {submitLabel}
      </Button>
    </div>
  );
}
