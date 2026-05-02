"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityInput({ quantity, min = 1, onChange }) {
  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1">
      <button
        onClick={() => onChange(Math.max(min, quantity - 1))}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <Minus size={13} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums text-foreground">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <Plus size={13} />
      </button>
    </div>
  );
}