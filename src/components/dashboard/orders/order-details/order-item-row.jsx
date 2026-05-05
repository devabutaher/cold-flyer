import Image from "next/image";
import { Box, Hash } from "lucide-react";

export function OrderItemRow({ item }) {
  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name ?? "Product"}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Box size={20} className="text-muted-foreground/40" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">
          {item.name}
        </p>
        {item.sku && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <Hash size={10} />
            {item.sku}
          </p>
        )}
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-foreground">
          ৳{item.total?.toLocaleString()}
        </p>
        <p className="text-xs text-muted-foreground">
          {item.quantity} × ৳{item.price?.toLocaleString()}
        </p>
      </div>
    </div>
  );
}